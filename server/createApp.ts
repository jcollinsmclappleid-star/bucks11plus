import express, { type Express, type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { seedDatabase, ensureNvrGeneratorReseeds } from "./seed";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { getBaseUrl } from "./contactConfig";
import { seedStripeProducts } from "./stripeProducts";
import { ensureStripeBranding } from "./stripeBranding";
import { processNurtureQueue } from "./leadMagnet";
import { runEmailTriggers } from "./email";
import { runRetentionSweep } from "./retention";
import { ensureChromium } from "./chromium";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const isVercel = process.env.VERCEL === "1";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const SENSITIVE_LOG_KEYS = new Set([
  "password",
  "email",
  "username",
  "childName",
  "child_name",
  "name",
  "stripeCustomerId",
  "stripe_customer_id",
  "passwordResetToken",
  "password_reset_token",
  "passwordResetExpires",
  "password_reset_expires",
  "token",
  "secret",
  "authorization",
  "cookie",
  "metadata",
  "rawBody",
]);

function redactForLog(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[Truncated]";
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    if (value.length > 20) return `[Array(${value.length})]`;
    return value.map((v) => redactForLog(v, depth + 1));
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_LOG_KEYS.has(k)) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = redactForLog(v, depth + 1);
    }
  }
  return out;
}

async function initStripe() {
  if (isVercel) {
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("DATABASE_URL not set, skipping Stripe init");
    return;
  }

  try {
    console.log("Initializing Stripe schema...");
    await runMigrations({ databaseUrl, schema: "stripe" });
    console.log("Stripe schema ready");

    const stripeSync = await getStripeSync();
    const webhookUrl = `${getBaseUrl()}/api/stripe/webhook`;

    try {
      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString: databaseUrl });
      await pool.query(`DELETE FROM stripe._managed_webhooks WHERE url != $1`, [webhookUrl]);
      await pool.end();
      const result = await stripeSync.findOrCreateManagedWebhook(webhookUrl);
      console.log(`Webhook configured: ${result?.webhook?.url || webhookUrl}`);
    } catch (webhookErr: any) {
      console.warn("Webhook registration skipped:", webhookErr.message);
      console.warn(`Register manually in Stripe Dashboard: ${webhookUrl}`);
    }

    try {
      await seedStripeProducts();
    } catch (productErr: any) {
      console.warn("Stripe product seed skipped:", productErr.message);
    }

    try {
      await ensureStripeBranding();
    } catch (brandErr: any) {
      console.warn("Stripe branding skipped:", brandErr.message);
    }

    try {
      await stripeSync.syncBackfill();
      console.log("Stripe data synced");
    } catch (syncErr: any) {
      console.error("Error syncing Stripe data:", syncErr.message);
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
  }
}

function authorizeCron(req: Request, res: Response): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    res.status(503).json({ message: "CRON_SECRET not configured" });
    return false;
  }
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${secret}`) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}

let bootPromise: Promise<void> | null = null;

function bootOnce(): Promise<void> {
  if (!bootPromise) {
    bootPromise = (async () => {
      const tasks: Promise<unknown>[] = [seedDatabase()];

      if (!isVercel) {
        tasks.unshift(initStripe());
        tasks.push(ensureNvrGeneratorReseeds());
        tasks.push(
          ensureChromium().then(() => {
            return import("./leadMagnet").then(({ getCachedPracticePaperPdf, getCachedPracticePaper2Pdf }) => {
              getCachedPracticePaperPdf().catch((err) =>
                console.error("[PDF] Paper 1 cache warm failed:", err?.message ?? err),
              );
              getCachedPracticePaper2Pdf().catch((err) =>
                console.error("[PDF] Paper 2 cache warm failed:", err?.message ?? err),
              );
            });
          }),
        );
      }

      await Promise.allSettled(tasks);
    })();
  }
  return bootPromise;
}

export async function createApp(): Promise<{ app: Express; httpServer: Server }> {
  const bootReady = bootOnce();

  const app = express();
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const signature = req.headers["stripe-signature"];
      if (!signature) return res.status(400).json({ error: "Missing signature" });

      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;
        if (!Buffer.isBuffer(req.body)) {
          console.error("STRIPE WEBHOOK ERROR: req.body is not a Buffer");
          return res.status(500).json({ error: "Webhook processing error" });
        }
        await WebhookHandlers.processWebhook(req.body as Buffer, sig);
        res.status(200).json({ received: true });
      } catch (error: any) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ error: "Webhook processing error" });
      }
    },
  );

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          try {
            const safeBody = redactForLog(capturedJsonResponse);
            let serialised = JSON.stringify(safeBody);
            if (serialised.length > 500) serialised = serialised.slice(0, 497) + "...";
            logLine += ` :: ${serialised}`;
          } catch {
            // ignore
          }
        }
        log(logLine);
      }
    });

    next();
  });

  app.use(async (req, res, next) => {
    if (req.path === "/api/health") return next();
    try {
      await bootReady;
      next();
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  // Vercel Cron replacements for background intervals
  app.get("/api/cron/nurture", async (req, res, next) => {
    try {
      if (!authorizeCron(req, res)) return;
      await processNurtureQueue();
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/cron/email-triggers", async (req, res, next) => {
    try {
      if (!authorizeCron(req, res)) return;
      await runEmailTriggers();
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/cron/retention", async (req, res, next) => {
    try {
      if (!authorizeCron(req, res)) return;
      await runRetentionSweep();
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  return { app, httpServer };
}

export async function createHttpServer(): Promise<{ app: Express; httpServer: Server }> {
  const { app, httpServer } = await createApp();

  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  return { app, httpServer };
}

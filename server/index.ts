import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import os from "os";
import { registerRoutes } from "./routes";
import { startNurtureProcessor } from "./leadMagnet";
import { serveStatic } from "./static";
import { createServer } from "http";
import { seedDatabase, ensureNvrGeneratorReseeds } from "./seed";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { runEmailTriggers } from "./email";
import { ensureChromium } from "./chromium";
import { runRetentionSweep } from "./retention";
import { getBaseUrl } from "./contactConfig";
import { seedStripeProducts } from "./stripeProducts";

const app = express();
const httpServer = createServer(app);

// Trust Replit's reverse proxy so secure session cookies work in production
app.set("trust proxy", 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Health check (no auth required — used by monitoring/deployment)
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL not set, skipping Stripe init');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ databaseUrl, schema: 'stripe' });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    const webhookBase = getBaseUrl();
    const webhookUrl = `${webhookBase}/api/stripe/webhook`;

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
      await stripeSync.syncBackfill();
      console.log('Stripe data synced');
    } catch (syncErr: any) {
      console.error('Error syncing Stripe data:', syncErr.message);
    }
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) return res.status(400).json({ error: 'Missing signature' });

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Field names whose values we never want to surface in application logs.
// Stripping these protects PII and credentials even when a route happens to
// echo the user record back in a response.
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
          // Body was un-serialisable — drop it from the log rather than leak it
        }
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);
  startNurtureProcessor();

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: os.platform() === "linux",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );

  // Run background tasks after the server is already listening so startup
  // latency never blocks incoming requests
  ensureChromium().then(() => {
    import("./leadMagnet")
      .then(({ getCachedPracticePaperPdf, getCachedPracticePaper2Pdf }) => {
        getCachedPracticePaperPdf().catch((err) =>
          console.error("[PDF] Paper 1 cache warm failed:", err?.message ?? err),
        );
        getCachedPracticePaper2Pdf().catch((err) =>
          console.error("[PDF] Paper 2 cache warm failed:", err?.message ?? err),
        );
      })
      .catch((err) => console.error("[PDF] leadMagnet import failed:", err?.message ?? err));
  }).catch((err) => console.error("[Chrome] ensureChromium failed:", err?.message ?? err));
  initStripe().catch(err => console.error('Stripe init error:', err));
  seedDatabase().catch(err => console.error("Seed error:", err));
  ensureNvrGeneratorReseeds().catch(err => console.error("NVR reseed error:", err));

  // Run email nudge triggers every 6 hours (first run 5 mins after startup)
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  setTimeout(() => {
    runEmailTriggers().catch(err => console.error("Email trigger error:", err));
    setInterval(() => {
      runEmailTriggers().catch(err => console.error("Email trigger error:", err));
    }, SIX_HOURS);
  }, 5 * 60 * 1000);

  // GDPR retention sweep: delete dormant accounts and prune old email logs.
  // First run 10 minutes after boot so it never blocks startup; then weekly.
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  setTimeout(() => {
    runRetentionSweep().catch(err => console.error("Retention sweep error:", err));
    setInterval(() => {
      runRetentionSweep().catch(err => console.error("Retention sweep error:", err));
    }, ONE_WEEK);
  }, 10 * 60 * 1000);
})();

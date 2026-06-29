import { runMigrations } from "stripe-replit-sync";
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { getBaseUrl } from "./contactConfig";
import { ensureStripeBranding } from "./stripeBranding";
import { seedStripeProducts } from "./stripeProducts";

const PRODUCTION_WEBHOOK_PATH = "/api/stripe/webhook";

export async function initStripeCore(options: { forceBranding?: boolean } = {}): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[Stripe Init] DATABASE_URL not set — skipping");
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    console.warn("[Stripe Init] STRIPE_SECRET_KEY not set — skipping");
    return;
  }

  const webhookUrl = `${getBaseUrl()}${PRODUCTION_WEBHOOK_PATH}`;
  console.log(`[Stripe Init] Base URL: ${getBaseUrl()}`);
  console.log(`[Stripe Init] Webhook URL: ${webhookUrl}`);

  await runMigrations({ databaseUrl, schema: "stripe" } as Parameters<typeof runMigrations>[0]);
  console.log("[Stripe Init] Stripe schema migrations complete");

  const stripeSync = await getStripeSync();
  const enabledEvents = stripeSync.getSupportedEventTypes();
  const webhook = await stripeSync.findOrCreateManagedWebhook(webhookUrl, {
    enabled_events: enabledEvents,
    description: "Bucks 11 Plus Tests — subscriptions & billing sync",
  });
  console.log(`[Stripe Init] Webhook ready: ${webhook.url} (${webhook.status})`);

  await ensureStripeBranding(options.forceBranding ?? false);

  try {
    await seedStripeProducts();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[Stripe Init] Product seed skipped:", message);
  }
}

export async function listStripeWebhookStatus(): Promise<{
  productionUrl: string;
  endpoints: Array<{ id: string; url: string; status: string; enabledEvents: number }>;
}> {
  const stripe = await getUncachableStripeClient();
  const productionUrl = `${getBaseUrl()}${PRODUCTION_WEBHOOK_PATH}`;
  const listed = await stripe.webhookEndpoints.list({ limit: 100 });
  return {
    productionUrl,
    endpoints: listed.data.map((ep) => ({
      id: ep.id,
      url: ep.url,
      status: ep.status,
      enabledEvents: ep.enabled_events?.length ?? 0,
    })),
  };
}

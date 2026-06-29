#!/usr/bin/env npx tsx
/**
 * Webhook health check for Bucks 11 Plus production.
 * Usage: BASE_URL=https://bucks11plustest.co.uk npx tsx --env-file=.env.local scripts/test-stripe-webhook.ts
 */
import pg from "pg";
import Stripe from "stripe";
import { getUncachableStripeClient, getStripeSync } from "../server/stripeClient";
import { getBaseUrl } from "../server/contactConfig";

const WEBHOOK_PATH = "/api/stripe/webhook";

const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
];

async function getManagedWebhookSecret(webhookUrl: string): Promise<string | null> {
  const explicit = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (explicit) return explicit;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const pool = new pg.Pool({ connectionString: databaseUrl });
  try {
    const result = await pool.query(
      `SELECT secret FROM stripe._managed_webhooks WHERE url = $1 LIMIT 1`,
      [webhookUrl],
    );
    return (result.rows[0]?.secret as string) ?? null;
  } finally {
    await pool.end();
  }
}

async function main() {
  const webhookUrl = `${getBaseUrl()}${WEBHOOK_PATH}`;
  const stripe = await getUncachableStripeClient();
  const stripeSync = await getStripeSync();

  console.log("═".repeat(60));
  console.log("  Stripe webhook test — Bucks 11 Plus");
  console.log("═".repeat(60));
  console.log(`Target: ${webhookUrl}\n`);

  let passed = 0;
  let failed = 0;

  function pass(msg: string) {
    passed++;
    console.log(`✓ ${msg}`);
  }
  function fail(msg: string) {
    failed++;
    console.log(`✗ ${msg}`);
  }
  function warn(msg: string) {
    console.log(`⚠ ${msg}`);
  }

  // 1. Stripe registration
  const listed = await stripe.webhookEndpoints.list({ limit: 100 });
  const endpoint = listed.data.find((ep) => ep.url === webhookUrl);

  if (!endpoint) {
    fail(`No Stripe endpoint for ${webhookUrl}`);
    console.log("\nRun: BASE_URL=https://bucks11plustest.co.uk npm run stripe:setup");
    process.exit(1);
  } else {
    pass(`Stripe endpoint registered (${endpoint.id}, ${endpoint.status})`);
    const missing = REQUIRED_EVENTS.filter((e) => !endpoint.enabled_events?.includes(e));
    if (missing.length) warn(`Missing events: ${missing.join(", ")}`);
    else pass("Critical subscription events enabled");
  }

  // 2. DB managed record + signing secret
  const managed = await stripeSync.getManagedWebhookByUrl(webhookUrl);
  const secret = await getManagedWebhookSecret(webhookUrl);
  if (managed) pass(`Managed webhook in database (${managed.id})`);
  else warn("No managed webhook DB record");

  if (!secret) {
    fail("No signing secret in database or STRIPE_WEBHOOK_SECRET");
    process.exit(1);
  }
  pass(`Signing secret available (${secret.slice(0, 12)}…)`);

  // 3. Route reachability
  const unsignedRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  const unsignedBody = await unsignedRes.text();
  if (unsignedRes.status === 400 && unsignedBody.includes("signature")) {
    pass("Route rejects unsigned requests");
  } else {
    fail(`Unexpected unsigned response: HTTP ${unsignedRes.status} — ${unsignedBody.slice(0, 80)}`);
  }

  // 4. Signature verification (local)
  const probePayload = JSON.stringify({
    id: `evt_probe_${Date.now()}`,
    object: "event",
    api_version: "2025-08-27.basil",
    created: Math.floor(Date.now() / 1000),
    type: "checkout.session.completed",
    livemode: true,
    data: {
      object: {
        id: "cs_probe_not_real",
        object: "checkout.session",
        metadata: { tier: "pack_plus" },
        customer_details: { email: "probe@invalid.example" },
      },
    },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({ payload: probePayload, secret });

  try {
    await stripe.webhooks.constructEventAsync(probePayload, signature, secret);
    pass("Stripe signature verification succeeds with managed secret");
  } catch (err: unknown) {
    fail(`Signature verification failed: ${err instanceof Error ? err.message : err}`);
  }

  // 5. Production signed POST (sync may reject fake object IDs — that's OK)
  const signedRes = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Stripe-Signature": signature,
    },
    body: probePayload,
  });
  const signedBody = await signedRes.text();

  if (signedRes.status === 200) {
    pass("Production accepted signed probe event (HTTP 200)");
  } else if (signedRes.status === 400 && signedBody.includes("Webhook processing error")) {
    // stripe-replit-sync validates real Stripe object IDs after signature check
    pass("Production received signed event (sync rejected fake probe ID — expected)");
    console.log("  Real Stripe deliveries (live checkouts) will include valid object IDs.");
  } else {
    fail(`Signed probe unexpected: HTTP ${signedRes.status} — ${signedBody.slice(0, 120)}`);
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
  console.log("\nFor a full live test: complete a test checkout or use Stripe Dashboard →");
  console.log(`Webhooks → ${endpoint?.id} → Send test event.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

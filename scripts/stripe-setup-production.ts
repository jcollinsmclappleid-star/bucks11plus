#!/usr/bin/env npx tsx
/**
 * Configure live Stripe: branding (logo + Bucks 11 Plus Tests name), webhooks, products.
 * Usage:
 *   npm run stripe:setup
 *   npm run stripe:setup -- --force-branding
 */
import { initStripeCore, listStripeWebhookStatus } from "../server/stripeInit";
import { ensureStripeBranding, STRIPE_DISPLAY_NAME } from "../server/stripeBranding";
import { getUncachableStripeClient } from "../server/stripeClient";

const forceBranding = process.argv.includes("--force-branding");

async function main() {
  console.log("═".repeat(60));
  console.log("  Stripe production setup — Bucks 11 Plus Tests");
  console.log("═".repeat(60));

  await initStripeCore({ forceBranding: true });

  const stripe = await getUncachableStripeClient();
  const account = await stripe.accounts.retrieve();
  const name = account.business_profile?.name;
  const logo = account.settings?.branding?.logo;
  const descriptor = account.settings?.payments?.statement_descriptor;

  console.log("\nAccount branding:");
  console.log(`  business_profile.name: ${name ?? "(not set)"}`);
  console.log(`  branding.logo:       ${logo ? "set" : "missing"}`);
  console.log(`  statement_descriptor:  ${descriptor ?? "(not set)"}`);

  if (name !== STRIPE_DISPLAY_NAME) {
    console.warn(`\n⚠ Expected business name "${STRIPE_DISPLAY_NAME}" but got "${name}"`);
    console.warn("  Re-run with --force-branding or update in Stripe Dashboard → Settings → Business details");
  } else {
    console.log(`\n✓ Business name is "${STRIPE_DISPLAY_NAME}"`);
  }

  const webhooks = await listStripeWebhookStatus();
  console.log("\nWebhook endpoints:");
  console.log(`  Production URL: ${webhooks.productionUrl}`);
  for (const ep of webhooks.endpoints) {
    const marker = ep.url === webhooks.productionUrl ? " ← active" : "";
    console.log(`  - ${ep.url} [${ep.status}, ${ep.enabledEvents} events]${marker}`);
  }

  const hasProduction = webhooks.endpoints.some((ep) => ep.url === webhooks.productionUrl && ep.status === "enabled");
  if (!hasProduction) {
    console.warn("\n⚠ No enabled webhook found for the production URL — check Stripe Dashboard");
    process.exit(1);
  }

  console.log("\nDone. Open Stripe Dashboard → Webhooks to confirm recent deliveries return 200.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

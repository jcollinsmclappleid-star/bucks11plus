#!/usr/bin/env npx tsx
import { listStripeWebhookStatus } from "../server/stripeInit";
import { getUncachableStripeClient } from "../server/stripeClient";
import { STRIPE_DISPLAY_NAME } from "../server/stripeBranding";

async function main() {
  const stripe = await getUncachableStripeClient();
  const account = await stripe.accounts.retrieve();
  const webhooks = await listStripeWebhookStatus();

  console.log("Business name (dashboard):", account.business_profile?.name ?? "(unset)");
  console.log("Checkout display name (per-session):", STRIPE_DISPLAY_NAME);
  console.log("Logo on account:", account.settings?.branding?.logo ? "yes" : "no");
  console.log("\nWebhooks:");
  for (const ep of webhooks.endpoints) {
    const marker = ep.url === webhooks.productionUrl ? " ← production" : "";
    console.log(`  ${ep.url} [${ep.status}, ${ep.enabledEvents} events]${marker}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { getUncachableStripeClient } from "./stripeClient";

const SUBSCRIPTION_PRODUCTS = [
  {
    name: "Bucks Plus Edge",
    description:
      "Full access to all 2,500+ GL-style questions, diagnostics, drills, mock exams, PDF reports, progress tracking and premium analytics. Monthly subscription.",
    tier: "pack_plus",
    priceInPence: 3500,
    interval: "month" as const,
  },
  {
    name: "Bucks Plus Edge — Annual",
    description:
      "Full access to all 2,500+ GL-style questions, diagnostics, drills, mock exams, PDF reports, progress tracking and premium analytics. Annual subscription.",
    tier: "pack_annual",
    priceInPence: 27900,
    interval: "year" as const,
  },
];

export async function seedStripeProducts(): Promise<void> {
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.list({ limit: 100, active: true });
  const existingTiers = new Set<string>();
  for (const p of existingProducts.data) {
    if (p.metadata?.tier) existingTiers.add(p.metadata.tier);
  }

  for (const product of SUBSCRIPTION_PRODUCTS) {
    if (existingTiers.has(product.tier)) {
      console.log(`[Stripe Seed] "${product.name}" (${product.tier}) already exists`);
      continue;
    }

    console.log(`[Stripe Seed] Creating ${product.name} (${product.tier})`);
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: { tier: product.tier },
    });

    await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.priceInPence,
      currency: "gbp",
      recurring: { interval: product.interval },
    });

    console.log(
      `[Stripe Seed] Created ${product.name} — £${(product.priceInPence / 100).toFixed(2)}/${product.interval}`,
    );
  }
}

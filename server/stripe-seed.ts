import { getUncachableStripeClient } from './stripeClient';

const PRODUCTS = [
  {
    name: 'Early Learner',
    description: 'Foundation-level 11+ preparation for Year 4 & 5. 6 months of access.',
    tier: 'early_learner',
    durationWeeks: '26',
    priceInPence: 4900,
  },
  {
    name: 'Practice Platform',
    description: 'Self-directed 12-week practice and diagnostics access. Includes full diagnostics, drill bank, PDF reports, progress tracking, likelihood bands, and impact simulator.',
    tier: 'pack12',
    durationWeeks: '12',
    priceInPence: 9900,
  },
  {
    name: 'Practice Platform — Family',
    description: 'Full Practice Platform access for up to 3 children. 12 weeks.',
    tier: 'pack12_family',
    durationWeeks: '12',
    priceInPence: 14900,
  },
  {
    name: 'Young Scholar Programme',
    description: '16-week structured programme with milestone diagnostics, advanced analytics, weekly plans, and completion summary.',
    tier: 'programme16',
    durationWeeks: '16',
    priceInPence: 24900,
  },
  {
    name: 'Young Scholar Programme — Family',
    description: 'Complete Programme access for up to 3 children. 16 weeks.',
    tier: 'programme16_family',
    durationWeeks: '16',
    priceInPence: 34900,
  },
];

async function seedStripeProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('[Stripe Seed] Checking existing products...');

  const existingProducts = await stripe.products.list({ limit: 100, active: true });
  const existingTiers = new Set<string>();
  for (const p of existingProducts.data) {
    if (p.metadata?.tier) {
      existingTiers.add(p.metadata.tier);
    }
  }

  for (const product of PRODUCTS) {
    if (existingTiers.has(product.tier)) {
      console.log(`[Stripe Seed] "${product.name}" (tier: ${product.tier}) already exists, skipping`);
      continue;
    }

    console.log(`[Stripe Seed] Creating: ${product.name} (${product.tier})`);

    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: {
        tier: product.tier,
        duration_weeks: product.durationWeeks,
      },
    });

    await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.priceInPence,
      currency: 'gbp',
    });

    console.log(`[Stripe Seed] Created: ${product.name} — £${(product.priceInPence / 100).toFixed(2)}`);
  }

  console.log('[Stripe Seed] Done.');
}

seedStripeProducts().catch(console.error);

import { getUncachableStripeClient } from './stripeClient';

async function seedStripeProducts() {
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.search({ query: "name:'Practice Pack'" });
  if (existingProducts.data.length > 0) {
    console.log('Stripe products already exist, skipping seed.');
    return;
  }

  console.log('Creating Stripe products...');

  const pack12 = await stripe.products.create({
    name: 'Practice Pack',
    description: 'Self-directed 12-week practice and diagnostics access. Includes full diagnostics, drill bank, PDF reports, progress tracking, likelihood bands, and impact simulator.',
    metadata: {
      tier: 'pack12',
      duration_weeks: '12',
    },
  });

  await stripe.prices.create({
    product: pack12.id,
    unit_amount: 9900,
    currency: 'gbp',
  });

  console.log(`Created Practice Pack: ${pack12.id}`);

  const programme16 = await stripe.products.create({
    name: 'Structured Readiness Programme',
    description: '16-week structured programme with milestone diagnostics, advanced analytics, weekly plans, and completion summary. Everything in Practice Pack plus guided preparation roadmap.',
    metadata: {
      tier: 'programme16',
      duration_weeks: '16',
    },
  });

  await stripe.prices.create({
    product: programme16.id,
    unit_amount: 24900,
    currency: 'gbp',
  });

  console.log(`Created Structured Programme: ${programme16.id}`);
  console.log('Stripe products seeded successfully.');
}

seedStripeProducts().catch(console.error);

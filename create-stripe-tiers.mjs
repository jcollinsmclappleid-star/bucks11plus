import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const tiers = [
  { tier: 'early_learner', name: 'Early Learner Pack', amount: 4900 },
  { tier: 'pack12', name: 'Practice Pack', amount: 11900 },
  { tier: 'pack12_family', name: 'Practice Pack (Family)', amount: 34900 },
  { tier: 'programme16', name: 'Structured Readiness Programme', amount: 24900 },
  { tier: 'programme16_family', name: 'Structured Readiness Programme (Family)', amount: 34900 },
];

console.log('Creating Stripe products and prices...\n');

for (const tier of tiers) {
  try {
    const product = await stripe.products.create({
      name: tier.name,
      metadata: { tier: tier.tier }
    });
    console.log(`✓ Created product: ${product.name}`);
    
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: tier.amount,
      currency: 'gbp',
      type: 'one_time',
      metadata: { tier: tier.tier }
    });
    console.log(`  ✓ Price: £${(tier.amount / 100).toFixed(2)}\n`);
  } catch (err) {
    console.error(`✗ Error with ${tier.tier}: ${err.message}\n`);
  }
}

console.log('Done! Products will sync to database automatically.');

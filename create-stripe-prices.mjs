import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prices = [
  { tier: 'early_learner', amount: 4900 },
  { tier: 'pack12', amount: 11900 },
  { tier: 'pack12_family', amount: 34900 },
  { tier: 'programme16', amount: 24900 },
  { tier: 'programme16_family', amount: 34900 },
];

console.log('Creating prices for Stripe products...\n');

// First, get all products
const products = await stripe.products.list({ limit: 100 });
const tierMap = {};
for (const prod of products.data) {
  if (prod.metadata?.tier) {
    tierMap[prod.metadata.tier] = prod.id;
  }
}

console.log(`Found ${Object.keys(tierMap).length} products\n`);

for (const price of prices) {
  try {
    const productId = tierMap[price.tier];
    if (!productId) {
      console.log(`✗ No product found for tier: ${price.tier}`);
      continue;
    }
    
    const priceObj = await stripe.prices.create({
      product: productId,
      unit_amount: price.amount,
      currency: 'gbp',
      metadata: { tier: price.tier }
    });
    console.log(`✓ ${price.tier}: £${(price.amount / 100).toFixed(2)} (${priceObj.id})`);
  } catch (err) {
    console.error(`✗ ${price.tier}: ${err.message}`);
  }
}

console.log('\nDone! Prices created. Database will sync automatically.');

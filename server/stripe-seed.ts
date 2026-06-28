import { getUncachableStripeClient } from './stripeClient';
import { seedStripeProducts } from './stripeProducts';

seedStripeProducts().catch(console.error);

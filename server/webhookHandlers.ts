import { getStripeSync } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    try {
      const event = JSON.parse(payload.toString());
      await WebhookHandlers.handleSubscriptionEvent(event);
    } catch (err: any) {
      console.warn('[Webhook] Custom handler error (non-fatal):', err.message);
    }
  }

  private static async handleSubscriptionEvent(event: any): Promise<void> {
    const { type, data } = event;

    if (
      type === 'customer.subscription.deleted' ||
      (type === 'customer.subscription.updated' && data?.object?.status === 'canceled')
    ) {
      const subscription = data?.object;
      const customerId = typeof subscription?.customer === 'string'
        ? subscription.customer
        : subscription?.customer?.id;

      if (!customerId) return;

      const user = await storage.getUserByStripeCustomerId(customerId);
      if (!user) {
        console.log(`[Webhook] No user found for Stripe customer ${customerId} — skipping downgrade`);
        return;
      }

      if (user.subscriptionTier === 'pack_monthly' || user.subscriptionTier === 'pack_plus' || user.subscriptionTier === 'pack_annual') {
        console.log(`[Webhook] Subscription cancelled for user ${user.id} (${user.subscriptionTier}) — downgrading to free`);
        await storage.updateUserSubscription(user.id, 'free', undefined);
      }
    }
  }
}

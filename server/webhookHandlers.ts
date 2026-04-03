import { getStripeSync } from './stripeClient';
import { storage } from './storage';
import { sendTrialReminderEmail } from './email';

const PAID_TIERS = ['pack_monthly', 'pack_plus'] as const;

type SubscriptionTier = typeof PAID_TIERS[number];

function isPaidTier(tier: string | null | undefined): tier is SubscriptionTier {
  return PAID_TIERS.includes(tier as SubscriptionTier);
}

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

  private static async downgradeByCustomerId(customerId: string, reason: string): Promise<void> {
    if (!customerId) return;

    const user = await storage.getUserByStripeCustomerId(customerId);
    if (!user) {
      console.log(`[Webhook] No user found for Stripe customer ${customerId} — skipping`);
      return;
    }

    if (isPaidTier(user.subscriptionTier) || user.trialEndsAt) {
      console.log(`[Webhook] ${reason} for user ${user.id} (${user.subscriptionTier}) — downgrading to free`);
      await storage.updateUserSubscription(user.id, 'free', undefined);
      await storage.updateUserTrial(user.id, null);
    }
  }

  private static async handleSubscriptionEvent(event: any): Promise<void> {
    const { type, data } = event;
    const obj = data?.object;

    const customerId =
      typeof obj?.customer === 'string' ? obj.customer : obj?.customer?.id;

    switch (type) {
      // Subscription was fully deleted — covers:
      //   • cancel_at_period_end reaching its end date (monthly or annual)
      //   • immediate cancellation
      //   • Stripe finally giving up on failed payments after all retries
      case 'customer.subscription.deleted': {
        await WebhookHandlers.downgradeByCustomerId(
          customerId,
          'Subscription deleted'
        );
        break;
      }

      // Subscription status changed — catch cancelled, past_due, unpaid, or trial→active
      case 'customer.subscription.updated': {
        const status: string = obj?.status ?? '';
        const prevStatus: string = data?.previous_attributes?.status ?? '';
        if (status === 'canceled' || status === 'past_due' || status === 'unpaid') {
          await WebhookHandlers.downgradeByCustomerId(
            customerId,
            `Subscription status → ${status}`
          );
        } else if (status === 'active' && prevStatus === 'trialing') {
          // Trial successfully converted to paid — clear the trial badge
          const user = await storage.getUserByStripeCustomerId(customerId);
          if (user) {
            await storage.updateUserTrial(user.id, null);
            console.log(`[Webhook] Trial converted to active subscription for user ${user.id}`);
          }
        }
        break;
      }

      // Trial ending soon — send 3-day reminder email
      case 'customer.subscription.trial_will_end': {
        const trialEnd: number | null = obj?.trial_end ?? null;
        const user = await storage.getUserByStripeCustomerId(customerId);
        if (user && trialEnd) {
          const chargeDate = new Date(trialEnd * 1000);
          await sendTrialReminderEmail(user.id, chargeDate);
          console.log(`[Webhook] Trial reminder sent to user ${user.id}, charge on ${chargeDate.toISOString()}`);
        }
        break;
      }

      // Renewal payment failed (monthly or annual) — downgrade immediately
      // rather than waiting for Stripe to exhaust retries and send deleted
      case 'invoice.payment_failed': {
        // Only act on subscription invoices (not one-time charges)
        if (obj?.subscription) {
          await WebhookHandlers.downgradeByCustomerId(
            customerId,
            'Invoice payment failed'
          );
        }
        break;
      }

      default:
        break;
    }
  }
}

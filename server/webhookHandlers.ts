import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { sendAccountSetupEmail, sendPurchaseNotificationEmail, sendPurchaseConfirmationEmail, maskEmail } from './email';

const scryptAsync = promisify(scrypt);

const PAID_TIERS = ['pack_monthly', 'pack_plus', 'pack_annual'] as const;

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

    if (isPaidTier(user.subscriptionTier)) {
      console.log(`[Webhook] ${reason} for user ${user.id} (${user.subscriptionTier}) — downgrading to free`);
      await storage.updateUserSubscription(user.id, 'free', undefined);
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

      // Subscription status changed — catch cancelled, past_due, or unpaid
      case 'customer.subscription.updated': {
        const status: string = obj?.status ?? '';
        if (status === 'canceled' || status === 'past_due' || status === 'unpaid') {
          await WebhookHandlers.downgradeByCustomerId(
            customerId,
            `Subscription status → ${status}`
          );
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

      // New subscription created via checkout — upgrade or create user account
      case 'checkout.session.completed': {
        await WebhookHandlers.handleCheckoutCompleted(obj);
        break;
      }

      default:
        break;
    }
  }

  private static async handleCheckoutCompleted(session: any): Promise<void> {
    const tier = session.metadata?.tier;
    if (!tier || !['pack_plus', 'pack_annual', 'pack_monthly'].includes(tier)) return;

    const customerEmail = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

    if (!customerEmail) {
      console.log('[Webhook] checkout.session.completed — no customer email, cannot provision');
      return;
    }

    // Look up existing user
    const amountPence: number | undefined = typeof session.amount_total === 'number' ? session.amount_total : undefined;
    const sessionId: string | undefined = typeof session.id === 'string' ? session.id : undefined;

    sendPurchaseConfirmationEmail(customerEmail, tier, {
      amountPence,
      checkoutSessionId: sessionId,
    }).catch(() => {});

    const existing = await storage.getUserByUsername(customerEmail);
    if (existing) {
      if (customerId && !existing.stripeCustomerId) {
        await storage.updateUserStripeInfo(existing.id, customerId);
      }
      await storage.updateUserSubscription(existing.id, tier, undefined);
      console.log(`[Webhook] Upgraded existing user ${maskEmail(customerEmail)} → ${tier}`);
      sendPurchaseNotificationEmail(customerEmail, tier, amountPence).catch(() => {});
      return;
    }

    // Auto-create account for new customer
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(randomBytes(16).toString('hex'), salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString('hex')}.${salt}`;
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const newUser = await storage.createUser({ username: customerEmail, password: hashedPassword });
    await db.update(users)
      .set({
        subscriptionTier: tier,
        stripeCustomerId: customerId || null,
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      })
      .where(eq(users.id, newUser.id));

    try {
      await sendAccountSetupEmail(customerEmail, resetToken);
      console.log(`[Webhook] Auto-created account for ${maskEmail(customerEmail)} (${tier}) — setup email sent`);
    } catch (e: any) {
      console.warn('[Webhook] Setup email failed (non-fatal):', e.message);
    }
    sendPurchaseNotificationEmail(customerEmail, tier, amountPence).catch(() => {});
  }
}

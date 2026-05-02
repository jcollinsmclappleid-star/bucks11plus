import { db } from "./db";
import { users, emailEvents } from "@shared/schema";
import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { storage } from "./storage";
import { getUncachableStripeClient } from "./stripeClient";

/**
 * GDPR retention sweep.
 *
 * Policy (matches the public Privacy Policy, §8 Data Retention):
 *
 *  - We keep account data for as long as a user has an active subscription.
 *  - Once a subscription has ended (or the user is on the free tier), we
 *    keep the account for 24 calendar months from the user's last login.
 *    24 months is the smallest defensible window that still covers the
 *    typical Year 4 → Year 5 → Year 6 sibling re-engagement cycle. After
 *    that the account and all associated educational data are permanently
 *    deleted.
 *  - Email delivery logs are pruned after 12 calendar months — we only need
 *    them long enough to debug deliverability and respect frequency caps.
 *  - Admin accounts are never auto-deleted.
 *  - Defence in depth: before deleting any user that has ever transacted
 *    with Stripe (i.e. has a stripeCustomerId), we re-check Stripe live
 *    and skip if any subscription is still in an active-ish state. This
 *    prevents an outdated local subscription_tier ever causing the loss
 *    of a paying customer's account.
 *
 * The sweep is idempotent and safe to run multiple times.
 */

const ACTIVE_STRIPE_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "incomplete",
]);

export interface RetentionReport {
  candidatesFound: number;
  usersDeleted: number;
  usersSkippedDueToStripe: number;
  emailEventsPruned: number;
  errors: string[];
}

export async function runRetentionSweep(now: Date = new Date()): Promise<RetentionReport> {
  const report: RetentionReport = {
    candidatesFound: 0,
    usersDeleted: 0,
    usersSkippedDueToStripe: 0,
    emailEventsPruned: 0,
    errors: [],
  };

  console.log(`[Retention] Sweep starting at ${now.toISOString()}. Account cutoff: 24 months. Email-log cutoff: 12 months.`);

  // Identify deletable users using true calendar arithmetic (Postgres intervals):
  //   - not an admin
  //   - no active paid subscription (free tier OR paid sub already expired)
  //   - last login (or, if never logged in, account creation) older than
  //     24 calendar months
  let candidates: { id: string; username: string; stripeCustomerId: string | null }[] = [];
  try {
    candidates = await db
      .select({
        id: users.id,
        username: users.username,
        stripeCustomerId: users.stripeCustomerId,
      })
      .from(users)
      .where(
        and(
          eq(users.isAdmin, false),
          or(
            eq(users.subscriptionTier, "free"),
            and(
              sql`${users.subscriptionExpiresAt} IS NOT NULL`,
              lt(users.subscriptionExpiresAt, now),
            ),
          ),
          or(
            sql`${users.lastLoginAt} < (now() - interval '24 months')`,
            and(
              isNull(users.lastLoginAt),
              sql`${users.createdAt} < (now() - interval '24 months')`,
            ),
          ),
        ),
      );
  } catch (err: any) {
    report.errors.push(`Failed to query candidates: ${err.message}`);
    console.error("[Retention] Failed to query candidates:", err);
  }

  report.candidatesFound = candidates.length;
  if (candidates.length > 0) {
    console.log(`[Retention] ${candidates.length} dormant account(s) eligible for deletion.`);
  }

  for (const user of candidates) {
    try {
      // Stripe-state safeguard: never delete a user whose Stripe account
      // still shows any active-ish subscription, even if our local fields
      // disagree (webhook drift, manual edits, race conditions).
      if (user.stripeCustomerId) {
        const stillActive = await hasActiveStripeSubscription(user.stripeCustomerId);
        if (stillActive) {
          report.usersSkippedDueToStripe += 1;
          console.log(`[Retention] Skipped user ${user.id} — Stripe still shows an active-ish subscription.`);
          continue;
        }
      }

      await storage.deleteUser(user.id);
      report.usersDeleted += 1;
      console.log(`[Retention] Deleted dormant account ${user.id}`);
    } catch (err: any) {
      report.errors.push(`Failed to process user ${user.id}: ${err.message}`);
      console.error(`[Retention] Failed to process user ${user.id}:`, err);
    }
  }

  // Prune old email logs irrespective of account state.
  try {
    const result = await db
      .delete(emailEvents)
      .where(sql`${emailEvents.sentAt} < (now() - interval '12 months')`)
      .returning({ id: emailEvents.id });
    report.emailEventsPruned = result.length;
    if (result.length > 0) {
      console.log(`[Retention] Pruned ${result.length} email event(s) older than 12 months.`);
    }
  } catch (err: any) {
    report.errors.push(`Failed to prune email events: ${err.message}`);
    console.error("[Retention] Failed to prune email events:", err);
  }

  console.log(
    `[Retention] Sweep complete. Candidates: ${report.candidatesFound}, deleted: ${report.usersDeleted}, ` +
    `skipped (Stripe active): ${report.usersSkippedDueToStripe}, email events pruned: ${report.emailEventsPruned}, ` +
    `errors: ${report.errors.length}`,
  );
  return report;
}

async function hasActiveStripeSubscription(customerId: string): Promise<boolean> {
  try {
    const stripe = await getUncachableStripeClient();
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 20 });
    return subs.data.some((s) => ACTIVE_STRIPE_STATUSES.has(s.status));
  } catch (err: any) {
    // If Stripe is unreachable, err on the side of NOT deleting.
    console.error(`[Retention] Stripe check failed for customer ${customerId}, refusing to delete:`, err?.message ?? err);
    return true;
  }
}

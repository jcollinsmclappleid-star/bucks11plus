import { db } from "./db";
import { users, emailEvents } from "@shared/schema";
import { and, eq, isNull, isNotNull, lt, or, sql } from "drizzle-orm";
import { storage } from "./storage";
import { getUncachableStripeClient } from "./stripeClient";
import { sendRetentionWarningEmail } from "./email";

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
 *  - 30 days BEFORE deletion (i.e. at 23 months of dormancy) we send a
 *    one-off "your account will be deleted in 30 days" warning email so the
 *    account holder can return and reset the clock by signing in once.
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
  warningsSent: number;
  warningsFailed: number;
  candidatesFound: number;
  usersDeleted: number;
  usersSkippedDueToStripe: number;
  usersSkippedAwaitingWarning: number;
  emailEventsPruned: number;
  errors: string[];
}

export async function runRetentionSweep(now: Date = new Date()): Promise<RetentionReport> {
  const report: RetentionReport = {
    warningsSent: 0,
    warningsFailed: 0,
    candidatesFound: 0,
    usersDeleted: 0,
    usersSkippedDueToStripe: 0,
    usersSkippedAwaitingWarning: 0,
    emailEventsPruned: 0,
    errors: [],
  };

  console.log(`[Retention] Sweep starting at ${now.toISOString()}. Warning at 23 months. Account cutoff: 24 months. Email-log cutoff: 12 months.`);

  // -------------------------------------------------------------------------
  // Phase 1: send the 30-day deletion warning to accounts that have just
  // crossed the 23-month dormancy line, but haven't yet been warned.
  //
  // Predicate: not admin, not actively subscribed, dormant ≥ 23 months but
  // < 24 months, and retention_warning_sent_at IS NULL.
  // -------------------------------------------------------------------------
  let warnCandidates: { id: string; username: string; email: string | null; lastLoginAt: Date | null }[] = [];
  try {
    warnCandidates = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        lastLoginAt: users.lastLoginAt,
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
          isNull(users.retentionWarningSentAt),
          isNotNull(users.lastLoginAt),
          sql`${users.lastLoginAt} < (now() - interval '23 months')`,
          sql`${users.lastLoginAt} >= (now() - interval '24 months')`,
        ),
      );
  } catch (err: any) {
    report.errors.push(`Failed to query warn candidates: ${err.message}`);
    console.error("[Retention] Failed to query warn candidates:", err);
  }

  for (const user of warnCandidates) {
    const target = user.email || (user.username.includes("@") ? user.username : null);
    if (!target) continue;
    try {
      const ok = await sendRetentionWarningEmail(target, user.lastLoginAt!);
      if (ok) {
        await db
          .update(users)
          .set({ retentionWarningSentAt: now })
          .where(eq(users.id, user.id));
        report.warningsSent += 1;
        console.log(`[Retention] Warning sent to user ${user.id}`);
      } else {
        report.warningsFailed += 1;
      }
    } catch (err: any) {
      report.warningsFailed += 1;
      report.errors.push(`Warning email failed for ${user.id}: ${err.message}`);
      console.error(`[Retention] Warning email failed for ${user.id}:`, err);
    }
  }

  // -------------------------------------------------------------------------
  // Phase 2: delete accounts that are past the 24-month cutoff AND have
  // either been warned ≥ 30 days ago, OR have hit the 25-month failsafe
  // (catches accounts where the warning email bounced or was never queueable
  // because there's no usable address on file).
  // -------------------------------------------------------------------------
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
            // Standard path: dormant ≥ 24 months AND warned ≥ 30 days ago
            and(
              sql`${users.lastLoginAt} < (now() - interval '24 months')`,
              isNotNull(users.retentionWarningSentAt),
              sql`${users.retentionWarningSentAt} < (now() - interval '30 days')`,
            ),
            // Failsafe: dormant ≥ 25 months — delete even if warning never landed
            sql`${users.lastLoginAt} < (now() - interval '25 months')`,
            // Never-logged-in failsafe: account created > 25 months ago and never used
            and(
              isNull(users.lastLoginAt),
              sql`${users.createdAt} < (now() - interval '25 months')`,
            ),
          ),
        ),
      );
  } catch (err: any) {
    report.errors.push(`Failed to query delete candidates: ${err.message}`);
    console.error("[Retention] Failed to query delete candidates:", err);
  }

  // Count accounts past 24 months but still inside the 30-day warning grace
  // window — they exist but we are deliberately not deleting them yet.
  try {
    const [pendingRow] = await db
      .select({ c: sql<number>`count(*)::int` })
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
          sql`${users.lastLoginAt} < (now() - interval '24 months')`,
          sql`${users.lastLoginAt} >= (now() - interval '25 months')`,
          or(
            isNull(users.retentionWarningSentAt),
            sql`${users.retentionWarningSentAt} >= (now() - interval '30 days')`,
          ),
        ),
      );
    report.usersSkippedAwaitingWarning = pendingRow?.c ?? 0;
  } catch {
    // best-effort metric only
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
    `[Retention] Sweep complete. Warnings sent: ${report.warningsSent}, candidates: ${report.candidatesFound}, ` +
    `deleted: ${report.usersDeleted}, skipped (Stripe active): ${report.usersSkippedDueToStripe}, ` +
    `skipped (awaiting 30-day grace): ${report.usersSkippedAwaitingWarning}, ` +
    `email events pruned: ${report.emailEventsPruned}, errors: ${report.errors.length}`,
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

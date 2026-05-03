import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { onboardingSchema, insertGuideLeadSchema, testSessions, testAnswers, questions, users, childProfiles, emailEvents, programmeEnrolments, testDayConfig, programmeMilestones, weeklyPlans, programmeTasks, userBadges, questionUsage } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sql, eq, and, desc, inArray } from "drizzle-orm";
import { db } from "./db";
import { computeAttemptMetrics, computeFullAnalytics, type AnswerRecord, type DrillAnswerRecord, type HistoricalMetrics } from "./metrics";
import { sendDiagnosticCompleteEmail, sendAdminNotificationEmail, sendGuideDownloadAdminEmail, sendGuideDownloadUserEmail, sendSubscriptionCancelledAdminEmail, sendEmailVerificationEmail, generateEmailVerifyToken } from "./email";
import { timingSafeEqual } from "crypto";
import { ensureChromium } from "./chromium";
import { learnArticles } from "../client/src/data/learn-articles";
import { QUESTION_TYPES } from "../client/src/data/question-types";
import { MATHS_TOPICS } from "../client/src/data/maths-topics";
import { MOCK_VARIANTS } from "../client/src/data/mock-variants";
import { VOCAB_CLUSTERS } from "../client/src/data/vocab-clusters";
import { URGENCY_PLANS } from "../client/src/data/urgency-plans";
import { ensureFreePool, repairSeedQuestions } from "./seed";
import {
  getTownHtml, getGrammarSchoolHtml, getSubjectGuideHtml,
  getYearGroupGuideHtml, getLearnHubHtml, getLearnArticleHtml,
  towns as ssrTowns, grammarSchools as ssrGrammarSchools,
} from "./ssrPages";
import { getGlossaryIndexHtml, getGlossaryTermHtml, GLOSSARY_TERMS } from "./ssrGlossary";
import {
  getTestDate2026Html, getTestDate2025Html, getPastPapersHtml,
  getResultsGuideHtml, getSampleQuestionsHtml, getScoreGuideHtml,
  getTutorsGuideHtml, getAppealsGuideHtml, getRegistrationDetailedHtml,
} from "./ssrHighVolume";

const PROGRAMME_TIERS = new Set([
  "pack_plus",
  "pack_annual",
  "programme8",
  "programme12",
  "programme16",
  "programme16_family",
  "programme24_plus",
]);

const TIER_RANK: Record<string, number> = {
  free: 0,
  // Legacy tiers — existing subscribers keep full access (rank 1)
  early_learner: 1,
  pack12: 1,
  pack12_family: 1,
  pack_monthly: 1,
  programme8: 1,
  programme12: 1,
  programme16: 1,
  programme16_family: 1,
  programme24_plus: 1,
  // Active plans
  pack_plus: 1,
  pack_annual: 1,
};

// Only the two active plans are available for new checkout
const ALL_VALID_TIERS = ["pack_plus", "pack_annual"];

const TIER_PRICE_GBP_PENCE: Record<string, number> = {
  // Active plans — new pricing
  pack_plus: 3500,    // £35/month
  pack_annual: 27900, // £279/year
  // Legacy prices (kept for reference only, not used in new checkout)
  early_learner: 4900,
  pack12: 11900,
  pack12_family: 14900,
  pack_monthly: 2499,
  programme8: 5900,
  programme12: 8900,
  programme16: 24900,
  programme16_family: 34900,
  programme24_plus: 34900,
};

const TIER_DISPLAY_NAME: Record<string, string> = {
  // Active plans
  pack_plus: "Bucks Plus Edge",
  pack_annual: "Bucks Plus Edge — Annual",
  // Legacy — shown as Bucks Plus Edge for existing subscribers
  early_learner: "Bucks Plus Edge (Legacy)",
  pack12: "Bucks Plus Edge (Legacy)",
  pack12_family: "Bucks Plus Edge (Legacy)",
  pack_monthly: "Bucks Plus Edge (Legacy)",
  programme8: "Bucks Plus Edge (Legacy)",
  programme12: "Bucks Plus Edge (Legacy)",
  programme16: "Bucks Plus Edge (Legacy)",
  programme16_family: "Bucks Plus Edge (Legacy)",
  programme24_plus: "Bucks Plus Edge (Legacy)",
};

const TIER_DESCRIPTION: Record<string, string> = {
  pack_plus: "Full access to 2,500+ GL-style questions across Verbal Reasoning, Non-Verbal Reasoning, Maths & Comprehension. Includes all difficulty drills, full-length mock exams, timed readiness checks, PDF reports, parent analytics, progress tracking, and a guided preparation roadmap. Cancel any time.",
  pack_annual: "12 months of full access to 2,500+ GL-style questions across Verbal Reasoning, Non-Verbal Reasoning, Maths & Comprehension. Includes all difficulty drills, full-length mock exams, timed readiness checks, PDF reports, parent analytics, progress tracking, and a guided preparation roadmap. Save £141 vs monthly billing.",
};

async function findStripePriceForTier(tier: string): Promise<string | null> {
  try {
    const pricesResult = await db.execute(
      sql`SELECT pr.id as price_id, p.metadata FROM stripe.prices pr JOIN stripe.products p ON pr.product = p.id WHERE p.active = true AND pr.active = true`
    );
    const priceRow = pricesResult.rows.find((r: any) => {
      const meta = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
      return meta?.tier === tier;
    });
    if (priceRow) return (priceRow as any).price_id;
  } catch (e) {
    console.log("Stripe DB lookup failed, falling back to API:", e);
  }

  try {
    const stripe = await getUncachableStripeClient();
    const prices = await stripe.prices.list({ active: true, limit: 100, expand: ['data.product'] });
    for (const price of prices.data) {
      const product = price.product as any;
      if (product?.metadata?.tier === tier) {
        return price.id;
      }
    }
  } catch (e) {
    console.log("Stripe API price lookup failed:", e);
  }

  return null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.put("/api/user/onboarding", requireAuth, async (req, res, next) => {
    try {
      const parsed = onboardingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid onboarding data" });
      }
      const user = await storage.updateUserOnboarding(req.user!.id, parsed.data);
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  });

  // GDPR Article 20 — Right to data portability.
  // Returns the user's full record plus all linked child profiles, test sessions,
  // test answers, programme enrolments and email events as a single JSON blob.
  // Sensitive credentials (password hash, password-reset token) are stripped.
  app.get("/api/user/export", requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    try {
      const [userRow] = await db.select().from(users).where(eq(users.id, userId));
      if (!userRow) return res.status(404).json({ message: "User not found" });

      const {
        password: _pw,
        passwordResetToken: _prt,
        passwordResetExpires: _pre,
        ...safeUser
      } = userRow;

      const [
        profiles,
        sessions,
        enrolments,
        examConfig,
        emails,
        milestones,
        plans,
        tasks,
        badgesEarned,
        usage,
      ] = await Promise.all([
        db.select().from(childProfiles).where(eq(childProfiles.userId, userId)),
        db.select().from(testSessions).where(eq(testSessions.userId, userId)),
        db.select().from(programmeEnrolments).where(eq(programmeEnrolments.userId, userId)),
        db.select().from(testDayConfig).where(eq(testDayConfig.userId, userId)),
        db.select().from(emailEvents).where(eq(emailEvents.userId, userId)),
        db.select().from(programmeMilestones).where(eq(programmeMilestones.userId, userId)),
        db.select().from(weeklyPlans).where(eq(weeklyPlans.userId, userId)),
        db.select().from(programmeTasks).where(eq(programmeTasks.userId, userId)),
        db.select().from(userBadges).where(eq(userBadges.userId, userId)),
        db.select().from(questionUsage).where(eq(questionUsage.userId, userId)),
      ]);

      const sessionIds = sessions.map((s) => s.id);
      const answers = sessionIds.length > 0
        ? await db.select().from(testAnswers).where(inArray(testAnswers.sessionId, sessionIds))
        : [];

      const payload = {
        exportedAt: new Date().toISOString(),
        notice:
          "This file contains all personal data Bucks 11 Plus Tests holds about your account. " +
          "It does not include payment records, which are held by Stripe and available via your Stripe receipts.",
        user: safeUser,
        childProfiles: profiles,
        testSessions: sessions,
        testAnswers: answers,
        programmeEnrolments: enrolments,
        programmeMilestones: milestones,
        weeklyPlans: plans,
        programmeTasks: tasks,
        userBadges: badgesEarned,
        questionUsage: usage,
        examDateConfig: examConfig,
        emailEvents: emails,
      };

      const filename = `bucks11plus-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.status(200).send(JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error(`[DataExport] Failed for userId=${userId}`, error);
      next(error);
    }
  });

  app.delete("/api/user", requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    try {
      console.log(`[DeleteAccount] Request started — userId=${userId}`);
      const user = await storage.getUser(userId);

      if (user?.stripeCustomerId) {
        let activeSubFound = false;
        try {
          const stripe = await getUncachableStripeClient();
          let subscriptions = await stripe.subscriptions.list({ customer: user.stripeCustomerId, limit: 10 });

          // Fallback: guest checkout may have created a different Stripe customer.
          // Search by email to catch subscriptions under a mismatched customer ID.
          if (subscriptions.data.length === 0) {
            const userEmail = user.email || user.username || "";
            if (userEmail.includes("@")) {
              const customers = await stripe.customers.search({
                query: `email:"${userEmail}"`,
                limit: 5,
              });
              for (const cust of customers.data) {
                if (cust.id === user.stripeCustomerId) continue;
                const custSubs = await stripe.subscriptions.list({ customer: cust.id, limit: 10 });
                if (custSubs.data.length > 0) {
                  subscriptions = custSubs;
                  break;
                }
              }
            }
          }

          const activeSubs = subscriptions.data.filter(s => s.status !== "canceled");
          if (activeSubs.length > 0) {
            activeSubFound = true;
            console.log(`[DeleteAccount] Found ${activeSubs.length} active subscription(s) — cancelling`);
            for (const sub of activeSubs) {
              await stripe.subscriptions.cancel(sub.id);
              console.log(`[DeleteAccount] Stripe subscription cancelled — subId=${sub.id}`);
            }
          } else {
            console.log(`[DeleteAccount] No active subscriptions found — proceeding`);
          }
        } catch (stripeErr) {
          console.error(`[DeleteAccount] Stripe cancellation FAILED — userId=${userId}`, stripeErr);
          return res.status(500).json({
            message: "We could not cancel your subscription right now. Please try again in a moment.",
            code: "stripe_cancel_failed",
          });
        }
        if (activeSubFound) {
          console.log(`[DeleteAccount] All Stripe subscriptions cancelled successfully`);
        }
      } else {
        console.log(`[DeleteAccount] No Stripe customer — no subscription to cancel`);
      }

      await storage.deleteUser(userId);
      console.log(`[DeleteAccount] Account data deleted — userId=${userId}`);

      req.logout((err) => {
        if (err) console.error("[DeleteAccount] Logout error:", err);
        req.session?.destroy?.((destroyErr) => {
          if (destroyErr) console.error("[DeleteAccount] Session destroy error:", destroyErr);
          console.log(`[DeleteAccount] Session destroyed — userId=${userId}`);
          res.json({ success: true });
        });
      });
    } catch (error) {
      console.error(`[DeleteAccount] Unexpected error — userId=${userId}`, error);
      next(error);
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res, next) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stripe/customer-portal", requireAuth, async (req, res, next) => {
    try {
      const user = req.user!;
      if (!user.stripeCustomerId) {
        return res.status(400).json({ message: "No billing account found. Please contact support." });
      }
      const stripe = await getUncachableStripeClient();
      const host = req.get("host");
      const protocol = req.protocol;
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${protocol}://${host}/app/account`,
      });
      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stripe/cancel-subscription", requireAuth, async (req, res, next) => {
    try {
      const user = req.user!;
      const stripe = await getUncachableStripeClient();
      const userEmail = (user.email || user.username || "").toLowerCase().trim();

      // Start with whatever stripeCustomerId we have (may be null)
      let subscriptions: Awaited<ReturnType<typeof stripe.subscriptions.list>> = { data: [] } as any;

      if (user.stripeCustomerId) {
        subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          limit: 10,
        });
      }

      // Fallback: search Stripe by email — covers users provisioned without a stored
      // customer ID and guest checkouts that created a separate customer record.
      if (subscriptions.data.length === 0 && userEmail.includes("@")) {
        const customers = await stripe.customers.search({
          query: `email:"${userEmail}"`,
          limit: 5,
        });
        for (const cust of customers.data) {
          if (cust.id === user.stripeCustomerId) continue;
          const custSubs = await stripe.subscriptions.list({ customer: cust.id, limit: 10 });
          if (custSubs.data.length > 0) {
            subscriptions = custSubs;
            // Persist the found customer ID so future lookups skip this search
            await storage.updateUserStripeInfo(user.id, cust.id);
            break;
          }
        }
      }

      const activeSubs = subscriptions.data.filter((s: any) => s.status !== "canceled");

      if (activeSubs.length === 0) {
        // No active Stripe subscription — downgrade locally so the user is in a clean state.
        await storage.updateUserSubscription(user.id, "free", undefined);
        const { password: _, ...safeUser } = await storage.getUser(user.id) as any;
        return res.json({ success: true, user: safeUser, cancelledImmediately: true });
      }

      let latestPeriodEnd: Date | undefined;
      for (const sub of activeSubs) {
        const updated = await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
        // Store the period end so the access guard in requireAuth can expire access
        // even if the customer.subscription.deleted webhook is missed.
        if (updated.current_period_end) {
          const periodEnd = new Date(updated.current_period_end * 1000);
          if (!latestPeriodEnd || periodEnd > latestPeriodEnd) latestPeriodEnd = periodEnd;
        }
      }

      if (latestPeriodEnd) {
        await storage.updateUserSubscription(user.id, user.subscriptionTier || "free", latestPeriodEnd);
      }

      // Notify admin of cancellation
      sendSubscriptionCancelledAdminEmail(userEmail, user.subscriptionTier || "unknown").catch(() => {});

      const { password: _, ...safeUser } = await storage.getUser(user.id) as any;
      res.json({ success: true, user: safeUser, cancelledImmediately: false, accessUntil: latestPeriodEnd?.toISOString() });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout", requireAuth, async (req, res, next) => {
    try {
      const { tier } = req.body;
      if (!tier || !ALL_VALID_TIERS.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      const stripe = await getUncachableStripeClient();
      const user = req.user!;

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId: user.id },
        });
        await storage.updateUserStripeInfo(user.id, customer.id);
        customerId = customer.id;
      }

      const host = req.get('host');
      const protocol = req.protocol;

      // Both active plans are subscriptions — monthly or annual
      const interval = tier === "pack_annual" ? "year" : "month";
      const unitAmount = TIER_PRICE_GBP_PENCE[tier] || 0;

      const sessionParams: any = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: TIER_DISPLAY_NAME[tier] || tier,
              description: TIER_DESCRIPTION[tier] || undefined,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${protocol}://${host}/app/checkout-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        consent_collection: { terms_of_service: 'required' },
        custom_text: {
          terms_of_service_acceptance: {
            message: "I agree to the Terms of Service and Refund Policy. I want immediate access to digital content and I understand this waives my 14-day right to cancel under the Consumer Contracts Regulations 2013 once any content is accessed.",
          },
        },
        metadata: {
          userId: user.id,
          tier: tier,
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/upgrade", requireAuth, async (req, res, next) => {
    try {
      const { targetTier } = req.body;
      const validUpgrades: Record<string, string[]> = {
        // Active upgrade path: monthly → annual
        pack_plus: ["pack_annual"],
        // Legacy upgrade paths: all legacy paid tiers can move to annual
        pack_monthly: ["pack_annual"],
        pack12: ["pack_annual"],
        pack12_family: ["pack_annual"],
        programme8: ["pack_annual"],
        programme12: ["pack_annual"],
        programme16: ["pack_annual"],
        programme16_family: ["pack_annual"],
        programme24_plus: ["pack_annual"],
        pack_annual: [],
      };

      const user = req.user!;
      const currentTier = user.subscriptionTier;
      const allowed = validUpgrades[currentTier];
      if (!allowed || !allowed.includes(targetTier)) {
        return res.status(400).json({ message: "Invalid upgrade path" });
      }

      const stripe = await getUncachableStripeClient();

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId: user.id },
        });
        await storage.updateUserStripeInfo(user.id, customer.id);
        customerId = customer.id;
      }

      const targetAmount = TIER_PRICE_GBP_PENCE[targetTier] || 0;

      const host = req.get('host');
      const protocol = req.protocol;

      // All upgrade targets are subscriptions — monthly or annual
      const upgradeInterval = targetTier === "pack_annual" ? "year" : "month";
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: TIER_DISPLAY_NAME[targetTier] || targetTier,
              description: TIER_DESCRIPTION[targetTier] || undefined,
            },
            unit_amount: targetAmount,
            recurring: { interval: upgradeInterval },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${protocol}://${host}/app/checkout-success?tier=${targetTier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        consent_collection: { terms_of_service: 'required' },
        custom_text: {
          terms_of_service_acceptance: {
            message: "I agree to the Terms of Service and Refund Policy. I want immediate access to digital content and I understand this waives my 14-day right to cancel under the Consumer Contracts Regulations 2013 once any content is accessed.",
          },
        },
        metadata: { userId: user.id, tier: targetTier, upgradeFrom: currentTier },
      });

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/checkout", async (req, res, next) => {
    try {
      const { tier } = req.body;
      if (!tier || !ALL_VALID_TIERS.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      const stripe = await getUncachableStripeClient();
      const host = req.get('host');
      const protocol = req.protocol;

      // Both active plans are subscriptions — monthly or annual
      const guestInterval = tier === "pack_annual" ? "year" : "month";
      const unitAmount = TIER_PRICE_GBP_PENCE[tier] || 0;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: TIER_DISPLAY_NAME[tier] || tier,
              description: TIER_DESCRIPTION[tier] || undefined,
            },
            unit_amount: unitAmount,
            recurring: { interval: guestInterval },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${protocol}://${host}/checkout-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        consent_collection: { terms_of_service: 'required' },
        custom_text: {
          terms_of_service_acceptance: {
            message: "I agree to the Terms of Service and Refund Policy. I want immediate access to digital content and I understand this waives my 14-day right to cancel under the Consumer Contracts Regulations 2013 once any content is accessed.",
          },
        },
        metadata: { tier },
      });

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/complete", requireAuth, async (req, res, next) => {
    try {
      const { session_id } = req.body;
      if (!session_id) {
        return res.status(400).json({ message: "session_id is required" });
      }

      const stripe = await getUncachableStripeClient();
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
      if (checkoutSession.payment_status !== "paid") {
        return res.status(400).json({ message: "Payment not confirmed" });
      }
      const sessionUserId = checkoutSession.metadata?.userId;
      if (sessionUserId && sessionUserId !== req.user!.id) {
        return res.status(403).json({ message: "Session does not belong to this user" });
      }

      const tier = checkoutSession.metadata?.tier;
      if (!tier || !ALL_VALID_TIERS.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier in session metadata" });
      }

      const currentUser = await storage.getUser(req.user!.id);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const currentRank = TIER_RANK[currentUser.subscriptionTier] || 0;
      const newRank = TIER_RANK[tier] || 0;
      if (newRank <= currentRank) {
        const { password: _, ...safeUser } = currentUser;
        return res.json(safeUser);
      }

      const SUBSCRIPTION_TIERS = new Set(["pack_monthly", "pack_plus", "pack_annual"]);
      const weeksMap: Record<string, number> = {
        early_learner: 26,
        pack12: 26,
        pack12_family: 26,
        pack_annual: 52,
        programme8: 8,
        programme12: 12,
        programme16: 52,
        programme16_family: 52,
        programme24_plus: 24,
      };
      const expiresAt = SUBSCRIPTION_TIERS.has(tier)
        ? undefined
        : new Date(Date.now() + (weeksMap[tier] || 12) * 7 * 24 * 60 * 60 * 1000);

      await storage.updateUserSubscription(req.user!.id, tier, expiresAt);

      // Always save the Stripe customer from the session (guest checkout creates a new customer)
      if (checkoutSession.customer && typeof checkoutSession.customer === 'string') {
        await storage.updateUserStripeInfo(req.user!.id, checkoutSession.customer);
      }

      const paidPence = checkoutSession.amount_total || 0;
      const paidStr = paidPence > 0 ? `£${(paidPence / 100).toFixed(2)}` : undefined;
      sendAdminNotificationEmail("payment", {
        userEmail: currentUser.email || currentUser.username || req.user!.id,
        tier,
        amount: paidStr,
        timestamp: new Date(),
      }).catch(err => console.error('[AdminEmail] payment error:', err));

      const programmeTiers = new Set(["programme8", "programme12", "programme16", "programme16_family", "programme24_plus"]);
      if (programmeTiers.has(tier)) {
        const existing = await storage.getProgrammeEnrolment(req.user!.id);
        if (!existing) {
          await storage.createProgrammeEnrolment(req.user!.id);
        }
      }

      const user = await storage.getUser(req.user!.id);
      const { password: _, ...safeUser } = user!;
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/diagnostics", async (_req, res, next) => {
    try {
      const diags = await storage.getDiagnostics();
      res.json(diags);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/diagnostics/:id", async (req, res, next) => {
    try {
      const diag = await storage.getDiagnostic(req.params.id);
      if (!diag) return res.status(404).json({ message: "Diagnostic not found" });
      res.json(diag);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/diagnostics/:id/questions", requireAuth, async (req, res, next) => {
    try {
      const diag = await storage.getDiagnostic(req.params.id);
      if (!diag) return res.status(404).json({ message: "Diagnostic not found" });

      const userRank = TIER_RANK[req.user!.subscriptionTier] || 0;
      const requiredRank = TIER_RANK[diag.requiredTier] || 0;
      if (userRank < requiredRank) {
        return res.status(403).json({ message: "Upgrade required to access this diagnostic" });
      }

      const qs = await storage.selectQuestionsForSession(req.user!.id, req.params.id);
      const safe = qs.map(({ correctAnswer, ...q }) => q);
      res.json(safe);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/start-diagnostic", async (req, res, next) => {
    try {
      const { diagnosticId } = req.body;
      if (!diagnosticId) return res.status(400).json({ message: "diagnosticId required" });

      const diag = await storage.getDiagnostic(diagnosticId);
      if (!diag) return res.status(404).json({ message: "Diagnostic not found" });

      if (diag.requiredTier !== "free") {
        return res.status(403).json({ message: "Only free diagnostics are available without an account" });
      }

      const crypto = await import("crypto");
      const guestToken = crypto.randomBytes(32).toString("hex");

      const session = await storage.createTestSession({
        userId: null,
        diagnosticId,
        guestToken,
      });

      const guestId = `guest-${session.id}`;
      const qs = await storage.selectQuestionsForSession(guestId, diagnosticId);
      const safe = qs.map(({ correctAnswer, ...q }) => q);

      res.status(201).json({ session, guestToken, questions: safe });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/submit/:id", async (req, res, next) => {
    try {
      const { answers, guestToken } = req.body;
      if (!Array.isArray(answers)) return res.status(400).json({ message: "answers array required" });
      if (!guestToken) return res.status(400).json({ message: "guestToken required" });

      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.guestToken !== guestToken) return res.status(403).json({ message: "Invalid guest token" });
      if (session.completedAt) return res.status(400).json({ message: "Session already completed" });

      // Look up questions by the IDs in the answers (handles free-pool questions with no diagnosticId)
      const answerQuestionIds = answers.map((a: any) => a.questionId).filter(Boolean);
      const questionRows = answerQuestionIds.length > 0
        ? await db.select().from(questions).where(inArray(questions.id, answerQuestionIds))
        : [];
      const questionMap = new Map(questionRows.map(q => [q.id, q]));

      let correct = 0;
      const sectionResults: Record<string, { correct: number; total: number; totalTime: number; totalExpected: number }> = {};
      const compPace = { total: 0, totalTime: 0, totalExpected: 0 };

      for (let idx = 0; idx < answers.length; idx++) {
        const ans = answers[idx];
        const question = questionMap.get(ans.questionId);
        if (!question) continue;

        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correct++;

        if (!sectionResults[question.section]) {
          sectionResults[question.section] = { correct: 0, total: 0, totalTime: 0, totalExpected: 0 };
        }
        sectionResults[question.section].total++;
        sectionResults[question.section].totalTime += ans.timeTaken || 0;
        sectionResults[question.section].totalExpected += (question.estTimeSeconds as number) || 35;
        if (isCorrect) sectionResults[question.section].correct++;

        if (question.renderType === 'comprehension') {
          compPace.total++;
          compPace.totalTime += ans.timeTaken || 0;
          compPace.totalExpected += (question.estTimeSeconds as number) || 45;
        }

        await storage.createTestAnswer({
          sessionId: session.id,
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
          timeTaken: ans.timeTaken || 0,
          questionOrder: idx,
        });
      }

      // GL-weighted scoring: each section's accuracy is weighted by its share of the real test
      const GL_WEIGHTS: Record<string, number> = {
        "Verbal Reasoning": 0.35,
        "Mathematics": 0.25,
        "Non-Verbal Reasoning": 0.25,
        "English Comprehension": 0.15,
      };
      let weightedNumerator = 0;
      let weightedDenominator = 0;
      for (const [name, data] of Object.entries(sectionResults)) {
        if (data.total === 0) continue;
        const w = GL_WEIGHTS[name] ?? 0.25;
        weightedNumerator += (data.correct / data.total) * w;
        weightedDenominator += w;
      }
      const weightedPct = weightedDenominator > 0 ? weightedNumerator / weightedDenominator : 0;
      // Map to standardised score range 69–141 (GL Assessment floor is ~69)
      const forecastScore = Math.round(69 + weightedPct * 72);
      let band = "Clear Improvement Opportunity";
      if (forecastScore >= 121) band = "On Track";
      else if (forecastScore >= 115) band = "Within Reach";

      const sectionScores = Object.entries(sectionResults).map(([name, data]) => ({
        name,
        score: Math.round((data.correct / data.total) * 100),
        avgTime: Math.round(data.totalTime / data.total),
        total: data.total,
        correct: data.correct,
      }));

      const paceData: { name: string; avg: number; expected: number; isComp: boolean }[] = 
        Object.entries(sectionResults).map(([name, data]) => ({
          name,
          avg: Math.round(data.totalTime / data.total),
          expected: data.totalExpected > 0
            ? Math.round(data.totalExpected / data.total)
            : (name === 'Mathematics' ? 40 : name === 'Non-Verbal Reasoning' ? 38 : 35),
          isComp: false,
        }));

      if (compPace.total > 0) {
        paceData.push({
          name: 'Comprehension',
          avg: Math.round(compPace.totalTime / compPace.total),
          expected: Math.round(compPace.totalExpected / compPace.total),
          isComp: true,
        });
      }

      const completed = await storage.completeTestSession(session.id, {
        totalScore: correct,
        forecastScore,
        band,
        sectionScores,
        paceData,
      });

      res.json(completed);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/guest/results/:id", async (req, res, next) => {
    try {
      const { token } = req.query;

      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId) return res.status(403).json({ message: "Not a guest session" });
      if (!token || session.guestToken !== token) return res.status(403).json({ message: "Invalid token" });

      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/guest/review/:id", async (req, res, next) => {
    try {
      const { token } = req.query;
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId) return res.status(403).json({ message: "Not a guest session" });
      if (!token || session.guestToken !== token) return res.status(403).json({ message: "Invalid token" });
      if (!session.completedAt) return res.status(400).json({ message: "Session not yet completed" });

      const answers = await storage.getSessionAnswers(session.id);
      const questionIds = answers.map(a => a.questionId);
      const questionRows = questionIds.length > 0
        ? await db.select().from(questions).where(inArray(questions.id, questionIds))
        : [];
      const qMap = new Map(questionRows.map(q => [q.id, q]));

      const review = answers
        .sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0))
        .map(a => {
          const q = qMap.get(a.questionId);
          return {
            questionId: a.questionId,
            section: q?.section ?? "Unknown",
            prompt: q?.prompt ?? "",
            options: q?.options ?? [],
            correctAnswer: q?.correctAnswer ?? "",
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
            explanation: q?.explanation ?? null,
            difficulty: q?.difficulty ?? "medium",
          };
        });

      res.json(review);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/email-results", async (req, res, next) => {
    try {
      const { sessionId, guestToken, email } = req.body;
      if (!sessionId || !guestToken || !email) {
        return res.status(400).json({ message: "sessionId, guestToken, and email are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      const session = await storage.getTestSession(sessionId);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.guestToken !== guestToken) return res.status(403).json({ message: "Invalid token" });
      if (!session.completedAt) return res.status(400).json({ message: "Session not yet completed" });

      const { sendGuestResultsEmail } = await import("./email");
      await sendGuestResultsEmail(
        email,
        sessionId,
        guestToken,
        session.forecastScore ?? 0,
        session.band ?? "Not assessed",
      );

      // Schedule the 2-step post-diagnostic nurture (day 2 + day 5)
      try {
        const { enqueueDiagnosticNurture } = await import("./leadMagnet");
        await enqueueDiagnosticNurture(email, sessionId, session.forecastScore, session.band);
      } catch (err) {
        console.error("[Nurture] enqueue failed:", err);
      }

      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/claim/:id", requireAuth, async (req, res, next) => {
    try {
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });

      // Already belongs to this user — idempotent
      if (session.userId === req.user!.id) {
        return res.json(session);
      }

      // Already claimed by a different user
      if (session.userId && session.userId !== req.user!.id) {
        return res.status(403).json({ message: "Session already claimed" });
      }

      // Unclaimed — verify the caller holds the guestToken (proves they took the test)
      const { guestToken } = req.body;
      if (!guestToken || !session.guestToken || guestToken !== session.guestToken) {
        return res.status(403).json({ message: "Invalid or missing session token" });
      }

      const [updated] = await db.update(testSessions)
        .set({ userId: req.user!.id, guestToken: null })
        .where(eq(testSessions.id, req.params.id))
        .returning();

      await storage.migrateGuestUsage(req.params.id, req.user!.id);

      try {
        await storage.evaluateAndAwardBadges(req.user!.id, session.id);
      } catch (err) {
        console.error("[Badges] Failed to evaluate badges on guest claim:", err);
      }

      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/practice-papers/start", requireAuth, async (req, res, next) => {
    try {
      const { paperType } = req.body;
      const paperMap: Record<string, string> = {
        quick: "practice-quick",
        full: "practice-full",
        mock: "practice-mock",
      };

      const diagnosticId = paperMap[paperType];
      if (!diagnosticId) {
        return res.status(400).json({ message: "Invalid paperType. Must be quick, full, or mock." });
      }

      const diag = await storage.getDiagnostic(diagnosticId);
      if (!diag) {
        return res.status(404).json({ message: "Practice paper diagnostic not found. Database may need reseeding." });
      }

      const userRank = TIER_RANK[req.user!.subscriptionTier] || 0;
      const requiredRank = TIER_RANK[diag.requiredTier] || 0;
      if (userRank < requiredRank) {
        return res.status(403).json({ message: "Upgrade required to access this practice paper" });
      }

      const selectedQuestions = await storage.selectQuestionsForPracticePaper(
        req.user!.id,
        diag.questionCount,
        diag.sections,
      );

      const session = await storage.createTestSession({
        userId: req.user!.id,
        diagnosticId,
      });

      const safe = selectedQuestions.map(({ correctAnswer, ...q }) => q);

      res.status(201).json({ session, questions: safe });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/test-sessions", requireAuth, async (req, res, next) => {
    try {
      const { diagnosticId } = req.body;
      if (!diagnosticId) return res.status(400).json({ message: "diagnosticId required" });

      const diag = await storage.getDiagnostic(diagnosticId);
      if (!diag) return res.status(404).json({ message: "Diagnostic not found" });

      const userRank = TIER_RANK[req.user!.subscriptionTier] || 0;
      const requiredRank = TIER_RANK[diag.requiredTier] || 0;
      if (userRank < requiredRank) {
        return res.status(403).json({ message: "Upgrade required to access this diagnostic" });
      }

      const session = await storage.createTestSession({
        userId: req.user!.id,
        diagnosticId,
      });
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/test-sessions", requireAuth, async (req, res, next) => {
    try {
      const sessions = await storage.getUserTestSessions(req.user!.id);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/test-sessions/:id", requireAuth, async (req, res, next) => {
    try {
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId !== req.user!.id && !(req.user as any).isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/test-sessions/:id/pdf", requireAuth, async (req, res, next) => {
    try {
      const user = req.user!;
      const PAID_TIERS = new Set(["pack12","pack12_family","pack_monthly","pack_plus","pack_annual","programme8","programme12","programme16","programme16_family","programme24_plus","early_learner"]);
      if (!user.isAdmin && !PAID_TIERS.has(user.subscriptionTier || "")) {
        return res.status(403).json({ message: "PDF reports require a paid subscription." });
      }
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId !== user.id && !user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!session.completedAt) return res.status(400).json({ message: "Session not yet completed" });

      await ensureChromium();
      const puppeteer = await import("puppeteer");
      const port = process.env.PORT || "5000";
      const url = `http://localhost:${port}/app/results/${req.params.id}/report`;
      const rawCookieHeader = req.headers.cookie || "";

      const browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-first-run","--no-zygote","--single-process"],
      });
      try {
        const page = await browser.newPage();
        if (rawCookieHeader) {
          const cookiePairs = rawCookieHeader.split(";").map(c => c.trim()).filter(Boolean);
          for (const pair of cookiePairs) {
            const eqIdx = pair.indexOf("=");
            if (eqIdx < 0) continue;
            const name = pair.slice(0, eqIdx).trim();
            const value = pair.slice(eqIdx + 1).trim();
            await page.setCookie({ name, value, domain: "localhost", path: "/" });
          }
        }
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await page.emulateMediaType("print");
        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
        });
        const buffer = Buffer.from(pdfBuffer);
        const dateStr = new Date(session.completedAt).toISOString().split("T")[0];
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="bucks-11plus-report-${dateStr}.pdf"`);
        res.setHeader("Content-Length", buffer.length);
        res.send(buffer);
      } finally {
        await browser.close();
      }
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/test-sessions/:id/review", requireAuth, async (req, res, next) => {
    try {
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId !== req.user!.id && !(req.user as any).isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!session.completedAt) return res.status(400).json({ message: "Session not yet completed" });

      const answers = await storage.getSessionAnswers(session.id);
      const questionIds = answers.map(a => a.questionId);
      const questionRows = questionIds.length > 0
        ? await db.select().from(questions).where(inArray(questions.id, questionIds))
        : [];
      const qMap = new Map(questionRows.map(q => [q.id, q]));

      const review = answers
        .sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0))
        .map(a => {
          const q = qMap.get(a.questionId);
          return {
            questionId: a.questionId,
            section: q?.section ?? "Unknown",
            skillId: q?.skillId ?? "",
            subRuleId: q?.subRuleId ?? "",
            prompt: q?.prompt ?? "",
            options: q?.options ?? [],
            correctAnswer: q?.correctAnswer ?? "",
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
            explanation: q?.explanation ?? null,
            difficulty: q?.difficulty ?? "medium",
          };
        });

      res.json(review);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/test-sessions/:id/submit", requireAuth, async (req, res, next) => {
    try {
      const { answers } = req.body;
      if (!Array.isArray(answers)) return res.status(400).json({ message: "answers array required" });

      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId !== req.user!.id && !(req.user as any).isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (session.completedAt) return res.status(400).json({ message: "Session already submitted" });

      const answerIds = answers.map((a: any) => a.questionId).filter(Boolean);
      let allQuestions = answerIds.length > 0
        ? await db.select().from(questions).where(inArray(questions.id, answerIds))
        : await storage.getQuestionsByDiagnostic(session.diagnosticId);
      if (allQuestions.length === 0) {
        allQuestions = await storage.getQuestionsByDiagnostic(session.diagnosticId);
      }
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      let correct = 0;
      const sectionResults: Record<string, { correct: number; total: number; totalTime: number; totalExpected: number }> = {};
      const compPace = { total: 0, totalTime: 0, totalExpected: 0 };
      const answerRecords: AnswerRecord[] = [];

      const diffMap: Record<string, number> = { easy: 2, medium: 3, hard: 4 };

      for (let idx = 0; idx < answers.length; idx++) {
        const ans = answers[idx];
        const question = questionMap.get(ans.questionId);
        if (!question) continue;

        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correct++;

        if (!sectionResults[question.section]) {
          sectionResults[question.section] = { correct: 0, total: 0, totalTime: 0, totalExpected: 0 };
        }
        sectionResults[question.section].total++;
        sectionResults[question.section].totalTime += ans.timeTaken || 0;
        sectionResults[question.section].totalExpected += (question.estTimeSeconds as number) || 35;
        if (isCorrect) sectionResults[question.section].correct++;

        if (question.renderType === 'comprehension') {
          compPace.total++;
          compPace.totalTime += ans.timeTaken || 0;
          compPace.totalExpected += (question.estTimeSeconds as number) || 45;
        }

        await storage.createTestAnswer({
          sessionId: session.id,
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
          timeTaken: ans.timeTaken || 0,
          questionOrder: idx,
        });

        answerRecords.push({
          questionId: ans.questionId,
          section: question.section,
          skillId: question.skillId || '',
          subRuleId: question.subRuleId || '',
          difficulty: diffMap[question.difficulty] ?? 3,
          cognitiveLoad: question.cognitiveLoad ?? 3,
          isCorrect,
          timeSeconds: ans.timeTaken || 0,
          questionOrder: idx,
        });
      }

      // GL-weighted scoring: each section's accuracy is weighted by its share of the real test
      const GL_WEIGHTS_AUTH: Record<string, number> = {
        "Verbal Reasoning": 0.35,
        "Mathematics": 0.25,
        "Non-Verbal Reasoning": 0.25,
        "English Comprehension": 0.15,
      };
      let weightedNum = 0;
      let weightedDen = 0;
      for (const [name, data] of Object.entries(sectionResults)) {
        if (data.total === 0) continue;
        const w = GL_WEIGHTS_AUTH[name] ?? 0.25;
        weightedNum += (data.correct / data.total) * w;
        weightedDen += w;
      }
      const weightedPctAuth = weightedDen > 0 ? weightedNum / weightedDen : 0;
      // Map to standardised score range 69–141 (GL Assessment floor is ~69)
      const forecastScore = Math.round(69 + weightedPctAuth * 72);
      let band = "Clear Improvement Opportunity";
      if (forecastScore >= 121) band = "On Track";
      else if (forecastScore >= 115) band = "Within Reach";

      const sectionScores = Object.entries(sectionResults).map(([name, data]) => ({
        name,
        score: Math.round((data.correct / data.total) * 100),
        avgTime: Math.round(data.totalTime / data.total),
        total: data.total,
        correct: data.correct,
      }));

      const paceData: { name: string; avg: number; expected: number; isComp: boolean }[] =
        Object.entries(sectionResults).map(([name, data]) => ({
          name,
          avg: Math.round(data.totalTime / data.total),
          expected: data.totalExpected > 0
            ? Math.round(data.totalExpected / data.total)
            : (name === 'Mathematics' ? 40 : name === 'Non-Verbal Reasoning' ? 38 : 35),
          isComp: false,
        }));

      if (compPace.total > 0) {
        paceData.push({
          name: 'Comprehension',
          avg: Math.round(compPace.totalTime / compPace.total),
          expected: Math.round(compPace.totalExpected / compPace.total),
          isComp: true,
        });
      }

      const priorSessions = await storage.getUserTestSessions(req.user!.id);
      const historicalRS = priorSessions
        .filter(s => s.completedAt && s.id !== session.id && s.metrics)
        .map(s => (s.metrics as any)?.rs ?? 0)
        .filter((rs: number) => rs > 0);

      const metrics = computeAttemptMetrics(answerRecords, historicalRS);

      const completed = await storage.completeTestSession(session.id, {
        totalScore: correct,
        forecastScore,
        band,
        sectionScores,
        paceData,
        metrics,
      });

      if (PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        try {
          await storage.autoCompleteDiagnosticMilestones(req.user!.id, session.diagnosticId, session.id);
        } catch (err) {
          console.error("[Programme] Failed to auto-complete diagnostic milestone:", err);
        }
      }

      let newBadges: any[] = [];
      try {
        newBadges = await storage.evaluateAndAwardBadges(req.user!.id, session.id);
      } catch (err) {
        console.error("[Badges] Failed to evaluate badges:", err);
      }

      try {
        sendDiagnosticCompleteEmail(req.user!.id, completed).catch(err =>
          console.error("[Email] Diagnostic complete email failed:", err)
        );
      } catch (err) {
        console.error("[Email] Failed to trigger diagnostic email:", err);
      }

      res.json({ ...completed, newBadges });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.json({ available: false, gated: true, message: "Premium Parent Analytics is included with Platform Edge and the Young Scholar Programme." });
      }
      const userId = req.user!.id;
      const sessions = await storage.getUserTestSessions(userId);
      const completed = sessions.filter(s => s.completedAt).sort(
        (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
      );

      if (completed.length === 0) {
        return res.json({ available: false, message: "Complete a diagnostic to see analytics." });
      }

      const latestSession = completed[completed.length - 1];
      const latestAnswerRows = await storage.getSessionAnswers(latestSession.id);
      const answerQuestionIds = latestAnswerRows.map(a => a.questionId);

      let questionRows: any[] = [];
      if (answerQuestionIds.length > 0) {
        questionRows = await db.select().from(questions)
          .where(inArray(questions.id, answerQuestionIds));
      }
      const qMap = new Map(questionRows.map((q: any) => [q.id, q]));

      const diffMap: Record<string, number> = { easy: 2, medium: 3, hard: 4 };

      const latestAnswers: AnswerRecord[] = latestAnswerRows.map((a, idx) => {
        const q = qMap.get(a.questionId);
        return {
          questionId: a.questionId,
          section: q?.section || '',
          skillId: q?.skillId || '',
          subRuleId: q?.subRuleId || '',
          difficulty: diffMap[q?.difficulty] ?? 3,
          cognitiveLoad: q?.cognitiveLoad ?? 3,
          isCorrect: a.isCorrect ?? false,
          timeSeconds: a.timeTaken ?? 0,
          questionOrder: a.questionOrder ?? idx,
        };
      });

      const historicalMetrics: HistoricalMetrics[] = completed
        .filter(s => s.metrics && s.id !== latestSession.id)
        .map(s => ({
          rs: (s.metrics as any)?.rs ?? 0,
          completedAt: (s.completedAt ?? s.startedAt).toISOString(),
        }));

      const drillAnswers: DrillAnswerRecord[] = [];

      const allDiagnosticAnswers: AnswerRecord[] = [];
      for (const sess of completed.slice(-3)) {
        const rows = await storage.getSessionAnswers(sess.id);
        for (const r of rows) {
          const q = qMap.get(r.questionId) || questionRows.find((qq: any) => qq.id === r.questionId);
          if (!q && answerQuestionIds.indexOf(r.questionId) === -1) {
            const [qq] = await db.select().from(questions).where(eq(questions.id, r.questionId));
            if (qq) qMap.set(qq.id, qq);
          }
          const qq = qMap.get(r.questionId);
          allDiagnosticAnswers.push({
            questionId: r.questionId,
            section: qq?.section || '',
            skillId: qq?.skillId || '',
            subRuleId: qq?.subRuleId || '',
            difficulty: diffMap[qq?.difficulty] ?? 3,
            cognitiveLoad: qq?.cognitiveLoad ?? 3,
            isCorrect: r.isCorrect ?? false,
            timeSeconds: r.timeTaken ?? 0,
            questionOrder: r.questionOrder ?? 0,
          });
        }
      }

      const analytics = computeFullAnalytics(latestAnswers, historicalMetrics, drillAnswers, allDiagnosticAnswers);
      res.json({ available: true, ...analytics });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/detail", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.json({ available: false, gated: true });
      }
      const userId = req.user!.id;
      const sessions = await storage.getUserTestSessions(userId);
      const completed = sessions.filter(s => s.completedAt).sort(
        (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
      );

      if (completed.length === 0) {
        return res.json({ available: false });
      }

      const diffMap: Record<string, number> = { easy: 2, medium: 3, hard: 4 };
      const subRuleData: Record<string, {
        skillId: string;
        attempts: number;
        correct: number;
        totalWeight: number;
        correctWeight: number;
        times: number[];
        accuracyHistory: number[];
      }> = {};

      for (const sess of completed.slice(-5)) {
        const rows = await storage.getSessionAnswers(sess.id);
        const sessionSubRuleAcc: Record<string, { correct: number; total: number }> = {};
        for (const r of rows) {
          const [q] = await db.select().from(questions).where(eq(questions.id, r.questionId));
          if (!q) continue;
          const sr = q.subRuleId || 'unknown';
          if (!subRuleData[sr]) subRuleData[sr] = { skillId: q.skillId, attempts: 0, correct: 0, totalWeight: 0, correctWeight: 0, times: [], accuracyHistory: [] };
          subRuleData[sr].attempts++;
          if (r.isCorrect) subRuleData[sr].correct++;

          const dw = ({ 1: 0.85, 2: 0.95, 3: 1.0, 4: 1.15, 5: 1.3 } as Record<number, number>)[diffMap[q.difficulty] ?? 3] ?? 1.0;
          subRuleData[sr].totalWeight += dw;
          if (r.isCorrect) subRuleData[sr].correctWeight += dw;
          subRuleData[sr].times.push(r.timeTaken ?? 0);

          if (!sessionSubRuleAcc[sr]) sessionSubRuleAcc[sr] = { correct: 0, total: 0 };
          sessionSubRuleAcc[sr].total++;
          if (r.isCorrect) sessionSubRuleAcc[sr].correct++;
        }
        for (const [sr, data] of Object.entries(sessionSubRuleAcc)) {
          if (subRuleData[sr]) {
            subRuleData[sr].accuracyHistory.push(data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0);
          }
        }
      }

      const meanArr = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      const stddevArr = (arr: number[]) => {
        if (arr.length < 2) return 0;
        const m = meanArr(arr);
        return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
      };

      const heatmap = Object.entries(subRuleData).map(([subRuleId, d]) => ({
        subRuleId,
        skillId: d.skillId,
        weightedAccuracy: d.totalWeight > 0 ? Math.round((d.correctWeight / d.totalWeight) * 100 * 10) / 10 : 0,
        rawAccuracy: d.attempts > 0 ? Math.round((d.correct / d.attempts) * 100) : 0,
        avgTime: Math.round(meanArr(d.times) * 10) / 10,
        attempts: d.attempts,
        volatility: Math.round(stddevArr(d.accuracyHistory) * 10) / 10,
      }));

      res.json({ available: true, heatmap });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/progress", requireAuth, async (req, res, next) => {
    try {
      const sessions = await storage.getUserTestSessions(req.user!.id);
      const completed = sessions.filter(s => s.completedAt).reverse();

      const trajectory = completed.map((s, i) => ({
        date: `Attempt ${i + 1}`,
        score: s.forecastScore || 0,
        target: 121,
      }));

      const latest = completed.length > 0 ? completed[completed.length - 1] : null;

      let gapVelocity = null;
      let forecastStability = null;

      if (completed.length >= 2) {
        const oldest = completed[0];
        const newest = completed[completed.length - 1];
        const oldGap = Math.abs(121 - (oldest.forecastScore || 0));
        const newGap = Math.abs(121 - (newest.forecastScore || 0));
        gapVelocity = {
          oldGap,
          newGap,
          change: oldGap - newGap,
          attempts: completed.length,
          improving: newGap < oldGap,
        };

        const scores = completed.map(s => s.forecastScore || 0);
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        const recentScores = scores.slice(-3);
        const recentMean = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const recentVariance = recentScores.reduce((a, b) => a + Math.pow(b - recentMean, 2), 0) / recentScores.length;
        const recentStdDev = Math.sqrt(recentVariance);

        forecastStability = {
          stdDev: Math.round(stdDev * 10) / 10,
          status: recentStdDev <= 2 ? "Stable" : recentStdDev <= 5 ? "Improving" : "Variable",
          trend: recentStdDev < stdDev ? "improving" : "steady",
        };
      }

      let totalQuestionsAnswered = 0;
      let totalCorrect = 0;
      for (const s of completed) {
        const ans = await storage.getSessionAnswers(s.id);
        totalQuestionsAnswered += ans.length;
        totalCorrect += ans.filter(a => a.isCorrect).length;
      }

      const sectionAccuracy: Record<string, { correct: number; total: number; pct: number }> = {};
      for (const s of completed) {
        if (s.sectionScores) {
          const scores = typeof s.sectionScores === 'string' ? JSON.parse(s.sectionScores) : s.sectionScores;
          if (Array.isArray(scores)) {
            for (const sec of scores) {
              const name = sec.name || "Unknown";
              if (!sectionAccuracy[name]) sectionAccuracy[name] = { correct: 0, total: 0, pct: 0 };
              sectionAccuracy[name].correct += sec.correct || 0;
              sectionAccuracy[name].total += sec.total || 0;
            }
          }
        }
      }
      for (const k of Object.keys(sectionAccuracy)) {
        sectionAccuracy[k].pct = sectionAccuracy[k].total > 0 ? Math.round((sectionAccuracy[k].correct / sectionAccuracy[k].total) * 100) : 0;
      }

      res.json({
        trajectory,
        latestForecast: latest?.forecastScore || null,
        latestBand: latest?.band || null,
        totalAttempts: completed.length,
        velocity: completed.length >= 2
          ? (completed[completed.length - 1].forecastScore || 0) - (completed[0].forecastScore || 0)
          : 0,
        gapVelocity,
        forecastStability,
        totalQuestionsAnswered,
        overallAccuracy: totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0,
        sectionAccuracy,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.json({ enrolled: false });
      }
      let enrolment = await storage.getProgrammeEnrolment(req.user!.id);
      if (!enrolment) {
        // Auto-enrol: user has a programme tier but no enrolment record.
        // This happens for accounts assigned a tier outside the normal checkout
        // flow (e.g. admin accounts, manual tier updates). Create it now.
        enrolment = await storage.createProgrammeEnrolment(req.user!.id);
      }

      const milestones = await storage.getProgrammeMilestones(req.user!.id);
      const plans = await storage.getWeeklyPlans(req.user!.id);

      const now = new Date();
      const msElapsed = now.getTime() - enrolment.startAt.getTime();
      const currentWeek = Math.min(16, Math.max(1, Math.ceil(msElapsed / (7 * 24 * 60 * 60 * 1000))));
      const daysRemaining = Math.max(0, Math.ceil((enrolment.endAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

      if (currentWeek !== enrolment.currentWeek) {
        await storage.updateEnrolmentWeek(enrolment.id, currentWeek);
      }

      const existingWeeks = new Set(plans.map(p => p.week));
      if (!existingWeeks.has(currentWeek)) {
        const sessions = await storage.getUserTestSessions(req.user!.id);
        const latestCompleted = sessions.find(s => s.completedAt);
        await storage.generateWeeklyPlan(req.user!.id, enrolment.id, currentWeek, latestCompleted || null);
      }

      const updatedPlans = await storage.getWeeklyPlans(req.user!.id);

      res.json({
        enrolled: true,
        enrolment: { ...enrolment, currentWeek },
        milestones,
        plans: updatedPlans,
        currentWeek,
        daysRemaining,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/programme/milestones/:id/complete", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.status(403).json({ message: "Programme access required" });
      }
      const { sessionId } = req.body;
      const milestone = await storage.completeMilestone(req.params.id, sessionId, req.user!.id);
      if (!milestone) return res.status(404).json({ message: "Milestone not found or not authorised" });
      res.json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme/tasks", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.status(403).json({ message: "Programme access required" });
      }
      const week = req.query.week ? parseInt(req.query.week as string) : undefined;
      const tasks = await storage.getProgrammeTasks(req.user!.id, week);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/programme/tasks/generate", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.status(403).json({ message: "Programme access required" });
      }
      const enrolment = await storage.getProgrammeEnrolment(req.user!.id);
      if (!enrolment) return res.status(404).json({ message: "No active enrolment" });

      const week = req.body.week || enrolment.currentWeek;
      const tasks = await storage.generateWeeklyTasks(req.user!.id, enrolment.id, week);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme/completion-summary", requireAuth, async (req, res, next) => {
    try {
      if (!PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        return res.status(403).json({ message: "Programme access required" });
      }
      const sessions = await storage.getUserTestSessions(req.user!.id);
      const completed = sessions.filter(s => s.completedAt).reverse();

      if (completed.length < 2) {
        return res.json({ available: false, message: "Not enough data for summary" });
      }

      const baseline = completed[0];
      const final = completed[completed.length - 1];

      const baselineSections: any[] = (baseline.sectionScores as any) || [];
      const finalSections: any[] = (final.sectionScores as any) || [];

      const sectionComparison = finalSections.map(fs => {
        const bs = baselineSections.find(b => b.name === fs.name);
        return {
          name: fs.name,
          baselineScore: bs?.score || 0,
          finalScore: fs.score,
          improvement: fs.score - (bs?.score || 0),
        };
      });

      const strongest = [...sectionComparison].sort((a, b) => b.finalScore - a.finalScore);
      const risks = sectionComparison.filter(s => s.finalScore < 70);

      res.json({
        available: true,
        baselineForecast: baseline.forecastScore,
        finalForecast: final.forecastScore,
        gapReduction: Math.abs(121 - (baseline.forecastScore || 0)) - Math.abs(121 - (final.forecastScore || 0)),
        sectionComparison,
        strongestSkills: strongest.slice(0, 2).map(s => s.name),
        remainingRisks: risks.map(s => s.name),
        totalAttempts: completed.length,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/articles", async (_req, res, next) => {
    try {
      const arts = await storage.getArticles();
      res.json(arts);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/articles/:slug", async (req, res, next) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) return res.status(404).json({ message: "Article not found" });
      res.json(article);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/practice-sections", async (_req, res, next) => {
    try {
      const sections = await storage.getPracticeSections();
      res.json(sections);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/practice-sections/:id/questions", requireAuth, async (req, res, next) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const sectionId = req.params.id;

      const section = await storage.getPracticeSection(sectionId);
      if (!section) return res.status(404).json({ message: "Practice section not found" });
      const userRank = TIER_RANK[req.user!.subscriptionTier || "free"] || 0;
      const requiredRank = TIER_RANK[section.requiredTier] || 0;
      if (userRank < requiredRank) {
        return res.status(403).json({ message: "This drill requires a higher subscription tier." });
      }

      console.log(`[Drill] Fetching questions for section: ${sectionId}`);
      
      const { questions: qs, exhaustionWarning } = await storage.getQuestionsForDrill(sectionId, req.user!.id, 10);
      console.log(`[Drill] Found ${qs.length} questions for section ${sectionId}`);
      
      const safe = qs.map(({ correctAnswer, ...q }) => q);
      res.json({ questions: safe, exhaustion_warning: exhaustionWarning });
    } catch (error) {
      console.error(`[Drill] Error fetching questions:`, error);
      res.status(500).json({ message: "Failed to load practice questions" });
    }
  });

  app.post("/api/practice-sections/:id/check-answer", requireAuth, async (req, res, next) => {
    try {
      const { questionId, selectedAnswer } = req.body;
      const question = await storage.getQuestion(questionId);
      if (!question) return res.status(404).json({ message: "Question not found" });
      const isCorrect = selectedAnswer === question.correctAnswer;

      res.json({ isCorrect, correctAnswer: question.correctAnswer, explanation: question.explanation });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/practice-sections/:id/submit-timed", requireAuth, async (req, res, next) => {
    try {
      const { answers } = req.body;
      if (!Array.isArray(answers)) return res.status(400).json({ message: "answers array required" });

      const results: Array<{
        questionId: string;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string | null;
      }> = [];

      let correct = 0;
      for (const ans of answers) {
        const question = await storage.getQuestion(ans.questionId);
        if (!question) continue;
        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correct++;
        results.push({
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        });
      }

      if (PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        try {
          const enrolment = await storage.getProgrammeEnrolment(req.user!.id);
          if (enrolment) {
            await storage.autoCompletePracticeMilestone(req.user!.id, enrolment.currentWeek);
            const firstQ = results[0];
            const q = firstQ ? await storage.getQuestion(firstQ.questionId) : null;
            await storage.incrementTaskProgress(req.user!.id, 'drill', q?.skillId || undefined);
          }
        } catch (err) {
          console.error("[Programme] Failed to track timed drill:", err);
        }
      }

      res.json({ results, correct, total: results.length });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/practice-sections/:id/complete-drill", requireAuth, async (req, res, next) => {
    try {
      if (PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "")) {
        const enrolment = await storage.getProgrammeEnrolment(req.user!.id);
        if (enrolment) {
          await storage.autoCompletePracticeMilestone(req.user!.id, enrolment.currentWeek);
          const { skillId } = req.body;
          await storage.incrementTaskProgress(req.user!.id, 'drill', skillId || undefined);
        }
      }
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });


  app.get("/api/badges", async (_req, res, next) => {
    try {
      const allBadges = await storage.getAllBadges();
      res.json(allBadges);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/badges/mine", requireAuth, async (req, res, next) => {
    try {
      const earned = await storage.getUserBadges(req.user!.id);
      res.json(earned);
    } catch (error) {
      next(error);
    }
  });

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  app.post("/api/admin/seed-free-pool", requireAdmin, async (_req, res, next) => {
    try {
      await ensureFreePool();
      const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(questions).where(eq(questions.freePool, true));
      res.json({ success: true, freePoolCount: Number(count) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/repair-seed-data", requireAdmin, async (_req, res, next) => {
    try {
      await repairSeedQuestions();
      const [freePoolResult] = await db.select({ count: sql<number>`count(*)` }).from(questions).where(eq(questions.freePool, true));
      if (Number(freePoolResult.count) === 0) {
        await ensureFreePool();
      }
      const [{ total }] = await db.select({ total: sql<number>`count(*)` }).from(questions).where(eq(questions.qaStatus, "approved"));
      const [{ freePool }] = await db.select({ freePool: sql<number>`count(*)` }).from(questions).where(eq(questions.freePool, true));
      res.json({ success: true, approvedQuestions: Number(total), freePoolQuestions: Number(freePool) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/questions", requireAdmin, async (req, res, next) => {
    try {
      const filters: any = {};
      if (req.query.section) filters.section = req.query.section;
      if (req.query.skillId) filters.skillId = req.query.skillId;
      if (req.query.difficulty) filters.difficulty = req.query.difficulty;
      if (req.query.qaStatus) filters.qaStatus = req.query.qaStatus;
      if (req.query.renderType) filters.renderType = req.query.renderType;
      const qs = await storage.getAllQuestions(filters);
      res.json(qs);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/questions/qa-queue", requireAdmin, async (req, res, next) => {
    try {
      const qs = await storage.getQuestionsByQaStatus("review");
      res.json(qs);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/questions/stats", requireAdmin, async (_req, res, next) => {
    try {
      const all = await storage.getAllQuestions();
      const stats = {
        total: all.length,
        byStatus: { draft: 0, review: 0, approved: 0, rejected: 0 } as Record<string, number>,
        bySection: {} as Record<string, number>,
        byRenderType: {} as Record<string, number>,
      };
      for (const q of all) {
        stats.byStatus[q.qaStatus] = (stats.byStatus[q.qaStatus] || 0) + 1;
        stats.bySection[q.section] = (stats.bySection[q.section] || 0) + 1;
        stats.byRenderType[q.renderType] = (stats.byRenderType[q.renderType] || 0) + 1;
      }
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/questions/:id", requireAdmin, async (req, res, next) => {
    try {
      const q = await storage.getQuestion(req.params.id);
      if (!q) return res.status(404).json({ message: "Question not found" });
      res.json(q);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/questions", requireAdmin, async (req, res, next) => {
    try {
      const q = await storage.createQuestion(req.body);
      res.status(201).json(q);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/questions/:id", requireAdmin, async (req, res, next) => {
    try {
      const q = await storage.updateQuestion(req.params.id, req.body);
      res.json(q);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/questions/:id", requireAdmin, async (req, res, next) => {
    try {
      await storage.deleteQuestion(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/questions/:id/approve", requireAdmin, async (req, res, next) => {
    try {
      const q = await storage.approveQuestion(req.params.id);
      res.json(q);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/questions/:id/reject", requireAdmin, async (req, res, next) => {
    try {
      const q = await storage.rejectQuestion(req.params.id);
      res.json(q);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/switch-tier", requireAdmin, async (req, res, next) => {
    try {
      const { tier } = req.body;
      const validTiers = ["free", "early_learner", "pack12", "pack12_family", "pack_monthly", "pack_plus", "pack_annual", "programme8", "programme12", "programme16", "programme16_family", "programme24_plus"];
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }
      const user = await storage.updateUserSubscription(req.user!.id, tier);
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guide-leads", async (req, res, next) => {
    try {
      const parsed = insertGuideLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Please provide your name and email address." });
      }
      const lead = await storage.createGuideLead(parsed.data);
      res.json({ id: lead.id, success: true });
      sendGuideDownloadUserEmail(parsed.data.parentName, parsed.data.email).catch(err => console.error('[GuideEmail] User email failed:', err));
      sendGuideDownloadAdminEmail(parsed.data.parentName, parsed.data.email, new Date()).catch(err => console.error('[GuideEmail] Admin email failed:', err));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guide-leads/:id/diagnostic-click", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const lead = await storage.markGuideLeadDiagnosticClick(id);
      res.json({ success: !!lead });
    } catch (error) {
      next(error);
    }
  });

  let pdfCache: { buffer: Buffer; generatedAt: number } | null = null;
  const PDF_CACHE_TTL_MS = 60 * 60 * 1000;

  app.get("/api/guide/pdf", async (req, res, next) => {
    try {
      if (pdfCache && Date.now() - pdfCache.generatedAt < PDF_CACHE_TTL_MS) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="bucks-11-plus-parent-guide.pdf"');
        res.setHeader("Content-Length", pdfCache.buffer.length);
        return res.send(pdfCache.buffer);
      }

      await ensureChromium();
      const puppeteer = await import("puppeteer");
      const port = process.env.PORT || "5000";
      const url = `http://localhost:${port}/guide-print`;

      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
        ],
      });

      try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await page.emulateMediaType("print");
        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
        });
        const buffer = Buffer.from(pdfBuffer);
        pdfCache = { buffer, generatedAt: Date.now() };

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="bucks-11-plus-parent-guide.pdf"');
        res.setHeader("Content-Length", buffer.length);
        res.send(buffer);
      } finally {
        await browser.close();
      }
    } catch (error) {
      next(error);
    }
  });

  // ── Free Practice Paper lead magnet ────────────────────────────────────
  app.post("/api/leads/practice-paper", async (req, res, next) => {
    try {
      const { email, source } = req.body as { email?: string; source?: string };
      if (!email) return res.status(400).json({ message: "Email required" });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email address" });

      const { recordPracticePaperLead, sendPracticePaperEmail } = await import("./leadMagnet");
      const { id } = await recordPracticePaperLead(email, source ?? null);
      sendPracticePaperEmail(email, id).catch((err) =>
        console.error("[LeadMagnet] send error:", err),
      );
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/leads/practice-paper/pdf", async (req, res, next) => {
    try {
      const { id, token } = req.query as { id?: string; token?: string };
      const leadId = Number(id);
      if (!Number.isFinite(leadId) || !token) return res.status(400).send("Invalid link");

      const { practicePaperLeads } = await import("@shared/schema");
      const [lead] = await db
        .select()
        .from(practicePaperLeads)
        .where(eq(practicePaperLeads.id, leadId))
        .limit(1);
      if (!lead) return res.status(404).send("Not found");

      const { verifyPaperToken, getCachedPracticePaperPdf, markPracticePaperDownloaded } =
        await import("./leadMagnet");
      if (!verifyPaperToken(leadId, lead.email, token)) return res.status(403).send("Invalid token");

      const buffer = await getCachedPracticePaperPdf();
      markPracticePaperDownloaded(leadId).catch(() => {});

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="bucks-11-plus-free-practice-paper.pdf"',
      );
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/leads/practice-paper/unsubscribe", async (req, res) => {
    const { email, token } = req.query as { email?: string; token?: string };
    if (!email || !token) return res.status(400).send("Invalid link");
    const { verifyNurtureUnsubToken, unsubscribeFromNurture } = await import("./leadMagnet");
    if (!verifyNurtureUnsubToken(email, token)) return res.status(403).send("Invalid token");
    await unsubscribeFromNurture(email);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;text-align:center;color:#0d1f30;">
<h1 style="font-family:Georgia,serif;">You're unsubscribed</h1>
<p style="color:#475569;">You won't receive any more 11+ tips from us. You can still browse the site any time.</p>
<p><a href="https://bucks11plustest.co.uk" style="color:#0d1f30;">Back to Bucks 11 Plus Tests</a></p>
</body></html>`);
  });

  app.get("/api/child-profiles", requireAuth, async (req, res, next) => {
    try {
      const profiles = await storage.getChildProfiles(req.user!.id);
      res.json(profiles);
    } catch (error) { next(error); }
  });

  app.post("/api/child-profiles", requireAuth, async (req, res, next) => {
    try {
      const userTier = req.user!.subscriptionTier;
      if (!userTier?.includes("family")) {
        return res.status(403).json({ message: "Child profiles require a family plan" });
      }
      const existing = await storage.getChildProfiles(req.user!.id);
      if (existing.length >= 3) {
        return res.status(400).json({ message: "Maximum 3 child profiles allowed" });
      }
      const { childYear, practiceHours, difficultyAreas } = req.body;
      if (!childYear) {
        return res.status(400).json({ message: "Child year is required" });
      }
      const profile = await storage.createChildProfile({
        userId: req.user!.id,
        childYear,
        practiceHours: practiceHours || null,
        difficultyAreas: difficultyAreas || null,
        stage: "exploring",
      });
      if (existing.length === 0) {
        await storage.setActiveChildProfile(req.user!.id, profile.id);
      }
      res.json(profile);
    } catch (error) { next(error); }
  });

  app.put("/api/child-profiles/:id", requireAuth, async (req, res, next) => {
    try {
      const profile = await storage.getChildProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      // Strict allow-list to avoid mass-assignment. childName / targetSchool
      // were removed from the database in May 2026 (data minimisation) — any
      // legacy client still sending them is silently ignored.
      const childProfileUpdateSchema = z.object({
        childYear: z.string().min(1).optional(),
        practiceHours: z.string().nullable().optional(),
        difficultyAreas: z.array(z.string()).nullable().optional(),
        stage: z.enum(["exploring", "developing", "ready"]).optional(),
      });
      const parsed = childProfileUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid update payload" });
      }
      const updated = await storage.updateChildProfile(req.params.id, parsed.data);
      res.json(updated);
    } catch (error) { next(error); }
  });

  app.delete("/api/child-profiles/:id", requireAuth, async (req, res, next) => {
    try {
      const profile = await storage.getChildProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      await storage.deleteChildProfile(req.params.id);
      const user = await storage.getUser(req.user!.id);
      if (user?.activeChildProfileId === req.params.id) {
        const remaining = await storage.getChildProfiles(req.user!.id);
        await storage.setActiveChildProfile(req.user!.id, remaining.length > 0 ? remaining[0].id : null);
      }
      res.json({ success: true });
    } catch (error) { next(error); }
  });

  app.put("/api/child-profiles/:id/activate", requireAuth, async (req, res, next) => {
    try {
      const profile = await storage.getChildProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const user = await storage.setActiveChildProfile(req.user!.id, req.params.id);
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) { next(error); }
  });

  app.get("/api/simulator-questions", requireAuth, async (req, res, next) => {
    try {
      const isProgramme = PROGRAMME_TIERS.has(req.user!.subscriptionTier ?? "");
      if (!isProgramme) {
        return res.status(403).json({ message: "Programme tier required" });
      }

      const paper1 = await storage.selectQuestionsForPracticePaper(
        req.user!.id,
        25,
        ["Verbal Reasoning", "English Comprehension", "Mathematics"],
      );
      const paper2 = await storage.selectQuestionsForPracticePaper(
        req.user!.id,
        25,
        ["Non-Verbal Reasoning", "English Comprehension", "Mathematics"],
      );

      const mapQ = (q: any) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer,
        section: q.section,
        explanation: q.explanation,
        difficulty: q.difficulty,
      });

      res.json({
        paper1: paper1.map(mapQ),
        paper2: paper2.map(mapQ),
      });
    } catch (error) { next(error); }
  });

  app.get("/api/test-day-config", requireAuth, async (req, res, next) => {
    try {
      const config = await storage.getTestDayConfig(req.user!.id);
      res.json(config || null);
    } catch (error) { next(error); }
  });

  app.put("/api/test-day-config", requireAuth, async (req, res, next) => {
    try {
      const { examDate } = req.body;
      if (!examDate) {
        return res.status(400).json({ message: "Exam date is required" });
      }
      const config = await storage.setTestDayConfig({
        userId: req.user!.id,
        examDate: new Date(examDate),
      });
      res.json(config);
    } catch (error) { next(error); }
  });

  const handleUnsubscribe = async (token: string, userId: string, res: any) => {
    const crypto = await import("crypto");
    const secret = process.env.EMAIL_SECRET || "11plus-email-secret";
    const expected = crypto.createHmac("sha256", secret).update(userId).digest("hex");
    if (token !== expected) {
      return res.status(403).send("<html><body><h2>Invalid unsubscribe link</h2><p>This link may have expired or is invalid.</p></body></html>");
    }
    await db.update(users).set({ emailUnsubscribedAt: new Date(), emailConsent: false }).where(eq(users.id, userId));
    res.send("<html><body style='font-family:sans-serif;max-width:500px;margin:60px auto;text-align:center;'><h2>Unsubscribed</h2><p>You have been successfully unsubscribed from Bucks 11 Plus Tests emails.</p><p><a href='/'>Return to site</a></p></body></html>");
  };

  app.get("/api/email/unsubscribe", async (req, res, next) => {
    try {
      const { token, userId } = req.query;
      if (!token || !userId) {
        return res.status(400).send("<html><body><h2>Invalid link</h2></body></html>");
      }
      await handleUnsubscribe(token as string, userId as string, res);
    } catch (error) { next(error); }
  });

  app.post("/api/email/unsubscribe", async (req, res, next) => {
    try {
      const { token, userId } = req.body;
      if (!token || !userId) {
        return res.status(400).json({ message: "Missing token or userId" });
      }
      await handleUnsubscribe(token, userId, res);
    } catch (error) { next(error); }
  });

  // -----------------------------------------------------------------------
  // Email verification (soft-block) — clicking the link in the verification
  // email flips email_verified=true. Token is HMAC(EMAIL_SECRET, userId+":verify")
  // so no per-user state is needed; replay is harmless because the only effect
  // is to set the flag we already want set. Resend is throttled per-user.
  // -----------------------------------------------------------------------
  const verifyResendThrottle = new Map<string, number>();
  const VERIFY_RESEND_COOLDOWN_MS = 5 * 60 * 1000;

  app.get("/api/email/verify", async (req, res) => {
    const userId = String(req.query.userId || "");
    const token = String(req.query.token || "");
    if (!userId || !token) {
      return res.redirect("/app/account?verified=0&reason=missing");
    }
    try {
      const expected = await generateEmailVerifyToken(userId);
      const a = Buffer.from(token, "utf8");
      const b = Buffer.from(expected, "utf8");
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return res.redirect("/app/account?verified=0&reason=invalid");
      }
      await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));
      return res.redirect("/app/account?verified=1");
    } catch (err) {
      console.error("[EmailVerify] Failed:", err);
      return res.redirect("/app/account?verified=0&reason=error");
    }
  });

  app.post("/api/email/verify/resend", requireAuth, async (req, res) => {
    const user = req.user!;
    if (user.emailVerified) {
      return res.json({ message: "Email already verified." });
    }
    const target = user.email || user.username;
    if (!target || !target.includes("@")) {
      return res.status(400).json({ message: "No email address on file. Please add one in Account Settings." });
    }
    const last = verifyResendThrottle.get(user.id) ?? 0;
    const elapsed = Date.now() - last;
    if (elapsed < VERIFY_RESEND_COOLDOWN_MS) {
      const waitS = Math.ceil((VERIFY_RESEND_COOLDOWN_MS - elapsed) / 1000);
      return res.status(429).json({
        message: `Please wait ${Math.ceil(waitS / 60)} minute${waitS > 60 ? "s" : ""} before requesting another verification email.`,
      });
    }
    verifyResendThrottle.set(user.id, Date.now());
    sendEmailVerificationEmail(user.id, target).catch((e) =>
      console.error("[EmailVerify] Resend failed:", e),
    );
    return res.json({ message: "Verification email sent. Check your inbox (and spam folder)." });
  });

  app.put("/api/user/email-consent", requireAuth, async (req, res, next) => {
    try {
      const { consent } = req.body;
      const updates: any = { emailConsent: !!consent };
      if (consent) {
        updates.emailUnsubscribedAt = null;
      }
      await db.update(users).set(updates).where(eq(users.id, req.user!.id));
      const user = await storage.getUser(req.user!.id);
      const { password: _, ...safeUser } = user!;
      res.json(safeUser);
    } catch (error) { next(error); }
  });

  app.post("/api/contact/chat", async (req, res, next) => {
    try {
      const { name, email, message } = req.body;
      if (!email || !message) return res.status(400).json({ message: "Email and message are required" });

      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM = process.env.RESEND_FROM_EMAIL || "Bucks 11 Plus Tests <noreply@bucks11plustest.co.uk>";

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#f0f4f8;border-left:4px solid #0d1f30;padding:12px;margin-bottom:20px;font-size:13px;color:#475569">
            <strong>Source:</strong> Bucks 11 Plus Tests — bucks11plustest.co.uk
          </div>
          <h2 style="color:#1e3a5f">Chat Widget Enquiry</h2>
          <p><strong>From:</strong> ${name || "(not given)"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border:1px solid #e2e8f0;margin:16px 0"/>
          <p style="white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>`;

      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: FROM,
            to: ["support@bucks11plustest.co.uk"],
            reply_to: email,
            subject: `[Bucks 11 Plus Tests] Chat enquiry from ${name || email}`,
            html,
          }),
        });
      } else {
        console.log(`[Chat] No RESEND_API_KEY — suppressed outbound chat message`);
      }

      res.json({ success: true });
    } catch (error) { next(error); }
  });

  app.post("/api/contact/enquiry", async (req, res, next) => {
    try {
      const { name, email, enquiryType, message } = req.body;
      if (!email || !message) return res.status(400).json({ message: "Email and message are required" });

      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM = process.env.RESEND_FROM_EMAIL || "Bucks 11 Plus Tests <noreply@bucks11plustest.co.uk>";

      const enquiryTypeLabel = {
        general: "General Enquiry",
        billing: "Account / Billing",
        technical: "Technical Issue",
        refund: "Refund Request",
        other: "Other"
      }[enquiryType] || enquiryType;

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#f0f4f8;border-left:4px solid #0d1f30;padding:12px;margin-bottom:20px;font-size:13px;color:#475569">
            <strong>Source:</strong> Bucks 11 Plus Tests — bucks11plustest.co.uk
          </div>
          <h2 style="color:#1e3a5f">${enquiryTypeLabel}</h2>
          <p><strong>From:</strong> ${name || "(not given)"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border:1px solid #e2e8f0;margin:16px 0"/>
          <p style="white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>`;

      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: FROM,
            to: ["support@bucks11plustest.co.uk"],
            reply_to: email,
            subject: `[Bucks 11 Plus Tests] ${enquiryTypeLabel} — ${name || email}`,
            html,
          }),
        });
      } else {
        console.log(`[Enquiry] No RESEND_API_KEY — suppressed outbound enquiry message`);
      }

      res.json({ success: true });
    } catch (error) { next(error); }
  });

  // ─── robots.txt ──────────────────────────────────────────────────────────
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /

Sitemap: https://bucks11plustest.co.uk/sitemap.xml

Disallow: /app/
Disallow: /api/
Disallow: /sign-in
Disallow: /sign-up
Disallow: /forgot-password
Disallow: /reset-password
`);
  });

  // ─── SSR town guides ─────────────────────────────────────────────────────
  for (const town of ssrTowns) {
    app.get(`/bucks-11-plus-${town.slug}`, (_req, res) => {
      const html = getTownHtml(town.slug);
      if (!html) { res.status(404).send("Not found"); return; }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    });
  }

  // ─── SSR grammar school guides ───────────────────────────────────────────
  for (const school of ssrGrammarSchools) {
    app.get(`/grammar-schools/${school.slug}`, (_req, res) => {
      const html = getGrammarSchoolHtml(school.slug);
      if (!html) { res.status(404).send("Not found"); return; }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    });
  }

  // ─── SSR subject guides ──────────────────────────────────────────────────
  const subjectRoutes: Record<string, string> = {
    "/11-plus-verbal-reasoning-practice": "verbal-reasoning",
    "/11-plus-non-verbal-reasoning-practice": "non-verbal-reasoning",
    "/11-plus-maths-practice": "maths",
    "/11-plus-comprehension-practice": "comprehension",
  };
  for (const [path, subject] of Object.entries(subjectRoutes)) {
    app.get(path, (_req, res) => {
      const html = getSubjectGuideHtml(subject);
      if (!html) { res.status(404).send("Not found"); return; }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    });
  }

  // ─── SSR year group guides ───────────────────────────────────────────────
  for (const year of [4, 5, 6]) {
    app.get(`/preparing-for-11-plus-year-${year}`, (_req, res) => {
      const html = getYearGroupGuideHtml(year);
      if (!html) { res.status(404).send("Not found"); return; }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    });
  }

  // ─── SSR learn hub ───────────────────────────────────────────────────────
  app.get("/learn", (_req, res) => {
    const html = getLearnHubHtml();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800");
    res.send(html);
  });

  // ─── SSR learn articles ──────────────────────────────────────────────────
  for (const article of learnArticles) {
    app.get(`/learn/${article.slug}`, (_req, res) => {
      const html = getLearnArticleHtml(article.slug);
      if (!html) { res.status(404).send("Not found"); return; }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    });
  }

  // ─── SSR high-volume pages ────────────────────────────────────────────────
  const highVolumeRoutes: Array<[string, () => string]> = [
    ["/bucks-11-plus-test-date-2026", getTestDate2026Html],
    ["/bucks-11-plus-test-date-2025", getTestDate2025Html],
    ["/bucks-11-plus-past-papers", getPastPapersHtml],
    ["/bucks-11-plus-practice-papers", getPastPapersHtml],
    ["/bucks-11-plus-results", getResultsGuideHtml],
    ["/when-do-bucks-11-plus-results-come-out", getResultsGuideHtml],
    ["/bucks-11-plus-sample-questions", getSampleQuestionsHtml],
    ["/bucks-11-plus-score-calculator", getScoreGuideHtml],
    ["/bucks-11-plus-how-scoring-works", getScoreGuideHtml],
    ["/11-plus-tutors-buckinghamshire", getTutorsGuideHtml],
    ["/11-plus-tutors-high-wycombe", getTutorsGuideHtml],
    ["/11-plus-tutors-aylesbury", getTutorsGuideHtml],
    ["/bucks-11-plus-appeals", getAppealsGuideHtml],
    ["/bucks-11-plus-registration-guide", getRegistrationDetailedHtml],
  ];

  for (const [path, generator] of highVolumeRoutes) {
    app.get(path, (_req, res) => {
      const html = generator();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=7200");
      res.send(html);
    });
  }

  // ─── SSR glossary ─────────────────────────────────────────────────────────
  app.get("/glossary", (_req, res) => {
    const html = getGlossaryIndexHtml();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(html);
  });

  app.get("/glossary/:slug", (req, res, next) => {
    const html = getGlossaryTermHtml(req.params.slug);
    if (!html) { next(); return; } // fall through to SPA for client-only slugs
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(html);
  });

  app.get("/sitemap.xml", async (_req, res) => {
    const baseUrl = "https://bucks11plustest.co.uk";
    const today = new Date().toISOString().split("T")[0];

    const townSlugs = [
      "high-wycombe", "aylesbury", "beaconsfield", "amersham",
      "chesham", "gerrards-cross", "marlow", "princes-risborough",
      "great-missenden", "wendover", "chalfont-st-giles",
      "hazlemere", "buckingham", "flackwell-heath",
    ];

    const grammarSchoolSlugs = [
      "royal-grammar-school-high-wycombe",
      "wycombe-high-school",
      "john-hampden-grammar-school",
      "sir-william-borlases-grammar-school",
      "dr-challoners-grammar-school",
      "dr-challoners-high-school",
      "beaconsfield-high-school",
      "chesham-grammar-school",
      "aylesbury-grammar-school",
      "aylesbury-high-school",
      "sir-henry-floyd-grammar-school",
      "burnham-grammar-school",
      "the-royal-latin-school",
    ];

    let parentHubSlugs: string[] = [];
    try {
      const hubArticles = await storage.getArticles();
      parentHubSlugs = hubArticles.map(a => a.slug);
    } catch {
      // silently skip if DB unavailable
    }

    interface SitemapEntry { path: string; priority: string; changefreq: string; }

    const entries: SitemapEntry[] = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/free-diagnostic", priority: "0.9", changefreq: "monthly" },
      { path: "/pricing", priority: "0.8", changefreq: "monthly" },
      { path: "/how-it-works", priority: "0.8", changefreq: "monthly" },
      { path: "/how-forecast-works", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-gl-alignment", priority: "0.8", changefreq: "monthly" },
      { path: "/about", priority: "0.8", changefreq: "monthly" },
      { path: "/contact", priority: "0.8", changefreq: "monthly" },
      { path: "/buckinghamshire-11-plus-guide", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-parent-guide", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-grammar-schools", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-qualifying-score", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-timeline", priority: "0.8", changefreq: "monthly" },
      { path: "/buckinghamshire-secondary-transfer-test", priority: "0.8", changefreq: "monthly" },
      { path: "/how-to-pass-bucks-11-plus", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-registration", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-mistakes", priority: "0.8", changefreq: "monthly" },
      { path: "/parent-hub", priority: "0.8", changefreq: "monthly" },
      { path: "/learn", priority: "0.8", changefreq: "weekly" },
      ...learnArticles.map(a => ({ path: `/learn/${a.slug}`, priority: "0.8", changefreq: "monthly" as const })),
      ...parentHubSlugs.map(s => ({ path: `/parent-hub/${s}`, priority: "0.7", changefreq: "monthly" as const })),
      ...townSlugs.map(t => ({ path: `/bucks-11-plus-${t}`, priority: "0.8", changefreq: "monthly" as const })),
      ...grammarSchoolSlugs.map(s => ({ path: `/grammar-schools/${s}`, priority: "0.8", changefreq: "monthly" as const })),
      { path: "/preparing-for-11-plus-year-4", priority: "0.8", changefreq: "monthly" },
      { path: "/preparing-for-11-plus-year-5", priority: "0.8", changefreq: "monthly" },
      { path: "/preparing-for-11-plus-year-6", priority: "0.8", changefreq: "monthly" },
      { path: "/11-plus-verbal-reasoning-practice", priority: "0.8", changefreq: "monthly" },
      { path: "/11-plus-non-verbal-reasoning-practice", priority: "0.8", changefreq: "monthly" },
      { path: "/11-plus-maths-practice", priority: "0.8", changefreq: "monthly" },
      { path: "/11-plus-comprehension-practice", priority: "0.8", changefreq: "monthly" },
      { path: "/terms", priority: "0.3", changefreq: "yearly" },
      { path: "/privacy", priority: "0.3", changefreq: "yearly" },
      { path: "/safeguarding", priority: "0.3", changefreq: "yearly" },
      { path: "/refund-policy", priority: "0.3", changefreq: "yearly" },
      { path: "/glossary", priority: "0.8", changefreq: "monthly" },
      ...GLOSSARY_TERMS.map(t => ({ path: `/glossary/${t.slug}`, priority: "0.7", changefreq: "monthly" as const })),
      { path: "/bucks-11-plus-test-date-2026", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-test-date-2025", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-past-papers", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-results", priority: "0.9", changefreq: "monthly" },
      { path: "/when-do-bucks-11-plus-results-come-out", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-sample-questions", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-score-calculator", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-self-study-vs-tutor", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-appeals", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-registration-guide", priority: "0.8", changefreq: "monthly" },
      ...QUESTION_TYPES.map(q => ({ path: q.pathSegment, priority: "0.8", changefreq: "monthly" as const })),
      ...MATHS_TOPICS.map(t => ({ path: t.pathSegment, priority: "0.8", changefreq: "monthly" as const })),
      ...MOCK_VARIANTS.map(m => ({ path: m.pathSegment, priority: "0.8", changefreq: "monthly" as const })),
      ...VOCAB_CLUSTERS.map(v => ({ path: v.pathSegment, priority: "0.7", changefreq: "monthly" as const })),
      ...URGENCY_PLANS.map(p => ({ path: p.pathSegment, priority: "0.8", changefreq: "monthly" as const })),
      ...ssrGrammarSchools.map(s => ({ path: `/11-plus-score-${s.slug}`, priority: "0.8", changefreq: "monthly" as const })),
      { path: "/gl-assessment-11-plus-practice", priority: "0.9", changefreq: "monthly" as const },
      { path: "/gl-assessment-past-papers", priority: "0.9", changefreq: "monthly" as const },
      { path: "/gl-assessment-question-types", priority: "0.9", changefreq: "monthly" as const },
      { path: "/free-11-plus-resources", priority: "0.9", changefreq: "monthly" as const },
      { path: "/bucks-11-plus-practice-papers-free", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-year-5-summer-plan", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-year-6-revision-timetable", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-grammar-school-rankings", priority: "0.8", changefreq: "monthly" },
      { path: "/independent-vs-grammar-buckinghamshire", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-familiarisation-test", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-vs-cem-vs-kent", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-vocabulary-list", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-test-day-checklist", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-mock-test", priority: "0.9", changefreq: "monthly" },
      { path: "/bucks-11-plus-tuition-cost", priority: "0.8", changefreq: "monthly" },
      { path: "/bucks-11-plus-faqs", priority: "0.8", changefreq: "monthly" },
      { path: "/south-bucks-grammar-schools", priority: "0.8", changefreq: "monthly" },
      { path: "/aylesbury-vale-grammar-schools", priority: "0.8", changefreq: "monthly" },
      { path: "/chiltern-grammar-schools", priority: "0.8", changefreq: "monthly" },
    ];

    const staticContentLastmod = "2025-09-01";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${changefreq === "weekly" ? today : staticContentLastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });

  return httpServer;
}

import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { onboardingSchema, insertGuideLeadSchema, testSessions, testAnswers, questions, users } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sql, eq, and, desc, inArray } from "drizzle-orm";
import { db } from "./db";
import { computeAttemptMetrics, computeFullAnalytics, type AnswerRecord, type DrillAnswerRecord, type HistoricalMetrics } from "./metrics";
import { sendDiagnosticCompleteEmail } from "./email";

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

  app.get("/api/stripe/publishable-key", async (_req, res, next) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout", requireAuth, async (req, res, next) => {
    try {
      const { tier } = req.body;
      const validTiers = ["early_learner", "pack12", "pack12_family", "programme16", "programme16_family"];
      if (!tier || !validTiers.includes(tier)) {
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

      const pricesResult = await db.execute(
        sql`SELECT pr.id as price_id, p.metadata FROM stripe.prices pr JOIN stripe.products p ON pr.product = p.id WHERE p.active = true AND pr.active = true`
      );

      const targetTier = tier;
      const priceRow = pricesResult.rows.find((r: any) => {
        const meta = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        return meta?.tier === targetTier;
      });

      if (!priceRow) {
        return res.status(404).json({ message: "Price not found. Products may not be seeded yet." });
      }

      const host = req.get('host');
      const protocol = req.protocol;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: (priceRow as any).price_id, quantity: 1 }],
        mode: 'payment',
        success_url: `${protocol}://${host}/app/checkout-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        metadata: {
          userId: user.id,
          tier: tier,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/upgrade", requireAuth, async (req, res, next) => {
    try {
      const { targetTier } = req.body;
      const validUpgrades: Record<string, string[]> = {
        pack12: ["programme16"],
        pack12_family: ["programme16_family"],
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

      const pricesResult = await db.execute(
        sql`SELECT pr.id as price_id, pr.unit_amount, p.metadata FROM stripe.prices pr JOIN stripe.products p ON pr.product = p.id WHERE p.active = true AND pr.active = true`
      );

      const findPrice = (tier: string) => pricesResult.rows.find((r: any) => {
        const meta = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        return meta?.tier === tier;
      });

      const currentPrice = findPrice(currentTier);
      const targetPrice = findPrice(targetTier);

      if (!currentPrice || !targetPrice) {
        return res.status(404).json({ message: "Price not found for upgrade calculation" });
      }

      const currentAmount = Number((currentPrice as any).unit_amount);
      const targetAmount = Number((targetPrice as any).unit_amount);
      const difference = targetAmount - currentAmount;

      if (difference <= 0) {
        return res.status(400).json({ message: "No upgrade difference to pay" });
      }

      const host = req.get('host');
      const protocol = req.protocol;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Upgrade to Young Scholar Programme`,
              description: `Upgrade difference from ${currentTier === 'pack12_family' ? 'Practice Platform Family' : 'Practice Platform'}`,
            },
            unit_amount: difference,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${protocol}://${host}/app/checkout-success?tier=${targetTier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        metadata: {
          userId: user.id,
          tier: targetTier,
          upgradeFrom: currentTier,
        },
      });

      res.json({ url: session.url, difference: difference / 100 });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/guest/checkout", async (req, res, next) => {
    try {
      const { tier } = req.body;
      const validTiers = ["early_learner", "pack12", "pack12_family", "programme16", "programme16_family"];
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      const stripe = await getUncachableStripeClient();

      const pricesResult = await db.execute(
        sql`SELECT pr.id as price_id, p.metadata FROM stripe.prices pr JOIN stripe.products p ON pr.product = p.id WHERE p.active = true AND pr.active = true`
      );

      const priceRow = pricesResult.rows.find((r: any) => {
        const meta = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        return meta?.tier === tier;
      });

      if (!priceRow) {
        return res.status(404).json({ message: "Price not found. Products may not be seeded yet." });
      }

      const host = req.get('host');
      const protocol = req.protocol;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: (priceRow as any).price_id, quantity: 1 }],
        mode: 'payment',
        success_url: `${protocol}://${host}/checkout-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/pricing`,
        metadata: {
          tier: tier,
        },
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
      const validTiers = ["early_learner", "pack12", "pack12_family", "programme16", "programme16_family"];
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier in session metadata" });
      }

      const currentUser = await storage.getUser(req.user!.id);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const TIER_RANK: Record<string, number> = { free: 0, early_learner: 0, pack12: 1, pack12_family: 1, programme16: 2, programme16_family: 2 };
      const currentRank = TIER_RANK[currentUser.subscriptionTier] || 0;
      const newRank = TIER_RANK[tier] || 0;
      if (newRank <= currentRank) {
        const { password: _, ...safeUser } = currentUser;
        return res.json(safeUser);
      }

      const weeksMap: Record<string, number> = { early_learner: 26, pack12: 26, pack12_family: 26, programme16: 52, programme16_family: 52 };
      const weeks = weeksMap[tier] || 12;
      const expiresAt = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);

      await storage.updateUserSubscription(req.user!.id, tier, expiresAt);

      if (tier === "programme16" || tier === "programme16_family") {
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

      const TIER_RANK: Record<string, number> = { free: 0, early_learner: 0, pack12: 1, pack12_family: 1, programme16: 2, programme16_family: 2 };
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

      const allQuestions = await storage.getQuestionsByDiagnostic(session.diagnosticId);
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      let correct = 0;
      const sectionResults: Record<string, { correct: number; total: number; totalTime: number }> = {};

      for (let idx = 0; idx < answers.length; idx++) {
        const ans = answers[idx];
        const question = questionMap.get(ans.questionId);
        if (!question) continue;

        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correct++;

        if (!sectionResults[question.section]) {
          sectionResults[question.section] = { correct: 0, total: 0, totalTime: 0 };
        }
        sectionResults[question.section].total++;
        sectionResults[question.section].totalTime += ans.timeTaken || 0;
        if (isCorrect) sectionResults[question.section].correct++;

        await storage.createTestAnswer({
          sessionId: session.id,
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
          timeTaken: ans.timeTaken || 0,
          questionOrder: idx,
        });
      }

      const total = answers.length;
      const rawPercent = total > 0 ? (correct / total) * 100 : 0;
      const forecastScore = Math.round((rawPercent / 100) * 141);
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

      const paceData = Object.entries(sectionResults).map(([name, data]) => ({
        name,
        avg: Math.round(data.totalTime / data.total),
        expected: name === 'Mathematics' ? 40 : name === 'Non-Verbal Reasoning' ? 38 : 35,
      }));

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
      if (!token) return res.status(400).json({ message: "token query param required" });

      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.guestToken !== token) return res.status(403).json({ message: "Invalid token" });

      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/guest/review/:id", async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ message: "token query param required" });

      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.guestToken !== token) return res.status(403).json({ message: "Invalid token" });
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

  app.post("/api/guest/claim/:id", requireAuth, async (req, res, next) => {
    try {
      const session = await storage.getTestSession(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.userId && session.userId !== req.user!.id) {
        return res.status(403).json({ message: "Session already claimed" });
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

      const TIER_RANK: Record<string, number> = { free: 0, early_learner: 0, pack12: 1, pack12_family: 1, programme16: 2, programme16_family: 2 };
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

      const TIER_RANK: Record<string, number> = { free: 0, early_learner: 0, pack12: 1, pack12_family: 1, programme16: 2, programme16_family: 2 };
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

      let allQuestions = await storage.getQuestionsByDiagnostic(session.diagnosticId);
      if (allQuestions.length === 0) {
        const answerIds = answers.map((a: any) => a.questionId).filter(Boolean);
        if (answerIds.length > 0) {
          allQuestions = await db.select().from(questions)
            .where(inArray(questions.id, answerIds));
        }
      }
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      let correct = 0;
      const sectionResults: Record<string, { correct: number; total: number; totalTime: number }> = {};
      const answerRecords: AnswerRecord[] = [];

      const diffMap: Record<string, number> = { easy: 2, medium: 3, hard: 4 };

      for (let idx = 0; idx < answers.length; idx++) {
        const ans = answers[idx];
        const question = questionMap.get(ans.questionId);
        if (!question) continue;

        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correct++;

        if (!sectionResults[question.section]) {
          sectionResults[question.section] = { correct: 0, total: 0, totalTime: 0 };
        }
        sectionResults[question.section].total++;
        sectionResults[question.section].totalTime += ans.timeTaken || 0;
        if (isCorrect) sectionResults[question.section].correct++;

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

      const total = answers.length;
      const rawPercent = total > 0 ? (correct / total) * 100 : 0;
      const forecastScore = Math.round((rawPercent / 100) * 141);
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

      const paceData = Object.entries(sectionResults).map(([name, data]) => ({
        name,
        avg: Math.round(data.totalTime / data.total),
        expected: name === 'Mathematics' ? 40 : name === 'Non-Verbal Reasoning' ? 38 : 35,
      }));

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

      if (req.user!.subscriptionTier === "programme16" || req.user!.subscriptionTier === "programme16_family") {
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
        return res.json({ available: false, gated: true, message: "Premium Parent Analytics is included with the Young Scholar Programme." });
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
        return res.json({ enrolled: false });
      }
      const enrolment = await storage.getProgrammeEnrolment(req.user!.id);
      if (!enrolment) {
        return res.json({ enrolled: false });
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
        return res.status(403).json({ message: "Programme access required" });
      }
      const { sessionId } = req.body;
      const milestone = await storage.completeMilestone(req.params.id, sessionId);
      res.json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme/tasks", requireAuth, async (req, res, next) => {
    try {
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
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
      if (req.user!.subscriptionTier !== "programme16" && req.user!.subscriptionTier !== "programme16_family") {
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

      const TIER_RANK: Record<string, number> = { free: 0, early_learner: 0, pack12: 1, pack12_family: 1, programme16: 2, programme16_family: 2 };
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

      if (req.user!.subscriptionTier === "programme16" || req.user!.subscriptionTier === "programme16_family") {
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
      if (req.user!.subscriptionTier === "programme16" || req.user!.subscriptionTier === "programme16_family") {
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

  app.post("/api/guide-leads", async (req, res, next) => {
    try {
      const parsed = insertGuideLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Please provide your name and email address." });
      }
      const lead = await storage.createGuideLead(parsed.data);
      res.json({ id: lead.id, success: true });
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
      const { childName, childYear, practiceHours, difficultyAreas } = req.body;
      if (!childName || !childYear) {
        return res.status(400).json({ message: "Child name and year are required" });
      }
      const profile = await storage.createChildProfile({
        userId: req.user!.id,
        childName,
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
      const updated = await storage.updateChildProfile(req.params.id, req.body);
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
      const isProgramme = req.user!.subscriptionTier?.includes("programme16");
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
    res.send("<html><body style='font-family:sans-serif;max-width:500px;margin:60px auto;text-align:center;'><h2>Unsubscribed</h2><p>You have been successfully unsubscribed from 11+ Standard emails.</p><p><a href='/'>Return to site</a></p></body></html>");
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

  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://bucks11plustest.co.uk";
    const staticPages = [
      "/", "/pricing", "/how-it-works", "/bucks-gl-alignment",
      "/about", "/parent-hub", "/free-diagnostic",
      "/terms", "/privacy", "/safeguarding",
      "/buckinghamshire-11-plus-guide", "/bucks-11-plus-parent-guide",
      "/bucks-grammar-schools", "/bucks-11-plus-qualifying-score",
      "/bucks-11-plus-timeline", "/buckinghamshire-secondary-transfer-test",
      "/how-to-pass-bucks-11-plus", "/bucks-11-plus-registration", "/bucks-11-plus-mistakes",
    ];
    const towns = [
      "high-wycombe", "aylesbury", "beaconsfield", "amersham",
      "chesham", "gerrards-cross", "marlow", "princes-risborough",
    ];
    const townPages = towns.map(t => `/bucks-11-plus-${t}`);
    const allPages = [...staticPages, ...townPages];
    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${p === "/" ? "1.0" : p.includes("guide") ? "0.9" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });

  return httpServer;
}

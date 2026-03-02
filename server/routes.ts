import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { onboardingSchema, testSessions, testAnswers, questions } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sql, eq, and, desc, inArray } from "drizzle-orm";
import { db } from "./db";
import { computeAttemptMetrics, computeFullAnalytics, type AnswerRecord, type DrillAnswerRecord, type HistoricalMetrics } from "./metrics";

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
      if (!tier || !["pack12", "programme16"].includes(tier)) {
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

  app.post("/api/checkout/complete", requireAuth, async (req, res, next) => {
    try {
      const { tier, session_id } = req.body;
      if (!tier || !["pack12", "programme16"].includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      if (session_id) {
        const stripe = await getUncachableStripeClient();
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        if (checkoutSession.payment_status !== "paid") {
          return res.status(400).json({ message: "Payment not confirmed" });
        }
        const sessionUserId = checkoutSession.metadata?.userId;
        if (sessionUserId && sessionUserId !== req.user!.id) {
          return res.status(403).json({ message: "Session does not belong to this user" });
        }
      }

      const currentUser = await storage.getUser(req.user!.id);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const TIER_RANK: Record<string, number> = { free: 0, pack12: 1, programme16: 2 };
      const currentRank = TIER_RANK[currentUser.subscriptionTier] || 0;
      const newRank = TIER_RANK[tier] || 0;
      if (newRank <= currentRank) {
        const { password: _, ...safeUser } = currentUser;
        return res.json(safeUser);
      }

      const weeksMap: Record<string, number> = { pack12: 12, programme16: 16 };
      const weeks = weeksMap[tier];
      const expiresAt = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);

      await storage.updateUserSubscription(req.user!.id, tier, expiresAt);

      if (tier === "programme16") {
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

      const TIER_RANK: Record<string, number> = { free: 0, pack12: 1, programme16: 2 };
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

  app.post("/api/test-sessions", requireAuth, async (req, res, next) => {
    try {
      const { diagnosticId } = req.body;
      if (!diagnosticId) return res.status(400).json({ message: "diagnosticId required" });

      const diag = await storage.getDiagnostic(diagnosticId);
      if (!diag) return res.status(404).json({ message: "Diagnostic not found" });

      const TIER_RANK: Record<string, number> = { free: 0, pack12: 1, programme16: 2 };
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
      res.json(session);
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

      const allQuestions = await storage.getQuestionsByDiagnostic(session.diagnosticId);
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
      const forecastScore = Math.round(90 + (rawPercent / 100) * 51);
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
        expected: name === 'Mathematics' ? 45 : 35,
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

      res.json(completed);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics", requireAuth, async (req, res, next) => {
    try {
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
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme", requireAuth, async (req, res, next) => {
    try {
      if (req.user!.subscriptionTier !== "programme16") {
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
      if (req.user!.subscriptionTier !== "programme16") {
        return res.status(403).json({ message: "Programme access required" });
      }
      const { sessionId } = req.body;
      const milestone = await storage.completeMilestone(req.params.id, sessionId);
      res.json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programme/completion-summary", requireAuth, async (req, res, next) => {
    try {
      if (req.user!.subscriptionTier !== "programme16") {
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
      const qs = await storage.getQuestionsForDrill(req.params.id, req.user!.id, 10);
      const safe = qs.map(({ correctAnswer, ...q }) => q);
      res.json(safe);
    } catch (error) {
      next(error);
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

  return httpServer;
}

import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { onboardingSchema } from "@shared/schema";

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
      const qs = await storage.getQuestionsByDiagnostic(req.params.id);
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

      const diagnostic = await storage.getDiagnostic(session.diagnosticId);
      if (!diagnostic) return res.status(404).json({ message: "Diagnostic not found" });

      const allQuestions = await storage.getQuestionsByDiagnostic(session.diagnosticId);
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      let correct = 0;
      let total = answers.length;
      const sectionResults: Record<string, { correct: number; total: number; totalTime: number }> = {};

      for (const ans of answers) {
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
        });
      }

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
        expected: 35,
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

  app.get("/api/progress", requireAuth, async (req, res, next) => {
    try {
      const sessions = await storage.getUserTestSessions(req.user!.id);
      const completed = sessions.filter(s => s.completedAt);

      const trajectory = completed
        .reverse()
        .map((s, i) => ({
          date: `Attempt ${i + 1}`,
          score: s.forecastScore || 0,
          target: 121,
        }));

      const latest = completed.length > 0 ? completed[completed.length - 1] : null;

      res.json({
        trajectory,
        latestForecast: latest?.forecastScore || null,
        latestBand: latest?.band || null,
        totalAttempts: completed.length,
        velocity: completed.length >= 2
          ? (completed[completed.length - 1].forecastScore || 0) - (completed[0].forecastScore || 0)
          : 0,
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

  return httpServer;
}

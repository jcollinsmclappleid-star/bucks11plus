import { eq, desc, and, sql, asc, ne, inArray, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  users, diagnostics, questions, testSessions, testAnswers, articles, practiceSections,
  programmeEnrolments, programmeMilestones, weeklyPlans, questionUsage, contentCalibration,
  type User, type InsertUser, type Diagnostic, type Question,
  type TestSession, type TestAnswer, type Article, type PracticeSection,
  type ProgrammeEnrolment, type ProgrammeMilestone, type WeeklyPlan,
  type OnboardingData,
} from "@shared/schema";

const PHASE_MAP: Record<number, string> = {
  1: "Baseline & Foundation", 2: "Baseline & Foundation", 3: "Baseline & Foundation", 4: "Baseline & Foundation",
  5: "Targeted Skill Elevation", 6: "Targeted Skill Elevation", 7: "Targeted Skill Elevation", 8: "Targeted Skill Elevation",
  9: "Exam Conditioning", 10: "Exam Conditioning", 11: "Exam Conditioning", 12: "Exam Conditioning",
  13: "Benchmark Consolidation", 14: "Benchmark Consolidation", 15: "Benchmark Consolidation", 16: "Benchmark Consolidation",
};

function getPhase(week: number): string {
  return PHASE_MAP[week] || "Baseline & Foundation";
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboarding(userId: string, data: OnboardingData): Promise<User>;
  updateUserSubscription(userId: string, tier: string, expiresAt?: Date): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string): Promise<User>;

  getDiagnostics(): Promise<Diagnostic[]>;
  getDiagnostic(id: string): Promise<Diagnostic | undefined>;
  getQuestionsByDiagnostic(diagnosticId: string): Promise<Question[]>;
  selectQuestionsForSession(userId: string, diagnosticId: string): Promise<Question[]>;

  createTestSession(data: { userId: string; diagnosticId: string }): Promise<TestSession>;
  getTestSession(id: string): Promise<TestSession | undefined>;
  getUserTestSessions(userId: string): Promise<TestSession[]>;
  completeTestSession(id: string, results: {
    totalScore: number; forecastScore: number; band: string; sectionScores: any; paceData: any; metrics?: any;
  }): Promise<TestSession>;

  createTestAnswer(data: {
    sessionId: string; questionId: string; selectedAnswer: string | null; isCorrect: boolean; timeTaken: number; questionOrder?: number;
  }): Promise<TestAnswer>;
  getSessionAnswers(sessionId: string): Promise<TestAnswer[]>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getPracticeSections(): Promise<PracticeSection[]>;
  getQuestionsForDrill(sectionId: string, userId: string, limit?: number): Promise<Question[]>;

  createProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment>;
  getProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment | undefined>;
  updateEnrolmentWeek(enrolmentId: string, week: number): Promise<void>;
  completeEnrolment(enrolmentId: string): Promise<void>;
  getProgrammeMilestones(userId: string): Promise<ProgrammeMilestone[]>;
  completeMilestone(milestoneId: string, sessionId: string): Promise<ProgrammeMilestone>;
  getWeeklyPlans(userId: string): Promise<WeeklyPlan[]>;
  generateWeeklyPlan(userId: string, enrolmentId: string, week: number, latestSession?: TestSession | null): Promise<WeeklyPlan>;

  getAllQuestions(filters?: { section?: string; skillId?: string; difficulty?: string; qaStatus?: string; renderType?: string }): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(data: Partial<Question>): Promise<Question>;
  updateQuestion(id: string, data: Partial<Question>): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;
  approveQuestion(id: string): Promise<Question>;
  rejectQuestion(id: string): Promise<Question>;
  getQuestionsByQaStatus(status: string): Promise<Question[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserOnboarding(userId: string, data: OnboardingData): Promise<User> {
    const [user] = await db.update(users)
      .set({
        childName: data.childName,
        childYear: data.childYear,
        practiceHours: data.practiceHours,
        difficultyAreas: data.difficultyAreas,
        onboardingCompleted: true,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, tier: string, expiresAt?: Date): Promise<User> {
    const [user] = await db.update(users)
      .set({ subscriptionTier: tier, subscriptionExpiresAt: expiresAt || null })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getDiagnostics(): Promise<Diagnostic[]> {
    return db.select().from(diagnostics);
  }

  async getDiagnostic(id: string): Promise<Diagnostic | undefined> {
    const [diag] = await db.select().from(diagnostics).where(eq(diagnostics.id, id));
    return diag;
  }

  async getQuestionsByDiagnostic(diagnosticId: string): Promise<Question[]> {
    return db.select().from(questions)
      .where(eq(questions.diagnosticId, diagnosticId))
      .orderBy(questions.orderIndex);
  }

  async selectQuestionsForSession(userId: string, diagnosticId: string): Promise<Question[]> {
    const diag = await this.getDiagnostic(diagnosticId);
    if (!diag) return [];

    const allQuestions = await db.select().from(questions)
      .where(and(
        eq(questions.diagnosticId, diagnosticId),
        eq(questions.qaStatus, "approved")
      ))
      .orderBy(questions.orderIndex);

    if (allQuestions.length === 0) {
      return this.getQuestionsByDiagnostic(diagnosticId);
    }

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));

    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));
    const freshnessCutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const scored = allQuestions.map(q => {
      const usage = usageMap.get(q.id);
      const served = usage?.servedCount || 0;
      const lastServed = usage?.lastServedAt?.getTime() || 0;
      const freshBonus = lastServed < freshnessCutoff ? 5 : 0;
      return { question: q, served, lastServed, freshBonus };
    });

    scored.sort((a, b) => {
      if (a.served !== b.served) return a.served - b.served;
      return a.lastServed - b.lastServed;
    });

    const maxPerSubRule = Math.max(2, Math.ceil(diag.questionCount * 0.4));
    const subRuleCounts = new Map<string, number>();
    const selected: Question[] = [];
    const candidates = [...scored];

    while (selected.length < diag.questionCount && candidates.length > 0) {
      let bestIdx = -1;
      let bestScore = -Infinity;

      for (let i = 0; i < Math.min(candidates.length, 50); i++) {
        const item = candidates[i];
        const sr = item.question.subRuleId || '';
        const srCount = subRuleCounts.get(sr) || 0;
        if (sr && srCount >= maxPerSubRule && selected.length < diag.questionCount * 0.8) continue;

        const diversityScore = this.scoreDiversity(item.question, selected) + item.freshBonus;
        if (diversityScore > bestScore) {
          bestScore = diversityScore;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) {
        for (let i = 0; i < candidates.length; i++) {
          const diversityScore = this.scoreDiversity(candidates[i].question, selected);
          if (diversityScore > bestScore) {
            bestScore = diversityScore;
            bestIdx = i;
          }
        }
      }

      if (bestIdx === -1) break;

      const chosen = candidates.splice(bestIdx, 1)[0];
      const sr = chosen.question.subRuleId || '';
      subRuleCounts.set(sr, (subRuleCounts.get(sr) || 0) + 1);
      selected.push(chosen.question);
    }

    const now = new Date();
    for (const q of selected) {
      const existing = usageMap.get(q.id);
      if (existing) {
        await db.update(questionUsage)
          .set({ servedCount: (existing.servedCount || 0) + 1, lastServedAt: now })
          .where(and(eq(questionUsage.userId, userId), eq(questionUsage.questionId, q.id)));
      } else {
        await db.insert(questionUsage).values({
          userId,
          questionId: q.id,
          servedCount: 1,
          lastServedAt: now,
        });
      }
    }

    return selected;
  }

  private extractVariety(q: Question): {
    stemVariantId: string; layoutVariantId: string; shapePaletteId: string;
    distractorStyleId: string; densityLevel: string; contextId: string;
  } {
    const rc = (q.renderConfig as any) || {};
    return {
      stemVariantId: rc.stemVariantId || '',
      layoutVariantId: rc.layoutVariantId || '',
      shapePaletteId: rc.shapePaletteId || '',
      distractorStyleId: rc.distractorStyleId || '',
      densityLevel: rc.densityLevel || '',
      contextId: rc.contextId || '',
    };
  }

  private scoreDiversity(candidate: Question, selected: Question[]): number {
    if (selected.length === 0) return 100;
    const cv = this.extractVariety(candidate);
    let score = 100;
    const recentWindow = selected.slice(-10);

    for (const s of recentWindow) {
      const sv = this.extractVariety(s);
      if (cv.stemVariantId && cv.stemVariantId === sv.stemVariantId) score -= 15;
      if (cv.layoutVariantId && cv.layoutVariantId === sv.layoutVariantId) score -= 10;
      if (cv.shapePaletteId && cv.shapePaletteId === sv.shapePaletteId) score -= 10;
      if (cv.distractorStyleId && cv.distractorStyleId === sv.distractorStyleId) score -= 5;
      if (cv.contextId && cv.contextId === sv.contextId) score -= 5;
    }

    const last3 = selected.slice(-3);
    if (last3.length >= 2) {
      const allSameDiff = last3.every(s => s.difficulty === candidate.difficulty);
      if (allSameDiff) score -= 20;
    }

    const last2 = selected.slice(-2);
    if (last2.length >= 2) {
      const allSameDensity = last2.every(s => {
        const sv = this.extractVariety(s);
        return cv.densityLevel && sv.densityLevel === cv.densityLevel;
      });
      if (allSameDensity && cv.densityLevel) score -= 10;
    }

    return score;
  }

  async getQuestionsForDrill(sectionId: string, userId: string, limit: number = 10): Promise<Question[]> {
    const [section] = await db.select().from(practiceSections).where(eq(practiceSections.id, sectionId));
    if (!section) return [];

    const sectionName = section.category;
    const skillFilter = section.skillId;

    let pool: Question[];
    if (skillFilter) {
      pool = await db.select().from(questions)
        .where(and(
          eq(questions.skillId, skillFilter),
          eq(questions.qaStatus, "approved")
        ));
    } else {
      pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, sectionName),
          eq(questions.qaStatus, "approved")
        ));
    }

    if (pool.length === 0) {
      pool = await db.select().from(questions)
        .where(eq(questions.section, sectionName));
    }

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));
    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));

    const freshnessCutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const scored = pool.map(q => {
      const usage = usageMap.get(q.id);
      const served = usage?.servedCount || 0;
      const lastServed = usage?.lastServedAt?.getTime() || 0;
      const freshBonus = lastServed < freshnessCutoff ? 5 : 0;
      return { question: q, served, lastServed, freshBonus };
    });

    scored.sort((a, b) => {
      if (a.served !== b.served) return a.served - b.served;
      return a.lastServed - b.lastServed;
    });

    const minServed = scored.length > 0 ? scored[0].served : 0;
    const candidatePool = scored.filter(s => s.served <= minServed + 1);
    for (let i = candidatePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
    }
    const remaining = scored.filter(s => s.served > minServed + 1);
    const allCandidates = [...candidatePool, ...remaining];

    const maxPerSubRule = 2;
    const subRuleCounts = new Map<string, number>();
    const selected: Question[] = [];

    while (selected.length < limit && allCandidates.length > 0) {
      let bestIdx = -1;
      let bestScore = -Infinity;

      for (let i = 0; i < Math.min(allCandidates.length, 50); i++) {
        const item = allCandidates[i];
        const sr = item.question.subRuleId || '__none__';
        const srCount = subRuleCounts.get(sr) || 0;
        if (srCount >= maxPerSubRule && selected.length < limit * 0.8) continue;

        const diversityScore = this.scoreDiversity(item.question, selected) + item.freshBonus;
        if (diversityScore > bestScore) {
          bestScore = diversityScore;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) {
        for (let i = 0; i < allCandidates.length; i++) {
          const diversityScore = this.scoreDiversity(allCandidates[i].question, selected);
          if (diversityScore > bestScore) {
            bestScore = diversityScore;
            bestIdx = i;
          }
        }
      }

      if (bestIdx === -1) break;

      const chosen = allCandidates.splice(bestIdx, 1)[0];
      const sr = chosen.question.subRuleId || '__none__';
      subRuleCounts.set(sr, (subRuleCounts.get(sr) || 0) + 1);
      selected.push(chosen.question);
    }

    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    const finalSelected = selected.slice(0, limit);

    const now = new Date();
    for (const q of finalSelected) {
      const existing = usageMap.get(q.id);
      if (existing) {
        await db.update(questionUsage)
          .set({ servedCount: (existing.servedCount || 0) + 1, lastServedAt: now })
          .where(and(eq(questionUsage.userId, userId), eq(questionUsage.questionId, q.id)));
      } else {
        await db.insert(questionUsage).values({ userId, questionId: q.id, servedCount: 1, lastServedAt: now });
      }
    }

    return finalSelected;
  }

  async createTestSession(data: { userId: string; diagnosticId: string }): Promise<TestSession> {
    const [session] = await db.insert(testSessions).values({
      userId: data.userId,
      diagnosticId: data.diagnosticId,
    }).returning();
    return session;
  }

  async getTestSession(id: string): Promise<TestSession | undefined> {
    const [session] = await db.select().from(testSessions).where(eq(testSessions.id, id));
    return session;
  }

  async getUserTestSessions(userId: string): Promise<TestSession[]> {
    return db.select().from(testSessions)
      .where(eq(testSessions.userId, userId))
      .orderBy(desc(testSessions.startedAt));
  }

  async completeTestSession(id: string, results: {
    totalScore: number; forecastScore: number; band: string; sectionScores: any; paceData: any; metrics?: any;
  }): Promise<TestSession> {
    const [session] = await db.update(testSessions)
      .set({
        completedAt: new Date(),
        totalScore: results.totalScore,
        forecastScore: results.forecastScore,
        band: results.band,
        sectionScores: results.sectionScores,
        paceData: results.paceData,
        metrics: results.metrics || null,
      })
      .where(eq(testSessions.id, id))
      .returning();
    return session;
  }

  async createTestAnswer(data: {
    sessionId: string; questionId: string; selectedAnswer: string | null; isCorrect: boolean; timeTaken: number; questionOrder?: number;
  }): Promise<TestAnswer> {
    const [answer] = await db.insert(testAnswers).values(data).returning();
    return answer;
  }

  async getSessionAnswers(sessionId: string): Promise<TestAnswer[]> {
    return db.select().from(testAnswers).where(eq(testAnswers.sessionId, sessionId));
  }

  async getArticles(): Promise<Article[]> {
    return db.select().from(articles).orderBy(desc(articles.publishedAt));
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getPracticeSections(): Promise<PracticeSection[]> {
    return db.select().from(practiceSections);
  }

  async createProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment> {
    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + 16 * 7 * 24 * 60 * 60 * 1000);

    const [enrolment] = await db.insert(programmeEnrolments).values({
      userId,
      status: "active",
      startAt,
      endAt,
      currentWeek: 1,
    }).returning();

    const milestoneData = [
      { week: 1, type: "diagnostic", title: "Baseline Diagnostic", desc: "Establish your starting point with a full diagnostic assessment.", diagId: "full-a" },
      { week: 6, type: "diagnostic", title: "Progress Diagnostic", desc: "Measure improvement after 5 weeks of targeted practice.", diagId: "full-b" },
      { week: 12, type: "mock", title: "Full Mock Simulation", desc: "Simulate exam-day conditions with a complete timed paper.", diagId: "mock-1" },
      { week: 16, type: "diagnostic", title: "Final Readiness Assessment", desc: "Your final forecast before the exam window.", diagId: "full-a" },
    ];

    for (const m of milestoneData) {
      const dueAt = new Date(startAt.getTime() + (m.week - 1) * 7 * 24 * 60 * 60 * 1000);
      await db.insert(programmeMilestones).values({
        userId,
        enrolmentId: enrolment.id,
        week: m.week,
        milestoneType: m.type,
        title: m.title,
        description: m.desc,
        dueAt,
        linkedDiagnosticId: m.diagId,
      });
    }

    for (let w = 1; w <= 2; w++) {
      await this.generateWeeklyPlan(userId, enrolment.id, w, null);
    }

    return enrolment;
  }

  async getProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment | undefined> {
    const [enrolment] = await db.select().from(programmeEnrolments)
      .where(and(eq(programmeEnrolments.userId, userId), eq(programmeEnrolments.status, "active")))
      .orderBy(desc(programmeEnrolments.createdAt));
    return enrolment;
  }

  async updateEnrolmentWeek(enrolmentId: string, week: number): Promise<void> {
    await db.update(programmeEnrolments)
      .set({ currentWeek: week })
      .where(eq(programmeEnrolments.id, enrolmentId));
  }

  async completeEnrolment(enrolmentId: string): Promise<void> {
    await db.update(programmeEnrolments)
      .set({ status: "completed" })
      .where(eq(programmeEnrolments.id, enrolmentId));
  }

  async getProgrammeMilestones(userId: string): Promise<ProgrammeMilestone[]> {
    return db.select().from(programmeMilestones)
      .where(eq(programmeMilestones.userId, userId))
      .orderBy(programmeMilestones.week);
  }

  async completeMilestone(milestoneId: string, sessionId: string): Promise<ProgrammeMilestone> {
    const [milestone] = await db.update(programmeMilestones)
      .set({ completedAt: new Date(), linkedSessionId: sessionId })
      .where(eq(programmeMilestones.id, milestoneId))
      .returning();
    return milestone;
  }

  async getWeeklyPlans(userId: string): Promise<WeeklyPlan[]> {
    return db.select().from(weeklyPlans)
      .where(eq(weeklyPlans.userId, userId))
      .orderBy(weeklyPlans.week);
  }

  async generateWeeklyPlan(userId: string, enrolmentId: string, week: number, latestSession?: TestSession | null): Promise<WeeklyPlan> {
    const sectionScores: { name: string; score: number }[] = (latestSession?.sectionScores as any) || [];
    const sorted = [...sectionScores].sort((a, b) => a.score - b.score);

    const focusSkill = sorted[0]?.name || "Verbal Reasoning";
    const secondarySkill = sorted[1]?.name || "Maths";

    const planJson = {
      week,
      phase: getPhase(week),
      focusSkills: [{ skill: focusSkill, sessions: 3, durationMin: 15 }],
      secondarySkills: [{ skill: secondarySkill, sessions: 2, durationMin: 15 }],
      mixed: { sessions: 1, durationMin: 20, mode: "timed" },
      retest: { due: week % 3 === 0 },
    };

    const [plan] = await db.insert(weeklyPlans).values({
      userId,
      enrolmentId,
      week,
      phase: getPhase(week),
      planJson,
    }).returning();

    return plan;
  }

  async getAllQuestions(filters?: { section?: string; skillId?: string; difficulty?: string; qaStatus?: string; renderType?: string }): Promise<Question[]> {
    let query = db.select().from(questions);
    const conditions = [];

    if (filters?.section) conditions.push(eq(questions.section, filters.section));
    if (filters?.skillId) conditions.push(eq(questions.skillId, filters.skillId));
    if (filters?.difficulty) conditions.push(eq(questions.difficulty, filters.difficulty));
    if (filters?.qaStatus) conditions.push(eq(questions.qaStatus, filters.qaStatus));
    if (filters?.renderType) conditions.push(eq(questions.renderType, filters.renderType));

    if (conditions.length > 0) {
      return db.select().from(questions).where(and(...conditions)).orderBy(questions.section, questions.skillId, questions.orderIndex);
    }
    return db.select().from(questions).orderBy(questions.section, questions.skillId, questions.orderIndex);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    const [q] = await db.select().from(questions).where(eq(questions.id, id));
    return q;
  }

  async createQuestion(data: Partial<Question>): Promise<Question> {
    const [q] = await db.insert(questions).values(data as any).returning();
    return q;
  }

  async updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
    const [q] = await db.update(questions).set(data as any).where(eq(questions.id, id)).returning();
    return q;
  }

  async deleteQuestion(id: string): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  async approveQuestion(id: string): Promise<Question> {
    const [q] = await db.update(questions).set({ qaStatus: "approved" }).where(eq(questions.id, id)).returning();
    return q;
  }

  async rejectQuestion(id: string): Promise<Question> {
    const [q] = await db.update(questions).set({ qaStatus: "rejected" }).where(eq(questions.id, id)).returning();
    return q;
  }

  async getQuestionsByQaStatus(status: string): Promise<Question[]> {
    return db.select().from(questions)
      .where(eq(questions.qaStatus, status))
      .orderBy(questions.section, questions.skillId);
  }
}

export const storage = new DatabaseStorage();

import { eq, desc, and, sql, asc, ne, inArray, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  users, diagnostics, questions, testSessions, testAnswers, articles, practiceSections,
  programmeEnrolments, programmeMilestones, weeklyPlans, questionUsage, contentCalibration,
  programmeTasks, badges, userBadges,
  type User, type InsertUser, type Diagnostic, type Question,
  type TestSession, type TestAnswer, type Article, type PracticeSection,
  type ProgrammeEnrolment, type ProgrammeMilestone, type WeeklyPlan,
  type ProgrammeTask, type OnboardingData, type Badge, type UserBadge,
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
  selectQuestionsForPracticePaper(userId: string, questionCount: number, sections?: string[]): Promise<Question[]>;

  createTestSession(data: { userId?: string | null; diagnosticId: string; guestToken?: string | null }): Promise<TestSession>;
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
  getPracticeSection(id: string): Promise<PracticeSection | undefined>;
  getQuestionsForDrill(sectionId: string, userId: string, limit?: number): Promise<{ questions: Question[]; exhaustionWarning: boolean }>;

  createProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment>;
  getProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment | undefined>;
  updateEnrolmentWeek(enrolmentId: string, week: number): Promise<void>;
  completeEnrolment(enrolmentId: string): Promise<void>;
  getProgrammeMilestones(userId: string): Promise<ProgrammeMilestone[]>;
  completeMilestone(milestoneId: string, sessionId: string): Promise<ProgrammeMilestone>;
  autoCompleteDiagnosticMilestones(userId: string, diagnosticId: string, sessionId: string): Promise<void>;
  autoCompletePracticeMilestone(userId: string, currentWeek: number): Promise<void>;
  getWeeklyPlans(userId: string): Promise<WeeklyPlan[]>;
  generateWeeklyPlan(userId: string, enrolmentId: string, week: number, latestSession?: TestSession | null): Promise<WeeklyPlan>;

  getProgrammeTasks(userId: string, week?: number): Promise<ProgrammeTask[]>;
  generateWeeklyTasks(userId: string, enrolmentId: string, week: number): Promise<ProgrammeTask[]>;
  incrementTaskProgress(userId: string, taskType: string, skillId?: string): Promise<void>;

  migrateGuestUsage(guestSessionId: string, userId: string): Promise<void>;

  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: string, badgeId: string, sessionId?: string): Promise<UserBadge | null>;
  evaluateAndAwardBadges(userId: string, sessionId?: string): Promise<Badge[]>;
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

    let allQuestions = await db.select().from(questions)
      .where(and(
        eq(questions.diagnosticId, diagnosticId),
        eq(questions.qaStatus, "approved")
      ))
      .orderBy(questions.orderIndex);

    const DIFFICULTY_PROFILES: Record<string, { easy: number; medium: number; hard: number }> = {
      mini: { easy: 0.25, medium: 0.50, hard: 0.25 },
      full: { easy: 0.20, medium: 0.45, hard: 0.35 },
      mock: { easy: 0.15, medium: 0.40, hard: 0.45 },
      practice_paper: { easy: 0.20, medium: 0.45, hard: 0.35 },
    };
    const diffProfile = DIFFICULTY_PROFILES[diag.type] || DIFFICULTY_PROFILES.full;

    if (allQuestions.length < diag.questionCount) {
      const poolQuestions = await this.selectPoolQuestions(diag.questionCount, diag.sections, userId, allQuestions.map(q => q.id), diffProfile);
      allQuestions = [...allQuestions, ...poolQuestions].slice(0, Math.max(diag.questionCount, allQuestions.length + poolQuestions.length));
    }

    if (allQuestions.length === 0) {
      return this.getQuestionsByDiagnostic(diagnosticId);
    }

    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const cooldownCutoff = Date.now() - COOLDOWN_MS;

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));

    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));

    const freshQuestions: Question[] = [];
    const recentQuestions: { question: Question; lastServed: number }[] = [];

    for (const q of allQuestions) {
      const usage = usageMap.get(q.id);
      if (!usage || !usage.lastServedAt || usage.lastServedAt.getTime() <= cooldownCutoff) {
        freshQuestions.push(q);
      } else {
        recentQuestions.push({ question: q, lastServed: usage.lastServedAt.getTime() });
      }
    }

    let workingQuestions: Question[];
    if (freshQuestions.length >= diag.questionCount) {
      workingQuestions = freshQuestions;
    } else {
      console.warn(`[Session] Pool exhausted for diagnostic ${diagnosticId}: only ${freshQuestions.length} fresh of ${diag.questionCount} needed. Expanding to least-recently-served.`);
      recentQuestions.sort((a, b) => a.lastServed - b.lastServed);
      const needed = diag.questionCount - freshQuestions.length;
      workingQuestions = [...freshQuestions, ...recentQuestions.slice(0, needed).map(r => r.question)];
    }

    const scored = workingQuestions.map(q => {
      const usage = usageMap.get(q.id);
      const served = usage?.servedCount || 0;
      const lastServed = usage?.lastServedAt?.getTime() || 0;
      const freshBonus = lastServed <= cooldownCutoff ? 5 : 0;
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

  private async selectPoolQuestions(
    count: number,
    sections: string[],
    userId: string,
    excludeIds: string[] = [],
    difficultyProfile?: { easy: number; medium: number; hard: number },
  ): Promise<Question[]> {
    const profile = difficultyProfile || { easy: 0.25, medium: 0.50, hard: 0.25 };
    const perSection = Math.ceil(count / sections.length);
    const results: Question[] = [];

    for (const section of sections) {
      let pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
        ));

      if (excludeIds.length > 0) {
        pool = pool.filter(q => !excludeIds.includes(q.id));
      }

      const shuffled = pool.sort(() => Math.random() - 0.5);

      const easyCount = Math.round(perSection * profile.easy);
      const mediumCount = Math.round(perSection * profile.medium);
      const hardCount = perSection - easyCount - mediumCount;

      const byDiff = (d: string) => shuffled.filter(q => q.difficulty === d);
      const easy = byDiff('easy').slice(0, easyCount);
      const medium = byDiff('medium').slice(0, mediumCount);
      const hard = byDiff('hard').slice(0, hardCount);
      let sectionQuestions = [...easy, ...medium, ...hard];

      if (sectionQuestions.length < perSection) {
        const usedIds = new Set(sectionQuestions.map(q => q.id));
        const remaining = shuffled.filter(q => !usedIds.has(q.id));
        sectionQuestions = [...sectionQuestions, ...remaining.slice(0, perSection - sectionQuestions.length)];
      }

      results.push(...sectionQuestions);
    }

    return results.sort(() => Math.random() - 0.5).slice(0, count);
  }

  async selectQuestionsForPracticePaper(
    userId: string,
    questionCount: number,
    sections: string[] = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"],
  ): Promise<Question[]> {
    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const cooldownCutoff = Date.now() - COOLDOWN_MS;

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));
    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));

    const perSection = Math.ceil(questionCount / sections.length);
    const selected: Question[] = [];

    for (const section of sections) {
      const pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
        ));

      const fresh = pool.filter(q => {
        const usage = usageMap.get(q.id);
        return !usage || !usage.lastServedAt || usage.lastServedAt.getTime() <= cooldownCutoff;
      });

      const workingPool = fresh.length >= perSection ? fresh : pool;

      const scored = workingPool.map(q => {
        const usage = usageMap.get(q.id);
        return { question: q, score: this.scoreDiversity(q, selected) + (usage ? 0 : 5) };
      }).sort((a, b) => b.score - a.score);

      const easyN = Math.round(perSection * 0.20);
      const medN = Math.round(perSection * 0.45);
      const hardN = perSection - easyN - medN;

      const byDiff = (d: string) => scored.filter(s => s.question.difficulty === d);
      const pick = [
        ...byDiff('easy').slice(0, easyN),
        ...byDiff('medium').slice(0, medN),
        ...byDiff('hard').slice(0, hardN),
      ];

      let sectionPick = pick.map(p => p.question);
      if (sectionPick.length < perSection) {
        const usedIds = new Set(sectionPick.map(q => q.id));
        const extra = scored.filter(s => !usedIds.has(s.question.id)).slice(0, perSection - sectionPick.length);
        sectionPick = [...sectionPick, ...extra.map(e => e.question)];
      }

      selected.push(...sectionPick);
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

    return selected.sort(() => Math.random() - 0.5).slice(0, questionCount);
  }

  async getQuestionsForDrill(sectionId: string, userId: string, limit: number = 10): Promise<{ questions: Question[]; exhaustionWarning: boolean }> {
    const [section] = await db.select().from(practiceSections).where(eq(practiceSections.id, sectionId));
    if (!section) return { questions: [], exhaustionWarning: false };

    const sectionName = section.category;
    const skillFilter = section.skillId;
    const sectionDifficulty = section.difficulty?.toLowerCase();

    let pool: Question[];
    if (skillFilter) {
      const conditions = [
        eq(questions.skillId, skillFilter),
        eq(questions.qaStatus, "approved"),
      ];
      if (sectionDifficulty && sectionDifficulty !== 'mixed') {
        conditions.push(eq(questions.difficulty, sectionDifficulty));
      }
      pool = await db.select().from(questions)
        .where(and(...conditions));
      
      if (pool.length < limit && sectionDifficulty) {
        pool = await db.select().from(questions)
          .where(and(
            eq(questions.skillId, skillFilter),
            eq(questions.qaStatus, "approved")
          ));
      }

      if (pool.length === 0) {
        pool = await db.select().from(questions)
          .where(and(
            eq(questions.section, sectionName),
            eq(questions.qaStatus, "approved")
          ));
      }
    } else {
      pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, sectionName),
          eq(questions.qaStatus, "approved")
        ));
    }

    if (pool.length === 0) {
      console.log(`[Drill] No questions found for skill ${skillFilter} or section ${sectionName} with approved status. Checking all statuses.`);
      pool = await db.select().from(questions)
        .where(eq(questions.section, sectionName));
    }

    console.log(`[Drill] Pool size for ${sectionName}: ${pool.length}`);

    if (pool.length === 0) {
      console.error(`[Drill] ABSOLUTELY NO questions found for section ${sectionName}`);
      return { questions: [], exhaustionWarning: false };
    }

    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const cooldownCutoff = Date.now() - COOLDOWN_MS;

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));
    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));

    const freshPool: typeof pool = [];
    const cooledDownPool: { question: Question; lastServed: number }[] = [];

    for (const q of pool) {
      const usage = usageMap.get(q.id);
      if (!usage || !usage.lastServedAt) {
        freshPool.push(q);
      } else if (usage.lastServedAt.getTime() <= cooldownCutoff) {
        freshPool.push(q);
      } else {
        cooledDownPool.push({ question: q, lastServed: usage.lastServedAt.getTime() });
      }
    }

    let exhaustionWarning = false;
    let workingPool: Question[];

    if (freshPool.length >= limit) {
      workingPool = freshPool;
    } else if (freshPool.length > 0) {
      exhaustionWarning = true;
      console.warn(`[Drill] Pool nearly exhausted for ${sectionName}: only ${freshPool.length} fresh questions available (need ${limit}). Expanding to least-recently-served.`);
      cooledDownPool.sort((a, b) => a.lastServed - b.lastServed);
      const needed = limit - freshPool.length;
      workingPool = [...freshPool, ...cooledDownPool.slice(0, needed).map(c => c.question)];
    } else {
      exhaustionWarning = true;
      console.warn(`[Drill] Pool fully exhausted for ${sectionName}: all ${pool.length} questions served within 7 days. Using least-recently-served.`);
      cooledDownPool.sort((a, b) => a.lastServed - b.lastServed);
      workingPool = cooledDownPool.map(c => c.question);
    }

    const scored = workingPool.map(q => {
      const usage = usageMap.get(q.id);
      const served = usage?.servedCount || 0;
      const lastServed = usage?.lastServedAt?.getTime() || 0;
      const freshBonus = lastServed <= cooldownCutoff ? 5 : 0;
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

    return { questions: finalSelected, exhaustionWarning };
  }

  async createTestSession(data: { userId?: string | null; diagnosticId: string; guestToken?: string | null }): Promise<TestSession> {
    const [session] = await db.insert(testSessions).values({
      userId: data.userId ?? null,
      diagnosticId: data.diagnosticId,
      guestToken: data.guestToken ?? null,
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

  async getPracticeSection(id: string): Promise<PracticeSection | undefined> {
    const [section] = await db.select().from(practiceSections).where(eq(practiceSections.id, id));
    return section;
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

    const keyMilestones = [
      { week: 1, type: "diagnostic", title: "Baseline Diagnostic", desc: "Establish your starting point with a full diagnostic assessment.", diagId: "full-a" },
      { week: 6, type: "diagnostic", title: "Progress Check", desc: "Measure improvement after 5 weeks of targeted practice.", diagId: "full-b" },
      { week: 12, type: "mock", title: "Mock Exam", desc: "Simulate exam-day conditions with a complete timed paper.", diagId: "mock-1" },
      { week: 16, type: "diagnostic", title: "Final Assessment", desc: "Your final forecast before the exam window.", diagId: "full-a" },
    ];

    for (const m of keyMilestones) {
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

    const weeklyPracticeTemplates: Record<number, { title: string; desc: string; type: string }[]> = {};
    for (let w = 1; w <= 16; w++) {
      const phase = getPhase(w);
      const tasks: { title: string; desc: string; type: string }[] = [];

      if (phase === "Baseline & Foundation") {
        tasks.push(
          { title: "Complete 3 VR Drills", desc: "Build verbal reasoning foundations with 3 practice drills.", type: "practice" },
          { title: "Complete 2 Maths Drills", desc: "Strengthen core maths skills with 2 practice drills.", type: "practice" },
          { title: "Complete 2 NVR Drills", desc: "Develop non-verbal reasoning with 2 practice drills.", type: "practice" },
        );
      } else if (phase === "Targeted Skill Elevation") {
        tasks.push(
          { title: "Complete 3 Focused Drills", desc: "Work on your weakest areas with targeted drills.", type: "practice" },
          { title: "Complete 2 Mixed Drills", desc: "Cross-skill practice to build flexibility.", type: "practice" },
          { title: "Complete 1 Timed Drill", desc: "Practice under timed conditions.", type: "practice" },
        );
      } else if (phase === "Exam Conditioning") {
        tasks.push(
          { title: "Complete 2 Timed Drills", desc: "Build exam stamina with timed practice.", type: "practice" },
          { title: "Complete 3 Skill Drills", desc: "Maintain skill sharpness across all areas.", type: "practice" },
          { title: "Review Weak Areas", desc: "Focus on areas flagged in your latest diagnostic.", type: "practice" },
        );
      } else {
        tasks.push(
          { title: "Complete 3 Revision Drills", desc: "Final revision across all skill areas.", type: "practice" },
          { title: "Complete 2 Timed Drills", desc: "Maintain exam readiness with timed practice.", type: "practice" },
          { title: "Confidence Check", desc: "Quick practice to build confidence before the exam.", type: "practice" },
        );
      }

      weeklyPracticeTemplates[w] = tasks;
    }

    for (let w = 1; w <= 16; w++) {
      const tasks = weeklyPracticeTemplates[w];
      const dueAt = new Date(startAt.getTime() + (w - 1) * 7 * 24 * 60 * 60 * 1000 + 6 * 24 * 60 * 60 * 1000);
      for (const task of tasks) {
        await db.insert(programmeMilestones).values({
          userId,
          enrolmentId: enrolment.id,
          week: w,
          milestoneType: task.type,
          title: task.title,
          description: task.desc,
          dueAt,
        });
      }
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

  async autoCompleteDiagnosticMilestones(userId: string, diagnosticId: string, sessionId: string): Promise<void> {
    const milestones = await db.select().from(programmeMilestones)
      .where(and(
        eq(programmeMilestones.userId, userId),
        eq(programmeMilestones.linkedDiagnosticId, diagnosticId),
        isNull(programmeMilestones.completedAt),
      ))
      .orderBy(programmeMilestones.week);

    if (milestones.length > 0) {
      const milestone = milestones[0];
      await db.update(programmeMilestones)
        .set({ completedAt: new Date(), linkedSessionId: sessionId })
        .where(eq(programmeMilestones.id, milestone.id));
    }
  }

  async autoCompletePracticeMilestone(userId: string, currentWeek: number): Promise<void> {
    const milestones = await db.select().from(programmeMilestones)
      .where(and(
        eq(programmeMilestones.userId, userId),
        eq(programmeMilestones.week, currentWeek),
        eq(programmeMilestones.milestoneType, "practice"),
        isNull(programmeMilestones.completedAt),
      ))
      .orderBy(programmeMilestones.id);

    if (milestones.length > 0) {
      await db.update(programmeMilestones)
        .set({ completedAt: new Date() })
        .where(eq(programmeMilestones.id, milestones[0].id));
    }
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

  async migrateGuestUsage(guestSessionId: string, userId: string): Promise<void> {
    const guestId = `guest-${guestSessionId}`;
    const guestUsageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, guestId));

    if (guestUsageRows.length === 0) return;

    const userUsageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));
    const userUsageMap = new Map(userUsageRows.map(u => [u.questionId, u]));

    for (const guestRow of guestUsageRows) {
      const existing = userUsageMap.get(guestRow.questionId);
      if (existing) {
        const newCount = (existing.servedCount || 0) + (guestRow.servedCount || 0);
        const latestServed = guestRow.lastServedAt && existing.lastServedAt
          ? (guestRow.lastServedAt > existing.lastServedAt ? guestRow.lastServedAt : existing.lastServedAt)
          : guestRow.lastServedAt || existing.lastServedAt;
        await db.update(questionUsage)
          .set({ servedCount: newCount, lastServedAt: latestServed })
          .where(and(eq(questionUsage.userId, userId), eq(questionUsage.questionId, guestRow.questionId)));
      } else {
        await db.insert(questionUsage).values({
          userId,
          questionId: guestRow.questionId,
          servedCount: guestRow.servedCount,
          lastServedAt: guestRow.lastServedAt,
        });
      }
    }

    await db.delete(questionUsage).where(eq(questionUsage.userId, guestId));
  }

  async getProgrammeTasks(userId: string, week?: number): Promise<ProgrammeTask[]> {
    if (week !== undefined) {
      return db.select().from(programmeTasks)
        .where(and(eq(programmeTasks.userId, userId), eq(programmeTasks.week, week)))
        .orderBy(programmeTasks.week, programmeTasks.taskType);
    }
    return db.select().from(programmeTasks)
      .where(eq(programmeTasks.userId, userId))
      .orderBy(programmeTasks.week, programmeTasks.taskType);
  }

  async generateWeeklyTasks(userId: string, enrolmentId: string, week: number): Promise<ProgrammeTask[]> {
    const existing = await db.select().from(programmeTasks)
      .where(and(
        eq(programmeTasks.userId, userId),
        eq(programmeTasks.enrolmentId, enrolmentId),
        eq(programmeTasks.week, week),
      ));
    if (existing.length > 0) return existing;

    const phase = getPhase(week);
    const taskDefs: { taskType: string; title: string; description: string; skillId?: string; targetCount: number }[] = [];

    const vrSkills = ['vr.vocab', 'vr.sequences', 'vr.word_structure', 'vr.codes', 'vr.verbal_logic', 'vr.word_sequences'];
    const nvrSkills = ['nvr.sequence', 'nvr.transform', 'nvr.classification', 'nvr.symmetry'];
    const mathsSkills = ['maths.arithmetic', 'maths.fractions', 'maths.word_problems', 'maths.data', 'maths.patterns', 'maths.percentages', 'maths.ratio'];

    const weekVr = vrSkills[(week - 1) % vrSkills.length];
    const weekNvr = nvrSkills[(week - 1) % nvrSkills.length];
    const weekMaths = mathsSkills[(week - 1) % mathsSkills.length];

    if (phase === "Baseline & Foundation") {
      taskDefs.push(
        { taskType: 'drill', title: 'Complete 3 VR Drills', description: 'Build verbal reasoning foundations.', skillId: weekVr, targetCount: 3 },
        { taskType: 'drill', title: 'Complete 2 Maths Drills', description: 'Strengthen core maths skills.', skillId: weekMaths, targetCount: 2 },
        { taskType: 'drill', title: 'Complete 2 NVR Drills', description: 'Develop non-verbal reasoning.', skillId: weekNvr, targetCount: 2 },
      );
      if (week === 1) {
        taskDefs.push({ taskType: 'diagnostic', title: 'Take Baseline Diagnostic', description: 'Complete the baseline assessment to set your starting point.', targetCount: 1 });
      }
    } else if (phase === "Targeted Skill Elevation") {
      taskDefs.push(
        { taskType: 'drill', title: 'Complete 3 Focused Drills', description: 'Work on your weakest areas.', skillId: weekVr, targetCount: 3 },
        { taskType: 'drill', title: 'Complete 2 Mixed Drills', description: 'Cross-skill practice.', skillId: weekMaths, targetCount: 2 },
        { taskType: 'drill', title: 'Complete 1 Timed Drill', description: 'Practice under exam conditions.', skillId: weekNvr, targetCount: 1 },
      );
      if (week === 6) {
        taskDefs.push({ taskType: 'diagnostic', title: 'Take Progress Check', description: 'Measure your improvement with a full diagnostic.', targetCount: 1 });
      }
    } else if (phase === "Exam Conditioning") {
      taskDefs.push(
        { taskType: 'drill', title: 'Complete 2 Timed Drills', description: 'Build exam stamina.', skillId: weekVr, targetCount: 2 },
        { taskType: 'drill', title: 'Complete 3 Skill Drills', description: 'Maintain sharpness.', skillId: weekMaths, targetCount: 3 },
        { taskType: 'drill', title: 'Review Weak Areas', description: 'Focus on flagged areas.', skillId: weekNvr, targetCount: 2 },
      );
      if (week === 12) {
        taskDefs.push({ taskType: 'diagnostic', title: 'Take Mock Exam', description: 'Full exam simulation under timed conditions.', targetCount: 1 });
      }
    } else {
      taskDefs.push(
        { taskType: 'drill', title: 'Complete 3 Revision Drills', description: 'Final revision across all areas.', skillId: weekVr, targetCount: 3 },
        { taskType: 'drill', title: 'Complete 2 Timed Drills', description: 'Maintain exam readiness.', skillId: weekMaths, targetCount: 2 },
        { taskType: 'drill', title: 'Confidence Check', description: 'Build confidence with quick practice.', skillId: weekNvr, targetCount: 1 },
      );
      if (week === 16) {
        taskDefs.push({ taskType: 'diagnostic', title: 'Take Final Assessment', description: 'Final readiness check before the exam.', targetCount: 1 });
      }
    }

    const tasks: ProgrammeTask[] = [];
    for (const def of taskDefs) {
      const [task] = await db.insert(programmeTasks).values({
        userId,
        enrolmentId,
        week,
        taskType: def.taskType,
        title: def.title,
        description: def.description,
        skillId: def.skillId || null,
        targetCount: def.targetCount,
      }).returning();
      tasks.push(task);
    }

    return tasks;
  }

  async incrementTaskProgress(userId: string, taskType: string, skillId?: string): Promise<void> {
    const enrolment = await this.getProgrammeEnrolment(userId);
    if (!enrolment) return;

    const currentWeek = enrolment.currentWeek;

    let conditions = [
      eq(programmeTasks.userId, userId),
      eq(programmeTasks.week, currentWeek),
      eq(programmeTasks.taskType, taskType),
      eq(programmeTasks.status, 'pending'),
    ];

    const tasks = await db.select().from(programmeTasks)
      .where(and(...conditions))
      .orderBy(programmeTasks.id);

    for (const task of tasks) {
      if (skillId && task.skillId && task.skillId !== skillId) continue;

      const newCount = (task.completedCount || 0) + 1;
      const completed = newCount >= task.targetCount;

      await db.update(programmeTasks)
        .set({
          completedCount: newCount,
          status: completed ? 'completed' : 'pending',
          completedAt: completed ? new Date() : null,
        })
        .where(eq(programmeTasks.id, task.id));
      break;
    }
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

  async getAllBadges(): Promise<Badge[]> {
    return db.select().from(badges).orderBy(badges.sortOrder);
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    const rows = await db.select().from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    return rows.map(r => ({
      ...r.user_badges,
      badge: r.badges,
    }));
  }

  async awardBadge(userId: string, badgeId: string, sessionId?: string): Promise<UserBadge | null> {
    const result = await db.insert(userBadges).values({
      userId,
      badgeId,
      sessionId: sessionId || null,
    }).onConflictDoNothing().returning();
    return result.length > 0 ? result[0] : null;
  }

  async evaluateAndAwardBadges(userId: string, sessionId?: string): Promise<Badge[]> {
    const allBadges = await this.getAllBadges();
    const existingBadges = await db.select().from(userBadges)
      .where(eq(userBadges.userId, userId));
    const earnedIds = new Set(existingBadges.map(b => b.badgeId));

    const sessions = await this.getUserTestSessions(userId);
    const completed = sessions.filter(s => s.completedAt);

    const newlyEarned: Badge[] = [];

    for (const badge of allBadges) {
      if (earnedIds.has(badge.id)) continue;

      const criteria = badge.criteria as any;
      let earned = false;

      switch (criteria.type) {
        case 'diagnostics_completed':
          earned = completed.length >= criteria.count;
          break;

        case 'forecast_score':
          earned = completed.some(s => (s.forecastScore || 0) >= criteria.score);
          break;

        case 'perfect_section':
          earned = completed.some(s => {
            const scores = s.sectionScores as any[];
            return scores?.some((sec: any) => sec.score === 100 && sec.total >= 3);
          });
          break;

        case 'accuracy_percent': {
          earned = completed.some(s => {
            const scores = s.sectionScores as any[];
            if (!scores || scores.length === 0) return false;
            const totalCorrect = scores.reduce((sum: number, sec: any) => sum + (sec.correct || 0), 0);
            const totalQ = scores.reduce((sum: number, sec: any) => sum + (sec.total || 0), 0);
            return totalQ > 0 && (totalCorrect / totalQ) * 100 >= criteria.percent;
          });
          break;
        }

        case 'active_days': {
          const uniqueDays = new Set(
            completed.map(s => new Date(s.startedAt).toISOString().split('T')[0])
          );
          earned = uniqueDays.size >= criteria.count;
          break;
        }

        case 'score_improvement': {
          if (completed.length >= 2) {
            const scores = completed
              .filter(s => s.forecastScore)
              .map(s => s.forecastScore!);
            if (scores.length >= 2) {
              const firstScore = scores[scores.length - 1];
              const bestScore = Math.max(...scores);
              earned = (bestScore - firstScore) >= criteria.points;
            }
          }
          break;
        }

        case 'all_under_pace': {
          earned = completed.some(s => {
            const pace = s.paceData as any[];
            return pace?.length > 0 && pace.every((p: any) => p.avg <= p.expected);
          });
          break;
        }

        case 'avg_time_under': {
          earned = completed.some(s => {
            const pace = s.paceData as any[];
            if (!pace || pace.length === 0) return false;
            const totalAvg = pace.reduce((sum: number, p: any) => sum + p.avg, 0) / pace.length;
            return totalAvg <= criteria.seconds;
          });
          break;
        }
      }

      if (earned) {
        const result = await this.awardBadge(userId, badge.id, sessionId);
        if (result) newlyEarned.push(badge);
      }
    }

    return newlyEarned;
  }

}

export const storage = new DatabaseStorage();

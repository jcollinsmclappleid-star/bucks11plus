import { eq, desc, and, sql, asc, ne, inArray, notInArray, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  users, diagnostics, questions, testSessions, testAnswers, articles, practiceSections,
  programmeEnrolments, programmeMilestones, weeklyPlans, questionUsage, contentCalibration,
  programmeTasks, badges, userBadges, guideLeads, childProfiles, emailEvents, testDayConfig,
  type User, type InsertUser, type Diagnostic, type Question,
  type TestSession, type TestAnswer, type Article, type PracticeSection,
  type ProgrammeEnrolment, type ProgrammeMilestone, type WeeklyPlan,
  type ProgrammeTask, type OnboardingData, type Badge, type UserBadge,
  type GuideLead, type InsertGuideLead,
  type ChildProfile, type InsertChildProfile,
  type EmailEvent, type InsertEmailEvent,
  type TestDayConfig, type InsertTestDayConfig,
} from "@shared/schema";

// Each fixed diagnostic/mock has its own exclusive comprehension passage set.
// These passage IDs map directly to renderConfig.passageId on comp questions.
// No two diagnostics share a passage — prevents repeat passages across tests.
const DIAGNOSTIC_PASSAGES: Record<string, string[]> = {
  'full-a':  ['P3', 'P5'],
  'full-b':  ['P7', 'P10'],
  'mock-1':  ['P11'],
  'mock-2':  ['P14'],
  'mock-3':  ['P16'],
};

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

  createGuideLead(data: InsertGuideLead): Promise<GuideLead>;
  markGuideLeadDiagnosticClick(id: number): Promise<GuideLead | undefined>;

  createChildProfile(data: InsertChildProfile): Promise<ChildProfile>;
  getChildProfiles(userId: string): Promise<ChildProfile[]>;
  getChildProfile(id: string): Promise<ChildProfile | undefined>;
  updateChildProfile(id: string, data: Partial<ChildProfile>): Promise<ChildProfile>;
  deleteChildProfile(id: string): Promise<void>;
  setActiveChildProfile(userId: string, profileId: string | null): Promise<User>;

  createEmailEvent(data: InsertEmailEvent): Promise<EmailEvent>;
  getEmailEvents(userId: string, emailType?: string): Promise<EmailEvent[]>;

  getTestDayConfig(userId: string): Promise<TestDayConfig | undefined>;
  setTestDayConfig(data: InsertTestDayConfig): Promise<TestDayConfig>;
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
        targetSchool: data.targetSchool || null,
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
    if (!diag) { console.log(`[QFS] Diagnostic not found: ${diagnosticId}`); return []; }

    const isGuestSession = userId.startsWith('guest-');

    // Pool segregation: full/mock use the 'diagnostic' pool; mini and all guest sessions are unrestricted
    // (guests rely on freePool flag instead — freePool questions are always in the practice pool).
    const diagPoolFilter: string[] | null =
      (!isGuestSession && (diag.type === 'full' || diag.type === 'mock')) ? ['diagnostic', 'any'] : null;

    console.log(`[QFS] diag=${diagnosticId} type=${diag.type} isGuest=${isGuestSession} diagPoolFilter=${JSON.stringify(diagPoolFilter)}`);

    // Guest sessions bypass the diagnosticId-pinned query entirely.
    // The mini-q-* placeholder questions (diagnosticId='mini-1') are superseded by the
    // embedded bank in freePoolData.ts. Going straight to the pool ensures bank questions
    // are always used, not the simple placeholders.
    let allQuestions: Question[] = isGuestSession ? [] : await db.select().from(questions)
      .where(and(
        eq(questions.diagnosticId, diagnosticId),
        eq(questions.qaStatus, "approved"),
        diagPoolFilter ? inArray(questions.questionPool, diagPoolFilter) : sql`TRUE`,
      ))
      .orderBy(questions.orderIndex);

    console.log(`[QFS] pinned questions: ${allQuestions.length}`);

    const DIFFICULTY_PROFILES: Record<string, { easy: number; medium: number; hard: number }> = {
      mini: { easy: 0.25, medium: 0.50, hard: 0.25 },
      full: { easy: 0.20, medium: 0.45, hard: 0.35 },
      mock: { easy: 0.15, medium: 0.40, hard: 0.45 },
      practice_paper: { easy: 0.20, medium: 0.45, hard: 0.35 },
    };
    const diffProfile = DIFFICULTY_PROFILES[diag.type] || DIFFICULTY_PROFILES.full;

    // For mini/guest sessions that include English Comprehension: always supplement from the pool
    // so comprehension questions are guaranteed even when seed questions fill the count.
    // Mini-q-* seed questions are VR/NVR/Math only — they never contain comprehension.
    const needsCompSupplement =
      (isGuestSession || diag.type === 'mini') &&
      diag.sections.includes('English Comprehension') &&
      !allQuestions.some(q => q.renderType === 'comprehension');

    if (allQuestions.length < diag.questionCount || needsCompSupplement) {
      const poolQuestions = await this.selectPoolQuestions(
        diag.questionCount, diag.sections, userId, allQuestions.map(q => q.id), diffProfile, diag.type, diagPoolFilter, diagnosticId
      );
      console.log(`[QFS] pool questions returned: ${poolQuestions.length}`);
      allQuestions = [...allQuestions, ...poolQuestions];
    }

    console.log(`[QFS] allQuestions after pool: ${allQuestions.length}`);

    if (allQuestions.length === 0) {
      console.log(`[QFS] EMPTY: isGuest=${isGuestSession} diagPoolFilter=${JSON.stringify(diagPoolFilter)}`);
      // For guest sessions or pool-restricted diagnostics (full/mock), never fall back to
      // unrestricted questions — returning empty signals a seeding problem cleanly.
      if (isGuestSession || diagPoolFilter !== null) return [];
      return this.getQuestionsByDiagnostic(diagnosticId);
    }

    // Comprehension ordering: ensure passage-atomic groups and sort within each passage
    const compPassageMap = new Map<string, Question[]>();
    const nonCompQuestions: Question[] = [];
    for (const q of allQuestions) {
      if (q.renderType === 'comprehension') {
        const rc = q.renderConfig as any;
        const pid = rc?.passageId || q.subRuleId || '__none__';
        if (!compPassageMap.has(pid)) compPassageMap.set(pid, []);
        compPassageMap.get(pid)!.push(q);
      } else {
        nonCompQuestions.push(q);
      }
    }

    // Sort each passage group by questionIndex
    for (const [, qs] of compPassageMap.entries()) {
      qs.sort((a, b) => {
        const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
        const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
        return idxA - idxB;
      });
    }

    // Defensive passage expansion: if passage subset is incomplete, fetch missing questions.
    // Skipped for: guest sessions (always partial), mini diagnostics (intentional 3-question slice),
    // and full/mock diagnostics (now use partial-passage mode capped at compCeiling).
    if (!isGuestSession && diag.type !== 'mini' && diag.type !== 'full' && diag.type !== 'mock') {
      for (const [, qs] of compPassageMap.entries()) {
        const firstQ = qs[0];
        const rc = firstQ.renderConfig as any;
        const total: number | undefined = rc?.totalQuestionsInPassage;
        if (total && qs.length < total) {
          const pid = rc?.passageId || firstQ.subRuleId || '__none__';
          const existingIds = qs.map(q => q.id);
          const missing = await db.select().from(questions).where(and(
            eq(questions.qaStatus, 'approved'),
            sql`render_config->>'passageId' = ${pid}`,
            existingIds.length > 0 ? notInArray(questions.id, existingIds) : sql`TRUE`
          ));
          qs.push(...missing);
          qs.sort((a, b) => {
            const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
            const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
            return idxA - idxB;
          });
        }
      }
    }

    // For mini diagnostics and guest sessions: enforce exactly COMP_SLOTS comprehension questions
    // from the first available passage, then fill remaining slots with weighted non-comp questions.
    // This guarantees a fixed comp/non-comp split regardless of what the pool query returned.
    const COMP_SLOTS = (isGuestSession || diag.type === 'mini') ? 3 : 0;
    let orderedComp: Question[];
    if (COMP_SLOTS > 0) {
      // Pick exactly COMP_SLOTS questions from a single passage (first passage alphabetically by passageId)
      const passages = [...compPassageMap.values()].sort((a, b) => {
        const pidA = (a[0].renderConfig as any)?.passageId || '';
        const pidB = (b[0].renderConfig as any)?.passageId || '';
        return pidA.localeCompare(pidB);
      });
      const chosenPassage = passages.length > 0
        ? passages[Math.floor(Math.random() * passages.length)]
        : [];
      orderedComp = chosenPassage.slice(0, COMP_SLOTS);
    } else {
      // Full/mock: use all comp questions in their passage groups
      orderedComp = [...compPassageMap.values()].flat();
    }

    const nonCompSlots = diag.questionCount - orderedComp.length;

    // Round-robin interleave non-comp by canonical section order
    const CANONICAL_ORDER = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"];
    const guestNonCompBySection = new Map<string, Question[]>();
    for (const q of nonCompQuestions) {
      if (!guestNonCompBySection.has(q.section)) guestNonCompBySection.set(q.section, []);
      guestNonCompBySection.get(q.section)!.push(q);
    }
    const guestNonCompBuckets = CANONICAL_ORDER
      .map(s => guestNonCompBySection.get(s) ?? [])
      .concat([...guestNonCompBySection.entries()]
        .filter(([s]) => !CANONICAL_ORDER.includes(s))
        .map(([, qs]) => qs))
      .filter(b => b.length > 0);
    const guestInterleaved: Question[] = [];
    const guestMaxLen = Math.max(0, ...guestNonCompBuckets.map(b => b.length));
    for (let i = 0; i < guestMaxLen; i++) {
      for (const bucket of guestNonCompBuckets) {
        if (i < bucket.length) guestInterleaved.push(bucket[i]);
      }
    }

    // Final assembly: exactly questionCount questions, comp first then non-comp
    allQuestions = [...orderedComp, ...guestInterleaved.slice(0, Math.max(0, nonCompSlots))];

    // Top-up pass: if pool shortage left us short of questionCount, backfill with any remaining
    // approved free-pool questions not already selected (avoids returning fewer than expected).
    if (allQuestions.length < diag.questionCount && (isGuestSession || diag.type === 'mini')) {
      const selectedIds = new Set(allQuestions.map(q => q.id));
      const extras = await db.select().from(questions)
        .where(and(
          eq(questions.qaStatus, 'approved'),
          eq(questions.freePool, true),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
        ));
      const backfill = extras.filter(q => !selectedIds.has(q.id));
      allQuestions = [...allQuestions, ...backfill.slice(0, diag.questionCount - allQuestions.length)];
    }

    // For guests, skip usage tracking
    if (isGuestSession) {
      return allQuestions.slice(0, diag.questionCount);
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

    // Re-sort: comprehension questions come first (two-phase timer requirement),
    // then non-comp questions are interleaved round-robin by section.
    const compSelected = selected.filter(q => q.renderType === 'comprehension');
    const nonCompSelected = selected.filter(q => q.renderType !== 'comprehension');
    compSelected.sort((a, b) => {
      const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
      const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
      return idxA - idxB;
    });

    // Round-robin interleave non-comp by canonical section order (VR → NVR → Math → …)
    const CANONICAL_SECTION_ORDER = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"];
    const nonCompSectionMap = new Map<string, Question[]>();
    for (const q of nonCompSelected) {
      if (!nonCompSectionMap.has(q.section)) nonCompSectionMap.set(q.section, []);
      nonCompSectionMap.get(q.section)!.push(q);
    }
    const nonCompBuckets = CANONICAL_SECTION_ORDER
      .map(s => nonCompSectionMap.get(s) ?? [])
      .concat([...nonCompSectionMap.entries()]
        .filter(([s]) => !CANONICAL_SECTION_ORDER.includes(s))
        .map(([, qs]) => qs))
      .filter(b => b.length > 0);
    const interleavedNonComp: Question[] = [];
    const ncMaxLen = Math.max(0, ...nonCompBuckets.map(b => b.length));
    for (let i = 0; i < ncMaxLen; i++) {
      for (const bucket of nonCompBuckets) {
        if (i < bucket.length) interleavedNonComp.push(bucket[i]);
      }
    }

    const orderedSelected = [...compSelected, ...interleavedNonComp];

    const now = new Date();
    for (const q of orderedSelected) {
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

    return orderedSelected;
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
    diagType?: string,
    poolFilter?: string[] | null,
    currentDiagnosticId?: string,
  ): Promise<Question[]> {
    const isGuest = userId.startsWith('guest-');
    const user = isGuest ? null : await this.getUser(userId);
    const isEarlyLearner = user?.subscriptionTier === "early_learner";

    const SECTION_WEIGHTS: Record<string, number> = {
      "Verbal Reasoning": 0.35,
      "Mathematics": 0.25,
      "Non-Verbal Reasoning": 0.25,
      "English Comprehension": 0.15,
    };

    const DIFFICULTY_PROFILES: Record<string, { easy: number; medium: number; hard: number }> = {
      mini: { easy: 0.25, medium: 0.50, hard: 0.25 },
      full: { easy: 0.20, medium: 0.45, hard: 0.35 },
      mock: { easy: 0.15, medium: 0.40, hard: 0.45 },
      practice_paper: { easy: 0.20, medium: 0.45, hard: 0.35 },
    };

    const profile = difficultyProfile || DIFFICULTY_PROFILES[diagType || 'full'] || DIFFICULTY_PROFILES.full;
    const diffProfile = isEarlyLearner
      ? { easy: profile.easy + profile.hard * 0.4, medium: profile.medium + profile.hard * 0.6, hard: 0 }
      : profile;

    const nonCompSections = sections.filter(s => s !== 'English Comprehension');
    const nonCompTotalWeight = nonCompSections.reduce((sum, s) => sum + (SECTION_WEIGHTS[s] ?? 0.25), 0);
    const perSection = (section: string) =>
      Math.ceil(count * ((SECTION_WEIGHTS[section] ?? 0.25) / nonCompTotalWeight));

    const results: Question[] = [];

    console.log(`[SPQ] count=${count} sections=${JSON.stringify(sections)} isGuest=${isGuest} poolFilter=${JSON.stringify(poolFilter)} diagType=${diagType}`);

    for (const section of sections) {
      let pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
          isGuest ? eq(questions.freePool, true) : sql`TRUE`,
          poolFilter && poolFilter.length > 0 ? inArray(questions.questionPool, poolFilter) : sql`TRUE`,
        ));

      console.log(`[SPQ] section=${section} rawPool=${pool.length}`);

      if (excludeIds.length > 0) {
        pool = pool.filter(q => !excludeIds.includes(q.id));
      }

      if (isEarlyLearner) {
        pool = pool.filter(q => q.difficulty !== 'hard');
      }

      // Comprehension: passage-atomic selection with ceiling
      if (section === "English Comprehension") {
        // Restrict passages to those assigned to this specific diagnostic,
        // preventing the same passage appearing in multiple tests for the same user.
        const allowedPassages = currentDiagnosticId ? DIAGNOSTIC_PASSAGES[currentDiagnosticId] : undefined;
        if (allowedPassages) {
          pool = pool.filter(q => {
            const pid = (q.renderConfig as any)?.passageId;
            return pid && allowedPassages.includes(pid);
          });
        }

        const passageGroupsMap = new Map<string, Question[]>();
        for (const q of pool) {
          const rc = q.renderConfig as any;
          const pid = rc?.passageId || q.subRuleId || '__none__';
          if (!passageGroupsMap.has(pid)) passageGroupsMap.set(pid, []);
          passageGroupsMap.get(pid)!.push(q);
        }

        for (const qs of passageGroupsMap.values()) {
          qs.sort((a, b) => {
            const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
            const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
            return idxA - idxB;
          });
        }

        const sortedPassages = [...passageGroupsMap.values()]
          .sort(() => Math.random() - 0.5)
          .sort((a, b) => a.length - b.length);

        // Mini diagnostics and guest sessions: partial passage mode.
        // Pick the first 3 questions from a randomly selected passage.
        // This allows comprehension to appear without atomic passages
        // flooding a small question budget.
        if (diagType === 'mini' || isGuest) {
          if (sortedPassages.length > 0) {
            const randomPassage = sortedPassages[Math.floor(Math.random() * sortedPassages.length)];
            results.push(...randomPassage.slice(0, 3));
          }
          continue;
        }

        // Full / mock: partial-passage mode — slice to compCeiling questions.
        // 1 passage for 'full' (ceil ~10 of 40q), up to 2 passages for 'mock' (~12 of 50q).
        // This fixes the previous all-or-nothing logic which required qs.length <= ceiling
        // (impossible since all passages have 14-15 questions).
        const compCeiling = Math.floor(count * 0.25);
        const maxPassages = diagType === 'mock' ? 2 : 1;
        const compResult: Question[] = [];
        let passagesUsed = 0;

        for (const qs of sortedPassages) {
          if (passagesUsed >= maxPassages || compResult.length >= compCeiling) break;
          const take = Math.min(qs.length, compCeiling - compResult.length);
          compResult.push(...qs.slice(0, take));
          passagesUsed++;
        }

        results.push(...compResult);
        continue;
      }

      // Non-comp: difficulty-proportional selection with backfill
      const sectionTarget = perSection(section);
      const shuffled = pool.sort(() => Math.random() - 0.5);

      const easyCount = Math.round(sectionTarget * diffProfile.easy);
      const mediumCount = Math.round(sectionTarget * diffProfile.medium);
      const hardCount = sectionTarget - easyCount - mediumCount;

      const byDiff = (d: string) => shuffled.filter(q => q.difficulty === d);
      let sectionQuestions = [
        ...byDiff('easy').slice(0, easyCount),
        ...byDiff('medium').slice(0, mediumCount),
        ...byDiff('hard').slice(0, Math.max(0, hardCount)),
      ];

      if (sectionQuestions.length < sectionTarget) {
        const usedIds = new Set(sectionQuestions.map(q => q.id));
        const remaining = shuffled.filter(q => !usedIds.has(q.id));
        sectionQuestions = [...sectionQuestions, ...remaining.slice(0, sectionTarget - sectionQuestions.length)];
      }

      results.push(...sectionQuestions);
    }

    // Proportional final assembly — comp first, then non-comp round-robin interleaved
    const compResults = results.filter(q => q.renderType === 'comprehension');
    const nonCompResults = results.filter(q => q.renderType !== 'comprehension');
    const nonCompTarget = Math.max(0, count - compResults.length);

    const nonCompBySection = new Map<string, Question[]>();
    for (const q of nonCompResults) {
      if (!nonCompBySection.has(q.section)) nonCompBySection.set(q.section, []);
      nonCompBySection.get(q.section)!.push(q);
    }
    for (const qs of nonCompBySection.values()) qs.sort(() => Math.random() - 0.5);

    // Proportional allocation per section into buckets
    const sectionBuckets = new Map<string, Question[]>();
    const takenBySection = new Map<string, number>();
    let allocated = 0;
    nonCompSections.forEach((section, i) => {
      const weight = SECTION_WEIGHTS[section] ?? 0.25;
      const isLast = i === nonCompSections.length - 1;
      const target = isLast
        ? nonCompTarget - allocated
        : Math.round(nonCompTarget * (weight / nonCompTotalWeight));
      allocated += target;
      const qs = nonCompBySection.get(section) ?? [];
      const take = Math.min(Math.max(0, target), qs.length);
      sectionBuckets.set(section, qs.slice(0, take));
      takenBySection.set(section, take);
    });

    // Backfill shortfall across surplus
    const totalAllocated = [...sectionBuckets.values()].reduce((sum, b) => sum + b.length, 0);
    const stillNeeded = nonCompTarget - totalAllocated;
    if (stillNeeded > 0) {
      const surplus = nonCompSections
        .flatMap(s => {
          const qs = nonCompBySection.get(s) ?? [];
          const taken = takenBySection.get(s) ?? 0;
          return qs.slice(taken);
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, stillNeeded);
      for (const q of surplus) {
        const bucket = sectionBuckets.get(q.section);
        if (bucket) bucket.push(q);
        else sectionBuckets.set(q.section, [q]);
      }
    }

    // Round-robin interleave buckets (VR → NVR → Math → VR → NVR → Math …)
    const orderedBuckets = nonCompSections
      .map(s => sectionBuckets.get(s) ?? [])
      .filter(b => b.length > 0);
    const interleaved: Question[] = [];
    const maxLen = Math.max(0, ...orderedBuckets.map(b => b.length));
    for (let i = 0; i < maxLen; i++) {
      for (const bucket of orderedBuckets) {
        if (i < bucket.length) interleaved.push(bucket[i]);
      }
    }

    const finalResult = [...compResults, ...interleaved];
    console.log(`[SPQ] returning ${finalResult.length} questions (comp=${compResults.length} nonComp=${interleaved.length})`);
    return finalResult;
  }

  async selectQuestionsForPracticePaper(
    userId: string,
    questionCount: number,
    sections: string[] = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
  ): Promise<Question[]> {
    const user = await this.getUser(userId);
    const isEarlyLearner = user?.subscriptionTier === "early_learner";

    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const cooldownCutoff = Date.now() - COOLDOWN_MS;

    const usageRows = await db.select().from(questionUsage)
      .where(eq(questionUsage.userId, userId));
    const usageMap = new Map(usageRows.map(u => [u.questionId, u]));

    const nonCompSections = sections.filter(s => s !== 'English Comprehension');
    const hasComp = sections.includes('English Comprehension');

    // Comprehension takes up to 25% of total budget; the rest is split across non-comp sections
    const compQuota = hasComp ? Math.floor(questionCount * 0.25) : 0;
    const nonCompCount = questionCount - compQuota;
    const perNonCompSection = nonCompSections.length > 0
      ? Math.ceil(nonCompCount / nonCompSections.length)
      : 0;

    const compQuestions: Question[] = [];
    const nonCompBuckets = new Map<string, Question[]>();

    // === Comprehension: passage-grouped selection ===
    // Pick 1-2 complete passages and take questions in questionIndex order.
    // This ensures students read one passage through, not snippets from many.
    const PRACTICE_POOL_FILTER = ['practice', 'any'];

    if (hasComp && compQuota > 0) {
      const compPool = await db.select().from(questions)
        .where(and(
          eq(questions.section, 'English Comprehension'),
          eq(questions.qaStatus, "approved"),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
          isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`,
          inArray(questions.questionPool, PRACTICE_POOL_FILTER),
        ));

      // Group by passage
      const passageMap = new Map<string, Question[]>();
      for (const q of compPool) {
        const rc = q.renderConfig as any;
        const pid = rc?.passageId || q.subRuleId || '__none__';
        if (!passageMap.has(pid)) passageMap.set(pid, []);
        passageMap.get(pid)!.push(q);
      }
      // Sort each passage by questionIndex
      for (const qs of passageMap.values()) {
        qs.sort((a, b) => {
          const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
          const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
          return idxA - idxB;
        });
      }

      // Prefer passages with the most fresh (uncooled) questions, then shuffle within each tier
      const scoredPassages = [...passageMap.entries()].map(([pid, qs]) => {
        const freshCount = qs.filter(q => {
          const usage = usageMap.get(q.id);
          return !usage || !usage.lastServedAt || usage.lastServedAt.getTime() <= cooldownCutoff;
        }).length;
        return { pid, qs, freshCount };
      });
      // Sort: most fresh first; random within same freshness score
      scoredPassages.sort((a, b) => {
        if (b.freshCount !== a.freshCount) return b.freshCount - a.freshCount;
        return Math.random() - 0.5;
      });

      // For a 20q quick paper use 1 passage; for 40q/50q allow up to 2
      const maxPassages = questionCount >= 40 ? 2 : 1;
      let passagesUsed = 0;

      for (const { qs } of scoredPassages) {
        if (passagesUsed >= maxPassages || compQuestions.length >= compQuota) break;
        const take = Math.min(qs.length, compQuota - compQuestions.length);
        // Prefer fresh questions within the passage; keep them sorted by questionIndex
        const freshQs = qs.filter(q => {
          const usage = usageMap.get(q.id);
          return !usage || !usage.lastServedAt || usage.lastServedAt.getTime() <= cooldownCutoff;
        });
        const staleQs = qs.filter(q => {
          const usage = usageMap.get(q.id);
          return usage && usage.lastServedAt && usage.lastServedAt.getTime() > cooldownCutoff;
        });
        // Use fresh questions first, then stale if needed; sort each group by questionIndex
        const sortByIndex = (arr: Question[]) => [...arr].sort((a, b) => {
          const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
          const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
          return idxA - idxB;
        });
        const orderedQs = [...sortByIndex(freshQs), ...sortByIndex(staleQs)];
        compQuestions.push(...orderedQs.slice(0, take));
        passagesUsed++;
      }
    }

    // === Non-comp sections: difficulty-proportional with freshness preference ===
    for (const section of nonCompSections) {
      const pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          sql`${questions.skillId} IS NOT NULL AND ${questions.skillId} != ''`,
          isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`,
          inArray(questions.questionPool, PRACTICE_POOL_FILTER),
        ));

      const fresh = pool.filter(q => {
        const usage = usageMap.get(q.id);
        return !usage || !usage.lastServedAt || usage.lastServedAt.getTime() <= cooldownCutoff;
      });

      const workingPool = fresh.length >= perNonCompSection ? fresh : pool;
      const shuffled = workingPool.sort(() => Math.random() - 0.5);

      const easyN = Math.round(perNonCompSection * (isEarlyLearner ? 0.40 : 0.20));
      const medN = Math.round(perNonCompSection * (isEarlyLearner ? 0.60 : 0.45));
      const hardN = isEarlyLearner ? 0 : perNonCompSection - easyN - medN;

      const byDiff = (d: string) => shuffled.filter(q => q.difficulty === d);
      let pick = [
        ...byDiff('easy').slice(0, easyN),
        ...byDiff('medium').slice(0, medN),
        ...byDiff('hard').slice(0, Math.max(0, hardN)),
      ];

      if (pick.length < perNonCompSection) {
        const usedIds = new Set(pick.map(q => q.id));
        const extra = shuffled.filter(q => !usedIds.has(q.id)).slice(0, perNonCompSection - pick.length);
        pick = [...pick, ...extra];
      }

      nonCompBuckets.set(section, pick.slice(0, perNonCompSection));
    }

    // === Round-robin interleave non-comp buckets (VR → NVR → Math → VR → …) ===
    const orderedNonCompBuckets = nonCompSections
      .map(s => nonCompBuckets.get(s) ?? [])
      .filter(b => b.length > 0);
    const interleavedNonComp: Question[] = [];
    const maxLen = Math.max(0, ...orderedNonCompBuckets.map(b => b.length));
    for (let i = 0; i < maxLen; i++) {
      for (const bucket of orderedNonCompBuckets) {
        if (i < bucket.length) interleavedNonComp.push(bucket[i]);
      }
    }

    // Comp block first (for two-phase timer compatibility), then interleaved non-comp
    const selected = [...compQuestions, ...interleavedNonComp].slice(0, questionCount);

    // Track usage
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

  async getQuestionsForDrill(sectionId: string, userId: string, limit: number = 10): Promise<{ questions: Question[]; exhaustionWarning: boolean }> {
    const user = await this.getUser(userId);
    const isEarlyLearner = user?.subscriptionTier === "early_learner";

    const [section] = await db.select().from(practiceSections).where(eq(practiceSections.id, sectionId));
    if (!section) return { questions: [], exhaustionWarning: false };

    const sectionName = section.category;
    const skillFilter = section.skillId;
    const sectionDifficulty = section.difficulty?.toLowerCase();

    const DRILL_POOL_FILTER = ['practice', 'any'];

    // ── Comprehension drills: passage-atomic selection ─────────────────────
    // Diversity selection breaks comp drills (it picks 1 question per passage).
    // Instead: group all comp pool questions by passage, rank passages by how
    // recently they were served, pick 1 or 2 whole passages, return all their
    // questions sorted by questionIndex within each passage.
    if (sectionName === 'English Comprehension') {
      const allCompPool = await db.select().from(questions)
        .where(and(
          eq(questions.section, 'English Comprehension'),
          eq(questions.qaStatus, 'approved'),
          inArray(questions.questionPool, DRILL_POOL_FILTER),
          isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`,
        ));

      // Group questions by passageId
      const passageMap = new Map<string, Question[]>();
      for (const q of allCompPool) {
        const pid = (q.renderConfig as any)?.passageId || q.subRuleId || '__none__';
        if (!passageMap.has(pid)) passageMap.set(pid, []);
        passageMap.get(pid)!.push(q);
      }

      // Sort each passage's questions by questionIndex
      for (const qs of passageMap.values()) {
        qs.sort((a, b) => {
          const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
          const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
          return idxA - idxB;
        });
      }

      // Load usage for this user to rank passages by freshness
      const usageRows = await db.select().from(questionUsage).where(eq(questionUsage.userId, userId));
      const usageMap = new Map(usageRows.map(u => [u.questionId, u]));
      const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
      const cooldownCutoff = Date.now() - COOLDOWN_MS;

      // Score each passage: use the most-recently-served question as the proxy.
      // Lower lastServed = more "fresh" = pick this passage first.
      const passageScores: { pid: string; lastServed: number; allFresh: boolean }[] = [];
      for (const [pid, qs] of passageMap.entries()) {
        let maxLastServed = 0;
        let allFresh = true;
        for (const q of qs) {
          const usage = usageMap.get(q.id);
          if (usage?.lastServedAt) {
            const t = usage.lastServedAt.getTime();
            if (t > maxLastServed) maxLastServed = t;
            if (t > cooldownCutoff) allFresh = false;
          }
        }
        passageScores.push({ pid, lastServed: maxLastServed, allFresh });
      }

      // Sort: unserved passages first, then by least-recently-served
      passageScores.sort((a, b) => {
        if (a.allFresh !== b.allFresh) return a.allFresh ? -1 : 1;
        return a.lastServed - b.lastServed;
      });

      // Shuffle passages within the same freshness tier for variety
      const freshPassages = passageScores.filter(p => p.allFresh);
      const usedPassages  = passageScores.filter(p => !p.allFresh);
      for (let i = freshPassages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [freshPassages[i], freshPassages[j]] = [freshPassages[j], freshPassages[i]];
      }
      const ranked = [...freshPassages, ...usedPassages];

      const exhaustionWarning = freshPassages.length === 0;

      // Pick 1 passage (or 2 if limit is large enough to fit two passages)
      const questionsPerPassage = passageMap.get(ranked[0]?.pid)?.length ?? 15;
      const maxPassages = limit >= questionsPerPassage * 2 ? 2 : 1;

      const finalSelected: Question[] = [];
      for (let i = 0; i < Math.min(maxPassages, ranked.length); i++) {
        const qs = passageMap.get(ranked[i].pid) ?? [];
        finalSelected.push(...qs);
        if (finalSelected.length >= limit) break;
      }

      // Mark usage
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
    // ──────────────────────────────────────────────────────────────────────

    let pool: Question[];
    if (skillFilter) {
      const conditions = [
        eq(questions.skillId, skillFilter),
        eq(questions.qaStatus, "approved"),
        inArray(questions.questionPool, DRILL_POOL_FILTER),
      ];
      if (isEarlyLearner) {
        conditions.push(ne(questions.difficulty, 'hard'));
      }
      if (sectionDifficulty && sectionDifficulty !== 'mixed') {
        if (!(isEarlyLearner && sectionDifficulty === 'hard')) {
          conditions.push(eq(questions.difficulty, sectionDifficulty));
        } else {
          // If section is hard but user is early learner, fallback to mixed or just exclude hard
          conditions.push(ne(questions.difficulty, 'hard'));
        }
      }
      pool = await db.select().from(questions)
        .where(and(...conditions));
      
      if (pool.length < limit && sectionDifficulty) {
        pool = await db.select().from(questions)
          .where(and(
            eq(questions.skillId, skillFilter),
            eq(questions.qaStatus, "approved"),
            inArray(questions.questionPool, DRILL_POOL_FILTER),
            isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`
          ));
      }

      if (pool.length === 0) {
        pool = await db.select().from(questions)
          .where(and(
            eq(questions.section, sectionName),
            eq(questions.qaStatus, "approved"),
            inArray(questions.questionPool, DRILL_POOL_FILTER),
            isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`
          ));
      }
    } else {
      pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, sectionName),
          eq(questions.qaStatus, "approved"),
          inArray(questions.questionPool, DRILL_POOL_FILTER),
          isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`
        ));
    }

    if (pool.length === 0) {
      console.log(`[Drill] No questions found for skill ${skillFilter} or section ${sectionName} with approved status. Checking all statuses.`);
      pool = await db.select().from(questions)
        .where(and(
          eq(questions.section, sectionName),
          inArray(questions.questionPool, DRILL_POOL_FILTER),
          isEarlyLearner ? ne(questions.difficulty, 'hard') : sql`TRUE`
        ));
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

    let finalSelected = selected.slice(0, limit);

    // For comprehension drills: regroup by passage and sort within each passage by questionIndex
    // so the frontend receives contiguous passage blocks (passage 1 all, then passage 2 all, etc.)
    if (skillFilter?.startsWith('comp.')) {
      const passageMap = new Map<string, Question[]>();
      for (const q of finalSelected) {
        const pid = (q.renderConfig as any)?.passageId || q.subRuleId || '__none__';
        if (!passageMap.has(pid)) passageMap.set(pid, []);
        passageMap.get(pid)!.push(q);
      }
      for (const qs of passageMap.values()) {
        qs.sort((a, b) => {
          const idxA = (a.renderConfig as any)?.questionIndex ?? a.orderIndex;
          const idxB = (b.renderConfig as any)?.questionIndex ?? b.orderIndex;
          return idxA - idxB;
        });
      }
      const seen = new Set<string>();
      const reordered: Question[] = [];
      for (const q of finalSelected) {
        const pid = (q.renderConfig as any)?.passageId || q.subRuleId || '__none__';
        if (!seen.has(pid)) {
          seen.add(pid);
          reordered.push(...(passageMap.get(pid) ?? []));
        }
      }
      finalSelected = reordered.slice(0, limit);
    }

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

  async createGuideLead(data: InsertGuideLead): Promise<GuideLead> {
    const [lead] = await db.insert(guideLeads).values(data).returning();
    return lead;
  }

  async markGuideLeadDiagnosticClick(id: number): Promise<GuideLead | undefined> {
    const [lead] = await db
      .update(guideLeads)
      .set({ clickedDiagnostic: true })
      .where(eq(guideLeads.id, id))
      .returning();
    return lead;
  }

  async createChildProfile(data: InsertChildProfile): Promise<ChildProfile> {
    const [profile] = await db.insert(childProfiles).values(data).returning();
    return profile;
  }

  async getChildProfiles(userId: string): Promise<ChildProfile[]> {
    return db.select().from(childProfiles).where(eq(childProfiles.userId, userId)).orderBy(asc(childProfiles.createdAt));
  }

  async getChildProfile(id: string): Promise<ChildProfile | undefined> {
    const [profile] = await db.select().from(childProfiles).where(eq(childProfiles.id, id));
    return profile;
  }

  async updateChildProfile(id: string, data: Partial<ChildProfile>): Promise<ChildProfile> {
    const [profile] = await db.update(childProfiles).set(data).where(eq(childProfiles.id, id)).returning();
    return profile;
  }

  async deleteChildProfile(id: string): Promise<void> {
    await db.delete(childProfiles).where(eq(childProfiles.id, id));
  }

  async setActiveChildProfile(userId: string, profileId: string | null): Promise<User> {
    const [user] = await db.update(users).set({ activeChildProfileId: profileId }).where(eq(users.id, userId)).returning();
    return user;
  }

  async createEmailEvent(data: InsertEmailEvent): Promise<EmailEvent> {
    const [event] = await db.insert(emailEvents).values(data).returning();
    return event;
  }

  async getEmailEvents(userId: string, emailType?: string): Promise<EmailEvent[]> {
    if (emailType) {
      return db.select().from(emailEvents).where(and(eq(emailEvents.userId, userId), eq(emailEvents.emailType, emailType))).orderBy(desc(emailEvents.sentAt));
    }
    return db.select().from(emailEvents).where(eq(emailEvents.userId, userId)).orderBy(desc(emailEvents.sentAt));
  }

  async getTestDayConfig(userId: string): Promise<TestDayConfig | undefined> {
    const [config] = await db.select().from(testDayConfig).where(eq(testDayConfig.userId, userId));
    return config;
  }

  async setTestDayConfig(data: InsertTestDayConfig): Promise<TestDayConfig> {
    const existing = await this.getTestDayConfig(data.userId);
    if (existing) {
      const [config] = await db.update(testDayConfig).set({ examDate: data.examDate }).where(eq(testDayConfig.userId, data.userId)).returning();
      return config;
    }
    const [config] = await db.insert(testDayConfig).values(data).returning();
    return config;
  }
}

export const storage = new DatabaseStorage();

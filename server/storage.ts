import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, diagnostics, questions, testSessions, testAnswers, articles, practiceSections,
  programmeEnrolments, programmeMilestones, weeklyPlans,
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

  createTestSession(data: { userId: string; diagnosticId: string }): Promise<TestSession>;
  getTestSession(id: string): Promise<TestSession | undefined>;
  getUserTestSessions(userId: string): Promise<TestSession[]>;
  completeTestSession(id: string, results: {
    totalScore: number; forecastScore: number; band: string; sectionScores: any; paceData: any;
  }): Promise<TestSession>;

  createTestAnswer(data: {
    sessionId: string; questionId: string; selectedAnswer: string | null; isCorrect: boolean; timeTaken: number;
  }): Promise<TestAnswer>;
  getSessionAnswers(sessionId: string): Promise<TestAnswer[]>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getPracticeSections(): Promise<PracticeSection[]>;

  createProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment>;
  getProgrammeEnrolment(userId: string): Promise<ProgrammeEnrolment | undefined>;
  updateEnrolmentWeek(enrolmentId: string, week: number): Promise<void>;
  completeEnrolment(enrolmentId: string): Promise<void>;
  getProgrammeMilestones(userId: string): Promise<ProgrammeMilestone[]>;
  completeMilestone(milestoneId: string, sessionId: string): Promise<ProgrammeMilestone>;
  getWeeklyPlans(userId: string): Promise<WeeklyPlan[]>;
  generateWeeklyPlan(userId: string, enrolmentId: string, week: number, latestSession?: TestSession | null): Promise<WeeklyPlan>;
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
    totalScore: number; forecastScore: number; band: string; sectionScores: any; paceData: any;
  }): Promise<TestSession> {
    const [session] = await db.update(testSessions)
      .set({
        completedAt: new Date(),
        totalScore: results.totalScore,
        forecastScore: results.forecastScore,
        band: results.band,
        sectionScores: results.sectionScores,
        paceData: results.paceData,
      })
      .where(eq(testSessions.id, id))
      .returning();
    return session;
  }

  async createTestAnswer(data: {
    sessionId: string; questionId: string; selectedAnswer: string | null; isCorrect: boolean; timeTaken: number;
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
}

export const storage = new DatabaseStorage();

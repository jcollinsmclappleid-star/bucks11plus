import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, diagnostics, questions, testSessions, testAnswers, articles, practiceSections,
  type User, type InsertUser, type Diagnostic, type Question,
  type TestSession, type TestAnswer, type Article, type PracticeSection,
  type OnboardingData,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboarding(userId: string, data: OnboardingData): Promise<User>;
  updateUserSubscription(userId: string, tier: string): Promise<User>;

  getDiagnostics(): Promise<Diagnostic[]>;
  getDiagnostic(id: string): Promise<Diagnostic | undefined>;

  getQuestionsByDiagnostic(diagnosticId: string): Promise<Question[]>;

  createTestSession(data: { userId: string; diagnosticId: string }): Promise<TestSession>;
  getTestSession(id: string): Promise<TestSession | undefined>;
  getUserTestSessions(userId: string): Promise<TestSession[]>;
  completeTestSession(id: string, results: {
    totalScore: number;
    forecastScore: number;
    band: string;
    sectionScores: any;
    paceData: any;
  }): Promise<TestSession>;

  createTestAnswer(data: {
    sessionId: string;
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean;
    timeTaken: number;
  }): Promise<TestAnswer>;
  getSessionAnswers(sessionId: string): Promise<TestAnswer[]>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;

  getPracticeSections(): Promise<PracticeSection[]>;
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

  async updateUserSubscription(userId: string, tier: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ subscriptionTier: tier })
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
    totalScore: number;
    forecastScore: number;
    band: string;
    sectionScores: any;
    paceData: any;
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
    sessionId: string;
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean;
    timeTaken: number;
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
}

export const storage = new DatabaseStorage();

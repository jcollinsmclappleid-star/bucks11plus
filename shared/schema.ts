import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  childName: text("child_name"),
  childYear: text("child_year"),
  practiceHours: text("practice_hours"),
  difficultyAreas: text("difficulty_areas").array(),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
});

export const diagnostics = pgTable("diagnostics", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  questionCount: integer("question_count").notNull(),
  requiredTier: text("required_tier").notNull().default("free"),
  sections: text("sections").array().notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  diagnosticId: varchar("diagnostic_id").notNull(),
  section: text("section").notNull(),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  timeExpected: integer("time_expected").notNull().default(60),
  orderIndex: integer("order_index").notNull().default(0),
});

export const testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  diagnosticId: varchar("diagnostic_id").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  totalScore: integer("total_score"),
  forecastScore: integer("forecast_score"),
  band: text("band"),
  sectionScores: jsonb("section_scores"),
  paceData: jsonb("pace_data"),
});

export const testAnswers = pgTable("test_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionId: varchar("question_id").notNull(),
  selectedAnswer: text("selected_answer"),
  isCorrect: boolean("is_correct"),
  timeTaken: integer("time_taken"),
});

export const practiceSections = pgTable("practice_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(),
  questionCount: integer("question_count").notNull(),
  requiredTier: text("required_tier").notNull().default("free"),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  readTime: text("read_time").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const onboardingSchema = z.object({
  childName: z.string().min(1),
  childYear: z.string().min(1),
  practiceHours: z.string().min(1),
  difficultyAreas: z.array(z.string()),
});

export const insertDiagnosticSchema = createInsertSchema(diagnostics);
export const insertQuestionSchema = createInsertSchema(questions);
export const insertTestSessionSchema = createInsertSchema(testSessions).omit({ id: true, startedAt: true });
export const insertTestAnswerSchema = createInsertSchema(testAnswers).omit({ id: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, publishedAt: true });
export const insertPracticeSectionSchema = createInsertSchema(practiceSections).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Diagnostic = typeof diagnostics.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type TestSession = typeof testSessions.$inferSelect;
export type TestAnswer = typeof testAnswers.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type PracticeSection = typeof practiceSections.$inferSelect;
export type OnboardingData = z.infer<typeof onboardingSchema>;

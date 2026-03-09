import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, smallint, numeric, primaryKey } from "drizzle-orm/pg-core";
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
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: text("stripe_customer_id"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
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
  diagnosticId: varchar("diagnostic_id"),
  section: text("section").notNull(),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  timeExpected: integer("time_expected").notNull().default(60),
  orderIndex: integer("order_index").notNull().default(0),
  skillId: text("skill_id").notNull().default(""),
  subRuleId: text("sub_rule_id").notNull().default(""),
  renderType: text("render_type").notNull().default("text"),
  renderConfig: jsonb("render_config").notNull().default({}),
  trapTypes: text("trap_types").array().notNull().default(sql`'{}'::text[]`),
  cognitiveLoad: smallint("cognitive_load").notNull().default(3),
  locale: text("locale").notNull().default("en-GB"),
  britishSpelling: boolean("british_spelling").notNull().default(true),
  version: integer("version").notNull().default(1),
  qualityScore: smallint("quality_score").notNull().default(0),
  qaStatus: text("qa_status").notNull().default("draft"),
  estTimeSeconds: integer("est_time_seconds").notNull().default(30),
  explanation: text("explanation"),
  notes: text("notes"),
});

export const questionUsage = pgTable("question_usage", {
  userId: varchar("user_id").notNull(),
  questionId: varchar("question_id").notNull(),
  servedCount: integer("served_count").notNull().default(0),
  lastServedAt: timestamp("last_served_at"),
}, (t) => [
  primaryKey({ columns: [t.userId, t.questionId] }),
]);

export const contentCalibration = pgTable("content_calibration", {
  questionId: varchar("question_id").primaryKey(),
  pValue: numeric("p_value", { precision: 4, scale: 3 }),
  avgTimeSeconds: integer("avg_time_seconds"),
  sampleSize: integer("sample_size").notNull().default(0),
  lastCalibratedAt: timestamp("last_calibrated_at"),
});

export const questionVariants = pgTable("question_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").notNull(),
  variantPrompt: text("variant_prompt"),
  variantOptions: jsonb("variant_options"),
  variantRenderConfig: jsonb("variant_render_config"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  diagnosticId: varchar("diagnostic_id").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  totalScore: integer("total_score"),
  forecastScore: integer("forecast_score"),
  band: text("band"),
  sectionScores: jsonb("section_scores"),
  paceData: jsonb("pace_data"),
  metrics: jsonb("metrics"),
  guestToken: text("guest_token"),
});

export const testAnswers = pgTable("test_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionId: varchar("question_id").notNull(),
  selectedAnswer: text("selected_answer"),
  isCorrect: boolean("is_correct"),
  timeTaken: integer("time_taken"),
  questionOrder: integer("question_order"),
});

export const practiceSections = pgTable("practice_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(),
  questionCount: integer("question_count").notNull(),
  requiredTier: text("required_tier").notNull().default("free"),
  skillId: text("skill_id"),
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

export const programmeEnrolments = pgTable("programme_enrolments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  status: text("status").notNull().default("active"),
  startAt: timestamp("start_at").notNull().defaultNow(),
  endAt: timestamp("end_at").notNull(),
  currentWeek: integer("current_week").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const programmeMilestones = pgTable("programme_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  enrolmentId: varchar("enrolment_id").notNull(),
  week: integer("week").notNull(),
  milestoneType: text("milestone_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueAt: timestamp("due_at"),
  completedAt: timestamp("completed_at"),
  linkedDiagnosticId: varchar("linked_diagnostic_id"),
  linkedSessionId: varchar("linked_session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weeklyPlans = pgTable("weekly_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  enrolmentId: varchar("enrolment_id").notNull(),
  week: integer("week").notNull(),
  phase: text("phase").notNull(),
  planJson: jsonb("plan_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const programmeTasks = pgTable("programme_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  enrolmentId: varchar("enrolment_id").notNull(),
  week: integer("week").notNull(),
  taskType: text("task_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  skillId: text("skill_id"),
  targetCount: integer("target_count").notNull().default(1),
  completedCount: integer("completed_count").notNull().default(0),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  linkedSessionId: varchar("linked_session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  tier: text("tier").notNull().default("bronze"),
  criteria: jsonb("criteria").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  sessionId: varchar("session_id"),
});

export const guideLeads = pgTable("guide_leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  parentName: text("parent_name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  clickedDiagnostic: boolean("clicked_diagnostic").notNull().default(false),
});

export const insertGuideLeadSchema = createInsertSchema(guideLeads).pick({
  parentName: true,
  email: true,
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
export type ProgrammeEnrolment = typeof programmeEnrolments.$inferSelect;
export type ProgrammeMilestone = typeof programmeMilestones.$inferSelect;
export type WeeklyPlan = typeof weeklyPlans.$inferSelect;
export type QuestionUsage = typeof questionUsage.$inferSelect;
export type ContentCalibration = typeof contentCalibration.$inferSelect;
export type QuestionVariant = typeof questionVariants.$inferSelect;
export type ProgrammeTask = typeof programmeTasks.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type OnboardingData = z.infer<typeof onboardingSchema>;
export type GuideLead = typeof guideLeads.$inferSelect;
export type InsertGuideLead = z.infer<typeof insertGuideLeadSchema>;

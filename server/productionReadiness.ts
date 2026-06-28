import { db } from "./db";
import { diagnostics, practiceSections, questions } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { storage } from "./storage";

const REQUIRED_DIAGNOSTICS = [
  "mini-1",
  "full-a",
  "full-b",
  "mock-1",
  "practice-quick",
  "practice-full",
  "practice-mock",
];

const MIN_APPROVED_PRACTICE = 2000;
const MIN_FREE_POOL = 20;
const MIN_DRILLS = 40;

export type ReadinessReport = {
  ok: boolean;
  checkedAt: string;
  questions: {
    total: number;
    approved: number;
    freePool: number;
    practicePool: number;
    diagnosticPool: number;
    bySection: Record<string, number>;
  };
  diagnostics: { expected: string[]; found: string[]; missing: string[] };
  drills: { count: number };
  miniDiagnostic: { fixedIds: number; loaded: number };
  env: Record<string, boolean>;
  issues: string[];
  warnings: string[];
};

function envPresent(key: string): boolean {
  const v = process.env[key]?.trim();
  return Boolean(v && v.length > 0);
}

export async function buildProductionReadinessReport(): Promise<ReadinessReport> {
  const issues: string[] = [];
  const warnings: string[] = [];

  const all = await storage.getAllQuestions();
  const approved = all.filter((q) => q.qaStatus === "approved");
  const freePool = all.filter((q) => q.freePool);
  const practicePool = all.filter((q) => q.questionPool === "practice" || q.questionPool === "any");
  const diagnosticPool = all.filter((q) => q.questionPool === "diagnostic");

  const bySection: Record<string, number> = {};
  for (const q of approved) {
    bySection[q.section] = (bySection[q.section] || 0) + 1;
  }

  const wrongSectionComp = all.filter((q) => q.section === "comprehension").length;
  if (wrongSectionComp > 0) {
    warnings.push(`${wrongSectionComp} questions still use section "comprehension" (should be "English Comprehension")`);
  }

  if (approved.length < MIN_APPROVED_PRACTICE) {
    issues.push(`Only ${approved.length} approved questions (need ≥${MIN_APPROVED_PRACTICE})`);
  }
  if (freePool.length < MIN_FREE_POOL) {
    issues.push(`Only ${freePool.length} free-pool questions (need ≥${MIN_FREE_POOL})`);
  }

  const diags = await db.select({ id: diagnostics.id }).from(diagnostics);
  const found = diags.map((d) => d.id);
  const missing = REQUIRED_DIAGNOSTICS.filter((id) => !found.includes(id));
  if (missing.length > 0) {
    issues.push(`Missing diagnostics: ${missing.join(", ")}`);
  }

  const [drillRow] = await db.select({ c: sql<number>`count(*)` }).from(practiceSections);
  const drillCount = Number(drillRow?.c || 0);
  if (drillCount < MIN_DRILLS) {
    issues.push(`Only ${drillCount} practice drill sections (need ≥${MIN_DRILLS})`);
  }

  const miniQs = await storage.selectQuestionsForSession("readiness-check", "mini-1");
  if (miniQs.length !== 12) {
    issues.push(`mini-1 loads ${miniQs.length} questions (expected 12 fixed)`);
  }

  const env = {
    DATABASE_URL: envPresent("DATABASE_URL"),
    SESSION_SECRET: envPresent("SESSION_SECRET"),
    EMAIL_SECRET: envPresent("EMAIL_SECRET") && (process.env.EMAIL_SECRET?.length ?? 0) >= 16,
    BASE_URL: envPresent("BASE_URL"),
    STRIPE_SECRET_KEY: envPresent("STRIPE_SECRET_KEY"),
    STRIPE_PUBLISHABLE_KEY: envPresent("STRIPE_PUBLISHABLE_KEY"),
    STRIPE_WEBHOOK_SECRET: envPresent("STRIPE_WEBHOOK_SECRET"),
    RESEND_API_KEY: envPresent("RESEND_API_KEY"),
    RESEND_FROM_EMAIL: envPresent("RESEND_FROM_EMAIL"),
  };

  if (!env.STRIPE_SECRET_KEY) issues.push("STRIPE_SECRET_KEY not set — checkout will fail");
  if (!env.STRIPE_PUBLISHABLE_KEY) {
    warnings.push("STRIPE_PUBLISHABLE_KEY not set — optional (checkout is server-side; no client Stripe.js)");
  }
  if (!env.STRIPE_WEBHOOK_SECRET) {
    warnings.push("STRIPE_WEBHOOK_SECRET not set — webhooks auto-registered on boot via stripe-replit-sync");
  }
  if (!env.RESEND_API_KEY) warnings.push("RESEND_API_KEY not set — emails will not send");
  if (!env.BASE_URL) warnings.push("BASE_URL not set — email/download links may be wrong");

  const nvrTransformation = approved.filter((q) => q.type === "transformation").length;
  if (nvrTransformation === 0) {
    warnings.push("No approved NVR transformation questions in bank (known seed gap)");
  }

  return {
    ok: issues.length === 0,
    checkedAt: new Date().toISOString(),
    questions: {
      total: all.length,
      approved: approved.length,
      freePool: freePool.length,
      practicePool: practicePool.length,
      diagnosticPool: diagnosticPool.length,
      bySection,
    },
    diagnostics: { expected: REQUIRED_DIAGNOSTICS, found, missing },
    drills: { count: drillCount },
    miniDiagnostic: { fixedIds: 12, loaded: miniQs.length },
    env,
    issues,
    warnings,
  };
}

/** DB-only repairs safe to run on every boot */
export async function repairQuestionAlignment(): Promise<void> {
  const fixed = await db
    .update(questions)
    .set({ section: "English Comprehension" })
    .where(eq(questions.section, "comprehension"));
  const n = (fixed as { rowCount?: number }).rowCount ?? 0;
  if (n > 0) {
    console.log(`✓ Repaired ${n} questions: section "comprehension" → "English Comprehension"`);
  }
}

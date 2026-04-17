/**
 * export_nvr_to_seed.ts
 * Exports all v6 NVR sequence questions (and the 3 FIXED_MINI NVR questions)
 * from the dev DB into scripts/questions.seed.json, preserving their IDs
 * so production seeding can insert them with the exact same IDs.
 */

import { db } from "../server/db";
import { questions } from "../shared/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const SEED_PATH = path.resolve(process.cwd(), "scripts/questions.seed.json");

// The 3 NVR FIXED_MINI question IDs (sequence, symmetry, transform)
const NVR_FIXED_IDS = [
  "5bafc63a-c3c8-459c-a249-5a4c33612a08", // NVR sequence easy v6 count_grow squares
  "100ae35d-8c82-4709-b2ce-0d36c5606a76", // NVR symmetry easy v4
  "0c889138-29c0-4fb7-a9cd-a950744cfc9c", // NVR transform easy v3
];

async function main() {
  console.log("Reading existing seed file...");
  const existing: any[] = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  console.log(`Existing seed entries: ${existing.length}`);

  // Remove any existing sequence/symmetry/transform entries from seed
  // (they'll be replaced with the new ones including IDs)
  const nonNvr = existing.filter(
    (q) => !["sequence", "symmetry", "transformation"].includes(q.type)
  );
  console.log(`After removing old NVR: ${nonNvr.length}`);

  // Fetch all v6 sequence questions from dev DB
  console.log("Fetching v6 sequence questions from dev DB...");
  const seqRows = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.type, "sequence"),
        eq(questions.questionPool, "practice"),
        eq(questions.qaStatus, "approved"),
        sql`COALESCE((render_config->>'version')::int, version, 1) >= 6`
      )
    );
  console.log(`Found ${seqRows.length} v6 sequence questions`);

  // Fetch the 3 NVR FIXED_MINI questions (symmetry, transform)
  console.log("Fetching 3 NVR FIXED_MINI questions...");
  const fixedRows = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, NVR_FIXED_IDS));
  console.log(`Found ${fixedRows.length} FIXED_MINI NVR questions`);

  // Merge: start with non-NVR, then add fixed (deduplicated), then remaining sequence
  const fixedIds = new Set(fixedRows.map((q) => q.id));
  const seqNonFixed = seqRows.filter((q) => !fixedIds.has(q.id));

  // Convert DB rows to seed format (with id field preserved)
  const toSeed = (q: typeof questions.$inferSelect) => ({
    id: q.id,
    section: q.section,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    estTimeSeconds: q.timeExpected,
    skillId: q.skillId,
    subRuleId: q.subRuleId,
    renderType: q.renderType,
    renderConfig: q.renderConfig,
    trapTypes: q.trapTypes,
    cognitiveLoad: q.cognitiveLoad,
    locale: q.locale,
    britishSpelling: q.britishSpelling,
    version: q.version,
    qaStatus: q.qaStatus,
    explanation: q.explanation,
    freePool: q.freePool,
  });

  const merged = [
    ...nonNvr,
    ...fixedRows.map(toSeed),
    ...seqNonFixed.map(toSeed),
  ];

  console.log(`Total seed entries after merge: ${merged.length}`);
  fs.writeFileSync(SEED_PATH, JSON.stringify(merged, null, 2));
  console.log(`✓ Written to ${SEED_PATH}`);

  // Summary
  const byType = merged.reduce((acc: Record<string, number>, q: any) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});
  console.log("By type:", JSON.stringify(byType, null, 2));

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

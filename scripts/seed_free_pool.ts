import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq, and, isNotNull, ne, sql } from "drizzle-orm";

/**
 * Marks a representative sample of approved questions as freePool = true.
 * Strategy: for each of the 4 sections, pick up to N questions spread across
 * difficulty levels and skill types.
 *
 * Usage:
 *   npx tsx scripts/seed_free_pool.ts
 *   npx tsx scripts/seed_free_pool.ts --dry-run   (preview only)
 *   npx tsx scripts/seed_free_pool.ts --reset      (clear all freePool flags first)
 */

const SECTIONS = [
  "Verbal Reasoning",
  "Non-Verbal Reasoning",
  "Mathematics",
  "English Comprehension",
];

const PER_SECTION_TARGETS = {
  "Verbal Reasoning": 8,
  "Non-Verbal Reasoning": 6,
  "Mathematics": 6,
  "English Comprehension": 4,
};

const isDryRun = process.argv.includes("--dry-run");
const shouldReset = process.argv.includes("--reset");

async function main() {
  console.log(`\n=== Seed Free Pool ===`);
  if (isDryRun) console.log("[DRY RUN] No changes will be written.");

  if (shouldReset && !isDryRun) {
    console.log("Resetting all freePool flags to false...");
    await db.update(questions).set({ freePool: false });
    console.log("Reset complete.");
  }

  let totalMarked = 0;

  for (const section of SECTIONS) {
    const target = PER_SECTION_TARGETS[section as keyof typeof PER_SECTION_TARGETS] ?? 5;

    const pool = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          isNotNull(questions.skillId),
          ne(questions.skillId, ""),
        ),
      );

    if (pool.length === 0) {
      console.log(`[${section}] No approved questions found — skipping.`);
      continue;
    }

    const byDiff: Record<string, typeof pool> = { easy: [], medium: [], hard: [] };
    for (const q of pool) {
      byDiff[q.difficulty]?.push(q);
    }

    for (const diff of Object.keys(byDiff)) {
      byDiff[diff].sort(() => Math.random() - 0.5);
    }

    const easyCount = Math.ceil(target * 0.25);
    const mediumCount = Math.ceil(target * 0.50);
    const hardCount = Math.max(0, target - easyCount - mediumCount);

    const selected = [
      ...byDiff.easy.slice(0, easyCount),
      ...byDiff.medium.slice(0, mediumCount),
      ...byDiff.hard.slice(0, hardCount),
    ];

    if (selected.length < target) {
      const usedIds = new Set(selected.map((q) => q.id));
      const remaining = pool.filter((q) => !usedIds.has(q.id));
      selected.push(...remaining.slice(0, target - selected.length));
    }

    console.log(
      `[${section}] Selecting ${selected.length}/${pool.length} questions ` +
      `(easy: ${byDiff.easy.slice(0, easyCount).length}, ` +
      `medium: ${byDiff.medium.slice(0, mediumCount).length}, ` +
      `hard: ${byDiff.hard.slice(0, hardCount).length})`,
    );

    if (!isDryRun && selected.length > 0) {
      const ids = selected.map((q) => q.id);
      for (const id of ids) {
        await db
          .update(questions)
          .set({ freePool: true })
          .where(eq(questions.id, id));
      }
    }

    totalMarked += selected.length;
  }

  console.log(`\n✓ ${isDryRun ? "Would mark" : "Marked"} ${totalMarked} questions as freePool = true.`);

  const totals = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.freePool, true));
  console.log(`Total freePool questions in DB: ${totals[0]?.count ?? 0}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});

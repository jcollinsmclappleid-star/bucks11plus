import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq, and, isNotNull, ne, sql } from "drizzle-orm";

/**
 * Marks a representative sample of approved questions as freePool = true.
 *
 * For VR / NVR / Mathematics: picks questions spread across difficulty levels.
 * For English Comprehension: picks the first 3 questions (by questionIndex)
 * from a randomly selected passage. Mini diagnostics use partial-passage mode
 * so these 3 questions are shown alongside the full passage text.
 *
 * Usage:
 *   npx tsx scripts/seed_free_pool.ts
 *   npx tsx scripts/seed_free_pool.ts --dry-run   (preview only)
 *   npx tsx scripts/seed_free_pool.ts --reset      (clear all freePool flags first)
 */

const NON_COMP_SECTIONS: Record<string, number> = {
  "Verbal Reasoning": 8,
  "Non-Verbal Reasoning": 6,
  "Mathematics": 6,
};

const COMP_QUESTIONS_PER_PASSAGE = 3;

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

  // ── Non-comprehension sections ────────────────────────────────────────────
  for (const [section, target] of Object.entries(NON_COMP_SECTIONS)) {
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
      for (const q of selected) {
        await db.update(questions).set({ freePool: true }).where(eq(questions.id, q.id));
      }
    }

    totalMarked += selected.length;
  }

  // ── English Comprehension: first 3 questions from a random passage ────────
  const compPool = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.section, "English Comprehension"),
        eq(questions.qaStatus, "approved"),
        sql`render_config->>'passageId' IS NOT NULL`,
      ),
    );

  if (compPool.length === 0) {
    console.log(`[English Comprehension] No approved questions found — skipping.`);
  } else {
    // Group by passageId
    const passageMap = new Map<string, typeof compPool>();
    for (const q of compPool) {
      const pid = (q.renderConfig as any)?.passageId as string;
      if (!pid) continue;
      if (!passageMap.has(pid)) passageMap.set(pid, []);
      passageMap.get(pid)!.push(q);
    }

    // Sort each passage by questionIndex
    for (const qs of passageMap.values()) {
      qs.sort(
        (a, b) =>
          ((a.renderConfig as any)?.questionIndex ?? 9999) -
          ((b.renderConfig as any)?.questionIndex ?? 9999),
      );
    }

    // Pick a random passage
    const passages = [...passageMap.values()];
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    const selected = randomPassage.slice(0, COMP_QUESTIONS_PER_PASSAGE);

    const pid = (selected[0].renderConfig as any)?.passageId;
    console.log(
      `[English Comprehension] Selecting ${selected.length} questions from passage ${pid} ` +
      `(questions at index ${selected.map((q) => (q.renderConfig as any)?.questionIndex).join(", ")})`,
    );

    if (!isDryRun && selected.length > 0) {
      for (const q of selected) {
        await db.update(questions).set({ freePool: true }).where(eq(questions.id, q.id));
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

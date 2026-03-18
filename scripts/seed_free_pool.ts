import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq, and, isNotNull, ne, asc, inArray, sql } from "drizzle-orm";

/**
 * Marks a representative sample of approved questions as freePool = true.
 *
 * For VR / NVR / Mathematics: selects 6 easy + 13 medium + 6 hard per section,
 * ordered by orderIndex (deterministic, not random).
 *
 * For English Comprehension: marks the 3 smallest passages (fewest questions)
 * as free — all questions in those passages get freePool = true.
 *
 * Always clears all freePool flags first (idempotent full reset on every run).
 *
 * Usage:
 *   npx tsx scripts/seed_free_pool.ts
 *   npx tsx scripts/seed_free_pool.ts --dry-run   (preview only)
 */

const NON_COMP_TARGETS = {
  easy: 6,
  medium: 13,
  hard: 6,
};

const NON_COMP_SECTIONS = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"] as const;
const COMP_PASSAGES = 3;

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(`\n=== Seed Free Pool ===`);
  if (isDryRun) console.log("[DRY RUN] No changes will be written.\n");

  // Always reset first — makes the script fully idempotent
  if (!isDryRun) {
    await db.update(questions).set({ freePool: false });
    console.log("Reset all freePool flags to false.\n");
  } else {
    console.log("[DRY RUN] Would reset all freePool flags.\n");
  }

  const summaryRows: { section: string; easy: number; medium: number; hard: number; total: number }[] = [];
  let grandTotal = 0;

  // ── Non-comprehension sections ────────────────────────────────────────────
  for (const section of NON_COMP_SECTIONS) {
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
      )
      .orderBy(asc(questions.orderIndex));

    if (pool.length === 0) {
      console.log(`[${section}] No approved questions found — skipping.`);
      continue;
    }

    const byDiff: Record<"easy" | "medium" | "hard", typeof pool> = { easy: [], medium: [], hard: [] };
    for (const q of pool) {
      const d = q.difficulty as "easy" | "medium" | "hard";
      if (d in byDiff) byDiff[d].push(q);
    }

    const selected = [
      ...byDiff.easy.slice(0, NON_COMP_TARGETS.easy),
      ...byDiff.medium.slice(0, NON_COMP_TARGETS.medium),
      ...byDiff.hard.slice(0, NON_COMP_TARGETS.hard),
    ];

    const counts = {
      easy: byDiff.easy.slice(0, NON_COMP_TARGETS.easy).length,
      medium: byDiff.medium.slice(0, NON_COMP_TARGETS.medium).length,
      hard: byDiff.hard.slice(0, NON_COMP_TARGETS.hard).length,
    };

    if (!isDryRun && selected.length > 0) {
      const ids = selected.map((q) => q.id);
      await db.update(questions)
        .set({ freePool: true })
        .where(inArray(questions.id, ids));
    }

    summaryRows.push({
      section,
      easy: counts.easy,
      medium: counts.medium,
      hard: counts.hard,
      total: selected.length,
    });
    grandTotal += selected.length;
  }

  // ── English Comprehension: 3 smallest passages ────────────────────────────
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

  const passageMap = new Map<string, typeof compPool>();
  for (const q of compPool) {
    const pid = (q.renderConfig as any)?.passageId as string;
    if (!pid) continue;
    if (!passageMap.has(pid)) passageMap.set(pid, []);
    passageMap.get(pid)!.push(q);
  }

  // Sort passages by ascending question count (smallest first)
  const sortedPassages = [...passageMap.entries()]
    .sort((a, b) => a[1].length - b[1].length)
    .slice(0, COMP_PASSAGES);

  let compTotal = 0;
  for (const [pid, qs] of sortedPassages) {
    if (!isDryRun && qs.length > 0) {
      const ids = qs.map((q) => q.id);
      await db.update(questions)
        .set({ freePool: true })
        .where(inArray(questions.id, ids));
    }
    console.log(
      `[English Comprehension] Passage ${pid}: ${qs.length} questions marked freePool`,
    );
    compTotal += qs.length;
  }
  grandTotal += compTotal;

  // ── Summary table ─────────────────────────────────────────────────────────
  console.log("\n┌─────────────────────────────┬──────┬────────┬──────┬───────┐");
  console.log("│ Section                     │ Easy │ Medium │ Hard │ Total │");
  console.log("├─────────────────────────────┼──────┼────────┼──────┼───────┤");
  for (const row of summaryRows) {
    const s = row.section.padEnd(27);
    const e = String(row.easy).padStart(4);
    const m = String(row.medium).padStart(6);
    const h = String(row.hard).padStart(4);
    const t = String(row.total).padStart(5);
    console.log(`│ ${s} │${e} │${m} │${h} │${t} │`);
  }
  const compLabel = `English Comprehension (×${COMP_PASSAGES} passages)`.padEnd(27);
  const compTotalStr = String(compTotal).padStart(5);
  console.log(`│ ${compLabel} │   — │      — │   — │${compTotalStr} │`);
  console.log("├─────────────────────────────┼──────┼────────┼──────┼───────┤");
  const gLabel = "TOTAL".padEnd(27);
  const gStr = String(grandTotal).padStart(5);
  console.log(`│ ${gLabel} │      │        │      │${gStr} │`);
  console.log("└─────────────────────────────┴──────┴────────┴──────┴───────┘");

  const dbCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.freePool, true));
  console.log(`\n${isDryRun ? "Would mark" : "Marked"} ${grandTotal} questions. DB freePool count: ${dbCount[0]?.count ?? 0}\n`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});

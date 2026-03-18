import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq, and, isNotNull, ne, notInArray, inArray, asc, sql } from "drizzle-orm";

/**
 * Assigns questions to the 'diagnostic' pool — reserved exclusively for
 * full diagnostics (full-a, full-b) and mock tests (mock-1/2/3).
 *
 * Quotas:
 *   - VR / NVR / Mathematics: ~48 questions each (~8 easy + ~22 medium + ~18 hard)
 *   - English Comprehension: 6 non-freePool passages (all questions in each)
 *
 * Selection prefers questions that are NOT in freePool to maximise separation.
 * Falls back to freePool questions if non-freePool supply is insufficient.
 *
 * IDEMPOTENT: Questions already assigned questionPool='diagnostic' are left
 * unchanged; only questions currently at the default ('practice') are promoted.
 *
 * Usage:
 *   npx tsx scripts/seed_diagnostic_pool.ts
 *   npx tsx scripts/seed_diagnostic_pool.ts --dry-run   (preview, no DB writes)
 */

const SECTION_QUOTAS = {
  easy: 8,
  medium: 22,
  hard: 18,
} as const;

const NON_COMP_SECTIONS = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"] as const;
// Target at least 96 comprehension questions (sufficient for 5 full-a/b + 3 mock runs without overlap).
// We accumulate whole passages until we reach or exceed this quota.
const COMP_QUESTION_QUOTA = 96;

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(`\n=== Seed Diagnostic Pool ===`);
  if (isDryRun) console.log("[DRY RUN] No changes will be written.\n");
  else console.log("");

  const summaryRows: { section: string; easy: number; medium: number; hard: number; total: number }[] = [];
  let grandTotal = 0;

  // ── Non-comprehension sections ────────────────────────────────────────────
  for (const section of NON_COMP_SECTIONS) {
    // How many are already 'diagnostic'?
    const alreadyDiag = await db.select().from(questions).where(
      and(
        eq(questions.section, section),
        eq(questions.qaStatus, "approved"),
        eq(questions.questionPool, "diagnostic"),
      ),
    );
    const alreadyDiagIds = alreadyDiag.map(q => q.id);

    const targetEasy = Math.max(0, SECTION_QUOTAS.easy - alreadyDiag.filter(q => q.difficulty === "easy").length);
    const targetMedium = Math.max(0, SECTION_QUOTAS.medium - alreadyDiag.filter(q => q.difficulty === "medium").length);
    const targetHard = Math.max(0, SECTION_QUOTAS.hard - alreadyDiag.filter(q => q.difficulty === "hard").length);

    // Pool: approved, not already diagnostic, ordered by orderIndex
    const baseWhere = and(
      eq(questions.section, section),
      eq(questions.qaStatus, "approved"),
      isNotNull(questions.skillId),
      ne(questions.skillId, ""),
      alreadyDiagIds.length > 0 ? notInArray(questions.id, alreadyDiagIds) : sql`TRUE`,
    );

    const pool = await db.select().from(questions)
      .where(baseWhere)
      .orderBy(asc(questions.freePool), asc(questions.orderIndex));
    // Sorts non-freePool (false=0) before freePool (true=1) — maximises separation

    const byDiff: Record<"easy" | "medium" | "hard", typeof pool> = {
      easy: [],
      medium: [],
      hard: [],
    };
    for (const q of pool) {
      const d = q.difficulty as "easy" | "medium" | "hard";
      if (d in byDiff) byDiff[d].push(q);
    }

    const newlySelected = [
      ...byDiff.easy.slice(0, targetEasy),
      ...byDiff.medium.slice(0, targetMedium),
      ...byDiff.hard.slice(0, Math.max(0, targetHard)),
    ];

    const counts = {
      easy: alreadyDiag.filter(q => q.difficulty === "easy").length + byDiff.easy.slice(0, targetEasy).length,
      medium: alreadyDiag.filter(q => q.difficulty === "medium").length + byDiff.medium.slice(0, targetMedium).length,
      hard: alreadyDiag.filter(q => q.difficulty === "hard").length + byDiff.hard.slice(0, targetHard).length,
    };

    if (!isDryRun && newlySelected.length > 0) {
      const ids = newlySelected.map(q => q.id);
      await db.update(questions)
        .set({ questionPool: "diagnostic" })
        .where(inArray(questions.id, ids));
    }

    const total = alreadyDiag.length + newlySelected.length;
    summaryRows.push({ section, easy: counts.easy, medium: counts.medium, hard: counts.hard, total });
    grandTotal += total;

    if (alreadyDiag.length > 0) {
      console.log(`[${section}] ${alreadyDiag.length} already diagnostic, +${newlySelected.length} newly assigned → ${total} total`);
    }
  }

  // ── English Comprehension: 6 non-freePool passages ────────────────────────
  const compPool = await db.select().from(questions).where(
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

  // Separate already-diagnostic passages from candidates
  const alreadyDiagPassages = new Set<string>();
  const candidatePassages: Array<[string, typeof compPool]> = [];

  for (const [pid, qs] of passageMap.entries()) {
    if (qs.some(q => q.questionPool === "diagnostic")) {
      alreadyDiagPassages.add(pid);
    } else {
      candidatePassages.push([pid, qs]);
    }
  }

  // How many comp questions are already in the diagnostic pool?
  const alreadyDiagCompCount = [...passageMap.values()]
    .flatMap(qs => qs)
    .filter(q => q.questionPool === "diagnostic").length;
  const stillNeededCount = Math.max(0, COMP_QUESTION_QUOTA - alreadyDiagCompCount);

  // Prefer non-freePool passages; sort by freePool status then size (larger passages first to hit quota faster)
  const sortedCandidatesAll = candidatePassages
    .sort((a, b) => {
      const aFree = a[1].some(q => q.freePool) ? 1 : 0;
      const bFree = b[1].some(q => q.freePool) ? 1 : 0;
      return aFree - bFree || b[1].length - a[1].length;
    });

  // Accumulate passages until we reach stillNeededCount questions
  const sortedCandidates: typeof sortedCandidatesAll = [];
  let accumulated = 0;
  for (const entry of sortedCandidatesAll) {
    if (accumulated >= stillNeededCount) break;
    sortedCandidates.push(entry);
    accumulated += entry[1].length;
  }

  let compTotal = 0;
  // Count already-diagnostic comp questions
  for (const [pid] of passageMap.entries()) {
    if (alreadyDiagPassages.has(pid)) {
      const qs = passageMap.get(pid)!;
      console.log(`[English Comprehension] Passage ${pid}: ${qs.length} already diagnostic`);
      compTotal += qs.length;
    }
  }

  for (const [pid, qs] of sortedCandidates) {
    if (!isDryRun && qs.length > 0) {
      const ids = qs.map(q => q.id);
      await db.update(questions)
        .set({ questionPool: "diagnostic" })
        .where(inArray(questions.id, ids));
    }
    const isFreePassage = qs.some(q => q.freePool);
    console.log(
      `[English Comprehension] Passage ${pid}: ${qs.length} questions → diagnostic${isFreePassage ? " (from freePool passage)" : ""}`,
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
  const totalPassages = alreadyDiagPassages.size + sortedCandidates.length;
  const compLabel = `English Comprehension (×${totalPassages} passages)`.padEnd(27);
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
    .where(eq(questions.questionPool, "diagnostic"));
  console.log(`\n${isDryRun ? "Would assign" : "Assigned"} ${grandTotal} questions. DB diagnostic count: ${dbCount[0]?.count ?? 0}\n`);

  process.exit(0);
}

main().catch(err => {
  console.error("Seed script failed:", err);
  process.exit(1);
});

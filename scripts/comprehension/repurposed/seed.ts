import { db } from "../../../server/db";
import { questions } from "../../../shared/schema";
import { eq, sql } from "drizzle-orm";
import { REPURPOSED_QUESTIONS, type AuthoredQuestion } from "./questions";
// Static JSON import keeps this module bundler-safe in both ESM and CJS
// (server/index.ts is bundled to CJS via esbuild, so import.meta.url is empty).
import PASSAGES_JSON from "./passages.json";

interface Passage {
  passage_id: string;
  theme: string;
  title: string;
  text: string;
}

// Deterministic FNV-1a 32-bit hash of the question id — used to pick a
// uniform-looking target position [0..3] for the correct answer so that
// the A/B/C/D distribution across 320 questions is balanced and free of
// per-type or per-index bias, without touching the source authored data.
function hashToPosition(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % 4;
}

// Returns a new options array in which the correct answer sits at targetPos.
// Achieved by swapping the correct answer's current index with targetPos —
// preserves the other distractors' order otherwise.
function placeCorrectAt(options: string[], correct: string, targetPos: number): string[] {
  const result = options.slice();
  const currentPos = result.indexOf(correct);
  if (currentPos === -1 || currentPos === targetPos) return result;
  [result[currentPos], result[targetPos]] = [result[targetPos], result[currentPos]];
  return result;
}

const SKILL_MAP: Record<AuthoredQuestion["type"], string> = {
  fact_retrieval: "comp.fact_retrieval",
  vocabulary_in_context: "comp.vocabulary",
  inference: "comp.inference",
  text_structure: "comp.text_structure",
  authorial_intent: "comp.authorial_intent",
};

const COGNITIVE_MAP: Record<AuthoredQuestion["difficulty"], number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

const TIME_MAP: Record<AuthoredQuestion["difficulty"], number> = {
  easy: 45,
  medium: 75,
  hard: 105,
};

const TYPE_LABEL: Record<AuthoredQuestion["type"], string> = {
  fact_retrieval: "Fact Retrieval",
  vocabulary_in_context: "Vocabulary in Context",
  inference: "Inference",
  text_structure: "Text Structure",
  authorial_intent: "Authorial Intent",
};

// Stable, deterministic question id per passage + index — lets the seeder be idempotent.
function questionIdFor(passageId: string, idx: number): string {
  return `repurposed-${passageId}-${String(idx).padStart(2, "0")}`;
}

export async function seedRepurposedComprehension(opts: { silent?: boolean } = {}) {
  const log = opts.silent ? () => {} : console.log.bind(console);
  const passages: Passage[] = PASSAGES_JSON as Passage[];
  if (!passages || passages.length === 0) {
    log("[Repurposed] No passages bundled, skipping.");
    return { inserted: 0, updated: 0 };
  }
  const passageMap = new Map(passages.map((p) => [p.passage_id, p]));

  // Group authored questions by passage
  const byPassage = new Map<string, AuthoredQuestion[]>();
  for (const q of REPURPOSED_QUESTIONS) {
    if (!byPassage.has(q.passageId)) byPassage.set(q.passageId, []);
    byPassage.get(q.passageId)!.push(q);
  }

  let inserted = 0;
  let skipped = 0;
  const passagesWithContent = Array.from(byPassage.keys()).sort();
  log(`[Repurposed] Authored questions for ${passagesWithContent.length} of ${passages.length} passages.`);

  for (const passageId of passagesWithContent) {
    const passage = passageMap.get(passageId);
    if (!passage) {
      log(`[Repurposed]   ! Passage ${passageId} referenced by questions but missing from passages.json — skipping.`);
      continue;
    }

    const items = byPassage.get(passageId)!;

    for (let i = 0; i < items.length; i++) {
      const q = items[i];
      const id = questionIdFor(passageId, i + 1);

      // Validate
      if (!q.options.includes(q.correct)) {
        throw new Error(`[Repurposed] ${id}: correct answer "${q.correct}" not in options ${JSON.stringify(q.options)}`);
      }
      if (q.options.length !== 4) {
        throw new Error(`[Repurposed] ${id}: expected 4 options, got ${q.options.length}`);
      }
      if (new Set(q.options).size !== 4) {
        throw new Error(`[Repurposed] ${id}: duplicate options`);
      }

      // Deterministically rebalance correct-answer position by hashing the
      // stable id. Without this, authored prompts skewed heavily toward
      // option B; the hash yields ~uniform A/B/C/D across the 320 questions.
      const targetPos = hashToPosition(id);
      const balancedOptions = placeCorrectAt(q.options, q.correct, targetPos);

      const renderConfig = {
        kind: "comprehension.passage" as const,
        passageId: passage.passage_id,
        passageTitle: passage.title,
        passageTheme: passage.theme,
        passageText: passage.text,
        questionType: TYPE_LABEL[q.type],
        questionIndex: i + 1,
        totalQuestionsInPassage: items.length,
      };

      const row = {
        id,
        section: "English Comprehension",
        type: q.type,
        prompt: q.prompt,
        options: balancedOptions,
        correctAnswer: q.correct,
        difficulty: q.difficulty,
        timeExpected: TIME_MAP[q.difficulty],
        orderIndex: i + 1,
        skillId: SKILL_MAP[q.type],
        subRuleId: passage.passage_id,
        renderType: "comprehension",
        renderConfig: renderConfig,
        cognitiveLoad: COGNITIVE_MAP[q.difficulty],
        locale: "en-GB",
        britishSpelling: true,
        version: 1,
        qualityScore: 90,
        qaStatus: "approved",
        estTimeSeconds: TIME_MAP[q.difficulty],
        explanation: q.explanation,
        notes: "Repurposed lowercase comprehension passage. GL-quality authored question pack.",
        freePool: false,
        questionPool: "practice",
      };

      // Upsert: insert if missing, update if present (so re-runs replace prior content)
      const existing = await db.select({ id: questions.id }).from(questions).where(eq(questions.id, id)).limit(1);
      if (existing.length === 0) {
        await db.insert(questions).values(row as any);
        inserted++;
      } else {
        await db.update(questions).set(row as any).where(eq(questions.id, id));
        skipped++;
      }
    }
  }

  log(`[Repurposed] Inserted ${inserted} new, updated ${skipped} existing.`);

  // Sanity-check distribution
  const dist = await db.execute(sql`
    SELECT type, difficulty, COUNT(*)::int AS c
    FROM ${questions}
    WHERE section='English Comprehension' AND id LIKE 'repurposed-%'
    GROUP BY type, difficulty
    ORDER BY type, difficulty;
  `);
  log("[Repurposed] Distribution of repurposed questions:");
  for (const r of dist.rows as any[]) {
    log(`  ${r.type.padEnd(24)} ${r.difficulty.padEnd(8)} ${r.c}`);
  }

  return { inserted, updated: skipped };
}

// CLI entrypoint — only fires when invoked directly via `tsx scripts/.../seed.ts`.
// Uses argv-based detection so the module stays CJS-safe (no import.meta.url).
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seedRepurposedComprehension()
    .then(({ inserted, updated }) => {
      console.log(`\nDone. inserted=${inserted} updated=${updated}`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

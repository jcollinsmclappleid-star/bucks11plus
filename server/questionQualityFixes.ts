/**
 * Question Quality Fixes
 * Applied after seeding to ensure question bank meets quality standards.
 * Safe to run multiple times (idempotent).
 */

import { db } from "./db";
import { questions } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { seedRepurposedComprehension } from "../scripts/comprehension/repurposed/seed";
type AnyElement = Record<string, any>;
type Frame = { elements: AnyElement[] };

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ─── Transform wrong-option helpers ───────────────────────────────────────────
// Rotate all shape/dot positions 90° clockwise around canvas centre (50,50),
// and increment each shape's own rotation by 90°.
function rotateFrame90(frame: Frame): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape" || el.type === "dot") {
      const ox = el.x - 50;
      const oy = el.y - 50;
      el.x = 50 + oy;
      el.y = 50 - ox;
    }
    if (el.type === "shape") {
      el.rotation = ((el.rotation ?? 0) + 90) % 360;
    }
    if (el.type === "line") {
      const ox1 = el.x1 - 50; const oy1 = el.y1 - 50;
      const ox2 = el.x2 - 50; const oy2 = el.y2 - 50;
      el.x1 = 50 + oy1; el.y1 = 50 - ox1;
      el.x2 = 50 + oy2; el.y2 = 50 - ox2;
    }
  }
  return f;
}

// Mirror all positions horizontally (x → 100-x). Also flip shape rotations.
function mirrorFrame(frame: Frame): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape" || el.type === "dot") {
      el.x = 100 - el.x;
    }
    if (el.type === "shape") {
      el.rotation = (360 - (el.rotation ?? 0)) % 360;
    }
    if (el.type === "line") {
      el.x1 = 100 - el.x1;
      el.x2 = 100 - el.x2;
    }
  }
  return f;
}

// Scale all elements away from centre by 0.65×, shrinking sizes proportionally.
function scaleFrame(frame: Frame, factor: number): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape") {
      el.x = 50 + (el.x - 50) * factor;
      el.y = 50 + (el.y - 50) * factor;
      el.size = Math.max(8, Math.round(el.size * factor));
    }
    if (el.type === "dot") {
      el.x = 50 + (el.x - 50) * factor;
      el.y = 50 + (el.y - 50) * factor;
      el.r = Math.max(2, Math.round(el.r * factor));
    }
  }
  return f;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

// ─── Symmetric shape replacement ─────────────────────────────────────────────
// Shapes that look unchanged after 90° or 180° rotation (or horizontal reflection):
//   square (90° sym), hexagon (60° sym), circle (fully sym), diamond (= rotated square),
//   star (72° sym), cross (90° sym).
// These must be replaced with asymmetric shapes in rotation/reflection transform questions
// so the transformation is visually obvious to the student.
const SYMMETRIC_SHAPES: Record<string, string> = {
  square:  "right_triangle",
  hexagon: "arrow",
  circle:  "semicircle",
  diamond: "kite",
  star:    "arrow",
  cross:   "arrow",
};

/**
 * In nvr.transform rotation/reflection questions, replace rotationally-symmetric
 * shapes with clearly asymmetric ones in BOTH the promptFrames AND answerOptions.
 * Positions, rotation values and fills are preserved — only the shape name changes —
 * so all answer logic remains valid; the transformation just becomes visible.
 */
async function fixTransformSymmetricShapes() {
  const rotateSubRules = [
    "nvr.transform.rotate_90",
    "nvr.transform.rotate_180",
    "nvr.transform.rotate_reflect",
    "nvr.transform.reflect_dash",
    "nvr.transform.reflect_fill",
  ];

  const tfQs = await db
    .select()
    .from(questions)
    .where(eq(questions.skillId, "nvr.transform"));

  let fixed = 0;
  for (const q of tfQs) {
    if (!rotateSubRules.includes(q.subRuleId ?? "")) continue;
    const rc = q.renderConfig as any;
    if (!rc?.promptFrames || !rc?.answerOptions) continue;

    let changed = false;

    const replaceInFrame = (frame: Frame) => {
      for (const el of frame.elements) {
        if (el.type === "shape" && SYMMETRIC_SHAPES[el.shape]) {
          el.shape = SYMMETRIC_SHAPES[el.shape];
          changed = true;
        }
      }
    };

    for (const frame of rc.promptFrames) replaceInFrame(frame);
    for (const opt of rc.answerOptions) replaceInFrame(opt);

    if (changed) {
      await db
        .update(questions)
        .set({ renderConfig: rc as any })
        .where(eq(questions.id, q.id));
      fixed++;
    }
  }

  console.log(`  [Quality] Transform symmetric shapes replaced: ${fixed} questions updated`);
}

/**
 * Rebuild transform question answer options so wrong options are visually
 * distinct from the correct answer. Keeps correct option untouched.
 * Generates wrong options by:
 *   W1 – correct frame rotated 90° (clearly different layout)
 *   W2 – correct frame mirrored horizontally (different orientation)
 *   W3 – promptFrame[2] unchanged (no transformation applied — obviously wrong)
 */
async function fixTransformAnswerOptions() {
  // Skip questions with qualityScore >= 1: those have proper diagnostic distractors already
  const tfQuestions = await db
    .select()
    .from(questions)
    .where(and(eq(questions.skillId, "nvr.transform"), sql`COALESCE(quality_score, 0) < 1`));

  let fixed = 0;
  let skipped = 0;

  for (const q of tfQuestions) {
    try {
      const rc = q.renderConfig as any;
      if (
        !rc ||
        rc.kind !== "nvr.transform" ||
        !Array.isArray(rc.answerOptions) ||
        !Array.isArray(rc.promptFrames) ||
        rc.promptFrames.length < 3
      ) {
        skipped++;
        continue;
      }

      const correctIdx = OPTION_LETTERS.indexOf(q.correctAnswer as typeof OPTION_LETTERS[number]);
      if (correctIdx === -1 || !rc.answerOptions[correctIdx]) {
        skipped++;
        continue;
      }

      const correctFrame: Frame = deepClone(rc.answerOptions[correctIdx]);
      const cFrame: Frame = deepClone(rc.promptFrames[2]);  // The untransformed C shape

      const w1 = rotateFrame90(correctFrame);
      const w2 = mirrorFrame(correctFrame);
      const w3 = scaleFrame(cFrame, 0.8);  // C slightly scaled — clearly not transformed

      const wrongs = [w1, w2, w3];
      const newOptions: Frame[] = [];
      let wi = 0;
      for (let i = 0; i < 4; i++) {
        newOptions.push(i === correctIdx ? correctFrame : wrongs[wi++]);
      }

      await db
        .update(questions)
        .set({ renderConfig: { ...rc, answerOptions: newOptions } as any })
        .where(eq(questions.id, q.id));

      fixed++;
    } catch {
      skipped++;
    }
  }

  console.log(`  [Quality] NVR transform wrong options: ${fixed} fixed, ${skipped} skipped`);
}

// ─────────────────────────────────────────────────────────────────────────────

export async function applyQuestionQualityFixes() {

  // ── Fix 1: NVR transform — replace symmetric shapes so rotation is visible ─
  await fixTransformSymmetricShapes();

  // ── Fix 2: NVR transform — distinctly different wrong options ────────────
  await fixTransformAnswerOptions();

  // ── Fix 3: Maths two_rule — prompt had starting value 4 (correct answer 19)
  //           but 19 is not in the options. Fix: starting value → 5 (answer 35).
  //           Verify: t1=5, t2=7, t3=11, t4=19, t5=35 ✓ (35 is in options)
  await db.update(questions)
    .set({
      prompt: "A sequence follows the rule: multiply by 2, then subtract 3. Starting with 5, what is the 5th term?",
      correctAnswer: "35",
    })
    .where(eq(questions.id, "8c9085a8-c6c2-4f6f-9f2c-cf03ce39e037"));

  // ── Fix 4: Maths decimal_conversion float artifacts ───────────────────────
  await db.update(questions)
    .set({ options: ["0.2", "0.15", "2", "0.30"] })
    .where(eq(questions.id, "ea49f5b3-2c66-4e30-9235-cf623b832f05"));

  await db.update(questions)
    .set({ options: ["4", "0.35", "0.4", "0.5"] })
    .where(eq(questions.id, "9f6b2d28-36b2-4fe6-b523-34b4c4a619af"));

  // ── Fix 5: VR anagram ambiguity ───────────────────────────────────────────
  // Prompt: "Rearrange the letters REINS to make a word."
  // Earlier attempt set options to {DOG,FOG,HOG,LOG} which made the question unanswerable
  // (the correct answer SIREN wasn't in the options). Fix: SIREN is the anagram, the
  // distractors share some letters but not all (ROBIN/RIVER/REIGN each use a letter
  // that REINS doesn't have).
  await db.update(questions)
    .set({
      options: ["SIREN", "ROBIN", "RIVER", "REIGN"],
      explanation: "REINS rearranged makes SIREN. ROBIN uses O and B (not in REINS); RIVER uses V (not in REINS); REIGN uses G (not in REINS).",
    })
    .where(eq(questions.id, "d096d6cc-abf7-43ef-8561-975a9b80c19b"));

  await db.update(questions)
    .set({ options: ["LABEL", "FABLE", "CABLE", "TABLE"] })
    .where(eq(questions.id, "0a4f0228-b28d-434e-9f21-2931199581b3"));

  await db.update(questions)
    .set({ options: ["GARDEN", "GRADED", "WANDER", "BANGER"] })
    .where(eq(questions.id, "69d71ebe-99e3-45ec-8e6f-fb887c1fa21d"));

  await db.update(questions)
    .set({ options: ["RATED", "YEARS", "STARE", "STORE"] })
    .where(eq(questions.id, "76493c36-bb86-4f2a-99a4-87e6b451b51e"));

  await db.update(questions)
    .set({ options: ["HOSES", "THOSE", "SHONE", "HORSE"] })
    .where(eq(questions.id, "ae3618d4-3f38-4163-a7e5-a3faddbd97a1"));

  console.log(`  [Quality] Maths + VR anagram fixes applied`);

  // ── Fix 6: Digit puzzle — "3 more than" should be "3 times" ─────────────
  // 963: h=9=3×3=3u ✓, t=6=(9+3)/2 ✓, 9+6+3=18 ✓
  // "3 more than" gives h=u+3 which has NO integer solution (6u+9=36 → u=4.5)
  await db.update(questions)
    .set({
      prompt: "I am a three-digit number. My hundreds digit is 3 times my units digit. My tens digit is the mean of my hundreds and units digits. The sum of my digits is 18. What am I?",
    })
    .where(eq(questions.id, "d574b62f-ea8d-4302-95fa-95f943966848"));

  // ── Fix 7: Number pyramid — unsolvable numbers → solvable ───────────────
  // Old: "3, □, 7, 2 → top=40" has no integer solution (3□ = 14)
  // New: "4, □, 6, 2 → top=42" → □=6 (24+3×6=42 ✓), options {5,6,4,8} still valid
  await db.update(questions)
    .set({
      prompt: "In a number pyramid, each brick is the sum of the two bricks below it. The bottom row is: 4, □, 6, 2. The top brick is 42. What number replaces □?",
      correctAnswer: "6",
    })
    .where(eq(questions.id, "c3eb112d-8dd9-49f6-b3ae-31e6f12f49f0"));

  // ── Fix 8: Seating arrangement — 6-person circle has wrong answer ────────
  // Old: "Six pupils in a circle... who to right of Nina?" → "Oscar" (WRONG)
  // New: 4-person square table gives unambiguous answer = "Pip"
  // Max(1) opposite Nina(3), Oscar(2) to right of Max → to right of Nina = Pip(4)
  await db.update(questions)
    .set({
      prompt: "Four pupils sit around a round table: Max, Nina, Oscar and Pip. Max sits opposite Nina. Oscar sits to the right of Max. Who sits to the right of Nina?",
      correctAnswer: "Pip",
    })
    .where(eq(questions.id, "85189751-7dd8-4670-a8d4-80475b2c6fca"));

  // ── Fix 9: Sentence completion — "alliance/rivalry" ambiguity ────────────
  // Old: "The ____ between the two countries lasted for decades" (both work)
  // New: "The two countries formed a trade ____ that benefited both economies"
  // "Trade alliance that benefited both" = clearly alliance; rivalry doesn't fit
  await db.update(questions)
    .set({
      prompt: "The two countries formed a trade ____ that benefited both economies.",
    })
    .where(eq(questions.id, "619a2b0d-1b1b-452a-94a5-78dfc50c863e"));

  console.log(`  [Quality] Maths + VR misc question fixes applied (digit_puzzle, pyramid, seating, sentence_completion)`);

  // ── Fix 10: Retire the lowercase 'comprehension' bank ─────────────────────
  // The lowercase bank was templated/AI-generated with generic prompts and
  // non-passage-specific options (e.g. "What does the passage imply about X?"
  // with options like "The evidence in the passage supports this conclusion").
  // Children could pattern-match without reading the passage — not GL-realistic.
  // The proper-cased 'English Comprehension' bank (~600 questions) is editorial
  // and remains the only comprehension content served. Idempotent.
  const archivedLowercase = await db.update(questions)
    .set({ qaStatus: "archived" })
    .where(and(eq(questions.section, "comprehension"), eq(questions.qaStatus, "approved")))
    .returning({ id: questions.id });
  if (archivedLowercase.length > 0) {
    console.log(`  [Quality] Archived ${archivedLowercase.length} lowercase 'comprehension' bank questions (templated/non-passage-specific)`);
  }

  // ── Fix 11: Archive true-duplicate extras in Mathematics + Verbal Reasoning
  // Keep one copy of each (lowest id), archive the rest. Idempotent — once the
  // extras are archived they no longer match the qa_status='approved' filter.
  const dupeArchive = await db.execute(sql`
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (
        PARTITION BY section, prompt, options, correct_answer ORDER BY id
      ) AS rn
      FROM questions
      WHERE qa_status='approved' AND section IN ('Mathematics','Verbal Reasoning')
    )
    UPDATE questions
    SET qa_status='archived'
    WHERE id IN (SELECT id FROM ranked WHERE rn > 1)
    RETURNING id
  `);
  const dupeCount = (dupeArchive as any).rowCount ?? (dupeArchive as any).rows?.length ?? 0;
  if (dupeCount > 0) {
    console.log(`  [Quality] Archived ${dupeCount} true-duplicate extras in Maths/VR (kept one copy per group)`);
  }

  // ── Fix 12: Seed/refresh hand-authored repurposed comprehension bank ─────
  // 320 GL-quality, Year 5/6 age-appropriate questions across 40 lowercase
  // passages (8 per passage: 2 easy + 4 medium + 2 hard, balanced across
  // fact_retrieval / vocabulary_in_context / inference / text_structure /
  // authorial_intent). Replaces the templated AI-generated questions that
  // were archived in Fix 10. The seeder is idempotent — it upserts by stable
  // id 'repurposed-{passageId}-{NN}' so repeated runs leave the bank
  // unchanged after the first successful seed.
  try {
    await seedRepurposedComprehension({ silent: true });
    console.log(`  [Quality] Refreshed hand-authored repurposed comprehension bank (320 questions)`);
  } catch (err) {
    console.error(`  [Quality] Failed to seed repurposed comprehension bank:`, err);
  }
}

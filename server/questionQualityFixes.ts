/**
 * Question Quality Fixes
 * Applied after seeding to ensure question bank meets quality standards.
 * Safe to run multiple times (idempotent).
 */

import { db } from "./db";
import { questions } from "@shared/schema";
import { eq } from "drizzle-orm";
import { rebuildNvrSequenceQuestions } from "./nvrSequenceRebuild";

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

/**
 * Rebuild transform question answer options so wrong options are visually
 * distinct from the correct answer. Keeps correct option untouched.
 * Generates wrong options by:
 *   W1 – correct frame rotated 90° (clearly different layout)
 *   W2 – correct frame mirrored horizontally (different orientation)
 *   W3 – promptFrame[2] unchanged (no transformation applied — obviously wrong)
 */
async function fixTransformAnswerOptions() {
  const tfQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.skillId, "nvr.transform"));

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

  // ── Fix 1: NVR sequence — complete rebuild with proper patterns ────────────
  await rebuildNvrSequenceQuestions();

  // ── Fix 2: NVR transform — distinctly different wrong options ─────────────
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
  await db.update(questions)
    .set({ options: ["DOG", "FOG", "HOG", "LOG"] })
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
}

/**
 * Question Quality Fixes
 * Applied after seeding to ensure question bank meets quality standards.
 * Safe to run multiple times (idempotent).
 */

import { db } from "./db";
import { questions } from "@shared/schema";
import { eq } from "drizzle-orm";

type FillType = "none" | "solid" | "hatched" | "dotted";

const FILLS: FillType[] = ["none", "solid", "hatched", "dotted"];

function rotateFill(fill: FillType, steps: number): FillType {
  const idx = FILLS.indexOf(fill);
  if (idx === -1) return fill;
  return FILLS[(idx + steps) % FILLS.length];
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

type AnyElement = Record<string, any>;
type Frame = { elements: AnyElement[] };

function applyFillVariant(frame: Frame, steps: number): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape" && el.style?.fill) {
      el.style.fill = rotateFill(el.style.fill as FillType, steps);
    }
  }
  return f;
}

function applyDashVariant(frame: Frame): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if ((el.type === "line" || el.type === "shape") && el.style) {
      el.style.dashed = !el.style.dashed;
    }
  }
  return f;
}

function applyRotationVariant(frame: Frame, degrees: number): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape") {
      el.rotation = ((el.rotation ?? 0) + degrees) % 360;
    }
  }
  return f;
}

function applyMirrorVariant(frame: Frame): Frame {
  const f = deepClone(frame);
  for (const el of f.elements) {
    if (el.type === "shape" || el.type === "dot") {
      el.x = 100 - el.x;
    }
  }
  return f;
}

function buildWrongOptions(correct: Frame): [Frame, Frame, Frame] {
  const shapeElements = correct.elements.filter((e) => e.type === "shape");

  const allFillsSame =
    shapeElements.length > 0 &&
    shapeElements.every((e) => e.style?.fill === shapeElements[0]?.style?.fill);

  const wrongA = allFillsSame
    ? applyMirrorVariant(correct)
    : applyFillVariant(correct, 2);

  const wrongB = applyDashVariant(correct);
  const wrongC = applyRotationVariant(correct, 90);

  return [wrongA, wrongB, wrongC];
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

function rebuildAnswerOptions(correctAnswer: string, answerOptions: Frame[]): Frame[] | null {
  const correctIdx = OPTION_LETTERS.indexOf(correctAnswer as typeof OPTION_LETTERS[number]);
  if (correctIdx === -1 || !answerOptions[correctIdx]) return null;

  const correctFrame = deepClone(answerOptions[correctIdx]);
  const [wA, wB, wC] = buildWrongOptions(correctFrame);
  const wrongOptions = [wA, wB, wC];

  const newOptions: Frame[] = [];
  let wrongIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIdx) {
      newOptions.push(correctFrame);
    } else {
      newOptions.push(wrongOptions[wrongIdx++]);
    }
  }
  return newOptions;
}

export async function applyQuestionQualityFixes() {
  let fixed = 0;
  let skipped = 0;

  // ── Fix 1: NVR sequence distractors ──────────────────────────────────────
  const seqQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.skillId, "nvr.sequence"));

  for (const q of seqQuestions) {
    try {
      const rc = q.renderConfig as any;
      if (!rc || rc.kind !== "nvr.sequence" || !Array.isArray(rc.answerOptions)) {
        skipped++;
        continue;
      }
      const newAnswerOptions = rebuildAnswerOptions(q.correctAnswer, rc.answerOptions);
      if (!newAnswerOptions) { skipped++; continue; }
      await db
        .update(questions)
        .set({ renderConfig: { ...rc, answerOptions: newAnswerOptions } as any })
        .where(eq(questions.id, q.id));
      fixed++;
    } catch {
      skipped++;
    }
  }

  // ── Fix 2: Maths decimal_conversion float artifacts ───────────────────────
  await db.update(questions)
    .set({ options: ["0.2", "0.15", "2", "0.30"] })
    .where(eq(questions.id, "ea49f5b3-2c66-4e30-9235-cf623b832f05"));

  await db.update(questions)
    .set({ options: ["4", "0.35", "0.4", "0.5"] })
    .where(eq(questions.id, "9f6b2d28-36b2-4fe6-b523-34b4c4a619af"));

  // ── Fix 3: VR anagram ambiguity ───────────────────────────────────────────
  // OGD: DOG+GOD both valid → replace GOD with HOG
  await db.update(questions)
    .set({ options: ["DOG", "FOG", "HOG", "LOG"] })
    .where(eq(questions.id, "d096d6cc-abf7-43ef-8561-975a9b80c19b"));

  // LBETA: TABLE+BLEAT both valid → replace BLEAT with FABLE
  await db.update(questions)
    .set({ options: ["LABEL", "FABLE", "CABLE", "TABLE"] })
    .where(eq(questions.id, "0a4f0228-b28d-434e-9f21-2931199581b3"));

  // DRANEG: GARDEN+DANGER+GANDER all valid → replace DANGER+GANDER
  await db.update(questions)
    .set({ options: ["GARDEN", "GRADED", "WANDER", "BANGER"] })
    .where(eq(questions.id, "69d71ebe-99e3-45ec-8e6f-fb887c1fa21d"));

  // TRSAE: STARE+RATES+TEARS all valid → replace RATES+TEARS
  await db.update(questions)
    .set({ options: ["RATED", "YEARS", "STARE", "STORE"] })
    .where(eq(questions.id, "76493c36-bb86-4f2a-99a4-87e6b451b51e"));

  // RESHO: HORSE+SHORE both valid → replace SHORE with SHONE
  await db.update(questions)
    .set({ options: ["HOSES", "THOSE", "SHONE", "HORSE"] })
    .where(eq(questions.id, "ae3618d4-3f38-4163-a7e5-a3faddbd97a1"));

  console.log(`  [Quality] NVR sequence: ${fixed} fixed, ${skipped} skipped`);
  console.log(`  [Quality] Maths float + VR anagram fixes applied`);
}

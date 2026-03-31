/**
 * NVR Sequence Question Rebuild
 *
 * COGNITIVE DESIGN PRINCIPLES (post-audit):
 *
 * 1. Every question changes at LEAST TWO THINGS per frame step.
 *    Single-rule questions (just size, just count) are trivially solved by eye —
 *    "which is biggest?" or "which has 4?" requires no pattern reasoning.
 *    Dual rules force the student to identify and apply BOTH rules simultaneously.
 *
 * 2. SIZE+ROTATION: shape grows 12 units each step AND rotates 90° CW each step.
 *    Wrong options trap students who only noticed one rule:
 *    - correct size + wrong angle  (tracked size only)
 *    - step-short size + correct angle (tracked rotation only)
 *    - last-frame size + correct angle (last-frame trap)
 *    Size range: 22→34→46→58 (12-unit steps, clearly visible in small frames).
 *
 * 3. COUNT+FILL: count grows 1→2→3→4 AND fill alternates A→B→A→B.
 *    Wrong options:
 *    - cnt(3, correct-fill)   — count trap (last-frame count, fill is right)
 *    - cnt(4, wrong-fill)     — fill trap (count is right, fill is wrong)
 *    - cnt(5, correct-fill)   — overshoot trap (fill right, one too many)
 *
 * 4. ROTATION-only (kept as-is): wrong options use non-sequence angles.
 *    90° seqs → wrong: 225°, 315°, 0°.   45° seqs → wrong: 0°, 180°, 270°.
 *
 * 5. FILL-only (kept as-is): strict 2-fill alternating pattern.
 *    Wrong options: 2 never-shown fills + 1 alternating trap.
 *
 * 6. DUAL-element (hardest): two independent shapes, each following one rule.
 */

import { db } from "./db";
import { questions } from "@shared/schema";
import { eq } from "drizzle-orm";

// ─── Style helpers ─────────────────────────────────────────────────────────
const C = "#1E293B";
const sty = (fill = "none", dashed = false) => ({
  strokeWidth: 2.5, stroke: C, fill, dashed,
});

function sh(shape: string, x: number, y: number, size: number, rot: number, fill = "none", dashed = false) {
  return { type: "shape" as const, shape, x, y, size, rotation: rot, style: sty(fill, dashed) };
}
function fr(...els: any[]) { return { elements: els }; }

// ─── Option placement ──────────────────────────────────────────────────────
// placeOpts(letter, CORRECT, WRONG1, WRONG2, WRONG3)
// CORRECT is always the FIRST argument after the letter.
type Letter = "A" | "B" | "C" | "D";
const LI: Record<Letter, number> = { A: 0, B: 1, C: 2, D: 3 };

function placeOpts(cl: Letter, correct: any, w1: any, w2: any, w3: any): any[] {
  const wrongs = [w1, w2, w3];
  const result: any[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i++) {
    result.push(i === LI[cl] ? correct : wrongs[wi++]);
  }
  return result;
}

// ─── Count shape positions ─────────────────────────────────────────────────
const POS: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 28, y: 50 }, { x: 72, y: 50 }],
  3: [{ x: 18, y: 50 }, { x: 50, y: 50 }, { x: 82, y: 50 }],
  4: [{ x: 12, y: 50 }, { x: 37, y: 50 }, { x: 63, y: 50 }, { x: 88, y: 50 }],
  5: [{ x: 10, y: 50 }, { x: 28, y: 50 }, { x: 50, y: 50 }, { x: 72, y: 50 }, { x: 90, y: 50 }],
  6: [{ x: 8, y: 50 }, { x: 24, y: 50 }, { x: 41, y: 50 }, { x: 59, y: 50 }, { x: 76, y: 50 }, { x: 92, y: 50 }],
};

function cnt(n: number, shape: string, fill = "none") {
  return fr(...POS[n].map(p => sh(shape, p.x, p.y, 16, 0, fill)));
}

// ─── Question definition type ──────────────────────────────────────────────
interface QDef {
  id: string;
  correctAnswer: Letter;
  subRuleId: string;
  prompt: string;
  explanation: string;
  frames: any[];
  answerOptions: any[];
}

const PROMPT_SEQ = "Which shape comes next in the sequence?";

// ─────────────────────────────────────────────────────────────────────────
// FREE POOL — 25 questions
// ─────────────────────────────────────────────────────────────────────────

const FREE_QUESTIONS: QDef[] = [

  // ══ ROTATION 90° (10) ══════════════════════════════════════════════════
  // Frames: 0°→90°→180°; correct=270°.
  // Wrong options use NON-SEQUENCE angles: 225° (between last & correct),
  // 315° (one step past correct), 0° (cyclic reset trap).

  {
    id: "005b9782-028e-4793-8b36-a710ea036a1c",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 38, 0)),
      fr(sh("triangle", 50, 50, 38, 90)),
      fr(sh("triangle", 50, 50, 38, 180)),
      fr(sh("triangle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("triangle", 50, 50, 38, 270)),   // correct
      fr(sh("triangle", 50, 50, 38, 225)),   // wrong: between last & correct
      fr(sh("triangle", 50, 50, 38, 315)),   // wrong: one step past correct
      fr(sh("triangle", 50, 50, 38, 0)),     // wrong: cyclic reset trap
    ),
  },
  {
    id: "027e644f-e49d-4cad-93f3-347b943baba3",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 180)),
      fr(sh("arrow", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 270)),
      fr(sh("arrow", 50, 50, 38, 315)),
      fr(sh("arrow", 50, 50, 38, 225)),
      fr(sh("arrow", 50, 50, 38, 0)),
    ),
  },
  {
    id: "0a1ce787-5127-4b18-8df9-8e88d027e3e5",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 180)),
      fr(sh("right_triangle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 50, 38, 270)),
      fr(sh("right_triangle", 50, 50, 38, 225)),
      fr(sh("right_triangle", 50, 50, 38, 315)),
      fr(sh("right_triangle", 50, 50, 38, 0)),
    ),
  },
  {
    id: "0d1f2556-04d5-4e80-8cf4-82d56bb7834f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0)),
      fr(sh("semicircle", 50, 50, 38, 90)),
      fr(sh("semicircle", 50, 50, 38, 180)),
      fr(sh("semicircle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("semicircle", 50, 50, 38, 270)),
      fr(sh("semicircle", 50, 50, 38, 315)),
      fr(sh("semicircle", 50, 50, 38, 225)),
      fr(sh("semicircle", 50, 50, 38, 0)),
    ),
  },
  {
    id: "117aa933-62d8-4fcc-b25d-d3e1001a2d21",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 180)),
      fr(sh("right_triangle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("right_triangle", 50, 50, 38, 270)),
      fr(sh("right_triangle", 50, 50, 38, 315)),
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 225)),
    ),
  },
  {
    id: "2af5cf0b-9d1d-46cc-835d-6a70a37dadaa",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 180, "solid")),
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
      fr(sh("triangle", 50, 50, 38, 225, "solid")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 315, "solid")),
    ),
  },
  {
    id: "2e212e30-6c4e-4552-8557-83a64e240515",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
      fr(sh("arrow", 50, 50, 38, 180, "solid")),
      fr(sh("arrow", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 270, "solid")),
      fr(sh("arrow", 50, 50, 38, 315, "solid")),
      fr(sh("arrow", 50, 50, 38, 225, "solid")),
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
    ),
  },
  {
    id: "4ed2f818-89a1-4cc4-b1ac-4e2fbf53e78f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 180, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
      fr(sh("semicircle", 50, 50, 38, 315, "solid")),
      fr(sh("semicircle", 50, 50, 38, 225, "solid")),
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
    ),
  },
  {
    id: "50f5f906-467d-418b-94c6-d63fb4390573",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 90° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 180, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 315, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
      fr(sh("semicircle", 50, 50, 38, 225, "solid")),
    ),
  },
  {
    // 45° rotation variant — harder
    id: "5cd76d68-4e77-4784-ba4e-225afc439395",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 45)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 135)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("arrow", 50, 50, 38, 135)),
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 180)),
      fr(sh("arrow", 50, 50, 38, 270)),
    ),
  },

  // ══ SIZE + ROTATION (5) ════════════════════════════════════════════════
  // Frames: size 22→34→46, rotation 0→90→180; correct: size=58, rotation=270°
  // Wrong options designed to trap single-rule trackers:
  //   w1 = correct size (58) + wrong angle (225°)     → tracked size only
  //   w2 = step-short size (52) + correct angle (270°) → tracked rotation only
  //   w3 = last-frame size (46) + correct angle (270°) → last-frame trap

  {
    id: "6255ad3a-c481-46d3-aaf9-11140b4a8bf2",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 22, 0)),
      fr(sh("triangle", 50, 50, 34, 90)),
      fr(sh("triangle", 50, 50, 46, 180)),
      fr(sh("triangle", 50, 50, 58, 270)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("triangle", 50, 50, 58, 270)),   // correct
      fr(sh("triangle", 50, 50, 58, 225)),   // tracked size only
      fr(sh("triangle", 50, 50, 52, 270)),   // tracked rotation only
      fr(sh("triangle", 50, 50, 46, 270)),   // last-frame size trap
    ),
  },
  {
    id: "6ac03ba2-a903-4685-b3c0-d52b7d68ea56",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 22, 0)),
      fr(sh("arrow", 50, 50, 34, 90)),
      fr(sh("arrow", 50, 50, 46, 180)),
      fr(sh("arrow", 50, 50, 58, 270)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("arrow", 50, 50, 58, 270)),   // correct
      fr(sh("arrow", 50, 50, 58, 225)),   // tracked size only
      fr(sh("arrow", 50, 50, 52, 270)),   // tracked rotation only
      fr(sh("arrow", 50, 50, 46, 270)),   // last-frame trap
    ),
  },
  {
    id: "75595e9c-1d28-40e2-bd5e-b6a49f1c8fe9",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 22, 0)),
      fr(sh("semicircle", 50, 50, 34, 90)),
      fr(sh("semicircle", 50, 50, 46, 180)),
      fr(sh("semicircle", 50, 50, 58, 270)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("semicircle", 50, 50, 58, 270)),   // correct
      fr(sh("semicircle", 50, 50, 58, 225)),   // tracked size only
      fr(sh("semicircle", 50, 50, 52, 270)),   // tracked rotation only
      fr(sh("semicircle", 50, 50, 46, 270)),   // last-frame trap
    ),
  },
  {
    id: "764e418b-0561-4849-9adc-d22d8beb25ae",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("right_triangle", 50, 50, 22, 0)),
      fr(sh("right_triangle", 50, 50, 34, 90)),
      fr(sh("right_triangle", 50, 50, 46, 180)),
      fr(sh("right_triangle", 50, 50, 58, 270)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 50, 58, 270)),   // correct
      fr(sh("right_triangle", 50, 50, 58, 225)),   // tracked size only
      fr(sh("right_triangle", 50, 50, 52, 270)),   // tracked rotation only
      fr(sh("right_triangle", 50, 50, 46, 270)),   // last-frame trap
    ),
  },
  {
    id: "7a18242b-192a-4051-bdc3-07ec88e1e144",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 22, 0, "solid")),
      fr(sh("triangle", 50, 50, 34, 90, "solid")),
      fr(sh("triangle", 50, 50, 46, 180, "solid")),
      fr(sh("triangle", 50, 50, 58, 270, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("triangle", 50, 50, 58, 270, "solid")),   // correct
      fr(sh("triangle", 50, 50, 58, 225, "solid")),   // tracked size only
      fr(sh("triangle", 50, 50, 52, 270, "solid")),   // tracked rotation only
      fr(sh("triangle", 50, 50, 46, 270, "solid")),   // last-frame trap
    ),
  },

  // ══ COUNT + FILL (5) ═══════════════════════════════════════════════════
  // Frames: count 1→2→3, fill alternates A→B→A; correct: count=4, fill=B
  // Wrong options:
  //   w1 = cnt(3, correct-fill)  → count trap (last-shown count, fill correct)
  //   w2 = cnt(4, wrong-fill)    → fill trap (count correct, fill wrong)
  //   w3 = cnt(5, correct-fill)  → overshoot trap (fill correct, one too many)

  {
    // circle: none→hatched→none→?hatched
    id: "949f1ed6-630c-4f2a-908d-857b85ff4d36",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between empty and hatched.",
    frames: [
      cnt(1, "circle", "none"),
      cnt(2, "circle", "hatched"),
      cnt(3, "circle", "none"),
      cnt(4, "circle", "hatched"),
    ],
    answerOptions: placeOpts("B",
      cnt(4, "circle", "hatched"),   // correct
      cnt(3, "circle", "hatched"),   // count trap (3 shapes, fill right)
      cnt(4, "circle", "none"),      // fill trap (4 shapes, fill wrong)
      cnt(5, "circle", "hatched"),   // overshoot trap (5 shapes, fill right)
    ),
  },
  {
    // triangle: none→dotted→none→?dotted
    id: "adc2e78b-126d-4c72-a15c-bc008d90ab05",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between empty and dotted.",
    frames: [
      cnt(1, "triangle", "none"),
      cnt(2, "triangle", "dotted"),
      cnt(3, "triangle", "none"),
      cnt(4, "triangle", "dotted"),
    ],
    answerOptions: placeOpts("C",
      cnt(4, "triangle", "dotted"),   // correct
      cnt(3, "triangle", "dotted"),   // count trap
      cnt(4, "triangle", "none"),     // fill trap
      cnt(5, "triangle", "dotted"),   // overshoot trap
    ),
  },
  {
    // pentagon: hatched→none→hatched→?none
    id: "b01dcb3b-36da-4dae-aa20-7612657e4804",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between hatched and empty.",
    frames: [
      cnt(1, "pentagon", "hatched"),
      cnt(2, "pentagon", "none"),
      cnt(3, "pentagon", "hatched"),
      cnt(4, "pentagon", "none"),
    ],
    answerOptions: placeOpts("D",
      cnt(4, "pentagon", "none"),      // correct
      cnt(3, "pentagon", "none"),      // count trap
      cnt(4, "pentagon", "hatched"),   // fill trap
      cnt(5, "pentagon", "none"),      // overshoot trap
    ),
  },
  {
    // star: dotted→none→dotted→?none
    id: "b85d1dc4-a146-4bbf-bf30-8b36fb4ab1d5",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between dotted and empty.",
    frames: [
      cnt(1, "star", "dotted"),
      cnt(2, "star", "none"),
      cnt(3, "star", "dotted"),
      cnt(4, "star", "none"),
    ],
    answerOptions: placeOpts("A",
      cnt(4, "star", "none"),      // correct
      cnt(3, "star", "none"),      // count trap
      cnt(4, "star", "dotted"),    // fill trap
      cnt(5, "star", "none"),      // overshoot trap
    ),
  },
  {
    // diamond: none→hatched→none→?hatched
    id: "bebc637a-5847-4b48-9220-25499e72b421",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between empty and hatched.",
    frames: [
      cnt(1, "diamond", "none"),
      cnt(2, "diamond", "hatched"),
      cnt(3, "diamond", "none"),
      cnt(4, "diamond", "hatched"),
    ],
    answerOptions: placeOpts("B",
      cnt(4, "diamond", "hatched"),   // correct
      cnt(3, "diamond", "hatched"),   // count trap
      cnt(4, "diamond", "none"),      // fill trap
      cnt(5, "diamond", "hatched"),   // overshoot trap
    ),
  },

  // ══ FILL ALTERNATING (5) ═══════════════════════════════════════════════
  // Pattern: fill alternates between 2 values over 4 frames (F0=F2, F1=F3).
  // Correct = fill from frames 1 & 3.
  // Wrong: 2 fills never shown + alternating trap (fill from frames 0 & 2).

  {
    // pentagon: none→solid→none→?solid
    id: "c1aae4a5-c041-4a8d-a4b9-dd20a08fb238",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between empty and solid each step.",
    frames: [
      fr(sh("pentagon", 50, 50, 38, 0, "none")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 0, "none")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),    // correct
      fr(sh("pentagon", 50, 50, 38, 0, "hatched")),  // never shown
      fr(sh("pentagon", 50, 50, 38, 0, "dotted")),   // never shown
      fr(sh("pentagon", 50, 50, 38, 0, "none")),     // alternating trap
    ),
  },
  {
    // triangle: dotted→none→dotted→?none
    id: "cc76f0e5-dd48-4430-a16d-64679bc1691f",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between dotted and empty each step.",
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "dotted")),
      fr(sh("triangle", 50, 50, 38, 0, "none")),
      fr(sh("triangle", 50, 50, 38, 0, "dotted")),
      fr(sh("triangle", 50, 50, 38, 0, "none")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 50, 38, 0, "none")),     // correct
      fr(sh("triangle", 50, 50, 38, 0, "solid")),    // never shown
      fr(sh("triangle", 50, 50, 38, 0, "hatched")),  // never shown
      fr(sh("triangle", 50, 50, 38, 0, "dotted")),   // alternating trap
    ),
  },
  {
    // hexagon: hatched→dotted→hatched→?dotted
    id: "d70b9b47-4ff6-4287-8f5f-be6d4600ae09",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between hatched and dotted each step.",
    frames: [
      fr(sh("hexagon", 50, 50, 38, 0, "hatched")),
      fr(sh("hexagon", 50, 50, 38, 0, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 0, "hatched")),
      fr(sh("hexagon", 50, 50, 38, 0, "dotted")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("hexagon", 50, 50, 38, 0, "dotted")),    // correct
      fr(sh("hexagon", 50, 50, 38, 0, "none")),      // never shown
      fr(sh("hexagon", 50, 50, 38, 0, "solid")),     // never shown
      fr(sh("hexagon", 50, 50, 38, 0, "hatched")),   // alternating trap
    ),
  },
  {
    // star: solid→none→solid→?none
    id: "e8b2fd50-97d2-4d47-9767-11b253cc9079",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between solid and empty each step.",
    frames: [
      fr(sh("star", 50, 50, 38, 0, "solid")),
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "solid")),
      fr(sh("star", 50, 50, 38, 0, "none")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("star", 50, 50, 38, 0, "none")),     // correct
      fr(sh("star", 50, 50, 38, 0, "hatched")),  // never shown
      fr(sh("star", 50, 50, 38, 0, "dotted")),   // never shown
      fr(sh("star", 50, 50, 38, 0, "solid")),    // alternating trap
    ),
  },
  {
    // diamond: none→hatched→none→?hatched
    id: "e8bca49d-3693-4156-b805-72e837c709a9",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between empty and hatched each step.",
    frames: [
      fr(sh("diamond", 50, 50, 38, 0, "none")),
      fr(sh("diamond", 50, 50, 38, 0, "hatched")),
      fr(sh("diamond", 50, 50, 38, 0, "none")),
      fr(sh("diamond", 50, 50, 38, 0, "hatched")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("diamond", 50, 50, 38, 0, "hatched")),  // correct
      fr(sh("diamond", 50, 50, 38, 0, "solid")),    // never shown
      fr(sh("diamond", 50, 50, 38, 0, "dotted")),   // never shown
      fr(sh("diamond", 50, 50, 38, 0, "none")),     // alternating trap
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// NON-FREE POOL — 25 questions (harder)
// ─────────────────────────────────────────────────────────────────────────

const NONFREE_QUESTIONS: QDef[] = [

  // ══ ROTATION 45° (5) ══════════════════════════════════════════════════
  // Frames: 0°→45°→90°; correct=135°.
  // Wrong options for 45° seqs: 0° (cyclic), 180° (double-step), 270° (overshoot).

  {
    id: "1b206e87-ab88-4463-bfc0-0bdbe2e16d82",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 45)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 135)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 50, 38, 135)),
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 180)),
      fr(sh("right_triangle", 50, 50, 38, 270)),
    ),
  },
  {
    id: "1de2fee2-b729-4e42-98c5-9ba2823cc73b",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 45, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
      fr(sh("arrow", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 135, "solid")),
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 180, "solid")),
      fr(sh("arrow", 50, 50, 38, 270, "solid")),
    ),
  },
  {
    id: "262558e8-9434-4fa8-94d4-d4f2313fa1f1",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 45, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 180, "solid")),
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
    ),
  },
  {
    id: "2d5b2e12-9e52-448b-8973-e6d3fb6e5f7f",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 45, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 180, "solid")),
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
    ),
  },
  {
    id: "4b95089e-3c47-474c-8806-ed62a3d30177",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape rotates 45° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 45, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("semicircle", 50, 50, 38, 135, "solid")),
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 180, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
    ),
  },

  // ══ SIZE + ROTATION (5) ════════════════════════════════════════════════
  // Harder variants: different shapes/fills, same dual-rule structure.
  // Frames: size 22→34→46, rot 0→90→180; correct: size=58, rot=270°.

  {
    id: "60cc1411-fa0b-4b50-b9e4-cdaa22b67b18",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 22, 0, "solid")),
      fr(sh("arrow", 50, 50, 34, 90, "solid")),
      fr(sh("arrow", 50, 50, 46, 180, "solid")),
      fr(sh("arrow", 50, 50, 58, 270, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 58, 270, "solid")),   // correct
      fr(sh("arrow", 50, 50, 58, 225, "solid")),   // tracked size only
      fr(sh("arrow", 50, 50, 52, 270, "solid")),   // tracked rotation only
      fr(sh("arrow", 50, 50, 46, 270, "solid")),   // last-frame trap
    ),
  },
  {
    id: "6f9dc95f-ab28-459d-940f-b208cf02b43d",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("right_triangle", 50, 50, 22, 0, "solid")),
      fr(sh("right_triangle", 50, 50, 34, 90, "solid")),
      fr(sh("right_triangle", 50, 50, 46, 180, "solid")),
      fr(sh("right_triangle", 50, 50, 58, 270, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("right_triangle", 50, 50, 58, 270, "solid")),   // correct
      fr(sh("right_triangle", 50, 50, 58, 225, "solid")),   // tracked size only
      fr(sh("right_triangle", 50, 50, 52, 270, "solid")),   // tracked rotation only
      fr(sh("right_triangle", 50, 50, 46, 270, "solid")),   // last-frame trap
    ),
  },
  {
    id: "72892459-14c2-4291-b19d-a1dbee526f25",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("semicircle", 50, 50, 22, 0, "solid")),
      fr(sh("semicircle", 50, 50, 34, 90, "solid")),
      fr(sh("semicircle", 50, 50, 46, 180, "solid")),
      fr(sh("semicircle", 50, 50, 58, 270, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("semicircle", 50, 50, 58, 270, "solid")),   // correct
      fr(sh("semicircle", 50, 50, 58, 225, "solid")),   // tracked size only
      fr(sh("semicircle", 50, 50, 52, 270, "solid")),   // tracked rotation only
      fr(sh("semicircle", 50, 50, 46, 270, "solid")),   // last-frame trap
    ),
  },
  {
    // Different size range: 15→27→39→?51 (step=12). Uses hatched fill.
    id: "74803f6e-5e40-4f69-9bf8-eb26b1989294",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("triangle", 50, 50, 15, 0, "hatched")),
      fr(sh("triangle", 50, 50, 27, 90, "hatched")),
      fr(sh("triangle", 50, 50, 39, 180, "hatched")),
      fr(sh("triangle", 50, 50, 51, 270, "hatched")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 50, 51, 270, "hatched")),   // correct
      fr(sh("triangle", 50, 50, 51, 225, "hatched")),   // tracked size only
      fr(sh("triangle", 50, 50, 45, 270, "hatched")),   // tracked rotation only
      fr(sh("triangle", 50, 50, 39, 270, "hatched")),   // last-frame trap
    ),
  },
  {
    id: "92424e8c-ab16-453a-b85f-eec9570ca682",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    explanation: "Shape grows by 12 units each step and rotates 90° clockwise each step.",
    frames: [
      fr(sh("arrow", 50, 50, 15, 0, "hatched")),
      fr(sh("arrow", 50, 50, 27, 90, "hatched")),
      fr(sh("arrow", 50, 50, 39, 180, "hatched")),
      fr(sh("arrow", 50, 50, 51, 270, "hatched")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 51, 270, "hatched")),   // correct
      fr(sh("arrow", 50, 50, 51, 225, "hatched")),   // tracked size only
      fr(sh("arrow", 50, 50, 45, 270, "hatched")),   // tracked rotation only
      fr(sh("arrow", 50, 50, 39, 270, "hatched")),   // last-frame trap
    ),
  },

  // ══ COUNT + FILL (5) ═══════════════════════════════════════════════════
  // Harder variants with less common fill pairings.

  {
    // hexagon: solid→none→solid→?none
    id: "92674afa-cd88-42e1-859b-dc2d61688f9c",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between solid and empty.",
    frames: [
      cnt(1, "hexagon", "solid"),
      cnt(2, "hexagon", "none"),
      cnt(3, "hexagon", "solid"),
      cnt(4, "hexagon", "none"),
    ],
    answerOptions: placeOpts("B",
      cnt(4, "hexagon", "none"),      // correct
      cnt(3, "hexagon", "none"),      // count trap
      cnt(4, "hexagon", "solid"),     // fill trap
      cnt(5, "hexagon", "none"),      // overshoot trap
    ),
  },
  {
    // arrow: none→hatched→none→?hatched
    id: "96cf2338-be1c-45b0-9b4b-be4287c8bdfd",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between empty and hatched.",
    frames: [
      cnt(1, "arrow", "none"),
      cnt(2, "arrow", "hatched"),
      cnt(3, "arrow", "none"),
      cnt(4, "arrow", "hatched"),
    ],
    answerOptions: placeOpts("C",
      cnt(4, "arrow", "hatched"),   // correct
      cnt(3, "arrow", "hatched"),   // count trap
      cnt(4, "arrow", "none"),      // fill trap
      cnt(5, "arrow", "hatched"),   // overshoot trap
    ),
  },
  {
    // square: dotted→none→dotted→?none
    id: "9ae674fb-7730-4c37-b9c0-2571b1d6c89e",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between dotted and empty.",
    frames: [
      cnt(1, "square", "dotted"),
      cnt(2, "square", "none"),
      cnt(3, "square", "dotted"),
      cnt(4, "square", "none"),
    ],
    answerOptions: placeOpts("D",
      cnt(4, "square", "none"),      // correct
      cnt(3, "square", "none"),      // count trap
      cnt(4, "square", "dotted"),    // fill trap
      cnt(5, "square", "none"),      // overshoot trap
    ),
  },
  {
    // circle: hatched→dotted→hatched→?dotted
    id: "a0fabe7f-6c5d-41c5-979f-182b088e4bb0",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between hatched and dotted.",
    frames: [
      cnt(1, "circle", "hatched"),
      cnt(2, "circle", "dotted"),
      cnt(3, "circle", "hatched"),
      cnt(4, "circle", "dotted"),
    ],
    answerOptions: placeOpts("A",
      cnt(4, "circle", "dotted"),     // correct
      cnt(3, "circle", "dotted"),     // count trap
      cnt(4, "circle", "hatched"),    // fill trap
      cnt(5, "circle", "dotted"),     // overshoot trap
    ),
  },
  {
    // triangle: solid→dotted→solid→?dotted
    id: "af3c18c2-1dc5-49ed-aa9c-df4938d66f3f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Count increases by 1 each step; fill alternates between solid and dotted.",
    frames: [
      cnt(1, "triangle", "solid"),
      cnt(2, "triangle", "dotted"),
      cnt(3, "triangle", "solid"),
      cnt(4, "triangle", "dotted"),
    ],
    answerOptions: placeOpts("B",
      cnt(4, "triangle", "dotted"),   // correct
      cnt(3, "triangle", "dotted"),   // count trap
      cnt(4, "triangle", "solid"),    // fill trap
      cnt(5, "triangle", "dotted"),   // overshoot trap
    ),
  },

  // ══ FILL ALTERNATING (5) ═══════════════════════════════════════════════

  {
    // pentagon at 45°: solid→dotted→solid→?dotted
    id: "b16d83df-3bd0-47a6-a40e-126132f3f5fb",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between solid and dotted each step.",
    frames: [
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
      fr(sh("pentagon", 50, 50, 38, 45, "dotted")),
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
      fr(sh("pentagon", 50, 50, 38, 45, "dotted")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 50, 38, 45, "dotted")),   // correct
      fr(sh("pentagon", 50, 50, 38, 45, "hatched")),  // never shown
      fr(sh("pentagon", 50, 50, 38, 45, "none")),     // never shown
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),    // alternating trap
    ),
  },
  {
    // square: hatched→none→hatched→?none
    id: "b282b9ab-d1b5-409e-be61-0735496b61b6",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between hatched and empty each step.",
    frames: [
      fr(sh("square", 50, 50, 38, 0, "hatched")),
      fr(sh("square", 50, 50, 38, 0, "none")),
      fr(sh("square", 50, 50, 38, 0, "hatched")),
      fr(sh("square", 50, 50, 38, 0, "none")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("square", 50, 50, 38, 0, "none")),     // correct
      fr(sh("square", 50, 50, 38, 0, "solid")),    // never shown
      fr(sh("square", 50, 50, 38, 0, "dotted")),   // never shown
      fr(sh("square", 50, 50, 38, 0, "hatched")),  // alternating trap
    ),
  },
  {
    // hexagon at 30°: dotted→solid→dotted→?solid
    id: "c7b8b236-39d6-455d-bc18-eb7226c84584",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between dotted and solid each step.",
    frames: [
      fr(sh("hexagon", 50, 50, 38, 30, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 30, "solid")),
      fr(sh("hexagon", 50, 50, 38, 30, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 30, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("hexagon", 50, 50, 38, 30, "solid")),    // correct
      fr(sh("hexagon", 50, 50, 38, 30, "none")),     // never shown
      fr(sh("hexagon", 50, 50, 38, 30, "hatched")),  // never shown
      fr(sh("hexagon", 50, 50, 38, 30, "dotted")),   // alternating trap
    ),
  },
  {
    // star: none→dotted→none→?dotted
    id: "c871a244-6e46-40e8-9b64-0979dc164630",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between empty and dotted each step.",
    frames: [
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("star", 50, 50, 38, 0, "dotted")),   // correct
      fr(sh("star", 50, 50, 38, 0, "hatched")),  // never shown
      fr(sh("star", 50, 50, 38, 0, "solid")),    // never shown
      fr(sh("star", 50, 50, 38, 0, "none")),     // alternating trap
    ),
  },
  {
    // circle: solid→hatched→solid→?hatched
    id: "c8fc40dd-8db1-43bd-9921-e769c5dedcb4",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Fill alternates between solid and hatched each step.",
    frames: [
      fr(sh("circle", 50, 50, 38, 0, "solid")),
      fr(sh("circle", 50, 50, 38, 0, "hatched")),
      fr(sh("circle", 50, 50, 38, 0, "solid")),
      fr(sh("circle", 50, 50, 38, 0, "hatched")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("circle", 50, 50, 38, 0, "hatched")),  // correct
      fr(sh("circle", 50, 50, 38, 0, "none")),     // never shown
      fr(sh("circle", 50, 50, 38, 0, "dotted")),   // never shown
      fr(sh("circle", 50, 50, 38, 0, "solid")),    // alternating trap
    ),
  },

  // ══ DUAL-ELEMENT (5) ═══════════════════════════════════════════════════
  // Two shapes, each following an independent rule.

  {
    // Top triangle: rotates 0→90→180→?270 | Bottom circle: grows 10→20→30→?40
    id: "cbf76491-6b08-44e1-97cf-ee77c87cb3b3",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    explanation: "Top shape rotates 90° clockwise each step; bottom shape grows by 10 units each step.",
    frames: [
      fr(sh("triangle", 50, 30, 35, 0),   sh("circle", 50, 70, 10, 0)),
      fr(sh("triangle", 50, 30, 35, 90),  sh("circle", 50, 70, 20, 0)),
      fr(sh("triangle", 50, 30, 35, 180), sh("circle", 50, 70, 30, 0)),
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 40, 0)),  // correct
      fr(sh("triangle", 50, 30, 35, 0),   sh("circle", 50, 70, 40, 0)),  // rotation wrong
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 30, 0)),  // size wrong
      fr(sh("triangle", 50, 30, 35, 90),  sh("circle", 50, 70, 20, 0)),  // both wrong
    ),
  },
  {
    // Top arrow: rotates 0→90→180→?270 | Bottom pentagon: fill none→dotted→hatched→?solid
    id: "d12d9050-75d6-444c-bc51-a894d7bcd7c6",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate+fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Top shape rotates 90° clockwise each step; bottom shape cycles through empty → dotted → hatched → solid.",
    frames: [
      fr(sh("arrow",   50, 30, 35, 0,   "solid"), sh("pentagon", 50, 70, 30, 0, "none")),
      fr(sh("arrow",   50, 30, 35, 90,  "solid"), sh("pentagon", 50, 70, 30, 0, "dotted")),
      fr(sh("arrow",   50, 30, 35, 180, "solid"), sh("pentagon", 50, 70, 30, 0, "hatched")),
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),   // correct
      fr(sh("arrow",   50, 30, 35, 0,   "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),   // rotation wrong
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "none")),    // fill wrong
      fr(sh("arrow",   50, 30, 35, 180, "solid"), sh("pentagon", 50, 70, 30, 0, "hatched")), // both wrong
    ),
  },
  {
    // Top semicircle: rotates 0→90→180→?270 | Bottom star: grows 10→20→30→?40
    id: "d769454f-0f7d-42ef-98b6-bc5a9f793da6",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    explanation: "Top shape rotates 90° clockwise each step; bottom shape grows by 10 units each step.",
    frames: [
      fr(sh("semicircle", 50, 30, 35, 0),   sh("star", 50, 70, 10, 0)),
      fr(sh("semicircle", 50, 30, 35, 90),  sh("star", 50, 70, 20, 0)),
      fr(sh("semicircle", 50, 30, 35, 180), sh("star", 50, 70, 30, 0)),
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 40, 0)),  // correct
      fr(sh("semicircle", 50, 30, 35, 0),   sh("star", 50, 70, 30, 0)),  // both wrong
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 30, 0)),  // size wrong
      fr(sh("semicircle", 50, 30, 35, 90),  sh("star", 50, 70, 40, 0)),  // rotation wrong
    ),
  },
  {
    // Top pentagon: rotates 0→90→180→?270 | Bottom diamond: fill none→dotted→hatched→?solid
    id: "d78f336d-7916-46b3-9c47-e16d4e9b71ce",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate+fill_cycle",
    prompt: PROMPT_SEQ,
    explanation: "Top shape rotates 90° clockwise each step; bottom shape cycles through empty → dotted → hatched → solid.",
    frames: [
      fr(sh("pentagon", 50, 30, 35, 0),   sh("diamond", 50, 70, 28, 0, "none")),
      fr(sh("pentagon", 50, 30, 35, 90),  sh("diamond", 50, 70, 28, 0, "dotted")),
      fr(sh("pentagon", 50, 30, 35, 180), sh("diamond", 50, 70, 28, 0, "hatched")),
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "solid")),   // correct
      fr(sh("pentagon", 50, 30, 35, 90),  sh("diamond", 50, 70, 28, 0, "solid")),   // rotation wrong
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "dotted")),  // fill wrong
      fr(sh("pentagon", 50, 30, 35, 0),   sh("diamond", 50, 70, 28, 0, "hatched")), // both wrong
    ),
  },
  {
    // Top right_triangle: rotates 0→90→180→?270 | Bottom hexagon: grows 10→20→30→?40
    id: "ef0ba72e-579b-4f84-acc9-7ae1d91259bf",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    explanation: "Top shape rotates 90° clockwise each step; bottom shape grows by 10 units each step.",
    frames: [
      fr(sh("right_triangle", 50, 30, 35, 0),   sh("hexagon", 50, 70, 10, 0)),
      fr(sh("right_triangle", 50, 30, 35, 90),  sh("hexagon", 50, 70, 20, 0)),
      fr(sh("right_triangle", 50, 30, 35, 180), sh("hexagon", 50, 70, 30, 0)),
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 40, 0)),  // correct
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 30, 0)),  // size wrong
      fr(sh("right_triangle", 50, 30, 35, 0),   sh("hexagon", 50, 70, 40, 0)),  // rotation wrong
      fr(sh("right_triangle", 50, 30, 35, 180), sh("hexagon", 50, 70, 20, 0)),  // both wrong
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Main rebuild function
// ─────────────────────────────────────────────────────────────────────────

export async function rebuildNvrSequenceQuestions() {
  const allDefs = [...FREE_QUESTIONS, ...NONFREE_QUESTIONS];
  let rebuilt = 0;
  let failed = 0;

  for (const def of allDefs) {
    try {
      const renderConfig = {
        kind: "nvr.sequence",
        frames: def.frames,
        questionIndex: 3,
        answerOptions: def.answerOptions,
      };

      await db
        .update(questions)
        .set({
          prompt: def.prompt,
          options: ["A", "B", "C", "D"],
          correctAnswer: def.correctAnswer,
          subRuleId: def.subRuleId,
          explanation: def.explanation,
          renderConfig: renderConfig as any,
        })
        .where(eq(questions.id, def.id));

      rebuilt++;
    } catch (e) {
      console.error(`  [SeqRebuild] Failed for ${def.id}:`, e);
      failed++;
    }
  }

  console.log(`  [Quality] NVR sequence rebuild: ${rebuilt} rebuilt, ${failed} failed`);
}

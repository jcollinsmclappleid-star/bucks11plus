/**
 * NVR Sequence Question Rebuild
 * Replaces all 50 nvr.sequence questions with properly designed sequences
 * where each frame shows a CLEAR, VISIBLE change in one rule.
 *
 * Pattern types:
 *   - ROTATION: shape rotates in 90° or 45° steps (asymmetric shapes only)
 *   - SIZE: shape grows in 10-12 unit steps (large enough to see clearly)
 *   - COUNT: number of shapes increases 1→2→3→4
 *   - FILL: fill property progresses none→dotted→hatched→solid
 *   - DUAL: two shapes, each following an independent rule
 */

import { db } from "./db";
import { questions } from "@shared/schema";
import { eq } from "drizzle-orm";

// ─── Style helpers ─────────────────────────────────────────────────────────────
const C = "#1E293B";
const sty = (fill = "none", dashed = false) => ({
  strokeWidth: 2.5, stroke: C, fill, dashed,
});

function sh(shape: string, x: number, y: number, size: number, rot: number, fill = "none", dashed = false) {
  return { type: "shape" as const, shape, x, y, size, rotation: rot, style: sty(fill, dashed) };
}
function fr(...els: any[]) { return { elements: els }; }

// ─── Answer option layout ──────────────────────────────────────────────────────
// Given 1 correct frame and 3 wrong frames, place correct at the given letter index.
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

// ─── Count positions (size-16 shapes spread horizontally) ─────────────────────
const POS: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 28, y: 50 }, { x: 72, y: 50 }],
  3: [{ x: 18, y: 50 }, { x: 50, y: 50 }, { x: 82, y: 50 }],
  4: [{ x: 12, y: 50 }, { x: 37, y: 50 }, { x: 63, y: 50 }, { x: 88, y: 50 }],
  5: [{ x: 10, y: 50 }, { x: 28, y: 50 }, { x: 50, y: 50 }, { x: 72, y: 50 }, { x: 90, y: 50 }],
};

function cnt(n: number, shape: string, fill = "none") {
  return fr(...POS[n].map(p => sh(shape, p.x, p.y, 16, 0, fill)));
}

// ─── Question definitions ──────────────────────────────────────────────────────
interface QDef {
  id: string;
  correctAnswer: Letter;
  subRuleId: string;
  prompt: string;
  frames: any[];        // 4 frames: [shown0, shown1, shown2, correct_4th]
  answerOptions: any[]; // 4 frames A/B/C/D
}

const PROMPT_SEQ = "Which shape comes next in the sequence?";

// ─────────────────────────────────────────────────────────────────────────────
// FREE POOL: 25 questions (IDs with free_pool = true)
// Rotation 90° (10), Size (5), Count (5), Fill (5)
// ─────────────────────────────────────────────────────────────────────────────

const FREE_QUESTIONS: QDef[] = [

  // ── ROTATION 90° ── (free, questions 1-10) ────────────────────────────────
  {
    id: "005b9782-028e-4793-8b36-a710ea036a1c",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 50, 38, 0)),
      fr(sh("triangle", 50, 50, 38, 90)),
      fr(sh("triangle", 50, 50, 38, 180)),
      fr(sh("triangle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("triangle", 50, 50, 38, 270)),   // correct: 270°
      fr(sh("triangle", 50, 50, 38, 0)),     // wrong: back to 0°
      fr(sh("triangle", 50, 50, 38, 90)),    // wrong: frame 1
      fr(sh("triangle", 50, 50, 38, 180)),   // wrong: frame 2
    ),
  },
  {
    id: "027e644f-e49d-4cad-93f3-347b943baba3",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 180)),
      fr(sh("arrow", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 270)),
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 180)),
    ),
  },
  {
    id: "0a1ce787-5127-4b18-8df9-8e88d027e3e5",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 38, 0)),
      fr(sh("pentagon", 50, 50, 38, 90)),
      fr(sh("pentagon", 50, 50, 38, 180)),
      fr(sh("pentagon", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("pentagon", 50, 50, 38, 0)),
      fr(sh("pentagon", 50, 50, 38, 90)),
      fr(sh("pentagon", 50, 50, 38, 180)),
      fr(sh("pentagon", 50, 50, 38, 270)),
    ),
  },
  {
    id: "0d1f2556-04d5-4e80-8cf4-82d56bb7834f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0)),
      fr(sh("semicircle", 50, 50, 38, 90)),
      fr(sh("semicircle", 50, 50, 38, 180)),
      fr(sh("semicircle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("semicircle", 50, 50, 38, 180)),
      fr(sh("semicircle", 50, 50, 38, 270)),
      fr(sh("semicircle", 50, 50, 38, 0)),
      fr(sh("semicircle", 50, 50, 38, 90)),
    ),
  },
  {
    id: "117aa933-62d8-4fcc-b25d-d3e1001a2d21",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 180)),
      fr(sh("right_triangle", 50, 50, 38, 270)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 270)),
      fr(sh("right_triangle", 50, 50, 38, 180)),
    ),
  },
  {
    id: "2af5cf0b-9d1d-46cc-835d-6a70a37dadaa",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 180, "solid")),
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 180, "solid")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 270, "solid")),
    ),
  },
  {
    id: "2e212e30-6c4e-4552-8557-83a64e240515",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
      fr(sh("arrow", 50, 50, 38, 180, "solid")),
      fr(sh("arrow", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 270, "solid")),
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
      fr(sh("arrow", 50, 50, 38, 180, "solid")),
    ),
  },
  {
    id: "4ed2f818-89a1-4cc4-b1ac-4e2fbf53e78f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 90, "solid")),
      fr(sh("pentagon", 50, 50, 38, 180, "solid")),
      fr(sh("pentagon", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("pentagon", 50, 50, 38, 180, "solid")),
      fr(sh("pentagon", 50, 50, 38, 270, "solid")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 90, "solid")),
    ),
  },
  {
    id: "50f5f906-467d-418b-94c6-d63fb4390573",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 180, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 270, "solid")),
      fr(sh("semicircle", 50, 50, 38, 180, "solid")),
    ),
  },
  {
    // 45° rotation — harder variant (still free pool)
    id: "5cd76d68-4e77-4784-ba4e-225afc439395",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 45)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 135)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("arrow", 50, 50, 38, 45)),
      fr(sh("arrow", 50, 50, 38, 90)),
      fr(sh("arrow", 50, 50, 38, 0)),
      fr(sh("arrow", 50, 50, 38, 135)),
    ),
  },

  // ── SIZE 15→25→35→?45 (free, questions 11-15) ─────────────────────────────
  {
    id: "6255ad3a-c481-46d3-aaf9-11140b4a8bf2",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("circle", 50, 50, 15, 0)),
      fr(sh("circle", 50, 50, 25, 0)),
      fr(sh("circle", 50, 50, 35, 0)),
      fr(sh("circle", 50, 50, 45, 0)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("circle", 50, 50, 45, 0)),
      fr(sh("circle", 50, 50, 15, 0)),
      fr(sh("circle", 50, 50, 35, 0)),
      fr(sh("circle", 50, 50, 55, 0)),
    ),
  },
  {
    id: "6ac03ba2-a903-4685-b3c0-d52b7d68ea56",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 15, 0)),
      fr(sh("pentagon", 50, 50, 25, 0)),
      fr(sh("pentagon", 50, 50, 35, 0)),
      fr(sh("pentagon", 50, 50, 45, 0)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("pentagon", 50, 50, 15, 0)),
      fr(sh("pentagon", 50, 50, 45, 0)),
      fr(sh("pentagon", 50, 50, 35, 0)),
      fr(sh("pentagon", 50, 50, 55, 0)),
    ),
  },
  {
    id: "75595e9c-1d28-40e2-bd5e-b6a49f1c8fe9",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 50, 15, 0)),
      fr(sh("triangle", 50, 50, 25, 0)),
      fr(sh("triangle", 50, 50, 35, 0)),
      fr(sh("triangle", 50, 50, 45, 0)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("triangle", 50, 50, 15, 0)),
      fr(sh("triangle", 50, 50, 35, 0)),
      fr(sh("triangle", 50, 50, 45, 0)),
      fr(sh("triangle", 50, 50, 55, 0)),
    ),
  },
  {
    id: "764e418b-0561-4849-9adc-d22d8beb25ae",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("star", 50, 50, 15, 0)),
      fr(sh("star", 50, 50, 25, 0)),
      fr(sh("star", 50, 50, 35, 0)),
      fr(sh("star", 50, 50, 45, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("star", 50, 50, 15, 0)),
      fr(sh("star", 50, 50, 25, 0)),
      fr(sh("star", 50, 50, 35, 0)),
      fr(sh("star", 50, 50, 45, 0)),
    ),
  },
  {
    id: "7a18242b-192a-4051-bdc3-07ec88e1e144",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("diamond", 50, 50, 15, 0)),
      fr(sh("diamond", 50, 50, 25, 0)),
      fr(sh("diamond", 50, 50, 35, 0)),
      fr(sh("diamond", 50, 50, 45, 0)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("diamond", 50, 50, 45, 0)),
      fr(sh("diamond", 50, 50, 15, 0)),
      fr(sh("diamond", 50, 50, 25, 0)),
      fr(sh("diamond", 50, 50, 35, 0)),
    ),
  },

  // ── COUNT 1→2→3→?4 (free, questions 16-20) ───────────────────────────────
  {
    id: "949f1ed6-630c-4f2a-908d-857b85ff4d36",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "circle"), cnt(2, "circle"), cnt(3, "circle"), cnt(4, "circle")],
    answerOptions: placeOpts("B",
      cnt(4, "circle"),
      cnt(3, "circle"),
      cnt(1, "circle"),
      cnt(5, "circle"),
    ),
  },
  {
    id: "adc2e78b-126d-4c72-a15c-bc008d90ab05",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "triangle"), cnt(2, "triangle"), cnt(3, "triangle"), cnt(4, "triangle")],
    answerOptions: placeOpts("C",
      cnt(1, "triangle"),
      cnt(2, "triangle"),
      cnt(4, "triangle"),
      cnt(5, "triangle"),
    ),
  },
  {
    id: "b01dcb3b-36da-4dae-aa20-7612657e4804",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "pentagon"), cnt(2, "pentagon"), cnt(3, "pentagon"), cnt(4, "pentagon")],
    answerOptions: placeOpts("D",
      cnt(1, "pentagon"),
      cnt(2, "pentagon"),
      cnt(5, "pentagon"),
      cnt(4, "pentagon"),
    ),
  },
  {
    id: "b85d1dc4-a146-4bbf-bf30-8b36fb4ab1d5",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "star"), cnt(2, "star"), cnt(3, "star"), cnt(4, "star")],
    answerOptions: placeOpts("A",
      cnt(4, "star"),
      cnt(1, "star"),
      cnt(2, "star"),
      cnt(5, "star"),
    ),
  },
  {
    id: "bebc637a-5847-4b48-9220-25499e72b421",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "diamond"), cnt(2, "diamond"), cnt(3, "diamond"), cnt(4, "diamond")],
    answerOptions: placeOpts("B",
      cnt(1, "diamond"),
      cnt(4, "diamond"),
      cnt(5, "diamond"),
      cnt(2, "diamond"),
    ),
  },

  // ── FILL none→dotted→hatched→?solid (free, questions 21-25) ─────────────
  {
    id: "c1aae4a5-c041-4a8d-a4b9-dd20a08fb238",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 38, 0, "none")),
      fr(sh("pentagon", 50, 50, 38, 0, "dotted")),
      fr(sh("pentagon", 50, 50, 38, 0, "hatched")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 50, 38, 0, "none")),
      fr(sh("pentagon", 50, 50, 38, 0, "hatched")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 0, "dotted")),
    ),
  },
  {
    id: "cc76f0e5-dd48-4430-a16d-64679bc1691f",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "none")),
      fr(sh("triangle", 50, 50, 38, 0, "dotted")),
      fr(sh("triangle", 50, 50, 38, 0, "hatched")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 50, 38, 0, "none")),
      fr(sh("triangle", 50, 50, 38, 0, "dotted")),
      fr(sh("triangle", 50, 50, 38, 0, "hatched")),
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
    ),
  },
  {
    id: "d70b9b47-4ff6-4287-8f5f-be6d4600ae09",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("hexagon", 50, 50, 38, 0, "none")),
      fr(sh("hexagon", 50, 50, 38, 0, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 0, "hatched")),
      fr(sh("hexagon", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("hexagon", 50, 50, 38, 0, "solid")),
      fr(sh("hexagon", 50, 50, 38, 0, "none")),
      fr(sh("hexagon", 50, 50, 38, 0, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 0, "hatched")),
    ),
  },
  {
    id: "e8b2fd50-97d2-4d47-9767-11b253cc9079",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
      fr(sh("star", 50, 50, 38, 0, "hatched")),
      fr(sh("star", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "solid")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
      fr(sh("star", 50, 50, 38, 0, "hatched")),
    ),
  },
  {
    id: "e8bca49d-3693-4156-b805-72e837c709a9",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("diamond", 50, 50, 38, 0, "none")),
      fr(sh("diamond", 50, 50, 38, 0, "dotted")),
      fr(sh("diamond", 50, 50, 38, 0, "hatched")),
      fr(sh("diamond", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("diamond", 50, 50, 38, 0, "none")),
      fr(sh("diamond", 50, 50, 38, 0, "hatched")),
      fr(sh("diamond", 50, 50, 38, 0, "solid")),
      fr(sh("diamond", 50, 50, 38, 0, "dotted")),
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NON-FREE POOL: 25 questions
// Rotation 45° (5), Size (5), Count (5), Fill (5), Dual (5)
// ─────────────────────────────────────────────────────────────────────────────

const NONFREE_QUESTIONS: QDef[] = [

  // ── ROTATION 45° (harder — non-free) ──────────────────────────────────────
  {
    id: "1b206e87-ab88-4463-bfc0-0bdbe2e16d82",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 45)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 135)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 50, 38, 45)),
      fr(sh("right_triangle", 50, 50, 38, 90)),
      fr(sh("right_triangle", 50, 50, 38, 0)),
      fr(sh("right_triangle", 50, 50, 38, 135)),
    ),
  },
  {
    id: "1de2fee2-b729-4e42-98c5-9ba2823cc73b",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 45, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
      fr(sh("arrow", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow", 50, 50, 38, 135, "solid")),
      fr(sh("arrow", 50, 50, 38, 45, "solid")),
      fr(sh("arrow", 50, 50, 38, 0, "solid")),
      fr(sh("arrow", 50, 50, 38, 90, "solid")),
    ),
  },
  {
    id: "262558e8-9434-4fa8-94d4-d4f2313fa1f1",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
      fr(sh("pentagon", 50, 50, 38, 90, "solid")),
      fr(sh("pentagon", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
      fr(sh("pentagon", 50, 50, 38, 135, "solid")),
      fr(sh("pentagon", 50, 50, 38, 0, "solid")),
      fr(sh("pentagon", 50, 50, 38, 90, "solid")),
    ),
  },
  {
    id: "2d5b2e12-9e52-448b-8973-e6d3fb6e5f7f",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 45, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("triangle", 50, 50, 38, 0, "solid")),
      fr(sh("triangle", 50, 50, 38, 45, "solid")),
      fr(sh("triangle", 50, 50, 38, 135, "solid")),
      fr(sh("triangle", 50, 50, 38, 90, "solid")),
    ),
  },
  {
    id: "4b95089e-3c47-474c-8806-ed62a3d30177",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 45, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 135, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("semicircle", 50, 50, 38, 0, "solid")),
      fr(sh("semicircle", 50, 50, 38, 45, "solid")),
      fr(sh("semicircle", 50, 50, 38, 90, "solid")),
      fr(sh("semicircle", 50, 50, 38, 135, "solid")),
    ),
  },

  // ── SIZE — larger growth (non-free) ──────────────────────────────────────
  {
    id: "60cc1411-fa0b-4b50-b9e4-cdaa22b67b18",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("hexagon", 50, 50, 12, 0)),
      fr(sh("hexagon", 50, 50, 24, 0)),
      fr(sh("hexagon", 50, 50, 36, 0)),
      fr(sh("hexagon", 50, 50, 48, 0)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("hexagon", 50, 50, 48, 0)),
      fr(sh("hexagon", 50, 50, 12, 0)),
      fr(sh("hexagon", 50, 50, 36, 0)),
      fr(sh("hexagon", 50, 50, 60, 0)),
    ),
  },
  {
    id: "6f9dc95f-ab28-459d-940f-b208cf02b43d",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow", 50, 50, 12, 0)),
      fr(sh("arrow", 50, 50, 24, 0)),
      fr(sh("arrow", 50, 50, 36, 0)),
      fr(sh("arrow", 50, 50, 48, 0)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("arrow", 50, 50, 12, 0)),
      fr(sh("arrow", 50, 50, 48, 0)),
      fr(sh("arrow", 50, 50, 36, 0)),
      fr(sh("arrow", 50, 50, 60, 0)),
    ),
  },
  {
    id: "72892459-14c2-4291-b19d-a1dbee526f25",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("square", 50, 50, 12, 0)),
      fr(sh("square", 50, 50, 24, 0)),
      fr(sh("square", 50, 50, 36, 0)),
      fr(sh("square", 50, 50, 48, 0)),
    ],
    answerOptions: placeOpts("C",
      fr(sh("square", 50, 50, 12, 0)),
      fr(sh("square", 50, 50, 36, 0)),
      fr(sh("square", 50, 50, 48, 0)),
      fr(sh("square", 50, 50, 60, 0)),
    ),
  },
  {
    // 12-unit steps: 10→22→34→?46
    id: "74803f6e-5e40-4f69-9bf8-eb26b1989294",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("circle", 50, 50, 10, 0)),
      fr(sh("circle", 50, 50, 22, 0)),
      fr(sh("circle", 50, 50, 34, 0)),
      fr(sh("circle", 50, 50, 46, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("circle", 50, 50, 10, 0)),
      fr(sh("circle", 50, 50, 34, 0)),
      fr(sh("circle", 50, 50, 58, 0)),
      fr(sh("circle", 50, 50, 46, 0)),
    ),
  },
  {
    id: "92424e8c-ab16-453a-b85f-eec9570ca682",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("star", 50, 50, 12, 0)),
      fr(sh("star", 50, 50, 24, 0)),
      fr(sh("star", 50, 50, 36, 0)),
      fr(sh("star", 50, 50, 48, 0)),
    ],
    answerOptions: placeOpts("A",
      fr(sh("star", 50, 50, 48, 0)),
      fr(sh("star", 50, 50, 12, 0)),
      fr(sh("star", 50, 50, 24, 0)),
      fr(sh("star", 50, 50, 60, 0)),
    ),
  },

  // ── COUNT — different shapes (non-free) ───────────────────────────────────
  {
    id: "92674afa-cd88-42e1-859b-dc2d61688f9c",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "hexagon"), cnt(2, "hexagon"), cnt(3, "hexagon"), cnt(4, "hexagon")],
    answerOptions: placeOpts("B",
      cnt(1, "hexagon"),
      cnt(4, "hexagon"),
      cnt(5, "hexagon"),
      cnt(2, "hexagon"),
    ),
  },
  {
    id: "96cf2338-be1c-45b0-9b4b-be4287c8bdfd",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "arrow"), cnt(2, "arrow"), cnt(3, "arrow"), cnt(4, "arrow")],
    answerOptions: placeOpts("C",
      cnt(2, "arrow"),
      cnt(1, "arrow"),
      cnt(4, "arrow"),
      cnt(5, "arrow"),
    ),
  },
  {
    id: "9ae674fb-7730-4c37-b9c0-2571b1d6c89e",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "square", "solid"), cnt(2, "square", "solid"), cnt(3, "square", "solid"), cnt(4, "square", "solid")],
    answerOptions: placeOpts("D",
      cnt(1, "square", "solid"),
      cnt(2, "square", "solid"),
      cnt(5, "square", "solid"),
      cnt(4, "square", "solid"),
    ),
  },
  {
    id: "a0fabe7f-6c5d-41c5-979f-182b088e4bb0",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "circle", "solid"), cnt(2, "circle", "solid"), cnt(3, "circle", "solid"), cnt(4, "circle", "solid")],
    answerOptions: placeOpts("A",
      cnt(4, "circle", "solid"),
      cnt(2, "circle", "solid"),
      cnt(1, "circle", "solid"),
      cnt(5, "circle", "solid"),
    ),
  },
  {
    id: "af3c18c2-1dc5-49ed-aa9c-df4938d66f3f",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_position_x",
    prompt: PROMPT_SEQ,
    frames: [cnt(1, "triangle", "solid"), cnt(2, "triangle", "solid"), cnt(3, "triangle", "solid"), cnt(4, "triangle", "solid")],
    answerOptions: placeOpts("B",
      cnt(5, "triangle", "solid"),
      cnt(4, "triangle", "solid"),
      cnt(1, "triangle", "solid"),
      cnt(2, "triangle", "solid"),
    ),
  },

  // ── FILL — varied shapes/rotations (non-free) ─────────────────────────────
  {
    id: "b16d83df-3bd0-47a6-a40e-126132f3f5fb",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 50, 38, 45, "none")),
      fr(sh("pentagon", 50, 50, 38, 45, "dotted")),
      fr(sh("pentagon", 50, 50, 38, 45, "hatched")),
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 50, 38, 45, "none")),
      fr(sh("pentagon", 50, 50, 38, 45, "dotted")),
      fr(sh("pentagon", 50, 50, 38, 45, "solid")),
      fr(sh("pentagon", 50, 50, 38, 45, "hatched")),
    ),
  },
  {
    id: "b282b9ab-d1b5-409e-be61-0735496b61b6",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("square", 50, 50, 38, 0, "none")),
      fr(sh("square", 50, 50, 38, 0, "dotted")),
      fr(sh("square", 50, 50, 38, 0, "hatched")),
      fr(sh("square", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("D",
      fr(sh("square", 50, 50, 38, 0, "none")),
      fr(sh("square", 50, 50, 38, 0, "dotted")),
      fr(sh("square", 50, 50, 38, 0, "hatched")),
      fr(sh("square", 50, 50, 38, 0, "solid")),
    ),
  },
  {
    id: "c7b8b236-39d6-455d-bc18-eb7226c84584",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("hexagon", 50, 50, 38, 30, "none")),
      fr(sh("hexagon", 50, 50, 38, 30, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 30, "hatched")),
      fr(sh("hexagon", 50, 50, 38, 30, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("hexagon", 50, 50, 38, 30, "solid")),
      fr(sh("hexagon", 50, 50, 38, 30, "none")),
      fr(sh("hexagon", 50, 50, 38, 30, "dotted")),
      fr(sh("hexagon", 50, 50, 38, 30, "hatched")),
    ),
  },
  {
    id: "c871a244-6e46-40e8-9b64-0979dc164630",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
      fr(sh("star", 50, 50, 38, 0, "hatched")),
      fr(sh("star", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("B",
      fr(sh("star", 50, 50, 38, 0, "none")),
      fr(sh("star", 50, 50, 38, 0, "solid")),
      fr(sh("star", 50, 50, 38, 0, "dotted")),
      fr(sh("star", 50, 50, 38, 0, "hatched")),
    ),
  },
  {
    id: "c8fc40dd-8db1-43bd-9921-e769c5dedcb4",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("circle", 50, 50, 38, 0, "none")),
      fr(sh("circle", 50, 50, 38, 0, "dotted")),
      fr(sh("circle", 50, 50, 38, 0, "hatched")),
      fr(sh("circle", 50, 50, 38, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("circle", 50, 50, 38, 0, "none")),
      fr(sh("circle", 50, 50, 38, 0, "hatched")),
      fr(sh("circle", 50, 50, 38, 0, "solid")),
      fr(sh("circle", 50, 50, 38, 0, "dotted")),
    ),
  },

  // ── DUAL-ELEMENT (non-free, hardest) ─────────────────────────────────────
  // Each frame contains TWO shapes: top (y=30) follows one rule, bottom (y=70) follows another.
  {
    // Top: triangle rotates 0→90→180→?270  |  Bottom: circle grows 10→20→30→?40
    id: "cbf76491-6b08-44e1-97cf-ee77c87cb3b3",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("triangle", 50, 30, 35, 0),   sh("circle", 50, 70, 10, 0)),
      fr(sh("triangle", 50, 30, 35, 90),  sh("circle", 50, 70, 20, 0)),
      fr(sh("triangle", 50, 30, 35, 180), sh("circle", 50, 70, 30, 0)),
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("triangle", 50, 30, 35, 0),   sh("circle", 50, 70, 40, 0)),  // wrong rotation
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 30, 0)),  // wrong size
      fr(sh("triangle", 50, 30, 35, 90),  sh("circle", 50, 70, 20, 0)),  // both wrong
      fr(sh("triangle", 50, 30, 35, 270), sh("circle", 50, 70, 40, 0)),  // correct
    ),
  },
  {
    // Top: arrow rotates 0→90→180→?270  |  Bottom: pentagon fill none→dotted→hatched→?solid
    id: "d12d9050-75d6-444c-bc51-a894d7bcd7c6",
    correctAnswer: "A",
    subRuleId: "nvr.sequence.compound_rotate+fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("arrow",   50, 30, 35, 0,   "solid"), sh("pentagon", 50, 70, 30, 0, "none")),
      fr(sh("arrow",   50, 30, 35, 90,  "solid"), sh("pentagon", 50, 70, 30, 0, "dotted")),
      fr(sh("arrow",   50, 30, 35, 180, "solid"), sh("pentagon", 50, 70, 30, 0, "hatched")),
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),
    ],
    answerOptions: placeOpts("A",
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),   // correct
      fr(sh("arrow",   50, 30, 35, 0,   "solid"), sh("pentagon", 50, 70, 30, 0, "solid")),   // wrong rotation
      fr(sh("arrow",   50, 30, 35, 270, "solid"), sh("pentagon", 50, 70, 30, 0, "none")),    // wrong fill
      fr(sh("arrow",   50, 30, 35, 180, "solid"), sh("pentagon", 50, 70, 30, 0, "hatched")), // both wrong
    ),
  },
  {
    // Top: semicircle rotates 0→90→180→?270  |  Bottom: star grows 10→20→30→?40
    id: "d769454f-0f7d-42ef-98b6-bc5a9f793da6",
    correctAnswer: "B",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("semicircle", 50, 30, 35, 0),   sh("star", 50, 70, 10, 0)),
      fr(sh("semicircle", 50, 30, 35, 90),  sh("star", 50, 70, 20, 0)),
      fr(sh("semicircle", 50, 30, 35, 180), sh("star", 50, 70, 30, 0)),
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("B",
      fr(sh("semicircle", 50, 30, 35, 0),   sh("star", 50, 70, 30, 0)),  // both wrong
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 40, 0)),  // correct
      fr(sh("semicircle", 50, 30, 35, 270), sh("star", 50, 70, 30, 0)),  // wrong size
      fr(sh("semicircle", 50, 30, 35, 90),  sh("star", 50, 70, 40, 0)),  // wrong rotation
    ),
  },
  {
    // Top: pentagon rotates 0→90→180→?270  |  Bottom: diamond fill none→dotted→hatched→?solid
    id: "d78f336d-7916-46b3-9c47-e16d4e9b71ce",
    correctAnswer: "C",
    subRuleId: "nvr.sequence.compound_rotate+fill_cycle",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("pentagon", 50, 30, 35, 0),   sh("diamond", 50, 70, 28, 0, "none")),
      fr(sh("pentagon", 50, 30, 35, 90),  sh("diamond", 50, 70, 28, 0, "dotted")),
      fr(sh("pentagon", 50, 30, 35, 180), sh("diamond", 50, 70, 28, 0, "hatched")),
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "solid")),
    ],
    answerOptions: placeOpts("C",
      fr(sh("pentagon", 50, 30, 35, 90),  sh("diamond", 50, 70, 28, 0, "solid")),   // wrong rotation
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "dotted")), // wrong fill
      fr(sh("pentagon", 50, 30, 35, 270), sh("diamond", 50, 70, 28, 0, "solid")),  // correct
      fr(sh("pentagon", 50, 30, 35, 0),   sh("diamond", 50, 70, 28, 0, "hatched")),// both wrong
    ),
  },
  {
    // Top: right_triangle rotates 0→90→180→?270  |  Bottom: hexagon grows 10→20→30→?40
    id: "ef0ba72e-579b-4f84-acc9-7ae1d91259bf",
    correctAnswer: "D",
    subRuleId: "nvr.sequence.compound_rotate+size",
    prompt: PROMPT_SEQ,
    frames: [
      fr(sh("right_triangle", 50, 30, 35, 0),   sh("hexagon", 50, 70, 10, 0)),
      fr(sh("right_triangle", 50, 30, 35, 90),  sh("hexagon", 50, 70, 20, 0)),
      fr(sh("right_triangle", 50, 30, 35, 180), sh("hexagon", 50, 70, 30, 0)),
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 40, 0)),
    ],
    answerOptions: placeOpts("D",
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 30, 0)),  // wrong size
      fr(sh("right_triangle", 50, 30, 35, 0),   sh("hexagon", 50, 70, 40, 0)),  // wrong rotation
      fr(sh("right_triangle", 50, 30, 35, 180), sh("hexagon", 50, 70, 20, 0)), // both wrong
      fr(sh("right_triangle", 50, 30, 35, 270), sh("hexagon", 50, 70, 40, 0)), // correct
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main rebuild function
// ─────────────────────────────────────────────────────────────────────────────

export async function rebuildNvrSequenceQuestions() {
  const allDefs = [...FREE_QUESTIONS, ...NONFREE_QUESTIONS];
  let rebuilt = 0;
  let failed = 0;

  for (const def of allDefs) {
    try {
      // frames[0..2] are shown, frames[3] is the correct answer frame
      // (identical to the option placed at def.correctAnswer position)
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

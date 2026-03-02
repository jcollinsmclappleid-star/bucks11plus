import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const shapes = ['circle', 'square', 'triangle', 'star', 'pentagon', 'arrow'] as const;
const baseStyle: SvgStroke = { strokeWidth: 3, stroke: '#111827', fill: 'none', dashed: false };
const difficulties = ['easy', 'medium', 'hard'] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 48271 + 12345) % 2147483647;
    return (s >>> 0) / 2147483647;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function makeElement(shape: string, x: number, y: number, size: number, rotation: number, fill: 'none' | 'solid' = 'none'): SvgElement {
  return { type: 'shape', shape, x, y, size, rotation, style: { ...baseStyle, fill } };
}

function applyRotation(el: SvgElement, degrees: number): SvgElement {
  return { ...el, rotation: (el.rotation + degrees) % 360 };
}

function reflectX(el: SvgElement): SvgElement {
  return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
}

function reflectY(el: SvgElement): SvgElement {
  return { ...el, y: 100 - el.y, rotation: (180 - el.rotation + 360) % 360 };
}

function applyTransformToFrame(frame: SvgFrame, transform: (el: SvgElement) => SvgElement): SvgFrame {
  return { elements: frame.elements.map(transform) };
}

function shuffleWithCorrect<T>(correct: T, distractors: T[], rng: () => number): { options: T[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correct) };
}

interface TransformDef {
  subRuleId: string;
  transform: (el: SvgElement) => SvgElement;
  wrongTransforms: ((el: SvgElement) => SvgElement)[];
  explanation: string;
  traps: string[];
}

const transformDefs: TransformDef[] = [
  {
    subRuleId: 'nvr.transform.rotate_90',
    transform: (el) => applyRotation(el, 90),
    wrongTransforms: [
      (el) => applyRotation(el, 180),
      (el) => applyRotation(el, 270),
      (el) => applyRotation(el, 45),
    ],
    explanation: 'The shape is rotated 90° clockwise.',
    traps: ['wrong_rotation', 'reversed_direction'],
  },
  {
    subRuleId: 'nvr.transform.rotate_180',
    transform: (el) => applyRotation(el, 180),
    wrongTransforms: [
      (el) => applyRotation(el, 90),
      (el) => applyRotation(el, 270),
      (el) => applyRotation(el, 45),
    ],
    explanation: 'The shape is rotated 180°.',
    traps: ['wrong_rotation', 'partial_rule'],
  },
  {
    subRuleId: 'nvr.transform.reflect_x',
    transform: reflectX,
    wrongTransforms: [
      reflectY,
      (el) => applyRotation(el, 180),
      (el) => ({ ...el, x: 100 - el.x }),
    ],
    explanation: 'The shape is reflected horizontally (across the vertical axis).',
    traps: ['wrong_axis', 'partial_rule'],
  },
  {
    subRuleId: 'nvr.transform.reflect_y',
    transform: reflectY,
    wrongTransforms: [
      reflectX,
      (el) => applyRotation(el, 180),
      (el) => ({ ...el, y: 100 - el.y }),
    ],
    explanation: 'The shape is reflected vertically (across the horizontal axis).',
    traps: ['wrong_axis', 'partial_rule'],
  },
];

export function generateRotationReflectionQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const perSubRule = 20;

  for (const def of transformDefs) {
    for (let i = 0; i < perSubRule; i++) {
      const rng = seededRandom(50000 + transformDefs.indexOf(def) * 10000 + i * 131);
      rng(); rng(); rng();
      const shape = pick(shapes, rng);
      const diff = pick(difficulties, rng);
      const numElements = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;

      const positions = [[35, 40], [65, 35], [50, 65], [30, 70]];
      const rotations = [0, 45, 90, 135, 180, 225, 270];

      const frameAElements: SvgElement[] = [];
      for (let e = 0; e < numElements; e++) {
        const [px, py] = positions[e % positions.length];
        const rot = pick(rotations, rng);
        const sh = e === 0 ? shape : pick(shapes, rng);
        const fill = rng() > 0.7 ? 'solid' as const : 'none' as const;
        frameAElements.push(makeElement(sh, px, py, 18, rot, fill));
      }

      const frameA: SvgFrame = { elements: frameAElements };
      const frameB = applyTransformToFrame(frameA, def.transform);

      const frameCElements: SvgElement[] = [];
      for (let e = 0; e < numElements; e++) {
        const [px, py] = positions[(e + 2) % positions.length];
        const rot = pick(rotations, rng);
        const sh = pick(shapes, rng);
        const fill = rng() > 0.7 ? 'solid' as const : 'none' as const;
        frameCElements.push(makeElement(sh, px, py, 18, rot, fill));
      }

      const frameC: SvgFrame = { elements: frameCElements };
      const correctFrame = applyTransformToFrame(frameC, def.transform);

      const distractors: SvgFrame[] = def.wrongTransforms.map(wt =>
        applyTransformToFrame(frameC, wt)
      );

      const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
      const labels = ['A', 'B', 'C', 'D'];

      questions.push({
        section: 'Non-Verbal Reasoning',
        type: 'rotation_reflection',
        prompt: 'Shape A is to Shape B as Shape C is to…?',
        options: labels,
        correctAnswer: labels[correctIndex],
        difficulty: diff,
        skillId: 'nvr.transform',
        subRuleId: def.subRuleId,
        renderType: 'svg',
        renderConfig: {
          kind: 'nvr.transform' as const,
          promptFrames: [frameA, frameB, frameC],
          answerOptions,
        },
        trapTypes: def.traps,
        cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 5,
        estTimeSeconds: diff === 'easy' ? 25 : diff === 'medium' ? 35 : 50,
        explanation: def.explanation,
        qaStatus: 'approved',
        locale: 'en-GB',
        britishSpelling: true,
        version: 1,
      });
    }
  }

  return questions;
}

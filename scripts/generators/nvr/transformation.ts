import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const allShapes = ['circle', 'square', 'triangle', 'star', 'pentagon', 'arrow'] as const;
const asymmetricShapes = ['triangle', 'star', 'pentagon', 'arrow'] as const;
const baseStyle: SvgStroke = { strokeWidth: 3, stroke: '#111827', fill: 'none', dashed: false };
const difficulties = ['easy', 'medium', 'hard'] as const;

const stemTemplates = [
  'Shape A is to Shape B as Shape C is to…?',
  'If Shape A becomes Shape B, what does Shape C become?',
  'Shape A transforms into Shape B. Apply the same rule to Shape C.',
  'Which option shows Shape C after the same transformation as A → B?',
];

const shapePalettes: (typeof asymmetricShapes[number])[][] = [
  ['triangle', 'star', 'pentagon'],
  ['arrow', 'pentagon', 'star'],
  ['triangle', 'arrow', 'star'],
  ['pentagon', 'arrow', 'triangle'],
  ['star', 'triangle', 'arrow'],
  ['arrow', 'star', 'pentagon'],
];

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

function rotateAndReflectX(el: SvgElement, degrees: number): SvgElement {
  const rotated = { ...el, rotation: (el.rotation + degrees) % 360 };
  return { ...rotated, x: 100 - rotated.x, rotation: (360 - rotated.rotation) % 360 };
}

function rotateOnly(el: SvgElement, degrees: number): SvgElement {
  return { ...el, rotation: (el.rotation + degrees) % 360 };
}

function reflectXOnly(el: SvgElement): SvgElement {
  return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
}

function reflectYOnly(el: SvgElement): SvgElement {
  return { ...el, y: 100 - el.y, rotation: (180 - el.rotation + 360) % 360 };
}

function applyToFrame(frame: SvgFrame, fn: (el: SvgElement) => SvgElement): SvgFrame {
  return { elements: frame.elements.map(fn) };
}

function shuffleWithCorrect<T>(correct: T, distractors: T[], rng: () => number): { options: T[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correct) };
}

function ensureAxisSafety(x: number, y: number): [number, number] {
  let safeX = x;
  let safeY = y;
  if (Math.abs(safeX - 50) < 8) {
    safeX = safeX <= 50 ? 50 - 8 : 50 + 8;
  }
  if (Math.abs(safeY - 50) < 8) {
    safeY = safeY <= 50 ? 50 - 8 : 50 + 8;
  }
  return [safeX, safeY];
}

function framesAreIdentical(a: SvgFrame, b: SvgFrame): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function hasAnyDuplicateOptions(options: SvgFrame[]): boolean {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (framesAreIdentical(options[i], options[j])) return true;
    }
  }
  return false;
}

const safePositions: [number, number][] = [
  [25, 30], [75, 30], [25, 70], [75, 70],
  [30, 25], [70, 25], [30, 75], [70, 75],
];

export function generateTransformationQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const rotationAngles = [90, 180];

  for (let i = 0; i < 40; i++) {
    let seedOffset = 0;
    let question: GeneratedQuestion | null = null;

    while (seedOffset < 10) {
      const rng = seededRandom(90000 + i * 131 + seedOffset);
      rng(); rng(); rng();

      const palette = shapePalettes[i % shapePalettes.length];
      const shape = pick(palette, rng);
      const diff = pick(difficulties, rng);
      const rotAngle = pick(rotationAngles, rng);
      const numElements = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
      const stemIdx = i % stemTemplates.length;
      const stem = stemTemplates[stemIdx];
      const paletteId = `palette_${i % shapePalettes.length}`;
      const densityLevel = diff === 'easy' ? 'low' as const : diff === 'medium' ? 'medium' as const : 'high' as const;

      const rotations = [0, 45, 90, 135, 180, 225, 270];

      const frameAElements: SvgElement[] = [];
      for (let e = 0; e < numElements; e++) {
        const basePos = safePositions[(e + i * 3) % safePositions.length];
        const [px, py] = ensureAxisSafety(basePos[0], basePos[1]);
        const rot = pick(rotations, rng);
        const sh = e === 0 ? shape : pick(palette, rng);
        const fill = rng() > 0.7 ? 'solid' as const : 'none' as const;
        frameAElements.push(makeElement(sh, px, py, 18, rot, fill));
      }

      const frameA: SvgFrame = { elements: frameAElements };
      const frameB = applyToFrame(frameA, (el) => rotateAndReflectX(el, rotAngle));

      const frameCElements: SvgElement[] = [];
      for (let e = 0; e < numElements; e++) {
        const basePos = safePositions[(e + i * 3 + 2) % safePositions.length];
        const [px, py] = ensureAxisSafety(basePos[0], basePos[1]);
        const rot = pick(rotations, rng);
        const sh = pick(palette, rng);
        const fill = rng() > 0.7 ? 'solid' as const : 'none' as const;
        frameCElements.push(makeElement(sh, px, py, 18, rot, fill));
      }

      const frameC: SvgFrame = { elements: frameCElements };
      const correctFrame = applyToFrame(frameC, (el) => rotateAndReflectX(el, rotAngle));

      const distractors: SvgFrame[] = [
        applyToFrame(frameC, (el) => rotateOnly(el, rotAngle)),
        applyToFrame(frameC, reflectXOnly),
        applyToFrame(frameC, reflectYOnly),
      ];

      const allOptions = [correctFrame, ...distractors];
      if (hasAnyDuplicateOptions(allOptions)) {
        seedOffset++;
        continue;
      }

      const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
      const labels = ['A', 'B', 'C', 'D'];

      question = {
        section: 'Non-Verbal Reasoning',
        type: 'transformation',
        prompt: stem,
        options: labels,
        correctAnswer: labels[correctIndex],
        difficulty: diff,
        skillId: 'nvr.transform',
        subRuleId: 'nvr.transform.rotate_plus_reflect',
        renderType: 'svg',
        renderConfig: {
          kind: 'nvr.transform' as const,
          promptFrames: [frameA, frameB, frameC],
          answerOptions,
        },
        trapTypes: ['wrong_rotation', 'wrong_axis', 'partial_rule'],
        cognitiveLoad: diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5,
        estTimeSeconds: diff === 'easy' ? 30 : diff === 'medium' ? 45 : 60,
        explanation: `The shape is rotated ${rotAngle}° and then reflected horizontally.`,
        qaStatus: 'approved',
        locale: 'en-GB',
        britishSpelling: true,
        version: 1,
        stemVariantId: `stem_${stemIdx}`,
        layoutVariantId: `layout_${numElements}el`,
        shapePaletteId: paletteId,
        distractorStyleId: 'rotate_plus_reflect',
        densityLevel,
      };
      break;
    }

    if (question) {
      questions.push(question);
    }
  }

  return questions;
}

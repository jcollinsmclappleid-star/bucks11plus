import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const allShapes = ['circle', 'square', 'triangle', 'star', 'pentagon', 'arrow'] as const;
const asymmetricShapes = ['triangle', 'star', 'pentagon', 'arrow'] as const;
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

export function generateTransformationQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const rotationAngles = [90, 180];

  for (let i = 0; i < 40; i++) {
    const rng = seededRandom(90000 + i * 131);
    rng(); rng(); rng();
    const shape = pick(asymmetricShapes, rng);
    const diff = pick(difficulties, rng);
    const rotAngle = pick(rotationAngles, rng);
    const numElements = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;

    const positions = [[35, 40], [65, 35], [50, 65], [30, 30]];
    const rotations = [0, 45, 90, 135, 180, 225, 270];

    const frameAElements: SvgElement[] = [];
    for (let e = 0; e < numElements; e++) {
      const [px, py] = positions[e % positions.length];
      const rot = pick(rotations, rng);
      const sh = e === 0 ? shape : pick(asymmetricShapes, rng);
      const fill = rng() > 0.7 ? 'solid' as const : 'none' as const;
      frameAElements.push(makeElement(sh, px, py, 18, rot, fill));
    }

    const frameA: SvgFrame = { elements: frameAElements };
    const frameB = applyToFrame(frameA, (el) => rotateAndReflectX(el, rotAngle));

    const frameCElements: SvgElement[] = [];
    for (let e = 0; e < numElements; e++) {
      const [px, py] = positions[(e + 2) % positions.length];
      const rot = pick(rotations, rng);
      const sh = pick(asymmetricShapes, rng);
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

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'transformation',
      prompt: 'Shape A is to Shape B as Shape C is to…?',
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
    });
  }

  return questions;
}

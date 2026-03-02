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

function mirrorX(el: SvgElement): SvgElement {
  return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
}

function shuffleWithCorrect<T>(correct: T, distractors: T[], rng: () => number): { options: T[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correct) };
}

export function generateSymmetryQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 40; i++) {
    const rng = seededRandom(110000 + i * 131);
    rng(); rng(); rng();
    const diff = pick(difficulties, rng);
    const numElements = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;

    const leftElements: SvgElement[] = [];
    for (let e = 0; e < numElements; e++) {
      const shape = pick(shapes, rng);
      const x = 10 + Math.floor(rng() * 35);
      const y = 15 + Math.floor(rng() * 70);
      const size = 12 + Math.floor(rng() * 10);
      const rotation = Math.floor(rng() * 8) * 45;
      const fill = rng() > 0.6 ? 'solid' as const : 'none' as const;
      leftElements.push(makeElement(shape, x, y, size, rotation, fill));
    }

    const leftHalf: SvgFrame = { elements: leftElements };

    const correctElements = leftElements.map(mirrorX);
    const correctFrame: SvgFrame = { elements: correctElements };

    const distractor1: SvgFrame = {
      elements: leftElements.map(el => ({ ...el, x: 100 - el.x })),
    };

    const distractor2: SvgFrame = {
      elements: leftElements.map(el => ({
        ...mirrorX(el),
        rotation: (mirrorX(el).rotation + 90) % 360,
      })),
    };

    const distractor3: SvgFrame = {
      elements: leftElements.map(el => ({
        ...el,
        y: 100 - el.y,
        x: 100 - el.x,
      })),
    };

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, [distractor1, distractor2, distractor3], rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'symmetry',
      prompt: 'Which option completes the mirror image of the pattern?',
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.symmetry',
      subRuleId: 'nvr.symmetry.mirror_completion',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.classification' as const,
        group: [leftHalf],
        answerOptions,
      },
      trapTypes: ['wrong_axis', 'partial_rule', 'reversed_direction'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 5,
      estTimeSeconds: diff === 'easy' ? 25 : diff === 'medium' ? 35 : 50,
      explanation: 'The correct answer mirrors each element across the vertical centre line, reversing both position and rotation.',
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    });
  }

  return questions;
}

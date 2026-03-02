import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const shapes = ['circle', 'square', 'triangle', 'star'] as const;
const baseStyle: SvgStroke = { strokeWidth: 3, stroke: '#111827', fill: 'none', dashed: false };
const difficulties = ['easy', 'medium', 'hard'] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function shuffleWithCorrect<T>(correct: T, distractors: T[], rng: () => number): { options: T[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  const correctIndex = all.indexOf(correct);
  return { options: all, correctIndex };
}

function makeElement(shape: string, x: number, y: number, size: number, rotation: number, fill: 'none' | 'solid' = 'none'): SvgElement {
  return { type: 'shape', shape, x, y, size, rotation, style: { ...baseStyle, fill } };
}

function generateRotationIncrement(startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const increments = [45, 90];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i);
    const shape = shapes[Math.floor(rng() * shapes.length)];
    const increment = increments[Math.floor(rng() * increments.length)];
    const diff = difficulties[Math.floor(rng() * difficulties.length)];
    const startRotation = Math.floor(rng() * 4) * 45;

    const frames: SvgFrame[] = [];
    for (let f = 0; f < 5; f++) {
      frames.push({ elements: [makeElement(shape, 50, 50, 20, startRotation + increment * f)] });
    }

    const correctFrame = frames[4];
    const distractors: SvgFrame[] = [
      { elements: [makeElement(shape, 50, 50, 20, startRotation + increment * 4 + increment)] },
      { elements: [makeElement(shape, 50, 50, 20, startRotation + increment * 4 - increment)] },
      { elements: [makeElement(shape, 50, 50, 20, startRotation)] },
    ];

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: `Which shape comes next in the sequence?`,
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.sequence',
      subRuleId: 'nvr.sequence.rotation_increment',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: frames.slice(0, 4),
        questionIndex: 4,
        answerOptions,
      },
      trapTypes: ['wrong_rotation', 'reversed_direction'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 30 : 40,
      explanation: `The shape rotates by ${increment}° each step. The correct answer continues this pattern.`,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    });
  }
  return questions;
}

function generateCountIncrement(startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i);
    const shape = shapes[Math.floor(rng() * shapes.length)];
    const diff = difficulties[Math.floor(rng() * difficulties.length)];
    const positions = [
      [50, 50], [30, 30], [70, 30], [30, 70], [70, 70],
      [50, 30], [50, 70], [30, 50], [70, 50],
    ];

    const frames: SvgFrame[] = [];
    for (let f = 0; f < 5; f++) {
      const elements: SvgElement[] = [];
      for (let e = 0; e <= f; e++) {
        const [px, py] = positions[e % positions.length];
        elements.push(makeElement(shape, px, py, 14, 0));
      }
      frames.push({ elements });
    }

    const correctFrame = frames[4];
    const d1: SvgFrame = { elements: correctFrame.elements.slice(0, 3) };
    const d2: SvgFrame = { elements: [...correctFrame.elements, makeElement(shape, 50, 50, 14, 0)] };
    const d3: SvgFrame = { elements: correctFrame.elements.map(el => makeElement(shape, el.x, el.y, 14, 90)) };

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, [d1, d2, d3], rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: `Which shape comes next in the sequence?`,
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.sequence',
      subRuleId: 'nvr.sequence.count_increment',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: frames.slice(0, 4),
        questionIndex: 4,
        answerOptions,
      },
      trapTypes: ['partial_rule', 'wrong_rotation'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 30 : 40,
      explanation: `One more ${shape} is added in each step. The next frame should have ${5} shapes.`,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    });
  }
  return questions;
}

function generateFillToggle(startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i);
    const shape = shapes[Math.floor(rng() * shapes.length)];
    const diff = difficulties[Math.floor(rng() * difficulties.length)];
    const startFilled = rng() > 0.5;

    const frames: SvgFrame[] = [];
    for (let f = 0; f < 5; f++) {
      const filled = (f % 2 === 0) === startFilled;
      frames.push({ elements: [makeElement(shape, 50, 50, 22, 0, filled ? 'solid' : 'none')] });
    }

    const correctFrame = frames[4];
    const wrongFill: 'solid' | 'none' = correctFrame.elements[0].style.fill === 'solid' ? 'none' : 'solid';
    const distractors: SvgFrame[] = [
      { elements: [makeElement(shape, 50, 50, 22, 0, wrongFill)] },
      { elements: [makeElement(shape, 50, 50, 22, 90, correctFrame.elements[0].style.fill)] },
      { elements: [makeElement(shape, 50, 50, 16, 0, wrongFill)] },
    ];

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: `Which shape comes next in the sequence?`,
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.sequence',
      subRuleId: 'nvr.sequence.fill_toggle',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: frames.slice(0, 4),
        questionIndex: 4,
        answerOptions,
      },
      trapTypes: ['partial_rule', 'wrong_axis'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4,
      estTimeSeconds: diff === 'easy' ? 15 : diff === 'medium' ? 25 : 35,
      explanation: `The fill alternates between solid and none each step.`,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    });
  }
  return questions;
}

function generatePositionShift(startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i);
    const shape = shapes[Math.floor(rng() * shapes.length)];
    const diff = difficulties[Math.floor(rng() * difficulties.length)];
    const horizontal = rng() > 0.5;
    const startPos = 15;
    const step = 17;

    const frames: SvgFrame[] = [];
    for (let f = 0; f < 5; f++) {
      const x = horizontal ? startPos + step * f : 50;
      const y = horizontal ? 50 : startPos + step * f;
      frames.push({ elements: [makeElement(shape, x, y, 16, 0)] });
    }

    const correctFrame = frames[4];
    const distractors: SvgFrame[] = [
      { elements: [makeElement(shape, horizontal ? startPos + step * 3 : 50, horizontal ? 50 : startPos + step * 3, 16, 0)] },
      { elements: [makeElement(shape, horizontal ? startPos + step * 5 : 50, horizontal ? 50 : startPos + step * 5, 16, 0)] },
      { elements: [makeElement(shape, horizontal ? correctFrame.elements[0].x : 30, horizontal ? 30 : correctFrame.elements[0].y, 16, 0)] },
    ];

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: `Which shape comes next in the sequence?`,
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.sequence',
      subRuleId: 'nvr.sequence.position_shift',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: frames.slice(0, 4),
        questionIndex: 4,
        answerOptions,
      },
      trapTypes: ['reversed_direction', 'partial_rule'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 30 : 40,
      explanation: `The shape moves ${horizontal ? 'horizontally' : 'vertically'} by a fixed amount each step.`,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    });
  }
  return questions;
}

export function generateSequenceQuestions(): GeneratedQuestion[] {
  return [
    ...generateRotationIncrement(1000, 20),
    ...generateCountIncrement(2000, 20),
    ...generateFillToggle(3000, 20),
    ...generatePositionShift(4000, 20),
  ];
}

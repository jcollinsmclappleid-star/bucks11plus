import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allFills,
  difficulties, seededRandom, pick, shuffleArray,
  shuffleWithCorrect, makeShape, makeLine, makeDot,
  safePositions, getDifficultyConfig,
  hasAnyDuplicateOptions,
} from './shared';

const asymmetricShapes = [
  'square', 'triangle', 'pentagon', 'arrow', 'star',
  'hexagon', 'diamond', 'cross', 'parallelogram', 'trapezoid',
  'semicircle', 'right_triangle', 'kite',
] as const;

function getSymmetryConfig(diff: string) {
  const base = getDifficultyConfig(diff);
  return {
    ...base,
    shapePool: asymmetricShapes.filter(s => (base.shapePool as readonly string[]).includes(s)),
  };
}

const stemTemplates = [
  'Which option completes the mirror image of the pattern?',
  'Select the option that correctly mirrors the given pattern.',
  'Which image shows the correct reflection of the pattern?',
  'Identify the option that completes the symmetrical pattern.',
];

function mirrorX(el: SvgElement): SvgElement {
  if (el.type === 'shape') return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
  if (el.type === 'line') return { ...el, x1: 100 - el.x1, x2: 100 - el.x2 };
  if (el.type === 'dot') return { ...el, x: 100 - el.x };
  return el;
}

function applyToFrame(frame: SvgFrame, fn: (el: SvgElement) => SvgElement): SvgFrame {
  return { elements: frame.elements.map(fn) };
}

export function generateSymmetryQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 60; i++) {
    const rng = seededRandom(110000 + i * 179);
    rng(); rng(); rng();

    const diffWeights: Array<typeof difficulties[number]> = ['easy', 'medium', 'medium', 'hard', 'hard', 'hard'];
    const diff = pick(diffWeights, rng);
    const config = getSymmetryConfig(diff);
    const stemIdx = i % stemTemplates.length;

    const leftElements: SvgElement[] = [];
    const positions = shuffleArray([...safePositions], rng);

    for (let e = 0; e < config.numShapes; e++) {
      const shape = pick(config.shapePool, rng);
      const pos = positions[e];
      const x = Math.min(45, pos[0]);
      const y = pos[1];
      const size = 12 + Math.floor(rng() * 10);
      const rotation = Math.floor(rng() * 8) * 45;
      const fill = pick(config.fillPool, rng);
      leftElements.push(makeShape(shape, x, y, size, rotation, fill));
    }

    if (config.addDots) {
      leftElements.push(makeDot(10 + Math.floor(rng() * 30), 15 + Math.floor(rng() * 70), 2 + rng() * 2));
    }

    if (config.addLine) {
      leftElements.push(makeLine(
        10, 20 + Math.floor(rng() * 60),
        40, 20 + Math.floor(rng() * 60),
        rng() > 0.5,
      ));
    }

    const leftHalf: SvgFrame = { elements: leftElements };
    const correctFrame = applyToFrame(leftHalf, mirrorX);

    const distortions = [
      (el: SvgElement): SvgElement => {
        const m = mirrorX(el);
        if (m.type === 'shape') return { ...m, rotation: (m.rotation + 45) % 360 };
        return m;
      },
      (el: SvgElement): SvgElement => {
        const m = mirrorX(el);
        if (m.type === 'shape') return { ...m, rotation: (m.rotation + 90) % 360 };
        return m;
      },
      (el: SvgElement): SvgElement => {
        if (el.type === 'shape') return { ...el, x: 100 - el.x, y: 100 - el.y, rotation: (180 - el.rotation + 360) % 360 };
        if (el.type === 'dot') return { ...el, x: 100 - el.x, y: 100 - el.y };
        if (el.type === 'line') return { ...el, x1: 100 - el.x1, y1: 100 - el.y1, x2: 100 - el.x2, y2: 100 - el.y2 };
        return el;
      },
    ];

    const distractors = distortions.map(fn => applyToFrame(leftHalf, fn));

    const correctStr = JSON.stringify(correctFrame);
    const validDistractors = distractors.filter(d => JSON.stringify(d) !== correctStr);
    const uniqueDistractors: SvgFrame[] = [];
    const seenFrames = new Set<string>([correctStr]);
    for (const d of validDistractors) {
      const dStr = JSON.stringify(d);
      if (!seenFrames.has(dStr)) {
        uniqueDistractors.push(d);
        seenFrames.add(dStr);
      }
    }

    while (uniqueDistractors.length < 3) {
      const offset = (uniqueDistractors.length + 1) * 30 + 15;
      uniqueDistractors.push(applyToFrame(leftHalf, (el) => {
        const m = mirrorX(el);
        if (m.type === 'shape') return { ...m, size: Math.max(8, m.size + 4), rotation: (m.rotation + offset) % 360 };
        return m;
      }));
    }

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, uniqueDistractors.slice(0, 3), rng);
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'symmetry',
      prompt: stemTemplates[stemIdx],
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
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 4 : 5,
      estTimeSeconds: diff === 'easy' ? 25 : diff === 'medium' ? 40 : 55,
      explanation: 'The correct answer mirrors each element across the vertical centre line, reversing both position and rotation.',
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 2,
      stemVariantId: `symmetry_stem_${stemIdx}`,
      shapePaletteId: `symmetry_palette_${i % 6}`,
      densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
    });
  }

  return questions;
}

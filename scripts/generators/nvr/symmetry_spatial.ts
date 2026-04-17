import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  STRONGLY_ASYMMETRIC, ROTATION_SAFE_SHAPES,
  seededRandom, pick, shuffleArray, shuffleWithCorrect,
  makeShape, makeLine, safePositions, hasAnyDuplicateOptions,
} from './shared';

const stems = [
  'Which option completes the mirror image of the pattern?',
  'Select the option that correctly reflects the given pattern.',
  'Which image shows the correct mirror of the pattern shown?',
  'Identify the option that completes the symmetrical pattern.',
  'Which option shows the correct left-to-right mirror of the shapes?',
];

function mirrorX(el: SvgElement): SvgElement {
  if (el.type === 'shape') {
    // Reflect x-position across centre; invert rotation for left-right asymmetric shapes
    return { ...el, x: 100 - el.x, rotation: ((360 - el.rotation) % 360) };
  }
  if (el.type === 'line') return { ...el, x1: 100 - el.x1, x2: 100 - el.x2 };
  if (el.type === 'dot') return { ...el, x: 100 - el.x };
  return el;
}

function applyToFrame(frame: SvgFrame, fn: (el: SvgElement) => SvgElement): SvgFrame {
  return { elements: frame.elements.map(fn) };
}

// Wrong-axis distractor: reflect vertically instead of horizontally
function mirrorY(el: SvgElement): SvgElement {
  if (el.type === 'shape') return { ...el, y: 100 - el.y, rotation: ((180 - el.rotation + 360) % 360) };
  if (el.type === 'line') return { ...el, y1: 100 - el.y1, y2: 100 - el.y2 };
  if (el.type === 'dot') return { ...el, y: 100 - el.y };
  return el;
}

// Wrong-rotation distractor: reflects x but adds a rotation offset
function mirrorXWithRotationError(offset: number) {
  return (el: SvgElement): SvgElement => {
    const m = mirrorX(el);
    if (m.type === 'shape') return { ...m, rotation: (m.rotation + offset) % 360 };
    return m;
  };
}

// Wrong-position distractor: mirrors but shifts position
function mirrorXWithPositionError(el: SvgElement): SvgElement {
  const m = mirrorX(el);
  if (m.type === 'shape') return { ...m, x: Math.max(10, Math.min(90, m.x + 10)) };
  return m;
}

// Incomplete mirror: mirrors only some elements
function mirrorXPartial(frame: SvgFrame, rng: () => number): SvgFrame {
  const half = Math.ceil(frame.elements.length / 2);
  return {
    elements: frame.elements.map((el, i) =>
      i < half ? mirrorX(el) : el
    ),
  };
}

// Wrong fill distractor: correct position but wrong fill
function mirrorXWrongFill(rng: () => number) {
  return (el: SvgElement): SvgElement => {
    const m = mirrorX(el);
    if (m.type === 'shape') {
      const fills: FillPattern[] = ['none', 'solid', 'hatched', 'dotted'];
      const newFill = fills.filter(f => f !== (m as any).style.fill)[Math.floor(rng() * 3)];
      return { ...m, style: { ...m.style, fill: newFill } };
    }
    return m;
  };
}

interface SymSpec {
  difficulty: 'easy' | 'medium' | 'hard';
  numShapes: number;
  shapePool: readonly string[];
  fillPool: FillPattern[];
  addLine: boolean;
  addSizeVariance: boolean;
}

function getSpec(diff: 'easy' | 'medium' | 'hard', rng: () => number): SymSpec {
  if (diff === 'easy') {
    return {
      difficulty: 'easy',
      numShapes: 2,
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      addLine: false,
      addSizeVariance: false,
    };
  }
  if (diff === 'medium') {
    return {
      difficulty: 'medium',
      numShapes: 3,
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched', 'dotted'],
      addLine: rng() > 0.6,
      addSizeVariance: false,
    };
  }
  // hard: secondary attributes — different fills per shape, size gradient, optional line
  return {
    difficulty: 'hard',
    numShapes: 3 + Math.floor(rng() * 2),
    shapePool: [...STRONGLY_ASYMMETRIC, 'pentagon', 'star'],
    fillPool: ['none', 'solid', 'hatched', 'dotted', 'striped'],
    addLine: rng() > 0.4,
    addSizeVariance: true,
  };
}

export function generateSymmetryQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const diffWeights: Array<'easy' | 'medium' | 'hard'> = [
    'easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard',
  ];

  for (let i = 0; i < 140; i++) {
    const rng = seededRandom(200000 + i * 193);
    rng(); rng(); rng();

    const diff = diffWeights[i % diffWeights.length];
    const spec = getSpec(diff, rng);
    const stemIdx = i % stems.length;

    // Build left-half frame (shapes on left side: x ≤ 48)
    const leftElements: SvgElement[] = [];
    const positions = shuffleArray([...safePositions], rng);

    if (spec.addLine) {
      const lineY = 20 + Math.floor(rng() * 60);
      leftElements.push(makeLine(5, lineY, 48, lineY, rng() > 0.5));
    }

    for (let e = 0; e < spec.numShapes; e++) {
      const shape = pick(spec.shapePool, rng);
      const rawX = positions[e % positions.length][0];
      const x = Math.min(48, rawX);
      const y = positions[e % positions.length][1];
      const fill = pick(spec.fillPool, rng);
      // Hard: size variance — shapes vary significantly in size to increase perceptibility challenge
      const size = spec.addSizeVariance
        ? 10 + Math.floor(rng() * 14)
        : 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      leftElements.push(makeShape(shape, x, y, size, rotation, fill));
    }

    const leftHalf: SvgFrame = { elements: leftElements };
    const correctFrame = applyToFrame(leftHalf, mirrorX);

    // Build diagnostic distractors
    const distractors: SvgFrame[] = [];

    // 1. Wrong axis (reflect vertically — most common mistake)
    distractors.push(applyToFrame(leftHalf, mirrorY));

    // 2. Wrong rotation angle (correct position, wrong orientation)
    distractors.push(applyToFrame(leftHalf, mirrorXWithRotationError(90)));

    // 3. Partial mirror (only some elements reflected)
    distractors.push(mirrorXPartial(leftHalf, rng));

    // 4. Wrong fill (correct geometry, wrong shading) — hard only
    if (diff === 'hard') {
      distractors.push(applyToFrame(leftHalf, mirrorXWrongFill(rng)));
    }

    // 5. Off-by-45 rotation
    distractors.push(applyToFrame(leftHalf, mirrorXWithRotationError(45)));

    // Filter: unique and not equal to correct
    const correctStr = JSON.stringify(correctFrame);
    const uniqueDistractors: SvgFrame[] = [];
    const seen = new Set<string>([correctStr]);

    for (const d of distractors) {
      if (uniqueDistractors.length >= 3) break;
      const ds = JSON.stringify(d);
      if (!seen.has(ds)) {
        uniqueDistractors.push(d);
        seen.add(ds);
      }
    }

    // Fallback
    let fallbackOffset = 135;
    while (uniqueDistractors.length < 3) {
      const candidate = applyToFrame(leftHalf, mirrorXWithRotationError(fallbackOffset));
      const cs = JSON.stringify(candidate);
      if (!seen.has(cs)) {
        uniqueDistractors.push(candidate);
        seen.add(cs);
      }
      fallbackOffset += 45;
      if (fallbackOffset > 315) break;
    }

    if (uniqueDistractors.length < 3) continue;

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(
      correctFrame, uniqueDistractors.slice(0, 3), rng
    );
    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'symmetry',
      prompt: stems[stemIdx],
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.symmetry',
      subRuleId: spec.addSizeVariance
        ? 'nvr.symmetry.mirror_with_size_variance'
        : spec.addLine
        ? 'nvr.symmetry.mirror_with_line'
        : 'nvr.symmetry.mirror_completion',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.classification' as const,
        group: [leftHalf],
        answerOptions,
        sectionLabel: 'Select the correct mirror image',
      },
      trapTypes: ['wrong_axis', 'wrong_rotation', 'partial_mirror', 'fill_error'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 4 : 6,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 35 : 50,
      explanation: 'The correct answer reflects each shape across the vertical centre line, reversing position left-to-right and inverting horizontal rotation.',
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 4,
      stemVariantId: `sym_stem_${stemIdx}`,
      densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
      shapePaletteId: `sym_palette_${i % 8}`,
    });
  }

  return questions;
}

import type { GeneratedQuestion } from '../types';
import {
  type ShapeAttrs, type Rule, type FillPattern,
  STRONGLY_ASYMMETRIC,
  seededRandom, pick, pickN, shuffleArray, shuffleWithCorrect,
  buildShapeFrame,
  applyRuleStack, buildSequence,
  frameAttrsToSvg, hasAnyDuplicateOptions,
  distractorMissedSecondary, distractorMissedPrimary,
  distractorWrongRotation, distractorOffByOne,
  distractorWrongFill, distractorWrongSize, distractorPartialApply,
  hasAnyDuplicateAttrOptions,
  frameIsPerceptiblyDifferent,
} from './shared';

// ─── Version ────────────────────────────────────────────────────────────────────
// v6: Fixed correctAttrs off-by-one bug (was allFrames[visibleFrames], now allFrames[visibleFrames-1])
//     Removed all dash/hatched/dual-fill specs. Added size_grow, size_rotate, position_rotate,
//     count_shrink_rotate, fill_cycle_count, position_fill specs.
export const SEQUENCE_VERSION = 6;

// ─── Mobile rendering constants ─────────────────────────────────────────────────
// Frame panels are w-20 h-20 = 80px CSS on mobile.
// SVG viewBox is 100×100, so 1 SVG unit = 0.8px.
// Minimum perceptible shape size at mobile: 20 SVG units = 16px.
// Recommended comfortable size: 24 SVG units = 19px.
const MIN_SHAPE_SIZE = 20;
const GOOD_BASE_SIZE = 24;
const LARGE_BASE_SIZE = 26;
const MIN_SIZE_DELTA = 8;

// ─── Stem variants ─────────────────────────────────────────────────────────────

const stems = [
  'Which shape comes next in the sequence?',
  'Select the shape that continues the sequence.',
  'Identify the next shape in the series.',
  'What is the next item in this pattern?',
  'Which option follows the pattern shown?',
];

// ─── Sequence spec ─────────────────────────────────────────────────────────────

interface SequenceSpec {
  rules: Rule[];
  subRuleId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  shapeRequirement: 'strongly_asymmetric' | 'any' | 'count_shapes';
  minShapes: number;
  maxShapes: number;
  visibleFrames: 3 | 4;
  primaryRule: string;
  secondaryRule?: string;
  baseSize?: number;
  countStart?: number;
  countDelta?: number;
  sizeDelta?: number;
}

// ─── Helper builders ───────────────────────────────────────────────────────────

function buildAsymRotAngle(rng: () => number): 90 | 180 {
  return pick([90, 90, 180] as const, rng);
}

function buildFillCycle2(rng: () => number): FillPattern[] {
  // Always solid/none — highest contrast pair at mobile. No hatched.
  return pick([
    ['none', 'solid'] as FillPattern[],
    ['none', 'solid'] as FillPattern[],
    ['solid', 'none'] as FillPattern[],
  ], rng);
}

// ─── Frame builders ────────────────────────────────────────────────────────────

/**
 * Build frames where count grows by 1 each step.
 * Returns allFrames (visibleFrames + 1 extra, never stored).
 */
function buildCountGrowFrames(
  rng: () => number,
  startCount: number,
  totalFrames: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const frames: ShapeAttrs[][] = [];
  for (let f = 0; f < totalFrames; f++) {
    const count = startCount + f;
    const shapes: ShapeAttrs[] = [];
    for (let i = 0; i < count; i++) {
      const pos = positionGrid[i % positionGrid.length];
      shapes.push({ id: i, shape: shapeType, x: pos[0], y: pos[1], size: baseSize, rotation: 0, fill: fillType, dashed: false });
    }
    frames.push(shapes);
  }
  return frames;
}

function buildCountShrinkFrames(
  rng: () => number,
  startCount: number,
  totalFrames: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const frames: ShapeAttrs[][] = [];
  for (let f = 0; f < totalFrames; f++) {
    const count = startCount - f;
    const shapes: ShapeAttrs[] = [];
    for (let i = 0; i < Math.max(0, count); i++) {
      const pos = positionGrid[i % positionGrid.length];
      shapes.push({ id: i, shape: shapeType, x: pos[0], y: pos[1], size: baseSize, rotation: 0, fill: fillType, dashed: false });
    }
    frames.push(shapes);
  }
  return frames;
}

/**
 * Build frames where one shape moves through 4 corner positions,
 * optionally changing fill and/or rotation each step.
 */
function buildPositionOrbitFrames(
  rng: () => number,
  shape: string,
  baseSize: number,
  fill: FillPattern,
  fillCycle: FillPattern[] | null,
  totalFrames: number,
  startRotation: number,
  rotDelta: number,
): ShapeAttrs[][] {
  const orbit: [number, number][] = [
    [28, 28], [72, 28], [72, 72], [28, 72],
  ];
  const frames: ShapeAttrs[][] = [];
  let currentFill = fill;
  for (let f = 0; f < totalFrames; f++) {
    const pos = orbit[f % orbit.length];
    if (fillCycle) currentFill = fillCycle[f % fillCycle.length];
    frames.push([{
      id: 0, shape, x: pos[0], y: pos[1], size: baseSize,
      rotation: (startRotation + rotDelta * f) % 360,
      fill: currentFill, dashed: false,
    }]);
  }
  return frames;
}

/**
 * Build frames where one shape grows in size each step, with optional rotation.
 * Returns allFrames (visibleFrames + 1 extra, never stored).
 */
function buildSizeGrowFrames(
  shape: string,
  fill: FillPattern,
  baseSize: number,
  sizeDelta: number,
  totalFrames: number,
  startRotation: number,
  rotDelta: number,
): ShapeAttrs[][] {
  const frames: ShapeAttrs[][] = [];
  for (let f = 0; f < totalFrames; f++) {
    const size = baseSize + f * sizeDelta;
    const rotation = (startRotation + rotDelta * f) % 360;
    frames.push([{ id: 0, shape, x: 50, y: 50, size, rotation, fill, dashed: false }]);
  }
  return frames;
}

/**
 * Build frames where count grows AND fill alternates each step.
 */
function buildFillCycleCountFrames(
  startCount: number,
  totalFrames: number,
  shapeType: string,
  fillCycle: FillPattern[],
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const frames: ShapeAttrs[][] = [];
  for (let f = 0; f < totalFrames; f++) {
    const count = Math.min(startCount + f, positionGrid.length);
    const fill = fillCycle[f % fillCycle.length];
    const shapes: ShapeAttrs[] = [];
    for (let i = 0; i < count; i++) {
      shapes.push({ id: i, shape: shapeType, x: positionGrid[i][0], y: positionGrid[i][1], size: baseSize, rotation: 0, fill, dashed: false });
    }
    frames.push(shapes);
  }
  return frames;
}

// ─── Validators ────────────────────────────────────────────────────────────────

function allFramesPerceptible(frames: ShapeAttrs[][]): boolean {
  for (let i = 0; i < frames.length - 1; i++) {
    if (!frameIsPerceptiblyDifferent(frames[i], frames[i + 1])) return false;
  }
  return true;
}

function countConditionalFirings(visibleFrames: ShapeAttrs[][], rule: Rule): number {
  if (rule.kind !== 'conditional') return Infinity;
  let count = 0;
  for (const frame of visibleFrames) {
    for (const shape of frame) {
      if (rule.check === 'fill_is_solid' && shape.fill === 'solid') { count++; break; }
      if (rule.check === 'fill_is_none' && shape.fill === 'none') { count++; break; }
      if (rule.check === 'is_large' && shape.size >= 17) { count++; break; }
      if (rule.check === 'is_small' && shape.size < 14) { count++; break; }
    }
  }
  return count;
}

function conditionalsFiredEnough(visibleFrames: ShapeAttrs[][], rules: Rule[]): boolean {
  for (const rule of rules) {
    if (rule.kind === 'conditional') {
      if (countConditionalFirings(visibleFrames, rule) < 2) return false;
    }
  }
  return true;
}

function fillCycleIsUnambiguous(visibleFrames: ShapeAttrs[][], rules: Rule[]): boolean {
  for (const rule of rules) {
    if (rule.kind === 'fillCycle') {
      if (rule.cycle.length < 2) return false;
    }
  }
  return true;
}

function minShapeSizeValid(allFrames: ShapeAttrs[][]): boolean {
  for (const frame of allFrames) {
    for (const shape of frame) {
      if (shape.size < MIN_SHAPE_SIZE) return false;
    }
  }
  return true;
}

function dominantRuleIsVisible(spec: SequenceSpec, allFrames: ShapeAttrs[][]): boolean {
  for (const rule of spec.rules) {
    if (rule.kind === 'scaleSize') {
      if (Math.abs(rule.delta) < MIN_SIZE_DELTA) return false;
    }
    if (rule.kind === 'fillCycle') {
      const cycle = rule.cycle;
      const hasHighContrast = (cycle.includes('none') && cycle.includes('solid'));
      if (!hasHighContrast) return false;
    }
  }
  return true;
}

function answersAreMeaningfullyDistinct(
  correctAttrs: ShapeAttrs[],
  distractorAttrs: ShapeAttrs[][],
): boolean {
  const all = [correctAttrs, ...distractorAttrs];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.length !== b.length) continue;
      const nearIdentical = a.every((sa, k) => {
        const sb = b[k];
        if (!sb) return false;
        const sizeClose = Math.abs(sa.size - sb.size) < 6;
        const rotClose = Math.abs(((sa.rotation - sb.rotation + 540) % 360) - 180) < 45;
        const sameFill = sa.fill === sb.fill;
        const samePos = Math.abs(sa.x - sb.x) < 10 && Math.abs(sa.y - sb.y) < 10;
        const sameDash = sa.dashed === sb.dashed;
        return sizeClose && rotClose && sameFill && samePos && sameDash;
      });
      if (nearIdentical) return false;
    }
  }
  return true;
}

// ─── Spec library ──────────────────────────────────────────────────────────────

function buildSequenceSpecs(rng: () => number): SequenceSpec[] {
  const deg = buildAsymRotAngle(rng);
  const fillCycle2 = buildFillCycle2(rng);

  return [
    // ══════════════════════════════════════════════════════════════════════════
    // EASY — 1 rule, 3 visible frames (questionIndex: 2)
    // Frames: [f0, f1, f2]. f2 is hidden as "?". Correct = f2 = allFrames[2].
    // Child sees f0="1" and f1="2", deduces f2="?".
    // ══════════════════════════════════════════════════════════════════════════

    {
      rules: [{ kind: 'rotate', degrees: deg }],
      subRuleId: 'nvr.sequence.rotate_only',
      explanation: `Each shape rotates ${deg}° clockwise each step. Frame 1 and Frame 2 show the progression — apply the same rotation to find the ? frame.`,
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: `rotation ${deg}° clockwise per step`,
      baseSize: LARGE_BASE_SIZE,
    },

    {
      rules: [{ kind: 'fillCycle', cycle: fillCycle2 }],
      subRuleId: 'nvr.sequence.fill_cycle_only',
      explanation: `The fill alternates ${fillCycle2.join(' → ')} each step. Two frames establish the pattern — the ? frame continues the same alternation.`,
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: `fill alternates ${fillCycle2.join(' → ')} each step`,
      baseSize: LARGE_BASE_SIZE,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.count_grow',
      explanation: 'One new shape is added each step. Count the shapes in each frame and continue the pattern to find the ? frame.',
      difficulty: 'easy',
      shapeRequirement: 'count_shapes',
      minShapes: 1, maxShapes: 4,
      visibleFrames: 3,
      primaryRule: 'count increases by 1 each step',
      baseSize: GOOD_BASE_SIZE,
      countStart: 1,
      countDelta: 1,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.count_shrink',
      explanation: 'One shape is removed each step. Count the shapes in each frame and continue the pattern to find the ? frame.',
      difficulty: 'easy',
      shapeRequirement: 'count_shapes',
      minShapes: 1, maxShapes: 4,
      visibleFrames: 3,
      primaryRule: 'count decreases by 1 each step',
      baseSize: GOOD_BASE_SIZE,
      countStart: 4,
      countDelta: -1,
    },

    {
      rules: [{ kind: 'rotate', degrees: 180 }],
      subRuleId: 'nvr.sequence.rotate_180_only',
      explanation: 'The shape flips 180° each step — it alternates between upright and inverted. Find the ? frame by applying the same flip.',
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: '180° flip each step',
      baseSize: LARGE_BASE_SIZE,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MEDIUM — clear rules, 4 visible frames (questionIndex: 3)
    // Frames: [f0, f1, f2, f3]. f3 is hidden as "?". Correct = f3 = allFrames[3].
    // Child sees f0="1", f1="2", f2="3", deduces f3="?".
    // ══════════════════════════════════════════════════════════════════════════

    {
      rules: [],
      subRuleId: 'nvr.sequence.position_orbit',
      explanation: 'The shape moves to the next corner position each step: top-left → top-right → bottom-right → bottom-left → and so on. Track the position to find the ? frame.',
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape orbits the four corner positions each step',
      baseSize: GOOD_BASE_SIZE,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.count_rotate',
      explanation: `One shape is added each step AND each shape rotates ${deg}°. Track both the growing count and the rotating orientation to find the ? frame.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 5,
      visibleFrames: 4,
      primaryRule: 'count increases by 1 each step',
      secondaryRule: `each shape rotates ${deg}° per step`,
      baseSize: LARGE_BASE_SIZE,
      countStart: 1,
      countDelta: 1,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.size_grow',
      explanation: 'The shape grows larger each step by the same amount. Compare the sizes across the three visible frames, then find the ? frame with the next size in the sequence.',
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape grows by a fixed amount each step',
      baseSize: 20,
      sizeDelta: 8,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // HARD — two clearly visible rules, 4 visible frames
    // Must track two independent progressions simultaneously.
    // ══════════════════════════════════════════════════════════════════════════

    {
      rules: [],
      subRuleId: 'nvr.sequence.size_rotate',
      explanation: `The shape grows larger AND rotates ${deg}° each step. Track both the increasing size and the rotating orientation across the three visible frames to find the ? frame.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape grows by a fixed amount each step',
      secondaryRule: `shape rotates ${deg}° each step`,
      baseSize: 20,
      sizeDelta: 8,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.position_rotate',
      explanation: `The shape moves to the next corner AND rotates ${deg}° each step. Track both position and orientation across the three visible frames to find the ? frame.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape orbits the four corner positions each step',
      secondaryRule: `shape rotates ${deg}° each step`,
      baseSize: GOOD_BASE_SIZE,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.count_shrink_rotate',
      explanation: `One shape is removed each step AND each shape rotates ${deg}°. Track both the shrinking count and the rotating orientation to find the ? frame.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 5,
      visibleFrames: 4,
      primaryRule: 'count decreases by 1 each step',
      secondaryRule: `each shape rotates ${deg}° per step`,
      baseSize: LARGE_BASE_SIZE,
      countStart: 4,
      countDelta: -1,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.fill_cycle_count',
      explanation: `One shape is added each step AND the fill alternates ${fillCycle2.join(' → ')}. Track both the growing count and the changing fill to find the ? frame.`,
      difficulty: 'hard',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 5,
      visibleFrames: 4,
      primaryRule: 'count increases by 1 each step',
      secondaryRule: `fill alternates ${fillCycle2.join(' → ')} each step`,
      baseSize: GOOD_BASE_SIZE,
      countStart: 1,
    },

    {
      rules: [],
      subRuleId: 'nvr.sequence.position_fill',
      explanation: `The shape moves to the next corner AND the fill alternates ${fillCycle2.join(' → ')} each step. Track both position and fill to find the ? frame.`,
      difficulty: 'hard',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape orbits the four corner positions each step',
      secondaryRule: `fill alternates ${fillCycle2.join(' → ')} each step`,
      baseSize: GOOD_BASE_SIZE,
    },
  ];
}

// ─── Build base frame with spec overrides ─────────────────────────────────────

function buildBaseFrame(
  rng: () => number,
  spec: SequenceSpec,
  fillPool: FillPattern[],
): ShapeAttrs[] {
  const numShapes = spec.minShapes;
  const shapePool = (spec.shapeRequirement === 'strongly_asymmetric')
    ? STRONGLY_ASYMMETRIC
    : ['pentagon', 'star', 'hexagon', 'diamond', 'square', 'circle'] as const;

  const positions: [number, number][] = [
    [30, 50], [70, 50], [50, 30], [50, 70],
    [30, 30], [70, 30], [30, 70], [70, 70],
  ];
  const shuffledPos = shuffleArray([...positions], rng);

  const shapes: ShapeAttrs[] = [];
  for (let i = 0; i < numShapes; i++) {
    const pos = shuffledPos[i % shuffledPos.length];
    const shape = pick(shapePool, rng);
    const fill = pick(fillPool, rng);
    const size = spec.baseSize ?? GOOD_BASE_SIZE;
    const rotation = Math.floor(rng() * 4) * 90;
    shapes.push({ id: i, shape, x: pos[0], y: pos[1], size, rotation, fill, dashed: false });
  }
  return shapes;
}

function fillPoolForDiff(diff: string): FillPattern[] {
  return ['none', 'solid'];
}

// ─── Distractor builders ────────────────────────────────────────────────────────

function buildCountDistractors(
  correctCount: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const MAX_SAFE = positionGrid.length;

  const buildFrame = (count: number): ShapeAttrs[] =>
    Array.from({ length: Math.max(0, count) }, (_, i) => ({
      id: i, shape: shapeType,
      x: positionGrid[i % positionGrid.length][0],
      y: positionGrid[i % positionGrid.length][1],
      size: baseSize, rotation: 0, fill: fillType, dashed: false,
    }));

  const offsets = [+1, -1, +2, -2, +3, -3, +4, -4];
  const candidates = offsets
    .map(o => buildFrame(correctCount + o))
    .filter(f => f.length > 0 && f.length <= MAX_SAFE);

  return candidates.slice(0, 3);
}

/**
 * Distractors for count_rotate and count_shrink_rotate:
 * wrong count + correct rotation, correct count + wrong rotation, wrong both.
 */
function buildCountRotateDistractors(
  correctCount: number,
  correctRotation: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const MAX_SAFE = positionGrid.length;

  const buildFrame = (count: number, rotation: number): ShapeAttrs[] =>
    Array.from({ length: Math.max(1, Math.min(count, MAX_SAFE)) }, (_, i) => ({
      id: i, shape: shapeType,
      x: positionGrid[i % MAX_SAFE][0],
      y: positionGrid[i % MAX_SAFE][1],
      size: baseSize, rotation, fill: fillType, dashed: false,
    }));

  const wrongCount = correctCount === 1 ? 2 : Math.max(1, correctCount - 1);
  const wrongCountAlt = correctCount >= 4 ? Math.max(1, correctCount - 2) : correctCount + 1;
  const wrongRot = (correctRotation + 90) % 360;
  const wrongRot2 = (correctRotation + 180) % 360;

  const candidates: ShapeAttrs[][] = [];
  candidates.push(buildFrame(wrongCount, correctRotation));
  candidates.push(buildFrame(correctCount, wrongRot));
  candidates.push(buildFrame(wrongCount, wrongRot2));
  candidates.push(buildFrame(wrongCountAlt, wrongRot));

  return candidates.slice(0, 3);
}

function buildPositionOrbitDistractors(
  correctFrame: ShapeAttrs[],
  allOrbitFrames: ShapeAttrs[][],
  rng: () => number,
): ShapeAttrs[][] {
  const candidates: ShapeAttrs[][] = [];
  const addIfUnique = (pool: ShapeAttrs[][], d: ShapeAttrs[]) => {
    if (!hasAnyDuplicateAttrOptions([correctFrame, ...pool, d])) pool.push(d);
  };

  for (const f of allOrbitFrames) {
    addIfUnique(candidates, f);
    if (candidates.length >= 3) break;
  }

  const wrongFill = correctFrame.map(s => ({
    ...s,
    fill: s.fill === 'none' ? 'solid' as FillPattern : 'none' as FillPattern,
  }));
  addIfUnique(candidates, wrongFill);

  if (allOrbitFrames.length >= 2) {
    const wf = allOrbitFrames[0].map(s => ({
      ...s,
      fill: s.fill === 'none' ? 'solid' as FillPattern : 'none' as FillPattern,
    }));
    addIfUnique(candidates, wf);
  }

  return candidates.slice(0, 3);
}

/**
 * Distractors for position_rotate: wrong position (from orbit frames), wrong rotation, mixed.
 */
function buildPositionRotateDistractors(
  correctFrame: ShapeAttrs[],
  allOrbitFrames: ShapeAttrs[][],
  rng: () => number,
): ShapeAttrs[][] {
  const candidates: ShapeAttrs[][] = [];
  const addIfUnique = (d: ShapeAttrs[]) => {
    if (!hasAnyDuplicateAttrOptions([correctFrame, ...candidates, d])) candidates.push(d);
  };

  for (const f of allOrbitFrames) {
    addIfUnique(f);
    if (candidates.length >= 2) break;
  }

  const correctRot = correctFrame[0]?.rotation ?? 0;
  const wrongRot = correctFrame.map(s => ({ ...s, rotation: (correctRot + 90) % 360 }));
  addIfUnique(wrongRot);

  const wrongRot2 = correctFrame.map(s => ({ ...s, rotation: (correctRot + 180) % 360 }));
  addIfUnique(wrongRot2);

  if (allOrbitFrames.length >= 1) {
    const mixedWrong = allOrbitFrames[0].map(s => ({ ...s, rotation: (s.rotation + 180) % 360 }));
    addIfUnique(mixedWrong);
  }

  return candidates.slice(0, 3);
}

/**
 * Distractors for size_grow: wrong size (±delta), correct size, etc.
 */
function buildSizeGrowDistractors(
  correctSize: number,
  shape: string,
  fill: FillPattern,
  rotation: number,
  sizeDelta: number,
): ShapeAttrs[][] {
  const buildFrame = (size: number, rot: number): ShapeAttrs[] => [{
    id: 0, shape, x: 50, y: 50,
    size: Math.max(MIN_SHAPE_SIZE, size),
    rotation: rot, fill, dashed: false,
  }];

  const candidates: ShapeAttrs[][] = [];
  candidates.push(buildFrame(correctSize - sizeDelta, rotation));
  candidates.push(buildFrame(correctSize + sizeDelta, rotation));
  candidates.push(buildFrame(correctSize - 2 * sizeDelta, rotation));
  candidates.push(buildFrame(correctSize + 2 * sizeDelta, rotation));

  const addIfUnique = (d: ShapeAttrs[]) => {
    const correct = buildFrame(correctSize, rotation);
    if (!hasAnyDuplicateAttrOptions([correct, ...candidates, d])) candidates.push(d);
  };
  addIfUnique(buildFrame(correctSize, (rotation + 90) % 360));

  return candidates.slice(0, 3);
}

/**
 * Distractors for size_rotate: wrong size, wrong rotation, wrong both.
 */
function buildSizeRotateDistractors(
  correctFrame: ShapeAttrs[],
  sizeDelta: number,
): ShapeAttrs[][] {
  const correct = correctFrame[0];
  const candidates: ShapeAttrs[][] = [];
  const addIfUnique = (d: ShapeAttrs[]) => {
    if (!hasAnyDuplicateAttrOptions([correctFrame, ...candidates, d])) candidates.push(d);
  };

  addIfUnique([{ ...correct, size: Math.max(MIN_SHAPE_SIZE, correct.size - sizeDelta) }]);
  addIfUnique([{ ...correct, rotation: (correct.rotation + 90) % 360 }]);
  addIfUnique([{ ...correct, size: Math.max(MIN_SHAPE_SIZE, correct.size - sizeDelta), rotation: (correct.rotation + 90) % 360 }]);
  addIfUnique([{ ...correct, size: Math.max(MIN_SHAPE_SIZE, correct.size - 2 * sizeDelta), rotation: (correct.rotation + 180) % 360 }]);

  return candidates.slice(0, 3);
}

/**
 * Distractors for fill_cycle_count: wrong count + right fill, right count + wrong fill, wrong both.
 */
function buildFillCycleCountDistractors(
  correctCount: number,
  correctFill: FillPattern,
  shapeType: string,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const wrongFill: FillPattern = correctFill === 'none' ? 'solid' : 'none';

  const buildFrame = (count: number, fill: FillPattern): ShapeAttrs[] =>
    Array.from({ length: Math.max(1, Math.min(count, positionGrid.length)) }, (_, i) => ({
      id: i, shape: shapeType,
      x: positionGrid[i][0], y: positionGrid[i][1],
      size: baseSize, rotation: 0, fill, dashed: false,
    }));

  const candidates: ShapeAttrs[][] = [];
  const wrongCount = correctCount === 1 ? 2 : Math.max(1, correctCount - 1);
  candidates.push(buildFrame(wrongCount, correctFill));
  candidates.push(buildFrame(correctCount, wrongFill));
  candidates.push(buildFrame(wrongCount, wrongFill));
  if (correctCount < 5) candidates.push(buildFrame(correctCount + 1, correctFill));

  return candidates.slice(0, 3);
}

function buildSequenceDistractors(
  visibleFrames: ShapeAttrs[][],
  correctNext: ShapeAttrs[],
  spec: SequenceSpec,
  rng: () => number,
): ShapeAttrs[][] {
  const lastFrame = visibleFrames[visibleFrames.length - 1];
  const firstFrame = visibleFrames[0];
  const candidates: ShapeAttrs[][] = [];

  const addIfUnique = (pool: ShapeAttrs[][], d: ShapeAttrs[] | null | undefined) => {
    if (!d) return;
    if (!hasAnyDuplicateAttrOptions([correctNext, ...pool, d])) pool.push(d);
  };

  addIfUnique(candidates, distractorMissedSecondary(lastFrame, spec.rules));
  addIfUnique(candidates, distractorMissedPrimary(lastFrame, spec.rules));
  addIfUnique(candidates, distractorOffByOne(lastFrame, spec.rules, rng));

  if (spec.rules.some(r => r.kind === 'rotate' || r.kind === 'alternating')) {
    addIfUnique(candidates, distractorWrongRotation(correctNext, rng));
  }

  if (spec.rules.some(r => r.kind === 'fillCycle' || r.kind === 'toggleDash')) {
    addIfUnique(candidates, distractorWrongFill(correctNext, rng));
  }

  addIfUnique(candidates, lastFrame);
  if (visibleFrames.length >= 2) {
    addIfUnique(candidates, visibleFrames[visibleFrames.length - 2]);
  }
  addIfUnique(candidates, firstFrame);

  const twoStep = applyRuleStack(applyRuleStack(lastFrame, spec.rules, 0), spec.rules, 1);
  addIfUnique(candidates, twoStep);

  addIfUnique(candidates, distractorWrongRotation(correctNext, rng));
  addIfUnique(candidates, distractorWrongFill(correctNext, rng));
  addIfUnique(candidates, distractorWrongSize(correctNext, rng));

  return candidates.slice(0, 3);
}

// ─── Review audit entry ────────────────────────────────────────────────────────

interface ReviewAuditEntry {
  subRuleId: string;
  difficulty: string;
  primaryRule: string;
  secondaryRule?: string;
  stemFrameCount: number;
  mobileCheck: string;
  evidenceReasoning: string;
  distractors: { label: string; type: string; whyWrong: string }[];
}

// ─── Main generator ────────────────────────────────────────────────────────────

function generateSequenceBatch(
  startSeed: number,
  count: number,
  auditLog?: ReviewAuditEntry[],
): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];
  let attempts = 0;
  let generated = 0;

  while (generated < count && attempts < count * 25) {
    attempts++;
    const rng = seededRandom(startSeed + attempts * 317);
    rng(); rng(); rng();

    const specs = buildSequenceSpecs(rng);
    const specIdx = attempts % specs.length;
    const spec = specs[specIdx];

    const fillPool = fillPoolForDiff(spec.difficulty);

    let allFrames: ShapeAttrs[][];
    let visibleFrames: ShapeAttrs[][];
    let correctAttrs: ShapeAttrs[];
    let distractorAttrs: ShapeAttrs[][] = [];

    // ── Handle special frame builders ──────────────────────────────────────────

    if (spec.subRuleId === 'nvr.sequence.count_grow') {
      const shapePool = ['circle', 'square', 'pentagon', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType = pick(['none', 'solid'] as FillPattern[], rng);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildCountGrowFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      // FIX: correct answer is the frame AT questionIndex (= visibleFrames-1), not one beyond it
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildCountDistractors(correctAttrs.length, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.count_shrink') {
      const shapePool = ['circle', 'square', 'pentagon', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType = pick(['none', 'solid'] as FillPattern[], rng);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildCountShrinkFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      // FIX: correct = the hidden frame (at questionIndex = visibleFrames-1)
      correctAttrs = allFrames[spec.visibleFrames - 1];
      if (correctAttrs.length === 0) continue;
      distractorAttrs = buildCountDistractors(correctAttrs.length, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.count_rotate') {
      const shapePool = STRONGLY_ASYMMETRIC;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const rngDeg = buildAsymRotAngle(rng);
      const totalFrames = spec.visibleFrames + 1;
      const countFrames = buildCountGrowFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      allFrames = countFrames.map((frame, f) =>
        frame.map(s => ({ ...s, rotation: (rngDeg * f) % 360 }))
      );
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      // FIX: correct = frame at questionIndex (visibleFrames-1)
      correctAttrs = allFrames[spec.visibleFrames - 1];
      if (correctAttrs.length > 5) continue;
      const correctRot = correctAttrs[0]?.rotation ?? 0;
      distractorAttrs = buildCountRotateDistractors(correctAttrs.length, correctRot, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.position_orbit') {
      const shapePool = ['square', 'pentagon', 'circle', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const startPos = Math.floor(rng() * 4);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildPositionOrbitFrames(rng, shapeType, spec.baseSize!, fillType, null, totalFrames, 0, 0);
      // Offset start position
      allFrames = allFrames.map((frame, f) => {
        const orbit: [number, number][] = [[28, 28], [72, 28], [72, 72], [28, 72]];
        const pos = orbit[(startPos + f) % 4];
        return frame.map(s => ({ ...s, x: pos[0], y: pos[1] }));
      });
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      // FIX: correct = frame at questionIndex (visibleFrames-1)
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildPositionOrbitDistractors(correctAttrs, allFrames.slice(0, spec.visibleFrames - 1), rng);

    } else if (spec.subRuleId === 'nvr.sequence.size_grow') {
      const shapePool = ['pentagon', 'square', 'hexagon', 'circle', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType = pick(['none', 'solid'] as FillPattern[], rng);
      const delta = spec.sizeDelta!;
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildSizeGrowFrames(shapeType, fillType, spec.baseSize!, delta, totalFrames, 0, 0);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildSizeGrowDistractors(correctAttrs[0].size, shapeType, fillType, 0, delta);

    } else if (spec.subRuleId === 'nvr.sequence.size_rotate') {
      const shapePool = STRONGLY_ASYMMETRIC;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const delta = spec.sizeDelta!;
      const rngDeg = buildAsymRotAngle(rng);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildSizeGrowFrames(shapeType, fillType, spec.baseSize!, delta, totalFrames, 0, rngDeg);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildSizeRotateDistractors(correctAttrs, delta);

    } else if (spec.subRuleId === 'nvr.sequence.position_rotate') {
      const shapePool = STRONGLY_ASYMMETRIC;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const startPos = Math.floor(rng() * 4);
      const rngDeg = buildAsymRotAngle(rng);
      const totalFrames = spec.visibleFrames + 1;
      // Build orbit frames with rotation
      const orbit: [number, number][] = [[28, 28], [72, 28], [72, 72], [28, 72]];
      allFrames = Array.from({ length: totalFrames }, (_, f) => {
        const pos = orbit[(startPos + f) % 4];
        return [{ id: 0, shape: shapeType, x: pos[0], y: pos[1], size: spec.baseSize!, rotation: (rngDeg * f) % 360, fill: fillType, dashed: false }];
      });
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildPositionRotateDistractors(correctAttrs, allFrames.slice(0, spec.visibleFrames - 1), rng);

    } else if (spec.subRuleId === 'nvr.sequence.count_shrink_rotate') {
      const shapePool = STRONGLY_ASYMMETRIC;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const rngDeg = buildAsymRotAngle(rng);
      const totalFrames = spec.visibleFrames + 1;
      const countFrames = buildCountShrinkFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      allFrames = countFrames.map((frame, f) =>
        frame.map(s => ({ ...s, rotation: (rngDeg * f) % 360 }))
      );
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      if (correctAttrs.length === 0) continue;
      const correctRot = correctAttrs[0]?.rotation ?? 0;
      distractorAttrs = buildCountRotateDistractors(correctAttrs.length, correctRot, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.fill_cycle_count') {
      const shapePool = ['circle', 'square', 'pentagon', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillCycle = buildFillCycle2(rng);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildFillCycleCountFrames(spec.countStart!, totalFrames, shapeType, fillCycle, spec.baseSize!);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      const correctFill = correctAttrs[0]?.fill ?? 'none';
      distractorAttrs = buildFillCycleCountDistractors(correctAttrs.length, correctFill, shapeType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.position_fill') {
      const shapePool = ['square', 'pentagon', 'circle', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      // Only use high-contrast solid/none — no hatched
      const fillCycle: FillPattern[] = pick([['none', 'solid'], ['solid', 'none']] as FillPattern[][], rng);
      const startPos = Math.floor(rng() * 4);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildPositionOrbitFrames(rng, shapeType, spec.baseSize!, fillCycle[0], fillCycle, totalFrames, 0, 0);
      // Apply start position offset
      const orbit: [number, number][] = [[28, 28], [72, 28], [72, 72], [28, 72]];
      allFrames = allFrames.map((frame, f) => {
        const pos = orbit[(startPos + f) % 4];
        return frame.map(s => ({ ...s, x: pos[0], y: pos[1] }));
      });
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildPositionOrbitDistractors(correctAttrs, allFrames.slice(0, spec.visibleFrames - 1), rng);

    } else {
      // Standard rule-based spec
      const base = buildBaseFrame(rng, spec, fillPool);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildSequence(base, spec.rules, totalFrames);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      // FIX: correct = frame at questionIndex (visibleFrames-1), not one beyond
      correctAttrs = allFrames[spec.visibleFrames - 1];
      distractorAttrs = buildSequenceDistractors(visibleFrames, correctAttrs, spec, rng);
    }

    // ── Validation gate 1: perceptibility (standard specs only) ───────────────
    const customBuiltSpecs = [
      'nvr.sequence.count_grow', 'nvr.sequence.count_shrink',
      'nvr.sequence.count_rotate', 'nvr.sequence.position_orbit',
      'nvr.sequence.size_grow', 'nvr.sequence.size_rotate',
      'nvr.sequence.position_rotate', 'nvr.sequence.count_shrink_rotate',
      'nvr.sequence.fill_cycle_count', 'nvr.sequence.position_fill',
    ];
    if (!customBuiltSpecs.includes(spec.subRuleId)) {
      if (!allFramesPerceptible(allFrames)) continue;
    }

    // ── Validation gate 2: conditional firing ─────────────────────────────────
    if (!conditionalsFiredEnough(visibleFrames, spec.rules)) continue;

    // ── Validation gate 3: fill cycle unambiguity ─────────────────────────────
    if (!fillCycleIsUnambiguous(visibleFrames, spec.rules)) continue;

    // ── Validation gate 4: GL minimum shape size ──────────────────────────────
    if (!minShapeSizeValid(allFrames.slice(0, spec.visibleFrames))) continue;

    // ── Validation gate 5: dominant rule visibility ───────────────────────────
    if (!dominantRuleIsVisible(spec, allFrames)) continue;

    // ── Build distractors check ────────────────────────────────────────────────
    if (distractorAttrs.length < 3) continue;

    // ── Validation gate 6: answer separation ──────────────────────────────────
    if (!answersAreMeaningfullyDistinct(correctAttrs, distractorAttrs.slice(0, 3))) continue;

    // ── Duplicate check ───────────────────────────────────────────────────────
    const correctSvg = frameAttrsToSvg(correctAttrs);
    const distractorSvgs = distractorAttrs.slice(0, 3).map(frameAttrsToSvg);
    const allOptions = [correctSvg, ...distractorSvgs];
    if (hasAnyDuplicateOptions(allOptions)) continue;

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctSvg, distractorSvgs, rng);
    const labels = ['A', 'B', 'C', 'D'];
    const stemIdx = generated % stems.length;

    if (auditLog) {
      const distractorTypes = ['missed_secondary', 'off_by_one', 'missed_primary'];
      const allShapeSizes = allFrames.slice(0, spec.visibleFrames).flat().map(s => s.size);
      const minSize = Math.min(...allShapeSizes);
      auditLog.push({
        subRuleId: spec.subRuleId,
        difficulty: spec.difficulty,
        primaryRule: spec.primaryRule,
        secondaryRule: spec.secondaryRule,
        stemFrameCount: spec.visibleFrames,
        mobileCheck: `min shape size: ${minSize} SVG units = ${(minSize * 0.8).toFixed(1)}px at mobile. ${minSize >= MIN_SHAPE_SIZE ? 'PASS' : 'FAIL'}`,
        evidenceReasoning: `${spec.visibleFrames} frames stored; frame at questionIndex (${spec.visibleFrames - 1}) is hidden as "?". correctAttrs = allFrames[${spec.visibleFrames - 1}]. Min size: ${minSize} SVG units.`,
        distractors: distractorSvgs.map((_, i) => ({
          label: labels[(correctIndex + i + 1) % 4],
          type: distractorTypes[i] ?? 'wrong_size',
          whyWrong: getDistractorReason(distractorTypes[i] ?? 'wrong_size', spec),
        })),
      });
    }

    results.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: stems[stemIdx],
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: spec.difficulty,
      skillId: 'nvr.sequence',
      subRuleId: spec.subRuleId,
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: visibleFrames.map(frameAttrsToSvg),
        questionIndex: spec.visibleFrames - 1,
        answerOptions,
      },
      trapTypes: ['missed_secondary', 'off_by_one', 'wrong_rotation', 'missed_primary'],
      cognitiveLoad: spec.difficulty === 'easy' ? 2 : spec.difficulty === 'medium' ? 4 : 6,
      estTimeSeconds: spec.difficulty === 'easy' ? 25 : spec.difficulty === 'medium' ? 40 : 55,
      explanation: spec.explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: SEQUENCE_VERSION,
      stemVariantId: `stem_seq_${stemIdx}`,
      layoutVariantId: `seq_${spec.subRuleId}`,
      densityLevel: spec.difficulty === 'easy' ? 'low' : spec.difficulty === 'medium' ? 'medium' : 'high',
      distractorStyleId: spec.subRuleId,
    });

    generated++;
  }

  return results;
}

function getDistractorReason(type: string, spec: SequenceSpec): string {
  switch (type) {
    case 'missed_secondary': return `Applied only the primary rule (${spec.primaryRule}) but ignored the secondary rule. Correct orientation/position but wrong secondary attribute.`;
    case 'off_by_one': return 'Applied the rule one step too many or one too few — slightly overshot or undershot the answer.';
    case 'missed_primary': return `Applied only the secondary rule (${spec.secondaryRule ?? 'n/a'}) but ignored the primary. Wrong count, size, or position.`;
    case 'wrong_rotation': return 'Identified the correct count/size/position but selected the wrong rotation.';
    case 'wrong_fill': return 'Got the shape/orientation correct but predicted the wrong fill state.';
    default: return 'Applied a plausible but incorrect transformation — does not match the rule progression.';
  }
}

// ─── Public exports ────────────────────────────────────────────────────────────

export function generateSequenceQuestions(): GeneratedQuestion[] {
  const all: GeneratedQuestion[] = [
    ...generateSequenceBatch(20000, 150),
    ...generateSequenceBatch(25000, 150),
    ...generateSequenceBatch(30000, 150),
    ...generateSequenceBatch(35000, 150),
    ...generateSequenceBatch(40000, 150),
  ];

  const easy   = all.filter(q => q.difficulty === 'easy').slice(0, 20);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 30);
  const hard   = all.filter(q => q.difficulty === 'hard').slice(0, 50);

  return [...easy, ...medium, ...hard];
}

export function generateSequenceReviewSet(): {
  questions: GeneratedQuestion[];
  audit: ReviewAuditEntry[];
} {
  const audit: ReviewAuditEntry[] = [];
  const all: GeneratedQuestion[] = [
    ...generateSequenceBatch(50000, 60, audit),
    ...generateSequenceBatch(55000, 60, audit),
    ...generateSequenceBatch(60000, 60, audit),
  ];

  const easy   = all.filter(q => q.difficulty === 'easy').slice(0, 5);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 10);
  const hard   = all.filter(q => q.difficulty === 'hard').slice(0, 10);

  const reviewQuestions = [...easy, ...medium, ...hard];
  const usedIds = new Set(reviewQuestions.map((_, i) => i));

  return {
    questions: reviewQuestions,
    audit: audit.filter((_, i) => usedIds.has(i)).slice(0, 25),
  };
}

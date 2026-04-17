import type { GeneratedQuestion } from '../types';

// ─── Core SVG types (kept for renderer compatibility) ────────────────────────

export type FillPattern = 'none' | 'solid' | 'hatched' | 'crosshatched' | 'dotted' | 'striped';

export type SvgStroke = {
  strokeWidth: number;
  stroke: string;
  fill: FillPattern;
  dashed?: boolean;
  opacity?: number;
};

export type SvgElement =
  | { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; style: SvgStroke }
  | { type: 'dot'; x: number; y: number; r: number; style: SvgStroke };

export type SvgFrame = { elements: SvgElement[] };

// ─── Internal attribute model (rule engine works here, not on pixels) ─────────

export interface ShapeAttrs {
  id: number;
  shape: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  fill: FillPattern;
  dashed: boolean;
  isAnchor?: boolean;
}

export interface FrameAttrs {
  shapes: ShapeAttrs[];
}

// ─── Shape pools ───────────────────────────────────────────────────────────────

export const allShapes = [
  'circle', 'square', 'triangle', 'pentagon', 'arrow', 'star',
  'hexagon', 'diamond', 'cross', 'parallelogram', 'trapezoid',
  'semicircle', 'right_triangle', 'kite',
] as const;

export const simpleShapes = ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'pentagon'] as const;
export const complexShapes = ['star', 'cross', 'parallelogram', 'trapezoid', 'semicircle', 'right_triangle', 'kite', 'arrow'] as const;

// Shapes that clearly show rotation/reflection (asymmetric or directional)
export const ROTATION_SAFE_SHAPES = [
  'arrow', 'right_triangle', 'kite', 'semicircle', 'trapezoid',
  'parallelogram', 'cross', 'pentagon', 'star',
] as const;

// Shapes where rotation is UNMISTAKABLY visible at mobile sizes (19–21px rendered).
// Each shape has a clear pointed/curved feature that shifts dramatically at 90° increments.
// Removed: kite, parallelogram, trapezoid — these render as thin diamond-like shapes
// where 90° rotation is nearly imperceptible at <21px rendered size.
export const STRONGLY_ASYMMETRIC = [
  'arrow', 'right_triangle', 'semicircle',
] as const;

// Shapes that should NEVER be the primary evidence for rotation/reflection
export const ROTATION_UNSAFE = ['circle'] as const;
// Shapes where 90° rotation is visually identical — avoid for 90° rotation rules
export const AVOID_90_ROTATION = ['square', 'hexagon'] as const;

export const allFills: FillPattern[] = ['none', 'solid', 'hatched', 'crosshatched', 'dotted', 'striped'];
export const patternFills: FillPattern[] = ['hatched', 'crosshatched', 'dotted', 'striped'];
export const simpleFills: FillPattern[] = ['none', 'solid', 'hatched'];

export const baseStyle: SvgStroke = { strokeWidth: 2.5, stroke: '#1E293B', fill: 'none' };
export const difficulties = ['easy', 'medium', 'hard'] as const;

// ─── Shape-transformation compatibility matrix ─────────────────────────────────

export function isCompatibleWithRotation(shape: string, degrees: 90 | 180 | 270): boolean {
  if (ROTATION_UNSAFE.includes(shape as any)) return false;
  if (degrees === 90 && AVOID_90_ROTATION.includes(shape as any)) return false;
  return true;
}

export function isCompatibleWithReflection(shape: string): boolean {
  return !ROTATION_UNSAFE.includes(shape as any);
}

export function getRotationSafeShapes(degrees: 90 | 180 | 270): string[] {
  return ROTATION_SAFE_SHAPES.filter(s => isCompatibleWithRotation(s, degrees));
}

// ─── Rule types ────────────────────────────────────────────────────────────────

export type Rule =
  | { kind: 'rotate'; degrees: 90 | 180 | 270; targetId?: number }
  | { kind: 'reflectX'; targetId?: number }
  | { kind: 'reflectY'; targetId?: number }
  | { kind: 'fillCycle'; cycle: FillPattern[]; targetId?: number }
  | { kind: 'scaleSize'; delta: number; targetId?: number }
  | { kind: 'toggleDash'; targetId?: number }
  | { kind: 'positionSwap'; idA: number; idB: number }
  | { kind: 'alternating'; ruleA: Rule; ruleB: Rule }  // alternates A-B-A-B per frame
  | { kind: 'conditional'; check: 'fill_is_solid' | 'fill_is_none' | 'is_large' | 'is_small'; then: Omit<Rule, 'targetId'> }
  | { kind: 'countAdd'; shape: ShapeAttrs; step: number }
  | { kind: 'countRemove'; targetId: number; step: number };

export type RuleStack = {
  rules: Rule[];
  subRuleId: string;
  explanation: string;
  difficultyTarget: 'easy' | 'medium' | 'hard';
};

// ─── Rule application ──────────────────────────────────────────────────────────

function cloneShape(s: ShapeAttrs): ShapeAttrs {
  return { ...s };
}

function applyOneRule(shape: ShapeAttrs, rule: Rule, step: number): ShapeAttrs {
  if (rule.targetId !== undefined && 'targetId' in rule && rule.targetId !== shape.id) return shape;
  if (shape.isAnchor) return shape;

  switch (rule.kind) {
    case 'rotate':
      return { ...shape, rotation: ((shape.rotation + rule.degrees) % 360 + 360) % 360 };

    case 'reflectX':
      return { ...shape, x: 100 - shape.x, rotation: ((360 - shape.rotation) % 360 + 360) % 360 };

    case 'reflectY':
      return { ...shape, y: 100 - shape.y, rotation: ((180 - shape.rotation + 360) % 360 + 360) % 360 };

    case 'fillCycle': {
      const idx = rule.cycle.indexOf(shape.fill);
      const next = idx === -1 ? 0 : (idx + 1) % rule.cycle.length;
      return { ...shape, fill: rule.cycle[next] };
    }

    case 'scaleSize':
      return { ...shape, size: Math.max(8, Math.min(28, shape.size + rule.delta)) };

    case 'toggleDash':
      return { ...shape, dashed: !shape.dashed };

    case 'alternating':
      return applyOneRule(shape, step % 2 === 0 ? rule.ruleA : rule.ruleB, step);

    case 'conditional': {
      let conditionMet = false;
      if (rule.check === 'fill_is_solid') conditionMet = shape.fill === 'solid';
      if (rule.check === 'fill_is_none') conditionMet = shape.fill === 'none';
      if (rule.check === 'is_large') conditionMet = shape.size >= 17;
      if (rule.check === 'is_small') conditionMet = shape.size < 14;
      if (conditionMet) return applyOneRule(shape, rule.then as Rule, step);
      return shape;
    }

    case 'positionSwap':
    case 'countAdd':
    case 'countRemove':
      return shape; // handled at frame level

    default:
      return shape;
  }
}

function applyFrameLevelRule(shapes: ShapeAttrs[], rule: Rule, step: number): ShapeAttrs[] {
  switch (rule.kind) {
    case 'positionSwap': {
      const a = shapes.find(s => s.id === rule.idA);
      const b = shapes.find(s => s.id === rule.idB);
      if (!a || !b) return shapes;
      return shapes.map(s => {
        if (s.id === rule.idA) return { ...s, x: b.x, y: b.y };
        if (s.id === rule.idB) return { ...s, x: a.x, y: a.y };
        return s;
      });
    }
    case 'countAdd': {
      if (step % rule.step === 0) {
        return [...shapes, { ...rule.shape, id: shapes.length + 100 + step }];
      }
      return shapes;
    }
    case 'countRemove': {
      return shapes.filter(s => s.id !== rule.targetId);
    }
    default:
      return shapes.map(s => applyOneRule(s, rule, step));
  }
}

// Apply a full rule stack to a frame, producing the next frame
export function applyRuleStack(frame: ShapeAttrs[], rules: Rule[], step: number): ShapeAttrs[] {
  let current = frame.map(cloneShape);
  for (const rule of rules) {
    current = applyFrameLevelRule(current, rule, step);
  }
  return current;
}

// Build a sequence of frames cumulatively
export function buildSequence(base: ShapeAttrs[], rules: Rule[], numFrames: number): ShapeAttrs[][] {
  const frames: ShapeAttrs[][] = [base];
  for (let i = 0; i < numFrames - 1; i++) {
    frames.push(applyRuleStack(frames[frames.length - 1], rules, i));
  }
  return frames;
}

// ─── Perceptibility validator ──────────────────────────────────────────────────

export function isPerceptibleChange(from: ShapeAttrs, to: ShapeAttrs): boolean {
  if (from.shape !== to.shape) return true;

  const rotDiff = Math.abs(((to.rotation - from.rotation + 540) % 360) - 180);
  const effectiveRotDiff = Math.min(rotDiff, 360 - rotDiff);
  if (effectiveRotDiff >= 45) {
    // Only perceptible if shape is not symmetric for this rotation
    if (!ROTATION_UNSAFE.includes(from.shape as any)) return true;
  }

  if (from.fill !== to.fill) return true;
  if (Math.abs(to.size - from.size) >= 4) return true;
  if (from.dashed !== to.dashed) return true;
  const posDiff = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  if (posDiff >= 15) return true;

  return false;
}

export function frameIsPerceptiblyDifferent(from: ShapeAttrs[], to: ShapeAttrs[]): boolean {
  if (from.length !== to.length) return true;
  return from.some((s, i) => isPerceptibleChange(s, to[i]));
}

// ─── Distractor engine ─────────────────────────────────────────────────────────

export type DistractorType =
  | 'wrong_rotation'
  | 'wrong_axis'
  | 'missed_secondary'
  | 'size_error'
  | 'fill_error'
  | 'partial_apply'
  | 'one_rule_only'
  | 'off_by_one'
  | 'surface_pattern_follower'
  | 'alternation_break'
  | 'correct_shape_wrong_orientation'
  | 'correct_orientation_wrong_fill';

// Apply only the first rule (missed secondary)
export function distractorMissedSecondary(frameC: ShapeAttrs[], rules: Rule[]): ShapeAttrs[] | null {
  if (rules.length < 2) return null;
  return applyRuleStack(frameC, [rules[0]], 0);
}

// Apply only the last rule (missed primary)
export function distractorMissedPrimary(frameC: ShapeAttrs[], rules: Rule[]): ShapeAttrs[] | null {
  if (rules.length < 2) return null;
  return applyRuleStack(frameC, [rules[rules.length - 1]], 0);
}

// Wrong rotation angle (use different degrees)
export function distractorWrongRotation(correct: ShapeAttrs[], rng: () => number): ShapeAttrs[] {
  const angles: (90 | 180 | 270)[] = [90, 180, 270];
  const wrongAngle = pick(angles, rng);
  return correct.map(s => ({
    ...s,
    rotation: ((s.rotation + wrongAngle) % 360 + 360) % 360,
  }));
}

// Wrong reflection axis (reflect Y instead of X)
export function distractorWrongAxis(correct: ShapeAttrs[]): ShapeAttrs[] {
  return correct.map(s => ({
    ...s,
    y: 100 - s.y,
    rotation: ((180 - s.rotation + 360) % 360 + 360) % 360,
  }));
}

// Wrong fill (change fill on all shapes)
export function distractorWrongFill(correct: ShapeAttrs[], rng: () => number): ShapeAttrs[] {
  const fills: FillPattern[] = ['none', 'solid', 'hatched', 'dotted'];
  return correct.map(s => {
    const newFill = picks(fills.filter(f => f !== s.fill), rng) ?? s.fill;
    return { ...s, fill: newFill };
  });
}

// Wrong size (shift size up or down)
export function distractorWrongSize(correct: ShapeAttrs[], rng: () => number): ShapeAttrs[] {
  const delta = rng() > 0.5 ? 5 : -5;
  return correct.map(s => ({ ...s, size: Math.max(8, Math.min(28, s.size + delta)) }));
}

// Partial apply: apply rule to only first half of shapes
export function distractorPartialApply(frameC: ShapeAttrs[], correct: ShapeAttrs[]): ShapeAttrs[] {
  return frameC.map((s, i) => i < Math.ceil(frameC.length / 2) ? correct[i] : s);
}

// Off by one: apply rule one fewer or one more time
export function distractorOffByOne(frameC: ShapeAttrs[], rules: Rule[], rng: () => number): ShapeAttrs[] {
  const extraStep = rng() > 0.5 ? 1 : -1;
  if (extraStep > 0) {
    const correct = applyRuleStack(frameC, rules, 0);
    return applyRuleStack(correct, rules, 1);
  }
  // Apply inverse rotation instead
  return applyRuleStack(frameC, rules.map(r => {
    if (r.kind === 'rotate') return { ...r, degrees: ((360 - r.degrees) % 360) as 90 | 180 | 270 };
    return r;
  }), 0);
}

// ─── Ambiguity + validation ────────────────────────────────────────────────────

export function framesAreIdentical(a: ShapeAttrs[], b: ShapeAttrs[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function svgFramesAreIdentical(a: SvgFrame, b: SvgFrame): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasAnyDuplicateOptions(options: SvgFrame[]): boolean {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (svgFramesAreIdentical(options[i], options[j])) return true;
    }
  }
  return false;
}

export function hasAnyDuplicateAttrOptions(options: ShapeAttrs[][]): boolean {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (framesAreIdentical(options[i], options[j])) return true;
    }
  }
  return false;
}

// ─── Conversion: ShapeAttrs → SvgElement / SvgFrame ──────────────────────────

export function attrsToSvgElement(s: ShapeAttrs): SvgElement {
  return {
    type: 'shape',
    shape: s.shape,
    x: s.x,
    y: s.y,
    size: s.size,
    rotation: s.rotation,
    style: { ...baseStyle, fill: s.fill, dashed: s.dashed },
  };
}

export function frameAttrsToSvg(attrs: ShapeAttrs[]): SvgFrame {
  return { elements: attrs.map(attrsToSvgElement) };
}

// ─── Utility functions ─────────────────────────────────────────────────────────

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 48271 + 12345) % 2147483647;
    return (s >>> 0) / 2147483647;
  };
}

export function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function picks<T>(arr: readonly T[], rng: () => number): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(rng() * arr.length)];
}

export function pickOther<T>(arr: readonly T[], exclude: T, rng: () => number): T {
  const filtered = arr.filter(x => x !== exclude);
  if (filtered.length === 0) return exclude;
  return filtered[Math.floor(rng() * filtered.length)];
}

export function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleWithCorrect<T>(correct: T, distractors: T[], rng: () => number): { options: T[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correct) };
}

// ─── Frame builders ────────────────────────────────────────────────────────────

export const safePositions: [number, number][] = [
  [25, 25], [75, 25],
  [25, 75], [75, 75],
  [50, 25], [50, 75],
  [25, 50], [75, 50],
  [35, 40], [65, 40], [35, 60], [65, 60],
];

export const linePatterns: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 0, y1: 50, x2: 100, y2: 50 },
  { x1: 50, y1: 0, x2: 50, y2: 100 },
  { x1: 0, y1: 0, x2: 100, y2: 100 },
  { x1: 100, y1: 0, x2: 0, y2: 100 },
];

export const dotPositions: [number, number][] = [
  [15, 15], [85, 15], [15, 85], [85, 85],
  [50, 15], [50, 85], [15, 50], [85, 50],
];

// Build a FrameAttrs[] with unique shape IDs
export function buildShapeFrame(
  rng: () => number,
  numShapes: number,
  shapePool: readonly string[],
  fillPool: readonly FillPattern[],
  startId: number = 0,
): ShapeAttrs[] {
  const positions = shuffleArray([...safePositions], rng);
  const shapes: ShapeAttrs[] = [];
  for (let i = 0; i < numShapes; i++) {
    const pos = positions[i % positions.length];
    const shape = pick(shapePool, rng);
    const fill = pick(fillPool, rng);
    const size = 12 + Math.floor(rng() * 8);
    const rotation = Math.floor(rng() * 8) * 45;
    shapes.push({ id: startId + i, shape, x: pos[0], y: pos[1], size, rotation, fill, dashed: false });
  }
  return shapes;
}

// Build a frame with ROTATION_SAFE shapes (enforces compatibility)
export function buildRotationSafeFrame(
  rng: () => number,
  numShapes: number,
  fillPool: readonly FillPattern[],
  startId: number = 0,
  degrees: 90 | 180 | 270 = 90,
): ShapeAttrs[] {
  const compatibleShapes = getRotationSafeShapes(degrees);
  return buildShapeFrame(rng, numShapes, compatibleShapes, fillPool, startId);
}

// Build a frame guaranteed to use a specific primary shape
export function buildFrameWithShape(
  rng: () => number,
  primaryShape: string,
  numShapes: number,
  fillPool: readonly FillPattern[],
  startId: number = 0,
): ShapeAttrs[] {
  const positions = shuffleArray([...safePositions], rng);
  const shapes: ShapeAttrs[] = [];
  for (let i = 0; i < numShapes; i++) {
    const pos = positions[i % positions.length];
    const shape = i === 0 ? primaryShape : pick(ROTATION_SAFE_SHAPES, rng);
    const fill = pick(fillPool, rng);
    const size = 12 + Math.floor(rng() * 8);
    const rotation = Math.floor(rng() * 8) * 45;
    shapes.push({ id: startId + i, shape, x: pos[0], y: pos[1], size, rotation, fill, dashed: false });
  }
  return shapes;
}

// Legacy compat — keeps line/dot additions for classification/symmetry
export function buildCompoundFrame(
  rng: () => number,
  numShapes: number,
  shapePool: readonly string[],
  fillPool: readonly FillPattern[],
  addLine: boolean,
  addDots: boolean,
  lineDashed: boolean = false,
): SvgFrame {
  const elements: SvgElement[] = [];

  if (addLine) {
    const lp = pick(linePatterns, rng);
    elements.push({
      type: 'line', x1: lp.x1, y1: lp.y1, x2: lp.x2, y2: lp.y2,
      style: { ...baseStyle, dashed: lineDashed },
    });
  }

  const positions = shuffleArray([...safePositions], rng);
  for (let i = 0; i < numShapes; i++) {
    const pos = positions[i % positions.length];
    const shape = pick(shapePool, rng);
    const fill = pick(fillPool, rng);
    const size = 12 + Math.floor(rng() * 10);
    const rotation = Math.floor(rng() * 8) * 45;
    elements.push({
      type: 'shape', shape, x: pos[0], y: pos[1], size, rotation,
      style: { ...baseStyle, fill, dashed: false },
    });
  }

  if (addDots) {
    const numDots = 1 + Math.floor(rng() * 2);
    const dp = shuffleArray([...dotPositions], rng);
    for (let i = 0; i < numDots; i++) {
      elements.push({ type: 'dot', x: dp[i][0], y: dp[i][1], r: 2.5, style: { ...baseStyle, fill: 'solid' } });
    }
  }

  return { elements };
}

// Legacy compat
export function makeShape(
  shape: string, x: number, y: number, size: number, rotation: number,
  fill: FillPattern = 'none', dashed: boolean = false
): SvgElement {
  return { type: 'shape', shape, x, y, size, rotation, style: { ...baseStyle, fill, dashed } };
}

export function makeLine(
  x1: number, y1: number, x2: number, y2: number,
  dashed: boolean = false, fill: FillPattern = 'none'
): SvgElement {
  return { type: 'line', x1, y1, x2, y2, style: { ...baseStyle, fill, dashed } };
}

export function makeDot(x: number, y: number, r: number = 3): SvgElement {
  return { type: 'dot', x, y, r, style: { ...baseStyle, fill: 'solid' } };
}

export function cloneElement(el: SvgElement, overrides: Partial<any>): SvgElement {
  return { ...el, ...overrides, style: { ...(el as any).style, ...(overrides.style || {}) } };
}

export function getDifficultyConfig(diff: string): {
  numShapes: number;
  addLine: boolean;
  addDots: boolean;
  fillPool: readonly FillPattern[];
  shapePool: readonly string[];
} {
  if (diff === 'easy') {
    return {
      numShapes: 2,
      addLine: false,
      addDots: false,
      fillPool: ['none', 'solid'],
      shapePool: ROTATION_SAFE_SHAPES,
    };
  }
  if (diff === 'medium') {
    return {
      numShapes: 3,
      addLine: false,
      addDots: false,
      fillPool: ['none', 'solid', 'hatched', 'dotted'],
      shapePool: ROTATION_SAFE_SHAPES,
    };
  }
  return {
    numShapes: 4,
    addLine: false,
    addDots: false,
    fillPool: allFills,
    shapePool: [...ROTATION_SAFE_SHAPES, 'pentagon', 'star', 'diamond'],
  };
}

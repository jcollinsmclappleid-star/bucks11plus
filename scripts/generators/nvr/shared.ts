import type { GeneratedQuestion } from '../types';

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

export const allShapes = [
  'circle', 'square', 'triangle', 'pentagon', 'arrow', 'star',
  'hexagon', 'diamond', 'cross', 'parallelogram', 'trapezoid',
  'semicircle', 'right_triangle', 'kite',
] as const;

export const simpleShapes = ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'pentagon'] as const;
export const complexShapes = ['star', 'cross', 'parallelogram', 'trapezoid', 'semicircle', 'right_triangle', 'kite', 'arrow'] as const;

export const allFills: FillPattern[] = ['none', 'solid', 'hatched', 'crosshatched', 'dotted', 'striped'];
export const patternFills: FillPattern[] = ['hatched', 'crosshatched', 'dotted', 'striped'];

export const baseStyle: SvgStroke = { strokeWidth: 2.5, stroke: '#1E293B', fill: 'none' };

export const difficulties = ['easy', 'medium', 'hard'] as const;

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

export function makeShape(
  shape: string, x: number, y: number, size: number, rotation: number,
  fill: FillPattern = 'none', dashed: boolean = false
): SvgElement {
  return {
    type: 'shape', shape, x, y, size, rotation,
    style: { ...baseStyle, fill, dashed },
  };
}

export function makeLine(
  x1: number, y1: number, x2: number, y2: number,
  dashed: boolean = false, fill: FillPattern = 'none'
): SvgElement {
  return {
    type: 'line', x1, y1, x2, y2,
    style: { ...baseStyle, fill, dashed },
  };
}

export function makeDot(x: number, y: number, r: number = 3): SvgElement {
  return {
    type: 'dot', x, y, r,
    style: { ...baseStyle, fill: 'solid' },
  };
}

export function cloneElement(el: SvgElement, overrides: Partial<any>): SvgElement {
  if (el.type === 'shape') {
    return { ...el, ...overrides, style: { ...el.style, ...(overrides.style || {}) } };
  }
  if (el.type === 'line') {
    return { ...el, ...overrides, style: { ...el.style, ...(overrides.style || {}) } };
  }
  return { ...el, ...overrides, style: { ...el.style, ...(overrides.style || {}) } };
}

export function framesAreIdentical(a: SvgFrame, b: SvgFrame): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasAnyDuplicateOptions(options: SvgFrame[]): boolean {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (framesAreIdentical(options[i], options[j])) return true;
    }
  }
  return false;
}

export const safePositions: [number, number][] = [
  [25, 25], [50, 25], [75, 25],
  [25, 50], [50, 50], [75, 50],
  [25, 75], [50, 75], [75, 75],
  [35, 35], [65, 35], [35, 65], [65, 65],
];

export const linePatterns: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 0, y1: 50, x2: 100, y2: 50 },
  { x1: 50, y1: 0, x2: 50, y2: 100 },
  { x1: 0, y1: 0, x2: 100, y2: 100 },
  { x1: 100, y1: 0, x2: 0, y2: 100 },
  { x1: 25, y1: 0, x2: 25, y2: 100 },
  { x1: 75, y1: 0, x2: 75, y2: 100 },
  { x1: 0, y1: 25, x2: 100, y2: 25 },
  { x1: 0, y1: 75, x2: 100, y2: 75 },
];

export const dotPositions: [number, number][] = [
  [15, 15], [85, 15], [15, 85], [85, 85],
  [50, 15], [50, 85], [15, 50], [85, 50],
  [50, 50],
];

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
    elements.push(makeLine(lp.x1, lp.y1, lp.x2, lp.y2, lineDashed));
  }

  const positions = shuffleArray([...safePositions], rng);
  for (let i = 0; i < numShapes; i++) {
    const pos = positions[i % positions.length];
    const shape = pick(shapePool, rng);
    const fill = pick(fillPool, rng);
    const size = 12 + Math.floor(rng() * 10);
    const rotation = Math.floor(rng() * 8) * 45;
    elements.push(makeShape(shape, pos[0], pos[1], size, rotation, fill));
  }

  if (addDots) {
    const numDots = 1 + Math.floor(rng() * 3);
    const dp = shuffleArray([...dotPositions], rng);
    for (let i = 0; i < numDots; i++) {
      elements.push(makeDot(dp[i][0], dp[i][1], 2 + rng() * 2));
    }
  }

  return { elements };
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
      shapePool: simpleShapes,
    };
  }
  if (diff === 'medium') {
    return {
      numShapes: 3,
      addLine: true,
      addDots: false,
      fillPool: ['none', 'solid', 'hatched', 'dotted'],
      shapePool: [...simpleShapes, ...complexShapes.slice(0, 3)],
    };
  }
  return {
    numShapes: 4,
    addLine: true,
    addDots: true,
    fillPool: allFills,
    shapePool: allShapes,
  };
}

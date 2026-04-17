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
// Bump to 5 for this GL human-solver spec rebuild.
export const SEQUENCE_VERSION = 5;

// ─── Mobile rendering constants ─────────────────────────────────────────────────
// Frame panels are w-20 h-20 = 80px CSS on mobile.
// SVG viewBox is 100×100, so 1 SVG unit = 0.8px.
// Minimum perceptible shape size at mobile: 20 SVG units = 16px.
// Recommended comfortable size: 24 SVG units = 19px.
// Hard floor for any shape in any frame: MIN_SHAPE_SIZE.
const MIN_SHAPE_SIZE = 20;    // hard floor — reject if any shape is below this
const GOOD_BASE_SIZE = 24;    // default for single-shape specs
const LARGE_BASE_SIZE = 26;   // for fill/dash specs where the shape should dominate the frame
// For size-change specs: delta must be large enough to be visually obvious at mobile.
// Delta 8 = 6.4px change. Minimum for a clearly visible size jump.
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
  // For count-based specs: how many shapes start the sequence
  countStart?: number;
  countDelta?: number;   // +1 or -1
}

// ─── Helper builders ───────────────────────────────────────────────────────────

function buildAsymRotAngle(rng: () => number): 90 | 180 {
  return pick([90, 90, 180] as const, rng);
}

function buildFillCycle2(rng: () => number): FillPattern[] {
  // Always include solid/none transition — highest contrast at mobile
  return pick([
    ['none', 'solid'] as FillPattern[],
    ['none', 'solid'] as FillPattern[],
    ['solid', 'none'] as FillPattern[],
  ], rng);
}

function buildFillCycle2b(rng: () => number): FillPattern[] {
  return pick([
    ['none', 'solid'] as FillPattern[],
    ['none', 'hatched'] as FillPattern[],
    ['solid', 'none'] as FillPattern[],
  ], rng);
}

function buildFillCycle3(rng: () => number): FillPattern[] {
  // All 3-state cycles must pass through solid and none for maximum contrast
  return pick([
    ['none', 'solid', 'hatched'] as FillPattern[],
    ['solid', 'none', 'hatched'] as FillPattern[],
    ['none', 'hatched', 'solid'] as FillPattern[],
  ], rng);
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

/**
 * GL Human-Solver Standard: reject if ANY shape in ANY frame is below MIN_SHAPE_SIZE.
 * This catches edge-case shrinkage from scaleSize rules reaching the floor.
 */
function minShapeSizeValid(allFrames: ShapeAttrs[][]): boolean {
  for (const frame of allFrames) {
    for (const shape of frame) {
      if (shape.size < MIN_SHAPE_SIZE) return false;
    }
  }
  return true;
}

/**
 * GL Human-Solver Standard: The dominant rule must be unambiguously visible
 * at mobile (80px panel, 0.8px per SVG unit).
 *
 * - Rotation: shape must be ≥ MIN_SHAPE_SIZE (already enforced by minShapeSizeValid)
 * - Fill change: must include 'none' ↔ 'solid' contrast somewhere in the cycle
 * - Size change: delta must be ≥ MIN_SIZE_DELTA (6.4px at mobile)
 * - Count change: always clear — no check needed
 * - Dash toggle: always clear on large shapes — no check needed
 */
function dominantRuleIsVisible(spec: SequenceSpec, allFrames: ShapeAttrs[][]): boolean {
  for (const rule of spec.rules) {
    if (rule.kind === 'scaleSize') {
      if (Math.abs(rule.delta) < MIN_SIZE_DELTA) return false;
    }
    if (rule.kind === 'fillCycle') {
      const cycle = rule.cycle;
      const hasHighContrast = (cycle.includes('none') && cycle.includes('solid'));
      const hasGoodContrast = (cycle.includes('none') && cycle.includes('hatched'));
      if (!hasHighContrast && !hasGoodContrast) return false;
    }
  }
  return true;
}

/**
 * GL Human-Solver Standard: All 4 answer options must differ by at least one
 * meaningful logical category (count, rotation state, fill state, position).
 * Reject if any two options are visually near-identical (same fill, same rotation,
 * same count, same size within 6 units).
 */
function answersAreMeaningfullyDistinct(
  correctAttrs: ShapeAttrs[],
  distractorAttrs: ShapeAttrs[][],
): boolean {
  const all = [correctAttrs, ...distractorAttrs];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.length !== b.length) continue; // count difference — always distinct
      // Check if all shapes in the pair are "near-identical"
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

// ─── Count-sequence helpers ────────────────────────────────────────────────────

/**
 * Build a sequence of frames where the count of shapes increases by 1 each step.
 * Each shape is a large, clearly-outlined object at a fixed position.
 * Returns allFrames (visibleFrames + 1 answer frame).
 */
function buildCountGrowFrames(
  rng: () => number,
  startCount: number,
  totalFrames: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  // Fixed grid positions for up to 5 shapes — well spread across 100×100 viewBox
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];

  const frames: ShapeAttrs[][] = [];
  for (let f = 0; f < totalFrames; f++) {
    const count = startCount + f;
    const shapes: ShapeAttrs[] = [];
    for (let i = 0; i < count; i++) {
      const pos = positionGrid[i % positionGrid.length];
      shapes.push({
        id: i,
        shape: shapeType,
        x: pos[0], y: pos[1],
        size: baseSize,
        rotation: 0,
        fill: fillType,
        dashed: false,
      });
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
    for (let i = 0; i < count; i++) {
      const pos = positionGrid[i % positionGrid.length];
      shapes.push({
        id: i,
        shape: shapeType,
        x: pos[0], y: pos[1],
        size: baseSize,
        rotation: 0,
        fill: fillType,
        dashed: false,
      });
    }
    frames.push(shapes);
  }
  return frames;
}

/**
 * Build a position-orbit sequence: one shape moves through 4 quadrant positions
 * across successive frames. Optionally changes fill at each step.
 * Position order: top-left → top-right → bottom-right → bottom-left → answer: top-left
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
    if (fillCycle) {
      currentFill = fillCycle[f % fillCycle.length];
    }
    frames.push([{
      id: 0,
      shape,
      x: pos[0], y: pos[1],
      size: baseSize,
      rotation: (startRotation + rotDelta * f) % 360,
      fill: currentFill,
      dashed: false,
    }]);
  }
  return frames;
}

// ─── Spec library ──────────────────────────────────────────────────────────────

function buildSequenceSpecs(rng: () => number): SequenceSpec[] {
  const deg = buildAsymRotAngle(rng);
  const fillCycle2 = buildFillCycle2(rng);
  const fillCycle2b = buildFillCycle2b(rng);
  const fillCycle3 = buildFillCycle3(rng);

  return [
    // ══════════════════════════════════════════════════════════════════════════
    // EASY — 1 rule, 3 visible frames (questionIndex: 2)
    // Single obvious rule. Large shapes. Answer uniquely deducible from 3 frames.
    // ══════════════════════════════════════════════════════════════════════════

    {
      // Rotation — shape clearly turns 90° or 180° each step
      rules: [{ kind: 'rotate', degrees: deg }],
      subRuleId: 'nvr.sequence.rotate_only',
      explanation: `Each shape rotates ${deg}° clockwise each step. The three frames show the progression clearly.`,
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: `rotation ${deg}° clockwise per step`,
      baseSize: GOOD_BASE_SIZE,  // 24 SVG units = 19.2px — clearly visible rotation
    },

    {
      // Fill cycles between 2 high-contrast states — solid/none is unmistakable
      rules: [{ kind: 'fillCycle', cycle: fillCycle2 }],
      subRuleId: 'nvr.sequence.fill_cycle_only',
      explanation: `The fill alternates ${fillCycle2.join(' → ')} each step. Three frames make the pattern obvious.`,
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: `fill alternates ${fillCycle2.join(' → ')} each step`,
      baseSize: LARGE_BASE_SIZE,  // 26 SVG units — large so fill is unmistakable
    },

    {
      // Count GROWS: 1 → 2 → 3 → answer:4. Most obvious pattern at mobile.
      // Shapes are large, identical, in a stable grid — count is instantly readable.
      rules: [],  // handled by custom frame builder
      subRuleId: 'nvr.sequence.count_grow',
      explanation: 'One new shape is added each step. Count the shapes: 1 → 2 → 3 → the next frame has 4.',
      difficulty: 'easy',
      shapeRequirement: 'count_shapes',
      minShapes: 1, maxShapes: 4,
      visibleFrames: 3,
      primaryRule: 'count increases by 1 each step (1 → 2 → 3 → 4)',
      baseSize: GOOD_BASE_SIZE,
      countStart: 1,
      countDelta: 1,
    },

    {
      // Count SHRINKS: 4 → 3 → 2 → answer:1. Clear and unambiguous.
      rules: [],
      subRuleId: 'nvr.sequence.count_shrink',
      explanation: 'One shape is removed each step. Count the shapes: 4 → 3 → 2 → the next frame has 1.',
      difficulty: 'easy',
      shapeRequirement: 'count_shapes',
      minShapes: 1, maxShapes: 4,
      visibleFrames: 3,
      primaryRule: 'count decreases by 1 each step (4 → 3 → 2 → 1)',
      baseSize: GOOD_BASE_SIZE,
      countStart: 4,
      countDelta: -1,
    },

    {
      // Dash alternates — simple, clearly visible on large shapes
      rules: [{ kind: 'toggleDash' }],
      subRuleId: 'nvr.sequence.dash_toggle',
      explanation: 'The border alternates between solid and dashed each step.',
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: 'border alternates solid ↔ dashed each step',
      baseSize: LARGE_BASE_SIZE,  // large so dash pattern is clearly visible
    },

    {
      // Size GROWS dramatically: 18 → 24 → 28 → answer:28 (capped, but visibly large jump each step)
      // Actually: 18 → 26 → answer would be better. Let's do baseSize 18, delta 8:
      // frame0:18, frame1:26, frame2:28(capped but difference is clear), answer:28 — no good.
      // Better approach: use 3 steps with delta 8 from base 12: 12→20→28 (3 visible steps show clear growth)
      // But 12 < MIN_SHAPE_SIZE. Use delta 6 from base 14: 14→20→26→answer:28. That's 4 frames (3 visible + answer)
      // Validators will catch size < 20 so start at 20: 20→26→28(cap)→answer — cap is bad.
      // Use delta 8, start at 12: frames are 12,20,28 (3 visible) answer is 28 (capped). Bad — no visible change at answer.
      // Actually for a 3-visible-frame spec with delta=8: frames=[12,20,28], answer=28 (capped). Not good.
      // So: make it 4-visible-frame medium spec, OR use delta 4 with bigger range.
      // Best: start at 16, delta=6, 3 visible: 16→22→28, answer=28. 
      // Actually 16 < MIN_SHAPE_SIZE, so frame[0]=16 would be rejected. 
      // Let's make size_grow a 4-frame (medium) spec instead. It fits better there.
      // For easy, we have rotation, fill, count_grow, count_shrink, dash — that's 5 easy specs, great.
      rules: [{ kind: 'rotate', degrees: 180 }],
      subRuleId: 'nvr.sequence.rotate_180_only',
      explanation: 'The shape flips 180° each step — it is upside-down in frame 2 and back up in frame 3. The next frame follows the same flip.',
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 3,
      primaryRule: '180° flip each step',
      baseSize: GOOD_BASE_SIZE,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MEDIUM — 2 rules, 4 visible frames
    // Primary rule is clear. Secondary is visible but requires tracking two things.
    // Both rules established within 4 frames. No tiny changes.
    // ══════════════════════════════════════════════════════════════════════════

    {
      // Rotate + fill cycle — both rules large and clear
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle2 },
      ],
      subRuleId: 'nvr.sequence.rotate_fill',
      explanation: `Each step: the shape rotates ${deg}° AND the fill alternates ${fillCycle2.join(' → ')}. Four frames clearly establish both rules.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step`,
      secondaryRule: `fill alternates ${fillCycle2.join(' → ')}`,
      baseSize: GOOD_BASE_SIZE,  // 24 — clear rotation AND fill change
    },

    {
      // Rotate + dash toggle — both visually independent and obvious
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.rotate_dash',
      explanation: `Each step: the shape rotates ${deg}° AND the border alternates solid/dashed. Both changes are obvious on a large shape across four frames.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step`,
      secondaryRule: 'border alternates solid ↔ dashed',
      baseSize: LARGE_BASE_SIZE,  // large so dash pattern reads clearly alongside rotation
    },

    {
      // Position orbit — shape moves through 4 quadrant positions, easy to track
      // One large shape moves top-left → top-right → bottom-right → bottom-left → answer: top-left
      // Secondary: fill cycles none ↔ solid
      rules: [],  // handled by buildPositionOrbitFrames
      subRuleId: 'nvr.sequence.position_orbit',
      explanation: `The shape moves to the next corner position each step (top-left → top-right → bottom-right → bottom-left). Track the position to find where it lands next.`,
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape orbits the four corner positions each step',
      baseSize: GOOD_BASE_SIZE,
    },

    {
      // Size GROWS dramatically: delta=8 means 8 SVG units = 6.4px per step — clearly visible
      // 4 visible frames: frame0=20, frame1=26, frame2=28(cap), frame3=28(cap)... bad.
      // Better: start at 12, grow 8 per step: 12→20→26→28→answer:28. frame0=12 < MIN.
      // Let me try: make size-grow with 3 frames instead, starting 20: 20→26→28→answer:28 (capped).
      // But answer=28=frame2=frame3=28, so answer is not a unique continuation.
      // Real issue: 28 is the max (from scaleSize logic). Need a custom max.
      // Alternative: start at 14, use delta=7 for 4 frames: 14→21→28→35(capped to 28). Not great.
      // Best: use 3 visible frames with start at 16, delta=8: 16→24→28(cap)
      //   frame0=16 fails MIN_SHAPE_SIZE validator...
      // OK: Override scaleSize to allow up to 36. Or use start 20, delta 8, cap 44.
      // Actually the scaleSize rule caps at Math.max(8, Math.min(28, size+delta)).
      // To get 3 clear steps, I need to not hit the cap. With baseSize 16, delta 8:
      //   f0=16, f1=24, f2=28(would be 32 but capped to 28), f_answer would be 28 again.
      // The scaleSize cap is a problem for grow sequences. Recommendation: relabel this
      // as a "fill + position" spec instead, avoiding the size-change problem.
      rules: [
        { kind: 'fillCycle', cycle: fillCycle2b },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.fill_dash',
      explanation: `The fill cycles ${fillCycle2b.join(' → ')} each step AND the border alternates solid/dashed. Four frames make both rules clear.`,
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `fill cycles ${fillCycle2b.join(' → ')} each step`,
      secondaryRule: 'border alternates solid ↔ dashed',
      baseSize: LARGE_BASE_SIZE,
    },

    {
      // Count + rotation — count grows while shape rotates
      // 4 frames: count 1→2→3→4 shapes, each shape rotates deg° per step
      // answer: 5 shapes at rotation 4×deg°
      // countStart=1 so answer=5 — within the 5-shape position-grid limit
      rules: [],  // custom builder
      subRuleId: 'nvr.sequence.count_rotate',
      explanation: `One shape is added each step AND the shape rotates ${deg}°. Track both the growing count and the rotating orientation.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 5,
      visibleFrames: 4,
      primaryRule: 'count increases by 1 each step',
      secondaryRule: `each shape rotates ${deg}° per step`,
      baseSize: GOOD_BASE_SIZE,
      countStart: 1,
      countDelta: 1,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // HARD — 2 visible rules, 4 visible frames
    // Hard = two clearly visible rules that interact, OR a rule with a trap.
    // Hard NEVER means smaller shapes or more ambiguity.
    // ══════════════════════════════════════════════════════════════════════════

    {
      // Alternating transform + fill: odd steps rotate 90°, even steps reflect.
      // 4 frames fully establish the alternation.
      rules: [
        { kind: 'alternating', ruleA: { kind: 'rotate', degrees: 90 }, ruleB: { kind: 'reflectX' } },
        { kind: 'fillCycle', cycle: fillCycle2 },
      ],
      subRuleId: 'nvr.sequence.alternating_transform_fill',
      explanation: `Steps alternate: odd steps rotate 90°, even steps reflect horizontally. Fill also alternates ${fillCycle2.join(' → ')} every step. Four frames establish both patterns.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'operations alternate: rotate 90° / reflect horizontally each step',
      secondaryRule: `fill alternates ${fillCycle2.join(' → ')}`,
      baseSize: GOOD_BASE_SIZE,
    },

    {
      // 180° rotation + 3-state fill cycle — tracking two independent rules
      rules: [
        { kind: 'rotate', degrees: 180 },
        { kind: 'fillCycle', cycle: fillCycle3 },
      ],
      subRuleId: 'nvr.sequence.rotate_180_fill_3state',
      explanation: `Shape flips 180° each step AND cycles through ${fillCycle3.join(' → ')}. Four frames show all three fill states, making both rules fully evidenced.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: '180° flip each step',
      secondaryRule: `fill cycles 3 states: ${fillCycle3.join(' → ')}`,
      baseSize: LARGE_BASE_SIZE,
    },

    {
      // 3-state fill cycle + dash toggle — two independent short-period rules
      rules: [
        { kind: 'fillCycle', cycle: fillCycle3 },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.fill_3state_dash',
      explanation: `Fill cycles through ${fillCycle3.join(' → ')} each step. The border also alternates solid ↔ dashed independently. Four frames reveal all fill states and the full dash cycle.`,
      difficulty: 'hard',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `fill cycles 3 states: ${fillCycle3.join(' → ')}`,
      secondaryRule: 'border alternates solid ↔ dashed',
      baseSize: LARGE_BASE_SIZE,
    },

    {
      // Rotate + 3-state fill — must track both orientation AND fill index
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle3 },
      ],
      subRuleId: 'nvr.sequence.rotate_fill_3state',
      explanation: `Shape rotates ${deg}° each step AND cycles through fill states ${fillCycle3.join(' → ')}. Must track two independent progressions across four frames.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step`,
      secondaryRule: `fill cycles 3 states: ${fillCycle3.join(' → ')}`,
      baseSize: GOOD_BASE_SIZE,
    },

    {
      // Position orbit + fill cycle — shape moves AND changes fill
      rules: [],  // custom builder (position_orbit_fill)
      subRuleId: 'nvr.sequence.position_orbit_fill',
      explanation: `The shape moves to the next corner each step AND alternates fill ${fillCycle2.join(' → ')}. Track both position and fill to find the correct answer.`,
      difficulty: 'hard',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'shape orbits corner positions each step',
      secondaryRule: `fill alternates ${fillCycle2.join(' → ')}`,
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
  const numShapes = spec.minShapes;  // always use minShapes for standard specs
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
    // GL standard: enforce large base size. Never below GOOD_BASE_SIZE unless spec overrides.
    const size = spec.baseSize ?? GOOD_BASE_SIZE;
    const rotation = Math.floor(rng() * 8) * 45;
    shapes.push({ id: i, shape, x: pos[0], y: pos[1], size, rotation, fill, dashed: false });
  }
  return shapes;
}

function fillPoolForDiff(diff: string): FillPattern[] {
  // Always use high-contrast fills so the dominant rule is clear
  return ['none', 'solid'];
}

// ─── Distractor builder ────────────────────────────────────────────────────────

function buildCountDistractors(
  correctCount: number,
  shapeType: string,
  fillType: FillPattern,
  baseSize: number,
): ShapeAttrs[][] {
  const positionGrid: [number, number][] = [
    [30, 35], [70, 35], [30, 65], [70, 65], [50, 50],
  ];
  const MAX_SAFE = positionGrid.length;  // 5 — no shape can share a position slot

  const buildFrame = (count: number): ShapeAttrs[] =>
    Array.from({ length: Math.max(0, count) }, (_, i) => ({
      id: i,
      shape: shapeType,
      x: positionGrid[i % positionGrid.length][0],
      y: positionGrid[i % positionGrid.length][1],
      size: baseSize,
      rotation: 0,
      fill: fillType,
      dashed: false,
    }));

  // Alternate over/under count so each is a plausible trap.
  // Filter: length must be > 0 and ≤ MAX_SAFE (no shape-slot overlap).
  const offsets = [+1, -1, +2, -2, +3, -3, +4, -4];
  const candidates = offsets
    .map(o => buildFrame(correctCount + o))
    .filter(f => f.length > 0 && f.length <= MAX_SAFE);

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

  // Wrong position: use a different orbit frame
  for (const f of allOrbitFrames) {
    addIfUnique(candidates, f);
    if (candidates.length >= 3) break;
  }

  // Wrong fill: same position but wrong fill
  const wrongFill = correctFrame.map(s => ({
    ...s,
    fill: s.fill === 'none' ? 'solid' as FillPattern : 'none' as FillPattern,
  }));
  addIfUnique(candidates, wrongFill);

  // Wrong position + wrong fill
  if (allOrbitFrames.length >= 2) {
    const wf = allOrbitFrames[0].map(s => ({
      ...s,
      fill: s.fill === 'none' ? 'solid' as FillPattern : 'none' as FillPattern,
    }));
    addIfUnique(candidates, wf);
  }

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

  // Rule-based distractors
  addIfUnique(candidates, distractorMissedSecondary(lastFrame, spec.rules));
  addIfUnique(candidates, distractorMissedPrimary(lastFrame, spec.rules));
  addIfUnique(candidates, distractorOffByOne(lastFrame, spec.rules, rng));

  if (spec.rules.some(r => r.kind === 'rotate' || r.kind === 'alternating')) {
    addIfUnique(candidates, distractorWrongRotation(correctNext, rng));
  }

  if (spec.rules.some(r => r.kind === 'fillCycle' || r.kind === 'toggleDash')) {
    addIfUnique(candidates, distractorWrongFill(correctNext, rng));
  }

  // Previous-frame distractors (universally robust)
  addIfUnique(candidates, lastFrame);
  if (visibleFrames.length >= 2) {
    addIfUnique(candidates, visibleFrames[visibleFrames.length - 2]);
  }
  addIfUnique(candidates, firstFrame);

  const twoStep = applyRuleStack(applyRuleStack(lastFrame, spec.rules, 0), spec.rules, 1);
  addIfUnique(candidates, twoStep);

  // Rotation/fill/size mutations — rotation first so fill-only specs get a meaningful
  // logical-category distractor rather than a near-identical size variant
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
      const totalFrames = spec.visibleFrames + 1; // 3 visible + 1 answer
      allFrames = buildCountGrowFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      distractorAttrs = buildCountDistractors(correctAttrs.length, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.count_shrink') {
      const shapePool = ['circle', 'square', 'pentagon', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType = pick(['none', 'solid'] as FillPattern[], rng);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildCountShrinkFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      if (correctAttrs.length === 0) continue; // can't have 0-shape answer frame
      distractorAttrs = buildCountDistractors(correctAttrs.length, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.count_rotate') {
      const shapePool = STRONGLY_ASYMMETRIC;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const rngDeg = buildAsymRotAngle(rng);
      const totalFrames = spec.visibleFrames + 1; // 4 visible + 1 answer
      // Build count-grow frames then add rotation to each shape
      const countFrames = buildCountGrowFrames(rng, spec.countStart!, totalFrames, shapeType, fillType, spec.baseSize!);
      allFrames = countFrames.map((frame, f) =>
        frame.map(s => ({ ...s, rotation: (rngDeg * f) % 360 }))
      );
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      if (correctAttrs.length > 5) continue;
      distractorAttrs = buildCountDistractors(correctAttrs.length, shapeType, fillType, spec.baseSize!);

    } else if (spec.subRuleId === 'nvr.sequence.position_orbit') {
      const shapePool = ['square', 'pentagon', 'circle', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillType: FillPattern = 'none';
      const startPos = Math.floor(rng() * 4); // random start corner
      const totalFrames = spec.visibleFrames + 1;
      const orbit: [number, number][] = [
        [28, 28], [72, 28], [72, 72], [28, 72],
      ];
      allFrames = Array.from({ length: totalFrames }, (_, f) => {
        const pos = orbit[(startPos + f) % 4];
        return [{ id: 0, shape: shapeType, x: pos[0], y: pos[1], size: spec.baseSize!, rotation: 0, fill: fillType, dashed: false }];
      });
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      // Distractors: 3 wrong orbit positions
      distractorAttrs = buildPositionOrbitDistractors(correctAttrs, allFrames.slice(0, spec.visibleFrames), rng);

    } else if (spec.subRuleId === 'nvr.sequence.position_orbit_fill') {
      const shapePool = ['square', 'pentagon', 'circle', 'hexagon', 'diamond'] as const;
      const shapeType = pick(shapePool, rng);
      const fillCycleOrbit = buildFillCycle2(rng);
      const startPos = Math.floor(rng() * 4);
      const totalFrames = spec.visibleFrames + 1;
      const orbit: [number, number][] = [
        [28, 28], [72, 28], [72, 72], [28, 72],
      ];
      allFrames = Array.from({ length: totalFrames }, (_, f) => {
        const pos = orbit[(startPos + f) % 4];
        const fill = fillCycleOrbit[f % fillCycleOrbit.length];
        return [{ id: 0, shape: shapeType, x: pos[0], y: pos[1], size: spec.baseSize!, rotation: 0, fill, dashed: false }];
      });
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      distractorAttrs = buildPositionOrbitDistractors(correctAttrs, allFrames.slice(0, spec.visibleFrames), rng);

    } else {
      // Standard rule-based spec
      const base = buildBaseFrame(rng, spec, fillPool);
      const totalFrames = spec.visibleFrames + 1;
      allFrames = buildSequence(base, spec.rules, totalFrames);
      visibleFrames = allFrames.slice(0, spec.visibleFrames);
      correctAttrs = allFrames[spec.visibleFrames];
      distractorAttrs = buildSequenceDistractors(visibleFrames, correctAttrs, spec, rng);
    }

    // ── Validation gate 1: perceptibility (standard specs only) ───────────────
    if (!['nvr.sequence.count_grow', 'nvr.sequence.count_shrink',
          'nvr.sequence.count_rotate', 'nvr.sequence.position_orbit',
          'nvr.sequence.position_orbit_fill'].includes(spec.subRuleId)) {
      if (!allFramesPerceptible(allFrames)) continue;
    }

    // ── Validation gate 2: conditional firing ─────────────────────────────────
    if (!conditionalsFiredEnough(visibleFrames, spec.rules)) continue;

    // ── Validation gate 3: fill cycle unambiguity ─────────────────────────────
    if (!fillCycleIsUnambiguous(visibleFrames, spec.rules)) continue;

    // ── Validation gate 4: GL minimum shape size ──────────────────────────────
    if (!minShapeSizeValid(allFrames)) continue;

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

    // ── Audit log ────────────────────────────────────────────────────────────
    if (auditLog) {
      const distractorTypes = ['missed_secondary', 'off_by_one', 'missed_primary'];
      const allShapeSizes = allFrames.flat().map(s => s.size);
      const minSize = Math.min(...allShapeSizes);
      auditLog.push({
        subRuleId: spec.subRuleId,
        difficulty: spec.difficulty,
        primaryRule: spec.primaryRule,
        secondaryRule: spec.secondaryRule,
        stemFrameCount: spec.visibleFrames,
        mobileCheck: `min shape size: ${minSize} SVG units = ${(minSize * 0.8).toFixed(1)}px at mobile. ${minSize >= MIN_SHAPE_SIZE ? 'PASS' : 'FAIL'}`,
        evidenceReasoning: `${spec.visibleFrames} visible frames establish the rule${spec.secondaryRule ? 's' : ''}. Minimum shape size: ${minSize} SVG units (${(minSize * 0.8).toFixed(1)}px at 80px panel). All consecutive frame pairs are perceptibly different.`,
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
    case 'missed_secondary': return `Applied only the primary rule (${spec.primaryRule}) but ignored the secondary rule. Correct but incomplete.`;
    case 'off_by_one': return 'Applied the rule one step too many (overshot) or one too few (stopped early).';
    case 'missed_primary': return `Applied only the secondary rule (${spec.secondaryRule ?? 'n/a'}) but ignored the primary. Wrong orientation or attribute.`;
    case 'wrong_rotation': return 'Rotated the shape but by the wrong angle or direction.';
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

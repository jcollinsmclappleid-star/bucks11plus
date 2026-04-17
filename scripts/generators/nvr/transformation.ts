import type { GeneratedQuestion } from '../types';
import {
  type ShapeAttrs, type Rule, type FillPattern,
  STRONGLY_ASYMMETRIC, ROTATION_SAFE_SHAPES,
  seededRandom, pick, pickN, shuffleArray, shuffleWithCorrect,
  buildShapeFrame,
  applyRuleStack, frameAttrsToSvg, hasAnyDuplicateOptions,
  distractorMissedSecondary, distractorMissedPrimary,
  distractorWrongRotation, distractorWrongAxis,
  distractorWrongFill, distractorWrongSize, distractorPartialApply,
  distractorOffByOne, hasAnyDuplicateAttrOptions,
} from './shared';

// ─── Stems ────────────────────────────────────────────────────────────────────

const stems = [
  'Shape A is to Shape B as Shape C is to…?',
  'If Shape A becomes Shape B, what does Shape C become?',
  'Apply the same rule from A to B — what does C become?',
  'Which option shows Shape C after the same transformation as A → B?',
  'Two things changed from A to B. What does C become?',
];

// ─── Transform rule definitions ────────────────────────────────────────────────

interface TransformSpec {
  rules: Rule[];
  subRuleId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  shapePool: readonly string[];
  minObjects: number;
  maxObjects: number;
  fillPool: FillPattern[];
}

function buildTransformSpecs(rng: () => number): TransformSpec[] {
  const deg = pick([90, 90, 180, 270] as const, rng);
  const deg2: 90 | 180 | 270 = pick([90, 180, 270] as const, rng);
  const fillCycle = pick([
    ['none', 'solid'] as FillPattern[],
    ['solid', 'hatched'] as FillPattern[],
    ['none', 'hatched'] as FillPattern[],
    ['solid', 'dotted'] as FillPattern[],
  ], rng);
  const fillCycle2 = pick([
    ['none', 'solid'] as FillPattern[],
    ['hatched', 'none'] as FillPattern[],
    ['solid', 'hatched'] as FillPattern[],
  ], rng);
  const scaleDelta = pick([4, -4, 5, -5] as const, rng);

  const degLabel = deg === 90 ? 'quarter-turn clockwise'
    : deg === 180 ? 'half-turn'
    : 'three-quarter turn clockwise';

  return [
    // ─── EASY: 1 clear operator ────────────────────────────────────────────────
    {
      rules: [{ kind: 'rotate', degrees: deg }],
      subRuleId: 'nvr.transform.rotate_only',
      explanation: `Each shape turns ${degLabel} (${deg}°).`,
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 2, maxObjects: 3,
      fillPool: ['none', 'solid'],
    },
    {
      rules: [{ kind: 'reflectX' }],
      subRuleId: 'nvr.transform.reflect_horizontal',
      explanation: 'Each shape is flipped left-to-right (reflected horizontally).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 2, maxObjects: 3,
      fillPool: ['none', 'solid', 'hatched'],
    },
    {
      rules: [{ kind: 'reflectY' }],
      subRuleId: 'nvr.transform.reflect_vertical',
      explanation: 'Each shape is flipped top-to-bottom (reflected vertically).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 2, maxObjects: 3,
      fillPool: ['none', 'solid', 'hatched'],
    },
    {
      rules: [{ kind: 'fillCycle', cycle: fillCycle }],
      subRuleId: 'nvr.transform.fill_change',
      explanation: `The shading of each shape changes: ${fillCycle.join(' → ')}.`,
      difficulty: 'easy',
      shapePool: ROTATION_SAFE_SHAPES,
      minObjects: 2, maxObjects: 3,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [{ kind: 'scaleSize', delta: Math.abs(scaleDelta) }],
      subRuleId: 'nvr.transform.scale_only',
      explanation: 'Each shape increases in size.',
      difficulty: 'easy',
      shapePool: ROTATION_SAFE_SHAPES,
      minObjects: 2, maxObjects: 3,
      fillPool: ['none', 'solid'],
    },

    // ─── MEDIUM: 1 main operator + 1 modifier ──────────────────────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.rotate_fill',
      explanation: `Each shape rotates ${degLabel} and its shading changes: ${fillCycle.join(' → ')}.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 4,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: Math.abs(scaleDelta) },
      ],
      subRuleId: 'nvr.transform.rotate_scale',
      explanation: `Each shape rotates ${degLabel} and ${scaleDelta > 0 ? 'grows' : 'shrinks'} in size.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 4,
      fillPool: ['none', 'solid', 'hatched'],
    },
    {
      rules: [
        { kind: 'reflectX' },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.reflect_fill',
      explanation: `Each shape flips left-to-right and its shading changes: ${fillCycle.join(' → ')}.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 4,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.transform.rotate_dash',
      explanation: `Each shape rotates ${degLabel} and its outline switches between solid and dashed.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 4,
      fillPool: ['none', 'solid'],
    },
    {
      rules: [
        { kind: 'reflectY' },
        { kind: 'scaleSize', delta: Math.abs(scaleDelta) },
      ],
      subRuleId: 'nvr.transform.reflect_scale',
      explanation: `Each shape flips top-to-bottom and ${scaleDelta > 0 ? 'grows' : 'shrinks'} in size.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 4,
      fillPool: ['none', 'solid', 'hatched'],
    },
    {
      rules: [
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'scaleSize', delta: Math.abs(scaleDelta) },
      ],
      subRuleId: 'nvr.transform.fill_scale',
      explanation: `Each shape's shading changes ${fillCycle.join(' → ')} and it ${scaleDelta > 0 ? 'grows' : 'shrinks'}.`,
      difficulty: 'medium',
      shapePool: ROTATION_SAFE_SHAPES,
      minObjects: 3, maxObjects: 4,
      fillPool: fillCycle as FillPattern[],
    },

    // ─── HARD: 2 linked rules or 1 main + 1 conditional ───────────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'conditional', check: 'fill_is_solid', then: { kind: 'scaleSize', delta: 5 } },
      ],
      subRuleId: 'nvr.transform.rotate_fill_conditional',
      explanation: `Each shape rotates ${degLabel} and its fill cycles. Shapes that become solid also enlarge.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 5,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'reflectX' },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.rotate_reflect_fill',
      explanation: `Each shape rotates ${degLabel}, is then reflected left-to-right, and its shading changes.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 4, maxObjects: 5,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [
        { kind: 'reflectX' },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'scaleSize', delta: Math.abs(scaleDelta) },
      ],
      subRuleId: 'nvr.transform.reflect_fill_scale',
      explanation: `Each shape reflects left-to-right, its shading changes, and it ${scaleDelta > 0 ? 'grows' : 'shrinks'}.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 4, maxObjects: 5,
      fillPool: fillCycle as FillPattern[],
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: Math.abs(scaleDelta) },
        { kind: 'conditional', check: 'is_large', then: { kind: 'fillCycle', cycle: fillCycle2 } },
      ],
      subRuleId: 'nvr.transform.rotate_scale_conditional_fill',
      explanation: `Each shape rotates ${degLabel} and grows. Shapes that become large also change their shading.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 3, maxObjects: 5,
      fillPool: ['none', 'solid'],
    },
    {
      rules: [
        { kind: 'reflectY' },
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.transform.reflect_rotate_dash',
      explanation: `Each shape flips top-to-bottom, rotates ${degLabel}, and its outline switches solid/dashed.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      minObjects: 4, maxObjects: 5,
      fillPool: ['none', 'solid', 'hatched'],
    },
  ];
}

// ─── Build Frame C using same shape types as Frame A ─────────────────────────

function buildFrameC(frameA: ShapeAttrs[], rng: () => number, fillPool: FillPattern[]): ShapeAttrs[] {
  const n = frameA.length;
  const positions: [number, number][] = [
    [25, 25], [75, 25], [25, 75], [75, 75],
    [50, 25], [50, 75], [25, 50], [75, 50],
  ];
  const shuffled = positions.sort(() => rng() - 0.5);

  return frameA.map((orig, i) => {
    const pos = shuffled[i % shuffled.length];
    const size = 12 + Math.floor(rng() * 8);
    const rotation = Math.floor(rng() * 8) * 45;
    const fill = pick(fillPool, rng);
    return {
      id: orig.id + 100,
      shape: orig.shape, // same shape family as A
      x: pos[0],
      y: pos[1],
      size,
      rotation,
      fill,
      dashed: false,
    };
  });
}

// ─── Distractor engine for transformations ────────────────────────────────────

function buildTransformDistractors(
  frameC: ShapeAttrs[],
  correctD: ShapeAttrs[],
  spec: TransformSpec,
  rng: () => number,
): ShapeAttrs[][] {
  const candidates: ShapeAttrs[][] = [];

  // 1. Missed secondary rule (only rule 0 applied)
  const missedSec = distractorMissedSecondary(frameC, spec.rules);
  if (missedSec) candidates.push(missedSec);

  // 2. Wrong rotation angle
  candidates.push(distractorWrongRotation(correctD, rng));

  // 3. Wrong reflection axis
  const wrongAxis = distractorWrongAxis(correctD);
  candidates.push(wrongAxis);

  // 4. Wrong fill
  candidates.push(distractorWrongFill(correctD, rng));

  // 5. Wrong size
  candidates.push(distractorWrongSize(correctD, rng));

  // 6. Partial apply (only to first half)
  candidates.push(distractorPartialApply(frameC, correctD));

  // 7. Missed primary (only secondary rule applied)
  const missedPrim = distractorMissedPrimary(frameC, spec.rules);
  if (missedPrim) candidates.push(missedPrim);

  // Pick 3 distinct
  const chosen: ShapeAttrs[][] = [];
  for (const d of candidates) {
    if (chosen.length >= 3) break;
    if (!hasAnyDuplicateAttrOptions([correctD, ...chosen, d])) {
      chosen.push(d);
    }
  }

  // Fallback
  while (chosen.length < 3) {
    const ws = distractorWrongSize(correctD, rng);
    chosen.push(ws);
  }

  return chosen;
}

// ─── Main generator ────────────────────────────────────────────────────────────

function generateTransformBatch(startSeed: number, count: number): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    let attempts = 0;

    while (attempts < 6) {
      const rng = seededRandom(startSeed + i * 199 + attempts * 37);
      rng(); rng(); rng();

      const specs = buildTransformSpecs(rng);
      const specIdx = i % specs.length;
      const spec = specs[specIdx];

      const numObjects = spec.minObjects + Math.floor(rng() * (spec.maxObjects - spec.minObjects + 1));

      // Build Frame A using compatible shapes
      const frameA = buildShapeFrame(rng, numObjects, spec.shapePool, spec.fillPool, 0);

      // Derive Frame B
      const frameB = applyRuleStack(frameA, spec.rules, 0);

      // Verify B is perceptibly different from A
      const aSvg = frameAttrsToSvg(frameA);
      const bSvg = frameAttrsToSvg(frameB);
      if (JSON.stringify(aSvg) === JSON.stringify(bSvg)) { attempts++; continue; }

      // Build Frame C using same shape types as A
      const frameC = buildFrameC(frameA, rng, spec.fillPool);

      // Derive correct answer D
      const correctD = applyRuleStack(frameC, spec.rules, 0);
      const cSvg = frameAttrsToSvg(frameC);
      const dSvg = frameAttrsToSvg(correctD);
      if (JSON.stringify(cSvg) === JSON.stringify(dSvg)) { attempts++; continue; }

      // Build distractors
      const distractorAttrs = buildTransformDistractors(frameC, correctD, spec, rng);
      if (distractorAttrs.length < 3) { attempts++; continue; }

      const correctSvg = dSvg;
      const distractorSvgs = distractorAttrs.slice(0, 3).map(frameAttrsToSvg);
      const allOptions = [correctSvg, ...distractorSvgs];

      if (hasAnyDuplicateOptions(allOptions)) { attempts++; continue; }

      const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctSvg, distractorSvgs, rng);
      const labels = ['A', 'B', 'C', 'D'];
      const stemIdx = i % stems.length;

      results.push({
        section: 'Non-Verbal Reasoning',
        type: 'transformation',
        prompt: stems[stemIdx],
        options: labels,
        correctAnswer: labels[correctIndex],
        difficulty: spec.difficulty,
        skillId: 'nvr.transform',
        subRuleId: spec.subRuleId,
        renderType: 'svg',
        renderConfig: {
          kind: 'nvr.transform' as const,
          promptFrames: [aSvg, bSvg, cSvg],
          answerOptions,
        },
        trapTypes: ['missed_secondary', 'wrong_rotation', 'wrong_axis', 'fill_error', 'partial_apply'],
        cognitiveLoad: spec.difficulty === 'easy' ? 2 : spec.difficulty === 'medium' ? 4 : 6,
        estTimeSeconds: spec.difficulty === 'easy' ? 30 : spec.difficulty === 'medium' ? 45 : 60,
        explanation: spec.explanation,
        qaStatus: 'approved',
        locale: 'en-GB',
        britishSpelling: true,
        version: 4,
        stemVariantId: `stem_transform_${stemIdx}`,
        layoutVariantId: `transform_${numObjects}el`,
        densityLevel: spec.difficulty === 'easy' ? 'low' : spec.difficulty === 'medium' ? 'medium' : 'high',
        distractorStyleId: spec.subRuleId,
      });
      break;
    }
  }

  return results;
}

export function generateTransformationQuestions(): GeneratedQuestion[] {
  const all: GeneratedQuestion[] = [
    ...generateTransformBatch(40000, 80),
    ...generateTransformBatch(50000, 80),
    ...generateTransformBatch(60000, 80),
    ...generateTransformBatch(70000, 80),
  ];

  const easy = all.filter(q => q.difficulty === 'easy').slice(0, 50);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 100);
  const hard = all.filter(q => q.difficulty === 'hard').slice(0, 110);

  return [...easy, ...medium, ...hard];
}

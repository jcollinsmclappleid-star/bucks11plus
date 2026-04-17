import type { GeneratedQuestion } from '../types';
import {
  type ShapeAttrs, type Rule, type FillPattern,
  STRONGLY_ASYMMETRIC, ROTATION_SAFE_SHAPES,
  seededRandom, pick, shuffleWithCorrect,
  buildShapeFrame,
  applyRuleStack, frameAttrsToSvg, hasAnyDuplicateOptions,
  distractorMissedSecondary, distractorWrongRotation,
  distractorWrongAxis, distractorWrongFill, distractorWrongSize,
  distractorPartialApply, hasAnyDuplicateAttrOptions,
} from './shared';

const stems = [
  'Shape A is to Shape B as Shape C is to…?',
  'If Shape A becomes Shape B, what does Shape C become?',
  'Shape A transforms into Shape B. Apply the same rule to Shape C.',
  'Which option shows Shape C after the same transformation as A → B?',
];

interface RotReflSpec {
  rules: Rule[];
  subRuleId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  shapePool: readonly string[];
  fillPool: FillPattern[];
  minObjects: number;
  maxObjects: number;
}

function buildRotReflSpecs(rng: () => number): RotReflSpec[] {
  const deg = pick([90, 90, 180, 270] as const, rng);
  const deg2: 90 | 180 | 270 = pick([90, 180, 270] as const, rng);
  const fillCycle = pick([
    ['none', 'solid'] as FillPattern[],
    ['solid', 'hatched'] as FillPattern[],
    ['none', 'hatched'] as FillPattern[],
  ], rng);
  const degLabel = (d: number) => d === 90 ? 'quarter-turn clockwise'
    : d === 180 ? 'half-turn'
    : 'three-quarter turn clockwise';

  return [
    // ─── EASY: single clear rotation or reflection ─────────────────────────────
    {
      rules: [{ kind: 'rotate', degrees: 90 }],
      subRuleId: 'nvr.transform.rotate_90',
      explanation: 'Each shape turns a quarter-turn clockwise (90°).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 1, maxObjects: 2,
    },
    {
      rules: [{ kind: 'rotate', degrees: 180 }],
      subRuleId: 'nvr.transform.rotate_180',
      explanation: 'Each shape turns a half-turn (180°).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 1, maxObjects: 2,
    },
    {
      rules: [{ kind: 'reflectX' }],
      subRuleId: 'nvr.transform.reflect_x',
      explanation: 'Each shape is flipped left-to-right (reflected on the vertical axis).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched'],
      minObjects: 1, maxObjects: 2,
    },
    {
      rules: [{ kind: 'reflectY' }],
      subRuleId: 'nvr.transform.reflect_y',
      explanation: 'Each shape is flipped top-to-bottom (reflected on the horizontal axis).',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched'],
      minObjects: 1, maxObjects: 2,
    },
    {
      rules: [{ kind: 'rotate', degrees: 270 }],
      subRuleId: 'nvr.transform.rotate_270',
      explanation: 'Each shape turns three-quarter turn clockwise (270°), which is the same as a quarter-turn anticlockwise.',
      difficulty: 'easy',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 1, maxObjects: 2,
    },

    // ─── MEDIUM: 2 operations ──────────────────────────────────────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.rotate_fill',
      explanation: `Each shape turns ${degLabel(deg)} and its shading changes.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: fillCycle,
      minObjects: 2, maxObjects: 3,
    },
    {
      rules: [
        { kind: 'reflectX' },
        { kind: 'scaleSize', delta: 4 },
      ],
      subRuleId: 'nvr.transform.reflect_scale',
      explanation: 'Each shape flips left-to-right and grows in size.',
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched'],
      minObjects: 2, maxObjects: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: 4 },
      ],
      subRuleId: 'nvr.transform.rotate_scale',
      explanation: `Each shape turns ${degLabel(deg)} and grows in size.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 2, maxObjects: 3,
    },
    {
      rules: [
        { kind: 'reflectX' },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.reflect_fill',
      explanation: `Each shape flips left-to-right and its shading changes.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: fillCycle,
      minObjects: 2, maxObjects: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.transform.rotate_dash',
      explanation: `Each shape turns ${degLabel(deg)} and its outline switches solid/dashed.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 2, maxObjects: 3,
    },
    {
      rules: [
        { kind: 'reflectY' },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.reflect_y_fill',
      explanation: `Each shape flips top-to-bottom and its shading changes.`,
      difficulty: 'medium',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: fillCycle,
      minObjects: 2, maxObjects: 3,
    },

    // ─── HARD: compound / conditional rules ────────────────────────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'reflectX' },
      ],
      subRuleId: 'nvr.transform.rotate_reflect',
      explanation: `Each shape turns ${degLabel(deg)} and is then also flipped left-to-right.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched'],
      minObjects: 3, maxObjects: 4,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'conditional', check: 'fill_is_solid', then: { kind: 'scaleSize', delta: 5 } },
      ],
      subRuleId: 'nvr.transform.rotate_fill_conditional',
      explanation: `Each shape rotates ${degLabel(deg)} and its fill changes. Shapes that become solid also enlarge.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: fillCycle,
      minObjects: 3, maxObjects: 4,
    },
    {
      rules: [
        { kind: 'reflectX' },
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.transform.reflect_rotate_fill',
      explanation: `Each shape flips left-to-right, then turns ${degLabel(deg)}, and its shading also changes.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: fillCycle,
      minObjects: 3, maxObjects: 4,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: 4 },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.transform.rotate_scale_dash',
      explanation: `Each shape rotates ${degLabel(deg)}, grows in size, and its outline toggles solid/dashed.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid'],
      minObjects: 3, maxObjects: 4,
    },
    {
      rules: [
        { kind: 'reflectY' },
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: 4 },
      ],
      subRuleId: 'nvr.transform.reflect_y_rotate_scale',
      explanation: `Each shape flips top-to-bottom, turns ${degLabel(deg)}, and grows in size.`,
      difficulty: 'hard',
      shapePool: STRONGLY_ASYMMETRIC,
      fillPool: ['none', 'solid', 'hatched'],
      minObjects: 3, maxObjects: 4,
    },
  ];
}

function buildFrameCSameShapes(frameA: ShapeAttrs[], rng: () => number, fillPool: FillPattern[]): ShapeAttrs[] {
  const positions: [number, number][] = [
    [75, 25], [25, 75], [75, 75], [25, 25],
    [50, 25], [50, 75], [25, 50], [75, 50],
  ];
  return frameA.map((orig, i) => {
    const pos = positions[i % positions.length];
    return {
      id: orig.id + 100,
      shape: orig.shape,
      x: pos[0],
      y: pos[1],
      size: 12 + Math.floor(rng() * 8),
      rotation: Math.floor(rng() * 8) * 45,
      fill: pick(fillPool, rng),
      dashed: false,
    };
  });
}

function buildDistractors(
  frameC: ShapeAttrs[],
  correctD: ShapeAttrs[],
  spec: RotReflSpec,
  rng: () => number,
): ShapeAttrs[][] {
  const candidates = [
    distractorWrongRotation(correctD, rng),
    distractorWrongAxis(correctD),
    distractorWrongFill(correctD, rng),
    distractorWrongSize(correctD, rng),
    distractorPartialApply(frameC, correctD),
    distractorMissedSecondary(frameC, spec.rules),
  ].filter(Boolean) as ShapeAttrs[][];

  const chosen: ShapeAttrs[][] = [];
  for (const d of candidates) {
    if (chosen.length >= 3) break;
    if (!hasAnyDuplicateAttrOptions([correctD, ...chosen, d])) chosen.push(d);
  }
  while (chosen.length < 3) chosen.push(distractorWrongSize(correctD, rng));
  return chosen;
}

function generateRotReflBatch(startSeed: number, count: number): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    while (attempts < 6) {
      const rng = seededRandom(startSeed + i * 211 + attempts * 43);
      rng(); rng(); rng();

      const specs = buildRotReflSpecs(rng);
      const spec = specs[i % specs.length];
      const numObjects = spec.minObjects + Math.floor(rng() * (spec.maxObjects - spec.minObjects + 1));

      const frameA = buildShapeFrame(rng, numObjects, spec.shapePool, spec.fillPool, 0);
      const frameB = applyRuleStack(frameA, spec.rules, 0);

      const aSvg = frameAttrsToSvg(frameA);
      const bSvg = frameAttrsToSvg(frameB);
      if (JSON.stringify(aSvg) === JSON.stringify(bSvg)) { attempts++; continue; }

      const frameC = buildFrameCSameShapes(frameA, rng, spec.fillPool);
      const correctD = applyRuleStack(frameC, spec.rules, 0);
      const cSvg = frameAttrsToSvg(frameC);
      const dSvg = frameAttrsToSvg(correctD);
      if (JSON.stringify(cSvg) === JSON.stringify(dSvg)) { attempts++; continue; }

      const distractorAttrs = buildDistractors(frameC, correctD, spec, rng);
      const distractorSvgs = distractorAttrs.slice(0, 3).map(frameAttrsToSvg);
      if (hasAnyDuplicateOptions([dSvg, ...distractorSvgs])) { attempts++; continue; }

      const { options: answerOptions, correctIndex } = shuffleWithCorrect(dSvg, distractorSvgs, rng);
      const labels = ['A', 'B', 'C', 'D'];
      const stemIdx = i % stems.length;

      results.push({
        section: 'Non-Verbal Reasoning',
        type: 'rotation_reflection',
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
        trapTypes: ['wrong_rotation', 'wrong_axis', 'missed_secondary', 'fill_error'],
        cognitiveLoad: spec.difficulty === 'easy' ? 2 : spec.difficulty === 'medium' ? 4 : 6,
        estTimeSeconds: spec.difficulty === 'easy' ? 25 : spec.difficulty === 'medium' ? 40 : 55,
        explanation: spec.explanation,
        qaStatus: 'approved',
        locale: 'en-GB',
        britishSpelling: true,
        version: 3,
        stemVariantId: `stem_rr_${stemIdx}`,
        layoutVariantId: `rr_${numObjects}el`,
        densityLevel: spec.difficulty === 'easy' ? 'low' : spec.difficulty === 'medium' ? 'medium' : 'high',
        distractorStyleId: spec.subRuleId,
      });
      break;
    }
  }

  return results;
}

export function generateRotationReflectionQuestions(): GeneratedQuestion[] {
  const all: GeneratedQuestion[] = [
    ...generateRotReflBatch(80000, 60),
    ...generateRotReflBatch(90000, 60),
    ...generateRotReflBatch(100000, 60),
  ];

  const easy = all.filter(q => q.difficulty === 'easy').slice(0, 40);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 70);
  const hard = all.filter(q => q.difficulty === 'hard').slice(0, 54);

  return [...easy, ...medium, ...hard];
}

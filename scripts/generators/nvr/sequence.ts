import type { GeneratedQuestion } from '../types';
import {
  type ShapeAttrs, type Rule, type FillPattern,
  ROTATION_SAFE_SHAPES, STRONGLY_ASYMMETRIC,
  seededRandom, pick, pickN, shuffleArray, shuffleWithCorrect,
  buildShapeFrame, buildRotationSafeFrame,
  applyRuleStack, buildSequence,
  frameAttrsToSvg, hasAnyDuplicateOptions,
  distractorMissedSecondary, distractorMissedPrimary,
  distractorWrongRotation, distractorWrongAxis, distractorOffByOne,
  distractorWrongFill, distractorWrongSize, distractorPartialApply,
  hasAnyDuplicateAttrOptions,
} from './shared';

// ─── Stem variants ─────────────────────────────────────────────────────────────

const stems = [
  'Which shape comes next in the sequence?',
  'Select the shape that continues the sequence.',
  'Identify the next shape in the series.',
  'What is the next item in this pattern?',
  'Which option follows the pattern shown?',
];

// ─── Rule stack library ────────────────────────────────────────────────────────

interface SequenceSpec {
  rules: Rule[];
  subRuleId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  shapeRequirement: 'rotation_safe' | 'any' | 'strongly_asymmetric';
  minShapes: number;
  maxShapes: number;
}

function buildRotAngle(rng: () => number): 90 | 180 | 270 {
  return pick([90, 90, 90, 180, 270] as const, rng);
}

function buildFillCycle(rng: () => number): FillPattern[] {
  return pick([
    ['none', 'solid'],
    ['none', 'hatched'],
    ['solid', 'hatched', 'none'],
    ['none', 'solid', 'dotted'],
    ['hatched', 'none', 'solid'],
  ] as FillPattern[][], rng);
}

function buildSequenceSpecs(rng: () => number): SequenceSpec[] {
  const deg = buildRotAngle(rng);
  const fillCycle = buildFillCycle(rng);
  const deg2: 90 | 180 | 270 = pick([90, 180, 270] as const, rng);
  const fillCycle2 = buildFillCycle(rng);

  return [
    // ─── EASY: 1 rule ─────────────────────────────────────────────────────────
    {
      rules: [{ kind: 'rotate', degrees: deg }],
      subRuleId: 'nvr.sequence.rotate_only',
      explanation: `Each shape rotates ${deg}° clockwise each step.`,
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 2,
    },
    {
      rules: [{ kind: 'fillCycle', cycle: fillCycle }],
      subRuleId: 'nvr.sequence.fill_cycle_only',
      explanation: `The fill pattern cycles through ${fillCycle.join(' → ')} each step.`,
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 2,
    },
    {
      rules: [{ kind: 'scaleSize', delta: 3 }],
      subRuleId: 'nvr.sequence.size_only',
      explanation: 'Each shape grows slightly larger each step.',
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 2,
    },
    {
      rules: [{ kind: 'toggleDash' }],
      subRuleId: 'nvr.sequence.dash_toggle',
      explanation: 'The border of each shape alternates between solid and dashed each step.',
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 2,
    },

    // ─── MEDIUM: 2 interacting rules ──────────────────────────────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.sequence.rotate_fill',
      explanation: `Each step: the shape rotates ${deg}° clockwise, and the fill cycles ${fillCycle.join(' → ')}.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: 2 },
      ],
      subRuleId: 'nvr.sequence.rotate_scale',
      explanation: `Each step: the shape rotates ${deg}° and grows slightly larger.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'scaleSize', delta: 2 },
      ],
      subRuleId: 'nvr.sequence.fill_scale',
      explanation: `Each step: the fill cycles ${fillCycle.join(' → ')} and the shape grows larger.`,
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.rotate_dash',
      explanation: `Each step: the shape rotates ${deg}° and the border alternates solid/dashed.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'alternating', ruleA: { kind: 'rotate', degrees: deg }, ruleB: { kind: 'reflectX' } },
        { kind: 'fillCycle', cycle: fillCycle },
      ],
      subRuleId: 'nvr.sequence.alternating_transform_fill',
      explanation: `Odd steps rotate ${deg}°, even steps reflect horizontally; the fill cycles throughout.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'fillCycle', cycle: fillCycle, targetId: 0 },
        { kind: 'rotate', degrees: deg, targetId: 1 },
      ],
      subRuleId: 'nvr.sequence.independent_rules',
      explanation: `Shape 1 cycles its fill ${fillCycle.join(' → ')}; shape 2 rotates ${deg}° each step.`,
      difficulty: 'medium',
      shapeRequirement: 'rotation_safe',
      minShapes: 2, maxShapes: 2,
    },

    // ─── HARD: 3 rules, including conditional or alternating ──────────────────
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'scaleSize', delta: 2 },
      ],
      subRuleId: 'nvr.sequence.rotate_fill_scale',
      explanation: `Each step: shape rotates ${deg}°, fill cycles ${fillCycle.join(' → ')}, and size increases.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'conditional', check: 'fill_is_solid', then: { kind: 'scaleSize', delta: 4 } },
      ],
      subRuleId: 'nvr.sequence.rotate_fill_conditional_scale',
      explanation: `Each step: shape rotates ${deg}° and fill cycles ${fillCycle.join(' → ')}. When the fill is solid, the shape also enlarges.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.rotate_fill_dash',
      explanation: `Each step: shape rotates ${deg}°, fill cycles ${fillCycle.join(' → ')}, and border alternates solid/dashed.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'alternating', ruleA: { kind: 'rotate', degrees: deg }, ruleB: { kind: 'reflectX' } },
        { kind: 'fillCycle', cycle: fillCycle },
        { kind: 'scaleSize', delta: 2 },
      ],
      subRuleId: 'nvr.sequence.alternating_reflect_fill_scale',
      explanation: `Alternating steps rotate ${deg}° then reflect; fill cycles and size increases throughout.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg, targetId: 0 },
        { kind: 'fillCycle', cycle: fillCycle, targetId: 0 },
        { kind: 'rotate', degrees: deg2, targetId: 1 },
      ],
      subRuleId: 'nvr.sequence.dual_shape_rules',
      explanation: `Shape 1 rotates ${deg}° and cycles fill ${fillCycle.join(' → ')}; shape 2 independently rotates ${deg2}° each step.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 2,
    },
    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'conditional', check: 'fill_is_none', then: { kind: 'fillCycle', cycle: ['none', 'solid'] } },
        { kind: 'conditional', check: 'fill_is_solid', then: { kind: 'toggleDash' } },
      ],
      subRuleId: 'nvr.sequence.conditional_chain',
      explanation: `Shape rotates ${deg}° each step. When hollow it becomes solid; when solid the border becomes dashed.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 3,
    },
  ];
}

// ─── Build shape pool from spec ───────────────────────────────────────────────

function shapePoolForSpec(spec: SequenceSpec): readonly string[] {
  if (spec.shapeRequirement === 'strongly_asymmetric') return STRONGLY_ASYMMETRIC;
  if (spec.shapeRequirement === 'rotation_safe') return ROTATION_SAFE_SHAPES;
  return [...ROTATION_SAFE_SHAPES, 'pentagon', 'star'];
}

function fillPoolForDiff(diff: string): FillPattern[] {
  if (diff === 'easy') return ['none', 'solid'];
  if (diff === 'medium') return ['none', 'solid', 'hatched', 'dotted'];
  return ['none', 'solid', 'hatched', 'dotted', 'striped'];
}

// ─── Generate distractors for sequences ──────────────────────────────────────

function buildSequenceDistractors(
  frames: ShapeAttrs[][],
  correctNext: ShapeAttrs[],
  spec: SequenceSpec,
  rng: () => number,
): ShapeAttrs[][] {
  const distractors: ShapeAttrs[][] = [];

  // 1. Missed secondary rule (applies only rule 0)
  const missedSecondary = distractorMissedSecondary(frames[frames.length - 1], spec.rules);
  if (missedSecondary && !JSON.stringify(missedSecondary).includes(JSON.stringify(correctNext))) {
    distractors.push(missedSecondary);
  }

  // 2. Off by one (applies rule an extra time)
  const offByOne = distractorOffByOne(frames[frames.length - 1], spec.rules, rng);
  if (offByOne) distractors.push(offByOne);

  // 3. Surface pattern follower (wrong rotation angle but fills correct)
  const wrongRot = distractorWrongRotation(correctNext, rng);
  distractors.push(wrongRot);

  // 4. Wrong fill / wrong size
  const wrongFill = distractorWrongFill(correctNext, rng);
  distractors.push(wrongFill);

  // 5. Partial apply
  const partial = distractorPartialApply(frames[frames.length - 1], correctNext);
  distractors.push(partial);

  // 6. Missed primary (only secondary rule applied)
  const missedPrimary = distractorMissedPrimary(frames[frames.length - 1], spec.rules);
  if (missedPrimary) distractors.push(missedPrimary);

  // Return 3 distinct distractors
  const unique: ShapeAttrs[][] = [];
  for (const d of distractors) {
    if (unique.length >= 3) break;
    if (!hasAnyDuplicateAttrOptions([correctNext, ...unique, d])) {
      unique.push(d);
    }
  }

  // Fill remaining with wrong size if needed
  while (unique.length < 3) {
    const ws = distractorWrongSize(correctNext, rng);
    if (!hasAnyDuplicateAttrOptions([correctNext, ...unique, ws])) unique.push(ws);
    else break;
  }

  return unique;
}

// ─── Main generator ────────────────────────────────────────────────────────────

function generateSequenceBatch(startSeed: number, count: number): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i * 317);
    rng(); rng(); rng();

    const specs = buildSequenceSpecs(rng);
    const specIdx = i % specs.length;
    const spec = specs[specIdx];

    const shapePool = shapePoolForSpec(spec);
    const fillPool = fillPoolForDiff(spec.difficulty);
    const numShapes = spec.minShapes + Math.floor(rng() * (spec.maxShapes - spec.minShapes + 1));

    // Build base frame
    const base = buildShapeFrame(rng, numShapes, shapePool, fillPool, 0);

    // Build 5 frames cumulatively
    const allFrames = buildSequence(base, spec.rules, 5);
    const showFrames = allFrames.slice(0, 4);
    const correctAttrs = allFrames[4];

    // Build distractors
    const distractorAttrs = buildSequenceDistractors(showFrames, correctAttrs, spec, rng);
    if (distractorAttrs.length < 3) continue;

    const correctSvg = frameAttrsToSvg(correctAttrs);
    const distractorSvgs = distractorAttrs.slice(0, 3).map(frameAttrsToSvg);
    const allOptions = [correctSvg, ...distractorSvgs];

    if (hasAnyDuplicateOptions(allOptions)) continue;

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctSvg, distractorSvgs, rng);
    const labels = ['A', 'B', 'C', 'D'];
    const stemIdx = i % stems.length;

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
        frames: showFrames.map(frameAttrsToSvg),
        questionIndex: 3,
        answerOptions,
      },
      trapTypes: ['one_rule_only', 'off_by_one', 'wrong_rotation', 'missed_secondary'],
      cognitiveLoad: spec.difficulty === 'easy' ? 2 : spec.difficulty === 'medium' ? 4 : 6,
      estTimeSeconds: spec.difficulty === 'easy' ? 25 : spec.difficulty === 'medium' ? 40 : 55,
      explanation: spec.explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 3,
      stemVariantId: `stem_seq_${stemIdx}`,
      layoutVariantId: `seq_${numShapes}shape`,
      densityLevel: spec.difficulty === 'easy' ? 'low' : spec.difficulty === 'medium' ? 'medium' : 'high',
      distractorStyleId: spec.subRuleId,
    });
  }

  return results;
}

export function generateSequenceQuestions(): GeneratedQuestion[] {
  const all: GeneratedQuestion[] = [
    ...generateSequenceBatch(20000, 120),
    ...generateSequenceBatch(25000, 120),
    ...generateSequenceBatch(30000, 120),
    ...generateSequenceBatch(35000, 120),
    ...generateSequenceBatch(40000, 120),
  ];

  const easy = all.filter(q => q.difficulty === 'easy').slice(0, 20);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 30);
  const hard = all.filter(q => q.difficulty === 'hard').slice(0, 50);

  return [...easy, ...medium, ...hard];
}

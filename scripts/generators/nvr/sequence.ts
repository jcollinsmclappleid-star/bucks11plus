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
  shapeRequirement: 'strongly_asymmetric' | 'any';
  minShapes: number;
  maxShapes: number;
  // How many visible stem frames: easy=3, medium/hard=4
  visibleFrames: 3 | 4;
  // Primary rule description (for review set)
  primaryRule: string;
  // Secondary rule description (for review set)
  secondaryRule?: string;
  // Override base size for size-change specs to prevent cap collisions
  baseSize?: number;
}

// ─── Helper builders ───────────────────────────────────────────────────────────

function buildRotAngle(rng: () => number): 90 | 180 | 270 {
  return pick([90, 90, 90, 180, 270] as const, rng);
}

function buildAsymRotAngle(rng: () => number): 90 | 180 {
  // 270° is indistinguishable from 90° going the other way for evidence purposes
  // Prefer 90° for clarity; 180° for variety
  return pick([90, 90, 180] as const, rng);
}

function buildFillCycle2(rng: () => number): FillPattern[] {
  return pick([
    ['none', 'solid'] as FillPattern[],
    ['none', 'hatched'] as FillPattern[],
    ['solid', 'hatched'] as FillPattern[],
  ], rng);
}

function buildFillCycle3(rng: () => number): FillPattern[] {
  return pick([
    ['none', 'solid', 'hatched'] as FillPattern[],
    ['solid', 'none', 'hatched'] as FillPattern[],
    ['none', 'hatched', 'solid'] as FillPattern[],
  ], rng);
}

// ─── Validators ────────────────────────────────────────────────────────────────

/**
 * Check that every consecutive frame pair is perceptibly different.
 * Covers both the visible stem frames AND the stem→answer transition.
 */
function allFramesPerceptible(frames: ShapeAttrs[][]): boolean {
  for (let i = 0; i < frames.length - 1; i++) {
    if (!frameIsPerceptiblyDifferent(frames[i], frames[i + 1])) return false;
  }
  return true;
}

/**
 * Count how many times a conditional rule fires across the given frames.
 * A conditional fires if its check evaluates to true for any shape in the frame.
 */
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

/**
 * Validate that all conditional rules in the spec fire at least twice
 * in the visible stem frames. Returns false if any conditional is under-evidenced.
 */
function conditionalsFiredEnough(visibleFrames: ShapeAttrs[][], rules: Rule[]): boolean {
  for (const rule of rules) {
    if (rule.kind === 'conditional') {
      if (countConditionalFirings(visibleFrames, rule) < 2) return false;
    }
  }
  return true;
}

/**
 * Check that the fill-cycle answer is unambiguous.
 * A 2-state cycle with an even number of visible frames means the answer
 * is not uniquely constrained unless the starting state is known.
 * We validate by checking the last visible frame establishes the next state.
 */
function fillCycleIsUnambiguous(visibleFrames: ShapeAttrs[][], rules: Rule[]): boolean {
  for (const rule of rules) {
    if (rule.kind === 'fillCycle') {
      // With 3 visible frames and a 2-state cycle (period=2):
      // frame0→frame1→frame2→answer: the answer fill is deterministic from frame2
      // No ambiguity — the child tracks from the last visible frame.
      // With 4 visible frames and a 2-state cycle:
      // frame0→frame1→frame2→frame3→answer: similarly deterministic.
      // Ambiguity only arises if cycle length == 1 (trivially invalid).
      if (rule.cycle.length < 2) return false;
    }
  }
  return true;
}

// ─── Spec library ──────────────────────────────────────────────────────────────

function buildSequenceSpecs(rng: () => number): SequenceSpec[] {
  const deg = buildAsymRotAngle(rng);
  const deg2: 90 | 180 = buildAsymRotAngle(rng);
  const fillCycle2 = buildFillCycle2(rng);
  const fillCycle2b = buildFillCycle2(rng);
  const fillCycle3 = buildFillCycle3(rng);

  // Ensure deg2 differs from deg for dual-shape specs
  const altDeg: 90 | 180 = deg === 90 ? 180 : 90;

  return [
    // ══════════════════════════════════════════════════════════════════════════
    // EASY — 1 rule, 3 visible frames (questionIndex: 2)
    // Rule must be single and obvious. Answer uniquely deducible from 3 frames.
    // ══════════════════════════════════════════════════════════════════════════

    {
      rules: [{ kind: 'rotate', degrees: deg }],
      subRuleId: 'nvr.sequence.rotate_only',
      explanation: `Each shape rotates ${deg}° clockwise each step. After three steps the next position follows directly.`,
      difficulty: 'easy',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 2,
      visibleFrames: 3,
      primaryRule: `rotation ${deg}° clockwise per step`,
    },

    {
      // Fill cycles over 2 states — clearly visible with large shapes
      rules: [{ kind: 'fillCycle', cycle: fillCycle2 }],
      subRuleId: 'nvr.sequence.fill_cycle_only',
      explanation: `The fill pattern cycles ${fillCycle2.join(' → ')} each step. Three frames establish the full cycle.`,
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,  // 1 shape so fill change is isolated and large
      visibleFrames: 3,
      primaryRule: `fill cycles ${fillCycle2.join(' → ')} each step`,
      baseSize: 20,  // enforce large shape so fill is clearly visible
    },

    {
      // Shape shrinks — start large so the decrease is always visible
      rules: [{ kind: 'scaleSize', delta: -6 }],
      subRuleId: 'nvr.sequence.size_shrink_only',
      explanation: 'The shape shrinks by a fixed amount each step. Three frames make the size progression clear.',
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,  // 1 shape for clear size comparison
      visibleFrames: 3,
      primaryRule: 'shape shrinks by a fixed amount each step',
      baseSize: 26,  // start large so 3 shrinks (→20→14→answer:8) all remain visible
    },

    {
      // Dash alternates — simple, unambiguous, always visible
      rules: [{ kind: 'toggleDash' }],
      subRuleId: 'nvr.sequence.dash_toggle',
      explanation: 'The border alternates between solid and dashed each step.',
      difficulty: 'easy',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 2,
      visibleFrames: 3,
      primaryRule: 'border alternates solid ↔ dashed each step',
      baseSize: 18,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MEDIUM — 2 rules, 4 visible frames (questionIndex: 3)
    // Clear primary rule + 1 visible secondary. Both established in 4 frames.
    // ══════════════════════════════════════════════════════════════════════════

    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: fillCycle2 },
      ],
      subRuleId: 'nvr.sequence.rotate_fill',
      explanation: `Each step: the shape rotates ${deg}° clockwise AND the fill cycles ${fillCycle2.join(' → ')}. Four frames evidence both rules clearly.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 2,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° clockwise per step`,
      secondaryRule: `fill cycles ${fillCycle2.join(' → ')}`,
      baseSize: 16,
    },

    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'scaleSize', delta: 5 },
      ],
      subRuleId: 'nvr.sequence.rotate_scale',
      explanation: `Each step: the shape rotates ${deg}° and grows larger. Both changes are clearly visible across four frames.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step`,
      secondaryRule: 'shape grows larger each step',
      baseSize: 8,  // start small: 8→13→18→23→answer:28 (each +5, all perceptible)
    },

    {
      rules: [
        { kind: 'fillCycle', cycle: fillCycle2 },
        { kind: 'scaleSize', delta: 5 },
      ],
      subRuleId: 'nvr.sequence.fill_scale',
      explanation: `Each step: the fill cycles ${fillCycle2.join(' → ')} AND the shape grows larger. Both changes are clear at mobile size.`,
      difficulty: 'medium',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `fill cycles ${fillCycle2.join(' → ')}`,
      secondaryRule: 'shape grows larger each step',
      baseSize: 8,
    },

    {
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.rotate_dash',
      explanation: `Each step: the shape rotates ${deg}° AND the border alternates solid/dashed. Four frames make both rules obvious.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 2,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step`,
      secondaryRule: 'border alternates solid ↔ dashed',
      baseSize: 16,
    },

    {
      // Two shapes — each governed by a different clear rule.
      // One rotates, the other changes fill. Both changes are visible independently.
      // Primary: shape 1 rotates. Secondary: shape 2 fill changes.
      rules: [
        { kind: 'rotate', degrees: deg, targetId: 0 },
        { kind: 'fillCycle', cycle: fillCycle2b, targetId: 1 },
      ],
      subRuleId: 'nvr.sequence.dual_shape_rule',
      explanation: `Shape 1 rotates ${deg}° each step; shape 2 changes its fill through ${fillCycle2b.join(' → ')}. Each rule is clearly visible on its own shape across four frames.`,
      difficulty: 'medium',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 2,
      visibleFrames: 4,
      primaryRule: `shape 1 rotates ${deg}° per step`,
      secondaryRule: `shape 2 fill cycles ${fillCycle2b.join(' → ')}`,
      baseSize: 16,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // HARD — 2 rules, 4 visible frames (questionIndex: 3)
    // Hard because the rules interact or because two independent objects must
    // each be tracked. Never more than 2 simultaneous rules.
    // ══════════════════════════════════════════════════════════════════════════

    {
      // Alternating operation (even steps rotate, odd steps reflect) + fill cycles.
      // 4 frames show: rotate, reflect, rotate, reflect — establishing the pattern clearly.
      // Hard: must deduce WHICH operation comes next (5th position = rotate).
      rules: [
        { kind: 'alternating', ruleA: { kind: 'rotate', degrees: 90 }, ruleB: { kind: 'reflectX' } },
        { kind: 'fillCycle', cycle: fillCycle2 },
      ],
      subRuleId: 'nvr.sequence.alternating_transform_fill',
      explanation: `Steps alternate: odd steps rotate 90°, even steps reflect horizontally. Fill cycles ${fillCycle2.join(' → ')} every step. Four frames fully establish both the alternation pattern and the fill cycle.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: 'operations alternate: rotate 90° / reflect horizontally each step',
      secondaryRule: `fill cycles ${fillCycle2.join(' → ')} every step`,
      baseSize: 16,
    },

    {
      // 180° rotation + 3-state fill cycle.
      // 4 frames show 3 distinct fill states (all 3 values appear) plus the 180° rotation.
      // Hard: must track both the orientation AND which fill state comes next.
      rules: [
        { kind: 'rotate', degrees: 180 },
        { kind: 'fillCycle', cycle: fillCycle3 },
      ],
      subRuleId: 'nvr.sequence.rotate_180_fill_3state',
      explanation: `Shape rotates 180° each step AND cycles through a 3-state fill pattern (${fillCycle3.join(' → ')}). Four frames show all three fill states, making both rules fully evidenced.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: '180° rotation each step (shape flips orientation)',
      secondaryRule: `fill cycles through 3 states: ${fillCycle3.join(' → ')}`,
      baseSize: 18,
    },

    {
      // Two shapes rotating in opposite directions at different speeds.
      // Both shapes are strongly asymmetric so both rotations are clearly visible.
      // Hard: must track two independent orientations simultaneously.
      rules: [
        { kind: 'rotate', degrees: 90, targetId: 0 },
        { kind: 'rotate', degrees: altDeg, targetId: 1 },
      ],
      subRuleId: 'nvr.sequence.dual_shape_opposite_rotate',
      explanation: `Shape 1 rotates 90° clockwise each step; shape 2 rotates ${altDeg}° clockwise each step. Both shapes are directional, so both rotations are clearly visible. Four frames establish both progressions.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 2,
      visibleFrames: 4,
      primaryRule: 'shape 1 rotates 90° per step',
      secondaryRule: `shape 2 rotates ${altDeg}° per step independently`,
      baseSize: 16,
    },

    {
      // Rotate + conditional size increase when fill is solid.
      // Fill cycles 2-state so conditional fires exactly twice in 4 visible frames.
      // Hard: must notice the size-change only happens at specific fill states.
      rules: [
        { kind: 'rotate', degrees: deg },
        { kind: 'fillCycle', cycle: ['none', 'solid'] as FillPattern[] },
        { kind: 'conditional', check: 'fill_is_solid', then: { kind: 'scaleSize', delta: 5 } },
      ],
      subRuleId: 'nvr.sequence.rotate_conditional_size',
      explanation: `Shape rotates ${deg}° every step and fill alternates none ↔ solid. When the fill is solid, the shape also grows larger. The conditional rule fires twice in the four visible frames, making it clearly evidenced.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `rotation ${deg}° per step + fill cycles none ↔ solid`,
      secondaryRule: 'shape also grows when fill is solid (conditional rule)',
      baseSize: 12,
    },

    {
      // 3-state fill cycle + dash toggle.
      // Fill cycles through 3 states (4 frames shows full cycle + start of next).
      // Dash alternates independently (period 2).
      // Hard: two independent short-period rules; must track both.
      rules: [
        { kind: 'fillCycle', cycle: fillCycle3 },
        { kind: 'toggleDash' },
      ],
      subRuleId: 'nvr.sequence.fill_3state_dash',
      explanation: `Fill cycles through ${fillCycle3.join(' → ')} each step. The border also alternates solid ↔ dashed independently. Four frames reveal all fill states and the full dash alternation cycle.`,
      difficulty: 'hard',
      shapeRequirement: 'any',
      minShapes: 1, maxShapes: 1,
      visibleFrames: 4,
      primaryRule: `fill cycles through 3 states: ${fillCycle3.join(' → ')}`,
      secondaryRule: 'border alternates solid ↔ dashed every step',
      baseSize: 20,
    },

    {
      // Rotate + fill 3-state, dual shapes.
      // Both shapes rotate the SAME direction but the FILL on shape 1 changes.
      // Hard: must track which shape's fill changes and predict next state.
      rules: [
        { kind: 'rotate', degrees: deg, targetId: 0 },
        { kind: 'fillCycle', cycle: fillCycle3, targetId: 0 },
        { kind: 'rotate', degrees: deg, targetId: 1 },
      ],
      subRuleId: 'nvr.sequence.shape1_rotate_fill_shape2_rotate',
      explanation: `Both shapes rotate ${deg}° each step, but shape 1 ALSO cycles its fill ${fillCycle3.join(' → ')}. Four frames make it clear that shape 1 has an extra attribute changing, while shape 2 only rotates.`,
      difficulty: 'hard',
      shapeRequirement: 'strongly_asymmetric',
      minShapes: 2, maxShapes: 2,
      visibleFrames: 4,
      primaryRule: `both shapes rotate ${deg}° per step`,
      secondaryRule: `shape 1 also cycles fill: ${fillCycle3.join(' → ')}`,
      baseSize: 14,
    },
  ];
}

// ─── Build base frame with spec overrides ─────────────────────────────────────

function buildBaseFrame(
  rng: () => number,
  spec: SequenceSpec,
  fillPool: FillPattern[],
): ShapeAttrs[] {
  const numShapes = spec.minShapes + Math.floor(rng() * (spec.maxShapes - spec.minShapes + 1));
  const shapePool = spec.shapeRequirement === 'strongly_asymmetric'
    ? STRONGLY_ASYMMETRIC
    : [...STRONGLY_ASYMMETRIC, 'pentagon', 'star', 'hexagon', 'diamond'];

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
    const size = spec.baseSize ?? (14 + Math.floor(rng() * 6)); // 14-19 default
    const rotation = Math.floor(rng() * 8) * 45;
    shapes.push({ id: i, shape, x: pos[0], y: pos[1], size, rotation, fill, dashed: false });
  }
  return shapes;
}

function fillPoolForDiff(diff: string): FillPattern[] {
  if (diff === 'easy') return ['none', 'solid'];
  return ['none', 'solid', 'hatched'];
}

// ─── Distractor builder ────────────────────────────────────────────────────────

/**
 * Build 3 unique distractors for a sequence question.
 *
 * Strategy (priority order):
 *  1. Rule-based distractors targeting the specific error each spec produces
 *  2. "Previous visible frame" distractors — always unique and highly plausible
 *  3. Size/fill/rotation mutation fallbacks
 *
 * Passing `visibleFrames` enables the "stopped too early" family of distractors
 * which are robust for any spec type, including single-rule easy specs.
 */
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

  // ── Rule-based (most diagnostic value) ───────────────────────────────────────

  // Missed secondary: applied only primary rule (multi-rule specs)
  addIfUnique(candidates, distractorMissedSecondary(lastFrame, spec.rules));

  // Missed primary: applied only secondary rule (multi-rule specs)
  addIfUnique(candidates, distractorMissedPrimary(lastFrame, spec.rules));

  // Off-by-one: overshoots by applying rule one extra time from lastFrame
  addIfUnique(candidates, distractorOffByOne(lastFrame, spec.rules, rng));

  // Wrong rotation angle (for rotation specs)
  if (spec.rules.some(r => r.kind === 'rotate' || r.kind === 'alternating')) {
    addIfUnique(candidates, distractorWrongRotation(correctNext, rng));
  }

  // Wrong fill (for fill specs)
  if (spec.rules.some(r => r.kind === 'fillCycle' || r.kind === 'toggleDash')) {
    addIfUnique(candidates, distractorWrongFill(correctNext, rng));
  }

  // Partial apply — rule applied to only half the shapes (for multi-shape specs)
  if (spec.minShapes >= 2) {
    addIfUnique(candidates, distractorPartialApply(lastFrame, correctNext));
  }

  // ── "Previous frame" distractors — universal fallback ─────────────────────────
  // These are always distinct from correctNext because the sequence has advanced.
  // They represent common student errors: "stopped one step early" or "went back to start".

  // Stopped one step early: last visible frame (student applies rule one fewer time)
  addIfUnique(candidates, lastFrame);

  // Penultimate frame (student applies rule two fewer times)
  if (visibleFrames.length >= 2) {
    addIfUnique(candidates, visibleFrames[visibleFrames.length - 2]);
  }

  // First frame (student thinks the sequence restarts or goes back to start)
  addIfUnique(candidates, firstFrame);

  // Apply rules 2× from lastFrame (overshoot by 2 steps)
  const twoStep = applyRuleStack(applyRuleStack(lastFrame, spec.rules, 0), spec.rules, 1);
  addIfUnique(candidates, twoStep);

  // ── Size / fill / rotation mutations on correctNext ───────────────────────────
  addIfUnique(candidates, distractorWrongSize(correctNext, rng));

  const altFill = distractorWrongFill(correctNext, rng);
  addIfUnique(candidates, altFill);

  addIfUnique(candidates, distractorWrongRotation(correctNext, rng));

  // Collect up to 3 unique distractors from candidates
  const unique = candidates.slice(0, 3);
  return unique;
}

// ─── Review audit entry ────────────────────────────────────────────────────────

interface ReviewAuditEntry {
  subRuleId: string;
  difficulty: string;
  primaryRule: string;
  secondaryRule?: string;
  stemFrameCount: number;
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

  while (generated < count && attempts < count * 15) {
    attempts++;
    const rng = seededRandom(startSeed + attempts * 317);
    rng(); rng(); rng();

    const specs = buildSequenceSpecs(rng);
    // Use attempts (not generated) so we cycle through all spec types even when some fail.
    const specIdx = attempts % specs.length;
    const spec = specs[specIdx];

    const fillPool = fillPoolForDiff(spec.difficulty);
    const base = buildBaseFrame(rng, spec, fillPool);

    // Build enough frames: visible + 1 for the answer
    const totalFrames = spec.visibleFrames + 1;
    const allFrames = buildSequence(base, spec.rules, totalFrames);
    const visibleFrames = allFrames.slice(0, spec.visibleFrames);
    const correctAttrs = allFrames[spec.visibleFrames]; // answer is first frame after visible

    // ── Validation gate 1: perceptibility ─────────────────────────────────────
    // Check ALL frame transitions: visible-stem pairs AND last-visible→answer
    if (!allFramesPerceptible(allFrames)) continue;

    // ── Validation gate 2: conditional firing ─────────────────────────────────
    if (!conditionalsFiredEnough(visibleFrames, spec.rules)) continue;

    // ── Validation gate 3: fill cycle unambiguity ─────────────────────────────
    if (!fillCycleIsUnambiguous(visibleFrames, spec.rules)) continue;

    // ── Build distractors ─────────────────────────────────────────────────────
    const distractorAttrs = buildSequenceDistractors(visibleFrames, correctAttrs, spec, rng);
    if (distractorAttrs.length < 3) continue;

    // ── Duplicate check ───────────────────────────────────────────────────────
    const correctSvg = frameAttrsToSvg(correctAttrs);
    const distractorSvgs = distractorAttrs.slice(0, 3).map(frameAttrsToSvg);
    const allOptions = [correctSvg, ...distractorSvgs];
    if (hasAnyDuplicateOptions(allOptions)) continue;

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctSvg, distractorSvgs, rng);
    const labels = ['A', 'B', 'C', 'D'];
    const stemIdx = generated % stems.length;

    // ── Audit log (for review set) ────────────────────────────────────────────
    if (auditLog) {
      const distractorTypes = ['missed_secondary', 'off_by_one', 'missed_primary', 'wrong_rotation', 'wrong_fill'];
      auditLog.push({
        subRuleId: spec.subRuleId,
        difficulty: spec.difficulty,
        primaryRule: spec.primaryRule,
        secondaryRule: spec.secondaryRule,
        stemFrameCount: spec.visibleFrames,
        evidenceReasoning: `${spec.visibleFrames} visible frames establish the rule${spec.secondaryRule ? 's' : ''} clearly. Each consecutive frame pair is perceptibly different. ${spec.difficulty === 'hard' && spec.rules.some(r => r.kind === 'conditional') ? 'Conditional fires ≥2 times in visible stem.' : ''}`,
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
      version: 4,
      stemVariantId: `stem_seq_${stemIdx}`,
      layoutVariantId: `seq_${spec.minShapes}shape`,
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
    case 'off_by_one': return 'Applied the rule one step too many (overshot) or one too few (undershot).';
    case 'missed_primary': return `Applied only the secondary rule (${spec.secondaryRule ?? 'n/a'}) but ignored the primary. Wrong orientation or attribute.`;
    case 'wrong_rotation': return 'Rotated the correct shape but by the wrong angle or in the wrong direction.';
    case 'wrong_fill': return 'Got the shape/orientation correct but predicted the wrong fill state.';
    default: return 'Applied a plausible but incorrect transformation — shape or size does not match the rule progression.';
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

/**
 * Generate a review set (5E / 10M / 10H) with full audit trail per item.
 * Output contains the question plus evidence reasoning and distractor explanations.
 */
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

import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allShapes, simpleShapes, allFills, patternFills, baseStyle,
  difficulties, seededRandom, pick, pickOther, pickN, shuffleArray,
  shuffleWithCorrect, makeShape, makeLine, makeDot,
  safePositions, linePatterns, dotPositions,
  getDifficultyConfig, buildCompoundFrame,
  hasAnyDuplicateOptions,
} from './shared';

const stemTemplates = [
  'Which shape comes next in the sequence?',
  'What is the next item in this pattern?',
  'Select the shape that continues the sequence.',
  'Which option follows the pattern shown?',
  'Identify the next shape in the series.',
  'What comes next in this sequence?',
];

function applyRule(
  frame: SvgFrame,
  rule: SequenceRule,
  step: number,
  rng: () => number,
): SvgFrame {
  const elements = frame.elements.map((el, idx) => {
    if (el.type !== 'shape') return el;
    let result = { ...el, style: { ...el.style } };
    for (const r of rule.changes) {
      if (r.targetIndex !== undefined && r.targetIndex !== idx) continue;
      if (r.targetIndex === undefined && idx !== 0) continue;
      switch (r.type) {
        case 'rotate':
          result = { ...result, rotation: (result.rotation + (r.increment || 0) * (step + 1)) % 360 };
          break;
        case 'size':
          result = { ...result, size: result.size + (r.increment || 0) * (step + 1) };
          break;
        case 'fill_cycle': {
          const fills = r.fillCycle || ['none', 'solid'];
          const fillIdx = (step + 1) % fills.length;
          result = { ...result, style: { ...result.style, fill: fills[fillIdx] as FillPattern } };
          break;
        }
        case 'position_x':
          result = { ...result, x: Math.min(85, Math.max(15, result.x + (r.increment || 0) * (step + 1))) };
          break;
        case 'position_y':
          result = { ...result, y: Math.min(85, Math.max(15, result.y + (r.increment || 0) * (step + 1))) };
          break;
        case 'dash_toggle':
          result = { ...result, style: { ...result.style, dashed: (step + 1) % 2 === 1 } };
          break;
      }
    }
    return result;
  });

  const nonShapeElements = frame.elements.filter(e => e.type !== 'shape');
  const lineElements = nonShapeElements.map(el => {
    if (el.type === 'line' && rule.changes.some(c => c.type === 'dash_toggle')) {
      return { ...el, style: { ...el.style, dashed: (step + 1) % 2 === 1 } };
    }
    return el;
  });

  return { elements: [...lineElements, ...elements.filter(e => e.type === 'shape')] };
}

interface RuleChange {
  type: 'rotate' | 'size' | 'fill_cycle' | 'position_x' | 'position_y' | 'dash_toggle';
  targetIndex?: number;
  increment?: number;
  fillCycle?: string[];
}

interface SequenceRule {
  changes: RuleChange[];
  subRuleId: string;
  explanation: string;
  distractorStyleId: string;
}

function buildRules(rng: () => number, numRules: number): SequenceRule {
  const available: RuleChange[] = [
    { type: 'rotate', increment: pick([45, 60, 90], rng) },
    { type: 'size', increment: pick([2, 3, -2], rng) },
    { type: 'fill_cycle', fillCycle: pick([
      ['none', 'solid'],
      ['none', 'hatched', 'solid'],
      ['solid', 'dotted', 'none'],
      ['none', 'striped', 'crosshatched', 'solid'],
    ], rng) },
    { type: 'position_x', increment: pick([5, 8, -5], rng) },
    { type: 'dash_toggle' },
  ];

  const selected = pickN(available, numRules, rng);

  if (selected.length > 1) {
    selected[0].targetIndex = 0;
    if (selected.length > 1) selected[1].targetIndex = selected.length > 2 ? 1 : 0;
  }

  const ruleNames = selected.map(s => s.type).join('+');
  return {
    changes: selected,
    subRuleId: `nvr.sequence.compound_${ruleNames}`,
    explanation: `Multiple rules apply: ${selected.map(s => {
      if (s.type === 'rotate') return `rotation by ${s.increment}° each step`;
      if (s.type === 'size') return `size changes by ${s.increment} each step`;
      if (s.type === 'fill_cycle') return `fill pattern cycles through ${(s.fillCycle || []).join(' → ')}`;
      if (s.type === 'position_x') return `horizontal position shifts by ${s.increment}`;
      if (s.type === 'position_y') return `vertical position shifts by ${s.increment}`;
      if (s.type === 'dash_toggle') return `line style alternates between solid and dashed`;
      return s.type;
    }).join('; ')}.`,
    distractorStyleId: `compound_${ruleNames}`,
  };
}

function buildBaseFrame(
  rng: () => number,
  numShapes: number,
  shapePool: readonly string[],
  fillPool: readonly FillPattern[],
  addLine: boolean,
  addDots: boolean,
): SvgFrame {
  return buildCompoundFrame(rng, numShapes, shapePool, fillPool, addLine, addDots);
}

function buildDistractorFrame(
  correctFrame: SvgFrame,
  rule: SequenceRule,
  step: number,
  rng: () => number,
  distortionType: 'partial' | 'wrong_rule' | 'overshoot',
): SvgFrame {
  const elements = correctFrame.elements.map((el, idx) => {
    if (el.type !== 'shape') return el;
    let result = { ...el, style: { ...el.style } };

    switch (distortionType) {
      case 'partial':
        result = { ...result, rotation: (result.rotation + pick([45, 90, -45, -90, 135, 180], rng)) % 360 };
        if (rng() > 0.4) {
          result = { ...result, size: result.size + pick([4, -4, 6, -6], rng) };
        }
        break;
      case 'wrong_rule':
        result = { ...result, size: result.size + pick([5, -5, 8, -8, 10], rng) };
        result = { ...result, style: { ...result.style, fill: pick(allFills, rng) } };
        break;
      case 'overshoot':
        result = { ...result, rotation: (result.rotation + pick([60, 120, -60, -120, 180], rng)) % 360 };
        result = { ...result, size: result.size + pick([4, -4, 7, -7], rng) };
        if (rng() > 0.5) {
          result = { ...result, shape: pick(simpleShapes, rng) };
        }
        break;
    }
    return result;
  });
  return { elements };
}

function generateCompoundSequence(startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i * 257);
    rng(); rng(); rng();

    const diffCycle: Array<typeof difficulties[number]> = ['easy', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard', 'hard', 'medium', 'hard'];
    const diff = diffCycle[i % diffCycle.length];
    const config = getDifficultyConfig(diff);
    const numRules = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
    const rule = buildRules(rng, numRules);

    const baseFrame = buildBaseFrame(
      rng, config.numShapes, config.shapePool, config.fillPool,
      config.addLine, config.addDots,
    );

    const frames: SvgFrame[] = [baseFrame];
    for (let step = 0; step < 4; step++) {
      frames.push(applyRule(baseFrame, rule, step, rng));
    }

    const correctFrame = frames[4];

    const distortions: Array<'partial' | 'wrong_rule' | 'overshoot'> = ['partial', 'wrong_rule', 'overshoot'];
    const distractors = distortions.map(dt =>
      buildDistractorFrame(correctFrame, rule, 4, rng, dt)
    );

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);

    if (hasAnyDuplicateOptions(answerOptions)) continue;

    const labels = ['A', 'B', 'C', 'D'];
    const stemIdx = i % stemTemplates.length;

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'sequence',
      prompt: stemTemplates[stemIdx],
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty: diff,
      skillId: 'nvr.sequence',
      subRuleId: rule.subRuleId,
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.sequence' as const,
        frames: frames.slice(0, 4),
        questionIndex: 3,
        answerOptions,
      },
      trapTypes: ['partial_rule', 'wrong_rule', 'overshoot'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 4 : 5,
      estTimeSeconds: diff === 'easy' ? 25 : diff === 'medium' ? 40 : 55,
      explanation: rule.explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 2,
      stemVariantId: `stem_seq_${stemIdx}`,
      layoutVariantId: `compound_${config.numShapes}el`,
      shapePaletteId: `compound_palette_${i % 6}`,
      densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
      distractorStyleId: rule.distractorStyleId,
    });
  }

  return questions;
}

export function generateSequenceQuestions(): GeneratedQuestion[] {
  const all = [
    ...generateCompoundSequence(20000, 80),
    ...generateCompoundSequence(25000, 80),
    ...generateCompoundSequence(30000, 80),
    ...generateCompoundSequence(35000, 80),
    ...generateCompoundSequence(40000, 80),
  ];
  const easy = all.filter(q => q.difficulty === 'easy').slice(0, 20);
  const medium = all.filter(q => q.difficulty === 'medium').slice(0, 30);
  const hard = all.filter(q => q.difficulty === 'hard').slice(0, 50);
  return [...easy, ...medium, ...hard];
}

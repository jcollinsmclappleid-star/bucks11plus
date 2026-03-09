import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allShapes, simpleShapes, complexShapes, allFills,
  difficulties, seededRandom, pick, pickOther, shuffleArray,
  shuffleWithCorrect, makeShape, makeLine, makeDot,
  safePositions, getDifficultyConfig, buildCompoundFrame,
  hasAnyDuplicateOptions,
} from './shared';

const stemTemplates = [
  'Shape A is to Shape B as Shape C is to…?',
  'If Shape A becomes Shape B, what does Shape C become?',
  'Shape A transforms into Shape B. Apply the same rule to Shape C.',
  'Which option shows Shape C after the same transformation as A → B?',
];

function applyRotation(el: SvgElement, degrees: number): SvgElement {
  if (el.type === 'shape') return { ...el, rotation: (el.rotation + degrees) % 360 };
  return el;
}

function reflectX(el: SvgElement): SvgElement {
  if (el.type === 'shape') return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
  if (el.type === 'line') return { ...el, x1: 100 - el.x1, x2: 100 - el.x2 };
  if (el.type === 'dot') return { ...el, x: 100 - el.x };
  return el;
}

function reflectY(el: SvgElement): SvgElement {
  if (el.type === 'shape') return { ...el, y: 100 - el.y, rotation: (180 - el.rotation + 360) % 360 };
  if (el.type === 'line') return { ...el, y1: 100 - el.y1, y2: 100 - el.y2 };
  if (el.type === 'dot') return { ...el, y: 100 - el.y };
  return el;
}

function applyToFrame(frame: SvgFrame, fn: (el: SvgElement) => SvgElement): SvgFrame {
  return { elements: frame.elements.map(fn) };
}

interface TransformDef {
  subRuleId: string;
  transform: (el: SvgElement) => SvgElement;
  wrongTransforms: ((el: SvgElement) => SvgElement)[];
  explanation: string;
  traps: string[];
  distractorStyleId: string;
}

const transformDefs: TransformDef[] = [
  {
    subRuleId: 'nvr.transform.rotate_90',
    transform: (el) => applyRotation(el, 90),
    wrongTransforms: [
      (el) => applyRotation(el, 180),
      (el) => applyRotation(el, 270),
      (el) => applyRotation(el, 45),
    ],
    explanation: 'Each element is rotated 90° clockwise.',
    traps: ['wrong_rotation', 'reversed_direction'],
    distractorStyleId: 'wrong_rotation',
  },
  {
    subRuleId: 'nvr.transform.rotate_180',
    transform: (el) => applyRotation(el, 180),
    wrongTransforms: [
      (el) => applyRotation(el, 90),
      (el) => applyRotation(el, 270),
      (el) => reflectX(el),
    ],
    explanation: 'Each element is rotated 180°.',
    traps: ['wrong_rotation', 'partial_rule'],
    distractorStyleId: 'wrong_rotation',
  },
  {
    subRuleId: 'nvr.transform.reflect_x',
    transform: reflectX,
    wrongTransforms: [
      reflectY,
      (el) => applyRotation(el, 180),
      (el) => { const r = reflectX(el); return applyRotation(r, 45); },
    ],
    explanation: 'Each element is reflected horizontally (across the vertical axis).',
    traps: ['wrong_axis', 'partial_rule'],
    distractorStyleId: 'wrong_axis',
  },
  {
    subRuleId: 'nvr.transform.reflect_y',
    transform: reflectY,
    wrongTransforms: [
      reflectX,
      (el) => applyRotation(el, 180),
      (el) => { const r = reflectY(el); return applyRotation(r, 90); },
    ],
    explanation: 'Each element is reflected vertically (across the horizontal axis).',
    traps: ['wrong_axis', 'partial_rule'],
    distractorStyleId: 'wrong_axis',
  },
];

function ensureAxisSafety(x: number, y: number, subRuleId: string): [number, number] {
  let safeX = x;
  let safeY = y;
  if (subRuleId.includes('reflect_x') && Math.abs(safeX - 50) < 10) {
    safeX = safeX <= 50 ? 38 : 62;
  }
  if (subRuleId.includes('reflect_y') && Math.abs(safeY - 50) < 10) {
    safeY = safeY <= 50 ? 38 : 62;
  }
  return [safeX, safeY];
}

export function generateRotationReflectionQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const perSubRule = 20;

  for (const def of transformDefs) {
    for (let i = 0; i < perSubRule; i++) {
      let seedOffset = 0;
      let question: GeneratedQuestion | null = null;

      while (seedOffset < 10) {
        const rng = seededRandom(50000 + transformDefs.indexOf(def) * 10000 + i * 173 + seedOffset);
        rng(); rng(); rng();

        const diffWeights: Array<typeof difficulties[number]> = ['easy', 'medium', 'medium', 'hard', 'hard', 'hard'];
        const diff = pick(diffWeights, rng);
        const config = getDifficultyConfig(diff);
        const stemIdx = i % stemTemplates.length;

        const frameA = buildCompoundFrame(
          rng, config.numShapes, config.shapePool, config.fillPool,
          config.addLine, config.addDots,
        );

        frameA.elements = frameA.elements.map(el => {
          if (el.type === 'shape') {
            const [sx, sy] = ensureAxisSafety(el.x, el.y, def.subRuleId);
            return { ...el, x: sx, y: sy };
          }
          return el;
        });

        const frameB = applyToFrame(frameA, def.transform);

        const frameC = buildCompoundFrame(
          rng, config.numShapes, config.shapePool, config.fillPool,
          config.addLine, config.addDots,
        );

        frameC.elements = frameC.elements.map(el => {
          if (el.type === 'shape') {
            const [sx, sy] = ensureAxisSafety(el.x, el.y, def.subRuleId);
            return { ...el, x: sx, y: sy };
          }
          return el;
        });

        const correctFrame = applyToFrame(frameC, def.transform);
        const distractors = def.wrongTransforms.map(wt => applyToFrame(frameC, wt));

        const allOptions = [correctFrame, ...distractors];
        if (hasAnyDuplicateOptions(allOptions)) {
          seedOffset++;
          continue;
        }

        const { options: answerOptions, correctIndex } = shuffleWithCorrect(correctFrame, distractors, rng);
        const labels = ['A', 'B', 'C', 'D'];

        question = {
          section: 'Non-Verbal Reasoning',
          type: 'rotation_reflection',
          prompt: stemTemplates[stemIdx],
          options: labels,
          correctAnswer: labels[correctIndex],
          difficulty: diff,
          skillId: 'nvr.transform',
          subRuleId: def.subRuleId,
          renderType: 'svg',
          renderConfig: {
            kind: 'nvr.transform' as const,
            promptFrames: [frameA, frameB, frameC],
            answerOptions,
          },
          trapTypes: def.traps,
          cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 4 : 5,
          estTimeSeconds: diff === 'easy' ? 25 : diff === 'medium' ? 40 : 55,
          explanation: def.explanation,
          qaStatus: 'approved',
          locale: 'en-GB',
          britishSpelling: true,
          version: 2,
          stemVariantId: `stem_rr_${stemIdx}`,
          layoutVariantId: `compound_${config.numShapes}el`,
          shapePaletteId: `rr_palette_${i % 6}`,
          distractorStyleId: def.distractorStyleId,
          densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
        };
        break;
      }

      if (question) questions.push(question);
    }
  }

  return questions;
}

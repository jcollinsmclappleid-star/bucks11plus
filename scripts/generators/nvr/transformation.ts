import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allShapes, simpleShapes, complexShapes, allFills, patternFills, baseStyle,
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
  if (el.type !== 'shape') return el;
  return { ...el, rotation: (el.rotation + degrees) % 360 };
}

function reflectX(el: SvgElement): SvgElement {
  if (el.type === 'shape') {
    return { ...el, x: 100 - el.x, rotation: (360 - el.rotation) % 360 };
  }
  if (el.type === 'line') {
    return { ...el, x1: 100 - el.x1, x2: 100 - el.x2 };
  }
  if (el.type === 'dot') {
    return { ...el, x: 100 - el.x };
  }
  return el;
}

function reflectY(el: SvgElement): SvgElement {
  if (el.type === 'shape') {
    return { ...el, y: 100 - el.y, rotation: (180 - el.rotation + 360) % 360 };
  }
  if (el.type === 'line') {
    return { ...el, y1: 100 - el.y1, y2: 100 - el.y2 };
  }
  if (el.type === 'dot') {
    return { ...el, y: 100 - el.y };
  }
  return el;
}

function toggleFill(el: SvgElement, fills: FillPattern[]): SvgElement {
  if (el.type !== 'shape') return el;
  const currentIdx = fills.indexOf(el.style.fill);
  const nextIdx = (currentIdx + 1) % fills.length;
  return { ...el, style: { ...el.style, fill: fills[nextIdx] } };
}

function scaleSize(el: SvgElement, factor: number): SvgElement {
  if (el.type !== 'shape') return el;
  return { ...el, size: Math.max(8, Math.round(el.size * factor)) };
}

function toggleDash(el: SvgElement): SvgElement {
  if (el.type === 'line' || el.type === 'shape') {
    return { ...el, style: { ...el.style, dashed: !el.style.dashed } };
  }
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

function getTransformDefs(rng: () => number): TransformDef[] {
  const rotAngle = pick([90, 180, 270], rng);
  const fillCycle: FillPattern[] = pick([
    ['none', 'solid'],
    ['none', 'hatched'],
    ['solid', 'dotted'],
  ] as FillPattern[][], rng);
  const scaleFactor = pick([0.7, 1.3], rng);

  return [
    {
      subRuleId: 'nvr.transform.rotate_reflect',
      transform: (el) => reflectX(applyRotation(el, rotAngle)),
      wrongTransforms: [
        (el) => applyRotation(el, rotAngle),
        (el) => reflectX(el),
        (el) => reflectY(applyRotation(el, rotAngle)),
      ],
      explanation: `Each element is rotated ${rotAngle}° and reflected horizontally.`,
      traps: ['partial_rule', 'wrong_axis', 'wrong_rotation'],
      distractorStyleId: 'rotate_reflect',
    },
    {
      subRuleId: 'nvr.transform.reflect_fill',
      transform: (el) => toggleFill(reflectX(el), fillCycle),
      wrongTransforms: [
        (el) => reflectX(el),
        (el) => toggleFill(el, fillCycle),
        (el) => toggleFill(reflectY(el), fillCycle),
      ],
      explanation: `Each element is reflected horizontally and its fill pattern changes.`,
      traps: ['partial_rule', 'wrong_fill', 'wrong_axis'],
      distractorStyleId: 'reflect_fill',
    },
    {
      subRuleId: 'nvr.transform.rotate_scale',
      transform: (el) => scaleSize(applyRotation(el, rotAngle), scaleFactor),
      wrongTransforms: [
        (el) => applyRotation(el, rotAngle),
        (el) => scaleSize(el, scaleFactor),
        (el) => scaleSize(applyRotation(el, (rotAngle + 90) % 360), scaleFactor),
      ],
      explanation: `Each element is rotated ${rotAngle}° and scaled by ${scaleFactor}x.`,
      traps: ['partial_rule', 'wrong_rotation', 'wrong_size'],
      distractorStyleId: 'rotate_scale',
    },
    {
      subRuleId: 'nvr.transform.reflect_dash',
      transform: (el) => toggleDash(reflectX(el)),
      wrongTransforms: [
        (el) => reflectX(el),
        (el) => toggleDash(el),
        (el) => toggleDash(reflectY(el)),
      ],
      explanation: `Each element is reflected horizontally and line styles toggle between solid and dashed.`,
      traps: ['partial_rule', 'wrong_axis', 'wrong_style'],
      distractorStyleId: 'reflect_dash',
    },
  ];
}

function ensureAxisSafety(x: number, y: number): [number, number] {
  let safeX = x;
  let safeY = y;
  if (Math.abs(safeX - 50) < 10) safeX = safeX <= 50 ? 40 : 60;
  if (Math.abs(safeY - 50) < 10) safeY = safeY <= 50 ? 40 : 60;
  return [safeX, safeY];
}

export function generateTransformationQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 120; i++) {
    let seedOffset = 0;
    let question: GeneratedQuestion | null = null;

    while (seedOffset < 10) {
      const rng = seededRandom(40000 + i * 199 + seedOffset);
      rng(); rng(); rng();

      const defs = getTransformDefs(rng);
      const def = defs[i % defs.length];
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
          const [sx, sy] = ensureAxisSafety(el.x, el.y);
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
          const [sx, sy] = ensureAxisSafety(el.x, el.y);
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
        type: 'transformation',
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
        cognitiveLoad: diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5,
        estTimeSeconds: diff === 'easy' ? 30 : diff === 'medium' ? 45 : 60,
        explanation: def.explanation,
        qaStatus: 'approved',
        locale: 'en-GB',
        britishSpelling: true,
        version: 2,
        stemVariantId: `stem_transform_${stemIdx}`,
        layoutVariantId: `compound_${config.numShapes}el`,
        shapePaletteId: `transform_palette_${i % 6}`,
        distractorStyleId: def.distractorStyleId,
        densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
      };
      break;
    }

    if (question) questions.push(question);
  }

  return questions;
}

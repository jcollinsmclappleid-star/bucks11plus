import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allShapes, simpleShapes, complexShapes, allFills, patternFills,
  difficulties, seededRandom, pick, pickOther, shuffleArray,
  shuffleWithCorrect, makeShape, makeLine, makeDot,
  safePositions, getDifficultyConfig, buildCompoundFrame,
  hasAnyDuplicateOptions,
} from './shared';

const stemVariants = [
  'Which shape is the odd one out?',
  'Which one does not belong?',
  'Identify the shape that is different.',
  'Which option is unlike the others?',
  'Find the odd one out.',
  'Which shape does not fit the pattern?',
];

type SharedRule = {
  name: string;
  buildGroupFrame: (rng: () => number, shapePool: readonly string[], fillPool: readonly FillPattern[]) => SvgFrame;
  buildOddFrame: (rng: () => number, groupFrame: SvgFrame, shapePool: readonly string[], fillPool: readonly FillPattern[]) => SvgFrame;
  explanation: (params: any) => string;
};

function buildSameShapeRule(rng: () => number): SharedRule {
  const commonShape = pick(allShapes, rng);
  const commonFill = pick(allFills, rng) as FillPattern;
  return {
    name: 'same_shape',
    buildGroupFrame: (rng, shapePool, fillPool) => {
      const numShapes = 2 + Math.floor(rng() * 2);
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let i = 0; i < numShapes; i++) {
        const pos = positions[i];
        const size = 12 + Math.floor(rng() * 10);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(commonShape, pos[0], pos[1], size, rotation, commonFill));
      }
      if (rng() > 0.5) {
        elements.push(makeDot(pick([25, 50, 75], rng), pick([25, 50, 75], rng), 2 + rng() * 2));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame, shapePool) => {
      const oddShape = pickOther(allShapes, commonShape, rng);
      return {
        elements: groupFrame.elements.map(el => {
          if (el.type === 'shape') {
            return { ...el, shape: oddShape } as SvgElement;
          }
          return el;
        }),
      };
    },
    explanation: () => `All frames contain ${commonShape} shapes except the odd one out which uses a different shape.`,
  };
}

function buildSameFillRule(rng: () => number): SharedRule {
  const commonFill = pick(allFills, rng) as FillPattern;
  return {
    name: 'same_fill',
    buildGroupFrame: (rng, shapePool, fillPool) => {
      const numShapes = 2 + Math.floor(rng() * 2);
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let i = 0; i < numShapes; i++) {
        const pos = positions[i];
        const shape = pick(shapePool, rng);
        const size = 12 + Math.floor(rng() * 10);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, commonFill));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame) => {
      const oddFill = pickOther(allFills, commonFill, rng) as FillPattern;
      return {
        elements: groupFrame.elements.map(el => {
          if (el.type === 'shape') {
            return { ...el, style: { ...el.style, fill: oddFill } } as SvgElement;
          }
          return el;
        }),
      };
    },
    explanation: () => `All frames use ${commonFill} fill except the odd one out which has a different fill pattern.`,
  };
}

function buildSameCountRule(rng: () => number): SharedRule {
  const commonCount = 2 + Math.floor(rng() * 2);
  return {
    name: 'same_count',
    buildGroupFrame: (rng, shapePool, fillPool) => {
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let i = 0; i < commonCount; i++) {
        const pos = positions[i];
        const shape = pick(shapePool, rng);
        const fill = pick(fillPool, rng);
        const size = 12 + Math.floor(rng() * 10);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, fill));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame, shapePool, fillPool) => {
      const oddCount = commonCount + pick([1, -1, 2], rng);
      const actualCount = Math.max(1, oddCount);
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let i = 0; i < actualCount; i++) {
        const pos = positions[i];
        const shape = pick(shapePool, rng);
        const fill = pick(fillPool, rng);
        const size = 12 + Math.floor(rng() * 10);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, fill));
      }
      return { elements };
    },
    explanation: () => `All frames contain exactly ${commonCount} shapes. The odd one out has a different number.`,
  };
}

function buildHasLineRule(rng: () => number): SharedRule {
  const lineDashed = rng() > 0.5;
  return {
    name: 'has_line',
    buildGroupFrame: (rng, shapePool, fillPool) => {
      const numShapes = 2 + Math.floor(rng() * 2);
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      const isHorizontal = rng() > 0.5;
      elements.push(makeLine(
        isHorizontal ? 10 : 50, isHorizontal ? 50 : 10,
        isHorizontal ? 90 : 50, isHorizontal ? 50 : 90,
        lineDashed,
      ));
      for (let i = 0; i < numShapes; i++) {
        const pos = positions[i];
        const shape = pick(shapePool, rng);
        const fill = pick(fillPool, rng);
        const size = 12 + Math.floor(rng() * 8);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, fill));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame, shapePool, fillPool) => {
      return {
        elements: groupFrame.elements.filter(el => el.type !== 'line'),
      };
    },
    explanation: () => `All frames contain a ${lineDashed ? 'dashed' : 'solid'} dividing line. The odd one out is missing it.`,
  };
}

function getRuleForDifficulty(diff: string, rng: () => number): SharedRule {
  if (diff === 'easy') {
    return pick([buildSameShapeRule, buildSameFillRule], rng)(rng);
  }
  if (diff === 'medium') {
    return pick([buildSameShapeRule, buildSameFillRule, buildSameCountRule], rng)(rng);
  }
  return pick([buildSameCountRule, buildHasLineRule, buildSameFillRule], rng)(rng);
}

export function generateClassificationQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 90; i++) {
    const rng = seededRandom(60000 + i * 313);
    rng(); rng(); rng();

    const diff = pick(difficulties, rng);
    const config = getDifficultyConfig(diff);
    const rule = getRuleForDifficulty(diff, rng);
    const stemIdx = i % stemVariants.length;

    const groupFrames: SvgFrame[] = [];
    for (let g = 0; g < 4; g++) {
      groupFrames.push(rule.buildGroupFrame(rng, config.shapePool, config.fillPool));
    }

    const oddFrame = rule.buildOddFrame(rng, groupFrames[0], config.shapePool, config.fillPool);

    const oddPosition = Math.floor(rng() * 5);
    const allFrames: SvgFrame[] = [];
    let gi = 0;
    for (let f = 0; f < 5; f++) {
      if (f === oddPosition) {
        allFrames.push(oddFrame);
      } else {
        allFrames.push(groupFrames[gi]);
        gi++;
      }
    }

    const labels = ['A', 'B', 'C', 'D', 'E'];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'classification',
      prompt: stemVariants[stemIdx],
      options: labels,
      correctAnswer: labels[oddPosition],
      difficulty: diff,
      skillId: 'nvr.classification',
      subRuleId: `nvr.classification.${rule.name}`,
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.classification' as const,
        group: allFrames,
        answerOptions: allFrames,
      },
      trapTypes: ['partial_rule', 'wrong_attribute'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 5,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 35 : 50,
      explanation: rule.explanation({}),
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 2,
      stemVariantId: `stem_class_${stemIdx}`,
      layoutVariantId: `compound_${rule.name}`,
      shapePaletteId: `class_palette_${i % 6}`,
      densityLevel: diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high',
      distractorStyleId: rule.name,
    });
  }

  return questions;
}

import type { GeneratedQuestion } from '../types';
import {
  type SvgFrame, type SvgElement, type FillPattern,
  allShapes, simpleShapes, allFills, patternFills,
  seededRandom, pick, pickOther, pickN, shuffleArray, shuffleWithCorrect,
  makeShape, makeLine, makeDot,
  safePositions, buildCompoundFrame, hasAnyDuplicateOptions,
  ROTATION_SAFE_SHAPES, STRONGLY_ASYMMETRIC,
} from './shared';

// ─── Stems ────────────────────────────────────────────────────────────────────

const stems = [
  'Which shape is the odd one out?',
  'Which one does not belong to the group?',
  'Identify the shape that is different from the others.',
  'Which option does not fit the pattern?',
  'Find the shape that does not share the common rule.',
];

// ─── Rule definitions ─────────────────────────────────────────────────────────

type GroupRule = {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  buildGroupFrame: (rng: () => number, i: number) => SvgFrame;
  buildOddFrame: (rng: () => number, groupFrame: SvgFrame) => SvgFrame;
};

function buildSameShapeRule(rng: () => number): GroupRule {
  const commonShape = pick(allShapes, rng);
  const commonFill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
  return {
    name: 'same_shape',
    difficulty: 'easy',
    explanation: `All items share the same shape (${commonShape}); the odd one out uses a different shape.`,
    buildGroupFrame: (rng) => {
      const pos = pick(safePositions, rng);
      const size = 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      return { elements: [makeShape(commonShape, pos[0], pos[1], size, rotation, commonFill)] };
    },
    buildOddFrame: (rng, groupFrame) => {
      const oddShape = pickOther(allShapes, commonShape, rng);
      return {
        elements: groupFrame.elements.map(el =>
          el.type === 'shape' ? makeShape(oddShape, el.x, el.y, el.size, el.rotation, commonFill) : el
        ),
      };
    },
  };
}

function buildSameFillRule(rng: () => number): GroupRule {
  const commonFill = pick(allFills, rng) as FillPattern;
  const shapesUsed = pickN(ROTATION_SAFE_SHAPES, 6, rng);
  return {
    name: 'same_fill',
    difficulty: 'easy',
    explanation: `All items share the same fill pattern (${commonFill}); the odd one out has a different fill.`,
    buildGroupFrame: (rng, i) => {
      const shape = shapesUsed[i % shapesUsed.length];
      const pos = pick(safePositions, rng);
      const size = 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      return { elements: [makeShape(shape, pos[0], pos[1], size, rotation, commonFill)] };
    },
    buildOddFrame: (rng, groupFrame) => {
      const oddFill = pickOther(allFills as FillPattern[], commonFill, rng) as FillPattern;
      return {
        elements: groupFrame.elements.map(el =>
          el.type === 'shape'
            ? { ...el, style: { ...el.style, fill: oddFill } }
            : el
        ),
      };
    },
  };
}

function buildSameCountRule(rng: () => number): GroupRule {
  const commonCount = 2 + Math.floor(rng() * 2); // 2 or 3 shapes in group items
  const shapesUsed = pickN(ROTATION_SAFE_SHAPES, 6, rng);
  return {
    name: 'same_count',
    difficulty: 'medium',
    explanation: `All items contain ${commonCount} shapes; the odd one out has a different number.`,
    buildGroupFrame: (rng, i) => {
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let j = 0; j < commonCount; j++) {
        const shape = shapesUsed[(i + j) % shapesUsed.length];
        const pos = positions[j];
        const fill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
        const size = 12 + Math.floor(rng() * 8);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, fill));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame) => {
      // Different count — add or remove one element
      const elements = [...groupFrame.elements];
      if (elements.length > 1 && rng() > 0.5) {
        return { elements: elements.slice(0, elements.length - 1) };
      } else {
        const pos = pick(safePositions, rng);
        const shape = pick(ROTATION_SAFE_SHAPES, rng);
        const fill = pick(['none', 'solid'] as FillPattern[], rng);
        elements.push(makeShape(shape, pos[0], pos[1], 14, 0, fill));
        return { elements };
      }
    },
  };
}

function buildSameDashRule(rng: () => number): GroupRule {
  const isDashed = rng() > 0.5;
  const shapesUsed = pickN(ROTATION_SAFE_SHAPES, 6, rng);
  return {
    name: 'same_dash_style',
    difficulty: 'medium',
    explanation: `All items have ${isDashed ? 'dashed' : 'solid'} outlines; the odd one out has a different outline style.`,
    buildGroupFrame: (rng, i) => {
      const shape = shapesUsed[i % shapesUsed.length];
      const pos = pick(safePositions, rng);
      const fill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
      const size = 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      const el: SvgElement = {
        type: 'shape', shape, x: pos[0], y: pos[1], size, rotation,
        style: { strokeWidth: 2.5, stroke: '#1E293B', fill, dashed: isDashed },
      };
      return { elements: [el] };
    },
    buildOddFrame: (rng, groupFrame) => ({
      elements: groupFrame.elements.map(el =>
        el.type === 'shape' || el.type === 'line'
          ? { ...el, style: { ...el.style, dashed: !isDashed } }
          : el
      ),
    }),
  };
}

function buildHasLineRule(rng: () => number): GroupRule {
  const shapesUsed = pickN(ROTATION_SAFE_SHAPES, 6, rng);
  const lineTypes = [
    { x1: 0, y1: 50, x2: 100, y2: 50 },
    { x1: 50, y1: 0, x2: 50, y2: 100 },
    { x1: 0, y1: 0, x2: 100, y2: 100 },
  ];
  return {
    name: 'has_line',
    difficulty: 'hard',
    explanation: 'All items contain a line crossing the frame; the odd one out has only shapes and no line.',
    buildGroupFrame: (rng, i) => {
      const shape = shapesUsed[i % shapesUsed.length];
      const pos = pick(safePositions, rng);
      const fill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
      const size = 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      const lp = pick(lineTypes, rng);
      return {
        elements: [
          makeLine(lp.x1, lp.y1, lp.x2, lp.y2, false),
          makeShape(shape, pos[0], pos[1], size, rotation, fill),
        ],
      };
    },
    buildOddFrame: (rng, groupFrame) => ({
      elements: groupFrame.elements.filter(el => el.type === 'shape'),
    }),
  };
}

function buildSameFillPlusShapeRule(rng: () => number): GroupRule {
  // Hard: items share BOTH the same fill AND the same shape family (e.g. all angular shapes)
  const angularShapes = ['right_triangle', 'kite', 'trapezoid', 'arrow'];
  const roundShapes = ['semicircle'];
  const isAngular = rng() > 0.5;
  const shapeGroup = isAngular ? angularShapes : [...STRONGLY_ASYMMETRIC];
  const commonFill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
  const oddShape = isAngular ? pick(['semicircle', 'parallelogram'] as const, rng) : pick(angularShapes as any, rng);
  return {
    name: 'same_fill_and_shape_family',
    difficulty: 'hard',
    explanation: `All items share the same fill (${commonFill}) and belong to the same shape family; the odd one out breaks both rules.`,
    buildGroupFrame: (rng, i) => {
      const shape = pick(shapeGroup as any, rng);
      const pos = pick(safePositions, rng);
      const size = 12 + Math.floor(rng() * 8);
      const rotation = Math.floor(rng() * 8) * 45;
      return { elements: [makeShape(shape, pos[0], pos[1], size, rotation, commonFill)] };
    },
    buildOddFrame: (rng, groupFrame) => ({
      elements: groupFrame.elements.map(el =>
        el.type === 'shape'
          ? makeShape(oddShape, el.x, el.y, el.size, el.rotation,
              pickOther(['none', 'solid', 'hatched'] as FillPattern[], commonFill, rng))
          : el
      ),
    }),
  };
}

function buildSameCountAndFillRule(rng: () => number): GroupRule {
  const commonCount = 2 + Math.floor(rng() * 2);
  const commonFill = pick(['none', 'solid', 'hatched'] as FillPattern[], rng);
  const shapesUsed = pickN(ROTATION_SAFE_SHAPES, 6, rng);
  return {
    name: 'same_count_and_fill',
    difficulty: 'hard',
    explanation: `All items contain ${commonCount} shapes all filled with ${commonFill}; the odd one out breaks either rule.`,
    buildGroupFrame: (rng, i) => {
      const positions = shuffleArray([...safePositions], rng);
      const elements: SvgElement[] = [];
      for (let j = 0; j < commonCount; j++) {
        const shape = shapesUsed[(i + j) % shapesUsed.length];
        const pos = positions[j];
        const size = 12 + Math.floor(rng() * 8);
        const rotation = Math.floor(rng() * 8) * 45;
        elements.push(makeShape(shape, pos[0], pos[1], size, rotation, commonFill));
      }
      return { elements };
    },
    buildOddFrame: (rng, groupFrame) => {
      // Break one of the two rules
      if (rng() > 0.5) {
        // Break count
        const elements = [...groupFrame.elements];
        const pos = pick(safePositions, rng);
        elements.push(makeShape(pick(shapesUsed, rng), pos[0], pos[1], 14, 0, commonFill));
        return { elements };
      } else {
        // Break fill
        const oddFill = pickOther(['none', 'solid', 'hatched', 'dotted'] as FillPattern[], commonFill, rng);
        return {
          elements: groupFrame.elements.map(el =>
            el.type === 'shape' ? { ...el, style: { ...el.style, fill: oddFill } } : el
          ),
        };
      }
    },
  };
}

function getRulesForDiff(rng: () => number, difficulty: 'easy' | 'medium' | 'hard'): GroupRule {
  if (difficulty === 'easy') {
    return pick([buildSameShapeRule(rng), buildSameFillRule(rng)], rng);
  }
  if (difficulty === 'medium') {
    return pick([buildSameCountRule(rng), buildSameDashRule(rng), buildSameFillRule(rng)], rng);
  }
  return pick([buildHasLineRule(rng), buildSameFillPlusShapeRule(rng), buildSameCountAndFillRule(rng)], rng);
}

export function generateClassificationQuestions(): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];
  const diffWeights: Array<'easy' | 'medium' | 'hard'> = [
    'easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'hard',
  ];

  for (let i = 0; i < 90; i++) {
    const rng = seededRandom(110000 + i * 173);
    rng(); rng(); rng();

    const difficulty = diffWeights[i % diffWeights.length];
    const rule = getRulesForDiff(rng, difficulty);
    const stemIdx = i % stems.length;

    // Build 5 group frames + 1 odd
    const groupFrames: SvgFrame[] = [];
    for (let g = 0; g < 5; g++) {
      groupFrames.push(rule.buildGroupFrame(rng, g));
    }

    // The correct answer is the odd one out (built from last group frame)
    const oddFrame = rule.buildOddFrame(rng, groupFrames[groupFrames.length - 1]);

    // Distractors: other group frames re-arranged
    const distractorFrames = [groupFrames[0], groupFrames[1], groupFrames[2]];

    const allOptions = [oddFrame, ...distractorFrames];
    if (hasAnyDuplicateOptions(allOptions)) continue;

    const { options: answerOptions, correctIndex } = shuffleWithCorrect(oddFrame, distractorFrames, rng);
    const labels = ['A', 'B', 'C', 'D'];

    results.push({
      section: 'Non-Verbal Reasoning',
      type: 'classification',
      prompt: stems[stemIdx],
      options: labels,
      correctAnswer: labels[correctIndex],
      difficulty,
      skillId: 'nvr.classification',
      subRuleId: `nvr.classification.${rule.name}`,
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.classification' as const,
        group: groupFrames.slice(0, 4),
        answerOptions,
      },
      trapTypes: ['partial_rule', 'wrong_attribute', 'surface_similarity'],
      cognitiveLoad: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6,
      estTimeSeconds: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 35 : 50,
      explanation: rule.explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 3,
      stemVariantId: `stem_class_${stemIdx}`,
      layoutVariantId: `classification_odd`,
      densityLevel: difficulty === 'easy' ? 'low' : difficulty === 'medium' ? 'medium' : 'high',
      distractorStyleId: rule.name,
    });
  }

  return results;
}

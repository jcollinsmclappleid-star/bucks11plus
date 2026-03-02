import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const shapes = ['circle', 'square', 'triangle', 'star', 'pentagon', 'arrow'] as const;
const baseStyle: SvgStroke = { strokeWidth: 3, stroke: '#111827', fill: 'none', dashed: false };
const difficulties = ['easy', 'medium', 'hard'] as const;

const stemVariants = [
  'Which shape is the odd one out?',
  'Which one does not belong?',
  'Identify the shape that is different.',
  'Which option is unlike the others?',
  'Find the odd one out.',
  'Which shape does not fit the pattern?',
];

const layoutVariants = ['grid-5', 'row-5', 'circle-5', 'staggered-5', 'cross-5', 'arc-5'];

const shapePalettes: string[][] = [
  ['circle', 'square', 'triangle'],
  ['star', 'pentagon', 'arrow'],
  ['triangle', 'star', 'circle'],
  ['square', 'arrow', 'pentagon'],
  ['circle', 'pentagon', 'star'],
  ['triangle', 'arrow', 'square'],
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 48271 + 12345) % 2147483647;
    return (s >>> 0) / 2147483647;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickOther<T>(arr: readonly T[], exclude: T, rng: () => number): T {
  const filtered = arr.filter(x => x !== exclude);
  return filtered[Math.floor(rng() * filtered.length)];
}

function makeElement(shape: string, x: number, y: number, size: number, rotation: number, fill: 'none' | 'solid' = 'none'): SvgElement {
  return { type: 'shape', shape, x, y, size, rotation, style: { ...baseStyle, fill } };
}

type AttributeType = 'shape' | 'fill' | 'rotation';

function generateByAttribute(attrType: AttributeType, startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed * 7 + i * 131);
    rng(); rng(); rng();
    const diff = pick(difficulties, rng);

    const paletteIdx = i % shapePalettes.length;
    const palette = shapePalettes[paletteIdx];
    const stemIdx = i % stemVariants.length;
    const layoutIdx = i % layoutVariants.length;
    const density: 'low' | 'medium' | 'high' = diff === 'easy' ? 'low' : diff === 'medium' ? 'medium' : 'high';

    let groupFrames: SvgFrame[];
    let oddFrame: SvgFrame;
    let explanation: string;

    if (attrType === 'shape') {
      const commonShape = palette[Math.floor(rng() * palette.length)];
      let oddShape = pickOther(palette, commonShape, rng);
      const commonFill = rng() > 0.5 ? 'solid' as const : 'none' as const;
      const oddFill = commonFill === 'solid' ? 'none' as const : 'solid' as const;
      const commonRotation = Math.floor(rng() * 4) * 90;

      groupFrames = Array.from({ length: 4 }, () => {
        return { elements: [makeElement(commonShape, 50, 50, 24, commonRotation, commonFill)] };
      });

      oddFrame = { elements: [makeElement(oddShape, 50, 50, 24, commonRotation, oddFill)] };
      explanation = `Four shapes are ${commonFill === 'solid' ? 'filled' : 'outlined'} ${commonShape}s, but the odd one out is a ${oddFill === 'solid' ? 'filled' : 'outlined'} ${oddShape}.`;
    } else if (attrType === 'fill') {
      const commonShape = palette[Math.floor(rng() * palette.length)];
      const commonFill = rng() > 0.5 ? 'solid' as const : 'none' as const;
      const oddFill = commonFill === 'solid' ? 'none' as const : 'solid' as const;
      const commonRotation = Math.floor(rng() * 4) * 90;

      groupFrames = Array.from({ length: 4 }, () => {
        return { elements: [makeElement(commonShape, 50, 50, 24, commonRotation, commonFill)] };
      });

      oddFrame = { elements: [makeElement(commonShape, 50, 50, 24, commonRotation, oddFill)] };
      explanation = `Four shapes are ${commonFill === 'solid' ? 'filled' : 'outlined'} ${commonShape}s, but the odd one out is ${oddFill === 'solid' ? 'filled' : 'outlined'}.`;
    } else {
      const commonShape = palette[Math.floor(rng() * palette.length)];
      let oddShape = pickOther(palette, commonShape, rng);
      const commonFill = rng() > 0.5 ? 'solid' as const : 'none' as const;
      const commonRotation = Math.floor(rng() * 4) * 90;
      let oddRotation = commonRotation + (rng() > 0.5 ? 45 : 135);
      if (oddRotation >= 360) oddRotation -= 360;

      groupFrames = Array.from({ length: 4 }, () => {
        return { elements: [makeElement(commonShape, 50, 50, 24, commonRotation, commonFill)] };
      });

      oddFrame = { elements: [makeElement(oddShape, 50, 50, 24, oddRotation, commonFill)] };
      explanation = `Four shapes are ${commonShape}s rotated ${commonRotation}°, but the odd one out is a ${oddShape} rotated ${oddRotation}°.`;
    }

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
    const correctLabel = labels[oddPosition];

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'classification',
      prompt: stemVariants[stemIdx],
      options: labels,
      correctAnswer: correctLabel,
      difficulty: diff,
      skillId: 'nvr.classification',
      subRuleId: 'nvr.classification.odd_one_out_attribute',
      renderType: 'svg',
      renderConfig: {
        kind: 'nvr.classification' as const,
        group: allFrames,
        answerOptions: allFrames,
      },
      trapTypes: ['partial_rule', 'wrong_rotation'],
      cognitiveLoad: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4,
      estTimeSeconds: diff === 'easy' ? 20 : diff === 'medium' ? 30 : 45,
      explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
      stemVariantId: `stem-classification-${stemIdx}`,
      layoutVariantId: `layout-${layoutVariants[layoutIdx]}`,
      shapePaletteId: `palette-${paletteIdx}`,
      densityLevel: density,
    });
  }

  return questions;
}

export function generateClassificationQuestions(): GeneratedQuestion[] {
  return [
    ...generateByAttribute('shape', 13000, 20),
    ...generateByAttribute('fill', 14000, 20),
    ...generateByAttribute('rotation', 15000, 20),
  ];
}

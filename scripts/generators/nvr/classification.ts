import type { GeneratedQuestion } from '../types';

type SvgStroke = { strokeWidth: number; stroke: string; fill: 'none' | 'solid'; dashed: boolean };
type SvgElement = { type: 'shape'; shape: string; x: number; y: number; size: number; rotation: number; style: SvgStroke };
type SvgFrame = { elements: SvgElement[] };

const shapes = ['circle', 'square', 'triangle', 'star'] as const;
const baseStyle: SvgStroke = { strokeWidth: 3, stroke: '#111827', fill: 'none', dashed: false };
const difficulties = ['easy', 'medium', 'hard'] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function makeElement(shape: string, x: number, y: number, size: number, rotation: number, fill: 'none' | 'solid' = 'none'): SvgElement {
  return { type: 'shape', shape, x, y, size, rotation, style: { ...baseStyle, fill } };
}

type AttributeType = 'shape' | 'fill' | 'rotation';

function generateByAttribute(attrType: AttributeType, startSeed: number, count: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(startSeed + i);
    const diff = difficulties[Math.floor(rng() * difficulties.length)];

    let groupFrames: SvgFrame[];
    let oddFrame: SvgFrame;
    let explanation: string;

    if (attrType === 'shape') {
      const commonShape = shapes[Math.floor(rng() * shapes.length)];
      let oddShape = shapes[Math.floor(rng() * shapes.length)];
      while (oddShape === commonShape) {
        oddShape = shapes[Math.floor(rng() * shapes.length)];
      }
      const rotations = [0, 45, 90, 135, 180];

      groupFrames = Array.from({ length: 4 }, () => {
        const rot = rotations[Math.floor(rng() * rotations.length)];
        const fill = rng() > 0.5 ? 'solid' as const : 'none' as const;
        return { elements: [makeElement(commonShape, 50, 50, 20, rot, fill)] };
      });

      const oddRot = rotations[Math.floor(rng() * rotations.length)];
      const oddFill = rng() > 0.5 ? 'solid' as const : 'none' as const;
      oddFrame = { elements: [makeElement(oddShape, 50, 50, 20, oddRot, oddFill)] };
      explanation = `Four shapes are ${commonShape}s, but the odd one out is a ${oddShape}.`;
    } else if (attrType === 'fill') {
      const commonFill = rng() > 0.5 ? 'solid' as const : 'none' as const;
      const oddFill = commonFill === 'solid' ? 'none' as const : 'solid' as const;

      groupFrames = Array.from({ length: 4 }, () => {
        const sh = shapes[Math.floor(rng() * shapes.length)];
        const rot = Math.floor(rng() * 8) * 45;
        return { elements: [makeElement(sh, 50, 50, 20, rot, commonFill)] };
      });

      const oddSh = shapes[Math.floor(rng() * shapes.length)];
      const oddRot = Math.floor(rng() * 8) * 45;
      oddFrame = { elements: [makeElement(oddSh, 50, 50, 20, oddRot, oddFill)] };
      explanation = `Four shapes have fill '${commonFill}', but the odd one out has fill '${oddFill}'.`;
    } else {
      const commonRotation = Math.floor(rng() * 4) * 90;
      let oddRotation = commonRotation + 45;
      if (oddRotation >= 360) oddRotation -= 360;

      groupFrames = Array.from({ length: 4 }, () => {
        const sh = shapes[Math.floor(rng() * shapes.length)];
        const fill = rng() > 0.5 ? 'solid' as const : 'none' as const;
        return { elements: [makeElement(sh, 50, 50, 20, commonRotation, fill)] };
      });

      const oddSh = shapes[Math.floor(rng() * shapes.length)];
      const oddFillVal = rng() > 0.5 ? 'solid' as const : 'none' as const;
      oddFrame = { elements: [makeElement(oddSh, 50, 50, 20, oddRotation, oddFillVal)] };
      explanation = `Four shapes are rotated ${commonRotation}°, but the odd one out is rotated ${oddRotation}°.`;
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
    const answerLabels = ['A', 'B', 'C', 'D'];
    const correctLabel = labels[oddPosition];

    const answerOptions: SvgFrame[] = allFrames.slice(0, 4);
    if (oddPosition >= 4) {
      answerOptions[3] = oddFrame;
    }

    questions.push({
      section: 'Non-Verbal Reasoning',
      type: 'classification',
      prompt: 'Which shape is the odd one out?',
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

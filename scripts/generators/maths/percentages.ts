import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: string, distractors: string[]): string[] {
  const opts = new Set<string>();
  opts.add(correct);
  for (const d of distractors) {
    if (d !== correct) opts.add(d);
  }
  while (opts.size < 4) {
    const n = parseFloat(correct) || 1;
    opts.add(String(n + opts.size * 2));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

export function generatePercentageQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const findConfigs: { pct: number; of: number; d: number }[] = [
    { pct: 10, of: 50, d: 1 }, { pct: 25, of: 80, d: 1 }, { pct: 50, of: 120, d: 1 },
    { pct: 20, of: 45, d: 1 }, { pct: 15, of: 60, d: 2 }, { pct: 30, of: 90, d: 2 },
    { pct: 5, of: 200, d: 1 }, { pct: 75, of: 160, d: 2 }, { pct: 12, of: 250, d: 2 },
    { pct: 35, of: 140, d: 2 }, { pct: 8, of: 350, d: 3 }, { pct: 45, of: 220, d: 3 },
    { pct: 60, of: 85, d: 2 }, { pct: 17, of: 300, d: 3 },
  ];
  for (const c of findConfigs) {
    const correct = c.pct * c.of / 100;
    const correctStr = Number.isInteger(correct) ? String(correct) : correct.toFixed(1);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `What is ${c.pct}% of ${c.of}?`,
      options: makeOptions(correctStr, [String(correct + c.pct / 10), String(c.of - correct), String(correct * 2)]),
      correctAnswer: correctStr,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.percentages', subRuleId: 'maths.percentages.find_percentage',
      renderType: 'text', renderConfig: null,
      trapTypes: ['decimal_point_error'],
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.pct}% of ${c.of} = ${c.pct}/100 × ${c.of} = ${correctStr}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const incDecConfigs: { original: number; pct: number; op: 'increase' | 'decrease'; d: number }[] = [
    { original: 100, pct: 10, op: 'increase', d: 1 },
    { original: 200, pct: 25, op: 'increase', d: 1 },
    { original: 80, pct: 50, op: 'decrease', d: 1 },
    { original: 150, pct: 20, op: 'decrease', d: 2 },
    { original: 60, pct: 15, op: 'increase', d: 2 },
    { original: 250, pct: 30, op: 'decrease', d: 2 },
    { original: 120, pct: 5, op: 'increase', d: 1 },
    { original: 340, pct: 12, op: 'decrease', d: 3 },
    { original: 90, pct: 40, op: 'increase', d: 2 },
    { original: 180, pct: 35, op: 'decrease', d: 3 },
    { original: 400, pct: 8, op: 'increase', d: 2 },
    { original: 75, pct: 60, op: 'decrease', d: 3 },
    { original: 500, pct: 15, op: 'increase', d: 2 },
  ];
  for (const c of incDecConfigs) {
    const change = c.original * c.pct / 100;
    const correct = c.op === 'increase' ? c.original + change : c.original - change;
    const correctStr = Number.isInteger(correct) ? String(correct) : correct.toFixed(2);
    const wrong1 = c.op === 'increase' ? c.original - change : c.original + change;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.op === 'increase' ? 'Increase' : 'Decrease'} £${c.original} by ${c.pct}%.`,
      options: makeOptions(correctStr, [String(wrong1), String(change), String(c.original)]),
      correctAnswer: correctStr,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.percentages', subRuleId: 'maths.percentages.increase_decrease',
      renderType: 'text', renderConfig: null,
      trapTypes: ['increase_vs_decrease', 'percentage_of_not_result'],
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `${c.pct}% of £${c.original} = £${change}. ${c.op === 'increase' ? 'Add' : 'Subtract'}: £${c.original} ${c.op === 'increase' ? '+' : '−'} £${change} = £${correctStr}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const reverseConfigs: { final: number; pct: number; op: 'increase' | 'decrease'; original: number; d: number }[] = [
    { final: 110, pct: 10, op: 'increase', original: 100, d: 2 },
    { final: 150, pct: 25, op: 'increase', original: 120, d: 2 },
    { final: 80, pct: 20, op: 'decrease', original: 100, d: 2 },
    { final: 72, pct: 10, op: 'decrease', original: 80, d: 2 },
    { final: 230, pct: 15, op: 'increase', original: 200, d: 3 },
    { final: 63, pct: 30, op: 'decrease', original: 90, d: 3 },
    { final: 180, pct: 20, op: 'increase', original: 150, d: 2 },
    { final: 168, pct: 40, op: 'increase', original: 120, d: 3 },
    { final: 45, pct: 25, op: 'decrease', original: 60, d: 3 },
    { final: 92, pct: 8, op: 'increase', original: 85.19, d: 3 },
    { final: 132, pct: 10, op: 'increase', original: 120, d: 2 },
    { final: 56, pct: 20, op: 'decrease', original: 70, d: 3 },
    { final: 225, pct: 50, op: 'increase', original: 150, d: 2 },
  ];
  for (const c of reverseConfigs) {
    const multiplier = c.op === 'increase' ? 1 + c.pct / 100 : 1 - c.pct / 100;
    const calcOriginal = c.final / multiplier;
    const correctStr = Number.isInteger(calcOriginal) ? String(calcOriginal) : calcOriginal.toFixed(2);
    const wrongDirect = c.op === 'increase' ? c.final - (c.final * c.pct / 100) : c.final + (c.final * c.pct / 100);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `After a ${c.pct}% ${c.op}, the price is £${c.final}. What was the original price?`,
      options: makeOptions(correctStr, [String(wrongDirect), String(c.final), String(c.final - c.pct)]),
      correctAnswer: correctStr,
      difficulty: c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.percentages', subRuleId: 'maths.percentages.reverse',
      renderType: 'text', renderConfig: null,
      trapTypes: ['reverse_percentage_error'],
      cognitiveLoad: c.d, estTimeSeconds: 30 + c.d * 5,
      explanation: `After a ${c.pct}% ${c.op}, multiply by ${multiplier}. Original = £${c.final} ÷ ${multiplier} = £${correctStr}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

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
    const n = parseInt(correct) || 1;
    opts.add(String(n + opts.size));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function generateRatioQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const simplifyConfigs: { a: number; b: number; d: number }[] = [
    { a: 2, b: 4, d: 1 }, { a: 3, b: 6, d: 1 }, { a: 4, b: 8, d: 1 },
    { a: 6, b: 9, d: 1 }, { a: 10, b: 15, d: 2 }, { a: 12, b: 18, d: 2 },
    { a: 8, b: 20, d: 2 }, { a: 14, b: 21, d: 2 }, { a: 15, b: 25, d: 2 },
    { a: 24, b: 36, d: 3 }, { a: 18, b: 45, d: 3 }, { a: 16, b: 28, d: 3 },
    { a: 30, b: 42, d: 3 }, { a: 9, b: 12, d: 2 },
  ];
  for (const c of simplifyConfigs) {
    const g = gcd(c.a, c.b);
    const correct = `${c.a / g}:${c.b / g}`;
    const wrong1 = `${c.a / 2}:${c.b / 2}`;
    const wrong2 = `${c.b / g}:${c.a / g}`;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `Simplify the ratio ${c.a}:${c.b}`,
      options: makeOptions(correct, [wrong1, wrong2, `${c.a}:${c.b}`]),
      correctAnswer: correct,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.ratio', subRuleId: 'maths.ratio.simplify',
      renderType: 'text', renderConfig: null,
      trapTypes: ['incomplete_simplification'],
      distractorStyleId: 'incomplete_simplification', contextId: 'ratio',
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `Divide both parts by ${g}: ${c.a}:${c.b} = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const scaleConfigs: { ratio: string; a: number; b: number; known: number; find: string; correct: number; d: number }[] = [
    { ratio: '1:2', a: 1, b: 2, known: 5, find: 'second', correct: 10, d: 1 },
    { ratio: '1:3', a: 1, b: 3, known: 4, find: 'second', correct: 12, d: 1 },
    { ratio: '2:5', a: 2, b: 5, known: 6, find: 'second', correct: 15, d: 2 },
    { ratio: '3:4', a: 3, b: 4, known: 9, find: 'second', correct: 12, d: 2 },
    { ratio: '2:3', a: 2, b: 3, known: 12, find: 'first', correct: 8, d: 2 },
    { ratio: '5:8', a: 5, b: 8, known: 15, find: 'second', correct: 24, d: 2 },
    { ratio: '3:7', a: 3, b: 7, known: 21, find: 'first', correct: 9, d: 3 },
    { ratio: '4:9', a: 4, b: 9, known: 36, find: 'first', correct: 16, d: 3 },
    { ratio: '1:4', a: 1, b: 4, known: 7, find: 'second', correct: 28, d: 2 },
    { ratio: '2:7', a: 2, b: 7, known: 10, find: 'second', correct: 35, d: 3 },
    { ratio: '5:6', a: 5, b: 6, known: 25, find: 'second', correct: 30, d: 2 },
    { ratio: '3:5', a: 3, b: 5, known: 20, find: 'first', correct: 12, d: 2 },
    { ratio: '7:2', a: 7, b: 2, known: 14, find: 'second', correct: 4, d: 2 },
  ];
  for (const c of scaleConfigs) {
    const knownPart = c.find === 'second' ? 'first' : 'second';
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `In the ratio ${c.ratio}, if the ${knownPart} value is ${c.known}, what is the ${c.find} value?`,
      options: makeOptions(String(c.correct), [String(c.correct + c.a), String(c.correct - c.b), String(c.known)]),
      correctAnswer: String(c.correct),
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.ratio', subRuleId: 'maths.ratio.scale',
      renderType: 'text', renderConfig: null,
      trapTypes: ['wrong_scale_factor'],
      distractorStyleId: 'wrong_scale', contextId: 'ratio',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `Scale factor is ${c.known / (c.find === 'second' ? c.a : c.b)}, so the ${c.find} value is ${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const shareConfigs: { total: number; a: number; b: number; ask: string; correct: number; d: number }[] = [
    { total: 12, a: 1, b: 2, ask: 'larger', correct: 8, d: 1 },
    { total: 20, a: 1, b: 3, ask: 'larger', correct: 15, d: 1 },
    { total: 30, a: 2, b: 3, ask: 'larger', correct: 18, d: 2 },
    { total: 40, a: 3, b: 5, ask: 'larger', correct: 25, d: 2 },
    { total: 35, a: 2, b: 5, ask: 'smaller', correct: 10, d: 2 },
    { total: 48, a: 5, b: 7, ask: 'larger', correct: 28, d: 2 },
    { total: 56, a: 3, b: 4, ask: 'smaller', correct: 24, d: 2 },
    { total: 72, a: 4, b: 5, ask: 'larger', correct: 40, d: 3 },
    { total: 100, a: 2, b: 3, ask: 'larger', correct: 60, d: 2 },
    { total: 90, a: 4, b: 5, ask: 'smaller', correct: 40, d: 3 },
    { total: 60, a: 1, b: 4, ask: 'larger', correct: 48, d: 2 },
    { total: 45, a: 2, b: 7, ask: 'larger', correct: 35, d: 3 },
    { total: 50, a: 3, b: 2, ask: 'larger', correct: 30, d: 2 },
  ];
  for (const c of shareConfigs) {
    const parts = c.a + c.b;
    const perPart = c.total / parts;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `Share £${c.total} in the ratio ${c.a}:${c.b}. How much is the ${c.ask} share?`,
      options: makeOptions(String(c.correct), [String(c.total - c.correct + 2), String(c.total / 2), String(c.correct + perPart)]),
      correctAnswer: String(c.correct),
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.ratio', subRuleId: 'maths.ratio.share',
      renderType: 'text', renderConfig: null,
      trapTypes: ['divide_equally', 'wrong_share'],
      distractorStyleId: 'divide_equally', contextId: 'ratio',
      cognitiveLoad: c.d, estTimeSeconds: 25 + c.d * 5,
      explanation: `Total parts = ${parts}. Each part = £${perPart}. The ${c.ask} share = £${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

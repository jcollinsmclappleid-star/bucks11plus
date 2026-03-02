import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: number, distractors: number[]): string[] {
  const opts = new Set<string>();
  opts.add(String(correct));
  for (const d of distractors) {
    if (d !== correct) opts.add(String(d));
  }
  while (opts.size < 4) {
    opts.add(String(correct + opts.size * 2));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

export function generateNumberPatternQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const linearConfigs: { start: number; step: number; count: number; d: number }[] = [
    { start: 2, step: 3, count: 5, d: 1 },
    { start: 5, step: 5, count: 5, d: 1 },
    { start: 1, step: 4, count: 5, d: 1 },
    { start: 10, step: 7, count: 5, d: 1 },
    { start: 3, step: 6, count: 5, d: 2 },
    { start: 8, step: 9, count: 5, d: 2 },
    { start: 100, step: -8, count: 5, d: 2 },
    { start: 50, step: -6, count: 5, d: 2 },
    { start: 7, step: 11, count: 5, d: 2 },
    { start: 15, step: 13, count: 5, d: 3 },
    { start: 200, step: -15, count: 5, d: 3 },
    { start: 4, step: 8, count: 5, d: 2 },
    { start: 25, step: 12, count: 5, d: 2 },
    { start: 60, step: -7, count: 5, d: 2 },
  ];
  for (const c of linearConfigs) {
    const seq: number[] = [];
    for (let i = 0; i < c.count; i++) seq.push(c.start + c.step * i);
    const next = c.start + c.step * c.count;
    const display = seq.join(', ');
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `What is the next number in the sequence: ${display}, ...?`,
      options: makeOptions(next, [next + c.step, next - 1, next + 2]),
      correctAnswer: String(next),
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.patterns', subRuleId: 'maths.patterns.linear',
      renderType: 'text', renderConfig: null,
      trapTypes: ['wrong_common_difference'],
      distractorStyleId: 'wrong_common_diff', contextId: 'number_patterns',
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `The common difference is ${c.step > 0 ? '+' : ''}${c.step}. The next term is ${seq[seq.length - 1]} ${c.step > 0 ? '+' : ''}${c.step} = ${next}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const squareConfigs: { seq: number[]; next: number; prompt: string; d: number }[] = [
    { seq: [1, 4, 9, 16, 25], next: 36, prompt: '1, 4, 9, 16, 25, ...', d: 1 },
    { seq: [4, 9, 16, 25, 36], next: 49, prompt: '4, 9, 16, 25, 36, ...', d: 1 },
    { seq: [9, 16, 25, 36, 49], next: 64, prompt: '9, 16, 25, 36, 49, ...', d: 2 },
    { seq: [16, 25, 36, 49, 64], next: 81, prompt: '16, 25, 36, 49, 64, ...', d: 2 },
    { seq: [25, 36, 49, 64, 81], next: 100, prompt: '25, 36, 49, 64, 81, ...', d: 2 },
    { seq: [1, 4, 9, 16], next: 25, prompt: '1, 4, 9, 16, ...', d: 1 },
    { seq: [36, 49, 64, 81, 100], next: 121, prompt: '36, 49, 64, 81, 100, ...', d: 2 },
    { seq: [49, 64, 81, 100, 121], next: 144, prompt: '49, 64, 81, 100, 121, ...', d: 2 },
    { seq: [64, 81, 100, 121, 144], next: 169, prompt: '64, 81, 100, 121, 144, ...', d: 3 },
    { seq: [100, 121, 144, 169, 196], next: 225, prompt: '100, 121, 144, 169, 196, ...', d: 3 },
    { seq: [2, 8, 18, 32, 50], next: 72, prompt: '2, 8, 18, 32, 50, ...', d: 3 },
    { seq: [3, 12, 27, 48, 75], next: 108, prompt: '3, 12, 27, 48, 75, ...', d: 3 },
    { seq: [1, 8, 27, 64, 125], next: 216, prompt: '1, 8, 27, 64, 125, ...', d: 3 },
  ];
  for (const c of squareConfigs) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `What is the next number in the sequence: ${c.prompt}?`,
      options: makeOptions(c.next, [c.next + 1, c.next - 2, c.next + 5]),
      correctAnswer: String(c.next),
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.patterns', subRuleId: 'maths.patterns.square_numbers',
      renderType: 'text', renderConfig: null,
      trapTypes: ['off_by_one', 'wrong_power'],
      distractorStyleId: 'wrong_power', contextId: 'number_patterns',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `These are related to square numbers. The next term is ${c.next}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const fibConfigs: { seq: number[]; next: number; d: number }[] = [
    { seq: [1, 1, 2, 3, 5], next: 8, d: 1 },
    { seq: [1, 1, 2, 3, 5, 8], next: 13, d: 1 },
    { seq: [2, 2, 4, 6, 10], next: 16, d: 2 },
    { seq: [1, 3, 4, 7, 11], next: 18, d: 2 },
    { seq: [2, 5, 7, 12, 19], next: 31, d: 2 },
    { seq: [3, 4, 7, 11, 18], next: 29, d: 2 },
    { seq: [1, 4, 5, 9, 14], next: 23, d: 2 },
    { seq: [5, 5, 10, 15, 25], next: 40, d: 2 },
    { seq: [2, 3, 5, 8, 13], next: 21, d: 1 },
    { seq: [1, 2, 3, 5, 8, 13], next: 21, d: 1 },
    { seq: [3, 7, 10, 17, 27], next: 44, d: 3 },
    { seq: [4, 6, 10, 16, 26], next: 42, d: 3 },
    { seq: [1, 5, 6, 11, 17], next: 28, d: 2 },
  ];
  for (const c of fibConfigs) {
    const display = c.seq.join(', ');
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `Each number is the sum of the two before it. What comes next: ${display}, ...?`,
      options: makeOptions(c.next, [c.next + 1, c.next - 1, c.next + 3]),
      correctAnswer: String(c.next),
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.patterns', subRuleId: 'maths.patterns.fibonacci_like',
      renderType: 'text', renderConfig: null,
      trapTypes: ['addition_error'],
      distractorStyleId: 'off_by_one', contextId: 'number_patterns',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `Add the last two terms: ${c.seq[c.seq.length - 2]} + ${c.seq[c.seq.length - 1]} = ${c.next}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

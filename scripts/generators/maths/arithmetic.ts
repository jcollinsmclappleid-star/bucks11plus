import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: number, traps: number[]): string[] {
  const opts = new Set<string>();
  opts.add(String(correct));
  for (const t of traps) {
    if (t !== correct) opts.add(String(t));
  }
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    if (offset !== 0) opts.add(String(correct + offset));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

function difficultyLabel(level: number): string {
  if (level <= 1) return 'easy';
  if (level <= 2) return 'medium';
  return 'hard';
}

export function generateArithmeticQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const addConfigs = [
    { a: 12, b: 7, d: 1 }, { a: 23, b: 15, d: 1 }, { a: 45, b: 32, d: 1 },
    { a: 67, b: 28, d: 1 }, { a: 134, b: 56, d: 2 }, { a: 256, b: 189, d: 2 },
    { a: 478, b: 365, d: 2 }, { a: 1245, b: 867, d: 3 }, { a: 2389, b: 1456, d: 3 },
    { a: 3567, b: 2948, d: 3 }, { a: 99, b: 99, d: 2 }, { a: 555, b: 445, d: 2 },
  ];
  for (const c of addConfigs) {
    const correct = c.a + c.b;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.a} + ${c.b} = ?`,
      options: makeOptions(correct, [correct + 1, correct - 1, correct + 10]),
      correctAnswer: String(correct),
      difficulty: difficultyLabel(c.d), skillId: 'maths.arithmetic',
      subRuleId: 'maths.arithmetic.addition',
      renderType: 'text', renderConfig: null, trapTypes: ['off_by_one'],
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.a} + ${c.b} = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const subConfigs = [
    { a: 19, b: 7, d: 1 }, { a: 45, b: 23, d: 1 }, { a: 78, b: 34, d: 1 },
    { a: 100, b: 47, d: 2 }, { a: 234, b: 189, d: 2 }, { a: 500, b: 267, d: 2 },
    { a: 1000, b: 436, d: 2 }, { a: 2345, b: 1789, d: 3 }, { a: 4001, b: 2567, d: 3 },
    { a: 8000, b: 3456, d: 3 }, { a: 300, b: 149, d: 2 }, { a: 725, b: 368, d: 2 },
  ];
  for (const c of subConfigs) {
    const correct = c.a - c.b;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.a} − ${c.b} = ?`,
      options: makeOptions(correct, [correct + 1, correct - 1, c.b - c.a]),
      correctAnswer: String(correct),
      difficulty: difficultyLabel(c.d), skillId: 'maths.arithmetic',
      subRuleId: 'maths.arithmetic.subtraction',
      renderType: 'text', renderConfig: null, trapTypes: ['off_by_one', 'sign_error'],
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.a} − ${c.b} = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const mulConfigs = [
    { a: 3, b: 4, d: 1 }, { a: 6, b: 7, d: 1 }, { a: 8, b: 9, d: 1 },
    { a: 12, b: 5, d: 1 }, { a: 13, b: 7, d: 2 }, { a: 15, b: 8, d: 2 },
    { a: 24, b: 6, d: 2 }, { a: 25, b: 12, d: 2 }, { a: 34, b: 15, d: 3 },
    { a: 45, b: 23, d: 3 }, { a: 11, b: 11, d: 2 }, { a: 9, b: 12, d: 1 },
  ];
  for (const c of mulConfigs) {
    const correct = c.a * c.b;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.a} × ${c.b} = ?`,
      options: makeOptions(correct, [correct + c.a, correct - c.b, correct + 1]),
      correctAnswer: String(correct),
      difficulty: difficultyLabel(c.d), skillId: 'maths.arithmetic',
      subRuleId: 'maths.arithmetic.multiplication',
      renderType: 'text', renderConfig: null, trapTypes: ['times_table_error'],
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.a} × ${c.b} = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const divConfigs = [
    { a: 12, b: 3, d: 1 }, { a: 24, b: 4, d: 1 }, { a: 36, b: 6, d: 1 },
    { a: 56, b: 7, d: 1 }, { a: 72, b: 8, d: 2 }, { a: 96, b: 12, d: 2 },
    { a: 144, b: 12, d: 2 }, { a: 225, b: 15, d: 2 }, { a: 360, b: 24, d: 3 },
    { a: 480, b: 32, d: 3 }, { a: 81, b: 9, d: 1 }, { a: 108, b: 9, d: 2 },
  ];
  for (const c of divConfigs) {
    const correct = c.a / c.b;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.a} ÷ ${c.b} = ?`,
      options: makeOptions(correct, [correct + 1, correct - 1, c.b]),
      correctAnswer: String(correct),
      difficulty: difficultyLabel(c.d), skillId: 'maths.arithmetic',
      subRuleId: 'maths.arithmetic.division',
      renderType: 'text', renderConfig: null, trapTypes: ['off_by_one'],
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.a} ÷ ${c.b} = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const bodmasConfigs: { expr: string; correct: number; trap: number; d: number }[] = [
    { expr: '3 + 4 × 2', correct: 11, trap: 14, d: 2 },
    { expr: '10 − 2 × 3', correct: 4, trap: 24, d: 2 },
    { expr: '8 + 6 ÷ 2', correct: 11, trap: 7, d: 2 },
    { expr: '5 × 3 + 2', correct: 17, trap: 25, d: 2 },
    { expr: '20 ÷ 4 + 3', correct: 8, trap: 20, d: 2 },
    { expr: '12 − 8 ÷ 4', correct: 10, trap: 1, d: 2 },
    { expr: '2 + 3 × 5 − 1', correct: 16, trap: 24, d: 3 },
    { expr: '4 × 3 + 6 ÷ 2', correct: 15, trap: 9, d: 3 },
    { expr: '15 − 3 × 4 + 2', correct: 5, trap: 50, d: 3 },
    { expr: '6 + 8 ÷ 2 × 3', correct: 18, trap: 21, d: 3 },
    { expr: '10 × 2 − 5 + 3', correct: 18, trap: 15, d: 2 },
    { expr: '7 + 9 ÷ 3 − 2', correct: 8, trap: 10, d: 2 },
  ];
  for (const c of bodmasConfigs) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.expr} = ?`,
      options: makeOptions(c.correct, [c.trap, c.correct + 1, c.correct - 2]),
      correctAnswer: String(c.correct),
      difficulty: difficultyLabel(c.d), skillId: 'maths.arithmetic',
      subRuleId: 'maths.arithmetic.bodmas',
      renderType: 'text', renderConfig: null,
      trapTypes: ['left_to_right_calculation'],
      cognitiveLoad: c.d, estTimeSeconds: 25 + c.d * 5,
      explanation: `Using BODMAS: ${c.expr} = ${c.correct}. Multiplication and division are performed before addition and subtraction.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

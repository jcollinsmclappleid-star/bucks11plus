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
    const parts = correct.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0]) + opts.size;
      opts.add(`${num}/${parts[1]}`);
    } else {
      const n = parseFloat(correct);
      opts.add(String(Math.round((n + opts.size * 0.1) * 100) / 100));
    }
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(n: number, d: number): string {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

export function generateFractionDecimalQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const addSubConfigs: { n1: number; d1: number; n2: number; d2: number; op: string; d: number }[] = [
    { n1: 1, d1: 4, n2: 1, d2: 4, op: '+', d: 1 },
    { n1: 1, d1: 3, n2: 1, d2: 3, op: '+', d: 1 },
    { n1: 2, d1: 5, n2: 1, d2: 5, op: '+', d: 1 },
    { n1: 3, d1: 4, n2: 1, d2: 4, op: '-', d: 1 },
    { n1: 5, d1: 6, n2: 1, d2: 6, op: '-', d: 1 },
    { n1: 1, d1: 2, n2: 1, d2: 4, op: '+', d: 2 },
    { n1: 2, d1: 3, n2: 1, d2: 6, op: '+', d: 2 },
    { n1: 3, d1: 4, n2: 1, d2: 3, op: '+', d: 2 },
    { n1: 5, d1: 6, n2: 1, d2: 3, op: '-', d: 2 },
    { n1: 7, d1: 8, n2: 3, d2: 8, op: '-', d: 2 },
    { n1: 3, d1: 5, n2: 1, d2: 10, op: '+', d: 2 },
    { n1: 2, d1: 3, n2: 1, d2: 4, op: '+', d: 3 },
    { n1: 5, d1: 8, n2: 1, d2: 3, op: '-', d: 3 },
  ];
  for (const c of addSubConfigs) {
    const lcd = (c.d1 * c.d2) / gcd(c.d1, c.d2);
    const resNum = c.op === '+' ? c.n1 * (lcd / c.d1) + c.n2 * (lcd / c.d2) : c.n1 * (lcd / c.d1) - c.n2 * (lcd / c.d2);
    const correct = simplify(resNum, lcd);
    const wrongAdd = simplify(c.n1 + c.n2, c.d1 + c.d2);
    const wrongNum = simplify(resNum + 1, lcd);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.n1}/${c.d1} ${c.op} ${c.n2}/${c.d2} = ?`,
      options: makeOptions(correct, [wrongAdd, wrongNum, simplify(resNum, lcd + 1)]),
      correctAnswer: correct,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.add_subtract',
      renderType: 'text', renderConfig: null,
      trapTypes: ['add_denominators'],
      distractorStyleId: 'add_denominators', contextId: 'fractions',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `Find a common denominator of ${lcd}, then ${c.op === '+' ? 'add' : 'subtract'} the numerators: ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const mulConfigs: { n1: number; d1: number; n2: number; d2: number; d: number }[] = [
    { n1: 1, d1: 2, n2: 1, d2: 3, d: 1 },
    { n1: 2, d1: 3, n2: 3, d2: 4, d: 1 },
    { n1: 1, d1: 4, n2: 2, d2: 5, d: 1 },
    { n1: 3, d1: 5, n2: 2, d2: 3, d: 2 },
    { n1: 4, d1: 7, n2: 1, d2: 2, d: 2 },
    { n1: 5, d1: 6, n2: 3, d2: 5, d: 2 },
    { n1: 2, d1: 9, n2: 3, d2: 4, d: 2 },
    { n1: 7, d1: 8, n2: 2, d2: 3, d: 2 },
    { n1: 3, d1: 10, n2: 5, d2: 6, d: 3 },
    { n1: 4, d1: 9, n2: 3, d2: 8, d: 3 },
    { n1: 5, d1: 12, n2: 4, d2: 5, d: 3 },
    { n1: 7, d1: 10, n2: 2, d2: 7, d: 3 },
    { n1: 3, d1: 4, n2: 4, d2: 9, d: 2 },
  ];
  for (const c of mulConfigs) {
    const resNum = c.n1 * c.n2;
    const resDen = c.d1 * c.d2;
    const correct = simplify(resNum, resDen);
    const wrongCross = simplify(c.n1 * c.d2, c.d1 * c.n2);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `${c.n1}/${c.d1} × ${c.n2}/${c.d2} = ?`,
      options: makeOptions(correct, [wrongCross, simplify(resNum + 1, resDen), simplify(resNum, resDen - 1)]),
      correctAnswer: correct,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.multiply',
      renderType: 'text', renderConfig: null,
      trapTypes: ['cross_multiply_error'],
      distractorStyleId: 'cross_multiply', contextId: 'fractions',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `Multiply numerators and denominators: (${c.n1} × ${c.n2}) / (${c.d1} × ${c.d2}) = ${correct}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const decConvConfigs: { frac: string; decimal: string; d: number }[] = [
    { frac: '1/2', decimal: '0.5', d: 1 },
    { frac: '1/4', decimal: '0.25', d: 1 },
    { frac: '3/4', decimal: '0.75', d: 1 },
    { frac: '1/5', decimal: '0.2', d: 1 },
    { frac: '2/5', decimal: '0.4', d: 1 },
    { frac: '1/8', decimal: '0.125', d: 2 },
    { frac: '3/8', decimal: '0.375', d: 2 },
    { frac: '5/8', decimal: '0.625', d: 2 },
    { frac: '7/10', decimal: '0.7', d: 1 },
    { frac: '3/20', decimal: '0.15', d: 2 },
    { frac: '7/20', decimal: '0.35', d: 2 },
    { frac: '9/25', decimal: '0.36', d: 2 },
  ];
  for (const c of decConvConfigs) {
    const wrong1 = String(parseFloat(c.decimal) + 0.1);
    const wrong2 = String(parseFloat(c.decimal) * 10);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `Convert ${c.frac} to a decimal.`,
      options: makeOptions(c.decimal, [wrong1, wrong2, String(parseFloat(c.decimal) - 0.05)]),
      correctAnswer: c.decimal,
      difficulty: c.d <= 1 ? 'easy' : 'medium',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.decimal_conversion',
      renderType: 'text', renderConfig: null,
      trapTypes: ['place_value_error'],
      distractorStyleId: 'place_value', contextId: 'decimals',
      cognitiveLoad: c.d, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.frac} = ${c.decimal}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const compareConfigs: { a: string; b: string; correct: string; d: number }[] = [
    { a: '1/2', b: '1/3', correct: '1/2', d: 1 },
    { a: '2/5', b: '3/5', correct: '3/5', d: 1 },
    { a: '3/4', b: '2/3', correct: '3/4', d: 2 },
    { a: '5/8', b: '7/12', correct: '5/8', d: 2 },
    { a: '4/9', b: '3/7', correct: '4/9', d: 2 },
    { a: '7/10', b: '5/7', correct: '5/7', d: 3 },
    { a: '2/3', b: '5/8', correct: '2/3', d: 2 },
    { a: '1/6', b: '2/9', correct: '2/9', d: 2 },
    { a: '3/8', b: '5/12', correct: '5/12', d: 3 },
    { a: '4/5', b: '7/9', correct: '4/5', d: 2 },
    { a: '5/6', b: '11/12', correct: '11/12', d: 2 },
    { a: '3/10', b: '1/3', correct: '1/3', d: 2 },
  ];
  for (const c of compareConfigs) {
    const wrong = c.correct === c.a ? c.b : c.a;
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: `Which is larger: ${c.a} or ${c.b}?`,
      options: shuffle([c.a, c.b, 'They are equal', 'Cannot tell']),
      correctAnswer: c.correct,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.compare',
      renderType: 'text', renderConfig: null,
      trapTypes: ['larger_denominator_larger_fraction'],
      distractorStyleId: 'add_denominators', contextId: 'fractions',
      cognitiveLoad: c.d, estTimeSeconds: 20 + c.d * 5,
      explanation: `Converting to common denominators shows ${c.correct} is larger.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

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

  const contextualFractionProblems: { prompt: string; correct: string; distractors: string[]; d: number; subRule: string; explanation: string }[] = [
    { prompt: 'A pizza is cut into 4 equal slices. Tom eats 1 slice and his sister eats 1 slice. What fraction of the pizza have they eaten altogether?', correct: '1/2', distractors: ['2/4', '1/4', '3/4'], d: 1, subRule: 'maths.fractions.add_subtract', explanation: '1/4 + 1/4 = 2/4 = 1/2' },
    { prompt: 'A cake is divided into 3 equal pieces. If 2 pieces are eaten, what fraction of the cake is left?', correct: '1/3', distractors: ['2/3', '1/2', '1/6'], d: 1, subRule: 'maths.fractions.add_subtract', explanation: '3/3 − 2/3 = 1/3' },
    { prompt: 'Olivia reads 2/5 of a book on Saturday and 1/5 on Sunday. What fraction has she read in total?', correct: '3/5', distractors: ['2/5', '1/5', '3/10'], d: 1, subRule: 'maths.fractions.add_subtract', explanation: '2/5 + 1/5 = 3/5' },
    { prompt: 'A jar of sweets is 3/4 full. After taking some, it is 1/4 full. What fraction of the sweets were taken?', correct: '1/2', distractors: ['2/4', '1/4', '3/4'], d: 2, subRule: 'maths.fractions.add_subtract', explanation: '3/4 − 1/4 = 2/4 = 1/2' },
    { prompt: 'A jug is 5/6 full of water. 1/6 of the water is poured out. What fraction of the jug is still full?', correct: '2/3', distractors: ['4/6', '1/3', '5/6'], d: 2, subRule: 'maths.fractions.add_subtract', explanation: '5/6 − 1/6 = 4/6 = 2/3' },
    { prompt: 'Sam walks 1/2 a mile to school and then 1/4 of a mile to the library. How far has he walked in total?', correct: '3/4', distractors: ['2/6', '1/3', '2/4'], d: 2, subRule: 'maths.fractions.add_subtract', explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4' },
    { prompt: 'A recipe uses 2/3 of a cup of flour and 1/6 of a cup of sugar. How much more flour than sugar is used?', correct: '1/2', distractors: ['1/3', '3/6', '1/6'], d: 2, subRule: 'maths.fractions.add_subtract', explanation: '2/3 − 1/6 = 4/6 − 1/6 = 3/6 = 1/2' },
    { prompt: 'Emma paints 3/4 of a fence on Monday and 1/3 of the remaining fence on Tuesday. What fraction of the total fence does she paint on Tuesday?', correct: '1/12', distractors: ['1/3', '1/4', '1/6'], d: 3, subRule: 'maths.fractions.multiply', explanation: '1/3 × 1/4 (remaining) = 1/12 of the whole fence' },
    { prompt: 'A ribbon is 3/4 of a metre long. Lucy cuts off 1/3 of it. How long is the piece she cuts off?', correct: '1/4', distractors: ['1/3', '3/12', '2/3'], d: 2, subRule: 'maths.fractions.multiply', explanation: '1/3 × 3/4 = 3/12 = 1/4 metre' },
    { prompt: 'A farmer uses 2/5 of his land for wheat. He uses 3/4 of the wheat field for a new variety. What fraction of the total land is the new variety?', correct: '3/10', distractors: ['5/9', '6/20', '2/4'], d: 3, subRule: 'maths.fractions.multiply', explanation: '3/4 × 2/5 = 6/20 = 3/10' },
    { prompt: 'There are 24 apples. 3/4 of them are red. How many red apples are there?', correct: '18', distractors: ['16', '20', '12'], d: 1, subRule: 'maths.fractions.of_amount', explanation: '3/4 × 24 = 18' },
    { prompt: 'A school has 120 pupils. 2/5 of them walk to school. How many pupils walk to school?', correct: '48', distractors: ['24', '60', '40'], d: 3, subRule: 'maths.fractions.of_amount', explanation: '2/5 × 120 = 48' },
    { prompt: 'A book has 180 pages. James has read 5/6 of it. How many pages has he read?', correct: '150', distractors: ['160', '140', '120'], d: 3, subRule: 'maths.fractions.of_amount', explanation: '5/6 × 180 = 150' },
    { prompt: 'In a bag of 36 marbles, 2/9 are blue and 1/3 are green. How many marbles are neither blue nor green?', correct: '16', distractors: ['20', '12', '24'], d: 3, subRule: 'maths.fractions.add_subtract', explanation: 'Blue: 2/9 × 36 = 8. Green: 1/3 × 36 = 12. Neither: 36 − 8 − 12 = 16' },
    { prompt: 'A tank holds 60 litres when full. It is 7/10 full. How many more litres are needed to fill it?', correct: '18', distractors: ['42', '12', '24'], d: 3, subRule: 'maths.fractions.of_amount', explanation: 'Currently: 7/10 × 60 = 42 litres. Needed: 60 − 42 = 18 litres' },
    { prompt: 'Sophie spends 1/3 of her pocket money on a book and 1/4 on a drink. What fraction of her pocket money does she spend altogether?', correct: '7/12', distractors: ['2/7', '1/6', '5/12'], d: 3, subRule: 'maths.fractions.add_subtract', explanation: '1/3 + 1/4 = 4/12 + 3/12 = 7/12' },
    { prompt: 'A garden is 5/8 flowers and the rest is grass. What fraction is grass?', correct: '3/8', distractors: ['5/8', '2/8', '1/4'], d: 1, subRule: 'maths.fractions.add_subtract', explanation: '1 − 5/8 = 3/8' },
    { prompt: 'Ben eats 3/8 of a pizza and Sarah eats 1/3 of the same pizza. How much pizza is left?', correct: '7/24', distractors: ['4/11', '5/24', '1/3'], d: 3, subRule: 'maths.fractions.add_subtract', explanation: '3/8 + 1/3 = 9/24 + 8/24 = 17/24 eaten. Left: 24/24 − 17/24 = 7/24' },
  ];

  for (let i = 0; i < contextualFractionProblems.length; i++) {
    const p = contextualFractionProblems[i];
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: p.prompt,
      options: makeOptions(p.correct, p.distractors),
      correctAnswer: p.correct,
      difficulty: p.d <= 1 ? 'easy' : p.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: p.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: ['add_denominators', 'wrong_operation'],
      distractorStyleId: 'add_denominators', contextId: 'fractions',
      cognitiveLoad: p.d + 1, estTimeSeconds: 20 + p.d * 10,
      explanation: p.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const decConvConfigs: { prompt: string; frac: string; decimal: string; d: number }[] = [
    { prompt: 'A recipe calls for 1/2 a kilogram of flour. What is this as a decimal?', frac: '1/2', decimal: '0.5', d: 1 },
    { prompt: 'A plank of wood is 1/4 of a metre long. What is this length as a decimal?', frac: '1/4', decimal: '0.25', d: 1 },
    { prompt: 'A jug contains 3/4 of a litre of juice. Write this as a decimal.', frac: '3/4', decimal: '0.75', d: 1 },
    { prompt: 'A runner has completed 1/5 of a race. What fraction is this as a decimal?', frac: '1/5', decimal: '0.2', d: 2 },
    { prompt: 'A jar is 2/5 full. What is this as a decimal?', frac: '2/5', decimal: '0.4', d: 2 },
    { prompt: 'A pipe is 1/8 of a metre in diameter. What is this as a decimal?', frac: '1/8', decimal: '0.125', d: 2 },
    { prompt: 'A tank is 3/8 full. Express this as a decimal.', frac: '3/8', decimal: '0.375', d: 2 },
    { prompt: 'A battery is 5/8 charged. What is this as a decimal?', frac: '5/8', decimal: '0.625', d: 2 },
    { prompt: 'A swimming pool is 7/10 full. Write this as a decimal.', frac: '7/10', decimal: '0.7', d: 1 },
    { prompt: 'A bag of rice weighs 3/20 of a kilogram. What is this as a decimal?', frac: '3/20', decimal: '0.15', d: 2 },
    { prompt: 'A piece of string is 7/20 of a metre long. Express this as a decimal.', frac: '7/20', decimal: '0.35', d: 2 },
    { prompt: 'A container holds 9/25 of a litre. What is this as a decimal?', frac: '9/25', decimal: '0.36', d: 2 },
  ];
  for (const c of decConvConfigs) {
    const wrong1 = String(parseFloat(c.decimal) + 0.1);
    const wrong2 = String(parseFloat(c.decimal) * 10);
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.prompt,
      options: makeOptions(c.decimal, [wrong1, wrong2, String(parseFloat(c.decimal) - 0.05)]),
      correctAnswer: c.decimal,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.decimal_conversion',
      renderType: 'text', renderConfig: null,
      trapTypes: ['place_value_error'],
      distractorStyleId: 'place_value', contextId: 'decimals',
      cognitiveLoad: c.d + 1, estTimeSeconds: 15 + c.d * 5,
      explanation: `${c.frac} = ${c.decimal}`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const compareConfigs: { prompt: string; a: string; b: string; correct: string; d: number }[] = [
    { prompt: 'Tom has eaten 1/2 of his pizza. Sarah has eaten 1/3 of hers. Who has eaten more?', a: '1/2', b: '1/3', correct: '1/2', d: 1 },
    { prompt: 'Two jars of paint are the same size. One is 2/5 full and the other is 3/5 full. Which jar has more paint?', a: '2/5', b: '3/5', correct: '3/5', d: 1 },
    { prompt: 'Emma walks 3/4 of a mile. Lucy walks 2/3 of a mile. Who walks further?', a: '3/4', b: '2/3', correct: '3/4', d: 2 },
    { prompt: 'A blue ribbon is 5/8 of a metre long. A red ribbon is 7/12 of a metre. Which ribbon is longer?', a: '5/8', b: '7/12', correct: '5/8', d: 2 },
    { prompt: 'One tank is 4/9 full and another is 3/7 full. Which tank has more water?', a: '4/9', b: '3/7', correct: '4/9', d: 2 },
    { prompt: 'A garden has 7/10 of its area as lawn and another garden has 5/7 as lawn. Which garden has more lawn?', a: '7/10', b: '5/7', correct: '5/7', d: 3 },
    { prompt: 'Sam completes 2/3 of a puzzle. Amy completes 5/8 of the same puzzle. Who has done more?', a: '2/3', b: '5/8', correct: '2/3', d: 2 },
    { prompt: 'A bottle is 1/6 full. A cup is 2/9 full. Which container has proportionally more liquid?', a: '1/6', b: '2/9', correct: '2/9', d: 2 },
    { prompt: 'One pipe fills a tank to 3/8. Another fills it to 5/12. Which pipe fills more?', a: '3/8', b: '5/12', correct: '5/12', d: 3 },
    { prompt: 'A car has used 4/5 of its fuel. A van has used 7/9 of its fuel. Which vehicle has used more?', a: '4/5', b: '7/9', correct: '4/5', d: 2 },
    { prompt: 'One bookshelf is 5/6 full. Another is 11/12 full. Which has more books?', a: '5/6', b: '11/12', correct: '11/12', d: 2 },
    { prompt: 'A bucket is 3/10 full. A basin is 1/3 full. Which has more water?', a: '3/10', b: '1/3', correct: '1/3', d: 2 },
  ];
  for (const c of compareConfigs) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.prompt,
      options: shuffle([c.a, c.b, 'They are equal', 'Cannot tell']),
      correctAnswer: c.correct,
      difficulty: c.d <= 1 ? 'easy' : c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.fractions', subRuleId: 'maths.fractions.compare',
      renderType: 'text', renderConfig: null,
      trapTypes: ['larger_denominator_larger_fraction'],
      distractorStyleId: 'add_denominators', contextId: 'fractions',
      cognitiveLoad: c.d + 1, estTimeSeconds: 20 + c.d * 5,
      explanation: `Converting to common denominators shows ${c.correct} is larger.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

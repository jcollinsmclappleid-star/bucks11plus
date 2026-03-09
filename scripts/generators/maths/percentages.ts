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

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
}

export function generatePercentageQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const easyContextual: {
    prompt: string; correct: number; distractors: number[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'A jumper costs £40. It is reduced by 25% in the sale. What is the sale price?',
      correct: 30, distractors: [10, 35, 20],
      explanation: '25% of £40 = £10. Sale price = £40 − £10 = £30.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'There are 50 marbles in a bag. 20% of them are blue. How many blue marbles are there?',
      correct: 10, distractors: [20, 15, 5],
      explanation: '20% of 50 = 20/100 × 50 = 10.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A spelling test has 20 questions. Emma gets 80% correct. How many questions does she get right?',
      correct: 16, distractors: [8, 12, 18],
      explanation: '80% of 20 = 80/100 × 20 = 16.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A pair of trainers costs £60. In a sale, they are reduced by 10%. What is the sale price?',
      correct: 54, distractors: [6, 50, 56],
      explanation: '10% of £60 = £6. Sale price = £60 − £6 = £54.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A farmer has 200 sheep. 50% of them are white. How many white sheep does the farmer have?',
      correct: 100, distractors: [50, 150, 75],
      explanation: '50% of 200 = 100.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A book normally costs £12. It is reduced by 25% in the sale. What is the sale price?',
      correct: 9, distractors: [3, 10, 6],
      explanation: '25% of £12 = £3. Sale price = £12 − £3 = £9.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'In a class of 30 children, 10% are left-handed. How many children are left-handed?',
      correct: 3, distractors: [10, 6, 5],
      explanation: '10% of 30 = 3.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A box of 40 chocolates contains 75% milk chocolates. How many milk chocolates are in the box?',
      correct: 30, distractors: [10, 20, 35],
      explanation: '75% of 40 = 75/100 × 40 = 30.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A laptop costs £500. The price increases by 10%. What is the new price?',
      correct: 550, distractors: [50, 510, 450],
      explanation: '10% of £500 = £50. New price = £500 + £50 = £550.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'A school has 400 pupils. 25% of them walk to school. How many pupils walk to school?',
      correct: 100, distractors: [25, 75, 200],
      explanation: '25% of 400 = 100.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
  ];

  for (const q of easyContextual) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(fmt(q.correct), q.distractors.map(d => fmt(d))),
      correctAnswer: fmt(q.correct),
      difficulty: 'easy',
      skillId: 'maths.percentages', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_percentage', contextId: 'percentages',
      cognitiveLoad: 1, estTimeSeconds: 20,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const mediumContextual: {
    prompt: string; correct: number; distractors: number[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'In a class of 30 pupils, 60% are girls. How many boys are there?',
      correct: 12, distractors: [18, 15, 20],
      explanation: '60% of 30 = 18 girls. Boys = 30 − 18 = 12.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A shop sells a coat for £80. In a sale, the price is reduced by 15%. What is the sale price?',
      correct: 68, distractors: [12, 65, 72],
      explanation: '15% of £80 = £12. Sale price = £80 − £12 = £68.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A school has 250 pupils. 36% of them have packed lunches. How many pupils have school dinners?',
      correct: 160, distractors: [90, 100, 214],
      explanation: '36% of 250 = 90 have packed lunches. School dinners = 250 − 90 = 160.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A house was bought for £200,000. Its value increases by 15%. What is the new value of the house?',
      correct: 230000, distractors: [30000, 215000, 170000],
      explanation: '15% of £200,000 = £30,000. New value = £200,000 + £30,000 = £230,000.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'Sam scored 35 out of 50 in a test. What percentage did he score?',
      correct: 70, distractors: [35, 65, 75],
      explanation: '35/50 × 100 = 70%.',
      subRule: 'maths.percentages.convert_to_pct', traps: ['wrong_denominator'],
    },
    {
      prompt: 'A bike costs £240. The price is reduced by 35% in a sale. What is the sale price?',
      correct: 156, distractors: [84, 168, 205],
      explanation: '35% of £240 = £84. Sale price = £240 − £84 = £156.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'In a survey, 45% of 200 people said they preferred tea. How many people preferred coffee or other drinks?',
      correct: 110, distractors: [90, 100, 155],
      explanation: '45% of 200 = 90 prefer tea. Others = 200 − 90 = 110.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A restaurant bill comes to £85. A 12% service charge is added. What is the total bill?',
      correct: 95.2, distractors: [10.2, 97, 90],
      explanation: '12% of £85 = £10.20. Total = £85 + £10.20 = £95.20.',
      subRule: 'maths.percentages.increase_decrease', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A town has a population of 8,000. The population decreases by 5% over a year. What is the new population?',
      correct: 7600, distractors: [400, 7500, 8400],
      explanation: '5% of 8,000 = 400. New population = 8,000 − 400 = 7,600.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'A jar contains 80 sweets. 30% are red and 45% are green. How many sweets are neither red nor green?',
      correct: 20, distractors: [24, 36, 60],
      explanation: '30% + 45% = 75% are red or green. 25% are other = 25% of 80 = 20.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A shopkeeper buys a watch for £60 and sells it for £75. What is the percentage profit?',
      correct: 25, distractors: [15, 20, 80],
      explanation: 'Profit = £75 − £60 = £15. Percentage profit = 15/60 × 100 = 25%.',
      subRule: 'maths.percentages.profit_loss', traps: ['wrong_denominator'],
    },
    {
      prompt: 'In an election, Candidate A gets 55% of the 4,000 votes. How many more votes does Candidate A get than Candidate B?',
      correct: 400, distractors: [2200, 1800, 200],
      explanation: 'A gets 55% of 4,000 = 2,200. B gets 45% of 4,000 = 1,800. Difference = 400.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A tablet costs £320 plus 20% VAT. What is the total price including VAT?',
      correct: 384, distractors: [64, 340, 256],
      explanation: '20% of £320 = £64. Total = £320 + £64 = £384.',
      subRule: 'maths.percentages.increase_decrease', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A factory produces 1,500 items. 8% are found to be faulty. How many items pass quality control?',
      correct: 1380, distractors: [120, 1200, 1420],
      explanation: '8% of 1,500 = 120 are faulty. Pass = 1,500 − 120 = 1,380.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'Lucy earns £1,200 per month. She saves 15% of her salary. How much does she spend?',
      correct: 1020, distractors: [180, 1000, 1080],
      explanation: '15% of £1,200 = £180 saved. Spent = £1,200 − £180 = £1,020.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A car travels 240 miles on a full tank. After using 60% of the fuel, how many miles can it still travel?',
      correct: 96, distractors: [144, 120, 80],
      explanation: '60% used means 40% remaining. 40% of 240 = 96 miles.',
      subRule: 'maths.percentages.complement', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'A school orchestra has 60 members. 40% play string instruments and 25% play woodwind. How many play other instruments?',
      correct: 21, distractors: [24, 15, 39],
      explanation: '40% + 25% = 65% play strings or woodwind. 35% play other = 35% of 60 = 21.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A swimming pool holds 15,000 litres of water. It is currently 80% full. How many more litres are needed to fill it completely?',
      correct: 3000, distractors: [12000, 1500, 2000],
      explanation: '80% full means 20% needed. 20% of 15,000 = 3,000 litres.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
  ];

  for (const q of mediumContextual) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(fmt(q.correct), q.distractors.map(d => fmt(d))),
      correctAnswer: fmt(q.correct),
      difficulty: 'medium',
      skillId: 'maths.percentages', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_percentage', contextId: 'percentages',
      cognitiveLoad: 2, estTimeSeconds: 30,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const hardContextual: {
    prompt: string; correct: number; distractors: number[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'After a 20% discount, a television costs £360. What was the original price?',
      correct: 450, distractors: [432, 288, 380],
      explanation: '£360 is 80% of the original. Original = £360 ÷ 0.8 = £450.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
    {
      prompt: 'A shop increases the price of a jacket by 30%. The new price is £78. What was the original price?',
      correct: 60, distractors: [54.6, 48, 70],
      explanation: '£78 is 130% of the original. Original = £78 ÷ 1.3 = £60.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
    {
      prompt: 'A car depreciates by 15% in its first year. After one year it is worth £17,000. What did it cost when new?',
      correct: 20000, distractors: [19550, 17000, 14450],
      explanation: '£17,000 is 85% of the original. Original = £17,000 ÷ 0.85 = £20,000.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
    {
      prompt: 'A shop buys a handbag for £45 and sells it for £63. What is the percentage profit?',
      correct: 40, distractors: [18, 28.57, 71.43],
      explanation: 'Profit = £63 − £45 = £18. % profit = 18/45 × 100 = 40%.',
      subRule: 'maths.percentages.profit_loss', traps: ['wrong_denominator'],
    },
    {
      prompt: 'A population of 50,000 grows by 6% in the first year and 4% in the second year. What is the population after two years?',
      correct: 55120, distractors: [55000, 53000, 50500],
      explanation: 'After year 1: 50,000 × 1.06 = 53,000. After year 2: 53,000 × 1.04 = 55,120.',
      subRule: 'maths.percentages.compound', traps: ['add_percentages_error'],
    },
    {
      prompt: 'In a sale, all prices are reduced by 20%. Tom buys a shirt in the sale for £36. He then uses a voucher giving an extra 10% off the sale price. How much does he pay?',
      correct: 32.4, distractors: [31.5, 28.8, 36],
      explanation: 'Extra 10% off £36 = £3.60. Pays £36 − £3.60 = £32.40.',
      subRule: 'maths.percentages.multi_step', traps: ['add_percentages_error'],
    },
    {
      prompt: 'A farmer sells 240 eggs. 15% are broken, and of the remaining eggs, 25% are sold to a shop. How many eggs are sold to the shop?',
      correct: 51, distractors: [60, 36, 204],
      explanation: '15% of 240 = 36 broken. Remaining = 204. 25% of 204 = 51.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'After a 25% increase, a house is worth £375,000. What was its value before the increase?',
      correct: 300000, distractors: [281250, 350000, 280000],
      explanation: '£375,000 is 125% of the original. Original = £375,000 ÷ 1.25 = £300,000.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
    {
      prompt: 'A shopkeeper marks up goods by 60% on the cost price, then offers a 25% discount. If the original cost price is £50, what is the final selling price?',
      correct: 60, distractors: [80, 67.5, 50],
      explanation: 'Marked-up price = £50 × 1.6 = £80. 25% discount = £20 off. Final = £80 − £20 = £60.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A savings account pays 5% interest per year. Mia deposits £800. How much interest does she earn after 2 years if interest is added each year?',
      correct: 82, distractors: [80, 84, 40],
      explanation: 'Year 1: 5% of £800 = £40 → £840. Year 2: 5% of £840 = £42 → £882. Interest = £882 − £800 = £82.',
      subRule: 'maths.percentages.compound', traps: ['add_percentages_error'],
    },
    {
      prompt: 'A train ticket costs £48 for an adult. A child ticket costs 75% of the adult price. How much does it cost for 2 adults and 3 children?',
      correct: 204, distractors: [192, 216, 180],
      explanation: 'Child = 75% of £48 = £36. Total = 2 × £48 + 3 × £36 = £96 + £108 = £204.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A coat is reduced by 40% in a sale. The sale price is £54. What was the original price before the sale?',
      correct: 90, distractors: [75.6, 94, 86],
      explanation: '£54 is 60% of the original. Original = £54 ÷ 0.6 = £90.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
  ];

  for (const q of hardContextual) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(fmt(q.correct), q.distractors.map(d => fmt(d))),
      correctAnswer: fmt(q.correct),
      difficulty: 'hard',
      skillId: 'maths.percentages', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_percentage', contextId: 'percentages',
      cognitiveLoad: 3, estTimeSeconds: 40,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

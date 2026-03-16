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
    {
      prompt: 'A farmer has 80 chickens. 35% of them are brown. How many brown chickens does the farmer have?',
      correct: 28, distractors: [35, 52, 24],
      explanation: '35% of 80 = 0.35 × 80 = 28.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A cinema has 200 seats. 60% of them are occupied. How many seats are empty?',
      correct: 80, distractors: [120, 60, 140],
      explanation: '60% occupied means 40% empty. 40% of 200 = 80.',
      subRule: 'maths.percentages.complement', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'A pizza costs £8. There is a 25% discount. How much does the pizza cost now?',
      correct: 6, distractors: [2, 10, 7],
      explanation: '25% of £8 = £2 off. Sale price = £8 − £2 = £6.',
      subRule: 'maths.percentages.sale_price', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'Tom scores 18 out of 20 in a test. What is his percentage score?',
      correct: 90, distractors: [80, 18, 92],
      explanation: '18/20 × 100 = 90%.',
      subRule: 'maths.percentages.convert_to_pct', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A plant grows from 20 cm to 25 cm. What is the percentage increase?',
      correct: 25, distractors: [5, 20, 50],
      explanation: 'Increase = 5 cm. 5/20 × 100 = 25%.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'A jar contains 80 sweets. 25% of them are red. How many red sweets are there?',
      correct: 20, distractors: [25, 40, 15],
      explanation: '25% of 80 = 20.',
      subRule: 'maths.percentages.find_percentage', traps: ['decimal_point_error'],
    },
    {
      prompt: 'A bicycle costs £120. It is reduced by 10% in the sale. What is the sale price?',
      correct: 108, distractors: [12, 110, 100],
      explanation: '10% of £120 = £12. Sale price = £120 − £12 = £108.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A bag of flour weighs 500g. 40% of it is used for baking. How many grams are left?',
      correct: 300, distractors: [200, 400, 100],
      explanation: '40% of 500 = 200g used. Remaining = 500 − 200 = 300g.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A school trip costs £30 per pupil. There is a 20% discount for groups. What does each pupil pay?',
      correct: 24, distractors: [6, 25, 28],
      explanation: '20% of £30 = £6. Each pupil pays £30 − £6 = £24.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'Out of 60 children, 15 chose football as their favourite sport. What percentage chose football?',
      correct: 25, distractors: [15, 30, 20],
      explanation: '15/60 × 100 = 25%.',
      subRule: 'maths.percentages.convert_to_pct', traps: ['decimal_point_error'],
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
    {
      prompt: 'A shirt costs £35. It is reduced by 20% in a sale, then a further 10% is taken off the sale price. What is the final price?',
      correct: 25.2, distractors: [24.5, 28, 26],
      explanation: '20% off £35 = £28. Then 10% off £28 = £2.80 off. Final price = £25.20.',
      subRule: 'maths.percentages.multi_step', traps: ['add_percentages_error'],
    },
    {
      prompt: 'A company makes 450 items per day. On Monday, 8% were faulty. How many items were not faulty?',
      correct: 414, distractors: [36, 442, 405],
      explanation: '8% of 450 = 36 faulty. 450 − 36 = 414 not faulty.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A bicycle costs £240. Its value decreases by 15% each year. What is it worth after 1 year?',
      correct: 204, distractors: [36, 225, 210],
      explanation: '15% of £240 = £36. Value after 1 year = £240 − £36 = £204.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'In a survey, 45% of 120 people preferred tea, and 30% preferred coffee. How many people preferred neither?',
      correct: 30, distractors: [36, 54, 25],
      explanation: '45% + 30% = 75% chose tea or coffee. 25% chose neither. 25% of 120 = 30.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A shop bought a table for £60 and sold it for £75. What is the percentage profit?',
      correct: 25, distractors: [15, 20, 80],
      explanation: 'Profit = £75 − £60 = £15. Percentage = 15/60 × 100 = 25%.',
      subRule: 'maths.percentages.profit_loss', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A baker makes 150 cakes. 24% are chocolate flavour. How many are not chocolate?',
      correct: 114, distractors: [36, 126, 100],
      explanation: '24% of 150 = 36 chocolate. 150 − 36 = 114 not chocolate.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A train ticket normally costs £45. There is a 40% discount for children. What does a child ticket cost?',
      correct: 27, distractors: [18, 30, 22.5],
      explanation: '40% of £45 = £18 off. Child ticket = £45 − £18 = £27.',
      subRule: 'maths.percentages.sale_price', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A library has 600 books. 35% are fiction and 20% are reference. How many are other types?',
      correct: 270, distractors: [330, 210, 120],
      explanation: '35% + 20% = 55% are fiction or reference. 45% are other. 45% of 600 = 270.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A farmer has 180 cows. He sells 15% of them at market. How many does he have left?',
      correct: 153, distractors: [27, 165, 135],
      explanation: '15% of 180 = 27 sold. 180 − 27 = 153 remaining.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
    },
    {
      prompt: 'A computer costs £800. Its price increases by 5%. What is the new price?',
      correct: 840, distractors: [40, 760, 850],
      explanation: '5% of £800 = £40. New price = £800 + £40 = £840.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
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
    {
      prompt: 'A town has 8,000 people. The population increases by 12% in one year and then decreases by 5% the next. What is the population after two years?',
      correct: 8512, distractors: [8560, 8000, 8400],
      explanation: 'Year 1: 8,000 × 1.12 = 8,960. Year 2: 8,960 × 0.95 = 8,512.',
      subRule: 'maths.percentages.compound', traps: ['add_percentages_error'],
    },
    {
      prompt: 'A museum had 250 visitors on Saturday. On Sunday, the number increased by 20%. How many visitors came on Sunday?',
      correct: 300, distractors: [270, 50, 200],
      explanation: '20% of 250 = 50. Sunday = 250 + 50 = 300.',
      subRule: 'maths.percentages.increase_decrease', traps: ['increase_vs_decrease'],
    },
    {
      prompt: 'After a 25% price increase, a book now costs £15. What was the original price?',
      correct: 12, distractors: [11.25, 10, 18.75],
      explanation: '£15 = 125% of original. Original = £15 ÷ 1.25 = £12.',
      subRule: 'maths.percentages.reverse', traps: ['reverse_percentage_error'],
    },
    {
      prompt: 'A factory makes 600 parts. 5% are rejected in quality control. Of the remaining, 10% are exported. How many are exported?',
      correct: 57, distractors: [60, 30, 54],
      explanation: '5% rejected = 30 → 570 remain. 10% of 570 = 57 exported.',
      subRule: 'maths.percentages.multi_step', traps: ['partial_calculation'],
    },
    {
      prompt: 'A jar of honey weighs 340 g. The label says it contains 85% honey and the rest is the jar. How much does the jar weigh?',
      correct: 51, distractors: [289, 255, 45],
      explanation: 'Jar = 15% of 340 g = 51 g.',
      subRule: 'maths.percentages.complement', traps: ['percentage_of_not_result'],
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

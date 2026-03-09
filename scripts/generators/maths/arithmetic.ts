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

function makeMoneyOptions(correct: number, traps: number[]): string[] {
  const fmt = (n: number) => `£${n.toFixed(2)}`;
  const opts = new Set<string>();
  opts.add(fmt(correct));
  for (const t of traps) {
    if (t !== correct) opts.add(fmt(t));
  }
  while (opts.size < 4) {
    const offset = (Math.floor(Math.random() * 10) - 5) * 0.5;
    if (offset !== 0) opts.add(fmt(correct + offset));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

interface WordProblem {
  prompt: string;
  correct: number;
  traps: number[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subRuleId: string;
  trapTypes: string[];
  distractorStyleId: string;
  contextId: string;
  cognitiveLoad: number;
  estTimeSeconds: number;
  isMoney?: boolean;
}

function easyAdditionProblems(): WordProblem[] {
  return [
    {
      prompt: 'Emma has 14 red marbles and 9 blue marbles. How many marbles does she have altogether?',
      correct: 23, traps: [22, 5, 24],
      explanation: '14 + 9 = 23 marbles altogether.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['off_by_one', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'counting_objects', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'A baker makes 26 rolls in the morning and 18 rolls in the afternoon. How many rolls does he make in total?',
      correct: 44, traps: [42, 8, 46],
      explanation: '26 + 18 = 44 rolls in total.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['off_by_one', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'baking', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'There are 35 children on a bus. At the next stop, 17 more children get on. How many children are on the bus now?',
      correct: 52, traps: [18, 53, 42],
      explanation: '35 + 17 = 52 children on the bus.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['wrong_operation', 'off_by_one'], distractorStyleId: 'wrong_operation',
      contextId: 'transport', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'A farmer has 43 sheep in one field and 29 sheep in another field. How many sheep does the farmer have in total?',
      correct: 72, traps: [14, 71, 62],
      explanation: '43 + 29 = 72 sheep in total.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['wrong_operation', 'off_by_one'], distractorStyleId: 'wrong_operation',
      contextId: 'farming', cognitiveLoad: 1, estTimeSeconds: 20,
    },
  ];
}

function easySubtractionProblems(): WordProblem[] {
  return [
    {
      prompt: 'A library has 85 books on a shelf. 37 books are borrowed. How many books are left on the shelf?',
      correct: 48, traps: [122, 47, 58],
      explanation: '85 − 37 = 48 books remaining.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_operation', 'off_by_one'], distractorStyleId: 'wrong_operation',
      contextId: 'library', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'Oliver has 50p. He spends 23p on a pencil. How much money does he have left?',
      correct: 27, traps: [73, 33, 28],
      explanation: '50 − 23 = 27p remaining.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_operation', 'off_by_one'], distractorStyleId: 'wrong_operation',
      contextId: 'shopping', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'A car park has spaces for 60 cars. 34 spaces are already taken. How many spaces are still available?',
      correct: 26, traps: [94, 36, 24],
      explanation: '60 − 34 = 26 spaces available.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_operation', 'digit_swap'], distractorStyleId: 'wrong_operation',
      contextId: 'everyday', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'Amelia has 72 stickers. She gives 28 stickers to her friend. How many stickers does Amelia have now?',
      correct: 44, traps: [100, 54, 46],
      explanation: '72 − 28 = 44 stickers remaining.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_operation', 'off_by_one'], distractorStyleId: 'wrong_operation',
      contextId: 'sharing', cognitiveLoad: 1, estTimeSeconds: 20,
    },
  ];
}

function easyMultDivProblems(): WordProblem[] {
  return [
    {
      prompt: 'There are 6 bags with 8 apples in each bag. How many apples are there altogether?',
      correct: 48, traps: [14, 46, 56],
      explanation: '6 × 8 = 48 apples altogether.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['wrong_operation', 'times_table_error'], distractorStyleId: 'times_table_error',
      contextId: 'shopping', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'A teacher shares 36 pencils equally among 4 tables. How many pencils does each table receive?',
      correct: 9, traps: [8, 32, 40],
      explanation: '36 ÷ 4 = 9 pencils per table.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['off_by_one', 'wrong_operation'], distractorStyleId: 'off_by_one',
      contextId: 'classroom', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: 'Each row in a cinema has 12 seats. There are 5 rows. How many seats are there in total?',
      correct: 60, traps: [17, 55, 72],
      explanation: '12 × 5 = 60 seats in total.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['wrong_operation', 'times_table_error'], distractorStyleId: 'times_table_error',
      contextId: 'everyday', cognitiveLoad: 1, estTimeSeconds: 20,
    },
    {
      prompt: '54 children are split into teams of 6. How many teams are there?',
      correct: 9, traps: [8, 48, 10],
      explanation: '54 ÷ 6 = 9 teams.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['off_by_one'], distractorStyleId: 'off_by_one',
      contextId: 'sport', cognitiveLoad: 1, estTimeSeconds: 20,
    },
  ];
}

function mediumMultiStepProblems(): WordProblem[] {
  return [
    {
      prompt: 'A shop sells notebooks for £3 each and pens for £1 each. Priya buys 4 notebooks and 6 pens. How much does she spend in total?',
      correct: 18, traps: [12, 6, 24],
      explanation: '(4 × £3) + (6 × £1) = £12 + £6 = £18.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['partial_calculation', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'shopping', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
    {
      prompt: 'A school trip costs £8 per pupil. 27 pupils go on the trip. The school also pays £45 for the coach. What is the total cost?',
      correct: 261, traps: [216, 45, 252],
      explanation: '(27 × £8) + £45 = £216 + £45 = £261.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'school_trip', cognitiveLoad: 2, estTimeSeconds: 35, isMoney: true,
    },
    {
      prompt: 'A gardener plants 15 rows of flowers with 8 flowers in each row. She then plants 23 more flowers along a path. How many flowers does she plant in total?',
      correct: 143, traps: [120, 23, 130],
      explanation: '(15 × 8) + 23 = 120 + 23 = 143 flowers.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'off_by_one'], distractorStyleId: 'partial_calculation',
      contextId: 'gardening', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'Jack earns £7 per hour. He works for 6 hours on Saturday and 4 hours on Sunday. How much does he earn over the weekend?',
      correct: 70, traps: [42, 28, 77],
      explanation: '£7 × (6 + 4) = £7 × 10 = £70.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'earnings', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
    {
      prompt: 'A box holds 24 biscuits. Mrs Chen buys 3 boxes and eats 7 biscuits. How many biscuits are left?',
      correct: 65, traps: [72, 17, 79],
      explanation: '(3 × 24) − 7 = 72 − 7 = 65 biscuits.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'food', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A train has 8 carriages with 56 seats in each carriage. 129 seats are empty. How many passengers are on the train?',
      correct: 319, traps: [448, 129, 327],
      explanation: '(8 × 56) − 129 = 448 − 129 = 319 passengers.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'transport', cognitiveLoad: 2, estTimeSeconds: 35,
    },
    {
      prompt: 'A swimming pool is 25 metres long. Aisha swims 14 lengths in the morning and 9 lengths in the afternoon. How many metres does she swim in total?',
      correct: 575, traps: [350, 225, 600],
      explanation: '(14 + 9) × 25 = 23 × 25 = 575 metres.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'sport', cognitiveLoad: 2, estTimeSeconds: 35,
    },
    {
      prompt: 'There are 156 pupils in Year 5. 89 of them walk to school and the rest travel by bus. Each bus holds 15 pupils. How many buses are needed?',
      correct: 5, traps: [4, 67, 6],
      explanation: '156 − 89 = 67 pupils by bus. 67 ÷ 15 = 4 remainder 7, so 5 buses are needed.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['remainder_ignored', 'partial_calculation'], distractorStyleId: 'remainder_ignored',
      contextId: 'transport', cognitiveLoad: 2, estTimeSeconds: 40,
    },
    {
      prompt: 'A baker makes 144 cupcakes and puts them into boxes of 12. He sells 8 boxes. How many cupcakes does he have left?',
      correct: 48, traps: [96, 12, 36],
      explanation: '144 ÷ 12 = 12 boxes. 12 − 8 = 4 boxes left. 4 × 12 = 48 cupcakes.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'baking', cognitiveLoad: 2, estTimeSeconds: 35,
    },
  ];
}

function mediumBodmasContextProblems(): WordProblem[] {
  return [
    {
      prompt: 'A shopkeeper charges £3 per item plus a £2 delivery fee. Tom buys 5 items. What is the total cost including delivery?',
      correct: 17, traps: [25, 15, 10],
      explanation: '(£3 × 5) + £2 = £15 + £2 = £17.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['left_to_right_calculation'], distractorStyleId: 'left_to_right',
      contextId: 'shopping', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
    {
      prompt: 'Cinema tickets cost £9 each. A family of 4 buys tickets and also spends £6 on popcorn and £4 on drinks. What is the total cost?',
      correct: 46, traps: [36, 10, 40],
      explanation: '(4 × £9) + £6 + £4 = £36 + £10 = £46.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'entertainment', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
    {
      prompt: 'A rectangle has a length of 12 cm and a width of 7 cm. A square with sides of 5 cm is cut from one corner. What is the remaining area?',
      correct: 59, traps: [84, 25, 109],
      explanation: 'Rectangle area = 12 × 7 = 84 cm². Square area = 5 × 5 = 25 cm². Remaining = 84 − 25 = 59 cm².',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['partial_calculation', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'measurement', cognitiveLoad: 2, estTimeSeconds: 35,
    },
    {
      prompt: 'Lily buys 3 books at £5 each and 2 magazines at £2 each. She pays with a £20 note. How much change does she receive?',
      correct: 1, traps: [19, 15, 4],
      explanation: '(3 × £5) + (2 × £2) = £15 + £4 = £19. Change = £20 − £19 = £1.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'shopping', cognitiveLoad: 2, estTimeSeconds: 35, isMoney: true,
    },
  ];
}

function mediumMeasurementProblems(): WordProblem[] {
  return [
    {
      prompt: 'A piece of ribbon is 2 metres long. Sophie cuts off 65 cm. How many centimetres of ribbon are left?',
      correct: 135, traps: [265, 145, 35],
      explanation: '2 metres = 200 cm. 200 − 65 = 135 cm.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['unit_conversion_error'], distractorStyleId: 'unit_conversion',
      contextId: 'measurement', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A jug holds 1.5 litres of juice. 450 ml is poured out. How many millilitres are left in the jug?',
      correct: 1050, traps: [1950, 600, 950],
      explanation: '1.5 litres = 1500 ml. 1500 − 450 = 1050 ml.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['unit_conversion_error'], distractorStyleId: 'unit_conversion',
      contextId: 'measurement', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A bag of flour weighs 1.2 kg. A recipe uses 350 g. How many grams of flour are left?',
      correct: 850, traps: [1550, 870, 750],
      explanation: '1.2 kg = 1200 g. 1200 − 350 = 850 g.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['unit_conversion_error'], distractorStyleId: 'unit_conversion',
      contextId: 'cooking', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A field is 45 metres wide and 120 metres long. What is the perimeter of the field in metres?',
      correct: 330, traps: [5400, 165, 340],
      explanation: 'Perimeter = 2 × (45 + 120) = 2 × 165 = 330 metres.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['area_instead_of_perimeter', 'partial_calculation'], distractorStyleId: 'wrong_formula',
      contextId: 'measurement', cognitiveLoad: 2, estTimeSeconds: 35,
    },
  ];
}

function hardMultiStepProblems(): WordProblem[] {
  return [
    {
      prompt: 'A school orders 15 boxes of exercise books. Each box contains 48 books. The books are shared equally among 9 classes. How many books does each class receive?',
      correct: 80, traps: [720, 48, 72],
      explanation: '15 × 48 = 720 books. 720 ÷ 9 = 80 books per class.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'school', cognitiveLoad: 3, estTimeSeconds: 40,
    },
    {
      prompt: 'A theatre has 24 rows of seats. The first 8 rows have 18 seats each. The remaining rows have 22 seats each. How many seats are there in the theatre?',
      correct: 496, traps: [144, 352, 504],
      explanation: '(8 × 18) + (16 × 22) = 144 + 352 = 496 seats.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'wrong_subtraction'], distractorStyleId: 'partial_calculation',
      contextId: 'entertainment', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'A car travels at 56 miles per hour. It drives for 3 hours and then for another 2 hours at 48 miles per hour. What is the total distance travelled?',
      correct: 264, traps: [168, 96, 280],
      explanation: '(56 × 3) + (48 × 2) = 168 + 96 = 264 miles.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'travel', cognitiveLoad: 3, estTimeSeconds: 40,
    },
    {
      prompt: 'A factory produces 1,250 widgets per day. It runs for 5 days a week. Defective widgets account for 38 per day. How many non-defective widgets are produced in a week?',
      correct: 6060, traps: [6250, 190, 6088],
      explanation: '(1250 − 38) × 5 = 1212 × 5 = 6060 non-defective widgets.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'wrong_order'], distractorStyleId: 'wrong_order',
      contextId: 'industry', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'A charity event raises £2,450. The costs were £375 for the venue, £128 for food, and £97 for decorations. How much profit did the event make?',
      correct: 1850, traps: [2450, 600, 1947],
      explanation: 'Costs = £375 + £128 + £97 = £600. Profit = £2450 − £600 = £1850.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'finance', cognitiveLoad: 3, estTimeSeconds: 40, isMoney: true,
    },
    {
      prompt: 'A shop sells juice in packs of 6 bottles. Each bottle holds 330 ml. Mr Ahmed buys 4 packs. How many litres of juice does he buy?',
      correct: 7.92, traps: [7920, 1320, 2640],
      explanation: '4 × 6 = 24 bottles. 24 × 330 = 7920 ml = 7.92 litres.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['unit_conversion_error', 'partial_calculation'], distractorStyleId: 'unit_conversion',
      contextId: 'shopping', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'A coach holds 52 passengers. A school needs to take 347 pupils and 15 teachers on a trip. What is the smallest number of coaches needed?',
      correct: 7, traps: [6, 362, 8],
      explanation: '347 + 15 = 362 people. 362 ÷ 52 = 6 remainder 50, so 7 coaches are needed.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['remainder_ignored', 'partial_calculation'], distractorStyleId: 'remainder_ignored',
      contextId: 'transport', cognitiveLoad: 3, estTimeSeconds: 40,
    },
    {
      prompt: 'A farmer collects eggs from 3 hen houses. The first has 144 eggs, the second has 168 eggs, and the third has 108 eggs. He packs them into boxes of 12. How many full boxes can he fill?',
      correct: 35, traps: [36, 420, 34],
      explanation: '144 + 168 + 108 = 420 eggs. 420 ÷ 12 = 35 boxes.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['off_by_one', 'partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'farming', cognitiveLoad: 3, estTimeSeconds: 40,
    },
    {
      prompt: 'A rectangular playground is 85 m long and 42 m wide. A running track goes around the edge 3 times. How many metres does a runner cover?',
      correct: 762, traps: [254, 3570, 508],
      explanation: 'Perimeter = 2 × (85 + 42) = 254 m. 3 laps = 254 × 3 = 762 m.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'area_instead_of_perimeter'], distractorStyleId: 'wrong_formula',
      contextId: 'sport', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'A shop has a sale where all items are reduced by £15. A coat originally costs £89, a jumper costs £47 and a shirt costs £32. What is the total sale price for all three items?',
      correct: 123, traps: [168, 45, 138],
      explanation: '(£89 − £15) + (£47 − £15) + (£32 − £15) = £74 + £32 + £17 = £123.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'shopping', cognitiveLoad: 3, estTimeSeconds: 40, isMoney: true,
    },
  ];
}

function hardBodmasContextProblems(): WordProblem[] {
  return [
    {
      prompt: 'A plumber charges a £30 call-out fee plus £18 per hour. He works for 4 hours and then buys parts costing £27. What is the total bill?',
      correct: 129, traps: [72, 102, 219],
      explanation: '£30 + (£18 × 4) + £27 = £30 + £72 + £27 = £129.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['partial_calculation', 'left_to_right_calculation'], distractorStyleId: 'left_to_right',
      contextId: 'services', cognitiveLoad: 3, estTimeSeconds: 40, isMoney: true,
    },
    {
      prompt: 'A parking metre charges £1.50 for the first hour and £2.00 for each additional hour. Mr Khan parks for 5 hours. How much does he pay?',
      correct: 9.50, traps: [10, 7.50, 8],
      explanation: '£1.50 + (4 × £2.00) = £1.50 + £8.00 = £9.50.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['off_by_one', 'partial_calculation'], distractorStyleId: 'off_by_one',
      contextId: 'parking', cognitiveLoad: 3, estTimeSeconds: 35,
    },
    {
      prompt: 'A school fundraiser sells cakes for £2 each and drinks for £1.50 each. They sell 45 cakes and 60 drinks. The ingredients cost £35. How much profit do they make?',
      correct: 145, traps: [90, 180, 55],
      explanation: '(45 × £2) + (60 × £1.50) − £35 = £90 + £90 − £35 = £145.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'fundraiser', cognitiveLoad: 3, estTimeSeconds: 45, isMoney: true,
    },
    {
      prompt: 'A taxi charges £2.80 for the first mile and £1.40 for each additional mile. The journey is 8 miles and there is a £1 night surcharge. What is the total fare?',
      correct: 13.60, traps: [11.20, 12.60, 14],
      explanation: '£2.80 + (7 × £1.40) + £1.00 = £2.80 + £9.80 + £1.00 = £13.60.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.bodmas',
      trapTypes: ['off_by_one', 'partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'transport', cognitiveLoad: 3, estTimeSeconds: 45,
    },
  ];
}

function hardRemainderProblems(): WordProblem[] {
  return [
    {
      prompt: '397 pupils are going on a school trip. Each minibus holds 18 pupils. How many minibuses are needed so that every pupil has a seat?',
      correct: 23, traps: [22, 397, 21],
      explanation: '397 ÷ 18 = 22 remainder 1. An extra minibus is needed for the remaining pupil, so 23 minibuses.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['remainder_ignored'], distractorStyleId: 'remainder_ignored',
      contextId: 'transport', cognitiveLoad: 3, estTimeSeconds: 40,
    },
    {
      prompt: 'A florist has 250 roses. She makes bouquets of 12 roses each. How many complete bouquets can she make?',
      correct: 20, traps: [21, 10, 250],
      explanation: '250 ÷ 12 = 20 remainder 10. She can make 20 complete bouquets.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['remainder_ignored', 'wrong_rounding'], distractorStyleId: 'remainder_ignored',
      contextId: 'florist', cognitiveLoad: 3, estTimeSeconds: 35,
    },
    {
      prompt: 'A warehouse has 1,536 tins of soup. They are packed into crates of 24. Each delivery van carries 8 crates. How many vans are needed to deliver all the tins?',
      correct: 8, traps: [64, 24, 7],
      explanation: '1536 ÷ 24 = 64 crates. 64 ÷ 8 = 8 vans.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'logistics', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'An aeroplane flies 3,500 miles from London to New York in 7 hours. On the return journey it flies at 700 miles per hour. How many hours does the return journey take?',
      correct: 5, traps: [6, 7, 4],
      explanation: 'Return journey: 3500 ÷ 700 = 5 hours.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['wrong_operation'], distractorStyleId: 'wrong_operation',
      contextId: 'travel', cognitiveLoad: 3, estTimeSeconds: 45,
    },
    {
      prompt: 'A hotel has 12 floors. Each floor has 18 rooms. During a conference, 156 rooms are occupied and the rest are empty. How many rooms are empty?',
      correct: 60, traps: [216, 156, 72],
      explanation: '12 × 18 = 216 rooms total. 216 − 156 = 60 empty rooms.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'hotel', cognitiveLoad: 3, estTimeSeconds: 35,
    },
    {
      prompt: 'A builder needs 850 bricks for a wall. Bricks come in packs of 25. Each pack costs £8. He also needs £45 worth of cement. What is the total cost of materials?',
      correct: 317, traps: [272, 45, 850],
      explanation: '850 ÷ 25 = 34 packs. 34 × £8 = £272. Total = £272 + £45 = £317.',
      difficulty: 'hard', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'construction', cognitiveLoad: 3, estTimeSeconds: 45, isMoney: true,
    },
  ];
}

function mediumDataProblems(): WordProblem[] {
  return [
    {
      prompt: 'In a survey, 34 children chose football, 28 chose tennis, 19 chose swimming and 14 chose cricket. How many more children chose football than swimming?',
      correct: 15, traps: [53, 5, 20],
      explanation: '34 − 19 = 15 more children chose football.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_comparison', 'wrong_operation'], distractorStyleId: 'wrong_comparison',
      contextId: 'data_interpretation', cognitiveLoad: 2, estTimeSeconds: 25,
    },
    {
      prompt: 'The table shows the number of books read by four children: Ali 12, Beth 8, Carl 15, Dana 9. What is the mean number of books read?',
      correct: 11, traps: [44, 12, 10],
      explanation: '(12 + 8 + 15 + 9) ÷ 4 = 44 ÷ 4 = 11.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.division',
      trapTypes: ['partial_calculation'], distractorStyleId: 'partial_calculation',
      contextId: 'data_interpretation', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A fruit stall sells 136 apples on Monday, 98 on Tuesday and 157 on Wednesday. How many apples are sold in total over the three days?',
      correct: 391, traps: [234, 293, 401],
      explanation: '136 + 98 + 157 = 391 apples.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['partial_calculation', 'carrying_error'], distractorStyleId: 'carrying_error',
      contextId: 'data_interpretation', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A school tuck shop takes £45 on Monday, £38 on Tuesday, £52 on Wednesday, £29 on Thursday and £61 on Friday. What is the difference between the highest and lowest daily takings?',
      correct: 32, traps: [61, 29, 45],
      explanation: 'Highest = £61, Lowest = £29. Difference = £61 − £29 = £32.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['wrong_values_chosen'], distractorStyleId: 'wrong_comparison',
      contextId: 'data_interpretation', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
    {
      prompt: 'A newsagent sells 48 newspapers on weekdays and 73 newspapers on each day of the weekend. How many newspapers does she sell in a whole week?',
      correct: 386, traps: [240, 146, 394],
      explanation: '(48 × 5) + (73 × 2) = 240 + 146 = 386 newspapers.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'wrong_multiplier'], distractorStyleId: 'partial_calculation',
      contextId: 'data_interpretation', cognitiveLoad: 2, estTimeSeconds: 35,
    },
    {
      prompt: 'In a class of 32 pupils, each pupil brings in 3 tins for a food collection. The target is 120 tins. How many more tins do they still need to reach the target?',
      correct: 24, traps: [96, 120, 12],
      explanation: '32 × 3 = 96 tins collected. 120 − 96 = 24 more tins needed.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['partial_calculation', 'wrong_operation'], distractorStyleId: 'partial_calculation',
      contextId: 'school', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A recipe for 4 people uses 300 g of pasta. Mrs Patel is cooking for 12 people. How many grams of pasta does she need?',
      correct: 900, traps: [1200, 600, 750],
      explanation: '12 ÷ 4 = 3 times the recipe. 300 × 3 = 900 g.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['wrong_multiplier', 'partial_calculation'], distractorStyleId: 'wrong_multiplier',
      contextId: 'cooking', cognitiveLoad: 2, estTimeSeconds: 30,
    },
    {
      prompt: 'A sponsored walk route is 8 km. Sophie is sponsored 50p per km by 6 people. How much money does she raise in total?',
      correct: 24, traps: [3, 4, 48],
      explanation: '50p × 8 = £4 per sponsor. £4 × 6 = £24 total.',
      difficulty: 'medium', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['partial_calculation', 'unit_conversion_error'], distractorStyleId: 'partial_calculation',
      contextId: 'fundraiser', cognitiveLoad: 2, estTimeSeconds: 30, isMoney: true,
    },
  ];
}

function easyTimeProblems(): WordProblem[] {
  return [
    {
      prompt: 'A film starts at 2:45 pm and lasts for 1 hour and 35 minutes. What time does the film end?',
      correct: 420, traps: [380, 430, 415],
      explanation: '2:45 pm + 1 hour 35 minutes = 4:20 pm.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.addition',
      trapTypes: ['time_calculation_error'], distractorStyleId: 'time_error',
      contextId: 'time', cognitiveLoad: 1, estTimeSeconds: 25,
    },
    {
      prompt: 'A bus leaves at 09:15 and arrives at 10:40. How many minutes is the journey?',
      correct: 85, traps: [125, 75, 95],
      explanation: 'From 09:15 to 10:40 = 1 hour 25 minutes = 85 minutes.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.subtraction',
      trapTypes: ['time_calculation_error'], distractorStyleId: 'time_error',
      contextId: 'time', cognitiveLoad: 1, estTimeSeconds: 25,
    },
    {
      prompt: 'Sam practises piano for 25 minutes every day. How many minutes does he practise in one week?',
      correct: 175, traps: [125, 150, 200],
      explanation: '25 × 7 = 175 minutes in one week.',
      difficulty: 'easy', subRuleId: 'maths.arithmetic.multiplication',
      trapTypes: ['wrong_multiplier'], distractorStyleId: 'wrong_multiplier',
      contextId: 'time', cognitiveLoad: 1, estTimeSeconds: 20,
    },
  ];
}

export function generateArithmeticQuestions(): GeneratedQuestion[] {
  const allProblems: WordProblem[] = [
    ...easyAdditionProblems(),
    ...easySubtractionProblems(),
    ...easyMultDivProblems(),
    ...easyTimeProblems(),
    ...mediumMultiStepProblems(),
    ...mediumBodmasContextProblems(),
    ...mediumMeasurementProblems(),
    ...mediumDataProblems(),
    ...hardMultiStepProblems(),
    ...hardBodmasContextProblems(),
    ...hardRemainderProblems(),
  ];

  return allProblems.map((p) => {
    const isDecimal = !Number.isInteger(p.correct);
    const correctStr = p.isMoney
      ? `£${p.correct.toFixed(2)}`
      : isDecimal
        ? String(p.correct)
        : String(p.correct);

    const options = p.isMoney
      ? makeMoneyOptions(p.correct, p.traps)
      : makeOptions(p.correct, p.traps);

    return {
      section: 'Mathematics',
      type: 'multiple_choice',
      prompt: p.prompt,
      options,
      correctAnswer: correctStr,
      difficulty: p.difficulty,
      skillId: 'maths.arithmetic',
      subRuleId: p.subRuleId,
      renderType: 'text' as const,
      renderConfig: null,
      trapTypes: p.trapTypes,
      distractorStyleId: p.distractorStyleId,
      contextId: p.contextId,
      cognitiveLoad: p.cognitiveLoad,
      estTimeSeconds: p.estTimeSeconds,
      explanation: p.explanation,
      qaStatus: 'approved',
      locale: 'en-GB',
      britishSpelling: true,
      version: 1,
    };
  });
}

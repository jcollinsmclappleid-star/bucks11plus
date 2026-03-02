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
    const n = parseFloat(correct.replace(/[£,]/g, '')) || 1;
    const isPrice = correct.includes('£');
    const val = n + opts.size * 2;
    opts.add(isPrice ? `£${val.toFixed(2)}` : String(val));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

const multiStepContextIds = [
  'shopping', 'travel', 'school', 'travel', 'school',
  'cooking', 'school', 'sport', 'school', 'cooking',
];

const moneyContextIds = [
  'shopping', 'shopping', 'shopping', 'travel', 'shopping',
  'shopping', 'shopping', 'shopping', 'sport', 'school',
];

const timeContextIds = [
  'time_schedule', 'travel', 'school', 'travel', 'school',
  'cooking', 'sport', 'travel', 'time_schedule', 'sport',
];

const multiStepStemVariants = [
  'stem_ms_1', 'stem_ms_2', 'stem_ms_3', 'stem_ms_4', 'stem_ms_5',
  'stem_ms_6', 'stem_ms_1', 'stem_ms_2', 'stem_ms_3', 'stem_ms_4',
];

const moneyStemVariants = [
  'stem_money_1', 'stem_money_2', 'stem_money_3', 'stem_money_4', 'stem_money_5',
  'stem_money_6', 'stem_money_1', 'stem_money_2', 'stem_money_3', 'stem_money_4',
];

const timeStemVariants = [
  'stem_time_1', 'stem_time_2', 'stem_time_3', 'stem_time_4', 'stem_time_5',
  'stem_time_6', 'stem_time_1', 'stem_time_2', 'stem_time_3', 'stem_time_4',
];

export function generateWordProblemQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const multiStepProblems: { prompt: string; correct: string; distractors: string[]; d: number }[] = [
    { prompt: 'A shop sells 24 boxes of biscuits on Monday and 18 on Tuesday. Each box contains 12 biscuits. How many biscuits were sold in total?', correct: '504', distractors: ['42', '288', '216'], d: 2 },
    { prompt: 'Emma has 150 metres of ribbon. She cuts 8 pieces, each 12 metres long. How many metres of ribbon does she have left?', correct: '54', distractors: ['96', '138', '42'], d: 2 },
    { prompt: 'A train travels 85 kilometres in the first hour and 72 kilometres in the second hour. If it needs to cover 250 kilometres in total, how many more kilometres must it travel?', correct: '93', distractors: ['157', '178', '165'], d: 2 },
    { prompt: 'A baker makes 240 scones. He packs them equally into 15 boxes. He then gives away 4 boxes. How many scones does he have left?', correct: '176', distractors: ['236', '64', '160'], d: 3 },
    { prompt: 'A school has 28 classrooms. Each classroom has 6 rows of desks with 5 desks in each row. How many desks are there in total?', correct: '840', distractors: ['168', '140', '870'], d: 2 },
    { prompt: 'A farmer has 360 litres of milk. He uses 45 litres each day. After 6 days, how many litres remain?', correct: '90', distractors: ['270', '315', '135'], d: 2 },
    { prompt: 'Oliver buys 3 packs of pencils with 8 pencils in each pack and 2 packs of pens with 6 pens in each pack. How many items does he buy altogether?', correct: '36', distractors: ['24', '12', '30'], d: 2 },
    { prompt: 'A swimming pool is 50 metres long. Amelia swims 14 lengths. How many metres does she swim in total?', correct: '700', distractors: ['64', '750', '650'], d: 1 },
    { prompt: 'A library has 1,250 books. It receives 380 new books and donates 145 old books. How many books does the library have now?', correct: '1485', distractors: ['1630', '1105', '1395'], d: 2 },
    { prompt: 'A factory produces 175 toys per hour. It operates for 8 hours a day, 5 days a week. How many toys are produced in a week?', correct: '7000', distractors: ['1400', '875', '8750'], d: 3 },
  ];
  for (let i = 0; i < multiStepProblems.length; i++) {
    const p = multiStepProblems[i];
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: p.prompt,
      options: makeOptions(p.correct, p.distractors),
      correctAnswer: p.correct,
      difficulty: p.d <= 1 ? 'easy' : p.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.word_problems', subRuleId: 'maths.word_problems.multi_step',
      renderType: 'text', renderConfig: null,
      trapTypes: ['partial_calculation', 'wrong_operation'],
      distractorStyleId: 'partial_calculation',
      contextId: multiStepContextIds[i],
      stemVariantId: multiStepStemVariants[i],
      cognitiveLoad: p.d, estTimeSeconds: 35 + p.d * 5,
      explanation: `Work through each step carefully to arrive at ${p.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const moneyProblems: { prompt: string; correct: string; distractors: string[]; d: number }[] = [
    { prompt: 'A jumper costs £24.50 and a pair of trousers costs £18.75. How much do they cost together?', correct: '£43.25', distractors: ['£42.25', '£43.75', '£5.75'], d: 1 },
    { prompt: 'James pays for a £7.80 sandwich with a £10 note. How much change does he receive?', correct: '£2.20', distractors: ['£2.80', '£3.20', '£2.10'], d: 1 },
    { prompt: 'Sophie buys 4 notebooks at £2.35 each. How much does she spend?', correct: '£9.40', distractors: ['£8.40', '£9.35', '£6.35'], d: 2 },
    { prompt: 'A family of 2 adults and 3 children visit a museum. Adult tickets cost £12.50 and child tickets cost £7.25. What is the total cost?', correct: '£46.75', distractors: ['£45.75', '£39.50', '£59.25'], d: 2 },
    { prompt: 'A book originally costs £15.00. It is reduced by £3.75 in a sale. What is the sale price?', correct: '£11.25', distractors: ['£12.25', '£18.75', '£11.75'], d: 1 },
    { prompt: 'Liam saves £4.50 per week for 8 weeks. How much has he saved?', correct: '£36.00', distractors: ['£32.00', '£40.50', '£12.50'], d: 2 },
    { prompt: 'A café sells tea for £2.40 and cake for £3.85. If Mia buys 2 teas and 1 cake, how much does she pay?', correct: '£8.65', distractors: ['£6.25', '£8.55', '£9.65'], d: 2 },
    { prompt: 'A pack of 6 apples costs £2.70. How much does each apple cost?', correct: '£0.45', distractors: ['£0.54', '£0.40', '£0.35'], d: 2 },
    { prompt: 'Harry has £50.00. He buys a football for £17.99 and shin pads for £8.50. How much money does he have left?', correct: '£23.51', distractors: ['£24.51', '£26.49', '£23.49'], d: 2 },
    { prompt: 'A school trip costs £135 per pupil. If 24 pupils go, what is the total cost?', correct: '£3240', distractors: ['£3340', '£3140', '£2700'], d: 3 },
  ];
  for (let i = 0; i < moneyProblems.length; i++) {
    const p = moneyProblems[i];
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: p.prompt,
      options: makeOptions(p.correct, p.distractors),
      correctAnswer: p.correct,
      difficulty: p.d <= 1 ? 'easy' : p.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.word_problems', subRuleId: 'maths.word_problems.money',
      renderType: 'text', renderConfig: null,
      trapTypes: ['decimal_error', 'wrong_operation'],
      distractorStyleId: 'decimal_error',
      contextId: moneyContextIds[i],
      stemVariantId: moneyStemVariants[i],
      cognitiveLoad: p.d, estTimeSeconds: 25 + p.d * 5,
      explanation: `Calculate carefully with decimal values to get ${p.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const timeProblems: { prompt: string; correct: string; distractors: string[]; d: number }[] = [
    { prompt: 'A film starts at 14:35 and lasts 1 hour 45 minutes. What time does it finish?', correct: '16:20', distractors: ['15:80', '16:10', '15:20'], d: 2 },
    { prompt: 'A bus leaves at 09:15 and arrives at 10:50. How long is the journey?', correct: '1 hour 35 minutes', distractors: ['1 hour 45 minutes', '1 hour 25 minutes', '2 hours 35 minutes'], d: 2 },
    { prompt: 'A lesson starts at 11:20 and lasts 55 minutes. What time does it end?', correct: '12:15', distractors: ['12:75', '11:75', '12:25'], d: 1 },
    { prompt: 'A train departs at 07:48 and takes 2 hours 25 minutes. What time does it arrive?', correct: '10:13', distractors: ['09:73', '10:23', '10:03'], d: 2 },
    { prompt: 'School finishes at 15:30. If the walk home takes 25 minutes, what time does the pupil arrive home?', correct: '15:55', distractors: ['16:05', '15:45', '16:55'], d: 1 },
    { prompt: 'A cake goes in the oven at 13:40 and needs to bake for 1 hour 20 minutes. What time should it come out?', correct: '15:00', distractors: ['14:60', '14:50', '15:10'], d: 2 },
    { prompt: 'A football match starts at 15:00 and has two 45-minute halves with a 15-minute break. What time does it finish?', correct: '16:45', distractors: ['16:30', '17:00', '16:15'], d: 2 },
    { prompt: 'A flight departs London at 08:30 and lands in Edinburgh at 09:45. How long is the flight?', correct: '1 hour 15 minutes', distractors: ['1 hour 25 minutes', '1 hour 5 minutes', '45 minutes'], d: 1 },
    { prompt: 'If it is 22:40 now, how many minutes until midnight?', correct: '80', distractors: ['120', '60', '100'], d: 2 },
    { prompt: 'A swimming session is from 16:45 to 18:10. How many minutes long is the session?', correct: '85', distractors: ['75', '95', '65'], d: 2 },
  ];
  for (let i = 0; i < timeProblems.length; i++) {
    const p = timeProblems[i];
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: p.prompt,
      options: makeOptions(p.correct, p.distractors),
      correctAnswer: p.correct,
      difficulty: p.d <= 1 ? 'easy' : p.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.word_problems', subRuleId: 'maths.word_problems.time',
      renderType: 'text', renderConfig: null,
      trapTypes: ['60_minute_error', 'am_pm_confusion'],
      distractorStyleId: '60_minute_error',
      contextId: timeContextIds[i],
      stemVariantId: timeStemVariants[i],
      cognitiveLoad: p.d, estTimeSeconds: 25 + p.d * 5,
      explanation: `The answer is ${p.correct}. Remember there are 60 minutes in an hour.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

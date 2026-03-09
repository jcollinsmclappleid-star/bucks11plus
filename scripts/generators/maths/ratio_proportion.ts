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
    opts.add(String(n + opts.size));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
}

export function generateRatioQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const easyQuestions: {
    prompt: string; correct: string; distractors: string[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'Share 24 sweets between Tom and Lily in the ratio 1:3. How many sweets does Lily get?',
      correct: '18', distractors: ['12', '6', '8'],
      explanation: 'Total parts = 1 + 3 = 4. Each part = 24 ÷ 4 = 6. Lily gets 3 × 6 = 18.',
      subRule: 'maths.ratio.share', traps: ['divide_equally'],
    },
    {
      prompt: 'A recipe uses flour and sugar in the ratio 2:1. If you use 6 cups of flour, how many cups of sugar do you need?',
      correct: '3', distractors: ['2', '4', '6'],
      explanation: 'Ratio 2:1 means for every 2 cups of flour, 1 cup of sugar. 6 ÷ 2 = 3 cups of sugar.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Red and blue paint are mixed in the ratio 1:2. If 4 litres of red paint are used, how many litres of blue paint are needed?',
      correct: '8', distractors: ['2', '6', '4'],
      explanation: 'Ratio 1:2 means for every 1 litre of red, 2 litres of blue. 4 × 2 = 8 litres.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Share £20 between Anna and Ben in the ratio 3:2. How much does Anna get?',
      correct: '12', distractors: ['10', '8', '15'],
      explanation: 'Total parts = 5. Each part = £20 ÷ 5 = £4. Anna gets 3 × £4 = £12.',
      subRule: 'maths.ratio.share', traps: ['divide_equally'],
    },
    {
      prompt: 'In a bag there are red and green balls in the ratio 1:4. There are 5 red balls. How many green balls are there?',
      correct: '20', distractors: ['4', '9', '15'],
      explanation: 'Ratio 1:4 means for every 1 red, 4 green. 5 × 4 = 20 green balls.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'A fruit drink is made by mixing orange juice and water in the ratio 1:3. How much water is needed for 2 litres of orange juice?',
      correct: '6', distractors: ['3', '4', '8'],
      explanation: 'Ratio 1:3 means for every 1 litre of juice, 3 litres of water. 2 × 3 = 6 litres.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Share 30 stickers between Mia and Jack in the ratio 2:3. How many stickers does Jack get?',
      correct: '18', distractors: ['12', '15', '20'],
      explanation: 'Total parts = 5. Each part = 30 ÷ 5 = 6. Jack gets 3 × 6 = 18.',
      subRule: 'maths.ratio.share', traps: ['divide_equally'],
    },
    {
      prompt: 'A model car is built to a scale of 1:50. The real car is 4 metres long. How long is the model in centimetres?',
      correct: '8', distractors: ['50', '4', '200'],
      explanation: '4 metres = 400 cm. 400 ÷ 50 = 8 cm.',
      subRule: 'maths.ratio.scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'To make mortar, sand and cement are mixed in the ratio 5:1. If 3 kg of cement is used, how many kg of sand are needed?',
      correct: '15', distractors: ['5', '8', '18'],
      explanation: 'Ratio 5:1 means 5 kg of sand for every 1 kg of cement. 3 × 5 = 15 kg.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Share 16 pencils between two children in the ratio 1:3. How many does the child with fewer pencils get?',
      correct: '4', distractors: ['8', '12', '6'],
      explanation: 'Total parts = 4. Each part = 16 ÷ 4 = 4. Smaller share = 1 × 4 = 4.',
      subRule: 'maths.ratio.share', traps: ['divide_equally'],
    },
  ];

  for (const q of easyQuestions) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(q.correct, q.distractors),
      correctAnswer: q.correct,
      difficulty: 'easy',
      skillId: 'maths.ratio', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_ratio', contextId: 'ratio',
      cognitiveLoad: 1, estTimeSeconds: 20,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const mediumQuestions: {
    prompt: string; correct: string; distractors: string[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'A recipe for 4 people uses 300 g of pasta. How much pasta is needed for 10 people?',
      correct: '750', distractors: ['600', '500', '900'],
      explanation: 'Scale factor = 10 ÷ 4 = 2.5. Pasta = 300 × 2.5 = 750 g.',
      subRule: 'maths.ratio.recipe_scaling', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'On a map, 1 cm represents 5 km. Two towns are 8 cm apart on the map. What is the real distance between them?',
      correct: '40', distractors: ['13', '35', '45'],
      explanation: '8 × 5 = 40 km.',
      subRule: 'maths.ratio.map_scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'Purple paint is made by mixing red and blue paint in the ratio 3:5. If 12 litres of red paint are used, how many litres of purple paint are made in total?',
      correct: '32', distractors: ['20', '17', '24'],
      explanation: 'Scale factor = 12 ÷ 3 = 4. Blue = 5 × 4 = 20 litres. Total = 12 + 20 = 32 litres.',
      subRule: 'maths.ratio.total_from_part', traps: ['partial_calculation'],
    },
    {
      prompt: 'Share £60 between three friends in the ratio 1:2:3. How much does the friend with the largest share get?',
      correct: '30', distractors: ['20', '10', '24'],
      explanation: 'Total parts = 6. Each part = £10. Largest share = 3 × £10 = £30.',
      subRule: 'maths.ratio.three_way_share', traps: ['divide_equally'],
    },
    {
      prompt: 'A recipe for 6 biscuits uses 150 g of butter. How much butter is needed to make 15 biscuits?',
      correct: '375', distractors: ['250', '300', '450'],
      explanation: 'Scale factor = 15 ÷ 6 = 2.5. Butter = 150 × 2.5 = 375 g.',
      subRule: 'maths.ratio.recipe_scaling', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'The ratio of boys to girls in a club is 3:4. There are 21 boys. How many children are in the club altogether?',
      correct: '49', distractors: ['28', '35', '42'],
      explanation: 'Scale factor = 21 ÷ 3 = 7. Girls = 4 × 7 = 28. Total = 21 + 28 = 49.',
      subRule: 'maths.ratio.total_from_part', traps: ['partial_calculation'],
    },
    {
      prompt: 'On a map, 2 cm represents 7 km. The real distance between two villages is 35 km. How far apart are they on the map?',
      correct: '10', distractors: ['5', '14', '7'],
      explanation: 'Scale factor = 35 ÷ 7 = 5. Map distance = 2 × 5 = 10 cm.',
      subRule: 'maths.ratio.map_scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'Concrete is made from cement, sand and gravel in the ratio 1:2:4. If 6 kg of cement is used, what is the total weight of the concrete?',
      correct: '42', distractors: ['12', '28', '36'],
      explanation: 'Total ratio = 7. Scale factor = 6. Sand = 12 kg, gravel = 24 kg. Total = 6 + 12 + 24 = 42 kg.',
      subRule: 'maths.ratio.three_way_share', traps: ['partial_calculation'],
    },
    {
      prompt: 'Ali and Beth share some money in the ratio 5:3. Ali gets £30 more than Beth. How much money do they share altogether?',
      correct: '120', distractors: ['80', '90', '150'],
      explanation: 'Difference in parts = 5 − 3 = 2. Each part = £30 ÷ 2 = £15. Total parts = 8. Total = 8 × £15 = £120.',
      subRule: 'maths.ratio.difference', traps: ['wrong_share'],
    },
    {
      prompt: 'A school has teachers and teaching assistants in the ratio 5:2. There are 14 teaching assistants. How many teachers are there?',
      correct: '35', distractors: ['28', '20', '40'],
      explanation: 'Scale factor = 14 ÷ 2 = 7. Teachers = 5 × 7 = 35.',
      subRule: 'maths.ratio.scale', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Lemonade is made by mixing lemon juice, sugar syrup and water in the ratio 1:2:5. How much water is needed to make 2 litres of lemonade?',
      correct: '1.25', distractors: ['1', '0.5', '1.5'],
      explanation: 'Total parts = 8. Water part = 5/8. Water = 5/8 × 2 = 1.25 litres.',
      subRule: 'maths.ratio.three_way_share', traps: ['partial_calculation'],
    },
    {
      prompt: 'A necklace uses gold and silver beads in the ratio 2:5. There are 35 beads altogether. How many gold beads are there?',
      correct: '10', distractors: ['14', '25', '7'],
      explanation: 'Total parts = 7. Each part = 35 ÷ 7 = 5. Gold = 2 × 5 = 10.',
      subRule: 'maths.ratio.share', traps: ['wrong_share'],
    },
    {
      prompt: 'A recipe for 8 pancakes uses 200 ml of milk and 2 eggs. How much milk is needed to make 20 pancakes?',
      correct: '500', distractors: ['400', '250', '600'],
      explanation: 'Scale factor = 20 ÷ 8 = 2.5. Milk = 200 × 2.5 = 500 ml.',
      subRule: 'maths.ratio.recipe_scaling', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'Two lengths of rope are cut in the ratio 3:7. The total length of rope is 4 metres. How long is the shorter piece in centimetres?',
      correct: '120', distractors: ['280', '30', '40'],
      explanation: 'Total parts = 10. Each part = 4 ÷ 10 = 0.4 m = 40 cm. Shorter = 3 × 40 = 120 cm.',
      subRule: 'maths.ratio.share', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'Green paint is made by mixing yellow and blue paint in the ratio 3:2. A painter uses 9 litres of yellow paint. How many litres of green paint does he make?',
      correct: '15', distractors: ['6', '11', '12'],
      explanation: 'Scale factor = 9 ÷ 3 = 3. Blue = 2 × 3 = 6 litres. Total = 9 + 6 = 15 litres.',
      subRule: 'maths.ratio.total_from_part', traps: ['partial_calculation'],
    },
    {
      prompt: 'The ratio of cats to dogs at a rescue centre is 4:3. There are 28 cats. How many animals are there altogether?',
      correct: '49', distractors: ['21', '31', '42'],
      explanation: 'Scale factor = 28 ÷ 4 = 7. Dogs = 3 × 7 = 21. Total = 28 + 21 = 49.',
      subRule: 'maths.ratio.total_from_part', traps: ['partial_calculation'],
    },
    {
      prompt: 'On a map, 4 cm represents 1 km. A park is 3.5 km long. How many centimetres long is the park on the map?',
      correct: '14', distractors: ['3.5', '7', '8'],
      explanation: '3.5 × 4 = 14 cm.',
      subRule: 'maths.ratio.map_scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'A bag contains red, blue and yellow counters in the ratio 2:3:5. There are 60 counters altogether. How many blue counters are there?',
      correct: '18', distractors: ['12', '30', '15'],
      explanation: 'Total parts = 10. Each part = 60 ÷ 10 = 6. Blue = 3 × 6 = 18.',
      subRule: 'maths.ratio.three_way_share', traps: ['divide_equally'],
    },
  ];

  for (const q of mediumQuestions) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(q.correct, q.distractors),
      correctAnswer: q.correct,
      difficulty: 'medium',
      skillId: 'maths.ratio', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_ratio', contextId: 'ratio',
      cognitiveLoad: 2, estTimeSeconds: 30,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const hardQuestions: {
    prompt: string; correct: string; distractors: string[];
    explanation: string; subRule: string; traps: string[];
  }[] = [
    {
      prompt: 'Three children share £180 in the ratio 2:3:5. How much more does the child with the largest share get compared to the child with the smallest share?',
      correct: '54', distractors: ['90', '36', '72'],
      explanation: 'Total parts = 10. Each part = £18. Largest = 5 × £18 = £90. Smallest = 2 × £18 = £36. Difference = £54.',
      subRule: 'maths.ratio.three_way_difference', traps: ['partial_calculation'],
    },
    {
      prompt: 'A recipe for 12 flapjacks uses 240 g of oats, 100 g of butter and 80 g of syrup. How much butter is needed to make 30 flapjacks?',
      correct: '250', distractors: ['200', '300', '150'],
      explanation: 'Scale factor = 30 ÷ 12 = 2.5. Butter = 100 × 2.5 = 250 g.',
      subRule: 'maths.ratio.recipe_scaling', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'The angles of a triangle are in the ratio 2:3:4. What is the size of the largest angle?',
      correct: '80', distractors: ['60', '90', '120'],
      explanation: 'Total parts = 9. Angles sum to 180°. Each part = 20°. Largest = 4 × 20° = 80°.',
      subRule: 'maths.ratio.angles', traps: ['wrong_total'],
    },
    {
      prompt: 'Amy and Ben share money in the ratio 3:5. Ben gets £40 more than Amy. How much does Ben get?',
      correct: '100', distractors: ['60', '80', '120'],
      explanation: 'Difference in parts = 5 − 3 = 2. Each part = £40 ÷ 2 = £20. Ben = 5 × £20 = £100.',
      subRule: 'maths.ratio.difference', traps: ['wrong_share'],
    },
    {
      prompt: 'A fruit salad is made from apples, bananas and cherries in the ratio 4:3:2. The total weight is 1.8 kg. What is the weight of the bananas in grams?',
      correct: '600', distractors: ['800', '400', '540'],
      explanation: 'Total parts = 9. Each part = 1.8 ÷ 9 = 0.2 kg = 200 g. Bananas = 3 × 200 = 600 g.',
      subRule: 'maths.ratio.three_way_share', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'On a map, the scale is 1:25,000. Two points are 6 cm apart on the map. What is the real distance in kilometres?',
      correct: '1.5', distractors: ['15', '0.15', '150'],
      explanation: '6 cm × 25,000 = 150,000 cm = 1,500 m = 1.5 km.',
      subRule: 'maths.ratio.map_scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'The ratio of adults to children at a concert is 5:3. There are 120 more adults than children. How many people are at the concert altogether?',
      correct: '480', distractors: ['300', '360', '200'],
      explanation: 'Difference = 5 − 3 = 2 parts. Each part = 120 ÷ 2 = 60. Total parts = 8. Total = 8 × 60 = 480.',
      subRule: 'maths.ratio.difference', traps: ['wrong_share'],
    },
    {
      prompt: 'Bronze is made from copper and tin in the ratio 9:1. A bronze statue weighs 3.5 kg. How many grams of tin does it contain?',
      correct: '350', distractors: ['3150', '35', '500'],
      explanation: 'Total parts = 10. Tin = 1/10. Tin weight = 3.5 ÷ 10 = 0.35 kg = 350 g.',
      subRule: 'maths.ratio.share', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'Three brothers share an inheritance in the ratio 1:2:3. The middle brother receives £14,000. How much is the total inheritance?',
      correct: '42000', distractors: ['28000', '21000', '56000'],
      explanation: 'Middle brother has 2 parts. Each part = £14,000 ÷ 2 = £7,000. Total parts = 6. Total = 6 × £7,000 = £42,000.',
      subRule: 'maths.ratio.find_total_from_part', traps: ['wrong_scale_factor'],
    },
    {
      prompt: 'A garden has roses, tulips and daffodils in the ratio 5:3:2. There are 24 more roses than daffodils. How many flowers are there altogether?',
      correct: '80', distractors: ['48', '60', '100'],
      explanation: 'Difference roses − daffodils = 5 − 2 = 3 parts. Each part = 24 ÷ 3 = 8. Total parts = 10. Total = 10 × 8 = 80.',
      subRule: 'maths.ratio.three_way_difference', traps: ['partial_calculation'],
    },
    {
      prompt: 'A model train is built to a scale of 1:75. The real train is 18 metres long. What is the length of the model in centimetres?',
      correct: '24', distractors: ['75', '18', '135'],
      explanation: '18 m = 1,800 cm. Model = 1,800 ÷ 75 = 24 cm.',
      subRule: 'maths.ratio.map_scale', traps: ['unit_conversion_error'],
    },
    {
      prompt: 'In a school, the ratio of pupils who walk to school, cycle, and travel by car is 7:2:3. If 84 pupils walk, how many travel by car?',
      correct: '36', distractors: ['24', '42', '12'],
      explanation: 'Scale factor = 84 ÷ 7 = 12. Car = 3 × 12 = 36.',
      subRule: 'maths.ratio.three_way_share', traps: ['wrong_scale_factor'],
    },
  ];

  for (const q of hardQuestions) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: q.prompt,
      options: makeOptions(q.correct, q.distractors),
      correctAnswer: q.correct,
      difficulty: 'hard',
      skillId: 'maths.ratio', subRuleId: q.subRule,
      renderType: 'text', renderConfig: null,
      trapTypes: q.traps,
      distractorStyleId: 'contextual_ratio', contextId: 'ratio',
      cognitiveLoad: 3, estTimeSeconds: 40,
      explanation: q.explanation,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}

import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQ(partial: Omit<GeneratedQuestion, 'section' | 'renderType' | 'renderConfig' | 'locale' | 'britishSpelling' | 'version'>): GeneratedQuestion {
  return {
    section: 'Verbal Reasoning',
    renderType: 'text',
    renderConfig: {},
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    ...partial,
  };
}

function generateSentenceCompletionQuestions(): GeneratedQuestion[] {
  const items: { sentence: string; answer: string; distractors: string[]; diff: string; cog: number; time: number }[] = [
    { sentence: 'The sun ____ in the east every morning.', answer: 'rises', distractors: ['sets', 'falls', 'drops'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'Water ____ at 100 degrees Celsius.', answer: 'boils', distractors: ['freezes', 'melts', 'evaporates'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'A carpenter uses wood to ____ furniture.', answer: 'build', distractors: ['paint', 'wash', 'iron'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'Birds ____ south for the winter.', answer: 'migrate', distractors: ['hibernate', 'excavate', 'celebrate'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'The opposite of generous is ____.', answer: 'selfish', distractors: ['gentle', 'grateful', 'gracious'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'A decade is a period of ____ years.', answer: 'ten', distractors: ['five', 'twenty', 'hundred'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'The capital of England is ____.', answer: 'London', distractors: ['Edinburgh', 'Cardiff', 'Belfast'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'Plants need sunlight to ____.', answer: 'grow', distractors: ['shrink', 'swim', 'fly'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'After autumn comes ____.', answer: 'winter', distractors: ['spring', 'summer', 'autumn'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'The ____ of a triangle add up to 180 degrees.', answer: 'angles', distractors: ['sides', 'edges', 'corners'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'A ____ is someone who studies the stars and planets.', answer: 'astronomer', distractors: ['astrologer', 'astronaut', 'architect'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The soldiers showed great ____ in battle.', answer: 'courage', distractors: ['cowardice', 'laziness', 'ignorance'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The orchestra played a beautiful ____.', answer: 'symphony', distractors: ['sympathy', 'symptom', 'synonym'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'A biography is the story of someone\'s ____.', answer: 'life', distractors: ['death', 'dream', 'journey'], diff: 'medium', cog: 3, time: 25 },
    { sentence: 'The ancient Egyptians built ____ as tombs for their pharaohs.', answer: 'pyramids', distractors: ['castles', 'bridges', 'temples'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'An omnivore eats both plants and ____.', answer: 'animals', distractors: ['minerals', 'fungi', 'insects'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The ____ protects the brain inside the head.', answer: 'skull', distractors: ['scalp', 'spine', 'shield'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'Evaporation is the process by which water turns into ____.', answer: 'vapour', distractors: ['ice', 'liquid', 'solid'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'Parliament is ____ for making laws in the United Kingdom.', answer: 'responsible', distractors: ['reluctant', 'resistant', 'resentful'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The ____ of the novel kept readers guessing until the final page.', answer: 'suspense', distractors: ['sentence', 'substance', 'suspicion'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'A ____ is a word that has the same meaning as another word.', answer: 'synonym', distractors: ['antonym', 'homonym', 'acronym'], diff: 'hard', cog: 5, time: 35 },
    { sentence: 'The river ____ through the valley before reaching the sea.', answer: 'meanders', distractors: ['mountains', 'measures', 'mediates'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'Nocturnal animals are most active during the ____.', answer: 'night', distractors: ['day', 'morning', 'afternoon'], diff: 'medium', cog: 3, time: 25 },
    { sentence: 'The ____ is the largest organ of the human body.', answer: 'skin', distractors: ['liver', 'heart', 'brain'], diff: 'hard', cog: 5, time: 35 },
    { sentence: 'A peninsula is a piece of land almost entirely surrounded by ____.', answer: 'water', distractors: ['mountains', 'desert', 'forest'], diff: 'hard', cog: 5, time: 35 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const item of items) {
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.sentence,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.sentence_completion',
      trapTypes: ['semantic_distractor'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: `The correct word to complete the sentence is '${item.answer}'.`,
      qaStatus: 'approved',
    }));
  }
  return questions;
}

function generateLogicalDeductionQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'All dogs are animals. Rex is a dog. Therefore, Rex is ____.',
      answer: 'an animal', distractors: ['a cat', 'a plant', 'a bird'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Since all dogs are animals and Rex is a dog, Rex must be an animal.' },
    { premise: 'All squares are rectangles. This shape is a square. Therefore, this shape is ____.',
      answer: 'a rectangle', distractors: ['a circle', 'a triangle', 'a pentagon'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Since all squares are rectangles and this shape is a square, it must also be a rectangle.' },
    { premise: 'Tom is taller than Sam. Sam is taller than Jack. Who is the shortest?',
      answer: 'Jack', distractors: ['Tom', 'Sam', 'They are equal'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Tom > Sam > Jack, so Jack is the shortest.' },
    { premise: 'All roses are flowers. Some flowers are red. Can we say all roses are red?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only in summer'], diff: 'easy', cog: 4, time: 30,
      explanation: 'We know all roses are flowers and some flowers are red, but we cannot conclude all roses are red.' },
    { premise: 'Monday comes before Tuesday. Wednesday comes after Tuesday. Which day is in the middle?',
      answer: 'Tuesday', distractors: ['Monday', 'Wednesday', 'Thursday'], diff: 'easy', cog: 2, time: 20,
      explanation: 'The order is Monday, Tuesday, Wednesday, so Tuesday is in the middle.' },
    { premise: 'Emma is older than Lily. Lily is older than Grace. Grace is older than Mia. Who is the oldest?',
      answer: 'Emma', distractors: ['Lily', 'Grace', 'Mia'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Emma > Lily > Grace > Mia, so Emma is the oldest.' },
    { premise: 'No fish can fly. A salmon is a fish. Can a salmon fly?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only at night'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Since no fish can fly and a salmon is a fish, a salmon cannot fly.' },
    { premise: 'If it rains, the ground gets wet. The ground is wet. Did it definitely rain?',
      answer: 'Not necessarily', distractors: ['Yes', 'No', 'Only if it is cold'], diff: 'medium', cog: 5, time: 35,
      explanation: 'The ground could be wet for other reasons (e.g. a hose), so rain is not the only explanation.' },
    { premise: 'All children in Class 5 wear a blue jumper. Sarah wears a blue jumper. Is Sarah definitely in Class 5?',
      answer: 'Not necessarily', distractors: ['Yes', 'No', 'Only on Mondays'], diff: 'medium', cog: 5, time: 35,
      explanation: 'Other people may also wear blue jumpers, so we cannot be certain Sarah is in Class 5.' },
    { premise: 'Ali runs faster than Ben. Ben runs faster than Chris. Does Ali run faster than Chris?',
      answer: 'Yes', distractors: ['No', 'Sometimes', 'Not enough information'], diff: 'medium', cog: 4, time: 30,
      explanation: 'Ali > Ben > Chris in speed, so Ali is faster than Chris.' },
    { premise: 'Every pupil who finished the test received a sticker. James did not receive a sticker. What can we conclude?',
      answer: 'James did not finish the test', distractors: ['James finished the test', 'James lost his sticker', 'James was absent'], diff: 'medium', cog: 5, time: 35,
      explanation: 'If finishing the test means getting a sticker, and James has no sticker, he did not finish.' },
    { premise: 'Some birds can swim. Penguins are birds. Can penguins swim?',
      answer: 'Possibly', distractors: ['Definitely not', 'All birds swim', 'Only in fresh water'], diff: 'medium', cog: 5, time: 35,
      explanation: 'We know some birds can swim and penguins are birds, so it is possible but not certain from the premises alone.' },
    { premise: 'Red is darker than yellow. Blue is darker than red. Which colour is the lightest?',
      answer: 'Yellow', distractors: ['Red', 'Blue', 'They are equal'], diff: 'medium', cog: 4, time: 30,
      explanation: 'Blue > Red > Yellow in darkness, so yellow is the lightest.' },
    { premise: 'If a shape has four equal sides and four right angles, it is a square. This shape has four equal sides and four right angles. What is it?',
      answer: 'A square', distractors: ['A triangle', 'A circle', 'A pentagon'], diff: 'medium', cog: 4, time: 30,
      explanation: 'The shape meets all the conditions to be a square.' },
    { premise: 'No reptiles have fur. A lizard is a reptile. Does a lizard have fur?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only in winter'], diff: 'medium', cog: 4, time: 30,
      explanation: 'Since no reptiles have fur and a lizard is a reptile, a lizard does not have fur.' },
    { premise: 'All prime numbers greater than 2 are odd. 7 is a prime number greater than 2. Is 7 odd?',
      answer: 'Yes', distractors: ['No', 'Sometimes', 'Not enough information'], diff: 'medium', cog: 5, time: 35,
      explanation: '7 is a prime number greater than 2, so it must be odd.' },
    { premise: 'Anna has more sweets than Beth. Beth has more sweets than Cara. Cara has more sweets than Dana. If Anna has 12 sweets and Dana has 3, which is true?',
      answer: 'Beth has between 4 and 11 sweets', distractors: ['Beth has 2 sweets', 'Beth has 13 sweets', 'Beth has 3 sweets'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Anna(12) > Beth > Cara > Dana(3), so Beth must have between 4 and 11 sweets.' },
    { premise: 'If all Zogs are Bips, and all Bips are Cags, are all Zogs also Cags?',
      answer: 'Yes', distractors: ['No', 'Sometimes', 'Not enough information'], diff: 'hard', cog: 7, time: 45,
      explanation: 'All Zogs are Bips, and all Bips are Cags, so all Zogs must be Cags (transitive reasoning).' },
    { premise: 'Some teachers are musicians. All musicians practise daily. What can we say about some teachers?',
      answer: 'Some teachers practise daily', distractors: ['All teachers practise daily', 'No teachers practise daily', 'Teachers never practise'], diff: 'hard', cog: 7, time: 45,
      explanation: 'The teachers who are musicians must practise daily, so some teachers practise daily.' },
    { premise: 'P is north of Q. Q is north of R. S is east of Q. What direction is P from R?',
      answer: 'North', distractors: ['South', 'East', 'West'], diff: 'hard', cog: 7, time: 50,
      explanation: 'P is north of Q and Q is north of R, so P is north of R.' },
    { premise: 'If it is Saturday or Sunday, the library is closed. The library is open. What can we conclude?',
      answer: 'It is not Saturday or Sunday', distractors: ['It is Saturday', 'It is Sunday', 'The library is closed'], diff: 'hard', cog: 6, time: 40,
      explanation: 'Since the library is open, it cannot be Saturday or Sunday.' },
    { premise: 'Every vehicle in the car park is either blue or silver. There are no red vehicles. Tom\'s vehicle is in the car park. What colour could it be?',
      answer: 'Blue or silver', distractors: ['Red', 'Green', 'Black'], diff: 'hard', cog: 6, time: 40,
      explanation: 'All vehicles are blue or silver, so Tom\'s vehicle must be one of those colours.' },
    { premise: 'Mia is younger than Noor. Noor is younger than Olivia. Olivia is younger than Priya. Who is the second youngest?',
      answer: 'Noor', distractors: ['Mia', 'Olivia', 'Priya'], diff: 'hard', cog: 6, time: 40,
      explanation: 'Mia < Noor < Olivia < Priya, so Noor is the second youngest.' },
    { premise: 'All even numbers are divisible by 2. 48 is an even number. Is 48 divisible by 2?',
      answer: 'Yes', distractors: ['No', 'Sometimes', 'Only if it is also divisible by 3'], diff: 'hard', cog: 5, time: 35,
      explanation: '48 is even, and all even numbers are divisible by 2, so 48 is divisible by 2.' },
    { premise: 'If the temperature drops below 0°C, water freezes. The temperature is -5°C. What happens to the water?',
      answer: 'It freezes', distractors: ['It boils', 'It evaporates', 'Nothing happens'], diff: 'hard', cog: 5, time: 35,
      explanation: '-5°C is below 0°C, so the water freezes.' },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const item of items) {
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.premise,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.logical_deduction',
      trapTypes: ['logical_fallacy'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
    }));
  }
  return questions;
}

export function generateVerbalLogicQuestions(): GeneratedQuestion[] {
  return [
    ...generateSentenceCompletionQuestions(),
    ...generateLogicalDeductionQuestions(),
  ];
}

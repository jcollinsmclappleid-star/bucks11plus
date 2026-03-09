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
    { sentence: 'Birds ____ south for the winter.', answer: 'migrate', distractors: ['hibernate', 'excavate', 'celebrate'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'A decade is a period of ____ years.', answer: 'ten', distractors: ['five', 'twenty', 'hundred'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'After autumn comes ____.', answer: 'winter', distractors: ['spring', 'summer', 'autumn'], diff: 'easy', cog: 2, time: 20 },
    { sentence: 'A ____ is someone who studies the stars and planets.', answer: 'astronomer', distractors: ['astrologer', 'astronaut', 'architect'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The soldiers showed great ____ in battle.', answer: 'courage', distractors: ['cowardice', 'caution', 'aggression'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The orchestra played a beautiful ____.', answer: 'symphony', distractors: ['sympathy', 'symptom', 'synonym'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'Evaporation is the process by which water turns into ____.', answer: 'vapour', distractors: ['ice', 'steam', 'mist'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The ____ of the novel kept readers guessing until the final page.', answer: 'suspense', distractors: ['substance', 'suspicion', 'sentiment'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The river ____ through the valley before reaching the sea.', answer: 'meanders', distractors: ['mediates', 'measures', 'moderates'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'A peninsula is a piece of land almost entirely surrounded by ____.', answer: 'water', distractors: ['mountains', 'desert', 'forest'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The scientist made a ____ discovery that changed modern medicine.', answer: 'groundbreaking', distractors: ['controversial', 'accidental', 'theoretical'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The politician spoke with great ____, convincing many voters.', answer: 'eloquence', distractors: ['elegance', 'arrogance', 'confidence'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The ____ between the two countries lasted for decades.', answer: 'alliance', distractors: ['rivalry', 'distance', 'boundary'], diff: 'hard', cog: 6, time: 40 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
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
      stemVariantId: `sentence_completion_${i}`,
      distractorStyleId: 'semantic_distractor',
    }));
  }
  return questions;
}

function generateLogicalDeductionQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'All dogs are animals. Rex is a dog. Therefore, Rex is ____.',
      answer: 'an animal', distractors: ['a cat', 'a plant', 'a bird'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Since all dogs are animals and Rex is a dog, Rex must be an animal.' },
    { premise: 'Tom is taller than Sam. Sam is taller than Jack. Who is the shortest?',
      answer: 'Jack', distractors: ['Tom', 'Sam', 'They are equal'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Tom > Sam > Jack, so Jack is the shortest.' },
    { premise: 'All roses are flowers. Some flowers are red. Can we say all roses are red?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only in summer'], diff: 'easy', cog: 4, time: 30,
      explanation: 'We know all roses are flowers and some flowers are red, but we cannot conclude all roses are red.' },
    { premise: 'No fish can fly. A salmon is a fish. Can a salmon fly?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only at night'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Since no fish can fly and a salmon is a fish, a salmon cannot fly.' },
    { premise: 'If it rains, the ground gets wet. The ground is wet. Did it definitely rain?',
      answer: 'Not necessarily', distractors: ['Yes', 'No', 'Only if it is cold'], diff: 'medium', cog: 5, time: 35,
      explanation: 'The ground could be wet for other reasons (e.g. a hose), so rain is not the only explanation.' },
    { premise: 'All children in Class 5 wear a blue jumper. Sarah wears a blue jumper. Is Sarah definitely in Class 5?',
      answer: 'Not necessarily', distractors: ['Yes', 'No', 'Only on Mondays'], diff: 'medium', cog: 5, time: 35,
      explanation: 'Other people may also wear blue jumpers, so we cannot be certain Sarah is in Class 5.' },
    { premise: 'Every pupil who finished the test received a sticker. James did not receive a sticker. What can we conclude?',
      answer: 'James did not finish the test', distractors: ['James finished the test', 'James lost his sticker', 'James was absent'], diff: 'medium', cog: 5, time: 35,
      explanation: 'If finishing the test means getting a sticker, and James has no sticker, he did not finish.' },
    { premise: 'If all Zogs are Bips, and all Bips are Cags, are all Zogs also Cags?',
      answer: 'Yes', distractors: ['No', 'Sometimes', 'Not enough information'], diff: 'medium', cog: 6, time: 40,
      explanation: 'All Zogs are Bips, and all Bips are Cags, so all Zogs must be Cags (transitive reasoning).' },
    { premise: 'Some teachers are musicians. All musicians practise daily. What can we say about some teachers?',
      answer: 'Some teachers practise daily', distractors: ['All teachers practise daily', 'No teachers practise daily', 'Teachers never practise'], diff: 'hard', cog: 7, time: 45,
      explanation: 'The teachers who are musicians must practise daily, so some teachers practise daily.' },
    { premise: 'If it is Saturday or Sunday, the library is closed. The library is open. What can we conclude?',
      answer: 'It is not Saturday or Sunday', distractors: ['It is Saturday', 'It is Sunday', 'The library is closed'], diff: 'hard', cog: 6, time: 40,
      explanation: 'Since the library is open, it cannot be Saturday or Sunday.' },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
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
      stemVariantId: `logical_deduction_${i}`,
      distractorStyleId: 'logical_fallacy',
    }));
  }
  return questions;
}

function generateConditionalReasoningQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'If you study hard, you will pass the exam. Tom did not pass the exam. What can we conclude about Tom?',
      answer: 'Tom did not study hard', distractors: ['Tom studied hard', 'Tom was ill', 'The exam was too difficult'], diff: 'medium', cog: 5, time: 35,
      explanation: 'By contrapositive: if not pass then not study hard. Tom did not pass, so he did not study hard.' },
    { premise: 'If a number is divisible by 6, it is divisible by both 2 and 3. The number 18 is divisible by 6. What else must be true?',
      answer: '18 is divisible by 2 and 3', distractors: ['18 is divisible by 5', '18 is a prime number', '18 is divisible by 9'], diff: 'medium', cog: 5, time: 35,
      explanation: 'Since 18 is divisible by 6, it must be divisible by both 2 and 3.' },
    { premise: 'All members of the chess club can play chess. Not all members of the chess club can play draughts. Which statement must be true?',
      answer: 'Some chess club members cannot play draughts', distractors: ['No chess club members can play draughts', 'All chess club members can play draughts', 'Chess and draughts are the same game'], diff: 'medium', cog: 5, time: 35,
      explanation: '"Not all" means at least one cannot, so some chess club members cannot play draughts.' },
    { premise: 'If an animal has feathers, it is a bird. A robin has feathers. A dog does not have feathers. Which conclusion is correct?',
      answer: 'A robin is a bird and a dog is not necessarily a bird', distractors: ['A dog is a bird', 'A robin is not a bird', 'All animals are birds'], diff: 'medium', cog: 5, time: 35,
      explanation: 'A robin has feathers so it is a bird. A dog does not have feathers, but we cannot say it is definitely not a bird from this alone (though we know it is not).' },
    { premise: 'Every child who ate the school dinner had pudding. Every child who had pudding had a drink. Amy ate the school dinner. What can we say about Amy?',
      answer: 'Amy had pudding and a drink', distractors: ['Amy only had pudding', 'Amy only had a drink', 'Amy had neither'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Amy ate dinner → had pudding → had a drink. So Amy had both pudding and a drink.' },
    { premise: 'If it snows, the school closes. If the school closes, children stay home. It snowed on Monday. What happened on Monday?',
      answer: 'The school closed and children stayed home', distractors: ['The school stayed open', 'Only some children stayed home', 'Children went to a different school'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Snow → school closes → children stay home. All three follow from the chain of conditions.' },
    { premise: 'All quadrilaterals have four sides. All squares are quadrilaterals. All rectangles are quadrilaterals. Which must be true?',
      answer: 'Squares and rectangles both have four sides', distractors: ['All quadrilaterals are squares', 'All rectangles are squares', 'Squares have more sides than rectangles'], diff: 'hard', cog: 6, time: 40,
      explanation: 'Both squares and rectangles are quadrilaterals, so both have four sides.' },
    { premise: 'No vegetarian eats meat. Some vegetarians eat fish. Tom is a vegetarian who eats fish. What do we know about Tom?',
      answer: 'Tom does not eat meat but does eat fish', distractors: ['Tom eats meat and fish', 'Tom eats neither meat nor fish', 'Tom is not a vegetarian'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Tom is vegetarian so he does not eat meat. He is one of the vegetarians who eat fish.' },
  ];

  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.premise,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.conditional_reasoning',
      trapTypes: ['affirming_consequent', 'chain_logic'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `conditional_reasoning_${i}`,
      distractorStyleId: 'logical_fallacy',
    }));
  }
  return questions;
}

function generateTableDeductionQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'Three children — Amy, Ben and Cara — each have a different pet: a cat, a dog and a rabbit. Amy does not have a cat. Ben has the dog. What pet does Amy have?',
      answer: 'A rabbit', distractors: ['A cat', 'A dog', 'A hamster'], diff: 'medium', cog: 5, time: 40,
      explanation: 'Ben has the dog. Amy does not have a cat. So Amy has the rabbit, and Cara has the cat.' },
    { premise: 'Four friends — Dan, Eve, Fay and Gus — sit in a row. Dan sits at one end. Eve sits next to Dan. Fay does not sit next to Gus. Who sits at the other end?',
      answer: 'Gus', distractors: ['Eve', 'Fay', 'Dan'], diff: 'medium', cog: 6, time: 45,
      explanation: 'Dan is at one end, Eve next to Dan. The remaining seats go to Fay and Gus. If Fay is not next to Gus, Fay must be next to Eve, and Gus is at the other end.' },
    { premise: 'Three children — Isla, Jake and Kim — each like a different fruit: apples, bananas and cherries. Isla does not like bananas. Jake does not like apples or bananas. What does Kim like?',
      answer: 'Bananas', distractors: ['Apples', 'Cherries', 'Oranges'], diff: 'medium', cog: 5, time: 40,
      explanation: 'Jake does not like apples or bananas, so Jake likes cherries. Isla does not like bananas, so Isla likes apples. Kim likes bananas.' },
    { premise: 'Leo, Mia and Noor each play a different instrument: piano, violin and flute. Leo does not play piano. Mia plays violin. What instrument does Leo play?',
      answer: 'Flute', distractors: ['Piano', 'Violin', 'Drums'], diff: 'easy', cog: 4, time: 30,
      explanation: 'Mia plays violin. Leo does not play piano. So Leo plays flute and Noor plays piano.' },
    { premise: 'Five children sit in a row numbered 1 to 5. Alice sits in seat 1. Ben does not sit next to Alice. Charlie is between Dana and Eve. Dana sits in seat 2. Where does Ben sit?',
      answer: 'Seat 5', distractors: ['Seat 2', 'Seat 3', 'Seat 4'], diff: 'hard', cog: 8, time: 55,
      explanation: 'Alice=1, Dana=2. Charlie is between Dana and Eve, so Dana-Charlie-Eve gives seats 2-3-4. Ben cannot be next to Alice (seat 2), so Ben sits in seat 5.' },
    { premise: 'Four pupils — Priya, Quinn, Raj and Sara — each scored a different mark in a test: 60, 70, 80 and 90. Priya scored higher than Quinn. Raj scored 80. Sara scored the lowest. What did Quinn score?',
      answer: '70', distractors: ['60', '80', '90'], diff: 'hard', cog: 7, time: 50,
      explanation: 'Sara scored the lowest = 60. Raj scored 80. Remaining scores are 70 and 90. Priya > Quinn, so Priya = 90 and Quinn = 70.' },
    { premise: 'Three teams — Red, Blue and Green — finished a relay race in 1st, 2nd and 3rd place. Red did not finish last. Blue finished before Green. In what position did Green finish?',
      answer: '3rd', distractors: ['1st', '2nd', 'Did not finish'], diff: 'medium', cog: 5, time: 35,
      explanation: 'Blue finished before Green, so Green is not 1st. Red did not finish last. If Green is not 1st and someone else is not last, Green must be 3rd.' },
    { premise: 'Tom, Uma and Vic each wore a different colour hat: red, blue and yellow. Tom did not wear red or blue. Uma did not wear yellow. What colour hat did Uma wear?',
      answer: 'Red or blue', distractors: ['Yellow', 'Red only', 'Green'], diff: 'medium', cog: 5, time: 40,
      explanation: 'Tom wore yellow (not red or blue). Uma did not wear yellow. So Uma wore either red or blue.' },
  ];

  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.premise,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.table_deduction',
      trapTypes: ['elimination_error', 'constraint_miss'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `table_deduction_${i}`,
      distractorStyleId: 'elimination_error',
    }));
  }
  return questions;
}

function generateSeatingArrangementQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'Three children sit in a row: Ali, Beth and Cal. Ali sits on the left. Cal does not sit next to Ali. Who sits in the middle?',
      answer: 'Beth', distractors: ['Ali', 'Cal', 'Cannot be determined'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Ali is on the left. Cal is not next to Ali, so Cal is on the right. Beth is in the middle.' },
    { premise: 'Four children sit around a square table: Dan, Eve, Fay and Gus. Dan sits opposite Eve. Fay sits to the left of Dan. Who sits to the right of Dan?',
      answer: 'Gus', distractors: ['Eve', 'Fay', 'Dan'], diff: 'medium', cog: 5, time: 40,
      explanation: 'Dan is opposite Eve. Fay is to Dan\'s left. The remaining seat (Dan\'s right) must be Gus.' },
    { premise: 'Five children sit in a row. Hannah is in the middle. Ian is not at either end. Jenny sits to the left of Hannah. Karl is at the right end. Where does Lily sit?',
      answer: 'At the left end', distractors: ['Next to Karl', 'In the middle', 'Second from the right'], diff: 'hard', cog: 7, time: 50,
      explanation: 'Hannah is seat 3 (middle). Karl is seat 5 (right end). Jenny is to the left of Hannah, and Ian is not at either end. Ian must be seat 4, Jenny seat 2, Lily seat 1.' },
    { premise: 'Six pupils sit in a circle. Max is opposite Nina. Oscar is to the left of Max. Pip is opposite Oscar. Who is to the right of Nina?',
      answer: 'Oscar', distractors: ['Max', 'Pip', 'Cannot be determined'], diff: 'hard', cog: 8, time: 55,
      explanation: 'In a circle of 6, Max opposite Nina means 3 seats apart. Oscar to Max\'s left, Pip opposite Oscar. Working through the positions, Oscar ends up to Nina\'s right.' },
    { premise: 'Three friends sit on a bench. Ravi is not at either end. Sofia sits to the right of Ravi. Where does Tom sit?',
      answer: 'On the left end', distractors: ['In the middle', 'On the right end', 'Cannot be determined'], diff: 'easy', cog: 3, time: 25,
      explanation: 'Ravi is in the middle. Sofia is to his right (right end). Tom must be on the left end.' },
    { premise: 'Four people sit in a row. Uma is next to Vic. Wen is at one end. Xia is not next to Wen. Who sits next to Wen?',
      answer: 'Uma or Vic', distractors: ['Xia', 'Nobody', 'Both Uma and Vic'], diff: 'hard', cog: 6, time: 45,
      explanation: 'Xia is not next to Wen. Uma is next to Vic. Since Xia cannot be next to Wen, either Uma or Vic must be next to Wen.' },
    { premise: 'Five children sit in seats numbered 1-5. Yara is in seat 3. Zain is in an even-numbered seat. Ava is in seat 1. Ben is not in seat 5. Where does Ben sit?',
      answer: 'Seat 2 or seat 4', distractors: ['Seat 1', 'Seat 3', 'Seat 5'], diff: 'hard', cog: 7, time: 50,
      explanation: 'Ava=1, Yara=3. Ben is not in seat 5. Zain is in an even seat. Ben must be in seat 2 or 4 (the remaining even seat goes to Zain).' },
  ];

  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.premise,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.seating_arrangement',
      trapTypes: ['spatial_reasoning', 'constraint_miss'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `seating_arrangement_${i}`,
      distractorStyleId: 'spatial_reasoning',
    }));
  }
  return questions;
}

function generateComplexSyllogismQuestions(): GeneratedQuestion[] {
  const items: { premise: string; answer: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { premise: 'All athletes are fit. Some fit people are tall. Can we say all athletes are tall?',
      answer: 'No, we cannot conclude that', distractors: ['Yes, all athletes are tall', 'Only some athletes exist', 'Athletes are always tall'], diff: 'medium', cog: 5, time: 35,
      explanation: 'All athletes are fit, and some fit people are tall, but not all fit people are tall. So we cannot conclude all athletes are tall.' },
    { premise: 'No mammals can breathe underwater. Dolphins are mammals. Dolphins live in water. Which statement is correct?',
      answer: 'Dolphins must come to the surface to breathe', distractors: ['Dolphins can breathe underwater', 'Dolphins are not mammals', 'Dolphins do not live in water'], diff: 'medium', cog: 6, time: 40,
      explanation: 'Dolphins are mammals and no mammals can breathe underwater, so dolphins must surface to breathe, even though they live in water.' },
    { premise: 'All prefects are in Year 6. Some Year 6 pupils play football. All football players train on Wednesday. What can we say about some prefects?',
      answer: 'We cannot say anything definite about prefects and football', distractors: ['All prefects train on Wednesday', 'No prefects play football', 'All prefects play football'], diff: 'hard', cog: 8, time: 50,
      explanation: 'All prefects are in Year 6, and some Year 6 pupils play football, but we do not know if any prefects are among those who play football.' },
    { premise: 'Every doctor has studied science. Every surgeon is a doctor. Not every doctor is a surgeon. What must be true?',
      answer: 'Every surgeon has studied science', distractors: ['Every scientist is a doctor', 'Every doctor is a surgeon', 'No doctors study science'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Every surgeon is a doctor, and every doctor has studied science. So every surgeon has studied science.' },
    { premise: 'Some sweets are chocolate. All chocolate is brown. Some brown things are round. Are some sweets definitely brown?',
      answer: 'Some sweets are brown', distractors: ['All sweets are brown', 'No sweets are brown', 'All sweets are round'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Some sweets are chocolate, and all chocolate is brown. So those sweets that are chocolate must be brown. Therefore some sweets are brown.' },
    { premise: 'All pentagons have five sides. All shapes on the board are pentagons. Shape X is on the board. How many sides does Shape X have?',
      answer: 'Five', distractors: ['Four', 'Six', 'Three'], diff: 'medium', cog: 4, time: 30,
      explanation: 'Shape X is on the board, all shapes on the board are pentagons, and all pentagons have five sides. So Shape X has five sides.' },
    { premise: 'No birds are reptiles. All crocodiles are reptiles. Some animals that live near water are birds. Can a crocodile be a bird?',
      answer: 'No', distractors: ['Yes', 'Sometimes', 'Only near water'], diff: 'hard', cog: 7, time: 45,
      explanation: 'Crocodiles are reptiles and no birds are reptiles, so a crocodile cannot be a bird.' },
    { premise: 'All coins in the red box are gold. All coins in the blue box are silver. No coin is in both boxes. A coin is gold. Where could it be?',
      answer: 'In the red box or somewhere else entirely', distractors: ['Definitely in the red box', 'In the blue box', 'In both boxes'], diff: 'hard', cog: 8, time: 50,
      explanation: 'All coins in the red box are gold, but there could be gold coins elsewhere too. So a gold coin could be in the red box or elsewhere.' },
  ];

  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const options = shuffle([item.answer, ...item.distractors]);
    questions.push(makeQ({
      type: 'verbal_logic',
      prompt: item.premise,
      options,
      correctAnswer: item.answer,
      difficulty: item.diff,
      skillId: 'vr.verbal_logic',
      subRuleId: 'vr.verbal_logic.complex_syllogism',
      trapTypes: ['syllogism_reversal', 'distribution_error'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `complex_syllogism_${i}`,
      distractorStyleId: 'syllogism_reversal',
    }));
  }
  return questions;
}

export function generateVerbalLogicQuestions(): GeneratedQuestion[] {
  return [
    ...generateSentenceCompletionQuestions(),
    ...generateLogicalDeductionQuestions(),
    ...generateConditionalReasoningQuestions(),
    ...generateTableDeductionQuestions(),
    ...generateSeatingArrangementQuestions(),
    ...generateComplexSyllogismQuestions(),
  ];
}

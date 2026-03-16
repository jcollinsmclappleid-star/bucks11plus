import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQ(partial: Omit<GeneratedQuestion, 'section' | 'renderType' | 'renderConfig' | 'locale' | 'britishSpelling' | 'version' | 'qaStatus'>): GeneratedQuestion {
  return {
    section: 'Verbal Reasoning',
    renderType: 'text',
    renderConfig: {},
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    qaStatus: 'approved',
    ...partial,
  };
}

const alphabeticalStems = [
  `Which word comes first in alphabetical order?`,
  `Which of these words would appear first in a dictionary?`,
  `If these words were sorted A–Z, which would be first?`,
  `Which word is earliest in the alphabet?`,
  `Arrange these alphabetically — which comes first?`,
  `Which word would you find first in an alphabetical list?`,
];

const categoryStems = [
  `Three of these words belong to the same group. Which word does NOT belong?`,
  `Which word is the odd one out from this group?`,
  `One word does not fit with the others. Which is it?`,
  `Three of these words are related. Which one is different?`,
  `Which word does not belong with the rest?`,
  `Identify the word that is not part of the same category.`,
];

function generateAlphabeticalOrderQuestions(): GeneratedQuestion[] {
  const wordSets: { words: string[]; answer: string; diff: string; cog: number; time: number }[] = [
    { words: ['apple', 'banana', 'cherry', 'date'], answer: 'apple', diff: 'easy', cog: 2, time: 20 },
    { words: ['dog', 'cat', 'bird', 'ant'], answer: 'ant', diff: 'easy', cog: 2, time: 20 },
    { words: ['orange', 'mango', 'lemon', 'kiwi'], answer: 'kiwi', diff: 'easy', cog: 2, time: 20 },
    { words: ['table', 'stool', 'sofa', 'shelf'], answer: 'shelf', diff: 'easy', cog: 3, time: 25 },
    { words: ['whale', 'tiger', 'snake', 'rabbit'], answer: 'rabbit', diff: 'easy', cog: 3, time: 25 },
    { words: ['pencil', 'paper', 'paste', 'paint'], answer: 'paint', diff: 'medium', cog: 4, time: 30 },
    { words: ['stream', 'string', 'stripe', 'strict'], answer: 'stream', diff: 'medium', cog: 5, time: 35 },
    { words: ['castle', 'candle', 'carpet', 'carrot'], answer: 'candle', diff: 'medium', cog: 5, time: 35 },
    { words: ['branch', 'bridge', 'breeze', 'bronze'], answer: 'branch', diff: 'medium', cog: 5, time: 35 },
    { words: ['planet', 'plough', 'pledge', 'plenty'], answer: 'planet', diff: 'medium', cog: 5, time: 35 },
    { words: ['chapter', 'channel', 'charter', 'chamber'], answer: 'chamber', diff: 'hard', cog: 6, time: 40 },
    { words: ['shoulder', 'shelter', 'shatter', 'shimmer'], answer: 'shatter', diff: 'hard', cog: 6, time: 40 },
    { words: ['trouble', 'triumph', 'tribute', 'trivial'], answer: 'tribute', diff: 'hard', cog: 7, time: 45 },
    { words: ['present', 'pretend', 'prevail', 'prevent'], answer: 'present', diff: 'hard', cog: 6, time: 40 },
    { words: ['strength', 'stranger', 'strategy', 'straight'], answer: 'straight', diff: 'hard', cog: 7, time: 45 },
    { words: ['elephant', 'eagle', 'eel', 'emu'], answer: 'eagle', diff: 'medium', cog: 4, time: 30 },
    { words: ['garden', 'garage', 'giant', 'ghost'], answer: 'garage', diff: 'medium', cog: 5, time: 35 },
    { words: ['winter', 'window', 'whistle', 'wonder'], answer: 'whistle', diff: 'medium', cog: 5, time: 35 },
    { words: ['problem', 'promise', 'prophet', 'project'], answer: 'problem', diff: 'hard', cog: 6, time: 40 },
    { words: ['measure', 'meadow', 'meaning', 'mention'], answer: 'meadow', diff: 'hard', cog: 6, time: 40 },
    { words: ['discover', 'disaster', 'diamond', 'distance'], answer: 'diamond', diff: 'hard', cog: 7, time: 45 },
    { words: ['hospital', 'horizon', 'holiday', 'hundred'], answer: 'holiday', diff: 'hard', cog: 7, time: 45 },
    { words: ['machine', 'market', 'magic', 'mother'], answer: 'machine', diff: 'medium', cog: 5, time: 35 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < wordSets.length; i++) {
    const ws = wordSets[i];
    const stemIdx = i % alphabeticalStems.length;
    const options = shuffle(ws.words);
    questions.push(makeQ({
      type: 'word_sequences',
      prompt: alphabeticalStems[stemIdx],
      options,
      correctAnswer: ws.answer,
      difficulty: ws.diff,
      skillId: 'vr.word_sequences',
      subRuleId: 'vr.word_sequences.alphabetical_order',
      trapTypes: ['alphabetical_confusion'],
      cognitiveLoad: ws.cog,
      estTimeSeconds: ws.time,
      explanation: `In alphabetical order, '${ws.answer}' comes first among the given words.`,
      stemVariantId: `alphabetical_stem_${stemIdx}`,
      distractorStyleId: 'alphabetical_confusion',
    }));
  }
  return questions;
}

function generateCategoryGroupingQuestions(): GeneratedQuestion[] {
  const sets: { category: string; members: string[]; oddOne: string; diff: string; cog: number; time: number }[] = [
    { category: 'colours', members: ['crimson', 'scarlet', 'vermilion'], oddOne: 'velvet', diff: 'easy', cog: 2, time: 20 },
    { category: 'fruits', members: ['plum', 'peach', 'pear'], oddOne: 'parsley', diff: 'easy', cog: 2, time: 20 },
    { category: 'animals', members: ['badger', 'otter', 'stoat'], oddOne: 'acorn', diff: 'easy', cog: 2, time: 20 },
    { category: 'furniture', members: ['wardrobe', 'cupboard', 'dresser'], oddOne: 'curtain', diff: 'easy', cog: 3, time: 25 },
    { category: 'vehicles', members: ['lorry', 'bicycle', 'carriage'], oddOne: 'harbour', diff: 'easy', cog: 3, time: 25 },
    { category: 'weather', members: ['thunder', 'lightning', 'hailstone'], oddOne: 'mountain', diff: 'medium', cog: 4, time: 30 },
    { category: 'musical instruments', members: ['violin', 'trumpet', 'clarinet'], oddOne: 'sonnet', diff: 'medium', cog: 4, time: 30 },
    { category: 'clothing', members: ['cardigan', 'waistcoat', 'dungarees'], oddOne: 'calendar', diff: 'medium', cog: 5, time: 35 },
    { category: 'trees', members: ['sycamore', 'chestnut', 'hawthorn'], oddOne: 'mushroom', diff: 'medium', cog: 5, time: 35 },
    { category: 'birds', members: ['sparrow', 'swallow', 'starling'], oddOne: 'squirrel', diff: 'medium', cog: 4, time: 30 },
    { category: 'tools', members: ['chisel', 'mallet', 'spanner'], oddOne: 'flannel', diff: 'hard', cog: 6, time: 40 },
    { category: 'fabrics', members: ['cotton', 'silk', 'linen'], oddOne: 'kitten', diff: 'hard', cog: 5, time: 35 },
    { category: 'precious stones', members: ['sapphire', 'emerald', 'amethyst'], oddOne: 'alphabet', diff: 'hard', cog: 6, time: 40 },
    { category: 'dances', members: ['waltz', 'polka', 'tango'], oddOne: 'mango', diff: 'hard', cog: 6, time: 40 },
    { category: 'metals', members: ['copper', 'bronze', 'platinum'], oddOne: 'crimson', diff: 'hard', cog: 6, time: 40 },
    { category: 'planets', members: ['Mars', 'Saturn', 'Neptune'], oddOne: 'Pluto', diff: 'medium', cog: 4, time: 30 },
    { category: 'rivers', members: ['Thames', 'Severn', 'Trent'], oddOne: 'Snowdon', diff: 'medium', cog: 5, time: 35 },
    { category: 'shapes', members: ['hexagon', 'pentagon', 'octagon'], oddOne: 'rectangle', diff: 'medium', cog: 4, time: 30 },
    { category: 'sports', members: ['cricket', 'rugby', 'tennis'], oddOne: 'ballet', diff: 'easy', cog: 2, time: 20 },
    { category: 'insects', members: ['beetle', 'ladybird', 'grasshopper'], oddOne: 'spider', diff: 'medium', cog: 4, time: 30 },
    { category: 'continents', members: ['Africa', 'Europe', 'Asia'], oddOne: 'Atlantic', diff: 'easy', cog: 3, time: 25 },
    { category: 'currencies', members: ['pound', 'dollar', 'euro'], oddOne: 'metre', diff: 'hard', cog: 5, time: 35 },
    { category: 'spices', members: ['cinnamon', 'turmeric', 'paprika'], oddOne: 'parsley', diff: 'hard', cog: 6, time: 40 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    const stemIdx = i % categoryStems.length;
    const options = shuffle([...s.members, s.oddOne]);
    questions.push(makeQ({
      type: 'word_sequences',
      prompt: categoryStems[stemIdx],
      options,
      correctAnswer: s.oddOne,
      difficulty: s.diff,
      skillId: 'vr.word_sequences',
      subRuleId: 'vr.word_sequences.category_grouping',
      trapTypes: ['category_confusion'],
      cognitiveLoad: s.cog,
      estTimeSeconds: s.time,
      explanation: `'${s.members.join("', '")}' are all ${s.category}. '${s.oddOne}' does not belong to this group.`,
      stemVariantId: `category_stem_${stemIdx}`,
      distractorStyleId: 'category_confusion',
    }));
  }
  return questions;
}

export function generateWordSequenceQuestions(): GeneratedQuestion[] {
  return [
    ...generateAlphabeticalOrderQuestions(),
    ...generateCategoryGroupingQuestions(),
  ];
}

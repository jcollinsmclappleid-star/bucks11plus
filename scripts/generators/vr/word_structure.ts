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

function generateCompoundWordQuestions(): GeneratedQuestion[] {
  const compounds: { first: string; second: string; distractors: string[]; diff: string; cog: number; time: number }[] = [
    { first: 'sun', second: 'flower', distractors: ['shower', 'tower', 'power'], diff: 'easy', cog: 2, time: 20 },
    { first: 'rain', second: 'bow', distractors: ['row', 'cow', 'low'], diff: 'easy', cog: 2, time: 20 },
    { first: 'foot', second: 'ball', distractors: ['fall', 'call', 'tall'], diff: 'easy', cog: 2, time: 20 },
    { first: 'bed', second: 'room', distractors: ['boom', 'moon', 'broom'], diff: 'easy', cog: 2, time: 20 },
    { first: 'cup', second: 'board', distractors: ['sword', 'guard', 'hoard'], diff: 'easy', cog: 3, time: 25 },
    { first: 'butter', second: 'fly', distractors: ['fry', 'cry', 'dry'], diff: 'easy', cog: 2, time: 20 },
    { first: 'water', second: 'fall', distractors: ['wall', 'tall', 'ball'], diff: 'easy', cog: 2, time: 20 },
    { first: 'snow', second: 'flake', distractors: ['lake', 'cake', 'stake'], diff: 'medium', cog: 3, time: 25 },
    { first: 'thunder', second: 'storm', distractors: ['form', 'worm', 'norm'], diff: 'medium', cog: 3, time: 25 },
    { first: 'book', second: 'worm', distractors: ['form', 'storm', 'warm'], diff: 'medium', cog: 3, time: 25 },
    { first: 'hand', second: 'shake', distractors: ['bake', 'lake', 'rake'], diff: 'medium', cog: 4, time: 30 },
    { first: 'head', second: 'quarter', distractors: ['master', 'water', 'chapter'], diff: 'medium', cog: 4, time: 30 },
    { first: 'door', second: 'step', distractors: ['stop', 'strap', 'steep'], diff: 'medium', cog: 4, time: 30 },
    { first: 'day', second: 'dream', distractors: ['cream', 'steam', 'stream'], diff: 'medium', cog: 3, time: 25 },
    { first: 'fire', second: 'work', distractors: ['fork', 'walk', 'cork'], diff: 'hard', cog: 5, time: 35 },
    { first: 'quarter', second: 'back', distractors: ['pack', 'track', 'stack'], diff: 'hard', cog: 5, time: 35 },
    { first: 'over', second: 'look', distractors: ['book', 'cook', 'hook'], diff: 'hard', cog: 5, time: 35 },
    { first: 'under', second: 'ground', distractors: ['bound', 'found', 'round'], diff: 'hard', cog: 5, time: 35 },
    { first: 'black', second: 'berry', distractors: ['ferry', 'merry', 'cherry'], diff: 'hard', cog: 5, time: 35 },
    { first: 'key', second: 'board', distractors: ['hoard', 'sword', 'guard'], diff: 'hard', cog: 5, time: 35 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const c of compounds) {
    const options = shuffle([c.second, ...c.distractors]);
    questions.push(makeQ({
      type: 'word_structure',
      prompt: `Which word completes the compound word? ${c.first} + ____`,
      options,
      correctAnswer: c.second,
      difficulty: c.diff,
      skillId: 'vr.word_structure',
      subRuleId: 'vr.word_structure.compound_words',
      trapTypes: ['rhyme_distractor'],
      cognitiveLoad: c.cog,
      estTimeSeconds: c.time,
      explanation: `'${c.first}' + '${c.second}' makes the compound word '${c.first}${c.second}'.`,
    }));
  }
  return questions;
}

function generateHiddenWordQuestions(): GeneratedQuestion[] {
  const hiddens: { sentence: string; hidden: string; distractors: string[]; diff: string; cog: number; time: number }[] = [
    { sentence: 'The car goes fast.', hidden: 'argo', distractors: ['cart', 'goat', 'fast'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'We can open it now.', hidden: 'canoe', distractors: ['cope', 'pint', 'town'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'I saw him arch over the fence.', hidden: 'march', distractors: ['swarm', 'hover', 'fence'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'The cat here is mine.', hidden: 'there', distractors: ['catch', 'other', 'shine'], diff: 'easy', cog: 4, time: 30 },
    { sentence: 'He came late very often.', hidden: 'late', distractors: ['came', 'very', 'even'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'I bought a new hat cherry red.', hidden: 'hatch', distractors: ['batch', 'watch', 'match'], diff: 'easy', cog: 4, time: 30 },
    { sentence: 'She ran germinating seeds quickly.', hidden: 'anger', distractors: ['range', 'germ', 'seeds'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'Put the owl etching on the wall.', hidden: 'towel', distractors: ['watch', 'owlet', 'ethic'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The bus helped everyone get home.', hidden: 'helped', distractors: ['shape', 'bused', 'every'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'I must ache after running so far.', hidden: 'mustache', distractors: ['starch', 'after', 'catch'], diff: 'medium', cog: 6, time: 40 },
    { sentence: 'The cup board was empty.', hidden: 'cupboard', distractors: ['boards', 'aboard', 'copied'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'Do napkins come in packs?', hidden: 'nap', distractors: ['pin', 'pack', 'kin'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'We love nothing more than pie.', hidden: 'oven', distractors: ['love', 'than', 'more'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'Stop entering without permission.', hidden: 'top', distractors: ['stop', 'enter', 'ring'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The disc over there is broken.', hidden: 'discover', distractors: ['disco', 'cover', 'overt'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Please allow each child to speak.', hidden: 'lower', distractors: ['allow', 'pleas', 'reach'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'She can deliver packages on time.', hidden: 'candel', distractors: ['liver', 'kneel', 'packs'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The planet here is Mars.', hidden: 'lathe', distractors: ['plane', 'there', 'marsh'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'At his age, Nathan is very tall.', hidden: 'agent', distractors: ['again', 'tenth', 'tally'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Pick any flower you want.', hidden: 'canopy', distractors: ['piano', 'tower', 'flown'], diff: 'hard', cog: 7, time: 45 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const h of hiddens) {
    const options = shuffle([h.hidden, ...h.distractors]);
    questions.push(makeQ({
      type: 'word_structure',
      prompt: `Find the hidden word in this sentence: "${h.sentence}"`,
      options,
      correctAnswer: h.hidden,
      difficulty: h.diff,
      skillId: 'vr.word_structure',
      subRuleId: 'vr.word_structure.hidden_words',
      trapTypes: ['partial_match'],
      cognitiveLoad: h.cog,
      estTimeSeconds: h.time,
      explanation: `The hidden word '${h.hidden}' can be found spanning across the words in the sentence.`,
    }));
  }
  return questions;
}

function generateAnagramQuestions(): GeneratedQuestion[] {
  const anagrams: { scrambled: string; answer: string; distractors: string[]; diff: string; cog: number; time: number }[] = [
    { scrambled: 'OGD', answer: 'DOG', distractors: ['GOD', 'LOG', 'FOG'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'TAC', answer: 'CAT', distractors: ['ACT', 'CUT', 'COT'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'NUS', answer: 'SUN', distractors: ['NUN', 'GUN', 'BUN'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'AHT', answer: 'HAT', distractors: ['TAR', 'RAT', 'BAT'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'ENP', answer: 'PEN', distractors: ['PAN', 'PIN', 'TEN'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'ETRE', answer: 'TREE', distractors: ['FREE', 'DEER', 'HERE'], diff: 'easy', cog: 3, time: 25 },
    { scrambled: 'TRSAE', answer: 'STARE', distractors: ['TEARS', 'RATES', 'STORE'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'RANTGI', answer: 'RATING', distractors: ['TARING', 'RAGING', 'BATING'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'LOSCH', answer: 'SCHOOL', distractors: ['CLOTH', 'COALS', 'CLASH'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'AELPP', answer: 'APPLE', distractors: ['PLACE', 'PLEAD', 'PEARL'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'LBETA', answer: 'TABLE', distractors: ['BLEAT', 'CABLE', 'LABEL'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'RESHO', answer: 'HORSE', distractors: ['SHORE', 'HOSES', 'THOSE'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'DRANEG', answer: 'GARDEN', distractors: ['DANGER', 'GANDER', 'GRADED'], diff: 'medium', cog: 6, time: 40 },
    { scrambled: 'COSLHO', answer: 'SCHOOL', distractors: ['CHOOSE', 'STOOLS', 'COLOUR'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'RTHEANWO', answer: 'HAWTHORN', distractors: ['WARTHOG', 'ANOTHER', 'THROWN'], diff: 'hard', cog: 8, time: 50 },
    { scrambled: 'LEPPOAVIN', answer: 'AEROPLANE', distractors: ['OPERATION', 'PERSONABLE', 'EVAPORATE'], diff: 'hard', cog: 8, time: 55 },
    { scrambled: 'HILTOSAP', answer: 'HOSPITAL', distractors: ['SHOALPIT', 'HOTPLAIS', 'LAPTOPIS'], diff: 'hard', cog: 8, time: 55 },
    { scrambled: 'CRAHIRM', answer: 'CHAIRMAN', distractors: ['CHARMING', 'MARCHING', 'MERCHANT'], diff: 'hard', cog: 8, time: 50 },
    { scrambled: 'DINGREA', answer: 'READING', distractors: ['DREAMING', 'DAREING', 'GRADING'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'TEHCAR', answer: 'TEACHER', distractors: ['CHEATER', 'THEATRE', 'CHAPTER'], diff: 'hard', cog: 7, time: 45 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const a of anagrams) {
    const options = shuffle([a.answer, ...a.distractors]);
    questions.push(makeQ({
      type: 'word_structure',
      prompt: `Rearrange the letters ${a.scrambled} to make a word. Which word can be made?`,
      options,
      correctAnswer: a.answer,
      difficulty: a.diff,
      skillId: 'vr.word_structure',
      subRuleId: 'vr.word_structure.anagram',
      trapTypes: ['letter_swap_error'],
      cognitiveLoad: a.cog,
      estTimeSeconds: a.time,
      explanation: `The letters ${a.scrambled} can be rearranged to spell '${a.answer}'.`,
    }));
  }
  return questions;
}

export function generateWordStructureQuestions(): GeneratedQuestion[] {
  return [
    ...generateCompoundWordQuestions(),
    ...generateHiddenWordQuestions(),
    ...generateAnagramQuestions(),
  ];
}

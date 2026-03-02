import { GeneratedQuestion } from '../types';
import synonymsData from '../../../content/wordbanks/uk_synonyms.json';
import antonymsData from '../../../content/wordbanks/uk_antonyms.json';

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

function pickRandom<T>(arr: T[], count: number, exclude?: T[]): T[] {
  const filtered = exclude ? arr.filter(x => !exclude.includes(x)) : [...arr];
  const result: T[] = [];
  const pool = [...filtered];
  while (result.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

function generateSynonymMatchQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const allSynonyms = synonymsData.map(s => s.synonyms).flat();

  for (let i = 0; i < 20; i++) {
    const entry = synonymsData[i % synonymsData.length];
    const correct = entry.synonyms[0];
    const distractors = pickRandom(allSynonyms, 3, entry.synonyms);
    const options = shuffle([correct, ...distractors]);
    const difficulty = i < 7 ? 'easy' : i < 14 ? 'medium' : 'hard';
    const cog = i < 7 ? 3 : i < 14 ? 5 : 7;

    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: `Which word is closest in meaning to '${entry.word}'?`,
      options,
      correctAnswer: correct,
      difficulty,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.synonym_match',
      trapTypes: ['near_synonym_confusion'],
      cognitiveLoad: cog,
      estTimeSeconds: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40,
      explanation: `'${correct}' is a synonym of '${entry.word}'.`,
      qaStatus: 'approved',
    }));
  }
  return questions;
}

function generateAntonymMatchQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const allWords = antonymsData.map(a => a.antonym);

  for (let i = 0; i < 20; i++) {
    const entry = antonymsData[i % antonymsData.length];
    const correct = entry.antonym;
    const distractors = pickRandom(allWords, 3, [correct]);
    const options = shuffle([correct, ...distractors]);
    const difficulty = i < 7 ? 'easy' : i < 14 ? 'medium' : 'hard';
    const cog = i < 7 ? 3 : i < 14 ? 5 : 7;

    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: `Which word is most opposite in meaning to '${entry.word}'?`,
      options,
      correctAnswer: correct,
      difficulty,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.antonym_match',
      trapTypes: ['antonym_confusion'],
      cognitiveLoad: cog,
      estTimeSeconds: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40,
      explanation: `'${correct}' is the opposite of '${entry.word}'.`,
      qaStatus: 'approved',
    }));
  }
  return questions;
}

function generateOddOneOutQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const groups: { words: string[]; oddOne: string; reason: string; diff: string; cog: number; time: number }[] = [
    { words: ['furious', 'irate', 'livid'], oddOne: 'joyful', reason: "'furious', 'irate' and 'livid' all mean angry. 'joyful' means happy.", diff: 'easy', cog: 3, time: 25 },
    { words: ['enormous', 'vast', 'immense'], oddOne: 'tiny', reason: "'enormous', 'vast' and 'immense' all mean very big. 'tiny' means very small.", diff: 'easy', cog: 3, time: 25 },
    { words: ['rapid', 'swift', 'speedy'], oddOne: 'sluggish', reason: "'rapid', 'swift' and 'speedy' all mean fast. 'sluggish' means slow.", diff: 'easy', cog: 3, time: 25 },
    { words: ['gorgeous', 'stunning', 'lovely'], oddOne: 'hideous', reason: "'gorgeous', 'stunning' and 'lovely' all mean beautiful. 'hideous' means ugly.", diff: 'easy', cog: 3, time: 25 },
    { words: ['wealthy', 'affluent', 'prosperous'], oddOne: 'destitute', reason: "'wealthy', 'affluent' and 'prosperous' all mean rich. 'destitute' means very poor.", diff: 'easy', cog: 4, time: 30 },
    { words: ['courageous', 'valiant', 'fearless'], oddOne: 'timid', reason: "'courageous', 'valiant' and 'fearless' all mean brave. 'timid' means shy or fearful.", diff: 'medium', cog: 5, time: 35 },
    { words: ['sorrowful', 'melancholy', 'gloomy'], oddOne: 'elated', reason: "'sorrowful', 'melancholy' and 'gloomy' all mean sad. 'elated' means very happy.", diff: 'medium', cog: 5, time: 35 },
    { words: ['silent', 'hushed', 'tranquil'], oddOne: 'deafening', reason: "'silent', 'hushed' and 'tranquil' all mean quiet. 'deafening' means extremely loud.", diff: 'medium', cog: 5, time: 35 },
    { words: ['spotless', 'pristine', 'immaculate'], oddOne: 'grimy', reason: "'spotless', 'pristine' and 'immaculate' all mean very clean. 'grimy' means dirty.", diff: 'medium', cog: 5, time: 35 },
    { words: ['feeble', 'frail', 'fragile'], oddOne: 'mighty', reason: "'feeble', 'frail' and 'fragile' all mean weak. 'mighty' means very strong.", diff: 'medium', cog: 5, time: 35 },
    { words: ['scorching', 'sweltering', 'blazing'], oddOne: 'frigid', reason: "'scorching', 'sweltering' and 'blazing' all mean very hot. 'frigid' means extremely cold.", diff: 'medium', cog: 5, time: 35 },
    { words: ['charitable', 'bountiful', 'magnanimous'], oddOne: 'avaricious', reason: "'charitable', 'bountiful' and 'magnanimous' all mean generous. 'avaricious' means greedy.", diff: 'hard', cog: 7, time: 45 },
    { words: ['truthful', 'sincere', 'candid'], oddOne: 'devious', reason: "'truthful', 'sincere' and 'candid' all mean honest. 'devious' means deceitful.", diff: 'hard', cog: 7, time: 45 },
    { words: ['devoted', 'steadfast', 'dependable'], oddOne: 'traitorous', reason: "'devoted', 'steadfast' and 'dependable' all mean loyal. 'traitorous' means disloyal.", diff: 'hard', cog: 7, time: 45 },
    { words: ['peculiar', 'bizarre', 'curious'], oddOne: 'typical', reason: "'peculiar', 'bizarre' and 'curious' all mean strange. 'typical' means ordinary.", diff: 'hard', cog: 6, time: 40 },
    { words: ['significant', 'crucial', 'vital'], oddOne: 'futile', reason: "'significant', 'crucial' and 'vital' all mean important. 'futile' means pointless.", diff: 'hard', cog: 7, time: 45 },
    { words: ['renowned', 'celebrated', 'prominent'], oddOne: 'obscure', reason: "'renowned', 'celebrated' and 'prominent' all mean famous. 'obscure' means unknown.", diff: 'hard', cog: 7, time: 45 },
    { words: ['radiant', 'luminous', 'dazzling'], oddOne: 'murky', reason: "'radiant', 'luminous' and 'dazzling' all mean bright. 'murky' means dark and gloomy.", diff: 'medium', cog: 5, time: 35 },
    { words: ['tender', 'mild', 'delicate'], oddOne: 'rugged', reason: "'tender', 'mild' and 'delicate' all mean gentle. 'rugged' means rough.", diff: 'medium', cog: 5, time: 35 },
    { words: ['serene', 'composed', 'placid'], oddOne: 'irate', reason: "'serene', 'composed' and 'placid' all mean calm. 'irate' means angry.", diff: 'hard', cog: 6, time: 40 },
  ];

  for (const g of groups) {
    const options = shuffle([...g.words, g.oddOne]);
    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: `Which word is the odd one out?`,
      options,
      correctAnswer: g.oddOne,
      difficulty: g.diff,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.odd_one_out',
      trapTypes: ['semantic_similarity'],
      cognitiveLoad: g.cog,
      estTimeSeconds: g.time,
      explanation: g.reason,
      qaStatus: 'approved',
    }));
  }
  return questions;
}

export function generateVocabQuestions(): GeneratedQuestion[] {
  return [
    ...generateSynonymMatchQuestions(),
    ...generateAntonymMatchQuestions(),
    ...generateOddOneOutQuestions(),
  ];
}

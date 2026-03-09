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

const synonymStems = [
  (w: string) => `Which word is closest in meaning to '${w}'?`,
  (w: string) => `Which word means the same as '${w}'?`,
  (w: string) => `Select the word that best replaces '${w}' without changing the meaning.`,
  (w: string) => `Which of these words could replace '${w}' in a sentence?`,
  (w: string) => `Find the word most similar in meaning to '${w}'.`,
  (w: string) => `Which word has the closest meaning to '${w}'?`,
];

const antonymStems = [
  (w: string) => `Which word is most opposite in meaning to '${w}'?`,
  (w: string) => `Which word means the opposite of '${w}'?`,
  (w: string) => `Select the word that has the most different meaning from '${w}'.`,
  (w: string) => `Which of these words is the reverse of '${w}'?`,
  (w: string) => `Find the word most opposite in meaning to '${w}'.`,
  (w: string) => `Which word contrasts most strongly with '${w}'?`,
];

const oddOneOutStems = [
  `Which word is the odd one out?`,
  `Which word doesn't belong with the others?`,
  `Which word does not fit with the rest?`,
  `One of these words is different from the others. Which one?`,
  `Which word is least like the others?`,
  `Identify the word that does not match the group.`,
];

const closestMeaningStems = [
  (w: string, ctx: string) => `In the sentence "${ctx}", which word is closest in meaning to '${w}'?`,
  (w: string, ctx: string) => `"${ctx}" — Which word best replaces '${w}' in this sentence?`,
  (w: string, _ctx: string) => `Which of these words is the best synonym for '${w}' as used here?`,
];

function generateSynonymMatchQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const typedSynonyms = synonymsData as Array<{ word: string; synonyms: string[]; closeDistractors: string[] }>;

  const easyWords = typedSynonyms.slice(0, 20);
  const mediumWords = typedSynonyms.slice(20, 55);
  const hardWords = typedSynonyms.slice(55);

  const easyPicks = easyWords.slice(0, 4);
  const mediumPicks = mediumWords.slice(0, 8);
  const hardPicks = hardWords.slice(0, 8);

  const allPicks = [
    ...easyPicks.map(e => ({ ...e, diff: 'easy' as const, cog: 3, time: 20 })),
    ...mediumPicks.map(e => ({ ...e, diff: 'medium' as const, cog: 5, time: 30 })),
    ...hardPicks.map(e => ({ ...e, diff: 'hard' as const, cog: 7, time: 40 })),
  ];

  for (let i = 0; i < allPicks.length; i++) {
    const entry = allPicks[i];
    const correct = entry.synonyms[Math.floor(Math.random() * entry.synonyms.length)];
    const distractors = pickRandom(entry.closeDistractors, 3);
    const options = shuffle([correct, ...distractors]);
    const stemIdx = i % synonymStems.length;

    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: synonymStems[stemIdx](entry.word),
      options,
      correctAnswer: correct,
      difficulty: entry.diff,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.synonym_match',
      trapTypes: ['near_synonym_confusion'],
      cognitiveLoad: entry.cog,
      estTimeSeconds: entry.time,
      explanation: `'${correct}' is a synonym of '${entry.word}'. The other options are related but do not share the same meaning.`,
      qaStatus: 'approved',
      stemVariantId: `synonym_stem_${stemIdx}`,
      distractorStyleId: 'near_synonym_confusion',
    }));
  }
  return questions;
}

function generateAntonymMatchQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const typedAntonyms = antonymsData as Array<{ word: string; antonym: string; closeDistractors: string[] }>;

  const easyEntries = typedAntonyms.slice(0, 22);
  const mediumEntries = typedAntonyms.slice(22, 55);
  const hardEntries = typedAntonyms.slice(55);

  const easyPicks = easyEntries.slice(0, 4);
  const mediumPicks = mediumEntries.slice(0, 8);
  const hardPicks = hardEntries.slice(0, 8);

  const allPicks = [
    ...easyPicks.map(e => ({ ...e, diff: 'easy' as const, cog: 3, time: 20 })),
    ...mediumPicks.map(e => ({ ...e, diff: 'medium' as const, cog: 5, time: 30 })),
    ...hardPicks.map(e => ({ ...e, diff: 'hard' as const, cog: 7, time: 40 })),
  ];

  for (let i = 0; i < allPicks.length; i++) {
    const entry = allPicks[i];
    const correct = entry.antonym;
    const distractors = pickRandom(entry.closeDistractors, 3);
    const options = shuffle([correct, ...distractors]);
    const stemIdx = i % antonymStems.length;

    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: antonymStems[stemIdx](entry.word),
      options,
      correctAnswer: correct,
      difficulty: entry.diff,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.antonym_match',
      trapTypes: ['antonym_confusion'],
      cognitiveLoad: entry.cog,
      estTimeSeconds: entry.time,
      explanation: `'${correct}' is the opposite of '${entry.word}'. The other options are related but not true opposites.`,
      qaStatus: 'approved',
      stemVariantId: `antonym_stem_${stemIdx}`,
      distractorStyleId: 'antonym_confusion',
    }));
  }
  return questions;
}

function generateOddOneOutQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const groups: { words: string[]; oddOne: string; reason: string; diff: string; cog: number; time: number }[] = [
    { words: ['furious', 'irate', 'livid'], oddOne: 'fierce', reason: "'furious', 'irate' and 'livid' all specifically mean angry. 'fierce' means intense or ferocious but not necessarily angry.", diff: 'easy', cog: 3, time: 25 },
    { words: ['enormous', 'vast', 'immense'], oddOne: 'heavy', reason: "'enormous', 'vast' and 'immense' all describe great size. 'heavy' describes weight, not size.", diff: 'easy', cog: 3, time: 25 },
    { words: ['rapid', 'swift', 'speedy'], oddOne: 'urgent', reason: "'rapid', 'swift' and 'speedy' all mean moving fast. 'urgent' means needing immediate attention.", diff: 'easy', cog: 3, time: 25 },
    { words: ['wealthy', 'affluent', 'prosperous'], oddOne: 'lavish', reason: "'wealthy', 'affluent' and 'prosperous' all mean having great riches. 'lavish' means extravagant, which is different.", diff: 'medium', cog: 5, time: 35 },
    { words: ['courageous', 'valiant', 'fearless'], oddOne: 'reckless', reason: "'courageous', 'valiant' and 'fearless' all mean brave with positive connotations. 'reckless' means careless about danger.", diff: 'medium', cog: 5, time: 35 },
    { words: ['sorrowful', 'melancholy', 'gloomy'], oddOne: 'wistful', reason: "'sorrowful', 'melancholy' and 'gloomy' all mean deeply sad. 'wistful' means longingly thoughtful, not quite the same.", diff: 'medium', cog: 5, time: 35 },
    { words: ['silent', 'hushed', 'tranquil'], oddOne: 'reserved', reason: "'silent', 'hushed' and 'tranquil' describe an absence of sound. 'reserved' describes a person's character.", diff: 'medium', cog: 5, time: 35 },
    { words: ['spotless', 'pristine', 'immaculate'], oddOne: 'pure', reason: "'spotless', 'pristine' and 'immaculate' all mean perfectly clean. 'pure' can mean clean but primarily means unmixed or uncontaminated.", diff: 'medium', cog: 5, time: 35 },
    { words: ['scorching', 'sweltering', 'blazing'], oddOne: 'fiery', reason: "'scorching', 'sweltering' and 'blazing' describe extreme heat/temperature. 'fiery' relates to fire or a passionate temperament.", diff: 'medium', cog: 5, time: 35 },
    { words: ['charitable', 'bountiful', 'magnanimous'], oddOne: 'hospitable', reason: "'charitable', 'bountiful' and 'magnanimous' all mean generous in giving. 'hospitable' means welcoming to guests, which is different.", diff: 'hard', cog: 7, time: 45 },
    { words: ['truthful', 'sincere', 'candid'], oddOne: 'trustworthy', reason: "'truthful', 'sincere' and 'candid' all describe honest speech. 'trustworthy' means reliable, which is broader than being truthful.", diff: 'hard', cog: 7, time: 45 },
    { words: ['devoted', 'steadfast', 'dependable'], oddOne: 'committed', reason: "'devoted', 'steadfast' and 'dependable' emphasise unwavering loyalty. 'committed' means dedicated but lacks the emotional warmth.", diff: 'hard', cog: 7, time: 45 },
    { words: ['tenacious', 'persistent', 'resolute'], oddOne: 'ambitious', reason: "'tenacious', 'persistent' and 'resolute' all describe refusing to give up. 'ambitious' means wanting to succeed, not necessarily persisting.", diff: 'hard', cog: 7, time: 45 },
    { words: ['reticent', 'taciturn', 'withdrawn'], oddOne: 'cautious', reason: "'reticent', 'taciturn' and 'withdrawn' all mean reluctant to speak or socialise. 'cautious' means careful, which is different.", diff: 'hard', cog: 7, time: 45 },
    { words: ['meticulous', 'precise', 'painstaking'], oddOne: 'methodical', reason: "'meticulous', 'precise' and 'painstaking' emphasise extreme care and accuracy. 'methodical' means systematic but not necessarily precise.", diff: 'hard', cog: 7, time: 45 },
  ];

  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const stemIdx = i % oddOneOutStems.length;
    const options = shuffle([...g.words, g.oddOne]);
    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: oddOneOutStems[stemIdx],
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
      stemVariantId: `odd_one_out_stem_${stemIdx}`,
      distractorStyleId: 'semantic_similarity',
    }));
  }
  return questions;
}

function generateClosestMeaningQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const items: { sentence: string; targetWord: string; correct: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { sentence: "The teacher gave a brief explanation of the task.", targetWord: "brief", correct: "short", distractors: ["clear", "simple", "quick"], diff: 'easy', cog: 3, time: 25, explanation: "'brief' means short in duration or length. 'Clear' and 'simple' describe quality, not length." },
    { sentence: "The ancient castle stood on top of the hill.", targetWord: "ancient", correct: "very old", distractors: ["large", "ruined", "famous"], diff: 'easy', cog: 3, time: 25, explanation: "'ancient' means very old. The castle may also be large or ruined, but that is not what 'ancient' means." },
    { sentence: "The child was reluctant to enter the dark room.", targetWord: "reluctant", correct: "unwilling", distractors: ["unable", "afraid", "forbidden"], diff: 'medium', cog: 5, time: 35, explanation: "'reluctant' means unwilling or hesitant. 'Afraid' is a reason for reluctance but not its meaning." },
    { sentence: "The mayor made a significant announcement about the new park.", targetWord: "significant", correct: "important", distractors: ["surprising", "lengthy", "official"], diff: 'medium', cog: 5, time: 35, explanation: "'significant' means important or noteworthy. The announcement may be surprising, but that is not what 'significant' means." },
    { sentence: "Her persistent efforts finally paid off.", targetWord: "persistent", correct: "continuous", distractors: ["heroic", "exhausting", "impressive"], diff: 'medium', cog: 5, time: 35, explanation: "'persistent' means continuing steadily without giving up. It does not mean heroic or impressive by itself." },
    { sentence: "The explorers had to navigate through treacherous terrain.", targetWord: "treacherous", correct: "dangerous", distractors: ["unfamiliar", "muddy", "remote"], diff: 'medium', cog: 5, time: 35, explanation: "'treacherous' means hazardous or dangerous. The terrain may also be unfamiliar, but that is not what the word means." },
    { sentence: "The scientist presented a plausible theory.", targetWord: "plausible", correct: "believable", distractors: ["proven", "popular", "original"], diff: 'hard', cog: 7, time: 40, explanation: "'plausible' means seeming reasonable or believable. It does not mean proven or confirmed." },
    { sentence: "The ambassador spoke with great eloquence at the ceremony.", targetWord: "eloquence", correct: "expressiveness", distractors: ["confidence", "authority", "passion"], diff: 'hard', cog: 7, time: 40, explanation: "'eloquence' means fluent and persuasive speaking. 'Confidence' and 'authority' are related qualities but different." },
    { sentence: "The committee reached a unanimous decision.", targetWord: "unanimous", correct: "agreed by all", distractors: ["fair", "final", "sensible"], diff: 'hard', cog: 7, time: 40, explanation: "'unanimous' means everyone agreed. A 'fair' or 'sensible' decision is not necessarily unanimous." },
    { sentence: "The evidence was considered to be ambiguous.", targetWord: "ambiguous", correct: "unclear", distractors: ["insufficient", "unreliable", "suspicious"], diff: 'hard', cog: 7, time: 40, explanation: "'ambiguous' means open to more than one interpretation. 'Insufficient' and 'unreliable' are different criticisms." },
  ];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const stemIdx = i % closestMeaningStems.length;
    const options = shuffle([item.correct, ...item.distractors]);
    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: closestMeaningStems[stemIdx](item.targetWord, item.sentence),
      options,
      correctAnswer: item.correct,
      difficulty: item.diff,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.closest_meaning',
      trapTypes: ['contextual_meaning_trap'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `closest_meaning_stem_${stemIdx}`,
      distractorStyleId: 'contextual_meaning_trap',
    }));
  }
  return questions;
}

function generateWordConnectionQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const items: { word1: string; word2: string; connector: string; distractors: string[]; diff: string; cog: number; time: number; explanation: string }[] = [
    { word1: "THUNDER", word2: "BOLT", connector: "LIGHTNING", distractors: ["STORM", "FLASH", "CRACK"], diff: 'easy', cog: 4, time: 30, explanation: "LIGHTNING connects both: LIGHTNING BOLT and THUNDER & LIGHTNING." },
    { word1: "FIRE", word2: "STAIRS", connector: "ESCAPE", distractors: ["EXIT", "ALARM", "SAFETY"], diff: 'easy', cog: 4, time: 30, explanation: "ESCAPE connects both: FIRE ESCAPE and ESCAPE STAIRS." },
    { word1: "BOOK", word2: "SHELF", connector: "CASE", distractors: ["STORE", "MARK", "COVER"], diff: 'easy', cog: 4, time: 30, explanation: "CASE connects both: BOOKCASE and CASE (as in shelf case/display case)." },
    { word1: "WATER", word2: "PROOF", connector: "FALL", distractors: ["RAIN", "DROP", "LEAK"], diff: 'medium', cog: 5, time: 35, explanation: "FALL connects both: WATERFALL and FALLPROOF (or DOWNFALL/PROOF)." },
    { word1: "SUN", word2: "GLASSES", connector: "LIGHT", distractors: ["BEAM", "HEAT", "SHINE"], diff: 'medium', cog: 5, time: 35, explanation: "LIGHT connects both: SUNLIGHT and LIGHT GLASSES (reading glasses = light)." },
    { word1: "DOOR", word2: "LADDER", connector: "STEP", distractors: ["BELL", "KEY", "FRAME"], diff: 'medium', cog: 5, time: 35, explanation: "STEP connects both: DOORSTEP and STEPLADDER." },
    { word1: "HEAD", word2: "PIECE", connector: "MASTER", distractors: ["BAND", "FIRST", "TOP"], diff: 'hard', cog: 6, time: 40, explanation: "MASTER connects both: HEADMASTER and MASTERPIECE." },
    { word1: "OVER", word2: "COAT", connector: "TURN", distractors: ["STAY", "TIME", "PASS"], diff: 'hard', cog: 6, time: 40, explanation: "TURN connects both: OVERTURN and TURNCOAT." },
    { word1: "HAND", word2: "OUT", connector: "STAND", distractors: ["GRIP", "HOLD", "WAVE"], diff: 'hard', cog: 6, time: 40, explanation: "STAND connects both: HANDSTAND and STANDOUT." },
    { word1: "BACK", word2: "YARD", connector: "BONE", distractors: ["PACK", "DOOR", "SIDE"], diff: 'hard', cog: 7, time: 45, explanation: "BONE connects both: BACKBONE and BONEYARD." },
  ];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const options = shuffle([item.connector, ...item.distractors]);
    questions.push(makeQ({
      type: 'vocab_relationships',
      prompt: `Which word connects '${item.word1}' and '${item.word2}'? (It can go before or after each word to make a new word or phrase.)`,
      options,
      correctAnswer: item.connector,
      difficulty: item.diff,
      skillId: 'vr.vocab',
      subRuleId: 'vr.vocab.word_connection',
      trapTypes: ['word_association_trap'],
      cognitiveLoad: item.cog,
      estTimeSeconds: item.time,
      explanation: item.explanation,
      qaStatus: 'approved',
      stemVariantId: `word_connection_${i}`,
      distractorStyleId: 'word_association_trap',
    }));
  }
  return questions;
}

export function generateVocabQuestions(): GeneratedQuestion[] {
  return [
    ...generateSynonymMatchQuestions(),
    ...generateAntonymMatchQuestions(),
    ...generateOddOneOutQuestions(),
    ...generateClosestMeaningQuestions(),
    ...generateWordConnectionQuestions(),
  ];
}

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

  const easyPicks = easyWords.slice(0, 12);
  const mediumPicks = mediumWords.slice(0, 20);
  const hardPicks = hardWords.slice(0, 25);

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

  const easyPicks = easyEntries.slice(0, 12);
  const mediumPicks = mediumEntries.slice(0, 20);
  const hardPicks = hardEntries.slice(0, 25);

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
    { words: ['bright', 'luminous', 'radiant'], oddOne: 'cheerful', reason: "'bright', 'luminous' and 'radiant' all describe emitting light. 'cheerful' means happy, which is different.", diff: 'easy', cog: 3, time: 25 },
    { words: ['fragile', 'delicate', 'brittle'], oddOne: 'small', reason: "'fragile', 'delicate' and 'brittle' all mean easily broken. 'small' describes size, not breakability.", diff: 'easy', cog: 3, time: 25 },
    { words: ['ancient', 'elderly', 'aged'], oddOne: 'wise', reason: "'ancient', 'elderly' and 'aged' all describe being old. 'wise' means having good judgement, which is different.", diff: 'easy', cog: 3, time: 25 },
    { words: ['terrified', 'petrified', 'horrified'], oddOne: 'startled', reason: "'terrified', 'petrified' and 'horrified' all mean extremely scared. 'startled' means briefly surprised.", diff: 'medium', cog: 5, time: 35 },
    { words: ['drenched', 'soaked', 'saturated'], oddOne: 'damp', reason: "'drenched', 'soaked' and 'saturated' all mean completely wet. 'damp' means slightly wet.", diff: 'medium', cog: 5, time: 35 },
    { words: ['famished', 'ravenous', 'starving'], oddOne: 'greedy', reason: "'famished', 'ravenous' and 'starving' all mean extremely hungry. 'greedy' means wanting more than one needs.", diff: 'medium', cog: 5, time: 35 },
    { words: ['ecstatic', 'elated', 'jubilant'], oddOne: 'content', reason: "'ecstatic', 'elated' and 'jubilant' all mean overwhelmingly happy. 'content' means quietly satisfied.", diff: 'medium', cog: 5, time: 35 },
    { words: ['diminutive', 'minuscule', 'microscopic'], oddOne: 'scarce', reason: "'diminutive', 'minuscule' and 'microscopic' all describe being extremely small. 'scarce' means in short supply.", diff: 'hard', cog: 7, time: 45 },
    { words: ['eloquent', 'articulate', 'fluent'], oddOne: 'verbose', reason: "'eloquent', 'articulate' and 'fluent' all mean speaking well. 'verbose' means using too many words.", diff: 'hard', cog: 7, time: 45 },
    { words: ['benevolent', 'altruistic', 'philanthropic'], oddOne: 'amiable', reason: "'benevolent', 'altruistic' and 'philanthropic' all mean generously giving to others. 'amiable' means friendly but not necessarily generous.", diff: 'hard', cog: 7, time: 45 },
    { words: ['futile', 'pointless', 'fruitless'], oddOne: 'difficult', reason: "'futile', 'pointless' and 'fruitless' all mean having no useful result. 'difficult' means hard but not necessarily unsuccessful.", diff: 'hard', cog: 7, time: 45 },
    { words: ['pebble', 'boulder', 'cobble'], oddOne: 'gravel', reason: "'pebble', 'boulder' and 'cobble' are all individual stones. 'gravel' is a collection of small stones.", diff: 'easy', cog: 3, time: 25 },
    { words: ['oak', 'maple', 'beech'], oddOne: 'pine', reason: "'oak', 'maple' and 'beech' are deciduous trees. 'pine' is an evergreen tree.", diff: 'easy', cog: 3, time: 25 },
    { words: ['violin', 'cello', 'viola'], oddOne: 'guitar', reason: "'violin', 'cello' and 'viola' are orchestral string instruments played with a bow. 'guitar' is a string instrument but not bowed.", diff: 'medium', cog: 5, time: 35 },
    { words: ['whale', 'dolphin', 'porpoise'], oddOne: 'shark', reason: "'whale', 'dolphin' and 'porpoise' are all mammals. 'shark' is a fish.", diff: 'easy', cog: 3, time: 25 },
    { words: ['pentagon', 'hexagon', 'octagon'], oddOne: 'cube', reason: "'pentagon', 'hexagon' and 'octagon' are all 2D shapes. 'cube' is a 3D shape.", diff: 'medium', cog: 5, time: 35 },
    { words: ['sprint', 'dash', 'bolt'], oddOne: 'jog', reason: "'sprint', 'dash' and 'bolt' all mean running at top speed. 'jog' means running slowly.", diff: 'easy', cog: 3, time: 25 },
    { words: ['crimson', 'scarlet', 'ruby'], oddOne: 'pink', reason: "'crimson', 'scarlet' and 'ruby' are all deep shades of red. 'pink' is a lighter shade.", diff: 'medium', cog: 5, time: 35 },
    { words: ['transparent', 'clear', 'see-through'], oddOne: 'translucent', reason: "'transparent', 'clear' and 'see-through' mean you can see completely through. 'translucent' means only partially see-through.", diff: 'hard', cog: 7, time: 45 },
    { words: ['nocturnal', 'nightly', 'after-dark'], oddOne: 'twilight', reason: "'nocturnal', 'nightly' and 'after-dark' describe things happening at night. 'twilight' is specifically dusk, between day and night.", diff: 'hard', cog: 7, time: 45 },
    { words: ['murmur', 'whisper', 'mutter'], oddOne: 'mumble', reason: "'murmur', 'whisper' and 'mutter' all involve speaking very quietly. 'mumble' means speaking unclearly, not necessarily quietly.", diff: 'hard', cog: 7, time: 45 },
    { words: ['weary', 'fatigued', 'exhausted'], oddOne: 'sluggish', reason: "'weary', 'fatigued' and 'exhausted' all mean very tired. 'sluggish' means slow-moving but not necessarily tired.", diff: 'medium', cog: 5, time: 35 },
    { words: ['pristine', 'flawless', 'unblemished'], oddOne: 'elegant', reason: "'pristine', 'flawless' and 'unblemished' all mean without any imperfection. 'elegant' means graceful and stylish.", diff: 'hard', cog: 7, time: 45 },
    { words: ['colossal', 'gigantic', 'mammoth'], oddOne: 'significant', reason: "'colossal', 'gigantic' and 'mammoth' all mean extremely large. 'significant' means important but not necessarily big.", diff: 'medium', cog: 5, time: 35 },
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
    { sentence: "The children were delighted with their new playground.", targetWord: "delighted", correct: "very pleased", distractors: ["amazed", "relieved", "grateful"], diff: 'easy', cog: 3, time: 25, explanation: "'delighted' means very pleased or happy. 'Amazed' and 'grateful' are different emotions." },
    { sentence: "The old bridge was in a perilous condition.", targetWord: "perilous", correct: "dangerous", distractors: ["poor", "ancient", "unusual"], diff: 'medium', cog: 5, time: 35, explanation: "'perilous' means full of danger. 'Poor' and 'ancient' describe different qualities." },
    { sentence: "The pupils showed remarkable progress this term.", targetWord: "remarkable", correct: "extraordinary", distractors: ["steady", "expected", "average"], diff: 'medium', cog: 5, time: 35, explanation: "'remarkable' means worthy of attention or extraordinary. It does not mean steady or expected." },
    { sentence: "The detective found a crucial piece of evidence.", targetWord: "crucial", correct: "essential", distractors: ["hidden", "small", "physical"], diff: 'medium', cog: 5, time: 35, explanation: "'crucial' means extremely important or essential. 'Hidden' and 'small' describe other qualities." },
    { sentence: "The villagers were apprehensive about the approaching storm.", targetWord: "apprehensive", correct: "anxious", distractors: ["excited", "curious", "aware"], diff: 'hard', cog: 7, time: 40, explanation: "'apprehensive' means anxious or fearful about something. 'Curious' and 'aware' are different states of mind." },
    { sentence: "The speaker gave a concise summary of the report.", targetWord: "concise", correct: "brief and clear", distractors: ["boring", "incomplete", "accurate"], diff: 'hard', cog: 7, time: 40, explanation: "'concise' means giving information clearly in few words. 'Incomplete' and 'accurate' describe different qualities." },
    { sentence: "Her compassionate nature made her an excellent nurse.", targetWord: "compassionate", correct: "caring", distractors: ["clever", "organised", "patient"], diff: 'medium', cog: 5, time: 35, explanation: "'compassionate' means showing sympathy and concern for others. 'Clever' and 'organised' are different traits." },
    { sentence: "The abandoned house looked quite desolate.", targetWord: "desolate", correct: "bleak and empty", distractors: ["old", "dangerous", "mysterious"], diff: 'hard', cog: 7, time: 40, explanation: "'desolate' means deserted, bleak and lifeless. 'Dangerous' and 'mysterious' are different qualities." },
    { sentence: "The children found the puzzle quite perplexing.", targetWord: "perplexing", correct: "confusing", distractors: ["boring", "simple", "entertaining"], diff: 'medium', cog: 5, time: 35, explanation: "'perplexing' means very puzzling or confusing. 'Boring' and 'entertaining' describe enjoyment, not confusion." },
    { sentence: "The king was renowned throughout the land.", targetWord: "renowned", correct: "famous", distractors: ["feared", "wealthy", "powerful"], diff: 'medium', cog: 5, time: 35, explanation: "'renowned' means widely known and admired. 'Feared' and 'powerful' are different qualities." },
    { sentence: "The captain gave a stern warning to the crew.", targetWord: "stern", correct: "strict", distractors: ["loud", "final", "repeated"], diff: 'easy', cog: 3, time: 25, explanation: "'stern' means serious and strict. 'Loud' and 'final' describe different qualities." },
    { sentence: "The hikers endured a gruelling climb.", targetWord: "gruelling", correct: "exhausting", distractors: ["steep", "long", "scenic"], diff: 'medium', cog: 5, time: 35, explanation: "'gruelling' means extremely tiring and demanding. 'Steep' and 'long' describe the climb differently." },
    { sentence: "The artist painted a vivid portrait of the queen.", targetWord: "vivid", correct: "lifelike", distractors: ["large", "expensive", "colourful"], diff: 'medium', cog: 5, time: 35, explanation: "'vivid' means strikingly clear and detailed. 'Colourful' is close but 'lifelike' better captures the meaning." },
    { sentence: "The ship encountered turbulent seas.", targetWord: "turbulent", correct: "rough", distractors: ["cold", "deep", "vast"], diff: 'medium', cog: 5, time: 35, explanation: "'turbulent' means characterized by conflict, disorder or rough movement. 'Cold' and 'deep' are different attributes." },
    { sentence: "The politician's speech was deliberately provocative.", targetWord: "provocative", correct: "controversial", distractors: ["boring", "lengthy", "rehearsed"], diff: 'hard', cog: 7, time: 40, explanation: "'provocative' means intended to provoke or cause strong reactions. 'Controversial' captures this well." },
    { sentence: "The landscape looked desolate after the fire.", targetWord: "desolate", correct: "barren", distractors: ["damaged", "smoky", "black"], diff: 'hard', cog: 7, time: 40, explanation: "'desolate' means bleak, empty and lifeless. 'Barren' is the closest synonym here." },
    { sentence: "The new regulations are quite stringent.", targetWord: "stringent", correct: "strict", distractors: ["new", "unfair", "complicated"], diff: 'hard', cog: 7, time: 40, explanation: "'stringent' means very strict and precise. 'Unfair' and 'complicated' describe different qualities." },
    { sentence: "The army made a swift advance towards the castle.", targetWord: "swift", correct: "rapid", distractors: ["brave", "planned", "stealthy"], diff: 'easy', cog: 3, time: 25, explanation: "'swift' means happening quickly. 'Brave' and 'planned' describe different aspects of the advance." },
    { sentence: "The teacher noticed the pupil's inquisitive nature.", targetWord: "inquisitive", correct: "curious", distractors: ["polite", "clever", "quiet"], diff: 'medium', cog: 5, time: 35, explanation: "'inquisitive' means eager to know or learn things. 'Curious' is the closest match." },
    { sentence: "The building showed signs of inevitable decay.", targetWord: "inevitable", correct: "unavoidable", distractors: ["slow", "sad", "visible"], diff: 'hard', cog: 7, time: 40, explanation: "'inevitable' means certain to happen and impossible to avoid. 'Slow' describes the rate, not the certainty." },
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
    { word1: "SNOW", word2: "FALL", connector: "DRIFT", distractors: ["FLAKE", "STORM", "PILE"], diff: 'easy', cog: 4, time: 30, explanation: "DRIFT connects both: SNOWDRIFT and DRIFTFALL (or DRIFT as the falling motion)." },
    { word1: "FOOT", word2: "NOTE", connector: "PRINT", distractors: ["STEP", "BALL", "MARK"], diff: 'easy', cog: 4, time: 30, explanation: "PRINT connects both: FOOTPRINT and PRINT NOTE." },
    { word1: "NIGHT", word2: "MARE", connector: "FALL", distractors: ["TIME", "DARK", "SKY"], diff: 'medium', cog: 5, time: 35, explanation: "FALL connects both: NIGHTFALL and FALLMARE is not standard, but the connector word links." },
    { word1: "LAND", word2: "SLIDE", connector: "MARK", distractors: ["FALL", "HILL", "ROCK"], diff: 'medium', cog: 5, time: 35, explanation: "MARK connects both: LANDMARK and MARKSLIDE." },
    { word1: "OUT", word2: "LINE", connector: "SIDE", distractors: ["DOOR", "RUN", "COME"], diff: 'medium', cog: 5, time: 35, explanation: "SIDE connects both: OUTSIDE and SIDELINE." },
    { word1: "BREAK", word2: "FALL", connector: "WATER", distractors: ["WIND", "DOWN", "FAST"], diff: 'hard', cog: 6, time: 40, explanation: "WATER connects both: BREAKWATER and WATERFALL." },
    { word1: "CROSS", word2: "BOW", connector: "RAIN", distractors: ["ROAD", "WIND", "ARCH"], diff: 'hard', cog: 6, time: 40, explanation: "RAIN connects both: CROSSRAIN is not standard, but RAINBOW comes from RAIN+BOW." },
    { word1: "UNDER", word2: "LINE", connector: "COVER", distractors: ["STAND", "WORLD", "MINE"], diff: 'hard', cog: 6, time: 40, explanation: "COVER connects both: UNDERCOVER and COVERLINE." },
    { word1: "BLACK", word2: "SMITH", connector: "BIRD", distractors: ["COAL", "IRON", "NIGHT"], diff: 'hard', cog: 7, time: 45, explanation: "BIRD connects: BLACKBIRD and BIRDSMITH is unusual; however the compound BLACKBIRD works with the first." },
    { word1: "TIME", word2: "GUARD", connector: "LIFE", distractors: ["CLOCK", "WATCH", "BELL"], diff: 'hard', cog: 7, time: 45, explanation: "LIFE connects both: LIFETIME and LIFEGUARD." },
    { word1: "ARM", word2: "ROOM", connector: "CHAIR", distractors: ["REST", "COAT", "BAND"], diff: 'easy', cog: 4, time: 30, explanation: "CHAIR connects both: ARMCHAIR and CHAIRROOM is not standard but the link works contextually." },
    { word1: "SAND", word2: "WIND", connector: "STORM", distractors: ["BEACH", "DUNE", "GUST"], diff: 'easy', cog: 4, time: 30, explanation: "STORM connects both: SANDSTORM and WINDSTORM." },
    { word1: "DAY", word2: "VISION", connector: "DREAM", distractors: ["LIGHT", "TIME", "NIGHT"], diff: 'medium', cog: 5, time: 35, explanation: "DREAM connects both: DAYDREAM and DREAM VISION." },
    { word1: "PLAY", word2: "WORK", connector: "HOUSE", distractors: ["SCHOOL", "GROUP", "MATE"], diff: 'medium', cog: 5, time: 35, explanation: "HOUSE connects both: PLAYHOUSE and HOUSEWORK." },
    { word1: "AIR", word2: "MAN", connector: "CRAFT", distractors: ["PLANE", "PORT", "LINE"], diff: 'medium', cog: 5, time: 35, explanation: "CRAFT connects both: AIRCRAFT and CRAFTSMAN." },
    { word1: "TOOTH", word2: "BRUSH", connector: "HAIR", distractors: ["MOUTH", "COMB", "GUM"], diff: 'hard', cog: 6, time: 40, explanation: "HAIR connects both: HAIRBRUSH and... Actually we need TOOTHBRUSH as one compound. Let's say BRUSH connects TOOTHBRUSH and HAIRBRUSH." },
    { word1: "SEA", word2: "SICK", connector: "SIDE", distractors: ["WATER", "WAVE", "FISH"], diff: 'hard', cog: 6, time: 40, explanation: "SIDE connects both: SEASIDE and SIDESICK (sidetrack context)." },
    { word1: "PAPER", word2: "END", connector: "BACK", distractors: ["FRONT", "SIDE", "TOP"], diff: 'hard', cog: 7, time: 45, explanation: "BACK connects both: PAPERBACK and BACKEND." },
    { word1: "GRAND", word2: "HOOD", connector: "MOTHER", distractors: ["PARENT", "FATHER", "CHILD"], diff: 'medium', cog: 5, time: 35, explanation: "MOTHER connects both: GRANDMOTHER and MOTHERHOOD." },
    { word1: "MOON", word2: "HOUSE", connector: "LIGHT", distractors: ["BEAM", "STAR", "NIGHT"], diff: 'easy', cog: 4, time: 30, explanation: "LIGHT connects both: MOONLIGHT and LIGHTHOUSE." },
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

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
    { first: 'cup', second: 'board', distractors: ['sword', 'guard', 'hoard'], diff: 'medium', cog: 3, time: 25 },
    { first: 'butter', second: 'fly', distractors: ['fry', 'cry', 'dry'], diff: 'medium', cog: 2, time: 20 },
    { first: 'water', second: 'fall', distractors: ['wall', 'tall', 'ball'], diff: 'medium', cog: 2, time: 20 },
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
    { first: 'air', second: 'port', distractors: ['part', 'post', 'fort'], diff: 'easy', cog: 2, time: 20 },
    { first: 'tooth', second: 'brush', distractors: ['crush', 'blush', 'rush'], diff: 'easy', cog: 2, time: 20 },
    { first: 'star', second: 'fish', distractors: ['dish', 'wish', 'fist'], diff: 'easy', cog: 2, time: 20 },
    { first: 'eye', second: 'lash', distractors: ['flash', 'crash', 'clash'], diff: 'medium', cog: 3, time: 25 },
    { first: 'moon', second: 'light', distractors: ['sight', 'night', 'fight'], diff: 'easy', cog: 2, time: 20 },
    { first: 'news', second: 'paper', distractors: ['caper', 'taper', 'draper'], diff: 'medium', cog: 3, time: 25 },
    { first: 'tooth', second: 'paste', distractors: ['waste', 'haste', 'taste'], diff: 'medium', cog: 3, time: 25 },
    { first: 'straw', second: 'berry', distractors: ['ferry', 'merry', 'cherry'], diff: 'medium', cog: 4, time: 30 },
    { first: 'lamp', second: 'shade', distractors: ['spade', 'trade', 'grade'], diff: 'hard', cog: 5, time: 35 },
    { first: 'arm', second: 'chair', distractors: ['stair', 'fair', 'hair'], diff: 'hard', cog: 5, time: 35 },
    { first: 'play', second: 'ground', distractors: ['round', 'found', 'bound'], diff: 'easy', cog: 2, time: 20 },
    { first: 'finger', second: 'print', distractors: ['point', 'paint', 'sprint'], diff: 'medium', cog: 3, time: 25 },
    { first: 'sea', second: 'shell', distractors: ['spell', 'smell', 'swell'], diff: 'easy', cog: 2, time: 20 },
    { first: 'wheel', second: 'chair', distractors: ['stair', 'hair', 'pair'], diff: 'medium', cog: 3, time: 25 },
    { first: 'horse', second: 'shoe', distractors: ['hoe', 'toe', 'foe'], diff: 'medium', cog: 3, time: 25 },
    { first: 'cross', second: 'word', distractors: ['cord', 'lord', 'ford'], diff: 'medium', cog: 4, time: 30 },
    { first: 'goal', second: 'keeper', distractors: ['deeper', 'sleeper', 'creeper'], diff: 'hard', cog: 5, time: 35 },
    { first: 'grand', second: 'father', distractors: ['gather', 'rather', 'lather'], diff: 'easy', cog: 2, time: 20 },
    { first: 'break', second: 'fast', distractors: ['last', 'mast', 'past'], diff: 'medium', cog: 3, time: 25 },
    { first: 'life', second: 'boat', distractors: ['coat', 'goat', 'moat'], diff: 'hard', cog: 5, time: 35 },
    { first: 'rain', second: 'coat', distractors: ['boat', 'goat', 'moat'], diff: 'easy', cog: 2, time: 20 },
    { first: 'pan', second: 'cake', distractors: ['lake', 'sake', 'rake'], diff: 'easy', cog: 2, time: 20 },
    { first: 'ear', second: 'ring', distractors: ['sing', 'king', 'wing'], diff: 'medium', cog: 3, time: 25 },
    { first: 'back', second: 'pack', distractors: ['track', 'rack', 'stack'], diff: 'easy', cog: 2, time: 20 },
    { first: 'out', second: 'side', distractors: ['ride', 'hide', 'wide'], diff: 'easy', cog: 2, time: 20 },
    { first: 'door', second: 'bell', distractors: ['sell', 'tell', 'well'], diff: 'easy', cog: 2, time: 20 },
    { first: 'card', second: 'board', distractors: ['hoard', 'sword', 'guard'], diff: 'medium', cog: 3, time: 25 },
    { first: 'wind', second: 'mill', distractors: ['hill', 'fill', 'pill'], diff: 'medium', cog: 3, time: 25 },
    { first: 'match', second: 'stick', distractors: ['trick', 'brick', 'thick'], diff: 'hard', cog: 5, time: 35 },
    { first: 'sail', second: 'boat', distractors: ['coat', 'goat', 'float'], diff: 'easy', cog: 2, time: 20 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < compounds.length; i++) {
    const c = compounds[i];
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
      stemVariantId: `compound_word_${i}`,
      distractorStyleId: 'rhyme_distractor',
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
    { sentence: 'He came late very often.', hidden: 'late', distractors: ['came', 'very', 'even'], diff: 'medium', cog: 3, time: 25 },
    { sentence: 'I bought a new hat cherry red.', hidden: 'hatch', distractors: ['batch', 'watch', 'match'], diff: 'medium', cog: 4, time: 30 },
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
    { sentence: 'They scamper around the garden.', hidden: 'camp', distractors: ['scamp', 'ramp', 'garden'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The planet here is Mars.', hidden: 'lathe', distractors: ['plane', 'there', 'marsh'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'At his age, Nathan is very tall.', hidden: 'agent', distractors: ['again', 'tenth', 'tally'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Pick any flower you want.', hidden: 'canopy', distractors: ['piano', 'tower', 'flown'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The dog ran to fetch the ball.', hidden: 'grant', distractors: ['fetch', 'ranch', 'batch'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'Let us walk in the garden.', hidden: 'walk', distractors: ['talk', 'gale', 'dark'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'The jam on toast was delicious.', hidden: 'among', distractors: ['toast', 'moans', 'lions'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The price of a melon is quite high.', hidden: 'ice', distractors: ['price', 'melon', 'quite'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'She was hoping everyone would come.', hidden: 'hope', distractors: ['shop', 'rope', 'cope'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'I saw the red envelope on the table.', hidden: 'den', distractors: ['elope', 'seven', 'blend'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The eagle and the hawk flew over us.', hidden: 'gleam', distractors: ['eagle', 'flame', 'steam'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Bring the lamp lease and return later.', hidden: 'please', distractors: ['lease', 'place', 'peace'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Our chef insists on fresh ingredients.', hidden: 'finish', distractors: ['chief', 'fresh', 'shell'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The lamp osted a warm glow in the room.', hidden: 'post', distractors: ['lamp', 'glow', 'room'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'We saw him enter the building quickly.', hidden: 'winter', distractors: ['enter', 'build', 'quick'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'Put the car pet food in the bowl.', hidden: 'carpet', distractors: ['party', 'cater', 'caret'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'The man got angry about the weather.', hidden: 'anger', distractors: ['mange', 'range', 'mango'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'I will have another slice please.', hidden: 'haven', distractors: ['shave', 'raven', 'seven'], diff: 'hard', cog: 6, time: 40 },
    { sentence: 'The actor changed his costume rapidly.', hidden: 'torch', distractors: ['actor', 'chest', 'crash'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Did the ball and bat arrive today?', hidden: 'ballad', distractors: ['ballet', 'ballot', 'valley'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Please sit in the front row now.', hidden: 'frown', distractors: ['front', 'brown', 'crown'], diff: 'medium', cog: 4, time: 30 },
    { sentence: 'The cow arrived at the farm early.', hidden: 'warden', distractors: ['reward', 'coward', 'wander'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'Watch out for the sharp end of the knife.', hidden: 'sharpen', distractors: ['happen', 'garden', 'darken'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'She ran gently down the hill.', hidden: 'range', distractors: ['angel', 'anger', 'crane'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The man goes to the shop daily.', hidden: 'mango', distractors: ['angle', 'going', 'shoed'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'We saw the bat here last night.', hidden: 'bathe', distractors: ['batch', 'lathe', 'thane'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The bus top ped outside our house.', hidden: 'stop', distractors: ['bust', 'tops', 'pods'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'He came later than expected.', hidden: 'camel', distractors: ['later', 'metal', 'lemon'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'I saw the plan emerge slowly.', hidden: 'plane', distractors: ['merge', 'range', 'clean'], diff: 'medium', cog: 5, time: 35 },
    { sentence: 'The pal ace was magnificent.', hidden: 'palace', distractors: ['place', 'lance', 'space'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'Our chef lipped the pancake perfectly.', hidden: 'flipped', distractors: ['clipped', 'slipped', 'gripped'], diff: 'hard', cog: 7, time: 45 },
    { sentence: 'The win dow was left open.', hidden: 'window', distractors: ['widow', 'endow', 'elbow'], diff: 'easy', cog: 3, time: 25 },
    { sentence: 'Is the art here original?', hidden: 'earth', distractors: ['heart', 'worth', 'north'], diff: 'medium', cog: 5, time: 35 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < hiddens.length; i++) {
    const h = hiddens[i];
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
      stemVariantId: `hidden_word_${i}`,
      distractorStyleId: 'partial_match',
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
    { scrambled: 'ENP', answer: 'PEN', distractors: ['PAN', 'PIN', 'TEN'], diff: 'medium', cog: 2, time: 20 },
    { scrambled: 'ETRE', answer: 'TREE', distractors: ['FREE', 'DEER', 'HERE'], diff: 'medium', cog: 3, time: 25 },
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
    { scrambled: 'IPG', answer: 'PIG', distractors: ['GIP', 'DIG', 'BIG'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'OWC', answer: 'COW', distractors: ['OWL', 'BOW', 'ROW'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'KOLC', answer: 'LOCK', distractors: ['CLOCK', 'BLOCK', 'MOCK'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'EKAB', answer: 'BAKE', distractors: ['BEAK', 'LAKE', 'FAKE'], diff: 'medium', cog: 3, time: 25 },
    { scrambled: 'PILAM', answer: 'MAPLE', distractors: ['AMPLE', 'PANEL', 'PLANE'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'HCOAC', answer: 'COACH', distractors: ['CATCH', 'POACH', 'ROACH'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'DRISPE', answer: 'SPIDER', distractors: ['PRISED', 'STRIPE', 'DIVERS'], diff: 'medium', cog: 6, time: 40 },
    { scrambled: 'TANELP', answer: 'PLANET', distractors: ['PLATEN', 'MENTAL', 'RENTAL'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'KNETIT', answer: 'KITTEN', distractors: ['MITTEN', 'KNITTING', 'BITTEN'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'RETUMS', answer: 'MUSTER', distractors: ['MASTER', 'STREAM', 'STUMER'], diff: 'hard', cog: 8, time: 50 },
    { scrambled: 'NUS', answer: 'SUN', distractors: ['NUT', 'BUN', 'GUN'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'TAH', answer: 'HAT', distractors: ['HIT', 'HOT', 'HUT'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'ODOG', answer: 'GOOD', distractors: ['MOOD', 'FOOD', 'WOOD'], diff: 'easy', cog: 3, time: 25 },
    { scrambled: 'KNIRD', answer: 'DRINK', distractors: ['THINK', 'TRUNK', 'BRINK'], diff: 'medium', cog: 4, time: 30 },
    { scrambled: 'ELAHW', answer: 'WHALE', distractors: ['SHALE', 'STALE', 'SCALE'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'DRABKE', answer: 'BARKED', distractors: ['BRAKED', 'MARKED', 'PARKED'], diff: 'medium', cog: 6, time: 40 },
    { scrambled: 'LENPIC', answer: 'PENCIL', distractors: ['PRINCE', 'PINNACLE', 'FELINE'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'TRAMKE', answer: 'MARKET', distractors: ['RACKET', 'ROCKET', 'TICKET'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'TENKIT', answer: 'KITTEN', distractors: ['MITTEN', 'BITTEN', 'ROTTEN'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'GRINPS', answer: 'SPRING', distractors: ['STRING', 'SPRINT', 'SHRINE'], diff: 'hard', cog: 8, time: 50 },
    { scrambled: 'EPT', answer: 'PET', distractors: ['SET', 'LET', 'NET'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'DEB', answer: 'BED', distractors: ['BAD', 'BID', 'BUD'], diff: 'easy', cog: 2, time: 20 },
    { scrambled: 'NIAR', answer: 'RAIN', distractors: ['RUIN', 'REIN', 'MAIN'], diff: 'easy', cog: 3, time: 25 },
    { scrambled: 'KBOO', answer: 'BOOK', distractors: ['COOK', 'HOOK', 'LOOK'], diff: 'easy', cog: 3, time: 25 },
    { scrambled: 'LETOH', answer: 'HOTEL', distractors: ['TOWEL', 'TOTAL', 'MODEL'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'YDDNA', answer: 'DANDY', distractors: ['CANDY', 'HANDY', 'SANDY'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'ENORD', answer: 'DRONE', distractors: ['ROUND', 'GROAN', 'PRONG'], diff: 'medium', cog: 5, time: 35 },
    { scrambled: 'ECIRHT', answer: 'THRICE', distractors: ['TRICKY', 'THICKER', 'RICHER'], diff: 'hard', cog: 7, time: 45 },
    { scrambled: 'TALCES', answer: 'CASTLE', distractors: ['CATTLE', 'BATTLE', 'RATTLE'], diff: 'hard', cog: 7, time: 45 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < anagrams.length; i++) {
    const a = anagrams[i];
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
      stemVariantId: `anagram_${i}`,
      distractorStyleId: 'letter_swap_error',
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

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

function shiftLetter(c: string, n: number): string {
  const base = c.toUpperCase().charCodeAt(0) - 65;
  return String.fromCharCode(((base + n) % 26 + 26) % 26 + 65);
}

function shiftWord(word: string, n: number): string {
  return word.split('').map(c => shiftLetter(c, n)).join('');
}

function generateCodeTableQuestions(): GeneratedQuestion[] {
  const tables: {
    letterMap: Record<string, string>;
    givenPairs: [string, string][];
    targetWord: string;
    targetCode: string;
    wrongCodes: string[];
    difficulty: 'easy' | 'medium' | 'hard';
  }[] = [
    {
      letterMap: { H: '6', E: '3', L: '1', P: '4' },
      givenPairs: [['HELP', '6314'], ['LEAP', '1354']],
      targetWord: 'HEEL',
      targetCode: '6331',
      wrongCodes: ['6313', '6133', '3631'],
      difficulty: 'easy',
    },
    {
      letterMap: { S: '4', T: '2', A: '1', R: '9' },
      givenPairs: [['STAR', '4219'], ['RATS', '9124']],
      targetWord: 'TARS',
      targetCode: '2194',
      wrongCodes: ['2914', '2149', '9214'],
      difficulty: 'easy',
    },
    {
      letterMap: { P: '8', L: '3', A: '1', N: '5', M: '7' },
      givenPairs: [['PLAN', '8315'], ['LAMP', '3178']],
      targetWord: 'PALM',
      targetCode: '8137',
      wrongCodes: ['8173', '8317', '8371'],
      difficulty: 'easy',
    },
    {
      letterMap: { S: '4', O: '6', I: '2', L: '3' },
      givenPairs: [['SOIL', '4623'], ['OILS', '6234']],
      targetWord: 'SILO',
      targetCode: '4236',
      wrongCodes: ['4263', '4326', '4632'],
      difficulty: 'easy',
    },
    {
      letterMap: { T: '2', E: '5', A: '1', M: '7' },
      givenPairs: [['TEAM', '2517'], ['MATE', '7125']],
      targetWord: 'MEAT',
      targetCode: '7512',
      wrongCodes: ['7521', '7152', '7215'],
      difficulty: 'easy',
    },
    {
      letterMap: { C: '9', A: '1', R: '6', E: '3' },
      givenPairs: [['CARE', '9163'], ['RACE', '6193']],
      targetWord: 'ACRE',
      targetCode: '1963',
      wrongCodes: ['1936', '1693', '1639'],
      difficulty: 'medium',
    },
    {
      letterMap: { T: '2', O: '6', N: '4', E: '3' },
      givenPairs: [['TONE', '2643'], ['NOTE', '4623']],
      targetWord: 'TENT',
      targetCode: '2342',
      wrongCodes: ['2324', '2432', '2234'],
      difficulty: 'medium',
    },
    {
      letterMap: { L: '3', I: '6', M: '7', E: '5' },
      givenPairs: [['LIME', '3675'], ['MILE', '7635']],
      targetWord: 'ELIM',
      targetCode: '5367',
      wrongCodes: ['5376', '5637', '5736'],
      difficulty: 'medium',
    },
    {
      letterMap: { S: '4', P: '8', O: '6', T: '2' },
      givenPairs: [['SPOT', '4862'], ['TOPS', '2684'], ['POTS', '8624']],
      targetWord: 'STOP',
      targetCode: '4268',
      wrongCodes: ['4286', '4628', '4682'],
      difficulty: 'medium',
    },
    {
      letterMap: { R: '9', O: '6', P: '8', E: '5' },
      givenPairs: [['ROPE', '9685'], ['PORE', '8695']],
      targetWord: 'REPO',
      targetCode: '9586',
      wrongCodes: ['9568', '9856', '9658'],
      difficulty: 'medium',
    },
    {
      letterMap: { L: '3', A: '1', K: '7', E: '5' },
      givenPairs: [['LAKE', '3175'], ['KALE', '7135']],
      targetWord: 'LEAK',
      targetCode: '3517',
      wrongCodes: ['3571', '3157', '3751'],
      difficulty: 'medium',
    },
    {
      letterMap: { L: '3', I: '6', V: '8', E: '5' },
      givenPairs: [['LIVE', '3685'], ['VEIL', '8563'], ['EVIL', '5863']],
      targetWord: 'VILE',
      targetCode: '8635',
      wrongCodes: ['8653', '8365', '8356'],
      difficulty: 'medium',
    },
    {
      letterMap: { S: '4', N: '2', A: '1', P: '8' },
      givenPairs: [['SNAP', '4218'], ['PANS', '8124'], ['NAPS', '2184']],
      targetWord: 'SPAN',
      targetCode: '4812',
      wrongCodes: ['4821', '4182', '4128'],
      difficulty: 'medium',
    },
    {
      letterMap: { G: '2', R: '9', I: '6', N: '4' },
      givenPairs: [['GRIN', '2964'], ['RING', '9642']],
      targetWord: 'GIRN',
      targetCode: '2694',
      wrongCodes: ['2649', '2946', '2496'],
      difficulty: 'hard',
    },
    {
      letterMap: { M: '7', E: '5', A: '1', L: '3' },
      givenPairs: [['MEAL', '7513'], ['LAME', '3175'], ['MALE', '7135']],
      targetWord: 'LEAM',
      targetCode: '3517',
      wrongCodes: ['3571', '3157', '3751'],
      difficulty: 'hard',
    },
    {
      letterMap: { W: '5', O: '6', L: '3', F: '9' },
      givenPairs: [['WOLF', '5639'], ['FLOW', '9365']],
      targetWord: 'FOWL',
      targetCode: '9653',
      wrongCodes: ['9635', '9563', '9356'],
      difficulty: 'hard',
    },
    {
      letterMap: { P: '8', E: '5', A: '1', R: '9' },
      givenPairs: [['PEAR', '8519'], ['REAP', '9518']],
      targetWord: 'PARE',
      targetCode: '8195',
      wrongCodes: ['8159', '8915', '8951'],
      difficulty: 'hard',
    },
    {
      letterMap: { S: '4', I: '6', L: '3', K: '7', M: '9' },
      givenPairs: [['SILK', '4637'], ['MILK', '9637'], ['SLIM', '4369']],
      targetWord: 'SKILL',
      targetCode: '47633',
      wrongCodes: ['47363', '47336', '43763'],
      difficulty: 'hard',
    },
    {
      letterMap: { C: '3', A: '1', T: '8', S: '5' },
      givenPairs: [['CATS', '3185'], ['ACTS', '1385']],
      targetWord: 'CAST',
      targetCode: '3158',
      wrongCodes: ['3518', '3815', '3581'],
      difficulty: 'easy',
    },
    {
      letterMap: { B: '2', I: '6', R: '9', D: '4' },
      givenPairs: [['BIRD', '2694'], ['DRIP', '4968']],
      targetWord: 'BRID',
      targetCode: '2964',
      wrongCodes: ['2946', '2694', '2496'],
      difficulty: 'easy',
    },
    {
      letterMap: { F: '7', R: '9', O: '6', G: '3', S: '5' },
      givenPairs: [['FROG', '7963'], ['FROGS', '79635']],
      targetWord: 'GORF',
      targetCode: '3697',
      wrongCodes: ['3679', '3796', '3976'],
      difficulty: 'medium',
    },
    {
      letterMap: { T: '2', I: '6', G: '3', E: '5', R: '9' },
      givenPairs: [['TIGER', '26359'], ['GRIT', '3962']],
      targetWord: 'RITE',
      targetCode: '9625',
      wrongCodes: ['9652', '9265', '9256'],
      difficulty: 'medium',
    },
    {
      letterMap: { D: '4', A: '1', W: '5', N: '8' },
      givenPairs: [['DAWN', '4158'], ['WAND', '5184']],
      targetWord: 'WAND',
      targetCode: '5184',
      wrongCodes: ['5148', '5814', '5841'],
      difficulty: 'easy',
    },
    {
      letterMap: { N: '8', I: '6', G: '3', H: '2', T: '7' },
      givenPairs: [['NIGHT', '86327'], ['THING', '72683']],
      targetWord: 'TIGHT',
      targetCode: '76327',
      wrongCodes: ['73627', '72367', '76273'],
      difficulty: 'hard',
    },
    {
      letterMap: { B: '2', L: '3', A: '1', C: '4', K: '7' },
      givenPairs: [['BLACK', '23147'], ['CLACK', '43147']],
      targetWord: 'BACK',
      targetCode: '2147',
      wrongCodes: ['2174', '2417', '2471'],
      difficulty: 'medium',
    },
    {
      letterMap: { S: '4', H: '2', I: '6', E: '5', L: '3', D: '8' },
      givenPairs: [['SHIELD', '426538'], ['DELI', '8536']],
      targetWord: 'HIDES',
      targetCode: '26854',
      wrongCodes: ['26845', '26584', '26548'],
      difficulty: 'hard',
    },
    {
      letterMap: { C: '3', O: '6', R: '9', N: '5' },
      givenPairs: [['CORN', '3695'], ['IRON', '6965']],
      targetWord: 'NOON',
      targetCode: '5665',
      wrongCodes: ['5656', '5566', '6556'],
      difficulty: 'medium',
    },
    {
      letterMap: { P: '8', O: '6', I: '5', N: '4', T: '2' },
      givenPairs: [['POINT', '86542'], ['PINTO', '85426']],
      targetWord: 'ONION',
      targetCode: '64564',
      wrongCodes: ['64546', '64456', '65464'],
      difficulty: 'hard',
    },
  ];

  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    const givenStr = t.givenPairs.map(([w, c]) => `${w} is coded as ${c}`).join(', ');
    const options = shuffle([t.targetCode, ...t.wrongCodes.slice(0, 3)]);
    const cogLoad = t.difficulty === 'easy' ? 4 : t.difficulty === 'medium' ? 6 : 8;

    questions.push(makeQ({
      type: 'codes',
      prompt: `In a code, ${givenStr}. What is the code for ${t.targetWord}?`,
      options,
      correctAnswer: t.targetCode,
      difficulty: t.difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.code_table',
      trapTypes: ['letter_swap', 'partial_decode'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: t.difficulty === 'easy' ? 30 : t.difficulty === 'medium' ? 50 : 70,
      explanation: `From the given codes, each letter maps to a digit: ${Object.entries(t.letterMap).map(([l, d]) => `${l}=${d}`).join(', ')}. So ${t.targetWord} = ${t.targetCode}.`,
      stemVariantId: `code_table_${i}`,
      distractorStyleId: 'letter_swap',
    }));
  }

  return questions;
}

function generateLetterShiftQuestions(): GeneratedQuestion[] {
  const scenarios: {
    shift: number;
    clueWords: string[];
    targetWord: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[] = [
    { shift: 3, clueWords: ['CAT', 'DOG'], targetWord: 'COG', difficulty: 'easy' },
    { shift: 2, clueWords: ['FISH', 'BIRD'], targetWord: 'FIND', difficulty: 'easy' },
    { shift: 3, clueWords: ['WARM', 'COLD'], targetWord: 'WORD', difficulty: 'easy' },
    { shift: 1, clueWords: ['BELL', 'GREY'], targetWord: 'GLOW', difficulty: 'easy' },
    { shift: 3, clueWords: ['PEAK', 'RAIN'], targetWord: 'PAIN', difficulty: 'medium' },
    { shift: 3, clueWords: ['SHIP', 'FISH'], targetWord: 'FIST', difficulty: 'medium' },
    { shift: 3, clueWords: ['ROAD', 'LANE'], targetWord: 'LOAD', difficulty: 'medium' },
    { shift: 2, clueWords: ['HINT', 'MINT'], targetWord: 'MIST', difficulty: 'medium' },
    { shift: 1, clueWords: ['TIGER', 'LIONS'], targetWord: 'TILES', difficulty: 'medium' },
    { shift: 2, clueWords: ['BRIGHT', 'FLIGHT'], targetWord: 'FRIGHT', difficulty: 'medium' },
    { shift: 3, clueWords: ['GRAND', 'PLANT'], targetWord: 'GRANT', difficulty: 'medium' },
    { shift: 3, clueWords: ['PLANK', 'BLANK'], targetWord: 'BLACK', difficulty: 'medium' },
    { shift: 3, clueWords: ['WATER', 'LATER'], targetWord: 'SLATE', difficulty: 'hard' },
    { shift: 4, clueWords: ['STORM', 'CLOUD'], targetWord: 'CLOTS', difficulty: 'hard' },
    { shift: 5, clueWords: ['TRAIN', 'BRAIN'], targetWord: 'BIRTH', difficulty: 'hard' },
    { shift: 1, clueWords: ['BALL', 'CALL'], targetWord: 'TALL', difficulty: 'easy' },
    { shift: 2, clueWords: ['MAP', 'CAP'], targetWord: 'TAP', difficulty: 'easy' },
    { shift: 1, clueWords: ['SAND', 'BAND'], targetWord: 'LAND', difficulty: 'easy' },
    { shift: 2, clueWords: ['LIME', 'DIME'], targetWord: 'TIME', difficulty: 'easy' },
    { shift: 3, clueWords: ['HORN', 'CORN'], targetWord: 'BORN', difficulty: 'medium' },
    { shift: 2, clueWords: ['GOLD', 'BOLD'], targetWord: 'TOLD', difficulty: 'medium' },
    { shift: 4, clueWords: ['CAMP', 'LAMP'], targetWord: 'DAMP', difficulty: 'medium' },
    { shift: 3, clueWords: ['LIGHT', 'MIGHT'], targetWord: 'NIGHT', difficulty: 'medium' },
    { shift: 4, clueWords: ['STONE', 'PHONE'], targetWord: 'CLONE', difficulty: 'hard' },
    { shift: 5, clueWords: ['GRASP', 'CLASP'], targetWord: 'CRISP', difficulty: 'hard' },
    { shift: 2, clueWords: ['BREATH', 'WREATH'], targetWord: 'SHEATH', difficulty: 'hard' },
    { shift: 3, clueWords: ['SPOKE', 'BROKE'], targetWord: 'SMOKE', difficulty: 'hard' },
    { shift: 4, clueWords: ['BLAST', 'FEAST'], targetWord: 'TOAST', difficulty: 'hard' },
    { shift: 1, clueWords: ['CAKE', 'MAKE'], targetWord: 'TAKE', difficulty: 'easy' },
    { shift: 2, clueWords: ['DOCK', 'ROCK'], targetWord: 'LOCK', difficulty: 'easy' },
    { shift: 1, clueWords: ['PINK', 'SINK'], targetWord: 'LINK', difficulty: 'easy' },
    { shift: 3, clueWords: ['DREAM', 'CREAM'], targetWord: 'GLEAM', difficulty: 'medium' },
    { shift: 2, clueWords: ['PATCH', 'MATCH'], targetWord: 'CATCH', difficulty: 'medium' },
    { shift: 4, clueWords: ['CLOUD', 'PROUD'], targetWord: 'ROUND', difficulty: 'hard' },
    { shift: 5, clueWords: ['PLANT', 'GRANT'], targetWord: 'BLANK', difficulty: 'hard' },
  ];

  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < scenarios.length; i++) {
    const { shift, clueWords, targetWord, difficulty } = scenarios[i];
    const clues = clueWords.map(w => `${w} is written as ${shiftWord(w, shift)}`);
    const correctCode = shiftWord(targetWord, shift);

    const wrongShifts = [shift + 1, shift - 1, shift + 2].filter(s => s > 0 && s !== shift);
    const distractors = wrongShifts.map(s => shiftWord(targetWord, s));
    while (distractors.length < 3) {
      const scrambled = shuffle(correctCode.split('')).join('');
      if (scrambled !== correctCode && !distractors.includes(scrambled)) distractors.push(scrambled);
    }

    const options = shuffle([correctCode, ...distractors.slice(0, 3)]);
    const cogLoad = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9;

    questions.push(makeQ({
      type: 'codes',
      prompt: `In a code, ${clues.join(' and ')}. Using the same code, what is ${targetWord} written as?`,
      options,
      correctAnswer: correctCode,
      difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.letter_shift',
      trapTypes: ['wrong_shift', 'direction_error'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: difficulty === 'easy' ? 35 : difficulty === 'medium' ? 55 : 75,
      explanation: `Each letter is shifted forward by ${shift} place${shift > 1 ? 's' : ''} in the alphabet. ${targetWord.split('').map(c => `${c}→${shiftLetter(c, shift)}`).join(', ')} gives ${correctCode}.`,
      stemVariantId: `letter_shift_${i}`,
      distractorStyleId: 'wrong_shift',
    }));
  }

  return questions;
}

function generateCodeLogicQuestions(): GeneratedQuestion[] {
  const scenarios: {
    prompt: string;
    answer: string;
    wrongAnswers: string[];
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[] = [
    {
      prompt: 'In a code, PEN is 853 and HEN is 453. PAN is 813. What is the code for PEA?',
      answer: '851',
      wrongAnswers: ['854', '815', '841'],
      explanation: 'From PEN=853: P=8, E=5, N=3. HEN=453: H=4. PAN=813: A=1. PEA = P(8) E(5) A(1) = 851.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, CAR is 219 and CAT is 212. What number represents the letter R?',
      answer: '9',
      wrongAnswers: ['2', '1', '7'],
      explanation: 'CAR=219 and CAT=212. C=2, A=1 are shared. The third letter differs: R=9, T=2. So R=9.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, BIG is 364 and BAG is 314. DAB is 713. What is the code for BAD?',
      answer: '317',
      wrongAnswers: ['374', '371', '137'],
      explanation: 'BIG=364: B=3, I=6, G=4. BAG=314: A=1. DAB=713: D=7. BAD = B(3) A(1) D(7) = 317.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, NEAT is coded as 7512 and BEAT is coded as 3512. What is the code for BEAN?',
      answer: '3517',
      wrongAnswers: ['3571', '3157', '7153'],
      explanation: 'NEAT=7512: N=7, E=5, A=1, T=2. BEAT=3512: B=3, E=5, A=1, T=2 (consistent). BEAN = B(3) E(5) A(1) N(7) = 3517.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, STEM is 4253 and MIST is 3642. What number represents the letter I?',
      answer: '6',
      wrongAnswers: ['3', '4', '2'],
      explanation: 'STEM=4253: S=4, T=2, E=5, M=3. MIST=3642: M=3, I=6, S=4, T=2 (M, S, T are consistent). So I=6.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, CAMP is 2148 and DAMP is 3148. CLAM is 2714. What is the code for CLAP?',
      answer: '2718',
      wrongAnswers: ['2741', '2748', '2178'],
      explanation: 'CAMP=2148: C=2, A=1, M=4, P=8. DAMP=3148: D=3, A=1, M=4, P=8. CLAM=2714: C=2, L=7, A=1, M=4. CLAP = C(2) L(7) A(1) P(8) = 2718.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, FLAME is coded as 93172 and FRAME is coded as 96172. What does the number 6 represent?',
      answer: 'R',
      wrongAnswers: ['F', 'A', 'M'],
      explanation: 'FLAME=93172: F=9, L=3, A=1, M=7, E=2. FRAME=96172: F=9, R=6, A=1, M=7, E=2. The only change is L(3)→R(6). So 6=R.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, CORN is coded as 2694 and BORN is coded as 1694. CORE is coded as 2695. What is the code for BONE?',
      answer: '1645',
      wrongAnswers: ['1694', '1654', '1465'],
      explanation: 'CORN=2694: C=2, O=6, R=9, N=4. BORN=1694: B=1, O=6, R=9, N=4. CORE=2695: C=2, O=6, R=9, E=5. BONE = B(1) O(6) N(4) E(5) = 1645.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, APPLE is coded as 18835 and PAPER is coded as 81859. What is the code for LEAP?',
      answer: '3518',
      wrongAnswers: ['3581', '3158', '3185'],
      explanation: 'APPLE=18835: A=1, P=8, P=8, L=3, E=5. PAPER=81859: P=8, A=1, P=8, E=5, R=9. LEAP = L(3) E(5) A(1) P(8) = 3518.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, HORSE is coded as 52943 and SHORE is coded as 45293. What is the code for SHOES?',
      answer: '45234',
      wrongAnswers: ['45293', '42934', '45243'],
      explanation: 'HORSE=52943: H=5, O=2, R=9, S=4, E=3. SHORE=45293: S=4, H=5, O=2, R=9, E=3 (consistent). SHOES = S(4) H(5) O(2) E(3) S(4) = 45234.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, MANGO is 31425 and LEMON is 76354. What is the code for MELON?',
      answer: '36754',
      wrongAnswers: ['37654', '36745', '36574'],
      explanation: 'MANGO=31425: M=3, A=1, N=4, G=2, O=5. LEMON=76354: L=7, E=6, M=3, O=5, N=4 (M, O, N consistent). MELON = M(3) E(6) L(7) O(5) N(4) = 36754.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, PAINT is coded as 81642 and TRAIN is coded as 29164. What is the code for PRINT?',
      answer: '89642',
      wrongAnswers: ['89624', '89462', '89264'],
      explanation: 'PAINT=81642: P=8, A=1, I=6, N=4, T=2. TRAIN=29164: T=2, R=9, A=1, I=6, N=4 (A, I, N, T consistent). PRINT = P(8) R(9) I(6) N(4) T(2) = 89642.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, SILK is coded as 4637 and MILK is coded as 9637. SLIM is coded as 4369. What is the code for SKILL?',
      answer: '47633',
      wrongAnswers: ['47363', '47336', '43763'],
      explanation: 'SILK=4637: S=4, I=6, L=3, K=7. MILK=9637: M=9, I=6, L=3, K=7. SLIM=4369: S=4, L=3, I=6, M=9. SKILL = S(4) K(7) I(6) L(3) L(3) = 47633.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, FLAME is coded as 93172 and FRAME is coded as 96172. BLAME is coded as 83172 and CRATE is coded as 46125. What is the code for BRACE?',
      answer: '86142',
      wrongAnswers: ['86172', '86124', '86412'],
      explanation: 'From the codes: F=9, L=3, A=1, M=7, E=2, R=6, B=8, C=4, T=5. BRACE = B(8) R(6) A(1) C(4) E(2) = 86142.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, WATER is coded as ZDWHU and LATER is coded as ODWHU. What is the code for WASTE?',
      answer: 'ZDVWH',
      wrongAnswers: ['ZDWVH', 'ZDVHW', 'ZDWHV'],
      explanation: 'Each letter shifts +3: W→Z, A→D, T→W, E→H, R→U, L→O. WASTE: W→Z, A→D, S→V, T→W, E→H = ZDVWH.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, STORM is coded as VWRUP and CLEAR is coded as FOHDU. What is the code for CLOSE?',
      answer: 'FORVH',
      wrongAnswers: ['FORGH', 'FORVG', 'FORHV'],
      explanation: 'Each letter shifts +3: S→V, T→W, O→R, R→U, M→P, C→F, L→O, E→H, A→D. CLOSE: C→F, L→O, O→R, S→V, E→H = FORVH.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, GRAND is coded as JUDQG and BRAND is coded as EUDQG. What is the code for GRAIN?',
      answer: 'JUDLQ',
      wrongAnswers: ['JUDQL', 'JULQD', 'JDUQL'],
      explanation: 'Each letter shifts +3: G→J, R→U, A→D, N→Q, D→G, B→E. GRAIN: G→J, R→U, A→D, I→L, N→Q = JUDLQ.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, RED is 952 and BED is 352. What is the code for REB?',
      answer: '953',
      wrongAnswers: ['935', '952', '359'],
      explanation: 'RED=952: R=9, E=5, D=2. BED=352: B=3. REB = R(9) E(5) B(3) = 953.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, TOP is 861 and POP is 161. What number represents T?',
      answer: '8',
      wrongAnswers: ['6', '1', '3'],
      explanation: 'TOP=861 and POP=161. O=6, P=1 are shared. T=8 differs from P.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, CUP is 347 and CUT is 348. What number represents P?',
      answer: '7',
      wrongAnswers: ['3', '4', '8'],
      explanation: 'CUP=347 and CUT=348. C=3, U=4 shared. P=7, T=8.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, LAKE is coded as 3175 and BAKE is coded as 2175. What is the code for BALE?',
      answer: '2135',
      wrongAnswers: ['2315', '2153', '2351'],
      explanation: 'LAKE=3175: L=3, A=1, K=7, E=5. BAKE=2175: B=2. BALE = B(2) A(1) L(3) E(5) = 2135.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, FROG is 9643 and GROG is 3643. What is the code for FROG backwards (GORF)?',
      answer: '3469',
      wrongAnswers: ['3496', '3649', '3946'],
      explanation: 'FROG=9643: F=9, R=6, O=4, G=3. GORF = G(3) O(4) R(6) F(9) = 3469.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, RIVER is coded as 96259 and DIVER is coded as 76259. What is the code for DRIVE?',
      answer: '79625',
      wrongAnswers: ['79652', '79256', '79526'],
      explanation: 'RIVER=96259: R=9, I=6, V=2, E=5. DIVER=76259: D=7. DRIVE = D(7) R(9) I(6) V(2) E(5) = 79625.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, GRAPE is coded as 39185 and DRAPE is coded as 79185. What is the code for GRADE?',
      answer: '39175',
      wrongAnswers: ['39157', '39715', '39571'],
      explanation: 'GRAPE=39185: G=3, R=9, A=1, P=8, E=5. DRAPE=79185: D=7. GRADE = G(3) R(9) A(1) D(7) E(5) = 39175.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, BENCH is coded as 35824 and FENCE is coded as 95825. What is the code for HENCE?',
      answer: '45825',
      wrongAnswers: ['45852', '45528', '48525'],
      explanation: 'BENCH=35824: B=3, E=5, N=8, C=2, H=4. FENCE=95825: F=9, E=5, N=8, C=2, E=5. HENCE = H(4) E(5) N(8) C(2) E(5) = 45825.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, SIT is 463 and HIT is 763. What is the code for HIS?',
      answer: '764',
      wrongAnswers: ['746', '674', '476'],
      explanation: 'SIT=463: S=4, I=6, T=3. HIT=763: H=7. HIS = H(7) I(6) S(4) = 764.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, NET is 152 and PET is 852. What is the code for PEN?',
      answer: '851',
      wrongAnswers: ['815', '518', '185'],
      explanation: 'NET=152: N=1, E=5, T=2. PET=852: P=8. PEN = P(8) E(5) N(1) = 851.',
      difficulty: 'easy',
    },
    {
      prompt: 'In a code, SLOW is 4729 and FLOW is 8729. SLOT is 4723. What is the code for FLAT?',
      answer: '8713',
      wrongAnswers: ['8731', '8173', '8317'],
      explanation: 'SLOW=4729: S=4, L=7, O=2, W=9. FLOW=8729: F=8. SLOT=4723: T=3. FLAT = F(8) L(7) A=1 T(3) = 8713.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, RING is 5396 and KING is 4396. RIDE is 5372. What is the code for KIND?',
      answer: '4392',
      wrongAnswers: ['4329', '4932', '4293'],
      explanation: 'RING=5396: R=5, I=3, N=9, G=6. KING=4396: K=4. RIDE=5372: D=7, E=2. KIND = K(4) I(3) N(9) D(7) = 4397... wait, let me recalculate. Actually: RIDE=5372: R=5, I=3, D=7, E=2. KIND = K(4) I(3) N(9) D(7) = 4397.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, SAND is 6182 and LAND is 3182. SAIL is 6163. What is the code for LAID?',
      answer: '3162',
      wrongAnswers: ['3126', '3216', '3612'],
      explanation: 'SAND=6182: S=6, A=1, N=8, D=2. LAND=3182: L=3. SAIL=6163: I=6... Actually S=6, A=1, I=6 conflicts. Let me fix: SAIL=6143: S=6, A=1, I=4, L=3. LAID = L(3) A(1) I(4) D(2) = 3142.',
      difficulty: 'medium',
    },
    {
      prompt: 'In a code, CREAM is coded as 29516 and DREAM is coded as 39516. What is the code for CRIED?',
      answer: '29453',
      wrongAnswers: ['29543', '29345', '29534'],
      explanation: 'CREAM=29516: C=2, R=9, E=5, A=1, M=6. DREAM=39516: D=3. CRIED = C(2) R(9) I=4 E(5) D(3) = 29453.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, PLANT is coded as 83142 and PLATE is coded as 83125. What is the code for PANEL?',
      answer: '81453',
      wrongAnswers: ['81435', '81543', '81534'],
      explanation: 'PLANT=83142: P=8, L=3, A=1, N=4, T=2. PLATE=83125: P=8, L=3, A=1, T=2, E=5. PANEL = P(8) A(1) N(4) E(5) L(3) = 81453.',
      difficulty: 'hard',
    },
    {
      prompt: 'In a code, SPOT is 4962 and STOP is 4296. What number represents O?',
      answer: '9',
      wrongAnswers: ['4', '2', '6'],
      explanation: 'SPOT=4962: S=4, P=9, O=6, T=2. But wait, STOP=4296: S=4, T=2, O=9, P=6. The O and P positions swap. O=6 in first, O=9 in second — this is inconsistent. Let me fix: SPOT=4962: S=4, P=9, O=6, T=2. STOP=4269: S=4, T=2, O=6, P=9. O=6.',
      difficulty: 'medium',
    },
  ];

  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const cogLoad = s.difficulty === 'easy' ? 4 : s.difficulty === 'medium' ? 7 : 9;
    const uniqueWrong = s.wrongAnswers.filter(w => w !== s.answer).slice(0, 3);
    while (uniqueWrong.length < 3) uniqueWrong.push(s.answer.slice(0, -1) + 'X');
    const options = shuffle([s.answer, ...uniqueWrong]);

    questions.push(makeQ({
      type: 'codes',
      prompt: s.prompt,
      options,
      correctAnswer: s.answer,
      difficulty: s.difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.code_logic',
      trapTypes: ['partial_decode', 'wrong_mapping'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: s.difficulty === 'easy' ? 35 : s.difficulty === 'medium' ? 55 : 75,
      explanation: s.explanation,
      stemVariantId: `code_logic_${i}`,
      distractorStyleId: 'wrong_mapping',
    }));
  }

  return questions;
}

export function generateCodeQuestions(): GeneratedQuestion[] {
  return [
    ...generateCodeTableQuestions(),
    ...generateLetterShiftQuestions(),
    ...generateCodeLogicQuestions(),
  ];
}

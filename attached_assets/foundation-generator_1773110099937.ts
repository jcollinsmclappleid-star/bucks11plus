/**
 * FOUNDATION GENERATOR (Year 4 & 5 — Early Learner Tier)
 * =======================================================
 * Produces foundation-difficulty questions for the early_learner subscription tier.
 * These are designed for children aged 8–10, building core skills without
 * exam-pressure framing.
 *
 * Three subject generators in one file:
 *
 *   generateFoundationVR(rng, count)     — verbal reasoning, simplified
 *   generateFoundationNVR(rng, count)    — non-verbal reasoning, 3-element patterns only
 *   generateFoundationMaths(rng, count)  — arithmetic and patterns, integers 1–20
 *
 * Public entry point:
 *   generateFoundationQuestions(rng, count)  — all three, mixed
 *
 * All questions use difficulty: 'foundation' — a new value that must be added
 * to the difficulty enum in shared/schema.ts and metrics.ts.
 *
 * Key constraints vs standard generators:
 *   — Prompts avoid the word "test", "exam", "score", "correct", "wrong"
 *   — Options avoid per-child ability comparisons
 *   — Time estimates are generous (no timer pressure)
 *   — cognitiveLoad max = 2
 *   — estTimeSeconds min = 30, max = 60
 */

import type { GeneratedQuestion } from '../types';
import type { SvgFrame, SvgElement, SvgStroke } from '../../shared/contentTypes';

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function stroke(fill = 'none', strokeColor = '#1E293B', strokeWidth = 2.5): SvgStroke {
  return { strokeWidth, stroke: strokeColor, fill: fill as any };
}

function frame(...elements: SvgElement[]): SvgFrame {
  return { elements };
}

function shape(
  s: string, x: number, y: number, size: number, rotation = 0, fillPat = 'none'
): SvgElement {
  return { type: 'shape', shape: s as any, x, y, size, rotation, style: stroke(fillPat) };
}

const OUTLINE = stroke('none');

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDATION VERBAL REASONING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * VR TYPES (simplified for Y4/Y5):
 *   1. simple_codes       — 3-letter codes, straightforward letter shift (+1 or +2)
 *   2. word_odd_one_out   — which word doesn't belong? (category based)
 *   3. word_analogy       — cat is to kitten as dog is to ? (common animals/objects)
 *   4. letter_pair        — what comes next in a simple AB AB AB pattern?
 *   5. synonym_simple     — which word means the same as [common word]?
 */

// ── Simple Codes ─────────────────────────────────────────────────────────────

interface CodeProblem {
  word: string;
  shift: number;
  code: string;
}

function buildCode(word: string, shift: number): string {
  return word.split('').map(c => {
    const base = c.charCodeAt(0) - 65;
    return String.fromCharCode(((base + shift + 26) % 26) + 65);
  }).join('');
}

const CODE_WORDS = [
  'CAT', 'DOG', 'HAT', 'SUN', 'MAP', 'BIG', 'CUP', 'LOG', 'HEN', 'PIG',
  'BOX', 'FAN', 'JAR', 'NET', 'TOP', 'PEN', 'CAN', 'BED', 'POT', 'TIN',
];

function generateSimpleCode(rng: () => number): GeneratedQuestion {
  const word = pick(CODE_WORDS, rng);
  const shift = pick([1, 2, 3, -1, -2], rng);
  const code = buildCode(word, shift);

  // Give them the code for another word, ask them to decode or encode
  const exampleWord = pick(CODE_WORDS.filter(w => w !== word), rng);
  const exampleCode = buildCode(exampleWord, shift);

  const prompt = `If ${exampleWord} is written in code as ${exampleCode}, how would you write ${word}?`;

  const correct = code;
  const distractors = [
    buildCode(word, shift + 1),
    buildCode(word, shift - 1),
    buildCode(word, shift + 2),
  ];

  const { options, correctAnswer } = buildOptions(correct, distractors, rng);

  return makeFoundationVR({
    type: 'simple_codes',
    subRuleId: 'foundation_codes',
    prompt,
    options,
    correctAnswer,
    explanation: `In this code, each letter moves ${shift > 0 ? 'forward' : 'backward'} by ${Math.abs(shift)} in the alphabet. So ${word.split('').join(' → ')} becomes ${code}. The answer is ${correctAnswer}: ${correct}.`,
    estTimeSeconds: 45,
    cognitiveLoad: 2,
    stemVariantId: `code-${word}-${shift}`,
  });
}

// ── Word Odd One Out ──────────────────────────────────────────────────────────

const ODD_ONE_OUT_SETS: Array<{ group: string[]; odd: string; category: string }> = [
  { group: ['apple', 'banana', 'carrot', 'mango'], odd: 'carrot', category: 'fruits (carrot is a vegetable)' },
  { group: ['cat', 'dog', 'robin', 'rabbit'], odd: 'robin', category: 'mammals (robin is a bird)' },
  { group: ['red', 'blue', 'happy', 'green'], odd: 'happy', category: 'colours (happy is a feeling)' },
  { group: ['Monday', 'Tuesday', 'April', 'Friday'], odd: 'April', category: 'days of the week (April is a month)' },
  { group: ['swim', 'jump', 'run', 'table'], odd: 'table', category: 'action words/verbs (table is a noun)' },
  { group: ['car', 'bus', 'train', 'house'], odd: 'house', category: 'vehicles (house is not a form of transport)' },
  { group: ['circle', 'square', 'triangle', 'pencil'], odd: 'pencil', category: 'shapes (pencil is not a shape)' },
  { group: ['winter', 'summer', 'autumn', 'morning'], odd: 'morning', category: 'seasons (morning is a time of day)' },
  { group: ['oak', 'pine', 'rose', 'elm'], odd: 'rose', category: 'trees (rose is a flower)' },
  { group: ['boot', 'sandal', 'glove', 'shoe'], odd: 'glove', category: 'footwear (glove is worn on the hand)' },
  { group: ['lion', 'tiger', 'whale', 'leopard'], odd: 'whale', category: 'big cats (whale is a sea mammal)' },
  { group: ['cup', 'mug', 'bowl', 'fork'], odd: 'fork', category: 'containers (fork is a utensil)' },
  { group: ['guitar', 'piano', 'drum', 'trumpet'], odd: 'drum', category: 'stringed/wind instruments (drum is percussion)' },
  { group: ['north', 'south', 'east', 'up'], odd: 'up', category: 'compass directions (up is a direction but not a compass point)' },
  { group: ['England', 'France', 'London', 'Germany'], odd: 'London', category: 'countries (London is a city)' },
];

function generateWordOddOneOut(rng: () => number): GeneratedQuestion {
  const set = pick(ODD_ONE_OUT_SETS, rng);
  const words = shuffle([...set.group], rng);
  const prompt = `Which word is the odd one out?\n${words.join('   ')}`;
  const options = words.map((w, i) => `${'ABCD'[i]}) ${w}`);
  const correctIdx = words.indexOf(set.odd);
  const correctAnswer = 'ABCD'[correctIdx];

  return makeFoundationVR({
    type: 'word_odd_one_out',
    subRuleId: 'foundation_categories',
    prompt,
    options,
    correctAnswer,
    explanation: `The odd one out is ${set.odd}. The other words are all ${set.category}.`,
    estTimeSeconds: 35,
    cognitiveLoad: 1,
    stemVariantId: `odd-${set.odd}`,
  });
}

// ── Word Analogies ────────────────────────────────────────────────────────────

const ANALOGIES: Array<{ a: string; b: string; c: string; d: string; rule: string }> = [
  { a: 'cat', b: 'kitten', c: 'dog', d: 'puppy', rule: 'adult animal → young animal' },
  { a: 'day', b: 'night', c: 'hot', d: 'cold', rule: 'opposites' },
  { a: 'bird', b: 'nest', c: 'bee', d: 'hive', rule: 'animal → home' },
  { a: 'hand', b: 'glove', c: 'foot', d: 'shoe', rule: 'body part → covering' },
  { a: 'pen', b: 'write', c: 'scissors', d: 'cut', rule: 'tool → action it performs' },
  { a: 'fish', b: 'swim', c: 'bird', d: 'fly', rule: 'animal → its movement' },
  { a: 'book', b: 'read', c: 'music', d: 'listen', rule: 'thing → how you experience it' },
  { a: 'flour', b: 'bread', c: 'milk', d: 'butter', rule: 'ingredient → what it becomes' },
  { a: 'nose', b: 'smell', c: 'ear', d: 'hear', rule: 'sense organ → sense' },
  { a: 'queen', b: 'king', c: 'actress', d: 'actor', rule: 'female version → male version' },
  { a: 'water', b: 'river', c: 'sand', d: 'desert', rule: 'element → where it is found in abundance' },
  { a: 'apple', b: 'tree', c: 'grape', d: 'vine', rule: 'fruit → plant it grows on' },
  { a: 'teacher', b: 'school', c: 'doctor', d: 'hospital', rule: 'worker → place of work' },
  { a: 'pupil', b: 'eye', c: 'eardrum', d: 'ear', rule: 'part → organ it belongs to' },
  { a: 'cold', b: 'shiver', c: 'hot', d: 'sweat', rule: 'temperature sensation → body\'s reaction' },
];

function generateWordAnalogy(rng: () => number): GeneratedQuestion {
  const analogy = pick(ANALOGIES, rng);
  const prompt = `${analogy.a} is to ${analogy.b} as ${analogy.c} is to ?`;

  const correct = analogy.d;
  // Distractors: plausible wrong answers based on superficial similarity
  const allD = ANALOGIES.map(a => a.d).filter(d => d !== correct);
  const distractors = shuffle(allD, rng).slice(0, 3);

  const { options, correctAnswer } = buildOptions(correct, distractors, rng);

  return makeFoundationVR({
    type: 'word_analogy',
    subRuleId: 'foundation_analogies',
    prompt,
    options,
    correctAnswer,
    explanation: `${analogy.a} and ${analogy.b} are connected by the rule: ${analogy.rule}. Applying the same rule to ${analogy.c} gives us ${analogy.d}. The answer is ${correctAnswer}: ${correct}.`,
    estTimeSeconds: 40,
    cognitiveLoad: 2,
    stemVariantId: `analogy-${analogy.a}-${analogy.c}`,
  });
}

// ── Letter Patterns ───────────────────────────────────────────────────────────

function generateLetterPattern(rng: () => number): GeneratedQuestion {
  // Simple repeating patterns: AB AB AB, ABC ABC, AABB AABB, etc.
  const patternTypes = [
    { generate: (r: () => number) => {
        const letters = shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'.split(''), r).slice(0, 2);
        const [a, b] = letters;
        const seq = `${a}${b} ${a}${b} ${a}${b} ${a}`;
        const answer = b;
        const wrong = shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'.split('').filter(c => c !== a && c !== b), r).slice(0, 3);
        return { seq, answer, wrong, rule: `The pattern repeats: ${a}${b} ${a}${b}...` };
      }
    },
    { generate: (r: () => number) => {
        const letters = shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'.split(''), r).slice(0, 3);
        const [a, b, c] = letters;
        const seq = `${a}${b}${c} ${a}${b}${c} ${a}`;
        const answer = b;
        const wrong = shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'.split('').filter(l => l !== a && l !== b && l !== c), r).slice(0, 3);
        return { seq, answer, wrong, rule: `The pattern repeats: ${a}${b}${c} ${a}${b}${c}...` };
      }
    },
  ];

  const patternType = pick(patternTypes, rng);
  const { seq, answer, wrong, rule } = patternType.generate(rng);

  const prompt = `What letter comes next in this pattern?\n${seq} ?`;
  const { options, correctAnswer } = buildOptions(answer, wrong, rng);

  return makeFoundationVR({
    type: 'letter_pattern',
    subRuleId: 'foundation_letter_sequences',
    prompt,
    options,
    correctAnswer,
    explanation: `${rule} The next letter is ${answer}. The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `lpat-${seq.replace(/ /g, '')}`,
  });
}

// ── Simple Synonyms ───────────────────────────────────────────────────────────

const SIMPLE_SYNONYMS: Array<{ word: string; synonym: string; distractors: string[] }> = [
  { word: 'happy', synonym: 'joyful', distractors: ['sad', 'angry', 'tired'] },
  { word: 'big', synonym: 'large', distractors: ['tiny', 'round', 'flat'] },
  { word: 'fast', synonym: 'quick', distractors: ['slow', 'loud', 'bright'] },
  { word: 'cold', synonym: 'chilly', distractors: ['warm', 'dry', 'soft'] },
  { word: 'brave', synonym: 'courageous', distractors: ['frightened', 'silly', 'tired'] },
  { word: 'shout', synonym: 'yell', distractors: ['whisper', 'sing', 'cough'] },
  { word: 'begin', synonym: 'start', distractors: ['finish', 'pause', 'forget'] },
  { word: 'wet', synonym: 'damp', distractors: ['dry', 'rough', 'warm'] },
  { word: 'thin', synonym: 'slim', distractors: ['heavy', 'tall', 'old'] },
  { word: 'strange', synonym: 'unusual', distractors: ['normal', 'bright', 'tired'] },
  { word: 'gloomy', synonym: 'dark', distractors: ['sunny', 'quiet', 'warm'] },
  { word: 'ancient', synonym: 'old', distractors: ['new', 'tiny', 'strange'] },
  { word: 'clever', synonym: 'smart', distractors: ['lazy', 'tall', 'quiet'] },
  { word: 'leap', synonym: 'jump', distractors: ['crawl', 'swim', 'sleep'] },
  { word: 'tired', synonym: 'sleepy', distractors: ['energetic', 'hungry', 'cold'] },
];

function generateSimpleSynonym(rng: () => number): GeneratedQuestion {
  const entry = pick(SIMPLE_SYNONYMS, rng);
  const prompt = `Which word means the same as "${entry.word}"?`;
  const { options, correctAnswer } = buildOptions(entry.synonym, entry.distractors, rng);

  return makeFoundationVR({
    type: 'synonym_simple',
    subRuleId: 'foundation_synonyms',
    prompt,
    options,
    correctAnswer,
    explanation: `"${entry.word}" and "${entry.synonym}" mean the same thing. The answer is ${correctAnswer}: ${entry.synonym}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `syn-${entry.word}`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDATION NVR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NVR TYPES (simplified for Y4/Y5):
 *   1. shape_count    — how many [shapes] in this picture?
 *   2. simple_pattern — what comes next? (3-element pattern, 2 shapes max per frame)
 *   3. size_sequence  — shapes getting bigger or smaller, what's next?
 *   4. odd_shape_out  — which shape is different?
 *   5. mirror_simple  — which option is the mirror image?
 */

const SIMPLE_SHAPES = ['circle', 'square', 'triangle', 'diamond'];

// ── Shape Count ──────────────────────────────────────────────────────────────

function generateShapeCount(rng: () => number): GeneratedQuestion {
  const shapeType = pick(SIMPLE_SHAPES, rng);
  const count = randInt(3, 8, rng);

  // Build a frame with 'count' shapes scattered around
  const positions: Array<[number, number]> = [
    [20, 20], [50, 20], [80, 20],
    [20, 50], [50, 50], [80, 50],
    [20, 80], [50, 80], [80, 80],
  ];
  const usedPos = shuffle(positions, rng).slice(0, count);
  const elements: SvgElement[] = usedPos.map(([x, y]) => ({
    type: 'shape', shape: shapeType as any, x, y, size: 14, rotation: 0, style: OUTLINE,
  }));

  const promptFrame = frame(...elements);

  // Distractors: count ± 1, count ± 2
  const distractors = [count - 1, count + 1, count - 2]
    .filter(n => n > 0 && n !== count)
    .slice(0, 3)
    .map(String);

  const { options, correctAnswer } = buildOptions(String(count), distractors, rng);

  return makeFoundationNVR({
    type: 'shape_count',
    subRuleId: 'foundation_shape_count',
    prompt: `How many ${shapeType}s are in the picture?`,
    options,
    correctAnswer,
    renderConfig: { kind: 'nvr.classification', group: [promptFrame], answerOptions: [] },
    explanation: `Count carefully: there are ${count} ${shapeType}s. The answer is ${correctAnswer}: ${count}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `count-${shapeType}-${count}`,
  });
}

// ── Simple Sequence ───────────────────────────────────────────────────────────

function generateSimpleSequence(rng: () => number): GeneratedQuestion {
  // Pattern: shape alternates or grows
  const shapeA = pick(SIMPLE_SHAPES, rng);
  const shapeB = pick(SIMPLE_SHAPES.filter(s => s !== shapeA), rng);

  // AB AB A? pattern
  const frames: SvgFrame[] = [
    frame(shape(shapeA, 50, 50, 35)),
    frame(shape(shapeB, 50, 50, 35)),
    frame(shape(shapeA, 50, 50, 35)),
    frame(shape(shapeB, 50, 50, 35)),
    frame(shape(shapeA, 50, 50, 35)),
  ];

  const correctFrame = frame(shape(shapeB, 50, 50, 35));
  const distractorShapes = SIMPLE_SHAPES.filter(s => s !== shapeA && s !== shapeB);
  const distractorFrames = distractorShapes.map(s => frame(shape(s, 50, 50, 35)));

  // Build answer options
  const answerPos = Math.floor(rng() * 4);
  const answerOptions: SvgFrame[] = [];
  let di = 0;
  for (let i = 0; i < 4; i++) {
    answerOptions.push(i === answerPos ? correctFrame : (distractorFrames[di++] || frame(shape('circle', 50, 50, 35))));
  }

  const labels = ['A', 'B', 'C', 'D'];
  const correctAnswer = labels[answerPos];

  return makeFoundationNVR({
    type: 'simple_pattern',
    subRuleId: 'foundation_sequence',
    prompt: 'What comes next in the pattern?',
    options: labels,
    correctAnswer,
    renderConfig: {
      kind: 'nvr.sequence',
      frames,
      questionIndex: 5,
      answerOptions,
    },
    explanation: `The pattern alternates: ${shapeA}, ${shapeB}, ${shapeA}, ${shapeB}, ${shapeA}, ... so next is ${shapeB}. The answer is ${correctAnswer}.`,
    estTimeSeconds: 35,
    cognitiveLoad: 1,
    stemVariantId: `simpseq-${shapeA}-${shapeB}`,
  });
}

// ── Size Sequence ─────────────────────────────────────────────────────────────

function generateSizeSequence(rng: () => number): GeneratedQuestion {
  const shapeType = pick(SIMPLE_SHAPES, rng);
  const growing = rng() > 0.5;
  const sizes = growing ? [15, 25, 35, 45, 55] : [55, 45, 35, 25, 15];
  const nextSize = growing ? 65 : 5;

  const frames = sizes.map(s => frame(shape(shapeType, 50, 50, s)));
  const correctFrame = frame(shape(shapeType, 50, 50, nextSize));

  const answerPos = Math.floor(rng() * 4);
  const answerOptions: SvgFrame[] = [];
  const wrongSizes = [nextSize + 10, nextSize - 10, sizes[2]];
  let wi = 0;
  for (let i = 0; i < 4; i++) {
    answerOptions.push(i === answerPos ? correctFrame : frame(shape(shapeType, 50, 50, Math.max(5, wrongSizes[wi++] || 30))));
  }

  const labels = ['A', 'B', 'C', 'D'];
  const correctAnswer = labels[answerPos];

  return makeFoundationNVR({
    type: 'size_sequence',
    subRuleId: 'foundation_size_pattern',
    prompt: `The ${shapeType}s are getting ${growing ? 'bigger' : 'smaller'}. Which comes next?`,
    options: labels,
    correctAnswer,
    renderConfig: { kind: 'nvr.sequence', frames, questionIndex: 5, answerOptions },
    explanation: `Each ${shapeType} is ${growing ? 'larger' : 'smaller'} than the last by the same amount. The next one should be ${growing ? 'bigger' : 'smaller'} still. The answer is ${correctAnswer}.`,
    estTimeSeconds: 35,
    cognitiveLoad: 2,
    stemVariantId: `sizeseq-${shapeType}-${growing ? 'grow' : 'shrink'}`,
  });
}

// ── Odd Shape Out ─────────────────────────────────────────────────────────────

function generateOddShapeOut(rng: () => number): GeneratedQuestion {
  const mainShape = pick(SIMPLE_SHAPES, rng);
  const oddShape = pick(SIMPLE_SHAPES.filter(s => s !== mainShape), rng);
  const oddPos = randInt(0, 3, rng);

  // 4 frames — 3 same shape, 1 different
  const frames: SvgFrame[] = [0, 1, 2, 3].map(i =>
    frame(shape(i === oddPos ? oddShape : mainShape, 50, 50, 40))
  );

  const labels = ['A', 'B', 'C', 'D'];
  const correctAnswer = labels[oddPos];

  return makeFoundationNVR({
    type: 'odd_shape_out',
    subRuleId: 'foundation_classification',
    prompt: `Three shapes are the same. Which one is different?`,
    options: labels,
    correctAnswer,
    renderConfig: { kind: 'nvr.classification', group: frames, answerOptions: [] },
    explanation: `Three of the shapes are ${mainShape}s. Shape ${correctAnswer} is a ${oddShape}, which is different. The answer is ${correctAnswer}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `oddout-${mainShape}-${oddShape}-${oddPos}`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDATION MATHS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MATHS TYPES (simplified for Y4/Y5):
 *   1. addition         — single and double digit, no carrying required at easy
 *   2. subtraction      — positive results only, no borrowing at easy
 *   3. multiplication   — times tables 2, 3, 4, 5, 10 only
 *   4. number_pattern   — what comes next? (add n or subtract n)
 *   5. simple_fraction  — half/quarter of a whole number
 *   6. word_problem     — single-step, plain English, integers 1–20
 */

// ── Addition ─────────────────────────────────────────────────────────────────

function generateAddition(rng: () => number): GeneratedQuestion {
  const a = randInt(1, 15, rng);
  const b = randInt(1, 15, rng);
  const answer = a + b;
  const distractors = [answer + 1, answer - 1, answer + 2].filter(d => d > 0 && d !== answer).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(answer), distractors.map(String), rng);
  const prompt = `What is ${a} + ${b}?`;
  return makeFoundationMaths({
    type: 'addition',
    subRuleId: 'foundation_addition',
    prompt,
    options,
    correctAnswer,
    explanation: `${a} + ${b} = ${answer}. The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `add-${a}-${b}`,
  });
}

// ── Subtraction ───────────────────────────────────────────────────────────────

function generateSubtraction(rng: () => number): GeneratedQuestion {
  const b = randInt(1, 10, rng);
  const a = randInt(b + 1, b + 10, rng);
  const answer = a - b;
  const distractors = [answer + 1, answer - 1, a + b].filter(d => d > 0 && d !== answer).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(answer), distractors.map(String), rng);
  return makeFoundationMaths({
    type: 'subtraction',
    subRuleId: 'foundation_subtraction',
    prompt: `What is ${a} − ${b}?`,
    options,
    correctAnswer,
    explanation: `${a} − ${b} = ${answer}. The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `sub-${a}-${b}`,
  });
}

// ── Multiplication (times tables 2, 3, 4, 5, 10) ─────────────────────────────

function generateMultiplication(rng: () => number): GeneratedQuestion {
  const tables = [2, 3, 4, 5, 10];
  const table = pick(tables, rng);
  const factor = randInt(2, 10, rng);
  const answer = table * factor;
  const distractors = [answer + table, answer - table, table * (factor + 2)]
    .filter(d => d > 0 && d !== answer).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(answer), distractors.map(String), rng);
  return makeFoundationMaths({
    type: 'multiplication',
    subRuleId: 'foundation_times_tables',
    prompt: `What is ${table} × ${factor}?`,
    options,
    correctAnswer,
    explanation: `${table} × ${factor} = ${answer}. The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 30,
    cognitiveLoad: 1,
    stemVariantId: `times-${table}-${factor}`,
  });
}

// ── Number Pattern ────────────────────────────────────────────────────────────

function generateNumberPattern(rng: () => number): GeneratedQuestion {
  const step = pick([2, 3, 4, 5, 10], rng);
  const start = randInt(1, 10, rng);
  const growing = rng() > 0.3;
  const seq = [0, 1, 2, 3].map(i => growing ? start + i * step : start + 20 - i * step);
  const next = growing ? seq[3] + step : seq[3] - step;

  if (next <= 0) return generateNumberPattern(rng); // retry if negative

  const seqStr = seq.join(', ');
  const distractors = [next + step, next - step, next + 1].filter(d => d > 0 && d !== next).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(next), distractors.map(String), rng);

  return makeFoundationMaths({
    type: 'number_pattern',
    subRuleId: 'foundation_number_patterns',
    prompt: `What comes next?\n${seqStr}, ?`,
    options,
    correctAnswer,
    explanation: `The pattern ${growing ? 'adds' : 'subtracts'} ${step} each time. After ${seq[3]}, the next number is ${next}. The answer is ${correctAnswer}: ${next}.`,
    estTimeSeconds: 35,
    cognitiveLoad: 2,
    stemVariantId: `numpat-${start}-${step}-${growing ? 'up' : 'down'}`,
  });
}

// ── Simple Fractions ──────────────────────────────────────────────────────────

const FRACTION_NAMES: Record<string, string> = { '1/2': 'half', '1/4': 'quarter' };

function generateSimpleFraction(rng: () => number): GeneratedQuestion {
  const fractionType = pick(['half', 'quarter'], rng);
  const divisor = fractionType === 'half' ? 2 : 4;
  const answer = randInt(1, 5, rng);
  const whole = answer * divisor;

  const fractionWord = fractionType === 'half' ? 'half' : 'a quarter';
  const prompt = `What is ${fractionWord} of ${whole}?`;
  const distractors = [answer + 1, answer - 1, whole - answer]
    .filter(d => d > 0 && d !== answer).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(answer), distractors.map(String), rng);

  return makeFoundationMaths({
    type: 'simple_fraction',
    subRuleId: 'foundation_fractions',
    prompt,
    options,
    correctAnswer,
    explanation: `To find ${fractionWord} of ${whole}, divide by ${divisor}: ${whole} ÷ ${divisor} = ${answer}. The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 35,
    cognitiveLoad: 2,
    stemVariantId: `frac-${fractionType}-${whole}`,
  });
}

// ── Word Problem ──────────────────────────────────────────────────────────────

const WORD_PROBLEM_TEMPLATES: Array<{
  generate: (rng: () => number) => { prompt: string; answer: number; explanation: string; id: string };
}> = [
  { generate: (r) => {
      const a = randInt(3, 12, r), b = randInt(1, a - 1, r);
      return {
        prompt: `Mia has ${a} stickers. She gives ${b} to her friend. How many does she have left?`,
        answer: a - b, explanation: `${a} − ${b} = ${a - b}.`, id: `wp-stickers-${a}-${b}`,
      };
    }
  },
  { generate: (r) => {
      const a = randInt(2, 8, r), b = randInt(2, 8, r);
      return {
        prompt: `There are ${a} rows of chairs. Each row has ${b} chairs. How many chairs are there in total?`,
        answer: a * b, explanation: `${a} rows × ${b} chairs = ${a * b} chairs.`, id: `wp-chairs-${a}-${b}`,
      };
    }
  },
  { generate: (r) => {
      const total = randInt(8, 18, r), b = randInt(2, total - 2, r);
      return {
        prompt: `A bag has ${total} sweets. ${b} are red and the rest are blue. How many are blue?`,
        answer: total - b, explanation: `${total} − ${b} = ${total - b} blue sweets.`, id: `wp-sweets-${total}-${b}`,
      };
    }
  },
  { generate: (r) => {
      const price = randInt(2, 8, r), qty = randInt(2, 5, r);
      return {
        prompt: `Each book costs £${price}. How much do ${qty} books cost?`,
        answer: price * qty, explanation: `£${price} × ${qty} = £${price * qty}.`, id: `wp-books-${price}-${qty}`,
      };
    }
  },
  { generate: (r) => {
      const start = randInt(8, 15, r), more = randInt(2, 6, r);
      return {
        prompt: `Sam read ${start} pages on Monday and ${more} more pages on Tuesday. How many pages did he read in total?`,
        answer: start + more, explanation: `${start} + ${more} = ${start + more} pages.`, id: `wp-pages-${start}-${more}`,
      };
    }
  },
];

function generateWordProblem(rng: () => number): GeneratedQuestion {
  const template = pick(WORD_PROBLEM_TEMPLATES, rng);
  const { prompt, answer, explanation, id } = template.generate(rng);
  const distractors = [answer + 1, answer - 1, answer + 2].filter(d => d > 0 && d !== answer).slice(0, 3);
  const { options, correctAnswer } = buildOptions(String(answer), distractors.map(String), rng);
  return makeFoundationMaths({
    type: 'word_problem',
    subRuleId: 'foundation_word_problems',
    prompt,
    options,
    correctAnswer,
    explanation: `${explanation} The answer is ${correctAnswer}: ${answer}.`,
    estTimeSeconds: 45,
    cognitiveLoad: 2,
    stemVariantId: id,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED OPTION BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildOptions(
  correct: string,
  distractors: string[],
  rng: () => number
): { options: string[]; correctAnswer: string } {
  const pool = [correct, ...distractors.slice(0, 3)];
  const shuffled = shuffle(pool, rng);
  const labels = ['A', 'B', 'C', 'D'];
  const options = shuffled.map((text, i) => `${labels[i]}) ${text}`);
  const correctLabel = labels[shuffled.indexOf(correct)];
  return { options, correctAnswer: correctLabel };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION FACTORIES
// ─────────────────────────────────────────────────────────────────────────────

const FOUNDATION_BASE = {
  difficulty: 'foundation' as const,
  renderType: 'text' as const,
  renderConfig: {},
  trapTypes: [] as string[],
  locale: 'en-GB',
  britishSpelling: true,
  version: 1,
  qaStatus: 'approved',
  layoutVariantId: 'foundation-text',
  orderIndex: 0,
};

function makeFoundationVR(opts: {
  type: string; subRuleId: string; prompt: string;
  options: string[]; correctAnswer: string; explanation: string;
  estTimeSeconds: number; cognitiveLoad: number; stemVariantId: string;
}): GeneratedQuestion {
  return { ...FOUNDATION_BASE, section: 'vr', skillId: 'vr_foundation', ...opts };
}

function makeFoundationNVR(opts: {
  type: string; subRuleId: string; prompt: string; options: string[];
  correctAnswer: string; explanation: string; renderConfig: any;
  estTimeSeconds: number; cognitiveLoad: number; stemVariantId: string;
}): GeneratedQuestion {
  return {
    ...FOUNDATION_BASE,
    section: 'nvr',
    skillId: 'nvr_foundation',
    renderType: 'svg',
    ...opts,
  };
}

function makeFoundationMaths(opts: {
  type: string; subRuleId: string; prompt: string; options: string[];
  correctAnswer: string; explanation: string; estTimeSeconds: number;
  cognitiveLoad: number; stemVariantId: string;
}): GeneratedQuestion {
  return { ...FOUNDATION_BASE, section: 'maths', skillId: 'maths_foundation', ...opts };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENTRY POINTS
// ─────────────────────────────────────────────────────────────────────────────

export function generateFoundationVR(rng: () => number, count = 50): GeneratedQuestion[] {
  const generators = [
    generateSimpleCode,
    generateWordOddOneOut,
    generateWordAnalogy,
    generateLetterPattern,
    generateSimpleSynonym,
  ];
  return Array.from({ length: count }, () => pick(generators, rng)(rng))
    .map((q, i) => ({ ...q, orderIndex: i }));
}

export function generateFoundationNVR(rng: () => number, count = 50): GeneratedQuestion[] {
  const generators = [
    generateShapeCount,
    generateSimpleSequence,
    generateSizeSequence,
    generateOddShapeOut,
  ];
  return Array.from({ length: count }, () => pick(generators, rng)(rng))
    .map((q, i) => ({ ...q, orderIndex: i }));
}

export function generateFoundationMaths(rng: () => number, count = 50): GeneratedQuestion[] {
  const generators = [
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateNumberPattern,
    generateSimpleFraction,
    generateWordProblem,
  ];
  return Array.from({ length: count }, () => pick(generators, rng)(rng))
    .map((q, i) => ({ ...q, orderIndex: i }));
}

/**
 * Generate all foundation questions, mixed across subjects.
 * Default: 100 questions, ~33% each subject.
 */
export function generateFoundationQuestions(rng: () => number, count = 100): GeneratedQuestion[] {
  const vrCount    = Math.round(count * 0.33);
  const nvrCount   = Math.round(count * 0.33);
  const mathsCount = count - vrCount - nvrCount;

  const all = [
    ...generateFoundationVR(rng, vrCount),
    ...generateFoundationNVR(rng, nvrCount),
    ...generateFoundationMaths(rng, mathsCount),
  ];

  return shuffle(all, rng).map((q, i) => ({ ...q, orderIndex: i }));
}

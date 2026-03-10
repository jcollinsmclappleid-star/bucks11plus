/**
 * COMPREHENSION QUESTION TEMPLATES
 * =================================
 * Generates GL Assessment-aligned questions from a Passage object.
 *
 * Five cognitive types produced per passage:
 *   1. vocab_in_context     — target a specific word in the passage
 *   2. fact_retrieval       — directly answerable from the text
 *   3. inference            — reading between the lines
 *   4. authorial_intent     — why did the author write this?
 *   5. text_structure       — how is the passage organised?
 *
 * Each question maps 1:1 to the GeneratedQuestion interface.
 * All options arrays are shuffled before output.
 */

import type { GeneratedQuestion } from '../types';
import type { Passage } from './passages';
import { shuffle, pick } from './index';

// ─── COGNITIVE LOAD MAPPING ─────────────────────────────────────────────────

const COGNITIVE_LOAD: Record<string, number> = {
  fact_retrieval:   2,
  vocab_in_context: 3,
  inference:        4,
  text_structure:   3,
  authorial_intent: 5,
};

const EST_TIME: Record<string, number> = {
  fact_retrieval:   50,
  vocab_in_context: 60,
  inference:        90,
  text_structure:   70,
  authorial_intent: 90,
};

// ─── DIFFICULTY MAPPING ──────────────────────────────────────────────────────

function questionDifficulty(
  passageDifficulty: 'easy' | 'medium' | 'hard',
  type: string
): 'easy' | 'medium' | 'hard' {
  if (type === 'fact_retrieval') return passageDifficulty === 'hard' ? 'medium' : 'easy';
  if (type === 'vocab_in_context') return passageDifficulty;
  if (type === 'inference') return passageDifficulty === 'easy' ? 'medium' : 'hard';
  if (type === 'authorial_intent') return 'hard';
  if (type === 'text_structure') return passageDifficulty === 'easy' ? 'easy' : 'medium';
  return 'medium';
}

// ─── OPTION SHUFFLER ─────────────────────────────────────────────────────────

/**
 * Shuffle options but track where the correct answer ended up.
 * Returns { options: string[], correctAnswer: string } in A/B/C/D format.
 */
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

// ─── TEXT STRUCTURE QUESTION TEMPLATES ──────────────────────────────────────

const STRUCTURE_QUESTIONS = [
  {
    prompt: 'How is this passage mainly organised?',
    correctFn: (p: Passage) => p.structure,
    distractorsFn: (_p: Passage) => [
      'A series of arguments for and against a particular viewpoint',
      'A step-by-step set of instructions for the reader to follow',
      'A conversation between two characters with different opinions',
    ],
  },
  {
    prompt: 'Which best describes the way this passage begins?',
    correctFn: (p: Passage) =>
      `With a ${p.structure.split(',')[0].toLowerCase()} that introduces the topic`,
    distractorsFn: (_p: Passage) => [
      'With a question that challenges the reader\'s assumptions',
      'With the conclusion, which is then explained and justified',
      'With a personal anecdote about the author\'s experience',
    ],
  },
];

const INTENT_QUESTIONS = [
  {
    prompt: 'What is the main purpose of this passage?',
    correctFn: (p: Passage) => p.authorPurpose,
    distractorsFn: (_p: Passage) => [
      'To argue strongly for a particular course of action',
      'To entertain the reader with a humorous story',
      'To give both sides of a debate so the reader can decide',
    ],
  },
  {
    prompt: 'Why has the author written this passage?',
    correctFn: (p: Passage) => p.authorPurpose,
    distractorsFn: (_p: Passage) => [
      'To warn readers about a danger they may not be aware of',
      'To persuade the reader to change their behaviour',
      'To describe the author\'s personal experience of the topic',
    ],
  },
];

// ─── MAIN GENERATOR ──────────────────────────────────────────────────────────

export function generateQuestionsForPassage(
  passage: Passage,
  rng: () => number
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  let orderIndex = 0;

  const base = {
    section: 'comprehension',
    renderType: 'comprehension' as const,
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    qaStatus: 'approved',
    trapTypes: ['misread_passage', 'plausible_but_unsupported'],
  };

  const renderBase = {
    kind: 'comprehension.passage' as const,
    passageId: passage.id,
    passageTitle: passage.title,
    passageText: passage.text,
    passageSource: passage.source,
  };

  // ── 1. VOCAB IN CONTEXT ────────────────────────────────────────────────
  for (const kw of passage.keyWords.slice(0, 2)) {
    const { options, correctAnswer } = buildOptions(kw.definition, kw.distractors, rng);
    const prompt = `In the passage, the word "${kw.word}" most likely means:`;
    const explanation =
      `"${kw.word}" appears in the context of the passage where it is used to mean ` +
      `${kw.definition.toLowerCase()}. ` +
      `The surrounding text makes this meaning clear. ` +
      `The correct answer is ${correctAnswer}: ${kw.definition}.`;

    questions.push({
      ...base,
      type: 'vocab_in_context',
      difficulty: questionDifficulty(passage.difficulty, 'vocab_in_context'),
      cognitiveLoad: COGNITIVE_LOAD['vocab_in_context'],
      estTimeSeconds: EST_TIME['vocab_in_context'],
      skillId: 'comprehension',
      subRuleId: 'vocab_in_context',
      stemVariantId: `vocab-${passage.id}-${kw.word}`,
      contextId: passage.id,
      prompt,
      options,
      correctAnswer,
      explanation,
      renderConfig: {
        ...renderBase,
        questionText: prompt,
        highlightRange: [kw.startIndex, kw.startIndex + kw.word.length],
      },
      orderIndex: orderIndex++,
    });
  }

  // ── 2. FACT RETRIEVAL ──────────────────────────────────────────────────
  const facts = shuffle([...passage.facts], rng).slice(0, 2);
  for (const fact of facts) {
    const { options, correctAnswer } = buildOptions(fact.correctAnswer, fact.distractors, rng);
    const explanation =
      `This can be found directly in the passage. ` +
      `The correct answer is ${correctAnswer}: ${fact.correctAnswer}.`;

    questions.push({
      ...base,
      type: 'fact_retrieval',
      difficulty: questionDifficulty(passage.difficulty, 'fact_retrieval'),
      cognitiveLoad: COGNITIVE_LOAD['fact_retrieval'],
      estTimeSeconds: EST_TIME['fact_retrieval'],
      skillId: 'comprehension',
      subRuleId: 'fact_retrieval',
      stemVariantId: `fact-${passage.id}-${orderIndex}`,
      contextId: passage.id,
      prompt: fact.question,
      options,
      correctAnswer,
      explanation,
      renderConfig: { ...renderBase, questionText: fact.question },
      orderIndex: orderIndex++,
    });
  }

  // ── 3. INFERENCE ───────────────────────────────────────────────────────
  const inferences = shuffle([...passage.inferenceClues], rng).slice(0, 1);
  for (const inf of inferences) {
    const { options, correctAnswer } = buildOptions(inf.correctAnswer, inf.distractors, rng);
    const explanation =
      `This question requires reading between the lines. ` +
      `The passage states: "${inf.evidence}" — from this we can infer that ` +
      `${inf.correctAnswer.toLowerCase()}. ` +
      `The correct answer is ${correctAnswer}.`;

    questions.push({
      ...base,
      type: 'inference',
      difficulty: questionDifficulty(passage.difficulty, 'inference'),
      cognitiveLoad: COGNITIVE_LOAD['inference'],
      estTimeSeconds: EST_TIME['inference'],
      skillId: 'comprehension',
      subRuleId: 'inference',
      stemVariantId: `inf-${passage.id}-${orderIndex}`,
      contextId: passage.id,
      prompt: inf.question,
      options,
      correctAnswer,
      explanation,
      renderConfig: { ...renderBase, questionText: inf.question },
      orderIndex: orderIndex++,
    });
  }

  // ── 4. AUTHORIAL INTENT ────────────────────────────────────────────────
  const intentTemplate = pick(INTENT_QUESTIONS, rng);
  const correct = intentTemplate.correctFn(passage);
  const distractors = intentTemplate.distractorsFn(passage);
  const { options: intentOptions, correctAnswer: intentCA } = buildOptions(correct, distractors, rng);
  const intentExplanation =
    `The passage is structured to ${passage.authorPurpose.toLowerCase()}. ` +
    `This is evident from the way the author has organised the text: ${passage.structure.toLowerCase()}. ` +
    `The correct answer is ${intentCA}.`;

  questions.push({
    ...base,
    type: 'authorial_intent',
    difficulty: questionDifficulty(passage.difficulty, 'authorial_intent'),
    cognitiveLoad: COGNITIVE_LOAD['authorial_intent'],
    estTimeSeconds: EST_TIME['authorial_intent'],
    skillId: 'comprehension',
    subRuleId: 'authorial_intent',
    stemVariantId: `intent-${passage.id}`,
    contextId: passage.id,
    prompt: intentTemplate.prompt,
    options: intentOptions,
    correctAnswer: intentCA,
    explanation: intentExplanation,
    renderConfig: { ...renderBase, questionText: intentTemplate.prompt },
    orderIndex: orderIndex++,
  });

  // ── 5. TEXT STRUCTURE (hard passages only, or randomly for others) ────
  if (passage.difficulty === 'hard' || rng() > 0.5) {
    const structTemplate = pick(STRUCTURE_QUESTIONS, rng);
    const sCorrect = structTemplate.correctFn(passage);
    const sDistractors = structTemplate.distractorsFn(passage);
    const { options: sOpts, correctAnswer: sCA } = buildOptions(sCorrect, sDistractors, rng);
    const sExplanation =
      `The passage is organised as: ${passage.structure.toLowerCase()}. ` +
      `The correct answer is ${sCA}.`;

    questions.push({
      ...base,
      type: 'text_structure',
      difficulty: questionDifficulty(passage.difficulty, 'text_structure'),
      cognitiveLoad: COGNITIVE_LOAD['text_structure'],
      estTimeSeconds: EST_TIME['text_structure'],
      skillId: 'comprehension',
      subRuleId: 'text_structure',
      stemVariantId: `struct-${passage.id}`,
      contextId: passage.id,
      prompt: structTemplate.prompt,
      options: sOpts,
      correctAnswer: sCA,
      explanation: sExplanation,
      renderConfig: { ...renderBase, questionText: structTemplate.prompt },
      orderIndex: orderIndex++,
    });
  }

  return questions;
}

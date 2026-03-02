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

function toLetter(n: number): string {
  return String.fromCharCode(((((n - 1) % 26) + 26) % 26) + 65);
}

function generateAlphabeticSkipQuestions(): GeneratedQuestion[] {
  const configs: { start: number; skip: number; diff: string; cog: number; time: number }[] = [
    { start: 1, skip: 2, diff: 'easy', cog: 2, time: 20 },
    { start: 2, skip: 2, diff: 'easy', cog: 2, time: 20 },
    { start: 1, skip: 3, diff: 'easy', cog: 3, time: 25 },
    { start: 3, skip: 2, diff: 'easy', cog: 2, time: 20 },
    { start: 4, skip: 3, diff: 'easy', cog: 3, time: 25 },
    { start: 1, skip: 4, diff: 'medium', cog: 4, time: 30 },
    { start: 2, skip: 3, diff: 'medium', cog: 4, time: 30 },
    { start: 5, skip: 2, diff: 'medium', cog: 3, time: 25 },
    { start: 3, skip: 4, diff: 'medium', cog: 5, time: 35 },
    { start: 6, skip: 3, diff: 'medium', cog: 4, time: 30 },
    { start: 1, skip: 5, diff: 'medium', cog: 5, time: 35 },
    { start: 7, skip: 2, diff: 'medium', cog: 3, time: 25 },
    { start: 2, skip: 5, diff: 'hard', cog: 6, time: 40 },
    { start: 4, skip: 4, diff: 'hard', cog: 6, time: 40 },
    { start: 8, skip: 3, diff: 'hard', cog: 5, time: 35 },
    { start: 3, skip: 5, diff: 'hard', cog: 6, time: 40 },
    { start: 5, skip: 4, diff: 'hard', cog: 6, time: 40 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const cfg of configs) {
    const seq: string[] = [];
    for (let j = 0; j < 5; j++) seq.push(toLetter(cfg.start + j * cfg.skip));
    const answer = toLetter(cfg.start + 5 * cfg.skip);
    const shown = seq.join('  ') + '  ?';
    const distractors = [
      toLetter(cfg.start + 5 * cfg.skip + 1),
      toLetter(cfg.start + 5 * cfg.skip - 1),
      toLetter(cfg.start + 5 * cfg.skip + 2),
    ].filter(d => d !== answer);
    const options = shuffle([answer, ...distractors.slice(0, 3)]);
    while (options.length < 4) options.push(toLetter(cfg.start + 6 * cfg.skip));

    questions.push(makeQ({
      type: 'letter_sequences',
      prompt: `What comes next in the sequence? ${shown}`,
      options,
      correctAnswer: answer,
      difficulty: cfg.diff,
      skillId: 'vr.sequences',
      subRuleId: 'vr.sequences.alphabetic_skip',
      trapTypes: ['skip_count_error'],
      cognitiveLoad: cfg.cog,
      estTimeSeconds: cfg.time,
      explanation: `The pattern skips ${cfg.skip - 1} letter${cfg.skip > 2 ? 's' : ''} each time. The next letter is ${answer}.`,
    }));
  }
  return questions;
}

function generateAlternatingQuestions(): GeneratedQuestion[] {
  const configs: { s1: number; s2: number; inc1: number; inc2: number; diff: string; cog: number; time: number }[] = [
    { s1: 1, s2: 2, inc1: 2, inc2: 2, diff: 'easy', cog: 3, time: 25 },
    { s1: 1, s2: 26, inc1: 1, inc2: -1, diff: 'easy', cog: 3, time: 25 },
    { s1: 3, s2: 4, inc1: 2, inc2: 2, diff: 'easy', cog: 3, time: 25 },
    { s1: 1, s2: 3, inc1: 2, inc2: 2, diff: 'easy', cog: 4, time: 30 },
    { s1: 5, s2: 6, inc1: 2, inc2: 2, diff: 'easy', cog: 3, time: 25 },
    { s1: 2, s2: 25, inc1: 2, inc2: -2, diff: 'medium', cog: 5, time: 35 },
    { s1: 1, s2: 4, inc1: 3, inc2: 3, diff: 'medium', cog: 5, time: 35 },
    { s1: 7, s2: 8, inc1: 2, inc2: 2, diff: 'medium', cog: 4, time: 30 },
    { s1: 3, s2: 24, inc1: 1, inc2: -1, diff: 'medium', cog: 5, time: 35 },
    { s1: 9, s2: 10, inc1: 2, inc2: 2, diff: 'medium', cog: 4, time: 30 },
    { s1: 1, s2: 5, inc1: 3, inc2: 3, diff: 'medium', cog: 5, time: 35 },
    { s1: 2, s2: 3, inc1: 3, inc2: 3, diff: 'hard', cog: 6, time: 40 },
    { s1: 4, s2: 22, inc1: 2, inc2: -3, diff: 'hard', cog: 7, time: 45 },
    { s1: 11, s2: 12, inc1: 2, inc2: 2, diff: 'hard', cog: 5, time: 35 },
    { s1: 6, s2: 20, inc1: 3, inc2: -2, diff: 'hard', cog: 7, time: 45 },
    { s1: 1, s2: 2, inc1: 4, inc2: 4, diff: 'hard', cog: 7, time: 45 },
    { s1: 13, s2: 14, inc1: 2, inc2: 2, diff: 'hard', cog: 5, time: 35 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const cfg of configs) {
    const seq: string[] = [];
    for (let j = 0; j < 4; j++) {
      seq.push(toLetter(cfg.s1 + Math.floor(j / 1) * cfg.inc1 * (j % 2 === 0 ? 1 : 0) + Math.floor((j + 1) / 2) * cfg.inc1 * (j % 2 === 0 ? 0 : 0)));
    }
    const seqAlt: string[] = [];
    let a = cfg.s1, b = cfg.s2;
    for (let j = 0; j < 6; j++) {
      if (j % 2 === 0) { seqAlt.push(toLetter(a)); a += cfg.inc1; }
      else { seqAlt.push(toLetter(b)); b += cfg.inc2; }
    }
    const shown = seqAlt.slice(0, 5).join('  ') + '  ?';
    const answer = seqAlt[5];
    const distractors = [
      toLetter(b + cfg.inc2),
      toLetter(a + cfg.inc1),
      toLetter(b - cfg.inc2),
    ].filter(d => d !== answer);
    const uniqueDistractors = Array.from(new Set(distractors)).filter(d => d !== answer).slice(0, 3);
    while (uniqueDistractors.length < 3) uniqueDistractors.push(toLetter(a + 2 * cfg.inc1));
    const options = shuffle([answer, ...uniqueDistractors.slice(0, 3)]);

    questions.push(makeQ({
      type: 'letter_sequences',
      prompt: `What comes next in the sequence? ${shown}`,
      options,
      correctAnswer: answer,
      difficulty: cfg.diff,
      skillId: 'vr.sequences',
      subRuleId: 'vr.sequences.alternating',
      trapTypes: ['alternating_pattern_error'],
      cognitiveLoad: cfg.cog,
      estTimeSeconds: cfg.time,
      explanation: `This sequence alternates between two patterns. The next letter is ${answer}.`,
    }));
  }
  return questions;
}

function generateReversePatternQuestions(): GeneratedQuestion[] {
  const configs: { start: number; step: number; diff: string; cog: number; time: number }[] = [
    { start: 26, step: 1, diff: 'easy', cog: 2, time: 20 },
    { start: 26, step: 2, diff: 'easy', cog: 3, time: 25 },
    { start: 25, step: 1, diff: 'easy', cog: 2, time: 20 },
    { start: 24, step: 2, diff: 'easy', cog: 3, time: 25 },
    { start: 26, step: 3, diff: 'easy', cog: 3, time: 25 },
    { start: 25, step: 2, diff: 'medium', cog: 4, time: 30 },
    { start: 23, step: 3, diff: 'medium', cog: 5, time: 35 },
    { start: 20, step: 2, diff: 'medium', cog: 4, time: 30 },
    { start: 22, step: 3, diff: 'medium', cog: 5, time: 35 },
    { start: 26, step: 4, diff: 'medium', cog: 5, time: 35 },
    { start: 24, step: 3, diff: 'hard', cog: 6, time: 40 },
    { start: 26, step: 5, diff: 'hard', cog: 7, time: 45 },
    { start: 25, step: 4, diff: 'hard', cog: 6, time: 40 },
    { start: 21, step: 3, diff: 'hard', cog: 6, time: 40 },
    { start: 20, step: 4, diff: 'hard', cog: 7, time: 45 },
    { start: 19, step: 3, diff: 'hard', cog: 6, time: 40 },
  ];
  const questions: GeneratedQuestion[] = [];

  for (const cfg of configs) {
    const seq: string[] = [];
    for (let j = 0; j < 5; j++) seq.push(toLetter(cfg.start - j * cfg.step));
    const answer = toLetter(cfg.start - 5 * cfg.step);
    const shown = seq.join('  ') + '  ?';
    const distractors = [
      toLetter(cfg.start - 5 * cfg.step + 1),
      toLetter(cfg.start - 5 * cfg.step - 1),
      toLetter(cfg.start - 4 * cfg.step),
    ].filter(d => d !== answer);
    const uniqueD = Array.from(new Set(distractors)).slice(0, 3);
    while (uniqueD.length < 3) uniqueD.push(toLetter(cfg.start - 6 * cfg.step));
    const options = shuffle([answer, ...uniqueD.slice(0, 3)]);

    questions.push(makeQ({
      type: 'letter_sequences',
      prompt: `What comes next in the sequence? ${shown}`,
      options,
      correctAnswer: answer,
      difficulty: cfg.diff,
      skillId: 'vr.sequences',
      subRuleId: 'vr.sequences.reverse_pattern',
      trapTypes: ['direction_error'],
      cognitiveLoad: cfg.cog,
      estTimeSeconds: cfg.time,
      explanation: `The letters go backwards, decreasing by ${cfg.step} each time. The next letter is ${answer}.`,
    }));
  }
  return questions;
}

export function generateLetterSequenceQuestions(): GeneratedQuestion[] {
  return [
    ...generateAlphabeticSkipQuestions(),
    ...generateAlternatingQuestions(),
    ...generateReversePatternQuestions(),
  ];
}

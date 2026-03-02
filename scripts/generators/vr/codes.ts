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

function letterToNum(c: string): number {
  return c.toUpperCase().charCodeAt(0) - 64;
}

function numToLetter(n: number): string {
  return String.fromCharCode(((((n - 1) % 26) + 26) % 26) + 65);
}

function generateLetterNumberCipherQuestions(): GeneratedQuestion[] {
  const words = [
    'CAT','DOG','SUN','CUP','HAT','PEN','BAG','MAP','RUN','FUN',
    'BIG','RED','TOP','BOX','JAM','NET','LOG','HOP','BUS','MUG',
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 17; i++) {
    const word = words[i % words.length];
    const coded = word.split('').map(c => letterToNum(c)).join(', ');
    const difficulty = i < 6 ? 'easy' : i < 12 ? 'medium' : 'hard';
    const cogLoad = i < 6 ? 3 : i < 12 ? 5 : 7;
    const correct = word;
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const d = words[Math.floor(Math.random() * words.length)];
      if (d !== correct && !distractors.includes(d)) distractors.push(d);
    }
    const options = shuffle([correct, ...distractors]);

    questions.push(makeQ({
      type: 'codes',
      prompt: `If A=1, B=2, C=3 and so on, which word is coded as ${coded}?`,
      options,
      correctAnswer: correct,
      difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.letter_number_cipher',
      trapTypes: ['calculation_error'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
      explanation: `Each number represents a letter: ${word.split('').map(c => `${letterToNum(c)}=${c}`).join(', ')}, spelling ${word}.`,
    }));
  }
  return questions;
}

function generateAlphabeticShiftQuestions(): GeneratedQuestion[] {
  const pairs: [string, number][] = [
    ['CAT', 1], ['DOG', 2], ['SUN', 3], ['HAT', 1], ['PEN', 2],
    ['BAG', 3], ['CUP', 1], ['MAP', 2], ['RUN', 3], ['FUN', 1],
    ['BIG', 2], ['RED', 3], ['TOP', 1], ['BOX', 2], ['JAM', 3],
    ['NET', 1], ['LOG', 2],
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 17; i++) {
    const [word, shift] = pairs[i];
    const coded = word.split('').map(c => numToLetter(letterToNum(c) + shift)).join('');
    const difficulty = i < 6 ? 'easy' : i < 12 ? 'medium' : 'hard';
    const cogLoad = i < 6 ? 4 : i < 12 ? 6 : 8;
    const correct = word;
    const wrongShifts = [shift + 1, shift - 1, shift + 2].filter(s => s > 0 && s !== shift);
    const distractors = wrongShifts.slice(0, 3).map(s =>
      coded.split('').map(c => numToLetter(letterToNum(c) - s)).join('')
    );
    const options = shuffle([correct, ...distractors.slice(0, 3)]);
    while (options.length < 4) options.push('ZZZ');

    questions.push(makeQ({
      type: 'codes',
      prompt: `Each letter has been shifted forward ${shift} place${shift > 1 ? 's' : ''} in the alphabet. If the code is ${coded}, what is the original word?`,
      options,
      correctAnswer: correct,
      difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.alphabetic_shift',
      trapTypes: ['direction_error', 'off_by_one'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: difficulty === 'easy' ? 35 : difficulty === 'medium' ? 50 : 65,
      explanation: `Shifting each letter of ${coded} back by ${shift} gives ${correct}.`,
    }));
  }
  return questions;
}

function generateReverseCipherQuestions(): GeneratedQuestion[] {
  const words = [
    'STAR','MOON','LAMP','BIRD','FISH','TREE','FROG','SHIP','DRUM','KITE',
    'GOLD','SNOW','WIND','RAIN','LEAF','SAND','HILL',
  ];
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < 16; i++) {
    const word = words[i];
    const reversed = word.split('').reverse().join('');
    const difficulty = i < 5 ? 'easy' : i < 11 ? 'medium' : 'hard';
    const cogLoad = i < 5 ? 2 : i < 11 ? 4 : 6;
    const correct = word;
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const d = words[Math.floor(Math.random() * words.length)];
      if (d !== correct && !distractors.includes(d)) distractors.push(d);
    }
    const options = shuffle([correct, ...distractors]);

    questions.push(makeQ({
      type: 'codes',
      prompt: `In a reverse cipher, each word is spelt backwards. What word does ${reversed} represent?`,
      options,
      correctAnswer: correct,
      difficulty,
      skillId: 'vr.codes',
      subRuleId: 'vr.codes.reverse_cipher',
      trapTypes: ['reversal_error'],
      cognitiveLoad: cogLoad,
      estTimeSeconds: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40,
      explanation: `Reversing the letters of ${reversed} gives ${correct}.`,
    }));
  }
  return questions;
}

export function generateCodeQuestions(): GeneratedQuestion[] {
  return [
    ...generateLetterNumberCipherQuestions(),
    ...generateAlphabeticShiftQuestions(),
    ...generateReverseCipherQuestions(),
  ];
}

/**
 * COMPREHENSION GENERATOR
 * =======================
 * Produces reading comprehension questions aligned to GL Assessment Paper 1.
 * Each passage yields 4–5 questions across 5 cognitive types.
 *
 * Usage (called by generate_seed.ts):
 *   import { generateComprehensionQuestions } from './generators/comprehension';
 *   const questions = generateComprehensionQuestions(rng, targetCount);
 *
 * Output: GeneratedQuestion[] — drop-in compatible with existing seed pipeline.
 *
 * Architecture:
 *   passages.ts  ← 15 seeded passages (100–150 words, British English, Y6 reading age)
 *   templates.ts ← question generation logic per cognitive type
 *   index.ts     ← orchestrator (this file)
 */

import type { GeneratedQuestion } from '../types';
import { PASSAGES, type Passage } from './passages';
import { generateQuestionsForPassage } from './templates';

// ─── PUBLIC ENTRY POINT ─────────────────────────────────────────────────────

/**
 * Generate comprehension questions.
 * @param rng   Seeded random function — pass rng from generate_seed.ts
 * @param count Approximate number of questions to generate (rounded to passage boundaries)
 */
export function generateComprehensionQuestions(
  rng: () => number,
  count: number = 60
): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];
  const shuffledPassages = shuffle([...PASSAGES], rng);

  for (const passage of shuffledPassages) {
    if (results.length >= count) break;
    const qs = generateQuestionsForPassage(passage, rng);
    results.push(...qs);
  }

  return results.slice(0, count);
}

// ─── UTILITY ────────────────────────────────────────────────────────────────

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * seed_nvr_rebuild.ts
 * Archives all NVR medium/hard questions and inserts the new GL-spec bank.
 * Run: npx tsx scripts/seed_nvr_rebuild.ts
 * Force mode: npx tsx scripts/seed_nvr_rebuild.ts --force
 */

import { db } from '../server/db';
import { questions } from '../shared/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { GeneratedQuestion } from './generators/types';

import { generateSequenceQuestions } from './generators/nvr/sequence';
import { generateTransformationQuestions } from './generators/nvr/transformation';
import { generateRotationReflectionQuestions } from './generators/nvr/rotation_reflection';
import { generateClassificationQuestions } from './generators/nvr/classification';
import { generateSymmetryQuestions } from './generators/nvr/symmetry_spatial';

async function main() {
  const forceMode = process.argv.includes('--force');

  console.log('=== NVR Bank Rebuild ===\n');

  // ── 1. Archive existing NVR medium/hard questions ──────────────────────────

  const existingNvr = await db.select({ id: questions.id, difficulty: questions.difficulty, qaStatus: questions.qaStatus })
    .from(questions)
    .where(and(
      eq(questions.section, 'Non-Verbal Reasoning'),
      inArray(questions.difficulty, ['medium', 'hard']),
      eq(questions.qaStatus, 'approved'),
    ));

  console.log(`Found ${existingNvr.length} existing NVR medium/hard questions to archive.`);

  if (existingNvr.length > 0) {
    const ids = existingNvr.map(q => q.id);
    // Archive in batches of 100
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100);
      await db.update(questions)
        .set({ qaStatus: 'archived' })
        .where(inArray(questions.id, batch));
    }
    console.log(`✓ Archived ${ids.length} NVR medium/hard questions.\n`);
  }

  // ── 2. Generate new NVR questions ─────────────────────────────────────────

  console.log('Generating new NVR questions...');

  const seq = generateSequenceQuestions();
  const transform = generateTransformationQuestions();
  const rotRefl = generateRotationReflectionQuestions();
  const classif = generateClassificationQuestions();
  const sym = generateSymmetryQuestions();

  const all: GeneratedQuestion[] = [...seq, ...transform, ...rotRefl, ...classif, ...sym];

  const byDiff: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const q of all) {
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    byType[q.subRuleId?.split('.').slice(0, 2).join('.') || 'unknown'] = (byType[q.subRuleId?.split('.').slice(0, 2).join('.') || 'unknown'] || 0) + 1;
  }

  console.log(`Generated ${all.length} NVR questions:`);
  console.log('  By difficulty:', byDiff);
  console.log('  By type group:', byType);
  console.log();

  // Validate no duplicate SVG options
  let dupeCount = 0;
  for (const q of all) {
    if (q.renderType === 'svg') {
      const opts = (q.renderConfig?.answerOptions || []).map((o: any) => JSON.stringify(o));
      const unique = new Set(opts);
      if (unique.size < opts.length) dupeCount++;
    }
  }
  if (dupeCount > 0) {
    console.warn(`WARN: ${dupeCount} questions have duplicate SVG answer options — these may be skipped.`);
  }

  // ── 3. Insert into DB ───────────────────────────────────────────────────────

  console.log('Inserting new NVR questions into DB...');

  let inserted = 0;
  const batchSize = 40;
  const startOrderIndex = 10000; // above existing questions' typical order range

  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    const values = batch.map((q, j) => ({
      section: q.section,
      type: q.type || 'nvr',
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      timeExpected: q.estTimeSeconds,
      orderIndex: startOrderIndex + i + j,
      skillId: q.skillId,
      subRuleId: q.subRuleId,
      renderType: q.renderType,
      renderConfig: q.renderConfig || {},
      trapTypes: q.trapTypes || [],
      cognitiveLoad: q.cognitiveLoad,
      locale: q.locale || 'en-GB',
      britishSpelling: q.britishSpelling !== false,
      version: q.version || 3,
      qualityScore: 1,
      qaStatus: 'approved',
      estTimeSeconds: q.estTimeSeconds,
      explanation: q.explanation || null,
      freePool: false,
    }));

    await db.insert(questions).values(values as any);
    inserted += batch.length;
    process.stdout.write(`\r  Inserted ${inserted}/${all.length}`);
  }

  console.log(`\n✓ Inserted ${inserted} new NVR questions.\n`);

  // ── 4. Summary ─────────────────────────────────────────────────────────────

  const totals = await db.select({
    section: questions.section,
    difficulty: questions.difficulty,
    count: sql<number>`count(*)::int`,
  }).from(questions)
    .where(and(
      eq(questions.section, 'Non-Verbal Reasoning'),
      eq(questions.qaStatus, 'approved'),
    ))
    .groupBy(questions.section, questions.difficulty);

  console.log('=== NVR Bank Status After Rebuild ===');
  let grand = 0;
  for (const row of totals) {
    console.log(`  ${row.difficulty}: ${row.count}`);
    grand += Number(row.count);
  }
  console.log(`  TOTAL: ${grand}`);

  // ── 5. Print sample IDs for QA review ────────────────────────────────────

  const samples = await db.select({ id: questions.id, subRuleId: questions.subRuleId, difficulty: questions.difficulty })
    .from(questions)
    .where(and(
      eq(questions.section, 'Non-Verbal Reasoning'),
      eq(questions.qaStatus, 'approved'),
      eq(questions.qualityScore, 1),
    ))
    .limit(5);

  console.log('\nSample new question IDs for QA:');
  for (const s of samples) {
    console.log(`  ${s.id}  ${s.subRuleId}  (${s.difficulty})`);
  }

  console.log('\nDone.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('NVR rebuild failed:', err);
  process.exit(1);
});

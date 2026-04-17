/**
 * seed_sequence_rebuild.ts
 * Archives all existing NVR sequence questions (v3) and inserts
 * the new GL-spec-compliant v4 sequence bank.
 *
 * Run: npx tsx scripts/seed_sequence_rebuild.ts
 */

import { db } from '../server/db';
import { questions } from '../shared/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { generateSequenceQuestions } from './generators/nvr/sequence';

async function main() {
  console.log('=== NVR Sequence Bank Rebuild (v5 → v6) ===\n');

  // ── 1. Archive ALL existing approved NVR sequence questions ──────────────────

  const existing = await db
    .select({ id: questions.id, difficulty: questions.difficulty, version: questions.version })
    .from(questions)
    .where(and(
      eq(questions.skillId, 'nvr.sequence'),
      eq(questions.qaStatus, 'approved'),
    ));

  console.log(`Found ${existing.length} existing approved NVR sequence questions.`);

  if (existing.length > 0) {
    const ids = existing.map(q => q.id);
    for (let i = 0; i < ids.length; i += 100) {
      await db.update(questions)
        .set({ qaStatus: 'archived' })
        .where(inArray(questions.id, ids.slice(i, i + 100)));
    }
    console.log(`✓ Archived ${ids.length} old sequence questions.\n`);
  }

  // ── 2. Generate new v6 questions ─────────────────────────────────────────────

  console.log('Generating v6 sequence questions...');
  const generated = generateSequenceQuestions();

  const byDiff: Record<string, number> = {};
  for (const q of generated) {
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
  }
  console.log(`Generated ${generated.length} questions:`, byDiff);

  // Validate no duplicate SVG options
  let dupeCount = 0;
  let missingAnswer = 0;
  for (const q of generated) {
    const opts = (q.renderConfig?.answerOptions || []).map((o: any) => JSON.stringify(o));
    const unique = new Set(opts);
    if (unique.size < opts.length) dupeCount++;
    if (!q.correctAnswer) missingAnswer++;
  }
  if (dupeCount > 0) console.warn(`  WARN: ${dupeCount} questions have duplicate SVG options.`);
  if (missingAnswer > 0) console.warn(`  WARN: ${missingAnswer} questions missing correct answer.`);
  console.log(`  Validation: ${dupeCount} duplicate options, ${missingAnswer} missing answers.\n`);

  // ── 3. Insert into DB ─────────────────────────────────────────────────────────

  console.log('Inserting new sequence questions...');
  const batchSize = 30;
  let inserted = 0;
  const baseOrderIndex = 15000;

  for (let i = 0; i < generated.length; i += batchSize) {
    const batch = generated.slice(i, i + batchSize);
    const values = batch.map((q, j) => ({
      section: q.section,
      type: 'sequence',
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      timeExpected: q.estTimeSeconds,
      orderIndex: baseOrderIndex + i + j,
      skillId: q.skillId,
      subRuleId: q.subRuleId,
      renderType: q.renderType,
      renderConfig: q.renderConfig || {},
      trapTypes: q.trapTypes || [],
      cognitiveLoad: q.cognitiveLoad,
      locale: q.locale || 'en-GB',
      britishSpelling: q.britishSpelling !== false,
      version: q.version ?? 6,
      qualityScore: 1,
      qaStatus: 'approved',
      questionPool: 'practice',
      freePool: false,
      estTimeSeconds: q.estTimeSeconds,
      explanation: q.explanation || null,
    }));

    await db.insert(questions).values(values as any);
    inserted += batch.length;
    process.stdout.write(`\r  Inserted ${inserted}/${generated.length}`);
  }

  console.log(`\n✓ Inserted ${inserted} new v6 sequence questions.\n`);

  // ── 4. Summary ────────────────────────────────────────────────────────────────

  const totals = await db
    .select({
      difficulty: questions.difficulty,
      count: sql<number>`count(*)::int`,
    })
    .from(questions)
    .where(and(
      eq(questions.skillId, 'nvr.sequence'),
      eq(questions.qaStatus, 'approved'),
    ))
    .groupBy(questions.difficulty);

  console.log('=== NVR Sequence Bank After Rebuild ===');
  let grand = 0;
  for (const row of totals) {
    console.log(`  ${row.difficulty}: ${row.count}`);
    grand += Number(row.count);
  }
  console.log(`  TOTAL: ${grand}\n`);

  // ── 5. Pick a new mini-1 sequence question ────────────────────────────────────

  const newMini1 = await db
    .select({ id: questions.id, difficulty: questions.difficulty, subRuleId: questions.subRuleId })
    .from(questions)
    .where(and(
      eq(questions.skillId, 'nvr.sequence'),
      eq(questions.qaStatus, 'approved'),
      eq(questions.qualityScore, 1),
      eq(questions.difficulty, 'easy'),
      eq(questions.questionPool, 'practice'),
    ))
    .limit(1);

  if (newMini1.length > 0) {
    console.log('Suggested replacement mini-1 sequence question ID:');
    console.log(`  '${newMini1[0].id}', // NVR sequence easy (v4) — ${newMini1[0].subRuleId}`);
    console.log('\nUpdate FIXED_MINI_IDS in server/storage.ts to use this ID.\n');
  }

  console.log('Done.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Sequence rebuild failed:', err);
  process.exit(1);
});

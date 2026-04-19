/**
 * seed_sequence_enum_v7.ts
 * Inserts enumeration-generated NVR sequence questions (medium + hard only).
 * Deduplicates via render_config JSON fingerprint — safe to re-run.
 *
 * Run: npx tsx scripts/seed_sequence_enum_v7.ts
 */

import { db } from '../server/db';
import { questions } from '../shared/schema';
import { eq, and } from 'drizzle-orm';
import { generateSequenceQuestions } from './generators/nvr/sequence';

function renderConfigFingerprint(rc: any): string {
  if (!rc || !rc.frames) return JSON.stringify(rc);
  const simplified = {
    frames: (rc.frames as any[]).map(frame =>
      (frame.elements as any[]).map(el => ({
        s: el.shape, x: el.x, y: el.y, sz: el.size, r: el.rotation, f: el.fill,
      }))
    ),
    qi: rc.questionIndex,
  };
  return JSON.stringify(simplified);
}

async function main() {
  console.log('=== NVR Sequence Bank Enumeration Insert (v7) ===\n');

  const generated = generateSequenceQuestions();
  const byDiff: Record<string, number> = {};
  for (const q of generated) byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
  console.log(`Generated ${generated.length} enumerated questions:`, byDiff);

  let dupOpts = 0;
  for (const q of generated) {
    const opts = (q.renderConfig?.answerOptions || []).map((o: any) => JSON.stringify(o));
    if (new Set(opts).size < opts.length) dupOpts++;
  }
  if (dupOpts > 0) console.warn(`  WARN: ${dupOpts} questions have duplicate SVG options.`);
  console.log(`  Validation: ${dupOpts} duplicate-option questions.\n`);

  const existing = await db
    .select({ id: questions.id, renderConfig: questions.renderConfig })
    .from(questions)
    .where(and(
      eq(questions.skillId, 'nvr.sequence'),
      eq(questions.qaStatus, 'approved'),
    ));

  const existingFingerprints = new Set(
    existing.map(q => renderConfigFingerprint(q.renderConfig))
  );
  console.log(`Found ${existing.length} existing approved nvr.sequence questions.\n`);

  const toInsert = generated.filter(q => {
    const fp = renderConfigFingerprint(q.renderConfig);
    return !existingFingerprints.has(fp);
  });
  const skipped = generated.length - toInsert.length;
  if (skipped > 0) console.log(`Skipping ${skipped} questions already in DB (fingerprint match).`);

  const insertByDiff: Record<string, number> = {};
  for (const q of toInsert) insertByDiff[q.difficulty] = (insertByDiff[q.difficulty] || 0) + 1;
  console.log(`Inserting ${toInsert.length} new questions:`, insertByDiff);

  if (toInsert.length === 0) {
    console.log('\n✓ Nothing to insert — all enumerated questions already present.');
    return;
  }

  const batchSize = 25;
  let inserted = 0;
  const baseOrderIndex = 16000;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const values = batch.map((q, j) => ({
      section: q.section,
      type: 'sequence',
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      timeExpected: q.estTimeSeconds,
      orderIndex: baseOrderIndex + i + j,
      renderType: q.renderType || 'svg',
      renderConfig: q.renderConfig || null,
      explanation: q.explanation || null,
      skillId: q.skillId || 'nvr.sequence',
      subRuleId: q.subRuleId || null,
      cognitiveLoad: q.cognitiveLoad || null,
      qaStatus: 'approved',
      britishSpelling: true,
      locale: 'en-GB',
      version: q.version ?? null,
      trapTypes: q.trapTypes || null,
    }));
    await db.insert(questions).values(values as any);
    inserted += batch.length;
    process.stdout.write(`  Inserted ${inserted}/${toInsert.length}...\r`);
  }

  console.log(`\n\n✓ Done. Inserted ${inserted} new NVR sequence questions.`);

  const finalCounts = await db
    .select({ difficulty: questions.difficulty, subRuleId: questions.subRuleId })
    .from(questions)
    .where(and(eq(questions.skillId, 'nvr.sequence'), eq(questions.qaStatus, 'approved')));

  const summary: Record<string, Record<string, number>> = {};
  for (const q of finalCounts) {
    const d = q.difficulty ?? 'unknown';
    const s = q.subRuleId ?? 'unknown';
    if (!summary[d]) summary[d] = {};
    summary[d][s] = (summary[d][s] || 0) + 1;
  }
  console.log('\nFinal approved question counts by difficulty + sub-rule:');
  for (const [diff, subs] of Object.entries(summary).sort()) {
    const total = Object.values(subs).reduce((a, b) => a + b, 0);
    console.log(`  ${diff} (${total}):`, subs);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

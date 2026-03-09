import { generateCodeQuestions } from "./generators/vr/codes";
import { generateLetterSequenceQuestions } from "./generators/vr/letter_sequences";
import { generateWordSequenceQuestions } from "./generators/vr/word_sequences";
import { generateVocabQuestions } from "./generators/vr/vocab_relationships";
import { generateWordStructureQuestions } from "./generators/vr/word_structure";
import { generateVerbalLogicQuestions } from "./generators/vr/verbal_logic";
import { generateSequenceQuestions } from "./generators/nvr/sequence";
import { generateRotationReflectionQuestions } from "./generators/nvr/rotation_reflection";
import { generateTransformationQuestions } from "./generators/nvr/transformation";
import { generateSymmetryQuestions } from "./generators/nvr/symmetry_spatial";
import { generateClassificationQuestions } from "./generators/nvr/classification";
import { generateArithmeticQuestions } from "./generators/maths/arithmetic";
import { generateFractionDecimalQuestions } from "./generators/maths/fractions_decimals";
import { generateRatioQuestions } from "./generators/maths/ratio_proportion";
import { generatePercentageQuestions } from "./generators/maths/percentages";
import { generateWordProblemQuestions } from "./generators/maths/word_problems";
import { generateNumberPatternQuestions } from "./generators/maths/number_patterns";
import { generateDataInterpretationQuestions } from "./generators/maths/data_interpretation";
import type { GeneratedQuestion } from "./generators/types";
import * as fs from "fs";
import * as path from "path";

const allQuestions = [
  ...generateCodeQuestions(),
  ...generateLetterSequenceQuestions(),
  ...generateWordSequenceQuestions(),
  ...generateVocabQuestions(),
  ...generateWordStructureQuestions(),
  ...generateVerbalLogicQuestions(),
  ...generateSequenceQuestions(),
  ...generateRotationReflectionQuestions(),
  ...generateTransformationQuestions(),
  ...generateSymmetryQuestions(),
  ...generateClassificationQuestions(),
  ...generateArithmeticQuestions(),
  ...generateFractionDecimalQuestions(),
  ...generateRatioQuestions(),
  ...generatePercentageQuestions(),
  ...generateWordProblemQuestions(),
  ...generateNumberPatternQuestions(),
  ...generateDataInterpretationQuestions(),
];

const bySection: Record<string, number> = {};
const byStatus: Record<string, number> = {};
const byRenderType: Record<string, number> = {};

for (const q of allQuestions) {
  bySection[q.section] = (bySection[q.section] || 0) + 1;
  byStatus[q.qaStatus] = (byStatus[q.qaStatus] || 0) + 1;
  byRenderType[q.renderType] = (byRenderType[q.renderType] || 0) + 1;
}

console.log(`\n=== GENERATION SUMMARY ===`);
console.log(`Total questions generated: ${allQuestions.length}`);
console.log("By section:", bySection);
console.log("By status:", byStatus);
console.log("By render type:", byRenderType);

let totalFails = 0;
let totalWarnings = 0;

function fail(msg: string) { totalFails++; console.log(`  FAIL: ${msg}`); }
function warn(msg: string) { totalWarnings++; console.log(`  WARN: ${msg}`); }
function pass(msg: string) { console.log(`  PASS: ${msg}`); }

console.log(`\n=== QA VALIDATION ===`);

console.log(`\n--- Option uniqueness (no 2 options identical) ---`);
let dupeOptionCount = 0;
for (const q of allQuestions) {
  if (q.subRuleId?.startsWith('nvr.classification')) continue;
  if (q.renderType === 'svg') {
    const optStrings = (q.renderConfig?.answerOptions || []).map((o: any) => JSON.stringify(o));
    const uniqueOpts = new Set(optStrings);
    if (uniqueOpts.size < optStrings.length) {
      dupeOptionCount++;
      fail(`${q.subRuleId} has ${optStrings.length - uniqueOpts.size} duplicate SVG option(s): "${q.prompt.substring(0, 60)}..."`);
    }
  } else {
    const uniqueOpts = new Set(q.options);
    if (uniqueOpts.size < q.options.length) {
      dupeOptionCount++;
      fail(`${q.subRuleId} has duplicate text options: [${q.options.join(', ')}]`);
    }
  }
}
const nonClassCount = allQuestions.filter(q => !q.subRuleId?.startsWith('nvr.classification')).length;
if (dupeOptionCount === 0) pass(`0/${nonClassCount} non-classification questions have duplicate options`);
else fail(`${dupeOptionCount}/${nonClassCount} non-classification questions have duplicate options`);

console.log(`\n--- Classification frame count check ---`);
const classificationQs = allQuestions.filter(q => q.subRuleId?.startsWith('nvr.classification'));
let badFrameCount = 0;
for (const q of classificationQs) {
  const frames = q.renderConfig?.group || q.renderConfig?.answerOptions || [];
  if (frames.length !== 5) {
    badFrameCount++;
    fail(`Classification question has ${frames.length} frames, expected 5`);
  }
  const emptyFrames = frames.filter((f: any) => !f.elements || f.elements.length === 0);
  if (emptyFrames.length > 0) {
    badFrameCount++;
    fail(`Classification question has ${emptyFrames.length} empty frame(s)`);
  }
}
if (badFrameCount === 0) pass(`0/${classificationQs.length} classification questions have wrong frame counts`);
else fail(`${badFrameCount}/${classificationQs.length} classification questions have issues`);

console.log(`\n--- Axis safety (reflection questions) ---`);
const reflectionQs = allQuestions.filter(q =>
  q.subRuleId?.includes('reflect_x') || q.subRuleId?.includes('reflect_y') || q.subRuleId?.includes('rotate_plus_reflect')
);
let axisUnsafeCount = 0;
for (const q of reflectionQs) {
  const promptFrames = q.renderConfig?.promptFrames || [];
  const answerOptions = q.renderConfig?.answerOptions || [];
  const allFrames = [...promptFrames, ...answerOptions];
  for (const frame of allFrames) {
    for (const el of (frame.elements || [])) {
      if (q.subRuleId?.includes('reflect_x') && Math.abs(el.x - 50) < 8) {
        axisUnsafeCount++;
      }
      if (q.subRuleId?.includes('reflect_y') && Math.abs(el.y - 50) < 8) {
        axisUnsafeCount++;
      }
    }
  }
}
if (axisUnsafeCount === 0) pass(`0 axis-unsafe elements in ${reflectionQs.length} reflection questions`);
else warn(`${axisUnsafeCount} elements within 8 units of reflection axis`);

console.log(`\n--- Symmetry circle check ---`);
const symmetryQs = allQuestions.filter(q => q.subRuleId?.startsWith('nvr.symmetry'));
let circleInSymmetry = 0;
for (const q of symmetryQs) {
  const group = q.renderConfig?.group || [];
  const opts = q.renderConfig?.answerOptions || [];
  for (const frame of [...group, ...opts]) {
    for (const el of (frame.elements || [])) {
      if (el.shape === 'circle') circleInSymmetry++;
    }
  }
}
if (circleInSymmetry === 0) pass(`0 circles in ${symmetryQs.length} symmetry questions`);
else fail(`${circleInSymmetry} circle elements found in symmetry questions`);

console.log(`\n--- Variety metadata completeness ---`);
const varietyFields = ['stemVariantId', 'distractorStyleId'] as const;
const missingVariety: Record<string, number> = {};
for (const q of allQuestions) {
  for (const field of varietyFields) {
    if (!q[field]) {
      const key = `${q.subRuleId}:${field}`;
      missingVariety[key] = (missingVariety[key] || 0) + 1;
    }
  }
}
const missingKeys = Object.keys(missingVariety);
if (missingKeys.length === 0) pass(`All questions have stemVariantId and distractorStyleId`);
else {
  for (const key of missingKeys) {
    warn(`${key}: ${missingVariety[key]} questions missing`);
  }
}

console.log(`\n--- Stem diversity per sub-rule ---`);
const stemsBySubRule = new Map<string, Set<string>>();
const countsBySubRule = new Map<string, number>();
for (const q of allQuestions) {
  const sr = q.subRuleId || 'unknown';
  if (!stemsBySubRule.has(sr)) stemsBySubRule.set(sr, new Set());
  if (q.stemVariantId) stemsBySubRule.get(sr)!.add(q.stemVariantId);
  countsBySubRule.set(sr, (countsBySubRule.get(sr) || 0) + 1);
}
for (const [sr, stems] of stemsBySubRule.entries()) {
  const count = countsBySubRule.get(sr) || 0;
  if (stems.size === 0) {
    warn(`${sr} (${count}q): no stem variants`);
  } else if (stems.size === 1 && count > 5) {
    warn(`${sr} (${count}q): only 1 stem variant`);
  } else {
    pass(`${sr} (${count}q): ${stems.size} stem variants`);
  }
}

console.log(`\n--- Difficulty distribution per sub-rule ---`);
const diffBySubRule = new Map<string, Record<string, number>>();
for (const q of allQuestions) {
  const sr = q.subRuleId || 'unknown';
  if (!diffBySubRule.has(sr)) diffBySubRule.set(sr, {});
  const diffs = diffBySubRule.get(sr)!;
  diffs[q.difficulty] = (diffs[q.difficulty] || 0) + 1;
}
for (const [sr, diffs] of diffBySubRule.entries()) {
  const total = Object.values(diffs).reduce((a, b) => a + b, 0);
  const levels = Object.keys(diffs).sort();
  const dist = levels.map(l => `${l}:${diffs[l]}`).join(', ');
  if (levels.length < 2 && total > 5) {
    warn(`${sr}: only ${levels[0]} difficulty (${total}q)`);
  } else {
    pass(`${sr} (${total}q): ${dist}`);
  }
}

console.log(`\n--- Position bounds check (NVR viewport) ---`);
const nvrQs = allQuestions.filter(q => q.renderType === 'svg');
let outOfBoundsCount = 0;
for (const q of nvrQs) {
  const allFrames = [
    ...(q.renderConfig?.frames || []),
    ...(q.renderConfig?.answerOptions || []),
    ...(q.renderConfig?.promptFrames || []),
    ...(q.renderConfig?.group || []),
  ];
  for (const frame of allFrames) {
    for (const el of (frame.elements || [])) {
      const halfSize = (el.size || 0) / 2;
      if (el.x - halfSize < -2 || el.x + halfSize > 102 || el.y - halfSize < -2 || el.y + halfSize > 102) {
        outOfBoundsCount++;
      }
    }
  }
}
if (outOfBoundsCount === 0) pass(`0 out-of-bounds elements in ${nvrQs.length} NVR questions`);
else warn(`${outOfBoundsCount} elements partially outside viewport`);

console.log(`\n=== FINAL RESULT ===`);
console.log(`Failures: ${totalFails}`);
console.log(`Warnings: ${totalWarnings}`);
if (totalFails === 0) {
  console.log(`ALL QA CHECKS PASSED`);
} else {
  console.log(`QA CHECKS FAILED — fix ${totalFails} failure(s) before seeding`);
}

const outPath = path.resolve(process.cwd(), "scripts/questions.seed.json");
fs.writeFileSync(outPath, JSON.stringify(allQuestions, null, 2));
console.log(`\nWritten to ${outPath}`);

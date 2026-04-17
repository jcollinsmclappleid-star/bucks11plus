import { generateSequenceReviewSet } from './generators/nvr/sequence';
import { writeFileSync, mkdirSync } from 'fs';

const result = generateSequenceReviewSet();

mkdirSync('scripts/generators/nvr/review_output', { recursive: true });
writeFileSync(
  'scripts/generators/nvr/review_output/sequence_review_v5.json',
  JSON.stringify(result.audit, null, 2)
);

const diff = result.questions.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Review set generated:', diff);
console.log('Audit entries:', result.audit.length);

let minSizeFound = 99;
for (const q of result.questions) {
  const cfg = q.renderConfig as any;
  if (cfg && cfg.frames) {
    for (const frame of cfg.frames) {
      for (const el of frame.elements || []) {
        if (typeof el.size === 'number' && el.size < minSizeFound) minSizeFound = el.size;
      }
    }
  }
  if (cfg && cfg.answerOptions) {
    for (const opt of cfg.answerOptions) {
      for (const el of opt.elements || []) {
        if (typeof el.size === 'number' && el.size < minSizeFound) minSizeFound = el.size;
      }
    }
  }
}

console.log(`Min shape size: ${minSizeFound} SVG units = ${(minSizeFound * 0.8).toFixed(1)}px at 80px mobile panel`);

const specDist: Record<string, number> = {};
for (const q of result.questions) {
  const id = q.subRuleId || 'unknown';
  specDist[id] = (specDist[id] || 0) + 1;
}
console.log('Spec distribution in review set:');
for (const [k, v] of Object.entries(specDist).sort()) {
  console.log(`  ${k}: ${v}`);
}

console.log('\nSample audit entries:');
for (const entry of result.audit.slice(0, 3)) {
  console.log(`  [${entry.difficulty}] ${entry.subRuleId}`);
  console.log(`    Primary: ${entry.primaryRule}`);
  if (entry.secondaryRule) console.log(`    Secondary: ${entry.secondaryRule}`);
  console.log(`    Mobile: ${entry.mobileCheck}`);
}

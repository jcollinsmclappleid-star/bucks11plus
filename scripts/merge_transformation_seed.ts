/**
 * @deprecated Use scripts/restore_nvr_from_git.ts — copies production questions from git, does not regenerate.
 * Merges NVR transformation questions generated at runtime (avoid for production parity).
 */
import * as fs from "fs";
import * as path from "path";
import { generateTransformationQuestions } from "./generators/nvr/transformation";
import type { GeneratedQuestion } from "./generators/types";

const SEED_PATH = path.resolve(process.cwd(), "scripts/questions.seed.json");

function toSeedRow(q: GeneratedQuestion) {
  return {
    section: q.section,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    estTimeSeconds: q.estTimeSeconds,
    skillId: q.skillId,
    subRuleId: q.subRuleId,
    renderType: q.renderType,
    renderConfig: q.renderConfig,
    trapTypes: q.trapTypes,
    cognitiveLoad: q.cognitiveLoad,
    locale: q.locale,
    britishSpelling: q.britishSpelling,
    version: q.version,
    qaStatus: q.qaStatus,
    explanation: q.explanation,
    freePool: false,
  };
}

const existing: Array<{ type: string }> = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
const withoutTransform = existing.filter((q) => q.type !== "transformation");
const generated = generateTransformationQuestions().map(toSeedRow);

const merged = [...withoutTransform, ...generated];
fs.writeFileSync(SEED_PATH, JSON.stringify(merged, null, 2));

console.log(`Removed old transformation: ${existing.length - withoutTransform.length}`);
console.log(`Added transformation: ${generated.length}`);
console.log(`Total seed entries: ${merged.length}`);
console.log(`Written to ${SEED_PATH}`);

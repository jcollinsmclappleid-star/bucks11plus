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

console.log(`Total questions generated: ${allQuestions.length}`);
console.log("By section:", bySection);
console.log("By status:", byStatus);
console.log("By render type:", byRenderType);

const outPath = path.resolve(process.cwd(), "scripts/questions.seed.json");
fs.writeFileSync(outPath, JSON.stringify(allQuestions, null, 2));
console.log(`Written to ${outPath}`);

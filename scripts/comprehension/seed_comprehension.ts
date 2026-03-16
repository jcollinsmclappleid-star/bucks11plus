import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { db } from "../../server/db";
import { questions } from "../../shared/schema";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ParsedPassage {
  passage_id: string;
  title: string;
  theme: string;
  text: string;
}

interface ParsedQuestion {
  question_id: string;
  passage_id: string;
  question_number: number;
  question_type: string;
  difficulty: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  region_alignment: string;
  age_band: string;
  qa_status: string;
  content_pool: string;
}

const QUESTION_TYPE_TO_SKILL: Record<string, string> = {
  "Fact Retrieval": "comp.fact_retrieval",
  "Vocabulary in Context": "comp.vocabulary",
  "Inference": "comp.inference",
  "Authorial Intent": "comp.authorial_intent",
  "Text Structure": "comp.text_structure",
};

const DIFFICULTY_TO_COGNITIVE: Record<string, number> = {
  "easy": 2,
  "medium": 3,
  "hard": 4,
};

const DIFFICULTY_TO_TIME: Record<string, number> = {
  "easy": 60,
  "medium": 90,
  "hard": 120,
};

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

function mapCorrectAnswer(letter: string, opts: string[]): string {
  const idx = OPTION_LETTERS.indexOf(letter as typeof OPTION_LETTERS[number]);
  return idx >= 0 ? opts[idx] : opts[0];
}

async function seedComprehension() {
  const passagesPath = path.resolve(__dirname, "passages.json");
  const questionsPath = path.resolve(__dirname, "questions.json");

  if (!fs.existsSync(passagesPath) || !fs.existsSync(questionsPath)) {
    console.error("passages.json or questions.json not found. Run parse_source.ts first.");
    process.exit(1);
  }

  const passageData: ParsedPassage[] = JSON.parse(fs.readFileSync(passagesPath, "utf-8"));
  const questionData: ParsedQuestion[] = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
  const passageMap = new Map(passageData.map(p => [p.passage_id, p]));

  console.log(`Loading ${questionData.length} comprehension questions from ${passageData.length} passages...`);

  const forceReseed = process.argv.includes("--force");

  const existing = await db.select({ id: questions.id }).from(questions)
    .where(sql`section = 'English Comprehension' AND skill_id LIKE 'comp.%'`);

  if (existing.length > 0 && !forceReseed) {
    console.log(`Already have ${existing.length} comprehension questions. Use --force to replace them.`);
    process.exit(0);
  }

  if (forceReseed && existing.length > 0) {
    console.log(`Force mode: deleting ${existing.length} existing comprehension questions...`);
    await db.delete(questions).where(sql`section = 'English Comprehension' AND skill_id LIKE 'comp.%'`);
    console.log("Deleted existing comprehension questions.");
  }

  let inserted = 0;
  const batchSize = 50;

  for (let i = 0; i < questionData.length; i += batchSize) {
    const batch = questionData.slice(i, i + batchSize);
    const values = batch.map((q, idx) => {
      const passage = passageMap.get(q.passage_id)!;
      const opts = [q.option_a, q.option_b, q.option_c, q.option_d];
      const correctText = mapCorrectAnswer(q.correct_answer, opts);
      const questionsInPassage = questionData.filter(x => x.passage_id === q.passage_id);
      const questionIndex = questionsInPassage.findIndex(x => x.question_id === q.question_id);

      const renderConfig = {
        kind: "comprehension.passage" as const,
        passageId: q.passage_id,
        passageTitle: passage.title,
        passageTheme: passage.theme,
        passageText: passage.text,
        questionType: q.question_type,
        questionIndex,
        totalQuestionsInPassage: questionsInPassage.length,
      };

      return {
        id: `comp-${q.passage_id.toLowerCase()}-q${q.question_number}`,
        section: "English Comprehension",
        type: q.question_type.toLowerCase().replace(/ /g, "_"),
        prompt: q.question_text,
        options: opts,
        correctAnswer: correctText,
        difficulty: q.difficulty,
        timeExpected: DIFFICULTY_TO_TIME[q.difficulty] || 90,
        orderIndex: i + idx,
        skillId: QUESTION_TYPE_TO_SKILL[q.question_type] || "comp.general",
        subRuleId: `${q.passage_id}_${q.question_type.toLowerCase().replace(/ /g, "_")}`,
        renderType: "comprehension",
        renderConfig,
        trapTypes: [] as string[],
        cognitiveLoad: DIFFICULTY_TO_COGNITIVE[q.difficulty] || 3,
        locale: "en-GB",
        britishSpelling: true,
        version: 1,
        qualityScore: 5,
        qaStatus: "approved",
        estTimeSeconds: DIFFICULTY_TO_TIME[q.difficulty] || 90,
        explanation: q.explanation,
      };
    });

    await db.insert(questions).values(values as any);
    inserted += batch.length;
    process.stdout.write(`\rInserted ${inserted}/${questionData.length}`);
  }

  console.log(`\nDone. Inserted ${inserted} comprehension questions across ${passageData.length} passages.`);
  process.exit(0);
}

seedComprehension().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});

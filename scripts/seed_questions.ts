import * as fs from "fs";
import * as path from "path";
import { db } from "../server/db";
import { questions } from "../shared/schema";
import { sql } from "drizzle-orm";
import type { GeneratedQuestion } from "./generators/types";

async function seedQuestions() {
  const seedPath = path.resolve(process.cwd(), "scripts/questions.seed.json");
  if (!fs.existsSync(seedPath)) {
    console.error("questions.seed.json not found. Run generate_seed.ts first.");
    process.exit(1);
  }

  const data: GeneratedQuestion[] = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  console.log(`Loading ${data.length} questions from seed file...`);

  const existing = await db.select({ id: questions.id }).from(questions);
  const existingWithSkill = await db.select({ id: questions.id, skillId: questions.skillId }).from(questions);
  const seededCount = existingWithSkill.filter(q => q.skillId && q.skillId !== "").length;

  if (seededCount > 100) {
    console.log(`Already have ${seededCount} skill-tagged questions. Skipping seed.`);
    process.exit(0);
  }

  let inserted = 0;
  const batchSize = 50;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map((q, idx) => ({
      section: q.section,
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      timeExpected: q.estTimeSeconds,
      orderIndex: i + idx,
      skillId: q.skillId,
      subRuleId: q.subRuleId,
      renderType: q.renderType,
      renderConfig: q.renderConfig || {},
      trapTypes: q.trapTypes || [],
      cognitiveLoad: q.cognitiveLoad,
      locale: q.locale || "en-GB",
      britishSpelling: q.britishSpelling !== false,
      version: q.version || 1,
      qualityScore: 0,
      qaStatus: q.qaStatus || "draft",
      estTimeSeconds: q.estTimeSeconds,
      explanation: q.explanation || null,
    }));

    await db.insert(questions).values(values as any);
    inserted += batch.length;
    process.stdout.write(`\rInserted ${inserted}/${data.length}`);
  }

  console.log(`\nDone. Inserted ${inserted} questions.`);
  process.exit(0);
}

seedQuestions().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});

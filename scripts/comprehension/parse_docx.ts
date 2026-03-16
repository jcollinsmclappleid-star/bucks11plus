import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ParsedPassage {
  passage_id: string;
  title: string;
  theme: string;
  text: string;
  difficulty: string;
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

function classifyQuestionType(prompt: string): string {
  const p = prompt.toLowerCase();
  if ((p.includes("word") || p.includes("phrase")) && (p.includes("mean") || p.includes("most nearly"))) return "Vocabulary in Context";
  if (p.includes("technique") || p.includes("simile") || p.includes("metaphor") || p.includes("onomatopoeia") || p.includes("alliteration") || p.includes("personification") || p.includes("hyperbole")) return "Authorial Intent";
  if (p.includes("how does the") && (p.includes("structure") || p.includes("move") || p.includes("develop"))) return "Text Structure";
  if (p.includes("purpose of") || p.includes("function of")) return "Text Structure";
  if (p.includes("effect of") || p.includes("what does") && p.includes("achieve")) return "Authorial Intent";
  if (p.includes("tone") || p.includes("style") || p.includes("writer's attitude") || p.includes("writer's approach")) return "Authorial Intent";
  if (p.includes("fact") && (p.includes("opinion") || p.includes("stated in the passage"))) return "Fact Retrieval";
  if (p.includes("according to the passage") || p.includes("the passage states")) return "Fact Retrieval";
  if (p.includes("overall message") || p.includes("overall purpose") || p.includes("central theme") || p.includes("main argument") || p.includes("overall theme") || p.includes("passage primarily about") || p.includes("passage serve")) return "Text Structure";
  return "Inference";
}

function parseDifficulty(raw: string): string {
  const upper = raw.toUpperCase().trim();
  if (upper.includes("HARD") || upper.includes("STRETCH")) return "hard";
  if (upper.includes("MODERATE")) return "medium";
  if (upper.includes("EASY")) return "easy";
  return "medium";
}

async function extractText(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

function parseContent(text: string): { passages: ParsedPassage[]; rawQuestions: { qNum: number; prompt: string; options: string[]; passageIdx: number }[]; answers: Map<number, { letter: string; explanation: string }> } {
  const lines = text.split("\n");
  const passages: ParsedPassage[] = [];
  const rawQuestions: { qNum: number; prompt: string; options: string[]; passageIdx: number }[] = [];
  const answers = new Map<number, { letter: string; explanation: string }>();

  let i = 0;
  let currentPassageIdx = -1;
  let inAnswerSection = false;
  let inQuestionSection = false;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    if (trimmed === "Answer Key & Explanations" || trimmed === "Quick Reference Grid" || trimmed.startsWith("Detailed Explanations")) {
      inAnswerSection = true;
      inQuestionSection = false;
      i++;
      continue;
    }

    if (inAnswerSection) {
      const gridMatches = [...trimmed.matchAll(/Q(\d+):\s*([A-D])/g)];
      for (const m of gridMatches) {
        const qNum = parseInt(m[1]);
        const letter = m[2];
        if (!answers.has(qNum)) {
          answers.set(qNum, { letter, explanation: "" });
        }
      }

      const explMatch = trimmed.match(/^Q(\d+)\s+Answer:\s*([A-D])\s+(.*)/);
      if (explMatch) {
        const qNum = parseInt(explMatch[1]);
        const letter = explMatch[2];
        const explanation = explMatch[3].trim();
        answers.set(qNum, { letter, explanation });
      }

      i++;
      continue;
    }

    const passageMatch = trimmed.match(/^PASSAGE\s+(\d+)\s*\|\s*([^|]+)\s*\|\s*(.+)/i);
    if (passageMatch) {
      const passageNum = parseInt(passageMatch[1]);
      const difficulty = parseDifficulty(passageMatch[2]);
      const genre = passageMatch[3].trim();

      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      const title = lines[i]?.trim() || `Passage ${passageNum}`;
      i++;

      const textLines: string[] = [];
      while (i < lines.length) {
        const tl = lines[i].trim();
        if (tl === "Questions" || tl === "Questions:") {
          inQuestionSection = true;
          break;
        }
        if (tl.match(/^PASSAGE\s+\d+\s*\|/i)) break;
        textLines.push(tl);
        i++;
      }

      const passageText = textLines
        .filter(l => l !== "")
        .join("\n\n");

      passages.push({
        passage_id: `P${passageNum}`,
        title,
        theme: genre,
        text: passageText,
        difficulty,
      });
      currentPassageIdx = passages.length - 1;

      if (i < lines.length && (lines[i].trim() === "Questions" || lines[i].trim() === "Questions:")) {
        i++;
      }
      continue;
    }

    const qMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (qMatch && currentPassageIdx >= 0 && !inAnswerSection) {
      const qNum = parseInt(qMatch[1]);
      let prompt = qMatch[2].trim();
      i++;

      while (i < lines.length && lines[i].trim() !== "" && !lines[i].trim().match(/^[A-D]\.\s+/) && !lines[i].trim().match(/^\d+\.\s+/)) {
        prompt += " " + lines[i].trim();
        i++;
      }

      const options: string[] = [];
      const optionLetters = ["A", "B", "C", "D"];
      for (const letter of optionLetters) {
        while (i < lines.length && lines[i].trim() === "") i++;
        if (i < lines.length) {
          const optMatch = lines[i].trim().match(new RegExp(`^${letter}\\.\\s+(.+)`));
          if (optMatch) {
            let optText = optMatch[1].trim();
            i++;
            while (i < lines.length && lines[i].trim() !== "" &&
                   !lines[i].trim().match(/^[A-D]\.\s+/) &&
                   !lines[i].trim().match(/^\d+\.\s+/) &&
                   !lines[i].trim().match(/^PASSAGE\s+\d+/i) &&
                   lines[i].trim() !== "Questions" &&
                   lines[i].trim() !== "Answer Key & Explanations") {
              optText += " " + lines[i].trim();
              i++;
            }
            options.push(optText);
          }
        }
      }

      if (options.length === 4) {
        rawQuestions.push({ qNum, prompt, options, passageIdx: currentPassageIdx });
      }
      continue;
    }

    i++;
  }

  return { passages, rawQuestions, answers };
}

async function main() {
  const file1 = path.resolve(__dirname, "../../attached_assets/11plus_passages_1_20_1773626850851.docx");
  const file2 = path.resolve(__dirname, "../../attached_assets/11plus_passages_21_40_1773626850852.docx");

  console.log("Extracting text from file 1 (Passages 1-20)...");
  const text1 = await extractText(file1);
  console.log(`  Extracted ${text1.length} characters`);
  const result1 = parseContent(text1);
  console.log(`  Found ${result1.passages.length} passages, ${result1.rawQuestions.length} questions, ${result1.answers.size} answers`);

  console.log("Extracting text from file 2 (Passages 21-40)...");
  const text2 = await extractText(file2);
  console.log(`  Extracted ${text2.length} characters`);
  const result2 = parseContent(text2);
  console.log(`  Found ${result2.passages.length} passages, ${result2.rawQuestions.length} questions, ${result2.answers.size} answers`);

  const allPassages = [...result1.passages, ...result2.passages];
  const allAnswers = new Map([...result1.answers, ...result2.answers]);

  const allQuestions: ParsedQuestion[] = [...result1.rawQuestions, ...result2.rawQuestions].map(q => {
    const passage = allPassages[q.passageIdx + (q.qNum > 300 ? result1.passages.length : 0)] || allPassages.find(p => p.passage_id === `P${Math.ceil(q.qNum / 15)}`);
    const actualPassage = q.passageIdx < (q.qNum <= 300 ? result1.passages.length : result2.passages.length) ? 
      (q.qNum <= 300 ? result1.passages : result2.passages)[q.passageIdx] : 
      allPassages[0];
    
    const answerData = allAnswers.get(q.qNum);
    const correctLetter = answerData?.letter || "A";

    return {
      question_id: `${actualPassage.passage_id}_Q${q.qNum}`,
      passage_id: actualPassage.passage_id,
      question_number: q.qNum,
      question_type: classifyQuestionType(q.prompt),
      difficulty: actualPassage.difficulty,
      question_text: q.prompt,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      correct_answer: correctLetter,
      explanation: answerData?.explanation || "",
      region_alignment: "Buckinghamshire",
      age_band: "10-11",
      qa_status: "approved",
      content_pool: "gl_comprehension",
    };
  });

  console.log(`\nTotal: ${allPassages.length} passages, ${allQuestions.length} questions`);

  const questionsWithExplanations = allQuestions.filter(q => q.explanation && q.explanation.length > 0);
  console.log(`Questions with explanations: ${questionsWithExplanations.length}`);

  const questionsByPassage = new Map<string, number>();
  for (const q of allQuestions) {
    questionsByPassage.set(q.passage_id, (questionsByPassage.get(q.passage_id) || 0) + 1);
  }
  console.log("\nQuestions per passage:");
  for (const [pid, count] of [...questionsByPassage.entries()].sort((a, b) => {
    const na = parseInt(a[0].replace("P", ""));
    const nb = parseInt(b[0].replace("P", ""));
    return na - nb;
  })) {
    const marker = count !== 15 ? ` *** UNEXPECTED` : "";
    console.log(`  ${pid}: ${count}${marker}`);
  }

  const typeBreakdown = new Map<string, number>();
  for (const q of allQuestions) {
    typeBreakdown.set(q.question_type, (typeBreakdown.get(q.question_type) || 0) + 1);
  }
  console.log("\nQuestion type breakdown:");
  for (const [type, count] of typeBreakdown) {
    console.log(`  ${type}: ${count}`);
  }

  const diffBreakdown = new Map<string, number>();
  for (const q of allQuestions) {
    diffBreakdown.set(q.difficulty, (diffBreakdown.get(q.difficulty) || 0) + 1);
  }
  console.log("\nDifficulty breakdown:");
  for (const [diff, count] of diffBreakdown) {
    console.log(`  ${diff}: ${count}`);
  }

  const outDir = __dirname;
  fs.writeFileSync(path.join(outDir, "passages.json"), JSON.stringify(allPassages, null, 2));
  fs.writeFileSync(path.join(outDir, "questions.json"), JSON.stringify(allQuestions, null, 2));
  console.log(`\nWrote passages.json and questions.json to ${outDir}`);
}

main().catch(err => {
  console.error("Parse failed:", err);
  process.exit(1);
});

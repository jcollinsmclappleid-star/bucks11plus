import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Passage {
  passage_id: string;
  title: string;
  theme: string;
  text: string;
}

interface Question {
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

const srcPath = path.resolve(__dirname, "../../attached_assets/Pasted--100-ENGLISH-COMPREHENSION-1773111179717_1773111179717.txt");
const raw = fs.readFileSync(srcPath, "utf-8");
const lines = raw.split("\n");

const passages: Passage[] = [];
const questions: Question[] = [];

function isSeparator(line: string): boolean {
  const t = line.trim();
  return t.length > 5 && /^[─\-═]+$/.test(t);
}

function isPassageHeader(line: string): RegExpMatchArray | null {
  return line.match(/^PASSAGE\s+(\d+)\s+\|\s+(.+)$/);
}

function isQuestionHeader(line: string): RegExpMatchArray | null {
  return line.match(/^Q(\d+)\s+\[(.+?)\s*\|\s*(.+?)\]\s*$/);
}

let i = 0;

while (i < lines.length) {
  const phMatch = isPassageHeader(lines[i]);
  if (!phMatch) { i++; continue; }

  const passageNum = parseInt(phMatch[1]);
  const theme = phMatch[2].trim();
  const passageId = `P${passageNum}`;

  i++;
  let title = "";
  while (i < lines.length && isSeparator(lines[i])) i++;
  if (i < lines.length && !lines[i].startsWith("PASSAGE TEXT:")) {
    title = lines[i].trim().replace(/^[\u201c"]+|[\u201d"]+$/g, "");
    i++;
  }

  while (i < lines.length && !lines[i].startsWith("PASSAGE TEXT:")) i++;
  i++;
  while (i < lines.length && lines[i].trim() === "") i++;

  const textLines: string[] = [];
  while (i < lines.length && !isSeparator(lines[i])) {
    textLines.push(lines[i]);
    i++;
  }
  while (textLines.length > 0 && textLines[textLines.length - 1].trim() === "") textLines.pop();
  const passageText = textLines.join("\n").trim();

  passages.push({ passage_id: passageId, title, theme, text: passageText });

  while (i < lines.length && !isQuestionHeader(lines[i])) i++;

  while (i < lines.length) {
    const qMatch = isQuestionHeader(lines[i]);
    if (!qMatch) break;

    const qNum = parseInt(qMatch[1]);
    const questionType = qMatch[2].trim();
    const difficulty = qMatch[3].trim().toLowerCase();
    const questionId = `${passageId}_Q${((qNum - 1) % 5) + 1}`;

    i++;
    while (i < lines.length && lines[i].trim() === "") i++;

    const promptLines: string[] = [];
    while (i < lines.length && !lines[i].match(/^[A-D]\)\s/)) {
      promptLines.push(lines[i]);
      i++;
    }
    while (promptLines.length > 0 && promptLines[promptLines.length - 1].trim() === "") promptLines.pop();
    const questionText = promptLines.join("\n").trim();

    const options: Record<string, string> = {};
    for (const letter of ["A", "B", "C", "D"]) {
      if (i < lines.length && lines[i].match(new RegExp(`^${letter}\\)\\s`))) {
        options[letter] = lines[i].replace(new RegExp(`^${letter}\\)\\s+`), "").replace(/\s*✓\s*$/, "").trim();
        i++;
      }
    }

    while (i < lines.length && lines[i].trim() === "") i++;

    let correctAnswer = "";
    if (i < lines.length && lines[i].startsWith("ANSWER:")) {
      correctAnswer = lines[i].replace("ANSWER:", "").trim();
      i++;
    }

    let explanation = "";
    if (i < lines.length && lines[i].startsWith("EXPLANATION:")) {
      const explanationLines: string[] = [lines[i].replace("EXPLANATION:", "").trim()];
      i++;
      while (i < lines.length && lines[i].trim() !== "" && !isQuestionHeader(lines[i]) && !isSeparator(lines[i]) && !isPassageHeader(lines[i]) && !lines[i].startsWith("# =")) {
        explanationLines.push(lines[i].trim());
        i++;
      }
      explanation = explanationLines.join(" ").trim();
    }

    while (i < lines.length && lines[i].trim() === "") i++;

    questions.push({
      question_id: questionId,
      passage_id: passageId,
      question_number: qNum,
      question_type: questionType,
      difficulty,
      question_text: questionText,
      option_a: options["A"] || "",
      option_b: options["B"] || "",
      option_c: options["C"] || "",
      option_d: options["D"] || "",
      correct_answer: correctAnswer,
      explanation,
      region_alignment: "GL_Bucks",
      age_band: "Y6",
      qa_status: "approved",
      content_pool: "comprehension_100",
    });
  }
}

console.log(`Parsed ${passages.length} passages and ${questions.length} questions`);

if (passages.length !== 20) {
  console.error(`ERROR: Expected 20 passages, got ${passages.length}`);
  process.exit(1);
}
if (questions.length !== 100) {
  console.error(`ERROR: Expected 100 questions, got ${questions.length}`);
  process.exit(1);
}

for (const q of questions) {
  if (!q.option_a || !q.option_b || !q.option_c || !q.option_d) {
    console.error(`ERROR: Missing options for ${q.question_id}: A="${q.option_a}" B="${q.option_b}" C="${q.option_c}" D="${q.option_d}"`);
    process.exit(1);
  }
  if (!["A", "B", "C", "D"].includes(q.correct_answer)) {
    console.error(`ERROR: Invalid correct_answer "${q.correct_answer}" for ${q.question_id}`);
    process.exit(1);
  }
  if (!q.explanation) {
    console.error(`ERROR: Missing explanation for ${q.question_id}`);
    process.exit(1);
  }
}

const outDir = path.resolve(__dirname);
fs.writeFileSync(path.join(outDir, "passages.json"), JSON.stringify(passages, null, 2));
fs.writeFileSync(path.join(outDir, "questions.json"), JSON.stringify(questions, null, 2));

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const csvHeader = [
  "passage_id", "title", "theme", "text", "question_id", "question_number",
  "question_type", "difficulty", "question_text", "option_a", "option_b",
  "option_c", "option_d", "correct_answer", "explanation",
  "region_alignment", "age_band", "qa_status", "content_pool"
].join(",");

const csvRows = questions.map(q => {
  const p = passages.find(p => p.passage_id === q.passage_id)!;
  return [
    q.passage_id, p.title, p.theme, p.text, q.question_id, String(q.question_number),
    q.question_type, q.difficulty, q.question_text, q.option_a, q.option_b,
    q.option_c, q.option_d, q.correct_answer, q.explanation,
    q.region_alignment, q.age_band, q.qa_status, q.content_pool
  ].map(csvEscape).join(",");
});

fs.writeFileSync(path.join(outDir, "questions.csv"), [csvHeader, ...csvRows].join("\n"));

console.log("Written: passages.json, questions.json, questions.csv");
console.log(`Sample passage: ${passages[0].passage_id} "${passages[0].title}" (${passages[0].theme})`);
console.log(`Sample question: ${questions[0].question_id} [${questions[0].question_type}|${questions[0].difficulty}] => ${questions[0].correct_answer}`);

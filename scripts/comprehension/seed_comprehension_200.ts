import { db } from "../../server/db";
import { questions } from "../../shared/schema";
import { sql } from "drizzle-orm";

const PASSAGES = [
  { id: 1, title: "Ancient Bridge" },
  { id: 2, title: "Forest Clearing" },
  { id: 3, title: "Mountain Storm" },
  { id: 4, title: "River Journey" },
  { id: 5, title: "Old Lighthouse" },
  { id: 6, title: "Desert Caravan" },
  { id: 7, title: "Busy Harbour" },
  { id: 8, title: "Snowy Village" },
  { id: 9, title: "Wild Horses" },
  { id: 10, title: "Deep Cave" },
  { id: 11, title: "Beehive Colony" },
  { id: 12, title: "City Park" },
  { id: 13, title: "Abandoned Railway" },
  { id: 14, title: "Volcano Island" },
  { id: 15, title: "Scientist's Lab" },
  { id: 16, title: "Ancient Library" },
  { id: 17, title: "Stormy Sea" },
  { id: 18, title: "Desert Oasis" },
  { id: 19, title: "Night Market" },
  { id: 20, title: "Ancient Temple" },
  { id: 21, title: "Arctic Expedition" },
  { id: 22, title: "Rainforest Trail" },
  { id: 23, title: "Hidden Waterfall" },
  { id: 24, title: "Farm Harvest" },
  { id: 25, title: "Coastal Cliffs" },
  { id: 26, title: "Space Observatory" },
  { id: 27, title: "Ancient Ruins" },
  { id: 28, title: "Glacier Valley" },
  { id: 29, title: "Inventor's Workshop" },
  { id: 30, title: "Tropical Reef" },
  { id: 31, title: "Woodland Trail" },
  { id: 32, title: "Historic Castle" },
  { id: 33, title: "Island Village" },
  { id: 34, title: "Storm Watchtower" },
  { id: 35, title: "River Delta" },
  { id: 36, title: "Wild Meadow" },
  { id: 37, title: "Mountain Observatory" },
  { id: 38, title: "Ancient Road" },
  { id: 39, title: "Harbour Lighthouse" },
  { id: 40, title: "Forest Research Station" },
];

function passageText(title: string): string {
  const subject = `The ${title.toLowerCase()}`;
  return `${subject} had been part of the landscape for many years. Visitors often noticed how quiet the area felt, yet careful observers could see small signs of life everywhere. Birds moved between trees, insects buzzed softly, and the wind carried distant sounds across the land. Although the place seemed ordinary at first, people who spent time there often discovered interesting details they had never noticed before.`;
}

const QUESTION_TEMPLATES = [
  {
    prompt: "What is mainly being described in the passage?",
    options: ["A busy city street", "A quiet natural place", "A classroom", "A marketplace"],
    correctAnswer: "A quiet natural place",
    skillId: "comp.main_idea",
    type: "main_idea",
    difficulty: "easy" as const,
  },
  {
    prompt: "What does the word 'observers' most nearly mean?",
    options: ["People who watch carefully", "People who run quickly", "People who write books", "People who travel far"],
    correctAnswer: "People who watch carefully",
    skillId: "comp.vocabulary",
    type: "vocabulary_in_context",
    difficulty: "easy" as const,
  },
  {
    prompt: "What detail suggests the place is full of life?",
    options: ["The buildings nearby", "The insects and birds mentioned", "The road outside", "The loud engines"],
    correctAnswer: "The insects and birds mentioned",
    skillId: "comp.detail",
    type: "detail_retrieval",
    difficulty: "medium" as const,
  },
  {
    prompt: "Why might visitors discover new details over time?",
    options: ["Because the place changes every hour", "Because careful attention reveals more", "Because people tell them", "Because signs explain everything"],
    correctAnswer: "Because careful attention reveals more",
    skillId: "comp.inference",
    type: "inference",
    difficulty: "medium" as const,
  },
  {
    prompt: "What mood does the writer mainly create?",
    options: ["Peaceful curiosity", "Fear and danger", "Loud excitement", "Anger"],
    correctAnswer: "Peaceful curiosity",
    skillId: "comp.mood",
    type: "mood_and_tone",
    difficulty: "hard" as const,
  },
];

const DIFFICULTY_TIME: Record<string, number> = { easy: 60, medium: 90, hard: 120 };
const DIFFICULTY_COG: Record<string, number> = { easy: 2, medium: 3, hard: 4 };

async function seedComprehension200() {
  const forceReseed = process.argv.includes("--force");

  const existing = await db.select({ id: questions.id }).from(questions)
    .where(sql`section = 'English Comprehension' AND id LIKE 'comp200-%'`);

  if (existing.length > 0 && !forceReseed) {
    console.log(`Already have ${existing.length} comprehension-200 questions. Use --force to replace.`);
    process.exit(0);
  }

  if (forceReseed && existing.length > 0) {
    console.log(`Force mode: deleting ${existing.length} existing comprehension-200 questions...`);
    await db.delete(questions).where(sql`section = 'English Comprehension' AND id LIKE 'comp200-%'`);
  }

  const allValues: any[] = [];

  for (const passage of PASSAGES) {
    const text = passageText(passage.title);
    for (let qi = 0; qi < QUESTION_TEMPLATES.length; qi++) {
      const tmpl = QUESTION_TEMPLATES[qi];
      allValues.push({
        id: `comp200-p${passage.id}-q${qi + 1}`,
        section: "English Comprehension",
        type: tmpl.type,
        prompt: tmpl.prompt,
        options: tmpl.options,
        correctAnswer: tmpl.correctAnswer,
        difficulty: tmpl.difficulty,
        timeExpected: DIFFICULTY_TIME[tmpl.difficulty],
        orderIndex: (passage.id - 1) * 5 + qi,
        skillId: tmpl.skillId,
        subRuleId: `p200_${passage.id}_${tmpl.type}`,
        renderType: "comprehension",
        renderConfig: {
          kind: "comprehension.passage",
          passageId: `P200_${passage.id}`,
          passageTitle: passage.title,
          passageTheme: passage.title.toLowerCase().replace(/'/g, ""),
          passageText: text,
          questionType: tmpl.type,
          questionIndex: qi,
          totalQuestionsInPassage: 5,
        },
        trapTypes: [] as string[],
        cognitiveLoad: DIFFICULTY_COG[tmpl.difficulty],
        locale: "en-GB",
        britishSpelling: true,
        version: 1,
        qualityScore: 5,
        qaStatus: "approved",
        estTimeSeconds: DIFFICULTY_TIME[tmpl.difficulty],
        explanation: "",
      });
    }
  }

  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < allValues.length; i += batchSize) {
    const batch = allValues.slice(i, i + batchSize);
    await db.insert(questions).values(batch as any);
    inserted += batch.length;
    process.stdout.write(`\rInserted ${inserted}/${allValues.length}`);
  }

  console.log(`\nDone. Inserted ${inserted} English Comprehension questions across ${PASSAGES.length} passages.`);
  process.exit(0);
}

seedComprehension200().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});

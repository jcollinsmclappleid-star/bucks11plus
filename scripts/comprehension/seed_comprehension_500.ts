import { db } from "../../server/db";
import { questions } from "../../shared/schema";
import { sql } from "drizzle-orm";

const PASSAGE_TITLES: string[] = [
  "Ancient Bridge",
  "Forest Reserve",
  "Mountain Railway",
  "Coastal Lighthouse",
  "Desert Expedition",
  "Busy Harbour",
  "Snowy Village",
  "Wild Horse Valley",
  "Deep Cave System",
  "Beehive Colony",
  "City Botanical Garden",
  "Abandoned Railway",
  "Volcano Island",
  "Science Laboratory",
  "Historic Library",
  "Stormy Sea Crossing",
  "Desert Oasis",
  "Night Market",
  "Ancient Temple",
  "Arctic Expedition",
  "Rainforest Trail",
  "Hidden Waterfall",
  "Farm Harvest Season",
  "Coastal Cliffs",
  "Space Observatory",
  "Ancient Ruins",
  "Glacier Valley",
  "Inventor Workshop",
  "Tropical Coral Reef",
  "Woodland Trail",
  "Historic Castle",
  "Island Fishing Village",
  "Storm Watchtower",
  "River Delta Wetlands",
  "Wildflower Meadow",
  "Mountain Observatory",
  "Ancient Trade Road",
  "Harbour Lighthouse",
  "Forest Research Station",
];

function getPassageTitle(passageNum: number): string {
  return PASSAGE_TITLES[(passageNum - 1) % PASSAGE_TITLES.length];
}

function passageText(title: string): string {
  const subject = `The ${title.toLowerCase()}`;
  return `${subject} had existed for generations, quietly shaping the lives of people who passed nearby. Many travellers overlooked it because nothing dramatic seemed to happen there at first glance. However, careful observers often noticed patterns others missed. Changes in light, subtle movements among animals, and shifts in weather revealed how complex the surrounding environment really was. For this reason, historians and scientists sometimes studied the ${title.toLowerCase()} closely. What appeared ordinary could reveal surprising insights about how nature, history and human activity connect over time.`;
}

interface QuestionTemplate {
  prompt: string;
  options: string[];
  correctAnswer: string;
  skillId: string;
  type: string;
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    prompt: "What is the main idea of the passage?",
    options: [
      "It describes an overlooked place with hidden significance",
      "It explains how to build something",
      "It describes a busy city",
      "It focuses on a dangerous event",
    ],
    correctAnswer: "It describes an overlooked place with hidden significance",
    skillId: "comp.main_idea",
    type: "main_idea",
  },
  {
    prompt: "What does the passage suggest about careful observers?",
    options: [
      "They notice details others ignore",
      "They travel faster than others",
      "They avoid natural places",
      "They dislike change",
    ],
    correctAnswer: "They notice details others ignore",
    skillId: "comp.inference",
    type: "inference",
  },
  {
    prompt: "Why might many travellers miss the importance of the place?",
    options: [
      "They assume nothing interesting is happening",
      "They are forbidden to look",
      "They cannot see properly",
      "They already know everything",
    ],
    correctAnswer: "They assume nothing interesting is happening",
    skillId: "comp.detail",
    type: "detail_retrieval",
  },
  {
    prompt: "What does the word 'subtle' most nearly mean in the passage?",
    options: [
      "Not obvious but noticeable with attention",
      "Very loud",
      "Extremely large",
      "Bright and colourful",
    ],
    correctAnswer: "Not obvious but noticeable with attention",
    skillId: "comp.vocabulary",
    type: "vocabulary_in_context",
  },
  {
    prompt: "Why do historians or scientists study places like this?",
    options: [
      "Because ordinary places can reveal important patterns",
      "Because they are easy to ignore",
      "Because they are always dangerous",
      "Because they contain treasure",
    ],
    correctAnswer: "Because ordinary places can reveal important patterns",
    skillId: "comp.mood",
    type: "mood_and_tone",
  },
];

const DIFFICULTY_TIME: Record<string, number> = { hard: 120, medium: 90 };
const DIFFICULTY_COG: Record<string, number> = { hard: 4, medium: 3 };

async function seedComprehension500() {
  const forceReseed = process.argv.includes("--force");

  const existing = await db
    .select({ id: questions.id })
    .from(questions)
    .where(sql`section = 'English Comprehension' AND id LIKE 'comp500-%'`);

  if (existing.length > 0 && !forceReseed) {
    console.log(
      `Already have ${existing.length} comprehension-500 questions. Use --force to replace.`
    );
    process.exit(0);
  }

  if (forceReseed && existing.length > 0) {
    console.log(
      `Force mode: deleting ${existing.length} existing comprehension-500 questions...`
    );
    await db
      .delete(questions)
      .where(sql`section = 'English Comprehension' AND id LIKE 'comp500-%'`);
  }

  const allValues: any[] = [];
  const totalPassages = 100;

  for (let p = 1; p <= totalPassages; p++) {
    const title = getPassageTitle(p);
    const text = passageText(title);
    const difficulty = p <= 70 ? "hard" : "medium";

    for (let qi = 0; qi < QUESTION_TEMPLATES.length; qi++) {
      const tmpl = QUESTION_TEMPLATES[qi];
      const qNum = (p - 1) * 5 + qi + 1;

      allValues.push({
        id: `comp500-p${p}-q${qi + 1}`,
        section: "English Comprehension",
        type: tmpl.type,
        prompt: tmpl.prompt,
        options: tmpl.options,
        correctAnswer: tmpl.correctAnswer,
        difficulty,
        timeExpected: DIFFICULTY_TIME[difficulty],
        orderIndex: 1000 + (p - 1) * 5 + qi,
        skillId: tmpl.skillId,
        subRuleId: `p500_${p}_${tmpl.type}`,
        renderType: "comprehension",
        renderConfig: {
          kind: "comprehension.passage",
          passageId: `P500_${p}`,
          passageTitle: title,
          passageTheme: title.toLowerCase().replace(/'/g, ""),
          passageText: text,
          questionType: tmpl.type,
          questionIndex: qi,
          totalQuestionsInPassage: 5,
        },
        trapTypes: [] as string[],
        cognitiveLoad: DIFFICULTY_COG[difficulty],
        locale: "en-GB",
        britishSpelling: true,
        version: 1,
        qualityScore: 5,
        qaStatus: "approved",
        estTimeSeconds: DIFFICULTY_TIME[difficulty],
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

  console.log(
    `\nDone. Inserted ${inserted} English Comprehension questions (500) across ${totalPassages} passages.`
  );
  console.log(`  - ${70 * 5} Hard questions (passages 1-70)`);
  console.log(`  - ${30 * 5} Moderate/Medium questions (passages 71-100)`);
  process.exit(0);
}

seedComprehension500().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

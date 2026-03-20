import { db } from "./db";
import { diagnostics, questions, articles, practiceSections, users } from "@shared/schema";
import { sql, eq, and, isNotNull, ne, asc, inArray, notInArray } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import type { NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig } from "@shared/contentTypes";
import { FULL_FREE_POOL_QUESTIONS } from "./freePoolData";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

const S = { strokeWidth: 3, stroke: "#111827", fill: "none" as const };
const SF = { strokeWidth: 3, stroke: "#111827", fill: "solid" as const };

const nvrSvgQuestions: Array<{
  prompt: string;
  options: string[];
  correct: string;
  section: string;
  renderType: "svg";
  renderConfig: NvrSequenceConfig | NvrTransformConfig | NvrClassificationConfig;
}> = [
  {
    prompt: "Which shape completes the sequence?",
    options: ["A", "B", "C", "D"],
    correct: "C",
    section: "Non-Verbal Reasoning",
    renderType: "svg",
    renderConfig: {
      kind: "nvr.sequence",
      frames: [
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 0, style: S }] },
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 90, style: S }] },
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 180, style: S }] },
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 270, style: S }] },
      ],
      questionIndex: 3,
      answerOptions: [
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 0, style: S }] },
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 180, style: S }] },
        { elements: [{ type: "shape", shape: "triangle", x: 50, y: 50, size: 40, rotation: 270, style: S }] },
        { elements: [{ type: "shape", shape: "square", x: 50, y: 50, size: 40, rotation: 0, style: S }] },
      ],
    },
  },
  {
    prompt: "Find the odd one out.",
    options: ["A", "B", "C", "D"],
    correct: "D",
    section: "Non-Verbal Reasoning",
    renderType: "svg",
    renderConfig: {
      kind: "nvr.classification",
      group: [],
      answerOptions: [
        { elements: [{ type: "shape", shape: "circle", x: 50, y: 50, size: 36, rotation: 0, style: S }] },
        { elements: [{ type: "shape", shape: "circle", x: 50, y: 50, size: 28, rotation: 0, style: S }] },
        { elements: [{ type: "shape", shape: "circle", x: 50, y: 50, size: 44, rotation: 0, style: S }] },
        { elements: [{ type: "shape", shape: "pentagon", x: 50, y: 50, size: 36, rotation: 0, style: S }] },
      ],
    },
  },
  {
    prompt: "Which figure comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correct: "B",
    section: "Non-Verbal Reasoning",
    renderType: "svg",
    renderConfig: {
      kind: "nvr.sequence",
      frames: [
        { elements: [
          { type: "shape", shape: "square", x: 30, y: 50, size: 20, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "square", x: 25, y: 50, size: 20, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 55, y: 50, size: 20, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "square", x: 20, y: 50, size: 20, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 50, y: 50, size: 20, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 80, y: 50, size: 20, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "square", x: 15, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 38, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 61, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 84, y: 50, size: 16, rotation: 0, style: SF },
        ] },
      ],
      questionIndex: 3,
      answerOptions: [
        { elements: [
          { type: "shape", shape: "square", x: 25, y: 50, size: 20, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 55, y: 50, size: 20, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 85, y: 50, size: 20, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "square", x: 15, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 38, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 61, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "square", x: 84, y: 50, size: 16, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "circle", x: 25, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "circle", x: 50, y: 50, size: 16, rotation: 0, style: SF },
          { type: "shape", shape: "circle", x: 75, y: 50, size: 16, rotation: 0, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "square", x: 50, y: 50, size: 40, rotation: 0, style: SF },
        ] },
      ],
    },
  },
  {
    prompt: "Which shape is the mirror image of the given shape?",
    options: ["A", "B", "C", "D"],
    correct: "B",
    section: "Non-Verbal Reasoning",
    renderType: "svg",
    renderConfig: {
      kind: "nvr.transform",
      promptFrames: [
        { elements: [
          { type: "shape", shape: "arrow", x: 35, y: 50, size: 30, rotation: 45, style: S },
          { type: "dot", x: 65, y: 30, r: 5, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "arrow", x: 65, y: 50, size: 30, rotation: -45, style: S },
          { type: "dot", x: 35, y: 30, r: 5, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "star", x: 35, y: 50, size: 30, rotation: 0, style: S },
          { type: "dot", x: 70, y: 30, r: 5, style: SF },
        ] },
      ],
      answerOptions: [
        { elements: [
          { type: "shape", shape: "star", x: 65, y: 50, size: 30, rotation: 0, style: S },
          { type: "dot", x: 35, y: 70, r: 5, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "star", x: 65, y: 50, size: 30, rotation: 0, style: S },
          { type: "dot", x: 30, y: 30, r: 5, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "star", x: 35, y: 50, size: 30, rotation: 90, style: S },
          { type: "dot", x: 70, y: 30, r: 5, style: SF },
        ] },
        { elements: [
          { type: "shape", shape: "pentagon", x: 65, y: 50, size: 30, rotation: 0, style: S },
          { type: "dot", x: 30, y: 30, r: 5, style: SF },
        ] },
      ],
    },
  },
];

export async function ensurePracticePaperDiagnostics() {
  const practicePapers = [
    {
      id: "practice-quick",
      title: "Quick Practice Paper",
      subtitle: "A fast 20-question paper with fresh questions each time",
      type: "practice_paper",
      duration: 15,
      questionCount: 20,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "practice-full",
      title: "Full Practice Paper",
      subtitle: "A complete 40-question paper — unique every time",
      type: "practice_paper",
      duration: 30,
      questionCount: 40,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "practice-mock",
      title: "Mock Exam Paper",
      subtitle: "50-question exam simulation with fresh questions each attempt",
      type: "practice_paper",
      duration: 35,
      questionCount: 50,
      requiredTier: "programme16",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
  ];

  for (const paper of practicePapers) {
    const [existing] = await db.select().from(diagnostics).where(sql`${diagnostics.id} = ${paper.id}`);
    if (!existing) {
      await db.insert(diagnostics).values(paper);
      console.log(`Inserted practice paper diagnostic: ${paper.id}`);
    }
  }
}

async function syncDiagnosticTimings() {
  const timingUpdates: Record<string, { duration: number; subtitle?: string }> = {
    "mini-1": { duration: 8, subtitle: "Quick 8-minute assessment across core GL-style reasoning" },
    "full-a": { duration: 30, subtitle: "Complete 30-minute assessment mirroring GL exam pacing" },
    "full-b": { duration: 30 },
    "mock-1": { duration: 35, subtitle: "Exam-day simulation under real GL pacing" },
    "practice-quick": { duration: 15 },
    "practice-full": { duration: 30 },
    "practice-mock": { duration: 35 },
  };
  for (const [id, upd] of Object.entries(timingUpdates)) {
    const setData: any = { duration: upd.duration };
    if (upd.subtitle) setData.subtitle = upd.subtitle;
    await db.update(diagnostics).set(setData).where(eq(diagnostics.id, id));
  }
}

async function ensureComprehensionSection() {
  const allDiags = await db.select({ id: diagnostics.id, sections: diagnostics.sections }).from(diagnostics);
  for (const d of allDiags) {
    const sections = d.sections as string[];
    if (!sections.includes("English Comprehension")) {
      await db.update(diagnostics).set({ sections: [...sections, "English Comprehension"] }).where(eq(diagnostics.id, d.id));
    }
  }

  const [existingComp] = await db.select({ count: sql<number>`count(*)` }).from(practiceSections)
    .where(sql`category = 'English Comprehension'`);
  if (existingComp.count === 0) {
    await db.insert(practiceSections).values([
      { title: "Fact Retrieval", category: "English Comprehension", icon: "FileText", difficulty: "Easy", questionCount: 15, requiredTier: "free", skillId: "comp.fact_retrieval" },
      { title: "Vocabulary in Context", category: "English Comprehension", icon: "BookOpen", difficulty: "Medium", questionCount: 12, requiredTier: "free", skillId: "comp.vocabulary" },
      { title: "Inference & Deduction", category: "English Comprehension", icon: "Lightbulb", difficulty: "Medium", questionCount: 12, requiredTier: "pack12", skillId: "comp.inference" },
      { title: "Mood & Tone", category: "English Comprehension", icon: "Palette", difficulty: "Hard", questionCount: 10, requiredTier: "pack12", skillId: "comp.mood" },
      { title: "Detail Retrieval", category: "English Comprehension", icon: "Search", difficulty: "Medium", questionCount: 12, requiredTier: "pack12", skillId: "comp.detail" },
      { title: "Advanced Comprehension", category: "English Comprehension", icon: "GraduationCap", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "comp.main_idea" },
    ]);
    console.log("Inserted comprehension practice sections.");
  }
}

export async function repairSeedQuestions() {
  const seedIdPattern = sql`(id LIKE 'mini-q-%' OR id LIKE 'full-a-q-%' OR id LIKE 'full-b-q-%' OR id LIKE 'mock-%')`;

  const approveResult = await db
    .update(questions)
    .set({ qaStatus: "approved" })
    .where(and(eq(questions.qaStatus, "draft"), seedIdPattern));
  const approved = (approveResult as any).rowCount ?? 0;
  if (approved > 0) {
    console.log(`✓ Repaired ${approved} seed questions (draft → approved)`);
  }

  // Directly mark mini-1 seed questions as free pool (they lack skillId so ensureFreePool skips them)
  const freePoolResult = await db
    .update(questions)
    .set({ freePool: true })
    .where(
      and(
        sql`id LIKE 'mini-q-%'`,
        eq(questions.freePool, false),
        eq(questions.qaStatus, "approved"),
      ),
    );
  const markedFreePool = (freePoolResult as any).rowCount ?? 0;
  if (markedFreePool > 0) {
    console.log(`✓ Marked ${markedFreePool} mini-1 seed questions as free pool`);
  }
}

const P33_TEXT = `The river had been running through the town for longer than the town had existed, and it had seen everything that the river's position allowed it to see: the building of the mill, the burning of the mill, the building of the houses, and the slow weathering of the houses into the kinds of homes that required more maintenance than anyone could reliably provide. It had seen the bridge go up and had watched a series of councils argue about whether to repair or replace it for forty years.\n\nNone of this had made the river wise. It had simply made the river old.\n\nEleven-year-old Jonah had been told that the river was dangerous. He had been told this so many times, in so many combinations of urgency and offhandedness, that the danger had become entirely abstract — a piece of knowledge he carried but did not feel. He sat on the bank with his shoes off, watching the surface of the water, which moved with the unhurried confidence of something that had decided where it was going a very long time ago.\n\nThe surface was brown and unremarkable. But under it, in the parts too deep to see clearly, there was movement of a different kind: the dark drift of something going somewhere that had nothing to do with Jonah or the town or any of the things that occupied the small, urgent geography of his daily life.\n\nThis, he thought, was what was interesting about rivers. They didn't care.`;

const P34_TEXT = `Pain is one of the few things in human experience that is simultaneously universal and essentially private. Every person has felt pain. No person can feel another's. This asymmetry sits at the centre of one of medicine's most persistent problems: how to measure, communicate, and treat something that is, by its nature, accessible only to the person experiencing it.\n\nThe standard clinical tool for pain measurement is the numerical scale: the patient is asked to rate pain from zero to ten. Its simplicity is its virtue and its limitation. What it measures is not pain but a patient's willingness and ability to assign a number — a translation from private experience to public symbol that is mediated by language, culture, expectation, and the particular relationship between the patient and the clinician asking the question. A ten for one patient may represent a different experience from a ten for another.\n\nAttempts to develop more objective measures have been ongoing. Researchers have identified patterns of neural activity in the brain associated with pain states; imaging technology can detect physiological indicators. But the gap between physical correlates and the experience of pain — what philosophers call the 'hard problem' — remains open. We can measure what the brain does when in pain. We cannot measure what it is like.\n\nA related problem affects those who cannot communicate pain verbally: infants, those with certain neurological conditions, people at the end of life. For these groups, assessment depends on observable behaviours — facial expression, body position, physiological changes. The tools developed for this purpose are careful and extensively validated. They are also, at their root, interpretations of external signs rather than reports of internal states.\n\nThe language of pain is private. Medicine is trying, with considerable ingenuity and partial success, to translate it.`;

async function seedCoreComprehensionQuestions() {
  const seeds = [
    {
      id: "comp-p33-q479",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "medium",
      prompt: "What does 'the river had seen everything that the river's position allowed it to see' suggest?",
      options: [
        "Rivers are useful historical witnesses because they remain fixed while the world changes around them",
        "The writer is using personification to give the river human qualities of observation",
        "The river has limited but continuous knowledge — it has seen what has passed before it over many centuries",
        "Rivers remember the history of the places they flow through",
      ],
      correctAnswer: "The river has limited but continuous knowledge — it has seen what has passed before it over many centuries",
      renderConfig: { kind: "comprehension.passage", passageId: "P33", passageText: P33_TEXT, passageTheme: "LITERARY FICTION", passageTitle: "What the River Knows", questionType: "Inference", questionIndex: 0, totalQuestionsInPassage: 14 },
    },
    {
      id: "comp-p33-q481",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "medium",
      prompt: "What does 'the danger had become entirely abstract' tell us about Jonah's relationship to the warning?",
      options: [
        "Repeated warnings without experience have drained the danger of its felt reality",
        "He is unable to understand what danger means because he is too young",
        "He understands the danger intellectually but has chosen to ignore it",
        "Abstract thinking is a sign of intelligence in an eleven-year-old",
      ],
      correctAnswer: "Repeated warnings without experience have drained the danger of its felt reality",
      renderConfig: { kind: "comprehension.passage", passageId: "P33", passageText: P33_TEXT, passageTheme: "LITERARY FICTION", passageTitle: "What the River Knows", questionType: "Inference", questionIndex: 2, totalQuestionsInPassage: 14 },
    },
    {
      id: "comp-p33-q483",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "medium",
      prompt: "What does the contrast between the surface and what lies beneath the water suggest?",
      options: [
        "Rivers are deceptive — their visible surface conceals hidden dangers",
        "Deep water is more dangerous than shallow water and Jonah should be more careful",
        "The surface is the ordinary world; beneath it is something indifferent and apart from human concerns",
        "Underwater movement is more interesting to observe than surface movement",
      ],
      correctAnswer: "The surface is the ordinary world; beneath it is something indifferent and apart from human concerns",
      renderConfig: { kind: "comprehension.passage", passageId: "P33", passageText: P33_TEXT, passageTheme: "LITERARY FICTION", passageTitle: "What the River Knows", questionType: "Inference", questionIndex: 4, totalQuestionsInPassage: 14 },
    },
    {
      id: "comp-p34-q493",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "hard",
      prompt: "What does 'simultaneously universal and essentially private' mean in the context of pain?",
      options: [
        "Pain is experienced by all humans but is accessible only to the individual experiencing it",
        "Everyone experiences pain the same way but each person describes it differently",
        "Pain is a public health issue affecting everyone but treatment is privately administered",
        "The universality of pain makes it easier to study than more private experiences",
      ],
      correctAnswer: "Pain is experienced by all humans but is accessible only to the individual experiencing it",
      renderConfig: { kind: "comprehension.passage", passageId: "P34", passageText: P34_TEXT, passageTheme: "SCIENCE WRITING", passageTitle: "The Language of Pain", questionType: "Inference", questionIndex: 0, totalQuestionsInPassage: 14 },
    },
    {
      id: "comp-p34-q494",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "hard",
      prompt: "What does the passage identify as the virtue and limitation of the numerical pain scale?",
      options: [
        "It is quick to administer but requires patients to understand numbers",
        "Simplicity makes it accessible but means it measures a translation rather than the experience itself",
        "Its simplicity makes it easy to use but its numerical nature makes it culture-dependent",
        "It is universally accepted but gives clinicians only a single data point to work with",
      ],
      correctAnswer: "Simplicity makes it accessible but means it measures a translation rather than the experience itself",
      renderConfig: { kind: "comprehension.passage", passageId: "P34", passageText: P34_TEXT, passageTheme: "SCIENCE WRITING", passageTitle: "The Language of Pain", questionType: "Inference", questionIndex: 1, totalQuestionsInPassage: 14 },
    },
    {
      id: "comp-p34-q495",
      section: "English Comprehension",
      type: "comprehension",
      skillId: "comp.inference",
      difficulty: "hard",
      prompt: "What does 'a translation from private experience to public symbol' describe?",
      options: [
        "The process of a patient answering questions about their symptoms",
        "The way doctors translate medical information into language patients can understand",
        "The act of assigning a number to pain — converting an internal experience into an external sign",
        "The conversion of physical pain signals into mental awareness by the brain",
      ],
      correctAnswer: "The act of assigning a number to pain — converting an internal experience into an external sign",
      renderConfig: { kind: "comprehension.passage", passageId: "P34", passageText: P34_TEXT, passageTheme: "SCIENCE WRITING", passageTitle: "The Language of Pain", questionType: "Inference", questionIndex: 2, totalQuestionsInPassage: 14 },
    },
  ];

  for (const q of seeds) {
    await db.insert(questions).values({
      id: q.id,
      section: q.section,
      type: q.type,
      skillId: q.skillId,
      difficulty: q.difficulty,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      renderType: "comprehension",
      renderConfig: q.renderConfig,
      freePool: true,
      qaStatus: "approved",
      estTimeSeconds: 60,
      timeExpected: 60,
      orderIndex: 0,
      cognitiveLoad: 3,
      locale: "en-GB",
      britishSpelling: true,
      version: 1,
      qualityScore: 0,
      trapTypes: [],
      subRuleId: "",
      questionPool: "practice",
    }).onConflictDoNothing();
  }
  console.log(`  [English Comprehension] Core seed passages P33/P34 ensured (6 questions)`);
}

let _freePoolSeeded = false;

export async function ensureFreePool() {
  if (_freePoolSeeded) {
    return;
  }

  await seedCoreComprehensionQuestions();

  // Upsert the full embedded question bank (VR x25, Math x19, NVR x25)
  // This ensures production gets the real question bank even with an empty DB
  let inserted = 0;
  for (const q of FULL_FREE_POOL_QUESTIONS) {
    const sectionType = q.section === "Verbal Reasoning" ? "verbal"
      : q.section === "Mathematics" ? "numerical"
      : "nvr";
    await db.insert(questions).values({
      id: q.id,
      section: q.section,
      type: sectionType,
      skillId: q.skillId,
      subRuleId: q.subRuleId,
      difficulty: q.difficulty,
      prompt: q.prompt,
      options: q.options as string[],
      correctAnswer: q.correctAnswer,
      renderType: q.renderType,
      estTimeSeconds: q.estTimeSeconds,
      renderConfig: q.renderConfig as any,
      cognitiveLoad: q.cognitiveLoad,
      trapTypes: q.trapTypes as string[],
      orderIndex: q.orderIndex,
      freePool: true,
      qaStatus: "approved",
      timeExpected: q.estTimeSeconds,
      locale: "en-GB",
      britishSpelling: true,
      version: 1,
      qualityScore: 0,
      questionPool: "practice",
    }).onConflictDoUpdate({
      target: questions.id,
      set: { freePool: true, qaStatus: "approved" },
    });
    inserted++;
  }
  console.log(`  [Free Pool] Upserted ${inserted} bank questions (VR/Math/NVR)`);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.freePool, true));

  const [{ compCount }] = await db
    .select({ compCount: sql<number>`count(*)` })
    .from(questions)
    .where(and(eq(questions.freePool, true), eq(questions.section, "English Comprehension")));

  console.log(`✓ Free pool ready: ${count} questions (${compCount} comp)`);
  _freePoolSeeded = true;
}

let _diagnosticPoolSeeded = false;

export async function ensureDiagnosticPool() {
  if (_diagnosticPoolSeeded) return;

  const SECTION_QUOTAS = { easy: 8, medium: 22, hard: 18 };
  const NON_COMP_SECTIONS = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"];
  const COMP_QUESTION_QUOTA = 96;

  let promoted = 0;

  // Non-comprehension sections: promote practice → diagnostic to fill quotas
  for (const section of NON_COMP_SECTIONS) {
    const alreadyDiag = await db.select().from(questions).where(
      and(eq(questions.section, section), eq(questions.qaStatus, "approved"), eq(questions.questionPool, "diagnostic"))
    );
    const alreadyDiagIds = alreadyDiag.map(q => q.id);

    const targetEasy = Math.max(0, SECTION_QUOTAS.easy - alreadyDiag.filter(q => q.difficulty === "easy").length);
    const targetMedium = Math.max(0, SECTION_QUOTAS.medium - alreadyDiag.filter(q => q.difficulty === "medium").length);
    const targetHard = Math.max(0, SECTION_QUOTAS.hard - alreadyDiag.filter(q => q.difficulty === "hard").length);

    if (targetEasy + targetMedium + targetHard === 0) continue;

    const pool = await db.select().from(questions)
      .where(and(
        eq(questions.section, section),
        eq(questions.qaStatus, "approved"),
        isNotNull(questions.skillId),
        ne(questions.skillId, ""),
        eq(questions.questionPool, "practice"),
        alreadyDiagIds.length > 0 ? notInArray(questions.id, alreadyDiagIds) : sql`TRUE`,
      ))
      .orderBy(asc(questions.freePool), asc(questions.orderIndex));

    const byDiff: Record<string, typeof pool> = { easy: [], medium: [], hard: [] };
    for (const q of pool) {
      const d = q.difficulty || "";
      if (d in byDiff) byDiff[d].push(q);
    }

    const toPromote = [
      ...byDiff.easy.slice(0, targetEasy),
      ...byDiff.medium.slice(0, targetMedium),
      ...byDiff.hard.slice(0, targetHard),
    ];

    if (toPromote.length > 0) {
      await db.update(questions)
        .set({ questionPool: "diagnostic" })
        .where(inArray(questions.id, toPromote.map(q => q.id)));
      promoted += toPromote.length;
    }
  }

  // Comprehension: promote whole passages from practice → diagnostic until quota met
  const [alreadyComp] = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(questions)
    .where(and(eq(questions.section, "English Comprehension"), eq(questions.questionPool, "diagnostic")));
  const alreadyDiagCompCount = Number(alreadyComp?.cnt || 0);
  const stillNeeded = Math.max(0, COMP_QUESTION_QUOTA - alreadyDiagCompCount);

  if (stillNeeded > 0) {
    const compPool = await db.select().from(questions).where(
      and(
        eq(questions.section, "English Comprehension"),
        eq(questions.qaStatus, "approved"),
        sql`render_config->>'passageId' IS NOT NULL`,
        eq(questions.questionPool, "practice"),
      )
    );

    const passageMap = new Map<string, typeof compPool>();
    for (const q of compPool) {
      const pid = (q.renderConfig as any)?.passageId as string;
      if (!pid) continue;
      if (!passageMap.has(pid)) passageMap.set(pid, []);
      passageMap.get(pid)!.push(q);
    }

    const sortedPassages = [...passageMap.entries()].sort((a, b) => {
      const aFree = a[1].some(q => q.freePool) ? 1 : 0;
      const bFree = b[1].some(q => q.freePool) ? 1 : 0;
      return aFree - bFree || b[1].length - a[1].length;
    });

    let accumulated = 0;
    for (const [, qs] of sortedPassages) {
      if (accumulated >= stillNeeded) break;
      const ids = qs.map(q => q.id);
      await db.update(questions)
        .set({ questionPool: "diagnostic" })
        .where(inArray(questions.id, ids));
      promoted += qs.length;
      accumulated += qs.length;
    }
  }

  const [{ diagCount }] = await db
    .select({ diagCount: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.questionPool, "diagnostic"));

  if (promoted > 0) {
    console.log(`  [Diagnostic Pool] Promoted ${promoted} questions from practice pool`);
  }
  console.log(`✓ Diagnostic pool ready: ${diagCount} questions`);
  _diagnosticPoolSeeded = true;
}

export async function seedDatabase() {
  // Always ensure admin user exists with full programme24_plus access
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, "admin@bucks11plus.co.uk"),
  });

  if (!existingAdmin) {
    const adminPassword = await hashPassword("Admin11plus!");
    await db.insert(users).values({
      username: "admin@bucks11plus.co.uk",
      password: adminPassword,
      isAdmin: true,
      subscriptionTier: "programme24_plus",
    });
    console.log("✓ Admin user created: admin@bucks11plus.co.uk / Admin11plus!");
  } else if (!existingAdmin.isAdmin || existingAdmin.subscriptionTier !== "programme24_plus") {
    await db.update(users)
      .set({ isAdmin: true, subscriptionTier: "programme24_plus" })
      .where(eq(users.username, "admin@bucks11plus.co.uk"));
    console.log("✓ Admin user updated: isAdmin=true, tier=programme24_plus");
  }

  const [existing] = await db.select({ count: sql<number>`count(*)` }).from(diagnostics);
  if (existing.count > 0) {
    await ensurePracticePaperDiagnostics();
    await syncDiagnosticTimings();
    await ensureComprehensionSection();
    await repairSeedQuestions();
    await ensureFreePool();
    await ensureDiagnosticPool();
    return;
  }

  console.log("Seeding database...");

  await db.insert(diagnostics).values([
    {
      id: "mini-1",
      title: "Mini Diagnostic",
      subtitle: "Quick 8-minute assessment across core GL-style reasoning",
      type: "mini",
      duration: 8,
      questionCount: 12,
      requiredTier: "free",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "full-a",
      title: "Full Diagnostic A",
      subtitle: "Complete 30-minute assessment mirroring GL exam pacing",
      type: "full",
      duration: 30,
      questionCount: 40,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "full-b",
      title: "Full Diagnostic B",
      subtitle: "Second full-length paper with different question set",
      type: "full",
      duration: 30,
      questionCount: 40,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "mock-1",
      title: "Mock Exam 1",
      subtitle: "Exam-day simulation under real GL pacing",
      type: "mock",
      duration: 35,
      questionCount: 50,
      requiredTier: "programme16",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "practice-quick",
      title: "Quick Practice Paper",
      subtitle: "A fast 20-question paper with fresh questions each time",
      type: "practice_paper",
      duration: 15,
      questionCount: 20,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "practice-full",
      title: "Full Practice Paper",
      subtitle: "A complete 40-question paper — unique every time",
      type: "practice_paper",
      duration: 30,
      questionCount: 40,
      requiredTier: "pack12",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
    {
      id: "practice-mock",
      title: "Mock Exam Paper",
      subtitle: "50-question exam simulation with fresh questions each attempt",
      type: "practice_paper",
      duration: 35,
      questionCount: 50,
      requiredTier: "programme16",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
    },
  ]);

  const vrQuestions = [
    { prompt: "Find the word that completes: MEA ( _ ) RIM", options: ["T", "L", "S", "N", "D"], correct: "N", section: "Verbal Reasoning" },
    { prompt: "Which word is most opposite to BOLD?", options: ["Timid", "Brave", "Strong", "Loud", "Fast"], correct: "Timid", section: "Verbal Reasoning" },
    { prompt: "Complete the analogy: Hot is to Cold as Light is to ___", options: ["Bright", "Dark", "Warm", "Heavy", "Soft"], correct: "Dark", section: "Verbal Reasoning" },
    { prompt: "Which word does not belong? CAT, DOG, FISH, TABLE, BIRD", options: ["CAT", "DOG", "FISH", "TABLE", "BIRD"], correct: "TABLE", section: "Verbal Reasoning" },
  ];

  const mathsQuestions = [
    { prompt: "What is 347 + 258?", options: ["595", "605", "615", "585", "625"], correct: "605", section: "Mathematics" },
    { prompt: "A shop sells 3 apples for £1.20. How much do 5 apples cost?", options: ["£1.80", "£2.00", "£2.20", "£1.50", "£2.40"], correct: "£2.00", section: "Mathematics" },
    { prompt: "What is 3/4 of 120?", options: ["80", "90", "100", "85", "95"], correct: "90", section: "Mathematics" },
    { prompt: "If a train travels 60 miles in 45 minutes, what is its speed in mph?", options: ["60 mph", "70 mph", "80 mph", "75 mph", "90 mph"], correct: "80 mph", section: "Mathematics" },
  ];

  const textQuestions = [...vrQuestions, ...mathsQuestions].map((q, i) => ({
    id: `mini-q-${i < 4 ? i + 1 : i + 5}`,
    diagnosticId: "mini-1",
    section: q.section,
    type: q.section === "Verbal Reasoning" ? "verbal" : "numerical",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correct,
    difficulty: "medium" as const,
    timeExpected: 60,
    orderIndex: i < 4 ? i : i + 4,
    renderType: "text" as const,
    renderConfig: {},
  }));

  const svgQuestions = nvrSvgQuestions.map((q, i) => ({
    id: `mini-q-${i + 5}`,
    diagnosticId: "mini-1",
    section: q.section,
    type: "spatial",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correct,
    difficulty: "medium" as const,
    timeExpected: 60,
    orderIndex: i + 4,
    renderType: q.renderType,
    renderConfig: q.renderConfig,
  }));

  await db.insert(questions).values([...textQuestions, ...svgQuestions]);

  const fullAQuestions = [
    ...vrQuestions,
    { prompt: "Which pair of words is most similar? HAPPY/GLAD or SAD/ANGRY", options: ["HAPPY/GLAD", "SAD/ANGRY", "Both equal", "Neither", "Cannot tell"], correct: "HAPPY/GLAD", section: "Verbal Reasoning" },
    { prompt: "Rearrange these letters to make a word: LOOHCS", options: ["SCHOOL", "CHOOSE", "STOOLS", "COLORS", "COOLS"], correct: "SCHOOL", section: "Verbal Reasoning" },
    { prompt: "Find the hidden word: The LAMP LASTED all night.", options: ["LAST", "AMPLE", "PLAST", "LAMP", "PAST"], correct: "PLAST", section: "Verbal Reasoning" },
    ...nvrSvgQuestions,
    { prompt: "What is 15% of 240?", options: ["32", "34", "36", "38", "40"], correct: "36", section: "Mathematics" },
    { prompt: "A rectangle has a perimeter of 30cm and width of 5cm. What is its length?", options: ["10cm", "12cm", "15cm", "8cm", "20cm"], correct: "10cm", section: "Mathematics" },
    { prompt: "Complete: 2, 5, 11, 23, ___", options: ["35", "46", "47", "45", "48"], correct: "47", section: "Mathematics" },
    ...mathsQuestions,
  ].map((q, i) => ({
    id: `full-a-q-${i + 1}`,
    diagnosticId: "full-a",
    section: q.section,
    type: q.section === "Verbal Reasoning" ? "verbal" : q.section === "Non-Verbal Reasoning" ? "spatial" : "numerical",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correct,
    difficulty: i < 7 ? "easy" as const : i < 14 ? "medium" as const : "hard" as const,
    timeExpected: 60,
    orderIndex: i,
    renderType: ("renderType" in q ? q.renderType : "text") as string,
    renderConfig: ("renderConfig" in q ? q.renderConfig : {}) as Record<string, unknown>,
  }));

  await db.insert(questions).values(fullAQuestions);

  await db.insert(articles).values([
    {
      title: "How the Buckinghamshire 11+ Actually Works: A Clear Guide for 2025",
      slug: "bucks-11-plus-guide-2025",
      excerpt: "Everything you need to know about the Bucks 11+ — from registration deadlines to the 121 qualifying score — explained in plain language.",
      content: `<h2>What is the Buckinghamshire 11+?</h2>
<p>The Buckinghamshire 11+ is a selective entrance examination used by grammar schools across the county. It is administered by GL Assessment and tests children in four core areas: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension.</p>
<h2>The 121 Standard</h2>
<p>A standardised score of 121 or above is typically required for grammar school entry. This score accounts for the child's age at the time of testing, ensuring fair comparison across the cohort.</p>
<h2>Test Format</h2>
<p>The test consists of multiple-choice questions completed under timed conditions. Children have approximately 50 minutes to complete the paper, which covers around 80 questions across all four sections.</p>
<h2>Registration Timeline</h2>
<p>Registration typically opens in May/June for the September test. Parents must register through the Buckinghamshire Council website. Late registrations are rarely accepted.</p>
<h2>Preparation Strategy</h2>
<p>Effective preparation should begin 6-12 months before the test. Focus on building genuine understanding rather than rote learning. Regular timed practice helps children manage exam pressure and pacing.</p>`,
      category: "Getting Started",
      readTime: "6 min read",
    },
    {
      title: "Verbal Reasoning: The Skill Most Parents Underestimate",
      slug: "verbal-reasoning-guide",
      excerpt: "Verbal reasoning accounts for a significant portion of the 11+ and is the area where targeted practice yields the fastest improvement.",
      content: `<h2>Why Verbal Reasoning Matters</h2>
<p>Verbal reasoning tests a child's ability to understand and reason using words and language. It is often the section where children from non-selective primary schools have the widest gap to close.</p>
<h2>Key Question Types</h2>
<ul>
<li><strong>Word analogies:</strong> Understanding relationships between word pairs</li>
<li><strong>Hidden words:</strong> Finding words embedded within sentences</li>
<li><strong>Letter sequences:</strong> Identifying patterns in letter arrangements</li>
<li><strong>Synonyms and antonyms:</strong> Testing vocabulary breadth</li>
<li><strong>Comprehension inference:</strong> Drawing conclusions from short passages</li>
</ul>
<h2>Common Pitfalls</h2>
<p>Many children lose marks not from lack of ability but from poor pacing. They spend too long on difficult questions and don't reach easier ones at the end. Practice with strict timing from the start.</p>
<h2>Building Vocabulary</h2>
<p>Encourage wide reading across genres. Keep a vocabulary journal. Discuss unfamiliar words at mealtimes. These habits build the word knowledge that underpins verbal reasoning success.</p>`,
      category: "Subject Guides",
      readTime: "5 min read",
    },
    {
      title: "Managing 11+ Anxiety: A Practical Guide for Families",
      slug: "managing-11-plus-anxiety",
      excerpt: "Test anxiety can significantly impact performance. Here's how to help your child approach the 11+ with confidence rather than fear.",
      content: `<h2>Understanding Test Anxiety</h2>
<p>Some anxiety before a test is normal and can even be helpful. However, excessive anxiety can impair working memory, slow processing speed, and lead to avoidance behaviours that undermine preparation.</p>
<h2>Signs to Watch For</h2>
<ul>
<li>Reluctance to practice or discuss the test</li>
<li>Physical symptoms: headaches, stomach aches before practice sessions</li>
<li>Perfectionism: refusing to attempt questions they might get wrong</li>
<li>Sleep disruption in the weeks before the test</li>
</ul>
<h2>Practical Strategies</h2>
<p><strong>Normalise the experience:</strong> Talk about the test matter-of-factly. Avoid phrases like "this is the most important test of your life." Frame it as one opportunity among many.</p>
<p><strong>Build familiarity:</strong> Regular, short practice sessions reduce the novelty factor. When the test format feels familiar, anxiety drops naturally.</p>
<p><strong>Focus on effort, not outcome:</strong> Praise the work your child puts in rather than the score they achieve. This builds resilience and intrinsic motivation.</p>
<h2>On Test Day</h2>
<p>Arrive early but not too early. Have a calm breakfast routine. Avoid last-minute revision. Remind your child that they have prepared well and this is their chance to show what they know.</p>`,
      category: "Wellbeing",
      readTime: "4 min read",
    },
  ]);

  await db.insert(practiceSections).values([
    { title: "Word Analogies", category: "Verbal Reasoning", icon: "BookOpen", difficulty: "Medium", questionCount: 15, requiredTier: "free", skillId: "vr.vocab" },
    { title: "Advanced Word Analogies", category: "Verbal Reasoning", icon: "BookOpen", difficulty: "Hard", questionCount: 12, requiredTier: "programme16", skillId: "vr.vocab" },
    { title: "Letter Sequences", category: "Verbal Reasoning", icon: "Type", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "vr.sequences" },
    { title: "Hidden Words", category: "Verbal Reasoning", icon: "Search", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "vr.word_structure" },
    { title: "Advanced Hidden Words", category: "Verbal Reasoning", icon: "Search", difficulty: "Hard", questionCount: 12, requiredTier: "programme16", skillId: "vr.word_structure" },
    { title: "Code Breaking", category: "Verbal Reasoning", icon: "Lock", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "vr.codes" },
    { title: "Logical Deduction", category: "Verbal Reasoning", icon: "GitBranch", difficulty: "Medium", questionCount: 15, requiredTier: "free", skillId: "vr.verbal_logic" },
    { title: "Advanced Logical Deduction", category: "Verbal Reasoning", icon: "GitBranch", difficulty: "Hard", questionCount: 12, requiredTier: "programme16", skillId: "vr.verbal_logic" },
    { title: "Word Classification", category: "Verbal Reasoning", icon: "List", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "vr.word_sequences" },
    { title: "Advanced Word Classification", category: "Verbal Reasoning", icon: "List", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "vr.word_sequences" },
    { title: "Pattern Recognition", category: "Non-Verbal Reasoning", icon: "Grid3x3", difficulty: "Medium", questionCount: 15, requiredTier: "free", skillId: "nvr.sequence" },
    { title: "Mirror Images", category: "Non-Verbal Reasoning", icon: "FlipHorizontal", difficulty: "Easy", questionCount: 10, requiredTier: "free", skillId: "nvr.transform" },
    { title: "Odd One Out", category: "Non-Verbal Reasoning", icon: "CircleDot", difficulty: "Medium", questionCount: 12, requiredTier: "free", skillId: "nvr.classification" },
    { title: "Symmetry & Spatial", category: "Non-Verbal Reasoning", icon: "Maximize2", difficulty: "Medium", questionCount: 12, requiredTier: "pack12", skillId: "nvr.symmetry" },
    { title: "Advanced Symmetry", category: "Non-Verbal Reasoning", icon: "Maximize2", difficulty: "Hard", questionCount: 12, requiredTier: "programme16", skillId: "nvr.symmetry" },
    { title: "Advanced Transformations", category: "Non-Verbal Reasoning", icon: "Layers", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "nvr.transform" },
    { title: "Complex Sequences", category: "Non-Verbal Reasoning", icon: "Waypoints", difficulty: "Hard", questionCount: 12, requiredTier: "programme16", skillId: "nvr.sequence" },
    { title: "Classification Challenge", category: "Non-Verbal Reasoning", icon: "Shapes", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "nvr.classification" },
    { title: "Arithmetic & Number", category: "Mathematics", icon: "Calculator", difficulty: "Medium", questionCount: 15, requiredTier: "free", skillId: "maths.arithmetic" },
    { title: "Advanced Arithmetic", category: "Mathematics", icon: "Calculator", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "maths.arithmetic" },
    { title: "Multi-step Word Problems", category: "Mathematics", icon: "Brain", difficulty: "Hard", questionCount: 12, requiredTier: "pack12", skillId: "maths.word_problems" },
    { title: "Fractions & Decimals", category: "Mathematics", icon: "Percent", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "maths.fractions" },
    { title: "Advanced Fractions", category: "Mathematics", icon: "Percent", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "maths.fractions" },
    { title: "Data Interpretation", category: "Mathematics", icon: "BarChart3", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "maths.data" },
    { title: "Advanced Data Interpretation", category: "Mathematics", icon: "BarChart3", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "maths.data" },
    { title: "Number Patterns", category: "Mathematics", icon: "TrendingUp", difficulty: "Medium", questionCount: 12, requiredTier: "free", skillId: "maths.patterns" },
    { title: "Advanced Number Patterns", category: "Mathematics", icon: "TrendingUp", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "maths.patterns" },
    { title: "Percentages", category: "Mathematics", icon: "BadgePercent", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "maths.percentages" },
    { title: "Advanced Percentages", category: "Mathematics", icon: "BadgePercent", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "maths.percentages" },
    { title: "Ratio & Proportion", category: "Mathematics", icon: "Scale", difficulty: "Medium", questionCount: 10, requiredTier: "pack12", skillId: "maths.ratio" },
    { title: "Advanced Ratio & Proportion", category: "Mathematics", icon: "Scale", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "maths.ratio" },
    { title: "Fact Retrieval", category: "English Comprehension", icon: "FileText", difficulty: "Easy", questionCount: 15, requiredTier: "free", skillId: "comp.fact_retrieval" },
    { title: "Vocabulary in Context", category: "English Comprehension", icon: "BookOpen", difficulty: "Medium", questionCount: 12, requiredTier: "free", skillId: "comp.vocabulary" },
    { title: "Inference & Deduction", category: "English Comprehension", icon: "Lightbulb", difficulty: "Medium", questionCount: 12, requiredTier: "pack12", skillId: "comp.inference" },
    { title: "Mood & Tone", category: "English Comprehension", icon: "Palette", difficulty: "Hard", questionCount: 10, requiredTier: "pack12", skillId: "comp.mood" },
    { title: "Detail Retrieval", category: "English Comprehension", icon: "Search", difficulty: "Medium", questionCount: 12, requiredTier: "pack12", skillId: "comp.detail" },
    { title: "Advanced Comprehension", category: "English Comprehension", icon: "GraduationCap", difficulty: "Hard", questionCount: 10, requiredTier: "programme16", skillId: "comp.main_idea" },
  ]);

  console.log("Seed data inserted successfully.");
  await repairSeedQuestions();
  await ensureFreePool();
  await ensureDiagnosticPool();
}

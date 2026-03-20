import { db } from "./db";
import { diagnostics, questions, articles, practiceSections, users } from "@shared/schema";
import { sql, eq, and, isNotNull, ne, asc, inArray } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import type { NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig } from "@shared/contentTypes";

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
  const result = await db
    .update(questions)
    .set({ qaStatus: "approved" })
    .where(
      and(
        eq(questions.qaStatus, "draft"),
        sql`(id LIKE 'mini-q-%' OR id LIKE 'full-a-q-%' OR id LIKE 'full-b-q-%' OR id LIKE 'mock-%')`,
      ),
    );
  const updated = (result as any).rowCount ?? 0;
  if (updated > 0) {
    console.log(`✓ Repaired ${updated} seed questions (draft → approved)`);
  }
}

export async function ensureFreePool() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.freePool, true));

  if (Number(count) > 0) {
    console.log(`✓ Free pool already seeded (${count} questions)`);
    return;
  }

  console.log("Seeding free pool questions...");

  const NON_COMP_TARGETS = { easy: 6, medium: 13, hard: 6 };
  const NON_COMP_SECTIONS = ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics"] as const;

  for (const section of NON_COMP_SECTIONS) {
    const pool = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.section, section),
          eq(questions.qaStatus, "approved"),
          isNotNull(questions.skillId),
          ne(questions.skillId, ""),
        ),
      )
      .orderBy(asc(questions.orderIndex));

    if (pool.length === 0) continue;

    const byDiff: Record<"easy" | "medium" | "hard", typeof pool> = { easy: [], medium: [], hard: [] };
    for (const q of pool) {
      const d = q.difficulty as "easy" | "medium" | "hard";
      if (d in byDiff) byDiff[d].push(q);
    }

    const selected = [
      ...byDiff.easy.slice(0, NON_COMP_TARGETS.easy),
      ...byDiff.medium.slice(0, NON_COMP_TARGETS.medium),
      ...byDiff.hard.slice(0, NON_COMP_TARGETS.hard),
    ];

    if (selected.length > 0) {
      await db.update(questions)
        .set({ freePool: true })
        .where(inArray(questions.id, selected.map(q => q.id)));
      console.log(`  [${section}] marked ${selected.length} questions freePool`);
    }
  }

  const compPool = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.section, "English Comprehension"),
        eq(questions.qaStatus, "approved"),
        sql`render_config->>'passageId' IS NOT NULL`,
      ),
    );

  const passageMap = new Map<string, typeof compPool>();
  for (const q of compPool) {
    const pid = (q.renderConfig as any)?.passageId as string;
    if (!pid) continue;
    if (!passageMap.has(pid)) passageMap.set(pid, []);
    passageMap.get(pid)!.push(q);
  }

  const sortedPassages = [...passageMap.entries()]
    .sort((a, b) => a[1].length - b[1].length)
    .slice(0, 3);

  for (const [pid, qs] of sortedPassages) {
    if (qs.length > 0) {
      await db.update(questions)
        .set({ freePool: true })
        .where(inArray(questions.id, qs.map(q => q.id)));
      console.log(`  [English Comprehension] Passage ${pid}: ${qs.length} questions marked freePool`);
    }
  }

  const [{ count: finalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(eq(questions.freePool, true));
  console.log(`✓ Free pool seeded: ${finalCount} questions`);
}

export async function seedDatabase() {
  // Always ensure admin user exists
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, "admin@bucks11plus.co.uk"),
  });

  if (!existingAdmin) {
    const adminPassword = await hashPassword("Admin11plus!");
    await db.insert(users).values({
      username: "admin@bucks11plus.co.uk",
      password: adminPassword,
      isAdmin: true,
    });
    console.log("✓ Admin user created: admin@bucks11plus.co.uk / Admin11plus!");
  }

  const [existing] = await db.select({ count: sql<number>`count(*)` }).from(diagnostics);
  if (existing.count > 0) {
    await ensurePracticePaperDiagnostics();
    await syncDiagnosticTimings();
    await ensureComprehensionSection();
    await repairSeedQuestions();
    await ensureFreePool();
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
}

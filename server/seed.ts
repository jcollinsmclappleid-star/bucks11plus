import { db } from "./db";
import { diagnostics, questions, articles, practiceSections } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const [existing] = await db.select({ count: sql<number>`count(*)` }).from(diagnostics);
  if (existing.count > 0) return;

  console.log("Seeding database...");

  await db.insert(diagnostics).values([
    {
      id: "mini-1",
      title: "Mini Diagnostic",
      subtitle: "Quick 12-minute assessment across core GL-style reasoning",
      type: "mini",
      duration: 12,
      questionCount: 12,
      requiredTier: "free",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Maths"],
    },
    {
      id: "full-a",
      title: "Full Diagnostic A",
      subtitle: "Complete 45-minute assessment mirroring Bucks test conditions",
      type: "full",
      duration: 45,
      questionCount: 40,
      requiredTier: "monthly",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Maths"],
    },
    {
      id: "full-b",
      title: "Full Diagnostic B",
      subtitle: "Second full-length paper with different question set",
      type: "full",
      duration: 45,
      questionCount: 40,
      requiredTier: "monthly",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Maths"],
    },
    {
      id: "mock-1",
      title: "Mock Exam 1",
      subtitle: "Exam-day simulation under timed conditions",
      type: "mock",
      duration: 50,
      questionCount: 50,
      requiredTier: "pack",
      sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Maths"],
    },
  ]);

  const vrQuestions = [
    { prompt: "Find the word that completes: MEA ( _ ) RIM", options: ["T", "L", "S", "N", "D"], correct: "N", section: "Verbal Reasoning" },
    { prompt: "Which word is most opposite to BOLD?", options: ["Timid", "Brave", "Strong", "Loud", "Fast"], correct: "Timid", section: "Verbal Reasoning" },
    { prompt: "Complete the analogy: Hot is to Cold as Light is to ___", options: ["Bright", "Dark", "Warm", "Heavy", "Soft"], correct: "Dark", section: "Verbal Reasoning" },
    { prompt: "Which word does not belong? CAT, DOG, FISH, TABLE, BIRD", options: ["CAT", "DOG", "FISH", "TABLE", "BIRD"], correct: "TABLE", section: "Verbal Reasoning" },
  ];

  const nvrQuestions = [
    { prompt: "Which shape completes the pattern? A series of rotating triangles is shown.", options: ["Triangle pointing up", "Triangle pointing right", "Triangle pointing down", "Triangle pointing left", "Square"], correct: "Triangle pointing down", section: "Non-Verbal Reasoning" },
    { prompt: "Find the odd one out in the following shapes: Four circles and one hexagon.", options: ["Shape A", "Shape B", "Shape C", "Shape D", "Shape E"], correct: "Shape E", section: "Non-Verbal Reasoning" },
    { prompt: "Which figure comes next in the sequence? Squares increasing by one each time.", options: ["3 squares", "4 squares", "5 squares", "6 squares", "7 squares"], correct: "5 squares", section: "Non-Verbal Reasoning" },
    { prompt: "Which is the mirror image of the given shape?", options: ["Option A", "Option B", "Option C", "Option D", "Option E"], correct: "Option B", section: "Non-Verbal Reasoning" },
  ];

  const mathsQuestions = [
    { prompt: "What is 347 + 258?", options: ["595", "605", "615", "585", "625"], correct: "605", section: "Maths" },
    { prompt: "A shop sells 3 apples for £1.20. How much do 5 apples cost?", options: ["£1.80", "£2.00", "£2.20", "£1.50", "£2.40"], correct: "£2.00", section: "Maths" },
    { prompt: "What is 3/4 of 120?", options: ["80", "90", "100", "85", "95"], correct: "90", section: "Maths" },
    { prompt: "If a train travels 60 miles in 45 minutes, what is its speed in mph?", options: ["60 mph", "70 mph", "80 mph", "75 mph", "90 mph"], correct: "80 mph", section: "Maths" },
  ];

  const allMiniQuestions = [...vrQuestions, ...nvrQuestions, ...mathsQuestions].map((q, i) => ({
    id: `mini-q-${i + 1}`,
    diagnosticId: "mini-1",
    section: q.section,
    type: q.section === "Verbal Reasoning" ? "verbal" : q.section === "Non-Verbal Reasoning" ? "spatial" : "numerical",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correct,
    difficulty: "medium" as const,
    timeExpected: 60,
    orderIndex: i,
  }));

  await db.insert(questions).values(allMiniQuestions);

  const fullAQuestions = [
    ...vrQuestions,
    { prompt: "Which pair of words is most similar? HAPPY/GLAD or SAD/ANGRY", options: ["HAPPY/GLAD", "SAD/ANGRY", "Both equal", "Neither", "Cannot tell"], correct: "HAPPY/GLAD", section: "Verbal Reasoning" },
    { prompt: "Rearrange these letters to make a word: LOOHCS", options: ["SCHOOL", "CHOOSE", "STOOLS", "COLORS", "COOLS"], correct: "SCHOOL", section: "Verbal Reasoning" },
    { prompt: "Find the hidden word: The LAMP LASTED all night.", options: ["LAST", "AMPLE", "PLAST", "LAMP", "PAST"], correct: "PLAST", section: "Verbal Reasoning" },
    ...nvrQuestions,
    { prompt: "Which cube can be made from this net?", options: ["Cube A", "Cube B", "Cube C", "Cube D", "Cube E"], correct: "Cube C", section: "Non-Verbal Reasoning" },
    { prompt: "Complete the grid pattern: 2x2 grid with one missing.", options: ["Pattern A", "Pattern B", "Pattern C", "Pattern D", "Pattern E"], correct: "Pattern A", section: "Non-Verbal Reasoning" },
    { prompt: "Which shape is a rotation of the given figure?", options: ["Shape A", "Shape B", "Shape C", "Shape D", "Shape E"], correct: "Shape D", section: "Non-Verbal Reasoning" },
    ...mathsQuestions,
    { prompt: "What is 15% of 240?", options: ["32", "34", "36", "38", "40"], correct: "36", section: "Maths" },
    { prompt: "A rectangle has a perimeter of 30cm and width of 5cm. What is its length?", options: ["10cm", "12cm", "15cm", "8cm", "20cm"], correct: "10cm", section: "Maths" },
    { prompt: "Complete: 2, 5, 11, 23, ___", options: ["35", "46", "47", "45", "48"], correct: "47", section: "Maths" },
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
  }));

  await db.insert(questions).values(fullAQuestions);

  await db.insert(articles).values([
    {
      title: "How the Buckinghamshire 11+ Actually Works: A Clear Guide for 2025",
      slug: "bucks-11-plus-guide-2025",
      excerpt: "Everything you need to know about the Bucks 11+ — from registration deadlines to the 121 qualifying score — explained in plain language.",
      content: `<h2>What is the Buckinghamshire 11+?</h2>
<p>The Buckinghamshire 11+ is a selective entrance examination used by grammar schools across the county. It is administered by GL Assessment and tests children in three core areas: Verbal Reasoning, Non-Verbal Reasoning, and Mathematics.</p>
<h2>The 121 Standard</h2>
<p>A standardised score of 121 or above is typically required for grammar school entry. This score accounts for the child's age at the time of testing, ensuring fair comparison across the cohort.</p>
<h2>Test Format</h2>
<p>The test consists of multiple-choice questions completed under timed conditions. Children have approximately 50 minutes to complete the paper, which covers around 80 questions across all three sections.</p>
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
    { title: "Word Analogies", category: "Verbal Reasoning", icon: "BookOpen", difficulty: "Medium", questionCount: 15, requiredTier: "free" },
    { title: "Letter Sequences", category: "Verbal Reasoning", icon: "Type", difficulty: "Hard", questionCount: 12, requiredTier: "monthly" },
    { title: "Hidden Words", category: "Verbal Reasoning", icon: "Search", difficulty: "Medium", questionCount: 10, requiredTier: "monthly" },
    { title: "Pattern Recognition", category: "Non-Verbal Reasoning", icon: "Grid3x3", difficulty: "Medium", questionCount: 15, requiredTier: "free" },
    { title: "Shape Sequences", category: "Non-Verbal Reasoning", icon: "Shapes", difficulty: "Hard", questionCount: 12, requiredTier: "monthly" },
    { title: "Mirror Images", category: "Non-Verbal Reasoning", icon: "FlipHorizontal", difficulty: "Easy", questionCount: 10, requiredTier: "free" },
    { title: "Arithmetic & Number", category: "Maths", icon: "Calculator", difficulty: "Medium", questionCount: 15, requiredTier: "free" },
    { title: "Multi-step Word Problems", category: "Maths", icon: "Brain", difficulty: "Hard", questionCount: 12, requiredTier: "monthly" },
    { title: "Fractions & Percentages", category: "Maths", icon: "Percent", difficulty: "Medium", questionCount: 10, requiredTier: "monthly" },
  ]);

  console.log("Seed data inserted successfully.");
}

import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Sample Questions" },
];

interface Sample {
  domain: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

const SAMPLES: Sample[] = [
  {
    domain: "Verbal Reasoning — Synonyms",
    prompt: "Choose the SYNONYM of: ABUNDANT",
    options: ["scarce", "plentiful", "occasional", "fragile", "calm"],
    answer: "plentiful",
    explanation: "Abundant means existing in large quantities — 'plentiful' is the closest match. 'Scarce' is the antonym — chosen most often by children who don't re-read the question heading.",
  },
  {
    domain: "Verbal Reasoning — Cloze",
    prompt: "He spoke with such ______ that the audience listened in complete silence.",
    options: ["confusion", "authority", "speed", "shyness", "amusement"],
    answer: "authority",
    explanation: "Only 'authority' explains why an audience would listen in silence. The other options either contradict (confusion, shyness) or don't connect with the effect described.",
  },
  {
    domain: "Verbal Reasoning — Shuffled Sentences",
    prompt: "Identify the word that does NOT belong: [ate] [the] [quickly] [hungry] [his] [sandwich] [boy]",
    options: ["ate", "quickly", "hungry", "his", "sandwich"],
    answer: "his",
    explanation: "Reordered: 'The hungry boy ate the sandwich quickly.' 'His' is grammatically valid but cannot be placed without removing 'the' before sandwich.",
  },
  {
    domain: "Verbal Reasoning — Letter Codes",
    prompt: "If TREE is coded as URFF, what is the code for BARK?",
    options: ["CBSL", "CBSM", "ABQK", "CASL", "DBSL"],
    answer: "CBSL",
    explanation: "Each letter shifts forward by 1 in the alphabet. T→U, R→S, E→F, E→F → URFF. Apply the same: B→C, A→B, R→S, K→L → CBSL.",
  },
  {
    domain: "Non-Verbal Reasoning — Odd One Out",
    prompt: "Which shape is the odd one out? (Five shapes are shown — four have rotational symmetry of order 2, one has only line symmetry.)",
    options: ["Shape 1", "Shape 2", "Shape 3", "Shape 4", "Shape 5"],
    answer: "Shape 4",
    explanation: "Shapes 1, 2, 3 and 5 all look identical when rotated 180°. Shape 4 has a line of symmetry but does not match itself when rotated — it is the odd one out.",
  },
  {
    domain: "Non-Verbal Reasoning — Series",
    prompt: "Which shape continues the pattern? (Squares decreasing in size with a small black dot moving clockwise around the corners.)",
    options: ["A — small square, dot top-right", "B — small square, dot bottom-right", "C — small square, dot bottom-left", "D — large square, dot top-right"],
    answer: "B — small square, dot bottom-right",
    explanation: "Two patterns combine: square size decreases by one step each time, and the dot moves one corner clockwise. The next square is smaller than the last, and the dot moves from top-right to bottom-right.",
  },
  {
    domain: "Non-Verbal Reasoning — Matrices",
    prompt: "Which option completes the 3×3 grid? (In each row, shapes rotate 90° clockwise across the row; down each column, shapes change colour from white to grey to black.)",
    options: ["Black square rotated 180°", "White square rotated 180°", "Grey triangle pointing up", "Black triangle pointing right"],
    answer: "Black triangle pointing right",
    explanation: "The bottom-right cell completes both rules: the row's progressive 90° rotation, and the column's colour shift to black.",
  },
  {
    domain: "Maths — Word Problem",
    prompt: "A train leaves at 09:42 and arrives at 11:15. How long does the journey take?",
    options: ["1 hour 17 minutes", "1 hour 23 minutes", "1 hour 33 minutes", "1 hour 43 minutes", "2 hours 7 minutes"],
    answer: "1 hour 33 minutes",
    explanation: "From 09:42 to 10:42 is 1 hour. From 10:42 to 11:15 is another 33 minutes. Total: 1 hour 33 minutes.",
  },
  {
    domain: "Maths — Fractions",
    prompt: "What is 3/8 of 240?",
    options: ["30", "60", "80", "90", "120"],
    answer: "90",
    explanation: "240 ÷ 8 = 30 (one eighth). 30 × 3 = 90 (three eighths).",
  },
  {
    domain: "Maths — Percentages",
    prompt: "A jumper costs £40. In a sale it is reduced by 25%. What is the sale price?",
    options: ["£10", "£15", "£25", "£30", "£35"],
    answer: "£30",
    explanation: "25% of £40 = £10. Sale price = £40 − £10 = £30.",
  },
  {
    domain: "Maths — Geometry",
    prompt: "A rectangle has a perimeter of 30 cm and a width of 6 cm. What is its length?",
    options: ["5 cm", "9 cm", "12 cm", "15 cm", "24 cm"],
    answer: "9 cm",
    explanation: "Perimeter = 2(length + width). 30 = 2(length + 6). length + 6 = 15. length = 9 cm.",
  },
  {
    domain: "Comprehension — Literal",
    prompt: "(After reading a passage about a child's first day at a new school): What did the narrator carry in her bag on her first day?",
    options: ["A book and a packed lunch", "A book and a pencil case", "Just a packed lunch", "A pencil case and a packed lunch"],
    answer: "A book and a pencil case",
    explanation: "Literal recall — the answer is stated explicitly in the passage. Children should re-read the relevant paragraph rather than rely on memory.",
  },
  {
    domain: "Comprehension — Inference",
    prompt: "From the passage, what can you infer about how the narrator felt about her new teacher?",
    options: ["Afraid", "Indifferent", "Reassured", "Disappointed"],
    answer: "Reassured",
    explanation: "Although the narrator never says she felt reassured, her shift in body language (no longer hugging her bag, sitting forward) implies a positive change. Inference questions reward careful tracking of details across the whole passage.",
  },
  {
    domain: "Comprehension — Vocabulary in Context",
    prompt: "In the sentence 'her face brightened at the news', the word 'brightened' most nearly means:",
    options: ["became lighter in colour", "became more cheerful", "became visible", "became warmer"],
    answer: "became more cheerful",
    explanation: "Context matters — 'brightened' literally means 'became lighter' but in this sentence, applied to a face reacting to news, it means the person looked happier. Always read the surrounding sentence before answering.",
  },
];

export default function SampleQuestions() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11+ Sample Questions – Worked Examples Across All 4 Sections"
        description="14 worked Bucks 11+ sample questions covering Verbal Reasoning, Non-Verbal Reasoning, Maths and Comprehension — with full explanations of how to solve each."
        canonicalPath="/bucks-11-plus-sample-questions"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: "Bucks 11+ Sample Questions",
            about: "Buckinghamshire Secondary Transfer Test",
            educationalLevel: "Year 5 / Year 6",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-samples">
          Bucks 11+ Sample Questions
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          14 worked examples across Verbal Reasoning, Non-Verbal Reasoning, Maths and Comprehension — with explanations.
        </p>
      </div>

      <p>
        Below are 14 representative sample questions from across all four Bucks 11+ test sections. Each comes with the correct answer and a worked explanation showing how to reach it. Use them as a quick benchmark of the level of questions your child should be comfortable with by the start of Year 6.
      </p>
      <p>
        Want to see how your child performs on a longer set under timed conditions? Take our{" "}
        <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> for an automatic forecast against the 121 qualifying threshold.
      </p>

      <div className="not-prose space-y-6 my-10">
        {SAMPLES.map((s, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-6 bg-white" data-testid={`sample-${i}`}>
            <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-2">{s.domain}</div>
            <p className="text-slate-800 font-medium mb-4">{i + 1}. {s.prompt}</p>
            <ul className="space-y-1.5 text-sm text-slate-700 mb-4">
              {s.options.map((o, j) => (
                <li key={j} className="flex gap-2">
                  <span className="font-semibold text-slate-400">{String.fromCharCode(65 + j)}.</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-primary">Show answer &amp; explanation</summary>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-slate-800"><strong className="text-emerald-700">Answer:</strong> {s.answer}</p>
                <p className="text-slate-600 mt-2 leading-relaxed">{s.explanation}</p>
              </div>
            </details>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">What These Samples Tell You</h2>
      <p>
        These 14 questions span the four domains and the most common question types within each. A child who solves 11–12 of them comfortably is at or near the 121 qualifying standard. A child who solves 6–8 has the foundation but needs structured preparation. A child who finds them difficult should focus on building underlying skills (vocabulary, mental arithmetic, reading volume) before attempting timed paper practice.
      </p>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">8-minute diagnostic</Link> gives a more reliable picture by combining 12 timed questions with an age-adjusted forecast — closer to a real test snapshot than any sample set can be.
      </p>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:sample-questions" />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

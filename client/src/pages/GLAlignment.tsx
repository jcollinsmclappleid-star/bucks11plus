import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { ContentCTA } from "../components/shared/ContentCTA";
import { Disclaimer } from "../components/shared/Disclaimer";
import { Breadcrumbs, breadcrumbSchema } from "../components/shared/Breadcrumbs";

const faqItems = [
  {
    question: "Is Bucks 11 Plus Tests officially affiliated with GL Assessment?",
    answer: "No. Bucks 11 Plus Tests is fully independent. We are not affiliated with, endorsed by, or connected to GL Assessment Ltd. The term 'GL-style' refers to the question formats and reasoning families used in the Buckinghamshire Secondary Transfer Test — our independently developed questions cover those same four GL Assessment domains to help children practise the reasoning types featured in the test.",
  },
  {
    question: "What is verbal reasoning in the Bucks 11+?",
    answer: "Verbal reasoning in the Bucks 11+ tests a child's ability to understand and manipulate language at speed. Question types include word relationships, missing letters, alphabetical codes, antonyms and synonyms, and logical sentence completion. Vocabulary breadth and the ability to apply word-pattern rules under time pressure are both tested.",
  },
  {
    question: "What is non-verbal reasoning and how is it different from spatial reasoning?",
    answer: "Non-verbal reasoning (NVR) tests pattern recognition and logical deduction using shapes and symbols rather than words or numbers. Spatial reasoning is a sub-category that specifically tests a child's ability to mentally rotate, reflect, and transform shapes. Both are assessed in the Bucks 11+ and are covered in our readiness check question bank.",
  },
  {
    question: "Why does pacing matter as much as accuracy in the Bucks 11+?",
    answer: "The Bucks 11+ is strictly timed. A question answered correctly but too slowly is effectively a failed question — because the child who ran out of time at the end answered no question at all for that slot. Our readiness check tracks time-per-question down to the second and flags where a child's pace creates risk, not just where their accuracy falls short.",
  },
  {
    question: "How many questions are in each section of the Bucks 11+ test?",
    answer: "The full Buckinghamshire Secondary Transfer Test consists of two papers. Paper 1 covers Verbal Reasoning and English Comprehension. Paper 2 covers Mathematics, Non-Verbal Reasoning, and Spatial Reasoning. Each paper is 45 minutes. The exact number of questions per section varies by year, but the total across both papers is typically 100–120 questions.",
  },
];

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "GL Assessment Domains" },
];

export default function GLAlignment() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Subjects Explained – The Four GL Assessment Domains | Bucks 11 Plus Tests"
        description="Understand how the Bucks 11 Plus tests verbal reasoning, non-verbal reasoning, maths and English comprehension. See how our independently developed assessments cover the four GL Assessment domains and where children lose marks."
        canonicalPath="/bucks-gl-alignment"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(item => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">
        The Four GL Assessment Domains in Our Readiness Check
      </h1>
      <p className="text-xl text-muted-foreground lead">
        The Buckinghamshire Secondary Transfer Test is administered by GL Assessment and covers four domains. Our independently developed readiness checks cover all four of those GL Assessment domains — Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension.
      </p>

      <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-5 my-8">
        <p className="text-sm text-amber-900 font-medium mb-1">At a glance</p>
        <ul className="text-sm text-amber-800 space-y-1 list-none m-0 p-0">
          <li>✓ Four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, English Comprehension</li>
          <li>✓ Questions covering all four GL Assessment domains — independently developed, not official GL Assessment materials</li>
          <li>✓ Timed conditions modelled at question level — accuracy and pace both assessed</li>
          <li>✓ Difficulty-weighted questions across Easy, Medium, and Hard bands</li>
          <li>✓ 2,500+ questions in the bank covering all section types</li>
        </ul>
      </div>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">Why Domain Coverage Matters</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test is not a general knowledge or curriculum assessment. It is a highly specific standardised test with particular reasoning families, question formats, and time expectations that differ meaningfully from school tests, SATs, and most commercial practice materials.
      </p>
      <p>
        A child who is strong academically but unfamiliar with GL-style non-verbal reasoning question formats, or who has never practised the pacing demands of a strictly timed multi-section paper, may underperform significantly relative to their actual ability. Covering all four GL Assessment domains means practice is targeted to the specific areas children will be assessed on — not a generic 11+ approach.
      </p>

      <h2 className="text-primary font-serif">Verbal Reasoning</h2>
      <p>
        Verbal reasoning is one of the two domains covered in Paper 1 of the Secondary Transfer Test. It assesses a child's ability to understand, manipulate, and reason with language at speed.
      </p>
      <h3 className="text-primary font-serif">What is tested</h3>
      <ul>
        <li><strong>Word relationships</strong> — identifying synonyms, antonyms, analogies, and category membership</li>
        <li><strong>Alphabetical codes</strong> — applying letter-shift rules to encode and decode words</li>
        <li><strong>Missing letters and word completions</strong> — finding letters that complete two different words simultaneously</li>
        <li><strong>Odd one out</strong> — identifying which word in a group does not belong and why</li>
        <li><strong>Logical sequences</strong> — continuing word-based patterns using implicit rules</li>
      </ul>
      <h3 className="text-primary font-serif">Where children commonly lose marks</h3>
      <p>
        Vocabulary breadth is the most common limiting factor. Children who read widely tend to perform better in verbal reasoning, but reading alone is not sufficient — the specific code and rule-based question types require direct practice to become fast and reliable. Children who have not seen alphabetical code questions before often spend too long working out the rule, leaving insufficient time for the questions that follow.
      </p>

      <h2 className="text-primary font-serif">Non-Verbal Reasoning and Spatial Reasoning</h2>
      <p>
        Non-verbal reasoning (NVR) and spatial reasoning are assessed in Paper 2 of the Secondary Transfer Test. These domains test a child's ability to identify patterns, relationships, and transformations using shapes and symbols rather than words or numbers — making them less dependent on school curriculum knowledge and more dependent on specific question-format familiarity.
      </p>
      <h3 className="text-primary font-serif">What is tested</h3>
      <ul>
        <li><strong>Pattern sequences</strong> — identifying the rule governing a sequence and selecting the next item</li>
        <li><strong>Matrices</strong> — completing a grid by identifying the relationship between rows and columns</li>
        <li><strong>Analogies</strong> — applying the relationship between one pair of shapes to complete a second pair</li>
        <li><strong>Spatial rotation and reflection</strong> — mentally rotating or reflecting a 2D or 3D shape and selecting the correct result</li>
        <li><strong>Net folding</strong> — identifying which 3D shape a 2D net will form when folded</li>
      </ul>
      <h3 className="text-primary font-serif">Where children commonly lose marks</h3>
      <p>
        Non-verbal reasoning is the domain where children most often underperform relative to their natural ability, because the question formats are not taught in primary schools. Children who encounter NVR question types for the first time in a practice session may struggle simply because the format is unfamiliar — not because they lack the reasoning ability. Early exposure and repeated practice typically shows the fastest gains of any domain. Spatial rotation in particular benefits substantially from deliberate practice, as the skill of mentally rotating objects improves significantly with structured exposure.
      </p>

      <h2 className="text-primary font-serif">Mathematics</h2>
      <p>
        The mathematics component of the Secondary Transfer Test goes beyond standard Year 6 curriculum expectations. Questions are grounded in the KS2 curriculum but extend into multi-step problems that require fluency, logical sequencing, and the ability to manage time pressure on harder questions without letting them consume too much of the available time.
      </p>
      <h3 className="text-primary font-serif">What is tested</h3>
      <ul>
        <li><strong>Arithmetic fluency</strong> — fast and accurate mental calculation across all four operations</li>
        <li><strong>Fractions, decimals, and percentages</strong> — including conversion and application in context</li>
        <li><strong>Data interpretation</strong> — reading graphs, tables, and charts under time pressure</li>
        <li><strong>Word problems</strong> — multi-step problems requiring the child to identify the correct operation sequence</li>
        <li><strong>Geometry and measurement</strong> — area, perimeter, angles, and coordinate grids</li>
        <li><strong>Number sequences and algebra</strong> — finding missing values in number patterns and simple equations</li>
      </ul>
      <h3 className="text-primary font-serif">Where children commonly lose marks</h3>
      <p>
        Multi-step word problems are the most common mark-losing category. Children who can solve individual arithmetic questions accurately often slow down significantly when they need to identify the correct operation sequence themselves, without explicit prompting. The second most common issue is time allocation — spending too long on a difficult word problem at the expense of several easier questions that come later in the section.
      </p>

      <h2 className="text-primary font-serif">English Comprehension</h2>
      <p>
        English comprehension is the second domain in Paper 1 of the Secondary Transfer Test. Children read one or more passages and answer multiple-choice questions about meaning, inference, vocabulary in context, and authorial intent.
      </p>
      <h3 className="text-primary font-serif">What is tested</h3>
      <ul>
        <li><strong>Literal comprehension</strong> — identifying information stated directly in the passage</li>
        <li><strong>Inference</strong> — drawing conclusions not explicitly stated but implied by the text</li>
        <li><strong>Vocabulary in context</strong> — selecting the meaning of a word as used in a specific sentence</li>
        <li><strong>Author technique and purpose</strong> — identifying why a writer made a specific language choice</li>
        <li><strong>Summary and structure</strong> — understanding how a passage is organised and what its key points are</li>
      </ul>
      <h3 className="text-primary font-serif">Where children commonly lose marks</h3>
      <p>
        Comprehension is a two-phase challenge: first reading the passage, then answering questions — all within a strict time limit. Children who spend too long reading and not enough time answering questions often fail to complete the section, even if they understand the text well. Our platform models this two-phase timing explicitly, providing separate time allocations for reading and response, consistent with how the real test manages comprehension passages.
      </p>

      <h2 className="text-primary font-serif">Timed Conditions and Pace Modelling</h2>
      <p>
        Accuracy alone does not predict test performance. A question answered correctly in 90 seconds is effectively a failed question in a test where the average available time is 35–45 seconds per item. Our readiness check engine tracks time-per-question against expected section pacing and uses this to identify pace risk — the specific sections where a child's working speed creates a danger of not completing the paper, regardless of their accuracy on questions they do attempt.
      </p>
      <p>
        This pacing data is incorporated into the readiness forecast and surfaces as one of the three priority actions parents receive after each readiness check. A child who is accurate but slow in a specific domain receives targeted pace drills for that domain — not just more accuracy practice. This distinction is one of the most practical ways this platform differs from generic question banks.
      </p>

      <h2 className="text-primary font-serif">Difficulty Weighting</h2>
      <p>
        Our question bank is divided into Easy, Medium, and Hard difficulty bands across all four domains. The readiness check draws questions from each band in proportions that approximate the real test difficulty distribution — approximately 40% Easy, 40% Medium, and 20% Hard. This means the readiness band and forecast score reflect performance against a realistic test difficulty, not against a question set that is either too forgiving or artificially harder than the actual assessment.
      </p>

      <h2 className="text-primary font-serif">Frequently Asked Questions</h2>
      {faqItems.map((item, i) => (
        <div key={i}>
          <h3 className="text-primary font-serif">{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

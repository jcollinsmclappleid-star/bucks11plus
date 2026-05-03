import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Familiarisation Test" },
];

const faqItems = [
  {
    question: "What is the Bucks 11 Plus familiarisation test?",
    answer: "The familiarisation test is a short sample paper published by The Buckinghamshire Grammar Schools (TBGS) each year. It is intended to give children a brief preview of the question formats and the timing structure they will encounter on test day. It is not a full mock and it does not give parents a forecast score.",
  },
  {
    question: "When is the familiarisation test released?",
    answer: "The familiarisation test is typically made available in the summer term of Year 5, in the months leading up to the September test date. The exact release date varies year to year and is announced via the Buckinghamshire Council and TBGS websites once registration opens.",
  },
  {
    question: "Is the familiarisation test the same as the real Bucks 11+?",
    answer: "No. The familiarisation test is a small sample of the question types — it is shorter, easier to navigate at home, and is not standardised. The real Buckinghamshire Secondary Transfer Test is longer, strictly timed under exam conditions, and produces a standardised score against the 121 qualifying threshold.",
  },
  {
    question: "Can I tell from the familiarisation test whether my child will pass?",
    answer: "No — and that is the most important thing for parents to understand. The familiarisation test is not designed as an assessment. It does not produce a forecast score, it does not benchmark against 121, and a child who completes it confidently can still fall well below the qualifying standard on the real test. To gauge readiness, you need a properly benchmarked diagnostic.",
  },
  {
    question: "Where do I find the official familiarisation test?",
    answer: "The official familiarisation materials are published on The Buckinghamshire Grammar Schools (TBGS) website (buckinghamshire-grammar-schools.org). The Buckinghamshire Council website also links to the most current version when registration opens for that year's cohort.",
  },
];

export default function FamiliarisationTest() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Familiarisation Test (2026) – What It Is & How to Use It"
        description="Understand the official Bucks 11 Plus familiarisation test — when it's released, what it covers, what it does and doesn't tell you about your child's readiness, and how to use it well."
        canonicalPath="/bucks-11-plus-familiarisation-test"
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

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-familiarisation">
          The Bucks 11+ Familiarisation Test
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          What the official familiarisation paper actually is, what it tells you, and what it cannot tell you about your child's readiness for the Buckinghamshire Secondary Transfer Test.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">What Is the Familiarisation Test?</h2>
      <p>
        The Bucks 11+ familiarisation test is a short sample paper published each year by <strong>The Buckinghamshire Grammar Schools (TBGS)</strong>. Its sole purpose is to allow children to encounter the question formats, the answer-sheet layout, and the basic structure of the assessment before sitting it for real.
      </p>
      <p>
        It is not a mock exam. It is not standardised. It is not graded against the <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">121 qualifying threshold</Link>. It exists so that no child arrives on test day having never seen a multiple-choice 11+ paper before.
      </p>

      <h2 className="text-primary font-serif">When Is It Released?</h2>
      <p>
        The familiarisation test is typically made available in the summer term of Year 5, in the months leading up to the September test date. The exact release date varies — TBGS and Buckinghamshire Council publish the current year's materials once registration opens, usually in May or June.
      </p>
      <p>
        For full registration and test-date timing, see our <Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Bucks 11+ admissions timeline</Link>.
      </p>

      <h2 className="text-primary font-serif">What's Actually in It</h2>
      <p>
        The familiarisation test contains a small number of questions across each of the four GL Assessment domains:
      </p>
      <ul>
        <li><strong>Verbal Reasoning</strong> — a handful of word and letter pattern questions illustrating the main question types</li>
        <li><strong>Non-Verbal Reasoning</strong> — sample shape, sequence and pattern questions</li>
        <li><strong>Mathematics</strong> — a few worked examples covering the breadth of topics</li>
        <li><strong>English Comprehension</strong> — a short passage with example questions</li>
      </ul>
      <p>
        It also walks through the audio instructions format, the answer-sheet conventions, and how the timing is structured for each section.
      </p>

      <h2 className="text-primary font-serif">What It Tells You — And What It Doesn't</h2>
      <p>
        The familiarisation test answers one question and one question only: <em>does my child understand how to navigate the paper?</em> If they can follow the instructions, mark answers correctly, and move through the question types without confusion, the test has done its job.
      </p>
      <p>
        It does <strong>not</strong> tell you:
      </p>
      <ul>
        <li>Whether your child will reach the 121 qualifying score</li>
        <li>How they perform under timed conditions across a full-length paper</li>
        <li>Where the specific gaps are in vocabulary, reasoning fluency, or arithmetic speed</li>
        <li>How they compare to the wider cohort of Year 6 children sitting the test</li>
      </ul>
      <p>
        Many parents make the mistake of treating completion of the familiarisation test as a green light. A child who finishes it comfortably can still fall well below the qualifying standard on the real test — and a child who struggles with one or two questions can still qualify comfortably. It is a navigation tool, not an assessment.
      </p>

      <h2 className="text-primary font-serif">How to Use It Well</h2>
      <p>
        The familiarisation test is most valuable when used in the final two to three weeks before test day:
      </p>
      <ul>
        <li>Sit it once in a calm environment so your child sees the formats</li>
        <li>Walk through the audio instructions together so the test-day rhythm is familiar</li>
        <li>Discuss any question types your child finds unfamiliar and add focused practice for those</li>
        <li>Do not repeat it multiple times — the value diminishes quickly once the questions are memorised</li>
      </ul>

      <h2 className="text-primary font-serif">The Limitation: One Snapshot, No Score</h2>
      <p>
        Because the familiarisation test produces no standardised score, parents have no objective way of knowing whether their child is on track. This is the main reason many families combine the official familiarisation paper with a properly benchmarked diagnostic.
      </p>
      <p>
        A diagnostic measures both accuracy and pace, breaks performance down by subject and sub-topic, and produces an indicative readiness score against the 121 qualifying standard. It tells you what to fix, in what order, and how much each gap is worth — turning the familiarisation paper from a navigation rehearsal into a measurable starting point for preparation.
      </p>

      <h2 className="text-primary font-serif">Going Beyond the Familiarisation Test</h2>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link> is designed to be used alongside the official familiarisation test. It provides what TBGS does not: an indicative readiness score against the 121 qualifying standard, a breakdown of strengths and weaknesses across all four GL Assessment domains, and the three highest-impact priorities to fix next.
      </p>
      <p>
        For a deeper look at the test itself, see our <Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">Secondary Transfer Test overview</Link> and <a href="/bucks-11-plus-sample-questions" className="text-primary hover:underline">sample questions guide</a>.
      </p>

      <ChildExperienceCTA />
      <ContentCTA heading="Familiarisation in real exam format" subhead="An 8-minute timed check uses the same Bucks STT structure — section format, pace, GL-style questions." ctaLabel="Try the format now" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">The Secondary Transfer Test Explained</Link></li>
          <li><Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">The 121 Qualifying Score Explained</Link></li>
          <li><Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Bucks 11+ Admissions Timeline</Link></li>
          <li><Link href="/bucks-11-plus-mock-test" className="text-primary hover:underline">Mock Tests vs Familiarisation</Link></li>
          <li><a href="/bucks-11-plus-sample-questions" className="text-primary hover:underline">Sample Questions by Domain</a></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

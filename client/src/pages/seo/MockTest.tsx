import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Mock Tests" },
];

const faqItems = [
  {
    question: "What is a Bucks 11+ mock test?",
    answer: "A mock test is a full-length practice paper sat under timed exam conditions, designed to simulate the real Buckinghamshire Secondary Transfer Test as closely as possible. A proper mock includes the correct number of questions per section, the actual time limits, the same multiple-choice answer-sheet format, and ideally produces a practice score on the 121 scale alongside a section breakdown.",
  },
  {
    question: "When should my child sit their first mock test?",
    answer: "Most families benefit from a first mock in the spring or early summer of Year 5 — six to nine months before the September test date. This gives enough time to act on what the mock reveals. A mock sat too early in preparation can be dispiriting; one sat too late leaves no time to address gaps.",
  },
  {
    question: "How many mock tests should my child sit?",
    answer: "Quality matters more than quantity. Three or four well-spaced mocks across Year 5 and Year 6, with each followed by structured review and targeted practice, is more valuable than a dozen mocks done back-to-back. The point of a mock is the diagnostic information it produces, not the practice itself.",
  },
  {
    question: "Are mock test scores predictive of the real test?",
    answer: "A well-constructed, properly standardised mock taken in test conditions is the best available predictor of real test performance. The closer the mock mirrors the real test in format, timing and difficulty, the more reliable the forecast. Mocks taken at home without timing, or with parental help, produce inflated and misleading scores.",
  },
];

export default function MockTest() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Bucks 11 Plus Mock Test (2026) – When, How & Why They Matter"
        description="A complete guide to Bucks 11+ mock tests: when to sit them, what makes a good mock, how to interpret results, and how mocks differ from practice papers and the official familiarisation test."
        canonicalPath="/bucks-11-plus-mock-test"
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-mock-test">
          Bucks 11+ Mock Tests
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A full-length, properly timed mock test is the single most informative thing your child can do during 11+ preparation. Here is what makes a good mock, when to sit one, and how to use the results.
        </p>
      </div>


      <SeoPageProductLead />

      <h2 className="text-primary font-serif">What a Mock Test Actually Is</h2>
      <p>
        A mock test is a full-length practice paper that closely mirrors the real Bucks Secondary Transfer Test in format, timing and difficulty. Properly constructed, it produces a forecast score, a section-by-section breakdown, and timing data — turning preparation from guesswork into measurable improvement.
      </p>
      <p>
        A mock is not the same as a practice paper, a topic drill, or the official <Link href="/bucks-11-plus-familiarisation-test" className="text-primary hover:underline">familiarisation test</Link>. The familiarisation test shows your child the format. A practice paper builds skills in one section. A mock combines all of it under exam conditions and tells you, with reasonable accuracy, how your child is likely to perform on test day.
      </p>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">How a Mock Differs from Practice</h2>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-mock-vs-practice">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Element</th>
              <th className="text-left p-3 font-semibold text-primary">Practice Paper</th>
              <th className="text-left p-3 font-semibold text-primary">Mock Test</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Length</td><td className="p-3 text-slate-600">One section at a time</td><td className="p-3 text-slate-600">All four sections in one sitting</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Timing</td><td className="p-3 text-slate-600">Often relaxed</td><td className="p-3 text-slate-600">Strict, matches real test</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Environment</td><td className="p-3 text-slate-600">Casual</td><td className="p-3 text-slate-600">Quiet, exam-like</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Scoring</td><td className="p-3 text-slate-600">Raw mark or percentage</td><td className="p-3 text-slate-600">Practice score on the 121 scale</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Purpose</td><td className="p-3 text-slate-600">Build skill in one area</td><td className="p-3 text-slate-600">Measure overall readiness</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Frequency</td><td className="p-3 text-slate-600">Daily or weekly</td><td className="p-3 text-slate-600">Every 4–8 weeks</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">When Should Your Child Sit Their First Mock?</h2>
      <p>
        Sit the first mock once your child has had at least three months of structured preparation across all four GL Assessment domains. For most families, this means the spring or early summer of Year 5.
      </p>
      <p>
        Sitting a mock too early — before any preparation — produces a low score that demoralises a child without giving you actionable information you didn't already have. Sitting one too late, in August before the September test, leaves no time to act on the gaps it reveals.
      </p>
      <p>
        A reasonable cadence for most families:
      </p>
      <ul>
        <li><strong>Mock 1</strong> — late spring of Year 5 (April–May). Establishes a baseline and reveals priority gaps.</li>
        <li><strong>Mock 2</strong> — late summer of Year 5 (August). Tests whether priority gaps have closed and identifies new ones.</li>
        <li><strong>Mock 3</strong> — late spring of Year 6 (May–June). Major checkpoint with three months until the real test.</li>
        <li><strong>Mock 4</strong> — late August (two weeks before the test). Final calibration, not a learning event.</li>
      </ul>

      <h2 className="text-primary font-serif">What a Good Mock Test Includes</h2>
      <p>
        Not all mocks are created equal. A mock that produces useful, predictive information has all of the following:
      </p>
      <ul>
        <li><strong>The correct number of questions per section</strong> — typically 50 across the full paper structure used in Bucks</li>
        <li><strong>Strict timing</strong> matching real test conditions — approximately 35–50 seconds per question</li>
        <li><strong>Multiple-choice answer sheet</strong> separate from the question booklet, as in the real test</li>
        <li><strong>Audio instructions</strong> for the comprehension paper, which uses a two-phase reading-then-answering structure</li>
        <li><strong>A practice score on the 121 scale</strong> — not just a raw percentage</li>
        <li><strong>Section-level analytics</strong> showing strengths, weaknesses, and pacing per domain</li>
        <li><strong>A clear set of priority next-steps</strong> based on where the most points were lost</li>
      </ul>

      <h2 className="text-primary font-serif">How to Read Mock Test Results</h2>
      <p>
        A mock score is only useful when interpreted properly. The headline number matters less than the breakdown:
      </p>
      <ul>
        <li><strong>Section variance.</strong> A child scoring 85% in Maths but 60% in NVR has a clear priority. A child scoring 70% across all four sections needs a different conversation.</li>
        <li><strong>Pacing data.</strong> If accuracy in the first half of a section is high but the second half drops significantly, the issue is stamina or pacing — not knowledge.</li>
        <li><strong>Question-type patterns.</strong> Sub-topic data (synonyms vs cloze, spatial sequences vs rotation) tells you exactly what to drill, not just which subject to spend time on.</li>
        <li><strong>The trajectory across mocks.</strong> A single mock is a snapshot. Three mocks across six months tell a story — improving, plateauing, or regressing.</li>
      </ul>

      <h2 className="text-primary font-serif">Mock Tests on Bucks 11 Plus Tests</h2>
      <p>
        Our paid plans include full-length GL-style mock exams across all four domains, sat under proper timed conditions, with a practice score on the 121 scale. Each mock produces a section breakdown, a pacing analysis, a stamina report, and a ranked list of the highest-impact gaps to address before the next mock.
      </p>
      <p>
        Free users can take our <Link href="/free-diagnostic" className="text-primary hover:underline">8-minute readiness check</Link>, which is shorter than a full mock but uses the same scoring methodology — giving you a reliable first indicator of where your child stands without committing to a subscription.
      </p>

      <h2 className="text-primary font-serif">Beyond a Single Mock: Tracking Progress</h2>
      <p>
        The single most valuable thing about repeated mocks is the trajectory they reveal. A child whose forecast score climbs from 108 → 115 → 119 → 122 across four mocks has a fundamentally different preparation story than a child stuck at 115 across all four — even if both end up in roughly the same place.
      </p>
      <p>
        That trajectory data shapes what you do next. A climbing trajectory means "keep going". A flat trajectory means "change approach". A descending trajectory (which does happen, usually due to over-tiredness) means "pause and rest". You cannot make any of these calls without repeated, comparable mocks.
      </p>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <ContentCTA heading="A real-format mock in 8 minutes" subhead="A free GL-style readiness check with timed sections and a per-section breakdown — like a mini mock exam." ctaLabel="Take the readiness check" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Mock Test Variants</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/11-plus-mock-test-online-free" className="text-primary hover:underline">Free online 11+ mock test (GL-style)</Link></li>
          <li><Link href="/11-plus-mock-test-40-questions" className="text-primary hover:underline">40-question 11+ mock test</Link></li>
          <li><Link href="/11-plus-mock-test-50-questions" className="text-primary hover:underline">50-question 11+ mock test</Link></li>
          <li><Link href="/11-plus-mock-test-with-timer" className="text-primary hover:underline">Timed 11+ mock test</Link></li>
          <li><Link href="/11-plus-mock-exam-at-home" className="text-primary hover:underline">11+ mock exam at home — full setup guide</Link></li>
        </ul>
      </div>

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/bucks-11-plus-familiarisation-test" className="text-primary hover:underline">The Familiarisation Test (and How It Differs)</Link></li>
          <li><a href="/bucks-11-plus-past-papers" className="text-primary hover:underline">Bucks 11+ Past Papers</a></li>
          <li><a href="/bucks-11-plus-sample-questions" className="text-primary hover:underline">Sample Questions</a></li>
          <li><Link href="/11-plus-30-days-to-go" className="text-primary hover:underline">30 Days to Go: Final-Month Mock Schedule</Link></li>
          <li><Link href="/free-11-plus-resources" className="text-primary hover:underline">Complete Free 11+ Resources Library</Link></li>
        </ul>
      </div>      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

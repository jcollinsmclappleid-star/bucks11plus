import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Bucks vs CEM vs Kent 11+" },
];

const faqItems = [
  {
    question: "Is the Bucks 11+ the same as the CEM 11+?",
    answer: "No. The Bucks 11+ is produced by GL Assessment and covers four named domains (Verbal Reasoning, Non-Verbal Reasoning, Maths, English Comprehension). The CEM 11+ is produced by the Centre for Evaluation and Monitoring at Durham University and uses different paper structures, often blending verbal and numerical reasoning into combined papers. They share a similar purpose but the question style, format and preparation approach are meaningfully different.",
  },
  {
    question: "Is the Bucks 11+ the same as the Kent 11+?",
    answer: "No. The Kent 11+ is also a GL Assessment test, so it shares some question formats with the Bucks 11+, but the papers, qualifying threshold, registration process and grammar school admission criteria are entirely separate. A child preparing for the Kent test should not be considered prepared for the Bucks test, and vice versa.",
  },
  {
    question: "Which test does my area use?",
    answer: "It depends entirely on which local authority's grammar schools you are applying to — not where you live. Many families apply to grammar schools in counties they don't live in (for example a family in Hertfordshire applying to Bucks grammar schools). Always check the admissions arrangements of the specific schools you are targeting, as they determine which test your child must sit.",
  },
  {
    question: "Can my child sit more than one 11+ test?",
    answer: "Yes — many families register their child for multiple tests across different counties to maximise grammar school options. Each test must be registered for separately, has its own date, and produces a separate result. Children sitting multiple tests need preparation tailored to each, as the question styles and pacing requirements differ.",
  },
];

export default function ExamsCompared() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11+ vs CEM vs Kent 11+ – How They Differ (2026 Guide)"
        description="Compare the Bucks 11+ with the CEM 11+ and Kent 11+: producer, format, question style, qualifying scores, and what makes each different. Find out which test your area uses."
        canonicalPath="/bucks-11-plus-vs-cem-vs-kent"
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-exams-compared">
          Bucks 11+ vs CEM vs Kent 11+
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The 11+ is not one test — it is a family of tests, each set by different organisations and used by different counties. Here is how the main UK variants differ and which your area is likely to use.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Why "The 11+" Isn't One Test</h2>
      <p>
        Parents searching for "11+ practice" often arrive at the same misconception: that the 11+ is a single national exam. It isn't. The 11+ is a category of selective entrance assessments used by grammar schools across England, but the actual papers your child sits depend on which local authority's schools you are applying to.
      </p>
      <p>
        Two main organisations produce the papers used across the country: <strong>GL Assessment</strong> and the <strong>Centre for Evaluation and Monitoring (CEM)</strong>. Buckinghamshire and Kent both use GL Assessment, but with different papers, different qualifying thresholds, and different registration processes. Other counties — including parts of Birmingham, Reading, and the historic Northern Ireland AQE — have used CEM-style assessments. Preparation that is appropriate for one is not necessarily appropriate for the other.
      </p>

      <h2 className="text-primary font-serif">The Bucks 11+ at a Glance</h2>
      <ul>
        <li><strong>Producer:</strong> GL Assessment</li>
        <li><strong>Format:</strong> Four separate papers — Verbal Reasoning, Non-Verbal Reasoning, Mathematics, English Comprehension</li>
        <li><strong>Question style:</strong> Mostly multiple-choice with separate answer sheets</li>
        <li><strong>Qualifying score:</strong> 121 standardised score (age and difficulty adjusted)</li>
        <li><strong>Sat by:</strong> Year 6 children, typically in the first two weeks of September</li>
        <li><strong>Registration:</strong> Direct with Buckinghamshire Council in the summer term of Year 5</li>
      </ul>
      <p>
        Full details: <Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">The Buckinghamshire Secondary Transfer Test</Link>.
      </p>

      <h2 className="text-primary font-serif">The CEM 11+ at a Glance</h2>
      <ul>
        <li><strong>Producer:</strong> Centre for Evaluation and Monitoring (CEM), based at Durham University</li>
        <li><strong>Format:</strong> Two combined papers blending Verbal Reasoning, Non-Verbal Reasoning, Mathematics and Comprehension into longer mixed-format assessments</li>
        <li><strong>Question style:</strong> A mix of multiple-choice and short written answers; less predictable section structure year to year</li>
        <li><strong>Qualifying score:</strong> Varies by region and school — there is no single national threshold</li>
        <li><strong>Sat by:</strong> Year 6 children, typically in September</li>
        <li><strong>Used by:</strong> Historically used in parts of Birmingham, the Wolverhampton consortium, Walsall, and others — though several CEM regions have moved to GL or other providers in recent years</li>
      </ul>

      <h2 className="text-primary font-serif">The Kent 11+ at a Glance</h2>
      <ul>
        <li><strong>Producer:</strong> GL Assessment (same producer as Bucks)</li>
        <li><strong>Format:</strong> English, Maths, and Reasoning papers — different paper structure to Bucks despite shared producer</li>
        <li><strong>Question style:</strong> GL multiple-choice format</li>
        <li><strong>Qualifying score:</strong> Standardised score with separate thresholds set by Kent Test outcomes; not the same numerical threshold as Bucks</li>
        <li><strong>Sat by:</strong> Year 6 children, typically in early September</li>
        <li><strong>Registration:</strong> Direct with Kent County Council</li>
      </ul>

      <h2 className="text-primary font-serif">Side-by-Side Comparison</h2>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-exams-compared">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Feature</th>
              <th className="text-left p-3 font-semibold text-primary">Bucks 11+</th>
              <th className="text-left p-3 font-semibold text-primary">CEM 11+</th>
              <th className="text-left p-3 font-semibold text-primary">Kent 11+</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Producer</td><td className="p-3 text-slate-600">GL Assessment</td><td className="p-3 text-slate-600">CEM (Durham)</td><td className="p-3 text-slate-600">GL Assessment</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Number of papers</td><td className="p-3 text-slate-600">4 (separate domains)</td><td className="p-3 text-slate-600">2 (combined)</td><td className="p-3 text-slate-600">3 (English, Maths, Reasoning)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Predictability of format</td><td className="p-3 text-slate-600">High</td><td className="p-3 text-slate-600">Lower (varies year to year)</td><td className="p-3 text-slate-600">High</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Qualifying threshold</td><td className="p-3 text-slate-600">121 standardised</td><td className="p-3 text-slate-600">Varies by region</td><td className="p-3 text-slate-600">Set by Kent Test outcomes</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Test month</td><td className="p-3 text-slate-600">Early September</td><td className="p-3 text-slate-600">September</td><td className="p-3 text-slate-600">Early September</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Registration body</td><td className="p-3 text-slate-600">Bucks Council</td><td className="p-3 text-slate-600">Local consortium</td><td className="p-3 text-slate-600">Kent County Council</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Why a Bucks-Specific Platform Matters</h2>
      <p>
        Generic 11+ practice platforms tend to teach the broad shape of the exam — vocabulary, arithmetic, basic reasoning patterns. They are useful for foundational work, but they cannot prepare a child for the specific format, pacing demands, or qualifying threshold of the Bucks test.
      </p>
      <p>
        A Bucks-specific platform aligns to the four GL Assessment domains as separately tested papers, shows practice scores on the 121 scale that Bucks parents know, and uses the timing structure your child will actually encounter on test day. That alignment matters because a child who has prepared well for a CEM-style paper has not necessarily prepared well for a GL-style Bucks paper — and vice versa.
      </p>

      <h2 className="text-primary font-serif">Which Test Does My Area Use?</h2>
      <p>
        The test your child sits depends entirely on which grammar schools you are applying to, not on where you live. Many families in Hertfordshire, Berkshire, Oxfordshire and Northamptonshire apply to Bucks grammar schools because of the geographic proximity. Equally, families living in Bucks may apply to schools in neighbouring counties using different tests.
      </p>
      <p>
        To check: look up each grammar school you are interested in, find their admissions page, and confirm which test feeds into their qualifying decision. For Buckinghamshire grammar schools the test is always the same — the Bucks Secondary Transfer Test. See our <Link href="/bucks-grammar-schools" className="text-primary hover:underline">directory of all 13 Bucks grammar schools</Link>.
      </p>

      <ChildExperienceCTA />
      <ContentCTA heading="Take a Bucks-specific check" subhead="Other 11+ regions test differently. Get an 8-minute check designed for the Bucks Secondary Transfer Test." ctaLabel="Start the Bucks readiness check" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">The Bucks Secondary Transfer Test Explained</Link></li>
          <li><Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">The 121 Qualifying Score Explained</Link></li>
          <li><Link href="/bucks-grammar-schools" className="text-primary hover:underline">All 13 Bucks Grammar Schools</Link></li>
          <li><Link href="/bucks-11-plus-registration" className="text-primary hover:underline">How to Register for the Bucks 11+</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

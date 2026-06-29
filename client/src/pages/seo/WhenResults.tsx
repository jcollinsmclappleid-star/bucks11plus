import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "When Do Results Come Out?" },
];

const faqItems = [
  {
    question: "When are Bucks 11+ results released in 2026?",
    answer: "Bucks 11+ results for the September 2026 test are expected to be released to parents in mid-October 2026 — typically between the 10th and 17th of the month. The exact date is published by Buckinghamshire Council in late summer.",
  },
  {
    question: "How will I receive my child's results?",
    answer: "Buckinghamshire Council sends results by letter to your registered address and also publishes them via the parent portal on the Council website. Most parents receive both at roughly the same time, typically on a Friday morning in mid-October.",
  },
  {
    question: "Can I get the result earlier?",
    answer: "No. Results are embargoed until the official release date so all families receive them simultaneously. Schools, tutors and platforms are not given advance access.",
  },
  {
    question: "What does the results letter contain?",
    answer: "The letter shows your child's standardised score (a single number, typically between 80 and 140) and confirms whether they have met the 121 qualifying threshold. It does not break the score down by section — only the overall composite is published.",
  },
  {
    question: "What's the difference between qualifying and being offered a place?",
    answer: "Qualifying at 121 makes a child eligible for a grammar school place. The actual offer happens on National Offer Day (1 March) once all applications have been processed. Whether a qualifying child is offered a place depends on each school's oversubscription criteria — usually distance, with sibling priority for some.",
  },
];

export default function WhenResults() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="When Do Bucks 11+ Results Come Out? (2026 Dates)"
        description="The exact date Bucks 11+ results are released, how they reach parents, what the letter contains, and what happens next on the path to a school offer."
        canonicalPath="/when-do-bucks-11-plus-results-come-out"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-when-results">
          When Do Bucks 11+ Results Come Out?
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The release date, how the letter arrives, and what happens next.
        </p>
      </div>


      <SeoPageProductLead />
      <h2 className="text-primary font-serif">The Short Answer</h2>
      <div className="not-prose my-6">
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
          <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-2">2026 Results Release</div>
          <div className="text-3xl font-bold text-primary font-serif">Mid-October 2026</div>
          <div className="text-sm text-slate-600 mt-2">Typically a Friday between 10–17 October. Confirmed by the Council in late summer.</div>
        </div>
      </div>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">How Results Reach Parents</h2>
      <p>
        Buckinghamshire Council releases results in two channels at the same time on the published date:
      </p>
      <ol>
        <li><strong>By letter</strong> — sent first-class to your registered address, typically arriving on the day of release or the following morning.</li>
        <li><strong>Via the parent portal</strong> — the Council's online system, accessed using the login you created during registration.</li>
      </ol>
      <p>
        Both channels release results at the same hour. Parents who do not receive the letter within 48 hours of the publication date should contact the Council's admissions team.
      </p>

      <h2 className="text-primary font-serif">What the Letter Contains</h2>
      <p>The results letter gives you:</p>
      <ul>
        <li><strong>A single standardised score</strong> — usually between 80 and 140, with 100 representing the cohort average and 121 representing the qualifying threshold.</li>
        <li><strong>A statement of qualification</strong> — confirming whether the child has met the 121 standard.</li>
        <li><strong>Information about the appeals process</strong> for parents whose children did not qualify.</li>
      </ul>
      <p>
        The letter does <strong>not</strong> break the score down by section (Verbal Reasoning, Non-Verbal Reasoning, Maths, Comprehension). Only the overall composite is reported to parents — section-level data is held by GL Assessment but not published.
      </p>

      <h2 className="text-primary font-serif">What Happens Next</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Date</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Day of results</td><td className="p-3">Read the letter; check the standardised score and qualification status</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Days 1–14 after results</td><td className="p-3">Decide which schools to list on the Common Application Form (up to 6 preferences)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">31 October</td><td className="p-3">Submit the Common Application Form to your home local authority</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">1 March (following year)</td><td className="p-3">National Offer Day — school place is confirmed</td></tr>
            <tr><td className="p-3 font-medium">March – September</td><td className="p-3">Accept place, join waiting lists for higher preferences if relevant, or appeal a refusal</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">If Your Child Did Not Qualify</h2>
      <p>
        Roughly 70% of Bucks 11+ candidates do not meet the 121 threshold each year. For those families, the immediate priorities are:
      </p>
      <ul>
        <li><strong>Read the appeal information</strong> in the letter carefully. Appeals exist but have low statistical success rates — they are appropriate for clear procedural concerns, less so as a routine next step.</li>
        <li><strong>Research upper schools</strong> in your area. Buckinghamshire's upper schools include some of the highest-performing non-selective state schools in the country.</li>
        <li><strong>Consider Year 9 entry</strong> at a small number of grammar schools (notably Dr Challoner's Grammar School) for children who have demonstrated continued strong progress.</li>
        <li>For more options, see our guide on what to do if your <Link href="/learn/my-child-did-not-pass-the-bucks-11-plus" className="text-primary hover:underline">child did not pass the Bucks 11+</Link>.</li>
      </ul>

      <h2 className="text-primary font-serif" id="faq">Frequently Asked Questions</h2>
      <div className="not-prose space-y-4 my-6">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="font-semibold text-primary mb-2 font-serif">{item.question}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      <ContentCTA heading="Don't wait for the official letter" subhead="An 8-minute check gives an indicative readiness score against 121 — months before the real result arrives." ctaLabel="Get an indicative result" />
      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Past Papers" },
];

const faqItems = [
  {
    question: "Are real Bucks 11+ past papers available to download?",
    answer: "No. Buckinghamshire Council and GL Assessment do not release the live test papers — they are reused (in part) across years and are protected by copyright. Any website offering 'official' downloadable Bucks past papers is either misleading or illegally hosting copyrighted material. The closest legitimate equivalent is the official Familiarisation Test published by the Council each year.",
  },
  {
    question: "What's the difference between a past paper and a practice paper?",
    answer: "A past paper is a previously-used real exam paper, released by the awarding body after the test. A practice paper is a new paper written in the same style and at the same difficulty level, designed to mimic the real test. For the Bucks 11+, only practice papers are legally available — but well-written practice papers from established publishers and platforms are functionally equivalent for preparation purposes.",
  },
  {
    question: "Are CGP, Bond and Schofield & Sims practice papers any good?",
    answer: "All three publishers produce competent practice material. CGP papers tend to be slightly easier than the real test; Bond papers are well-graded across difficulty levels and widely used; Schofield & Sims are concise and exam-style. None replicate the on-screen, interactive format of modern GL papers — which is why timed online practice on the actual question types matters in the final months.",
  },
  {
    question: "What does the Familiarisation Test cover?",
    answer: "The Familiarisation Test is the only official material released by Buckinghamshire Council. It is a short, demo-format paper containing examples from each domain (Verbal Reasoning, Non-Verbal Reasoning, Maths, Comprehension). It exists to demystify the format, not to predict performance — it is far shorter than the real test and is not score-comparable.",
  },
];

export default function PastPapers() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Past Papers – What's Available & What Isn't (2026)"
        description="The honest guide to Bucks 11+ past papers: what's actually available, why no real past papers are released, and the best practice papers to use instead."
        canonicalPath="/bucks-11-plus-past-papers"
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-past-papers">
          Bucks 11+ Past Papers
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The honest guide to what's available, what isn't, and what to use instead.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Are Real Past Papers Available?</h2>
      <p>
        <strong>No.</strong> Buckinghamshire Council and GL Assessment — the exam board that produces the test — do not release the live papers used in the Secondary Transfer Test. There are two reasons. First, GL Assessment reuses sections of papers across multiple years, so releasing them would compromise future tests. Second, the papers are copyright-protected commercial material.
      </p>
      <p>
        Any website offering "official 2024 Bucks 11+ past paper" or similar is either misleading parents (selling generic practice papers under a misleading label) or hosting copyrighted material illegally. Neither is reliable preparation.
      </p>

      <h2 className="text-primary font-serif">What Is Officially Available?</h2>
      <p>
        Buckinghamshire Council publishes the <strong>Familiarisation Test</strong> each year — a short, demo-format paper with examples from each of the four test domains. It exists to introduce children to the on-screen format, the question types, and the timing pace. Every registered family receives access in the months before the test.
      </p>
      <p>
        The Familiarisation Test is the only official material released. It is not score-comparable with the real test (it's far shorter), but it is essential — every child should sit it under timed conditions at least once before September.
      </p>
      <p>
        For more on what to expect, see our <Link href="/bucks-11-plus-familiarisation-test" className="text-primary hover:underline">guide to the Familiarisation Test</Link>.
      </p>

      <h2 className="text-primary font-serif">Best Alternatives — Practice Papers</h2>
      <p>
        Because no real past papers exist, preparation relies on <strong>practice papers</strong>: new papers written in the same GL style at equivalent difficulty. The most widely used sources are:
      </p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-practice-papers">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Source</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Strengths</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Limitations</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Bond 11+</td>
              <td className="p-3">Well-graded across difficulty levels; covers all four domains; large volume of material.</td>
              <td className="p-3">Print-only; doesn't replicate the on-screen test interface.</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">CGP 11+ GL</td>
              <td className="p-3">Clear layout; good for early-stage preparation in Year 4–5.</td>
              <td className="p-3">Generally a touch easier than the real test — over-reliance can produce false confidence.</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Schofield &amp; Sims</td>
              <td className="p-3">Concise, exam-style; good final-weeks revision.</td>
              <td className="p-3">Less coverage than Bond; print-only.</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">GL Assessment Practice Tests</td>
              <td className="p-3">Written by the same publisher as the real test — closest in style and difficulty.</td>
              <td className="p-3">Limited number of papers available; sold individually.</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Online platforms (e.g. ours)</td>
              <td className="p-3">Replicates the on-screen format, automatic timing, instant marking, score forecast.</td>
              <td className="p-3">Quality varies by platform — look for one aligned to GL question types specifically.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">How to Use Practice Papers Effectively</h2>
      <ol>
        <li><strong>Don't start too early.</strong> Full timed papers are most useful in the final 8–12 weeks. Earlier than that, focus on individual question types and skill-building.</li>
        <li><strong>Always time them.</strong> An untimed paper teaches the wrong habit — pacing is half the test.</li>
        <li><strong>Review every error.</strong> A paper completed and not reviewed produces no learning. The post-paper conversation is where the improvement happens.</li>
        <li><strong>Mix sources.</strong> Different publishers test slightly different sub-skills. A child who only ever does Bond papers may struggle with the question variety in the real test.</li>
        <li><strong>Limit volume.</strong> Two or three full timed papers per week in the final month is plenty — children burn out, and repetition with no review beats the purpose.</li>
      </ol>

      <h2 className="text-primary font-serif">The Online Alternative</h2>
      <p>
        Print papers don't replicate the actual test conditions, which since 2013 have been on-screen with mouse-based answering and a fixed countdown. Children who only practise on paper may lose 5–10 standardised points on test day simply from interface unfamiliarity.
      </p>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> uses the same on-screen format as the real test and provides an indicative readiness score against the 121 qualifying standard — a more useful snapshot of test-day readiness than any print paper can provide.
      </p>

      <h2 className="text-primary font-serif" id="faq">Frequently Asked Questions</h2>
      <div className="not-prose space-y-4 my-6">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="font-semibold text-primary mb-2 font-serif">{item.question}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:past-papers" />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

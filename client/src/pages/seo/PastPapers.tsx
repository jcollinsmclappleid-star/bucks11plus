import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { PlatformPrepHero, SecondaryPdfDownloads } from "@/components/shared/PlatformPrepHero";
import { FreeToPlatformPanel, FreeToPlatformStrip } from "@/components/shared/FreeToPlatformPanel";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Past Papers" },
];

const faqItems = [
  {
    question: "Can I download free Bucks 11+ past papers?",
    answer: "Official past papers are not released. For real preparation, Bucks Plus Edge gives access to 2,500+ GL-style questions, timed mocks, and parent analytics. Two free practice PDFs (12 questions each) are also available if you want something to print first.",
  },
  {
    question: "Are real Bucks 11+ past papers available to download?",
    answer: "No. Buckinghamshire Council and GL Assessment do not release the live test papers — they are reused (in part) across years and are protected by copyright. Any website offering 'official' downloadable Bucks past papers is either misleading or illegally hosting copyrighted material. The closest legitimate equivalent is the official Familiarisation Test published by the Council each year.",
  },
  {
    question: "What's the difference between a past paper and a practice paper?",
    answer: "A past paper is a previously-used real exam paper, released by the awarding body after the test. A practice paper is a new paper written in the same style and at the same difficulty level, designed to mimic the real test. For the Bucks 11+, only practice papers are legally available — but well-written practice papers from established publishers and platforms are functionally equivalent for preparation purposes.",
  },
  {
    question: "Are print 11+ practice papers any good?",
    answer: "Established print 11+ workbooks and practice paper packs can build helpful familiarity with question styles, but quality varies and none of them replicate the on-screen, interactive format of the modern GL Assessment test. Print packs are best used for early-stage skill-building; timed on-screen practice on the actual question types is what matters most in the final months before the test.",
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
        title="Bucks 11+ Past Papers & Free Practice Papers Download (2026)"
        description="Official Bucks 11+ past papers don't exist — download two free GL-style practice papers (PDF), see what to use instead, and how to prepare for the Secondary Transfer Test."
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
          Official past papers don't exist — here's why, and what your child actually needs to prepare.
        </p>
      </div>

      <PlatformPrepHero context="past-papers" />

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
        Because no real past papers exist, preparation relies on <strong>practice papers</strong>: new papers written in the same GL style at equivalent difficulty. The two broad categories are:
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
              <td className="p-3 font-medium">Print GL-style practice papers</td>
              <td className="p-3">Widely available from established education publishers; useful for early-stage skill-building and offline timed sittings.</td>
              <td className="p-3">Print-only — does not replicate the on-screen test interface; quality and difficulty vary between titles.</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">GL Assessment familiarisation papers</td>
              <td className="p-3">Written by the same publisher as the real test — closest in style and difficulty.</td>
              <td className="p-3">Limited number of papers available; sold individually.</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">On-screen practice (such as our platform)</td>
              <td className="p-3">Replicates the on-screen format, automatic timing, instant marking, practice score on the 121 scale.</td>
              <td className="p-3">Look for material specifically aligned to GL Assessment question types.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">How to Use Practice Papers Effectively</h2>
      <ol>
        <li><strong>Don't start too early.</strong> Full timed papers are most useful in the final 8–12 weeks. Earlier than that, focus on individual question types and skill-building.</li>
        <li><strong>Always time them.</strong> An untimed paper teaches the wrong habit — pacing is half the test.</li>
        <li><strong>Review every error.</strong> A paper completed and not reviewed produces no learning. The post-paper conversation is where the improvement happens.</li>
        <li><strong>Mix sources.</strong> Different practice paper sets test slightly different sub-skills. A child who only ever does one publisher's papers may struggle with the question variety in the real test.</li>
        <li><strong>Limit volume.</strong> Two or three full timed papers per week in the final month is plenty — children burn out, and repetition with no review beats the purpose.</li>
      </ol>

      <h2 className="text-primary font-serif">The Online Alternative</h2>
      <p>
        Print papers don't replicate the actual test conditions, which since 2013 have been on-screen with mouse-based answering and a fixed countdown. Children who only practise on paper may lose 5–10 standardised points on test day simply from interface unfamiliarity.
      </p>
      <p>
        Our platform gives your child <Link href="/pricing" className="text-primary hover:underline font-semibold">2,500+ timed GL-style questions</Link> in the on-screen format used on test day — with instant marking, full mocks, and an indicative readiness score against 121. That is what replaces past papers for serious preparation.
      </p>

      <FreeToPlatformStrip freeOffer="A handful of free PDFs" />

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
      <FreeToPlatformPanel freeOffer="2 free PDF practice papers (not official past papers)" />
      <SecondaryPdfDownloads />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Related Practice Material</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/bucks-11-plus-free-sample-papers" className="text-primary hover:underline">Free practice papers PDF download (2 papers)</Link></li>
          <li><Link href="/bucks-11-plus-sample-questions" className="text-primary hover:underline">14 worked sample questions online</Link></li>
          <li><Link href="/gl-assessment-past-papers" className="text-primary hover:underline">GL Assessment past papers — what's actually available</Link></li>
          <li><Link href="/gl-assessment-question-types" className="text-primary hover:underline">Every GL Assessment question type explained</Link></li>
          <li><Link href="/11-plus-mock-test-online-free" className="text-primary hover:underline">Free online 11+ mock test</Link></li>
          <li><Link href="/bucks-11-plus-practice-papers-free" className="text-primary hover:underline">Free practice papers</Link></li>
          <li><Link href="/free-11-plus-resources" className="text-primary hover:underline">Complete free 11+ resources library</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

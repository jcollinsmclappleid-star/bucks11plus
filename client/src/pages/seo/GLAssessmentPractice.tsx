import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

export default function GLAssessmentPractice() {
  const path = "/gl-assessment-11-plus-practice";
  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "GL Assessment 11+ Practice" },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="GL Assessment 11+ Practice — How to Prepare for the Bucks Test"
        description="The GL Assessment is the test format used by the Bucks 11+. A guide to its structure, sections, timings and the most effective practice routine."
        canonicalPath={path}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          { "@context": "https://schema.org", "@type": "Article", headline: "GL Assessment 11+ Practice", about: "GL Assessment" },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">GL Assessment</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-gl-practice">
          GL Assessment 11+ Practice
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The Buckinghamshire Secondary Transfer Test is provided by GL Assessment, one of the two main 11+ exam boards in England (the other being CEM). The format, question types and timings of every Bucks 11+ paper are determined by GL — so practice that matches the GL format is the most useful preparation a child can do.
        </p>
      </div>

      <h2 className="text-primary font-serif">What the GL Assessment 11+ Tests</h2>
      <p>
        The Bucks GL Assessment 11+ tests four domains, weighted equally in the final standardised score: Verbal Reasoning, Non-Verbal Reasoning, Mathematics and English Comprehension. Every question is multiple-choice, with answers marked on a separate answer sheet. Children do not write extended answers; they shade a box. This format makes timing strict but also means there are no "half marks" — an answer is either right or wrong.
      </p>

      <h2 className="text-primary font-serif">Section Structure</h2>
      <div className="not-prose grid gap-3 my-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="font-semibold text-primary font-serif">Verbal Reasoning</div>
          <div className="text-sm text-slate-700 mt-1">Cloze, synonyms, antonyms, shuffled sentences, codes, letter sequences and word relationships. Tests vocabulary breadth and language reasoning under time pressure.</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="font-semibold text-primary font-serif">Non-Verbal Reasoning</div>
          <div className="text-sm text-slate-700 mt-1">Matrices, sequences, classifications, rotations, reflections and cube nets. Tests visual pattern recognition and spatial reasoning.</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="font-semibold text-primary font-serif">Mathematics</div>
          <div className="text-sm text-slate-700 mt-1">Roughly 60% word problems, 40% direct calculation. Covers all four operations, fractions, percentages, ratio, time, money, measurement and basic algebra.</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="font-semibold text-primary font-serif">English Comprehension</div>
          <div className="text-sm text-slate-700 mt-1">A long fiction or non-fiction passage followed by 25–30 multiple-choice questions on literal recall, inference, vocabulary in context, and authorial intent.</div>
        </div>
      </div>

      <h2 className="text-primary font-serif">How GL Standardisation Works</h2>
      <p>
        Raw scores from the four sections are converted to standardised scores using GL's age-adjustment formula. Younger children in the cohort (born in late August) receive a small upward adjustment; older children (born in early September) receive a small downward adjustment. The adjusted scores from the four sections are combined into a single standardised score on a 70–141 scale. The qualifying threshold for Buckinghamshire grammar schools is 121.
      </p>
      <p>
        Because of this standardisation, a raw score that would qualify in one year might not qualify in another — the threshold floats slightly with the difficulty of the paper and the spread of the cohort's results. Children who target a comfortable score (125+) rather than the bare minimum protect themselves against year-to-year variation.
      </p>

      <h2 className="text-primary font-serif">Where to Get GL-Style Practice</h2>
      <p>
        GL Assessment publishes a small number of official "familiarisation" papers each year through its public-facing site. These are useful for showing children the format but are too few to use as a sustained practice resource. Most families supplement with publisher practice books (CGP, Bond and Schofield & Sims publish GL-style sets) and online practice platforms that mirror the GL format.
      </p>
      <p>
        The most important thing is that practice papers match the GL format specifically. CEM-style practice — used for the Kent and Birmingham 11+ — has different question types and pacing, and using CEM material to prepare for the Bucks test can mislead a child about what to expect.
      </p>

      <h2 className="text-primary font-serif">The Most Effective GL-Practice Routine</h2>
      <ul>
        <li><strong>Year 5:</strong> Build vocabulary and reading stamina. Light maths practice. One or two diagnostic mocks to identify weak areas.</li>
        <li><strong>Year 5 summer:</strong> Six weeks of structured practice covering all four sections, balanced rather than narrow.</li>
        <li><strong>Year 6 autumn (test term):</strong> Targeted weak-spot work, pacing drills, and a small number of full-length mocks every three weeks.</li>
        <li><strong>Final two weeks:</strong> Reduce volume. Focus on confidence and rest. No new material.</li>
      </ul>

      <ChildExperienceCTA />
      <ContentCTA
        heading="Get a GL-style baseline in 8 minutes"
        subhead="Our free 8-minute diagnostic uses the GL Assessment format and gives you an indicative readiness band against the 121 threshold."
        ctaLabel="Take the free GL-style diagnostic"
      />

      <h2 className="text-primary font-serif">Related Reading</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        <Link href="/gl-assessment-past-papers" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-gl-past-papers"><div className="text-xs text-slate-500">Past Papers</div><div className="font-semibold text-primary font-serif">GL Assessment Past Papers</div></Link>
        <Link href="/gl-assessment-question-types" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-gl-question-types"><div className="text-xs text-slate-500">Question Types</div><div className="font-semibold text-primary font-serif">GL Assessment Question Types</div></Link>
        <Link href="/bucks-gl-alignment" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-bucks-gl-alignment"><div className="text-xs text-slate-500">Bucks Alignment</div><div className="font-semibold text-primary font-serif">How Our Practice Aligns to GL</div></Link>
        <Link href="/bucks-11-plus-vs-cem-vs-kent" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-bucks-vs-cem"><div className="text-xs text-slate-500">Comparison</div><div className="font-semibold text-primary font-serif">Bucks vs CEM vs Kent 11+</div></Link>
      </div>

      <Disclaimer />
    </div>
  );
}

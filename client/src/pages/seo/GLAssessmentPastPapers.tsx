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

export default function GLAssessmentPastPapers() {
  const path = "/gl-assessment-past-papers";
  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "GL Assessment Past Papers" },
  ];

  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="GL Assessment Past Papers — What's Available & How to Use Them"
        description="An honest guide to GL Assessment past papers for the 11+: what is publicly available, what isn't, and how to build a strong practice plan from the resources that exist."
        canonicalPath={path}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          { "@context": "https://schema.org", "@type": "Article", headline: "GL Assessment Past Papers" },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">GL Assessment</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-gl-past-papers">
          GL Assessment 11+ Past Papers
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Real GL Assessment past papers are not freely published. The papers used for the Bucks Secondary Transfer Test are commercial assessment materials, and like most commercial test publishers, GL withholds the actual tests from public release. What is available is a small number of official familiarisation papers and a much larger volume of GL-style practice material from third-party publishers.
        </p>
      </div>

      <SeoPageProductLead />

      <h2 className="text-primary font-serif">Why Real Past Papers Aren't Public</h2>
      <p>
        GL Assessment licenses its papers to local authorities (including Buckinghamshire Council) under terms that prevent public redistribution. Releasing a real paper after a test sitting would compromise question banks that are reused, in modified form, in subsequent years. This is the same approach used by most commercial test publishers worldwide, and it is the reason families searching for "real" past papers will not find them on official sites.
      </p>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">What Is Officially Available</h2>
      <ul>
        <li><strong>GL Assessment familiarisation booklet:</strong> A short publicly available document showing the question format, with a handful of example questions per section. Useful for first exposure; not enough for a sustained practice routine.</li>
        <li><strong>Buckinghamshire Council practice materials:</strong> The council publishes a free familiarisation paper alongside the registration information each year. This is the closest thing to an "official" practice paper for the Bucks test specifically.</li>
        <li><strong>GL Assessment publisher catalogue:</strong> GL itself sells official practice papers (under titles like "11+ Practice Papers — GL Assessment Style") through its Granada Learning division. These are written by GL and use the same question construction methodology, though they are not the live test papers.</li>
      </ul>

      <h2 className="text-primary font-serif">Other GL-Style Practice Material</h2>
      <p>
        Beyond GL Assessment's own catalogue, established UK education publishers produce GL-style 11+ workbooks and practice paper packs. When choosing material, look for the following characteristics rather than specific brand names:
      </p>
      <ul>
        <li><strong>Multi-section timed papers</strong> with strict timings that mirror the real test — useful for full-length mock practice in the final months.</li>
        <li><strong>Short-burst question packs</strong> (e.g. 10-minute tests) — useful for daily skill drills rather than full mocks.</li>
        <li><strong>Subject-focused workbooks</strong> with progressive difficulty across Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension.</li>
        <li><strong>Comprehension-specific practice</strong> with longer passages and inference-style questions, since comprehension is the section where most marks are lost.</li>
      </ul>
      <p>
        Always verify any pack is explicitly labelled <strong>GL Assessment format</strong> (not CEM, which is used in other regions and tests different question styles).
      </p>

      <h2 className="text-primary font-serif">How to Use Past-Style Papers Effectively</h2>
      <ol>
        <li><strong>Don't start with full papers.</strong> A child who hasn't built up to an 80-minute sitting will produce an unreliable score. Begin with short timed sections (10 questions in 8 minutes) and work up.</li>
        <li><strong>Sit them under realistic conditions.</strong> Strict timing, no help, no breaks. The pacing data is one of the most valuable parts of the result.</li>
        <li><strong>Mark together.</strong> The marking conversation produces more learning than the test itself. Talk through every wrong answer.</li>
        <li><strong>Cluster wrong answers by question type.</strong> Two or three types usually account for most of the lost marks. Those are the priority for the next two weeks of practice.</li>
        <li><strong>Don't repeat the same paper.</strong> Once a child has seen the questions, the second sitting tells you nothing about real readiness.</li>
        <li><strong>Space them out.</strong> One full-length paper every three to four weeks is enough. Weekly mocks burn children out and don't accelerate learning.</li>
      </ol>

      <h2 className="text-primary font-serif">A Realistic Past-Papers Calendar</h2>
      <ul>
        <li><strong>Year 5 spring:</strong> One short familiarisation paper to introduce the format.</li>
        <li><strong>Year 5 summer:</strong> Two full-length GL-style mocks, one at the start and one at the end of the summer holiday.</li>
        <li><strong>Year 6 autumn (test term):</strong> Three or four full-length mocks at three-week intervals up to the test.</li>
        <li><strong>Final week:</strong> No mocks. Short confidence-building sections only.</li>
      </ul>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <ContentCTA
        heading="Start with a free GL-style mini paper"
        subhead="Our free 8-minute diagnostic is a GL-style paper in miniature — 12 questions across all four sections, with a practice score on the 121 scale."
        ctaLabel="Sit the free GL-style mini paper"
      />

      <h2 className="text-primary font-serif">Related Resources</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        <Link href="/bucks-11-plus-past-papers" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-bucks-past-papers"><div className="text-xs text-slate-500">Bucks Specific</div><div className="font-semibold text-primary font-serif">Bucks 11+ Past Papers</div></Link>
        <Link href="/bucks-11-plus-practice-papers-free" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-free-papers"><div className="text-xs text-slate-500">Free</div><div className="font-semibold text-primary font-serif">Free 11+ Practice Papers</div></Link>
        <Link href="/gl-assessment-question-types" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-gl-q-types"><div className="text-xs text-slate-500">Question Types</div><div className="font-semibold text-primary font-serif">GL Assessment Question Types</div></Link>
        <Link href="/gl-assessment-11-plus-practice" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid="link-gl-practice"><div className="text-xs text-slate-500">Practice Guide</div><div className="font-semibold text-primary font-serif">GL Assessment Practice Guide</div></Link>
      </div>      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

import { Link } from "wouter";
import { ArrowRight, BarChart3, CheckCircle2, Layers, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionCtaPair } from "@/components/shared/ConversionCtaPair";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { DashboardPreviewForecast } from "@/components/shared/DashboardPreview";
import { SampleQuestionsCarousel } from "@/components/shared/SampleQuestionsCarousel";
import { PlatformSuitePreview } from "@/components/shared/PlatformSuitePreview";
import { TutorCostComparison } from "@/components/shared/SeoConversionPanel";

import {
  GET_FULL_ACCESS_CTA,
  PLATFORM_ANCHORS,
  PLATFORM_LIBRARY_LABEL,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_SUITE_PATH,
  SEE_PLANS_PRICING_CTA,
} from "@/lib/marketing";
import { getPageMeta } from "@/lib/pageMeta";

const breadcrumbItems = [{ label: "11 Plus Practice Papers" }];

const highlights = [
  "Free 12-question practice test · no account needed",
  "2 full practice tests (45 questions each) + 3 timed mock exams",
  "Unlimited Quick, Full & Mock practice papers",
  "46 targeted drills · 2,500+ GL-style questions · worked solutions",
  "Parent dashboard: 121-scale forecast, pace analysis, progress trends",
];

export default function PlatformPreview() {
  const pageMeta = getPageMeta(PLATFORM_PRACTICE_PAPERS_PATH)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo
        title={pageMeta.title}
        description={pageMeta.description}
        canonicalPath={pageMeta.path}
        schema={breadcrumbSchema(breadcrumbItems)}
      />

      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className="relative bg-primary text-white border-b border-white/10">
        <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_34%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                <Layers className="h-3.5 w-3.5" />
                Full platform preview
              </div>
              <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl" data-testid="heading-platform-preview">
                11 Plus Practice Papers, Mocks &amp; 2,500+ Questions
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                This is what subscribers get — not vague bullet points. Browse practice papers, mock exams, timed drills, parent dashboards, and the full question library before you decide.
              </p>
              <ul className="mt-6 space-y-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <ConversionCtaPair
                className="mt-8"
                leadWithFree
                size="lg"
                variant="dark"
                pricingLabel={SEE_PLANS_PRICING_CTA}
                pricingTestId="button-platform-hero-pricing"
                freeTestId="button-platform-hero-free"
              />
            </div>
            <div id={PLATFORM_ANCHORS.parentDashboard} className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/95 p-4 shadow-2xl shadow-black/20">
              <DashboardPreviewForecast />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl space-y-14 px-4 py-12 md:py-16">
        <section id={PLATFORM_ANCHORS.sampleQuestions} className="scroll-mt-24">
          <div className="mb-6 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-primary/60 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">Interactive practice</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary">Real GL-style questions with instant feedback</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Swipe through examples from all four test domains — the same interactive format children use inside the platform.
            </p>
          </div>
          <SampleQuestionsCarousel />
        </section>

        <section className="scroll-mt-24">
          <div className="mb-6 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-primary">The complete platform suite</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Scroll inside each panel to explore practice tests, practice paper formats, and every drill category across VR, NVR, Maths and Comprehension.
            </p>
          </div>
          <PlatformSuitePreview />
        </section>

        <TutorCostComparison flush />

        <section className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.03] p-6 md:p-8 text-center">
          <Target className="h-6 w-6 text-primary mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-primary mb-2">
            Want to understand how diagnostics, papers &amp; drills work together?
          </h2>
          <p className="text-slate-600 text-sm mb-4 max-w-lg mx-auto">
            This page shows what subscribers get. For a parent-focused walkthrough of when to use each mode of practice, visit the practice suite guide.
          </p>
          <Button variant="outline" asChild className="font-semibold border-primary/30 text-primary">
            <Link href={PLATFORM_SUITE_PATH}>
              {PLATFORM_LIBRARY_LABEL} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        <section className="rounded-3xl border border-primary/15 bg-primary p-8 md:p-10 text-center text-white">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Ready to start preparing?</h2>
          <p className="text-white/75 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Try the free 12-question practice test first, or subscribe for full access to everything shown above.
          </p>
          <ConversionCtaPair
            leadWithFree
            size="lg"
            layout="center"
            variant="onPrimary"
            pricingLabel={GET_FULL_ACCESS_CTA}
            pricingTestId="button-platform-footer-pricing"
            freeTestId="button-platform-footer-free"
          />
        </section>
      </main>
    </div>
  );
}

import { Link } from "wouter";
import { ArrowRight, BarChart3, CheckCircle2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { DashboardPreviewForecast } from "@/components/shared/DashboardPreview";
import { SampleQuestionsCarousel } from "@/components/shared/SampleQuestionsCarousel";
import { PlatformSuitePreview } from "@/components/shared/PlatformSuitePreview";
import { TutorCostComparison } from "@/components/shared/SeoConversionPanel";

const breadcrumbItems = [{ label: "What's in the Platform" }];

const highlights = [
  "Free 12-question practice test · no account needed",
  "2 full readiness checks (45 questions each) + 3 timed mock exams",
  "Unlimited Quick, Full & Mock practice papers",
  "46 targeted drills · 2,500+ GL-style questions · worked solutions",
  "Parent dashboard: 121-scale forecast, pace analysis, progress trends",
];

export default function PlatformPreview() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Seo
        title="What's in the Platform — Practice Papers, Mocks & Dashboards | Bucks 11 Plus Tests"
        description="Browse everything inside Bucks Plus Edge: readiness checks, mock exams, unlimited practice papers, 2,500+ GL-style questions, and parent dashboards built for the Buckinghamshire 11+."
        canonicalPath="/platform"
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
                Readiness checks, practice papers, mocks &amp; 2,500+ questions
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                This is what subscribers get — not vague bullet points. Browse the dashboards, question styles, diagnostics, practice papers, and drill library before you decide.
              </p>
              <ul className="mt-6 space-y-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild data-testid="button-platform-hero-pricing">
                  <Link href="/pricing">
                    See plans &amp; pricing <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-white/5 px-7 font-semibold text-white hover:bg-white/10 hover:text-white"
                  data-testid="button-platform-hero-free"
                >
                  <Link href="/free-diagnostic">Try free practice test</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/95 p-4 shadow-2xl shadow-black/20">
              <DashboardPreviewForecast />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl space-y-14 px-4 py-12 md:py-16">
        <section>
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

        <section>
          <div className="mb-6 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-primary">The complete platform suite</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Scroll inside each panel to explore readiness checks, practice paper formats, and every drill category across VR, NVR, Maths and Comprehension.
            </p>
          </div>
          <PlatformSuitePreview />
        </section>

        <TutorCostComparison flush />

        <section className="rounded-3xl border border-primary/15 bg-primary p-8 md:p-10 text-center text-white">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Ready to start preparing?</h2>
          <p className="text-white/75 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Try the free 12-question practice test first, or subscribe for full access to everything shown above.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="cta" size="lg" asChild data-testid="button-platform-footer-pricing">
              <Link href="/pricing">Get full access <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white"
              data-testid="button-platform-footer-free"
            >
              <Link href="/free-diagnostic">Free practice test</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

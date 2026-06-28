import { Link } from "wouter";
import type { ComponentType } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Gauge,
  MapPin,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "../components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "../components/shared/Breadcrumbs";
import { DashboardPreviewForecast, DashboardPreviewPace, DashboardPreviewTrajectory } from "../components/shared/DashboardPreview";
import { SeoConversionPanel, TutorCostComparison } from "../components/shared/SeoConversionPanel";
import { GuideConversionBlock } from "../components/shared/GuideConversionBlock";
import { PLATFORM_PRACTICE_PAPERS_PATH, PLATFORM_PREVIEW_CTA } from "../lib/marketing";
import { Disclaimer } from "../components/shared/Disclaimer";
import { learnArticles, LEARN_CATEGORIES, getArticlesByCategory } from "../data/learn-articles";

const faqItems = [
  {
    question: "What is the Buckinghamshire 11 Plus test?",
    answer: "The Buckinghamshire 11 Plus, officially the Secondary Transfer Test, is the selective test used for grammar school eligibility across Buckinghamshire. It is GL-style, timed, and sat in September of Year 6.",
  },
  {
    question: "What score does my child need to qualify?",
    answer: "The qualifying standard is 121 on the official standardised score scale. A score of 121 or above makes a child eligible to be considered for a grammar school place, but it does not guarantee a place at a specific school.",
  },
  {
    question: "When should parents start preparing?",
    answer: "Most families need a clear baseline by Year 5. The best first step is not buying more papers; it is finding out which sections and question types are actually weak.",
  },
  {
    question: "Can Bucks 11 Plus Tests replace a tutor?",
    answer: "For many families it can provide the structure, practice, scoring, and tracking they need. Some children still benefit from a tutor, but the platform helps parents target any tutoring spend instead of paying for broad guesswork.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbItems = [
  { label: "Buckinghamshire 11+ Guide" },
];

const keyFacts = [
  { label: "2026 test", value: "September 2026", detail: "For September 2027 Year 7 entry" },
  { label: "Target score", value: "121+", detail: "Official qualifying standard" },
  { label: "Format", value: "Two timed papers", detail: "GL-style, audio-paced conditions" },
  { label: "What matters", value: "Gaps + pace", detail: "Not just hours of practice" },
];

const productOutcomes = [
  "Practice score shown against the 121 benchmark",
  "Parent dashboard showing weak sections and question types",
  "Pace analysis so slow accuracy does not hide test-day risk",
  "Targeted drills instead of generic paper after paper",
  "Mock exams and PDF reports for a clear preparation record",
  "Built around the Buckinghamshire Secondary Transfer Test",
];

const schools = [
  "Aylesbury Grammar",
  "Aylesbury High",
  "Beaconsfield High",
  "Burnham Grammar",
  "Chesham Grammar",
  "Dr Challoner's Grammar",
  "Dr Challoner's High",
  "John Hampden",
  "Royal Grammar School",
  "Royal Latin",
  "Sir Henry Floyd",
  "Sir William Borlase's",
  "Wycombe High",
];

const dashboardTabs = [
  {
    title: "Readiness Forecast",
    description: "A clear practice score against 121, with the highest-impact gap shown first.",
    component: <DashboardPreviewForecast />,
  },
  {
    title: "Pace and Gap Analytics",
    description: "See whether the problem is accuracy, timing, stamina, or a specific reasoning subtype.",
    component: <DashboardPreviewPace />,
  },
  {
    title: "Progress Trajectory",
    description: "Track whether practice is actually moving the child toward a safer readiness range.",
    component: <DashboardPreviewTrajectory />,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  "Understanding the Test": "Understand the test",
  "Grammar Schools & Admissions": "Schools and admissions",
  "Preparation Strategy": "Preparation strategy",
  "Subject Guides": "Subject guides",
  "Test Day & After": "Test day and results",
  "Other Guides": "More guidance",
};

export default function BucksGuide() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Seo
        title="Bucks 11 Plus Guide (2026) – 121 Score, Format & How to Prepare | Bucks 11 Plus Tests"
        description="Complete guide to the Bucks 11 Plus Secondary Transfer Test. Understand the 121 qualifying score, exam format, all 13 grammar schools, and how to prepare your child effectively."
        canonicalPath="/buckinghamshire-11-plus-guide"
        schema={[faqSchema, breadcrumbSchema(breadcrumbItems)]}
      />

      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="container relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-14 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              Buckinghamshire-specific 11+ platform
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl" data-testid="heading-bucks-guide">
              The Bucks 11+ guide parents actually need before they spend on prep.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Passing the Buckinghamshire 11+ means reaching the qualifying standard — but the hard part is knowing whether your child is ready. That is what the platform shows.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild className="px-7" data-testid="button-guide-hero-diagnostic">
                <Link href="/free-diagnostic">
                  Start free readiness check <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/25 bg-white/5 px-7 font-semibold text-white hover:bg-white/10 hover:text-white" data-testid="button-guide-hero-deep-dive">
                <a href="#deep-dive">
                  Browse deep-dive guides <ChevronDown className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/45">
              No account needed for the free check · Full platform from £35/month · Independent of GL Assessment and TBGS
            </p>
          </div>

          <div className="relative z-0 rounded-3xl border border-white/10 bg-white/95 p-4 shadow-2xl shadow-black/20">
            <DashboardPreviewForecast />
          </div>
        </div>
      </section>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <section
          className="relative z-10 -mt-0 mb-10 grid gap-3 sm:grid-cols-2 md:-mt-10 md:mb-12 md:grid-cols-4 lg:-mt-14"
          aria-label="Bucks 11 plus key facts"
        >
          {keyFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{fact.label}</p>
              <p className="mt-2 font-serif text-xl font-bold text-primary">{fact.value}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{fact.detail}</p>
            </div>
          ))}
        </section>
      </div>

      <main className="container mx-auto max-w-6xl space-y-12 px-4 pb-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">The parent decision</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-4xl">
                Parents do not need more vague reassurance. They need a dashboard.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Most 11+ preparation fails because parents cannot see the real problem. A child does papers, gets a percentage, and everyone guesses what to do next. Bucks Plus Edge shows the gap, the pace risk, and the next action.
              </p>
              <div className="mt-6 grid gap-3">
                {productOutcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <InsightCard icon={Gauge} title="Forecast" body="See an indicative readiness score against 121." />
                <InsightCard icon={Target} title="Priorities" body="Know the exact sections and question types to fix." />
                <InsightCard icon={Clock} title="Pace" body="Spot timing risk before test-day pressure exposes it." />
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-200">The simplest next step</p>
                <p className="mt-3 font-serif text-2xl font-bold">Take the baseline before you buy anything else.</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Books, tutors, and mock exams all make more sense once you know whether the weak point is vocabulary, NVR, maths, comprehension, pace, or stamina.
                </p>
                <Button asChild variant="cta" className="mt-5">
                  <Link href="/free-diagnostic">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <TutorCostComparison flush />

        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Inside the platform</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">This is what parents should see early.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                The dashboard turns Bucks 11+ preparation from guesswork into a visible plan: score, gap, pace, trajectory, and what to practise next.
              </p>
            </div>
            <Button asChild variant="outline" className="border-primary/20 font-semibold text-primary">
              <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>{PLATFORM_PREVIEW_CTA}</Link>
            </Button>
          </div>
          <div className="grid gap-6">
            {dashboardTabs.map((item, index) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 md:p-6">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
                {item.component}
              </div>
            ))}
          </div>
        </section>

        <SeoConversionPanel variant="guide" />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <MapPin className="h-3.5 w-3.5" />
                Bucks-specific
              </div>
              <h2 className="font-serif text-3xl font-bold text-primary">Built for all 13 Buckinghamshire grammar schools.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                There is one shared Secondary Transfer Test for Bucks grammar eligibility. The platform focuses on the skills that matter for that test, not generic 11+ content from another region.
              </p>
              <Link href="/bucks-grammar-schools" className="mt-5 inline-flex items-center text-sm font-bold text-primary hover:underline">
                View the detailed grammar school directory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {schools.map((school) => (
                <span key={school} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  {school}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="deep-dive" className="scroll-mt-24">
          <div className="mb-8 rounded-3xl bg-primary p-6 text-white md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Deep-dive guide library</p>
                <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Need the details? Go straight to the right guide.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                  The full guidance is still here. It is organised so parents can read the exact next topic without pushing the product below pages of repeated basics.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center">
                <p className="font-serif text-3xl font-bold">{learnArticles.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Bucks guides</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {LEARN_CATEGORIES.map((category) => {
              const articles = getArticlesByCategory(category);
              if (articles.length === 0) return null;

              return (
                <div key={category} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/60">{CATEGORY_LABELS[category] || category}</p>
                      <h3 className="mt-1 font-serif text-2xl font-bold text-primary">{category}</h3>
                    </div>
                    <BookOpen className="h-6 w-6 text-primary/30" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/learn/${article.slug}`}
                        data-testid={`link-guide-${article.slug}`}
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white hover:shadow-md"
                      >
                        <h4 className="text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">
                          {article.title}
                        </h4>
                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-600">
                          {article.description}
                        </p>
                        <span className="mt-3 inline-flex items-center text-xs font-bold text-primary">
                          Read guide <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item, i) => (
            <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-testid={`faq-item-${i}`}>
              <h3 className="font-serif text-lg font-bold text-primary">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Independent, Bucks-specific, clear about limits.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  Practice scores are indicative only. They are not official GL Assessment standardised scores and cannot guarantee a result. The value is visibility: parents can see what to fix while there is still time.
                </p>
              </div>
            </div>
            <Button variant="cta" asChild >
              <Link href="/how-forecast-works">Read scoring methodology</Link>
            </Button>
          </div>
        </section>

        <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
          <p className="text-sm font-semibold text-primary">Preparing for 11+ outside Buckinghamshire?</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This guide is specific to the Buckinghamshire Secondary Transfer Test. For wider 11+ preparation across England, visit{" "}
            <a href="https://11plustesthub.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              11plusTestHub.co.uk
            </a>.
          </p>
        </div>

        <Disclaimer />

        <GuideConversionBlock />
      </main>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-serif text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

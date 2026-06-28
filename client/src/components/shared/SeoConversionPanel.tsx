import { Link } from "wouter";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { scrollToAnchor } from "@/lib/scrollToAnchor";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
} from "@/lib/marketing";
import { SampleQuestionsCarousel } from "./SampleQuestionsCarousel";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Gauge,
  ChevronsDown,
  Target,
  Zap,
  PlayCircle,
} from "lucide-react";

type PanelVariant = "guide" | "registration" | "question" | "score" | "learn" | "general";

type SeoConversionPanelProps = {
  variant?: PanelVariant;
  eyebrow?: string;
  heading?: string;
  subhead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Show interactive GL-style question examples below the panel. */
  showQuestionExamples?: boolean;
};

const variantCopy: Record<PanelVariant, Required<Omit<SeoConversionPanelProps, "variant" | "showQuestionExamples">>> = {
  guide: {
    eyebrow: "Built for Bucks parents",
    heading: "Guides explain the test. The platform prepares your child for it.",
    subhead:
      "2,500+ GL-style questions, unlimited practice papers, full mock exams, timed practice tests on the 121 scale, and parent dashboards that show exactly what to practise next.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
  registration: {
    eyebrow: "After registration, the clock is running",
    heading: "Registered or about to register? See what your child needs to practise.",
    subhead:
      "Registration gets your child into the test. Our practice tests, mock exams, and parent dashboards show whether they are actually on track for 121 — before you spend on tutors or more books.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
  question: {
    eyebrow: "Question types decide marks",
    heading: "Find the exact question types costing your child points.",
    subhead:
      "A child can look strong overall and still lose the 121 margin on cube nets, inference, timing, or one hidden reasoning family. Browse the full practice library and see the gaps in your parent dashboard.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
  score: {
    eyebrow: "121 is the benchmark",
    heading: "Stop guessing whether your child is close to 121.",
    subhead:
      "Get an indicative practice score, section breakdown, pace analysis, and a ranked focus list. Browse mock exams and practice papers built for the Bucks 11+ before you subscribe.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
  learn: {
    eyebrow: "More than free guides",
    heading: "Guides explain the test. Bucks Plus Edge prepares your child for it.",
    subhead:
      "Parent dashboards, 2,500+ GL-style questions, unlimited practice papers, full mock exams, and timed practice tests scored on the 121 benchmark — built for Buckinghamshire families.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
  general: {
    eyebrow: "Bucks-specific preparation",
    heading: "Know what to fix before the test window closes.",
    subhead:
      "Practice score forecast, GL-style questions, parent analytics, mock exams, and targeted drills — everything in one Bucks-specific platform. See exactly what you get before you pay.",
    primaryLabel: PLATFORM_PREVIEW_CTA,
    primaryHref: PLATFORM_PRACTICE_PAPERS_PATH,
    secondaryLabel: FREE_PRACTICE_TEST_CTA,
    secondaryHref: FREE_PRACTICE_TEST_PATH,
  },
};

const proofPoints = [
  { icon: Gauge, label: "121-scale practice score forecast" },
  { icon: BarChart3, label: "Section and question-type gaps" },
  { icon: Clock, label: "Pace and timing risk" },
  { icon: Target, label: "Priority practice recommendations" },
];

export function SeoConversionPanel({
  variant = "general",
  eyebrow,
  heading,
  subhead,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  showQuestionExamples = true,
}: SeoConversionPanelProps) {
  const copy = {
    ...variantCopy[variant],
    ...(eyebrow ? { eyebrow } : {}),
    ...(heading ? { heading } : {}),
    ...(subhead ? { subhead } : {}),
    ...(primaryLabel ? { primaryLabel } : {}),
    ...(primaryHref ? { primaryHref } : {}),
    ...(secondaryLabel ? { secondaryLabel } : {}),
    ...(secondaryHref ? { secondaryHref } : {}),
  };

  return (
    <section className="not-prose my-10 overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-xl shadow-slate-900/5" data-testid={`seo-conversion-${variant}`}>
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-primary via-slate-900 to-primary px-6 py-7 text-white md:px-8 md:py-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            <Zap className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight md:text-3xl">
            {copy.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            {copy.subhead}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="cta" size="lg" asChild data-testid="button-seo-conversion-primary">
              <Link href={copy.primaryHref}>
                {copy.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 border-white/25 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white" data-testid="button-seo-conversion-secondary">
              <Link href={copy.secondaryHref}>{copy.secondaryLabel}</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/45">
            Free 12-question practice test · no account needed · Full platform from £35/month
          </p>
        </div>
        <div className="bg-slate-50 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">What parents get</p>
          </div>
          <div className="grid gap-3">
            {proofPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{point.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-900">Browse before you buy</p>
            <p className="mt-1 text-xs leading-6 text-emerald-800">
              See every practice paper, mock exam, and drill category — then decide if Bucks Plus Edge is right for your family.
            </p>
          </div>
        </div>
      </div>

      {showQuestionExamples && (
        <div className="border-t border-slate-200 bg-white px-5 py-6 md:px-8 md:py-8">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-4">
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0" />
            <span className="font-medium text-center">Swipe through real GL-style practice questions from the platform</span>
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0" />
          </div>
          <SampleQuestionsCarousel />
          <div className="mt-6 flex justify-center">
            <Button variant="cta" size="lg" asChild data-testid="button-seo-conversion-questions-platform">
              <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
                {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

const costRows = [
  {
    label: "Private tutor (1 hr/week)",
    price: "£160/mo",
    detail: "One £40 session each week — the typical minimum many Bucks families budget for.",
    isTutorCost: true,
  },
  {
    label: "Bucks Plus Edge — Monthly",
    price: "£35/mo",
    detail: "Unlimited interactive practice, mocks, drills, practice tests, and parent analytics.",
    isTutorCost: false,
  },
  {
    label: "Bucks Plus Edge — Annual",
    price: "£23.25/mo",
    detail: "Same full platform, billed once a year (£279). Cancel any time.",
    isTutorCost: false,
  },
];

function TutorCostStrike({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`line-through decoration-2 decoration-red-500/60 text-slate-400 ${className}`} title="Typical private tutor cost — not our price">
      {children}
    </span>
  );
}

const practiceBenefits = [
  {
    icon: PlayCircle,
    title: "Interactive practice children engage with",
    detail: "Timed GL-style questions with instant feedback — not passive worksheets or a single hour a week.",
  },
  {
    icon: BarChart3,
    title: "Preparation you can see",
    detail: "Practice tests, mock exams, pace tracking, and a parent dashboard that shows what to fix next.",
  },
  {
    icon: Zap,
    title: "Practice when it suits",
    detail: "Short targeted drills between school and homework — structured, modern, and built for the Bucks 11+.",
  },
];

type TutorCostComparisonProps = {
  compact?: boolean;
  variant?: "default" | "pricing";
  flush?: boolean;
};

export function TutorCostComparison({ compact = false, variant = "default", flush = false }: TutorCostComparisonProps) {
  const isPricing = variant === "pricing";
  const marginClass = flush ? "my-0" : compact ? "my-8" : "my-12";

  return (
    <section
      className={`not-prose rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-slate-50 ${marginClass} ${compact ? "p-5" : "p-6 md:p-8"} ${isPricing ? "border-amber-300 shadow-lg shadow-amber-100/80" : ""}`}
      data-testid="tutor-cost-comparison"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PlayCircle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
            Compared to a private 11+ tutor
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-primary md:text-3xl">
            <TutorCostStrike>~£160/month</TutorCostStrike> for one hour a week. £35/month for a full preparation platform.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            Most families paying a tutor at <strong className="text-primary">£40/hr</strong> book at least one session a week — roughly{" "}
            <TutorCostStrike className="font-semibold">£160/month</TutorCostStrike>{" "}
            <span className="text-xs text-slate-500">(typical tutor cost)</span>. Bucks Plus Edge is modern, interactive 11+ practice: timed mocks, targeted drills,
            instant explanations, and clear parent visibility — for <strong className="text-primary">£35/month</strong> (or{" "}
            <strong className="text-primary">£23.25/month</strong> on annual).
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {costRows.map((row, index) => (
          <div
            key={row.label}
            className={`rounded-2xl border p-4 md:p-5 ${index >= 1 ? "border-primary bg-primary text-white ring-2 ring-amber-400/40" : "border-slate-200 bg-white"}`}
          >
            <p className={`text-xs font-bold uppercase tracking-wide ${index >= 1 ? "text-amber-200" : "text-slate-500"}`}>{row.label}</p>
            <p className={`mt-2 text-2xl font-bold ${index >= 1 ? "text-white" : "text-primary"}`}>
              {row.isTutorCost ? <TutorCostStrike>{row.price}</TutorCostStrike> : row.price}
            </p>
            <p className={`mt-2 text-xs leading-5 ${index >= 1 ? "text-white/80" : "text-slate-600"}`}>{row.detail}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {practiceBenefits.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-primary">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex items-start gap-2 text-sm text-slate-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <strong className="text-primary">The benefit:</strong> structured, interactive preparation between tutor sessions — or as your main prep route — with data that shows what is actually improving.
          </span>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {isPricing ? (
            <Button
              variant="cta"
              size="lg"
              data-testid="button-tutor-comparison-primary"
              onClick={() => scrollToAnchor("tiers")}
            >
              See monthly & annual plans <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="cta" size="lg" asChild data-testid="button-tutor-comparison-platform">
                <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
                  {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 border-primary/20 font-semibold text-primary" data-testid="button-tutor-comparison-monthly">
                <Link href="/pricing?autoCheckout=pack_plus">
                  Start monthly — £35/mo
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 border-primary/20 font-semibold text-primary" data-testid="button-tutor-comparison-secondary">
                <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

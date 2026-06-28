import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  PlayCircle,
  Zap,
} from "lucide-react";

const PLATFORM_STATS = [
  { value: "2,500+", label: "GL-style questions" },
  { value: "46+", label: "targeted drills" },
  { value: "40 & 50", label: "question mocks" },
  { value: "4", label: "subjects tracked" },
];

const PLATFORM_INCLUDES = [
  "2,500+ interactive GL-style questions across VR, NVR, Maths & Comprehension",
  "Full 40-question and 50-question timed mock exams",
  "All Hard-level challenge drills with instant explanations",
  "Indicative readiness score against the 121 benchmark",
  "Parent analytics — section gaps, question types, and pace risk",
  "PDF reports after every session · guided practice programme",
];

type Props = {
  /** What the current free page offers — e.g. "14 worked examples" */
  freeOffer?: string;
  className?: string;
};

export function FreeToPlatformPanel({
  freeOffer = "a small free sample on this page",
  className = "",
}: Props) {
  return (
    <section
      className={`not-prose my-10 overflow-hidden rounded-3xl border-2 border-primary/20 bg-white shadow-xl shadow-primary/5 ${className}`}
      data-testid="free-to-platform-panel"
    >
      <div className="bg-primary px-6 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            What your child actually needs
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
          {freeOffer} is not enough. <span className="text-amber-300">Start now</span> with 2,500+ timed GL-style questions.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
          Bucks Plus Edge is where serious preparation happens — full mocks, Hard drills, instant feedback, readiness against 121, and a parent dashboard that tells you what to practise next.
        </p>
      </div>

      <div className="grid gap-0 border-b border-slate-200 md:grid-cols-2">
        <div className="bg-amber-50/50 p-6 md:order-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Bucks Plus Edge — £35/mo or £279/yr</p>
          <ul className="space-y-2">
            {PLATFORM_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-b border-slate-200 bg-slate-50 p-6 md:border-b-0 md:border-l md:order-2">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Free samples only</p>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-slate-400">·</span>
              <span>{freeOffer}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-400">·</span>
              <span>12-question readiness check (no account)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-400">·</span>
              <span>No progress tracking, mocks, or full question bank</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">
        {PLATFORM_STATS.map((stat) => (
          <div key={stat.label} className="bg-white px-4 py-4 text-center">
            <p className="text-xl font-bold text-primary md:text-2xl">{stat.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-start gap-3 text-sm text-slate-600">
          <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span>
            <strong className="text-primary">Give your child access to 2,500+ questions today.</strong> Timed mocks, tracked progress, and a clear picture of readiness against 121.
          </span>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button variant="cta" size="lg" asChild data-testid="button-free-panel-monthly">
            <Link href="/pricing?autoCheckout=pack_plus">
              Start now — £35/mo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-12 border-primary/25 font-semibold text-primary" data-testid="button-free-panel-annual">
            <Link href="/pricing?autoCheckout=pack_annual">Annual — £279/yr</Link>
          </Button>
          <Link
            href="/free-diagnostic"
            className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-slate-500 hover:text-primary"
            data-testid="button-free-panel-diagnostic"
          >
            Free 12-q check
          </Link>
        </div>
      </div>

      <p className="border-t border-slate-200 bg-white px-6 py-3 text-center text-[11px] text-slate-500">
        3-day money-back guarantee · Cancel anytime · Indicative readiness scores, not official GL Assessment results
      </p>
    </section>
  );
}

/** Compact strip for mid-article placement */
export function FreeToPlatformStrip({ freeOffer = "free samples" }: { freeOffer?: string }) {
  return (
    <div
      className="not-prose my-8 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 md:flex-row md:items-center md:justify-between"
      data-testid="free-to-platform-strip"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">
            Your child needs 2,500+ timed questions — not just {freeOffer.toLowerCase()}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Full mocks, Hard drills, parent analytics, readiness against 121. Start preparing now — £35/mo or £279/yr.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row shrink-0">
        <Button variant="cta" size="sm" asChild data-testid="button-free-strip-pricing">
          <Link href="/pricing?autoCheckout=pack_plus">Start now</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="font-semibold text-primary" data-testid="button-free-strip-diagnostic">
          <Link href="/free-diagnostic">Free check</Link>
        </Button>
      </div>
    </div>
  );
}

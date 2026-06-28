import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

const STATS = [
  { value: "2,500+", label: "GL-style questions" },
  { value: "46+", label: "targeted drills" },
  { value: "40 & 50", label: "question mocks" },
];

const INCLUDES = [
  "Timed practice on the same GL-style question types as the Bucks test",
  "Full mock exams with instant marking and explanations",
  "Indicative readiness score against the 121 benchmark",
  "Parent dashboard — gaps by subject, question type, and pace",
];

type Context = "past-papers" | "sample-questions";

const COPY: Record<Context, { headline: string; subhead: string }> = {
  "past-papers": {
    headline: "Official past papers don't exist. Your child needs 2,500+ GL-style questions to prepare properly.",
    subhead:
      "Printable samples are a taster — not a preparation plan. Bucks Plus Edge gives your child timed practice, full mocks, Hard drills, and a parent dashboard that shows exactly what to fix next. Start now.",
  },
  "sample-questions": {
    headline: "14 sample questions show the level. Real preparation needs 2,500+ timed questions.",
    subhead:
      "Worked examples help you see the format — they don't build stamina, track progress, or show readiness against 121. Bucks Plus Edge does. Give your child access to the full question bank and start preparing now.",
  },
};

export function PlatformPrepHero({ context }: { context: Context }) {
  const { headline, subhead } = COPY[context];

  return (
    <section
      className="not-prose my-8 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/10"
      data-testid="platform-prep-hero"
    >
      <div className="bg-primary px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            Bucks Plus Edge — start preparing now
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold leading-tight text-white md:text-[1.75rem] max-w-3xl">
          {headline}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">{subhead}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-bold text-amber-300 md:text-xl">{s.value}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 max-w-2xl">
          {INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-white/85">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button variant="cta" size="lg" asChild data-testid="button-prep-hero-start">
            <Link href="/pricing?autoCheckout=pack_plus">
              Start now — £35/mo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-12 border-white/30 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
            data-testid="button-prep-hero-annual"
          >
            <Link href="/pricing?autoCheckout=pack_annual">Annual — £279/yr</Link>
          </Button>
          <Link
            href="/free-diagnostic"
            className="text-sm text-white/55 hover:text-white/80 underline-offset-2 hover:underline sm:ml-1"
            data-testid="link-prep-hero-free-check"
          >
            Or try the free 12-question check first
          </Link>
        </div>
        <p className="mt-4 text-[11px] text-white/40">3-day money-back guarantee · Cancel anytime</p>
      </div>
    </section>
  );
}

/** Muted secondary block — PDFs after platform messaging */
export function SecondaryPdfDownloads() {
  return (
    <aside
      className="not-prose my-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5"
      data-testid="secondary-pdf-downloads"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Optional — print first</p>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
        Want something on paper before you start? Two free GL-style practice PDFs (12 questions each, worked answers) — not a substitute for the platform.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="/api/practice-paper/download"
          download="bucks-11-plus-free-practice-paper.pdf"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary/30 hover:text-primary transition-colors"
          data-testid="button-secondary-pdf-1"
        >
          Paper 1 PDF
        </a>
        <a
          href="/api/practice-paper-2/download"
          download="bucks-11-plus-free-practice-paper-2.pdf"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary/30 hover:text-primary transition-colors"
          data-testid="button-secondary-pdf-2"
        >
          Paper 2 PDF
        </a>
        <Link
          href="/bucks-11-plus-free-sample-papers"
          className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
          data-testid="link-secondary-pdf-page"
        >
          Download page →
        </Link>
      </div>
    </aside>
  );
}

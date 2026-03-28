import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SampleQuestionsCarousel } from "./SampleQuestionsCarousel";

type SubjectColor = "violet" | "emerald" | "blue" | "amber";

const SUBJECT_BAR_COLORS: Record<SubjectColor, string> = {
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
};

function ScoreMockup() {
  const subjects = [
    { label: "Verbal Reasoning", score: 89, color: "violet" as SubjectColor },
    { label: "Non-Verbal Reasoning", score: 72, color: "blue" as SubjectColor },
    { label: "Mathematics", score: 78, color: "emerald" as SubjectColor },
    { label: "English Comprehension", score: 85, color: "amber" as SubjectColor },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="bg-primary px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
            Sample Diagnostic Result
          </p>
          <h4 className="text-xl font-bold font-serif text-white leading-snug">
            Where Does Your Child Sit?
          </h4>
        </div>
        <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <Target className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="px-6 pt-6 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Predicted Standardised Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-primary leading-none">116</span>
              <span className="text-xl text-slate-400 font-medium">/130</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-amber-800">5 points below qualifying</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Qualifying threshold: 121</p>
          </div>
        </div>

        <div className="mb-1">
          <div className="h-3.5 rounded-full bg-slate-100 overflow-hidden relative">
            <div className="h-full rounded-full bg-primary" style={{ width: "89%" }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: "93.1%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>70</span>
            <span className="text-amber-600 font-semibold">↑ 121 qualifying</span>
            <span>140</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Subject Breakdown
          </p>
          {subjects.map((sub) => (
            <div key={sub.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-700">{sub.label}</span>
                <span className="text-xs font-bold text-slate-800">{sub.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", SUBJECT_BAR_COLORS[sub.color])}
                  style={{ width: `${sub.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-800">Recommended focus: </span>
            Non-Verbal Reasoning is the biggest drag on overall score. Targeted practice
            across matrix patterns and classification is the fastest route to qualifying.
          </p>
        </div>
      </div>
    </div>
  );
}

export function GuideConversionBlock() {
  return (
    <div className="not-prose my-14 space-y-7">
      <ScoreMockup />

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ChevronsDown className="h-4 w-4 text-primary/60" />
        <span>Scroll to see practice test examples</span>
        <ChevronsDown className="h-4 w-4 text-primary/60" />
      </div>

      <SampleQuestionsCarousel />

      <div className="rounded-2xl bg-primary overflow-hidden shadow-xl">
        <div className="px-7 py-8 md:px-9 md:py-9">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-brand-amber" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber">
              Bucks Practice Platform
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-3 leading-snug">
            Give Your Child the Edge
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-3 max-w-2xl">
            Psychology research is clear: children who practise with{" "}
            <strong className="text-white">structured, timed, curriculum-mapped questions</strong> consistently
            outperform those who revise without a system. The children who qualify for Buckinghamshire
            grammar schools don't get lucky — they build the speed, accuracy, and stamina needed under
            real test conditions.
          </p>
          <p className="text-white/70 text-sm leading-relaxed mb-7 max-w-2xl">
            Subscribe today for 1,500+ GL-style questions across all four subjects, full timed
            diagnostics benchmarked against the 121 qualifying score, targeted drills, and
            printable PDF parent reports.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <Button
              asChild
              className="h-11 px-6 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold shadow-sm"
              data-testid="button-guide-conversion-subscribe"
            >
              <Link href="/pricing">
                Subscribe from £24.99/month <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 px-6 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40"
              data-testid="button-guide-conversion-diagnostic"
            >
              <Link href="/free-diagnostic">Take the Free 11+ Diagnostic First</Link>
            </Button>
            <span className="text-white/40 text-xs sm:ml-1">Cancel any time · No lock-in</span>
          </div>
        </div>
      </div>
    </div>
  );
}

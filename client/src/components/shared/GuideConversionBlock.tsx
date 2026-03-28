import { useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Target, Zap, ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SubjectColor = "violet" | "emerald" | "blue" | "amber";

const SUBJECT_COLORS: Record<SubjectColor, {
  bg: string; border: string; tag: string; bar: string;
}> = {
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    tag: "bg-violet-100 text-violet-800",
    bar: "bg-violet-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-500",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-800",
    bar: "bg-blue-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tag: "bg-amber-100 text-amber-800",
    bar: "bg-amber-500",
  },
};

const EXAMPLES = [
  {
    id: 1,
    subject: "Verbal Reasoning",
    color: "violet" as SubjectColor,
    type: "Word Codes",
    question: "If GARDEN = HBSEFO in a letter code, what does NATURE equal in the same code?",
    options: ["OBUVMF", "NBUVOF", "OBUVSF", "OBUVMG"],
  },
  {
    id: 2,
    subject: "Mathematics",
    color: "emerald" as SubjectColor,
    type: "Multi-Step Problem",
    question: "A bag of 24 apples costs £3.60. How much would 40 apples cost at the same price per apple?",
    options: ["£5.00", "£5.60", "£6.00", "£6.40"],
  },
  {
    id: 3,
    subject: "English Comprehension",
    color: "amber" as SubjectColor,
    type: "Inference",
    question: "\"Marcus kept his eyes fixed firmly on the floor as Mrs Henley read the test scores aloud.\" What does this tell us about Marcus?",
    options: ["He was tired after the test", "He was proud of his result", "He felt uncomfortable or embarrassed", "He was angry at Mrs Henley"],
  },
  {
    id: 4,
    subject: "Non-Verbal Reasoning",
    color: "blue" as SubjectColor,
    type: "Spatial Rotation",
    question: "A shape is rotated 90° clockwise, then reflected along a vertical axis. Which option shows the final result?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    isNvr: true,
  },
  {
    id: 5,
    subject: "Verbal Reasoning",
    color: "violet" as SubjectColor,
    type: "Analogy",
    question: "AUTHOR is to BOOK as COMPOSER is to _____.",
    options: ["Piano", "Symphony", "Concert", "Musician"],
  },
  {
    id: 6,
    subject: "Mathematics",
    color: "emerald" as SubjectColor,
    type: "Percentages",
    question: "In a class of 32 students, 75% passed a spelling test. How many students did not pass?",
    options: ["6", "8", "10", "12"],
  },
];

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
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: "89%" }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
              style={{ left: "93.1%" }}
            />
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
                  className={cn("h-full rounded-full", SUBJECT_COLORS[sub.color].bar)}
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
            across spatial rotation and matrix patterns is the fastest route to qualifying.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ example }: { example: typeof EXAMPLES[number] }) {
  const c = SUBJECT_COLORS[example.color];
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex flex-col min-w-[288px] w-[288px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start h-full",
        c.bg, c.border
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full", c.tag)}>
          {example.subject}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground bg-white/70 rounded-full px-2 py-0.5 border border-white/50">
          {example.type}
        </span>
      </div>

      {example.isNvr && (
        <div className="mb-3 bg-white/70 rounded-xl border border-white p-3 flex items-center justify-center gap-2 flex-wrap">
          <div className="h-9 w-9 border-2 border-blue-400 rounded-sm" />
          <div className="h-9 w-9 border-2 border-blue-400 rotate-45 flex-shrink-0" />
          <div className="h-9 w-9 border-2 border-blue-400 rounded-full" />
          <div className="h-9 w-9 bg-blue-100 border-2 border-dashed border-blue-300 rounded-sm flex items-center justify-center">
            <span className="text-sm font-black text-blue-500">?</span>
          </div>
        </div>
      )}

      <p className="text-sm font-medium text-slate-800 leading-relaxed mb-4 flex-1">
        {example.question}
      </p>

      <div className="space-y-2">
        {example.options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 bg-white/70 rounded-lg border border-white/60 px-3 py-2"
          >
            <div className="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </div>
            <span className="text-xs text-slate-700 leading-snug">{opt}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 pt-3 border-t border-white/60 text-[10px] text-muted-foreground">
        Platform Edge · 1,500+ questions like this
      </p>
    </div>
  );
}

export function GuideConversionBlock() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <div className="not-prose my-14 space-y-7">
      <ScoreMockup />

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ChevronsDown className="h-4 w-4 text-primary/60" />
        <span>Scroll to see practice test examples</span>
        <ChevronsDown className="h-4 w-4 text-primary/60" />
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {EXAMPLES.map((example) => (
            <QuestionCard key={example.id} example={example} />
          ))}
          <div className="min-w-[1px] flex-shrink-0" />
        </div>
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 h-9 w-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center hover:bg-slate-50 transition-colors z-10"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 h-9 w-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center hover:bg-slate-50 transition-colors z-10"
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          <p className="text-[11px] text-muted-foreground">← Swipe to see more examples →</p>
        </div>
      </div>

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

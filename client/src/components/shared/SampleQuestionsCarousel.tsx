import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SubjectColor = "violet" | "emerald" | "blue" | "amber";

interface Example {
  id: number;
  subject: string;
  color: SubjectColor;
  type: string;
  question: string;
  options: string[];
  sequenceItems?: string[];
}

const SUBJECT_COLORS: Record<SubjectColor, {
  bg: string; border: string; tag: string; optionHover: string;
}> = {
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    tag: "bg-violet-100 text-violet-800",
    optionHover: "border-violet-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-800",
    optionHover: "border-emerald-200",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-800",
    optionHover: "border-blue-200",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tag: "bg-amber-100 text-amber-800",
    optionHover: "border-amber-200",
  },
};

const EXAMPLES: Example[] = [
  {
    id: 1,
    subject: "Verbal Reasoning",
    color: "violet" as SubjectColor,
    type: "Word Codes",
    question: "If GARDEN = HBSEFO using a letter-shift code, what does NATURE equal in the same code?",
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
    options: [
      "He was tired after the test",
      "He was proud of his result",
      "He felt uncomfortable or embarrassed",
      "He was angry at Mrs Henley",
    ],
  },
  {
    id: 5,
    subject: "Verbal Reasoning",
    color: "violet" as SubjectColor,
    type: "Analogy",
    question: "AUTHOR is to NOVEL as COMPOSER is to _____.",
    options: ["Piano", "Symphony", "Concert", "Musician"],
  },
  {
    id: 6,
    subject: "Mathematics",
    color: "emerald" as SubjectColor,
    type: "Percentages",
    question: "In a class of 32 students, 75% passed a test. How many students did NOT pass?",
    options: ["6", "8", "10", "12"],
  },
  {
    id: 7,
    subject: "English Comprehension",
    color: "amber" as SubjectColor,
    type: "Vocabulary in Context",
    question: "\"The dilapidated building stood at the end of the lane, its windows dark and its roof caving inward.\" What does 'dilapidated' most likely mean?",
    options: ["Ancient and famous", "Large and imposing", "Falling into disrepair", "Newly constructed"],
  },
  {
    id: 8,
    subject: "Non-Verbal Reasoning",
    color: "blue" as SubjectColor,
    type: "Spatial Folding",
    question: "A square sheet of paper is folded in half left-to-right, then folded in half top-to-bottom. A single hole is punched through all layers. When fully unfolded, how many holes appear?",
    sequenceItems: ["⬜", "|fold→", "▬ ×2", "|fold↓", "◼ ×4", "|punch", "?"],
    options: ["2", "3", "4", "8"],
  },
];

function QuestionCard({ example }: { example: Example }) {
  const c = SUBJECT_COLORS[example.color];
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex flex-col min-w-[288px] w-[288px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start",
        c.bg, c.border
      )}
      data-testid={`card-sample-question-${example.id}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full", c.tag)}>
          {example.subject}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground bg-white/70 rounded-full px-2 py-0.5 border border-white/50">
          {example.type}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-800 leading-relaxed mb-3">
        {example.question}
      </p>

      {example.sequenceItems && (
        <div className="mb-4 rounded-xl bg-white/80 border border-white/70 p-3">
          <div className="flex flex-wrap gap-1.5 items-center justify-center">
            {example.sequenceItems.map((item, i) => {
              const isBlank = item === "?";
              const isStepLabel = item.startsWith("|");
              if (isStepLabel) {
                return (
                  <span key={i} className="text-[10px] font-bold text-slate-400 px-0.5 select-none">
                    {item.slice(1)}
                  </span>
                );
              }
              return (
                <div
                  key={i}
                  className={cn(
                    "min-w-[2rem] h-8 px-2 rounded-lg flex items-center justify-center text-sm font-bold border",
                    isBlank
                      ? "bg-blue-100 border-blue-300 text-blue-500"
                      : "bg-white border-slate-200 text-slate-700"
                  )}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={cn("space-y-2", !example.sequenceItems && "flex-1 mt-1")}>
        {example.options.map((opt, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2.5 bg-white/70 rounded-lg border border-white/60 px-3 py-2"
            )}
          >
            <div className="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </div>
            <span className="text-xs text-slate-700 leading-snug">{opt}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 pt-3 border-t border-white/60 text-[10px] text-muted-foreground">
        Bucks Practice Platform · 1,500+ questions like this
      </p>
    </div>
  );
}

interface SampleQuestionsCarouselProps {
  className?: string;
  showLabel?: boolean;
}

export function SampleQuestionsCarousel({ className, showLabel = true }: SampleQuestionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
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

      {showLabel && (
        <div className="flex justify-center mt-3 md:hidden">
          <p className="text-[11px] text-muted-foreground">← Swipe to see more examples →</p>
        </div>
      )}
    </div>
  );
}

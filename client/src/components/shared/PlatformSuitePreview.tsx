import type { ReactNode } from "react";
import { ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_ANCHORS } from "@/lib/marketing";

function BrowserChrome({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800">
      <div className="w-2 h-2 rounded-full bg-red-400" />
      <div className="w-2 h-2 rounded-full bg-amber-400" />
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-[10px] text-white/50 ml-2 font-medium">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

function PaidBadge() {
  return <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">Paid plan</span>;
}

function FreeBadge() {
  return <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">Free</span>;
}

const BANK_SUBJECTS = [
  {
    label: "Non-Verbal Reasoning", icon: "📐", sub: "Shape & pattern puzzles",
    drills: [
      { name: "Mirror Images", diff: "Easy", qs: "10 Qs" },
      { name: "Odd One Out", diff: "Easy", qs: "12 Qs" },
      { name: "Different Sequences", diff: "Easy", qs: "12 Qs" },
      { name: "Pattern Recognition", diff: "Easy", qs: "15 Qs" },
      { name: "Symmetry & Spatial", diff: "Medium", qs: "12 Qs" },
      { name: "Classification Challenge", diff: "Medium", qs: "12 Qs" },
      { name: "Advanced Transformations", diff: "Hard", qs: "12 Qs" },
      { name: "Advanced Symmetry", diff: "Hard", qs: "12 Qs" },
    ],
  },
  {
    label: "Verbal Reasoning", icon: "🔤", sub: "Language, logic & patterns",
    drills: [
      { name: "Word Analogies", diff: "Medium", qs: "15 Qs" },
      { name: "Logical Deduction", diff: "Medium", qs: "15 Qs" },
      { name: "Hidden Words", diff: "Medium", qs: "10 Qs" },
      { name: "Word Classification", diff: "Medium", qs: "10 Qs" },
      { name: "Letter Sequences", diff: "Hard", qs: "12 Qs" },
      { name: "Code Breaking", diff: "Hard", qs: "12 Qs" },
      { name: "Adv. Word Analogies", diff: "Hard", qs: "12 Qs" },
      { name: "Adv. Hidden Words", diff: "Hard", qs: "12 Qs" },
      { name: "Adv. Logical Deduction", diff: "Hard", qs: "12 Qs" },
      { name: "Adv. Word Classification", diff: "Hard", qs: "10 Qs" },
    ],
  },
  {
    label: "Mathematics", icon: "➗", sub: "Arithmetic, geometry & problem-solving",
    drills: [
      { name: "Starter Arithmetic", diff: "Easy", qs: "10 Qs" },
      { name: "Starter Fractions", diff: "Easy", qs: "8 Qs" },
      { name: "Starter Number Patterns", diff: "Easy", qs: "6 Qs" },
      { name: "Starter Percentages", diff: "Easy", qs: "6 Qs" },
      { name: "Starter Ratio", diff: "Easy", qs: "4 Qs" },
      { name: "Starter Shape & Geometry", diff: "Easy", qs: "10 Qs" },
      { name: "Starter Data & Averages", diff: "Easy", qs: "6 Qs" },
      { name: "Data Interpretation", diff: "Easy", qs: "10 Qs" },
      { name: "Arithmetic & Number", diff: "Medium", qs: "15 Qs" },
      { name: "Number Patterns", diff: "Medium", qs: "12 Qs" },
      { name: "Shape & Geometry", diff: "Medium", qs: "15 Qs" },
      { name: "Fractions & Percentages", diff: "Medium", qs: "10 Qs" },
      { name: "Percentages", diff: "Medium", qs: "10 Qs" },
      { name: "Ratio & Proportion", diff: "Medium", qs: "10 Qs" },
      { name: "Multi-step Word Problems", diff: "Medium", qs: "12 Qs" },
      { name: "Adv. Data Interpretation", diff: "Medium", qs: "10 Qs" },
      { name: "Advanced Arithmetic", diff: "Hard", qs: "12 Qs" },
      { name: "Advanced Shape & Geometry", diff: "Hard", qs: "15 Qs" },
      { name: "Advanced Fractions", diff: "Hard", qs: "10 Qs" },
      { name: "Advanced Number Patterns", diff: "Hard", qs: "10 Qs" },
      { name: "Advanced Percentages", diff: "Hard", qs: "10 Qs" },
      { name: "Advanced Ratio & Proportion", diff: "Hard", qs: "10 Qs" },
    ],
  },
  {
    label: "English Comprehension", icon: "📖", sub: "Passage reading & analysis",
    drills: [
      { name: "Fact Retrieval", diff: "Easy", qs: "15 Qs" },
      { name: "Vocabulary in Context", diff: "Medium", qs: "12 Qs" },
      { name: "Inference & Deduction", diff: "Medium", qs: "12 Qs" },
      { name: "Detail Retrieval", diff: "Medium", qs: "12 Qs" },
      { name: "Mood & Tone", diff: "Hard", qs: "10 Qs" },
      { name: "Advanced Comprehension", diff: "Hard", qs: "10 Qs" },
    ],
  },
];

const DIFF_STYLES: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

function DrillGrid({ drills }: { drills: typeof BANK_SUBJECTS[0]["drills"] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {drills.map((d, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-2">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${DIFF_STYLES[d.diff]}`}>{d.diff}</span>
            <span className="text-[8px] text-slate-400">{d.qs}</span>
          </div>
          <div className="text-[9px] font-bold text-slate-800 leading-tight mb-1.5">{d.name}</div>
          <div className="text-center text-[8px] font-bold py-0.5 rounded bg-slate-100 text-slate-600">Start</div>
        </div>
      ))}
    </div>
  );
}

function ScrollablePanel({
  children,
  maxHeight,
  className,
}: {
  children: ReactNode;
  maxHeight: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="overflow-y-auto overscroll-y-contain bg-white px-3 py-2"
        style={{ maxHeight }}
      >
        {children}
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

type PlatformSuitePreviewProps = {
  showScrollHint?: boolean;
  className?: string;
};

export function PlatformSuitePreview({ showScrollHint = true, className }: PlatformSuitePreviewProps) {
  return (
    <div className={cn("w-full space-y-3", className)} data-testid="platform-suite-preview">
      {showScrollHint && (
        <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 text-center">
          <p className="text-sm font-semibold text-primary flex items-center justify-center gap-2 flex-wrap">
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0 animate-bounce" />
            Scroll inside each panel below to explore practice tests, practice papers, and the full drill library
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0 animate-bounce" />
          </p>
          <p className="text-xs text-slate-500 mt-1">46 drills · 2,500+ GL-style questions · unlimited practice papers</p>
        </div>
      )}

      <div id={PLATFORM_ANCHORS.practiceTests} className="scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Practice Tests & Mocks" />
        <div className="bg-slate-50 px-3 pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Tests &amp; Mock Exams</p>
          <p className="text-[9px] text-slate-400">Structured assessments to measure progress and recalibrate your forecast score.</p>
        </div>
        <ScrollablePanel maxHeight="240px">
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Mini Practice Test", time: "8 mins", qs: "12 Qs", free: true, btn: "Start Free Test", btnStyle: "bg-slate-900 text-white" },
              { name: "Full Practice Test A", time: "30 mins", qs: "45 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Full Practice Test B", time: "30 mins", qs: "45 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 1", time: "35 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 2", time: "50 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 3", time: "50 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
            ].map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{c.name}</span>
                  {c.free ? <FreeBadge /> : <PaidBadge />}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-2">
                  <span>⏱ {c.time}</span><span>· {c.qs}</span>
                </div>
                <div className={`text-center text-[9px] font-bold py-1 rounded-md ${c.btnStyle}`}>{c.btn}</div>
              </div>
            ))}
          </div>
        </ScrollablePanel>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-500 font-medium">1 free mini test · 2 full practice tests · 3 mock exams · PDF report each</span>
          <PaidBadge />
        </div>
      </div>

      <div id={PLATFORM_ANCHORS.practicePapers} className="scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Practice Papers" />
        <div className="bg-slate-50 px-3 pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Papers</p>
          <p className="text-[9px] text-slate-400">Unlimited practice papers drawn from our full question bank.</p>
        </div>
        <ScrollablePanel maxHeight="200px">
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Quick Paper", icon: "⚡", time: "25 min", qs: "20 Qs", desc: "Focused paper across all 4 sections" },
              { name: "Full Paper", icon: "📄", time: "45 min", qs: "40 Qs", desc: "Complete paper mirroring real exam balance" },
              { name: "Mock Exam", icon: "🎓", time: "50 min", qs: "50 Qs", desc: "Exam simulation under timed conditions" },
            ].map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5 flex flex-col">
                <div className="text-base mb-1">{p.icon}</div>
                <div className="text-[10px] font-bold text-slate-800 mb-0.5">{p.name}</div>
                <div className="text-[9px] text-slate-500 mb-0.5">{p.time} · {p.qs}</div>
                <div className="text-[8px] text-slate-400 leading-snug mb-2 flex-1">{p.desc}</div>
                <div className="text-center text-[9px] font-bold py-1 rounded-md bg-slate-100 text-slate-700">Start Paper</div>
              </div>
            ))}
          </div>
        </ScrollablePanel>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-500 font-medium">Quick, Full & Mock formats · unlimited attempts · fresh questions each time</span>
          <PaidBadge />
        </div>
      </div>

      <div id={PLATFORM_ANCHORS.practiceBank} className="scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Practice Bank" />
        <div className="bg-slate-50 px-3 pt-3 pb-1 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Bank</p>
            <p className="text-[9px] text-slate-400">Targeted drills grouped by subject — work on the areas your child needs most.</p>
          </div>
          <div className="flex gap-1 shrink-0 ml-2 mt-0.5">
            {["Untimed", "Timed"].map((t, i) => (
              <span
                key={i}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <ScrollablePanel maxHeight="380px">
          <div className="space-y-4 pb-4">
            {BANK_SUBJECTS.map((subj) => (
              <div key={subj.label}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold text-slate-700">{subj.icon} {subj.label}</span>
                  <span className="text-[8px] text-slate-400">{subj.sub}</span>
                </div>
                <DrillGrid drills={subj.drills} />
              </div>
            ))}
          </div>
        </ScrollablePanel>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-500 font-medium">46 drills across 4 subjects · 2,500+ questions · adaptive difficulty · worked solutions</span>
          <PaidBadge />
        </div>
      </div>
    </div>
  );
}

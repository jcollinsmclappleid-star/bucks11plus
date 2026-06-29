import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsDown, MousePointerClick } from "lucide-react";
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

export function PaidBadge() {
  return (
    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
      Paid plan
    </span>
  );
}

export function FreeBadge() {
  return (
    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
      Free
    </span>
  );
}

const BANK_SUBJECTS = [
  {
    label: "Non-Verbal Reasoning",
    icon: "📐",
    sub: "Shape & pattern puzzles",
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
    label: "Verbal Reasoning",
    icon: "🔤",
    sub: "Language, logic & patterns",
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
    label: "Mathematics",
    icon: "➗",
    sub: "Arithmetic, geometry & problem-solving",
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
    label: "English Comprehension",
    icon: "📖",
    sub: "Passage reading & analysis",
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

function DrillGrid({ drills }: { drills: (typeof BANK_SUBJECTS)[0]["drills"] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {drills.map((d, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-2">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${DIFF_STYLES[d.diff]}`}>{d.diff}</span>
            <span className="text-[8px] text-slate-400">{d.qs}</span>
          </div>
          <div className="text-[9px] font-bold text-slate-800 leading-tight mb-1.5">{d.name}</div>
          <div className="text-center text-[8px] font-bold py-0.5 rounded bg-slate-100 text-slate-600 cursor-pointer transition hover:bg-slate-200 active:scale-[0.98]">
            Start
          </div>
        </div>
      ))}
    </div>
  );
}

function ScrollablePanel({
  children,
  maxHeight,
  className,
  showScrollHint = true,
  scrollLabel = "Scroll to explore",
}: {
  children: ReactNode;
  maxHeight: string;
  className?: string;
  showScrollHint?: boolean;
  scrollLabel?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHintVisible(el.scrollHeight > el.clientHeight + 2);
  }, []);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => window.removeEventListener("resize", updateOverflow);
  }, [updateOverflow, children, maxHeight]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el && el.scrollTop > 6) setHintVisible(false);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label={`${scrollLabel} — interactive preview`}
        className="overflow-y-auto overscroll-y-contain bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset"
        style={{ maxHeight }}
      >
        {children}
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent"
        aria-hidden="true"
      />
      {showScrollHint && hintVisible && (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex justify-center px-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur-sm">
            <ChevronsDown className="h-3 w-3 shrink-0 animate-bounce text-primary/70" aria-hidden="true" />
            {scrollLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export function InteractivePreviewFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary/[0.04] to-slate-50/80 p-3 shadow-sm ring-1 ring-primary/5",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-0.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <MousePointerClick className="h-3 w-3 shrink-0" aria-hidden="true" />
          Interactive preview
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
          <ChevronsDown className="h-3.5 w-3.5 shrink-0 animate-bounce text-primary/60" aria-hidden="true" />
          Scroll &amp; click inside
        </span>
      </div>
      {children}
    </div>
  );
}

type PanelShellProps = { className?: string; id?: string; compact?: boolean };

function PanelScrollBody({
  children,
  maxHeight,
  compact,
}: {
  children: ReactNode;
  maxHeight: string;
  compact?: boolean;
}) {
  if (compact) {
    return <div className="bg-white px-3 py-2">{children}</div>;
  }
  return <ScrollablePanel maxHeight={maxHeight}>{children}</ScrollablePanel>;
}

export function PracticeTestsPanel({ className, id, compact }: PanelShellProps) {
  return (
    <div
      id={id ?? PLATFORM_ANCHORS.practiceTests}
      className={cn("scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm", className)}
    >
      <BrowserChrome title="Practice Tests & Mocks" />
      <div className="bg-slate-50 px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Tests &amp; Mock Exams</p>
        <p className="text-[9px] text-slate-400">
          Structured assessments to measure progress and recalibrate your forecast score.
        </p>
      </div>
      <PanelScrollBody maxHeight="240px" compact={compact}>
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
                <span>⏱ {c.time}</span>
                <span>· {c.qs}</span>
              </div>
              <div
                className={`text-center text-[9px] font-bold py-1 rounded-md cursor-pointer transition hover:brightness-95 active:scale-[0.98] ${c.btnStyle}`}
              >
                {c.btn}
              </div>
            </div>
          ))}
        </div>
      </PanelScrollBody>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-medium">
          1 free mini test · 2 full practice tests · 3 mock exams · PDF report each
        </span>
        <PaidBadge />
      </div>
    </div>
  );
}

export function PracticePapersPanel({ className, id, compact }: PanelShellProps) {
  return (
    <div
      id={id ?? PLATFORM_ANCHORS.practicePapers}
      className={cn("scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm", className)}
    >
      <BrowserChrome title="Practice Papers" />
      <div className="bg-slate-50 px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Papers</p>
        <p className="text-[9px] text-slate-400">Unlimited practice papers drawn from our full question bank.</p>
      </div>
      <PanelScrollBody maxHeight="200px" compact={compact}>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Quick Paper", icon: "⚡", time: "25 min", qs: "20 Qs", desc: "Focused paper across all 4 sections" },
            { name: "Full Paper", icon: "📄", time: "45 min", qs: "40 Qs", desc: "Complete paper mirroring real exam balance" },
            { name: "Mock Exam", icon: "🎓", time: "50 min", qs: "50 Qs", desc: "Exam simulation under timed conditions" },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5 flex flex-col">
              <div className="text-base mb-1">{p.icon}</div>
              <div className="text-[10px] font-bold text-slate-800 mb-0.5">{p.name}</div>
              <div className="text-[9px] text-slate-500 mb-0.5">
                {p.time} · {p.qs}
              </div>
              <div className="text-[8px] text-slate-400 leading-snug mb-2 flex-1">{p.desc}</div>
              <div className="text-center text-[9px] font-bold py-1 rounded-md bg-slate-100 text-slate-700 cursor-pointer transition hover:bg-slate-200 active:scale-[0.98]">
                Start Paper
              </div>
            </div>
          ))}
        </div>
      </PanelScrollBody>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-medium">
          Quick, Full & Mock formats · unlimited attempts · fresh questions each time
        </span>
        <PaidBadge />
      </div>
    </div>
  );
}

export function PracticeDrillsPanel({ className, id, compact }: PanelShellProps) {
  return (
    <div
      id={id ?? PLATFORM_ANCHORS.practiceBank}
      className={cn("scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm", className)}
    >
      <BrowserChrome title="Practice Bank" />
      <div className="bg-slate-50 px-3 pt-3 pb-1 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Bank</p>
          <p className="text-[9px] text-slate-400">
            Targeted drills grouped by subject — work on the areas your child needs most.
          </p>
        </div>
        <div className="flex gap-1 shrink-0 ml-2 mt-0.5">
          {["Untimed", "Timed"].map((t, i) => (
            <span
              key={i}
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition hover:opacity-90 ${
                i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <PanelScrollBody maxHeight="380px" compact={compact}>
        <div className="space-y-4 pb-4">
          {BANK_SUBJECTS.map((subj) => (
            <div key={subj.label}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-bold text-slate-700">
                  {subj.icon} {subj.label}
                </span>
                <span className="text-[8px] text-slate-400">{subj.sub}</span>
              </div>
              <DrillGrid drills={subj.drills} />
            </div>
          ))}
        </div>
      </PanelScrollBody>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-medium">
          46 drills across 4 subjects · 2,500+ questions · adaptive difficulty · worked solutions
        </span>
        <PaidBadge />
      </div>
    </div>
  );
}

const HEATMAP_SKILLS = [
  { label: "VR", cells: [82, 74, 68, 71, 88, 65, 79, 72] },
  { label: "NVR", cells: [58, 62, 55, 70, 48, 66, 61, 54] },
  { label: "Maths", cells: [85, 78, 81, 90, 76, 83, 88, 80] },
  { label: "English", cells: [72, 69, 75, 64, 78, 71, 67, 73] },
];

function heatmapCellClass(v: number) {
  if (v >= 80) return "bg-emerald-500";
  if (v >= 65) return "bg-emerald-300";
  if (v >= 50) return "bg-amber-300";
  return "bg-red-300";
}

function TabToggle({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-1 shrink-0">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition hover:opacity-90 ${
            active === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function DashboardInsightsContent() {
  const sparkPoints = [108, 112, 114, 115, 118];
  const sparkW = 200;
  const sparkH = 48;
  const pad = 4;
  const minY = 100;
  const maxY = 125;
  const toX = (i: number) => pad + (i / (sparkPoints.length - 1)) * (sparkW - pad * 2);
  const toY = (v: number) => sparkH - pad - ((v - minY) / (maxY - minY)) * (sparkH - pad * 2);
  const linePath = sparkPoints.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  const targetY = toY(121);

  return (
    <div className="space-y-3 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
        <span className="text-[10px] font-bold text-slate-800">Year 5 · Bucks STT</span>
        <span className="text-[9px] text-slate-500">142 days to test</span>
        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
          🔥 17-day streak
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "121 forecast", value: "118", sub: "practice score" },
          { label: "This week", value: "86", sub: "questions" },
          { label: "Gap to 121", value: "3", sub: "points" },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-slate-200 bg-white p-2 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
            <p className="text-base font-bold text-primary leading-tight">{k.value}</p>
            <p className="text-[8px] text-slate-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-lg border border-slate-200 bg-white p-2">
          <p className="text-[9px] font-bold text-slate-700 mb-1">Today&apos;s session</p>
          <p className="text-[8px] text-emerald-600 font-semibold mb-1">✓ Quick paper · done</p>
          <p className="text-[8px] text-slate-500">78% accuracy · 24 min</p>
          <p className="text-[8px] text-emerald-700 mt-1.5 bg-emerald-50 rounded px-1.5 py-0.5">Win: VR codes strong</p>
          <p className="text-[8px] text-amber-800 mt-1 bg-amber-50 rounded px-1.5 py-0.5">Gap: NVR pace in Q2</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2">
          <p className="text-[9px] font-bold text-slate-700 mb-1">Next up</p>
          <div className="space-y-1.5">
            {[
              { name: "NVR transformations", flag: "Priority" },
              { name: "VR letter sequences", flag: "Queued" },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between gap-1">
                <span className="text-[8px] text-slate-700 leading-tight">{d.name}</span>
                <span
                  className={`text-[7px] font-bold px-1 py-0.5 rounded shrink-0 ${
                    d.flag === "Priority" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {d.flag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-bold text-slate-700">121-scale forecast trend</p>
          <span className="text-[8px] text-slate-400">last 5 checks</span>
        </div>
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-12" aria-hidden="true">
          <line x1={pad} y1={targetY} x2={sparkW - pad} y2={targetY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
          <text x={sparkW - pad - 2} y={targetY - 2} fontSize="7" fill="#1e3a6e" textAnchor="end">
            121
          </text>
          <path d={linePath} fill="none" stroke="#1e3a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {sparkPoints.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="#f59e0b" />
          ))}
        </svg>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <p className="text-[9px] font-bold text-slate-700 mb-2">Skill mastery heatmap</p>
        <div className="space-y-1">
          {HEATMAP_SKILLS.map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-slate-600 w-10 shrink-0">{row.label}</span>
              <div className="grid grid-cols-8 gap-0.5 flex-1">
                {row.cells.map((v, i) => (
                  <div key={i} className={`h-3 rounded-sm ${heatmapCellClass(v)}`} title={`${v}%`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsInsightsContent() {
  return (
    <div className="space-y-3 pb-2">
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "121 forecast", value: "118" },
          { label: "This week", value: "86" },
          { label: "Streak", value: "17d" },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-slate-200 bg-white p-2 text-center">
            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
            <p className="text-base font-bold text-primary leading-tight">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <p className="text-[9px] font-bold text-slate-700 mb-2">Stamina — first vs second half</p>
        <div className="space-y-1.5">
          <div>
            <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
              <span>First half</span>
              <span className="font-bold text-emerald-700">79%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[79%] bg-emerald-500 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
              <span>Second half</span>
              <span className="font-bold text-amber-700">64%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[64%] bg-amber-400 rounded-full" />
            </div>
          </div>
        </div>
        <p className="text-[8px] font-semibold text-amber-800 mt-2 bg-amber-50 rounded px-1.5 py-1 inline-block">
          −15% drop — stamina focus recommended
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <p className="text-[9px] font-bold text-slate-700 mb-1.5">Where to focus next</p>
        <div className="space-y-1.5">
          {[
            { skill: "NVR: cube rotations", impact: "+4 pts" },
            { skill: "VR: letter sequences", impact: "+3 pts" },
            { skill: "Maths: ratio problems", impact: "+2 pts" },
          ].map((item, i) => (
            <div key={item.skill} className="flex items-center justify-between gap-2">
              <span className="text-[8px] text-slate-700">
                <span className="font-bold text-slate-400 mr-1">{i + 1}.</span>
                {item.skill}
              </span>
              <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50/80 p-2">
        <p className="text-[9px] font-bold text-violet-900 mb-1">Pace discipline</p>
        <p className="text-[8px] text-violet-800/90 leading-relaxed">
          Avg <strong>38s</strong> per question across timed sessions · VR running <strong>12s slow</strong> vs target pace
          on the Bucks STT format.
        </p>
      </div>
    </div>
  );
}

export function ParentInsightsPanel({ className, id }: PanelShellProps) {
  const [tab, setTab] = useState<"Dashboard" | "Analytics">("Dashboard");
  const isDashboard = tab === "Dashboard";

  return (
    <div
      id={id ?? "parent-insights"}
      className={cn("scroll-mt-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm", className)}
    >
      <BrowserChrome
        title="Parent Hub"
        right={<TabToggle tabs={["Dashboard", "Analytics"]} active={tab} onChange={(t) => setTab(t as "Dashboard" | "Analytics")} />}
      />
      <div className="bg-slate-50 px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold text-slate-700 mb-0.5">
          {isDashboard ? "Parent dashboard" : "Parent analytics"}
        </p>
        <p className="text-[9px] text-slate-400">
          {isDashboard
            ? "121-scale forecast, session recaps, weekly plan & skill heatmap — updated after every practice."
            : "Stamina patterns, pace discipline & ranked focus areas — the detail behind the headline score."}
        </p>
      </div>
      <ScrollablePanel maxHeight="340px">
        {isDashboard ? <DashboardInsightsContent /> : <AnalyticsInsightsContent />}
      </ScrollablePanel>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-medium">
          {isDashboard ? "Overview · plan · heatmap" : "Stamina · pace · priority gaps"}
        </span>
        <PaidBadge />
      </div>
    </div>
  );
}

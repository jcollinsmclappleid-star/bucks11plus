import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Shield, Award, Star, ChevronUp, TrendingUp, Brain, Layers, Hash, BookOpen, Trophy } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";

/* ─── PANEL COMPONENTS (used as platform visual mockups) ─── */

function ForecastPanel() {
  return (
    <div className="flex flex-col items-center gap-4 w-full" data-testid="showcase-forecast">
      <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Readiness Forecast</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">Amber — Borderline</span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-6xl font-bold leading-none">114</div>
              <div className="text-xs text-white/50 mt-1">estimated score</div>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex justify-between text-[10px] text-white/40 mb-1">
                <span>Current</span>
                <span className="text-amber-300 font-bold">121 Target</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(114/130)*100}%` }} />
              </div>
              <div className="text-right text-[10px] text-amber-300 font-bold mt-1">7 points to go</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="rounded-xl bg-white border border-slate-200 p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-emerald-600">82%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Maths</div>
          <div className="h-1 rounded-full bg-emerald-400 mt-1.5 mx-auto w-2/3" />
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-amber-600">72%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verbal</div>
          <div className="h-1 rounded-full bg-amber-400 mt-1.5 mx-auto w-2/3" />
        </div>
        <div className="rounded-xl bg-white border border-red-100 p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-red-600">58%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">NVR</div>
          <div className="h-1 rounded-full bg-red-400 mt-1.5 mx-auto w-2/3" />
        </div>
      </div>

      <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
        <div className="p-1.5 bg-amber-400 rounded-lg text-white shrink-0">
          <Target className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-800">Priority: Non-Verbal Reasoning</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Closing this gap could add 4–5 points to forecast</p>
        </div>
      </div>
    </div>
  );
}

function SectionsPanel() {
  const sections = [
    { name: "Verbal Reasoning", score: 72, bar: "bg-violet-500", badge: "bg-violet-100 text-violet-700", iconBg: "bg-violet-100 text-violet-700", border: "border-violet-100", icon: <Brain className="h-3.5 w-3.5" />, subs: [
      { name: "Letter Patterns", score: 80 }, { name: "Vocab & Synonyms", score: 60 }, { name: "Code Sequences", score: 75 }
    ]},
    { name: "Non-Verbal Reasoning", score: 58, bar: "bg-red-500", badge: "bg-red-100 text-red-700", iconBg: "bg-blue-100 text-blue-700", border: "border-red-100", icon: <Layers className="h-3.5 w-3.5" />, subs: [
      { name: "Spatial Sequences", score: 50 }, { name: "Rotation & Reflection", score: 55 }, { name: "Classification", score: 65 }
    ]},
    { name: "Mathematics", score: 80, bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", iconBg: "bg-emerald-100 text-emerald-700", border: "border-emerald-100", icon: <Hash className="h-3.5 w-3.5" />, subs: [
      { name: "Arithmetic", score: 85 }, { name: "Fractions & Ratios", score: 70 }, { name: "Data Interpretation", score: 80 }
    ]},
    { name: "English Comprehension", score: 66, bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700", iconBg: "bg-amber-100 text-amber-700", border: "border-amber-100", icon: <BookOpen className="h-3.5 w-3.5" />, subs: [
      { name: "Inference & Deduction", score: 62 }, { name: "Authorial Intent", score: 70 }, { name: "Vocabulary in Context", score: 75 }
    ]},
  ];
  return (
    <div className="space-y-2.5 w-full" data-testid="showcase-sections">
      {sections.map((s, i) => (
        <div key={i} className={`bg-white rounded-xl border ${s.border} p-3.5 shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${s.iconBg}`}>{s.icon}</div>
              <span className="font-semibold text-slate-800 text-xs">{s.name}</span>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
              {s.score >= 75 ? "Strong" : s.score >= 65 ? "Developing" : "Needs focus"}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700 w-8 text-right">{s.score}%</span>
          </div>
          <div className="ml-1 pl-3 border-l-2 border-slate-100 space-y-0.5">
            {s.subs.map((sub, j) => (
              <div key={j} className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">{sub.name}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${sub.score >= 75 ? 'bg-emerald-500' : sub.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.score}%` }} />
                  </div>
                  <span className={`font-bold text-[9px] w-6 text-right ${sub.score >= 75 ? 'text-emerald-600' : sub.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{sub.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
        <div className="p-1.5 bg-red-500 rounded-lg text-white shrink-0">
          <Target className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-xs font-bold text-red-800">Priority 1: Non-Verbal Reasoning</p>
          <p className="text-[10px] text-red-600 mt-0.5">Spatial sequences and rotation need targeted practice — could add ~5 points</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const tiles = [
    { value: "78", label: "Readiness Score", sub: "Borderline", iconBg: "bg-amber-500", icon: <Award className="h-4 w-4" />, topBar: "bg-amber-500" },
    { value: "82", label: "Timing Score", sub: "Well-paced", iconBg: "bg-violet-500", icon: <Clock className="h-4 w-4" />, topBar: "bg-violet-500" },
    { value: "High", label: "Reliability", sub: "4 tests taken", iconBg: "bg-blue-500", icon: <Shield className="h-4 w-4" />, topBar: "bg-blue-500" },
    { value: "74%", label: "Difficulty-adj.", sub: "Accuracy", iconBg: "bg-emerald-500", icon: <Zap className="h-4 w-4" />, topBar: "bg-emerald-500" },
  ];
  const priorities = [
    { label: "NVR: Spatial sequences", gain: "+6 pts", color: "bg-red-500" },
    { label: "VR: Letter patterns", gain: "+4 pts", color: "bg-amber-500" },
    { label: "Maths: Ratio problems", gain: "+3 pts", color: "bg-blue-400" },
  ];
  return (
    <div className="space-y-3 w-full" data-testid="showcase-analytics">
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((t, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className={`h-1 w-full ${t.topBar}`} />
            <div className="p-3 text-center">
              <div className="flex justify-center mb-1.5">
                <div className={`p-1.5 rounded-lg text-white ${t.iconBg}`}>{t.icon}</div>
              </div>
              <div className="text-xl font-bold text-primary">{t.value}</div>
              <div className="text-[9px] text-muted-foreground font-medium leading-tight">{t.label}</div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1 bg-orange-100 text-orange-700 rounded-md">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs font-bold text-primary">Stamina</div>
          <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">-11% accuracy drop</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center">
            <div className="text-sm font-bold text-emerald-700">79%</div>
            <div className="text-[9px] text-slate-500 mt-0.5">First half</div>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-2 text-center">
            <div className="text-sm font-bold text-amber-700">68%</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Second half</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-primary/10 rounded-md">
            <Target className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-xs font-bold text-primary">Where to Focus Next</div>
        </div>
        {priorities.map((p, i) => (
          <div key={i} className="flex items-center gap-2 py-1 border-b border-slate-50 last:border-0">
            <div className={`w-5 h-5 rounded-full ${p.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>{i + 1}</div>
            <span className="text-[11px] text-slate-700 flex-1">{p.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${i === 0 ? 'bg-red-100 text-red-700' : i === 1 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{p.gain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressPanel() {
  return (
    <div className="space-y-3 w-full" data-testid="showcase-progress">
      <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-5 relative overflow-hidden shadow-lg">
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-white/60">Score Over Time</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full">↑ Improving</span>
        </div>
        <svg viewBox="0 0 240 80" className="w-full h-20">
          <defs>
            <linearGradient id="scoreAreaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="18" x2="240" y2="18" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
          <text x="220" y="14" fontSize="7" fill="#f59e0b" fontWeight="bold">121</text>
          <path d="M 20 65 L 75 52 L 140 37 L 210 24 L 210 80 L 20 80 Z" fill="url(#scoreAreaGrad2)" />
          <path d="M 20 65 L 75 52 L 140 37 L 210 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="65" r="3.5" fill="#94a3b8" />
          <circle cx="75" cy="52" r="3.5" fill="#94a3b8" />
          <circle cx="140" cy="37" r="3.5" fill="#f59e0b" />
          <circle cx="210" cy="24" r="4.5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
          <text x="13" y="78" fontSize="7" fill="#94a3b8">Test 1</text>
          <text x="60" y="66" fontSize="7" fill="#94a3b8">Test 2</text>
          <text x="128" y="51" fontSize="7" fill="#f59e0b">Test 3</text>
          <text x="194" y="20" fontSize="7" fill="#f59e0b" fontWeight="bold">Test 4</text>
          <text x="13" y="61" fontSize="7" fill="rgba(255,255,255,0.5)">105</text>
          <text x="68" y="49" fontSize="7" fill="rgba(255,255,255,0.5)">110</text>
          <text x="133" y="33" fontSize="7" fill="#f59e0b">114</text>
          <text x="196" y="40" fontSize="7" fill="#f59e0b" fontWeight="bold">117</text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1"><div className="p-1 bg-emerald-500 rounded-md text-white"><TrendingUp className="h-3 w-3" /></div></div>
          <div className="text-xl font-bold text-emerald-700">+12</div>
          <div className="text-[10px] text-slate-500 font-medium">Points gained</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1"><div className="p-1 bg-blue-500 rounded-md text-white"><BarChart3 className="h-3 w-3" /></div></div>
          <div className="text-xl font-bold text-blue-700">4</div>
          <div className="text-[10px] text-slate-500 font-medium">Tests taken</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1"><div className="p-1 bg-amber-500 rounded-md text-white"><Trophy className="h-3 w-3" /></div></div>
          <div className="text-xl font-bold text-amber-700">117</div>
          <div className="text-[10px] text-slate-500 font-medium">Latest score</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-emerald-100 rounded-md text-emerald-700"><ChevronUp className="h-3.5 w-3.5" /></div>
          <div className="text-xs font-bold text-primary">Closing the Gap to 121</div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs">16 pts gap</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">4 pts gap</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Gap narrowing by ~3 points per readiness check — on track for 121 within 6 weeks</p>
      </div>
    </div>
  );
}

function PracticeQuestionPanel() {
  return (
    <div className="w-full space-y-3" data-testid="showcase-practice">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Verbal Reasoning</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="h-3 w-3" />
            <span>1:42</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Question 14 of 25</p>
          <p className="text-sm font-medium text-slate-800 mb-4 leading-relaxed">
            Which word is the <span className="font-bold text-violet-700">odd one out</span> from the group below?
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { letter: "A", word: "Jubilant", highlight: false },
              { letter: "B", word: "Elated", highlight: false },
              { letter: "C", word: "Melancholy", highlight: true },
              { letter: "D", word: "Ecstatic", highlight: false },
              { letter: "E", word: "Overjoyed", highlight: false },
            ].map((opt) => (
              <div
                key={opt.letter}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm cursor-default transition-colors ${
                  opt.highlight
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${opt.highlight ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {opt.letter}
                </span>
                {opt.word}
                {opt.highlight && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-emerald-50 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-700 leading-snug">
            <span className="font-bold">Correct.</span> All other words mean happy or joyful. Melancholy means sad — the odd one out.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center shadow-sm">
          <div className="text-base font-bold text-emerald-600">18/25</div>
          <div className="text-[10px] text-slate-500">Correct</div>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center shadow-sm">
          <div className="text-base font-bold text-primary">72%</div>
          <div className="text-[10px] text-slate-500">Accuracy</div>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center shadow-sm">
          <div className="text-base font-bold text-violet-600">Hard</div>
          <div className="text-[10px] text-slate-500">Level</div>
        </div>
      </div>
    </div>
  );
}

function ProgrammePanel() {
  const tasks = [
    { subject: "NVR", topic: "Spatial Sequences Drill", duration: "15 min", priority: "high", done: true },
    { subject: "VR", topic: "Letter Pattern Practice", duration: "12 min", priority: "high", done: true },
    { subject: "Maths", topic: "Ratio Word Problems", duration: "10 min", priority: "medium", done: false },
    { subject: "VR", topic: "Code Sequence Drill", duration: "10 min", priority: "medium", done: false },
    { subject: "NVR", topic: "Rotation & Reflection", duration: "15 min", priority: "high", done: false },
  ];

  return (
    <div className="w-full space-y-3" data-testid="showcase-programme">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-primary/5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary">This Week's Programme</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Targeting NVR gap — highest impact first</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">2/5 done</span>
        </div>
        <div className="divide-y divide-slate-50">
          {tasks.map((task, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${task.done ? "opacity-60" : ""}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${task.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                {task.done && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}>{task.topic}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    task.subject === "NVR" ? "bg-blue-100 text-blue-700" :
                    task.subject === "VR" ? "bg-violet-100 text-violet-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>{task.subject}</span>
                  <span className="text-[10px] text-slate-400">{task.duration}</span>
                </div>
              </div>
              {!task.done && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${task.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {task.priority === "high" ? "Priority" : "Next"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
        <div className="p-1.5 bg-primary rounded-lg text-white shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary">On track for 121</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Completing this week's plan adds est. +3 forecast points</p>
        </div>
      </div>
    </div>
  );
}

function ChildExperiencePanel() {
  return (
    <div className="w-full max-w-sm mx-auto" data-testid="showcase-child-experience">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 pt-6 pb-4 text-center border-b border-amber-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span className="text-lg font-bold text-primary font-serif">Drill Complete!</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="inline-flex flex-col items-center gap-0.5 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full">Non-Verbal Reasoning</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Shape & pattern puzzles</span>
          </div>
          <div className="text-5xl font-bold text-primary mb-1">78%</div>
          <p className="text-[11px] text-slate-500 mb-3">14 out of 18 correct</p>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3 mx-4">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: "78%" }} />
          </div>
          <p className="text-sm font-medium text-primary/80 italic">Well done! You're making great progress.</p>
        </div>
        <div className="flex gap-2 p-4">
          <div className="flex-1 py-2 px-3 bg-slate-100 rounded-lg text-center text-xs font-semibold text-slate-500 cursor-default select-none">Try Again</div>
          <div className="flex-1 py-2 px-3 bg-primary rounded-lg text-center text-xs font-semibold text-white cursor-default select-none">Back to Practice</div>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 italic text-center mt-3">Illustrative example of what your child sees</p>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Bucks 11 Plus Practice Tests — Free GL Readiness Check Benchmarked to 121 | Bucks 11 Plus Tests"
        description="Know exactly where your child stands for the Buckinghamshire 11+. Take a free 8-minute GL-style readiness check and see their forecast score against the 121 qualifying threshold — with the 3 priorities to fix next."
        canonicalPath="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is the Buckinghamshire 11+ Secondary Transfer Test?", acceptedAnswer: { "@type": "Answer", text: "The Buckinghamshire Secondary Transfer Test (STT) is a selective entrance exam taken by children in Year 6, typically in September. It determines eligibility for all 13 state-funded grammar schools in Buckinghamshire. The test is produced by GL Assessment and covers four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension." } },
            { "@type": "Question", name: "What does 121 mean in the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "121 is the standardised score threshold used in Buckinghamshire to determine whether a child qualifies for grammar school." } },
            { "@type": "Question", name: "How does the free readiness check work?", acceptedAnswer: { "@type": "Answer", text: "The free readiness check is a 12-question, 8-minute timed assessment in GL-style format. No account is needed. On completion, parents receive a readiness band, a forecast standardised score toward 121, and a breakdown across the four test sections." } },
            { "@type": "Question", name: "What is included in Bucks Plus Edge?", acceptedAnswer: { "@type": "Answer", text: "Bucks Plus Edge (£35/month or £279/year) includes 1,500+ GL-style questions across all four test domains, timed drills, full mock readiness checks, PDF reports, parent analytics, progress tracking, and a guided programme." } },
          ]
        }}
      />

      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }} data-testid="section-hero">
        <div className="absolute inset-0 z-0 hero-texture" />
        <div className="absolute inset-0 z-0 hero-vignette" />
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 100%)' }} />

        <div className="container mx-auto max-w-6xl px-4 relative z-10">

          {/* School ticker */}
          <div className="w-full overflow-hidden mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center mb-2">All 13 Buckinghamshire grammar schools</p>
            <div className="school-ticker">
              <div className="ticker-content">
                {["Aylesbury Grammar", "Aylesbury High", "Burnham Grammar", "Chesham Grammar", "Dr Challoner's Grammar", "Dr Challoner's High", "John Hampden Grammar", "Royal Grammar School", "Royal Latin", "Sir Henry Floyd Grammar", "Sir William Borlase's Grammar", "Wycombe High", "The Misbourne"].map((s, i) => (
                  <span key={i}>{s}<span className="separator"> •</span></span>
                ))}
              </div>
              <div className="ticker-content" aria-hidden="true">
                {["Aylesbury Grammar", "Aylesbury High", "Burnham Grammar", "Chesham Grammar", "Dr Challoner's Grammar", "Dr Challoner's High", "John Hampden Grammar", "Royal Grammar School", "Royal Latin", "Sir Henry Floyd Grammar", "Sir William Borlase's Grammar", "Wycombe High", "The Misbourne"].map((s, i) => (
                  <span key={i}>{s}<span className="separator"> •</span></span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero two-column layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Headline + CTAs */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80 mb-4">Built for the Buckinghamshire 11+</span>
                <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.1] font-serif">
                  Know exactly where your child stands — and what to fix next.
                </h1>
              </div>
              <p className="text-base md:text-lg text-white/65 leading-relaxed" data-testid="text-hero-sub">
                Our intelligent diagnostics don't just give you questions — they identify the precise gaps costing marks, rank your child's highest-impact focus areas, and track real progress toward the <span className="text-amber-300 font-semibold">121 qualifying score</span>. With 1,500+ GL-style questions to close every gap.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="h-12 px-8 text-base bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold shadow-lg shadow-amber-400/20 border-none" asChild data-testid="button-hero-primary">
                  <Link href="/free-diagnostic">
                    Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 text-base border-white/20 text-white hover:bg-white/10 font-semibold" asChild data-testid="button-hero-secondary">
                  <Link href="/pricing">See Plans</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-5" data-testid="trust-signal-hero">
                <div className="flex items-center gap-2 text-white/45 text-xs">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span>Trusted by Bucks families</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/35 text-xs">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Secure payments · Cancel anytime</span>
                </div>
                <div className="text-white/30 text-xs">No account needed for the free check</div>
              </div>
            </div>

            {/* Right: Forecast mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-400/10 to-transparent blur-2xl" />
                <div className="relative">
                  <ForecastPanel />
                  <p className="text-[10px] text-white/25 italic text-center mt-3">Illustrative example — not official standardised results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PLATFORM VISUAL TRIPTYCH ── */}
      <section className="py-16 md:py-20 bg-white border-b border-border/30" id="see-product" data-testid="section-triptych">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">The Platform</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Everything you need to reach 121</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From GL-style practice questions to intelligent analytics and a guided programme — all designed specifically for the Buckinghamshire 11+.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1: Practice Questions */}
            <div className="flex flex-col gap-3" data-testid="triptych-practice">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">GL-Style Practice</p>
                  <p className="text-[11px] text-slate-500">1,500+ questions across all 4 domains</p>
                </div>
              </div>
              <PracticeQuestionPanel />
            </div>

            {/* Card 2: Subject Breakdown */}
            <div className="flex flex-col gap-3" data-testid="triptych-breakdown">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Target className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Intelligent Diagnostics</p>
                  <p className="text-[11px] text-slate-500">Exact gaps by subject & sub-topic</p>
                </div>
              </div>
              <SectionsPanel />
            </div>

            {/* Card 3: Programme */}
            <div className="flex flex-col gap-3" data-testid="triptych-programme">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Guided Programme</p>
                  <p className="text-[11px] text-slate-500">Priority-ranked weekly task plan</p>
                </div>
              </div>
              <ProgrammePanel />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2B: CHILD EXPERIENCE ── */}
      <section className="py-16 md:py-20 bg-amber-50/50 border-b border-amber-100/80" data-testid="section-child-experience">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-amber-700/60 uppercase tracking-widest mb-4">For your child</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4 leading-tight">
                Preparation that feels like progress, not pressure.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Your child sees friendly subject names they can relate to, receives warm encouragement after every drill, and can jump straight back in with a single tap — building confidence session by session.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Brain className="h-4 w-4" />, label: "Verbal Reasoning", sub: "Word puzzles & letter patterns", bg: "bg-violet-100 text-violet-700", border: "border-violet-200" },
                  { icon: <Layers className="h-4 w-4" />, label: "Non-Verbal Reasoning", sub: "Shape & pattern puzzles", bg: "bg-blue-100 text-blue-700", border: "border-blue-200" },
                  { icon: <Hash className="h-4 w-4" />, label: "Mathematics", sub: "Number problems", bg: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
                  { icon: <BookOpen className="h-4 w-4" />, label: "English Comprehension", sub: "Reading & comprehension", bg: "bg-amber-100 text-amber-700", border: "border-amber-200" },
                ].map((s, i) => (
                  <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border bg-white ${s.border}`} data-testid={`child-section-chip-${i}`}>
                    <div className={`p-1.5 rounded-lg shrink-0 ${s.bg}`}>{s.icon}</div>
                    <div>
                      <p className="text-[11px] font-bold text-primary leading-tight">{s.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {[
                  "Encouragement after every drill — not just a score",
                  "Try Again in one tap — builds resilience, not fear",
                  "Section names in language a 10-year-old understands",
                ].map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <p className="text-sm text-slate-700">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <ChildExperiencePanel />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: INTELLIGENCE STRIP ── */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-border/30" data-testid="section-intelligence">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-amber-400/60 uppercase tracking-widest mb-3">Why we're different</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-3">Not just practice. Intelligent preparation.</h2>
            <p className="text-white/55 max-w-xl mx-auto">Generic practice books give your child more questions. We give you the answers that matter — <em>exactly</em> what to fix, in what order, and how much it's worth.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                iconBg: "bg-amber-400/20 text-amber-300",
                title: "Readiness Diagnostics",
                desc: "Our readiness checks produce a forecast score toward 121 and pinpoint the exact question types holding your child back — right down to sub-topic level.",
                stat: "Forecast score",
                statSub: "vs 121 threshold",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                iconBg: "bg-violet-400/20 text-violet-300",
                title: "Targeted Practice",
                desc: "1,500+ GL-style questions served in difficulty-adaptive drills, full papers, and mock exams — with every session feeding back into your child's readiness forecast.",
                stat: "1,500+ questions",
                statSub: "GL-style, 4 domains",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                iconBg: "bg-emerald-400/20 text-emerald-300",
                title: "Parent Analytics & Progress",
                desc: "Deep analytics show stamina, timing patterns, score reliability, and where the most points are available. Weekly progress tracks the gap to 121 closing in real time.",
                stat: "Gap closed",
                statSub: "test by test",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6" data-testid={`intelligence-pillar-${i}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif mb-2">{item.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-white/10">
                  <div className="text-sm font-bold text-amber-300">{item.stat}</div>
                  <div className="text-xs text-white/40">{item.statSub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" className="h-12 px-8 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold border-none shadow-lg" asChild data-testid="button-intelligence-cta">
              <Link href="/free-diagnostic">
                Start Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ANALYTICS DEEP DIVE ── */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-border/30" data-testid="section-analytics">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <AnalyticsPanel />
            </div>
            <div className="order-1 lg:order-2 flex flex-col gap-5">
              <div>
                <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Parent Analytics</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">Answers parents actually need</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Stop guessing. Our parent analytics dashboard tells you your child's readiness score, timing performance, stamina patterns, and exactly which three areas will gain the most points if addressed next.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <Award className="h-4 w-4 text-amber-600" />, bg: "bg-amber-50 border-amber-200", title: "Readiness score", desc: "Forecast standardised score benchmarked to the 121 qualifying threshold" },
                  { icon: <Zap className="h-4 w-4 text-violet-600" />, bg: "bg-violet-50 border-violet-200", title: "Stamina analysis", desc: "Accuracy in the first vs second half — key for exam-day performance" },
                  { icon: <Target className="h-4 w-4 text-red-600" />, bg: "bg-red-50 border-red-200", title: "Priority focus areas", desc: "Ranked list of highest-impact gaps with estimated point gains" },
                ].map((feat, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${feat.bg}`} data-testid={`analytics-feature-${i}`}>
                    <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0">{feat.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-primary">{feat.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Button asChild className="bg-primary" data-testid="button-analytics-cta">
                  <Link href="/pricing">See Full Analytics Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-how-it-works">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Simple to start</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From your first readiness check to closing the gap to 121 — here's the path.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                step: "01",
                title: "Take a free readiness check",
                desc: "12 GL-style questions. 8 minutes. No account needed. Get an instant forecast score and your three priority gaps.",
                cta: { href: "/free-diagnostic", label: "Start free" },
                accent: "border-amber-300 bg-amber-50",
                numColor: "text-amber-600",
              },
              {
                step: "02",
                title: "See exactly what to fix",
                desc: "Get a subject breakdown to sub-topic level — ranked by how many points each gap is worth. No more guessing what to practice.",
                cta: null,
                accent: "border-violet-200 bg-violet-50",
                numColor: "text-violet-600",
              },
              {
                step: "03",
                title: "Follow the guided programme",
                desc: "Your weekly programme prioritises the highest-impact tasks first. Every session updates your forecast. Track the gap to 121 closing.",
                cta: { href: "/pricing", label: "Start programme" },
                accent: "border-emerald-200 bg-emerald-50",
                numColor: "text-emerald-600",
              },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col gap-4 rounded-2xl border-2 p-6 ${s.accent}`} data-testid={`how-it-works-step-${i}`}>
                <div className={`text-5xl font-bold font-serif ${s.numColor} opacity-30 leading-none`}>{s.step}</div>
                <div>
                  <h3 className="text-lg font-bold text-primary font-serif mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                {s.cta && (
                  <Link href={s.cta.href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                    {s.cta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="h-12 px-8 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold border-none" asChild data-testid="button-how-it-works-cta">
              <Link href="/free-diagnostic">Start your free readiness check — no account needed <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS ── */}
      <section className="py-14 md:py-16 bg-slate-50 border-b border-border/30" data-testid="section-testimonials">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">What parents say</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">Families preparing with confidence</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "The readiness check showed us exactly where she was losing marks — we dropped the generic practice and focused on NVR sequences. Her scores improved noticeably within three weeks.", name: "Sarah M.", detail: "Parent of Year 5 child, targeting Beaconsfield High" },
              { quote: "Instead of more questions to wade through, it told us precisely what to fix and in what order. The parent analytics dashboard is incredibly clear.", name: "James T.", detail: "Parent of Year 6 child, targeting Royal Latin" },
              { quote: "Starting with the free readiness check was the best thing we did. It showed my son was much stronger in Maths than we thought, and that Verbal Reasoning was the real gap.", name: "Priya K.", detail: "Parent of Year 5 child, targeting Dr Challoner's" },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3 shadow-sm" data-testid={`testimonial-${i}`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: PRICING ── */}
      <section id="pricing" className="py-16 md:py-20 bg-white border-b border-border/30" data-testid="section-pricing">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Start with the free readiness check. Upgrade when you're ready. Both paid plans include every feature.</p>
          </div>

          {/* Free tier */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 max-w-3xl mx-auto" data-testid="pricing-card-free">
            <div>
              <p className="font-bold text-primary text-sm">Free Readiness Check</p>
              <p className="text-xs text-slate-500 mt-0.5">No account needed · 12-question GL-style check · Readiness band · Forecast score · 3 priorities</p>
            </div>
            <Link href="/free-diagnostic" className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-primary text-primary font-semibold py-2 px-5 text-sm hover:bg-primary/5 transition-colors whitespace-nowrap" data-testid="button-pricing-free">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Paid cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm p-7" data-testid="pricing-card-monthly">
              <p className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-1">Monthly</p>
              <p className="text-sm font-bold text-primary mb-1">Bucks Plus Edge</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-primary">£35</span>
                <span className="text-slate-500 text-sm mb-1">/month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Cancel anytime</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8 flex-1">
                {[
                  "1,500+ GL-style practice questions",
                  "Full-length practice papers (50 questions)",
                  "Full GL-style mock exams (40 questions)",
                  "All Hard-level challenge drills",
                  "PDF readiness reports",
                  "Parent analytics dashboard",
                  "Guided preparation programme",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link href="/pricing?autoCheckout=pack_plus" className="block text-center w-full rounded-lg bg-primary text-white font-semibold py-2.5 text-sm hover:bg-primary/90 transition-colors" data-testid="button-pricing-monthly">
                Start Monthly
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-primary bg-white shadow-md p-7 relative" data-testid="pricing-card-annual">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">Best Value — Save £141</div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Annual</p>
              <p className="text-sm font-bold text-primary mb-1">Bucks Plus Edge</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-primary">£279</span>
                <span className="text-slate-500 text-sm mb-1">/year</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">equiv. £23.25/month · 34% off</p>
              <p className="text-xs text-emerald-600 font-semibold mb-6">Save £141 vs monthly</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8 flex-1">
                {[
                  "Everything in Monthly — identical access",
                  "1,500+ GL-style practice questions",
                  "Full-length practice papers (50 questions)",
                  "Full GL-style mock exams (40 questions)",
                  "PDF readiness reports & analytics",
                  "12 months · Cancel anytime",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-emerald-500'}`} /><span className={i === 0 ? 'font-bold text-primary' : ''}>{f}</span></li>
                ))}
              </ul>
              <Link href="/pricing?autoCheckout=pack_annual" className="block text-center w-full rounded-lg bg-primary text-white font-semibold py-2.5 text-sm hover:bg-primary/90 transition-colors" data-testid="button-pricing-annual">
                Get Annual Access
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <p className="text-center text-xs text-slate-400">All prices include VAT. Subscriptions renew automatically and can be cancelled anytime. <Link href="/pricing" className="text-primary hover:underline">See full pricing details →</Link></p>
            <div className="flex items-center gap-2 shrink-0 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-sm" data-testid="badge-stripe">
              <svg width="40" height="16" viewBox="0 0 60 25" fill="none" aria-label="Stripe" role="img">
                <path d="M5.45 9.77c0-.92.76-1.28 2.01-1.28 1.8 0 4.06.54 5.86 1.5V4.82A15.6 15.6 0 0 0 7.46 4C3.17 4 .25 6.18.25 9.99c0 5.92 8.16 4.98 8.16 7.54 0 1.09-.95 1.44-2.26 1.44-1.96 0-4.47-.8-6.45-1.9v5.24A16.4 16.4 0 0 0 6.15 24c4.4 0 7.44-2.17 7.44-6.03C13.6 11.5 5.45 12.6 5.45 9.77zm16.3-8.33L17 2.56l-.04 16.78H22V1.44h-.25zM28.6 6.1l-.33 1.52h-3.14v16.1h5.06V12.4c1.2-1.56 3.23-1.27 3.86-1.05V6.43c-.65-.24-3.02-.68-5.45.67zm9.7-2.27a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8zm-2.53 20h5.06V7.62h-5.06v16.1zm14.27-8.5c0-3.28 1.52-4.66 3.97-4.66 2.33 0 3.5 1.3 3.5 4.66v8.5H62.6V14.8C62.6 8.72 59.45 7 56.18 7c-2.55 0-4.42 1.12-5.51 2.97l-.23-2.35H45.5v16.1h5.06V15.33z" fill="#635BFF"/>
              </svg>
              <span className="text-[11px] text-slate-400 font-medium">Payments by Stripe</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4" data-testid="company-trust">
            <Shield className="h-3.5 w-3.5 text-slate-300" />
            <p className="text-center text-xs text-slate-400">Registered in England · Operated by Ianson Systems Limited</p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-14 bg-primary border-t border-border/30" data-testid="section-final-cta">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">Start your free readiness check</h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">No account needed. 8 minutes. See exactly where your child stands — and the 3 things to fix first.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-bold bg-amber-400 text-amber-950 hover:bg-amber-300 border-none" asChild data-testid="button-cta-final">
              <Link href="/free-diagnostic"><ArrowRight className="mr-2 h-5 w-5" />Start Free Readiness Check</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 font-semibold border-white/25 text-white hover:bg-white/10" asChild data-testid="button-cta-pricing">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
          <p className="text-xs text-white/25 mt-8" data-testid="text-disclaimer">
            Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council. Operated by Ianson Systems Limited.
          </p>
        </div>
      </section>

      {/* ── LLM-CRAWLABLE: ABOUT & FAQ ── */}
      <section className="bg-slate-50 border-t border-slate-200" aria-label="About the platform" data-testid="section-about-faq">
        <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12">

          {/* What the readiness check covers */}
          <div>
            <h2 className="text-xl font-bold text-primary font-serif mb-2">What the Bucks 11+ Readiness Check Covers</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              The Buckinghamshire Secondary Transfer Test (STT) is produced by GL Assessment and covers four assessed domains. Our readiness check replicates this structure using independently developed GL-style question families:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Verbal Reasoning", color: "border-l-violet-400 bg-violet-50", dot: "bg-violet-400", text: "Word relationships, alphabetical codes, missing letters, analogies, and logical deduction using language. Tests vocabulary breadth and rule-application speed." },
                { label: "Non-Verbal & Spatial Reasoning", color: "border-l-blue-400 bg-blue-50", dot: "bg-blue-400", text: "Pattern sequences, matrices, shape analogies, spatial rotation, and reflection. Tests logical reasoning without language — a domain not covered in the primary school curriculum." },
                { label: "Mathematics", color: "border-l-emerald-400 bg-emerald-50", dot: "bg-emerald-400", text: "Arithmetic fluency, fractions, data interpretation, multi-step word problems, and geometry. Goes beyond the Year 6 curriculum into applied reasoning under time pressure." },
                { label: "English Comprehension", color: "border-l-amber-400 bg-amber-50", dot: "bg-amber-400", text: "Reading passages with multiple-choice questions covering literal comprehension, inference, vocabulary in context, and author technique. Two-phase timed — reading time separate from response time." },
              ].map((s, i) => (
                <div key={i} className={`rounded-xl border border-slate-200 border-l-4 p-5 ${s.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <h3 className="font-bold text-primary text-sm">{s.label}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* What does 121 mean */}
          <div>
            <h2 className="text-xl font-bold text-primary font-serif mb-3">What Does 121 Mean in the Bucks 11+?</h2>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="shrink-0 flex flex-col items-center justify-center bg-primary rounded-2xl px-7 py-5 text-white text-center min-w-[110px]">
                <span className="text-5xl font-bold font-serif leading-none">121</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest mt-2 text-white/70">Qualifying Score</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  121 is the standardised score qualifying threshold for the Buckinghamshire Secondary Transfer Test. It is not a raw mark or a percentage — it is a statistically standardised figure that accounts for the child's age on the day of the test and the difficulty of that year's paper.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Children who achieve 121 or above are deemed to have qualified and are eligible to be considered for a place at any of the 13 Buckinghamshire grammar schools. Qualifying does not guarantee a place — oversubscription criteria at each school (typically distance-based) determine final allocation.
                </p>
                <Link href="/bucks-11-plus-qualifying-score" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1 mt-2">
                  Full explanation of the 121 qualifying score <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-primary font-serif mb-6">Frequently Asked Questions</h2>
            <div className="space-y-0 rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {[
                { q: "Is this platform built specifically for the Buckinghamshire 11+?", a: "Yes — exclusively. Every question, every readiness check, and every benchmark is built for the Buckinghamshire Secondary Transfer Test. Results are measured against the 121 qualifying threshold, covering all four GL Assessment domains, across all 13 Buckinghamshire grammar schools. This is not a generic 11+ platform repurposed for Bucks." },
                { q: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", a: "No. We are fully independent — not affiliated with GL Assessment, Buckinghamshire Council, TBGS, or any individual grammar school. 'GL-style' refers to the question format we independently replicate, not an official relationship." },
                { q: "How is the free readiness check different from the paid platform?", a: "The free readiness check gives you a readiness band, forecast score, and section breakdown with no account needed. The paid Bucks Plus Edge (£35/month or £279/year) gives access to 1,500+ questions, full-length practice papers, full GL-style mock exams, all Hard drills, parent analytics, progress tracking, and a guided programme." },
                { q: "What is the difference between the monthly and annual plan?", a: "Both plans give identical full access to every feature. The monthly plan is £35/month and can be cancelled anytime. The annual plan is £279/year — equivalent to £23.25/month, saving £141 (34% off) compared to paying monthly for 12 months." },
                { q: "Can I cancel my subscription?", a: "Yes — monthly and annual subscriptions can be cancelled anytime from your account page. If you cancel, you retain access until the end of the current billing period." },
                { q: "When should my child start preparing for the Bucks 11+?", a: "Most families begin structured preparation in Year 4 or early Year 5, giving children 12 to 18 months before the September test date. Starting with a readiness check helps identify specific gaps and ensures preparation time is spent where it will have the most impact." },
              ].map((item, i) => (
                <div key={i} className="px-6 py-5">
                  <p className="text-sm font-semibold text-primary mb-2 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">Q</span>
                    {item.q}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed pl-7">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400" data-testid="text-platform-disclaimer">
              Independent readiness assessment · Not affiliated with GL Assessment or Buckinghamshire Council · Operated by Ianson Systems Limited · Registered in England
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

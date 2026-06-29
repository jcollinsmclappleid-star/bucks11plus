import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Shield, Award, Star, ChevronUp, ChevronRight, TrendingUp, Brain, Layers, Hash, BookOpen, Trophy, Flame, Calendar, Sparkles, PlayCircle, GraduationCap, X, RotateCcw } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { TestCountdownBadge, PrepYearBadge, PrepUrgencyBanner } from "../components/shared/TestCountdownBadge";
import { TutorCostComparison } from "../components/shared/SeoConversionPanel";
import { GuideConversionBlock } from "../components/shared/GuideConversionBlock";
import { PlatformSuitePreview } from "../components/shared/PlatformSuitePreview";
import { HeroQuickLinks } from "../components/shared/HeroQuickLinks";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PARENT_DASHBOARD_PREVIEW_ANCHOR,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
  PRACTICE_PAPERS_NAV_LABEL,
  platformPath,
} from "../lib/marketing";
import { scrollToAnchor } from "../lib/scrollToAnchor";

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
              <div className="text-xs text-white/50 mt-1">indicative readiness</div>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex justify-between text-[10px] text-white/40 mb-1">
                <span>Current</span>
                <span className="text-amber-300 font-bold">121 benchmark</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(114/130)*100}%` }} />
              </div>
              <div className="text-right text-[10px] text-amber-300 font-bold mt-1">7 points to go</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
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
        <div className="rounded-xl bg-white border border-orange-100 p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-orange-600">66%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">English</div>
          <div className="h-1 rounded-full bg-orange-400 mt-1.5 mx-auto w-2/3" />
        </div>
      </div>

      <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
        <div className="p-1.5 bg-amber-400 rounded-lg text-white shrink-0">
          <Target className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-800">Priority: Non-Verbal Reasoning</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Closing this gap could lift indicative readiness by 4–5 points</p>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/70 italic text-center">Illustrative preview · Indicative readiness, not the official GL Assessment standardised score</p>
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
          <div className="text-xs font-bold text-primary">Indicative readiness vs 121</div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs">16 pts below</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">4 pts below</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Indicative readiness score lifting by ~3 points per check — illustrative dashboard preview</p>
      </div>
    </div>
  );
}

function PracticeQuestionPanel() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 shadow-xl" data-testid="showcase-practice">
      {/* Session header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Adaptive Practice</p>
            <p className="text-xs font-semibold text-white">Verbal Reasoning · Hard</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
          <Clock className="h-3 w-3" />
          <span>1:42</span>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-3">
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Question 14 of 25</p>
          <p className="text-sm font-medium text-slate-800 mb-4 leading-relaxed">
            Which word is the <span className="font-bold text-indigo-700">odd one out</span> from the group below?
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
                    : "border-slate-200 bg-white text-slate-700"
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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/15 border border-white/20 p-2.5 text-center">
          <div className="text-base font-bold text-white">18/25</div>
          <div className="text-[10px] text-white/60">Correct</div>
        </div>
        <div className="rounded-xl bg-white/15 border border-white/20 p-2.5 text-center">
          <div className="text-base font-bold text-white">72%</div>
          <div className="text-[10px] text-white/60">Accuracy</div>
        </div>
        <div className="rounded-xl bg-white/15 border border-white/20 p-2.5 text-center">
          <div className="text-base font-bold text-amber-300">Hard</div>
          <div className="text-[10px] text-white/60">Adapting ↑</div>
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
          <p className="text-xs font-bold text-primary">Readiness trending up</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Completing this week's plan adds an est. +3 to the indicative readiness score</p>
        </div>
      </div>
    </div>
  );
}

function FreeDiagnosticPreviewPanel() {
  return (
    <Link href="/free-diagnostic" className="block group cursor-pointer" data-testid="diagnostic-preview-panel">
      <div className="rounded-2xl border border-amber-200/60 bg-white shadow-xl shadow-amber-100/40 overflow-hidden group-hover:shadow-amber-200/70 group-hover:border-amber-300/70 transition-all duration-200">
        {/* Header */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <span className="text-[9px] font-bold text-amber-300">11+</span>
            </div>
            <span className="text-[11px] font-semibold text-white/80 tracking-tight">Free Readiness Check</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/50">Q 1 of 12</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Clock className="h-3 w-3" /> 07:45
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-amber-400 w-[8%]" />
        </div>
        {/* Content */}
        <div className="px-5 pt-4 pb-5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-widest mb-4">
            Verbal Reasoning
          </span>
          <p className="text-sm font-semibold text-primary mb-4 leading-snug">
            Choose the word closest in meaning to <span className="text-amber-700 font-bold">ABUNDANT</span>
          </p>
          <div className="space-y-2">
            {[
              { letter: "A", word: "Scarce", selected: false },
              { letter: "B", word: "Plentiful", selected: true },
              { letter: "C", word: "Heavy", selected: false },
              { letter: "D", word: "Ancient", selected: false },
              { letter: "E", word: "Difficult", selected: false },
            ].map((opt) => (
              <div
                key={opt.letter}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-sm ${
                  opt.selected
                    ? "border-amber-400 bg-amber-50 text-amber-900 font-semibold"
                    : "border-slate-200 bg-slate-50/50 text-slate-600"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${opt.selected ? "bg-amber-400 text-amber-950" : "bg-slate-200 text-slate-600"}`}>
                  {opt.letter}
                </span>
                {opt.word}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">4 sections · instant results</span>
            <div className="inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-xl group-hover:bg-primary/90 transition-all">
              Next <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 italic text-center mt-2">Click to start — 8 minutes, no account needed</p>
    </Link>
  );
}

/* ─── REMOVED: interactive question carousel ─── */
// Removed in favour of platform showcase section
type SampleQ = {
  subject: "Maths" | "Verbal Reasoning" | "Non-Verbal Reasoning" | "Comprehension";
  type: string;
  passage?: string;
  question: string;
  options: { letter: string; text: React.ReactNode; correct?: boolean }[];
  explanation: string;
  visual?: React.ReactNode;
};

const SUBJECT_STYLE: Record<SampleQ["subject"], { dot: string; pill: string; ring: string }> = {
  "Maths": { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700 border-emerald-200", ring: "ring-emerald-400/30" },
  "Verbal Reasoning": { dot: "bg-violet-500", pill: "bg-violet-100 text-violet-700 border-violet-200", ring: "ring-violet-400/30" },
  "Non-Verbal Reasoning": { dot: "bg-blue-500", pill: "bg-blue-100 text-blue-700 border-blue-200", ring: "ring-blue-400/30" },
  "Comprehension": { dot: "bg-amber-500", pill: "bg-amber-100 text-amber-700 border-amber-200", ring: "ring-amber-400/30" },
};

function CornerSquare({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const paths: Record<string, string> = {
    tl: "M 4 4 L 18 4 L 4 18 Z",
    tr: "M 28 4 L 42 4 L 42 18 Z",
    bl: "M 4 28 L 18 42 L 4 42 Z",
    br: "M 42 28 L 42 42 L 28 42 Z",
  };
  return (
    <svg viewBox="0 0 46 46" className="w-10 h-10">
      <rect x="3" y="3" width="40" height="40" rx="3" fill="white" stroke="#475569" strokeWidth="1.5" />
      <path d={paths[corner]} fill="#0f172a" />
    </svg>
  );
}

function ShapeBox({ corner, kind, filled, size = "md" }: { corner: "tl" | "tr" | "bl" | "br"; kind: "triangle" | "circle" | "diamond"; filled: boolean; size?: "sm" | "md" }) {
  const cx = corner.includes("r") ? 35 : 11;
  const cy = corner.startsWith("b") ? 35 : 11;
  const fill = filled ? "#0f172a" : "white";
  const stroke = "#0f172a";
  const sw = filled ? 0 : 1.6;
  let shape: React.ReactNode = null;
  if (kind === "triangle") shape = <polygon points={`${cx},${cy - 5} ${cx - 5},${cy + 4} ${cx + 5},${cy + 4}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
  else if (kind === "circle") shape = <circle cx={cx} cy={cy} r={5} fill={fill} stroke={stroke} strokeWidth={sw} />;
  else if (kind === "diamond") shape = <polygon points={`${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
  const cls = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  return (
    <svg viewBox="0 0 46 46" className={cls}>
      <rect x="3" y="3" width="40" height="40" rx="3" fill="white" stroke="#475569" strokeWidth="1.5" />
      {shape}
    </svg>
  );
}

const SAMPLE_QUESTIONS: SampleQ[] = [
  {
    subject: "Verbal Reasoning", type: "Coded Words — letter codes",
    question: "If the word LION is written in code as MJPO, what would the word TIGER be written as in the same code?",
    options: [
      { letter: "A", text: "UJHFS", correct: true },
      { letter: "B", text: "SHFDQ" },
      { letter: "C", text: "UKIGT" },
      { letter: "D", text: "VJHGT" },
      { letter: "E", text: "UIGFR" },
    ],
    explanation: "Each letter shifts forward by 1 in the alphabet: L→M, I→J, O→P, N→O. Apply the same rule to TIGER: T→U, I→J, G→H, E→F, R→S — giving UJHFS.",
  },
  {
    subject: "Maths", type: "Percentages",
    question: "A jacket costs £80. In a sale, the price is reduced by 15%. What is the sale price?",
    options: [
      { letter: "A", text: "£65" },
      { letter: "B", text: "£68", correct: true },
      { letter: "C", text: "£70" },
      { letter: "D", text: "£72" },
      { letter: "E", text: "£75" },
    ],
    explanation: "10% of £80 = £8, so 5% = £4. 15% = £12. £80 − £12 = £68.",
  },
  {
    subject: "Maths", type: "Ratio & Proportion",
    question: "A recipe uses flour and sugar in the ratio 5 : 2. If 350g of flour is used, how much sugar is needed?",
    options: [
      { letter: "A", text: "100g" },
      { letter: "B", text: "120g" },
      { letter: "C", text: "140g", correct: true },
      { letter: "D", text: "150g" },
      { letter: "E", text: "175g" },
    ],
    explanation: "5 parts of flour = 350g, so 1 part = 70g. Sugar is 2 parts: 2 × 70g = 140g.",
  },
  {
    subject: "Verbal Reasoning", type: "Synonyms — closest meaning",
    question: "Which word is closest in meaning to ABUNDANT?",
    options: [
      { letter: "A", text: "Plentiful", correct: true },
      { letter: "B", text: "Scarce" },
      { letter: "C", text: "Costly" },
      { letter: "D", text: "Hidden" },
      { letter: "E", text: "Empty" },
    ],
    explanation: "Abundant means existing in large quantities. Plentiful is its closest match. Scarce and Empty are antonyms.",
  },
  {
    subject: "Verbal Reasoning", type: "Letter Sequence",
    question: "What two letters come next in this sequence?  BD,  FH,  JL,  NP,  ?",
    options: [
      { letter: "A", text: "RT", correct: true },
      { letter: "B", text: "QS" },
      { letter: "C", text: "ST" },
      { letter: "D", text: "OQ" },
      { letter: "E", text: "PR" },
    ],
    explanation: "Each pair skips one letter inside it (B_D, F_H). Each new pair jumps 4 letters (B→F→J→N→R), giving R then T.",
  },
  {
    subject: "Non-Verbal Reasoning", type: "Odd One Out",
    question: "Which shape is the odd one out?",
    visual: (
      <div className="flex items-center justify-around gap-1 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
        {(["tr","tr","bl","tr","tr"] as const).map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <CornerSquare corner={c} />
            <span className="text-[9px] font-bold text-slate-500">{["A","B","C","D","E"][i]}</span>
          </div>
        ))}
      </div>
    ),
    options: [
      { letter: "A", text: "Top-right corner" },
      { letter: "B", text: "Top-right corner" },
      { letter: "C", text: "Bottom-left corner", correct: true },
      { letter: "D", text: "Top-right corner" },
      { letter: "E", text: "Top-right corner" },
    ],
    explanation: "Shapes A, B, D and E all have the dark triangle in the top-right corner. C has it in the bottom-left — the odd one out.",
  },
  {
    subject: "Non-Verbal Reasoning", type: "Shape Analogy",
    question: "The first two shapes go together in a certain way. Find the shape that goes with the third in the same way.",
    visual: (
      <div className="flex items-center justify-center gap-1 py-3 px-2 bg-slate-50 rounded-lg border border-slate-100">
        <ShapeBox corner="tl" kind="triangle" filled={true} size="sm" />
        <span className="text-slate-400 text-xs">→</span>
        <ShapeBox corner="br" kind="triangle" filled={false} size="sm" />
        <span className="text-slate-300 text-sm font-bold mx-1">::</span>
        <ShapeBox corner="tr" kind="diamond" filled={true} size="sm" />
        <span className="text-slate-400 text-xs">→</span>
        <div className="w-9 h-9 rounded border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xs">?</div>
      </div>
    ),
    options: [
      { letter: "A", text: <ShapeBox corner="bl" kind="diamond" filled={false} size="sm" />, correct: true },
      { letter: "B", text: <ShapeBox corner="bl" kind="diamond" filled={true} size="sm" /> },
      { letter: "C", text: <ShapeBox corner="tl" kind="diamond" filled={false} size="sm" /> },
      { letter: "D", text: <ShapeBox corner="bl" kind="triangle" filled={false} size="sm" /> },
      { letter: "E", text: <ShapeBox corner="br" kind="diamond" filled={false} size="sm" /> },
    ],
    explanation: "Two transformations happen at once: the small shape moves to the diagonally opposite corner AND its fill flips (filled ↔ outline). So a filled diamond in the top-right becomes an outline diamond in the bottom-left.",
  },
  {
    subject: "Comprehension", type: "Inference",
    passage: "Marcus glanced once at the trophy on the shelf, then quickly looked away, his cheeks flushing red. He cleared his throat and changed the subject the moment his sister walked in.",
    question: "Which word best describes how Marcus feels about the trophy?",
    options: [
      { letter: "A", text: "Proud" },
      { letter: "B", text: "Embarrassed", correct: true },
      { letter: "C", text: "Excited" },
      { letter: "D", text: "Surprised" },
      { letter: "E", text: "Bored" },
    ],
    explanation: "Blushing cheeks, looking away and changing the subject when his sister appears all suggest Marcus feels embarrassed — not proud — about the trophy.",
  },
  {
    subject: "Comprehension", type: "Vocabulary in Context",
    passage: "The ancient bridge had stood for over four hundred years, its weathered stones bearing testimony to countless storms and the steady passage of carts, horses and feet across its span.",
    question: "What does the word 'testimony' mean in this passage?",
    options: [
      { letter: "A", text: "A formal speech" },
      { letter: "B", text: "Evidence or proof", correct: true },
      { letter: "C", text: "A loud noise" },
      { letter: "D", text: "A weakness" },
      { letter: "E", text: "A decoration" },
    ],
    explanation: "Here 'testimony' means evidence — the worn stones act as proof that the bridge has endured centuries of storms and traffic.",
  },
];

function InteractiveQuestionCard({ q, index, total, highlight }: { q: SampleQ; index: number; total: number; highlight?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const style = SUBJECT_STYLE[q.subject];
  const correctLetter = q.options.find((o) => o.correct)?.letter;
  const isAnswered = selected !== null;
  const isRight = selected === correctLetter;

  return (
    <article
      className={`relative snap-start shrink-0 w-[300px] sm:w-[330px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all ${highlight && !isAnswered ? "ring-2 ring-amber-400 shadow-amber-200/60" : "ring-1 ring-black/5"}`}
      data-testid={`sample-question-${index}`}
    >
      {highlight && !isAnswered && (
        <div className="bg-amber-400 text-amber-950 text-[9px] font-extrabold py-1.5 text-center uppercase tracking-widest w-full">
          ← Start here — tap an answer
        </div>
      )}

      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${style.pill} truncate`}>{q.subject}</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Q{index + 1}/{total}</span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{q.type}</p>
        {q.passage && (
          <p className="text-[11px] italic text-slate-600 bg-amber-50/60 border-l-2 border-amber-300 pl-2.5 py-1.5 mb-2.5 leading-relaxed">{q.passage}</p>
        )}
        <p className="text-[13px] font-semibold text-slate-800 mb-2.5 leading-snug">{q.question}</p>
        {q.visual && <div className="mb-3">{q.visual}</div>}

        {!isAnswered && (
          <div className="flex items-center justify-center gap-1.5 mb-2 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-1.5 px-2 uppercase tracking-wider">
            <span aria-hidden>👇</span> Tap your answer
          </div>
        )}

        <div className="space-y-1.5 mb-3">
          {q.options.map((o) => {
            const isSelected = selected === o.letter;
            const isCorrect = o.letter === correctLetter;
            let cls = "border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50/60 hover:shadow-sm";
            let badgeCls = "bg-slate-100 text-slate-500";
            let icon: React.ReactNode = null;
            if (isAnswered) {
              if (isCorrect) {
                cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
                badgeCls = "bg-emerald-500 text-white";
                icon = <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />;
              } else if (isSelected) {
                cls = "border-rose-300 bg-rose-50 text-rose-800";
                badgeCls = "bg-rose-500 text-white";
                icon = <X className="h-3 w-3 text-rose-500 shrink-0" />;
              } else {
                cls = "border-slate-200 bg-white text-slate-400";
              }
            }
            return (
              <button
                key={o.letter}
                type="button"
                onClick={() => !isAnswered && setSelected(o.letter)}
                disabled={isAnswered}
                aria-label={`Option ${o.letter}`}
                aria-pressed={isSelected}
                data-testid={`option-${index}-${o.letter}`}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-[11px] text-left transition-all ${cls} ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${badgeCls}`}>{o.letter}</span>
                <span className="flex-1">{o.text}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isRight ? "text-emerald-600" : "text-rose-600"}`}>
                {isRight ? "✓ Correct" : `✗ Not quite — answer is ${correctLetter}`}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                data-testid={`reset-${index}`}
              >
                <RotateCcw className="h-2.5 w-2.5" /> Try again
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug"><span className="font-bold text-emerald-700">Why:</span> {q.explanation}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function MockQuestionsCarousel() {
  const total = SAMPLE_QUESTIONS.length;
  return (
    <div data-testid="mock-questions-carousel">
      <div className="text-center mb-6 md:mb-8">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
          <Brain className="h-3 w-3" /> See how your child handles these Bucks 11+ Questions
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-primary font-serif mb-2 leading-tight">
          Don't take our word for it. <span className="text-amber-600">Try the questions yourself.</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          Nine GL-style questions across all four Bucks 11+ domains — Maths, Verbal &amp; Non-Verbal Reasoning, and Comprehension. Pick an answer and we'll mark it instantly, with a clear explanation.
        </p>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-2 pb-6 pt-3"
          tabIndex={0}
          role="region"
          aria-label="Sample questions, scroll horizontally"
          style={{ scrollbarWidth: "thin" }}
        >
          {SAMPLE_QUESTIONS.map((q, i) => (
            <InteractiveQuestionCard key={i} q={q} index={i} total={total} highlight={i === 0} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scroll for more</span>
          <ArrowRight className="h-3 w-3 text-slate-400" />
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-4 italic max-w-xl mx-auto">
        Real sample questions used inside the platform. Your child practises against an adaptive bank of 2,500+ questions like these — with instant marking, working-out and skill tracking.
      </p>
    </div>
  );
}

function DashboardShowcasePanel() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 380 }} data-testid="showcase-dashboard">
      {/* Device frame */}
      <div className="relative rounded-[2.25rem] bg-slate-900 p-2.5 shadow-2xl ring-1 ring-black/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-2xl z-10" />
        <div className="rounded-[1.75rem] bg-slate-50 overflow-hidden border border-slate-200" style={{ height: 720 }}>
          {/* App chrome */}
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-[11px]">11+</div>
              <div>
                <div className="text-[11px] font-bold text-primary leading-none">Bucks 11+ Test Hub</div>
                <div className="text-[9px] text-slate-400 mt-0.5">app.bucks11plustest.co.uk</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-slate-400">Live preview</span>
            </div>
          </div>

          {/* Scrollable dashboard body */}
          <div tabIndex={0} role="region" aria-label="Dashboard preview, scrollable" className="overflow-y-auto h-[calc(720px-49px)] px-4 py-4 space-y-4 bg-gradient-to-b from-slate-50 to-white focus:outline-none focus:ring-2 focus:ring-amber-300/50">
            {/* Welcome strip */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-700">Welcome back, Sophie</span>
                <span className="ml-auto text-[9px] text-amber-600/70">Year 5 · 142 days to test</span>
              </div>
              <p className="text-[10px] text-amber-800/70">Last session 2 hours ago</p>
            </div>

            {/* Top KPI tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Forecast Score</span>
                  <BarChart3 className="h-3 w-3 text-slate-300" />
                </div>
                <div className="text-2xl font-bold text-primary mt-1">114</div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-0.5">
                  <TrendingUp className="h-2.5 w-2.5" /> +3 this week
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Readiness</span>
                  <Award className="h-3 w-3 text-amber-400" />
                </div>
                <div className="text-base font-bold text-amber-600 mt-1 leading-tight">Nearly There</div>
                <div className="text-[9px] text-slate-500 mt-0.5">7 pts to qualifying</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="text-2xl font-bold text-primary">86</div>
                <div className="text-[9px] text-slate-500 mt-0.5">questions answered</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <div className="text-2xl font-bold text-primary">17</div>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">days in a row</div>
              </div>
            </div>

            {/* Sample question card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-3.5 pt-3 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Today's practice · Sample question</span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                    <Clock className="h-2.5 w-2.5" /> 1:42
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">Verbal Reasoning</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">Non-Verbal</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">Maths</span>
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Odd one out</p>
                <p className="text-xs font-semibold text-slate-800 mb-2.5">Which word is the odd one out?</p>
                <div className="space-y-1.5">
                  {[
                    { l: "A", w: "Joyful" },
                    { l: "B", w: "Cheerful" },
                    { l: "C", w: "Melancholy", correct: true },
                    { l: "D", w: "Elated" },
                    { l: "E", w: "Jubilant" },
                  ].map((o) => (
                    <div key={o.l} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] ${o.correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${o.correct ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>{o.l}</span>
                      {o.w}
                      {o.correct && <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                  <span className="text-[9px] text-slate-400">Question 14 of 25 · 18 correct so far</span>
                  <span className="text-[9px] font-bold text-primary">Try other tabs ↑</span>
                </div>
              </div>
            </div>

            {/* Today's session */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
              <div className="flex items-center gap-1.5 mb-2.5">
                <PlayCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary">Today's Session</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">25</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600">76%</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-violet-600">18m</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Time</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <Trophy className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="text-[10px] font-semibold text-emerald-800"><span className="font-bold">Win:</span> Maths arithmetic 92%</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-100">
                  <Target className="h-3 w-3 text-red-600 shrink-0" />
                  <span className="text-[10px] font-semibold text-red-800"><span className="font-bold">Gap:</span> NVR rotations 48%</span>
                </div>
              </div>
            </div>

            {/* Next up this week */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-primary/5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-primary">Next up this week</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">2/5 done</span>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { tag: "NVR", tagBg: "bg-blue-100 text-blue-700", topic: "Rotation drills", time: "15m", flag: true },
                  { tag: "Maths", tagBg: "bg-emerald-100 text-emerald-700", topic: "Ratio problems", time: "12m" },
                  { tag: "English", tagBg: "bg-amber-100 text-amber-700", topic: "Inference reading", time: "18m" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.tagBg}`}>{t.tag}</span>
                    <span className="text-[11px] font-medium text-slate-700 flex-1">{t.topic}</span>
                    <span className="text-[10px] text-slate-400">{t.time}</span>
                    {t.flag && <span className="text-[9px] font-bold text-red-600">!</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast over time */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[10px] font-bold text-primary">Forecast over time</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Last 8 weekly sessions</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-600">+22</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Pts gained</div>
                </div>
              </div>
              <svg viewBox="0 0 240 70" className="w-full h-16">
                <defs>
                  <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="14" x2="240" y2="14" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.5" />
                <text x="222" y="11" fontSize="6" fill="#f59e0b" fontWeight="bold">121</text>
                <path d="M 8 60 L 38 56 L 68 50 L 98 46 L 128 40 L 158 34 L 188 28 L 220 22 L 220 70 L 8 70 Z" fill="url(#dashAreaGrad)" />
                <path d="M 8 60 L 38 56 L 68 50 L 98 46 L 128 40 L 158 34 L 188 28 L 220 22" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {[[8,60],[38,56],[68,50],[98,46],[128,40],[158,34],[188,28],[220,22]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={i===7?3:2.2} fill={i===7?"#10b981":"#94a3b8"} stroke={i===7?"white":"none"} strokeWidth="1.2" />))}
                <text x="200" y="20" fontSize="6.5" fill="#10b981" fontWeight="bold">114</text>
              </svg>
            </div>

            {/* Skill mastery heatmap */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary">Skill mastery</span>
              </div>
              <p className="text-[9px] text-slate-400 mb-2.5">All 32 sub-skills tracked</p>
              {[
                { row: "VR",      cells: ["e","e","a","e","e","a","a","e"] },
                { row: "NVR",     cells: ["a","a","a","a","r","a","r","a"] },
                { row: "Maths",   cells: ["e","e","a","e","e","e","e","e"] },
                { row: "English", cells: ["e","a","e","a","a","a","e","a"] },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold text-slate-500 w-10 shrink-0">{r.row}</span>
                  <div className="flex gap-1 flex-1">
                    {r.cells.map((c, j) => (
                      <div key={j} className={`h-4 flex-1 rounded ${c === "e" ? "bg-emerald-400" : c === "a" ? "bg-amber-400" : "bg-red-400"}`} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                <span className="text-[8px] text-slate-400">Mastery:</span>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-400" /><span className="text-[8px] text-slate-500">&lt;50</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-400" /><span className="text-[8px] text-slate-500">50-69</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-300" /><span className="text-[8px] text-slate-500">70-79</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-400" /><span className="text-[8px] text-slate-500">80+</span></div>
              </div>
            </div>

            <div className="text-center pt-1 pb-2">
              <span className="text-[8px] text-slate-300 italic">Illustrative dashboard preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glow accents */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-200/40 blur-3xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-emerald-200/40 blur-3xl -z-10" />
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
  const [activeFeature, setActiveFeature] = useState(6);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      requestAnimationFrame(() => scrollToAnchor(hash));
    }
  }, []);

  // Countdown / prep cycle messaging — shared via testDate.ts (see PrepUrgencyBanner)

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-x-hidden w-full min-w-0">
      {/* ── URGENCY BANNER ── */}
      <div className="bg-amber-400 text-amber-950 border-b border-amber-500/40" data-testid="banner-countdown">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <PrepUrgencyBanner />
        </div>
      </div>

      <Seo
        title="Bucks 11 Plus Preparation — Help Your Child Pass Without the Guesswork | Bucks 11 Plus Tests"
        description="Get your child ready for the Buckinghamshire 11+ — free readiness check, interactive practice, and parent dashboards. Start preparing for the September 2027 test and beyond."
        canonicalPath="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is the Buckinghamshire 11+ Secondary Transfer Test?", acceptedAnswer: { "@type": "Answer", text: "The Buckinghamshire Secondary Transfer Test (STT) is a selective entrance exam taken by children in Year 6, typically in September. It determines eligibility for all 13 state-funded grammar schools in Buckinghamshire. The test is produced by GL Assessment and covers four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension." } },
            { "@type": "Question", name: "What does 121 mean in the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "121 is the standardised score threshold used in Buckinghamshire to determine whether a child qualifies for grammar school." } },
            { "@type": "Question", name: "How does the free readiness check work?", acceptedAnswer: { "@type": "Answer", text: "The free readiness check is a 12-question, 8-minute timed assessment in GL-style format. No account is needed. On completion, parents receive a readiness band, a practice score on the 121 scale, and a breakdown across the four test sections." } },
            { "@type": "Question", name: "What is included in Bucks Plus Edge?", acceptedAnswer: { "@type": "Answer", text: "Bucks Plus Edge (£35/month or £279/year) includes 2,500+ GL-style questions across all four test domains, timed drills, full mock readiness checks, PDF reports, parent analytics, progress tracking, and a guided programme." } },
          ]
        }}
      />

      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden bg-primary pt-12 pb-16 md:pt-16 md:pb-24 border-b border-border/50" data-testid="section-hero">
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

          {/* Hero: headline + forecast side-by-side, then disclaimer, then quick links */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-x-16 lg:gap-y-10 items-start">

            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80 mb-4">Built for the Buckinghamshire 11+</span>
                <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.1] font-serif">
                  Time to get ready for the Bucks 11 Plus
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <PrepYearBadge variant="dark" />
                  <TestCountdownBadge variant="dark" />
                </div>
              </div>
              <p className="text-base md:text-lg text-white/65 leading-relaxed" data-testid="text-hero-sub">
                Bucks 11+ diagnostics, practice tests and mock exams that show exactly where marks are being lost. Pinpoint weak areas, prioritise what matters, and see clear parent dashboards — with 2,500+ GL-style questions for targeted practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="cta" size="lg" asChild data-testid="button-hero-primary">
                  <Link href={FREE_PRACTICE_TEST_PATH}>
                    {FREE_PRACTICE_TEST_CTA} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base border-white/20 text-white hover:bg-white/10 font-semibold"
                  asChild
                  data-testid="button-hero-secondary"
                >
                  <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
                    {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-white/50 -mt-2" data-testid="text-hero-cta-subtext">
                No account needed for the free test · Browse mocks &amp; 2,500+ questions below
              </p>
            </div>

            <div>
              <div className="relative max-w-md mx-auto lg:max-w-none overflow-hidden">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-400/10 to-transparent blur-2xl" />
                <div className="relative">
                  <ForecastPanel />
                  <p className="text-[10px] text-white/25 italic text-center mt-3">Illustrative example — not official standardised results</p>
                </div>
              </div>
            </div>
          </div>

          <HeroQuickLinks variant="dark" className="mt-8 lg:mt-10" />

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6">
            <p className="text-[11px] text-white/50 leading-relaxed" data-testid="text-hero-disclaimer">
              The practice score on the 121 scale is an independent practice indicator. It is not an official Buckinghamshire Secondary Transfer Test score or a guarantee of performance.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2" data-testid="trust-signal-hero">
              <div className="flex items-center gap-1.5 text-white/55 text-xs font-medium">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>3-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/55 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="text-white/40 text-xs">No account needed for the free check</div>
            </div>
            <p className="text-xs text-emerald-300/80 font-medium" data-testid="text-no-child-advertising">
              We never use your child's data for advertising or behavioural profiling.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION: PLATFORM SHOWCASE ── */}
      <section className="py-16 md:py-24 bg-white border-b border-border/30" data-testid="section-platform-showcase">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">What you get</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4 leading-tight">
              More than a question bank.<br className="hidden md:block" /> A complete preparation system.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Readiness diagnostics, adaptive practice tests and timed mock tests — all built for the Buckinghamshire 11+. The 2,500+ GL-style questions are the foundation; the sub-skill breakdown, pace tracking, guided programme and progress trend line are what make it actually work.
            </p>
          </div>

          {/* Tabbed feature navigator */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-10 space-y-6 lg:space-y-0">
            {/* Mobile: horizontal scrollable pill strip */}
            <div className="lg:hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Tap a feature to explore</p>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {[
                  { dot: "bg-amber-400",   label: "Diagnostics" },
                  { dot: "bg-violet-500",  label: "Breakdown" },
                  { dot: "bg-blue-500",    label: "Practice" },
                  { dot: "bg-red-500",     label: "Pace" },
                  { dot: "bg-emerald-500", label: "Programme" },
                  { dot: "bg-amber-600",   label: "Progress" },
                  { dot: "bg-purple-500",  label: "Full Suite" },
                ].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap snap-start shrink-0 transition-all ${
                      activeFeature === i
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300"
                    }`}
                    data-testid={`showcase-tab-mobile-${i}`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${activeFeature === i ? "bg-white/80" : tab.dot}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: vertical tab list */}
            <div className="hidden lg:block lg:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-4">Select a feature to explore</p>
              <div className="space-y-1">
                {[
                  { dot: "bg-amber-400",   label: "Free · Readiness Diagnostics", title: "Start with a real picture, not a guess" },
                  { dot: "bg-violet-500",  label: "Subject Breakdown",             title: 'Not \u201cNVR needs work\u201d \u2014 exactly which skills' },
                  { dot: "bg-blue-500",    label: "Adaptive Practice",             title: "The right questions, at the right difficulty" },
                  { dot: "bg-red-500",     label: "Pace & Stamina Tracking",       title: "The Bucks 11+ is timed. We track every second." },
                  { dot: "bg-emerald-500", label: "Guided Weekly Programme",       title: 'No more \u201cwhat should we practise tonight?\u201d' },
                  { dot: "bg-amber-600",   label: "Progress Over Time",            title: "See if preparation is working — week by week" },
                  { dot: "bg-purple-500",  label: "Full Platform Suite",           title: "See everything subscribers access — unlocked" },
                ].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all group ${
                      activeFeature === i
                        ? "border-primary/30 bg-primary/5 shadow-sm"
                        : "border-slate-200 bg-white hover:border-primary/20 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                    data-testid={`showcase-tab-${i}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-0.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${tab.dot}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${activeFeature === i ? "text-primary/70" : "text-slate-400"}`}>{tab.label}</span>
                        </div>
                        <p className={`text-sm font-semibold font-serif leading-snug pl-[18px] ${activeFeature === i ? "text-primary" : "text-slate-600"}`}>{tab.title}</p>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 ml-2 transition-all ${activeFeature === i ? "text-primary" : "text-slate-300 group-hover:text-slate-400"}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: panel + copy for active tab */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {activeFeature === 0 && <><ForecastPanel /><p className="text-[10px] text-slate-400 italic text-center mt-3">Illustrative example — not official results</p></>}
                {activeFeature === 1 && <SectionsPanel />}
                {activeFeature === 2 && <PracticeQuestionPanel />}
                {activeFeature === 3 && <AnalyticsPanel />}
                {activeFeature === 4 && <ProgrammePanel />}
                {activeFeature === 5 && <ProgressPanel />}
                {activeFeature === 6 && <PlatformSuitePreview />}
              </div>
              {[
                {
                  badge: "Free · Readiness Diagnostics", badgeColor: "text-amber-700 bg-amber-100 border-amber-200",
                  title: "Start with a real picture, not a guess",
                  body: "Take a 12-question timed check across all four domains — Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension. We return a practice score on the 121 scale, plus your child's three weakest areas. No account needed, no payment required.",
                  meta: "8 minutes · instant results · no account needed",
                },
                {
                  badge: "Subject Breakdown", badgeColor: "text-violet-700 bg-violet-100 border-violet-200",
                  title: 'Not \u201cNVR needs work\u201d \u2014 exactly which NVR skills need work',
                  body: 'Most platforms show you a subject score. We drill down to 32 sub-skills \u2014 so instead of \u201cVerbal Reasoning 65%\u201d, you see \u201cVocab & Synonyms 60%, Code Sequences 75%\u201d. Knowing which sub-skill is weak is what turns practice time into progress.',
                  meta: "4 subjects · 32 sub-skills tracked · updated after every session",
                },
                {
                  badge: "Adaptive Practice", badgeColor: "text-blue-700 bg-blue-100 border-blue-200",
                  title: "The right questions, at the right difficulty, every session",
                  body: "2,500+ GL-style questions across VR, NVR, Maths and Comprehension — each with a worked solution and instant feedback. Difficulty adapts as your child improves: they're never coasting on questions they've already mastered, and never stuck on a wall they can't get over.",
                  meta: "2,500+ questions · 24 question types · worked solutions · adapts difficulty",
                },
                {
                  badge: "Pace & Stamina Tracking", badgeColor: "text-red-700 bg-red-100 border-red-200",
                  title: "The Bucks 11+ is timed. We track every second.",
                  body: "Most children don't realise their accuracy drops in the second half of a timed test. We measure how long each answer takes and whether stamina holds under pressure. That's an insight no static practice paper can give you — and it's often the difference between borderline and clear.",
                  meta: "Per-question timing · accuracy vs pace · stamina analysis",
                },
                {
                  badge: "Guided Weekly Programme", badgeColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
                  title: 'No more \u201cwhat should we practise tonight?\u201d',
                  body: "Once we know the gaps, we generate a weekly plan — five short, prioritised drills, 10–15 minutes each, targeting the sub-skills that will move the score the most. Priority-ranked so the most important thing is always first.",
                  meta: "5 drills per week · ~60 mins total · priority-ordered by impact",
                },
                {
                  badge: "Progress Over Time", badgeColor: "text-amber-700 bg-amber-100 border-amber-200",
                  title: "See if preparation is working — week by week",
                  body: "Every readiness check adds a point to your child's trend line. You'll see the practice score moving — or not — on the 121 scale. If it's not moving after a month, that's important information too.",
                  meta: "Test-by-test trend · scored on the 121 scale · no guesswork",
                },
                {
                  badge: "Full Platform Suite", badgeColor: "text-purple-700 bg-purple-100 border-purple-200",
                  title: "Readiness checks, practice tests and mock tests — here's exactly what's inside",
                  body: "Full 45-question readiness checks across all four domains, adaptive practice drills targeting your child's weakest sub-skills, and timed mock tests in exam-day format. Browse the complete suite below — no vague upgrade prompts, no hidden content.",
                  meta: "45-question readiness checks · adaptive practice drills · timed mock tests · PDF reports",
                },
              ].map((f, i) => activeFeature === i && (
                <div key={i}>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold border px-3 py-1 rounded-full uppercase tracking-widest mb-4 ${f.badgeColor}`}>{f.badge}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3 leading-tight">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-3">{f.body}</p>
                  <p className="text-xs text-slate-400 font-medium">{f.meta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16 md:mt-20 pt-10 border-t border-border/30">
            <p className="text-sm text-slate-500 mb-5">See how your child compares — before you pay anything</p>
            <Button variant="cta" size="lg"  asChild data-testid="button-showcase-cta">
              <Link href={FREE_PRACTICE_TEST_PATH}>
                Take the Free Practice Test <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-slate-400 mt-3">12 questions · 8 minutes · no account needed · instant results</p>
          </div>
        </div>
      </section>

      {/* ── SECTION: DIAGNOSTIC ENTRY ── */}
      <section
        className="relative py-14 md:py-20 border-b border-amber-100/80 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #fffbeb 0%, #ffffff 70%)" }}
        data-testid="section-diagnostic-entry"
      >
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <span className="inline-block text-xs font-bold text-amber-700/60 uppercase tracking-widest mb-4">Free · No account needed</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4 leading-tight">
                Find out where your child really stands — in 8 minutes
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                12 timed GL-style questions across all four domains — Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension. Instant section-by-section breakdown and practice score on the 121 scale.
              </p>
              <div className="flex flex-col gap-2.5 mb-7">
                {[
                  "Every question individually timed",
                  "Instant section breakdown",
                  "Indicative readiness score",
                ].map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium justify-center lg:justify-start">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {pt}
                  </div>
                ))}
              </div>
              <Button variant="cta" size="lg" className="px-10 mb-4" asChild data-testid="button-diagnostic-entry-cta">
                <Link href="/free-diagnostic">
                  Take the Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-xs text-slate-400">12 questions · 8 minutes · no card required · instant results</p>
              <p className="text-[11px] text-slate-400/70 mt-1.5 italic">Independent practice indicator — not an official test score.</p>
            </div>
            {/* Right: diagnostic question preview */}
            <div>
              <FreeDiagnosticPreviewPanel />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2A: INSIDE THE PLATFORM (DASHBOARD SHOWCASE) ── */}
      <section
        id={PARENT_DASHBOARD_PREVIEW_ANCHOR}
        className="relative py-16 md:py-24 overflow-hidden border-b border-border/30 bg-gradient-to-br from-primary to-[#1a3550] scroll-mt-24"
        data-testid="section-dashboard-showcase"
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="container mx-auto max-w-6xl px-4 relative">
          <div className="text-center mb-12 md:mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Inside the platform
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-3 leading-tight">
              A glimpse inside — <span className="text-amber-300">the parent dashboard.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              You've tried the questions. Here's where the data goes: a practice score on the 121 scale, a skill heatmap pinpointing exact gaps, and a priority-ranked plan showing what to work on next.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: annotated callouts */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
              {[
                {
                  num: "01",
                  icon: <Calendar className="h-4 w-4" />,
                  iconBg: "bg-amber-400/20 text-amber-300 border-amber-400/30",
                  title: "Personalised welcome — tracked from day one",
                  desc: "Every child gets a named workspace showing days to test, last session, current streak, and questions answered. We track 17-day streaks because consistency, not cramming, lifts scores.",
                  pill: "Year 5 · 142 days to test",
                },
                {
                  num: "02",
                  icon: <Brain className="h-4 w-4" />,
                  iconBg: "bg-violet-400/20 text-violet-300 border-violet-400/30",
                  title: "2,500+ GL-style questions across all 4 domains",
                  desc: "VR, NVR, Maths and Comprehension — every question editorially reviewed to match the GL Assessment style your child will sit. Worked solutions, difficulty progression, and instant feedback on every answer.",
                  pill: "24 question types · 4 domains",
                },
                {
                  num: "03",
                  icon: <BarChart3 className="h-4 w-4" />,
                  iconBg: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
                  title: "Wins and gaps surfaced after every session",
                  desc: "We don't just show a score. After each session you see the strongest sub-skill (\"Maths arithmetic 92%\") and the weakest (\"NVR rotations 48%\") — so the next session targets the right gap automatically.",
                  pill: "Adaptive · gap-targeted",
                },
                {
                  num: "04",
                  icon: <PlayCircle className="h-4 w-4" />,
                  iconBg: "bg-blue-400/20 text-blue-300 border-blue-400/30",
                  title: "A weekly programme that thinks for you",
                  desc: "No more guessing what to do tonight. Each week we generate 5 short, prioritised drills — 10–18 minutes each — sequenced to close the gaps that will lift the forecast score the most.",
                  pill: "5 drills · ~60 mins/week",
                },
                {
                  num: "05",
                  icon: <TrendingUp className="h-4 w-4" />,
                  iconBg: "bg-amber-400/20 text-amber-300 border-amber-400/30",
                  title: "Practice score trajectory — tracked on the 121 scale, week by week",
                  desc: "Watch your child's practice score tracked week by week on the 121 scale. The chart above is illustrative — actual gains vary by starting point and consistency.",
                  pill: "+22 pts · 8 weeks",
                },
                {
                  num: "06",
                  icon: <GraduationCap className="h-4 w-4" />,
                  iconBg: "bg-rose-400/20 text-rose-300 border-rose-400/30",
                  title: "Skill mastery heatmap — all 32 sub-skills, one screen",
                  desc: "Most platforms hide this level of detail. A live colour grid across all 32 sub-skills (rotation, ratio, inference, synonyms…) so you can see at a glance where your child is strong, developing, or stuck.",
                  pill: "32 sub-skills · live tracking",
                },
              ].map((f, i) => (
                <div key={i} className="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all" data-testid={`dashboard-feature-${i}`}>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.iconBg}`}>{f.icon}</div>
                    <span className="text-[10px] font-bold text-white/30 tracking-widest">{f.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-sm md:text-base font-bold text-white font-serif">{f.title}</h3>
                      <span className="text-[10px] font-bold text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{f.pill}</span>
                    </div>
                    <p className="text-xs md:text-sm text-white/55 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button variant="cta" size="lg" className="px-7" asChild data-testid="button-dashboard-cta-diagnostic">
                  <Link href="/free-diagnostic">
                    See your child's forecast — free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-7 border-white/20 text-white hover:bg-white/10 hover:text-white" asChild data-testid="button-dashboard-cta-pricing">
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>

            {/* Right: device mockup */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <DashboardShowcasePanel />
              <p className="text-[10px] text-white/30 italic text-center mt-4 max-w-xs mx-auto">Scroll the preview above to see all six dashboard sections — Welcome, Today's Practice, Today's Session, Next Up, Forecast, and Skill Mastery.</p>
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

      {/* ── SECTION 4: ANALYTICS — ANSWERS PARENTS NEED ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-b border-border/30" data-testid="section-analytics">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Parent Analytics</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Answers parents actually need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Stop guessing. The parent dashboard tells you your child's readiness score, stamina patterns, and exactly which three areas will gain the most points next.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: <Award className="h-4 w-4 text-amber-600" />, bg: "bg-amber-50 border-amber-200", title: "Practice score", desc: "Practice score on the 121 scale across all four domains" },
              { icon: <Zap className="h-4 w-4 text-violet-600" />, bg: "bg-violet-50 border-violet-200", title: "Stamina analysis", desc: "Accuracy in the first vs second half — key for exam-day performance" },
              { icon: <Target className="h-4 w-4 text-red-600" />, bg: "bg-red-50 border-red-200", title: "Priority focus areas", desc: "Ranked list of highest-impact gaps with estimated point gains" },
            ].map((feat, i) => (
              <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${feat.bg}`} data-testid={`analytics-feature-${i}`}>
                <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0">{feat.icon}</div>
                <div>
                  <p className="text-sm font-bold text-primary">{feat.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="cta" asChild className="min-w-[200px]" data-testid="button-analytics-practice">
              <Link href={platformPath("practicePapers")}>{PRACTICE_PAPERS_NAV_LABEL} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" data-testid="button-analytics-readiness">
              <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-how-it-works">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Simple to start</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From your first readiness check to a clear trend line showing progress against the 121 benchmark — four steps, each building on the last.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                step: "01",
                title: "Take the free readiness check",
                desc: "12 timed questions across all four sections — takes 8 minutes. No account needed. You get an instant indicative readiness score and your child's three weakest sub-skills.",
                cta: { href: "/free-diagnostic", label: "Start free" },
                accent: "border-amber-300 bg-amber-50",
                numColor: "text-amber-600",
              },
              {
                step: "02",
                title: "See exactly where the gaps are",
                desc: "The platform breaks down results to sub-skill level — not just 'VR needs work', but 'Vocab & Synonyms 60%, Code Sequences 75%'. That specificity is what makes the next step possible.",
                cta: null,
                accent: "border-violet-200 bg-violet-50",
                numColor: "text-violet-600",
              },
              {
                step: "03",
                title: "Practise the right things in the right order",
                desc: "Your weekly programme targets the sub-skills with the most to gain — five short drills a week, 10–15 minutes each, with difficulty that adapts as your child improves.",
                cta: { href: "/pricing", label: "See plans" },
                accent: "border-emerald-200 bg-emerald-50",
                numColor: "text-emerald-600",
              },
              {
                step: "04",
                title: "Track progress on the 121 scale",
                desc: "Every readiness check adds a point to the trend line. You'll see the practice score moving on the 121 scale — week by week. If it's working, you'll see it. If it isn't, you'll know.",
                cta: null,
                accent: "border-blue-200 bg-blue-50",
                numColor: "text-blue-600",
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
            <Button variant="cta" size="lg"  asChild data-testid="button-how-it-works-cta">
              <Link href={FREE_PRACTICE_TEST_PATH}>Start your free practice test — no account needed <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: WHY PARENTS CHOOSE US ── */}
      <section className="py-14 md:py-16 bg-white border-b border-border/30" data-testid="section-why-parents">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">Why parents choose us</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">Smarter 11+ preparation, without the guesswork</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-8 py-8 md:px-12 md:py-10" data-testid="why-parents-card">
            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed text-[15px] mb-8">
              <p className="font-semibold text-slate-700">Informed by primary education experience</p>
              <p>Built around Year 6 learning, timed practice and Buckinghamshire-style preparation, the platform helps families identify gaps and focus on the areas that matter most.</p>
            </div>
            <div className="border-t border-slate-200 pt-6 flex items-end justify-between gap-4">
              <p className="text-2xl md:text-3xl text-primary font-serif italic" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '-0.5px' }}>Bucks11PlusTest</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6B: PRE-PRICING FAQ (objection handling) ── */}
      <section className="py-12 md:py-14 bg-slate-50 border-b border-border/30" data-testid="section-prepricing-faq">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">Before you decide</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">Common questions, answered</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {[
              { q: "Will this actually work for my child?", a: "The free 8-minute readiness check shows you, before you pay anything, whether our diagnostic accurately identifies your child's gaps and produces a useful practice score on the 121 scale. If the free check doesn't give you useful insight, the paid programme isn't for you — and you'll have spent nothing." },
              { q: "What if I subscribe and change my mind?", a: "You can cancel any subscription at any time from your account, and we offer a money-back guarantee on new subscriptions if the platform isn't right for you. See pricing terms below for full details." },
              { q: "How is this different from a private tutor?", a: "A weekly tutor at £40/hr is roughly £160/month for one hour. Bucks Plus Edge is £35/month for unlimited interactive GL-style practice — timed mocks, targeted drills, instant explanations, and parent analytics. It is modern structured preparation children can use little and often, not a race to the cheapest option." },
              { q: "Will my child enjoy using it?", a: "Sessions are short, friendly, and end with encouragement — not just a score. Your child can jump back in with one tap, and section names are written in language a 10-year-old understands. The free check is a good way to see how they respond before committing." },
            ].map((item, i) => (
              <details key={i} className="group" data-testid={`faq-prepricing-${i}`}>
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors list-none [&::-webkit-details-marker]:hidden" data-testid={`faq-prepricing-toggle-${i}`}>
                  <span className="text-sm md:text-[15px] font-semibold text-primary text-left">{item.q}</span>
                  <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 transition-transform group-open:rotate-0 rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM PREVIEW + CONVERSION ── */}
      <section className="border-b border-border/30 bg-white py-14 md:py-16" data-testid="section-guide-conversion">
        <div className="container mx-auto max-w-5xl px-4">
          <GuideConversionBlock />
        </div>
      </section>

      {/* ── TUTOR vs PLATFORM ── */}
      <section className="border-b border-border/30 bg-slate-50 py-14 md:py-16" data-testid="section-tutor-comparison">
        <div className="container mx-auto max-w-5xl px-4">
          <TutorCostComparison />
        </div>
      </section>

      {/* ── SECTION 7: PRICING ── */}
      <section id="pricing" className="py-16 md:py-20 bg-white border-b border-border/30" data-testid="section-pricing">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One tutor session a week at £40 is roughly{" "}
              <span className="line-through decoration-red-500/60 text-slate-400">£160/month</span> (typical tutor cost).
              Our platform is <strong className="text-foreground">£35/month</strong> or <strong className="text-foreground">£23.25/month</strong> on annual.
            </p>
          </div>

          {/* Free tier */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 max-w-3xl mx-auto" data-testid="pricing-card-free">
            <div>
              <p className="font-bold text-primary text-sm">Free Practice Test</p>
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
              <p className="text-xs text-amber-700 font-semibold mb-1">
                vs <span className="line-through decoration-red-500/70 text-slate-400">£160/mo</span> tutor · £35/mo here
              </p>
              <p className="text-xs text-slate-400 mb-6">Cancel anytime · Money-back guarantee</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8 flex-1">
                {[
                  "2,500+ GL-style practice questions",
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
              <Link href="/pricing?autoCheckout=pack_plus" className="btn-cta-lg block w-full rounded-lg py-2.5 text-center text-sm no-underline" data-testid="button-pricing-monthly">
                Start Monthly — £35
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
              <p className="text-xs text-slate-400 mb-1">£23.25/mo equiv. · unlimited interactive practice</p>
              <p className="text-xs text-emerald-600 font-semibold mb-1">Save £141 vs monthly</p>
              <p className="text-xs text-slate-400 mb-6">Cancel anytime · Money-back guarantee</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8 flex-1">
                {[
                  "Everything in Monthly — identical access",
                  "2,500+ GL-style practice questions",
                  "Full-length practice papers (50 questions)",
                  "Full GL-style mock exams (40 questions)",
                  "PDF readiness reports & analytics",
                  "12 months · Cancel anytime",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-emerald-500'}`} /><span className={i === 0 ? 'font-bold text-primary' : ''}>{f}</span></li>
                ))}
              </ul>
              <Link href="/pricing?autoCheckout=pack_annual" className="btn-cta-lg block w-full rounded-lg py-2.5 text-center text-sm no-underline" data-testid="button-pricing-annual">
                Get Annual — £279 (best value)
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mt-8 max-w-full px-1">
            <p className="text-center text-xs text-slate-400 max-w-prose">All prices include VAT. Subscriptions renew automatically and can be cancelled anytime. Money-back guarantee available within 3 days of purchase — see <Link href="/pricing" className="text-primary hover:underline">full pricing terms</Link>.</p>
            <div className="flex items-center gap-2 shrink-0 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-sm max-w-full" data-testid="badge-stripe">
              <svg width="40" height="16" viewBox="0 0 64 25" fill="none" aria-label="Stripe" role="img" className="shrink-0">
                <path d="M5.45 9.77c0-.92.76-1.28 2.01-1.28 1.8 0 4.06.54 5.86 1.5V4.82A15.6 15.6 0 0 0 7.46 4C3.17 4 .25 6.18.25 9.99c0 5.92 8.16 4.98 8.16 7.54 0 1.09-.95 1.44-2.26 1.44-1.96 0-4.47-.8-6.45-1.9v5.24A16.4 16.4 0 0 0 6.15 24c4.4 0 7.44-2.17 7.44-6.03C13.6 11.5 5.45 12.6 5.45 9.77zm16.3-8.33L17 2.56l-.04 16.78H22V1.44h-.25zM28.6 6.1l-.33 1.52h-3.14v16.1h5.06V12.4c1.2-1.56 3.23-1.27 3.86-1.05V6.43c-.65-.24-3.02-.68-5.45.67zm9.7-2.27a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8zm-2.53 20h5.06V7.62h-5.06v16.1zm14.27-8.5c0-3.28 1.52-4.66 3.97-4.66 2.33 0 3.5 1.3 3.5 4.66v8.5H62.6V14.8C62.6 8.72 59.45 7 56.18 7c-2.55 0-4.42 1.12-5.51 2.97l-.23-2.35H45.5v16.1h5.06V15.33z" fill="#635BFF"/>
              </svg>
              <span className="text-[11px] text-slate-400 font-medium">Payments by Stripe</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4" data-testid="company-trust">
            <Shield className="h-3.5 w-3.5 text-slate-300" />
            <p className="text-center text-xs text-slate-400">Registered in England · Operated by Ianson Systems Limited</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8" data-testid="pricing-explore-ctas">
            <Button variant="cta" asChild className="min-w-[200px]" data-testid="button-pricing-practice">
              <Link href={platformPath("practicePapers")}>{PRACTICE_PAPERS_NAV_LABEL} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="min-w-[200px]" data-testid="button-pricing-readiness">
              <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-14 bg-primary border-t border-border/30" data-testid="section-final-cta">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">Start your free practice test</h2>
          <p className="text-white/60 text-base mb-3 max-w-md mx-auto">No account needed. 8 minutes. See exactly where your child stands — and the 3 things to fix first.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mb-8 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400" />Money-back guarantee</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />Cancel anytime</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="cta" size="lg"  asChild data-testid="button-cta-final">
              <Link href={FREE_PRACTICE_TEST_PATH}><ArrowRight className="mr-2 h-5 w-5" />{FREE_PRACTICE_TEST_CTA}</Link>
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
              The Buckinghamshire Secondary Transfer Test (STT) is produced by GL Assessment and covers four assessed domains. Our readiness check covers all four GL Assessment domains using independently developed questions:
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
                { q: "Is this platform built specifically for the Buckinghamshire 11+?", a: "Yes — exclusively. Every question and every readiness check is built for the Buckinghamshire Secondary Transfer Test. Practice scores are shown on the 121 scale, across all four GL Assessment domains, covering all 13 Buckinghamshire grammar schools. This is not a generic 11+ platform repurposed for Bucks." },
                { q: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", a: "No. We are fully independent — not affiliated with GL Assessment, Buckinghamshire Council, TBGS, or any individual grammar school. 'GL-style' refers to the question format we independently replicate, not an official relationship." },
                { q: "How is the free readiness check different from the paid platform?", a: "The free readiness check gives you a readiness band, forecast score, and section breakdown with no account needed. The paid Bucks Plus Edge (£35/month or £279/year) gives access to 2,500+ questions, full-length practice papers, full GL-style mock exams, all Hard drills, parent analytics, progress tracking, and a guided programme." },
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

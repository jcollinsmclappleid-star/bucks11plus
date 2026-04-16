import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Search, Wrench, TrendingUp, ChevronLeft, ChevronRight, Brain, Layers, Hash, BookOpen, Shield, Award, Star, ChevronUp, Trophy, CalendarDays } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { SampleQuestionsCarousel } from "../components/shared/SampleQuestionsCarousel";
import { useAuth } from "../lib/auth";
import { useState, useRef } from "react";

const showcaseTabs = [
  { id: "sections", label: "Section Breakdown" },
  { id: "forecast", label: "Readiness Forecast" },
  { id: "analytics", label: "Analytics" },
  { id: "progress", label: "Progress" },
] as const;

type TabId = (typeof showcaseTabs)[number]["id"];

function ForecastPanel() {
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto" data-testid="showcase-forecast">
      <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6 relative overflow-hidden shadow-lg">
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
          <p className="text-xs font-bold text-amber-800">Main focus area: Non-Verbal Reasoning</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Closing this gap could add 4–5 points to the forecast</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 italic text-center">
        Illustrative example. Scores are modelled from performance patterns and are not official standardised results.
      </p>
    </div>
  );
}

function SectionsPanel() {
  const sections = [
    { name: "Verbal Reasoning", score: 72, bar: "bg-violet-500", badge: "bg-violet-100 text-violet-700", iconBg: "bg-violet-100 text-violet-700", border: "border-violet-100", icon: <Brain className="h-3.5 w-3.5" />, items: "18/25", subs: [
      { name: "Letter Patterns", score: 80 }, { name: "Vocab & Synonyms", score: 60 }, { name: "Code Sequences", score: 75 }
    ]},
    { name: "Non-Verbal Reasoning", score: 58, bar: "bg-red-500", badge: "bg-red-100 text-red-700", iconBg: "bg-blue-100 text-blue-700", border: "border-red-100", icon: <Layers className="h-3.5 w-3.5" />, items: "14/24", subs: [
      { name: "Spatial Sequences", score: 50 }, { name: "Rotation & Reflection", score: 55 }, { name: "Classification", score: 65 }
    ]},
    { name: "Mathematics", score: 80, bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", iconBg: "bg-emerald-100 text-emerald-700", border: "border-emerald-100", icon: <Hash className="h-3.5 w-3.5" />, items: "20/25", subs: [
      { name: "Arithmetic", score: 85 }, { name: "Fractions & Ratios", score: 70 }, { name: "Data Interpretation", score: 80 }
    ]},
    { name: "English Comprehension", score: 66, bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700", iconBg: "bg-amber-100 text-amber-700", border: "border-amber-100", icon: <BookOpen className="h-3.5 w-3.5" />, items: "16/24", subs: [
      { name: "Inference & Deduction", score: 62 }, { name: "Authorial Intent", score: 70 }, { name: "Vocabulary in Context", score: 75 }
    ]},
  ];
  return (
    <div className="space-y-3 w-full max-w-md mx-auto" data-testid="showcase-sections">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-primary font-serif">How They're Performing in Each Subject</h3>
        <p className="text-xs text-muted-foreground mt-1">Every result broken down to sub-topic level — see exactly what to practice</p>
      </div>
      {sections.map((s, i) => (
        <div key={i} className={`bg-white rounded-xl border ${s.border} p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${s.iconBg}`}>{s.icon}</div>
              <span className="font-semibold text-slate-800 text-sm">{s.name}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
              {s.score >= 75 ? "Strong" : s.score >= 65 ? "Developing" : "Needs focus"}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700 w-8 text-right">{s.score}%</span>
          </div>
          <div className="ml-1 pl-3 border-l-2 border-slate-100 space-y-1">
            {s.subs.map((sub, j) => (
              <div key={j} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{sub.name}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${sub.score >= 75 ? 'bg-emerald-500' : sub.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.score}%` }} />
                  </div>
                  <span className={`font-bold text-[10px] w-7 text-right ${sub.score >= 75 ? 'text-emerald-600' : sub.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{sub.score}%</span>
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
          <p className="text-[11px] text-red-600 mt-0.5">Spatial sequences and pattern rotation need targeted practice — could add ~5 points</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const tiles = [
    { value: "78", label: "Readiness Score", sub: "Borderline", iconBg: "bg-amber-500", icon: <Award className="h-4 w-4" />, topBar: "bg-amber-500" },
    { value: "82", label: "Timing Score", sub: "Well-paced", iconBg: "bg-violet-500", icon: <Clock className="h-4 w-4" />, topBar: "bg-violet-500" },
    { value: "High", label: "Score Reliability", sub: "4 tests taken", iconBg: "bg-blue-500", icon: <Shield className="h-4 w-4" />, topBar: "bg-blue-500" },
    { value: "74%", label: "Difficulty-adjusted", sub: "Accuracy", iconBg: "bg-emerald-500", icon: <Zap className="h-4 w-4" />, topBar: "bg-emerald-500" },
  ];
  const priorities = [
    { label: "NVR: Spatial sequences", gain: "+6 pts", color: "bg-red-500" },
    { label: "VR: Letter patterns", gain: "+4 pts", color: "bg-amber-500" },
    { label: "Maths: Ratio problems", gain: "+3 pts", color: "bg-blue-400" },
  ];
  return (
    <div className="space-y-3 w-full max-w-md mx-auto" data-testid="showcase-analytics">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-primary font-serif">How Is My Child Doing?</h3>
        <p className="text-xs text-muted-foreground mt-1">Deep readiness checks that tell you what's really happening — and what to do next</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className={`h-1 w-full ${t.topBar}`} />
            <div className="p-3 text-center">
              <div className="flex justify-center mb-1.5">
                <div className={`p-1.5 rounded-lg text-white ${t.iconBg}`}>{t.icon}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{t.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium leading-tight">{t.label}</div>
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
            <div className="text-base font-bold text-emerald-700">79%</div>
            <div className="text-[9px] text-slate-500 mt-0.5">First half</div>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-2 text-center">
            <div className="text-base font-bold text-amber-700">68%</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Second half</div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Accuracy drops in the second half — stamina practice will help.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
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
    <div className="space-y-3 w-full max-w-md mx-auto" data-testid="showcase-progress">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-primary font-serif">Progress Over Time</h3>
        <p className="text-xs text-muted-foreground mt-1">Watch the gap to 121 close test by test</p>
      </div>

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
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="18" x2="240" y2="18" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
          <text x="220" y="14" fontSize="7" fill="#f59e0b" fontWeight="bold">121</text>
          <path d="M 20 65 L 75 52 L 140 37 L 210 24 L 210 80 L 20 80 Z" fill="url(#scoreAreaGrad)" />
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

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1.5">
            <div className="p-1 bg-emerald-500 rounded-md text-white"><TrendingUp className="h-3 w-3" /></div>
          </div>
          <div className="text-xl font-bold text-emerald-700">+12</div>
          <div className="text-[10px] text-slate-500 font-medium">Points gained</div>
        </div>
        <div className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1.5">
            <div className="p-1 bg-blue-500 rounded-md text-white"><BarChart3 className="h-3 w-3" /></div>
          </div>
          <div className="text-xl font-bold text-blue-700">4</div>
          <div className="text-[10px] text-slate-500 font-medium">Tests taken</div>
        </div>
        <div className="rounded-xl border-0 bg-gradient-to-br from-amber-50 to-amber-100/60 p-3 text-center shadow-sm">
          <div className="flex justify-center mb-1.5">
            <div className="p-1 bg-amber-500 rounded-md text-white"><Trophy className="h-3 w-3" /></div>
          </div>
          <div className="text-xl font-bold text-amber-700">117</div>
          <div className="text-[10px] text-slate-500 font-medium">Latest score</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
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

export default function Landing() {
  const [activeTab, setActiveTab] = useState<TabId>("sections");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollTabs = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
    }
  };

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
            { "@type": "Question", name: "What does 121 mean in the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "121 is the standardised score threshold used in Buckinghamshire to determine whether a child qualifies for grammar school. It is not a raw score or percentage — it is a standardised figure that accounts for the child's age on test day and the difficulty of that year's paper. Children who score 121 or above are considered to have qualified and are eligible to be considered for any of the 13 Buckinghamshire grammar schools." } },
            { "@type": "Question", name: "What subjects does the Bucks 11+ test cover?", acceptedAnswer: { "@type": "Answer", text: "The test covers four domains: Verbal Reasoning (vocabulary, word relationships, code problems), Non-Verbal Reasoning and Spatial Reasoning (patterns, sequences, transformations), Mathematics (arithmetic, fractions, word problems), and English Comprehension (reading passages with multiple-choice questions)." } },
            { "@type": "Question", name: "How does the free readiness check work?", acceptedAnswer: { "@type": "Answer", text: "The free readiness check is a 12-question, 8-minute timed assessment in GL-style format. No account is needed. On completion, parents receive a readiness band (On Track, Within Reach, or Clear Improvement Opportunity), a forecast standardised score toward 121, and a breakdown of performance across the four test sections." } },
            { "@type": "Question", name: "When should my child start preparing for the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "Most families begin structured preparation in Year 4 or early Year 5, giving children 12 to 18 months before the September test date. Starting with a readiness check helps identify specific gaps and ensures preparation time is spent where it will have the most impact." } },
            { "@type": "Question", name: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", acceptedAnswer: { "@type": "Answer", text: "No. Bucks 11 Plus Tests is fully independent. We are not affiliated with GL Assessment, Buckinghamshire Council, The Buckinghamshire Grammar Schools (TBGS), or any individual grammar school. The GL-style label refers to the question format we use to replicate the test structure — it does not imply any formal relationship." } },
            { "@type": "Question", name: "What is included in Bucks Plus Edge?", acceptedAnswer: { "@type": "Answer", text: "Bucks Plus Edge (£35/month or £349/year) includes 1,500+ GL-style questions across all four test domains, timed drills, full 40-question and 50-question mock diagnostics, PDF reports, parent analytics, progress tracking, and access to all Hard drills. Cancel anytime." } },
            { "@type": "Question", name: "What is the difference between the monthly and annual plan?", acceptedAnswer: { "@type": "Answer", text: "Both plans give identical full access to every feature. The monthly plan is £35/month and can be cancelled anytime. The annual plan is £349/year — equivalent to £29.08/month — saving £71 compared to paying monthly for 12 months." } },
          ]
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-40 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }}>
        <div className="absolute inset-0 z-0 hero-texture"></div>
        <div className="absolute inset-0 z-0 hero-vignette"></div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 100%)' }}></div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="flex flex-col gap-8">

            <div className="flex flex-col items-start gap-1">
              <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <line x1="24" y1="6" x2="24" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="24" y1="38" x2="24" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="6" y1="24" x2="10" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="38" y1="24" x2="42" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="3" fill="rgba(255,255,255,0.35)" />
              </svg>
              <div className="mt-2">
                <span className="block text-white font-serif font-bold text-2xl md:text-3xl leading-none tracking-tight">11+</span>
                <span className="block text-white/60 text-[11px] md:text-xs font-sans font-semibold uppercase tracking-[0.25em] mt-1">Standard</span>
              </div>
              <span className="text-white/30 text-[10px] md:text-[11px] font-sans font-medium tracking-wide mt-1.5">Bucks 11+ Readiness &amp; Forecast</span>
            </div>

            <div className="w-full overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-center mb-2">All 13 Buckinghamshire grammar schools</p>
              <div className="school-ticker">
                <div className="ticker-content">
                  <span>Aylesbury Grammar</span>
                  <span className="separator">•</span>
                  <span>Aylesbury High</span>
                  <span className="separator">•</span>
                  <span>Burnham Grammar</span>
                  <span className="separator">•</span>
                  <span>Chesham Grammar</span>
                  <span className="separator">•</span>
                  <span>Dr Challoner's Grammar</span>
                  <span className="separator">•</span>
                  <span>Dr Challoner's High</span>
                  <span className="separator">•</span>
                  <span>John Hampden Grammar</span>
                  <span className="separator">•</span>
                  <span>Royal Grammar School</span>
                  <span className="separator">•</span>
                  <span>Royal Latin</span>
                  <span className="separator">•</span>
                  <span>Sir Henry Floyd Grammar</span>
                  <span className="separator">•</span>
                  <span>Sir William Borlase's Grammar</span>
                  <span className="separator">•</span>
                  <span>Wycombe High</span>
                  <span className="separator">•</span>
                  <span>The Misbourne</span>
                  <span className="separator">•</span>
                </div>
                <div className="ticker-content" aria-hidden="true">
                  <span>Aylesbury Grammar</span>
                  <span className="separator">•</span>
                  <span>Aylesbury High</span>
                  <span className="separator">•</span>
                  <span>Burnham Grammar</span>
                  <span className="separator">•</span>
                  <span>Chesham Grammar</span>
                  <span className="separator">•</span>
                  <span>Dr Challoner's Grammar</span>
                  <span className="separator">•</span>
                  <span>Dr Challoner's High</span>
                  <span className="separator">•</span>
                  <span>John Hampden Grammar</span>
                  <span className="separator">•</span>
                  <span>Royal Grammar School</span>
                  <span className="separator">•</span>
                  <span>Royal Latin</span>
                  <span className="separator">•</span>
                  <span>Sir Henry Floyd Grammar</span>
                  <span className="separator">•</span>
                  <span>Sir William Borlase's Grammar</span>
                  <span className="separator">•</span>
                  <span>Wycombe High</span>
                  <span className="separator">•</span>
                  <span>The Misbourne</span>
                  <span className="separator">•</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 mt-12">

            <div className="flex items-center justify-center gap-2" data-testid="badge-platform-type">
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-brand-amber/70">Built for the Buckinghamshire 11+</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] font-serif max-w-4xl mx-auto">
              The preparation platform built to help your child pass the Bucks 11+.
            </h1>

            <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-sub">
              We go beyond questions. Our intelligent diagnostics identify exactly which areas are costing marks, rank your child's highest-impact focus areas, and track real progress toward the 121 qualifying score. With 1,500+ GL-style questions to close every gap.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-hero-primary">
                <Link href="/free-diagnostic">
                  Start Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <a
                href="#see-product"
                className="text-white/60 hover:text-white/90 text-base font-medium transition-colors flex items-center gap-1.5"
                data-testid="link-hero-secondary"
              >
                See how it works <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 flex-wrap pt-2" data-testid="trust-signal-hero">
              <div className="flex items-center gap-2 text-white/45 text-xs">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-brand-amber text-brand-amber" />)}
                </div>
                <span>Trusted by families across Buckinghamshire</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/35 text-xs">
                <Shield className="h-3.5 w-3.5" />
                <span>Secure payments · Cancel anytime</span>
              </div>
            </div>

            <p className="text-[11px] text-white/25 max-w-md mx-auto">
              Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATION STRIP ── */}
      <section className="py-10 md:py-14 bg-white border-b border-slate-100" data-testid="section-differentiator-strip">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-start gap-3" data-testid="diff-strip-bucks">
              <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-base leading-tight mb-1">Bucks-specific, 121-benchmarked</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Every result is benchmarked against the 121 qualifying threshold — not a generic percentage score.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3" data-testid="diff-strip-marks">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-base leading-tight mb-1">Shows where marks are lost — not just where they went wrong</h3>
                <p className="text-sm text-slate-500 leading-relaxed">You see exactly which question types are costing marks, and by how much.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3" data-testid="diff-strip-priorities">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-base leading-tight mb-1">Tells you the next 3 priorities to focus on</h3>
                <p className="text-sm text-slate-500 leading-relaxed">The three highest-impact areas are ranked by the points they could add to the forecast.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SHOWCASE ── */}
      <section id="see-product" className="py-16 md:py-24 bg-white border-b border-border/30 relative">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Here's How We Show You</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-showcase-title">
              What the Readiness Check Reveals — In Detail
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Explore a sample readiness report. This is what parents see after their child's first session — a clear picture of where they are, not just a score.
            </p>
          </div>

          <div className="relative mb-6">
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center md:hidden"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide px-10 md:px-0 md:justify-center snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {showcaseTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all snap-center ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30 hover:text-primary"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center md:hidden"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 relative min-h-[380px]">
            <div className="absolute top-3 right-3 bg-slate-100 text-slate-400 text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
              Example Data
            </div>

            {activeTab === "forecast" && <ForecastPanel />}
            {activeTab === "sections" && <SectionsPanel />}
            {activeTab === "analytics" && <AnalyticsPanel />}
            {activeTab === "progress" && <ProgressPanel />}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" className="h-13 px-8 bg-brand-amber text-amber-950 hover:bg-amber-400 font-bold shadow-md border-none" asChild data-testid="button-try-diagnostic-showcase">
              <Link href="/free-diagnostic">
                Try It Free — 8 Minutes <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Zap className="h-4 w-4 text-brand-amber" /> No sign-up required
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4 italic">
            Example based on sample student data. Your child's real results will populate after their readiness check.
          </p>

          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary font-serif mb-2">Sample Practice Questions</h3>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Swipe through to see the question types your child will practice — across all four GL-style subjects.
              </p>
            </div>
            <SampleQuestionsCarousel className="md:px-8" />
          </div>
        </div>
      </section>

      {/* ── STOP GUESSING ── */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-border/30" data-testid="section-stop-guessing">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif leading-tight mb-6 text-center">
            Stop Guessing What to Revise
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Without a readiness check</p>
                <p className="text-white/50 text-sm leading-relaxed">Working through everything without knowing which specific gaps are standing between your child and 121.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-brand-amber/20 bg-brand-amber/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-amber/20 text-brand-amber flex items-center justify-center shrink-0 border border-brand-amber/20">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">With a readiness check</p>
                <p className="text-white/50 text-sm leading-relaxed">Three ranked priorities — practice time goes exactly where it will move the score.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 md:py-24 bg-white border-b border-border/30" data-testid="section-pricing">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Start with the free readiness check. Upgrade when you're ready. Both paid plans include every feature.</p>
          </div>

          {/* Free strip */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" data-testid="pricing-card-free">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-bold text-primary text-sm">Free Readiness Check</p>
                <p className="text-xs text-slate-500 mt-0.5">No account needed · 12-question GL-style readiness check · Readiness band · Forecast score · 3 priorities</p>
              </div>
            </div>
            <Link href="/free-diagnostic" className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-primary text-primary font-semibold py-2 px-5 text-sm hover:bg-primary/5 transition-colors whitespace-nowrap" data-testid="button-pricing-free">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Paid plan cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Monthly */}
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
                  "Timed drill bank (all difficulty levels)",
                  "PDF readiness reports",
                  "Parent analytics dashboard",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link href="/pricing?autoCheckout=pack_plus" className="block text-center w-full rounded-lg bg-primary text-white font-semibold py-2.5 text-sm hover:bg-primary/90 transition-colors" data-testid="button-pricing-monthly">
                Start Monthly
              </Link>
            </div>

            {/* Annual */}
            <div className="flex flex-col rounded-2xl border-2 border-primary bg-white shadow-md p-7 relative" data-testid="pricing-card-annual">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">Best Value — Save £71</div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Annual</p>
              <p className="text-sm font-bold text-primary mb-1">Bucks Plus Edge</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-primary">£349</span>
                <span className="text-slate-500 text-sm mb-1">/year</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">equiv. £29.08/month</p>
              <p className="text-xs text-emerald-600 font-semibold mb-6">Save £71 vs monthly</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8 flex-1">
                {[
                  "Everything in Monthly — identical access",
                  "1,500+ GL-style practice questions",
                  "Full-length practice papers (50 questions)",
                  "Full GL-style mock exams (40 questions)",
                  "PDF readiness reports & analytics",
                  "12 months · Cancel anytime",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 0 ? 'text-brand-amber' : 'text-emerald-500'}`} /><span className={i === 0 ? 'font-bold text-primary' : ''}>{f}</span></li>
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

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-b border-border/30" data-testid="section-testimonials-landing">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">What Parents Say</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">Families preparing with confidence</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "The diagnostic showed us exactly where she was losing marks — we dropped the generic practice and focused on NVR sequences. Her scores improved noticeably within three weeks.",
                name: "Sarah M.",
                detail: "Parent of Year 5 child, targeting Beaconsfield High",
              },
              {
                quote: "Instead of more questions to wade through, it told us precisely what to fix and in what order. The parent analytics dashboard is incredibly clear.",
                name: "James T.",
                detail: "Parent of Year 6 child, targeting Royal Latin",
              },
              {
                quote: "Starting with the free diagnostic was the best thing we did. It showed my son was much stronger in Maths than we thought, and that Verbal Reasoning was the real gap.",
                name: "Priya K.",
                detail: "Parent of Year 5 child, targeting Dr Challoner's",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3 shadow-sm" data-testid={`testimonial-landing-${i}`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-brand-amber text-brand-amber" />
                  ))}
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

      {/* ── URGENCY / TIMELINE CALLOUT ── */}
      <section className="py-12 md:py-16 bg-primary border-b border-border/30" data-testid="section-urgency">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <CalendarDays className="h-7 w-7 text-white" />
              </div>
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-0.5">Preparation Timeline</p>
                <p className="text-xl font-bold font-serif leading-tight">September is closer than it feels.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="h-11 px-6 bg-brand-amber text-amber-950 hover:bg-amber-400 font-bold border-none" asChild data-testid="button-urgency-diagnostic">
                <Link href="/free-diagnostic">Start Free Readiness Check</Link>
              </Button>
              <Button variant="outline" className="h-11 px-6 border-white/25 text-white hover:bg-white/10 font-semibold" asChild data-testid="button-urgency-pricing">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT & FAQ ── */}
      <section className="bg-slate-50 border-t border-slate-200" aria-label="Platform overview">

        <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12">

          <hr className="border-slate-200" />

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">What the Readiness Check Covers</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 ml-11">
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

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">What Does 121 Mean?</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 ml-11">
              <div className="shrink-0 flex flex-col items-center justify-center bg-primary rounded-2xl px-7 py-5 text-white text-center min-w-[110px]">
                <span className="text-5xl font-bold font-serif leading-none">121</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest mt-2 text-white/70">Qualifying Score</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  121 is the standardised score qualifying threshold for the Buckinghamshire Secondary Transfer Test. It is not a raw mark or a percentage — it is a statistically standardised figure that accounts for the child's age on the day of the test and the difficulty of that year's paper.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Children who achieve 121 or above are deemed to have qualified and are eligible to be considered for a place at any of the 13 Buckinghamshire grammar schools. Qualifying does not guarantee a place — oversubscription criteria at each school (typically distance-based) determine final allocation among all qualifying applicants.
                </p>
                <Link href="/bucks-11-plus-qualifying-score" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                  Full explanation of the 121 qualifying score <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-0 rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {[
                { q: "Is this platform built specifically for the Buckinghamshire 11+?", a: "Yes — exclusively. Every question, every readiness check, and every benchmark is built for the Buckinghamshire Secondary Transfer Test. Results are measured against the 121 qualifying threshold, covering all four GL Assessment domains, across all 13 Buckinghamshire grammar schools. This is not a generic 11+ platform repurposed for Bucks." },
                { q: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", a: "No. We are fully independent — not affiliated with GL Assessment, Buckinghamshire Council, TBGS, or any individual grammar school. 'GL-style' refers to the question format we independently replicate, not an official relationship." },
                { q: "How is the free readiness check different from the paid platform?", a: "The free quick readiness check gives you a readiness band, forecast score, and section breakdown with no account needed. The paid Bucks Plus Edge (£35/month or £349/year) gives access to 1,500+ questions, full-length practice papers, full GL-style mock exams, all Hard drills, parent analytics, and progress tracking across all sessions." },
                { q: "What is the difference between the monthly and annual plan?", a: "Both plans give identical full access to every feature. The monthly plan is £35/month and can be cancelled anytime. The annual plan is £349/year — equivalent to £29.08/month — saving £71 compared to paying monthly for 12 months." },
                { q: "Can I cancel my subscription?", a: "Yes — monthly and annual subscriptions can be cancelled anytime from your account page. If you cancel, you retain access until the end of the current billing period." },
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

        </div>

        {/* Final CTA */}
        <div className="border-t border-slate-200 bg-white py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">Start Free Readiness Check</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">No account needed. 8 minutes. See exactly where your child stands — and what to fix next.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-bold bg-brand-amber text-amber-950 hover:bg-amber-400 border-none" asChild data-testid="button-cta-final">
              <Link href="/free-diagnostic"><ArrowRight className="mr-2 h-5 w-5" />Start Free Readiness Check</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 font-semibold" asChild data-testid="button-cta-pricing">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-8 max-w-md mx-auto" data-testid="text-disclaimer">
            Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council. Operated by Ianson Systems Limited.
          </p>
        </div>

      </section>
    </div>
  );
}

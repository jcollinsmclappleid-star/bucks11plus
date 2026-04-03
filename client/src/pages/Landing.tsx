import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Search, Wrench, TrendingUp, ChevronLeft, ChevronRight, Loader2, Smartphone, Brain, Layers, Hash, BookOpen, Shield, Award, Star, AlertTriangle, ChevronUp, Trophy, ExternalLink } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { SampleQuestionsCarousel } from "../components/shared/SampleQuestionsCarousel";
import { useAuth } from "../lib/auth";
import { apiRequest } from "../lib/queryClient";
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
        <p className="text-xs text-muted-foreground mt-1">Every result broken down to sub-topic level — see exactly what to practise</p>
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
        <p className="text-xs text-muted-foreground mt-1">Deep diagnostics that tell you what's really happening — and what to do next</p>
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
        <p className="text-[10px] text-muted-foreground mt-2">Gap narrowing by ~3 points per diagnostic — on track for 121 within 6 weeks</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState<TabId>("sections");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  async function handleProgrammeCheckout() {
    const tier = "programme24_plus";
    if (!user) {
      navigate(`/pricing?autoCheckout=${tier}`);
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await apiRequest("POST", "/api/checkout/session", { tier });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      navigate(`/pricing?autoCheckout=${tier}`);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const scrollTabs = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Bucks 11 Plus Practice Test (2026) – Free GL Diagnostic & 121 Score Prep | Bucks 11 Plus Tests"
        description="Take a free Bucks 11 Plus practice diagnostic. Get an instant GL-style score across maths, verbal, non-verbal and comprehension — benchmarked against the 121 qualifying standard."
        canonicalPath="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is the Buckinghamshire 11+ Secondary Transfer Test?", acceptedAnswer: { "@type": "Answer", text: "The Buckinghamshire Secondary Transfer Test (STT) is a selective entrance exam taken by children in Year 6, typically in September. It determines eligibility for all 13 state-funded grammar schools in Buckinghamshire. The test is produced by GL Assessment and covers four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension." } },
            { "@type": "Question", name: "What does 121 mean in the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "121 is the standardised score threshold used in Buckinghamshire to determine whether a child qualifies for grammar school. It is not a raw score or percentage — it is a standardised figure that accounts for the child's age on test day and the difficulty of that year's paper. Children who score 121 or above are considered to have qualified and are eligible to be considered for any of the 13 Buckinghamshire grammar schools." } },
            { "@type": "Question", name: "What subjects does the Bucks 11+ test cover?", acceptedAnswer: { "@type": "Answer", text: "The test covers four domains: Verbal Reasoning (vocabulary, word relationships, code problems), Non-Verbal Reasoning and Spatial Reasoning (patterns, sequences, transformations), Mathematics (arithmetic, fractions, word problems), and English Comprehension (reading passages with multiple-choice questions)." } },
            { "@type": "Question", name: "How does the free diagnostic work?", acceptedAnswer: { "@type": "Answer", text: "The free diagnostic is a 12-question, 8-minute timed assessment in GL-style format. No account is needed. On completion, parents receive a readiness band (On Track, Within Reach, or Clear Improvement Opportunity), a forecast standardised score toward 121, and a breakdown of performance across the four test sections." } },
            { "@type": "Question", name: "When should my child start preparing for the Bucks 11+?", acceptedAnswer: { "@type": "Answer", text: "Most families begin structured preparation in Year 4 or early Year 5, giving children 12 to 18 months before the September test date. Starting with a diagnostic assessment helps identify specific gaps and ensures preparation time is spent where it will have the most impact." } },
            { "@type": "Question", name: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", acceptedAnswer: { "@type": "Answer", text: "No. Bucks 11 Plus Tests is fully independent. We are not affiliated with GL Assessment, Buckinghamshire Council, The Buckinghamshire Grammar Schools (TBGS), or any individual grammar school. The GL-style label refers to the question format we use to replicate the test structure — it does not imply any formal relationship." } },
            { "@type": "Question", name: "What is included in the Bucks Practice Platform?", acceptedAnswer: { "@type": "Answer", text: "The Bucks Practice Platform (£24.99/month) includes 1,500+ questions across all four test domains, timed drills (Easy & Medium), full 40-question timed diagnostic papers, 6 Hard drills, PDF reports and impact simulator. The Platform Edge (£59.99/month or £495/year) adds all 17 Hard drills, full parent analytics, and mock exam simulations. Cancel anytime." } },
            { "@type": "Question", name: "What is the difference between the Practice Platform and the Young Scholar Programme?", acceptedAnswer: { "@type": "Answer", text: "The Bucks Practice Platform (from £24.99/month) is flexible self-directed access to the question bank, drills, and diagnostics. The Bucks Young Scholar Programme (£349 one-time) includes full platform access plus a structured 6-month preparation programme with a 26-week roadmap, weekly task plans, milestone tracking, and 3 mock exam simulations — designed for families who want complete guided preparation." } },
          ]
        }}
      />

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

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] font-serif max-w-4xl mx-auto">
              One Test. One Number.<br className="hidden md:block" />
              <span className="text-white/55">One Chance at the School They Want.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-white/85 font-semibold not-italic">121.</strong> The qualifying score for all 13 Buckinghamshire grammar schools. One test in September that decides which school your child goes to. Most families arrive here already working hard — books, tutors, practice papers. The question is whether that preparation is actually moving the score. This platform answers it directly.
            </p>

            <div className="pt-3 max-w-xl mx-auto">
              <p className="text-lg text-brand-amber/90 font-semibold font-serif leading-relaxed">
                Built for parents who want evidence, not guesswork.
              </p>
            </div>

            <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed" data-testid="text-platform-context">
              1,500+ GL-aligned practice questions across Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension — every result benchmarked against the 121 qualifying threshold.
            </p>

            <div className="flex items-center justify-center gap-2" data-testid="badge-expertise">
              <svg viewBox="0 0 16 16" className="w-4 h-4 text-brand-amber/50" fill="currentColor" aria-hidden="true">
                <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 12.9l-5 2.6 1-5.5-4-3.8 5.5-.9z"/>
              </svg>
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-white/40">Purpose-built for the Buckinghamshire Secondary Transfer Test</span>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 font-bold shadow-lg shadow-brand-amber/15 border-none" asChild>
                <Link href="/free-diagnostic">
                  Start Free Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/[0.03] border-white/15 text-white/80 hover:bg-white/[0.06] hover:text-white" asChild>
                <Link href="/free-11-plus-practice-test-trial">Try the Platform — 7 Days Free</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Link href="/free-diagnostic" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Free Diagnostic
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Practice Platform — £24.99/mo
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Platform Edge — £59.99/mo
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing#tiers" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Young Scholar — £349 one-time
              </Link>
            </div>

            <p className="text-[11px] text-white/25 mt-2 max-w-md mx-auto">
              Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
            </p>
          </div>
        </div>
      </section>

      <section id="see-product" className="py-16 md:py-24 bg-slate-50 border-b border-border/30 relative">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Here's How We Show You</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-showcase-title">
              What the Diagnostic Reveals — In Detail
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Explore a sample diagnostic report to see how performance is analysed across accuracy, pace, stability and skill type — and how priorities are set.
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
            Example based on sample student data. Your child's real results will populate after their diagnostic.
          </p>

          <div className="text-center mt-6">
            <Button variant="outline" className="h-11 px-6 font-semibold" asChild data-testid="button-see-more-platform">
              <Link href="/bucks-11-plus-parent-guide#platform-preview">
                See More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="text-center mb-6">
              <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">Try the Platform</span>
              <h3 className="text-2xl font-bold text-primary font-serif mb-2">Sample Practice Questions</h3>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Swipe through to see the question types your child will practise — across all four GL-style subjects.
              </p>
            </div>
            <SampleQuestionsCarousel className="md:px-8" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Button asChild className="h-11 px-6 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold" data-testid="button-sample-questions-subscribe">
                <Link href="/free-11-plus-practice-test-trial">Try the Diagnostic & Practice Hub Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-6 font-semibold" data-testid="button-sample-questions-free">
                <Link href="/free-diagnostic">Take the Free Diagnostic First</Link>
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">Cancel any time · No lock-in</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white border-b border-border/30" data-testid="section-assessment-outcomes">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-4">After the Assessment</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif leading-tight mb-5">
                What You'll Know in 8 Minutes
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-6">
                Most parents finish a practice paper knowing their child got some questions wrong. This diagnostic tells you <em>which</em> question types, <em>why</em>, and what to do about it.
              </p>
              <Link href="/free-diagnostic">
                <Button className="h-12 px-7 font-bold bg-primary hover:bg-primary/90" data-testid="button-outcomes-cta">
                  Start Free Diagnostic <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-slate-400 mt-3">No account needed · 8 minutes · instant results</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Which question types your child is struggling with — by subject and sub-topic", icon: <Target className="h-4 w-4" />, color: "text-red-600 bg-red-50 border-red-100" },
                { label: "Where marks are consistently being lost across each GL-style section", icon: <BarChart3 className="h-4 w-4" />, color: "text-amber-600 bg-amber-50 border-amber-100" },
                { label: "How their performance compares to the 121 qualifying standard", icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-600 bg-blue-50 border-blue-100" },
                { label: "A clear readiness band — On Track, Within Reach, or Needs Focus", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                { label: "The three highest-impact areas to focus on next — not a generic revision list", icon: <Zap className="h-4 w-4" />, color: "text-violet-600 bg-violet-50 border-violet-100" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl border border-slate-100 p-4" data-testid={`outcome-item-${i}`}>
                  <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-border/30" data-testid="section-stop-guessing">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-white/30 uppercase tracking-widest mb-4">The Problem With Random Practice</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight mb-5">
                Stop Guessing What to Revise
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-4">
                Most families approach preparation the same way — more questions, more papers, more tutoring hours. They work hard. But without knowing where the marks are actually being lost, preparation time is spread across everything rather than focused on what matters.
              </p>
              <p className="text-brand-amber/90 font-semibold text-base leading-relaxed">
                This diagnostic removes that uncertainty. Instead of doing more questions, you focus on the right ones.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Without a diagnostic</p>
                  <p className="text-white/50 text-sm leading-relaxed">Working through everything. Spending time on topics your child already knows. Not knowing which gaps are costing the most marks.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-brand-amber/20 bg-brand-amber/5 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/20 text-brand-amber flex items-center justify-center shrink-0 border border-brand-amber/20">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">With a diagnostic</p>
                  <p className="text-white/50 text-sm leading-relaxed">Three specific priorities, ranked by impact. Practice time goes exactly where it will move the score — with evidence it's working after each session.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 md:py-24 bg-white border-b border-border/30" data-testid="section-pricing">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Start free. Upgrade when you're ready. Every plan includes the same rigorous GL-style question bank.</p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            <div className="flex flex-col rounded-2xl border border-border/60 bg-white shadow-sm p-6" data-testid="pricing-card-free">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Free Diagnostic</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">Free</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">No account needed</p>
              <ul className="space-y-1.5 text-sm text-slate-700 mb-6 flex-1">
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>12-question GL-style diagnostic</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Readiness band &amp; forecast score</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Section-by-section breakdown</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>3 priority improvement areas</li>
              </ul>
              <Link href="/free-diagnostic" className="block text-center w-full rounded-lg border border-primary text-primary font-semibold py-2 text-sm hover:bg-primary/5 transition-colors" data-testid="button-pricing-free">Start Free Diagnostic</Link>
            </div>

            <div className="flex flex-col rounded-2xl border border-border/60 bg-white shadow-sm p-6" data-testid="pricing-card-monthly">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-amber mb-1">Bucks Practice Platform</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">£24.99</span>
                <span className="text-slate-500 text-sm mb-0.5">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Cancel anytime</p>
              <ul className="space-y-1.5 text-sm text-slate-700 mb-6 flex-1">
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>1,500+ practice questions</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Full 40-question timed papers</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>6 Hard challenge drills</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>PDF diagnostic reports</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Progress tracking</li>
              </ul>
              <Link href="/pricing?autoCheckout=pack_monthly" className="block text-center w-full rounded-lg bg-primary text-white font-semibold py-2 text-sm hover:bg-primary/90 transition-colors" data-testid="button-pricing-monthly">Start Monthly</Link>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-primary bg-white shadow-md p-6 relative" data-testid="pricing-card-edge">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Bucks Practice Platform Edge</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">£59.99</span>
                <span className="text-slate-500 text-sm mb-0.5">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Cancel anytime</p>
              <ul className="space-y-1.5 text-sm text-slate-700 mb-6 flex-1">
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Everything in Practice Platform</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>All 17 Hard challenge drills</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Full mock exam simulator</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Advanced parent analytics</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Weekly personalised plans</li>
              </ul>
              <Link href="/free-11-plus-practice-test-trial" className="block text-center w-full rounded-lg bg-primary text-white font-semibold py-2 text-sm hover:bg-primary/90 transition-colors" data-testid="button-pricing-edge">Try Platform Free — 7 Days</Link>
            </div>

            <div className="flex flex-col rounded-2xl border border-brand-green/40 bg-green-50/40 shadow-sm p-6 relative" data-testid="pricing-card-annual">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Best Value</div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green mb-1">Edge — Annual</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">£495</span>
                <span className="text-slate-500 text-sm mb-0.5">one-time</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">12 months · equiv. £41.25/mo</p>
              <ul className="space-y-1.5 text-sm text-slate-700 mb-6 flex-1">
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Full Edge access for 12 months</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>All 17 Hard drills &amp; mock exams</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Advanced analytics &amp; plans</li>
                <li className="flex gap-2"><span className="text-green-500 shrink-0">✓</span>Save £224.88 vs monthly</li>
              </ul>
              <Link href="/pricing?autoCheckout=pack_annual" className="block text-center w-full rounded-lg bg-green-700 text-white font-semibold py-2 text-sm hover:bg-green-800 transition-colors" data-testid="button-pricing-annual">Get Annual Access</Link>
            </div>

            <div className="flex flex-col rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm p-6" data-testid="pricing-card-scholar">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Young Scholar Programme</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">£349</span>
                <span className="text-slate-500 text-sm mb-0.5">one-time</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">24 weeks structured programme</p>
              <ul className="space-y-1.5 text-sm text-slate-700 mb-6 flex-1">
                <li className="flex gap-2"><span className="text-amber-600 shrink-0">✓</span>Full platform access</li>
                <li className="flex gap-2"><span className="text-amber-600 shrink-0">✓</span>Structured 24-week roadmap</li>
                <li className="flex gap-2"><span className="text-amber-600 shrink-0">✓</span>Milestone diagnostics</li>
                <li className="flex gap-2"><span className="text-amber-600 shrink-0">✓</span>Priority support</li>
              </ul>
              <Link href="/pricing?autoCheckout=programme24_plus" className="block text-center w-full rounded-lg border border-amber-600 text-amber-700 font-semibold py-2 text-sm hover:bg-amber-50 transition-colors" data-testid="button-pricing-scholar">View Programme</Link>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">All prices include VAT. Subscriptions can be cancelled anytime. One-time payments grant access for the stated duration.</p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-slate-50 border-b border-border/30" data-testid="section-platform-differentiator">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Why This Works</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">
              This Is a Preparation Platform. Not a Question Bank.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Most preparation resources give you material to work through. This platform tells you what to work on — based on where your child actually is — and shows you whether it's making a difference.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3" data-testid="card-platform-diff-next">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">Tells You What to Focus on Next</h3>
              <p className="text-sm text-slate-500 leading-relaxed">After every diagnostic, the three highest-impact priorities are identified and matched to targeted drills. You're not guessing where to spend the time — the data decides.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3" data-testid="card-platform-diff-device">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">Works on Any Device</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Phone, tablet or laptop — your child practices when and where suits them. Interactive and timed, not a static PDF to work through alone at a dedicated desk.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3" data-testid="card-platform-diff-analytics">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">Parent Visibility Without Micromanaging</h3>
              <p className="text-sm text-slate-500 leading-relaxed">The parent analytics dashboard shows readiness score, session progress by topic, and your child's current improvement priorities. You know what's happening — without sitting beside them for every session.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3" data-testid="card-platform-diff-tracking">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">Shows Whether It's Working</h3>
              <p className="text-sm text-slate-500 leading-relaxed">After every session you can see whether the key priorities are improving. Progress is tracked across all four sections so you know early if a different focus is needed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-border/30">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-slate-500 text-sm mb-6">Not sure where to start? The free 8-minute diagnostic requires no account and takes less time than a practice paper.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-white" asChild data-testid="button-cta-diagnostic">
              <Link href="/free-diagnostic">Start Free Diagnostic</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 font-semibold" asChild data-testid="button-cta-programme">
              <Link href="/pricing?autoCheckout=programme24_plus">View Young Scholar Programme</Link>
            </Button>
          </div>
        </div>
      </section>


      <section className="bg-slate-50 border-t border-slate-200" aria-label="Platform overview">

        {/* Section header */}
        <div className="border-b border-slate-200 bg-white">
          <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Platform Reference</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-2">About Bucks 11 Plus Tests</h2>
            <p className="text-sm text-slate-500 text-center max-w-xl mx-auto">Everything parents need to know about the platform, the diagnostic, and how we help children prepare for the Buckinghamshire Secondary Transfer Test.</p>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12">

          {/* At a Glance */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">At a Glance</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Free 12-question GL-style mini diagnostic — no account required, results in under 10 minutes",
                "Covers all four Bucks 11+ domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension",
                "Readiness forecast benchmarked against the 121 standardised score qualifying threshold",
                "Bucks Practice Platform with 1,500+ questions, timed drills, and parent analytics — from £24.99/month",
                "Fully independent — not affiliated with GL Assessment, Buckinghamshire Council, or any grammar school",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* What the Diagnostic Covers */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">What the Diagnostic Covers</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 ml-11">
              The Buckinghamshire Secondary Transfer Test (STT) is produced by GL Assessment and covers four assessed domains. Our diagnostic replicates this structure using independently developed GL-style question families:
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

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* What Parents Receive */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">What Parents Receive</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5 ml-11">After the free diagnostic, parents receive all of the following — instantly, with no account required:</p>
            <div className="space-y-3 ml-11">
              {[
                { label: "A readiness band", desc: "On Track, Within Reach, or Clear Improvement Opportunity — relative to the 121 qualifying standard" },
                { label: "A forecast standardised score", desc: "Where your child is currently tracking against the 121 threshold, in the same scale as the real test" },
                { label: "Section-by-section accuracy", desc: "Which of the four domains are strong and which need attention" },
                { label: "Pacing analysis", desc: "Whether your child is working at the speed the real test requires" },
                { label: "Three priority next steps", desc: "The specific areas where targeted practice will have the highest impact on the overall score" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold text-primary">{item.label}</span>
                    <span className="text-slate-500"> — {item.desc}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* What Does 121 Mean */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">What Does 121 Mean?</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-5">
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

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* Who This Platform Is For */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">Who This Platform Is For</h2>
            </div>
            <div className="space-y-4 ml-11">
              <p className="text-sm text-slate-600 leading-relaxed">
                Bucks 11 Plus Tests is designed for parents of children in Year 5 or Year 6 in Buckinghamshire — or moving to Buckinghamshire — who are preparing for the Secondary Transfer Test. It is particularly useful for parents who are already doing some preparation (workbooks, tutor, mock exams) but are not confident that preparation is closing the right gaps, or who want to understand their child's starting point before deciding how much time and money to invest.
              </p>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">This platform is not</span> a tutoring agency, does not provide one-to-one sessions, and cannot guarantee a grammar school place. It works well alongside a tutor and as a standalone preparation tool for families who prefer a self-directed approach.
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preparing for 11+ outside Buckinghamshire?{" "}
                <a href="https://11plustesthub.co.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  11plusTestHub.co.uk
                </a>{" "}
                covers 11+ preparation for grammar schools across England.
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-serif">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-0 rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {[
                { q: "Is Bucks 11 Plus Tests affiliated with GL Assessment or Buckinghamshire Council?", a: "No. We are fully independent — not affiliated with GL Assessment, Buckinghamshire Council, TBGS, or any individual grammar school. 'GL-style' refers to the question format we independently replicate, not an official relationship." },
                { q: "How is the free diagnostic different from the full paid platform?", a: "The free 12-question mini diagnostic gives you a readiness band, forecast score, and section breakdown with no account needed. The paid Bucks Practice Platform (from £24.99/month) gives access to 1,500+ questions, full 40-question timed papers, and progress tracking across all sessions. The Platform Edge (£59.99/month) adds full parent analytics and all Hard drills." },
                { q: "What is the difference between the Practice Platform and the Young Scholar Programme?", a: "The Bucks Practice Platform (from £24.99/month) is flexible access to the full question bank, drills, and diagnostics. The Bucks Young Scholar Programme (£349 one-time) adds a structured 6-month preparation programme with a 26-week roadmap, weekly task plans, milestone assessments, and 3 mock exams." },
                { q: "When should preparation begin?", a: "Most families begin structured preparation in Year 4 or early Year 5, giving 12–18 months before the September test. Starting with a diagnostic identifies specific gaps so preparation time is targeted rather than broad." },
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

        {/* Footer disclaimer */}
        <div className="border-t border-slate-200 bg-white py-6 text-center">
          <p className="text-xs text-slate-400" data-testid="text-disclaimer">
            Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council. Operated by Ianson Systems Limited.
          </p>
        </div>

      </section>
    </div>
  );
}

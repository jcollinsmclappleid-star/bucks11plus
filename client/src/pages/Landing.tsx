import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Search, Wrench, TrendingUp, ChevronLeft, ChevronRight, Loader2, Smartphone } from "lucide-react";
import { Seo } from "../components/shared/Seo";
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
    <div className="flex flex-col items-center gap-6" data-testid="showcase-forecast">
      <div className="relative w-40 h-40 md:w-52 md:h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" className="stroke-slate-200" strokeWidth="10" fill="none" />
          <circle cx="50" cy="50" r="40" className="stroke-brand-amber" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (114 / 141))} />
          <line x1="50" y1="4" x2="50" y2="14" className="stroke-primary/60" strokeWidth="1.5" transform={`rotate(${(121/141)*360} 50 50)`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold text-primary">114</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Est. Score</span>
        </div>
      </div>
      <div className="text-center space-y-3 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200">
          Borderline (Amber)
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-primary font-serif">7 points gap to 121</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Clear readiness band shows exactly where your child stands against the Bucks qualifying benchmark.
        </p>
        <p className="text-[11px] text-slate-400 italic pt-1">
          Illustrative example. Scores are modelled from performance patterns and are not official standardised results.
        </p>
      </div>
    </div>
  );
}

function SectionsPanel() {
  const sections = [
    { name: "Verbal Reasoning", score: 72, color: "bg-amber-500", items: "18/25", subs: [
      { name: "Letter Patterns", score: 80 }, { name: "Vocab & Synonyms", score: 60 }, { name: "Code Sequences", score: 75 }
    ]},
    { name: "Non-Verbal Reasoning", score: 58, color: "bg-red-500", items: "14/24", subs: [
      { name: "Spatial Sequences", score: 50 }, { name: "Rotation & Reflection", score: 55 }, { name: "Classification", score: 65 }
    ]},
    { name: "Mathematics", score: 80, color: "bg-green-500", items: "20/25", subs: [
      { name: "Arithmetic", score: 85 }, { name: "Fractions & Ratios", score: 70 }, { name: "Data Interpretation", score: 80 }
    ]},
    { name: "English Comprehension", score: 66, color: "bg-amber-500", items: "16/24", subs: [
      { name: "Inference & Deduction", score: 62 }, { name: "Authorial Intent", score: 70 }, { name: "Vocabulary in Context", score: 75 }
    ]},
  ];
  return (
    <div className="space-y-4 w-full max-w-md mx-auto" data-testid="showcase-sections">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-primary font-serif">Section-by-Section Accuracy</h3>
        <p className="text-xs text-muted-foreground mt-1">See exactly where strengths and gaps lie — down to sub-skill level</p>
      </div>
      {sections.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-primary text-sm">{s.name}</span>
            <span className="text-xs text-muted-foreground">{s.items} correct</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.score}%` }}></div>
          </div>
          <div className="flex justify-between mt-1.5 mb-2">
            <span className="text-xs font-bold text-primary">{s.score}%</span>
            <span className={`text-[10px] font-bold ${s.score >= 75 ? "text-green-600" : s.score >= 65 ? "text-amber-600" : "text-red-600"}`}>
              {s.score >= 75 ? "On Track" : s.score >= 65 ? "Borderline" : "Focus Area"}
            </span>
          </div>
          <div className="ml-2 border-l-2 border-slate-100 pl-3 space-y-1">
            {s.subs.map((sub, j) => (
              <div key={j} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{sub.name}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${sub.score >= 75 ? 'bg-green-500' : sub.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.score}%` }}></div>
                  </div>
                  <span className={`font-bold text-[10px] ${sub.score >= 75 ? 'text-green-600' : sub.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{sub.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
        <Target className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-red-800">Priority Focus: Non-Verbal Reasoning</p>
          <p className="text-[11px] text-red-600 mt-0.5">Spatial sequences and pattern rotation need targeted practice</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto" data-testid="showcase-analytics">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-primary font-serif">Parent Analytics</h3>
        <p className="text-xs text-muted-foreground mt-1">10 metrics that tell you what's really happening</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">78</div>
          <div className="text-[10px] text-muted-foreground font-medium">Readiness Score</div>
          <div className="text-[10px] font-bold text-amber-700 mt-0.5">Borderline</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">82</div>
          <div className="text-[10px] text-muted-foreground font-medium">Pace Discipline</div>
          <div className="text-[10px] font-bold text-green-600 mt-0.5">Good</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">0.72</div>
          <div className="text-[10px] text-muted-foreground font-medium">Weighted Accuracy</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">68</div>
          <div className="text-[10px] text-muted-foreground font-medium">Forecast Stability</div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="text-[10px] font-bold text-primary mb-2">Fatigue Analysis</div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <div className="flex items-end gap-1 h-12">
              <div className="flex-1 bg-green-400 rounded-t" style={{ height: "100%" }}></div>
              <div className="flex-1 bg-green-300 rounded-t" style={{ height: "85%" }}></div>
              <div className="flex-1 bg-amber-400 rounded-t" style={{ height: "65%" }}></div>
            </div>
            <div className="flex text-[8px] text-muted-foreground mt-1 gap-1">
              <span className="flex-1 text-center">Start</span>
              <span className="flex-1 text-center">Mid</span>
              <span className="flex-1 text-center">End</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-600">-11%</div>
            <div className="text-[9px] text-muted-foreground">accuracy drop</div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="text-[10px] font-bold text-primary mb-1.5">Top 3 Priorities</div>
        {["NVR: Spatial sequences", "VR: Letter patterns", "Maths: Ratio problems"].map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 py-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-amber-400"}`}></div>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressPanel() {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto" data-testid="showcase-progress">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-primary font-serif">Progress Tracking</h3>
        <p className="text-xs text-muted-foreground mt-1">Watch the gap close over time</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-xs font-bold text-primary mb-3">Score Trajectory</div>
        <svg viewBox="0 0 240 90" className="w-full h-24">
          <line x1="0" y1="22" x2="240" y2="22" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
          <text x="228" y="18" fontSize="8" fill="#94a3b8">121</text>
          <path d="M 20 70 L 80 55 L 150 40 L 220 28" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="70" r="4" fill="#94a3b8" />
          <circle cx="80" cy="55" r="4" fill="#64748b" />
          <circle cx="150" cy="40" r="4" fill="#3b82f6" />
          <circle cx="220" cy="28" r="4" fill="#3b82f6" />
          <text x="10" y="82" fontSize="8" fill="#94a3b8">Wk 1</text>
          <text x="68" y="67" fontSize="8" fill="#94a3b8">Wk 6</text>
          <text x="138" y="52" fontSize="8" fill="#94a3b8">Wk 12</text>
          <text x="205" y="22" fontSize="8" fill="#3b82f6">Wk 16</text>
          <text x="14" y="66" fontSize="7" fill="#64748b">105</text>
          <text x="74" y="51" fontSize="7" fill="#64748b">110</text>
          <text x="144" y="36" fontSize="7" fill="#3b82f6">114</text>
          <text x="214" y="40" fontSize="7" fill="#3b82f6">117</text>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-blue-700">+12</div>
          <div className="text-[10px] text-muted-foreground font-medium">Points gained</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-blue-700">Improving</div>
          <div className="text-[10px] text-muted-foreground font-medium">Trend</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-amber-700">Borderline</div>
          <div className="text-[10px] text-muted-foreground font-medium">Band</div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="text-[10px] font-bold text-primary mb-1.5">Gap Velocity</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-red-500 font-medium line-through">16 pt gap</div>
          <ArrowRight className="h-4 w-4 text-blue-600" />
          <div className="text-sm font-bold text-blue-700">4 pt gap</div>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">Gap narrowing at ~3 points per diagnostic cycle</div>
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
        title="Bucks 11 Plus Practice Test (2026) – Free GL Diagnostic & 121 Score Prep | 11+ Standard"
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
            { "@type": "Question", name: "Is 11+ Standard affiliated with GL Assessment or Buckinghamshire Council?", acceptedAnswer: { "@type": "Answer", text: "No. 11+ Standard is fully independent. We are not affiliated with GL Assessment, Buckinghamshire Council, The Buckinghamshire Grammar Schools (TBGS), or any individual grammar school. The GL-style label refers to the question format we use to replicate the test structure — it does not imply any formal relationship." } },
            { "@type": "Question", name: "What is included in the Practice Platform?", acceptedAnswer: { "@type": "Answer", text: "The Practice Platform (£59.99/month or £495/year) includes 1,500+ questions across all four test domains, timed drills by section and difficulty level, full 40-question timed diagnostic papers, a parent analytics dashboard with 10 performance metrics, session-by-session progress tracking, and PDF reports. Cancel anytime." } },
            { "@type": "Question", name: "What is the difference between the Practice Platform and Programme+?", acceptedAnswer: { "@type": "Answer", text: "The Practice Platform (from £59.99/month) is flexible access to the full question bank, drills, and analytics. Programme+ (£349 one-time) includes everything in the Practice Platform plus a structured 6-month preparation programme with week-by-week focus areas and milestone assessments — designed for families who want a complete guided programme rather than self-directed practice." } },
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
                <a href="#how-forecast-works">How It Works</a>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Link href="/free-diagnostic" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Free Diagnostic
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">
                Practice Platform — from £59.99/mo
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing#tiers" className="text-brand-amber/70 hover:text-brand-amber text-sm font-semibold transition-colors">
                Programme+ — £349 one-time
              </Link>
            </div>

            <p className="text-[11px] text-white/25 mt-2 max-w-md mx-auto">
              Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white border-b border-border/30" data-testid="section-whats-included">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">What's Included</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3" data-testid="text-whats-included-title">
              Everything needed to reach 121 — at every level
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GL-aligned practice and diagnostics built specifically for the Buckinghamshire Secondary Transfer Test — the exam that determines entry to all 13 Bucks grammar schools.
            </p>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed border-t border-slate-100 pt-4">
              From their first session, your child practices the way the real test works — timed, interactive, on the device they prefer. They see their scores improve, their forecast move toward 121, and their weakest areas get stronger. That progress — visible and measurable — builds the confidence they'll need on test day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col" data-testid="card-included-free">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Free</p>
              <h3 className="text-xl font-bold text-primary font-serif mb-4">£0</h3>
              <ul className="space-y-3 flex-1">
                {[
                  "1 timed mini diagnostic (12 questions)",
                  "Basic readiness forecast vs 121",
                  "1 sample practice drill",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-6 h-11 text-sm font-semibold" asChild data-testid="button-included-free">
                <Link href="/free-diagnostic">Start Free Diagnostic</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col" data-testid="card-included-pack">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Practice Platform</p>
              <h3 className="text-xl font-bold text-primary font-serif mb-1">£59.99<span className="text-sm font-medium text-slate-500">/mo</span></h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-4">Cancel any time</p>
              <ul className="space-y-3 flex-1">
                {[
                  "1,500+ practice questions across VR, NVR, Maths & Comprehension",
                  "Easy & Medium drills (19 sections)",
                  "Full timed diagnostics (40 questions)",
                  "PDF reports & impact simulator",
                  "Cancel any time",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 h-11 text-sm font-semibold bg-primary text-primary-foreground" asChild data-testid="button-included-pack">
                <Link href="/pricing?autoCheckout=pack_monthly">Start Monthly</Link>
              </Button>
            </div>

            <div className="rounded-2xl border-2 border-brand-amber bg-amber-50/30 p-6 flex flex-col relative overflow-hidden" data-testid="card-included-programme">
              <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-3 py-1 rounded-bl-lg font-bold text-xs">
                RECOMMENDED
              </div>
              <p className="text-sm font-semibold text-brand-amber uppercase tracking-wider mb-2">Programme+</p>
              <div className="mb-1">
                <span className="text-xl font-bold text-primary font-serif">£349</span>
                <span className="text-sm font-medium text-slate-500"> one-time</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">6 months · all-inclusive · no subscription needed</p>
              <span className="inline-block text-[10px] font-bold text-brand-green uppercase tracking-tight bg-green-50 border border-green-200 px-2 py-0.5 rounded-full mb-4 w-fit">
                Platform access included
              </span>
              <ul className="space-y-2.5 flex-1 mb-4">
                {[
                  "1,500+ practice questions across all 4 sections",
                  "Full timed diagnostics (40 questions)",
                  "All 17 Hard challenge drills unlocked",
                  "26-week structured preparation roadmap",
                  "3 mock exam simulations",
                  "Weekly personalised task plans",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                    <span className="text-primary text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-white/70 border border-brand-amber/20 px-3 py-2 mb-3">
                <p className="text-xs text-amber-800">
                  <span className="font-bold">Already subscribed?</span> Sign in and add a 12-week structured programme for just <span className="font-bold">£89</span>.
                </p>
              </div>
              <Button
                className="w-full h-auto min-h-[2.75rem] py-2 text-sm font-bold bg-brand-amber text-white hover:bg-brand-amber/90 border-none"
                onClick={handleProgrammeCheckout}
                disabled={checkoutLoading}
                data-testid="button-included-programme"
              >
                {checkoutLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : "Get Programme+ — £349"
                }
              </Button>
            </div>
          </div>
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
              <p className="text-sm text-slate-500 leading-relaxed">The parent analytics dashboard shows readiness score, pace discipline, fatigue patterns and top priorities. You know what's happening — without sitting beside them for every session.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3" data-testid="card-platform-diff-tracking">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">Shows Whether It's Working</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Score trajectory, forecast movement toward 121, gap velocity over time. You can see preparation making a difference — or know early if a different focus is needed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-10" data-testid="text-dual-path-title">
            How Would You Like to Begin?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col" data-testid="card-path-diagnostic">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">Find Out Exactly Where They Stand</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                Take an 8-minute timed diagnostic to see your child's readiness band, their performance across all four sections, and the three priorities that will move the score most. No sign-up required.
              </p>
              <Button variant="outline" className="w-full h-12 text-sm font-semibold" asChild data-testid="button-path-diagnostic">
                <Link href="/free-diagnostic">Start Free Diagnostic</Link>
              </Button>
            </div>
            <div className="rounded-2xl border-2 border-primary/20 bg-slate-50 p-7 sm:p-8 flex flex-col" data-testid="card-path-programme">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">Begin the Full Preparation Programme</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                Everything in one place, ready to start today. A structured 26-week plan built around the September test — with diagnostics, targeted drills, mock exams and weekly task plans. No decisions about what to do next: the programme makes them for you.
              </p>
              <Button className="w-full h-12 text-sm font-semibold bg-primary text-primary-foreground" asChild data-testid="button-path-programme">
                <Link href="/pricing?autoCheckout=programme24_plus">View Programme+ &amp; Enrol</Link>
              </Button>
            </div>
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
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-slate-500">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary/50" /> Independent assessment
            </span>
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary/50" /> Structured diagnostic methodology
            </span>
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary/50" /> Not affiliated with GL or Bucks Council
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-b border-border/50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4 font-serif">Preparation That Matches the Real Test</h2>
            <p className="text-lg text-muted-foreground">The Buckinghamshire Secondary Transfer Test is specific — in format, timing and content. Every question, drill and diagnostic on this platform reflects that exactly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">All Four Sections Covered</h3>
                <p className="text-muted-foreground">Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension — mapped to the exact GL format of the Bucks 11+. Your child practices the right things, in the right structure.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Timed from the Start</h3>
                <p className="text-muted-foreground">The real test is fast. Pace discipline matters as much as accuracy — and working under timed conditions is a skill that improves with practice. Every diagnostic and drill reflects this.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-amber/10 text-brand-amber rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 border-brand-amber/20">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Always Benchmarked Against 121</h3>
                <p className="text-muted-foreground">Every result, every forecast, every analytics view is positioned against 121. So the question is always "where are they relative to where they need to be?" — not just "how did they do?"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-forecast-works" className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">
              How It Works — In Practice
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              In a competitive cohort, working hard is not enough. Preparation needs to be measured, directed and tracked — so effort goes where it will actually change the outcome.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-diagnostic-benchmark">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 1</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Diagnostic Benchmark</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Start with a timed, GL-style diagnostic across Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension — including section pacing.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Clear baseline across key sub-skills</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Pace indicators by section</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Initial readiness band with 121 context</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                The starting point — so preparation is directed, not scattered.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-readiness-forecast">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 2</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Readiness Forecast</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                We model performance against qualifying benchmarks using difficulty-aware accuracy, pace analysis, and concentration of errors.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Readiness band: Secure / Borderline / Development Required</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Top 3 priorities identified (what to fix first)</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Key risks surfaced (pace, hard-tier drop, volatility)</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Removes the guesswork — so you know exactly where to direct the next month of preparation.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-targeted-development">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 3</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Targeted Development</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Practice is directed to the areas that most influence readiness — not broad repetition across everything.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Drills mapped to specific rule types</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Visual NVR sequences and patterns</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Timed section blocks with progressive difficulty</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Not more practice. Better practice — focused on what will actually move the score.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-measured-progression">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 4</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Measured Progression</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Progress is re-checked at structured milestones so improvement becomes visible — not assumed.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Score trajectory toward 121 tracked over time</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Pace discipline and stability monitored</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Movement between readiness bands made clear</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Evidence that preparation is working — week by week, as September approaches.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-6 sm:p-8" data-testid="section-urgency-timeline">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-brand-amber" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-base">The timeline is shorter than most families realise</p>
                  <p className="text-amber-700 text-sm mt-0.5">Registration for the Secondary Transfer Test opens in the spring of Year 5. The test itself takes place in September of Year 6.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
                <div className="bg-white/70 rounded-xl border border-amber-200/40 px-4 py-3">
                  <p className="font-bold text-amber-900">Spring of Year 5</p>
                  <p className="text-amber-700 text-xs mt-0.5">Registration window opens</p>
                </div>
                <div className="bg-white/70 rounded-xl border border-amber-200/40 px-4 py-3">
                  <p className="font-bold text-amber-900">September, Year 6</p>
                  <p className="text-amber-700 text-xs mt-0.5">Secondary Transfer Test</p>
                </div>
                <div className="bg-white/70 rounded-xl border border-amber-200/40 px-4 py-3">
                  <p className="font-bold text-amber-900">October, Year 6</p>
                  <p className="text-amber-700 text-xs mt-0.5">Test results published</p>
                </div>
              </div>
              <p className="text-amber-800 text-sm leading-relaxed">
                Children who begin structured preparation earlier have more time to close the gaps that matter. Starting with a diagnostic is the fastest way to understand where that time should go.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/[0.03] to-primary/[0.07] border border-primary/10 p-7 sm:p-10 text-center">
              <p className="text-slate-700 font-medium text-lg leading-relaxed mb-1">
                Are we actually on track for 121?
              </p>
              <p className="text-primary font-serif text-xl sm:text-2xl font-bold mt-3 mb-3">
                Find out in 8 minutes. No sign-up required.
              </p>
              <p className="text-slate-500 text-sm mb-5">
                A clear readiness band, section-by-section breakdown, and your child's top three priorities — instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground shadow-md" asChild data-testid="button-start-diagnostic-process">
                  <Link href="/free-diagnostic">Start Free Diagnostic</Link>
                </Button>
                <Button variant="outline" className="h-12 px-6" asChild data-testid="link-how-it-works-detail">
                  <Link href="/how-it-works">
                    See Full Process <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-primary font-serif text-center mb-2">Buckinghamshire 11+ Resources</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Free guides and information to help you navigate the grammar school admissions process.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/buckinghamshire-11-plus-guide" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">Complete Bucks 11+ Guide</h3>
              <p className="text-sm text-muted-foreground">Everything you need to know about the exam, scoring and admissions.</p>
            </Link>
            <Link href="/bucks-grammar-schools" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">All 13 Grammar Schools</h3>
              <p className="text-sm text-muted-foreground">Directory of every Buckinghamshire grammar school and their admissions.</p>
            </Link>
            <Link href="/bucks-11-plus-qualifying-score" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">Qualifying Score Explained</h3>
              <p className="text-sm text-muted-foreground">What the standardised 121 benchmark means and how it works.</p>
            </Link>
            <Link href="/how-to-pass-bucks-11-plus" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">How to Pass the 11+</h3>
              <p className="text-sm text-muted-foreground">Strategies and tips to help your child reach the qualifying score.</p>
            </Link>
            <Link href="/bucks-11-plus-timeline" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">Admissions Timeline</h3>
              <p className="text-sm text-muted-foreground">Key dates from registration through to results and allocation.</p>
            </Link>
            <Link href="/bucks-11-plus-registration" className="group p-5 bg-white rounded-xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all">
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80">Registration Guide</h3>
              <p className="text-sm text-muted-foreground">Step-by-step instructions for registering for the test.</p>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/site-links" className="text-sm text-primary font-medium hover:underline">
              View all pages and resources →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-t border-slate-100" aria-label="Platform overview">
        <div className="container mx-auto max-w-4xl px-4">

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary font-serif mb-4">At a Glance</h2>
            <ul className="space-y-2 text-sm text-slate-600 list-none pl-0">
              <li>✓ Free 12-question GL-style mini diagnostic — no account required, results in under 10 minutes</li>
              <li>✓ Covers all four Bucks 11+ domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension</li>
              <li>✓ Readiness forecast benchmarked against the 121 standardised score qualifying threshold</li>
              <li>✓ Practice Platform with 1,500+ questions, timed drills, and parent analytics — from £59.99/month</li>
              <li>✓ Fully independent — not affiliated with GL Assessment, Buckinghamshire Council, or any grammar school</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary font-serif mb-4">What the Diagnostic Covers</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The Buckinghamshire Secondary Transfer Test (also called the Secondary Transfer Test or STT) is produced by GL Assessment and covers four assessed domains. Our diagnostic replicates this structure using independently developed GL-style question families:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-primary text-sm mb-2">Verbal Reasoning</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Word relationships, alphabetical codes, missing letters, analogies, and logical deduction using language. Tests vocabulary breadth and rule-application speed.</p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-primary text-sm mb-2">Non-Verbal and Spatial Reasoning</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Pattern sequences, matrices, shape analogies, spatial rotation, and reflection. Tests logical reasoning without language — a domain not covered in the primary school curriculum.</p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-primary text-sm mb-2">Mathematics</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Arithmetic fluency, fractions, data interpretation, multi-step word problems, and geometry. Goes beyond standard Year 6 curriculum into applied reasoning under time pressure.</p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-primary text-sm mb-2">English Comprehension</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Reading passages with multiple-choice questions covering literal comprehension, inference, vocabulary in context, and author technique. Two-phase timed — reading time separate from response time.</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary font-serif mb-4">What Parents Receive</h2>
            <p className="text-slate-600 leading-relaxed mb-3">After the free diagnostic, parents receive:</p>
            <ul className="space-y-1.5 text-sm text-slate-600 list-none pl-0">
              <li>✓ <strong>A readiness band</strong> — On Track, Within Reach, or Clear Improvement Opportunity — relative to the 121 qualifying standard</li>
              <li>✓ <strong>A forecast standardised score</strong> — where your child is currently tracking against the 121 threshold</li>
              <li>✓ <strong>Section-by-section accuracy</strong> — which of the four domains are strong and which need attention</li>
              <li>✓ <strong>Pacing analysis</strong> — whether your child is working at the speed the real test requires</li>
              <li>✓ <strong>Three priority next steps</strong> — the specific areas where targeted practice will have the highest impact on the overall score</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary font-serif mb-3">What Does 121 Mean?</h2>
            <p className="text-slate-600 leading-relaxed">
              121 is the standardised score qualifying threshold for the Buckinghamshire Secondary Transfer Test. It is not a raw mark or a percentage — it is a statistically standardised figure that accounts for the child's age on the day of the test and the difficulty of that year's paper. Children who achieve a standardised score of 121 or above are deemed to have qualified and are eligible to be considered for a place at any of the 13 Buckinghamshire grammar schools. Qualifying does not guarantee a place — oversubscription criteria at each school (typically distance-based) determine final allocation among all qualifying applicants. <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline font-medium">Full explanation of the 121 qualifying score →</Link>
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary font-serif mb-3">Who This Platform Is For</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              11+ Standard is designed for parents of children in Year 5 or Year 6 in Buckinghamshire — or moving to Buckinghamshire — who are preparing for the Secondary Transfer Test. It is particularly useful for parents who are already doing some preparation (workbooks, tutor, mock exams) but are not confident that preparation is closing the right gaps, or who want to understand their child's starting point before deciding how much time and money to invest.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong>This platform is not</strong> a tutoring agency, does not provide one-to-one sessions, and cannot guarantee a grammar school place. It works well alongside a tutor and as a standalone preparation tool for families who prefer a self-directed approach.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-primary font-serif mb-2">Frequently Asked Questions</h2>
            <div className="space-y-4 mt-4">
              {[
                { q: "Is 11+ Standard affiliated with GL Assessment or Buckinghamshire Council?", a: "No. We are fully independent — not affiliated with GL Assessment, Buckinghamshire Council, TBGS, or any individual grammar school. 'GL-style' refers to the question format we independently replicate, not an official relationship." },
                { q: "How is the free diagnostic different from the full paid platform?", a: "The free 12-question mini diagnostic gives you a readiness band, forecast score, and section breakdown with no account needed. The paid Practice Platform (from £59.99/month) gives access to 1,500+ questions, full 40-question timed papers, parent analytics, and progress tracking across all sessions." },
                { q: "What is the difference between Practice Platform and Programme+?", a: "Practice Platform is flexible access to the full question bank, drills, and analytics — monthly at £59.99 or annual at £495. Programme+ (£349 one-time) adds a structured 6-month preparation programme with week-by-week focus areas and milestone assessments." },
                { q: "When should preparation begin?", a: "Most families begin structured preparation in Year 4 or early Year 5, giving 12–18 months before the September test. Starting with a diagnostic identifies specific gaps so preparation time is targeted rather than broad." },
              ].map((item, i) => (
                <div key={i} className="border-t border-slate-200 pt-4 first:border-0 first:pt-0">
                  <p className="text-sm font-semibold text-primary mb-1">{item.q}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <div className="py-6 text-center bg-white">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

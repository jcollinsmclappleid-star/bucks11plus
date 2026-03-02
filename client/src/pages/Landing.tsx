import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Zap, Search, Wrench, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useState, useRef } from "react";

const showcaseTabs = [
  { id: "forecast", label: "Readiness Forecast" },
  { id: "sections", label: "Section Breakdown" },
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
    { name: "Verbal Reasoning", score: 72, color: "bg-amber-500", items: "18/25" },
    { name: "Non-Verbal Reasoning", score: 58, color: "bg-red-500", items: "14/24" },
    { name: "Mathematics", score: 80, color: "bg-green-500", items: "20/25" },
  ];
  return (
    <div className="space-y-5 w-full max-w-md mx-auto" data-testid="showcase-sections">
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-primary font-serif">Section-by-Section Accuracy</h3>
        <p className="text-xs text-muted-foreground mt-1">See exactly where strengths and gaps lie</p>
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
          <div className="flex justify-between mt-1.5">
            <span className="text-xs font-bold text-primary">{s.score}%</span>
            <span className={`text-[10px] font-bold ${s.score >= 75 ? "text-green-600" : s.score >= 65 ? "text-amber-600" : "text-red-600"}`}>
              {s.score >= 75 ? "On Track" : s.score >= 65 ? "Borderline" : "Focus Area"}
            </span>
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
          <path d="M 20 70 L 80 55 L 150 38 L 220 15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="70" r="4" fill="#94a3b8" />
          <circle cx="80" cy="55" r="4" fill="#64748b" />
          <circle cx="150" cy="38" r="4" fill="#3b82f6" />
          <circle cx="220" cy="15" r="4" fill="#22c55e" />
          <text x="10" y="82" fontSize="8" fill="#94a3b8">Wk 1</text>
          <text x="68" y="67" fontSize="8" fill="#94a3b8">Wk 4</text>
          <text x="138" y="50" fontSize="8" fill="#94a3b8">Wk 8</text>
          <text x="205" y="10" fontSize="8" fill="#22c55e">Wk 12</text>
          <text x="14" y="66" fontSize="7" fill="#64748b">105</text>
          <text x="74" y="51" fontSize="7" fill="#64748b">112</text>
          <text x="144" y="34" fontSize="7" fill="#3b82f6">118</text>
          <text x="214" y="27" fontSize="7" fill="#22c55e">124</text>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-700">+19</div>
          <div className="text-[10px] text-muted-foreground font-medium">Points gained</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-blue-700">Stable</div>
          <div className="text-[10px] text-muted-foreground font-medium">Forecast</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-green-700">Green</div>
          <div className="text-[10px] text-muted-foreground font-medium">Band</div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="text-[10px] font-bold text-primary mb-1.5">Gap Velocity</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-red-500 font-medium line-through">16 pt gap</div>
          <ArrowRight className="h-4 w-4 text-green-600" />
          <div className="text-sm font-bold text-green-700">Above 121</div>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">Closing at ~4 points per diagnostic cycle</div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState<TabId>("forecast");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="GL-Style Aligned Bucks 11+ Diagnostics | 11+ Standard"
        description="Timed diagnostics aligned to GL-style reasoning families used in Bucks for the Buckinghamshire Secondary Transfer Test."
      />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }}>
        <div className="absolute inset-0 z-0 hero-texture"></div>
        <div className="absolute inset-0 z-0 hero-vignette"></div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 100%)' }}></div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="text-center space-y-6">

            <div className="flex flex-col items-center gap-1 mb-2">
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

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] font-serif max-w-4xl mx-auto">
              Know Exactly Where They Stand <br className="hidden md:block" />
              <span className="text-white/55">for the Bucks 11+.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
              A structured diagnostic system that reveals what is truly holding performance back — speed, difficulty tolerance, stability or specific rule types — and shows what to fix first.
            </p>

            <div className="pt-3 max-w-2xl mx-auto border border-white/8 rounded-lg bg-white/[0.03] px-5 py-3.5">
              <p className="text-sm text-white/55 leading-relaxed">
                Not generic practice papers. Each diagnostic analyses accuracy, pace under time pressure, performance consistency and skill gaps — then builds a focused improvement plan tailored to <span className="text-white/80 font-semibold">your child</span>.
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
                Practice Pack — £99
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <Link href="/pricing" className="text-brand-amber/70 hover:text-brand-amber text-sm font-semibold transition-colors">
                Structured Programme — £249
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
                Try It Free — 12 Minutes <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Zap className="h-4 w-4 text-brand-amber" /> No sign-up required
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4 italic">
            Example based on sample student data. Your child's real results will populate after their diagnostic.
          </p>
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
            <h2 className="text-3xl font-bold text-primary mb-4 font-serif">Built Around the Bucks 11+ Structure</h2>
            <p className="text-lg text-muted-foreground">An independent readiness assessment that measures accuracy and speed under timed conditions — then shows what to focus on first.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Coverage Across the Test</h3>
                <p className="text-muted-foreground">Verbal Reasoning, Non-Verbal Reasoning and Maths — mapped to the Bucks 11+ format so you are practising the right things.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Timed Conditions</h3>
                <p className="text-muted-foreground">Speed and completion discipline are measured alongside accuracy — because timing often determines the outcome.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-amber/10 text-brand-amber rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 border-brand-amber/20">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">121 Context</h3>
                <p className="text-muted-foreground">Results are positioned against the 121 qualifying threshold to provide clear context — without guesswork.</p>
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
              In a competitive cohort, preparation must be measured — not assumed. We benchmark, diagnose, and direct effort.
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
                Start with a timed, GL-style diagnostic across Verbal Reasoning, Non-Verbal Reasoning and Maths — including section pacing.
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
                Reduces uncertainty and prevents misplaced effort.
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
                Practice is directed to the areas that most influence readiness — not broad repetition.
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
                Time is directed to what materially changes outcomes.
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
                Progress is re-checked at structured milestones so improvement becomes visible and evidence-based.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Accuracy changes tracked over time</span>
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
                Progress becomes measurable — not assumed.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-primary/[0.07] border border-primary/10 p-7 sm:p-10 text-center">
            <p className="text-slate-700 font-medium text-lg leading-relaxed mb-1">
              Many families complete large volumes of questions without knowing whether readiness is improving.
            </p>
            <p className="text-primary font-serif text-xl sm:text-2xl font-bold mt-3 mb-3">
              Are we on track for 121 under timed conditions?
            </p>
            <p className="text-slate-500 text-sm mb-5">
              Replace uncertainty with a clear baseline and focused priorities.
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
      </section>

      <div className="py-6 text-center bg-white">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

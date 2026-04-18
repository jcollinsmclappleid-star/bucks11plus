import { useState } from "react";
import { Search, Target, Zap, TrendingUp, ChevronDown, BarChart3, Clock, Layers, Shield, BookOpen, ArrowRight, CheckCircle2, Brain, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

const howItWorksFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the Bucks 11 Plus Tests readiness check work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The readiness check is a timed GL-style assessment covering Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. It benchmarks your child's accuracy, pacing and readiness against the 121 qualifying standard for Buckinghamshire grammar schools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the 121 qualifying score?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In Buckinghamshire, a standardised score of 121 is required to qualify for a grammar school place via the Secondary Transfer Test. The exact raw score required varies each year based on cohort-wide performance and age standardisation."
      }
    },
    {
      "@type": "Question",
      "name": "How is the readiness forecast calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The readiness forecast combines accuracy modelling, pace adjustment, sub-skill stability analysis and consistency tracking into a composite index. It evaluates performance under timed conditions across all four reasoning domains and maps it against historical qualifying benchmarks."
      }
    },
    {
      "@type": "Question",
      "name": "What are the readiness bands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There are three readiness bands: Secure (Green) — performance consistently meets projected qualifying thresholds; Borderline (Amber) — close to qualifying thresholds but with identifiable risk factors; Development Required (Red) — a measurable gap exists relative to qualifying thresholds."
      }
    },
    {
      "@type": "Question",
      "name": "How often should my child take a readiness check?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend a readiness check every 4–6 weeks of targeted practice to track progression across readiness bands. The forecast model improves in accuracy as more readiness data is collected over time."
      }
    },
    {
      "@type": "Question",
      "name": "Is this preparation suitable for all Buckinghamshire grammar schools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All 13 Buckinghamshire grammar schools use the same GL Assessment Secondary Transfer Test. Our readiness check and practice content is aligned to the GL-style reasoning formats used across all schools in the county."
      }
    }
  ]
};

function AccordionItem({ title, icon: Icon, index, children }: { title: string; icon: React.ElementType; index: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border transition-all ${open ? "border-primary/20 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        aria-expanded={open}
        data-testid={`button-accordion-${index}`}
      >
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 transition-colors ${open ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className={`text-sm font-semibold flex-1 text-left transition-colors ${open ? "text-primary" : "text-slate-700"}`}>{title}</h3>
        <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 ml-12 text-sm text-slate-600 leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="How Bucks 11 Plus Tests Works (2026) – Readiness-Led Preparation | Bucks 11 Plus Tests"
        description="Assessment-first preparation for the Bucks 11 Plus. Free GL-style readiness check, 121 readiness forecast, and targeted practice to close the gap before the Secondary Transfer Test."
        canonicalPath="/how-it-works"
        schema={howItWorksFaqSchema}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }} data-testid="section-hero">
        <div className="absolute inset-0 z-0 hero-texture" />
        <div className="absolute inset-0 z-0 hero-vignette" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">Home</Link>
            <span className="text-white/25 text-xs">/</span>
            <span className="text-white/60 text-xs">How It Works</span>
          </div>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80 mb-5">Built for the Buckinghamshire 11+</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] font-serif mb-5">
            Preparation that knows exactly where to focus.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
            Not more questions. <em>Smarter</em> questions. We diagnose the exact gaps costing marks, rank them by points available, and guide your child's preparation to close them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold border-none" asChild data-testid="button-hero-cta">
              <Link href="/free-diagnostic">Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10 font-semibold" asChild>
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 3-STEP PROCESS ── */}
      <section className="py-16 md:py-20 bg-white border-b border-border/30" data-testid="section-steps">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Three steps from starting point to 121</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Every session is connected — each one feeds back into your child's forecast and tightens the gap.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Search,
                title: "Take a free readiness check",
                color: "border-amber-300 bg-amber-50",
                numColor: "text-amber-500",
                iconBg: "bg-amber-100 text-amber-700",
                points: [
                  "12 GL-style questions, 8 minutes",
                  "No account needed — completely free",
                  "Covers all 4 test domains",
                  "Receive a forecast score vs the 121 threshold",
                  "Get your 3 highest-impact priority gaps",
                ],
                cta: { href: "/free-diagnostic", label: "Start free now →" },
              },
              {
                step: "02",
                icon: Target,
                title: "See exactly what to fix",
                color: "border-violet-200 bg-violet-50",
                numColor: "text-violet-500",
                iconBg: "bg-violet-100 text-violet-700",
                points: [
                  "Breakdown by subject AND sub-topic",
                  "Each gap ranked by how many points it's worth",
                  "Stamina analysis — does accuracy drop in the 2nd half?",
                  "Readiness band: Green / Amber / Red vs 121",
                  "Parent analytics dashboard with every detail",
                ],
                cta: null,
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Follow the guided programme",
                color: "border-emerald-200 bg-emerald-50",
                numColor: "text-emerald-500",
                iconBg: "bg-emerald-100 text-emerald-700",
                points: [
                  "1,500+ GL-style questions across all 4 domains",
                  "Weekly programme prioritises highest-impact tasks first",
                  "15-minute targeted drills, not hours of generic papers",
                  "Progress tracked — forecast score updates after each session",
                  "Full mock exams and practice papers included",
                ],
                cta: { href: "/pricing", label: "See full platform →" },
              },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col gap-4 rounded-2xl border-2 p-6 ${s.color}`} data-testid={`step-${i + 1}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-4xl font-bold font-serif opacity-25 leading-none ${s.numColor}`}>{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-primary font-serif">{s.title}</h3>
                <ul className="space-y-2 flex-1">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
                {s.cta && (
                  <Link href={s.cta.href} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                    {s.cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── READINESS OUTCOMES ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-b border-border/30" data-testid="section-outcomes">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">What you get</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">What every readiness check produces</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">In 8 minutes, you get a parent-grade report with four clear outputs.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {[
              {
                icon: Target,
                iconBg: "bg-amber-100 text-amber-700",
                title: "Readiness forecast score",
                desc: "A modelled score benchmarked toward the 121 qualifying threshold — showing how close your child is and how many points remain.",
              },
              {
                icon: BarChart3,
                iconBg: "bg-violet-100 text-violet-700",
                title: "Readiness band (Green / Amber / Red)",
                desc: "An at-a-glance status: On Track (Green), Borderline (Amber), or Development Required (Red) — relative to projected qualifying performance.",
              },
              {
                icon: Zap,
                iconBg: "bg-blue-100 text-blue-700",
                title: "Top 3 priority gaps",
                desc: "The specific sub-topics losing the most points, ranked by potential gain. Gives preparation a clear focus rather than more of everything.",
              },
              {
                icon: Clock,
                iconBg: "bg-emerald-100 text-emerald-700",
                title: "Pace & stamina analysis",
                desc: "Accuracy in the first half vs the second half of the test — revealing whether time pressure or fatigue is a risk factor under exam conditions.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" data-testid={`outcome-${i}`}>
                <div className={`p-2.5 rounded-xl ${item.iconBg} shrink-0`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Readiness band legend */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-primary">Readiness bands explained</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { band: "Secure", color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50", desc: "Performance consistently meets projected qualifying thresholds across accuracy, pacing and sub-skill balance. Your child is on track for 121 under current conditions." },
                { band: "Borderline", color: "bg-amber-500", textColor: "text-amber-700", bg: "bg-amber-50", desc: "Performance is close to qualifying thresholds but shows identifiable risk factors such as pacing instability or concentrated weaknesses. Targeted practice in the priority areas will close the gap." },
                { band: "Development Required", color: "bg-red-500", textColor: "text-red-700", bg: "bg-red-50", desc: "A measurable gap exists relative to projected qualifying thresholds. Structured, focused preparation is needed — the programme will prioritise the highest-impact areas first." },
              ].map((b, i) => (
                <div key={i} className={`flex items-start gap-4 px-5 py-4 ${b.bg}`} data-testid={`band-${i}`}>
                  <div className={`w-3 h-3 rounded-full ${b.color} shrink-0 mt-1`} />
                  <div>
                    <p className={`text-sm font-bold ${b.textColor}`}>{b.band}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE THE PLATFORM ── */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-border/30" data-testid="section-platform">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-amber-400/60 uppercase tracking-widest mb-3">Full platform</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-3">Everything inside Bucks Plus Edge</h2>
            <p className="text-white/55 max-w-lg mx-auto">All of this is included in the monthly (£35) and annual (£279) plans.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain, label: "1,500+ GL-style questions", desc: "VR, NVR, Maths & Comprehension" },
              { icon: Target, label: "Full timed readiness checks", desc: "40-question GL-format assessments" },
              { icon: BookOpen, label: "Practice papers", desc: "Full-length 50-question papers" },
              { icon: Hash, label: "Hard drills & challenges", desc: "17 Hard-level drill sections" },
              { icon: BarChart3, label: "Parent analytics dashboard", desc: "Deep scoring & stamina data" },
              { icon: TrendingUp, label: "Guided weekly programme", desc: "Priority-ranked, 15-min sessions" },
              { icon: Shield, label: "Progress tracking to 121", desc: "Forecast updates after every session" },
              { icon: Clock, label: "PDF readiness reports", desc: "Shareable with tutors" },
              { icon: Layers, label: "Mock GL-style exams", desc: "Full 40-question timed simulations" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5" data-testid={`platform-feature-${i}`}>
                <div className="p-2 bg-amber-400/20 rounded-lg shrink-0">
                  <item.icon className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" className="h-12 px-8 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold border-none" asChild data-testid="button-platform-cta">
              <Link href="/pricing">See Plans & Pricing <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── HOW THE FORECAST WORKS ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-methodology">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Methodology</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">How the forecast is calculated</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">Our forecast is built on observable performance indicators, not guesswork. Here's what goes into it.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: BarChart3, title: "Accuracy modelling", content: "Accuracy is assessed across 18 structured skill areas. Performance is weighted by difficulty level and cognitive load — harder questions contribute more. Concentrated weaknesses in specific sub-rules (e.g. 'spatial rotation') are flagged as higher risk than dispersed errors." },
              { icon: Clock, title: "Pace adjustment", content: "The Bucks 11+ is time-constrained. Benchmark pacing: ~35 seconds per VR/NVR question, ~45 seconds per Maths question. Mean response time is compared and a pace ratio moderates the forecast. Deterioration in later sections signals fatigue risk." },
              { icon: Layers, title: "Sub-skill stability", content: "Qualifying performance requires balanced competency across domains. Significant imbalance between VR, NVR and Maths reduces the stability weighting. Repeated weaknesses within a single sub-rule cluster are treated as higher risk than isolated errors." },
              { icon: TrendingUp, title: "Consistency & trend", content: "A single result is not treated as definitive. As your child takes more checks, the model tracks trend direction (improving / stable / declining), volatility across attempts, and pacing consistency. Stable improvement increases forecast confidence." },
              { icon: Shield, title: "Composite readiness index", content: "All factors combine into a weighted composite index — Accuracy, Pace, Sub-skill Stability, and Consistency — that maps to a readiness band and a modelled score toward 121. This is designed to reflect practical exam performance, not theoretical maximum." },
            ].map((item, i) => (
              <AccordionItem key={i} title={item.title} icon={item.icon} index={i + 1}>
                <p>{item.content}</p>
              </AccordionItem>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-6">
            This model does not have access to official cohort-wide standardisation data. Forecasts reflect performance patterns associated with qualifying outcomes — not guaranteed scores. <Link href="/how-forecast-works" className="text-primary hover:underline">Full methodology →</Link>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-primary" data-testid="section-cta">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">Ready to see where your child stands?</h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">No account needed. 8 minutes. Get a readiness forecast, a band, and 3 specific things to fix first.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-bold bg-amber-400 text-amber-950 hover:bg-amber-300 border-none" asChild data-testid="button-cta-final">
              <Link href="/free-diagnostic"><ArrowRight className="mr-2 h-5 w-5" />Start Free Readiness Check</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 font-semibold border-white/25 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
          <p className="text-xs text-white/25 mt-6">
            Independent readiness assessment · Not affiliated with GL Assessment or Buckinghamshire Council
          </p>
        </div>
      </section>

    </div>
  );
}

import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight, Target, TrendingUp, BarChart3, Eye, Shield, HelpCircle, ChevronDown, AlertTriangle, BookOpen, Clock, Sparkles, Star, Quote } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../lib/queryClient";

function DemoCard({ title, description, testId, children }: { title: string; description: string; testId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden" data-testid={testId}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif">{title}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-3"
          onClick={() => setOpen(!open)}
          data-testid={`button-${testId}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          {open ? "Hide Preview" : "View Preview"}
        </Button>
        {open && (
          <div className="relative border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50">
            <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider">
              Demo
            </div>
            {children}
            <div className="mt-4 pt-3 border-t border-slate-200 text-center">
              <p className="text-[11px] text-muted-foreground mb-2 italic">This is what your child's data will look like</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Pricing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const search = useSearch();
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const autoCheckoutTriggered = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const autoTier = params.get("autoCheckout") as "pack12" | "programme16" | null;
    if (autoTier && user && !autoCheckoutTriggered.current) {
      autoCheckoutTriggered.current = true;
      handleCheckout(autoTier);
    }
  }, [user, search]);

  const handleCheckout = async (tier: "pack12" | "programme16") => {
    if (!user) {
      navigate(`/sign-up?redirect=checkout&tier=${tier}`);
      return;
    }
    setLoading(tier);
    try {
      const res = await apiRequest("POST", "/api/checkout", { tier });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  };

  const faqs = [
    {
      q: "Is this affiliated with GL Assessment?",
      a: "No. 11+ Standard is an independent readiness assessment service. Our diagnostics are aligned to GL-style reasoning families used in the Buckinghamshire Secondary Transfer Test, but we are not affiliated with GL Assessment or Buckinghamshire Council."
    },
    {
      q: "How is this different from Bond books or generic workbooks?",
      a: "Workbooks give every child the same content. We diagnose your child's specific gaps, then focus practice only on the areas that will move their score the most. Every minute of preparation is targeted, not generic."
    },
    {
      q: "What if my child is already scoring well?",
      a: "Even strong students have hidden weaknesses. Our diagnostics identify subtle gaps in pacing, accuracy under time pressure, and specific reasoning sub-types — things that generic practice won't surface. Knowing your child's exact profile is valuable at every level."
    },
    {
      q: "Can I start mid-year?",
      a: "Absolutely. The programme adapts to wherever your child is. Whether you have 16 weeks or 6 weeks until the test, the diagnostic-led approach ensures every session counts. Earlier is better, but it's never too late to start with clarity."
    },
    {
      q: "What happens after I pay?",
      a: "You get immediate access to everything in your plan. Start with a full diagnostic to establish your child's baseline, then follow the targeted practice recommendations. For the Structured Programme, your 16-week roadmap is generated automatically based on your child's results."
    }
  ];

  const testimonials = [
    {
      quote: "We'd been doing Bond papers for months with no idea if it was actually helping. After the first diagnostic, we could see exactly where the gaps were. Within 3 weeks, her scores started climbing in the areas that mattered most.",
      attribution: "Parent of Year 5 student, Chesham"
    },
    {
      quote: "The forecast gave us confidence we hadn't felt before. Instead of anxious guessing, we had a clear picture of where our son stood and a realistic plan to improve. It took so much stress out of the process.",
      attribution: "Parent of Year 5 student, High Wycombe"
    },
    {
      quote: "The structured programme was exactly what we needed. Each week we knew what to focus on, and the milestone diagnostics showed real, measurable progress. By the time the test came, we felt genuinely prepared.",
      attribution: "Parent of Year 6 student, Amersham"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Prepare with Clarity | 11+ Standard"
        description="Diagnostic-led 11+ preparation for the Buckinghamshire Secondary Transfer Test. See where your child stands, close the gaps that matter, and track real progress."
      />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary"></div>
        </div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] font-serif mb-6" data-testid="text-pricing-hero-title">
            Give your child the clarity they deserve ahead of the Bucks 11+
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Know exactly where they stand. See precisely what to work on. Track real progress — not just effort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-brand-amber text-amber-950 hover:bg-amber-400 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/20 border-none" onClick={() => handleCheckout("programme16")} disabled={loading === "programme16"} data-testid="button-hero-programme">
              {loading === "programme16" ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Get the Structured Programme <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md" asChild>
              <Link href="/free-diagnostic">Try Free Diagnostic First</Link>
            </Button>
          </div>
          <p className="text-xs text-white/40 mt-6">
            Independent readiness assessment · Not affiliated with GL Assessment or Buckinghamshire Council
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-problem-title">The problem with 11+ preparation today</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most parents preparing for the Bucks 11+ share the same frustrations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: HelpCircle, text: "You don't know where your child actually stands — just a vague sense of 'probably fine' or 'probably not'" },
              { icon: BookOpen, text: "Workbooks and past papers feel like busywork — no way to tell if the practice is actually moving the needle" },
              { icon: Clock, text: "Time is running out and you're not sure if you're focusing on the right areas" },
              { icon: AlertTriangle, text: "The fear of leaving gaps undiscovered until it's too late to fix them" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <item.icon className="h-6 w-6 text-brand-red shrink-0 mt-0.5" />
                <p className="text-slate-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-solution-title">A different approach: diagnostic-led preparation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instead of guessing, start with clarity. Our diagnostics tell you exactly where the gaps are — then guide practice to close them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Eye, title: "See exactly where gaps are", desc: "Timed diagnostics aligned to GL-style reasoning families pinpoint your child's specific weaknesses" },
              { icon: Target, title: "Practice only what matters", desc: "Targeted drills focus on the highest-impact areas — no wasted effort on topics they've already mastered" },
              { icon: TrendingUp, title: "Track real progress, not just effort", desc: "Forecast scores, pace metrics, and milestone diagnostics show whether preparation is actually working" },
              { icon: BarChart3, title: "Know your child's realistic readiness", desc: "A clear forecast against the 121 Bucks benchmark — not a vague guess, but a data-driven assessment" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-b border-border/30" id="plans">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-tiers-title">What your child gets</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the level of support that's right for your family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-border/60 shadow-sm flex flex-col hover:border-primary/30 transition-colors" data-testid="card-tier-free">
              <CardHeader className="pb-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Free</p>
                <CardTitle className="text-2xl font-serif">A clear starting point</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">£0</span>
                </div>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  See where your child stands today with a quick baseline diagnostic. No commitment, no sign-up required.
                </p>
                <ul className="space-y-3">
                  {[
                    "Mini diagnostic (12 minutes)",
                    "Basic forecast gauge",
                    "Top focus area revealed",
                    "Sample practice drill",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 h-12 text-lg" asChild data-testid="button-get-free">
                  <Link href="/free-diagnostic">Start Free Diagnostic</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/60 shadow-md flex flex-col hover:border-primary/30 transition-colors" data-testid="card-tier-pack12">
              <CardHeader className="pb-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Practice Pack</p>
                <CardTitle className="text-2xl font-serif">Targeted practice that moves the needle</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2">
                  <span className="text-5xl font-bold text-primary">£99</span>
                  <span className="text-muted-foreground font-medium"> one-time</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">12 weeks of full access</p>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  12 weeks of focused work on real gaps, not wasted effort. Most parents see measurable improvement within 3 weeks.
                </p>
                <ul className="space-y-3">
                  {[
                    "Full timed diagnostics (multiple papers)",
                    "Complete drill bank (all skills)",
                    "PDF reports & report archive",
                    "Progress tracking over time",
                    "Likelihood band assessment",
                    "Single-variable impact simulator",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
                  onClick={() => handleCheckout("pack12")}
                  disabled={loading === "pack12"}
                  data-testid="button-get-pack12"
                >
                  {loading === "pack12" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Practice Pack"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-brand-amber border-2 shadow-xl relative flex flex-col overflow-hidden" data-testid="card-tier-programme16">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-amber"></div>
              <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-4 py-1.5 rounded-bl-lg font-bold text-sm shadow-sm">
                RECOMMENDED
              </div>

              <CardHeader className="pt-8 pb-4">
                <p className="text-sm font-semibold text-brand-amber uppercase tracking-wider mb-1">Structured Programme</p>
                <CardTitle className="text-2xl font-serif">A complete preparation pathway</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2">
                  <span className="text-5xl font-bold text-primary">£249</span>
                  <span className="text-muted-foreground font-medium"> one-time</span>
                </div>
                <p className="text-sm text-brand-primary/70 mb-4 font-medium bg-blue-50 px-3 py-1.5 rounded inline-block">Launch price (future price £349)</p>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  A 16-week roadmap with expert guidance, milestone tracking, and weekly plans. Know exactly what to do each week.
                </p>
                <ul className="space-y-3">
                  {[
                    "16-week structured roadmap (4 phases)",
                    "4 milestone diagnostics with tracking",
                    "Multi-variable impact simulator",
                    "Gap velocity analytics",
                    "Forecast stability metrics",
                    "Weekly readiness plan (auto-generated)",
                    "Programme completion summary",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                      <span className="text-primary text-sm font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold shadow-md"
                  onClick={() => handleCheckout("programme16")}
                  disabled={loading === "programme16"}
                  data-testid="button-get-programme16"
                >
                  {loading === "programme16" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Structured Programme"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/30">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-6" data-testid="text-trajectory-title">See the difference targeted preparation makes</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            When practice is guided by data, scores improve faster. Here's what a typical trajectory looks like.
          </p>

          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200 max-w-xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div className="text-left">
                <p className="text-sm text-muted-foreground font-medium mb-1">Week 1 — Baseline</p>
                <p className="text-4xl font-bold text-slate-400">108</p>
              </div>
              <div className="flex-1 mx-6 relative h-16">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 50 Q 50 45 100 30 T 200 5" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="0" cy="50" r="4" fill="#94a3b8" />
                  <circle cx="67" cy="38" r="3" fill="#64748b" />
                  <circle cx="133" cy="22" r="3" fill="#4ade80" />
                  <circle cx="200" cy="5" r="4" fill="#22c55e" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-medium mb-1">Week 12 — Forecast</p>
                <p className="text-4xl font-bold text-brand-green">124</p>
              </div>
            </div>
            <div className="h-px bg-slate-200 mb-4"></div>
            <p className="text-sm text-muted-foreground">
              121 is the Bucks benchmark. Targeted, diagnostic-led preparation helps your child cross that threshold with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/30" id="demos">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-demos-title">See what you'll get</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click each preview to see real examples of the analytics, results, and progress tracking your child will receive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <DemoCard
              title="Results Dashboard"
              description="Forecast gauge, section breakdown, and pace analysis from a real diagnostic"
              testId="demo-results"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-slate-200" strokeWidth="10" fill="none" />
                      <circle cx="50" cy="50" r="40" className="stroke-amber-400" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (114 / 141))} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">114</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Forecast</span>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mx-auto">
                  Borderline (Amber)
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Verbal Reasoning", score: 72, color: "bg-amber-500" },
                    { name: "Non-Verbal Reasoning", score: 65, color: "bg-red-500" },
                    { name: "Mathematics", score: 78, color: "bg-amber-500" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{s.name}</span>
                        <span className="font-bold text-primary">{s.score}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t border-slate-100">
                  7 point gap to 121 standard
                </div>
              </div>
            </DemoCard>

            <DemoCard
              title="Analytics Dashboard"
              description="Readiness metrics, pace discipline, fatigue indicators, and priorities"
              testId="demo-analytics"
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-primary">78</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Readiness</div>
                    <div className="text-[10px] font-bold text-amber-700">Amber</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-primary">82</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Pace Discipline</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-primary">0.72</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Weighted Accuracy</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-primary">68</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Stability</div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2">
                  <div className="text-[10px] font-bold text-primary mb-1.5">Top 3 Priorities</div>
                  {["NVR: Spatial sequences", "VR: Letter patterns", "Maths: Ratio problems"].map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-amber"></div>
                      {p}
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2">
                  <div className="text-[10px] font-bold text-primary mb-1">Fatigue Analysis</div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-green-50 rounded p-1 text-center">
                      <div className="text-[10px] font-bold text-green-700">82%</div>
                      <div className="text-[8px] text-muted-foreground">First third</div>
                    </div>
                    <div className="flex-1 bg-amber-50 rounded p-1 text-center">
                      <div className="text-[10px] font-bold text-amber-700">71%</div>
                      <div className="text-[8px] text-muted-foreground">Last third</div>
                    </div>
                  </div>
                </div>
              </div>
            </DemoCard>

            <DemoCard
              title="Progress Tracking"
              description="Score trajectory, gap velocity, and forecast stability over time"
              testId="demo-progress"
            >
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <div className="text-[10px] font-bold text-primary mb-2">Score Trajectory</div>
                  <svg viewBox="0 0 200 80" className="w-full h-20">
                    <line x1="0" y1="25" x2="200" y2="25" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
                    <text x="202" y="28" fontSize="7" fill="#94a3b8">121</text>
                    <path d="M 10 60 L 60 48 L 120 35 L 180 18" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="10" cy="60" r="3" fill="#94a3b8" />
                    <circle cx="60" cy="48" r="3" fill="#64748b" />
                    <circle cx="120" cy="35" r="3" fill="#3b82f6" />
                    <circle cx="180" cy="18" r="3" fill="#22c55e" />
                    <text x="5" y="72" fontSize="7" fill="#94a3b8">105</text>
                    <text x="55" y="60" fontSize="7" fill="#94a3b8">112</text>
                    <text x="115" y="47" fontSize="7" fill="#94a3b8">118</text>
                    <text x="172" y="14" fontSize="7" fill="#22c55e">124</text>
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <div className="text-xs font-bold text-green-700">+19</div>
                    <div className="text-[10px] text-muted-foreground">Points gained</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                    <div className="text-xs font-bold text-blue-700">Stable</div>
                    <div className="text-[10px] text-muted-foreground">Forecast</div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2">
                  <div className="text-[10px] font-bold text-primary mb-1">Gap Velocity</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500">16 pt gap</div>
                    <ArrowRight className="h-3 w-3 text-green-600" />
                    <div className="text-xs font-bold text-green-700">0 pt gap</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Closing at 4 points per attempt</div>
                </div>
              </div>
            </DemoCard>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground italic">
              Example data shown above — your child's real data will populate after their diagnostic.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-b border-border/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-testimonials-title">What parents say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border/60 shadow-sm" data-testid={`card-testimonial-${i}`}>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-brand-amber/40 mb-4" />
                  <p className="text-slate-700 leading-relaxed mb-6 text-sm italic">"{t.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-brand-amber text-brand-amber" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">{t.attribution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/30">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-faq-title">Common questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl bg-white overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`button-faq-${i}`}
                >
                  <span className="font-semibold text-primary pr-4">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-primary text-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4" data-testid="text-final-cta-title">
            The 11+ doesn't wait. Start today.
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Give your child the preparation advantage — with a clear diagnosis, targeted practice, and measurable progress every week.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-brand-amber text-amber-950 hover:bg-amber-400 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/20 border-none"
              onClick={() => handleCheckout("programme16")}
              disabled={loading === "programme16"}
              data-testid="button-cta-programme"
            >
              {loading === "programme16" ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Structured Programme — £249 <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md"
              onClick={() => handleCheckout("pack12")}
              disabled={loading === "pack12"}
              data-testid="button-cta-pack"
            >
              {loading === "pack12" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Practice Pack — £99"}
            </Button>
          </div>

          <p className="text-xs text-white/40">
            One-time payment · No recurring charges · Instant access
          </p>
        </div>
      </section>

      <section className="py-12 border-t border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Secure payment via Stripe
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" /> GL-style aligned diagnostics
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Independent assessment
            </span>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground/60">
            <p>Not affiliated with GL Assessment or Buckinghamshire Council</p>
            <p className="mt-1">Forecasts are indicative — <Link href="/how-forecast-works" className="underline hover:text-primary">how our forecast works</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Target, TrendingUp, BarChart3, Eye, Shield, HelpCircle, ChevronDown, AlertTriangle, BookOpen, Clock, Sparkles, Lock } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../lib/queryClient";

function DemoCard({ title, description, testId, children, tierLabel }: { title: string; description: string; testId: string; children: React.ReactNode; tierLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden" data-testid={testId}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-serif">{title}</CardTitle>
          {tierLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-amber/10 text-brand-amber border border-brand-amber/20 shrink-0" data-testid={`badge-${testId}-tier`}>
              <Lock className="h-3 w-3" />
              {tierLabel}
            </span>
          )}
        </div>
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
    const autoTier = params.get("autoCheckout");
    if (autoTier && user && !autoCheckoutTriggered.current) {
      autoCheckoutTriggered.current = true;
      handleCheckout(autoTier);
    }
  }, [user, search]);

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    try {
      const endpoint = user ? "/api/checkout" : "/api/guest/checkout";
      const res = await apiRequest("POST", endpoint, { tier });
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
      a: "Absolutely. The programme adapts to wherever your child is. Whether you have months or weeks until the test, the diagnostic-led approach ensures every session counts. Earlier is better, but it's never too late to start with clarity."
    },
    {
      q: "What happens after I pay?",
      a: "You get immediate access to everything in your plan. Start with a full diagnostic to establish your child's baseline, then follow the targeted practice recommendations. For the Young Scholar Programme, your roadmap is generated automatically based on your child's results."
    }
  ];


  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Buckinghamshire 11+ Preparation Plans & Pricing | 11+ Standard"
        description="Choose from Free diagnostic, Practice Platform (£99, 12 weeks) or Young Scholar Programme (£249). GL-style timed assessments, readiness forecasting, and targeted drill practice for the Bucks 11+."
        canonicalPath="/pricing"
      />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }}>
        <div className="absolute inset-0 z-0 hero-texture"></div>
        <div className="absolute inset-0 z-0 hero-vignette"></div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 100%)' }}></div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.12] font-serif mb-6" data-testid="text-pricing-hero-title">
            Give your child the clarity they deserve ahead of the Bucks 11+
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10">
            Know exactly where they stand. See precisely what to work on. Track real progress — not just effort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button size="lg" className="h-14 px-8 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-hero-programme">
              <a href="#tiers">View Plans &amp; Pricing <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/[0.03] border-white/15 text-white/80 hover:bg-white/[0.06] hover:text-white" asChild data-testid="button-hero-diagnostic">
              <Link href="/free-diagnostic">Try Free Diagnostic First</Link>
            </Button>
          </div>
          <p className="text-[11px] text-white/25">
            Independent readiness assessment · Not affiliated with GL Assessment or Buckinghamshire Council
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-10" data-testid="text-pricing-dual-path">
            How Would You Like to Begin?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col" data-testid="card-pricing-path-diagnostic">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">Start With a Diagnostic</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                Take an 8-minute timed assessment to understand current readiness, pace and performance profile before committing.
              </p>
              <Button variant="outline" className="w-full h-12 text-sm font-semibold" asChild data-testid="button-pricing-path-diagnostic">
                <Link href="/free-diagnostic">Start Free Diagnostic</Link>
              </Button>
            </div>
            <div className="rounded-2xl border-2 border-primary/20 bg-slate-50 p-7 sm:p-8 flex flex-col" data-testid="card-pricing-path-programme">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">Begin the Young Scholar Programme</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                For families who want a complete preparation plan aligned to the Bucks 11+. Includes diagnostics, targeted drills and milestone tracking.
              </p>
              <Button className="w-full h-12 text-sm font-semibold bg-primary text-primary-foreground" asChild data-testid="button-pricing-path-programme">
                <a href="#tiers">View Programme &amp; Enrol</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-b border-border/30" id="tiers">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-tiers-title">What your child gets</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the level of support that's right for your family.
            </p>
          </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                      "1 timed mini diagnostic (12 questions)",
                      "Basic readiness forecast vs 121",
                      "Top focus area revealed",
                      "1 sample practice drill",
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

            <Card className="border-border/60 shadow-sm flex flex-col hover:border-primary/30 transition-colors" data-testid="card-tier-early-learner">
              <CardHeader className="pb-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Early Learner</p>
                <CardTitle className="text-2xl font-serif">Build strong foundations</CardTitle>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tight mt-1">Target: Year 4 & 5</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2">
                  <span className="text-5xl font-bold text-primary">£49</span>
                  <span className="text-muted-foreground font-medium"> one-time</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Unlimited access</p>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Perfect for younger learners building core skills before formal 11+ preparation. No exam pressure — just confident, steady progress.
                </p>
                <ul className="space-y-3">
                  {[
                    "Foundation-level practice questions",
                    "Readiness percentage tracking",
                    "Exploring → Developing → Ready pathway",
                    "Encouraging, age-appropriate interface",
                    "Progress at your own pace",
                    "Unlimited access",
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
                  variant="outline"
                  className="w-full h-12 text-lg"
                  onClick={() => handleCheckout("early_learner")}
                  disabled={loading === "early_learner"}
                  data-testid="button-get-early-learner"
                >
                  {loading === "early_learner" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Early Learner"}
                </Button>
              </CardFooter>
            </Card>

              <Card className="border-brand-amber border-2 shadow-xl relative flex flex-col overflow-hidden md:col-span-2" data-testid="card-tier-programme16">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-amber"></div>
                <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-4 py-1.5 rounded-bl-lg font-bold text-sm shadow-sm">
                  RECOMMENDED
                </div>

                <CardHeader className="pt-8 pb-4">
                  <p className="text-sm font-semibold text-brand-amber uppercase tracking-wider mb-1">Young Scholar Programme</p>
                  <CardTitle className="text-2xl font-serif">A complete preparation pathway</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-2">
                        <span className="text-5xl font-bold text-primary">£249</span>
                        <span className="text-muted-foreground font-medium"> one-time</span>
                      </div>
                      <p className="text-sm text-brand-primary/70 mb-4 font-medium bg-blue-50 px-3 py-1.5 rounded inline-block">Launch price (future price £349)</p>
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        A roadmap with expert guidance, milestone tracking, and weekly plans. Know exactly what to do each week.
                      </p>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold shadow-md"
                        onClick={() => handleCheckout("programme16")}
                        disabled={loading === "programme16"}
                        data-testid="button-get-programme16"
                      >
                        {loading === "programme16" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Young Scholar Programme"}
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-4 font-medium">Included in the programme:</p>
                      <ul className="space-y-3">
                        {[
                          "Everything in Practice Platform",
                          "All 17 Hard challenge drills unlocked",
                          "Mock exam simulation (50 questions, timed)",
                          "Guided preparation roadmap",
                          "4 milestone diagnostics with auto-tracking",
                          "Weekly personalised task plans",
                          "Premium Parent Analytics dashboard",
                          "Unlimited access",
                        ].map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                            <span className="text-primary text-sm font-semibold">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-4" data-testid="text-family-pricing-title">Family Plans</h3>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Preparing multiple children? Family plans include up to 3 child profiles, each with their own independent progress, diagnostics, and practice data.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/60 shadow-sm flex flex-col" data-testid="card-tier-pack12-family">
                <CardHeader className="pb-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Practice Platform — Family</p>
                  <CardTitle className="text-xl font-serif">Up to 3 children</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">£149</span>
                    <span className="text-muted-foreground font-medium"> one-time</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">12 weeks of access for the whole family</p>
                  <ul className="space-y-2">
                    {[
                      "Everything in Practice Platform",
                      "Up to 3 child profiles",
                      "Independent progress tracking per child",
                      "Child switcher in navbar",
                    ].map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                        <span className="text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                    onClick={() => handleCheckout("pack12_family")}
                    disabled={loading === "pack12_family"}
                    data-testid="button-get-pack12-family"
                  >
                    {loading === "pack12_family" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Family Practice Platform"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-brand-amber border-2 shadow-md flex flex-col relative overflow-hidden" data-testid="card-tier-programme16-family">
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-amber"></div>
                <CardHeader className="pb-4">
                  <p className="text-sm font-semibold text-brand-amber uppercase tracking-wider mb-1">Young Scholar Programme — Family</p>
                  <CardTitle className="text-xl font-serif">The complete family pathway</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">£349</span>
                    <span className="text-muted-foreground font-medium"> one-time</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Unlimited access for the whole family</p>
                  <ul className="space-y-2">
                    {[
                      "Everything in Young Scholar Programme",
                      "Up to 3 child profiles",
                      "Independent roadmaps per child",
                      "Test Day Simulator for each child",
                      "Family analytics dashboard",
                    ].map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                        <span className="text-primary font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-bold"
                    onClick={() => handleCheckout("programme16_family")}
                    disabled={loading === "programme16_family"}
                    data-testid="button-get-programme16-family"
                  >
                    {loading === "programme16_family" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Family Young Scholar Programme"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto" data-testid="comparison-table">
            <h3 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-8">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 w-[40%]">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Free</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Practice Platform</th>
                    <th className="text-center py-3 px-4 font-bold text-brand-amber">Programme</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Mini diagnostic (12 questions)", free: true, pack: true, prog: true },
                    { feature: "Basic readiness forecast", free: true, pack: true, prog: true },
                    { feature: "Top focus area revealed", free: true, pack: true, prog: true },
                    { feature: "1 sample practice drill", free: true, pack: true, prog: true },
                    { feature: "1,000+ practice questions", free: false, pack: true, prog: true },
                    { feature: "Easy & Medium drills (19 sections)", free: false, pack: true, prog: true },
                    { feature: "Hard challenge drills", free: false, pack: "6 sections", prog: "All 17" },
                    { feature: "Badge-based Accomplishments", free: false, pack: true, prog: true },
                    { feature: "Full timed diagnostics (40 questions)", free: false, pack: true, prog: true },
                    { feature: "Practice papers (Quick & Full)", free: false, pack: true, prog: true },
                    { feature: "PDF reports & report archive", free: false, pack: true, prog: true },
                    { feature: "Impact simulator & progress tracking", free: false, pack: true, prog: true },
                    { feature: "Mock exam simulation (50 questions)", free: false, pack: false, prog: true },
                    { feature: "16-week guided roadmap", free: false, pack: false, prog: true },
                    { feature: "4 milestone diagnostics with auto-tracking", free: false, pack: false, prog: true },
                    { feature: "Weekly personalised task plans", free: false, pack: false, prog: true },
                    { feature: "Premium Parent Analytics dashboard", free: false, pack: false, prog: true },
                    { feature: "Gap velocity & forecast stability metrics", free: false, pack: false, prog: true },
                    { feature: "Fatigue & pressure profiling", free: false, pack: false, prog: true },
                    { feature: "Access duration", free: "1 use", pack: "12 weeks", prog: "Unlimited" },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${i >= 12 ? "bg-amber-50/30" : ""}`} data-testid={`comparison-row-${i}`}>
                      <td className="py-3 px-4 text-slate-700 font-medium">{row.feature}</td>
                      {["free", "pack", "prog"].map((tier) => {
                        const val = row[tier as keyof typeof row];
                        return (
                          <td key={tier} className="text-center py-3 px-4">
                            {val === true ? (
                              <CheckCircle2 className="h-5 w-5 text-brand-green mx-auto" />
                            ) : val === false ? (
                              <XCircle className="h-5 w-5 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-sm font-semibold text-slate-700">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white border-b border-border/30" id="demos">
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
              tierLabel="Programme only"
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
              tierLabel="Programme only"
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
              <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
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

      <section className="py-20 md:py-28 bg-white border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-trust-title">Built on Transparent Principles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe parents deserve honesty about what a diagnostic system can and cannot do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid="trust-methodology">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm mb-1.5">Open Methodology</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Our forecast model, scoring logic and GL-style alignment are fully documented. No black boxes.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid="trust-independent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm mb-1.5">Fully Independent</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Not affiliated with GL Assessment, any school, or Buckinghamshire Council. Our only obligation is to accuracy.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid="trust-no-guarantees">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm mb-1.5">No Outcome Guarantees</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">We provide structured diagnostics and targeted practice. We never guarantee scores, places, or outcomes.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid="trust-data">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm mb-1.5">Try Before You Commit</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">The free diagnostic gives you a genuine baseline with no account required. See the quality of the analysis before deciding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-b border-border/30">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3" data-testid="text-mid-cta-title">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Choose a plan above, or try the free diagnostic to see where your child stands first.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-13 px-8 text-base bg-brand-amber text-white hover:bg-brand-amber/90 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-mid-cta-tiers">
              <a href="#tiers">View Plans &amp; Pricing <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base w-full sm:w-auto" asChild data-testid="button-mid-cta-diagnostic">
              <Link href="/free-diagnostic">Try Free Diagnostic</Link>
            </Button>
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
              {loading === "programme16" ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Young Scholar Programme — £249 <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md"
              onClick={() => handleCheckout("pack12")}
              disabled={loading === "pack12"}
              data-testid="button-cta-pack"
            >
              {loading === "pack12" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Practice Platform — £99"}
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

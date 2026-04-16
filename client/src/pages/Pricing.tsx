import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Target, TrendingUp, BarChart3, Eye, Shield, HelpCircle, ChevronDown, AlertTriangle, BookOpen, Clock, Sparkles, Lock, Zap, SlidersHorizontal, Star } from "lucide-react";
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
            <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider pointer-events-none">
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
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const search = useSearch();
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const autoCheckoutTriggered = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const autoTier = params.get("autoCheckout");
    if (autoTier && !autoCheckoutTriggered.current && !isLoading) {
      autoCheckoutTriggered.current = true;
      handleCheckout(autoTier);
    }
  }, [user, search, isLoading]);

  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    setError(null);
    try {
      const endpoint = user ? "/api/checkout" : "/api/guest/checkout";
      const res = await apiRequest("POST", endpoint, { tier });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || "Could not start checkout. Please try again.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleUpgrade = async (targetTier: string) => {
    setLoading("upgrade");
    try {
      const res = await apiRequest("POST", "/api/checkout/upgrade", { targetTier });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleBillingPortal = async () => {
    setLoading("portal");
    try {
      const res = await apiRequest("POST", "/api/stripe/customer-portal", {});
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Billing portal error:", err);
    } finally {
      setLoading(null);
    }
  };

  const tierRank: Record<string, number> = {
    free: 0,
    early_learner: 1,
    pack12: 1,
    pack12_family: 1,
    pack_monthly: 1,
    pack_plus: 1,
    pack_annual: 1,
    programme8: 1,
    programme12: 1,
    programme16: 1,
    programme16_family: 1,
    programme24_plus: 1,
  };
  const currentTier = user?.subscriptionTier || "free";
  const currentRank = tierRank[currentTier] ?? 0;
  const hasPaidPlan = user && currentRank > 0;
  // On the new model all paid tiers are equivalent; only monthly pack_plus can upgrade to annual
  const isTopTier = hasPaidPlan && currentTier !== "pack_plus";

  const upgradeOptions: Record<string, string[]> = {
    pack_plus: ["pack_annual"],
  };
  const availableUpgrades = upgradeOptions[currentTier] || [];
  const isUpgradeEligible = user && availableUpgrades.length > 0;

  const faqs = [
    {
      q: "What's the difference between Monthly and Annual?",
      a: "Both plans give you identical access to everything on the platform — 1,500+ questions, full readiness checks, all 17 Hard drills, mock exam simulations, PDF reports, progress tracking, and premium analytics. Annual is simply billed once a year (£349) rather than monthly (£35/mo). Choosing Annual saves you £71 compared to 12 months of monthly billing."
    },
    {
      q: "Can I cancel my monthly subscription at any time?",
      a: "Yes — cancel any time, no questions asked. Your access continues until the end of the billing period. There are no long-term commitments on the monthly plan."
    },
    {
      q: "Is this affiliated with GL Assessment?",
      a: "No. Bucks 11 Plus Tests is an independent readiness assessment service. Our readiness checks are aligned to GL-style reasoning families used in the Buckinghamshire Secondary Transfer Test, but we are not affiliated with GL Assessment or Buckinghamshire Council."
    },
    {
      q: "How is this different from Bond books or generic workbooks?",
      a: "Workbooks give every child the same content. We diagnose your child's specific gaps, then focus practice only on the areas that will move their score the most. Every minute of preparation is targeted, not generic."
    },
    {
      q: "What if my child is already scoring well?",
      a: "Even strong students have hidden weaknesses. Our readiness checks identify subtle gaps in pacing, accuracy under time pressure, and specific reasoning sub-types — things that generic practice won't surface. Knowing your child's exact profile is valuable at every level."
    },
    {
      q: "Can I start mid-year?",
      a: "Absolutely. The platform adapts to wherever your child is. Whether you have months or weeks until the test, the readiness-led approach ensures every session counts. Earlier is better, but it's never too late to start with clarity."
    },
    {
      q: "What happens after I pay?",
      a: "You get immediate access to everything in your plan. Start with a full readiness check to establish your child's baseline, then follow the targeted practice recommendations. Your preparation roadmap and milestone tracking activate automatically based on your child's results."
    }
  ];


  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Bucks 11 Plus Preparation Plans & Pricing (2026) | Bucks 11 Plus Tests"
        description="Free readiness check plus Bucks Plus Edge — £35/month or £349/year. Full access to 1,500+ targeted questions, readiness checks, mock exams and progress tracking for Bucks 11 Plus preparation."
        canonicalPath="/pricing"
      />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }}>
        <div className="absolute inset-0 z-0 hero-texture"></div>
        <div className="absolute inset-0 z-0 hero-vignette"></div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 100%)' }}></div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          {hasPaidPlan ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.12] font-serif mb-6" data-testid="text-pricing-hero-title">
                {isTopTier ? "You have full Bucks Plus Edge access" : "Upgrade to Annual and save £71"}
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10">
                {isTopTier
                  ? "You have complete access to everything on the platform. Head to your dashboard to continue your child's preparation."
                  : "Switch from monthly to annual billing and lock in 12 months of full access for just £349."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Button size="lg" className="h-14 px-8 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-hero-dashboard">
                  <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                {!isTopTier && (
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/[0.03] border-white/15 text-white/80 hover:bg-white/[0.06] hover:text-white" asChild data-testid="button-hero-upgrade">
                    <a href="#upgrade">Switch to Annual — £349</a>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
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
                  <Link href="/free-diagnostic">Try Free Readiness Check First</Link>
                </Button>
              </div>
            </>
          )}
          <p className="text-[11px] text-white/25">
            Independent readiness assessment · Not affiliated with GL Assessment or Buckinghamshire Council
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-b border-border/30" id="tiers">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-tiers-title">
              {hasPaidPlan ? (isTopTier ? "Your plan" : "Your plan & upgrade options") : "What your child gets"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {hasPaidPlan
                ? (isTopTier ? "You have full access to the most comprehensive preparation package." : "You're making great progress. Here's what you have and what's available next.")
                : "Choose the level of support that's right for your family."}
            </p>
          </div>

          {hasPaidPlan && (
            <div className="max-w-3xl mx-auto mb-12">
              <Card className="border-brand-green/30 bg-green-50/50 shadow-sm" data-testid="card-current-plan">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-brand-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-primary font-serif">
                          {currentTier === "pack_annual" ? "Bucks Plus Edge — Annual" : "Bucks Plus Edge"}
                        </h3>
                        <Badge className="bg-brand-green/10 text-brand-green border-brand-green/20 hover:bg-brand-green/10">Active</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {currentTier === "pack_annual"
                          ? "12 months of full platform access — all 1,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics."
                          : "Full platform access billed monthly — all 1,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics. Cancel any time."}
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!hasPaidPlan && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 rounded-2xl bg-slate-100/80 border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="card-tier-free">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">Free Readiness Check</p>
                    <p className="text-xs text-slate-500">12-question timed readiness check — no sign-up needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-2xl font-bold text-primary">£0</span>
                    <p className="text-[11px] text-slate-400">Always free</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 px-5 text-sm shrink-0" asChild data-testid="button-get-free">
                    <Link href="/free-diagnostic">Start Free Readiness Check</Link>
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-primary border-2 shadow-xl relative flex flex-col overflow-hidden" data-testid="card-tier-pack-plus">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
                  <CardHeader className="pb-3 pt-6">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Bucks Plus Edge</p>
                    <CardTitle className="text-2xl font-serif">Monthly</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-1">
                      <span className="text-5xl font-bold text-primary">£35</span>
                      <span className="text-muted-foreground font-medium text-sm"> / month</span>
                    </div>
                    <p className="text-xs text-brand-amber font-semibold mb-1">That's just £1.17/day</p>
                    <p className="text-xs text-slate-500 mb-5">Cancel any time · No lock-in</p>
                    <ul className="space-y-2.5">
                      {[
                        "1,500+ GL-style questions (VR, NVR, Maths, Comprehension)",
                        "Full-length practice papers (50 questions)",
                        "Full GL-style mock exams (40 questions)",
                        "Full timed readiness checks",
                        "All 19 Easy & Medium drill sections",
                        "All 17 Hard challenge drills",
                        "PDF readiness reports & report archive",
                        "Progress tracking & impact simulator",
                        "Premium Parent Analytics dashboard",
                        "Guided preparation roadmap",
                        "Milestone readiness checks with auto-tracking",
                      ].map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold text-base"
                      onClick={() => handleCheckout("pack_plus")}
                      disabled={loading === "pack_plus"}
                      data-testid="button-get-pack-plus"
                    >
                      {loading === "pack_plus" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Bucks Plus Edge — £35/mo"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-brand-amber border-2 shadow-xl relative flex flex-col overflow-hidden bg-amber-50/20" data-testid="card-tier-pack-annual">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-amber"></div>
                  <div className="absolute top-3 right-3 bg-brand-amber text-amber-950 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow pointer-events-none">
                    SAVE £71
                  </div>
                  <CardHeader className="pb-3 pt-6">
                    <p className="text-xs font-bold text-brand-amber uppercase tracking-wider mb-1">Bucks Plus Edge — Annual</p>
                    <CardTitle className="text-2xl font-serif">Annual</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-1">
                      <span className="text-5xl font-bold text-primary">£349</span>
                      <span className="text-muted-foreground font-medium text-sm"> / year</span>
                    </div>
                    <p className="text-xs text-brand-amber font-semibold mb-1">That's just 96p/day</p>
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <p className="text-xs text-slate-500">Equiv. £29.08/mo</p>
                      <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                        Save £71 vs monthly
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {[
                        "Everything in Monthly — identical full access",
                        "1,500+ GL-style questions (VR, NVR, Maths, Comprehension)",
                        "Full-length practice papers (50 questions)",
                        "Full GL-style mock exams (40 questions)",
                        "Full timed readiness checks",
                        "All 19 Easy & Medium drill sections",
                        "All 17 Hard challenge drills",
                        "PDF readiness reports & report archive",
                        "Progress tracking & impact simulator",
                        "Premium Parent Analytics dashboard",
                        "Guided preparation roadmap",
                        "Milestone readiness checks with auto-tracking",
                      ].map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 0 ? 'text-brand-amber' : 'text-brand-green'}`} />
                          <span className={`text-sm ${i === 0 ? 'font-bold text-primary' : 'text-slate-700'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-brand-amber text-amber-950 hover:bg-brand-amber/90 h-12 font-bold text-base shadow-md"
                      onClick={() => handleCheckout("pack_annual")}
                      disabled={loading === "pack_annual"}
                      data-testid="button-get-pack-annual"
                    >
                      {loading === "pack_annual" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Annual — £349/year"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-12" data-testid="comparison-table">
                <h3 className="text-xl font-bold text-primary font-serif text-center mb-6">What's included in full access</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 w-[55%]">Feature</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Free</th>
                        <th className="text-center py-3 px-4 font-bold text-primary">Bucks Plus Edge<br/><span className="text-xs font-normal text-slate-400">£35/mo or £349/yr</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Quick readiness check (12 questions)", free: true, paid: true },
                        { feature: "Readiness forecast vs 121 benchmark", free: true, paid: true },
                        { feature: "Top focus area revealed", free: true, paid: true },
                        { feature: "1,500+ VR, NVR, Maths & Comprehension questions", free: false, paid: true },
                        { feature: "Full-length practice papers (50 questions)", free: false, paid: true },
                        { feature: "Full GL-style mock exams (40 questions)", free: false, paid: true },
                        { feature: "Full timed readiness checks", free: false, paid: true },
                        { feature: "All 19 Easy & Medium drill sections", free: false, paid: true },
                        { feature: "All 17 Hard challenge drills", free: false, paid: true },
                        { feature: "PDF reports & report archive", free: false, paid: true },
                        { feature: "Impact simulator & progress tracking", free: false, paid: true },
                        { feature: "Milestone readiness checks with auto-tracking", free: false, paid: true },
                        { feature: "Guided preparation roadmap", free: false, paid: true },
                        { feature: "Premium Parent Analytics dashboard", free: false, paid: true },
                        { feature: "Badge-based Accomplishments", free: false, paid: true },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-100" data-testid={`comparison-row-${i}`}>
                          <td className="py-3 px-4 text-slate-700 font-medium">{row.feature}</td>
                          <td className="text-center py-3 px-4">
                            {row.free ? <CheckCircle2 className="h-5 w-5 text-brand-green mx-auto" /> : <XCircle className="h-5 w-5 text-slate-300 mx-auto" />}
                          </td>
                          <td className="text-center py-3 px-4">
                            {row.paid ? <CheckCircle2 className="h-5 w-5 text-brand-green mx-auto" /> : <XCircle className="h-5 w-5 text-slate-300 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white border-b border-border/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">What the Readiness Check Reveals — In Detail</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our 8-minute readiness check isn't just a score. It's a deep-dive into your child's current performance profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Readiness Forecast</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A proprietary projection against the 121 Buckinghamshire benchmark. Know exactly where they sit today on the "Likelihood Scale" (Developing → Emerging → Strong).
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-brand-amber/10 rounded-2xl flex items-center justify-center mb-6">
                <SlidersHorizontal className="h-8 w-8 text-brand-amber" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Pace &amp; Pressure Profiling</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Identify if errors are caused by lack of knowledge or time pressure. We track response velocity per question to see where they stall.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Gap Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instant breakdown across Verbal, Non-Verbal, Maths, and Comprehension. We reveal the single highest-impact focus area to start working on immediately.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-brand-amber text-amber-950 hover:bg-brand-amber mb-4 border-none font-bold">SAMPLE REPORT DATA</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 font-serif">Detailed PDF Insights</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Every readiness check generates a professional report suitable for sharing with tutors. It includes question-by-question analysis, section weighting, and a personalized 14-day improvement plan.
                </p>
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold" asChild>
                  <Link href="/free-diagnostic">Start My Free Readiness Check</Link>
                </Button>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-2 w-24 bg-white/20 rounded"></div>
                  <div className="h-4 w-48 bg-white/40 rounded"></div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-white/10 rounded-xl flex flex-col items-center justify-center">
                      <div className="text-brand-amber font-bold text-2xl">108</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Initial Forecast</div>
                    </div>
                    <div className="h-24 bg-white/10 rounded-xl flex flex-col items-center justify-center">
                      <div className="text-green-400 font-bold text-2xl">72%</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Accuracy</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-xs text-white/60 mb-2 font-medium">Top Priority:</div>
                    <div className="text-sm font-bold text-brand-amber italic">"Non-Verbal Reasoning: Matrices &amp; Analogies"</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 bg-brand-amber/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {!hasPaidPlan && (
        <section className="py-14 md:py-20 bg-white border-b border-border/30">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif text-center mb-10" data-testid="text-pricing-dual-path">
              How Would You Like to Begin?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col" data-testid="card-pricing-path-diagnostic">
                <h3 className="text-xl font-bold text-primary font-serif mb-3">Start With the Free Readiness Check</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                  Take an 8-minute timed assessment to understand current readiness, pace and performance profile — before committing to any plan.
                </p>
                <Button variant="outline" className="w-full h-12 text-sm font-semibold" asChild data-testid="button-pricing-path-diagnostic">
                  <Link href="/free-diagnostic">Start Free Readiness Check</Link>
                </Button>
              </div>
              <div className="rounded-2xl border-2 border-primary/30 bg-primary/[0.03] p-7 sm:p-8 flex flex-col" data-testid="card-pricing-path-subscribe">
                <h3 className="text-xl font-bold text-primary font-serif mb-3">Start with Bucks Plus Edge</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3 flex-1">
                  Full access immediately — 1,500+ questions, readiness checks, mock exams, roadmap and premium analytics. Monthly or annual billing.
                </p>
                <p className="text-xs text-primary/70 font-medium mb-6">
                  £35/month or £349/year (save £71). Cancel monthly any time.
                </p>
                <Button className="w-full h-12 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90" asChild data-testid="button-pricing-path-subscribe">
                  <a href="#tiers">View Plans — from £35/mo</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {isUpgradeEligible && (
        <section className="py-12 bg-gradient-to-br from-amber-50 via-amber-50/60 to-white border-b border-brand-amber/20" id="upgrade">
          <div className="container mx-auto max-w-2xl px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/30 rounded-full px-4 py-1.5 mb-4">
                <TrendingUp className="h-4 w-4 text-brand-amber" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber">Switch to Annual</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">
                Save £71 by switching to Annual
              </h3>
              <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
                You're on monthly billing at £35/month. Switch to Annual for just £349/year — identical access, 12 months locked in.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              {availableUpgrades.includes("pack_annual") && (
                <Card className="border-brand-amber border-2 shadow-lg flex flex-col relative overflow-hidden bg-amber-50/20" data-testid="card-upgrade-pack-annual">
                  <div className="absolute top-0 inset-x-0 h-1 bg-brand-amber"></div>
                  <div className="absolute top-3 right-3 bg-brand-amber text-amber-950 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider pointer-events-none">
                    SAVE £71
                  </div>
                  <CardContent className="p-6 pt-8 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-amber mb-1">Bucks Plus Edge — Annual</p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-primary">£349</span>
                      <span className="text-slate-500 font-medium text-sm mb-1">/ year</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">12 months access · equiv. £29.08/mo</p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full mb-4">
                      Save £71 vs monthly billing
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Identical access to everything in Monthly",
                        "12 months of full platform access",
                        "No further billing for a full year",
                      ].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button className="w-full bg-brand-amber text-amber-950 hover:bg-brand-amber/90 h-11 font-bold" onClick={() => handleUpgrade("pack_annual")} disabled={loading === "upgrade"} data-testid="button-upgrade-pack-annual">
                      {loading === "upgrade" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Switch to Annual — £349"}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}


      {error && (
        <div className="container mx-auto max-w-4xl px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2" data-testid="text-checkout-error">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

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
              description="Forecast gauge, section breakdown with sub-skills, and pace analysis"
              testId="demo-results"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-slate-200" strokeWidth="10" fill="none" />
                      <circle cx="50" cy="50" r="40" className="stroke-amber-400" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (114 / 141))} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">114</span>
                      <span className="text-[8px] text-muted-foreground uppercase font-bold">Est. Score</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Borderline (Amber)
                  </span>
                </div>
                <div className="text-center text-xs font-bold text-primary mb-1">7 points gap to 121</div>
                <div className="space-y-2.5">
                  {[
                    { name: "Verbal Reasoning", score: 72, color: "bg-amber-500", subs: [
                      { name: "Letter Patterns", score: 80 }, { name: "Vocab & Synonyms", score: 60 }, { name: "Code Sequences", score: 75 }
                    ]},
                    { name: "Non-Verbal Reasoning", score: 65, color: "bg-red-500", subs: [
                      { name: "Spatial Sequences", score: 50 }, { name: "Rotation & Reflection", score: 70 }, { name: "Classification", score: 65 }
                    ]},
                    { name: "Mathematics", score: 78, color: "bg-amber-500", subs: [
                      { name: "Arithmetic", score: 85 }, { name: "Fractions & Ratios", score: 65 }, { name: "Data Interpretation", score: 80 }
                    ]},
                    { name: "English Comprehension", score: 70, color: "bg-amber-500", subs: [
                      { name: "Inference & Deduction", score: 62 }, { name: "Authorial Intent", score: 75 }, { name: "Vocabulary in Context", score: 80 }
                    ]},
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{s.name}</span>
                        <span className="font-bold text-primary">{s.score}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mb-1">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }}></div>
                      </div>
                      <div className="ml-3 border-l-2 border-slate-100 pl-2 space-y-0.5">
                        {s.subs.map((sub, j) => (
                          <div key={j} className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 truncate mr-1">{sub.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <div className="w-10 h-1 rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full rounded-full ${sub.score >= 80 ? 'bg-green-500' : sub.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.score}%` }}></div>
                              </div>
                              <span className={`font-bold ${sub.score >= 80 ? 'text-green-600' : sub.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{sub.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
              Example data shown above — your child's real data will populate after their readiness check.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-solution-title">A different approach: readiness-led preparation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instead of guessing, start with clarity. Our readiness checks tell you exactly where the gaps are — then guide practice to close them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Eye, title: "See exactly where gaps are", desc: "Timed readiness checks aligned to GL-style reasoning families pinpoint your child's specific weaknesses" },
              { icon: Target, title: "Practice only what matters", desc: "Targeted drills focus on the highest-impact areas — no wasted effort on topics they've already mastered" },
              { icon: TrendingUp, title: "Track real progress, not just effort", desc: "Forecast scores, pace metrics, and milestone readiness checks show whether preparation is actually working" },
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
              We believe parents deserve honesty about what a readiness check system can and cannot do.
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
                  <p className="text-sm text-slate-600 leading-relaxed">We provide structured readiness checks and targeted practice. We never guarantee scores, places, or outcomes.</p>
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
                  <p className="text-sm text-slate-600 leading-relaxed">The free readiness check gives you a genuine baseline with no account required. See the quality of the analysis before deciding.</p>
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
            Choose a plan above, or try the free readiness check to see where your child stands first.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-13 px-8 text-base bg-brand-amber text-white hover:bg-brand-amber/90 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-mid-cta-tiers">
              <a href="#tiers">View Plans &amp; Pricing <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base w-full sm:w-auto" asChild data-testid="button-mid-cta-diagnostic">
              <Link href="/free-diagnostic">Try Free Readiness Check</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-border/30" data-testid="section-testimonials">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">What Parents Say</span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">Families preparing with confidence</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "We'd been doing Bond books for months with no idea which areas actually needed work. The readiness check showed us exactly where she was losing marks — we dropped the generic practice and focused on NVR sequences. Her scores improved noticeably within three weeks.",
                name: "Sarah M.",
                detail: "Parent of Year 5 child, targeting Beaconsfield High",
              },
              {
                quote: "I was sceptical about yet another online test platform, but this is genuinely different. Instead of more questions to wade through, it told us precisely what to fix and in what order. The parent analytics dashboard is incredibly clear.",
                name: "James T.",
                detail: "Parent of Year 6 child, targeting Royal Latin",
              },
              {
                quote: "Starting with the free readiness check was the best thing we did. It showed my son was much stronger in Maths than we thought, and that Verbal Reasoning was the real gap. We stopped wasting time on the wrong things entirely.",
                name: "Priya K.",
                detail: "Parent of Year 5 child, targeting Dr Challoner's",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm" data-testid={`testimonial-card-${i}`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-brand-amber text-brand-amber" />
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
              onClick={() => handleCheckout("pack_annual")}
              disabled={loading === "pack_annual"}
              data-testid="button-cta-annual"
            >
              {loading === "pack_annual" ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Annual — £349/year <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md"
              onClick={() => handleCheckout("pack_plus")}
              disabled={loading === "pack_plus"}
              data-testid="button-cta-monthly"
            >
              {loading === "pack_plus" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Monthly — £35/mo"}
            </Button>
          </div>

          <p className="text-xs text-white/40">
            Secure payment via Stripe · Cancel monthly plans anytime · Instant access
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
              <Target className="h-4 w-4" /> GL-style aligned readiness checks
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Independent assessment
            </span>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground/60">
            <p>Not affiliated with GL Assessment or Buckinghamshire Council</p>
            <p className="mt-1">Forecasts are indicative — <Link href="/how-it-works" className="underline hover:text-primary">how our forecast works</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}

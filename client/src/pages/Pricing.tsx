import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Target, TrendingUp, BarChart3, Shield, ChevronDown, Sparkles, Lock, Brain, Clock } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { TestCountdownBadge, PrepYearBadge } from "../components/shared/TestCountdownBadge";
import { TutorCostComparison } from "../components/shared/SeoConversionPanel";
import { DashboardPreviewForecast } from "../components/shared/DashboardPreview";
import { useAuth } from "../lib/auth";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../lib/queryClient";

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
  const isTopTier = hasPaidPlan && currentTier !== "pack_plus";

  const upgradeOptions: Record<string, string[]> = {
    pack_plus: ["pack_annual"],
  };
  const availableUpgrades = upgradeOptions[currentTier] || [];
  const isUpgradeEligible = user && availableUpgrades.length > 0;

  const faqs = [
    {
      q: "How does this compare to a private 11+ tutor?",
      a: "A tutor at £40/hr for one session a week works out at roughly £160/month. Bucks Plus Edge is £35/month (or £23.25/month on annual) for unlimited interactive practice — timed mocks, targeted drills, readiness checks, and parent analytics. It is a modern preparation platform, not a substitute for every type of teaching, but many families use it as their main structured prep because children can practise little and often with clear feedback."
    },
    {
      q: "What's the difference between Monthly and Annual?",
      a: "Both plans give you identical access to everything on the platform — 2,500+ questions, full readiness checks, all Hard drills, mock exam simulations, PDF reports, progress tracking, and premium analytics. Annual is simply billed once a year (£279) rather than monthly (£35/mo). Choosing Annual saves you £141 — that's 34% off — compared to 12 months of monthly billing."
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
      q: "How is this different from generic 11+ workbooks?",
      a: "Workbooks give every child the same content. We diagnose your child's specific gaps, then focus practice only on the areas that will move their score the most. Every minute of preparation is targeted, not generic."
    },
    {
      q: "What if my child is already scoring well?",
      a: "Even strong students have hidden weaknesses. Our readiness checks identify subtle gaps in pacing, accuracy under time pressure, and specific reasoning sub-types — things that generic practice won't surface. Knowing your child's exact profile is valuable at every level."
    },
    {
      q: "What happens after I pay?",
      a: "You get immediate access to everything in your plan. Start with a full readiness check to establish your child's baseline, then follow the targeted practice recommendations. Your preparation roadmap and milestone tracking activate automatically based on your child's results."
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Bucks 11 Plus Preparation Plans & Pricing (2026–2027) | Bucks 11 Plus Tests"
        description="Free readiness check plus Bucks Plus Edge — £35/month or £279/year. Structured interactive prep for the September 2027 test and beyond."
        canonicalPath="/pricing"
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-primary pt-12 pb-14 md:pt-16 md:pb-18 border-b border-border/50" data-testid="section-hero">
        <div className="absolute inset-0 z-0 hero-texture" />
        <div className="absolute inset-0 z-0 hero-vignette" />
        <div className="container mx-auto max-w-3xl px-4 relative z-10 text-center">
          {hasPaidPlan ? (
            <>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-5 px-4 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                {currentTier === "pack_annual" ? "Bucks Plus Edge — Annual" : "Bucks Plus Edge"} · Active
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
                {isTopTier ? "Your full access plan is active." : "Your plan is active. Save £141 by switching to Annual."}
              </h1>
              <p className="text-white/60 mb-7">
                {currentTier === "pack_annual"
                  ? "12 months of full platform access — all 2,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics."
                  : "You have full monthly access. Switch to Annual for £279/year and save £141 on your current billing."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="cta" size="lg"  asChild data-testid="button-go-dashboard">
                  <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10 font-semibold" onClick={handleBillingPortal} disabled={loading === "portal"} data-testid="button-billing-portal">
                  {loading === "portal" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Manage Billing
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80 mb-5">Built for the Buckinghamshire 11+</span>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <PrepYearBadge variant="dark" />
                <TestCountdownBadge variant="dark" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
                Full Bucks 11+ preparation.<br className="hidden sm:block" /> Intelligent. Targeted. Proven.
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed">
                Know exactly what to fix. 2,500+ GL-style questions. Parent analytics. Guided programme.
              </p>
              <p className="mx-auto mb-7 max-w-xl rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-100">
                <strong className="text-amber-200">Monthly comparison:</strong> one tutor hour a week at £40 ≈{" "}
                <span className="line-through decoration-2 decoration-red-400/70 text-amber-200/60">£160/month</span>{" "}
                <span className="text-amber-200/70 text-xs">(typical tutor)</span>.
                Our platform from <strong className="text-white">£35/month</strong> or <strong className="text-white">£23.25/month</strong> on annual.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="cta" size="lg"  asChild data-testid="button-view-plans">
                  <a href="#tiers">View Plans <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10 font-semibold" asChild data-testid="button-hero-free">
                  <Link href="/free-diagnostic">Try Free First</Link>
                </Button>
              </div>
              <p className="text-xs text-white/30 mt-5">No account needed for the free check · Cancel monthly anytime</p>
            </>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm" data-testid="text-checkout-error">
              {error}
            </div>
          )}
        </div>
      </section>

      {!hasPaidPlan && (
        <section className="border-b border-border/30 bg-white py-10 md:py-12" data-testid="section-tutor-comparison">
          <div className="container mx-auto max-w-5xl px-4">
            <TutorCostComparison variant="pricing" />
          </div>
        </section>
      )}

      {!hasPaidPlan && (
        <section id="demos" className="scroll-mt-24 border-b border-border/30 bg-slate-50 py-14 md:py-16" data-testid="section-platform-demos">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary/50 mb-3">Platform preview</span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">
                See what Bucks Plus Edge includes
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                Parent analytics, indicative readiness tracking, and section breakdowns — the same views you unlock with monthly or annual access.
              </p>
            </div>
            <DashboardPreviewForecast />
            <p className="text-[10px] text-muted-foreground italic text-center mt-3">
              Illustrative dashboard preview · Indicative readiness, not the official GL Assessment standardised score
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="cta" size="lg" asChild data-testid="button-demos-monthly">
                <Link href="/pricing?autoCheckout=pack_plus">Start monthly — £35/mo</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-12 font-semibold" data-testid="button-demos-annual">
                <Link href="/pricing?autoCheckout=pack_annual">Annual — £279/yr</Link>
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">3-day money-back guarantee · Cancel anytime</p>
          </div>
        </section>
      )}

      {/* ── PLANS ── */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-border/30" id="tiers" data-testid="section-tiers">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-tiers-title">
              {hasPaidPlan ? (isTopTier ? "Your plan" : "Your plan & upgrade options") : "Choose your level of support"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {hasPaidPlan
                ? (isTopTier ? "You have full access to the most comprehensive preparation package." : "You're on monthly. Switch to Annual and save £141.")
                : "Start free — no account needed. Upgrade for full access."}
            </p>
          </div>

          {/* Current plan card for paid users */}
          {hasPaidPlan && (
            <div className="max-w-2xl mx-auto mb-10">
              <Card className="border-brand-green/30 bg-green-50/50 shadow-sm" data-testid="card-current-plan">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-brand-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h3 className="text-lg font-bold text-primary font-serif">
                        {currentTier === "pack_annual" ? "Bucks Plus Edge — Annual" : "Bucks Plus Edge"}
                      </h3>
                      <Badge className="bg-brand-green/10 text-brand-green border-brand-green/20 hover:bg-brand-green/10">Active</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {currentTier === "pack_annual"
                        ? "12 months full access — all 2,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics."
                        : "Monthly full access — all 2,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics."}
                    </p>
                  </div>
                  <Button size="sm" asChild className="shrink-0">
                    <Link href="/app">Dashboard <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {!hasPaidPlan && (
            <div className="max-w-5xl mx-auto">
              {/* Free strip */}
              <div className="mb-6 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" data-testid="card-tier-free">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">Free Readiness Check</p>
                    <p className="text-xs text-slate-500">12-question timed check · No sign-up · Readiness band + forecast score + 3 priorities</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div>
                    <span className="text-2xl font-bold text-primary">£0</span>
                    <p className="text-[11px] text-slate-400">Always free</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 px-5 text-sm" asChild data-testid="button-get-free">
                    <Link href="/free-diagnostic">Start Free Check</Link>
                  </Button>
                </div>
              </div>

              {/* Paid plan cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-primary border-2 shadow-xl relative flex flex-col overflow-hidden" data-testid="card-tier-pack-plus">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />
                  <CardHeader className="pb-3 pt-6">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Bucks Plus Edge</p>
                    <CardTitle className="text-2xl font-serif">Monthly</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-1">
                      <span className="text-5xl font-bold text-primary">£35</span>
                      <span className="text-muted-foreground font-medium text-sm"> / month</span>
                    </div>
                    <p className="text-xs text-brand-amber font-semibold mb-1">
                      vs <span className="line-through decoration-red-500/70 text-slate-400">£160/mo</span> tutor · £35/mo here
                    </p>
                    <p className="text-xs text-slate-500 mb-5">Cancel any time · No lock-in</p>
                    <ul className="space-y-2.5">
                      {[
                        "2,500+ GL-style questions (VR, NVR, Maths, Comprehension)",
                        "Full-length practice papers (50 questions)",
                        "Full GL-style mock exams (40 questions)",
                        "Full timed readiness checks",
                        "All Easy & Medium drill sections",
                        "All Hard challenge drills",
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
                  <CardFooter className="flex-col items-stretch gap-2">
                    <Button
                      variant="cta"
                      className="w-full h-12 text-base shadow-md"
                      onClick={() => handleCheckout("pack_plus")}
                      disabled={loading === "pack_plus"}
                      data-testid="button-get-pack-plus"
                    >
                      {loading === "pack_plus" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Bucks Plus Edge — £35/mo"}
                    </Button>
                    <p className="text-[11px] text-slate-500 text-center">Cancel any time · No lock-in</p>
                  </CardFooter>
                </Card>

                <Card className="border-brand-amber border-2 shadow-xl relative flex flex-col overflow-hidden bg-amber-50/20" data-testid="card-tier-pack-annual">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-amber" />
                  <div className="absolute top-3 right-3 bg-brand-amber text-amber-950 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow pointer-events-none">
                    SAVE £141
                  </div>
                  <CardHeader className="pb-3 pt-6">
                    <p className="text-xs font-bold text-brand-amber uppercase tracking-wider mb-1">Bucks Plus Edge — Annual</p>
                    <CardTitle className="text-2xl font-serif">Annual</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-1">
                      <span className="text-5xl font-bold text-primary">£279</span>
                      <span className="text-muted-foreground font-medium text-sm"> / year</span>
                    </div>
                    <p className="text-xs text-brand-amber font-semibold mb-1">£23.25/mo — unlimited interactive practice</p>
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <p className="text-xs text-slate-500">Equiv. £23.25/mo · 34% off monthly</p>
                      <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                        Save £141 vs monthly
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {[
                        "Everything in Monthly — identical full access",
                        "2,500+ GL-style questions (VR, NVR, Maths, Comprehension)",
                        "Full-length practice papers (50 questions)",
                        "Full GL-style mock exams (40 questions)",
                        "Full timed readiness checks",
                        "All Easy & Medium drill sections",
                        "All Hard challenge drills",
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
                  <CardFooter className="flex-col items-stretch gap-2">
                    <Button
                      className="w-full h-12 text-base shadow-md"
                      onClick={() => handleCheckout("pack_annual")}
                      disabled={loading === "pack_annual"}
                      data-testid="button-get-pack-annual"
                    >
                      {loading === "pack_annual" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Annual — £279/year"}
                    </Button>
                    <p className="text-[11px] text-slate-500 text-center">Cancel any time · No lock-in</p>
                  </CardFooter>
                </Card>
              </div>

              {/* Trust strip — money-back, cancel anytime, tutor frame */}
              <div className="mt-8 grid sm:grid-cols-3 gap-3" data-testid="pricing-trust-strip">
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary text-sm">Cancel any time</p>
                    <p className="text-xs text-slate-500">No lock-in. Cancel from your billing portal in two clicks.</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary text-sm">3-day money-back</p>
                    <p className="text-xs text-slate-500">Not what you expected? Email us within 3 days of your first purchase for a full refund.</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary text-sm">Interactive Bucks 11+ practice</p>
                    <p className="text-xs text-slate-500">Timed mocks, drills, and instant feedback — structured prep children can use between school and homework.</p>
                  </div>
                </div>
              </div>

              {/* Comparison table */}
              <div className="mt-10" data-testid="comparison-table">
                <h3 className="text-lg font-bold text-primary font-serif text-center mb-5">What's included in full access</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 w-[55%]">Feature</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-600">Free</th>
                        <th className="text-center py-3 px-4 font-bold text-primary">Bucks Plus Edge<br /><span className="text-xs font-normal text-slate-400">£35/mo or £279/yr</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Quick readiness check (12 questions)", free: true, paid: true },
                        { feature: "Readiness forecast on the 121 scale", free: true, paid: true },
                        { feature: "Top focus area revealed", free: true, paid: true },
                        { feature: "2,500+ VR, NVR, Maths & Comprehension questions", free: false, paid: true },
                        { feature: "Full-length practice papers (50 questions)", free: false, paid: true },
                        { feature: "Full GL-style mock exams (40 questions)", free: false, paid: true },
                        { feature: "Full timed readiness checks", free: false, paid: true },
                        { feature: "All Easy & Medium drill sections", free: false, paid: true },
                        { feature: "All Hard challenge drills", free: false, paid: true },
                        { feature: "PDF reports & report archive", free: false, paid: true },
                        { feature: "Impact simulator & progress tracking", free: false, paid: true },
                        { feature: "Milestone readiness checks with auto-tracking", free: false, paid: true },
                        { feature: "Guided preparation roadmap", free: false, paid: true },
                        { feature: "Premium Parent Analytics dashboard", free: false, paid: true },
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

      {/* ── UPGRADE (for monthly users only) ── */}
      {isUpgradeEligible && (
        <section className="py-12 bg-amber-50 border-b border-brand-amber/20" id="upgrade" data-testid="section-upgrade">
          <div className="container mx-auto max-w-xl px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/30 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="h-4 w-4 text-brand-amber" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber">Save £141</span>
            </div>
            <h3 className="text-2xl font-bold text-primary font-serif mb-3">Switch to Annual and save £141</h3>
            <p className="text-slate-600 text-sm mb-6">You're on monthly billing at £35/month. Switch to Annual for £279/year — identical access, 12 months locked in, £141 saved (34% off).</p>
            {availableUpgrades.includes("pack_annual") && (
              <Button variant="cta" className="px-8" onClick={() => handleUpgrade("pack_annual")} disabled={loading === "upgrade"} data-testid="button-upgrade-pack-annual">
                {loading === "upgrade" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Switch to Annual — £279"}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* ── FEATURE TILES ── */}
      <section className="py-16 md:py-20 bg-white border-b border-border/30" data-testid="section-features">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Everything you get</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Why this platform is different</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Not just more questions — intelligent, targeted preparation built exclusively for the Buckinghamshire 11+.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Target, color: "bg-amber-100 text-amber-700", title: "2,500+ GL-style questions", desc: "Every question designed for VR, NVR, Maths & Comprehension across all four GL Assessment domains — not generic." },
              { icon: BarChart3, color: "bg-violet-100 text-violet-700", title: "Parent analytics dashboard", desc: "Accuracy, stamina, sub-skill breakdowns and forecast score — all visible in one place. Know exactly where to focus." },
              { icon: Brain, color: "bg-blue-100 text-blue-700", title: "Guided weekly programme", desc: "The platform tells your child what to work on next. Priority-ranked 15-minute sessions based on their specific gaps." },
              { icon: Clock, color: "bg-emerald-100 text-emerald-700", title: "Tracks progress to 121", desc: "Forecast score updates after every session. Watch the gap close with evidence, not guesswork." },
            ].map((tile, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 bg-slate-50/50" data-testid={`feature-tile-${i}`}>
                <div className={`p-2.5 rounded-xl w-fit ${tile.color}`}>
                  <tile.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary">{tile.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARENTS CHOOSE US ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-why-parents">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Why parents choose us</span>
            <h2 className="text-2xl font-bold text-primary font-serif">Built with Senior Leadership Insight</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-8 py-8 md:px-12 md:py-10" data-testid="why-parents-card">
            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed text-[15px] mb-8">
              <p>Developed with input from senior leadership within Primary Education, the platform is grounded in the realities of Year 6 and preparation for selective education.</p>
              <p>The approach is informed by the structure and demands of the Buckinghamshire Secondary Transfer Test — focusing on where marks are lost, how timing affects performance, and what thorough preparation for the Buckinghamshire 11+ looks like in practice.</p>
            </div>
            <div className="border-t border-slate-200 pt-6 flex items-end justify-between gap-4">
              <p className="text-xs text-slate-400 max-w-xs">Built specifically for Bucks 11+ — giving parents clarity on readiness and what to do next.</p>
              <p className="text-2xl md:text-3xl text-primary font-serif italic" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '-0.5px' }}>Bucks11PlusTest</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-faq">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Common questions</span>
            <h2 className="text-2xl font-bold text-primary font-serif">Everything you need to know</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-xl border transition-all ${openFaq === i ? "border-primary/20 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`} data-testid={`faq-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left"
                  aria-expanded={openFaq === i}
                  data-testid={`button-faq-${i}`}
                >
                  <span className="text-sm font-semibold text-primary flex-1 leading-snug">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-200 ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="trust-footer">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Shield className="h-4 w-4" />
              <span>Payments powered by Stripe · Registered in England · Operated by Ianson Systems Limited</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-500 text-xs" onClick={handleBillingPortal} disabled={loading === "portal"} data-testid="button-billing-portal-faq">
              {loading === "portal" ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Lock className="h-3.5 w-3.5 mr-1.5" />}
              Manage billing
            </Button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-14 bg-primary" data-testid="section-final-cta">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">
            {hasPaidPlan ? "Keep up the preparation." : "Start your free readiness check"}
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            {hasPaidPlan
              ? "Your plan is active. Head to your dashboard to continue targeted preparation."
              : "No account needed. 8 minutes. See exactly where your child stands — and the 3 things to fix first."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {hasPaidPlan ? (
              <Button variant="cta" size="lg"  asChild data-testid="button-cta-dashboard">
                <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            ) : (
              <>
                <Button variant="cta" size="lg"  asChild data-testid="button-cta-final">
                  <Link href="/free-diagnostic"><ArrowRight className="mr-2 h-5 w-5" />Start Free Check</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-6 font-semibold border-white/25 text-white hover:bg-white/10" asChild data-testid="button-cta-plans">
                  <a href="#tiers">View Plans</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

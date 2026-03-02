import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { apiRequest } from "../lib/queryClient";

export default function Pricing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: "pack12" | "programme16") => {
    if (!user) {
      navigate("/sign-up");
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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <Seo
        title="Pricing | 11+ Standard"
        description="Choose your 11+ preparation plan: Free mini diagnostic, Practice Pack for self-directed prep, or structured 16-week programme."
      />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif" data-testid="text-pricing-title">Invest in Targeted Readiness</h1>
        <p className="text-xl text-muted-foreground">
          Stop guessing. Get the exact roadmap your child needs to reach the 121 Bucks standard.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="border-border/60 shadow-sm flex flex-col hover:border-primary/30 transition-colors" data-testid="card-tier-free">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Free</CardTitle>
            <CardDescription className="text-base">See where you stand</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-8">
              <span className="text-5xl font-bold text-primary">£0</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Includes</h4>
              <ul className="space-y-3">
                {[
                  "Mini diagnostic (12 minutes)",
                  "Basic forecast gauge",
                  "Top 1 focus area teaser",
                  "Sample practice drill",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
                {[
                  "Full timed diagnostics",
                  "Complete drill bank",
                  "Structured programme",
                ].map((feature, i) => (
                  <li key={`missing-${i}`} className="flex items-start gap-3 opacity-50">
                    <X className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 h-12 text-lg" asChild data-testid="button-get-free">
              <Link href="/sign-up">Start Free Diagnostic</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border/60 shadow-md flex flex-col hover:border-primary/30 transition-colors" data-testid="card-tier-pack12">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Practice Pack</CardTitle>
            <CardDescription className="text-base">Self-directed 12-week access</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-2">
              <span className="text-5xl font-bold text-primary">£99</span>
              <span className="text-muted-foreground font-medium"> one-time</span>
            </div>
            <p className="text-sm text-slate-500 mb-8">12 weeks of full access</p>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Everything in Free, plus:</h4>
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
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
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

          <CardHeader className="pt-8">
            <CardTitle className="text-2xl font-serif">Structured Programme</CardTitle>
            <CardDescription className="text-base text-brand-primary/80">Guided 16-week roadmap</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-2">
              <span className="text-5xl font-bold text-primary">£249</span>
              <span className="text-muted-foreground font-medium"> one-time</span>
            </div>
            <p className="text-sm text-brand-primary/70 mb-8 font-medium bg-blue-50 px-3 py-1.5 rounded inline-block">Launch price (future price £349)</p>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Everything in Pack, plus:</h4>
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
                    <span className="text-primary font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
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

      <div className="mt-12 text-center text-sm font-medium text-slate-500 space-y-1">
        <p>Independent readiness assessment</p>
        <p>Not affiliated with GL Assessment or Buckinghamshire Council</p>
        <p>Forecasts are indicative — <Link href="/how-forecast-works" className="underline hover:text-primary">methodology available</Link></p>
      </div>

      <div className="mt-16 max-w-2xl mx-auto">
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-lg font-bold text-primary font-serif mb-4">Why it's priced this way</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The Practice Pack (£99) gives you self-directed access to all diagnostics, drills, and reports for a focused 12-week window. The Structured Programme (£249) adds a guided 16-week roadmap with milestone diagnostics, advanced analytics, and weekly auto-generated plans based on your child's actual performance. Both are one-time payments with no recurring charges.
          </p>
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-inner">
          <h2 className="text-2xl font-bold text-primary font-serif mb-8 text-center">Why diagnostics outperform generic practice</h2>
          <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Measures pace + completion, not just accuracy",
              "Identifies highest impact weaknesses",
              "Forecast contextualised to 121 benchmark",
              "Creates a structured plan to improve efficiently"
            ].map((bullet, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                </div>
                <span className="text-slate-700 font-medium">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

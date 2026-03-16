import { Link, useParams, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, Target, SlidersHorizontal, Sparkles, Clock, Loader2, Lock, TrendingUp, BarChart3, Brain, Zap } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";

type GuestSession = {
  id: string;
  diagnosticId: string;
  completedAt: string | null;
  totalScore: number | null;
  forecastScore: number | null;
  band: string | null;
  sectionScores: { name: string; score: number; avgTime: number; total: number; correct: number }[] | null;
  paceData: { name: string; avg: number; expected: number }[] | null;
};

export default function GuestResults() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const urlToken = new URLSearchParams(search).get("token");
  const guestToken = urlToken || sessionStorage.getItem("guestToken") || "";
  const target = 121;

  const { data: session, isLoading } = useQuery<GuestSession>({
    queryKey: [`guest-results-${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/guest/results/${id}?token=${guestToken}`);
      if (!res.ok) throw new Error("Failed to load results");
      return res.json();
    },
    enabled: !!id && !!guestToken,
  });

  const currentScore = session?.forecastScore || 0;
  const gap = target - currentScore;
  const sectionScores = session?.sectionScores || [];
  const paceData = session?.paceData || [];
  const weakestSection = sectionScores.length > 0 ? [...sectionScores].sort((a, b) => a.score - b.score)[0] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Results not found</h1>
        <p className="text-muted-foreground mt-2">Your session may have expired.</p>
        <Button className="mt-4" asChild>
          <Link href="/free-diagnostic">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Your Diagnostic Results | 11+ Standard" description="View your child's readiness forecast and section breakdown." />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-guest-results-title">Your Diagnostic Results</h1>
          <p className="text-muted-foreground mt-2">
            Free Baseline Diagnostic completed just now
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/60 shadow-md overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-white to-slate-50/50">
            <div className="relative w-64 h-64 mt-4 drop-shadow-sm">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
                <circle
                  cx="50" cy="50" r="40"
                  className={`${currentScore >= 121 ? 'stroke-green-500' : currentScore >= 110 ? 'stroke-amber-400' : 'stroke-red-400'}`}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (currentScore / 141))}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
                <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-primary" data-testid="text-guest-score">{currentScore}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Forecast</span>
              </div>
            </div>

            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border mb-3 shadow-sm ${
                currentScore >= 121 ? 'bg-green-100 text-green-800 border-green-200' :
                currentScore >= 110 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`} data-testid="text-guest-band">
                <Sparkles className="h-4 w-4" /> {session.band || "Unknown"}
              </div>
              <p className="text-muted-foreground text-lg">
                {gap > 0 ? (
                  <>Your child is currently showing a <strong className="text-primary">{gap} point gap</strong> to the 121 standard.</>
                ) : (
                  <>Your child is <strong className="text-green-700">meeting or exceeding</strong> the 121 standard!</>
                )}
              </p>
            </div>

            <div className="w-full bg-white p-6 rounded-2xl border border-border shadow-sm text-left mt-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <SlidersHorizontal className="h-8 w-8 text-slate-400 mb-2" />
                <p className="font-bold text-primary mb-2">Impact Simulator</p>
                <p className="text-sm text-muted-foreground mb-3">See how improving specific skills shifts the forecast</p>
                <Button size="sm" asChild data-testid="button-unlock-simulator">
                  <Link href="/pricing">Unlock Full Access</Link>
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-4 opacity-40">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-primary text-lg font-serif">Impact Simulator</h4>
              </div>
              <div className="space-y-3 opacity-40">
                <div className="h-8 bg-slate-100 rounded"></div>
                <div className="h-24 bg-slate-100 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg font-serif">
                <BarChart2 className="h-5 w-5 text-primary" /> Section Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {sectionScores.map((section, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-bold text-slate-800">{section.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {section.correct}/{section.total} correct · {section.score >= 80 ? "On Track" : section.score >= 60 ? "Within Reach" : "Clear Improvement Opportunity"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary" data-testid={`text-guest-section-score-${i}`}>{section.score}%</div>
                    </div>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${section.score >= 80 ? 'bg-green-100' : section.score >= 60 ? 'bg-amber-100' : 'bg-red-100'}`}>
                    <div className={`h-full rounded-full ${section.score >= 80 ? 'bg-green-500' : section.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${section.score}%` }}></div>
                  </div>
                  {paceData[i] && (
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Pace: {paceData[i].avg}s/q (expected {paceData[i].expected}s)
                    </div>
                  )}
                </div>
              ))}
              {sectionScores.length === 0 && (
                <p className="text-sm text-muted-foreground">No section data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {weakestSection && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-md" data-testid="card-personalised-upsell-guest">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-primary text-xl font-serif mb-2">
                  {weakestSection.score < 50
                    ? `${weakestSection.name} needs immediate attention`
                    : weakestSection.score < 70
                    ? `Closing the gap in ${weakestSection.name} will have the biggest impact`
                    : `Fine-tuning ${weakestSection.name} could push the score above 121`
                  }
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {weakestSection.score < 50
                    ? `At ${weakestSection.score}%, ${weakestSection.name} is the primary area holding the forecast back. Our 2,500+ question bank includes hundreds of targeted ${weakestSection.name} drills designed to build confidence and close this gap.`
                    : weakestSection.score < 70
                    ? `${weakestSection.name} at ${weakestSection.score}% is the biggest lever for improvement. Focused practice with our adaptive question bank could shift this into the "On Track" zone within weeks.`
                    : `${weakestSection.name} is close at ${weakestSection.score}%. A few targeted sessions could push this past 80%, potentially raising the overall forecast above the 121 standard.`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] border border-primary/15 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-3">
            You've seen where your child stands. Here's how to close the gap.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Targeted practice on identified weak areas is the fastest route to improvement. Our paid plans give you the exact roadmap.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow" data-testid="card-upsell-pack12">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary font-serif">Practice Platform</h3>
                <span className="text-2xl font-bold text-primary">£99</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">12 weeks of targeted practice that moves the needle</p>
              <ul className="space-y-2 mb-6">
                {["2,500+ questions across VR, NVR, Maths & Comprehension", "Easy & Medium drills (13 sections)", "6 Hard challenge drills included", "2 full timed diagnostics (40 questions each)", "Practice papers (Quick & Full)", "PDF reports & full report archive", "Impact simulator & progress tracking", "Badge-based Accomplishments system"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild data-testid="button-upsell-pack12">
                <Link href={`/sign-up?redirect=checkout&tier=pack12&guestSession=${id}`}>Get Practice Platform</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-brand-amber border-2 shadow-xl relative" data-testid="card-upsell-programme16">
            <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-3 py-1 rounded-bl-lg font-bold text-xs">
              RECOMMENDED
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary font-serif">Young Scholar Programme</h3>
                <span className="text-2xl font-bold text-primary">£249</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">16-week guided roadmap with milestone tracking</p>
              <ul className="space-y-2 mb-6">
                {["Everything in Practice Platform, plus:", "All 17 Hard challenge drills unlocked", "Mock exam simulation (50 questions, timed)", "16-week guided preparation roadmap", "4 milestone diagnostics with auto-tracking", "Weekly personalised task plans", "Premium Parent Analytics dashboard", "Gap velocity & forecast stability metrics", "Fatigue & pressure profiling", "Full Accomplishments & gamification rewards"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <TrendingUp className="h-4 w-4 text-brand-amber shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary" asChild data-testid="button-upsell-programme16">
                <Link href={`/sign-up?redirect=checkout&tier=programme16&guestSession=${id}`}>Get Young Scholar Programme</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild data-testid="button-save-results">
            <Link href={`/sign-up?guestSession=${id}`}>
              Save These Results (Free Account) <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Create a free account to save your results and access the sample drill.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
          <Lock className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-xl font-bold text-primary mb-2">Premium Analytics Dashboard</h3>
          <p className="text-xs font-semibold text-brand-amber uppercase tracking-wide mb-2">Included with Young Scholar Programme</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            See detailed readiness metrics, pace discipline analysis, fatigue indicators, and personalised improvement priorities.
          </p>
          <Button asChild data-testid="button-preview-analytics">
            <Link href="/pricing#demos">Preview What You'll Get</Link>
          </Button>
        </div>
        <div className="opacity-30 pointer-events-none">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4 h-24"></div>
            <div className="bg-slate-50 rounded-lg p-4 h-24"></div>
            <div className="bg-slate-50 rounded-lg p-4 h-24"></div>
            <div className="bg-slate-50 rounded-lg p-4 h-24"></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 h-48"></div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-slate-400" data-testid="text-guest-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

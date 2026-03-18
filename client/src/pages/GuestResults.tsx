import { Link, useParams, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, SlidersHorizontal, Sparkles, Clock, Loader2, Lock, TrendingUp, BarChart3, Zap, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

type ReviewItem = {
  questionId: string;
  section: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
  explanation: string | null;
  difficulty: string;
};

export default function GuestResults() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const urlToken = new URLSearchParams(search).get("token");
  const guestToken = urlToken || sessionStorage.getItem("guestToken") || "";
  const target = 121;
  const [simAdjustments, setSimAdjustments] = useState<Record<string, number>>({});
  const [showReview, setShowReview] = useState(false);

  const { data: session, isLoading } = useQuery<GuestSession>({
    queryKey: [`guest-results-${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/guest/results/${id}?token=${guestToken}`);
      if (!res.ok) throw new Error("Failed to load results");
      return res.json();
    },
    enabled: !!id && !!guestToken,
  });

  const { data: reviewItems } = useQuery<ReviewItem[]>({
    queryKey: [`guest-review-${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/guest/review/${id}?token=${guestToken}`);
      if (!res.ok) throw new Error("Failed to load review");
      return res.json();
    },
    enabled: !!id && !!guestToken && !!session?.completedAt,
  });

  const currentScore = session?.forecastScore || 0;
  const sectionScores = session?.sectionScores || [];
  const paceData = session?.paceData || [];
  const weakestSection = sectionScores.length > 0 ? [...sectionScores].sort((a, b) => a.score - b.score)[0] : null;

  const simScore = (() => {
    if (sectionScores.length === 0) return currentScore;
    const totalQuestions = sectionScores.reduce((s, sec) => s + sec.total, 0);
    let totalCorrect = 0;
    for (const sec of sectionScores) {
      const adj = simAdjustments[sec.name] || 0;
      const newScore = Math.min(100, sec.score + adj);
      totalCorrect += (newScore / 100) * sec.total;
    }
    const newPercent = (totalCorrect / totalQuestions) * 100;
    return Math.round((newPercent / 100) * 141);
  })();
  const simGap = target - simScore;
  const hasSimChanges = Object.values(simAdjustments).some(v => v !== 0);

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
                  className={`${(hasSimChanges ? simScore : currentScore) >= 121 ? 'stroke-green-500' : (hasSimChanges ? simScore : currentScore) >= 110 ? 'stroke-amber-400' : 'stroke-red-400'}`}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * ((hasSimChanges ? simScore : currentScore) / 141))}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-primary" data-testid="text-guest-score">{hasSimChanges ? simScore : currentScore}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{hasSimChanges ? "Simulated" : "Forecast"}</span>
              </div>
            </div>

            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border mb-3 shadow-sm ${
                (hasSimChanges ? simScore : currentScore) >= 121 ? 'bg-green-100 text-green-800 border-green-200' :
                (hasSimChanges ? simScore : currentScore) >= 110 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`} data-testid="text-guest-band">
                <Sparkles className="h-4 w-4" /> {hasSimChanges ? (simScore >= 121 ? "On Track" : simScore >= 116 ? "Within Reach" : "Clear Improvement Opportunity") : (session.band || "Unknown")}
              </div>
              <p className="text-muted-foreground text-lg">
                {(hasSimChanges ? simGap : target - currentScore) > 0 ? (
                  <>Your child is currently showing a <strong className="text-primary">{hasSimChanges ? simGap : target - currentScore} point gap</strong> to the 121 standard.</>
                ) : (
                  <>Your child is <strong className="text-green-700">meeting or exceeding</strong> the 121 standard!</>
                )}
              </p>
            </div>

            <div className="w-full bg-white p-6 rounded-2xl border border-border shadow-sm text-left mt-4">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-primary text-lg font-serif">Impact Simulator</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Drag the sliders to see how improving each section shifts the forecast.</p>
              <div className="space-y-4">
                {sectionScores.map((section) => {
                  const adj = simAdjustments[section.name] || 0;
                  const newVal = Math.min(100, section.score + adj);
                  return (
                    <div key={section.name} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">{section.name}</span>
                        <span className="text-sm font-bold text-primary">{newVal}%</span>
                      </div>
                      <Slider
                        value={[adj]}
                        onValueChange={([v]) => setSimAdjustments(prev => ({ ...prev, [section.name]: v }))}
                        min={0}
                        max={Math.min(50, 100 - section.score)}
                        step={5}
                        className="w-full"
                        data-testid={`slider-sim-${section.name}`}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Current: {section.score}%</span>
                        {adj > 0 && <span className="text-green-600 font-semibold">+{adj}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasSimChanges && (
                <button
                  onClick={() => setSimAdjustments({})}
                  className="text-xs text-muted-foreground hover:text-primary mt-3 underline"
                  data-testid="button-reset-sim"
                >
                  Reset simulator
                </button>
              )}
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

      {reviewItems && reviewItems.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 cursor-pointer" onClick={() => setShowReview(!showReview)}>
            <CardTitle className="flex items-center justify-between text-lg font-serif">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Question Review
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {reviewItems.filter(r => r.isCorrect).length}/{reviewItems.length} correct
                </span>
              </span>
              {showReview ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          {showReview && (
            <CardContent className="p-0 divide-y divide-border/50">
              {reviewItems.map((item, i) => (
                <div key={i} className={`p-5 ${item.isCorrect ? 'bg-white' : 'bg-red-50/30'}`} data-testid={`review-item-${i}`}>
                  <div className="flex items-start gap-3">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.section}</span>
                        <span className="text-xs text-muted-foreground">· {item.timeTaken}s</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 mb-2">{item.prompt}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.options.map((opt, j) => {
                          const isCorrect = opt === item.correctAnswer;
                          const isSelected = opt === item.selectedAnswer;
                          return (
                            <span
                              key={j}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                isCorrect ? 'bg-green-100 text-green-800 border-green-200' :
                                isSelected && !item.isCorrect ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              {opt}
                              {isCorrect && " ✓"}
                              {isSelected && !item.isCorrect && " ✗"}
                            </span>
                          );
                        })}
                      </div>
                      {item.explanation && !item.isCorrect && (
                        <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 mt-2 border border-slate-100">
                          <strong>Explanation:</strong> {item.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

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
                    ? `At ${weakestSection.score}%, ${weakestSection.name} is the primary area holding the forecast back. Our 1,600+ question bank includes hundreds of targeted ${weakestSection.name} drills designed to build confidence and close this gap.`
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
            Ready to close the gap? Choose your plan.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            You've seen exactly where your child stands. Now unlock targeted practice to turn weaknesses into strengths.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow" data-testid="card-upsell-pack-monthly">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-primary font-serif">Practice Platform</h3>
                <span className="text-2xl font-bold text-primary">£24.99<span className="text-sm font-medium text-slate-500">/mo</span></span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Cancel any time</p>
              <p className="text-sm text-slate-600 mb-4">Targeted practice that moves the needle — cancel any time</p>
              <ul className="space-y-2 mb-6">
                {["1,600+ questions across VR, NVR, Maths & Comprehension", "Easy & Medium drills (19 sections)", "Full timed diagnostics (40 questions)", "PDF reports & impact simulator", "Progress tracking dashboard"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild data-testid="button-upsell-pack-monthly">
                <Link href={`/sign-up?redirect=checkout&tier=pack_monthly&guestSession=${id}`}>Start Monthly — £24.99/mo</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-brand-amber border-2 shadow-xl relative" data-testid="card-upsell-programme24">
            <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-3 py-1 rounded-bl-lg font-bold text-xs">
              RECOMMENDED
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-primary font-serif">Programme+</h3>
                <span className="text-2xl font-bold text-primary">£149</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">24 weeks · one-time payment</p>
              <p className="text-sm text-slate-600 mb-4">Complete 24-week roadmap with milestone tracking and mock exams</p>
              <ul className="space-y-2 mb-6">
                {["Everything in Practice Platform, plus:", "All 17 Hard challenge drills unlocked", "3 full mock exam simulations", "24-week guided preparation roadmap", "Milestone diagnostics with auto-tracking", "Weekly personalised task plans", "Premium Parent Analytics dashboard"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <TrendingUp className="h-4 w-4 text-brand-amber shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary" asChild data-testid="button-upsell-programme24">
                <Link href={`/sign-up?redirect=checkout&tier=programme24_plus&guestSession=${id}`}>Get Programme+ — £149</Link>
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
          <p className="text-xs text-muted-foreground mt-3">Create a free account to save your results and start practising.</p>
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

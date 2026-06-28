import { Link, useParams, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, Sparkles, Clock, Loader2, Lock, TrendingUp, BarChart3, Zap, CheckCircle2, XCircle, ChevronDown, ChevronUp, Mail, Send } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { IndicativeScoreCaveat } from "../components/shared/IndicativeScoreCaveat";
import { TestCountdownBadge } from "../components/shared/TestCountdownBadge";
import { StickyResultsBar } from "../components/shared/StickyResultsBar";
import { getWeeksToTest } from "@/lib/testDate";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [showReview, setShowReview] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/guest/email-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, guestToken, email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send email");
      }
      return res.json();
    },
    onSuccess: () => {
      setEmailSent(true);
      setEmailError(null);
    },
    onError: (err: Error) => {
      setEmailError(err.message || "Failed to send. Please try again.");
    },
  });

  const { data: session, isLoading } = useQuery<GuestSession>({
    queryKey: [`guest-results-${id}-${guestToken}`],
    queryFn: async () => {
      const url = guestToken
        ? `/api/guest/results/${id}?token=${guestToken}`
        : `/api/guest/results/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load results");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: reviewItems } = useQuery<ReviewItem[]>({
    queryKey: [`guest-review-${id}-${guestToken}`],
    queryFn: async () => {
      const url = guestToken
        ? `/api/guest/review/${id}?token=${guestToken}`
        : `/api/guest/review/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load review");
      return res.json();
    },
    enabled: !!id && !!session?.completedAt,
  });

  const currentScore = session?.forecastScore || 0;
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
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-24 space-y-8">
      <Seo title="Your Readiness Results | Bucks 11 Plus Tests" description="View your child's readiness forecast and section breakdown." />
      <StickyResultsBar sessionId={id || ""} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-guest-results-title">Your Readiness Results</h1>
          <p className="text-muted-foreground mt-2">
            Free Baseline Readiness Check completed just now
          </p>
        </div>
        <div>
          <TestCountdownBadge variant="amber" />
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
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-primary" data-testid="text-guest-score">{currentScore}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-center px-2">Indicative<br/>Readiness</span>
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
                {(target - currentScore) > 0 ? (
                  <>Your child is currently showing an indicative <strong className="text-primary">{target - currentScore} point gap</strong> to the 121 preparation benchmark.</>
                ) : (
                  <>Your child is <strong className="text-green-700">meeting or exceeding</strong> the 121 preparation benchmark on this indicative readiness check.</>
                )}
              </p>
              <IndicativeScoreCaveat variant="inline" className="mt-3 max-w-md mx-auto justify-center text-left" />
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

      <Card className="border-border/60 shadow-sm" data-testid="card-email-results">
        <CardContent className="p-6 md:p-8">
          {emailSent ? (
            <div className="flex items-center gap-4" data-testid="text-email-sent-success">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Results sent!</p>
                <p className="text-sm text-muted-foreground">Check your inbox for the link — bookmark it so you can come back any time.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 mb-0.5">Email yourself these results</p>
                <p className="text-sm text-muted-foreground">Get a permanent link to your results — no account needed.</p>
              </div>
              <form
                className="flex gap-2 w-full sm:w-auto shrink-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailValue.trim()) emailMutation.mutate(emailValue.trim());
                }}
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="w-full sm:w-56"
                  disabled={emailMutation.isPending}
                  data-testid="input-email-results"
                  required
                />
                <Button
                  type="submit"
                  disabled={emailMutation.isPending || !emailValue.trim()}
                  data-testid="button-email-results"
                >
                  {emailMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}
          {emailError && (
            <p className="text-sm text-red-600 mt-3" data-testid="text-email-error">{emailError}</p>
          )}
        </CardContent>
      </Card>

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

      {weakestSection && (() => {
        const weeks = getWeeksToTest();
        const expectedLift = weakestSection.score < 50 ? "8–12" : weakestSection.score < 70 ? "5–9" : "3–6";
        const topThree = [...sectionScores].sort((a, b) => a.score - b.score).slice(0, 3);
        return (
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
                  <p className="text-slate-600 mb-5 leading-relaxed">
                    {weakestSection.score < 50
                      ? `At ${weakestSection.score}%, ${weakestSection.name} is the primary area holding the indicative readiness score back. The platform includes hundreds of targeted ${weakestSection.name} drills designed to build confidence and close this gap.`
                      : weakestSection.score < 70
                      ? `${weakestSection.name} at ${weakestSection.score}% is the biggest lever for improvement. Focused practice with the adaptive question bank could shift this into the "On Track" zone within weeks.`
                      : `${weakestSection.name} is close at ${weakestSection.score}%. A few targeted sessions could push this past 80%, potentially lifting the indicative readiness score past the 121 preparation benchmark we calibrate to.`
                    }
                  </p>

                  <div className="rounded-xl border border-amber-200 bg-white/70 p-5 space-y-3" data-testid="block-what-would-change">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-700" />
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-700">What would change</p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      With consistent weekly practice, drilling these {topThree.length} priority area{topThree.length === 1 ? "" : "s"} can lift the indicative readiness score by roughly <strong className="text-primary">{expectedLift} points</strong>{weeks > 0 ? <> before the September test day — about <strong className="text-primary">{weeks} {weeks === 1 ? "week" : "weeks"} from now</strong></> : null}.
                    </p>
                    <ol className="space-y-1.5 text-sm text-slate-700 pl-1">
                      {topThree.map((s, i) => (
                        <li key={i} className="flex items-center gap-2" data-testid={`priority-area-${i}`}>
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold shrink-0">{i + 1}</span>
                          <span><strong>{s.name}</strong> — currently {s.score}%</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      Estimated lift based on typical platform usage. Not a guarantee — actual change depends on consistent weekly practice.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

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
                <h3 className="text-xl font-bold text-primary font-serif">Bucks Plus Edge</h3>
                <span className="text-2xl font-bold text-primary">£35<span className="text-sm font-medium text-slate-500">/mo</span></span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mb-1">
                vs <span className="line-through decoration-red-500/70 text-slate-400">£160/mo</span> tutor · £35/mo here
              </p>
              <p className="text-xs text-slate-400 mb-3">Cancel any time · no lock-in</p>
              <p className="text-sm text-slate-600 mb-4">Full platform access — every feature, monthly flexibility</p>
              <ul className="space-y-2 mb-6">
                {["2,500+ GL-style questions across all four subjects", "Full 40q and 50q mock exams", "All Hard-level challenge drills", "PDF readiness reports after every session", "Parent analytics dashboard"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="cta" size="lg" className="w-full" asChild data-testid="button-upsell-pack-monthly">
                <Link href="/pricing?autoCheckout=pack_plus">Start Monthly — £35/mo</Link>
              </Button>
              <p className="text-[11px] text-slate-500 text-center mt-2">3-day money-back guarantee · Cancel any time</p>
            </CardContent>
          </Card>

          <Card className="border-primary border-2 shadow-xl relative" data-testid="card-upsell-pack-annual">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg font-bold text-xs">
              BEST VALUE
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-primary font-serif">Bucks Plus Edge</h3>
                <span className="text-2xl font-bold text-primary">£279<span className="text-sm font-medium text-slate-500">/yr</span></span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mb-1">Save £141 vs monthly · equiv. £23.25/mo · 34% off</p>
              <p className="text-sm text-slate-600 mb-4">Everything in the monthly plan · 12 months of full access</p>
              <ul className="space-y-2 mb-6">
                {["2,500+ GL-style questions across all four subjects", "Full 40q and 50q mock exams", "All Hard-level challenge drills", "PDF readiness reports after every session", "Parent analytics dashboard"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="cta" size="lg" className="w-full" asChild data-testid="button-upsell-pack-annual">
                <Link href="/pricing?autoCheckout=pack_annual">Get Annual Access — £279</Link>
              </Button>
              <p className="text-[11px] text-slate-500 text-center mt-2">3-day money-back guarantee · Equiv. £23.25/mo</p>
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
          <p className="text-xs font-semibold text-brand-amber uppercase tracking-wide mb-2">Included with Bucks Plus Edge</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            See detailed readiness metrics, pace analysis, section breakdowns, and personalised improvement priorities.
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
        <p className="text-xs text-slate-400 mb-2">
          Preparing for 11+ outside Buckinghamshire?{" "}
          <a href="https://11plustesthub.co.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            11plusTestHub.co.uk
          </a>{" "}
          covers national 11+ preparation across England.
        </p>
        <p className="text-xs text-slate-400" data-testid="text-guest-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Download, BarChart2, Target, SlidersHorizontal, Sparkles, Clock, Loader2, CheckCircle2, TrendingUp, FileText, XCircle, ChevronDown, ChevronUp, Lightbulb, Crown, Zap, Star, ThumbsUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

function PdfDownloadButton({ sessionId, completedAt }: { sessionId: string; completedAt?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/test-sessions/${sessionId}/pdf`, { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "PDF generation failed");
      }
      const blob = await res.blob();
      const dateStr = completedAt ? new Date(completedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `bucks-11plus-report-${dateStr}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e: any) {
      setError(e.message || "Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" className="gap-2" onClick={handleDownload} disabled={loading} data-testid="button-download-pdf">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Generating…" : "PDF Report"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

type TestSession = {
  id: string;
  diagnosticId: string;
  startedAt: string;
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
  skillId: string;
  subRuleId: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
  explanation: string | null;
  difficulty: string;
};

type Milestone = {
  id: string;
  week: number;
  title: string;
  completedAt: string | null;
  linkedDiagnosticId: string | null;
};

type ProgrammeData = {
  enrolled: boolean;
  milestones?: Milestone[];
  currentWeek?: number;
};

const TIER_RANK: Record<string, number> = {
  free: -1,
  early_learner: 0,
  pack12: 1,
  pack12_family: 1,
  pack_monthly: 1,
  pack_plus: 2,
  pack_annual: 2,
  programme8: 2,
  programme12: 2,
  programme16: 2,
  programme16_family: 2,
  programme24_plus: 2,
};

function getUpsellMessage(tier: string, weakestSection: string, weakestScore: number, overallScore: number): { title: string; message: string; cta: string; tier: string; isUpgrade?: boolean; link?: string } | null {
  const rank = TIER_RANK[tier] ?? -1;

  if (rank < 0) {
    if (overallScore < 110) {
      return {
        title: "Unlock the Full Readiness & Practice Hub",
        message: `${weakestSection} at ${weakestScore}% needs focused attention. Bucks Plus Edge gives your child 2,500+ GL-style questions, full readiness checks, all Hard drills, and a detailed analytics dashboard — from £35/month.`,
        cta: "See Plans & Start Today",
        tier: "pack_plus",
        link: "/pricing",
      };
    }
    return {
      title: "Build Confidence with the Full Platform",
      message: `Great start! Bucks Plus Edge is the complete Readiness & Practice Hub — 2,500+ questions, all 20 Hard challenge drills, full readiness checks, and a detailed parent analytics dashboard. From £35/month, cancel any time.`,
      cta: "See Plans & Start Today",
      tier: "pack_plus",
      link: "/pricing",
    };
  }

  if (rank === 0) {
    if (weakestScore < 60) {
      return {
        title: "Upgrade to Full Platform Access",
        message: `${weakestSection} at ${weakestScore}% needs hard-level drilling. Bucks Plus Edge unlocks all 20 Hard challenge drills, the complete readiness suite, and an advanced parent analytics dashboard. From £35/month.`,
        cta: "See Plans & Start Today",
        tier: "pack_plus",
        link: "/pricing",
      };
    }
    return {
      title: "Go Deeper with the Full Platform",
      message: `Your child is making progress. Bucks Plus Edge is the complete Readiness & Practice Hub — all Hard drills, full-length mock exams, and detailed gap analysis to work towards the qualifying benchmark. From £35/month.`,
      cta: "See Plans & Start Today",
      tier: "pack_plus",
      link: "/pricing",
    };
  }

  return null;
}

function getSubRuleLabel(subRuleId: string): string {
  const parts = subRuleId.split('.');
  const last = parts[parts.length - 1] || subRuleId;
  return last.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    'verbal_reasoning': 'Verbal Reasoning',
    'Verbal Reasoning': 'Verbal Reasoning',
    'non_verbal_reasoning': 'Non-Verbal Reasoning',
    'Non-Verbal Reasoning': 'Non-Verbal Reasoning',
    'mathematics': 'Mathematics',
    'Mathematics': 'Mathematics',
    'comprehension': 'Comprehension',
    'Comprehension': 'Comprehension',
  };
  return labels[section] || section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user, isProgramme, isFullPlatform, hasPaidAccess } = useAuth();
  const target = 121;

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!id,
    refetchInterval: (query) => {
      const s = (query.state.data) as TestSession | undefined;
      return (s && !s.completedAt) ? 1500 : false;
    },
  });

  const { data: programme } = useQuery<ProgrammeData>({
    queryKey: ["/api/programme"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isProgramme(),
  });

  const { data: reviewData } = useQuery<ReviewItem[]>({
    queryKey: [`/api/test-sessions/${id}/review`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!id && !!session?.completedAt,
  });

  const [simulatorValue, setSimulatorValue] = useState([10]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct">("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const currentScore = session?.forecastScore || 0;
  const gap = target - currentScore;
  const sectionScores = session?.sectionScores || [];
  const paceData = session?.paceData || [];

  const activeSkill = selectedSkill || sectionScores[0]?.name || "";
  const skillScore = sectionScores.find(s => s.name === activeSkill)?.score || 0;
  const skillWeight = 1 / Math.max(sectionScores.length, 1);
  const simulatedBoost = Math.round(simulatorValue[0] * skillWeight * 0.51);
  const newMin = currentScore + simulatedBoost;
  const newMax = Math.min(currentScore + 5 + simulatedBoost, 141);

  const matchingMilestone = programme?.milestones?.find(
    m => !m.completedAt && m.linkedDiagnosticId === session?.diagnosticId
  );

  const userTier = user?.subscriptionTier || "free";
  const weakest = sectionScores.length > 0 ? [...sectionScores].sort((a, b) => a.score - b.score)[0] : null;
  const upsell = weakest ? getUpsellMessage(userTier, weakest.name, weakest.score, currentScore) : null;

  const filteredReview = (reviewData || []).filter(item => {
    if (reviewFilter === "incorrect") return !item.isCorrect;
    if (reviewFilter === "correct") return item.isCorrect;
    return true;
  });

  const subSectionData = reviewData ? (() => {
    const grouped: Record<string, Record<string, { correct: number; total: number }>> = {};
    for (const a of reviewData) {
      const section = getSectionLabel(a.section);
      if (!grouped[section]) grouped[section] = {};
      const subLabel = getSubRuleLabel(a.subRuleId);
      if (!grouped[section][subLabel]) grouped[section][subLabel] = { correct: 0, total: 0 };
      grouped[section][subLabel].total++;
      if (a.isCorrect) grouped[section][subLabel].correct++;
    }
    return grouped;
  })() : null;

  const toggleQuestion = (qId: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const toggleSection = (name: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

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
        <h1 className="text-2xl font-bold text-primary">Session not found</h1>
        <Button className="mt-4" asChild>
          <Link href="/app">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!session.completedAt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Saving your results…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Assessment Results | Bucks 11 Plus Tests" description="View your recent readiness results and updated readiness forecast." />

      {matchingMilestone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3" data-testid="banner-milestone">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="font-bold text-green-800">Programme Milestone: {matchingMilestone.title}</p>
            <p className="text-sm text-green-600">This attempt can be linked to your Week {matchingMilestone.week} milestone.</p>
          </div>
        </div>
      )}

      {sectionScores.length > 0 && (() => {
        const totalCorrect = sectionScores.reduce((acc, s) => acc + (s.correct ?? 0), 0);
        const totalQs = sectionScores.reduce((acc, s) => acc + (s.total ?? 0), 0);
        const strongest = [...sectionScores].sort((a, b) => b.score - a.score)[0];
        const needsWork = [...sectionScores].sort((a, b) => a.score - b.score)[0];
        const pct = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;
        const encouragement = pct >= 85 ? "Fantastic work — you're really getting it!" :
          pct >= 70 ? "Great effort! You're making strong progress." :
          pct >= 55 ? "Good work! Keep practising and you'll keep improving." :
          "Every practice makes you better — don't give up!";
        return (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" data-testid="banner-child-summary">
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-amber-100 rounded-full p-2">
                <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-amber-900" data-testid="text-summary-score">
                  {totalCorrect} out of {totalQs} correct
                </p>
                <p className="text-sm text-amber-700 italic" data-testid="text-summary-encouragement">{encouragement}</p>
              </div>
            </div>
            <div className="sm:ml-auto flex flex-col sm:flex-row gap-3 text-sm">
              {strongest && (
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5" data-testid="text-summary-strongest">
                  <ThumbsUp className="h-3.5 w-3.5 text-green-600 shrink-0" />
                  <span className="text-green-800"><strong>Best:</strong> {strongest.name}</span>
                </div>
              )}
              {needsWork && needsWork.name !== strongest?.name && (
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5" data-testid="text-summary-needs-work">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="text-blue-800"><strong>Focus on:</strong> {needsWork.name}</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-results-title">Readiness Results</h1>
          <p className="text-muted-foreground mt-2">
            {session.diagnosticId.includes("mini") ? "Quick" : "Full"} Readiness Check completed on {session.completedAt ? new Date(session.completedAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="flex gap-3">
          {hasPaidAccess() && (
            <PdfDownloadButton sessionId={session.id} completedAt={session.completedAt?.toString()} />
          )}
          <Button asChild>
            <Link href="/app" data-testid="button-go-dashboard">Go to Dashboard</Link>
          </Button>
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
                <span className="text-6xl font-bold text-primary" data-testid="text-result-score">{currentScore}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Forecast</span>
              </div>
            </div>

            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border mb-3 shadow-sm ${
                currentScore >= 121 ? 'bg-green-100 text-green-800 border-green-200' :
                currentScore >= 110 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`} data-testid="text-result-band">
                <Sparkles className="h-4 w-4" /> {session.band || "Unknown"}
              </div>
              <p className="text-muted-foreground text-lg">
                {gap > 0 ? (
                  <>Your child is currently showing an estimated <strong className="text-primary">{gap} point gap</strong> to the 121 threshold.</>
                ) : (
                  <>Your child is <strong className="text-green-700">meeting or exceeding</strong> the 121 threshold on this estimate!</>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground/50 text-center mt-2">
                Indicative readiness estimate only · Not an official GL Assessment score ·{" "}
                <Link href="/scoring-methodology" className="underline hover:text-muted-foreground/80">How scoring works</Link>
              </p>
            </div>

            <div className="w-full bg-white p-6 rounded-2xl border border-border shadow-sm text-left mt-4 relative overflow-hidden">
              {!hasPaidAccess() && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                  <SlidersHorizontal className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="font-bold text-primary mb-2">Impact Simulator</p>
                  <p className="text-sm text-muted-foreground mb-3">Unlock with Practice Platform or Programme</p>
                  <Button size="sm" asChild>
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-primary text-lg font-serif">Impact Simulator</h4>
                {isProgramme() && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">Multi-variable</span>}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">If we improve</label>
                  <Select value={activeSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger className="w-full bg-slate-50" data-testid="select-skill">
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionScores.map((s, i) => (
                        <SelectItem key={i} value={s.name}>{s.name} ({s.score}%)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600">By</span>
                    <span className="text-primary font-bold">+{simulatorValue[0]}%</span>
                  </div>
                  <Slider
                    defaultValue={[10]}
                    max={25}
                    step={5}
                    value={simulatorValue}
                    onValueChange={setSimulatorValue}
                    className="[&_[role=slider]]:bg-primary"
                    data-testid="slider-simulator"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                  <p className="text-sm text-slate-700">
                    Projected range shifts to <strong className="text-primary text-lg">{newMin}–{newMax}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gap to 121 reduces to {121 - newMax > 0 ? 121 - newMax : 0} points.
                  </p>
                  {isProgramme() && (
                    <p className="text-xs text-blue-600 font-medium mt-2">
                      {activeSkill} at {skillScore}% → {Math.min(skillScore + simulatorValue[0], 100)}% with targeted practice
                    </p>
                  )}
                </div>
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
                  <div
                    className="flex justify-between items-end cursor-pointer"
                    onClick={() => toggleSection(section.name)}
                    data-testid={`section-toggle-${i}`}
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {section.name}
                        {subSectionData && subSectionData[section.name] && (
                          expandedSections.has(section.name) ?
                            <ChevronUp className="h-4 w-4 text-slate-400" /> :
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {section.correct}/{section.total} correct — {section.score >= 80 ? "On Track" : section.score >= 60 ? "Within Reach" : "Clear Improvement Opportunity"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary" data-testid={`text-section-score-${i}`}>{section.score}%</div>
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

                  {expandedSections.has(section.name) && subSectionData && subSectionData[section.name] && (
                    <div className="ml-4 space-y-2 pt-2 border-l-2 border-slate-100 pl-4" data-testid={`subsection-breakdown-${i}`}>
                      {Object.entries(subSectionData[section.name]).map(([subRule, data]) => {
                        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                        return (
                          <div key={subRule} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 truncate mr-2">{subRule}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-slate-400">{data.correct}/{data.total}</span>
                              <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-bold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {sectionScores.length === 0 && (
                <p className="text-sm text-muted-foreground">No section data available.</p>
              )}
            </CardContent>
          </Card>

          {subSectionData && Object.keys(subSectionData).length > 0 && (
            <Card className="border-red-200/60 bg-gradient-to-br from-red-50/50 to-white shadow-sm" data-testid="card-weakest-areas">
              <CardHeader className="bg-red-50/30 border-b border-red-100/50">
                <CardTitle className="flex items-center gap-2 text-lg font-serif">
                  <Lightbulb className="h-5 w-5 text-red-500" /> Weakest Areas — Focus Here First
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {(() => {
                  const allSubs: { section: string; subRule: string; pct: number; correct: number; total: number }[] = [];
                  for (const [section, subs] of Object.entries(subSectionData)) {
                    for (const [subRule, data] of Object.entries(subs)) {
                      if (data.total >= 1) {
                        allSubs.push({ section, subRule, pct: Math.round((data.correct / data.total) * 100), correct: data.correct, total: data.total });
                      }
                    }
                  }
                  const weakest = allSubs.sort((a, b) => a.pct - b.pct).slice(0, 3);
                  return weakest.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</span>
                          <span className="font-medium text-sm text-slate-800">{w.subRule}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-8">{w.section} · {w.correct}/{w.total} correct</span>
                      </div>
                      <span className={`text-sm font-bold ${w.pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{w.pct}%</span>
                    </div>
                  ));
                })()}
                <p className="text-xs text-muted-foreground pt-2">
                  Focusing on these areas will have the highest impact on your forecast score.
                </p>
                <Button size="sm" className="w-full mt-2" asChild data-testid="button-practice-weakest">
                  <Link href="/app/practice">Start Targeted Practice <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {upsell && (
            <Card className="border-brand-amber/30 bg-gradient-to-br from-amber-50 to-white shadow-md relative overflow-hidden" data-testid="card-upsell">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Crown className="w-24 h-24 text-amber-900" />
              </div>
              <CardContent className="p-8 relative z-10">
                <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3 text-xl font-serif">
                  <Zap className="h-6 w-6 text-amber-600" /> {upsell.title}
                </h3>
                <p className="text-slate-700 mb-6 leading-relaxed">{upsell.message}</p>
                <Button size="lg" className="w-full bg-brand-amber text-white hover:bg-brand-amber/90 shadow-lg hover:shadow-xl transition-shadow text-base" asChild>
                  <Link href={upsell.link ?? (upsell.isUpgrade ? "/pricing#upgrade" : "/pricing#tiers")} data-testid="button-upsell-cta">{upsell.cta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Target className="w-24 h-24 text-blue-900" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="font-bold text-primary flex items-center gap-2 mb-3 text-xl font-serif">
                <Target className="h-6 w-6 text-blue-600" /> Immediate Next Step
              </h3>
              {sectionScores.length > 0 ? (
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {(() => {
                    const w = [...sectionScores].sort((a, b) => a.score - b.score)[0];
                    return `${w.name} at ${w.score}% is the primary area for improvement. We recommend starting targeted drills immediately.`;
                  })()}
                </p>
              ) : (
                <p className="text-slate-700 mb-6 leading-relaxed">Start a practice drill to improve your forecast.</p>
              )}
              <Button size="lg" className="w-full bg-primary shadow-lg hover:shadow-xl transition-shadow text-base" asChild>
                <Link href="/app/practice" data-testid="button-start-drill">Start Highest Impact Drill <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {reviewData && reviewData.length > 0 && (
        <Card className="border-border/60 shadow-sm" data-testid="card-question-review">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 cursor-pointer" onClick={() => setShowReview(!showReview)}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-serif">
                <FileText className="h-5 w-5 text-primary" /> Question Review
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({reviewData.filter(r => r.isCorrect).length}/{reviewData.length} correct)
                </span>
              </div>
              <Button variant="ghost" size="sm" data-testid="button-toggle-review">
                {showReview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {showReview && (
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6">
                {(["all", "incorrect", "correct"] as const).map(f => (
                  <Button
                    key={f}
                    variant={reviewFilter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewFilter(f)}
                    data-testid={`button-filter-${f}`}
                  >
                    {f === "all" ? `All (${reviewData.length})` : f === "incorrect" ? `Incorrect (${reviewData.filter(r => !r.isCorrect).length})` : `Correct (${reviewData.filter(r => r.isCorrect).length})`}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredReview.map((item, idx) => {
                  const isExpanded = expandedQuestions.has(item.questionId);
                  return (
                    <div
                      key={item.questionId}
                      className={`border rounded-xl overflow-hidden transition-colors ${item.isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}
                      data-testid={`review-item-${idx}`}
                    >
                      <div
                        className="p-4 cursor-pointer flex items-start gap-3"
                        onClick={() => toggleQuestion(item.questionId)}
                      >
                        <div className="shrink-0 mt-0.5">
                          {item.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.section}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              item.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              item.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{item.difficulty}</span>
                            {item.timeTaken != null && (
                              <span className="text-xs text-muted-foreground">{item.timeTaken}s</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-800 line-clamp-2">{item.prompt}</p>
                        </div>
                        <div className="shrink-0">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border/40 pt-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.options.map((opt, oi) => {
                              const isCorrectOption = opt === item.correctAnswer;
                              const isSelected = opt === item.selectedAnswer;
                              let optClass = "border-slate-200 bg-white text-slate-700";
                              if (isCorrectOption) optClass = "border-green-300 bg-green-50 text-green-800 font-medium";
                              if (isSelected && !item.isCorrect) optClass = "border-red-300 bg-red-50 text-red-800 line-through";
                              if (isSelected && item.isCorrect) optClass = "border-green-300 bg-green-50 text-green-800 font-medium";

                              return (
                                <div key={oi} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${optClass}`}>
                                  {isCorrectOption && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                                  {isSelected && !item.isCorrect && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                                  {!isCorrectOption && !isSelected && <span className="h-4 w-4 shrink-0" />}
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          {item.explanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2" data-testid={`explanation-${idx}`}>
                              <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-900">{item.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredReview.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No questions match this filter.</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {hasPaidAccess() && !isFullPlatform() && weakest && weakest.score < 70 && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm" data-testid="card-upgrade-upsell">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary mb-1">Accelerate with Bucks Practice Platform Edge</h3>
              <p className="text-sm text-slate-600">
                {weakest.name} at {weakest.score}% needs structured improvement. Edge unlocks all 20 Hard drills, premium analytics, and mock exams to work towards the 121 benchmark.
              </p>
            </div>
            <Button size="sm" asChild data-testid="button-upgrade-edge">
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary">View Your Progress</h3>
              <p className="text-sm text-muted-foreground">Track how your forecast is changing over time.</p>
            </div>
            <Button variant="outline" asChild data-testid="link-view-progress">
              <Link href="/app/progress">View Progress <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary">Report Archive</h3>
              <p className="text-sm text-muted-foreground">Browse all your past test results.</p>
            </div>
            <Button variant="outline" asChild data-testid="link-report-archive">
              <Link href="/app/report-archive">All Results <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

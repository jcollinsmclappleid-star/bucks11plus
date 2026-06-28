import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock, FileText, Loader2, Zap, BookOpen, GraduationCap, PlayCircle, Timer, MessageSquare, ArrowRight } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Diagnostic, TestSession, Question, PracticeSection } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

function tierLabel(tier: string): string {
  if (tier === "free") return "Free";
  return "Bucks Plus Edge";
}

const TIER_RANK: Record<string, number> = {
  free: 0,
  pack12: 1, pack12_family: 1, pack_monthly: 1,
  pack_plus: 2, pack_annual: 2,
  programme8: 2, programme12: 2, programme16: 2, programme16_family: 2, programme24_plus: 2,
};

const PRACTICE_PAPERS = [
  {
    key: "quick",
    title: "Quick Paper",
    description: "A focused 20-question paper across all sections",
    questionCount: 20,
    duration: 25,
    requiredTier: "pack12",
    icon: Zap,
  },
  {
    key: "full",
    title: "Full Paper",
    description: "Complete 40-question paper mirroring real exam balance",
    questionCount: 40,
    duration: 45,
    requiredTier: "pack12",
    icon: BookOpen,
  },
  {
    key: "mock",
    title: "Mock Exam",
    description: "50-question exam simulation under timed conditions",
    questionCount: 50,
    duration: 50,
    requiredTier: "programme16",
    icon: GraduationCap,
  },
];

const SUBJECT_SUBLABELS: Record<string, string> = {
  "Verbal Reasoning": "Word puzzles & letter patterns",
  "Non-Verbal Reasoning": "Shape & pattern puzzles",
  "Mathematics": "Number problems",
  "English Comprehension": "Reading & comprehension",
};

export default function Diagnostics() {
  const { user, hasPaidAccess, isFullPlatform } = useAuth();
  const [, setLocation] = useLocation();
  const [startingPaper, setStartingPaper] = useState<string | null>(null);
  const [timedMode, setTimedMode] = useState(false);

  const { data: diagnostics, isLoading: loadingDiags } = useQuery<Diagnostic[]>({
    queryKey: ["/api/diagnostics"],
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
    enabled: !!user,
  });

  const { data: practiceSections } = useQuery<PracticeSection[]>({
    queryKey: ["/api/practice-sections"],
  });

  const startPaperMutation = useMutation({
    mutationFn: async (paperType: string) => {
      setStartingPaper(paperType);
      const res = await apiRequest("POST", "/api/practice-papers/start", { paperType });
      return res.json() as Promise<{ session: TestSession; questions: Question[] }>;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("practiceQuestions", JSON.stringify(data.questions));
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
      setLocation(`/app/test/${data.session.id}?practice=true`);
    },
    onError: () => {
      setStartingPaper(null);
      alert("Failed to generate practice paper. Please try again.");
    },
    onSettled: () => {
      setStartingPaper(null);
    },
  });

  if (loadingDiags || loadingSessions) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedIds = new Set(sessions?.filter(s => s.completedAt).map(s => s.diagnosticId));
  const userRank = user?.isAdmin ? 99 : (TIER_RANK[user?.subscriptionTier || "free"] || 0);

  const isLocked = (requiredTier: string) => {
    const requiredRank = TIER_RANK[requiredTier] || 0;
    return requiredRank > userRank;
  };

  const fixedDiagnostics = diagnostics?.filter(d => d.type !== "practice_paper") || [];

  const practicePaperSessions = sessions?.filter(s => 
    s.diagnosticId?.startsWith("practice-") && s.completedAt
  ) || [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-10">
      <Seo title="Readiness Checks | Bucks 11 Plus Tests" description="Fixed readiness checks, unlimited practice papers, and the full targeted drill library — everything you need for Bucks 11+ preparation." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-diagnostics-title">Readiness Checks & Practice</h1>
          <p className="text-muted-foreground mt-2">Take readiness checks, mock exams, or unlimited practice papers drawn from our full question bank.</p>
        </div>
        {!hasPaidAccess() && (
          <Button variant="cta" className="font-bold" asChild>
            <Link href="/pricing" data-testid="link-pricing">See Plans & Start Today</Link>
          </Button>
        )}
      </div>

      <section>
        <h2 className="text-xl font-bold text-primary font-serif mb-4" data-testid="text-section-diagnostics">Fixed Readiness Checks & Mocks</h2>
        <p className="text-sm text-muted-foreground mb-6">Structured assessments to measure progress and recalibrate your forecast score.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {fixedDiagnostics.map((diag) => {
            const locked = isLocked(diag.requiredTier);
            const completed = completedIds.has(diag.id);
            
            return (
              <Card key={diag.id} className={`relative overflow-hidden ${locked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`} data-testid={`card-diagnostic-${diag.id}`}>
                {locked && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center">
                    <Lock className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-600 mb-2">Requires {tierLabel(diag.requiredTier)}</p>
                    <p className="text-xs text-muted-foreground mb-4">Upgrade to Bucks Plus Edge — from £35/month</p>
                    <Button variant="cta" size="sm" size="sm"  asChild data-testid={`button-upgrade-${diag.id}`}>
                      <Link href="/pricing">See Plans</Link>
                    </Button>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={diag.requiredTier === 'free' ? 'default' : 'secondary'} className={diag.requiredTier === 'free' ? 'bg-primary' : 'bg-slate-200 text-slate-700'}>
                      {tierLabel(diag.requiredTier)}
                    </Badge>
                    {completed && <Badge variant="outline" className="text-brand-green border-brand-green">Completed</Badge>}
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-diagnostic-name-${diag.id}`}>{diag.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {diag.duration} mins</span>
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {diag.questionCount} Qs</span>
                  </div>
                  
                  <Button 
                    variant={completed ? 'outline' : 'default'} 
                    className="w-full" 
                    disabled={locked}
                    asChild={!locked}
                    data-testid={`button-start-diagnostic-${diag.id}`}
                  >
                    {locked ? 
                      <span>Locked</span> : 
                      <Link href={`/app/diagnostic/${diag.id}/start`}>
                        {completed ? 'Retake Readiness Check' : 'Start Readiness Check'}
                      </Link>
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <div className="border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold text-primary font-serif mb-1" data-testid="text-section-practice-papers">Practice Papers</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Unlimited practice papers drawn from our full question bank.
            {practicePaperSessions.length > 0 && (
              <span className="ml-2 font-medium text-primary">
                {practicePaperSessions.length} paper{practicePaperSessions.length !== 1 ? 's' : ''} completed
              </span>
            )}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRACTICE_PAPERS.map((paper) => {
              const locked = isLocked(paper.requiredTier);
              const Icon = paper.icon;

              return (
                <Card key={paper.key} className={`relative overflow-hidden ${locked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`} data-testid={`card-practice-paper-${paper.key}`}>
                  {locked && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center">
                      <Lock className="h-7 w-7 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-600 mb-1">Requires {tierLabel(paper.requiredTier)}</p>
                      <p className="text-xs text-muted-foreground mb-3">Upgrade to Bucks Plus Edge — from £35/month</p>
                      <Button variant="cta" size="sm" size="sm"  asChild data-testid={`button-upgrade-paper-${paper.key}`}>
                        <Link href="/pricing">See Plans</Link>
                      </Button>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                          {tierLabel(paper.requiredTier)}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-practice-paper-name-${paper.key}`}>{paper.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{paper.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {paper.duration} min</span>
                      <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {paper.questionCount} Qs</span>
                    </div>
                    <Button
                      className="w-full"
                      disabled={locked || startPaperMutation.isPending}
                      onClick={() => startPaperMutation.mutate(paper.key)}
                      data-testid={`button-start-practice-paper-${paper.key}`}
                    >
                      {startingPaper === paper.key ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Paper...
                        </>
                      ) : (
                        "Start Paper"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Bank */}
      <section>
        <div className="border-t border-border/60 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary font-serif mb-1" data-testid="text-section-practice-bank">Practice Bank</h2>
              <p className="text-sm text-muted-foreground">Targeted drills grouped by subject — work on the areas where your child needs it most.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex rounded-lg border border-border overflow-hidden" data-testid="toggle-drill-mode-diagnostics">
                <button
                  onClick={() => setTimedMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${!timedMode ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                  data-testid="button-diagnostics-mode-untimed"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Untimed
                </button>
                <button
                  onClick={() => setTimedMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${timedMode ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                  data-testid="button-diagnostics-mode-timed"
                >
                  <Timer className="h-3.5 w-3.5" />
                  Timed
                </button>
              </div>
              {!hasPaidAccess() && (
                <Button variant="cta" size="sm" className="gap-2" asChild size="sm" data-testid="button-unlock-drills">
                  <Link href="/pricing"><Lock className="h-3.5 w-3.5" /> See Plans</Link>
                </Button>
              )}
            </div>
          </div>

          {timedMode && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6">
              <Timer className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-900 text-sm">Exam Conditions Mode</p>
                <p className="text-amber-700 text-xs mt-0.5">Countdown timer · No per-question feedback · All answers scored at the end</p>
              </div>
            </div>
          )}

          {!practiceSections ? (
            <div className="space-y-10">
              {Array(3).fill(0).map((_, idx) => (
                <div key={idx}>
                  <div className="h-6 bg-slate-100 rounded w-40 mb-4 animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-44 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {Array.from(new Set(practiceSections.map(s => s.category))).map((category, idx) => {
                const categorySections = practiceSections.filter(s => s.category === category);
                const hasHardDrills = categorySections.some(s => s.difficulty === "Hard");
                const showHardUpgradeBanner = hasPaidAccess() && !isFullPlatform();
                return (
                  <div key={idx}>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary/70" /> {category}
                      </h3>
                      {SUBJECT_SUBLABELS[category] && (
                        <p className="text-sm text-muted-foreground mt-0.5 ml-7">{SUBJECT_SUBLABELS[category]}</p>
                      )}
                    </div>
                    {hasHardDrills && showHardUpgradeBanner && (
                      <div className="flex items-center gap-3 rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 mb-4" data-testid={`banner-hard-upgrade-${category}`}>
                        <Zap className="h-5 w-5 text-violet-600 shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-violet-900 text-sm">Unlock all Hard challenge drills with Bucks Plus Edge</p>
                          <p className="text-violet-600 text-xs mt-0.5">Upgrade to Bucks Plus Edge — from £35/month.</p>
                        </div>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shrink-0" asChild data-testid={`button-upgrade-hard-${category}`}>
                          <Link href="/pricing">See Plans <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                        </Button>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySections.map((drill) => {
                        const requiredRank = TIER_RANK[drill.requiredTier] || 0;
                        const isLocked = requiredRank > userRank;
                        return (
                          <Card key={drill.id} className={`relative overflow-hidden ${isLocked ? "bg-slate-50/50" : "hover:border-primary/50 transition-colors"}`} data-testid={`card-drill-${drill.id}`}>
                            {isLocked && (
                              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <Lock className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start mb-2">
                                <Badge
                                  variant="secondary"
                                  className={drill.difficulty === "Hard" ? "bg-red-100 text-red-800" : drill.difficulty === "Medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}
                                  data-testid={`badge-drill-difficulty-${drill.id}`}
                                >
                                  {drill.difficulty}
                                </Badge>
                                <span className="text-xs font-medium text-muted-foreground">{drill.questionCount} Qs</span>
                              </div>
                              <CardTitle className="text-base leading-tight" data-testid={`text-drill-title-${drill.id}`}>{drill.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLocked ? (
                                <Button variant="cta" className="w-full mt-4" asChild data-testid={`button-drill-see-plans-${drill.id}`}>
                                  <Link href="/pricing">See Plans</Link>
                                </Button>
                              ) : (
                                <Button variant="default" className="w-full mt-4 bg-primary" asChild data-testid={`button-start-drill-${drill.id}`}>
                                  <Link href={`/app/drill/${drill.id}${timedMode ? "?mode=timed" : ""}`}>
                                    <PlayCircle className="mr-2 h-4 w-4" /> {timedMode ? "Start Timed Drill" : "Start Drill"}
                                  </Link>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
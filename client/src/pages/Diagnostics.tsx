import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock, FileText, Loader2, Zap, BookOpen, GraduationCap } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Diagnostic, TestSession, Question } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

function tierLabel(tier: string): string {
  switch (tier) {
    case "free": return "Free";
    case "pack12": return "Practice Platform";
    case "programme16": return "Programme";
    case "pack": return "Practice Platform";
    case "monthly": return "Programme";
    default: return tier;
  }
}

const TIER_RANK: Record<string, number> = { free: 0, pack12: 1, programme16: 2 };

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

export default function Diagnostics() {
  const { user, hasPaidAccess } = useAuth();
  const [, setLocation] = useLocation();
  const [startingPaper, setStartingPaper] = useState<string | null>(null);

  const { data: diagnostics, isLoading: loadingDiags } = useQuery<Diagnostic[]>({
    queryKey: ["/api/diagnostics"],
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
    enabled: !!user,
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
  const userRank = TIER_RANK[user?.subscriptionTier || "free"] || 0;

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
      <Seo title="Diagnostics | 11+ Standard" description="Available mock exams, diagnostic assessments, and unlimited practice papers." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-diagnostics-title">Diagnostics & Practice</h1>
          <p className="text-muted-foreground mt-2">Take assessments, mock exams, or unlimited practice papers with fresh questions every time.</p>
        </div>
        {!hasPaidAccess() && (
          <Button className="bg-brand-amber text-amber-950 hover:bg-brand-amber/90" asChild>
            <Link href="/pricing" data-testid="link-pricing">Unlock Full Access</Link>
          </Button>
        )}
      </div>

      <section>
        <h2 className="text-xl font-bold text-primary font-serif mb-4" data-testid="text-section-diagnostics">Fixed Diagnostics & Mocks</h2>
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
                    <p className="text-sm font-medium text-slate-600 mb-4">Requires {tierLabel(diag.requiredTier)}</p>
                    <Button variant="outline" size="sm" asChild data-testid={`button-upgrade-${diag.id}`}>
                      <Link href="/pricing">View Upgrade Options</Link>
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
                        {completed ? 'Retake Diagnostic' : 'Start Diagnostic'}
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
            Unlimited unique papers drawn from the question pool — fresh questions every time, with anti-repeat protection.
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
                      <p className="text-sm font-medium text-slate-600 mb-3">Requires {tierLabel(paper.requiredTier)}</p>
                      <Button variant="outline" size="sm" asChild data-testid={`button-upgrade-paper-${paper.key}`}>
                        <Link href="/pricing">Upgrade</Link>
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
    </div>
  );
}
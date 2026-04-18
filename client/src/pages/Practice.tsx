import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, BookOpen, Timer, MessageSquare, ArrowRight, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { type PracticeSection } from "@shared/schema";
import { useAuth } from "../lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const TIER_RANK: Record<string, number> = {
  free: 0,
  pack12: 1, pack12_family: 1, pack_monthly: 1,
  pack_plus: 2, pack_annual: 2,
  programme8: 2, programme12: 2, programme16: 2, programme16_family: 2, programme24_plus: 2,
};

type ProgressData = {
  sectionAccuracy: Record<string, { correct: number; total: number; pct: number }>;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
};

function DifficultyProgression({ sectionAccuracy }: { sectionAccuracy: Record<string, { correct: number; total: number; pct: number }> }) {
  const sections = Object.entries(sectionAccuracy);
  if (sections.length === 0) return null;

  const readyForHard = sections.filter(([, v]) => v.pct >= 75 && v.total >= 5);
  const needsWork = sections.filter(([, v]) => v.pct < 75 || v.total < 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 mb-8" data-testid="difficulty-progression">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-primary font-serif">Difficulty Progression</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Score 75%+ on Medium drills in a section to be ready for Hard challenges.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {readyForHard.length > 0 && readyForHard.map(([name, data]) => (
          <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-green-800 block truncate">{name}</span>
              <span className="text-xs text-green-600">{data.pct}% accuracy — Ready for Hard</span>
            </div>
          </div>
        ))}
        {needsWork.map(([name, data]) => (
          <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="relative h-5 w-5 shrink-0">
              <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="7" className="stroke-amber-200" strokeWidth="3" fill="none" />
                <circle cx="10" cy="10" r="7" className="stroke-amber-500" strokeWidth="3" fill="none"
                  strokeDasharray={`${2 * Math.PI * 7}`}
                  strokeDashoffset={`${2 * Math.PI * 7 * (1 - Math.min(data.pct / 75, 1))}`}
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-amber-800 block truncate">{name}</span>
              <span className="text-xs text-amber-600">{data.pct}% — need 75% for Hard drills</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Practice() {
  const { user, hasPaidAccess, isProgramme, isFullPlatform } = useAuth();
  const [timedMode, setTimedMode] = useState(false);
  const { data: sections, isLoading } = useQuery<PracticeSection[]>({
    queryKey: ["/api/practice-sections"],
  });
  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["/api/progress"],
    enabled: !!user && hasPaidAccess(),
  });

  const categories = sections ? Array.from(new Set(sections.map(s => s.category))) : [];
  const userRank = user?.isAdmin ? 99 : (TIER_RANK[user?.subscriptionTier || "free"] || 0);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo 
        title="Practice Bank | Bucks 11 Plus Tests" 
        description="Targeted 11+ practice drills tailored to close your child's specific gaps to the 121 benchmark." 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Practice Bank</h1>
          <p className="text-muted-foreground mt-2">Targeted drills to close your specific gaps to 121.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden" data-testid="toggle-drill-mode">
            <button
              onClick={() => setTimedMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${!timedMode ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
              data-testid="button-mode-untimed"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Untimed
            </button>
            <button
              onClick={() => setTimedMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${timedMode ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
              data-testid="button-mode-timed"
            >
              <Timer className="h-3.5 w-3.5" />
              Timed
            </button>
          </div>
          {!hasPaidAccess() && (
            <Button className="gap-2 bg-primary" asChild data-testid="button-unlock-all">
              <Link href="/pricing"><Lock className="h-4 w-4" /> See Plans & Upgrade</Link>
            </Button>
          )}
        </div>
      </div>
      {timedMode && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <Timer className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-900 text-sm">Exam Conditions Mode</p>
            <p className="text-amber-700 text-xs mt-0.5">Countdown timer • No per-question feedback • All answers scored at the end</p>
          </div>
        </div>
      )}

      {hasPaidAccess() && progress?.sectionAccuracy && Object.keys(progress.sectionAccuracy).length > 0 && (
        <DifficultyProgression sectionAccuracy={progress.sectionAccuracy} />
      )}

      <div className="space-y-12">
        {isLoading ? (
          Array(3).fill(0).map((_, idx) => (
            <section key={idx}>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </section>
          ))
        ) : (
          categories.map((category, idx) => {
            const categorySections = sections?.filter(s => s.category === category) || [];
            const hasHardDrills = categorySections.some(s => s.difficulty === 'Hard');
            const showHardUpgradeBanner = hasPaidAccess() && !isFullPlatform();
            return (
            <section key={idx}>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-primary" /> {category}
              </h2>
              {hasHardDrills && showHardUpgradeBanner && (
                <div className="flex items-center gap-3 rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 mb-4" data-testid="banner-hard-upgrade">
                  <Zap className="h-5 w-5 text-violet-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-violet-900 text-sm">Unlock all 20 Hard challenge drills with Platform Edge</p>
                    <p className="text-violet-600 text-xs mt-0.5">Upgrade to Bucks Plus Edge to unlock all 20 Hard drills — from £35/month.</p>
                  </div>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shrink-0" asChild data-testid="button-upgrade-hard">
                    <Link href="/pricing">See Plans <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                  </Button>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections?.filter(s => s.category === category).map((drill, i) => {
                  const requiredRank = TIER_RANK[drill.requiredTier] || 0;
                  const isLocked = requiredRank > userRank;
                  return (
                    <Card key={i} className={`relative overflow-hidden ${isLocked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`}>
                      {isLocked && (
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant={drill.difficulty === 'Hard' ? 'destructive' : drill.difficulty === 'Medium' ? 'default' : 'secondary'} 
                            className={drill.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : drill.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}
                            data-testid={`badge-difficulty-${drill.id}`}
                          >
                            {drill.difficulty}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground" data-testid={`text-questions-${drill.id}`}>{drill.questionCount} Qs</span>
                        </div>
                        <CardTitle className="text-lg leading-tight" data-testid={`text-drill-title-${drill.id}`}>{drill.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLocked ? (
                          <Button 
                            className="w-full mt-4 bg-primary text-white"
                            asChild
                            data-testid={`button-start-drill-${drill.id}`}
                          >
                            <Link href="/pricing">See Plans</Link>
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            className="w-full mt-4 bg-primary" 
                            asChild
                            data-testid={`button-start-drill-${drill.id}`}
                          >
                            <Link href={`/app/drill/${drill.id}${timedMode ? '?mode=timed' : ''}`}><PlayCircle className="mr-2 h-4 w-4" /> {timedMode ? 'Start Timed Drill' : 'Start Drill'}</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
            );
          })
        )}
      </div>
    </div>
  );
}

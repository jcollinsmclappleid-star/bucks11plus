import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, AlertCircle, BookOpen, Clock, Lock, Target, Loader2, FileText, TrendingUp, Trophy, BarChart3, Map, Zap, Crown, Calendar } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { CountdownWidget } from "./TestDaySimulator";
import { useEffect } from "react";

type TestSession = {
  id: string;
  diagnosticId: string;
  startedAt: string;
  completedAt: string | null;
  totalScore: number | null;
  forecastScore: number | null;
  band: string | null;
  sectionScores: any;
  paceData: any;
};

type ProgressData = {
  trajectory: { date: string; score: number; target: number }[];
  latestForecast: number | null;
  latestBand: string | null;
  totalAttempts: number;
  velocity: number;
};

export default function Dashboard() {
  const { user, hasPaidAccess, isProgramme, isFullPlatform, isEarlyLearner, tierLabel } = useAuth();
  const [, navigate] = useLocation();
  const target = 121;

  useEffect(() => {
    if (user && isEarlyLearner()) {
      navigate("/app/early-dashboard");
    }
  }, [user]);

  const { data: testDayConfig } = useQuery({
    queryKey: ["/api/test-day-config"],
    enabled: !!user,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: progressData } = useQuery<ProgressData>({
    queryKey: ["/api/progress"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const completedSessions = sessions?.filter(s => s.completedAt) || [];
  const latest = completedSessions.length > 0 ? completedSessions[0] : null;
  const currentScore = latest?.forecastScore || 0;
  const gap = target - currentScore;
  const hasData = !!latest;
  const isAmber = currentScore >= 110 && currentScore < 121;

  const sectionScores: { name: string; score: number; avgTime: number }[] = latest?.sectionScores || [];
  const paceData: { name: string; avg: number; expected: number }[] = latest?.paceData || [];

  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Seo
        title="Dashboard | Bucks 11 Plus Tests"
        description="View your child's 11+ readiness forecast, pace analysis, and priority focus areas."
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary" data-testid="text-dashboard-title">
            {user?.childName ? `${user.childName}'s Readiness Forecast` : "Readiness Forecast"}
          </h1>
          {hasData ? (
            <div className="mt-1">
              <p className="text-muted-foreground">
                Based on {latest.diagnosticId.includes("mini") ? "Quick" : "Full"} Readiness Check completed {new Date(latest.completedAt!).toLocaleDateString()}.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                Forecast calibrated against the 121+ Buckinghamshire qualifying benchmark.{" "}
                <Link href="/how-forecast-works" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                  How scoring works
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground mt-1">Take your first readiness check to see your forecast.</p>
          )}
        </div>
        <Button className="bg-primary text-primary-foreground" asChild>
          <Link href="/app/diagnostic">
            {hasData ? "Take Full Readiness Check" : "Start Free Readiness Check"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {!hasData ? (
        <Card className="shadow-md border-primary/20 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary font-serif mb-2">Welcome to Bucks 11 Plus Tests</h2>
              <p className="text-muted-foreground max-w-md">
                Take a free 8-minute quick readiness check to get your child's initial readiness forecast against the 121 benchmark.
              </p>
            </div>
            <Button size="lg" className="bg-primary text-lg h-14 px-8" asChild>
              <Link href="/app/diagnostic/mini-1/start" data-testid="button-first-diagnostic">
                Start Quick Readiness Check <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Current Trajectory
                  {isAmber && <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 ml-2">Confident Amber</span>}
                  {currentScore >= 121 && <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">On Track</span>}
                  {currentScore < 110 && <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-2">Clear Improvement Opportunity</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 py-6">
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
                    <circle
                      cx="50" cy="50" r="40"
                      className={`transition-all duration-1000 ease-out ${currentScore >= 121 ? 'stroke-green-500' : currentScore >= 110 ? 'stroke-amber-400' : 'stroke-red-400'}`}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (currentScore / 141))}
                    />
                    <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-primary" data-testid="text-forecast-score">{currentScore}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Est. Score</span>
                  </div>
                </div>

                <div className="space-y-6 flex-1 w-full">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-primary">Estimated gap to 121 threshold</span>
                      <span className={`font-bold ${gap <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {gap <= 0 ? "Target met!" : `${gap} points`}
                      </span>
                    </div>
                    <Progress value={Math.min((currentScore/121)*100, 100)} className="h-3 [&>div]:bg-amber-400" />
                  </div>

                  {sectionScores.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="font-semibold text-sm text-primary flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Key Insight
                      </h4>
                      {(() => {
                        const weakest = [...sectionScores].sort((a, b) => a.score - b.score)[0];
                        return (
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-primary">{weakest?.name}</strong> at {weakest?.score}% is the primary area for improvement. Targeted practice here will have the highest impact on the overall forecast.
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Priority Focus</CardTitle>
                <CardDescription>Highest impact areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectionScores.length > 0 ? (
                  [...sectionScores]
                    .sort((a, b) => a.score - b.score)
                    .map((section, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm text-primary">{section.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{section.score}%</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" /> {i === 0 ? "High" : i === 1 ? "Med" : "Low"} Impact
                          </span>
                          <span className={`flex items-center gap-1 ${section.avgTime > 35 ? 'text-red-500' : 'text-green-600'}`}>
                            <Clock className="h-3 w-3" /> {section.avgTime > 40 ? "Slow" : section.avgTime > 35 ? "Slightly Slow" : "On Track"} Pace
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">Complete a readiness check to see priority areas.</p>
                )}
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/app/practice" data-testid="button-start-practice">
                    <BookOpen className="mr-2 h-4 w-4" /> Start Practice Drill
                  </Link>
                </Button>
                {hasData && (
                  <Button variant="ghost" className="w-full mt-1 text-xs" asChild>
                    <Link href="/app/analytics" data-testid="link-analytics">
                      View Detailed Readiness Analytics
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {!hasPaidAccess() && (
              <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">Full Readiness Checks Locked</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                      Upgrade to unlock full 45-minute readiness checks, complete practice bank, and PDF reports.
                    </p>
                  </div>
                  <Button className="mt-2 bg-primary" asChild>
                    <Link href="/pricing" data-testid="button-upgrade">View Upgrade Options</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Pace Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paceData.length > 0 ? (
                    paceData.map((stat, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">{stat.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs px-2 py-1 rounded bg-slate-100">{stat.avg}s / q</span>
                          <span className={`text-xs font-bold w-12 text-right ${stat.avg > stat.expected ? 'text-red-500' : 'text-green-600'}`}>
                            {stat.avg > stat.expected ? `+${stat.avg - stat.expected}s` : `${stat.avg - stat.expected}s`}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Complete a readiness check to see pace data.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {isFullPlatform() && hasData && (
              <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-primary font-serif">{isProgramme() ? "Programme Exclusive" : "Platform Features"}</h3>
                  </div>
                  {testDayConfig?.examDate && <CountdownWidget examDate={testDayConfig.examDate} />}
                  <div className="space-y-3">
                    {isProgramme() && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-primary/10">
                        <Map className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary">16-Week Roadmap</p>
                          <p className="text-xs text-muted-foreground">Guided milestones & weekly plans</p>
                        </div>
                        <Button size="sm" variant="ghost" asChild data-testid="button-go-programme">
                          <Link href="/app/programme"><ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">Premium Analytics</p>
                        <p className="text-xs text-muted-foreground">Gap velocity, forecasts & profiling</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild data-testid="button-go-analytics">
                        <Link href="/app/analytics"><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-primary/10">
                      <Calendar className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">Test Day Simulator</p>
                        <p className="text-xs text-muted-foreground">2-paper exam with timed break</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild data-testid="button-go-simulator">
                        <Link href="/app/test-day-simulator"><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasPaidAccess() && !isFullPlatform() && hasData && (
              <Card className="border-dashed border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-indigo-50/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-violet-600" />
                    <h3 className="font-bold text-violet-900">Upgrade to Edge</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-violet-700">
                    <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 shrink-0" /> Premium Parent Analytics dashboard</li>
                    <li className="flex items-center gap-2"><Target className="h-4 w-4 shrink-0" /> All 20 Hard-level challenge drills</li>
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0" /> Test Day Simulator (full mock exams)</li>
                  </ul>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" asChild data-testid="button-upgrade-edge">
                    <Link href="/pricing">Upgrade to Edge <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary">Session History</h3>
                  <p className="text-sm text-muted-foreground">View all past results and download reports.</p>
                </div>
                <Button variant="outline" asChild data-testid="link-report-archive">
                  <Link href="/app/report-archive">View All Results <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">Track your forecast trajectory over time.</p>
                </div>
                <Button variant="outline" asChild data-testid="link-progress-tracking">
                  <Link href="/app/progress">View Progress <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm bg-gradient-to-r from-amber-50/50 to-violet-50/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary">Accomplishments</h3>
                  <p className="text-sm text-muted-foreground">Earn badges and track your achievements.</p>
                </div>
                <Button variant="outline" asChild data-testid="link-badges">
                  <Link href="/app/badges">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

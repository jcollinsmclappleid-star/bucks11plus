import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { Seo } from "../components/shared/Seo";
import {
  CheckCircle2, Circle, Clock, Target, TrendingUp, Activity,
  ArrowRight, Calendar, PlayCircle, Loader2, Lock
} from "lucide-react";

type Milestone = {
  id: string;
  week: number;
  milestoneType: string;
  title: string;
  description: string | null;
  completedAt: string | null;
  linkedDiagnosticId: string | null;
};

type WeeklyPlanData = {
  week: number;
  phase: string;
  focusSkills: { skill: string; sessions: number; durationMin: number }[];
  secondarySkills: { skill: string; sessions: number; durationMin: number }[];
  mixed: { sessions: number; durationMin: number; mode: string };
  retest: { due: boolean };
};

type PlanRecord = {
  id: string;
  week: number;
  phase: string;
  planJson: WeeklyPlanData;
};

type ProgrammeData = {
  enrolled: boolean;
  enrolment?: {
    id: string;
    status: string;
    startAt: string;
    endAt: string;
    currentWeek: number;
  };
  milestones?: Milestone[];
  plans?: PlanRecord[];
  currentWeek?: number;
  daysRemaining?: number;
};

type ProgressData = {
  latestForecast: number | null;
  latestBand: string | null;
  gapVelocity: { oldGap: number; newGap: number; change: number; improving: boolean } | null;
  forecastStability: { stdDev: number; status: string; trend: string } | null;
};

const PHASES = [
  { name: "Baseline & Foundation", weeks: "Wk 1-4", color: "bg-blue-500" },
  { name: "Targeted Skill Elevation", weeks: "Wk 5-8", color: "bg-amber-500" },
  { name: "Exam Conditioning", weeks: "Wk 9-12", color: "bg-orange-500" },
  { name: "Benchmark Consolidation", weeks: "Wk 13-16", color: "bg-green-500" },
];

export default function Programme() {
  const { user, isProgramme, hasPaidAccess } = useAuth();
  const [, navigate] = useLocation();

  const { data: programme, isLoading } = useQuery<ProgrammeData>({
    queryKey: ["/api/programme"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["/api/progress"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  if (!isProgramme()) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <Seo title="Programme | 11+ Standard" description="Structured 16-week readiness programme." />
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-serif">Structured Readiness Programme</h1>
            <p className="text-muted-foreground max-w-lg text-lg">
              {hasPaidAccess()
                ? "Upgrade to the Structured Programme to access your personalised 16-week roadmap with milestone diagnostics, gap velocity tracking, and weekly auto-generated plans."
                : "The Structured Programme provides a guided 16-week roadmap with milestone diagnostics and advanced analytics to ensure your child is fully prepared."
              }
            </p>
            <Button size="lg" className="bg-primary text-lg h-14 px-8" asChild data-testid="button-upgrade-programme">
              <Link href="/pricing">
                {hasPaidAccess() ? "Upgrade to Programme" : "View Plans"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!programme?.enrolled) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Programme enrolment not found. Please contact support.</p>
      </div>
    );
  }

  const { enrolment, milestones = [], plans = [], currentWeek = 1, daysRemaining = 0 } = programme;
  const currentPlan = plans.find(p => p.week === currentWeek);
  const planData: WeeklyPlanData | null = currentPlan?.planJson || null;
  const forecast = progress?.latestForecast || 0;
  const gap = 121 - forecast;
  const gv = progress?.gapVelocity;
  const fs = progress?.forecastStability;

  const currentPhaseIdx = Math.min(3, Math.floor((currentWeek - 1) / 4));

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Seo title="Programme Dashboard | 11+ Standard" description="Your 16-week structured readiness programme." />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-programme-title">
            Structured Readiness Programme
          </h1>
          <p className="text-muted-foreground mt-1">16-week guided preparation roadmap</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-primary border-primary px-3 py-1 text-sm font-bold" data-testid="badge-current-week">
            Week {currentWeek} of 16
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-sm" data-testid="badge-days-remaining">
            <Clock className="h-3.5 w-3.5 mr-1" /> {daysRemaining} days left
          </Badge>
        </div>
      </div>

      {forecast > 0 && (
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[200px] border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Current Forecast</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-programme-forecast">{forecast}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[200px] border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${gap <= 0 ? 'bg-green-100' : 'bg-amber-100'}`}>
                <TrendingUp className={`h-6 w-6 ${gap <= 0 ? 'text-green-600' : 'text-amber-600'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Gap to 121</p>
                <p className={`text-2xl font-bold ${gap <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                  {gap <= 0 ? "Target met" : `${gap} pts`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-border/50">
          <CardTitle className="font-serif text-lg">16-Week Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 16 }, (_, i) => {
              const weekNum = i + 1;
              const milestone = milestones.find(m => m.week === weekNum);
              const phaseIdx = Math.floor(i / 4);
              const isCurrentWeek = weekNum === currentWeek;
              const isPast = weekNum < currentWeek;

              return (
                <div key={i} className="flex-1 relative group">
                  <div className={`h-3 rounded-sm ${
                    isPast ? PHASES[phaseIdx].color :
                    isCurrentWeek ? `${PHASES[phaseIdx].color} animate-pulse` :
                    'bg-slate-200'
                  }`} />
                  {milestone && (
                    <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      milestone.completedAt
                        ? 'bg-green-500 border-green-600 text-white'
                        : isCurrentWeek || isPast
                          ? 'bg-white border-primary text-primary'
                          : 'bg-white border-slate-300 text-slate-300'
                    }`}>
                      {milestone.completedAt ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    Wk {weekNum}{milestone ? `: ${milestone.title}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-6">
            {PHASES.map((phase, i) => (
              <div key={i} className={`flex-1 text-center p-3 rounded-lg border ${i === currentPhaseIdx ? 'border-primary bg-blue-50/50' : 'border-border/50'}`}>
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${phase.color}`} />
                <p className="text-xs font-bold text-primary">{phase.weeks}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{phase.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50">
            <CardTitle className="font-serif flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Week {currentWeek} Focus
            </CardTitle>
            <CardDescription>{planData ? `Phase: ${planData.phase}` : 'Loading plan...'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {planData ? (
              <>
                {planData.focusSkills.map((skill, i) => (
                  <div key={i} className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-primary">{skill.sessions}x {skill.durationMin}m {skill.skill}</div>
                      <div className="text-xs text-muted-foreground mt-1">Primary focus area</div>
                    </div>
                    <Button size="sm" variant="outline" asChild data-testid={`button-start-focus-${i}`}>
                      <Link href="/app/practice"><PlayCircle className="h-4 w-4 mr-1" /> Start</Link>
                    </Button>
                  </div>
                ))}
                {planData.secondarySkills.map((skill, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-slate-700">{skill.sessions}x {skill.durationMin}m {skill.skill}</div>
                      <div className="text-xs text-muted-foreground mt-1">Secondary skill</div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/app/practice"><PlayCircle className="h-4 w-4 mr-1" /> Start</Link>
                    </Button>
                  </div>
                ))}
                <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-amber-800">{planData.mixed.sessions}x {planData.mixed.durationMin}m Mixed Drill ({planData.mixed.mode})</div>
                    <div className="text-xs text-muted-foreground mt-1">Cross-skill timed practice</div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/app/practice"><PlayCircle className="h-4 w-4 mr-1" /> Start</Link>
                  </Button>
                </div>
                {planData.retest.due && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-bold text-sm text-green-800">Re-test due this week</div>
                    <div className="text-xs text-muted-foreground mt-1">Take a diagnostic to recalibrate your forecast</div>
                    <Button size="sm" className="mt-3" asChild>
                      <Link href="/app/diagnostic" data-testid="button-retest">Start Diagnostic</Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No plan available for this week yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Gap Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gv ? (
                <div>
                  <p className={`text-3xl font-bold ${gv.improving ? 'text-green-600' : 'text-amber-600'}`} data-testid="text-gap-velocity">
                    {gv.improving ? '-' : '+'}{Math.abs(gv.change)} pts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gap moved from {gv.oldGap} to {gv.newGap} over {gv.attempts} attempts
                  </p>
                  <p className={`text-xs font-medium mt-2 ${gv.improving ? 'text-green-600' : 'text-amber-600'}`}>
                    {gv.improving ? "Gap is closing" : "Gap needs attention"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete 2+ diagnostics to see gap velocity.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Forecast Stability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fs ? (
                <div>
                  <Badge variant={fs.status === 'Stable' ? 'default' : 'secondary'}
                    className={fs.status === 'Stable' ? 'bg-green-100 text-green-800' : fs.status === 'Improving' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}
                    data-testid="badge-stability"
                  >
                    {fs.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Std deviation: {fs.stdDev} pts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trend: {fs.trend === 'improving' ? 'Scores becoming more consistent' : 'Scores are steady'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete 2+ diagnostics to see stability.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-border/50">
          <CardTitle className="font-serif">Milestones</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <div key={m.id} className={`p-4 rounded-lg border ${m.completedAt ? 'border-green-200 bg-green-50/50' : m.week <= currentWeek ? 'border-primary/30 bg-blue-50/30' : 'border-border/50'}`} data-testid={`milestone-${m.week}`}>
                <div className="flex items-center gap-2 mb-2">
                  {m.completedAt ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className={`h-5 w-5 ${m.week <= currentWeek ? 'text-primary' : 'text-slate-300'}`} />
                  )}
                  <Badge variant="outline" className="text-xs">Week {m.week}</Badge>
                </div>
                <h4 className="font-bold text-sm text-primary">{m.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                {!m.completedAt && m.week <= currentWeek && m.linkedDiagnosticId && (
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href={`/app/diagnostic/${m.linkedDiagnosticId}/start`} data-testid={`button-milestone-start-${m.week}`}>
                      Start <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                )}
                {m.completedAt && (
                  <p className="text-xs text-green-600 font-medium mt-2">Completed {new Date(m.completedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {enrolment?.status === "completed" && (
        <div className="text-center py-8">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg" asChild data-testid="button-view-summary">
            <Link href="/app/programme/summary">
              View Programme Completion Summary <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

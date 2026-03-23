import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { Seo } from "../components/shared/Seo";
import {
  CheckCircle2, Circle, Clock, Target, TrendingUp, Activity,
  ArrowRight, Calendar, PlayCircle, Loader2, ChevronDown, ChevronUp, ListChecks
} from "lucide-react";
import { useState, useEffect } from "react";

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

type TaskItem = {
  id: number;
  week: number;
  taskType: string;
  title: string;
  description: string | null;
  skillId: string | null;
  targetCount: number;
  completedCount: number;
  status: string;
  completedAt: string | null;
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

function getPhaseForWeek(week: number) {
  const idx = Math.min(3, Math.floor((week - 1) / 4));
  return PHASES[idx];
}

export default function Programme() {
  const { user, isProgramme } = useAuth();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

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

  const { data: weeklyTasks = [] } = useQuery<TaskItem[]>({
    queryKey: ["/api/programme/tasks"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && isProgramme(),
  });

  const generateTasksMutation = useMutation({
    mutationFn: async (week: number) => {
      const res = await apiRequest("POST", "/api/programme/tasks/generate", { week });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/programme/tasks"] }),
    onError: () => {},
  });

  const enrolment = programme?.enrolment;
  const milestones = programme?.milestones || [];
  const plans = programme?.plans || [];
  const currentWeek = programme?.currentWeek || 1;
  const daysRemaining = programme?.daysRemaining || 0;
  const currentPlan = plans.find(p => p.week === currentWeek);
  const planData: WeeklyPlanData | null = currentPlan?.planJson || null;

  const currentWeekTasks = weeklyTasks.filter(t => t.week === currentWeek);
  const tasksCompleted = currentWeekTasks.filter(t => t.status === 'completed').length;
  const totalTasks = currentWeekTasks.length;

  useEffect(() => {
    if (programme?.enrolled && enrolment && currentWeekTasks.length === 0 && !generateTasksMutation.isPending) {
      generateTasksMutation.mutate(currentWeek);
    }
  }, [programme?.enrolled, enrolment, currentWeek, currentWeekTasks.length]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (programme && !programme.enrolled) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-primary font-serif mb-3">Young Scholar Programme</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The 24-week structured programme includes a personalised roadmap, weekly task plans, milestone diagnostics, and full platform access — everything needed to reach 121.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing">
              <Button className="bg-primary text-white px-8 h-11 font-semibold">View Pricing &amp; Enrol</Button>
            </Link>
            <Link href="/app">
              <Button variant="outline" className="h-11 px-6">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const safePlanData = planData ? {
    ...planData,
    focusSkills: planData.focusSkills || [],
    secondarySkills: planData.secondarySkills || [],
    mixed: planData.mixed || { sessions: 0, durationMin: 0, mode: 'N/A' },
    retest: planData.retest || { due: false }
  } : null;

  const forecast = progress?.latestForecast || 0;
  const gap = 121 - forecast;
  const gv = progress?.gapVelocity;
  const fs = progress?.forecastStability;

  const currentPhaseIdx = Math.min(3, Math.floor((currentWeek - 1) / 4));

  const milestonesByWeek: Record<number, Milestone[]> = {};
  for (let w = 1; w <= 16; w++) {
    milestonesByWeek[w] = [];
  }
  for (const m of milestones) {
    if (!milestonesByWeek[m.week]) milestonesByWeek[m.week] = [];
    milestonesByWeek[m.week].push(m);
  }

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  };

  const isWeekExpanded = (week: number) => {
    if (expandedWeeks.has(week)) return true;
    if (week === currentWeek && !expandedWeeks.has(-week)) return true;
    return false;
  };

  const toggleCurrentWeek = () => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(currentWeek)) {
        next.delete(currentWeek);
        next.add(-currentWeek);
      } else if (next.has(-currentWeek)) {
        next.delete(-currentWeek);
        next.add(currentWeek);
      } else {
        next.add(-currentWeek);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Seo title="Programme Dashboard | Bucks 11 Plus Tests" description="Your 16-week structured readiness programme." />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-programme-title">
            Young Scholar Programme
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
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {Array.from({ length: 16 }, (_, i) => {
              const weekNum = i + 1;
              const weekMilestones = milestonesByWeek[weekNum] || [];
              const keyMilestone = weekMilestones.find(m => m.milestoneType === "diagnostic" || m.milestoneType === "mock");
              const phaseIdx = Math.floor(i / 4);
              const isCurrentWeek = weekNum === currentWeek;
              const isPast = weekNum < currentWeek;

              return (
                <div key={i} className="flex-1 min-w-[2rem] relative group">
                  <div className={`h-3 rounded-sm ${
                    isPast ? PHASES[phaseIdx].color :
                    isCurrentWeek ? `${PHASES[phaseIdx].color} animate-pulse` :
                    'bg-slate-200'
                  }`} />
                  {keyMilestone && (
                    <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      keyMilestone.completedAt
                        ? 'bg-green-500 border-green-600 text-white'
                        : isCurrentWeek || isPast
                          ? 'bg-white border-primary text-primary'
                          : 'bg-white border-slate-300 text-slate-300'
                    }`}>
                      {keyMilestone.completedAt ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    Wk {weekNum}{keyMilestone ? `: ${keyMilestone.title}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
            {PHASES.map((phase, i) => (
              <div key={i} className={`text-center p-3 rounded-lg border ${i === currentPhaseIdx ? 'border-primary bg-blue-50/50' : 'border-border/50'}`}>
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
            {safePlanData ? (
              <>
                {safePlanData.focusSkills.map((skill: any, i: number) => (
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
                {safePlanData.secondarySkills.map((skill: any, i: number) => (
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
                    <div className="font-bold text-sm text-amber-800">{safePlanData.mixed.sessions}x {safePlanData.mixed.durationMin}m Mixed Drill ({safePlanData.mixed.mode})</div>
                    <div className="text-xs text-muted-foreground mt-1">Cross-skill timed practice</div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/app/practice"><PlayCircle className="h-4 w-4 mr-1" /> Start</Link>
                  </Button>
                </div>
                {safePlanData.retest.due && (
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
                    Gap moved from {gv.oldGap} to {gv.newGap}
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

      {totalTasks > 0 && (
        <Card className="border-border/60 shadow-sm" data-testid="card-weekly-tasks">
          <CardHeader className="bg-slate-50/50 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Week {currentWeek} Tasks
              </CardTitle>
              <Badge variant={tasksCompleted === totalTasks ? "default" : "secondary"} className={tasksCompleted === totalTasks ? "bg-green-100 text-green-800" : ""}>
                {tasksCompleted}/{totalTasks} completed
              </Badge>
            </div>
            <CardDescription>Your guided tasks for this week</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {currentWeekTasks.map((task) => (
              <div key={task.id} className={`p-4 rounded-lg border flex items-start gap-3 ${task.status === 'completed' ? 'border-green-200 bg-green-50/50' : 'border-border/60 bg-white'}`} data-testid={`task-item-${task.id}`}>
                <div className="mt-0.5">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-primary/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-bold text-sm ${task.status === 'completed' ? 'text-green-800' : 'text-primary'}`}>{task.title}</h4>
                    <Badge variant="outline" className={`text-[10px] ${
                      task.taskType === 'diagnostic' ? 'border-blue-300 text-blue-700' : 'border-slate-300 text-slate-600'
                    }`}>
                      {task.taskType === 'diagnostic' ? 'Diagnostic' : 'Drill'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  {task.status !== 'completed' && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (task.completedCount / task.targetCount) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{task.completedCount}/{task.targetCount}</span>
                    </div>
                  )}
                  {task.status === 'completed' && task.completedAt && (
                    <p className="text-xs text-green-600 font-medium mt-1">Completed {new Date(task.completedAt).toLocaleDateString()}</p>
                  )}
                </div>
                {task.status !== 'completed' && (
                  <Button size="sm" variant="outline" className="shrink-0" asChild>
                    <Link href={task.taskType === 'diagnostic' ? '/app/diagnostic' : '/app/practice'}>
                      <PlayCircle className="h-3 w-3 mr-1" /> {task.taskType === 'diagnostic' ? 'Start' : 'Practice'}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-border/50">
          <CardTitle className="font-serif">All Milestones — 16-Week Timeline</CardTitle>
          <CardDescription>Track your progress across every week of the programme</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {Array.from({ length: 16 }, (_, i) => {
            const weekNum = i + 1;
            const weekMilestones = milestonesByWeek[weekNum] || [];
            const phase = getPhaseForWeek(weekNum);
            const isPast = weekNum < currentWeek;
            const isCurrent = weekNum === currentWeek;
            const isFuture = weekNum > currentWeek;
            const completedCount = weekMilestones.filter(m => m.completedAt).length;
            const totalCount = weekMilestones.length;
            const allComplete = totalCount > 0 && completedCount === totalCount;
            const expanded = isCurrent
              ? isWeekExpanded(weekNum)
              : expandedWeeks.has(weekNum);

            return (
              <div key={weekNum} className={`rounded-lg border ${
                isCurrent ? 'border-primary/40 bg-blue-50/30 shadow-sm' :
                allComplete ? 'border-green-200 bg-green-50/20' :
                isPast ? 'border-border/50' :
                'border-border/30'
              }`} data-testid={`week-section-${weekNum}`}>
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => isCurrent ? toggleCurrentWeek() : toggleWeek(weekNum)}
                  data-testid={`button-toggle-week-${weekNum}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      allComplete ? 'bg-green-500 text-white' :
                      isCurrent ? `${phase.color} text-white` :
                      isPast ? 'bg-slate-300 text-white' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {allComplete ? <CheckCircle2 className="h-4 w-4" /> : weekNum}
                    </div>
                    <div>
                      <span className={`text-sm font-bold ${isCurrent ? 'text-primary' : isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                        Week {weekNum}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">{phase.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCurrent && (
                      <Badge variant="outline" className="text-primary border-primary text-[10px]">Current</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {completedCount}/{totalCount}
                    </span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {expanded && weekMilestones.length > 0 && (
                  <div className="px-4 pb-4 space-y-2">
                    {weekMilestones.map((m) => (
                      <div key={m.id} className={`p-3 rounded-lg border flex items-start gap-3 ${
                        m.completedAt ? 'border-green-200 bg-green-50/50' :
                        isCurrent ? 'border-primary/20 bg-white' :
                        'border-border/30 bg-white'
                      }`} data-testid={`milestone-${m.id}`}>
                        <div className="mt-0.5">
                          {m.completedAt ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className={`h-5 w-5 ${isCurrent || isPast ? 'text-primary/50' : 'text-slate-300'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-primary">{m.title}</h4>
                            <Badge variant="outline" className={`text-[10px] ${
                              m.milestoneType === 'diagnostic' ? 'border-blue-300 text-blue-700' :
                              m.milestoneType === 'mock' ? 'border-orange-300 text-orange-700' :
                              'border-slate-300 text-slate-600'
                            }`}>
                              {m.milestoneType === 'diagnostic' ? 'Diagnostic' :
                               m.milestoneType === 'mock' ? 'Mock Exam' : 'Practice'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                          {m.completedAt && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                              Completed {new Date(m.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {!m.completedAt && (isCurrent || isPast) && m.linkedDiagnosticId && (
                          <Button size="sm" className="shrink-0" asChild>
                            <Link href={`/app/diagnostic/${m.linkedDiagnosticId}/start`} data-testid={`button-milestone-start-${m.id}`}>
                              Start <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        )}
                        {!m.completedAt && (isCurrent || isPast) && m.milestoneType === 'practice' && (
                          <Button size="sm" variant="outline" className="shrink-0" asChild>
                            <Link href="/app/practice" data-testid={`button-practice-${m.id}`}>
                              <PlayCircle className="h-3 w-3 mr-1" /> Practice
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {expanded && weekMilestones.length === 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground">No milestones for this week.</p>
                  </div>
                )}
              </div>
            );
          })}
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

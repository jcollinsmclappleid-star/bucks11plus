import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  ArrowRight, AlertTriangle, TrendingUp, TrendingDown, Minus, Target, Shield, Clock, Brain
} from "lucide-react";

interface PDISection {
  pdi: number;
  mtq: number;
  paceRatio: number;
  paceSd: number;
  count: number;
}

interface CREntry {
  subRuleId: string;
  errors: number;
  shareOfTotal: number;
  weightedAccuracy: number;
  avgTime: number;
}

interface Priority {
  subRuleId: string;
  label: string;
  currentAccuracy: number;
  avgTime: number;
  impact10: number;
  recommendedDrill: string;
}

interface PressureEntry {
  skillId: string;
  practiceAcc: number;
  timedAcc: number;
  pressureDelta: number;
  pressureGapFlag: boolean;
}

interface TrajectoryPoint {
  date: string;
  rs: number;
}

interface Constraint {
  key: string;
  explanation: string;
  actionType: string;
}

interface AnalyticsData {
  available: boolean;
  message?: string;
  attempt: {
    wai: number;
    accEasy: number;
    accMedium: number;
    accHard: number;
    pdiOverall: number;
    pdiSections: Record<string, PDISection>;
    fatigue: { accDrop: number; paceDrift: number; fatigueFlag: boolean };
    fatigueBySectionFlags: Record<string, boolean>;
    cr: number;
    crScore: number;
    crTop5: CREntry[];
    rs: number;
    band: "Green" | "Amber" | "Red";
    bandLabel: string;
  };
  si: number;
  forecastConfidence: "High" | "Moderate" | "Emerging";
  trajectory: {
    gvRS: number;
    gvPerDay: number;
    trend: "Improving" | "Stable" | "Declining";
    points: TrajectoryPoint[];
  };
  constraint: {
    primary: Constraint;
    secondary: Constraint[];
  };
  priorities: Priority[];
  pressureProfile: { bySkill: PressureEntry[] };
  riskFlags: string[];
  executiveSummary: string;
  nextStepCTA: { label: string; action: string };
}

interface HeatmapEntry {
  subRuleId: string;
  skillId: string;
  weightedAccuracy: number;
  rawAccuracy: number;
  avgTime: number;
  attempts: number;
  volatility: number;
}

interface DetailData {
  available: boolean;
  heatmap: HeatmapEntry[];
}

const BAND_COLORS: Record<string, string> = {
  Green: "bg-emerald-500",
  Amber: "bg-amber-500",
  Red: "bg-red-500",
};

const BAND_TEXT_COLORS: Record<string, string> = {
  Green: "text-emerald-700",
  Amber: "text-amber-700",
  Red: "text-red-700",
};

const BAND_BG: Record<string, string> = {
  Green: "bg-emerald-50 border-emerald-200",
  Amber: "bg-amber-50 border-amber-200",
  Red: "bg-red-50 border-red-200",
};

function formatSubRule(sr: string): string {
  return sr.replace(/\./g, " > ").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function PDIMiniBar({ label, value }: { label: string; value: number }) {
  const barWidth = Math.min(100, Math.max(0, value));
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-10 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${barWidth}%` }} />
      </div>
      <span className="w-8 text-right font-medium">{Math.round(value)}</span>
    </div>
  );
}

function AccuracyBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <span className="w-10 text-right font-medium">{Math.round(value)}%</span>
    </div>
  );
}

function SummaryTab({ data }: { data: AnalyticsData }) {
  const { attempt, si, forecastConfidence, priorities, riskFlags, executiveSummary, nextStepCTA } = data;

  return (
    <div className="space-y-6">
      <Card className={`border ${BAND_BG[attempt.band]}`} data-testid="card-executive-summary">
        <CardContent className="pt-5 pb-4">
          <p className="text-sm leading-relaxed text-foreground" data-testid="text-executive-summary">
            {executiveSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="tile-readiness">
          <CardContent className="pt-5 pb-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Readiness</div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${BAND_COLORS[attempt.band]}`} data-testid="badge-readiness-band">
              {attempt.bandLabel}
            </div>
            <div className="text-3xl font-bold mt-2" data-testid="text-readiness-score">{attempt.rs}</div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </CardContent>
        </Card>

        <Card data-testid="tile-confidence">
          <CardContent className="pt-5 pb-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Confidence</div>
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold" data-testid="text-confidence">{forecastConfidence}</span>
            </div>
            <div className="text-3xl font-bold mt-2" data-testid="text-stability-index">{si}</div>
            <div className="text-xs text-muted-foreground">stability index</div>
          </CardContent>
        </Card>

        <Card data-testid="tile-pace">
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 text-center">Pace Discipline</div>
            <div className="text-2xl font-bold text-center mb-3" data-testid="text-pdi-overall">{Math.round(attempt.pdiOverall)}</div>
            <div className="space-y-1.5">
              {Object.entries(attempt.pdiSections).map(([section, s]) => (
                <PDIMiniBar key={section} label={section === "Verbal Reasoning" ? "VR" : section === "Non-Verbal Reasoning" ? "NVR" : "MA"} value={s.pdi} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="tile-difficulty">
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 text-center">Difficulty Tolerance</div>
            <div className="space-y-2 mt-3">
              <AccuracyBar label="Easy" value={attempt.accEasy} />
              <AccuracyBar label="Medium" value={attempt.accMedium} />
              <AccuracyBar label="Hard" value={attempt.accHard} />
            </div>
          </CardContent>
        </Card>
      </div>

      {priorities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Top Priorities</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {priorities.map((p, i) => (
              <Card key={p.subRuleId} data-testid={`card-priority-${i}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-semibold" data-testid={`text-priority-label-${i}`}>{p.label}</div>
                    <Target className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Current: {p.currentAccuracy}% accuracy, {p.avgTime}s avg
                  </div>
                  <div className="text-xs font-medium text-primary mb-3" data-testid={`text-impact-${i}`}>
                    ~+{p.impact10} readiness points
                  </div>
                  <div className="text-xs text-muted-foreground italic">{p.recommendedDrill}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {riskFlags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Flags</h3>
          <div className="flex flex-wrap gap-2">
            {riskFlags.map((flag, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-1.5 text-xs" data-testid={`flag-risk-${i}`}>
                <AlertTriangle className="h-3 w-3" />
                {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link href="/app/practice">
          <Button size="lg" data-testid="button-next-step">
            {nextStepCTA.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-md mx-auto">
        Accuracy adjusted for difficulty and cognitive load. Pace compared to timed section expectations. Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
      </p>
    </div>
  );
}

function InsightsTab({ data }: { data: AnalyticsData }) {
  const { constraint, attempt, trajectory, pressureProfile } = data;

  const trendIcon = trajectory.trend === "Improving"
    ? <TrendingUp className="h-4 w-4 text-emerald-600" />
    : trajectory.trend === "Declining"
    ? <TrendingDown className="h-4 w-4 text-red-600" />
    : <Minus className="h-4 w-4 text-muted-foreground" />;

  return (
    <div className="space-y-6">
      <Card data-testid="card-primary-constraint">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Primary Constraint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${constraint.primary.key === "none" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <div>
              <p className="text-sm font-medium mb-1" data-testid="text-constraint-key">
                {constraint.primary.key === "none" ? "No major constraint" : constraint.primary.key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-constraint-explanation">{constraint.primary.explanation}</p>
              <p className="text-xs text-primary mt-2">Recommended: {constraint.primary.actionType}</p>
            </div>
          </div>
          {constraint.secondary.length > 0 && (
            <div className="mt-4 pt-3 border-t space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Secondary Contributors</p>
              {constraint.secondary.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-muted-foreground/40 shrink-0" />
                  <p className="text-xs text-muted-foreground">{c.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {pressureProfile.bySkill.length > 0 && (
        <Card data-testid="card-pressure-profile">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pressure Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Drill accuracy versus timed diagnostic accuracy by skill.</p>
            <div className="space-y-2">
              {pressureProfile.bySkill.slice(0, 5).map(p => (
                <div key={p.skillId} className="flex items-center gap-3 text-xs">
                  <span className="w-24 truncate font-medium">{p.skillId.replace(/\./g, " > ")}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-muted-foreground">Practice: {p.practiceAcc}%</span>
                    <span className="text-muted-foreground">Timed: {p.timedAcc}%</span>
                  </div>
                  <span className={`font-medium ${p.pressureGapFlag ? "text-red-600" : "text-muted-foreground"}`}>
                    {p.pressureDelta > 0 ? "+" : ""}{p.pressureDelta}pp
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-pace-analysis">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pace Under Pressure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(attempt.pdiSections).map(([section, s]) => (
              <div key={section} className="flex items-center justify-between text-sm">
                <span className="font-medium">{section}</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>PDI: {Math.round(s.pdi)}</span>
                  <span>Ratio: {s.paceRatio}x</span>
                  <span>Avg: {s.mtq}s</span>
                  <span>SD: {s.paceSd}s</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Pace compared to timed section expectations.</p>
        </CardContent>
      </Card>

      <Card data-testid="card-trajectory">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Trajectory</CardTitle>
            <div className="flex items-center gap-1.5" data-testid="text-trend">
              {trendIcon}
              <span className="text-sm font-medium">{trajectory.trend}</span>
              {trajectory.gvRS !== 0 && (
                <span className="text-xs text-muted-foreground">({trajectory.gvRS > 0 ? "+" : ""}{trajectory.gvRS} RS)</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trajectory.points.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trajectory.points.map((p, i) => ({ ...p, label: `#${i + 1}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rs" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Readiness" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">Complete multiple diagnostics to see trajectory.</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-fatigue">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Fatigue Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Accuracy drift (last third vs first third)</p>
              <p className={`text-lg font-bold ${attempt.fatigue.accDrop <= -15 ? "text-red-600" : attempt.fatigue.accDrop < 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-acc-drop">
                {attempt.fatigue.accDrop > 0 ? "+" : ""}{attempt.fatigue.accDrop}pp
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pace drift (last third vs first third)</p>
              <p className={`text-lg font-bold ${attempt.fatigue.paceDrift >= 6 ? "text-red-600" : attempt.fatigue.paceDrift > 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-pace-drift">
                {attempt.fatigue.paceDrift > 0 ? "+" : ""}{attempt.fatigue.paceDrift}s
              </p>
            </div>
          </div>
          {attempt.fatigue.fatigueFlag && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" />
              Performance drops later in the paper. Consider practising full-length timed sets.
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">Stability reflects consistency across recent diagnostics.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailTab({ detailData }: { detailData: DetailData | undefined }) {
  const [mode, setMode] = useState<"accuracy" | "time" | "volatility">("accuracy");

  if (!detailData?.available || !detailData.heatmap.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Complete a diagnostic to see detailed sub-rule analysis.
        </CardContent>
      </Card>
    );
  }

  const grouped: Record<string, HeatmapEntry[]> = {};
  for (const entry of detailData.heatmap) {
    const skill = entry.skillId || "Other";
    if (!grouped[skill]) grouped[skill] = [];
    grouped[skill].push(entry);
  }

  function getCellColor(entry: HeatmapEntry): string {
    if (mode === "accuracy") {
      const v = entry.weightedAccuracy;
      if (v >= 80) return "bg-emerald-100 text-emerald-800";
      if (v >= 60) return "bg-emerald-50 text-emerald-700";
      if (v >= 40) return "bg-amber-50 text-amber-700";
      return "bg-red-50 text-red-700";
    }
    if (mode === "time") {
      const v = entry.avgTime;
      if (v <= 25) return "bg-emerald-100 text-emerald-800";
      if (v <= 35) return "bg-emerald-50 text-emerald-700";
      if (v <= 45) return "bg-amber-50 text-amber-700";
      return "bg-red-50 text-red-700";
    }
    const v = entry.volatility;
    if (v <= 5) return "bg-emerald-100 text-emerald-800";
    if (v <= 15) return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  }

  function getCellValue(entry: HeatmapEntry): string {
    if (mode === "accuracy") return `${entry.weightedAccuracy}%`;
    if (mode === "time") return `${entry.avgTime}s`;
    return `${entry.volatility}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">View:</span>
        <div className="flex gap-1">
          {(["accuracy", "time", "volatility"] as const).map(m => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
              data-testid={`button-heatmap-${m}`}
              className="text-xs"
            >
              {m === "accuracy" ? "Accuracy" : m === "time" ? "Time" : "Volatility"}
            </Button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([skill, entries]) => (
        <Card key={skill}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{formatSubRule(skill)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {entries.sort((a, b) => a.subRuleId.localeCompare(b.subRuleId)).map(entry => (
                <div
                  key={entry.subRuleId}
                  className={`rounded-lg px-3 py-2 ${getCellColor(entry)}`}
                  title={`Accuracy: ${entry.weightedAccuracy}% | Time: ${entry.avgTime}s | Attempts: ${entry.attempts} | Volatility: ${entry.volatility}`}
                  data-testid={`cell-heatmap-${entry.subRuleId}`}
                >
                  <div className="text-[10px] font-medium truncate mb-0.5">
                    {entry.subRuleId.split(".").pop()?.replace(/_/g, " ")}
                  </div>
                  <div className="text-sm font-bold">{getCellValue(entry)}</div>
                  <div className="text-[10px] opacity-70">{entry.attempts} attempts</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-muted-foreground text-center">
        {mode === "accuracy" && "Accuracy adjusted for difficulty and cognitive load."}
        {mode === "time" && "Average time per question in seconds."}
        {mode === "volatility" && "Standard deviation of accuracy across recent diagnostics. Lower is more consistent."}
      </p>
    </div>
  );
}

export default function ParentAnalytics() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  });

  const { data: detailData, isLoading: detailLoading } = useQuery<DetailData>({
    queryKey: ["/api/analytics/detail"],
    enabled: !!user,
  });

  if (authLoading || analyticsLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Please sign in to view analytics.</p>
        <Link href="/sign-in"><Button className="mt-4">Sign In</Button></Link>
      </div>
    );
  }

  if ((analyticsData as any)?.gated) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary font-serif mb-3" data-testid="heading-analytics-gated">Premium Parent Analytics</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep readiness insights exclusively for Young Scholar Programme families.
          </p>
        </div>

        <div className="relative rounded-2xl border border-border/60 overflow-hidden mb-8">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary font-serif mb-2">Included with the Young Scholar Programme</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Upgrade to unlock readiness scoring, pace discipline analysis, fatigue profiling, gap velocity tracking, and personalised improvement priorities.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-lg h-12 px-8" data-testid="button-upgrade-analytics">
                View Programme <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="p-6 opacity-40 pointer-events-none space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Readiness</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-semibold">Amber</div>
                <div className="text-3xl font-bold mt-2">78</div>
                <div className="text-xs text-muted-foreground">out of 100</div>
              </CardContent></Card>
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Confidence</div>
                <div className="text-sm font-semibold">Moderate</div>
                <div className="text-3xl font-bold mt-2">68</div>
                <div className="text-xs text-muted-foreground">stability index</div>
              </CardContent></Card>
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Pace Discipline</div>
                <div className="text-3xl font-bold">82</div>
              </CardContent></Card>
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Weighted Accuracy</div>
                <div className="text-3xl font-bold">0.72</div>
              </CardContent></Card>
            </div>
            <Card><CardContent className="p-4">
              <div className="text-sm font-bold text-primary mb-2">Top 3 Improvement Priorities</div>
              <div className="space-y-2">
                {["NVR: Spatial sequences — 42% accuracy", "VR: Letter patterns — 55% accuracy", "Maths: Ratio problems — 60% accuracy"].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="h-4 w-4 text-amber-500 shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-sm font-bold text-primary mb-2">Fatigue Analysis</div>
              <div className="flex gap-4">
                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-700">82%</div>
                  <div className="text-xs text-muted-foreground">First third accuracy</div>
                </div>
                <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">71%</div>
                  <div className="text-xs text-muted-foreground">Last third accuracy</div>
                </div>
              </div>
            </CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData?.available) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 text-center">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No analytics yet</h2>
        <p className="text-muted-foreground mb-4">{analyticsData?.message || "Complete a diagnostic to see your readiness analytics."}</p>
        <Link href="/app/diagnostic"><Button>Start a Diagnostic</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold" data-testid="heading-analytics">Readiness Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance insights based on your latest diagnostic</p>
        </div>
        <Link href="/app">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
          <TabsTrigger value="detail" data-testid="tab-detail">Detail</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <SummaryTab data={analyticsData} />
        </TabsContent>

        <TabsContent value="insights">
          <InsightsTab data={analyticsData} />
        </TabsContent>

        <TabsContent value="detail">
          <DetailTab detailData={detailData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

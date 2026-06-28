import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndicativeScoreCaveat } from "../components/shared/IndicativeScoreCaveat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  ArrowRight, AlertTriangle, TrendingUp, TrendingDown, Minus, Target, Shield, Clock, Brain,
  CheckCircle2, XCircle, Award, Flame, BookOpen, Layers, Hash, ChevronRight, Zap, Star
} from "lucide-react";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

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

const TOOLTIPS = {
  rs: "Readiness Score — a score out of 100 showing how prepared your child is for the 11+ based on their readiness results.",
  si: "How reliable this score is. The more tests your child has completed, the more confident we are in the number.",
  pdi: "Timing Score — shows how well your child manages their time during the test. 100 means perfectly paced. Below 60 suggests they are rushing through some sections or spending too long on others.",
  wai: "Accuracy adjusted for difficulty — getting harder questions right counts for more than easy ones.",
  cr: "Whether mistakes are spread across all topics or concentrated in just a few. A focused cluster is easier to fix.",
  mtq: "Average number of seconds spent on each question in this section.",
  vr: "Verbal Reasoning — word patterns, relationships and language logic questions.",
  nvr: "Non-Verbal Reasoning — shape patterns and spatial reasoning questions (no words).",
  ec: "English Comprehension — reading passages with questions on understanding, inference and vocabulary.",
  ma: "Mathematics — arithmetic, problem-solving and numerical reasoning.",
  pressureDelta: "The difference in accuracy between relaxed practice and timed test conditions. A large gap means pressure — not gaps in knowledge — is the problem.",
  pp: "Percentage points. For example, −8 means accuracy fell by 8% under timed conditions compared to practice.",
  fatigueFlag: "Your child's accuracy or speed drops noticeably in the second half of the test — a sign that stamina may be affecting their results.",
  gv: "How quickly your child's readiness is improving over time. A positive number means their practice score on the 121 scale is climbing toward 121.",
  primaryConstraint: "The single biggest thing currently holding your child back. Focusing here will have the largest impact on their score.",
  impact10: "How many readiness points your child could gain if accuracy on this topic improves by 10 percentage points.",
  weightedAccuracy: "Accuracy adjusted for difficulty — getting harder questions right counts for more than easier ones.",
  volatility: "How consistent your child is on this topic. High inconsistency means they get it right sometimes but not reliably.",
  paceRatio: "How fast your child is moving through questions compared to the expected pace. Above 1 = slower than ideal; below 1 = faster.",
  paceSd: "How much your child's speed varies between questions — a high value means they are rushing some and spending too long on others.",
};

const BAND_ICONS: Record<string, React.ReactNode> = {
  Green: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  Amber: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  Red: <Flame className="h-5 w-5 text-red-600" />,
};

const PRIORITY_COLORS = [
  { border: "border-red-200",   bg: "bg-red-50",    circle: "bg-red-500",    label: "bg-red-100 text-red-700" },
  { border: "border-amber-200", bg: "bg-amber-50",  circle: "bg-amber-500",  label: "bg-amber-100 text-amber-700" },
  { border: "border-blue-200",  bg: "bg-blue-50",   circle: "bg-blue-400",   label: "bg-blue-100 text-blue-700" },
];

function SummaryTab({ data }: { data: AnalyticsData }) {
  const { attempt, si, forecastConfidence, priorities, riskFlags, executiveSummary, nextStepCTA } = data;

  return (
    <div className="space-y-6">
      <IndicativeScoreCaveat variant="inline" />
      <Card className={`border-l-4 ${attempt.band === 'Green' ? 'border-l-emerald-500' : attempt.band === 'Amber' ? 'border-l-amber-500' : 'border-l-red-500'} ${BAND_BG[attempt.band]}`} data-testid="card-executive-summary">
        <CardContent className="pt-5 pb-4 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{BAND_ICONS[attempt.band]}</div>
          <p className="text-sm leading-relaxed text-foreground" data-testid="text-executive-summary">
            {executiveSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm overflow-hidden" data-testid="tile-readiness">
          <div className={`h-1 w-full ${BAND_COLORS[attempt.band]}`} />
          <CardContent className="pt-4 pb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`p-2 rounded-lg ${attempt.band === 'Green' ? 'bg-emerald-100 text-emerald-700' : attempt.band === 'Amber' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-center">
              Readiness
              <InfoTooltip text={TOOLTIPS.rs} />
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-semibold ${BAND_COLORS[attempt.band]}`} data-testid="badge-readiness-band">
              {attempt.bandLabel}
            </div>
            <div className="text-3xl font-bold mt-2" data-testid="text-readiness-score">{attempt.rs}</div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden" data-testid="tile-confidence">
          <div className="h-1 w-full bg-blue-500" />
          <CardContent className="pt-4 pb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-center">
              Score Reliability
              <InfoTooltip text={TOOLTIPS.si} />
            </div>
            <span className="text-sm font-semibold" data-testid="text-confidence">{forecastConfidence}</span>
            <div className="text-3xl font-bold mt-2" data-testid="text-stability-index">{si}</div>
            <div className="text-xs text-muted-foreground">based on all tests</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden" data-testid="tile-pace">
          <div className="h-1 w-full bg-violet-500" />
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 text-center flex items-center justify-center">
              Timing
              <InfoTooltip text={TOOLTIPS.pdi} />
            </div>
            <div className="text-2xl font-bold text-center mb-3" data-testid="text-pdi-overall">{Math.round(attempt.pdiOverall)}</div>
            <div className="space-y-1.5">
              {Object.entries(attempt.pdiSections).map(([section, s]) => {
                const shortLabel = section === "Verbal Reasoning" ? "VR"
                  : section === "Non-Verbal Reasoning" ? "NVR"
                  : section === "English Comprehension" ? "EC"
                  : "MA";
                const tooltip = section === "Verbal Reasoning" ? TOOLTIPS.vr
                  : section === "Non-Verbal Reasoning" ? TOOLTIPS.nvr
                  : section === "English Comprehension" ? TOOLTIPS.ec
                  : TOOLTIPS.ma;
                return (
                  <div key={section} className="flex items-center gap-2 text-xs">
                    <span className="w-10 text-muted-foreground shrink-0 flex items-center">
                      {shortLabel}
                      <InfoTooltip text={tooltip} />
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.pdi >= 80 ? "bg-emerald-500" : s.pdi >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, Math.max(0, s.pdi))}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium">{Math.round(s.pdi)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden" data-testid="tile-difficulty">
          <div className="h-1 w-full bg-emerald-500" />
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 text-center flex items-center justify-center">
              Harder Questions
              <InfoTooltip text="How accurately your child answers Easy, Medium, and Hard questions. A large drop on Hard questions shows where extra practice is needed." />
            </div>
            <div className="space-y-2 mt-1">
              <AccuracyBar label="Easy" value={attempt.accEasy} />
              <AccuracyBar label="Medium" value={attempt.accMedium} />
              <AccuracyBar label="Hard" value={attempt.accHard} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground bg-slate-50 rounded-xl py-3 px-4 border border-border/40">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground flex items-center">
            Difficulty-adjusted score
            <InfoTooltip text={TOOLTIPS.wai} />
          </span>
          <span className="font-bold text-primary" data-testid="text-wai">{attempt.wai}</span>
        </span>
        <span className="w-px h-4 bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground flex items-center">
            Topic concentration
            <InfoTooltip text={TOOLTIPS.cr} />
          </span>
          <span className="font-bold text-primary" data-testid="text-cr">{attempt.crScore}</span>
        </span>
      </div>

      {priorities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1">
            Where to Focus Next
            <InfoTooltip text="The topics where focused practice will have the biggest impact on your child's score. The improvement estimate is based on a 10 percentage point accuracy increase on each topic." />
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {priorities.map((p, i) => {
              const pc = PRIORITY_COLORS[i] || PRIORITY_COLORS[2];
              return (
                <Card key={p.subRuleId} className={`border ${pc.border} ${pc.bg} shadow-sm`} data-testid={`card-priority-${i}`}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-7 h-7 rounded-full ${pc.circle} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                        {i + 1}
                      </div>
                      <div className="text-sm font-semibold leading-snug" data-testid={`text-priority-label-${i}`}>{p.label}</div>
                    </div>
                    <div className="ml-10">
                      <div className="text-xs text-muted-foreground mb-2">
                        Getting <strong>{p.currentAccuracy}%</strong> right · <strong>{p.avgTime}s</strong> per question
                      </div>
                      <div className={`text-xs font-semibold mb-2 px-2 py-1 rounded-lg inline-flex items-center gap-1 ${pc.label}`} data-testid={`text-impact-${i}`}>
                        <Star className="h-3 w-3" />
                        Could add ~+{p.impact10} points
                        <InfoTooltip text={TOOLTIPS.impact10} />
                      </div>
                      <div className="text-xs text-muted-foreground italic">{p.recommendedDrill}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {riskFlags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Things to Watch</h3>
          <div className="space-y-2">
            {riskFlags.map((flag, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2.5 text-sm" data-testid={`flag-risk-${i}`}>
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link href="/app/practice">
          <Button size="lg" className="gap-2" data-testid="button-next-step">
            {nextStepCTA.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-md mx-auto">
        Accuracy adjusted for difficulty and cognitive load. Pace compared to timed section expectations. Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
      </p>
    </div>
  );
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Verbal Reasoning":      <Brain className="h-4 w-4" />,
  "Non-Verbal Reasoning":  <Layers className="h-4 w-4" />,
  "Mathematics":           <Hash className="h-4 w-4" />,
  "English Comprehension": <BookOpen className="h-4 w-4" />,
};

const SECTION_COLORS: Record<string, string> = {
  "Verbal Reasoning":      "bg-violet-100 text-violet-700",
  "Non-Verbal Reasoning":  "bg-blue-100 text-blue-700",
  "Mathematics":           "bg-emerald-100 text-emerald-700",
  "English Comprehension": "bg-amber-100 text-amber-700",
};

function InsightsTab({ data }: { data: AnalyticsData }) {
  const { constraint, attempt, trajectory, pressureProfile } = data;

  const trendIcon = trajectory.trend === "Improving"
    ? <TrendingUp className="h-4 w-4 text-emerald-600" />
    : trajectory.trend === "Declining"
    ? <TrendingDown className="h-4 w-4 text-red-600" />
    : <Minus className="h-4 w-4 text-muted-foreground" />;

  const trendBadge = trajectory.trend === "Improving"
    ? "bg-emerald-100 text-emerald-800"
    : trajectory.trend === "Declining"
    ? "bg-red-100 text-red-800"
    : "bg-slate-100 text-slate-700";

  return (
    <div className="space-y-6">
      <Card className={`border-l-4 ${constraint.primary.key === "none" ? "border-l-emerald-500 bg-emerald-50/40" : "border-l-amber-500 bg-amber-50/40"}`} data-testid="card-primary-constraint">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${constraint.primary.key === "none" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {constraint.primary.key === "none" ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
            </div>
            Main Focus Area
            <InfoTooltip text={TOOLTIPS.primaryConstraint} />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm font-semibold mb-1" data-testid="text-constraint-key">
            {constraint.primary.key === "none" ? "No major weakness identified" : constraint.primary.key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <p className="text-sm text-muted-foreground mb-3" data-testid="text-constraint-explanation">{constraint.primary.explanation}</p>
          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-white border border-primary/20 rounded-lg px-3 py-1.5 w-fit">
            <ChevronRight className="h-3 w-3" />
            Suggested next step: {constraint.primary.actionType}
          </div>
          {constraint.secondary.length > 0 && (
            <div className="mt-4 pt-3 border-t space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Also worth noting</p>
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
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                <Flame className="h-4 w-4" />
              </div>
              Under Exam Conditions
              <InfoTooltip text={TOOLTIPS.pressureDelta} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">How accuracy changes from relaxed practice to timed test conditions. Red = drops significantly under pressure.</p>
            <div className="space-y-4">
              {pressureProfile.bySkill.slice(0, 5).map(p => {
                const subjectLabel = p.skillId.replace(/\./g, " ").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                const iconColor = SECTION_COLORS[subjectLabel] || "bg-slate-100 text-slate-600";
                const icon = SECTION_ICONS[subjectLabel] || <Brain className="h-4 w-4" />;
                const delta = p.pressureDelta;
                return (
                  <div key={p.skillId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${iconColor}`}>{icon}</div>
                        <span className="text-sm font-medium">{subjectLabel}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${p.pressureGapFlag ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {delta > 0 ? "+" : ""}{delta}%
                        <InfoTooltip text={TOOLTIPS.pp} />
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-1">Relaxed practice</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${p.practiceAcc}%` }} />
                          </div>
                          <span className="font-semibold text-emerald-700 w-8 text-right">{p.practiceAcc}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Timed test</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${p.pressureGapFlag ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${p.timedAcc}%` }} />
                          </div>
                          <span className={`font-semibold w-8 text-right ${p.pressureGapFlag ? "text-red-700" : "text-emerald-700"}`}>{p.timedAcc}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-pace-analysis">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 bg-violet-100 text-violet-700 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
            Time Management by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(attempt.pdiSections).map(([section, s]) => {
              const iconColor = SECTION_COLORS[section] || "bg-slate-100 text-slate-600";
              const icon = SECTION_ICONS[section] || <Brain className="h-4 w-4" />;
              const pdiColor = s.pdi >= 80 ? "bg-emerald-500" : s.pdi >= 60 ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={section} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${iconColor}`}>{icon}</div>
                      <span className="text-sm font-medium">{section}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">{s.mtq}s per question<InfoTooltip text={TOOLTIPS.mtq} /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pdiColor}`} style={{ width: `${Math.min(100, Math.max(0, s.pdi))}%` }} />
                    </div>
                    <span className="text-xs font-semibold w-12 text-right">{Math.round(s.pdi)}/100<InfoTooltip text={TOOLTIPS.pdi} /></span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 bg-slate-50 rounded-lg px-3 py-2">A timing score of 100 = perfectly paced. Green is ideal; red means they are rushing or spending too long on questions.</p>
        </CardContent>
      </Card>

      <Card data-testid="card-trajectory">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
              Score Over Time
              <InfoTooltip text={TOOLTIPS.gv} />
            </CardTitle>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trendBadge}`} data-testid="text-trend">
              {trendIcon}
              {trajectory.trend}
              {trajectory.gvRS !== 0 && (
                <span className="opacity-80">({trajectory.gvRS > 0 ? "+" : ""}{trajectory.gvRS} pts)</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trajectory.points.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trajectory.points.map((p, i) => ({ ...p, label: `Test ${i + 1}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="rs" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Readiness Score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">Complete more than one readiness check to see how your child's score is changing over time.</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-fatigue">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <Zap className="h-4 w-4" />
            </div>
            Stamina
            <InfoTooltip text={TOOLTIPS.fatigueFlag} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`rounded-xl p-4 text-center ${attempt.fatigue.accDrop <= -15 ? "bg-red-50 border border-red-100" : attempt.fatigue.accDrop < 0 ? "bg-amber-50 border border-amber-100" : "bg-emerald-50 border border-emerald-100"}`}>
              <p className="text-xs text-muted-foreground mb-1">Accuracy: first vs second half</p>
              <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${attempt.fatigue.accDrop <= -15 ? "text-red-600" : attempt.fatigue.accDrop < 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-acc-drop">
                {attempt.fatigue.accDrop > 0 ? "+" : ""}{attempt.fatigue.accDrop}%
                <InfoTooltip text={TOOLTIPS.pp} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{attempt.fatigue.accDrop >= 0 ? "Holding up well" : attempt.fatigue.accDrop >= -10 ? "Slight drop" : "Significant drop"}</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${attempt.fatigue.paceDrift >= 6 ? "bg-red-50 border border-red-100" : attempt.fatigue.paceDrift > 0 ? "bg-amber-50 border border-amber-100" : "bg-emerald-50 border border-emerald-100"}`}>
              <p className="text-xs text-muted-foreground mb-1">Speed: first vs second half</p>
              <p className={`text-2xl font-bold ${attempt.fatigue.paceDrift >= 6 ? "text-red-600" : attempt.fatigue.paceDrift > 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-pace-drift">
                {attempt.fatigue.paceDrift > 0 ? "+" : ""}{attempt.fatigue.paceDrift}s
              </p>
              <p className="text-xs text-muted-foreground mt-1">{attempt.fatigue.paceDrift <= 0 ? "Consistent pace" : attempt.fatigue.paceDrift < 6 ? "Getting slightly slower" : "Slowing noticeably"}</p>
            </div>
          </div>
          {attempt.fatigue.fatigueFlag && (
            <div className="mt-0 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" />
              Your child's performance drops toward the end of the test. Practising full-length timed sessions can help build stamina.
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">Comparing the first and second halves of the test shows whether tiredness is a factor.</p>
        </CardContent>
      </Card>
    </div>
  );
}

const SKILL_DISPLAY_NAMES: Record<string, string> = {
  VR: "Verbal Reasoning",
  NVR: "Non-Verbal Reasoning",
  EC: "English Comprehension",
  MA: "Mathematics",
  verbal: "Verbal Reasoning",
  nonverbal: "Non-Verbal Reasoning",
  comprehension: "English Comprehension",
  math: "Mathematics",
  mathematics: "Mathematics",
  Other: "Other Topics",
};

function getSkillDisplayName(skillId: string): string {
  if (SKILL_DISPLAY_NAMES[skillId]) return SKILL_DISPLAY_NAMES[skillId];
  const first = skillId.split(".")[0];
  if (SKILL_DISPLAY_NAMES[first]) return SKILL_DISPLAY_NAMES[first];
  return skillId.replace(/\./g, " — ").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function getTopicLabel(subRuleId: string): string {
  const raw = subRuleId.split(".").pop() ?? subRuleId;
  return raw.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function DetailTab({ detailData }: { detailData: DetailData | undefined }) {
  const [mode, setMode] = useState<"accuracy" | "time" | "volatility">("accuracy");

  if (!detailData?.available || !detailData.heatmap.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Complete a readiness check to see how your child is performing on each topic.
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

  function getRowColor(entry: HeatmapEntry): { bar: string; badge: string; label: string } {
    if (mode === "accuracy") {
      const v = entry.weightedAccuracy;
      if (v >= 80) return { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800", label: "Strong" };
      if (v >= 60) return { bar: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700", label: "Good" };
      if (v >= 40) return { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", label: "Developing" };
      return { bar: "bg-red-400", badge: "bg-red-50 text-red-700", label: "Needs focus" };
    }
    if (mode === "time") {
      const v = entry.avgTime;
      if (v <= 25) return { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800", label: "On target" };
      if (v <= 35) return { bar: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700", label: "Acceptable" };
      if (v <= 45) return { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", label: "A little slow" };
      return { bar: "bg-red-400", badge: "bg-red-50 text-red-700", label: "Too slow" };
    }
    const v = entry.volatility;
    if (v <= 5) return { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800", label: "Reliable" };
    if (v <= 15) return { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", label: "Sometimes" };
    return { bar: "bg-red-400", badge: "bg-red-50 text-red-700", label: "Inconsistent" };
  }

  function getRowValue(entry: HeatmapEntry): string {
    if (mode === "accuracy") return `${entry.weightedAccuracy}% correct`;
    if (mode === "time") return `${entry.avgTime}s per question`;
    return entry.volatility <= 5 ? "Gets it reliably" : entry.volatility <= 15 ? "Sometimes gets it" : "Hit-and-miss";
  }

  function getBarWidth(entry: HeatmapEntry): number {
    if (mode === "accuracy") return Math.min(100, entry.weightedAccuracy);
    if (mode === "time") return Math.min(100, Math.max(0, 100 - (entry.avgTime - 10) * 2));
    return Math.min(100, Math.max(0, 100 - entry.volatility * 3));
  }

  const modeDescriptions = {
    accuracy: "How many questions your child is getting right in each topic. Green = strong, amber = developing, red = needs more practice.",
    time: "How quickly your child works through each topic. Green = on target for the test timing, red = spending too long on questions.",
    volatility: "Whether your child's results are consistent or hit-and-miss. Green = reliably correct, red = getting it right sometimes but not always.",
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/50 bg-slate-50 p-4 space-y-3">
        <p className="text-sm font-medium text-slate-700">
          This view shows how your child is performing on each topic within every subject — broken down by accuracy, speed, and consistency.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />Strong / On target</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />Developing / Some gaps</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />Needs more practice</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground shrink-0">Show me:</span>
        <div className="flex flex-wrap gap-1.5">
          {(["accuracy", "time", "volatility"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              data-testid={`button-heatmap-${m}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                mode === m
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-700 border-border hover:border-primary/40"
              }`}
            >
              {m === "accuracy" ? "How many they're getting right" : m === "time" ? "How fast they're working" : "How consistent they are"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-2.5 text-xs text-blue-800">
        {modeDescriptions[mode]}
      </div>

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([skill, entries]) => {
        const displayName = getSkillDisplayName(skill);
        const subjectIcon = SECTION_ICONS[displayName] || <Brain className="h-4 w-4" />;
        const subjectColor = SECTION_COLORS[displayName] || "bg-slate-100 text-slate-600";
        return (
        <Card key={skill} data-testid={`card-subject-${skill}`}>
          <CardHeader className="pb-3 border-b border-border/40 bg-slate-50/50">
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${subjectColor}`}>{subjectIcon}</div>
              {displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {entries.sort((a, b) => {
              if (mode === "accuracy") return a.weightedAccuracy - b.weightedAccuracy;
              if (mode === "time") return b.avgTime - a.avgTime;
              return b.volatility - a.volatility;
            }).map(entry => {
              const colors = getRowColor(entry);
              const barW = getBarWidth(entry);
              const label = getTopicLabel(entry.subRuleId);
              return (
                <div
                  key={entry.subRuleId}
                  className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0"
                  data-testid={`row-topic-${entry.subRuleId}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800 leading-snug">{label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0 ${colors.badge}`}>
                        {colors.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${barW}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 w-36 text-right">{getRowValue(entry)} · {entry.attempts} {entry.attempts === 1 ? "question" : "questions"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        );
      })}

      <p className="text-xs text-muted-foreground text-center pb-2">
        Topics are sorted by those needing the most attention first. Accuracy is adjusted for question difficulty — harder questions count for more.
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
            Included with Bucks Plus Edge — available from £35/month or £279/year.
          </p>
        </div>

        <div className="relative rounded-2xl border border-border/60 overflow-hidden mb-8">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary font-serif mb-2">Included with Bucks Plus Edge</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Upgrade to unlock readiness scoring, timing analysis, stamina profiling, practice score tracking on the 121 scale, and personalised improvement priorities.
            </p>
            <Link href="/pricing">
              <Button variant="cta" size="lg"  data-testid="button-upgrade-analytics">
                View Pricing <ArrowRight className="ml-2 h-5 w-5" />
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
                <div className="text-xs text-muted-foreground uppercase mb-2">Score Reliability</div>
                <div className="text-sm font-semibold">Good</div>
                <div className="text-3xl font-bold mt-2">High</div>
                <div className="text-xs text-muted-foreground">4 tests taken</div>
              </CardContent></Card>
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Timing Score</div>
                <div className="text-3xl font-bold">82</div>
                <div className="text-xs text-muted-foreground">Well-paced</div>
              </CardContent></Card>
              <Card><CardContent className="pt-5 pb-4 text-center">
                <div className="text-xs text-muted-foreground uppercase mb-2">Difficulty-adjusted</div>
                <div className="text-3xl font-bold">74%</div>
                <div className="text-xs text-muted-foreground">accuracy</div>
              </CardContent></Card>
            </div>
            <Card><CardContent className="p-4">
              <div className="text-sm font-bold text-primary mb-2">Where to Focus Next</div>
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
              <div className="text-sm font-bold text-primary mb-2">Stamina</div>
              <div className="flex gap-4">
                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-700">82%</div>
                  <div className="text-xs text-muted-foreground">First half accuracy</div>
                </div>
                <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">71%</div>
                  <div className="text-xs text-muted-foreground">Second half accuracy</div>
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
        <p className="text-muted-foreground mb-4">{analyticsData?.message || "Complete a readiness check to see your readiness analytics."}</p>
        <Link href="/app/diagnostic"><Button>Start a Readiness Check</Button></Link>
      </div>
    );
  }

  const bandGradient = analyticsData.attempt.band === 'Green'
    ? "from-emerald-900 to-emerald-700"
    : analyticsData.attempt.band === 'Red'
    ? "from-red-900 to-red-700"
    : "from-slate-900 to-slate-700";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className={`rounded-2xl bg-gradient-to-br ${bandGradient} text-white p-6 shadow-lg relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/30" />
          <div className="absolute -bottom-12 -left-4 w-36 h-36 rounded-full bg-white/20" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${analyticsData.attempt.band === 'Green' ? 'bg-emerald-400/30 text-emerald-100' : analyticsData.attempt.band === 'Red' ? 'bg-red-400/30 text-red-100' : 'bg-amber-400/30 text-amber-100'}`}>
                {analyticsData.attempt.bandLabel}
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold" data-testid="heading-analytics">How Is My Child Doing?</h1>
            <p className="text-sm text-white/70 mt-1">Based on your child's most recent readiness results</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center bg-white/10 rounded-xl px-4 py-2 border border-white/20">
              <div className="text-2xl font-bold">{analyticsData.attempt.rs}</div>
              <div className="text-xs text-white/70">Readiness / 100</div>
            </div>
            <Link href="/app">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 h-12">
          <TabsTrigger value="summary" data-testid="tab-summary" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights" className="text-sm">What This Means</TabsTrigger>
          <TabsTrigger value="detail" data-testid="tab-detail" className="text-sm">Topic Breakdown</TabsTrigger>
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

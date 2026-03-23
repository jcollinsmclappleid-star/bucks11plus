import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  ArrowRight, AlertTriangle, TrendingUp, TrendingDown, Minus, Target, Shield, Clock, Brain
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
  rs: "Readiness Score — a score out of 100 showing how prepared your child is for the 11+ based on their diagnostic results.",
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
  gv: "How quickly your child's readiness is improving over time. A positive number means they are making good progress toward the 121 qualifying mark.",
  primaryConstraint: "The single biggest thing currently holding your child back. Focusing here will have the largest impact on their score.",
  impact10: "How many readiness points your child could gain if accuracy on this topic improves by 10 percentage points.",
  weightedAccuracy: "Accuracy adjusted for difficulty — getting harder questions right counts for more than easier ones.",
  volatility: "How consistent your child is on this topic. High inconsistency means they get it right sometimes but not reliably.",
  paceRatio: "How fast your child is moving through questions compared to the expected pace. Above 1 = slower than ideal; below 1 = faster.",
  paceSd: "How much your child's speed varies between questions — a high value means they are rushing some and spending too long on others.",
};

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
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-center">
              Readiness
              <InfoTooltip text={TOOLTIPS.rs} />
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${BAND_COLORS[attempt.band]}`} data-testid="badge-readiness-band">
              {attempt.bandLabel}
            </div>
            <div className="text-3xl font-bold mt-2" data-testid="text-readiness-score">{attempt.rs}</div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </CardContent>
        </Card>

        <Card data-testid="tile-confidence">
          <CardContent className="pt-5 pb-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-center">
              Score Reliability
              <InfoTooltip text={TOOLTIPS.si} />
            </div>
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold" data-testid="text-confidence">{forecastConfidence}</span>
            </div>
            <div className="text-3xl font-bold mt-2" data-testid="text-stability-index">{si}</div>
            <div className="text-xs text-muted-foreground">based on all tests</div>
          </CardContent>
        </Card>

        <Card data-testid="tile-pace">
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 text-center flex items-center justify-center">
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

        <Card data-testid="tile-difficulty">
          <CardContent className="pt-5 pb-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 text-center flex items-center justify-center">
              Harder Questions
              <InfoTooltip text="How accurately your child answers Easy, Medium, and Hard questions. A large drop on Hard questions shows where extra practice is needed." />
            </div>
            <div className="space-y-2 mt-3">
              <AccuracyBar label="Easy" value={attempt.accEasy} />
              <AccuracyBar label="Medium" value={attempt.accMedium} />
              <AccuracyBar label="Hard" value={attempt.accHard} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="font-medium text-foreground flex items-center">
            Difficulty-adjusted score
            <InfoTooltip text={TOOLTIPS.wai} />
          </span>
          <span data-testid="text-wai">{attempt.wai}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium text-foreground flex items-center">
            Topic concentration
            <InfoTooltip text={TOOLTIPS.cr} />
          </span>
          <span data-testid="text-cr">{attempt.crScore}</span>
        </span>
      </div>

      {priorities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center">
            Where to Focus Next
            <InfoTooltip text="The topics where focused practice will have the biggest impact on your child's score. The improvement estimate is based on a 10 percentage point accuracy increase on each topic." />
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {priorities.map((p, i) => (
              <Card key={p.subRuleId} data-testid={`card-priority-${i}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-semibold" data-testid={`text-priority-label-${i}`}>{p.label}</div>
                    <Target className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Getting {p.currentAccuracy}% right · {p.avgTime}s per question on average
                  </div>
                  <div className="text-xs font-medium text-primary mb-3 flex items-center" data-testid={`text-impact-${i}`}>
                    Could add ~+{p.impact10} points to readiness
                    <InfoTooltip text={TOOLTIPS.impact10} />
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
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Things to Watch</h3>
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
          <CardTitle className="text-base flex items-center">
            Main Focus Area
            <InfoTooltip text={TOOLTIPS.primaryConstraint} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${constraint.primary.key === "none" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <div>
              <p className="text-sm font-medium mb-1" data-testid="text-constraint-key">
                {constraint.primary.key === "none" ? "No major weakness identified" : constraint.primary.key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-constraint-explanation">{constraint.primary.explanation}</p>
              <p className="text-xs text-primary mt-2">Suggested next step: {constraint.primary.actionType}</p>
            </div>
          </div>
          {constraint.secondary.length > 0 && (
            <div className="mt-4 pt-3 border-t space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Also worth noting</p>
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
            <CardTitle className="text-base flex items-center">
              Under Exam Conditions
              <InfoTooltip text={TOOLTIPS.pressureDelta} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">How accuracy changes from relaxed practice to timed test conditions, by subject.</p>
            <div className="space-y-2">
              {pressureProfile.bySkill.slice(0, 5).map(p => (
                <div key={p.skillId} className="flex items-center gap-3 text-xs">
                  <span className="w-24 truncate font-medium">{p.skillId.replace(/\./g, " > ")}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-muted-foreground">Practice: {p.practiceAcc}%</span>
                    <span className="text-muted-foreground">Timed: {p.timedAcc}%</span>
                  </div>
                  <span className={`font-medium flex items-center ${p.pressureGapFlag ? "text-red-600" : "text-muted-foreground"}`}>
                    {p.pressureDelta > 0 ? "+" : ""}{p.pressureDelta}%
                    <InfoTooltip text={TOOLTIPS.pp} />
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-pace-analysis">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Time Management by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(attempt.pdiSections).map(([section, s]) => (
              <div key={section} className="flex items-center justify-between text-sm">
                <span className="font-medium">{section}</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    Timing score: {Math.round(s.pdi)}
                    <InfoTooltip text={TOOLTIPS.pdi} />
                  </span>
                  <span className="flex items-center">
                    Avg: {s.mtq}s per question
                    <InfoTooltip text={TOOLTIPS.mtq} />
                  </span>
                  <span className="flex items-center">
                    Variation: {s.paceSd}s
                    <InfoTooltip text={TOOLTIPS.paceSd} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">A timing score of 100 means perfectly paced across the section.</p>
        </CardContent>
      </Card>

      <Card data-testid="card-trajectory">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              Score Over Time
              <InfoTooltip text={TOOLTIPS.gv} />
            </CardTitle>
            <div className="flex items-center gap-1.5" data-testid="text-trend">
              {trendIcon}
              <span className="text-sm font-medium">{trajectory.trend}</span>
              {trajectory.gvRS !== 0 && (
                <span className="text-xs text-muted-foreground">({trajectory.gvRS > 0 ? "+" : ""}{trajectory.gvRS} points)</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trajectory.points.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trajectory.points.map((p, i) => ({ ...p, label: `Test ${i + 1}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="rs" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Readiness Score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">Complete more than one diagnostic to see how your child's score is changing over time.</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-fatigue">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            Stamina
            <InfoTooltip text={TOOLTIPS.fatigueFlag} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Accuracy in second half vs first half</p>
              <p className={`text-lg font-bold flex items-center ${attempt.fatigue.accDrop <= -15 ? "text-red-600" : attempt.fatigue.accDrop < 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-acc-drop">
                {attempt.fatigue.accDrop > 0 ? "+" : ""}{attempt.fatigue.accDrop}%
                <InfoTooltip text={TOOLTIPS.pp} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Speed in second half vs first half</p>
              <p className={`text-lg font-bold ${attempt.fatigue.paceDrift >= 6 ? "text-red-600" : attempt.fatigue.paceDrift > 0 ? "text-amber-600" : "text-emerald-600"}`} data-testid="text-fatigue-pace-drift">
                {attempt.fatigue.paceDrift > 0 ? "+" : ""}{attempt.fatigue.paceDrift}s
              </p>
            </div>
          </div>
          {attempt.fatigue.fatigueFlag && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
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
          Complete a diagnostic to see how your child is performing on each topic.
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

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([skill, entries]) => (
        <Card key={skill} data-testid={`card-subject-${skill}`}>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-serif">{getSkillDisplayName(skill)}</CardTitle>
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
      ))}

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
          <h1 className="text-2xl font-serif font-bold" data-testid="heading-analytics">How Is My Child Doing?</h1>
          <p className="text-sm text-muted-foreground mt-1">Based on your child's most recent diagnostic results</p>
        </div>
        <Link href="/app">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="summary" data-testid="tab-summary">Overview</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">What This Means</TabsTrigger>
          <TabsTrigger value="detail" data-testid="tab-detail">Topic Breakdown</TabsTrigger>
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

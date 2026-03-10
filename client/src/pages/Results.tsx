import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Download, BarChart2, Target, SlidersHorizontal, Sparkles, Clock, Loader2, CheckCircle2, TrendingUp, FileText } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

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

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user, isProgramme, hasPaidAccess } = useAuth();
  const target = 121;

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!id,
  });

  const { data: programme } = useQuery<ProgrammeData>({
    queryKey: ["/api/programme"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isProgramme(),
  });

  const [simulatorValue, setSimulatorValue] = useState([10]);
  const [selectedSkill, setSelectedSkill] = useState("");

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Assessment Results | 11+ Standard" description="View your recent diagnostic results and updated readiness forecast." />

      {matchingMilestone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3" data-testid="banner-milestone">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="font-bold text-green-800">Programme Milestone: {matchingMilestone.title}</p>
            <p className="text-sm text-green-600">This attempt can be linked to your Week {matchingMilestone.week} milestone.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-results-title">Diagnostic Results</h1>
          <p className="text-muted-foreground mt-2">
            {session.diagnosticId.includes("mini") ? "Mini" : "Full"} Diagnostic completed on {session.completedAt ? new Date(session.completedAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="flex gap-3">
          {hasPaidAccess() && (
            <Button variant="outline" className="gap-2" data-testid="button-download-pdf">
              <Download className="h-4 w-4" /> PDF Report
            </Button>
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
                  <>Your child is currently showing a <strong className="text-primary">{gap} point gap</strong> to the 121 standard.</>
                ) : (
                  <>Your child is <strong className="text-green-700">meeting or exceeding</strong> the 121 standard!</>
                )}
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
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-bold text-slate-800">{section.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {section.score >= 80 ? "On Track" : section.score >= 60 ? "Within Reach" : "Clear Improvement Opportunity"}
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
                </div>
              ))}
              {sectionScores.length === 0 && (
                <p className="text-sm text-muted-foreground">No section data available.</p>
              )}
            </CardContent>
          </Card>

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
                    const weakest = [...sectionScores].sort((a, b) => a.score - b.score)[0];
                    return `${weakest.name} at ${weakest.score}% is the primary area for improvement. We recommend starting targeted drills immediately.`;
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

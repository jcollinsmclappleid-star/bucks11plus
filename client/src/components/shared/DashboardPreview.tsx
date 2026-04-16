import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, BarChart2, TrendingUp, Shield, Gauge, Zap, AlertTriangle } from "lucide-react";

function ScreenshotFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white" data-testid="screenshot-frame">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-[11px] font-medium text-slate-500 ml-2">{title}</span>
      </div>
      <div className="p-4 md:p-6 bg-slate-50/50">
        {children}
      </div>
    </div>
  );
}

function ReadinessGauge() {
  const score = 118;
  const target = 121;
  const gap = target - score;
  const circumference = 251.2;
  const offset = circumference - (circumference * (score / 141));
  const targetRotation = (target / 141) * 360;

  return (
    <Card className="border-border/60 shadow-md overflow-hidden relative" data-testid="preview-readiness-gauge">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <Target className="h-5 w-5 text-primary" /> Readiness Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-6 pb-6">
        <div className="relative w-44 h-44 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
            <circle
              cx="50" cy="50" r="40"
              className="stroke-amber-400"
              strokeWidth="12"
              fill="none"
              strokeDasharray={String(circumference)}
              strokeDashoffset={String(offset)}
              strokeLinecap="round"
            />
            <line x1="50" y1="2" x2="50" y2="14" className="stroke-primary" strokeWidth="2" transform={`rotate(${targetRotation} 50 50)`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-primary" data-testid="preview-score">{score}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Est. Score</span>
          </div>
        </div>

        <div className="space-y-4 flex-1 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border bg-amber-100 text-amber-800 border-amber-200 shadow-sm">
            Confident Amber
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-primary">Gap to 121 Standard</span>
              <span className="font-bold text-amber-600">{gap} points</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-slate-100">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${(score / target) * 100}%` }} />
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Highest Impact:</strong> Verbal Reasoning at 62% is the primary area for improvement. Targeted practice here will have the highest impact on your overall score.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriorityFocusPanel() {
  const priorities = [
    { name: "Verbal Reasoning", accuracy: "62%", pace: "Slow", impact: "High Impact", impactColor: "bg-red-100 text-red-700 border-red-200", paceColor: "text-red-500" },
    { name: "Non-Verbal Reasoning", accuracy: "74%", pace: "On Track", impact: "Medium", impactColor: "bg-amber-100 text-amber-700 border-amber-200", paceColor: "text-green-600" },
    { name: "Maths", accuracy: "81%", pace: "On Track", impact: "On Track", impactColor: "bg-green-100 text-green-700 border-green-200", paceColor: "text-green-600" },
    { name: "English Comprehension", accuracy: "69%", pace: "Slow", impact: "Medium", impactColor: "bg-amber-100 text-amber-700 border-amber-200", paceColor: "text-amber-500" },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-priority-focus">
      <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <Zap className="h-5 w-5 text-primary" /> Priority Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {priorities.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:bg-slate-50 transition-colors" data-testid={`preview-priority-${i}`}>
            <div className="space-y-1">
              <div className="font-bold text-sm text-primary">{p.name}</div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.impactColor}`}>{p.impact}</span>
                <span className={`text-[10px] font-medium ${p.paceColor}`}>Pace: {p.pace}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-primary">{p.accuracy}</div>
              <div className="text-[10px] text-muted-foreground">accuracy</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SectionBreakdown() {
  const sections = [
    { name: "Verbal Reasoning", score: 62, status: "Improvement Opportunity", color: "bg-red-500", bgColor: "bg-red-100" },
    { name: "Non-Verbal Reasoning", score: 74, status: "Within Reach", color: "bg-amber-500", bgColor: "bg-amber-100" },
    { name: "Maths", score: 81, status: "On Track", color: "bg-green-500", bgColor: "bg-green-100" },
    { name: "English Comprehension", score: 69, status: "Within Reach", color: "bg-amber-500", bgColor: "bg-amber-100" },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-section-breakdown">
      <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <BarChart2 className="h-5 w-5 text-primary" /> Section Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {sections.map((section, i) => (
          <div key={i} className="space-y-2" data-testid={`preview-section-${i}`}>
            <div className="flex justify-between items-end">
              <div>
                <div className="font-bold text-slate-800 text-sm">{section.name}</div>
                <div className={`text-xs mt-0.5 ${section.score >= 80 ? 'text-green-600' : section.score >= 60 ? 'text-amber-600' : 'text-red-600'} font-medium`}>
                  {section.status}
                </div>
              </div>
              <div className="font-bold text-lg text-primary" data-testid={`preview-section-score-${i}`}>{section.score}%</div>
            </div>
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${section.bgColor}`}>
              <div className={`h-full rounded-full ${section.color}`} style={{ width: `${section.score}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ImpactSimulator() {
  return (
    <Card className="border-border/60 shadow-md overflow-hidden relative" data-testid="preview-impact-simulator">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-primary/70" />
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <TrendingUp className="h-5 w-5 text-primary" /> Impact Simulator
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">See how improving one area shifts the overall forecast</p>
      </CardHeader>
      <CardContent className="pb-6 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="text-sm font-bold text-primary flex-1">Verbal Reasoning</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">62%</span>
            <div className="w-24 h-2 rounded-full bg-slate-200 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-primary/40 rounded-full" style={{ width: "62%" }} />
              <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: "72%" }} />
            </div>
            <span className="text-xs font-bold text-primary">72%</span>
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+10%</span>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-bold text-green-800">Projected Impact</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-green-700">Current forecast</span>
              <div className="text-lg font-bold text-green-800">118</div>
            </div>
            <div className="text-2xl text-green-400">→</div>
            <div className="text-right">
              <span className="text-xs text-green-700">Projected range</span>
              <div className="text-lg font-bold text-green-800">118 – 123</div>
            </div>
          </div>
          <p className="text-[10px] text-green-600 mt-2">A 10% improvement in Verbal Reasoning moves the forecast above the 121 qualifying standard</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PaceAnalysis() {
  const paceData = [
    { name: "Verbal Reasoning", avg: 38, expected: 30, pdi: 64 },
    { name: "Non-Verbal Reasoning", avg: 32, expected: 30, pdi: 78 },
    { name: "Maths", avg: 28, expected: 30, pdi: 88 },
    { name: "English Comprehension", avg: 35, expected: 30, pdi: 71 },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-pace-analysis">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-serif">
            <Clock className="h-5 w-5 text-primary" /> Pace Discipline
          </CardTitle>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">PDI: 72/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {paceData.map((stat, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <span className="font-semibold text-sm text-primary">{stat.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className={`h-full rounded-full ${stat.pdi >= 80 ? 'bg-green-500' : stat.pdi >= 65 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stat.pdi}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">PDI {stat.pdi}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-1 rounded bg-slate-100 font-medium">{stat.avg}s / q</span>
              <span className="text-xs text-muted-foreground">expected {stat.expected}s</span>
              <span className={`text-xs font-bold w-12 text-right ${stat.avg > stat.expected ? 'text-red-500' : 'text-green-600'}`}>
                {stat.avg > stat.expected ? `+${stat.avg - stat.expected}s` : `${stat.avg - stat.expected}s`}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SubSkillHeatmap() {
  const skills = [
    { label: "Synonyms", value: 85, time: "24s", domain: "VR" },
    { label: "Antonyms", value: 72, time: "28s", domain: "VR" },
    { label: "Analogies", value: 58, time: "36s", domain: "VR" },
    { label: "Comprehension", value: 66, time: "32s", domain: "VR" },
    { label: "Codes", value: 64, time: "34s", domain: "NVR" },
    { label: "Sequences", value: 78, time: "26s", domain: "NVR" },
    { label: "Patterns", value: 82, time: "22s", domain: "NVR" },
    { label: "Spatial", value: 70, time: "30s", domain: "NVR" },
    { label: "Fractions", value: 76, time: "30s", domain: "Maths" },
    { label: "Ratios", value: 68, time: "32s", domain: "Maths" },
    { label: "Word Problems", value: 55, time: "42s", domain: "Maths" },
    { label: "Number Patterns", value: 84, time: "20s", domain: "Maths" },
    { label: "Inference", value: 65, time: "38s", domain: "EC" },
    { label: "Vocabulary in Context", value: 72, time: "30s", domain: "EC" },
    { label: "Retrieval", value: 80, time: "24s", domain: "EC" },
    { label: "Summary", value: 60, time: "40s", domain: "EC" },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-heatmap">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <BarChart2 className="h-5 w-5 text-primary" /> Sub-Skill Accuracy Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {skills.map((cell, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2.5 ${cell.value >= 80 ? 'bg-emerald-100 text-emerald-800' : cell.value >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}
              data-testid={`preview-heatmap-cell-${i}`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[10px] font-medium truncate">{cell.label}</div>
                <div className="text-[9px] font-medium text-muted-foreground/60">{cell.domain}</div>
              </div>
              <div className="text-sm font-bold">{cell.value}%</div>
              <div className="text-[10px] opacity-70">{cell.time} avg</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Accuracy adjusted for difficulty and cognitive load. Colour indicates performance band across all four domains.
        </p>
      </CardContent>
    </Card>
  );
}

function FatigueIndicator() {
  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-fatigue">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <AlertTriangle className="h-5 w-5 text-amber-500" /> Fatigue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
            <div className="text-[10px] font-medium text-red-600 uppercase tracking-wider mb-1">Accuracy Drift</div>
            <div className="text-xl font-bold text-red-700">−12pp</div>
            <div className="text-[10px] text-red-500 mt-0.5">First third → Last third</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
            <div className="text-[10px] font-medium text-amber-600 uppercase tracking-wider mb-1">Pace Drift</div>
            <div className="text-xl font-bold text-amber-700">+6s</div>
            <div className="text-[10px] text-amber-500 mt-0.5">Slowing under pressure</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Significant accuracy drop in the final third suggests fatigue or time pressure is affecting performance.
        </p>
      </CardContent>
    </Card>
  );
}

function TrajectoryChart() {
  const dataPoints = [
    { date: "Jan", score: 108 },
    { date: "Mar", score: 112 },
    { date: "May", score: 115 },
    { date: "Jul", score: 118 },
  ];

  const svgW = 400;
  const svgH = 180;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const minScore = 100;
  const maxScore = 130;

  const toX = (i: number) => padL + (i / (dataPoints.length - 1)) * chartW;
  const toY = (s: number) => padT + chartH - ((s - minScore) / (maxScore - minScore)) * chartH;

  const linePath = dataPoints.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.score)}`).join(" ");
  const targetY = toY(121);

  return (
    <Card className="border-border/60 shadow-md overflow-hidden relative" data-testid="preview-trajectory">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <TrendingUp className="h-5 w-5 text-primary" /> Readiness Trajectory
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Score progression across readiness checks</p>
      </CardHeader>
      <CardContent className="pb-6">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          {[105, 110, 115, 120, 125].map(tick => (
            <g key={tick}>
              <line x1={padL} y1={toY(tick)} x2={svgW - padR} y2={toY(tick)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={padL - 6} y={toY(tick) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{tick}</text>
            </g>
          ))}

          <line x1={padL} y1={targetY} x2={svgW - padR} y2={targetY} stroke="#0d1f30" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={svgW - padR + 2} y={targetY + 3} fontSize="9" fontWeight="bold" fill="#0d1f30">121</text>

          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${linePath} L ${toX(dataPoints.length - 1)} ${padT + chartH} L ${toX(0)} ${padT + chartH} Z`}
            fill="url(#areaGrad)"
          />

          <path d={linePath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {dataPoints.map((d, i) => (
            <g key={i}>
              <circle cx={toX(i)} cy={toY(d.score)} r="5" fill="white" stroke="#d97706" strokeWidth="2.5" />
              <text x={toX(i)} y={toY(d.score) - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0d1f30">{d.score}</text>
              <text x={toX(i)} y={padT + chartH + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.date}</text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}

function StabilityAndBands() {
  const bands = [
    { date: "Jan", band: "Red", color: "bg-red-500" },
    { date: "Mar", band: "Amber", color: "bg-amber-500" },
    { date: "May", band: "Amber", color: "bg-amber-500" },
    { date: "Jul", band: "Amber", color: "bg-amber-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="preview-stability-bands">
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Stability Index</div>
              <div className="text-2xl font-bold text-primary">74<span className="text-sm font-normal text-muted-foreground">/100</span></div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-amber-400" style={{ width: "74%" }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Measures consistency across assessments. Higher is better.</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground mb-3">Performance Band History</div>
          <div className="flex items-center gap-2">
            {bands.map((b, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-8 rounded-lg ${b.color} flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">{b.band}</span>
                </div>
                <div className="text-[9px] text-muted-foreground mt-1">{b.date}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-[10px] font-medium text-green-600">Improving trend — moved from Red to Amber band</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardPreviewForecast() {
  return (
    <ScreenshotFrame title="Bucks 11 Plus Tests — Readiness Dashboard">
      <div className="space-y-4" data-testid="dashboard-preview-forecast">
        <ReadinessGauge />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PriorityFocusPanel />
          <SectionBreakdown />
        </div>
      </div>
    </ScreenshotFrame>
  );
}

export function DashboardPreviewPace() {
  return (
    <ScreenshotFrame title="Bucks 11 Plus Tests — Skill Gap Analysis">
      <div className="space-y-4" data-testid="dashboard-preview-pace">
        <ImpactSimulator />
        <PaceAnalysis />
        <SubSkillHeatmap />
        <FatigueIndicator />
      </div>
    </ScreenshotFrame>
  );
}

export function DashboardPreviewTrajectory() {
  return (
    <ScreenshotFrame title="Bucks 11 Plus Tests — Progress Tracking">
      <div className="space-y-4" data-testid="dashboard-preview-trajectory">
        <TrajectoryChart />
        <StabilityAndBands />
      </div>
    </ScreenshotFrame>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, BarChart2 } from "lucide-react";

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
              <strong className="text-primary">Verbal Reasoning</strong> at 62% is the primary area for improvement. Targeted practice here will have the highest impact.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  const sections = [
    { name: "Verbal Reasoning", score: 62, label: "High Impact", color: "amber" },
    { name: "Non-Verbal Reasoning", score: 74, label: "Medium Impact", color: "amber" },
    { name: "Maths", score: 81, label: "On Track", color: "green" },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-skill-breakdown">
      <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <BarChart2 className="h-5 w-5 text-primary" /> Skill Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {sections.map((section, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <div className="font-bold text-slate-800 text-sm">{section.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {section.score >= 80 ? "On Track" : section.score >= 60 ? "Within Reach" : "Clear Improvement Opportunity"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-primary" data-testid={`preview-section-score-${i}`}>{section.score}%</div>
              </div>
            </div>
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${section.score >= 80 ? 'bg-green-100' : section.score >= 60 ? 'bg-amber-100' : 'bg-red-100'}`}>
              <div
                className={`h-full rounded-full ${section.score >= 80 ? 'bg-green-500' : section.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${section.score}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" /> {section.label}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PaceAnalysis() {
  const paceData = [
    { name: "Verbal Reasoning", avg: 38, expected: 30 },
    { name: "Non-Verbal Reasoning", avg: 32, expected: 30 },
    { name: "Maths", avg: 28, expected: 30 },
  ];

  return (
    <Card className="border-border/60 shadow-sm" data-testid="preview-pace-analysis">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <Clock className="h-5 w-5 text-primary" /> Pace Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {paceData.map((stat, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background hover:bg-slate-50 transition-colors">
            <span className="font-semibold text-sm text-primary">{stat.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-1 rounded bg-slate-100 font-medium">{stat.avg}s / q</span>
              <span className="text-xs text-muted-foreground">expected {stat.expected}s</span>
              <span className={`text-xs font-bold w-12 text-right ${stat.avg > stat.expected ? 'text-red-500' : 'text-green-600'}`}>
                {stat.avg > stat.expected ? `+${stat.avg - stat.expected}s` : `${stat.avg - stat.expected}s`}
              </span>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-2">
          Pace compared to timed section expectations. Verbal Reasoning shows the largest time pressure risk.
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardPreviewForecast() {
  return (
    <div className="space-y-6" data-testid="dashboard-preview-forecast">
      <ReadinessGauge />
      <SkillBreakdown />
    </div>
  );
}

export function DashboardPreviewPace() {
  return (
    <div className="space-y-6" data-testid="dashboard-preview-pace">
      <PaceAnalysis />
      <Card className="border-border/60 shadow-sm" data-testid="preview-heatmap">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-serif">
            <BarChart2 className="h-5 w-5 text-primary" /> Sub-Skill Accuracy Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Synonyms", value: 85, time: "24s" },
              { label: "Antonyms", value: 72, time: "28s" },
              { label: "Analogies", value: 58, time: "36s" },
              { label: "Codes", value: 64, time: "34s" },
              { label: "Sequences", value: 78, time: "26s" },
              { label: "Patterns", value: 82, time: "22s" },
              { label: "Fractions", value: 76, time: "30s" },
              { label: "Ratios", value: 68, time: "32s" },
              { label: "Word Problems", value: 55, time: "42s" },
            ].map((cell, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 ${cell.value >= 80 ? 'bg-emerald-100 text-emerald-800' : cell.value >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}
                data-testid={`preview-heatmap-cell-${i}`}
              >
                <div className="text-[10px] font-medium truncate mb-0.5">{cell.label}</div>
                <div className="text-sm font-bold">{cell.value}%</div>
                <div className="text-[10px] opacity-70">{cell.time} avg</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Accuracy adjusted for difficulty and cognitive load. Colour indicates performance band.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

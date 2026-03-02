import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

type CompletionData = {
  available: boolean;
  message?: string;
  baselineForecast: number;
  finalForecast: number;
  gapReduction: number;
  sectionComparison: { name: string; baselineScore: number; finalScore: number; improvement: number }[];
  strongestSkills: string[];
  remainingRisks: string[];
  totalAttempts: number;
};

export default function ProgrammeCompletion() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<CompletionData>({
    queryKey: ["/api/programme/completion-summary"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.available) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-primary font-serif mb-4">Programme Summary</h1>
        <p className="text-muted-foreground mb-6">{data?.message || "Complete more diagnostics to generate your summary."}</p>
        <Button asChild>
          <Link href="/app/programme">Back to Programme</Link>
        </Button>
      </div>
    );
  }

  const finalGap = 121 - data.finalForecast;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Programme Completion | 11+ Standard" description="Your programme completion summary and results." />

      <div className="text-center border-b border-border/60 pb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-completion-title">Programme Complete</h1>
        <p className="text-muted-foreground mt-2">Summary of your 16-week journey</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="font-serif">Baseline vs Final</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Baseline Forecast</p>
                <p className="text-4xl font-bold text-slate-400" data-testid="text-baseline">{data.baselineForecast}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Final Forecast</p>
                <p className={`text-4xl font-bold ${data.finalForecast >= 121 ? 'text-green-600' : 'text-primary'}`} data-testid="text-final">{data.finalForecast}</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${data.gapReduction > 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${data.gapReduction > 0 ? 'text-green-600' : 'text-amber-600'}`} />
                <span className="font-bold text-sm">
                  Gap reduced by {data.gapReduction} points
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {finalGap <= 0 ? "Target of 121 has been met!" : `${finalGap} points remaining to 121 standard.`}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Based on {data.totalAttempts} diagnostic attempts.</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="font-serif">Section Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.sectionComparison.map((s, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-bold text-sm text-primary">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.baselineScore}% → {s.finalScore}%</p>
                </div>
                <span className={`font-bold text-sm ${s.improvement > 0 ? 'text-green-600' : s.improvement < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  {s.improvement > 0 ? '+' : ''}{s.improvement}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="font-serif text-green-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Strongest Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.strongestSkills.map((skill, i) => (
                <li key={i} className="font-medium text-green-700">{skill}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {data.remainingRisks.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="font-serif text-amber-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Areas to Watch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.remainingRisks.map((skill, i) => (
                  <li key={i} className="font-medium text-amber-700">{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-serif">Recommended Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Continue 2-3 short practice sessions per week to maintain skills",
              "Take one timed diagnostic every 2-3 weeks to track stability",
              "Focus on remaining risk areas with targeted 15-minute drills",
              "Simulate exam-day conditions at least once before the test",
              "Maintain a calm routine — avoid cramming in the final week",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <Button asChild>
          <Link href="/app" data-testid="button-back-dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

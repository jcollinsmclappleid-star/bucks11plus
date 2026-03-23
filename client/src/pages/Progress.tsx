import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, AlertCircle, Calendar, CheckCircle2, Lock, ArrowRight, Activity, BarChart3, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

type ProgressData = {
  trajectory: { date: string; score: number }[];
  velocity: number;
  latestForecast: number | null;
  latestBand: string | null;
  totalAttempts: number;
  gapVelocity: { oldGap: number; newGap: number; change: number; improving: boolean } | null;
  forecastStability: { stdDev: number; status: string; trend: string } | null;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  sectionAccuracy: Record<string, { correct: number; total: number; pct: number }>;
};

export default function Progress() {
  const { user, hasPaidAccess, isProgramme } = useAuth();
  const { data: progress, isLoading } = useQuery<ProgressData>({
    queryKey: ["/api/progress"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-[400px]" />
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  const gv = progress?.gapVelocity;
  const fs = progress?.forecastStability;
  const sectionAccuracy = progress?.sectionAccuracy || {};

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Progress & Plan | 11+ Standard" description="Track your child's 11+ readiness progress over time." />
      
      <div className="border-b border-border/60 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Progress</h1>
          <p className="text-muted-foreground mt-2">See how your child's score is changing and where they stand on the road to 121.</p>
        </div>
      </div>

      {progress?.totalQuestionsAnswered !== undefined && progress.totalQuestionsAnswered > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="progress-stats-grid">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary" data-testid="text-total-questions">{progress.totalQuestionsAnswered}</div>
              <p className="text-xs text-muted-foreground mt-1">Questions Answered</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-bold ${progress.overallAccuracy >= 75 ? 'text-green-600' : progress.overallAccuracy >= 55 ? 'text-amber-600' : 'text-red-600'}`} data-testid="text-overall-accuracy">{progress.overallAccuracy}%</div>
              <p className="text-xs text-muted-foreground mt-1">Getting Right Overall</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary" data-testid="text-total-attempts">{progress.totalAttempts}</div>
              <p className="text-xs text-muted-foreground mt-1">Tests Completed</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-bold ${(progress.latestForecast || 0) >= 121 ? 'text-green-600' : 'text-amber-600'}`} data-testid="text-latest-forecast">{progress.latestForecast || '—'}</div>
              <p className="text-xs text-muted-foreground mt-1">Estimated Score Now</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50">
            <CardTitle className="font-serif">Score Over Time</CardTitle>
            <CardDescription>How your child's estimated score has changed across tests</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress?.trajectory || []} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis domain={[90, 130]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine y={121} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: '121 Standard', fill: '#d97706', fontSize: 12, fontWeight: 700 }} />
                  <Line type="monotone" dataKey="score" stroke="#1e293b" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: 'white'}} activeDot={{r: 8, fill: '#1e293b'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-gradient-to-br from-white to-slate-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-primary mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg font-serif">Progress So Far</h3>
              </div>
              <p className="text-4xl font-bold text-primary mb-2" data-testid="text-velocity">
                {progress?.velocity !== undefined ? (progress.velocity > 0 ? `+${progress.velocity}` : progress.velocity) : '0'} 
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide ml-2">points</span>
              </p>
              <p className="text-sm text-slate-600">
                {progress?.totalAttempts ? `Across ${progress.totalAttempts} tests completed` : "Complete a diagnostic to start tracking progress"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -z-10"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-blue-800 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg font-serif">Current Level</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium" data-testid="text-band">
                {progress?.latestBand || "Complete a diagnostic to see your child's current level."}
              </p>
              {progress?.latestForecast && (
                <p className="text-xs text-muted-foreground mt-2">Estimated score: {progress.latestForecast} (target: 121)</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {Object.keys(sectionAccuracy).length > 0 && (
        <Card className="border-border/60 shadow-sm" data-testid="card-section-accuracy">
          <CardHeader className="bg-slate-50/50 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 font-serif">
              <BarChart3 className="h-5 w-5 text-primary" /> How They're Performing in Each Subject
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(sectionAccuracy).map(([section, data]) => (
                <div key={section} className="p-4 rounded-lg border bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-slate-800">{section}</span>
                    <span className={`text-sm font-bold ${data.pct >= 75 ? 'text-green-600' : data.pct >= 55 ? 'text-amber-600' : 'text-red-600'}`}>{data.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${data.pct >= 75 ? 'bg-green-500' : data.pct >= 55 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${data.pct}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{data.correct} out of {data.total} correct across all tests</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasPaidAccess() && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Closing the Gap to 121
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gv ? (
                <div>
                  <p className={`text-3xl font-bold ${gv.improving ? 'text-green-600' : 'text-amber-600'}`} data-testid="text-gap-velocity">
                    {gv.improving ? '-' : '+'}{Math.abs(gv.change)} pts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The gap to 121 has {gv.improving ? 'reduced' : 'grown'} from {gv.oldGap} to {gv.newGap} points
                  </p>
                  <p className={`text-xs font-medium mt-2 ${gv.improving ? 'text-green-600' : 'text-amber-600'}`}>
                    {gv.improving ? "Moving in the right direction" : "More practice needed to close the gap"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete 2 or more tests to see how quickly the gap to 121 is closing.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Score Consistency
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
                  <p className="text-sm text-muted-foreground mt-2">Score varies by {fs.stdDev} points between tests</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fs.trend === 'improving' ? 'Results are becoming more consistent' : 'Results are holding steady'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete 2 or more tests to see how consistent your child's scores are.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-primary font-serif flex items-center gap-3">
            <div className="p-2 bg-brand-amber/10 rounded-lg">
              <Calendar className="h-6 w-6 text-brand-amber" />
            </div>
            {isProgramme() ? "16-Week Programme" : "Structured Preparation"}
          </h2>
        </div>
        
        <Card className={`border-border/60 overflow-hidden relative shadow-md ${!hasPaidAccess() ? 'border-primary/20' : ''}`}>
           {!hasPaidAccess() && (
             <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-slate-100">
                  <Lock className="h-8 w-8 text-brand-amber" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-3 font-serif">Unlock Your Personalized Plan</h3>
                <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
                  Paid users receive a structured, week-by-week schedule targeting their exact weaknesses to efficiently close the gap to 121.
                </p>
                <Button size="lg" className="bg-primary shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg h-14 px-8" asChild data-testid="button-upgrade-plan">
                  <Link href="/pricing">Upgrade to View Plan <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
             </div>
           )}

           <CardContent className={`p-0 ${!hasPaidAccess() ? 'pointer-events-none opacity-30 select-none' : ''}`}>
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-8 bg-slate-50/50">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Phase 1
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Foundations</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Focused skill drills</div>
                         <div className="text-xs text-muted-foreground mt-1">Build accuracy in weak areas</div>
                       </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Baseline diagnostic</div>
                         <div className="text-xs text-muted-foreground mt-1">Establish starting forecast</div>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="p-8 bg-white">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Phase 2
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Acceleration</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Timed practice sessions</div>
                         <div className="text-xs text-muted-foreground mt-1">Introduce strict timing</div>
                       </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Progress diagnostic</div>
                         <div className="text-xs text-muted-foreground mt-1">Mid-point recalibration</div>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50/50">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Phase 3
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Exam Ready</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-white rounded-lg border border-slate-200 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Mock exams</div>
                         <div className="text-xs text-muted-foreground mt-1">Simulate exam day conditions</div>
                       </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg border border-slate-200 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Final assessment</div>
                         <div className="text-xs text-muted-foreground mt-1">Confirm readiness</div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

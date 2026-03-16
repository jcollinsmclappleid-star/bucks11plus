import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, AlertCircle, Calendar, CheckCircle2, Lock, ArrowRight, Activity } from "lucide-react";
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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Progress & Plan | 11+ Standard" description="Track your child's 11+ readiness progress over time." />
      
      <div className="border-b border-border/60 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Progress & Plan</h1>
          <p className="text-muted-foreground mt-2">Historical forecast tracking and your preparation journey.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-border/50">
            <CardTitle className="font-serif">Forecast Trajectory</CardTitle>
            <CardDescription>Estimated standardized score over time</CardDescription>
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
                <h3 className="font-bold text-lg font-serif">Velocity</h3>
              </div>
              <p className="text-4xl font-bold text-primary mb-2" data-testid="text-velocity">
                {progress?.velocity !== undefined ? (progress.velocity > 0 ? `+${progress.velocity}` : progress.velocity) : '0'} 
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide ml-2">points</span>
              </p>
              <p className="text-sm text-slate-600">
                {progress?.totalAttempts ? `Over ${progress.totalAttempts} attempts` : "Take diagnostics to track velocity"}
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
                <h3 className="font-bold text-lg font-serif">Latest Band</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium" data-testid="text-band">
                {progress?.latestBand || "Complete a diagnostic to see your band."}
              </p>
              {progress?.latestForecast && (
                <p className="text-xs text-muted-foreground mt-2">Current forecast: {progress.latestForecast}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isProgramme() && (
        <div className="grid md:grid-cols-2 gap-6">
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
                    Gap moved from {gv.oldGap} to {gv.newGap} over {gv.attempts || 'multiple'} attempts
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
                  <p className="text-sm text-muted-foreground mt-2">Std deviation: {fs.stdDev} pts</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fs.trend === 'improving' ? 'Scores becoming more consistent' : 'Scores are steady'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete 2+ diagnostics to see stability.</p>
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

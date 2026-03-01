import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, AlertCircle, Calendar, CheckCircle2, Lock, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

const data = [
  { date: 'Week 1', score: 105, target: 121 },
  { date: 'Week 2', score: 108, target: 121 },
  { date: 'Week 3', score: 110, target: 121 },
  { date: 'Week 4', score: 114, target: 121 },
];

export default function Progress() {
  const isPremium = false; // Mock state

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Progress & Plan | 11+ Standard" description="Track your child's 11+ readiness progress over time." />
      
      <div className="border-b border-border/60 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Progress & Plan</h1>
          <p className="text-muted-foreground mt-2">Historical forecast tracking and your structured prep plan.</p>
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
                <LineChart data={data} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
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
              <p className="text-4xl font-bold text-primary mb-2">+9 <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">points</span></p>
              <p className="text-sm text-slate-600">Improvement over last 4 weeks. Excellent trajectory.</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -z-10"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-blue-800 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg font-serif">Insight</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                At the current rate of improvement, the 121 benchmark will be reached in approximately <strong className="text-blue-900">3.5 weeks</strong>. Maintain current practice volume.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* V5: 12 Week Plan */}
      <div className="mt-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-primary font-serif flex items-center gap-3">
            <div className="p-2 bg-brand-amber/10 rounded-lg">
              <Calendar className="h-6 w-6 text-brand-amber" />
            </div>
            Structured 12-Week Preparation Plan
          </h2>
          {isPremium && (
            <Button variant="outline" className="gap-2 shadow-sm">
              <Download className="h-4 w-4" /> Download PDF Plan
            </Button>
          )}
        </div>
        
        <Card className={`border-border/60 overflow-hidden relative shadow-md ${!isPremium ? 'border-primary/20' : ''}`}>
           {!isPremium && (
             <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center border border-white/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-slate-100">
                  <Lock className="h-8 w-8 text-brand-amber" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-3 font-serif">Unlock Your Personalized Plan</h3>
                <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
                  Premium users receive an auto-generated, week-by-week schedule targeting their exact weaknesses to efficiently close the gap to 121.
                </p>
                <Button size="lg" className="bg-primary shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg h-14 px-8" asChild>
                  <Link href="/pricing">Upgrade to View Plan <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
             </div>
           )}

           <CardContent className={`p-0 ${!isPremium ? 'pointer-events-none opacity-30 select-none' : ''}`}>
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Phase 1 */}
                <div className="p-8 bg-slate-50/50">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Weeks 1-4
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Phase 1: Foundations</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">3x 15m Verbal Logic</div>
                         <div className="text-xs text-muted-foreground mt-1">Focus on accuracy over speed</div>
                       </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">2x 15m Word Problems</div>
                         <div className="text-xs text-muted-foreground mt-1">Step-by-step methodology</div>
                       </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">1x Timed Mixed Drill</div>
                         <div className="text-xs text-muted-foreground mt-1">Weekend pressure test</div>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Phase 2 */}
                <div className="p-8 bg-white">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Weeks 5-8
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Phase 2: Acceleration</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">3x 15m NVR Patterns</div>
                         <div className="text-xs text-muted-foreground mt-1">Introduce strict timing</div>
                       </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">1x Full Diagnostic</div>
                         <div className="text-xs text-muted-foreground mt-1">Mid-point recalibration</div>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Phase 3 */}
                <div className="p-8 bg-slate-50/50">
                   <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                     Weeks 9-12
                   </div>
                   <h4 className="font-bold text-primary text-xl mb-6 font-serif">Phase 3: Exam Ready</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-white rounded-lg border border-slate-200 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Full Mock Exams</div>
                         <div className="text-xs text-muted-foreground mt-1">Simulate exam day conditions</div>
                       </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg border border-slate-200 flex gap-3">
                       <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0 mt-0.5"/>
                       <div>
                         <div className="font-bold text-sm text-slate-800">Weakness Review</div>
                         <div className="text-xs text-muted-foreground mt-1">Light touch up on gaps</div>
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
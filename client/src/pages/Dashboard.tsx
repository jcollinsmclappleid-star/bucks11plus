import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, AlertCircle, BookOpen, Clock, Lock, Target } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Dashboard() {
  const currentScore = 114;
  const target = 121;
  const gap = target - currentScore;
  
  // Confident Amber band logic
  const isAmber = currentScore >= 110 && currentScore < 121;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Seo 
        title="Dashboard | 11+ Standard" 
        description="View your child's 11+ readiness forecast, pace analysis, and priority focus areas." 
      />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Readiness Forecast</h1>
          <p className="text-muted-foreground mt-1">Based on Mini Diagnostic completed 2 days ago.</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          Take Full Diagnostic <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Gauge / Forecast Card */}
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Trajectory
              {isAmber && <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 ml-2">Confident Amber</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 py-6">
            
            {/* Simple Visual Gauge */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-amber-400 transition-all duration-1000 ease-out" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * (currentScore / 141))} 
                />
                {/* Target marker */}
                <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-primary">{currentScore}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Est. Score</span>
              </div>
            </div>

            <div className="space-y-6 flex-1 w-full">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-primary">Gap to 121 Standard</span>
                  <span className="font-bold text-amber-600">{gap} points</span>
                </div>
                <Progress value={(currentScore/121)*100} className="h-3 [&>div]:bg-amber-400" />
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-sm text-primary flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" /> 
                  If Verbal Logic improves by 15%...
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your range shifts to <strong className="text-primary">118 - 124</strong>, bringing the 121 benchmark into immediate reach.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Focus Card */}
        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle>Priority Focus</CardTitle>
            <CardDescription>Highest impact areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { skill: "Verbal Logic", section: "VR", impact: "High", time: "Slow" },
              { skill: "Multi-step Word Problems", section: "Maths", impact: "High", time: "Avg" },
              { skill: "Pattern Sequences", section: "NVR", impact: "Med", time: "Slow" }
            ].map((focus, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-primary">{focus.skill}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{focus.section}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" /> {focus.impact} Impact
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <Clock className="h-3 w-3" /> {focus.time} Pace
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/app/practice">
                <BookOpen className="mr-2 h-4 w-4" /> Start Practice Drill
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">Full Diagnostics Locked</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Upgrade to a monthly subscription or 12-week pack to unlock full 45-minute diagnostics, complete practice bank, and PDF reports.
              </p>
            </div>
            <Button className="mt-2 bg-primary">View Upgrade Options</Button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Pace Analysis</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[
                  { name: "Verbal Reasoning", avg: 42, expected: 35, diff: "+7s" },
                  { name: "Non-Verbal Reasoning", avg: 38, expected: 35, diff: "+3s" },
                  { name: "Maths", avg: 44, expected: 45, diff: "-1s" },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-muted-foreground">{stat.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-1 rounded bg-slate-100">{stat.avg}s / q</span>
                      <span className={`text-xs font-bold w-8 text-right ${stat.avg > stat.expected ? 'text-red-500' : 'text-green-600'}`}>
                        {stat.diff}
                      </span>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
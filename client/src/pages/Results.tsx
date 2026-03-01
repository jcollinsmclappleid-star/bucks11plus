import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Target, ArrowRight, Download, BarChart2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Results() {
  const currentScore = 114;
  const target = 121;
  const gap = target - currentScore;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Assessment Results | 11+ Standard" description="View your recent diagnostic results and updated readiness forecast." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Diagnostic Results</h1>
          <p className="text-muted-foreground mt-2">Mini Diagnostic completed on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" /> PDF Report (Premium)
          </Button>
          <Button asChild>
            <Link href="/app">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Core Result Gauge */}
        <Card className="border-border/60 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-amber to-brand-amber/50"></div>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            
            <div className="relative w-56 h-56 mt-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-amber-400 animate-in spin-in" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * (currentScore / 141))} 
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
                <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-primary">{currentScore}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Forecast</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Confident Amber Band</h2>
              <p className="text-muted-foreground text-lg">
                Your child is currently showing a <strong className="text-primary">{gap} point gap</strong> to the 121 standard.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-5 w-5 text-primary" /> Section Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "Verbal Reasoning", score: 65, pace: "Slow (+7s/q)", color: "bg-red-400" },
                { name: "Non-Verbal Reasoning", score: 85, pace: "On Track", color: "bg-green-500" },
                { name: "Maths", score: 75, pace: "Slightly Slow (+2s/q)", color: "bg-amber-400" },
              ].map((section, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{section.name}</span>
                    <span className="font-bold text-primary">{section.score}%</span>
                  </div>
                  <Progress value={section.score} className="h-2 [&>div]:bg-primary/80" />
                  <div className="text-xs text-muted-foreground text-right">{section.pace}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-blue-50/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-primary flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-blue-600" /> Immediate Next Step
              </h3>
              <p className="text-sm text-slate-700 mb-4">
                Pacing in Verbal Reasoning is the primary drag on the forecast. We recommend starting targeted VR drills immediately.
              </p>
              <Button className="w-full bg-primary" asChild>
                <Link href="/app/practice">Go to Practice Bank <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
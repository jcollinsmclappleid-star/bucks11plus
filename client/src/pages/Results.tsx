import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Download, BarChart2, Target, SlidersHorizontal, Sparkles, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Seo } from "../components/shared/Seo";

export default function Results() {
  const currentScore = 114;
  const target = 121;
  const gap = target - currentScore;

  const [simulatorValue, setSimulatorValue] = useState([10]);
  const [selectedSkill, setSelectedSkill] = useState("verbal-logic");

  const simulatedBoost = Math.round(simulatorValue[0] * 0.4); // Mock calculation
  const newMin = 114 + simulatedBoost;
  const newMax = 119 + simulatedBoost;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Assessment Results | 11+ Standard" description="View your recent diagnostic results and updated readiness forecast." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Diagnostic Results</h1>
          <p className="text-muted-foreground mt-2">Mini Diagnostic completed on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" asChild>
             <Link href="/pricing"><Download className="h-4 w-4" /> PDF Report (Premium)</Link>
          </Button>
          <Button asChild>
            <Link href="/app">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Core Result Gauge */}
        <Card className="border-border/60 shadow-md overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-white to-slate-50/50">
            
            <div className="relative w-64 h-64 mt-4 drop-shadow-sm">
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
                <span className="text-6xl font-bold text-primary">{currentScore}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Forecast</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold border border-amber-200 mb-3 shadow-sm">
                <Sparkles className="h-4 w-4" /> Within Reach
              </div>
              <p className="text-muted-foreground text-lg">
                Your child is currently showing a <strong className="text-primary">{gap} point gap</strong> to the 121 standard.
              </p>
            </div>
            
            {/* V4: Impact Simulator */}
            <div className="w-full bg-white p-6 rounded-2xl border border-border shadow-sm text-left mt-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-lg shadow-sm">
                 Premium Feature
              </div>
              <div className="flex items-center gap-2 mb-4">
                 <SlidersHorizontal className="h-5 w-5 text-primary" />
                 <h4 className="font-bold text-primary text-lg font-serif">Impact Simulator</h4>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">If we improve</label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger className="w-full bg-slate-50">
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verbal-logic">Verbal Logic (High Impact)</SelectItem>
                      <SelectItem value="word-problems">Multi-step Word Problems</SelectItem>
                      <SelectItem value="pattern-sequences">Pattern Sequences</SelectItem>
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
                  <p className="text-xs text-muted-foreground mt-1">Gap to 121 reduces to {121 - newMax > 0 ? 121 - newMax : 0} points.</p>
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
              {[
                { name: "Verbal Reasoning", score: 65, pace: "Slow (+7s/q)", status: "Clear Improvement Opportunity", color: "bg-red-500", track: "bg-red-100" },
                { name: "Non-Verbal Reasoning", score: 85, pace: "On Track", status: "On Track", color: "bg-green-500", track: "bg-green-100" },
                { name: "Maths", score: 75, pace: "Slightly Slow (+2s/q)", status: "Within Reach", color: "bg-amber-500", track: "bg-amber-100" },
              ].map((section, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-bold text-slate-800">{section.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{section.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">{section.score}%</div>
                    </div>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${section.track}`}>
                    <div className={`h-full ${section.color} rounded-full`} style={{ width: `${section.score}%` }}></div>
                  </div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Pace: {section.pace}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-brand-primary/20 bg-gradient-to-br from-blue-50 to-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Target className="w-24 h-24 text-blue-900" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="font-bold text-primary flex items-center gap-2 mb-3 text-xl font-serif">
                <Target className="h-6 w-6 text-blue-600" /> Immediate Next Step
              </h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Pacing in Verbal Reasoning is the primary drag on the forecast. We recommend starting targeted VR drills immediately to build fluency.
              </p>
              <Button size="lg" className="w-full bg-primary shadow-lg hover:shadow-xl transition-shadow text-base" asChild>
                <Link href="/app/practice">Start Highest Impact Drill <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
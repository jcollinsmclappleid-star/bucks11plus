import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock, FileText } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Diagnostics() {
  const diagnostics = [
    {
      id: "mini-1",
      name: "Mini Diagnostic",
      duration: "12 mins",
      questions: 12,
      type: "Free",
      locked: false,
      completed: true
    },
    {
      id: "full-a",
      name: "Diagnostic A (Full)",
      duration: "45 mins",
      questions: 45,
      type: "Premium",
      locked: true,
      completed: false
    },
    {
      id: "full-b",
      name: "Diagnostic B (Full)",
      duration: "45 mins",
      questions: 45,
      type: "Premium",
      locked: true,
      completed: false
    },
    {
      id: "mock-1",
      name: "Mock Exam 1",
      duration: "60 mins",
      questions: 60,
      type: "Premium",
      locked: true,
      completed: false
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Diagnostics | 11+ Standard" description="Available mock exams and diagnostic assessments." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Diagnostics & Mocks</h1>
          <p className="text-muted-foreground mt-2">Take full-length, timed assessments to recalibrate your forecast.</p>
        </div>
        <Button className="bg-brand-amber text-amber-950 hover:bg-brand-amber/90" asChild>
          <Link href="/pricing">Unlock Premium Mocks</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {diagnostics.map((diag) => (
          <Card key={diag.id} className={`relative overflow-hidden ${diag.locked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`}>
            {diag.locked && (
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center">
                <Lock className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-600 mb-4">Requires Monthly or 12-Week Pack</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/pricing">View Upgrade Options</Link>
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={diag.type === 'Free' ? 'default' : 'secondary'} className={diag.type === 'Free' ? 'bg-primary' : 'bg-slate-200 text-slate-700'}>
                  {diag.type}
                </Badge>
                {diag.completed && <Badge variant="outline" className="text-brand-green border-brand-green">Completed</Badge>}
              </div>
              <CardTitle className="text-xl">{diag.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {diag.duration}</span>
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {diag.questions} Qs</span>
              </div>
              
              <Button 
                variant={diag.completed ? 'outline' : 'default'} 
                className="w-full" 
                disabled={diag.locked}
                asChild={!diag.locked}
              >
                {diag.locked ? 
                  <span>Locked</span> : 
                  <Link href={`/app/diagnostic/${diag.id}/start`}>
                    {diag.completed ? 'Retake Diagnostic' : 'Start Diagnostic'}
                  </Link>
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
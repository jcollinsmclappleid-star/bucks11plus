import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock, FileText, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { Diagnostic, TestSession } from "@shared/schema";
import { useAuth } from "@/lib/auth";

export default function Diagnostics() {
  const { user } = useAuth();
  const { data: diagnostics, isLoading: loadingDiags } = useQuery<Diagnostic[]>({
    queryKey: ["/api/diagnostics"],
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
  });

  if (loadingDiags || loadingSessions) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedIds = new Set(sessions?.filter(s => s.completedAt).map(s => s.diagnosticId));

  const isLocked = (diag: Diagnostic) => {
    if (diag.requiredTier === "free") return false;
    if (user?.subscriptionTier === "premium") return false;
    return true;
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Diagnostics | 11+ Standard" description="Available mock exams and diagnostic assessments." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Diagnostics & Mocks</h1>
          <p className="text-muted-foreground mt-2">Take full-length, timed assessments to recalibrate your forecast.</p>
        </div>
        {user?.subscriptionTier !== 'premium' && (
          <Button className="bg-brand-amber text-amber-950 hover:bg-brand-amber/90" asChild>
            <Link href="/pricing" data-testid="link-pricing">Unlock Premium Mocks</Link>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {diagnostics?.map((diag) => {
          const locked = isLocked(diag);
          const completed = completedIds.has(diag.id);
          
          return (
            <Card key={diag.id} className={`relative overflow-hidden ${locked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`} data-testid={`card-diagnostic-${diag.id}`}>
              {locked && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center">
                  <Lock className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600 mb-4">Requires Monthly or 12-Week Pack</p>
                  <Button variant="outline" size="sm" asChild data-testid={`button-upgrade-${diag.id}`}>
                    <Link href="/pricing">View Upgrade Options</Link>
                  </Button>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={diag.requiredTier === 'free' ? 'default' : 'secondary'} className={diag.requiredTier === 'free' ? 'bg-primary' : 'bg-slate-200 text-slate-700'}>
                    {diag.requiredTier === 'free' ? 'Free' : 'Premium'}
                  </Badge>
                  {completed && <Badge variant="outline" className="text-brand-green border-brand-green">Completed</Badge>}
                </div>
                <CardTitle className="text-xl" data-testid={`text-diagnostic-name-${diag.id}`}>{diag.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {diag.duration} mins</span>
                  <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {diag.questionCount} Qs</span>
                </div>
                
                <Button 
                  variant={completed ? 'outline' : 'default'} 
                  className="w-full" 
                  disabled={locked}
                  asChild={!locked}
                  data-testid={`button-start-diagnostic-${diag.id}`}
                >
                  {locked ? 
                    <span>Locked</span> : 
                    <Link href={`/app/diagnostic/${diag.id}/start`}>
                      {completed ? 'Retake Diagnostic' : 'Start Diagnostic'}
                    </Link>
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Diagnostic, TestSession } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function DiagnosticStart() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: diagnostic, isLoading } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${id}`],
  });

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/test-sessions", { diagnosticId: id });
      return res.json() as Promise<TestSession>;
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
      setLocation(`/app/test/${session.id}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!diagnostic) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Diagnostic not found</h1>
        <Link href="/app/diagnostic" className="text-primary hover:underline mt-4 block">
          Back to Diagnostics
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo title={`Start ${diagnostic.title} | Bucks 11 Plus Tests`} description={`Begin your ${diagnostic.title} diagnostic assessment.`} />
      
      <div className="mb-8">
        <Link href="/app/diagnostic" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-diagnostics">
          ← Back to Diagnostics
        </Link>
      </div>

      <Card className="border-border/60 shadow-lg overflow-hidden" data-testid={`card-diagnostic-start-${diagnostic.id}`}>
        <div className="bg-primary p-8 text-center border-b border-primary-foreground/10">
          <Badge className="bg-white/20 text-white hover:bg-white/20 mb-4 inline-flex">Diagnostic Assessment</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif tracking-tight" data-testid="text-diagnostic-title">
            {diagnostic.title}
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            {diagnostic.subtitle}
          </p>
        </div>

        <CardContent className="p-8 space-y-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary" data-testid="text-duration">{diagnostic.duration}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary" data-testid="text-question-count">{diagnostic.questionCount}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <AlertCircle className="h-6 w-6 text-brand-amber mx-auto mb-2" />
              <div className="font-bold text-xl text-brand-amber">Strict</div>
              <div className="text-sm text-muted-foreground">Pacing</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-primary">Instructions for Parents:</h3>
            <p className="text-sm text-brand-primary/80 font-medium bg-blue-50 px-3 py-2 rounded-md mb-4 inline-block border border-blue-100">
              Designed around GL-style reasoning types used in Bucks.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">1</span>
                Ensure your child is in a quiet room free from distractions.
              </li>
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">2</span>
                Provide them with rough paper and a pencil for working out.
              </li>
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">3</span>
                Do not help them with the answers. The forecast engine needs an honest baseline.
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3" data-testid="text-comp-timing-note">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">Comprehension sections have their own separate timer.</span>{" "}
              When a reading passage appears, the main clock pauses and a dedicated reading countdown begins. Your child will see a "Begin Answering" button to move on when they're ready.
            </p>
          </div>

          <div className="pt-6 border-t border-border/50 text-center">
            <Button 
              size="lg" 
              className="h-14 px-12 text-lg bg-primary w-full sm:w-auto"
              onClick={() => startSessionMutation.mutate()}
              disabled={startSessionMutation.isPending}
              data-testid="button-begin-assessment"
            >
              {startSessionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Begin Assessment Now"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline fallback for missing Badge component if needed, but it's imported in other places via ui/badge.
function Badge({ children, className }: any) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}
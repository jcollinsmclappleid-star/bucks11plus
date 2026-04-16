import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Diagnostic } from "@shared/schema";

const BUCKS_GRAMMAR_SCHOOLS = [
  "Aylesbury Grammar School",
  "Aylesbury High School",
  "Beaconsfield High School",
  "Burnham Grammar School",
  "Chesham Grammar School",
  "Dr Challoner's Grammar School",
  "Dr Challoner's High School",
  "John Hampden Grammar School",
  "Royal Grammar School (High Wycombe)",
  "Royal Latin School",
  "Sir Henry Floyd Grammar School",
  "Sir William Borlase's Grammar School",
  "Wycombe High School",
  "Not sure yet",
  "Other",
];

const FREE_DIAGNOSTIC_ID = "mini-1";

export default function FreeDiagnosticStart() {
  const [, setLocation] = useLocation();
  const [starting, setStarting] = useState(false);
  const [targetSchool, setTargetSchool] = useState("");

  const { data: diagnostic, isLoading } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${FREE_DIAGNOSTIC_ID}`],
  });

  const startGuestSession = useMutation({
    mutationFn: async () => {
      setStarting(true);
      const res = await fetch("/api/guest/start-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosticId: FREE_DIAGNOSTIC_ID }),
      });
      if (!res.ok) throw new Error("Failed to start readiness check");
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions available. Please try again in a moment.");
      }
      return data;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("guestToken", data.guestToken);
      sessionStorage.setItem("guestSessionId", data.session.id);
      sessionStorage.setItem("guestQuestions", JSON.stringify(data.questions));
      sessionStorage.setItem("guestDiagnosticDuration", String(diagnostic?.duration || 12));
      sessionStorage.setItem("guestDiagnosticTitle", diagnostic?.title || "Free Baseline Diagnostic");
      if (targetSchool) sessionStorage.setItem("guestTargetSchool", targetSchool);
      setLocation(`/app/test/${data.session.id}?guest=true`);
    },
    onError: () => {
      setStarting(false);
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
        <h1 className="text-2xl font-bold text-primary">Readiness check not available</h1>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo
        title="Free Baseline Readiness Check | Bucks 11 Plus Tests"
        description="Take a free 8-minute readiness check to see where your child stands against the Bucks 121 benchmark. No account needed."
      />

      <Card className="border-border/60 shadow-lg overflow-hidden" data-testid="card-free-diagnostic-start">
        <div className="bg-primary p-8 text-center border-b border-primary-foreground/10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
            No Account Needed
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif tracking-tight" data-testid="text-free-diagnostic-title">
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
              Aligned to GL-style reasoning types used in Bucks.
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
                Do not help them with the answers. The forecast needs an honest baseline.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <label className="block font-bold text-primary text-sm">Which grammar school are you targeting?</label>
            <select
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              className="w-full px-3 py-3 rounded-md border border-slate-200 text-sm bg-white"
              data-testid="select-diagnostic-target-school"
            >
              <option value="">Select a school (optional)</option>
              {BUCKS_GRAMMAR_SCHOOLS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="pt-6 border-t border-border/50 text-center">
            {startGuestSession.isError && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-left" data-testid="error-start-diagnostic">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  {(startGuestSession.error as Error)?.message || "Something went wrong. Please try again."}
                </p>
              </div>
            )}
            <Button
              size="lg"
              className="h-14 px-12 text-lg bg-primary w-full sm:w-auto"
              onClick={() => startGuestSession.mutate()}
              disabled={starting}
              data-testid="button-begin-free-assessment"
            >
              {starting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Begin Free Assessment"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Your results will be shown immediately after completion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

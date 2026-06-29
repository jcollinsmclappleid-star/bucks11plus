import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Diagnostic } from "@shared/schema";

const FREE_DIAGNOSTIC_ID = "mini-1";
const DISPLAY_TITLE = "Free Practice Test";

/** Shown immediately while the API loads — matches seeded mini-1 metadata. */
const MINI_DIAGNOSTIC_PLACEHOLDER: Diagnostic = {
  id: FREE_DIAGNOSTIC_ID,
  title: "Mini Diagnostic",
  subtitle: "Quick 8-minute assessment across core GL-style reasoning",
  type: "mini",
  duration: 8,
  questionCount: 12,
  requiredTier: "free",
  sections: ["Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics", "English Comprehension"],
};

async function startGuestDiagnostic(attempt = 0): Promise<{
  session: { id: string };
  guestToken: string;
  questions: unknown[];
}> {
  const res = await fetch("/api/guest/start-diagnostic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ diagnosticId: FREE_DIAGNOSTIC_ID }),
  });
  if (!res.ok) {
    if (res.status >= 500 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      return startGuestDiagnostic(attempt + 1);
    }
    throw new Error("Failed to start practice test. Please try again in a moment.");
  }
  const data = await res.json();
  if (!data.questions || data.questions.length === 0) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      return startGuestDiagnostic(attempt + 1);
    }
    throw new Error("Questions are still loading. Please wait a few seconds and try again.");
  }
  return data;
}

export default function FreeDiagnosticStart() {
  const [, setLocation] = useLocation();
  const [starting, setStarting] = useState(false);

  const { data: diagnostic } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${FREE_DIAGNOSTIC_ID}`],
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 6000),
  });

  const info = diagnostic ?? MINI_DIAGNOSTIC_PLACEHOLDER;

  const startGuestSession = useMutation({
    mutationFn: () => startGuestDiagnostic(),
    onSuccess: (data) => {
      sessionStorage.setItem("guestToken", data.guestToken);
      sessionStorage.setItem("guestSessionId", data.session.id);
      sessionStorage.setItem("guestQuestions", JSON.stringify(data.questions));
      sessionStorage.setItem("guestDiagnosticDuration", String(info.duration || 8));
      sessionStorage.setItem("guestDiagnosticTitle", info.title || DISPLAY_TITLE);
      setLocation(`/app/test/${data.session.id}?guest=true`);
    },
    onError: () => {
      setStarting(false);
    },
    onMutate: () => {
      setStarting(true);
    },
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo
        title="Free Practice Test | Bucks 11 Plus Tests"
        description="Take a free 12-question practice test to get an indicative readiness signal calibrated to the Bucks 121 qualifying benchmark. No account needed."
      />

      <Card className="border-border/60 shadow-lg overflow-hidden" data-testid="card-free-diagnostic-start">
        <div className="bg-primary p-8 text-center border-b border-primary-foreground/10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
            No Account Needed
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif tracking-tight" data-testid="text-free-diagnostic-title">
            {DISPLAY_TITLE}
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            {info.subtitle || "Quick timed assessment across core GL-style reasoning"}
          </p>
        </div>

        <CardContent className="p-8 space-y-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary" data-testid="text-duration">{info.duration}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary" data-testid="text-question-count">{info.questionCount}</div>
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
                Do not help them with the answers. The indicative readiness check needs an honest baseline.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" data-testid="diagnostic-trust-row">
            <div className="grid sm:grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">Indicative Readiness vs 121</div>
                <div className="text-[11px] text-slate-500">Directional readiness signal — not the official GL standardised score</div>
              </div>
              <div className="sm:border-x border-slate-200 sm:px-3">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">Top 3 priorities</div>
                <div className="text-[11px] text-slate-500">The reasoning sub-skills that will move the score most</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">No account · No card</div>
                <div className="text-[11px] text-slate-500">Results stay yours — email them to yourself if you&apos;d like</div>
              </div>
            </div>
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
              variant="cta"
              className="h-14 px-12 text-lg w-full sm:w-auto"
              onClick={() => startGuestSession.mutate()}
              disabled={starting}
              data-testid="button-begin-free-assessment"
            >
              {starting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing your test…
                </>
              ) : (
                "Begin Free Practice Test"
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

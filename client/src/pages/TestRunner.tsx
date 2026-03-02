import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Diagnostic, Question, TestSession } from "@shared/schema";
import type { RenderConfig } from "@shared/contentTypes";
import VisualPrompt from "../components/render/VisualPrompt";

const LABELS = ["A", "B", "C", "D", "E", "F"];

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const isGuest = new URLSearchParams(search).get("guest") === "true";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: string, selectedAnswer: string, timeTaken: number }>>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [svgSelectedIndex, setSvgSelectedIndex] = useState<number | null>(null);

  const guestQuestions = useMemo(() => {
    if (!isGuest) return null;
    try {
      const stored = sessionStorage.getItem("guestQuestions");
      return stored ? JSON.parse(stored) as Question[] : null;
    } catch { return null; }
  }, [isGuest]);

  const guestTitle = isGuest ? (sessionStorage.getItem("guestDiagnosticTitle") || "Free Diagnostic") : "";
  const guestDuration = isGuest ? parseInt(sessionStorage.getItem("guestDiagnosticDuration") || "12", 10) : 0;

  const { data: session, isLoading: sessionLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    enabled: !isGuest,
  });

  const { data: diagnostic, isLoading: diagLoading } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${session?.diagnosticId}`],
    enabled: !isGuest && !!session?.diagnosticId,
  });

  const { data: fetchedQuestions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: [`/api/diagnostics/${session?.diagnosticId}/questions`],
    enabled: !isGuest && !!session?.diagnosticId,
  });

  const questions = isGuest ? guestQuestions : fetchedQuestions;
  const diagnosticTitle = isGuest ? guestTitle : (diagnostic?.title || "");
  const diagnosticDuration = isGuest ? guestDuration : (diagnostic?.duration || 0);

  const submitMutation = useMutation({
    mutationFn: async (finalAnswers: typeof answers) => {
      if (isGuest) {
        const guestToken = sessionStorage.getItem("guestToken") || "";
        const res = await fetch(`/api/guest/submit/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: finalAnswers, guestToken }),
        });
        if (!res.ok) throw new Error("Submit failed");
        return res.json();
      } else {
        const res = await apiRequest("POST", `/api/test-sessions/${id}/submit`, { answers: finalAnswers });
        return res.json();
      }
    },
    onSuccess: () => {
      if (isGuest) {
        setLocation(`/free-results/${id}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
        setLocation(`/app/results/${id}`);
      }
    }
  });

  useEffect(() => {
    if (diagnosticDuration) {
      setTimeLeft(diagnosticDuration * 60);
    }
  }, [diagnosticDuration]);

  const handleFinish = useCallback(() => {
    submitMutation.mutate(answers);
  }, [answers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && prev > 0) {
          handleFinish();
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleFinish]);

  const handleNext = useCallback((selectedAnswer: string) => {
    if (!questions) return;

    const question = questions[currentQuestionIndex];
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    const newAnswers = [...answers, {
      questionId: question.id,
      selectedAnswer,
      timeTaken
    }];

    setAnswers(newAnswers);
    setSvgSelectedIndex(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      submitMutation.mutate(newAnswers);
    }
  }, [questions, currentQuestionIndex, questionStartTime, answers]);

  useEffect(() => {
    if (!questions) return;
    const question = questions[currentQuestionIndex];
    const isSvgWithVisualOptions = question.renderType === "svg" && (question.renderConfig as any)?.answerOptions;

    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65;
      if (idx < 0 || idx >= question.options.length) return;

      if (isSvgWithVisualOptions) {
        setSvgSelectedIndex(idx);
        setTimeout(() => handleNext(LABELS[idx]), 300);
      } else {
        handleNext(question.options[idx]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [questions, currentQuestionIndex, handleNext]);

  const isLoading = isGuest
    ? !questions
    : (sessionLoading || diagLoading || questionsLoading || !questions || !diagnostic);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-8">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  const question = questions![currentQuestionIndex];
  const totalQuestions = questions!.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  const renderType = (question.renderType || "text") as "text" | "svg" | "chart";
  const renderConfig = question.renderConfig as RenderConfig | null;
  const isSvgWithVisualOptions = renderType === "svg" && renderConfig && "answerOptions" in renderConfig;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-primary">11+ Standard</div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm font-medium text-muted-foreground">{diagnosticTitle}</div>
        </div>

        <div className={`font-mono text-lg font-medium px-3 py-1 rounded ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
          {timeString}
        </div>

        <Button variant="ghost" size="sm" onClick={() => setLocation(isGuest ? "/" : "/app")} data-testid="button-exit">
          Exit
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span data-testid="text-section">{question.section}</span>
            <span data-testid="text-progress">Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>
          <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col">
          <div className="mb-8 prose prose-slate max-w-none">
            <p className="text-lg text-primary font-medium leading-relaxed" data-testid="text-question-prompt">
              {question.prompt}
            </p>
          </div>

          {(renderType === "svg" || renderType === "chart") && renderConfig && (
            <div className="mb-8">
              <VisualPrompt
                renderType={renderType}
                renderConfig={renderConfig}
                selectedAnswer={svgSelectedIndex}
                onSelectAnswer={(idx) => {
                  setSvgSelectedIndex(idx);
                  setTimeout(() => handleNext(LABELS[idx]), 300);
                }}
              />
            </div>
          )}

          {!isSvgWithVisualOptions && (
            <div className="space-y-3 mt-auto">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleNext(opt)}
                  disabled={submitMutation.isPending}
                  data-testid={`button-option-${i}`}
                  aria-label={`Option ${LABELS[i]}`}
                  className="w-full text-left px-6 py-4 rounded-lg border-2 transition-all flex items-center gap-4 border-border/50 hover:border-primary/30 text-slate-700 hover:bg-slate-50"
                >
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium border-slate-300">
                    {LABELS[i]}
                  </div>
                  <span className="font-medium text-lg">{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center items-center">
          <p className="text-sm text-muted-foreground italic">
            Select an option to move to the next question
          </p>
        </div>
      </main>
    </div>
  );
}

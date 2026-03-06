import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question } from "@shared/schema";
import type { RenderConfig } from "@shared/contentTypes";
import VisualPrompt from "../components/render/VisualPrompt";
import { CheckCircle, XCircle } from "lucide-react";

const LABELS = ["A", "B", "C", "D", "E", "F"];

type FeedbackState = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
} | null;

export default function DrillRunner() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [svgSelectedIndex, setSvgSelectedIndex] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<Array<{ questionId: string; isCorrect: boolean; timeTaken: number }>>([]);
  const [finished, setFinished] = useState(false);
  const sessionKey = useRef(Date.now());

  const { data: questions, isLoading, error } = useQuery<Question[]>({
    queryKey: [`/api/practice-sections/${sectionId}/questions`],
    staleTime: 0,
    gcTime: 0,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-red-600 font-serif">Error Loading Drill</h1>
          <p className="text-muted-foreground">{(error as any).message || "An unexpected error occurred."}</p>
          <Button onClick={() => setLocation("/app/practice")}>Back to Practice</Button>
        </div>
      </div>
    );
  }

  const checkMutation = useMutation({
    mutationFn: async ({ questionId, selectedAnswer }: { questionId: string; selectedAnswer: string }) => {
      const res = await apiRequest("POST", `/api/practice-sections/${sectionId}/check-answer`, { questionId, selectedAnswer });
      return res.json();
    },
    onSuccess: (data, variables) => {
      const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
      setFeedback({ isCorrect: data.isCorrect, correctAnswer: data.correctAnswer, explanation: data.explanation });
      setResults(prev => [...prev, { questionId: variables.questionId, isCorrect: data.isCorrect, timeTaken }]);
    }
  });

  const handleSelect = useCallback((selectedAnswer: string) => {
    if (!questions || feedback) return;
    const question = questions[currentQuestionIndex];
    checkMutation.mutate({ questionId: question.id, selectedAnswer });
  }, [questions, currentQuestionIndex, feedback]);

  const handleNext = () => {
    if (!questions) return;
    setFeedback(null);
    setSvgSelectedIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setFinished(true);
    }
  };

  useEffect(() => {
    if (!questions || feedback) return;
    const question = questions[currentQuestionIndex];
    const isSvgWithVisualOptions = question.renderType === "svg" && (question.renderConfig as any)?.answerOptions;

    const handler = (e: KeyboardEvent) => {
      if (feedback) return;
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65;
      if (idx < 0 || idx >= question.options.length) return;

      if (isSvgWithVisualOptions) {
        setSvgSelectedIndex(idx);
        handleSelect(LABELS[idx]);
      } else {
        handleSelect(question.options[idx]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [questions, currentQuestionIndex, feedback, handleSelect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-8">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-primary font-serif">No Questions Found</h1>
          <p className="text-muted-foreground">We couldn't find any questions for this section. Please try another one.</p>
          <Button onClick={() => setLocation("/app/practice")}>Back to Practice</Button>
        </div>
      </div>
    );
  }

  if (finished) {
    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-primary font-serif" data-testid="text-drill-complete">Drill Complete!</h1>
          <div className="text-5xl font-bold text-primary" data-testid="text-drill-score">{pct}%</div>
          <p className="text-muted-foreground" data-testid="text-drill-summary">{correct} out of {total} correct</p>
          <Progress value={pct} className="h-3" />
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setLocation("/app/practice")} data-testid="button-back-practice">Back to Practice</Button>
            <Button variant="outline" onClick={() => setLocation("/app")} data-testid="button-back-dashboard">Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  const renderType = (question.renderType || "text") as "text" | "svg" | "chart";
  const renderConfig = question.renderConfig as RenderConfig | null;
  const isSvgWithVisualOptions = renderType === "svg" && renderConfig && "answerOptions" in renderConfig;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-primary">11+ Standard</div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm font-medium text-muted-foreground">Practice Drill</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setLocation("/app/practice")} data-testid="button-exit-drill">
          Exit
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span data-testid="text-drill-section">{question.section}</span>
            <span data-testid="text-drill-progress">Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>
          <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col">
          <div className="mb-8 prose prose-slate max-w-none">
            <p className="text-lg text-primary font-medium leading-relaxed" data-testid="text-drill-prompt">
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
                  if (feedback) return;
                  setSvgSelectedIndex(idx);
                  handleSelect(LABELS[idx]);
                }}
              />
            </div>
          )}

          {!isSvgWithVisualOptions && (
            <div className="space-y-3 mt-auto">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={!!feedback || checkMutation.isPending}
                  data-testid={`button-drill-option-${i}`}
                  aria-label={`Option ${LABELS[i]}`}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    feedback
                      ? opt === feedback.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-border/50 text-slate-400"
                      : "border-border/50 hover:border-primary/30 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium border-slate-300">
                    {LABELS[i]}
                  </div>
                  <span className="font-medium text-lg">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {feedback && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${feedback.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`} data-testid="drill-feedback">
              {feedback.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              )}
              <div>
                <p className={`font-semibold ${feedback.isCorrect ? "text-green-800" : "text-red-800"}`} data-testid="text-feedback-result">
                  {feedback.isCorrect ? "Correct!" : "Incorrect"}
                </p>
                {feedback.explanation && (
                  <p className="text-sm text-slate-600 mt-1" data-testid="text-feedback-explanation">{feedback.explanation}</p>
                )}
                {!feedback.isCorrect && (
                  <p className="text-sm text-slate-600 mt-1" data-testid="text-feedback-correct">Correct answer: {feedback.correctAnswer}</p>
                )}
              </div>
            </div>
          )}

          {feedback && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} data-testid="button-next-question">
                {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

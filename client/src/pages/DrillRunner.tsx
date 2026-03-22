import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question } from "@shared/schema";
import type { RenderConfig } from "@shared/contentTypes";
import VisualPrompt from "../components/render/VisualPrompt";
import { CheckCircle, XCircle, Timer, BookOpen } from "lucide-react";

const LABELS = ["A", "B", "C", "D", "E", "F"];

type FeedbackState = {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string | null;
} | null;

type TimedResult = {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
};

export default function DrillRunner() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const search = useSearch();
  const isTimed = new URLSearchParams(search).get("mode") === "timed";

  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [svgSelectedIndex, setSvgSelectedIndex] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<Array<{ questionId: string; isCorrect: boolean; timeTaken: number }>>([]);
  const [finished, setFinished] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const sessionKey = useRef(Date.now());

  const [timedAnswers, setTimedAnswers] = useState<Array<{ questionId: string; selectedAnswer: string; timeTaken: number }>>([]);
  const [timedResults, setTimedResults] = useState<TimedResult[]>([]);
  const [timedCorrect, setTimedCorrect] = useState(0);
  const [timedTotal, setTimedTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInitialized, setTimerInitialized] = useState(false);

  const { data: drillData, isLoading, error } = useQuery<{ questions: Question[]; exhaustion_warning: boolean }>({
    queryKey: [`/api/practice-sections/${sectionId}/questions`],
    staleTime: 0,
    gcTime: 0,
  });
  const questions = drillData?.questions;
  const exhaustionWarning = drillData?.exhaustion_warning;

  useEffect(() => {
    if (isTimed && questions && questions.length > 0 && !timerInitialized) {
      const totalSeconds = questions.reduce((sum, q) => sum + ((q as any).estTimeSeconds || 30), 0);
      setTimeLeft(totalSeconds);
      setTimerInitialized(true);
    }
  }, [isTimed, questions, timerInitialized]);

  const submitTimedMutation = useMutation({
    mutationFn: async (finalAnswers: typeof timedAnswers) => {
      const res = await apiRequest("POST", `/api/practice-sections/${sectionId}/submit-timed`, { answers: finalAnswers });
      return res.json();
    },
    onSuccess: (data) => {
      setTimedResults(data.results);
      setTimedCorrect(data.correct);
      setTimedTotal(data.total);
      setFinished(true);
    },
  });

  const handleTimedFinish = useCallback(() => {
    if (submitTimedMutation.isPending) return;
    const finalAnswers = [...timedAnswers];
    if (questions) {
      for (let i = finalAnswers.length; i < questions.length; i++) {
        finalAnswers.push({ questionId: questions[i].id, selectedAnswer: "", timeTaken: 0 });
      }
    }
    submitTimedMutation.mutate(finalAnswers);
  }, [timedAnswers, questions, submitTimedMutation.isPending]);

  useEffect(() => {
    if (!isTimed || !timerInitialized || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && prev > 0) {
          handleTimedFinish();
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimed, timerInitialized, finished, handleTimedFinish]);

  if (error) {
    return (
      <div className="min-h-screen exam-paper-bg flex flex-col items-center justify-center p-8">
        <div className="drill-complete-card max-w-md w-full text-center space-y-6">
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
      setFeedback({ isCorrect: data.isCorrect, correctAnswer: data.correctAnswer, selectedAnswer: variables.selectedAnswer, explanation: data.explanation });
      setResults(prev => [...prev, { questionId: variables.questionId, isCorrect: data.isCorrect, timeTaken }]);
    }
  });

  const handleSelect = useCallback((selectedAnswer: string) => {
    if (!questions || feedback) return;
    const question = questions[currentQuestionIndex];

    if (isTimed) {
      const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
      setTimedAnswers(prev => [...prev, { questionId: question.id, selectedAnswer, timeTaken }]);
      setSvgSelectedIndex(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
        setAnimKey(prev => prev + 1);
      } else {
        const finalAnswers = [...timedAnswers, { questionId: question.id, selectedAnswer, timeTaken }];
        submitTimedMutation.mutate(finalAnswers);
      }
    } else {
      checkMutation.mutate({ questionId: question.id, selectedAnswer });
    }
  }, [questions, currentQuestionIndex, feedback, isTimed, questionStartTime, timedAnswers]);

  const completeDrillMutation = useMutation({
    mutationFn: async () => {
      const skillId = questions?.[0]?.skillId || undefined;
      await apiRequest("POST", `/api/practice-sections/${sectionId}/complete-drill`, { skillId });
    },
  });

  const handleNext = () => {
    if (!questions) return;
    setFeedback(null);
    setSvgSelectedIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setAnimKey(prev => prev + 1);
    } else {
      completeDrillMutation.mutate();
      setFinished(true);
    }
  };

  useEffect(() => {
    if (!questions || (!isTimed && feedback)) return;
    const question = questions[currentQuestionIndex];
    const isSvgWithVisualOptions = question.renderType === "svg" && (question.renderConfig as any)?.answerOptions;

    const handler = (e: KeyboardEvent) => {
      if (!isTimed && feedback) return;
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
  }, [questions, currentQuestionIndex, feedback, handleSelect, isTimed]);

  if (isLoading) {
    return (
      <div className="min-h-screen exam-paper-bg flex flex-col p-8">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen exam-paper-bg flex flex-col items-center justify-center p-8">
        <div className="drill-complete-card max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-primary font-serif">No Questions Found</h1>
          <p className="text-muted-foreground">
            {exhaustionWarning
              ? "You've practiced all available questions in this area — great work! Questions will refresh soon."
              : "We couldn't find any questions for this section. Please try another one."}
          </p>
          <Button onClick={() => setLocation("/app/practice")}>Back to Practice</Button>
        </div>
      </div>
    );
  }

  if (finished) {
    if (isTimed) {
      const pct = timedTotal > 0 ? Math.round((timedCorrect / timedTotal) * 100) : 0;
      return (
        <div className="min-h-screen exam-paper-bg flex flex-col items-center justify-center p-4 md:p-8">
          <div className="drill-complete-card max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Timer className="h-3.5 w-3.5" /> Timed Drill
              </div>
              <h1 className="text-2xl font-bold text-primary font-serif" data-testid="text-drill-complete">Timed Drill Complete!</h1>
              <div className="text-5xl font-bold text-primary" data-testid="text-drill-score">{pct}%</div>
              <p className="text-muted-foreground" data-testid="text-drill-summary">{timedCorrect} out of {timedTotal} correct</p>
              <div className="progress-premium max-w-xs mx-auto">
                <Progress value={pct} className="h-3" />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <h2 className="font-semibold text-primary text-sm uppercase tracking-wide">Question Review</h2>
              {timedResults.map((r, i) => {
                const q = questions.find(qq => qq.id === r.questionId);
                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 text-sm ${r.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}
                    data-testid={`timed-result-${i}`}
                  >
                    <div className="flex items-start gap-2">
                      {r.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-700 truncate">{q?.prompt || `Question ${i + 1}`}</p>
                        {!r.isCorrect && r.selectedAnswer && (
                          <p className="text-red-600 text-xs mt-0.5">Your answer: {r.selectedAnswer}</p>
                        )}
                        {!r.isCorrect && !r.selectedAnswer && (
                          <p className="text-slate-500 text-xs mt-0.5">Not answered</p>
                        )}
                        {!r.isCorrect && (
                          <p className="text-green-700 text-xs mt-0.5">Correct: {r.correctAnswer}</p>
                        )}
                        {r.explanation && (
                          <p className="text-slate-500 text-xs mt-1">{r.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => setLocation("/app/practice")} data-testid="button-back-practice">Back to Practice</Button>
              <Button variant="outline" onClick={() => setLocation("/app")} data-testid="button-back-dashboard">Dashboard</Button>
            </div>
          </div>
        </div>
      );
    }

    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="min-h-screen exam-paper-bg flex flex-col items-center justify-center p-8">
        <div className="drill-complete-card max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-primary font-serif" data-testid="text-drill-complete">Drill Complete!</h1>
          <div className="text-5xl font-bold text-primary" data-testid="text-drill-score">{pct}%</div>
          <p className="text-muted-foreground" data-testid="text-drill-summary">{correct} out of {total} correct</p>
          <div className="progress-premium">
            <Progress value={pct} className="h-3" />
          </div>
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

  const renderType = (question.renderType || "text") as "text" | "svg" | "chart" | "comprehension";
  const renderConfig = question.renderConfig as RenderConfig | null;
  const isSvgWithVisualOptions = renderType === "svg" && renderConfig && "answerOptions" in renderConfig;

  // Comprehension passage data
  const rc = (question.renderConfig as any) || {};
  const isCompQuestion = renderType === "comprehension";
  const passageId = rc.passageId || "__none__";
  const passageTitle = rc.passageTitle || "Reading Passage";
  const passageText = rc.passageText || "";
  const passageTheme = rc.passageTheme || "";

  // Build ordered list of unique passage IDs for "Passage X of Y" label
  const passageOrder: string[] = [];
  const passageSeen = new Set<string>();
  for (const q of questions) {
    if (q.renderType === "comprehension") {
      const pid = (q.renderConfig as any)?.passageId || "__none__";
      if (!passageSeen.has(pid)) { passageSeen.add(pid); passageOrder.push(pid); }
    }
  }
  const passageNumber = passageOrder.indexOf(passageId) + 1;
  const totalPassages = passageOrder.length;
  const showPassageLabel = isCompQuestion && totalPassages > 1;

  const getOptionClass = (opt: string) => {
    if (isTimed) return "option-button";
    if (!feedback) return "option-button";
    if (opt === feedback.correctAnswer) return "option-button option-correct";
    if (opt === feedback.selectedAnswer && !feedback.isCorrect) return "option-button option-incorrect";
    return "option-button option-dimmed";
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;
  const timerClass = timeLeft < 60 ? "timer-pill timer-pill-danger" : timeLeft < 180 ? "timer-pill timer-pill-warning" : "timer-pill timer-pill-normal";

  return (
    <div className="min-h-screen exam-paper-bg flex flex-col font-sans">
      <header className="premium-header px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-primary text-lg tracking-tight">11+ Standard</div>
          <div className="h-5 w-px bg-border/60"></div>
          <div className="text-sm font-medium text-muted-foreground">
            {isTimed ? 'Timed Drill' : 'Practice Drill'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isTimed && (
            <div className={timerClass} data-testid="text-drill-timer">
              {timeString}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setLocation("/app/practice")} data-testid="button-exit-drill">
            Exit
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <span className="section-badge" data-testid="text-drill-section">{question.section}</span>
            <span data-testid="text-drill-progress">Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>
          <div className="progress-premium">
            <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />
          </div>
        </div>

        <div className="premium-card p-8 flex-1 flex flex-col question-fade-in" key={animKey}>
          {isCompQuestion && passageText && (
            <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden" data-testid="comprehension-passage-drill">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
                <BookOpen className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary/70 flex-1 truncate" data-testid="text-drill-passage-title">
                  {passageTitle}
                  {passageTheme && (
                    <span className="ml-2 font-normal normal-case text-muted-foreground">· {passageTheme}</span>
                  )}
                </span>
                {showPassageLabel && (
                  <span className="text-xs font-medium text-muted-foreground shrink-0" data-testid="text-drill-passage-label">
                    Passage {passageNumber} of {totalPassages}
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto p-5 bg-slate-50" data-testid="comprehension-passage-text-drill">
                <p className="text-base leading-relaxed text-slate-700 font-serif italic whitespace-pre-line">
                  {passageText}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="text-xl text-primary font-medium leading-relaxed tracking-[-0.01em]" data-testid="text-drill-prompt">
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
                  if (!isTimed && feedback) return;
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
                  disabled={(!isTimed && (!!feedback || checkMutation.isPending)) || submitTimedMutation.isPending}
                  data-testid={`button-drill-option-${i}`}
                  aria-label={`Option ${LABELS[i]}`}
                  className={getOptionClass(opt)}
                >
                  <div className="option-badge">
                    {LABELS[i]}
                  </div>
                  <span className="font-medium text-lg text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {!isTimed && feedback && (
            <div className={`mt-6 flex items-start gap-3 feedback-enter ${feedback.isCorrect ? "feedback-correct" : "feedback-incorrect"}`} data-testid="drill-feedback">
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

          {!isTimed && feedback && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} data-testid="button-next-question">
                {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}

          {isTimed && (
            <div className="mt-6 flex justify-center items-center">
              <p className="text-sm text-muted-foreground/70 italic">
                Select an option to move to the next question
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Diagnostic, Question, TestSession } from "@shared/schema";
import type { RenderConfig } from "@shared/contentTypes";
import VisualPrompt from "../components/render/VisualPrompt";
import { BookOpen, ChevronRight } from "lucide-react";
import { useAuth } from "../lib/auth";

const LABELS = ["A", "B", "C", "D", "E", "F"];
const COMP_ANSWER_SECONDS = 45;

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const isGuest = searchParams.get("guest") === "true";
  const isPractice = searchParams.get("practice") === "true";

  const { user, isLoading: authLoading, hasPaidAccess } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: string; selectedAnswer: string; timeTaken: number }>>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [svgSelectedIndex, setSvgSelectedIndex] = useState<number | null>(null);
  const [pendingSelectedOpt, setPendingSelectedOpt] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Guard against double-submit (last-question click + timer race, or timer firing twice)
  const submitCalledRef = useRef(false);

  // Two-phase comprehension timer state
  const [compReadingActive, setCompReadingActive] = useState(false);
  const [compReadingTimeLeft, setCompReadingTimeLeft] = useState(0);
  const [compAnswerTimeLeft, setCompAnswerTimeLeft] = useState(0);

  // Refs used inside the single interval (avoids stale closures)
  const compReadingActiveRef = useRef(false);
  const compAnswerActiveRef = useRef(false);
  const lastReadPassageRef = useRef<string | null>(null);

  const guestQuestions = useMemo(() => {
    if (!isGuest) return null;
    try {
      const stored = sessionStorage.getItem("guestQuestions");
      return stored ? (JSON.parse(stored) as Question[]) : null;
    } catch { return null; }
  }, [isGuest]);

  const practiceQuestions = useMemo(() => {
    if (!isPractice) return null;
    try {
      const stored = sessionStorage.getItem("practiceQuestions");
      return stored ? (JSON.parse(stored) as Question[]) : null;
    } catch { return null; }
  }, [isPractice]);

  const guestTitle = isGuest ? (sessionStorage.getItem("guestDiagnosticTitle") || "Free Diagnostic") : "";
  const guestDuration = isGuest ? parseInt(sessionStorage.getItem("guestDiagnosticDuration") || "12", 10) : 0;

  const { data: session, isLoading: sessionLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    enabled: !isGuest && !isPractice,
  });

  const { data: diagnostic, isLoading: diagLoading } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${session?.diagnosticId}`],
    enabled: !isGuest && !isPractice && !!session?.diagnosticId,
  });

  const { data: fetchedQuestions, isLoading: questionsLoading } = useQuery<Question[]>({
    // Include session ID so each session fetches its own fresh question set
    // (prevents stale cache being reused across retakes of the same diagnostic)
    queryKey: [`/api/diagnostics/${session?.diagnosticId}/questions`, id],
    queryFn: async () => {
      const res = await fetch(`/api/diagnostics/${session?.diagnosticId}/questions`, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    enabled: !isGuest && !isPractice && !!session?.diagnosticId,
  });

  const { data: practiceSession } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    enabled: isPractice,
  });

  const { data: practiceDiagnostic } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${practiceSession?.diagnosticId}`],
    enabled: isPractice && !!practiceSession?.diagnosticId,
  });

  const questions = isGuest ? guestQuestions : isPractice ? practiceQuestions : fetchedQuestions;
  const diagnosticTitle = isGuest ? guestTitle : isPractice ? (practiceDiagnostic?.title || "Practice Paper") : (diagnostic?.title || "");
  const diagnosticDuration = isGuest ? guestDuration : isPractice ? (practiceDiagnostic?.duration || 45) : (diagnostic?.duration || 0);

  useEffect(() => {
    if (isGuest) return;
    if (authLoading) return;
    if (!user) { setLocation("/sign-in"); return; }
    if (!isPractice && diagnostic && diagnostic.type !== "mini" && !hasPaidAccess()) {
      setLocation("/pricing");
    }
  }, [isGuest, authLoading, user, diagnostic, isPractice]);

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
      setSubmitError(null);
      if (isGuest) {
        setLocation(`/free-results/${id}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
        queryClient.invalidateQueries({ queryKey: [`/api/test-sessions/${id}`] });
        setLocation(`/app/results/${id}`);
      }
      if (isPractice) {
        sessionStorage.removeItem("practiceQuestions");
      }
    },
    onError: (err: Error) => {
      submitCalledRef.current = false;
      setSubmitError(err.message || "Submission failed. Please try again.");
    },
  });

  // Initialise main timer
  useEffect(() => {
    if (diagnosticDuration) {
      setTimeLeft(diagnosticDuration * 60);
    }
  }, [diagnosticDuration]);

  // Ref wrappers so interval callback stays stable
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const submitMutationRef = useRef(submitMutation);
  submitMutationRef.current = submitMutation;

  const handleFinish = useCallback(() => {
    if (submitCalledRef.current) return;
    submitCalledRef.current = true;
    submitMutationRef.current.mutate(answersRef.current);
  }, []);

  // --- Two-phase trigger: watch question changes ---
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    const q = questions[currentQuestionIndex];

    if (q.renderType === "comprehension") {
      const rc = (q.renderConfig as any) || {};
      const pid = rc.passageId || q.subRuleId || `__comp_${currentQuestionIndex}__`;

      if (pid !== lastReadPassageRef.current) {
        // New passage — enter reading phase
        const readingTime = (rc.estTimeSeconds as number) || 150;
        setCompReadingTimeLeft(readingTime);
        setCompAnswerTimeLeft(0);
        setCompReadingActive(true);
        compReadingActiveRef.current = true;
        compAnswerActiveRef.current = false;
        // don't mark lastRead yet; do it when reading phase ends
      } else {
        // Same passage, next question — skip straight to answering phase
        setCompReadingActive(false);
        compReadingActiveRef.current = false;
        compAnswerActiveRef.current = true;
        setCompAnswerTimeLeft(COMP_ANSWER_SECONDS);
      }
    } else {
      // Non-comprehension question — normal main timer
      setCompReadingActive(false);
      compReadingActiveRef.current = false;
      compAnswerActiveRef.current = false;
      setCompAnswerTimeLeft(0);
    }
  }, [currentQuestionIndex, questions]);

  // Handle transition from reading → answering phase
  const startAnsweringPhase = useCallback(() => {
    if (!questions || questions.length === 0) return;
    const q = questions[currentQuestionIndex];
    if (!q) return;
    const rc = (q.renderConfig as any) || {};
    const pid = rc.passageId || q.subRuleId || `__comp_${currentQuestionIndex}__`;
    lastReadPassageRef.current = pid;

    setCompReadingActive(false);
    compReadingActiveRef.current = false;
    compAnswerActiveRef.current = true;
    setCompReadingTimeLeft(0);
    setCompAnswerTimeLeft(COMP_ANSWER_SECONDS);
  }, [questions, currentQuestionIndex]);

  // --- Single interval driving all timers ---
  const handleFinishRef = useRef(handleFinish);
  handleFinishRef.current = handleFinish;

  useEffect(() => {
    const timer = setInterval(() => {
      if (compReadingActiveRef.current) {
        setCompReadingTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-transition to answering
            compReadingActiveRef.current = false;
            compAnswerActiveRef.current = true;
            setCompReadingActive(false);
            setCompAnswerTimeLeft(COMP_ANSWER_SECONDS);
            return 0;
          }
          return prev - 1;
        });
      } else if (compAnswerActiveRef.current) {
        setCompAnswerTimeLeft(prev => {
          if (prev <= 1) {
            return 0; // let student answer; no auto-skip
          }
          return prev - 1;
        });
      } else {
        setTimeLeft(prev => {
          if (prev <= 1 && prev > 0) {
            handleFinishRef.current();
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = useCallback((selectedAnswer: string) => {
    if (!questions) return;

    const question = questions[currentQuestionIndex];
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    const newAnswers = [...answers, { questionId: question.id, selectedAnswer, timeTaken }];
    setAnswers(newAnswers);
    setSvgSelectedIndex(null);
    setPendingSelectedOpt(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setAnimKey(prev => prev + 1);
    } else {
      if (!submitCalledRef.current) {
        submitCalledRef.current = true;
        submitMutation.mutate(newAnswers);
      }
    }
  }, [questions, currentQuestionIndex, questionStartTime, answers, submitMutation]);

  // Keyboard handler — blocked during reading phase
  useEffect(() => {
    if (!questions || questions.length === 0 || compReadingActive) return;
    const question = questions[currentQuestionIndex];
    if (!question) return;
    const isSvgWithVisualOptions = question.renderType === "svg" && (question.renderConfig as any)?.answerOptions;

    const handler = (e: KeyboardEvent) => {
      if (compReadingActiveRef.current) return;
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
  }, [questions, currentQuestionIndex, handleNext, compReadingActive]);

  const isLoading = isGuest
    ? !questions
    : isPractice
    ? !questions
    : (sessionLoading || diagLoading || questionsLoading || !questions || !diagnostic);

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
      <div className="min-h-screen exam-paper-bg flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <h2 className="text-xl font-semibold text-primary">Unable to load questions</h2>
          <p className="text-muted-foreground">There was a problem preparing your test. Please go back and try again.</p>
          <Button onClick={() => setLocation("/app/diagnostics")} data-testid="button-back-diagnostics">
            Back to Diagnostics
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const totalQuestions = questions!.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, "0")}`;
  const timerClass = timeLeft < 60 ? "timer-pill timer-pill-danger" : timeLeft < 180 ? "timer-pill timer-pill-warning" : "timer-pill timer-pill-normal";

  const renderType = (question.renderType || "text") as "text" | "svg" | "chart" | "comprehension";
  const renderConfig = question.renderConfig as RenderConfig | null;
  const isSvgWithVisualOptions = renderType === "svg" && renderConfig && "answerOptions" in renderConfig;

  const rc = (question.renderConfig as any) || {};
  const isCompQuestion = renderType === "comprehension";
  const passageTitle = rc.passageTitle || "Reading Passage";
  const passageText = rc.passageText || "";

  const compReadingMins = Math.floor(compReadingTimeLeft / 60);
  const compReadingSecs = compReadingTimeLeft % 60;
  const compReadingStr = `${compReadingMins}:${compReadingSecs.toString().padStart(2, "0")}`;
  const compAnswerClass = compAnswerTimeLeft <= 10 ? "timer-pill timer-pill-danger" : compAnswerTimeLeft <= 20 ? "timer-pill timer-pill-warning" : "timer-pill timer-pill-normal";

  return (
    <div className="min-h-screen exam-paper-bg flex flex-col font-sans">
      <header className="premium-header px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="font-serif font-bold text-primary text-lg tracking-tight shrink-0 hidden md:block">11+ Standard</div>
          <div className="font-serif font-bold text-primary text-lg tracking-tight shrink-0 md:hidden">11+</div>
          <div className="h-5 w-px bg-border/60 shrink-0 hidden md:block"></div>
          <div className="text-sm font-medium text-muted-foreground truncate hidden md:block">{diagnosticTitle}</div>
        </div>

        <div className="flex items-center gap-2">
          {isCompQuestion && compReadingActive && (
            <div className="timer-pill timer-pill-normal flex items-center gap-1" data-testid="text-reading-timer">
              <BookOpen className="h-3.5 w-3.5" />
              {compReadingStr}
            </div>
          )}
          {isCompQuestion && !compReadingActive && compAnswerTimeLeft > 0 && (
            <div className={compAnswerClass} data-testid="text-comp-answer-timer">
              {compAnswerTimeLeft}s
            </div>
          )}
          {!isCompQuestion && (
            <div className={timerClass} data-testid="text-timer">
              {timeString}
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={() => setLocation(isGuest ? "/" : "/app/diagnostic")} data-testid="button-exit">
          Exit
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <span className="section-badge" data-testid="text-section">{question.section}</span>
            <span data-testid="text-progress">Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>
          <div className="progress-premium">
            <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />
          </div>
        </div>

        {/* ===== COMPREHENSION READING PHASE ===== */}
        {isCompQuestion && compReadingActive ? (
          <div className="premium-card p-8 flex-1 flex flex-col question-fade-in" key={`reading-${animKey}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-primary text-lg font-serif" data-testid="text-reading-phase-title">Reading Passage</p>
                <p className="text-sm text-muted-foreground">Read carefully — questions follow</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-primary" data-testid="text-reading-countdown">{compReadingStr}</div>
                <div className="text-xs text-muted-foreground">reading time</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl" data-testid="comprehension-passage-reading">
              {passageTitle && (
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/70 mb-4">{passageTitle}</h3>
              )}
              <p className="text-base leading-relaxed text-slate-700 font-serif italic whitespace-pre-line">
                {passageText}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground/70 italic">
                {compReadingTimeLeft > 0
                  ? `Timer runs automatically. Start when ready.`
                  : `Time's up — answering phase starting...`}
              </p>
              <Button
                onClick={startAnsweringPhase}
                className="flex items-center gap-2"
                data-testid="button-begin-answering"
              >
                Begin Answering
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* ===== QUESTION / ANSWERING PHASE ===== */
          <div className="premium-card p-8 flex-1 flex flex-col question-fade-in" key={animKey}>
            {isCompQuestion && passageText && (
              <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-lg max-h-72 overflow-y-auto" data-testid="comprehension-passage">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/70">{passageTitle}</span>
                  {compAnswerTimeLeft > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${compAnswerTimeLeft <= 10 ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`} data-testid="text-comp-answer-badge">
                      {compAnswerTimeLeft}s
                    </span>
                  )}
                </div>
                <p className="text-base leading-relaxed text-slate-700 font-serif italic whitespace-pre-line">
                  {passageText}
                </p>
              </div>
            )}

            <div className="mb-8">
              <p className="text-xl text-primary font-medium leading-relaxed tracking-[-0.01em]" data-testid="text-question-prompt">
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
                    onClick={() => {
                      if (pendingSelectedOpt !== null) return;
                      setPendingSelectedOpt(opt);
                      setTimeout(() => handleNext(opt), 300);
                    }}
                    disabled={submitMutation.isPending || pendingSelectedOpt !== null}
                    data-testid={`button-option-${i}`}
                    aria-label={`Option ${LABELS[i]}`}
                    className={`option-button${pendingSelectedOpt === opt ? " option-selected" : ""}`}
                  >
                    <div className="option-badge">{LABELS[i]}</div>
                    <span className="font-medium text-lg text-slate-700">{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {submitError && (
          <div className="mt-4 mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 text-center" data-testid="text-submit-error">
            {submitError} — <button className="underline" onClick={() => submitMutation.mutate(answers)}>Retry</button>
          </div>
        )}

        <div className="mt-6 flex justify-center items-center">
          <p className="text-sm text-muted-foreground/70 italic">
            {isCompQuestion && compReadingActive
              ? "Read the passage thoroughly before answering"
              : "Select an option to move to the next question"}
          </p>
        </div>
      </main>
    </div>
  );
}

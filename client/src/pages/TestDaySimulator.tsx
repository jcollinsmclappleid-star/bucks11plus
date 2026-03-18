import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

type Phase = "intro" | "paper1" | "break" | "paper2" | "results";

interface SimQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  section: string;
  explanation?: string;
  difficulty?: string;
}

function BubbleOption({ letter, selected, onClick, disabled }: { letter: string; selected: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all ${
        selected
          ? "bg-primary border-primary text-white scale-110"
          : "border-gray-300 hover:border-primary/50 text-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      data-testid={`bubble-${letter}`}
    >
      {letter}
    </button>
  );
}

function CountdownWidget({ examDate }: { examDate: string }) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const exam = new Date(examDate);
      const diff = Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      setDaysLeft(diff);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [examDate]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border" data-testid="countdown-widget">
      <div className="text-3xl font-bold text-primary" data-testid="text-days-left">{daysLeft}</div>
      <div className="text-sm">
        <p className="font-semibold text-primary">days until exam</p>
        <p className="text-muted-foreground text-xs">Buckinghamshire 11+</p>
      </div>
    </div>
  );
}

export { CountdownWidget };

export default function TestDaySimulator() {
  const { user, isProgramme } = useAuth();
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [breakTimeLeft, setBreakTimeLeft] = useState(600);
  const [paper1Time, setPaper1Time] = useState(0);
  const [paper2Time, setPaper2Time] = useState(0);
  const [timerStart, setTimerStart] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const isProgrammeUser = isProgramme();

  const { data: testDayConfig } = useQuery({
    queryKey: ["/api/test-day-config"],
    enabled: !!user,
  });

  const { data: simQuestions, isLoading: questionsLoading } = useQuery<{ paper1: SimQuestion[]; paper2: SimQuestion[] }>({
    queryKey: ["/api/simulator-questions"],
    enabled: !!isProgrammeUser,
    staleTime: 0,
    gcTime: 0,
  });

  const paper1Questions: SimQuestion[] = simQuestions?.paper1 || [];
  const paper2Questions: SimQuestion[] = simQuestions?.paper2 || [];

  const currentPaper = phase === "paper1" ? paper1Questions : paper2Questions;
  const paperOffset = phase === "paper2" ? paper1Questions.length : 0;
  const totalQuestions = paper1Questions.length + paper2Questions.length;

  useEffect(() => {
    if (phase === "break") {
      const interval = setInterval(() => {
        setBreakTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "paper1" || phase === "paper2") {
      setTimerStart(Date.now());
    }
  }, [phase]);

  const handleAnswer = useCallback((optionIndex: number) => {
    const globalIdx = currentQ + paperOffset;
    setAnswers(prev => ({ ...prev, [globalIdx]: currentPaper[currentQ].options[optionIndex] }));
  }, [currentQ, paperOffset, currentPaper]);

  const handleNext = useCallback(() => {
    if (currentQ < currentPaper.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else if (phase === "paper1") {
      setPaper1Time(Math.round((Date.now() - timerStart) / 1000));
      setPhase("break");
      setBreakTimeLeft(600);
      setCurrentQ(0);
    } else if (phase === "paper2") {
      setPaper2Time(Math.round((Date.now() - timerStart) / 1000));
      setPhase("results");
    }
  }, [currentQ, currentPaper.length, phase, timerStart]);

  if (!isProgrammeUser) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-6" data-testid="simulator-locked">
        <div className="text-5xl">🔒</div>
        <h1 className="text-2xl font-serif font-bold text-primary">Test Day Simulator</h1>
        <p className="text-muted-foreground">
          The Test Day Simulator is exclusive to Young Scholar Programme members. Experience the real exam format with two papers and a timed break.
        </p>
        <Link href="/pricing">
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90" data-testid="button-upgrade-simulator">
            View Programme
          </button>
        </Link>
      </div>
    );
  }

  if (questionsLoading || !simQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" data-testid="simulator-loading">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Preparing your exam papers...</p>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8" data-testid="simulator-intro">
        <h1 className="text-3xl font-serif font-bold text-primary text-center">Test Day Simulator</h1>
        <p className="text-center text-muted-foreground text-lg">
          Experience the Buckinghamshire 11+ format exactly as it will be on test day.
        </p>

        {testDayConfig?.examDate && <CountdownWidget examDate={testDayConfig.examDate} />}

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-bold text-lg">What to expect</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Paper 1</h3>
              <p className="text-sm text-blue-700">25 questions — Verbal Reasoning, Comprehension & Maths</p>
              <p className="text-xs text-blue-600 mt-1">Real questions from the question bank</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Paper 2</h3>
              <p className="text-sm text-purple-700">25 questions — Non-Verbal Reasoning, Comprehension & Maths</p>
              <p className="text-xs text-purple-600 mt-1">Real questions from the question bank</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">10-minute mandatory break between papers</p>
            <p className="text-xs text-amber-700 mt-1">Just like the real exam — use this time to rest and refocus.</p>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Forward-only navigation — you cannot go back to previous questions</li>
            <li>• Bubble answer sheet — select your answer by filling in the bubble</li>
            <li>• Paper 1 and Paper 2 scored separately with full review</li>
            <li>• Questions are unique each time you run the simulator</li>
          </ul>
        </div>

        <button
          onClick={() => setPhase("paper1")}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold text-lg hover:bg-primary/90 transition-colors"
          data-testid="button-start-simulator"
        >
          Begin Test Day Simulation
        </button>
      </div>
    );
  }

  if (phase === "break") {
    const mins = Math.floor(breakTimeLeft / 60);
    const secs = breakTimeLeft % 60;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background" data-testid="simulator-break">
        <div className="text-center space-y-6 max-w-md px-4">
          <h2 className="text-2xl font-serif font-bold text-primary">Break Time</h2>
          <p className="text-muted-foreground">Paper 1 is complete. Take a short rest before Paper 2.</p>
          <div className="text-6xl font-mono font-bold text-primary" data-testid="text-break-timer">
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <p className="text-sm text-muted-foreground">The break is 10 minutes — just like the real exam.</p>
          {breakTimeLeft === 0 && (
            <button
              onClick={() => setPhase("paper2")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90"
              data-testid="button-start-paper2"
            >
              Begin Paper 2
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "results") {
    let p1Correct = 0;
    let p2Correct = 0;
    const p1SectionResults: Record<string, { correct: number; total: number }> = {};
    const p2SectionResults: Record<string, { correct: number; total: number }> = {};

    paper1Questions.forEach((q, i) => {
      const section = q.section;
      if (!p1SectionResults[section]) p1SectionResults[section] = { correct: 0, total: 0 };
      p1SectionResults[section].total++;
      if (answers[i] === q.correctAnswer) {
        p1Correct++;
        p1SectionResults[section].correct++;
      }
    });
    paper2Questions.forEach((q, i) => {
      const section = q.section;
      if (!p2SectionResults[section]) p2SectionResults[section] = { correct: 0, total: 0 };
      p2SectionResults[section].total++;
      if (answers[i + paper1Questions.length] === q.correctAnswer) {
        p2Correct++;
        p2SectionResults[section].correct++;
      }
    });

    const totalCorrect = p1Correct + p2Correct;
    const rawPercent = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const forecastScore = Math.round((rawPercent / 100) * 141);
    const band = forecastScore >= 121 ? "Green (Secure)" : forecastScore >= 110 ? "Amber (Borderline)" : "Red (Developing)";
    const bandColor = forecastScore >= 121 ? "text-green-600" : forecastScore >= 110 ? "text-amber-600" : "text-red-600";
    const bandBg = forecastScore >= 121 ? "bg-green-50 border-green-200" : forecastScore >= 110 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

    const allQuestions = [...paper1Questions, ...paper2Questions];
    const incorrectQuestions = allQuestions.filter((q, i) => answers[i] !== q.correctAnswer);

    const sectionLabel = (s: string) => {
      const map: Record<string, string> = {
        "Verbal Reasoning": "Verbal Reasoning",
        "Non-Verbal Reasoning": "Non-Verbal Reasoning",
        "Mathematics": "Mathematics",
        "English Comprehension": "English Comprehension",
      };
      return map[s] || s;
    };

    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8" data-testid="simulator-results">
        <h1 className="text-3xl font-serif font-bold text-primary text-center">Simulation Complete</h1>
        <p className="text-center text-muted-foreground">Here's how the test day went.</p>

        <div className={`rounded-xl border-2 p-6 text-center space-y-2 ${bandBg}`}>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimated Forecast</p>
          <div className={`text-6xl font-bold ${bandColor}`} data-testid="text-forecast-score">{forecastScore}</div>
          <p className="text-xs text-muted-foreground">out of 141 · Qualifying: 121</p>
          <p className={`text-sm font-bold ${bandColor}`}>{band}</p>
          {forecastScore < 121 && (
            <p className="text-sm text-muted-foreground mt-2">{121 - forecastScore} points from the qualifying standard</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <h3 className="font-bold text-blue-800">Paper 1</h3>
            <div className="text-4xl font-bold text-blue-600" data-testid="text-paper1-score">{p1Correct}/{paper1Questions.length}</div>
            <p className="text-sm text-muted-foreground">Time: {Math.floor(paper1Time / 60)}m {paper1Time % 60}s</p>
            <div className="space-y-2 pt-2 border-t">
              {Object.entries(p1SectionResults).map(([section, data]) => (
                <div key={section} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{sectionLabel(section)}</span>
                  <span className="font-medium">{data.correct}/{data.total} ({Math.round((data.correct/data.total)*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <h3 className="font-bold text-purple-800">Paper 2</h3>
            <div className="text-4xl font-bold text-purple-600" data-testid="text-paper2-score">{p2Correct}/{paper2Questions.length}</div>
            <p className="text-sm text-muted-foreground">Time: {Math.floor(paper2Time / 60)}m {paper2Time % 60}s</p>
            <div className="space-y-2 pt-2 border-t">
              {Object.entries(p2SectionResults).map(([section, data]) => (
                <div key={section} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{sectionLabel(section)}</span>
                  <span className="font-medium">{data.correct}/{data.total} ({Math.round((data.correct/data.total)*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {incorrectQuestions.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              data-testid="button-toggle-review"
            >
              <span className="font-bold text-primary">Review Incorrect Answers ({incorrectQuestions.length})</span>
              <span className="text-muted-foreground text-sm">{showReview ? "Hide" : "Show"}</span>
            </button>
            {showReview && (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {incorrectQuestions.map((q, idx) => {
                  const globalIdx = allQuestions.indexOf(q);
                  const userAnswer = answers[globalIdx] || "Not answered";
                  return (
                    <div key={idx} className="px-6 py-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded shrink-0">{sectionLabel(q.section)}</span>
                        {q.difficulty && <span className="text-xs font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded shrink-0">{q.difficulty}</span>}
                      </div>
                      <p className="text-sm font-medium">{q.prompt}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-red-500">✗</span>
                          <span className="text-red-700">Your answer: {userAnswer}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-green-500">✓</span>
                          <span className="text-green-700">Correct: {q.correctAnswer}</span>
                        </div>
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded">{q.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setPhase("intro"); setAnswers({}); setCurrentQ(0); setShowReview(false); }}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90"
            data-testid="button-retry-simulator"
          >
            Try Again
          </button>
          <Link href="/app">
            <button className="border px-6 py-2.5 rounded-md font-medium hover:bg-muted" data-testid="button-back-dashboard">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPaper.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const question = currentPaper[currentQ];
  const globalIdx = currentQ + paperOffset;
  const selectedAnswer = answers[globalIdx];
  const paperLabel = phase === "paper1" ? "Paper 1" : "Paper 2";
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="simulator-paper">
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="font-bold text-primary">{paperLabel}</div>
          <div className="text-sm text-muted-foreground">
            Question {currentQ + 1} of {currentPaper.length}
          </div>
          <div className="flex gap-1" data-testid="answer-sheet-bubbles">
            {currentPaper.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === currentQ ? "bg-primary" :
                  answers[idx + paperOffset] ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        <div className="rounded-xl bg-white border p-6 space-y-6">
          <p className="text-lg font-medium" data-testid="text-question-prompt">{question.prompt}</p>

          <div className="space-y-3" data-testid="bubble-answer-options">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition-all ${
                  selectedAnswer === opt
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/30"
                }`}
                data-testid={`option-${letters[idx]}`}
              >
                <BubbleOption
                  letter={letters[idx]}
                  selected={selectedAnswer === opt}
                  onClick={() => {}}
                  disabled={false}
                />
                <span className="text-sm">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          data-testid="button-next-question"
        >
          {currentQ === currentPaper.length - 1
            ? phase === "paper1" ? "Finish Paper 1" : "Finish Paper 2"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}

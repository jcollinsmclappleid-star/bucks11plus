import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Diagnostic, Question, TestSession } from "@shared/schema";

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: string, selectedAnswer: string, timeTaken: number }>>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const { data: session, isLoading: sessionLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
  });

  const { data: diagnostic, isLoading: diagLoading } = useQuery<Diagnostic>({
    queryKey: [`/api/diagnostics/${session?.diagnosticId}`],
    enabled: !!session?.diagnosticId,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: [`/api/diagnostics/${session?.diagnosticId}/questions`],
    enabled: !!session?.diagnosticId,
  });

  const submitMutation = useMutation({
    mutationFn: async (finalAnswers: typeof answers) => {
      const res = await apiRequest("POST", `/api/test-sessions/${id}/submit`, { answers: finalAnswers });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
      setLocation(`/app/results/${id}`);
    }
  });

  useEffect(() => {
    if (diagnostic?.duration) {
      setTimeLeft(diagnostic.duration * 60);
    }
  }, [diagnostic]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && prev > 0) {
          // Time's up, submit automatically
          handleFinish();
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers]); // Re-bind handleFinish if needed

  const handleFinish = () => {
    const lastAnswer = getCurrentAnswer();
    const finalAnswers = lastAnswer ? [...answers, lastAnswer] : answers;
    submitMutation.mutate(finalAnswers);
  };

  const getCurrentAnswer = () => {
    if (!questions) return null;
    const q = questions[currentQuestionIndex];
    const existing = answers.find(a => a.questionId === q.id);
    if (existing) return null; // Already answered (if we allow going back)
    
    // In this runner we track one-way for simplicity as per original mockup
    return null; 
  };

  const handleNext = (selectedAnswer: string) => {
    if (!questions) return;
    
    const question = questions[currentQuestionIndex];
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    
    const newAnswers = [...answers, {
      questionId: question.id,
      selectedAnswer,
      timeTaken
    }];
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      submitMutation.mutate(newAnswers);
    }
  };

  if (sessionLoading || diagLoading || questionsLoading || !questions || !diagnostic) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-8">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Runner Header */}
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-primary">11+ Standard</div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm font-medium text-muted-foreground">{diagnostic.title}</div>
        </div>
        
        <div className={`font-mono text-lg font-medium px-3 py-1 rounded ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
          {timeString}
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => setLocation("/app")} data-testid="button-exit">
          Exit
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span data-testid="text-section">{question.section}</span>
            <span data-testid="text-progress">Question {currentQuestionNumber} of {totalQuestions}</span>
          </div>
          <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-border/60 p-6 md:p-10 flex-1 flex flex-col">
          
          <div className="mb-8 prose prose-slate max-w-none">
            <p className="text-lg text-primary font-medium leading-relaxed" data-testid="text-question-prompt">
              {question.prompt}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mt-auto">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleNext(opt)}
                disabled={submitMutation.isPending}
                data-testid={`button-option-${i}`}
                className="w-full text-left px-6 py-4 rounded-lg border-2 transition-all flex items-center gap-4 border-border/50 hover:border-primary/30 text-slate-700 hover:bg-slate-50"
              >
                <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium border-slate-300">
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium text-lg">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center items-center">
          <p className="text-sm text-muted-foreground italic">
            Select an option to move to the next question
          </p>
        </div>
      </main>
    </div>
  );
}

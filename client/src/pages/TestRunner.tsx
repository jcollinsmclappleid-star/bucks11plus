import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function TestRunner() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 12;
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 minutes
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setLocation("/app/results/mini-1"); // Submit and go to results mockup
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Runner Header */}
      <header className="bg-white border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-primary">11+ Standard</div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm font-medium text-muted-foreground">Mini Diagnostic</div>
        </div>
        
        <div className={`font-mono text-lg font-medium px-3 py-1 rounded ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
          {timeString}
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => setLocation("/app")}>
          Exit
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col">
        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>Verbal Reasoning</span>
            <span>Question {currentQuestion} of {totalQuestions}</span>
          </div>
          <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-border/60 p-6 md:p-10 flex-1 flex flex-col">
          
          <div className="mb-8 prose prose-slate max-w-none">
            <p className="text-lg text-primary font-medium leading-relaxed">
              Find the letter that will end the first word and start the second word.
            </p>
            <div className="mt-6 flex justify-center py-8 bg-slate-50 rounded-lg border border-slate-100 text-2xl font-serif tracking-widest text-primary">
              MEA ( _ ) RIM
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mt-auto">
            {['T', 'L', 'S', 'N', 'D'].map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  selectedOption === i 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border/50 hover:border-primary/30 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium ${
                  selectedOption === i ? 'bg-primary text-white border-primary' : 'border-slate-300'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium text-lg">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            disabled={currentQuestion === 1}
            onClick={() => {setCurrentQuestion(prev => prev - 1); setSelectedOption(null);}}
          >
            Previous
          </Button>
          <Button 
            className="bg-primary text-primary-foreground px-8" 
            onClick={handleNext}
          >
            {currentQuestion === totalQuestions ? 'Submit Assessment' : 'Next Question'}
          </Button>
        </div>
      </main>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      setLocation("/app"); // Proceed to dashboard after completion
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-center text-sm text-muted-foreground mt-4 uppercase tracking-wider font-medium">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-primary font-serif">What year group is your child in?</h2>
                <div className="space-y-3">
                  {["Year 4", "Year 5", "Year 6"].map(opt => (
                    <Button key={opt} variant="outline" className="w-full h-14 text-lg" onClick={handleNext}>
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-primary font-serif">Weekly practice hours?</h2>
                <div className="space-y-3">
                  {["0 - 1 hours", "1 - 3 hours", "3+ hours"].map(opt => (
                    <Button key={opt} variant="outline" className="w-full h-14 text-lg" onClick={handleNext}>
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-primary font-serif">Which area feels hardest right now?</h2>
                <div className="space-y-3">
                  {["Verbal Reasoning", "Non-Verbal Reasoning", "Maths", "Unsure"].map(opt => (
                    <Button key={opt} variant="outline" className="w-full h-14 text-lg" onClick={handleNext}>
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary font-serif">Profile Complete</h2>
                <p className="text-muted-foreground">We're tailoring the forecast engine to your child's profile.</p>
                <Button className="w-full h-14 text-lg bg-primary text-primary-foreground mt-4" onClick={handleNext}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
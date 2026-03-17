import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const redirectParam = searchParams.get("redirect");
  const tierParam = searchParams.get("tier");
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    childName: "",
    childYear: "",
    practiceHours: "",
    difficultyAreas: [] as string[],
  });

  const isEarlyYear = formData.childYear === "Year 4" || formData.childYear === "Year 5";

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      if (!formData.childName) {
        toast({
          variant: "destructive",
          title: "Required",
          description: "Please enter your child's name",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await apiRequest("PUT", "/api/user/onboarding", formData);
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        const sessionIdParam = searchParams.get("session_id");
        if (redirectParam === "checkout" && tierParam && sessionIdParam) {
          setLocation(`/app/checkout-success?tier=${tierParam}&session_id=${sessionIdParam}`);
        } else if (redirectParam === "checkout" && tierParam) {
          setLocation(`/pricing?autoCheckout=${tierParam}`);
        } else if (isEarlyYear && user?.subscriptionTier === "early_learner") {
          setLocation("/app/early-dashboard");
        } else {
          setLocation("/app");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save onboarding data",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
                    <Button
                      key={opt}
                      variant={formData.childYear === opt ? "default" : "outline"}
                      className="w-full h-14 text-lg"
                      onClick={() => {
                        updateData("childYear", opt);
                        setStep(2);
                      }}
                      data-testid={`button-year-${opt.replace(" ", "-").toLowerCase()}`}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                {(formData.childYear === "Year 4" || formData.childYear === "Year 5") && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800" data-testid="text-early-learner-hint">
                    Our <strong>Early Learner</strong> plan (£49, 6 months) is designed specifically for Year 4 &amp; 5 — building foundations at a comfortable pace, with no exam pressure.
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-primary font-serif">Weekly practice hours?</h2>
                <div className="space-y-3">
                  {["0 - 1 hours", "1 - 3 hours", "3+ hours"].map(opt => (
                    <Button
                      key={opt}
                      variant={formData.practiceHours === opt ? "default" : "outline"}
                      className="w-full h-14 text-lg"
                      onClick={() => {
                        updateData("practiceHours", opt);
                        setStep(3);
                      }}
                      data-testid={`button-practice-${opt.replace(/ /g, "-").toLowerCase()}`}
                    >
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
                  {["Verbal Reasoning", "Non-Verbal Reasoning", "Maths", "English Comprehension", "Unsure"].map(opt => (
                    <Button
                      key={opt}
                      variant={formData.difficultyAreas.includes(opt) ? "default" : "outline"}
                      className="w-full h-14 text-lg"
                      onClick={() => {
                        updateData("difficultyAreas", [opt]);
                        setStep(4);
                      }}
                      data-testid={`button-area-${opt.replace(/ /g, "-").toLowerCase()}`}
                    >
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
                <h2 className="text-2xl font-bold text-primary font-serif">Almost there!</h2>
                <p className="text-muted-foreground">Please enter your child's name to personalize their dashboard.</p>
                <div className="space-y-2 text-left">
                  <Label htmlFor="childName">Child's Name</Label>
                  <Input
                    id="childName"
                    placeholder="Enter name"
                    value={formData.childName}
                    onChange={(e) => updateData("childName", e.target.value)}
                    className="h-12"
                    data-testid="input-child-name"
                  />
                </div>
                <Button
                  className="w-full h-14 text-lg bg-primary text-primary-foreground mt-4"
                  onClick={handleNext}
                  disabled={isSubmitting || !formData.childName}
                  data-testid="button-complete-onboarding"
                >
                  {isSubmitting ? "Saving..." : "Go to Dashboard"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

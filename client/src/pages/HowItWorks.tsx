import { CheckCircle2, Search, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. The Free Mini Diagnostic",
      description: "A fast, 12-minute assessment aligned to GL-style reasoning families used in Bucks, covering Verbal Reasoning, Non-Verbal Reasoning, and Maths.",
      icon: Search,
      benefits: ["No commitment required", "Instant baseline score", "Identifies initial gap to 121"]
    },
    {
      title: "2. The Readiness Forecast",
      description: "Our proprietary engine maps your child's accuracy and pacing against historic benchmarks to determine their trajectory toward the 121 qualifying standard.",
      icon: Target,
      benefits: ["Pace analysis by section", "Trajectory banding (Red/Amber/Green)", "Highlighting top 3 focus areas"]
    },
    {
      title: "3. Targeted Practice",
      description: "Stop wasting time on areas they've already mastered. 11+ Standard prescribes specific practice drills and mock exams based on their exact weaknesses.",
      icon: TrendingUp,
      benefits: ["Skill-specific drills", "Full-length 45-min mock exams", "Weekly progression tracking"]
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Seo 
        title="How It Works | 11+ Standard" 
        description="Learn how 11+ Standard's assessment-first approach helps prepare your child for the Buckinghamshire 11+." 
      />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">How 11+ Standard Works</h1>
        <p className="text-xl text-muted-foreground">
          A structured, assessment-first approach to Buckinghamshire 11+ preparation.
        </p>
      </div>

      <div className="space-y-16 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-8 items-start bg-slate-50 p-8 rounded-2xl border border-border/50">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-border shrink-0">
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary font-serif mb-3">{step.title}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {step.description}
              </p>
              <ul className="space-y-2">
                {step.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-brand-green" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-6">Ready to see where they stand?</h2>
        <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground" asChild>
          <Link href="/app">Start Free Diagnostic</Link>
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}
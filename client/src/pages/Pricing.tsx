import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Pricing() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-20">
      <Seo 
        title="Pricing | 11+ Standard" 
        description="Invest in targeted 11+ readiness. View our monthly subscription and 12-week intensive pack options." 
      />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">Invest in Targeted Readiness</h1>
        <p className="text-xl text-muted-foreground">
          Stop guessing. Get the exact roadmap your child needs to reach the 121 Bucks standard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Card A: Monthly */}
        <Card className="border-border/60 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Monthly Access</CardTitle>
            <CardDescription className="text-base">Ongoing readiness tracking</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-8">
              <span className="text-5xl font-bold text-primary">£39</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Includes</h4>
              <ul className="space-y-3">
                {[
                  "Full timed diagnostics (multiple papers)",
                  "Full skill heat map (all 18 skills)",
                  "Likelihood band (High/Moderate/Low)",
                  "Impact Simulator"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
                
                {/* Visual diff for missing premium features */}
                {[
                  "Structured 12-Week Preparation Plan",
                  "Weekly Readiness Summary Email",
                  "Report Archive & PDF Downloads"
                ].map((feature, i) => (
                  <li key={`missing-${i}`} className="flex items-start gap-3 opacity-50">
                    <X className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 h-12 text-lg" asChild>
              <Link href="/sign-up">Subscribe Monthly</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Card B: 12-Week Pack */}
        <Card className="border-brand-amber border-2 shadow-xl relative flex flex-col overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-amber"></div>
          <div className="absolute top-0 right-0 bg-brand-amber text-amber-950 px-4 py-1.5 rounded-bl-lg font-bold text-sm shadow-sm">
            MOST POPULAR
          </div>
          
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl font-serif">12-Week Exam Pack</CardTitle>
            <CardDescription className="text-base text-brand-primary/80">Complete preparation window</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-2">
              <span className="text-5xl font-bold text-primary">£99</span>
              <span className="text-muted-foreground font-medium"> one-time</span>
            </div>
            <p className="text-sm text-brand-primary/70 mb-8 font-medium bg-blue-50 px-3 py-1.5 rounded inline-block">Designed to cover a typical focused preparation cycle.</p>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Everything in monthly, plus:</h4>
              <ul className="space-y-3">
                {[
                  "Structured 12-Week Preparation Plan",
                  "Weekly Readiness Summary Email",
                  "Report Archive & PDF Downloads",
                  "Full timed diagnostics (multiple papers)",
                  "Full skill heat map (all 18 skills)",
                  "Impact Simulator & Likelihood bands",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span className="text-primary font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold shadow-md" asChild>
              <Link href="/sign-up">Get 12-Week Pack</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* V8 Trust Block */}
      <div className="mt-12 text-center text-sm font-medium text-slate-500 space-y-1">
        <p>Independent readiness assessment</p>
        <p>Not affiliated with GL Assessment or Buckinghamshire Council</p>
        <p>Forecasts are indicative — <Link href="/how-forecast-works" className="underline hover:text-primary">methodology available</Link></p>
      </div>

      {/* Comparison Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-inner">
          <h2 className="text-2xl font-bold text-primary font-serif mb-8 text-center">Why diagnostics outperform generic practice</h2>
          <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Measures pace + completion, not just accuracy",
              "Identifies highest impact weaknesses",
              "Forecast contextualised to 121 benchmark",
              "Creates a structured plan to improve efficiently"
            ].map((bullet, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                </div>
                <span className="text-slate-700 font-medium">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
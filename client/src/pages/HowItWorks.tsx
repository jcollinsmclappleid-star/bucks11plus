import { Search, Target, Wrench, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

const steps = [
  {
    num: 1,
    title: "Diagnostic Benchmark",
    icon: Search,
    intro: "Preparation begins with a timed GL-style diagnostic across:",
    areas: [
      "Verbal Reasoning",
      "Non-Verbal Reasoning",
      "Mathematical Reasoning",
      "Section pacing",
    ],
    outputLabel: "You receive:",
    outputs: [
      "Skill-by-skill accuracy analysis",
      "Pacing risk indicators",
      "Initial readiness band relative to the 121 qualifying standard",
    ],
    insight: "Without a structured benchmark, preparation often reinforces strengths and neglects weaknesses.",
  },
  {
    num: 2,
    title: "Readiness Forecast",
    icon: Target,
    intro: "Performance is analysed through weighted modelling aligned to qualifying benchmarks.",
    areas: null,
    outputLabel: "We evaluate:",
    outputs: [
      "Accuracy adjusted for difficulty",
      "Time-per-question against section expectations",
      "Concentration of errors within sub-skills",
      "Stability across repeated attempts",
    ],
    secondOutputLabel: "Output:",
    secondOutputs: [
      "Clear readiness band (Green / Amber / Red)",
      "Top three priority intervention areas",
      "Identified risk factors affecting qualification",
    ],
    insight: "This prevents misplaced effort and reduces uncertainty.",
  },
  {
    num: 3,
    title: "Targeted Development",
    icon: Wrench,
    intro: "Practice is prescribed according to diagnosed gaps.",
    areas: null,
    outputLabel: null,
    outputs: [
      "Skill-specific drills mapped to sub-rules",
      "Visual Non-Verbal reasoning sequences",
      "Timed section simulations",
      "Progressive difficulty calibration",
    ],
    insight: "Time is directed to areas that materially influence outcome.",
  },
  {
    num: 4,
    title: "Measured Progression",
    icon: TrendingUp,
    intro: "Improvement is reassessed at structured milestones.",
    areas: null,
    outputLabel: "Each re-assessment evaluates:",
    outputs: [
      "Accuracy progression",
      "Pacing discipline",
      "Volatility across sittings",
      "Movement between readiness bands",
    ],
    insight: "Progress becomes visible and evidence-based.",
  },
] as const;

export default function HowItWorks() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <Seo
        title="How Bucks 11 Plus Preparation Works | Diagnostic-Led Approach | 11+ Standard"
        description="Structured, assessment-led preparation for the Buckinghamshire 11+ Secondary Transfer Test. Diagnostic benchmark, readiness forecast against the 121 qualifying score, and targeted GL-style practice."
        canonicalPath="/how-it-works"
      />

      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="container mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600">How It Works</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-5">
            How 11+ Standard Works
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-2">
            A structured, assessment-led system for Buckinghamshire 11+ preparation.
          </p>
          <p className="text-slate-500 leading-relaxed">
            In a competitive cohort, effort alone is not enough. Preparation must be measured, directed and timed.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="relative">
          <div className="absolute left-[1.4rem] top-8 bottom-8 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.num} className="relative flex gap-5 sm:gap-7" data-testid={`step-${step.num}`}>
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">Step {step.num}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary font-serif mb-3">{step.title}</h2>

                  <p className="text-slate-600 leading-relaxed mb-4">{step.intro}</p>

                  {step.areas && (
                    <ul className="space-y-2 mb-5">
                      {step.areas.map((area) => (
                        <li key={area} className="flex items-center gap-2.5 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.outputLabel && (
                    <p className="text-sm font-semibold text-slate-700 mb-2">{step.outputLabel}</p>
                  )}
                  <ul className="space-y-2 mb-4">
                    {step.outputs.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {"secondOutputLabel" in step && step.secondOutputLabel && (
                    <>
                      <p className="text-sm font-semibold text-slate-700 mb-2 mt-4">{step.secondOutputLabel}</p>
                      <ul className="space-y-2 mb-4">
                        {(step as any).secondOutputs?.map((item: string) => (
                          <li key={item} className="flex items-center gap-2.5 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <p className="text-sm text-slate-400 italic border-t border-slate-100 pt-3 mt-3">
                    {step.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-xl bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] border border-primary/10 p-7 sm:p-10">
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">Why This Matters</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Many families complete large volumes of questions without knowing whether readiness is improving.
          </p>
          <p className="text-slate-700 font-medium leading-relaxed">
            11+ Standard is designed to answer one question clearly:
          </p>
          <p className="text-primary font-serif text-xl sm:text-2xl font-bold mt-4 mb-6">
            Are we on track for 121 under timed conditions?
          </p>
          <Link href="/how-forecast-works" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors" data-testid="link-methodology">
            Read how our forecast works
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-14 text-center">
          <p className="text-lg text-slate-600 mb-6">Ready to establish a structured starting point?</p>
          <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow" asChild data-testid="button-start-diagnostic">
            <Link href="/sign-up">Start Free Diagnostic</Link>
          </Button>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center" data-testid="text-disclaimer">
            Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Search, Target, Wrench, TrendingUp, ChevronDown, BookOpen, Clock, BarChart3, Layers, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

const steps = [
  {
    num: 1,
    title: "Readiness Benchmark",
    icon: Search,
    intro: "Preparation begins with a timed GL-style readiness check across:",
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

const forecastSectionIcons: Record<string, React.ElementType> = {
  "The 121 Benchmark": Target,
  "Accuracy Modelling": BarChart3,
  "Pace Adjustment Framework": Clock,
  "Sub-Skill Stability": Layers,
  "Consistency and Trend Analysis": TrendingUp,
  "Composite Readiness Index": Shield,
  "Readiness Bands": BookOpen,
  "Methodological Limitations": AlertTriangle,
};

function ForecastSection({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const Icon = forecastSectionIcons[title] || BookOpen;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${open ? "border-primary/20 shadow-sm bg-white" : "border-slate-200 bg-white hover:border-slate-300"}`}
      data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left transition-colors"
        aria-expanded={open}
        data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold shrink-0 transition-colors ${open ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
          {index}
        </span>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Icon className={`h-4 w-4 shrink-0 transition-colors ${open ? "text-primary" : "text-slate-400"}`} />
          <h3 className={`text-base sm:text-lg font-semibold font-serif transition-colors ${open ? "text-primary" : "text-slate-700"}`}>{title}</h3>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 sm:ml-[3.25rem]">
            <div className="prose prose-slate prose-sm max-w-none [&>p]:text-slate-600 [&>p]:leading-relaxed [&>ul]:text-slate-600 [&>ul]:space-y-1.5 [&>ul>li]:leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const howItWorksFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the Bucks 11 Plus Tests readiness check work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The readiness check is a timed GL-style assessment covering Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. It benchmarks your child's accuracy, pacing and readiness against the 121 qualifying standard for Buckinghamshire grammar schools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the 121 qualifying score?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In Buckinghamshire, a standardised score of 121 is required to qualify for a grammar school place via the Secondary Transfer Test. The exact raw score required varies each year based on cohort-wide performance and age standardisation."
      }
    },
    {
      "@type": "Question",
      "name": "How is the readiness forecast calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The readiness forecast combines accuracy modelling, pace adjustment, sub-skill stability analysis and consistency tracking into a composite index. It evaluates performance under timed conditions across all four reasoning domains and maps it against historical qualifying benchmarks."
      }
    },
    {
      "@type": "Question",
      "name": "What are the readiness bands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There are three readiness bands: Secure (Green) — performance consistently meets projected qualifying thresholds; Borderline (Amber) — close to qualifying thresholds but with identifiable risk factors; Development Required (Red) — a measurable gap exists relative to qualifying thresholds."
      }
    },
    {
      "@type": "Question",
      "name": "How often should my child take a readiness check?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend a readiness check every 4–6 weeks of targeted practice to track progression across readiness bands. The forecast model improves in accuracy as more readiness data is collected over time."
      }
    },
    {
      "@type": "Question",
      "name": "Is this preparation suitable for all Buckinghamshire grammar schools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All 13 Buckinghamshire grammar schools use the same GL Assessment Secondary Transfer Test. Our readiness check and practice content is aligned to the GL-style reasoning formats used across all schools in the county."
      }
    }
  ]
};

export default function HowItWorks() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <Seo
        title="How Bucks 11 Plus Preparation Works (2026) – Readiness-Led Approach | Bucks 11 Plus Tests"
        description="Assessment-first preparation for the Bucks 11 Plus. Free GL-style readiness check, 121 readiness forecast, and targeted practice to close the gap before the Secondary Transfer Test."
        canonicalPath="/how-it-works"
        schema={howItWorksFaqSchema}
      />

      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="container mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600">How It Works</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-5">
            How Bucks 11 Plus Tests Works
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
            Bucks 11 Plus Tests is designed to answer one question clearly:
          </p>
          <p className="text-primary font-serif text-xl sm:text-2xl font-bold mt-4 mb-2">
            Are we on track for 121 under timed conditions?
          </p>
        </div>

        <div className="mt-14">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-serif tracking-tight mb-3">
              How Our Forecast Works
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-2">
              Transparency underpins our readiness modelling framework. Below we explain how performance data is interpreted and how readiness bands are derived.
            </p>
            <p className="text-slate-500 leading-relaxed">
              The model does not replicate official standardisation. Instead, it evaluates observable performance indicators under timed conditions and maps them against structured qualifying benchmarks.
            </p>
          </div>

          <div className="space-y-3">
            <ForecastSection title="The 121 Benchmark" index={1}>
              <p>
                In Buckinghamshire, a standardised score of 121 is required to qualify for a grammar school place.
              </p>
              <p>
                The precise raw score required to achieve 121 varies each year and depends on cohort-wide performance and age standardisation.
              </p>
              <p>
                As these comparative datasets are not publicly available, this platform does not attempt to calculate projected standardised scores.
              </p>
              <p>
                Instead, readiness is evaluated by analysing performance patterns that are historically associated with qualifying outcomes.
              </p>
            </ForecastSection>

            <ForecastSection title="Accuracy Modelling" index={2}>
              <p>Accuracy is assessed across 18 structured skill areas.</p>
              <p>Performance is not treated as a simple percentage. Instead, weighting is applied based on:</p>
              <ul>
                <li>Difficulty level of questions attempted</li>
                <li>Cognitive load classification</li>
                <li>Concentration of errors within specific sub-rules</li>
                <li>Repeated weaknesses across attempts</li>
              </ul>
              <p>Higher-difficulty items contribute proportionally more to readiness modelling.</p>
              <p>Concentrated weaknesses reduce readiness projection more significantly than dispersed errors.</p>
            </ForecastSection>

            <ForecastSection title="Pace Adjustment Framework" index={3}>
              <p>
                The Buckinghamshire 11+ is time-constrained. Accuracy alone is insufficient if pacing is not aligned with section expectations.
              </p>
              <p>Benchmark pacing assumptions:</p>
              <ul>
                <li>Verbal Reasoning: approximately 35 seconds per question</li>
                <li>Non-Verbal Reasoning: approximately 35 seconds per question</li>
                <li>Mathematical Reasoning: approximately 45 seconds per question</li>
              </ul>
              <p>Mean time per question is compared against these benchmarks.</p>
              <p>A pace ratio is calculated and used as a moderating coefficient.</p>
              <p>Minor deviations result in mild moderation. Significant deviations reduce readiness projection more materially.</p>
              <p>Pacing stability across sections is also analysed. Deterioration in later sections may indicate fatigue under time pressure and reduces forecast confidence.</p>
            </ForecastSection>

            <ForecastSection title="Sub-Skill Stability" index={4}>
              <p>Qualifying performance typically requires balanced competency across reasoning domains.</p>
              <p>Significant asymmetry between verbal, non-verbal and mathematical reasoning reduces stability weighting.</p>
              <p>Repeated weaknesses within a single sub-rule cluster are treated as higher risk than isolated errors across multiple domains.</p>
            </ForecastSection>

            <ForecastSection title="Consistency and Trend Analysis" index={5}>
              <p>Single readiness results are not treated as definitive.</p>
              <p>The model evaluates:</p>
              <ul>
                <li>Performance variance across attempts</li>
                <li>Trend direction (improving, stable, declining)</li>
                <li>Pacing consistency</li>
                <li>Section balance over time</li>
              </ul>
              <p>Stable improvement increases projection confidence.</p>
              <p>High volatility reduces certainty within readiness band allocation.</p>
            </ForecastSection>

            <ForecastSection title="Composite Readiness Index" index={6}>
              <p>Readiness is derived from a weighted composite index incorporating:</p>
              <ul>
                <li>Accuracy Index</li>
                <li>Pace Coefficient</li>
                <li>Sub-Skill Stability Index</li>
                <li>Consistency Multiplier</li>
              </ul>
              <p>The composite index determines placement within readiness bands.</p>
              <p>This index is designed to reflect practical examination performance rather than theoretical maximum potential.</p>
            </ForecastSection>

            <ForecastSection title="Readiness Bands" index={7}>
              <div className="not-prose space-y-3 my-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                  <span className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 text-sm">Secure (Green)</h4>
                    <p className="text-green-800 text-sm mt-1 leading-relaxed">
                      Performance consistently meets projected qualifying thresholds across accuracy, pacing and sub-skill balance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">Borderline (Amber)</h4>
                    <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                      Performance is close to qualifying thresholds but shows identifiable risk factors such as pacing instability or concentrated weaknesses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                  <span className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm">Development Required (Red)</h4>
                    <p className="text-red-800 text-sm mt-1 leading-relaxed">
                      Performance indicates a measurable gap relative to projected qualifying thresholds and may require foundational strengthening.
                    </p>
                  </div>
                </div>
              </div>
              <p>Readiness status is dynamic and recalculated after each readiness check.</p>
            </ForecastSection>

            <ForecastSection title="Methodological Limitations" index={8}>
              <p>This platform does not have access to official cohort-wide performance data and therefore cannot replicate age-standardisation calculations.</p>
              <p>Readiness modelling is based on structured performance indicators rather than predictive score replication.</p>
              <p>Benchmarks are derived from historical performance patterns and timed simulation modelling.</p>
              <p>Forecast accuracy improves as more readiness data is collected.</p>
              <p>Individual examination performance may vary due to factors such as anxiety, fatigue, test-day conditions and cohort variability.</p>
              <p>This model is intended to support preparation planning and structured review, not to guarantee outcomes.</p>
            </ForecastSection>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-lg text-slate-600 mb-6">Ready to establish a structured starting point?</p>
          <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow" asChild data-testid="button-start-diagnostic">
            <Link href="/sign-up">Start Free Readiness Check</Link>
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

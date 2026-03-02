import { useState } from "react";
import { ChevronDown, BookOpen, Target, Clock, BarChart3, TrendingUp, Layers, Shield, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Seo } from "../components/shared/Seo";

const sectionIcons: Record<string, React.ElementType> = {
  "The 121 Benchmark": Target,
  "Accuracy Modelling": BarChart3,
  "Pace Adjustment Framework": Clock,
  "Sub-Skill Stability": Layers,
  "Consistency and Trend Analysis": TrendingUp,
  "Composite Readiness Index": Shield,
  "Readiness Bands": BookOpen,
  "Methodological Limitations": AlertTriangle,
};

function Section({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const Icon = sectionIcons[title] || BookOpen;

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
          <h2 className={`text-base sm:text-lg font-semibold font-serif transition-colors ${open ? "text-primary" : "text-slate-700"}`}>{title}</h2>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 ml-[3.25rem]">
            <div className="prose prose-slate prose-sm max-w-none [&>p]:text-slate-600 [&>p]:leading-relaxed [&>ul]:text-slate-600 [&>ul]:space-y-1.5 [&>ul>li]:leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Methodology() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <Seo
        title="How Our Forecast Works | 11+ Standard"
        description="Transparency underpins our readiness modelling framework. Learn how performance data is interpreted and how readiness bands are derived."
      />

      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="container mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600">How Our Forecast Works</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-5">
            How Our Forecast Works
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-3">
            Transparency underpins our readiness modelling framework. This page explains how performance data is interpreted and how readiness bands are derived.
          </p>
          <p className="text-slate-500 leading-relaxed">
            The model does not replicate official standardisation. Instead, it evaluates observable performance indicators under timed conditions and maps them against structured qualifying benchmarks.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="space-y-3">
          <Section title="The 121 Benchmark" index={1}>
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
          </Section>

          <Section title="Accuracy Modelling" index={2}>
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
          </Section>

          <Section title="Pace Adjustment Framework" index={3}>
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
          </Section>

          <Section title="Sub-Skill Stability" index={4}>
            <p>Qualifying performance typically requires balanced competency across reasoning domains.</p>
            <p>Significant asymmetry between verbal, non-verbal and mathematical reasoning reduces stability weighting.</p>
            <p>Repeated weaknesses within a single sub-rule cluster are treated as higher risk than isolated errors across multiple domains.</p>
          </Section>

          <Section title="Consistency and Trend Analysis" index={5}>
            <p>Single diagnostic results are not treated as definitive.</p>
            <p>The model evaluates:</p>
            <ul>
              <li>Performance variance across attempts</li>
              <li>Trend direction (improving, stable, declining)</li>
              <li>Pacing consistency</li>
              <li>Section balance over time</li>
            </ul>
            <p>Stable improvement increases projection confidence.</p>
            <p>High volatility reduces certainty within readiness band allocation.</p>
          </Section>

          <Section title="Composite Readiness Index" index={6}>
            <p>Readiness is derived from a weighted composite index incorporating:</p>
            <ul>
              <li>Accuracy Index</li>
              <li>Pace Coefficient</li>
              <li>Sub-Skill Stability Index</li>
              <li>Consistency Multiplier</li>
            </ul>
            <p>The composite index determines placement within readiness bands.</p>
            <p>This index is designed to reflect practical examination performance rather than theoretical maximum potential.</p>
          </Section>

          <Section title="Readiness Bands" index={7}>
            <div className="not-prose space-y-3 my-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                <span className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 text-sm">Secure (Green)</h3>
                  <p className="text-green-800 text-sm mt-1 leading-relaxed">
                    Performance consistently meets projected qualifying thresholds across accuracy, pacing and sub-skill balance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                <span className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm">Borderline (Amber)</h3>
                  <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                    Performance is close to qualifying thresholds but shows identifiable risk factors such as pacing instability or concentrated weaknesses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                <span className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 text-sm">Development Required (Red)</h3>
                  <p className="text-red-800 text-sm mt-1 leading-relaxed">
                    Performance indicates a measurable gap relative to projected qualifying thresholds and may require foundational strengthening.
                  </p>
                </div>
              </div>
            </div>
            <p>Readiness status is dynamic and recalculated after each diagnostic.</p>
          </Section>

          <Section title="Methodological Limitations" index={8}>
            <p>This platform does not have access to official cohort-wide performance data and therefore cannot replicate age-standardisation calculations.</p>
            <p>Readiness modelling is based on structured performance indicators rather than predictive score replication.</p>
            <p>Benchmarks are derived from historical performance patterns and timed simulation modelling.</p>
            <p>Forecast accuracy improves as more diagnostic data is collected.</p>
            <p>Individual examination performance may vary due to factors such as anxiety, fatigue, test-day conditions and cohort variability.</p>
            <p>This model is intended to support preparation planning and structured review, not to guarantee outcomes.</p>
          </Section>
        </div>

        <div className="mt-14 text-center">
          <p className="text-slate-500 mb-4">See how this methodology is applied in practice.</p>
          <Button variant="outline" asChild data-testid="link-how-it-works">
            <Link href="/how-it-works">How 11+ Standard Works</Link>
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

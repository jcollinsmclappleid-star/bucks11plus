import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Seo } from "../components/shared/Seo";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
        data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <h2 className="text-lg font-bold text-primary font-serif">{title}</h2>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-white">
          <div className="prose prose-slate prose-sm max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Methodology() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo
        title="Forecast Methodology | 11+ Standard"
        description="Transparency underpins our readiness modelling framework. Learn how performance data is interpreted and how readiness bands are derived."
      />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-6">
        Forecast Methodology
      </h1>

      <div className="space-y-4 mb-10 text-slate-600 leading-relaxed">
        <p>
          Transparency underpins our readiness modelling framework. This page explains how performance data is interpreted and how readiness bands are derived.
        </p>
        <p>
          The model does not replicate official standardisation. Instead, it evaluates observable performance indicators under timed conditions and maps them against structured qualifying benchmarks.
        </p>
      </div>

      <div className="space-y-3">
        <Section title="The 121 Benchmark">
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

        <Section title="Accuracy Modelling">
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

        <Section title="Pace Adjustment Framework">
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

        <Section title="Sub-Skill Stability">
          <p>Qualifying performance typically requires balanced competency across reasoning domains.</p>
          <p>Significant asymmetry between verbal, non-verbal and mathematical reasoning reduces stability weighting.</p>
          <p>Repeated weaknesses within a single sub-rule cluster are treated as higher risk than isolated errors across multiple domains.</p>
        </Section>

        <Section title="Consistency and Trend Analysis">
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

        <Section title="Composite Readiness Index">
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

        <Section title="Readiness Bands">
          <div className="not-prose space-y-4 my-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <h3 className="font-bold text-green-900 text-sm">Secure (Green)</h3>
              <p className="text-green-800 text-sm mt-1">
                Performance consistently meets projected qualifying thresholds across accuracy, pacing and sub-skill balance.
              </p>
            </div>
            <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
              <h3 className="font-bold text-amber-900 text-sm">Borderline (Amber)</h3>
              <p className="text-amber-800 text-sm mt-1">
                Performance is close to qualifying thresholds but shows identifiable risk factors such as pacing instability or concentrated weaknesses.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <h3 className="font-bold text-red-900 text-sm">Development Required (Red)</h3>
              <p className="text-red-800 text-sm mt-1">
                Performance indicates a measurable gap relative to projected qualifying thresholds and may require foundational strengthening.
              </p>
            </div>
          </div>
          <p>Readiness status is dynamic and recalculated after each diagnostic.</p>
        </Section>

        <Section title="Methodological Limitations">
          <p>This platform does not have access to official cohort-wide performance data and therefore cannot replicate age-standardisation calculations.</p>
          <p>Readiness modelling is based on structured performance indicators rather than predictive score replication.</p>
          <p>Benchmarks are derived from historical performance patterns and timed simulation modelling.</p>
          <p>Forecast accuracy improves as more diagnostic data is collected.</p>
          <p>Individual examination performance may vary due to factors such as anxiety, fatigue, test-day conditions and cohort variability.</p>
          <p>This model is intended to support preparation planning and structured review, not to guarantee outcomes.</p>
        </Section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

export default function HowItWorks() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo
        title="How It Works | 11+ Standard"
        description="A structured, assessment-led system for Buckinghamshire 11+ preparation. Diagnostic benchmark, readiness forecast, targeted development and measured progression."
      />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-4">
        How 11+ Standard Works
      </h1>

      <p className="text-lg text-slate-600 mb-3 leading-relaxed">
        A structured, assessment-led system for Buckinghamshire 11+ preparation.
      </p>

      <p className="text-slate-500 mb-12 leading-relaxed">
        In a competitive cohort, effort alone is not enough.
        Preparation must be measured, directed and timed.
      </p>

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">1. Diagnostic Benchmark</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Preparation begins with a timed GL-style diagnostic across:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Verbal Reasoning</li>
            <li>Non-Verbal Reasoning</li>
            <li>Mathematical Reasoning</li>
            <li>Section pacing</li>
          </ul>
          <p className="text-slate-600 mb-3 leading-relaxed">You receive:</p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Skill-by-skill accuracy analysis</li>
            <li>Pacing risk indicators</li>
            <li>Initial readiness band relative to the 121 qualifying standard</li>
          </ul>
          <p className="text-slate-500 text-sm italic">
            Without a structured benchmark, preparation often reinforces strengths and neglects weaknesses.
          </p>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">2. Readiness Forecast</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Performance is analysed through weighted modelling aligned to qualifying benchmarks.
          </p>
          <p className="text-slate-600 mb-3 leading-relaxed">We evaluate:</p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Accuracy adjusted for difficulty</li>
            <li>Time-per-question against section expectations</li>
            <li>Concentration of errors within sub-skills</li>
            <li>Stability across repeated attempts</li>
          </ul>
          <p className="text-slate-600 mb-3 leading-relaxed">Output:</p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Clear readiness band (Green / Amber / Red)</li>
            <li>Top three priority intervention areas</li>
            <li>Identified risk factors affecting qualification</li>
          </ul>
          <p className="text-slate-500 text-sm italic">
            This prevents misplaced effort and reduces uncertainty.
          </p>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">3. Targeted Development</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Practice is prescribed according to diagnosed gaps.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Skill-specific drills mapped to sub-rules</li>
            <li>Visual Non-Verbal reasoning sequences</li>
            <li>Timed section simulations</li>
            <li>Progressive difficulty calibration</li>
          </ul>
          <p className="text-slate-500 text-sm italic">
            Time is directed to areas that materially influence outcome.
          </p>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">4. Measured Progression</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Improvement is reassessed at structured milestones.
          </p>
          <p className="text-slate-600 mb-3 leading-relaxed">Each re-assessment evaluates:</p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-1">
            <li>Accuracy progression</li>
            <li>Pacing discipline</li>
            <li>Volatility across sittings</li>
            <li>Movement between readiness bands</li>
          </ul>
          <p className="text-slate-500 text-sm italic">
            Progress becomes visible and evidence-based.
          </p>
        </div>

        <hr className="border-slate-200" />

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-primary font-serif mb-4">Why This Matters</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Many families complete large volumes of questions without knowing whether readiness is improving.
          </p>
          <p className="text-slate-700 font-medium leading-relaxed">
            11+ Standard is designed to answer one question clearly:
          </p>
          <p className="text-primary font-serif text-xl font-bold mt-3">
            Are we on track for 121 under timed conditions?
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-lg text-slate-600 mb-6">Ready to establish a structured starting point?</p>
        <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground" asChild data-testid="button-start-diagnostic">
          <Link href="/app">Start Free Diagnostic</Link>
        </Button>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

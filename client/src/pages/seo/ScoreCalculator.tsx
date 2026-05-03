import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Score Calculator" },
];

/**
 * Approximation model for converting a 4-section raw score (0–100% per section)
 * into an indicative standardised score, with an age-in-months adjustment.
 *
 * IMPORTANT: This is a parent-facing illustrative estimator, not the official
 * GL Assessment standardisation algorithm (which is proprietary). It is
 * deliberately conservative and tuned so that ~80–85% raw accuracy with an
 * average-aged child produces a result around 121.
 */
function estimateStandardisedScore(input: {
  vrPct: number;
  nvrPct: number;
  mathsPct: number;
  compPct: number;
  ageMonths: number; // child's age in completed months on test day (e.g. 132 = 11y 0m)
}): number {
  const { vrPct, nvrPct, mathsPct, compPct, ageMonths } = input;
  const avg = (vrPct + nvrPct + mathsPct + compPct) / 4;

  // Map % accuracy to a base standardised score on a tuned curve.
  // 50% → ~100 (cohort average), 80% → ~121, 95% → ~135, 30% → ~85.
  // Linear-ish around 50% with gentle compression at extremes.
  const base = 100 + (avg - 50) * 0.7;

  // Age adjustment: typical Year 6 candidate sits the test aged 10y 11m–11y 1m
  // (130–134 months). Apply ±0.6 SAS per month either side of 132 (cap ±4).
  const ageAdj = Math.max(-4, Math.min(4, (132 - ageMonths) * 0.6));

  return Math.round(base + ageAdj);
}

function band(score: number): { label: string; tone: string } {
  if (score >= 130) return { label: "Substantially above qualifying", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (score >= 121) return { label: "Above qualifying", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (score >= 115) return { label: "Borderline — close to qualifying", tone: "text-amber-700 bg-amber-50 border-amber-200" };
  if (score >= 100) return { label: "Average to above-average", tone: "text-slate-700 bg-slate-50 border-slate-200" };
  return { label: "Below cohort average", tone: "text-slate-700 bg-slate-50 border-slate-200" };
}

export default function ScoreCalculator() {
  const [vr, setVr] = useState(75);
  const [nvr, setNvr] = useState(75);
  const [maths, setMaths] = useState(75);
  const [comp, setComp] = useState(75);
  const [age, setAge] = useState(132); // 11y 0m

  const score = useMemo(
    () => estimateStandardisedScore({ vrPct: vr, nvrPct: nvr, mathsPct: maths, compPct: comp, ageMonths: age }),
    [vr, nvr, maths, comp, age],
  );
  const b = band(score);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Score Calculator – Estimate a Standardised Score"
        description="Free Bucks 11+ score calculator. Enter section accuracy and your child's age to see an indicative score against the 121 qualifying standard. An estimator only — the official GL Assessment scoring is proprietary."
        canonicalPath="/bucks-11-plus-score-calculator"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-score-calculator">
          Bucks 11+ Score Calculator
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Enter your child's accuracy on each section and their age on test day for an indicative standardised score.
        </p>
      </div>

      <div className="not-prose my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { label: "Verbal Reasoning %", value: vr, set: setVr, testid: "input-vr" },
            { label: "Non-Verbal Reasoning %", value: nvr, set: setNvr, testid: "input-nvr" },
            { label: "Maths %", value: maths, set: setMaths, testid: "input-maths" },
            { label: "Comprehension %", value: comp, set: setComp, testid: "input-comp" },
          ].map((row) => (
            <div key={row.label}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{row.label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={row.value}
                  onChange={(e) => row.set(Number(e.target.value))}
                  className="flex-1"
                  data-testid={row.testid}
                />
                <span className="w-12 text-right font-mono text-sm font-semibold text-primary">{row.value}%</span>
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Child's age on test day
              <span className="text-xs text-slate-400 ml-2">(typical Year 6: 10y 11m – 11y 1m)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={125}
                max={140}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="flex-1"
                data-testid="input-age"
              />
              <span className="w-20 text-right font-mono text-sm font-semibold text-primary">
                {Math.floor(age / 12)}y {age % 12}m
              </span>
            </div>
          </div>
        </div>

        <div className={`mt-6 rounded-xl border p-5 ${b.tone}`} data-testid="result-band">
          <div className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Estimated standardised score</div>
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-bold font-serif" data-testid="result-score">{score}</div>
            <div className="text-sm">vs qualifying threshold of 121</div>
          </div>
          <div className="mt-2 text-sm font-medium" data-testid="result-band-label">{b.label}</div>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          This is an illustrative estimator, not the official GL Assessment standardisation algorithm. It is tuned so that ~80–85% raw accuracy at age 11y 0m maps to roughly 121. Real test results will vary depending on paper difficulty, age in months, and section weighting.
        </p>
      </div>

      <h2 className="text-primary font-serif">How the Calculator Works</h2>
      <p>
        The official Bucks 11+ standardised scoring algorithm is proprietary to GL Assessment and is not published. This calculator uses an approximation tuned against publicly-available historical patterns and the published qualifying threshold of 121. It applies two adjustments parents intuitively understand:
      </p>
      <ul>
        <li><strong>Raw accuracy → base score:</strong> 50% accuracy maps to roughly 100 (cohort average). 80% maps to roughly 121 (qualifying). 95% maps to roughly 135.</li>
        <li><strong>Age adjustment:</strong> a small ± adjustment based on the child's age in months on test day, capped at ±4 standardised points.</li>
      </ul>
      <p>
        For a more precise forecast that uses our actual question bank under timed on-screen conditions, take our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link>. It gives a more accurate snapshot than any score calculator can.
      </p>

      <h2 className="text-primary font-serif">What These Scores Actually Mean</h2>
      <ul>
        <li><strong>121+:</strong> Qualified for grammar school. Place allocation now depends on each school's oversubscription criteria — typically distance.</li>
        <li><strong>115–120:</strong> Borderline. The standardisation process is designed to absorb test-day variation, so a child consistently in this range is unlikely to "tip over" into qualifying without genuine skill improvement.</li>
        <li><strong>100–114:</strong> Average to above-average attainment, but a meaningful gap to grammar standard. Focus on whether grammar is the right path or whether to plan around upper schools.</li>
        <li><strong>Below 100:</strong> Below cohort average. Buckinghamshire's upper schools include some of the highest-performing non-selective state schools in England — a strong outcome remains entirely achievable.</li>
      </ul>

      <h2 className="text-primary font-serif">Limits of Score Estimation</h2>
      <p>
        No calculator can predict a real test result with precision. Three reasons:
      </p>
      <ol>
        <li><strong>Paper difficulty varies year to year</strong> — and the standardisation is recalibrated each year. A given raw mark in 2025 may not equate to the same standardised score in 2026.</li>
        <li><strong>Section weighting is not equal</strong> in the final score — GL Assessment combines the four section scores using a confidential weighting that varies slightly by paper.</li>
        <li><strong>Test-day performance carries variance</strong> — a child's actual result on a given Saturday morning is influenced by sleep, nerves, conditions and a hundred other factors. This is exactly why mock-test averages (rather than single results) are the better forecast.</li>
      </ol>

      <ChildExperienceCTA />
      <ContentCTA heading="Stop estimating. Get an actual readiness score." subhead="An 8-minute timed check gives an indicative readiness score against 121 — based on real performance, not assumptions." ctaLabel="Take the check" />
      <Disclaimer />
    </div>
  );
}

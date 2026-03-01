import { Seo } from "../components/shared/Seo";

export default function Methodology() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo 
        title="Forecast Methodology | 11+ Standard" 
        description="Discover exactly how we calculate your child's readiness trajectory for the Bucks 11+ using our proprietary forecast engine." 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">Forecast Methodology</h1>
      <p className="text-xl text-muted-foreground lead">
        Transparency is core to our approach. Here is exactly how we calculate your child's readiness trajectory for the Bucks 11+.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">The 121 Benchmark</h2>
      <p>
        In Buckinghamshire, the GL Assessment is standardized. While the exact raw score needed fluctuates year to year based on the cohort's performance, achieving a standardized score of <strong>121</strong> is required to qualify for a grammar school place. 
      </p>
      <p>
        Our forecast engine does not try to guess the standardized score (as that requires knowing the performance of thousands of other children). Instead, we map <strong>raw accuracy and completion pace</strong> against historical requirements for reaching 121.
      </p>

      <h2 className="text-primary font-serif">Pace Penalties</h2>
      <p>
        The Bucks 11+ is heavily time-pressured. It is not enough to be accurate; children must be fast.
      </p>
      <ul>
        <li><strong>Verbal Reasoning:</strong> Expected pace ~ 35 seconds per question.</li>
        <li><strong>Non-Verbal Reasoning:</strong> Expected pace ~ 35 seconds per question.</li>
        <li><strong>Maths:</strong> Expected pace ~ 45 seconds per question.</li>
      </ul>
      <p>
        If your child's average time exceeds these expected benchmarks during our diagnostics, the forecast engine applies a pace penalty to their projected score, shifting their readiness band down.
      </p>

      <h2 className="text-primary font-serif">Readiness Bands</h2>
      <p>We categorize readiness into three transparent bands to help manage expectations:</p>
      <div className="not-prose space-y-4 my-6">
        <div className="p-4 border-l-4 border-brand-green bg-green-50 rounded-r-lg">
          <h3 className="font-bold text-green-900">Secure Green (On Track)</h3>
          <p className="text-green-800 text-sm mt-1">Consistently hitting accuracy thresholds within the strict time limits.</p>
        </div>
        <div className="p-4 border-l-4 border-brand-amber bg-amber-50 rounded-r-lg">
          <h3 className="font-bold text-amber-900">Confident Amber (Borderline)</h3>
          <p className="text-amber-800 text-sm mt-1">Within striking distance of 121. Usually requires targeted intervention in 1 or 2 specific skill areas.</p>
        </div>
        <div className="p-4 border-l-4 border-brand-red bg-red-50 rounded-r-lg">
          <h3 className="font-bold text-red-900">Focus Red (Gap to Close)</h3>
          <p className="text-red-800 text-sm mt-1">Significant gap to the 121 standard. Requires foundational work rather than just mock exam repetition.</p>
        </div>
      </div>
    </div>
  );
}
import { Seo } from "../components/shared/Seo";

export default function GLAlignment() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo 
        title="Bucks GL Alignment | 11+ Standard" 
        description="Learn how our assessment structure accurately mirrors the Buckinghamshire GL 11+ test." 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">GL-Aligned Assessment Structure</h1>
      <p className="text-xl text-muted-foreground lead">
        Our diagnostics are built specifically to reflect the reality of the Buckinghamshire Secondary Transfer Test.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">Mapping to GL Reasoning Families</h2>
      <p>
        The Buckinghamshire test is provided by GL Assessment. It covers three main domains: Verbal Reasoning, Non-Verbal Reasoning (including Spatial), and Mathematics. We map our question bank directly to the historical skill families tested by GL in Bucks.
      </p>
      <ul>
        <li><strong>Verbal Reasoning:</strong> Focuses heavily on vocabulary breadth, word structure, and specific code-breaking logic unique to GL.</li>
        <li><strong>Non-Verbal Reasoning:</strong> Covers pattern sequences, matrices, and spatial transformations (rotation/reflection).</li>
        <li><strong>Mathematics:</strong> Emphasizes arithmetic fluency under pressure and multi-step word problems linked to the Key Stage 2 curriculum.</li>
      </ul>

      <h2 className="text-primary font-serif">Timed Conditions Modelling</h2>
      <p>
        A question answered correctly in 2 minutes is effectively a failed question in the 11+. Our engine tracks time-per-question down to the second and penalizes the forecast if a child exceeds the expected pacing thresholds (e.g., 35 seconds for VR).
      </p>

      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl my-10">
        <h3 className="text-primary font-serif mt-0 mb-2 text-xl">Independent Readiness Tool</h3>
        <p className="text-sm text-slate-600 mb-0 leading-relaxed">
          11+ Standard is an independent readiness assessment platform. We are not affiliated with, endorsed by, or connected to GL Assessment, Buckinghamshire Council, or The Buckinghamshire Grammar Schools (TBGS). Our forecasts are indicative based on our proprietary modelling of historical test conditions.
        </p>
      </div>
    </div>
  );
}
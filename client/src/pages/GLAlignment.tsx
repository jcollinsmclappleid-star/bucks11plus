import { Seo } from "../components/shared/Seo";

export default function GLAlignment() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo 
        title="Bucks 11 Plus GL Assessment Style Alignment | 11+ Standard" 
        description="How our independently developed assessments align to GL-style reasoning families used in the Buckinghamshire Secondary Transfer Test — verbal reasoning, non-verbal reasoning, mathematical reasoning, and English comprehension." 
        canonicalPath="/bucks-gl-alignment"
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">Aligned to GL-Style Reasoning Families</h1>
      <p className="text-xl text-muted-foreground lead">
        Our independently developed diagnostics are aligned to the GL-style reasoning families used in the Buckinghamshire Secondary Transfer Test.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">Aligned to GL-Style Reasoning Families</h2>
      <p>
        The Buckinghamshire test uses a GL-style format covering four main domains: Verbal Reasoning, Non-Verbal Reasoning (including Spatial), Mathematics, and English Comprehension. We independently align our question bank to the historical GL-style reasoning families used in Bucks.
      </p>
      <ul>
        <li><strong>Verbal Reasoning:</strong> Focuses heavily on vocabulary breadth, word structure, and specific code-breaking logic typical of GL-style assessments.</li>
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

      <div className="not-prose mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}
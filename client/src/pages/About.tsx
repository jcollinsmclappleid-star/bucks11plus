import { Seo } from "../components/shared/Seo";
import { Link } from "wouter";
import { Building2, Mail, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="About | Bucks 11 Plus Diagnostic & Preparation Platform | 11+ Standard"
        description="11+ Standard is an independent Bucks 11 Plus platform helping parents understand their child's readiness, identify weak areas, and prepare more effectively for the 121 standard."
        canonicalPath="/about"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">
        About 11+ Standard
      </h1>
      <p className="text-xl text-muted-foreground lead">
        We built 11+ Standard to give every child preparing for the Buckinghamshire 11+ the clearest possible picture of where they stand — and exactly what needs to happen next to give them the best chance at 121.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">The Problem</h2>
      <p>
        Most families preparing for the Buckinghamshire Secondary Transfer Test are working hard. They buy practice books, sign up for mock exams, maybe hire a tutor. The preparation is real. The commitment is real.
      </p>
      <p>
        But the one question that matters most — <strong>"Is my child actually on track?"</strong> — almost never gets a straight answer. Generic mock papers return a raw score with no benchmark. Tutors offer reassurance but rarely structured forecasting. And the first time many families find out the preparation wasn't targeted enough is in October of Year 6, when the result arrives.
      </p>
      <p>
        By then, there is nothing left to do. 11+ Standard exists to make sure that moment never comes as a surprise.
      </p>

      <h2 className="text-primary font-serif">Our Approach</h2>
      <p>
        11+ Standard is an assessment-first platform. Practice without direction is wasted time — so we start with a diagnostic that measures not just accuracy, but pacing: whether your child is working at the speed the real test demands, and where within each subject the gaps are concentrated.
      </p>
      <p>
        From that baseline, every drill session, every full-length timed paper, and every progress review is oriented around a single number: 121. That is the standardised score benchmark for the Buckinghamshire 11+, and it is the only figure that actually determines whether a child qualifies. We do not use games, streaks, or bright celebratory animations. We provide a calm, structured environment that reflects the seriousness of the assessment and treats parents as partners who deserve clear information.
      </p>

      <h2 className="text-primary font-serif">How Our Questions Are Built</h2>
      <p>
        Every question in our bank follows the GL Assessment format used in the Buckinghamshire Secondary Transfer Test, spanning Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Questions are weighted across difficulty levels to reflect the real distribution children face in the test itself — not just a library of easy practice problems.
      </p>
      <p>
        Our question bank and diagnostic methodology were developed with input from an experienced UK primary school leader with specialist expertise in Year 6 and the transition into selective grammar education. This is an educator who understands, from the classroom, what children at this level are genuinely assessed on, where preparation commonly falls short, and what reaching 121 actually demands in practice — not as theory, but from direct experience of the children who make that transition and the ones who fall just short of it.
      </p>

      <h2 className="text-primary font-serif">What This Platform Is — and Isn't</h2>
      <ul>
        <li>It is a structured preparation platform, not a tutoring agency. We do not provide one-to-one sessions or personalised coaching calls.</li>
        <li>It works well alongside a tutor. Many families use 11+ Standard to fill the hours between tutoring sessions with directed, evidence-backed practice.</li>
        <li>It is fully independent. We have no affiliation with GL Assessment, Buckinghamshire Council, or any of the 13 Buckinghamshire grammar schools.</li>
        <li>It does not guarantee a grammar school place. No preparation platform can. What it does is give your child the best-structured, most targeted preparation available — and give you the clearest possible picture of whether it is working.</li>
      </ul>

      <p className="text-sm text-slate-500 not-italic">
        Preparing for 11+ outside Buckinghamshire? <a href="https://11plustesthub.co.uk" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">11plusTestHub.co.uk</a> covers 11+ preparation for grammar schools across England.
      </p>

      <h2 className="text-primary font-serif">Why 121?</h2>
      <p>
        The raw score from the Buckinghamshire Secondary Transfer Test — the number of questions answered correctly — is not used directly for selection. It is converted into a standardised score that accounts for the child's age at the time of the test, adjusting for the slight advantage older children have over younger ones in the same cohort. The resulting standardised score runs from roughly 69 to 141, with 121 being the threshold at which a child is considered to have demonstrated the academic ability required for grammar school entry.
      </p>
      <p>
        Every diagnostic result, readiness forecast, and progress view in 11+ Standard is framed against this number. Not because it is the only thing that matters — a child's confidence, resilience under time pressure, and ability to manage pacing all matter too — but because it is the number on which the decision is made, and every parent deserves to know clearly how close their child is to it.
      </p>

      <h2 className="text-primary font-serif">Independence and Data</h2>
      <p>
        11+ Standard collects practice performance data — question-level responses, timing, diagnostic scores, and progress across sessions — for the sole purpose of generating the readiness forecasts, analytics, and guided practice that parents and children use on the platform. This data is never sold, never shared with third parties, and is not passed to schools, local authorities, or GL Assessment under any circumstances.
      </p>
      <p>
        We are not affiliated with GL Assessment, Buckinghamshire Council, or any grammar school. The "GL-style" label refers to the question format we use, which replicates the structure of the real test — it does not imply any formal relationship with GL Assessment Ltd.
      </p>

      <hr className="my-8" />

      <div className="not-prose">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="bg-primary px-7 py-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary-foreground/80 shrink-0" />
            <h2 className="text-lg font-bold font-serif text-primary-foreground m-0">Platform Operator</h2>
          </div>
          <div className="px-7 py-6 space-y-5">
            <p className="text-slate-700 leading-relaxed">
              11+ Standard is operated by <strong className="text-primary">Ianson Systems Limited</strong>, a UK-based company that develops educational tools and diagnostic assessment platforms to support 11+ preparation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-0.5">Registered in England &amp; Wales</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Ianson Systems Limited is a UK-registered private limited company.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-0.5">Contact &amp; Support</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    For enquiries, please use our{" "}
                    <Link href="/contact" className="text-primary hover:underline font-medium">contact form</Link>.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-200 pt-4">
              11+ Standard is an independent platform. Ianson Systems Limited has no affiliation with GL Assessment, Buckinghamshire Council, The Buckinghamshire Grammar Schools (TBGS), or any individual grammar school.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

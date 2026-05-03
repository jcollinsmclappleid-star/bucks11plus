import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Free Practice Papers" },
];

export default function PracticePapersFree() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Practice Papers Free – Where to Get Genuinely Free Material"
        description="A practical guide to genuinely free Bucks 11+ practice papers and questions, what each is good for, and how to use them without wasting your child's time."
        canonicalPath="/bucks-11-plus-practice-papers-free"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-free-papers">
          Free Bucks 11+ Practice Papers
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          What's genuinely free, what each is good for, and how to use them sensibly.
        </p>
      </div>

      <h2 className="text-primary font-serif">The Honest Picture</h2>
      <p>
        Most published 11+ material is paid. That's because writing a single high-quality practice question typically takes a subject specialist 30–60 minutes, and a full 50-question paper represents weeks of work. There <em>is</em> genuinely free material out there, but it's smaller in volume and usually serves as a sample rather than a full preparation programme.
      </p>
      <p>
        Below is everything we've found that is (a) genuinely free, (b) actually useful for the Bucks GL-style 11+, and (c) safe and legal to use.
      </p>

      <h2 className="text-primary font-serif">1. The Official Familiarisation Test</h2>
      <p>
        Buckinghamshire Council publishes a free Familiarisation Test each year for all registered families. It's the only material produced by the same body that runs the real test. It's short and not score-comparable, but it's essential for understanding the on-screen format.
      </p>
      <p>
        See our <Link href="/bucks-11-plus-familiarisation-test" className="text-primary hover:underline">Familiarisation Test guide</Link> for what it contains and how to use it.
      </p>

      <h2 className="text-primary font-serif">2. Our Free 8-Minute Diagnostic</h2>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> gives your child a 12-question timed test across all four sections, scored on the same standardised model used in our full platform. It's not a full practice paper, but it produces a more accurate forecast than any single paper would.
      </p>
      <ul>
        <li>No payment, no card details, no ongoing commitment.</li>
        <li>You receive an emailed report with section breakdowns and a recommended next step.</li>
        <li>Takes 8 minutes — a realistic snapshot rather than an exhausting full paper.</li>
      </ul>

      <h2 className="text-primary font-serif">3. Our Free Practice Bank</h2>
      <p>
        Beyond the diagnostic, we make a rotating set of free practice questions available to all signed-up users — 50 questions spanning all four domains, refreshed periodically. Sign up takes less than a minute and there's no payment requirement to access them.
      </p>

      <h2 className="text-primary font-serif">4. CGP &amp; Bond Free Samples</h2>
      <p>
        Both major print publishers offer free sample chapters from their 11+ workbooks online. They're useful for getting a feel for the question style before committing to a paid book. Search for "CGP 11+ free sample" or "Bond 11+ free sample" — make sure you select GL-style material rather than CEM (Bucks uses GL).
      </p>

      <h2 className="text-primary font-serif">5. School Websites &amp; PTA Resources</h2>
      <p>
        A few Buckinghamshire primary schools publish free 11+ practice resources through their parent associations. These vary widely in quality and currency — they're worth a look if your school has them, but treat them as supplementary rather than core preparation.
      </p>

      <h2 className="text-primary font-serif">What to Avoid</h2>
      <ul>
        <li><strong>"Free download" sites with no clear publisher</strong> — often outdated or copyright-infringing material that won't reflect the current test format.</li>
        <li><strong>Generic "11+ papers" that don't specify GL</strong> — CEM-style papers (used in some other regions) test different skills and use a different format. Bucks uses GL Assessment.</li>
        <li><strong>Untimed PDF papers</strong> — completing a paper without a clock teaches the wrong habit. Pacing is half the test.</li>
      </ul>

      <h2 className="text-primary font-serif">A Realistic Free-Material Programme</h2>
      <p>For families on a tight budget, the following sequence using only free resources is genuinely useful:</p>
      <ol>
        <li><strong>Spring of Year 5:</strong> Take our free diagnostic to establish a baseline.</li>
        <li><strong>Year 5 throughout:</strong> Build vocabulary through wide reading; daily mental arithmetic; CGP/Bond free samples to introduce question types.</li>
        <li><strong>Summer holiday before Year 6:</strong> Sit the official Familiarisation Test under timed conditions; use our free practice bank to drill specific weak areas.</li>
        <li><strong>August / early September:</strong> Re-take the diagnostic to refresh the indicative readiness score and adjust focus in the final two weeks.</li>
      </ol>
      <p>
        Families that progress beyond this typically invest in either one or two paid practice papers from established publishers (£10–£20 per book) or a structured online platform. Our paid plans start at £19 — see <Link href="/pricing" className="text-primary hover:underline">pricing</Link> for what's included.
      </p>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:practice-papers-free" />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

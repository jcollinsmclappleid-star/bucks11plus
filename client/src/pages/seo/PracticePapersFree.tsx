import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { FreeToPlatformPanel, FreeToPlatformStrip } from "@/components/shared/FreeToPlatformPanel";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Free Practice Papers" },
];

export default function PracticePapersFree() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Free Bucks 11+ Practice Papers — Where to Get GL-Style Material (2026)"
        description="Genuinely free Bucks 11+ practice papers and PDF downloads: what's available, what each is good for, and how to use them. Includes two free printable GL-style papers — no email required."
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


      <SeoPageProductLead />
      <FreeToPlatformStrip freeOffer="Free printable PDFs on our sample papers page" />

      <div className="not-prose my-6 rounded-xl border border-primary/15 bg-primary/[0.03] p-5">
        <p className="text-sm font-bold text-primary mb-2">Want something to print?</p>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Two printable GL-style practice papers (12 questions each, worked answers) live on our{" "}
          <Link href="/bucks-11-plus-free-sample-papers" className="text-primary font-semibold hover:underline">
            free sample papers page
          </Link>
          . For timed mocks, drills, and parent analytics, use the{" "}
          <Link href="/11-plus-practice-suite" className="text-primary font-semibold hover:underline">
            full practice suite
          </Link>{" "}
          or{" "}
          <Link href="/free-diagnostic" className="text-primary font-semibold hover:underline">
            free practice test
          </Link>.
        </p>
      </div>

      <h2 className="text-primary font-serif">The Honest Picture</h2>
      <p>
        Most published 11+ material is paid. That's because writing a single high-quality practice question typically takes a subject specialist 30–60 minutes, and a full 50-question paper represents weeks of work. There <em>is</em> genuinely free material out there, but it's smaller in volume and usually serves as a sample rather than a full preparation programme.
      </p>
      <p>
        Below is everything we've found that is (a) genuinely free, (b) actually useful for the Bucks GL-style 11+, and (c) safe and legal to use.
      </p>

      <SeoContentAd variant="dashboard" />

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

      <h2 className="text-primary font-serif">3. Bucks Plus Edge — Full Question Bank</h2>
      <p>
        Free material gets you started; structured preparation needs volume, timing, and feedback. <Link href="/pricing" className="text-primary hover:underline">Bucks Plus Edge</Link> gives your child <strong>2,500+ interactive GL-style questions</strong> across all four domains — full 40- and 50-question timed mocks, Hard-level drills, instant explanations, and a parent dashboard that tracks gaps by question type. From <strong>£35/month</strong> or <strong>£279/year</strong>.
      </p>

      <h2 className="text-primary font-serif">4. Printable sample papers (optional)</h2>
      <p>
        If you want something on paper, we publish two free GL-style sample PDFs on our{" "}
        <Link href="/bucks-11-plus-free-sample-papers" className="text-primary hover:underline">free sample papers page</Link>.
        They are useful for a first look at question style — but serious preparation needs timed on-screen practice, mocks, and feedback from{" "}
        <Link href="/11-plus-practice-suite" className="text-primary hover:underline">Bucks Plus Edge</Link>.
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
        <li><strong>Year 5 throughout:</strong> Build vocabulary through wide reading; daily mental arithmetic; use our free diagnostic and targeted drills to introduce question types.</li>
        <li><strong>Summer holiday before Year 6:</strong> Sit the official Familiarisation Test under timed conditions; use Bucks Plus Edge drills to target weak areas identified in the diagnostic.</li>
        <li><strong>August / early September:</strong> Re-take the diagnostic to refresh the indicative readiness score and adjust focus in the final two weeks.</li>
      </ol>
      <p>
        Families that progress beyond free resources typically move to{" "}
        <Link href="/11-plus-practice-suite" className="text-primary hover:underline">Bucks Plus Edge</Link> —{" "}
        <strong>£35/month or £279/year</strong> for the full 2,500+ question bank, timed mocks, drills, and parent analytics.
        See <Link href="/pricing" className="text-primary hover:underline">pricing</Link> for details.
      </p>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <FreeToPlatformPanel freeOffer="free PDFs and a 12-question readiness check" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">More Free 11+ Resources</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/free-11-plus-resources" className="text-primary hover:underline">Complete free 11+ resources library</Link></li>
          <li><Link href="/11-plus-mock-test-online-free" className="text-primary hover:underline">Free online 11+ mock test</Link></li>
          <li><Link href="/gl-assessment-question-types" className="text-primary hover:underline">Every GL Assessment question type</Link></li>
          <li><Link href="/11-plus-synonyms-list" className="text-primary hover:underline">11+ synonyms list</Link></li>
          <li><Link href="/11-plus-tricky-words" className="text-primary hover:underline">11+ tricky vocabulary list</Link></li>
        </ul>
      </div>      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

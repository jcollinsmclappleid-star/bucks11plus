import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Secondary Transfer Test" },
];

export default function SecondaryTransfer() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Secondary Transfer Test (2026) – Purpose, Format & Structure"
        description="Understand the Bucks 11 Plus Secondary Transfer Test: its official purpose, four-paper structure, and how standardised scores determine grammar school eligibility."
        canonicalPath="/buckinghamshire-secondary-transfer-test"
        schema={[
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-secondary-transfer">
          Buckinghamshire Secondary Transfer Test
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The official selection test used to determine eligibility for all 13 Buckinghamshire grammar schools — commonly known as the Bucks 11+.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Official Purpose</h2>
      <p>
        The Secondary Transfer Test is administered by Buckinghamshire Council to identify children who would benefit from
        a grammar school education. It is the sole selection mechanism for entry to all
        13 <Link href="/bucks-grammar-schools" className="text-primary hover:underline">Buckinghamshire grammar schools</Link>.
      </p>
      <p>
        The test is designed to assess academic potential and reasoning ability rather than learned knowledge alone.
        It aims to be as fair as possible across children from different backgrounds and primary schools, using
        standardised scoring to account for age differences within the cohort.
      </p>

      <h2 className="text-primary font-serif">Test Structure</h2>
      <p>
        The Secondary Transfer Test consists of <strong>four separate papers</strong>, each assessing a different
        domain of reasoning and academic ability:
      </p>

      <h3 className="text-primary/80 font-serif">1. Verbal Reasoning (VR)</h3>
      <p>
        Verbal Reasoning assesses a child's ability to understand and reason using words and language. Question types
        typically include:
      </p>
      <ul>
        <li>Synonyms, antonyms, and word meaning</li>
        <li>Letter and word sequences</li>
        <li>Code-breaking and word codes</li>
        <li>Verbal logic and comprehension</li>
        <li>Word structure and relationships</li>
      </ul>
      <p>
        VR is often considered the most vocabulary-intensive paper and rewards wide reading and strong language skills.
      </p>

      <h3 className="text-primary/80 font-serif">2. Non-Verbal Reasoning (NVR)</h3>
      <p>
        Non-Verbal Reasoning tests pattern recognition and spatial awareness without relying on language. Common question
        formats include:
      </p>
      <ul>
        <li>Pattern sequences and series completion</li>
        <li>Shape classification and odd-one-out</li>
        <li>Rotation and reflection of shapes</li>
        <li>Spatial transformations and folding</li>
        <li>Matrices and analogies using shapes</li>
      </ul>
      <p>
        NVR is designed to measure reasoning ability independently of vocabulary or learned mathematical skills.
      </p>

      <h3 className="text-primary/80 font-serif">3. Mathematics</h3>
      <p>
        The Mathematics paper assesses numerical fluency and problem-solving aligned to the Key Stage 2 curriculum.
        Topics typically covered include:
      </p>
      <ul>
        <li>Arithmetic — addition, subtraction, multiplication, division</li>
        <li>Fractions, decimals, and percentages</li>
        <li>Ratio and proportion</li>
        <li>Number patterns and sequences</li>
        <li>Multi-step word problems</li>
        <li>Data interpretation from charts and tables</li>
      </ul>
      <p>
        Speed is critical in the Maths paper — children need to work efficiently through calculations without a calculator.
      </p>

      <h2 className="text-primary font-serif">Timing & Conditions</h2>
      <p>
        Each paper is strictly timed, and children must work under formal examination conditions. The time pressure is
        a significant factor — a correct answer given too slowly is effectively a wasted question if it prevents a
        child from reaching later questions.
      </p>
      <p>
        The test is typically sat in a single morning at a designated grammar school venue in early September of Year 6.
        See the full <Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">admissions timeline</Link> for
        key dates.
      </p>

      <h2 className="text-primary font-serif">Scoring</h2>
      <p>
        Raw scores from the four papers are combined and <strong>standardised</strong> to produce a single overall score.
        The standardisation process adjusts for the child's age and the difficulty of the paper, ensuring fair comparison
        across the cohort.
      </p>
      <p>
        Children who achieve a standardised score of <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">121 or above</Link> are
        deemed to have qualified for grammar school. This threshold has been consistent for many years, though it is
        technically set annually by the Buckinghamshire Moderation Committee.
      </p>

      <h2 className="text-primary font-serif">Preparing for the Test</h2>
      <p>
        Effective preparation combines understanding the question formats with building speed and accuracy under timed
        conditions. Generic practice alone is not enough — children need targeted work on their weakest areas and
        experience with the specific reasoning styles used in the Bucks 11+.
      </p>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free readiness check</Link> measures
        your child's readiness across all four domains — Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension —
        in just 8 minutes. It provides a forecast score against the 121 benchmark and identifies the specific
        areas where improvement is needed.
      </p>
      <p>
        For a full guide to the Buckinghamshire 11+ including preparation strategies and frequently asked questions,
        see our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">Complete Buckinghamshire 11+ Guide</Link>.
      </p>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:secondary-transfer" />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

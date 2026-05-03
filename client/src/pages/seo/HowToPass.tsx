import { Seo } from "../../components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "../../components/shared/Breadcrumbs";
import { ContentCTA } from "../../components/shared/ContentCTA";
import { LeadMagnetBlock } from "../../components/shared/LeadMagnetBlock";
import { SubscribeCTA } from "../../components/shared/SubscribeCTA";
import { Disclaimer } from "../../components/shared/Disclaimer";
import { ChildExperienceCTA } from "../../components/shared/ChildExperienceCTA";
import { Link } from "wouter";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "How to Pass the Bucks 11+" },
];

export default function HowToPass() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="How to Pass the Bucks 11 Plus (2026) – Strategy, 121 Score & Prep Tips"
        description="What it takes to pass the Bucks 11 Plus: understanding the 121 qualifying score, avoiding common mistakes, balancing speed with accuracy, and when to start preparing."
        canonicalPath="/how-to-pass-bucks-11-plus"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How to Pass the Buckinghamshire 11 Plus",
            "description": "A structured guide to passing the Bucks 11+ covering the 121 benchmark, preparation strategy, timing, and common mistakes to avoid.",
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-how-to-pass">
          How to Pass the Buckinghamshire 11 Plus
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A structured approach to understanding the Bucks 11+ qualifying standard and preparing effectively.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Understanding the 121 Qualifying Score</h2>
      <p>
        The Buckinghamshire 11+ uses a <strong>standardised scoring system</strong> where 100 is the average for all children sitting the test. To qualify for a grammar school place, your child typically needs to achieve a standardised score of <strong>121 or above</strong>. This places them roughly in the top 25% of all candidates.
      </p>
      <p>
        The 121 threshold is not an absolute pass mark — it is a <strong>standardised benchmark</strong> that accounts for age differences between candidates. A child born in September is compared fairly against a child born in August through the standardisation process.
      </p>
      <p>
        It is important to understand that 121 is a <em>minimum qualifying score</em>. Achieving 121 qualifies your child for grammar school consideration, but individual schools may have higher effective thresholds depending on demand. Learn more about how standardisation works in our <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">qualifying score guide</Link>.
      </p>

      <h2 className="text-primary font-serif">Common Preparation Mistakes</h2>
      <p>
        Many families begin their 11+ preparation with good intentions but fall into common traps that undermine their efforts:
      </p>
      <ul>
        <li>
          <strong>Starting too late.</strong> Beginning serious preparation in the summer before the September test leaves insufficient time to build the deep vocabulary and reasoning fluency required. Ideally, structured preparation should begin in Year 4 or early Year 5.
        </li>
        <li>
          <strong>Relying solely on paper practice.</strong> Working through endless practice papers without understanding where weaknesses lie is inefficient. Without readiness data, you cannot tell whether a child is struggling with <em>vocabulary breadth</em>, <em>spatial reasoning</em>, or <em>arithmetic speed</em> — each requiring a different intervention.
        </li>
        <li>
          <strong>Ignoring timing pressure.</strong> The 11+ is a timed assessment. A child who answers correctly but takes 90 seconds per question will perform very differently from one who completes the same question in 35 seconds. Preparation must include timed conditions from an early stage.
        </li>
        <li>
          <strong>Not understanding standardisation.</strong> Raw scores alone are misleading. A child scoring 85% on a practice paper may or may not reach 121 depending on the difficulty of the paper and the performance of other candidates. Understanding standardised scores is essential for realistic forecasting.
        </li>
      </ul>
      <p>
        For a more detailed breakdown of these pitfalls, see our <Link href="/bucks-11-plus-mistakes" className="text-primary hover:underline">common mistakes guide</Link>.
      </p>

      <h2 className="text-primary font-serif">Speed vs Accuracy: The Dual Challenge</h2>
      <p>
        The Buckinghamshire 11+ tests four domains — Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension — each under strict time limits. Success requires both <strong>accuracy</strong> (getting answers right) and <strong>speed</strong> (getting answers right quickly enough).
      </p>
      <p>
        Consider the following: a child who answers 90% of questions correctly but only completes 70% of the paper will score significantly lower than a child who answers 80% correctly but completes every question. The time constraint is not incidental — it is a core part of the assessment design.
      </p>
      <p>
        Effective preparation must therefore include:
      </p>
      <ul>
        <li><strong>Timed drills</strong> that build fluency under pressure, not just knowledge.</li>
        <li><strong>Per-question pacing targets</strong> — approximately 35 seconds for Verbal Reasoning, 45 seconds for Non-Verbal Reasoning, and 50 seconds for Mathematics.</li>
        <li><strong>Regular readiness check</strong> that measures both accuracy and pacing together, providing a realistic forecast rather than an inflated confidence score.</li>
      </ul>

      <h2 className="text-primary font-serif">When to Start Preparing</h2>
      <p>
        There is no single "correct" time to begin, but evidence from previous cohorts suggests:
      </p>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-preparation-timeline">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Start Period</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Approach</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Year 4 (Autumn)</td>
              <td className="p-3">Gentle exposure to reasoning types, vocabulary building, reading enrichment</td>
              <td className="p-3 text-green-700">Ideal — builds deep foundations</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Year 5 (Spring)</td>
              <td className="p-3">Focused skill-building with readiness check, timed practice begins</td>
              <td className="p-3 text-amber-700">Good — sufficient time for most children</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Year 5 (Summer)</td>
              <td className="p-3">Intensive targeted drills, gap-closing, mock test conditions</td>
              <td className="p-3 text-red-700">Tight — limited room for skill development</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The key principle is that <strong>earlier is better for breadth, later is better for intensity</strong>. A child who starts in Year 4 with broad vocabulary reading and gentle reasoning exposure will be far better placed than one who does intensive cramming from June of Year 5.
      </p>

      <h2 className="text-primary font-serif">A Data-Led Approach to Preparation</h2>
      <p>
        The most effective preparation strategy combines <strong>readiness check</strong> with <strong>targeted practice</strong>. Rather than working through every topic equally, a readiness check identifies exactly where your child is below the 121 benchmark — and targeted drills help address those specific areas.
      </p>
      <p>
        This is the approach used by Bucks 11 Plus Tests. Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link> measures both accuracy and pacing across all four domains, providing a readiness estimate against the 121 benchmark. From there, the platform recommends targeted micro-drills to help with the areas that need work.
      </p>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:how-to-pass" />
      <ContentCTA heading="Stop guessing — find out where they stand" subhead="An 8-minute check gives you a section-by-section breakdown plus an indicative readiness score against 121." ctaLabel="Take the readiness check" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline" data-testid="link-pillar-guide">The Complete Buckinghamshire 11+ Guide</Link>
          </li>
          <li>
            <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline" data-testid="link-qualifying-score">Understanding the 121 Qualifying Score</Link>
          </li>
          <li>
            <Link href="/bucks-11-plus-mistakes" className="text-primary hover:underline" data-testid="link-mistakes">Common 11+ Preparation Mistakes</Link>
          </li>
          <li>
            <Link href="/bucks-11-plus-registration" className="text-primary hover:underline" data-testid="link-registration">Bucks 11+ Registration Guide</Link>
          </li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}
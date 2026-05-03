import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Results Explained" },
];

export default function ResultsExplained() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Results – How to Understand Your Child's Score"
        description="A complete guide to interpreting Bucks 11+ results: what the standardised score means, what counts as qualifying, what borderline scores imply, and what to do next."
        canonicalPath="/bucks-11-plus-results"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-results">
          Bucks 11+ Results Explained
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          What the standardised score means, how to read it in context, and what happens next.
        </p>
      </div>

      <h2 className="text-primary font-serif">What the Letter Tells You</h2>
      <p>
        The Bucks 11+ results letter shows a single number: your child's <strong>standardised score</strong>. This is the only score reported. There is no breakdown by section (Verbal Reasoning, Non-Verbal Reasoning, Maths, Comprehension), no raw mark, no percentile rank — just one figure, typically somewhere between 80 and 140.
      </p>
      <p>
        Alongside the score, the letter states whether the child has met the qualifying standard of 121. Children at 121 or above are eligible to be considered for any of the <Link href="/bucks-grammar-schools" className="text-primary hover:underline">13 Buckinghamshire grammar schools</Link>. Children below 121 have not qualified.
      </p>

      <h2 className="text-primary font-serif">How to Read the Score</h2>
      <p>
        The standardised score is not a raw mark or a percentage. It has been adjusted for two things:
      </p>
      <ul>
        <li><strong>Paper difficulty</strong> — so a hard year doesn't penalise children.</li>
        <li><strong>Age in months</strong> — so summer-born children are not disadvantaged against their older classmates.</li>
      </ul>
      <p>
        On the standardised scale, 100 is the cohort average, 121 is roughly 1.4 standard deviations above the mean, and the practical range runs from about 70 to 140. For more detail, see our <Link href="/glossary/standardised-score" className="text-primary hover:underline">standardised score glossary entry</Link>.
      </p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-score-bands">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Score</th>
              <th className="text-left p-3 font-semibold text-primary">What It Means</th>
              <th className="text-left p-3 font-semibold text-primary">Typical Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">130+</td>
              <td className="p-3 text-slate-600">Substantially above the qualifying standard</td>
              <td className="p-3 text-slate-600">Qualified — typically wide school choice including over-subscribed schools</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">121–129</td>
              <td className="p-3 text-slate-600">Comfortably above qualifying</td>
              <td className="p-3 text-slate-600">Qualified — choice depends primarily on distance to preferred schools</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">115–120</td>
              <td className="p-3 text-slate-600">Strong performance, just below qualifying</td>
              <td className="p-3 text-slate-600">Not qualified — appeal worth considering only with specific evidence</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">100–114</td>
              <td className="p-3 text-slate-600">Average to above-average</td>
              <td className="p-3 text-slate-600">Not qualified — focus on upper school options or Year 9 entry routes</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Below 100</td>
              <td className="p-3 text-slate-600">Below cohort average</td>
              <td className="p-3 text-slate-600">Not qualified — non-grammar pathway, which includes excellent options</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Qualifying Doesn't Guarantee a Place</h2>
      <p>
        Around 30% of children who sit the test reach 121 — far more than the number of grammar school places available. When a school receives more qualifying applicants than places, it allocates places using its published oversubscription criteria. The standard order across most Bucks grammar schools is:
      </p>
      <ol>
        <li>Looked-after and previously looked-after children</li>
        <li>Children with an EHCP naming the school</li>
        <li>Siblings of current pupils (if still on roll)</li>
        <li>All other qualifying applicants — ranked by straight-line distance from home to the school</li>
      </ol>
      <p>
        For many oversubscribed schools (e.g. Royal Grammar School High Wycombe, Beaconsfield High), this means even a high score may not secure a place if you live more than 3–4 miles away.
      </p>

      <h2 className="text-primary font-serif">If You Are Disappointed With the Score</h2>
      <p>
        Three common reactions are worth tempering:
      </p>
      <ul>
        <li><strong>"They underperformed on the day."</strong> Possible, but rare. The standardisation process compensates for moderate variation. Children who score 115 in the test usually scored 115 in mock tests too.</li>
        <li><strong>"We should appeal."</strong> Appeals are appropriate for procedural concerns (test conditions, special arrangements not granted) — they are not a routine remedy for a score that fell short.</li>
        <li><strong>"This is a disaster."</strong> Buckinghamshire's upper schools include some of the highest-performing non-selective state schools in England. The path to a top university is not closed by a single test result.</li>
      </ul>

      <h2 className="text-primary font-serif">What to Do Next</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Link href="/bucks-11-plus-appeals" className="block rounded-lg border border-slate-200 p-5 hover:border-primary hover:shadow-sm transition-all" data-testid="link-appeals">
          <div className="font-semibold text-primary mb-1">Appeals process</div>
          <div className="text-sm text-slate-600">When to appeal, how to appeal, and realistic success rates.</div>
        </Link>
        <Link href="/learn/my-child-did-not-pass-the-bucks-11-plus" className="block rounded-lg border border-slate-200 p-5 hover:border-primary hover:shadow-sm transition-all" data-testid="link-did-not-pass">
          <div className="font-semibold text-primary mb-1">If your child did not qualify</div>
          <div className="text-sm text-slate-600">Upper schools, Year 9 entry, and the realistic pathways from here.</div>
        </Link>
        <Link href="/learn/year-9-grammar-school-entry-buckinghamshire" className="block rounded-lg border border-slate-200 p-5 hover:border-primary hover:shadow-sm transition-all" data-testid="link-year-9">
          <div className="font-semibold text-primary mb-1">Year 9 grammar entry</div>
          <div className="text-sm text-slate-600">A second route into grammar school at age 13, available at a few schools.</div>
        </Link>
        <Link href="/bucks-grammar-schools" className="block rounded-lg border border-slate-200 p-5 hover:border-primary hover:shadow-sm transition-all" data-testid="link-grammars">
          <div className="font-semibold text-primary mb-1">Grammar school directory</div>
          <div className="text-sm text-slate-600">All 13 schools with admissions, distances and recent demand patterns.</div>
        </Link>
      </div>

      <ChildExperienceCTA />
      <ContentCTA heading="What would your child's result look like today?" subhead="An 8-minute check gives an indicative readiness score against 121 — see what to expect before the real letter arrives." ctaLabel="Get an indicative score" />
      <Disclaimer />
    </div>
  );
}

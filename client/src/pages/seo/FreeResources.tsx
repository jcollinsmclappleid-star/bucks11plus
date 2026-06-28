import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { FreeToPlatformPanel, FreeToPlatformStrip } from "@/components/shared/FreeToPlatformPanel";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

interface Resource {
  title: string;
  description: string;
  href: string;
  type: "Guide" | "Practice" | "Checklist" | "Reference" | "Plan";
  internal: boolean;
  ssrOnly?: boolean;
}

function ResourceCard({ r }: { r: Resource }) {
  const className = "block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all";
  const testId = `link-resource-${r.href.replace(/\//g, '-')}`;
  const inner = (
    <>
      <div className="text-xs text-slate-500">{r.type}</div>
      <div className="font-semibold text-primary font-serif mb-1">{r.title}</div>
      <div className="text-sm text-slate-600">{r.description}</div>
    </>
  );
  if (r.ssrOnly) {
    return <a href={r.href} className={className} data-testid={testId}>{inner}</a>;
  }
  return <Link href={r.href} className={className} data-testid={testId}>{inner}</Link>;
}

const RESOURCES: Resource[] = [
  { title: "Free 8-Minute Diagnostic", description: "A 12-question GL-style mini paper across all four 11+ sections, with a practice score on the 121 scale. No account needed.", href: "/free-diagnostic", type: "Practice", internal: true },
  { title: "Free Practice Papers", description: "A library of free GL-style practice papers and where to find them, with guidance on how to use them effectively.", href: "/bucks-11-plus-practice-papers-free", type: "Practice", internal: true },
  { title: "Free Sample Questions", description: "A walk-through of sample questions from every section of the Bucks 11+ paper, with worked answers.", href: "/bucks-11-plus-sample-questions", type: "Practice", internal: true },
  { title: "Bucks 11+ Vocabulary List", description: "Working vocabulary list for the Bucks 11+ Verbal Reasoning paper, with the most-tested words and pairs.", href: "/bucks-11-plus-vocabulary-list", type: "Reference", internal: true },
  { title: "Test Day Checklist", description: "Everything to pack, prepare and remember for the morning of the Bucks 11+ test.", href: "/bucks-11-plus-test-day-checklist", type: "Checklist", internal: true },
  { title: "Year 5 Summer Plan", description: "A balanced six-week summer practice plan covering all four sections, with built-in rest days.", href: "/bucks-11-plus-year-5-summer-plan", type: "Plan", internal: true },
  { title: "Year 6 Revision Timetable", description: "A structured revision timetable for the test term, from September through to test day.", href: "/bucks-11-plus-year-6-revision-timetable", type: "Plan", internal: true },
  { title: "30-Day Final Push Plan", description: "A focused four-week plan for families with one month to go before the test.", href: "/11-plus-30-days-to-go", type: "Plan", internal: true },
  { title: "Bucks 11+ Glossary", description: "Plain-English explanations of every term in the Bucks 11+ admissions process.", href: "/glossary", type: "Reference", internal: true },
  { title: "Familiarisation Test", description: "Free familiarisation guide showing the question format and timing of every section.", href: "/bucks-11-plus-familiarisation-test", type: "Practice", internal: true },
  { title: "How Scoring Works", description: "Plain-English explanation of how the Bucks 11+ raw score becomes a standardised score, and what 121 actually means.", href: "/bucks-11-plus-how-scoring-works", type: "Reference", internal: true, ssrOnly: true },
  { title: "Test Date 2026", description: "Confirmed Bucks 11+ test dates for 2026 and what families need to do before each.", href: "/bucks-11-plus-test-date-2026", type: "Reference", internal: true },
];

export default function FreeResources() {
  const path = "/free-11-plus-resources";
  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Free 11+ Resources" },
  ];

  const byType = (type: Resource["type"]) => RESOURCES.filter((r) => r.type === type);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Free 11+ Resources — Practice Papers, Plans & Reference Guides"
        description="A complete library of free 11+ resources for Buckinghamshire families: practice papers, revision plans, vocabulary lists, test-day checklists and more."
        canonicalPath={path}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: "Free 11+ Resources", description: "Free resources for the Bucks 11+." },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">Free Library</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-free-resources">
          Free 11+ Resources
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Every resource on this page is free, takes no account to use, and is built specifically for the Bucks Secondary Transfer Test. The list below is organised by what you actually need: a starting-point diagnostic, practice material, structured revision plans, and quick-reference guides.
        </p>
      </div>

      <h2 className="text-primary font-serif">Start Here: Free Diagnostic</h2>
      <p>
        If you only do one thing on this page, take the free 8-minute diagnostic first. It's a 12-question GL-style mini paper covering all four sections, with a practice score on the 121 scale and a section breakdown. The result tells you which of the resources below to read in detail — so you don't waste time on the wrong topics.
      </p>
      <div className="not-prose my-6">
        <Link href="/free-diagnostic" className="inline-block rounded-xl btn-cta px-6 py-3 no-underline hover:opacity-95" data-testid="link-start-diagnostic">
          Take the free 8-minute diagnostic →
        </Link>
      </div>

      <FreeToPlatformStrip freeOffer="Free guides and PDFs on this page" />

      <h2 className="text-primary font-serif">Free Practice Material</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byType("Practice").map((r) => <ResourceCard key={r.href} r={r} />)}
      </div>

      <h2 className="text-primary font-serif">Revision Plans</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byType("Plan").map((r) => <ResourceCard key={r.href} r={r} />)}
      </div>

      <h2 className="text-primary font-serif">Reference Guides</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byType("Reference").map((r) => <ResourceCard key={r.href} r={r} />)}
      </div>

      <h2 className="text-primary font-serif">Test Day Checklist</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byType("Checklist").map((r) => <ResourceCard key={r.href} r={r} />)}
      </div>

      <h2 className="text-primary font-serif">How to Get the Most From These Resources</h2>
      <ol>
        <li>Take the free diagnostic first — five minutes of setup gives you a personalised reading list for the rest.</li>
        <li>Read the resources that match your child's weakest areas in depth. Skim the rest.</li>
        <li>Use a revision plan as a structure, not a script. Adapt the daily habits to fit your family's rhythm.</li>
        <li>Re-take the diagnostic every six to eight weeks to measure progress.</li>
      </ol>

      <ChildExperienceCTA />
      <FreeToPlatformPanel freeOffer="free guides, PDFs, and a 12-question check on this site" />

      <Disclaimer />
    </div>
  );
}

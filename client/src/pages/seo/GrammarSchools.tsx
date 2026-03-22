import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ExternalLink } from "lucide-react";
import { grammarSchools } from "@/data/grammar-schools";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Grammar Schools" },
];

export default function GrammarSchools() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Grammar Schools (2026) – All 13 Schools Directory"
        description="Complete directory of all 13 Bucks 11 Plus grammar schools. Locations, descriptions and official links to help you find the right school for your child."
        canonicalPath="/bucks-grammar-schools"
        schema={[
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-grammar-schools">
          Buckinghamshire Grammar Schools
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A complete directory of all 13 selective grammar schools in Buckinghamshire, each admitting students based on performance in the Secondary Transfer Test (11+).
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">The 13 Grammar Schools</h2>
      <p>
        Buckinghamshire is one of the few remaining fully selective local authorities in England, maintaining 13 grammar schools
        across the county. Entry to all 13 schools is determined by the same Secondary Transfer Test, commonly known as the Bucks 11+,
        which children sit in September of Year 6.
      </p>

      <div className="not-prose grid gap-4 my-8">
        {grammarSchools.map((school) => (
          <div
            key={school.slug}
            className="rounded-xl border border-slate-200 p-5 hover:border-primary/30 transition-colors"
            data-testid={`card-school-${school.slug}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary font-serif mb-1">{school.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{school.town}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{school.intro}</p>
                <Link
                  href={`/grammar-schools/${school.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  data-testid={`link-school-guide-${school.slug}`}
                >
                  Full school guide →
                </Link>
              </div>
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                data-testid={`link-school-${school.slug}`}
              >
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">How Admissions Work</h2>
      <p>
        All 13 grammar schools use the same Secondary Transfer Test result to determine eligibility. Children who achieve the
        qualifying standard (historically a standardised score of around 121) are deemed to have "qualified" for grammar school
        and can then list their preferred schools on the local authority common application form.
      </p>
      <p>
        Each school has its own oversubscription criteria — typically based on distance from the school — which determines
        allocation when more children qualify than places are available. Parents should check individual school websites
        for their specific admissions policies.
      </p>

      <h2 className="text-primary font-serif">Preparing for the Bucks 11+</h2>
      <p>
        The test covers Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Understanding the format and practising
        under timed conditions is essential. Our <Link href="/free-diagnostic" className="text-primary hover:underline">free diagnostic assessment</Link> measures
        your child's current readiness against the 121 qualifying benchmark across all four domains.
      </p>
      <p>
        For a comprehensive overview of the test structure, scoring, and preparation strategies, see
        our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">Complete Buckinghamshire 11+ Guide</Link>.
      </p>

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

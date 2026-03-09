import { Link } from "wouter";
import { Seo } from "../../components/shared/Seo";
import { ContentCTA } from "../../components/shared/ContentCTA";
import { Disclaimer } from "../../components/shared/Disclaimer";
import { Breadcrumbs, breadcrumbSchema } from "../../components/shared/Breadcrumbs";
import { getTownBySlug } from "../../data/towns";
import { ExternalLink } from "lucide-react";
import NotFound from "../not-found";

export default function TownGuide({ townSlug }: { townSlug: string }) {
  const town = getTownBySlug(townSlug);

  if (!town) return <NotFound />;

  const breadcrumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: town.name },
  ];

  const schema = [
    breadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Bucks 11 Plus Guide for Parents in ${town.name}`,
      "description": `Guide for families in ${town.name} preparing for the Buckinghamshire 11+ grammar school test.`,
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={`Bucks 11 Plus Guide for Parents in ${town.name} | 11+ Standard`}
        description={`Guide for families in ${town.name} preparing for the Buckinghamshire 11+ grammar school test. Learn how the Secondary Transfer Test works and assess readiness.`}
        canonicalPath={`/bucks-11-plus-${town.slug}`}
        schema={schema}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="text-town-title">
        Bucks 11 Plus Guide for Parents in {town.name}
      </h1>

      <p className="text-xl text-muted-foreground lead">{town.intro}</p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">Nearby Grammar Schools</h2>
      <p>
        Families in {town.name} typically consider the following Buckinghamshire grammar schools:
      </p>
      <div className="not-prose grid gap-3 my-6">
        {town.nearbySchools.map((school, i) => (
          <a
            key={i}
            href={school.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid={`link-school-${i}`}
          >
            <span className="font-semibold text-primary group-hover:text-primary/80">{school.name}</span>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-primary shrink-0" />
          </a>
        ))}
      </div>

      <h2 className="text-primary font-serif">How the Bucks 11+ Works</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test is administered by The Buckinghamshire Grammar Schools (TBGS). Children sit the test in September of Year 6, and results are released in October.
      </p>
      <p>
        The test assesses <strong>verbal reasoning</strong>, <strong>non-verbal reasoning</strong>, and <strong>mathematical reasoning</strong> under timed conditions. Scores are standardised to account for age differences within the cohort, and the qualifying score is <strong>121</strong>.
      </p>
      <p>
        Achieving the qualifying score does not automatically guarantee a grammar school place — admission also depends on oversubscription criteria set by each individual school.
      </p>
      <p>
        <Link href="/buckinghamshire-11-plus-guide" className="text-primary font-semibold hover:underline">
          Read the complete Buckinghamshire 11+ guide &rarr;
        </Link>
      </p>

      <h2 className="text-primary font-serif">Preparing for the Test</h2>
      <p>
        Preparation for the Bucks 11+ typically focuses on building familiarity with the three assessed domains and developing the pace discipline needed to complete questions within the time limit.
      </p>
      <ul>
        <li><strong>Verbal reasoning</strong> — vocabulary, word relationships, codes, and logical deduction</li>
        <li><strong>Non-verbal reasoning</strong> — pattern recognition, sequences, spatial awareness, and transformations</li>
        <li><strong>Mathematical reasoning</strong> — arithmetic fluency, fractions, data interpretation, and multi-step problems</li>
      </ul>
      <p>
        Many families use structured diagnostic assessments to identify specific gaps rather than relying on generic practice papers. A diagnostic approach helps focus preparation on the areas that will have the most impact on the overall score.
      </p>
      <p>
        <Link href="/how-to-pass-bucks-11-plus" className="text-primary font-semibold hover:underline">
          How to prepare effectively for the Bucks 11+ &rarr;
        </Link>
      </p>

      <h2 className="text-primary font-serif">Why {town.name} Families Research the Test Early</h2>
      <p>{town.whyEarly}</p>
      <p>{town.localContext}</p>

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

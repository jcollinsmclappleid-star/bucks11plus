import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { GLOSSARY_TERMS } from "../../data/glossary";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "11+ Glossary" },
];

export default function Glossary() {
  const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="11+ Glossary – Plain-English Definitions of Every Bucks 11+ Term"
        description="A plain-English glossary of every term parents encounter during the Buckinghamshire 11+ — from standardised scores and oversubscription criteria to EHCPs and waiting lists."
        canonicalPath="/glossary"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Bucks 11+ Glossary",
            hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.short,
              url: `https://bucks11plustest.co.uk/glossary/${t.slug}`,
            })),
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-glossary">
          11+ Glossary
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Every term parents encounter during the Buckinghamshire 11+, explained in plain English.
        </p>
      </div>

      <p>
        The Buckinghamshire 11+ comes with its own vocabulary — standardised scores, oversubscription criteria, EHCPs, supplementary information forms, and a dozen other terms that appear in admissions letters without explanation. This glossary defines each one in plain English with links to deeper guides where useful.
      </p>

      <div className="not-prose mt-10 grid sm:grid-cols-2 gap-3">
        {sorted.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-glossary-${t.slug}`}
          >
            <div className="font-semibold text-primary font-serif">{t.term}</div>
            <div className="text-sm text-slate-600 mt-1 leading-snug">{t.short}</div>
          </Link>
        ))}
      </div>

      <ContentCTA heading="Beyond definitions — see what matters" subhead="Take a free 8-minute readiness check to find which concepts your child has actually mastered." ctaLabel="Start the readiness check" />
      <Disclaimer />
    </div>
  );
}

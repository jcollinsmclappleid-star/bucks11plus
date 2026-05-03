import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { getGlossaryTerm, GLOSSARY_TERMS } from "../../data/glossary";
import NotFound from "../not-found";

export default function GlossaryTerm({ slug }: { slug: string }) {
  const term = getGlossaryTerm(slug);
  if (!term) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Glossary", href: "/glossary" },
    { label: term.term },
  ];

  const related = GLOSSARY_TERMS.filter((t) => t.slug !== slug).slice(0, 6);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={`${term.term} – Bucks 11+ Glossary`}
        description={term.short}
        canonicalPath={`/glossary/${term.slug}`}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.short,
            inDefinedTermSet: "https://bucks11plustest.co.uk/glossary",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Glossary</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-term">
          {term.term}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">{term.short}</p>
      </div>

      <h2 className="text-primary font-serif">Definition</h2>
      <p>{term.body}</p>

      {term.related && term.related.length > 0 && (
        <>
          <h2 className="text-primary font-serif">Related Reading</h2>
          <ul>
            {term.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-primary hover:underline">{r.label}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="not-prose my-12 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-4">Other glossary terms</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {related.map((t) => (
            <Link key={t.slug} href={`/glossary/${t.slug}`} className="text-primary hover:underline" data-testid={`link-related-${t.slug}`}>
              {t.term}
            </Link>
          ))}
        </div>
        <div className="mt-4 text-sm">
          <Link href="/glossary" className="text-primary hover:underline font-medium">→ View the full glossary</Link>
        </div>
      </div>

      <ContentCTA heading="Apply this in a real check" subhead="An 8-minute readiness check shows whether your child has actually mastered concepts like this — not just defined them." ctaLabel="See where they stand" />
      <Disclaimer />
    </div>
  );
}

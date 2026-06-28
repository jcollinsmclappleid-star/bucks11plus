import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { FreeToPlatformPanel, FreeToPlatformStrip } from "@/components/shared/FreeToPlatformPanel";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { getMockVariant, MOCK_VARIANTS } from "../../data/mock-variants";
import NotFound from "../not-found";

export default function MockVariant({ slug }: { slug: string }) {
  const m = getMockVariant(slug);
  if (!m) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Mock Tests", href: "/bucks-11-plus-mock-test" },
    { label: m.title },
  ];

  const others = MOCK_VARIANTS.filter((x) => x.slug !== slug);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={m.metaTitle}
        description={m.metaDescription}
        canonicalPath={m.pathSegment}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: m.title,
            description: m.metaDescription,
            about: "11+ Mock Test",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Mock Test Format</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-${slug}`}>
          {m.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{m.intro}</p>
      </div>

      <FreeToPlatformStrip freeOffer="A free 12-question mock-style check" />

      <h2 className="text-primary font-serif">What This Mock Test Is</h2>
      <p>{m.whatItIs}</p>

      <h2 className="text-primary font-serif">Who It Suits</h2>
      <p>{m.whoItSuits}</p>

      <h2 className="text-primary font-serif">How to Run It</h2>
      <ol>
        {m.howToRunIt.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h2 className="text-primary font-serif">What a Good Result Looks Like</h2>
      <p>{m.whatGoodLooksLike}</p>

      <h2 className="text-primary font-serif">What to Do Afterwards</h2>
      <ul>
        {m.whatToDoAfter.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">Common Pitfalls</h2>
      <ul>
        {m.pitfalls.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <ChildExperienceCTA />
      <FreeToPlatformPanel freeOffer="a free 12-question mock-style check (not a full 40- or 50-question exam)" />

      <h2 className="text-primary font-serif">Other Mock Test Formats</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.pathSegment}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-other-${o.slug}`}
          >
            <div className="text-xs text-slate-500">11+ Mock Format</div>
            <div className="font-semibold text-primary font-serif">{o.title}</div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

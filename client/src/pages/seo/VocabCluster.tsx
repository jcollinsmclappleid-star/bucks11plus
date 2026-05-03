import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { getVocabCluster, VOCAB_CLUSTERS } from "../../data/vocab-clusters";
import NotFound from "../not-found";

export default function VocabCluster({ slug }: { slug: string }) {
  const v = getVocabCluster(slug);
  if (!v) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Vocabulary", href: "/bucks-11-plus-vocabulary-list" },
    { label: v.title },
  ];

  const others = VOCAB_CLUSTERS.filter((x) => x.slug !== slug);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={v.metaTitle}
        description={v.metaDescription}
        canonicalPath={v.pathSegment}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: v.title,
            description: v.metaDescription,
            about: "11+ Vocabulary",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Vocabulary</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-${slug}`}>
          {v.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{v.intro}</p>
      </div>

      <h2 className="text-primary font-serif">Why It Matters</h2>
      <p>{v.whyMatters}</p>

      <h2 className="text-primary font-serif">How to Teach It Effectively</h2>
      <ul>
        {v.howToTeach.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">Words to Know</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {v.examples.map((e, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="font-semibold text-primary font-serif">{e.word}</div>
            <div className="text-sm text-slate-700 mt-1">{e.meaning}</div>
            {e.pair && <div className="text-xs text-slate-500 mt-1">Pair: {e.pair}</div>}
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">Practice Routine</h2>
      <p>{v.practiceRoutine}</p>

      <ChildExperienceCTA />
      <ContentCTA
        heading="See exactly which vocabulary gaps are costing marks"
        subhead="Our free 8-minute diagnostic includes vocabulary-in-context questions and tells you, by question type, where to focus practice."
        ctaLabel="Take the free diagnostic"
      />

      <h2 className="text-primary font-serif">Other Vocabulary Resources</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.pathSegment}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-other-${o.slug}`}
          >
            <div className="text-xs text-slate-500">11+ Vocabulary</div>
            <div className="font-semibold text-primary font-serif">{o.title}</div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

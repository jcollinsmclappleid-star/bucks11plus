import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoConversionPanel } from "@/components/shared/SeoConversionPanel";
import { getMathsTopic, MATHS_TOPICS } from "../../data/maths-topics";
import NotFound from "../not-found";

export default function MathsTopic({ slug }: { slug: string }) {
  const t = getMathsTopic(slug);
  if (!t) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Maths Practice", href: "/11-plus-maths-practice" },
    { label: t.title },
  ];

  const others = MATHS_TOPICS.filter((x) => x.slug !== slug);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={t.metaTitle}
        description={t.metaDescription}
        canonicalPath={t.pathSegment}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t.title,
            description: t.metaDescription,
            about: "Mathematics",
            educationalLevel: "Year 5 / Year 6 (UK)",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Maths Topic</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-${slug}`}>
          {t.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{t.intro}</p>
      </div>

      <h2 className="text-primary font-serif">Why This Topic Is Tested</h2>
      <p>{t.whyTested}</p>

      <h2 className="text-primary font-serif">Key Methods</h2>
      <div className="not-prose space-y-4 my-6">
        {t.keyMethods.map((m, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-semibold text-primary font-serif mb-1">{m.name}</div>
            <div className="text-slate-700 text-base leading-relaxed">{m.description}</div>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">Worked Example</h2>
      <div className="not-prose rounded-xl border border-slate-200 bg-white p-6 my-6">
        <p className="text-slate-800 font-medium mb-4">{t.workedExample.prompt}</p>
        <ol className="space-y-2 text-sm text-slate-700 mb-4 list-decimal list-inside">
          {t.workedExample.working.map((step, j) => (
            <li key={j}>{step}</li>
          ))}
        </ol>
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          <p className="text-sm"><strong className="text-emerald-700">Answer:</strong> {t.workedExample.answer}</p>
          <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-amber-700">Watch out:</strong> {t.workedExample.gotcha}</p>
        </div>
      </div>

      <SeoConversionPanel
        variant="question"
        heading={`See whether ${t.title.replace("11+ ", "").toLowerCase()} is holding your child back.`}
        subhead="A single maths topic can quietly drag down a 121-scale practice score. Browse the practice library and see topic gaps, pace risk, and what to practise next."
      />

      <h2 className="text-primary font-serif">Common Mistakes</h2>
      <ul>
        {t.commonMistakes.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">A Practice Progression That Works</h2>
      <ol>
        {t.practiceProgression.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h2 className="text-primary font-serif">When This Topic Is Taught</h2>
      <p>{t.yearGroupNote}</p>

      <ChildExperienceCTA />
      <ContentCTA
        heading={`See whether ${t.title.replace("11+ ", "").toLowerCase()} is costing your child marks`}
        subhead="Our free 8-minute diagnostic breaks performance down by topic — not just an overall score — so you can see exactly where to focus practice."
        ctaLabel="Take the free diagnostic"
      />

      <h2 className="text-primary font-serif">Other 11+ Maths Topics</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.pathSegment}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-other-${o.slug}`}
          >
            <div className="text-xs text-slate-500">11+ Maths</div>
            <div className="font-semibold text-primary font-serif">{o.title}</div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

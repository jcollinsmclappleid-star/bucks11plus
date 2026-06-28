import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoConversionPanel } from "@/components/shared/SeoConversionPanel";
import { getQuestionType, QUESTION_TYPES } from "../../data/question-types";
import NotFound from "../not-found";

export default function QuestionTypeGuide({ slug }: { slug: string }) {
  const q = getQuestionType(slug);
  if (!q) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: q.domain, href: q.domainHref },
    { label: q.title },
  ];

  const others = QUESTION_TYPES.filter((x) => x.slug !== slug);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={q.metaTitle}
        description={q.metaDescription}
        canonicalPath={q.pathSegment}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: q.title,
            description: q.metaDescription,
            about: q.domain,
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">{q.domain}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-${slug}`}>
          {q.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{q.intro}</p>
      </div>

      <h2 className="text-primary font-serif">Worked Example</h2>
      <div className="not-prose rounded-xl border border-slate-200 bg-white p-6 my-6">
        <p className="text-slate-800 font-medium mb-4">{q.example.prompt}</p>
        <ul className="space-y-1.5 text-sm text-slate-700 mb-4">
          {q.example.options.map((o, j) => (
            <li key={j} className="flex gap-2">
              <span className="font-semibold text-slate-400">{String.fromCharCode(65 + j)}.</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm"><strong className="text-emerald-700">Answer:</strong> {q.example.answer}</p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{q.example.explanation}</p>
        </div>
      </div>

      <SeoConversionPanel
        variant="question"
        heading={`Find out if ${q.title.toLowerCase()} is costing your child marks.`}
      />

      <h2 className="text-primary font-serif">Why This Question Type Is Hard</h2>
      <p>{q.whyHard}</p>

      <h2 className="text-primary font-serif">Strategies That Work</h2>
      <ul>
        {q.strategies.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">How to Practise</h2>
      <p>{q.practiceTip}</p>
      <p>
        Our platform includes practice sets for every {q.domain} question type at progressively increasing difficulty. Take our{" "}
        <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> to see where your child currently sits, or explore the full{" "}
        <Link href={q.domainHref} className="text-primary hover:underline">{q.domain} practice section</Link>.
      </p>

      <h2 className="text-primary font-serif">Other Question Types</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.pathSegment}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-other-${o.slug}`}
          >
            <div className="text-xs text-slate-500">{o.domain}</div>
            <div className="font-semibold text-primary font-serif">{o.title}</div>
          </Link>
        ))}
      </div>

      <ChildExperienceCTA />
      <ContentCTA heading="See which question types are costing marks" subhead="An 8-minute check breaks down performance by question type — not just an overall score." ctaLabel="Find the weak question types" />
      <Disclaimer />
    </div>
  );
}

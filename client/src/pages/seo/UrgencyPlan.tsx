import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { TestCountdownBadge } from "@/components/shared/TestCountdownBadge";
import { getUrgencyPlan, URGENCY_PLANS } from "../../data/urgency-plans";
import NotFound from "../not-found";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

export default function UrgencyPlan({ slug }: { slug: string }) {
  const p = getUrgencyPlan(slug);
  if (!p) return <NotFound />;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Revision Plans", href: "/bucks-11-plus-year-6-revision-timetable" },
    { label: p.title },
  ];

  const others = URGENCY_PLANS.filter((x) => x.slug !== slug);

  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title={p.metaTitle}
        description={p.metaDescription}
        canonicalPath={p.pathSegment}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.metaDescription,
            about: "11+ Revision Plan",
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-4 flex justify-start">
        <TestCountdownBadge />
      </div>

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Revision Plan</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-${slug}`}>
          {p.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{p.intro}</p>
      </div>

      <SeoPageProductLead />

      <h2 className="text-primary font-serif">A Reality Check First</h2>
      <p>{p.realityCheck}</p>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">Week-by-Week Structure</h2>
      <div className="not-prose space-y-6 my-6">
        {p.weeklyStructure.map((w, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="font-semibold text-primary font-serif text-lg mb-1">{w.week}</div>
            <div className="text-slate-700 italic mb-3">{w.focus}</div>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside">
              {w.activities.map((a, j) => <li key={j}>{a}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">Daily Habits That Pay Off</h2>
      <ul>
        {p.dailyHabits.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">What to Avoid</h2>
      <ul>
        {p.whatToAvoid.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      <h2 className="text-primary font-serif">A Closing Note</h2>
      <p>{p.closingNote}</p>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <ContentCTA
        heading="Get a baseline before you start the plan"
        subhead="A free 8-minute diagnostic shows you exactly which question types to prioritise — so the plan above is targeted at your child's actual gaps."
        ctaLabel="Take the free diagnostic"
      />

      <h2 className="text-primary font-serif">Other 11+ Revision Plans</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.pathSegment}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-other-${o.slug}`}
          >
            <div className="text-xs text-slate-500">11+ Revision Plan</div>
            <div className="font-semibold text-primary font-serif">{o.title}</div>
          </Link>
        ))}
      </div>      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

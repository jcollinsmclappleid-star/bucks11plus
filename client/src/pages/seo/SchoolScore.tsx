import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { grammarSchools, getSchoolBySlug } from "../../data/grammar-schools";
import NotFound from "../not-found";

export default function SchoolScore({ schoolSlug }: { schoolSlug: string }) {
  const school = getSchoolBySlug(schoolSlug);
  if (!school) return <NotFound />;

  const path = `/11-plus-score-${school.slug}`;
  const metaTitle = `${school.shortName} 11+ Score — What You Need for the Bucks 11+`;
  const metaDescription = `What 11+ score is required for ${school.name}. The 121 Buckinghamshire qualifying standard explained, with admissions context and how to prepare for a comfortable score.`;

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Grammar Schools", href: "/bucks-grammar-schools" },
    { label: `${school.shortName} 11+ Score` },
  ];

  const others = grammarSchools.filter((s) => s.slug !== schoolSlug).slice(0, 8);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={metaTitle}
        description={metaDescription}
        canonicalPath={path}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${school.shortName} 11+ Score Requirements`,
            description: metaDescription,
            about: school.name,
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">11+ Score for {school.shortName}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-score-${school.slug}`}>
          What 11+ Score Does My Child Need for {school.shortName}?
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Every Buckinghamshire grammar school — including {school.shortName} — uses the same single qualifying standard: <strong>121</strong> on the Secondary Transfer Test. But qualifying is not the same as being offered a place. Here is what the score actually means in the context of {school.shortName}'s admissions.
        </p>
      </div>

      <h2 className="text-primary font-serif">The Headline Number: 121</h2>
      <p>
        A child must achieve a standardised score of 121 or above on the Bucks Secondary Transfer Test to qualify for grammar school in Buckinghamshire. The standardised score combines results across Verbal Reasoning, Non-Verbal Reasoning, Mathematics and English Comprehension, weighted equally and adjusted for the child's age in months on the test date. There is no separate pass mark for {school.shortName} — every grammar school in the county uses the same threshold.
      </p>

      <h2 className="text-primary font-serif">Qualifying ≠ Being Offered a Place</h2>
      <p>{school.distanceContext}</p>
      <p>
        In other words, achieving 121 is the entry ticket. Whether the ticket gets your child a place at {school.shortName} depends on the school's oversubscription criteria — and at most Bucks grammar schools, that ultimately comes down to distance from the school once siblings and looked-after children are placed.
      </p>

      <h2 className="text-primary font-serif">Why Comfortably Above 121 Matters Here</h2>
      <p>{school.preparationAdvice}</p>
      <p>
        A child who scores 122 has qualified, but has no margin for variation between mock tests and the real test. A child who consistently scores 130+ in mocks has a higher probability of qualifying on test day, even allowing for the natural variability between practice and live results. For families targeting {school.shortName} specifically, this margin matters.
      </p>

      <h2 className="text-primary font-serif">{school.shortName} Admissions Context</h2>
      <p>{school.admissionsContext}</p>

      <h2 className="text-primary font-serif">Catchment & Distance</h2>
      <p>{school.catchmentContext}</p>

      <h2 className="text-primary font-serif">How to Prepare for a Comfortable Score</h2>
      <p>
        The most reliable preparation pathway has three stages: a baseline assessment to identify weak areas, a structured practice plan focused on the two or three lowest-scoring question types, and pacing work in the final two months to ensure the child can finish under timed conditions. Children who follow this pathway tend to enter the real test scoring 5–10 marks above their early-mock baseline.
      </p>
      <p>
        For {school.shortName} specifically — with its competitive distance dynamics — the goal is not to scrape 121 but to qualify with margin. That means broad, balanced practice across all four GL Assessment domains rather than narrow drilling on the strongest section.
      </p>

      <h2 className="text-primary font-serif">Frequently Asked Questions</h2>
      <div className="not-prose space-y-4 my-6">
        {school.faq.map((q, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-semibold text-primary font-serif mb-2">{q.question}</div>
            <div className="text-slate-700 leading-relaxed">{q.answer}</div>
          </div>
        ))}
      </div>

      <ChildExperienceCTA />
      <ContentCTA
        heading={`How is your child tracking toward 121 for ${school.shortName}?`}
        subhead="Our free 8-minute GL-style diagnostic shows a practice score on the 121 scale — no account needed."
        ctaLabel="Take the free diagnostic"
      />

      <h2 className="text-primary font-serif">Score Requirements at Other Bucks Grammar Schools</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={`/11-plus-score-${o.slug}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
            data-testid={`link-school-score-${o.slug}`}
          >
            <div className="text-xs text-slate-500">{o.town}</div>
            <div className="font-semibold text-primary font-serif">{o.shortName} 11+ Score</div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

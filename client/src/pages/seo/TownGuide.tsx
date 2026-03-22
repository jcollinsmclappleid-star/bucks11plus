import { Link } from "wouter";
import { Seo } from "../../components/shared/Seo";
import { ContentCTA } from "../../components/shared/ContentCTA";
import { SubscribeCTA } from "../../components/shared/SubscribeCTA";
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: town.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const schema = [
    breadcrumbSchema(breadcrumbs),
    faqSchema,
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
        title={`Bucks 11 Plus Preparation in ${town.name} (2026) – 121 Score & Local Guide`}
        description={`Guide for families in ${town.name} preparing for the Bucks 11 Plus. Understand the 121 qualifying score, Secondary Transfer Test format, and how to assess your child's readiness.`}
        canonicalPath={`/bucks-11-plus-${town.slug}`}
        schema={schema}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="text-town-title">
          Bucks 11 Plus Guide for Parents in {town.name}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">{town.intro}</p>
      </div>

      <SubscribeCTA />

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
        The test assesses <strong>verbal reasoning</strong>, <strong>non-verbal reasoning and spatial reasoning</strong>, <strong>mathematical reasoning</strong>, and <strong>English comprehension</strong> under timed conditions. Scores are standardised to account for age differences within the cohort, and the qualifying score is <strong>121</strong>.
      </p>
      <p>
        Achieving the qualifying score does not automatically guarantee a grammar school place — admission also depends on oversubscription criteria set by each individual school, which typically prioritise looked-after children, siblings, and then distance from the school.
      </p>
      <p>
        <Link href="/buckinghamshire-11-plus-guide" className="text-primary font-semibold hover:underline">
          Read the complete Buckinghamshire 11+ guide &rarr;
        </Link>
      </p>

      <h2 className="text-primary font-serif">Preparing for the Test from {town.name}</h2>
      <p>{town.preparation}</p>
      <p>{town.localContext}</p>
      <ul>
        <li><strong>Verbal reasoning</strong> — vocabulary, word relationships, codes, and logical deduction</li>
        <li><strong>Non-verbal and spatial reasoning</strong> — pattern recognition, sequences, spatial awareness, and transformations</li>
        <li><strong>Mathematical reasoning</strong> — arithmetic fluency, fractions, data interpretation, and multi-step problems</li>
        <li><strong>English comprehension</strong> — reading passages with multiple-choice questions on meaning, inference, and vocabulary</li>
      </ul>
      <p>
        <Link href="/how-to-pass-bucks-11-plus" className="text-primary font-semibold hover:underline">
          How to prepare effectively for the Bucks 11+ &rarr;
        </Link>
      </p>

      <h2 className="text-primary font-serif">The Specific Challenge for {town.name} Families</h2>
      <p>{town.uniqueChallenge}</p>
      <p>{town.whyEarly}</p>

      <h2 className="text-primary font-serif">Frequently Asked Questions</h2>
      {town.faq.map((item, i) => (
        <div key={i}>
          <h3 className="text-primary font-serif">{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

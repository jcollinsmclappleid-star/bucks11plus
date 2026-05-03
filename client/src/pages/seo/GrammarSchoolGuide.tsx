import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { getSchoolBySlug, grammarSchools } from "@/data/grammar-schools";
import { ExternalLink, Users, MapPin, GraduationCap } from "lucide-react";
import NotFound from "@/pages/not-found";

const GENDER_LABELS: Record<string, string> = {
  boys: "Boys' grammar school",
  girls: "Girls' grammar school",
  coed: "Co-educational grammar school",
};

export default function GrammarSchoolGuide({ schoolSlug }: { schoolSlug: string }) {
  const school = getSchoolBySlug(schoolSlug);

  if (!school) return <NotFound />;

  const breadcrumbs = [
    { label: "Buckinghamshire Grammar Schools", href: "/bucks-grammar-schools" },
    { label: school.shortName },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: school.faq.map(item => ({
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
      "@type": "EducationalOrganization",
      name: school.name,
      description: school.intro,
      url: school.website,
      address: {
        "@type": "PostalAddress",
        streetAddress: school.address,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${school.name} – 11+ Admissions Guide (2026)`,
      description: `Admissions guide for ${school.name}: qualifying score requirements, distance cut-off context, catchment area, and how to prepare for Buckinghamshire 11+ entry.`,
    },
  ];

  const otherSchools = grammarSchools.filter(s => s.slug !== schoolSlug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${school.name} – 11+ Admissions Guide 2026 | Bucks 11 Plus Tests`}
        description={`Admissions guide for ${school.name} (${GENDER_LABELS[school.gender]}, ${school.town}). Qualifying score, distance cut-off, catchment area, and how to prepare for Bucks 11+ entry.`}
        canonicalPath={`/grammar-schools/${school.slug}`}
        schema={schema}
      />

      <div className="bg-muted/30 border-b border-border py-3">
        <div className="container mx-auto max-w-4xl px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
          <div className="flex flex-wrap gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Users className="h-3.5 w-3.5" />
              {GENDER_LABELS[school.gender]}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              {school.town}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
              <GraduationCap className="h-3.5 w-3.5" />
              Qualifying score: 121
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="text-school-title">
            {school.name}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{school.intro}</p>
        </div>

        <div className="not-prose mb-6">
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
            data-testid="link-school-website"
          >
            Visit school website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <SubscribeCTA />

        <div className="prose prose-slate max-w-none
          prose-h2:font-serif prose-h2:text-xl prose-h2:font-bold prose-h2:text-primary prose-h2:mt-10 prose-h2:mb-3
          prose-h3:font-semibold prose-h3:text-base prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-foreground">

          <h2>The Qualifying Score Requirement</h2>
          <p>
            Like all 13 Buckinghamshire grammar schools, {school.shortName} requires children to achieve a standardised score of <strong>121</strong> on the Secondary Transfer Test (the Bucks 11+). This score is age-standardised — adjusted for each child's exact date of birth — and is determined by GL Assessment, who administer the test on behalf of The Buckinghamshire Grammar Schools (TBGS).
          </p>
          <p>
            Achieving 121 does not guarantee a place at this school. It qualifies a child to apply; places are then allocated using the school's oversubscription criteria. For most families, this means the key allocation factor — after looked-after children and siblings of current pupils — is <strong>distance from the school</strong>.
          </p>

          <h2>Admissions and Distance</h2>
          <p>{school.admissionsContext}</p>
          <p>{school.catchmentContext}</p>
          <p>{school.distanceContext}</p>
          <p>
            <Link href="/bucks-11-plus-qualifying-score" className="text-primary font-semibold hover:underline">
              Learn how the 121 qualifying score is calculated →
            </Link>
          </p>

          <h2>About {school.shortName}</h2>
          <p>{school.uniqueFeatures}</p>
          <p>
            The school's address is: <strong>{school.address}</strong>.
          </p>

          <h2>How to Prepare</h2>
          <p>
            The Secondary Transfer Test is produced by GL Assessment and covers four domains: <strong>verbal reasoning</strong>, <strong>non-verbal reasoning and spatial reasoning</strong>, <strong>mathematical reasoning</strong>, and <strong>English comprehension</strong>. All questions are multiple choice, with audio instructions delivered by a recorded voice. The test is split across two papers of 45 minutes each and is sat in September of Year 6.
          </p>
          <p>{school.preparationAdvice}</p>
          <p>
            <Link href="/free-diagnostic" className="text-primary font-semibold hover:underline">
              Take the free 11+ readiness check to find your child's starting point →
            </Link>
          </p>
          <p>
            <Link href="/how-to-pass-bucks-11-plus" className="text-primary font-semibold hover:underline">
              How to prepare effectively for the Bucks 11+ →
            </Link>
          </p>

          <h2>The Admissions Timeline</h2>
          <p>
            All 13 Buckinghamshire grammar schools use the same admissions timeline. Key dates:
          </p>
          <ul>
            <li><strong>Spring/summer of Year 5:</strong> Registration opens via The Buckinghamshire Grammar Schools (TBGS)</li>
            <li><strong>June of Year 5:</strong> Registration closes — missing this deadline means missing the test</li>
            <li><strong>September of Year 6:</strong> The Secondary Transfer Test is sat (two 45-minute papers)</li>
            <li><strong>October of Year 6:</strong> Results released — qualified or not qualified</li>
            <li><strong>October/November of Year 6:</strong> School preference deadline on the SCAF (Secondary Common Application Form)</li>
            <li><strong>March of Year 7 entry year:</strong> National Offer Day — school places allocated</li>
          </ul>
          <p>
            <Link href="/bucks-11-plus-timeline" className="text-primary font-semibold hover:underline">
              Full Buckinghamshire 11+ admissions timeline →
            </Link>
          </p>

          <h2>Frequently Asked Questions</h2>
          {school.faq.map((item, i) => (
            <div key={i}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>

        {otherSchools.length > 0 && (
          <div className="mt-12 not-prose">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Other Buckinghamshire Grammar Schools</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherSchools.map(s => (
                <Link
                  key={s.slug}
                  href={`/grammar-schools/${s.slug}`}
                  data-testid={`link-school-${s.slug}`}
                  className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="text-xs text-muted-foreground mb-1">{s.town} · {GENDER_LABELS[s.gender]}</div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                    {s.shortName}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/bucks-grammar-schools" className="text-sm text-primary font-medium hover:underline">
                View all 13 Buckinghamshire grammar schools →
              </Link>
            </div>
          </div>
        )}

        <ChildExperienceCTA />
        <ContentCTA heading="Targeting this grammar school?" subhead="Get an indicative readiness score against the 121 qualifying standard — and a breakdown of which sections need work." ctaLabel="Check readiness now" />
        <Disclaimer />
      </div>
    </div>
  );
}

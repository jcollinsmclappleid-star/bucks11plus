import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { QUESTION_TYPES } from "../../data/question-types";

export default function GLAssessmentQuestionTypes() {
  const path = "/gl-assessment-question-types";
  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "GL Assessment Question Types" },
  ];

  const byDomain = (domain: string) => QUESTION_TYPES.filter((q) => q.domain === domain);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="GL Assessment Question Types — Full Bucks 11+ Question Bank Guide"
        description="Every question type tested in the GL Assessment 11+ used by Buckinghamshire — across Verbal Reasoning, Non-Verbal Reasoning, Maths and Comprehension — with linked guides."
        canonicalPath={path}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          { "@context": "https://schema.org", "@type": "Article", headline: "GL Assessment Question Types" },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-1">GL Assessment</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-gl-question-types">
          Every GL Assessment 11+ Question Type
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The GL Assessment 11+ used by Buckinghamshire draws from a finite question bank with around 25 distinct question types across four domains. Knowing them in advance — what each looks like, the typical traps, and the most efficient method — is one of the highest-leverage forms of preparation a child can do.
        </p>
      </div>

      <h2 className="text-primary font-serif">Why Knowing the Question Types Matters</h2>
      <p>
        Children who walk into the test having seen every question type before answer faster and with less anxiety than children meeting an unfamiliar format under exam pressure. The actual content of the questions varies year to year; the question types do not. A child who has practised matrix questions, cloze questions and ratio word problems specifically will recognise them on sight in the real test and reach for the right method without hesitation.
      </p>

      <h2 className="text-primary font-serif">Verbal Reasoning Question Types</h2>
      <p>
        The Verbal Reasoning section tests vocabulary, language reasoning and the ability to spot patterns in words and letters. It moves quickly — often 80 questions in 50 minutes — so fluency on each type matters as much as accuracy.
      </p>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byDomain("Verbal Reasoning").map((q) => (
          <Link key={q.slug} href={q.pathSegment} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid={`link-q-${q.slug}`}>
            <div className="text-xs text-slate-500">Verbal Reasoning</div>
            <div className="font-semibold text-primary font-serif">{q.title}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-primary font-serif">Non-Verbal Reasoning Question Types</h2>
      <p>
        The Non-Verbal Reasoning section uses shapes and patterns rather than words. It tests spatial reasoning, visual pattern recognition and the ability to apply rules consistently. Children who are strong here tend to be strong because of regular exposure rather than an innate gift — NVR responds well to deliberate practice.
      </p>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byDomain("Non-Verbal Reasoning").map((q) => (
          <Link key={q.slug} href={q.pathSegment} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid={`link-q-${q.slug}`}>
            <div className="text-xs text-slate-500">Non-Verbal Reasoning</div>
            <div className="font-semibold text-primary font-serif">{q.title}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-primary font-serif">Maths Question Types</h2>
      <p>
        The Mathematics section tests arithmetic, word-problem reasoning, and topic-specific knowledge across the Year 5 and 6 National Curriculum. Roughly 60% of questions are word problems; the rest are direct calculation or application.
      </p>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byDomain("Maths").map((q) => (
          <Link key={q.slug} href={q.pathSegment} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid={`link-q-${q.slug}`}>
            <div className="text-xs text-slate-500">Maths</div>
            <div className="font-semibold text-primary font-serif">{q.title}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-primary font-serif">English Comprehension Question Types</h2>
      <p>
        The Comprehension section is built around a single longer passage — usually fiction, occasionally non-fiction — followed by 25–30 multiple-choice questions. Questions test literal recall, inference, vocabulary in context, authorial intent and the main idea of the passage.
      </p>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {byDomain("English Comprehension").map((q) => (
          <Link key={q.slug} href={q.pathSegment} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all" data-testid={`link-q-${q.slug}`}>
            <div className="text-xs text-slate-500">English Comprehension</div>
            <div className="font-semibold text-primary font-serif">{q.title}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-primary font-serif">How to Use This Page</h2>
      <p>
        Working through every question-type guide on this page in a single sitting is overwhelming. A more useful approach: take a diagnostic mock first to identify the two or three weakest question types, then read those guides in depth. Return to the others as practice broadens.
      </p>

      <ChildExperienceCTA />
      <ContentCTA
        heading="Find out which question types are costing your child marks"
        subhead="Our free 8-minute diagnostic breaks performance down by question type — so you read the right guides first, not all of them at once."
        ctaLabel="Take the free diagnostic"
      />

      <Disclaimer />
    </div>
  );
}

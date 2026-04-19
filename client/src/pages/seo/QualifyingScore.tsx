import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Qualifying Score" },
];

const faqItems = [
  {
    question: "What is the qualifying score for the Buckinghamshire 11+?",
    answer: "The qualifying score is 121 on the standardised scale used for the Buckinghamshire Secondary Transfer Test. Children who achieve a standardised score of 121 or above are deemed to have qualified for grammar school and are eligible to be considered for a place at any of the 13 Buckinghamshire grammar schools.",
  },
  {
    question: "Is 121 a raw score or a percentage?",
    answer: "Neither. 121 is a standardised score — a statistically adjusted figure that accounts for the child's age on the day of the test and the difficulty of that year's paper. Two children who answer the same number of questions correctly may receive different standardised scores if they are different ages, because the standardisation process adjusts for developmental age differences within the cohort.",
  },
  {
    question: "What happens if my child scores 120?",
    answer: "A score of 120 does not meet the qualifying threshold. There is no borderline review process — the 121 qualifying standard is a hard cutoff. A child who scores 120 has not qualified, regardless of how close the score appears to the threshold.",
  },
  {
    question: "Does qualifying at 121 guarantee a grammar school place?",
    answer: "No. Qualifying at 121 makes a child eligible to be considered for a grammar school place, but it does not guarantee one. Where a school receives more qualifying applicants than it has places, it allocates places using oversubscription criteria — typically starting with looked-after children, then siblings, then distance from the school.",
  },
  {
    question: "What raw accuracy does a child typically need to reach 121?",
    answer: "To achieve the 121 qualifying standard, a child typically needs to answer approximately 80–85% of questions correctly across all four test domains. This requires both accuracy and pace — unanswered questions score zero, so a child who runs out of time in any section effectively loses marks for every question they did not reach.",
  },
];

export default function QualifyingScore() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Qualifying Score (2026) – What 121 Means & How It Works"
        description="Understand the Bucks 11 Plus qualifying score of 121, how standardised scores work, and what annual variation means for your child's grammar school application."
        canonicalPath="/bucks-11-plus-qualifying-score"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(item => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-qualifying-score">
          Bucks 11+ Qualifying Score
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          What the 121 qualifying standard means, how scores are standardised, and why the threshold can vary from year to year.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">What Is the Qualifying Score?</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test uses a <strong>standardised scoring system</strong> where the qualifying
        standard has historically been set at <strong>121</strong>. Children who achieve a standardised score of 121 or above
        are deemed to have "qualified" for grammar school and are eligible to be considered for a place at any of
        the <Link href="/bucks-grammar-schools" className="text-primary hover:underline">13 Buckinghamshire grammar schools</Link>.
      </p>
      <p>
        It is important to understand that 121 is not a raw mark or a percentage — it is a standardised score that accounts
        for the difficulty of the specific test paper and the age of the child on the day of the test.
      </p>

      <h2 className="text-primary font-serif">How Standardisation Works</h2>
      <p>
        Standardisation is a statistical process that ensures fairness across the cohort. Two key adjustments are made:
      </p>
      <ul>
        <li>
          <strong>Age adjustment:</strong> Younger children in the cohort (summer-born) receive a small upward adjustment
          to their raw score, while older children (autumn-born) receive a smaller adjustment or none. This compensates for
          the developmental advantage that older children may have.
        </li>
        <li>
          <strong>Paper difficulty adjustment:</strong> If a particular year's paper is harder or easier than average, the
          standardisation process accounts for this so that qualifying in a "hard year" requires approximately the same
          underlying ability as qualifying in an "easy year."
        </li>
      </ul>
      <p>
        The result is a score where <strong>100 represents the average performance</strong> across the cohort, and 121 sits
        approximately 1.4 standard deviations above the mean — meaning roughly the top 25% of test-takers qualify.
      </p>

      <h2 className="text-primary font-serif">Annual Variation</h2>
      <p>
        While 121 has been the qualifying standard for many years, it is technically set each year by the Buckinghamshire
        Moderation Committee. In practice, the standard has remained consistent, but parents should be aware that:
      </p>
      <ul>
        <li>The raw mark needed to achieve 121 varies each year depending on paper difficulty</li>
        <li>A child scoring 120 has not qualified, regardless of how close the score appears</li>
        <li>There is no "borderline" review process — the qualifying standard is a hard cutoff</li>
        <li>Schools with more applicants than places use oversubscription criteria (usually distance) to allocate among qualified children</li>
      </ul>

      <h2 className="text-primary font-serif">What Does a Score of 121 Actually Require?</h2>
      <p>
        To achieve the qualifying standard, a child typically needs to demonstrate:
      </p>
      <ul>
        <li><strong>High accuracy</strong> — answering approximately 80–85% of questions correctly across all four papers</li>
        <li><strong>Consistent speed</strong> — completing questions within the time limits, as unanswered questions effectively count as incorrect</li>
        <li><strong>Breadth of ability</strong> — performing strongly across Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension, not just in one area</li>
      </ul>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free readiness check</Link> measures your child's
        current performance against the 121 benchmark, providing a forecast score and identifying specific areas for improvement.
      </p>

      <h2 className="text-primary font-serif">Understanding Your Child's Score</h2>
      <p>
        After the test, Buckinghamshire Council sends parents a letter with their child's standardised score. Understanding
        this score in context is important:
      </p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-score-ranges">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Score Range</th>
              <th className="text-left p-3 font-semibold text-primary">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">121+</td>
              <td className="p-3 text-slate-600">Qualified for grammar school</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">115–120</td>
              <td className="p-3 text-slate-600">Close to qualifying — strong performance but below the cutoff</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">100–114</td>
              <td className="p-3 text-slate-600">Average to above-average — significant gap to the qualifying standard</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Below 100</td>
              <td className="p-3 text-slate-600">Below the cohort average</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        For a full overview of the test, admissions process, and preparation strategies, read
        our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">Complete Buckinghamshire 11+ Guide</Link>.
      </p>

      <ChildExperienceCTA />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

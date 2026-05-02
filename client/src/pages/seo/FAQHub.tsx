import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Frequently Asked Questions" },
];

interface FAQ { question: string; answer: string; }
interface FAQSection { heading: string; intro?: string; questions: FAQ[]; }

const faqSections: FAQSection[] = [
  {
    heading: "About the Test",
    intro: "What the Bucks 11+ actually is, who runs it, and what it covers.",
    questions: [
      { question: "What is the Bucks 11+?", answer: "The Bucks 11+ — formally the Buckinghamshire Secondary Transfer Test — is a selective entrance assessment used by the 13 grammar schools in Buckinghamshire to determine which Year 6 children qualify for grammar school admission. It is produced by GL Assessment and sat in early September." },
      { question: "Who produces the Bucks 11+ papers?", answer: "GL Assessment, on behalf of The Buckinghamshire Grammar Schools (TBGS) consortium. GL is the same producer used by Kent and several other GL-style 11+ counties, but the Bucks paper is a distinct test with its own format, threshold and timing." },
      { question: "What subjects are tested?", answer: "Four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Each is sat as a separate paper with its own time limit and answer sheet." },
      { question: "How long is the test?", answer: "Approximately two and a half hours of testing in total, broken into multiple papers with short breaks between them. The full test day, including registration and breaks, typically runs from around 9:00 AM to noon." },
      { question: "Where is the test sat?", answer: "Children are typically allocated to a designated Buckinghamshire grammar school as their test centre, not their primary school. The test centre is confirmed in the official letter sent after registration." },
    ],
  },
  {
    heading: "About the Qualifying Score",
    questions: [
      { question: "What is the qualifying score?", answer: "121 on the standardised scale. Children scoring 121 or above qualify for grammar school consideration. A score of 120 or below does not qualify, regardless of how close the figure appears." },
      { question: "Is 121 a percentage?", answer: "No. 121 is a standardised score — a statistically adjusted figure that accounts for the child's age and the difficulty of that year's paper. It is not the same as a raw mark or percentage. See our full explanation of the qualifying score for details." },
      { question: "What raw mark do you typically need to reach 121?", answer: "Approximately 80–85% accuracy across all four papers, although this varies year to year depending on paper difficulty. Children with weaker pacing may need higher accuracy on the questions they reach to compensate for unanswered ones." },
      { question: "Is the qualifying score the same every year?", answer: "Yes — 121 has been the qualifying standard for many years. The raw mark required to achieve 121 varies because of standardisation, but the threshold itself has remained consistent." },
      { question: "Does qualifying guarantee a grammar school place?", answer: "No. Qualifying makes a child eligible to be considered. Where a school has more qualifying applicants than places, places are allocated by oversubscription criteria — typically distance from the school after looked-after children and siblings." },
    ],
  },
  {
    heading: "About Registration",
    questions: [
      { question: "How do I register my child?", answer: "Online through the Buckinghamshire Council website during the registration window in May–June of Year 5. Registration is free. You will need your child's date of birth, current school details, and home address." },
      { question: "Do I need to register if my child attends a Buckinghamshire primary school?", answer: "Yes. Registration is required for every child who wishes to sit the test, regardless of which primary school they attend. There is no automatic enrolment." },
      { question: "Can children outside Buckinghamshire sit the test?", answer: "Yes. Many families in Hertfordshire, Berkshire, Oxfordshire and London register their children to sit the Bucks 11+ in order to apply to Bucks grammar schools. The registration process is the same." },
      { question: "What is the registration deadline?", answer: "Typically late June of Year 5. Late registrations may be accepted in exceptional circumstances but are not guaranteed. Always check the current year's deadline on the Bucks Council website." },
      { question: "Is there a fee to register?", answer: "No. Registration for the Bucks 11+ is free." },
    ],
  },
  {
    heading: "About Preparation",
    questions: [
      { question: "When should we start preparing?", answer: "Most families benefit from starting structured preparation in the autumn or spring of Year 5 — twelve to eighteen months before the test. Light familiarisation activities can begin earlier in Year 4. Starting in the summer before Year 6 leaves very little time for vocabulary and reasoning skills to develop." },
      { question: "How much practice does my child need?", answer: "Most successful candidates do 20–45 minutes of focused work most days across the preparation period. Quality and consistency matter more than long marathon sessions. Steady daily practice across many months produces durable skill; intense weekend cramming does not." },
      { question: "Do we need a private tutor?", answer: "No — many children qualify each year without ever working with a tutor. A structured online platform, regular reading, and consistent practice is sufficient for most academically capable children. Tutors add value for specific situations (motivation, targeted gaps), not as a default requirement." },
      { question: "What's the most important skill to focus on?", answer: "Vocabulary and reading comprehension, because they are the slowest skills to build and are tested across multiple papers. Strong vocabulary supports both Verbal Reasoning and English Comprehension and cannot be crammed in a few weeks." },
      { question: "Should we use practice papers from previous years?", answer: "Yes — but with a clear purpose. Use papers to assess readiness and identify gaps, not as the primary form of practice. A child who has worked through 50 papers without any structured analysis usually does worse than a child who has worked through 15 papers with proper review and targeted follow-up." },
    ],
  },
  {
    heading: "About Grammar School Allocation",
    questions: [
      { question: "When are results released?", answer: "Mid-October of Year 6. Results are sent by post and contain the child's standardised score and whether they have achieved the qualifying standard." },
      { question: "When do I submit secondary school preferences?", answer: "After receiving results, by the national deadline of 31 October. Preferences are submitted via the common application form managed by your home local authority." },
      { question: "How are places allocated when schools are oversubscribed?", answer: "Each school applies its published oversubscription criteria, typically: looked-after children, siblings of current pupils, then distance from the school as the primary tiebreaker. The exact criteria vary by school and are published in their admissions arrangements." },
      { question: "When is National Offer Day?", answer: "1 March of Year 6. Families receive their secondary school allocation via their home local authority." },
      { question: "What if my child qualifies but doesn't get a place?", answer: "You can appeal. Each grammar school runs its own appeals process — typically held in spring after National Offer Day. An appeal does not guarantee a place but allows a panel to consider individual circumstances." },
    ],
  },
  {
    heading: "About Bucks 11 Plus Tests (Our Platform)",
    questions: [
      { question: "What is included in the free plan?", answer: "An 8-minute readiness check producing a forecast score against the 121 threshold, a section breakdown across all four GL Assessment domains, and the three highest-impact priorities to fix next. Free users can also access our parent guides and learning resources." },
      { question: "What does the paid plan include?", answer: "Full-length GL-style mock exams, targeted micro-drills focused on the specific gaps the diagnostic identifies, pacing analysis, progress tracking across multiple mocks, and parent analytics. Bucks Plus Edge is £35 per month or £279 per year." },
      { question: "Is this an alternative to a tutor?", answer: "For most families, yes — particularly when the parent is willing to oversee a calm daily routine. Some families combine the platform with occasional one-to-one tuition for stubborn gaps; others use the platform as their entire preparation approach." },
      { question: "How is your scoring different from raw practice paper percentages?", answer: "We produce a standardised forecast score against the 121 threshold, not a percentage. The forecast accounts for question difficulty, your child's pacing, and the realistic standardisation that would be applied on the actual test. Percentages on practice papers don't translate directly to the 121 scale." },
      { question: "Can I cancel any time?", answer: "Yes. The monthly plan can be cancelled from the account page at any time and you retain access until the end of your current billing period. The annual plan is paid up front and we don't offer pro-rata refunds, but you can cancel renewal at any time." },
    ],
  },
];

const allQuestions: FAQ[] = faqSections.flatMap(s => s.questions);

export default function FAQHub() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus FAQs (2026) – Every Parent Question Answered"
        description="Comprehensive Bucks 11+ FAQ hub: the test, the 121 qualifying score, registration, preparation, grammar school allocation and our platform. Every common parent question, answered clearly."
        canonicalPath="/bucks-11-plus-faqs"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allQuestions.map(q => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-faqs">
          Bucks 11+ Frequently Asked Questions
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The most common questions parents ask about the Buckinghamshire Secondary Transfer Test — covering the test itself, qualifying scores, registration, preparation, grammar school allocation, and our platform.
        </p>
      </div>

      <SubscribeCTA />

      {faqSections.map((section, sIdx) => (
        <section key={sIdx} className="mt-10">
          <h2 className="text-primary font-serif">{section.heading}</h2>
          {section.intro && <p className="text-slate-600 italic">{section.intro}</p>}
          <div className="not-prose space-y-4 my-6">
            {section.questions.map((q, qIdx) => (
              <details key={qIdx} className="group p-5 bg-slate-50 border border-slate-200 rounded-xl" data-testid={`faq-${sIdx}-${qIdx}`}>
                <summary className="cursor-pointer font-semibold text-primary text-base list-none flex items-start gap-3">
                  <span className="text-primary group-open:rotate-90 transition-transform mt-0.5">▸</span>
                  <span>{q.question}</span>
                </summary>
                <p className="mt-3 ml-6 text-sm text-slate-700 leading-relaxed">{q.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <h2 className="text-primary font-serif">Still Have Questions?</h2>
      <p>
        If your question isn't answered above, the most useful next step is usually our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link>, which gives you concrete data about your child's current position against the 121 threshold. From there, the right preparation approach becomes much easier to choose.
      </p>
      <p>
        For deeper coverage of any specific topic, see our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">complete Bucks 11+ guide</Link> or the <Link href="/learn" className="text-primary hover:underline">learning hub</Link>.
      </p>

      <ChildExperienceCTA />
      <LeadMagnetBlock source="seo:faq-hub" />
      <ContentCTA />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">The Complete Buckinghamshire 11+ Guide</Link></li>
          <li><Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">The 121 Qualifying Score Explained</Link></li>
          <li><Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Full Admissions Timeline</Link></li>
          <li><Link href="/bucks-grammar-schools" className="text-primary hover:underline">All 13 Bucks Grammar Schools</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

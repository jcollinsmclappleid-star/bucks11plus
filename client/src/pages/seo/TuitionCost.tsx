import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Cost of Preparation" },
];

const faqItems = [
  {
    question: "How much does Bucks 11+ preparation typically cost?",
    answer: "Costs range from under £100 for a self-directed approach using a few practice papers, up to £3,000–6,000+ for a full year of weekly private tuition. Most families spend somewhere in between — typically £400–1,500 across the preparation period — combining online platforms, books, and occasional tuition.",
  },
  {
    question: "Are private tutors worth the cost?",
    answer: "Tutors can be worth the investment for children who need personalised teaching, struggle with motivation, or have specific gaps that benefit from one-to-one explanation. They are less worth the investment for children who already work well independently and need primarily volume of practice and feedback. The decision depends on the child, not on the price tag.",
  },
  {
    question: "Can my child pass the Bucks 11+ without a tutor?",
    answer: "Yes — many children qualify each year without ever working with a private tutor. Self-directed preparation supported by a structured online platform, regular reading, and consistent practice is sufficient for most academically capable children. A tutor is one option among several, not a requirement.",
  },
  {
    question: "What's the cheapest credible way to prepare?",
    answer: "A genuinely cheap but credible approach is: a single set of GL-style practice books (£20–40), one or two affordable online practice subscriptions (£20–40 a month for several months), and consistent daily reading using free library resources. Total for the full preparation cycle: £200–400. The major cost saving is time, not money — the parent must be willing to oversee and structure the preparation themselves.",
  },
];

export default function TuitionCost() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Cost of Bucks 11 Plus Preparation (2026) – Tuition vs Online vs Self-Study"
        description="A clear breakdown of what Bucks 11+ preparation actually costs in 2026: private tutors, online platforms, practice books and self-study. Compare options and find the right value for your family."
        canonicalPath="/bucks-11-plus-tuition-cost"
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-tuition-cost">
          The Cost of Bucks 11+ Preparation
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Preparation costs in Buckinghamshire vary by an order of magnitude — from under £100 to £6,000+. Here is what each option actually costs, what you get for the money, and how to decide what is right for your family.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">What Does 11+ Preparation Typically Cost?</h2>
      <p>
        There is no single answer — preparation costs in Buckinghamshire span an order of magnitude. What you spend depends on the approach you take, how much of the work the parent is willing to oversee, and how long the preparation period lasts. The breakdown below covers the realistic 2026 cost of each main approach across a 12-month preparation cycle.
      </p>

      <h2 className="text-primary font-serif">Cost Breakdown by Approach</h2>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-cost-breakdown">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Approach</th>
              <th className="text-left p-3 font-semibold text-primary">Typical 12-month cost</th>
              <th className="text-left p-3 font-semibold text-primary">Parent time required</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Practice books only</td><td className="p-3 text-slate-600">£60 – £150</td><td className="p-3 text-slate-600">High — parent marks and structures all work</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Free online resources + books</td><td className="p-3 text-slate-600">£80 – £250</td><td className="p-3 text-slate-600">High</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Structured online platform</td><td className="p-3 text-slate-600">£200 – £450</td><td className="p-3 text-slate-600">Low–medium</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Group tuition (small classes)</td><td className="p-3 text-slate-600">£600 – £1,800</td><td className="p-3 text-slate-600">Medium</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Private tutor — weekly</td><td className="p-3 text-slate-600">£1,800 – £3,500</td><td className="p-3 text-slate-600">Low</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Private tutor — twice weekly</td><td className="p-3 text-slate-600">£3,600 – £6,500+</td><td className="p-3 text-slate-600">Low</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">Hybrid: platform + occasional tutor</td><td className="p-3 text-slate-600">£600 – £1,500</td><td className="p-3 text-slate-600">Low–medium</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500 italic">
        Figures reflect typical Buckinghamshire 2026 pricing across a 12-month preparation cycle. Tutor rates vary widely — central Buckinghamshire and London commuter towns sit at the higher end, with rural areas often 25–40% lower.
      </p>

      <h2 className="text-primary font-serif">Why Costs Vary So Much</h2>
      <p>
        The dramatic spread in costs reflects two real differences between approaches:
      </p>
      <ul>
        <li><strong>Who does the structuring.</strong> A tutor charges for both the teaching <em>and</em> the planning, marking, and tracking work. A self-directed approach saves money by transferring all of that work to the parent.</li>
        <li><strong>How personalised the teaching is.</strong> A weekly one-to-one tutor delivers content shaped around your child specifically. A book or video course delivers identical material to thousands of children. Both can work — but they are not the same product.</li>
      </ul>

      <h2 className="text-primary font-serif">What You Get for £35 a Month</h2>
      <p>
        Our Bucks Plus Edge plan is £35 per month or £279 per year — roughly the cost of two to three hours of private tutoring, but for a year of access. For that price your child gets:
      </p>
      <ul>
        <li>Full-length GL-style mock exams across all four domains, with standardised forecast scoring against the 121 threshold</li>
        <li>A diagnostic engine that identifies the highest-impact gaps and ranks them by score impact</li>
        <li>Targeted micro-drills focused on those specific gaps, not generic practice</li>
        <li>Pacing analysis that flags timing problems separately from accuracy problems</li>
        <li>Progress tracking across multiple mocks so you can see the trajectory, not just a single snapshot</li>
        <li>Parent analytics so you understand exactly where your child stands and what to do next</li>
      </ul>
      <p>
        Compared to private tuition at £40–60/hour, you would have to do more than ten months at a £35 monthly rate to match a single hour of weekly tuition. Compared to the cheapest self-study approach, you pay more — but you get structure, scoring, and tracking that self-study cannot easily replicate.
      </p>

      <h2 className="text-primary font-serif">The True Cost of "Free" Practice Papers</h2>
      <p>
        It is tempting to assume the cheapest option is free practice papers downloaded online. In practice, this approach has hidden costs:
      </p>
      <ul>
        <li><strong>Most "free" papers are old, poorly formatted, or don't reflect the current GL Assessment style</strong></li>
        <li><strong>There is no scoring against 121</strong> — you only get raw percentages, which mean very little without standardisation</li>
        <li><strong>The parent does all the marking, analysis and pacing assessment</strong> — usually 60–90 minutes per paper</li>
        <li><strong>You don't know whether your child is on track</strong> until you sit a properly benchmarked mock</li>
      </ul>
      <p>
        Free papers are useful as supplementary material. They are not a substitute for structured preparation that gives you genuine readiness data.
      </p>

      <h2 className="text-primary font-serif">How to Decide What's Right for Your Family</h2>
      <p>
        The right approach depends on three honest questions:
      </p>
      <ol>
        <li><strong>How much time can the parent realistically commit?</strong> If the answer is "very little", a structured platform or a tutor is essential. Self-study only works when a parent can oversee 30–60 minutes a day for many months.</li>
        <li><strong>Does your child work well independently?</strong> A tutor adds value where motivation or personalised explanation is the bottleneck. For self-directed children, the same money spent on a tutor often produces less return than the same money spent on practice volume and feedback systems.</li>
        <li><strong>How much budget can you sustain?</strong> A weekly tutor across 12 months is a £2,000–3,500 commitment. If that is comfortable, fine. If it would create financial strain, a hybrid approach typically delivers 80% of the outcome for 20–30% of the cost.</li>
      </ol>

      <h2 className="text-primary font-serif">A Hybrid Approach</h2>
      <p>
        For most families we work with, the best value comes from combining a structured platform with occasional, targeted tuition:
      </p>
      <ul>
        <li>A structured online platform (£200–450/year) handles the day-to-day practice, scoring, mock tests, and progress tracking</li>
        <li>Occasional one-to-one tuition (£200–600 across the preparation cycle) addresses specific stubborn gaps the platform identifies</li>
        <li>The parent oversees a calm daily routine, but doesn't have to plan or mark</li>
      </ul>
      <p>
        Total cost: typically £400–1,000 across the full preparation cycle — a fraction of full-time tutoring, with most of the structural benefit.
      </p>

      <h2 className="text-primary font-serif">Compare With Local Tutors</h2>
      <p>
        For a deeper comparison of platforms versus tutors specifically, see our <a href="/11-plus-tutors-buckinghamshire" className="text-primary hover:underline">11+ tutors in Buckinghamshire guide</a>. To assess your child's current standing before deciding what to spend, take our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link> — it produces a forecast score that helps you decide how much preparation is actually needed.
      </p>

      <ChildExperienceCTA />
      <ContentCTA />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="/11-plus-tutors-buckinghamshire" className="text-primary hover:underline">11+ Tutors in Buckinghamshire</a></li>
          <li><Link href="/pricing" className="text-primary hover:underline">Bucks 11 Plus Tests Pricing</Link></li>
          <li><Link href="/learn/how-to-prepare-for-the-bucks-11-plus-without-a-tutor" className="text-primary hover:underline">Preparing Without a Tutor</Link></li>
          <li><Link href="/how-to-pass-bucks-11-plus" className="text-primary hover:underline">How to Pass the Bucks 11+</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

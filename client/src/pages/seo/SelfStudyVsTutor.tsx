import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Self-Study vs Tutor" },
];

export default function SelfStudyVsTutor() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus: Self-Study vs Tutor – Honest Comparison"
        description="Self-study, online platforms or a private tutor for the Bucks 11+? Honest comparison of cost, time commitment, results expectations, and which works best for which families."
        canonicalPath="/bucks-11-plus-self-study-vs-tutor"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-self-vs-tutor">
          Self-Study vs Tutor for the Bucks 11+
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Honest comparison of the three real options: parent-led self-study, an online platform, or a one-to-one private tutor.
        </p>
      </div>

      <h2 className="text-primary font-serif">The Three Real Options</h2>
      <ol>
        <li><strong>Parent-led self-study</strong> with print 11+ workbooks — typical cost £80–£200 over a year.</li>
        <li><strong>Online preparation platform</strong> (like ours) — typical cost £20–£200 depending on plan and duration.</li>
        <li><strong>Private one-to-one tutor</strong> — typical cost £35–£70/hour × 30–80 sessions = £1,000–£5,500 over a year.</li>
      </ol>
      <p>
        Most families end up using a combination — for example, an online platform for the bulk of practice with occasional tutor sessions for specific weak areas. The pure-tutor or pure-self-study options are less common than the headlines suggest.
      </p>

      <h2 className="text-primary font-serif">Side-by-Side Comparison</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-options">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary"></th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Self-Study</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Online Platform</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Private Tutor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Annual cost</td><td className="p-3">£80–£200</td><td className="p-3">£20–£200</td><td className="p-3">£1,000–£5,500</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Parent time required</td><td className="p-3">High (3–5 hrs/week)</td><td className="p-3">Moderate (1–2 hrs/week)</td><td className="p-3">Low (drop-off &amp; collect)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Format alignment</td><td className="p-3">Print only</td><td className="p-3">On-screen (matches real test)</td><td className="p-3">Varies by tutor</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Personalisation</td><td className="p-3">Manual (parent identifies gaps)</td><td className="p-3">Automated gap analysis</td><td className="p-3">Strong (one-to-one)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Pacing &amp; timing practice</td><td className="p-3">Manual stopwatch</td><td className="p-3">Built-in countdown</td><td className="p-3">Tutor-guided</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold">Score forecasting</td><td className="p-3">None</td><td className="p-3">Indicative readiness score</td><td className="p-3">Tutor's judgement</td></tr>
            <tr><td className="p-3 font-semibold">Best for</td><td className="p-3">Confident parents with time</td><td className="p-3">Most families</td><td className="p-3">Children with specific gaps or anxiety</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">When Self-Study Is Enough</h2>
      <ul>
        <li>You have a parent who is academically confident and has 3–5 hours per week to dedicate to structured preparation.</li>
        <li>Your child is intrinsically motivated and works well independently.</li>
        <li>Your child is starting from a strong baseline — already at 110+ on a mock test in spring of Year 5.</li>
        <li>Budget is genuinely the main constraint.</li>
      </ul>
      <p>
        Many families succeed with self-study alone. Established print 11+ workbooks are well-designed, and the official Familiarisation Test is free. The main risk of pure self-study is missing on-screen format practice — the real test has been on-screen since 2013, and children who only practise on paper often lose 5–10 standardised points to interface unfamiliarity.
      </p>

      <h2 className="text-primary font-serif">When an Online Platform Makes Sense</h2>
      <ul>
        <li>You want format-matched practice (on-screen, timed, mouse-based).</li>
        <li>You'd benefit from automatic gap analysis after each session — knowing exactly which question types to focus on next.</li>
        <li>Parent time is limited but you want substantial structure for the child.</li>
        <li>You want a practice score on the 121 scale to gauge how preparation is tracking.</li>
        <li>You're using self-study workbooks alongside but want to add timed on-screen mocks.</li>
      </ul>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> gives a baseline at no cost; the full platform starts at £19. See <Link href="/pricing" className="text-primary hover:underline">pricing</Link> for what's included.
      </p>

      <h2 className="text-primary font-serif">When a Private Tutor Is Worth It</h2>
      <ul>
        <li>Your child has a specific area of weakness (often comprehension or NVR) that hasn't responded to general practice.</li>
        <li>Your child experiences significant test anxiety that benefits from one-to-one rapport.</li>
        <li>You don't have parental capacity for daily oversight and want to outsource it entirely.</li>
        <li>The cost is genuinely affordable — not a stretch that creates household stress.</li>
      </ul>
      <p>
        Tutor quality varies enormously. A great 11+ tutor is worth the investment; a mediocre one is expensive busy-work. Look for tutors with demonstrable Bucks 11+ track record (not just "11+" generally), recent specific knowledge of GL question types, and the willingness to give honest feedback rather than reassurance.
      </p>

      <h2 className="text-primary font-serif">The Most Common Mistake</h2>
      <p>
        Many families assume that hiring a tutor is "the gold standard" and that self-study or online platforms are second-best. The data does not support this. A child working consistently for 60 minutes a day on a well-structured online platform usually outperforms a child seeing a tutor for one hour a week and doing little independent practice in between. Tutors are most effective as a complement to daily independent work — not as a replacement for it.
      </p>

      <ChildExperienceCTA />
      <ContentCTA heading="Self-studying or tutoring? Get a baseline first." subhead="An 8-minute readiness check tells you if you're on track — whichever route you've chosen." ctaLabel="Get the baseline" />
      <Disclaimer />
    </div>
  );
}

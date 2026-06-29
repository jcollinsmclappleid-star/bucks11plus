import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Appeals" },
];

const faqItems = [
  {
    question: "What is the success rate for Bucks 11+ appeals?",
    answer: "Statistical success rates vary by school and year but are generally low — typically below 15% for academic appeals (challenging the qualifying outcome) and 10–25% for admissions appeals (challenging place allocation). Appeals are most successful where there is clear procedural fault or material change in circumstances; far less successful as a general challenge to a borderline score.",
  },
  {
    question: "What is the difference between an academic appeal and an admissions appeal?",
    answer: "An academic appeal challenges the qualifying outcome — usually argued on grounds that the child performed below their genuine ability due to specific test-day circumstances (illness, undisclosed special needs, materially adverse conditions). An admissions appeal challenges the allocation of a school place after a child has qualified — usually argued on grounds of strong sibling links, exceptional commitment to the school's character, or an EHCP-related need.",
  },
  {
    question: "When is the deadline to appeal?",
    answer: "The deadline to appeal is published in the refusal letter and is typically 20 school days from the date of the letter. Appeals lodged after this deadline may still be heard but are not guaranteed a hearing. The earlier you lodge, the more time you have to prepare evidence.",
  },
  {
    question: "Do I need a solicitor?",
    answer: "No. Appeal panels are independent and follow a non-legalistic process designed to be accessible to parents without legal representation. A clear, well-evidenced written submission is more important than legal phrasing. Education law specialists can be helpful for complex cases (EHCP-related, severe SEND) but are not necessary for most appeals.",
  },
  {
    question: "Can I appeal at more than one school?",
    answer: "Yes. You may appeal at every preferred grammar school that refused a place. Each appeal is heard separately by an independent panel and judged on its own evidence. Be aware that appealing at five schools requires preparing five distinct submissions — bandwidth matters.",
  },
];

export default function Appeals() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Bucks 11 Plus Appeals – Process, Deadlines & Realistic Success Rates"
        description="A clear, honest guide to Bucks 11+ appeals: when to appeal, how to prepare evidence, the timeline, and what success rates parents should realistically expect."
        canonicalPath="/bucks-11-plus-appeals"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-appeals">
          Bucks 11+ Appeals
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The honest guide: when to appeal, how to prepare, and what success looks like in practice.
        </p>
      </div>


      <SeoPageProductLead />
      <h2 className="text-primary font-serif">Two Different Appeals</h2>
      <p>There are two completely separate appeals processes, often confused:</p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Type</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">When It Applies</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">What You're Arguing</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Academic appeal</td>
              <td className="p-3">Child did not reach 121</td>
              <td className="p-3">Child is genuinely capable of grammar work; the test result did not reflect ability</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Admissions appeal</td>
              <td className="p-3">Child qualified but was not offered a place at preferred school</td>
              <td className="p-3">Specific compelling reasons (sibling, EHCP, exceptional commitment) outweigh oversubscription</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">When to Appeal</h2>
      <p>An appeal is most likely to succeed where there is one or more of the following:</p>
      <ul>
        <li><strong>Procedural fault</strong> — the child sat the test in conditions that materially differed from intended (e.g. severe disturbance, IT failure, special arrangements not properly applied).</li>
        <li><strong>Documented illness on test day</strong> — supported by a GP note dated within 24–48 hours of the test.</li>
        <li><strong>Undisclosed or newly-diagnosed special educational need</strong> — supported by an educational psychologist's report or recent diagnosis.</li>
        <li><strong>Strong school evidence</strong> — predicted attainment substantially above the test result, supported by detailed work samples and headteacher statement.</li>
        <li><strong>Material sibling, faith or character link</strong> — for admissions appeals only, where school-specific evidence is strong.</li>
      </ul>
      <p>
        An appeal is unlikely to succeed where the only argument is that the child "should have" qualified or that the score was close to 121. Panels see hundreds of these each year and the standardisation process is designed to absorb day-to-day variation.
      </p>

      <h2 className="text-primary font-serif">The Process &amp; Timeline</h2>
      <ol>
        <li><strong>Refusal letter received</strong> — typically mid-October (academic) or 1 March (admissions). The letter states the deadline to appeal, usually 20 school days.</li>
        <li><strong>Lodge the appeal</strong> — submit the written appeal form to the relevant body (the Council for academic appeals; the school's clerk for admissions appeals). Do this early — the deadline is firm.</li>
        <li><strong>Prepare evidence</strong> — gather school reports, medical evidence, work samples, and any third-party statements. Quality matters more than volume.</li>
        <li><strong>Attend the hearing</strong> — typically a 30–60 minute session in front of a panel of three independent members. Both parents may attend; the child does not.</li>
        <li><strong>Receive the decision</strong> — usually within five working days of the hearing.</li>
      </ol>

      <h2 className="text-primary font-serif">Realistic Success Rates</h2>
      <p>
        We don't sugar-coat this. Appeal success rates across Bucks grammar schools are statistically low. Aggregate figures (which vary year-on-year and are not always centrally published):
      </p>
      <ul>
        <li><strong>Academic appeals:</strong> success rate typically 5–15%, lower at the most oversubscribed schools.</li>
        <li><strong>Admissions appeals:</strong> success rate typically 10–25% — higher where strong school-specific evidence exists, much lower for "general" appeals.</li>
      </ul>
      <p>
        These low rates are not arbitrary — they reflect the fact that the qualifying process and the oversubscription rules are administered consistently and fairly in most cases. Genuine procedural faults and material new evidence do exist, but they are not the norm.
      </p>

      <h2 className="text-primary font-serif">Should You Appeal?</h2>
      <p>An appeal is worth pursuing if you can answer "yes" to most of these questions:</p>
      <ul>
        <li>Is there specific evidence (medical, educational, school) that the result does not reflect the child's true ability or the case for a place?</li>
        <li>Are you prepared to invest 10–20 hours in preparing a clear, evidenced submission?</li>
        <li>Are you emotionally ready to receive a refusal — which remains the most likely outcome?</li>
        <li>Will pursuing the appeal not delay you in securing the best alternative placement?</li>
      </ul>
      <p>
        For many families, the energy spent preparing an appeal is better invested in researching upper schools, planning Year 9 entry routes, or preparing the child for a strong start at their offered school. There is no right answer — but the decision is worth making clear-headed.
      </p>

      <h2 className="text-primary font-serif" id="faq">Frequently Asked Questions</h2>
      <div className="not-prose space-y-4 my-6">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="font-semibold text-primary mb-2 font-serif">{item.question}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">Related Reading</h2>
      <ul>
        <li><Link href="/bucks-11-plus-results" className="text-primary hover:underline">Understanding your child's Bucks 11+ results</Link></li>
        <li><Link href="/learn/my-child-did-not-pass-the-bucks-11-plus" className="text-primary hover:underline">If your child did not pass</Link></li>
        <li><Link href="/learn/year-9-grammar-school-entry-buckinghamshire" className="text-primary hover:underline">Year 9 grammar entry routes</Link></li>
      </ul>

      <ContentCTA heading="Worried about an appeal? Build a stronger case." subhead="An indicative readiness score with a per-section breakdown gives you concrete evidence of where your child stands — useful before the appeal window opens." ctaLabel="Get the readiness check" />
      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

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
  { label: "Independent vs Grammar" },
];

export default function IndependentVsGrammar() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Independent School vs Buckinghamshire Grammar – An Honest Comparison"
        description="Independent school or Buckinghamshire grammar — how the two compare on academic outcomes, cost, admissions, class size, and wider opportunities."
        canonicalPath="/independent-vs-grammar-buckinghamshire"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-vs-independent">
          Independent School vs Buckinghamshire Grammar
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          An honest comparison of the two routes — academic outcomes, cost, class size, admissions, and the wider opportunity gap.
        </p>
      </div>


      <SeoPageProductLead />
      <h2 className="text-primary font-serif">The Short Answer</h2>
      <p>
        For an academically able child living within a Bucks grammar school's effective catchment, a Bucks grammar typically delivers academic outcomes comparable to a mid-tier independent school at no cost. Top-tier independents (the most academically selective day schools and the leading boarding schools) generally outperform on absolute attainment but the gap is narrower than headline league tables suggest.
      </p>
      <p>
        For families who don't live in catchment, who can comfortably afford fees, or who place high value on smaller class sizes and broader extra-curricular provision, an independent school may be the better fit. The choice is rarely binary on academic grounds alone.
      </p>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">Side-by-Side Comparison</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-comparison">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary"></th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Bucks Grammar</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Independent (Day)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Annual cost</td><td className="p-3">Free</td><td className="p-3">£18,000–£28,000</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Class size</td><td className="p-3">28–32 typical</td><td className="p-3">18–24 typical</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Admissions test</td><td className="p-3">Bucks 11+ (Sept Y6)</td><td className="p-3">11+/CE (Jan Y6)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Test selectivity</td><td className="p-3">~30% qualify</td><td className="p-3">Varies — top schools accept ~10–25%</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">A-level outcomes</td><td className="p-3">Strong: ~50–70% A/A* at top grammars</td><td className="p-3">Strong: ~55–80% A/A* at top day schools</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Oxbridge progression</td><td className="p-3">5–15% at top grammars</td><td className="p-3">10–25% at top independents</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Extra-curricular range</td><td className="p-3">Good but more limited budget</td><td className="p-3">Generally broader (esp. sport, music, arts)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-semibold text-slate-700">Pastoral resources</td><td className="p-3">Standard state provision</td><td className="p-3">Typically more individualised</td></tr>
            <tr><td className="p-3 font-semibold text-slate-700">Geographic flexibility</td><td className="p-3">Constrained by distance criterion</td><td className="p-3">Open to anyone who can pay &amp; pass entry</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">When Grammar Is the Better Choice</h2>
      <ul>
        <li>You live within a realistic distance of a Bucks grammar that consistently admits at your distance.</li>
        <li>Your child can comfortably qualify (consistent mock scores at 121+).</li>
        <li>You'd rather invest the £200,000+ that 7 years of independent fees would cost in something else (university support, property, family experience).</li>
        <li>You actively prefer the social mix and ethos of a state grammar.</li>
      </ul>

      <h2 className="text-primary font-serif">When Independent Is the Better Choice</h2>
      <ul>
        <li>You live too far from any Bucks grammar to be confident of a place even with a high score.</li>
        <li>Your child would benefit from smaller classes or stronger pastoral support.</li>
        <li>You value specific provision (a particular sport, music programme, faith ethos) that an independent offers.</li>
        <li>Fees are genuinely affordable — not a stretch that will create family stress for seven years.</li>
        <li>You want to avoid the binary risk of the 11+ (one-day, one-test) by spreading entry across multiple independent assessments.</li>
      </ul>

      <h2 className="text-primary font-serif">The Hybrid Approach</h2>
      <p>
        Many families pursue both routes in parallel — registering for the Bucks 11+ in May and applying to one or two independents alongside. Independent admissions tests typically run in November and January (well after Bucks results in October), so families can make the final decision once both outcomes are known. This is the most common strategy among families with affordable independent options in range.
      </p>
      <p>
        Two cautions on the hybrid approach: first, the practice burden is real — independent papers (CE-style) test some skills the GL Bucks paper doesn't, so children may need additional preparation. Second, accepting an independent place usually requires a deposit (~£1,000–£3,000) before Bucks results are known.
      </p>

      <h2 className="text-primary font-serif">If You Don't Get a Place at Either</h2>
      <p>
        Buckinghamshire's upper schools — the non-selective state secondaries — include some of the highest-performing comprehensive schools in England, partly because they sit alongside selective grammars. Outcomes at the strongest upper schools (e.g. The Cottesloe School, The Highcrest Academy, Beaconsfield Academy in some years) are competitive with mid-tier grammar provision.
      </p>
      <p>
        For more on what to do if your child does not qualify, see our <Link href="/learn/my-child-did-not-pass-the-bucks-11-plus" className="text-primary hover:underline">guide to next steps</Link>.
      </p>

      <ContentCTA heading="Going for grammar? Find out if your child's ready" subhead="An 8-minute check gives a practice score on the 121 scale across all four GL Assessment domains." ctaLabel="Check grammar readiness" />
      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

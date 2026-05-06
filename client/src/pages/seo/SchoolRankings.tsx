import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";

const breadcrumbItems = [
  { label: "Grammar Schools", href: "/bucks-grammar-schools" },
  { label: "Rankings & Outcomes" },
];

interface SchoolRanking {
  name: string;
  slug: string;
  type: string;
  notes: string;
}

const RANKINGS: SchoolRanking[] = [
  { name: "Royal Grammar School High Wycombe", slug: "royal-grammar-school-high-wycombe", type: "Boys", notes: "Consistently in the top 10 selective state schools nationally for A-level results. Frequently the highest-ranked Bucks grammar." },
  { name: "Dr Challoner's Grammar School", slug: "dr-challoners-grammar-school", type: "Boys", notes: "Strong A-level results and high Oxbridge progression rate. Among the most academically rigorous in the county." },
  { name: "Beaconsfield High School", slug: "beaconsfield-high-school", type: "Girls", notes: "High GCSE and A-level outcomes; particularly strong sixth-form performance." },
  { name: "Wycombe High School", slug: "wycombe-high-school", type: "Girls", notes: "Strong STEM and humanities outcomes; a long-standing record of competitive university destinations." },
  { name: "Sir William Borlase's Grammar School", slug: "sir-william-borlases-grammar-school", type: "Co-educational", notes: "Consistent top-tier A-level results; combines academic strength with a notable extra-curricular tradition." },
  { name: "Aylesbury Grammar School", slug: "aylesbury-grammar-school", type: "Boys", notes: "The largest boys' grammar in the county; broad academic profile with strong sciences." },
  { name: "Aylesbury High School", slug: "aylesbury-high-school", type: "Girls", notes: "Counterpart girls' grammar in Aylesbury; high pass rates and strong destinations." },
  { name: "Dr Challoner's High School", slug: "dr-challoners-high-school", type: "Girls", notes: "High academic performance with notable strength in Maths and Sciences." },
  { name: "Chesham Grammar School", slug: "chesham-grammar-school", type: "Co-educational", notes: "Co-educational grammar with consistently strong outcomes; smaller than the South Bucks schools." },
  { name: "Sir Henry Floyd Grammar School", slug: "sir-henry-floyd-grammar-school", type: "Co-educational", notes: "Co-educational grammar in Aylesbury with a balanced academic profile." },
  { name: "John Hampden Grammar School", slug: "john-hampden-grammar-school", type: "Boys", notes: "Third boys' grammar in High Wycombe; solid academic results in a less oversubscribed setting." },
  { name: "The Royal Latin School", slug: "the-royal-latin-school", type: "Co-educational", notes: "Serves the rural north of the county; academically strong with a wide catchment including out-of-county pupils." },
  { name: "Burnham Grammar School", slug: "burnham-grammar-school", type: "Co-educational", notes: "The only grammar in the south-west of the county; strong improvement trajectory in recent years." },
];

export default function SchoolRankings() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Buckinghamshire Grammar School Rankings & Academic Outcomes"
        description="Buckinghamshire grammar school rankings explained. Honest summary of academic outcomes across all 13 grammars — and why league-table position should not be the main factor in choice."
        canonicalPath="/bucks-grammar-school-rankings"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-rankings">
          Bucks Grammar School Rankings
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Honest summary of academic outcomes across the 13 grammars — and why league-table position is the wrong primary criterion.
        </p>
      </div>

      <h2 className="text-primary font-serif">A Word Before the Rankings</h2>
      <p>
        Every grammar school in Buckinghamshire would rank in the top 10–15% of state secondary schools nationally. The differences between them on any league table are real but small in practical terms. A child at any Bucks grammar can expect strong academic outcomes; the differences between them matter much less than the differences between grammars and the average national state secondary.
      </p>
      <p>
        We strongly caution against using a single league table position as the basis for a school choice. Distance, journey time, sibling links, school culture, single-sex vs co-educational preference, and the child's own personality all matter more than the difference between (say) #4 and #7 on the Sunday Times Parent Power list.
      </p>

      <h2 className="text-primary font-serif">All 13 Bucks Grammars at a Glance</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-rankings">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">School</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Type</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Outcomes Summary</th>
            </tr>
          </thead>
          <tbody>
            {RANKINGS.map((s) => (
              <tr key={s.slug} className="border-b border-slate-100">
                <td className="p-3 font-medium">
                  <Link href={`/grammar-schools/${s.slug}`} className="text-primary hover:underline" data-testid={`link-school-${s.slug}`}>
                    {s.name}
                  </Link>
                </td>
                <td className="p-3 text-slate-600">{s.type}</td>
                <td className="p-3 text-slate-600">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Where the Rankings Come From</h2>
      <p>The major published league tables for selective state schools include:</p>
      <ul>
        <li><strong>Sunday Times Parent Power</strong> — combines GCSE and A-level outcomes; updated annually.</li>
        <li><strong>Department for Education performance tables</strong> — official Progress 8 and Attainment 8 metrics, with caveats about how these apply to selective schools.</li>
        <li><strong>The Telegraph &amp; The Times school guides</strong> — broadly similar methodology to Sunday Times.</li>
      </ul>
      <p>
        Selective schools complicate league tables because Progress 8 (which measures progress from KS2 to GCSE) is artificially compressed at the top — children entering with very high KS2 scores have less room to "progress" on the metric. A grammar school showing modest Progress 8 may well be delivering excellent absolute outcomes.
      </p>

      <h2 className="text-primary font-serif">What Actually Matters in Choosing a School</h2>
      <ol>
        <li><strong>Distance &amp; commute.</strong> A 90-minute round trip every day for seven years has real consequences for sleep, homework, and family life. A "lower-ranked" school 15 minutes away often produces better outcomes than a "higher-ranked" school 45 minutes away.</li>
        <li><strong>School culture &amp; values.</strong> Visit on an open day. Some grammars are highly traditional; others are more progressive. The fit with your child's temperament matters.</li>
        <li><strong>Single-sex vs co-educational.</strong> A meaningful preference for many families. Bucks has options in both categories.</li>
        <li><strong>Sixth form &amp; post-16 outcomes.</strong> If university access matters most, the sixth-form record is the most relevant data point — not the GCSE league position.</li>
        <li><strong>Realistic chance of admission.</strong> A school 8 miles from your home is not a real choice if its catchment is 3 miles. Use the <Link href="/bucks-grammar-schools" className="text-primary hover:underline">grammar school directory</Link> to see typical admission distances.</li>
      </ol>

      <h2 className="text-primary font-serif">Per-School Detail</h2>
      <p>For full information on each school — admissions criteria, typical catchment, recent demand patterns, and contact details — see the individual school pages:</p>
      <div className="not-prose grid sm:grid-cols-2 gap-2 my-6">
        {RANKINGS.map((s) => (
          <Link key={s.slug} href={`/grammar-schools/${s.slug}`} className="text-sm text-primary hover:underline" data-testid={`link-detail-${s.slug}`}>
            → {s.name}
          </Link>
        ))}
      </div>

      <ContentCTA heading="Want to know if your child can compete?" subhead="An 8-minute check gives a practice score on the 121 scale across all four GL Assessment domains." ctaLabel="Check the score" />
      <Disclaimer />
    </div>
  );
}

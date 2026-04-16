import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Admissions Timeline" },
];

const timelineEvents = [
  { period: "Year 4 (Summer Term)", event: "Many families begin exploring the 11+ process and starting light preparation" },
  { period: "Year 5 (Autumn–Spring)", event: "Structured preparation typically begins — practising VR, NVR, Maths, and Comprehension under timed conditions" },
  { period: "May – June (Year 5)", event: "Online registration opens on the Buckinghamshire Council website" },
  { period: "June (Year 5)", event: "Registration deadline — parents must register their child for the test" },
  { period: "Summer Holidays", event: "Final preparation period — focus on speed, accuracy, and exam technique" },
  { period: "September (Year 6)", event: "The Secondary Transfer Test is sat, usually on a weekday in early-to-mid September" },
  { period: "Mid October (Year 6)", event: "Results are sent to parents by post with the child's standardised score" },
  { period: "October – End of October", event: "National closing date for secondary school applications via the common application form" },
  { period: "1 March (Year 6)", event: "National Offer Day — families receive their school allocation" },
  { period: "March onwards", event: "Appeals process available for children who did not receive a grammar school place" },
];

export default function Timeline() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Timeline (2026) – Registration Dates & Admissions Calendar"
        description="Complete Bucks 11 Plus admissions timeline: registration deadlines, test dates, results day, and National Offer Day. Plan your child's preparation with key 2026 dates."
        canonicalPath="/bucks-11-plus-timeline"
        schema={[
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-timeline">
          Bucks 11+ Admissions Timeline
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Key dates and deadlines for the Buckinghamshire Secondary Transfer Test — from registration through to National Offer Day.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">The Full Admissions Calendar</h2>
      <p>
        The Buckinghamshire 11+ process follows a fixed annual cycle. Understanding these dates is essential for planning
        your child's preparation and ensuring you don't miss critical registration deadlines.
      </p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-timeline">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">When</th>
              <th className="text-left p-3 font-semibold text-primary">What Happens</th>
            </tr>
          </thead>
          <tbody>
            {timelineEvents.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="p-3 font-medium whitespace-nowrap">{item.period}</td>
                <td className="p-3 text-slate-600">{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Registration</h2>
      <p>
        Registration for the Buckinghamshire Secondary Transfer Test typically opens in May and closes in June of Year 5.
        You must register your child through the <strong>Buckinghamshire Council website</strong> — this is separate from
        the secondary school application form which is submitted later.
      </p>
      <p>
        Key points about registration:
      </p>
      <ul>
        <li>Registration is required even if your child attends a Buckinghamshire primary school</li>
        <li>Children living outside Buckinghamshire can also register to sit the test</li>
        <li>Late registration may be accepted in exceptional circumstances, but this is not guaranteed</li>
        <li>You will receive confirmation of the test date and venue after registering</li>
      </ul>

      <h2 className="text-primary font-serif">Test Day</h2>
      <p>
        The test is usually held on a weekday in the first two weeks of September, at the start of Year 6.
        Children typically sit the test at a designated grammar school, not at their primary school.
        The test covers four papers: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension.
      </p>
      <p>
        For details on what the test contains, see
        the <Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">Secondary Transfer Test overview</Link>.
      </p>

      <h2 className="text-primary font-serif">Results & School Applications</h2>
      <p>
        Results are typically sent to parents in mid-October. You will receive your child's standardised score and
        whether they have achieved the <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">qualifying standard of 121</Link>.
      </p>
      <p>
        After receiving results, you submit your secondary school preferences via the common application form
        (managed by your home local authority). The national deadline for applications is 31 October.
        On 1 March, families receive their school allocation on National Offer Day.
      </p>

      <h2 className="text-primary font-serif">When Should Preparation Start?</h2>
      <p>
        Most families begin structured preparation during Year 5, though some start with light familiarisation
        activities in Year 4. The key is to build skills progressively rather than cramming in the final weeks.
      </p>
      <p>
        Our <Link href="/free-diagnostic" className="text-primary hover:underline">free readiness check</Link> takes
        just 8 minutes and gives you an immediate picture of where your child stands against the 121 benchmark —
        helping you plan the right preparation timeline.
      </p>
      <p>
        For a comprehensive overview of the entire process, see
        our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">Complete Buckinghamshire 11+ Guide</Link>.
      </p>

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

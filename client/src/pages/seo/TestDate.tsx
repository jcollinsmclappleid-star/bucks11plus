import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

interface YearData {
  testYear: number;
  cohortYear5: number;
  registrationOpens: string;
  registrationCloses: string;
  testDate: string;
  resultsRelease: string;
  applicationDeadline: string;
  offerDay: string;
}

const YEAR_DATA: Record<number, YearData> = {
  2026: {
    testYear: 2026,
    cohortYear5: 2025,
    registrationOpens: "Early May 2026",
    registrationCloses: "Late June 2026",
    testDate: "Saturday 12 September 2026 (provisional — confirmed by the Council in spring)",
    resultsRelease: "Mid-October 2026",
    applicationDeadline: "31 October 2026",
    offerDay: "1 March 2027",
  },
  2025: {
    testYear: 2025,
    cohortYear5: 2024,
    registrationOpens: "Early May 2025",
    registrationCloses: "27 June 2025",
    testDate: "Saturday 13 September 2025",
    resultsRelease: "Friday 10 October 2025",
    applicationDeadline: "31 October 2025",
    offerDay: "2 March 2026",
  },
};

export default function TestDate({ year }: { year: 2025 | 2026 }) {
  const data = YEAR_DATA[year];
  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: `Test Date ${year}` },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={`Bucks 11 Plus Test Date ${year} – When Is the Test & Key Deadlines`}
        description={`The official Bucks 11+ test date for ${year}, plus registration opens, registration deadline, results release date and the national application deadline.`}
        canonicalPath={`/bucks-11-plus-test-date-${year}`}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Event",
            name: `Buckinghamshire 11+ Secondary Transfer Test ${year}`,
            startDate: `${year}-09-12`,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "Place", name: "Buckinghamshire test centres", address: "Buckinghamshire, UK" },
            description: `Annual Buckinghamshire Secondary Transfer Test (the 11+) for children entering Year 7 in September ${year + 1}.`,
            organizer: { "@type": "Organization", name: "Buckinghamshire Council" },
          },
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-test-date-${year}`}>
          Bucks 11+ Test Date {year}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          When the test is sat, when registration opens and closes, and when results are released.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">When Is the Test?</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test for {year} is sat by children currently in <strong>Year 5 ({data.cohortYear5}–{data.cohortYear5 + 1})</strong> who will enter Year 7 in September {year + 1}. The test is administered in early September on a single day — typically a Saturday morning — at allocated test centres across the county.
      </p>

      <div className="not-prose my-8">
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
          <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-2">Test date</div>
          <div className="text-3xl font-bold text-primary font-serif" data-testid={`text-test-date-${year}`}>{data.testDate}</div>
        </div>
      </div>

      <h2 className="text-primary font-serif">Full {year} Timeline</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid={`table-timeline-${year}`}>
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Date</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Event</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">{data.registrationOpens}</td><td className="p-3">Registration opens on Buckinghamshire Council website</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">{data.registrationCloses}</td><td className="p-3">Registration deadline (no late entries guaranteed)</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">{data.testDate.split(" (")[0]}</td><td className="p-3">Children sit the Secondary Transfer Test</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">{data.resultsRelease}</td><td className="p-3">Standardised scores released to parents by letter and online</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium">{data.applicationDeadline}</td><td className="p-3">National secondary school application deadline (Common Application Form)</td></tr>
            <tr><td className="p-3 font-medium">{data.offerDay}</td><td className="p-3">National Offer Day — school places allocated</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">What Parents Should Do Now</h2>
      {year === 2026 ? (
        <ul>
          <li><strong>If your child is in Year 5 now (2025–26 academic year):</strong> register from May 2026 and aim to begin structured preparation no later than spring of Year 5 — the summer holiday is the highest-leverage period.</li>
          <li><strong>If your child is in Year 4 now:</strong> focus on reading volume, mental arithmetic and vocabulary breadth. Formal 11+ practice is generally too early but the underlying skills are not.</li>
          <li><strong>If your child is in Year 3 or earlier:</strong> read widely, talk about what they read, and let them solve everyday problems involving numbers and time. There's no need for formal 11+ material yet.</li>
        </ul>
      ) : (
        <ul>
          <li>The {year} test date has now passed. Results were released on {data.resultsRelease} and parents have until {data.applicationDeadline} to submit their secondary school application.</li>
          <li>If your child did not qualify, our <Link href="/learn/my-child-did-not-pass-the-bucks-11-plus" className="text-primary hover:underline">guide to next steps</Link> covers options including upper schools, year 9 entry routes, and the appeals process.</li>
        </ul>
      )}

      <h2 className="text-primary font-serif">Where Will My Child Sit the Test?</h2>
      <p>
        Buckinghamshire Council allocates each registered child to a test centre — usually a local secondary school or a primary school depending on numbers. The allocated centre is confirmed by letter in the weeks before the test. Centres are intended to minimise travel time but allocation is automatic; you cannot request a specific centre.
      </p>

      <h2 className="text-primary font-serif">Related Pages</h2>
      <ul>
        <li><Link href="/bucks-11-plus-registration" className="text-primary hover:underline">How to register for the Bucks 11+</Link></li>
        <li><Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Full Bucks 11+ admissions timeline</Link></li>
        <li><Link href="/when-do-bucks-11-plus-results-come-out" className="text-primary hover:underline">When do Bucks 11+ results come out?</Link></li>
        <li><Link href="/bucks-11-plus-test-day-checklist" className="text-primary hover:underline">Test day checklist</Link></li>
      </ul>

      <ChildExperienceCTA />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

import { Seo } from "../../components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "../../components/shared/Breadcrumbs";
import { ContentCTA } from "../../components/shared/ContentCTA";
import { Disclaimer } from "../../components/shared/Disclaimer";
import { Link } from "wouter";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "11+ Registration" },
];

export default function Registration() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Registration | How to Register for the Buckinghamshire 11+"
        description="Everything you need to know about registering for the Buckinghamshire 11+ test. Who can register, the process, key deadlines, and special arrangements."
        canonicalPath="/bucks-11-plus-registration"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Bucks 11 Plus Registration Guide",
            "description": "A complete guide to registering your child for the Buckinghamshire Secondary Transfer Test, including eligibility, deadlines, and special arrangements.",
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="heading-registration">
        Bucks 11 Plus Registration
      </h1>
      <p className="text-xl text-muted-foreground lead">
        A complete guide to registering your child for the Buckinghamshire Secondary Transfer Test.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">Who Can Register?</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test (commonly known as the 11+) is open to children who are in <strong>Year 5</strong> at the time of registration and will be entering <strong>Year 7</strong> the following September. This applies to:
      </p>
      <ul>
        <li><strong>Children living in Buckinghamshire</strong> who wish to be considered for a grammar school place.</li>
        <li><strong>Children living outside Buckinghamshire</strong> who wish to apply for a Buckinghamshire grammar school. Out-of-county applicants follow the same registration process.</li>
        <li><strong>Children in state or independent schools</strong> — there is no restriction based on the type of school your child currently attends.</li>
      </ul>
      <p>
        Your child does not need to be attending a Buckinghamshire school to sit the test. Families from neighbouring counties such as Oxfordshire, Hertfordshire, and Berkshire regularly register their children.
      </p>

      <h2 className="text-primary font-serif">The Registration Process</h2>
      <p>
        Registration is managed by <strong>Buckinghamshire Council</strong> and is completed online. The key steps are:
      </p>
      <ol>
        <li>
          <strong>Visit the Buckinghamshire Council website</strong> during the registration window (typically opening in May/June of Year 5).
        </li>
        <li>
          <strong>Complete the online registration form</strong> with your child's details, including their current school, date of birth, and your address.
        </li>
        <li>
          <strong>Receive confirmation</strong> of your registration and your child's test centre allocation. Test centres are typically local schools.
        </li>
        <li>
          <strong>Attend the test</strong> in September of Year 6. You will receive specific date, time, and location details before the test.
        </li>
        <li>
          <strong>Receive results</strong> — standardised scores are typically released in October, before the secondary school application deadline.
        </li>
      </ol>

      <h2 className="text-primary font-serif">Key Deadlines</h2>
      <p>
        Deadlines can vary slightly from year to year, but the typical timeline is:
      </p>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-registration-deadlines">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Date (Approx.)</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Event</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">May – June</td>
              <td className="p-3">Registration opens on the Buckinghamshire Council website</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Late June</td>
              <td className="p-3">Registration deadline (exact date published annually)</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Early September</td>
              <td className="p-3">Test date — children sit the Secondary Transfer Test</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">Mid October</td>
              <td className="p-3">Results released to parents</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-3 font-medium">31 October</td>
              <td className="p-3">National secondary school application deadline</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">1 March</td>
              <td className="p-3">National offer day — school places allocated</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Important:</strong> Late registrations may be accepted in some circumstances, but this is not guaranteed. It is strongly recommended to register as soon as the window opens. For the full admissions timeline, see our <Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">timeline guide</Link>.
      </p>

      <h2 className="text-primary font-serif">Special Arrangements</h2>
      <p>
        If your child has a diagnosed special educational need, disability, or medical condition that may affect their performance in the test, you can apply for <strong>special arrangements</strong>. These may include:
      </p>
      <ul>
        <li><strong>Extra time</strong> — typically 25% additional time for children with documented processing difficulties.</li>
        <li><strong>A separate room</strong> — for children who require a quieter environment.</li>
        <li><strong>A reader or scribe</strong> — in certain circumstances where a child has a specific learning difficulty.</li>
        <li><strong>Modified papers</strong> — such as enlarged print for children with visual impairments.</li>
      </ul>
      <p>
        Applications for special arrangements must be submitted <strong>at the time of registration</strong> and are supported by evidence from your child's school or an educational psychologist. Buckinghamshire Council reviews each application individually.
      </p>

      <h2 className="text-primary font-serif">What Happens After Registration?</h2>
      <p>
        Once registered, your focus should shift to ensuring your child is as well-prepared as possible for the September test. The period between registration and the test date is typically 8–12 weeks — enough time for focused, targeted preparation but not enough for building foundational skills from scratch.
      </p>
      <p>
        This is why we recommend beginning preparation well before the registration window opens. Our <Link href="/how-to-pass-bucks-11-plus" className="text-primary hover:underline">preparation guide</Link> outlines when to start and how to structure your approach.
      </p>
      <p>
        To understand exactly where your child currently stands, take our <Link href="/free-diagnostic" className="text-primary hover:underline">free 12-minute diagnostic</Link>. It measures accuracy and pacing across all three domains and provides a realistic forecast against the 121 qualifying benchmark.
      </p>

      <ContentCTA />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline" data-testid="link-pillar-guide">The Complete Buckinghamshire 11+ Guide</Link>
          </li>
          <li>
            <Link href="/bucks-11-plus-timeline" className="text-primary hover:underline" data-testid="link-timeline">Full Admissions Timeline</Link>
          </li>
          <li>
            <Link href="/how-to-pass-bucks-11-plus" className="text-primary hover:underline" data-testid="link-how-to-pass">How to Pass the Bucks 11+</Link>
          </li>
          <li>
            <Link href="/bucks-grammar-schools" className="text-primary hover:underline" data-testid="link-grammar-schools">Buckinghamshire Grammar Schools Directory</Link>
          </li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}
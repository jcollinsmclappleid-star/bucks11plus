import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Year 6 Final Weeks Revision" },
];

const days = [
  { day: "Mon", maths: "10 min mental arithmetic + 1 word problem set (15 min)", verbal: "5 cloze + 5 synonyms (10 min)", reading: "20 min silent reading" },
  { day: "Tue", maths: "Targeted weak topic (20 min)", verbal: "Shuffled sentences set (15 min)", reading: "15 min reading aloud" },
  { day: "Wed", maths: "10 min mental arithmetic", verbal: "NVR matrices set (15 min)", reading: "Inference discussion (15 min)" },
  { day: "Thu", maths: "Mixed topic set (20 min)", verbal: "5 antonyms + 5 letter codes (10 min)", reading: "20 min silent reading" },
  { day: "Fri", maths: "Speed drill — 20 questions in 12 min", verbal: "NVR rotation/reflection (15 min)", reading: "15 min reading aloud" },
  { day: "Sat", maths: "Full timed Maths section (50 min)", verbal: "Full timed VR section (50 min)", reading: "Free reading (no quota)" },
  { day: "Sun", maths: "Rest day", verbal: "Rest day", reading: "Free reading (no quota)" },
];

export default function Year6Revision() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Bucks 11+ Final Weeks Revision Timetable (Year 6, August–September)"
        description="A focused 4-week revision timetable for the final stretch before the Bucks 11+ in early September. Daily structure, weekend mocks, and what to drop."
        canonicalPath="/bucks-11-plus-year-6-revision-timetable"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-revision">
          Year 6 Final Weeks Revision Timetable
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A focused 4-week schedule for August through early September — the final stretch before the Bucks 11+.
        </p>
      </div>


      <SeoPageProductLead />
      <h2 className="text-primary font-serif">The Goal of the Final Weeks</h2>
      <p>
        By August of Year 6, the time for building new skills has largely passed. The final four weeks should focus on three things only:
      </p>
      <ol>
        <li><strong>Consolidation</strong> — locking in the question-type techniques the child already knows.</li>
        <li><strong>Pacing</strong> — practising at exam speed so the test itself feels routine.</li>
        <li><strong>Confidence</strong> — minimising new material so the child arrives feeling competent rather than overwhelmed.</li>
      </ol>
      <p>
        Anything beyond this — new topics, new question types, last-minute panicked tutoring — usually erodes confidence rather than building it.
      </p>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">Weekly Schedule</h2>
      <p>This pattern repeats for the four weeks leading to the test, with the Saturday session alternating between full timed sections (weeks 1 and 3) and shorter consolidation sets (weeks 2 and 4).</p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-xs border border-slate-200 rounded-lg" data-testid="table-revision">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-2 border-b border-slate-200 font-semibold text-primary">Day</th>
              <th className="text-left p-2 border-b border-slate-200 font-semibold text-primary">Maths</th>
              <th className="text-left p-2 border-b border-slate-200 font-semibold text-primary">VR / NVR</th>
              <th className="text-left p-2 border-b border-slate-200 font-semibold text-primary">Reading</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.day} className="border-b border-slate-100">
                <td className="p-2 font-bold text-primary">{d.day}</td>
                <td className="p-2 text-slate-600">{d.maths}</td>
                <td className="p-2 text-slate-600">{d.verbal}</td>
                <td className="p-2 text-slate-600">{d.reading}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">The Final 7 Days</h2>
      <p>The week before the test should look quite different from the rest:</p>
      <ul>
        <li><strong>Days 7–4 before:</strong> One short session per day (30 minutes max), focused on confidence-building rather than new learning.</li>
        <li><strong>Days 3–2 before:</strong> No timed papers. Light, varied review. Reading time is uncapped.</li>
        <li><strong>Day before:</strong> No 11+ work at all. Pack the bag, lay out the uniform, get an early night. Resist the urge for "one last paper" — it raises anxiety and forecasts nothing useful.</li>
      </ul>

      <h2 className="text-primary font-serif">Test Day</h2>
      <p>
        On the morning of the test, the priorities are sleep, breakfast, and a calm arrival. See our <Link href="/bucks-11-plus-test-day-checklist" className="text-primary hover:underline">test day checklist</Link> for what to bring and how to time the morning.
      </p>

      <h2 className="text-primary font-serif">What to Stop Doing in the Final Weeks</h2>
      <ul>
        <li><strong>Stop introducing new question types.</strong> If the child has not seen cube nets by August, the marginal time on cube nets is better spent reinforcing strong areas.</li>
        <li><strong>Stop comparing scores to other children.</strong> Standardised scores are individual; the only useful comparison is the child's own trajectory.</li>
        <li><strong>Stop over-testing.</strong> Two timed sections per week is plenty. Daily mocks produce fatigue, not improvement.</li>
        <li><strong>Stop talking about consequences.</strong> The test is hard enough without the weight of "what happens if you don't pass". Children who feel relaxed perform measurably better.</li>
      </ul>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <ContentCTA heading="Revising? Make sure it's the right things" subhead="An 8-minute check identifies which sections to focus revision on first." ctaLabel="Find the focus" />      <SeoContentAd variant="cta" />

      <Disclaimer />
    </div>
  );
}

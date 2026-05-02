import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Year 5 Summer Plan" },
];

const weeks = [
  { week: 1, focus: "Diagnostic + reset", detail: "Sit a full timed mock to establish baseline and identify the two weakest sections. Take a complete week off any 11+ practice — children need decompression after Year 5." },
  { week: 2, focus: "Vocabulary intensive", detail: "30 minutes daily on synonym/antonym practice + one chapter of fiction reading. Aim for 100 new words logged in a notebook this week." },
  { week: 3, focus: "Maths foundations", detail: "Mental arithmetic 10 minutes daily; targeted practice on the 2–3 weakest topics from the diagnostic (often: fractions, time, percentages)." },
  { week: 4, focus: "Verbal Reasoning techniques", detail: "Cover all eight major VR question types — 20 questions per type over the week. Time each set." },
  { week: 5, focus: "Non-Verbal Reasoning techniques", detail: "Same approach for NVR: matrices, series, rotation/reflection, cube nets, odd-one-out, analogies, complete-the-square. Use physical shapes for spatial work." },
  { week: 6, focus: "Comprehension breadth", detail: "Read one short passage daily from varied genres (fiction, news, history). Discuss inference and vocabulary in context — talking matters more than written answers at this stage." },
  { week: 7, focus: "First timed mock", detail: "Sit a complete mock test under exam conditions. Review every error in detail with the child — this is where the learning happens." },
  { week: 8, focus: "Targeted gap-fill", detail: "Focus the entire week on the weakest section identified in the mock. Quality over quantity: one topic per day, mastered." },
  { week: 9, focus: "Speed work", detail: "Short, sharp drills: 10 questions in 5 minutes. The aim is automaticity on common question types so the real test feels familiar." },
  { week: 10, focus: "Final mock", detail: "Sit the second timed mock. Compare to mock 1 — improvement of 5–8 standardised points is realistic between week 7 and week 10 if the gap-fill work was done well." },
];

export default function Year5SummerPlan() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Year 5 Summer Plan – 10-Week Bucks 11+ Preparation Schedule"
        description="A realistic 10-week summer plan for Year 5 children preparing for the Bucks 11+. Week-by-week schedule covering all four sections, with mock tests built in."
        canonicalPath="/bucks-11-plus-year-5-summer-plan"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-summer-plan">
          Year 5 Summer Plan
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A realistic 10-week schedule for the summer between Year 5 and Year 6 — the highest-leverage period in 11+ preparation.
        </p>
      </div>

      <h2 className="text-primary font-serif">Why This Summer Matters Most</h2>
      <p>
        The summer between Year 5 and Year 6 is the single most productive period of 11+ preparation. The reasons are practical: there's no school workload competing for attention, holidays create predictable daily slots, and the test sits just six to eight weeks into Year 6. Families that use this summer well can typically lift a child by 8–15 standardised points; families that don't usually find the September pressure compresses everything that didn't get done.
      </p>
      <p>
        This plan assumes around <strong>60–90 minutes of focused work, 4–5 days a week</strong>. More than that produces diminishing returns at this age; less than that won't move the needle.
      </p>

      <h2 className="text-primary font-serif">The 10-Week Schedule</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border border-slate-200 rounded-lg" data-testid="table-summer-plan">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary w-16">Week</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">Focus</th>
              <th className="text-left p-3 border-b border-slate-200 font-semibold text-primary">What to do</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.week} className="border-b border-slate-100">
                <td className="p-3 font-bold text-primary">{w.week}</td>
                <td className="p-3 font-medium">{w.focus}</td>
                <td className="p-3 text-slate-600">{w.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Daily Structure</h2>
      <p>A typical productive day in this plan looks like:</p>
      <ul>
        <li><strong>15 min</strong> — Mental arithmetic warm-up (number bonds, times tables, quick calculation drills)</li>
        <li><strong>30 min</strong> — Focus topic of the day (one question type or one weak area)</li>
        <li><strong>15 min</strong> — Reading aloud or silently from a varied book (fiction one day, non-fiction the next)</li>
        <li><strong>10 min</strong> — Brief discussion: what was hard, what was easy, what to try tomorrow</li>
      </ul>

      <h2 className="text-primary font-serif">What Not to Do</h2>
      <ul>
        <li><strong>Don't skip mock tests.</strong> They're tiring but they're the only realistic forecast you have. Two timed mocks in 10 weeks is the minimum.</li>
        <li><strong>Don't drill the strong sections.</strong> Improvement comes from raising the weakest section, not from polishing what's already at 90%.</li>
        <li><strong>Don't hide errors.</strong> A child who is told their answers were "good" when half were wrong cannot improve. Honest, calm review is essential.</li>
        <li><strong>Don't work seven days a week.</strong> Two days off completely is non-negotiable. Burnout in week 6 wastes weeks 7–10.</li>
      </ul>

      <h2 className="text-primary font-serif">Built for This Plan</h2>
      <p>
        Our platform is designed around exactly this 10-week structure. The <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute diagnostic</Link> gives the baseline; the full platform provides timed practice across every question type with automatic gap analysis after each session.
      </p>

      <ChildExperienceCTA />
      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

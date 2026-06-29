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
  { label: "Test Day Checklist" },
];

const faqItems = [
  {
    question: "What time should we arrive at the test centre?",
    answer: "Arrive at least 20–30 minutes before the official start time. Buckinghamshire grammar schools usually ask families to arrive between 8:30 and 8:45 for a 9:00 start. Arriving early gives your child time to settle, find the toilets, and adjust to the unfamiliar environment without feeling rushed.",
  },
  {
    question: "What does my child actually need to bring?",
    answer: "The official test confirmation letter, two HB pencils (sharp), an eraser, a pencil sharpener, and a small bottle of water. Calculators are not permitted. Most schools provide pencils as a backup, but bringing your own avoids any awkward last-minute borrowing. No watches that beep, no electronic devices, no toys.",
  },
  {
    question: "Should my child eat a big breakfast before the test?",
    answer: "A normal breakfast — not a huge or unusual one. The morning of the test is not the time to introduce new foods or skip familiar routines. Slow-release carbohydrates (porridge, wholemeal toast) plus a little protein work well. Avoid sugary cereals which can cause a mid-test energy crash.",
  },
  {
    question: "What if my child is unwell on test day?",
    answer: "Contact Buckinghamshire Council immediately. There is a formal process for absence on test day — children who miss the test due to documented illness can usually sit a designated catch-up date the following weekend. Do not send a clearly unwell child to sit the test in the hope they will manage; the standardisation process does not adjust for illness.",
  },
  {
    question: "Should I revise with my child the night before?",
    answer: "No. The evening before the test should be calm and unremarkable — a normal dinner, a relaxed activity, an early bedtime. Last-minute revision raises anxiety without adding meaningful skill. The work has either been done or not done; the night before is for rest.",
  },
];

const checklistBring = [
  "Official test confirmation letter (with test centre name and start time)",
  "Two HB pencils, sharpened",
  "An eraser",
  "A small pencil sharpener",
  "A small bottle of water (clear plastic, no sugary drinks)",
  "A jumper or cardigan (test halls vary in temperature)",
  "Tissues (in case of a mid-test sneeze or runny nose)",
  "A small healthy snack for the break (fruit, plain biscuit)",
];

const checklistAvoid = [
  "Mobile phones, smart watches, or any electronic device",
  "Calculators (not permitted in any section)",
  "Sugary breakfasts that may cause an energy crash",
  "New shoes or new clothes that haven't been worn before",
  "Last-minute cramming or quizzing in the car",
  "Detailed conversations about what happens if they don't pass",
];

export default function TestDayChecklist() {
  return (
    <div className={`container mx-auto max-w-6xl px-4 py-16 ${SEO_GUIDE_PROSE}`}>
      <Seo
        title="Bucks 11 Plus Test Day Checklist (2026) – What to Bring & How to Prepare"
        description="A practical Bucks 11+ test day checklist: what to bring, what to wear, what to eat, and how to keep the morning calm. Plus the night-before routine that helps your child do their best."
        canonicalPath="/bucks-11-plus-test-day-checklist"
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-test-day">
          Bucks 11+ Test Day Checklist
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A simple, practical guide to test day — what to bring, what to wear, what to eat, and how to keep the morning calm so your child arrives ready to do their best work.
        </p>
      </div>


      <SeoPageProductLead />

      <h2 className="text-primary font-serif">What to Bring</h2>
      <p>
        The Bucks 11+ has a strict equipment policy. Bringing the right things — and only the right things — saves last-minute stress at the door.
      </p>
      <div className="not-prose my-6 grid sm:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <h3 className="text-base font-bold text-emerald-800 mb-3">Bring</h3>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {checklistBring.map((item, i) => <li key={i} className="flex gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span>{item}</li>)}
          </ul>
        </div>
        <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-base font-bold text-red-800 mb-3">Leave at Home</h3>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {checklistAvoid.map((item, i) => <li key={i} className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✕</span>{item}</li>)}
          </ul>
        </div>
      </div>

      <SeoContentAd variant="dashboard" />

      <h2 className="text-primary font-serif">What to Wear</h2>
      <p>
        Comfort over appearance. Children sit in unfamiliar test halls for several hours and small physical discomforts are unhelpful distractions. Choose:
      </p>
      <ul>
        <li>School uniform if your primary school uniform is comfortable and familiar — many parents prefer this for the sense of normality</li>
        <li>Soft, layered clothing — a jumper that can be removed if the room is warm</li>
        <li>Shoes the child has worn many times — never new shoes</li>
        <li>Avoid hoodies (some test centres consider hood-up wearing inappropriate)</li>
        <li>Avoid clothing with messages or distracting designs</li>
      </ul>

      <h2 className="text-primary font-serif">The Night Before</h2>
      <p>
        Keep the evening calm and ordinary. The single most important predictor of how a child performs on test day is how well they slept. Aim for:
      </p>
      <ul>
        <li>A familiar dinner — not the time for a celebratory takeaway or anything new</li>
        <li>A bath, a story, or a quiet activity in the hour before bed</li>
        <li>No screens in the final 30 minutes before sleep</li>
        <li>Bedtime 30–60 minutes earlier than usual to allow for nervous wakefulness</li>
        <li>Pack the test bag together so your child sees everything is ready</li>
      </ul>
      <p>
        Do <strong>not</strong> revise on the night before. Do not run last-minute drills. Do not have lengthy conversations about what will happen if they pass or don't pass. The work has either been done or not — the night before is for rest, not for cramming.
      </p>

      <h2 className="text-primary font-serif">The Morning of the Test</h2>
      <p>
        Wake your child 15 minutes earlier than normal so the morning isn't rushed. The order of the morning matters:
      </p>
      <ol>
        <li><strong>Use the toilet immediately</strong> — many children become anxious about toilets in unfamiliar buildings</li>
        <li><strong>Eat a normal breakfast</strong> — porridge, wholemeal toast, eggs, fruit. Avoid sugary cereals that cause mid-test slumps</li>
        <li><strong>Drink water but not a large amount</strong> — a full bladder is unhelpful in a 45-minute paper</li>
        <li><strong>Set off in good time</strong> — aim to arrive 20–30 minutes before the official start</li>
        <li><strong>Talk about something other than the test</strong> in the car — the weekend ahead, what's for dinner, anything ordinary</li>
      </ol>

      <h2 className="text-primary font-serif">Advice for Your Child During the Test</h2>
      <p>
        These are the small habits that separate strong test-day performances from frustrating ones. Read these with your child a few days in advance — not on the morning itself:
      </p>
      <ul>
        <li><strong>Read the instructions twice</strong> at the start of each section. Misreading instructions is the most common avoidable error.</li>
        <li><strong>Don't get stuck.</strong> If a question takes more than 60 seconds and the answer isn't clear, mark a best guess, circle the question number, and come back if there's time.</li>
        <li><strong>Always answer.</strong> Unanswered questions score zero. A guess has at least a 1-in-5 chance.</li>
        <li><strong>Watch the clock.</strong> Most papers have a clock visible at the front. Note how many questions you should have completed at the halfway point.</li>
        <li><strong>If you finish early</strong>, go back and check answers. Most children find at least one error on review.</li>
      </ul>

      <h2 className="text-primary font-serif">After the Test</h2>
      <p>
        Don't ask your child detailed questions about how it went or which questions they found difficult. Most children remember only the questions they struggled with, not the many they answered correctly — leading to a falsely negative impression. A simple "well done, that's it now" and a normal afternoon is better than a 30-minute post-mortem.
      </p>
      <p>
        Results arrive by post in mid-October. There is nothing to do in the meantime except let your child enjoy the fact that the test is behind them. See our <a href="/bucks-11-plus-results" className="text-primary hover:underline">results day guide</a> for what to expect when the letter arrives.
      </p>

      <h2 className="text-primary font-serif">A Calm Test Day Schedule</h2>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-test-day-schedule">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Time</th>
              <th className="text-left p-3 font-semibold text-primary">What's Happening</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">7:00 AM</td><td className="p-3 text-slate-600">Wake up calmly, light curtains, gentle music if helpful</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">7:15 AM</td><td className="p-3 text-slate-600">Toilet, then a normal breakfast — porridge or toast plus fruit</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">8:00 AM</td><td className="p-3 text-slate-600">Get dressed, double-check the test bag together</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">8:15 AM</td><td className="p-3 text-slate-600">Leave the house — talk about ordinary things</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">8:35 AM</td><td className="p-3 text-slate-600">Arrive at test centre, find toilets, settle</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">9:00 AM</td><td className="p-3 text-slate-600">Test begins</td></tr>
            <tr className="border-b border-slate-100"><td className="p-3 font-medium whitespace-nowrap">~12:00 PM</td><td className="p-3 text-slate-600">Test ends, collect your child, drive home — do not discuss the questions</td></tr>
          </tbody>
        </table>
      </div>

      <SeoContentAd variant="suite" />
      <GuideConversionBlock className="my-10" hideQuestions />

      <ChildExperienceCTA />
      <ContentCTA heading="Test-day-ready? Get the actual answer" subhead="An 8-minute check gives an indicative readiness score against 121 so you walk in knowing where they stand." ctaLabel="Check readiness" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">The Secondary Transfer Test Explained</Link></li>
          <li><Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Full Admissions Timeline</Link></li>
          <li><a href="/bucks-11-plus-results" className="text-primary hover:underline">Results Day — What to Expect</a></li>
          <li><Link href="/learn/what-happens-on-bucks-11-plus-test-day" className="text-primary hover:underline">What Happens on Test Day</Link></li>
        </ul>
      </div>      <SeoContentAd variant="cta" />


      <Disclaimer />
    </div>
  );
}

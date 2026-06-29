import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import NotFound from "@/pages/not-found";
import { SeoPageProductLead } from "@/components/shared/SeoPageProductLead";
import { SeoContentAd } from "@/components/shared/SeoContentAd";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";
import { SEO_GUIDE_PROSE } from "@/lib/seoGuideProse";

interface YearGroupContent {
  year: 4 | 5 | 6;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
  checklist: string[];
}

const yearContent: Record<number, YearGroupContent> = {
  4: {
    year: 4,
    title: "Preparing for the Bucks 11+ in Year 4",
    metaTitle: "Preparing for the Bucks 11+ in Year 4 – How to Start | Bucks 11 Plus Tests",
    metaDescription: "When and how to start 11+ preparation in Year 4. What Buckinghamshire parents can do now to give their Year 4 child the best foundation for the Secondary Transfer Test.",
    intro: "Year 4 is the earliest point at which most Buckinghamshire families begin thinking seriously about the 11+. The Secondary Transfer Test is still two years away — but the decisions and foundations built in Year 4 often shape how well a child is placed when they finally sit in September of Year 6.",
    sections: [
      {
        heading: "Is Year 4 Too Early to Start?",
        body: "No — but it is early enough that frantic preparation would be counterproductive. Year 4 is the right time for foundations, not intensive drilling. Children who start by building familiarity with test-style thinking, reading widely, and developing mathematical fluency are better served than those who attempt to complete practice paper after practice paper at age 8 or 9. The goal in Year 4 is to understand the landscape, identify any early indicators of areas to develop, and establish habits that make Year 5 preparation more targeted and effective.",
      },
      {
        heading: "What the Bucks 11+ Tests — and Why Year 4 Matters",
        body: "The Buckinghamshire Secondary Transfer Test, produced by GL Assessment, covers four domains: verbal reasoning, non-verbal reasoning (including spatial reasoning), mathematical reasoning, and English comprehension. None of these are explicitly taught in primary school — they require specific familiarisation with question types that are outside the standard curriculum. Year 4 is when children first encounter the more abstract reasoning and problem-solving skills that underpin strong performance in these areas. Building reading habits, number fluency, and logical thinking at this stage lays the groundwork for focused test preparation in Year 5.",
      },
      {
        heading: "What to Focus on in Year 4",
        body: "Reading is the single highest-return activity in Year 4. Strong comprehension and vocabulary skills underpin both the verbal reasoning and English comprehension domains of the 11+ test. Encourage varied reading — fiction, non-fiction, quality newspapers — and occasionally discuss vocabulary from what your child reads. On the mathematics side, number fluency is key: times tables, mental arithmetic, and confidence with fractions all pay dividends later. Non-verbal reasoning and spatial thinking can be developed through puzzles, building activities, and pattern recognition games. The goal is development, not drilling.",
      },
      {
        heading: "When Should Formal Preparation Begin?",
        body: "Most Buckinghamshire families begin structured, test-focused preparation in Year 5 — typically in the autumn or spring term. Some start a term earlier (late Year 4), particularly if a readiness check reveals specific gaps that need longer to address. Starting too early with formal practice papers can lead to burnout and boredom; starting at the right time with a clear picture of where to focus is far more effective. A readiness check at the start of Year 5 is the natural entry point for structured preparation.",
      },
      {
        heading: "Understanding the Registration Timeline",
        body: "One critical Year 4 task is understanding the admissions timeline so nothing is missed. Registration for the Secondary Transfer Test opens in the spring term of Year 5 and closes in June of Year 5. If you are planning ahead in Year 4, note this deadline now. Missing it means missing the test — there is very limited provision for late registration. Mark it in your calendar before Year 5 begins.",
      },
    ],
    faq: [
      {
        question: "Should I buy practice papers for my Year 4 child?",
        answer: "Not yet, for most children. Year 4 is better spent on broad foundations — reading widely, building number fluency, doing puzzles. Bucks 11+ practice papers are most effectively used in Year 5 once your child is ready to work on timed test conditions. Starting practice papers in Year 4 often reduces their effectiveness later, as children become familiar with specific papers rather than developing underlying skills.",
      },
      {
        question: "Should I start tutoring in Year 4?",
        answer: "Tutoring in Year 4 is not typically necessary unless a specific gap has been identified. Many families use Year 4 to observe their child's progress through school, then bring in structured support (tutoring or a digital platform) in Year 5 based on a clearer picture of where help is needed. Starting tutoring in Year 4 without a clear focus often results in it continuing for longer and costing more than necessary.",
      },
      {
        question: "My child is in Year 4 and already doing practice papers — is that okay?",
        answer: "If your child is engaged and enjoying them, it is unlikely to cause harm. The risk is familiarity fatigue — children who have completed many practice papers by early Year 5 may find it harder to sustain motivation through the more intensive preparation period that typically runs through Year 5. If you are using papers, focus on working through them together and discussing the reasoning rather than drilling for speed.",
      },
    ],
    checklist: [
      "Understand the Bucks 11+ test format (four domains, GL Assessment, 121 qualifying score)",
      "Note the Year 5 registration deadline — typically June",
      "Encourage daily reading of varied material",
      "Ensure times tables are solid by end of Year 4",
      "Explore puzzles, logic games, and pattern recognition activities",
      "Avoid intense practice paper drilling — save that for Year 5",
      "Consider a baseline readiness check in early Year 5 to establish a clear starting point",
    ],
  },
  5: {
    year: 5,
    title: "Preparing for the Bucks 11+ in Year 5",
    metaTitle: "Preparing for the Bucks 11+ in Year 5 – The Essential Guide | Bucks 11 Plus Tests",
    metaDescription: "Year 5 is the most important preparation year for the Buckinghamshire 11+. Everything parents need to know: when to start, how to structure practice, and what to prioritise.",
    intro: "Year 5 is the central year of Buckinghamshire 11+ preparation. The Secondary Transfer Test is sat in September of Year 6, making Year 5 the primary window for structured, purposeful preparation. The decisions made — and the habits built — during Year 5 have more impact on the final result than anything else.",
    sections: [
      {
        heading: "Why Year 5 Is the Critical Year",
        body: "The Buckinghamshire Secondary Transfer Test is sat in September of Year 6 — which is, in practice, just a few weeks after the summer holidays following Year 5. This means that Year 5, including the summer break before Year 6, is the primary preparation window. Families who approach Year 5 with a clear plan and a readiness check starting point are far better positioned than those who start later or prepare without understanding where their child's specific gaps lie.",
      },
      {
        heading: "Start With a Readiness Check",
        body: "The most effective Year 5 preparation starts not with a workbook or practice paper, but with a readiness check. Understanding where your child currently performs across the four test domains — verbal reasoning, non-verbal reasoning, mathematics, and comprehension — tells you where to focus your preparation time. A child who is strong in maths but weaker in verbal reasoning needs a very different preparation plan from one who reads widely but struggles with spatial reasoning. Blanketing all areas equally wastes preparation time that could be concentrated where it has the most impact.",
      },
      {
        heading: "The Registration Deadline: Do Not Miss It",
        body: "Registration for the Secondary Transfer Test opens in the spring term of Year 5 and closes in June of Year 5. This is the single most important administrative task in Year 5. Missing the deadline means your child cannot sit the test — and there are very limited provisions for late registration. In-county children at Buckinghamshire state primary schools are typically registered automatically through their school, but parents should confirm this directly with the school rather than assuming. Out-of-county and independent school children must register directly with Buckinghamshire Council.",
      },
      {
        heading: "Structuring Year 5 Preparation",
        body: "Effective Year 5 preparation typically follows a staged approach. In the autumn and spring terms, the focus should be on identifying gaps and building skills: working through domain-specific practice, addressing weak areas, and developing familiarity with the question types used in the Secondary Transfer Test. In the summer term and through the summer holidays, the focus shifts to full mock papers under timed conditions, reviewing performance by domain, and building pace and confidence. The two 45-minute papers should feel familiar — not startling — by September.",
      },
      {
        heading: "The Audio Format: Often Overlooked",
        body: "One of the most distinctive features of the Buckinghamshire Secondary Transfer Test is that all instructions are delivered via audio recording. A recorded voice tells children when to start each section, how many questions it contains, and when to stop. The voice will not repeat itself, will not pause, and cannot be asked questions. Children who encounter this format for the first time on test day find it unexpectedly pressuring. Practising with audio-led mock tests in Year 5 and early Year 6 builds the specific familiarity needed to work confidently under these conditions.",
      },
      {
        heading: "How Much Preparation Is Enough?",
        body: "There is no single correct answer, but most families who support their children through structured preparation allocate 2–4 sessions per week of 30–45 minutes each during term time, with more intensive sessions in the summer holidays. Quality and focus matter more than total hours — a 30-minute session on a specific weakness identified through a readiness check is more valuable than an hour of generalised practice. Children who are overtired or anxious perform worse on test day regardless of preparation volume.",
      },
    ],
    faq: [
      {
        question: "My child is in Year 5 and hasn't started preparing yet — is it too late?",
        answer: "No. Many children begin structured preparation in the spring term of Year 5, or even in the summer term, and achieve strong results. What matters is the quality and targeting of the preparation, not simply when it begins. Starting with a readiness check tells you immediately where to focus, allowing even a shorter preparation window to be used effectively.",
      },
      {
        question: "Should we use a tutor, practice papers, or an online platform?",
        answer: "Many families use a combination. Online diagnostic platforms establish a clear baseline and identify specific gaps; tutors can then focus their sessions on precisely those areas rather than covering everything broadly. Practice papers under timed conditions are important in the final months before the test. The best approach for your child depends on how they learn, what gaps they have, and how much independent work they can sustain.",
      },
      {
        question: "What score does my child need to pass?",
        answer: "The qualifying threshold is a standardised score of 121. This score is age-adjusted — it accounts for your child's exact date of birth relative to the cohort — meaning a child born in August is not inherently disadvantaged. Achieving 121 qualifies a child for grammar school consideration; the score does not determine which school they attend, as places at specific schools are then allocated by oversubscription criteria (primarily distance).",
      },
      {
        question: "How important is the summer holiday before Year 6?",
        answer: "Very important. The test is sat in the first weeks of September — just after the summer holidays. Most families maintain 3–5 practice sessions per week throughout the summer, focusing on mock papers under timed conditions. Children who stop all preparation during the summer and return to it in September tend to lose sharpness. Keeping preparation consistent (but not exhausting) through the summer is one of the most reliable ways to enter the test in good form.",
      },
    ],
    checklist: [
      "Register for the Secondary Transfer Test before the June deadline",
      "Complete a readiness check to establish a starting point",
      "Identify the 1–2 domains that need the most work",
      "Build a consistent weekly practice routine (2–4 short sessions)",
      "Introduce timed practice papers in the spring/summer term",
      "Practice with audio-format mock tests before Year 6",
      "Maintain preparation through the summer holidays",
      "Research and visit grammar schools — open evenings are typically in Year 5",
    ],
  },
  6: {
    year: 6,
    title: "Preparing for the Bucks 11+ in Year 6",
    metaTitle: "Preparing for the Bucks 11+ in Year 6 – Final Preparation Guide | Bucks 11 Plus Tests",
    metaDescription: "The Bucks 11+ is sat in September of Year 6. Everything families need to do in the final weeks before the Secondary Transfer Test, from timed mock practice to test day logistics.",
    intro: "By Year 6, the Buckinghamshire Secondary Transfer Test is imminent. The test is sat in September — within the first few weeks of the school year. Year 6 preparation is therefore almost entirely about the summer holidays: maintaining sharpness, completing timed mock papers, and building confidence for test day.",
    sections: [
      {
        heading: "The Test Is in September: What That Means for Year 6",
        body: "The Secondary Transfer Test is sat in September of Year 6, which is just weeks after the summer holidays begin. By the time a child starts Year 6, the test is effectively already upon them. This means the serious preparation work for Year 6 children is almost entirely in the summer between Year 5 and Year 6. Children entering Year 6 in September without adequate summer preparation have limited time to make significant improvements before the test date.",
      },
      {
        heading: "The Summer Before Year 6: What to Do",
        body: "The summer holidays are the final and most intensive period of preparation. Most families target 3–5 practice sessions per week, focusing primarily on timed full mock papers. By this stage, domain-specific skill-building should largely be complete — the summer is for consolidation, timing discipline, and confidence. Children should be completing both papers within the 45-minute time limits. If pace is still an issue in July, the remaining weeks should be focused specifically on timing strategies rather than content.",
      },
      {
        heading: "Timed Practice Is Now the Priority",
        body: "The most important preparation in the weeks before the test is completing practice papers under strict timed conditions. This means: two separate 45-minute sittings, no pausing, no help with individual questions, answers on a separate answer sheet, all in one sitting to simulate the actual test experience. Children who have only done untimed or partially timed practice often struggle with the pace discipline required on test day. Building this through repeated timed sessions in July and August gives children the familiarity needed to work calmly under pressure.",
      },
      {
        heading: "The Audio Format — Practice This Specifically",
        body: "The Buckinghamshire Secondary Transfer Test uses audio instructions — a recorded voice that directs children through each section, telling them when to start, how many questions are in each section, and when to stop. This voice cannot be paused or repeated. Children should practice with audio-format tests specifically, not just paper-based ones. The combination of a ticking clock and a recorded voice can cause unexpected panic on test day if children haven't experienced it before. Familiarity removes this as a variable.",
      },
      {
        heading: "Test Day Logistics",
        body: "The test is sat at the child's own primary school in most cases. Children should arrive well-rested and having eaten a normal breakfast — nothing unusual that might upset their stomach. The test has two papers, each 45 minutes. Children will need a pencil and an eraser; everything else is provided. Stress and anxiety on test day are common, and children should be reminded that they have prepared thoroughly and that their job is simply to do their best. Avoid last-minute cramming the evening before.",
      },
      {
        heading: "After the Test: Results and What Happens Next",
        body: "Results are released in October of Year 6. Children receive a qualified or not qualified result — there is no numerical score shared at this stage. Qualified children then submit their school preferences on the Secondary Common Application Form (SCAF) by the October/November deadline. Place offers come on National Offer Day in March. It is important to understand that qualifying does not guarantee a place at any specific grammar school — oversubscription criteria (primarily distance) determine which qualified children receive offers at each school.",
      },
    ],
    faq: [
      {
        question: "My child is in Year 6 and hasn't done any preparation — is there still time?",
        answer: "If the test is weeks away, the window is very short. Focus entirely on getting familiar with the test format, completing a few timed practice sessions, and ensuring your child knows what to expect on test day. Any preparation at this stage should be calm and focused, not intensive — children who are anxious or overtired perform worse than their ability level suggests. Discuss the format with your child so the audio instructions and multiple-choice answer sheet are not a surprise.",
      },
      {
        question: "What score does my child need to pass?",
        answer: "The qualifying threshold is 121 on the standardised score. This is age-adjusted for each child's birthday within the Year 6 cohort. Above 121 is qualified; below is not. Results in October show qualified or not qualified — the specific numerical score is not shared at the initial results stage, though parents can request it later.",
      },
      {
        question: "What should my child eat and do the morning of the test?",
        answer: "A normal, familiar breakfast is best — nothing new or heavy. Avoid sugary foods that cause energy crashes mid-morning. Make sure your child is hydrated and has slept well the night before. Arrive at school on time and calmly. Many children find a short walk helpful for nerves. The most important message is that they have prepared and their job is simply to do their best — not to achieve a specific number.",
      },
      {
        question: "When will we know the result?",
        answer: "Results are released in October of Year 6, typically around three to four weeks after the test date. The result is qualified or not qualified. Qualified children then apply to grammar schools through the SCAF by the October/November deadline. Place offers come through in March on National Offer Day.",
      },
    ],
    checklist: [
      "Maintain 3–5 practice sessions per week through the summer holidays",
      "Complete full timed mock papers (two 45-minute sittings)",
      "Practice specifically with audio-format tests",
      "Focus on timing strategies if pace is still an issue",
      "Prepare test day logistics: pencils, eraser, familiar breakfast, early night",
      "Submit school preferences on the SCAF by the October/November deadline",
      "After results in October: check the score and plan next steps",
    ],
  },
};

export default function YearGroupGuide({ year }: { year: 4 | 5 | 6 }) {
  const content = yearContent[year];
  if (!content) return <NotFound />;

  const breadcrumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: content.title },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={content.metaTitle}
        description={content.metaDescription}
        canonicalPath={`/preparing-for-11-plus-year-${year}`}
        schema={[breadcrumbSchema(breadcrumbs), faqSchema, {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: content.title,
          description: content.metaDescription,
        }]}
      />

      <div className="bg-muted/30 border-b border-border py-3">
        <div className="container mx-auto max-w-4xl px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
          <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
            Year {year} Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="text-guide-title">
            {content.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{content.intro}</p>
        </div>

      <SeoPageProductLead />

        <div className={`${SEO_GUIDE_PROSE} prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground`}>

          {content.sections.map((section, i) => (
            <div key={i}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {i === 0 && <SeoContentAd variant="dashboard" />}
            </div>
          ))}

          <div className="not-prose my-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="font-serif text-lg font-bold text-green-800 mb-4">Year {year} Checklist</h2>
            <ul className="space-y-2">
              {content.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <span className="mt-0.5 shrink-0 text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <h2>Frequently Asked Questions</h2>
          {content.faq.map((item, i) => (
            <div key={i}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="not-prose mt-10 grid sm:grid-cols-3 gap-4">
          {([4, 5, 6] as const).filter(y => y !== year).map(y => (
            <Link
              key={y}
              href={`/preparing-for-11-plus-year-${y}`}
              data-testid={`link-year-${y}-guide`}
              className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="text-xs text-muted-foreground mb-1">Preparation guide</div>
              <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                Year {y} →
              </div>
            </Link>
          ))}
          <Link
            href="/buckinghamshire-11-plus-guide"
            data-testid="link-bucks-guide"
            className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="text-xs text-muted-foreground mb-1">Complete guide</div>
            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              Bucks 11+ Guide →
            </div>
          </Link>
        </div>

        <ChildExperienceCTA />
        <ContentCTA heading="Right for this year group?" subhead="An 8-minute check tells you where your child stands today — and what to focus on next." ctaLabel="Take the check" />
        <SeoContentAd variant="suite" />
        <GuideConversionBlock className="my-10" hideQuestions />      <SeoContentAd variant="cta" />

        <Disclaimer />
      </div>
    </div>
  );
}

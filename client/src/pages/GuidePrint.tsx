import { DashboardPreviewForecast } from "../components/shared/DashboardPreview";
import { learnArticles, LEARN_CATEGORIES, getArticlesByCategory } from "../data/learn-articles";

const BASE = "https://bucks11plustest.co.uk";

function PageHeader({ title, subtitle, accent = "#0d1f30" }: { title: string; subtitle?: string; accent?: string }) {
  return (
    <div className="mb-6 pb-4 border-b-2" style={{ borderColor: accent }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: accent }}>{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs text-slate-400 font-medium tracking-wider">BUCKS 11 PLUS TESTS · 2026</span>
      </div>
    </div>
  );
}

function InfoBox({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  const borderColors: Record<string, string> = {
    slate: "border-slate-200 bg-slate-50",
    amber: "border-amber-200 bg-amber-50",
    emerald: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    violet: "border-violet-200 bg-violet-50",
    red: "border-red-200 bg-red-50",
  };
  return (
    <div className={`rounded-xl border ${borderColors[color] ?? borderColors.slate} p-5 my-4`}>
      {children}
    </div>
  );
}

function CTALink({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <a
      href={href}
      className="block no-underline rounded-xl border-2 border-[#0d1f30] px-5 py-3 text-center my-3 hover:bg-slate-50"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="font-bold text-[#0d1f30] text-sm">{label}</span>
      {sub && <span className="block text-xs text-slate-500 mt-0.5">{sub}</span>}
    </a>
  );
}

function ExampleQuestion({
  number,
  subject,
  type,
  question,
  options,
  answer,
  explanation,
  accentColor,
}: {
  number: number;
  subject: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: accentColor + "15" }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
          Q{number} · {subject} · {type}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-slate-800 mb-3">{question}</p>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isCorrect = letter === answer;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                  isCorrect
                    ? "bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800"
                    : "bg-slate-50 border border-slate-200 text-slate-600"
                }`}
              >
                <span className={`font-bold ${isCorrect ? "text-emerald-700" : "text-slate-400"}`}>{letter}</span>
                {opt}
                {isCorrect && <span className="ml-auto text-emerald-600">✓</span>}
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-700">Answer {answer}: </span>{explanation}
        </p>
      </div>
    </div>
  );
}

export default function GuidePrint() {
  const subjectCounts: Record<string, number> = {};
  LEARN_CATEGORIES.forEach((cat) => {
    subjectCounts[cat] = getArticlesByCategory(cat).length;
  });
  const totalArticles = learnArticles.length;
  const GUIDE_PAGES = 22;

  return (
    <div className="guide-print bg-white text-slate-800 font-sans max-w-[210mm] mx-auto">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .guide-print { max-width: 100%; }
          .page-break { page-break-after: always; }
          nav, footer, header, .no-print { display: none !important; }
          a { color: inherit; text-decoration: none; }
          .print-link { text-decoration: underline; color: #0d1f30 !important; }
        }
        @media screen {
          .guide-print { padding: 2rem; }
          .page-break { border-bottom: 3px dashed #e2e8f0; margin: 2.5rem 0; padding-bottom: 2.5rem; }
        }
        .print-link { text-decoration: underline; color: #0d1f30; }
      `}</style>

      {/* PAGE 1 — COVER */}
      <div className="page-break">
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#0d1f30]" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0d1f30]" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <svg viewBox="0 0 48 48" className="w-12 h-12" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="none" stroke="#0d1f30" strokeWidth="2" />
                <circle cx="24" cy="24" r="14" fill="none" stroke="#0d1f30" strokeWidth="1" opacity="0.3" />
                <circle cx="24" cy="24" r="4" fill="#0d1f30" />
              </svg>
              <div className="text-left">
                <span className="block text-xl font-serif font-bold text-[#0d1f30]">Bucks 11 Plus Tests</span>
                <span className="block text-xs text-slate-500 tracking-widest uppercase">bucks11plustest.co.uk</span>
              </div>
            </div>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="inline-block border border-[#0d1f30]/20 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#0d1f30]/60 mb-6">
              2026 Edition · {GUIDE_PAGES} Pages
            </div>
            <h1 className="text-5xl font-serif font-bold text-[#0d1f30] mb-4 leading-tight">
              The Complete Buckinghamshire 11+ Parent Guide
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Everything you need to understand the grammar school test, prepare your child effectively, and know where they stand.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              {[
                { value: "13", label: "Grammar Schools Covered" },
                { value: "121", label: "Qualifying Score Explained" },
                { value: `${totalArticles}`, label: "In-Depth Guides Inside" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-slate-200 px-3 py-4">
                  <div className="text-3xl font-black text-[#0d1f30]">{value}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-auto">
            This guide is an independent educational resource prepared by Ianson Systems Limited. Not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual grammar school.
          </p>
        </div>
      </div>

      {/* PAGE 2 — TABLE OF CONTENTS */}
      <div className="page-break">
        <PageHeader title="What's Inside This Guide" subtitle="A complete roadmap for Buckinghamshire 11+ preparation" />
        <p className="text-sm text-slate-500 mb-6">
          This {GUIDE_PAGES}-page guide covers every aspect of the Buckinghamshire Secondary Transfer Test — from understanding the system to test day itself, with example questions and preparation strategy throughout.
        </p>
        <div className="space-y-1 text-sm">
          {[
            { section: "How the Bucks Grammar School System Works", page: 3 },
            { section: "Understanding the Score of 121", page: 4 },
            { section: "Admissions Timeline: Year 4 to Results Day", page: 5 },
            { section: "The 13 Buckinghamshire Grammar Schools", page: 6 },
            { section: "The Biggest Preparation Challenge", page: 7 },
            { section: "Preparation Strategy: What Actually Works", page: 8 },
            { section: "Verbal Reasoning — Subject Deep Dive", page: 9 },
            { section: "Non-Verbal Reasoning & Spatial Reasoning", page: 10 },
            { section: "Mathematics & English Comprehension", page: 11 },
            { section: "Example Questions: Verbal Reasoning & Mathematics", page: 12 },
            { section: "Example Questions: NVR & English Comprehension", page: 13 },
            { section: "Test Day: What to Expect", page: 14 },
            { section: "After the Test: Results, Appeals & Next Steps", page: 15 },
            { section: "The Bucks 11 Plus Tests Platform", page: 16 },
            { section: "Subscription Plans & Pricing", page: 17 },
            { section: `In-Depth Guide Library: ${totalArticles} Articles`, page: 18 },
            { section: "Understanding the Test (7 guides)", page: 18 },
            { section: "Grammar Schools & Admissions (3 guides)", page: 19 },
            { section: "Preparation Strategy (5 guides)", page: 19 },
            { section: "Subject Guides (6 guides)", page: 20 },
            { section: "Test Day & After (7 guides)", page: 21 },
          ].map(({ section, page }) => (
            <div key={section} className="flex items-baseline justify-between border-b border-dotted border-slate-200 py-1.5">
              <span className="text-slate-700 pr-2">{section}</span>
              <span className="text-slate-400 font-medium shrink-0">{page}</span>
            </div>
          ))}
        </div>
        <InfoBox color="blue">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Reading tip:</strong> This guide is designed to be read in order, but each section also stands alone. If you have a specific question, jump straight to the relevant page using the contents above.
            All links in this guide are clickable — access the platform, start your free readiness check, or view subscription plans directly.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 3 — HOW THE SYSTEM WORKS */}
      <div className="page-break">
        <PageHeader title="How the Bucks Grammar School System Works" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mt-4 mb-2">The Secondary Transfer Test</h3>
        <p className="text-sm leading-relaxed mb-3">
          The Buckinghamshire Secondary Transfer Test — the Bucks 11+ — is a selective entrance exam determining eligibility for all 13 grammar schools in Buckinghamshire. Unlike other selective areas where children may sit multiple tests for different schools, Buckinghamshire operates a single-test system: one exam, one standardised score, one eligibility decision for all 13 schools simultaneously.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          The test is administered by <strong>GL Assessment</strong> — one of the UK's leading educational assessment providers. It covers five domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, English Comprehension, and Spatial Reasoning, delivered across two 45-minute papers in a multiple-choice format. All answers are recorded on separate answer sheets and machine-scanned for accuracy.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          One of the most distinctive features is the use of <strong>audio-recorded instructions</strong>. A recorded voice manages all section timings — telling children when to start, how many questions are in each section, and when to stop. Children who encounter this format for the first time on test day often find it unexpectedly pressured. Practising with audio-led mock tests in the weeks before the real test is essential preparation.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Registration</h3>
        <p className="text-sm leading-relaxed mb-3">
          Most children at Buckinghamshire state primary schools are registered automatically. However, parents should confirm this with their school. Children from outside Buckinghamshire, or at independent schools, must register directly with Buckinghamshire Council. Registration typically opens in spring of Year 5 and closes in late June. Missing the deadline means missing the test entirely — there is no facility for late registration in standard circumstances.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Who Sits It</h3>
        <p className="text-sm leading-relaxed mb-3">
          The test is sat by Year 6 children in September, approximately 12 months before they start secondary school. Approximately 6,000–7,000 children sit the test annually across Buckinghamshire. The test is designed to identify the top roughly 15–20% of the cohort — it is calibrated to be genuinely challenging, and children who have not specifically prepared for the format and question types will likely underperform relative to their true academic ability.
        </p>
        <InfoBox color="amber">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> The primary school curriculum does not cover 11+ content. Verbal reasoning, non-verbal reasoning, and spatial reasoning are not taught in Year 5 or Year 6. Preparation outside school — whether through tutoring, workbooks, or structured digital practice — is standard practice among families targeting grammar school entry.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 4 — UNDERSTANDING 121 */}
      <div className="page-break">
        <PageHeader title="Understanding the Score of 121" />
        <p className="text-sm leading-relaxed mb-4">
          The qualifying score for Buckinghamshire grammar schools is a <strong>standardised score of 121</strong>. This threshold has been consistent for many years and represents performance significantly above the national average. A score of 100 is the standardised average — 121 is approximately 1.4 standard deviations above that mean, representing roughly the top 8–12% of performance nationwide.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">How Standardisation Works</h3>
        <p className="text-sm leading-relaxed mb-3">
          Raw test scores are converted into standardised scores using age adjustment. Because children born in September are almost a full year older than children born in August when they sit the September test, raw scores are mathematically adjusted to ensure fair comparison. An August-born child who achieves the same raw score as a September-born child will receive a slightly higher standardised score. This is the standardisation process — it levels the playing field across all birthdays within the school year.
        </p>
        <InfoBox>
          <h4 className="text-sm font-bold text-[#0d1f30] mb-3">Score Ranges and What They Mean</h4>
          <div className="space-y-2 text-sm">
            {[
              { range: "Below 110", label: "Well below qualifying — significant targeted work needed", color: "text-red-600 bg-red-50 border-red-200" },
              { range: "110 – 116", label: "Below qualifying — achievable gap with structured preparation", color: "text-orange-600 bg-orange-50 border-orange-200" },
              { range: "117 – 120", label: "Within reach — targeted practice in weakest subjects likely sufficient", color: "text-amber-600 bg-amber-50 border-amber-200" },
              { range: "121 – 125", label: "Qualifying standard — grammar school eligibility confirmed", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
              { range: "126+", label: "Comfortably above qualifying — strong placement prospects", color: "text-green-700 bg-green-50 border-green-200" },
            ].map(({ range, label, color }) => (
              <div key={range} className={`flex gap-3 items-start rounded-lg border px-3 py-2 ${color}`}>
                <span className="font-bold text-xs whitespace-nowrap w-20 shrink-0">{range}</span>
                <span className="text-xs leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </InfoBox>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mt-4 mb-2">Qualifying Does Not Guarantee a Place</h3>
        <p className="text-sm leading-relaxed mb-3">
          Achieving a score of 121 confirms grammar school eligibility — but does not guarantee a place. Places are allocated based on each school's oversubscription criteria, primarily distance from home to school. In the most popular schools (Royal Grammar School, Aylesbury High, Dr Challoner's), the distance cut-off can fall within 2–3 miles when demand exceeds capacity. A qualifying child living 5 miles from a heavily oversubscribed school may not receive a place there, while receiving a place at a less oversubscribed school further afield.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">What Our Platform Provides</h3>
        <p className="text-sm leading-relaxed mb-2">
          The free 8-minute readiness check generates a predicted standardised score benchmarked against 121. It identifies your child's current standing across all four subjects and highlights the specific question types with the highest impact on the overall score.
        </p>
        <CTALink href={`${BASE}/free-diagnostic`} label="Take the Free 8-Minute Readiness Check" sub={`${BASE}/free-diagnostic`} />
      </div>

      {/* PAGE 5 — ADMISSIONS TIMELINE */}
      <div className="page-break">
        <PageHeader title="Admissions Timeline: Year 4 to Results Day" />
        <p className="text-sm leading-relaxed mb-5">
          The Buckinghamshire 11+ admissions cycle runs across two academic years. Understanding the timeline early allows families to plan preparation methodically rather than reactively.
        </p>
        <div className="space-y-5">
          {[
            {
              when: "Year 4 (Age 8–9)",
              accent: "#94a3b8",
              title: "Awareness & Early Foundations",
              points: [
                "Research the grammar school system and understand what the test involves",
                "Light-touch exposure to verbal reasoning word puzzles and number sequences is beneficial",
                "No formal structured preparation is needed at this stage",
                "Identify which grammar schools serve your local area and their admissions criteria",
              ],
            },
            {
              when: "Year 5 Spring (May–June)",
              accent: "#f59e0b",
              title: "Registration Opens and Closes",
              points: [
                "Registration for the Secondary Transfer Test opens — typically in May of Year 5",
                "Registration deadline is usually late June — check with Buckinghamshire Council for the exact date",
                "In-county state primary school children are usually registered automatically — confirm with school",
                "Out-of-county and independent school children must register directly",
              ],
            },
            {
              when: "Year 5–6 Summer",
              accent: "#0d1f30",
              title: "Structured Preparation Begins",
              points: [
                "Begin systematic familiarisation with all four question type groups",
                "Take a readiness check to identify strengths and gaps before revision begins",
                "Focus on the two weakest subject areas first — progress here has most impact",
                "Develop timed practice habits — pace is as critical as accuracy on test day",
              ],
            },
            {
              when: "Year 6 Sept",
              accent: "#059669",
              title: "Test Day",
              points: [
                "Test held at allocated test centres, typically on a Saturday in mid-September",
                "Children arrive with HB pencil and eraser only — all other equipment provided",
                "Two papers of 45 minutes each with audio-recorded instructions",
                "Answers recorded on a separate answer sheet — must align with correct question numbers",
              ],
            },
            {
              when: "Mid-October",
              accent: "#7c3aed",
              title: "Results Released",
              points: [
                "Standardised score and qualifying decision (121+) sent to parents",
                "Results letter does not give a subject-by-subject breakdown",
                "School preferences submitted on Common Application Form by 31 October",
                "National Offer Day: 1 March of Year 7 entry year",
              ],
            },
          ].map(({ when, accent, title, points }) => (
            <div key={when} className="flex gap-4">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{when}</span>
                  <span className="text-sm font-semibold text-[#0d1f30]">{title}</span>
                </div>
                <ul className="space-y-0.5">
                  {points.map((p) => (
                    <li key={p} className="text-xs text-slate-600 flex gap-1.5">
                      <span className="text-slate-400 shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE 6 — 13 GRAMMAR SCHOOLS */}
      <div className="page-break">
        <PageHeader title="The 13 Buckinghamshire Grammar Schools" />
        <p className="text-sm leading-relaxed mb-4">
          All 13 schools use the same Secondary Transfer Test result — a qualifying score of 121+ makes a child eligible to apply to any or all of them. Places at each school are then allocated by oversubscription criteria (primarily distance) when demand exceeds capacity.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              area: "Aylesbury",
              accent: "#7c3aed",
              schools: [
                { name: "Aylesbury Grammar School", type: "Boys", url: "ags.bucks.sch.uk" },
                { name: "Aylesbury High School", type: "Girls", url: "aylesburyhigh.org" },
                { name: "Sir Henry Floyd Grammar School", type: "Co-ed", url: "shfgs.org" },
              ],
            },
            {
              area: "High Wycombe",
              accent: "#0d1f30",
              schools: [
                { name: "The Royal Grammar School", type: "Boys", url: "rgshw.com" },
                { name: "Wycombe High School", type: "Girls", url: "whs.bucks.sch.uk" },
                { name: "John Hampden Grammar School", type: "Boys", url: "jhgs.bucks.sch.uk" },
              ],
            },
            {
              area: "Amersham & Chesham",
              accent: "#059669",
              schools: [
                { name: "Dr Challoner's Grammar School", type: "Boys", url: "challoners.com" },
                { name: "Dr Challoner's High School", type: "Girls", url: "dchigh.org" },
                { name: "Chesham Grammar School", type: "Co-ed", url: "cheshamgrammar.org" },
              ],
            },
            {
              area: "South Bucks",
              accent: "#d97706",
              schools: [
                { name: "Beaconsfield High School", type: "Girls", url: "beaconsfieldhigh.bucks.sch.uk" },
                { name: "Burnham Grammar School", type: "Co-ed", url: "burnhamgrammar.org" },
                { name: "Sir William Borlase's Grammar School", type: "Co-ed", url: "swbgs.com" },
                { name: "The Royal Latin School", type: "Co-ed", url: "royallatin.org" },
              ],
            },
          ].map(({ area, accent, schools }) => (
            <div key={area} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2" style={{ backgroundColor: accent + "10", borderBottom: `2px solid ${accent}` }}>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{area}</h4>
              </div>
              <ul className="divide-y divide-slate-100">
                {schools.map((s) => (
                  <li key={s.name} className="px-4 py-2">
                    <a href={`https://www.${s.url}`} className="print-link text-xs font-medium text-[#0d1f30]" target="_blank" rel="noopener noreferrer">
                      {s.name}
                    </a>
                    <span className="text-[10px] text-slate-400 ml-2">{s.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-4 italic">
          Always verify current admissions criteria and distances directly with Buckinghamshire Council and individual schools. Criteria change year to year.
        </p>
        <CTALink href={`${BASE}/bucks-grammar-schools`} label="Full Grammar School Directory" sub={`${BASE}/bucks-grammar-schools`} />
      </div>

      {/* PAGE 7 — BIGGEST PREP CHALLENGE */}
      <div className="page-break">
        <PageHeader title="The Biggest Preparation Challenge" />
        <p className="text-sm leading-relaxed mb-4">
          Most families preparing for the Bucks 11+ complete large numbers of practice questions — often hundreds of papers — without ever knowing whether their child's performance is actually improving in the areas that matter most. They know their child got some questions wrong. They don't know which ones, why, or what to do about it.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          The challenge is not lack of practice material. It is lack of <strong>measurement</strong>. Without a structured readiness check, parents cannot answer the fundamental questions that drive effective preparation:
        </p>
        <div className="grid grid-cols-2 gap-3 my-5">
          {[
            "Is my child's accuracy improving, staying flat, or declining?",
            "Which specific reasoning skills are the weakest?",
            "Is pace a limiting factor, or is it accuracy?",
            "Would improving one subject have more impact than another?",
            "How far is my child from the 121 qualifying score?",
            "Are the gaps closable before the September test date?",
          ].map((q) => (
            <div key={q} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 flex items-start gap-2">
              <span className="text-slate-300 shrink-0 mt-0.5">?</span>
              <span className="text-xs text-slate-700 leading-snug">{q}</span>
            </div>
          ))}
        </div>
        <InfoBox color="blue">
          <h4 className="text-sm font-bold text-blue-900 mb-2">The Readiness-Led Approach</h4>
          <p className="text-xs text-blue-800 leading-relaxed">
            A readiness-led approach — one that measures specific skills, identifies gaps, tracks progress over time, and generates actionable priorities — provides the clarity that generic practice cannot. The Bucks 11 Plus Tests platform is built on this principle: every readiness check produces a predicted standardised score, subject breakdowns, and a specific recommended focus order.
          </p>
        </InfoBox>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mt-5 mb-2">Common Preparation Mistakes</h3>
        <div className="space-y-2">
          {[
            { mistake: "Starting too late", fix: "Structured preparation should begin in Year 5 — the final weeks before the test are for refinement, not learning new skills." },
            { mistake: "Ignoring weaker subjects", fix: "Focusing on subjects your child already enjoys feels productive but isn't. The biggest score gains come from closing the weakest gaps." },
            { mistake: "No timed practice", fix: "Children who practice without time pressure are not preparing for the real test. Pace is as critical as accuracy — one without the other is incomplete preparation." },
            { mistake: "No audio format exposure", fix: "The test uses audio-recorded instructions. Children who encounter this format for the first time on test day lose composure. Mock tests with audio are essential." },
          ].map(({ mistake, fix }) => (
            <div key={mistake} className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-red-50 border-b border-red-100 px-3 py-1.5">
                <span className="text-xs font-bold text-red-700">✗ {mistake}</span>
              </div>
              <div className="bg-emerald-50 px-3 py-1.5">
                <span className="text-xs text-emerald-800">✓ {fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE 8 — PREPARATION STRATEGY */}
      <div className="page-break">
        <PageHeader title="Preparation Strategy: What Actually Works" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">The Three-Phase Approach</h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { phase: "Phase 1", title: "Diagnose", when: "Year 5 start", desc: "Identify current baseline across all four subjects using a structured readiness check. Pinpoint the two or three weakest skill areas before any targeted practice begins." },
            { phase: "Phase 2", title: "Target", when: "Year 5–6", desc: "Focus practice on the highest-impact gaps identified in the readiness check. Use structured question banks and topic-specific drills rather than mixed practice papers." },
            { phase: "Phase 3", title: "Simulate", when: "Final 8–12 weeks", desc: "Full timed mock tests under authentic conditions, including audio instructions. Track score progression and adjust focus based on improving and remaining gaps." },
          ].map(({ phase, title, when, desc }) => (
            <div key={phase} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-[#0d1f30] px-3 py-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{phase}</span>
                <p className="text-sm font-bold text-white">{title}</p>
                <span className="text-[10px] text-white/50">{when}</span>
              </div>
              <div className="px-3 py-3">
                <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">The Role of Timing</h3>
        <p className="text-sm leading-relaxed mb-3">
          The GL Assessment format presents questions at a pace of under a minute each. Children must develop the habit of moving on quickly from difficult questions — staying on an unsolvable question means losing time from easier ones later. This requires deliberate timed practice from early in preparation, not just in the final weeks.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Mock Test Strategy</h3>
        <p className="text-sm leading-relaxed mb-3">
          Mock tests serve two distinct purposes: familiarisation with the format, and measurement of progress. Run two to three full audio-led mock tests in the final eight weeks — one before the final push, one mid-way, and one as a final check. Use the gap between mock test scores to adjust preparation intensity in the remaining weeks.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Using a Readiness Platform</h3>
        <p className="text-sm leading-relaxed mb-2">
          A structured digital platform — rather than books or papers alone — enables real-time measurement of progress, adapts question difficulty, and generates specific improvement recommendations. The Bucks 11 Plus Tests platform provides a free 8-minute readiness check and a full subscription practice service benchmarked against the 121 qualifying standard.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <CTALink href={`${BASE}/free-diagnostic`} label="Start Free Readiness Check" sub="No account needed · 8 minutes" />
          <CTALink href={`${BASE}/pricing`} label="View Subscription Plans" sub="From £35/month" />
        </div>
      </div>

      {/* PAGE 9 — VERBAL REASONING */}
      <div className="page-break">
        <PageHeader title="Verbal Reasoning" subtitle="Subject Deep Dive" accent="#7c3aed" />
        <p className="text-sm leading-relaxed mb-4">
          Verbal Reasoning tests linguistic flexibility and pattern recognition with words. Unlike English comprehension — which tests reading skills — verbal reasoning tests the ability to identify relationships between words, solve letter-based codes, and recognise patterns in language. It is not taught explicitly in primary schools, which means all children need specific preparation regardless of their English ability.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Key Question Types</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { type: "Word Analogies", desc: "AUTHOR : BOOK = COMPOSER : ___. Tests ability to identify relationships between word pairs." },
            { type: "Letter Codes", desc: "If CAT = ECV, what is DOG? Tests systematic letter-shift encoding." },
            { type: "Word Relationships", desc: "Find the word that connects both pairs: (FIRE, ___) (SIDE, ___). Tests vocabulary breadth." },
            { type: "Antonyms & Synonyms", desc: "Find the word closest in meaning to CAUTIOUS. Tests word knowledge and vocabulary range." },
            { type: "Letter Sequences", desc: "AB, DF, HJ, LN, ___. Tests pattern recognition within alphabetic sequences." },
            { type: "Hidden Words", desc: "Find a four-letter word hidden across two adjacent words: THE RAPID OX. Tests visual word scanning." },
          ].map(({ type, desc }) => (
            <div key={type} className="rounded-lg border-l-4 border-violet-400 bg-violet-50 pl-3 pr-2 py-2.5">
              <p className="text-xs font-bold text-violet-900 mb-0.5">{type}</p>
              <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">How to Improve</h3>
        <p className="text-sm leading-relaxed mb-2">
          All verbal reasoning question types are finite and learnable. Systematic exposure to each type — working through specific question banks for each category rather than mixed practice — produces the fastest improvement. Vocabulary breadth is the strongest underlying predictor of verbal reasoning performance. Regular reading of age-appropriate books, particularly fiction with varied vocabulary, remains one of the highest-impact preparation activities.
        </p>
        <InfoBox color="violet">
          <p className="text-xs text-violet-800 leading-relaxed">
            <strong>Top tip:</strong> Children often spend too much time on difficult verbal reasoning questions. Teach them to mark and move on — returning with fresh eyes is nearly always more effective than staying stuck on one question.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 10 — NVR & SPATIAL */}
      <div className="page-break">
        <PageHeader title="Non-Verbal Reasoning & Spatial Reasoning" subtitle="Subject Deep Dive" accent="#3b82f6" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Non-Verbal Reasoning</h3>
        <p className="text-sm leading-relaxed mb-3">
          Non-verbal reasoning tests the ability to recognise patterns, sequences, and relationships between shapes without using language. This skill is largely independent of curriculum knowledge — which is why high-achieving academic children sometimes struggle initially if they haven't encountered the question formats before. With targeted practice, improvement is rapid and consistent.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { type: "Matrices", desc: "3×3 grids where rows and columns follow a rule — identify the missing element." },
            { type: "Series", desc: "A sequence of shapes with a pattern — find the next shape in the sequence." },
            { type: "Classification", desc: "Four shapes belong to a group; identify the odd one out." },
            { type: "Analogies", desc: "Shape A is to Shape B as Shape C is to ___. Tests relational reasoning." },
          ].map(({ type, desc }) => (
            <div key={type} className="rounded-lg border-l-4 border-blue-400 bg-blue-50 pl-3 pr-2 py-2.5">
              <p className="text-xs font-bold text-blue-900 mb-0.5">{type}</p>
              <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Spatial Reasoning</h3>
        <p className="text-sm leading-relaxed mb-3">
          Spatial reasoning requires mentally manipulating 2D and 3D shapes — rotating, reflecting, unfolding nets, and identifying views. Like NVR, it is not part of the standard curriculum. Children improve quickly with targeted practice and visual exercises.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { type: "Nets of Cubes", desc: "Identify which net folds to make a specific cube — tests 3D spatial visualisation." },
            { type: "Rotation & Reflection", desc: "Identify the result of rotating or reflecting a shape — most common spatial question type." },
            { type: "Views of 3D Shapes", desc: "Identify what a 3D structure looks like from the top, front, or side." },
            { type: "Combining Shapes", desc: "Identify which pieces combine to form a target shape — tests spatial composition." },
          ].map(({ type, desc }) => (
            <div key={type} className="rounded-lg border-l-4 border-blue-300 bg-blue-50 pl-3 pr-2 py-2.5">
              <p className="text-xs font-bold text-blue-800 mb-0.5">{type}</p>
              <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">How to Improve</h3>
        <p className="text-sm leading-relaxed mb-2">
          Many children make rapid gains in NVR and spatial reasoning because the skill set is highly learnable once the patterns are understood. Focus on matrices and series first — these appear most frequently. Physical spatial exercises (Lego building from instructions, folding paper nets) build the underlying 3D reasoning skills. Digital practice with instant feedback on NVR questions is the most efficient improvement method.
        </p>
        <InfoBox color="blue">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Top tip:</strong> NVR is the subject where targeted practice has the highest payoff relative to time invested. A child who is weak in NVR but focuses on it systematically can gain 6–8 points on the standardised score from this subject alone.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 11 — MATHS & ENGLISH */}
      <div className="page-break">
        <PageHeader title="Mathematics & English Comprehension" subtitle="Subject Deep Dive" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2" style={{ color: "#059669" }}>Mathematics</h3>
        <p className="text-sm leading-relaxed mb-3">
          The mathematics element of the Bucks 11+ goes beyond the Year 5 curriculum. Children encounter fractions, percentages, ratio, algebra, data interpretation, and multi-step word problems — some of which may not be formally taught until Year 6. Speed is as important as accuracy: the timed format means children who cannot calculate quickly will lose marks even on questions they understand.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { topic: "Arithmetic", detail: "Rapid mental calculations, long multiplication, long division" },
            { topic: "Fractions & Ratios", detail: "Simplifying, comparing, and calculating with fractions; ratio problems" },
            { topic: "Percentages", detail: "Percentage increase/decrease, finding the whole, percentage of amounts" },
            { topic: "Algebra", detail: "Finding unknown values, simple formulae, function machines" },
            { topic: "Data Interpretation", detail: "Reading charts, tables, and graphs to answer specific questions" },
            { topic: "Multi-Step Problems", detail: "Two or three-step word problems requiring multiple operations" },
          ].map(({ topic, detail }) => (
            <div key={topic} className="rounded-lg border-l-4 border-emerald-400 bg-emerald-50 pl-3 pr-2 py-2.5">
              <p className="text-xs font-bold text-emerald-900 mb-0.5">{topic}</p>
              <p className="text-[11px] text-slate-600 leading-snug">{detail}</p>
            </div>
          ))}
        </div>
        <InfoBox color="emerald">
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>Maths tip:</strong> Mental arithmetic speed is the biggest differentiator between children who run out of time and those who don't. Regular 5-minute daily mental arithmetic drills from Year 5 onwards have an outsized impact on test-day score.
          </p>
        </InfoBox>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mt-5 mb-2" style={{ color: "#d97706" }}>English Comprehension</h3>
        <p className="text-sm leading-relaxed mb-3">
          English comprehension involves reading a passage — typically 400–600 words — and answering 10–12 questions about it under strict time pressure. Unlike curriculum comprehension, 11+ comprehension tests a specific range of skills that require targeted practice rather than general reading ability alone.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { type: "Inference", desc: "What can be concluded from what the text implies but doesn't state directly?" },
            { type: "Vocabulary in Context", desc: "What does a specific word mean as used in this particular passage?" },
            { type: "Author's Intent", desc: "Why did the author use this word, phrase, or structural choice?" },
            { type: "Supporting Evidence", desc: "Which piece of evidence from the passage best supports a given statement?" },
          ].map(({ type, desc }) => (
            <div key={type} className="rounded-lg border-l-4 border-amber-400 bg-amber-50 pl-3 pr-2 py-2.5">
              <p className="text-xs font-bold text-amber-900 mb-0.5">{type}</p>
              <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
        <InfoBox color="amber">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>English tip:</strong> The most common mistake is re-reading the entire passage for every question. Teach children to read the passage once with attention, then use targeted scanning for each question. This is a learnable technique that significantly improves pace.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 12 — EXAMPLE QUESTIONS: VR & MATHS */}
      <div className="page-break">
        <PageHeader title="Example Questions: Verbal Reasoning & Mathematics" subtitle="GL-style examples with worked answers" />
        <p className="text-sm text-slate-500 mb-5">
          The following questions are representative of the format and difficulty level used in the Bucks 11+ — not official GL Assessment questions. Correct answers are shown with explanations.
        </p>

        <h3 className="text-sm font-bold uppercase tracking-wider text-violet-700 mb-3 border-b border-violet-100 pb-1">Verbal Reasoning</h3>
        <ExampleQuestion
          number={1}
          subject="Verbal Reasoning"
          type="Word Codes"
          question="If GARDEN is written as HBSEFO in a code (each letter is shifted one place forward in the alphabet), what does RIVER equal in the same code?"
          options={["SJWFS", "SJWFT", "TKWGS", "RJVFS"]}
          answer="A"
          explanation="Each letter shifts one place forward: R→S, I→J, V→W, E→F, R→S = SJWFS."
          accentColor="#7c3aed"
        />
        <ExampleQuestion
          number={2}
          subject="Verbal Reasoning"
          type="Letter Sequence"
          question="What comes next in this sequence? AB, DF, HJ, LN, ___"
          options={["NO", "OR", "PR", "QR"]}
          answer="C"
          explanation="Each pair skips 2 letters forward. Starting with A(1),B(2) → D(4),F(6) → H(8),J(10) → L(12),N(14) → P(16),R(18). Answer: PR."
          accentColor="#7c3aed"
        />
        <ExampleQuestion
          number={3}
          subject="Verbal Reasoning"
          type="Word Analogy"
          question="AUTHOR is to NOVEL as ARCHITECT is to ___"
          options={["Design", "Blueprint", "Building", "Bricks"]}
          answer="C"
          explanation="An author creates a novel (a finished work); an architect creates a building (a finished structure). Blueprint and design are processes, not products."
          accentColor="#7c3aed"
        />

        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-3 border-b border-emerald-100 pb-1 mt-4">Mathematics</h3>
        <ExampleQuestion
          number={4}
          subject="Mathematics"
          type="Ratio"
          question="A recipe for 4 people requires 360g of flour. How much flour is needed to make the same recipe for 7 people?"
          options={["540g", "580g", "630g", "720g"]}
          answer="C"
          explanation="360g ÷ 4 people = 90g per person. 90g × 7 = 630g."
          accentColor="#059669"
        />
        <ExampleQuestion
          number={5}
          subject="Mathematics"
          type="Percentage Discount"
          question="A jacket has an original price of £85. It is reduced by 20% in a sale. What is the sale price?"
          options={["£64", "£66", "£68", "£70"]}
          answer="C"
          explanation="20% of £85 = £17. £85 − £17 = £68."
          accentColor="#059669"
        />
      </div>

      {/* PAGE 13 — EXAMPLE QUESTIONS: NVR & ENGLISH */}
      <div className="page-break">
        <PageHeader title="Example Questions: Non-Verbal Reasoning & English Comprehension" subtitle="GL-style examples with worked answers" />

        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-3 border-b border-blue-100 pb-1">Non-Verbal Reasoning</h3>
        <ExampleQuestion
          number={6}
          subject="Non-Verbal Reasoning"
          type="Matrix Pattern"
          question="A number grid follows a rule. Row 1: 2, 4, 8. Row 2: 3, 6, 12. Row 3: 4, 8, ___. What completes Row 3?"
          options={["12", "14", "16", "20"]}
          answer="C"
          explanation="Each number in a row doubles across the columns. Each row's starting number increases by 1. Row 3 starts at 4 → 4, 8, 16."
          accentColor="#3b82f6"
        />
        <ExampleQuestion
          number={7}
          subject="Non-Verbal Reasoning"
          type="Odd One Out"
          question="Four of these five numbers are perfect squares. Which is the odd one out? 16, 25, 36, 48, 64"
          options={["16", "25", "36", "48"]}
          answer="D"
          explanation="16=4², 25=5², 36=6², 64=8² are all perfect squares. 48 is not a perfect square (6²=36, 7²=49), so 48 is the odd one out."
          accentColor="#3b82f6"
        />

        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3 border-b border-amber-100 pb-1 mt-4">English Comprehension</h3>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2">Reading Passage (excerpt)</p>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "The old lighthouse had not guided a single ship in thirty years, yet Mrs Alderton climbed its hundred and twelve steps every Thursday morning without fail. Her neighbours said it was stubbornness. Her daughter called it ritual. Mrs Alderton herself said nothing — only that the view from the top was the same as it had always been, and that was enough."
          </p>
        </div>
        <ExampleQuestion
          number={8}
          subject="English Comprehension"
          type="Inference"
          question="Based on the passage, what is most likely true about why Mrs Alderton climbs the lighthouse?"
          options={[
            "She is paid to maintain the lighthouse",
            "She finds personal meaning in the routine",
            "She is looking for ships on the horizon",
            "Her daughter asks her to go each week",
          ]}
          answer="B"
          explanation="The passage states she 'said nothing — only that the view was the same, and that was enough.' This implies personal significance in the unchanged view, suggesting routine and personal meaning rather than practical purpose."
          accentColor="#d97706"
        />
        <ExampleQuestion
          number={9}
          subject="English Comprehension"
          type="Vocabulary in Context"
          question="In the passage, the word 'ritual' is used to describe Mrs Alderton's climbing. What does this suggest about the activity?"
          options={[
            "It is dangerous and reckless",
            "It is religious and sacred",
            "It is a habitual, meaningful practice",
            "It is boring and repetitive",
          ]}
          answer="C"
          explanation="'Ritual' in context means a regular, meaningful practice. The daughter uses the word respectfully — it suggests a habitual, personally significant activity, not necessarily religious."
          accentColor="#d97706"
        />
      </div>

      {/* PAGE 14 — TEST DAY */}
      <div className="page-break">
        <PageHeader title="Test Day: What to Expect" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Logistics</h3>
        <p className="text-sm leading-relaxed mb-4">
          The test is held at allocated test centres in September, typically on a Saturday. Children sit in a supervised room with speakers delivering audio-recorded instructions. No mobile phones, watches, or electronic devices are permitted. Children must bring an HB pencil and a good eraser — all other equipment is provided.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">The Audio Format</h3>
        <p className="text-sm leading-relaxed mb-4">
          Every instruction in the test — when to open the booklet, how many questions are in each section, when to stop writing — is delivered by a pre-recorded voice. The recording will not wait for children who aren't ready, will not repeat instructions, and cannot be paused. Children who are practiced with this format work calmly through it. Those who encounter it for the first time are often startled and lose composure during the opening minutes, which affects their performance across the whole paper.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">The Answer Sheet</h3>
        <p className="text-sm leading-relaxed mb-4">
          Children record answers on a separate machine-scanned answer sheet — not in the question booklet. Answers must be in the correct grid position, clearly marked, and erased cleanly if changed. Children who practice this mechanic before test day are significantly less likely to make costly alignment errors under pressure.
        </p>
        <InfoBox color="amber">
          <h4 className="text-xs font-bold text-amber-900 mb-2">Checklist for Test Morning</h4>
          <div className="grid grid-cols-2 gap-1">
            {[
              "HB pencil (two, as backup)",
              "Good quality eraser",
              "Know the test centre address",
              "Allow extra travel time",
              "Arrive 10–15 minutes early",
              "Light breakfast eaten calmly",
              "No cramming the night before",
              "Child knows to mark and move on",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-amber-800">
                <span className="text-amber-500">✓</span>
                {item}
              </div>
            ))}
          </div>
        </InfoBox>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mt-4 mb-2">Managing Anxiety</h3>
        <p className="text-sm leading-relaxed mb-3">
          Test anxiety is real and affects performance. The most effective anxiety management strategy is not reassurance — it is preparedness. Children who have taken multiple mock tests under authentic timed conditions, including audio instructions, simply have less to be anxious about. The format feels familiar. The pace feels manageable. Confidence is built through practice, not through promises.
        </p>
        <p className="text-sm leading-relaxed">
          On the morning of the test, encourage your child to eat breakfast, arrive calmly, and remember one simple rule: if a question is hard, mark a sensible guess and move on. There is no penalty for wrong answers — leaving questions blank scores zero, while a wrong guess has a one-in-four chance of scoring a point.
        </p>
      </div>

      {/* PAGE 15 — AFTER THE TEST */}
      <div className="page-break">
        <PageHeader title="After the Test: Results, Appeals & Next Steps" />
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Results</h3>
        <p className="text-sm leading-relaxed mb-4">
          Results arrive in mid-October — approximately four weeks after the test. Parents receive a letter stating their child's standardised score and whether it reached the qualifying threshold of 121. The letter does not break down performance by subject. School preferences are submitted on the Common Application Form (CAF) by <strong>31 October</strong>. National Offer Day is <strong>1 March</strong> of the Year 7 entry year.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">If Your Child Does Not Qualify</h3>
        <p className="text-sm leading-relaxed mb-4">
          The majority of children in Buckinghamshire do not qualify — this is by design. The test is calibrated to identify the top 15–20% of the cohort for grammar school entry. Upper schools in Buckinghamshire are strong schools with good Ofsted ratings and GCSE outcomes. The perception that not qualifying represents a failure is both outdated and unhelpful. Many children thrive at upper schools in ways they would not have in the more academically pressured environment of a grammar school.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">The Year 9 Entry Route</h3>
        <p className="text-sm leading-relaxed mb-4">
          Children who do not qualify at Year 6 can apply for grammar school entry at Year 9 through a separate assessment process. This is a significantly less-known route and gives children who matured late or who were not ready at Year 6 a second opportunity. The Year 9 entry test has its own registration timeline — enquire with individual schools from Year 7 onwards.
        </p>
        <h3 className="text-base font-serif font-bold text-[#0d1f30] mb-2">Appeals</h3>
        <p className="text-sm leading-relaxed mb-4">
          Parents can request a review of the test result if they believe there was an error in test administration or scoring — not on the basis of disagreeing with the result. Appeals based on test content, difficulty, or scoring methodology are very rarely successful. The standardisation process is robust and independently validated. Admissions appeals (a separate process) are handled by individual schools and relate to place allocation, not test result.
        </p>
        <InfoBox color="slate">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Important:</strong> If your child just missed qualifying, consider whether the Year 9 entry route is appropriate. Also review whether any exceptional circumstances apply — illness on test day, a recent bereavement, or a newly diagnosed learning need may all be relevant to an appeal or review request. Contact Buckinghamshire Council admissions for guidance specific to your situation.
          </p>
        </InfoBox>
      </div>

      {/* PAGE 16 — PLATFORM OVERVIEW */}
      <div className="page-break">
        <PageHeader title="The Bucks 11 Plus Tests Platform" subtitle="Structured readiness assessment for Buckinghamshire families" />
        <p className="text-sm leading-relaxed mb-5">
          The Bucks 11 Plus Tests platform provides GL-style readiness checks and structured practice benchmarked against the Buckinghamshire qualifying score of 121. Below is an example of what parents see after their child completes a full readiness check.
        </p>
        <div className="transform scale-90 origin-top-left overflow-hidden rounded-xl border border-slate-200">
          <DashboardPreviewForecast />
        </div>
        <p className="text-[11px] text-slate-400 mt-3 italic mb-5">
          Example data shown for illustration. Your child's real results will populate after their readiness check.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: "🎯", title: "Free 8-Minute Readiness Check", desc: "Assess all four subjects, get a predicted score against 121, and receive specific improvement priorities. No account needed." },
            { icon: "📚", title: "1,500+ Practice Questions", desc: "GL-style questions across Verbal Reasoning, NVR, Mathematics, and English Comprehension — mapped to the Bucks test format." },
            { icon: "⏱️", title: "Readiness Checks", desc: "Full 40-question timed readiness checks with audio-style pacing, benchmarked against the 121 qualifying standard." },
            { icon: "📊", title: "Parent Analytics Dashboard", desc: "Track your child's progress over time, see exactly which topics are improving, and get recommended next-practice steps." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 p-4">
              <span className="text-xl mb-2 block">{icon}</span>
              <h4 className="text-xs font-bold text-[#0d1f30] mb-1">{title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE 17 — SUBSCRIPTION PLANS */}
      <div className="page-break">
        <PageHeader title="Subscription Plans & Pricing" subtitle="Access the full Bucks Practice Platform" />
        <p className="text-sm text-slate-500 mb-5">
          All plans give access to the same GL-style question bank. Higher tiers unlock full readiness checks, platform analytics, and the Young Scholar Programme.
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Free Readiness Check",
              price: "Free",
              sub: "No account needed",
              color: "slate",
              accent: "#64748b",
              features: [
                "8-minute GL-style readiness check",
                "Predicted standardised score against 121",
                "Subject breakdown across all 4 areas",
                "Recommended improvement priorities",
              ],
              url: `${BASE}/free-diagnostic`,
              urlLabel: "Start Free Readiness Check",
            },
            {
              name: "Bucks Plus Edge Monthly",
              price: "£35",
              sub: "per month · cancel any time · no lock-in",
              color: "blue",
              accent: "#0d1f30",
              features: [
                "1,500+ GL-style practice questions",
                "All four subject areas: VR, NVR, Maths, English",
                "Full 40q and 50q mock readiness checks",
                "All Hard-level challenge drills",
                "PDF readiness reports benchmarked to 121",
                "Parent analytics dashboard",
              ],
              url: `${BASE}/pricing`,
              urlLabel: "Start Monthly — £35/mo",
            },
            {
              name: "Bucks Plus Edge Annual",
              price: "£349",
              sub: "per year · save £71 vs monthly · equiv. £29.08/mo",
              color: "emerald",
              accent: "#059669",
              badge: "BEST VALUE",
              features: [
                "Everything in the monthly plan",
                "12 months of full platform access",
                "Priority email support",
                "Best value for Year 5 → test day preparation",
              ],
              url: `${BASE}/pricing`,
              urlLabel: "Get Annual Access — £349",
            },
          ].map(({ name, price, sub, accent, badge, features, url, urlLabel }) => (
            <div key={name} className="rounded-xl border overflow-hidden" style={{ borderColor: accent + "40" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: accent + "08" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold" style={{ color: accent }}>{name}</h4>
                    {badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: accent, color: "white" }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{sub}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black" style={{ color: accent }}>{price}</span>
                </div>
              </div>
              <div className="px-4 py-2 grid grid-cols-2 gap-1">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <span style={{ color: accent }} className="shrink-0 mt-0.5">✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3">
                <a href={url} className="block text-center text-xs font-bold py-2 rounded-lg no-underline" style={{ backgroundColor: accent + "15", color: accent }} target="_blank" rel="noopener noreferrer">
                  {urlLabel} → {url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGES 18–21 — DEEP DIVE GUIDES */}
      {LEARN_CATEGORIES.filter(cat => getArticlesByCategory(cat).length > 0).map((category, catIdx) => {
        const articles = getArticlesByCategory(category);
        const categoryColors: Record<string, string> = {
          "Understanding the Test": "#0d1f30",
          "Grammar Schools & Admissions": "#7c3aed",
          "Preparation Strategy": "#059669",
          "Subject Guides": "#d97706",
          "Test Day & After": "#dc2626",
          "Other Guides": "#64748b",
        };
        const accent = categoryColors[category] ?? "#0d1f30";

        return (
          <div key={category} className={catIdx < LEARN_CATEGORIES.filter(c => getArticlesByCategory(c).length > 0).length - 1 ? "page-break" : ""}>
            <PageHeader
              title={`In-Depth Guide Library: ${category}`}
              subtitle={`${articles.length} article${articles.length !== 1 ? "s" : ""} available free at bucks11plustest.co.uk/learn`}
              accent={accent}
            />
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.slug} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100" style={{ backgroundColor: accent + "06" }}>
                    <h3 className="text-sm font-bold text-[#0d1f30] leading-snug mb-0.5">{article.title}</h3>
                    <a
                      href={`${BASE}/learn/${article.slug}`}
                      className="print-link text-[10px]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {BASE}/learn/{article.slug}
                    </a>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-600 leading-relaxed">{article.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {catIdx === 0 && (
              <InfoBox color="blue">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>All {totalArticles} in-depth guides are available free</strong> at{" "}
                  <a href={`${BASE}/learn`} className="print-link font-bold" target="_blank" rel="noopener noreferrer">
                    bucks11plustest.co.uk/learn
                  </a>. No account or subscription needed to read any guide.
                </p>
              </InfoBox>
            )}
          </div>
        );
      })}

      {/* BACK COVER */}
      <div>
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#0d1f30]" />
          <div className="max-w-lg mx-auto">
            <div className="inline-flex items-center gap-3 mb-8">
              <svg viewBox="0 0 48 48" className="w-10 h-10" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="none" stroke="#0d1f30" strokeWidth="2" />
                <circle cx="24" cy="24" r="14" fill="none" stroke="#0d1f30" strokeWidth="1" opacity="0.3" />
                <circle cx="24" cy="24" r="4" fill="#0d1f30" />
              </svg>
              <span className="text-xl font-serif font-bold text-[#0d1f30]">Bucks 11 Plus Tests</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-[#0d1f30] mb-4 leading-tight">
              Measure Your Child's Readiness Today
            </h2>
            <p className="text-lg text-slate-500 max-w-md mb-8 leading-relaxed">
              Take the free 8-minute readiness check to see exactly where your child stands against the 121 qualifying score — no account needed.
            </p>
            <div className="space-y-3 mb-8">
              <a
                href={`${BASE}/free-diagnostic`}
                className="block rounded-xl border-2 border-[#0d1f30] px-6 py-4 text-center no-underline bg-[#0d1f30]"
                target="_blank" rel="noopener noreferrer"
              >
                <span className="text-white font-bold text-sm block">Start Free 8-Minute Readiness Check</span>
                <span className="text-white/60 text-xs">{BASE}/free-diagnostic</span>
              </a>
              <a
                href={`${BASE}/pricing`}
                className="block rounded-xl border-2 border-[#0d1f30] px-6 py-4 text-center no-underline"
                target="_blank" rel="noopener noreferrer"
              >
                <span className="text-[#0d1f30] font-bold text-sm block">Subscribe from £35/month</span>
                <span className="text-slate-500 text-xs">{BASE}/pricing</span>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-8">
              {[
                { val: "1,500+", label: "Practice Questions" },
                { val: "121", label: "The Target Score" },
                { val: "8 min", label: "Free Readiness Check" },
              ].map(({ val, label }) => (
                <div key={label} className="rounded-lg border border-slate-200 px-2 py-3">
                  <div className="text-2xl font-black text-[#0d1f30]">{val}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto space-y-1 text-xs text-slate-400">
            <p>bucks11plustest.co.uk</p>
            <p>Operated by Ianson Systems Limited. Registered in England and Wales.</p>
            <p>This guide is an independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual school.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

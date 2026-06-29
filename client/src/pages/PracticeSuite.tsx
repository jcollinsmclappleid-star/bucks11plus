import { Link } from "wouter";
import { useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronsDown,
  ClipboardList,
  Layers,
  LayoutDashboard,
  Library,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionCtaPair } from "@/components/shared/ConversionCtaPair";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import {
  InteractivePreviewFrame,
  ParentInsightsPanel,
  PracticeDrillsPanel,
  PracticePapersPanel,
  PracticeTestsPanel,
} from "@/components/shared/PlatformSuitePanels";
import {
  GET_FULL_ACCESS_CTA,
  PLATFORM_ANCHORS,
  PLATFORM_LIBRARY_LABEL,
  PLATFORM_SUITE_PATH,
  PRICING_ANCHOR_SUBLINE,
  PRICING_FROM_HEADLINE,
  SEE_PLANS_PRICING_CTA,
} from "@/lib/marketing";
import { getPageMeta } from "@/lib/pageMeta";
import { scrollToAnchor } from "@/lib/scrollToAnchor";

const breadcrumbItems = [{ label: PLATFORM_LIBRARY_LABEL }];

const prepJourney = [
  {
    step: "1",
    label: "Diagnose",
    desc: "Where are they now?",
    anchor: PLATFORM_ANCHORS.practiceTests,
    color: "bg-amber-400 text-amber-950",
  },
  {
    step: "2",
    label: "Practise",
    desc: "Build stamina & speed",
    anchor: PLATFORM_ANCHORS.practicePapers,
    color: "bg-blue-500 text-white",
  },
  {
    step: "3",
    label: "Target gaps",
    desc: "Fix weak sub-skills",
    anchor: PLATFORM_ANCHORS.practiceBank,
    color: "bg-emerald-500 text-white",
  },
];

const suiteSections = [
  {
    id: PLATFORM_ANCHORS.practiceTests,
    step: "01",
    badge: "Practice tests & diagnostics",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    icon: ClipboardList,
    title: "Find out where marks are being lost — not just the overall score",
    parentAngle:
      "A workbook tells you 18/25. A diagnostic tells you NVR rotations cost 4 marks, VR codes are strong, and pace drops in the second half. That's what you need to plan the next month.",
    whenToUse: [
      "Start of preparation — baseline before you buy more books",
      "Every 4–6 weeks — check the forecast is moving toward 121",
      "2–3 weeks before test day — final mock under exam conditions",
    ],
    includes: ["Free 12-question mini test", "2 × 45-question full tests", "3 timed mock exams with PDF reports"],
    panel: PracticeTestsPanel,
    reverse: false,
    pricingTestId: "button-suite-diagnostics-pricing",
    pricingCtaLabel: "Unlock full diagnostics",
  },
  {
    id: PLATFORM_ANCHORS.practicePapers,
    step: "02",
    badge: "Unlimited practice papers",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Layers,
    title: "Exam-length papers on demand — fresh questions every attempt",
    parentAngle:
      "Printed papers run out and children memorise answers. Quick, Full and Mock formats pull from 2,500+ questions so every paper feels new — building the stamina the Bucks test demands.",
    whenToUse: [
      "Weeknights — 25-minute Quick paper after school",
      "Weekends — Full 40-question paper under timed conditions",
      "Month before the test — weekly Mock format papers",
    ],
    includes: ["Quick papers · 20 questions · ~25 mins", "Full papers · 40 questions · ~45 mins", "Mock papers · 50 questions · timed"],
    panel: PracticePapersPanel,
    reverse: true,
    pricingTestId: "button-suite-papers-pricing",
    pricingCtaLabel: "Get unlimited papers",
  },
  {
    id: PLATFORM_ANCHORS.practiceBank,
    step: "03",
    badge: "2,500+ targeted drills",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: Library,
    title: "Short, focused sessions on the exact sub-skills that need work",
    parentAngle:
      "After a diagnostic flags 'NVR transformations 48%', your child opens that drill — 10–12 questions, worked solutions, timed or untimed. No random worksheets. 46 categories across all four GL domains.",
    whenToUse: [
      "After every diagnostic — target the weakest sub-skill first",
      "10–15 minutes between homework and dinner",
      "School holidays — daily 20-minute drill blocks",
    ],
    includes: ["46 drill categories · VR, NVR, Maths, English", "Easy, medium & hard progression", "Worked solutions on every question"],
    panel: PracticeDrillsPanel,
    reverse: false,
    pricingTestId: "button-suite-drills-pricing",
    pricingCtaLabel: "Access 2,500+ drills",
  },
  {
    id: PLATFORM_ANCHORS.parentInsights,
    step: "04",
    badge: "Parent dashboard & analytics",
    badgeClass: "bg-violet-100 text-violet-800 border-violet-200",
    icon: LayoutDashboard,
    title: "See progress without hovering over their shoulder",
    parentAngle:
      "Every diagnostic, paper and drill feeds a live parent view — 121-scale forecast trend, stamina patterns, and the three sub-skills that will move the needle most. Workbooks cannot tell you if pace is slipping in the second half of a Bucks STT paper, or whether this week's guided programme is working.",
    whenToUse: [
      "Sunday evening — review the week and agree what to tackle next",
      "Before a tutor session — share the forecast trend and priority gaps",
      "Month before the test — check stamina and pace discipline under timed conditions",
    ],
    includes: [
      "Parent dashboard — 121-scale forecast, streak & weekly programme",
      "Session recaps — wins and gaps after every practice",
      "Analytics — stamina, pace discipline & ranked focus areas",
    ],
    panel: ParentInsightsPanel,
    reverse: true,
    pricingTestId: "button-suite-insights-pricing",
    pricingCtaLabel: "See your child's dashboard",
  },
];

const weekPlan = [
  { day: "Mon", task: "15-min VR drill", type: "Drill" },
  { day: "Tue", task: "Quick practice paper", type: "Paper" },
  { day: "Wed", task: "NVR drill + Maths drill", type: "Drill" },
  { day: "Thu", task: "Rest or 10-min vocab", type: "Light" },
  { day: "Fri", task: "Mini diagnostic check-in", type: "Test" },
  { day: "Sat", task: "Full mock paper · timed", type: "Paper" },
  { day: "Sun", task: "Review wrong answers together", type: "Parent" },
];

function SuiteSection({
  id,
  step,
  badge,
  badgeClass,
  icon: Icon,
  title,
  parentAngle,
  whenToUse,
  includes,
  panel: Panel,
  reverse,
  pricingTestId,
  pricingCtaLabel,
}: (typeof suiteSections)[0]) {
  return (
    <section id={id} className="scroll-mt-24">
      <div
        className={`grid gap-8 lg:gap-12 items-start ${reverse ? "lg:grid-cols-[1fr_1.05fr]" : "lg:grid-cols-[1.05fr_1fr]"}`}
      >
        <div className={reverse ? "lg:order-2" : ""}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary/20 font-serif">{step}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full ${badgeClass}`}>
              {badge}
            </span>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary leading-snug">{title}</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">{parentAngle}</p>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">When parents use this</p>
          <ul className="space-y-2 mb-6">
            {whenToUse.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-4 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What's included</p>
            <ul className="space-y-1.5">
              {includes.map((item) => (
                <li key={item} className="text-sm text-slate-700 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ConversionCtaPair
            pricingLabel={pricingCtaLabel}
            pricingTestId={pricingTestId}
            freeTestId={`${pricingTestId}-free`}
          />
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <InteractivePreviewFrame>
            <Panel id={`${id}-preview`} />
          </InteractivePreviewFrame>
        </div>
      </div>
    </section>
  );
}

export default function PracticeSuite() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      requestAnimationFrame(() => scrollToAnchor(hash));
    }
  }, []);

  const pageMeta = getPageMeta(PLATFORM_SUITE_PATH)!;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={pageMeta.title}
        description={pageMeta.description}
        canonicalPath={pageMeta.path}
        schema={breadcrumbSchema(breadcrumbItems)}
      />

      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero — prep journey, not a dashboard clone */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Target className="h-3.5 w-3.5" />
              The preparation system
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-primary md:text-5xl" data-testid="heading-practice-suite">
              Diagnostics, papers &amp; drills — how they work together
            </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            {PLATFORM_LIBRARY_LABEL} isn&apos;t a single feature. It&apos;s three modes of practice that serious Bucks 11+
            families use in sequence — measure, build stamina, then close specific gaps — with a parent dashboard that shows
            what to fix next.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2 text-sm font-medium text-primary">
            <ChevronsDown className="h-4 w-4 shrink-0 animate-bounce text-primary/70" aria-hidden="true" />
            Each section below includes a scrollable, interactive preview of the real platform
          </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {prepJourney.map((item) => (
              <a
                key={item.step}
                href={`#${item.anchor}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${item.color}`}>
                  {item.step}
                </div>
                <p className="font-bold text-primary">{item.label}</p>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary/70 group-hover:text-primary">
                  See below <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </a>
            ))}
          </div>

          <ConversionCtaPair
            className="mt-8"
            leadWithFree
            size="lg"
            pricingLabel={SEE_PLANS_PRICING_CTA}
            pricingTestId="button-suite-hero-pricing"
            freeTestId="button-suite-hero-free"
          />
          <p className="mt-4 text-sm text-primary/80">
            Or jump to{" "}
            <a href={`#${PLATFORM_ANCHORS.parentInsights}`} className="font-semibold text-primary underline underline-offset-2">
              parent dashboard &amp; analytics
            </a>
          </p>
        </div>
      </section>

      {/* Free vs subscriber — unique to this page */}
      <section className="border-b border-slate-200 bg-primary text-white">
        <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
          <h2 className="font-serif text-2xl font-bold mb-6 text-center">What you can try free vs what subscribers get</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">Free — no account</p>
              <ul className="space-y-2 text-sm text-white/85">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />12-question mini practice test</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />Readiness band on the 121 scale</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />Section-by-section breakdown</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-200 mb-3">Bucks Plus Edge — {PRICING_FROM_HEADLINE}</p>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />Everything on this page — unlimited</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />Full & mock exams + PDF reports</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />Parent dashboard, 121-scale forecast &amp; analytics</li>
              </ul>
              <Button variant="cta" size="sm" className="mt-4" asChild data-testid="button-suite-compare-pricing">
                <Link href="/pricing">{GET_FULL_ACCESS_CTA}</Link>
              </Button>
              <p className="text-[11px] text-white/50 mt-2">{PRICING_ANCHOR_SUBLINE}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl px-4 py-14 md:py-20 space-y-20 md:space-y-28">
        {suiteSections.map((section) => (
          <SuiteSection key={section.id} {...section} />
        ))}

        {/* Example week — parent planning */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Example preparation week</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
            How families actually use all three together
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Not cramming — a sustainable rhythm mixing short drills, one paper, and a weekly check-in. Subscribers get a
            guided weekly programme that builds this automatically — then the parent dashboard shows whether it&apos;s working.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {weekPlan.map((d) => (
              <div key={d.day} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-xs font-bold text-primary mb-1">{d.day}</p>
                <p className="text-[11px] text-slate-700 leading-snug mb-2">{d.task}</p>
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{d.type}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Books comparison — lightweight, not TutorCostComparison duplicate */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Why not just buy books?</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-3">Books give questions. This gives feedback.</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A £15 practice book can't tell you pace dropped in question 18, or that cube nets are the recurring weak spot.
              Diagnostics find the gap, papers build stamina, drills fix it — with worked answers and progress tracked for you.
            </p>
            <ConversionCtaPair
              pricingLabel={GET_FULL_ACCESS_CTA}
              pricingTestId="button-suite-books-pricing"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-3 font-semibold text-slate-600" />
                  <th className="p-3 font-semibold text-slate-500">Workbooks</th>
                  <th className="p-3 font-semibold text-primary">Bucks Plus Edge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Timed practice", "Manual", "Built-in"],
                  ["121-scale forecast", "—", "✓"],
                  ["Sub-skill breakdown", "—", "✓"],
                  ["Fresh questions each attempt", "Same paper", "✓"],
                  ["Parent progress dashboard", "—", "✓"],
                  ["Stamina & pace analytics", "—", "✓"],
                ].map(([feature, books, platform]) => (
                  <tr key={feature}>
                    <td className="p-3 text-slate-700">{feature}</td>
                    <td className="p-3 text-slate-400">{books}</td>
                    <td className="p-3 font-medium text-primary">{platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl bg-primary p-8 md:p-12 text-center text-white">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Ready to give your child the full suite?</h2>
          <p className="text-white/75 max-w-xl mx-auto mb-2 text-sm">
            Diagnostics, unlimited papers, 2,500+ drills, and parent analytics — <strong className="text-white">£35/month</strong> or{" "}
            <strong className="text-white">£279/year</strong>.
          </p>
          <p className="text-white/50 text-xs mb-6">3-day money-back guarantee · Cancel anytime</p>
          <ConversionCtaPair
            leadWithFree
            size="lg"
            layout="center"
            variant="onPrimary"
            pricingLabel={GET_FULL_ACCESS_CTA}
            pricingTestId="button-suite-footer-pricing"
            freeTestId="button-suite-footer-free"
            showPriceAnchor={false}
          />
        </section>
      </main>
    </div>
  );
}

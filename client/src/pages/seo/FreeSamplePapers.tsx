import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { LeadMagnetBlock } from "@/components/shared/LeadMagnetBlock";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ArrowDownToLine, CheckCircle2, Clock, BarChart3, TrendingUp, Target, Zap } from "lucide-react";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Free Sample Papers" },
];

const digitalAdvantages = [
  {
    icon: <Clock className="h-5 w-5" />,
    colour: "bg-violet-100 text-violet-700",
    title: "Per-question timing",
    desc: "A printed paper can't tell you if your child spent 3 minutes on question 2 and rushed questions 18–25. We track every answer individually — and flag where time pressure is costing marks.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    colour: "bg-blue-100 text-blue-700",
    title: "Sub-skill breakdown",
    desc: "Marking a paper tells you the score. The platform tells you that 'Vocab & Synonyms is 60%' and 'Code Sequences is 75%' — so you know exactly where to focus next, not just which subject to revise.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    colour: "bg-emerald-100 text-emerald-700",
    title: "Progress over time",
    desc: "One paper gives you one data point. Taking four readiness checks over six weeks shows you whether the preparation is working — and how fast the indicative readiness score is moving toward 121.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    colour: "bg-amber-100 text-amber-700",
    title: "Adaptive difficulty",
    desc: "Printed papers have a fixed difficulty. Our drill bank adapts — if your child is consistently getting Maths questions right, the platform moves them to harder ones. Coasting on easy questions doesn't build the skills that matter.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    colour: "bg-red-100 text-red-700",
    title: "Stamina analysis",
    desc: "The Bucks 11+ is timed and long. We compare accuracy in the first half versus the second half of every session — because many children don't realise their accuracy drops under sustained time pressure.",
  },
];

export default function FreeSamplePapers() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Seo
        title="Free Bucks 11+ Sample Papers – Two GL-Style Practice Papers with Answers"
        description="Download two free Bucks 11+ practice papers — 12 GL-style questions each, covering all four sections, with full worked explanations. No email required."
        canonicalPath="/bucks-11-plus-free-sample-papers"
        schema={[breadcrumbSchema(breadcrumbItems)]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-10 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-free-papers">
          Free Bucks 11+ Sample Papers
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Two GL-style practice papers — 12 questions each, covering all four subject areas, with full worked explanations. Download both below, no email required.
        </p>
      </div>

      {/* Download cards */}
      <div className="not-prose grid sm:grid-cols-2 gap-5 mb-12">
        {[
          {
            num: "Paper 1",
            subtitle: "Antonyms · Letter Sequence · Codes · Percentages · Time · Ratio · NVR Sequence · Odd One Out · Analogy · Comprehension (Antibiotics passage)",
            href: "/api/practice-paper/download",
            filename: "bucks-11-plus-free-practice-paper.pdf",
          },
          {
            num: "Paper 2",
            subtitle: "Synonyms · Compound Words · Letter Sequence · Area · Number Sequences · Fractions · NVR Rotation · Matrix · Reflection · Comprehension (Northern Lights passage)",
            href: "/api/practice-paper-2/download",
            filename: "bucks-11-plus-free-practice-paper-2.pdf",
          },
        ].map((paper) => (
          <div key={paper.num} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col" data-testid={`card-${paper.num.toLowerCase().replace(" ", "-")}`}>
            <div className="mb-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1">Free Download</span>
              <h2 className="text-xl font-bold text-primary font-serif">{paper.num}</h2>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-5 flex-1">{paper.subtitle}</p>
            <div className="space-y-2">
              <div className="flex gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>12 GL-style questions · all four subjects · worked explanations</span>
              </div>
              <div className="flex gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suggested 20 minutes · suitable for Year 4–5</span>
              </div>
            </div>
            <a
              href={paper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-sm px-5 py-3 hover:bg-primary/90 transition-colors"
              data-testid={`button-download-${paper.num.toLowerCase().replace(" ", "-")}`}
            >
              <ArrowDownToLine className="h-4 w-4" />
              Download {paper.num} (PDF)
            </a>
            <p className="text-[10px] text-slate-400 text-center mt-2">No email required · opens immediately</p>
          </div>
        ))}
      </div>

      <p className="not-prose text-[11px] text-slate-400 text-center mb-12 leading-relaxed">
        These are independent practice resources produced by Bucks 11 Plus Tests. They are not official Buckinghamshire Secondary Transfer Test papers and are not produced by or affiliated with GL Assessment or Buckinghamshire Council.
      </p>

      {/* Want them emailed? */}
      <div className="not-prose mb-14">
        <LeadMagnetBlock source="seo:free-sample-papers" />
      </div>

      {/* Why digital goes further */}
      <div className="prose prose-slate prose-lg max-w-none">
        <h2 className="text-primary font-serif">Why the digital platform goes further</h2>
        <p>
          Practice papers are a good start — working through questions on paper, against a clock, builds real familiarity with the format. But there's a limit to what a static paper can show you.
        </p>
      </div>

      <div className="not-prose space-y-4 my-8">
        {digitalAdvantages.map((adv, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 items-start" data-testid={`advantage-${i}`}>
            <div className={`p-2 rounded-lg shrink-0 ${adv.colour}`}>{adv.icon}</div>
            <div>
              <p className="font-bold text-primary text-sm mb-1">{adv.title}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{adv.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="not-prose rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center my-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-2">Start for free</p>
        <h3 className="text-2xl font-bold text-primary font-serif mb-3">See how your child compares — before you pay anything</h3>
        <p className="text-slate-500 text-sm mb-5 max-w-lg mx-auto">
          The free 12-question Readiness Check is timed, marked instantly, and returns a practice score on the 121 scale — plus the three sub-skills most worth focusing on next.
        </p>
        <Link
          href="/free-diagnostic"
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
          data-testid="button-cta-diagnostic"
        >
          Take the Free Readiness Check
        </Link>
        <p className="text-[11px] text-slate-400 mt-3">12 questions · 8 minutes · no account needed · instant results</p>
      </div>

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">More free 11+ resources</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/bucks-11-plus-practice-papers-free" className="text-primary hover:underline">Where to find genuinely free Bucks 11+ practice material</Link></li>
          <li><Link href="/free-11-plus-resources" className="text-primary hover:underline">Complete free 11+ resources library</Link></li>
          <li><Link href="/11-plus-mock-test-online-free" className="text-primary hover:underline">Free online 11+ mock test</Link></li>
          <li><Link href="/gl-assessment-question-types" className="text-primary hover:underline">Every GL Assessment question type explained</Link></li>
          <li><Link href="/11-plus-synonyms-list" className="text-primary hover:underline">11+ synonyms list</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

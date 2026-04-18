import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, MinusCircle, Target, BarChart3, Brain, Clock, Shield, Zap, BookOpen, TrendingUp } from "lucide-react";
import { Seo } from "../components/shared/Seo";

const whyChooseFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need to choose between practice papers and a platform for Bucks 11+ preparation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No — most families use both. Practice papers are excellent for building exam stamina and familiarity with the paper format. What they can't do is tell you which sub-topics are costing marks, why answers were wrong, or what to prioritise next. The platform provides a readiness estimate versus the 121 threshold, a sub-topic breakdown ranked by marks available, parent analytics, and a guided programme that adapts to your child's specific weaknesses. Papers and the platform are complementary tools, not alternatives."
      }
    },
    {
      "@type": "Question",
      "name": "Is this platform built specifically for the Buckinghamshire 11+?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — exclusively. Every question, every readiness check, and every benchmark is built for the Buckinghamshire Secondary Transfer Test and the 121 qualifying standard. This is not a generic 11+ platform repurposed for Bucks."
      }
    },
    {
      "@type": "Question",
      "name": "What does 121 mean in the Bucks 11+?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "121 is the standardised qualifying score for the Buckinghamshire Secondary Transfer Test. Children who achieve 121 or above are eligible to be considered for any of the 13 Buckinghamshire grammar schools."
      }
    }
  ]
};

type ComparisonRow = {
  feature: string;
  papers: string;
  papersIcon: "positive" | "neutral" | "none";
  platform: string;
};

const comparison: ComparisonRow[] = [
  {
    feature: "Exam-format familiarity",
    papers: "Excellent — paper format closely mirrors the actual STT experience",
    papersIcon: "positive",
    platform: "GL-style question families across all 4 domains · timed under exam conditions",
  },
  {
    feature: "Question volume",
    papers: "High — many books and packs available at low cost",
    papersIcon: "positive",
    platform: "1,500+ questions organised by sub-topic and difficulty",
  },
  {
    feature: "After a session, your child gets:",
    papers: "A raw mark and marked answers — helpful to review",
    papersIcon: "neutral",
    platform: "Readiness estimate vs 121 · readiness band · top 3 gaps by marks available",
  },
  {
    feature: "Parent insight",
    papers: "Whatever you gather by marking it yourself",
    papersIcon: "neutral",
    platform: "Full analytics dashboard: accuracy by sub-topic, stamina, and pace analysis",
  },
  {
    feature: "Feedback per question",
    papers: "Answer key — right or wrong, with model answers",
    papersIcon: "neutral",
    platform: "Instant explanation + difficulty rating + correct approach for every question",
  },
  {
    feature: "Adapts to your child",
    papers: "Fixed questions — same paper for every child, every time",
    papersIcon: "none",
    platform: "Weekly programme targets your child's specific sub-topic weaknesses",
  },
  {
    feature: "Bucks-specific benchmarking",
    papers: "Varies — many papers are generic; not all benchmark to 121",
    papersIcon: "none",
    platform: "Exclusively Bucks · every question benchmarked to the 121 qualifying threshold",
  },
  {
    feature: "Pacing & stamina analysis",
    papers: "Not available — you'd need to time each section manually",
    papersIcon: "none",
    platform: "Yes — shows if accuracy drops in the 2nd half of the test, and by how much",
  },
];

function ForecastPanel() {
  const subjects = [
    { label: "VR", score: 71, color: "bg-violet-500" },
    { label: "NVR", score: 54, color: "bg-blue-500" },
    { label: "Maths", score: 88, color: "bg-emerald-500" },
    { label: "Comp", score: 62, color: "bg-amber-500" },
  ];
  return (
    <div className="bg-slate-900 rounded-2xl p-5 text-white w-full max-w-[320px] shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Readiness Forecast</p>
          <p className="text-4xl font-bold font-serif leading-none mt-0.5">114 <span className="text-lg text-white/30 font-normal">/ 121</span></p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-amber-400 flex items-center justify-center">
            <span className="text-lg font-bold text-amber-400">A</span>
          </div>
          <p className="text-[9px] text-white/35 mt-1 font-medium uppercase tracking-wider">Borderline</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {subjects.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <p className="text-[10px] text-white/50 w-8 shrink-0">{s.label}</p>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
            </div>
            <p className="text-[10px] text-white/60 w-7 text-right">{s.score}%</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3">
        <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Top priority gap</p>
        <p className="text-xs font-semibold text-white">NVR: Matrices & Spatial Rotation</p>
        <p className="text-[10px] text-white/40 mt-0.5">Fix this first — worth an est. 4 marks</p>
      </div>
      <p className="text-[8px] text-white/20 italic text-center mt-3">Illustrative example</p>
    </div>
  );
}

export default function WhyChoosePlatform() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Practice Papers vs Platform for Bucks 11+? Use Both. | Bucks 11 Plus Tests"
        description="Practice papers build stamina. The platform shows you which sub-topics are costing marks, your readiness estimate versus 121, and exactly what to fix next. Built exclusively for the Buckinghamshire 11+."
        canonicalPath="/why-choose-bucks-11-plus-tests"
        schema={whyChooseFaqSchema}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }} data-testid="section-hero">
        <div className="absolute inset-0 z-0 hero-texture" />
        <div className="absolute inset-0 z-0 hero-vignette" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">Home</Link>
            <span className="text-white/25 text-xs">/</span>
            <span className="text-white/60 text-xs">Why Choose Us</span>
          </div>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80 mb-5">Papers + platform — used together</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] font-serif mb-5">
            Papers tell you the score. We tell you exactly what to fix.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
            Practice papers are great for building exam stamina and familiarity. What they can't do is tell you which sub-topics are costing marks, why answers were wrong, or what to prioritise next. That's what the platform does.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold border-none" asChild data-testid="button-hero-free">
              <Link href="/free-diagnostic">Free Readiness Check <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10 font-semibold" asChild data-testid="button-hero-platform">
              <Link href="/pricing">See the Platform</Link>
            </Button>
          </div>
          <p className="text-xs text-white/30 mt-5">Built exclusively for the Buckinghamshire 11+ · Benchmarked to 121</p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 md:py-20 bg-white border-b border-border/30" data-testid="section-comparison">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Side by side</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Papers and the platform — what each gives you</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Most families use both: papers for full-length exam simulation, and the platform to pinpoint and close the gaps between attempts.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider w-[36%]">What you're comparing</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Practice Papers</th>
                  <th className="text-left py-3 px-4 font-bold text-primary">Bucks 11 Plus Tests</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`} data-testid={`comparison-row-${i}`}>
                    <td className="py-3.5 px-4 text-slate-500 font-medium text-xs leading-relaxed">{row.feature}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        {row.papersIcon === "positive" && <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />}
                        {row.papersIcon === "neutral" && <MinusCircle className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />}
                        {row.papersIcon === "none" && <XCircle className="h-4 w-4 text-slate-200 shrink-0 mt-0.5" />}
                        <span className={`text-sm leading-relaxed ${row.papersIcon === "positive" ? "text-slate-700" : "text-slate-500"}`}>{row.papers}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-800 text-sm font-medium leading-relaxed">{row.platform}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4 italic">Practice papers and this platform are complementary tools — not alternatives. Papers build exam familiarity; the platform shows you exactly where to focus next.</p>
        </div>
      </section>

      {/* ── BUCKS-SPECIFIC SPECIALISATION ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-b border-border/30" data-testid="section-bucks-specific">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Exclusive focus</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Not a generic 11+ platform. Built for Buckinghamshire.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Most platforms cover "the 11+" broadly. We cover Buckinghamshire specifically — the test, the threshold, and the grammar schools.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {[
              { icon: BookOpen, color: "bg-violet-100 text-violet-700", title: "13 grammar schools", desc: "All 13 Buckinghamshire grammar schools use the same GL Assessment Secondary Transfer Test. Our content is aligned to exactly that format." },
              { icon: Target, color: "bg-amber-100 text-amber-700", title: "The 121 threshold", desc: "Every readiness check, every forecast, every benchmark is measured against 121 — the qualifying score for Bucks grammar school entry." },
              { icon: Brain, color: "bg-blue-100 text-blue-700", title: "GL Assessment format", desc: "VR, NVR, Maths, and Comprehension — all four GL Assessment domains, with question families that replicate the STT format independently." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm" data-testid={`bucks-point-${i}`}>
                <div className={`p-2.5 rounded-xl w-fit ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 text-center">
            <p className="text-primary font-semibold italic leading-relaxed max-w-2xl mx-auto">
              "Every question, every benchmark, every priority is aligned to what actually qualifies your child for a Bucks grammar school place."
            </p>
          </div>
        </div>
      </section>

      {/* ── THE INTELLIGENCE LAYER ── */}
      <section className="py-14 md:py-18 bg-white border-b border-border/30" data-testid="section-intelligence">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <ForecastPanel />
            </div>
            <div>
              <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-4">The intelligence layer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4 leading-tight">
                Papers tell you what your child scored. We show you what it means.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5">
                After every readiness check, you see an estimated readiness score versus the 121 qualifying threshold, the subjects costing the most marks, and the exact sub-topics to prioritise first — ranked by marks available.
              </p>
              <p className="text-slate-600 leading-relaxed mb-7">
                Practice papers tell you how many answers were right. We tell you <em>why</em> answers were wrong, which domain of the test it costs the most in, and what to work on before the next attempt.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Zap, text: "Readiness band (Green / Amber / Red) vs 121" },
                  { icon: BarChart3, text: "Sub-topic breakdown ranked by points available" },
                  { icon: Clock, text: "Pace & stamina analysis — does accuracy drop late in the test?" },
                  { icon: TrendingUp, text: "Forecast score updates after every session" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3" data-testid={`intelligence-point-${i}`}>
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <item.icon className="h-4 w-4 text-amber-700" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PARENTS ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-b border-border/30" data-testid="section-parents">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">For parents</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-3">Finally, real visibility.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">You've always known your child is working hard. Now you can see exactly where that work is going.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart3,
                color: "bg-violet-100 text-violet-700",
                title: "Know where to focus",
                desc: "The analytics dashboard shows what's costing marks, not just how many questions were done. You see which sub-topics need attention and how many points they're worth.",
              },
              {
                icon: Clock,
                color: "bg-amber-100 text-amber-700",
                title: "Anytime, anywhere",
                desc: "No printing, no waiting, no marking. The platform runs on any device. Your child can do a 15-minute targeted session on a tablet before school.",
              },
              {
                icon: Shield,
                color: "bg-emerald-100 text-emerald-700",
                title: "Built for busy families",
                desc: "15-minute targeted sessions recommended by the guided programme — not hours of generic papers. Preparation that fits around real family life.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm" data-testid={`parent-benefit-${i}`}>
                <div className={`p-2.5 rounded-xl w-fit ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-primary" data-testid="section-cta">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">See the difference for yourself — it's free.</h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">No account needed. 8 minutes. Get a readiness forecast, a band, and 3 specific things to fix first.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-bold bg-amber-400 text-amber-950 hover:bg-amber-300 border-none" asChild data-testid="button-cta-final">
              <Link href="/free-diagnostic"><ArrowRight className="mr-2 h-5 w-5" />Start Free Readiness Check</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 font-semibold border-white/25 text-white hover:bg-white/10" asChild data-testid="button-cta-pricing">
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>
          <p className="text-xs text-white/25 mt-6">
            Independent · Not affiliated with GL Assessment or Buckinghamshire Council · Operated by Ianson Systems Limited
          </p>
        </div>
      </section>

    </div>
  );
}

import { Seo } from "../components/shared/Seo";
import { Link } from "wouter";
import { Building2, Mail, ShieldCheck, Brain, Layers, Hash, BookOpen, Target, Clock, BarChart3, Users, CheckCircle2, TrendingUp } from "lucide-react";

const stats = [
  { value: "1,500+", label: "Practice questions" },
  { value: "4", label: "Test domains covered" },
  { value: "121", label: "The qualifying benchmark" },
  { value: "Free", label: "Diagnostic — no account needed" },
];

const domains = [
  { icon: Brain, label: "Verbal Reasoning", color: "text-violet-600 bg-violet-50 border-violet-100" },
  { icon: Layers, label: "Non-Verbal Reasoning", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { icon: Hash, label: "Mathematics", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { icon: BookOpen, label: "English Comprehension", color: "text-amber-600 bg-amber-50 border-amber-100" },
];

const principles = [
  { icon: Target, heading: "Assessment first", body: "We start with a diagnostic — not a worksheet. Understanding exactly where the gaps are is worth more than hours of unfocused practice." },
  { icon: Clock, heading: "Pace matters as much as accuracy", body: "A question answered correctly in 90 seconds is a failed question in a 35-second-per-item test. We track both." },
  { icon: BarChart3, heading: "Benchmarked to 121", body: "Every result, every forecast, and every priority is framed around the real qualifying threshold — the only number that actually matters." },
  { icon: Users, heading: "Parents as partners", body: "We do not hide data behind jargon. Parents receive the same clear, direct information we would want if it were our own child." },
];

export default function About() {
  return (
    <div>
      <Seo
        title="About 11+ Standard | Bucks 11 Plus Diagnostic & Preparation Platform"
        description="11+ Standard is an independent Buckinghamshire 11+ preparation platform — operated by Ianson Systems Limited — helping parents understand their child's readiness and close the gap to 121."
        canonicalPath="/about"
      />

      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 pt-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0 opacity-60" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-2xl tracking-tight">11+</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] opacity-50 mt-0.5">Standard</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4">
            About 11+ Standard
          </h1>
          <p className="text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">
            An independent Buckinghamshire 11+ preparation platform — giving every family the clearest possible picture of where their child stands and exactly what needs to happen next to reach 121.
          </p>
        </div>

        <div className="border-t border-primary-foreground/10">
          <div className="container mx-auto max-w-4xl px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold font-serif text-primary-foreground">{s.value}</div>
                <div className="text-xs text-primary-foreground/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-14 prose prose-slate prose-lg">

        <h2 className="text-primary font-serif">The Problem</h2>
        <p>
          Most families preparing for the Buckinghamshire Secondary Transfer Test are working hard. They buy practice books, sign up for mock exams, maybe hire a tutor. The preparation is real. The commitment is real.
        </p>
        <p>
          But the one question that matters most — <strong>"Is my child actually on track?"</strong> — almost never gets a straight answer. Generic mock papers return a raw score with no benchmark. Tutors offer reassurance but rarely structured forecasting. And the first time many families find out the preparation wasn't targeted enough is in October of Year 6, when the result arrives.
        </p>
        <p>
          By then, there is nothing left to do. 11+ Standard exists to make sure that moment never comes as a surprise.
        </p>

        <h2 className="text-primary font-serif">Our Approach</h2>
        <p>
          11+ Standard is an assessment-first platform. Practice without direction is wasted time — so we start with a diagnostic that measures not just accuracy, but pacing: whether your child is working at the speed the real test demands, and where within each subject the gaps are concentrated.
        </p>
        <p>
          From that baseline, every drill session, every full-length timed paper, and every progress review is oriented around a single number: 121.
        </p>
      </div>

      <div className="bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-xl font-bold font-serif text-primary mb-6">Four principles behind everything we build</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {principles.map((p) => (
              <div key={p.heading} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
                <div className="bg-primary/8 rounded-lg p-2.5 shrink-0 h-fit">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm mb-1">{p.heading}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-14 prose prose-slate prose-lg">

        <h2 className="text-primary font-serif">How Our Questions Are Built</h2>
        <p>
          Every question in our bank follows the question format used in the Buckinghamshire Secondary Transfer Test, spanning all four assessed domains. Questions are weighted across difficulty levels to reflect the real distribution children face in the test itself — not just a library of easy practice problems.
        </p>
        <p>
          Our question bank and diagnostic methodology were developed with input from an experienced UK primary school leader with specialist expertise in Year 6 and the transition into selective grammar education. This is an educator who understands, from the classroom, what children at this level are genuinely assessed on, where preparation commonly falls short, and what reaching 121 actually demands in practice.
        </p>
      </div>

      <div className="bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-xl font-bold font-serif text-primary mb-2">All four Buckinghamshire 11+ domains</h2>
          <p className="text-sm text-slate-500 mb-6">Our question bank and diagnostic engine cover every section of the Secondary Transfer Test.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((d) => (
              <div key={d.label} className={`rounded-xl border p-5 flex flex-col items-center text-center gap-3 bg-white ${d.color.split(" ").filter(c => c.startsWith("border")).join(" ")}`}>
                <div className={`rounded-full p-3 ${d.color.split(" ").filter(c => !c.startsWith("text") && !c.startsWith("border")).join(" ")}`}>
                  <d.icon className={`h-5 w-5 ${d.color.split(" ").filter(c => c.startsWith("text")).join(" ")}`} />
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-snug">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-14 prose prose-slate prose-lg">

        <h2 className="text-primary font-serif">What This Platform Is — and Isn't</h2>
        <ul>
          <li className="flex gap-2 items-start not-prose mb-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-slate-700">A structured preparation platform — not a tutoring agency. We do not provide one-to-one sessions or personalised coaching calls.</span></li>
          <li className="flex gap-2 items-start not-prose mb-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-slate-700">Works well alongside a tutor. Many families use 11+ Standard to fill the hours between sessions with directed, evidence-backed practice.</span></li>
          <li className="flex gap-2 items-start not-prose mb-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-slate-700">Fully independent. No affiliation with GL Assessment, Buckinghamshire Council, or any of the 13 Buckinghamshire grammar schools.</span></li>
          <li className="flex gap-2 items-start not-prose"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span className="text-slate-700">Does not guarantee a grammar school place. No platform can. What it does is give your child the best-structured, most targeted preparation available.</span></li>
        </ul>

        <p className="text-sm text-slate-500 not-italic mt-6">
          Preparing for 11+ outside Buckinghamshire?{" "}
          <a href="https://11plustesthub.co.uk" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">11plusTestHub.co.uk</a>{" "}
          covers 11+ preparation for grammar schools across England.
        </p>

        <div className="not-prose my-10 rounded-2xl bg-primary/5 border border-primary/15 p-7 flex gap-5 items-start">
          <div className="bg-primary rounded-xl p-3 shrink-0">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold font-serif text-primary mb-1">Why 121?</p>
            <p className="text-slate-600 leading-relaxed text-sm">
              The raw score from the Buckinghamshire Secondary Transfer Test is converted into a standardised score that accounts for each child's age at the time of the test. The resulting standardised score runs from roughly 69 to 141, with <strong className="text-primary">121 being the threshold</strong> at which a child is considered to have demonstrated the ability required for grammar school entry. Every diagnostic result, readiness forecast, and progress view in 11+ Standard is framed against this number — because it is the only number on which the decision is made.
            </p>
          </div>
        </div>

        <h2 className="text-primary font-serif">Independence and Data</h2>
        <p>
          11+ Standard collects practice performance data — question-level responses, timing, diagnostic scores, and progress across sessions — for the sole purpose of generating the readiness forecasts, analytics, and guided practice that parents and children use on the platform. This data is never sold, never shared with third parties, and is not passed to schools, local authorities, or GL Assessment under any circumstances.
        </p>
        <p>
          We are not affiliated with GL Assessment, Buckinghamshire Council, or any grammar school. The "GL-style" label refers to the question format we use, which replicates the structure of the real test — it does not imply any formal relationship with GL Assessment Ltd.
        </p>
      </div>

      <div className="container mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="bg-primary px-7 py-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary-foreground/80 shrink-0" />
            <h2 className="text-lg font-bold font-serif text-primary-foreground m-0">Platform Operator</h2>
          </div>
          <div className="px-7 py-6 space-y-5">
            <p className="text-slate-700 leading-relaxed">
              11+ Standard is operated by <strong className="text-primary">Ianson Systems Limited</strong>, a UK-based company that develops educational tools and diagnostic assessment platforms to support 11+ preparation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-0.5">Registered in England &amp; Wales</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Ianson Systems Limited is a UK-registered private limited company.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-0.5">Contact &amp; Support</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    For enquiries, please use our{" "}
                    <Link href="/contact" className="text-primary hover:underline font-medium">contact form</Link>.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-200 pt-4">
              11+ Standard is an independent platform. Ianson Systems Limited has no affiliation with GL Assessment, Buckinghamshire Council, The Buckinghamshire Grammar Schools (TBGS), or any individual grammar school.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "../components/shared/Breadcrumbs";
import { Disclaimer } from "../components/shared/Disclaimer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, Clock, BarChart3, CheckCircle2, Download, Zap } from "lucide-react";
import { DashboardPreviewForecast, DashboardPreviewPace, DashboardPreviewTrajectory } from "../components/shared/DashboardPreview";
import { apiRequest } from "../lib/queryClient";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Parent Guide" },
];

const faqItems = [
  {
    question: "What is the Bucks 11 plus test?",
    answer: "The Buckinghamshire 11+ (formally the Secondary Transfer Test) is a selective assessment sat by children in Year 6 who wish to attend one of the 13 grammar schools in Buckinghamshire. It tests verbal reasoning, non-verbal reasoning, mathematical reasoning, and English comprehension under timed conditions.",
  },
  {
    question: "What score do you need to pass the Bucks 11 plus?",
    answer: "Children need to achieve a standardised score of 121 or above to qualify for grammar school consideration. This score is age-adjusted, meaning it accounts for the child's exact age in years and months at the time of the test.",
  },
  {
    question: "When do children take the Bucks 11 plus?",
    answer: "Children sit the test in September of Year 6. Registration typically opens in May/June of Year 5, and results are released in mid-October of Year 6. Parents then submit school preference forms as part of the national coordinated admissions process.",
  },
  {
    question: "How should parents prepare for the Bucks 11 plus?",
    answer: "Effective preparation focuses on building familiarity with the four assessed domains (verbal reasoning, non-verbal reasoning, mathematics, and English comprehension) and developing pace discipline under timed conditions. A diagnostic approach that identifies specific skill gaps is more effective than generic practice papers alone.",
  },
];

export default function ParentGuide() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !email.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/guide-leads", { parentName: parentName.trim(), email: email.trim() });
      const data = await res.json();
      setLeadId(data.id);
      setSubmitted(true);
      const link = document.createElement("a");
      link.href = "/bucks-11-plus-parent-guide.pdf";
      link.download = "bucks-11-plus-parent-guide.pdf";
      link.click();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const schema = [
    breadcrumbSchema(breadcrumbItems),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": { "@type": "Answer", "text": q.answer },
      })),
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo
        title="Free Bucks 11+ Parent Guide (2026) | Download PDF | 11+ Standard"
        description="Free downloadable guide for parents preparing for the Bucks 11+ Secondary Transfer Test. Covers the 13 grammar schools, the qualifying score of 121, the admissions timeline, and how to assess your child's readiness."
        canonicalPath="/bucks-11-plus-parent-guide"
        schema={schema}
      />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-border/50" style={{ backgroundColor: '#0d1f30' }}>
        <div className="absolute inset-0 z-0 hero-texture"></div>
        <div className="absolute inset-0 z-0 hero-vignette"></div>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 100%)' }}></div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
              <BookOpen className="h-4 w-4 text-brand-amber" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Free Download</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] font-serif max-w-4xl mx-auto" data-testid="text-guide-title">
              Free Buckinghamshire <br className="hidden md:block" />
              <span className="text-white/55">11+ Parent Guide</span>
            </h1>

            <p className="text-lg md:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
              Understand how the Bucks grammar school test works and how to assess your child's readiness.
            </p>

            <ul className="max-w-md mx-auto text-left space-y-3 pt-4">
              {[
                "The 13 Buckinghamshire grammar schools",
                "The qualifying score of 121 explained",
                "The admissions timeline for parents",
                "How readiness can be measured before the test",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-8">
              <Button size="lg" className="h-14 px-10 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 font-bold shadow-lg shadow-brand-amber/15 border-none" onClick={scrollToForm} data-testid="button-hero-download">
                Download the Free Guide <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 to-white py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight" data-testid="text-what-guide-explains">
              What the Guide Explains
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif mb-2">Understanding the Bucks System</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn how the Buckinghamshire Secondary Transfer Test works and how grammar school admissions are organised across the county.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif mb-2">The Qualifying Score</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Understand how the score of 121 is calculated and how the standardisation process adjusts for age differences within the cohort.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif mb-2">Preparation Strategy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn what successful preparation focuses on: reasoning ability, timing discipline, and consistency across all four assessed domains.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary/50 uppercase tracking-widest">Preview</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mt-2">
              Inside the Guide
            </h2>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">The Buckinghamshire Grammar Schools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Thirteen grammar schools jointly administer the test through The Buckinghamshire Grammar Schools (TBGS) organisation. The guide explains each school's location, type, and how their individual oversubscription criteria determine which children are offered places after qualifying.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">Understanding the Score of 121</h3>
              <p className="text-muted-foreground leading-relaxed">
                Scoring 121 qualifies a child for grammar school consideration but does not guarantee a place. The guide explains how raw scores are converted to standardised scores, how age adjustment works, and what the 121 threshold means in practice for individual schools.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-primary font-serif mb-3">The Preparation Timeline</h3>
              <p className="text-muted-foreground leading-relaxed">
                Preparation typically develops from awareness in Year 4 through structured practice in Year 5 to test readiness in Year 6. The guide outlines what each phase involves and how families can approach the timeline without unnecessary pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary/50 uppercase tracking-widest">For Parents</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mt-2" data-testid="text-tips-heading">
              Supporting Your Child's Preparation
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
              Practical strategies that make a real difference — backed by what works for Buckinghamshire families.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Little and Often Beats Cramming</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                20–30 minutes of focused practice 4–5 times per week is far more effective than long weekend sessions. Consistency builds familiarity with question types and reduces test-day anxiety.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Focus on Weaknesses, Not Strengths</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Children naturally gravitate towards what they're good at. Use diagnostic results to identify the specific areas where targeted practice will have the biggest impact on their overall score.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Practise Under Timed Conditions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The real exam is strictly timed. Start with untimed practice to build accuracy, then introduce time limits gradually. This builds pace discipline without creating pressure too early.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Review Mistakes Together</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When your child gets a question wrong, work through the explanation together. Understanding why an answer is wrong is often more valuable than getting it right first time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Keep the Pressure Proportionate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your child should feel supported, not stressed. Frame preparation as building skills rather than "passing or failing." Children who feel confident perform better under exam conditions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-primary font-serif">Start Earlier Than You Think</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Year 4 is not too early for gentle familiarisation. Building reasoning skills early means Year 5 and 6 preparation is refining ability rather than learning from scratch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="platform-preview" className="bg-gradient-to-b from-slate-50 to-white py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/[0.03] mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Platform Preview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight" data-testid="text-platform-preview">
              How the Platform Measures Readiness
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Many families complete large numbers of practice questions but struggle to understand whether performance is genuinely improving. Instead of guessing whether preparation is working, our platform analyses accuracy, timing, and performance stability across reasoning skills.
            </p>
          </div>

          <DashboardPreviewForecast />
          <p className="text-center text-xs text-muted-foreground mt-3">Readiness forecast after an 8-minute diagnostic assessment</p>

          <div className="mt-14 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary font-serif mb-4">Identifying Specific Skill Gaps</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The platform identifies specific reasoning skill gaps across verbal reasoning rule types, non-verbal reasoning patterns, and mathematical reasoning skills — highlighting the areas that most influence readiness for the qualifying score.
            </p>
          </div>

          <DashboardPreviewPace />
          <p className="text-center text-xs text-muted-foreground mt-3">Impact simulator, pace discipline, sub-skill heatmap, and fatigue analysis</p>

          <div className="text-center mt-10">
            <Button size="lg" className="h-14 px-10 text-lg bg-brand-amber text-white hover:bg-brand-amber/90 font-bold shadow-lg shadow-brand-amber/15 border-none" asChild data-testid="button-platform-diagnostic">
              <Link href="/free-diagnostic">
                Start Free Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/[0.03] mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Full Programme</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight">
                What the Full Programme Includes
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Preparation becomes structured and measurable rather than relying solely on practice questions.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Structured skill drills targeting specific weaknesses",
                  "Full-length mock exams under timed conditions",
                  "Milestone diagnostics to track improvement",
                  "Readiness tracking dashboard for parents",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="outline" asChild className="h-11 px-6" data-testid="button-view-pricing">
                  <Link href="/pricing">View Plans & Pricing</Link>
                </Button>
              </div>
            </div>
            <div>
              <DashboardPreviewTrajectory />
              <p className="text-center text-xs text-muted-foreground mt-3">Score trajectory and stability tracking across multiple assessments</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 to-white py-14 md:py-20 border-b border-slate-100" ref={formRef}>
        <div className="container mx-auto max-w-xl px-4">
          <div className="rounded-2xl border border-primary/15 bg-white p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary font-serif" data-testid="text-download-heading">
                Download Your Free Guide
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your details below and we'll send you the guide immediately.
              </p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4" data-testid="guide-download-success">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <p className="font-semibold text-primary">Your guide is downloading.</p>
                <p className="text-sm text-muted-foreground">
                  Want to see where your child stands right now?
                </p>
                <Button
                  className="h-11 px-6 bg-brand-amber text-white hover:bg-brand-amber/90 font-semibold"
                  data-testid="button-post-download-diagnostic"
                  onClick={() => {
                    if (leadId) {
                      fetch(`/api/guide-leads/${leadId}/diagnostic-click`, { method: "POST" }).catch(() => {});
                    }
                    window.location.href = "/free-diagnostic";
                  }}
                >
                  Start Free Diagnostic <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-guide-download">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Parent First Name
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="Your first name"
                    data-testid="input-parent-name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="your@email.com"
                    data-testid="input-email"
                  />
                </div>
                {error && <p className="text-sm text-red-600" data-testid="text-form-error">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full h-12 bg-brand-amber text-white hover:bg-brand-amber/90 font-bold text-base" data-testid="button-submit-guide">
                  {submitting ? "Sending..." : "Send My Free Guide"}
                  {!submitting && <Download className="ml-2 h-5 w-5" />}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-primary font-serif tracking-tight text-center mb-10" data-testid="text-faq-heading">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6" data-testid={`faq-item-${i}`}>
                <h3 className="text-lg font-bold text-primary font-serif mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              For a comprehensive overview, read our{" "}
              <Link href="/buckinghamshire-11-plus-guide" className="text-primary font-medium hover:underline">
                Complete Buckinghamshire 11+ Guide
              </Link>.
            </p>
          </div>
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}

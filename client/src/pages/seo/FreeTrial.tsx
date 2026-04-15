import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Seo } from "../../components/shared/Seo";
import {
  CheckCircle2, Clock, Shield, Zap, Target, BarChart3,
  BookOpen, Trophy, ArrowRight, ChevronDown, Star
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: BookOpen, title: "1,500+ GL-Style Questions", desc: "Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension — mapped to the Buckinghamshire 11+ format." },
  { icon: Target, title: "All Diagnostics Unlocked", desc: "Full timed 40-question diagnostics and mini-diagnostics with GL-style standardised scoring against the 121 threshold." },
  { icon: Zap, title: "All 17 Hard Challenge Drills", desc: "The hardest-tier targeted drills across every subject — the ones that push children from \"Within Reach\" to qualifying." },
  { icon: BarChart3, title: "Premium Analytics Dashboard", desc: "Section-by-section breakdowns, pace analysis, and a forecast score calibrated against the real qualifying standard." },
  { icon: Trophy, title: "Mock Exam Simulations", desc: "Full timed mock exams under real GL-style exam conditions — the closest practice to the actual test day." },
  { icon: Star, title: "Weekly Task Plans & Roadmap", desc: "Auto-generated weekly focus plans based on diagnostic results, so you always know what to practice next." },
];

const steps = [
  { n: "1", title: "Unlock the platform", desc: "Enter your card details — nothing is charged. Stripe securely holds your card for the 7-day period." },
  { n: "2", title: "Full access from day one", desc: "Your child gets immediate access to the complete Diagnostic & Practice Hub — every diagnostic, every Hard drill, analytics, and all 1,500+ GL-style questions." },
  { n: "3", title: "After 7 days, your choice", desc: "If you're happy, do nothing — £59.99/month is charged automatically. If not, cancel before day 7 and pay absolutely nothing." },
];

const faqs = [
  {
    q: "Is my card actually charged when I start the trial?",
    a: "No. Your card is captured by Stripe to verify it's valid, but nothing is charged during the 7-day trial. The first charge of £59.99 only happens on day 7 if you don't cancel.",
  },
  {
    q: "How do I cancel before the trial ends?",
    a: 'Log in, go to your Account page, and click "Manage billing & cancel trial." This opens the Stripe Billing Portal where you can cancel instantly. You keep full access until the trial ends.',
  },
  {
    q: "Can I get a second free trial with a different email?",
    a: "Stripe ties trials to the payment method, not just the email address. Using the same card on a new account will not give a second trial. Using a completely different card is possible but we reserve the right to revoke access if we detect abuse.",
  },
  {
    q: "What happens if I forget to cancel?",
    a: "You'll receive a reminder email 3 days before the trial ends with the exact charge date and a link to cancel. If the charge goes through, you're subscribed monthly at £59.99 and can cancel at any time from your account page.",
  },
  {
    q: "Is this specifically for Buckinghamshire 11+?",
    a: "Yes. Every question is GL-style and calibrated against Buckinghamshire's 121 qualifying score. The content covers Verbal Reasoning, Non-Verbal Reasoning, Mathematics and English Comprehension in the same proportions as the real Bucks test.",
  },
  {
    q: "What year groups is this suitable for?",
    a: "Most families start in Year 4 or Year 5. The question difficulty range covers children from first-introduction level up to exam-ready, so it works well whether you're beginning preparation or in the final stretch.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-${q.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="font-medium text-primary text-sm leading-snug">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FreeTrial() {
  return (
    <div className="bg-white">
      <Seo
        title="7-Day Free Trial — Bucks 11+ Diagnostic & Practice Hub | Bucks 11 Plus Tests"
        description="Get 7-day free access to the complete Bucks 11+ Diagnostic & Practice Hub — 1,500+ GL-style questions, full diagnostics, all Hard drills, and premium analytics. No charge for 7 days. Cancel anytime."
      />

      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold text-white/90 mb-6">
            <Clock className="h-4 w-4 text-brand-amber" />
            Full Platform Access — No Charge for 7 Days
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight">
            The Bucks 11+ Diagnostic<br className="hidden md:block" /> & Practice Hub. 7 Days Free.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            This isn't a practice test sampler — it's full access to the complete interactive platform. Your child gets every diagnostic, every Hard drill, premium analytics, and 1,500+ GL-style questions from the moment you start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold text-base shadow-lg"
              data-testid="button-hero-start-trial"
            >
              <Link href="/pricing?autoCheckout=pack_plus">
                Start Free Trial — Full Platform Access <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white"
              data-testid="button-hero-free-diagnostic"
            >
              <Link href="/free-diagnostic">Try Free Diagnostic First</Link>
            </Button>
          </div>
          <p className="text-white/50 text-xs mt-4">Card required · £59.99/month after trial · Cancel anytime before day 7</p>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary text-center mb-3">
            Everything in the Hub — Unlocked for 7 Days
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10 text-sm">
            Not a preview, not a sample. Your child gets identical access to a full paid subscriber across the entire platform — every tool, every diagnostic, every drill.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="rounded-xl border border-border/60 p-5 bg-slate-50/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-border/40 bg-slate-50/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary text-center mb-10">
            How It Works
          </h2>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 items-start pb-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {step.n}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 bg-border flex-1 mt-2 min-h-[2rem]" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-semibold text-primary mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl bg-primary px-8 py-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-brand-amber" />
              <span className="text-brand-amber font-bold text-sm uppercase tracking-wider">Zero Risk</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4">
              Card captured. Nothing charged until day 7.
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Day 1", value: "Full access starts", sub: "No charge" },
                { label: "Day 4–5", value: "Reminder email", sub: "3 days warning" },
                { label: "Day 7", value: "£59.99 or cancel", sub: "Your choice" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white font-bold text-sm">{item.value}</p>
                  <p className="text-white/60 text-xs">{item.sub}</p>
                </div>
              ))}
            </div>
            <Button
              asChild
              size="lg"
              className="h-13 px-10 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold"
              data-testid="button-mid-start-trial"
            >
              <Link href="/pricing?autoCheckout=pack_plus">
                Start Free Trial — Full Platform Access <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-white/40 text-xs mt-3">Cancel before day 7 and you pay nothing. Stripe secures your card but doesn't charge it.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-border/40 bg-slate-50/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary text-center mb-3">
            Why Bucks-Specific Matters
          </h2>
          <p className="text-muted-foreground text-center text-sm max-w-xl mx-auto mb-10">
            Generic 11+ apps cover all regions. We focus exclusively on Buckinghamshire — which has a specific GL Assessment format and a 121 qualifying score threshold that general resources don't target accurately.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "GL-Assessment style questions", desc: "Every question is designed to match the format, timing, and question type distribution of the real Buckinghamshire test." },
              { title: "121 qualifying benchmark", desc: "All forecasts are calibrated against the 121 score. You see exactly how many points your child needs, not a percentage." },
              { title: "Four-section coverage", desc: "Verbal Reasoning, Non-Verbal Reasoning, Mathematics and English Comprehension — weighted exactly as in the Bucks test." },
              { title: "Bucks-specific preparation", desc: "Content covers the specific skills, question types and difficulty levels that Buckinghamshire grammar schools use to select pupils." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 rounded-xl border border-border/60 bg-white">
                <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary text-center mb-10">
            Common Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            Give Your Child the Full Platform — Free for 7 Days
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            Full access to the Bucks 11+ Diagnostic & Practice Hub. Card required to start — nothing charged until day 7. Cancel instantly if it's not right for you.
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-12 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold text-base"
            data-testid="button-footer-start-trial"
          >
            <Link href="/pricing?autoCheckout=pack_plus">
              Start Free Trial — Full Platform Access <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-white/40 text-xs mt-4">
            By starting a trial you agree to our{" "}
            <Link href="/legal" className="underline hover:text-white/70">Terms of Service</Link>.
            Operated by Ianson Systems Limited.
          </p>
        </div>
      </section>
    </div>
  );
}

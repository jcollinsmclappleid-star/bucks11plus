import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";

const benefits = [
  "2,500+ GL-style questions across all four test subjects",
  "Full 40q and 50q timed mock exams",
  "All Hard-level drills across every subject",
  "Parent analytics dashboard — track progress by topic",
  "PDF readiness reports after every session",
  "Works on phone, tablet or laptop — practice anywhere",
];

export function SubscribeCTA() {
  return (
    <div className="not-prose my-10 rounded-2xl overflow-hidden shadow-lg" data-testid="banner-subscribe-cta">
      <div className="bg-primary px-7 py-7 md:px-9 md:py-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-brand-amber" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber">Bucks Plus Edge — Full Platform Access</span>
        </div>
        <h3 className="text-2xl md:text-[1.65rem] font-bold font-serif text-white mb-2 leading-snug">
          The Complete Bucks 11+ Preparation Platform
        </h3>
        <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-2xl">
          Everything your child needs to prepare for the Buckinghamshire 11+ — intelligent readiness checks, structured drills, detailed parent analytics, and mock exam simulations. Practice scores shown on the 121 scale Bucks parents know.
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/85">
              <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <Button
            asChild
            className="h-11 px-6 bg-brand-amber text-amber-950 hover:bg-brand-amber/90 font-bold shadow-sm"
            data-testid="button-subscribe-cta-pricing"
          >
            <Link href="/pricing">
              See Plans &amp; Start Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-11 px-6 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40"
            data-testid="button-subscribe-cta-diagnostic"
          >
            <Link href="/free-diagnostic">Try Free Readiness Check First</Link>
          </Button>
          <span className="text-white/45 text-xs sm:ml-1">From £35/month · Cancel anytime · No lock-in</span>
        </div>
      </div>
    </div>
  );
}

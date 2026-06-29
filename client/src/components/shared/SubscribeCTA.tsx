import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Zap, ChevronsDown } from "lucide-react";
import { SampleQuestionsCarousel } from "./SampleQuestionsCarousel";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
  PRICING_ANCHOR_SUBLINE,
} from "@/lib/marketing";

const benefits = [
  "121-scale practice score forecast parents understand",
  "Dashboard showing weak sections and question types",
  "Pace analysis so timing risk is visible early",
  "2,500+ GL-style questions and full mock exams",
  "Unlimited practice papers — Quick, Full & Mock formats",
  "PDF reports and progress tracking for parent oversight",
];

export function SubscribeCTA() {
  return (
    <div className="not-prose my-10 rounded-2xl overflow-hidden shadow-lg border border-primary/10" data-testid="banner-subscribe-cta">
      <div className="bg-primary px-7 py-7 md:px-9 md:py-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-brand-amber" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber">Bucks Plus Edge — Full Platform Access</span>
        </div>
        <h3 className="text-2xl md:text-[1.65rem] font-bold font-serif text-white mb-2 leading-snug">
          See exactly what you are buying before you subscribe.
        </h3>
        <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-2xl">
          Browse practice papers, mock exams, timed drills, and parent dashboards built for the Buckinghamshire 11+. Then try a free 12-question practice test — no account needed.
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
          <Button asChild variant="cta" data-testid="button-subscribe-cta-pricing">
            <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
              {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-11 px-6 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40"
            data-testid="button-subscribe-cta-diagnostic"
          >
            <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
          </Button>
          <span className="text-white/45 text-xs sm:ml-1">{PRICING_ANCHOR_SUBLINE}</span>
        </div>
      </div>

      <div className="bg-white px-5 py-6 md:px-8 md:py-7 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-4">
          <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0" />
          <span className="font-medium text-center">Example practice questions from the platform</span>
          <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0" />
        </div>
        <SampleQuestionsCarousel />
      </div>
    </div>
  );
}

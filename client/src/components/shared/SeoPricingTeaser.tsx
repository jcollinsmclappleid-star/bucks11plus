import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  GET_FULL_ACCESS_CTA,
  PRICING_ANNUAL_LABEL,
  PRICING_ANNUAL_SAVINGS_NOTE,
  PRICING_FROM_HEADLINE,
  PRICING_FROM_LABEL,
  PRICING_MONTHLY_LABEL,
  SEE_PLANS_PRICING_CTA,
} from "@/lib/marketing";

const highlights = [
  "2,500+ GL-style questions & full mock exams",
  "Parent dashboard on the 121 qualifying scale",
  "Unlimited practice papers · cancel anytime",
];

type SeoPricingTeaserProps = {
  className?: string;
  compact?: boolean;
};

/** Clear pricing anchor for SEO / guide pages — shown above product mockups. */
export function SeoPricingTeaser({ className = "", compact = false }: SeoPricingTeaserProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.07] via-white to-amber-50/50 p-5 md:p-6 shadow-lg shadow-primary/5 ${className}`}
      data-testid="seo-pricing-teaser"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
              Bucks Plus Edge — full platform access
            </p>
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-primary leading-snug">
            {compact
              ? `Full Bucks 11+ preparation ${PRICING_FROM_HEADLINE}`
              : `See exactly what you get — then subscribe ${PRICING_FROM_HEADLINE}`}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Browse the practice suite and parent dashboards below, try the free 12-question test, then unlock everything when you are ready.
          </p>
          {!compact && (
            <ul className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 rounded-xl border border-primary/15 bg-white px-5 py-4 text-center shadow-sm lg:min-w-[230px]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">From</p>
          <p className="text-3xl md:text-4xl font-bold font-serif text-primary leading-none">{PRICING_FROM_LABEL}</p>
          <p className="mt-1.5 text-xs text-slate-500">on annual billing ({PRICING_ANNUAL_LABEL})</p>
          <p className="mt-2 text-sm text-slate-600">
            or <span className="font-semibold text-primary">{PRICING_MONTHLY_LABEL}</span> monthly
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1.5">{PRICING_ANNUAL_SAVINGS_NOTE}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="cta" asChild className="w-full" data-testid="button-seo-pricing-teaser-plans">
              <Link href="/pricing">
                {SEE_PLANS_PRICING_CTA} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full border-primary/20 text-primary font-semibold"
              data-testid="button-seo-pricing-teaser-access"
            >
              <Link href="/pricing">{GET_FULL_ACCESS_CTA}</Link>
            </Button>
            <Link
              href={FREE_PRACTICE_TEST_PATH}
              className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
              data-testid="link-seo-pricing-teaser-free"
            >
              {FREE_PRACTICE_TEST_CTA} first →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact pricing bar for mid-article CTAs and inline SEO placements. */
export function SeoPricingBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border-2 border-primary/15 bg-gradient-to-r from-primary/[0.06] to-amber-50/40 px-4 py-4 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
      data-testid="seo-pricing-bar"
    >
      <div className="min-w-0">
        <p className="text-lg md:text-xl font-bold font-serif text-primary leading-tight">
          Bucks Plus Edge — {PRICING_FROM_HEADLINE}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          {PRICING_ANNUAL_LABEL} billed annually · or {PRICING_MONTHLY_LABEL} monthly · {PRICING_ANNUAL_SAVINGS_NOTE}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
        <Button variant="cta" size="sm" asChild className="w-full sm:w-auto" data-testid="button-seo-pricing-bar-plans">
          <Link href="/pricing">
            {SEE_PLANS_PRICING_CTA} <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto border-primary/20 text-primary font-semibold" data-testid="button-seo-pricing-bar-free">
          <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
        </Button>
      </div>
    </div>
  );
}

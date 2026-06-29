import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronsDown } from "lucide-react";
import { DashboardPreviewForecast, DashboardPreviewPace } from "./DashboardPreview";
import { PlatformSuitePreview } from "./PlatformSuitePreview";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_LIBRARY_ACTION,
  PLATFORM_SUITE_PATH,
  PRICING_ANCHOR_SUBLINE,
  SEE_PLANS_PRICING_CTA,
} from "@/lib/marketing";

type ProductShowcaseBoxesProps = {
  className?: string;
  /** Parent dashboard mockup (box 1). */
  showDashboard?: boolean;
  /** Scrollable mocks / drills / papers (box 2). */
  showSuite?: boolean;
  /** Include pace chart under forecast in box 1. */
  showPace?: boolean;
  /** Tighter scroll caps (learn hub / articles). */
  compact?: boolean;
};

function ShowcaseScrollArea({
  children,
  compact,
  label,
  fadeClass = "from-white",
  variant = "default",
}: {
  children: ReactNode;
  compact?: boolean;
  label: string;
  fadeClass?: string;
  variant?: "default" | "suite";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(false);

  const maxH =
    variant === "suite"
      ? compact
        ? "max-h-[min(38vh,340px)]"
        : "max-h-[min(46vh,440px)]"
      : compact
        ? "max-h-[min(40vh,360px)]"
        : "max-h-[min(52vh,520px)]";

  const updateOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHintVisible(el.scrollHeight > el.clientHeight + 4);
  }, []);

  useEffect(() => {
    updateOverflow();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateOverflow());
    ro.observe(el);
    window.addEventListener("resize", updateOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow, children, compact, maxH]);

  const scrollHint =
    variant === "suite"
      ? "Scroll to explore the practice suite"
      : "Scroll to explore the dashboard";

  return (
    <div className="relative min-w-0">
      <div className="mb-2 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2 text-center">
        <p className="text-[11px] font-semibold text-primary flex items-center justify-center gap-1.5">
          <ChevronsDown className="h-3.5 w-3.5 shrink-0 animate-bounce text-primary/60" aria-hidden="true" />
          {scrollHint}
        </p>
      </div>
      <div
        ref={scrollRef}
        onScroll={() => {
          const el = scrollRef.current;
          if (el && el.scrollTop > 8) setHintVisible(false);
        }}
        className={`${maxH} overflow-y-auto overflow-x-hidden overscroll-y-contain px-2 py-1 scroll-smooth rounded-lg border border-slate-100/90 bg-slate-50/40`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <div className="min-w-0 max-w-full overflow-hidden break-words">
          {children}
        </div>
      </div>
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t ${fadeClass} via-white/85 to-transparent`}
        aria-hidden="true"
      />
      {hintVisible && (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex justify-center px-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-primary shadow-sm">
            <ChevronsDown className="h-3 w-3 shrink-0 animate-bounce text-primary/70" aria-hidden="true" />
            Scroll to explore
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * The two visual product boxes parents should see on SEO/guide pages —
 * dashboard mockup + scrollable practice suite preview (not link cards alone).
 */
export function ProductShowcaseBoxes({
  className = "",
  showDashboard = true,
  showSuite = true,
  showPace = true,
  compact = false,
}: ProductShowcaseBoxesProps) {
  if (!showDashboard && !showSuite) return null;

  const gridClass = "grid-cols-1 max-w-5xl mx-auto w-full";

  return (
    <div
      className={`grid gap-8 ${gridClass} ${className}`}
      data-testid="product-showcase-boxes"
    >
      {showDashboard && (
        <div className="rounded-2xl border-2 border-primary/20 bg-white p-4 md:p-6 shadow-xl shadow-primary/5 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/60 mb-1 shrink-0">
            Parent dashboard
          </p>
          <h3 className="text-lg md:text-xl font-bold font-serif text-primary leading-snug mb-1 shrink-0">
            Readiness forecast, section gaps &amp; pace
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed shrink-0">
            See an indicative practice score against 121, which subjects are weak, and whether timing is costing marks.
          </p>
          <div className="min-h-0 flex-1">
            <ShowcaseScrollArea compact={compact} label="Dashboard preview" variant="default">
              <DashboardPreviewForecast />
              {showPace && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
                    Pace &amp; timing risk
                  </p>
                  <DashboardPreviewPace />
                </div>
              )}
              <p className="text-[10px] text-muted-foreground italic text-center mt-3 pb-1">
                Illustrative preview · Indicative practice score on the 121 scale
              </p>
            </ShowcaseScrollArea>
          </div>
          <div className="mt-4 shrink-0">
            <Button variant="cta" size="sm" asChild className="w-full">
              <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
            </Button>
          </div>
        </div>
      )}

      {showSuite && (
        <div className="rounded-2xl border-2 border-amber-300/60 bg-gradient-to-b from-amber-50/60 to-white p-4 md:p-6 shadow-xl shadow-amber-100/40 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/60 mb-1 shrink-0">
            Full practice suite
          </p>
          <h3 className="text-lg md:text-xl font-bold font-serif text-primary leading-snug mb-1 shrink-0">
            2,500+ GL-style questions · mocks · drills
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed shrink-0">
            {compact
              ? "Scroll this panel to browse practice tests, papers, diagnostics, and drills."
              : "Scroll inside each panel below to browse timed practice tests, unlimited papers, diagnostics, and targeted drills — exactly what Bucks Plus Edge subscribers access."}
          </p>
          <div className="min-h-0 flex-1">
            <ShowcaseScrollArea compact={compact} label="Practice suite preview" fadeClass="from-amber-50" variant="suite">
              <PlatformSuitePreview showScrollHint={false} compact={compact} />
            </ShowcaseScrollArea>
          </div>
          <div className="mt-4 shrink-0 space-y-2">
            <Button variant="cta" asChild className="w-full" data-testid="button-showcase-suite-cta">
              <Link href={PLATFORM_SUITE_PATH}>
                {PLATFORM_LIBRARY_ACTION} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-center text-xs font-semibold text-primary/80">{PRICING_ANCHOR_SUBLINE}</p>
            <p className="text-center">
              <Link href="/pricing" className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors">
                {SEE_PLANS_PRICING_CTA} →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Full-width wrapper for product mockups inside narrow SEO columns. */
export function ProductShowcaseWidth({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`not-prose w-full min-w-0 ${className}`} {...rest}>
      {children}
    </div>
  );
}

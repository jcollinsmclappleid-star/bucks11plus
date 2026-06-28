import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, ChevronsDown } from "lucide-react";
import { SampleQuestionsCarousel } from "./SampleQuestionsCarousel";
import { DashboardPreviewForecast } from "./DashboardPreview";
import { PlatformSuitePreview } from "./PlatformSuitePreview";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
} from "@/lib/marketing";

type GuideConversionBlockProps = {
  className?: string;
  hideSuite?: boolean;
  /** Hide question carousel when already shown above on the same page. */
  hideQuestions?: boolean;
};

export function GuideConversionBlock({
  className = "",
  hideSuite = false,
  hideQuestions = false,
}: GuideConversionBlockProps) {
  return (
    <div className={`not-prose space-y-8 ${className}`} data-testid="guide-conversion-block">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/60 mb-2">The preparation platform</p>
        <h3 className="text-2xl md:text-3xl font-bold font-serif text-primary leading-snug">
          Guides explain the test. Bucks Plus Edge prepares your child for it.
        </h3>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Parent dashboards, 2,500+ GL-style questions, unlimited practice papers, full mock exams, and timed practice tests on the 121 scale — built specifically for Buckinghamshire.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="cta" asChild data-testid="button-guide-block-platform-top">
            <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
              {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-primary/20 font-semibold text-primary" data-testid="button-guide-block-free-top">
            <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">Parent dashboard preview</p>
        <DashboardPreviewForecast />
        <p className="text-[10px] text-muted-foreground italic text-center mt-3">
          Illustrative preview · Indicative practice score, not an official GL result
        </p>
      </div>

      {!hideQuestions && (
        <div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <ChevronsDown className="h-4 w-4 text-primary/60" />
            <span>Swipe to see real GL-style practice questions</span>
            <ChevronsDown className="h-4 w-4 text-primary/60" />
          </div>
          <SampleQuestionsCarousel />
        </div>
      )}

      {!hideSuite && (
        <div>
          <div className="mb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/60 mb-1">Full platform suite</p>
            <h4 className="text-xl font-bold font-serif text-primary">Practice papers, mock exams &amp; drill library</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Scroll inside each panel to browse everything subscribers access — before you pay.
            </p>
          </div>
          <PlatformSuitePreview />
        </div>
      )}

      <div className="rounded-2xl bg-primary overflow-hidden shadow-xl">
        <div className="px-7 py-8 md:px-9 md:py-9">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-brand-amber" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber">
              Bucks Plus Edge
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-3 leading-snug">
            Turn advice into measurable progress
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-7 max-w-2xl">
            The children who qualify build <strong className="text-white">speed, accuracy, and stamina</strong> under timed GL-style conditions.
            Bucks Plus Edge includes 2,500+ questions, full mock exams, unlimited practice papers, targeted drills, and parent analytics —{" "}
            <strong className="text-white">£35/month</strong> or <strong className="text-white">£279/year</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <Button asChild variant="cta" data-testid="button-guide-conversion-platform">
              <Link href={PLATFORM_PRACTICE_PAPERS_PATH}>
                {PLATFORM_PREVIEW_CTA} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 px-6 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40"
              data-testid="button-guide-conversion-diagnostic"
            >
              <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 px-6 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40"
              data-testid="button-guide-conversion-pricing"
            >
              <Link href="/pricing">See Plans &amp; Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

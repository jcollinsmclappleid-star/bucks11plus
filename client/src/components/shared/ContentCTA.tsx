import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
} from "@/lib/marketing";

type Props = {
  heading?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ContentCTA({
  heading = "See Where Your Child Stands",
  subhead = "Take a free 12-question practice test to see how your child performs across all four 11+ domains — timed, instant results, no account needed.",
  ctaLabel = FREE_PRACTICE_TEST_CTA,
  ctaHref = FREE_PRACTICE_TEST_PATH,
  secondaryHref = PLATFORM_PRACTICE_PAPERS_PATH,
  secondaryLabel = PLATFORM_PREVIEW_CTA,
}: Props = {}) {
  return (
    <div className="not-prose my-12 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Target className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-primary font-serif mb-3">
        {heading}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm leading-relaxed">
        {subhead}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="cta" asChild data-testid="button-content-cta-diagnostic">
          <Link href={ctaHref}>{ctaLabel} <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild className="h-11 px-6" data-testid="button-content-cta-guide">
          <Link href={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

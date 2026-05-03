import { Link } from "wouter";
import { Info } from "lucide-react";

interface Props {
  variant?: "inline" | "block";
  className?: string;
}

export function IndicativeScoreCaveat({ variant = "inline", className = "" }: Props) {
  if (variant === "block") {
    return (
      <div
        className={`flex gap-3 items-start rounded-lg border border-blue-200/60 bg-blue-50/50 p-4 ${className}`}
        data-testid="caveat-indicative-score-block"
      >
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 leading-relaxed">
          <p className="font-semibold mb-1">Independent benchmark, not an official GL Assessment</p>
          <p>
            Our 121 readiness benchmark is designed to help parents understand how their child is performing within our practice tests against an indicative 121 readiness level.
          </p>
          <p className="mt-1.5">
            It is not an official Buckinghamshire Secondary Transfer Test 121 score, not a GL Assessment score, and not a prediction or guarantee of your child's final result. Official outcomes are calculated using GL Assessment's own age-standardised scoring process, which independent practice providers cannot replicate.{" "}
            <Link href="/scoring-methodology" className="underline font-medium" data-testid="link-scoring-methodology-block">
              Read the full methodology
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2 items-start text-xs text-slate-600 leading-snug ${className}`}
      data-testid="caveat-indicative-score-inline"
    >
      <Info className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
      <p>
        Indicative readiness estimate only. <strong className="font-semibold">Not an official GL Assessment score.</strong> 121 is used as a preparation benchmark — achieving it here does not indicate a child will pass the official Secondary Transfer Test.{" "}
        <Link href="/scoring-methodology" className="underline" data-testid="link-scoring-methodology-inline">
          How we calculate this
        </Link>
        .
      </p>
    </div>
  );
}

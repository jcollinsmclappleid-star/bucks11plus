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
          <p className="font-semibold mb-1">Independent practice score, not an official GL Assessment</p>
          <p>
            Our practice score uses the 121 scale that Bucks parents know — it shows how your child is performing across the four domains in GL-style practice.
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
        Indicative practice score only. <strong className="font-semibold">Not an official GL Assessment score.</strong> We use the 121 scale for familiarity — achieving 121 in practice does not indicate a child will pass the official Secondary Transfer Test.{" "}
        <Link href="/scoring-methodology" className="underline" data-testid="link-scoring-methodology-inline">
          How we calculate this
        </Link>
        .
      </p>
    </div>
  );
}

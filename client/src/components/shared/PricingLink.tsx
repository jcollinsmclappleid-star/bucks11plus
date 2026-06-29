import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  PRICING_ANCHOR_SUBLINE,
  PRICING_ANNUAL_LABEL,
  PRICING_ANNUAL_SAVINGS_NOTE,
  PRICING_FROM_HEADLINE,
  PRICING_FROM_LABEL,
  PRICING_MONTHLY_LABEL,
  PRICING_PATH,
} from "@/lib/marketing";

const PRESETS = {
  anchor: PRICING_ANCHOR_SUBLINE,
  fromHeadline: PRICING_FROM_HEADLINE,
  fromLabel: PRICING_FROM_LABEL,
  monthly: PRICING_MONTHLY_LABEL,
  annual: PRICING_ANNUAL_LABEL,
  savings: PRICING_ANNUAL_SAVINGS_NOTE,
} as const;

export type PricingLinkPreset = keyof typeof PRESETS;

type PricingLinkProps = {
  children?: ReactNode;
  preset?: PricingLinkPreset;
  href?: string;
  className?: string;
};

/** Inline link to the pricing page — use for all visible pricing copy site-wide. */
export function PricingLink({
  children,
  preset,
  href = PRICING_PATH,
  className,
}: PricingLinkProps) {
  const label = children ?? (preset ? PRESETS[preset] : undefined);
  if (label == null) return null;

  return (
    <Link
      href={href}
      className={cn("hover:underline underline-offset-2 transition-colors", className)}
      data-testid="link-pricing"
    >
      {label}
    </Link>
  );
}

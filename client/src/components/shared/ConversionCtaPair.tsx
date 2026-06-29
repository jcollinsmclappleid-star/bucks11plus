import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  GET_FULL_ACCESS_CTA,
  PRICING_UI,
  SEE_PLANS_PRICING_CTA,
} from "@/lib/marketing";
import { PricingLink } from "./PricingLink";

type ConversionCtaPairProps = {
  /** Free test first — use on browse-page heroes and footers for cold traffic. */
  leadWithFree?: boolean;
  pricingLabel?: string;
  pricingHref?: string;
  pricingTestId?: string;
  freeTestId?: string;
  size?: "default" | "lg";
  variant?: "default" | "dark" | "onPrimary";
  showPriceAnchor?: boolean;
  className?: string;
  layout?: "row" | "center";
};

export function ConversionCtaPair({
  leadWithFree = false,
  pricingLabel = GET_FULL_ACCESS_CTA,
  pricingHref = "/pricing",
  pricingTestId,
  freeTestId,
  size = "default",
  variant = "default",
  showPriceAnchor = true,
  className,
  layout = "row",
}: ConversionCtaPairProps) {
  const isLg = size === "lg";

  const freeButton = (
    <Button
      variant="cta"
      size={isLg ? "lg" : "default"}
      asChild
      data-testid={freeTestId}
      className={isLg ? undefined : undefined}
    >
      <Link href={FREE_PRACTICE_TEST_PATH}>
        {FREE_PRACTICE_TEST_CTA}
        {isLg ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-4 w-4" />}
      </Link>
    </Button>
  );

  const pricingButton = (
    <Button
      variant="outline"
      size={isLg ? "lg" : "default"}
      asChild
      data-testid={pricingTestId}
      className={cn(
        "font-semibold",
        isLg && "h-12",
        variant === "dark" && "border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white",
        variant === "onPrimary" && "border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white",
        variant === "default" && "border-primary/20 text-primary",
      )}
    >
      <Link href={pricingHref}>
        {pricingLabel}
        {isLg ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-4 w-4" />}
      </Link>
    </Button>
  );

  const anchorClass = cn(
    "mt-2",
    variant === "onPrimary" || variant === "dark"
      ? cn(PRICING_UI.darkHeroSubline, layout === "center" && "mx-auto")
      : cn("text-xs font-semibold", PRICING_UI.subline),
    layout === "center" && variant !== "onPrimary" && variant !== "dark" && "text-center",
  );

  return (
    <div className={className}>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-3",
          layout === "center" && "items-center justify-center",
        )}
      >
        {leadWithFree ? (
          <>
            {freeButton}
            {pricingButton}
          </>
        ) : (
          <>
            <Button variant="cta" size={isLg ? "lg" : "default"} asChild data-testid={pricingTestId}>
              <Link href={pricingHref}>
                {pricingLabel}
                {isLg ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Link>
            </Button>
            <Button
              variant="outline"
              size={isLg ? "lg" : "default"}
              asChild
              data-testid={freeTestId}
              className={cn("font-semibold border-primary/20 text-primary", isLg && "h-12")}
            >
              <Link href={FREE_PRACTICE_TEST_PATH}>{FREE_PRACTICE_TEST_CTA}</Link>
            </Button>
          </>
        )}
      </div>
      {showPriceAnchor && (
        <PricingLink
          preset="anchor"
          className={cn(anchorClass, "inline-block hover:underline")}
        />
      )}
    </div>
  );
}

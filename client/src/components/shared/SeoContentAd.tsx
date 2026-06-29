import { HeroQuickLinks } from "./HeroQuickLinks";
import { ProductShowcaseBoxes, ProductShowcaseWidth } from "./ProductShowcaseBoxes";
import { SeoPricingBar, SeoPricingTeaser } from "./SeoPricingTeaser";

export type SeoContentAdVariant = "cta" | "dashboard" | "suite" | "full";

type SeoContentAdProps = {
  variant?: SeoContentAdVariant;
  className?: string;
  compact?: boolean;
};

function SeoContentAdPricing({ compact }: { compact?: boolean }) {
  return compact ? <SeoPricingBar /> : <SeoPricingTeaser compact />;
}

/** Mid-article internal product ad — pricing + visual showcase spread through SEO/guide content. */
export function SeoContentAd({ variant = "cta", className = "", compact = false }: SeoContentAdProps) {
  if (variant === "cta") {
    return (
      <ProductShowcaseWidth className={`my-10 space-y-6 ${className}`} data-testid="seo-content-ad-cta">
        <SeoContentAdPricing compact={compact} />
        <ProductShowcaseBoxes showPace={false} compact={compact} />
      </ProductShowcaseWidth>
    );
  }

  if (variant === "dashboard") {
    return (
      <ProductShowcaseWidth className={`my-10 space-y-6 ${className}`} data-testid="seo-content-ad-dashboard">
        <SeoContentAdPricing compact={compact} />
        <ProductShowcaseBoxes showSuite={false} compact={compact} />
      </ProductShowcaseWidth>
    );
  }

  if (variant === "suite") {
    return (
      <ProductShowcaseWidth className={`my-10 space-y-6 ${className}`} data-testid="seo-content-ad-suite">
        <SeoContentAdPricing compact={compact} />
        <ProductShowcaseBoxes showDashboard={false} compact={compact} />
      </ProductShowcaseWidth>
    );
  }

  return (
    <ProductShowcaseWidth className={`my-10 space-y-6 ${className}`} data-testid="seo-content-ad-full">
      <SeoContentAdPricing compact={compact} />
      <HeroQuickLinks variant="light" />
      <ProductShowcaseBoxes compact={compact} />
    </ProductShowcaseWidth>
  );
}

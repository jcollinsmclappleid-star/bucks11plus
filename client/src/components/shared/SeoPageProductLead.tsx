import { HeroQuickLinks } from "./HeroQuickLinks";
import { ProductShowcaseBoxes, ProductShowcaseWidth } from "./ProductShowcaseBoxes";
import { SeoPricingTeaser } from "./SeoPricingTeaser";

type SeoPageProductLeadProps = {
  className?: string;
  /** Scrollable mockups of papers, mocks & drills (default on). */
  showSuite?: boolean;
  /** Parent readiness forecast visual (default on). */
  showDashboard?: boolean;
  /** Cap showcase height with internal scroll (learn pages). */
  compact?: boolean;
  /** Show pricing teaser card (default on). */
  showPricing?: boolean;
};

/**
 * Top-of-page product showcase for SEO URLs — dual CTAs, pricing, then visual boxes
 * (dashboard mockup + scrollable practice suite).
 */
export function SeoPageProductLead({
  className = "",
  showSuite = true,
  showDashboard = true,
  compact = false,
  showPricing = true,
}: SeoPageProductLeadProps) {
  return (
    <ProductShowcaseWidth className={`space-y-6 mb-10 ${className}`} data-testid="seo-page-product-lead">
      <HeroQuickLinks variant="light" />
      {showPricing && <SeoPricingTeaser compact={compact} />}
      <ProductShowcaseBoxes showDashboard={showDashboard} showSuite={showSuite} compact={compact} />
    </ProductShowcaseWidth>
  );
}

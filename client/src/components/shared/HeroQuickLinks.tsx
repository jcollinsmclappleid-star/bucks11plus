import { Link, useLocation } from "wouter";
import { ArrowRight, ClipboardCheck, Library } from "lucide-react";
import {
  FREE_PRACTICE_TEST_ACTION,
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_HERO_DESC,
  FREE_PRACTICE_TEST_PATH,
  HERO_QUICK_LINKS_HEADING,
  PLATFORM_LIBRARY_ACTION,
  PLATFORM_LIBRARY_DESC,
  PLATFORM_LIBRARY_LABEL,
  PLATFORM_SUITE_PATH,
  PRICING_UI,
} from "@/lib/marketing";
import { PricingLink } from "./PricingLink";

type HeroQuickLinksProps = {
  variant?: "dark" | "light";
  className?: string;
};

const links = [
  {
    href: FREE_PRACTICE_TEST_PATH,
    icon: ClipboardCheck,
    title: FREE_PRACTICE_TEST_CTA,
    desc: FREE_PRACTICE_TEST_HERO_DESC,
    action: FREE_PRACTICE_TEST_ACTION,
    trust: "No card · No account · Takes 8 minutes",
    primary: true,
    testId: "hero-quick-free-test",
  },
  {
    href: PLATFORM_SUITE_PATH,
    icon: Library,
    title: PLATFORM_LIBRARY_LABEL,
    desc: PLATFORM_LIBRARY_DESC,
    action: PLATFORM_LIBRARY_ACTION,
    primary: false,
    testId: "hero-quick-library",
  },
] as const;

export function HeroQuickLinks({ variant = "dark", className = "" }: HeroQuickLinksProps) {
  const isDark = variant === "dark";

  const panelClass = isDark
    ? "border border-amber-400/35 bg-white/5 shadow-xl shadow-black/20"
    : "border border-amber-200/80 bg-amber-50/50 shadow-lg";

  const secondaryCardClass = isDark
    ? "border border-amber-400/50 bg-amber-400/10 hover:border-amber-400/70 hover:bg-amber-400/18"
    : "border border-amber-300/60 bg-white hover:border-amber-400 hover:bg-amber-50";

  const primaryCardClass = isDark
    ? "border-2 border-amber-300 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-900/30 ring-2 ring-amber-400/50"
    : "border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 shadow-lg ring-2 ring-amber-400/40";

  return (
    <div className={`relative z-10 ${className}`} data-testid="hero-quick-links">
      <div className={`rounded-2xl p-4 md:p-6 ${panelClass}`}>
        <p
          className={`text-center text-sm font-semibold mb-4 md:mb-5 ${
            isDark ? "text-white/80" : "text-slate-700"
          }`}
        >
          {HERO_QUICK_LINKS_HEADING}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 sm:items-stretch max-w-3xl mx-auto">
          {links.map((item) => {
            const Icon = item.icon;
            const isPrimary = item.primary;
            const cardClass = isPrimary ? primaryCardClass : secondaryCardClass;

            const titleClass = isPrimary
              ? "text-amber-950"
              : isDark
                ? "text-amber-50"
                : "text-amber-950";

            const descClass = isPrimary
              ? "text-amber-950/75"
              : isDark
                ? "text-amber-100/75"
                : "text-amber-900/70";

            const iconWrapClass = isPrimary
              ? "bg-amber-950/15"
              : isDark
                ? "bg-amber-400/30"
                : "bg-amber-400/25";

            const iconClass = isPrimary
              ? "text-amber-950"
              : isDark
                ? "text-amber-100"
                : "text-amber-800";

            const actionClass = isPrimary
              ? "text-amber-950 group-hover:text-amber-900"
              : isDark
                ? "text-amber-200 group-hover:text-white"
                : "text-amber-800 group-hover:text-amber-950";

            return (
              <div
                key={item.testId}
                data-testid={item.testId}
                className={`group flex flex-col rounded-xl p-5 md:p-6 transition-all ${cardClass}`}
              >
                <Link
                  href={item.href}
                  className="flex flex-col flex-1 min-h-0"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconWrapClass}`}>
                    <Icon className={`h-6 w-6 ${iconClass}`} />
                  </div>
                  <p className={`text-base font-bold leading-snug ${titleClass}`}>{item.title}</p>
                  <p className={`mt-1.5 text-sm leading-relaxed flex-1 ${descClass}`}>{item.desc}</p>
                  {"trust" in item && item.trust && (
                    <p className="mt-2 text-[11px] font-medium text-amber-950/60">{item.trust}</p>
                  )}
                  <span className={`mt-4 inline-flex items-center text-sm font-bold ${actionClass}`}>
                    {item.action}{" "}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                {!isPrimary && (
                  <PricingLink
                    preset="anchor"
                    className={
                      isDark
                        ? `mt-2 ${PRICING_UI.darkHeroSubline} hover:underline`
                        : `mt-2 text-xs font-bold ${PRICING_UI.subline} hover:underline`
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

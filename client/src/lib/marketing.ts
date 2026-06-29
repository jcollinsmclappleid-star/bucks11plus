/** Public URL for the platform tour — dashboard preview, sample questions, full panel browse. */
export const PLATFORM_PRACTICE_PAPERS_PATH = "/11-plus-practice-papers";

export const PLATFORM_PREVIEW_CTA = "See What's In The Platform";

/** Shorter label for navigation menus. */
export const PRACTICE_PAPERS_NAV_LABEL = "Practice Papers & Mocks";

export const FREE_PRACTICE_TEST_PATH = "/free-diagnostic";
export const FREE_PRACTICE_TEST_CTA = "Try Free Practice Test";
export const FREE_PRACTICE_TEST_HERO_DESC =
  "See your child's readiness band in 8 minutes — no account";
export const FREE_PRACTICE_TEST_ACTION = "Start free test";

/** Hero quick-link panel — platform overview (box 2). */
export const PLATFORM_PREVIEW_HERO_DESC =
  "Dashboard preview, sample questions & what's included";
export const PLATFORM_PREVIEW_HERO_ACTION = "Explore platform";

/** Combined practice suite — diagnostics, papers & drills (conversion page). */
export const PLATFORM_SUITE_PATH = "/11-plus-practice-suite";

/** Hero quick-link panel — library browse step (links to practice suite page). */
export const PLATFORM_LIBRARY_LABEL = "2,500+ Questions & Mock Exams";
export const PLATFORM_LIBRARY_DESC =
  "Practice tests, papers & drills across all four subjects";
export const PLATFORM_LIBRARY_ACTION = "Browse library";

export const HERO_QUICK_LINKS_HEADING = "Not sure where to start?";

/** Canonical pricing page path. */
export const PRICING_PATH = "/pricing";

/** Paid conversion copy — keep pricing anchors consistent site-wide. */
export const PRICING_MONTHLY_LABEL = "£35/month";
export const PRICING_ANNUAL_LABEL = "£279/year";
/** Effective monthly cost when billed annually (£279 ÷ 12). */
export const PRICING_ANNUAL_EQUIV_LABEL = "£23.25/month";
/** Lowest headline rate — annual plan equivalent (use with annual billing context). */
export const PRICING_FROM_LABEL = "£23.25/month";
export const PRICING_FROM_HEADLINE = "from £23.25/month on annual";
export const PRICING_ANCHOR_SUBLINE = "from £23.25/mo on annual · or £35/mo monthly";
export const PRICING_ANNUAL_SAVINGS_NOTE = "Save £141 vs monthly (34% off)";
export const GET_FULL_ACCESS_CTA = "Get full access";
export const SEE_PLANS_PRICING_CTA = "See plans & pricing";

/** Shared Tailwind classes for pricing UI — green accent, never red. */
export const PRICING_UI = {
  cardBorder: "border-emerald-200",
  cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50",
  cardShadow: "shadow-lg shadow-emerald-100/40",
  barBg: "bg-gradient-to-r from-emerald-50/90 to-emerald-50/40",
  eyebrow: "text-emerald-800/80",
  headline: "text-emerald-950",
  price: "text-emerald-700",
  priceMuted: "text-emerald-800",
  savings: "text-emerald-700",
  subline: "text-emerald-800",
  icon: "text-emerald-600",
  outlineBtn: "border-emerald-300 text-emerald-800 hover:bg-emerald-50",
  innerCard: "border-emerald-100",
  /** High-contrast chip on dark blue hero — white background, bold green text. */
  darkHeroBadge:
    "inline-flex w-fit items-center rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-emerald-800 shadow-lg ring-2 ring-emerald-400/60",
  darkHeroSubline:
    "inline-flex w-fit items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-emerald-800 shadow-md ring-1 ring-emerald-400/50",
  darkHeroAnchor: "text-white font-semibold",
} as const;

/** SEO lead pages — not promoted in homepage hero. */
export const FREE_PDF_PAPERS_PATH = "/bucks-11-plus-free-sample-papers";
export const FREE_PDF_PAPERS_LABEL = "Download PDF papers";

export const SAMPLE_QUESTIONS_PATH = "/bucks-11-plus-sample-questions";
export const SAMPLE_QUESTIONS_LABEL = "Example questions";

export const MOCK_EXAMS_LABEL = "Mock exams";

/** In-page anchors on the practice papers browse page. */
export const PLATFORM_ANCHORS = {
  parentDashboard: "parent-dashboard",
  sampleQuestions: "sample-questions",
  practiceTests: "practice-tests",
  practicePapers: "practice-papers",
  practiceBank: "practice-bank",
  parentInsights: "parent-insights",
} as const;

export function platformPath(anchor?: keyof typeof PLATFORM_ANCHORS): string {
  if (!anchor) return PLATFORM_PRACTICE_PAPERS_PATH;
  return `${PLATFORM_PRACTICE_PAPERS_PATH}#${PLATFORM_ANCHORS[anchor]}`;
}

export function practiceSuitePath(anchor?: keyof typeof PLATFORM_ANCHORS): string {
  if (!anchor) return PLATFORM_SUITE_PATH;
  return `${PLATFORM_SUITE_PATH}#${PLATFORM_ANCHORS[anchor]}`;
}

export const PARENT_DASHBOARD_PATH = platformPath("parentDashboard");
/** @deprecated Use PLATFORM_SUITE_PATH for hero box & conversion funnel */
export const PLATFORM_LIBRARY_PATH = PLATFORM_SUITE_PATH;

/** Homepage anchor — full parent dashboard showcase (not the subscriber /app dashboard). */
export const PARENT_DASHBOARD_PREVIEW_ANCHOR = "parent-dashboard-preview";
export const PARENT_DASHBOARD_PREVIEW_PATH = `/#${PARENT_DASHBOARD_PREVIEW_ANCHOR}`;

/** Last meaningful revision for server-rendered guide pages (town, learn, high-volume SSR, etc.). */
export const SSR_CONTENT_LASTMOD = "2026-04-01";

/** Paths served by full SSR HTML (not SPA meta injection). Used for sitemap lastmod. */
export const SSR_EXACT_PATHS = new Set([
  "/bucks-11-plus-test-date-2026",
  "/bucks-11-plus-test-date-2025",
  "/bucks-11-plus-past-papers",
  "/bucks-11-plus-free-sample-papers",
  "/bucks-11-plus-results",
  "/when-do-bucks-11-plus-results-come-out",
  "/bucks-11-plus-sample-questions",
  "/bucks-11-plus-how-scoring-works",
  "/11-plus-tutors-buckinghamshire",
  "/11-plus-tutors-high-wycombe",
  "/11-plus-tutors-aylesbury",
  "/bucks-11-plus-appeals",
  "/bucks-11-plus-registration-guide",
  "/learn",
  "/glossary",
  "/11-plus-verbal-reasoning-practice",
  "/11-plus-non-verbal-reasoning-practice",
  "/11-plus-maths-practice",
  "/11-plus-comprehension-practice",
  "/preparing-for-11-plus-year-4",
  "/preparing-for-11-plus-year-5",
  "/preparing-for-11-plus-year-6",
]);

const TOWN_SLUGS = [
  "high-wycombe", "aylesbury", "beaconsfield", "amersham",
  "chesham", "gerrards-cross", "marlow", "princes-risborough",
  "great-missenden", "wendover", "chalfont-st-giles",
  "hazlemere", "buckingham", "flackwell-heath",
];

const GRAMMAR_SCHOOL_SLUGS = [
  "royal-grammar-school-high-wycombe",
  "wycombe-high-school",
  "john-hampden-grammar-school",
  "sir-william-borlases-grammar-school",
  "dr-challoners-grammar-school",
  "dr-challoners-high-school",
  "beaconsfield-high-school",
  "chesham-grammar-school",
  "aylesbury-grammar-school",
  "aylesbury-high-school",
  "sir-henry-floyd-grammar-school",
  "burnham-grammar-school",
  "the-royal-latin-school",
];

export function isSsrSitemapPath(path: string): boolean {
  if (SSR_EXACT_PATHS.has(path)) return true;
  if (path.startsWith("/learn/")) return true;
  if (path.startsWith("/glossary/")) return true;
  if (path.startsWith("/grammar-schools/")) return true;
  for (const slug of TOWN_SLUGS) {
    if (path === `/bucks-11-plus-${slug}`) return true;
  }
  for (const slug of GRAMMAR_SCHOOL_SLUGS) {
    if (path === `/grammar-schools/${slug}`) return true;
  }
  return false;
}

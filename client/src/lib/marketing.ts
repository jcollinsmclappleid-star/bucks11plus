/** Public URL for the full practice-papers / platform preview page (SEO + conversion). */
export const PLATFORM_PRACTICE_PAPERS_PATH = "/11-plus-practice-papers";

export const PLATFORM_PREVIEW_CTA = "See What's In The Platform";

/** Shorter label for navigation menus. */
export const PRACTICE_PAPERS_NAV_LABEL = "Practice Papers & Mocks";

export const FREE_PRACTICE_TEST_PATH = "/free-diagnostic";
export const FREE_PRACTICE_TEST_CTA = "Try Free Practice Test";

/** In-page anchors on the practice papers browse page. */
export const PLATFORM_ANCHORS = {
  parentDashboard: "parent-dashboard",
  sampleQuestions: "sample-questions",
  practiceTests: "practice-tests",
  practicePapers: "practice-papers",
  practiceBank: "practice-bank",
} as const;

export function platformPath(anchor?: keyof typeof PLATFORM_ANCHORS): string {
  if (!anchor) return PLATFORM_PRACTICE_PAPERS_PATH;
  return `${PLATFORM_PRACTICE_PAPERS_PATH}#${PLATFORM_ANCHORS[anchor]}`;
}

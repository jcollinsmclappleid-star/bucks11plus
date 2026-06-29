/**
 * SEO registry for SPA-only indexable routes (no full SSR shell).
 * Server injects this into index.html; client <Seo /> should read from here too.
 */
import { grammarSchools } from "@/data/grammar-schools";
import { QUESTION_TYPES } from "@/data/question-types";
import { MATHS_TOPICS } from "@/data/maths-topics";
import { MOCK_VARIANTS } from "@/data/mock-variants";
import { VOCAB_CLUSTERS } from "@/data/vocab-clusters";
import { URGENCY_PLANS } from "@/data/urgency-plans";

export const SITE_BASE_URL = "https://bucks11plustest.co.uk";

/** Default lastmod for static SEO guide content. Bump when guides are revised. */
export const SEO_CONTENT_REVISION = "2026-04-01";

/** Platform funnel pages revised June 2026. */
export const PLATFORM_CONTENT_REVISION = "2026-06-28";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  lastmod: string;
}

function meta(
  path: string,
  title: string,
  description: string,
  h1: string,
  intro: string,
  lastmod = SEO_CONTENT_REVISION,
): PageMeta {
  return { path, title, description, h1, intro, lastmod };
}

const CORE_PAGES: PageMeta[] = [
  meta(
    "/",
    "Bucks 11 Plus Preparation — Help Your Child Pass Without the Guesswork | Bucks 11 Plus Tests",
    "Get your child ready for the Buckinghamshire 11+ — free readiness check, interactive practice, and parent dashboards. Start preparing for the September 2027 test and beyond.",
    "Help your child pass the Bucks 11+ without the guesswork",
    "Free 12-question practice test, Bucks Plus Edge interactive preparation, and parent dashboards built for the Buckinghamshire Secondary Transfer Test.",
    PLATFORM_CONTENT_REVISION,
  ),
  meta(
    "/free-diagnostic",
    "Free Practice Test | Bucks 11 Plus Tests",
    "Take a free 12-question practice test to get an indicative readiness signal calibrated to the Bucks 121 qualifying benchmark. No account needed.",
    "Free 12-question Bucks 11+ practice test",
    "A timed GL-style mini test across Verbal Reasoning, Non-Verbal Reasoning, Maths and Comprehension — with an indicative score on the 121 scale. No account required.",
    PLATFORM_CONTENT_REVISION,
  ),
  meta(
    "/11-plus-practice-papers",
    "11 Plus Practice Papers — Mocks, Drills & Parent Dashboards | Bucks 11 Plus Tests",
    "Browse everything inside Bucks Plus Edge: practice tests, mock exams, unlimited practice papers, 2,500+ GL-style questions, and parent dashboards built for the Buckinghamshire 11+.",
    "11 Plus Practice Papers — mocks, drills & parent dashboards",
    "Browse practice tests, timed mock exams, unlimited GL-style practice papers, sample questions, and parent dashboards built for the Buckinghamshire Secondary Transfer Test.",
    PLATFORM_CONTENT_REVISION,
  ),
  meta(
    "/11-plus-practice-suite",
    "Bucks 11+ Practice Suite — Diagnostics, Papers, Drills & Parent Dashboard",
    "How Bucks 11 Plus Tests combines diagnostics, unlimited practice papers, 2,500+ GL-style drills, and parent dashboards (121-scale forecast, pace analytics) into one Buckinghamshire 11+ preparation system.",
    "Diagnostics, papers & drills — how they work together",
    "See how diagnostics, unlimited practice papers, targeted drills, and parent analytics combine into one preparation system for the Bucks 11+.",
    PLATFORM_CONTENT_REVISION,
  ),
  meta(
    "/why-choose-bucks-11-plus-tests",
    "Practice Papers vs Platform for Bucks 11+? Use Both. | Bucks 11 Plus Tests",
    "Practice papers build stamina. The platform shows you which sub-topics are costing marks, your readiness estimate versus 121, and exactly what to fix next. Built exclusively for the Buckinghamshire 11+.",
    "Papers tell you the score. We tell you exactly what to fix.",
    "Compare generic practice papers with structured diagnostics, parent analytics, and guided preparation built for the Buckinghamshire Secondary Transfer Test.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/site-links",
    "All Pages & Resources | Bucks 11 Plus Preparation | Bucks 11 Plus Tests",
    "Browse all pages, tools, guides and resources on Bucks 11 Plus Tests — Bucks 11 Plus preparation platform for the Secondary Transfer Test.",
    "Site Links",
    "Find preparation tools, Buckinghamshire 11+ guides, platform features, and legal pages across Bucks 11 Plus Tests.",
    PLATFORM_CONTENT_REVISION,
  ),
  meta(
    "/pricing",
    "Bucks 11 Plus Preparation Plans & Pricing (2026–2027) | Bucks 11 Plus Tests",
    "Free readiness check plus Bucks Plus Edge — £35/month or £279/year. Structured interactive prep for the September 2027 test and beyond.",
    "Bucks 11 Plus preparation plans & pricing",
    "Compare the free practice test with Bucks Plus Edge — full access to 2,500+ GL-style questions, mocks, drills, and parent analytics from £35/month.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/how-it-works",
    "How Bucks 11 Plus Tests Works (2026) – Readiness-Led Preparation | Bucks 11 Plus Tests",
    "Assessment-first preparation for the Bucks 11 Plus. Free GL-style readiness check, 121 readiness forecast, and targeted practice to close the gap before the Secondary Transfer Test.",
    "How Bucks 11 Plus Tests works",
    "Diagnostic-first preparation: free practice test, 121-scale readiness forecast, targeted drills, and progress tracking for the Buckinghamshire 11+.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/how-forecast-works",
    "Bucks 11 Plus Scoring Explained – What the 121 Standardised Score Means | Bucks 11 Plus Tests",
    "How the Bucks 11 Plus 121 standardised score works and what our readiness forecast means for your child's grammar school application.",
    "How forecast scoring works",
    "An honest explanation of our 121-scale readiness forecast, what the Buckinghamshire qualifying threshold means, and the limits of practice scores.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-gl-alignment",
    "Bucks 11 Plus Subjects Explained – The Four GL Assessment Domains | Bucks 11 Plus Tests",
    "Understand how the Bucks 11 Plus tests verbal reasoning, non-verbal reasoning, maths and English comprehension. See how our independently developed assessments cover the four GL Assessment domains and where children lose marks.",
    "The four GL Assessment domains in the Bucks 11+",
    "Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension — how the Buckinghamshire Secondary Transfer Test is structured and what each domain tests.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/about",
    "About Bucks 11 Plus Tests | Readiness-Led 11+ Preparation Platform",
    "11+ Standard is an independent Buckinghamshire 11+ preparation platform — operated by Ianson Systems Limited — helping parents understand their child's readiness against the 121 qualifying standard.",
    "About Bucks 11 Plus Tests",
    "Independent GL-style diagnostic and preparation platform for the Buckinghamshire Secondary Transfer Test, operated by Ianson Systems Limited.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/contact",
    "Contact | Bucks 11 Plus Preparation Help | Bucks 11 Plus Tests",
    "Get in touch with the Bucks 11 Plus Tests team for help with your Bucks 11 Plus preparation. We're here to answer your questions about the Secondary Transfer Test.",
    "Contact us",
    "Questions about the Buckinghamshire 11+, our platform, or your account — reach the Bucks 11 Plus Tests support team.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/buckinghamshire-11-plus-guide",
    "Bucks 11 Plus Guide (2026) – 121 Score, Format & How to Prepare | Bucks 11 Plus Tests",
    "Complete guide to the Bucks 11 Plus Secondary Transfer Test. Understand the 121 qualifying score, exam format, all 13 grammar schools, and how to prepare your child effectively.",
    "Buckinghamshire 11+ complete guide",
    "Everything parents need about the Bucks Secondary Transfer Test — format, 121 qualifying score, grammar schools, and preparation.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-parent-guide",
    "Free Bucks 11 Plus Parent Guide (2026) – 121 Score & Preparation | Bucks 11 Plus Tests",
    "Free guide for parents: understand the Bucks 11 Plus format, the 121 qualifying score, and how to assess your child's readiness for the Secondary Transfer Test.",
    "Free Bucks 11+ parent guide",
    "Downloadable guidance on the Secondary Transfer Test process, the 121 benchmark, and how to support your child's preparation.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/parent-hub",
    "Parent Hub – Expert 11+ Guides for Bucks Families | Bucks 11 Plus Tests",
    "Authoritative guides, methodological transparency, and practical advice for parents navigating the Buckinghamshire 11+ Secondary Transfer Test. Free expert articles.",
    "Parent Hub",
    "Expert articles on methodology, preparation strategy, and navigating the Buckinghamshire 11+ with confidence.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-grammar-schools",
    "Bucks 11 Plus Grammar Schools (2026) – All 13 Schools Directory",
    "Complete directory of all 13 Bucks 11 Plus grammar schools. Locations, descriptions and official links to help you find the right school for your child.",
    "All 13 Buckinghamshire grammar schools",
    "Directory of every state grammar school in Buckinghamshire — locations, links, and admissions context for the Secondary Transfer Test.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-qualifying-score",
    "Bucks 11 Plus Qualifying Score (2026) – What 121 Means & How It Works",
    "Understand the Bucks 11 Plus qualifying score of 121, how standardised scores work, and what annual variation means for your child's grammar school application.",
    "What does the 121 qualifying score mean?",
    "How Buckinghamshire's standardised qualifying threshold works, what 121 represents, and how it differs from raw marks.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-timeline",
    "Bucks 11 Plus Timeline (2026) – Registration Dates & Admissions Calendar",
    "Complete Bucks 11 Plus admissions timeline: registration deadlines, test dates, results day, and National Offer Day. Plan your child's preparation with key 2026 dates.",
    "Bucks 11+ admissions timeline",
    "Key dates from Year 5 registration through test day, results, and school offers for the Buckinghamshire 11+.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/buckinghamshire-secondary-transfer-test",
    "Bucks 11 Plus Secondary Transfer Test (2026) – Purpose, Format & Structure",
    "Understand the Bucks 11 Plus Secondary Transfer Test: its official purpose, four-paper structure, and how standardised scores determine grammar school eligibility.",
    "The Buckinghamshire Secondary Transfer Test",
    "Official purpose, two-paper GL Assessment format, audio instructions, and how scores determine grammar school eligibility.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/how-to-pass-bucks-11-plus",
    "How to Pass the Bucks 11 Plus (2026) – Strategy, 121 Score & Prep Tips",
    "What it takes to pass the Bucks 11 Plus: understanding the 121 qualifying score, avoiding common mistakes, balancing speed with accuracy, and when to start preparing.",
    "How to pass the Bucks 11+",
    "Practical strategies for reaching the 121 qualifying standard — pacing, accuracy, preparation timeline, and common pitfalls to avoid.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-registration",
    "Bucks 11 Plus Registration (2026) – How & When to Register",
    "Everything parents need to know about registering for the Bucks 11 Plus Secondary Transfer Test. Who can register, key deadlines, and special arrangements.",
    "Bucks 11+ registration guide",
    "Who must register, automatic vs opt-in registration, June Year 5 deadline, and special arrangements.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-mistakes",
    "Common Bucks 11 Plus Mistakes (2026) – Preparation Pitfalls to Avoid",
    "The most frequent errors parents and children make during Bucks 11+ preparation and on test day — and how to avoid them.",
    "Common Bucks 11+ preparation mistakes",
    "Preparation timing, over-reliance on papers without review, ignoring audio format, and other mistakes Bucks families make.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-practice-papers-free",
    "Free Bucks 11+ Practice Papers — Where to Get GL-Style Material (2026)",
    "Genuinely free Bucks 11+ practice papers and PDF downloads: what's available, what each is good for, and how to use them. Includes two free printable GL-style papers — no email required.",
    "Free Bucks 11+ practice papers",
    "Where to find genuinely free GL-style material for the Buckinghamshire 11+, including two downloadable PDF practice papers.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-familiarisation-test",
    "Bucks 11 Plus Familiarisation Test (2026) – What It Is & How to Use It",
    "Understand the official Bucks 11 Plus familiarisation test — when it's released, what it covers, what it does and doesn't tell you about your child's readiness, and how to use it well.",
    "The official Bucks 11+ familiarisation test",
    "What TBGS releases before the test, what it can and cannot tell you about readiness, and how to use it alongside structured practice.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-vs-cem-vs-kent",
    "Bucks 11+ vs CEM vs Kent 11+ – How They Differ (2026 Guide)",
    "Compare the Bucks 11+ with the CEM 11+ and Kent 11+: producer, format, question style, qualifying scores, and what makes each different. Find out which test your area uses.",
    "Bucks 11+ vs CEM vs Kent",
    "How the main UK 11+ variants differ in producer, format, threshold, and preparation approach.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-vocabulary-list",
    "Bucks 11 Plus Vocabulary List (2026) – 150 Essential Words by Tier",
    "A structured Bucks 11+ vocabulary list of 150 essential words organised by difficulty tier, plus how vocabulary is tested in the Verbal Reasoning paper and how to build word knowledge that lasts.",
    "Bucks 11+ vocabulary list",
    "150 high-utility words organised by tier, plus how vocabulary is tested in GL-style Verbal Reasoning.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-test-day-checklist",
    "Bucks 11 Plus Test Day Checklist (2026) – What to Bring & How to Prepare",
    "A practical Bucks 11+ test day checklist: what to bring, what to wear, what to eat, and how to keep the morning calm. Plus the night-before routine that helps your child do their best.",
    "Bucks 11+ test day checklist",
    "Practical guidance for the morning of the Secondary Transfer Test — what to bring, eat, wear, and how to stay calm.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-mock-test",
    "Bucks 11 Plus Mock Test (2026) – When, How & Why They Matter",
    "A complete guide to Bucks 11+ mock tests: when to sit them, what makes a good mock, how to interpret results, and how mocks differ from practice papers and the official familiarisation test.",
    "Bucks 11+ mock tests",
    "When to sit mocks, how to run them at home, and how to use results to direct the final weeks of preparation.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-tuition-cost",
    "Cost of Bucks 11 Plus Preparation (2026) – Tuition vs Online vs Self-Study",
    "A clear breakdown of what Bucks 11+ preparation actually costs in 2026: private tutors, online platforms, practice books and self-study. Compare options and find the right value for your family.",
    "Cost of Bucks 11+ preparation",
    "Honest comparison of tutors, online platforms, books, and self-study for Buckinghamshire 11+ preparation.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-faqs",
    "Bucks 11 Plus FAQs (2026) – Every Parent Question Answered",
    "Comprehensive Bucks 11+ FAQ hub: the test, the 121 qualifying score, registration, preparation, grammar school allocation and our platform. Every common parent question, answered clearly.",
    "Bucks 11+ frequently asked questions",
    "Answers to the most common parent questions about the test, qualifying score, registration, and preparation.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-year-5-summer-plan",
    "Year 5 Summer Plan – 10-Week Bucks 11+ Preparation Schedule",
    "A realistic 10-week summer plan for Year 5 children preparing for the Bucks 11+. Week-by-week schedule covering all four sections, with mock tests built in.",
    "Year 5 summer preparation plan",
    "A structured 10-week schedule for the summer before Year 6 covering all four GL Assessment domains.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-year-6-revision-timetable",
    "Bucks 11+ Final Weeks Revision Timetable (Year 6, August–September)",
    "A focused 4-week revision timetable for the final stretch before the Bucks 11+ in early September. Daily structure, weekend mocks, and what to drop.",
    "Final weeks revision timetable",
    "A four-week plan for August and early September before the Buckinghamshire Secondary Transfer Test.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-grammar-school-rankings",
    "Buckinghamshire Grammar School Rankings & Academic Outcomes",
    "Buckinghamshire grammar school rankings explained. Honest summary of academic outcomes across all 13 grammars — and why league-table position should not be the main factor in choice.",
    "Buckinghamshire grammar school rankings",
    "How to interpret academic outcomes across the 13 grammar schools without over-focusing on league tables.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/independent-vs-grammar-buckinghamshire",
    "Independent School vs Buckinghamshire Grammar – An Honest Comparison",
    "Independent school or Buckinghamshire grammar — how the two compare on academic outcomes, cost, admissions, class size, and wider opportunities.",
    "Independent vs Buckinghamshire grammar",
    "An honest comparison of cost, outcomes, admissions, and fit for Bucks families choosing between sectors.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/bucks-11-plus-self-study-vs-tutor",
    "Bucks 11 Plus: Self-Study vs Tutor – Honest Comparison",
    "Self-study, online platforms or a private tutor for the Bucks 11+? Honest comparison of cost, time commitment, results expectations, and which works best for which families.",
    "Self-study vs tutor for the Bucks 11+",
    "Compare private tutoring, structured online platforms, and independent preparation for the Secondary Transfer Test.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/gl-assessment-11-plus-practice",
    "GL Assessment 11+ Practice — How to Prepare for the Bucks Test",
    "The GL Assessment is the test format used by the Bucks 11+. A guide to its structure, sections, timings and the most effective practice routine.",
    "GL Assessment 11+ practice",
    "Structure, timings, and an effective practice routine for the GL Assessment format used in Buckinghamshire.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/gl-assessment-past-papers",
    "GL Assessment Past Papers — What's Available & How to Use Them",
    "An honest guide to GL Assessment past papers for the 11+: what is publicly available, what isn't, and how to build a strong practice plan from the resources that exist.",
    "GL Assessment past papers",
    "What official GL materials exist, what Buckinghamshire does not release, and how to build a practice plan anyway.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/gl-assessment-question-types",
    "GL Assessment Question Types — Full Bucks 11+ Question Bank Guide",
    "Every question type tested in the GL Assessment 11+ used by Buckinghamshire — across Verbal Reasoning, Non-Verbal Reasoning, Maths and Comprehension — with linked guides.",
    "GL Assessment question types",
    "A complete map of question types across all four domains of the Buckinghamshire Secondary Transfer Test.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/free-11-plus-resources",
    "Free 11+ Resources — Practice Papers, Plans & Reference Guides",
    "A complete library of free 11+ resources for Buckinghamshire families: practice papers, revision plans, vocabulary lists, test-day checklists and more.",
    "Free 11+ resources",
    "Curated free practice papers, plans, vocabulary lists, and reference guides for Buckinghamshire families.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/south-bucks-grammar-schools",
    "South Buckinghamshire Grammar Schools (2026) – Bucks 11+ Schools, Catchments & Admissions",
    "Complete guide to South Buckinghamshire Grammar Schools: the schools, their catchments, competitive landscape, and how to prepare for the Bucks 11+ in this area of Buckinghamshire.",
    "South Buckinghamshire grammar schools",
    "Six grammar schools serving High Wycombe, Marlow, Beaconsfield and Burnham — catchments and competitive context.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/aylesbury-vale-grammar-schools",
    "Aylesbury Vale Grammar Schools (2026) – Bucks 11+ Schools, Catchments & Admissions",
    "Complete guide to Aylesbury Vale Grammar Schools: the schools, their catchments, competitive landscape, and how to prepare for the Bucks 11+ in this area of Buckinghamshire.",
    "Aylesbury Vale grammar schools",
    "Four grammar schools serving Aylesbury, Wendover, Buckingham and the surrounding Vale.",
    SEO_CONTENT_REVISION,
  ),
  meta(
    "/chiltern-grammar-schools",
    "Chiltern Grammar Schools (2026) – Bucks 11+ Schools, Catchments & Admissions",
    "Complete guide to Chiltern Grammar Schools: the schools, their catchments, competitive landscape, and how to prepare for the Bucks 11+ in this area of Buckinghamshire.",
    "Chiltern grammar schools",
    "Dr Challoner's, Chesham Grammar and the Chiltern villages — one of the most oversubscribed clusters in Buckinghamshire.",
    SEO_CONTENT_REVISION,
  ),
  meta("/terms", "Terms of Service | Bucks 11 Plus Tests", "Read our terms of service to understand our policies and commitments.", "Terms of Service", "Terms governing use of the Bucks 11 Plus Tests platform.", SEO_CONTENT_REVISION),
  meta("/privacy", "Privacy Policy | Bucks 11 Plus Tests", "Read our privacy policy to understand our policies and commitments.", "Privacy Policy", "How we collect, use, and protect personal data on Bucks 11 Plus Tests.", SEO_CONTENT_REVISION),
  meta("/safeguarding", "Safeguarding Policy | Bucks 11 Plus Tests", "Read our safeguarding policy to understand our policies and commitments.", "Safeguarding Policy", "Our commitments to child safety on the Bucks 11 Plus Tests platform.", SEO_CONTENT_REVISION),
  meta("/refund-policy", "Refund Policy | Bucks 11 Plus Tests", "Read our refund policy to understand our policies and commitments.", "Refund Policy", "Subscription refund terms for Bucks Plus Edge plans.", SEO_CONTENT_REVISION),
];

function fromSeoGuide(
  pathSegment: string,
  metaTitle: string,
  metaDescription: string,
  title: string,
  intro: string,
): PageMeta {
  return meta(pathSegment, metaTitle, metaDescription, title, intro);
}

function buildRegistry(): Record<string, PageMeta> {
  const registry: Record<string, PageMeta> = {};

  for (const page of CORE_PAGES) {
    registry[page.path] = page;
  }

  for (const q of QUESTION_TYPES) {
    registry[q.pathSegment] = fromSeoGuide(q.pathSegment, q.metaTitle, q.metaDescription, q.title, q.intro);
  }
  for (const t of MATHS_TOPICS) {
    registry[t.pathSegment] = fromSeoGuide(t.pathSegment, t.metaTitle, t.metaDescription, t.title, t.intro);
  }
  for (const m of MOCK_VARIANTS) {
    registry[m.pathSegment] = fromSeoGuide(m.pathSegment, m.metaTitle, m.metaDescription, m.title, m.intro);
  }
  for (const v of VOCAB_CLUSTERS) {
    registry[v.pathSegment] = fromSeoGuide(v.pathSegment, v.metaTitle, v.metaDescription, v.title, v.intro);
  }
  for (const p of URGENCY_PLANS) {
    registry[p.pathSegment] = fromSeoGuide(p.pathSegment, p.metaTitle, p.metaDescription, p.title, p.intro);
  }

  for (const school of grammarSchools) {
    const path = `/11-plus-score-${school.slug}`;
    const title = `${school.shortName} 11+ Score — What You Need for the Bucks 11+`;
    const description = `What 11+ score is required for ${school.name}. The 121 Buckinghamshire qualifying standard explained, with admissions context and how to prepare for a comfortable score.`;
    registry[path] = meta(path, title, description, `${school.shortName} 11+ score requirements`, description);
  }

  return registry;
}

export const SPA_PAGE_META: Record<string, PageMeta> = buildRegistry();

export const SPA_META_PATHS = Object.keys(SPA_PAGE_META);

export function getPageMeta(path: string): PageMeta | undefined {
  return SPA_PAGE_META[path];
}

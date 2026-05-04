# 11+ Standard — Buckinghamshire 11+ Exam Preparation Platform

## Overview
A full-stack web platform for Buckinghamshire 11+ exam preparation, aligned to GL-style reasoning families used in Bucks. Features timed diagnostics, a proprietary readiness forecast against the 121 benchmark, targeted practice drills with anti-repeat question selection, an admin QA system, SVG-rendered NVR questions, chart-based data interpretation, a Parent Hub content engine for SEO, and a 4-tier monetization model: Free diagnostic | Bucks Practice Platform £24.99/mo (pack_monthly, limited Hard drills/no analytics) | Bucks Practice Platform Edge £59.99/mo or £495/yr (pack_plus / pack_annual, full platform) | Bucks Young Scholar Programme £349 one-time (programme24_plus, full platform + structured coaching).

## Marketing Wording Canon (May 2026)
Source of truth = `client/src/pages/Legal.tsx` line 15 ("indicative estimates... not official standardised scores"). Never describe **our** product output as a "standardised score", "forecast standardised score", or claim to "track real progress / close the gap to 121" in measured terms. Approved phrasing for our output: **"indicative readiness score against the 121 qualifying standard"**. Factual descriptions of how the actual GL Assessment / Bucks system works (e.g. "the qualifying threshold is a standardised score of 121") remain accurate and should be kept. Site-wide sweep applied across Landing, HowItWorks, ParentAnalytics, Progress, Dashboard, GuidePrint, leadMagnet email, ssrHighVolume, llms.txt, and 8 SEO pages (FAQHub, ScoreCalculator, FamiliarisationTest, MockTest, PastPapers, PracticePapersFree, SecondaryTransfer, SelfStudyVsTutor, TuitionCost, CommonMistakes, About).

## Architecture
- **Frontend**: React 19 + Vite + TailwindCSS v4 + Shadcn/UI + wouter routing + TanStack Query
- **Backend**: Express 5 + TypeScript + Passport.js (local strategy) + express-session (pg-backed)
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe (subscription mode via checkout sessions + 7-day free trial on pack_plus), stripe-replit-sync for schema sync
- **Question Engine**: Rule-tagged questions with skill_id/sub_rule_id, SVG rendering for NVR, chart rendering for data interpretation, anti-repeat via question_usage table
- **NVR Generator (v3/v4)**: Rebuilt from scratch per GL expert spec. Uses `ShapeAttrs` internal model, shape-compatibility matrix (ROTATION_SAFE/STRONGLY_ASYMMETRIC), cumulative rule stacks (up to 3 rules with conditional/alternating for hard), diagnostic distractor engine (12 distractor types: wrong_rotation, wrong_axis, missed_secondary, etc). Generators: `scripts/generators/nvr/shared.ts` (foundation), `sequence.ts`, `transformation.ts`, `rotation_reflection.ts`, `classification.ts`, `symmetry_spatial.ts`. DB bank: 869 approved NVR questions (280 easy / 287 medium / 302 hard). Old medium/hard archived (qa_status='archived').
- **Maths Bank (GL-audited)**: 351 approved questions across all GL 11+ topics (50 easy / 142 medium / 159 hard). Full topic coverage: arithmetic, fractions, percentages, ratio, patterns/sequences, data/statistics (mean/median/range/two-way tables), shape & geometry (area/perimeter/volume/angles/coordinates), word problems. 34 under-levelled data questions archived and replaced; 9 non-GL topics archived; 4 free pool bugs fixed (non-integer arithmetic, wrong answers, ambiguous wording). Run `scripts/maths_bank_remediation.ts` to replay all changes idempotently.
- **Comprehension Bank**: Single editorial bank `English Comprehension` only (~600 questions across 40 passages, 98.6% distinct prompts, GL-realistic with passage-quoted stems and passage-specific options). Legacy lowercase `comprehension` bank (templated/AI-generated, generic stems with non-passage-specific options) was retired May 2026 — see `server/questionQualityFixes.ts` Fix 10. Marketing copy updated from "1,500+" to "2,500+" across all client/server surfaces (active bank ~2,750 in prod, ~3,700 in dev).
- **Shared**: Schema definitions in `shared/schema.ts`, content types in `shared/contentTypes.ts`, validation in `shared/contentValidation.ts`
- **GDPR / PECR (May 2026)**: Cookie consent banner (`client/src/components/shared/CookieConsent.tsx`) gates all Google Ads/Analytics — `gtag.js` is lazy-loaded via `client/src/lib/analytics.ts` only after Accept; choice persisted in localStorage. Google Fonts replaced by self-hosted `@fontsource/inter` + `@fontsource/libre-baskerville`. Request logger in `server/index.ts` deep-clones response payloads and masks `password`/`email`/`username`/`childName`/`stripeCustomerId`/tokens. Email-side logs use `maskEmail()` and `redactEmailsInText()` from `server/email.ts` (also re-used in `server/seed.ts` and `server/webhookHandlers.ts`) so no plaintext addresses (including those echoed back by Resend) reach console output. Right-to-portability endpoint `GET /api/user/export` (auth-required) bundles user record (sans password/reset token) + child profiles + sessions + answers + programme enrolments + milestones + weekly plans + tasks + badges + question_usage + exam date + email events as a JSON download — surfaced via "Download my data" button in `client/src/pages/Account.tsx`. Retention sweep `server/retention.ts` runs 10 min after boot then weekly: deletes non-admin users with no active subscription whose `last_login_at` (or `created_at` if never logged in) is older than `now() - interval '24 months'`, with a Stripe live-subscription safeguard that fail-closes if Stripe is unreachable; prunes `email_events` older than 12 months. Privacy policy in `client/src/pages/Legal.tsx` rewritten to match: soft 24-month dormancy retention, full processor list (Stripe/Resend/Replit/Google), IDTA/Adequacy disclosure, parent-as-Article-8-consent framing. Support email remains `support@11plustesthub.co.uk`.

## Project Structure
```
client/src/
├── App.tsx              # Router with auth-aware MainLayout + AdminGuard
├── lib/
│   ├── auth.tsx         # AuthProvider context + useAuth hook (isPack12, isProgramme, hasPaidAccess, isAdmin)
│   └── queryClient.ts   # TanStack Query client + apiRequest helper
├── components/
│   ├── layout/Navbar.tsx # Auth-aware navigation (Programme/Admin links, ChildSwitcher)
│   ├── layout/ChildSwitcher.tsx # Family tier child profile switcher dropdown
│   ├── shared/Seo.tsx    # Per-page SEO meta tags
│   ├── render/           # Visual question rendering engine
│   │   ├── VisualPrompt.tsx    # Top-level switch (text/svg/chart)
│   │   ├── SvgQuestion.tsx     # NVR sequence/transform/classification layouts
│   │   ├── SvgFrameView.tsx    # SVG frame renderer (shapes, lines, dots)
│   │   ├── SvgOptionGrid.tsx   # 2x2 selectable SVG option cards
│   │   ├── ChartQuestion.tsx   # Chart type switch
│   │   └── charts/
│   │       ├── BarChartSvg.tsx  # SVG bar chart
│   │       ├── LineChartSvg.tsx # SVG line chart
│   │       └── TableView.tsx    # HTML data table
│   └── ui/              # Shadcn components
├── pages/
│   ├── Landing.tsx       # Marketing landing page (GL-style aligned disclaimer)
│   ├── SignIn.tsx / SignUp.tsx / Onboarding.tsx
│   ├── Dashboard.tsx     # Readiness forecast & priority focus (countdown widget, links to analytics)
│   ├── EarlyDashboard.tsx # Early Learner dashboard (Foundation Readiness %, stage timeline)
│   ├── TestDaySimulator.tsx # 2-paper exam simulator with break + bubble answer sheet (Programme16 exclusive)
│   ├── ParentAnalytics.tsx # 3-tab premium analytics (Summary/Insights/Detail)
│   ├── Diagnostics.tsx   # Available assessments (tier-gated)
│   ├── DiagnosticStart.tsx / TestRunner.tsx (visual questions + exam paper layout)
│   ├── Results.tsx       # Post-test + tiered impact simulator
│   ├── Progress.tsx      # Trajectory + gap velocity + forecast stability
│   ├── Practice.tsx      # Drill sections (links to DrillRunner)
│   ├── DrillRunner.tsx   # Practice drill runner with immediate feedback
│   ├── Programme.tsx / ProgrammeCompletion.tsx / CheckoutSuccess.tsx
│   ├── Pricing.tsx       # Conversion-focused sales page with interactive demo previews + auto-checkout
│   ├── FreeDiagnosticStart.tsx # Guest diagnostic start (no auth required)
│   ├── GuestResults.tsx  # Guest results with conversion upsell + blurred locked features
│   ├── ParentHub.tsx / Article.tsx
│   ├── admin/
│   │   ├── QuestionList.tsx  # Filterable question table + stats + QA queue
│   │   └── QuestionEditor.tsx # Full editor with live preview + validation
│   ├── BucksGuide.tsx       # Pillar SEO page: /buckinghamshire-11-plus-guide
│   ├── seo/
│   │   ├── GrammarSchools.tsx   # /bucks-grammar-schools (list of all 13, links to individual pages)
│   │   ├── GrammarSchoolGuide.tsx # /grammar-schools/:slug (13 individual school pages)
│   │   ├── QualifyingScore.tsx  # /bucks-11-plus-qualifying-score
│   │   ├── Timeline.tsx         # /bucks-11-plus-timeline
│   │   ├── SecondaryTransfer.tsx # /buckinghamshire-secondary-transfer-test
│   │   ├── HowToPass.tsx        # /how-to-pass-bucks-11-plus
│   │   ├── Registration.tsx     # /bucks-11-plus-registration
│   │   ├── CommonMistakes.tsx   # /bucks-11-plus-mistakes
│   │   ├── TownGuide.tsx        # /bucks-11-plus-:town (14 town guides)
│   │   ├── YearGroupGuide.tsx   # /preparing-for-11-plus-year-[4/5/6]
│   │   └── SubjectGuide.tsx     # /11-plus-[verbal-reasoning/non-verbal-reasoning/maths/comprehension]-practice
│   └── ... (HowItWorks, Methodology, GLAlignment, About, Legal)

server/
├── index.ts / db.ts / auth.ts / routes.ts / storage.ts / seed.ts
├── email.ts             # Resend email service (4 triggers, HMAC unsubscribe, GDPR consent)
├── metrics.ts           # Analytics engine (WAI, PDI, fatigue, CR, SI, RS, constraint, impact priorities)
├── stripeClient.ts / webhookHandlers.ts / stripe-seed.ts
├── vite.ts / static.ts

shared/
├── schema.ts            # Drizzle tables + Zod schemas + types
├── contentTypes.ts      # RenderType, SvgFrame, NVR/Chart config types
├── contentValidation.ts # Zod schemas for render_config validation
└── style.ts             # Visual constants (strokeWidth, colours, viewBox)

scripts/
├── generate_seed.ts     # Generates 2,601 questions → questions.seed.json (with full QA validation)
├── seed_questions.ts    # Inserts seed JSON into database
├── generators/
│   ├── types.ts         # GeneratedQuestion interface
│   ├── comprehension.ts # 600 comprehension questions (40 passages × 15 questions, 8 genres, with explanations)
│   ├── vr/              # 6 VR generators (codes, sequences, vocab, etc)
│   ├── nvr/             # 5 NVR generators (sequence, rotation, classification, etc)
│   └── maths/           # 7 Maths generators (arithmetic, fractions, charts, etc)
├── maths_bank_remediation.ts  # Full GL audit script: archives bad questions, approves 59 drafts, inserts 104 new

content/
└── wordbanks/           # UK vocabulary JSON files (Y4, Y5, Y6, synonyms, antonyms)
```

## Database Schema
- **users**: id, username, password, email, childYear, practiceHours, difficultyAreas[], subscriptionTier (free|early_learner|pack12|pack12_family|programme16|programme16_family), subscriptionExpiresAt, stripeCustomerId, onboardingCompleted, isAdmin, activeChildProfileId, emailConsent, emailVerified, emailUnsubscribedAt, lastEmailSentAt. **Note (2 May 2026)**: `child_name` and `target_school` columns dropped per data-minimisation review — child first name now lives in browser localStorage only (`client/src/lib/childNames.ts`), target school no longer collected.
- **child_profiles**: id, userId, childYear, practiceHours, difficultyAreas, stage (exploring|developing|ready), createdAt. (Same May 2026 minimisation: `child_name` + `target_school` removed; first name keyed by `profileId` in browser localStorage only.)
- **email_events**: id, userId, eventType, emailType, sentAt, metadata (jsonb)
- **test_day_config**: id, userId, examDate, createdAt
- **questions**: id, diagnosticId, section, type, prompt, options[], correctAnswer, difficulty, timeExpected, orderIndex, skillId, subRuleId, renderType (text|svg|chart), renderConfig (jsonb), trapTypes[], cognitiveLoad, locale, britishSpelling, version, qualityScore, qaStatus (draft|review|approved|rejected), estTimeSeconds, explanation, notes
- **question_usage**: userId + questionId (composite PK), servedCount, lastServedAt — anti-repeat tracking
- **content_calibration**: questionId (PK), pValue, avgTimeSeconds, sampleSize, lastCalibratedAt
- **question_variants**: id, questionId, variantPrompt, variantOptions, variantRenderConfig, isActive
- **diagnostics**: id, title, subtitle, type, duration, questionCount, requiredTier, sections[]
- **test_sessions**: id, userId, diagnosticId, startedAt, completedAt, totalScore, forecastScore, band, sectionScores, paceData, metrics (jsonb — stores WAI, PDI, CR, RS, fatigue, band etc.)
- **test_answers**: id, sessionId, questionId, selectedAnswer, isCorrect, timeTaken, questionOrder (position in attempt for fatigue calculation)
- **practice_sections**: id, title, category, icon, difficulty, questionCount, requiredTier, skillId
- **articles**: id, title, slug, excerpt, content, category, readTime, publishedAt
- **programme_enrolments / programme_milestones / weekly_plans**: Programme tracking tables
- **programme_tasks**: id (serial), userId, enrolmentId, week, taskType (drill/diagnostic), title, description, skillId, targetCount, completedCount, status (pending/completed), completedAt — weekly task checklist for programme users
- **badges**: id, name, description, icon, category (milestone/score/accuracy/streak/improvement/speed), tier (bronze/silver/gold/platinum), criteria (jsonb), sortOrder
- **user_badges**: id, userId, badgeId, earnedAt, sessionId — tracks earned badges per user
- **stripe.*** (managed by stripe-replit-sync)

## Free Readiness Check (mini-1)
- Hard-coded to always return the same 12 fixed questions in order (4 VR | 3 NVR | 3 Maths | 2 English Comprehension from passage P33)
- Implemented as an early-return fast path in `server/storage.ts` `selectQuestionsForSession()` when `diagnosticId === 'mini-1'`
- Bypasses all pool-selection logic; fetches the 12 question IDs directly
- Changing the 12 IDs requires updating the `FIXED_MINI_IDS` array in `storage.ts`

## Guest Diagnostic Flow
- Guest sessions stored in `test_sessions` with `guestToken` column and nullable `userId`
- API endpoints: POST /api/guest/start-diagnostic, POST /api/guest/submit/:id, GET /api/guest/results/:id?token=xxx, POST /api/guest/claim/:id
- Token stored in sessionStorage + URL param fallback for GuestResults resilience
- Flow A: Landing → /free-diagnostic → TestRunner (guest) → /free-results/:id → sign-up?guestSession=xxx → checkout
- Flow B: /pricing → sign-up?redirect=checkout&tier=pack12 → onboarding → /pricing?autoCheckout=pack12 → Stripe
- Pricing page has 3 interactive demo previews (Results, Analytics, Progress) with DemoCard component
- SignUp handles guestSession claiming + redirect to checkout after onboarding

## API Routes
### Auth
- POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me

### Stripe
- GET /api/stripe/publishable-key, POST /api/checkout, POST /api/checkout/complete, POST /api/stripe/webhook

### Diagnostics & Tests
- GET /api/diagnostics, GET /api/diagnostics/:id, GET /api/diagnostics/:id/questions (anti-repeat selection, tier-gated)
- POST /api/test-sessions, GET /api/test-sessions, GET /api/test-sessions/:id, POST /api/test-sessions/:id/submit

### Practice Drills
- GET /api/practice-sections, GET /api/practice-sections/:id/questions (anti-repeat, returns { questions, exhaustion_warning }), POST /api/practice-sections/:id/check-answer
- POST /api/practice-sections/:id/submit-timed (timed drill submission)
- POST /api/practice-sections/:id/complete-drill (tracks programme task progress)

### Practice Papers
- POST /api/practice-papers/start (body: { paperType: "quick"|"full"|"mock" }) — dynamically selects fresh questions from pool

### Programme
- GET /api/programme, POST /api/programme/milestones/:id/complete, GET /api/programme/completion-summary
- GET /api/programme/tasks, POST /api/programme/tasks/generate — weekly task tracking

### Admin (requireAdmin)
- GET /api/admin/questions, GET /api/admin/questions/qa-queue, GET /api/admin/questions/stats
- GET/POST/PUT/DELETE /api/admin/questions/:id, POST /api/admin/questions/:id/approve|reject

### Accomplishments (Badges)
- GET /api/badges — all badge definitions
- GET /api/badges/mine — current user's earned badges (requireAuth)
- Badge evaluation runs automatically after diagnostic submission (evaluateAndAwardBadges)
- Accomplishments page at /app/badges — shows earned badges by category with progress bar

### Analytics (Parent Hub Premium)
- GET /api/analytics — Full analytics payload (WAI, PDI, fatigue, CR, SI, RS, constraint, priorities, pressure, trajectory)
- GET /api/analytics/detail — Sub-rule heatmap data (accuracy, time, volatility)

### Content
- GET /api/articles, GET /api/articles/:slug, GET /api/progress

## Question Engine
- ~1605 questions (321 VR + 400 NVR + 292 Maths + 592 English Comprehension) — all with answer explanations
- Difficulty distribution: ~20% easy / 39% medium / 41% hard (GL-realistic harder skew)
- NVR questions use SVG render_config (NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig)
- Data interpretation uses chart render_config (ChartBarConfig, ChartLineConfig, ChartTableConfig)
- Anti-repeat: question_usage tracks served_count + last_served_at per user per question
- Selection prioritizes unseen → least recent → lowest count, max 2 per sub_rule_id per 10-question drill
- Hard 7-day cooldown: never serves same question within 7 days (falls back to least-recently-served with exhaustion warning when pool exhausted)
- Guest question_usage migrated to user account on sign-up/claim
- DrillRunner uses session-unique query key (useRef + staleTime:0) so every drill start fetches fresh questions
- QA workflow: draft → review → approved/rejected via admin interface

## Design System
- **Colors**: Deep navy primary (#0d1f30), amber accent, green success, red danger
- **Typography**: Libre Baskerville (serif headings) + Inter (UI body)
- **SVG Style**: viewBox 0 0 100 100, strokeWidth 2.5, stroke #1E293B, fill muted #94A3B8 (slate-400)
- **SVG Shapes**: circle, square, triangle, pentagon, arrow, star, hexagon, diamond, cross, parallelogram, trapezoid, semicircle, right_triangle, kite
- **SVG Fill Patterns**: none, solid, hatched, crosshatched, dotted, striped
- **NVR Frames**: 120px × 120px cards with subtle shadows, numbered labels, clean borders
- **Test UI**: Premium exam-paper background (gradient), premium-card with layered shadows, pill-shaped timer (3 states: normal/warning/danger), option buttons with branded letter badges and hover lift, question fade-in animations, section badge pills
- **CSS Classes**: exam-paper-bg, premium-card, premium-header, timer-pill[-normal/-warning/-danger], option-button, option-badge, option-correct/incorrect/dimmed, section-badge, progress-premium, question-fade-in, feedback-enter, feedback-correct/incorrect, drill-complete-card
- **Monetization**: Free | Bucks Practice Platform £24.99/mo (pack_monthly, TIER_RANK=1, limited: 6 Hard drills, no analytics/mocks) | Bucks Practice Platform Edge £59.99/mo subscription (pack_plus) or £495 one-time/12 months (pack_annual) | Bucks Young Scholar Programme £349 one-time/6 months (programme24_plus). ALL three paid-full tiers share identical feature access. Difference is duration/payment type only. Legacy: pack12 £119, programme8 £59, programme12 £89, programme16 £249, programme16_family £349 — still valid, not shown on pricing page.
- **Payment types**: pack_monthly and pack_plus → Stripe subscription (recurring monthly). pack_annual → Stripe one-time payment (mode: 'payment'), gets subscriptionExpiresAt = 52 weeks. programme24_plus → one-time payment, 24 weeks.
- **PROGRAMME_TIERS** (server/routes.ts): includes pack_plus, pack_annual, AND all programme tiers — gates roadmap, weekly plans, milestone routes, analytics, and simulator. isFullPlatform() gates Hard drills.
- **Upgrade path**: pack_monthly → [pack_plus, pack_annual, programme24_plus]; pack_plus → [pack_annual, programme24_plus]; pack_annual → [] (no upgrades — one-time 12-month plan)

## Key Patterns
- **4 test sections**: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, English Comprehension
- **Question Review**: GET /api/test-sessions/:id/review returns answered questions with explanations, correct answers, difficulty, timing
- **Personalised Upsells**: Results page shows tier-appropriate upgrade suggestions based on weakest section score and overall forecast
- 592 comprehension questions from 40 real passages (parsed from user's docx files), section="English Comprehension", renderType="comprehension"
- Passage distribution: P1-P20 (File 1, 300q, all 15/passage) + P21-P40 (File 2, 292q, some passages have 14)
- 5 skill types: comp.inference (428), comp.authorial_intent (98), comp.text_structure (47), comp.vocabulary (13), comp.fact_retrieval (6)
- Comprehension passage rendering in TestRunner: passage text box above question prompt
- 6 comprehension practice drills: Fact Retrieval, Vocabulary in Context, Inference & Deduction, Mood & Tone, Detail Retrieval, Advanced Comprehension
- GL-style alignment disclaimer: "Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council."
- Tier hierarchy: free (0) = early_learner (0) < pack12 (1) = pack12_family (1) < programme16 (2) = programme16_family (2) — server-side enforcement
- Family tiers support up to 3 child profiles with child_profiles table + ChildSwitcher component
- Early Learner tier: Year 4/5, 6-month access, separate EarlyDashboard with Foundation Readiness %, no exam pressure language
- Test Day Simulator: Programme16-exclusive 2-paper exam with 10-min break, bubble answer sheet UI, forward-only navigation
- Post-results email triggers via Resend: diagnostic_complete, no_drill_nudge, upgrade_nudge, programme_nudge
- HMAC-signed unsubscribe: POST /api/email/unsubscribe?token=...&userId=...
- GDPR email consent toggle in Account page + onboarding
- Hard drills: 6 sections in pack12, all 17 in programme16
- Accomplishments/badges available to all paid tiers
- Anti-repeat on by default for diagnostics and drills
- Content calibration table ready for future p-value/difficulty tuning
- Question variants table ready for future A/B testing
- Stripe checkout uses `payment` mode with session_id verification
- Section naming: "Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics" (not "Maths") — consistent across DB, seed, and generators
- Practice section skillIds mapped to generator skill families (vr.vocab, nvr.sequence, maths.arithmetic, etc.)
- Difficulty profiles per diagnostic type: mini (25/50/25), full (20/45/35), mock (15/40/45) — GL-realistic
- GL-aligned timings: mini 8min, full 30min, mock 35min, practice-quick 15min, practice-full 30min, practice-mock 35min
- Pace expectations: Maths 40s/q, NVR 38s/q, VR 35s/q
- Session cookie: `secure: true` in production, `sameSite: lax`
- Subscription expiry: auto-downgrade to free in requireAuth middleware when `subscriptionExpiresAt` is past
- IDOR protection: test session GET/submit endpoints enforce `session.userId === req.user.id` (admins exempt)
- Error boundary: React class component wraps entire app, shows friendly retry UI on render errors
- syncDiagnosticTimings() runs on every startup to ensure DB has latest durations even for existing deployments

## SEO Infrastructure
- `robots.txt` at `/robots.txt` allowing all crawlers, pointing to sitemap
- `GET /sitemap.xml` server route — all public pages, towns, grammar schools, glossary, high-volume pages, plus the May 2026 tests/practice/mocks/papers cluster (~58 new pages)
- **May 2026 SEO cluster expansion** (`client/src/pages/seo/`): 5 new data-driven templates (`MathsTopic`, `MockVariant`, `VocabCluster`, `UrgencyPlan`, `SchoolScore`) backed by data files in `client/src/data/` (`maths-topics.ts`, `mock-variants.ts`, `vocab-clusters.ts`, `urgency-plans.ts` — `SchoolScore` reuses canonical `grammar-schools.ts`). 4 new individual rich pages (`GLAssessmentPractice`, `GLAssessmentPastPapers`, `GLAssessmentQuestionTypes`, `FreeResources`). 15+ question types in `QUESTION_TYPES` (auto-route via existing `QuestionTypeGuide` template). New `FreeSamplePapers` page at `/bucks-11-plus-free-sample-papers` listing both downloadable practice papers. All pages: GL-aligned content, distinct/non-boilerplate, `Seo` + `Breadcrumbs` + `ContentCTA` + `Disclaimer` + `ChildExperienceCTA` pattern, indicative readiness language, no competitor comparisons, no social-proof claims, British spelling, all funnel to `/free-diagnostic`. Routes registered in `client/src/App.tsx`, sitemap entries appended in `server/routes.ts`, llms.txt updated.
- `Seo` component supports `canonicalPath` and `schema` (JSON-LD) props (SPA pages)
- **Full SSR architecture** — Googlebot receives pre-rendered HTML for all content pages:
  - `server/ssrShared.ts` — `ssrShell()`, breadcrumbs, footer, CTA box, FAQ section, disclaimer
  - `server/ssrPages.ts` — Town guides (16), Grammar school guides (13), Subject guides (4), Year-group guides (3), Learn Hub + 30 articles
  - `server/ssrGlossary.ts` — Glossary index + 22 term pages (DefinedTerm schema)
  - `server/ssrHighVolume.ts` — **9 new high-volume pages** (test dates 2025/2026, past papers, results, sample questions, score calculator, tutors, appeals, registration)
- Schema markup: BreadcrumbList + FAQPage + Article + DefinedTerm + Event (test date pages) + HowTo on all relevant pages
- Town page depth: ~2,600 words each (expanded with prep timeline, 121 explainer, cross-links)
- Grammar school depth: ~2,400 words each (at-a-glance table, admissions timeline, domain explainer)
- **og:image fix**: `vite-plugin-meta-images.ts` updated to use canonical production domain (was overriding with Replit dev URL)
- Target domain: `bucks11plustest.co.uk` (canonical URLs, sitemap, og:image, Twitter card)
- Footer: 6 columns (Brand, Platform, Key Dates, Resources, Local Guides, Legal) — E-E-A-T trust signals

## Parent Guide / Lead Capture
- Landing page: `/bucks-11-plus-parent-guide` with hero, 3-column explainer, guide previews, dashboard previews, email capture form, FAQ with JSON-LD
- Email capture stores to `guide_leads` table (parentName, email, downloadedAt, clickedDiagnostic)
- API: `POST /api/guide-leads` (public), `POST /api/guide-leads/:id/diagnostic-click`
- Downloadable PDF at `/bucks-11-plus-parent-guide.pdf` (7 pages, generated via `scripts/generate-guide-pdf.ts`)
- Static dashboard preview components: `DashboardPreviewForecast` (gauge + skill bars) and `DashboardPreviewPace` (pace cards + heatmap)
- Print-optimised page at `client/src/pages/GuidePrint.tsx` (internal, not routed)
- Cross-linked from BucksGuide pillar page and footer Resources column

## Free Practice Paper Lead Magnet + Post-Diagnostic Nurture
- Tables: `practice_paper_leads` (id, email, source, downloadedAt, unsubscribed) and `nurture_sequences` (id, email, sessionId, sequenceType, currentStep, nextSendAt, completedAt, unsubscribed, metadata)
- Print pages: `PracticePaperPrint.tsx` (`/practice-paper-print`) and `PracticePaperPrint2.tsx` (`/practice-paper-print-2`) — both A4 printable. Paper 2 has different question types: VR synonyms/compound/letter-sequence, Maths area/sequences/fractions, NVR rotation/matrix/reflection, Comprehension on Northern Lights passage
- Hub page: `FreeSamplePapers.tsx` at `/bucks-11-plus-free-sample-papers` — lists both paper download cards, LeadMagnetBlock, digital-vs-paper advantages section, CTA to free diagnostic
- Reusable form: `client/src/components/shared/LeadMagnetBlock.tsx` (default + compact variants) — embedded on 10 high-intent SEO pages (HowToPass, CommonMistakes, QualifyingScore, Timeline, Registration, SecondaryTransfer, PastPapers, PracticePapersFree, MockTest, SampleQuestions, FAQHub) just before each ContentCTA
- Server module: `server/leadMagnet.ts` — HMAC-signed download tokens (using `EMAIL_SECRET`), Resend send, puppeteer PDF generation hitting `/practice-paper-print` (Paper 1) and `/practice-paper-print-2` (Paper 2) each with 60-min in-memory cache, post-diagnostic nurture queue (day 2 + day 5), background processor running every 5 min via `setInterval`
- API endpoints: `POST /api/leads/practice-paper`, `GET /api/leads/practice-paper/pdf?id&token`, `GET /api/leads/practice-paper/unsubscribe?email&token`, `GET /api/practice-paper-2/download` (public, no email gate)
- Nurture hook: enqueues 2-step sequence inside `POST /api/guest/email-results` (existing handler)
- Pricing CRO: 3-card trust strip (cancel anytime, 3-day money-back, "less than one tutor hour" annual frame) — placed after plan cards, before comparison table
- FreeDiagnosticStart CRO: 3-column trust signal block (forecast vs 121, top 3 priorities, no account/no card) above start button

## Calculator + Customer-Journey Test Harness
- Single-shot test runner: `scripts/test-calculators-and-journey.ts` (run via `npx tsx`) — 61 assertions, currently 61/61 passing
- Surfaces covered:
  - Public ScoreCalculator (`estimateStandardisedScore`) — boundary, age-cap, fuzz 5 000 inputs
  - Forecast score (POST `/api/guest/submit`) — GL weights, banding, oracle parity check (server output === recomputed)
  - RS analytics (`computeWAI/PDI/CR/SI/RS`) — banding matrix, 1 000-attempt stress test
  - End-to-end customer journey (real HTTP + DB) — start → submit → fetch results → email → nurture enqueue → lead-magnet → unsubscribe, with replay-protection + token-auth checks and try/finally cleanup
- Security regression guard: `GET /api/guest/results/:id` and `/api/guest/review/:id` previously had `if (token && session.guestToken !== token)` which let missing-token requests through; fixed to `if (!token || ...)` and the harness now asserts the no-token path returns 403

## 121 Compliance — IndicativeScoreCaveat
- Shared component `client/src/components/shared/IndicativeScoreCaveat.tsx` (inline + block variants, links `/scoring-methodology`) used on every surface where our internally-calculated readiness number is shown next to the GL Assessment 121 standardised score
- Surfaces with inline caveat adjacent to the number: Results, GuestResults, Dashboard, Progress, ParentAnalytics SummaryTab, Programme (Forecast/Gap row), TestDaySimulator results
- Surfaces with block caveat: HowItWorks (above readiness-bands legend), seo/QualifyingScore (methodology section before CTAs)
- Marketing mockups (Landing ForecastPanel, DashboardPreview) carry the "Illustrative preview" footnote
- Standard terminology: "Indicative Readiness" (never "Forecast"/"Est. Score"/"estimated score" beside the number); "121 preparation benchmark" / "121 benchmark" (never "121 Target" / "qualifying standard")
- Audit reference: `compliance/121-references-audit.md`

## Editorial Policy — No Competitor Brands
- Site copy must not name any competing 11+ product (book publishers, tutoring brands, other prep platforms)
- Removed brands: CGP, Bond / Bond 11+ / Bond Assessment Papers, Schofield & Sims, Hodder Education, RSL
- Allowed (not competitors): GL Assessment (the exam board), CEM (different exam board, contextual), Buckinghamshire Council
- When discussing print/online alternatives, use neutral category language: "established UK education publishers", "print 11+ workbooks", "GL Assessment-format practice paper packs", "on-screen practice (such as our platform)"

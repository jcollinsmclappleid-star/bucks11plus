# 11+ Standard — Buckinghamshire 11+ Exam Preparation Platform

## Overview
A full-stack web platform for Buckinghamshire 11+ exam preparation, aligned to GL-style reasoning families used in Bucks. Features timed diagnostics, a proprietary readiness forecast against the 121 benchmark, targeted practice drills with anti-repeat question selection, an admin QA system, SVG-rendered NVR questions, chart-based data interpretation, a Parent Hub content engine for SEO, and a 3-tier monetization model: Free (mini diagnostic), £99 Practice Platform (12 weeks), £249 Young Scholar Programme (16 weeks).

## Architecture
- **Frontend**: React 19 + Vite + TailwindCSS v4 + Shadcn/UI + wouter routing + TanStack Query
- **Backend**: Express 5 + TypeScript + Passport.js (local strategy) + express-session (pg-backed)
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe (one-time payment mode via checkout sessions), stripe-replit-sync for schema sync
- **Question Engine**: Rule-tagged questions with skill_id/sub_rule_id, SVG rendering for NVR, chart rendering for data interpretation, anti-repeat via question_usage table
- **Shared**: Schema definitions in `shared/schema.ts`, content types in `shared/contentTypes.ts`, validation in `shared/contentValidation.ts`

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
│   │   ├── GrammarSchools.tsx   # /bucks-grammar-schools
│   │   ├── QualifyingScore.tsx  # /bucks-11-plus-qualifying-score
│   │   ├── Timeline.tsx         # /bucks-11-plus-timeline
│   │   ├── SecondaryTransfer.tsx # /buckinghamshire-secondary-transfer-test
│   │   ├── HowToPass.tsx        # /how-to-pass-bucks-11-plus
│   │   ├── Registration.tsx     # /bucks-11-plus-registration
│   │   ├── CommonMistakes.tsx   # /bucks-11-plus-mistakes
│   │   └── TownGuide.tsx        # /bucks-11-plus-:town (template for 8 towns)
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
├── generate_seed.ts     # Generates 900 questions → questions.seed.json
├── seed_questions.ts    # Inserts seed JSON into database
├── generators/
│   ├── types.ts         # GeneratedQuestion interface
│   ├── vr/              # 6 VR generators (codes, sequences, vocab, etc)
│   ├── nvr/             # 5 NVR generators (sequence, rotation, classification, etc)
│   └── maths/           # 7 Maths generators (arithmetic, fractions, charts, etc)

content/
└── wordbanks/           # UK vocabulary JSON files (Y4, Y5, Y6, synonyms, antonyms)
```

## Database Schema
- **users**: id, username, password, email, childName, childYear, practiceHours, difficultyAreas[], subscriptionTier (free|early_learner|pack12|pack12_family|programme16|programme16_family), subscriptionExpiresAt, stripeCustomerId, onboardingCompleted, isAdmin, activeChildProfileId, emailConsent, emailVerified, emailUnsubscribedAt, lastEmailSentAt
- **child_profiles**: id, userId, childName, childYear, practiceHours, difficultyAreas, stage (exploring|developing|ready), createdAt
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
- ~1013 questions (321 VR + 400 NVR + 292 Maths) generated via scripts/generators
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
- **SVG Style**: viewBox 0 0 100 100, strokeWidth 2.5, stroke #1E293B, fill muted #E2E8F0
- **SVG Shapes**: circle, square, triangle, pentagon, arrow, star, hexagon, diamond, cross, parallelogram, trapezoid, semicircle, right_triangle, kite
- **SVG Fill Patterns**: none, solid, hatched, crosshatched, dotted, striped
- **NVR Frames**: 120px × 120px cards with subtle shadows, numbered labels, clean borders
- **Test UI**: Premium exam-paper background (gradient), premium-card with layered shadows, pill-shaped timer (3 states: normal/warning/danger), option buttons with branded letter badges and hover lift, question fade-in animations, section badge pills
- **CSS Classes**: exam-paper-bg, premium-card, premium-header, timer-pill[-normal/-warning/-danger], option-button, option-badge, option-correct/incorrect/dimmed, section-badge, progress-premium, question-fade-in, feedback-enter, feedback-correct/incorrect, drill-complete-card
- **Monetization**: Free → Early Learner £49 (6mo) → Practice Platform £99 (12wk) → Platform Family £149 → Programme £249 (16wk) → Programme Family £349

## Key Patterns
- **4 test sections**: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, English Comprehension
- 700 comprehension questions total: 200 (comp200, 40 passages) + 500 (comp500, 100 passages), section="English Comprehension", renderType="comprehension"
- comp500 distribution: 350 Hard (passages 1-70) + 150 Medium (passages 71-100), 39 unique passage titles cycling
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
- `GET /sitemap.xml` server route with all public pages + 8 town pages
- `Seo` component supports `canonicalPath` and `schema` (JSON-LD) props
- Shared components: `ContentCTA.tsx`, `Disclaimer.tsx`, `Breadcrumbs.tsx` (with BreadcrumbList schema)
- Pillar page: `/buckinghamshire-11-plus-guide` with FAQ JSON-LD
- Cluster pages: grammar schools, qualifying score, timeline, secondary transfer test
- High-value pages: how to pass, registration, common mistakes
- 8 local town pages via TownGuide template + `client/src/data/towns.ts` data
- Footer: 5 columns (Brand, Platform, Resources, Local Guides, Legal)
- Target domain: `bucks11plustest.co.uk` (canonical URLs and sitemap)

## Parent Guide / Lead Capture
- Landing page: `/bucks-11-plus-parent-guide` with hero, 3-column explainer, guide previews, dashboard previews, email capture form, FAQ with JSON-LD
- Email capture stores to `guide_leads` table (parentName, email, downloadedAt, clickedDiagnostic)
- API: `POST /api/guide-leads` (public), `POST /api/guide-leads/:id/diagnostic-click`
- Downloadable PDF at `/bucks-11-plus-parent-guide.pdf` (7 pages, generated via `scripts/generate-guide-pdf.ts`)
- Static dashboard preview components: `DashboardPreviewForecast` (gauge + skill bars) and `DashboardPreviewPace` (pace cards + heatmap)
- Print-optimised page at `client/src/pages/GuidePrint.tsx` (internal, not routed)
- Cross-linked from BucksGuide pillar page and footer Resources column

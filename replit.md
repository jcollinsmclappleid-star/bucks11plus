# 11+ Standard — Buckinghamshire 11+ Exam Preparation Platform

## Overview
A full-stack web platform for Buckinghamshire 11+ exam preparation, aligned to GL-style reasoning families used in Bucks. Features timed diagnostics, a proprietary readiness forecast against the 121 benchmark, targeted practice drills with anti-repeat question selection, an admin QA system, SVG-rendered NVR questions, chart-based data interpretation, a Parent Hub content engine for SEO, and a 3-tier monetization model: Free (mini diagnostic), £99 Practice Pack (12 weeks), £249 Structured Readiness Programme (16 weeks).

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
│   ├── layout/Navbar.tsx # Auth-aware navigation (Programme/Admin links)
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
│   ├── Dashboard.tsx     # Readiness forecast & priority focus
│   ├── Diagnostics.tsx   # Available assessments (tier-gated)
│   ├── DiagnosticStart.tsx / TestRunner.tsx (visual questions + exam paper layout)
│   ├── Results.tsx       # Post-test + tiered impact simulator
│   ├── Progress.tsx      # Trajectory + gap velocity + forecast stability
│   ├── Practice.tsx      # Drill sections (links to DrillRunner)
│   ├── DrillRunner.tsx   # Practice drill runner with immediate feedback
│   ├── Programme.tsx / ProgrammeCompletion.tsx / CheckoutSuccess.tsx
│   ├── Pricing.tsx       # 3-tier pricing
│   ├── ParentHub.tsx / Article.tsx
│   ├── admin/
│   │   ├── QuestionList.tsx  # Filterable question table + stats + QA queue
│   │   └── QuestionEditor.tsx # Full editor with live preview + validation
│   └── ... (HowItWorks, Methodology, GLAlignment, About, Legal)

server/
├── index.ts / db.ts / auth.ts / routes.ts / storage.ts / seed.ts
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
- **users**: id, username, password, email, childName, childYear, practiceHours, difficultyAreas[], subscriptionTier (free|pack12|programme16), subscriptionExpiresAt, stripeCustomerId, onboardingCompleted, isAdmin
- **questions**: id, diagnosticId, section, type, prompt, options[], correctAnswer, difficulty, timeExpected, orderIndex, skillId, subRuleId, renderType (text|svg|chart), renderConfig (jsonb), trapTypes[], cognitiveLoad, locale, britishSpelling, version, qualityScore, qaStatus (draft|review|approved|rejected), estTimeSeconds, explanation, notes
- **question_usage**: userId + questionId (composite PK), servedCount, lastServedAt — anti-repeat tracking
- **content_calibration**: questionId (PK), pValue, avgTimeSeconds, sampleSize, lastCalibratedAt
- **question_variants**: id, questionId, variantPrompt, variantOptions, variantRenderConfig, isActive
- **diagnostics**: id, title, subtitle, type, duration, questionCount, requiredTier, sections[]
- **test_sessions**: id, userId, diagnosticId, startedAt, completedAt, totalScore, forecastScore, band, sectionScores, paceData
- **test_answers**: id, sessionId, questionId, selectedAnswer, isCorrect, timeTaken
- **practice_sections**: id, title, category, icon, difficulty, questionCount, requiredTier, skillId
- **articles**: id, title, slug, excerpt, content, category, readTime, publishedAt
- **programme_enrolments / programme_milestones / weekly_plans**: Programme tracking tables
- **stripe.*** (managed by stripe-replit-sync)

## API Routes
### Auth
- POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me

### Stripe
- GET /api/stripe/publishable-key, POST /api/checkout, POST /api/checkout/complete, POST /api/stripe/webhook

### Diagnostics & Tests
- GET /api/diagnostics, GET /api/diagnostics/:id, GET /api/diagnostics/:id/questions (anti-repeat selection, tier-gated)
- POST /api/test-sessions, GET /api/test-sessions, GET /api/test-sessions/:id, POST /api/test-sessions/:id/submit

### Practice Drills
- GET /api/practice-sections, GET /api/practice-sections/:id/questions (anti-repeat), POST /api/practice-sections/:id/check-answer

### Programme
- GET /api/programme, POST /api/programme/milestones/:id/complete, GET /api/programme/completion-summary

### Admin (requireAdmin)
- GET /api/admin/questions, GET /api/admin/questions/qa-queue, GET /api/admin/questions/stats
- GET/POST/PUT/DELETE /api/admin/questions/:id, POST /api/admin/questions/:id/approve|reject

### Content
- GET /api/articles, GET /api/articles/:slug, GET /api/progress

## Question Engine
- 900+ questions (300 VR + 300 NVR + 300 Maths) generated via scripts/generators
- NVR questions use SVG render_config (NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig)
- Data interpretation uses chart render_config (ChartBarConfig, ChartLineConfig, ChartTableConfig)
- Anti-repeat: question_usage tracks served_count + last_served_at per user per question
- Selection prioritizes unseen → least recent → lowest count, caps sub_rule_id at 40%
- QA workflow: draft → review → approved/rejected via admin interface

## Design System
- **Colors**: Deep navy primary, amber accent, green success, red danger
- **Typography**: Libre Baskerville (serif headings) + Inter (UI body)
- **SVG Style**: viewBox 0 0 100 100, strokeWidth 3, stroke #111827, fill muted #E5E7EB
- **Exam Paper Layout**: White card, border-slate-200, rounded-xl, p-8, shadow-sm
- **Monetization**: Free → Practice Pack £99 → Structured Programme £249

## Key Patterns
- GL-style alignment disclaimer: "Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council."
- Tier hierarchy: free (0) < pack12 (1) < programme16 (2) — server-side enforcement
- Anti-repeat on by default for diagnostics and drills
- Content calibration table ready for future p-value/difficulty tuning
- Question variants table ready for future A/B testing
- Stripe checkout uses `payment` mode with session_id verification
- Section naming: "Verbal Reasoning", "Non-Verbal Reasoning", "Mathematics" (not "Maths") — consistent across DB, seed, and generators
- Practice section skillIds mapped to generator skill families (vr.vocab, nvr.sequence, maths.arithmetic, etc.)

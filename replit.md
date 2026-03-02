# 11+ Standard — Buckinghamshire 11+ Exam Preparation Platform

## Overview
A full-stack web platform for Buckinghamshire 11+ exam preparation. Features GL-aligned timed diagnostics, a proprietary readiness forecast against the 121 benchmark, targeted practice drills, a Parent Hub content engine for SEO, and a 3-tier monetization model: Free (mini diagnostic), £99 Practice Pack (12 weeks), £249 Structured Readiness Programme (16 weeks).

## Architecture
- **Frontend**: React 19 + Vite + TailwindCSS v4 + Shadcn/UI + wouter routing + TanStack Query
- **Backend**: Express 5 + TypeScript + Passport.js (local strategy) + express-session (pg-backed)
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe (one-time payment mode via checkout sessions), stripe-replit-sync for schema sync
- **Shared**: Schema definitions in `shared/schema.ts` used by both frontend and backend

## Project Structure
```
client/src/
├── App.tsx              # Router with auth-aware MainLayout
├── lib/
│   ├── auth.tsx         # AuthProvider context + useAuth hook (isPack12, isProgramme, hasPaidAccess helpers)
│   └── queryClient.ts   # TanStack Query client + apiRequest helper
├── components/
│   ├── layout/Navbar.tsx # Auth-aware navigation (Programme link for programme16 users)
│   ├── shared/Seo.tsx    # Per-page SEO meta tags
│   └── ui/              # Shadcn components
├── pages/
│   ├── Landing.tsx       # Marketing landing page
│   ├── SignIn.tsx        # Login (passport-local)
│   ├── SignUp.tsx        # Registration
│   ├── Onboarding.tsx    # 4-step profile setup
│   ├── Dashboard.tsx     # Readiness forecast & priority focus (programme link for programme16)
│   ├── Diagnostics.tsx   # Available assessments list (tier-gated)
│   ├── DiagnosticStart.tsx # Pre-test instructions
│   ├── TestRunner.tsx    # Timed test taking (no navbar)
│   ├── Results.tsx       # Post-test results + tiered impact simulator + milestone banner
│   ├── Progress.tsx      # Trajectory chart + gap velocity + forecast stability (programme16)
│   ├── Practice.tsx      # Drill sections by category (tier-gated)
│   ├── Account.tsx       # User profile & subscription tier info
│   ├── ReportArchive.tsx # Historical test reports (paid access)
│   ├── Programme.tsx     # 16-week programme dashboard (programme16 only)
│   ├── ProgrammeCompletion.tsx # Programme completion summary
│   ├── CheckoutSuccess.tsx # Post-Stripe checkout activation
│   ├── Pricing.tsx       # 3-tier: Free / Pack £99 / Programme £249
│   ├── ParentHub.tsx     # SEO article listing
│   ├── Article.tsx       # Individual article view
│   ├── HowItWorks.tsx    # Product explainer
│   ├── Methodology.tsx   # Forecast methodology
│   ├── GLAlignment.tsx   # GL test alignment details
│   ├── About.tsx         # About page
│   └── Legal.tsx         # Terms/Privacy/Safeguarding

server/
├── index.ts             # Express app entry (Stripe init before routes)
├── db.ts                # Drizzle + pg pool connection
├── auth.ts              # Passport setup, register/login/logout routes
├── routes.ts            # API routes (/api/*) including checkout + programme
├── storage.ts           # DatabaseStorage class (Drizzle queries)
├── seed.ts              # Initial data seeding (diagnostics, questions, articles, practice)
├── stripeClient.ts      # Stripe SDK client + publishable key + sync utilities
├── webhookHandlers.ts   # Stripe webhook processing via stripe-replit-sync
├── stripe-seed.ts       # One-time Stripe product/price creation script
├── vite.ts              # Vite dev server middleware
└── static.ts            # Production static file serving

shared/
└── schema.ts            # Drizzle tables + Zod schemas + TypeScript types
```

## Database Schema
- **users**: id, username, password, email, childName, childYear, practiceHours, difficultyAreas[], subscriptionTier (free|pack12|programme16), subscriptionExpiresAt, stripeCustomerId, onboardingCompleted
- **diagnostics**: id, title, subtitle, type, duration, questionCount, requiredTier (free|pack12|programme16), sections[]
- **questions**: id, diagnosticId, section, type, prompt, options[], correctAnswer, difficulty, timeExpected, orderIndex
- **test_sessions**: id, userId, diagnosticId, startedAt, completedAt, totalScore, forecastScore, band, sectionScores (jsonb), paceData (jsonb)
- **test_answers**: id, sessionId, questionId, selectedAnswer, isCorrect, timeTaken
- **articles**: id, title, slug, excerpt, content, category, readTime, publishedAt
- **practice_sections**: id, title, category, icon, difficulty, questionCount, requiredTier (free|pack12)
- **programme_enrolments**: id, userId, status (active|completed|expired), startAt, endAt, currentWeek, createdAt
- **programme_milestones**: id, userId, enrolmentId, week, milestoneType, title, description, dueAt, completedAt, linkedDiagnosticId, linkedSessionId, createdAt
- **weekly_plans**: id, userId, enrolmentId, week, phase, planJson (jsonb), createdAt
- **stripe.*** (managed by stripe-replit-sync): products, prices, customers, checkout_sessions, etc.

## API Routes
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user (401 if unauthenticated)
- `PUT /api/user/onboarding` - Save onboarding data (auth required)
- `GET /api/stripe/publishable-key` - Stripe publishable key
- `POST /api/checkout` - Create Stripe checkout session for pack12 or programme16 (auth)
- `POST /api/checkout/complete` - Activate tier after successful payment (auth)
- `POST /api/stripe/webhook` - Stripe webhook endpoint (raw body, before express.json)
- `GET /api/diagnostics` - List all diagnostics
- `GET /api/diagnostics/:id` - Single diagnostic
- `GET /api/diagnostics/:id/questions` - Questions (auth, correctAnswer stripped)
- `POST /api/test-sessions` - Create test session (auth)
- `GET /api/test-sessions` - User's sessions (auth)
- `GET /api/test-sessions/:id` - Single session (auth)
- `POST /api/test-sessions/:id/submit` - Submit answers & calculate results (auth)
- `GET /api/progress` - Trajectory, velocity, gapVelocity, forecastStability (auth)
- `GET /api/programme` - Enrolment, milestones, weekly plans (auth, programme16)
- `POST /api/programme/milestones/:id/complete` - Mark milestone complete (auth)
- `GET /api/programme/completion-summary` - Completion summary data (auth)
- `GET /api/articles` - All articles
- `GET /api/articles/:slug` - Article by slug
- `GET /api/practice-sections` - All practice sections

## Design System
- **Colors**: Deep navy primary (220 50% 15%), amber accent (38 92% 50%), green success, red danger
- **Typography**: Libre Baskerville (serif headings) + Inter (UI body)
- **Monetization**: Free → Practice Pack £99 (12 weeks) → Structured Programme £249 (16 weeks, launch price)

## Key Patterns
- `useAuth()` hook provides user state, login/register/logout, isPack12/isProgramme/hasPaidAccess/tierLabel
- Tier hierarchy: free (0) < pack12 (1) < programme16 (2) — content gated by TIER_RANK comparison
- All `/app/*` routes are auth-gated in the frontend
- wouter `<Link>` used for all navigation (no nested `<a>` tags)
- Tailwind v4 color tokens defined as `H S% L%` in `:root`, used via `hsl(var(--token))`
- Test sessions calculate forecastScore as: `90 + (correctPercent / 100) * 51`
- Stripe checkout uses `payment` mode (one-time), not subscriptions
- Webhook route registered BEFORE express.json() middleware
- Programme enrolment auto-creates 4 milestones (weeks 1, 6, 12, 16) and initial weekly plans

# 11+ Standard — Buckinghamshire 11+ Exam Preparation Platform

## Overview
A full-stack web platform for Buckinghamshire 11+ exam preparation. Features GL-aligned timed diagnostics, a proprietary readiness forecast against the 121 benchmark, targeted practice drills, a Parent Hub content engine for SEO, and a freemium-to-subscription monetization model.

## Architecture
- **Frontend**: React 19 + Vite + TailwindCSS v4 + Shadcn/UI + wouter routing + TanStack Query
- **Backend**: Express 5 + TypeScript + Passport.js (local strategy) + express-session (pg-backed)
- **Database**: PostgreSQL with Drizzle ORM
- **Shared**: Schema definitions in `shared/schema.ts` used by both frontend and backend

## Project Structure
```
client/src/
├── App.tsx              # Router with auth-aware MainLayout
├── lib/
│   ├── auth.tsx         # AuthProvider context + useAuth hook
│   └── queryClient.ts   # TanStack Query client + apiRequest helper
├── components/
│   ├── layout/Navbar.tsx # Auth-aware navigation
│   ├── shared/Seo.tsx    # Per-page SEO meta tags
│   └── ui/              # Shadcn components
├── pages/
│   ├── Landing.tsx       # Marketing landing page
│   ├── SignIn.tsx        # Login (passport-local)
│   ├── SignUp.tsx        # Registration
│   ├── Onboarding.tsx    # 4-step profile setup
│   ├── Dashboard.tsx     # Readiness forecast & priority focus
│   ├── Diagnostics.tsx   # Available assessments list
│   ├── DiagnosticStart.tsx # Pre-test instructions
│   ├── TestRunner.tsx    # Timed test taking (no navbar)
│   ├── Results.tsx       # Post-test results + impact simulator
│   ├── Progress.tsx      # Trajectory chart + 12-week plan
│   ├── Practice.tsx      # Drill sections by category
│   ├── Account.tsx       # User profile & subscription
│   ├── ReportArchive.tsx # Historical test reports
│   ├── ParentHub.tsx     # SEO article listing
│   ├── Article.tsx       # Individual article view
│   ├── Pricing.tsx       # Free/Monthly/Pack tiers
│   ├── HowItWorks.tsx    # Product explainer
│   ├── Methodology.tsx   # Forecast methodology
│   ├── GLAlignment.tsx   # GL test alignment details
│   ├── About.tsx         # About page
│   └── Legal.tsx         # Terms/Privacy/Safeguarding

server/
├── index.ts             # Express app entry point
├── db.ts                # Drizzle + pg pool connection
├── auth.ts              # Passport setup, register/login/logout routes
├── routes.ts            # API routes (/api/*)
├── storage.ts           # DatabaseStorage class (Drizzle queries)
├── seed.ts              # Initial data seeding
├── vite.ts              # Vite dev server middleware
└── static.ts            # Production static file serving

shared/
└── schema.ts            # Drizzle tables + Zod schemas + TypeScript types
```

## Database Schema
- **users**: id, username, password, email, childName, childYear, practiceHours, difficultyAreas[], subscriptionTier, onboardingCompleted
- **diagnostics**: id, title, subtitle, type, duration, questionCount, requiredTier, sections[]
- **questions**: id, diagnosticId, section, type, prompt, options[], correctAnswer, difficulty, timeExpected, orderIndex
- **test_sessions**: id, userId, diagnosticId, startedAt, completedAt, totalScore, forecastScore, band, sectionScores (jsonb), paceData (jsonb)
- **test_answers**: id, sessionId, questionId, selectedAnswer, isCorrect, timeTaken
- **articles**: id, title, slug, excerpt, content, category, readTime, publishedAt
- **practice_sections**: id, title, category, icon, difficulty, questionCount, requiredTier

## API Routes
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user (401 if unauthenticated)
- `PUT /api/user/onboarding` - Save onboarding data (auth required)
- `GET /api/diagnostics` - List all diagnostics
- `GET /api/diagnostics/:id` - Single diagnostic
- `GET /api/diagnostics/:id/questions` - Questions (auth, correctAnswer stripped)
- `POST /api/test-sessions` - Create test session (auth)
- `GET /api/test-sessions` - User's sessions (auth)
- `GET /api/test-sessions/:id` - Single session (auth)
- `POST /api/test-sessions/:id/submit` - Submit answers & calculate results (auth)
- `GET /api/progress` - Trajectory & velocity data (auth)
- `GET /api/articles` - All articles
- `GET /api/articles/:slug` - Article by slug
- `GET /api/practice-sections` - All practice sections

## Design System
- **Colors**: Deep navy primary (220 50% 15%), amber accent (38 92% 50%), green success, red danger
- **Typography**: Libre Baskerville (serif headings) + Inter (UI body)
- **Monetization**: Free (mini diagnostic) → Monthly £39 → 12-Week Pack £99

## Key Patterns
- `useAuth()` hook provides user state, login/register/logout functions
- All `/app/*` routes are auth-gated in the frontend
- wouter `<Link>` used for all navigation (no nested `<a>` tags)
- Tailwind v4 color tokens defined as `H S% L%` in `:root`, used via `hsl(var(--token))`
- Test sessions calculate forecastScore as: `90 + (correctPercent / 100) * 51`

# 11+ Standard

A full-stack web platform for Buckinghamshire 11+ exam preparation, helping students achieve an indicative readiness score against the 121 qualifying standard.

## Run & Operate

**Required Environment Variables:**
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

**Commands:**
- `npm install`: Install dependencies.
- `npm run dev`: Start the development server (client and server).
- `npm run build`: Build the client and server for production.
- `npm run typecheck`: Run TypeScript type checking.
- `npx drizzle-kit push:pg`: Push Drizzle schema changes to PostgreSQL.
- `npm run stripe-replit-sync`: Sync Stripe schema.

## Stack

- **Frontend**: React 19, Vite, TailwindCSS v4, Shadcn/UI, wouter, TanStack Query
- **Backend**: Express 5, TypeScript, Passport.js (local strategy), express-session (pg-backed)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Payments**: Stripe
- **Validation**: Zod (for schemas)
- **Build Tool**: Vite

## Where things live

- `client/src/`: Frontend React application.
- `server/`: Backend Express application.
- `shared/`: Shared types, schemas, and validation.
  - **DB Schema**: `shared/schema.ts`
  - **API Contracts**: Defined implicitly by `server/routes.ts` and `shared/schema.ts`.
  - **Theme/Design**: `client/src/lib/tailwind.config.ts`, `client/src/index.css`, `shared/style.ts`
  - **NVR Generators**: `scripts/generators/nvr/`
  - **Comprehension Passages**: `scripts/generators/comprehension.ts` (source of content)
- `scripts/`: Development and utility scripts (seed data, migrations, PDF generation).
- `content/wordbanks/`: UK vocabulary JSON files.
- `public/`: Static assets.
- `compliance/`: Compliance-related documentation (`121-references-audit.md`).

## Architecture decisions

- **Guest Sessions**: Allows users to take diagnostics without immediate registration, improving conversion rates by deferring commitment.
- **Anti-Repeat Question Selection**: Implemented at the database level (`question_usage` table) to ensure diverse practice and prevent rote memorization, with a 7-day cooldown and fallback logic.
- **SVG-rendered NVR Questions**: Custom SVG rendering engine for Non-Verbal Reasoning questions ensures high fidelity and programmatic generation flexibility.
- **Full SSR Architecture**: All public content pages are server-side rendered for optimal SEO and initial page load performance, crucial for content marketing.
- **GDPR-compliant Data Minimization**: Deliberate decision to store sensitive child data (like names) only in browser localStorage and anonymize emails in logs to enhance user privacy and compliance.

## Product

- **11+ Exam Preparation**: Platform focused on Buckinghamshire 11+ exams, aligned with GL-style reasoning.
- **Diagnostic Assessments**: Timed diagnostics and a proprietary readiness forecast against the 121 benchmark.
- **Targeted Practice**: Practice drills with anti-repeat question selection.
- **Question Banks**: Extensive, GL-audited question banks for Maths, NVR (SVG-rendered), VR, and English Comprehension.
- **Parent Analytics**: Premium analytics for tracking child progress, including Weakness Analysis and Impact Priorities.
- **Monetization Model**: Tiered access including free diagnostics, monthly/annual subscriptions, and a structured coaching program.
- **Parent Hub**: Content engine for SEO with articles, guides, and lead magnets.
- **Test Day Simulator**: A 2-paper exam simulator with a bubble answer sheet for advanced tiers.

## User preferences

- _Populate as you build_

## Gotchas

- **121 Score Phrasing**: Always use "indicative readiness score against the 121 qualifying standard" for our product output; never "standardised score" or "forecast standardised score."
- **NVR Generators**: The NVR generators (`scripts/generators/nvr/`) are complex and built to GL expert specifications; modifying them requires deep understanding of the `ShapeAttrs` model and rule stacks.
- **Free Readiness Check**: The "mini-1" diagnostic is hard-coded to 12 specific questions; changing them requires updating `FIXED_MINI_IDS` in `server/storage.ts`.
- **Stripe Webhooks**: Ensure the Stripe webhook handler (`server/webhookHandlers.ts`) is correctly configured and accessible to Stripe for subscription lifecycle management.
- **Email Unsubscribe**: The email unsubscribe mechanism relies on HMAC-signed tokens; ensure `EMAIL_SECRET` is consistent and protected.

## Pointers

- **GL Assessment**: Refer to official GL Assessment documentation for exam structure and question types.
- **Stripe Documentation**: For payment processing and subscription management.
- **Drizzle ORM Docs**: For database schema definition and query building.
- **React Query Docs**: For data fetching, caching, and state management in the frontend.
- **Tailwind CSS Docs**: For styling and design system implementation.
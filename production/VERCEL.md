# Vercel deployment

## Prerequisites

1. [Vercel account](https://vercel.com) linked to GitHub
2. Vercel CLI: `npm i -g vercel` or use `npx vercel`
3. `vercel login`

## First-time setup

```bash
# From repo root
vercel link          # create or link project "bucks11plus"
```

## Environment variables

Copy from `production/secrets.env` into Vercel → Project → Settings → Environment Variables (Production + Preview).

Required:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon pooler URL |
| `SESSION_SECRET` | Same as current prod — keeps sessions valid |
| `EMAIL_SECRET` | ≥16 chars |
| `BASE_URL` | `https://bucks11plustest.co.uk` (production) |
| `STRIPE_SECRET_KEY` | Live key |
| `RESEND_API_KEY` | Send-only key |
| `RESEND_FROM_EMAIL` | `Bucks 11 Plus Tests <noreply@11plustesthub.co.uk>` |
| `SUPPORT_EMAIL` | `support@11plustesthub.co.uk` |
| `CRON_SECRET` | `openssl rand -hex 32` — secures `/api/cron/*` |
| `NODE_ENV` | `production` |

Optional: `ADMIN_PASSWORD`, `DATABASE_URL_UNPOOLED`

Or push from file (after `vercel link`):

```bash
bash scripts/push-vercel-env.sh production
```

## Deploy

**Git (recommended):** Connect the GitHub repo in Vercel — every push to `main` deploys production.

**CLI:**

```bash
vercel --prod
```

## Custom domain

1. Vercel → Project → Domains → Add `bucks11plustest.co.uk`
2. Update DNS at your registrar per Vercel’s instructions
3. Ensure `BASE_URL=https://bucks11plustest.co.uk` in production env
4. First deploy auto-registers Stripe webhook for that URL

See also `production/DOMAIN-CUTOVER.md`.

## Architecture notes

- `api/index.ts` — Express app (SSR, API, SPA fallback)
- `vercel.json` — crons replace background `setInterval` jobs
- PDF generation (Puppeteer) is **disabled on Vercel** — use Replit or add `@sparticuz/chromium` later if PDFs must run on Vercel

## Verify

```bash
curl https://<your-deployment>.vercel.app/api/health
npm run verify:prod
```

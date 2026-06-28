# Vercel deployment

Replit is **not** required. The app runs entirely on Vercel + Neon + Stripe + Resend.

## Prerequisites

1. [Vercel account](https://vercel.com) linked to GitHub
2. Vercel CLI: `npx vercel`
3. `vercel login`

## Project

- **Name:** `bucks11plus`
- **Production URL:** https://bucks11plus.vercel.app
- **Custom domain:** `bucks11plustest.co.uk` (DNS cutover pending — see below)

## Environment variables

Push from `production/secrets.env` (never commit that file):

```bash
npm run vercel:env
```

**Do not** set `NODE_ENV` or `PORT` on Vercel — that breaks the build (devDependencies skipped during install).

| Variable | Notes |
|----------|--------|
| `NEON_BRANCH` | `main` |
| `DATABASE_URL` | Neon pooler URL |
| `DATABASE_URL_UNPOOLED` | Neon direct URL |
| `SESSION_SECRET` | `openssl rand -hex 32` |
| `EMAIL_SECRET` | `openssl rand -hex 32` |
| `BASE_URL` | `https://bucks11plustest.co.uk` (production) |
| `STRIPE_SECRET_KEY` | Live secret key (checkout is server-side; publishable key optional) |
| `RESEND_API_KEY` | Send-only key |
| `RESEND_FROM_EMAIL` | `Bucks 11 Plus Tests <noreply@11plustesthub.co.uk>` |
| `SUPPORT_EMAIL` | `support@11plustesthub.co.uk` |
| `CRON_SECRET` | `openssl rand -hex 32` — secures `/api/cron/*` |

Optional: `ADMIN_PASSWORD` (first-time admin bootstrap only), `STRIPE_WEBHOOK_SECRET` (auto-registered on boot if omitted).

## Deploy

**Git (recommended):** Push to `main` — Vercel auto-deploys.

**CLI:** `npx vercel deploy --prod --scope jcollinsmclappleid-stars-projects`

## Custom domain (DNS cutover)

Domain `bucks11plustest.co.uk` is added to the Vercel project. At your registrar (currently GoDaddy), either:

**Option A — A record (recommended, keep GoDaddy nameservers):**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Option B — Vercel nameservers:** `ns1.vercel-dns.com`, `ns2.vercel-dns.com`

After DNS propagates, verify:

```bash
curl https://bucks11plustest.co.uk/api/health
```

Stripe webhooks re-register automatically on first boot with `BASE_URL` set.

See `production/DOMAIN-CUTOVER.md` for the full checklist.

## Architecture

- `script/build.ts` — builds client (`dist/public`) and server bundles (`dist/index.cjs`, `dist/vercel-app.cjs`)
- `api/index.ts` — Vercel serverless entry; loads prebuilt `dist/vercel-app.cjs`
- `server/createApp.ts` — Express app (API, SSR, static SPA, crons)
- `vercel.json` — rewrites all routes to `/api`; daily crons replace background intervals
- PDF generation uses `@sparticuz/chromium` + `puppeteer-core` on Vercel (no Replit)

## Verify

```bash
curl https://bucks11plus.vercel.app/api/health   # → {"status":"ok"}
npm run verify:prod
```

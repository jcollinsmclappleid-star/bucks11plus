# Production deployment

## 1. Secrets

Copy and fill in:

```bash
cp production/env.template production/secrets.env
```

`production/secrets.env` is **gitignored**. It already contains your Neon `DATABASE_URL`, `SESSION_SECRET`, and `EMAIL_SECRET` from local dev.

**You must add:**

| Variable | Where to get it |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Secret key (live) |
| `STRIPE_PUBLISHABLE_KEY` | Optional — checkout is server-side; not required |
| `STRIPE_WEBHOOK_SECRET` | Optional — auto-registered on boot when `BASE_URL` is set |
| `RESEND_API_KEY` | [Resend](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Verified domain sender |
| `ADMIN_PASSWORD` | Choose a strong password (only used if admin user doesn't exist) |

On your host, set all variables from `secrets.env` as environment variables, or start with:

```bash
node --env-file=production/secrets.env dist/index.cjs
```

## 2. Database schema

Against production `DATABASE_URL`:

```bash
npm run db:push
```

## 3. Verify questions & tests

Runs repairs + full readiness report:

```bash
npm run verify:prod -- --repair
```

Target: **≥2,000 approved questions**, all 7 diagnostics present, **mini-1 loads 12/12**.

Admin API (after login): `GET /api/admin/production-readiness`

## 4. Stripe setup

1. Add live `STRIPE_SECRET_KEY` to `secrets.env`
2. On first boot with `BASE_URL=https://bucks11plustest.co.uk`, the server auto-creates:
   - Webhook at `/api/stripe/webhook`
   - **Bucks Plus Edge** products (£35/mo, £279/yr) if missing
3. Or manually: `npm run stripe:seed` (requires keys in env)
4. Confirm webhook deliveries in Stripe Dashboard after deploy

## 5. Domain cutover

See **`production/DOMAIN-CUTOVER.md`** for the safe Replit → custom domain checklist.

## 6. Build & deploy

Deploy the **full repo** (not just `dist/`) so `scripts/questions.seed.json` and `scripts/comprehension/` are available for NVR reseeds.

```bash
npm run build
NODE_ENV=production node --env-file=production/secrets.env dist/index.cjs
```

Health: `GET /api/health` → `{ "status": "ok" }`

## 7. Post-deploy smoke test

- [ ] Guest free diagnostic completes (12 questions)
- [ ] PDF download: `/api/practice-paper/download`
- [ ] Stripe checkout `pack_plus` and `pack_annual`
- [ ] Webhook upgrades user tier (check Stripe → Webhooks → recent deliveries)
- [ ] Email sends (diagnostic complete or contact form)
- [ ] Paid user can start full diagnostic / mock / practice paper

## 8. Security

- Rotate `ADMIN_PASSWORD` after first login if admin was auto-created
- Never commit `production/secrets.env`
- Consider rotating DB password if credentials were shared

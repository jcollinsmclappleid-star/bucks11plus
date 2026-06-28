# Domain cutover: Replit → bucks11plustest.co.uk

Use this checklist when pointing **bucks11plustest.co.uk** at the new host. Do not change DNS until every pre-cutover step passes.

## Before you touch DNS

1. **Deploy the app** on the target host (Replit with custom domain, VPS, etc.) using the **latest `main` commit**.
2. **Set environment variables** from `production/secrets.env` on the host (never commit that file):
   - `DATABASE_URL`, `SESSION_SECRET`, `EMAIL_SECRET` — keep the same values as today so existing logins and tokens keep working
   - `BASE_URL=https://bucks11plustest.co.uk`
   - `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`
   - `NODE_ENV=production`, `PORT` (host default)
3. **Run on the host** (or against production DB before cutover):
   ```bash
   npm run db:push
   npm run verify:prod
   ```
4. **Smoke-test on the host's temporary URL** (Replit `*.replit.app` or preview URL):
   - `GET /api/health` → `{ "status": "ok" }`
   - Guest diagnostic completes (12 questions)
   - Contact form delivers to `support@11plustesthub.co.uk`
   - Checkout opens Stripe (test with a real card only if you intend to charge)
5. **Resend**: confirm `noreply@11plustesthub.co.uk` and domain are verified in Resend.

## DNS cutover (low-risk order)

1. **Lower TTL** on the domain to 300s (5 min) at least 24h before cutover if your registrar allows it.
2. **Add the new host record** without removing the old one yet:
   - **A record** or **CNAME** as your new host instructs (Replit: CNAME to their target; VPS: A to server IP).
3. **Wait for propagation** — check with `dig bucks11plustest.co.uk` or an online DNS checker.
4. **Verify HTTPS** on `https://bucks11plustest.co.uk` (certificate must be active before sending traffic).
5. **First boot on production URL** — the server will:
   - Register Stripe webhook at `https://bucks11plustest.co.uk/api/stripe/webhook`
   - Sync Stripe products (£35/mo, £279/yr) if missing
6. **Post-cutover smoke test** (on live domain):
   - [ ] Home, pricing, free diagnostic, contact form
   - [ ] PDF / practice-paper email download
   - [ ] Stripe checkout → webhook → account tier upgraded
   - [ ] Email from `noreply@11plustesthub.co.uk` received
7. **Remove old Replit DNS** only after 24–48h of stable traffic on the new host.

## Stripe after cutover

- Webhook is **auto-created** on boot via `stripe-replit-sync` when `BASE_URL` is set.
- You do **not** need `STRIPE_PUBLISHABLE_KEY` (checkout is server-side).
- In Stripe Dashboard → Webhooks, confirm deliveries to `https://bucks11plustest.co.uk/api/stripe/webhook` succeed.
- Optional: disable or delete the old Replit webhook URL (`*.replit.app/api/stripe/webhook`) once cutover is stable.

## Rollback

If something breaks after DNS change:

1. Point DNS back to the previous Replit target.
2. Wait for TTL to expire (5–30 min with low TTL).
3. Fix the new host offline; do not cut over again until `verify:prod` and smoke tests pass on the preview URL.

## Do not change

- **URL paths** — SEO pages keep the same slugs.
- **`SESSION_SECRET`** during cutover — changing it logs everyone out.
- **`DATABASE_URL`** — production DB is already Neon; same URL on old and new host.

# Data Protection Impact Assessment (DPIA)

**Service:** Bucks 11 Plus Tests (`bucks11plustest.co.uk`)
**Operator (Data Controller):** Ianson Systems Limited (England & Wales)
**DPO / Privacy Lead:** [Founder name] — `support@11plustesthub.co.uk`
**Document version:** 1.0
**Date completed:** 2 May 2026
**Next review:** May 2027 or on material change to data flows

---

## Part A — Non-technical summary

> *This section is written for a reader who is not a developer or privacy lawyer. It explains what the service does, what personal data it touches, and what we have done to keep that data safe.*

### What is the service?

Bucks 11 Plus Tests is a website that helps parents in Buckinghamshire prepare their child for the secondary-transfer test (the "11+"). Parents create an account, optionally subscribe, and use the site to give their child practice questions, see how their child is doing, and get readiness predictions.

### Who uses it?

- **Parents and guardians** — the account holder. Must be 18 or over.
- **Children** — only ever via their parent's account; we do not provide accounts directly to children. The parent enters the child's first name, year group and (optionally) age, and the child completes practice tests inside the parent's account.

### What personal data do we collect?

Only what we need:

- The parent's email address (used as the username) and a hashed password.
- The child's first name, year group, and age (optional).
- The child's answers to practice questions and their resulting scores.
- Email send/open/click logs so we don't pester the same family twice.
- Payment records — held by **Stripe**, not by us. We never see card numbers.

We do not collect addresses, surnames, photos, school names, location data, contact details for children, or any data we could sell or use for advertising.

### Why is a DPIA needed?

The Information Commissioner's Office (ICO) requires a DPIA whenever processing is "likely to result in high risk to individuals." Two factors make this DPIA appropriate even though the service is small:

1. **Children's data is processed.** Anything involving children needs extra care, even when collected via a parent.
2. **Educational performance data could in principle be misused** to embarrass a child or be combined with other data sources.

We have therefore worked through the risks even though we believe each individual risk is low.

### What are the main risks, and what have we done about them?

| Risk | What we have done |
|---|---|
| Someone steals a parent's password and gets in | Strong password hashing (scrypt with random salt, timing-safe compare); password strength rules; rate limit on login attempts per IP and per account; 30-day cookie that becomes invalid on logout. |
| Someone signs up using an email that isn't theirs | Email verification on sign-up — a reminder banner stays visible until the address is confirmed. |
| Children's data is held longer than necessary | Automated deletion 24 months after the last sign-in, with a 30-day warning email so parents can keep the account if they want. |
| A parent wants to leave and take their data | Self-serve "Download my data" button (JSON export of everything we hold) and self-serve "Delete my account" button — both work without contacting us. |
| A parent's data is shown to advertisers | Google Ads/Analytics only loads if the parent accepts the cookie banner. Children's data is never shared with anyone for any purpose other than running the service. |
| A breach occurs | Documented one-page breach response plan (see `breach-playbook.md`), template notifications, designated decision-maker. |

### Residual risk

After the controls above, the residual risk to the rights and freedoms of users is judged **low**. The most likely realistic incident is "an individual parent's password is reused from a leaked third-party site" — which is mitigated by per-account login throttle, and which would impact only that one family, not the broader user base.

### Will we consult the ICO?

No prior consultation under Article 36 is required because the residual risk is low.

---

## Part B — Technical detail

### B.1 Description of processing

| | |
|---|---|
| Nature | A SaaS website that lets parents administer educational practice tests to their child and receive automated readiness analytics. |
| Scope | UK-only marketing focus (Buckinghamshire). Service is technically accessible from anywhere but designed for UK families. |
| Context | Direct-to-consumer. Account holders must be 18+ and confirm they are the parent/legal guardian when creating a child profile. |
| Purposes | (a) Provide the contracted educational service. (b) Necessary transactional communication. (c) Optional service emails (with consent). (d) Analytics and advertising performance measurement (with consent). |

### B.2 Lawful basis (UK GDPR Article 6 / Article 9)

| Processing | Lawful basis | Notes |
|---|---|---|
| Account creation, authentication, delivery of practice tests, score reporting | **Article 6(1)(b)** — performance of a contract | The user enters into a contract by creating an account and agreeing to the Terms of Service. |
| Child data — as above | **Article 6(1)(b)** + **Article 8** parental consent | Parent confirms parental responsibility at child-profile creation; service is mediated entirely through the parent. No special-category data (Art. 9) is processed. |
| Transactional emails (password reset, account confirmations, payment receipts, retention warnings) | **Article 6(1)(b)** | Necessary for the contract; sent regardless of marketing preferences. |
| Service emails (results summaries, practice nudges, upgrade suggestions) | **Article 6(1)(a)** — consent | Opt-in at sign-up and via Account Settings; one-click unsubscribe in every message. |
| Cookies for Google Ads / Analytics | **PECR reg. 6 + UK GDPR Art. 6(1)(a)** — consent | Cookie banner; gtag.js is gated and never loads before consent. |
| Strictly necessary cookies (session, CSRF, cookie-consent state) | **PECR reg. 6(4)** — strictly-necessary exemption | No consent required. |
| Email delivery logs | **Article 6(1)(f)** — legitimate interests | Used only to debug deliverability and avoid duplicate sends. Auto-pruned at 12 months. |
| Stripe payment data | Stripe is a separate Article 28 processor; we do not handle card data. Stripe's Article 6 basis is contract. |

### B.3 Data inventory

| Data item | Source | Stored where | Retention |
|---|---|---|---|
| Email address (used as username) | Parent input | Postgres `users.username` / `users.email` | Until account deletion or 24-month dormancy |
| Password (hash) | Parent input → scrypt hashed | Postgres `users.password` | As above |
| `email_verified` flag | System-set on email link click | Postgres `users.email_verified` | As above |
| Marketing email consent + unsubscribe timestamp | Parent input | Postgres `users.email_consent`, `email_unsubscribed_at` | As above |
| Child first name, year group, age | Parent input | Postgres `child_profiles` | Until account / child profile deletion |
| Test session metadata (start/end, mode) | System | Postgres `test_sessions` | As above |
| Test answers and per-item correctness | Child input via parent's account | Postgres `test_answers` | As above |
| Forecast scores, readiness band | Computed | Postgres `test_sessions.forecast_score` etc | As above |
| Email send / status / type log | Email pipeline | Postgres `email_events` | **Hard cap: 12 months**, then auto-pruned |
| Stripe customer ID, subscription tier, expiry | Stripe webhooks | Postgres `users.stripe_customer_id` etc; canonical record in Stripe | While account exists; Stripe holds tax records ≥ 6 yrs (HMRC) |
| Session cookie | System | Browser + Postgres `session` table | 30 days max age, cleared on logout |
| Server logs | System | Replit infrastructure / stdout | Email addresses are **masked** (`a***@example.com`) before logging. Application-level logs ephemeral. |
| Postgres backups (point-in-time) | Replit | Replit infrastructure, encrypted | Rolling window (≤ 30 days), then overwritten |

### B.4 Data flows

```
Parent / Child
     │
     ▼  HTTPS (TLS 1.2+, HSTS in prod, helmet headers)
[Replit-hosted Express server]
     │       │             │
     ▼       ▼             ▼
 Postgres   Stripe API   Resend API
 (Replit)   (payments)   (email)
                          │
                          ▼
                 Recipient inbox
```

External processors (Article 28):
- **Stripe Payments Europe Ltd** — payment processing, invoicing, tax records.
- **Resend Inc.** — transactional and service email delivery.
- **Replit Inc.** — application hosting, database hosting, backups.
- **Google LLC (Ads / Analytics)** — only when consent given.

A DPA is in place (or accepted via standard terms) with each processor. None of these are joint controllers.

### B.5 Identified risks and mitigations

| ID | Risk | Likelihood | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| R1 | Account takeover via credential stuffing or weak password | Medium | Medium (loss of child performance data, potential harassment) | scrypt password hashing; password strength rules (8+ chars, letter + number); IP rate limit (10 / 15 min); per-account throttle (5 wrong = 15-min lock); soft-block email verification banner; 1-hour password reset token TTL; password reset emails sent regardless of marketing prefs. | Low |
| R2 | Sign-up using someone else's email (squatting) | Medium | Low–Medium | Email verification on sign-up; clear support route to reclaim address. | Low |
| R3 | Excess retention of inactive child data | Medium | Medium | Automated 24-month dormancy deletion; 30-day pre-deletion warning email; cascade across 11 child tables; Stripe-state safeguard prevents deletion of paying accounts. | Low |
| R4 | Inability to fulfil DSAR within 30 days | Low | Medium | Self-serve `/api/user/export` (JSON of all data); self-serve account deletion; documented manual fallback in breach playbook. | Low |
| R5 | Personal data leaked via server logs | Medium | Low | All logged email addresses pass through `maskEmail()`; third-party error bodies (e.g. Resend) sanitised via `redactEmailsInText()`; no console.log of raw user objects. | Low |
| R6 | Unauthorised access by Replit infrastructure staff | Low | High | Replit's own SOC 2 controls; database credentials via env vars only; no admin secrets in code. | Low |
| R7 | Cookie-based tracking before consent | Low | Medium | gtag.js is conditionally loaded only after a "Accept all" choice in the cookie banner; consent state in localStorage; cookie banner shown on first visit and via footer link. | Low |
| R8 | Children's data used for advertising / profiling | Negligible | High | Privacy policy explicitly forbids; no integration with ad/profiling vendors that touches child rows; analytics events do not include child names or scores. | Negligible |
| R9 | Breach detection failure / late ICO notification | Medium | High | One-page breach playbook (`docs/breach-playbook.md`); founder is named decision-maker; pre-drafted ICO and user-notification templates; quarterly drill against the playbook. | Low |
| R10 | XSS injecting third-party scripts | Low | Medium | React's automatic escaping; helmet security headers. **Planned enhancement: Content Security Policy** (currently disabled because of Stripe Checkout / Replit dev complexity). | Low–Medium (tracked) |
| R11 | Ransom / mass deletion via stolen admin credentials | Low | High | Admin status flag-gated server-side (`isAdmin: true`); session-bound; no public admin sign-up; only one admin currently. **Planned enhancement: admin audit log** (deferred until 2nd admin onboarded). | Low |
| R12 | Data persistence in backups after erasure | Certain | Low | Rolling backup window ≤ 30 days; backups never restored to repopulate live data; ICO accepts this as compatible with Art. 17 erasure. Disclosed in privacy policy §8. | Negligible |

### B.6 Necessity and proportionality

- Every personal-data field collected has a stated purpose tied to delivering the educational service or the contract.
- We do **not** collect: address, postcode, phone number, surname, school, location data, third-party identifiers (e.g. Facebook ID), payment card details (held by Stripe), or any special-category data under Art. 9.
- Children's data is the minimum needed to score and personalise practice (first name + year group + answers + scores). No surname, date of birth, school, or photo.
- Marketing emails are opt-in not opt-out (PECR-aligned).
- Cookies for analytics/advertising are opt-in not opt-out.

### B.7 Security controls (technical)

| Layer | Control |
|---|---|
| Transport | HTTPS enforced; TLS terminated at Replit edge; HSTS in production. |
| HTTP | helmet (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, COOP, CORP). |
| Authentication | Passport local strategy; scrypt password hashing with random salt and timing-safe compare; password strength enforcement; IP and per-account throttle; soft-block email verification. |
| Sessions | `express-session` over PG store; 30-day max age; `httpOnly`; `secure` in production; `sameSite=lax`; SESSION_SECRET required at boot. |
| Authorisation | `requireAuth` middleware; admin actions gated by `isAdmin` flag server-side; subscription tier checked server-side (cannot be elevated by client manipulation). |
| Input | Zod schemas on incoming bodies; Drizzle ORM parameterised queries (no raw SQL string concatenation); `inArray` for ID lists. |
| Logs | Email addresses masked via `maskEmail()`; third-party response bodies sanitised via `redactEmailsInText()`. |
| Email | Tokens for unsubscribe and verification are HMAC-SHA256 derived from `EMAIL_SECRET + userId`, no per-token DB row required; password-reset tokens stored with 1-hour TTL. |
| Backups | Replit-managed point-in-time, encrypted, ≤ 30-day rolling window, never restored to repopulate erased data. |
| Secrets | Stored as Replit environment secrets (`SESSION_SECRET`, `EMAIL_SECRET`, `RESEND_API_KEY`, `STRIPE_*`, `DATABASE_URL`); never logged. |

Planned enhancements (tracked, not blocking sign-off):

- Content Security Policy (currently disabled in helmet) — needs Stripe Checkout / Replit dev allowlist work before enabling.
- Admin audit log — to be added before a second admin is granted access.

### B.8 Data subject rights

| Right | How fulfilled | SLA |
|---|---|---|
| Access | Self-serve "Download my data" → JSON export of users, child profiles, sessions, answers, email history. | Immediate |
| Rectification | Self-serve via Account Settings; manual via email for fields not in the UI. | Within 30 days |
| Erasure | Self-serve "Delete account" → cascades through 11 tables; cancels Stripe subscription. | Immediate (live system) / ≤ 30 days (backups overwritten) |
| Restrict processing | Manual via support email. | Within 30 days |
| Data portability | Same JSON export as for access. | Immediate |
| Object | Manual via support email. | Within 30 days |
| Withdraw consent | Self-serve email-comms toggle; cookie banner reachable via footer; one-click unsubscribe in every marketing email. | Immediate |
| Complaint to ICO | Privacy policy §13 names the ICO and signposts ico.org.uk/concerns. | n/a |

### B.9 Consultation

- **Internal**: founder/operator and engineering function (same individual at this stage of the business). Documented review with each material change.
- **External**: not yet consulted external counsel; will engage if (a) we expand processing categories materially, (b) we onboard a school/B2B customer with a DPA negotiation, or (c) the ICO invites consultation following an incident.
- **Data subjects**: privacy policy is publicly available and prominently linked; cookie banner solicits explicit consent on first visit. No formal consultation panel is appropriate at this scale.

### B.10 Sign-off

| | |
|---|---|
| Reviewed by (operator/DPO) | _________________________ |
| Date | _________________________ |
| Decision | ☐ Approved as-is ☐ Approved with conditions (list) ☐ Process not to proceed |
| Conditions / next review trigger | _________________________ |

---

*End of DPIA v1.0.*

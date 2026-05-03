# Data Protection Impact Assessment (DPIA)

**Service:** Bucks 11 Plus Tests (https://bucks11plustest.co.uk)
**Data Controller:** Ianson Systems Limited (Company no. 17084981, ICO ZC127831)
**Registered office:** 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
**Document version:** 1.0
**Date adopted:** May 2026
**Next review:** May 2027 (annual) or sooner on material change

---

## 1. Why a DPIA is needed

The Service processes personal data of children (typically aged 9–11) preparing for the Buckinghamshire 11+ Secondary Transfer Test. Although the data set is small and the processing is low-risk, two factors trigger the recommendation for a DPIA under UK GDPR Art. 35 and the ICO Children's Code:

- The data subjects are children, who are recognised as needing additional protection.
- The Service produces a "readiness banding" output derived from the child's answers, which is a form of automated profiling (albeit with no legal effect or significant impact on the child).

This DPIA documents the necessity, proportionality and risk-mitigation steps so that the processing can be defended on inspection.

## 2. Description of the processing

### 2.1 Nature

| Stage | What happens | Data involved |
|---|---|---|
| Account creation | Parent creates an account, confirms aged 18+ and parental responsibility, sets a password. | Parent email, hashed password, timestamp, parent confirmation flag. |
| Child profile | Parent enters the child's year group (4, 5 or 6). Optionally a first name (stored device-only in browser localStorage). | Year group on server. First name never leaves the device. |
| Diagnostic / practice | Child answers multiple-choice questions in a timed session. | Per-question answer, correctness flag, response time, section scores. |
| Readiness banding | Server calculates an indicative score against the 121 qualifying standard and assigns a band (Red / Amber / Green). | Aggregated session metrics; band stored against the parent account. |
| Reporting | Parent views dashboards, downloads reports, manages billing. | All of the above; Stripe customer ID for billing. |
| Email | Transactional and (opt-in) service emails delivered via Resend. | Parent email, email type, delivery status timestamps. |

### 2.2 Scope

- **Data subjects:** parents/legal guardians (account holders) and the children whose performance is recorded against those accounts.
- **Geographic scope:** primarily Buckinghamshire, UK.
- **Volume:** projected to be in the low thousands of households per cycle. Not "large-scale" processing in the GDPR Art. 35(3)(b) sense.
- **Special category data:** none collected.
- **Children's data:** yes — year group, answers, derived readiness band.

### 2.3 Context

Processing is initiated and controlled by the parent, who is the contracting party. Children only ever interact with the Service via the parent's account and device, with the parent's knowledge.

### 2.4 Purposes

1. To deliver an indicative 11+ readiness assessment that the parent can use to direct preparation effort.
2. To track progress over time across multiple practice sessions.
3. To process billing for paid plans.
4. To send transactional and (opt-in) service emails.

## 3. Lawful basis (UK GDPR Art. 6) and Children's Code Art. 8

| Processing | Lawful basis | Notes |
|---|---|---|
| Account, billing, delivery of paid features | **Contract** (Art. 6(1)(b)) — between Ianson Systems Limited and the parent. | Parent is 18+ and self-contracts. |
| Child year group + assessment data | **Contract** with parent + parental consent under **Art. 8 UK GDPR** confirmed at sign-up. | Parent confirms parental responsibility via tickbox. |
| Service improvement / fraud prevention | **Legitimate interests** (Art. 6(1)(f)). | Aggregate metrics only; no profiling for marketing. |
| Cookies (analytics / advertising) | **Consent** (PECR reg. 6 + UK GDPR Art. 6(1)(a)). | Captured via cookie banner; rejected by default. |
| Service emails | **Consent**, opt-in only. | Withdrawable at any time. |
| Transactional emails | **Contract**. | Required for service operation. |
| Legal records (tax, audit) | **Legal obligation** (Art. 6(1)(c)). | Held by Stripe under HMRC rules. |

## 4. Necessity and proportionality

- **Year group only** is collected at the child level, not date of birth or school name. This is the minimum needed to scope question difficulty.
- **First name** is *optional* and *device-only* — never reaches the server.
- **No** third-party advertising data, behavioural profiling, geolocation, contact list import, photographs, voice recordings or biometric data is collected from the child.
- The readiness banding produces an *indicative* output to help the parent direct effort. It is not used to make decisions about the child by anyone other than the parent, has no legal or significant effect on the child, and is openly explained on the platform.
- Retention is bounded: 24 months of inactivity triggers automated account deletion, with a 30-day pre-deletion warning email.

## 5. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorised access to a child's results | Low | Low–Medium | scrypt password hashing, secure session cookies, Helmet headers, rate-limited auth endpoints, TLS in transit, role-based admin access. |
| Child accessing the platform unsupervised and seeing inappropriate marketing | Low | Low | No third-party advertising on the Service. Cookie banner blocks Google Ads/Analytics until parent accepts. |
| Re-identification of a child via combined data | Very low | Low | No name, school, postcode, DOB or biometric data collected. Year group + answers are not identifying in isolation. |
| Profiling band being misinterpreted as an official score | Medium | Low | Explicit disclaimer on every readiness output; Terms §2 explains the difference from the official GL Assessment age-standardised score. |
| Excessive retention | Low | Low | Automated 24-month inactivity purge; immediate deletion on user request via Account Settings. |
| Processor failure (Stripe / Resend / Replit / Google) | Low | Medium | All on UK-adequate or IDTA/UK Addendum safeguards; documented in Privacy Policy §11. |
| Loss of data via backup | Low | Low | Encrypted point-in-time backups, max 30-day rolling window, never used to repopulate deleted user data into live systems. |
| Marketing creep into child data | Low | Medium | Hard policy: child data is never used for marketing, advertising or profiling for advertising. Documented in Privacy Policy §5. |
| Data subject rights request not actioned | Low | Medium | Self-serve "Download my data" + "Delete account" in Account Settings; 30-day SLA on emailed requests. |

## 6. ICO Children's Code — alignment summary

| Standard | How we align |
|---|---|
| 1. Best interests of the child | Service exists to give parents a clearer view of where to focus prep — directly serves the child's educational interest. No advertising-based business model. |
| 2. DPIAs | This document. |
| 3. Age-appropriate application | Single age band (Year 4–6); content is age-tested. No features assume an older audience. |
| 4. Transparency | Plain-language Privacy Policy, Safeguarding Policy and on-screen explanation of the readiness band. |
| 5. Detrimental use of data | Child data is never used for advertising, sold, shared with third parties for their own purposes, or used for behavioural profiling. |
| 6. Policies and community standards | Terms of Service, Privacy Policy, Safeguarding Policy, Refund Policy all published and dated. |
| 7. Default settings | Highest privacy by default. Cookies rejected by default. Service emails require opt-in. Child first name device-only by default. |
| 8. Data minimisation | Only year group + answers + (optionally, on-device) first name collected for the child. |
| 9. Data sharing | Disclosed processors only (Stripe, Resend, Replit, Google when consented). No data sold or shared for third-party marketing. |
| 10. Geolocation | Not collected. |
| 11. Parental controls | Parent holds the account; child cannot independently sign up, change settings, or invite anyone. |
| 12. Profiling | Readiness band is the only profiling. It has no legal or significant effect on the child, is disclosed openly, and is not used to push the child toward harmful content. |
| 13. Nudge techniques | No dark patterns; cookie banner offers equal-weight Accept/Reject. |
| 14. Connected toys/devices | N/A — web service only. |
| 15. Online tools | Self-serve data export and deletion in Account Settings. |

## 7. Outcome

The processing is **proportionate and necessary** for the stated purposes, with risks addressed by the mitigations above. No high residual risk has been identified that would require prior consultation with the ICO under Art. 36.

This DPIA should be revisited if any of the following change:

- A new category of personal data is collected from the child.
- A new third-party processor is added.
- A feature is introduced that allows child–child or child–adult contact.
- A new automated decision-making feature is added.
- The legal entity changes.

## 8. Sign-off

**Adopted by:** Director, Ianson Systems Limited
**Date:** May 2026

---

*This DPIA is an internal document. It is not user-facing, but is available to the Information Commissioner's Office on request.*

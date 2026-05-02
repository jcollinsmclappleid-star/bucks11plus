# Personal Data Breach Response Playbook

**Service:** Bucks 11 Plus Tests (`bucks11plustest.co.uk`)
**Operator:** Ianson Systems Limited
**Designated decision-maker:** [Founder name] — `support@11plustesthub.co.uk`
**Statutory clock starts:** the moment the decision-maker becomes "aware" that a personal data breach has occurred.
**Document version:** 1.0 · **Last reviewed:** May 2026

> Under UK GDPR Art. 33, **personal data breaches that risk people's rights and freedoms must be reported to the ICO within 72 hours of awareness.** Under Art. 34, breaches that pose **high risk** must also be communicated to affected users without undue delay.

---

## 0. Breach trigger sources

A breach may be detected by any of:

- Customer report (`support@11plustesthub.co.uk` or chat).
- Replit infrastructure alert (downtime, DB anomaly, suspicious access).
- Stripe alert (suspicious payment activity, account compromise notice).
- Resend alert (sender reputation issue, unusual send volume).
- Routine log review (failed login spikes, unexpected admin actions, unexpected DB exports).
- Founder's own discovery (e.g. accidental leak in a public commit, lost laptop, exposed env file).

If in doubt — treat as a breach and triage. **Do not wait for certainty before starting the clock.**

---

## 1. Triage — within 4 hours of awareness

Answer in writing (in `incident-log.md` for the date):

1. **What data is involved?** (e.g. email addresses, password hashes, child names + scores, payment metadata, none.)
2. **How many data subjects are affected?** Estimate; refine later.
3. **Are children's records involved?** Yes/No. (Raises severity.)
4. **Is the leak still ongoing?** Yes/No. If yes — **stop it first** (rotate keys, revoke sessions, take service offline, take the database read-only — whichever applies).
5. **What's the cause?** (Confirmed / suspected / unknown.)
6. **What's the worst plausible consequence to a person?** (Identity theft? Embarrassment? Targeted harassment? None?)

Containment actions (do whichever apply, immediately):

- ☐ Rotate `SESSION_SECRET` (forces all logins out).
- ☐ Rotate `EMAIL_SECRET` (invalidates all unsubscribe / verify links — accept this).
- ☐ Rotate `STRIPE_*` keys (in Stripe dashboard).
- ☐ Rotate `RESEND_API_KEY`.
- ☐ Rotate `DATABASE_URL` credentials (Replit DB).
- ☐ Revoke compromised admin account; create fresh credentials.
- ☐ Take service offline if a confidentiality leak is still bleeding.
- ☐ Pull a forensic copy of relevant logs **before** they rotate out (Replit log retention is finite).

---

## 2. Decide: notify the ICO?

Use the ICO's self-assessment: <https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach-assessment/>

Heuristic shortcut for this service:

| Scenario | Notify ICO? |
|---|---|
| Password hashes exposed (scrypt, salted) — no plaintexts | Likely yes (Art. 33), but residual risk to subjects is low. |
| Plaintext passwords exposed | **Yes — and notify users (Art. 34) as well.** |
| Email addresses + child first names exposed | **Yes — children's data raises the bar.** |
| Email addresses only, no names | Probably yes — assess context. |
| Stripe customer IDs only, no PII attached | Usually no, but document the assessment. |
| Internal-only metric leaked, no PII | No. Document and move on. |
| Service unavailable but no confidentiality breach | No (availability alone usually doesn't trigger Art. 33 unless it's prolonged and material). |

If in doubt — **notify**. Notifying late is materially worse than notifying when it wasn't strictly required.

**Filing route:** ICO's online breach-reporting form, <https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/>.

---

## 3. ICO notification template (≤ 72 hrs)

Use the ICO online form. Have the following pre-drafted text ready to paste into the free-text fields. Update `[bracketed]` items with current incident facts.

```
We are reporting a personal data breach affecting users of bucks11plustest.co.uk,
operated by Ianson Systems Limited.

Date of awareness: [YYYY-MM-DD HH:MM UTC]
Date breach is believed to have started: [YYYY-MM-DD or "unknown"]

Categories of data subject affected:
- [parents / children / both]
- Approximate number affected: [N or range]

Categories of personal data affected:
- [e.g. email addresses, password hashes, child first names, year groups,
   test answers and scores, marketing-email consent state]
- Categories NOT affected: [e.g. payment card details (held by Stripe),
   addresses, surnames, photos]

Cause: [confirmed / suspected / under investigation]
Description: [one paragraph; what happened, what we believe is the root cause]

Containment actions taken: [rotated session/email/Stripe/Resend keys; revoked
admin sessions; taken affected component offline; engaged Replit support; etc.]

Likely consequences for data subjects:
[e.g. potential for credential-stuffing attacks elsewhere if password hashes
 were exposed; potential for misdirected outreach; embarrassment if child
 score data is correlated with other identifiers; we judge the residual risk
 to be LOW/MEDIUM/HIGH because ...]

Action being taken to mitigate risk to data subjects:
[e.g. forced password reset for affected users; email notification with
 advice; offer of one-off support contact; published incident statement.]

We will notify affected users by email [today/within 24h/within 72h] using
the template held in our incident playbook (Article 34).
A post-incident review will be completed by [date] and is appended to our
internal incident log.

Contact for ICO follow-up: [Founder name], support@11plustesthub.co.uk
```

---

## 4. Decide: notify users?

Notify under Art. 34 if the breach is **likely to result in high risk** to the rights and freedoms of users. Examples:

- Plaintext passwords or password reset tokens leaked.
- Children's identifying data leaked in a way that could be combined with other sources.
- Payment data leaked (extremely unlikely — Stripe holds it).

Encryption / hashing **may exempt** you from user notification if the data was rendered unintelligible — document the rationale either way.

---

## 5. User notification template (Art. 34)

Subject: **Important security notice about your Bucks 11 Plus Tests account**

```
Dear parent,

We are writing to let you know about a security incident affecting
your Bucks 11 Plus Tests account.

What happened:
On [date] we became aware that [brief, factual, one or two sentences].

What information was involved:
[bullet list — be specific. E.g. "Your email address and the password
hash for your account. Importantly, your password itself was not stored
in plain text — it was protected by an industry-standard hashing algorithm
called scrypt, which makes it computationally expensive for an attacker
to recover the original password. However, as a precaution we recommend
you change your password if you reuse it on any other site."]

What information was NOT involved:
[bullet list — be specific. E.g. payment card details, addresses,
your child's score history, etc.]

What we have done:
- [Forced password reset / rotated session keys / etc.]
- We have reported the incident to the Information Commissioner's Office.

What we recommend you do:
- [Specific, actionable steps. Usually: change your password; if you
  reused it elsewhere, change it there too; be alert for unexpected
  emails referencing your child's name or our service.]

We are sorry this happened. If you have any questions, please reply
to this email or contact us at support@11plustesthub.co.uk.

You also have the right to complain to the Information Commissioner's
Office (ico.org.uk/concerns).

Sincerely,
[Founder name]
Ianson Systems Limited
```

---

## 6. Post-incident review — within 14 days

Append to `docs/incidents/YYYY-MM-DD-<slug>.md`:

1. **Timeline:** awareness → containment → notification → resolution, with timestamps.
2. **Root cause:** what failed (technical, process, human)?
3. **What worked:** controls that detected / contained the incident.
4. **What didn't:** controls that should have worked but didn't, or were missing.
5. **Action items:** concrete, dated, owner-assigned. Examples:
   - "Add log alert for >50 failed logins in 5 min for any single account."
   - "Rotate `EMAIL_SECRET` quarterly via calendar reminder."
   - "Add CSP to helmet config."
6. **DPIA implication:** does this incident change any risk rating in `dpia.md`? If yes, update and re-sign.

Keep this file. The ICO may request your incident log if there is ever an audit or follow-up complaint — and a documented response with concrete, completed action items is the single best evidence that you take data protection seriously.

---

## 7. Quarterly drill

Once per quarter, the operator runs a 30-minute tabletop drill against this playbook using a hypothetical scenario (e.g. "a contributor pushes a `.env` file to a public repo"). Confirm:

- All keys can still be rotated in under 15 minutes.
- All notification templates still match current data flows.
- Contact details for ICO and processor support are still correct.
- The current data inventory in `dpia.md` matches what is actually stored.

Record the date and outcome of each drill in the incident log.

---

*End of breach playbook v1.0.*

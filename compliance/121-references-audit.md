# 121 References — Misleading-Claim Audit

**Date:** 2026-05-03
**Scope:** Every place on bucks11plustest.co.uk that mentions the 121 standardised score, with focus on whether parents could reasonably be misled into believing our internally-generated readiness number is the same as GL Assessment's official standardised score.

## Standing principle

We do **not** measure children against GL Assessment's official 121 standardised score. We cannot — GL does not publish the raw-to-standardised conversion tables used for the actual Secondary Transfer Test. What we publish is an **Indicative Readiness Score** calibrated against the 121 *preparation benchmark* using GL-style question types and difficulty weightings. Anywhere we display a number the parent might mistake for an official GL score, we must say so plainly and visibly — once at the point of display, not buried in small print.

## Gold-standard wording (re-use everywhere)

Two existing files set the bar — every other surface should match them.

**Inline-with-the-number caveat** (from `client/src/pages/ResultsReport.tsx:211`):
> Indicative readiness estimate only. Not an official GL Assessment score. 121 is used as a preparation benchmark — achieving it here does not indicate a child will pass the official Secondary Transfer Test.

**Methodology framing** (from `client/src/pages/ScoringMethodology.tsx:65`):
> Independent benchmark, not an official GL Assessment. Our scoring model is calibrated against the Buckinghamshire 11+ qualifying threshold of 121 using GL-style question types and difficulty weightings. It is designed to give parents a directional readiness signal — not a prediction of your child's official GL Assessment score. GL Assessment uses proprietary age-standardised scoring tables not available to independent providers.

**Recommendation:** extract these into a single shared component `<IndicativeScoreCaveat variant="inline" | "block" />` and render it next to every visible score number. DRY + auditable + consistent.

---

## HIGH-RISK surfaces — fix before next deploy

### 1. `client/src/pages/Results.tsx` (logged-in score gauge)
- Shows `forecastScore` on a circular gauge with a 121 marker line at the same scale position.
- **Grep confirms zero "indicative", "not official", "not a substitute" disclaimer text anywhere in this file.**
- A logged-in parent sees a number on a gauge with a 121 line and no qualifier. This is the single most misleading visual on the site.
- **Fix:** insert `<IndicativeScoreCaveat variant="inline" />` directly under the gauge before any "Gap to 121" copy. Replace label "forecast score" with "Indicative Readiness Score". Link to `/scoring-methodology`.

### 2. `client/src/pages/GuestResults.tsx`
- Same gauge pattern with 121 marker.
- Has the phrase "raising the overall indicative readiness score above the 121 qualifying standard" (line 367) — the word "above" implies our number lives on the same scale as GL's 121.
- Disclaimer at line 501 is `text-xs text-slate-400` — barely legible footer copy.
- **Fix:** elevate the disclaimer to a visible callout immediately under the gauge (use the same component as fix #1). Reword the "above" lines to "lifting the indicative readiness score past the 121 preparation benchmark we calibrate to".

### 3. `client/src/pages/Dashboard.tsx`
- Line 97: "Forecast calibrated against the 121+ Buckinghamshire qualifying benchmark." — directionally correct but the next-line gauge has no disclaimer.
- Line 168: "Indicative gap to 121 standard" — fine.
- **Fix:** add the inline caveat next to the gauge. Same component as fixes #1–#2.

### 4. `client/src/components/shared/DashboardPreview.tsx` (marketing mockup)
- Hard-coded score of 118 labelled "**Est. Score**" with a "Gap to 121 Standard" bar.
- "Est. Score" reads as "Estimated Standardised Score" — strongly implies equivalence to the official scale.
- **Fix:** rename "Est. Score" → "Indicative Readiness". Add a small "preview only — illustrative numbers" footnote inside the component. Add an inline caveat link to `/scoring-methodology`.

### 5. `client/src/pages/Landing.tsx` — `ForecastPanel` (lines 11–35) and the chart at line 222
- Hard-coded "**114** estimated score" with "**121 Target**" bar — same problem as #4.
- "estimated score" framing risks being read as an estimate of the official GL score.
- **Fix:** rename "estimated score" → "indicative readiness". Change "121 Target" → "121 preparation benchmark". Add a single-line footnote inside the panel: "Indicative readiness, not GL Assessment's official score — see methodology."

### 6. `client/src/pages/FreeDiagnosticStart.tsx`
- Line 69 (meta description): "see where your child stands against the **Bucks 121 benchmark**."
- Line 128–129: "**Forecast vs 121** — Age-adjusted score against the Bucks qualifying threshold."
- The phrase **"Age-adjusted score"** is misleading. We do *not* perform GL-style age standardisation. (That was the calculator's formula; the calculator has been retired.) Saying "age-adjusted" implies we replicate GL's age standardisation when we don't.
- **Fix:** strike "Age-adjusted" entirely. Change line 128–129 label to "Indicative Readiness vs 121 benchmark — directional signal only, not the GL standardised score."

---

## MEDIUM-RISK surfaces — tighten copy

### 7. `client/src/pages/HowItWorks.tsx`
- Lines 149, 294, 334–336 say "indicative readiness score against the 121 qualifying standard" — correct framing but never paired with the "not the official GL score" disclaimer. Line 404 has the disclaimer but it sits at the bottom of the page.
- **Fix:** copy line 404's disclaimer fragment ("not a substitute for the official GL standardised score") into each of the four band/score callouts. Or, render `<IndicativeScoreCaveat variant="inline" />` once at the top of the bands section.

### 8. `client/src/pages/Progress.tsx` (lines 299, 361)
- "indicative readiness score is moving toward the 121 standard" — directionally correct but never explicitly disclaims equivalence.
- **Fix:** add a one-line disclaimer at the top of the page where the indicative readiness score is first shown.

### 9. `client/src/pages/ParentAnalytics.tsx` (line 178)
- "their indicative readiness score is climbing toward the 121 qualifying standard" — same shape as #8.
- **Fix:** add the inline caveat near where the parent first sees the trend.

### 10. `server/ssrPages.ts` (line 51) and `server/ssrHighVolume.ts` (multiple)
- Most SSR pages already include strong language ("indicator only, not a substitute for the official GL standardised score") in `getScoreGuideHtml`.
- `ssrPages.ts:51` describes the 121 standardised score generally — that's fine because it's about the *real* GL score, not ours. No fix needed there.
- The town/school SSR pages don't currently mention our readiness check next to a 121 reference, so no risk introduced.
- **Fix:** none required for the SSR pages beyond what was already done in the calculator-removal change.

### 11. `client/src/pages/seo/QualifyingScore.tsx`
- This page exists specifically to explain what 121 *is*. It correctly addresses the official GL score. **However**, it's the ideal landing page from the calculator 301 redirect, so it should now also include a short "How does our readiness check relate to 121?" section that explicitly says we don't replicate the GL standardised score.
- **Fix:** add a short section near the bottom: heading "How our readiness check relates to 121", body = the gold-standard methodology framing, link to `/scoring-methodology`.

---

## LOW-RISK references — acceptable as-is

These mention 121 only in the context of explaining what the *real* GL threshold is for grammar school admission. They don't claim our score equals GL's score, so no action required:

- `client/src/data/towns.ts` — all references explain the official threshold
- `client/src/data/grammar-schools.ts` — same
- `client/src/data/glossary.ts`, `server/ssrGlossary.ts` — definitions
- `client/src/pages/BucksGuide.tsx`, `ParentGuide.tsx`, `ParentHub.tsx`, `Pricing.tsx`, `WhyChoosePlatform.tsx`, `About.tsx` — informational mentions
- All `seo/*.tsx` pages explaining grammar school admissions, registration, results timing, mock test prep, etc., where 121 is mentioned as *the* qualifying threshold with no claim about our number

---

## Cross-cutting terminology fixes

Apply consistently across every UI surface that displays our number:

| Current wording | Replace with | Reason |
|---|---|---|
| "Estimated score" / "Est. Score" / "estimated score" | "Indicative Readiness" / "Indicative Readiness Score" | "Estimated" implies prediction of an external official number |
| "Forecast score" | "Readiness Forecast" or "Indicative Readiness" | "Forecast score" reads as predicted GL score |
| "Age-adjusted score" | strike entirely | We do not apply GL-style age standardisation. Used in `FreeDiagnosticStart.tsx` |
| "121 Target" | "121 preparation benchmark" | "Target" implies our scale = GL's scale |
| "Standardised score" (when referring to *our* number) | always reserved for the *official* GL score; never use for our number | Term has a precise GL Assessment meaning |
| "Predicts" / "predicts your child's score" | "indicates readiness" / "indicates how prepared your child is" | We do not predict the GL score |

---

## Recommended implementation sequence

1. **Build the shared component** — `client/src/components/shared/IndicativeScoreCaveat.tsx` with `variant="inline"` (one-line, blue info icon, links to `/scoring-methodology`) and `variant="block"` (bordered callout matching ScoringMethodology.tsx's existing style). Ship this first.
2. **Drop the inline caveat into the four live score-display surfaces** — Results, GuestResults, Dashboard, FreeDiagnosticStart (the panel with "Forecast vs 121"). Highest user-trust impact.
3. **Apply the terminology table site-wide** with a find-and-replace pass, then a manual review of edge cases. This is the boring-but-essential work.
4. **Update the marketing mockups** — DashboardPreview, Landing's ForecastPanel and chart — relabel "Est. Score" / "estimated score" to "Indicative Readiness", change "121 Target" to "121 preparation benchmark", add a small footnote inside each mockup.
5. **Add the methodology section to `QualifyingScore.tsx`** — captures the 301-redirect traffic from the retired calculator URL and makes the relationship between our readiness check and the official GL score explicit.
6. **Tighten HowItWorks, Progress, ParentAnalytics** — drop the inline caveat in once at the top of each page where the score is referenced.

## Sources / references

- Buckinghamshire Council, *Secondary Transfer Test*: https://www.buckinghamshire.gov.uk/schools-and-learning/schools-index/the-buckinghamshire-secondary-transfer-test/
- The Bucks Grammar Schools (TBGS) — partnership site for the 13 Bucks grammar schools: https://www.thebucksgrammarschools.org/
- GL Assessment — *Familiarisation* materials and information about the 11+ format: https://www.gl-assessment.co.uk/products/the-11-plus-test/

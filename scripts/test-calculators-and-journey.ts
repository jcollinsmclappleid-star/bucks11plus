/**
 * Comprehensive test harness for the scoring surfaces + end-to-end
 * customer journey on bucks11plustest.co.uk.
 *
 *   (The public score calculator at /bucks-11-plus-score-calculator was
 *   retired — the URL now 301s to /bucks-11-plus-qualifying-score. Its
 *   formula tests have been removed from this harness.)
 *
 *   1. Forecast / Diagnostic score  (POST /api/guest/submit/:id)
 *      → forecastScore = round(69 + weightedPct * 72), GL section weights
 *
 *   2. Readiness Score (RS) analytics  (server/metrics.ts → computeRS, WAI, PDI, CR, SI)
 *
 * Plus an end-to-end customer journey:
 *   start guest diagnostic → submit answers → fetch results
 *   → email-results (enqueues nurture) → lead-magnet POST
 *   → DB-verify lead + nurture rows → token verification → unsubscribe
 *
 * Run:   npx tsx scripts/test-calculators-and-journey.ts
 */

import { computeWAI, computePDI, computeCR, computeSI, computeRS, type AnswerRecord } from "../server/metrics";
import { db } from "../server/db";
import { practicePaperLeads, nurtureSequences, testSessions, testAnswers } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

const BASE = "http://localhost:5000";

// ─────────────────────────────────────────────────────────────────────────────
// Tiny test runner
// ─────────────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    const msg = detail ? `${name} — ${detail}` : name;
    failures.push(msg);
    console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}
function section(title: string) {
  console.log(`\n━━ ${title} ${"━".repeat(Math.max(2, 70 - title.length))}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// (Removed — public score calculator was retired; URL now 301s.)
// Verify the redirect is in place.
// ─────────────────────────────────────────────────────────────────────────────
async function testCalculatorRedirect() {
  section("0. Retired ScoreCalculator URL redirects to qualifying-score");
  try {
    const res = await fetch(`${BASE}/bucks-11-plus-score-calculator`, { redirect: "manual" });
    check("GET /bucks-11-plus-score-calculator returns 301", res.status === 301, `got ${res.status}`);
    const loc = res.headers.get("location") || "";
    check("Redirect Location is /bucks-11-plus-qualifying-score", loc.endsWith("/bucks-11-plus-qualifying-score"), `got ${loc}`);
  } catch (err) {
    check("Redirect fetch did not throw", false, String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1.  Forecast score (server-side GL-weighted formula)
// ─────────────────────────────────────────────────────────────────────────────
function computeForecastScore(sectionAcc: Record<string, number>): { forecastScore: number; band: string } {
  const W: Record<string, number> = { "Verbal Reasoning": 0.35, "Mathematics": 0.25, "Non-Verbal Reasoning": 0.25, "English Comprehension": 0.15 };
  let num = 0, den = 0;
  for (const [name, acc] of Object.entries(sectionAcc)) {
    const w = W[name] ?? 0.25;
    num += acc * w;
    den += w;
  }
  const pct = den > 0 ? num / den : 0;
  const score = Math.round(69 + pct * 72);
  let band = "Clear Improvement Opportunity";
  if (score >= 121) band = "On Track";
  else if (score >= 115) band = "Within Reach";
  return { forecastScore: score, band };
}

function testForecastFormula() {
  section("2. Forecast Score (POST /api/guest/submit GL-weighted formula)");

  const all = (acc: number) => ({ "Verbal Reasoning": acc, "Mathematics": acc, "Non-Verbal Reasoning": acc, "English Comprehension": acc });

  const r0 = computeForecastScore(all(0));
  const r100 = computeForecastScore(all(1));
  const r80 = computeForecastScore(all(0.8));
  const r70 = computeForecastScore(all(0.7));
  const r60 = computeForecastScore(all(0.60));
  check("0% across all sections → 69 (GL floor)", r0.forecastScore === 69, `got ${r0.forecastScore}`);
  check("100% across all sections → 141 (GL ceiling)", r100.forecastScore === 141, `got ${r100.forecastScore}`);
  check("80% across all sections → 'On Track' band (≥121)", r80.band === "On Track", `${r80.forecastScore} → ${r80.band}`);
  check("70% across all sections → 'Within Reach' band (115–120)", r70.band === "Within Reach", `${r70.forecastScore} → ${r70.band}`);
  check("60% across all sections → 'Clear Improvement Opportunity' (<115)", r60.band === "Clear Improvement Opportunity", `${r60.forecastScore} → ${r60.band}`);

  // GL weighting — VR is worth more than EC
  const strongVR = computeForecastScore({ "Verbal Reasoning": 1.0, "Mathematics": 0.5, "Non-Verbal Reasoning": 0.5, "English Comprehension": 0.5 });
  const strongEC = computeForecastScore({ "Verbal Reasoning": 0.5, "Mathematics": 0.5, "Non-Verbal Reasoning": 0.5, "English Comprehension": 1.0 });
  check("Strong VR outscores strong EC at same other-section accuracy (VR weighted 0.35, EC 0.15)",
        strongVR.forecastScore > strongEC.forecastScore, `vr=${strongVR.forecastScore} ec=${strongEC.forecastScore}`);

  // Missing section — shouldn't crash
  const missingMaths = computeForecastScore({ "Verbal Reasoning": 0.8, "Non-Verbal Reasoning": 0.8, "English Comprehension": 0.8 });
  check("Missing a section: still produces sensible score (renormalised)",
        missingMaths.forecastScore >= 69 && missingMaths.forecastScore <= 141, `got ${missingMaths.forecastScore}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  Analytics — computeWAI / PDI / CR / SI / RS
// ─────────────────────────────────────────────────────────────────────────────
function makeAnswers(opts: { count: number; correctRate: number; section?: string; sameSubRule?: boolean; difficulty?: number; meanTime?: number }): AnswerRecord[] {
  const out: AnswerRecord[] = [];
  for (let i = 0; i < opts.count; i++) {
    out.push({
      questionId: `q${i}`,
      section: opts.section ?? "Verbal Reasoning",
      skillId: "skill-x",
      subRuleId: opts.sameSubRule ? "rule-A" : `rule-${i % 5}`,
      difficulty: opts.difficulty ?? 3,
      cognitiveLoad: 5,
      isCorrect: i / opts.count < opts.correctRate,
      timeSeconds: opts.meanTime ?? 30,
      questionOrder: i,
    });
  }
  return out;
}

function testRSAnalytics() {
  section("3. Readiness Score analytics (computeWAI / PDI / CR / SI / RS)");

  // Empty input
  const empty = computeWAI([]);
  check("computeWAI([]) → wai=0, no NaN", empty.wai === 0 && !Number.isNaN(empty.wai));
  const emptyCR = computeCR([]);
  check("computeCR([]) → crScore=100 (no errors → no concentration)", emptyCR.crScore === 100);
  const emptySI = computeSI([]);
  check("computeSI([]) → si=100, confidence='Emerging'", emptySI.si === 100 && emptySI.forecastConfidence === "Emerging");

  // All correct vs all wrong
  const allCorrect = makeAnswers({ count: 30, correctRate: 1.0, difficulty: 3 });
  const allWrong = makeAnswers({ count: 30, correctRate: 0.0, difficulty: 3 });
  const waiPerfect = computeWAI(allCorrect);
  const waiZero = computeWAI(allWrong);
  check("All correct → WAI = 1.0", waiPerfect.wai === 1, `got ${waiPerfect.wai}`);
  check("All wrong → WAI = 0", waiZero.wai === 0, `got ${waiZero.wai}`);

  // RS banding
  const rsGreen = computeRS(0.85, 80, 80, 95, 70);
  const rsAmber = computeRS(0.70, 65, 75, 80, 50);
  const rsRed = computeRS(0.40, 50, 50, 50, 20);
  check("RS Green band (high WAI, PDI≥70, accHard≥40)", rsGreen.band === "Green", `${rsGreen.rs} → ${rsGreen.band}`);
  check("RS Amber band (middle ranges)", rsAmber.band === "Amber", `${rsAmber.rs} → ${rsAmber.band}`);
  check("RS Red band (low WAI or PDI<55 or accHard<25)", rsRed.band === "Red", `${rsRed.rs} → ${rsRed.band}`);

  // Concentration penalty: errors all in one sub-rule should crush crScore
  const concentrated = makeAnswers({ count: 30, correctRate: 0.5, sameSubRule: true });
  const spread = makeAnswers({ count: 30, correctRate: 0.5, sameSubRule: false });
  const crConc = computeCR(concentrated);
  const crSpread = computeCR(spread);
  check("CR penalises concentrated errors more than spread errors",
        crConc.crScore < crSpread.crScore, `conc=${crConc.crScore} spread=${crSpread.crScore}`);

  // PDI: slow vs fast pacing
  const fast = computePDI(makeAnswers({ count: 20, correctRate: 1, meanTime: 25 }));
  const slow = computePDI(makeAnswers({ count: 20, correctRate: 1, meanTime: 60 }));
  check("PDI rewards faster pace (under benchmark)", fast.pdiOverall > slow.pdiOverall, `fast=${fast.pdiOverall} slow=${slow.pdiOverall}`);

  // SI: stable history vs volatile history
  const stableSI = computeSI([110, 112, 111]);
  const volatileSI = computeSI([90, 130, 100]);
  check("SI rewards stable RS history (low stddev)", stableSI.si > volatileSI.si, `stable=${stableSI.si} volatile=${volatileSI.si}`);

  // Stress: 1 000 random attempts — every RS in [0,100], no NaN
  let bad = 0, minRS = 200, maxRS = -1;
  for (let i = 0; i < 1000; i++) {
    const ans = makeAnswers({ count: 12 + Math.floor(Math.random() * 40), correctRate: Math.random(), difficulty: 1 + Math.floor(Math.random() * 5), meanTime: 10 + Math.random() * 90 });
    const w = computeWAI(ans);
    const p = computePDI(ans);
    const c = computeCR(ans);
    const s = computeSI([Math.random() * 100, Math.random() * 100]);
    const rs = computeRS(w.wai, p.pdiOverall, s.si, c.crScore, w.accHard);
    if (Number.isNaN(rs.rs) || rs.rs < 0 || rs.rs > 100) bad++;
    if (rs.rs < minRS) minRS = rs.rs;
    if (rs.rs > maxRS) maxRS = rs.rs;
  }
  check("Stress 1 000 random attempts: zero invalid RS, all in [0,100]", bad === 0, `${bad} bad results, range=[${minRS},${maxRS}]`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  End-to-end customer journey (real HTTP + DB)
// ─────────────────────────────────────────────────────────────────────────────
async function testCustomerJourney() {
  section("4. End-to-end customer journey (HTTP + DB)");
  const cleanupEmails: string[] = [];
  const cleanupSessions: string[] = [];
  try {
  // 4a. Start guest diagnostic
  const startRes = await fetch(`${BASE}/api/guest/start-diagnostic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ diagnosticId: "mini-1" }),
  });
  check("POST /api/guest/start-diagnostic → 201", startRes.status === 201, `got ${startRes.status}`);
  if (startRes.status !== 201) return;
  const start = await startRes.json();
  const sessionId: string = start.session.id;
  const guestToken: string = start.guestToken;
  const questions: any[] = start.questions;
  check(`Returned ${questions.length} questions for mini-1`, questions.length === 12, `got ${questions.length}`);
  check("Guest token is a 64-char hex", /^[a-f0-9]{64}$/.test(guestToken));
  check("Questions stripped of correctAnswer (server doesn't leak the key)",
        questions.every((q) => !("correctAnswer" in q)));

  // 4b. Submit answers — pretend the candidate gets every question right (worst-case path: forecast 141 + nurture)
  // We don't know the correct answer, but we can submit the first option deterministically — server marks based on its own key
  const answers = questions.map((q) => ({
    questionId: q.id,
    selectedAnswer: Array.isArray(q.options) && q.options.length > 0 ? q.options[0] : "A",
    timeTaken: 25 + Math.floor(Math.random() * 20),
  }));
  const submitRes = await fetch(`${BASE}/api/guest/submit/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, guestToken }),
  });
  check("POST /api/guest/submit/:id → 200", submitRes.status === 200, `got ${submitRes.status}`);
  const result = submitRes.status === 200 ? await submitRes.json() : null;
  if (result) {
    check("forecastScore in [69, 141]", result.forecastScore >= 69 && result.forecastScore <= 141, `got ${result.forecastScore}`);
    check("band is one of On Track / Within Reach / Clear Improvement Opportunity",
          ["On Track", "Within Reach", "Clear Improvement Opportunity"].includes(result.band), `got ${result.band}`);
    check("sectionScores returned for each section attempted",
          Array.isArray(result.sectionScores) && result.sectionScores.length > 0, `got ${result.sectionScores?.length}`);
    check("paceData returned",
          Array.isArray(result.paceData) && result.paceData.length > 0);
  }

  // 4c. Replay-protection: submitting again should 400
  const replay = await fetch(`${BASE}/api/guest/submit/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, guestToken }),
  });
  check("Replay submit on completed session → 400", replay.status === 400, `got ${replay.status}`);

  // 4d. Bad guest-token submit on a fresh session → 403
  const start2 = await (await fetch(`${BASE}/api/guest/start-diagnostic`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ diagnosticId: "mini-1" }) })).json();
  const bad = await fetch(`${BASE}/api/guest/submit/${start2.session.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: [], guestToken: "deadbeef" }),
  });
  check("Submit with wrong guestToken → 403", bad.status === 403, `got ${bad.status}`);
  // (intentionally leave start2 session abandoned — that's a realistic drop-off pattern)

  // 4e. Fetch results back via token
  const fetchRes = await fetch(`${BASE}/api/guest/results/${sessionId}?token=${guestToken}`);
  check("GET /api/guest/results with valid token → 200", fetchRes.status === 200, `got ${fetchRes.status}`);
  const wrongTok = await fetch(`${BASE}/api/guest/results/${sessionId}?token=invalid`);
  check("GET /api/guest/results with bad token → 403", wrongTok.status === 403, `got ${wrongTok.status}`);
  const noTok = await fetch(`${BASE}/api/guest/results/${sessionId}`);
  check("GET /api/guest/results with NO token → 403 (broken-access-control regression guard)", noTok.status === 403, `got ${noTok.status}`);
  const noTokReview = await fetch(`${BASE}/api/guest/review/${sessionId}`);
  check("GET /api/guest/review with NO token → 403 (broken-access-control regression guard)", noTokReview.status === 403, `got ${noTokReview.status}`);

  // Strict oracle: recompute forecast from sectionScores and assert exact equality with API output
  if (result?.sectionScores) {
    const sectionAccPct: Record<string, number> = {};
    for (const s of result.sectionScores) sectionAccPct[s.name] = s.score / 100;
    const oracle = computeForecastScore(sectionAccPct);
    check(`Oracle: API forecastScore (${result.forecastScore}) === recomputed (${oracle.forecastScore})`,
          oracle.forecastScore === result.forecastScore);
    check(`Oracle: API band ('${result.band}') === recomputed ('${oracle.band}')`,
          oracle.band === result.band);
    check("Oracle: mini-1 returns all 4 GL sections", result.sectionScores.length === 4, `got ${result.sectionScores.length}`);
  }

  // 4f. Email results → enqueues post-diagnostic nurture
  const testEmail = `test+${Date.now()}@bucks11plustest.co.uk`;
  const emailRes = await fetch(`${BASE}/api/guest/email-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, guestToken, email: testEmail }),
  });
  check("POST /api/guest/email-results → 200", emailRes.ok, `got ${emailRes.status}`);

  // 4g. DB-verify nurture row
  await new Promise((r) => setTimeout(r, 300));
  const nurtureRows = await db.select().from(nurtureSequences).where(eq(nurtureSequences.email, testEmail));
  check("Nurture sequence row enqueued for emailed candidate", nurtureRows.length === 1, `got ${nurtureRows.length}`);
  if (nurtureRows[0]) {
    check("Nurture row: currentStep starts at 0 or 1", nurtureRows[0].currentStep <= 1, `got ${nurtureRows[0].currentStep}`);
    check("Nurture row: nextSendAt is in the future (day-2 delay)",
          new Date(nurtureRows[0].nextSendAt!).getTime() > Date.now(), `nextSendAt=${nurtureRows[0].nextSendAt}`);
    check("Nurture row: not unsubscribed at creation", nurtureRows[0].unsubscribed === false);
    check("Nurture row: sessionId matches", nurtureRows[0].sessionId === sessionId);
  }

  // 4h. Lead-magnet email-capture (separate flow — practice paper PDF)
  const leadEmail = `lead+${Date.now()}@bucks11plustest.co.uk`;
  const leadRes = await fetch(`${BASE}/api/leads/practice-paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: leadEmail, source: "test-harness" }),
  });
  check("POST /api/leads/practice-paper → 200/201", leadRes.ok, `got ${leadRes.status}`);
  await new Promise((r) => setTimeout(r, 300));
  const leadRows = await db.select().from(practicePaperLeads).where(eq(practicePaperLeads.email, leadEmail));
  check("practice_paper_leads row created", leadRows.length === 1, `got ${leadRows.length}`);

  // 4i. Lead-magnet validation — empty email rejected
  const emptyLead = await fetch(`${BASE}/api/leads/practice-paper`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "" }),
  });
  check("Empty email rejected (400/422)", emptyLead.status === 400 || emptyLead.status === 422, `got ${emptyLead.status}`);
  const badEmail = await fetch(`${BASE}/api/leads/practice-paper`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "not-an-email" }),
  });
  check("Malformed email rejected (400/422)", badEmail.status === 400 || badEmail.status === 422, `got ${badEmail.status}`);

  // 4j. PDF download — invalid token rejected
  if (leadRows[0]) {
    const badPdf = await fetch(`${BASE}/api/leads/practice-paper/pdf?id=${leadRows[0].id}&token=deadbeef`);
    check("PDF download with bad token → 4xx", badPdf.status >= 400 && badPdf.status < 500, `got ${badPdf.status}`);
  }

  // 4k. Unsubscribe flow — bad token rejected
  const badUnsub = await fetch(`${BASE}/api/leads/practice-paper/unsubscribe?email=${encodeURIComponent(leadEmail)}&token=deadbeef`);
  check("Unsubscribe with bad token → 4xx", badUnsub.status >= 400 && badUnsub.status < 500, `got ${badUnsub.status}`);

  cleanupEmails.push(testEmail, leadEmail);
  cleanupSessions.push(sessionId, start2.session.id);
  } finally {
    // Cleanup runs even if a test threw — delete by email/session, not by [0]
    for (const e of cleanupEmails) {
      await db.delete(practicePaperLeads).where(eq(practicePaperLeads.email, e));
      await db.delete(nurtureSequences).where(eq(nurtureSequences.email, e));
    }
    for (const s of cleanupSessions) {
      await db.delete(testAnswers).where(eq(testAnswers.sessionId, s));
      await db.delete(testSessions).where(eq(testSessions.id, s));
    }
    console.log(`  · cleanup ok (${cleanupSessions.length} sessions, ${cleanupEmails.length} emails purged)`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log("Bucks 11 Plus — scoring + journey test harness\n");
  await testCalculatorRedirect();
  testForecastFormula();
  testRSAnalytics();
  await testCustomerJourney();

  console.log(`\n━━ Summary ${"━".repeat(60)}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) console.log("  • " + f);
  }
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error("Test harness crashed:", err);
  process.exit(2);
});

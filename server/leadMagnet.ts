import crypto from "crypto";
import { db } from "./db";
import { practicePaperLeads, nurtureSequences } from "@shared/schema";
import { and, eq, lte, isNull, sql } from "drizzle-orm";
import { ensureChromium } from "./chromium";
import { getBaseUrl, RESEND_FROM_EMAIL } from "./contactConfig";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_SECRET = process.env.EMAIL_SECRET || "dev-only-email-secret-do-not-use-in-prod";

function maskEmail(value: string): string {
  const at = value.indexOf("@");
  if (at <= 0) return "<redacted>";
  return `${value.slice(0, 1)}***@${value.slice(at + 1)}`;
}

export function signPaperToken(leadId: number, email: string): string {
  return crypto
    .createHmac("sha256", EMAIL_SECRET)
    .update(`practice-paper:${leadId}:${email}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyPaperToken(leadId: number, email: string, token: string): boolean {
  const expected = signPaperToken(leadId, email);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function nurtureUnsubToken(email: string): string {
  return crypto
    .createHmac("sha256", EMAIL_SECRET)
    .update(`nurture-unsub:${email.toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyNurtureUnsubToken(email: string, token: string): boolean {
  const expected = nurtureUnsubToken(email);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

async function rawSend(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[LeadMagnet] No RESEND_API_KEY — would send: ${subject} → ${maskEmail(to)}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error(`[LeadMagnet] Resend error ${res.status} for ${maskEmail(to)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[LeadMagnet] send failed:", err);
    return false;
  }
}

function emailFooter(unsubUrl: string): string {
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;line-height:1.5;">
    Ianson Systems Limited · Bucks 11 Plus Tests<br>
    You're receiving this because you requested resources from bucks11plustest.co.uk.<br>
    <a href="${unsubUrl}" style="color:#6b7280;">Unsubscribe in one click</a>
  </p>`;
}

export async function sendPracticePaperEmail(
  email: string,
  leadId: number,
): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = signPaperToken(leadId, email);
  const downloadUrl = `${baseUrl}/api/leads/practice-paper/pdf?id=${leadId}&token=${token}`;
  const unsubUrl = `${baseUrl}/api/leads/practice-paper/unsubscribe?email=${encodeURIComponent(email)}&token=${nurtureUnsubToken(email)}`;
  const diagnosticUrl = `${baseUrl}/free-diagnostic`;
  const subject = "Your free Bucks 11+ practice paper";

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <div style="text-align:center;margin-bottom:24px;">
      <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
    </div>
    <h2 style="font-size:22px;color:#0d1f30;margin-bottom:8px;font-family:Georgia,serif;">Your practice paper is ready</h2>
    <p style="color:#475569;">Thank you for requesting the free Bucks 11+ practice paper. It includes 12 GL-style questions across all four sections of the Buckinghamshire Secondary Transfer Test, with worked answers and explanations.</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${downloadUrl}" style="display:inline-block;background:#0d1f30;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;">Download Practice Paper (PDF)</a>
    </div>
    <p style="color:#64748b;font-size:12px;text-align:center;line-height:1.5;">If the button does not open, copy this link into your browser:<br><a href="${downloadUrl}" style="color:#0d1f30;word-break:break-all;">${downloadUrl}</a></p>

    <p style="color:#475569;font-size:14px;"><strong style="color:#0d1f30;">How to use it:</strong> sit your child in a quiet room with rough paper. Aim for 20 minutes (around 100 seconds per question — close to test-day pace). Mark together using the answer key — the explanations are where the learning happens.</p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">

    <p style="color:#475569;font-size:14px;"><strong style="color:#0d1f30;">Want a precise readiness forecast?</strong> The free 12-question Readiness Check is timed, marked instantly, and returns a practice score on the 121 scale with a section breakdown.</p>
    <div style="text-align:center;margin:18px 0;">
      <a href="${diagnosticUrl}" style="display:inline-block;background:#f59e0b;color:#1c1917;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;">Take the Free Readiness Check</a>
    </div>
    ${emailFooter(unsubUrl)}
  </div>
</body></html>`;

  return rawSend(email, subject, html);
}

export async function generatePracticePaperPdf(): Promise<Buffer> {
  await ensureChromium();
  const puppeteer = await import("puppeteer");
  const port = process.env.PORT || "5000";
  const url = `http://localhost:${port}/practice-paper-print`;

  const browser = await puppeteer.default.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await page.emulateMediaType("print");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

let cachedPdf: { buffer: Buffer; generatedAt: number } | null = null;
const PDF_CACHE_TTL_MS = 60 * 60 * 1000;

export async function getCachedPracticePaperPdf(): Promise<Buffer> {
  if (cachedPdf && Date.now() - cachedPdf.generatedAt < PDF_CACHE_TTL_MS) {
    return cachedPdf.buffer;
  }
  const buffer = await generatePracticePaperPdf();
  cachedPdf = { buffer, generatedAt: Date.now() };
  return buffer;
}

let cachedPdf2: { buffer: Buffer; generatedAt: number } | null = null;

export async function getCachedPracticePaper2Pdf(): Promise<Buffer> {
  if (cachedPdf2 && Date.now() - cachedPdf2.generatedAt < PDF_CACHE_TTL_MS) {
    return cachedPdf2.buffer;
  }
  await ensureChromium();
  const puppeteer = await import("puppeteer");
  const port = process.env.PORT || "5000";
  const url = `http://localhost:${port}/practice-paper-print-2`;
  const browser = await puppeteer.default.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await page.emulateMediaType("print");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
    });
    const buffer = Buffer.from(pdfBuffer);
    cachedPdf2 = { buffer, generatedAt: Date.now() };
    return buffer;
  } finally {
    await browser.close();
  }
}

// ── Post-diagnostic nurture sequence ─────────────────────────────────────────

type NurtureEmailContext = {
  email: string;
  baseUrl: string;
  unsubUrl: string;
  forecastScore?: number | null;
  band?: string | null;
  sessionId?: string | null;
};

function nurtureDay2Html(ctx: NurtureEmailContext): string {
  const resultsUrl = ctx.sessionId ? `${ctx.baseUrl}/free-results/${ctx.sessionId}` : `${ctx.baseUrl}/free-diagnostic`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
<div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
  <div style="text-align:center;margin-bottom:24px;"><strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong></div>
  <h2 style="font-size:22px;color:#0d1f30;margin-bottom:8px;font-family:Georgia,serif;">Your child's three biggest priorities</h2>
  <p style="color:#475569;">A couple of days ago you completed the free Readiness Check${ctx.forecastScore ? ` and saw a forecast score of <strong>${ctx.forecastScore}</strong>` : ""}${ctx.band ? ` (${ctx.band})` : ""}. Here's what that score actually tells you — and what to do with it this week.</p>

  <h3 style="color:#0d1f30;font-size:16px;margin-top:24px;">1 · Look at the weakest section, not the total</h3>
  <p style="color:#475569;font-size:14px;">The Bucks 11+ combines all four sections into a standardised score. A child who is strong in three but weak in one can still miss 121. Your section breakdown shows exactly which area to focus on first — that's where practice moves the score the most.</p>

  <h3 style="color:#0d1f30;font-size:16px;margin-top:20px;">2 · Pace matters as much as accuracy</h3>
  <p style="color:#475569;font-size:14px;">In the real test, every question your child runs out of time on is a guess. If your readiness check pace is slower than expected, work on speed under timed conditions, not just on harder questions.</p>

  <h3 style="color:#0d1f30;font-size:16px;margin-top:20px;">3 · Don't drill what they already know</h3>
  <p style="color:#475569;font-size:14px;">Practice on familiar question types feels productive but rarely moves the score. The biggest gains come from practising the sub-skills children currently get wrong — which is exactly what the platform is designed to do.</p>

  <div style="text-align:center;margin:28px 0 8px;">
    <a href="${resultsUrl}" style="display:inline-block;background:#0d1f30;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;">Open my results</a>
  </div>
  ${emailFooter(ctx.unsubUrl)}
</div></body></html>`;
}

function nurtureDay5Html(ctx: NurtureEmailContext): string {
  const pricingUrl = `${ctx.baseUrl}/pricing`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
<div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
  <div style="text-align:center;margin-bottom:24px;"><strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong></div>
  <h2 style="font-size:22px;color:#0d1f30;margin-bottom:8px;font-family:Georgia,serif;">Lifting the readiness score — what targeted practice looks like</h2>
  <p style="color:#475569;">When parents ask us how Bucks Plus Edge differs from a workbook, the honest answer is this: a workbook gives every child the same content, regardless of where the gaps are. We don't.</p>

  <p style="color:#475569;font-size:14px;">After your child's Readiness Check, the platform highlights the specific reasoning sub-types they got wrong, then drills those — not the ones they already do well. That's the difference between practising for an hour and practising the right hour.</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:20px 0;">
    <p style="color:#0d1f30;font-weight:700;margin:0 0 8px;font-size:14px;">What's included with Bucks Plus Edge:</p>
    <ul style="color:#475569;font-size:13px;margin:0;padding-left:18px;">
      <li>2,500+ GL-style questions across all four sections</li>
      <li>Full timed mock papers (40 and 50 questions)</li>
      <li>All Hard-tier challenge drills</li>
      <li>PDF readiness reports after every session</li>
      <li>Parent analytics dashboard with section-level insight</li>
    </ul>
  </div>

  <p style="color:#475569;font-size:14px;">Monthly is £35 with no lock-in — cancel any time. Annual is £279 (works out at £23.25 a month, less than one hour of in-person tutoring).</p>

  <div style="text-align:center;margin:24px 0 8px;">
    <a href="${pricingUrl}" style="display:inline-block;background:#0d1f30;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;">See the plans</a>
  </div>
  <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:8px;">Backed by a 3-day money-back guarantee on first purchase.</p>
  ${emailFooter(ctx.unsubUrl)}
</div></body></html>`;
}

export async function enqueueDiagnosticNurture(
  email: string,
  sessionId: string,
  forecastScore: number | null,
  band: string | null,
): Promise<void> {
  const existing = await db
    .select()
    .from(nurtureSequences)
    .where(and(eq(nurtureSequences.email, email.toLowerCase()), eq(nurtureSequences.sequenceType, "post_diagnostic")));
  if (existing.length > 0) {
    console.log(`[Nurture] Already enqueued for ${maskEmail(email)} — skipping`);
    return;
  }
  const day2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  await db.insert(nurtureSequences).values({
    email: email.toLowerCase(),
    sessionId,
    sequenceType: "post_diagnostic",
    currentStep: 1,
    nextSendAt: day2,
    metadata: { forecastScore, band },
  });
  console.log(`[Nurture] Enqueued post_diagnostic for ${maskEmail(email)} — first send ${day2.toISOString()}`);
}

export async function processNurtureQueue(): Promise<{ processed: number; sent: number }> {
  const due = await db
    .select()
    .from(nurtureSequences)
    .where(
      and(
        eq(nurtureSequences.unsubscribed, false),
        isNull(nurtureSequences.completedAt),
        lte(nurtureSequences.nextSendAt, new Date()),
      ),
    )
    .limit(50);

  let sent = 0;
  for (const row of due) {
    const baseUrl = getBaseUrl();
    const unsubUrl = `${baseUrl}/api/leads/practice-paper/unsubscribe?email=${encodeURIComponent(row.email)}&token=${nurtureUnsubToken(row.email)}`;
    const meta = (row.metadata as any) || {};
    const ctx: NurtureEmailContext = {
      email: row.email,
      baseUrl,
      unsubUrl,
      forecastScore: meta.forecastScore ?? null,
      band: meta.band ?? null,
      sessionId: row.sessionId,
    };

    let subject = "";
    let html = "";
    if (row.currentStep === 1) {
      subject = "Your child's three biggest 11+ priorities";
      html = nurtureDay2Html(ctx);
    } else if (row.currentStep === 2) {
      subject = "Lifting the readiness score — what targeted practice looks like";
      html = nurtureDay5Html(ctx);
    } else {
      await db.update(nurtureSequences).set({ completedAt: new Date() }).where(eq(nurtureSequences.id, row.id));
      continue;
    }

    const ok = await rawSend(row.email, subject, html);
    if (ok) sent++;

    if (row.currentStep === 1) {
      await db
        .update(nurtureSequences)
        .set({ currentStep: 2, nextSendAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) })
        .where(eq(nurtureSequences.id, row.id));
    } else {
      await db.update(nurtureSequences).set({ completedAt: new Date() }).where(eq(nurtureSequences.id, row.id));
    }
  }
  if (due.length > 0) {
    console.log(`[Nurture] Processed ${due.length} due rows, sent ${sent}`);
  }
  return { processed: due.length, sent };
}

export function startNurtureProcessor(): void {
  const intervalMs = 5 * 60 * 1000;
  setInterval(() => {
    processNurtureQueue().catch((err) => console.error("[Nurture] processor error:", err));
  }, intervalMs);
  console.log(`[Nurture] Background processor started (every ${intervalMs / 1000}s)`);
}

export async function unsubscribeFromNurture(email: string): Promise<void> {
  await db
    .update(nurtureSequences)
    .set({ unsubscribed: true })
    .where(eq(nurtureSequences.email, email.toLowerCase()));
  await db
    .update(practicePaperLeads)
    .set({ unsubscribed: true })
    .where(eq(practicePaperLeads.email, email.toLowerCase()));
}

export async function recordPracticePaperLead(
  email: string,
  source: string | null,
): Promise<{ id: number; isNew: boolean }> {
  const existing = await db
    .select()
    .from(practicePaperLeads)
    .where(eq(practicePaperLeads.email, email.toLowerCase()))
    .limit(1);
  if (existing.length > 0) {
    return { id: existing[0].id, isNew: false };
  }
  const [row] = await db
    .insert(practicePaperLeads)
    .values({ email: email.toLowerCase(), source })
    .returning();
  return { id: row.id, isNew: true };
}

export async function markPracticePaperDownloaded(leadId: number): Promise<void> {
  await db
    .update(practicePaperLeads)
    .set({ downloadedAt: new Date() })
    .where(eq(practicePaperLeads.id, leadId));
}

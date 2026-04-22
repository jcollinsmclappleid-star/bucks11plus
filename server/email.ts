import { db } from "./db";
import { users, emailEvents } from "@shared/schema";
import { eq, and, isNull, lt, sql } from "drizzle-orm";
import { storage } from "./storage";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Bucks 11 Plus Tests <noreply@bucks11plustest.co.uk>";
const EMAIL_SECRET = process.env.EMAIL_SECRET || "11plus-email-secret";

function getBaseUrl(): string {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const domains = process.env.REPLIT_DOMAINS || "";
  const parts = domains.split(",").map(d => d.trim()).filter(Boolean);
  const customDomain = parts.find(d => d.includes(".co.uk") || (!d.includes("replit.app") && !d.includes("replit.dev")));
  if (customDomain) return `https://${customDomain}`;
  return "https://bucks11plustest.co.uk";
}
const BASE_URL = getBaseUrl();

async function generateUnsubscribeToken(userId: string): Promise<string> {
  const crypto = await import("crypto");
  return crypto.createHmac("sha256", EMAIL_SECRET).update(userId).digest("hex");
}

function unsubscribeUrl(userId: string, token: string): string {
  return `${BASE_URL}/api/email/unsubscribe?token=${token}&userId=${userId}`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[Email] Skipping send (no RESEND_API_KEY): ${subject} → ${to}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Email] Resend error: ${res.status} ${err}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return false;
  }
}

function wrapHtml(body: string, userId: string, unsubToken: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  ${body}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">
    You're receiving this because you opted in to emails from Bucks 11 Plus Tests.<br>
    <a href="${unsubscribeUrl(userId, unsubToken)}" style="color:#6b7280;">Unsubscribe</a>
  </p>
</body>
</html>`;
}

async function logEmailEvent(userId: string, emailType: string, eventType: string, metadata?: any) {
  try {
    await storage.createEmailEvent({
      userId,
      emailType,
      eventType,
      metadata: metadata || null,
    });
  } catch (err) {
    console.error("[Email] Failed to log event:", err);
  }
}

export async function sendAdminNotificationEmail(
  event: "payment",
  data: { userEmail: string; tier: string; amount?: string; timestamp: Date },
): Promise<void> {
  const adminEmail = "admin@bucks11plus.co.uk";
  const subject = `New Payment — ${data.userEmail}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <strong style="font-size:16px;color:#0d1f30;">Bucks 11 Plus Tests — Admin Notification</strong>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p><strong>Event:</strong> Payment Received</p>
  <p><strong>User:</strong> ${data.userEmail}</p>
  <p><strong>Plan:</strong> ${data.tier}</p>
  ${data.amount ? `<p><strong>Amount:</strong> ${data.amount}</p>` : ""}
  <p><strong>Time:</strong> ${data.timestamp.toUTCString()}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p style="font-size:11px;color:#9ca3af;">Ianson Systems Limited · Bucks 11 Plus Tests</p>
</body>
</html>`;

  try {
    if (!RESEND_API_KEY) {
      console.log(`[AdminEmail] Skipping (no RESEND_API_KEY): ${subject}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [adminEmail], subject, html }),
    });
    if (!res.ok) console.error(`[AdminEmail] Send failed: ${res.status}`);
    else console.log(`[AdminEmail] Sent OK`);
  } catch (err) {
    console.error("[AdminEmail] Error:", err);
  }
}

export async function sendGuideDownloadUserEmail(
  name: string,
  email: string,
): Promise<void> {
  const BASE_URL = getBaseUrl();
  const downloadUrl = `${BASE_URL}/api/guide/pdf`;
  const onlineUrl = `${BASE_URL}/parent-guide`;
  const diagnosticUrl = `${BASE_URL}/free-diagnostic`;
  const subject = `Your Free Bucks 11 Plus Parent Guide`;
  const firstName = name.split(" ")[0] || name;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:20px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="font-size:22px;color:#0d1f30;margin-bottom:8px;">Hi ${firstName}, your guide is ready</h2>
  <p style="color:#475569;">Thank you for downloading the free Bucks 11 Plus Parent Guide. It covers everything you need to understand the 121 qualifying score, the four exam papers, and how to assess your child's readiness.</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="${downloadUrl}" style="display:inline-block;background:#0d1f30;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;">Download Your Guide (PDF)</a>
  </div>
  <p style="color:#64748b;font-size:14px;text-align:center;">Having trouble? <a href="${onlineUrl}" style="color:#0d1f30;">View the guide online instead</a></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">
  <p style="color:#475569;font-size:14px;"><strong style="color:#0d1f30;">Next step:</strong> Find out exactly where your child stands with a free GL-style readiness check — 12 questions across Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Takes under 10 minutes.</p>
  <div style="text-align:center;margin:20px 0;">
    <a href="${diagnosticUrl}" style="display:inline-block;background:#f59e0b;color:#1c1917;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;">Take the Free Readiness Check</a>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Ianson Systems Limited · Bucks 11 Plus Tests · <a href="${BASE_URL}" style="color:#9ca3af;">${BASE_URL.replace("https://","")}</a></p>
</body>
</html>`;

  console.log(`[GuideEmail] Attempting user email to ${email}`);
  try {
    if (!RESEND_API_KEY) {
      console.log(`[GuideEmail] Skipping user email (no RESEND_API_KEY): ${email}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [email], subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[GuideEmail] User email send failed: ${res.status} — ${body}`);
    } else {
      console.log(`[GuideEmail] Guide download email sent to ${email}`);
    }
  } catch (err) {
    console.error("[GuideEmail] User email error:", err);
  }
}

export async function sendGuideDownloadAdminEmail(
  name: string,
  email: string,
  downloadedAt: Date,
): Promise<void> {
  const subject = `[Bucks 11 Plus Tests] New Guide Download — ${name}`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <strong style="font-size:16px;color:#0d1f30;">Bucks 11 Plus Tests — Guide Download Notification</strong>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Downloaded at:</strong> ${downloadedAt.toUTCString()}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p style="font-size:11px;color:#9ca3af;">Ianson Systems Limited · Bucks 11 Plus Tests</p>
</body>
</html>`;

  try {
    if (!RESEND_API_KEY) {
      console.log(`[GuideEmail] Skipping (no RESEND_API_KEY): ${subject}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: ["support@11plustesthub.co.uk"], subject, html }),
    });
    if (!res.ok) console.error(`[GuideEmail] Send failed: ${res.status}`);
    else console.log(`[GuideEmail] Admin notification sent for ${email}`);
  } catch (err) {
    console.error("[GuideEmail] Error:", err);
  }
}

export async function sendPurchaseNotificationEmail(
  email: string,
  tier: string,
  amountPence?: number,
): Promise<void> {
  const planLabel: Record<string, string> = {
    pack_plus: "Bucks Plus Edge Monthly (£35/mo)",
    pack_annual: "Bucks Plus Edge Annual (£279/yr)",
    pack_monthly: "Bucks Plus Edge Monthly",
  };
  const subject = `[Bucks 11 Plus Tests] New Purchase — ${email}`;
  const amountStr = amountPence != null ? `£${(amountPence / 100).toFixed(2)}` : null;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <strong style="font-size:16px;color:#0d1f30;">Bucks 11 Plus Tests — New Purchase</strong>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p><strong>Customer email:</strong> ${email}</p>
  <p><strong>Plan:</strong> ${planLabel[tier] || tier}</p>
  ${amountStr ? `<p><strong>Amount:</strong> ${amountStr}</p>` : ""}
  <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p style="font-size:11px;color:#9ca3af;">Ianson Systems Limited · Bucks 11 Plus Tests</p>
</body>
</html>`;

  try {
    if (!RESEND_API_KEY) {
      console.log(`[PurchaseEmail] Skipping (no RESEND_API_KEY): ${subject}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: ["support@11plustesthub.co.uk"], subject, html }),
    });
    if (!res.ok) console.error(`[PurchaseEmail] Send failed: ${res.status}`);
    else console.log(`[PurchaseEmail] Admin notification sent for ${email}`);
  } catch (err) {
    console.error("[PurchaseEmail] Error:", err);
  }
}

export async function sendSubscriptionCancelledAdminEmail(
  email: string,
  tier: string,
): Promise<void> {
  const subject = `[Bucks 11 Plus Tests] Subscription Cancelled — ${email}`;
  const planLabel: Record<string, string> = {
    pack_plus: "Bucks Plus Edge (Monthly, £35/mo)",
    pack_annual: "Bucks Plus Edge (Annual, £279/yr)",
    pack_monthly: "Bucks Plus Edge (Monthly)",
    pack12: "Pack 12 (legacy)",
    programme8: "Programme 8 (legacy)",
    programme12: "Programme 12 (legacy)",
    programme16: "Programme 16 (legacy)",
    programme16_family: "Programme 16 Family (legacy)",
    programme24_plus: "Programme 24+ (legacy)",
  };
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <strong style="font-size:16px;color:#0d1f30;">Bucks 11 Plus Tests — Subscription Cancelled</strong>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Plan:</strong> ${planLabel[tier] || tier}</p>
  <p><strong>Cancelled at:</strong> ${new Date().toUTCString()}</p>
  <p style="color:#64748b;font-size:14px;">Access will remain active until the end of the current billing period. No further charges will be made.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p style="font-size:11px;color:#9ca3af;">Ianson Systems Limited · Bucks 11 Plus Tests</p>
</body>
</html>`;

  try {
    if (!RESEND_API_KEY) {
      console.log(`[CancelEmail] Skipping (no RESEND_API_KEY): ${subject}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: ["support@11plustesthub.co.uk"], subject, html }),
    });
    if (!res.ok) console.error(`[CancelEmail] Send failed: ${res.status}`);
    else console.log(`[CancelEmail] Admin notification sent for ${email}`);
  } catch (err) {
    console.error("[CancelEmail] Error:", err);
  }
}

export async function sendGuestResultsEmail(
  email: string,
  sessionId: string,
  guestToken: string,
  forecastScore: number,
  band: string,
): Promise<boolean> {
  const resultsUrl = `${BASE_URL}/free-results/${sessionId}?token=${guestToken}`;

  const bandColor = band === "On Track" ? "#16a34a" : band === "Within Reach" ? "#d97706" : "#dc2626";
  const bandBg = band === "On Track" ? "#f0fdf4" : band === "Within Reach" ? "#fffbeb" : "#fef2f2";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Your Free Readiness Check Results</h2>
  <p style="color:#475569;">Here's the link to your child's Buckinghamshire 11+ readiness results. Bookmark it — you can come back to it any time.</p>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:24px;margin:20px 0;text-align:center;">
    <p style="font-size:13px;color:#64748b;margin:0 0 4px 0;">GL-Style Forecast Score</p>
    <p style="font-size:48px;font-weight:800;color:#0d1f30;margin:0 0 8px 0;line-height:1;">${forecastScore}</p>
    <div style="display:inline-block;background:${bandBg};color:${bandColor};border:1px solid ${bandColor}33;padding:4px 14px;border-radius:999px;font-size:13px;font-weight:700;">${band}</div>
    <p style="font-size:12px;color:#94a3b8;margin:12px 0 0 0;">Target: 121 · Max: 141</p>
  </div>
  <div style="text-align:center;margin:28px 0;">
    <a href="${resultsUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">View Full Results & Section Breakdown</a>
  </div>
  <p style="font-size:13px;color:#64748b;">Or copy this link into your browser:</p>
  <p style="font-size:12px;color:#94a3b8;background:#f1f5f9;padding:10px 14px;border-radius:6px;word-break:break-all;">${resultsUrl}</p>
  <p style="font-size:13px;color:#475569;margin-top:20px;">
    Create a free Bucks 11 Plus Tests account to save these results permanently, track progress over time, and access targeted practice questions.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Buckinghamshire 11+ Preparation · Independent readiness assessment, not affiliated with GL Assessment or Buckinghamshire Council.</p>
</body>
</html>`;

  return sendEmail(email, "Your 11+ Readiness Check Results — save this link", html);
}

export async function sendAccountSetupEmail(email: string, resetToken: string): Promise<boolean> {
  const setupUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Your account is ready — set your password</h2>
  <p>Thank you for subscribing to <strong>Bucks Plus Edge</strong>. Your account has been created and your full access is active.</p>
  <p>Click below to set your password and get started:</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${setupUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Set Password &amp; Start Preparing</a>
  </div>
  <p style="font-size:13px;color:#64748b;">This link expires in 72 hours. Once you've set your password you can log in at <a href="${BASE_URL}/sign-in" style="color:#0d1f30;">${BASE_URL}/sign-in</a> any time.</p>
  <p style="font-size:13px;color:#64748b;">If you have any questions, reply to this email or use the chat on the site.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Buckinghamshire 11+ Preparation · Operated by Ianson Systems Limited</p>
</body>
</html>`;
  return sendEmail(email, "Your Bucks Plus Edge account is ready — set your password", html);
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Reset Your Password</h2>
  <p>We received a request to reset your password. Click the button below to choose a new one:</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${resetUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
  </div>
  <p style="font-size:13px;color:#64748b;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't change.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Buckinghamshire 11+ Preparation</p>
</body>
</html>`;

  return sendEmail(email, "Reset your Bucks 11 Plus Tests password", html);
}

export async function sendDiagnosticCompleteEmail(userId: string, sessionData: any) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";
  const forecast = sessionData.forecastScore || 0;
  const band = sessionData.band || "Not assessed";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Readiness Check Complete!</h2>
    <p>Great news — ${childName} has finished their readiness check.</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
      <p style="font-size:14px;color:#64748b;margin:0 0 4px;">Forecast Score</p>
      <p style="font-size:36px;font-weight:bold;color:#0d1f30;margin:0;">${forecast}</p>
      <p style="font-size:13px;color:#64748b;margin:4px 0 0;">${band}</p>
    </div>
    <p>Log in to see the full breakdown including section scores, pace analysis, and recommended focus areas.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/app" style="display:inline-block;background:#0d1f30;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Full Results</a>
    </div>
  `, userId, token);

  const sent = await sendEmail(user.email, `${childName}'s Readiness Check Results Are Ready`, html);
  await logEmailEvent(userId, "diagnostic_complete", sent ? "sent" : "failed", { forecastScore: forecast });
}

export async function sendNoDrillNudge(userId: string) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Time to Start Practising</h2>
    <p>It's been a few days since ${childName}'s readiness check — the best time to start targeted practice is now, while the results are fresh.</p>
    <p>Even 10 minutes of focused drill work can make a measurable difference. We've identified the areas that will have the biggest impact on ${childName}'s score.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/app/practice" style="display:inline-block;background:#0d1f30;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Start a Practice Drill</a>
    </div>
  `, userId, token);

  const sent = await sendEmail(user.email, `${childName}'s practice is waiting`, html);
  await logEmailEvent(userId, "no_drill_nudge", sent ? "sent" : "failed");
}

export async function sendUpgradeNudge(userId: string) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Ready for More?</h2>
    <p>You've had a chance to explore Bucks 11 Plus Tests with the free readiness check. Here's what unlocking full access gives ${childName}:</p>
    <ul style="padding-left:20px;">
      <li><strong>1,500+ targeted practice questions</strong> across VR, NVR, Maths & Comprehension</li>
      <li><strong>Full-length practice papers (50 questions)</strong> and full GL-style mock exams</li>
      <li><strong>Full readiness checks</strong> with detailed PDF reports</li>
      <li><strong>Progress tracking</strong> to see real improvement over time</li>
    </ul>
    <p>Bucks Plus Edge starts from <strong>£35/month</strong> (cancel any time) or <strong>£279/year</strong> — saving £141 vs monthly (34% off).</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/pricing" style="display:inline-block;background:#0d1f30;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Plans & Pricing</a>
    </div>
  `, userId, token);

  const sent = await sendEmail(user.email, "Unlock full 11+ preparation", html);
  await logEmailEvent(userId, "upgrade_nudge", sent ? "sent" : "failed");
}

export async function sendProgrammeNudge(userId: string) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Lock in 12 months for less</h2>
    <p>${childName} has been making great progress. Switching to the annual plan locks in a full year of access and saves £141 compared to staying on monthly (34% off).</p>
    <ul style="padding-left:20px;">
      <li><strong>12 months of full access</strong> — every feature, every question</li>
      <li><strong>Full-length practice papers (50 questions)</strong> and GL-style mock exams</li>
      <li><strong>Premium parent analytics</strong> and progress tracking across all sessions</li>
      <li><strong>PDF readiness reports</strong> and guided preparation roadmap</li>
    </ul>
    <p><strong>£279/year</strong> — equivalent to £23.25/month. Save £141 vs monthly billing (34% off).</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/pricing" style="display:inline-block;background:#0d1f30;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Switch to Annual — £279/year</a>
    </div>
  `, userId, token);

  const sent = await sendEmail(user.email, `Save £141 — switch ${childName} to annual access`, html);
  await logEmailEvent(userId, "programme_nudge", sent ? "sent" : "failed");
}

export async function runEmailTriggers() {
  if (!RESEND_API_KEY) {
    return;
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const allUsers = await db.select().from(users).where(
      and(
        eq(users.emailConsent, true),
        isNull(users.emailUnsubscribedAt)
      )
    );

    for (const user of allUsers) {
      if (!user.email) continue;

      const events = await db.select().from(emailEvents).where(eq(emailEvents.userId, user.id));
      const sentTypes = new Set(events.map(e => e.emailType));

      if (user.subscriptionTier === "free") {
        const accountAge = user.id ? new Date() : new Date();
        if (!sentTypes.has("upgrade_nudge")) {
          const sessions = await storage.getUserTestSessions(user.id);
          const hasCompletedDiag = sessions.some(s => s.completedAt);
          if (hasCompletedDiag) {
            await sendUpgradeNudge(user.id);
          }
        }
      }

      if (user.subscriptionTier === "pack12" || user.subscriptionTier === "pack12_family") {
        if (!sentTypes.has("programme_nudge")) {
          await sendProgrammeNudge(user.id);
        }
      }
    }
  } catch (err) {
    console.error("[Email] Trigger run failed:", err);
  }
}

import { db } from "./db";
import { users, emailEvents } from "@shared/schema";
import { eq, and, isNull, lt, sql } from "drizzle-orm";
import { storage } from "./storage";
import { getBaseUrl, RESEND_FROM_EMAIL, SUPPORT_EMAIL } from "./contactConfig";

/**
 * Mask an email address for log output. Keeps just enough information to
 * debug deliverability (first char of local part, full domain) while not
 * exposing the address itself in plaintext logs (GDPR Art. 5(1)(f)).
 *
 *   "alice@example.com"      -> "a***@example.com"
 *   "bob@bucks11plus.co.uk"  -> "b***@bucks11plus.co.uk"
 */
export function maskEmail(value: string | null | undefined): string {
  if (!value) return "<none>";
  const at = value.indexOf("@");
  if (at <= 0) return "<redacted>";
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

/**
 * Mask every email address found inside an arbitrary string. Used to
 * sanitize third-party response bodies (e.g. Resend error payloads) that
 * may echo recipient addresses back to us.
 */
const EMAIL_RX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
export function redactEmailsInText(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(EMAIL_RX, (m) => maskEmail(m));
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// EMAIL_SECRET protects HMAC-derived tokens for unsubscribe links and email
// verification. In production we refuse to boot without it so tokens are never
// predictable. In dev we fall back to a fixed string so local testing works.
const EMAIL_SECRET = (() => {
  const v = process.env.EMAIL_SECRET;
  if (v && v.length >= 16) return v;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "EMAIL_SECRET environment variable must be set (>=16 chars) in production. " +
      "It is used to derive HMAC tokens for unsubscribe and email-verification links.",
    );
  }
  console.warn(
    "[Email] EMAIL_SECRET not set — using insecure development fallback. " +
    "This is fine for local development but MUST be set as a Replit secret before deploying.",
  );
  return "dev-only-email-secret-do-not-use-in-prod";
})();

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
    console.log(`[Email] Skipping send (no RESEND_API_KEY): ${subject} → ${maskEmail(to)}`);
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
      console.error(`[Email] Resend error: ${res.status} ${redactEmailsInText(err)}`);
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
  const adminEmail = SUPPORT_EMAIL;
  const subject = `New Payment — ${maskEmail(data.userEmail)}`;

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

  console.log(`[GuideEmail] Attempting user email to ${maskEmail(email)}`);
  try {
    if (!RESEND_API_KEY) {
      console.log(`[GuideEmail] Skipping user email (no RESEND_API_KEY): ${maskEmail(email)}`);
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [email], subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[GuideEmail] User email send failed: ${res.status} — ${redactEmailsInText(body)}`);
    } else {
      console.log(`[GuideEmail] Guide download email sent to ${maskEmail(email)}`);
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
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [SUPPORT_EMAIL], subject, html }),
    });
    if (!res.ok) console.error(`[GuideEmail] Send failed: ${res.status}`);
    else console.log(`[GuideEmail] Admin notification sent for ${maskEmail(email)}`);
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
  const subject = `[Bucks 11 Plus Tests] New Purchase — ${maskEmail(email)}`;
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
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [SUPPORT_EMAIL], subject, html }),
    });
    if (!res.ok) console.error(`[PurchaseEmail] Send failed: ${res.status}`);
    else console.log(`[PurchaseEmail] Admin notification sent for ${maskEmail(email)}`);
  } catch (err) {
    console.error("[PurchaseEmail] Error:", err);
  }
}

const PURCHASE_PLAN_LABEL: Record<string, string> = {
  pack_plus: "Bucks Plus Edge — Monthly (£35/month)",
  pack_annual: "Bucks Plus Edge — Annual (£279/year)",
  pack_monthly: "Bucks Plus Edge — Monthly",
};

async function purchaseConfirmationAlreadySent(checkoutSessionId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: emailEvents.id })
    .from(emailEvents)
    .where(
      and(
        eq(emailEvents.emailType, "purchase_confirmation"),
        sql`${emailEvents.metadata}->>'checkoutSessionId' = ${checkoutSessionId}`,
      ),
    )
    .limit(1);
  return Boolean(row);
}

/** Customer-facing payment confirmation (distinct from admin-only purchase notification). */
export async function sendPurchaseConfirmationEmail(
  email: string,
  tier: string,
  options: { amountPence?: number; checkoutSessionId?: string; userId?: string } = {},
): Promise<boolean> {
  const { amountPence, checkoutSessionId, userId } = options;
  if (checkoutSessionId && (await purchaseConfirmationAlreadySent(checkoutSessionId))) {
    console.log(`[PurchaseConfirm] Already sent for session ${checkoutSessionId}`);
    return false;
  }

  const planName = PURCHASE_PLAN_LABEL[tier] || tier;
  const amountStr = amountPence != null ? `£${(amountPence / 100).toFixed(2)}` : null;
  const signInUrl = `${getBaseUrl()}/sign-in`;
  const accountUrl = `${getBaseUrl()}/app`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Payment confirmed — thank you</h2>
  <p>Your subscription to <strong>${planName}</strong> is active.</p>
  ${amountStr ? `<p><strong>Amount paid:</strong> ${amountStr}</p>` : ""}
  <p>You now have full access to Bucks Plus Edge — practice tests, parent insights, and targeted drills.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${accountUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Go to your dashboard</a>
  </div>
  <p style="font-size:13px;color:#64748b;">Sign in any time at <a href="${signInUrl}" style="color:#0d1f30;">${signInUrl}</a>. Manage billing from Account → Subscription.</p>
  <p style="font-size:13px;color:#64748b;">3-day money-back guarantee · Cancel anytime from your account.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Operated by Ianson Systems Limited</p>
</body>
</html>`;

  const sent = await sendEmail(email, `Payment confirmed — ${planName}`, html);
  if (sent) {
    await logEmailEvent(userId || `checkout:${checkoutSessionId || email}`, "purchase_confirmation", "sent", {
      checkoutSessionId,
      tier,
      amountPence,
    });
    console.log(`[PurchaseConfirm] Sent to ${maskEmail(email)}`);
  }
  return sent;
}

export async function sendSubscriptionCancelledAdminEmail(
  email: string,
  tier: string,
): Promise<void> {
  const subject = `[Bucks 11 Plus Tests] Subscription Cancelled — ${maskEmail(email)}`;
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
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [SUPPORT_EMAIL], subject, html }),
    });
    if (!res.ok) console.error(`[CancelEmail] Send failed: ${res.status}`);
    else console.log(`[CancelEmail] Admin notification sent for ${maskEmail(email)}`);
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

// ---------------------------------------------------------------------------
// Email verification (soft-block) — verifies the address belongs to the user
// who registered. Token is HMAC-derived from EMAIL_SECRET + userId so we don't
// need to persist it. Same pattern as the unsubscribe link.
// ---------------------------------------------------------------------------
export async function generateEmailVerifyToken(userId: string): Promise<string> {
  const crypto = await import("crypto");
  return crypto.createHmac("sha256", EMAIL_SECRET).update(`${userId}:verify`).digest("hex");
}

export async function sendEmailVerificationEmail(userId: string, email: string): Promise<boolean> {
  const token = await generateEmailVerifyToken(userId);
  const verifyUrl = `${BASE_URL}/api/email/verify?userId=${encodeURIComponent(userId)}&token=${token}`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Confirm your email address</h2>
  <p>Welcome to Bucks 11 Plus Tests! Please confirm this is your email so we can keep your account secure and make sure password-reset links can reach you if you ever need them.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${verifyUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Verify my email</a>
  </div>
  <p style="font-size:13px;color:#64748b;">You can keep using your account in the meantime — verifying just removes the reminder banner and protects you from anyone signing up with your address by mistake.</p>
  <p style="font-size:13px;color:#64748b;">If you didn't create an account, you can safely ignore this email.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Buckinghamshire 11+ Preparation · Operated by Ianson Systems Limited</p>
</body>
</html>`;
  return sendEmail(email, "Confirm your Bucks 11 Plus Tests email address", html);
}

// ---------------------------------------------------------------------------
// Retention warning — sent 30 days before automated deletion of dormant
// accounts. Always sent regardless of marketing-email preference because it
// is a transactional notice about the contract / account state.
// ---------------------------------------------------------------------------
export async function sendRetentionWarningEmail(email: string, lastLoginAt: Date): Promise<boolean> {
  const signInUrl = `${BASE_URL}/sign-in`;
  const lastLoginStr = lastLoginAt.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">Bucks 11 Plus Tests</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Your account will be deleted in 30 days</h2>
  <p>You haven't signed in to Bucks 11 Plus Tests since <strong>${lastLoginStr}</strong>. As described in our Privacy Policy, we automatically delete dormant accounts after 24 months of inactivity to keep our data footprint to the minimum we need.</p>
  <p><strong>If you'd like to keep your account, just sign in once in the next 30 days.</strong> That preserves everything we hold for you — child profiles, test sessions, answers and email history — and resets the dormancy clock.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${signInUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Sign in to keep my account</a>
  </div>
  <p style="font-size:13px;color:#64748b;">No action needed if you're done with us — your data will be permanently removed automatically. This is a one-off transactional notice and is sent regardless of your marketing-email preferences.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">Bucks 11 Plus Tests · Buckinghamshire 11+ Preparation · Operated by Ianson Systems Limited</p>
</body>
</html>`;
  return sendEmail(email, "Action needed: your Bucks 11 Plus Tests account will be deleted in 30 days", html);
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
  // Child first name is no longer stored server-side; emails refer to the
  // child generically to honour data minimisation.
  const childName = "your child";
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
  const childName = "your child";

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
  const childName = "your child";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Ready for More?</h2>
    <p>You've had a chance to explore Bucks 11 Plus Tests with the free readiness check. Here's what unlocking full access gives ${childName}:</p>
    <ul style="padding-left:20px;">
      <li><strong>2,500+ targeted practice questions</strong> across VR, NVR, Maths & Comprehension</li>
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
  const childName = "your child";

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

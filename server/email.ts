import { db } from "./db";
import { users, emailEvents } from "@shared/schema";
import { eq, and, isNull, lt, sql } from "drizzle-orm";
import { storage } from "./storage";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "11+ Standard <noreply@bucks11plustest.co.uk>";
const EMAIL_SECRET = process.env.EMAIL_SECRET || "11plus-email-secret";
const BASE_URL = process.env.BASE_URL || "https://bucks11plustest.co.uk";

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
    <strong style="font-size:18px;color:#0d1f30;">11+ Standard</strong>
  </div>
  ${body}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">
    You're receiving this because you opted in to emails from 11+ Standard.<br>
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

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <strong style="font-size:18px;color:#0d1f30;">11+ Standard</strong>
  </div>
  <h2 style="color:#0d1f30;margin-bottom:8px;">Reset Your Password</h2>
  <p>We received a request to reset your password. Click the button below to choose a new one:</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${resetUrl}" style="display:inline-block;background:#0d1f30;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
  </div>
  <p style="font-size:13px;color:#64748b;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't change.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;text-align:center;">11+ Standard · Buckinghamshire 11+ Preparation</p>
</body>
</html>`;

  return sendEmail(email, "Reset your 11+ Standard password", html);
}

export async function sendDiagnosticCompleteEmail(userId: string, sessionData: any) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";
  const forecast = sessionData.forecastScore || 0;
  const band = sessionData.band || "Not assessed";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Diagnostic Complete!</h2>
    <p>Great news — ${childName} has finished their diagnostic assessment.</p>
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

  const sent = await sendEmail(user.email, `${childName}'s Diagnostic Results Are Ready`, html);
  await logEmailEvent(userId, "diagnostic_complete", sent ? "sent" : "failed", { forecastScore: forecast });
}

export async function sendNoDrillNudge(userId: string) {
  const user = await storage.getUser(userId);
  if (!user || !user.email || !user.emailConsent || user.emailUnsubscribedAt) return;

  const token = await generateUnsubscribeToken(userId);
  const childName = user.childName || "your child";

  const html = wrapHtml(`
    <h2 style="color:#0d1f30;margin-bottom:8px;">Time to Start Practising</h2>
    <p>It's been a few days since ${childName}'s diagnostic — the best time to start targeted practice is now, while the results are fresh.</p>
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
    <p>You've had a chance to explore 11+ Standard with the free diagnostic. Here's what unlocking full access gives ${childName}:</p>
    <ul style="padding-left:20px;">
      <li><strong>1,600+ targeted practice questions</strong> across VR, NVR, Maths & Comprehension</li>
      <li><strong>Full timed diagnostics</strong> with detailed PDF reports</li>
      <li><strong>Progress tracking</strong> to see real improvement over time</li>
    </ul>
    <p>Plans start from <strong>£49</strong> for Early Learners (Year 4/5) and <strong>£119</strong> for the Practice Platform.</p>
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
    <h2 style="color:#0d1f30;margin-bottom:8px;">Take It Further</h2>
    <p>${childName} has been making great progress with the Practice Platform. The Young Scholar Programme takes preparation to the next level:</p>
    <ul style="padding-left:20px;">
      <li><strong>16-week structured roadmap</strong> with weekly plans</li>
      <li><strong>Test Day Simulator</strong> — 2-paper exam with timed break</li>
      <li><strong>Premium Parent Analytics</strong> — gap velocity, forecast stability</li>
      <li><strong>All 17 Hard drills</strong> unlocked</li>
    </ul>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/pricing" style="display:inline-block;background:#0d1f30;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Explore the Programme</a>
    </div>
  `, userId, token);

  const sent = await sendEmail(user.email, `${childName} is ready for the next level`, html);
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

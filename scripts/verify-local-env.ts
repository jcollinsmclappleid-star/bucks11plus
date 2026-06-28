#!/usr/bin/env npx tsx
import pg from "pg";
import Stripe from "stripe";

async function main() {
  const results: Array<{ name: string; ok: boolean; detail: string }> = [];

  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const r = await pool.query("SELECT count(*)::int AS c FROM questions");
    await pool.end();
    results.push({ name: "database", ok: true, detail: `${r.rows[0].c} questions` });
  } catch (e: any) {
    results.push({ name: "database", ok: false, detail: e.message });
  }

  const sk = process.env.STRIPE_SECRET_KEY || "";
  const pk = process.env.STRIPE_PUBLISHABLE_KEY || "";
  if (!sk.startsWith("sk_")) {
    results.push({ name: "stripe_secret", ok: false, detail: "missing or invalid format" });
  } else {
    try {
      const stripe = new Stripe(sk, { apiVersion: "2025-08-27.basil" });
      const acct = await stripe.accounts.retrieve();
      results.push({ name: "stripe_secret", ok: true, detail: `account ${acct.id}` });
    } catch (e: any) {
      results.push({ name: "stripe_secret", ok: false, detail: e.message });
    }
  }

  if (!pk.startsWith("pk_")) {
    results.push({
      name: "stripe_publishable",
      ok: true,
      detail: "not set (optional locally — checkout uses server-side Stripe)",
    });
  } else {
    results.push({ name: "stripe_publishable", ok: true, detail: `${pk.slice(0, 14)}...` });
  }

  const rk = process.env.RESEND_API_KEY || "";
  if (!rk.startsWith("re_")) {
    results.push({ name: "resend", ok: false, detail: "missing or invalid format" });
  } else {
    try {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${rk}` },
      });
      const body = await res.text();
      if (res.ok) {
        results.push({ name: "resend", ok: true, detail: "API key valid (full access)" });
      } else if (body.includes("restricted_api_key") || body.includes("only send emails")) {
        results.push({ name: "resend", ok: true, detail: "API key valid (send-only)" });
      } else {
        results.push({ name: "resend", ok: false, detail: `HTTP ${res.status}` });
      }
    } catch (e: any) {
      results.push({ name: "resend", ok: false, detail: e.message });
    }
  }

  console.log("Local env connectivity:\n");
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.name}: ${r.detail}`);
  }

  const webhook = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhook) {
    console.log("⚠ stripe_webhook: empty — auto-registered on boot via stripe-replit-sync (or use stripe listen locally)");
  } else {
    console.log(`✓ stripe_webhook: ${webhook.slice(0, 10)}...`);
  }

  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

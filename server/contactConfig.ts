export const SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  "support@11plustesthub.co.uk";

export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  `Bucks 11 Plus Tests <${process.env.RESEND_SENDER_EMAIL || SUPPORT_EMAIL}>`;

export function getBaseUrl(): string {
  const explicit = process.env.BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) return withHttps(vercelProductionUrl);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return withHttps(vercelUrl);

  const domains = process.env.REPLIT_DOMAINS || "";
  const parts = domains.split(",").map((d) => d.trim()).filter(Boolean);
  const customDomain = parts.find(
    (d) => d.includes(".co.uk") || (!d.includes("replit.app") && !d.includes("replit.dev")),
  );
  if (customDomain) return withHttps(customDomain);

  return "https://bucks11plustest.co.uk";
}

function withHttps(domainOrUrl: string): string {
  const value = domainOrUrl.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

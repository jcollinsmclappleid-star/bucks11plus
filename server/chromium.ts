import { exec } from "child_process";
import { promisify } from "util";
import { getBaseUrl } from "./contactConfig";

const execAsync = promisify(exec);
const isVercel = process.env.VERCEL === "1";

let _chromiumReady: Promise<void> | null = null;

async function installChromium(): Promise<void> {
  console.log("[Chrome] Verifying browser installation…");
  try {
    await execAsync("npx puppeteer browsers install chrome", { timeout: 120_000 });
    console.log("[Chrome] Browser ready");
  } catch (err: any) {
    console.error("[Chrome] Browser install failed — PDF endpoints may return 500:", err.message);
  }
}

export function ensureChromium(): Promise<void> {
  if (isVercel) return Promise.resolve();
  if (!_chromiumReady) {
    _chromiumReady = installChromium();
  }
  return _chromiumReady;
}

/** Base URL for Puppeteer to load print pages (must be reachable from the running server). */
export function getPdfRenderBaseUrl(): string {
  if (isVercel) {
    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "")}`;
  }
  const explicit = process.env.BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  return `http://localhost:${process.env.PORT || "5000"}`;
}

export function pdfCookieDomain(): string {
  try {
    return new URL(getPdfRenderBaseUrl()).hostname;
  } catch {
    return "localhost";
  }
}

const LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-first-run",
  "--no-zygote",
  "--single-process",
];

export async function launchBrowser() {
  await ensureChromium();

  if (isVercel) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: [...chromium.default.args, ...LAUNCH_ARGS],
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  }

  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: LAUNCH_ARGS,
  });
}

// Re-export for callers that only need public site URL in emails/links
export { getBaseUrl };

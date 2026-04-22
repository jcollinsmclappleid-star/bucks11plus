import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
  if (!_chromiumReady) {
    _chromiumReady = installChromium();
  }
  return _chromiumReady;
}

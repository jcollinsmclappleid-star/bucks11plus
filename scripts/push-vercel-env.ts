#!/usr/bin/env npx tsx
/**
 * Push all vars from production/secrets.env to Vercel (production + preview).
 * Usage: npx tsx scripts/push-vercel-env.ts
 */
import { readFileSync } from "fs";
import { spawnSync } from "child_process";

const SCOPE = "jcollinsmclappleid-stars-projects";
const ENV_FILE = "production/secrets.env";
const TARGETS = ["production", "preview"] as const;

function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.split("#")[0]?.trim() ?? "";
    if (!trimmed || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && val) out[key] = val;
  }
  return out;
}

function vercelEnvAdd(key: string, value: string, target: string): void {
  const result = spawnSync(
    "npx",
    ["vercel@latest", "env", "add", key, target, "--force", "--yes", "--scope", SCOPE],
    {
      input: value,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(`Failed to set ${key} (${target}): ${err}`);
  }
  console.log(`✓ ${key} → ${target}`);
}

const vars = parseEnvFile(ENV_FILE);

// NODE_ENV and PORT must not be set on Vercel — NODE_ENV=production during install
// skips devDependencies (tsx, vite) and breaks the build. Vercel sets NODE_ENV at runtime.
delete vars.NODE_ENV;
delete vars.PORT;

for (const target of TARGETS) {
  console.log(`\n── ${target} ──`);
  for (const [key, value] of Object.entries(vars)) {
    vercelEnvAdd(key, value, target);
  }
}

console.log("\nDone. Redeploy: npx vercel deploy --prod --yes --scope", SCOPE);

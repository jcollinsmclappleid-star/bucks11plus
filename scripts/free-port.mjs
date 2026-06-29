#!/usr/bin/env node
/**
 * Free the dev port before `npm run dev` (macOS AirPlay and stale node processes often hold :5000).
 */
import { readFileSync } from "fs";
import { spawnSync } from "child_process";

function readPort() {
  try {
    const env = readFileSync(".env.local", "utf8");
    const match = env.match(/^PORT=(\d+)/m);
    if (match) return Number(match[1]);
  } catch {
    // .env.local optional for this helper
  }
  return 3000;
}

const port = readPort();
const listed = spawnSync("lsof", ["-ti", `tcp:${port}`], { encoding: "utf8" });

if (listed.status === 0 && listed.stdout.trim()) {
  for (const pid of listed.stdout.trim().split("\n").filter(Boolean)) {
    const proc = spawnSync("ps", ["-p", pid, "-o", "comm="], { encoding: "utf8" });
    const name = (proc.stdout || "").trim();
    if (name.includes("node") || name.includes("tsx")) {
      spawnSync("kill", ["-9", pid]);
      console.log(`[dev] Freed port ${port} (stopped ${name} PID ${pid})`);
    } else {
      console.warn(`[dev] Port ${port} is in use by ${name || "unknown"} (PID ${pid}) — not killed`);
      console.warn(`[dev] Change PORT in .env.local or stop that process, then retry.`);
      process.exit(1);
    }
  }
}

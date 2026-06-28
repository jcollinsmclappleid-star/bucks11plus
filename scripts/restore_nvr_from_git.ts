/**
 * Restores NVR transformation + symmetry questions from git (direct copy, no regeneration).
 * Source: commit 0814b38 — last seed snapshot that included the full production NVR bank.
 *
 * Usage: npx tsx scripts/restore_nvr_from_git.ts
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const GIT_REF = "0814b38";
const SEED_PATH = path.resolve(process.cwd(), "scripts/questions.seed.json");
const RESTORE_TYPES = ["transformation", "symmetry"] as const;

type SeedRow = { type: string; [key: string]: unknown };

function loadGitSeed(): SeedRow[] {
  const raw = execSync(`git show ${GIT_REF}:scripts/questions.seed.json`, {
    encoding: "utf-8",
    maxBuffer: 200 * 1024 * 1024,
  });
  return JSON.parse(raw);
}

const gitSeed = loadGitSeed();
const fromGit = gitSeed.filter((q) => RESTORE_TYPES.includes(q.type as (typeof RESTORE_TYPES)[number]));

const byType: Record<string, number> = {};
for (const q of fromGit) {
  byType[q.type] = (byType[q.type] || 0) + 1;
}
console.log(`Git ${GIT_REF} NVR rows to restore:`, byType);

const current: SeedRow[] = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
const kept = current.filter((q) => !RESTORE_TYPES.includes(q.type as (typeof RESTORE_TYPES)[number]));
const merged = [...kept, ...fromGit];

fs.writeFileSync(SEED_PATH, JSON.stringify(merged, null, 2));
console.log(`Removed generated ${RESTORE_TYPES.join("/")} from current seed`);
console.log(`Written ${merged.length} total entries to ${SEED_PATH}`);

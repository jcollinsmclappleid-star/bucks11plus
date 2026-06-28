/**
 * Replaces generated NVR rows in the DB with the git-backed seed copy.
 * Usage: npx tsx --env-file=production/secrets.env scripts/reseed_nvr_from_seed.ts
 */
import { db } from "../server/db";
import { questions } from "../shared/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { ensureNvrGeneratorReseeds } from "../server/seed";

const TYPES = ["transformation", "symmetry"] as const;

async function main() {
  console.log("Deleting practice-pool transformation + symmetry (will re-insert from seed file)...");
  const deleted = await db
    .delete(questions)
    .where(
      and(
        inArray(questions.type, [...TYPES]),
        eq(questions.questionPool, "practice"),
      ),
    );
  console.log(`Deleted rows: ${(deleted as { rowCount?: number }).rowCount ?? "?"}`);

  console.log("Re-inserting from scripts/questions.seed.json...");
  await ensureNvrGeneratorReseeds();

  const counts = await db
    .select({ type: questions.type, c: sql<number>`count(*)::int` })
    .from(questions)
    .where(
      and(
        inArray(questions.type, [...TYPES]),
        eq(questions.qaStatus, "approved"),
      ),
    )
    .groupBy(questions.type);
  console.log("Approved counts after reseed:", counts);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

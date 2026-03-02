import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fix() {
  await db.update(questions).set({ section: "Verbal Reasoning" }).where(eq(questions.section, "verbal-reasoning"));
  console.log("Updated VR sections");
  process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });

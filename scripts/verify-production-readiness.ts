#!/usr/bin/env npx tsx
/**
 * Verifies question bank, diagnostics, env vars, and runs DB repairs.
 * Usage:
 *   npm run verify:prod
 *   npm run verify:prod -- --repair
 */
import { seedDatabase, ensureNvrGeneratorReseeds } from "../server/seed";
import {
  buildProductionReadinessReport,
  repairQuestionAlignment,
} from "../server/productionReadiness";

async function main() {
  const repair = process.argv.includes("--repair");

  console.log("═".repeat(60));
  console.log("  Bucks 11+ Production Readiness Check");
  console.log("═".repeat(60));

  if (repair) {
    console.log("\n→ Running DB repairs + seed pipeline...");
    await repairQuestionAlignment();
    await seedDatabase();
    await ensureNvrGeneratorReseeds();
    console.log("→ Repairs complete\n");
  }

  const report = await buildProductionReadinessReport();

  console.log("Questions:");
  console.log(`  Total:      ${report.questions.total}`);
  console.log(`  Approved:   ${report.questions.approved}`);
  console.log(`  Free pool:  ${report.questions.freePool}`);
  console.log(`  Practice:   ${report.questions.practicePool}`);
  console.log(`  Diagnostic: ${report.questions.diagnosticPool}`);
  console.log("  By section:", report.questions.bySection);

  console.log("\nDiagnostics:", report.diagnostics.found.join(", ") || "(none)");
  if (report.diagnostics.missing.length) {
    console.log("  MISSING:", report.diagnostics.missing.join(", "));
  }

  console.log(`\nDrill sections: ${report.drills.count}`);
  console.log(`mini-1 fixed questions: ${report.miniDiagnostic.loaded}/12`);

  console.log("\nEnvironment:");
  for (const [k, v] of Object.entries(report.env)) {
    console.log(`  ${v ? "✓" : "✗"} ${k}`);
  }

  if (report.warnings.length) {
    console.log("\nWarnings:");
    report.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }

  if (report.issues.length) {
    console.log("\nIssues (must fix before launch):");
    report.issues.forEach((i) => console.log(`  ✗ ${i}`));
  }

  console.log("\n" + "═".repeat(60));
  console.log(report.ok ? "  READY FOR PRODUCTION" : "  NOT READY — fix issues above");
  console.log("═".repeat(60));

  process.exit(report.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

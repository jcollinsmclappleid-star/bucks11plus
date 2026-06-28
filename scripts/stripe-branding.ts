#!/usr/bin/env npx tsx
/**
 * Apply Bucks 11 Plus Tests branding to the Stripe account (logo, colours, public name).
 * Usage: npm run stripe:branding
 */
import { ensureStripeBranding } from "../server/stripeBranding";

const force = process.argv.includes("--force");

ensureStripeBranding(force)
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

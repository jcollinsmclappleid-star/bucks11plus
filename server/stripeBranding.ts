import fs from "fs";
import path from "path";
import type Stripe from "stripe";
import { getUncachableStripeClient } from "./stripeClient";
import { getBaseUrl, SUPPORT_EMAIL } from "./contactConfig";

export const STRIPE_DISPLAY_NAME = "Bucks 11 Plus Tests";
const STRIPE_PRIMARY_COLOR = "#1e3a6e";
const STRIPE_SECONDARY_COLOR = "#f59e0b";
const STATEMENT_DESCRIPTOR = "BUCKS 11PLUS TESTS";

let brandingPromise: Promise<void> | null = null;

function resolveLogoPath(): string | null {
  const candidates = [
    path.join(process.cwd(), "client/public/logo-shield-sm.png"),
    path.join(process.cwd(), "dist/public/logo-shield-sm.png"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

async function uploadBrandingFile(stripe: Stripe, logoPath: string, purpose: "business_logo" | "business_icon") {
  const data = fs.readFileSync(logoPath);
  return stripe.files.create({
    purpose,
    file: {
      data,
      name: path.basename(logoPath),
      type: "image/png",
    },
  });
}

export function checkoutBrandingExtras(): Pick<Stripe.Checkout.SessionCreateParams, "custom_text"> {
  return {
    custom_text: {
      submit: {
        message: `Secure subscription to ${STRIPE_DISPLAY_NAME}`,
      },
    },
  };
}

export function scheduleStripeBranding(): void {
  void ensureStripeBranding().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[Stripe Branding] Skipped:", message);
  });
}

export async function ensureStripeBranding(force = false): Promise<void> {
  if (!force && brandingPromise) return brandingPromise;

  brandingPromise = (async () => {
    console.log("[Stripe Branding] Starting…");
    const stripe = await getUncachableStripeClient();
    console.log("[Stripe Branding] Fetching account…");
    const account = await stripe.accounts.retrieve();
    const logoPath = resolveLogoPath();

    const businessProfile = account.business_profile;
    const branding = account.settings?.branding;
    const descriptor = account.settings?.payments?.statement_descriptor;

    const nameOk = businessProfile?.name === STRIPE_DISPLAY_NAME;
    const urlOk = businessProfile?.url === getBaseUrl();
    const logoOk = Boolean(branding?.logo);
    const iconOk = Boolean(branding?.icon);
    const colorOk = branding?.primary_color?.toLowerCase() === STRIPE_PRIMARY_COLOR;
    const descriptorOk = descriptor === STATEMENT_DESCRIPTOR;

    if (!force && nameOk && urlOk && logoOk && iconOk && colorOk && descriptorOk) {
      console.log("[Stripe Branding] Already configured");
      return;
    }

    const updates: Stripe.AccountUpdateParams = {
      business_profile: {
        name: STRIPE_DISPLAY_NAME,
        url: getBaseUrl(),
        support_email: SUPPORT_EMAIL,
      },
      settings: {
        branding: {
          primary_color: STRIPE_PRIMARY_COLOR,
          secondary_color: STRIPE_SECONDARY_COLOR,
        },
        payments: {
          statement_descriptor: STATEMENT_DESCRIPTOR,
        },
      },
    };

    if (logoPath) {
      if (!logoOk || force) {
        const logoFile = await uploadBrandingFile(stripe, logoPath, "business_logo");
        updates.settings!.branding!.logo = logoFile.id;
        console.log("[Stripe Branding] Uploaded logo");
      }
      if (!iconOk || force) {
        const iconFile = await uploadBrandingFile(stripe, logoPath, "business_icon");
        updates.settings!.branding!.icon = iconFile.id;
        console.log("[Stripe Branding] Uploaded icon");
      }
    } else {
      console.warn("[Stripe Branding] Logo file not found — skipping image upload");
    }

    await stripe.accounts.update(account.id, updates);
    console.log(`[Stripe Branding] Account updated: ${STRIPE_DISPLAY_NAME} · ${getBaseUrl()}`);
  })().catch((err) => {
    brandingPromise = null;
    throw err;
  });

  return brandingPromise;
}

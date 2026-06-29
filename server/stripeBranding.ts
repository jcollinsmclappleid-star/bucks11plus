import type Stripe from "stripe";
import { getUncachableStripeClient } from "./stripeClient";
import { getBaseUrl } from "./contactConfig";

export const STRIPE_DISPLAY_NAME = "Bucks 11 Plus Tests";
const STRIPE_PRIMARY_COLOR = "#1e3a6e";
const STATEMENT_DESCRIPTOR = "BUCKS 11PLUS TESTS";

let brandingPromise: Promise<void> | null = null;

function checkoutLogoUrl(): string {
  return `${getBaseUrl()}/logo-shield-sm.png`;
}

/** Per-session Checkout branding (works on standard Stripe accounts). */
export function checkoutBrandingExtras(): Pick<
  Stripe.Checkout.SessionCreateParams,
  "custom_text" | "branding_settings"
> {
  const logoUrl = checkoutLogoUrl();
  return {
    branding_settings: {
      display_name: STRIPE_DISPLAY_NAME,
      button_color: STRIPE_PRIMARY_COLOR,
      logo: { type: "url", url: logoUrl },
      icon: { type: "url", url: logoUrl },
    },
    custom_text: {
      submit: {
        message: `Secure subscription to ${STRIPE_DISPLAY_NAME}`,
      },
      after_submit: {
        message: `${STRIPE_DISPLAY_NAME} is operated by Ianson Systems Limited. Manage your subscription anytime from your account.`,
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

/**
 * Standard Stripe accounts cannot update branding via accounts.update (Connect-only).
 * Checkout uses per-session branding_settings; this logs dashboard gaps for receipts/invoices.
 */
export async function ensureStripeBranding(_force = false): Promise<void> {
  if (brandingPromise) return brandingPromise;

  brandingPromise = (async () => {
    const stripe = await getUncachableStripeClient();
    const account = await stripe.accounts.retrieve();
    const businessProfile = account.business_profile;
    const branding = account.settings?.branding;
    const descriptor = account.settings?.payments?.statement_descriptor;

    const nameOk = businessProfile?.name === STRIPE_DISPLAY_NAME;
    const logoOk = Boolean(branding?.logo);
    const descriptorOk = descriptor === STATEMENT_DESCRIPTOR;

    if (nameOk && logoOk && descriptorOk) {
      console.log("[Stripe Branding] Dashboard branding looks good");
      return;
    }

    const gaps: string[] = [];
    if (!nameOk) {
      gaps.push(`Public business name → "${STRIPE_DISPLAY_NAME}" (currently "${businessProfile?.name ?? "unset"}")`);
    }
    if (!logoOk) {
      gaps.push(`Branding logo → upload ${checkoutLogoUrl()}`);
    }
    if (!descriptorOk) {
      gaps.push(`Statement descriptor → "${STATEMENT_DESCRIPTOR}"`);
    }

    console.log(
      `[Stripe Branding] Checkout sessions use "${STRIPE_DISPLAY_NAME}" + shield logo. ` +
        `Optional Stripe Dashboard updates: ${gaps.join("; ")}`,
    );
  })().catch((err) => {
    brandingPromise = null;
    throw err;
  });

  return brandingPromise;
}

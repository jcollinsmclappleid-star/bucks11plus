/**
 * Lazy loader for Google Ads / gtag.
 *
 * IMPORTANT: This script transfers the visitor's IP address to Google in the US,
 * so under UK GDPR + PECR it must NOT be loaded until the visitor has given
 * affirmative consent. The CookieConsent component is responsible for calling
 * `loadGtag()` only after consent has been granted.
 */

const GTAG_ID = "AW-18074811441";
let gtagLoaded = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function loadGtag(): void {
  if (gtagLoaded) return;
  if (typeof window === "undefined") return;
  gtagLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GTAG_ID, { anonymize_ip: true });
}

export const COOKIE_CONSENT_KEY = "b11p-cookie-consent-v1";

export type CookieConsentValue = "accepted" | "rejected";

export function readStoredConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
    return null;
  } catch {
    return null;
  }
}

export function storeConsent(v: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, v);
  } catch {
    /* ignore — consent simply won't persist if storage is blocked */
  }
}

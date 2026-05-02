import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadGtag, readStoredConsent, storeConsent } from "../../lib/analytics";

/**
 * UK GDPR + PECR-compliant cookie banner.
 *
 *  - Defaults to NO consent: gtag does not load until the user clicks Accept.
 *  - Both Accept and Reject are equally prominent.
 *  - The decision is stored in localStorage so we never re-prompt unnecessarily.
 *  - On every page load, if a previous Accept exists, we eagerly load gtag.
 */
export function CookieConsent() {
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    setDecision(stored);
    setMounted(true);
    if (stored === "accepted") {
      loadGtag();
    }
  }, []);

  if (!mounted || decision !== null) return null;

  const accept = () => {
    storeConsent("accepted");
    loadGtag();
    setDecision("accepted");
  };

  const reject = () => {
    storeConsent("rejected");
    setDecision("rejected");
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-2xl"
      data-testid="banner-cookie-consent"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="text-sm text-slate-700 leading-relaxed flex-1">
          <p className="font-semibold text-primary mb-1">We use cookies</p>
          <p>
            We use essential cookies to keep you signed in. With your permission, we'd also like to use Google
            analytics &amp; advertising cookies to understand how the site is used and measure ad performance. You
            can change your mind at any time.{" "}
            <Link href="/legal/privacy" className="underline text-primary hover:text-primary/80" data-testid="link-cookie-privacy">
              Read our Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            data-testid="button-cookie-reject"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            data-testid="button-cookie-accept"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

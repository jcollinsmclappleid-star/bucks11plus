import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadGtag, readStoredConsent, storeConsent } from "../../lib/analytics";

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
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-[100] sm:max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl"
      data-testid="banner-cookie-consent"
    >
      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-[13px] text-slate-700 leading-snug mb-3">
          We use cookies to keep you signed in and, with your permission, to measure site usage.{" "}
          <Link href="/legal/privacy" className="underline text-primary hover:text-primary/80" data-testid="link-cookie-privacy">
            Privacy
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reject}
            className="flex-1 px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            data-testid="button-cookie-reject"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            data-testid="button-cookie-accept"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

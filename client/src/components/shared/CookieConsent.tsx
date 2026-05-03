import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadGtag, readStoredConsent, storeConsent } from "../../lib/analytics";

export function CookieConsent() {
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
        <p className="text-[13px] text-slate-700 leading-snug mb-2">
          We use cookies to keep you signed in and, with your permission, to measure site usage.{" "}
          <Link href="/privacy" className="underline text-primary hover:text-primary/80" data-testid="link-cookie-privacy">
            Privacy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-slate-500 underline hover:text-slate-700 mb-2"
          data-testid="button-cookie-info-toggle"
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "What are cookies?"}
        </button>
        {expanded && (
          <div className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 rounded-md p-2.5 mb-3 space-y-1.5" data-testid="cookie-info-panel">
            <p>
              Cookies are small text files stored by your browser. We use two kinds:
            </p>
            <p>
              <strong className="text-slate-700">Essential cookies</strong> keep you signed in and remember your session. These are required for the site to work and run regardless of your choice.
            </p>
            <p>
              <strong className="text-slate-700">Analytics &amp; advertising cookies</strong> (Google Analytics, Google Ads) help us measure which pages help families and improve the service. These only run if you click <em>Accept</em>. Choosing <em>Reject</em> blocks them entirely — no tracking script is loaded.
            </p>
            <p>
              We never use cookies to profile children or to target advertising at children.
            </p>
          </div>
        )}
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

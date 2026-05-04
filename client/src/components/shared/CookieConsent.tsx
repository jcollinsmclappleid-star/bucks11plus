import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { loadGtag, readStoredConsent, storeConsent } from "../../lib/analytics";
import { X } from "lucide-react";

export function CookieConsent() {
  const [location] = useLocation();
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
  if (location === "/practice-paper-print" || location === "/practice-paper-print-2") return null;

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
      className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900/95 backdrop-blur-sm border-t border-white/10"
      data-testid="banner-cookie-consent"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="text-[12px] text-white/70 leading-snug flex-1 min-w-[200px]">
          We use cookies to keep you signed in and, with your permission, to measure site usage.{" "}
          <Link href="/privacy" className="underline text-white/50 hover:text-white/80" data-testid="link-cookie-privacy">
            Privacy policy
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="px-3 py-1.5 rounded-md border border-white/20 text-white/60 text-[11px] font-medium hover:bg-white/10 transition-colors"
            data-testid="button-cookie-reject"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-1.5 rounded-md bg-amber-400 text-amber-950 text-[11px] font-bold hover:bg-amber-300 transition-colors"
            data-testid="button-cookie-accept"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={reject}
            aria-label="Dismiss"
            className="p-1 text-white/30 hover:text-white/60 transition-colors ml-1"
            data-testid="button-cookie-dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

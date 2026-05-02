import { useState } from "react";
import { useAuth } from "@/lib/auth";

const DISMISS_KEY = "verifyBannerDismissed";

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  if (user.emailVerified) return null;
  if (dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/email/verify/resend", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Couldn't send the email. Please try again in a few minutes.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
    setDismissed(true);
  };

  return (
    <div
      data-testid="banner-email-verify"
      role="status"
      className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3"
    >
      <div className="container mx-auto max-w-6xl flex flex-wrap items-center gap-3 text-sm">
        <span className="flex-1 min-w-[200px]" data-testid="text-verify-message">
          {sent
            ? "Verification email sent. Check your inbox (and spam folder)."
            : "Please verify your email address — it keeps your account secure and ensures password-reset emails can reach you."}
        </span>
        {!sent && (
          <button
            type="button"
            data-testid="button-resend-verify"
            onClick={handleResend}
            disabled={sending}
            className="px-3 py-1.5 rounded-md bg-amber-900 text-amber-50 text-xs font-semibold hover:bg-amber-800 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend email"}
          </button>
        )}
        <button
          type="button"
          data-testid="button-dismiss-verify"
          onClick={handleDismiss}
          aria-label="Dismiss for this session"
          className="px-2 py-1 text-xs text-amber-800 hover:text-amber-950 underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
        {error && (
          <p data-testid="text-verify-error" className="basis-full text-xs text-red-700">{error}</p>
        )}
      </div>
    </div>
  );
}

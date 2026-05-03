import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Download, CheckCircle2, Loader2, FileText, ArrowDownToLine } from "lucide-react";

type Props = {
  source?: string;
  variant?: "default" | "compact";
};

export function LeadMagnetBlock({ source = "seo", variant = "default" }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async (emailValue: string) => {
      const res = await fetch("/api/leads/practice-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, source }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Could not send. Please try again.");
      }
      return res.json();
    },
    onSuccess: () => {
      setSent(true);
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  if (variant === "compact") {
    return (
      <div className="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-5" data-testid="lead-magnet-compact">
        {sent ? (
          <div className="flex items-center gap-3" data-testid="text-lead-magnet-success">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-slate-700">
              <strong>Sent!</strong> Check your inbox for the download link.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-3">
              <FileText className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Free Bucks 11+ Practice Paper</p>
                <p className="text-xs text-slate-600">12 GL-style questions with worked answers · A4 PDF</p>
              </div>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) submit.mutate(email.trim());
              }}
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
                disabled={submit.isPending}
                required
                data-testid="input-lead-magnet-email-compact"
              />
              <Button type="submit" disabled={submit.isPending || !email.trim()} data-testid="button-lead-magnet-submit-compact">
                {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </form>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="not-prose my-12 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-amber-100/40 p-6 md:p-8"
      data-testid="lead-magnet-block"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="h-12 w-12 rounded-xl bg-amber-200/60 flex items-center justify-center shrink-0">
          <FileText className="h-6 w-6 text-amber-800" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-primary font-serif mb-1">
            Free Bucks 11+ Practice Paper
          </h3>
          <p className="text-sm text-slate-600">
            12 GL-style questions across all four sections — Verbal Reasoning, Maths, Non-Verbal Reasoning and English Comprehension — with worked answers and explanations. A4 PDF, ready to print.
          </p>
        </div>
      </div>

      {sent ? (
        <div
          className="flex items-center gap-3 bg-white rounded-xl p-4 border border-emerald-200"
          data-testid="text-lead-magnet-block-success"
        >
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900 text-sm">Your practice paper is on its way</p>
            <p className="text-xs text-slate-600">Check your inbox in the next minute or two — including spam, just in case.</p>
          </div>
        </div>
      ) : (
        <>
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) submit.mutate(email.trim());
            }}
          >
            <Input
              type="email"
              placeholder="parent@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white h-11 flex-1"
              disabled={submit.isPending}
              required
              data-testid="input-lead-magnet-email"
            />
            <Button
              type="submit"
              size="lg"
              disabled={submit.isPending || !email.trim()}
              className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              data-testid="button-lead-magnet-submit"
            >
              {submit.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" /> Email me the paper
                </>
              )}
            </Button>
          </form>
          {error && <p className="text-sm text-red-600 mt-2" data-testid="text-lead-magnet-error">{error}</p>}
          <p className="text-[11px] text-slate-500 mt-3">
            We'll email you the practice paper plus occasional Bucks 11+ tips. Unsubscribe in one click.
          </p>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Prefer not to share your email?{" "}
            <a
              href="/api/practice-paper/download"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-slate-500 hover:text-slate-700 inline-flex items-center gap-0.5"
              data-testid="link-lead-magnet-direct-download"
            >
              <ArrowDownToLine className="h-3 w-3" /> Download directly
            </a>
          </p>
        </>
      )}
    </div>
  );
}

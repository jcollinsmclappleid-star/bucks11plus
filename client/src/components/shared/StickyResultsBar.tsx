import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Bookmark } from "lucide-react";

type Props = { sessionId: string };

export function StickyResultsBar({ sessionId }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 border-t border-amber-200 bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      data-testid="sticky-results-bar"
      role="region"
      aria-label="Save your results"
    >
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Bookmark className="h-4 w-4 text-amber-700" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight">Save these results</p>
            <p className="text-xs text-slate-600 leading-tight">Closing this tab will delete them.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            size="sm"
            className="h-9 px-3 sm:px-4 font-semibold whitespace-nowrap"
            data-testid="button-sticky-save-results"
          >
            <Link href={`/sign-up?guestSession=${sessionId}`}>
              Save free <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="h-9 w-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
            aria-label="Dismiss save bar"
            data-testid="button-sticky-dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

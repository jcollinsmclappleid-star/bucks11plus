import { Link } from "wouter";
import { Lock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LockedOverlayProps {
  children: React.ReactNode;
  section: string;
  requiredTier?: "any" | "pack12" | "programme16";
  loggedIn?: boolean;
}

const tierInfo: Record<string, { name: string; price: string }> = {
  any: { name: "any package", price: "" },
  pack12: { name: "Practice Platform", price: "from £59.99/mo" },
  programme16: { name: "Programme+", price: "£349 one-time" },
};

export default function LockedOverlay({ children, section, requiredTier = "any", loggedIn = false }: LockedOverlayProps) {
  const info = tierInfo[requiredTier] || tierInfo.any;
  const [dismissed, setDismissed] = useState(false);

  const bannerText = loggedIn
    ? requiredTier === "any"
      ? `${section} requires an account upgrade.`
      : `${section} is included with the ${info.name}${info.price ? ` — ${info.price}` : ""}.`
    : requiredTier === "any"
      ? `You're previewing ${section}. Sign in or take the free diagnostic to get started.`
      : `${section} is included with the ${info.name}${info.price ? ` (${info.price})` : ""}.`;

  return (
    <div className="relative">
      {!dismissed && (
        <div className="sticky top-16 z-30 bg-primary/95 text-primary-foreground backdrop-blur-sm shadow-md" data-testid={`banner-locked-${section}`}>
          <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="h-4 w-4 shrink-0 opacity-80" />
              <p className="text-sm font-medium truncate">{bannerText}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {loggedIn ? (
                <Button size="sm" variant="secondary" asChild data-testid={`button-banner-upgrade-${section}`}>
                  <Link href="/pricing">
                    View Plans <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="secondary" asChild data-testid={`button-banner-diagnostic-${section}`}>
                    <Link href="/free-diagnostic">
                      Free Diagnostic <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild data-testid={`button-banner-pricing-${section}`}>
                    <Link href="/pricing">Packages</Link>
                  </Button>
                </>
              )}
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded-md text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label="Dismiss banner"
                data-testid={`button-dismiss-banner-${section}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

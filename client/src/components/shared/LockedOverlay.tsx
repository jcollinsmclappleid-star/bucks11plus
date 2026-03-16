import { Link } from "wouter";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedOverlayProps {
  children: React.ReactNode;
  section: string;
  requiredTier?: "any" | "pack12" | "programme16";
}

const tierInfo: Record<string, { name: string; price: string; tier: string }> = {
  any: { name: "any package", price: "", tier: "" },
  pack12: { name: "Practice Platform", price: "£119", tier: "pack12" },
  programme16: { name: "Young Scholar Programme", price: "£249", tier: "programme16" },
};

export default function LockedOverlay({ children, section, requiredTier = "any" }: LockedOverlayProps) {
  const info = tierInfo[requiredTier] || tierInfo.any;

  return (
    <div className="relative min-h-[60vh]">
      <div className="opacity-30 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-20 flex items-center justify-center">
        <div className="text-center max-w-lg px-6 py-12 space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary/60" />
          </div>
          <h2 className="text-2xl font-bold text-primary font-serif" data-testid={`text-locked-${section}`}>
            {section}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {requiredTier === "any"
              ? "Take the free diagnostic first, then purchase a package to unlock this section and start practising."
              : `This section is included with the ${info.name}${info.price ? ` (${info.price})` : ""}. Purchase to unlock full access.`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild data-testid={`button-locked-diagnostic-${section}`}>
              <Link href="/free-diagnostic">
                Start Free Diagnostic <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid={`button-locked-pricing-${section}`}>
              <Link href="/pricing">View Packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

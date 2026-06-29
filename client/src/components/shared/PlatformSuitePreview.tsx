import { ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PracticeDrillsPanel, PracticePapersPanel, PracticeTestsPanel } from "./PlatformSuitePanels";

type PlatformSuitePreviewProps = {
  showScrollHint?: boolean;
  className?: string;
  /** Tighter layout for learn pages — outer container scrolls instead of each panel. */
  compact?: boolean;
};

export function PlatformSuitePreview({ showScrollHint = true, className, compact = false }: PlatformSuitePreviewProps) {
  return (
    <div className={cn("w-full space-y-3", className)} data-testid="platform-suite-preview">
      {showScrollHint && (
        <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 text-center">
          <p className="text-sm font-semibold text-primary flex items-center justify-center gap-2 flex-wrap">
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0 animate-bounce" />
            {compact
              ? "Scroll this panel to explore practice tests, papers, and drills"
              : "Scroll inside each panel below to explore practice tests, practice papers, and the full drill library"}
            <ChevronsDown className="h-4 w-4 text-primary/60 shrink-0 animate-bounce" />
          </p>
          <p className="text-xs text-slate-500 mt-1">46 drills · 2,500+ GL-style questions · unlimited practice papers</p>
        </div>
      )}
      <PracticeTestsPanel compact={compact} />
      <PracticePapersPanel compact={compact} />
      <PracticeDrillsPanel compact={compact} />
    </div>
  );
}

export { PracticeTestsPanel, PracticePapersPanel, PracticeDrillsPanel, ParentInsightsPanel } from "./PlatformSuitePanels";

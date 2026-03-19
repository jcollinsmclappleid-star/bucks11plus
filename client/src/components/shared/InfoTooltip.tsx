import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-flex items-center cursor-help ml-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            tabIndex={0}
          >
            <Info className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] text-xs leading-relaxed font-normal bg-popover text-popover-foreground border shadow-md">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

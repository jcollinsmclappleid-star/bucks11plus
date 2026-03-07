import { useState } from "react";
import type { SvgFrame } from "@shared/contentTypes";
import { optionBorderDefault, optionBorderSelected, optionBorderHover, optionBgDefault, optionBgSelected, optionBgHover, examCardShadow, examCardShadowHover } from "@shared/style";
import SvgFrameView from "./SvgFrameView";

const LABELS = ["A", "B", "C", "D", "E", "F"];

interface SvgOptionGridProps {
  options: SvgFrame[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function SvgOptionGrid({ options, selectedIndex, onSelect }: SvgOptionGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto" data-testid="svg-option-grid">
      {options.map((frame, i) => {
        const selected = selectedIndex === i;
        const hovered = hoveredIndex === i && !selected;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Option ${LABELS[i]}`}
            data-testid={`svg-option-${LABELS[i]}`}
            onClick={() => onSelect(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative rounded-xl p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            style={{
              border: `2px solid ${selected ? optionBorderSelected : hovered ? optionBorderHover : optionBorderDefault}`,
              backgroundColor: selected ? optionBgSelected : hovered ? optionBgHover : optionBgDefault,
              boxShadow: selected ? examCardShadowHover : hovered ? examCardShadowHover : examCardShadow,
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <span
              className="absolute top-1.5 left-2.5 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
              style={{
                backgroundColor: selected ? "#1E3A5F" : "#F1F5F9",
                color: selected ? "#FFFFFF" : "#64748B",
                transition: "all 0.2s ease",
              }}
            >
              {LABELS[i]}
            </span>
            <div className="mt-1">
              <SvgFrameView frame={frame} className="w-full h-auto" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

import type { SvgFrame } from "@shared/contentTypes";
import { optionBorderDefault, optionBorderSelected, optionBgSelected, examCardBg } from "@shared/style";
import SvgFrameView from "./SvgFrameView";

const LABELS = ["A", "B", "C", "D", "E", "F"];

interface SvgOptionGridProps {
  options: SvgFrame[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function SvgOptionGrid({ options, selectedIndex, onSelect }: SvgOptionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto" data-testid="svg-option-grid">
      {options.map((frame, i) => {
        const selected = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Option ${LABELS[i]}`}
            data-testid={`svg-option-${LABELS[i]}`}
            onClick={() => onSelect(i)}
            className="relative rounded-lg p-3 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              border: `2px solid ${selected ? optionBorderSelected : optionBorderDefault}`,
              backgroundColor: selected ? optionBgSelected : examCardBg,
            }}
          >
            <span className="absolute top-1 left-2 text-xs font-semibold text-gray-500">
              {LABELS[i]}
            </span>
            <SvgFrameView frame={frame} className="w-full h-auto" />
          </button>
        );
      })}
    </div>
  );
}

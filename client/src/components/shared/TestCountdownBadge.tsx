import { Calendar } from "lucide-react";
import { getWeeksToTest, getTestYear } from "@/lib/testDate";

type Variant = "light" | "dark" | "amber" | "subtle";

type Props = {
  variant?: Variant;
  className?: string;
  prefix?: string;
};

const STYLES: Record<Variant, string> = {
  light: "bg-amber-50 text-amber-800 border-amber-200",
  dark: "bg-amber-400/10 text-amber-200 border-amber-300/30",
  amber: "bg-amber-100 text-amber-900 border-amber-300",
  subtle: "bg-slate-50 text-slate-700 border-slate-200",
};

export function TestCountdownBadge({ variant = "light", className = "", prefix = "~" }: Props) {
  const weeks = getWeeksToTest();
  const year = getTestYear();
  if (weeks <= 0) return null;
  const weekLabel = weeks === 1 ? "week" : "weeks";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STYLES[variant]} ${className}`}
      data-testid="badge-test-countdown"
    >
      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
      {prefix}{weeks} {weekLabel} to September {year} test day
    </span>
  );
}

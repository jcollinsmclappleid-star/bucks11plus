import { Calendar } from "lucide-react";
import { getEarlyPrepTestYear, getTestYear, getWeeksToTest } from "@/lib/testDate";

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
  const earlyPrepYear = getEarlyPrepTestYear();
  if (weeks <= 0) return null;
  const weekLabel = weeks === 1 ? "week" : "weeks";
  const showImminentCountdown = year < earlyPrepYear;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STYLES[variant]} ${className}`}
      data-testid="badge-test-countdown"
    >
      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
      {showImminentCountdown ? (
        <>
          {prefix}
          {weeks} {weekLabel} to September {year} test day
        </>
      ) : (
        <>
          {prefix}
          {weeks} {weekLabel} to September {year} test
        </>
      )}
    </span>
  );
}

export function PrepYearBadge({ variant = "light", className = "" }: Pick<Props, "variant" | "className">) {
  const year = getEarlyPrepTestYear();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STYLES[variant]} ${className}`}
      data-testid="badge-prep-year"
    >
      Start preparing for September {year} test
    </span>
  );
}

type BannerProps = {
  className?: string;
};

export function PrepUrgencyBanner({ className = "" }: BannerProps) {
  const weeks = getWeeksToTest();
  const imminentYear = getTestYear();
  const earlyPrepYear = getEarlyPrepTestYear();
  const weekLabel = weeks === 1 ? "week" : "weeks";
  const showImminentCountdown = weeks > 0 && imminentYear < earlyPrepYear;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center text-xs sm:text-sm font-semibold ${className}`}
      data-testid="banner-prep-urgency"
    >
      <span>Start preparing for September {earlyPrepYear} test</span>
      {showImminentCountdown && (
        <>
          <span className="hidden sm:inline opacity-50">·</span>
          <span>
            <span className="font-bold">{weeks} {weekLabel}</span> to September {imminentYear} test day
          </span>
        </>
      )}
    </div>
  );
}

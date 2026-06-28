import { Link } from "wouter";
import { ClipboardCheck, Layers, BarChart3, ArrowRight } from "lucide-react";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PRACTICE_PAPERS_NAV_LABEL,
  platformPath,
} from "@/lib/marketing";

type HeroQuickLinksProps = {
  variant?: "dark" | "light";
  className?: string;
};

const links = [
  {
    href: FREE_PRACTICE_TEST_PATH,
    icon: ClipboardCheck,
    title: FREE_PRACTICE_TEST_CTA,
    desc: "12 questions · 8 minutes · no account",
    accent: "text-emerald-400",
    testId: "hero-quick-free-test",
  },
  {
    href: platformPath("practicePapers"),
    icon: Layers,
    title: PRACTICE_PAPERS_NAV_LABEL,
    desc: "Browse mocks, papers & 2,500+ drills",
    accent: "text-amber-400",
    testId: "hero-quick-practice-papers",
  },
  {
    href: platformPath("parentDashboard"),
    icon: BarChart3,
    title: "Parent Dashboard",
    desc: "See example 121-scale scores",
    accent: "text-sky-400",
    testId: "hero-quick-dashboard",
  },
] as const;

export function HeroQuickLinks({ variant = "dark", className = "" }: HeroQuickLinksProps) {
  const isDark = variant === "dark";

  return (
    <div className={className} data-testid="hero-quick-links">
      <p
        className={`text-center text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${
          isDark ? "text-white/40" : "text-slate-400"
        }`}
      >
        Start here
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory overscroll-x-contain -mx-1 px-1 md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className={`group flex min-w-[200px] flex-1 snap-start flex-col rounded-2xl border p-4 transition-all md:min-w-0 ${
                isDark
                  ? "border-white/15 bg-white/10 hover:border-white/30 hover:bg-white/15"
                  : "border-slate-200 bg-white shadow-sm hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-white/10" : "bg-primary/10"}`}>
                <Icon className={`h-5 w-5 ${isDark ? item.accent : "text-primary"}`} />
              </div>
              <p className={`text-sm font-bold leading-snug ${isDark ? "text-white" : "text-primary"}`}>
                {item.title}
              </p>
              <p className={`mt-1 text-xs leading-relaxed flex-1 ${isDark ? "text-white/55" : "text-slate-500"}`}>
                {item.desc}
              </p>
              <span
                className={`mt-3 inline-flex items-center text-xs font-semibold ${
                  isDark ? "text-amber-300/90 group-hover:text-amber-200" : "text-primary group-hover:underline"
                }`}
              >
                Open <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const SUBJECT_CHIPS = [
  { label: "Word puzzles & letter patterns", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Shape & pattern puzzles", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { label: "Number problems", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Reading & comprehension", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export function ChildExperienceCTA() {
  return (
    <div className="not-prose my-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 md:p-8" data-testid="banner-child-experience-cta">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">What Your Child Actually Sees</span>
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-800 font-serif mb-2 leading-snug">
        Friendly names. Encouraging feedback. No scary jargon.
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-2xl">
        The platform uses names your child will immediately understand — no intimidating exam labels. After every drill, they see an encouraging message, their score, and a one-tap option to try again.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {SUBJECT_CHIPS.map(({ label, color }) => (
          <span
            key={label}
            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}
            data-testid={`chip-subject-${label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {label}
          </span>
        ))}
      </div>
      <Button
        asChild
        className="h-10 px-5 bg-amber-500 text-white hover:bg-amber-600 font-semibold text-sm shadow-sm"
        data-testid="button-child-experience-cta"
      >
        <Link href="/free-diagnostic">
          See it yourself — Free Readiness Check <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

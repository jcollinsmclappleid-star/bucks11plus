import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";

export function ContentCTA() {
  return (
    <div className="not-prose my-12 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Target className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-primary font-serif mb-3">
        Assess Your Child's Readiness
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm leading-relaxed">
        Take a free 8-minute diagnostic to see where your child stands against the 121 Buckinghamshire qualifying score.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" data-testid="button-content-cta-diagnostic">
          <Link href="/free-diagnostic">Start Free Diagnostic <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild className="h-11 px-6" data-testid="button-content-cta-guide">
          <Link href="/buckinghamshire-11-plus-guide">Read the Full Guide</Link>
        </Button>
      </div>
    </div>
  );
}

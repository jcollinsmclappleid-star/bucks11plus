import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, BarChart3, BookOpen } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-24 md:py-32 px-4 relative overflow-hidden">
        {/* Subtle background texture/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-background to-background -z-10" />
        
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm font-medium mb-4 border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Buckinghamshire 11+ Ready
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight leading-[1.1]">
            Bucks 11+ Readiness, <br className="hidden md:block" />
            <span className="text-muted-foreground">Forecast & Targeted Practice.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Take our structured diagnostic assessment to discover exactly where your child stands relative to the 121 standard, and what they need to focus on next.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 w-full sm:w-auto" asChild>
              <Link href="/app">
                Start Free Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4">
              Takes 12 minutes • Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Features / Value Prop */}
      <section className="py-20 bg-slate-50/50 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Answers the questions that matter</h2>
            <p className="text-lg text-muted-foreground">Within 10 seconds of completion, you'll know:</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Are we on track for 121?", icon: Target },
              { title: "How far off are we?", icon: BarChart3 },
              { title: "What is holding us back?", icon: CheckCircle2 },
              { title: "What should we do next?", icon: BookOpen },
            ].map((feature, i) => (
              <Card key={i} className="bg-background/60 border-border/50 shadow-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-primary">{feature.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visual Teaser Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-border/50 p-2 md:p-4 overflow-hidden">
            <div className="aspect-[16/9] bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
               <div className="text-center space-y-6 max-w-lg p-8">
                  <div className="w-48 h-48 mx-auto rounded-full border-[16px] border-amber-400 border-t-slate-100 flex items-center justify-center shadow-inner relative">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">114</div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">Score</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">7 points gap to 121</h3>
                    <p className="text-muted-foreground mt-2">Your current readiness band indicates confident progress, but targeted VR practice is required to secure the benchmark.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
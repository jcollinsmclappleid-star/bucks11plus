import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, BarChart3, BookOpen } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo 
        title="11+ Standard | Bucks 11+ Readiness & Forecast" 
        description="The premier platform for Buckinghamshire 11+ preparation. Get targeted practice, precise readiness forecasting against the 121 benchmark, and detailed analytics." 
      />
      {/* Hero Section */}
      <section className="py-24 md:py-32 px-4 relative overflow-hidden">
        {/* Subtle background texture/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-background to-background -z-10" />
        
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm font-medium mb-4 border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Buckinghamshire 11+ Ready
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight leading-[1.1] font-serif">
            Bucks 11+ Readiness, <br className="hidden md:block" />
            <span className="text-muted-foreground font-sans tracking-normal text-4xl md:text-6xl mt-4 block">Forecast & Targeted Practice.</span>
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
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 font-medium">
              Takes 12 minutes • Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Features / Value Prop */}
      <section className="py-20 bg-slate-50/50 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4 font-serif">Answers the questions that matter</h2>
            <p className="text-lg text-muted-foreground">Within 10 seconds of completion, you'll know:</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Are we on track for 121?", icon: Target },
              { title: "How far off are we?", icon: BarChart3 },
              { title: "What is holding us back?", icon: CheckCircle2 },
              { title: "What should we do next?", icon: BookOpen },
            ].map((feature, i) => (
              <Card key={i} className="bg-background/60 border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-primary text-lg">{feature.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visual Teaser Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-slate-50 rounded-2xl border border-border/50 p-2 md:p-8 overflow-hidden shadow-inner">
            <div className="aspect-[16/9] md:aspect-[21/9] bg-white rounded-xl flex flex-col md:flex-row items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-8 gap-12">
               
               <div className="relative w-56 h-56 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="12" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-brand-amber transition-all duration-1000 ease-out" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * (114 / 141))} 
                    />
                    <line x1="50" y1="2" x2="50" y2="15" className="stroke-primary" strokeWidth="2" transform={`rotate(${(121/141)*360} 50 50)`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold text-primary">114</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Est. Score</span>
                  </div>
               </div>

               <div className="max-w-lg space-y-4">
                  <h3 className="text-3xl font-bold text-primary font-serif">7 points gap to 121</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Your current readiness band indicates confident progress, but targeted VR practice is required to secure the benchmark.
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" asChild>
                       <Link href="/how-forecast-works">Learn about our methodology</Link>
                    </Button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
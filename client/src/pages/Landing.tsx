import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Lock, Zap } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo 
        title="GL-Style Aligned Bucks 11+ Diagnostics | 11+ Standard" 
        description="Timed diagnostics aligned to GL-style reasoning families used in Bucks for the Buckinghamshire Secondary Transfer Test." 
      />
      
      {/* V1: HOMEPAGE HERO WITH IMAGE */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Abstract dark navy background with subtle light accents" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/95 to-primary"></div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-amber animate-pulse"></span>
              Buckinghamshire 11+ Ready
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] font-serif">
              Bucks 11+ Diagnostics <br className="hidden md:block" />
              <span className="text-white/80 font-sans tracking-normal text-4xl md:text-6xl mt-4 block">Aligned to GL-Style Reasoning Families</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Timed diagnostics aligned to GL-style reasoning families used in Bucks — forecasted against the 121 benchmark, with targeted practice that improves the highest-impact areas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 text-sm font-medium pt-4">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-amber" /> Aligned to GL-style reasoning types (VR / NVR / Maths)</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-amber" /> Timed to reflect exam pacing and pressure</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-amber" /> Forecasted against the Bucks 121 benchmark</span>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-brand-amber text-amber-950 hover:bg-amber-400 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/20 border-none" asChild>
                <Link href="/sign-up">
                  Start Free Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md" asChild>
                 <Link href="/how-forecast-works">How Our Forecast Works</Link>
              </Button>
            </div>
            <p className="text-xs text-white/50 mt-6 max-w-md mx-auto">
              Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
            </p>
          </div>

          {/* V1: Preview Block */}
          <div className="mt-24 relative max-w-4xl mx-auto hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10 rounded-xl pointer-events-none"></div>
            <div className="bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              
              <div className="flex gap-4 opacity-40 blur-[2px] transition-all duration-700 group-hover:blur-0 group-hover:opacity-100 scale-[0.98] group-hover:scale-100 origin-bottom">
                 <div className="w-1/3 bg-white rounded-lg p-6 shadow-lg border border-slate-200 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-8 border-brand-amber border-t-slate-100 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">114</span>
                    </div>
                    <div className="h-3 w-3/4 bg-slate-200 rounded-full mb-2"></div>
                    <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
                 </div>
                 <div className="w-1/3 bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 w-1/2 bg-primary rounded-full"></div>
                      <div className="h-4 w-8 bg-red-400 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 bg-slate-50 rounded border border-slate-100"></div>
                      <div className="h-8 bg-slate-50 rounded border border-slate-100"></div>
                      <div className="h-8 bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                 </div>
                 <div className="w-1/3 bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                    <div className="h-4 w-2/3 bg-primary rounded-full mb-6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-10 w-10 bg-brand-green/20 rounded-md"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                        <div className="h-3 w-2/3 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
                <div className="bg-primary/90 text-white px-6 py-3 rounded-full font-medium shadow-xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
                   <Target className="h-5 w-5 text-brand-amber" />
                   Your results will appear like this — clear, visual, and action-led.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* V2: GL ALIGNMENT SECTION */}
      <section className="py-20 bg-slate-50 border-b border-border/50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4 font-serif">Aligned to GL-Style Reasoning Families Used in Bucks</h2>
            <p className="text-lg text-muted-foreground">We independently model the assessment constraints to give you an honest baseline.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Reasoning Coverage</h3>
                <p className="text-muted-foreground">VR, NVR and Maths aligned to GL-style reasoning families used in Bucks.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 border border-brand-primary/10">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">Timed Conditions</h3>
                <p className="text-muted-foreground">Pace and completion rates are actively measured and penalized, not just raw accuracy.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-brand-amber/10 text-brand-amber rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 border-brand-amber/20">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-primary text-xl">121 Context</h3>
                <p className="text-muted-foreground">Your child's projected range is positioned directly against the Bucks qualifying score.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Visual Teaser Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-2 md:p-8 overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none mix-blend-multiply">
                 <img src="/logo.png" alt="" className="w-64 h-64 grayscale object-contain" />
            </div>

            <div className="aspect-[16/9] md:aspect-[21/9] bg-white rounded-2xl flex flex-col md:flex-row items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-8 gap-12 relative z-10">
               
               <div className="relative w-56 h-56 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-sm" viewBox="0 0 100 100">
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

               <div className="max-w-lg space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200 shadow-sm">
                    Confident Amber Band
                  </div>
                  <h3 className="text-3xl font-bold text-primary font-serif">7 points gap to 121</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Your current readiness band indicates confident progress, but targeted VR practice is required to secure the benchmark.
                  </p>
                  <div className="pt-4 flex items-center gap-4">
                    <Button className="bg-primary shadow-md" asChild>
                       <Link href="/sign-up">Start Free Diagnostic</Link>
                    </Button>
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <Zap className="h-4 w-4 text-brand-amber" /> 12 mins
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 text-center">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}
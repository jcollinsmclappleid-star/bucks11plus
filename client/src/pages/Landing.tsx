import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Target, Clock, BarChart3, Lock, Zap, Search, Wrench, TrendingUp } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Seo 
        title="GL-Style Aligned Bucks 11+ Diagnostics | 11+ Standard" 
        description="Timed diagnostics aligned to GL-style reasoning families used in Bucks for the Buckinghamshire Secondary Transfer Test." 
      />
      
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Abstract dark navy background with subtle light accents" 
            className="w-full h-full object-cover object-center"
          />
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
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-amber" /> Timed to reflect exam pacing and pressure</span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-amber" /> Forecasted against the Bucks 121 benchmark</span>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-brand-amber text-amber-950 hover:bg-amber-400 w-full sm:w-auto font-bold shadow-lg shadow-brand-amber/20 border-none" asChild>
                <Link href="/free-diagnostic">
                  Start Free Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md" asChild>
                 <a href="#how-forecast-works">How Our Forecast Works</a>
              </Button>
            </div>
            <p className="text-xs text-white/50 mt-6 max-w-md mx-auto">
              Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
            </p>
          </div>

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

      <section id="how-forecast-works" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">
              How It Works in Practice
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              In a competitive cohort, effort alone is not enough. Preparation must be measured, directed and timed.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-diagnostic-benchmark">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 1</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Diagnostic Benchmark</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Preparation begins with a timed GL-style diagnostic covering Verbal Reasoning, Non-Verbal Reasoning, Mathematical Reasoning and section pacing.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Skill-by-skill accuracy analysis across 18 sub-areas</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Pacing risk indicators per section</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Initial readiness band relative to the 121 qualifying standard</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Without a structured benchmark, preparation often reinforces strengths and neglects weaknesses.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-readiness-forecast">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 2</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Readiness Forecast</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Performance is analysed through weighted modelling aligned to qualifying benchmarks. Accuracy is adjusted for difficulty, pacing is measured against section expectations, and error concentration within sub-skills is evaluated.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Clear readiness band: Secure (Green) / Borderline (Amber) / Development Required (Red)</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Top three priority intervention areas identified</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Risk factors affecting qualification surfaced</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                This prevents misplaced effort and reduces uncertainty.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-targeted-development">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 3</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Targeted Development</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Practice is prescribed according to diagnosed gaps. Time is directed to areas that materially influence outcome rather than broad repetition.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Skill-specific drills mapped to sub-rules</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Visual Non-Verbal reasoning sequences</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Timed section simulations with progressive difficulty</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Time is directed to areas that materially influence outcome.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300" data-testid="step-measured-progression">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest">Step 4</span>
                  <h3 className="text-xl font-bold text-primary font-serif leading-tight">Measured Progression</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Improvement is reassessed at structured milestones. Progress becomes visible and evidence-based rather than assumed.
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Accuracy progression tracked across attempts</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Pacing discipline and volatility monitored</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                  <span>Movement between readiness bands visible over time</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
                Progress becomes visible and evidence-based.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-primary/[0.07] border border-primary/10 p-7 sm:p-10 text-center">
            <p className="text-slate-700 font-medium text-lg leading-relaxed mb-1">
              Many families complete large volumes of questions without knowing whether readiness is improving.
            </p>
            <p className="text-primary font-serif text-xl sm:text-2xl font-bold mt-3 mb-5">
              Are we on track for 121 under timed conditions?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground shadow-md" asChild data-testid="button-start-diagnostic-process">
                <Link href="/free-diagnostic">Start Free Diagnostic</Link>
              </Button>
              <Button variant="outline" className="h-12 px-6" asChild data-testid="link-how-it-works-detail">
                <Link href="/how-it-works">
                  See Full Process <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-4 bg-slate-50 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-primary/50 uppercase tracking-widest mb-3">Example Output</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4">What your diagnostic reveals</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              After just 12 minutes, you'll see exactly where your child stands against the Bucks 121 qualifying benchmark.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
               <div className="relative w-44 h-44 md:w-56 md:h-56 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-sm" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-200" strokeWidth="12" fill="none" />
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
                    <span className="text-4xl md:text-5xl font-bold text-primary">114</span>
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Est. Score</span>
                  </div>
               </div>

               <div className="max-w-lg space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200 shadow-sm">
                    Borderline (Amber)
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary font-serif">7 points gap to 121</h3>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Your current readiness band indicates progress, but targeted practice in identified weak areas is required to secure the qualifying benchmark.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <Button className="bg-primary shadow-md" asChild>
                       <Link href="/free-diagnostic">Start Free Diagnostic</Link>
                    </Button>
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <Zap className="h-4 w-4 text-brand-amber" /> 12 mins
                    </span>
                  </div>
               </div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-6 italic">Example based on sample student data</p>
          </div>
        </div>
      </section>

      <div className="py-6 text-center bg-white">
        <p className="text-xs text-slate-400" data-testid="text-disclaimer">
          Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
        </p>
      </div>
    </div>
  );
}

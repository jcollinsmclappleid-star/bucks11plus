import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AuthProvider } from "./lib/auth";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import ParentHub from "./pages/ParentHub";
import Article from "./pages/Article";
import TestRunner from "./pages/TestRunner";
import Onboarding from "./pages/Onboarding";
import Practice from "./pages/Practice";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Diagnostics from "./pages/Diagnostics";
import DiagnosticStart from "./pages/DiagnosticStart";
import Results from "./pages/Results";
import Progress from "./pages/Progress";
import Account from "./pages/Account";
import ReportArchive from "./pages/ReportArchive";

import HowItWorks from "./pages/HowItWorks";
import Methodology from "./pages/Methodology";
import GLAlignment from "./pages/GLAlignment";
import About from "./pages/About";
import Legal from "./pages/Legal";

// Layout wrapper for pages that need Navbar
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Simple Footer for SEO / Authority */}
      <footer className="bg-primary text-primary-foreground/70 py-12 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif font-bold text-xl text-primary-foreground mb-4">11+ Standard</div>
            <p className="text-sm">Bucks 11+ Readiness, Forecast & Targeted Practice.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/parent-hub" className="hover:text-white transition-colors">Parent Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Transparency</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-forecast-works" className="hover:text-white transition-colors">Methodology</Link></li>
              <li><Link href="/bucks-gl-alignment" className="hover:text-white transition-colors">GL Alignment</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Routes WITHOUT Navbar (Test Runner) */}
      <Route path="/app/test/:id" component={TestRunner} />
      
      {/* Routes WITH Navbar */}
      <Route path="*">
        <MainLayout>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/parent-hub" component={ParentHub} />
            <Route path="/parent-hub/:slug" component={Article} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/how-forecast-works" component={Methodology} />
            <Route path="/bucks-gl-alignment" component={GLAlignment} />
            <Route path="/about" component={About} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            
            <Route path="/terms">
              <Legal type="terms" />
            </Route>
            <Route path="/privacy">
              <Legal type="privacy" />
            </Route>
            <Route path="/safeguarding">
              <Legal type="safeguarding" />
            </Route>

            <Route path="/app" component={Dashboard} />
            <Route path="/app/onboarding" component={Onboarding} />
            <Route path="/app/practice" component={Practice} />
            <Route path="/app/diagnostic" component={Diagnostics} />
            <Route path="/app/diagnostic/:id/start" component={DiagnosticStart} />
            <Route path="/app/results/:id" component={Results} />
            <Route path="/app/progress" component={Progress} />
            <Route path="/app/account" component={Account} />
            <Route path="/app/report-archive" component={ReportArchive} />
            
            {/* Catch-all for mockup links that don't exist yet */}
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
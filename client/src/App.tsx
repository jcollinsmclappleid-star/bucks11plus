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
import Programme from "./pages/Programme";
import ProgrammeCompletion from "./pages/ProgrammeCompletion";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import DrillRunner from "./pages/DrillRunner";
import ParentAnalytics from "./pages/ParentAnalytics";
import FreeDiagnosticStart from "./pages/FreeDiagnosticStart";
import GuestResults from "./pages/GuestResults";

import HowItWorks from "./pages/HowItWorks";
import Methodology from "./pages/Methodology";
import GLAlignment from "./pages/GLAlignment";
import About from "./pages/About";
import Legal from "./pages/Legal";

import QuestionList from "./pages/admin/QuestionList";
import QuestionEditor from "./pages/admin/QuestionEditor";
import { useAuth } from "./lib/auth";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      
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
              <li><Link href="/how-forecast-works" className="hover:text-white transition-colors">How Our Forecast Works</Link></li>
              <li><Link href="/bucks-gl-alignment" className="hover:text-white transition-colors">GL-Style Alignment</Link></li>
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
        <div className="container mx-auto max-w-6xl px-4 mt-8 pt-6 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/40 text-center" data-testid="text-footer-disclaimer">
            Independent readiness assessment. Not affiliated with GL Assessment or Buckinghamshire Council.
          </p>
        </div>
      </footer>
    </div>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center" data-testid="auth-gate">
        <div className="max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-primary font-serif">Sign in to continue</h2>
          <p className="text-muted-foreground">Please sign in or create an account to access your dashboard, diagnostics, and progress tracking.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-in">
              <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto" data-testid="button-sign-in">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto" data-testid="button-sign-up">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user?.isAdmin) return <NotFound />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/app/test/:id" component={TestRunner} />
      <Route path="/app/drill/:sectionId">
        <AuthGate><DrillRunner /></AuthGate>
      </Route>
      
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
            <Route path="/free-diagnostic" component={FreeDiagnosticStart} />
            <Route path="/free-results/:id" component={GuestResults} />
            <Route path="/checkout-success" component={CheckoutSuccess} />
            
            <Route path="/terms">
              <Legal type="terms" />
            </Route>
            <Route path="/privacy">
              <Legal type="privacy" />
            </Route>
            <Route path="/safeguarding">
              <Legal type="safeguarding" />
            </Route>

            <Route path="/app">
              <AuthGate><Dashboard /></AuthGate>
            </Route>
            <Route path="/app/onboarding">
              <AuthGate><Onboarding /></AuthGate>
            </Route>
            <Route path="/app/practice">
              <AuthGate><Practice /></AuthGate>
            </Route>
            <Route path="/app/diagnostic">
              <AuthGate><Diagnostics /></AuthGate>
            </Route>
            <Route path="/app/diagnostic/:id/start">
              <AuthGate><DiagnosticStart /></AuthGate>
            </Route>
            <Route path="/app/results/:id">
              <AuthGate><Results /></AuthGate>
            </Route>
            <Route path="/app/progress">
              <AuthGate><Progress /></AuthGate>
            </Route>
            <Route path="/app/account">
              <AuthGate><Account /></AuthGate>
            </Route>
            <Route path="/app/report-archive">
              <AuthGate><ReportArchive /></AuthGate>
            </Route>
            <Route path="/app/programme">
              <AuthGate><Programme /></AuthGate>
            </Route>
            <Route path="/app/programme/summary">
              <AuthGate><ProgrammeCompletion /></AuthGate>
            </Route>
            <Route path="/app/analytics">
              <AuthGate><ParentAnalytics /></AuthGate>
            </Route>
            <Route path="/app/checkout-success">
              <AuthGate><CheckoutSuccess /></AuthGate>
            </Route>

            <Route path="/admin/questions/new">
              <AdminGuard><QuestionEditor /></AdminGuard>
            </Route>
            <Route path="/admin/questions/:id">
              <AdminGuard><QuestionEditor /></AdminGuard>
            </Route>
            <Route path="/admin/questions">
              <AdminGuard><QuestionList /></AdminGuard>
            </Route>
            
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

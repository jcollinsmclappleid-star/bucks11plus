import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import React, { useEffect } from "react";

import { AuthProvider } from "./lib/auth";
import Navbar from "./components/layout/Navbar";
import AdminTierSwitcher from "./components/layout/AdminTierSwitcher";
import LockedOverlay from "./components/shared/LockedOverlay";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Diagnostics from "./pages/Diagnostics";
import DiagnosticStart from "./pages/DiagnosticStart";
import Results from "./pages/Results";
import Progress from "./pages/Progress";
import Account from "./pages/Account";
import ReportArchive from "./pages/ReportArchive";
import Programme from "./pages/Programme";
import ProgrammeCompletion from "./pages/ProgrammeCompletion";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AccountDeleted from "./pages/AccountDeleted";
import DrillRunner from "./pages/DrillRunner";
import ParentAnalytics from "./pages/ParentAnalytics";
import FreeDiagnosticStart from "./pages/FreeDiagnosticStart";
import GuestResults from "./pages/GuestResults";

import HowItWorks from "./pages/HowItWorks";
import GLAlignment from "./pages/GLAlignment";
import About from "./pages/About";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";
import BucksGuide from "./pages/BucksGuide";

import ScoringMethodology from "./pages/ScoringMethodology";
import HowToPass from "./pages/seo/HowToPass";
import Registration from "./pages/seo/Registration";
import CommonMistakes from "./pages/seo/CommonMistakes";
import Badges from "./pages/Badges";
import QuestionList from "./pages/admin/QuestionList";
import QuestionEditor from "./pages/admin/QuestionEditor";

import ParentGuide from "./pages/ParentGuide";
import GuidePrint from "./pages/GuidePrint";
import SiteLinks from "./pages/SiteLinks";
import LearnHub from "./pages/learn/LearnHub";
import LearnArticle from "./pages/learn/LearnArticle";
import EarlyDashboard from "./pages/EarlyDashboard";
import TestDaySimulator from "./pages/TestDaySimulator";
import GrammarSchools from "./pages/seo/GrammarSchools";
import GrammarSchoolGuide from "./pages/seo/GrammarSchoolGuide";
import QualifyingScore from "./pages/seo/QualifyingScore";
import Timeline from "./pages/seo/Timeline";
import SecondaryTransfer from "./pages/seo/SecondaryTransfer";
import TownGuide from "./pages/seo/TownGuide";
import YearGroupGuide from "./pages/seo/YearGroupGuide";
import SubjectGuide from "./pages/seo/SubjectGuide";
import { towns } from "./data/towns";
import { grammarSchools } from "./data/grammar-schools";
import { useAuth } from "./lib/auth";
import ChatWidget from "./components/shared/ChatWidget";

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <AdminTierSwitcher />
      <ChatWidget />

      <footer className="bg-primary text-primary-foreground/70 py-12 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-5 gap-8">
          <div>
            <div className="font-serif font-bold text-xl text-primary-foreground mb-4">Bucks 11 Plus Tests</div>
            <p className="text-sm">Independent Buckinghamshire 11+ readiness assessment and preparation.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/bucks-gl-alignment" className="hover:text-white transition-colors">GL-Style Alignment</Link></li>
              <li><Link href="/how-forecast-works" className="hover:text-white transition-colors">How Scoring Works</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/site-links" className="hover:text-white transition-colors">Site Links</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/buckinghamshire-11-plus-guide" className="hover:text-white transition-colors">Bucks 11+ Guide</Link></li>
              <li><Link href="/bucks-grammar-schools" className="hover:text-white transition-colors">Grammar Schools</Link></li>
              <li><Link href="/bucks-11-plus-qualifying-score" className="hover:text-white transition-colors">Qualifying Score</Link></li>
              <li><Link href="/bucks-11-plus-timeline" className="hover:text-white transition-colors">Admissions Timeline</Link></li>
              <li><Link href="/how-to-pass-bucks-11-plus" className="hover:text-white transition-colors">How to Pass</Link></li>
              <li><Link href="/bucks-11-plus-registration" className="hover:text-white transition-colors">Registration Guide</Link></li>
              <li><Link href="/bucks-11-plus-parent-guide" className="hover:text-white transition-colors">Parent Guide (PDF)</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">Learning Hub (30 Guides)</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">11+ Glossary</Link></li>
              <li><Link href="/parent-hub" className="hover:text-white transition-colors">Parent Hub Articles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Local Guides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bucks-11-plus-high-wycombe" className="hover:text-white transition-colors">High Wycombe</Link></li>
              <li><Link href="/bucks-11-plus-aylesbury" className="hover:text-white transition-colors">Aylesbury</Link></li>
              <li><Link href="/bucks-11-plus-beaconsfield" className="hover:text-white transition-colors">Beaconsfield</Link></li>
              <li><Link href="/bucks-11-plus-amersham" className="hover:text-white transition-colors">Amersham</Link></li>
              <li><Link href="/bucks-11-plus-chesham" className="hover:text-white transition-colors">Chesham</Link></li>
              <li><Link href="/bucks-11-plus-marlow" className="hover:text-white transition-colors">Marlow</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 mt-8 pt-6 border-t border-primary-foreground/10 space-y-1.5">
          <p className="text-xs text-primary-foreground/50 text-center">
            Bucks 11 Plus Tests is operated by <strong className="text-primary-foreground/60">Ianson Systems Limited</strong>, a UK-based company developing educational tools and diagnostic assessment platforms to support 11+ preparation.
          </p>
          <p className="text-xs text-primary-foreground/40 text-center" data-testid="text-footer-disclaimer">
            Independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual grammar school.
          </p>
          <p className="text-xs text-primary-foreground/25 text-center">
            © {new Date().getFullYear()} Ianson Systems Limited. Registered in England &amp; Wales.
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

function PreviewGate({ children, section, requiredTier }: { children: React.ReactNode; section: string; requiredTier?: "any" | "pack12" | "programme16" }) {
  const { user, isLoading, hasPaidAccess, isProgramme } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) {
    return <LockedOverlay section={section} requiredTier={requiredTier}>{children}</LockedOverlay>;
  }
  if (requiredTier === "pack12" && !hasPaidAccess()) {
    return <LockedOverlay section={section} requiredTier={requiredTier} loggedIn>{children}</LockedOverlay>;
  }
  if (requiredTier === "programme16" && !isProgramme()) {
    return <LockedOverlay section={section} requiredTier={requiredTier} loggedIn>{children}</LockedOverlay>;
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
            <Route path="/how-forecast-works" component={ScoringMethodology} />
            <Route path="/bucks-gl-alignment" component={GLAlignment} />
            <Route path="/about" component={About} />
            <Route path="/buckinghamshire-11-plus-guide" component={BucksGuide} />
            <Route path="/bucks-11-plus-parent-guide" component={ParentGuide} />
            <Route path="/guide-print" component={GuidePrint} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/free-diagnostic" component={FreeDiagnosticStart} />
            <Route path="/free-results/:id" component={GuestResults} />
            <Route path="/bucks-grammar-schools" component={GrammarSchools} />
            <Route path="/bucks-11-plus-qualifying-score" component={QualifyingScore} />
            <Route path="/bucks-11-plus-timeline" component={Timeline} />
            <Route path="/buckinghamshire-secondary-transfer-test" component={SecondaryTransfer} />
            <Route path="/how-to-pass-bucks-11-plus" component={HowToPass} />
            <Route path="/bucks-11-plus-registration" component={Registration} />
            <Route path="/bucks-11-plus-mistakes" component={CommonMistakes} />
            <Route path="/learn" component={LearnHub} />
            <Route path="/learn/:slug" component={LearnArticle} />
            <Route path="/site-links" component={SiteLinks} />
            {towns.map(t => (
              <Route key={t.slug} path={`/bucks-11-plus-${t.slug}`}>
                <TownGuide townSlug={t.slug} />
              </Route>
            ))}
            {grammarSchools.map(s => (
              <Route key={s.slug} path={`/grammar-schools/${s.slug}`}>
                <GrammarSchoolGuide schoolSlug={s.slug} />
              </Route>
            ))}
            <Route path="/preparing-for-11-plus-year-4">
              <YearGroupGuide year={4} />
            </Route>
            <Route path="/preparing-for-11-plus-year-5">
              <YearGroupGuide year={5} />
            </Route>
            <Route path="/preparing-for-11-plus-year-6">
              <YearGroupGuide year={6} />
            </Route>
            <Route path="/11-plus-verbal-reasoning-practice">
              <SubjectGuide subject="verbal-reasoning" />
            </Route>
            <Route path="/11-plus-non-verbal-reasoning-practice">
              <SubjectGuide subject="non-verbal-reasoning" />
            </Route>
            <Route path="/11-plus-maths-practice">
              <SubjectGuide subject="maths" />
            </Route>
            <Route path="/11-plus-comprehension-practice">
              <SubjectGuide subject="comprehension" />
            </Route>
            <Route path="/checkout-success" component={CheckoutSuccess} />
            <Route path="/account-deleted" component={AccountDeleted} />

            <Route path="/terms">
              <Legal type="terms" />
            </Route>
            <Route path="/privacy">
              <Legal type="privacy" />
            </Route>
            <Route path="/safeguarding">
              <Legal type="safeguarding" />
            </Route>
            <Route path="/refund-policy">
              <Legal type="refund" />
            </Route>
            <Route path="/contact" component={Contact} />

            <Route path="/early-dashboard">
              <AuthGate><EarlyDashboard /></AuthGate>
            </Route>
            <Route path="/app">
              <PreviewGate section="Dashboard"><Dashboard /></PreviewGate>
            </Route>
            <Route path="/app/test-day-simulator">
              <AuthGate><TestDaySimulator /></AuthGate>
            </Route>
            <Route path="/app/onboarding">
              <AuthGate><Onboarding /></AuthGate>
            </Route>
            <Route path="/app/practice">
              <PreviewGate section="Practice" requiredTier="pack12"><Practice /></PreviewGate>
            </Route>
            <Route path="/app/diagnostic">
              <PreviewGate section="Diagnostics"><Diagnostics /></PreviewGate>
            </Route>
            <Route path="/app/diagnostic/:id/start">
              <DiagnosticStart />
            </Route>
            <Route path="/app/results/:id">
              <AuthGate><Results /></AuthGate>
            </Route>
            <Route path="/app/progress">
              <PreviewGate section="Progress" requiredTier="pack12"><Progress /></PreviewGate>
            </Route>
            <Route path="/app/account">
              <AuthGate><Account /></AuthGate>
            </Route>
            <Route path="/app/report-archive">
              <PreviewGate section="Reports" requiredTier="pack12"><ReportArchive /></PreviewGate>
            </Route>
            <Route path="/app/programme">
              <PreviewGate section="Young Scholar Programme" requiredTier="programme16"><Programme /></PreviewGate>
            </Route>
            <Route path="/app/programme/summary">
              <AuthGate><ProgrammeCompletion /></AuthGate>
            </Route>
            <Route path="/app/analytics">
              <PreviewGate section="Parent Analytics" requiredTier="programme16"><ParentAnalytics /></PreviewGate>
            </Route>
            <Route path="/app/badges">
              <PreviewGate section="Accomplishments"><Badges /></PreviewGate>
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="text-center max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            <button
              data-testid="button-error-retry"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

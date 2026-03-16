import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../lib/auth";
import ChildSwitcher from "./ChildSwitcher";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout, isProgramme } = useAuth();

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group">
          <svg viewBox="0 0 48 48" className="w-8 h-8 shrink-0" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" />
            <line x1="24" y1="6" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
            <line x1="24" y1="38" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
            <line x1="6" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
            <line x1="38" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
            <circle cx="24" cy="24" r="3" fill="currentColor" className="text-primary/40" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-lg text-primary tracking-tight">11+</span>
            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] text-primary/50 mt-0.5">Standard</span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">How It Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Pricing</Link>
              <div className="flex items-center gap-3 ml-2">
                <Button variant="ghost" asChild data-testid="link-signin">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" data-testid="link-free-diagnostic">
                  <Link href="/free-diagnostic">Start Free Diagnostic</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/app" className="text-sm font-medium text-primary transition-colors" data-testid="link-dashboard">Dashboard</Link>
              <Link href="/app/diagnostic" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block" data-testid="link-diagnostics">Diagnostics</Link>
              <Link href="/app/practice" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" data-testid="link-practice">Practice</Link>
              {isProgramme() && (
                <>
                  <Link href="/app/programme" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block" data-testid="link-programme">Programme</Link>
                  <Link href="/app/analytics" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block" data-testid="link-analytics-nav">Analytics</Link>
                </>
              )}
              <Link href="/app/badges" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block" data-testid="link-badges">Accomplishments</Link>
              <Link href="/app/progress" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block" data-testid="link-progress">Progress</Link>
              <Link href="/app/report-archive" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden lg:block" data-testid="link-reports">Reports</Link>
              <ChildSwitcher />
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block" data-testid="link-account">
                {user.childName || user.username}
              </Link>
              {user.isAdmin && (
                <Link href="/admin/questions" className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors" data-testid="link-admin">Admin</Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                data-testid="button-signout"
              >
                Sign Out
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

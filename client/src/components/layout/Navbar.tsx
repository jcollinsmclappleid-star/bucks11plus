import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../lib/auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout, isProgramme } = useAuth();

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="11+ Standard Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif font-bold text-xl tracking-tight text-primary">11+ Standard</span>
        </Link>

        <nav className="flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">How it Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Pricing</Link>
              <div className="flex items-center gap-3 ml-2">
                <Button variant="ghost" asChild data-testid="link-signin">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" data-testid="link-signup">
                  <Link href="/sign-up">Start Free Diagnostic</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/app" className="text-sm font-medium text-primary transition-colors" data-testid="link-dashboard">Dashboard</Link>
              <Link href="/app/diagnostic" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block" data-testid="link-diagnostics">Diagnostics</Link>
              <Link href="/app/practice" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" data-testid="link-practice">Practice</Link>
              {isProgramme() && (
                <Link href="/app/programme" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block" data-testid="link-programme">Programme</Link>
              )}
              <Link href="/app/progress" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block" data-testid="link-progress">Progress</Link>
              <Link href="/app/report-archive" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden lg:block" data-testid="link-reports">Reports</Link>
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block" data-testid="link-account">
                {user.childName || user.username}
              </Link>
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

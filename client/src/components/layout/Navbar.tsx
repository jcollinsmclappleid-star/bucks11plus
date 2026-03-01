import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const isApp = location.startsWith("/app");

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="11+ Standard Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif font-bold text-xl tracking-tight text-primary">11+ Standard</span>
        </Link>

        <nav className="flex items-center gap-6">
          {!isApp ? (
            <>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">How it Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Pricing</Link>
              <div className="flex items-center gap-3 ml-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                  <Link href="/sign-up">Start Free Diagnostic</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/app" className="text-sm font-medium text-primary transition-colors">Dashboard</Link>
              <Link href="/app/diagnostic" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Diagnostics</Link>
              <Link href="/app/practice" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Practice</Link>
              <Link href="/app/progress" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block">Progress</Link>
              <Link href="/app/report-archive" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden lg:block">Reports</Link>
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden md:block">Account</Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Sign Out</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
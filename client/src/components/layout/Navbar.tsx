import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const isApp = location.startsWith("/app");

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary group-hover:bg-primary transition-colors">
              <div className="w-4 h-4 border border-primary group-hover:border-primary-foreground rounded-sm rotate-45 transition-colors" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-primary">11+ Standard</span>
          </a>
        </Link>

        <nav className="flex items-center gap-6">
          {!isApp ? (
            <>
              <Link href="/how-it-works"><a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">How it Works</a></Link>
              <Link href="/pricing"><a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">Pricing</a></Link>
              <div className="flex items-center gap-3 ml-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/app">Start Free Diagnostic</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/app"><a className="text-sm font-medium text-primary transition-colors">Dashboard</a></Link>
              <Link href="/app/practice"><a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Practice Bank</a></Link>
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
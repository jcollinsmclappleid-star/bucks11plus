import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../lib/auth";
import ChildSwitcher from "./ChildSwitcher";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/app", label: "Dashboard", show: true },
    { href: "/app/diagnostic", label: "Diagnostics", show: true, matchPrefix: true },
    { href: "/app/practice", label: "Practice", show: true, matchPrefix: true },
    { href: "/app/progress", label: "Progress", show: true },
    { href: "/app/report-archive", label: "Reports", show: true },
    { href: "/app/programme", label: "Programme", show: true },
    { href: "/app/analytics", label: "Analytics", show: true },
    { href: "/how-it-works", label: "How It Works", show: true },
    { href: "/bucks-11-plus-parent-guide", label: "Free Guide", show: true },
    { href: "/pricing", label: "Pricing", show: true },
    { href: "/contact", label: "Contact", show: true },
  ];

  const isActive = (href: string, matchPrefix?: boolean) => {
    if (matchPrefix) return location.startsWith(href);
    return location === href;
  };

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

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.filter(l => l.show).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${isActive(link.href, link.matchPrefix) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
              data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <div className="flex items-center gap-2 ml-2">
              <Button size="sm" className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold border-none shadow-sm" asChild data-testid="link-free-diagnostic-desktop">
                <Link href="/free-diagnostic">Free Bucks Diagnostic</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="link-signin">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-primary" asChild data-testid="link-get-started">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ChildSwitcher />
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" data-testid="link-account">
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

        <div className="flex items-center gap-2 md:hidden">
          {!user && (
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-[11px] px-2.5 h-8 shrink-0 whitespace-nowrap" data-testid="link-free-diagnostic-mobile">
              <Link href="/free-diagnostic">Bucks 11+ Free Diagnostic</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col leading-none">
                      <span className="font-serif font-bold text-lg text-primary tracking-tight">Bucks 11 Plus Tests</span>
                      {user && (
                        <span className="text-xs text-muted-foreground mt-1">{user.childName || user.username}</span>
                      )}
                    </div>
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {navLinks.filter(l => l.show).map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href, link.matchPrefix)
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      onClick={() => setOpen(false)}
                      data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user?.isAdmin && (
                    <Link
                      href="/admin/questions"
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                      onClick={() => setOpen(false)}
                      data-testid="link-mobile-admin"
                    >
                      Admin
                    </Link>
                  )}
                </nav>

                <div className="p-4 border-t border-border/40 space-y-2">
                  {user ? (
                    <>
                      <ChildSwitcher />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { logout(); setOpen(false); }}
                        data-testid="button-mobile-signout"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" asChild>
                        <Link href="/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/sign-up" onClick={() => setOpen(false)}>Create Account</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

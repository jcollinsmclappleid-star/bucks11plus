import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "../../lib/auth";
import ChildSwitcher from "./ChildSwitcher";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const practiceLinks = [
  { href: "/free-diagnostic", label: "Free Readiness Check", desc: "Try the free Bucks 11+ diagnostic test" },
  { href: "/11-plus-verbal-reasoning-practice", label: "Verbal Reasoning", desc: "Codes, analogies, sequences & more" },
  { href: "/11-plus-non-verbal-reasoning-practice", label: "Non-Verbal Reasoning", desc: "Shapes, patterns and spatial problems" },
  { href: "/11-plus-maths-practice", label: "Maths", desc: "Arithmetic, fractions, word problems" },
  { href: "/11-plus-comprehension-practice", label: "Comprehension", desc: "Reading passages and inference questions" },
];

const resourceLinks = [
  { href: "/bucks-11-plus-parent-guide", label: "Free Parent Guide", desc: "Complete prep guide for Bucks parents" },
  { href: "/parent-hub", label: "Parent Hub", desc: "Articles, advice and revision tips" },
  { href: "/learn", label: "Learn Hub", desc: "Subject guides and technique breakdowns" },
  { href: "/about", label: "About", desc: "How the platform works and who built it" },
  { href: "/bucks-grammar-schools", label: "Grammar Schools", desc: "All 13 Buckinghamshire grammar schools" },
];

function DropdownItem({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="block select-none rounded-md px-3 py-2.5 hover:bg-slate-50 transition-colors group"
      >
        <div className="text-sm font-medium text-slate-800 group-hover:text-primary leading-none mb-1">{label}</div>
        <div className="text-xs text-slate-500 leading-snug">{desc}</div>
      </Link>
    </NavigationMenuLink>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const appNavLinks = [
    { href: "/app", label: "Dashboard", matchPrefix: false },
    { href: "/app/diagnostic", label: "Readiness Checks", matchPrefix: true },
    { href: "/app/practice", label: "Practice", matchPrefix: true },
    { href: "/app/progress", label: "Progress", matchPrefix: false },
    { href: "/app/report-archive", label: "Reports", matchPrefix: false },
    { href: "/app/programme", label: "Programme", matchPrefix: false },
    { href: "/app/analytics", label: "Analytics", matchPrefix: false },
  ];

  const mobileNavLinks = [
    { href: "/app", label: "Dashboard", show: !!user, matchPrefix: false },
    { href: "/app/diagnostic", label: "Readiness Checks", show: !!user, matchPrefix: true },
    { href: "/app/practice", label: "Practice", show: !!user, matchPrefix: true },
    { href: "/app/progress", label: "Progress", show: !!user, matchPrefix: false },
    { href: "/app/report-archive", label: "Reports", show: !!user, matchPrefix: false },
    { href: "/app/programme", label: "Programme", show: !!user, matchPrefix: false },
    { href: "/app/analytics", label: "Analytics", show: !!user, matchPrefix: false },
    { href: "/app/account", label: "Account & Subscription", show: !!user, matchPrefix: false },
    { href: "/how-it-works", label: "How It Works", show: true, matchPrefix: false },
    { href: "/bucks-11-plus-parent-guide", label: "Free Guide", show: true, matchPrefix: false },
    { href: "/pricing", label: "Pricing", show: true, matchPrefix: false },
    { href: "/contact", label: "Contact", show: true, matchPrefix: false },
    ...(!user ? [
      { href: "/free-diagnostic", label: "Free Readiness Check", show: true, matchPrefix: false },
      { href: "/11-plus-verbal-reasoning-practice", label: "Verbal Reasoning Practice", show: true, matchPrefix: false },
      { href: "/11-plus-non-verbal-reasoning-practice", label: "Non-Verbal Reasoning Practice", show: true, matchPrefix: false },
      { href: "/11-plus-maths-practice", label: "Maths Practice", show: true, matchPrefix: false },
      { href: "/11-plus-comprehension-practice", label: "Comprehension Practice", show: true, matchPrefix: false },
      { href: "/parent-hub", label: "Parent Hub", show: true, matchPrefix: false },
      { href: "/learn", label: "Learn Hub", show: true, matchPrefix: false },
      { href: "/about", label: "About", show: true, matchPrefix: false },
      { href: "/bucks-grammar-schools", label: "Grammar Schools", show: true, matchPrefix: false },
    ] : []),
  ];

  const isActive = (href: string, matchPrefix?: boolean) => {
    if (matchPrefix) return location.startsWith(href);
    return location === href;
  };

  const triggerClass = cn(
    "h-auto bg-transparent px-0 py-0 text-sm font-medium text-slate-600 hover:text-primary hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary transition-colors",
  );

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
          {user ? (
            /* Logged-in: flat app links */
            <div className="flex items-center gap-4 lg:gap-6">
              {appNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${isActive(link.href, link.matchPrefix) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : (
            /* Logged-out: dropdowns + flat links */
            <NavigationMenu>
              <NavigationMenuList className="gap-0 lg:gap-1">

                {/* Practice & Tests dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass} data-testid="nav-trigger-practice">
                    Practice & Tests
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-3 w-[300px]">
                      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Tests &amp; Practice</p>
                      {practiceLinks.map(l => (
                        <DropdownItem key={l.href} {...l} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass} data-testid="nav-trigger-resources">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-3 w-[300px]">
                      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">For Parents</p>
                      {resourceLinks.map(l => (
                        <DropdownItem key={l.href} {...l} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Flat public links */}
                {[
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/contact", label: "Contact" },
                ].map(link => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                        data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <ChildSwitcher />
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" data-testid="link-account">
                {user.childName || user.username}
              </Link>
              {user.isAdmin && (
                <Link href="/admin/questions" className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors" data-testid="link-admin">Admin</Link>
              )}
              <Button variant="outline" size="sm" onClick={() => logout()} data-testid="button-signout">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild data-testid="link-signin">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-primary" asChild data-testid="link-get-started">
                <Link href="/pricing">See Plans</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: burger + optional CTA */}
        <div className="flex items-center gap-2 md:hidden">
          {!user && (
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-[11px] px-2.5 h-8 shrink-0 whitespace-nowrap" data-testid="link-free-diagnostic-mobile">
              <Link href="/free-diagnostic">Free Readiness Check</Link>
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
                  <div className="flex flex-col leading-none">
                    <span className="font-serif font-bold text-lg text-primary tracking-tight">Bucks 11 Plus Tests</span>
                    {user && (
                      <span className="text-xs text-muted-foreground mt-1">{user.childName || user.username}</span>
                    )}
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {mobileNavLinks.filter(l => l.show).map(link => (
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
                      <Button variant="outline" className="w-full" asChild data-testid="link-mobile-account">
                        <Link href="/app/account" onClick={() => setOpen(false)}>Account &amp; Subscription</Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }} data-testid="button-mobile-signout">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" asChild>
                        <Link href="/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
                      </Button>
                      <Button className="w-full bg-primary" asChild>
                        <Link href="/pricing" onClick={() => setOpen(false)}>See Plans & Start Today</Link>
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

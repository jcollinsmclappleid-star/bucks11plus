import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useDisplayName } from "../../lib/childNames";
import ChildSwitcher from "./ChildSwitcher";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FREE_PRACTICE_TEST_CTA,
  FREE_PRACTICE_TEST_PATH,
  PLATFORM_PRACTICE_PAPERS_PATH,
  PLATFORM_PREVIEW_CTA,
  PLATFORM_SUITE_PATH,
  PRACTICE_PAPERS_NAV_LABEL,
} from "@/lib/marketing";

const resourceLinks = [
  { href: "/why-choose-bucks-11-plus-tests", label: "Why Choose Us", desc: "Platform vs practice papers — side by side" },
  { href: "/how-it-works", label: "How It Works", desc: "How readiness forecasting and the programme work" },
  { href: "/bucks-11-plus-parent-guide", label: "Free Parent Guide", desc: "Complete prep guide for Bucks parents" },
  { href: "/parent-hub", label: "Parent Hub", desc: "Articles, advice and revision tips" },
  { href: "/learn", label: "Learn Hub", desc: "Subject guides and technique breakdowns" },
  { href: "/about", label: "About", desc: "How the platform works and who built it" },
  { href: "/bucks-grammar-schools", label: "Grammar Schools", desc: "All 13 Buckinghamshire grammar schools" },
];

function ResourceMenuItem({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-transparent">
      <Link
        href={href}
        className="block w-full select-none rounded-md px-3 py-2.5 hover:bg-slate-50 transition-colors group"
      >
        <div className="text-sm font-medium text-slate-800 group-hover:text-primary leading-none mb-1">{label}</div>
        <div className="text-xs text-slate-500 leading-snug">{desc}</div>
      </Link>
    </DropdownMenuItem>
  );
}

const appNavLinks = [
  { href: "/app", label: "Dashboard", matchPrefix: false },
  { href: "/app/diagnostic", label: "Practice Tests", matchPrefix: true },
  { href: "/app/practice", label: "Practice Drills", matchPrefix: true },
  { href: "/app/progress", label: "Progress", matchPrefix: false },
  { href: "/app/report-archive", label: "Reports", matchPrefix: false },
  { href: "/app/programme", label: "Programme", matchPrefix: false },
  { href: "/app/analytics", label: "Analytics", matchPrefix: false },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const navChildName = useDisplayName(user?.activeChildProfileId, user?.id, "");
  const [open, setOpen] = useState(false);

  const guestNavLinks = [
    { href: FREE_PRACTICE_TEST_PATH, label: FREE_PRACTICE_TEST_CTA, matchPrefix: false },
    { href: PLATFORM_PRACTICE_PAPERS_PATH, label: PRACTICE_PAPERS_NAV_LABEL, matchPrefix: false },
    { href: "/pricing", label: "Pricing", matchPrefix: false },
  ];

  const mobileNavLinks = [
    { href: FREE_PRACTICE_TEST_PATH, label: FREE_PRACTICE_TEST_CTA, show: !user, matchPrefix: false, section: "product" as const },
    { href: PLATFORM_PRACTICE_PAPERS_PATH, label: PRACTICE_PAPERS_NAV_LABEL, show: !user, matchPrefix: false, section: "product" as const },
    { href: "/pricing", label: "Pricing", show: !user, matchPrefix: false, section: "product" as const },
    { href: "/app", label: "Dashboard", show: !!user, matchPrefix: false, section: "app" as const },
    { href: "/app/diagnostic", label: "Practice Tests", show: !!user, matchPrefix: true, section: "app" as const },
    { href: "/app/practice", label: "Practice Drills", show: !!user, matchPrefix: true, section: "app" as const },
    { href: "/app/progress", label: "Progress", show: !!user, matchPrefix: false, section: "app" as const },
    { href: "/app/report-archive", label: "Reports", show: !!user, matchPrefix: false, section: "app" as const },
    { href: "/app/programme", label: "Programme", show: !!user, matchPrefix: false, section: "app" as const },
    { href: "/app/analytics", label: "Analytics", show: !!user, matchPrefix: false, section: "app" as const },
    { href: "/app/account", label: "Account & Subscription", show: !!user, matchPrefix: false, section: "app" as const },
    { href: PLATFORM_PRACTICE_PAPERS_PATH, label: PRACTICE_PAPERS_NAV_LABEL, show: !!user, matchPrefix: false, section: "explore" as const },
    { href: "/why-choose-bucks-11-plus-tests", label: "Why Choose Us", show: true, matchPrefix: false, section: "explore" as const },
    { href: "/how-it-works", label: "How It Works", show: true, matchPrefix: false, section: "explore" as const },
    { href: "/bucks-11-plus-parent-guide", label: "Free Guide", show: true, matchPrefix: false, section: "explore" as const },
    { href: "/contact", label: "Contact", show: true, matchPrefix: false, section: "explore" as const },
    { href: "/parent-hub", label: "Parent Hub", show: !user, matchPrefix: false, section: "explore" as const },
    { href: "/learn", label: "Learn Hub", show: !user, matchPrefix: false, section: "explore" as const },
    { href: "/about", label: "About", show: !user, matchPrefix: false, section: "explore" as const },
    { href: "/bucks-grammar-schools", label: "Grammar Schools", show: !user, matchPrefix: false, section: "explore" as const },
  ];

  const isActive = (href: string, matchPrefix?: boolean) => {
    if (matchPrefix) return location.startsWith(href);
    return location === href;
  };

  const onBrowsePage =
    location === PLATFORM_SUITE_PATH || location === PLATFORM_PRACTICE_PAPERS_PATH;

  const triggerClass = cn(
    "h-auto bg-transparent px-2 py-1 text-sm font-medium text-slate-600 hover:text-primary hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary transition-colors",
  );

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl gap-2">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Bucks 11 Plus Tests — Home">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md relative bg-primary">
            <picture>
              <source srcSet="/logo-shield-sm.webp" type="image/webp" />
              <img
                src="/logo-shield-sm.png"
                alt="Bucks 11 Plus Tests shield logo"
                width={300}
                height={200}
                fetchPriority="high"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[175%]"
              />
            </picture>
          </div>
          <div className="flex flex-col leading-none hidden sm:flex">
            <span className="font-serif font-bold text-base text-primary tracking-tight leading-none">Bucks 11+</span>
            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.18em] text-primary/45 mt-0.5">Tests</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <div className="flex items-center gap-2 lg:gap-4">
            {user && appNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive(link.href, link.matchPrefix) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}

            {!user && guestNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap hidden md:inline ${isActive(link.href, link.matchPrefix) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                data-testid={`link-guest-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Resources dropdown — all visitors */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(triggerClass, "inline-flex items-center gap-0.5")}
                data-testid="nav-trigger-resources"
              >
                Resources
                <ChevronDown className="h-3 w-3 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] p-2 z-[100]">
                <DropdownMenuLabel className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  For Parents
                </DropdownMenuLabel>
                {resourceLinks.map((l) => (
                  <ResourceMenuItem key={l.href} {...l} />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <ChildSwitcher />
              <Link href="/app/account" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" data-testid="link-account">
                {navChildName || user.username}
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
              <Button variant="cta" size="sm" asChild data-testid="link-free-diagnostic-desktop">
                <Link href="/free-diagnostic">
                  <span className="hidden lg:inline">Free Practice Test</span>
                  <span className="lg:hidden">Free Test</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="link-signin">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="cta" size="sm" asChild data-testid="link-get-started">
                <Link href={onBrowsePage ? "/pricing" : PLATFORM_PRACTICE_PAPERS_PATH}>
                  <span className="hidden lg:inline">{onBrowsePage ? "See plans & pricing" : PLATFORM_PREVIEW_CTA}</span>
                  <span className="lg:hidden">{onBrowsePage ? "Pricing" : "Platform"}</span>
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {!user && (
            <Button variant="cta" size="sm" asChild className="shrink-0" data-testid="link-free-diagnostic-mobile">
              <Link href="/free-diagnostic">Free Test</Link>
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
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md relative bg-primary">
                      <picture>
                        <source srcSet="/logo-shield-sm.webp" type="image/webp" />
                        <img src="/logo-shield-sm.png" alt="Bucks 11 Plus Tests" width={300} height={200} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[175%]" />
                      </picture>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="font-serif font-bold text-base text-primary tracking-tight leading-none">Bucks 11+ Tests</span>
                      {user && (
                        <span className="text-xs text-muted-foreground mt-1">{navChildName || user.username}</span>
                      )}
                    </div>
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {!user && (
                    <>
                      <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Get started</p>
                      {mobileNavLinks.filter(l => l.show && l.section === "product").map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            isActive(link.href, link.matchPrefix)
                              ? "bg-primary/10 text-primary"
                              : "text-slate-800 hover:bg-slate-100"
                          }`}
                          onClick={() => setOpen(false)}
                          data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="my-3 border-t border-border/40" />
                      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Guides &amp; resources</p>
                    </>
                  )}
                  {user && (
                    <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Your account</p>
                  )}
                  {mobileNavLinks.filter(l => l.show && l.section !== "product").map(link => (
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
                      <Button variant="cta" className="w-full" asChild>
                        <Link href="/free-diagnostic" onClick={() => setOpen(false)}>Free Practice Test</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
                      </Button>
                      <Button variant="cta" className="w-full" asChild>
                        <Link href={onBrowsePage ? "/pricing" : PLATFORM_PRACTICE_PAPERS_PATH} onClick={() => setOpen(false)}>
                          {onBrowsePage ? "See plans & pricing" : PLATFORM_PREVIEW_CTA}
                        </Link>
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

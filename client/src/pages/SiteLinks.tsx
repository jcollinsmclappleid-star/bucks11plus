import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { ArrowRight } from "lucide-react";

interface SiteLink {
  title: string;
  description: string;
  href: string;
}

interface LinkSection {
  heading: string;
  links: SiteLink[];
}

const sections: LinkSection[] = [
  {
    heading: "Main Pages",
    links: [
      { title: "Home", description: "11+ Standard — Buckinghamshire 11+ exam preparation aligned to the GL-style Secondary Transfer Test.", href: "/" },
      { title: "Pricing & Plans", description: "Compare all subscription tiers from the free diagnostic through to the full Young Scholar Programme.", href: "/pricing" },
      { title: "How It Works", description: "Understand how the platform forecasts your child's readiness using GL-aligned diagnostics and scoring.", href: "/how-it-works" },
      { title: "Free Baseline Diagnostic", description: "Take a free 8-minute assessment to see where your child stands — no account needed.", href: "/free-diagnostic" },
      { title: "GL-Style Alignment", description: "Learn how our questions and scoring mirror the real Buckinghamshire Secondary Transfer Test format.", href: "/bucks-gl-alignment" },
    ],
  },
  {
    heading: "Platform Features",
    links: [
      { title: "Dashboard", description: "Your child's personalised overview showing readiness score, recent results, and next steps.", href: "/app" },
      { title: "Diagnostics", description: "Timed diagnostic assessments across Verbal Reasoning, Non-Verbal Reasoning, Maths and English.", href: "/app/diagnostic" },
      { title: "Practice Tests", description: "Targeted topic-by-topic practice to build skills in each section of the 11+ exam.", href: "/app/practice" },
      { title: "Progress Tracking", description: "Detailed charts and trends showing improvement over time against the 121 qualifying benchmark.", href: "/app/progress" },
      { title: "Young Scholar Programme", description: "16-week structured study plan with guided preparation, mock exams, and advanced questions.", href: "/app/programme" },
      { title: "Parent Analytics", description: "In-depth performance breakdowns and insights to help parents support their child's preparation.", href: "/app/analytics" },
    ],
  },
  {
    heading: "Guides & Resources",
    links: [
      { title: "Buckinghamshire 11+ Complete Guide", description: "Everything parents need to know about the Bucks 11+ — format, scoring, schools, and preparation.", href: "/buckinghamshire-11-plus-guide" },
      { title: "Parent Guide (PDF)", description: "Downloadable guide covering the Secondary Transfer Test process, timeline, and how to support your child.", href: "/bucks-11-plus-parent-guide" },
      { title: "How to Pass the Bucks 11+", description: "Practical strategies and preparation tips to help your child reach the 121 qualifying score.", href: "/how-to-pass-bucks-11-plus" },
      { title: "11+ Qualifying Score Explained", description: "What the standardised score of 121 means and how it is calculated from the raw test results.", href: "/bucks-11-plus-qualifying-score" },
      { title: "Admissions Timeline", description: "Key dates for registration, the test, results day, and the school allocation process.", href: "/bucks-11-plus-timeline" },
      { title: "Registration Guide", description: "Step-by-step instructions for registering your child for the Buckinghamshire Secondary Transfer Test.", href: "/bucks-11-plus-registration" },
      { title: "Common Mistakes to Avoid", description: "The most frequent errors parents and children make during 11+ preparation and on test day.", href: "/bucks-11-plus-mistakes" },
      { title: "Secondary Transfer Test Overview", description: "A detailed look at the Buckinghamshire Secondary Transfer Test structure, sections, and format.", href: "/buckinghamshire-secondary-transfer-test" },
      { title: "Parent Hub", description: "Articles and advice for parents navigating the 11+ journey in Buckinghamshire.", href: "/parent-hub" },
    ],
  },
  {
    heading: "Grammar Schools",
    links: [
      { title: "All 13 Buckinghamshire Grammar Schools", description: "Directory of every grammar school in Buckinghamshire with details on admissions and catchment.", href: "/bucks-grammar-schools" },
    ],
  },
  {
    heading: "Local Area Guides",
    links: [
      { title: "11+ in High Wycombe", description: "Grammar school options and preparation advice for families in the High Wycombe area.", href: "/bucks-11-plus-high-wycombe" },
      { title: "11+ in Aylesbury", description: "Local guide for Aylesbury families preparing for the Secondary Transfer Test.", href: "/bucks-11-plus-aylesbury" },
      { title: "11+ in Beaconsfield", description: "Grammar school access and 11+ preparation for Beaconsfield families.", href: "/bucks-11-plus-beaconsfield" },
      { title: "11+ in Amersham", description: "Nearby grammar schools and preparation resources for families in Amersham and the Chalfonts.", href: "/bucks-11-plus-amersham" },
      { title: "11+ in Chesham", description: "11+ guide for Chesham families including local grammar school options.", href: "/bucks-11-plus-chesham" },
      { title: "11+ in Marlow", description: "Grammar school options and preparation guidance for Marlow-area families.", href: "/bucks-11-plus-marlow" },
      { title: "11+ in Gerrards Cross", description: "Local area guide for Gerrards Cross families considering grammar school places.", href: "/bucks-11-plus-gerrards-cross" },
      { title: "11+ in Princes Risborough", description: "11+ preparation advice for families in the Princes Risborough area.", href: "/bucks-11-plus-princes-risborough" },
    ],
  },
  {
    heading: "Company & Trust",
    links: [
      { title: "About Us", description: "Who we are and why we built an independent 11+ preparation platform for Buckinghamshire families.", href: "/about" },
      { title: "Contact Us", description: "Get in touch with the 11+ Standard team for questions or support.", href: "/contact" },
      { title: "Terms of Service", description: "Terms and conditions governing use of the 11+ Standard platform.", href: "/terms" },
      { title: "Privacy Policy", description: "How we collect, use and protect your personal data.", href: "/privacy" },
      { title: "Safeguarding Policy", description: "Our commitment to child safety and safeguarding responsibilities.", href: "/safeguarding" },
      { title: "Refund Policy", description: "Our refund terms for all subscription tiers.", href: "/refund-policy" },
    ],
  },
];

export default function SiteLinks() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Seo
        title="Site Links | 11+ Standard"
        description="Explore the main pages, tools, guides, and resources on 11+ Standard — Buckinghamshire 11+ exam preparation."
        canonicalPath="/site-links"
      />

      <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-4" data-testid="text-site-links-title">
        Site Links
      </h1>
      <p className="text-muted-foreground max-w-2xl mb-12">
        Use this page to find the most important sections of 11+ Standard. Whether you are looking for preparation tools, 
        guides about the Buckinghamshire 11+, or information about our platform, everything is listed below.
      </p>

      {sections.map((section) => (
        <section key={section.heading} className="mb-12">
          <h2 className="text-xl font-bold text-primary font-serif border-b border-border/50 pb-3 mb-6">
            {section.heading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block p-4 rounded-xl border border-border/40 bg-white hover:border-primary/30 hover:shadow-md transition-all"
                data-testid={`link-site-${link.href.replace(/\//g, '-').replace(/^-/, '')}`}
              >
                <h3 className="font-semibold text-primary group-hover:text-primary/80 transition-colors mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 p-8 rounded-2xl bg-primary text-center">
        <h2 className="text-2xl font-bold text-primary-foreground font-serif mb-3">
          Ready to see where your child stands?
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
          Take our free 8-minute diagnostic to get an instant GL-style readiness score — no account needed.
        </p>
        <Link href="/free-diagnostic">
          <span className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors" data-testid="link-site-cta-diagnostic">
            Take the Free Diagnostic
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

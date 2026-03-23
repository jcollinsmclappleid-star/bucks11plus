import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Article } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo } from "@/components/shared/Seo";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";

export default function ParentHub() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Seo
        title="Parent Hub – Expert 11+ Guides for Bucks Families | Bucks 11 Plus Tests"
        description="Authoritative guides, methodological transparency, and practical advice for parents navigating the Buckinghamshire 11+ Secondary Transfer Test. Free expert articles."
        canonicalPath="/parent-hub"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "The Parent Hub",
          description: "Authoritative guides and practical advice for parents navigating the Buckinghamshire 11+ Secondary Transfer Test.",
          url: "https://bucks11plustest.co.uk/parent-hub",
          publisher: {
            "@type": "Organization",
            name: "Bucks 11 Plus Tests",
            url: "https://bucks11plustest.co.uk",
          },
        }}
      />

      <div className="mb-10 not-prose">
        <div className="border-l-4 border-primary pl-5 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-3 font-serif">The Parent Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Authoritative guides, methodological transparency, and practical advice for navigating the Buckinghamshire 11+.
          </p>
        </div>
        <SubscribeCTA />
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))
          ) : (
            articles?.map((article) => (
              <article key={article.slug} className="group cursor-pointer">
                <Link href={`/parent-hub/${article.slug}`} className="block space-y-3" data-testid={`link-article-${article.slug}`}>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-brand-primary" data-testid={`text-article-category-${article.slug}`}>{article.category}</span>
                    <span>•</span>
                    <span data-testid={`text-article-readtime-${article.slug}`}>{article.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary group-hover:text-brand-amber transition-colors font-serif" data-testid={`text-article-title-${article.slug}`}>
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-article-excerpt-${article.slug}`}>
                    {article.excerpt}
                  </p>
                  <div className="text-brand-primary font-medium text-sm flex items-center gap-1">
                    Read article <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                 <img src="/logo.png" alt="" className="w-24 h-24 grayscale" />
            </div>
            <div className="relative z-10">
              <h3 className="font-serif font-bold text-primary text-xl mb-3">Free Assessment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stop guessing. Find out exactly where your child stands relative to the 121 standard in just 8 minutes.
              </p>
              <Link href="/sign-up" className="block w-full py-2.5 px-4 bg-primary text-primary-foreground text-center rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm" data-testid="link-start-diagnostic-sidebar">
                Start Diagnostic
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Practice Advice</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Planning</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Wellbeing</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

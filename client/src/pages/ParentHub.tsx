import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

export default function ParentHub() {
  const articles = [
    {
      slug: "understanding-the-bucks-121-benchmark",
      title: "Understanding the Bucks 121 Benchmark",
      excerpt: "What does the 121 score actually mean, and how is it standardized across different age groups in Buckinghamshire?",
      category: "Methodology",
      readTime: "5 min read"
    },
    {
      slug: "verbal-reasoning-speed-strategies",
      title: "Pacing Strategies for Verbal Reasoning",
      excerpt: "With only 35 seconds per question on average, pacing in the VR section is critical. Learn how to stop your child from getting stuck.",
      category: "Practice Advice",
      readTime: "4 min read"
    },
    {
      slug: "how-to-structure-the-final-12-weeks",
      title: "Structuring the Final 12 Weeks of 11+ Prep",
      excerpt: "A week-by-week guide to balancing mock exams, targeted drills, and rest before the September test dates.",
      category: "Planning",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Seo 
        title="Parent Hub | 11+ Standard" 
        description="Authoritative guides, methodological transparency, and practical advice for navigating the Buckinghamshire 11+." 
      />
      <div className="mb-16 border-b border-border/50 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">The Parent Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Authoritative guides, methodological transparency, and practical advice for navigating the Buckinghamshire 11+.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {articles.map((article) => (
            <article key={article.slug} className="group cursor-pointer">
              <Link href={`/parent-hub/${article.slug}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-brand-primary">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary group-hover:text-brand-amber transition-colors font-serif">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="text-brand-primary font-medium text-sm flex items-center gap-1">
                    Read article <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-border/50">
            <h3 className="font-serif font-bold text-primary text-xl mb-3">Free Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stop guessing. Find out exactly where your child stands relative to the 121 standard in just 12 minutes.
            </p>
            <Link href="/app">
              <a className="block w-full py-2.5 px-4 bg-primary text-primary-foreground text-center rounded-md font-medium hover:bg-primary/90 transition-colors">
                Start Diagnostic
              </a>
            </Link>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Methodology (4)</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Practice Advice (12)</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Planning (5)</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Wellbeing (3)</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
import { Link } from "wouter";
import { learnArticles, LEARN_CATEGORIES, getArticlesByCategory } from "@/data/learn-articles";

const CATEGORY_ICONS: Record<string, string> = {
  "Understanding the Test": "📋",
  "Grammar Schools & Admissions": "🏫",
  "Preparation Strategy": "📅",
  "Subject Guides": "📚",
  "Test Day & After": "🗓️",
  "Other Guides": "📄",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Understanding the Test": "What the Bucks 11 plus tests, how scoring works, the GL Assessment format, and everything you need to know about the Secondary Transfer Test.",
  "Grammar Schools & Admissions": "The 13 Buckinghamshire grammar schools, catchment areas, distance cut-offs, and how to plan your admissions strategy.",
  "Preparation Strategy": "When to start, how to self-prepare, mock tests, practice paper strategy, and timing — the complete preparation roadmap.",
  "Subject Guides": "Deep dives into verbal reasoning, maths, NVR, spatial reasoning, comprehension, and reading — with question-type strategies and practice examples.",
  "Test Day & After": "Test day logistics, results, appeals, what happens if your child doesn't qualify, Year 9 entry, and all the next steps.",
  "Other Guides": "Additional guides covering related topics for Bucks families.",
};

export default function LearnHub() {
  const totalArticles = learnArticles.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground/80 text-sm font-medium px-3 py-1 rounded-full mb-4">
            Free Resource Hub
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Buckinghamshire 11+ Learning Hub
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {totalArticles} in-depth guides covering every aspect of the Bucks Secondary Transfer Test — from understanding how it works to what happens on results day.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="space-y-14">
          {LEARN_CATEGORIES.map((category) => {
            const articles = getArticlesByCategory(category);
            if (articles.length === 0) return null;
            return (
              <section key={category}>
                <div className="flex items-start gap-3 mb-6">
                  <span className="text-2xl mt-0.5" aria-hidden="true">{CATEGORY_ICONS[category]}</span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">{category}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{CATEGORY_DESCRIPTIONS[category]}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/learn/${article.slug}`}
                      data-testid={`link-article-${article.slug}`}
                      className="group block bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug text-sm mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                      <span className="inline-block mt-3 text-xs font-medium text-primary group-hover:underline">
                        Read guide →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Ready to assess where your child stands?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Take our free 40-question GL-style diagnostic. No account needed — get a full report in under 45 minutes.
          </p>
          <Link href="/free-diagnostic">
            <button
              data-testid="button-hub-cta-diagnostic"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Free Diagnostic
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

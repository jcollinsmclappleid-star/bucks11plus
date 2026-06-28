import { Link, useParams } from "wouter";
import { getArticleBySlug, getArticlesByCategory, learnArticles } from "@/data/learn-articles";
import { Seo } from "@/components/shared/Seo";
import NotFound from "@/pages/not-found";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import { SeoConversionPanel } from "@/components/shared/SeoConversionPanel";
import { GuideConversionBlock } from "@/components/shared/GuideConversionBlock";

export default function LearnArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);

  if (!article) return <NotFound />;

  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.slug !== article.slug)
    .slice(0, 3);

  const currentIndex = learnArticles.findIndex(a => a.slug === slug);
  const prevArticle = currentIndex > 0 ? learnArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < learnArticles.length - 1 ? learnArticles[currentIndex + 1] : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `https://bucks11plustest.co.uk/learn/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Bucks 11 Plus Tests",
      url: "https://bucks11plustest.co.uk",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bucks11plustest.co.uk/learn/${article.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bucks11plustest.co.uk" },
        { "@type": "ListItem", position: 2, name: "Learning Hub", item: "https://bucks11plustest.co.uk/learn" },
        { "@type": "ListItem", position: 3, name: article.title, item: `https://bucks11plustest.co.uk/learn/${article.slug}` },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${article.title} | Bucks 11 Plus Tests`}
        description={article.description}
        canonicalPath={`/learn/${article.slug}`}
        schema={articleSchema}
      />

      <div className="bg-muted/30 border-b border-border py-3">
        <div className="container mx-auto max-w-4xl px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-xs">{article.category}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4" data-testid="text-article-category">
            {article.category}
          </span>
        </div>

        <SeoConversionPanel variant="learn" />

        <article
          className="prose prose-slate max-w-none
            prose-h1:font-serif prose-h1:text-3xl prose-h1:font-bold prose-h1:text-foreground prose-h1:mb-6 prose-h1:leading-tight
            prose-h2:font-serif prose-h2:text-xl prose-h2:font-bold prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-3
            prose-h3:font-semibold prose-h3:text-base prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-muted-foreground prose-li:mb-1
            prose-strong:text-foreground"
          data-testid="article-content"
          dangerouslySetInnerHTML={{ __html: styledContent(article.content) }}
        />

        <ChildExperienceCTA />

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
          {prevArticle ? (
            <Link
              href={`/learn/${prevArticle.slug}`}
              data-testid="link-prev-article"
              className="group flex items-start gap-3 flex-1 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all"
            >
              <span className="text-muted-foreground mt-0.5 text-lg">←</span>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Previous</div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prevArticle.title}
                </div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextArticle ? (
            <Link
              href={`/learn/${nextArticle.slug}`}
              data-testid="link-next-article"
              className="group flex items-start gap-3 flex-1 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-right"
            >
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Next</div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {nextArticle.title}
                </div>
              </div>
              <span className="text-muted-foreground mt-0.5 text-lg">→</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Related Guides</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedArticles.map(related => (
                <Link
                  key={related.slug}
                  href={`/learn/${related.slug}`}
                  data-testid={`link-related-${related.slug}`}
                  className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                    {related.title}
                  </h3>
                  <span className="text-xs text-primary font-medium">Read guide →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <GuideConversionBlock className="mt-10" hideQuestions />

        <SubscribeCTA />

        <div className="mt-6 flex gap-3">
          <Link href="/learn">
            <button
              data-testid="button-article-back-to-hub"
              className="text-sm px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              ← All Guides
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function styledContent(html: string): string {
  return html
    .replace(
      /<div class="keytakeaways">/g,
      `<div class="my-6 bg-green-50 border border-green-200 rounded-xl p-5">`
    )
    .replace(
      /<div class="faq">/g,
      `<div class="my-8 border border-border rounded-xl p-6 bg-muted/20">`
    );
}

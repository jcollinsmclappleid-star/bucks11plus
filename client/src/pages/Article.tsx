import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { SubscribeCTA } from "../components/shared/SubscribeCTA";
import { useQuery } from "@tanstack/react-query";
import { type Article } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Article() {
  const { slug } = useParams();
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <article className="container mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="h-4 w-32 mb-12" />
        <div className="space-y-4 mb-12">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </article>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/parent-hub" className="text-brand-primary hover:underline mt-4 block">
          Back to Parent Hub
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-16">
      <Seo 
        title={`${article.title} | Bucks 11 Plus Tests Hub`} 
        description={article.excerpt} 
      />

      <Link href="/parent-hub" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12" data-testid="link-back-hub">
        <ArrowLeft className="h-4 w-4" /> Back to Parent Hub
      </Link>

      <div className="border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-4 py-6 mb-10">
        <div className="flex items-center gap-3 text-sm text-brand-amber font-semibold mb-3">
          <span data-testid="text-article-category">{article.category}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal" data-testid="text-article-readtime">{article.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight leading-tight mb-3" data-testid="text-article-title">
          {article.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed" data-testid="text-article-excerpt">
          {article.excerpt}
        </p>
      </div>

      <SubscribeCTA />

      <div 
        className="prose prose-slate prose-lg max-w-none" 
        dangerouslySetInnerHTML={{ __html: article.content }} 
        data-testid="text-article-content"
      />
      
      <div className="mt-16 pt-8 border-t border-border/50">
        <div className="bg-primary text-primary-foreground p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold font-serif mb-4">Stop guessing your child's readiness</h3>
          <p className="mb-6 opacity-90">Take our free 8-minute diagnostic to see their current trajectory toward the 121 standard.</p>
          <Link href="/free-diagnostic" className="inline-block bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-slate-100 transition-colors" data-testid="link-start-diagnostic">
            Start Free Diagnostic
          </Link>
        </div>
      </div>
    </article>
  );
}
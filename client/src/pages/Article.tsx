import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Article() {
  const { slug } = useParams();
  
  // Mock data for the article based on the slug
  const title = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Article Title";

  return (
    <article className="container mx-auto max-w-3xl px-4 py-16">
      <Seo 
        title={`${title} | 11+ Standard Hub`} 
        description={`Read about ${title} and how to prepare for the Bucks 11+ assessment.`} 
      />

      <Link href="/parent-hub" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to Parent Hub
      </Link>

      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-3 text-sm text-brand-primary font-medium">
          <span>Methodology</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">5 min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Understanding the nuanced requirements of the Buckinghamshire GL Assessment is the first step toward effective preparation.
        </p>
      </div>

      <div className="prose prose-slate prose-lg max-w-none">
        <p>
          In Buckinghamshire, the 11+ grammar school assessment is provided by GL Assessment. Unlike typical school tests, it is heavily time-pressured and deeply standardized. A raw score is not enough; the score must be standardized against the cohort to produce the final result. The "pass mark" required to automatically qualify for a grammar school place is strictly set at 121.
        </p>

        <h2 className="text-primary font-serif">What does 121 actually mean?</h2>
        <p>
          The 121 score is an age-standardized score. It adjusts a child's raw score to account for their exact age at the time of taking the test. This means a child born in August (the youngest in the academic year) does not have to achieve the same raw score as a child born in September to reach the 121 benchmark.
        </p>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 my-8">
          <h3 className="text-primary font-serif mt-0">The Age Standardization Reality</h3>
          <p className="mb-0 text-slate-700">
            Many parents mistakenly believe age standardization provides a massive boost to younger children. In reality, the difference might be only 2-3 raw marks across the entire paper. Accuracy remains the dominant factor.
          </p>
        </div>

        <h2 className="text-primary font-serif">Why Pacing is the Hidden Killer</h2>
        <p>
          The most common reason for failing to reach 121 is not a lack of academic capability, but poor pacing. Children who dwell on a difficult Verbal Reasoning logic puzzle for two minutes will inevitably run out of time at the end of the section, sacrificing 4-5 easier marks in the process.
        </p>
        <p>
          At 11+ Standard, our diagnostic doesn't just measure if the answer was right; it measures <em>how long it took</em>. If a child answers a Maths word problem correctly but takes 90 seconds (instead of the expected 45 seconds), our forecast engine flags this as a critical vulnerability.
        </p>
      </div>
      
      <div className="mt-16 pt-8 border-t border-border/50">
        <div className="bg-primary text-primary-foreground p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold font-serif mb-4">Stop guessing your child's readiness</h3>
          <p className="mb-6 opacity-90">Take our free 12-minute diagnostic to see their current trajectory toward the 121 standard.</p>
          <Link href="/app" className="inline-block bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-slate-100 transition-colors">
            Start Free Diagnostic
          </Link>
        </div>
      </div>
    </article>
  );
}
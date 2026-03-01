import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function Pricing() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-20">
      <Seo 
        title="Pricing | 11+ Standard" 
        description="Invest in targeted 11+ readiness. View our monthly subscription and 12-week intensive pack options." 
      />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Invest in Targeted Readiness</h1>
        <p className="text-xl text-muted-foreground">
          Stop guessing. Get the exact roadmap your child needs to reach the 121 Bucks standard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly */}
        <Card className="border-border/60 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
            <CardDescription>Flexible preparation on your timeline.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">£29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              {[
                "Unlimited Practice Drills",
                "2 Full Diagnostics per month",
                "Advanced Readiness Forecast",
                "Downloadable PDF Reports",
                "Cancel anytime"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground" size="lg" asChild>
              <Link href="/sign-up">Subscribe Monthly</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* 12-Week Pack */}
        <Card className="border-primary border-2 shadow-md relative flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">12-Week Intensive</CardTitle>
            <CardDescription>The complete run-up to the assessment.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">£75</span>
              <span className="text-muted-foreground"> one-time</span>
            </div>
            <ul className="space-y-3">
              {[
                "Everything in Monthly",
                "12 Full Diagnostics included",
                "Weekly priority focus emails",
                "Historical trend analysis",
                "Saves 15% compared to monthly"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground" size="lg" asChild>
              <Link href="/sign-up">Get 12-Week Pack</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* SEO Text / FAQ Teaser */}
      <div className="mt-24 max-w-3xl mx-auto prose prose-slate">
        <h2 className="text-primary font-serif text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-primary">How does the 11+ Standard forecast work?</h3>
            <p className="text-muted-foreground">Our forecast engine maps your child's accuracy and pacing directly against historic Buckinghamshire GL Assessment benchmarks, focusing on the crucial 121 qualifying score.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Can I just try it out?</h3>
            <p className="text-muted-foreground">Yes, our <Link href="/app"><a className="text-brand-primary underline">Mini Diagnostic</a></Link> is completely free and takes only 12 minutes to give you a baseline readiness band.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
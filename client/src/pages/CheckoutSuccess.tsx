import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight, ClipboardList } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";

function tierLabel(tier: string): string {
  if (tier === "pack_annual") return "Bucks Plus Edge — Annual";
  return "Bucks Plus Edge";
}

const ACTIVATION_STEPS = [
  { label: "Complete your child profile in onboarding", href: "/app/onboarding" },
  { label: "Run a full readiness check to establish a baseline", href: "/app/diagnostic" },
  { label: "Start your first targeted practice drill", href: "/app/practice" },
];

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tier = params.get("tier") || "pack_plus";
  const sessionId = params.get("session_id");
  const { user, isLoading } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      const complete = async () => {
        try {
          await apiRequest("POST", "/api/checkout/complete", { tier, session_id: sessionId });
          queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
          setActivated(true);
          setProcessing(false);
        } catch {
          setError("Failed to activate your plan. Please contact support.");
          setProcessing(false);
        }
      };
      complete();
    } else {
      setProcessing(false);
    }
  }, [user, isLoading, tier, sessionId]);

  const planName = tierLabel(tier);

  if (processing) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Seo title="Payment Successful | Bucks 11 Plus Tests" description="Your payment was successful." />
        <Card className="border-green-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold text-primary font-serif">Processing your payment...</h1>
            <p className="text-muted-foreground">This will only take a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user && !activated) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Seo title="Payment Successful | Bucks 11 Plus Tests" description="Your payment was successful. Create your account to get started." />
        <Card className="border-green-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-success-title">Payment Confirmed</h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Your {planName} plan has been secured. Create your account now to activate access and begin your child's preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button variant="cta" size="lg" asChild data-testid="button-create-account">
                <Link href={`/sign-up?redirect=checkout&tier=${tier}&session_id=${sessionId}`}>
                  Create Account &amp; Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Already have an account?{" "}
              <Link href={`/sign-in?redirect=${encodeURIComponent(`/app/checkout-success?tier=${tier}&session_id=${sessionId}`)}`} className="text-primary font-medium underline">
                Sign in
              </Link>{" "}
              to activate your plan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <Seo title="Payment Successful | Bucks 11 Plus Tests" description="Your payment was successful." />
      <Card className="border-green-200 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6">
          {error ? (
            <>
              <h1 className="text-2xl font-bold text-red-600 font-serif">Something went wrong</h1>
              <p className="text-muted-foreground">{error}</p>
              <Button asChild>
                <Link href="/app">Go to Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-success-title">
                Welcome to {planName}!
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Your plan is active. You now have full access to every Bucks Plus Edge feature.
              </p>

              <div className="w-full max-w-md text-left rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <p className="font-bold text-primary text-sm">Your first three steps</p>
                </div>
                <ol className="space-y-3">
                  {ACTIVATION_STEPS.map((step, i) => (
                    <li key={step.href} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                        {i + 1}
                      </span>
                      <Link href={step.href} className="hover:text-primary hover:underline pt-0.5">
                        {step.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="text-xs text-muted-foreground">3-day money-back guarantee · Cancel anytime from your account</p>

              <Button variant="cta" size="lg" asChild data-testid="button-go-dashboard">
                <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

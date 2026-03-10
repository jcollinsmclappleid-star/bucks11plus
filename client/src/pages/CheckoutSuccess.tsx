import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useAuth } from "../lib/auth";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tier = params.get("tier") || "pack12";
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
        } catch (err: any) {
          setError("Failed to activate your plan. Please contact support.");
          setProcessing(false);
        }
      };
      complete();
    } else {
      setProcessing(false);
    }
  }, [user, isLoading, tier]);

  const tierLabel = tier === "programme16" ? "Young Scholar Programme" : "Practice Platform";

  if (processing) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Seo title="Payment Successful | 11+ Standard" description="Your payment was successful." />
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
        <Seo title="Payment Successful | 11+ Standard" description="Your payment was successful. Create your account to get started." />
        <Card className="border-green-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-success-title">Payment Confirmed</h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Your {tierLabel} has been secured. Create your account now to activate access and begin your child's preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button size="lg" className="bg-primary" asChild data-testid="button-create-account">
                <Link href={`/sign-up?redirect=checkout&tier=${tier}&session_id=${sessionId}`}>
                  Create Account &amp; Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Already have an account? <Link href={`/sign-in?redirect=/app/checkout-success?tier=${tier}&session_id=${sessionId}`} className="text-primary font-medium underline">Sign in</Link> to activate your plan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <Seo title="Payment Successful | 11+ Standard" description="Your payment was successful." />
      <Card className="border-green-200 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
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
              <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-success-title">Welcome to {tierLabel}!</h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Your plan has been activated. You now have full access to all features included in your plan.
              </p>
              <div className="flex gap-3 mt-4">
                {tier === "programme16" ? (
                  <Button size="lg" className="bg-primary" asChild data-testid="button-go-programme">
                    <Link href="/app/programme">View Your Programme <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-primary" asChild data-testid="button-go-dashboard">
                    <Link href="/app">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

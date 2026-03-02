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
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const complete = async () => {
      try {
        await apiRequest("POST", "/api/checkout/complete", { tier, session_id: sessionId });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setProcessing(false);
      } catch (err: any) {
        setError("Failed to activate your plan. Please contact support.");
        setProcessing(false);
      }
    };
    complete();
  }, [user, tier]);

  const tierLabel = tier === "programme16" ? "Structured Readiness Programme" : "Practice Pack";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <Seo title="Payment Successful | 11+ Standard" description="Your payment was successful." />
      <Card className="border-green-200 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          {processing ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h1 className="text-2xl font-bold text-primary font-serif">Activating your plan...</h1>
              <p className="text-muted-foreground">This will only take a moment.</p>
            </>
          ) : error ? (
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

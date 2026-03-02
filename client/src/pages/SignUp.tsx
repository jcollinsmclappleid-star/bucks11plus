import { Link, useLocation, useSearch } from "wouter";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seo } from "../components/shared/Seo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "../lib/queryClient";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const redirectParam = params.get("redirect");
  const tierParam = params.get("tier");
  const guestSessionParam = params.get("guestSession");

  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(username, password);

      if (guestSessionParam) {
        try {
          await apiRequest("POST", `/api/guest/claim/${guestSessionParam}`);
        } catch {
        }
      }

      if (redirectParam === "checkout" && tierParam) {
        setLocation(`/app/onboarding?redirect=checkout&tier=${tierParam}`);
      } else {
        setLocation("/app/onboarding");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showGuestNote = !!guestSessionParam;
  const showCheckoutNote = redirectParam === "checkout" && tierParam;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <Seo title="Sign Up | 11+ Standard" description="Create an account to start your child's 11+ readiness journey." />
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif text-primary">Create Account</CardTitle>
          <CardDescription>
            {showCheckoutNote
              ? `Create your account to continue to checkout`
              : showGuestNote
                ? "Save your diagnostic results and unlock full access"
                : "Start your structured 11+ preparation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showGuestNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
              Your free diagnostic results will be saved to your new account.
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                data-testid="input-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-primary"
              disabled={isLoading}
              data-testid="button-signup"
            >
              {isLoading ? "Creating Account..." : showCheckoutNote ? "Create Account & Continue" : "Create Account"}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

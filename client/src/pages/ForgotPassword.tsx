import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../lib/queryClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest("POST", "/api/auth/forgot-password", { email });
      const data = await res.json();
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg" data-testid="card-forgot-password">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-serif text-primary" data-testid="text-forgot-title">
            {sent ? "Check your email" : "Forgot your password?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-brand-green" />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed" data-testid="text-forgot-sent">
                If an account with <strong>{email}</strong> exists, we've sent a password reset link. Check your inbox (and spam folder) — the link expires in 1 hour.
              </p>
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => { setSent(false); setEmail(""); }} data-testid="button-try-again">
                  Try a different email
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/sign-in" data-testid="link-back-signin">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the email address linked to your account and we'll send you a link to reset your password.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    data-testid="input-forgot-email"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" data-testid="text-forgot-error">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading || !email} data-testid="button-send-reset">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Reset Link
              </Button>

              <Button variant="ghost" className="w-full" asChild>
                <Link href="/sign-in" data-testid="link-back-signin">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

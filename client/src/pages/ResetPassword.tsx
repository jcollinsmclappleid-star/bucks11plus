import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { apiRequest } from "../lib/queryClient";

export default function ResetPassword() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest("POST", "/api/auth/reset-password", { token, password });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-primary">Invalid Reset Link</h2>
            <p className="text-slate-600 text-sm">This password reset link is invalid or has expired.</p>
            <Button asChild className="w-full">
              <Link href="/forgot-password" data-testid="link-request-new">Request a New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg" data-testid="card-reset-password">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-serif text-primary" data-testid="text-reset-title">
            {success ? "Password Updated" : "Set a New Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-brand-green" />
              </div>
              <p className="text-slate-600 text-sm" data-testid="text-reset-success">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Button className="w-full" asChild>
                <Link href="/sign-in" data-testid="link-signin-after-reset">Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-slate-600 text-sm">Choose a new password for your account.</p>

              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="pl-10"
                    data-testid="input-new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="pl-10"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" data-testid="text-reset-error">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading || !password || !confirm} data-testid="button-reset-password">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Reset Password
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

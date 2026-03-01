import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seo } from "../components/shared/Seo";

export default function SignIn() {
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login, go to dashboard
    setLocation("/app");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <Seo title="Sign In | 11+ Standard" description="Sign in to your 11+ Standard parent dashboard." />
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your parent dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="parent@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-brand-primary hover:underline">Forgot password?</a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-primary">
              Sign In
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
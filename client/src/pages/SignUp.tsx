import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seo } from "../components/shared/Seo";

export default function SignUp() {
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup, go to onboarding
    setLocation("/app/onboarding");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <Seo title="Sign Up | 11+ Standard" description="Create an account to start your child's 11+ readiness journey." />
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif text-primary">Create Account</CardTitle>
          <CardDescription>Start your structured 11+ preparation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Parent Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="parent@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-primary">
              Create Account
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/sign-in"><a className="font-medium text-primary hover:underline">Sign in</a></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
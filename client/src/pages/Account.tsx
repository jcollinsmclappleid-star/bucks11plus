import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, CreditCard, User } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { Link } from "wouter";

export default function Account() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <Seo title="Account | 11+ Standard" description="Manage your account settings and subscription." />
      
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Account Settings</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav */}
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="secondary" className="justify-start gap-2 text-primary font-medium w-full">
            <User className="h-4 w-4" /> Profile Details
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground w-full">
            <CreditCard className="h-4 w-4" /> Subscription
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground w-full">
            <Settings className="h-4 w-4" /> Preferences
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your access to 11+ Standard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-primary text-lg">Free Tier</span>
                    <Badge variant="secondary" className="bg-slate-200">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Limited to Mini Diagnostic and basic drills.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Child Profile</CardTitle>
              <CardDescription>These details inform the forecast engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Year Group</label>
                  <div className="font-medium text-primary">Year 5</div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Targeting</label>
                  <div className="font-medium text-primary">Bucks Grammar (121)</div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Test Window</label>
                  <div className="font-medium text-primary">September</div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Hardest Area</label>
                  <div className="font-medium text-primary">Verbal Reasoning</div>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-border/50">
                <Button variant="outline" size="sm">Retake Onboarding Questionnaire</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
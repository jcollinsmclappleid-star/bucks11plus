import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

export default function AccountDeleted() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Seo title="Account Deleted | Bucks 11 Plus Tests" description="Your account has been deleted." />
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-bold text-2xl text-slate-900">Account deleted successfully</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your account has been deleted successfully. Any active subscription has been cancelled and you will not be charged again.
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <Button asChild className="w-full" data-testid="button-return-home">
            <Link href="/">Return to homepage</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            If you have any questions, please contact us at{" "}
            <a href="mailto:support@11plustesthub.co.uk" className="text-primary underline">
              support@11plustesthub.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

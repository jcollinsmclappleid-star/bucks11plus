import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function DiagnosticStart() {
  const { id } = useParams();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Seo title="Start Diagnostic | 11+ Standard" description="Begin your 11+ diagnostic assessment." />
      
      <div className="mb-8">
        <Link href="/app/diagnostic">
          <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">← Back to Diagnostics</a>
        </Link>
      </div>

      <Card className="border-border/60 shadow-lg overflow-hidden">
        <div className="bg-primary p-8 text-center border-b border-primary-foreground/10">
          <Badge className="bg-white/20 text-white hover:bg-white/20 mb-4 inline-flex">Diagnostic Assessment</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground font-serif tracking-tight">
            {id === 'mini-1' ? 'Mini Diagnostic' : 'Diagnostic A'}
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            This assessment is designed to measure both your child's accuracy and pacing across core 11+ topics.
          </p>
        </div>

        <CardContent className="p-8 space-y-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary">{id === 'mini-1' ? '12' : '45'}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="font-bold text-xl text-primary">{id === 'mini-1' ? '12' : '45'}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <AlertCircle className="h-6 w-6 text-brand-amber mx-auto mb-2" />
              <div className="font-bold text-xl text-brand-amber">Strict</div>
              <div className="text-sm text-muted-foreground">Pacing</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-primary">Instructions for Parents:</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">1</span>
                Ensure your child is in a quiet room free from distractions.
              </li>
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">2</span>
                Provide them with rough paper and a pencil for working out.
              </li>
              <li className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">3</span>
                Do not help them with the answers. The forecast engine needs an honest baseline.
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-border/50 text-center">
            <Button size="lg" className="h-14 px-12 text-lg bg-primary w-full sm:w-auto" asChild>
              <Link href={`/app/test/${id}`}>Begin Assessment Now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline fallback for missing Badge component if needed, but it's imported in other places via ui/badge.
function Badge({ children, className }: any) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}
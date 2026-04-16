import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Lock } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { type TestSession } from "@shared/schema";
import { useAuth } from "../lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function ReportArchive() {
  const { user, hasPaidAccess } = useAuth();
  const { data: sessions, isLoading } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
    enabled: !!user,
  });
  const completedSessions = sessions?.filter(s => s.completedAt) || [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Report Archive | Bucks 11 Plus Tests" description="Download historical PDF readiness reports for your child's 11+ preparation." />
      
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Report Archive</h1>
        <p className="text-muted-foreground mt-2">Download comprehensive PDF readiness reports from past sessions.</p>
      </div>

      <div className="relative">
        {!hasPaidAccess() && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center border border-slate-200 rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-slate-100">
              <Lock className="h-8 w-8 text-brand-amber" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 font-serif">Unlock Report Archive</h3>
            <p className="text-slate-600 max-w-md mb-6">
              Subscribers can download highly detailed PDF readiness reports for every session, perfect for sharing with tutors or keeping offline records.
            </p>
            <Button size="lg" className="bg-primary shadow-lg" asChild data-testid="button-upgrade-reports">
              <Link href="/pricing">View Upgrade Options</Link>
            </Button>
          </div>
        )}

        <div className={`space-y-4 ${!hasPaidAccess() ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : completedSessions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-muted-foreground">No completed assessments found.</p>
              <Button variant="link" asChild>
                <Link href="/app/diagnostics">Take a readiness check</Link>
              </Button>
            </div>
          ) : (
            completedSessions.map((report) => (
              <Card key={report.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary" data-testid={`text-report-name-${report.id}`}>
                        Diagnostic {report.diagnosticId.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span data-testid={`text-report-date-${report.id}`}>
                          {report.completedAt ? format(new Date(report.completedAt), 'MMM d, yyyy') : 'N/A'}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">Assessment Report</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right hidden sm:block">
                      <div className="font-bold text-primary text-xl" data-testid={`text-report-score-${report.id}`}>{report.forecastScore}</div>
                      <div className="text-xs text-muted-foreground" data-testid={`text-report-band-${report.id}`}>{report.band}</div>
                    </div>
                    <Button variant="outline" className="gap-2 shrink-0" data-testid={`button-download-report-${report.id}`}>
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
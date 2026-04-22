import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2, Lock, ArrowRight } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { type TestSession } from "@shared/schema";
import { useAuth } from "../lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

function sessionLabel(diagnosticId: string): string {
  if (diagnosticId.startsWith("practice-")) {
    const type = diagnosticId.replace("practice-", "");
    const labels: Record<string, string> = { quick: "Quick Paper", full: "Full Paper", mock: "Mock Exam" };
    return labels[type] || "Practice Paper";
  }
  return diagnosticId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function bandColour(band: string | null) {
  if (!band) return "bg-slate-100 text-slate-600";
  const b = band.toLowerCase();
  if (b.includes("high") || b.includes("ready") || b.includes("strong")) return "bg-green-100 text-green-800";
  if (b.includes("mid") || b.includes("developing")) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function PdfDownloadButton({ sessionId, completedAt }: { sessionId: string; completedAt?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/test-sessions/${sessionId}/pdf`, { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "PDF generation failed");
      }
      const blob = await res.blob();
      const dateStr = completedAt
        ? new Date(completedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `bucks-11plus-report-${dateStr}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e: any) {
      setError(e.message || "Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        className="gap-2 shrink-0"
        onClick={handleDownload}
        disabled={loading}
        data-testid={`button-download-report-${sessionId}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Generating…" : "Download PDF"}
      </Button>
      {error && <p className="text-xs text-red-600 max-w-[180px] text-right">{error}</p>}
    </div>
  );
}

export default function ReportArchive() {
  const { user, hasPaidAccess } = useAuth();

  const { data: sessions, isLoading } = useQuery<TestSession[]>({
    queryKey: ["/api/test-sessions"],
    enabled: !!user,
  });

  const completedSessions = (sessions || [])
    .filter(s => s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo
        title="Report Archive | Bucks 11 Plus Tests"
        description="Download PDF reports for all completed readiness checks and practice papers."
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-report-archive-title">
            Report Archive
          </h1>
          <p className="text-muted-foreground mt-2">
            Download PDF readiness reports from completed sessions.
          </p>
        </div>
        <Button asChild variant="outline" data-testid="link-back-to-diagnostics">
          <Link href="/app/diagnostic">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Readiness Checks
          </Link>
        </Button>
      </div>

      <div className="relative">
        {!hasPaidAccess() && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center border border-slate-200 rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-slate-100">
              <Lock className="h-8 w-8 text-brand-amber" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 font-serif">Unlock Report Archive</h3>
            <p className="text-slate-600 max-w-md mb-6">
              Subscribers can download detailed PDF readiness reports for every session — perfect for sharing with tutors or keeping offline records.
            </p>
            <Button size="lg" className="bg-primary shadow-lg" asChild data-testid="button-upgrade-reports">
              <Link href="/pricing">View Upgrade Options</Link>
            </Button>
          </div>
        )}

        <div className={`space-y-4 ${!hasPaidAccess() ? "opacity-40 pointer-events-none select-none" : ""}`}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : completedSessions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">No completed assessments yet.</p>
              <Button variant="link" asChild data-testid="link-start-diagnostic">
                <Link href="/app/diagnostic">Take a readiness check</Link>
              </Button>
            </div>
          ) : (
            completedSessions.map((report) => (
              <Card key={report.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-report-${report.id}`}>
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-primary truncate" data-testid={`text-report-name-${report.id}`}>
                        {sessionLabel(report.diagnosticId)}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
                        <span data-testid={`text-report-date-${report.id}`}>
                          {report.completedAt
                            ? new Date(report.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                            : "N/A"}
                        </span>
                        {report.forecastScore != null && (
                          <span className="font-semibold text-foreground" data-testid={`text-report-score-${report.id}`}>
                            Score: {report.forecastScore}
                          </span>
                        )}
                        {report.band && (
                          <Badge className={`text-xs ${bandColour(report.band)}`} data-testid={`text-report-band-${report.id}`}>
                            {report.band}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button variant="ghost" size="sm" asChild data-testid={`button-view-results-${report.id}`}>
                      <Link href={`/app/results/${report.id}`}>View Results</Link>
                    </Button>
                    <PdfDownloadButton sessionId={report.id} completedAt={report.completedAt ? String(report.completedAt) : undefined} />
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

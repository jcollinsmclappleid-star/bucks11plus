import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, X, Download, FileText, Lock } from "lucide-react";
import { Seo } from "../components/shared/Seo";

export default function ReportArchive() {
  const isPremium = false; // Mock state

  const reports = [
    { id: 1, date: "Oct 12, 2023", name: "Diagnostic B", score: 118, band: "Within Reach", type: "Full" },
    { id: 2, date: "Sep 28, 2023", name: "Diagnostic A", score: 114, band: "Clear Improvement", type: "Full" },
    { id: 3, date: "Sep 14, 2023", name: "Mini Diagnostic", score: 105, band: "Clear Improvement", type: "Mini" },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Report Archive | 11+ Standard" description="Download historical PDF reports of your child's 11+ diagnostics." />
      
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Report Archive</h1>
        <p className="text-muted-foreground mt-2">Download comprehensive PDF summaries of past diagnostics.</p>
      </div>

      <div className="relative">
        {!isPremium && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center border border-slate-200 rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-slate-100">
              <Lock className="h-8 w-8 text-brand-amber" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 font-serif">Unlock Report Archive</h3>
            <p className="text-slate-600 max-w-md mb-6">
              Premium users can download highly detailed PDF reports for every diagnostic, perfect for sharing with tutors or keeping offline records.
            </p>
            <Button size="lg" className="bg-primary shadow-lg" asChild>
              <Link href="/pricing">Upgrade to Premium</Link>
            </Button>
          </div>
        )}

        <div className={`space-y-4 ${!isPremium ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          {reports.map((report) => (
            <Card key={report.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">{report.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{report.type} Assessment</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-primary text-xl">{report.score}</div>
                    <div className="text-xs text-muted-foreground">{report.band}</div>
                  </div>
                  <Button variant="outline" className="gap-2 shrink-0">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
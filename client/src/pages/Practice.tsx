import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { useQuery } from "@tanstack/react-query";
import { type PracticeSection } from "@shared/schema";
import { useAuth } from "../lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

const TIER_RANK: Record<string, number> = { free: 0, pack12: 1, programme16: 2 };

export default function Practice() {
  const { user, hasPaidAccess } = useAuth();
  const { data: sections, isLoading } = useQuery<PracticeSection[]>({
    queryKey: ["/api/practice-sections"],
  });

  const categories = sections ? Array.from(new Set(sections.map(s => s.category))) : [];
  const userRank = TIER_RANK[user?.subscriptionTier || "free"] || 0;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo 
        title="Practice Bank | 11+ Standard" 
        description="Targeted 11+ practice drills tailored to close your child's specific gaps to the 121 benchmark." 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Practice Bank</h1>
          <p className="text-muted-foreground mt-2">Targeted drills to close your specific gaps to 121.</p>
        </div>
        {!hasPaidAccess() && (
          <Button variant="outline" className="gap-2" asChild data-testid="button-unlock-all">
            <Link href="/pricing"><Lock className="h-4 w-4" /> Unlock All Drills</Link>
          </Button>
        )}
      </div>

      <div className="space-y-12">
        {isLoading ? (
          Array(3).fill(0).map((_, idx) => (
            <section key={idx}>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </section>
          ))
        ) : (
          categories.map((category, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-primary" /> {category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections?.filter(s => s.category === category).map((drill, i) => {
                  const requiredRank = TIER_RANK[drill.requiredTier] || 0;
                  const isLocked = requiredRank > userRank;
                  return (
                    <Card key={i} className={`relative overflow-hidden ${isLocked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`}>
                      {isLocked && (
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant={drill.difficulty === 'Hard' ? 'destructive' : drill.difficulty === 'Medium' ? 'default' : 'secondary'} 
                            className={drill.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : drill.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}
                            data-testid={`badge-difficulty-${drill.id}`}
                          >
                            {drill.difficulty}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground" data-testid={`text-questions-${drill.id}`}>{drill.questionCount} Qs</span>
                        </div>
                        <CardTitle className="text-lg leading-tight" data-testid={`text-drill-title-${drill.id}`}>{drill.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLocked ? (
                          <Button 
                            variant="outline" 
                            className="w-full mt-4" 
                            disabled
                            data-testid={`button-start-drill-${drill.id}`}
                          >
                            Locked
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            className="w-full mt-4 bg-primary" 
                            asChild
                            data-testid={`button-start-drill-${drill.id}`}
                          >
                            <Link href={`/app/drill/${drill.id}`}><PlayCircle className="mr-2 h-4 w-4" /> Start Drill</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

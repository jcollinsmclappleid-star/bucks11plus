import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { useAuth } from "../lib/auth";
import { Seo } from "../components/shared/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Star, Award, Trophy, Crown, TrendingUp, Target, CheckCircle, Rocket, Zap, Brain, Sparkles, Flame, ArrowUp, ArrowUpRight, Timer, Clock } from "lucide-react";
import { Link } from "wouter";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: string;
  sortOrder: number;
};

type UserBadge = {
  id: string;
  badgeId: string;
  earnedAt: string;
  badge: Badge;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  star: <Star className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  trophy: <Trophy className="h-6 w-6" />,
  crown: <Crown className="h-6 w-6" />,
  'trending-up': <TrendingUp className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
  'check-circle': <CheckCircle className="h-6 w-6" />,
  rocket: <Rocket className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  brain: <Brain className="h-6 w-6" />,
  sparkles: <Sparkles className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  'arrow-up': <ArrowUp className="h-6 w-6" />,
  'arrow-up-right': <ArrowUpRight className="h-6 w-6" />,
  'arrow-big-up': <ArrowUp className="h-6 w-6" />,
  timer: <Timer className="h-6 w-6" />,
  clock: <Clock className="h-6 w-6" />,
};

const TIER_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  bronze: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', glow: 'shadow-orange-200/50' },
  silver: { bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-600', glow: 'shadow-slate-200/50' },
  gold: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700', glow: 'shadow-amber-200/50' },
  platinum: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-700', glow: 'shadow-violet-200/50' },
};

const CATEGORY_LABELS: Record<string, string> = {
  milestone: 'Milestones',
  score: 'Score Targets',
  accuracy: 'Accuracy',
  streak: 'Consistency',
  improvement: 'Improvement',
  speed: 'Speed',
};

export default function Badges() {
  const { user } = useAuth();

  const { data: allBadges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: myBadges, isLoading: myBadgesLoading } = useQuery<UserBadge[]>({
    queryKey: ["/api/badges/mine"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  const isLoading = badgesLoading || myBadgesLoading;
  const earnedIds = new Set(myBadges?.map(b => b.badgeId) || []);
  const earnedMap = new Map(myBadges?.map(b => [b.badgeId, b]) || []);

  const categories = [...new Set(allBadges?.map(b => b.category) || [])];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalEarned = myBadges?.length || 0;
  const totalBadges = allBadges?.length || 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <Seo title="Accomplishments | 11+ Standard" description="Track your achievements and earn badges as you prepare for the 11+ exam." />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-badges-title">Accomplishments</h1>
          <p className="text-muted-foreground mt-1">Earn badges as you practice and improve.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary" data-testid="text-badges-earned">{totalEarned}</div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground">{totalBadges}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {totalBadges > 0 && (
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${(totalEarned / totalBadges) * 100}%` }}
            data-testid="progress-badges"
          />
        </div>
      )}

      {categories.map(category => {
        const categoryBadges = allBadges?.filter(b => b.category === category) || [];
        if (categoryBadges.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground" data-testid={`text-category-${category}`}>
              {CATEGORY_LABELS[category] || category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBadges.map(badge => {
                const isEarned = earnedIds.has(badge.id);
                const earned = earnedMap.get(badge.id);
                const style = TIER_STYLES[badge.tier] || TIER_STYLES.bronze;

                return (
                  <Card
                    key={badge.id}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isEarned
                        ? `${style.border} border-2 shadow-lg ${style.glow}`
                        : 'border-muted opacity-60 grayscale'
                    }`}
                    data-testid={`card-badge-${badge.id}`}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`rounded-full p-3 ${isEarned ? style.bg : 'bg-muted'} ${isEarned ? style.text : 'text-muted-foreground'} shrink-0`}>
                        {ICON_MAP[badge.icon] || <Star className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold text-sm ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {badge.name}
                          </h3>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            isEarned ? `${style.bg} ${style.text}` : 'bg-muted text-muted-foreground'
                          }`}>
                            {badge.tier}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {isEarned && earned && (
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Earned {new Date(earned.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {!user && (
        <div className="text-center py-8 space-y-4">
          <p className="text-muted-foreground">Sign in to start earning badges!</p>
          <Link href="/sign-in">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90" data-testid="button-sign-in-badges">
              Sign In
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

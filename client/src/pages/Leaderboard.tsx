import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { useAuth } from "../lib/auth";
import { Seo } from "../components/shared/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, Medal, Award, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type LeaderboardEntry = {
  odId: string;
  displayName: string;
  score: number;
  badgeCount: number;
  rank: number;
  isMe: boolean;
};

function getRankDisplay(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
  return <span className="text-sm font-mono text-muted-foreground w-5 text-center">{rank}</span>;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Leaderboard() {
  const { user } = useAuth();

  const { data: entries, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const myEntry = entries?.find(e => e.isMe);
  const topEntries = entries?.slice(0, 3) || [];
  const restEntries = entries?.slice(3) || [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <Seo title="Leaderboard | 11+ Standard" description="See how you compare with other students preparing for the Buckinghamshire 11+ exam." />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/app/badges" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Badges
          </Link>
          <h1 className="text-3xl font-bold text-primary font-serif" data-testid="text-leaderboard-title">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performers ranked by latest forecast score.</p>
        </div>
        {myEntry && (
          <Card className="border-primary border-2 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-my-rank">#{myEntry.rank}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Your Rank</div>
              </div>
              <div className="border-l pl-4">
                <div className="text-lg font-semibold">{myEntry.score}</div>
                <div className="text-xs text-muted-foreground">{myEntry.badgeCount} badge{myEntry.badgeCount !== 1 ? 's' : ''}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {topEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topEntries.map((entry, i) => {
            const podiumColors = [
              'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300',
              'bg-gradient-to-b from-slate-50 to-slate-100 border-slate-300',
              'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300',
            ];
            const textColors = ['text-amber-700', 'text-slate-600', 'text-orange-700'];

            return (
              <Card
                key={entry.odId}
                className={`relative border-2 overflow-hidden ${podiumColors[i]} ${entry.isMe ? 'ring-2 ring-primary' : ''}`}
                data-testid={`card-leaderboard-${entry.rank}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto w-14 h-14 rounded-full ${i === 0 ? 'bg-amber-200' : i === 1 ? 'bg-slate-200' : 'bg-orange-200'} flex items-center justify-center mb-3`}>
                    <span className={`text-xl font-bold ${textColors[i]}`}>{getInitials(entry.displayName)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getRankDisplay(entry.rank)}
                  </div>
                  <h3 className="font-semibold text-foreground" data-testid={`text-name-${entry.rank}`}>
                    {entry.displayName}
                  </h3>
                  <div className="text-2xl font-bold text-primary mt-2" data-testid={`text-score-${entry.rank}`}>{entry.score}</div>
                  <div className="text-xs text-muted-foreground">forecast score</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" /> {entry.badgeCount} badge{entry.badgeCount !== 1 ? 's' : ''}
                  </div>
                  {entry.isMe && (
                    <span className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">YOU</span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {restEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {restEntries.map(entry => (
                <div
                  key={entry.odId}
                  className={`flex items-center gap-4 px-6 py-3 ${entry.isMe ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                  data-testid={`row-leaderboard-${entry.rank}`}
                >
                  <div className="w-8 text-center">
                    {getRankDisplay(entry.rank)}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">{getInitials(entry.displayName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {entry.displayName}
                      {entry.isMe && <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">YOU</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{entry.badgeCount} badge{entry.badgeCount !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{entry.score}</div>
                    <div className="text-[10px] text-muted-foreground">forecast</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!entries || entries.length === 0) && (
        <div className="text-center py-12 space-y-4">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">No entries yet</h3>
          <p className="text-muted-foreground">Complete a diagnostic to appear on the leaderboard!</p>
          <Link href="/app/diagnostic">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90" data-testid="button-start-diagnostic">
              Take a Diagnostic
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

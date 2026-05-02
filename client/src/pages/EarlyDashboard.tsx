import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useDisplayName } from "../lib/childNames";

function StageTimeline({ stage }: { stage: string }) {
  const stages = [
    { key: "exploring", label: "Exploring", desc: "Building confidence with core skills" },
    { key: "developing", label: "Developing", desc: "Strengthening reasoning & problem solving" },
    { key: "ready", label: "Ready for 11+ Prep", desc: "Foundation skills secured" },
  ];
  const currentIdx = stages.findIndex(s => s.key === stage);

  return (
    <div className="space-y-4" data-testid="stage-timeline">
      {stages.map((s, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={s.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isComplete ? "bg-emerald-500 text-white" :
                isCurrent ? "bg-amber-500 text-white ring-4 ring-amber-100" :
                "bg-gray-200 text-gray-400"
              }`} data-testid={`stage-dot-${s.key}`}>
                {isComplete ? "✓" : idx + 1}
              </div>
              {idx < stages.length - 1 && (
                <div className={`w-0.5 h-8 ${isComplete ? "bg-emerald-300" : "bg-gray-200"}`} />
              )}
            </div>
            <div className={isCurrent ? "" : "opacity-50"}>
              <p className="font-semibold text-sm" data-testid={`stage-label-${s.key}`}>{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EarlyDashboard() {
  const { user } = useAuth();

  const { data: sessions } = useQuery({
    queryKey: ["/api/test-sessions"],
    enabled: !!user,
  });

  const { data: profiles } = useQuery({
    queryKey: ["/api/child-profiles"],
    enabled: !!user,
  });

  const activeProfile = (profiles as any[] | undefined)?.find((p: any) => p.id === user?.activeChildProfileId);
  const childName = useDisplayName(user?.activeChildProfileId, user?.id, "your child");
  const stage = activeProfile?.stage || "exploring";

  const completedSessions = Array.isArray(sessions) ? sessions.filter((s: any) => s.completedAt) : [];
  const foundationSessions = completedSessions.filter((s: any) => {
    const scores = s.sectionScores;
    return scores != null;
  });

  let readinessPercent = 0;
  if (foundationSessions.length > 0) {
    const latest = foundationSessions[0];
    const total = latest.totalScore || 0;
    const maxPossible = 100;
    readinessPercent = Math.min(100, Math.round((total / maxPossible) * 100));
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8" data-testid="early-dashboard">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary" data-testid="text-early-welcome">
          Welcome, {childName}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Let's build strong foundations together. No rush, no pressure — just learning at your own pace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-serif font-bold text-lg text-primary">Foundation Readiness</h2>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="10"
                  strokeDasharray={`${readinessPercent * 3.14} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-emerald-600" data-testid="text-readiness-percent">{readinessPercent}%</span>
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {readinessPercent < 30
              ? "Just getting started — every practice builds confidence!"
              : readinessPercent < 60
              ? "Great progress! Core skills are developing nicely."
              : readinessPercent < 85
              ? "Nearly there! Foundations are looking solid."
              : "Excellent! Ready to move on to full 11+ preparation."}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-serif font-bold text-lg text-primary">Your Journey</h2>
          <p className="text-sm text-muted-foreground">6-month learning path</p>
          <StageTimeline stage={stage} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/app/practice">
          <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer text-center space-y-2" data-testid="link-early-practice">
            <div className="text-3xl">📝</div>
            <h3 className="font-semibold">Practice</h3>
            <p className="text-xs text-muted-foreground">Fun exercises to build skills</p>
          </div>
        </Link>
        <Link href="/app/diagnostic">
          <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer text-center space-y-2" data-testid="link-early-diagnostic">
            <div className="text-3xl">🎯</div>
            <h3 className="font-semibold">Check Progress</h3>
            <p className="text-xs text-muted-foreground">See how your skills are growing</p>
          </div>
        </Link>
        <Link href="/app/badges">
          <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer text-center space-y-2" data-testid="link-early-badges">
            <div className="text-3xl">⭐</div>
            <h3 className="font-semibold">Achievements</h3>
            <p className="text-xs text-muted-foreground">Celebrate what you've earned</p>
          </div>
        </Link>
      </div>

      {completedSessions.length === 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center space-y-3" data-testid="early-cta-first-practice">
          <h3 className="font-serif font-bold text-lg text-amber-800">Ready to start?</h3>
          <p className="text-amber-700 text-sm">
            Try a short practice session to see where {childName} is today. It's friendly, low-pressure, and takes about 10 minutes.
          </p>
          <Link href="/app/practice">
            <button className="bg-amber-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-amber-700 transition-colors" data-testid="button-start-first-practice">
              Start First Practice
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

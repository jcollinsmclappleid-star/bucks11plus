import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { Loader2 } from "lucide-react";

type TestSession = {
  id: string;
  diagnosticId: string;
  startedAt: string;
  completedAt: string | null;
  totalScore: number | null;
  forecastScore: number | null;
  band: string | null;
  sectionScores: { name: string; score: number; avgTime: number; total: number; correct: number }[] | null;
  paceData: { name: string; avg: number; expected: number }[] | null;
};

type ReviewItem = {
  questionId: string;
  section: string;
  skillId: string;
  subRuleId: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
};

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    verbal_reasoning: "Verbal Reasoning",
    "Verbal Reasoning": "Verbal Reasoning",
    non_verbal_reasoning: "Non-Verbal Reasoning",
    "Non-Verbal Reasoning": "Non-Verbal Reasoning",
    mathematics: "Mathematics",
    Mathematics: "Mathematics",
    comprehension: "Comprehension",
    Comprehension: "Comprehension",
    english_comprehension: "Comprehension",
    "English Comprehension": "Comprehension",
  };
  return labels[section] || section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSubRuleLabel(subRuleId: string): string {
  const parts = subRuleId.split(".");
  const last = parts[parts.length - 1] || subRuleId;
  return last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function bandLabel(score: number | null): { text: string; color: string } {
  if (score == null) return { text: "—", color: "#64748b" };
  if (score >= 121) return { text: "Meeting Target", color: "#16a34a" };
  if (score >= 110) return { text: "Borderline", color: "#d97706" };
  return { text: "Developing", color: "#dc2626" };
}

export default function ResultsReport() {
  const { id } = useParams<{ id: string }>();

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: [`/api/test-sessions/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!id,
  });

  const { data: reviewData } = useQuery<ReviewItem[]>({
    queryKey: [`/api/test-sessions/${id}/review`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!id && !!session?.completedAt,
  });

  if (isLoading || !session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: "#1e3a6e" }} />
      </div>
    );
  }

  const forecastScore = session.forecastScore ?? 0;
  const sectionScores = session.sectionScores || [];
  const band = bandLabel(session.forecastScore);
  const gap = 121 - forecastScore;
  const dateStr = session.completedAt
    ? new Date(String(session.completedAt)).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const weakestAreas = reviewData
    ? (() => {
        const map: Record<string, { correct: number; total: number; section: string }> = {};
        for (const item of reviewData) {
          const key = item.subRuleId;
          if (!map[key]) map[key] = { correct: 0, total: 0, section: item.section };
          map[key].total++;
          if (item.isCorrect) map[key].correct++;
        }
        return Object.entries(map)
          .map(([subRuleId, v]) => ({
            label: getSubRuleLabel(subRuleId),
            section: getSectionLabel(v.section),
            pct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
            correct: v.correct,
            total: v.total,
          }))
          .sort((a, b) => a.pct - b.pct)
          .slice(0, 6);
      })()
    : [];

  const totalCorrect = sectionScores.reduce((s, r) => s + r.correct, 0);
  const totalQs = sectionScores.reduce((s, r) => s + r.total, 0);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 28px",
        color: "#1a1a2e",
        background: "#ffffff",
        lineHeight: 1.5,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #1e3a6e",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1e3a6e" }}>Bucks 11 Plus Tests</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Independent Buckinghamshire 11+ Readiness Assessment
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a6e" }}>Readiness Report</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Completed {dateStr}</div>
        </div>
      </div>

      {/* ── SCORE SUMMARY ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 28,
        }}
      >
        <div style={{ textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#1e3a6e", lineHeight: 1 }}>
            {forecastScore}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Readiness Score
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Readiness Band
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: band.color, marginTop: 2 }}>
                {band.text}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Questions Correct
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e3a6e", marginTop: 2 }}>
                {totalCorrect} / {totalQs}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                121 Target Gap
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: gap <= 0 ? "#16a34a" : "#1a1a2e",
                  marginTop: 2,
                }}
              >
                {gap <= 0 ? "At or above target" : `${gap} points`}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>
            Indicative readiness estimate only. Not an official GL Assessment score. 121 is used
            as a preparation benchmark — achieving it here does not indicate a child will pass the
            official Secondary Transfer Test.
          </div>
        </div>
      </div>

      {/* ── SECTION BREAKDOWN ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", marginBottom: 14, borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
          Section Breakdown
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Subject
              </th>
              <th style={{ textAlign: "center", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Score
              </th>
              <th style={{ textAlign: "center", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Correct
              </th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", width: 200 }}>
                Performance bar
              </th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Avg pace / q
              </th>
            </tr>
          </thead>
          <tbody>
            {sectionScores.map((s, i) => {
              const pct = Math.round(s.score);
              const barColor = pct >= 70 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#1e3a6e" }}>
                    {getSectionLabel(s.name)}
                  </td>
                  <td style={{ textAlign: "center", padding: "10px 12px", fontSize: 14, fontWeight: 700, color: barColor }}>
                    {pct}%
                  </td>
                  <td style={{ textAlign: "center", padding: "10px 12px", fontSize: 13, color: "#475569" }}>
                    {s.correct}/{s.total}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ background: "#e2e8f0", borderRadius: 4, height: 8, width: "100%" }}>
                      <div
                        style={{
                          background: barColor,
                          borderRadius: 4,
                          height: 8,
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>
                    {s.avgTime > 0 ? `${Math.round(s.avgTime)}s` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── WEAKEST AREAS ── */}
      {weakestAreas.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", marginBottom: 14, borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
            Areas to Focus On First
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fef9f0" }}>
                <th style={{ textAlign: "left", padding: "7px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Topic
                </th>
                <th style={{ textAlign: "left", padding: "7px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Subject
                </th>
                <th style={{ textAlign: "center", padding: "7px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Score
                </th>
                <th style={{ textAlign: "center", padding: "7px 12px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Correct
                </th>
              </tr>
            </thead>
            <tbody>
              {weakestAreas.map((w, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #fef3c7" }}>
                  <td style={{ padding: "9px 12px", fontSize: 13, fontWeight: 600, color: "#1e3a6e" }}>
                    {w.label}
                  </td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#64748b" }}>
                    {w.section}
                  </td>
                  <td style={{ textAlign: "center", padding: "9px 12px", fontSize: 13, fontWeight: 700, color: "#dc2626" }}>
                    {w.pct}%
                  </td>
                  <td style={{ textAlign: "center", padding: "9px 12px", fontSize: 12, color: "#64748b" }}>
                    {w.correct}/{w.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FOOTER DISCLAIMER ── */}
      <div
        style={{
          marginTop: 36,
          paddingTop: 16,
          borderTop: "1px solid #e2e8f0",
          fontSize: 10,
          color: "#94a3b8",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#64748b" }}>Important — please read:</strong> This report is an
        indicative readiness assessment produced by Bucks 11 Plus Tests, an independent platform
        operated by Ianson Systems Limited. The readiness score and band are internal benchmarks
        calibrated to the 121 qualifying threshold used by Buckinghamshire grammar schools as a
        preparation target only. This is <em>not</em> an official GL Assessment score, and
        achieving a score of 121 or above on this platform does not indicate that a child will
        achieve the same result on the official Secondary Transfer Test. GL Assessment uses
        proprietary age-standardised scoring not available to independent providers. Results should
        be used for preparation guidance only. Not affiliated with The Buckinghamshire Grammar
        Schools, GL Assessment, or any individual grammar school.
        <br />
        <br />
        Bucks 11 Plus Tests · Ianson Systems Limited · Registered in England &amp; Wales ·
        bucks11plustest.co.uk
      </div>
    </div>
  );
}

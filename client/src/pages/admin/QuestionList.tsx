import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VisualPrompt from "@/components/render/VisualPrompt";
import type { RenderType, RenderConfig } from "@shared/contentTypes";

type Question = {
  id: string;
  section: string;
  skillId: string;
  subRuleId: string;
  difficulty: string;
  renderType: string;
  renderConfig: RenderConfig | null;
  qaStatus: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  cognitiveLoad: number;
  trapTypes: string[];
  estTimeSeconds: number;
  notes: string | null;
};

type Stats = {
  total: number;
  byStatus: Record<string, number>;
  bySection: Record<string, number>;
};

const QA_CHECKLIST = [
  "Ambiguity",
  "UK Language",
  "Distractor Plausibility",
  "Explanation Clarity",
  "Difficulty Label",
  "Visual Layout",
];

function statusColor(status: string) {
  switch (status) {
    case "draft": return "bg-gray-100 text-gray-800";
    case "review": return "bg-yellow-100 text-yellow-800";
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function QuestionList() {
  const [section, setSection] = useState("all");
  const [qaStatus, setQaStatus] = useState("all");
  const [renderType, setRenderType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const params = new URLSearchParams();
  if (section !== "all") params.set("section", section);
  if (qaStatus !== "all") params.set("qaStatus", qaStatus);
  if (renderType !== "all") params.set("renderType", renderType);
  if (difficulty !== "all") params.set("difficulty", difficulty);

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/admin/questions", section, qaStatus, renderType, difficulty],
    queryFn: async () => {
      const res = await fetch(`/api/admin/questions?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/admin/questions/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/questions/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/questions/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions/stats"] });
      setPreviewQuestion(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/questions/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions/stats"] });
      setPreviewQuestion(null);
    },
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Question Management</h1>
        <div className="flex gap-2">
          <Button
            variant={qaStatus === "review" ? "default" : "outline"}
            onClick={() => setQaStatus(qaStatus === "review" ? "all" : "review")}
            data-testid="button-qa-queue"
          >
            QA Queue
          </Button>
          <Button asChild data-testid="button-new-question">
            <Link href="/admin/questions/new">New Question</Link>
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <Card data-testid="card-stat-total">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          {Object.entries(stats.byStatus).map(([key, val]) => (
            <Card key={key} data-testid={`card-stat-status-${key}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-xs text-muted-foreground capitalize">{key}</div>
              </CardContent>
            </Card>
          ))}
          {Object.entries(stats.bySection).map(([key, val]) => (
            <Card key={key} data-testid={`card-stat-section-${key}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-xs text-muted-foreground">{key}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={section} onValueChange={setSection} data-testid="select-section">
          <SelectTrigger className="w-[180px]" data-testid="select-trigger-section">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="Verbal Reasoning">Verbal Reasoning</SelectItem>
            <SelectItem value="Non-Verbal Reasoning">Non-Verbal Reasoning</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="English Comprehension">English Comprehension</SelectItem>
          </SelectContent>
        </Select>

        <Select value={qaStatus} onValueChange={setQaStatus} data-testid="select-qa-status">
          <SelectTrigger className="w-[150px]" data-testid="select-trigger-qa-status">
            <SelectValue placeholder="QA Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={renderType} onValueChange={setRenderType} data-testid="select-render-type">
          <SelectTrigger className="w-[150px]" data-testid="select-trigger-render-type">
            <SelectValue placeholder="Render Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="chart">Chart</SelectItem>
            <SelectItem value="comprehension">Comprehension</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty} data-testid="select-difficulty">
          <SelectTrigger className="w-[150px]" data-testid="select-trigger-difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulty</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-loading">Loading questions...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Section</th>
                <th className="text-left p-3 font-medium">Skill</th>
                <th className="text-left p-3 font-medium">SubRule</th>
                <th className="text-left p-3 font-medium">Difficulty</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Prompt</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t hover:bg-muted/30" data-testid={`row-question-${q.id}`}>
                  <td className="p-3">{q.section}</td>
                  <td className="p-3 font-mono text-xs">{q.skillId}</td>
                  <td className="p-3 font-mono text-xs">{q.subRuleId}</td>
                  <td className="p-3 capitalize">{q.difficulty}</td>
                  <td className="p-3">{q.renderType}</td>
                  <td className="p-3">
                    <Badge className={statusColor(q.qaStatus)} data-testid={`badge-status-${q.id}`}>
                      {q.qaStatus}
                    </Badge>
                  </td>
                  <td className="p-3 max-w-[200px] truncate">{q.prompt.slice(0, 60)}{q.prompt.length > 60 ? "…" : ""}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button variant="outline" size="sm" asChild data-testid={`button-edit-${q.id}`}>
                      <Link href={`/admin/questions/${q.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewQuestion(q);
                        setChecklist({});
                        setSelectedAnswer(null);
                      }}
                      data-testid={`button-preview-${q.id}`}
                    >
                      Preview
                    </Button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground" data-testid="text-no-results">
                    No questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!previewQuestion} onOpenChange={(open) => !open && setPreviewQuestion(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-preview">
          {previewQuestion && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold" data-testid="text-preview-title">Question Preview</h2>

              {(previewQuestion.renderType === "svg" || previewQuestion.renderType === "chart") && previewQuestion.renderConfig && (
                <div data-testid="preview-visual">
                  <VisualPrompt
                    renderType={previewQuestion.renderType as RenderType}
                    renderConfig={previewQuestion.renderConfig}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={setSelectedAnswer}
                  />
                </div>
              )}

              <div>
                <div className="font-medium mb-1">Prompt</div>
                <p className="text-sm bg-muted/50 p-3 rounded" data-testid="text-preview-prompt">{previewQuestion.prompt}</p>
              </div>

              <div>
                <div className="font-medium mb-1">Options</div>
                <div className="space-y-1">
                  {previewQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`text-sm p-2 rounded border ${opt === previewQuestion.correctAnswer ? "bg-green-50 border-green-300 text-green-800" : "bg-white"}`}
                      data-testid={`text-option-${i}`}
                    >
                      {opt} {opt === previewQuestion.correctAnswer && "✓"}
                    </div>
                  ))}
                </div>
              </div>

              {previewQuestion.explanation && (
                <div>
                  <div className="font-medium mb-1">Explanation</div>
                  <p className="text-sm bg-muted/50 p-3 rounded" data-testid="text-preview-explanation">{previewQuestion.explanation}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" data-testid="chip-skillId">{previewQuestion.skillId}</Badge>
                <Badge variant="outline" data-testid="chip-subRuleId">{previewQuestion.subRuleId}</Badge>
                <Badge variant="outline" data-testid="chip-difficulty">{previewQuestion.difficulty}</Badge>
                <Badge variant="outline" data-testid="chip-cognitiveLoad">Load: {previewQuestion.cognitiveLoad}</Badge>
                {previewQuestion.trapTypes.map((t) => (
                  <Badge variant="outline" key={t} data-testid={`chip-trap-${t}`}>{t}</Badge>
                ))}
              </div>

              <div>
                <div className="font-medium mb-2">QA Checklist</div>
                <div className="grid grid-cols-2 gap-2">
                  {QA_CHECKLIST.map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={!!checklist[item]}
                        onCheckedChange={(checked) => setChecklist((prev) => ({ ...prev, [item]: !!checked }))}
                        data-testid={`checkbox-qa-${item.toLowerCase().replace(/\s+/g, "-")}`}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => approveMutation.mutate(previewQuestion.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-approve"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectMutation.mutate(previewQuestion.id)}
                  disabled={rejectMutation.isPending}
                  data-testid="button-reject"
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

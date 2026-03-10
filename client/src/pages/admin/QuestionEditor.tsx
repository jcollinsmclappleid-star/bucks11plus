import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VisualPrompt from "@/components/render/VisualPrompt";
import { validateRenderConfig } from "@shared/contentValidation";
import type { RenderType, RenderConfig } from "@shared/contentTypes";

export default function QuestionEditor() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === "new";

  const [section, setSection] = useState("Verbal Reasoning");
  const [skillId, setSkillId] = useState("");
  const [subRuleId, setSubRuleId] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [cognitiveLoad, setCognitiveLoad] = useState(3);
  const [renderType, setRenderType] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [trapTypes, setTrapTypes] = useState("");
  const [estTimeSeconds, setEstTimeSeconds] = useState(30);
  const [qaStatus, setQaStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [renderConfigJson, setRenderConfigJson] = useState("{}");
  const [renderConfigErrors, setRenderConfigErrors] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { data: question, isLoading } = useQuery({
    queryKey: ["/api/admin/questions", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await fetch(`/api/admin/questions/${params.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch question");
      return res.json();
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (question) {
      setSection(question.section);
      setSkillId(question.skillId);
      setSubRuleId(question.subRuleId);
      setDifficulty(question.difficulty);
      setCognitiveLoad(question.cognitiveLoad);
      setRenderType(question.renderType);
      setPrompt(question.prompt);
      setOptions(question.options || ["", "", "", ""]);
      setCorrectAnswer(question.correctAnswer);
      setExplanation(question.explanation || "");
      setTrapTypes((question.trapTypes || []).join(", "));
      setEstTimeSeconds(question.estTimeSeconds);
      setQaStatus(question.qaStatus);
      setNotes(question.notes || "");
      if (question.renderConfig) {
        setRenderConfigJson(JSON.stringify(question.renderConfig, null, 2));
      }
    }
  }, [question]);

  const parsedRenderConfig = useMemo<RenderConfig | null>(() => {
    if (renderType === "text") return null;
    try {
      const parsed = JSON.parse(renderConfigJson);
      const result = validateRenderConfig(parsed);
      setRenderConfigErrors(result.errors || []);
      if (result.valid) return parsed;
      return null;
    } catch {
      setRenderConfigErrors(["Invalid JSON"]);
      return null;
    }
  }, [renderConfigJson, renderType]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        section,
        skillId,
        subRuleId,
        difficulty,
        cognitiveLoad,
        renderType,
        prompt,
        options,
        correctAnswer,
        explanation: explanation || null,
        trapTypes: trapTypes.split(",").map((t) => t.trim()).filter(Boolean),
        estTimeSeconds,
        qaStatus,
        notes: notes || null,
        renderConfig: renderType !== "text" ? (parsedRenderConfig || {}) : {},
        type: section,
      };

      if (isNew) {
        await apiRequest("POST", "/api/admin/questions", body);
      } else {
        await apiRequest("PUT", `/api/admin/questions/${params.id}`, body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      navigate("/admin/questions");
    },
  });

  if (!isNew && isLoading) {
    return <div className="container mx-auto max-w-7xl px-4 py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-editor-title">
          {isNew ? "New Question" : "Edit Question"}
        </h1>
        <Button variant="outline" asChild data-testid="button-back">
          <a href="/admin/questions">← Back</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Section</label>
              <Select value={section} onValueChange={setSection} data-testid="select-section">
                <SelectTrigger data-testid="select-trigger-section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verbal Reasoning">Verbal Reasoning</SelectItem>
                  <SelectItem value="Non-Verbal Reasoning">Non-Verbal Reasoning</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English Comprehension">English Comprehension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty} data-testid="select-difficulty">
                <SelectTrigger data-testid="select-trigger-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Skill ID</label>
              <Input value={skillId} onChange={(e) => setSkillId(e.target.value)} data-testid="input-skill-id" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sub Rule ID</label>
              <Input value={subRuleId} onChange={(e) => setSubRuleId(e.target.value)} data-testid="input-sub-rule-id" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Cognitive Load: {cognitiveLoad}</label>
            <Slider
              value={[cognitiveLoad]}
              onValueChange={([v]) => setCognitiveLoad(v)}
              min={1}
              max={10}
              step={1}
              data-testid="slider-cognitive-load"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Render Type</label>
              <Select value={renderType} onValueChange={setRenderType} data-testid="select-render-type">
                <SelectTrigger data-testid="select-trigger-render-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="comprehension">Comprehension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">QA Status</label>
              <Select value={qaStatus} onValueChange={setQaStatus} data-testid="select-qa-status">
                <SelectTrigger data-testid="select-trigger-qa-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              data-testid="textarea-prompt"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Options</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOptions([...options, ""])}
                data-testid="button-add-option"
              >
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    data-testid={`input-option-${i}`}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOptions(options.filter((_, j) => j !== i))}
                      data-testid={`button-remove-option-${i}`}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Correct Answer</label>
            <Select value={correctAnswer} onValueChange={setCorrectAnswer} data-testid="select-correct-answer">
              <SelectTrigger data-testid="select-trigger-correct-answer">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {options.filter(Boolean).map((opt, i) => (
                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Explanation</label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              data-testid="textarea-explanation"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Trap Types (comma-separated)</label>
              <Input value={trapTypes} onChange={(e) => setTrapTypes(e.target.value)} data-testid="input-trap-types" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Est. Time (seconds)</label>
              <Input
                type="number"
                value={estTimeSeconds}
                onChange={(e) => setEstTimeSeconds(Number(e.target.value))}
                data-testid="input-est-time"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              data-testid="textarea-notes"
            />
          </div>

          {(renderType === "svg" || renderType === "chart") && (
            <div>
              <label className="text-sm font-medium mb-1 block">Render Config (JSON)</label>
              <Textarea
                value={renderConfigJson}
                onChange={(e) => setRenderConfigJson(e.target.value)}
                rows={8}
                className="font-mono text-xs"
                data-testid="textarea-render-config"
              />
              {renderConfigErrors.length > 0 && (
                <div className="mt-1 space-y-1" data-testid="text-render-config-errors">
                  {renderConfigErrors.map((err, i) => (
                    <div key={i} className="text-xs text-red-600">{err}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full"
            data-testid="button-save"
          >
            {saveMutation.isPending ? "Saving..." : "Save Question"}
          </Button>

          {saveMutation.isError && (
            <div className="text-sm text-red-600" data-testid="text-save-error">
              {(saveMutation.error as Error).message}
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4" data-testid="text-preview-heading">Live Preview</h2>

            {(renderType === "svg" || renderType === "chart") && parsedRenderConfig && (
              <div className="mb-4" data-testid="preview-visual">
                <VisualPrompt
                  renderType={renderType as RenderType}
                  renderConfig={parsedRenderConfig}
                  selectedAnswer={selectedAnswer}
                  onSelectAnswer={setSelectedAnswer}
                />
              </div>
            )}

            {prompt && (
              <p className="text-sm font-medium mb-3 bg-muted/50 p-3 rounded" data-testid="preview-prompt">{prompt}</p>
            )}

            <div className="space-y-2">
              {options.filter(Boolean).map((opt, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 rounded border cursor-pointer ${opt === correctAnswer ? "bg-green-50 border-green-300" : "hover:bg-muted/30"}`}
                  data-testid={`preview-option-${i}`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              ))}
            </div>

            {explanation && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm" data-testid="preview-explanation">
                <span className="font-medium">Explanation:</span> {explanation}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

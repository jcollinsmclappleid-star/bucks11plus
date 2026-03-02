import type { RenderType, RenderConfig, NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig, ChartBarConfig, ChartLineConfig, ChartTableConfig } from "@shared/contentTypes";
import SvgQuestion from "./SvgQuestion";
import ChartQuestion from "./ChartQuestion";

interface VisualPromptProps {
  renderType: RenderType;
  renderConfig: RenderConfig | null;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export default function VisualPrompt({ renderType, renderConfig, selectedAnswer, onSelectAnswer }: VisualPromptProps) {
  if (renderType === "text" || !renderConfig) {
    return null;
  }

  if (renderType === "svg") {
    return (
      <SvgQuestion
        config={renderConfig as NvrSequenceConfig | NvrTransformConfig | NvrClassificationConfig}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={onSelectAnswer}
      />
    );
  }

  if (renderType === "chart") {
    return (
      <ChartQuestion
        config={renderConfig as ChartBarConfig | ChartLineConfig | ChartTableConfig}
      />
    );
  }

  return null;
}

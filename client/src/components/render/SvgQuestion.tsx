import type { NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig } from "@shared/contentTypes";
import { examCardBg, examCardBorder, examCardShadow, frameLabelColor, questionMarkColor } from "@shared/style";
import SvgFrameView from "./SvgFrameView";
import SvgOptionGrid from "./SvgOptionGrid";

interface SvgQuestionProps {
  config: NvrSequenceConfig | NvrTransformConfig | NvrClassificationConfig;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

function QuestionPlaceholder() {
  return (
    <div
      className="flex items-center justify-center rounded-lg border-2 border-dashed aspect-square"
      style={{ borderColor: questionMarkColor, backgroundColor: "#F8FAFC" }}
      data-testid="question-placeholder"
    >
      <span className="text-3xl font-bold" style={{ color: questionMarkColor }}>?</span>
    </div>
  );
}

function FrameCard({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: frameLabelColor }}
          data-testid={`frame-label-${label}`}
        >
          {label}
        </span>
      )}
      <div
        className="rounded-lg p-2 aspect-square"
        style={{
          backgroundColor: examCardBg,
          border: `1.5px solid ${examCardBorder}`,
          boxShadow: examCardShadow,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1.5 self-end mb-[calc(50%-8px)]">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6h16m0 0l-4-4.5M16 6l-4 4.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SequenceLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrSequenceConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-8" data-testid="nvr-sequence">
      <div className="flex items-end gap-3 justify-center flex-wrap">
        {config.frames.map((frame, i) =>
          i === config.questionIndex ? (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: frameLabelColor }}
              >
                {i + 1}
              </span>
              <div className="w-[120px] h-[120px]">
                <QuestionPlaceholder />
              </div>
            </div>
          ) : (
            <div key={i} className="w-[120px] h-[120px]">
              <FrameCard label={`${i + 1}`}>
                <SvgFrameView frame={frame} className="w-full h-full" />
              </FrameCard>
            </div>
          )
        )}
      </div>
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function TransformLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrTransformConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  const frames = config.promptFrames;
  return (
    <div className="space-y-8" data-testid="nvr-transform">
      <div className="flex items-end gap-2 justify-center flex-wrap">
        {frames.length >= 2 && (
          <>
            <div className="w-[120px] h-[120px]">
              <FrameCard>
                <SvgFrameView frame={frames[0]} className="w-full h-full" />
              </FrameCard>
            </div>
            <Arrow />
            <div className="w-[120px] h-[120px]">
              <FrameCard>
                <SvgFrameView frame={frames[1]} className="w-full h-full" />
              </FrameCard>
            </div>
          </>
        )}
        <div className="px-3 self-end mb-[calc(50%-8px)]">
          <span className="text-xl font-bold" style={{ color: frameLabelColor }}>∷</span>
        </div>
        {frames.length >= 3 && (
          <>
            <div className="w-[120px] h-[120px]">
              <FrameCard>
                <SvgFrameView frame={frames[2]} className="w-full h-full" />
              </FrameCard>
            </div>
            <Arrow />
          </>
        )}
        <div className="w-[120px] h-[120px] self-end">
          <QuestionPlaceholder />
        </div>
      </div>
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function ClassificationLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrClassificationConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-8" data-testid="nvr-classification">
      <div className="flex items-end gap-3 justify-center flex-wrap">
        {config.group.map((frame, i) => (
          <div key={i} className="w-[120px] h-[120px]">
            <FrameCard>
              <SvgFrameView frame={frame} className="w-full h-full" />
            </FrameCard>
          </div>
        ))}
      </div>
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

export default function SvgQuestion({ config, selectedAnswer, onSelectAnswer }: SvgQuestionProps) {
  switch (config.kind) {
    case "nvr.sequence":
      return <SequenceLayout config={config} selectedAnswer={selectedAnswer} onSelectAnswer={onSelectAnswer} />;
    case "nvr.transform":
      return <TransformLayout config={config} selectedAnswer={selectedAnswer} onSelectAnswer={onSelectAnswer} />;
    case "nvr.classification":
      return <ClassificationLayout config={config} selectedAnswer={selectedAnswer} onSelectAnswer={onSelectAnswer} />;
  }
}

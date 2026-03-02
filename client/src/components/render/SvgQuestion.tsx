import type { NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig } from "@shared/contentTypes";
import { examCardBg, examCardBorder } from "@shared/style";
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
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 aspect-square"
      style={{ backgroundColor: examCardBg }}
      data-testid="question-placeholder"
    >
      <span className="text-3xl font-bold text-gray-400">?</span>
    </div>
  );
}

function FrameCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-2 aspect-square"
      style={{ backgroundColor: examCardBg, border: `1px solid ${examCardBorder}` }}
    >
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1">
      <span className="text-xl font-bold text-gray-400">→</span>
    </div>
  );
}

function SequenceLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrSequenceConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-6" data-testid="nvr-sequence">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {config.frames.map((frame, i) =>
          i === config.questionIndex ? (
            <div key={i} className="w-20 h-20">
              <QuestionPlaceholder />
            </div>
          ) : (
            <div key={i} className="w-20 h-20">
              <FrameCard>
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
    <div className="space-y-6" data-testid="nvr-transform">
      <div className="flex items-center gap-1 justify-center flex-wrap">
        {frames.length >= 2 && (
          <>
            <div className="w-20 h-20">
              <FrameCard>
                <SvgFrameView frame={frames[0]} className="w-full h-full" />
              </FrameCard>
            </div>
            <Arrow />
            <div className="w-20 h-20">
              <FrameCard>
                <SvgFrameView frame={frames[1]} className="w-full h-full" />
              </FrameCard>
            </div>
          </>
        )}
        <div className="px-3">
          <span className="text-lg font-bold text-gray-400">::</span>
        </div>
        {frames.length >= 3 && (
          <>
            <div className="w-20 h-20">
              <FrameCard>
                <SvgFrameView frame={frames[2]} className="w-full h-full" />
              </FrameCard>
            </div>
            <Arrow />
          </>
        )}
        <div className="w-20 h-20">
          <QuestionPlaceholder />
        </div>
      </div>
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function ClassificationLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrClassificationConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-6" data-testid="nvr-classification">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {config.group.map((frame, i) => (
          <div key={i} className="w-20 h-20">
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

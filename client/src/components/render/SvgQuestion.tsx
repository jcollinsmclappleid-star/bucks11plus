import type { NvrSequenceConfig, NvrTransformConfig, NvrClassificationConfig } from "@shared/contentTypes";
import { examCardBg, examCardBorder, examCardShadow, questionMarkColor } from "@shared/style";
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
      className="flex items-center justify-center rounded-lg border-[3px] border-dashed aspect-square"
      style={{ borderColor: "#3B82F6", backgroundColor: "#EFF6FF" }}
      data-testid="question-placeholder"
    >
      <span className="text-4xl font-extrabold" style={{ color: "#3B82F6" }}>?</span>
    </div>
  );
}

function FrameCard({ children }: { children: React.ReactNode }) {
  return (
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
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2" data-testid="section-divider">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1.5 shrink-0">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6h16m0 0l-4-4.5M16 6l-4 4.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SequenceLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrSequenceConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-4" data-testid="nvr-sequence">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-3 justify-center flex-nowrap min-w-min px-2">
          {config.frames.map((frame, i) =>
            i === config.questionIndex ? (
              <div key={i} className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
                <QuestionPlaceholder />
              </div>
            ) : (
              <div key={i} className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
                <FrameCard>
                  <SvgFrameView frame={frame} className="w-full h-full" />
                </FrameCard>
              </div>
            )
          )}
        </div>
      </div>
      <SectionDivider label="Select the missing shape" />
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function TransformLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrTransformConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  const frames = config.promptFrames;
  return (
    <div className="space-y-4" data-testid="nvr-transform">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 justify-center flex-nowrap min-w-min px-2">
          {frames.length >= 2 && (
            <>
              <div className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
                <FrameCard>
                  <SvgFrameView frame={frames[0]} className="w-full h-full" />
                </FrameCard>
              </div>
              <Arrow />
              <div className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
                <FrameCard>
                  <SvgFrameView frame={frames[1]} className="w-full h-full" />
                </FrameCard>
              </div>
            </>
          )}
          <div className="px-3 shrink-0">
            <span className="text-xl font-bold" style={{ color: questionMarkColor }}>∷</span>
          </div>
          {frames.length >= 3 && (
            <>
              <div className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
                <FrameCard>
                  <SvgFrameView frame={frames[2]} className="w-full h-full" />
                </FrameCard>
              </div>
              <Arrow />
            </>
          )}
          <div className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
            <QuestionPlaceholder />
          </div>
        </div>
      </div>
      <SectionDivider label="Select the missing shape" />
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function ClassificationLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrClassificationConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-4" data-testid="nvr-classification">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-3 justify-center flex-nowrap min-w-min px-2">
          {config.group.map((frame, i) => (
            <div key={i} className="w-20 h-20 md:w-[120px] md:h-[120px] shrink-0">
              <FrameCard>
                <SvgFrameView frame={frame} className="w-full h-full" />
              </FrameCard>
            </div>
          ))}
        </div>
      </div>
      <SectionDivider label="Which one belongs?" />
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

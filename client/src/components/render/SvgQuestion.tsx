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

function MirrorLineDivider() {
  return (
    <div className="flex flex-col items-center gap-1 py-3" data-testid="mirror-line-divider">
      <svg
        width="4"
        height="48"
        viewBox="0 0 4 48"
        fill="none"
        className="md:hidden"
      >
        <line
          x1="2" y1="0" x2="2" y2="48"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      </svg>
      <svg
        width="4"
        height="64"
        viewBox="0 0 4 64"
        fill="none"
        className="hidden md:block"
      >
        <line
          x1="2" y1="0" x2="2" y2="64"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">
        Mirror line
      </span>
      <div className="flex items-center gap-3 w-full mt-1">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
          Select the correct mirror image
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex items-center justify-center px-0.5 shrink-0 pb-4">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
        <path
          d="M0 6h14m0 0l-4-4M14 6l-4 4"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SequenceLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrSequenceConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  return (
    <div className="space-y-4" data-testid="nvr-sequence">
      <div className="overflow-x-auto">
        <div className="flex items-end gap-1 justify-center flex-nowrap min-w-min px-2">
          {config.frames.map((frame, i) => {
            const isQuestion = i === config.questionIndex;
            const label = isQuestion ? "?" : String(i + 1);
            const showArrowAfter = i < config.frames.length - 1;
            return (
              <div key={i} className="flex items-end gap-1 shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-20 h-20 md:w-[110px] md:h-[110px]">
                    {isQuestion ? (
                      <QuestionPlaceholder />
                    ) : (
                      <FrameCard>
                        <SvgFrameView frame={frame} className="w-full h-full" />
                      </FrameCard>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: isQuestion ? "#3B82F6" : "#94A3B8" }}
                    data-testid={`sequence-step-${label}`}
                  >
                    {label}
                  </span>
                </div>
                {showArrowAfter && <StepArrow />}
              </div>
            );
          })}
        </div>
      </div>
      <SectionDivider label="Select the missing shape" />
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function TransformLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrTransformConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  const frames = config.promptFrames;
  const frameLabels = ["A", "B", "C", "?"];
  return (
    <div className="space-y-4" data-testid="nvr-transform">
      <div className="overflow-x-auto">
        <div className="flex items-end gap-1.5 justify-center flex-nowrap min-w-min px-2">
          {frames.length >= 2 && (
            <>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-20 h-20 md:w-[100px] md:h-[100px]">
                  <FrameCard>
                    <SvgFrameView frame={frames[0]} className="w-full h-full" />
                  </FrameCard>
                </div>
                <span className="text-xs font-bold text-slate-400" data-testid="transform-label-a">{frameLabels[0]}</span>
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0 pb-4">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path d="M0 6h14m0 0l-4-4M14 6l-4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] text-slate-400 font-medium leading-none whitespace-nowrap">is to</span>
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-20 h-20 md:w-[100px] md:h-[100px]">
                  <FrameCard>
                    <SvgFrameView frame={frames[1]} className="w-full h-full" />
                  </FrameCard>
                </div>
                <span className="text-xs font-bold text-slate-400" data-testid="transform-label-b">{frameLabels[1]}</span>
              </div>
            </>
          )}

          <div className="flex flex-col items-center justify-end shrink-0 pb-4 px-1">
            <span className="text-sm font-bold text-slate-500 whitespace-nowrap">as</span>
          </div>

          {frames.length >= 3 && (
            <>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-20 h-20 md:w-[100px] md:h-[100px]">
                  <FrameCard>
                    <SvgFrameView frame={frames[2]} className="w-full h-full" />
                  </FrameCard>
                </div>
                <span className="text-xs font-bold text-slate-400" data-testid="transform-label-c">{frameLabels[2]}</span>
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0 pb-4">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path d="M0 6h14m0 0l-4-4M14 6l-4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] text-slate-400 font-medium leading-none whitespace-nowrap">is to</span>
              </div>
            </>
          )}

          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-20 h-20 md:w-[100px] md:h-[100px]">
              <QuestionPlaceholder />
            </div>
            <span className="text-xs font-bold" style={{ color: "#3B82F6" }} data-testid="transform-label-q">{frameLabels[3]}</span>
          </div>
        </div>
      </div>
      <SectionDivider label="Select the missing shape" />
      <SvgOptionGrid options={config.answerOptions} selectedIndex={selectedAnswer} onSelect={onSelectAnswer} />
    </div>
  );
}

function ClassificationLayout({ config, selectedAnswer, onSelectAnswer }: { config: NvrClassificationConfig; selectedAnswer: number | null; onSelectAnswer: (i: number) => void }) {
  const isMirror = config.sectionLabel === "Select the correct mirror image";
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
      {isMirror ? (
        <MirrorLineDivider />
      ) : (
        <SectionDivider label={config.sectionLabel ?? "Which one does not belong?"} />
      )}
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

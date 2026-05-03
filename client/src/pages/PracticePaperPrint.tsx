type Q = {
  n: number;
  subject: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  visual?: React.ReactNode;
};

const PASSAGE_SD04 = {
  title: "Antibiotics: Medicine's Greatest Weapon",
  text: `In 1928, Alexander Fleming returned from holiday to find something unexpected in his laboratory at St Mary's Hospital, London. A mould had accidentally contaminated one of his petri dishes, and the bacteria surrounding it had been killed. Fleming had discovered penicillin — a substance that would transform medicine and save hundreds of millions of lives.

Antibiotics work by either killing bacteria directly or preventing them from reproducing. Different antibiotics target different parts of bacterial cells. Penicillin, for example, disrupts the construction of bacterial cell walls, causing the cells to burst. Other antibiotics interfere with the bacteria's ability to make proteins or copy their DNA.

The introduction of antibiotics in the 1940s was revolutionary. Infections that had previously been fatal — pneumonia, tuberculosis, and infected wounds — could suddenly be cured. Average life expectancy increased dramatically, and surgery became far safer because the risk of post-operative infection was dramatically reduced.

However, bacteria are evolving to resist antibiotics at an alarming rate. When antibiotics are overused or prescribed unnecessarily, resistant bacteria survive and multiply. The World Health Organisation has described antibiotic resistance as one of the greatest threats to global health.`,
};

function PolygonShape({ sides, size = 38, strokeWidth = 2 }: { sides: number; size?: number; strokeWidth?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - strokeWidth;
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={points.join(" ")} fill="none" stroke="#0d1f30" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

function ShapeWithMark({ sides, fill = false, mark }: { sides: number; fill?: boolean; mark?: "dot" | "line" | "none" }) {
  const size = 44;
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={points.join(" ")} fill={fill ? "#cbd5e1" : "none"} stroke="#0d1f30" strokeWidth="2" strokeLinejoin="round" />
      {mark === "dot" && <circle cx={cx} cy={cy} r="2.5" fill="#0d1f30" />}
      {mark === "line" && <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#0d1f30" strokeWidth="1.5" />}
    </svg>
  );
}

function NvrSequence() {
  return (
    <div className="flex items-center gap-4 my-3">
      <PolygonShape sides={3} />
      <PolygonShape sides={4} />
      <PolygonShape sides={5} />
      <PolygonShape sides={6} />
      <span className="text-3xl font-bold text-slate-300 mx-1">→</span>
      <div className="w-[38px] h-[38px] border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-lg font-bold">?</div>
    </div>
  );
}

function NvrOptions({ sidesList }: { sidesList: number[] }) {
  return (
    <div className="flex items-center gap-3">
      {sidesList.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <PolygonShape sides={s} size={32} />
          <span className="text-[10px] font-bold text-slate-500 mt-1">{String.fromCharCode(65 + i)}</span>
        </div>
      ))}
    </div>
  );
}

function NvrOddOneOut() {
  return (
    <div className="flex items-center gap-4 my-3">
      {[
        { sides: 4, fill: true, label: "A" },
        { sides: 6, fill: true, label: "B" },
        { sides: 3, fill: false, label: "C" },
        { sides: 5, fill: true, label: "D" },
        { sides: 8, fill: true, label: "E" },
      ].map(({ sides, fill, label }, i) => (
        <div key={i} className="flex flex-col items-center">
          <ShapeWithMark sides={sides} fill={fill} />
          <span className="text-[10px] font-bold text-slate-500 mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

function NvrAnalogy() {
  return (
    <div className="flex items-center gap-3 my-3">
      <ShapeWithMark sides={4} mark="dot" />
      <span className="text-2xl text-slate-400">→</span>
      <ShapeWithMark sides={4} mark="line" />
      <span className="text-2xl text-slate-300 mx-2">::</span>
      <ShapeWithMark sides={3} mark="dot" />
      <span className="text-2xl text-slate-400">→</span>
      <div className="w-[44px] h-[44px] border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-lg font-bold">?</div>
      <span className="text-slate-300 mx-3">|</span>
      {[
        <ShapeWithMark key="a" sides={3} mark="line" />,
        <ShapeWithMark key="b" sides={3} mark="dot" />,
        <ShapeWithMark key="c" sides={4} mark="line" />,
        <ShapeWithMark key="d" sides={5} mark="line" />,
      ].map((el, i) => (
        <div key={i} className="flex flex-col items-center">
          {el}
          <span className="text-[10px] font-bold text-slate-500 mt-1">{String.fromCharCode(65 + i)}</span>
        </div>
      ))}
    </div>
  );
}

const QUESTIONS: Q[] = [
  {
    n: 1, subject: "Verbal Reasoning", type: "Antonyms",
    question: "Which word means the opposite of 'peace'?",
    options: ["war", "violence", "conflict", "chaos"],
    answer: "A",
    explanation: "'War' is the direct opposite of 'peace'. Violence, conflict and chaos are related to the absence of peace, but only 'war' names the precise antonym.",
  },
  {
    n: 2, subject: "Verbal Reasoning", type: "Letter Sequence",
    question: "What comes next in the sequence?  A  E  D  H  G  ?",
    options: ["K", "Q", "G", "M"],
    answer: "A",
    explanation: "Two interleaved patterns: positions 1, 3, 5 give A → D → G (skip 2 letters each time). Positions 2, 4, 6 give E → H → ?. From H, skip 2 letters: I, J, K. Answer: K.",
  },
  {
    n: 3, subject: "Verbal Reasoning", type: "Codes",
    question: "In a code, LAKE is coded as 3175 and KALE is coded as 7135. What is the code for LEAK?",
    options: ["3517", "3571", "3751", "3157"],
    answer: "A",
    explanation: "From the two given codes, each letter has one digit: L=3, A=1, K=7, E=5. So LEAK = 3-5-1-7 = 3517.",
  },
  {
    n: 4, subject: "Mathematics", type: "Percentages",
    question: "A jacket costs £95. It is reduced by 40% in a sale. What is the sale price?",
    options: ["£57", "£38", "£55", "£133"],
    answer: "A",
    explanation: "40% of £95 = £38 (the discount). Sale price = £95 − £38 = £57. Alternatively, 60% of £95 = £57.",
  },
  {
    n: 5, subject: "Mathematics", type: "Time",
    question: "A train departs at 08:55 and the journey takes 2 hours 40 minutes. What time does it arrive?",
    options: ["11:35", "10:55", "11:25", "11:45"],
    answer: "A",
    explanation: "08:55 + 2 hours = 10:55. 10:55 + 40 minutes = 11:35. Add the hours first, then add the minutes — easier than working in one step.",
  },
  {
    n: 6, subject: "Mathematics", type: "Ratio & Proportion",
    question: "A recipe for 8 pancakes uses 200 ml of milk and 2 eggs. How much milk is needed to make 20 pancakes?",
    options: ["500 ml", "250 ml", "400 ml", "600 ml"],
    answer: "A",
    explanation: "Scale factor = 20 ÷ 8 = 2.5. Milk = 200 × 2.5 = 500 ml. (The eggs are a distractor — the question only asks about milk.)",
  },
  {
    n: 7, subject: "Non-Verbal Reasoning", type: "Sequence",
    question: "The shapes below follow a pattern. Which shape comes next?",
    options: ["7-sided (heptagon)", "Square", "Circle", "Pentagon"],
    answer: "A",
    explanation: "The number of sides increases by 1 each step: 3, 4, 5, 6 → next has 7 sides (a heptagon). Look for the simplest rule: count the sides.",
    visual: (
      <div className="space-y-3">
        <NvrSequence />
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-3 mb-1">Options:</div>
        <NvrOptions sidesList={[7, 4, 0, 5]} />
        <p className="text-[10px] text-slate-400 italic">(Option C represents a circle — no straight sides.)</p>
      </div>
    ),
  },
  {
    n: 8, subject: "Non-Verbal Reasoning", type: "Odd One Out",
    question: "Four of these five shapes share a feature. Which is the odd one out?",
    options: ["A", "B", "C", "D"],
    answer: "C",
    explanation: "Four of the shapes are filled (shaded grey). The odd one out is C — it is the only unshaded shape. The number of sides is a distractor; the shared feature is the fill.",
    visual: <NvrOddOneOut />,
  },
  {
    n: 9, subject: "Non-Verbal Reasoning", type: "Analogy",
    question: "The first pair shows a transformation. Apply the same transformation to the third shape. Which option (A–D) completes the pair?",
    options: ["A", "B", "C", "D"],
    answer: "A",
    explanation: "In the first pair, the shape stays the same but the dot inside becomes a horizontal line. Apply the same to the triangle: the triangle stays the same and the dot becomes a horizontal line. Answer: A.",
    visual: <NvrAnalogy />,
  },
  {
    n: 10, subject: "English Comprehension", type: "Fact Retrieval",
    question: "In what year did Alexander Fleming discover penicillin?",
    options: ["1928", "1940", "1918", "1952"],
    answer: "A",
    explanation: "The opening sentence states: 'In 1928, Alexander Fleming returned from holiday…' Always check the exact wording of the passage rather than relying on memory.",
  },
  {
    n: 11, subject: "English Comprehension", type: "Vocabulary in Context",
    question: "In the passage, the word 'revolutionary' (paragraph 3) is closest in meaning to:",
    options: [
      "completely changing what was possible",
      "involving political protest",
      "happening very quickly",
      "extremely expensive",
    ],
    answer: "A",
    explanation: "Look at how the word is used: the next sentences explain that previously fatal infections could be cured and surgery became far safer. The author means that antibiotics changed what medicine could do — option A.",
  },
  {
    n: 12, subject: "English Comprehension", type: "Inference",
    question: "Why did surgery become far safer once antibiotics were introduced?",
    options: [
      "Wound infections that often killed patients could now be treated",
      "Surgeons performed operations more quickly",
      "Hospitals built better operating theatres",
      "Anaesthetics were also discovered at the same time",
    ],
    answer: "A",
    explanation: "The passage links safer surgery directly to 'the risk of post-operative infection was dramatically reduced'. Inference questions reward staying close to the text — pick the option the passage actually supports.",
  },
];

const SUBJECT_COLOUR: Record<string, string> = {
  "Verbal Reasoning": "#1d4ed8",
  "Mathematics": "#047857",
  "Non-Verbal Reasoning": "#b45309",
  "English Comprehension": "#7c3aed",
};

function QuestionCard({ q, showAnswer }: { q: Q; showAnswer: boolean }) {
  const colour = SUBJECT_COLOUR[q.subject] || "#0d1f30";
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden mb-4 break-inside-avoid">
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: colour + "15" }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colour }}>
          Q{q.n} · {q.subject} · {q.type}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-slate-800 mb-3">{q.question}</p>
        {q.visual && <div className="my-3">{q.visual}</div>}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isCorrect = letter === q.answer;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                  showAnswer && isCorrect
                    ? "bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800"
                    : "bg-slate-50 border border-slate-200 text-slate-600"
                }`}
              >
                <span className={`font-bold ${showAnswer && isCorrect ? "text-emerald-700" : "text-slate-400"}`}>{letter}</span>
                {opt}
                {showAnswer && isCorrect && <span className="ml-auto text-emerald-600">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PracticePaperPrint() {
  const ecQuestions = QUESTIONS.filter((q) => q.subject === "English Comprehension");
  const otherQuestions = QUESTIONS.filter((q) => q.subject !== "English Comprehension");

  return (
    <div className="practice-print bg-white text-slate-800 font-sans max-w-[210mm] mx-auto">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .practice-print { max-width: 100%; }
          .page-break { page-break-after: always; }
          nav, footer, header, .no-print { display: none !important; }
          a { color: inherit; text-decoration: none; }
          .print-link { text-decoration: underline; color: #0d1f30 !important; }
        }
        @media screen {
          .practice-print { padding: 2rem; }
          .page-break { border-bottom: 3px dashed #e2e8f0; margin: 2.5rem 0; padding-bottom: 2.5rem; }
        }
      `}</style>

      {/* COVER */}
      <div className="page-break">
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#0d1f30]" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0d1f30]" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <svg viewBox="0 0 48 48" className="w-12 h-12" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="none" stroke="#0d1f30" strokeWidth="2" />
                <circle cx="24" cy="24" r="14" fill="none" stroke="#0d1f30" strokeWidth="1" opacity="0.3" />
                <circle cx="24" cy="24" r="4" fill="#0d1f30" />
              </svg>
              <div className="text-left">
                <span className="block text-xl font-serif font-bold text-[#0d1f30]">Bucks 11 Plus Tests</span>
                <span className="block text-xs text-slate-500 tracking-widest uppercase">bucks11plustest.co.uk</span>
              </div>
            </div>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="inline-block border border-[#0d1f30]/20 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#0d1f30]/60 mb-6">
              Free Practice Paper · 2026 Edition
            </div>
            <h1 className="text-5xl font-serif font-bold text-[#0d1f30] mb-4 leading-tight">
              Bucks 11+ Free Practice Paper
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              12 GL-style questions across all four sections of the Buckinghamshire Secondary Transfer Test, with worked answers.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left mt-8">
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verbal Reasoning</div>
                <div className="font-bold text-[#0d1f30]">3 questions</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mathematics</div>
                <div className="font-bold text-[#0d1f30]">3 questions</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Non-Verbal Reasoning</div>
                <div className="font-bold text-[#0d1f30]">3 questions</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">English Comprehension</div>
                <div className="font-bold text-[#0d1f30]">3 questions</div>
              </div>
            </div>
            <div className="mt-10 text-xs text-slate-400">
              <p>Suggested time: 20 minutes</p>
              <p className="mt-1">For Year 4–Year 5 children preparing for the Bucks 11+</p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW TO USE */}
      <div className="page-break">
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">How to use this paper</h2>
          <p className="text-sm text-slate-500 mt-1">Get the most honest signal from these 12 questions</p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-700 mb-8">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1">1 · Quiet room, no help</div>
            <p>The whole point is an honest baseline. Sit with your child if it helps them stay calm, but don't prompt or hint. The first attempt is the most useful one.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1">2 · Aim for 20 minutes</div>
            <p>Real GL papers are tightly timed. 20 minutes for 12 questions averages 100 seconds per question — close to real test pace. Use a timer.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1">3 · Mark together</div>
            <p>Use the answer key to mark each question with your child. The explanation is more valuable than the score — it's what teaches them how to approach the next one.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1">4 · Look at section balance</div>
            <p>3 right out of 3 in Maths but 0 out of 3 in NVR is a far more useful insight than a total score. The Bucks test combines all four sections — strength in one cannot rescue weakness in another.</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#0d1f30] p-5 bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0d1f30]/60 mb-2">Want a precise readiness forecast?</p>
          <p className="text-sm text-slate-700 mb-3">
            Our free 12-question Readiness Check is timed, marked instantly, and returns an indicative readiness score against the Buckinghamshire 121 qualifying standard — plus your child's three weakest reasoning sub-skills.
          </p>
          <a
            href="https://bucks11plustest.co.uk/free-diagnostic"
            className="inline-block bg-[#0d1f30] text-white text-sm font-bold px-5 py-2.5 rounded-lg print-link"
          >
            Take the Free Readiness Check →
          </a>
        </div>
      </div>

      {/* QUESTIONS PAPER */}
      <div className="page-break">
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">Questions</h2>
          <p className="text-sm text-slate-500 mt-1">12 questions · 20 minutes · Mark answers on rough paper</p>
        </div>

        {otherQuestions.map((q) => (
          <QuestionCard key={q.n} q={q} showAnswer={false} />
        ))}

        <div className="rounded-xl border border-slate-200 overflow-hidden mb-4 break-inside-avoid">
          <div className="px-4 py-2" style={{ backgroundColor: SUBJECT_COLOUR["English Comprehension"] + "15" }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: SUBJECT_COLOUR["English Comprehension"] }}>
              Q10–Q12 · English Comprehension · Read the passage below
            </span>
          </div>
          <div className="px-4 py-3">
            <h3 className="font-serif font-bold text-base text-[#0d1f30] mb-2">{PASSAGE_SD04.title}</h3>
            <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line border-l-2 border-slate-200 pl-3 italic">
              {PASSAGE_SD04.text}
            </div>
          </div>
        </div>

        {ecQuestions.map((q) => (
          <QuestionCard key={q.n} q={q} showAnswer={false} />
        ))}
      </div>

      {/* ANSWER KEY */}
      <div className="page-break">
        <div className="border-l-4 border-emerald-600 pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">Answer key &amp; explanations</h2>
          <p className="text-sm text-slate-500 mt-1">Read each explanation with your child — that's where the learning happens</p>
        </div>

        {QUESTIONS.map((q) => {
          const colour = SUBJECT_COLOUR[q.subject] || "#0d1f30";
          return (
            <div key={q.n} className="border border-slate-200 rounded-lg p-4 mb-3 break-inside-avoid">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colour }}>
                    Q{q.n} · {q.subject} · {q.type}
                  </span>
                  <p className="text-sm font-medium text-slate-800 mt-1">{q.question}</p>
                </div>
                <div className="shrink-0 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Answer</div>
                  <div className="font-bold text-emerald-800 text-sm">
                    {q.answer} · {q.options[q.answer.charCodeAt(0) - 65]}
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 rounded p-3 border border-slate-100">
                {q.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* WHAT NEXT */}
      <div>
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">What to do next</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="font-bold text-[#0d1f30] mb-1">If your child got 9–12 right</div>
            <p className="text-sm text-slate-600">Strong baseline. The risk now is plateauing on familiar question types and being caught out by Hard-tier traps. Focus on harder drills and full mock papers under timed conditions.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="font-bold text-[#0d1f30] mb-1">If your child got 5–8 right</div>
            <p className="text-sm text-slate-600">The most common starting point. Identify the weakest section from this paper and concentrate practice there — closing the gap in one section moves the overall score the most.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="font-bold text-[#0d1f30] mb-1">If your child got 0–4 right</div>
            <p className="text-sm text-slate-600">Don't panic — these questions are deliberately at GL standard, which is harder than most school work. Start with the foundations: vocabulary for Verbal Reasoning, times-tables fluency for Maths, and one shape rule at a time for Non-Verbal Reasoning.</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#0d1f30] p-6 bg-slate-50 text-center">
          <h3 className="text-xl font-serif font-bold text-[#0d1f30] mb-2">See exactly where your child stands</h3>
          <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
            The free Readiness Check gives an indicative readiness score against the 121 Bucks qualifying standard and identifies the three skills that will move that score the most.
          </p>
          <a
            href="https://bucks11plustest.co.uk/free-diagnostic"
            className="inline-block bg-[#0d1f30] text-white text-sm font-bold px-6 py-3 rounded-lg print-link"
          >
            Take the Free Readiness Check
          </a>
          <p className="text-[11px] text-slate-400 mt-3">12 questions · timed · no account needed · instant results</p>
        </div>

        <div className="text-center mt-12 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            © Bucks 11 Plus Tests · Ianson Systems Limited · bucks11plustest.co.uk
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools or GL Assessment.
          </p>
        </div>
      </div>
    </div>
  );
}

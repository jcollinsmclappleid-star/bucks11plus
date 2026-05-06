type Q2 = {
  n: number;
  subject: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  visual?: React.ReactNode;
};

const PASSAGE_AURORA = {
  title: "The Northern Lights",
  text: `Few natural phenomena on Earth are as breathtaking as the aurora borealis, more commonly known as the Northern Lights. This spectacular display of colour in the night sky has inspired wonder and myth across many cultures for thousands of years.

The Northern Lights occur when charged particles from the Sun, carried on what scientists call the solar wind, collide with gases in Earth's upper atmosphere. When these particles strike oxygen and nitrogen molecules, they release energy as light. Oxygen produces the most common colours — green and red — while nitrogen creates blue and purple hues.

The best places to view the Northern Lights are within a ring around the magnetic North Pole called the auroral zone. Countries such as Norway, Iceland, and northern Canada regularly experience these displays, particularly in winter when nights are long and dark. The lights can appear as faint glowing arcs, but in intense periods — known as geomagnetic storms — they sweep dramatically across the sky in curtains and spirals of colour.

Despite being understood by scientists since the early twentieth century, the Northern Lights continue to attract visitors from around the world. Photographers, scientists and tourists alike travel to the auroral zone hoping to witness one of nature's most extraordinary performances.`,
};

const SUBJECT_COLOUR2: Record<string, string> = {
  "Verbal Reasoning": "#1d4ed8",
  "Mathematics": "#047857",
  "Non-Verbal Reasoning": "#b45309",
  "English Comprehension": "#7c3aed",
};

/* ── NVR Visuals ── */

function RotationDot({ pos }: { pos: "tr" | "br" | "bl" | "tl" }) {
  const coords: Record<string, [number, number]> = {
    tr: [33, 11], br: [33, 33], bl: [11, 33], tl: [11, 11],
  };
  const [cx, cy] = coords[pos];
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <rect x="3" y="3" width="38" height="38" fill="none" stroke="#0d1f30" strokeWidth="2" rx="3" />
      <circle cx={cx} cy={cy} r="5" fill="#0d1f30" />
    </svg>
  );
}

function NvrRotation() {
  const seq: Array<"tr" | "br" | "bl"> = ["tr", "br", "bl"];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 my-3">
        {seq.map((pos, i) => (
          <div key={i} className="flex flex-col items-center">
            <RotationDot pos={pos} />
            <span className="text-[10px] font-bold text-slate-500 mt-1">Step {i + 1}</span>
          </div>
        ))}
        <span className="text-3xl font-bold text-slate-300 mx-1">→</span>
        <div className="flex flex-col items-center">
          <div className="w-[44px] h-[44px] border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-lg font-bold">?</div>
          <span className="text-[10px] font-bold text-slate-500 mt-1">Next</span>
        </div>
      </div>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Options:</div>
      <div className="flex items-center gap-3">
        {(["tl", "tr", "br", "bl"] as const).map((pos, i) => (
          <div key={i} className="flex flex-col items-center">
            <RotationDot pos={pos} />
            <span className="text-[10px] font-bold text-slate-500 mt-1">{String.fromCharCode(65 + i)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixCell({ sides, filled, empty }: { sides: number; filled: boolean; empty?: boolean }) {
  const size = 40;
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  if (empty) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x="2" y="2" width={size - 4} height={size - 4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 2" rx="2" />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="18" fill="#cbd5e1" fontWeight="bold">?</text>
      </svg>
    );
  }
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={points.join(" ")} fill={filled ? "#0d1f30" : "none"} stroke="#0d1f30" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function MatrixOptionShape({ sides, filled }: { sides: number; filled: boolean }) {
  const size = 34;
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={points.join(" ")} fill={filled ? "#0d1f30" : "none"} stroke="#0d1f30" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function NvrMatrix() {
  return (
    <div className="space-y-3">
      <div className="inline-grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
        {[
          { sides: 3, filled: true }, { sides: 4, filled: true },
          { sides: 3, filled: false }, { sides: 4, filled: false },
          { sides: 5, filled: true }, { sides: 0, filled: false, empty: true },
        ].map((cell, i) => (
          <div key={i} className="flex items-center justify-center">
            <MatrixCell sides={cell.sides} filled={cell.filled} empty={cell.empty as boolean | undefined} />
          </div>
        ))}
      </div>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Options:</div>
      <div className="flex items-center gap-3">
        {[
          { sides: 5, filled: true }, { sides: 6, filled: false },
          { sides: 4, filled: false }, { sides: 5, filled: false },
        ].map((opt, i) => (
          <div key={i} className="flex flex-col items-center">
            <MatrixOptionShape sides={opt.sides} filled={opt.filled} />
            <span className="text-[10px] font-bold text-slate-500 mt-1">{String.fromCharCode(65 + i)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReflectionFlag({ mirrored }: { mirrored: boolean }) {
  const size = 48;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {mirrored ? (
        <>
          <line x1="30" y1="6" x2="30" y2="42" stroke="#0d1f30" strokeWidth="3" strokeLinecap="round" />
          <polygon points="30,8 10,15 30,22" fill="#0d1f30" />
        </>
      ) : (
        <>
          <line x1="18" y1="6" x2="18" y2="42" stroke="#0d1f30" strokeWidth="3" strokeLinecap="round" />
          <polygon points="18,8 38,15 18,22" fill="#0d1f30" />
        </>
      )}
    </svg>
  );
}

function NvrReflection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 my-3 bg-slate-50 rounded-lg border border-slate-200 p-3">
        <div className="flex flex-col items-center">
          <ReflectionFlag mirrored={false} />
          <span className="text-[10px] font-bold text-slate-500 mt-1">Original</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-0.5 h-12 border-l-2 border-dashed border-slate-400 relative">
            <span className="absolute -top-4 left-1 text-[9px] text-slate-400 font-bold whitespace-nowrap">Mirror</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[48px] h-[48px] border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-lg font-bold">?</div>
          <span className="text-[10px] font-bold text-slate-500 mt-1">Reflection</span>
        </div>
      </div>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Options:</div>
      <div className="flex items-center gap-4">
        {[true, false, true, false].map((m, i) => (
          <div key={i} className="flex flex-col items-center">
            {i === 1 ? (
              <svg width={48} height={48} viewBox="0 0 48 48">
                <line x1="24" y1="6" x2="24" y2="42" stroke="#0d1f30" strokeWidth="3" strokeLinecap="round" />
                <polygon points="24,8 44,15 24,22" fill="#0d1f30" />
              </svg>
            ) : i === 3 ? (
              <svg width={48} height={48} viewBox="0 0 48 48">
                <line x1="24" y1="6" x2="24" y2="42" stroke="#0d1f30" strokeWidth="3" strokeLinecap="round" />
                <polygon points="24,28 4,35 24,42" fill="#0d1f30" />
              </svg>
            ) : (
              <ReflectionFlag mirrored={m} />
            )}
            <span className="text-[10px] font-bold text-slate-500 mt-1">{String.fromCharCode(65 + i)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Questions ── */

const QUESTIONS2: Q2[] = [
  {
    n: 1, subject: "Verbal Reasoning", type: "Synonyms",
    question: "Which word is closest in meaning to FRUGAL?",
    options: ["thrifty", "generous", "careless", "wealthy"],
    answer: "A",
    explanation: "Frugal means careful with money and avoiding waste. Thrifty shares this meaning exactly. Generous, wealthy and careless all mean something different.",
  },
  {
    n: 2, subject: "Verbal Reasoning", type: "Compound Words",
    question: "Which word can complete all three of the following? _LIGHT  _SHINE  _FLOWER",
    options: ["SUN", "DAY", "MOON", "STAR"],
    answer: "A",
    explanation: "SUN completes all three: SUNLIGHT, SUNSHINE, SUNFLOWER. Check each option: DAY gives DAYLIGHT and DAYSHINE (not a word) and DAYFLOWER (uncommon). Only SUN works for all three.",
  },
  {
    n: 3, subject: "Verbal Reasoning", type: "Letter Sequence",
    question: "What letter comes next in the sequence?  Z  X  V  T  ?",
    options: ["R", "S", "P", "Q"],
    answer: "A",
    explanation: "Each letter moves back 2 places in the alphabet: Z→X→V→T→R. Skipping one letter each time going backwards.",
  },
  {
    n: 4, subject: "Mathematics", type: "Area",
    question: "A rectangular field is 12 metres long and 7 metres wide. What is its area?",
    options: ["84 m²", "38 m²", "76 m²", "96 m²"],
    answer: "A",
    explanation: "Area of a rectangle = length × width = 12 × 7 = 84 m². (Perimeter would be 2 × (12 + 7) = 38 m — don't confuse area with perimeter.)",
  },
  {
    n: 5, subject: "Mathematics", type: "Number Sequences",
    question: "What is the next number in this sequence?  3,  7,  15,  31,  ?",
    options: ["63", "47", "59", "55"],
    answer: "A",
    explanation: "Each term is doubled then add 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63. Look for the rule connecting each pair of consecutive terms.",
  },
  {
    n: 6, subject: "Mathematics", type: "Fractions",
    question: "What is 2/3 + 3/4? Give your answer as a mixed number.",
    options: ["1 5/12", "1 1/4", "1 1/3", "5/7"],
    answer: "A",
    explanation: "Find a common denominator: 2/3 = 8/12, 3/4 = 9/12. Add: 8/12 + 9/12 = 17/12 = 1 5/12. Always convert to a common denominator before adding fractions.",
  },
  {
    n: 7, subject: "Non-Verbal Reasoning", type: "Rotation",
    question: "The dot moves 90° clockwise around the inside of the box at each step. Which option shows the next position?",
    options: ["Top-left", "Top-right", "Bottom-right", "Bottom-left"],
    answer: "A",
    explanation: "The dot starts top-right (step 1), moves to bottom-right (step 2), then to bottom-left (step 3). The next 90° clockwise move takes it to the top-left corner. Answer: A.",
    visual: <NvrRotation />,
  },
  {
    n: 8, subject: "Non-Verbal Reasoning", type: "Matrix",
    question: "The grid follows two rules: one for each row, one for each column. Which shape completes the grid?",
    options: ["Filled pentagon", "Empty hexagon", "Empty square", "Empty pentagon"],
    answer: "D",
    explanation: "Row rule: the number of sides increases by 2 per row (triangle=3, pentagon=5). Column rule: left column is filled, right column is empty. Row 3, right column needs an empty shape with 5 sides — an empty pentagon. Answer: D.",
    visual: <NvrMatrix />,
  },
  {
    n: 9, subject: "Non-Verbal Reasoning", type: "Reflection",
    question: "The shape on the left is reflected in the vertical mirror line. Which option shows the correct reflection?",
    options: ["A", "B", "C", "D"],
    answer: "A",
    explanation: "Reflecting in a vertical line swaps left and right. The flag points right in the original — so it must point left in the reflection. Only option A shows the flag reversed correctly on its pole. The pole stays vertical; only the flag direction changes.",
    visual: <NvrReflection />,
  },
  {
    n: 10, subject: "English Comprehension", type: "Fact Retrieval",
    question: "According to the passage, which gas produces the most common colours in the Northern Lights?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: "A",
    explanation: "The passage states: 'Oxygen produces the most common colours — green and red.' Always go back to the text for fact retrieval questions rather than relying on background knowledge.",
  },
  {
    n: 11, subject: "English Comprehension", type: "Inference",
    question: "Why are winter nights particularly good for viewing the Northern Lights in the auroral zone?",
    options: [
      "The nights are long and dark, making the lights easier to see",
      "The Sun produces more charged particles in winter",
      "Geomagnetic storms only occur in winter",
      "The auroral zone moves closer to the ground in winter",
    ],
    answer: "A",
    explanation: "The passage says the displays occur 'particularly in winter when nights are long and dark'. Long, dark nights mean more hours of darkness in which to observe the lights. The other options are not supported by the passage.",
  },
  {
    n: 12, subject: "English Comprehension", type: "Vocabulary in Context",
    question: "In the first sentence, the word 'phenomena' is closest in meaning to:",
    options: [
      "events or occurrences",
      "living creatures",
      "scientific experiments",
      "ancient myths",
    ],
    answer: "A",
    explanation: "A phenomenon (plural: phenomena) is a remarkable or observable event or occurrence. The sentence describes the aurora borealis as a natural 'phenomenon' — something that happens and can be observed. Context: 'few natural phenomena on Earth' confirms it refers to natural occurrences.",
  },
];

function QuestionCard2({ q, showAnswer }: { q: Q2; showAnswer: boolean }) {
  const colour = SUBJECT_COLOUR2[q.subject] || "#0d1f30";
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

export default function PracticePaperPrint2() {
  const ecQuestions = QUESTIONS2.filter((q) => q.subject === "English Comprehension");
  const otherQuestions = QUESTIONS2.filter((q) => q.subject !== "English Comprehension");

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
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0d1f30]/20" />

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
              Free Practice Paper 2 · 2026 Edition
            </div>
            <h1 className="text-5xl font-serif font-bold text-[#0d1f30] mb-4 leading-tight">
              Bucks 11+ Free Practice Paper 2
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              12 GL-style questions covering the four subject areas of the Bucks 11+, with full worked explanations. Different question types from Paper 1.
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left mt-8">
              {[
                { label: "Verbal Reasoning", colour: SUBJECT_COLOUR2["Verbal Reasoning"] },
                { label: "Mathematics", colour: SUBJECT_COLOUR2["Mathematics"] },
                { label: "Non-Verbal Reasoning", colour: SUBJECT_COLOUR2["Non-Verbal Reasoning"] },
                { label: "English Comprehension", colour: SUBJECT_COLOUR2["English Comprehension"] },
              ].map(({ label, colour }) => (
                <div key={label} className="rounded-lg border border-slate-200 p-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colour }} />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
                    <div className="font-bold text-[#0d1f30] text-sm">3 questions</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-xs text-slate-400 space-y-1">
              <p>Suggested time: 20 minutes &nbsp;·&nbsp; Rough paper recommended</p>
              <p>Suitable for Year 4–Year 5 children preparing for the Bucks 11+</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-8">
            <p className="text-[9px] text-slate-400 text-center leading-relaxed">
              This is an independent practice resource produced by Bucks 11 Plus Tests. It is not an official Buckinghamshire Secondary Transfer Test paper and is not produced by or affiliated with GL Assessment or Buckinghamshire Council. Results from this paper are for practice guidance only and are not predictive of outcomes in any external test.
            </p>
          </div>
        </div>
      </div>

      {/* HOW TO USE */}
      <div className="page-break">
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">How to use this paper</h2>
          <p className="text-sm text-slate-500 mt-1">Tips for getting the most from this practice session</p>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-slate-700 mb-8">
          {[
            { n: "1", title: "Find a quiet space", body: "Sit with your child if it helps them feel settled, but let them work through the questions independently. A first attempt without prompting gives you the clearest picture of which areas to focus on next." },
            { n: "2", title: "Aim for 20 minutes", body: "GL-style papers are timed. 20 minutes for 12 questions is approximately 100 seconds per question — a useful pace to practise. Use a timer, but don't stress if your child needs a little longer in early attempts." },
            { n: "3", title: "Mark together — read the explanations", body: "The worked explanations are more valuable than the score itself. Reading them together helps your child understand the approach, not just the answer." },
            { n: "4", title: "Compare with Paper 1", body: "If your child has already completed Paper 1, compare results across subjects. A pattern that shows up in both papers is more reliable than a result from just one session." },
          ].map((step) => (
            <div key={step.n} className="rounded-lg border border-slate-200 p-4 flex gap-3">
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#0d1f30]/10 flex items-center justify-center text-xs font-bold text-[#0d1f30]">{step.n}</div>
              <div>
                <div className="font-bold text-[#0d1f30] mb-1">{step.title}</div>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0d1f30]/50 mb-2">Looking for a more detailed picture?</p>
          <p className="text-sm text-slate-600 mb-3">
            Our free 12-question Readiness Check is timed, marked instantly, and returns a practice score on the 121 scale — plus your child's three areas for improvement.
          </p>
          <a
            href="https://bucks11plustest.co.uk/free-diagnostic"
            className="inline-block bg-[#0d1f30] text-white text-sm font-bold px-5 py-2.5 rounded-lg print-link"
          >
            Take the Free Readiness Check →
          </a>
          <p className="text-[10px] text-slate-400 mt-2">Independent practice indicator — not an official test score.</p>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="page-break">
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">Questions</h2>
          <p className="text-sm text-slate-500 mt-1">12 questions &nbsp;·&nbsp; Suggested 20 minutes &nbsp;·&nbsp; Circle or write your answers on rough paper</p>
        </div>

        {otherQuestions.map((q) => (
          <QuestionCard2 key={q.n} q={q} showAnswer={false} />
        ))}

        <div className="rounded-xl border border-slate-200 overflow-hidden mb-4 break-inside-avoid">
          <div className="px-4 py-2.5" style={{ backgroundColor: SUBJECT_COLOUR2["English Comprehension"] + "15" }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: SUBJECT_COLOUR2["English Comprehension"] }}>
              Q10–Q12 · English Comprehension · Read the passage, then answer the questions below
            </span>
          </div>
          <div className="px-5 py-4">
            <h3 className="font-serif font-bold text-base text-[#0d1f30] mb-3">{PASSAGE_AURORA.title}</h3>
            <div className="text-[13px] text-slate-700 leading-[1.8] whitespace-pre-line bg-slate-50 rounded-lg border border-slate-100 px-4 py-3">
              {PASSAGE_AURORA.text}
            </div>
          </div>
        </div>

        {ecQuestions.map((q) => (
          <QuestionCard2 key={q.n} q={q} showAnswer={false} />
        ))}
      </div>

      {/* ANSWER KEY */}
      <div className="page-break">
        <div className="border-l-4 border-emerald-500 pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">Answer key &amp; explanations</h2>
          <p className="text-sm text-slate-500 mt-1">Read each explanation with your child — this is where the learning happens</p>
        </div>

        {QUESTIONS2.map((q) => {
          const colour = SUBJECT_COLOUR2[q.subject] || "#0d1f30";
          return (
            <div key={q.n} className="border border-slate-200 rounded-xl p-4 mb-3 break-inside-avoid">
              <div className="flex items-start gap-3 mb-2">
                <div className="shrink-0 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center min-w-[52px]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">Q{q.n}</div>
                  <div className="font-bold text-emerald-800 text-base leading-none">{q.answer}</div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colour }}>
                    {q.subject} · {q.type}
                  </span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{q.question}</p>
                </div>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                {q.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* WHERE TO GO NEXT */}
      <div>
        <div className="border-l-4 border-[#0d1f30] pl-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-[#0d1f30]">Where to go from here</h2>
          <p className="text-sm text-slate-500 mt-1">Suggestions based on how this paper felt</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="rounded-xl border-l-4 border-emerald-500 border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1 text-sm">Most questions felt manageable (9–12 right)</div>
            <p className="text-sm text-slate-600">A good starting point. The next step is tackling more challenging question types and practising under stricter timed conditions — that's where preparation tends to make the biggest difference.</p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-400 border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1 text-sm">A mixed result (5–8 right)</div>
            <p className="text-sm text-slate-600">Notice which subject area felt hardest and compare with Paper 1. A consistent weak area across both papers is a reliable signal of where to focus practice time.</p>
          </div>
          <div className="rounded-xl border-l-4 border-slate-300 border border-slate-200 p-4">
            <div className="font-bold text-[#0d1f30] mb-1 text-sm">Found it quite difficult (0–4 right)</div>
            <p className="text-sm text-slate-600">These questions reflect the difficulty level typical of this type of preparation material — harder than most school work. Reading the explanations carefully is the most useful thing to do at this stage. Understanding why an answer is correct matters more than the mark.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 text-center">
          <h3 className="text-xl font-serif font-bold text-[#0d1f30] mb-2">Get an indicative picture of readiness</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
            The free Readiness Check is timed, instantly marked, and produces a practice score on the 121 scale — along with the three areas most worth focusing on next.
          </p>
          <a
            href="https://bucks11plustest.co.uk/free-diagnostic"
            className="inline-block bg-[#0d1f30] text-white text-sm font-bold px-6 py-3 rounded-lg print-link"
          >
            Take the Free Readiness Check
          </a>
          <p className="text-[11px] text-slate-400 mt-3">12 questions &nbsp;·&nbsp; timed &nbsp;·&nbsp; no account needed &nbsp;·&nbsp; instant results</p>
          <p className="text-[10px] text-slate-400 mt-1">Independent practice indicator — not an official test score.</p>
        </div>

        <div className="text-center mt-12 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">© Bucks 11 Plus Tests · Ianson Systems Limited · bucks11plustest.co.uk</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools or GL Assessment. This paper is for practice purposes only and does not predict or guarantee outcomes in any external test.
          </p>
        </div>
      </div>
    </div>
  );
}

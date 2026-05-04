# Platform Showcase Panel — Full Replication Guide

This document describes every component, data structure and layout decision in the "What You Get / Full Platform Suite" section of the Bucks 11+ landing page. Hand this to another developer or AI to reproduce the panel in a different app.

---

## 1. Where this lives

File: `client/src/pages/Landing.tsx`

The entire landing page is one large file (~2,150 lines). The relevant code sits in three areas:

| Lines (approx.) | Content |
|---|---|
| 1,086–1,104 | `BrowserChrome`, `PaidBadge`, `FreeBadge` helper components |
| 1,106–1,300 | `BANK_SUBJECTS` data, `DIFF_STYLES` map, `DrillGrid` component, `InsidePlatformPanel` component |
| 1,427–1,585 | "What You Get" section: tabs (mobile pill strip + desktop vertical tabs) + right-hand panel renderer |

---

## 2. Helper components

### `BrowserChrome`

A fake browser chrome bar placed at the top of each card to make it look like a real app page.

```tsx
function BrowserChrome({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border-b border-slate-700">
      <div className="w-2 h-2 rounded-full bg-red-400" />
      <div className="w-2 h-2 rounded-full bg-amber-400" />
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-[10px] text-white/50 ml-2 font-medium">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
```

### `PaidBadge`

A small pill that says "Paid plan". There is only one paid plan tier, so this is always the same label.

```tsx
function PaidBadge() {
  return (
    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
      Paid plan
    </span>
  );
}
```

### `FreeBadge`

```tsx
function FreeBadge() {
  return (
    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
      Free
    </span>
  );
}
```

---

## 3. Practice Bank data

### `BANK_SUBJECTS`

An array of subject objects. Each has a label, icon (emoji), subtitle, and a `drills` array. Every drill has a name, difficulty (`"Easy" | "Medium" | "Hard"`) and question count string.

```ts
const BANK_SUBJECTS = [
  {
    label: "Non-Verbal Reasoning", icon: "📐", sub: "Shape & pattern puzzles",
    drills: [
      { name: "Mirror Images",            diff: "Easy",   qs: "10 Qs" },
      { name: "Odd One Out",              diff: "Easy",   qs: "12 Qs" },
      { name: "Different Sequences",      diff: "Easy",   qs: "12 Qs" },
      { name: "Pattern Recognition",      diff: "Easy",   qs: "15 Qs" },
      { name: "Symmetry & Spatial",       diff: "Medium", qs: "12 Qs" },
      { name: "Classification Challenge", diff: "Medium", qs: "12 Qs" },
      { name: "Advanced Transformations", diff: "Hard",   qs: "12 Qs" },
      { name: "Advanced Symmetry",        diff: "Hard",   qs: "12 Qs" },
    ],
  },
  {
    label: "Verbal Reasoning", icon: "🔤", sub: "Language, logic & patterns",
    drills: [
      { name: "Word Analogies",            diff: "Medium", qs: "15 Qs" },
      { name: "Logical Deduction",         diff: "Medium", qs: "15 Qs" },
      { name: "Hidden Words",              diff: "Medium", qs: "10 Qs" },
      { name: "Word Classification",       diff: "Medium", qs: "10 Qs" },
      { name: "Letter Sequences",          diff: "Hard",   qs: "12 Qs" },
      { name: "Code Breaking",             diff: "Hard",   qs: "12 Qs" },
      { name: "Adv. Word Analogies",       diff: "Hard",   qs: "12 Qs" },
      { name: "Adv. Hidden Words",         diff: "Hard",   qs: "12 Qs" },
      { name: "Adv. Logical Deduction",    diff: "Hard",   qs: "12 Qs" },
      { name: "Adv. Word Classification",  diff: "Hard",   qs: "10 Qs" },
    ],
  },
  {
    label: "Mathematics", icon: "➗", sub: "Arithmetic, geometry & problem-solving",
    drills: [
      { name: "Starter Arithmetic",          diff: "Easy",   qs: "10 Qs" },
      { name: "Starter Fractions",           diff: "Easy",   qs: "8 Qs"  },
      { name: "Starter Number Patterns",     diff: "Easy",   qs: "6 Qs"  },
      { name: "Starter Percentages",         diff: "Easy",   qs: "6 Qs"  },
      { name: "Starter Ratio",               diff: "Easy",   qs: "4 Qs"  },
      { name: "Starter Shape & Geometry",    diff: "Easy",   qs: "10 Qs" },
      { name: "Starter Data & Averages",     diff: "Easy",   qs: "6 Qs"  },
      { name: "Data Interpretation",         diff: "Easy",   qs: "10 Qs" },
      { name: "Arithmetic & Number",         diff: "Medium", qs: "15 Qs" },
      { name: "Number Patterns",             diff: "Medium", qs: "12 Qs" },
      { name: "Shape & Geometry",            diff: "Medium", qs: "15 Qs" },
      { name: "Fractions & Percentages",     diff: "Medium", qs: "10 Qs" },
      { name: "Percentages",                 diff: "Medium", qs: "10 Qs" },
      { name: "Ratio & Proportion",          diff: "Medium", qs: "10 Qs" },
      { name: "Multi-step Word Problems",    diff: "Medium", qs: "12 Qs" },
      { name: "Adv. Data Interpretation",    diff: "Medium", qs: "10 Qs" },
      { name: "Advanced Arithmetic",         diff: "Hard",   qs: "12 Qs" },
      { name: "Advanced Shape & Geometry",   diff: "Hard",   qs: "15 Qs" },
      { name: "Advanced Fractions",          diff: "Hard",   qs: "10 Qs" },
      { name: "Advanced Number Patterns",    diff: "Hard",   qs: "10 Qs" },
      { name: "Advanced Percentages",        diff: "Hard",   qs: "10 Qs" },
      { name: "Advanced Ratio & Proportion", diff: "Hard",   qs: "10 Qs" },
    ],
  },
  {
    label: "English Comprehension", icon: "📖", sub: "Passage reading & analysis",
    drills: [
      { name: "Fact Retrieval",          diff: "Easy",   qs: "15 Qs" },
      { name: "Vocabulary in Context",   diff: "Medium", qs: "12 Qs" },
      { name: "Inference & Deduction",   diff: "Medium", qs: "12 Qs" },
      { name: "Detail Retrieval",        diff: "Medium", qs: "12 Qs" },
      { name: "Mood & Tone",             diff: "Hard",   qs: "10 Qs" },
      { name: "Advanced Comprehension",  diff: "Hard",   qs: "10 Qs" },
    ],
  },
];
```

### `DIFF_STYLES`

Tailwind colour map keyed by difficulty string:

```ts
const DIFF_STYLES: Record<string, string> = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
};
```

---

## 4. `DrillGrid` component

Renders a responsive 3-column grid of drill cards for one subject. Each card shows the difficulty badge (top-left), question count (top-right), drill name, and a "Start" button.

```tsx
function DrillGrid({ drills }: { drills: typeof BANK_SUBJECTS[0]["drills"] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {drills.map((d, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-2">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${DIFF_STYLES[d.diff]}`}>{d.diff}</span>
            <span className="text-[8px] text-slate-400">{d.qs}</span>
          </div>
          <div className="text-[9px] font-bold text-slate-800 leading-tight mb-1.5">{d.name}</div>
          <div className="text-center text-[8px] font-bold py-0.5 rounded bg-slate-100 text-slate-600">Start</div>
        </div>
      ))}
    </div>
  );
}
```

---

## 5. `InsidePlatformPanel` — the full component

Three stacked browser-chrome mockup cards. Each has:

- A `BrowserChrome` header bar (dark slate, traffic-light dots, page title)
- A light grey `bg-slate-50` header strip with the page title and subtitle
- A **scrollable** white body (`overflow-y-auto` with a fixed `max-h-*`) — parents can scroll to see all content
- A `bg-slate-50` footer strip with a description and `PaidBadge` (or `FreeBadge` where relevant)

### Card 1 — Readiness Checks & Mocks

Scrollable body (`max-h-[240px]`). 2-column grid of 6 assessment cards:

| Name | Time | Questions | Badge |
|---|---|---|---|
| Mini Diagnostic | 8 mins | 12 Qs | Free |
| Full Diagnostic A | 30 mins | 45 Qs | Paid plan |
| Full Diagnostic B | 30 mins | 45 Qs | Paid plan |
| Mock Exam 1 | 35 mins | 50 Qs | Paid plan |
| Mock Exam 2 | 50 mins | 50 Qs | Paid plan |
| Mock Exam 3 | 50 mins | 50 Qs | Paid plan |

The Mini Diagnostic card uses `bg-slate-900 text-white` for its button; all others use `bg-slate-100 text-slate-700`.

Footer: "1 free mini · 2 full diagnostics · 3 mock exams · PDF report each"

### Card 2 — Practice Papers

Scrollable body (`max-h-[200px]`). 3-column grid:

| Name | Icon | Time | Questions | Description |
|---|---|---|---|---|
| Quick Paper | ⚡ | 25 min | 20 Qs | Focused paper across all 4 sections |
| Full Paper | 📄 | 45 min | 40 Qs | Complete paper mirroring real exam balance |
| Mock Exam | 🎓 | 50 min | 50 Qs | Exam simulation under timed conditions |

Footer: "Quick, Full & Mock formats · unlimited attempts · fresh questions each time"

### Card 3 — Practice Bank (full suite, scrollable)

Header strip also includes an **Untimed / Timed toggle** (visual only, no state needed for the landing mockup — first pill is active/dark):

```tsx
{["Untimed", "Timed"].map((t, i) => (
  <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
    ${i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`}>
    {t}
  </span>
))}
```

Scrollable body (`max-h-[380px]`). Iterates over `BANK_SUBJECTS`. For each subject:

1. A heading row: `{icon} {label}` in bold + a small grey subtitle
2. A `<DrillGrid>` with all drills for that subject

```tsx
{BANK_SUBJECTS.map((subj) => (
  <div key={subj.label}>
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[10px] font-bold text-slate-700">{subj.icon} {subj.label}</span>
      <span className="text-[8px] text-slate-400">{subj.sub}</span>
    </div>
    <DrillGrid drills={subj.drills} />
  </div>
))}
```

Footer: "46 drills across 4 subjects · 2,500+ questions · adaptive difficulty · worked solutions"

---

## 6. Full `InsidePlatformPanel` JSX (copy-paste ready)

```tsx
function InsidePlatformPanel() {
  return (
    <div className="w-full space-y-3" data-testid="showcase-inside">

      {/* Card 1 — Readiness Checks & Mocks */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Readiness Checks & Mocks" />
        <div className="bg-slate-50 px-3 pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-700 mb-0.5">Fixed Readiness Checks & Mocks</p>
          <p className="text-[9px] text-slate-400">Structured assessments to measure progress and recalibrate your forecast score.</p>
        </div>
        <div className="overflow-y-auto max-h-[240px] bg-white px-3 py-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Mini Diagnostic",  time: "8 mins",  qs: "12 Qs", free: true,  btn: "Start Readiness Check", btnStyle: "bg-slate-900 text-white" },
              { name: "Full Diagnostic A",time: "30 mins", qs: "45 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Full Diagnostic B",time: "30 mins", qs: "45 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 1",      time: "35 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 2",      time: "50 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
              { name: "Mock Exam 3",      time: "50 mins", qs: "50 Qs", free: false, btn: "Start", btnStyle: "bg-slate-100 text-slate-700" },
            ].map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{c.name}</span>
                  {c.free ? <FreeBadge /> : <PaidBadge />}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-2">
                  <span>⏱ {c.time}</span><span>· {c.qs}</span>
                </div>
                <div className={`text-center text-[9px] font-bold py-1 rounded-md ${c.btnStyle}`}>{c.btn}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">1 free mini · 2 full diagnostics · 3 mock exams · PDF report each</span>
          <PaidBadge />
        </div>
      </div>

      {/* Card 2 — Practice Papers */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Practice Papers" />
        <div className="bg-slate-50 px-3 pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Papers</p>
          <p className="text-[9px] text-slate-400">Unlimited practice papers drawn from our full question bank.</p>
        </div>
        <div className="overflow-y-auto max-h-[200px] bg-white px-3 py-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Quick Paper", icon: "⚡", time: "25 min", qs: "20 Qs", desc: "Focused paper across all 4 sections" },
              { name: "Full Paper",  icon: "📄", time: "45 min", qs: "40 Qs", desc: "Complete paper mirroring real exam balance" },
              { name: "Mock Exam",   icon: "🎓", time: "50 min", qs: "50 Qs", desc: "Exam simulation under timed conditions" },
            ].map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5 flex flex-col">
                <div className="text-base mb-1">{p.icon}</div>
                <div className="text-[10px] font-bold text-slate-800 mb-0.5">{p.name}</div>
                <div className="text-[9px] text-slate-500 mb-0.5">{p.time} · {p.qs}</div>
                <div className="text-[8px] text-slate-400 leading-snug mb-2 flex-1">{p.desc}</div>
                <div className="text-center text-[9px] font-bold py-1 rounded-md bg-slate-100 text-slate-700">Start Paper</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">Quick, Full & Mock formats · unlimited attempts · fresh questions each time</span>
          <PaidBadge />
        </div>
      </div>

      {/* Card 3 — Practice Bank (all 4 subjects, scrollable) */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BrowserChrome title="Practice Bank" />
        <div className="bg-slate-50 px-3 pt-3 pb-1 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-700 mb-0.5">Practice Bank</p>
            <p className="text-[9px] text-slate-400">Targeted drills grouped by subject — work on the areas your child needs most.</p>
          </div>
          <div className="flex gap-1 shrink-0 ml-2 mt-0.5">
            {["Untimed", "Timed"].map((t, i) => (
              <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
                ${i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto max-h-[380px] bg-white px-3 py-2 space-y-4">
          {BANK_SUBJECTS.map((subj) => (
            <div key={subj.label}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-bold text-slate-700">{subj.icon} {subj.label}</span>
                <span className="text-[8px] text-slate-400">{subj.sub}</span>
              </div>
              <DrillGrid drills={subj.drills} />
            </div>
          ))}
        </div>
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">46 drills across 4 subjects · 2,500+ questions · adaptive difficulty · worked solutions</span>
          <PaidBadge />
        </div>
      </div>

    </div>
  );
}
```

---

## 7. How the panel fits into the "What You Get" tab system

The landing page has a 7-tab "What You Get" section (`activeFeature` state, `useState(0)`). The panel renders when `activeFeature === 6`.

**Desktop layout** (`lg:grid lg:grid-cols-3`):
- Left column (`col-span-1`): vertical list of 7 tab buttons. Active tab has `border-primary/30 bg-primary/5`. Each tab has a coloured dot, a small uppercase label, and a serif heading.
- Right column (`col-span-2`): renders the active panel above, and the matching copy block (badge, h3, body paragraph, meta line) below.

**Mobile layout**: a horizontal scrollable pill strip of 7 buttons, snap-scrolling, followed by the same right-hand panel directly below.

Tab 7 (index 6) — "Full Platform Suite":
- Dot colour: `bg-purple-500`
- Mobile label: "Full Suite"
- Desktop label: "Full Platform Suite"
- Desktop title: "See everything subscribers access — unlocked"
- Badge: `text-purple-700 bg-purple-100 border-purple-200`
- Copy title: "Readiness checks, practice tests and mock tests — here's exactly what's inside"
- Copy body: "Full 45-question readiness checks across all four domains, adaptive practice drills targeting your child's weakest sub-skills, and timed mock tests in exam-day format. Browse the complete suite below — no vague upgrade prompts, no hidden content."
- Meta: "45-question readiness checks · adaptive practice drills · timed mock tests · PDF reports"

---

## 8. Key design rules (do not break these)

1. **One paid tier only.** All badges say "Paid plan" — never "Edge & above", "Practice Platform", "Starter", or any other tier label.
2. **No lock icons.** The panel shows the full content as if the user is already subscribed — no greyed-out rows or padlocks.
3. **Scrollable bodies, fixed heights.** Each card's content area uses `overflow-y-auto` + `max-h-[Npx]` so the card doesn't expand infinitely. The Practice Bank card is tallest at `max-h-[380px]`.
4. **Inline data, no fetch.** All drill names, question counts and difficulty levels are hard-coded constants (`BANK_SUBJECTS`). The landing page makes no API calls for this section.
5. **British spelling throughout** — practise (verb), programme, colour, etc.
6. **The benchmark is 121.** Never "qualifying standard" or "pass mark". The phrase is "our indicative 121 readiness benchmark".

---

## 9. Dependencies

| Package | Used for |
|---|---|
| React + TypeScript | Component language |
| Tailwind CSS | All styling (utility classes only, no custom CSS for this section) |
| shadcn/ui `Button` | CTAs below the tab section (not inside the panel itself) |
| `wouter` `Link` | Navigation links |

The panel itself (`InsidePlatformPanel`) has **zero external dependencies** — no icons, no imports beyond React. Every visual element is pure Tailwind + inline text/emoji.

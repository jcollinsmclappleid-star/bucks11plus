# Practice Suite Page — Full Replication Guide

Hand this document to a developer or AI to reproduce the **Practice Suite conversion page** (`/11-plus-practice-suite`) on another platform or sister site.

**Purpose of this page:** Explain how diagnostics, practice papers, and drills work *together* as a preparation system — and convert visitors to pricing or the free practice test. This is **not** the platform tour page (that lives at `/11-plus-practice-papers`).

**Companion doc:** For the scrollable browser-mockup panels inside each section, see `platform-panel-replication.md` (source: `client/src/components/shared/PlatformSuitePanels.tsx`).

---

## 1. Page identity

| Field | Value |
|---|---|
| **Route** | `/11-plus-practice-suite` |
| **Breadcrumb** | `2,500+ Questions & Mock Exams` (single crumb, no parent) |
| **SEO title** | `Bucks 11+ Practice Suite — Diagnostics, Papers & 2,500+ Drills` |
| **SEO description** | `How Bucks 11 Plus Tests combines diagnostics, unlimited practice papers, and 2,500+ GL-style drills into one preparation system for the Buckinghamshire 11+.` |
| **Page role** | Conversion explainer — three pillars + interactive previews + pricing CTAs |
| **Do NOT duplicate here** | Parent dashboard preview, sample-questions carousel, full stacked suite preview (link out instead) |

---

## 2. Relationship to other pages

```
Homepage hero
├── Primary CTA        → /free-diagnostic          (Try Free Practice Test)
├── Secondary CTA      → /11-plus-practice-papers    (See What's In The Platform)
└── Gold box 2         → /11-plus-practice-suite     (2,500+ Questions & Mock Exams)  ← THIS PAGE

/11-plus-practice-suite  (this page)
├── Explains: diagnose → practise → target gaps
├── Shows: one interactive panel per pillar
└── Links out to → /11-plus-practice-papers for dashboards & samples

/11-plus-practice-papers  (platform tour)
├── Dashboard preview, sample questions carousel
└── Full PlatformSuitePreview (all 3 panels stacked)
```

---

## 3. Global layout shell

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs (max-w-6xl, px-4, pt-6)                       │
├─────────────────────────────────────────────────────────────┤
│ HERO — gradient slate-50 → white, border-b slate-200      │
├─────────────────────────────────────────────────────────────┤
│ FREE VS PAID — full-width bg-primary (navy), white text   │
├─────────────────────────────────────────────────────────────┤
│ MAIN — max-w-6xl, py-14 md:py-20, space-y-20 md:space-y-28│
│   • Section 01 Diagnostics (text left, panel right)       │
│   • Section 02 Papers      (panel left, text right)         │
│   • Section 03 Drills      (text left, panel right)         │
│   • Example week planner                                    │
│   • Books vs platform table                                 │
│   • Cross-link dashed box → platform tour                   │
│   • Footer pricing CTA band                                 │
└─────────────────────────────────────────────────────────────┘
```

**Container:** `max-w-6xl mx-auto px-4` throughout.

**Background:** `min-h-screen bg-white`.

**Hash anchors:** On mount, if `window.location.hash` is set, smooth-scroll to matching section id. All section anchors use `scroll-mt-24`.

---

## 4. Design tokens

| Token | Value | Usage |
|---|---|---|
| **Primary** | `hsl(219 57% 27%)` — deep navy | Headings, CTAs, hero badge, footer band |
| **Serif headings** | Libre Baskerville (`font-serif`) | H1, H2, section titles |
| **Body** | Default sans | Paragraphs, lists |
| **Slate body text** | `text-slate-600` | Parent-angle copy |
| **Muted labels** | `text-slate-400`, `text-xs font-bold uppercase tracking-wider` | "When parents use this", section eyebrows |
| **CTA button** | Gold/amber variant (`variant="cta"`) | Primary conversion buttons |
| **Outline button** | `border-primary/20 text-primary` | Secondary free-test buttons |

### Pillar colour system (consistent across page)

| Pillar | Step badge | Journey card circle | Section badge classes |
|---|---|---|---|
| **Diagnostics** | `01` | `bg-amber-400 text-amber-950` | `bg-amber-100 text-amber-800 border-amber-200` |
| **Papers** | `02` | `bg-blue-500 text-white` | `bg-blue-100 text-blue-800 border-blue-200` |
| **Drills** | `03` | `bg-emerald-500 text-white` | `bg-emerald-100 text-emerald-800 border-emerald-200` |

---

## 5. Section-by-section spec

### 5.1 Breadcrumbs

- Single item: `2,500+ Questions & Mock Exams`
- Standard breadcrumb component + JSON-LD schema

---

### 5.2 Hero — "The preparation system"

**Layout:** `border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white`, `py-12 md:py-16`.

**Eyebrow pill:**
- Icon: Target
- Text: `THE PREPARATION SYSTEM`
- Classes: `rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary`

**H1:**
```
Diagnostics, papers & drills — how they work together
```
- `font-serif text-4xl md:text-5xl font-bold text-primary`

**Lead paragraph:**
```
2,500+ Questions & Mock Exams isn't a single feature. It's three modes of practice that serious Bucks 11+ families use in sequence — measure, build stamina, then close specific gaps.
```

**Interactive preview callout** (inline banner below lead):
- Bouncing ChevronsDown icon
- Text: `Each section below includes a scrollable, interactive preview of the real platform`
- Classes: `rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2 text-sm font-medium text-primary`

**Prep journey cards** — 3-column grid (`grid-cols-1 sm:grid-cols-3 gap-4`), each links to `#practice-tests`, `#practice-papers`, `#practice-bank`:

| Step | Label | Description | Anchor |
|---|---|---|---|
| 1 | Diagnose | Where are they now? | `#practice-tests` |
| 2 | Practise | Build stamina & speed | `#practice-papers` |
| 3 | Target gaps | Fix weak sub-skills | `#practice-bank` |

**Card styling:**
- `rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`
- Hover: `hover:border-primary/30 hover:shadow-md`
- Numbered circle (40×40, pillar colour)
- Footer link: `See below →` (group-hover brightens)

**Hero CTAs:**
1. Primary (cta, lg): `See plans & pricing →` → `/pricing`
2. Secondary (outline, lg): `Try Free Practice Test` → `/free-diagnostic`

---

### 5.3 Free vs subscriber band

**Layout:** Full-width `bg-primary text-white`, `py-10 md:py-12`.

**H2 (centred):**
```
What you can try free vs what subscribers get
```

**Two cards** (`grid md:grid-cols-2 gap-4 max-w-4xl mx-auto`):

**Left — Free:**
- Label: `FREE — NO ACCOUNT` (emerald-300)
- Card: `rounded-2xl border border-white/15 bg-white/10 p-5`
- Items (CheckCircle2 emerald-400):
  - 12-question mini practice test
  - Readiness band on the 121 scale
  - Section-by-section breakdown

**Right — Paid:**
- Label: `BUCKS PLUS EDGE — FROM £35/MO` (amber-200)
- Card: `rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5`
- Items (CheckCircle2 amber-300):
  - Everything on this page — unlimited
  - Full & mock exams + PDF reports
  - Parent dashboard, pace tracking & weekly plan
- Button: `Compare plans` → `/pricing`

---

### 5.4 Suite sections (×3) — core pattern

Each section is a **two-column grid** on large screens. Sections **alternate** text/panel sides:

| Section | Anchor id | Layout (lg) |
|---|---|---|
| 01 Diagnostics | `practice-tests` | Text left · Panel right |
| 02 Papers | `practice-papers` | Panel left · Text right (`reverse`) |
| 03 Drills | `practice-bank` | Text left · Panel right |

**Grid:** `lg:grid-cols-[1.05fr_1fr]` or reversed with `lg:order-1` / `lg:order-2`. Gap: `gap-8 lg:gap-12`.

#### Text column anatomy (top → bottom)

1. **Step number + badge row**
   - Step: `text-3xl font-bold text-primary/20 font-serif` → `01`, `02`, `03`
   - Badge pill: `text-[10px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full` + pillar colours

2. **Icon + H2 row**
   - Icon box: `h-11 w-11 rounded-xl bg-primary/10 text-primary`
   - H2: `font-serif text-2xl md:text-3xl font-bold text-primary`

3. **Parent angle** — one paragraph, `text-slate-600 leading-relaxed`

4. **"When parents use this"** — checklist with emerald CheckCircle2 icons

5. **"What's included"** — grey inset box (`rounded-xl bg-slate-100/80 border border-slate-200 p-4`), bullet list with primary dots

6. **CTAs** — row of two buttons:
   - Primary: `Get full access →` → `/pricing`
   - Secondary outline: `Try Free Practice Test` → `/free-diagnostic`

#### Panel column — InteractivePreviewFrame

Wrap each mockup panel in a chrome frame:

```
┌──────────────────────────────────────────────┐
│ [Interactive preview]    Scroll & click ↓  │  ← header row
├──────────────────────────────────────────────┤
│  ┌─ BrowserChrome (slate-800 traffic dots)─┐ │
│  │  Practice Tests / Papers / Bank mockup  │ │
│  │  [scrollable body with "Scroll to explore"│ │
│  │   pill when content overflows]           │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Frame classes:**
`rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary/[0.04] to-slate-50/80 p-3 shadow-sm ring-1 ring-primary/5`

**Frame header:**
- Left badge: `Interactive preview` + MousePointerClick icon
- Right hint: bouncing ChevronsDown + `Scroll & click inside`

**Panel inside frame:** Use exactly one of:
- `PracticeTestsPanel` (diagnostics)
- `PracticePapersPanel` (papers)
- `PracticeDrillsPanel` (drills)

Pass a unique preview id: `{anchor}-preview` (e.g. `practice-tests-preview`) to avoid duplicate DOM ids with section anchors.

---

### 5.5 Section copy — full text (replicate verbatim unless localising exam)

#### Section 01 — Diagnostics (`#practice-tests`)

| Field | Content |
|---|---|
| Badge | Practice tests & diagnostics |
| Icon | ClipboardList |
| Title | Find out where marks are being lost — not just the overall score |
| Parent angle | A workbook tells you 18/25. A diagnostic tells you NVR rotations cost 4 marks, VR codes are strong, and pace drops in the second half. That's what you need to plan the next month. |
| When parents use this | Start of preparation — baseline before you buy more books · Every 4–6 weeks — check the forecast is moving toward 121 · 2–3 weeks before test day — final mock under exam conditions |
| What's included | Free 12-question mini test · 2 × 45-question full tests · 3 timed mock exams with PDF reports |
| Panel | PracticeTestsPanel |

#### Section 02 — Papers (`#practice-papers`)

| Field | Content |
|---|---|
| Badge | Unlimited practice papers |
| Icon | Layers |
| Title | Exam-length papers on demand — fresh questions every attempt |
| Parent angle | Printed papers run out and children memorise answers. Quick, Full and Mock formats pull from 2,500+ questions so every paper feels new — building the stamina the Bucks test demands. |
| When parents use this | Weeknights — 25-minute Quick paper after school · Weekends — Full 40-question paper under timed conditions · Month before the test — weekly Mock format papers |
| What's included | Quick papers · 20 questions · ~25 mins · Full papers · 40 questions · ~45 mins · Mock papers · 50 questions · timed |
| Panel | PracticePapersPanel |

#### Section 03 — Drills (`#practice-bank`)

| Field | Content |
|---|---|
| Badge | 2,500+ targeted drills |
| Icon | Library |
| Title | Short, focused sessions on the exact sub-skills that need work |
| Parent angle | After a diagnostic flags 'NVR transformations 48%', your child opens that drill — 10–12 questions, worked solutions, timed or untimed. No random worksheets. 46 categories across all four GL domains. |
| When parents use this | After every diagnostic — target the weakest sub-skill first · 10–15 minutes between homework and dinner · School holidays — daily 20-minute drill blocks |
| What's included | 46 drill categories · VR, NVR, Maths, English · Easy, medium & hard progression · Worked solutions on every question |
| Panel | PracticeDrillsPanel |

---

### 5.6 Example preparation week

**Container:** `rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-10`

**Eyebrow:** Calendar icon + `EXAMPLE PREPARATION WEEK`

**H2:** `How families actually use all three together`

**Body:** `Not cramming — a sustainable rhythm mixing short drills, one paper, and a weekly check-in. Subscribers get a guided weekly programme that builds this automatically.`

**7-day grid:** `grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2`

| Day | Task | Type label |
|---|---|---|
| Mon | 15-min VR drill | Drill |
| Tue | Quick practice paper | Paper |
| Wed | NVR drill + Maths drill | Drill |
| Thu | Rest or 10-min vocab | Light |
| Fri | Mini diagnostic check-in | Test |
| Sat | Full mock paper · timed | Paper |
| Sun | Review wrong answers together | Parent |

**Day card:** `rounded-xl border border-slate-200 bg-white p-3 text-center`
- Day name: `text-xs font-bold text-primary`
- Task: `text-[11px] text-slate-700`
- Type: `text-[9px] font-bold uppercase tracking-wide text-slate-400`

---

### 5.7 Books vs platform comparison

**Layout:** `grid md:grid-cols-2 gap-8 items-center`

**Left column:**
- Eyebrow: BookOpen + `WHY NOT JUST BUY BOOKS?`
- H2: `Books give questions. This gives feedback.`
- Body paragraph about pace tracking and weak spots
- CTA: `See pricing →` → `/pricing`

**Right column — comparison table:**

| Feature | Workbooks | Bucks Plus Edge |
|---|---|---|
| Timed practice | Manual | Built-in |
| 121-scale forecast | — | ✓ |
| Sub-skill breakdown | — | ✓ |
| Fresh questions each attempt | Same paper | ✓ |
| Parent progress dashboard | — | ✓ |

Table: `rounded-2xl border border-slate-200`, header row `bg-slate-100`, platform column `font-medium text-primary`.

---

### 5.8 Cross-link to platform tour (do not duplicate dashboards here)

**Container:** `rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.03] p-6 md:p-8 text-center`

- Icon: Sparkles (centred)
- H2: `Want to see parent dashboards & sample questions?`
- Body: `This page covers the practice system. For dashboard previews, interactive sample questions, and the full platform tour, visit our platform overview.`
- Button (outline): `See What's In The Platform →` → `/11-plus-practice-papers`

---

### 5.9 Footer pricing band

**Container:** `rounded-3xl bg-primary p-8 md:p-12 text-center text-white`

- H2: `Ready to give your child the full suite?`
- Price line: `Diagnostics, unlimited papers, 2,500+ drills, and parent analytics — £35/month or £279/year.`
- Subline: `3-day money-back guarantee · Cancel anytime` (`text-white/50 text-xs`)
- CTAs:
  1. `Get full access →` → `/pricing`
  2. Outline on navy: `Try Free Practice Test` → `/free-diagnostic`

---

## 6. Interactive preview panels (summary)

Full panel markup, data (`BANK_SUBJECTS`), scroll heights, and badge rules are in **`platform-panel-replication.md`**.

Key additions on this page:

### ScrollablePanel behaviour
- Fixed `maxHeight` per panel: Tests `240px`, Papers `200px`, Drills `380px`
- `overflow-y-auto` body
- Bottom white gradient fade (`h-12`)
- **"Scroll to explore" pill** appears only when `scrollHeight > clientHeight`; hides after user scrolls >6px
- Buttons/toggles use `cursor-pointer` + hover/active states (visual only — no real navigation in mockup)

### InteractivePreviewFrame
- Wraps each single panel on this page (one panel per section, not all three stacked)

---

## 7. Conversion funnel & CTA map

| Location | Primary CTA | Secondary CTA |
|---|---|---|
| Hero | See plans & pricing → `/pricing` | Try Free Practice Test → `/free-diagnostic` |
| Free vs paid band | Compare plans → `/pricing` | — |
| Each suite section | Get full access → `/pricing` | Try Free Practice Test → `/free-diagnostic` |
| Books comparison | See pricing → `/pricing` | — |
| Platform cross-link | See What's In The Platform → `/11-plus-practice-papers` | — |
| Footer band | Get full access → `/pricing` | Try Free Practice Test → `/free-diagnostic` |

**Pricing mentions:** £35/month, £279/year, 3-day money-back guarantee.

---

## 8. Key design rules (do not break)

1. **This page explains the system; the platform page shows the tour.** Never duplicate dashboard preview or sample-questions carousel here — link out.
2. **Three pillars, three colours.** Amber = diagnose, Blue = papers, Emerald = drills. Use consistently in journey cards and section badges.
3. **Alternating layout.** Odd sections: copy left. Even section: copy right. Breaks visual monotony.
4. **Parent-focused copy.** Every section answers "when would a parent use this?" not just feature lists.
5. **Interactive previews must look scrollable.** Frame + in-panel scroll pill + click affordances on buttons.
6. **One paid tier label:** `Bucks Plus Edge` or `Paid plan` in mockups — never multiple tier names in badges.
7. **British spelling:** practise (verb), programme, maths, etc.
8. **121 benchmark language** — not "pass mark" or "qualifying standard".
9. **No lock icons** in preview panels — show full content as if subscribed.
10. **Hash deep links** from hero journey cards must match section ids: `practice-tests`, `practice-papers`, `practice-bank`.

---

## 9. Source files (Bucks 11+ repo)

| File | Role |
|---|---|
| `client/src/pages/PracticeSuite.tsx` | Full page layout, copy constants, SuiteSection component |
| `client/src/components/shared/PlatformSuitePanels.tsx` | Panels, ScrollablePanel, InteractivePreviewFrame, BANK_SUBJECTS |
| `client/src/lib/marketing.ts` | Paths, CTAs, anchor ids |
| `client/public/platform-panel-replication.md` | Deep spec for the three browser mockup panels |

---

## 10. Minimal component tree (for porting)

```
PracticeSuitePage
├── Seo + Breadcrumbs
├── HeroSection
│   ├── Eyebrow + H1 + Lead + PreviewCallout
│   ├── PrepJourneyCards (×3, anchor links)
│   └── HeroCTAs
├── FreeVsPaidBand
├── Main
│   ├── SuiteSection ×3
│   │   ├── TextColumn (step, badge, icon, h2, parentAngle, whenToUse, includes, CTAs)
│   │   └── InteractivePreviewFrame
│   │       └── PracticeTestsPanel | PracticePapersPanel | PracticeDrillsPanel
│   ├── WeekPlannerSection
│   ├── BooksComparisonSection
│   ├── PlatformTourCrossLink
│   └── FooterPricingBand
```

---

## 11. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| **Mobile** | Single column; journey cards stack; suite sections stack (text then panel); week grid 2 cols |
| **sm (640px+)** | Journey 3 cols; week grid 4 cols; hero CTAs row |
| **md (768px+)** | Free vs paid 2 cols; books comparison 2 cols |
| **lg (1024px+)** | Suite sections 2-col alternating; week grid 7 cols |

---

## 12. Adaptation checklist for sister sites

When replicating on another 11+ platform, swap:

- [ ] Exam name / region (Buckinghamshire → your region)
- [ ] Question count (`2,500+` → your count)
- [ ] Drill category count (`46` → your count)
- [ ] Pricing (`£35/mo`, `£279/yr` → your pricing)
- [ ] Product name (`Bucks Plus Edge` → your plan name)
- [ ] Free test path (`/free-diagnostic` → your free test URL)
- [ ] Platform tour path (`/11-plus-practice-papers` → your tour page)
- [ ] Subject domains (VR, NVR, Maths, English → your exam subjects)
- [ ] `BANK_SUBJECTS` drill names in panel mockup

Keep the **page architecture** (hero journey → free vs paid → 3 alternating sections with previews → week plan → comparison → cross-link → footer CTA).

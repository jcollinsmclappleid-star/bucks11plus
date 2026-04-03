# NVR Clarity Enhancements — Root Cause Diagnosis & Fixes
## 11Plus Test Hub | April 2026

---

## Enhancement 1: NVR Mirror Image (Symmetry) Questions

### Root Cause

**Problem 1 — UI: Ambiguous mirror axis**
The UI showed a pair of bidirectional arrows (`↔`) with a 2-pixel horizontal bar between the two frames. Children had no clear indication that the dividing element was a mirror line, no way to tell whether reflection was vertical (left-right) or diagonal, and no label to anchor the concept.

GL Assessment paper format uses a dashed vertical line as the explicit reflection axis, positioned between the two panels.

**Problem 2 — Generator: Diagonal line elements in question frames**
The symmetry question generator (v2) used `linePatterns` from the shared library, which includes two diagonal entries:
```
{ x1: 0, y1: 0, x2: 100, y2: 100 }   // ↘ diagonal
{ x1: 100, y1: 0, x2: 0, y2: 100 }   // ↙ diagonal
```
When a diagonal appeared in the left-half frame, children frequently mistook it for the mirror axis and reflected diagonally instead of vertically — producing the wrong answer for the wrong cognitive reason.

**Problem 3 — Generator: Line elements at all difficulty levels**
The v2 generator added lines to medium AND hard questions (the base `getDifficultyConfig()` returns `addLine: true` for both). However, the visual complexity introduced by a line element at medium difficulty was not calibrated to actual GL Assessment difficulty progression, where lines appear only at the most demanding difficulty.

**Problem 4 — Guide: No dedicated mirror image section**
The NVR guide article contained no specific advice on mirror image questions, leaving children without the mental model needed to approach them systematically.

---

### Fixes Applied

**Fix 1 — UI (client/src/components/render/SvgQuestion.tsx):**
- Replaced bidirectional arrows + 2px bar with a dashed SVG vertical line (128px mobile / 160px desktop)
- Added "Mirror line" label below the divider
- Result: unambiguous vertical axis of reflection matching GL Assessment paper format

**Fix 2 — Generator (scripts/generators/nvr/symmetry_spatial.ts, v2 → v4):**
- Overrode `addLine` config with `addLine: diff === 'hard'` — lines appear only at hard difficulty
- Forced all lines to be horizontal only: `lineY` used for both `y1` and `y2`, guaranteeing `y1 === y2`
- Horizontal lines cannot be mistaken for a diagonal mirror axis
- Bumped version 2 → 4 (two-step fix required a skip to v4 to invalidate both v2 and v3 stale data)

**Fix 3 — Auto-reseed (server/seed.ts):**
- Added `ensureNvrSymmetryReseeded()`: detects pool questions with `version < 4`, deletes them, and regenerates 140 fresh questions
- Diagnostic-linked questions (full-a, full-b, mock-1) preserved
- Result: easy=24q (0 lines), medium=44q (0 lines), hard=72q (all with horizontal lines)

**Fix 4 — Guide (shared/guideArticles.ts):**
- Added "Mirror Image Questions" section (4 paragraphs): the vertical-axis-only rule, the "fold the page" mental model, common traps (diagonal reflection, top-to-bottom flip, partial mirroring), difficulty progression
- Updated key takeaways and preparation section
- readTime updated 11 → 14 min

---

## Enhancement 2: NVR Clarity Audit — All Question Types

### Root Cause Analysis by Question Type

---

### 2a. NVR Transformation / Rotation-Reflection Questions

**Root Cause 1 — UI: `∷` symbol used as analogy separator**

The TransformLayout component rendered the question as:

```
[Frame A] → [Frame B]  ∷  [Frame C] → [?]
```

The `∷` is a mathematical ratio/analogy symbol used in formal logic and university-level mathematics. It has zero recognition among 9–10 year olds. Children stared at the symbol and could not map it to the "A is to B as C is to ?" verbal structure they were expected to understand.

**Root Cause 2 — UI: Frames A, B, C unlabelled**

The question prompt said *"Shape A is to Shape B as Shape C is to…?"* but the four visual frames had no labels. There was no way to know which box was A, which was B, and which was C. This created a direct contradiction between the text and the visual.

GL Assessment paper format labels each frame clearly (A, B, C or Fig 1, Fig 2, Fig 3) below or above the box.

**Root Cause 3 — Generator: Invisible line elements after transformation**

Both `rotation_reflection.ts` and `transformation.ts` used `getDifficultyConfig()` which returns `addLine: true` for medium and hard questions. However, the transformation functions leave line elements visually unchanged:

- `applyRotation(el, degrees)` returns non-shape elements untouched: `if (el.type === 'shape') ... return el`
- `reflectX` on a symmetric vertical line at `x=50`: `{ x1: 100-50=50, x2: 100-50=50 }` — identical
- `reflectY` on a horizontal line at `y=50`: `{ y1: 100-50=50, y2: 100-50=50 }` — identical
- `scaleSize` and `toggleFill` return non-shape elements untouched

The practical effect: in a transformation question, a line element appeared identically in frames A and B even when the transformation had been applied. Children looking for the transformation rule correctly observed that "shapes changed but the line stayed the same" — creating confusion about whether the rule applied to lines, whether they'd misidentified the rule, or whether the line was a red herring.

**Root Cause 4 — Generator: No signal that compound transforms involve two rules**

Transformation questions apply two rules simultaneously (e.g., rotate 90° AND reflect left-to-right). The four stem templates gave no indication that two changes occurred:

```
'Shape A is to Shape B as Shape C is to…?'
'If Shape A becomes Shape B, what does Shape C become?'
```

The distractors were specifically designed to catch children who applied only one of the two rules — making this a systematic trap for children who hadn't been told to look for multiple simultaneous changes.

---

### 2b. NVR Sequence Questions

**Root Cause — UI: No directional cues or step numbering**

Sequence questions showed 4 frames in a plain row with `gap-3` spacing and no connective visual elements. Children were not given:
- Step numbers to confirm left-to-right reading direction
- Arrows between frames to show the direction of change
- Any visual cue that frame 4 (the ?) follows from frame 3

GL Assessment paper sequences use numbered boxes and sometimes arrows between them. The absence of these cues put additional cognitive load on children who needed to simultaneously identify the pattern AND infer reading direction.

---

### 2c. VR Sentence Completion Prompts

**Root Cause — Generator: Newline between instruction and sentence**

The CEM VR generator (cem/vr.ts) used template strings with a `\n` character:

```typescript
(s: string) => `Select the most appropriate word:\n${s}`
```

When rendered in the UI, this created a visual break between the instruction line and the sentence, disrupting the reading flow for a question type that requires the child to read both the instruction AND the sentence as a continuous unit to understand context.

---

### Fixes Applied

**Fix 1 — Transform UI (SvgQuestion.tsx — TransformLayout):**
- Replaced `∷` symbol with inline text: "is to" below the arrow between A and B, "as" separating the two pairs
- Added letter labels A / B / C / ? below each frame
- Layout now reads naturally: `[A] → is to → [B]  as  [C] → is to → [?]`

**Fix 2 — Sequence UI (SvgQuestion.tsx — SequenceLayout):**
- Added step numbers (1, 2, 3, ?) below each frame
- Added directional arrows between consecutive frames including before the ? placeholder
- Makes the left-to-right progression unambiguous

**Fix 3 — Transform generators (rotation_reflection.ts + transformation.ts, v2 → v3):**
- Forced `addLine: false` in both generators — lines are not used in any transform frame
- `transformation.ts`: added 2 new stem templates explicitly signalling dual-rule questions:
  - `"Two things changed from Shape A to Shape B. Apply both changes to Shape C."`
  - `"Look carefully — two rules changed from A to B. What does Shape C become?"`
- All explanations rewritten to be child-facing (e.g., "a quarter-turn clockwise", "like a mirror held at the side")
- Version bumped v2 → v3

**Fix 4 — Auto-reseed (server/seed.ts):**
- Added `ensureTransformReseeded()`: detects `rotation_reflection` + `transformation` questions with `version < 3`, deletes and regenerates
- 140 rotation_reflection + 260 transformation questions re-seeded at v3
- CEM transform questions (version 1, separate generator) preserved

**Fix 5 — VR generator (cem/vr.ts):**
- Changed `\n` separator to `: ` — prompts now read as single continuous sentences

**Fix 6 — NVR Guide (shared/guideArticles.ts, readTime 14 → 19 min):**
Three new sections added:
- **Sequences**: 4-property checklist (rotation → size → fill → position), dual-rule warning, frame-comparison technique (compare 1→2 and 2→3 before predicting 4)
- **Transformation**: "A is to B as C is to ?" format explained with frame labelling, systematic identification technique, two-rule detection strategy, common errors
- **Classification**: systematic odd-one-out checklist (shape type → fill → count → extra elements), why impression-based guessing leads to distractor traps, difficulty progression

---

## Pattern: What These Root Causes Have in Common

All issues share the same underlying pattern: **the platform was built to generate technically correct questions, but without running the experience through the eyes of a 9–10 year old child**. Specifically:

1. **Format assumed prior knowledge** — The `∷` symbol, unlabelled frames, and absent step numbers assumed children would transfer format understanding from somewhere else
2. **Generator correctness ≠ visual clarity** — Technically valid elements (lines in transform frames, diagonal lines in symmetry frames) were invisible or misleading after transformation — correct in the data model, wrong in the visual
3. **No child-facing technique scaffolding** — Guide content existed at the subject level but not at the individual question-type level, leaving children without systematic attack strategies for each type

The fixes applied a consistent principle: **match GL Assessment paper format exactly, remove every visually ambiguous element, and provide explicit technique guidance for every question type**.

---

*Generated April 2026 — 11Plus Test Hub*

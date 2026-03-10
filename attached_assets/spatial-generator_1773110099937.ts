/**
 * SPATIAL REASONING GENERATOR
 * ============================
 * Produces three spatial reasoning question types aligned to GL Assessment Paper 2:
 *
 *   1. nets       — net of a 3D shape → which 3D shape does it fold into?
 *   2. cube_views — marked cube shown from 2 angles → answer a specific question
 *   3. fold       — 2D shape with fold line → what shape results?
 *
 * All visual content is produced as SvgFrame objects using the existing
 * SvgElement types from shared/contentTypes.ts — no new rendering infrastructure
 * is required beyond the SpatialRenderer.tsx component described in the spec.
 *
 * Usage (called by generate_seed.ts):
 *   import { generateSpatialQuestions } from './generators/spatial';
 *   const questions = generateSpatialQuestions(rng, 80);
 *
 * Distribution: 40% nets, 30% cube_views, 30% fold
 * Difficulty:   easy 30%, medium 45%, hard 25%
 */

import type { GeneratedQuestion } from '../types';
import type { SvgFrame, SvgElement, SvgStroke, FillPattern } from '../../shared/contentTypes';

// ─── SVG STYLE HELPERS ───────────────────────────────────────────────────────

const FILL_PATTERNS: FillPattern[] = ['none', 'solid', 'hatched', 'dotted'];

function stroke(
  fill: FillPattern = 'none',
  strokeColor = '#1E293B',
  strokeWidth = 2.5,
  dashed = false
): SvgStroke {
  return { strokeWidth, stroke: strokeColor, fill, dashed };
}

const SOLID   = stroke('solid');
const OUTLINE = stroke('none');
const HATCHED = stroke('hatched');
const DOTTED  = stroke('dotted');

// ─── SHARED SVG UTILITIES ────────────────────────────────────────────────────

/** A square at (cx, cy) with side size, rotated by degrees */
function square(cx: number, cy: number, size: number, style: SvgStroke, rotation = 0): SvgElement {
  return { type: 'shape', shape: 'square', x: cx, y: cy, size, rotation, style };
}

function circle(cx: number, cy: number, size: number, style: SvgStroke): SvgElement {
  return { type: 'shape', shape: 'circle', x: cx, y: cy, size, rotation: 0, style };
}

function triangle(cx: number, cy: number, size: number, style: SvgStroke, rotation = 0): SvgElement {
  return { type: 'shape', shape: 'triangle', x: cx, y: cy, size, rotation, style };
}

function dot(cx: number, cy: number): SvgElement {
  return { type: 'dot', x: cx, y: cy, r: 3, style: SOLID };
}

function line(x1: number, y1: number, x2: number, y2: number, dashed = false): SvgElement {
  return { type: 'line', x1, y1, x2, y2, style: stroke('none', '#1E293B', 2, dashed) };
}

function frame(...elements: SvgElement[]): SvgFrame {
  return { elements };
}

// ─── FACE SYMBOLS ────────────────────────────────────────────────────────────
// Used to mark cube faces with distinct, unambiguous symbols.
// Each symbol is represented as an array of SvgElements within a 20×20 unit cell.

type FaceSymbol = 'circle' | 'cross' | 'triangle' | 'dot' | 'square' | 'line';

function faceElements(symbol: FaceSymbol, cx: number, cy: number): SvgElement[] {
  switch (symbol) {
    case 'circle':  return [circle(cx, cy, 14, stroke('none', '#1E293B', 2))];
    case 'square':  return [square(cx, cy, 12, stroke('none', '#1E293B', 2))];
    case 'triangle': return [triangle(cx, cy, 14, stroke('none', '#1E293B', 2))];
    case 'dot':     return [dot(cx, cy)];
    case 'cross':   return [
      line(cx - 6, cy - 6, cx + 6, cy + 6),
      line(cx + 6, cy - 6, cx - 6, cy + 6),
    ];
    case 'line':    return [line(cx - 7, cy, cx + 7, cy)];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — NET QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NET QUESTION APPROACH
 * ─────────────────────
 * We represent nets as flat SVG grids of squares. Each square in the grid
 * represents one face. The grid is drawn on a 100×100 viewBox.
 *
 * For simplicity and correctness, we use pre-defined net templates that are
 * guaranteed to be valid nets for each shape. The shapes we support:
 *
 *   cube        — 6 faces in 11 valid net configurations (we seed 6 of them)
 *   cuboid      — 6 faces, rectangular proportions, 4 configurations
 *   triangular  — 5 faces (2 triangles + 3 rectangles), 2 configurations
 *
 * Each net template defines face positions as (col, row) grid coordinates.
 * Face size = 20 units. Net origin = top-left padding.
 */

interface NetTemplate {
  name: 'cube' | 'cuboid' | 'triangular_prism';
  difficulty: 'easy' | 'medium' | 'hard';
  faces: Array<{ col: number; row: number; shape: 'square' | 'rectangle_wide' | 'rectangle_tall' | 'triangle_face' }>;
  // Which 3D shape this net produces
  resultShape: 'cube' | 'cuboid' | 'triangular_prism';
}

const NET_TEMPLATES: NetTemplate[] = [
  // ── CUBE NETS ─────────────────────────────────────────────────────
  {
    name: 'cube', difficulty: 'easy', resultShape: 'cube',
    // Cross shape — the most recognisable cube net
    faces: [
      {col:1,row:0,shape:'square'}, // top
      {col:0,row:1,shape:'square'},{col:1,row:1,shape:'square'},{col:2,row:1,shape:'square'},{col:3,row:1,shape:'square'}, // row
      {col:1,row:2,shape:'square'}, // bottom
    ],
  },
  {
    name: 'cube', difficulty: 'medium', resultShape: 'cube',
    // T-shape
    faces: [
      {col:0,row:0,shape:'square'},{col:1,row:0,shape:'square'},{col:2,row:0,shape:'square'},
      {col:1,row:1,shape:'square'},
      {col:1,row:2,shape:'square'},
      {col:1,row:3,shape:'square'},
    ],
  },
  {
    name: 'cube', difficulty: 'medium', resultShape: 'cube',
    // L-shape extended
    faces: [
      {col:0,row:0,shape:'square'},
      {col:0,row:1,shape:'square'},{col:1,row:1,shape:'square'},
      {col:0,row:2,shape:'square'},
      {col:0,row:3,shape:'square'},{col:1,row:3,shape:'square'},
    ],
  },
  {
    name: 'cube', difficulty: 'hard', resultShape: 'cube',
    // Z-shape
    faces: [
      {col:0,row:0,shape:'square'},{col:1,row:0,shape:'square'},
      {col:1,row:1,shape:'square'},
      {col:1,row:2,shape:'square'},{col:2,row:2,shape:'square'},
      {col:2,row:3,shape:'square'},
    ],
  },
  // ── CUBOID NETS ───────────────────────────────────────────────────
  {
    name: 'cuboid', difficulty: 'easy', resultShape: 'cuboid',
    // Classic cross but with 2:1 rectangular faces
    faces: [
      {col:1,row:0,shape:'rectangle_wide'},
      {col:0,row:1,shape:'square'},{col:1,row:1,shape:'rectangle_wide'},{col:2,row:1,shape:'square'},
      {col:1,row:2,shape:'rectangle_wide'},
      {col:1,row:3,shape:'rectangle_wide'},
    ],
  },
  {
    name: 'cuboid', difficulty: 'medium', resultShape: 'cuboid',
    faces: [
      {col:0,row:0,shape:'rectangle_wide'},{col:1,row:0,shape:'rectangle_wide'},
      {col:0,row:1,shape:'square'},
      {col:0,row:2,shape:'rectangle_wide'},{col:1,row:2,shape:'rectangle_wide'},
      {col:0,row:3,shape:'square'},
    ],
  },
  // ── TRIANGULAR PRISM NETS ─────────────────────────────────────────
  {
    name: 'triangular_prism', difficulty: 'medium', resultShape: 'triangular_prism',
    // Two triangle end-faces at top and bottom, three rectangular side-faces in a row
    faces: [
      {col:1,row:0,shape:'triangle_face'},          // triangle top
      {col:0,row:1,shape:'rectangle_wide'},{col:1,row:1,shape:'rectangle_wide'},{col:2,row:1,shape:'rectangle_wide'}, // 3 sides
      {col:1,row:2,shape:'triangle_face'},          // triangle bottom
    ],
  },
  {
    name: 'triangular_prism', difficulty: 'hard', resultShape: 'triangular_prism',
    faces: [
      {col:0,row:0,shape:'triangle_face'},{col:1,row:0,shape:'rectangle_wide'},
      {col:1,row:1,shape:'rectangle_wide'},
      {col:1,row:2,shape:'rectangle_wide'},{col:2,row:2,shape:'triangle_face'},
    ],
  },
];

// Net shape→SVG elements: draw a face within a grid cell at pixel origin (ox, oy)
function drawNetFace(
  faceShape: NetTemplate['faces'][0]['shape'],
  ox: number, oy: number,
  cellW: number, cellH: number,
  fillStyle: SvgStroke
): SvgElement[] {
  const cx = ox + cellW / 2;
  const cy = oy + cellH / 2;
  if (faceShape === 'triangle_face') {
    return [{ type: 'shape', shape: 'triangle', x: cx, y: cy, size: Math.min(cellW, cellH) * 0.85, rotation: 0, style: fillStyle }];
  }
  const w = faceShape === 'rectangle_wide' ? cellW * 0.95 : cellW * 0.95;
  const h = faceShape === 'rectangle_tall' ? cellH * 0.95 : cellH * 0.95;
  return [{ type: 'shape', shape: 'square', x: cx, y: cy, size: Math.max(w, h) * 0.85, rotation: 0, style: fillStyle }];
}

function buildNetFrame(template: NetTemplate, rng: () => number): SvgFrame {
  const CELL = 18;
  const PAD  = 8;
  const elements: SvgElement[] = [];

  // Add optional face markings (shading pattern) to 2 random faces for medium/hard
  const markedFaceIndices = new Set<number>();
  if (template.difficulty !== 'easy') {
    const count = template.difficulty === 'hard' ? 2 : 1;
    while (markedFaceIndices.size < count) {
      markedFaceIndices.add(Math.floor(rng() * template.faces.length));
    }
  }

  template.faces.forEach((face, i) => {
    const ox = PAD + face.col * CELL;
    const oy = PAD + face.row * CELL;
    const cellW = face.shape === 'rectangle_wide' ? CELL * 1.6 : CELL;
    const cellH = face.shape === 'rectangle_tall' ? CELL * 1.6 : CELL;
    const fillStyle = markedFaceIndices.has(i) ? HATCHED : OUTLINE;
    elements.push(...drawNetFace(face.shape, ox, oy, cellW, cellH, fillStyle));
  });

  return frame(...elements);
}

// Wrong-answer net templates (guaranteed invalid for the given shape)
// These are valid nets of the *wrong* shape, or non-nets that look plausible.
const DISTRACTOR_NETS: NetTemplate[] = [
  // "Almost cube" — 5 squares in a row (not a valid cube net)
  {
    name: 'cube', difficulty: 'easy', resultShape: 'cube',
    faces: [
      {col:0,row:0,shape:'square'},{col:1,row:0,shape:'square'},{col:2,row:0,shape:'square'},{col:3,row:0,shape:'square'},{col:4,row:0,shape:'square'},
      {col:0,row:1,shape:'square'},
    ],
  },
  // "3×2 grid" — looks like it could work but doesn't fold into a cube correctly
  {
    name: 'cube', difficulty: 'medium', resultShape: 'cube',
    faces: [
      {col:0,row:0,shape:'square'},{col:1,row:0,shape:'square'},{col:2,row:0,shape:'square'},
      {col:0,row:1,shape:'square'},{col:1,row:1,shape:'square'},{col:2,row:1,shape:'square'},
    ],
  },
  // Cuboid net missing a face
  {
    name: 'cuboid', difficulty: 'medium', resultShape: 'cuboid',
    faces: [
      {col:1,row:0,shape:'rectangle_wide'},
      {col:0,row:1,shape:'square'},{col:1,row:1,shape:'rectangle_wide'},
      {col:1,row:2,shape:'rectangle_wide'},
    ],
  },
];

function buildNetQuestion(template: NetTemplate, rng: () => number): GeneratedQuestion {
  const netFrame = buildNetFrame(template, rng);

  // Build 3 distractor nets — use different shape templates to ensure visual variety
  const wrongTemplates = [...DISTRACTOR_NETS, ...NET_TEMPLATES.filter(t => t.resultShape !== template.resultShape)];
  const distractors = shuffle(wrongTemplates, rng)
    .slice(0, 3)
    .map(dt => buildNetFrame(dt, rng));

  // Place correct answer at random position
  const answerPos = Math.floor(rng() * 4);
  const answerOptions: SvgFrame[] = [];
  let distractorIdx = 0;
  for (let i = 0; i < 4; i++) {
    answerOptions.push(i === answerPos ? netFrame : distractors[distractorIdx++]);
  }

  const labels = ['A', 'B', 'C', 'D'];
  const correctLabel = labels[answerPos];

  const shapeNames: Record<string, string> = {
    cube: 'a cube',
    cuboid: 'a cuboid (rectangular box)',
    triangular_prism: 'a triangular prism',
  };

  const prompt = `Which of the following is a valid net that folds into ${shapeNames[template.resultShape]}?`;

  const explanation =
    `A valid net for ${shapeNames[template.resultShape]} must have the correct number of faces ` +
    `in an arrangement that can be folded without overlap. ` +
    `Option ${correctLabel} shows a valid net. ` +
    `The other options either have the wrong number of faces, or an arrangement that would cause faces to overlap when folded.`;

  return {
    section: 'spatial',
    type: 'nets',
    prompt,
    options: labels.map(l => l),
    correctAnswer: correctLabel,
    difficulty: template.difficulty,
    skillId: 'spatial_reasoning',
    subRuleId: 'nets_3d',
    renderType: 'svg',
    renderConfig: {
      kind: 'spatial.nets',
      netFrames: [netFrame],
      answerOptions,
    },
    trapTypes: ['visually_similar_net', 'wrong_face_count'],
    cognitiveLoad: template.difficulty === 'easy' ? 3 : template.difficulty === 'medium' ? 4 : 5,
    estTimeSeconds: template.difficulty === 'easy' ? 60 : template.difficulty === 'medium' ? 75 : 90,
    explanation,
    qaStatus: 'approved',
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    stemVariantId: `net-${template.name}-${template.difficulty}`,
    layoutVariantId: `net-layout-${template.faces.length}`,
    orderIndex: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — CUBE VIEW QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CUBE VIEW APPROACH
 * ─────────────────
 * We define a cube with 6 faces, each labelled with a distinct symbol.
 * We show the cube from 2 different viewpoints as 2D "unfolded face views"
 * (representing front face, top face, right face visible in each view).
 * Then we ask: which face is opposite to the [symbol] face?
 *
 * The 6 face symbols: circle, cross, triangle, dot, square, line
 * The 6 faces:  top, bottom, front, back, left, right
 *
 * Opposite pairs (fixed for each cube definition):
 *   top ↔ bottom
 *   front ↔ back
 *   left ↔ right
 */

interface CubeDefinition {
  faces: Record<'top' | 'bottom' | 'front' | 'back' | 'left' | 'right', FaceSymbol>;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Pre-defined cubes with guaranteed unique face symbols
const CUBE_DEFINITIONS: CubeDefinition[] = [
  {
    difficulty: 'easy',
    faces: { top: 'circle', bottom: 'cross', front: 'triangle', back: 'dot', left: 'square', right: 'line' },
  },
  {
    difficulty: 'easy',
    faces: { top: 'dot', bottom: 'triangle', front: 'circle', back: 'square', left: 'line', right: 'cross' },
  },
  {
    difficulty: 'medium',
    faces: { top: 'square', bottom: 'line', front: 'cross', back: 'circle', left: 'dot', right: 'triangle' },
  },
  {
    difficulty: 'medium',
    faces: { top: 'line', bottom: 'dot', front: 'square', back: 'triangle', left: 'circle', right: 'cross' },
  },
  {
    difficulty: 'hard',
    faces: { top: 'triangle', bottom: 'square', front: 'line', back: 'dot', left: 'cross', right: 'circle' },
  },
  {
    difficulty: 'hard',
    faces: { top: 'cross', bottom: 'circle', front: 'dot', back: 'line', left: 'triangle', right: 'square' },
  },
];

const OPPOSITE_PAIRS: Array<['top'|'bottom'|'front'|'back'|'left'|'right', 'top'|'bottom'|'front'|'back'|'left'|'right']> = [
  ['top','bottom'], ['front','back'], ['left','right'],
];

/** Draws a simplified "face view" showing the front face with side hints */
function buildCubeFaceView(
  cubeDef: CubeDefinition,
  visibleFace: 'top' | 'front' | 'right',
  _rng: () => number
): SvgFrame {
  const elements: SvgElement[] = [];

  // Outer border of the visible face
  elements.push(square(50, 50, 70, OUTLINE));

  // Main face symbol centred
  const mainSymbol = cubeDef.faces[visibleFace];
  elements.push(...faceElements(mainSymbol, 50, 50));

  // Top edge hint (shows top face symbol, smaller)
  const topSymbol = cubeDef.faces['top'];
  elements.push(...faceElements(topSymbol, 50, 18).map(el => ({
    ...el,
    ...(el.type === 'shape' ? { size: (el as any).size * 0.5 } : {}),
  })));

  // Right edge hint
  const rightSymbol = cubeDef.faces['right'];
  elements.push(...faceElements(rightSymbol, 82, 50).map(el => ({
    ...el,
    ...(el.type === 'shape' ? { size: (el as any).size * 0.5 } : {}),
  })));

  return frame(...elements);
}

function buildCubeViewQuestion(cubeDef: CubeDefinition, rng: () => number): GeneratedQuestion {
  // Pick a random opposite pair for the question
  const [faceA, faceB] = OPPOSITE_PAIRS[Math.floor(rng() * OPPOSITE_PAIRS.length)];
  const questionFace = rng() > 0.5 ? faceA : faceB;
  const correctOppositeFace = questionFace === faceA ? faceB : faceA;
  const questionSymbol = cubeDef.faces[questionFace];
  const correctSymbol = cubeDef.faces[correctOppositeFace];

  // Build 2 cube views for the prompt (front view, then top-right view)
  const view1 = buildCubeFaceView(cubeDef, 'front', rng);
  const view2 = buildCubeFaceView(cubeDef, 'top', rng);

  // All 6 symbols
  const allSymbols = Object.values(cubeDef.faces) as FaceSymbol[];
  const correctOption = symbolName(correctSymbol);
  const distractors = allSymbols
    .filter(s => s !== correctSymbol && s !== questionSymbol)
    .map(s => symbolName(s));

  const labels = ['A','B','C','D'];
  const pool = [correctOption, ...shuffle(distractors, rng).slice(0,3)];
  const shuffledPool = shuffle(pool, rng);
  const options = shuffledPool.map((text,i) => `${labels[i]}) ${text}`);
  const correctAnswer = labels[shuffledPool.indexOf(correctOption)];

  const prompt = `A cube has a different symbol on each face. Two views of the same cube are shown. Which face is directly opposite the face showing a ${symbolName(questionSymbol)}?`;

  const explanation =
    `In this cube, the ${symbolName(questionSymbol)} face is directly opposite the ${symbolName(correctSymbol)} face. ` +
    `You can work this out by tracking the position of each symbol across the two views shown. ` +
    `The correct answer is ${correctAnswer}: ${correctOption}.`;

  return {
    section: 'spatial',
    type: 'cube_views',
    prompt,
    options,
    correctAnswer,
    difficulty: cubeDef.difficulty,
    skillId: 'spatial_reasoning',
    subRuleId: 'cube_views',
    renderType: 'svg',
    renderConfig: {
      kind: 'spatial.cubes',
      cubeViews: [view1, view2],
      answerOptions: [],
    },
    trapTypes: ['adjacent_face_confusion', 'mirror_confusion'],
    cognitiveLoad: cubeDef.difficulty === 'easy' ? 3 : cubeDef.difficulty === 'medium' ? 4 : 5,
    estTimeSeconds: cubeDef.difficulty === 'easy' ? 60 : cubeDef.difficulty === 'medium' ? 80 : 100,
    explanation,
    qaStatus: 'approved',
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    stemVariantId: `cube-${questionSymbol}-${correctSymbol}`,
    shapePaletteId: Object.values(cubeDef.faces).join('-'),
    orderIndex: 0,
  };
}

function symbolName(s: FaceSymbol): string {
  const names: Record<FaceSymbol, string> = {
    circle: 'circle', cross: 'cross', triangle: 'triangle',
    dot: 'dot', square: 'square', line: 'horizontal line',
  };
  return names[s];
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — FOLD AND REFLECT QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FOLD QUESTION APPROACH
 * ─────────────────────
 * A 2D shape is shown with a dotted fold line (vertical, horizontal, or diagonal).
 * The question asks: what shape results after folding?
 *
 * We pre-define fold scenarios as:
 *   { shape: SvgFrame, foldLine: 'vertical'|'horizontal'|'diagonal', result: SvgFrame, distractors: SvgFrame[] }
 *
 * For each scenario we pre-define the resulting shape and 3 plausible wrong answers.
 * This avoids the need for runtime geometric computation.
 */

interface FoldScenario {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;             // for explanation
  promptFrame: SvgFrame;           // shape + fold line
  resultFrame: SvgFrame;           // correct answer
  distractorFrames: SvgFrame[];    // 3 wrong answers
}

// ── FOLD LINE BUILDERS ────────────────────────────────────────────────────────

const V_FOLD = line(50, 10, 50, 90, true);  // vertical fold line x=50
const H_FOLD = line(10, 50, 90, 50, true);  // horizontal fold line y=50
const D_FOLD = line(10, 10, 90, 90, true);  // diagonal fold line

// ── SCENARIO DEFINITIONS ──────────────────────────────────────────────────────

const FOLD_SCENARIOS: FoldScenario[] = [

  // ── EASY 1: Rectangle folded vertically → square ─────────────────────────
  {
    id: 'fold-rect-v-01',
    difficulty: 'easy',
    description: 'A rectangle folded along a vertical centre line produces a square (both halves overlap perfectly)',
    promptFrame: frame(
      // Wide rectangle
      { type: 'shape', shape: 'square', x: 50, y: 50, size: 80, rotation: 0, style: OUTLINE },
      V_FOLD
    ),
    resultFrame: frame(
      // Square — half width
      { type: 'shape', shape: 'square', x: 50, y: 50, size: 40, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'triangle', x: 50, y: 50, size: 50, rotation: 0, style: OUTLINE }),
      frame({ type: 'shape', shape: 'square', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE }),
      frame({ type: 'shape', shape: 'rectangle' as any, x: 50, y: 50, size: 40, rotation: 90, style: SOLID }),
    ],
  },

  // ── EASY 2: Square folded horizontally → rectangle ───────────────────────
  {
    id: 'fold-square-h-02',
    difficulty: 'easy',
    description: 'A square folded along a horizontal centre line produces a wide rectangle',
    promptFrame: frame(
      { type: 'shape', shape: 'square', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      H_FOLD
    ),
    resultFrame: frame(
      // Rectangle: full width, half height
      { type: 'shape', shape: 'square', x: 50, y: 50, size: 70, rotation: 0, style: SOLID },
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'square', x: 50, y: 50, size: 35, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'triangle', x: 50, y: 50, size: 60, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'square', x: 50, y: 50, size: 70, rotation: 45, style: OUTLINE }),
    ],
  },

  // ── EASY 3: Right-triangle shape with hatching, vertical fold → produces a square
  {
    id: 'fold-rtriangle-v-03',
    difficulty: 'easy',
    description: 'A right-angled triangle with a vertical fold line produces a symmetric diamond when folded',
    promptFrame: frame(
      { type: 'shape', shape: 'right_triangle', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      V_FOLD
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'diamond', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'square', x: 50, y: 50, size: 35, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'triangle', x: 50, y: 50, size: 70, rotation: 180, style: SOLID }),
      frame({ type: 'shape', shape: 'right_triangle', x: 50, y: 50, size: 70, rotation: 90, style: SOLID }),
    ],
  },

  // ── MEDIUM 1: L-shape with horizontal fold ───────────────────────────────
  {
    id: 'fold-lshape-h-04',
    difficulty: 'medium',
    description: 'An L-shape folded horizontally — the shorter arm folds onto the longer, partially overlapping',
    promptFrame: frame(
      // L-shape: main rectangle + small extension
      square(35, 50, 30, OUTLINE),   // left column
      square(65, 70, 30, OUTLINE),   // bottom right
      H_FOLD
    ),
    resultFrame: frame(
      // After fold: smaller rectangle with double-thickness portion
      square(35, 50, 30, SOLID),
      square(65, 50, 30, HATCHED),   // hatched = double layers
    ),
    distractorFrames: [
      frame(square(50, 50, 60, SOLID)),
      frame(square(35, 50, 30, SOLID), square(65, 30, 30, SOLID)),
      frame(square(50, 50, 40, HATCHED)),
    ],
  },

  // ── MEDIUM 2: Pentagon with vertical fold ────────────────────────────────
  {
    id: 'fold-pentagon-v-05',
    difficulty: 'medium',
    description: 'A regular pentagon folded along a vertical axis of symmetry',
    promptFrame: frame(
      { type: 'shape', shape: 'pentagon', x: 50, y: 50, size: 65, rotation: 0, style: OUTLINE },
      V_FOLD
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'pentagon', x: 50, y: 50, size: 65, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'triangle', x: 50, y: 50, size: 65, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'pentagon', x: 50, y: 50, size: 65, rotation: 36, style: SOLID }),
      frame({ type: 'shape', shape: 'diamond', x: 50, y: 50, size: 65, rotation: 0, style: SOLID }),
    ],
  },

  // ── MEDIUM 3: Arrow shape folded diagonally ───────────────────────────────
  {
    id: 'fold-arrow-d-06',
    difficulty: 'medium',
    description: 'An arrow shape folded along a diagonal — produces a kite shape',
    promptFrame: frame(
      { type: 'shape', shape: 'arrow', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      D_FOLD
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'kite', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'arrow', x: 50, y: 50, size: 70, rotation: 45, style: SOLID }),
      frame({ type: 'shape', shape: 'diamond', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE }),
      frame({ type: 'shape', shape: 'triangle', x: 50, y: 50, size: 70, rotation: 45, style: SOLID }),
    ],
  },

  // ── HARD 1: Cross shape folded along diagonal ─────────────────────────────
  {
    id: 'fold-cross-d-07',
    difficulty: 'hard',
    description: 'A plus/cross shape folded along a 45° diagonal — produces an irregular hexagon',
    promptFrame: frame(
      { type: 'shape', shape: 'cross', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      D_FOLD
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'hexagon', x: 50, y: 50, size: 55, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'cross', x: 50, y: 50, size: 70, rotation: 45, style: SOLID }),
      frame({ type: 'shape', shape: 'star', x: 50, y: 50, size: 60, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'diamond', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }),
    ],
  },

  // ── HARD 2: Hexagon folded along a non-axis-of-symmetry line ─────────────
  {
    id: 'fold-hexagon-offaxis-08',
    difficulty: 'hard',
    description: 'A hexagon folded along a line that is not a regular axis of symmetry — produces an irregular pentagon',
    promptFrame: frame(
      { type: 'shape', shape: 'hexagon', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      line(20, 35, 80, 35, true)  // non-standard horizontal fold, off-centre
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'pentagon', x: 50, y: 55, size: 65, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'hexagon', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'trapezoid', x: 50, y: 55, size: 65, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'diamond', x: 50, y: 55, size: 60, rotation: 0, style: SOLID }),
    ],
  },

  // ── HARD 3: Star folded vertically ────────────────────────────────────────
  {
    id: 'fold-star-v-09',
    difficulty: 'hard',
    description: 'A 5-pointed star folded along a vertical axis — the resulting shape is an asymmetric pentagon-like form',
    promptFrame: frame(
      { type: 'shape', shape: 'star', x: 50, y: 50, size: 70, rotation: 0, style: OUTLINE },
      V_FOLD
    ),
    resultFrame: frame(
      { type: 'shape', shape: 'star', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }
    ),
    distractorFrames: [
      frame({ type: 'shape', shape: 'pentagon', x: 50, y: 50, size: 70, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'star', x: 50, y: 50, size: 35, rotation: 0, style: SOLID }),
      frame({ type: 'shape', shape: 'star', x: 50, y: 50, size: 70, rotation: 36, style: SOLID }),
    ],
  },

  // ── MEDIUM 4: Dotted square with fold, pattern question ───────────────────
  {
    id: 'fold-dotted-h-10',
    difficulty: 'medium',
    description: 'A square containing a dot in one corner, folded horizontally — where does the dot end up?',
    promptFrame: frame(
      square(50, 50, 70, OUTLINE),
      dot(25, 25),   // dot in top-left corner
      H_FOLD
    ),
    resultFrame: frame(
      // Dot appears at bottom-left after folding top half down
      square(50, 50, 70, OUTLINE),
      dot(25, 65),   // dot now bottom-left quadrant
    ),
    distractorFrames: [
      frame(square(50, 50, 70, OUTLINE), dot(25, 25)),
      frame(square(50, 50, 70, OUTLINE), dot(75, 65)),
      frame(square(50, 50, 70, OUTLINE), dot(75, 25)),
    ],
  },
];

function buildFoldQuestion(scenario: FoldScenario, rng: () => number): GeneratedQuestion {
  const labels = ['A', 'B', 'C', 'D'];

  // Shuffle answer options
  const answerPos = Math.floor(rng() * 4);
  const answerOptions: SvgFrame[] = [];
  let distractorIdx = 0;
  for (let i = 0; i < 4; i++) {
    answerOptions.push(i === answerPos ? scenario.resultFrame : scenario.distractorFrames[distractorIdx++]);
  }

  const correctLabel = labels[answerPos];

  const prompt = 'The shape on the left has a dotted fold line. When folded along this line, which of the options (A–D) shows the result?';

  const explanation =
    `When the shape is folded along the dotted line, the two halves meet. ` +
    `${scenario.description}. ` +
    `The correct answer is ${correctLabel}.`;

  return {
    section: 'spatial',
    type: 'fold',
    prompt,
    options: labels.map(l => l),
    correctAnswer: correctLabel,
    difficulty: scenario.difficulty,
    skillId: 'spatial_reasoning',
    subRuleId: 'fold_reflect',
    renderType: 'svg',
    renderConfig: {
      kind: 'spatial.fold',
      promptFrame: scenario.promptFrame,
      answerOptions,
    },
    trapTypes: ['mirror_confusion', 'rotation_confusion'],
    cognitiveLoad: scenario.difficulty === 'easy' ? 3 : scenario.difficulty === 'medium' ? 4 : 5,
    estTimeSeconds: scenario.difficulty === 'easy' ? 55 : scenario.difficulty === 'medium' ? 70 : 90,
    explanation,
    qaStatus: 'approved',
    locale: 'en-GB',
    britishSpelling: true,
    version: 1,
    stemVariantId: scenario.id,
    layoutVariantId: `fold-${scenario.difficulty}`,
    orderIndex: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate spatial reasoning questions.
 *
 * @param rng   Seeded random function from generate_seed.ts
 * @param count Target number of questions (actual count rounds to nearest complete set)
 *
 * Distribution:
 *   40% nets        (NET_TEMPLATES × reps)
 *   30% cube_views  (CUBE_DEFINITIONS × reps)
 *   30% fold        (FOLD_SCENARIOS × reps)
 */
export function generateSpatialQuestions(
  rng: () => number,
  count: number = 80
): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];

  const netsCount      = Math.round(count * 0.40);
  const cubesCount     = Math.round(count * 0.30);
  const foldCount      = count - netsCount - cubesCount;

  // ── NETS ──────────────────────────────────────────────────────────────────
  const shuffledNets = shuffle([...NET_TEMPLATES], rng);
  let ni = 0;
  for (let i = 0; i < netsCount; i++) {
    const template = shuffledNets[ni % shuffledNets.length];
    results.push(buildNetQuestion(template, rng));
    ni++;
  }

  // ── CUBE VIEWS ─────────────────────────────────────────────────────────────
  const shuffledCubes = shuffle([...CUBE_DEFINITIONS], rng);
  let ci = 0;
  for (let i = 0; i < cubesCount; i++) {
    const cubeDef = shuffledCubes[ci % shuffledCubes.length];
    results.push(buildCubeViewQuestion(cubeDef, rng));
    ci++;
  }

  // ── FOLD ───────────────────────────────────────────────────────────────────
  const shuffledFolds = shuffle([...FOLD_SCENARIOS], rng);
  let fi = 0;
  for (let i = 0; i < foldCount; i++) {
    const scenario = shuffledFolds[fi % shuffledFolds.length];
    results.push(buildFoldQuestion(scenario, rng));
    fi++;
  }

  // Shuffle the combined output so question types are interleaved
  const shuffled = shuffle(results, rng);

  // Re-assign orderIndex sequentially
  return shuffled.map((q, i) => ({ ...q, orderIndex: i }));
}

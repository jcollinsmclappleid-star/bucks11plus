/**
 * GENERATE_SEED.TS — INTEGRATION PATCH
 * =====================================
 * This file shows the EXACT changes required to integrate the three new
 * generators into the existing generate_seed.ts script.
 *
 * The agent should apply these changes to the existing generate_seed.ts file.
 * Do NOT replace generate_seed.ts — apply the diffs below.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 1: Add imports at the top of generate_seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ADD after existing generator imports:
 *
 *   import { generateComprehensionQuestions } from './generators/comprehension';
 *   import { generateSpatialQuestions }       from './generators/spatial';
 *   import { generateFoundationQuestions }    from './generators/foundation';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 2: Add seeded RNG (if not already present)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ADD at the top of the main generate() function, before any generator calls:
 *
 *   import seedrandom from 'seedrandom';
 *   const seed = process.env.SEED || 'bucks-11plus-v1';
 *   const rng = seedrandom(seed);
 *   console.log(`[generate_seed] Using seed: ${seed}`);
 *
 *   // Log seed to generation_log.json for reproducibility
 *   const logPath = path.join(__dirname, '../generation_log.json');
 *   const existingLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];
 *   existingLog.push({ seed, generatedAt: new Date().toISOString(), version: '1.0.0' });
 *   fs.writeFileSync(logPath, JSON.stringify(existingLog, null, 2));
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 3: Call new generators in the main generate() function
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ADD after existing generator calls:
 *
 *   // ── COMPREHENSION (targets: 75 questions across 15 passages × ~5 each) ──
 *   console.log('[generate_seed] Generating comprehension questions...');
 *   const comprehensionQuestions = generateComprehensionQuestions(rng, 75);
 *   allQuestions.push(...comprehensionQuestions);
 *   console.log(`[generate_seed] Comprehension: ${comprehensionQuestions.length} questions`);
 *
 *   // ── SPATIAL REASONING (targets: 80 questions: 32 nets, 24 cubes, 24 fold) ──
 *   console.log('[generate_seed] Generating spatial reasoning questions...');
 *   const spatialQuestions = generateSpatialQuestions(rng, 80);
 *   allQuestions.push(...spatialQuestions);
 *   console.log(`[generate_seed] Spatial: ${spatialQuestions.length} questions`);
 *
 *   // ── FOUNDATION / EARLY LEARNER (targets: 150 questions: 50 VR, 50 NVR, 50 Maths) ──
 *   console.log('[generate_seed] Generating foundation questions...');
 *   const foundationQuestions = generateFoundationQuestions(rng, 150);
 *   allQuestions.push(...foundationQuestions);
 *   console.log(`[generate_seed] Foundation: ${foundationQuestions.length} questions`);
 *
 *   // ── TOTAL TARGET: ~305 new questions ──────────────────────────────────
 *   //   comprehension: 75
 *   //   spatial:       80
 *   //   foundation:   150
 *   //   TOTAL:        305
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 4: Add QA validation for new question types
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The existing QA validator in generate_seed.ts checks all questions.
 * ADD these additional checks to the validateQuestion() function:
 *
 *   // Comprehension: explanation must reference correct answer
 *   if (q.section === 'comprehension') {
 *     if (!q.explanation || q.explanation.length < 30) {
 *       errors.push(`[${q.stemVariantId}] Comprehension explanation too short`);
 *     }
 *     if (!q.renderConfig.passageText) {
 *       errors.push(`[${q.stemVariantId}] Comprehension question missing passageText`);
 *     }
 *     if (!q.renderConfig.passageId) {
 *       errors.push(`[${q.stemVariantId}] Comprehension question missing passageId`);
 *     }
 *   }
 *
 *   // Spatial: answer options must be 4 SvgFrames
 *   if (q.section === 'spatial') {
 *     const rc = q.renderConfig;
 *     if (rc.answerOptions && rc.answerOptions.length !== 4) {
 *       errors.push(`[${q.stemVariantId}] Spatial question must have exactly 4 answer options`);
 *     }
 *   }
 *
 *   // Foundation: difficulty must be 'foundation', cognitiveLoad must be ≤ 2
 *   if (q.subRuleId && q.subRuleId.startsWith('foundation_')) {
 *     if (q.difficulty !== 'foundation') {
 *       errors.push(`[${q.stemVariantId}] Foundation question must have difficulty: 'foundation'`);
 *     }
 *     if (q.cognitiveLoad > 2) {
 *       errors.push(`[${q.stemVariantId}] Foundation question cognitiveLoad must be ≤ 2, got ${q.cognitiveLoad}`);
 *     }
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 5: Schema changes required BEFORE running generate_seed
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * These must be applied to shared/schema.ts and a migration run FIRST:
 *
 * 1. Add 'foundation' to the difficulty check constraint:
 *    difficulty: text("difficulty").notNull().default("medium")
 *    → Add application-level validation: ['easy','medium','hard','foundation']
 *
 * 2. Add 'comprehension' and 'spatial' to accepted section values.
 *    (schema.ts uses text() columns — no enum constraint — so this is just
 *    documentation, but add to the Zod schema in contentValidation.ts)
 *
 * 3. Add 'comprehension' to RenderType union in contentTypes.ts:
 *    export type RenderType = "text" | "svg" | "chart" | "comprehension";
 *
 * 4. Add ComprehensionPassageConfig, SpatialNetsConfig, SpatialCubeConfig,
 *    and SpatialFoldConfig to the RenderConfig union in contentTypes.ts.
 *    (Full type definitions are in the enhancement spec document.)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGE 6: Install seedrandom
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   npm install seedrandom
 *   npm install --save-dev @types/seedrandom
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DIAGNOSTIC: EXPECTED OUTPUT AFTER RUNNING generate_seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * When the agent runs: npx tsx scripts/generate_seed.ts
 * Expected console output (approximate):
 *
 *   [generate_seed] Using seed: bucks-11plus-v1
 *   [generate_seed] Generating VR questions...       (existing)
 *   [generate_seed] VR: ~120 questions               (existing)
 *   [generate_seed] Generating NVR questions...      (existing)
 *   [generate_seed] NVR: ~120 questions              (existing)
 *   [generate_seed] Generating Maths questions...    (existing)
 *   [generate_seed] Maths: ~100 questions            (existing)
 *   [generate_seed] Generating comprehension questions...
 *   [generate_seed] Comprehension: 75 questions
 *   [generate_seed] Generating spatial reasoning questions...
 *   [generate_seed] Spatial: 80 questions
 *   [generate_seed] Generating foundation questions...
 *   [generate_seed] Foundation: 150 questions
 *   [generate_seed] Total questions: ~645
 *   [generate_seed] Running QA validation...
 *   [generate_seed] QA passed: 0 errors
 *   [generate_seed] Seed file written to: scripts/seed_data.json
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * QUESTION COUNT BREAKDOWN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * New questions from this generator set:
 *
 *   Comprehension
 *   ├─ 15 passages × ~5 questions each = 75 questions
 *   ├─ Types: vocab_in_context (2/passage), fact_retrieval (2), inference (1),
 *   │         authorial_intent (1), text_structure (~0.5)
 *   └─ Difficulties: easy 5 passages, medium 7 passages, hard 3 passages
 *
 *   Spatial Reasoning
 *   ├─ 32 nets questions (4× each NET_TEMPLATE, 8 templates)
 *   ├─ 24 cube view questions (4× each CUBE_DEFINITION, 6 definitions)
 *   └─ 24 fold questions (2–3× each FOLD_SCENARIO, 10 scenarios)
 *   Total: 80 questions
 *   ├─ easy: ~24 (30%)
 *   ├─ medium: ~36 (45%)
 *   └─ hard: ~20 (25%)
 *
 *   Foundation (Early Learner)
 *   ├─ VR: 50 questions
 *   │   ├─ simple_codes: ~10
 *   │   ├─ word_odd_one_out: ~10
 *   │   ├─ word_analogy: ~10
 *   │   ├─ letter_pattern: ~10
 *   │   └─ synonym_simple: ~10
 *   ├─ NVR: 50 questions
 *   │   ├─ shape_count: ~13
 *   │   ├─ simple_pattern: ~13
 *   │   ├─ size_sequence: ~12
 *   │   └─ odd_shape_out: ~12
 *   └─ Maths: 50 questions
 *       ├─ addition: ~9
 *       ├─ subtraction: ~9
 *       ├─ multiplication: ~8
 *       ├─ number_pattern: ~8
 *       ├─ simple_fraction: ~8
 *       └─ word_problem: ~8
 *   Total: 150 questions (all difficulty: 'foundation')
 *
 *   GRAND TOTAL NEW QUESTIONS: 305
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FILE STRUCTURE AFTER AGENT APPLIES ALL CHANGES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * scripts/generators/
 * ├── types.ts                          (existing — no changes)
 * ├── vr/                               (existing — no changes)
 * ├── nvr/                              (existing — no changes)
 * ├── maths/                            (existing — no changes)
 * ├── comprehension/                    ← NEW
 * │   ├── index.ts                      ← entry point + shuffle/pick utils
 * │   ├── passages.ts                   ← 15 authored passages corpus
 * │   └── templates.ts                  ← 5-type question generator
 * ├── spatial/                          ← NEW
 * │   └── index.ts                      ← nets + cube_views + fold generators
 * └── foundation/                       ← NEW
 *     └── index.ts                      ← VR + NVR + Maths foundation generators
 *
 * scripts/
 * ├── generate_seed.ts                  ← MODIFIED (add imports + calls)
 * ├── seed_questions.ts                 (existing — no changes needed)
 * └── generation_log.json               ← NEW (auto-created on first run)
 *
 * shared/
 * ├── schema.ts                         ← MODIFIED (add 'foundation' difficulty)
 * ├── contentTypes.ts                   ← MODIFIED (add new render config types)
 * └── contentValidation.ts              ← MODIFIED (add new Zod validators)
 */

// This file is documentation only — no executable code.
// The agent should read this file and apply the changes described above.
export {};

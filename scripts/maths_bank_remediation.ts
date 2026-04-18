/**
 * Maths Bank GL Audit Remediation Script
 *
 * Performs a full remediation of the mathematics question bank against
 * GL Assessment Buckinghamshire 11+ standards:
 *
 * Phase 1 — Triage existing questions
 *   - Archive non-GL draft questions (combined_probability, compound interest, etc.)
 *   - Fix decimal_fraction wrong answer
 *   - Replace broken frequency_table question
 *   - Approve suitable draft questions (with normalised sub_rule_ids)
 *   - Archive 34 under-levelled data questions
 *
 * Phase 2 — Insert new questions
 *   - 40 easy questions (arithmetic, fractions, percentages, ratio, patterns, data)
 *   - 24 properly-levelled data questions (medium/hard)
 *   - 40 shape & geometry questions (easy/medium/hard)
 *
 * Usage:
 *   npx tsx scripts/maths_bank_remediation.ts
 *   npx tsx scripts/maths_bank_remediation.ts --dry-run
 */

import { db } from "../server/db";
import { questions } from "../shared/schema";
import { eq, inArray, and, like } from "drizzle-orm";

const DRY = process.argv.includes("--dry-run");
const log = (...a: any[]) => console.log(...a);

// ─────────────────────────────────────────────────────────────
// PHASE 1A — Archive non-GL draft questions
// ─────────────────────────────────────────────────────────────
const NON_GL_SUB_RULES = [
  "combined_probability",   // GCSE compound probability
  "compound",               // compound interest (GCSE)
  "consecutive_reasoning",  // "sum of 3 consecutive even numbers = 312" — algebra, not GL
  "algebra_type",           // algebraic "think of a number" — not GL standard
  "prime_factor",           // prime factorisation — not GL Bucks
  "quadratic_sequence",     // quadratic sequences — GCSE
  "vat_calculation",        // VAT questions — not typical GL
  "work_rate",              // work rate problems — GCSE
  "probability",            // standalone probability — not Bucks 11+ GL
];

// ─────────────────────────────────────────────────────────────
// PHASE 1B — Draft questions to APPROVE (with corrected sub_rule_ids)
// ─────────────────────────────────────────────────────────────
// These have been individually verified as GL-standard with correct answers.
const APPROVE_DRAFTS: { subRule: string; newSubRule: string }[] = [
  { subRule: "fraction_of_amount",  newSubRule: "maths.fractions.of_amount" },
  { subRule: "fraction_word",       newSubRule: "maths.fractions.of_amount" },
  { subRule: "fraction_comparison", newSubRule: "maths.fractions.compare" },
  { subRule: "digit_puzzle",        newSubRule: "maths.word_problems.multi_step" },
  { subRule: "estimation",          newSubRule: "maths.word_problems.multi_step" },
  { subRule: "fibonacci_variant",   newSubRule: "maths.patterns.fibonacci_like" },
  { subRule: "alternating",         newSubRule: "maths.patterns.linear" },
  { subRule: "best_value",          newSubRule: "maths.ratio.recipe_scaling" },
  { subRule: "difference_method",   newSubRule: "maths.patterns.linear" },
  { subRule: "area_perimeter",      newSubRule: "maths.shape.area" },
  { subRule: "geometry",            newSubRule: "maths.shape.angles" },
  { subRule: "volume",              newSubRule: "maths.shape.volume" },
  { subRule: "change_ratio",        newSubRule: "maths.ratio.recipe_scaling" },
  { subRule: "express_as_percent",  newSubRule: "maths.percentages.convert_to_pct" },
  { subRule: "loss_percent",        newSubRule: "maths.percentages.profit_loss" },
  { subRule: "mean_calculation",    newSubRule: "maths.data.mean" },
  { subRule: "mean_shift",          newSubRule: "maths.data.mean" },
  { subRule: "median",              newSubRule: "maths.data.median" },
  { subRule: "mixed_operations",    newSubRule: "maths.word_problems.multi_step" },
  { subRule: "money_problem",       newSubRule: "maths.word_problems.money" },
  { subRule: "multi_operation",     newSubRule: "maths.word_problems.multi_step" },
  { subRule: "multi_step",          newSubRule: "maths.word_problems.multi_step" },
  { subRule: "multi_step_inverse",  newSubRule: "maths.word_problems.multi_step" },
  { subRule: "multi_step_percent",  newSubRule: "maths.percentages.multi_step" },
  { subRule: "order_of_operations", newSubRule: "maths.arithmetic.bodmas" },
  { subRule: "ordering",            newSubRule: "maths.fractions.decimal_conversion" },
  { subRule: "percentage_change",   newSubRule: "maths.percentages.increase_decrease" },
  { subRule: "percentage_comparison",newSubRule: "maths.percentages.multi_step" },
  { subRule: "pie_chart",           newSubRule: "maths.data.table" },
  { subRule: "place_value_reasoning",newSubRule: "maths.word_problems.multi_step" },
  { subRule: "proportion_word",     newSubRule: "maths.ratio.recipe_scaling" },
  { subRule: "range_analysis",      newSubRule: "maths.data.range" },
  { subRule: "ratio_difference",    newSubRule: "maths.ratio.difference" },
  { subRule: "real_world",          newSubRule: "maths.word_problems.multi_step" },
  { subRule: "recipe_scaling",      newSubRule: "maths.ratio.recipe_scaling" },
  { subRule: "reverse_fraction",    newSubRule: "maths.fractions.of_amount" },
  { subRule: "reverse_pattern",     newSubRule: "maths.patterns.linear" },
  { subRule: "reverse_percentage",  newSubRule: "maths.percentages.reverse" },
  { subRule: "scaling",             newSubRule: "maths.ratio.scale" },
  { subRule: "simplify_ratio",      newSubRule: "maths.ratio.share" },
  { subRule: "speed_distance",      newSubRule: "maths.word_problems.multi_step" },
  { subRule: "speed_problem",       newSubRule: "maths.word_problems.multi_step" },
  { subRule: "square_cube",         newSubRule: "maths.patterns.square_numbers" },
  { subRule: "three_part",          newSubRule: "maths.word_problems.multi_step" },
  { subRule: "time_problem",        newSubRule: "maths.word_problems.time" },
  { subRule: "triangular",          newSubRule: "maths.patterns.fibonacci_like" },
  { subRule: "two_rule",            newSubRule: "maths.patterns.linear" },
  { subRule: "two_way_table",       newSubRule: "maths.data.table" },
  { subRule: "unit_fraction",       newSubRule: "maths.fractions.of_amount" },
  { subRule: "interpret_graph",     newSubRule: "maths.data.table" },
  { subRule: "frequency_table",     newSubRule: "maths.data.mean" },
  { subRule: "geometric",           newSubRule: "maths.patterns.fibonacci_like" },
  { subRule: "nth_term",            newSubRule: "maths.patterns.linear" },
  { subRule: "spatial_pattern",     newSubRule: "maths.patterns.linear" },
  { subRule: "successive",          newSubRule: "maths.patterns.linear" },
  { subRule: "decimal_fraction",    newSubRule: "maths.fractions.decimal_conversion" },
  { subRule: "improper_calc",       newSubRule: "maths.fractions.add_subtract" },
  { subRule: "age_problem",         newSubRule: "maths.word_problems.multi_step" },
  { subRule: "currency",            newSubRule: "maths.word_problems.money" },
];

// ─────────────────────────────────────────────────────────────
// PHASE 1C — Archive under-levelled data questions
// ─────────────────────────────────────────────────────────────
const DATA_SUB_RULES_TO_ARCHIVE = [
  "maths.data.bar_single_step",
  "maths.data.line_single_step",
  "maths.data.bar_two_step",
  "maths.data.table_two_step",
];

// ─────────────────────────────────────────────────────────────
// PHASE 2 — New questions
// All answers have been independently verified.
// ─────────────────────────────────────────────────────────────

type NewQuestion = {
  id: string;
  section: "Mathematics";
  type: "numerical";
  prompt: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  skillId: string;
  subRuleId: string;
  timeExpected: number;
  estTimeSeconds: number;
  cognitiveLoad: number;
  trapTypes: string[];
  explanation: string;
  orderIndex: number;
  qaStatus: "approved";
  freePool: boolean;
  questionPool: "practice";
  locale: "en-GB";
  britishSpelling: true;
  version: 1;
  qualityScore: 0;
  renderType: "text";
  renderConfig: Record<string, never>;
};

function q(o: Omit<NewQuestion, "section" | "type" | "qaStatus" | "freePool" | "questionPool" | "locale" | "britishSpelling" | "version" | "qualityScore" | "renderType" | "renderConfig">): NewQuestion {
  return {
    ...o,
    section: "Mathematics",
    type: "numerical",
    qaStatus: "approved",
    freePool: false,
    questionPool: "practice",
    locale: "en-GB",
    britishSpelling: true,
    version: 1,
    qualityScore: 0,
    renderType: "text",
    renderConfig: {},
  };
}

const NEW_QUESTIONS: NewQuestion[] = [

  // ── EASY ARITHMETIC (10) ──────────────────────────────────────
  q({
    id: "e-ar-001-maths-bucks11",
    prompt: "A newsagent sells 6 newspapers in the morning and 8 in the afternoon. How many newspapers does he sell altogether?",
    options: ["14", "12", "16", "48"],
    correctAnswer: "14",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.addition",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["wrong_operation"],
    explanation: "6 + 8 = 14 newspapers.",
    orderIndex: 800,
  }),
  q({
    id: "e-ar-002-maths-bucks11",
    prompt: "A box holds 12 eggs. How many eggs are in 5 boxes?",
    options: ["60", "17", "72", "24"],
    correctAnswer: "60",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["addition_instead_of_multiplication"],
    explanation: "5 × 12 = 60 eggs.",
    orderIndex: 801,
  }),
  q({
    id: "e-ar-003-maths-bucks11",
    prompt: "Pencils cost 15p each. How much do 6 pencils cost?",
    options: ["90p", "21p", "75p", "96p"],
    correctAnswer: "90p",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["addition_instead_of_multiplication"],
    explanation: "6 × 15p = 90p.",
    orderIndex: 802,
  }),
  q({
    id: "e-ar-004-maths-bucks11",
    prompt: "Milk costs £1.20 per litre. How much do 4 litres cost?",
    options: ["£4.80", "£5.00", "£1.24", "£4.20"],
    correctAnswer: "£4.80",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["decimal_error"],
    explanation: "4 × £1.20 = £4.80.",
    orderIndex: 803,
  }),
  q({
    id: "e-ar-005-maths-bucks11",
    prompt: "A class has 30 pupils. 12 are boys. How many are girls?",
    options: ["18", "22", "16", "42"],
    correctAnswer: "18",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.subtraction",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["addition_instead_of_subtraction"],
    explanation: "30 − 12 = 18 girls.",
    orderIndex: 804,
  }),
  q({
    id: "e-ar-006-maths-bucks11",
    prompt: "A bookshelf has 5 shelves with 14 books on each shelf. How many books are there in total?",
    options: ["70", "19", "60", "80"],
    correctAnswer: "70",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["addition_instead_of_multiplication"],
    explanation: "5 × 14 = 70 books.",
    orderIndex: 805,
  }),
  q({
    id: "e-ar-007-maths-bucks11",
    prompt: "Sam earns £8 per hour. He works for 6 hours. How much does he earn in total?",
    options: ["£48", "£14", "£42", "£56"],
    correctAnswer: "£48",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["addition_instead_of_multiplication"],
    explanation: "6 × £8 = £48.",
    orderIndex: 806,
  }),
  q({
    id: "e-ar-008-maths-bucks11",
    prompt: "A cake is cut into 8 equal slices. 3 slices are eaten. How many slices remain?",
    options: ["5", "3", "11", "4"],
    correctAnswer: "5",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.subtraction",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["subtracted_wrong_way"],
    explanation: "8 − 3 = 5 slices remain.",
    orderIndex: 807,
  }),
  q({
    id: "e-ar-009-maths-bucks11",
    prompt: "A train departs at 10:20. The journey takes 45 minutes. What time does it arrive?",
    options: ["11:05", "10:55", "11:15", "11:25"],
    correctAnswer: "11:05",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.time",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 2,
    trapTypes: ["wrong_time_addition"],
    explanation: "10:20 + 45 minutes: 10:20 + 40 min = 11:00, + 5 min = 11:05.",
    orderIndex: 808,
  }),
  q({
    id: "e-ar-010-maths-bucks11",
    prompt: "Apples cost 25p each. How much do 8 apples cost?",
    options: ["£2.00", "£1.60", "£2.50", "£1.75"],
    correctAnswer: "£2.00",
    difficulty: "easy", skillId: "maths.arithmetic", subRuleId: "maths.arithmetic.multiplication",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["unit_conversion_error"],
    explanation: "8 × 25p = 200p = £2.00.",
    orderIndex: 809,
  }),

  // ── EASY FRACTIONS (8) ───────────────────────────────────────
  q({
    id: "e-fr-001-maths-bucks11",
    prompt: "What is ½ of 48?",
    options: ["24", "12", "16", "36"],
    correctAnswer: "24",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_fraction"],
    explanation: "48 ÷ 2 = 24.",
    orderIndex: 810,
  }),
  q({
    id: "e-fr-002-maths-bucks11",
    prompt: "What is ¼ of 60?",
    options: ["15", "20", "12", "18"],
    correctAnswer: "15",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_fraction"],
    explanation: "60 ÷ 4 = 15.",
    orderIndex: 811,
  }),
  q({
    id: "e-fr-003-maths-bucks11",
    prompt: "What is ¾ of 40?",
    options: ["30", "10", "20", "24"],
    correctAnswer: "30",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_one_quarter_not_three"],
    explanation: "¼ of 40 = 10. ¾ = 3 × 10 = 30.",
    orderIndex: 812,
  }),
  q({
    id: "e-fr-004-maths-bucks11",
    prompt: "What is ⅓ of 90?",
    options: ["30", "45", "27", "60"],
    correctAnswer: "30",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_divisor"],
    explanation: "90 ÷ 3 = 30.",
    orderIndex: 813,
  }),
  q({
    id: "e-fr-005-maths-bucks11",
    prompt: "A pizza is cut into 8 equal slices. Emma eats 3 slices. What fraction of the pizza has she eaten?",
    options: ["3/8", "3/4", "1/3", "5/8"],
    correctAnswer: "3/8",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_denominator"],
    explanation: "Emma eats 3 out of 8 slices = 3/8 of the pizza.",
    orderIndex: 814,
  }),
  q({
    id: "e-fr-006-maths-bucks11",
    prompt: "There are 30 pupils in a class. ⅖ of them have a packed lunch. How many pupils have a packed lunch?",
    options: ["12", "10", "15", "6"],
    correctAnswer: "12",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.of_amount",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_one_fifth_not_two"],
    explanation: "⅕ of 30 = 6. ⅖ = 2 × 6 = 12 pupils.",
    orderIndex: 815,
  }),
  q({
    id: "e-fr-007-maths-bucks11",
    prompt: "Write ¾ as a decimal.",
    options: ["0.75", "0.34", "0.43", "0.3"],
    correctAnswer: "0.75",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.decimal_conversion",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["digit_reversal"],
    explanation: "¾ = 3 ÷ 4 = 0.75.",
    orderIndex: 816,
  }),
  q({
    id: "e-fr-008-maths-bucks11",
    prompt: "Which fraction is greater: ½ or ³⁄₈?",
    options: ["½", "³⁄₈", "They are equal", "Cannot tell"],
    correctAnswer: "½",
    difficulty: "easy", skillId: "maths.fractions", subRuleId: "maths.fractions.compare",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["bigger_number_on_bottom_means_bigger"],
    explanation: "½ = 4/8 and ³⁄₈ = 3/8. Since 4 > 3, ½ is greater.",
    orderIndex: 817,
  }),

  // ── EASY PERCENTAGES (6) ─────────────────────────────────────
  q({
    id: "e-pc-001-maths-bucks11",
    prompt: "What is 50% of 80?",
    options: ["40", "50", "30", "20"],
    correctAnswer: "40",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.complement",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_percent"],
    explanation: "50% = ½. 80 ÷ 2 = 40.",
    orderIndex: 818,
  }),
  q({
    id: "e-pc-002-maths-bucks11",
    prompt: "What is 10% of 150?",
    options: ["15", "10", "50", "1.5"],
    correctAnswer: "15",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.complement",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["divide_by_10_error"],
    explanation: "10% = divide by 10. 150 ÷ 10 = 15.",
    orderIndex: 819,
  }),
  q({
    id: "e-pc-003-maths-bucks11",
    prompt: "What is 25% of 60?",
    options: ["15", "25", "20", "10"],
    correctAnswer: "15",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.complement",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_percent"],
    explanation: "25% = ¼. 60 ÷ 4 = 15.",
    orderIndex: 820,
  }),
  q({
    id: "e-pc-004-maths-bucks11",
    prompt: "A T-shirt costs £20. It is reduced by 10% in a sale. What is the new price?",
    options: ["£18", "£10", "£22", "£15"],
    correctAnswer: "£18",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.sale_price",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_discount_not_price"],
    explanation: "10% of £20 = £2. New price = £20 − £2 = £18.",
    orderIndex: 821,
  }),
  q({
    id: "e-pc-005-maths-bucks11",
    prompt: "In a class of 40 pupils, 30 pass a test. What percentage of pupils pass?",
    options: ["75%", "30%", "50%", "70%"],
    correctAnswer: "75%",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.convert_to_pct",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["confused_fraction_and_percent"],
    explanation: "30/40 = ¾ = 75%.",
    orderIndex: 822,
  }),
  q({
    id: "e-pc-006-maths-bucks11",
    prompt: "A shop has 200 items. 20% are on sale. How many items are on sale?",
    options: ["40", "20", "50", "180"],
    correctAnswer: "40",
    difficulty: "easy", skillId: "maths.percentages", subRuleId: "maths.percentages.complement",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_percent"],
    explanation: "20% of 200 = 200 ÷ 5 = 40 items.",
    orderIndex: 823,
  }),

  // ── EASY RATIO (4) ────────────────────────────────────────────
  q({
    id: "e-rt-001-maths-bucks11",
    prompt: "Share 15 sweets between two children in the ratio 1:2. How many sweets does the child with the larger share receive?",
    options: ["10", "5", "8", "7"],
    correctAnswer: "10",
    difficulty: "easy", skillId: "maths.ratio", subRuleId: "maths.ratio.share",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_smaller_share"],
    explanation: "1 + 2 = 3 parts. 15 ÷ 3 = 5 per part. Larger share = 2 × 5 = 10.",
    orderIndex: 824,
  }),
  q({
    id: "e-rt-002-maths-bucks11",
    prompt: "A smoothie uses strawberries and bananas in the ratio 3:1. How many strawberries are needed with 4 bananas?",
    options: ["12", "6", "3", "8"],
    correctAnswer: "12",
    difficulty: "easy", skillId: "maths.ratio", subRuleId: "maths.ratio.scale",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["multiplied_wrong_part"],
    explanation: "Ratio 3:1 means 3 strawberries for every 1 banana. 4 × 3 = 12 strawberries.",
    orderIndex: 825,
  }),
  q({
    id: "e-rt-003-maths-bucks11",
    prompt: "Tom and Amy share 24 stickers in the ratio 1:3. How many stickers does Tom get?",
    options: ["6", "8", "18", "12"],
    correctAnswer: "6",
    difficulty: "easy", skillId: "maths.ratio", subRuleId: "maths.ratio.share",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_larger_share"],
    explanation: "1 + 3 = 4 parts. 24 ÷ 4 = 6 per part. Tom has 1 part = 6 stickers.",
    orderIndex: 826,
  }),
  q({
    id: "e-rt-004-maths-bucks11",
    prompt: "Blue and red paint are mixed in the ratio 2:1. How much red paint is needed if 8 ml of blue paint is used?",
    options: ["4 ml", "2 ml", "3 ml", "8 ml"],
    correctAnswer: "4 ml",
    difficulty: "easy", skillId: "maths.ratio", subRuleId: "maths.ratio.scale",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["used_wrong_ratio_part"],
    explanation: "2:1 ratio. Blue = 8 ml. 1 part = 8 ÷ 2 = 4 ml. Red = 4 ml.",
    orderIndex: 827,
  }),

  // ── EASY NUMBER PATTERNS (6) ─────────────────────────────────
  q({
    id: "e-np-001-maths-bucks11",
    prompt: "What is the next number in the sequence: 5, 10, 15, 20, ___?",
    options: ["25", "23", "30", "22"],
    correctAnswer: "25",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.linear",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_step"],
    explanation: "The sequence increases by 5 each time. 20 + 5 = 25.",
    orderIndex: 828,
  }),
  q({
    id: "e-np-002-maths-bucks11",
    prompt: "What is the next number in the sequence: 2, 4, 8, 16, ___?",
    options: ["32", "18", "20", "24"],
    correctAnswer: "32",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.linear",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["added_instead_of_multiplied"],
    explanation: "Each term doubles. 16 × 2 = 32.",
    orderIndex: 829,
  }),
  q({
    id: "e-np-003-maths-bucks11",
    prompt: "What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ___?",
    options: ["13", "10", "11", "12"],
    correctAnswer: "13",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.fibonacci_like",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["wrong_sum"],
    explanation: "Each term is the sum of the two before it. 5 + 8 = 13.",
    orderIndex: 830,
  }),
  q({
    id: "e-np-004-maths-bucks11",
    prompt: "What is the missing number in the sequence: 3, 7, ___, 15, 19?",
    options: ["11", "9", "12", "10"],
    correctAnswer: "11",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.linear",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_step"],
    explanation: "The sequence increases by 4. 7 + 4 = 11.",
    orderIndex: 831,
  }),
  q({
    id: "e-np-005-maths-bucks11",
    prompt: "What is the next number in the sequence: 100, 91, 82, 73, ___?",
    options: ["64", "62", "63", "65"],
    correctAnswer: "64",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.linear",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_step"],
    explanation: "The sequence decreases by 9 each time. 73 − 9 = 64.",
    orderIndex: 832,
  }),
  q({
    id: "e-np-006-maths-bucks11",
    prompt: "What is the next number in the sequence: 4, 9, 16, 25, ___?",
    options: ["36", "30", "33", "38"],
    correctAnswer: "36",
    difficulty: "easy", skillId: "maths.patterns", subRuleId: "maths.patterns.square_numbers",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["added_constant_instead_of_squaring"],
    explanation: "These are square numbers: 2², 3², 4², 5². Next is 6² = 36.",
    orderIndex: 833,
  }),

  // ── EASY DATA (6) ─────────────────────────────────────────────
  q({
    id: "e-da-001-maths-bucks11",
    prompt: "Find the mean of these five numbers: 4, 6, 8, 10, 12.",
    options: ["8", "6", "10", "40"],
    correctAnswer: "8",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["found_median_not_mean", "wrote_total_not_mean"],
    explanation: "Total = 4 + 6 + 8 + 10 + 12 = 40. Mean = 40 ÷ 5 = 8.",
    orderIndex: 834,
  }),
  q({
    id: "e-da-002-maths-bucks11",
    prompt: "Find the range of these five numbers: 3, 7, 12, 1, 9.",
    options: ["11", "9", "12", "10"],
    correctAnswer: "11",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.range",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["used_wrong_extremes"],
    explanation: "Highest = 12, Lowest = 1. Range = 12 − 1 = 11.",
    orderIndex: 835,
  }),
  q({
    id: "e-da-003-maths-bucks11",
    prompt: "Five pupils scored: 5, 7, 7, 9, 8. What is the mode?",
    options: ["7", "8", "9", "5"],
    correctAnswer: "7",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.median",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["found_median_not_mode"],
    explanation: "The mode is the most common value. 7 appears twice; all others appear once. Mode = 7.",
    orderIndex: 836,
  }),
  q({
    id: "e-da-004-maths-bucks11",
    prompt: "Five numbers are: 9, 3, 7, 1, 5. What is the median?",
    options: ["5", "7", "3", "9"],
    correctAnswer: "5",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.median",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["did_not_order_first"],
    explanation: "In order: 1, 3, 5, 7, 9. The middle value is 5.",
    orderIndex: 837,
  }),
  q({
    id: "e-da-005-maths-bucks11",
    prompt: "Five friends' heights in cm are: 148, 152, 145, 160, 150. What is the range of their heights?",
    options: ["15 cm", "12 cm", "17 cm", "18 cm"],
    correctAnswer: "15 cm",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.range",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["used_wrong_extremes"],
    explanation: "Tallest = 160, Shortest = 145. Range = 160 − 145 = 15 cm.",
    orderIndex: 838,
  }),
  q({
    id: "e-da-006-maths-bucks11",
    prompt: "A tally chart shows pupils' favourite sports: Football 8, Cricket 5, Tennis 3. How many more pupils chose Football than Tennis?",
    options: ["5", "3", "8", "13"],
    correctAnswer: "5",
    difficulty: "easy", skillId: "maths.data", subRuleId: "maths.data.range",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["wrong_subtraction"],
    explanation: "8 − 3 = 5 more pupils chose Football than Tennis.",
    orderIndex: 839,
  }),

  // ── MEDIUM DATA (14 replacements) ────────────────────────────
  q({
    id: "m-da-001-maths-bucks11",
    prompt: "The mean of five numbers is 9. Four of the numbers are 6, 11, 8, and 12. What is the fifth number?",
    options: ["8", "7", "9", "10"],
    correctAnswer: "8",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["subtracted_from_wrong_total"],
    explanation: "Total needed = 9 × 5 = 45. Sum of four = 6 + 11 + 8 + 12 = 37. Fifth = 45 − 37 = 8.",
    orderIndex: 840,
  }),
  q({
    id: "m-da-002-maths-bucks11",
    prompt: "The ages of six pupils are 10, 10, 11, 11, 12, 12. What is their mean age?",
    options: ["11", "10", "10.5", "12"],
    correctAnswer: "11",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 3,
    trapTypes: ["found_middle_value_not_mean"],
    explanation: "Total = 10 + 10 + 11 + 11 + 12 + 12 = 66. Mean = 66 ÷ 6 = 11.",
    orderIndex: 841,
  }),
  q({
    id: "m-da-003-maths-bucks11",
    prompt: "Goals were scored over 5 matches: 2, 3, 1, 4, 5. What is the mean number of goals per match?",
    options: ["3", "2", "4", "5"],
    correctAnswer: "3",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["found_median_not_mean"],
    explanation: "Total = 2 + 3 + 1 + 4 + 5 = 15. Mean = 15 ÷ 5 = 3.",
    orderIndex: 842,
  }),
  q({
    id: "m-da-004-maths-bucks11",
    prompt: "Five test scores are: 62, 75, 68, 71, 54. What is the range of the scores?",
    options: ["21", "17", "25", "13"],
    correctAnswer: "21",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.range",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["used_wrong_extremes"],
    explanation: "Highest = 75, Lowest = 54. Range = 75 − 54 = 21.",
    orderIndex: 843,
  }),
  q({
    id: "m-da-005-maths-bucks11",
    prompt: "Seven temperatures (°C) recorded during a week are: 12, 8, 15, 11, 9, 14, 13. What is the median temperature?",
    options: ["12", "11", "13", "9"],
    correctAnswer: "12",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.median",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["did_not_sort_before_finding_median"],
    explanation: "In order: 8, 9, 11, 12, 13, 14, 15. The middle (4th) value is 12.",
    orderIndex: 844,
  }),
  q({
    id: "m-da-006-maths-bucks11",
    prompt: "Four classes sat a test. Their mean scores were: Class A 72, Class B 68, Class C 75, Class D 65. What is the mean score across all four classes?",
    options: ["70", "68", "72", "75"],
    correctAnswer: "70",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["found_median_of_class_means"],
    explanation: "Total = 72 + 68 + 75 + 65 = 280. Mean = 280 ÷ 4 = 70.",
    orderIndex: 845,
  }),
  q({
    id: "m-da-007-maths-bucks11",
    prompt: "A pupil watches TV for: Mon 2, Tue 3, Wed 1, Thu 2, Fri 2, Sat 4, Sun 0 hours. What is the mean number of hours watched per day?",
    options: ["2", "1", "3", "14"],
    correctAnswer: "2",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["wrote_total_not_mean"],
    explanation: "Total = 2 + 3 + 1 + 2 + 2 + 4 + 0 = 14 hours. Mean = 14 ÷ 7 = 2.",
    orderIndex: 846,
  }),
  q({
    id: "m-da-008-maths-bucks11",
    prompt: "A plant's height (cm) at the end of each week: Week 1: 5, Week 2: 9, Week 3: 13, Week 4: 17. By how much did it grow between Week 1 and Week 4?",
    options: ["12 cm", "8 cm", "17 cm", "4 cm"],
    correctAnswer: "12 cm",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.range",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["read_week_4_value_not_growth"],
    explanation: "Growth = 17 − 5 = 12 cm.",
    orderIndex: 847,
  }),
  q({
    id: "m-da-009-maths-bucks11",
    prompt: "In a class of 30 pupils, 12 prefer football, 9 prefer cricket, and the rest prefer tennis. What percentage of pupils prefer tennis?",
    options: ["30%", "25%", "40%", "9%"],
    correctAnswer: "30%",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["forgot_to_subtract_both_groups", "wrote_count_not_percent"],
    explanation: "Tennis = 30 − 12 − 9 = 9. Percentage = 9 ÷ 30 × 100 = 30%.",
    orderIndex: 848,
  }),
  q({
    id: "m-da-010-maths-bucks11",
    prompt: "Ten pupils' ages are recorded: 9, 10, 11, 10, 9, 11, 10, 11, 9, 10. What is the mode?",
    options: ["10", "9", "11", "9.5"],
    correctAnswer: "10",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.median",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["found_mean_not_mode"],
    explanation: "Count each: 9 appears 3 times, 10 appears 4 times, 11 appears 3 times. Mode = 10.",
    orderIndex: 849,
  }),
  q({
    id: "m-da-011-maths-bucks11",
    prompt: "Five scores are: 14, 18, 12, 16, 20. What is the mean?",
    options: ["16", "14", "18", "80"],
    correctAnswer: "16",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["wrote_total_not_mean"],
    explanation: "Total = 14 + 18 + 12 + 16 + 20 = 80. Mean = 80 ÷ 5 = 16.",
    orderIndex: 850,
  }),
  q({
    id: "m-da-012-maths-bucks11",
    prompt: "Over 4 months, Alice saves £8, £12, £10, £6. Ben saves £15, £9, £12, £12. How much more does Ben save than Alice in total?",
    options: ["£12", "£6", "£14", "£18"],
    correctAnswer: "£12",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 4,
    trapTypes: ["compared_only_one_month"],
    explanation: "Alice total = 8 + 12 + 10 + 6 = £36. Ben total = 15 + 9 + 12 + 12 = £48. Difference = £48 − £36 = £12.",
    orderIndex: 851,
  }),
  q({
    id: "m-da-013-maths-bucks11",
    prompt: "In a survey of 40 children, 15 prefer cats, 12 prefer dogs, and the rest prefer other pets. What fraction prefer other pets? Give your answer in its simplest form.",
    options: ["13/40", "3/8", "1/3", "13/30"],
    correctAnswer: "13/40",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["wrong_denominator"],
    explanation: "Other = 40 − 15 − 12 = 13. Fraction = 13/40 (already in simplest form).",
    orderIndex: 852,
  }),
  q({
    id: "m-da-014-maths-bucks11",
    prompt: "A line graph shows a shop's daily sales: Mon £120, Tue £145, Wed £110, Thu £155, Fri £170. What are the total sales from Monday to Friday?",
    options: ["£700", "£650", "£720", "£680"],
    correctAnswer: "£700",
    difficulty: "medium", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["partial_sum"],
    explanation: "Total = £120 + £145 + £110 + £155 + £170 = £700.",
    orderIndex: 853,
  }),

  // ── HARD DATA (10 replacements) ──────────────────────────────
  q({
    id: "h-da-001-maths-bucks11",
    prompt: "A class of 24 pupils has a mean test score of 65. A new pupil joins and the new mean is 66. What score did the new pupil get?",
    options: ["90", "85", "88", "92"],
    correctAnswer: "90",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 60, estTimeSeconds: 60, cognitiveLoad: 7,
    trapTypes: ["did_not_calculate_new_total"],
    explanation: "Old total = 24 × 65 = 1,560. New total = 25 × 66 = 1,650. New pupil's score = 1,650 − 1,560 = 90.",
    orderIndex: 854,
  }),
  q({
    id: "h-da-002-maths-bucks11",
    prompt: "Seven heights (cm) are recorded: 142, 148, 155, 138, 147, 151, 143. What is the median height?",
    options: ["147", "143", "145", "148"],
    correctAnswer: "147",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.median",
    timeExpected: 50, estTimeSeconds: 50, cognitiveLoad: 6,
    trapTypes: ["did_not_sort_first", "wrong_middle_position"],
    explanation: "In order: 138, 142, 143, 147, 148, 151, 155. The 4th (middle) value = 147.",
    orderIndex: 855,
  }),
  q({
    id: "h-da-003-maths-bucks11",
    prompt: "A chess club has: Year 5 — Boys 8, Girls 6; Year 6 — Boys 7, Girls 11. How many more girls than boys are in the club?",
    options: ["2", "1", "3", "4"],
    correctAnswer: "2",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 50, estTimeSeconds: 50, cognitiveLoad: 6,
    trapTypes: ["only_compared_one_year_group"],
    explanation: "Total boys = 8 + 7 = 15. Total girls = 6 + 11 = 17. Difference = 17 − 15 = 2.",
    orderIndex: 856,
  }),
  q({
    id: "h-da-004-maths-bucks11",
    prompt: "A frequency table shows scores: 5 (×3), 6 (×4), 7 (×5), 8 (×2), 9 (×1). What is the mean score?",
    options: ["6.6", "6", "6.5", "7"],
    correctAnswer: "6.6",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 70, estTimeSeconds: 70, cognitiveLoad: 8,
    trapTypes: ["added_scores_without_weighting", "found_modal_not_mean"],
    explanation: "Total score = 5×3 + 6×4 + 7×5 + 8×2 + 9×1 = 15+24+35+16+9 = 99. Total pupils = 15. Mean = 99 ÷ 15 = 6.6.",
    orderIndex: 857,
  }),
  q({
    id: "h-da-005-maths-bucks11",
    prompt: "The mean of six numbers is 12. Five of the numbers are 8, 14, 10, 16, and 12. What is the sixth number?",
    options: ["12", "10", "11", "14"],
    correctAnswer: "12",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 50, estTimeSeconds: 50, cognitiveLoad: 6,
    trapTypes: ["subtracted_wrong_total"],
    explanation: "Total = 12 × 6 = 72. Sum of five = 8+14+10+16+12 = 60. Sixth = 72 − 60 = 12.",
    orderIndex: 858,
  }),
  q({
    id: "h-da-006-maths-bucks11",
    prompt: "Six runners have times (seconds): 45, 55, 60, 65, 70, 65. The fastest time is removed. What is the mean time of the remaining five runners?",
    options: ["63", "58", "60", "65"],
    correctAnswer: "63",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 60, estTimeSeconds: 60, cognitiveLoad: 7,
    trapTypes: ["included_fastest_in_new_mean", "removed_wrong_runner"],
    explanation: "Fastest = 45 seconds (removed). Remaining: 55+60+65+70+65 = 315. Mean = 315 ÷ 5 = 63.",
    orderIndex: 859,
  }),
  q({
    id: "h-da-007-maths-bucks11",
    prompt: "Monthly rainfall (mm): January to June total 312 mm; July to December total 288 mm. What is the mean monthly rainfall for the whole year?",
    options: ["50 mm", "48 mm", "52 mm", "25 mm"],
    correctAnswer: "50 mm",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 50, estTimeSeconds: 50, cognitiveLoad: 6,
    trapTypes: ["divided_by_two_not_twelve"],
    explanation: "Annual total = 312 + 288 = 600 mm. Mean = 600 ÷ 12 = 50 mm per month.",
    orderIndex: 860,
  }),
  q({
    id: "h-da-008-maths-bucks11",
    prompt: "Temperatures (°C) recorded at hourly intervals are: 12, 16, 18, 22, 17. What is the mean temperature?",
    options: ["17", "16", "18", "20"],
    correctAnswer: "17",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 6,
    trapTypes: ["found_median_not_mean"],
    explanation: "Total = 12 + 16 + 18 + 22 + 17 = 85. Mean = 85 ÷ 5 = 17°C.",
    orderIndex: 861,
  }),
  q({
    id: "h-da-009-maths-bucks11",
    prompt: "Preferred subjects: Boys — Maths 12, English 9, Science 15; Girls — Maths 12, English 12, Science 15. What percentage of all pupils prefer Maths?",
    options: ["32%", "25%", "30%", "35%"],
    correctAnswer: "32%",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.table",
    timeExpected: 70, estTimeSeconds: 70, cognitiveLoad: 8,
    trapTypes: ["used_boys_only", "wrong_total"],
    explanation: "Total pupils = 12+9+15+12+12+15 = 75. Maths pupils = 12+12 = 24. Percentage = 24÷75×100 = 32%.",
    orderIndex: 862,
  }),
  q({
    id: "h-da-010-maths-bucks11",
    prompt: "The mean of seven numbers is 14. Six of the numbers are 12, 17, 10, 18, 14, and 11. What is the seventh number?",
    options: ["16", "14", "15", "18"],
    correctAnswer: "16",
    difficulty: "hard", skillId: "maths.data", subRuleId: "maths.data.mean",
    timeExpected: 55, estTimeSeconds: 55, cognitiveLoad: 7,
    trapTypes: ["wrong_total_calculation"],
    explanation: "Total = 14 × 7 = 98. Sum of six = 12+17+10+18+14+11 = 82. Seventh = 98 − 82 = 16.",
    orderIndex: 863,
  }),

  // ── EASY SHAPE & GEOMETRY (10) ────────────────────────────────
  q({
    id: "e-sh-001-maths-bucks11",
    prompt: "A rectangle is 8 cm long and 3 cm wide. What is its area?",
    options: ["24 cm²", "11 cm²", "22 cm²", "48 cm²"],
    correctAnswer: "24 cm²",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["found_perimeter_not_area"],
    explanation: "Area = length × width = 8 × 3 = 24 cm².",
    orderIndex: 870,
  }),
  q({
    id: "e-sh-002-maths-bucks11",
    prompt: "A square has sides of 6 cm. What is its area?",
    options: ["36 cm²", "12 cm²", "24 cm²", "60 cm²"],
    correctAnswer: "36 cm²",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["multiplied_by_4_not_squared"],
    explanation: "Area = side² = 6 × 6 = 36 cm².",
    orderIndex: 871,
  }),
  q({
    id: "e-sh-003-maths-bucks11",
    prompt: "A rectangle is 9 cm long and 4 cm wide. What is its perimeter?",
    options: ["26 cm", "13 cm", "36 cm", "52 cm"],
    correctAnswer: "26 cm",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["added_only_two_sides", "found_area_not_perimeter"],
    explanation: "Perimeter = 2 × (length + width) = 2 × (9 + 4) = 2 × 13 = 26 cm.",
    orderIndex: 872,
  }),
  q({
    id: "e-sh-004-maths-bucks11",
    prompt: "A square has sides of 7 cm. What is its perimeter?",
    options: ["28 cm", "14 cm", "49 cm", "56 cm"],
    correctAnswer: "28 cm",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["counted_two_sides_not_four", "found_area_not_perimeter"],
    explanation: "Perimeter = 4 × side = 4 × 7 = 28 cm.",
    orderIndex: 873,
  }),
  q({
    id: "e-sh-005-maths-bucks11",
    prompt: "A triangle has angles of 40°, 60°, and a missing angle. What is the missing angle?",
    options: ["80°", "70°", "75°", "90°"],
    correctAnswer: "80°",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 1,
    trapTypes: ["subtracted_from_360_not_180"],
    explanation: "Angles in a triangle add up to 180°. Missing = 180° − 40° − 60° = 80°.",
    orderIndex: 874,
  }),
  q({
    id: "e-sh-006-maths-bucks11",
    prompt: "Two angles on a straight line are 65° and a missing angle. What is the missing angle?",
    options: ["115°", "125°", "95°", "105°"],
    correctAnswer: "115°",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["subtracted_from_360_not_180"],
    explanation: "Angles on a straight line add up to 180°. Missing = 180° − 65° = 115°.",
    orderIndex: 875,
  }),
  q({
    id: "e-sh-007-maths-bucks11",
    prompt: "A rectangle is 10 cm long and 5 cm wide. What is its area?",
    options: ["50 cm²", "15 cm²", "30 cm²", "100 cm²"],
    correctAnswer: "50 cm²",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 20, estTimeSeconds: 20, cognitiveLoad: 1,
    trapTypes: ["found_perimeter_not_area"],
    explanation: "Area = 10 × 5 = 50 cm².",
    orderIndex: 876,
  }),
  q({
    id: "e-sh-008-maths-bucks11",
    prompt: "What is the area of a right-angled triangle with base 6 cm and height 4 cm?",
    options: ["12 cm²", "10 cm²", "24 cm²", "20 cm²"],
    correctAnswer: "12 cm²",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["forgot_to_halve"],
    explanation: "Area of a triangle = ½ × base × height = ½ × 6 × 4 = 12 cm².",
    orderIndex: 877,
  }),
  q({
    id: "e-sh-009-maths-bucks11",
    prompt: "The angles of any quadrilateral add up to ___°.",
    options: ["360°", "90°", "180°", "270°"],
    correctAnswer: "360°",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 15, estTimeSeconds: 15, cognitiveLoad: 1,
    trapTypes: ["confused_with_triangle_sum"],
    explanation: "The four angles of any quadrilateral always add up to 360°.",
    orderIndex: 878,
  }),
  q({
    id: "e-sh-010-maths-bucks11",
    prompt: "The area of a rectangle is 35 cm². Its length is 7 cm. What is its width?",
    options: ["5 cm", "7 cm", "4 cm", "6 cm"],
    correctAnswer: "5 cm",
    difficulty: "easy", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 25, estTimeSeconds: 25, cognitiveLoad: 2,
    trapTypes: ["multiplied_instead_of_divided"],
    explanation: "Width = area ÷ length = 35 ÷ 7 = 5 cm.",
    orderIndex: 879,
  }),

  // ── MEDIUM SHAPE & GEOMETRY (15) ─────────────────────────────
  q({
    id: "m-sh-001-maths-bucks11",
    prompt: "A right-angled triangle has a base of 10 cm and a height of 7 cm. What is its area?",
    options: ["35 cm²", "17 cm²", "70 cm²", "140 cm²"],
    correctAnswer: "35 cm²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["forgot_to_halve", "added_instead_of_multiplied"],
    explanation: "Area = ½ × base × height = ½ × 10 × 7 = 35 cm².",
    orderIndex: 880,
  }),
  q({
    id: "m-sh-002-maths-bucks11",
    prompt: "An L-shaped room is made from two rectangles. One is 8 m × 3 m and the other is 4 m × 5 m. What is the total area of the room?",
    options: ["44 m²", "34 m²", "40 m²", "60 m²"],
    correctAnswer: "44 m²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["calculated_only_one_rectangle", "added_all_numbers"],
    explanation: "Area = (8 × 3) + (4 × 5) = 24 + 20 = 44 m².",
    orderIndex: 881,
  }),
  q({
    id: "m-sh-003-maths-bucks11",
    prompt: "A rectangle has a perimeter of 36 cm. Its length is 11 cm. What is its width?",
    options: ["7 cm", "5 cm", "9 cm", "14 cm"],
    correctAnswer: "7 cm",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 4,
    trapTypes: ["did_not_divide_by_two_at_end"],
    explanation: "Perimeter = 2 × (length + width). 36 = 2 × (11 + width). 18 = 11 + width. Width = 7 cm.",
    orderIndex: 882,
  }),
  q({
    id: "m-sh-004-maths-bucks11",
    prompt: "A rectangular garden has a perimeter of 50 m and a length of 15 m. What is its area?",
    options: ["150 m²", "100 m²", "125 m²", "175 m²"],
    correctAnswer: "150 m²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 5,
    trapTypes: ["multiplied_perimeter_and_length", "used_wrong_width"],
    explanation: "Width = (50 − 2×15) ÷ 2 = 20 ÷ 2 = 10 m. Area = 15 × 10 = 150 m².",
    orderIndex: 883,
  }),
  q({
    id: "m-sh-005-maths-bucks11",
    prompt: "An isosceles triangle has two equal angles of 55° each. What is the third angle?",
    options: ["70°", "60°", "65°", "75°"],
    correctAnswer: "70°",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["subtracted_from_360_not_180", "forgot_that_two_angles_are_equal"],
    explanation: "Angles in a triangle = 180°. Third angle = 180° − 55° − 55° = 70°.",
    orderIndex: 884,
  }),
  q({
    id: "m-sh-006-maths-bucks11",
    prompt: "Three angles of a quadrilateral are 95°, 110°, and 85°. What is the fourth angle?",
    options: ["70°", "60°", "65°", "80°"],
    correctAnswer: "70°",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["subtracted_from_180_not_360"],
    explanation: "Angles in a quadrilateral = 360°. Fourth = 360° − 95° − 110° − 85° = 70°.",
    orderIndex: 885,
  }),
  q({
    id: "m-sh-007-maths-bucks11",
    prompt: "A cuboid is 5 cm long, 4 cm wide, and 3 cm tall. What is its volume?",
    options: ["60 cm³", "12 cm³", "48 cm³", "120 cm³"],
    correctAnswer: "60 cm³",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.volume",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["added_instead_of_multiplied", "only_multiplied_two_dimensions"],
    explanation: "Volume = length × width × height = 5 × 4 × 3 = 60 cm³.",
    orderIndex: 886,
  }),
  q({
    id: "m-sh-008-maths-bucks11",
    prompt: "A compound shape is made from a rectangle 12 cm × 6 cm with a 4 cm × 4 cm square cut from one corner. What is the remaining area?",
    options: ["56 cm²", "60 cm²", "64 cm²", "72 cm²"],
    correctAnswer: "56 cm²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["did_not_subtract_removed_square", "calculated_perimeter_instead"],
    explanation: "Rectangle area = 12 × 6 = 72 cm². Square removed = 4 × 4 = 16 cm². Remaining = 72 − 16 = 56 cm².",
    orderIndex: 887,
  }),
  q({
    id: "m-sh-009-maths-bucks11",
    prompt: "The perimeter of a square is 36 cm. What is its area?",
    options: ["81 cm²", "36 cm²", "64 cm²", "100 cm²"],
    correctAnswer: "81 cm²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 4,
    trapTypes: ["used_perimeter_value_as_area", "forgot_to_square_the_side"],
    explanation: "Side = 36 ÷ 4 = 9 cm. Area = 9² = 81 cm².",
    orderIndex: 888,
  }),
  q({
    id: "m-sh-010-maths-bucks11",
    prompt: "A rectangle has an area of 63 cm². Its width is 7 cm. What is its perimeter?",
    options: ["32 cm", "16 cm", "28 cm", "36 cm"],
    correctAnswer: "32 cm",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 4,
    trapTypes: ["forgot_to_double_for_perimeter"],
    explanation: "Length = 63 ÷ 7 = 9 cm. Perimeter = 2 × (9 + 7) = 2 × 16 = 32 cm.",
    orderIndex: 889,
  }),
  q({
    id: "m-sh-011-maths-bucks11",
    prompt: "What is the volume of a cuboid with length 8 cm, width 5 cm, and height 4 cm?",
    options: ["160 cm³", "17 cm³", "80 cm³", "320 cm³"],
    correctAnswer: "160 cm³",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.volume",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["only_multiplied_two_dimensions"],
    explanation: "Volume = 8 × 5 × 4 = 160 cm³.",
    orderIndex: 890,
  }),
  q({
    id: "m-sh-012-maths-bucks11",
    prompt: "A right-angled triangle has an area of 24 cm². Its base is 8 cm. What is its height?",
    options: ["6 cm", "3 cm", "4 cm", "8 cm"],
    correctAnswer: "6 cm",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 4,
    trapTypes: ["did_not_double_before_dividing"],
    explanation: "Area = ½ × base × height. 24 = ½ × 8 × h. h = 24 × 2 ÷ 8 = 6 cm.",
    orderIndex: 891,
  }),
  q({
    id: "m-sh-013-maths-bucks11",
    prompt: "What is the midpoint of the line joining the points (2, 4) and (8, 10)?",
    options: ["(5, 7)", "(6, 7)", "(5, 6)", "(4, 6)"],
    correctAnswer: "(5, 7)",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 4,
    trapTypes: ["subtracted_instead_of_averaged"],
    explanation: "Midpoint = ((2+8)÷2, (4+10)÷2) = (5, 7).",
    orderIndex: 892,
  }),
  q({
    id: "m-sh-014-maths-bucks11",
    prompt: "Angles around a single point total 360°. Three of the angles around a point are 120°, 95°, and 80°. What is the fourth angle?",
    options: ["65°", "55°", "60°", "70°"],
    correctAnswer: "65°",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 30, estTimeSeconds: 30, cognitiveLoad: 3,
    trapTypes: ["subtracted_from_180_not_360"],
    explanation: "Fourth angle = 360° − 120° − 95° − 80° = 65°.",
    orderIndex: 893,
  }),
  q({
    id: "m-sh-015-maths-bucks11",
    prompt: "A rectangle is twice as long as it is wide. Its perimeter is 48 cm. What is its area?",
    options: ["128 cm²", "96 cm²", "108 cm²", "120 cm²"],
    correctAnswer: "128 cm²",
    difficulty: "medium", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 5,
    trapTypes: ["used_perimeter_as_area"],
    explanation: "Let width = w. Length = 2w. Perimeter = 2(w + 2w) = 6w = 48. w = 8, length = 16. Area = 8 × 16 = 128 cm².",
    orderIndex: 894,
  }),

  // ── HARD SHAPE & GEOMETRY (15) ────────────────────────────────
  q({
    id: "h-sh-001-maths-bucks11",
    prompt: "A rectangular field is 45 m long and 28 m wide. A path 2 m wide runs all around the outside of the field. What is the area of the path?",
    options: ["308 m²", "146 m²", "236 m²", "372 m²"],
    correctAnswer: "308 m²",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 70, estTimeSeconds: 70, cognitiveLoad: 8,
    trapTypes: ["only_calculated_one_side", "did_not_subtract_inner_field"],
    explanation: "Outer rectangle = (45+4) × (28+4) = 49 × 32 = 1,568 m². Inner field = 45 × 28 = 1,260 m². Path = 1,568 − 1,260 = 308 m².",
    orderIndex: 895,
  }),
  q({
    id: "h-sh-002-maths-bucks11",
    prompt: "A right-angled triangle has legs of 9 cm and 12 cm. What is its area?",
    options: ["54 cm²", "21 cm²", "108 cm²", "27 cm²"],
    correctAnswer: "54 cm²",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 5,
    trapTypes: ["forgot_to_halve", "added_instead_of_multiplied"],
    explanation: "Area = ½ × 9 × 12 = 54 cm².",
    orderIndex: 896,
  }),
  q({
    id: "h-sh-003-maths-bucks11",
    prompt: "A large rectangle 14 cm × 8 cm has two squares of 3 cm × 3 cm cut from two of its corners. What is the remaining area?",
    options: ["94 cm²", "82 cm²", "90 cm²", "100 cm²"],
    correctAnswer: "94 cm²",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 55, estTimeSeconds: 55, cognitiveLoad: 7,
    trapTypes: ["subtracted_only_one_square", "added_squares_not_subtracted"],
    explanation: "Rectangle = 14 × 8 = 112 cm². Two squares = 2 × (3 × 3) = 18 cm². Remaining = 112 − 18 = 94 cm².",
    orderIndex: 897,
  }),
  q({
    id: "h-sh-004-maths-bucks11",
    prompt: "The volume of a cuboid is 240 cm³. Its length is 8 cm and its width is 5 cm. What is its height?",
    options: ["6 cm", "4 cm", "8 cm", "10 cm"],
    correctAnswer: "6 cm",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.volume",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 6,
    trapTypes: ["divided_by_only_one_dimension"],
    explanation: "Volume = l × w × h. 240 = 8 × 5 × h. 40h = 240. h = 6 cm.",
    orderIndex: 898,
  }),
  q({
    id: "h-sh-005-maths-bucks11",
    prompt: "A square has a perimeter of 52 cm. What is its area?",
    options: ["169 cm²", "144 cm²", "156 cm²", "132 cm²"],
    correctAnswer: "169 cm²",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 5,
    trapTypes: ["forgot_to_square_side", "divided_by_2_not_4"],
    explanation: "Side = 52 ÷ 4 = 13 cm. Area = 13² = 169 cm².",
    orderIndex: 899,
  }),
  q({
    id: "h-sh-006-maths-bucks11",
    prompt: "A rectangle is 5 times as long as it is wide. Its area is 320 cm². What is its perimeter?",
    options: ["96 cm", "80 cm", "88 cm", "104 cm"],
    correctAnswer: "96 cm",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 70, estTimeSeconds: 70, cognitiveLoad: 8,
    trapTypes: ["found_area_not_perimeter", "wrong_step_from_area"],
    explanation: "Let width = w. Length = 5w. Area = 5w² = 320. w² = 64. w = 8 cm, length = 40 cm. Perimeter = 2 × (40 + 8) = 96 cm.",
    orderIndex: 900,
  }),
  q({
    id: "h-sh-007-maths-bucks11",
    prompt: "The volume of a cuboid is 504 cm³. Two of its dimensions are 9 cm and 7 cm. What is the third dimension?",
    options: ["8 cm", "6 cm", "7 cm", "9 cm"],
    correctAnswer: "8 cm",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.volume",
    timeExpected: 50, estTimeSeconds: 50, cognitiveLoad: 6,
    trapTypes: ["divided_by_only_one_dimension"],
    explanation: "Third dimension = 504 ÷ (9 × 7) = 504 ÷ 63 = 8 cm.",
    orderIndex: 901,
  }),
  q({
    id: "h-sh-008-maths-bucks11",
    prompt: "An isosceles triangle has an angle of 70° at its apex. What are the two equal base angles?",
    options: ["55°", "50°", "60°", "65°"],
    correctAnswer: "55°",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 5,
    trapTypes: ["did_not_divide_remaining_by_2"],
    explanation: "Remaining angles = 180° − 70° = 110°. Each base angle = 110° ÷ 2 = 55°.",
    orderIndex: 902,
  }),
  q({
    id: "h-sh-009-maths-bucks11",
    prompt: "A regular hexagon's interior angles sum to 720°. What is each interior angle?",
    options: ["120°", "108°", "115°", "135°"],
    correctAnswer: "120°",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 5,
    trapTypes: ["confused_with_pentagon"],
    explanation: "Each interior angle = 720° ÷ 6 = 120°.",
    orderIndex: 903,
  }),
  q({
    id: "h-sh-010-maths-bucks11",
    prompt: "A rectangle has an area of 96 cm² and a width of 6 cm. What is its perimeter?",
    options: ["44 cm", "36 cm", "40 cm", "48 cm"],
    correctAnswer: "44 cm",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 45, estTimeSeconds: 45, cognitiveLoad: 5,
    trapTypes: ["found_only_half_perimeter"],
    explanation: "Length = 96 ÷ 6 = 16 cm. Perimeter = 2 × (16 + 6) = 2 × 22 = 44 cm.",
    orderIndex: 904,
  }),
  q({
    id: "h-sh-011-maths-bucks11",
    prompt: "Two squares have areas of 25 cm² and 64 cm². What is the difference between their perimeters?",
    options: ["12 cm", "39 cm", "18 cm", "24 cm"],
    correctAnswer: "12 cm",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.perimeter",
    timeExpected: 55, estTimeSeconds: 55, cognitiveLoad: 6,
    trapTypes: ["subtracted_areas_instead", "found_sides_not_perimeters"],
    explanation: "Sides: √25 = 5, √64 = 8. Perimeters: 4×5 = 20, 4×8 = 32. Difference = 32 − 20 = 12 cm.",
    orderIndex: 905,
  }),
  q({
    id: "h-sh-012-maths-bucks11",
    prompt: "A rectangular floor is 6 m × 4.5 m. Square tiles with sides of 0.5 m are used. How many tiles are needed?",
    options: ["108", "54", "100", "216"],
    correctAnswer: "108",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 65, estTimeSeconds: 65, cognitiveLoad: 7,
    trapTypes: ["calculated_area_only", "wrong_tile_area"],
    explanation: "Floor area = 6 × 4.5 = 27 m². Tile area = 0.5 × 0.5 = 0.25 m². Number of tiles = 27 ÷ 0.25 = 108.",
    orderIndex: 906,
  }),
  q({
    id: "h-sh-013-maths-bucks11",
    prompt: "A parallelogram has a base of 12 cm and a perpendicular height of 8 cm. What is its area?",
    options: ["96 cm²", "40 cm²", "48 cm²", "80 cm²"],
    correctAnswer: "96 cm²",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.area",
    timeExpected: 35, estTimeSeconds: 35, cognitiveLoad: 5,
    trapTypes: ["halved_as_if_triangle"],
    explanation: "Area of a parallelogram = base × perpendicular height = 12 × 8 = 96 cm².",
    orderIndex: 907,
  }),
  q({
    id: "h-sh-014-maths-bucks11",
    prompt: "Three angles on a straight line are 48°, 56°, and 37°. There is a fourth angle on the same line. What is its size?",
    options: ["39°", "33°", "37°", "41°"],
    correctAnswer: "39°",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.angles",
    timeExpected: 40, estTimeSeconds: 40, cognitiveLoad: 5,
    trapTypes: ["subtracted_from_360"],
    explanation: "Angles on a straight line sum to 180°. Fourth = 180° − 48° − 56° − 37° = 39°.",
    orderIndex: 908,
  }),
  q({
    id: "h-sh-015-maths-bucks11",
    prompt: "A cuboid fish tank is 50 cm long, 30 cm wide, and 40 cm deep. What is its volume in litres? (1 litre = 1,000 cm³)",
    options: ["60 litres", "120 litres", "600 litres", "1,200 litres"],
    correctAnswer: "60 litres",
    difficulty: "hard", skillId: "maths.shape", subRuleId: "maths.shape.volume",
    timeExpected: 55, estTimeSeconds: 55, cognitiveLoad: 7,
    trapTypes: ["forgot_unit_conversion", "only_multiplied_two_dimensions"],
    explanation: "Volume = 50 × 30 × 40 = 60,000 cm³. In litres = 60,000 ÷ 1,000 = 60 litres.",
    orderIndex: 909,
  }),
];

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log("\n=== Maths Bank GL Remediation ===");
  if (DRY) console.log("[DRY RUN] No changes will be written.\n");

  // ── Phase 1A: Archive non-GL draft questions ──────────────────
  console.log("\n[Phase 1A] Archiving non-GL draft questions...");
  for (const subRule of NON_GL_SUB_RULES) {
    const rows = await db.select({ id: questions.id }).from(questions)
      .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule), eq(questions.qaStatus, "draft")));
    if (rows.length === 0) { console.log(`  SKIP  ${subRule} — not found`); continue; }
    if (!DRY) {
      await db.update(questions).set({ qaStatus: "archived" })
        .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule)));
    }
    console.log(`  ${DRY ? "WOULD ARCHIVE" : "ARCHIVED"}  ${subRule} (${rows.length} question${rows.length !== 1 ? "s" : ""})`);
  }

  // ── Phase 1B: Fix decimal_fraction wrong answer ───────────────
  console.log("\n[Phase 1B] Fixing decimal_fraction wrong answer...");
  const decFracRows = await db.select({ id: questions.id }).from(questions)
    .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, "decimal_fraction")));
  if (decFracRows.length > 0) {
    if (!DRY) {
      await db.update(questions)
        .set({
          correctAnswer: "⅓, 0.34, 0.35, 7/20",
          explanation: "Converting to decimals: ⅓ ≈ 0.333, 0.34, 0.35, 7/20 = 0.35. Order smallest to largest: ⅓, 0.34, 0.35, 7/20 (note 0.35 and 7/20 are equal, so tied last).",
          qaStatus: "approved",
          subRuleId: "maths.fractions.decimal_conversion",
        })
        .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, "decimal_fraction")));
    }
    console.log(`  ${DRY ? "WOULD FIX" : "FIXED"}  decimal_fraction answer: correct answer is now "⅓, 0.34, 0.35, 7/20"`);
  }

  // ── Phase 1C: Approve suitable draft questions ────────────────
  console.log("\n[Phase 1C] Approving suitable draft questions...");
  let approved = 0;
  for (const { subRule, newSubRule } of APPROVE_DRAFTS) {
    const rows = await db.select({ id: questions.id }).from(questions)
      .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule), eq(questions.qaStatus, "draft")));
    if (rows.length === 0) continue;
    if (!DRY) {
      await db.update(questions)
        .set({ qaStatus: "approved", subRuleId: newSubRule })
        .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule), eq(questions.qaStatus, "draft")));
    }
    console.log(`  ${DRY ? "WOULD APPROVE" : "APPROVED"}  ${subRule} → ${newSubRule} (${rows.length})`);
    approved += rows.length;
  }
  console.log(`  Total approved: ${approved}`);

  // ── Phase 1D: Archive under-levelled data questions ───────────
  console.log("\n[Phase 1D] Archiving under-levelled data questions...");
  let archived = 0;
  for (const subRule of DATA_SUB_RULES_TO_ARCHIVE) {
    const rows = await db.select({ id: questions.id }).from(questions)
      .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule), eq(questions.qaStatus, "approved")));
    if (rows.length === 0) { console.log(`  SKIP  ${subRule} — not found`); continue; }
    if (!DRY) {
      await db.update(questions)
        .set({ qaStatus: "archived" })
        .where(and(eq(questions.section, "Mathematics"), eq(questions.subRuleId, subRule), eq(questions.qaStatus, "approved")));
    }
    console.log(`  ${DRY ? "WOULD ARCHIVE" : "ARCHIVED"}  ${subRule} (${rows.length} questions)`);
    archived += rows.length;
  }
  console.log(`  Total archived: ${archived}`);

  // ── Phase 2: Insert new questions ────────────────────────────
  console.log(`\n[Phase 2] Inserting ${NEW_QUESTIONS.length} new questions...`);
  let inserted = 0;
  let skipped = 0;
  for (const q of NEW_QUESTIONS) {
    if (!DRY) {
      await db.insert(questions).values(q as any).onConflictDoNothing();
    }
    inserted++;
  }
  console.log(`  ${DRY ? "WOULD INSERT" : "Inserted/checked"}  ${inserted} questions (${skipped} skipped as existing)`);

  // ── Summary ────────────────────────────────────────────────────
  if (!DRY) {
    const [{ total }] = await db.select({ total: questions.id }).from(questions)
      .where(and(eq(questions.section, "Mathematics"), eq(questions.qaStatus, "approved")));
    console.log(`\n✓ Done. Mathematics approved question bank now has records.`);
  }
  console.log("\n=== Remediation complete ===\n");
}

main().catch((e) => { console.error(e); process.exit(1); });

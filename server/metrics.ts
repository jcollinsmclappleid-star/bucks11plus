export interface AnswerRecord {
  questionId: string;
  section: string;
  skillId: string;
  subRuleId: string;
  difficulty: number;
  cognitiveLoad: number;
  isCorrect: boolean;
  timeSeconds: number;
  questionOrder: number;
}

export interface DrillAnswerRecord {
  skillId: string;
  subRuleId: string;
  difficulty: number;
  cognitiveLoad: number;
  isCorrect: boolean;
  timeSeconds: number;
}

export interface HistoricalMetrics {
  rs: number;
  completedAt: string;
}

const DIFFICULTY_WEIGHT: Record<number, number> = {
  1: 0.85, 2: 0.95, 3: 1.00, 4: 1.15, 5: 1.30,
};

const SECTION_BENCHMARK_S: Record<string, number> = {
  'Verbal Reasoning': 35,
  'Non-Verbal Reasoning': 35,
  'Mathematics': 45,
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function difficultyToNumeric(d: string | number): number {
  if (typeof d === 'number') return d;
  const map: Record<string, number> = { easy: 2, medium: 3, hard: 4 };
  return map[d.toLowerCase()] ?? 3;
}

export function computeWAI(answers: AnswerRecord[]): {
  wai: number;
  accEasy: number;
  accMedium: number;
  accHard: number;
} {
  if (answers.length === 0) return { wai: 0, accEasy: 0, accMedium: 0, accHard: 0 };

  let sumWeightedScore = 0;
  let sumWeights = 0;

  const easy: { correct: number; total: number } = { correct: 0, total: 0 };
  const med: { correct: number; total: number } = { correct: 0, total: 0 };
  const hard: { correct: number; total: number } = { correct: 0, total: 0 };

  for (const a of answers) {
    const dw = DIFFICULTY_WEIGHT[a.difficulty] ?? 1.0;
    const lw = clamp(0.85 + (a.cognitiveLoad - 1) * (0.15 / 9), 0.85, 1.0);
    const w = dw * lw;
    const score = a.isCorrect ? 1 : 0;
    sumWeightedScore += score * w;
    sumWeights += w;

    if (a.difficulty <= 2) { easy.total++; if (a.isCorrect) easy.correct++; }
    else if (a.difficulty === 3) { med.total++; if (a.isCorrect) med.correct++; }
    else { hard.total++; if (a.isCorrect) hard.correct++; }
  }

  return {
    wai: sumWeights > 0 ? sumWeightedScore / sumWeights : 0,
    accEasy: easy.total > 0 ? (easy.correct / easy.total) * 100 : 0,
    accMedium: med.total > 0 ? (med.correct / med.total) * 100 : 0,
    accHard: hard.total > 0 ? (hard.correct / hard.total) * 100 : 0,
  };
}

export function computePDI(answers: AnswerRecord[]): {
  pdiOverall: number;
  sections: Record<string, { pdi: number; mtq: number; paceRatio: number; paceSd: number; count: number }>;
} {
  const bySection: Record<string, number[]> = {};
  for (const a of answers) {
    if (!bySection[a.section]) bySection[a.section] = [];
    bySection[a.section].push(a.timeSeconds);
  }

  const sections: Record<string, { pdi: number; mtq: number; paceRatio: number; paceSd: number; count: number }> = {};
  let totalWeightedPDI = 0;
  let totalCount = 0;

  for (const [section, times] of Object.entries(bySection)) {
    const benchmark = SECTION_BENCHMARK_S[section] ?? 35;
    const mtq = mean(times);
    const paceRatio = mtq / benchmark;
    const pdi = clamp(100 - 125 * (paceRatio - 1), 0, 100);
    const paceSd = stddev(times);

    sections[section] = { pdi, mtq: Math.round(mtq * 10) / 10, paceRatio: Math.round(paceRatio * 100) / 100, paceSd: Math.round(paceSd * 10) / 10, count: times.length };
    totalWeightedPDI += pdi * times.length;
    totalCount += times.length;
  }

  return {
    pdiOverall: totalCount > 0 ? Math.round(totalWeightedPDI / totalCount * 10) / 10 : 100,
    sections,
  };
}

export function computeFatigue(answers: AnswerRecord[]): {
  overall: { accDrop: number; paceDrift: number; fatigueFlag: boolean };
  bySectionFlags: Record<string, boolean>;
} {
  function computeForGroup(group: AnswerRecord[]): { accDrop: number; paceDrift: number; fatigueFlag: boolean } {
    if (group.length < 6) return { accDrop: 0, paceDrift: 0, fatigueFlag: false };
    const sorted = [...group].sort((a, b) => a.questionOrder - b.questionOrder);
    const thirdLen = Math.floor(sorted.length / 3);
    const first = sorted.slice(0, thirdLen);
    const last = sorted.slice(-thirdLen);

    const accFirst = first.length > 0 ? (first.filter(a => a.isCorrect).length / first.length) * 100 : 0;
    const accLast = last.length > 0 ? (last.filter(a => a.isCorrect).length / last.length) * 100 : 0;
    const mtqFirst = mean(first.map(a => a.timeSeconds));
    const mtqLast = mean(last.map(a => a.timeSeconds));

    const accDrop = Math.round((accLast - accFirst) * 10) / 10;
    const paceDrift = Math.round((mtqLast - mtqFirst) * 10) / 10;
    const fatigueFlag = accDrop <= -15 || paceDrift >= 6;

    return { accDrop, paceDrift, fatigueFlag };
  }

  const overall = computeForGroup(answers);

  const bySection: Record<string, AnswerRecord[]> = {};
  for (const a of answers) {
    if (!bySection[a.section]) bySection[a.section] = [];
    bySection[a.section].push(a);
  }
  const bySectionFlags: Record<string, boolean> = {};
  for (const [section, group] of Object.entries(bySection)) {
    bySectionFlags[section] = computeForGroup(group).fatigueFlag;
  }

  return { overall, bySectionFlags };
}

export function computeCR(answers: AnswerRecord[]): {
  cr: number;
  crScore: number;
  top5: Array<{
    subRuleId: string;
    errors: number;
    shareOfTotal: number;
    weightedAccuracy: number;
    avgTime: number;
  }>;
} {
  const errors = answers.filter(a => !a.isCorrect);
  if (errors.length === 0) return { cr: 0, crScore: 100, top5: [] };

  const bySubRule: Record<string, { errors: number; correct: number; totalWeight: number; correctWeight: number; times: number[] }> = {};
  for (const a of answers) {
    if (!bySubRule[a.subRuleId]) bySubRule[a.subRuleId] = { errors: 0, correct: 0, totalWeight: 0, correctWeight: 0, times: [] };
    const dw = DIFFICULTY_WEIGHT[a.difficulty] ?? 1.0;
    const lw = clamp(0.85 + (a.cognitiveLoad - 1) * (0.15 / 9), 0.85, 1.0);
    const w = dw * lw;
    bySubRule[a.subRuleId].totalWeight += w;
    if (a.isCorrect) {
      bySubRule[a.subRuleId].correct++;
      bySubRule[a.subRuleId].correctWeight += w;
    } else {
      bySubRule[a.subRuleId].errors++;
    }
    bySubRule[a.subRuleId].times.push(a.timeSeconds);
  }

  const errorsTotal = errors.length;
  let maxShare = 0;
  const entries = Object.entries(bySubRule)
    .filter(([, v]) => v.errors > 0)
    .map(([subRuleId, v]) => {
      const share = v.errors / errorsTotal;
      if (share > maxShare) maxShare = share;
      return {
        subRuleId,
        errors: v.errors,
        shareOfTotal: Math.round(share * 100) / 100,
        weightedAccuracy: v.totalWeight > 0 ? Math.round((v.correctWeight / v.totalWeight) * 100 * 10) / 10 : 0,
        avgTime: Math.round(mean(v.times) * 10) / 10,
      };
    })
    .sort((a, b) => b.errors - a.errors);

  return {
    cr: Math.round(maxShare * 100) / 100,
    crScore: clamp(Math.round(100 - maxShare * 100), 0, 100),
    top5: entries.slice(0, 5),
  };
}

export function computeSI(historicalRS: number[]): {
  si: number;
  forecastConfidence: 'High' | 'Moderate' | 'Emerging';
} {
  const n = historicalRS.length;
  if (n === 0) return { si: 100, forecastConfidence: 'Emerging' };

  const last3 = historicalRS.slice(-3);
  const sd = stddev(last3);
  const si = clamp(Math.round(100 - sd * 12), 0, 100);

  let forecastConfidence: 'High' | 'Moderate' | 'Emerging';
  if (n >= 3 && si >= 70) forecastConfidence = 'High';
  else if (n >= 2) forecastConfidence = 'Moderate';
  else forecastConfidence = 'Emerging';

  return { si, forecastConfidence };
}

export function computeRS(wai: number, pdi: number, si: number, crScore: number, accHard: number): {
  rs: number;
  band: 'Green' | 'Amber' | 'Red';
  bandLabel: string;
} {
  const rs = Math.round((wai * 100) * 0.60 + pdi * 0.25 + si * 0.10 + crScore * 0.05);

  let band: 'Green' | 'Amber' | 'Red';
  let bandLabel: string;

  if (rs >= 75 && pdi >= 70 && accHard >= 40) {
    band = 'Green';
    bandLabel = 'Secure';
  } else if (rs < 60 || pdi < 55 || accHard < 25) {
    band = 'Red';
    bandLabel = 'Development Required';
  } else {
    band = 'Amber';
    bandLabel = 'Borderline';
  }

  return { rs, band, bandLabel };
}

export function computePressureProfile(
  drillAnswers: DrillAnswerRecord[],
  diagnosticAnswers: AnswerRecord[],
): {
  bySkill: Array<{
    skillId: string;
    practiceAcc: number;
    timedAcc: number;
    pressureDelta: number;
    pressureGapFlag: boolean;
  }>;
} {
  if (drillAnswers.length === 0 || diagnosticAnswers.length === 0) return { bySkill: [] };

  const drillBySkill: Record<string, { weightedCorrect: number; totalWeight: number }> = {};
  for (const a of drillAnswers) {
    if (!drillBySkill[a.skillId]) drillBySkill[a.skillId] = { weightedCorrect: 0, totalWeight: 0 };
    const dw = DIFFICULTY_WEIGHT[a.difficulty] ?? 1.0;
    const lw = clamp(0.85 + (a.cognitiveLoad - 1) * (0.15 / 9), 0.85, 1.0);
    const w = dw * lw;
    drillBySkill[a.skillId].totalWeight += w;
    if (a.isCorrect) drillBySkill[a.skillId].weightedCorrect += w;
  }

  const diagBySkill: Record<string, { weightedCorrect: number; totalWeight: number }> = {};
  for (const a of diagnosticAnswers) {
    if (!diagBySkill[a.skillId]) diagBySkill[a.skillId] = { weightedCorrect: 0, totalWeight: 0 };
    const dw = DIFFICULTY_WEIGHT[a.difficulty] ?? 1.0;
    const lw = clamp(0.85 + (a.cognitiveLoad - 1) * (0.15 / 9), 0.85, 1.0);
    const w = dw * lw;
    diagBySkill[a.skillId].totalWeight += w;
    if (a.isCorrect) diagBySkill[a.skillId].weightedCorrect += w;
  }

  const allSkills = new Set([...Object.keys(drillBySkill), ...Object.keys(diagBySkill)]);
  const bySkill: Array<{
    skillId: string;
    practiceAcc: number;
    timedAcc: number;
    pressureDelta: number;
    pressureGapFlag: boolean;
  }> = [];

  for (const skillId of allSkills) {
    const drill = drillBySkill[skillId];
    const diag = diagBySkill[skillId];
    if (!drill || !diag) continue;

    const practiceAcc = drill.totalWeight > 0 ? Math.round((drill.weightedCorrect / drill.totalWeight) * 100 * 10) / 10 : 0;
    const timedAcc = diag.totalWeight > 0 ? Math.round((diag.weightedCorrect / diag.totalWeight) * 100 * 10) / 10 : 0;
    const pressureDelta = Math.round((practiceAcc - timedAcc) * 10) / 10;

    bySkill.push({
      skillId,
      practiceAcc,
      timedAcc,
      pressureDelta,
      pressureGapFlag: pressureDelta >= 15,
    });
  }

  return { bySkill: bySkill.sort((a, b) => b.pressureDelta - a.pressureDelta) };
}

export function computeTrajectory(history: HistoricalMetrics[]): {
  gvRS: number;
  gvPerDay: number;
  trend: 'Improving' | 'Stable' | 'Declining';
  points: Array<{ date: string; rs: number }>;
} {
  if (history.length < 2) {
    return {
      gvRS: 0,
      gvPerDay: 0,
      trend: 'Stable',
      points: history.map(h => ({ date: h.completedAt, rs: h.rs })),
    };
  }

  const sorted = [...history].sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const gvRS = last.rs - first.rs;
  const daysBetween = Math.max(1, (new Date(last.completedAt).getTime() - new Date(first.completedAt).getTime()) / (1000 * 60 * 60 * 24));
  const gvPerDay = Math.round((gvRS / daysBetween) * 100) / 100;

  let trend: 'Improving' | 'Stable' | 'Declining';
  if (gvRS >= 6) trend = 'Improving';
  else if (gvRS <= -6) trend = 'Declining';
  else trend = 'Stable';

  return {
    gvRS,
    gvPerDay,
    trend,
    points: sorted.map(h => ({ date: h.completedAt, rs: h.rs })),
  };
}

interface ConstraintCandidate {
  key: string;
  severity: number;
  explanation: string;
  actionType: string;
}

export function computePrimaryConstraint(
  accHard: number, accEasy: number, pdi: number,
  sectionPDIs: Record<string, { pdi: number; paceRatio: number }>,
  fatigueFlag: boolean,
  cr: number,
  si: number,
  diagnosticCount: number,
): {
  primary: { key: string; explanation: string; actionType: string };
  secondary: Array<{ key: string; explanation: string; actionType: string }>;
} {
  const candidates: ConstraintCandidate[] = [];

  if (accHard < 35 || (accEasy - accHard) >= 35) {
    candidates.push({
      key: 'hard_tier',
      severity: accHard < 25 ? 5 : 4,
      explanation: `Accuracy on harder questions is ${Math.round(accHard)}%, which limits overall readiness.`,
      actionType: 'Start harder practice set',
    });
  }

  if (pdi < 65) {
    candidates.push({
      key: 'pace',
      severity: pdi < 50 ? 5 : 4,
      explanation: `Pace discipline is below target at ${Math.round(pdi)}, suggesting time pressure is affecting performance.`,
      actionType: 'Start timed section block',
    });
  } else {
    for (const [section, data] of Object.entries(sectionPDIs)) {
      if (data.paceRatio > 1.15) {
        candidates.push({
          key: 'pace',
          severity: 3,
          explanation: `Pace in ${section} is slower than benchmark (${Math.round(data.paceRatio * 100)}% of target time).`,
          actionType: 'Start timed section block',
        });
        break;
      }
    }
  }

  if (fatigueFlag) {
    candidates.push({
      key: 'fatigue',
      severity: 3,
      explanation: 'Performance drops noticeably in the later part of the paper, suggesting stamina needs building.',
      actionType: 'Start stamina set (timed)',
    });
  }

  if (cr >= 0.40) {
    candidates.push({
      key: 'concentration',
      severity: 3,
      explanation: `Over ${Math.round(cr * 100)}% of errors come from a single rule type, indicating a specific skill gap.`,
      actionType: 'Start targeted drill (sub-rule)',
    });
  }

  if (si < 60 && diagnosticCount >= 2) {
    candidates.push({
      key: 'volatility',
      severity: 2,
      explanation: 'Performance varies significantly between assessments, making the forecast less reliable.',
      actionType: 'Take another diagnostic',
    });
  }

  candidates.sort((a, b) => b.severity - a.severity);

  const primary = candidates[0] || {
    key: 'none',
    explanation: 'No major constraints identified. Continue with balanced practice.',
    actionType: 'Start balanced practice set',
  };

  const secondary = candidates.slice(1, 3).map(c => ({
    key: c.key,
    explanation: c.explanation,
    actionType: c.actionType,
  }));

  return {
    primary: { key: primary.key, explanation: primary.explanation, actionType: primary.actionType },
    secondary,
  };
}

export function computeImpactPriorities(
  answers: AnswerRecord[],
  currentWAI: number,
  currentPDI: number,
  currentSI: number,
  currentCRScore: number,
  currentAccHard: number,
): Array<{
  subRuleId: string;
  label: string;
  currentAccuracy: number;
  avgTime: number;
  impact10: number;
  recommendedDrill: string;
}> {
  const bySubRule: Record<string, {
    answers: AnswerRecord[];
    correct: number;
    total: number;
    weightedCorrect: number;
    totalWeight: number;
    times: number[];
  }> = {};

  let globalWeightedCorrect = 0;
  let globalTotalWeight = 0;

  for (const a of answers) {
    if (!bySubRule[a.subRuleId]) bySubRule[a.subRuleId] = { answers: [], correct: 0, total: 0, weightedCorrect: 0, totalWeight: 0, times: [] };
    const entry = bySubRule[a.subRuleId];
    entry.answers.push(a);
    entry.total++;
    if (a.isCorrect) entry.correct++;

    const dw = DIFFICULTY_WEIGHT[a.difficulty] ?? 1.0;
    const lw = clamp(0.85 + (a.cognitiveLoad - 1) * (0.15 / 9), 0.85, 1.0);
    const w = dw * lw;
    entry.totalWeight += w;
    if (a.isCorrect) entry.weightedCorrect += w;
    entry.times.push(a.timeSeconds);

    globalTotalWeight += w;
    if (a.isCorrect) globalWeightedCorrect += w;
  }

  const currentRS = Math.round((currentWAI * 100) * 0.60 + currentPDI * 0.25 + currentSI * 0.10 + currentCRScore * 0.05);

  const priorities: Array<{
    subRuleId: string;
    label: string;
    currentAccuracy: number;
    avgTime: number;
    impact10: number;
    recommendedDrill: string;
  }> = [];

  for (const [subRuleId, data] of Object.entries(bySubRule)) {
    if (data.total < 2) continue;
    const currentAcc = data.total > 0 ? data.correct / data.total : 0;
    if (currentAcc >= 0.9) continue;

    const improvedCorrectRate = Math.min(currentAcc + 0.10, 0.90);
    const additionalCorrect = (improvedCorrectRate - currentAcc) * data.total;
    const avgWeight = data.totalWeight / data.total;
    const newGlobalWeightedCorrect = globalWeightedCorrect + additionalCorrect * avgWeight;
    const newWAI = globalTotalWeight > 0 ? newGlobalWeightedCorrect / globalTotalWeight : 0;

    const newRS = Math.round((newWAI * 100) * 0.60 + currentPDI * 0.25 + currentSI * 0.10 + currentCRScore * 0.05);
    const impact10 = newRS - currentRS;

    if (impact10 <= 0) continue;

    const avgDiff = mean(data.answers.map(a => a.difficulty));
    let recommendedDrill: string;
    if (avgDiff >= 4) recommendedDrill = 'Timed hard-difficulty drill';
    else if (avgDiff <= 2) recommendedDrill = 'Untimed easy-to-medium drill';
    else recommendedDrill = 'Timed mixed-difficulty drill';

    const label = subRuleId
      .replace(/\./g, ' > ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    priorities.push({
      subRuleId,
      label,
      currentAccuracy: Math.round(currentAcc * 100),
      avgTime: Math.round(mean(data.times) * 10) / 10,
      impact10,
      recommendedDrill,
    });
  }

  return priorities.sort((a, b) => b.impact10 - a.impact10).slice(0, 3);
}

export interface AttemptMetrics {
  wai: number;
  accEasy: number;
  accMedium: number;
  accHard: number;
  pdiOverall: number;
  pdiSections: Record<string, { pdi: number; mtq: number; paceRatio: number; paceSd: number; count: number }>;
  fatigue: { accDrop: number; paceDrift: number; fatigueFlag: boolean };
  fatigueBySectionFlags: Record<string, boolean>;
  cr: number;
  crScore: number;
  crTop5: Array<{ subRuleId: string; errors: number; shareOfTotal: number; weightedAccuracy: number; avgTime: number }>;
  rs: number;
  band: 'Green' | 'Amber' | 'Red';
  bandLabel: string;
}

export function computeAttemptMetrics(answers: AnswerRecord[], historicalRS: number[]): AttemptMetrics {
  const { wai, accEasy, accMedium, accHard } = computeWAI(answers);
  const { pdiOverall, sections: pdiSections } = computePDI(answers);
  const { overall: fatigue, bySectionFlags: fatigueBySectionFlags } = computeFatigue(answers);
  const { cr, crScore, top5: crTop5 } = computeCR(answers);

  const prelimRS = Math.round((wai * 100) * 0.60 + pdiOverall * 0.25 + 80 * 0.10 + crScore * 0.05);
  const allRS = [...historicalRS, prelimRS];
  const { si } = computeSI(allRS);
  const { rs, band, bandLabel } = computeRS(wai, pdiOverall, si, crScore, accHard);

  return {
    wai: Math.round(wai * 1000) / 1000,
    accEasy: Math.round(accEasy * 10) / 10,
    accMedium: Math.round(accMedium * 10) / 10,
    accHard: Math.round(accHard * 10) / 10,
    pdiOverall: Math.round(pdiOverall * 10) / 10,
    pdiSections,
    fatigue,
    fatigueBySectionFlags,
    cr,
    crScore,
    crTop5,
    rs,
    band,
    bandLabel,
  };
}

export interface FullAnalytics {
  attempt: AttemptMetrics;
  si: number;
  forecastConfidence: 'High' | 'Moderate' | 'Emerging';
  trajectory: { gvRS: number; gvPerDay: number; trend: 'Improving' | 'Stable' | 'Declining'; points: Array<{ date: string; rs: number }> };
  constraint: { primary: { key: string; explanation: string; actionType: string }; secondary: Array<{ key: string; explanation: string; actionType: string }> };
  priorities: Array<{ subRuleId: string; label: string; currentAccuracy: number; avgTime: number; impact10: number; recommendedDrill: string }>;
  pressureProfile: { bySkill: Array<{ skillId: string; practiceAcc: number; timedAcc: number; pressureDelta: number; pressureGapFlag: boolean }> };
  riskFlags: string[];
  executiveSummary: string;
  nextStepCTA: { label: string; action: string };
}

export function computeFullAnalytics(
  latestAnswers: AnswerRecord[],
  historicalMetrics: HistoricalMetrics[],
  drillAnswers: DrillAnswerRecord[],
  allDiagnosticAnswers: AnswerRecord[],
): FullAnalytics {
  const historicalRS = historicalMetrics.map(h => h.rs);
  const attempt = computeAttemptMetrics(latestAnswers, historicalRS);
  const { si, forecastConfidence } = computeSI([...historicalRS, attempt.rs]);
  const trajectory = computeTrajectory([...historicalMetrics, { rs: attempt.rs, completedAt: new Date().toISOString() }]);
  const constraint = computePrimaryConstraint(
    attempt.accHard, attempt.accEasy, attempt.pdiOverall,
    attempt.pdiSections,
    attempt.fatigue.fatigueFlag,
    attempt.cr,
    si,
    historicalMetrics.length + 1,
  );

  const priorities = computeImpactPriorities(
    latestAnswers,
    attempt.wai, attempt.pdiOverall, si, attempt.crScore, attempt.accHard,
  );

  const pressureProfile = computePressureProfile(drillAnswers, allDiagnosticAnswers);

  const riskFlags: string[] = [];
  for (const [section, data] of Object.entries(attempt.pdiSections)) {
    if (data.paceRatio > 1.15) riskFlags.push(`Pace risk in ${section}`);
  }
  if (attempt.fatigue.fatigueFlag) riskFlags.push('Performance drops later in the paper');
  if (attempt.cr >= 0.40 && attempt.crTop5[0]) {
    riskFlags.push(`Errors concentrated in ${attempt.crTop5[0].subRuleId.replace(/_/g, ' ')}`);
  }

  const bandText = attempt.band === 'Green'
    ? 'approaching qualifying-level benchmarks'
    : attempt.band === 'Amber'
    ? 'within reach of qualifying-level benchmarks'
    : 'below qualifying-level benchmarks, with clear areas for development';

  const confText = forecastConfidence === 'High'
    ? 'with high confidence based on consistent diagnostics'
    : forecastConfidence === 'Moderate'
    ? 'with moderate confidence based on repeated diagnostics'
    : 'though confidence is still emerging with limited data';

  const constraintText = constraint.primary.key !== 'none'
    ? ` The primary constraint is ${constraint.primary.explanation.toLowerCase()}`
    : '';

  const actionText = priorities.length > 0
    ? ` Next step: focus on ${priorities[0].label.toLowerCase()} to maximise readiness gains.`
    : ` Next step: ${constraint.primary.actionType.toLowerCase()}.`;

  const executiveSummary = `Current performance is ${bandText}, ${confText}.${constraintText}${actionText}`;

  let nextStepCTA: { label: string; action: string };
  switch (constraint.primary.key) {
    case 'pace': nextStepCTA = { label: 'Start timed section block', action: 'timed_block' }; break;
    case 'hard_tier': nextStepCTA = { label: 'Start harder practice set', action: 'hard_drill' }; break;
    case 'volatility': nextStepCTA = { label: 'Take another diagnostic', action: 'diagnostic' }; break;
    case 'concentration': nextStepCTA = { label: 'Start targeted drill', action: 'targeted_drill' }; break;
    case 'fatigue': nextStepCTA = { label: 'Start stamina set (timed)', action: 'stamina_set' }; break;
    default: nextStepCTA = { label: 'Start balanced practice', action: 'practice' }; break;
  }

  return {
    attempt,
    si,
    forecastConfidence,
    trajectory,
    constraint,
    priorities,
    pressureProfile,
    riskFlags: riskFlags.slice(0, 3),
    executiveSummary,
    nextStepCTA,
  };
}

import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../client/public/bucks-11-plus-parent-guide.pdf");

const NAVY = "#0d1f30";
const SLATE = "#475569";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const RED = "#dc2626";
const LIGHT = "#f1f5f9";

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: "The Buckinghamshire 11+ Parent Guide",
    Author: "11+ Standard",
    Subject: "Understanding the Bucks grammar school test",
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

function heading(text: string, size = 22) {
  doc.font("Helvetica-Bold").fontSize(size).fillColor(NAVY).text(text);
  doc.moveDown(0.5);
}

function subheading(text: string) {
  doc.font("Helvetica-Bold").fontSize(14).fillColor(NAVY).text(text);
  doc.moveDown(0.3);
}

function body(text: string) {
  doc.font("Helvetica").fontSize(10.5).fillColor(SLATE).text(text, { lineGap: 4 });
  doc.moveDown(0.5);
}

function bullet(text: string) {
  doc.font("Helvetica").fontSize(10.5).fillColor(SLATE).text(`  •  ${text}`, { lineGap: 3 });
}

function spacer(n = 1) {
  doc.moveDown(n);
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

// PAGE 1 — Cover
spacer(6);
doc.font("Helvetica-Bold").fontSize(14).fillColor(NAVY).text("11+ Standard", { align: "center" });
spacer(0.5);
doc.font("Helvetica").fontSize(10).fillColor(SLATE).text("bucks11plustest.co.uk", { align: "center" });
spacer(3);
doc.font("Helvetica-Bold").fontSize(30).fillColor(NAVY).text("The Buckinghamshire", { align: "center" });
doc.font("Helvetica-Bold").fontSize(30).fillColor(NAVY).text("11+ Parent Guide", { align: "center" });
spacer(1);
doc.font("Helvetica").fontSize(14).fillColor(SLATE).text("Understanding the grammar school test", { align: "center" });
doc.font("Helvetica").fontSize(14).fillColor(SLATE).text("and how to assess readiness.", { align: "center" });
spacer(8);
doc.font("Helvetica").fontSize(9).fillColor("#94a3b8").text("Free educational resource — not affiliated with The Buckinghamshire Grammar Schools or GL Assessment", { align: "center" });

// PAGE 2
doc.addPage();
heading("How the Bucks Grammar School System Works");
subheading("The Secondary Transfer Test");
body("The Buckinghamshire Secondary Transfer Test (commonly known as the \"Bucks 11+\") is the selective assessment used to determine eligibility for grammar school places in the county. It is administered by The Buckinghamshire Grammar Schools (TBGS) on behalf of all 13 grammar schools.");
body("Children sit the test in September of Year 6. The test is designed to assess reasoning ability across three domains: Verbal Reasoning, Non-Verbal Reasoning, and Mathematics. It is not a test of curriculum knowledge — it measures underlying cognitive and reasoning skills.");
subheading("The 13 Grammar Schools");
body("Buckinghamshire has 13 state-funded grammar schools, making it one of the largest selective education systems in England. Schools are located across the county in Aylesbury, High Wycombe, Amersham, Beaconsfield, Chesham, Marlow, Burnham, Buckingham, and Little Chalfont.");
body("All 13 schools use the same test result for qualification. However, each school has its own oversubscription criteria (typically distance-based) which determines who receives a place when more children qualify than there are places available.");
subheading("The Year 6 Testing Process");
body("Parents register their child during the summer term of Year 5 (May–June). Children then sit the test in September of Year 6 at an allocated test centre. Results arrive in mid-October, and parents submit school preferences on the common application form by 31 October. National Offer Day is 1 March.");

// PAGE 3
doc.addPage();
heading("Understanding the Score of 121");
body("The qualifying score for Buckinghamshire grammar schools is a standardised score of 121. This score has been consistent for many years and represents performance significantly above the national average.");
subheading("How Standardisation Works");
body("Raw test scores are converted to standardised scores using age adjustment. This means that a child who is younger within the cohort (e.g., born in August) receives a slightly higher standardised score than an older child (born in September) who achieved the same raw score. This ensures fair comparison across the year group.");
spacer(0.5);

const tableY = doc.y;
const tableX = 60;
const col1W = 200;
const col2W = 220;
const rowH = 28;

doc.rect(tableX, tableY, col1W + col2W, rowH).fill(NAVY);
doc.font("Helvetica-Bold").fontSize(10).fillColor("white");
doc.text("Score Range", tableX + 10, tableY + 8, { width: col1W });
doc.text("Meaning", tableX + col1W + 10, tableY + 8, { width: col2W });

const rows = [
  ["Below 110", "Below qualifying range", RED],
  ["110 – 120", "Within reach of qualifying", AMBER],
  ["121+", "Qualifying standard", GREEN],
  ["130+", "Comfortably above qualifying", GREEN],
];

rows.forEach((row, i) => {
  const y = tableY + rowH + i * rowH;
  if (i % 2 === 0) doc.rect(tableX, y, col1W + col2W, rowH).fill(LIGHT);
  doc.font("Helvetica").fontSize(10).fillColor(SLATE).text(row[0], tableX + 10, y + 8, { width: col1W });
  doc.font("Helvetica-Bold").fontSize(10).fillColor(row[2] as string).text(row[1], tableX + col1W + 10, y + 8, { width: col2W });
});

doc.y = tableY + rowH + rows.length * rowH + 20;

body("Achieving a score of 121 means the child qualifies for grammar school consideration. It does not guarantee a place — each school's oversubscription criteria then determine allocation when demand exceeds capacity.");

// PAGE 4
doc.addPage();
heading("Admissions Timeline");

const phases = [
  { title: "Year 4 — Awareness", color: SLATE, text: "Begin researching the Buckinghamshire grammar school system. Understand what the test involves and which schools serve your area. No formal preparation is needed at this stage." },
  { title: "Year 5 — Preparation Begins", color: AMBER, text: "Start structured familiarisation with the three test domains: verbal reasoning, non-verbal reasoning, and mathematics. Focus on building foundational reasoning skills and understanding the question formats. Register for the test during the summer term (May–June)." },
  { title: "Year 6 — Test & Applications", color: GREEN, text: "Sit the Secondary Transfer Test in September. Receive results in mid-October. Submit school preferences on the common application form by 31 October. National Offer Day is 1 March." },
];

phases.forEach(phase => {
  const y = doc.y;
  doc.rect(60, y, 4, 60).fill(phase.color);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(NAVY).text(phase.title, 74, y + 2);
  doc.font("Helvetica").fontSize(10).fillColor(SLATE).text(phase.text, 74, y + 20, { width: 420, lineGap: 3 });
  doc.y = y + 75;
});

spacer(1);
subheading("Key Dates Summary");
bullet("May–June Year 5: Registration opens");
bullet("September Year 6: Test date");
bullet("Mid-October Year 6: Results released");
bullet("31 October Year 6: School preference deadline");
bullet("1 March Year 7: National Offer Day");

// PAGE 5
doc.addPage();
heading("The Biggest Preparation Challenge");
body("Many families complete large numbers of practice questions — often hundreds of papers — without knowing whether their child's performance is actually improving in the areas that matter most.");
body("The challenge is not a lack of practice material. It is a lack of measurement. Parents often cannot answer fundamental questions:");
spacer(0.3);
bullet("Is my child's accuracy improving, staying flat, or declining?");
bullet("Which specific reasoning skills are weakest?");
bullet("Is pace a limiting factor, or is it accuracy?");
bullet("Would improving one domain have more impact than another?");
bullet("How far is my child from the 121 qualifying score?");
spacer(0.5);
body("A diagnostic approach — one that measures specific skills, identifies gaps, and tracks progress — provides the clarity that generic practice cannot.");
body("This is the principle behind structured readiness assessment: instead of guessing, families can see exactly where their child stands and what to focus on first.");
spacer(1);
subheading("The Three Pillars of Effective Preparation");
spacer(0.3);
bullet("Reasoning Ability — Building the foundational skills tested in VR, NVR, and Maths");
bullet("Timing Discipline — Developing the pace needed to complete questions within the time limit");
bullet("Consistency — Maintaining stable performance across different question types and conditions");

// PAGE 6 — Readiness Forecast Visual
doc.addPage();
heading("What the Platform Shows You");
body("After completing a 12-minute diagnostic, parents receive a detailed readiness dashboard. Here is what each section looks like:");
spacer(0.3);
subheading("1. Readiness Forecast");

// Draw the gauge
const gaugeX = 130;
const gaugeY = doc.y + 10;
const gaugeR = 55;

// Background circle
doc.circle(gaugeX, gaugeY + gaugeR, gaugeR).lineWidth(14).strokeOpacity(0.1).strokeColor(SLATE).stroke();
doc.strokeOpacity(1);

// Score arc — 118/141 of the circle
const scoreAngle = (118 / 141) * 360;
const startAngle = -90;
const arcPath = describeArc(gaugeX, gaugeY + gaugeR, gaugeR, startAngle, startAngle + scoreAngle);
doc.path(arcPath).lineWidth(14).strokeColor(AMBER).stroke();

// Target marker at 121
const targetAngle = -90 + (121 / 141) * 360;
const tRad = (targetAngle * Math.PI) / 180;
const tx = gaugeX + (gaugeR + 2) * Math.cos(tRad);
const ty = gaugeY + gaugeR + (gaugeR + 2) * Math.sin(tRad);
const tx2 = gaugeX + (gaugeR - 14) * Math.cos(tRad);
const ty2 = gaugeY + gaugeR + (gaugeR - 14) * Math.sin(tRad);
doc.moveTo(tx, ty).lineTo(tx2, ty2).lineWidth(2).strokeColor(NAVY).stroke();

// Score text in centre
doc.font("Helvetica-Bold").fontSize(28).fillColor(NAVY).text("118", gaugeX - 22, gaugeY + gaugeR - 16, { width: 44, align: "center" });
doc.font("Helvetica").fontSize(7).fillColor(SLATE).text("EST. SCORE", gaugeX - 30, gaugeY + gaugeR + 14, { width: 60, align: "center" });

// Band label
doc.font("Helvetica-Bold").fontSize(9).fillColor(AMBER).text("● Confident Amber", gaugeX - 45, gaugeY + gaugeR * 2 + 20, { width: 120, align: "center" });

// Right side — gap bar and priority focus
const infoX = 240;
const infoY = gaugeY + 5;

doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY).text("Gap to 121 Standard", infoX, infoY);
doc.font("Helvetica").fontSize(9).fillColor(AMBER).text("3 points remaining", infoX + 200, infoY + 1);
// Progress bar
doc.rect(infoX, infoY + 18, 280, 10).lineWidth(0.5).fillAndStroke(LIGHT, "#e2e8f0");
doc.rect(infoX, infoY + 18, 280 * (118 / 121), 10).fill(AMBER);

// Priority focus cards
const priorities = [
  { name: "Verbal Reasoning", acc: "62%", impact: "High Impact", color: RED },
  { name: "Non-Verbal Reasoning", acc: "74%", impact: "Medium", color: AMBER },
  { name: "Mathematics", acc: "81%", impact: "On Track", color: GREEN },
];

priorities.forEach((p, i) => {
  const py = infoY + 42 + i * 28;
  doc.rect(infoX, py, 280, 24).lineWidth(0.5).fillAndStroke("white", "#e2e8f0");
  doc.circle(infoX + 10, py + 12, 4).fill(p.color);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text(p.name, infoX + 20, py + 4, { width: 130 });
  doc.font("Helvetica").fontSize(8).fillColor(p.color).text(p.impact, infoX + 20, py + 14, { width: 130 });
  doc.font("Helvetica-Bold").fontSize(12).fillColor(NAVY).text(p.acc, infoX + 230, py + 6, { width: 40, align: "right" });
});

doc.y = gaugeY + gaugeR * 2 + 40;
spacer(0.5);

// Section breakdown bars
subheading("Section Breakdown");
const sections = [
  { name: "Verbal Reasoning", score: 62, status: "Improvement Opportunity", color: RED, bg: "#fee2e2" },
  { name: "Non-Verbal Reasoning", score: 74, status: "Within Reach", color: AMBER, bg: "#fef3c7" },
  { name: "Mathematics", score: 81, status: "On Track", color: GREEN, bg: "#dcfce7" },
];

sections.forEach((s) => {
  const sy = doc.y;
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(NAVY).text(s.name, 60, sy);
  doc.font("Helvetica").fontSize(8).fillColor(s.color).text(s.status, 60, sy + 13);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(NAVY).text(`${s.score}%`, 480, sy + 3, { width: 55, align: "right" });
  doc.rect(60, sy + 26, 475, 8).fill(s.bg);
  doc.rect(60, sy + 26, 475 * (s.score / 100), 8).fill(s.color);
  doc.y = sy + 42;
});

// PAGE 7 — Skill Gap Analysis Visual
doc.addPage();
subheading("2. Skill Gap Analysis");
body("The platform identifies which specific sub-skills will have the greatest impact on the overall forecast:");
spacer(0.3);

// Impact Simulator box
const simY = doc.y;
doc.rect(60, simY, 475, 75).lineWidth(1).fillAndStroke("white", "#e2e8f0");
doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY).text("Impact Simulator", 75, simY + 8);
doc.font("Helvetica").fontSize(9).fillColor(SLATE).text("If Verbal Reasoning improves by +10%:", 75, simY + 24);
// Visual: current → projected
doc.font("Helvetica-Bold").fontSize(14).fillColor(NAVY).text("118", 75, simY + 42);
doc.font("Helvetica").fontSize(12).fillColor(SLATE).text("→", 110, simY + 44);
doc.roundedRect(130, simY + 38, 120, 28, 4).fill("#dcfce7");
doc.font("Helvetica-Bold").fontSize(14).fillColor(GREEN).text("118 – 123", 140, simY + 44);
doc.font("Helvetica").fontSize(8).fillColor(GREEN).text("Above 121 qualifying standard", 265, simY + 48);
doc.y = simY + 85;

// PDI pace cards
subheading("Pace Discipline");
const paceData = [
  { name: "Verbal Reasoning", avg: 38, expected: 30, pdi: 64, delta: "+8s", dColor: RED },
  { name: "Non-Verbal Reasoning", avg: 32, expected: 30, pdi: 78, delta: "+2s", dColor: AMBER },
  { name: "Mathematics", avg: 28, expected: 30, pdi: 88, delta: "-2s", dColor: GREEN },
];

doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text("PDI: 72 / 100", 400, doc.y - 16, { width: 135, align: "right" });

paceData.forEach((p) => {
  const py = doc.y;
  doc.rect(60, py, 475, 22).lineWidth(0.5).fillAndStroke("white", "#e2e8f0");
  doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text(p.name, 70, py + 5, { width: 160 });
  doc.font("Helvetica").fontSize(8).fillColor(SLATE).text(`${p.avg}s / q`, 240, py + 6);
  doc.font("Helvetica").fontSize(8).fillColor(SLATE).text(`expected ${p.expected}s`, 310, py + 6);
  // PDI mini bar
  doc.rect(400, py + 8, 60, 5).fill(LIGHT);
  doc.rect(400, py + 8, 60 * (p.pdi / 100), 5).fill(p.dColor);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(p.dColor).text(p.delta, 470, py + 5, { width: 60, align: "right" });
  doc.y = py + 28;
});
spacer(0.5);

// Sub-skill heatmap
subheading("Sub-Skill Accuracy Map");
const heatmapSkills = [
  { label: "Synonyms", value: 85, domain: "VR" },
  { label: "Antonyms", value: 72, domain: "VR" },
  { label: "Analogies", value: 58, domain: "VR" },
  { label: "Comprehension", value: 66, domain: "VR" },
  { label: "Codes", value: 64, domain: "NVR" },
  { label: "Sequences", value: 78, domain: "NVR" },
  { label: "Patterns", value: 82, domain: "NVR" },
  { label: "Spatial", value: 70, domain: "NVR" },
  { label: "Fractions", value: 76, domain: "Maths" },
  { label: "Ratios", value: 68, domain: "Maths" },
  { label: "Word Probs", value: 55, domain: "Maths" },
  { label: "Num. Patterns", value: 84, domain: "Maths" },
];

const cellW = 112;
const cellH = 38;
const cols = 4;
const heatStartY = doc.y;

heatmapSkills.forEach((cell, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const cx = 60 + col * (cellW + 6);
  const cy = heatStartY + row * (cellH + 5);
  const bg = cell.value >= 80 ? "#dcfce7" : cell.value >= 60 ? "#fef3c7" : "#fee2e2";
  const fg = cell.value >= 80 ? GREEN : cell.value >= 60 ? AMBER : RED;

  doc.roundedRect(cx, cy, cellW, cellH, 4).fill(bg);
  doc.font("Helvetica").fontSize(7.5).fillColor(fg).text(cell.domain, cx + cellW - 28, cy + 4, { width: 24, align: "right" });
  doc.font("Helvetica-Bold").fontSize(8).fillColor(fg).text(cell.label, cx + 6, cy + 4);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(fg).text(`${cell.value}%`, cx + 6, cy + 17);
});

doc.y = heatStartY + Math.ceil(heatmapSkills.length / cols) * (cellH + 5) + 10;

// Fatigue indicator
spacer(0.3);
subheading("Fatigue Analysis");
const fatY = doc.y;
doc.roundedRect(60, fatY, 230, 48, 4).fill("#fee2e2");
doc.font("Helvetica").fontSize(7).fillColor(RED).text("ACCURACY DRIFT", 70, fatY + 6);
doc.font("Helvetica-Bold").fontSize(18).fillColor(RED).text("−12pp", 70, fatY + 18);
doc.font("Helvetica").fontSize(7).fillColor(RED).text("First third → Last third", 70, fatY + 38);

doc.roundedRect(305, fatY, 230, 48, 4).fill("#fef3c7");
doc.font("Helvetica").fontSize(7).fillColor(AMBER).text("PACE DRIFT", 315, fatY + 6);
doc.font("Helvetica-Bold").fontSize(18).fillColor(AMBER).text("+6s", 315, fatY + 18);
doc.font("Helvetica").fontSize(7).fillColor(AMBER).text("Slowing under pressure", 315, fatY + 38);

doc.y = fatY + 60;

// PAGE 8 — Progress Tracking Visual
doc.addPage();
subheading("3. Progress Tracking (Programme tier)");
body("Families on the full programme receive trajectory analysis across multiple assessments:");
spacer(0.3);

// Trajectory chart
const chartX = 100;
const chartY = doc.y + 5;
const chartW = 380;
const chartH = 150;
const minS = 100;
const maxS = 130;
const dataPoints = [
  { label: "Jan", score: 108 },
  { label: "Mar", score: 112 },
  { label: "May", score: 115 },
  { label: "Jul", score: 118 },
];

// Grid lines
[105, 110, 115, 120, 125].forEach(tick => {
  const yy = chartY + chartH - ((tick - minS) / (maxS - minS)) * chartH;
  doc.moveTo(chartX, yy).lineTo(chartX + chartW, yy).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(String(tick), chartX - 30, yy - 4, { width: 25, align: "right" });
});

// 121 target line
const targetLineY = chartY + chartH - ((121 - minS) / (maxS - minS)) * chartH;
doc.moveTo(chartX, targetLineY).lineTo(chartX + chartW, targetLineY).lineWidth(1.5).dash(6, { space: 3 }).strokeColor(NAVY).stroke();
doc.undash();
doc.font("Helvetica-Bold").fontSize(8).fillColor(NAVY).text("121", chartX + chartW + 5, targetLineY - 5);

// Data line and points
const points = dataPoints.map((d, i) => ({
  x: chartX + (i / (dataPoints.length - 1)) * chartW,
  y: chartY + chartH - ((d.score - minS) / (maxS - minS)) * chartH,
  ...d,
}));

// Area fill
doc.save();
doc.moveTo(points[0].x, points[0].y);
points.slice(1).forEach(p => doc.lineTo(p.x, p.y));
doc.lineTo(points[points.length - 1].x, chartY + chartH);
doc.lineTo(points[0].x, chartY + chartH);
doc.closePath();
doc.fillOpacity(0.1).fill(AMBER);
doc.restore();
doc.fillOpacity(1);

// Line
doc.moveTo(points[0].x, points[0].y);
points.slice(1).forEach(p => doc.lineTo(p.x, p.y));
doc.lineWidth(2.5).strokeColor(AMBER).stroke();

// Points and labels
points.forEach(p => {
  doc.circle(p.x, p.y, 5).lineWidth(2.5).fillAndStroke("white", AMBER);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY).text(String(p.score), p.x - 15, p.y - 18, { width: 30, align: "center" });
  doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text(p.label, p.x - 15, chartY + chartH + 8, { width: 30, align: "center" });
});

doc.y = chartY + chartH + 30;
spacer(0.5);

// Stability + Band history
const stY = doc.y;
doc.roundedRect(60, stY, 220, 65, 4).lineWidth(0.5).fillAndStroke("white", "#e2e8f0");
doc.font("Helvetica").fontSize(8).fillColor(SLATE).text("Stability Index", 75, stY + 8);
doc.font("Helvetica-Bold").fontSize(24).fillColor(NAVY).text("74", 75, stY + 22);
doc.font("Helvetica").fontSize(10).fillColor(SLATE).text("/ 100", 105, stY + 30);
doc.rect(75, stY + 50, 190, 6).fill(LIGHT);
doc.rect(75, stY + 50, 190 * 0.74, 6).fill(AMBER);

doc.roundedRect(295, stY, 240, 65, 4).lineWidth(0.5).fillAndStroke("white", "#e2e8f0");
doc.font("Helvetica").fontSize(8).fillColor(SLATE).text("Performance Band History", 310, stY + 8);

const bands = [
  { label: "Jan", color: RED, text: "Red" },
  { label: "Mar", color: AMBER, text: "Amb" },
  { label: "May", color: AMBER, text: "Amb" },
  { label: "Jul", color: AMBER, text: "Amb" },
];
bands.forEach((b, i) => {
  const bx = 310 + i * 42;
  doc.roundedRect(bx, stY + 24, 36, 20, 3).fill(b.color);
  doc.font("Helvetica-Bold").fontSize(8).fillColor("white").text(b.text, bx + 2, stY + 30, { width: 32, align: "center" });
  doc.font("Helvetica").fontSize(7).fillColor(SLATE).text(b.label, bx + 2, stY + 48, { width: 32, align: "center" });
});

doc.y = stY + 80;
body("Improving trend — moved from Red to Amber band across four assessments.");

// PAGE 7
doc.addPage();
spacer(4);
heading("Measure Your Child's Bucks 11+ Readiness", 26);
spacer(1);
doc.font("Helvetica").fontSize(13).fillColor(SLATE).text("Take a free 12-minute diagnostic assessment to see where your child stands against the 121 qualifying score.", { align: "center", lineGap: 5 });
spacer(2);

const boxY = doc.y;
doc.roundedRect(160, boxY, 275, 60, 8).lineWidth(2).stroke(NAVY);
doc.font("Helvetica-Bold").fontSize(15).fillColor(NAVY).text("Start Free Diagnostic", 160, boxY + 14, { width: 275, align: "center" });
doc.font("Helvetica").fontSize(10).fillColor(SLATE).text("bucks11plustest.co.uk/free-diagnostic", 160, boxY + 38, { width: 275, align: "center" });

spacer(6);
doc.font("Helvetica").fontSize(10).fillColor(SLATE).text("bucks11plustest.co.uk", { align: "center" });
spacer(3);
doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text("This guide is an independent educational resource designed to help families understand the Buckinghamshire 11+ system.", { align: "center", lineGap: 3 });
doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text("It is not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual grammar school.", { align: "center" });

doc.end();

stream.on("finish", () => {
  console.log(`PDF generated at ${outputPath}`);
});

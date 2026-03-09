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

// PAGE 6
doc.addPage();
heading("What the Platform Shows You");
body("The 11+ Standard platform provides structured readiness analysis. After completing a 12-minute diagnostic assessment, parents receive detailed insights across three areas:");
spacer(0.5);

subheading("1. Readiness Forecast Dashboard");
body("A readiness gauge shows an estimated standardised score plotted against the 121 qualifying standard. The dashboard includes:");
bullet("Estimated Score — circular gauge showing current predicted score (e.g. 118)");
bullet("Performance Band — colour-coded status: On Track (green), Confident Amber, or Improvement Opportunity (red)");
bullet("Gap to 121 — visual progress bar showing how many points remain to reach the qualifying standard");
bullet("Priority Focus Cards — each domain ranked by impact level (High Impact / Medium / On Track)");
bullet("Section Breakdown — accuracy bars for Verbal Reasoning, Non-Verbal Reasoning, and Mathematics");
spacer(0.5);

const exY = doc.y;
doc.rect(60, exY, 475, 65).lineWidth(1).stroke("#e2e8f0");
doc.rect(60, exY, 475, 22).fill(LIGHT);
doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text("Example Readiness Summary", 75, exY + 6);
doc.font("Helvetica").fontSize(9.5).fillColor(SLATE);
doc.text("Estimated Score: 118   |   Band: Confident Amber   |   Gap to 121: 3 points", 75, exY + 28);
doc.text("VR: 62% (High Impact)   |   NVR: 74% (Medium)   |   Maths: 81% (On Track)", 75, exY + 45);
doc.y = exY + 80;

subheading("2. Skill Gap Analysis");
body("Beyond summary scores, the platform identifies the specific sub-skills that most influence performance:");
bullet("Impact Simulator — shows how a +10% improvement in one area would shift the overall forecast range");
bullet("Pace Discipline Index (PDI) — measures timing control per domain, scored out of 100");
bullet("Sub-Skill Accuracy Map — colour-coded heatmap across 12 sub-skills (Synonyms, Analogies, Patterns, Ratios, etc.)");
bullet("Fatigue Analysis — compares accuracy and pace between the first and last thirds of the test to detect concentration drift");
spacer(0.5);

subheading("3. Progress Tracking (Programme tier)");
body("Families on the full programme receive trajectory analysis over multiple assessments:");
bullet("Readiness Trajectory Chart — line graph showing score progression over time against the 121 target");
bullet("Stability Index — consistency metric scored out of 100, measuring how reliably performance is maintained");
bullet("Performance Band History — visual timeline of band progression (Red → Amber → Amber) showing improvement trends");

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

export interface GlossaryTerm {
  slug: string;
  term: string;
  short: string;
  body: string;
  related?: { label: string; href: string }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "standardised-score",
    term: "Standardised Score (SAS)",
    short: "A score statistically adjusted for paper difficulty and the child's age, where 100 is the cohort average.",
    body: "A standardised score (often abbreviated SAS) is a raw test mark that has been transformed onto a fixed scale so results can be compared fairly across different papers and different age groups. The Buckinghamshire Secondary Transfer Test reports each child's results as a standardised score on a scale where 100 is the average performance of the cohort and 121 is the qualifying threshold. Standardisation involves two adjustments: paper difficulty (so a hard year doesn't penalise children) and age in months (so summer-born children are not disadvantaged against older peers). A score of 121 sits roughly 1.4 standard deviations above the mean, which historically corresponds to about the top 25% of test-takers.",
    related: [
      { label: "Qualifying Score Explained", href: "/bucks-11-plus-qualifying-score" },
      { label: "How Scoring Works", href: "/how-forecast-works" },
    ],
  },
  {
    slug: "qualifying-score",
    term: "Qualifying Score",
    short: "The standardised score (currently 121) a child must reach to be eligible for a Buckinghamshire grammar school place.",
    body: "The qualifying score is the standardised score threshold above which a child is considered to have met the academic standard for entry to a Buckinghamshire grammar school. The Buckinghamshire Moderation Committee sets the qualifying score each year and it has historically been 121. Reaching 121 makes a child eligible to be considered for a grammar school place — it does not guarantee one, because oversubscribed schools then use distance and sibling priority to allocate places among qualifying applicants.",
    related: [{ label: "Qualifying Score (full guide)", href: "/bucks-11-plus-qualifying-score" }],
  },
  {
    slug: "age-standardisation",
    term: "Age Standardisation",
    short: "An adjustment that compensates summer-born children for being younger than their autumn-born peers on test day.",
    body: "Age standardisation is the part of the scoring process that adjusts each child's raw mark according to their age in months on the day of the test. Younger children receive a small upward adjustment and older children receive a smaller adjustment, so that two children of identical underlying ability achieve similar standardised scores regardless of their birth month. The adjustment is applied automatically and is generally worth a few standardised points either side of the cohort mean.",
  },
  {
    slug: "raw-score",
    term: "Raw Score",
    short: "The number of questions a child answered correctly, before any standardisation is applied.",
    body: "A raw score is simply the count of correct answers a child gives on a paper. Buckinghamshire does not publish raw scores to parents — only the final standardised score. Raw scores are not directly comparable from year to year because they don't account for paper difficulty or the child's age, which is why the standardisation step exists. Roughly speaking, achieving a standardised score of 121 typically requires around 80–85% raw accuracy across all four sections.",
  },
  {
    slug: "secondary-transfer-test",
    term: "Secondary Transfer Test (STT)",
    short: "The official name for the Buckinghamshire 11+ — a single test taken in Year 6 covering four GL-style domains.",
    body: "The Secondary Transfer Test, commonly called the 11+, is the assessment administered by Buckinghamshire Council in early September of Year 6 to determine eligibility for the county's 13 grammar schools. The test is produced by GL Assessment and covers Verbal Reasoning, Non-Verbal Reasoning, Mathematics and English Comprehension. Results are released in mid-October, before the national 31 October secondary school application deadline.",
    related: [{ label: "Secondary Transfer Test (full guide)", href: "/buckinghamshire-secondary-transfer-test" }],
  },
  {
    slug: "gl-assessment",
    term: "GL Assessment",
    short: "The exam board that produces the Buckinghamshire 11+ papers.",
    body: "GL Assessment is the publishing arm of GL Education and the exam board that creates the question papers used in the Buckinghamshire Secondary Transfer Test. GL papers are also used by many other grammar school regions across England including Kent, Lincolnshire, Essex (some schools), and parts of London. GL-style questions emphasise multiple-choice answer formats, structured question types, and a tight pace — children typically have around 50 minutes per paper.",
    related: [{ label: "GL Assessment Domains", href: "/bucks-gl-alignment" }],
  },
  {
    slug: "verbal-reasoning",
    term: "Verbal Reasoning (VR)",
    short: "A test domain measuring a child's ability to solve problems involving words, vocabulary and logic.",
    body: "Verbal Reasoning is one of four domains in the Bucks 11+ and tests how well a child can think with language. Typical question types include synonyms, antonyms, analogies, cloze (missing word), shuffled sentences, letter codes, and word-number logic. A strong VR score depends heavily on vocabulary breadth — children who read widely from Year 3 onwards tend to perform well.",
    related: [{ label: "Verbal Reasoning Practice", href: "/11-plus-verbal-reasoning-practice" }],
  },
  {
    slug: "non-verbal-reasoning",
    term: "Non-Verbal Reasoning (NVR)",
    short: "A test domain that uses shapes and patterns rather than words to measure logical thinking.",
    body: "Non-Verbal Reasoning measures a child's ability to recognise patterns, sequences, rotations and spatial relationships using diagrams rather than words. Common NVR question types include odd-one-out, complete-the-series, matrices, rotation/reflection, cube nets, and analogies. NVR is often considered the most 'coachable' section because the question types are limited and recognisable — a child who has practised the formats consistently usually improves quickly.",
    related: [{ label: "Non-Verbal Reasoning Practice", href: "/11-plus-non-verbal-reasoning-practice" }],
  },
  {
    slug: "comprehension",
    term: "English Comprehension",
    short: "A test domain that measures reading understanding through a passage and follow-up questions.",
    body: "The English Comprehension paper presents children with one or more reading passages followed by multiple-choice questions. Questions test literal understanding, inference, vocabulary in context, author intent, and structure. Strong comprehension performance correlates closely with reading volume and exposure to varied sentence structures over several years — it is the hardest domain to improve in the final months before the test.",
    related: [{ label: "Comprehension Practice", href: "/11-plus-comprehension-practice" }],
  },
  {
    slug: "cloze",
    term: "Cloze",
    short: "A question type where a missing word must be selected from options to complete a sentence sensibly.",
    body: "A cloze question presents a sentence with one word removed and asks the child to choose from a small set of options the word that best fits the meaning, grammar and tone. Cloze questions appear in both Verbal Reasoning and Comprehension papers. Strong cloze performance depends on vocabulary depth, sensitivity to context, and a sense of register — knowing which word 'sounds right' in a sentence.",
  },
  {
    slug: "shuffled-sentences",
    term: "Shuffled Sentences",
    short: "A question type where the words of a sentence appear in the wrong order and the child must identify the redundant word.",
    body: "Shuffled sentences (sometimes called jumbled sentences) present the words of a sentence out of order with one extra word that does not belong. The child must mentally reorder the sentence and identify which of the listed words is the one that does not fit. This is one of the most challenging VR question types because it combines syntactic reasoning with vocabulary judgement under tight time pressure.",
  },
  {
    slug: "synonyms-antonyms",
    term: "Synonyms & Antonyms",
    short: "Question types that test vocabulary by asking for words with the same (synonym) or opposite (antonym) meaning.",
    body: "Synonyms and antonyms are paired question types in Verbal Reasoning. Synonyms ask the child to select the option closest in meaning to a target word; antonyms ask for the opposite. Performance depends almost entirely on vocabulary breadth — there is no shortcut. Building a vocabulary of 8,000–12,000 words by the end of Year 5 through wide reading is the most reliable way to improve.",
    related: [{ label: "Vocabulary List", href: "/bucks-11-plus-vocabulary-list" }],
  },
  {
    slug: "analogies",
    term: "Analogies",
    short: "Question types in the form 'A is to B as C is to ?' — testing the ability to identify a shared relationship.",
    body: "Verbal analogies (e.g. 'big is to large as cold is to ?') and non-verbal analogies (where shapes follow the same transformation pattern) test a child's ability to identify the relationship between a pair and apply the same logic to a new pair. Analogy questions appear in both VR and NVR papers and reward a structured, methodical approach: name the relationship in the first pair before scanning the answer options.",
  },
  {
    slug: "matrices",
    term: "Matrices",
    short: "A non-verbal reasoning question type that presents a 2×2, 3×3 or 4×4 grid of shapes with one cell missing.",
    body: "Matrix questions show a grid of related shapes with one cell empty. The child must identify the rules that govern how shapes change across rows and down columns, then choose the option that completes the pattern. Matrices typically combine two or more transformation rules (rotation, colour change, addition/removal of elements) and are among the most complex NVR question types.",
  },
  {
    slug: "rotation-reflection",
    term: "Rotation & Reflection",
    short: "A non-verbal reasoning question type where a shape is rotated or mirrored and the child must select the result.",
    body: "Rotation and reflection questions present a starting shape and ask the child to choose the option that shows the shape after a specific transformation — usually a 90°, 180° or 270° rotation or a mirror reflection across a stated axis. Children who struggle here usually benefit from physical practice with cut-out shapes early on, which builds spatial intuition more quickly than on-screen practice alone.",
  },
  {
    slug: "cube-nets",
    term: "Cube Nets",
    short: "A non-verbal reasoning question type that asks which of several flat 'unfolded' shapes will fold into a given 3D cube.",
    body: "Cube net questions show either a flat net (the unfolded shape) and ask which 3D cube it produces, or vice versa. Children must mentally fold or unfold the shape and track the position of patterns or letters on each face. This is one of the most spatially demanding NVR question types and benefits from physical practice with paper nets in the early weeks of preparation.",
  },
  {
    slug: "catchment",
    term: "Catchment",
    short: "The geographic area from which a school draws most of its pupils — typically defined by distance from the school gate.",
    body: "Buckinghamshire grammar schools do not have official 'catchment areas' in the way many state schools do. Instead, when a school is oversubscribed, places are allocated to qualifying children using priority criteria, the final tiebreaker of which is straight-line distance from the child's home to the school. The 'effective catchment' for popular schools (e.g. Royal Grammar School High Wycombe, Beaconsfield High) is therefore the maximum distance at which a place was offered in the most recent admissions round — typically 2–4 miles for the most oversubscribed schools.",
  },
  {
    slug: "oversubscription",
    term: "Oversubscription Criteria",
    short: "The published rules a school uses to allocate places when more qualifying applicants apply than there are places.",
    body: "When a Buckinghamshire grammar school receives more qualifying applicants (children who scored 121 or above) than it has places, it applies its oversubscription criteria in the order published in its admissions policy. The typical order is: (1) looked-after and previously looked-after children, (2) children with an EHCP naming the school, (3) siblings of current pupils, (4) children of staff in some cases, (5) all remaining qualifying applicants ranked by straight-line distance from home to school.",
  },
  {
    slug: "sibling-priority",
    term: "Sibling Priority",
    short: "A high-ranking oversubscription criterion that gives qualifying children with a sibling already at the school priority for a place.",
    body: "Most Buckinghamshire grammar schools list sibling priority as one of the highest oversubscription criteria — typically third, after looked-after children and EHCP holders. To benefit, the older sibling must still be on roll at the school in September of the year the younger child would join (so a sibling in Year 13 the year before is too old). Sibling priority does not waive the qualifying score — the younger child must still achieve 121.",
  },
  {
    slug: "looked-after-children",
    term: "Looked-After Children (LAC)",
    short: "Children in the care of a local authority — given the highest priority in school admissions.",
    body: "Looked-after children, and children who were previously looked after but are now adopted, subject to a special guardianship order or a child arrangements order, sit at the top of every Buckinghamshire grammar school's oversubscription list. A qualifying looked-after child therefore has effective priority for a place at any school they apply to, ahead of all other qualifying applicants.",
  },
  {
    slug: "ehcp",
    term: "EHCP",
    short: "Education, Health and Care Plan — a legal document specifying support for a child with significant special needs.",
    body: "An Education, Health and Care Plan (EHCP) is a statutory document issued by a local authority for children whose special educational needs cannot be met from a school's normal resources. If an EHCP names a specific Buckinghamshire grammar school as the placement, the school must admit the child — the EHCP placement process operates outside the normal admissions criteria and effectively guarantees a place. EHCPs are rare among grammar school applicants but not unheard of, particularly for children with high cognitive ability alongside specific learning difficulties.",
  },
  {
    slug: "special-arrangements",
    term: "Special Arrangements",
    short: "Adjustments to test conditions (e.g. extra time) for children with diagnosed special educational needs or medical conditions.",
    body: "Special arrangements (sometimes called access arrangements) are adjustments to the standard test conditions to give children with documented needs a fair opportunity. Common arrangements include 25% extra time, a separate room, modified large-print papers, or a reader/scribe. Applications must be submitted at the time of registration and must be supported by evidence from the child's school or an educational psychologist. The Council's panel reviews each application individually.",
    related: [{ label: "Registration & Special Arrangements", href: "/bucks-11-plus-registration" }],
  },
  {
    slug: "supplementary-information-form",
    term: "Supplementary Information Form (SIF)",
    short: "A form some schools require alongside the standard local-authority application to claim faith or specific oversubscription criteria.",
    body: "A Supplementary Information Form (SIF) is an additional form some schools require directly from parents — separate from the Common Application Form submitted to the local authority. SIFs are most common for faith schools and for schools claiming additional oversubscription criteria (e.g. a music aptitude test). Most Buckinghamshire grammar schools do not require a SIF, but parents should always check each preferred school's admissions policy. Missing a SIF deadline can disqualify an otherwise valid application.",
  },
  {
    slug: "common-application-form",
    term: "Common Application Form (CAF)",
    short: "The single online form parents submit to their home local authority listing up to six secondary school preferences.",
    body: "The Common Application Form (CAF) is the official secondary school application that all parents in England must submit to their home local authority by 31 October of Year 6. Parents list up to six preferences in order — Buckinghamshire grammar schools and non-grammar schools can both appear on the same list. Listing a grammar school as a preference is independent of registering for the 11+; both must be done.",
  },
  {
    slug: "national-offer-day",
    term: "National Offer Day",
    short: "1 March — the day every parent in England is told which secondary school has offered their child a place.",
    body: "On National Offer Day (1 March of Year 6), every parent who submitted a Common Application Form receives a single school offer through their home local authority. The offer is the highest preference at which a place was available. If a child has not been offered a place at any preferred school, the local authority offers the nearest school with a vacancy. Parents have a short window after offer day to accept, decline, or join waiting lists for higher preferences.",
  },
  {
    slug: "appeals",
    term: "Appeals",
    short: "The formal process by which parents can challenge the refusal of a school place at an independent appeal panel.",
    body: "If a child is refused a place at a preferred Buckinghamshire grammar school, parents have a legal right to appeal to an independent appeal panel. There are two separate routes: an academic appeal (challenging the qualifying outcome) and an admissions appeal (challenging the allocation of places). Appeals must be lodged by the deadline published in the refusal letter. Statistical success rates vary by school but are typically low — parents should treat an appeal as a meaningful undertaking that requires evidence, not a routine next step.",
    related: [{ label: "Appeals (full guide)", href: "/bucks-11-plus-appeals" }],
  },
  {
    slug: "waiting-list",
    term: "Waiting List",
    short: "A ranked list of qualifying children who were refused a place but would be admitted if a vacancy arises.",
    body: "Each Buckinghamshire grammar school maintains a waiting list of qualifying children who were not offered a place. The list is ranked by the same oversubscription criteria the school used at allocation — distance, sibling priority and so on — not by the order in which parents joined it. A child can be admitted from the waiting list at any point up to (and beyond) the start of Year 7 if a vacancy arises and they are at the top of the list.",
  },
  {
    slug: "in-year-admission",
    term: "In-Year Admission",
    short: "Applying for a school place outside the normal Year 7 admissions round — for example after a house move.",
    body: "An in-year admission is any application for a school place that falls outside the standard Year 7 admissions round (sometimes called normal-point-of-entry). Families moving to Buckinghamshire after the Year 7 entry process, or whose circumstances change mid-school-year, apply directly to the local authority on a separate in-year form. Children applying in-year for a grammar school place must still meet the qualifying standard, which usually means sitting a separate in-year 11+ assessment arranged by the school.",
  },
  {
    slug: "super-selective",
    term: "Super-Selective",
    short: "A grammar school that admits only the very highest-scoring children, often regardless of distance.",
    body: "A super-selective grammar school ranks all qualifying applicants by score and admits the top scorers first, with no distance criterion (or distance applied only to break ties at the cutoff). Buckinghamshire grammar schools are not super-selective — they qualify children at 121 and then allocate primarily on distance. Super-selective schools exist in neighbouring authorities (e.g. parts of Hertfordshire and Essex) and can be applied to in addition to Bucks grammar schools.",
  },
  {
    slug: "tripartite",
    term: "Tripartite System",
    short: "Buckinghamshire's three-stream secondary education model: grammar schools, upper schools, and faith/academy schools.",
    body: "Buckinghamshire is one of a small number of English authorities that has retained a tripartite or 'fully-selective' state secondary system. Children who qualify at 121 are eligible for one of 13 grammar schools; children who do not qualify attend one of the county's upper schools (known by various local names) or faith/academy schools. The system means roughly 30% of Year 7 children in the county attend grammar schools — significantly higher than the national average.",
  },
  {
    slug: "ks2",
    term: "Key Stage 2 (KS2)",
    short: "The four-year stage of primary education from Year 3 to Year 6 — the foundation period for 11+ preparation.",
    body: "Key Stage 2 covers Years 3–6 of primary school in England and ends with the SATs assessments in May of Year 6. The Bucks 11+ is sat in early September of Year 6, which means children take the test before completing the full KS2 curriculum — particularly in Maths, where the test draws heavily on Year 5 content and the early weeks of Year 6.",
  },
  {
    slug: "mock-test",
    term: "Mock Test",
    short: "A timed, full-length practice test designed to simulate the conditions and pressure of the real 11+.",
    body: "A mock test is a complete simulated 11+ taken under timed, exam-like conditions, typically once or twice in the final 8–12 weeks before the real test. The purpose is twofold: to forecast a likely score and, more importantly, to expose the child to the pacing and stamina demands of the actual test. Mock tests are most valuable when the results are reviewed in detail to identify specific weak topics, not simply used as a score-tracking exercise.",
    related: [{ label: "Mock Test (full guide)", href: "/bucks-11-plus-mock-test" }],
  },
  {
    slug: "familiarisation-test",
    term: "Familiarisation Test",
    short: "An official short practice test published by Buckinghamshire to introduce children to the format and timing of the real 11+.",
    body: "The Familiarisation Test is an official short practice paper published by Buckinghamshire Council and made available to all registered families before the real test. It contains sample questions from each domain and is designed primarily to demystify the format — it is not predictive of performance because it is much shorter than the real test. Every registered child should sit it under timed conditions at least once before September.",
    related: [{ label: "Familiarisation Test (full guide)", href: "/bucks-11-plus-familiarisation-test" }],
  },
  {
    slug: "year-9-entry",
    term: "Year 9 Entry",
    short: "A second admissions opportunity at age 13 for entry into some Buckinghamshire grammar schools.",
    body: "Some Buckinghamshire grammar schools (notably Dr Challoner's Grammar School and a small number of others) offer a Year 9 entry route for children who did not qualify at 11+ but have demonstrated strong subsequent academic progress. Year 9 entry typically involves school-set tests in English, Maths and Reasoning plus a school report, and the number of places is small — usually fewer than 10 per school per year. This route does not exist at most schools.",
  },
  {
    slug: "out-of-county",
    term: "Out-of-County Applicant",
    short: "A child who lives outside Buckinghamshire but applies for a place at a Bucks grammar school.",
    body: "Buckinghamshire grammar schools accept applications from children living anywhere — there is no county residency requirement. Families from neighbouring areas (Slough, Hillingdon, South Oxfordshire, Hertfordshire) routinely register their children for the Bucks 11+ and apply for grammar school places. Out-of-county applicants are treated identically to in-county applicants for the qualifying assessment, but distance from the school remains the main allocation tiebreaker — so out-of-county families further than the effective catchment will struggle to secure a place at oversubscribed schools.",
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

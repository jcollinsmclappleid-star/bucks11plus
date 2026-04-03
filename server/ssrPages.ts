import { towns, type TownData } from "../client/src/data/towns";
import { grammarSchools, type GrammarSchoolData } from "../client/src/data/grammar-schools";
import { learnArticles, type LearnArticle, getArticlesByCategory } from "../client/src/data/learn-articles";
import {
  ssrShell, ssrBreadcrumbs, breadcrumbSchema, faqSchema,
  ssrCtaBox, ssrDisclaimer, ssrFaqSection, esc,
} from "./ssrShared";

const BASE_URL = "https://bucks11plustest.co.uk";
const TODAY = "2026-04-01";

// ─── TOWN GUIDES ────────────────────────────────────────────────────────────

export function getTownHtml(slug: string): string | null {
  const town = towns.find(t => t.slug === slug);
  if (!town) return null;

  const crumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: `${town.name} Guide` },
  ];

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">Local Guide</span>
      <h1 class="ssr-h1">Bucks 11 Plus Guide for Parents in ${esc(town.name)}</h1>
      <p class="ssr-intro">${esc(town.intro)}</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Nearby Grammar Schools</h2>
      <div class="ssr-cards">
        ${town.nearbySchools.map(s => `
          <a class="ssr-card" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
            <div class="ssr-card-label">Grammar school</div>
            <div class="ssr-card-title">${esc(s.name)}</div>
          </a>`).join("")}
      </div>

      <h2>Local Context</h2>
      <p>${esc(town.localContext)}</p>

      <h2>Why Starting Early Matters in ${esc(town.name)}</h2>
      <p>${esc(town.whyEarly)}</p>

      <h2>Preparation Advice for ${esc(town.name)} Families</h2>
      <p>${esc(town.preparation)}</p>

      <h2>The Unique Challenge</h2>
      <p>${esc(town.uniqueChallenge)}</p>
    </section>
    ${ssrFaqSection(town.faq)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>More Local Guides</h2>
      <div class="ssr-related-grid">
        ${towns.filter(t => t.slug !== slug).slice(0, 5).map(t => `
          <a class="ssr-card" href="/bucks-11-plus-${esc(t.slug)}">
            <div class="ssr-card-label">Local guide</div>
            <div class="ssr-card-title">${esc(t.name)} →</div>
          </a>`).join("")}
        <a class="ssr-card" href="/buckinghamshire-11-plus-guide">
          <div class="ssr-card-label">Complete guide</div>
          <div class="ssr-card-title">Bucks 11+ Guide →</div>
        </a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    faqSchema(town.faq),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Bucks 11 Plus Guide for Parents in ${town.name}`,
      description: `Guide for families in ${town.name} preparing for the Bucks 11 Plus. Understand the 121 qualifying score, Secondary Transfer Test format, and how to assess your child's readiness.`,
      datePublished: "2025-01-01",
      dateModified: TODAY,
      publisher: { "@type": "Organization", name: "Bucks 11 Plus Tests", url: BASE_URL },
    },
  ];

  return ssrShell({
    title: `Bucks 11 Plus in ${town.name} (2026) – Local Guide & 121 Score Prep | Bucks 11 Plus Tests`,
    description: `Guide for families in ${town.name} preparing for the Bucks 11 Plus. Understand the 121 qualifying score, Secondary Transfer Test format, and how to assess your child's readiness.`,
    canonical: `${BASE_URL}/bucks-11-plus-${town.slug}`,
    schemas,
    body,
  });
}

// ─── GRAMMAR SCHOOL GUIDES ──────────────────────────────────────────────────

export function getGrammarSchoolHtml(slug: string): string | null {
  const school = grammarSchools.find(s => s.slug === slug);
  if (!school) return null;

  const genderLabel = school.gender === "boys" ? "Boys' Grammar School" : school.gender === "girls" ? "Girls' Grammar School" : "Co-educational Grammar School";

  const crumbs = [
    { label: "Grammar Schools", href: "/bucks-grammar-schools" },
    { label: school.shortName },
  ];

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">${esc(genderLabel)} · ${esc(school.town)}</span>
      <h1 class="ssr-h1">${esc(school.name)}: Admissions Guide &amp; 11+ Preparation</h1>
      <p class="ssr-intro">${esc(school.intro)}</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Admissions &amp; Oversubscription Criteria</h2>
      <p>${esc(school.admissionsContext)}</p>

      <h2>Catchment &amp; Location</h2>
      <p>${esc(school.catchmentContext)}</p>

      <h2>Distance Cut-Off</h2>
      <p>${esc(school.distanceContext)}</p>

      <h2>What Makes This School Distinctive</h2>
      <p>${esc(school.uniqueFeatures)}</p>

      <h2>Preparation Advice for Applicants</h2>
      <p>${esc(school.preparationAdvice)}</p>

      <div style="margin:1.5rem 0;padding:1rem 1.25rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
        <p style="font-size:0.85rem;color:#475569;margin:0;">
          <strong>Address:</strong> ${esc(school.address)}<br>
          <a href="${esc(school.website)}" target="_blank" rel="noopener noreferrer" style="color:#0e1f30;">Official school website →</a>
        </p>
      </div>
    </section>
    ${ssrFaqSection(school.faq)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Other Grammar Schools</h2>
      <div class="ssr-related-grid">
        ${grammarSchools.filter(s => s.slug !== slug).slice(0, 4).map(s => `
          <a class="ssr-card" href="/grammar-schools/${esc(s.slug)}">
            <div class="ssr-card-label">${esc(s.town)}</div>
            <div class="ssr-card-title">${esc(s.shortName)} →</div>
          </a>`).join("")}
        <a class="ssr-card" href="/bucks-grammar-schools">
          <div class="ssr-card-label">All schools</div>
          <div class="ssr-card-title">View All Grammar Schools →</div>
        </a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    faqSchema(school.faq),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${school.name}: Admissions Guide & 11+ Preparation`,
      description: school.intro,
      datePublished: "2025-01-01",
      dateModified: TODAY,
      publisher: { "@type": "Organization", name: "Bucks 11 Plus Tests", url: BASE_URL },
    },
  ];

  return ssrShell({
    title: `${school.name}: Admissions, Catchment & 11+ Guide | Bucks 11 Plus Tests`,
    description: `${school.intro} Guide for families in ${school.town} applying to ${school.shortName} — admissions criteria, distance cut-off, and 11+ preparation advice.`,
    canonical: `${BASE_URL}/grammar-schools/${school.slug}`,
    schemas,
    body,
  });
}

// ─── SUBJECT GUIDES ─────────────────────────────────────────────────────────

interface SubjectData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  urlPath: string;
  intro: string;
  questionTypes: { type: string; description: string }[];
  preparationAdvice: string;
  commonMistakes: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}

const SUBJECT_DATA: Record<string, SubjectData> = {
  "verbal-reasoning": {
    title: "Bucks 11+ Verbal Reasoning: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ Verbal Reasoning Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to verbal reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Question types, preparation strategies, and how to improve VR scores before the real test.",
    urlPath: "/11-plus-verbal-reasoning-practice",
    intro: "Verbal reasoning is one of the four core domains of the Buckinghamshire Secondary Transfer Test. It tests a child's ability to understand and use language logically — including word relationships, codes, sequences, and linguistic problem-solving. Strong verbal reasoning is closely tied to reading ability and vocabulary breadth.",
    questionTypes: [
      { type: "Word relationships", description: "Identify synonyms, antonyms, and related words from a set of options" },
      { type: "Letter codes", description: "Decode patterns where letters represent numbers or other letters, and apply the rule to find a missing value" },
      { type: "Word analogies", description: "Complete patterns of the form A is to B as C is to ?" },
      { type: "Odd one out", description: "Identify which word in a group does not belong, based on category or meaning" },
      { type: "Hidden words", description: "Find a word hidden across the boundary of two words in a sentence" },
      { type: "Compound words", description: "Find a word that completes two separate words when added to the end of one and the beginning of another" },
      { type: "Number sequences in VR", description: "Identify the rule governing a number sequence and find the missing value" },
    ],
    preparationAdvice: "Verbal reasoning is closely tied to vocabulary and reading breadth. Children who read widely — fiction, non-fiction, quality newspapers — develop the word knowledge that makes verbal reasoning questions feel accessible rather than alien. In addition to general language development, specific exposure to the question formats used in the Secondary Transfer Test is important — particularly letter codes and compound words, which have a distinctive format that requires familiarisation.",
    commonMistakes: "The most common verbal reasoning error is reading too quickly and missing the precise relationship being tested. Children often choose the first plausible answer rather than checking all options. Another common mistake is unfamiliarity with letter-code question mechanics, which require a specific logical approach that is rarely encountered outside test preparation.",
    sections: [
      { heading: "How Verbal Reasoning Is Tested in the Bucks 11+", body: "Verbal reasoning questions appear throughout the Buckinghamshire Secondary Transfer Test papers. They are presented in multiple-choice format with five answer options. Questions are delivered with audio instructions — a recorded voice tells children when to start each section and when to stop. There is no opportunity to ask questions or have instructions repeated." },
      { heading: "Reading: The Foundation of Verbal Reasoning Performance", body: "More than any other preparation activity, daily reading builds the vocabulary breadth that underpins strong verbal reasoning scores. Children who read widely and encounter language in varied contexts develop a natural familiarity with word relationships that makes analogy and synonym questions easier." },
      { heading: "How to Improve Quickly", body: "For children who are underperforming in verbal reasoning, the fastest improvements come from: (1) systematic practice of the specific question types they are getting wrong, (2) building vocabulary through reading, and (3) learning the 'rules' of format-specific questions like letter codes. A diagnostic assessment that identifies which question types are causing errors allows practice to be focused precisely where it is needed." },
    ],
    faq: [
      { question: "Is verbal reasoning part of the Bucks 11+ test?", answer: "Yes. Verbal reasoning is one of the four domains tested in the Buckinghamshire Secondary Transfer Test. The test, produced by GL Assessment, assesses verbal reasoning, non-verbal reasoning (including spatial), mathematics, and English comprehension." },
      { question: "How do I help my child improve at verbal reasoning?", answer: "The most effective strategies are: encourage regular reading of varied material, work through 11+ verbal reasoning practice questions by type, focus specifically on question types causing errors (letter codes and compound words are common weak spots), and build vocabulary through reading and word games." },
      { question: "What is a letter code question?", answer: "Letter code questions present a pattern where letters represent other letters or numbers, and ask children to apply the same rule to a new example. For example: if ABC = DEF, what does GHI equal? These questions have a distinctive logical format that requires specific familiarisation." },
    ],
  },
  "non-verbal-reasoning": {
    title: "Bucks 11+ Non-Verbal Reasoning & Spatial: Guide & Practice",
    metaTitle: "Bucks 11+ Non-Verbal Reasoning Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to non-verbal and spatial reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Question types, preparation strategies, and how to improve NVR scores.",
    urlPath: "/11-plus-non-verbal-reasoning-practice",
    intro: "Non-verbal reasoning (NVR) and spatial reasoning are combined into a single domain in the Buckinghamshire Secondary Transfer Test. They test a child's ability to work with shapes, patterns, sequences, and spatial relationships — without using words or numbers. NVR is the domain most commonly unfamiliar to children before test preparation begins.",
    questionTypes: [
      { type: "Matrices", description: "Find the missing piece in a 3×3 or 2×2 grid of shapes where each row and column follows a rule" },
      { type: "Sequences", description: "Identify the rule governing a sequence of shapes and choose the next in the series" },
      { type: "Odd one out", description: "Find which shape in a group does not follow the same rule as the others" },
      { type: "Analogies", description: "A is to B as C is to ? — applied to shapes rather than words" },
      { type: "Reflections", description: "Identify the mirror image of a given shape" },
      { type: "Rotations", description: "Identify how a shape looks when rotated by a given amount" },
      { type: "Nets and 3D shapes", description: "Identify which 2D net folds to make a given 3D shape" },
      { type: "Cube views", description: "Identify what a cube looks like from a different angle, given a starting view" },
    ],
    preparationAdvice: "Non-verbal reasoning is the domain where children most commonly show a gap between natural ability and test performance. Because NVR question types are not taught in primary school, even children with strong logical ability may find them unfamiliar at first. This is not a ceiling — it is a training gap. Exposure to NVR question formats typically produces some of the fastest improvement seen in 11+ preparation, as the question types are learnable once a child has seen them.",
    commonMistakes: "The most common NVR errors are: (1) working too slowly on spatial questions and running out of time, (2) not systematically checking the rules before selecting an answer, and (3) rushing on reflection questions and not carefully considering which axis the mirror line is on. For 3D questions, children who have not had physical exposure to building and visualisation often find net questions harder initially.",
    sections: [
      { heading: "Why NVR Is Often the Biggest Gap", body: "Of the four test domains, non-verbal reasoning is the one most children are least prepared for. NVR tests pattern recognition, spatial manipulation, and matrix logic — skills not part of the KS2 curriculum. Children with high natural logical ability may still struggle with the specific question formats simply because they have never encountered them. NVR underperformance often reflects a lack of exposure, not a lack of ability." },
      { heading: "Spatial Reasoning: The Specific Challenge", body: "Spatial reasoning questions — nets, rotations, cube views — require children to mentally manipulate three-dimensional objects. Children who struggle with spatial reasoning often benefit from physical practice: folding paper nets, building shapes from cardboard, and working through spatial puzzles before attempting the test-format versions." },
      { heading: "How to Improve NVR Scores Efficiently", body: "The fastest NVR improvement comes from working through question types systematically. Start with matrices and sequences, as these are the most common. Understand the rule underlying each answer — do not just guess and check. Move to reflections and rotations once the pattern-based questions feel confident. Leave 3D questions until last." },
    ],
    faq: [
      { question: "Does the Bucks 11+ test non-verbal reasoning and spatial reasoning separately?", answer: "The Buckinghamshire Secondary Transfer Test covers non-verbal reasoning and spatial reasoning as part of the same domain. The distinctions between NVR subtypes (matrices, sequences, reflections, rotations, nets) are relevant for preparation — different question types require different skills — but they are marked together as part of the overall score." },
      { question: "My child is strong at maths but weak at NVR — why?", answer: "Mathematical ability and non-verbal reasoning ability are related but not identical. NVR tests spatial and pattern-based thinking specifically, which is a different cognitive skill from arithmetic and algebra. Targeted NVR practice is the solution — this is a training gap, not a ceiling." },
      { question: "What are the best resources for NVR practice?", answer: "GL Assessment-style NVR practice books are widely available and are the most directly relevant materials. Make sure the materials are specifically for the GL Assessment format (not CEM, which is used in other areas). Digital platforms that adapt to performance and identify weak question types by category can be more efficient than paper books alone." },
    ],
  },
  "maths": {
    title: "Bucks 11+ Maths: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ Maths Practice – Secondary Transfer Test Maths Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to mathematical reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Topics covered, common question types, and how to prepare for the maths section.",
    urlPath: "/11-plus-maths-practice",
    intro: "Mathematical reasoning is one of the four core domains of the Buckinghamshire Secondary Transfer Test. The maths questions in the Bucks 11+ go beyond the Year 5 curriculum — they require fluency, multi-step thinking, and the ability to apply mathematical concepts in unfamiliar contexts under timed conditions.",
    questionTypes: [
      { type: "Number operations", description: "Addition, subtraction, multiplication, and division with whole numbers, decimals, and fractions" },
      { type: "Fractions, decimals, percentages", description: "Converting between forms, calculating with FDP, and applying them in context" },
      { type: "Word problems", description: "Multi-step problems requiring children to extract mathematical information from text" },
      { type: "Ratios and proportion", description: "Sharing in a ratio, finding equivalent ratios, and proportional reasoning" },
      { type: "Algebra", description: "Simple algebraic expressions, finding unknown values, and following rules" },
      { type: "Shape and area", description: "Perimeter, area, volume, and properties of 2D and 3D shapes" },
      { type: "Data and graphs", description: "Reading information from charts, tables, and graphs; mean, median, mode" },
      { type: "Time and measures", description: "Converting units, calculating elapsed time, and reasoning about measurement" },
    ],
    preparationAdvice: "Maths preparation for the 11+ differs from school maths preparation in two important ways. First, the topics go beyond what is typically covered in Year 5. Second, questions are presented in multiple-choice format under strict time pressure. This means preparation should focus on both the topic range (breadth of content) and the speed of application (fluency). Times tables must be automatic by the time of the test.",
    commonMistakes: "The most frequent maths errors in the Bucks 11+ are: (1) working too slowly and running out of time, (2) misreading word problems and answering the wrong question, (3) errors in fraction and percentage calculations, and (4) not checking the reasonableness of an answer before selecting it.",
    sections: [
      { heading: "How Maths Is Tested in the Bucks 11+", body: "Mathematical reasoning questions appear across both papers of the Secondary Transfer Test. All questions are multiple choice — there is no working to show, only an answer to select. Audio instructions tell children when to start and stop each section. The pace is demanding: children must work quickly and accurately across a range of topics." },
      { heading: "Topics Beyond the Year 5 Curriculum", body: "The Bucks 11+ maths content extends beyond what most children have covered in Year 5. Topics like ratio and proportion, algebra, and some aspects of data handling are typically introduced in Year 6 or later in the standard curriculum. Children preparing for the test need to build familiarity with these topics before September of Year 6." },
      { heading: "Mental Arithmetic and Calculation Speed", body: "Multiple-choice maths under time pressure rewards mental arithmetic. Times tables must be fully memorised (1–12 times tables without hesitation). Multiplication and division facts should be automatic. Mental strategies for addition and subtraction — bridging, partitioning, rounding — are more useful in the test than column methods." },
    ],
    faq: [
      { question: "Does the Bucks 11+ maths go beyond KS2 curriculum?", answer: "Yes. The mathematical reasoning content in the Buckinghamshire Secondary Transfer Test extends into topics covered in early Year 6 and beyond — including ratio and proportion, simple algebra, and data handling. Children preparing for the test need to cover this extended range, which is one reason why Bucks 11+ preparation materials are more appropriate than general KS2 maths resources alone." },
      { question: "My child is strong at school maths but struggles with the test format — why?", answer: "School maths often emphasises written methods and checking, with marks awarded for working shown. The 11+ test is multiple choice under strict time pressure — no marks for working, no part marks. Children strong at school maths but unfamiliar with the test format often work too carefully, running out of time. Timed practice and mental arithmetic speed are separate skills from school maths competence." },
      { question: "How important are times tables for the 11+ maths section?", answer: "Critically important. Times tables (1–12, fully memorised) underpin fast, reliable mental arithmetic. Any hesitation on times table recall costs time on more complex questions. If times tables are not fully automatic by the start of Year 5 preparation, addressing this first is the highest-return activity." },
    ],
  },
  "comprehension": {
    title: "Bucks 11+ English Comprehension: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ English Comprehension Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to English comprehension in the Buckinghamshire 11+ Secondary Transfer Test. Question types, reading strategies, and how to improve comprehension scores before test day.",
    urlPath: "/11-plus-comprehension-practice",
    intro: "English comprehension is one of the four core domains of the Buckinghamshire Secondary Transfer Test. It tests a child's ability to read a passage carefully and accurately — and to answer questions that probe literal understanding, inference, vocabulary in context, and language use. It is the domain most directly built by strong reading habits.",
    questionTypes: [
      { type: "Literal retrieval", description: "Find information directly stated in the passage" },
      { type: "Inference", description: "Deduce meaning implied by the text but not directly stated" },
      { type: "Vocabulary in context", description: "Identify the meaning of a word or phrase as used in the passage" },
      { type: "Author's purpose and technique", description: "Questions about why the author used a particular word, structure, or approach" },
      { type: "Language and structure", description: "Questions about the effect of specific language choices on the reader" },
      { type: "Summary and main idea", description: "Identify the main theme or central point of a section or the whole passage" },
    ],
    preparationAdvice: "English comprehension is the domain most directly built by reading — specifically, reading varied and challenging material and thinking carefully about what it means. Children who read widely (fiction and non-fiction across different genres) and who discuss what they have read develop the comprehension skills that transfer directly to the test. In addition to general reading, specific practice with Secondary Transfer Test-style comprehension passages is important for familiarity with the question format, answer choices, and time management.",
    commonMistakes: "The most common comprehension errors are: (1) misreading the question and answering what the child thinks the question asked; (2) choosing an answer that sounds right in general rather than one supported by the specific text; (3) inference questions answered based on general knowledge rather than what the passage says; and (4) running out of time and not reaching the later questions.",
    sections: [
      { heading: "How Comprehension Is Tested in the Bucks 11+", body: "Comprehension questions are based on a passage of text included in the test papers. Questions are multiple choice — children must select one answer from five options. Questions vary in difficulty: some retrieve information stated directly in the text, others require inference (reading between the lines), and others probe vocabulary or language technique." },
      { heading: "The Role of Reading in Comprehension Preparation", body: "No preparation activity builds comprehension as effectively as regular, varied reading. Children who read widely — different genres, different levels of difficulty, both fiction and non-fiction — develop the vocabulary, inference ability, and reading fluency that comprehension questions test. Pushing slightly beyond comfort — a slightly more challenging book, a quality newspaper article, a non-fiction topic that is unfamiliar — builds the skills that transfer to test performance." },
      { heading: "Answering From the Text: The Essential Discipline", body: "The most important comprehension discipline is this: every answer must be justified by the text, not by general knowledge or common sense. Many children lose marks by choosing an answer that seems plausible based on general knowledge but is not supported by what the specific passage says. Teaching children to return to the passage and locate evidence for their answer — rather than answering from instinct — is the highest-return comprehension skill to develop." },
    ],
    faq: [
      { question: "How long is the comprehension passage in the Bucks 11+?", answer: "The passage length varies but is typically several hundred words — long enough to require careful, efficient reading. Children should aim to read the passage once attentively, then refer back to it for specific questions rather than trying to memorise every detail." },
      { question: "My child reads a lot but still struggles with comprehension questions — why?", answer: "Reading for pleasure and answering multiple-choice comprehension questions are different skills. Children who read widely for pleasure often have strong comprehension in general, but may struggle with the specific demands of test-format questions: choosing between five similar-seeming options, answering exactly what the question asks, and justifying answers from the text rather than from intuition." },
      { question: "Is comprehension marked separately from verbal reasoning?", answer: "In the scoring, comprehension is part of the overall standardised score. However, for preparation purposes, it is useful to treat comprehension as a separate domain from verbal reasoning, as the skills involved are distinct — comprehension requires reading and inference from continuous text, while verbal reasoning tests language logic through shorter discrete questions." },
    ],
  },
};

export function getSubjectGuideHtml(subject: string): string | null {
  const data = SUBJECT_DATA[subject];
  if (!data) return null;

  const crumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: data.title },
  ];

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">Subject Guide</span>
      <h1 class="ssr-h1">${esc(data.title)}</h1>
      <p class="ssr-intro">${esc(data.intro)}</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Question Types</h2>
      <div class="ssr-qtype-grid">
        ${data.questionTypes.map(q => `<div class="ssr-qtype"><strong>${esc(q.type)}</strong><span>${esc(q.description)}</span></div>`).join("")}
      </div>
      ${data.sections.map(s => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("")}
      <h2>Preparation Advice</h2>
      <p>${esc(data.preparationAdvice)}</p>
      <h2>Common Mistakes to Avoid</h2>
      <p>${esc(data.commonMistakes)}</p>
    </section>
    ${ssrFaqSection(data.faq)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Other Subject Guides</h2>
      <div class="ssr-related-grid">
        ${Object.entries(SUBJECT_DATA).filter(([k]) => k !== subject).map(([k, d]) => `
          <a class="ssr-card" href="${esc(d.urlPath)}">
            <div class="ssr-card-label">Subject guide</div>
            <div class="ssr-card-title">${esc(d.title.split(":")[0])} →</div>
          </a>`).join("")}
        <a class="ssr-card" href="/learn"><div class="ssr-card-label">All guides</div><div class="ssr-card-title">Learning Hub →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    faqSchema(data.faq),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.metaDescription,
      datePublished: "2025-01-01",
      dateModified: TODAY,
      publisher: { "@type": "Organization", name: "Bucks 11 Plus Tests", url: BASE_URL },
    },
  ];

  return ssrShell({
    title: data.metaTitle,
    description: data.metaDescription,
    canonical: `${BASE_URL}${data.urlPath}`,
    schemas,
    body,
  });
}

// ─── YEAR GROUP GUIDES ───────────────────────────────────────────────────────

interface YearGroupData {
  year: number;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
  checklist: string[];
}

const YEAR_DATA: Record<number, YearGroupData> = {
  4: {
    year: 4,
    title: "Preparing for the Bucks 11+ in Year 4",
    metaTitle: "Preparing for the Bucks 11+ in Year 4 – How to Start | Bucks 11 Plus Tests",
    metaDescription: "When and how to start 11+ preparation in Year 4. What Buckinghamshire parents can do now to give their Year 4 child the best foundation for the Secondary Transfer Test.",
    intro: "Year 4 is the earliest point at which most Buckinghamshire families begin thinking seriously about the 11+. The Secondary Transfer Test is still two years away — but the foundations built in Year 4 often shape how well a child is placed when they finally sit in September of Year 6.",
    sections: [
      { heading: "Is Year 4 Too Early to Start?", body: "No — but it is early enough that frantic preparation would be counterproductive. Year 4 is the right time for foundations, not intensive drilling. Children who start by building familiarity with test-style thinking, reading widely, and developing mathematical fluency are better served than those who attempt to complete practice paper after practice paper at age 8 or 9." },
      { heading: "What the Bucks 11+ Tests — and Why Year 4 Matters", body: "The Buckinghamshire Secondary Transfer Test covers four domains: verbal reasoning, non-verbal reasoning (including spatial reasoning), mathematical reasoning, and English comprehension. None of these are explicitly taught in primary school — they require specific familiarisation. Year 4 is when children first encounter the more abstract reasoning and problem-solving skills that underpin strong performance in these areas." },
      { heading: "What to Focus on in Year 4", body: "Reading is the single highest-return activity in Year 4. Strong comprehension and vocabulary skills underpin both the verbal reasoning and English comprehension domains. Encourage varied reading — fiction, non-fiction, quality newspapers. On the mathematics side, number fluency is key: times tables, mental arithmetic, and confidence with fractions all pay dividends later." },
      { heading: "When Should Formal Preparation Begin?", body: "Most Buckinghamshire families begin structured, test-focused preparation in Year 5 — typically in the autumn or spring term. Starting too early with formal practice papers can lead to burnout and boredom; starting at the right time with a clear picture of where to focus is far more effective." },
      { heading: "Understanding the Registration Timeline", body: "Registration for the Secondary Transfer Test opens in the spring term of Year 5 and closes in June of Year 5. If you are planning ahead in Year 4, note this deadline now. Missing it means missing the test — there is very limited provision for late registration." },
    ],
    faq: [
      { question: "Should I buy practice papers for my Year 4 child?", answer: "Not yet, for most children. Year 4 is better spent on broad foundations — reading widely, building number fluency, doing puzzles. Bucks 11+ practice papers are most effectively used in Year 5 once your child is ready to work on timed test conditions." },
      { question: "Should I start tutoring in Year 4?", answer: "Tutoring in Year 4 is not typically necessary unless a specific gap has been identified. Many families use Year 4 to observe their child's progress, then bring in structured support in Year 5 based on a clearer picture of where help is needed." },
      { question: "My child is in Year 4 and already doing practice papers — is that okay?", answer: "If your child is engaged and enjoying them, it is unlikely to cause harm. The risk is familiarity fatigue — children who have completed many practice papers by early Year 5 may find it harder to sustain motivation through the more intensive preparation period." },
    ],
    checklist: [
      "Understand the Bucks 11+ test format (four domains, GL Assessment, 121 qualifying score)",
      "Note the Year 5 registration deadline — typically June",
      "Encourage daily reading of varied material",
      "Ensure times tables are solid by end of Year 4",
      "Explore puzzles, logic games, and pattern recognition activities",
      "Avoid intense practice paper drilling — save that for Year 5",
      "Consider a baseline diagnostic in early Year 5 to establish a clear starting point",
    ],
  },
  5: {
    year: 5,
    title: "Preparing for the Bucks 11+ in Year 5",
    metaTitle: "Preparing for the Bucks 11+ in Year 5 – The Essential Guide | Bucks 11 Plus Tests",
    metaDescription: "Year 5 is the most important preparation year for the Buckinghamshire 11+. Everything parents need to know: when to start, how to structure practice, and what to prioritise.",
    intro: "Year 5 is the central year of Buckinghamshire 11+ preparation. The Secondary Transfer Test is sat in September of Year 6, making Year 5 the primary window for structured, purposeful preparation. The decisions made — and the habits built — during Year 5 have more impact on the final result than anything else.",
    sections: [
      { heading: "Why Year 5 Is the Critical Year", body: "The Buckinghamshire Secondary Transfer Test is sat in September of Year 6 — which is, in practice, just a few weeks after the summer holidays following Year 5. This means that Year 5, including the summer break before Year 6, is the primary preparation window. Families who approach Year 5 with a clear plan and a diagnostic starting point are far better positioned than those who start later or prepare without understanding where their child's specific gaps lie." },
      { heading: "Start With a Diagnostic Assessment", body: "The most effective Year 5 preparation starts not with a workbook or practice paper, but with a diagnostic assessment. Understanding where your child currently performs across the four test domains tells you where to focus your preparation time. A child who is strong in maths but weaker in verbal reasoning needs a very different preparation plan from one who reads widely but struggles with spatial reasoning." },
      { heading: "The Registration Deadline: Do Not Miss It", body: "Registration for the Secondary Transfer Test opens in the spring term of Year 5 and closes in June of Year 5. This is the single most important administrative task in Year 5. Missing the deadline means your child cannot sit the test — and there are very limited provisions for late registration." },
      { heading: "Structuring Year 5 Preparation", body: "Effective Year 5 preparation typically follows a staged approach. In the autumn and spring terms, the focus should be on identifying gaps and building skills: working through domain-specific practice, addressing weak areas, and developing familiarity with the question types. In the summer term and through the summer holidays, the focus shifts to full mock papers under timed conditions." },
      { heading: "The Audio Format: Often Overlooked", body: "One of the most distinctive features of the test is that all instructions are delivered via audio recording. A recorded voice tells children when to start each section, how many questions it contains, and when to stop. The voice will not repeat itself, will not pause, and cannot be asked questions. Practising with audio-led mock tests in Year 5 is strongly recommended." },
      { heading: "How Much Preparation Is Enough?", body: "Most families who support their children through structured preparation allocate 2–4 sessions per week of 30–45 minutes each during term time, with more intensive sessions in the summer holidays. Quality and focus matter more than total hours — a 30-minute session on a specific weakness is more valuable than an hour of generalised practice." },
    ],
    faq: [
      { question: "My child is in Year 5 and hasn't started preparing yet — is it too late?", answer: "No. Many children begin structured preparation in the spring term of Year 5, or even in the summer term, and achieve strong results. What matters is the quality and targeting of the preparation. Starting with a diagnostic assessment tells you immediately where to focus." },
      { question: "Should we use a tutor, practice papers, or an online platform?", answer: "Many families use a combination. Online diagnostic platforms establish a clear baseline and identify specific gaps; tutors can then focus their sessions on precisely those areas. Practice papers under timed conditions are important in the final months before the test." },
      { question: "What score does my child need to pass?", answer: "The qualifying threshold is a standardised score of 121. This score is age-adjusted — it accounts for your child's exact date of birth. Achieving 121 qualifies a child for grammar school consideration; the score does not determine which school they attend." },
      { question: "How important is the summer holiday before Year 6?", answer: "Very important. The test is sat in the first weeks of September — just after the summer holidays. Most families maintain 3–5 practice sessions per week throughout the summer, focusing on mock papers under timed conditions. Keeping preparation consistent through the summer is one of the most reliable ways to enter the test in good form." },
    ],
    checklist: [
      "Register for the Secondary Transfer Test before the June deadline",
      "Complete a diagnostic assessment to establish a starting point",
      "Identify the 1–2 domains that need the most work",
      "Build a consistent weekly practice routine (2–4 short sessions)",
      "Introduce timed practice papers in the spring/summer term",
      "Practice with audio-format mock tests before Year 6",
      "Maintain preparation through the summer holidays",
      "Research and visit grammar schools — open evenings are typically in Year 5",
    ],
  },
  6: {
    year: 6,
    title: "Preparing for the Bucks 11+ in Year 6",
    metaTitle: "Preparing for the Bucks 11+ in Year 6 – Final Preparation Guide | Bucks 11 Plus Tests",
    metaDescription: "The Bucks 11+ is sat in September of Year 6. Everything families need to do in the final weeks before the Secondary Transfer Test, from timed mock practice to test day logistics.",
    intro: "By Year 6, the Buckinghamshire Secondary Transfer Test is imminent. The test is sat in September — within the first few weeks of the school year. Year 6 preparation is therefore almost entirely about the summer holidays: maintaining sharpness, completing timed mock papers, and building confidence for test day.",
    sections: [
      { heading: "The Test Is in September: What That Means for Year 6", body: "The Secondary Transfer Test is sat in September of Year 6, which is just weeks after the summer holidays begin. By the time a child starts Year 6, the test is effectively already upon them. This means the serious preparation work for Year 6 children is almost entirely in the summer between Year 5 and Year 6." },
      { heading: "The Summer Before Year 6: What to Do", body: "The summer holidays are the final and most intensive period of preparation. Most families target 3–5 practice sessions per week, focusing primarily on timed full mock papers. By this stage, domain-specific skill-building should largely be complete — the summer is for consolidation, timing discipline, and confidence." },
      { heading: "Timed Practice Is Now the Priority", body: "The most important preparation in the weeks before the test is completing practice papers under strict timed conditions. This means: two separate 45-minute sittings, no pausing, no help with individual questions, answers on a separate answer sheet. Children who have only done untimed or partially timed practice often struggle with the pace discipline required on test day." },
      { heading: "The Audio Format — Practise This Specifically", body: "The Buckinghamshire Secondary Transfer Test uses audio instructions — a recorded voice that directs children through each section. This voice cannot be paused or repeated. Children should practise with audio-format tests specifically, not just paper-based ones. The combination of a ticking clock and a recorded voice can cause unexpected panic on test day if children haven't experienced it before." },
      { heading: "Test Day Logistics", body: "The test is sat at the child's own primary school in most cases. Children should arrive well-rested and having eaten a normal breakfast. The test has two papers, each 45 minutes. Children will need a pencil and an eraser; everything else is provided. Avoid last-minute cramming the evening before." },
      { heading: "After the Test: Results and What Happens Next", body: "Results are released in October of Year 6. Children receive a qualified or not qualified result. Qualified children then submit their school preferences on the Secondary Common Application Form (SCAF) by the October/November deadline. Place offers come on National Offer Day in March. Qualifying does not guarantee a place — oversubscription criteria (primarily distance) determine which qualified children receive offers." },
    ],
    faq: [
      { question: "My child is in Year 6 and hasn't done any preparation — is there still time?", answer: "If the test is weeks away, the window is very short. Focus entirely on getting familiar with the test format, completing a few timed practice sessions, and ensuring your child knows what to expect on test day. Any preparation at this stage should be calm and focused, not intensive." },
      { question: "What score does my child need to pass?", answer: "The qualifying threshold is 121 on the standardised score. This is age-adjusted for each child's birthday within the Year 6 cohort. Above 121 is qualified; below is not. Results in October show qualified or not qualified — the specific numerical score is not shared at the initial results stage." },
      { question: "What should my child eat and do the morning of the test?", answer: "A normal, familiar breakfast is best — nothing new or heavy. Avoid sugary foods that cause energy crashes mid-morning. Make sure your child is hydrated and has slept well the night before. Arrive at school on time and calmly. The most important message is that they have prepared and their job is simply to do their best." },
      { question: "When will we know the result?", answer: "Results are released in October of Year 6, typically around three to four weeks after the test date. The result is qualified or not qualified. Qualified children then apply to grammar schools through the SCAF by the October/November deadline. Place offers come through in March on National Offer Day." },
    ],
    checklist: [
      "Maintain 3–5 practice sessions per week through the summer holidays",
      "Complete full timed mock papers (two 45-minute sittings)",
      "Practice specifically with audio-format tests",
      "Focus on timing strategies if pace is still an issue",
      "Prepare test day logistics: pencils, eraser, familiar breakfast, early night",
      "Submit school preferences on the SCAF by the October/November deadline",
      "After results in October: check the score and plan next steps",
    ],
  },
};

export function getYearGroupGuideHtml(year: number): string | null {
  const data = YEAR_DATA[year];
  if (!data) return null;

  const crumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: data.title },
  ];

  const otherYears = [4, 5, 6].filter(y => y !== year);

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">Year ${year} Guide</span>
      <h1 class="ssr-h1">${esc(data.title)}</h1>
      <p class="ssr-intro">${esc(data.intro)}</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      ${data.sections.map(s => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("")}
    </section>
    <div class="ssr-checklist">
      <h2>Year ${year} Checklist</h2>
      <ul>${data.checklist.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
    </div>
    ${ssrFaqSection(data.faq)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Other Year Group Guides</h2>
      <div class="ssr-related-grid">
        ${otherYears.map(y => `<a class="ssr-card" href="/preparing-for-11-plus-year-${y}"><div class="ssr-card-label">Preparation guide</div><div class="ssr-card-title">Year ${y} Guide →</div></a>`).join("")}
        <a class="ssr-card" href="/buckinghamshire-11-plus-guide"><div class="ssr-card-label">Complete guide</div><div class="ssr-card-title">Bucks 11+ Guide →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    faqSchema(data.faq),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.metaDescription,
      datePublished: "2025-01-01",
      dateModified: TODAY,
      publisher: { "@type": "Organization", name: "Bucks 11 Plus Tests", url: BASE_URL },
    },
  ];

  return ssrShell({
    title: data.metaTitle,
    description: data.metaDescription,
    canonical: `${BASE_URL}/preparing-for-11-plus-year-${year}`,
    schemas,
    body,
  });
}

// ─── LEARN ARTICLES ─────────────────────────────────────────────────────────

export function getLearnHubHtml(): string {
  const categories = Array.from(new Set(learnArticles.map(a => a.category)));

  const crumbs = [{ label: "Learning Hub" }];

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">30 Guides</span>
      <h1 class="ssr-h1">Bucks 11+ Learning Hub</h1>
      <p class="ssr-intro">Thirty comprehensive guides covering every aspect of Buckinghamshire 11+ preparation — from understanding the test to grammar school admissions and test-day strategy.</p>
    </div>
    ${ssrCtaBox()}
    ${categories.map(cat => {
      const articles = learnArticles.filter(a => a.category === cat);
      return `<section class="ssr-section">
        <h2>${esc(cat)}</h2>
        <div class="ssr-cards">
          ${articles.map(a => `<a class="ssr-card" href="/learn/${esc(a.slug)}">
            <div class="ssr-card-label">${esc(a.category)}</div>
            <div class="ssr-card-title">${esc(a.title)}</div>
            <p style="font-size:0.78rem;color:#64748b;margin-top:0.3rem;line-height:1.5;">${esc(a.description.substring(0, 100))}…</p>
          </a>`).join("")}
        </div>
      </section>`;
    }).join("")}
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Bucks 11+ Learning Hub",
      description: "Comprehensive guides for the Buckinghamshire Secondary Transfer Test",
      itemListElement: learnArticles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `${BASE_URL}/learn/${a.slug}`,
      })),
    },
  ];

  return ssrShell({
    title: "Bucks 11+ Learning Hub – 30 Guides for Parents | Bucks 11 Plus Tests",
    description: "Thirty comprehensive guides covering every aspect of the Buckinghamshire 11+ Secondary Transfer Test — understanding the test, grammar schools, preparation strategy, and test-day advice.",
    canonical: `${BASE_URL}/learn`,
    schemas,
    body,
  });
}

export function getLearnArticleHtml(slug: string): string | null {
  const article = learnArticles.find(a => a.slug === slug);
  if (!article) return null;

  const related = learnArticles
    .filter(a => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  const crumbs = [
    { label: "Learning Hub", href: "/learn" },
    { label: article.title },
  ];

  const body = `
    ${ssrBreadcrumbs(crumbs)}
    <div class="ssr-hero">
      <span class="ssr-tag">${esc(article.category)}</span>
      <h1 class="ssr-h1">${esc(article.title)}</h1>
      <p class="ssr-intro">${esc(article.description)}</p>
    </div>
    ${ssrCtaBox()}
    <article class="ssr-section" style="
      line-height:1.75;
    ">
      <style>
        .ssr-article-body h1 { display:none; }
        .ssr-article-body h2 { font-family:'Libre Baskerville',serif; font-size:1.15rem; font-weight:700; color:#0e1f30; margin:2.25rem 0 0.6rem; }
        .ssr-article-body h3 { font-size:0.95rem; font-weight:600; color:#1e293b; margin:1.5rem 0 0.4rem; }
        .ssr-article-body p { color:#475569; line-height:1.75; margin-bottom:1rem; }
        .ssr-article-body ul, .ssr-article-body ol { padding-left:1.25rem; margin-bottom:1rem; }
        .ssr-article-body li { color:#475569; line-height:1.65; margin-bottom:0.3rem; }
        .ssr-article-body strong { color:#1e293b; }
        .ssr-article-body .keytakeaways { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:1rem 1.25rem; margin:1.5rem 0; }
        .ssr-article-body .keytakeaways ul { list-style:none; padding:0; }
        .ssr-article-body .keytakeaways li { color:#166534; font-size:0.875rem; padding:0.2rem 0 0.2rem 1.25rem; position:relative; }
        .ssr-article-body .keytakeaways li::before { content:"✓"; position:absolute; left:0; color:#16a34a; }
        .ssr-article-body .faq h2 { margin-top:2rem; }
        .ssr-article-body .faq h3 { font-size:0.9rem; font-weight:600; color:#0e1f30; }
        .ssr-article-body .faq p { font-size:0.875rem; }
      </style>
      <div class="ssr-article-body">${article.content}</div>
    </article>
    ${related.length > 0 ? `<section class="ssr-related">
      <h2>Related Articles</h2>
      <div class="ssr-related-grid">
        ${related.map(r => `<a class="ssr-card" href="/learn/${esc(r.slug)}">
          <div class="ssr-card-label">${esc(r.category)}</div>
          <div class="ssr-card-title">${esc(r.title)}</div>
        </a>`).join("")}
        <a class="ssr-card" href="/learn"><div class="ssr-card-label">All guides</div><div class="ssr-card-title">Back to Learning Hub →</div></a>
      </div>
    </section>` : ""}
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: `${BASE_URL}/learn/${article.slug}`,
      datePublished: "2025-01-01",
      dateModified: TODAY,
      publisher: {
        "@type": "Organization",
        name: "Bucks 11 Plus Tests",
        url: BASE_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/learn/${article.slug}`,
      },
    },
  ];

  return ssrShell({
    title: `${article.title} | Bucks 11 Plus Tests`,
    description: article.description,
    canonical: `${BASE_URL}/learn/${article.slug}`,
    schemas,
    body,
  });
}

// Export helpers for routes
export { towns, grammarSchools };

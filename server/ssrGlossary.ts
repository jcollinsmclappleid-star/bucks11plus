import { ssrShell, ssrBreadcrumbs, breadcrumbSchema, faqSchema, ssrCtaBox, ssrDisclaimer, ssrFaqSection, esc } from "./ssrShared";

export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDef: string;
  definition: string;
  relatedTerms: string[];
  faq?: { question: string; answer: string }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "standardised-score",
    term: "Standardised Score",
    shortDef: "An age-adjusted score that allows fair comparison between children of different ages in the same year group.",
    definition: "A standardised score converts a raw test score (total number of correct answers) into a normalised figure that accounts for the child's exact age on the day of the test. In the Buckinghamshire 11+, GL Assessment uses age standardisation so that a child born in August — the youngest possible in their year group — is not disadvantaged compared to a child born in September. A standardised score of 100 represents exactly average performance for age. The qualifying threshold is 121, which is approximately the top 15–20% of the cohort.",
    relatedTerms: ["qualifying-score", "gl-assessment", "age-standardisation", "raw-score"],
    faq: [
      { question: "What does a standardised score of 121 mean?", answer: "A standardised score of 121 means the child scored in approximately the top 15–20% of the national cohort for their age group. It is the minimum score needed to qualify for grammar school consideration in Buckinghamshire." },
      { question: "Is a higher standardised score better?", answer: "A higher standardised score reflects stronger performance relative to age-matched peers. However, once a child has qualified at 121, the score itself does not affect which grammar school place they receive — admission to oversubscribed schools is determined by oversubscription criteria (primarily distance), not by score." },
    ],
  },
  {
    slug: "qualifying-score",
    term: "Qualifying Score (121)",
    shortDef: "The minimum standardised score of 121 required for grammar school eligibility in Buckinghamshire.",
    definition: "The qualifying score is the standardised score threshold a child must meet or exceed to be considered eligible for grammar school places in Buckinghamshire. The threshold is 121 on GL Assessment's standardised scale, where 100 represents exactly average for age. A child who achieves 121 or above is deemed to have met the grammar school standard. Qualifying does not guarantee a place — it makes the child eligible to be considered. Places at oversubscribed schools are then allocated by distance. The qualifying threshold is set by The Buckinghamshire Grammar Schools (TBGS) consortium and is reviewed periodically.",
    relatedTerms: ["standardised-score", "secondary-transfer-test", "oversubscription-criteria", "tbgs"],
    faq: [
      { question: "Has the qualifying score always been 121?", answer: "The threshold has been 121 in recent years, but it is set by The Buckinghamshire Grammar Schools consortium and can change. Always verify the current threshold directly with Buckinghamshire Council or TBGS." },
      { question: "What if my child scores exactly 121?", answer: "A score of exactly 121 qualifies a child for grammar school consideration. There is no borderline zone or additional hurdle — 121 means qualified. However, at oversubscribed schools, all qualified children then compete for places based on distance, so qualifying does not guarantee a place." },
    ],
  },
  {
    slug: "secondary-transfer-test",
    term: "Secondary Transfer Test",
    shortDef: "The Buckinghamshire 11+ entrance exam, produced by GL Assessment, sat by Year 6 children in September.",
    definition: "The Buckinghamshire Secondary Transfer Test — commonly called the Bucks 11+ — is the selective entrance examination that determines grammar school eligibility for all 13 state grammar schools in Buckinghamshire. It is produced by GL Assessment and consists of two 45-minute papers covering verbal reasoning, non-verbal reasoning (including spatial), mathematical reasoning, and English comprehension. All instructions are delivered via audio recording. The test is sat in September of Year 6, approximately 12 months before secondary school begins. Registration closes in June of Year 5.",
    relatedTerms: ["gl-assessment", "verbal-reasoning", "non-verbal-reasoning", "mathematical-reasoning", "english-comprehension", "qualifying-score"],
    faq: [
      { question: "Where is the test sat?", answer: "In-county Buckinghamshire children typically sit the test at their own primary school. The school arranges this automatically once children are registered. Out-of-county and independent school children sit the test at an allocated test centre." },
      { question: "How long is the Secondary Transfer Test?", answer: "The test consists of two papers, each 45 minutes long, sat on the same day. Children have a short break between papers. The total sitting time is approximately 1 hour 30 minutes, not counting breaks and instructions." },
    ],
  },
  {
    slug: "gl-assessment",
    term: "GL Assessment",
    shortDef: "The educational assessment company that produces the Buckinghamshire Secondary Transfer Test.",
    definition: "GL Assessment (formerly Granada Learning Assessment) is the UK's leading provider of standardised educational assessments. They produce the Buckinghamshire Secondary Transfer Test and the testing materials used by several other grammar school areas including Kent, Lincolnshire, and Northern Ireland. GL Assessment's 11+ tests use a specific question format — multiple choice with five answer options — and deliver instructions via audio recording. The questions cover verbal reasoning, non-verbal reasoning (including spatial), mathematical reasoning, and English comprehension. GL Assessment's format differs from CEM (Centre for Evaluation and Monitoring, based at Durham University), which is used by other grammar school areas.",
    relatedTerms: ["secondary-transfer-test", "verbal-reasoning", "non-verbal-reasoning", "cem"],
    faq: [
      { question: "What is the difference between GL Assessment and CEM?", answer: "GL Assessment and CEM are the two main 11+ test providers in England. Buckinghamshire uses GL Assessment. CEM is used by other areas such as parts of the West Midlands and some schools in London. The question styles, formats, and preparation materials differ — GL Assessment materials are specifically needed for the Bucks 11+." },
    ],
  },
  {
    slug: "verbal-reasoning",
    term: "Verbal Reasoning",
    shortDef: "One of the four domains of the Bucks 11+, testing language logic through word relationships, codes, and analogies.",
    definition: "Verbal reasoning (VR) tests a child's ability to understand and logically manipulate language. In the Buckinghamshire Secondary Transfer Test, VR question types include word analogies, letter codes, odd-one-out (words), compound words, hidden words, synonym/antonym relationships, and number sequences presented in a verbal context. Unlike reading comprehension, verbal reasoning focuses on logical pattern recognition with words and letters rather than understanding a continuous passage. VR performance is closely tied to vocabulary breadth and reading habits.",
    relatedTerms: ["secondary-transfer-test", "non-verbal-reasoning", "english-comprehension", "mathematical-reasoning"],
    faq: [
      { question: "How can I improve my child's verbal reasoning score?", answer: "The most effective strategies are: encourage daily reading of varied material (builds vocabulary naturally), work through 11+ VR question types systematically (especially letter codes and compound words, which are unfamiliar to most children), and use a readiness check to identify which specific question types need the most attention." },
    ],
  },
  {
    slug: "non-verbal-reasoning",
    term: "Non-Verbal Reasoning (NVR)",
    shortDef: "The domain testing pattern recognition, spatial awareness, and logical thinking using shapes rather than words.",
    definition: "Non-verbal reasoning (NVR) tests logical thinking through shapes, patterns, and spatial relationships — without using words or numbers. In the Buckinghamshire Secondary Transfer Test, NVR is combined with spatial reasoning and includes question types such as matrices (completing a grid of shapes), sequences (identifying the next shape in a series), reflections, rotations, shape analogies, nets (which 2D net folds into a given 3D shape), and cube views. NVR is the domain most children are least prepared for at the start of 11+ work, because it is not taught in school — but it is highly responsive to structured practice.",
    relatedTerms: ["verbal-reasoning", "secondary-transfer-test", "spatial-reasoning"],
    faq: [
      { question: "Why is NVR often the weakest area?", answer: "NVR question types are not part of the primary school curriculum. Even children with strong logical ability may find the specific formats unfamiliar. This is a training gap, not a ceiling — targeted NVR practice typically produces some of the fastest score improvements in 11+ preparation." },
    ],
  },
  {
    slug: "mathematical-reasoning",
    term: "Mathematical Reasoning",
    shortDef: "The maths domain of the Bucks 11+, covering KS2 and early KS3 topics under timed, multiple-choice conditions.",
    definition: "Mathematical reasoning in the Buckinghamshire Secondary Transfer Test covers topics from the KS2 curriculum and beyond — including content typically introduced in Year 6 and early Year 7. Topics include: number operations, fractions and decimals, percentages, ratio and proportion, simple algebra, word problems, shape and area, data interpretation, and measures. All questions are multiple choice. The pace is demanding — children must work quickly and accurately without the benefit of method marks or partial credit. Mental arithmetic fluency is as important as content knowledge.",
    relatedTerms: ["secondary-transfer-test", "verbal-reasoning", "english-comprehension"],
    faq: [
      { question: "Are times tables important for the maths section?", answer: "Critically important. Times tables (1–12, fully memorised without hesitation) underpin fast mental arithmetic across all question types. Any hesitation on times table recall costs time on more complex questions. Securing full times table knowledge before starting other maths preparation is the highest-return starting point." },
    ],
  },
  {
    slug: "english-comprehension",
    term: "English Comprehension",
    shortDef: "The reading and inference domain of the Bucks 11+, based on a passage with multiple-choice questions.",
    definition: "English comprehension in the Buckinghamshire Secondary Transfer Test is based on a passage of text (typically several hundred words, literary or non-fiction) with multiple-choice questions requiring children to demonstrate literal understanding, inference, vocabulary in context, and understanding of author technique. All answers must be justified by the text — general knowledge is not a substitute for textual evidence. This domain is most directly developed through regular reading of varied and challenging material.",
    relatedTerms: ["verbal-reasoning", "secondary-transfer-test"],
    faq: [
      { question: "My child reads widely but still struggles with comprehension questions — why?", answer: "Test-format comprehension requires specific skills: choosing between five similar-seeming options, answering exactly what is asked (not what seems to be asked), and always justifying answers from the specific text rather than from general knowledge. These skills are distinct from general reading enjoyment and improve with specific practice on past-paper comprehension questions." },
    ],
  },
  {
    slug: "age-standardisation",
    term: "Age Standardisation",
    shortDef: "The statistical adjustment applied to raw scores to account for a child's exact age, ensuring fairness across the year group.",
    definition: "Age standardisation converts a child's raw score (total correct answers) to a standardised score that accounts for their exact date of birth. A child born in August is the youngest possible in their Year 6 cohort — they will typically have had significantly less life experience and development time than a September-born child. Without standardisation, younger children would be systematically disadvantaged. GL Assessment's formula adjusts raw scores upward for younger children and downward for older children, so that the standardised score reflects ability relative to age peers rather than absolute performance. A score of 100 is always 'average for age' regardless of birthday.",
    relatedTerms: ["standardised-score", "gl-assessment", "qualifying-score"],
    faq: [
      { question: "Does being born in August affect the 11+ result?", answer: "Age standardisation is designed to remove this disadvantage. An August-born child who answers the same number of questions correctly as a September-born child will receive a higher standardised score. The system is specifically designed to level the playing field across the year group. In practice, August-born children do still tend to slightly underperform on average in selective assessments, but the standardisation significantly reduces this gap." },
    ],
  },
  {
    slug: "oversubscription-criteria",
    term: "Oversubscription Criteria",
    shortDef: "The rules used to allocate grammar school places when more children qualify than places are available.",
    definition: "Oversubscription criteria are the rules each school uses to decide which qualifying children receive places when a school receives more applications than it has available places. All Buckinghamshire grammar schools use the same basic priority order: (1) looked-after children and previously looked-after children, (2) children with siblings currently at the school, (3) children living closest to the school by straight-line distance. Qualifying at 121 is the prerequisite — without a qualifying score, a child cannot be considered at all. But once qualified, distance is almost always the deciding factor. The exact distance cut-off varies year to year depending on the number of qualifying applicants.",
    relatedTerms: ["qualifying-score", "distance-criterion", "scaf", "tbgs"],
    faq: [
      { question: "Does a higher 11+ score improve grammar school admission chances?", answer: "No. Once a child has qualified at 121, their exact score does not affect which place they receive. A child with 135 and a child with 121 are equal in the admissions process. Distance is the determining factor at oversubscribed schools — not score level." },
    ],
  },
  {
    slug: "distance-criterion",
    term: "Distance Criterion",
    shortDef: "The straight-line distance from a child's home to the school, used as the final tiebreaker in grammar school admissions.",
    definition: "Distance from home to school is the primary tiebreaker used by all Buckinghamshire grammar schools to allocate places among qualifying applicants. Distance is measured in a straight line (as the crow flies) from the child's registered home address to the school's main entrance gate. Children living closer to the school have priority over those living further away, once the higher-priority criteria (looked-after children, siblings) have been applied. The distance cut-off varies year to year — it depends on how many qualifying children live near the school. Buckinghamshire Council publishes the final distance at which the last non-sibling place was offered each year.",
    relatedTerms: ["oversubscription-criteria", "qualifying-score", "scaf"],
    faq: [
      { question: "How is straight-line distance measured?", answer: "Buckinghamshire Council uses a Geographic Information System (GIS) to measure the straight-line distance from the child's home address to the school's main entrance. This is not walking distance or driving distance — it is the shortest theoretical distance between two points. Families cannot calculate this themselves with sufficient precision; the Council's system is the authoritative measurement." },
    ],
  },
  {
    slug: "tbgs",
    term: "TBGS (The Buckinghamshire Grammar Schools)",
    shortDef: "The consortium of all 13 state grammar schools in Buckinghamshire that jointly administers the Secondary Transfer Test.",
    definition: "The Buckinghamshire Grammar Schools (TBGS) is the consortium of all 13 state-funded grammar schools in Buckinghamshire. TBGS collectively administers the Secondary Transfer Test, sets the qualifying threshold (in partnership with Buckinghamshire Council and GL Assessment), and coordinates the admissions process. The TBGS website (www.thebucksgrammarschools.org) is the authoritative source for test dates, registration procedures, results, and school-specific admissions information. All families preparing for the Bucks 11+ should consult the TBGS website directly for the most current official information.",
    relatedTerms: ["secondary-transfer-test", "qualifying-score", "scaf", "oversubscription-criteria"],
    faq: [
      { question: "Where can I find official information about the Bucks 11+?", answer: "The authoritative sources are: The Buckinghamshire Grammar Schools website (thebucksgrammarschools.org), Buckinghamshire Council's admissions pages, and the individual grammar school websites. These sources publish the official registration dates, test format details, and results information each year." },
    ],
  },
  {
    slug: "scaf",
    term: "SCAF (Secondary Common Application Form)",
    shortDef: "The form submitted by parents to apply for Year 7 school places after the 11+ result is known.",
    definition: "The Secondary Common Application Form (SCAF) is the official form that parents in Buckinghamshire use to apply for Year 7 secondary school places. It is submitted after 11+ results are received in October of Year 6. On the SCAF, parents can list up to three grammar school preferences (for qualifying children) alongside comprehensive school preferences. The deadline for submitting the SCAF is typically in October or November of Year 6. Place offers are then made on National Offer Day in March of Year 7 start year. It is critical not to miss the SCAF deadline — late applications are processed after all on-time applications.",
    relatedTerms: ["national-offer-day", "oversubscription-criteria", "tbgs"],
    faq: [
      { question: "Can I list all 13 grammar schools on the SCAF?", answer: "The SCAF allows up to three grammar school preferences. Most families list the schools closest to their home, as distance is the deciding factor at oversubscribed schools. Listing a school that is very far from home is unlikely to result in a place offer unless the family lives unusually far from all grammar schools." },
    ],
  },
  {
    slug: "national-offer-day",
    term: "National Offer Day",
    shortDef: "The date in March when Year 7 secondary school place offers are released to families across England.",
    definition: "National Offer Day (also called National Secondary Offer Day) is the date in March when all Year 7 secondary school place offers are released to families across England simultaneously. For Buckinghamshire grammar school applicants, this is when they discover whether they have received an offer at one of their listed grammar school preferences. The date is set nationally — typically the first of March, or the next working day. Offers are received via email and online account, or by letter. Families must accept or decline the offer by a specified deadline, usually within a few weeks.",
    relatedTerms: ["scaf", "oversubscription-criteria"],
    faq: [
      { question: "What happens if we don't receive a grammar school place offer?", answer: "If no grammar school place is offered, the child will receive an offer at their highest-priority comprehensive school preference. Families can also go on a grammar school waiting list for their preferred schools — children who decline places create vacancies throughout the spring and summer. Some grammar school places are offered from waiting lists as late as the start of term." },
    ],
  },
  {
    slug: "raw-score",
    term: "Raw Score",
    shortDef: "The total number of correct answers across both papers of the Secondary Transfer Test, before age standardisation.",
    definition: "The raw score is simply the total number of correct answers a child achieves across both papers of the Buckinghamshire Secondary Transfer Test. There is no negative marking — incorrect answers and blank answers both score zero. The raw score is then converted by GL Assessment into a standardised score using age standardisation, which accounts for the child's exact date of birth. The raw score itself is not disclosed to parents — only the standardised score and the qualifying/not qualifying result are communicated. As a rough guide, children who answer approximately 75–85% of questions correctly tend to score in or near the qualifying range, but this varies with paper difficulty and the child's age.",
    relatedTerms: ["standardised-score", "age-standardisation", "qualifying-score"],
    faq: [
      { question: "How many questions are in the Bucks 11+?", answer: "The exact number varies by year, but the test typically contains around 130–140 questions across both 45-minute papers. GL Assessment does not publish the exact question count for each year's papers." },
    ],
  },
  {
    slug: "looked-after-child",
    term: "Looked-After Child (LAC)",
    shortDef: "A child in the care of a local authority — given highest admissions priority at all grammar schools.",
    definition: "A looked-after child (LAC) is a child who is in the care of a local authority in England, or who was previously in local authority care and has since been adopted, or has become subject to a child arrangements order or special guardianship order. Under the School Admissions Code, all schools — including grammar schools — must give highest admissions priority to looked-after children and previously looked-after children. In Buckinghamshire grammar school admissions, this priority applies ahead of siblings and distance. Qualifying at 121 is still required for a looked-after child to be eligible for a grammar school place.",
    relatedTerms: ["oversubscription-criteria", "qualifying-score"],
    faq: [],
  },
  {
    slug: "open-evening",
    term: "Open Evening / Open Day",
    shortDef: "An event held by grammar schools where prospective families can visit, ask questions, and learn about the school.",
    definition: "Open evenings (or open mornings/days) are events held by grammar schools each year — typically in the autumn and spring terms of Year 5 — to allow prospective families to see the school, meet staff, and ask questions about admissions. Attending open evenings is strongly encouraged. They help families understand each school's ethos, facilities, co-curricular activities, and oversubscription criteria. This information is important when deciding which schools to list on the Secondary Common Application Form. Grammar schools typically publicise their open evening dates on their websites from September each year.",
    relatedTerms: ["scaf", "tbgs", "oversubscription-criteria"],
    faq: [],
  },
  {
    slug: "practice-papers",
    term: "Practice Papers",
    shortDef: "Published past or specimen test papers used by children to practise the 11+ format under realistic conditions.",
    definition: "Practice papers are published test booklets — either past examination papers (if released) or specimen papers designed to replicate the format and difficulty of the actual 11+ test. For the Buckinghamshire 11+, the relevant practice papers are GL Assessment-format papers covering all four domains. GL Assessment itself publishes a small number of official familiarisation materials, and a wider range of GL-style practice material is available from established UK education publishers — some of which include standardised score conversion tables. Timed practice on these papers — under conditions as close to the real test as possible — is an essential component of Year 5 and summer-before-Year-6 preparation. Practice papers should be used in the later stages of preparation, after domain-specific skills have been built.",
    relatedTerms: ["secondary-transfer-test", "gl-assessment", "diagnostic-assessment"],
    faq: [
      { question: "When should we start using practice papers?", answer: "Most families begin timed full mock papers in the spring or summer term of Year 5, after spending the earlier part of Year 5 building skills by domain. Starting with practice papers too early — before skills are developed — can be demoralising and less effective than targeted domain practice." },
    ],
  },
  {
    slug: "diagnostic-assessment",
    term: "Readiness Check",
    shortDef: "An assessment designed to identify specific strengths and weaknesses across the four 11+ domains, to focus preparation.",
    definition: "A readiness check is a structured test designed not just to produce a score, but to identify specific areas of strength and weakness across the four 11+ domains: verbal reasoning, non-verbal reasoning, mathematical reasoning, and English comprehension. A good readiness check breaks results down to sub-domain level — for example, showing that a child is strong at maths number questions but weak at word problems, or strong at NVR matrices but weak at spatial rotation questions. This level of detail allows preparation to be focused precisely where it is most needed, making the preparation window far more efficient than general blanket practice.",
    relatedTerms: ["verbal-reasoning", "non-verbal-reasoning", "mathematical-reasoning", "english-comprehension", "standardised-score"],
    faq: [
      { question: "When should my child take a readiness check?", answer: "The most useful time for a readiness check is at the start of Year 5 preparation — before intensive practice begins. This establishes a baseline and immediately shows which areas need the most work. A second readiness check after a period of preparation confirms whether gaps have closed and whether the preparation focus should shift." },
    ],
  },
  {
    slug: "audio-instructions",
    term: "Audio Instructions",
    shortDef: "The recorded voice that directs children through the Secondary Transfer Test — a distinctive feature many children find surprising.",
    definition: "One of the most distinctive features of the Buckinghamshire Secondary Transfer Test is that all instructions are delivered via audio recording, not by an invigilator. A recorded voice tells children when to start each section, how many questions it contains, and when to stop. The voice cannot be paused, cannot be asked to repeat itself, and cannot answer questions. Children who experience this format for the first time on test day often find it unexpectedly pressuring — the inability to ask for clarification, combined with the absolute start/stop commands, creates a different kind of time pressure than children encounter in regular school tests. Practising specifically with audio-format mock tests before the real test is strongly recommended.",
    relatedTerms: ["secondary-transfer-test", "practice-papers"],
    faq: [
      { question: "How can my child practise with audio instructions?", answer: "Bucks 11 Plus Tests offers audio-format mock tests that replicate the recorded voice experience. Some print publishers also produce audio practice packs. Any timed mock test should ideally be run with audio instructions so children experience the format before test day." },
    ],
  },
  {
    slug: "spatial-reasoning",
    term: "Spatial Reasoning",
    shortDef: "The ability to mentally manipulate and reason about shapes and objects in space — tested within the NVR domain.",
    definition: "Spatial reasoning is the ability to visualise, manipulate, and reason about shapes and objects in two and three dimensions. In the Buckinghamshire Secondary Transfer Test, spatial reasoning questions appear within the non-verbal reasoning domain and include: reflections (identifying a mirror image), rotations (identifying a shape after it has been rotated), net questions (which 2D net folds to make a given 3D shape), and cube views (identifying what a cube looks like from a different angle). Spatial reasoning is closely linked to experience with physical construction, building, drawing, and spatial problem-solving. Children who have had less exposure to these activities can improve significantly with targeted practice.",
    relatedTerms: ["non-verbal-reasoning", "secondary-transfer-test"],
    faq: [],
  },
  {
    slug: "catchment-area",
    term: "Catchment Area",
    shortDef: "The informal geographic area from which a school tends to draw most of its pupils, based on historic distance cut-offs.",
    definition: "Grammar schools in Buckinghamshire do not have official fixed catchment areas — any child in England who qualifies can apply. However, because places at oversubscribed schools are allocated by distance, there is in practice an informal 'catchment' based on how far the last non-sibling place was offered in previous years. Buckinghamshire Council publishes the distance at which the last place was offered for each school each year. This historic data gives families a realistic picture of whether their home address is likely to be within range. This figure can vary significantly year to year depending on how many qualifying applicants apply to each school.",
    relatedTerms: ["oversubscription-criteria", "distance-criterion", "tbgs"],
    faq: [],
  },
];

const BASE_URL = "https://bucks11plustest.co.uk";

export function getGlossaryIndexHtml(): string {
  const body = `
    ${ssrBreadcrumbs([{ label: "11+ Glossary" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Reference Guide</span>
      <h1 class="ssr-h1">Bucks 11+ Glossary: Key Terms Explained</h1>
      <p class="ssr-intro">Every term, acronym, and concept you will encounter when preparing for the Buckinghamshire Secondary Transfer Test — clearly explained for parents.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>All Terms (A–Z)</h2>
      <div class="ssr-cards">
        ${GLOSSARY_TERMS.sort((a, b) => a.term.localeCompare(b.term)).map(t => `
          <a class="ssr-card" href="/glossary/${esc(t.slug)}">
            <div class="ssr-card-label">Definition</div>
            <div class="ssr-card-title">${esc(t.term)}</div>
            <p style="font-size:0.78rem;color:#64748b;margin-top:0.3rem;line-height:1.5;">${esc(t.shortDef)}</p>
          </a>`).join("")}
      </div>
    </section>
    <section class="ssr-related" style="margin-top:2.5rem;">
      <h2>More Resources</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/buckinghamshire-11-plus-guide"><div class="ssr-card-label">Complete guide</div><div class="ssr-card-title">Bucks 11+ Parent Guide →</div></a>
        <a class="ssr-card" href="/bucks-grammar-schools"><div class="ssr-card-label">All 13 schools</div><div class="ssr-card-title">Grammar Schools →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-qualifying-score"><div class="ssr-card-label">Score guide</div><div class="ssr-card-title">Qualifying Score (121) →</div></a>
        <a class="ssr-card" href="/learn"><div class="ssr-card-label">30 guides</div><div class="ssr-card-title">Learning Hub →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema([{ label: "11+ Glossary" }]),
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Bucks 11+ Glossary",
      description: "Key terms and concepts for the Buckinghamshire Secondary Transfer Test (11+), explained for parents.",
      url: `${BASE_URL}/glossary`,
      hasDefinedTerm: GLOSSARY_TERMS.map(t => ({
        "@type": "DefinedTerm",
        name: t.term,
        description: t.shortDef,
        url: `${BASE_URL}/glossary/${t.slug}`,
        inDefinedTermSet: `${BASE_URL}/glossary`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Bucks 11+ Glossary Terms",
      itemListElement: GLOSSARY_TERMS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.term,
        url: `${BASE_URL}/glossary/${t.slug}`,
      })),
    },
  ];

  return ssrShell({
    title: "Bucks 11+ Glossary: Key Terms & Definitions for Parents | Bucks 11 Plus Tests",
    description: "Complete glossary of Bucks 11+ terms: standardised scores, qualifying threshold, GL Assessment, SCAF, oversubscription criteria, and more — explained clearly for parents.",
    canonical: `${BASE_URL}/glossary`,
    schemas,
    body,
  });
}

export function getGlossaryTermHtml(slug: string): string | null {
  const term = GLOSSARY_TERMS.find(t => t.slug === slug);
  if (!term) return null;

  const related = GLOSSARY_TERMS.filter(t => term.relatedTerms.includes(t.slug));

  const body = `
    ${ssrBreadcrumbs([
      { label: "11+ Glossary", href: "/glossary" },
      { label: term.term },
    ])}
    <div class="ssr-hero">
      <span class="ssr-tag">Glossary</span>
      <h1 class="ssr-h1">${esc(term.term)}</h1>
      <p class="ssr-intro">${esc(term.shortDef)}</p>
    </div>
    <section class="ssr-section">
      <h2>Definition</h2>
      <p>${esc(term.definition)}</p>
      ${related.length > 0 ? `
      <h2>Related Terms</h2>
      <div class="ssr-cards">
        ${related.map(r => `<a class="ssr-card" href="/glossary/${esc(r.slug)}">
          <div class="ssr-card-label">Definition</div>
          <div class="ssr-card-title">${esc(r.term)}</div>
        </a>`).join("")}
      </div>` : ""}
    </section>
    ${term.faq && term.faq.length > 0 ? ssrFaqSection(term.faq) : ""}
    ${ssrCtaBox()}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>More from the 11+ Glossary</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/glossary"><div class="ssr-card-label">All terms</div><div class="ssr-card-title">View Full Glossary →</div></a>
        <a class="ssr-card" href="/buckinghamshire-11-plus-guide"><div class="ssr-card-label">Complete guide</div><div class="ssr-card-title">Bucks 11+ Parent Guide →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-qualifying-score"><div class="ssr-card-label">Score guide</div><div class="ssr-card-title">The 121 Qualifying Score →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas: object[] = [
    breadcrumbSchema([
      { label: "11+ Glossary", href: "/glossary" },
      { label: term.term },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `${BASE_URL}/glossary/${term.slug}`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Bucks 11+ Glossary",
        url: `${BASE_URL}/glossary`,
      },
    },
  ];

  if (term.faq && term.faq.length > 0) {
    schemas.push(faqSchema(term.faq));
  }

  return ssrShell({
    title: `${term.term} – Bucks 11+ Definition | Bucks 11 Plus Tests`,
    description: term.shortDef + " Full definition, context, and related terms for the Buckinghamshire 11+ Secondary Transfer Test.",
    canonical: `${BASE_URL}/glossary/${term.slug}`,
    schemas,
    body,
  });
}

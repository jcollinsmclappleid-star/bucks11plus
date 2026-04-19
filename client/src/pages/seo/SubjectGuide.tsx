import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import NotFound from "@/pages/not-found";

type Subject = "verbal-reasoning" | "non-verbal-reasoning" | "maths" | "comprehension";

interface SubjectContent {
  subject: Subject;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  questionTypes: { type: string; description: string }[];
  preparationAdvice: string;
  commonMistakes: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}

const subjectData: Record<Subject, SubjectContent> = {
  "verbal-reasoning": {
    subject: "verbal-reasoning",
    title: "Bucks 11+ Verbal Reasoning: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ Verbal Reasoning Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to verbal reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Question types, preparation strategies, and how to improve VR scores before the real test.",
    intro: "Verbal reasoning (word puzzles & letter patterns) is one of the four core domains of the Buckinghamshire Secondary Transfer Test. It tests a child's ability to understand and use language logically — including word relationships, codes, sequences, and linguistic problem-solving. Strong verbal reasoning is closely tied to reading ability and vocabulary breadth.",
    questionTypes: [
      { type: "Word relationships", description: "Identify synonyms, antonyms, and related words from a set of options" },
      { type: "Letter codes", description: "Decode patterns where letters represent numbers or other letters, and apply the rule to find a missing value" },
      { type: "Word analogies", description: "Complete patterns of the form A is to B as C is to ?" },
      { type: "Odd one out", description: "Identify which word in a group does not belong, based on category or meaning" },
      { type: "Hidden words", description: "Find a word hidden across the boundary of two words in a sentence" },
      { type: "Compound words", description: "Find a word that completes two separate words when added to the end of one and the beginning of another" },
      { type: "Number sequences in VR", description: "Identify the rule governing a number sequence and find the missing value" },
    ],
    preparationAdvice: "Verbal reasoning is closely tied to vocabulary and reading breadth. Children who read widely — fiction, non-fiction, quality newspapers — develop the word knowledge that makes verbal reasoning questions feel accessible rather than alien. Vocabulary exercises, word games (crosswords, Scrabble), and deliberate attention to unusual words encountered in reading all contribute to VR performance. In addition to general language development, specific exposure to the question formats used in the Secondary Transfer Test is important — particularly letter codes and compound words, which have a distinctive format that requires familiarisation.",
    commonMistakes: "The most common verbal reasoning error is reading too quickly and missing the precise relationship being tested. Children often choose the first plausible answer rather than checking all options. A systematic approach — eliminating wrong answers before selecting the best — is more reliable than instinct, particularly under time pressure. Another common mistake is unfamiliarity with letter-code question mechanics, which require a specific logical approach that is rarely encountered outside test preparation.",
    sections: [
      {
        heading: "How Verbal Reasoning Is Tested in the Bucks 11+",
        body: "Verbal reasoning questions appear throughout the Buckinghamshire Secondary Transfer Test papers. They are presented in multiple-choice format with five answer options. Questions are delivered with audio instructions — a recorded voice tells children when to start each section and when to stop. There is no opportunity to ask questions or have instructions repeated. Children must work at a consistent pace to complete all questions within the time allowed.",
      },
      {
        heading: "Reading: The Foundation of Verbal Reasoning Performance",
        body: "More than any other preparation activity, daily reading builds the vocabulary breadth that underpins strong verbal reasoning scores. Children who read widely and encounter language in varied contexts — different genres, different registers, different subject areas — develop a natural familiarity with word relationships that makes analogy and synonym questions easier. Targeted vocabulary work can supplement this, but it cannot replace reading as the primary foundation.",
      },
      {
        heading: "How to Improve Quickly",
        body: "For children who are underperforming in verbal reasoning relative to their overall ability, the fastest improvements typically come from: (1) systematic practice of the specific question types they are getting wrong, (2) building vocabulary through reading and deliberate attention to new words, and (3) learning the 'rules' of format-specific questions like letter codes, which have a learnable logical structure. A readiness check that identifies which specific question types are causing errors allows practice to be focused precisely where it is needed.",
      },
    ],
    faq: [
      {
        question: "Is verbal reasoning part of the Bucks 11+ test?",
        answer: "Yes. Verbal reasoning is one of the four domains tested in the Buckinghamshire Secondary Transfer Test. The test, produced by GL Assessment, assesses verbal reasoning, non-verbal reasoning (including spatial), mathematics, and English comprehension.",
      },
      {
        question: "How do I help my child improve at verbal reasoning?",
        answer: "The most effective strategies are: encourage regular reading of varied material, work through 11+ verbal reasoning practice questions by type, focus specifically on question types that are causing errors (letter codes and compound words are common weak spots), and build vocabulary deliberately through reading and word games.",
      },
      {
        question: "What is a letter code question?",
        answer: "Letter code questions present a pattern where letters represent other letters or numbers, and ask children to apply the same rule to a new example. For example: if ABC = DEF, what does GHI equal? The answer would be JKL (each letter moves forward by 3). These questions have a distinctive logical format that requires specific familiarisation — children who encounter them for the first time in the actual test typically perform worse than those who have practiced them.",
      },
    ],
  },
  "non-verbal-reasoning": {
    subject: "non-verbal-reasoning",
    title: "Bucks 11+ Non-Verbal Reasoning & Spatial: Guide & Practice",
    metaTitle: "Bucks 11+ Non-Verbal Reasoning Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to non-verbal and spatial reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Question types, preparation strategies, and how to improve NVR scores.",
    intro: "Non-verbal reasoning (shape & pattern puzzles) and spatial reasoning are combined into a single domain in the Buckinghamshire Secondary Transfer Test. They test a child's ability to work with shapes, patterns, sequences, and spatial relationships — without using words or numbers. NVR is the domain most commonly unfamiliar to children before test preparation begins.",
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
    preparationAdvice: "Non-verbal reasoning is the domain where children most commonly show a gap between natural ability and test performance. Because NVR question types are not taught in primary school, even children with strong logical ability may find them unfamiliar at first. This is not a ceiling — it is a training gap. Exposure to NVR question formats typically produces some of the fastest improvement seen in 11+ preparation, as the question types are learnable once a child has seen them. The key is systematic practice by question type: matrices before sequences, reflections before rotations, working carefully through each format before moving to the next.",
    commonMistakes: "The most common NVR errors are: (1) working too slowly on spatial questions and running out of time, (2) not systematically checking the rules before selecting an answer, and (3) rushing on reflection questions and not carefully considering which axis the mirror line is on. For 3D questions, children who have not had physical exposure to building and visualisation (construction toys, origami, building blocks) often find net questions harder initially. Targeted practice addresses this directly.",
    sections: [
      {
        heading: "Why NVR Is Often the Biggest Gap",
        body: "Of the four test domains, non-verbal reasoning is the one most children are least prepared for at the start of 11+ work. Verbal reasoning, maths, and comprehension all relate closely to things taught in school. Non-verbal reasoning does not. Pattern recognition, spatial manipulation, and matrix logic are not part of the KS2 curriculum. Children with high natural logical ability may still struggle with the specific question formats simply because they have never encountered them. This is an important insight: NVR underperformance often reflects a lack of exposure, not a lack of ability. Targeted practice is particularly high-return for this domain.",
      },
      {
        heading: "Spatial Reasoning: The Specific Challenge",
        body: "Spatial reasoning questions — nets, rotations, cube views — require children to mentally manipulate three-dimensional objects. This skill is more developed in children who have had experience with construction toys, building, drawing in 3D, or activities that require visualising space. Children who struggle with spatial reasoning often benefit from physical practice: folding paper nets, building shapes from cardboard, and working through spatial puzzles before attempting the test-format versions. The physical-to-conceptual bridge makes a significant difference.",
      },
      {
        heading: "How to Improve NVR Scores Efficiently",
        body: "The fastest NVR improvement comes from working through question types systematically. Start with matrices and sequences, as these are the most common types. Understand the rule underlying each answer — do not just guess and check. Move to reflections and rotations once the pattern-based questions feel confident. Leave 3D questions (nets, cube views) until last. A readiness check showing NVR performance by question type tells you precisely where the gaps are, allowing practice to be focused rather than broad.",
      },
    ],
    faq: [
      {
        question: "Does the Bucks 11+ test non-verbal reasoning and spatial reasoning separately?",
        answer: "The Buckinghamshire Secondary Transfer Test covers non-verbal reasoning and spatial reasoning as part of the same domain. They appear across both papers of the test. The distinctions between NVR subtypes (matrices, sequences, reflections, rotations, nets) are relevant for preparation purposes — different question types require different skills — but they are marked together as part of the overall score.",
      },
      {
        question: "My child is strong at maths but weak at NVR — why?",
        answer: "Mathematical ability and non-verbal reasoning ability are related but not identical. NVR tests spatial and pattern-based thinking specifically, which is a different cognitive skill from arithmetic and algebra. Some children who are strong at maths find NVR unfamiliar because it requires visual-spatial processing rather than numerical computation. Targeted NVR practice is the solution — this is a training gap, not a ceiling.",
      },
      {
        question: "What are the best resources for NVR practice?",
        answer: "GL Assessment-style NVR practice books are widely available and are the most directly relevant materials. Make sure the materials are specifically for the GL Assessment format (not CEM, which is used in other areas). Digital platforms that adapt to performance and identify weak question types by category can be more efficient than paper books alone, as they focus practice time on the specific subtypes causing errors.",
      },
    ],
  },
  "maths": {
    subject: "maths",
    title: "Bucks 11+ Maths: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ Maths Practice – Secondary Transfer Test Maths Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to mathematical reasoning in the Buckinghamshire 11+ Secondary Transfer Test. Topics covered, common question types, and how to prepare for the maths section.",
    intro: "Mathematical reasoning (number problems) is one of the four core domains of the Buckinghamshire Secondary Transfer Test. The maths questions in the Bucks 11+ go beyond the Year 5 curriculum — they require fluency, multi-step thinking, and the ability to apply mathematical concepts in unfamiliar contexts under timed conditions.",
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
    preparationAdvice: "Maths preparation for the 11+ differs from school maths preparation in two important ways. First, the topics go beyond what is typically covered in Year 5 — children need to be comfortable with content usually taught in Year 6. Second, questions are presented in multiple-choice format under strict time pressure — there are no method marks, and working must be fast and reliable. This means preparation should focus on both the topic range (breadth of content) and the speed of application (fluency). Times tables must be automatic by the time of the test — any hesitation on arithmetic fundamentals costs time on more complex questions.",
    commonMistakes: "The most frequent maths errors in the Bucks 11+ are: (1) working too slowly on calculation and running out of time, (2) misreading word problems and answering the wrong question, (3) errors in fraction and percentage calculations, and (4) not checking the reasonableness of an answer before selecting it. Children who rely on column methods for mental arithmetic often struggle with the pace the test requires — building mental arithmetic fluency is as important as topic coverage.",
    sections: [
      {
        heading: "How Maths Is Tested in the Bucks 11+",
        body: "Mathematical reasoning questions appear across both papers of the Secondary Transfer Test. All questions are multiple choice — there is no working to show, only an answer to select. Audio instructions tell children when to start and stop each section. The pace is demanding: children must work quickly and accurately across a range of topics. A child who is methodically correct but slow will run out of time. Pace training — completing sets of questions within strict time limits — is an essential component of maths preparation.",
      },
      {
        heading: "Topics Beyond the Year 5 Curriculum",
        body: "The Bucks 11+ maths content extends beyond what most children have covered in Year 5. Topics like ratio and proportion, algebra, and some aspects of data handling are typically introduced in Year 6 or later in the standard curriculum. Children preparing for the test need to build familiarity with these topics before September of Year 6. This is one reason why starting preparation in Year 5 is important — it gives time to cover the extended content range without rushing.",
      },
      {
        heading: "Mental Arithmetic and Calculation Speed",
        body: "Multiple-choice maths under time pressure rewards mental arithmetic. Children who can calculate quickly in their head — rather than relying on written methods — work faster and use their available time more effectively. Times tables must be fully memorised (1–12 times tables without hesitation). Multiplication and division facts should be automatic. Mental strategies for addition and subtraction — bridging, partitioning, rounding — are more useful in the test than column methods. Building these skills alongside topic coverage is important throughout preparation.",
      },
    ],
    faq: [
      {
        question: "Does the Bucks 11+ maths go beyond KS2 curriculum?",
        answer: "Yes. The mathematical reasoning content in the Buckinghamshire Secondary Transfer Test extends into topics covered in early Year 6 and beyond — including ratio and proportion, simple algebra, and data handling. Children preparing for the test need to cover this extended range, which is one reason why Bucks 11+ preparation materials are more appropriate than general KS2 maths resources alone.",
      },
      {
        question: "My child is strong at school maths but struggles with the test format — why?",
        answer: "School maths often emphasises written methods and checking, with marks awarded for working shown. The 11+ test is multiple choice under strict time pressure — no marks for working, no part marks. Children strong at school maths but unfamiliar with the test format often work too carefully and methodically, running out of time. Timed practice under test conditions, building mental arithmetic speed, and learning to select answers efficiently are separate skills from school maths competence.",
      },
      {
        question: "How important are times tables for the 11+ maths section?",
        answer: "Critically important. Times tables (1–12, fully memorised) underpin fast, reliable mental arithmetic. Any hesitation on times table recall costs time on more complex questions that require that knowledge as a building block. If times tables are not fully automatic by the start of Year 5 preparation, addressing this first — before working on more advanced topics — is the highest-return activity.",
      },
    ],
  },
  "comprehension": {
    subject: "comprehension",
    title: "Bucks 11+ English Comprehension: Question Types, Strategy & Practice",
    metaTitle: "Bucks 11+ English Comprehension Practice – Secondary Transfer Test Guide | Bucks 11 Plus Tests",
    metaDescription: "Complete guide to English comprehension in the Buckinghamshire 11+ Secondary Transfer Test. Question types, reading strategies, and how to improve comprehension scores before test day.",
    intro: "English comprehension (reading & understanding) is one of the four core domains of the Buckinghamshire Secondary Transfer Test. It tests a child's ability to read a passage carefully and accurately — and to answer questions that probe literal understanding, inference, vocabulary in context, and language use. It is the domain most directly built by strong reading habits.",
    questionTypes: [
      { type: "Literal retrieval", description: "Find information directly stated in the passage" },
      { type: "Inference", description: "Deduce meaning implied by the text but not directly stated" },
      { type: "Vocabulary in context", description: "Identify the meaning of a word or phrase as used in the passage" },
      { type: "Author's purpose and technique", description: "Questions about why the author used a particular word, structure, or approach" },
      { type: "Language and structure", description: "Questions about the effect of specific language choices on the reader" },
      { type: "Summary and main idea", description: "Identify the main theme or central point of a section or the whole passage" },
    ],
    preparationAdvice: "English comprehension is the domain most directly built by reading — specifically, reading varied and challenging material and thinking carefully about what it means. Children who read widely (fiction and non-fiction across different genres) and who discuss what they have read — what the author intended, what certain phrases mean, why a word was chosen — develop the comprehension skills that transfer directly to the test. In addition to general reading, specific practice with Secondary Transfer Test-style comprehension passages is important for familiarity with the question format, answer choices, and time management.",
    commonMistakes: "The most common comprehension errors are: (1) misreading the question and answering what the child thinks the question asked, not what it actually asks; (2) choosing an answer that sounds right in general rather than one that is supported by the specific text; (3) inference questions answered based on general knowledge rather than what the passage says; and (4) running out of time and not reaching the later questions. Answering only from the text — not from outside knowledge — is the single most important discipline in comprehension.",
    sections: [
      {
        heading: "How Comprehension Is Tested in the Bucks 11+",
        body: "Comprehension questions are based on a passage of text included in the test papers. Questions are multiple choice — children must select one answer from five options. The audio instructions signal when the comprehension section begins and ends. Questions vary in difficulty: some retrieve information stated directly in the text, others require inference (reading between the lines), and others probe vocabulary or language technique. The passage itself can be literary (a story extract), non-fiction (an article or explanation), or a mix.",
      },
      {
        heading: "The Role of Reading in Comprehension Preparation",
        body: "No preparation activity builds comprehension as effectively as regular, varied reading. Children who read widely — different genres, different levels of difficulty, both fiction and non-fiction — develop the vocabulary, inference ability, and reading fluency that comprehension questions test. Reading narrowly (only one genre, or only at a comfortable level) is less effective. Pushing slightly beyond comfort — a slightly more challenging book, a quality newspaper article, a non-fiction topic that is unfamiliar — builds the skills that transfer to test performance.",
      },
      {
        heading: "Answering From the Text: The Essential Discipline",
        body: "The most important comprehension discipline is this: every answer must be justified by the text, not by general knowledge or common sense. Inference questions ask children to read between the lines — but the lines must be from the passage, not from the child's existing understanding of the world. Many children lose marks by choosing an answer that seems plausible based on general knowledge but is not supported by what the specific passage says. Teaching children to return to the passage and locate evidence for their answer — rather than answering from instinct — is the highest-return comprehension skill to develop.",
      },
    ],
    faq: [
      {
        question: "How long is the comprehension passage in the Bucks 11+?",
        answer: "The passage length varies but is typically several hundred words — long enough to require careful, efficient reading. Children should aim to read the passage once attentively, then refer back to it for specific questions rather than trying to memorise every detail. Efficient navigation of the text during the question-answering phase is as important as the initial reading.",
      },
      {
        question: "My child reads a lot but still struggles with comprehension questions — why?",
        answer: "Reading for pleasure and answering multiple-choice comprehension questions are different skills. Children who read widely for pleasure often have strong comprehension in general, but may struggle with the specific demands of test-format questions: choosing between five similar-seeming options, answering exactly what the question asks (not what it seems to ask), and justifying answers from the text rather than from intuition. Specific practice with Secondary Transfer Test comprehension passages addresses these test-specific skills.",
      },
      {
        question: "Is comprehension marked separately from verbal reasoning?",
        answer: "In the Buckinghamshire Secondary Transfer Test scoring, comprehension and verbal reasoning contribute to the overall standardised score. The test has two papers, and both cover multiple domains. The final score is a composite standardised score. Parents who want domain-level insight — understanding how their child performed specifically in comprehension versus verbal reasoning — need to request that level of analysis after results are released, or use a readiness platform that provides domain breakdowns before the test.",
      },
    ],
  },
};

export default function SubjectGuide({ subject }: { subject: Subject }) {
  const content = subjectData[subject];
  if (!content) return <NotFound />;

  const urlMap: Record<Subject, string> = {
    "verbal-reasoning": "/11-plus-verbal-reasoning-practice",
    "non-verbal-reasoning": "/11-plus-non-verbal-reasoning-practice",
    "maths": "/11-plus-maths-practice",
    "comprehension": "/11-plus-comprehension-practice",
  };

  const labelMap: Record<Subject, string> = {
    "verbal-reasoning": "Verbal Reasoning",
    "non-verbal-reasoning": "Non-Verbal Reasoning",
    "maths": "Maths",
    "comprehension": "English Comprehension",
  };

  const breadcrumbs = [
    { label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" },
    { label: labelMap[subject] },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={content.metaTitle}
        description={content.metaDescription}
        canonicalPath={urlMap[subject]}
        schema={[breadcrumbSchema(breadcrumbs), faqSchema, {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: content.title,
          description: content.metaDescription,
        }]}
      />

      <div className="bg-muted/30 border-b border-border py-3">
        <div className="container mx-auto max-w-4xl px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
          <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
            Subject Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="text-subject-title">
            {content.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{content.intro}</p>
        </div>

        <SubscribeCTA />

        <div className="prose prose-slate max-w-none
          prose-h2:font-serif prose-h2:text-xl prose-h2:font-bold prose-h2:text-primary prose-h2:mt-10 prose-h2:mb-3
          prose-h3:font-semibold prose-h3:text-base prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
          prose-li:text-muted-foreground prose-strong:text-foreground">

          <h2>Question Types in This Domain</h2>
          <div className="not-prose grid sm:grid-cols-2 gap-3 my-4">
            {content.questionTypes.map((qt, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="font-semibold text-sm text-foreground mb-1">{qt.type}</div>
                <div className="text-xs text-muted-foreground">{qt.description}</div>
              </div>
            ))}
          </div>

          {content.sections.map((section, i) => (
            <div key={i}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}

          <h2>How to Prepare</h2>
          <p>{content.preparationAdvice}</p>

          <h2>Common Mistakes to Avoid</h2>
          <p>{content.commonMistakes}</p>

          <h2>Frequently Asked Questions</h2>
          {content.faq.map((item, i) => (
            <div key={i}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="not-prose mt-10">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">Other Subject Guides</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(subjectData) as Subject[]).filter(s => s !== subject).map(s => (
              <Link
                key={s}
                href={urlMap[s]}
                data-testid={`link-subject-${s}`}
                className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="text-xs text-muted-foreground mb-1">Subject guide</div>
                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {labelMap[s]} →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <ContentCTA />
        <Disclaimer />
      </div>
    </div>
  );
}

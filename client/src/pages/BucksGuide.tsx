import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "../components/shared/Breadcrumbs";
import { ContentCTA } from "../components/shared/ContentCTA";
import { Disclaimer } from "../components/shared/Disclaimer";

const faqItems = [
  {
    question: "What is the Buckinghamshire 11 Plus test?",
    answer: "The Buckinghamshire 11 Plus (also known as the Secondary Transfer Test) is a standardised assessment used to determine eligibility for the 13 grammar schools in Buckinghamshire. It is administered by GL Assessment and covers Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension.",
  },
  {
    question: "What score does my child need to pass the Bucks 11 Plus?",
    answer: "Children need to achieve a standardised score of 121 or above across all four papers to qualify for a grammar school place. The qualifying score is set annually by The Buckinghamshire Grammar Schools (TBGS) and has remained at 121 in recent years.",
  },
  {
    question: "When should my child start preparing for the 11 Plus?",
    answer: "Most families begin structured preparation in Year 4 or the start of Year 5. Starting too early can lead to burnout, while starting too late may not leave enough time to address weaknesses. A diagnostic assessment early in preparation helps identify the right starting point.",
  },
  {
    question: "How is the Buckinghamshire 11 Plus scored?",
    answer: "Each paper is scored individually and then standardised to account for the child's age. The standardised scores from all four papers are combined, and a child must achieve an overall standardised score of 121 or above to qualify.",
  },
  {
    question: "Can children from outside Buckinghamshire take the 11 Plus?",
    answer: "Yes, children from outside Buckinghamshire can register for the test and apply for grammar school places. However, Buckinghamshire residents are given priority in admissions. Out-of-county applicants must register separately and meet the same qualifying score threshold.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbItems = [
  { label: "Buckinghamshire 11+ Guide" },
];

export default function BucksGuide() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Buckinghamshire 11 Plus Guide | Everything You Need to Know | 11+ Standard"
        description="Complete guide to the Buckinghamshire 11 Plus test. Learn about the 13 grammar schools, qualifying scores, admissions timeline, test format, and how to prepare your child for the Bucks 11+."
        canonicalPath="/buckinghamshire-11-plus-guide"
        schema={[faqSchema, breadcrumbSchema(breadcrumbItems)]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="heading-bucks-guide">
        The Complete Guide to the Buckinghamshire 11 Plus
      </h1>
      <p className="text-xl text-muted-foreground lead">
        Everything parents need to know about the Bucks 11+, from registration and test format to qualifying scores and preparation strategies.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif" data-testid="heading-overview">Overview of the Buckinghamshire 11+</h2>
      <p>
        The Buckinghamshire 11 Plus — officially called the <strong>Secondary Transfer Test (STT)</strong> — is a selective entrance examination taken by children in Year 6 (typically in September). It determines eligibility for places at the 13 state-funded grammar schools across Buckinghamshire.
      </p>
      <p>
        The test is administered by <strong>GL Assessment</strong> and covers four core domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Children must achieve a combined <Link href="/bucks-11-plus-qualifying-score" className="text-primary font-medium">standardised score of 121</Link> or above to qualify for a grammar school place.
      </p>
      <p>
        Each year, approximately 6,000–7,000 children sit the test, with around 30–35% achieving the qualifying score. Competition varies by school, with some grammar schools significantly more oversubscribed than others.
      </p>

      <h2 className="text-primary font-serif" data-testid="heading-grammar-schools">The 13 Buckinghamshire Grammar Schools</h2>
      <p>
        Buckinghamshire is home to 13 state-funded grammar schools, making it one of the largest selective education systems in England. Each school has its own character, catchment priorities, and oversubscription criteria.
      </p>
      <ul>
        <li><a href="https://www.ags.bucks.sch.uk" target="_blank" rel="noopener noreferrer">Aylesbury Grammar School</a> — Boys, Aylesbury</li>
        <li><a href="https://www.aylesburyhigh.org" target="_blank" rel="noopener noreferrer">Aylesbury High School</a> — Girls, Aylesbury</li>
        <li><a href="https://www.beaconsfieldhigh.bucks.sch.uk" target="_blank" rel="noopener noreferrer">Beaconsfield High School</a> — Girls, Beaconsfield</li>
        <li><a href="https://www.burnhamgrammar.org" target="_blank" rel="noopener noreferrer">Burnham Grammar School</a> — Co-ed, Burnham</li>
        <li><a href="https://www.challoners.com" target="_blank" rel="noopener noreferrer">Dr Challoner's Grammar School</a> — Boys, Amersham</li>
        <li><a href="https://www.dchigh.org" target="_blank" rel="noopener noreferrer">Dr Challoner's High School</a> — Girls, Little Chalfont</li>
        <li><a href="https://www.jhgs.bucks.sch.uk" target="_blank" rel="noopener noreferrer">John Hampden Grammar School</a> — Boys, High Wycombe</li>
        <li><a href="https://www.royallatin.org" target="_blank" rel="noopener noreferrer">The Royal Latin School</a> — Co-ed, Buckingham</li>
        <li><a href="https://www.shfgs.org" target="_blank" rel="noopener noreferrer">Sir Henry Floyd Grammar School</a> — Co-ed, Aylesbury</li>
        <li><a href="https://www.swbgs.com" target="_blank" rel="noopener noreferrer">Sir William Borlase's Grammar School</a> — Co-ed, Marlow</li>
        <li><a href="https://www.whs.bucks.sch.uk" target="_blank" rel="noopener noreferrer">Wycombe High School</a> — Girls, High Wycombe</li>
        <li><a href="https://www.rgshw.com" target="_blank" rel="noopener noreferrer">The Royal Grammar School</a> — Boys, High Wycombe</li>
        <li><a href="https://www.cheshamgrammar.org" target="_blank" rel="noopener noreferrer">Chesham Grammar School</a> — Co-ed, Chesham</li>
      </ul>
      <p>
        For detailed profiles of each school, including catchment areas and oversubscription criteria, see our <Link href="/bucks-grammar-schools" className="text-primary font-medium">Buckinghamshire Grammar Schools directory</Link>.
      </p>

      <h2 className="text-primary font-serif" data-testid="heading-how-test-works">How the Test Works</h2>
      <p>
        The Buckinghamshire Secondary Transfer Test is typically held in mid-September of Year 6. Children sit the test at their primary school (if registered in-county) or at a designated test centre. The test consists of two separate papers, completed under strict timed conditions.
      </p>
      <p>
        Results are released in mid-October, approximately four weeks after the test date. Parents receive a letter indicating whether their child has achieved the <Link href="/bucks-11-plus-qualifying-score" className="text-primary font-medium">qualifying standard</Link> (a standardised score of 121+), along with their individual paper scores.
      </p>

      <h2 className="text-primary font-serif" data-testid="heading-test-contents">What the Test Contains</h2>
      <p>
        The Bucks 11+ covers four reasoning domains, all assessed in a GL Assessment format:
      </p>
      <div className="not-prose my-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-primary font-serif mb-2">Verbal Reasoning</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vocabulary, word relationships, codes and ciphers, letter-pattern sequences, and logical deduction. Tests language skills and reasoning ability.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-primary font-serif mb-2">Non-Verbal Reasoning</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pattern sequences, shape classification, matrices, spatial reasoning (rotation, reflection), and figure analysis. Tests abstract logical thinking.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-primary font-serif mb-2">Mathematics</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Arithmetic fluency, fractions, decimals, percentages, ratio, data interpretation, and multi-step word problems aligned to Key Stage 2.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-primary font-serif mb-2">English Comprehension</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Passage-based reading comprehension testing fact retrieval, vocabulary in context, inference, mood and tone, and detail analysis.
          </p>
        </div>
      </div>

      <h2 className="text-primary font-serif" data-testid="heading-timeline">Admissions Timeline</h2>
      <p>
        The <Link href="/bucks-11-plus-timeline" className="text-primary font-medium">Buckinghamshire 11+ admissions timeline</Link> follows a structured annual cycle. Key dates for families to note:
      </p>
      <div className="not-prose my-8 overflow-x-auto">
        <table className="min-w-full text-sm border border-slate-200 rounded-xl" data-testid="table-timeline">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-primary border-b border-slate-200">When</th>
              <th className="text-left px-4 py-3 font-semibold text-primary border-b border-slate-200">What Happens</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 font-medium whitespace-nowrap">May – June (Year 5)</td>
              <td className="px-4 py-3 text-muted-foreground">Registration opens for the Secondary Transfer Test</td>
            </tr>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="px-4 py-3 font-medium whitespace-nowrap">Late June</td>
              <td className="px-4 py-3 text-muted-foreground">Registration deadline (typically late June)</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 font-medium whitespace-nowrap">Mid-September (Year 6)</td>
              <td className="px-4 py-3 text-muted-foreground">Test day — children sit the 11+ papers</td>
            </tr>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="px-4 py-3 font-medium whitespace-nowrap">Mid-October</td>
              <td className="px-4 py-3 text-muted-foreground">Results released to parents</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-3 font-medium whitespace-nowrap">31 October</td>
              <td className="px-4 py-3 text-muted-foreground">Secondary school application deadline (Common Application Form)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium whitespace-nowrap">1 March (Year 6)</td>
              <td className="px-4 py-3 text-muted-foreground">National Offer Day — school places allocated</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif" data-testid="heading-scores">Understanding Standardised Scores</h2>
      <p>
        Raw test scores are converted into <strong>standardised scores</strong> to ensure fairness across children of different ages. A child born in September and a child born in August sitting the same test will have their raw scores adjusted so that age does not confer an advantage.
      </p>
      <p>
        The <Link href="/bucks-11-plus-qualifying-score" className="text-primary font-medium">qualifying score of 121</Link> represents a standardised threshold. A score of 100 is considered average, so 121 indicates performance significantly above the national average. The standardisation process means that the qualifying score reflects ability relative to the child's exact age in years and months.
      </p>
      <p>
        It is important to understand that mock test scores from third-party providers — including this platform — are <strong>indicative only</strong>. Only the official GL Assessment papers administered on test day determine the final qualifying decision.
      </p>

      <h2 className="text-primary font-serif" data-testid="heading-preparation">Preparing for the Buckinghamshire 11+</h2>
      <p>
        Effective preparation combines three elements: <strong>diagnostic assessment</strong> to identify current strengths and weaknesses, <strong>targeted practice</strong> to close specific gaps, and <strong>timed conditions</strong> to build the speed and accuracy required on test day.
      </p>
      <p>
        Common mistakes include starting too late, relying exclusively on paper-based practice without timed conditions, and ignoring weaker domains in favour of subjects the child already enjoys. A structured approach, ideally informed by a <Link href="/free-diagnostic" className="text-primary font-medium">diagnostic assessment</Link>, produces significantly better outcomes than unstructured practice alone.
      </p>
      <p>
        Our platform provides a free 12-minute diagnostic that measures both accuracy and pacing across all four domains, generating a predicted standardised score and identifying the specific question types where your child needs the most improvement.
      </p>

      <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-muted-foreground mb-2">Want a summary you can keep?</p>
        <Link href="/bucks-11-plus-parent-guide" className="text-primary font-semibold hover:underline">
          Download our free Buckinghamshire 11+ Parent Guide (PDF) &rarr;
        </Link>
      </div>

      <ContentCTA />

      <h2 className="text-primary font-serif" data-testid="heading-faq">Frequently Asked Questions</h2>
      {faqItems.map((item, i) => (
        <div key={i} className="mb-6" data-testid={`faq-item-${i}`}>
          <h3 className="text-lg font-bold text-foreground font-serif">{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}

      <Disclaimer />
    </div>
  );
}

import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Vocabulary List" },
];

const tier1 = [
  "abandon", "abundant", "accurate", "ancient", "anxious", "apparent", "approve", "arrange", "assemble",
  "astonish", "attempt", "barren", "benefit", "brittle", "cautious", "cease", "challenge", "claim",
  "compose", "concise", "conclude", "constant", "courteous", "decline", "delicate", "demand", "describe",
  "diligent", "disguise", "distant", "eager", "enormous", "evident", "exhausted", "expand", "famous",
  "fierce", "foolish", "frantic", "gentle", "generous", "glance", "graceful", "hasten", "honest",
  "horrid", "hostile", "humble", "ignore", "imitate",
];

const tier2 = [
  "abolish", "abundant", "adequate", "advocate", "affluent", "alleviate", "ambiguous", "anonymous",
  "arduous", "astute", "audible", "benevolent", "candid", "cautious", "coherent", "compassionate",
  "compelling", "compliant", "concur", "consensus", "conspicuous", "contemplate", "covert", "credible",
  "cynical", "deficient", "deliberate", "demure", "depict", "deride", "detrimental", "devious",
  "diligent", "discern", "discreet", "disdain", "diverse", "dubious", "eccentric", "elated",
  "eloquent", "elusive", "empathy", "endure", "enhance", "exemplary", "exonerate", "expedite",
  "explicit", "extol",
];

const tier3 = [
  "abate", "aberration", "acquiesce", "acrimonious", "affable", "alacrity", "ameliorate", "anachronism",
  "antithesis", "apathetic", "arbitrary", "ascetic", "assiduous", "auspicious", "axiom", "belligerent",
  "bombastic", "cacophony", "capitulate", "censure", "chasten", "circumlocution", "cogent", "commiserate",
  "conflagration", "consternation", "contrite", "convivial", "credulous", "cursory", "decorum", "demagogue",
  "denigrate", "diaphanous", "didactic", "diffident", "disparate", "dogmatic", "ebullient", "eclectic",
  "edify", "egregious", "enervate", "enigmatic", "equivocate", "erudite", "esoteric", "ethereal",
  "euphemism", "exacerbate",
];

const faqItems = [
  {
    question: "How many vocabulary words should my child learn for the Bucks 11+?",
    answer: "There is no fixed target, but children who reach the 121 qualifying threshold typically have a working vocabulary several thousand words above the Year 6 average. A focused list of 200–300 high-utility words mastered through reading and active use is more valuable than 1,000 words memorised from a list and quickly forgotten.",
  },
  {
    question: "When should we start vocabulary work?",
    answer: "As early as possible — ideally Year 4 or early Year 5. Vocabulary is the slowest skill to build because it relies on cumulative exposure rather than rule-learning. Starting in the summer before Year 6 leaves very little time, and last-minute cramming rarely produces durable gains.",
  },
  {
    question: "Are word lists more effective than reading?",
    answer: "Reading is more effective than lists for building deep, contextual understanding. Word lists are best used as a focused supplement — to fill specific gaps, to revisit recently encountered words, or to introduce families of words that share common roots. Lists alone produce shallow recognition; reading produces durable comprehension.",
  },
  {
    question: "What kind of reading is best?",
    answer: "Vary the type. Quality children's fiction (Phillip Pullman, Katherine Rundell, Frances Hardinge, classic adventure stories), accessible non-fiction (history, biography, science writing for children), and well-written newspapers (The Week Junior, First News). The Bucks comprehension paper draws from a wide range of styles, so breadth of exposure matters more than depth in any single genre.",
  },
];

const verbalQuestionTypes = [
  { type: "Synonyms", desc: "Pick the word closest in meaning to the underlined word", example: '"Furious" is closest to: angry / sad / quiet / tired' },
  { type: "Antonyms", desc: "Pick the word opposite in meaning", example: '"Generous" is opposite to: kind / selfish / loud / patient' },
  { type: "Odd one out", desc: "Identify the word that doesn't belong with the others", example: 'Jubilant / Elated / Melancholy / Ecstatic / Overjoyed' },
  { type: "Cloze (fill the gap)", desc: "Complete a sentence with the most appropriate word", example: 'The team\'s performance was so __ that even their critics applauded.' },
  { type: "Compound words", desc: "Combine two words to form a new one with related meaning", example: 'rain + bow → rainbow' },
];

export default function VocabularyList() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Bucks 11 Plus Vocabulary List (2026) – 150 Essential Words by Tier"
        description="A structured Bucks 11+ vocabulary list of 150 essential words organised by difficulty tier, plus how vocabulary is tested in the Verbal Reasoning paper and how to build word knowledge that lasts."
        canonicalPath="/bucks-11-plus-vocabulary-list"
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(item => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid="heading-vocabulary">
          Bucks 11+ Vocabulary List
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          150 high-utility words organised by difficulty tier — plus how vocabulary is actually tested in the Bucks Verbal Reasoning paper and how to build word knowledge that lasts beyond the test.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Why Vocabulary Matters in the Bucks 11+</h2>
      <p>
        Vocabulary is the single biggest predictor of performance on the Verbal Reasoning paper and a major factor in the English Comprehension paper. A child with a wide working vocabulary can read passages faster, infer meaning more accurately, and recognise the subtle distinctions between similar words that synonym and antonym questions depend on.
      </p>
      <p>
        Crucially, vocabulary is the <strong>slowest</strong> skill to build. Unlike arithmetic or pattern recognition, you cannot drill it into existence in a few months. It accumulates through sustained reading and repeated exposure. Families who start vocabulary work early have a substantial advantage over those who treat it as a last-minute add-on.
      </p>

      <h2 className="text-primary font-serif">How Vocabulary Is Tested</h2>
      <p>
        Vocabulary appears across at least five recurring question formats in the Bucks Verbal Reasoning paper:
      </p>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-vocab-question-types">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">Question Type</th>
              <th className="text-left p-3 font-semibold text-primary">What's Tested</th>
              <th className="text-left p-3 font-semibold text-primary">Example</th>
            </tr>
          </thead>
          <tbody>
            {verbalQuestionTypes.map((q, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="p-3 font-medium">{q.type}</td>
                <td className="p-3 text-slate-600">{q.desc}</td>
                <td className="p-3 text-slate-500 italic">{q.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Tier 1 — Foundation Vocabulary (50 words)</h2>
      <p>
        These are the everyday-but-precise words that strong Year 6 children should already know and use confidently. If your child cannot define and use any of these comfortably, prioritise these first.
      </p>
      <div className="not-prose my-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-slate-700 leading-relaxed font-medium">{tier1.join(" · ")}</p>
      </div>

      <h2 className="text-primary font-serif">Tier 2 — Intermediate Vocabulary (50 words)</h2>
      <p>
        These words appear regularly in 11+ comprehension passages and synonym questions. A child aiming for the 121 threshold should be comfortable with the meaning and approximate usage of all of these.
      </p>
      <div className="not-prose my-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-slate-700 leading-relaxed font-medium">{tier2.join(" · ")}</p>
      </div>

      <h2 className="text-primary font-serif">Tier 3 — Stretch Vocabulary (50 words)</h2>
      <p>
        These are the words that distinguish strong qualifiers from borderline ones — the kinds of words that appear in tougher comprehension passages and trickier multi-choice synonym questions. Don't rush this tier; mastery of Tier 1 and Tier 2 should come first.
      </p>
      <div className="not-prose my-6 p-5 bg-violet-50 border border-violet-200 rounded-xl">
        <p className="text-sm text-slate-700 leading-relaxed font-medium">{tier3.join(" · ")}</p>
      </div>

      <h2 className="text-primary font-serif">How to Build Vocabulary in 6 Months</h2>
      <ul>
        <li><strong>Read for 30 minutes a day</strong>, every day. Mix fiction, non-fiction, and well-written children's news (The Week Junior, First News).</li>
        <li><strong>Keep a "new words" notebook.</strong> When your child meets an unfamiliar word, they write it down with the sentence it appeared in. Once a week, review the list and use each word in conversation.</li>
        <li><strong>Use word families.</strong> When learning <em>diligent</em>, also learn <em>diligence</em> and <em>diligently</em>. This triples coverage with the same effort.</li>
        <li><strong>Play word games.</strong> Bananagrams, Scrabble, Boggle and crossword puzzles build word recognition without feeling like study.</li>
        <li><strong>Practice synonyms and antonyms specifically.</strong> Most vocabulary tests are not "what does X mean?" — they are "which of these is closest in meaning to X?", which requires comparing several words at once.</li>
      </ul>

      <h2 className="text-primary font-serif">Beyond Word Lists: Reading for Depth</h2>
      <p>
        A list of 150 words memorised from a page produces shallow recognition that fades within weeks. The same 150 words encountered repeatedly in stories, articles and conversation produce durable comprehension that lasts years. The list above is a starting point — it tells you what to recognise. The reading habit is what makes the words stick.
      </p>
      <p>
        For a curated list of recommended reading by year group, see our <Link href="/learn/11-plus-reading-list-buckinghamshire" className="text-primary hover:underline">Bucks 11+ reading list</Link>.
      </p>

      <h2 className="text-primary font-serif">Where Your Child Stands Right Now</h2>
      <p>
        Word lists tell you what to learn. They don't tell you what your child already knows. Our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link> includes vocabulary-led Verbal Reasoning questions and shows you whether vocabulary is currently a strength, a developing area, or the highest-impact gap to close before September.
      </p>

      <ChildExperienceCTA />
      <ContentCTA />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/11-plus-verbal-reasoning-practice" className="text-primary hover:underline">11+ Verbal Reasoning Practice Guide</Link></li>
          <li><Link href="/learn/11-plus-reading-list-buckinghamshire" className="text-primary hover:underline">Recommended Reading List</Link></li>
          <li><Link href="/learn/bucks-11-plus-verbal-reasoning-complete-guide" className="text-primary hover:underline">Verbal Reasoning Complete Guide</Link></li>
          <li><a href="/bucks-11-plus-sample-questions" className="text-primary hover:underline">Sample Questions</a></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

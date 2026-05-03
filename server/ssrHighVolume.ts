import {
  ssrShell, ssrBreadcrumbs, breadcrumbSchema, faqSchema,
  ssrCtaBox, ssrDisclaimer, ssrFaqSection, esc,
} from "./ssrShared";

const BASE = "https://bucks11plustest.co.uk";
const TODAY = "2026-04-01";
const PUBLISHED = "2025-01-01";

function articleSchema(headline: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished: PUBLISHED,
    dateModified: TODAY,
    author: {
      "@type": "Organization",
      name: "Bucks 11 Plus Tests",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Bucks 11 Plus Tests",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

function eventSchema(name: string, startDate: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    startDate,
    description,
    organizer: {
      "@type": "Organization",
      name: "The Buckinghamshire Grammar Schools (TBGS)",
      url: "https://www.thebucksgrammarschools.org",
    },
    location: {
      "@type": "Place",
      name: "Buckinghamshire primary schools",
      address: { "@type": "PostalAddress", addressRegion: "Buckinghamshire", addressCountry: "GB" },
    },
  };
}

// ─── TEST DATE 2026 ──────────────────────────────────────────────────────────

export function getTestDate2026Html(): string {
  const url = `${BASE}/bucks-11-plus-test-date-2026`;
  const title = "Bucks 11 Plus Test Date 2026: All Key Dates & Deadlines | Bucks 11 Plus Tests";
  const desc = "The Bucks 11 Plus 2026 test is sat in September 2026. Full timeline: registration deadline (June 2026), test day (September 2026), results (October 2026), SCAF deadline (November 2026), National Offer Day (March 2027).";

  const faqs = [
    { question: "When is the Bucks 11 Plus test in 2026?", answer: "The Buckinghamshire Secondary Transfer Test is sat in September of Year 6 — for the 2026/27 cohort, this means September 2026. The exact date is announced by The Buckinghamshire Grammar Schools (TBGS) consortium. Check the official TBGS website (thebucksgrammarschools.org) for the confirmed date once published." },
    { question: "When is the Bucks 11 Plus registration deadline for 2026?", answer: "Registration for the Secondary Transfer Test closes in June of Year 5. For children sitting the test in September 2026, the registration deadline is in June 2026. In-county state primary school children are usually registered automatically by their school — parents should confirm this directly with their school. Out-of-county and independent school children must register directly with Buckinghamshire Council." },
    { question: "When do 2026 Bucks 11 Plus results come out?", answer: "Results for the September 2026 test are released in October 2026 — typically around three to four weeks after the test date. Parents receive a 'qualified' or 'not qualified' outcome. The specific standardised score is not shared at the initial results stage, but parents can request it from Buckinghamshire Council." },
    { question: "When is the SCAF deadline for grammar school applications in 2026?", answer: "The Secondary Common Application Form (SCAF) must be submitted by the October/November deadline — typically the last working day of October or mid-November 2026. Exact dates are confirmed by Buckinghamshire Council each year on their admissions pages. Missing this deadline means your application is treated as late and processed after on-time applications." },
    { question: "When is National Offer Day for September 2027 grammar school entry?", answer: "National Offer Day for Year 7 places starting September 2027 is on the first of March 2027 (or the next working day). This is when all secondary school place offers are released to families across England simultaneously, including grammar school offers in Buckinghamshire." },
    { question: "What is the 11 Plus test date for Year 5 children in 2025?", answer: "Children currently in Year 5 in the 2024/25 academic year will sit the Secondary Transfer Test in September 2025. Registration closes in June 2025. See our dedicated 2025 test date guide for the full timeline for this cohort." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Test Date 2026" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">2026 Key Dates</span>
      <h1 class="ssr-h1">Bucks 11 Plus Test Date 2026: Full Timeline for Parents</h1>
      <p class="ssr-intro">The Buckinghamshire Secondary Transfer Test (the Bucks 11+) is sat in September of Year 6. For children currently in Year 4 (2024/25 academic year), test day falls in September 2026. Here is the complete admissions timeline so no deadline is missed.</p>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1.25rem 1.5rem;margin:1.5rem 0;">
      <h2 style="font-family:'Libre Baskerville',serif;font-size:1rem;font-weight:700;color:#166534;margin-bottom:1rem;">2026 Bucks 11+ Key Dates at a Glance</h2>
      <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
        <tr style="border-bottom:1px solid #bbf7d0;"><td style="padding:0.4rem 0.5rem;font-weight:600;color:#166534;width:45%;">Event</td><td style="padding:0.4rem 0.5rem;color:#166534;">Approximate Date</td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;">Registration opens</td><td style="padding:0.4rem 0.5rem;">Spring term 2026 (Year 5)</td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>Registration deadline</strong></td><td style="padding:0.4rem 0.5rem;"><strong>June 2026</strong></td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>Test day</strong></td><td style="padding:0.4rem 0.5rem;"><strong>September 2026</strong> (exact date TBC)</td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>Results released</strong></td><td style="padding:0.4rem 0.5rem;"><strong>October 2026</strong></td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>SCAF deadline</strong></td><td style="padding:0.4rem 0.5rem;"><strong>October/November 2026</strong></td></tr>
        <tr><td style="padding:0.4rem 0.5rem;"><strong>National Offer Day</strong></td><td style="padding:0.4rem 0.5rem;"><strong>1 March 2027</strong></td></tr>
      </table>
    </div>

    ${ssrCtaBox()}

    <section class="ssr-section">
      <h2>June 2026: The Registration Deadline — Do Not Miss This</h2>
      <p>Registration for the Buckinghamshire Secondary Transfer Test closes in June of Year 5. For the 2026 cohort (children in Year 5 during the 2025/26 academic year), this means June 2026. This is the single most important administrative task in Year 5. Missing the deadline means your child cannot sit the test — there is very limited provision for late registration.</p>
      <p>In-county state primary school children are typically registered automatically by their school once they have been listed as wishing to take the test. Parents should confirm this directly with their school's office rather than assuming it has been done. Out-of-county children and those attending independent schools must register directly with Buckinghamshire Council. The official registration process is managed via the TBGS website and Buckinghamshire Council admissions pages.</p>

      <h2>September 2026: Test Day</h2>
      <p>The Secondary Transfer Test is sat in September of Year 6 — typically in the first or second week of the school year. The test consists of two 45-minute papers, usually sat on the same day. Most in-county children sit the test at their own primary school. The exact test date for September 2026 will be announced by The Buckinghamshire Grammar Schools (TBGS) consortium — check thebucksgrammarschools.org for the official confirmed date.</p>
      <p>All instructions during the test are delivered via audio recording. A recorded voice tells children when to start each section, how many questions it contains, and when to stop. The voice cannot be paused or questioned. Children who have not practised with audio-format tests may find this unexpectedly pressuring. Specific preparation with audio-led mock tests before September is strongly recommended.</p>

      <h2>October 2026: Results Released</h2>
      <p>Results for the September 2026 test are released in October 2026 — typically around three to four weeks after test day. The result is communicated as either 'qualified' or 'not qualified'. The specific standardised score is not shared at the initial results stage; parents can request their child's score from Buckinghamshire Council after results are released.</p>
      <p>Children who are qualified then proceed to list grammar school preferences on the Secondary Common Application Form (SCAF). Children who are not qualified may still apply to comprehensive schools through the normal admissions process.</p>

      <h2>October/November 2026: The SCAF Deadline</h2>
      <p>The Secondary Common Application Form (SCAF) is submitted after 11+ results are received. Qualified families list up to three grammar school preferences on the SCAF, alongside comprehensive school preferences. The deadline for submitting the SCAF is typically the last working day of October or mid-November 2026. Exact dates are confirmed by Buckinghamshire Council each year. Late applications are processed after all on-time applications — in a competitive admissions year, a late SCAF can significantly reduce the chance of receiving a grammar school offer.</p>

      <h2>March 2027: National Offer Day</h2>
      <p>All Year 7 secondary school place offers across England are released simultaneously on National Offer Day — the first of March 2027 (or the next working day). Families receive their offer by email and through their online school admissions account, or by letter. Offers must be accepted or declined within a specified window, usually two to three weeks after Offer Day. Children who do not receive a grammar school offer are placed on the waiting list for any listed grammar schools, and offers can be made from waiting lists throughout the spring and summer as other children decline places.</p>

      <h2>How to Prepare for September 2026</h2>
      <p>The test is sat in September of Year 6, which means the effective preparation window runs through Year 5 (2025/26) and the summer holidays before Year 6. Children beginning Year 5 in September 2025 have approximately 12 months before their test date. The most effective preparation follows a structured approach: a readiness check early in Year 5 to identify gaps, focused domain-specific practice through the year, and timed full mock papers in the summer holidays.</p>
    </section>

    ${ssrFaqSection(faqs)}

    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related Guides</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-test-date-2025"><div class="ssr-card-label">Previous cohort</div><div class="ssr-card-title">2025 Test Date Guide →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-registration"><div class="ssr-card-label">Admin guide</div><div class="ssr-card-title">Registration Process →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-qualifying-score"><div class="ssr-card-label">Score guide</div><div class="ssr-card-title">The 121 Qualifying Score →</div></a>
        <a class="ssr-card" href="/preparing-for-11-plus-year-5"><div class="ssr-card-label">Preparation guide</div><div class="ssr-card-title">Year 5 Preparation →</div></a>
        <a class="ssr-card" href="/glossary/scaf"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">What is the SCAF? →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  const schemas = [
    breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Test Date 2026" }]),
    faqSchema(faqs),
    articleSchema(title, desc, url),
    eventSchema("Bucks 11 Plus Secondary Transfer Test 2026", "2026-09-01", "The Buckinghamshire 11+ Secondary Transfer Test for Year 6 children, sat in September 2026 at primary schools across Buckinghamshire."),
    eventSchema("Bucks 11 Plus Registration Deadline 2026", "2026-06-30", "Registration deadline for the Buckinghamshire Secondary Transfer Test for children sitting in September 2026."),
    eventSchema("Bucks 11 Plus Results Day 2026", "2026-10-15", "Release of qualified/not qualified results for the Buckinghamshire Secondary Transfer Test sat in September 2026."),
    eventSchema("National Offer Day 2027 (Buckinghamshire Grammar Schools)", "2027-03-01", "National Offer Day for Year 7 secondary school places, including Buckinghamshire grammar school offers for September 2027 entry."),
  ];

  return ssrShell({ title, description: desc, canonical: url, schemas, body });
}

// ─── TEST DATE 2025 ──────────────────────────────────────────────────────────

export function getTestDate2025Html(): string {
  const url = `${BASE}/bucks-11-plus-test-date-2025`;
  const title = "Bucks 11 Plus Test Date 2025: Key Dates & Deadlines | Bucks 11 Plus Tests";
  const desc = "Bucks 11 Plus 2025 test information: registration deadline (June 2025), test day (September 2025), results (October 2025), SCAF deadline (November 2025), National Offer Day (1 March 2026).";

  const faqs = [
    { question: "When was the Bucks 11 Plus test in 2025?", answer: "The Buckinghamshire Secondary Transfer Test for the 2025 cohort was sat in September 2025, typically in the first two weeks of the autumn term. Children in Year 6 during the 2025/26 academic year sat the test at their primary school." },
    { question: "When did 2025 Bucks 11 Plus results come out?", answer: "Results for the September 2025 test were released in October 2025 — approximately three to four weeks after the test date. Families received a 'qualified' or 'not qualified' outcome. The SCAF deadline followed in October/November 2025." },
    { question: "When is National Offer Day for the 2025 cohort?", answer: "For children who sat the 2025 test and are due to start secondary school in September 2026, National Offer Day is 1 March 2026 (or the next working day if it falls on a weekend). Grammar school place offers are released on this date." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Test Date 2025" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">2025 Key Dates</span>
      <h1 class="ssr-h1">Bucks 11 Plus Test Date 2025: Key Dates for the 2025 Cohort</h1>
      <p class="ssr-intro">Reference guide for families whose children sat the Buckinghamshire Secondary Transfer Test in September 2025. Full timeline from registration through to National Offer Day in March 2026.</p>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:1.25rem 1.5rem;margin:1.5rem 0;">
      <h2 style="font-family:'Libre Baskerville',serif;font-size:1rem;font-weight:700;color:#166534;margin-bottom:1rem;">2025 Bucks 11+ Key Dates</h2>
      <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
        <tr style="border-bottom:1px solid #bbf7d0;"><td style="padding:0.4rem 0.5rem;font-weight:600;color:#166534;width:45%;">Event</td><td style="padding:0.4rem 0.5rem;color:#166534;">Date</td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;">Registration deadline</td><td style="padding:0.4rem 0.5rem;">June 2025</td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>Test day</strong></td><td style="padding:0.4rem 0.5rem;"><strong>September 2025</strong></td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>Results released</strong></td><td style="padding:0.4rem 0.5rem;"><strong>October 2025</strong></td></tr>
        <tr style="border-bottom:1px solid #d1fae5;"><td style="padding:0.4rem 0.5rem;"><strong>SCAF deadline</strong></td><td style="padding:0.4rem 0.5rem;"><strong>October/November 2025</strong></td></tr>
        <tr><td style="padding:0.4rem 0.5rem;"><strong>National Offer Day</strong></td><td style="padding:0.4rem 0.5rem;"><strong>1 March 2026</strong></td></tr>
      </table>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>For Families Currently Preparing (2026 Cohort)</h2>
      <p>If your child is currently in Year 4 or Year 5 and preparing for the <strong>2026</strong> test, see our dedicated <a href="/bucks-11-plus-test-date-2026" style="color:#0e1f30;text-decoration:underline;">2026 test date guide</a> for the full timeline relevant to your cohort.</p>
      <h2>After the October 2025 Results</h2>
      <p>Families who received 'qualified' in October 2025 should have submitted their Secondary Common Application Form (SCAF) listing grammar school preferences by the October/November 2025 deadline. National Offer Day for this cohort is 1 March 2026 — the date when grammar school place offers are released for all qualifying children who applied on time.</p>
      <h2>Waiting Lists After Offer Day</h2>
      <p>Children who are qualified but did not receive a grammar school offer on Offer Day are placed on the waiting list for any listed schools. Offers from waiting lists can be made throughout the spring and summer as other children decline places. Families can remain on the waiting list while accepting an alternative school offer. Grammar school waiting lists do not expire — families can stay on until the start of the school year.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-test-date-2026"><div class="ssr-card-label">Next cohort</div><div class="ssr-card-title">2026 Test Date Guide →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-qualifying-score"><div class="ssr-card-label">Score guide</div><div class="ssr-card-title">The 121 Qualifying Score →</div></a>
        <a class="ssr-card" href="/glossary/national-offer-day"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">National Offer Day →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({
    title, description: desc, canonical: url, schemas: [
      breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Test Date 2025" }]),
      faqSchema(faqs), articleSchema(title, desc, url),
    ], body,
  });
}

// ─── PAST PAPERS ────────────────────────────────────────────────────────────

export function getPastPapersHtml(): string {
  const url = `${BASE}/bucks-11-plus-past-papers`;
  const title = "Bucks 11 Plus Past Papers & Practice Materials: The Complete Guide | Bucks 11 Plus Tests";
  const desc = "Are there Bucks 11 Plus past papers? What practice papers to use, where to get them, and how to use them effectively. GL Assessment-style materials guide for Buckinghamshire families.";

  const faqs = [
    { question: "Are there official Bucks 11 Plus past papers?", answer: "No. GL Assessment and The Buckinghamshire Grammar Schools do not release actual past papers from previous years' Secondary Transfer Tests. The test papers are confidential and are not made available to the public after the test has taken place. This is unlike some other exam systems (such as independent school 11+ papers) where past papers are occasionally released. The best alternative is GL Assessment-style specimen and practice papers from specialist publishers." },
    { question: "What practice papers should I use for the Bucks 11+?", answer: "The most directly relevant materials are GL Assessment-format practice papers and books. Publishers including CGP and Hodder Education produce comprehensive practice sets for the GL Assessment format. These are specifically designed to replicate the question styles, format, and difficulty level used in the Buckinghamshire Secondary Transfer Test. Ensure any materials you use are explicitly marked as 'GL Assessment format' — CEM-format papers (used in other areas) have different question styles and are less relevant." },
    { question: "How many practice papers should my child complete before the test?", answer: "Most preparation specialists recommend completing between 10 and 20 full timed practice papers before the test. The exact number matters less than the quality of the review process afterwards. Completing a paper and not reviewing errors systematically is far less effective than completing fewer papers with careful analysis of each wrong answer by question type. Practice papers should be introduced in the spring or summer term of Year 5, not at the start of preparation." },
    { question: "Should practice papers be done under timed conditions?", answer: "Yes, and increasingly so as the test date approaches. Early in preparation, working through papers without time pressure helps children learn the question formats and understand where they make errors. From the spring term of Year 5 onwards, all practice papers should be completed under strict timed conditions — two 45-minute sittings, ideally with audio instructions, to replicate the actual test experience. The audio format specifically (where a recorded voice controls the pace) should be practised before the real test." },
    { question: "Are free 11+ practice papers available online?", answer: "Some free sample questions and mini-tests are available online, including the free 12-question readiness check on Bucks 11 Plus Tests, which covers all four domains. A complete set of GL Assessment-style practice papers comparable to the full test is not available for free — the most comprehensive practice materials require purchase from specialist publishers or digital platforms." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Past Papers" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Practice Materials</span>
      <h1 class="ssr-h1">Bucks 11 Plus Past Papers & Practice Materials: What to Use and How</h1>
      <p class="ssr-intro">One of the most common questions from parents beginning 11+ preparation is whether official past papers are available. The short answer is no — but there are high-quality alternatives that closely replicate the Secondary Transfer Test. Here is the complete guide.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Why Official Past Papers Are Not Available</h2>
      <p>GL Assessment and The Buckinghamshire Grammar Schools (TBGS) do not publish previous years' Secondary Transfer Test papers. The papers are designed to be used fresh each year, and releasing them would compromise the integrity of the test for future cohorts. This is different from some other selective assessment systems — for example, many independent schools release past papers voluntarily, and some state grammar areas (outside Buckinghamshire) have released specimen materials. The Bucks 11+ does not.</p>
      <p>This means families cannot use 'the actual questions' for practice. However, the question format used by GL Assessment is consistent and well-documented, and high-quality third-party practice materials are widely available.</p>

      <h2>The Best Practice Paper Alternatives</h2>
      <p>The following types of materials are most directly relevant to the Buckinghamshire Secondary Transfer Test:</p>
      <ul>
        <li><strong>GL Assessment official specimen materials</strong> — GL Assessment produces a limited range of official specimen papers and sample questions available through their website and authorised resellers. These are directly from the test provider and use exactly the right format.</li>
        <li><strong>CGP 11+ practice papers (GL Assessment format)</strong> — CGP produces extensive GL Assessment-format practice packs covering all four domains: Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. These are widely regarded as the closest commercially available equivalent to the real test.</li>
        <li><strong>Hodder Education 11+ practice papers</strong> — Another well-established publisher of GL Assessment-format materials. Their packs include timed practice papers with score conversion guides.</li>
        <li><strong>Digital platforms with adaptive GL-style questions</strong> — Online platforms (including Bucks 11 Plus Tests) provide adaptive question banks in the GL Assessment format, with the advantage that performance data identifies which specific question types need more practice — something paper-based materials cannot do.</li>
      </ul>

      <h2>How to Use Practice Papers Effectively</h2>
      <p>The most common mistake families make with practice papers is completing too many too early, without systematically analysing performance. Here is an effective approach:</p>
      <ul>
        <li><strong>Start with domain-specific practice</strong> (not full papers) — Identify and address weak question types in each domain before using timed papers as a whole. A readiness check at the start of Year 5 tells you exactly which areas need the most attention.</li>
        <li><strong>Introduce timed papers from spring/summer of Year 5</strong> — Once skills are developed, begin completing full papers under strict timed conditions. Start with one sitting at a time, then build to both papers in sequence.</li>
        <li><strong>Review every wrong answer by question type</strong> — After each paper, categorise errors: was it a timing issue, a conceptual gap, or careless reading? Errors that cluster by question type indicate a specific weakness to address with targeted practice.</li>
        <li><strong>Use audio instructions for the final 6–8 weeks</strong> — The Secondary Transfer Test uses a recorded voice to control timing. This is genuinely different from self-timed practice. Audio-format mock tests are essential preparation for the specific experience of test day.</li>
      </ul>

      <h2>How Many Papers Are Enough?</h2>
      <p>Quality beats quantity. Children who complete 15 papers with careful error analysis typically outperform those who rush through 30 papers without reviewing. As a general guide: 10–15 complete papers completed between the spring term of Year 5 and test day in September of Year 6 is a reasonable target. More important than the number is ensuring the final 4–6 papers are completed under strict timed conditions, with audio instructions, in one sitting.</p>

      <h2>Free Practice Options</h2>
      <p>A free 12-question GL-style readiness check is available on this platform — it covers all four test domains and returns an instant indicative readiness score and readiness band benchmarked against the 121 qualifying standard. This is a useful starting point before purchasing paper-based materials. It does not replace full practice papers, but it identifies which domains need the most preparation time.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-sample-questions"><div class="ssr-card-label">Examples</div><div class="ssr-card-title">Sample Question Guide →</div></a>
        <a class="ssr-card" href="/preparing-for-11-plus-year-5"><div class="ssr-card-label">Preparation guide</div><div class="ssr-card-title">Year 5 Preparation →</div></a>
        <a class="ssr-card" href="/11-plus-verbal-reasoning-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">Verbal Reasoning →</div></a>
        <a class="ssr-card" href="/11-plus-non-verbal-reasoning-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">Non-Verbal Reasoning →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Past Papers" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── RESULTS GUIDE ───────────────────────────────────────────────────────────

export function getResultsGuideHtml(): string {
  const url = `${BASE}/bucks-11-plus-results`;
  const title = "Bucks 11 Plus Results: When They Come Out & What They Mean | Bucks 11 Plus Tests";
  const desc = "When do Bucks 11 Plus results come out? What 'qualified' and 'not qualified' mean, what to do next, how to get your child's score, and the next steps for grammar school applications.";

  const faqs = [
    { question: "When do Bucks 11 Plus results come out?", answer: "Results for the Buckinghamshire Secondary Transfer Test are released in October of Year 6, typically around three to four weeks after the test date. For children who sat the September 2025 test, results come out in October 2025. For children sitting in September 2026, results come out in October 2026. Buckinghamshire Council publishes the exact results date each year." },
    { question: "What does 'qualified' mean?", answer: "'Qualified' means your child achieved a standardised score of 121 or above on the Secondary Transfer Test. This makes them eligible to apply for grammar school places in Buckinghamshire. It does not guarantee a place at any specific grammar school — that depends on each school's oversubscription criteria, primarily distance." },
    { question: "What does 'not qualified' mean?", answer: "'Not qualified' means your child scored below 121 on the standardised score. They cannot apply for state grammar school places in Buckinghamshire through the normal admissions route. Non-qualifying children will be offered places at comprehensive secondary schools based on their SCAF preferences." },
    { question: "Can I find out my child's actual score?", answer: "Yes, but not automatically. The initial results communication only states 'qualified' or 'not qualified'. Parents can request their child's actual standardised score from Buckinghamshire Council after results are released. The score is not used in admissions (only the threshold matters), but knowing it can be helpful for understanding performance and planning next steps." },
    { question: "My child didn't qualify — are there any options?", answer: "There are several options: (1) Appeal — if you believe there were exceptional circumstances that affected performance, there is a formal appeals process. (2) Apply to late grammar test (Year 7 entry) — some grammar schools occasionally admit pupils directly into Year 7 or Year 8 if places become available, through their own assessment process. (3) Apply to comprehensive schools through normal admissions — non-qualifying children can still attend excellent comprehensive secondary schools. (4) Re-sit — there is no facility to re-sit the Secondary Transfer Test, but some grammar schools (particularly in neighbouring areas or independent schools) have their own entrance exams that can be sat independently." },
    { question: "My child qualified — what happens next?", answer: "After receiving a 'qualified' result, parents must submit the Secondary Common Application Form (SCAF) listing up to three grammar school preferences, along with comprehensive school preferences. The SCAF deadline is typically in October or November. Do not miss this deadline. Place offers are then made on National Offer Day in March." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Results" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Results Guide</span>
      <h1 class="ssr-h1">Bucks 11 Plus Results: When They Come Out and What to Do Next</h1>
      <p class="ssr-intro">Results for the Buckinghamshire Secondary Transfer Test are released in October of Year 6. Here is everything parents need to know: when results arrive, what qualified and not qualified mean, how to get your child's actual score, and the critical next steps.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>When Do Results Come Out?</h2>
      <p>Results are released in October of Year 6 — typically around three to four weeks after the September test date. Buckinghamshire Council publishes the exact results date for each year. Results are communicated to parents by letter and/or email, and may also be available through an online parent portal.</p>

      <h2>What the Result Means</h2>
      <p><strong>Qualified (121 or above)</strong>: Your child has met the Buckinghamshire grammar school standard. They are eligible to apply for grammar school places. This is not a guarantee of a place — it means they can be considered. Places at oversubscribed grammar schools are then allocated by each school's oversubscription criteria, primarily distance from the school.</p>
      <p><strong>Not qualified (below 121)</strong>: Your child did not reach the standardised score threshold. They are not eligible for state grammar school places in Buckinghamshire through the standard admissions route. There are still options — see the FAQ section below for details.</p>

      <h2>Getting Your Child's Actual Score</h2>
      <p>The initial results letter states only 'qualified' or 'not qualified'. The actual standardised score is not included automatically. Parents who wish to know their child's score can request it from Buckinghamshire Council — the process and any associated forms are confirmed each year on the Council's website. The score is useful for understanding how far above or below the threshold your child performed, which can inform decisions about appeals or alternative school options.</p>

      <h2>If Your Child Is Qualified: Next Steps</h2>
      <p>After receiving a qualified result, the critical next step is submitting the Secondary Common Application Form (SCAF). The SCAF allows you to list up to three grammar school preferences and up to three comprehensive school preferences. The SCAF deadline is typically in October or November — check the current year's deadline with Buckinghamshire Council immediately after receiving results. Missing the SCAF deadline means your application is treated as late.</p>
      <p>Grammar school preference order on the SCAF matters. List schools in genuine preference order — the form is processed as a ranked list, and schools only see whether you have listed them (not in what position), so there is no strategic benefit to placing a school anywhere other than its true preference position.</p>

      <h2>If Your Child Is Not Qualified: Options</h2>
      <p>Not qualifying is not the end of the road for secondary school. Buckinghamshire has strong comprehensive secondary schools, and non-qualifying children apply through the standard admissions process. Additional options include: the formal appeals process (if exceptional circumstances affected performance), late grammar entry in Year 7 or Year 8 at schools that occasionally admit mid-year, and independent school entry which has separate examinations. Some families also consider grammar schools in neighbouring counties (Hertfordshire, Oxfordshire) that have their own entry tests.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-test-date-2026"><div class="ssr-card-label">Key dates</div><div class="ssr-card-title">2026 Test Date & Timeline →</div></a>
        <a class="ssr-card" href="/glossary/scaf"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">What is the SCAF? →</div></a>
        <a class="ssr-card" href="/glossary/qualifying-score"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">Qualifying Score (121) →</div></a>
        <a class="ssr-card" href="/bucks-grammar-schools"><div class="ssr-card-label">All 13 schools</div><div class="ssr-card-title">Grammar Schools →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Results" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── SAMPLE QUESTIONS ────────────────────────────────────────────────────────

export function getSampleQuestionsHtml(): string {
  const url = `${BASE}/bucks-11-plus-sample-questions`;
  const title = "Bucks 11 Plus Sample Questions: What to Expect in Each Domain | Bucks 11 Plus Tests";
  const desc = "What do Bucks 11 Plus questions actually look like? Sample question descriptions, worked examples, and difficulty guides for Verbal Reasoning, Non-Verbal Reasoning, Maths, and Comprehension.";

  const faqs = [
    { question: "What types of questions appear in the Bucks 11+?", answer: "The Buckinghamshire Secondary Transfer Test covers four domains: Verbal Reasoning (word relationships, letter codes, analogies, compound words, hidden words), Non-Verbal Reasoning including spatial reasoning (matrices, sequences, reflections, rotations, nets, cube views), Mathematical Reasoning (number operations, fractions, percentages, ratio, algebra, word problems, shape, data), and English Comprehension (literal retrieval, inference, vocabulary in context, language technique)." },
    { question: "How hard are the Bucks 11+ questions?", answer: "The questions range from straightforward (children who have prepared should find these accessible) to challenging (designed to differentiate between high-performing children). The difficulty progression means that many children find early questions in each section comfortable and later questions more stretching. The primary challenge is not just difficulty but pace — children must work accurately and quickly under timed audio-controlled conditions." },
    { question: "Are there any free sample questions available?", answer: "Yes. Bucks 11 Plus Tests offers a free 12-question GL-style readiness check that covers all four domains with real sample questions. GL Assessment also publishes a small number of specimen questions on their website. The most comprehensive free starting point is the readiness check on this platform, which returns an instant score and identifies which domains need the most preparation." },
    { question: "How is the 11+ different from SATs questions?", answer: "SATs assess the national curriculum up to the end of Key Stage 2. The 11+ goes further in content (maths topics extend into Year 6 and beyond), uses a different format (multiple choice with five options rather than written answers), is delivered under strict timed audio conditions (rather than child-paced), and includes non-verbal reasoning which is not assessed in SATs at all. Children who perform well in SATs do not necessarily find the 11+ straightforward — specific preparation is needed." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Sample Questions" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Question Guide</span>
      <h1 class="ssr-h1">Bucks 11 Plus Sample Questions: What Each Domain Looks Like</h1>
      <p class="ssr-intro">GL Assessment does not release actual past papers, but the question formats are consistent and well-documented. Here is a guide to what children encounter in each of the four domains of the Buckinghamshire Secondary Transfer Test — with example question types and preparation notes.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>How the Test Is Structured</h2>
      <p>The Buckinghamshire Secondary Transfer Test consists of two 45-minute papers. All questions are multiple choice — children select one answer from five options (A–E) by shading a bubble on a separate answer sheet. All instructions are delivered by audio recording. Questions across all four domains are mixed throughout the two papers. Children do not know in advance which question types will appear in which order.</p>

      <h2>Verbal Reasoning: Sample Question Types</h2>
      <div class="ssr-qtype-grid">
        <div class="ssr-qtype"><strong>Word analogies</strong><span>Example: "Warm is to Hot as Cool is to ?" — children must identify the relationship and complete it (answer: Cold)</span></div>
        <div class="ssr-qtype"><strong>Letter codes</strong><span>Example: "If FISH = GJTI, what does BIRD equal?" Children decode the pattern and apply it (each letter moved forward by 1, answer: CJSE)</span></div>
        <div class="ssr-qtype"><strong>Compound words</strong><span>Example: "What word completes both SUN___ and ___LIGHT?" (answer: LIGHT → SUNLIGHT; LIGHT → LIGHTHOUSE — finding the connecting word)</span></div>
        <div class="ssr-qtype"><strong>Odd one out</strong><span>Example: "Which word does not belong: Crimson, Scarlet, Vermillion, Cobalt, Ruby?" (answer: Cobalt — the only blue, not red)</span></div>
        <div class="ssr-qtype"><strong>Hidden words</strong><span>Example: "Find a word hidden across two consecutive words: 'The STAMP ENDED the argument'" (answer: PEND — stamPENDed)</span></div>
        <div class="ssr-qtype"><strong>Number sequences in VR</strong><span>Example: "What number comes next in: 3, 6, 11, 18, 27, ?" (answer: 38 — differences of 3, 5, 7, 9, 11)</span></div>
      </div>

      <h2>Non-Verbal Reasoning: Sample Question Types</h2>
      <div class="ssr-qtype-grid">
        <div class="ssr-qtype"><strong>Matrices</strong><span>A 3×3 or 2×2 grid of shapes where each row and column follows rules of shape, size, colour, or pattern. Children select the missing piece from five options.</span></div>
        <div class="ssr-qtype"><strong>Sequences</strong><span>A series of shapes that change according to a rule (rotation, number of sides, size, shading). Children identify the next shape in the series.</span></div>
        <div class="ssr-qtype"><strong>Reflections</strong><span>A shape is shown alongside a mirror line. Children identify which of five options shows the correct mirror image.</span></div>
        <div class="ssr-qtype"><strong>Rotations</strong><span>A shape is shown alongside a rotation instruction (e.g. 90° clockwise). Children identify the correctly rotated version.</span></div>
        <div class="ssr-qtype"><strong>Nets</strong><span>A 2D net (unfolded shape) is shown. Children identify which 3D shape it would make when folded, or which net matches a given 3D shape.</span></div>
        <div class="ssr-qtype"><strong>Cube views</strong><span>A cube with symbols on each face is shown from one angle. Children identify what the cube looks like from a different specified angle.</span></div>
      </div>

      <h2>Mathematical Reasoning: Sample Question Types</h2>
      <div class="ssr-qtype-grid">
        <div class="ssr-qtype"><strong>Fractions &amp; percentages</strong><span>Example: "What is 35% of 240?" (answer: 84). All mental arithmetic — no working allowed, multiple choice format.</span></div>
        <div class="ssr-qtype"><strong>Word problems</strong><span>Example: "Tickets cost £6.50 for adults and £3.75 for children. How much do 2 adults and 3 children pay altogether?" (answer: £24.25)</span></div>
        <div class="ssr-qtype"><strong>Ratio &amp; proportion</strong><span>Example: "A recipe uses flour, sugar and butter in the ratio 4:2:1. If 200g of flour is used, how much sugar is needed?" (answer: 100g)</span></div>
        <div class="ssr-qtype"><strong>Algebra</strong><span>Example: "If 3x + 7 = 22, what is x?" (answer: 5). Simple equation solving under time pressure.</span></div>
        <div class="ssr-qtype"><strong>Shape &amp; area</strong><span>Example: "A rectangle has a perimeter of 36cm. Its length is twice its width. What is its area?" (answer: 72cm²)</span></div>
        <div class="ssr-qtype"><strong>Data &amp; averages</strong><span>Example: "The mean of five numbers is 12. Four of the numbers are 8, 11, 15, 14. What is the fifth?" (answer: 12)</span></div>
      </div>

      <h2>English Comprehension: What to Expect</h2>
      <p>The comprehension section is based on a passage of text — typically 250–500 words, either literary (a fiction extract) or non-fiction (an article or informational text). Questions are asked in sequence through the passage. Question types include:</p>
      <ul>
        <li><strong>Literal retrieval</strong>: Find information stated directly in the passage ("According to the text, how many days did the journey take?")</li>
        <li><strong>Inference</strong>: Deduce meaning not directly stated ("What does the passage suggest about how the character feels about the journey?")</li>
        <li><strong>Vocabulary in context</strong>: Identify the meaning of a specific word or phrase as used in the passage ("In line 8, the word 'reluctant' most closely means…")</li>
        <li><strong>Author's technique</strong>: Why did the author choose specific language or structure ("Why does the author use a list in paragraph 2?")</li>
        <li><strong>Summary</strong>: Identify the main idea of a section or the whole passage</li>
      </ul>
      <p>All comprehension answers must be justified from the text. Using general knowledge rather than textual evidence is the most common reason for losing marks in this section.</p>

      <h2>Try Free Sample Questions</h2>
      <p>The free readiness check on Bucks 11 Plus Tests includes 12 GL-style questions across all four domains — the fastest way to experience the actual question format and receive an instant score estimate. No account needed.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Subject Guides</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/11-plus-verbal-reasoning-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">Verbal Reasoning →</div></a>
        <a class="ssr-card" href="/11-plus-non-verbal-reasoning-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">Non-Verbal Reasoning →</div></a>
        <a class="ssr-card" href="/11-plus-maths-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">Mathematical Reasoning →</div></a>
        <a class="ssr-card" href="/11-plus-comprehension-practice"><div class="ssr-card-label">Subject guide</div><div class="ssr-card-title">English Comprehension →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-past-papers"><div class="ssr-card-label">Materials guide</div><div class="ssr-card-title">Practice Papers →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Sample Questions" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── SCORE GUIDE ─────────────────────────────────────────────────────────────

export function getScoreGuideHtml(): string {
  const url = `${BASE}/bucks-11-plus-score-calculator`;
  const title = "Bucks 11 Plus Score Calculator & Scoring Explained | Bucks 11 Plus Tests";
  const desc = "How the Bucks 11 Plus standardised score is calculated. What raw scores map to, how age standardisation works, and what score your child needs to qualify. Free readiness check to estimate your child's score.";

  const faqs = [
    { question: "How is the Bucks 11 Plus score calculated?", answer: "The score is calculated in two stages. First, GL Assessment counts the total number of correct answers across both papers — this is the raw score. Second, this raw score is converted to a standardised score using age standardisation: a formula that adjusts the score based on the child's exact date of birth, so that younger children in the year group are not disadvantaged. The standardised score is what parents receive. A score of 100 represents exactly average for age; the qualifying threshold is 121." },
    { question: "Is there a Bucks 11 Plus score calculator I can use?", answer: "GL Assessment does not publish the raw-score-to-standardised-score conversion tables used for the actual Secondary Transfer Test, so it is not possible to calculate an exact predicted score from raw marks. The most reliable way to gauge your child's likely performance is through a GL Assessment-style readiness check that returns an indicative readiness score — such as the free readiness check on Bucks 11 Plus Tests, which benchmarks performance across all four domains against the 121 qualifying standard. This is an indicator only, not a substitute for the official GL standardised score." },
    { question: "What standardised score do I need to pass the 11+?", answer: "The qualifying threshold in Buckinghamshire is a standardised score of 121. A child who achieves 121 or above is 'qualified' and eligible to apply for grammar school places. A score below 121 is 'not qualified'. The standardised score of 100 represents average performance for age in the national cohort." },
    { question: "What percentage of children qualify for grammar school in Buckinghamshire?", answer: "The exact percentage varies year to year, but typically around 20–25% of children sitting the Secondary Transfer Test achieve the qualifying score of 121. Because the score is standardised against the national GL Assessment cohort (not only Buckinghamshire children), and because Buckinghamshire has a tradition of 11+ preparation, the proportion qualifying tends to be higher than the national average would suggest. Not all qualifying children receive grammar school place offers, as places are limited and allocated by distance." },
    { question: "What raw score is needed to get 121?", answer: "GL Assessment does not publish conversion tables for the Secondary Transfer Test. The mapping between raw score and standardised score changes each year depending on the difficulty of that year's papers. As an approximate guide based on practice paper conversion tables from equivalent GL Assessment products, achieving around 75–85% correct (approximately 100–120 questions out of 140) is broadly associated with scores in the qualifying range — but this varies significantly with age standardisation and paper difficulty. A readiness check gives a more reliable estimate." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Score Guide" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Scoring Explained</span>
      <h1 class="ssr-h1">How the Bucks 11 Plus Score Works: From Raw Marks to Standardised Score</h1>
      <p class="ssr-intro">Understanding how the Buckinghamshire 11+ is scored helps parents set realistic targets and interpret practice paper results. Here is a complete explanation of how raw scores become standardised scores, what 121 means, and the best way to estimate your child's current level.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Stage 1: The Raw Score</h2>
      <p>The raw score is simply the total number of questions answered correctly across both papers of the Secondary Transfer Test. There is no negative marking — incorrect answers and blank answers both score zero. The test typically contains around 130–140 questions in total. GL Assessment does not publish the exact question count for each year's papers.</p>
      <p>Because there is no penalty for wrong answers, children should always attempt every question — even if they are not confident, an educated guess has a 20% chance of being correct (one in five answer options). Leaving questions blank scores the same as a wrong answer but without even the chance of a point.</p>

      <h2>Stage 2: Age Standardisation</h2>
      <p>The raw score is then converted to a standardised score using age standardisation. This is a statistical adjustment that accounts for a child's exact date of birth — specifically, how many months they are from the cutoff date (1 September). A child born in August is almost exactly 12 months younger than a September-born child in the same Year 6 cohort. Without standardisation, younger children would be systematically disadvantaged.</p>
      <p>The standardised score is designed so that 100 represents exactly average performance for age. A child who performs at exactly the national average for their age group — not for their year group — receives a score of 100. The standard deviation is set so that approximately 68% of children score between 85 and 115.</p>

      <h2>The Qualifying Threshold: 121</h2>
      <p>The qualifying threshold for Buckinghamshire grammar schools is a standardised score of 121. This represents performance approximately 1.4 standard deviations above the national mean for age — roughly the top 8% of the national age cohort on the GL Assessment scale. In practice, because Buckinghamshire children are on average better prepared than the national cohort (given the long tradition of 11+ preparation in the county), the proportion of Buckinghamshire children achieving 121 is typically higher than 8% — around 20–25% in most years.</p>

      <h2>What Scores Above 121 Mean for Admissions</h2>
      <p>Once a child has qualified at 121, their exact score does not affect grammar school admissions. A child with 135 and a child with 121 are equal in the admissions process — both are qualified. Places at oversubscribed schools are then allocated by distance. Scoring significantly above 121 is not strategically important for admissions, but it does give parents more certainty that the result is reliable rather than borderline.</p>

      <h2>Estimating Your Child's Score</h2>
      <p>GL Assessment does not publish raw-score-to-standardised-score conversion tables for the Secondary Transfer Test. Practice paper publishers (CGP, Hodder) publish approximate conversion guides for their own materials, but these are approximations and the actual conversion changes with each year's paper difficulty.</p>
      <p>The most reliable way to gauge your child's likely performance is through a validated readiness check. The free readiness check on Bucks 11 Plus Tests covers all four domains in GL Assessment question style and returns an instant indicative readiness score benchmarked against the 121 qualifying standard, with a readiness band (Approaching, On Track, Secure). The indicative readiness score is an indicator only and is not a substitute for the official GL standardised score.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-qualifying-score"><div class="ssr-card-label">Score guide</div><div class="ssr-card-title">The 121 Qualifying Score →</div></a>
        <a class="ssr-card" href="/glossary/age-standardisation"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">Age Standardisation →</div></a>
        <a class="ssr-card" href="/glossary/standardised-score"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">Standardised Score →</div></a>
        <a class="ssr-card" href="/how-forecast-works"><div class="ssr-card-label">Platform guide</div><div class="ssr-card-title">How Our Scoring Works →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Score Guide" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── TUTORS GUIDE ────────────────────────────────────────────────────────────

export function getTutorsGuideHtml(): string {
  const url = `${BASE}/11-plus-tutors-buckinghamshire`;
  const title = "11 Plus Tutors in Buckinghamshire: How to Find One & What to Look For | Bucks 11 Plus Tests";
  const desc = "Guide to finding a good 11+ tutor in Buckinghamshire. What to look for, what questions to ask, how much tutoring costs, and when a digital platform is a better alternative.";

  const faqs = [
    { question: "Do I need a tutor for the Bucks 11+?", answer: "No — tutoring is not a requirement. Many children prepare successfully using digital platforms, practice papers, and parental support alone. A tutor adds value when: (1) a child has specific gaps that are hard to address without subject expertise, (2) a child works better with structured one-to-one accountability, or (3) parents do not have the time to manage preparation themselves. Tutoring is an input to preparation, not a guarantee of a qualifying score." },
    { question: "How much does 11+ tutoring cost in Buckinghamshire?", answer: "Private 11+ tutors in Buckinghamshire typically charge £40–£80 per hour for one-to-one sessions, with experienced and well-reviewed tutors often at the higher end. Group tutoring (2–4 children) is available from some providers at £20–£40 per child per hour. Weekly tutoring from September of Year 5 to August of Year 6 (approximately 45 sessions) at £50/hour represents a total cost of around £2,250. Some families supplement tutoring with digital platforms to reduce the number of tutor sessions needed." },
    { question: "When should I start 11+ tutoring?", answer: "Most families who use tutors begin in September or January of Year 5 — approximately 9 to 12 months before the September Year 6 test. Starting earlier than Year 5 is generally not recommended unless a specific long-term gap has been identified. Starting later than Easter of Year 5 significantly reduces the available preparation window. A readiness check at the start of tutoring tells the tutor precisely where to focus." },
    { question: "What should I look for in an 11+ tutor?", answer: "Key questions to ask: (1) Do they have specific experience with GL Assessment-format papers (not just general 11+ experience)? (2) Do they assess where a child is at the start and tailor sessions to specific gaps? (3) Can they provide references from Bucks families? (4) How do they track progress? A tutor who works through practice papers without diagnosing and targeting specific weaknesses is less effective than one who adapts to the child's individual profile." },
    { question: "Is online tutoring as effective as in-person for the 11+?", answer: "For most children, online tutoring is equally effective for academic content delivery. The 11+ involves working through questions and explanations that translate well to online delivery with screen sharing. Some children find in-person interaction easier for focus and rapport. Practical considerations (travel time, availability, cost) often make online tutoring the more flexible and accessible option in Buckinghamshire, particularly for families outside High Wycombe or Aylesbury." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Tutors Guide" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Tutoring Guide</span>
      <h1 class="ssr-h1">Finding an 11 Plus Tutor in Buckinghamshire: A Practical Guide for Parents</h1>
      <p class="ssr-intro">Tutoring is one of the most common approaches to Bucks 11+ preparation — but not all tutors are equally effective, and tutoring is not the only path to a qualifying score. Here is what to look for, what questions to ask, and when a digital platform might be a better or complementary choice.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Do You Need a Tutor?</h2>
      <p>Tutoring can be highly effective when used well — but it is an input, not a guarantee. The most important factor in 11+ preparation is targeted, gap-focused practice. A tutor who identifies a child's specific weaknesses across the four test domains and addresses them systematically is valuable. A tutor who works through practice papers without readiness insight is less so.</p>
      <p>Many families prepare successfully without any tutoring, using a combination of a readiness check, targeted practice by domain, and timed full mock papers. Others use a digital platform alongside minimal tutoring to maximise cost-effectiveness. The right approach depends on your child's learning style, the availability of good tutors locally, and your budget.</p>

      <h2>What to Look For in an 11+ Tutor</h2>
      <ul>
        <li><strong>GL Assessment-specific experience</strong> — Buckinghamshire uses GL Assessment format. A tutor experienced only with CEM papers (used in other areas) will be less effective. Ask specifically about GL Assessment experience and which counties and schools they have prepared children for.</li>
        <li><strong>Readiness-led approach</strong> — Good tutors begin with an assessment of where the child currently is, not by launching into a practice paper. They should be able to tell you within the first two sessions where the child's specific weaknesses are across all four domains.</li>
        <li><strong>A structured progression plan</strong> — Not just "we'll work through papers" — a specific plan covering which topics are addressed when, and how progress is measured.</li>
        <li><strong>References from Bucks families</strong> — Ask for references and ask specifically about results: did the children they prepared qualify? Were their predictions broadly accurate?</li>
        <li><strong>Realistic expectations</strong> — A tutor who guarantees results or suggests your child is certain to qualify (without evidence) should be treated with caution. Good tutors give honest assessments of where a child is and what is realistically achievable in the preparation window.</li>
      </ul>

      <h2>Questions to Ask Before Hiring a Tutor</h2>
      <ul>
        <li>Have you prepared children specifically for the Buckinghamshire Secondary Transfer Test?</li>
        <li>How do you assess where my child is at the start?</li>
        <li>How do you track progress and share it with parents?</li>
        <li>What is your approach if we are 6 months out and my child is still below the qualifying level?</li>
        <li>What do your sessions look like — are they led by you or largely independent practice?</li>
        <li>Can you provide contact details for two or three Buckinghamshire families you have worked with?</li>
      </ul>

      <h2>Costs and Typical Session Structure</h2>
      <p>One-to-one private tutors in Buckinghamshire typically charge £40–£80 per hour. Many families use weekly sessions of 60–90 minutes. Group tutoring (small groups of 2–4) is available from some providers at lower cost per child, typically £20–£40 per child per session. Online tutors often charge slightly less than in-person equivalents and provide access to tutors across the country rather than only those local to your area.</p>
      <p>A common approach: a tutor for 60-minute weekly sessions from September of Year 5, reducing to fortnightly once specific gaps are addressed, then moving to self-managed timed paper practice in the summer holidays. This pattern uses tutoring where it adds most value (gap identification and addressing specific weaknesses) while not creating dependency for work that can be done independently.</p>

      <h2>Digital Platforms as an Alternative or Supplement</h2>
      <p>Readiness-led digital platforms offer several advantages over tutoring for some families: they are significantly lower cost, available at any time, and crucially, they provide performance data by question type that tells you precisely where a child's gaps are — the same information a good tutor would spend several sessions to identify. Many families use a digital platform to identify gaps and measure progress, and either manage preparation themselves or bring in a tutor for a smaller number of targeted sessions rather than ongoing weekly tutoring throughout Year 5.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/preparing-for-11-plus-year-5"><div class="ssr-card-label">Preparation guide</div><div class="ssr-card-title">Year 5 Preparation →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-past-papers"><div class="ssr-card-label">Materials guide</div><div class="ssr-card-title">Practice Papers →</div></a>
        <a class="ssr-card" href="/how-it-works"><div class="ssr-card-label">Platform guide</div><div class="ssr-card-title">How Bucks 11 Plus Tests Works →</div></a>
        <a class="ssr-card" href="/pricing"><div class="ssr-card-label">Pricing</div><div class="ssr-card-title">Platform Pricing →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Tutors Guide" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── APPEALS GUIDE ──────────────────────────────────────────────────────────

export function getAppealsGuideHtml(): string {
  const url = `${BASE}/bucks-11-plus-appeals`;
  const title = "Bucks 11 Plus Appeals: What You Can & Cannot Appeal | Bucks 11 Plus Tests";
  const desc = "Can you appeal a Bucks 11 Plus result? Guide to the grammar school admissions appeal process in Buckinghamshire — what grounds exist, the timeline, and realistic outcomes.";

  const faqs = [
    { question: "Can you appeal the Bucks 11 Plus result?", answer: "There is no formal appeal against the 11+ score itself. GL Assessment administers the marking process and the result is considered final. However, if you believe exceptional circumstances affected your child's performance on test day (for example, illness, a family bereavement, or a testing centre error), there is a review process where you can present evidence of those circumstances. This review may result in the score being reconsidered, but there is no guarantee. The review process is managed by Buckinghamshire Council." },
    { question: "Can you appeal a grammar school admissions decision?", answer: "Yes. If a qualifying child is refused a place at their preferred grammar school (because they were outside the distance threshold), parents have the right to appeal to an independent admissions appeal panel. The appeal is not about the 11+ score — it is about the school's application of its oversubscription criteria. Appeals for grammar schools in Buckinghamshire are heard by an independent panel and are subject to the School Admissions Appeals Code." },
    { question: "How successful are grammar school admissions appeals in Buckinghamshire?", answer: "Grammar school admissions appeals are difficult to win at schools that are significantly oversubscribed. Appeals based on distance criteria (where the only issue is that the child lives outside the distance cut-off) are almost never successful, because the School Admissions Appeals Code only allows appeals to succeed where the school has made an error in applying its criteria, or where the child's case for exceptional need is overwhelming. Families with specific compelling circumstances (for example, a medical need tied to a particular school's facilities) have stronger grounds. General 'my child performed better than the score suggests' arguments do not constitute grounds for appeal." },
    { question: "What is the timeline for grammar school admissions appeals?", answer: "Appeals must be lodged within 20 school days of receiving the initial refusal letter on National Offer Day (typically 1 March). Appeals are usually heard by the end of the summer term. Outcome letters follow within a few days of the hearing. If the appeal is successful, the child is admitted. If unsuccessful, the decision is final for that school." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Appeals" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Appeals Guide</span>
      <h1 class="ssr-h1">Bucks 11 Plus Appeals: Score Reviews and Admissions Appeals Explained</h1>
      <p class="ssr-intro">There are two distinct types of appeal in the Bucks 11+ process: a review of the test result itself (rare, exceptional circumstances only) and an appeal against a grammar school admissions decision (more common). Here is how each works, the grounds required, and realistic expectations.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Reviewing a 11+ Result: Exceptional Circumstances</h2>
      <p>There is no standard mechanism to re-mark or re-sit the Secondary Transfer Test. The test is designed to be a single assessment, and scores are considered final. However, if you believe your child's performance was significantly affected by circumstances beyond their control on test day — serious illness, a family emergency, a documented testing irregularity — you can contact Buckinghamshire Council to begin a review process.</p>
      <p>Evidence is required: a doctor's letter dated on or around test day, school communications about the circumstance, or other documented evidence. Anecdotal descriptions of a child being 'not themselves' on the day are insufficient. The bar for a result review is high, and the outcome is not guaranteed. If you believe exceptional circumstances apply, contact Buckinghamshire Council's admissions team as soon as possible after receiving results.</p>

      <h2>Grammar School Place Appeals: How They Work</h2>
      <p>If your qualifying child was refused a place at a listed grammar school (because they lived outside the distance threshold), you have the right to appeal. The appeal is heard by an independent appeals panel that is not connected to the school or Buckinghamshire Council.</p>
      <p>The panel considers: (1) whether the school correctly applied its oversubscription criteria, and (2) whether, on balance, the prejudice to the school of admitting an additional child is outweighed by the prejudice to the child of not being admitted. For highly oversubscribed grammar schools, the first test is almost impossible to satisfy unless the school made an administrative error. The second test requires demonstrating compelling specific reasons why this particular school is necessary for this child.</p>

      <h2>Realistic Expectations</h2>
      <p>Grammar school admissions appeals in Buckinghamshire have a low success rate where the sole reason for refusal is distance. This is not a deficiency in the appeals system — it reflects that the School Admissions Appeals Code was not designed to override legitimate oversubscription criteria that have been correctly applied. Families who approach appeals expecting to succeed on the basis that their child is bright or well-prepared are likely to be disappointed. Families with specific documented needs — medical circumstances, sibling connections not recognised in original applications, administrative errors — have stronger grounds.</p>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-results"><div class="ssr-card-label">Results guide</div><div class="ssr-card-title">When Results Come Out →</div></a>
        <a class="ssr-card" href="/glossary/oversubscription-criteria"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">Oversubscription Criteria →</div></a>
        <a class="ssr-card" href="/bucks-grammar-schools"><div class="ssr-card-label">All schools</div><div class="ssr-card-title">Grammar Schools →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Appeals" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

// ─── REGISTRATION DETAILED ──────────────────────────────────────────────────

export function getRegistrationDetailedHtml(): string {
  const url = `${BASE}/bucks-11-plus-registration-guide`;
  const title = "Bucks 11 Plus Registration: How to Register & Key Deadlines | Bucks 11 Plus Tests";
  const desc = "Step-by-step guide to registering for the Buckinghamshire Secondary Transfer Test. Who registers, the June deadline, out-of-county process, and what happens if you miss the deadline.";

  const faqs = [
    { question: "When does registration for the Bucks 11 Plus open and close?", answer: "Registration opens in the spring term of Year 5 — typically around January or February. It closes in June of Year 5. The exact dates are published each year by The Buckinghamshire Grammar Schools (TBGS) and Buckinghamshire Council on their official websites. Missing the June deadline means missing the test entirely — there are very limited provisions for late registration." },
    { question: "Who registers my child for the 11+?", answer: "In-county Buckinghamshire state primary school children are typically registered by their school once parents have indicated they wish their child to sit the test. The school handles the administrative process with Buckinghamshire Council. However, parents should not assume this has been done — confirm directly with the school office. Children at independent schools and out-of-county children must register directly with Buckinghamshire Council via the TBGS website." },
    { question: "Can children from outside Buckinghamshire sit the 11+?", answer: "Yes. The Secondary Transfer Test is open to any child in England. Out-of-county children must register directly with Buckinghamshire Council rather than through a school. They are assigned a test centre (typically a school in Buckinghamshire) rather than sitting at their own school. All other aspects of the test — format, marking, qualifying score — are identical for in-county and out-of-county children." },
    { question: "What happens if we miss the registration deadline?", answer: "Missing the June deadline effectively means your child cannot sit the test. Late registration is occasionally possible in genuinely exceptional circumstances (such as a family relocating to Buckinghamshire after the deadline), but there is no guarantee. Contact Buckinghamshire Council's admissions team immediately if you believe you have missed the deadline — the earlier you contact them, the more likely it is that a resolution can be found. Do not wait to see if the deadline is flexible; act immediately." },
    { question: "Is there a fee to register for the 11+?", answer: "No. Registration for the Buckinghamshire Secondary Transfer Test is free. The test is part of the state school admissions process in Buckinghamshire and has no registration fee. If you encounter a service claiming to charge for registration, contact Buckinghamshire Council directly to verify the process." },
  ];

  const body = `
    ${ssrBreadcrumbs([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Registration Guide" }])}
    <div class="ssr-hero">
      <span class="ssr-tag">Registration Guide</span>
      <h1 class="ssr-h1">How to Register for the Bucks 11 Plus: Step-by-Step Guide</h1>
      <p class="ssr-intro">Registration for the Buckinghamshire Secondary Transfer Test closes in June of Year 5. Missing this deadline means your child cannot sit the test. Here is exactly how registration works, who is responsible for it, and what to do if your situation is unusual.</p>
    </div>
    ${ssrCtaBox()}
    <section class="ssr-section">
      <h2>Step 1: Check If Your Child's School Registers Automatically</h2>
      <p>If your child attends a state primary school in Buckinghamshire, the school is responsible for registering them once you have indicated you wish them to sit the test. The school typically sends out information to Year 5 parents in the spring term asking who wishes to register. Return this promptly and keep a record of doing so. Do not assume the school has registered your child — confirm with the school office that your child is on the registered list.</p>

      <h2>Step 2: Independent and Out-of-County Families Register Directly</h2>
      <p>If your child attends an independent school, is educated at home, or lives outside Buckinghamshire, you must register directly with Buckinghamshire Council. The registration process and form are available through the TBGS website (thebucksgrammarschools.org) and Buckinghamshire Council's school admissions pages. You will be assigned a test centre in Buckinghamshire where your child will sit the test. Register early — do not leave this until close to the June deadline.</p>

      <h2>Step 3: Confirm Registration Before the June Deadline</h2>
      <p>Regardless of how your child is being registered, confirm that registration has been completed before the June deadline. Ask the school for written confirmation, or check directly with Buckinghamshire Council if registering independently. The deadline is firm — there is no grace period and no automatic notification if your registration has not been processed correctly.</p>

      <h2>What Happens After Registration</h2>
      <p>After registration closes, Buckinghamshire Council processes all entries and assigns test centres where relevant. Closer to the test date (September), families receive confirmation of the test arrangements — typically the test location (usually the child's own school for in-county children) and any additional instructions. The test itself is sat in September of Year 6. Results follow in October.</p>

      <h2>Common Registration Mistakes to Avoid</h2>
      <ul>
        <li><strong>Assuming the school has registered your child without checking</strong> — Always confirm in writing.</li>
        <li><strong>Registering late</strong> — The June deadline is firm. There is no advantage to waiting.</li>
        <li><strong>Not checking the TBGS website for the current year's dates</strong> — Deadlines can shift slightly year to year. Always verify from the official source.</li>
        <li><strong>Forgetting to complete out-of-county registration</strong> — Independent school and out-of-county families are responsible for their own registration. Schools do not do this for them.</li>
      </ul>
    </section>
    ${ssrFaqSection(faqs)}
    <section class="ssr-related" style="margin-top:2rem;">
      <h2>Related</h2>
      <div class="ssr-related-grid">
        <a class="ssr-card" href="/bucks-11-plus-test-date-2026"><div class="ssr-card-label">Key dates</div><div class="ssr-card-title">2026 Dates & Deadlines →</div></a>
        <a class="ssr-card" href="/bucks-11-plus-timeline"><div class="ssr-card-label">Timeline</div><div class="ssr-card-title">Admissions Timeline →</div></a>
        <a class="ssr-card" href="/glossary/tbgs"><div class="ssr-card-label">Glossary</div><div class="ssr-card-title">What is TBGS? →</div></a>
        <a class="ssr-card" href="/preparing-for-11-plus-year-5"><div class="ssr-card-label">Preparation guide</div><div class="ssr-card-title">Year 5 Guide →</div></a>
      </div>
    </section>
    ${ssrDisclaimer()}
  `;

  return ssrShell({ title, description: desc, canonical: url, schemas: [breadcrumbSchema([{ label: "Bucks 11+ Guide", href: "/buckinghamshire-11-plus-guide" }, { label: "Registration Guide" }]), faqSchema(faqs), articleSchema(title, desc, url)], body });
}

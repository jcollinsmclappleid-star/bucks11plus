const PRIMARY = "#0e1f30";
const PRIMARY_FG = "#f8fafc";
const AMBER = "#f59e0b";
const AMBER_DARK = "#92400e";

export function ssrShell({
  title,
  description,
  canonical,
  schemas = [],
  body,
  ogImage = "https://bucks11plustest.co.uk/opengraph.jpg",
}: {
  title: string;
  description: string;
  canonical: string;
  schemas?: object[];
  body: string;
  ogImage?: string;
}): string {
  const schemaBlocks = schemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />

  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:site_name" content="Bucks 11 Plus Tests" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Bucks11PlusTest" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta name="theme-color" content="${PRIMARY}" />

  ${schemaBlocks}

  <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"></noscript>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #1e293b; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; }

    .ssr-header { background: ${PRIMARY}; color: ${PRIMARY_FG}; border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 50; }
    .ssr-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 1rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .ssr-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .ssr-brand-icon { width: 32px; height: 32px; opacity: 0.7; }
    .ssr-brand-text { display: flex; flex-direction: column; line-height: 1; }
    .ssr-brand-name { font-family: 'Libre Baskerville', serif; font-size: 1.1rem; font-weight: 700; color: ${PRIMARY_FG}; }
    .ssr-brand-sub { font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(248,250,252,0.5); margin-top: 2px; }
    .ssr-nav { display: flex; align-items: center; gap: 1rem; }
    .ssr-nav a { font-size: 0.875rem; color: rgba(248,250,252,0.75); transition: color 0.15s; }
    .ssr-nav a:hover { color: ${PRIMARY_FG}; }
    .ssr-btn { display: inline-block; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
    .ssr-btn-amber { background: ${AMBER}; color: ${AMBER_DARK}; }
    .ssr-btn-amber:hover { background: #fbbf24; }
    .ssr-btn-outline { border: 1px solid rgba(255,255,255,0.25); color: ${PRIMARY_FG}; margin-left: 0.25rem; }
    .ssr-btn-outline:hover { background: rgba(255,255,255,0.08); }

    .ssr-main { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
    .ssr-breadcrumb { font-size: 0.8rem; color: #64748b; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
    .ssr-breadcrumb a { color: #64748b; } .ssr-breadcrumb a:hover { color: ${PRIMARY}; }
    .ssr-breadcrumb-sep { color: #cbd5e1; }

    .ssr-hero { border-left: 4px solid ${PRIMARY}; background: rgba(14,31,48,0.03); border-radius: 0 12px 12px 0; padding: 1.5rem 1.5rem 1.5rem 1.75rem; margin-bottom: 2rem; }
    .ssr-tag { display: inline-block; background: rgba(14,31,48,0.08); color: ${PRIMARY}; font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .ssr-h1 { font-family: 'Libre Baskerville', serif; font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700; color: ${PRIMARY}; line-height: 1.25; margin-bottom: 0.75rem; }
    .ssr-intro { font-size: 1.05rem; color: #475569; line-height: 1.7; }

    .ssr-cta-box { background: linear-gradient(135deg, ${PRIMARY} 0%, #1a3a5c 100%); border-radius: 12px; padding: 1.5rem; margin: 2rem 0; color: ${PRIMARY_FG}; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .ssr-cta-box p { font-size: 0.95rem; opacity: 0.9; margin-top: 0.25rem; }
    .ssr-cta-box strong { font-size: 1rem; }
    .ssr-cta-box a { display: inline-block; background: ${AMBER}; color: ${AMBER_DARK}; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 700; font-size: 0.875rem; white-space: nowrap; flex-shrink: 0; }
    .ssr-cta-box a:hover { background: #fbbf24; }

    .ssr-section h2 { font-family: 'Libre Baskerville', serif; font-size: 1.15rem; font-weight: 700; color: ${PRIMARY}; margin: 2.25rem 0 0.6rem; }
    .ssr-section p { color: #475569; line-height: 1.75; margin-bottom: 1rem; }
    .ssr-section ul { list-style: none; padding: 0; margin-bottom: 1rem; }
    .ssr-section ul li { color: #475569; padding: 0.3rem 0 0.3rem 1.25rem; position: relative; line-height: 1.6; }
    .ssr-section ul li::before { content: "→"; position: absolute; left: 0; color: ${PRIMARY}; opacity: 0.5; font-size: 0.75rem; top: 0.45rem; }

    .ssr-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; margin: 1.25rem 0; }
    .ssr-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.25rem; transition: border-color 0.15s, box-shadow 0.15s; display: block; }
    .ssr-card:hover { border-color: rgba(14,31,48,0.3); box-shadow: 0 2px 8px rgba(14,31,48,0.08); }
    .ssr-card-label { font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem; }
    .ssr-card-title { font-size: 0.9rem; font-weight: 600; color: ${PRIMARY}; }

    .ssr-checklist { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
    .ssr-checklist h2 { font-family: 'Libre Baskerville', serif; font-size: 1rem; font-weight: 700; color: #166534; margin-bottom: 0.75rem; }
    .ssr-checklist ul { list-style: none; padding: 0; }
    .ssr-checklist li { display: flex; gap: 0.5rem; align-items: flex-start; font-size: 0.875rem; color: #166534; padding: 0.2rem 0; }
    .ssr-checklist li::before { content: "✓"; flex-shrink: 0; color: #16a34a; margin-top: 0.05rem; }

    .ssr-qtype-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.6rem; margin: 1rem 0; }
    .ssr-qtype { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; }
    .ssr-qtype strong { font-size: 0.825rem; color: ${PRIMARY}; display: block; margin-bottom: 0.2rem; }
    .ssr-qtype span { font-size: 0.8rem; color: #64748b; }

    .ssr-faq { margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem; }
    .ssr-faq h2 { font-family: 'Libre Baskerville', serif; font-size: 1.3rem; font-weight: 700; color: ${PRIMARY}; margin-bottom: 1.25rem; }
    .ssr-faq-item { border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
    .ssr-faq-item h3 { font-size: 0.9rem; font-weight: 600; color: ${PRIMARY}; margin-bottom: 0.5rem; }
    .ssr-faq-item p { font-size: 0.875rem; color: #475569; line-height: 1.65; margin: 0; }

    .ssr-related { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
    .ssr-related h2 { font-family: 'Libre Baskerville', serif; font-size: 1rem; font-weight: 700; color: ${PRIMARY}; margin-bottom: 1rem; }
    .ssr-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.6rem; }

    .ssr-disclaimer { margin-top: 2.5rem; padding: 1rem 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.75rem; color: #94a3b8; line-height: 1.5; }

    .ssr-footer { background: ${PRIMARY}; color: rgba(248,250,252,0.7); padding: 3rem 1.25rem 2rem; margin-top: 4rem; }
    .ssr-footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 2rem; }
    .ssr-footer-brand { font-family: 'Libre Baskerville', serif; font-weight: 700; font-size: 1.1rem; color: ${PRIMARY_FG}; margin-bottom: 0.5rem; }
    .ssr-footer-desc { font-size: 0.8rem; line-height: 1.5; }
    .ssr-footer-col h4 { font-size: 0.85rem; font-weight: 700; color: ${PRIMARY_FG}; margin-bottom: 0.75rem; }
    .ssr-footer-col ul { list-style: none; padding: 0; }
    .ssr-footer-col li { margin-bottom: 0.35rem; }
    .ssr-footer-col a { font-size: 0.8rem; color: rgba(248,250,252,0.6); transition: color 0.15s; }
    .ssr-footer-col a:hover { color: ${PRIMARY_FG}; }
    .ssr-footer-bottom { max-width: 1200px; margin: 2rem auto 0; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
    .ssr-footer-bottom p { font-size: 0.7rem; color: rgba(248,250,252,0.4); margin-bottom: 0.3rem; }

    .ssr-glossary-term { display: inline-block; background: rgba(14,31,48,0.06); border-radius: 4px; padding: 1px 6px; font-size: 0.8em; color: ${PRIMARY}; }

    @media (max-width: 640px) {
      .ssr-nav .ssr-btn-outline { display: none; }
      .ssr-cta-box { flex-direction: column; }
    }
  </style>
</head>
<body>
  ${ssrHeader()}
  <main class="ssr-main">
    ${body}
  </main>
  ${ssrFooter()}
</body>
</html>`;
}

function ssrHeader(): string {
  return `<header class="ssr-header">
  <div class="ssr-header-inner">
    <a href="/" class="ssr-brand">
      <svg viewBox="0 0 48 48" class="ssr-brand-icon" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
        <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.5"/>
      </svg>
      <div class="ssr-brand-text">
        <span class="ssr-brand-name">Bucks 11 Plus Tests</span>
        <span class="ssr-brand-sub">GL-Style Diagnostic</span>
      </div>
    </a>
    <nav class="ssr-nav">
      <a href="/learn">Learning Hub</a>
      <a href="/bucks-grammar-schools">Grammar Schools</a>
      <a href="/pricing">Pricing</a>
      <a href="/free-diagnostic" class="ssr-btn ssr-btn-amber">Free Diagnostic</a>
      <a href="/sign-in" class="ssr-btn ssr-btn-outline">Sign In</a>
    </nav>
  </div>
</header>`;
}

function ssrFooter(): string {
  const year = new Date().getFullYear();
  return `<footer class="ssr-footer">
  <div class="ssr-footer-inner">
    <div>
      <div class="ssr-footer-brand">Bucks 11 Plus Tests</div>
      <p class="ssr-footer-desc">Independent GL-style diagnostic and preparation platform for the Buckinghamshire Secondary Transfer Test. Developed by Ianson Systems Limited — a UK educational technology company.</p>
      <p class="ssr-footer-desc" style="margin-top:0.5rem;font-size:0.75rem;opacity:0.6;">Admissions guidance written and reviewed with reference to official TBGS and Buckinghamshire Council published materials.</p>
    </div>
    <div class="ssr-footer-col">
      <h4>Platform</h4>
      <ul>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/how-it-works">How It Works</a></li>
        <li><a href="/free-diagnostic">Free Diagnostic</a></li>
        <li><a href="/bucks-gl-alignment">GL-Style Alignment</a></li>
        <li><a href="/how-forecast-works">How Scoring Works</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="ssr-footer-col">
      <h4>Key Dates</h4>
      <ul>
        <li><a href="/bucks-11-plus-test-date-2026">Test Date 2026</a></li>
        <li><a href="/bucks-11-plus-test-date-2025">Test Date 2025</a></li>
        <li><a href="/bucks-11-plus-results">Results Guide</a></li>
        <li><a href="/bucks-11-plus-appeals">Appeals</a></li>
        <li><a href="/bucks-11-plus-registration-guide">Registration</a></li>
        <li><a href="/bucks-11-plus-timeline">Full Timeline</a></li>
      </ul>
    </div>
    <div class="ssr-footer-col">
      <h4>Resources</h4>
      <ul>
        <li><a href="/buckinghamshire-11-plus-guide">Bucks 11+ Guide</a></li>
        <li><a href="/bucks-grammar-schools">Grammar Schools</a></li>
        <li><a href="/bucks-11-plus-sample-questions">Sample Questions</a></li>
        <li><a href="/bucks-11-plus-past-papers">Practice Papers</a></li>
        <li><a href="/bucks-11-plus-score-calculator">Scoring Explained</a></li>
        <li><a href="/11-plus-tutors-buckinghamshire">Tutors Guide</a></li>
        <li><a href="/learn">Learning Hub</a></li>
        <li><a href="/glossary">11+ Glossary</a></li>
      </ul>
    </div>
    <div class="ssr-footer-col">
      <h4>Local Guides</h4>
      <ul>
        <li><a href="/bucks-11-plus-high-wycombe">High Wycombe</a></li>
        <li><a href="/bucks-11-plus-aylesbury">Aylesbury</a></li>
        <li><a href="/bucks-11-plus-beaconsfield">Beaconsfield</a></li>
        <li><a href="/bucks-11-plus-amersham">Amersham</a></li>
        <li><a href="/bucks-11-plus-chesham">Chesham</a></li>
        <li><a href="/bucks-11-plus-marlow">Marlow</a></li>
        <li><a href="/bucks-11-plus-gerrards-cross">Gerrards Cross</a></li>
      </ul>
    </div>
    <div class="ssr-footer-col">
      <h4>Legal</h4>
      <ul>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/safeguarding">Safeguarding</a></li>
        <li><a href="/refund-policy">Refund Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="ssr-footer-bottom">
    <p>Bucks 11 Plus Tests is operated by <strong>Ianson Systems Limited</strong> — a UK educational technology company developing diagnostic assessment platforms to support 11+ preparation in Buckinghamshire.</p>
    <p>Independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools (TBGS), GL Assessment Limited, or any individual grammar school or local authority.</p>
    <p>All admissions information is for guidance only. Always verify current details directly with your school, Buckinghamshire Council, and the grammar school concerned.</p>
    <p>&copy; ${year} Ianson Systems Limited. Registered in England &amp; Wales. Contact: <a href="mailto:support@bucks11plustest.co.uk" style="color:rgba(248,250,252,0.4);">support@bucks11plustest.co.uk</a></p>
  </div>
</footer>`;
}

export function ssrBreadcrumbs(items: { label: string; href?: string }[]): string {
  const parts = [
    `<a href="/">Home</a>`,
    ...items.map((item, i) =>
      i < items.length - 1 && item.href
        ? `<span class="ssr-breadcrumb-sep">/</span><a href="${esc(item.href)}">${esc(item.label)}</a>`
        : `<span class="ssr-breadcrumb-sep">/</span><span>${esc(item.label)}</span>`
    ),
  ];
  return `<nav class="ssr-breadcrumb" aria-label="Breadcrumb">${parts.join("")}</nav>`;
}

export function breadcrumbSchema(items: { label: string; href?: string }[], baseUrl = "https://bucks11plustest.co.uk") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
      })),
    ],
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function ssrFaqSection(faqs: { question: string; answer: string }[]): string {
  return `<section class="ssr-faq">
  <h2>Frequently Asked Questions</h2>
  ${faqs.map(f => `<div class="ssr-faq-item">
    <h3>${esc(f.question)}</h3>
    <p>${esc(f.answer)}</p>
  </div>`).join("\n")}
</section>`;
}

export function ssrCtaBox(): string {
  return `<div class="ssr-cta-box">
  <div>
    <strong>Take a Free Bucks 11+ Diagnostic</strong>
    <p>12 questions across all four domains — instant GL-style score and readiness band. No account needed.</p>
  </div>
  <a href="/free-diagnostic">Start Free Test</a>
</div>`;
}

export function ssrDisclaimer(): string {
  return `<div class="ssr-disclaimer">
  Independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual grammar school.
  Information is for guidance only. Always verify admissions details directly with schools and Buckinghamshire Council.
</div>`;
}

export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

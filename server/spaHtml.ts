import fs from "fs";
import path from "path";
import type { Express, Request, Response } from "express";
import {
  getPageMeta,
  SITE_BASE_URL,
  SPA_META_PATHS,
  type PageMeta,
} from "../client/src/lib/spaPageMeta";

function escAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escHtml(value: string): string {
  return escAttr(value).replace(/>/g, "&gt;");
}

let cachedProdTemplate: string | null = null;

function readIndexTemplate(): string {
  if (process.env.NODE_ENV === "production") {
    if (!cachedProdTemplate) {
      const distPath = path.resolve(process.cwd(), "dist/public/index.html");
      cachedProdTemplate = fs.readFileSync(distPath, "utf-8");
    }
    return cachedProdTemplate;
  }

  return fs.readFileSync(
    path.resolve(import.meta.dirname, "../client/index.html"),
    "utf-8",
  );
}

export function injectSpaMeta(html: string, meta: PageMeta): string {
  const canonical = `${SITE_BASE_URL}${meta.path}`;

  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(meta.title)}</title>`);

  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escAttr(meta.description)}" />`,
  );

  const canonicalTag = `<link rel="canonical" href="${escAttr(canonical)}" />`;
  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, canonicalTag);
  } else {
    out = out.replace(
      /(<meta name="description"[^>]*>)/,
      `$1\n    ${canonicalTag}`,
    );
  }

  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escAttr(meta.title)}" />`,
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escAttr(meta.description)}" />`,
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escAttr(canonical)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escAttr(meta.title)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escAttr(meta.description)}" />`,
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_BASE_URL },
      { "@type": "ListItem", position: 2, name: meta.h1 },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "Bucks 11 Plus Tests", url: SITE_BASE_URL },
  };
  const schemaBlock = `<script type="application/ld+json" data-seo-prerender="true">${JSON.stringify([breadcrumbSchema, articleSchema])}</script>`;
  out = out.replace("</head>", `    ${schemaBlock}\n  </head>`);

  const fallback = `<article class="seo-prerender" style="max-width:48rem;margin:2rem auto;padding:0 1rem 3rem;font-family:system-ui,sans-serif;color:#1e293b">
  <header style="margin-bottom:1.25rem">
    <p style="font-size:0.75rem;color:#64748b;margin-bottom:0.5rem"><a href="/" style="color:#1e3a6e">Home</a> · Bucks 11 Plus Tests</p>
    <h1 style="font-size:1.75rem;color:#1e3a6e;font-family:Georgia,serif;margin-bottom:0.75rem;line-height:1.25">${escHtml(meta.h1)}</h1>
    <p style="line-height:1.65;color:#475569">${escHtml(meta.intro)}</p>
  </header>
  <p style="font-size:0.9rem;color:#64748b">Interactive content loads below. <a href="/free-diagnostic" style="color:#1e3a6e;font-weight:600">Take the free practice test</a> or <a href="/pricing" style="color:#1e3a6e;font-weight:600">see pricing</a>.</p>
</article>`;
  out = out.replace("<div id=\"root\"></div>", `<div id="root">${fallback}</div>`);

  return out;
}

export function sendSpaPage(res: Response, meta: PageMeta): void {
  const html = injectSpaMeta(readIndexTemplate(), meta);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  res.send(html);
}

/** Register GET handlers that serve index.html with page-specific meta in <head>. */
export function registerSpaMetaRoutes(app: Express): void {
  for (const routePath of SPA_META_PATHS) {
    app.get(routePath, (req: Request, res: Response, next) => {
      if (req.path !== routePath) {
        next();
        return;
      }
      const pageMeta = getPageMeta(routePath);
      if (!pageMeta) {
        next();
        return;
      }
      try {
        sendSpaPage(res, pageMeta);
      } catch (err) {
        next(err);
      }
    });
  }
}

/** Clear cached production template (e.g. after deploy hot-swap). */
export function clearSpaHtmlCache(): void {
  cachedProdTemplate = null;
}

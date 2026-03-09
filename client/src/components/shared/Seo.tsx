import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({ title, description, canonicalPath, schema }: SeoProps) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://bucks11plustest.co.uk${canonicalPath}`);
    }

    let existingSchema = document.querySelector('script[data-seo-schema]');
    if (schema) {
      const schemaArray = Array.isArray(schema) ? schema : [schema];
      if (!existingSchema) {
        existingSchema = document.createElement('script');
        existingSchema.setAttribute('type', 'application/ld+json');
        existingSchema.setAttribute('data-seo-schema', 'true');
        document.head.appendChild(existingSchema);
      }
      existingSchema.textContent = JSON.stringify(schemaArray.length === 1 ? schemaArray[0] : schemaArray);
    } else if (existingSchema) {
      existingSchema.remove();
    }

    return () => {
      const el = document.querySelector('script[data-seo-schema]');
      if (el) el.remove();
    };
  }, [title, description, canonicalPath, schema]);

  return null;
}

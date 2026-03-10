import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ExternalLink } from "lucide-react";

const breadcrumbItems = [
  { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
  { label: "Grammar Schools" },
];

const schools = [
  {
    name: "Aylesbury Grammar School",
    location: "Aylesbury",
    description: "A boys' grammar school with a strong academic tradition, consistently achieving excellent results across all subjects. Known for its broad extracurricular programme and strong pastoral care.",
    url: "https://www.ags.bucks.sch.uk",
  },
  {
    name: "Aylesbury High School",
    location: "Aylesbury",
    description: "A girls' grammar school recognised for academic excellence and a wide range of enrichment opportunities. Strong emphasis on developing confident, well-rounded young women.",
    url: "https://www.ahs.bucks.sch.uk",
  },
  {
    name: "Beaconsfield High School",
    location: "Beaconsfield",
    description: "A girls' grammar school with outstanding results and a reputation for nurturing individual talent across academics, sport, and the arts.",
    url: "https://www.beaconsfieldhigh.bucks.sch.uk",
  },
  {
    name: "Burnham Grammar School",
    location: "Burnham",
    description: "A co-educational grammar school serving the south of the county. Known for its inclusive ethos and strong community links alongside excellent academic outcomes.",
    url: "https://www.burnhamgrammar.org.uk",
  },
  {
    name: "Chesham Grammar School",
    location: "Chesham",
    description: "A co-educational grammar school with a strong track record in STEM subjects and a supportive learning environment that encourages academic ambition.",
    url: "https://www.cheshamgrammar.org",
  },
  {
    name: "Dr Challoner's Grammar School",
    location: "Amersham",
    description: "A boys' grammar school consistently ranked among the top state schools nationally. Renowned for academic rigour, competitive sport, and a vibrant extracurricular programme.",
    url: "https://www.challoners.org",
  },
  {
    name: "Dr Challoner's High School",
    location: "Little Chalfont",
    description: "A girls' grammar school with exceptional academic results and a strong tradition in music, drama, and community service. Regularly features in national school rankings.",
    url: "https://www.challonershigh.com",
  },
  {
    name: "John Hampden Grammar School",
    location: "High Wycombe",
    description: "A boys' grammar school in High Wycombe with a proud history and strong academic standards. Offers a broad curriculum with excellent facilities for sport and technology.",
    url: "https://www.jhgs.bucks.sch.uk",
  },
  {
    name: "Royal Grammar School, High Wycombe",
    location: "High Wycombe",
    description: "One of the oldest grammar schools in England, with a distinguished record of academic achievement. Particularly strong in sciences and mathematics, with a selective sixth form.",
    url: "https://www.rgshw.com",
  },
  {
    name: "Royal Latin School",
    location: "Buckingham",
    description: "A co-educational grammar school with roots dating back to 1423. Combines a strong academic tradition with a friendly, community-focused atmosphere in north Buckinghamshire.",
    url: "https://www.royallatin.org",
  },
  {
    name: "Sir Henry Floyd Grammar School",
    location: "Aylesbury",
    description: "A co-educational grammar school known for its welcoming environment and strong academic outcomes. Offers a wide range of subjects and extracurricular activities.",
    url: "https://www.shfgs.org",
  },
  {
    name: "Sir William Borlase's Grammar School",
    location: "Marlow",
    description: "A co-educational grammar school in the Thames Valley with a reputation for high academic standards and a thriving arts and sports programme.",
    url: "https://www.swbgs.com",
  },
  {
    name: "Wycombe High School",
    location: "High Wycombe",
    description: "A girls' grammar school with outstanding academic results and a strong emphasis on leadership, personal development, and preparing students for top universities.",
    url: "https://www.whs.bucks.sch.uk",
  },
];

export default function GrammarSchools() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title="Buckinghamshire Grammar Schools | Full Directory of 13 Schools"
        description="Complete directory of all 13 Buckinghamshire grammar schools with locations, descriptions, and official website links. Find the right grammar school for your child."
        canonicalPath="/bucks-grammar-schools"
        schema={[
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="heading-grammar-schools">
        Buckinghamshire Grammar Schools
      </h1>
      <p className="text-xl text-muted-foreground lead">
        A complete directory of all 13 selective grammar schools in Buckinghamshire, each admitting students based on performance in the Secondary Transfer Test (11+).
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">The 13 Grammar Schools</h2>
      <p>
        Buckinghamshire is one of the few remaining fully selective local authorities in England, maintaining 13 grammar schools
        across the county. Entry to all 13 schools is determined by the same Secondary Transfer Test, commonly known as the Bucks 11+,
        which children sit in September of Year 6.
      </p>

      <div className="not-prose grid gap-4 my-8">
        {schools.map((school) => (
          <div
            key={school.name}
            className="rounded-xl border border-slate-200 p-5 hover:border-primary/30 transition-colors"
            data-testid={`card-school-${school.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-primary font-serif mb-1">{school.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{school.location}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{school.description}</p>
              </div>
              <a
                href={school.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                data-testid={`link-school-${school.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">How Admissions Work</h2>
      <p>
        All 13 grammar schools use the same Secondary Transfer Test result to determine eligibility. Children who achieve the
        qualifying standard (historically a standardised score of around 121) are deemed to have "qualified" for grammar school
        and can then list their preferred schools on the local authority common application form.
      </p>
      <p>
        Each school has its own oversubscription criteria — typically based on distance from the school — which determines
        allocation when more children qualify than places are available. Parents should check individual school websites
        for their specific admissions policies.
      </p>

      <h2 className="text-primary font-serif">Preparing for the Bucks 11+</h2>
      <p>
        The test covers Verbal Reasoning, Non-Verbal Reasoning, Mathematics, and English Comprehension. Understanding the format and practising
        under timed conditions is essential. Our <Link href="/free-diagnostic" className="text-primary hover:underline">free diagnostic assessment</Link> measures
        your child's current readiness against the 121 qualifying benchmark across all four domains.
      </p>
      <p>
        For a comprehensive overview of the test structure, scoring, and preparation strategies, see
        our <Link href="/buckinghamshire-11-plus-guide" className="text-primary hover:underline">Complete Buckinghamshire 11+ Guide</Link>.
      </p>

      <ContentCTA />
      <Disclaimer />
    </div>
  );
}

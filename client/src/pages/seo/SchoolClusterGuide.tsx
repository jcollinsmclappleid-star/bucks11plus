import { Link } from "wouter";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs, breadcrumbSchema } from "@/components/shared/Breadcrumbs";
import { ContentCTA } from "@/components/shared/ContentCTA";
import { SubscribeCTA } from "@/components/shared/SubscribeCTA";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { ChildExperienceCTA } from "@/components/shared/ChildExperienceCTA";
import NotFound from "@/pages/not-found";

export type ClusterSlug = "south-bucks-grammar-schools" | "aylesbury-vale-grammar-schools" | "chiltern-grammar-schools";

interface SchoolEntry {
  slug: string;
  name: string;
  gender: "Boys" | "Girls" | "Co-educational";
  town: string;
  notes: string;
}

interface Cluster {
  slug: string;
  title: string;
  shortName: string;
  area: string;
  intro: string;
  geography: string;
  competitive: string;
  preparation: string;
  schools: SchoolEntry[];
  nearbyTowns: { slug: string; name: string }[];
}

const clusters: Record<string, Cluster> = {
  "south-bucks-grammar-schools": {
    slug: "south-bucks-grammar-schools",
    title: "South Buckinghamshire Grammar Schools",
    shortName: "South Bucks",
    area: "South Buckinghamshire — including High Wycombe, Marlow, Beaconsfield and Burnham",
    intro: "South Buckinghamshire contains six of the county's thirteen grammar schools, clustered around the major commuter towns of High Wycombe, Marlow and Beaconsfield. This is the most densely populated and most competitive grammar school area in the county.",
    geography: "Schools in this cluster sit broadly along the M40 corridor, within a 20-minute drive of each other. High Wycombe alone has three grammar schools (Royal Grammar School, Wycombe High and John Hampden), making it the single most concentrated grammar school town in the county. Marlow, Beaconsfield and Burnham each have one major grammar school within their immediate boundary.",
    competitive: "South Bucks is the most heavily contested area for grammar school places. Catchment distances at Royal Grammar School High Wycombe and Beaconsfield High are typically the tightest in the county due to high local demand combined with a large pool of qualifying applicants travelling in from London commuter towns. Families living more than 3–4 miles from their preferred school should expect distance to be a meaningful factor in allocation, even with a comfortable 121+ score.",
    preparation: "Because of the competitive intensity, families in South Bucks frequently aim for a comfortable margin above 121 rather than the threshold itself — a forecast score in the 125–135 range provides protection against year-on-year variation in paper difficulty. The closer your home is to a popular school, the more the qualifying score itself becomes the primary lever; the further away you are, the more meaningful a high score becomes for distance-based allocation tiebreaks at neighbouring schools.",
    schools: [
      { slug: "royal-grammar-school-high-wycombe", name: "Royal Grammar School High Wycombe", gender: "Boys", town: "High Wycombe", notes: "One of the most academically selective grammar schools in England — consistently in the top 10 nationally for A-level results." },
      { slug: "wycombe-high-school", name: "Wycombe High School", gender: "Girls", town: "High Wycombe", notes: "A high-performing girls' grammar with a strong tradition of STEM and sixth-form outcomes." },
      { slug: "john-hampden-grammar-school", name: "John Hampden Grammar School", gender: "Boys", town: "High Wycombe", notes: "The third High Wycombe grammar — slightly less oversubscribed than RGS but still highly competitive." },
      { slug: "sir-william-borlases-grammar-school", name: "Sir William Borlase's Grammar School", gender: "Co-educational", town: "Marlow", notes: "One of two co-educational grammar schools in Bucks; consistently strong academic results and a long-standing rowing tradition." },
      { slug: "beaconsfield-high-school", name: "Beaconsfield High School", gender: "Girls", town: "Beaconsfield", notes: "Highly oversubscribed girls' grammar serving Beaconsfield and the surrounding South Bucks villages." },
      { slug: "burnham-grammar-school", name: "Burnham Grammar School", gender: "Co-educational", town: "Burnham", notes: "The only grammar school in the south-west of the county, drawing applicants from Burnham, Slough and the surrounding area." },
    ],
    nearbyTowns: [
      { slug: "high-wycombe", name: "High Wycombe" },
      { slug: "marlow", name: "Marlow" },
      { slug: "beaconsfield", name: "Beaconsfield" },
      { slug: "flackwell-heath", name: "Flackwell Heath" },
      { slug: "hazlemere", name: "Hazlemere" },
    ],
  },
  "aylesbury-vale-grammar-schools": {
    slug: "aylesbury-vale-grammar-schools",
    title: "Aylesbury Vale Grammar Schools",
    shortName: "Aylesbury Vale",
    area: "Aylesbury Vale — including Aylesbury, Wendover, Buckingham and surrounding villages",
    intro: "The Aylesbury Vale cluster contains four of the county's grammar schools, serving a large rural and semi-rural area in northern and central Buckinghamshire. Aylesbury itself has three grammar schools, with The Royal Latin School in Buckingham serving the northernmost part of the county.",
    geography: "The four schools are spread across a wider geographic area than the South Bucks cluster. Aylesbury sits at the centre with three grammar schools within the town, while The Royal Latin School in Buckingham is approximately 17 miles north and serves families across a broad rural catchment that extends towards the Northamptonshire border.",
    competitive: "Aylesbury Vale is generally less geographically constrained than South Bucks — the lower population density means catchment distances are typically more generous at most schools. The Royal Latin School is the most distinct of the four because it serves a large rural area and admits a significant minority of pupils from outside Buckinghamshire. Sir Henry Floyd Grammar is co-educational and tends to have the most balanced demand profile in the cluster.",
    preparation: "Families in this cluster generally have a slightly more relaxed competitive picture than South Bucks counterparts, but the qualifying threshold of 121 still applies in full. A forecast score comfortably above threshold remains the goal — the cluster's geography simply means that distance is often a less aggressive tiebreaker than in the south of the county.",
    schools: [
      { slug: "aylesbury-grammar-school", name: "Aylesbury Grammar School", gender: "Boys", town: "Aylesbury", notes: "The largest boys' grammar in the county, with a strong academic record and a wide catchment across the Vale." },
      { slug: "aylesbury-high-school", name: "Aylesbury High School", gender: "Girls", town: "Aylesbury", notes: "The girls' grammar counterpart in Aylesbury, drawing primarily from Aylesbury, Wendover and surrounding villages." },
      { slug: "sir-henry-floyd-grammar-school", name: "Sir Henry Floyd Grammar School", gender: "Co-educational", town: "Aylesbury", notes: "One of two co-educational grammar schools in the county, serving the eastern side of Aylesbury." },
      { slug: "the-royal-latin-school", name: "The Royal Latin School", gender: "Co-educational", town: "Buckingham", notes: "Serves the northern part of the county and admits substantial numbers of pupils from rural Buckinghamshire and across the Northants border." },
    ],
    nearbyTowns: [
      { slug: "aylesbury", name: "Aylesbury" },
      { slug: "wendover", name: "Wendover" },
      { slug: "buckingham", name: "Buckingham" },
      { slug: "princes-risborough", name: "Princes Risborough" },
    ],
  },
  "chiltern-grammar-schools": {
    slug: "chiltern-grammar-schools",
    title: "Chiltern Grammar Schools",
    shortName: "Chiltern",
    area: "The Chilterns — including Amersham, Chesham, Chalfont St Giles and Great Missenden",
    intro: "The Chiltern cluster covers the central-east of Buckinghamshire, with three grammar schools serving Amersham, Chesham and the surrounding Chiltern villages. This is the smallest of the three clusters by school count but contains some of the most oversubscribed schools in the county due to proximity to London commuter towns.",
    geography: "Dr Challoner's Grammar School (boys) and Dr Challoner's High School (girls) both sit in Amersham, while Chesham Grammar covers the western Chiltern area. The three schools are within a 15-minute drive of each other and serve overlapping catchments.",
    competitive: "Both Dr Challoner's schools are among the most oversubscribed grammar schools in the county. Amersham and the surrounding Chalfont and Beaconsfield villages have very high local demand, and the proximity to the Metropolitan Line attracts families relocating from London specifically for grammar school access. Distance-based tiebreaks at the Dr Challoner's schools are among the tightest in Buckinghamshire — sometimes under a mile in oversubscribed years.",
    preparation: "Families in this cluster face one of the toughest combinations in the county: the standard 121 qualifying threshold combined with extremely tight distance criteria at the two most desirable schools. The practical consequence is that even a comfortable 125+ forecast score does not guarantee a place at Dr Challoner's if the family lives outside the immediate catchment ring. Many families in this cluster also include Chesham Grammar and one of the Aylesbury or South Bucks schools as backup preferences.",
    schools: [
      { slug: "dr-challoners-grammar-school", name: "Dr Challoner's Grammar School", gender: "Boys", town: "Amersham", notes: "Consistently one of the highest-performing boys' grammars in the country and one of the most oversubscribed schools in Bucks." },
      { slug: "dr-challoners-high-school", name: "Dr Challoner's High School", gender: "Girls", town: "Amersham", notes: "The girls' counterpart with similarly strong academic outcomes and tight distance catchments." },
      { slug: "chesham-grammar-school", name: "Chesham Grammar School", gender: "Co-educational", town: "Chesham", notes: "Co-educational grammar serving the western Chilterns; slightly less oversubscribed than the Dr Challoner's schools but still highly competitive." },
    ],
    nearbyTowns: [
      { slug: "amersham", name: "Amersham" },
      { slug: "chesham", name: "Chesham" },
      { slug: "chalfont-st-giles", name: "Chalfont St Giles" },
      { slug: "great-missenden", name: "Great Missenden" },
      { slug: "gerrards-cross", name: "Gerrards Cross" },
    ],
  },
};

export default function SchoolClusterGuide({ clusterSlug }: { clusterSlug: ClusterSlug }) {
  const cluster = clusters[clusterSlug];

  if (!cluster) {
    return <NotFound />;
  }

  const breadcrumbItems = [
    { label: "Resources", href: "/buckinghamshire-11-plus-guide" },
    { label: "Grammar Schools", href: "/bucks-grammar-schools" },
    { label: cluster.shortName },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo
        title={`${cluster.title} (2026) – Bucks 11+ Schools, Catchments & Admissions`}
        description={`Complete guide to ${cluster.title}: the schools, their catchments, competitive landscape, and how to prepare for the Bucks 11+ in this area of Buckinghamshire.`}
        canonicalPath={`/${cluster.slug}`}
        schema={[
          breadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: cluster.title,
            description: cluster.intro,
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="not-prose mb-8 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl pl-7 pr-6 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-3" data-testid={`heading-cluster-${cluster.slug}`}>
          {cluster.title}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A guide to the {cluster.schools.length} grammar schools serving {cluster.area} — including catchment context, competitive landscape, and what local preparation realistically requires.
        </p>
      </div>

      <SubscribeCTA />

      <h2 className="text-primary font-serif">Overview</h2>
      <p>{cluster.intro}</p>

      <h2 className="text-primary font-serif">The Schools in This Cluster</h2>
      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse" data-testid="table-cluster-schools">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-primary">School</th>
              <th className="text-left p-3 font-semibold text-primary">Town</th>
              <th className="text-left p-3 font-semibold text-primary">Type</th>
            </tr>
          </thead>
          <tbody>
            {cluster.schools.map(s => (
              <tr key={s.slug} className="border-b border-slate-100">
                <td className="p-3 font-medium">
                  <Link href={`/grammar-schools/${s.slug}`} className="text-primary hover:underline">{s.name}</Link>
                </td>
                <td className="p-3 text-slate-600">{s.town}</td>
                <td className="p-3 text-slate-600">{s.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary font-serif">Geography & Catchment</h2>
      <p>{cluster.geography}</p>

      <h2 className="text-primary font-serif">Competitive Landscape</h2>
      <p>{cluster.competitive}</p>

      <h2 className="text-primary font-serif">School-by-School Notes</h2>
      <div className="not-prose space-y-4 my-6">
        {cluster.schools.map(s => (
          <div key={s.slug} className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-base font-bold text-primary mb-2">
              <Link href={`/grammar-schools/${s.slug}`} className="hover:underline" data-testid={`link-school-${s.slug}`}>{s.name}</Link>
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{s.gender} · {s.town}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{s.notes}</p>
          </div>
        ))}
      </div>

      <h2 className="text-primary font-serif">What This Means for Preparation</h2>
      <p>{cluster.preparation}</p>
      <p>
        For a deeper look at how the qualifying score interacts with catchment-based allocation, see our explanation of the <Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">121 qualifying score</Link>. To see where your child currently stands, take our <Link href="/free-diagnostic" className="text-primary hover:underline">free 8-minute readiness check</Link>.
      </p>

      <h2 className="text-primary font-serif">Nearby Towns We Cover</h2>
      <ul>
        {cluster.nearbyTowns.map(t => (
          <li key={t.slug}>
            <Link href={`/bucks-11-plus-${t.slug}`} className="text-primary hover:underline" data-testid={`link-town-${t.slug}`}>
              Bucks 11+ in {t.name}
            </Link>
          </li>
        ))}
      </ul>

      <ChildExperienceCTA />
      <ContentCTA heading="Aiming for this cluster?" subhead="Get an indicative readiness score against our 121 readiness benchmark — and the gaps you need to close." ctaLabel="Check readiness" />

      <div className="not-prose my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-lg font-semibold text-primary font-serif mb-3">Further Reading</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/bucks-grammar-schools" className="text-primary hover:underline">All 13 Bucks Grammar Schools</Link></li>
          <li><Link href="/buckinghamshire-secondary-transfer-test" className="text-primary hover:underline">The Bucks Secondary Transfer Test</Link></li>
          <li><Link href="/bucks-11-plus-qualifying-score" className="text-primary hover:underline">The 121 Qualifying Score Explained</Link></li>
          <li><Link href="/bucks-11-plus-timeline" className="text-primary hover:underline">Admissions Timeline</Link></li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}

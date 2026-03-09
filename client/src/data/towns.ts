export interface TownData {
  name: string;
  slug: string;
  intro: string;
  nearbySchools: { name: string; url: string }[];
  localContext: string;
  whyEarly: string;
}

export const towns: TownData[] = [
  {
    name: "High Wycombe",
    slug: "high-wycombe",
    intro: "High Wycombe is home to some of Buckinghamshire's most sought-after grammar schools, making the 11+ a central part of educational planning for families in the area. With the Royal Grammar School and Wycombe High School both located in the town, local parents are often among the most engaged in the admissions process.",
    nearbySchools: [
      { name: "Royal Grammar School High Wycombe", url: "https://www.rgshw.com" },
      { name: "Wycombe High School", url: "https://www.whs.bucks.sch.uk" },
      { name: "John Hampden Grammar School", url: "https://www.jhgs.bucks.sch.uk" },
      { name: "Sir William Borlase's Grammar School", url: "https://www.swbgs.com" },
    ],
    localContext: "The density of grammar school provision in and around High Wycombe means competition for places is particularly strong. Many families begin considering the 11+ as early as Year 3, with structured preparation typically starting in Year 4 or early Year 5.",
    whyEarly: "With multiple grammar schools within easy reach, High Wycombe parents often research the 11+ early to understand admissions priorities at each school. Starting preparation in Year 4 or early Year 5 gives children time to build familiarity with the question styles and develop the pace discipline required for the timed assessment.",
  },
  {
    name: "Aylesbury",
    slug: "aylesbury",
    intro: "Aylesbury is the county town of Buckinghamshire and home to two well-established grammar schools — Aylesbury Grammar School and Aylesbury High School. Families across the Aylesbury Vale area frequently prepare for the Buckinghamshire 11+ as part of the secondary school transition.",
    nearbySchools: [
      { name: "Aylesbury Grammar School", url: "https://www.ags.bucks.sch.uk" },
      { name: "Aylesbury High School", url: "https://www.aylesburyhigh.org" },
      { name: "Sir Henry Floyd Grammar School", url: "https://www.shfgs.org" },
      { name: "The Royal Latin School", url: "https://www.royallatin.org" },
    ],
    localContext: "Aylesbury's grammar schools draw applications from a wide catchment area including surrounding villages and towns. The admissions process requires careful planning, particularly around the registration timeline which opens in the summer term of Year 5.",
    whyEarly: "Many Aylesbury families begin looking into the 11+ during Year 4, particularly those whose children attend local primary schools with a tradition of grammar school progression. Understanding the standardised scoring system and the 121 qualifying threshold early helps parents set realistic expectations.",
  },
  {
    name: "Beaconsfield",
    slug: "beaconsfield",
    intro: "Beaconsfield is a popular residential town in South Buckinghamshire where many families aspire to grammar school places for their children. Its proximity to several grammar schools in the Chiltern area makes the 11+ a significant milestone in the local educational calendar.",
    nearbySchools: [
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
      { name: "Burnham Grammar School", url: "https://www.burnhamgrammar.org" },
    ],
    localContext: "Beaconsfield families often have strong connections to the grammar school tradition, with many parents having attended grammar schools themselves. The town's location provides access to both the Amersham-based Challoner's schools and Beaconsfield High School.",
    whyEarly: "Parents in Beaconsfield commonly start researching the 11+ in Year 3 or early Year 4. With several high-performing grammar schools within reasonable distance, understanding the admissions criteria and preparation requirements early can help families plan effectively.",
  },
  {
    name: "Amersham",
    slug: "amersham",
    intro: "Amersham sits at the heart of the Chiltern grammar school belt, with Dr Challoner's Grammar School and Dr Challoner's High School both located in the town. For families in Amersham and the surrounding Chiltern villages, the 11+ is often the primary focus of Year 5 and Year 6 educational planning.",
    nearbySchools: [
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
      { name: "Chesham Grammar School", url: "https://www.cheshamgrammar.org" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
    ],
    localContext: "The Challoner's schools are among the most competitive in Buckinghamshire, with large numbers of applicants each year. Amersham families benefit from proximity but still face the same standardised assessment process as applicants from further afield.",
    whyEarly: "Given the competitiveness of the Challoner's schools, Amersham parents frequently begin preparation planning in Year 4. Early understanding of the test format, the role of standardised scores, and the importance of pace discipline under timed conditions helps families approach the 11+ with confidence.",
  },
  {
    name: "Chesham",
    slug: "chesham",
    intro: "Chesham is a market town in the Chilterns where many families prepare for the Buckinghamshire 11+. Chesham Grammar School serves as the local grammar option, while families also regularly apply to the nearby Challoner's schools in Amersham.",
    nearbySchools: [
      { name: "Chesham Grammar School", url: "https://www.cheshamgrammar.org" },
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
    ],
    localContext: "Chesham Grammar School has a strong local reputation, and many families in the town view it as a natural progression from local primary schools. However, parents also consider the Challoner's schools and other grammar options across the county.",
    whyEarly: "Chesham parents often start thinking about the 11+ during Year 4, with many seeking to understand the difference between the raw test score and the standardised score that determines qualification. Early familiarity with the question types — particularly non-verbal reasoning, which is less commonly taught in primary schools — can make a meaningful difference.",
  },
  {
    name: "Gerrards Cross",
    slug: "gerrards-cross",
    intro: "Gerrards Cross is an affluent commuter town in South Buckinghamshire where grammar school admission is a priority for many families. Its location between Beaconsfield and the London border provides access to several Buckinghamshire grammar schools.",
    nearbySchools: [
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Burnham Grammar School", url: "https://www.burnhamgrammar.org" },
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
    ],
    localContext: "Families in Gerrards Cross and the surrounding Chalfont area often consider multiple grammar school options. The town's proximity to the M40 corridor provides reasonable access to schools across a wide area of the county.",
    whyEarly: "Many Gerrards Cross parents begin researching the 11+ during Year 3, often prompted by conversations with other parents at local primary schools. Understanding the test structure, the admissions timeline, and the qualifying score of 121 early helps families avoid the rush of last-minute preparation.",
  },
  {
    name: "Marlow",
    slug: "marlow",
    intro: "Marlow is a Thames-side town on the southern edge of Buckinghamshire where grammar school aspirations are common among local families. While Marlow itself does not have a grammar school, several are within accessible distance.",
    nearbySchools: [
      { name: "Sir William Borlase's Grammar School", url: "https://www.swbgs.com" },
      { name: "Royal Grammar School High Wycombe", url: "https://www.rgshw.com" },
      { name: "Wycombe High School", url: "https://www.whs.bucks.sch.uk" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
    ],
    localContext: "Sir William Borlase's Grammar School in nearby Marlow is the closest option, but many Marlow families also apply to the High Wycombe grammar schools. The choice often depends on the child's gender, with different schools serving boys and girls.",
    whyEarly: "Marlow parents typically start their 11+ research in Year 4, particularly as the town's primary schools begin discussing secondary transition options. Understanding which schools are realistic options — and how the oversubscription criteria work — helps families target their applications effectively.",
  },
  {
    name: "Princes Risborough",
    slug: "princes-risborough",
    intro: "Princes Risborough is a small town in the Chiltern Hills where families with grammar school aspirations prepare for the Buckinghamshire 11+. Although the town is more rural than some other areas of the county, grammar school access remains an important consideration for local parents.",
    nearbySchools: [
      { name: "Aylesbury Grammar School", url: "https://www.ags.bucks.sch.uk" },
      { name: "Aylesbury High School", url: "https://www.aylesburyhigh.org" },
      { name: "Sir Henry Floyd Grammar School", url: "https://www.shfgs.org" },
      { name: "John Hampden Grammar School", url: "https://www.jhgs.bucks.sch.uk" },
    ],
    localContext: "Families in Princes Risborough tend to look toward the Aylesbury grammar schools, which are the closest options. The town's position between Aylesbury and High Wycombe means some families also consider schools in both directions.",
    whyEarly: "Parents in Princes Risborough often begin exploring the 11+ in Year 4, especially when they hear about other families in the area starting preparation. With the nearest grammar schools in Aylesbury, understanding travel logistics alongside the academic requirements helps families plan holistically.",
  },
];

export function getTownBySlug(slug: string): TownData | undefined {
  return towns.find(t => t.slug === slug);
}

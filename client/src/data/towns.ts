export interface TownData {
  name: string;
  slug: string;
  intro: string;
  nearbySchools: { name: string; url: string }[];
  localContext: string;
  whyEarly: string;
  preparation: string;
  uniqueChallenge: string;
  faq: { question: string; answer: string }[];
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
    preparation: "High Wycombe families benefit from proximity to both the Royal Grammar School and Wycombe High School — two of the most competitive grammar schools in the county. Because both schools attract applications from across a wide area, effective competition is higher than simple numbers suggest. Children typically need to perform comfortably above the 121 threshold — not merely at it — to secure a place at the most popular choices. Preparation that aims for 121 as a starting floor rather than a ceiling tends to produce better outcomes here than in less competitive areas.",
    uniqueChallenge: "The RGS in particular attracts high-achieving applicants from across South Bucks, meaning practical competition can feel more intense than the qualifying score alone suggests. Many High Wycombe families supplement school preparation with structured gap-analysis tools, using diagnostic data to focus practice rather than relying on volume alone.",
    faq: [
      {
        question: "Which grammar schools are most popular among High Wycombe families?",
        answer: "The Royal Grammar School and Wycombe High School are the two closest options. Both are consistently oversubscribed, and qualifying at 121 does not guarantee a place — oversubscription criteria typically favour children who live closer to the school. John Hampden Grammar School and Sir William Borlase's in Marlow are also commonly listed as preferences.",
      },
      {
        question: "Does the Royal Grammar School have a higher entry requirement than 121?",
        answer: "No. The qualifying threshold is the same for all 13 Buckinghamshire grammar schools — 121 on the standardised score. However, in oversubscribed schools, all qualifying applicants are eligible to be considered, and places are then allocated based on each school's individual oversubscription criteria, usually starting with looked-after children, then siblings, then distance from the school.",
      },
      {
        question: "When should High Wycombe children start preparing for the 11+?",
        answer: "Most families in the area begin structured preparation in Year 4 or early Year 5, giving children 18 to 24 months to build familiarity with the four test domains and develop pace discipline. Starting with a diagnostic assessment helps identify which areas need the most attention rather than practising all areas equally.",
      },
    ],
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
    preparation: "Aylesbury families have the advantage of two grammar schools within the town itself — Aylesbury Grammar School (boys) and Aylesbury High School (girls) — along with Sir Henry Floyd Grammar School and The Royal Latin School in Buckingham within reasonable distance. The wide catchment area of Aylesbury Vale means children arrive at the test from a broad range of primary school backgrounds. Those from schools with stronger academic enrichment programmes may have a head start on verbal reasoning and comprehension skills, making early gap identification particularly useful.",
    uniqueChallenge: "The breadth of primary schools feeding into the Aylesbury grammar schools means starting points vary considerably. A diagnostic assessment early in Year 5 gives parents the clearest picture of where their child stands relative to the 121 benchmark — which is especially valuable when the child has had limited prior exposure to GL-style question formats.",
    faq: [
      {
        question: "What grammar schools are closest to Aylesbury?",
        answer: "Aylesbury Grammar School (boys) and Aylesbury High School (girls) are both within the town itself. Sir Henry Floyd Grammar School is also in Aylesbury, on Bierton Road. The Royal Latin School is in Buckingham — approximately 20 miles away but popular with families in the northern part of the Vale. All require the same 121 qualifying score.",
      },
      {
        question: "Is the 11+ harder in Aylesbury than other parts of Buckinghamshire?",
        answer: "The Secondary Transfer Test is the same for all children across Buckinghamshire — the same paper, the same scoring process, and the same 121 qualifying threshold. Competition for specific school places varies by how oversubscribed each school is, but the test itself is identical regardless of where you live.",
      },
      {
        question: "My child is in Year 5 and hasn't started preparing yet — is it too late?",
        answer: "Not at all. Many children successfully begin structured preparation partway through Year 5. What matters most is identifying the right starting point — a diagnostic assessment early in the process reveals specific areas that need attention, so preparation time is spent where it has the most impact rather than on blanket revision across all areas.",
      },
    ],
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
    preparation: "Beaconsfield's position in South Buckinghamshire gives families access to grammar schools in both the High Wycombe corridor and the Amersham area. Children typically apply to Beaconsfield High School, Dr Challoner's High School, or Sir William Borlase's Grammar School depending on distance, gender, and individual preference. Because families in the area tend to invest significantly in preparation, a child at exactly 121 may face stiffer practical competition for places than the raw qualifying score implies — preparation that builds accuracy and pace well above the threshold tends to produce more confident performances.",
    uniqueChallenge: "Many Beaconsfield children are well-prepared by the time they sit the test. This means that children who arrive with gaps in specific areas — particularly comprehension timing or spatial reasoning — may feel the competition more acutely than their overall ability suggests. Targeted gap-analysis through diagnostic assessment helps identify and address these weak areas specifically.",
    faq: [
      {
        question: "Which grammar school is closest to Beaconsfield?",
        answer: "Beaconsfield High School (girls) is the closest option for female applicants. Boys in Beaconsfield typically apply to Dr Challoner's Grammar School in Amersham or Sir William Borlase's Grammar School in Marlow. Distance-based oversubscription criteria mean that proximity to the school matters significantly when places are allocated among qualifying applicants.",
      },
      {
        question: "Does it help to visit grammar schools before applying?",
        answer: "Most grammar schools hold open evenings in the autumn and spring of Year 5 and Year 6. Visiting is encouraged and can help families understand each school's ethos, facilities, and oversubscription criteria — information that is important when deciding which schools to list on the application form. Schools typically publicise open evening dates on their own websites.",
      },
      {
        question: "What is the difference between Beaconsfield High School and Dr Challoner's High School?",
        answer: "Both are selective girls' grammar schools. Beaconsfield High is located in Beaconsfield itself. Dr Challoner's High is in Amersham. Both require the same qualifying score of 121 and have their own oversubscription criteria. Many families in Beaconsfield list both schools in their application — the application allows up to three grammar school preferences.",
      },
    ],
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
    preparation: "Amersham is directly served by Dr Challoner's Grammar School (boys) and Dr Challoner's High School (girls), two of the county's most competitive grammar schools. Proximity to the schools gives Amersham families an advantage in distance-based oversubscription — but that advantage is only meaningful once the 121 qualifying threshold has been secured. Preparation that builds a score well above 121, rather than simply reaching it, gives parents much greater confidence going into the application process.",
    uniqueChallenge: "The Challoner's schools attract large numbers of qualifying applicants, many of whom are also local. This means the pool of qualifying children who also score highly and live nearby is significant. Preparation quality matters here — not just whether a child qualifies, but how strongly they qualify and how that performance is maintained across all four test domains.",
    faq: [
      {
        question: "Does living in Amersham give my child an advantage in getting into Dr Challoner's?",
        answer: "Proximity to the school is a factor in oversubscription criteria — but only after the 121 qualifying threshold has been met. All qualifying applicants are considered, and places are allocated based on each school's criteria: typically looked-after children first, then siblings, then distance. Proximity helps at the final allocation stage, but reaching 121 is the essential first step.",
      },
      {
        question: "Are both Challoner's schools equally competitive?",
        answer: "Both Dr Challoner's Grammar School and Dr Challoner's High School are consistently oversubscribed. Competition levels vary year-on-year depending on the number of applicants, and both schools use distance as a key oversubscription criterion. Families who apply to both schools increase their options, particularly if they are close to the Amersham campus.",
      },
      {
        question: "How long does the Bucks 11+ preparation process typically take?",
        answer: "Most families allow 12 to 18 months of structured preparation, typically beginning in Year 4 or early Year 5. A diagnostic assessment at the start of the process establishes a baseline and identifies the most important gaps, allowing preparation time to be focused rather than spread evenly across all areas regardless of need.",
      },
    ],
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
    preparation: "Non-verbal reasoning is frequently the domain where Chesham children show the widest gap between natural ability and test-ready performance. Because NVR is not part of the standard primary school curriculum, children who have not been specifically exposed to these question types — sequences, matrices, spatial transformations — often underperform relative to their underlying logical ability. Targeted practice in this area typically shows the fastest gains, and addressing it early in preparation leaves more time for the other three domains.",
    uniqueChallenge: "Many Chesham children encounter NVR question formats for the first time in a practice setting rather than through school. Early exposure to these question types is therefore high-value — not because NVR requires years of preparation, but because familiarity with the format itself removes a barrier that has nothing to do with a child's actual reasoning ability.",
    faq: [
      {
        question: "Can my child apply to both Chesham Grammar and the Challoner's schools?",
        answer: "Yes. All 13 Buckinghamshire grammar schools use the same Secondary Transfer Test, and parents can list up to three grammar schools on their application. Many Chesham families list Chesham Grammar School as one option and one or both of the Challoner's schools as additional preferences. Qualifying at 121 makes a child eligible for consideration at any school they list.",
      },
      {
        question: "Is non-verbal reasoning harder for children who haven't practised it?",
        answer: "NVR is not inherently harder than other domains, but children who are unfamiliar with the question formats — sequences, matrices, spatial transformations — often struggle initially simply because they haven't seen the types before. Exposure and practice with timed NVR questions typically produces relatively quick improvement, making it one of the highest-return areas to address early in preparation.",
      },
      {
        question: "What is the admissions timeline for Chesham Grammar School?",
        answer: "Chesham Grammar uses the same Buckinghamshire admissions timeline as all other grammar schools. Registration opens in the summer term of Year 5, the test takes place in September of Year 6, and results are released in October. School place offers come through the national admissions process the following spring — not in October. October is results day; offers come later.",
      },
    ],
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
    preparation: "Gerrards Cross sits on the M40 corridor, providing access to Beaconsfield High School, the Challoner's schools in Amersham, and Burnham Grammar School. Families in the area tend to be well-informed about the 11+ process, and many begin preparation earlier than families in less grammar-dense areas. The practical preparation challenge for Gerrards Cross children is often pace — maintaining accuracy across four domains within the time limits — rather than raw knowledge.",
    uniqueChallenge: "Because Gerrards Cross is a commuter area with generally high educational expectations, many children sitting the test from this area are well-prepared. Children who arrive with gaps in specific domains — particularly comprehension timing or spatial reasoning — may feel the competition more acutely than their overall ability suggests. Structured diagnostic assessment helps surface these gaps before they become a problem on test day.",
    faq: [
      {
        question: "Which grammar school is closest to Gerrards Cross?",
        answer: "Burnham Grammar School and Beaconsfield High School are among the closest options. Dr Challoner's Grammar School in Amersham and Dr Challoner's High School are also within reasonable distance. The most relevant school varies by gender — there is no co-educational grammar school in immediate proximity to Gerrards Cross.",
      },
      {
        question: "Does Gerrards Cross have a separate 11+ registration area?",
        answer: "No. All Buckinghamshire children go through the same registration process managed by The Buckinghamshire Grammar Schools (TBGS), regardless of which town they live in. Registration opens in the summer term of Year 5, and all children who register sit the same Secondary Transfer Test in September of Year 6.",
      },
      {
        question: "Should I use a private tutor or a diagnostic platform for preparation?",
        answer: "Many families use both. A structured diagnostic platform establishes a clear baseline and identifies specific gaps, so preparation time is targeted rather than broad. A tutor then works most effectively when they have clarity on exactly where to focus. Starting with a diagnostic — before or alongside tutoring — tends to make the overall preparation more efficient.",
      },
    ],
  },
  {
    name: "Marlow",
    slug: "marlow",
    intro: "Marlow is a Thames-side town on the southern edge of Buckinghamshire where grammar school aspirations are common among local families. Sir William Borlase's Grammar School is located in the town, with additional options in nearby High Wycombe.",
    nearbySchools: [
      { name: "Sir William Borlase's Grammar School", url: "https://www.swbgs.com" },
      { name: "Royal Grammar School High Wycombe", url: "https://www.rgshw.com" },
      { name: "Wycombe High School", url: "https://www.whs.bucks.sch.uk" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
    ],
    localContext: "Sir William Borlase's Grammar School in Marlow is the closest option, but many Marlow families also apply to the High Wycombe grammar schools. The choice often depends on the child's gender, with different schools serving boys and girls.",
    whyEarly: "Marlow parents typically start their 11+ research in Year 4, particularly as the town's primary schools begin discussing secondary transition options. Understanding which schools are realistic options — and how the oversubscription criteria work — helps families target their applications effectively.",
    preparation: "Sir William Borlase's Grammar School is located in Marlow itself, making it the nearest grammar option for local families. The school is co-educational and consistently popular, drawing applications from across the High Wycombe and Thames Valley corridor. Being in Marlow gives families a proximity advantage for Borlase's — but the school still requires a qualifying score of 121. Children who reach 121 with marginal scores in one or two domains benefit most from targeted preparation that addresses specific gaps rather than broad practice across all areas.",
    uniqueChallenge: "Borlase's is co-educational, which means it attracts a particularly broad application base. Distance-based oversubscription gives Marlow families a natural advantage at the allocation stage — but only once 121 has been reached. Preparation that builds a confident score above the threshold, rather than one that scrapes it, gives families the best chance of converting that proximity advantage into an actual place.",
    faq: [
      {
        question: "Is Sir William Borlase's Grammar School in Marlow a boys' or girls' school?",
        answer: "Borlase's is co-educational — it admits both boys and girls. This makes it one of a smaller number of mixed grammar schools in Buckinghamshire. It is consistently oversubscribed and uses standard Buckinghamshire oversubscription criteria, with distance from the school playing a key role in place allocation among qualifying applicants.",
      },
      {
        question: "Do Marlow children have priority for Borlase's Grammar School?",
        answer: "There is no formal priority for Marlow children specifically. The school's oversubscription criteria prioritise looked-after children and siblings first, then allocate remaining places by distance from the school. Being in Marlow typically means being relatively close to Borlase's, which can be advantageous in distance-based allocation — but the 121 qualifying score must be achieved first.",
      },
      {
        question: "What subjects does the 11+ test cover, and are some harder than others for most children?",
        answer: "The Buckinghamshire Secondary Transfer Test covers four domains: Verbal Reasoning, Non-Verbal Reasoning (including spatial), Mathematics, and English Comprehension. Children vary considerably in which domain they find most challenging — there is no universal ordering. A diagnostic assessment across all four areas early in preparation identifies where a specific child's gaps are, which is more useful than assuming any particular domain is harder than the others.",
      },
    ],
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
    preparation: "Princes Risborough is more rural than many other Buckinghamshire towns, and grammar school access typically involves travel to Aylesbury or High Wycombe. The nearest options — Aylesbury Grammar School, Aylesbury High School, and Sir Henry Floyd Grammar School — are between 10 and 15 miles away. For children in more rural areas, online and home-based preparation tools tend to play a more significant role, as local tutors and mock test centres are less accessible than in larger towns. A structured digital preparation approach that can be used flexibly at home works particularly well here.",
    uniqueChallenge: "Families in and around Princes Risborough sometimes have fewer local preparation resources than those in larger towns. Starting early and using a diagnostic-first approach is especially valuable here — identifying specific gaps means that whatever preparation time is available is spent where it will have the most impact, rather than divided evenly across areas that may not need equal attention.",
    faq: [
      {
        question: "Which grammar school should Princes Risborough families aim for?",
        answer: "Most families consider the Aylesbury grammar schools — Aylesbury Grammar School (boys) and Aylesbury High School (girls) are the closest geographically. Sir Henry Floyd Grammar School is another nearby option. John Hampden Grammar School in High Wycombe is also within reasonable distance for some families. Applying to more than one school is common, subject to the limit of three grammar school preferences on the application.",
      },
      {
        question: "Are there local 11+ tutors in the Princes Risborough area?",
        answer: "Tutoring availability is more limited in smaller towns and rural areas than in larger towns like Aylesbury or High Wycombe. Some families travel for tutoring sessions, while others use online platforms and home-based preparation materials. A structured diagnostic-first approach ensures that any self-directed preparation is focused on the right areas rather than working through general practice in all subjects equally.",
      },
      {
        question: "Is the 11+ test the same for children in rural Buckinghamshire as for those in larger towns?",
        answer: "Yes — the Buckinghamshire Secondary Transfer Test is the same paper for every child across the county, administered at designated test centres in September of Year 6. The qualifying score of 121 is the same regardless of where you live. Only the admissions criteria for specific schools vary — and these typically depend on distance from the school, not the child's home area.",
      },
    ],
  },
];

export function getTownBySlug(slug: string): TownData | undefined {
  return towns.find(t => t.slug === slug);
}

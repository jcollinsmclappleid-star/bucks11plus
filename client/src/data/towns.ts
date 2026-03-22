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
        question: "Is non-verbal reasoning harder for children who haven't practiced it?",
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
  {
    name: "Great Missenden",
    slug: "great-missenden",
    intro: "Great Missenden is a Chiltern village best known as the home of Roald Dahl, and is also the location of John Hampden Grammar School — one of Buckinghamshire's boys' grammar schools. For families in the Great Missenden area, the 11+ is a significant local event, with grammar school provision on their doorstep.",
    nearbySchools: [
      { name: "John Hampden Grammar School", url: "https://www.jhgs.bucks.sch.uk" },
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
      { name: "Chesham Grammar School", url: "https://www.cheshamgrammar.org" },
    ],
    localContext: "Great Missenden's position in the Chiltern Hills places it well for access to both John Hampden Grammar School (in the village itself) and the Challoner's schools in Amersham. Families in the area often have a natural first preference for John Hampden for boys, with the Challoner's schools as a strong alternative.",
    whyEarly: "With John Hampden Grammar School in the village itself, parents in Great Missenden are typically well-informed about the 11+ from early in primary school. Many begin understanding the test format and requirements in Year 4, with structured preparation starting in Year 5.",
    preparation: "Boys in Great Missenden have one of the most convenient grammar school arrangements in Buckinghamshire — John Hampden Grammar School is a short distance from the village. For girls, Dr Challoner's High School in Little Chalfont (Amersham) is the nearest girls' grammar option. Preparation for all Buckinghamshire grammar schools uses the same GL Assessment materials and targets the same 121 qualifying score, so preparation for John Hampden transfers equally to applications at the Challoner's schools.",
    uniqueChallenge: "Despite the proximity advantage, achieving 121 remains the essential first step for any child applying to John Hampden or any other Buckinghamshire grammar school. Children in Great Missenden who live close to the school should not assume that proximity alone is sufficient — the qualifying threshold must be met first, and then distance plays a role in allocation.",
    faq: [
      {
        question: "Is John Hampden Grammar School in Great Missenden?",
        answer: "Yes. John Hampden Grammar School is on London Road in Great Missenden, HP16 0BE. It is a selective boys' grammar school and is one of the 13 grammar schools in the Buckinghamshire Secondary Transfer Consortium. All Buckinghamshire grammar schools use the same test and the same qualifying score of 121.",
      },
      {
        question: "What grammar schools can girls from Great Missenden apply to?",
        answer: "Girls in Great Missenden typically consider Dr Challoner's High School in Little Chalfont (Amersham), Chesham Grammar School (co-educational), or other Buckinghamshire grammar schools within reasonable distance. The application allows up to three grammar school preferences.",
      },
      {
        question: "Does living in Great Missenden give children priority at John Hampden?",
        answer: "Proximity to the school is a factor in oversubscription criteria after the 121 qualifying threshold is met. Living close to John Hampden Grammar School improves a child's position in distance-based allocation, but qualifying is the essential prerequisite — distance only determines allocation among qualifying applicants.",
      },
    ],
  },
  {
    name: "Wendover",
    slug: "wendover",
    intro: "Wendover is a market town in the Chiltern Hills, to the south-east of Aylesbury. Families in Wendover preparing for the Buckinghamshire 11+ typically look toward the Aylesbury grammar schools, which are the closest options, while also considering John Hampden Grammar School via the A413 corridor.",
    nearbySchools: [
      { name: "Aylesbury Grammar School", url: "https://www.ags.bucks.sch.uk" },
      { name: "Aylesbury High School", url: "https://www.aylesburyhigh.org" },
      { name: "Sir Henry Floyd Grammar School", url: "https://www.shfgs.org" },
      { name: "John Hampden Grammar School", url: "https://www.jhgs.bucks.sch.uk" },
    ],
    localContext: "Wendover sits between Aylesbury and the Chiltern Hills. The Aylesbury grammar schools are approximately 5–7 miles away, making them the most practical options for most Wendover families. Some families also consider John Hampden via the A413 route through Great Missenden.",
    whyEarly: "Wendover families often begin thinking about the 11+ in Year 4, prompted by conversations with other local parents. Understanding the admissions timeline — particularly the Year 5 registration deadline — and getting a clear picture of how the standardised scoring works helps families plan effectively.",
    preparation: "Boys in Wendover typically apply to Aylesbury Grammar School, with Sir Henry Floyd Grammar School (co-educational) as an additional option. Girls usually consider Aylesbury High School and Sir Henry Floyd. The schools are within reasonable driving distance, and their co-educational character at Sir Henry Floyd makes it popular with families who prefer a mixed environment. All three use the same Secondary Transfer Test and the same 121 qualifying score.",
    uniqueChallenge: "Wendover families are in the catchment area of both the Aylesbury grammar schools and, to some extent, the High Wycombe/Chilterns grammar schools. Understanding which schools offer the most realistic distance prospects is important before finalising application preferences. Checking recent admissions data for each school's last-allocated distance is advisable for families who are not within easy reach of any single school.",
    faq: [
      {
        question: "Which grammar school is closest to Wendover?",
        answer: "The Aylesbury grammar schools — Aylesbury Grammar School (boys), Aylesbury High School (girls), and Sir Henry Floyd Grammar School (co-ed) — are the closest options, approximately 5–7 miles from Wendover. All three require the same 121 qualifying score.",
      },
      {
        question: "Can Wendover children apply to the Challoner's schools in Amersham?",
        answer: "Yes. The admissions process allows children from anywhere in Buckinghamshire to apply to any of the 13 grammar schools. The Challoner's schools in Amersham are approximately 10 miles from Wendover. Distance-based allocation means Wendover children would likely be at a disadvantage compared to applicants closer to Amersham, but applying as a preference is always an option.",
      },
      {
        question: "Is preparation for the 11+ different depending on which grammar school we target?",
        answer: "No. All 13 Buckinghamshire grammar schools use the same Secondary Transfer Test, produced by GL Assessment. The preparation is identical regardless of which schools you are targeting. The test, the question types, and the 121 qualifying score are the same for every Buckinghamshire grammar school.",
      },
    ],
  },
  {
    name: "Chalfont St Giles",
    slug: "chalfont-st-giles",
    intro: "Chalfont St Giles is a village in South Buckinghamshire close to the Hertfordshire border, well-placed for access to the Challoner's schools in Amersham and Little Chalfont. It is a popular residential area for families with grammar school aspirations due to its proximity to some of the county's most sought-after selective schools.",
    nearbySchools: [
      { name: "Dr Challoner's High School", url: "https://www.dchigh.org" },
      { name: "Dr Challoner's Grammar School", url: "https://www.challoners.com" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
      { name: "Chesham Grammar School", url: "https://www.cheshamgrammar.org" },
    ],
    localContext: "Chalfont St Giles sits close to Little Chalfont, where Dr Challoner's High School is located. This proximity makes it one of the villages most strategically positioned for girls' grammar school access in South Buckinghamshire. Boys in the area typically target Dr Challoner's Grammar School in Amersham Old Town.",
    whyEarly: "With Dr Challoner's High School effectively on the doorstep of Chalfont St Giles, families in the village often begin thinking about the 11+ earlier than those in more distant areas. The competitive nature of the Challoner's schools means that preparation quality matters as much as proximity.",
    preparation: "Girls in Chalfont St Giles are geographically well-placed for Dr Challoner's High School in Little Chalfont — one of the most sought-after girls' grammar schools in Buckinghamshire. Boys typically target Dr Challoner's Grammar School in Amersham. Both schools require the same 121 qualifying threshold. Because the Challoner's schools are among the most competitive in the county, preparation should aim for a confident score above 121, not simply at it.",
    uniqueChallenge: "The Challoner's schools' combination of strong reputation and tight distance allocation means that living in Chalfont St Giles is an advantage — but not a guarantee. A child who achieves 121 but lives further from the school than other qualifying applicants may not receive an offer. Preparation that aims for a strong score across all four domains, rather than a borderline pass, gives the best overall position.",
    faq: [
      {
        question: "How close is Chalfont St Giles to Dr Challoner's High School?",
        answer: "Dr Challoner's High School is on Cokes Lane in Little Chalfont, which is immediately adjacent to Chalfont St Giles. The school is one of the closest girls' grammar schools to this area of South Buckinghamshire, making Chalfont St Giles families well-placed from a distance perspective.",
      },
      {
        question: "What grammar schools can boys from Chalfont St Giles apply to?",
        answer: "Boys in Chalfont St Giles typically apply to Dr Challoner's Grammar School in Amersham Old Town. John Hampden Grammar School in Great Missenden is another option, approximately 8 miles away. The application allows up to three grammar school preferences.",
      },
      {
        question: "Is proximity to the Challoner's schools enough to guarantee a place?",
        answer: "Proximity helps with distance-based allocation, but only after the 121 qualifying threshold has been met. All qualifying applicants are considered, and places are allocated by oversubscription criteria — primarily distance. Children who qualify comfortably are in a better position than those who qualify at exactly 121, regardless of distance.",
      },
    ],
  },
  {
    name: "Hazlemere",
    slug: "hazlemere",
    intro: "Hazlemere is a suburban area between High Wycombe and Beaconsfield in South Buckinghamshire. Families in Hazlemere have good access to the High Wycombe grammar schools, and the area sees strong participation in 11+ preparation due to its proximity to some of Buckinghamshire's most competitive selective schools.",
    nearbySchools: [
      { name: "Royal Grammar School High Wycombe", url: "https://www.rgshw.com" },
      { name: "Wycombe High School", url: "https://www.whs.bucks.sch.uk" },
      { name: "John Hampden Grammar School", url: "https://www.jhgs.bucks.sch.uk" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
    ],
    localContext: "Hazlemere sits to the north-east of High Wycombe, giving families reasonably close access to both RGS and Wycombe High School. The area's proximity to these high-demand schools means many Hazlemere families begin preparation well in advance of the test.",
    whyEarly: "The competitive nature of the High Wycombe grammar schools — particularly RGS and Wycombe High — means Hazlemere families typically start thinking about the 11+ in Year 4. Understanding which schools are realistic from a distance perspective helps families target their preparation and applications effectively.",
    preparation: "Boys in Hazlemere most commonly apply to Royal Grammar School High Wycombe, with John Hampden Grammar School as an alternative. Girls typically target Wycombe High School, with Beaconsfield High School as a second option. All four schools use the same Secondary Transfer Test and the same qualifying score. Because RGS and Wycombe High are among the most competitive in the county, preparation that builds a score well above 121 — not merely at it — puts Hazlemere children in the strongest possible position.",
    uniqueChallenge: "Hazlemere is close to but not necessarily within the tightest distance cut-off of the High Wycombe grammar schools. Distance from Hazlemere to RGS or Wycombe High can vary significantly depending on specific home address. Checking the school's most recent admissions data to understand realistic distance thresholds is important before finalising applications.",
    faq: [
      {
        question: "Is Hazlemere within the catchment area for Royal Grammar School?",
        answer: "Buckinghamshire grammar schools do not have fixed catchment boundaries — they use distance-based oversubscription, which varies year to year depending on the number of qualifying applicants. Hazlemere is close to High Wycombe, but whether any specific Hazlemere address falls within the effective distance cut-off for RGS depends on that year's admissions data. Checking recent published data from Buckinghamshire Council is the most reliable guide.",
      },
      {
        question: "What grammar schools can girls in Hazlemere apply to?",
        answer: "Girls in Hazlemere typically consider Wycombe High School in High Wycombe and Beaconsfield High School. Both require the 121 qualifying score. Distance allocation for Wycombe High generally favours families closer to central High Wycombe, while Beaconsfield High serves the Beaconsfield corridor more directly. Many Hazlemere families list both.",
      },
      {
        question: "How early should Hazlemere families start 11+ preparation?",
        answer: "Most families in Hazlemere begin structured preparation in Year 5, typically in the autumn term. Starting with a diagnostic assessment early in Year 5 establishes a clear baseline and identifies specific gaps, allowing preparation to be focused rather than spread evenly across all areas.",
      },
    ],
  },
  {
    name: "Buckingham",
    slug: "buckingham",
    intro: "Buckingham is the county town of Buckinghamshire and home to The Royal Latin School, one of the county's 13 grammar schools. For families in and around Buckingham, the 11+ is the route to grammar school entry, and preparation is a common part of local family life for children approaching Year 6.",
    nearbySchools: [
      { name: "The Royal Latin School", url: "https://www.royallatin.org" },
      { name: "Aylesbury Grammar School", url: "https://www.ags.bucks.sch.uk" },
      { name: "Aylesbury High School", url: "https://www.aylesburyhigh.org" },
      { name: "Sir Henry Floyd Grammar School", url: "https://www.shfgs.org" },
    ],
    localContext: "Buckingham has The Royal Latin School — a co-educational grammar school — within the town. Families in Buckingham and the surrounding villages of north Buckinghamshire have relatively fewer grammar school options than families in the south of the county, making the Royal Latin School the natural primary choice.",
    whyEarly: "With only one grammar school within Buckingham itself (the Royal Latin School), families are often very focused on this option. Understanding the school's oversubscription criteria and the 121 qualifying score requirement early helps families plan effectively and ensures the registration deadline in Year 5 is not missed.",
    preparation: "The Royal Latin School is co-educational, which makes it equally relevant for boys and girls in the Buckingham area. Families further from Buckingham who want a second grammar option typically consider the Aylesbury schools (approximately 15 miles south). All Buckinghamshire grammar schools use the same test and qualifying score. Because Buckingham has fewer local preparation resources than larger towns, online and home-based preparation tools often play a larger role here.",
    uniqueChallenge: "Families in and around Buckingham are in the most northerly part of Buckinghamshire and may have fewer local tutors and preparation centres than families in High Wycombe or Amersham. A structured digital preparation approach that can be used flexibly at home is particularly well-suited to this area. Starting with a diagnostic assessment identifies specific gaps and ensures limited preparation time is spent where it has the most impact.",
    faq: [
      {
        question: "Is The Royal Latin School the only grammar school in Buckingham?",
        answer: "Yes. The Royal Latin School is the only grammar school in Buckingham town. It is a co-educational selective school, meaning both boys and girls compete for places. The nearest alternative grammar schools are in Aylesbury, approximately 15 miles to the south.",
      },
      {
        question: "Can Buckingham children apply to grammar schools in Aylesbury?",
        answer: "Yes. The Buckinghamshire admissions process allows parents to list up to three grammar school preferences from any of the 13 grammar schools in the county. Many Buckingham families list The Royal Latin School as first preference and one or more Aylesbury schools as alternatives, depending on distance and preference.",
      },
      {
        question: "Are there 11+ tutors in Buckingham?",
        answer: "Tutoring availability in Buckingham is more limited than in larger Bucks towns. Some families travel for sessions or use online tutoring. A diagnostic-led self-preparation approach using digital platforms is practical for families in this area, as it establishes a clear picture of where to focus before investing in tutoring time.",
      },
    ],
  },
  {
    name: "Flackwell Heath",
    slug: "flackwell-heath",
    intro: "Flackwell Heath is a residential village overlooking the Thames Valley between High Wycombe and Marlow. Its position makes it one of the closer communities to two popular grammar school corridors — High Wycombe and Marlow — giving families access to several grammar school options.",
    nearbySchools: [
      { name: "Royal Grammar School High Wycombe", url: "https://www.rgshw.com" },
      { name: "Wycombe High School", url: "https://www.whs.bucks.sch.uk" },
      { name: "Sir William Borlase's Grammar School", url: "https://www.swbgs.com" },
      { name: "Beaconsfield High School", url: "https://www.beaconsfieldhigh.bucks.sch.uk" },
    ],
    localContext: "Flackwell Heath sits above the Thames Valley between High Wycombe and Marlow, making it relatively close to both. Families in the village have a reasonable choice of grammar schools: the High Wycombe schools to the north and Borlase's in Marlow to the south-east.",
    whyEarly: "Flackwell Heath families with grammar school ambitions typically begin researching the 11+ in Year 4. The choice of which grammar schools to target — High Wycombe or Marlow — often depends on travel logistics and the gender of the child (Borlase's is co-educational; RGS is boys-only; Wycombe High and Beaconsfield High are girls-only).",
    preparation: "Boys in Flackwell Heath can realistically target RGS or Borlase's depending on proximity. Girls might consider Wycombe High, Beaconsfield High, or Borlase's. Because multiple grammar schools are within range, families should check recent distance data for each school to understand which provides the most realistic allocation position. All schools use the same test and the same qualifying score.",
    uniqueChallenge: "Flackwell Heath's position between grammar school corridors means the distance calculation matters differently for different schools. Families should consider the specific distance from their home address to each school's entrance when planning applications — not just the general area.",
    faq: [
      {
        question: "Is Flackwell Heath in the catchment area for RGS or Borlase's?",
        answer: "Neither school has a fixed catchment boundary. Both use distance-based oversubscription after the 121 qualifying score is met. Whether a specific Flackwell Heath address falls within the effective distance cut-off for either school depends on that year's admissions data. Checking recent published data from Buckinghamshire Council is the most reliable guide.",
      },
      {
        question: "Which grammar school is closest to Flackwell Heath?",
        answer: "Flackwell Heath is approximately 2–3 miles from central High Wycombe (where RGS and Wycombe High are located) and approximately 4 miles from Marlow (where Borlase's is). The closest grammar school for any specific family in Flackwell Heath depends on their exact address.",
      },
      {
        question: "Is Sir William Borlase's Grammar School a good option for Flackwell Heath families?",
        answer: "Borlase's in Marlow is within reasonable distance of Flackwell Heath and is co-educational, making it relevant for both boys and girls. It typically has a broader distance cut-off than the High Wycombe schools, making it potentially more accessible for Flackwell Heath families. The 121 qualifying score applies equally here.",
      },
    ],
  },
];

export function getTownBySlug(slug: string): TownData | undefined {
  return towns.find(t => t.slug === slug);
}


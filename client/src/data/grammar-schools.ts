export interface GrammarSchoolData {
  slug: string;
  name: string;
  shortName: string;
  town: string;
  gender: "boys" | "girls" | "coed";
  website: string;
  address: string;
  intro: string;
  admissionsContext: string;
  catchmentContext: string;
  distanceContext: string;
  uniqueFeatures: string;
  preparationAdvice: string;
  faq: { question: string; answer: string }[];
}

export const grammarSchools: GrammarSchoolData[] = [
  {
    slug: "royal-grammar-school-high-wycombe",
    name: "Royal Grammar School High Wycombe",
    shortName: "RGS High Wycombe",
    town: "High Wycombe",
    gender: "boys",
    website: "https://www.rgshw.com",
    address: "Amersham Road, High Wycombe, HP13 6QT",
    intro: "The Royal Grammar School High Wycombe (RGS) is one of Buckinghamshire's most prominent boys' grammar schools, located on Amersham Road in High Wycombe. It attracts applications from a wide area of South Buckinghamshire, meaning practical competition for places is consistently high.",
    admissionsContext: "RGS uses the standard Buckinghamshire admissions process. All applicants must achieve the qualifying score of 121 on the Secondary Transfer Test. Places are then allocated using the school's oversubscription criteria: looked-after children first, then siblings of current pupils, then by distance from the school. Because the school draws applicants from a wide catchment, the distance cut-off for non-sibling places varies year to year but has historically been well under 5 miles for the most recent cohorts.",
    catchmentContext: "The school sits on the Amersham Road at the northern edge of High Wycombe. Families in High Wycombe itself are typically closest, but applications regularly come from Beaconsfield, Flackwell Heath, Tylers Green, Hazlemere, and further afield. Distance is measured in a straight line from the child's home address to the school's main entrance.",
    distanceContext: "As one of the highest-profile grammar schools in Buckinghamshire, RGS consistently attracts more qualifying applicants than places available. Children who qualify at 121 are not guaranteed a place — only those within the distance threshold receive offers. Families outside central High Wycombe should not assume proximity; checking the school's most recent admissions data via the Buckinghamshire Council website gives the most accurate picture of realistic distance cut-offs.",
    uniqueFeatures: "RGS is a boys-only grammar school, one of two in the High Wycombe area (alongside John Hampden Grammar School). The school has a strong academic record, regular appearances in national Sixth Form league tables, and a broad co-curricular programme. It is heavily oversubscribed each year.",
    preparationAdvice: "Because RGS attracts highly prepared applicants, children who qualify at exactly 121 face more uncertainty than those who qualify well above the threshold. Preparation that targets a strong performance across all four test domains — not just a pass — gives families the best foundation when applying to RGS alongside other grammar preferences.",
    faq: [
      {
        question: "Is the Royal Grammar School High Wycombe boys-only?",
        answer: "Yes. RGS is a selective boys' grammar school. It is one of two boys' grammar schools in the High Wycombe area — the other being John Hampden Grammar School in Great Missenden. Girls applying to grammar school in the area typically consider Wycombe High School or one of the Challoner's schools in Amersham.",
      },
      {
        question: "What is the distance cut-off for RGS admissions?",
        answer: "The exact distance cut-off varies year to year depending on the number of qualifying applicants. Buckinghamshire Council publishes the final distance at which the last non-sibling place was offered each year — this data is the most reliable guide for families. The school does not publish a fixed catchment boundary.",
      },
      {
        question: "Does achieving 121 guarantee a place at RGS?",
        answer: "No. A score of 121 or above qualifies a child for grammar school, but it does not guarantee a place at any specific school. At RGS, all qualifying applicants are considered, and places are allocated using oversubscription criteria. In recent years the school has been significantly oversubscribed, meaning distance from the school has been the deciding factor for most non-sibling applicants.",
      },
    ],
  },
  {
    slug: "wycombe-high-school",
    name: "Wycombe High School",
    shortName: "Wycombe High",
    town: "High Wycombe",
    gender: "girls",
    website: "https://www.whs.bucks.sch.uk",
    address: "Marlow Road, High Wycombe, HP11 1TB",
    intro: "Wycombe High School is a selective girls' grammar school located on Marlow Road in High Wycombe. It is one of the most sought-after grammar schools in Buckinghamshire and draws applications from families across a wide area of South Bucks.",
    admissionsContext: "Wycombe High uses the standard Buckinghamshire oversubscription criteria: looked-after children first, siblings next, then distance from the school. It is consistently oversubscribed, and the effective distance cut-off for non-sibling places is typically tight — families living several miles away should not assume proximity without checking recent data.",
    catchmentContext: "The school is located in central High Wycombe and is the nearest girls' grammar option for families in High Wycombe, Flackwell Heath, Hazlemere, and surrounding areas. Girls from further south — including parts of Beaconsfield — may also apply, though distance allocation can limit offers for those further away.",
    distanceContext: "Wycombe High is among the most oversubscribed girls' grammar schools in Buckinghamshire. Families in High Wycombe and immediate surrounding areas are well-placed from a distance perspective, but qualifying comfortably — rather than at exactly 121 — gives the best overall position when applying to the school.",
    uniqueFeatures: "Wycombe High is a girls-only selective school with a strong Sixth Form and a well-regarded academic programme. The school is consistently ranked in national selective school performance data and is popular with families throughout South Bucks.",
    preparationAdvice: "Wycombe High's consistent oversubscription means families should not rely solely on achieving 121. Preparation that builds confidence across all four GL Assessment domains — particularly comprehension and verbal reasoning — is important for girls applying to this school.",
    faq: [
      {
        question: "Is Wycombe High School girls-only?",
        answer: "Yes. Wycombe High School is a selective girls' grammar school. Boys in High Wycombe typically apply to Royal Grammar School or John Hampden Grammar School. Families with daughters should also consider Beaconsfield High School and the Challoner's High School in Amersham.",
      },
      {
        question: "How competitive is admission to Wycombe High?",
        answer: "Very competitive. The school is consistently oversubscribed, meaning that qualifying at 121 does not guarantee a place. Distance from the school is the key tiebreaker after looked-after children and siblings. Families should check the most recent admissions data via Buckinghamshire Council to understand realistic distance thresholds.",
      },
      {
        question: "Can my daughter apply to both Wycombe High and Beaconsfield High?",
        answer: "Yes. The Buckinghamshire admissions process allows parents to list up to three grammar school preferences. Many families in the High Wycombe area list both Wycombe High and Beaconsfield High, plus one additional choice, depending on distance and preference.",
      },
    ],
  },
  {
    slug: "john-hampden-grammar-school",
    name: "John Hampden Grammar School",
    shortName: "John Hampden",
    town: "Great Missenden",
    gender: "boys",
    website: "https://www.jhgs.bucks.sch.uk",
    address: "London Road, Great Missenden, HP16 0BE",
    intro: "John Hampden Grammar School is a selective boys' grammar school located in Great Missenden, in the Chiltern Hills area of Buckinghamshire. It serves boys from a wide corridor including Great Missenden, Chesham, Amersham, and parts of High Wycombe.",
    admissionsContext: "John Hampden uses the standard Buckinghamshire admissions criteria. The qualifying score of 121 is required, with places then allocated by distance after looked-after children and siblings. Being located in a less urbanised area than High Wycombe, the school's distance dynamics differ — families in surrounding villages can be competitive.",
    catchmentContext: "The school's Great Missenden location makes it well-placed for families in the Chiltern villages, Amersham, Chesham, and the northern fringes of High Wycombe. Many boys from these areas list John Hampden alongside RGS or Aylesbury Grammar depending on their location.",
    distanceContext: "John Hampden typically has a broader distance cut-off than the High Wycombe schools, reflecting its more rural location and slightly smaller applicant pool. However, it remains consistently oversubscribed, and the qualifying score remains a firm requirement.",
    uniqueFeatures: "Set in the Chiltern countryside, John Hampden offers a distinctive environment compared to town-centre schools. It is the principal boys' grammar option for families in the Great Missenden and Chesham corridors who may not be within easy reach of High Wycombe.",
    preparationAdvice: "Boys applying to John Hampden often also apply to RGS or Aylesbury Grammar School, so preparation should be aimed at strong performance rather than a borderline qualifying score. The school's relative breadth of distance cut-off makes it accessible to families across a wider area, but the 121 threshold remains non-negotiable.",
    faq: [
      {
        question: "Where is John Hampden Grammar School located?",
        answer: "John Hampden Grammar School is on London Road in Great Missenden, HP16 0BE. It is approximately 4 miles from Amersham and around 9 miles from central High Wycombe, making it the nearest boys' grammar school for families in the Chesham and Great Missenden areas.",
      },
      {
        question: "Which areas does John Hampden Grammar serve?",
        answer: "The school draws applications from Great Missenden, Chesham, Amersham, the Chiltern villages, and parts of High Wycombe. Boys who live in areas equidistant from John Hampden and RGS often list both on their application.",
      },
      {
        question: "Is John Hampden as competitive as RGS?",
        answer: "Both schools are selective and require the 121 qualifying threshold. Practical competition at John Hampden tends to be slightly less acute than at RGS in terms of distance cut-off, given its more rural location — but it is still consistently oversubscribed and qualifying comfortably is always the better position.",
      },
    ],
  },
  {
    slug: "sir-william-borlases-grammar-school",
    name: "Sir William Borlase's Grammar School",
    shortName: "Borlase's",
    town: "Marlow",
    gender: "coed",
    website: "https://www.swbgs.com",
    address: "West Street, Marlow, SL7 2BR",
    intro: "Sir William Borlase's Grammar School is a co-educational selective grammar school in Marlow. It is one of the few mixed grammar schools in Buckinghamshire and draws applications from Marlow, Flackwell Heath, and the Thames Valley corridor.",
    admissionsContext: "Borlase's uses the standard Buckinghamshire admissions process: qualifying at 121, then oversubscription criteria prioritising looked-after children, siblings, and distance. As a co-educational school, it attracts applications from both boys and girls across a wide area.",
    catchmentContext: "Located in central Marlow on West Street, the school is closest to families in the town itself. Significant numbers of applications come from High Wycombe, Flackwell Heath, Bourne End, and Cookham. Distance measurement is from the child's home to the school gate.",
    distanceContext: "Because Borlase's is co-educational and the nearest grammar for many families south of High Wycombe, it attracts a broad and competitive applicant pool. Marlow families typically have a distance advantage, but the school can be oversubscribed among qualifying applicants from the surrounding area.",
    uniqueFeatures: "Borlase's is notable as one of Buckinghamshire's mixed grammar schools, meaning both boys and girls compete for places at the same school — unlike most grammar schools in the county which are single-sex. This makes it popular with families who prefer a co-educational setting.",
    preparationAdvice: "Families in Marlow and the surrounding area who are targeting Borlase's should prepare for a competitive field. Boys who might otherwise target RGS or John Hampden, and girls targeting Wycombe High or Beaconsfield High, both apply to Borlase's — creating a diverse and well-prepared applicant pool.",
    faq: [
      {
        question: "Is Sir William Borlase's Grammar School mixed or single-sex?",
        answer: "Borlase's is co-educational — it admits both boys and girls. This makes it one of a smaller number of mixed grammar schools in Buckinghamshire. It uses the same admissions process as all 13 Bucks grammar schools, with the 121 qualifying threshold applying equally to both boys and girls.",
      },
      {
        question: "Is Borlase's the only grammar school in Marlow?",
        answer: "Yes, Borlase's is the only grammar school in Marlow itself. The nearest alternatives are Wycombe High School (girls, High Wycombe), Royal Grammar School (boys, High Wycombe), and Beaconsfield High School (girls, Beaconsfield).",
      },
      {
        question: "Do Marlow families get priority at Borlase's?",
        answer: "There is no formal priority for Marlow residents as a category. The oversubscription criteria prioritise looked-after children, then siblings, then distance from the school. Being in Marlow typically means being close to the school and therefore competitive on distance, but the 121 qualifying threshold must be met first.",
      },
    ],
  },
  {
    slug: "dr-challoners-grammar-school",
    name: "Dr Challoner's Grammar School",
    shortName: "Dr Challoner's (boys)",
    town: "Amersham",
    gender: "boys",
    website: "https://www.challoners.com",
    address: "Chesham Road, Amersham, HP6 5HA",
    intro: "Dr Challoner's Grammar School is a highly competitive boys' selective grammar school on Chesham Road in Amersham. It is one of the most sought-after grammar schools in Buckinghamshire and consistently attracts a large pool of well-prepared applicants.",
    admissionsContext: "The school uses the standard Buckinghamshire admissions criteria. The qualifying score of 121 is essential; places are then allocated by oversubscription criteria in the order: looked-after children, siblings, and distance. The school is consistently oversubscribed and the effective distance cut-off for non-sibling places is among the tightest in the county.",
    catchmentContext: "Challoner's is situated in Amersham Old Town and draws applications from Amersham, Chesham, Gerrards Cross, Beaconsfield, Little Chalfont, and as far as Rickmansworth in Hertfordshire. The school is easily accessible from the Metropolitan and Chiltern railway lines.",
    distanceContext: "Dr Challoner's is one of the most oversubscribed boys' grammar schools in Buckinghamshire. Qualifying at exactly 121 is typically insufficient for non-sibling applicants from beyond Amersham itself. Families more than 4–5 miles from the school should treat it as a stretch option unless they are well above the qualifying threshold.",
    uniqueFeatures: "Challoner's sits alongside Dr Challoner's High School (girls) in Amersham, effectively providing a paired selective provision for the area. The school has an outstanding academic record and is frequently ranked among the top state schools nationally at GCSE and A-level. Sixth Form students from both Challoner's schools share resources.",
    preparationAdvice: "Families targeting Dr Challoner's should prepare ambitiously — the strong performance of the typical qualifying applicant in this area means preparation aimed at a borderline 121 is unlikely to result in a place. Comprehensive preparation across all four GL Assessment domains, with particular emphasis on timing and accuracy, is advisable.",
    faq: [
      {
        question: "What is the distance cut-off for Dr Challoner's Grammar School?",
        answer: "The exact cut-off varies year to year. In recent years it has been extremely tight — often under 3 miles for non-sibling applicants. Buckinghamshire Council publishes the precise distance after each admissions round, and this is the most reliable source for planning. The school does not pre-publish a catchment boundary.",
      },
      {
        question: "Is there a difference between Dr Challoner's Grammar School and Dr Challoner's High School?",
        answer: "Yes. Dr Challoner's Grammar School is a boys-only selective school. Dr Challoner's High School is a girls-only selective school. They are separate schools with separate admission processes, but they share a campus tradition and some Sixth Form resources. Both require the same 121 qualifying score.",
      },
      {
        question: "Can my son apply to both Challoner's and John Hampden?",
        answer: "Yes. The Buckinghamshire admissions process allows up to three grammar school preferences. Many boys in the Amersham and Chesham areas list Dr Challoner's Grammar School alongside John Hampden Grammar School and one further choice. The schools use the same test, so preparation applies to all of them equally.",
      },
    ],
  },
  {
    slug: "dr-challoners-high-school",
    name: "Dr Challoner's High School",
    shortName: "Dr Challoner's High",
    town: "Amersham",
    gender: "girls",
    website: "https://www.dchigh.org",
    address: "Cokes Lane, Little Chalfont, HP7 9QB",
    intro: "Dr Challoner's High School is a selective girls' grammar school located in Little Chalfont near Amersham. Along with the nearby boys' school of the same name, it forms the paired Challoner's provision for the Chiltern area. It is consistently oversubscribed and highly sought after.",
    admissionsContext: "The school uses the standard Buckinghamshire admissions process: 121 qualifying score, then oversubscription criteria of looked-after children, siblings, and distance. Located in Little Chalfont, the effective distance calculation is from the school's Cokes Lane address — which matters for families choosing between this school and the nearby Challoner's Grammar in Amersham Old Town.",
    catchmentContext: "The school sits in Little Chalfont, between Amersham and Chorleywood. It draws applications from families across the Chiltern area, including Amersham, Beaconsfield, Chesham, Gerrards Cross, and across the county border into Hertfordshire. The school benefits from good rail access via nearby stations.",
    distanceContext: "Like its boys' counterpart, Dr Challoner's High School is among the most competitive for place allocation in Buckinghamshire. The combination of a strong academic reputation and a geographically broad applicant pool means the distance cut-off for non-sibling places is consistently tight.",
    uniqueFeatures: "Dr Challoner's High School occupies the Little Chalfont campus, distinct from the Challoner's Grammar School site in Amersham Old Town. The Sixth Forms of both schools collaborate, giving students access to a broader range of A-level subjects than either school could offer independently.",
    preparationAdvice: "Girls applying to Dr Challoner's High should aim to qualify with a comfortable margin above 121. The applicant pool tends to be well-prepared, and the tight distance allocation at this school means the strength of the score matters less than proximity — but ensuring qualification with room to spare is the essential first step.",
    faq: [
      {
        question: "Where is Dr Challoner's High School located?",
        answer: "Dr Challoner's High School is on Cokes Lane in Little Chalfont, HP7 9QB — not in Amersham Old Town where the boys' school is. This matters for distance calculations in admissions. Families should use their home-to-school straight-line distance from the Cokes Lane address when assessing their admissions position.",
      },
      {
        question: "Is Dr Challoner's High School the same as Dr Challoner's Grammar School?",
        answer: "They are separate schools under the same heritage name. Dr Challoner's Grammar School is boys-only, on Chesham Road in Amersham. Dr Challoner's High School is girls-only, on Cokes Lane in Little Chalfont. They are different schools with different sites, separate admissions, and different distance calculations.",
      },
      {
        question: "My daughter is in Little Chalfont — does she have a distance advantage at Challoner's High?",
        answer: "Being in Little Chalfont does provide a proximity advantage for the Cokes Lane campus. However, many applicants from across the Chiltern area apply to this school, so proximity alone does not guarantee a place. Achieving 121 is the prerequisite; distance then determines allocation among qualifying applicants.",
      },
    ],
  },
  {
    slug: "beaconsfield-high-school",
    name: "Beaconsfield High School",
    shortName: "Beaconsfield High",
    town: "Beaconsfield",
    gender: "girls",
    website: "https://www.beaconsfieldhigh.bucks.sch.uk",
    address: "Wattleton Road, Beaconsfield, HP9 1RR",
    intro: "Beaconsfield High School is a selective girls' grammar school on Wattleton Road in Beaconsfield. It is the primary girls' grammar option for families in South Buckinghamshire and consistently attracts applications from a wide area including Gerrards Cross, Marlow, and parts of High Wycombe.",
    admissionsContext: "Beaconsfield High uses the standard Buckinghamshire admissions criteria: qualifying score of 121, then oversubscription criteria in order of looked-after children, siblings, and distance from the school. The school is oversubscribed each year.",
    catchmentContext: "Located in Beaconsfield off Wattleton Road, the school draws applications from Beaconsfield, Gerrards Cross, Marlow, Flackwell Heath, and parts of High Wycombe. It is the only girls' grammar school within easy reach of Gerrards Cross and the M40 corridor, making it popular with families across a broad southern area.",
    distanceContext: "Beaconsfield High's position as the only girls' grammar in much of South Bucks means it draws applications from a particularly wide area. Distance cut-offs vary year to year, and families outside Beaconsfield itself should check recent admissions data rather than assuming proximity. The school's Wattleton Road address is the measurement point.",
    uniqueFeatures: "Beaconsfield High is the only selective girls' grammar school in the southern part of Buckinghamshire, making it the natural first-choice for girls' grammar applicants in a large geographic area. It has a strong Sixth Form and a well-developed arts and academic programme.",
    preparationAdvice: "Girls applying to Beaconsfield High from further afield — Marlow, Gerrards Cross, High Wycombe — face more uncertainty from a distance perspective than those in Beaconsfield itself. All applicants should aim to qualify well above 121, as the place allocation ultimately depends on how many qualifying children live closer to the school.",
    faq: [
      {
        question: "Is Beaconsfield High School a grammar school?",
        answer: "Yes. Beaconsfield High School is a fully selective girls' grammar school. Entry requires the 121 qualifying score on the Buckinghamshire Secondary Transfer Test. It is one of the 13 grammar schools in the Buckinghamshire consortium, meaning the same test and score apply to all of them.",
      },
      {
        question: "Is Beaconsfield High School close to Gerrards Cross?",
        answer: "Beaconsfield is approximately 3 miles from Gerrards Cross. The school on Wattleton Road is reachable from Gerrards Cross by car or public transport. Families in Gerrards Cross regularly apply to Beaconsfield High as it is the nearest girls' grammar option.",
      },
      {
        question: "Which grammar schools can girls from Beaconsfield apply to?",
        answer: "Girls from Beaconsfield can apply to any Buckinghamshire grammar school. The most commonly chosen options are Beaconsfield High School (nearest), Dr Challoner's High School in Little Chalfont (Amersham area), and Wycombe High School in High Wycombe. Applications can list up to three school preferences.",
      },
    ],
  },
  {
    slug: "chesham-grammar-school",
    name: "Chesham Grammar School",
    shortName: "Chesham Grammar",
    town: "Chesham",
    gender: "coed",
    website: "https://www.cheshamgrammar.org",
    address: "White Hill, Chesham, HP5 1BA",
    intro: "Chesham Grammar School is a co-educational selective grammar school on White Hill in Chesham. It serves as the local grammar school for families across the Chesham area and the surrounding Chiltern villages, offering a mixed environment in a town that otherwise has only single-sex grammar options nearby.",
    admissionsContext: "Chesham Grammar uses the standard Buckinghamshire oversubscription criteria: looked-after children, siblings, then distance. The co-educational nature means boys and girls compete for places in the same pool, unlike most Buckinghamshire grammar schools where boys' and girls' places are allocated separately.",
    catchmentContext: "The school draws its applicants primarily from Chesham, Amersham, Great Missenden, the Chiltern villages, and some parts of Hertfordshire near Tring and Berkhamsted. For families in Chesham itself, the school is often the first preference, with the Challoner's schools in Amersham as alternatives.",
    distanceContext: "Chesham Grammar's distance dynamics are different to the town-centre schools — its position in the Chilterns means the applicant pool is spread across a wider, more rural area. The school is generally less oversubscribed on distance than the Challoner's schools, but qualifying at 121 remains the firm requirement.",
    uniqueFeatures: "Chesham Grammar is one of the mixed grammar schools in Buckinghamshire — a category that includes Sir William Borlase's in Marlow and Sir Henry Floyd in Aylesbury. Its co-educational environment is a distinguishing factor for families who prefer a non-single-sex setting.",
    preparationAdvice: "For families in Chesham, the grammar school decision often involves weighing Chesham Grammar against the Challoner's schools in Amersham. Children applying to both should prepare for the same Secondary Transfer Test, as all Buckinghamshire grammar schools use identical assessment.",
    faq: [
      {
        question: "Is Chesham Grammar School boys-only, girls-only, or mixed?",
        answer: "Chesham Grammar School is co-educational — it admits both boys and girls. It uses the same 121 qualifying threshold as all Buckinghamshire grammar schools, but boys and girls compete for places in a single mixed pool rather than in separate admission processes.",
      },
      {
        question: "Can my child apply to Chesham Grammar and Dr Challoner's schools?",
        answer: "Yes. The admissions process allows up to three grammar school preferences. Many families in the Chesham and Amersham areas list Chesham Grammar alongside one or both Challoner's schools. All three use the same test and the same qualifying score.",
      },
      {
        question: "Is Chesham Grammar School good for both boys and girls academically?",
        answer: "Yes. Chesham Grammar School operates as a co-educational selective school with strong academic results for both boys and girls. Its performance data is published in the same national performance tables as all secondary schools, and it has a consistent record as a high-performing selective school.",
      },
    ],
  },
  {
    slug: "aylesbury-grammar-school",
    name: "Aylesbury Grammar School",
    shortName: "Aylesbury Grammar",
    town: "Aylesbury",
    gender: "boys",
    website: "https://www.ags.bucks.sch.uk",
    address: "Walton Road, Aylesbury, HP21 7RP",
    intro: "Aylesbury Grammar School is a selective boys' grammar school on Walton Road in Aylesbury. It is one of two grammar schools within Aylesbury town itself (alongside Aylesbury High School for girls) and serves a wide catchment area across Aylesbury Vale.",
    admissionsContext: "Aylesbury Grammar uses the standard Buckinghamshire admissions criteria: qualifying score of 121, then oversubscription criteria of looked-after children, siblings, and distance. As one of the main grammar school options for the large Aylesbury Vale area, the school draws applications from a geographically wide pool.",
    catchmentContext: "The school serves Aylesbury town and a wide rural catchment across Aylesbury Vale, including families from Wendover, Princes Risborough, Winslow, Haddenham, and the surrounding villages. Boys from the northern part of Aylesbury Vale and beyond may also consider The Royal Latin School in Buckingham.",
    distanceContext: "Aylesbury Grammar's position within the town makes it accessible to a large population. The distance dynamics are different from the more tightly clustered Chilterns schools — while the school is oversubscribed, the effective distance cut-off can be more generous for families in the broader Aylesbury Vale area than for the High Wycombe or Amersham schools.",
    uniqueFeatures: "Aylesbury Grammar School is one of two grammar schools directly within Aylesbury town, providing a natural destination for boys from the county town and its catchment. It has a strong tradition and is the primary boys' grammar option for families across a large geographic area.",
    preparationAdvice: "Boys in the Aylesbury area often apply to Aylesbury Grammar School alongside Sir Henry Floyd Grammar School. Both use the same test. Preparation targeting all four GL Assessment domains with particular attention to verbal reasoning and comprehension is advisable.",
    faq: [
      {
        question: "Is Aylesbury Grammar School boys-only?",
        answer: "Yes. Aylesbury Grammar School is a selective boys' grammar school. Girls in Aylesbury who are pursuing grammar school typically apply to Aylesbury High School, which is the corresponding girls' grammar school in the town.",
      },
      {
        question: "What villages and towns does Aylesbury Grammar serve?",
        answer: "The school is in Aylesbury itself and draws applications from across Aylesbury Vale, including Wendover, Haddenham, Princes Risborough, Winslow, and surrounding villages. Boys from more distant parts of the Vale may also consider The Royal Latin School in Buckingham depending on their location.",
      },
      {
        question: "How far is Aylesbury Grammar from Sir Henry Floyd Grammar School?",
        answer: "Both schools are within Aylesbury town — Aylesbury Grammar on Walton Road and Sir Henry Floyd on Bierton Road. They serve different genders: Aylesbury Grammar is boys-only while Sir Henry Floyd is co-educational. Many Aylesbury families apply to both, depending on the child's gender and preference.",
      },
    ],
  },
  {
    slug: "aylesbury-high-school",
    name: "Aylesbury High School",
    shortName: "Aylesbury High",
    town: "Aylesbury",
    gender: "girls",
    website: "https://www.aylesburyhigh.org",
    address: "Walton Road, Aylesbury, HP21 7RP",
    intro: "Aylesbury High School is a selective girls' grammar school located on Walton Road in Aylesbury, adjacent to Aylesbury Grammar School. It is the primary girls' grammar school for families across the Aylesbury Vale area and shares a site with the boys' grammar school.",
    admissionsContext: "Aylesbury High uses the standard Buckinghamshire admissions criteria: qualifying at 121 is required, then oversubscription criteria apply in the order of looked-after children, siblings, and distance. The school is consistently popular and oversubscribed.",
    catchmentContext: "Located in Aylesbury town on Walton Road (adjacent to Aylesbury Grammar School), the school draws applications from Aylesbury and across a wide area of Aylesbury Vale including Wendover, Haddenham, Princes Risborough, and surrounding villages.",
    distanceContext: "Aylesbury High is the main girls' grammar option for a large geographic area. Distance allocation dynamics tend to favour families within Aylesbury town and immediate surrounding areas. Girls from more rural parts of Aylesbury Vale should check recent admissions data to understand their position.",
    uniqueFeatures: "Aylesbury High shares a campus with Aylesbury Grammar School for boys, providing a unique co-adjacent grammar school arrangement in the town. Despite the shared site, the schools operate independently with separate admissions, management, and facilities.",
    preparationAdvice: "Girls applying to Aylesbury High often also consider Sir Henry Floyd Grammar School (co-ed) in the town. Preparation targeting all four GL Assessment domains is equally relevant for both schools, as both use the same Secondary Transfer Test.",
    faq: [
      {
        question: "Is Aylesbury High School only for girls?",
        answer: "Yes. Aylesbury High School is a selective girls' grammar school. It is the girls' counterpart to Aylesbury Grammar School, and both schools are located on Walton Road in Aylesbury — adjacent to each other but operating independently.",
      },
      {
        question: "Can girls in Aylesbury apply to both Aylesbury High and Sir Henry Floyd?",
        answer: "Yes. Girls can apply to any Bucks grammar school and can list up to three preferences. Many Aylesbury families list both Aylesbury High School and Sir Henry Floyd Grammar School, as both are within the town and serve girls (Sir Henry Floyd is co-educational).",
      },
      {
        question: "What is the admissions timeline for Aylesbury High School?",
        answer: "Aylesbury High School follows the standard Buckinghamshire admissions timeline: registration opens in the spring term of Year 5, the Secondary Transfer Test is sat in September of Year 6, results are released in October, and school place offers come through the national offer day in March. The school does not operate a separate or earlier timeline.",
      },
    ],
  },
  {
    slug: "sir-henry-floyd-grammar-school",
    name: "Sir Henry Floyd Grammar School",
    shortName: "Sir Henry Floyd",
    town: "Aylesbury",
    gender: "coed",
    website: "https://www.shfgs.org",
    address: "Bierton Road, Aylesbury, HP20 1EG",
    intro: "Sir Henry Floyd Grammar School is a co-educational selective grammar school on Bierton Road in Aylesbury. It is one of three grammar schools within Aylesbury town, offering a mixed environment alongside the single-sex Aylesbury Grammar and Aylesbury High School.",
    admissionsContext: "Sir Henry Floyd uses the standard Buckinghamshire admissions criteria. As a co-educational school, boys and girls compete for places in a single pool rather than separately. The qualifying threshold of 121 is required, with oversubscription resolved by distance after looked-after children and siblings.",
    catchmentContext: "The school is on Bierton Road in northern Aylesbury. Its co-educational nature makes it popular with families across the Vale who prefer a mixed environment. Applications come from Aylesbury town and the broader Vale catchment, including Waddesdon, Wing, and surrounding areas.",
    distanceContext: "Sir Henry Floyd is one of three grammar schools in Aylesbury, meaning the effective applicant pool is spread across multiple schools. This can make distance allocation slightly less acute than at schools where there is only one option for a gender — but the 121 qualifying threshold remains non-negotiable.",
    uniqueFeatures: "Sir Henry Floyd is the only co-educational grammar school in central Aylesbury, making it the natural option for families who prefer a mixed school environment. It occupies a distinct campus on Bierton Road, separate from the Walton Road schools.",
    preparationAdvice: "Children in Aylesbury applying to Sir Henry Floyd may also list Aylesbury Grammar (boys) or Aylesbury High (girls) on their application. Preparation using the same GL Assessment materials applies equally to all three schools.",
    faq: [
      {
        question: "Is Sir Henry Floyd Grammar School boys or girls?",
        answer: "Sir Henry Floyd is co-educational — it admits both boys and girls. It is the mixed grammar school in Aylesbury, in contrast to the boys-only Aylesbury Grammar and girls-only Aylesbury High, which are both on Walton Road. All three use the same 121 qualifying score.",
      },
      {
        question: "Where is Sir Henry Floyd Grammar School?",
        answer: "The school is on Bierton Road in northern Aylesbury, HP20 1EG. It is approximately 1.5 miles from Aylesbury Grammar and Aylesbury High School on Walton Road. Families in the northern parts of Aylesbury may find Sir Henry Floyd particularly well-placed for distance purposes.",
      },
      {
        question: "My child prefers a mixed school — should we prioritise Sir Henry Floyd?",
        answer: "Many families who prefer a co-educational environment do prioritise Sir Henry Floyd for that reason. It is worth listing it highly on the application if the mixed environment is important, while being mindful that distance allocation still applies. The 121 threshold is the same regardless of school preference order.",
      },
    ],
  },
  {
    slug: "burnham-grammar-school",
    name: "Burnham Grammar School",
    shortName: "Burnham Grammar",
    town: "Burnham",
    gender: "coed",
    website: "https://www.burnhamgrammar.org",
    address: "Hogfair Lane, Burnham, SL1 7HG",
    intro: "Burnham Grammar School is a co-educational selective grammar school in Burnham, South Buckinghamshire. It is one of the southernmost Buckinghamshire grammar schools and attracts applications from families in Burnham, Slough, Taplow, and the surrounding area near the Berkshire border.",
    admissionsContext: "Burnham Grammar uses the standard Buckinghamshire admissions criteria: the 121 qualifying score is required, with oversubscription resolved by distance after looked-after children and siblings. Its southern location means applications come from near the county boundary with Berkshire and from areas with relatively fewer nearby grammar school options.",
    catchmentContext: "The school serves Burnham, Taplow, Cippenham, and parts of the Slough area. Families near the Berkshire/Bucks border who wish to access Buckinghamshire selective education often focus on Burnham Grammar as their nearest option. The school also draws from Beaconsfield to the north.",
    distanceContext: "Burnham's position in the south of the county, away from the densely served High Wycombe and Amersham corridors, means its effective distance cut-off for non-sibling places may differ from the higher-profile schools. Families in the immediate Burnham and Slough border area are typically well-placed.",
    uniqueFeatures: "Burnham Grammar is one of the mixed grammar schools in Buckinghamshire. Its location in the south of the county makes it particularly relevant for families in the Slough borders and eastern Berkshire who are eligible for Buckinghamshire state grammar school places.",
    preparationAdvice: "Children applying to Burnham Grammar from areas near the Berkshire border should confirm their eligibility for Buckinghamshire grammar school places. The qualification process is the same as for all 13 Bucks grammar schools, and preparation using GL Assessment materials applies equally.",
    faq: [
      {
        question: "Can children from the Slough area apply to Burnham Grammar School?",
        answer: "Children from Slough are in a separate local authority area. Buckinghamshire grammar schools accept applications from out-of-county children through the opt-in registration process. Families near Slough should register directly with Buckinghamshire Council by the June Year 5 deadline and sit the same Secondary Transfer Test as in-county children.",
      },
      {
        question: "Is Burnham Grammar School co-educational?",
        answer: "Yes. Burnham Grammar School is a co-educational selective grammar school. Boys and girls compete for places in the same admissions pool, using the same 121 qualifying threshold.",
      },
      {
        question: "What other grammar schools are near Burnham?",
        answer: "The nearest Buckinghamshire grammar schools to Burnham are Beaconsfield High School (girls, approximately 6 miles north) and Sir William Borlase's in Marlow (approximately 8 miles northwest). For co-educational options, Burnham Grammar itself is the most accessible for families in that area.",
      },
    ],
  },
  {
    slug: "the-royal-latin-school",
    name: "The Royal Latin School",
    shortName: "Royal Latin",
    town: "Buckingham",
    gender: "coed",
    website: "https://www.royallatin.org",
    address: "Chandos Road, Buckingham, MK18 1AX",
    intro: "The Royal Latin School is a co-educational selective grammar school in Buckingham, in the north of Buckinghamshire. It is the most northerly of the county's 13 grammar schools and serves a large rural catchment area across northern Aylesbury Vale and the areas bordering Northamptonshire and Oxfordshire.",
    admissionsContext: "The Royal Latin School uses the standard Buckinghamshire admissions criteria: the 121 qualifying threshold, then oversubscription resolved by looked-after children, siblings, and distance. Its northern location and large catchment area create distinct admissions dynamics compared to the more densely served south of the county.",
    catchmentContext: "The school serves Buckingham town and a wide rural area including Winslow, Brackley, Towcester (Northants), Bicester (Oxon), and smaller villages across northern Bucks. Families from quite different directions all feed into this school, making it one of the most geographically diverse grammar school catchments in the county.",
    distanceContext: "Given the rural and dispersed nature of northern Buckinghamshire, the Royal Latin School's effective distance allocation tends to be broader than the town-centre schools in High Wycombe or Amersham. Families from across the northern Vale area can realistically target this school, provided they achieve the 121 qualifying score.",
    uniqueFeatures: "The Royal Latin School is a co-educational grammar school with a distinctive historic identity — it is one of the oldest schools in Buckinghamshire. Its northern Bucks location makes it the only selective option for many families across a large rural area, and it has a strong tradition of academic achievement.",
    preparationAdvice: "Families in northern Buckinghamshire often have fewer nearby grammar school options than those in the south of the county. For many, the Royal Latin School is the primary grammar option. Preparation using GL Assessment materials and targeted diagnostic assessment applies equally here as at any other Buckinghamshire grammar school.",
    faq: [
      {
        question: "Is The Royal Latin School in Buckinghamshire?",
        answer: "Yes. The Royal Latin School is in Buckingham town, MK18 1AX — in the north of Buckinghamshire. Despite the MK postcode (which is associated with Milton Keynes), Buckingham is a separate town within Buckinghamshire. The school is one of the 13 grammar schools in the Buckinghamshire Secondary Transfer Consortium.",
      },
      {
        question: "Can families from Northamptonshire apply to The Royal Latin School?",
        answer: "Families living outside Buckinghamshire can apply through the out-of-county opt-in process, registering directly with Buckinghamshire Council by the June Year 5 deadline. The school is popular with families in nearby Northamptonshire towns like Towcester and Brackley, who are within a reasonable distance.",
      },
      {
        question: "Is The Royal Latin School suitable for families in Aylesbury?",
        answer: "Aylesbury families are approximately 15–16 miles from Buckingham. Many Aylesbury families focus on the three grammar schools within Aylesbury town, but those in the northern parts of the Vale, or families seeking a co-educational environment, do consider the Royal Latin School as an option.",
      },
    ],
  },
];

export function getSchoolBySlug(slug: string): GrammarSchoolData | undefined {
  return grammarSchools.find(s => s.slug === slug);
}

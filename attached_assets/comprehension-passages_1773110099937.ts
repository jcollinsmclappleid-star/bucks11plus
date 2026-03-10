/**
 * PASSAGE CORPUS
 * ==============
 * 15 fully authored passages for comprehension question generation.
 *
 * Each passage:
 *  - 100–150 words
 *  - British English spelling throughout
 *  - Y6 reading age (Flesch-Kincaid Grade 6–7)
 *  - No brand names, no living named individuals
 *  - pre-1930 public domain inspiration noted in source field where applicable
 *  - Unique passageId used to group all questions from the same passage
 *
 * Themes covered: sea/lighthouse, rainforest, Roman Britain, Victorian invention,
 * weather, Chilterns, astronomy, river ecosystem, Saxon village, food science,
 * mountain geography, fiction-diary, fiction-letter, news-report, instructional.
 */

export interface Passage {
  id: string;
  title: string;
  text: string;                    // 100–150 words
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  source: string;
  keyWords: KeyWord[];             // words to target for vocab_in_context questions
  inferenceClues: InferenceClue[]; // implicit information for inference questions
  facts: FactItem[];               // explicit facts for fact_retrieval questions
  structure: string;               // one-line description of how the text is organised
  authorPurpose: string;           // for authorial_intent questions
}

export interface KeyWord {
  word: string;
  startIndex: number;              // character index in text
  definition: string;              // correct meaning in this context
  distractors: string[];           // 3 plausible wrong meanings
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InferenceClue {
  question: string;
  correctAnswer: string;
  evidence: string;                // the line that supports inference
  distractors: string[];
}

export interface FactItem {
  question: string;
  correctAnswer: string;
  distractors: string[];
}

// ─── PASSAGE CORPUS ─────────────────────────────────────────────────────────

export const PASSAGES: Passage[] = [

  // ── PASSAGE 1: LIGHTHOUSE / SEA ─────────────────────────────────────────
  {
    id: 'p-lighthouse-01',
    title: 'The Old Lighthouse',
    difficulty: 'medium',
    theme: 'sea / history',
    source: 'Original content',
    text: `On the westernmost tip of the headland, where the cliffs crumbled into the restless grey sea, stood a lighthouse that had not been lit for thirty years. Its white paint had peeled away in long strips, revealing the pale stone beneath, and its lantern room — once home to a brilliant Fresnel lens that could be seen fourteen miles out to sea — now housed nothing but rust and the occasional nesting gull.

Local children called it the Bone Tower, a name whose origins nobody could quite remember, though old Thomas from the harbour said it was because the lighthouse had once saved so many sailors from a bony grave. He had worked there as a boy, hauling oil cans up the spiral stairs each evening, and he still spoke of the beam as though it were a living thing.`,
    keyWords: [
      {
        word: 'Fresnel',
        startIndex: 192,
        definition: 'A type of lens made of concentric rings, designed to concentrate light over long distances',
        distractors: [
          'A French word meaning beautiful or refined',
          'A surname meaning the inventor worked in France',
          'A lens made from a single piece of curved glass',
        ],
        difficulty: 'hard',
      },
      {
        word: 'restless',
        startIndex: 72,
        definition: 'Never still; constantly moving and unsettled',
        distractors: [
          'Tired and in need of rest',
          'Dangerous and likely to cause harm',
          'Deep and difficult to cross',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the author suggest about Thomas\'s feelings towards the old lighthouse?',
        correctAnswer: 'He feels a deep, fond attachment to it and the work he did there as a boy.',
        evidence: 'he still spoke of the beam as though it were a living thing',
        distractors: [
          'He is frightened of the lighthouse and avoids going near it.',
          'He believes the lighthouse should be demolished as it is unsafe.',
          'He is angry that the lighthouse was allowed to fall into disrepair.',
        ],
      },
      {
        question: 'What can we infer about the lighthouse\'s current state?',
        correctAnswer: 'It has been abandoned and left to decay for a long time.',
        evidence: 'not been lit for thirty years... paint had peeled away... nothing but rust',
        distractors: [
          'It is being repaired and will soon be lit again.',
          'It is still used occasionally by sailors during storms.',
          'It has been converted into a home for local residents.',
        ],
      },
    ],
    facts: [
      {
        question: 'How many years had the lighthouse been unlit when the passage was written?',
        correctAnswer: 'Thirty years',
        distractors: ['Ten years', 'Twenty years', 'Forty years'],
      },
      {
        question: 'How far out to sea could the lighthouse beam once be seen?',
        correctAnswer: 'Fourteen miles',
        distractors: ['Ten miles', 'Twenty miles', 'Forty miles'],
      },
      {
        question: 'What did Thomas do as a boy at the lighthouse?',
        correctAnswer: 'He hauled oil cans up the spiral stairs each evening.',
        distractors: [
          'He cleaned the Fresnel lens every morning.',
          'He painted the lighthouse walls with white paint.',
          'He watched for ships from the lantern room at night.',
        ],
      },
    ],
    structure: 'Description of a place, followed by local legend and a personal memory',
    authorPurpose: 'To evoke a sense of loss and faded grandeur, and to show how places hold living memory',
  },

  // ── PASSAGE 2: RAINFOREST ────────────────────────────────────────────────
  {
    id: 'p-rainforest-02',
    title: 'The Forest Floor',
    difficulty: 'medium',
    theme: 'nature / science',
    source: 'Original content',
    text: `Less than two percent of sunlight reaches the floor of a tropical rainforest. The canopy overhead — a dense, interlocking ceiling of leaves and branches — intercepts almost everything, leaving the world below in a permanent green twilight. Yet far from being lifeless, the forest floor is one of the most densely populated environments on Earth.

Fallen leaves, dead wood, and decaying fruit are broken down by fungi, bacteria, and thousands of species of invertebrate. This process of decomposition releases nutrients back into the soil with extraordinary speed: in a temperate woodland, a dead leaf might take two years to fully decay; on the rainforest floor, the same leaf can vanish within six weeks. Nothing is wasted. Every fallen thing becomes food for something else, cycling energy upward through the layers of the forest without pause.`,
    keyWords: [
      {
        word: 'intercepts',
        startIndex: 95,
        definition: 'Blocks or catches something before it can pass through',
        distractors: [
          'Allows to pass freely without restriction',
          'Reflects back upward toward the sky',
          'Absorbs and stores for later use',
        ],
        difficulty: 'medium',
      },
      {
        word: 'decomposition',
        startIndex: 330,
        definition: 'The process by which dead material is broken down into simpler substances',
        distractors: [
          'The growth of new plants from old seeds',
          'The movement of nutrients through the food chain',
          'The competition between species for limited resources',
        ],
        difficulty: 'medium',
      },
      {
        word: 'temperate',
        startIndex: 395,
        definition: 'Describing a mild climate, neither very hot nor very cold',
        distractors: [
          'Very hot and humid throughout the year',
          'Frozen and covered in snow for most of the year',
          'Close to the equator and full of dense vegetation',
        ],
        difficulty: 'hard',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the author imply by writing "Nothing is wasted"?',
        correctAnswer: 'Every dead organism is recycled and used as energy by other living things.',
        evidence: 'Every fallen thing becomes food for something else, cycling energy upward',
        distractors: [
          'The rainforest produces so much food that nothing ever runs out.',
          'Animals in the rainforest are careful not to drop their food.',
          'The forest floor is so dark that nothing can be seen clearly.',
        ],
      },
    ],
    facts: [
      {
        question: 'What percentage of sunlight reaches the rainforest floor?',
        correctAnswer: 'Less than two percent',
        distractors: ['About ten percent', 'Around fifty percent', 'Less than twenty percent'],
      },
      {
        question: 'How quickly can a dead leaf decay on the rainforest floor?',
        correctAnswer: 'Within six weeks',
        distractors: ['Within six months', 'Within one year', 'Within two years'],
      },
      {
        question: 'How long might a dead leaf take to decay in a temperate woodland?',
        correctAnswer: 'Two years',
        distractors: ['Six weeks', 'Six months', 'Ten years'],
      },
    ],
    structure: 'Scientific fact followed by explanation, then comparison to reinforce the point',
    authorPurpose: 'To show that environments which appear dark and lifeless are in fact extraordinarily active and productive',
  },

  // ── PASSAGE 3: ROMAN BRITAIN ─────────────────────────────────────────────
  {
    id: 'p-roman-britain-03',
    title: 'Hadrian\'s Wall',
    difficulty: 'medium',
    theme: 'history',
    source: 'Original content',
    text: `When the Roman Emperor Hadrian visited Britain in AD 122, he ordered the construction of a wall stretching from coast to coast across the north of England. It took approximately six years to build, employing thousands of soldiers from three Roman legions, and when complete it ran for seventy-three miles from Wallsend in the east to Bowness-on-Solway in the west.

The wall was not merely a barrier. At intervals of one Roman mile, small fortlets called milecastles provided shelter and a controlled crossing point. Between them, observation towers called turrets allowed soldiers to monitor the land to the north. Seventeen larger forts were also built along the wall's length, housing garrisons of auxiliary troops whose job was both to defend the wall and to regulate the movement of people and trade through its gates.`,
    keyWords: [
      {
        word: 'garrisons',
        startIndex: 552,
        definition: 'Groups of soldiers stationed in a particular place to defend it',
        distractors: [
          'Civilian workers employed to maintain the wall',
          'Prisoners captured from northern tribes',
          'Senior Roman officers who commanded the wall',
        ],
        difficulty: 'hard',
      },
      {
        word: 'auxiliary',
        startIndex: 539,
        definition: 'Referring to troops who supported the main Roman army, often recruited from conquered territories',
        distractors: [
          'Senior commanders with special responsibilities',
          'Engineers responsible for building and repair',
          'Soldiers serving only during times of emergency',
        ],
        difficulty: 'hard',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the detail about controlled crossing points suggest about the purpose of the wall?',
        correctAnswer: 'The wall was designed to manage who could pass through, not simply to stop all movement.',
        evidence: 'controlled crossing point... regulate the movement of people and trade through its gates',
        distractors: [
          'The wall was built to allow Roman soldiers to travel north quickly.',
          'The wall was only used during times of war and otherwise left empty.',
          'The crossing points were built to allow friendly tribes to pay tribute.',
        ],
      },
    ],
    facts: [
      {
        question: 'In which year did Emperor Hadrian visit Britain?',
        correctAnswer: 'AD 122',
        distractors: ['AD 43', 'AD 100', 'AD 200'],
      },
      {
        question: 'How long did Hadrian\'s Wall run from east to west?',
        correctAnswer: 'Seventy-three miles',
        distractors: ['Fifty miles', 'One hundred miles', 'Twenty-five miles'],
      },
      {
        question: 'What were the small fortlets built every Roman mile called?',
        correctAnswer: 'Milecastles',
        distractors: ['Turrets', 'Garrisons', 'Legions'],
      },
      {
        question: 'How many larger forts were built along the wall?',
        correctAnswer: 'Seventeen',
        distractors: ['Six', 'Twenty-five', 'Three'],
      },
    ],
    structure: 'Historical introduction, then detailed description of the wall\'s components and their functions',
    authorPurpose: 'To inform the reader about the scale and complexity of Hadrian\'s Wall as both a military and administrative structure',
  },

  // ── PASSAGE 4: VICTORIAN INVENTION ──────────────────────────────────────
  {
    id: 'p-victorian-invention-04',
    title: 'The Penny Post',
    difficulty: 'easy',
    theme: 'Victorian history',
    source: 'Original content',
    text: `Before 1840, sending a letter in Britain was an expensive business. The cost was calculated by the number of sheets of paper and the distance the letter had to travel, meaning that a simple note sent from London to Edinburgh could cost the equivalent of a day's wages for an ordinary worker. Worse still, it was the recipient — not the sender — who had to pay on delivery.

Rowland Hill, a schoolteacher and reformer, proposed a radical change: a standard charge of one penny for any letter weighing less than half an ounce, regardless of distance. The letter would be pre-paid by the sender, using a small gummed label that would become the world's first postage stamp — the Penny Black. The reform was introduced in January 1840, and within a year the number of letters sent in Britain had nearly doubled.`,
    keyWords: [
      {
        word: 'recipient',
        startIndex: 250,
        definition: 'The person who receives something',
        distractors: [
          'The person who sends a letter or parcel',
          'The government official who collects payment',
          'The postman who delivers the letter',
        ],
        difficulty: 'easy',
      },
      {
        word: 'reformer',
        startIndex: 330,
        definition: 'A person who campaigns for improvements and changes to existing systems',
        distractors: [
          'A person who breaks the law and is punished for it',
          'A teacher who specialises in training other teachers',
          'A politician who works for the government',
        ],
        difficulty: 'medium',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the near-doubling of letters sent suggest about Hill\'s reform?',
        correctAnswer: 'Many people had previously been unable or unwilling to send letters because of the cost, so the lower price unlocked demand.',
        evidence: 'within a year the number of letters sent in Britain had nearly doubled',
        distractors: [
          'People had previously been unable to write and were now being taught.',
          'The postal service had hired many more workers to deliver letters.',
          'Hill had made letter-writing fashionable among the upper classes.',
        ],
      },
    ],
    facts: [
      {
        question: 'What was the standard charge for sending a letter under Rowland Hill\'s new system?',
        correctAnswer: 'One penny',
        distractors: ['Two pence', 'One shilling', 'Half a penny'],
      },
      {
        question: 'What was the world\'s first postage stamp called?',
        correctAnswer: 'The Penny Black',
        distractors: ['The Royal Seal', 'The Penny Post', 'The Victoria Stamp'],
      },
      {
        question: 'When was the Penny Post reform introduced?',
        correctAnswer: 'January 1840',
        distractors: ['January 1820', 'January 1860', 'January 1900'],
      },
    ],
    structure: 'Problem introduced, then solution described, then evidence of its success',
    authorPurpose: 'To show how a simple, fair reform can have a dramatic effect on society by making communication accessible to everyone',
  },

  // ── PASSAGE 5: WEATHER / METEOROLOGY ────────────────────────────────────
  {
    id: 'p-weather-05',
    title: 'Reading the Sky',
    difficulty: 'easy',
    theme: 'science / weather',
    source: 'Original content',
    text: `Long before weather forecasting technology existed, sailors and farmers learned to read the sky for signs of approaching weather. Many of their observations were remarkably accurate and have since been confirmed by modern meteorology.

The saying "red sky at night, shepherd's delight; red sky in the morning, shepherd's warning" is a good example. In Britain, weather systems generally move from west to east. A red evening sky means that dust particles are being illuminated by the setting sun in the western air — indicating that the air to the west is clear and dry, and therefore that fair weather is on its way. A red morning sky means the same dust is now to the east, suggesting that the dry air has already passed and that cloud and rain may be approaching from the west.

Not all folk sayings are reliable, but this one is supported by science.`,
    keyWords: [
      {
        word: 'meteorology',
        startIndex: 158,
        definition: 'The scientific study of the atmosphere and weather',
        distractors: [
          'The study of rocks and the formation of the Earth\'s crust',
          'The study of ancient weather records and climate history',
          'The practice of forecasting weather using traditional sayings',
        ],
        difficulty: 'medium',
      },
      {
        word: 'illuminated',
        startIndex: 400,
        definition: 'Lit up; made bright by a source of light',
        distractors: [
          'Blocked from view by clouds or darkness',
          'Absorbed and converted into heat energy',
          'Reflected back upward into the atmosphere',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the author mean by saying "Not all folk sayings are reliable, but this one is supported by science"?',
        correctAnswer: 'The author is acknowledging that traditional weather sayings vary in accuracy, but this particular one has a genuine scientific basis.',
        evidence: 'Not all folk sayings are reliable, but this one is supported by science',
        distractors: [
          'The author believes that science is always superior to traditional knowledge.',
          'The author is suggesting that sailors and farmers were generally wrong about the weather.',
          'The author wants readers to ignore all folk sayings except this one.',
        ],
      },
    ],
    facts: [
      {
        question: 'In which direction do weather systems generally move across Britain?',
        correctAnswer: 'From west to east',
        distractors: ['From east to west', 'From north to south', 'From south to north'],
      },
      {
        question: 'What does a red evening sky indicate about the weather to the west?',
        correctAnswer: 'The air to the west is clear and dry, suggesting fair weather is approaching.',
        distractors: [
          'A storm is approaching from the west within a few hours.',
          'The air to the west is full of moisture and cloud.',
          'The sun is setting and it will be dark soon.',
        ],
      },
    ],
    structure: 'General claim, then specific example, then scientific explanation of that example, then conclusion',
    authorPurpose: 'To show that traditional observation and modern science can reach the same conclusions, and to explain the science behind a familiar saying',
  },

  // ── PASSAGE 6: CHILTERNS / LOCAL BUCKS ──────────────────────────────────
  {
    id: 'p-chilterns-06',
    title: 'The Chiltern Hills',
    difficulty: 'easy',
    theme: 'local geography / nature',
    source: 'Original content',
    text: `Running in a broad arc from Oxfordshire to Hertfordshire, the Chiltern Hills form one of England's most distinctive landscapes. The hills are made from chalk — a soft white limestone formed from the compressed remains of millions of tiny sea creatures that lived here over seventy million years ago, when this part of England lay beneath a warm, shallow sea.

Today, the Chilterns are home to ancient beech woodland, wildflower meadows, and the red kite — a large, fork-tailed bird of prey that was successfully reintroduced to the area in 1990 after being absent from England for over a century. The chalk soil also supports a rich variety of wildflowers found almost nowhere else in Britain, including several species of orchid that bloom each summer on the open grassland.

The area was designated an Area of Outstanding Natural Beauty in 1965.`,
    keyWords: [
      {
        word: 'designated',
        startIndex: 620,
        definition: 'Officially given a particular status or title',
        distractors: [
          'Purchased by the government to prevent development',
          'Visited by large numbers of tourists each year',
          'Protected by a special fence or boundary marker',
        ],
        difficulty: 'medium',
      },
      {
        word: 'compressed',
        startIndex: 180,
        definition: 'Squeezed together under great pressure into a more compact form',
        distractors: [
          'Dissolved slowly in water over a very long time',
          'Heated to very high temperatures and melted',
          'Carried by rivers and deposited on the sea floor',
        ],
        difficulty: 'medium',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the reintroduction of the red kite suggest about what had happened to it previously?',
        correctAnswer: 'The red kite had been driven to extinction in England, most likely through human activity.',
        evidence: 'reintroduced to the area in 1990 after being absent from England for over a century',
        distractors: [
          'The red kite had always lived in the Chilterns but was rarely seen.',
          'The red kite had migrated to warmer countries and was brought back.',
          'The red kite had been kept in zoos and was released into the wild.',
        ],
      },
    ],
    facts: [
      {
        question: 'What type of rock are the Chiltern Hills made from?',
        correctAnswer: 'Chalk',
        distractors: ['Granite', 'Sandstone', 'Flint'],
      },
      {
        question: 'When was the red kite reintroduced to the Chilterns?',
        correctAnswer: '1990',
        distractors: ['1965', '1950', '2005'],
      },
      {
        question: 'When was the Chilterns designated an Area of Outstanding Natural Beauty?',
        correctAnswer: '1965',
        distractors: ['1990', '1945', '2000'],
      },
    ],
    structure: 'Geographical introduction, geological explanation, description of wildlife, then official status',
    authorPurpose: 'To inform the reader about the natural and geological significance of the Chiltern Hills',
  },

  // ── PASSAGE 7: SPACE / ASTRONOMY ─────────────────────────────────────────
  {
    id: 'p-astronomy-07',
    title: 'The Light from Dead Stars',
    difficulty: 'hard',
    theme: 'science / astronomy',
    source: 'Original content',
    text: `When you look up at the night sky, you are looking into the past. Light travels at approximately three hundred thousand kilometres per second, which is extraordinarily fast — but space is extraordinarily large. The light from our nearest stellar neighbour, Proxima Centauri, takes over four years to reach us. This means that when we observe it, we are seeing the star as it appeared four years ago, not as it is now.

For more distant objects, the time delay is far greater. The Andromeda Galaxy, the nearest major galaxy to our own, is approximately 2.5 million light-years away. The light we see when we look at Andromeda left it 2.5 million years ago — long before modern humans existed. It is entirely possible that some of the stars we see tonight have already died; we simply haven't received the news yet.`,
    keyWords: [
      {
        word: 'stellar',
        startIndex: 285,
        definition: 'Relating to stars',
        distractors: [
          'Relating to the orbit of planets',
          'Relating to the speed of light',
          'Relating to galaxies and large structures in space',
        ],
        difficulty: 'medium',
      },
      {
        word: 'approximately',
        startIndex: 98,
        definition: 'Roughly; not exactly but close to the true figure',
        distractors: [
          'Precisely; with complete accuracy',
          'Slowly; taking a very long time to reach the figure',
          'Surprisingly; more than expected',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the author mean by "we simply haven\'t received the news yet"?',
        correctAnswer: 'Light from a dying star hasn\'t reached Earth yet, so we don\'t know it has died — we\'re still seeing old light.',
        evidence: 'some of the stars we see tonight have already died; we simply haven\'t received the news yet',
        distractors: [
          'Scientists have not yet published their research about dying stars.',
          'Astronomers are keeping information about dead stars secret from the public.',
          'Telescopes are not powerful enough to detect dying stars at great distances.',
        ],
      },
      {
        question: 'What does the passage suggest about the nature of astronomical observation?',
        correctAnswer: 'Observing space is essentially time travel — we always see the past, never the present.',
        evidence: 'you are looking into the past... seeing the star as it appeared four years ago, not as it is now',
        distractors: [
          'Astronomical observation is impossible without very powerful equipment.',
          'Galaxies are too far away to study with any useful accuracy.',
          'Space is getting larger, which makes observation increasingly difficult.',
        ],
      },
    ],
    facts: [
      {
        question: 'How long does light from Proxima Centauri take to reach Earth?',
        correctAnswer: 'Over four years',
        distractors: ['One year', 'One hundred years', 'Four seconds'],
      },
      {
        question: 'How far away is the Andromeda Galaxy?',
        correctAnswer: 'Approximately 2.5 million light-years',
        distractors: ['Four light-years', '250 light-years', '25 billion light-years'],
      },
    ],
    structure: 'Surprising opening claim, then scientific explanation, then extended example, then philosophical conclusion',
    authorPurpose: 'To make the concept of light-travel time accessible and emotionally resonant by connecting it to the idea of looking at the past',
  },

  // ── PASSAGE 8: RIVER ECOSYSTEM ───────────────────────────────────────────
  {
    id: 'p-river-08',
    title: 'Life in a Chalk Stream',
    difficulty: 'medium',
    theme: 'nature / river ecology',
    source: 'Original content',
    text: `Chalk streams are among the rarest freshwater habitats in the world. Fed by water that has filtered slowly through layers of chalk bedrock, they flow at a remarkably constant temperature throughout the year — never freezing in winter, never becoming uncomfortably warm in summer. This stability makes them ideal for species that cannot tolerate sudden changes in temperature.

The water boatman, the mayfly, and the brown trout are all characteristic inhabitants of the chalk stream. The brown trout in particular is exacting in its requirements: it needs cold, well-oxygenated water, a gravel riverbed for spawning, and an abundance of insect life as food. Chalk streams provide all of these. Britain is home to approximately 85 percent of the world's chalk streams, the majority of them found in southern England — including several that flow through the Chiltern Hills and the counties to the south of Buckinghamshire.`,
    keyWords: [
      {
        word: 'exacting',
        startIndex: 378,
        definition: 'Demanding; requiring very specific conditions to be met',
        distractors: [
          'Rare; found only in a small number of locations',
          'Adaptable; able to survive in a wide range of conditions',
          'Large; significantly bigger than other fish of the same type',
        ],
        difficulty: 'hard',
      },
      {
        word: 'spawning',
        startIndex: 452,
        definition: 'Laying eggs in order to reproduce',
        distractors: [
          'Feeding on insects near the surface of the water',
          'Swimming upstream against the current',
          'Hiding under rocks during cold weather',
        ],
        difficulty: 'medium',
      },
    ],
    inferenceClues: [
      {
        question: 'Why does the passage describe chalk streams as particularly valuable habitats?',
        correctAnswer: 'Because they are extremely rare worldwide and support species that depend on very specific, stable conditions.',
        evidence: 'among the rarest freshwater habitats in the world... species that cannot tolerate sudden changes',
        distractors: [
          'Because they are used by humans for drinking water and irrigation.',
          'Because they contain more species of fish than any other British habitat.',
          'Because they were historically used for power generation by water mills.',
        ],
      },
    ],
    facts: [
      {
        question: 'What percentage of the world\'s chalk streams are found in Britain?',
        correctAnswer: 'Approximately 85 percent',
        distractors: ['About 50 percent', 'Over 95 percent', 'Around 20 percent'],
      },
      {
        question: 'What three things does a brown trout need according to the passage?',
        correctAnswer: 'Cold, well-oxygenated water; a gravel riverbed; and an abundance of insect life',
        distractors: [
          'Warm water, a sandy riverbed, and large prey fish',
          'Fast-flowing water, dense weed growth, and still pools',
          'Deep water, no other predators, and a muddy riverbed',
        ],
      },
    ],
    structure: 'Definition and key features, then specific species examples, then a geographical fact connecting to local relevance',
    authorPurpose: 'To explain what makes chalk streams unusual and valuable, and to make the information relevant to a local audience',
  },

  // ── PASSAGE 9: SAXON VILLAGE ────────────────────────────────────────────
  {
    id: 'p-saxon-09',
    title: 'An Anglo-Saxon Village',
    difficulty: 'easy',
    theme: 'history',
    source: 'Original content',
    text: `Anglo-Saxon villages were small, self-sufficient communities, typically home to between fifty and two hundred people. Most villagers were farmers who worked strips of land in large open fields surrounding the settlement. The fields were divided between families, but much of the work — ploughing, harvesting, and tending livestock — was done communally, with neighbours helping one another through the seasons.

At the centre of the village stood the great hall, a large timber building where the local lord would feast with his warriors and where important decisions were made. Nearby, a smaller building served as the church, though in early Saxon times many villages had only a simple wooden cross to mark the site of worship. Craft workers — blacksmiths, potters, and weavers — lived and worked on the edges of the settlement, their workshops close to the materials they needed.`,
    keyWords: [
      {
        word: 'self-sufficient',
        startIndex: 31,
        definition: 'Able to provide everything needed without relying on outside help or trade',
        distractors: [
          'Ruled by a powerful lord who made all decisions',
          'Wealthy enough to trade goods with distant places',
          'Protected by strong walls from attack by enemies',
        ],
        difficulty: 'medium',
      },
      {
        word: 'communally',
        startIndex: 215,
        definition: 'Done together by a group, sharing the effort and the benefit',
        distractors: [
          'Paid for by the lord of the village',
          'Completed only by women while men were away fighting',
          'Carried out in secret to avoid paying taxes',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the position of the great hall at the centre of the village tell us about Saxon society?',
        correctAnswer: 'The lord and his warriors held the most important position in society, and the hall was the centre of power and communal life.',
        evidence: 'where the local lord would feast with his warriors and where important decisions were made',
        distractors: [
          'The great hall was used for storing food during winter.',
          'The village had no church and so used the hall for worship.',
          'The great hall was the largest building and needed the most space.',
        ],
      },
    ],
    facts: [
      {
        question: 'How many people typically lived in an Anglo-Saxon village?',
        correctAnswer: 'Between fifty and two hundred',
        distractors: ['Between five and fifty', 'Between two hundred and one thousand', 'Fewer than twenty'],
      },
      {
        question: 'What stood at the centre of the Anglo-Saxon village?',
        correctAnswer: 'The great hall',
        distractors: ['The church', 'The blacksmith\'s workshop', 'The market square'],
      },
    ],
    structure: 'Overview of village life, then specific buildings and their functions, then craft workers',
    authorPurpose: 'To give a clear picture of everyday life in an Anglo-Saxon village and show how the community was organised',
  },

  // ── PASSAGE 10: FOOD SCIENCE ─────────────────────────────────────────────
  {
    id: 'p-food-science-10',
    title: 'Why Bread Rises',
    difficulty: 'easy',
    theme: 'food science',
    source: 'Original content',
    text: `Bread rises because of a remarkable living organism: yeast. Yeast is a single-celled fungus that feeds on the sugars present in flour. As it consumes these sugars, it produces carbon dioxide gas and a small amount of alcohol — a process called fermentation. The carbon dioxide becomes trapped in the elastic network of gluten formed when flour and water are mixed together, causing the dough to swell and rise.

The alcohol produced during fermentation evaporates during baking, which is why cooked bread does not contain significant amounts of alcohol. The heat of the oven also kills the yeast and sets the gluten network in its risen shape, creating the light, open texture that distinguishes well-made bread from a dense, flat loaf.

Bakers have been using yeast in this way for at least six thousand years.`,
    keyWords: [
      {
        word: 'fermentation',
        startIndex: 210,
        definition: 'The process by which yeast converts sugars into carbon dioxide and alcohol',
        distractors: [
          'The process by which flour and water combine to form gluten',
          'The process by which bread is baked at high temperature',
          'The process by which yeast is cultivated and dried for storage',
        ],
        difficulty: 'medium',
      },
      {
        word: 'elastic',
        startIndex: 240,
        definition: 'Able to stretch and return to its original shape',
        distractors: [
          'Hard and resistant to being squeezed or pressed',
          'Sticky and difficult to handle or shape',
          'Fragile and likely to break if handled roughly',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does the passage imply about baking bread at the correct temperature?',
        correctAnswer: 'The temperature must be high enough to kill the yeast and set the gluten, otherwise the bread would not hold its shape.',
        evidence: 'The heat of the oven also kills the yeast and sets the gluten network in its risen shape',
        distractors: [
          'Bread must be baked quickly or the alcohol will make it taste unpleasant.',
          'Too much heat will cause the yeast to produce more carbon dioxide.',
          'The correct temperature prevents the crust from becoming too thick.',
        ],
      },
    ],
    facts: [
      {
        question: 'What gas does yeast produce when it consumes sugar?',
        correctAnswer: 'Carbon dioxide',
        distractors: ['Oxygen', 'Nitrogen', 'Hydrogen'],
      },
      {
        question: 'What is the protein network that traps the gas in bread dough called?',
        correctAnswer: 'Gluten',
        distractors: ['Yeast', 'Starch', 'Cellulose'],
      },
      {
        question: 'For approximately how long have bakers been using yeast?',
        correctAnswer: 'At least six thousand years',
        distractors: ['About one hundred years', 'About one thousand years', 'About three hundred years'],
      },
    ],
    structure: 'Process explanation, then what happens to the by-products, then historical fact',
    authorPurpose: 'To explain a familiar everyday process scientifically, showing how biology and chemistry combine in bread-making',
  },

  // ── PASSAGE 11: MOUNTAIN GEOGRAPHY ──────────────────────────────────────
  {
    id: 'p-mountain-11',
    title: 'How Mountains are Made',
    difficulty: 'hard',
    theme: 'geography / science',
    source: 'Original content',
    text: `Mountains are not permanent features of the landscape. They are the result of slow, ongoing geological processes that have been shaping the Earth's surface for billions of years. The most dramatic mountain ranges — including the Himalayas and the Alps — were formed by the collision of tectonic plates: enormous slabs of rock that make up the Earth's outer layer and move at roughly the speed at which a human fingernail grows.

When two continental plates collide, neither can sink beneath the other. Instead, the land between them crumples and buckles upward, forming mountain ranges that can reach heights of several kilometres. The Himalayas, which contain the world's highest peak, are still growing today at a rate of approximately five millimetres per year, because the Indian plate continues to push northward into the Eurasian plate.`,
    keyWords: [
      {
        word: 'tectonic',
        startIndex: 260,
        definition: 'Relating to the large-scale structure and movement of the Earth\'s outer layer',
        distractors: [
          'Relating to volcanoes and the eruption of lava and ash',
          'Relating to the erosion of rocks by wind and water',
          'Relating to the study of earthquakes and their effects',
        ],
        difficulty: 'hard',
      },
      {
        word: 'buckles',
        startIndex: 445,
        definition: 'Bends and folds under pressure',
        distractors: [
          'Breaks apart and separates into fragments',
          'Sinks downward into the Earth\'s core',
          'Spreads outward horizontally across the surface',
        ],
        difficulty: 'medium',
      },
    ],
    inferenceClues: [
      {
        question: 'Why does the author compare the speed of tectonic plate movement to a growing fingernail?',
        correctAnswer: 'To help readers understand how extremely slow the movement is — fast enough to be real, but imperceptible in daily life.',
        evidence: 'move at roughly the speed at which a human fingernail grows',
        distractors: [
          'To suggest that human beings are connected to the movement of the Earth.',
          'To show that the movement is regular and can be easily measured.',
          'To imply that tectonic plates are organic and behave like living things.',
        ],
      },
    ],
    facts: [
      {
        question: 'Which two mountain ranges does the passage mention as examples?',
        correctAnswer: 'The Himalayas and the Alps',
        distractors: ['The Andes and the Rockies', 'The Alps and the Andes', 'The Urals and the Himalayas'],
      },
      {
        question: 'At what rate are the Himalayas currently growing?',
        correctAnswer: 'Approximately five millimetres per year',
        distractors: ['Five centimetres per year', 'Five metres per year', 'One millimetre per year'],
      },
    ],
    structure: 'Surprising opening claim, explanation of the process, then specific extended example',
    authorPurpose: 'To challenge the assumption that mountains are fixed and permanent by explaining the dynamic processes that create and continue to shape them',
  },

  // ── PASSAGE 12: FICTION DIARY ────────────────────────────────────────────
  {
    id: 'p-fiction-diary-12',
    title: 'From the Diary of Martha Wells, aged 12',
    difficulty: 'medium',
    theme: 'fiction / diary extract',
    source: 'Original content',
    text: `Tuesday, 14th March

I have decided to keep a record of the expedition, though I suspect Father will say it is not necessary. He does not think that writing things down changes them, but I believe it does — or at least, it changes you.

We set off before dawn. The fog was so thick that I could not see the river from the bridge, which Mother said was a sign we should turn back. Father said it was a sign we should hurry, before the fog lifted and the whole valley could see us. I don't know which one of them was right, but I found myself walking faster all the same.

By the time we reached the edge of the wood, the fog had thinned to a pale gauze and the first birds had begun. I wrote that down too, so I would not forget the sound.`,
    keyWords: [
      {
        word: 'gauze',
        startIndex: 590,
        definition: 'A thin, translucent fabric — here used to describe mist that is still present but much thinner',
        distractors: [
          'A thick, heavy blanket of cloud and rain',
          'A scientific word for fog that forms near rivers',
          'The name for the first light of dawn in winter',
        ],
        difficulty: 'hard',
      },
      {
        word: 'expedition',
        startIndex: 42,
        definition: 'A journey made for a specific purpose',
        distractors: [
          'An argument between two people about what to do',
          'A competition between two groups to reach a goal',
          'A story written about something that has happened',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does Martha mean when she says writing "changes you"?',
        correctAnswer: 'She believes the act of recording events makes you reflect on them, which affects how you think and feel.',
        evidence: 'I believe it does — or at least, it changes you',
        distractors: [
          'She thinks writing in a diary makes events more exciting than they really were.',
          'She believes keeping a diary helps her remember facts she might otherwise forget.',
          'She is worried that Father will read her diary and she wants to write carefully.',
        ],
      },
      {
        question: 'What does "I found myself walking faster all the same" suggest about Martha?',
        correctAnswer: 'Despite not resolving her parents\' disagreement, she was affected by her father\'s urgency and acted on it instinctively.',
        evidence: 'I don\'t know which one of them was right, but I found myself walking faster all the same',
        distractors: [
          'She was frightened of the fog and wanted to reach safety quickly.',
          'She agreed with her father and wanted to support his decision.',
          'She was cold and hoped that walking faster would warm her up.',
        ],
      },
    ],
    facts: [
      {
        question: 'What day of the week and date is this diary entry written on?',
        correctAnswer: 'Tuesday, 14th March',
        distractors: ['Monday, 14th March', 'Tuesday, 4th March', 'Wednesday, 14th March'],
      },
      {
        question: 'What prevented Martha from seeing the river from the bridge?',
        correctAnswer: 'The fog was too thick',
        distractors: ['It was still dark before dawn', 'Trees blocked the view of the river', 'She was walking too quickly to stop and look'],
      },
    ],
    structure: 'Personal reflection, then narrative of the morning, then sensory detail at the journey\'s end',
    authorPurpose: 'To create a sense of a determined, observant character setting out on a mysterious journey, using the diary format to make the experience feel immediate and personal',
  },

  // ── PASSAGE 13: FICTION LETTER ───────────────────────────────────────────
  {
    id: 'p-fiction-letter-13',
    title: 'A Letter from the Sea',
    difficulty: 'medium',
    theme: 'fiction / letter extract',
    source: 'Original content',
    text: `Dear Aunt Clara,

I know you will have been worrying, so I want you to know first of all that I am quite well. The crossing was rough — rougher than the captain had expected, I think, though he didn't say so directly. He simply spent more time than usual on deck, watching the horizon with an expression I couldn't quite read.

We arrived two days late and I have already missed the meeting I was due to attend, which is a frustration. However, the delay was not without its compensations: I have had time to explore the harbour and to begin a small watercolour of the lighthouse, which I hope to finish before I leave.

Please tell Mother not to fret. The food here is excellent, my room looks out over the water, and I have found a bookshop with a decent English section. I could not be better placed.

Your affectionate nephew, Edward`,
    keyWords: [
      {
        word: 'compensations',
        startIndex: 430,
        definition: 'Something good that makes up for something bad or disappointing',
        distractors: [
          'Payments of money to cover costs or damages',
          'Complaints made to the captain about the delay',
          'Extra time added to the journey as a penalty',
        ],
        difficulty: 'hard',
      },
      {
        word: 'affectionate',
        startIndex: 610,
        definition: 'Showing warmth and fondness toward someone',
        distractors: [
          'Formally polite but without genuine feeling',
          'Worried and hoping for a quick reply',
          'Grateful for the money provided for the journey',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'What does Edward\'s description of the captain suggest about the crossing?',
        correctAnswer: 'The captain was concerned but trying not to alarm the passengers by showing his worry openly.',
        evidence: 'He simply spent more time than usual on deck, watching the horizon with an expression I couldn\'t quite read',
        distractors: [
          'The captain was bored and had nothing to do during the calm crossing.',
          'The captain was angry with the passengers for asking too many questions.',
          'The captain was expecting to see another ship and was looking out for it.',
        ],
      },
    ],
    facts: [
      {
        question: 'How many days late did Edward arrive?',
        correctAnswer: 'Two days late',
        distractors: ['One day late', 'Three days late', 'On time'],
      },
      {
        question: 'What artwork has Edward begun during the delay?',
        correctAnswer: 'A watercolour of the lighthouse',
        distractors: ['A sketch of the harbour', 'A painting of the sea', 'A watercolour of the town square'],
      },
    ],
    structure: 'Reassurance, then account of the journey, then positive report of the current situation',
    authorPurpose: 'To show Edward\'s character as observant, adaptable, and reassuring — someone who notices difficulties but chooses to focus on the positive',
  },

  // ── PASSAGE 14: NEWS REPORT ──────────────────────────────────────────────
  {
    id: 'p-news-report-14',
    title: 'Community Garden Opens in Town Centre',
    difficulty: 'easy',
    theme: 'news report / informational',
    source: 'Original content',
    text: `A derelict plot of land in the centre of Marlow has been transformed into a community garden following eighteen months of planning and fundraising by local residents. The garden, which covers approximately half an acre, features raised vegetable beds, a wildflower meadow, and a small orchard of traditional fruit trees.

The project was initiated by the Marlow Green Spaces Group, a volunteer organisation founded in 2019. Chairperson Helen Marsh said the garden was intended to provide "a place where people of all ages can grow food, connect with nature, and get to know their neighbours."

The garden is open to the public every day from dawn to dusk. Residents who wish to take on an individual raised bed can apply through the group's website. Funding for the project came from a combination of local council grants and donations from businesses in the town.`,
    keyWords: [
      {
        word: 'derelict',
        startIndex: 2,
        definition: 'Abandoned and in a very poor or ruined condition',
        distractors: [
          'Busy and frequently used for commercial purposes',
          'Owned by the council and protected from development',
          'Located in a remote area far from the town centre',
        ],
        difficulty: 'medium',
      },
      {
        word: 'initiated',
        startIndex: 360,
        definition: 'Started or set in motion',
        distractors: [
          'Funded entirely by a single organisation',
          'Opposed by some members of the local community',
          'Completed within a very short period of time',
        ],
        difficulty: 'medium',
      },
    ],
    inferenceClues: [
      {
        question: 'What does Helen Marsh\'s description of the garden suggest about its purpose beyond growing food?',
        correctAnswer: 'The garden is also intended to build a sense of community by bringing people together across age groups.',
        evidence: '"a place where people of all ages can grow food, connect with nature, and get to know their neighbours"',
        distractors: [
          'The garden is primarily intended to provide food for people who cannot afford it.',
          'The garden is a commercial venture intended to raise money for local charities.',
          'The garden is specifically aimed at elderly residents who have no outdoor space.',
        ],
      },
    ],
    facts: [
      {
        question: 'How large is the community garden?',
        correctAnswer: 'Approximately half an acre',
        distractors: ['One acre', 'Two hectares', 'A quarter of an acre'],
      },
      {
        question: 'When was the Marlow Green Spaces Group founded?',
        correctAnswer: '2019',
        distractors: ['2015', '2022', '2010'],
      },
      {
        question: 'What are the garden\'s opening hours?',
        correctAnswer: 'Every day from dawn to dusk',
        distractors: ['Monday to Friday only', 'Weekends only', 'Every day from 9am to 5pm'],
      },
    ],
    structure: 'News summary, then background on the project, then a quote, then practical information',
    authorPurpose: 'To inform readers about a community project in a factual, balanced way, presenting key details and a representative quote',
  },

  // ── PASSAGE 15: INSTRUCTIONAL ────────────────────────────────────────────
  {
    id: 'p-instructional-15',
    title: 'How to Press Flowers',
    difficulty: 'easy',
    theme: 'instructional',
    source: 'Original content',
    text: `Pressing flowers is a simple technique for preserving plants so that they can be kept, displayed, or used in artwork. The process works by removing moisture from the plant before it can decay, leaving the colour and structure largely intact.

Choose flowers that are freshly picked and completely dry — any surface moisture will cause mould during pressing. Place them face-down on a sheet of absorbent paper, such as blotting paper or a page from a telephone directory. Cover with a second sheet and then place the paper inside a heavy book. Stack additional books on top to apply even pressure.

After two to four weeks, the flowers will be flat and dry. Remove them carefully using tweezers to avoid tearing the delicate petals. Pressed flowers can be stored between sheets of tissue paper or mounted on card using small dots of clear glue.`,
    keyWords: [
      {
        word: 'absorbent',
        startIndex: 368,
        definition: 'Able to soak up moisture effectively',
        distractors: [
          'Heavy enough to press flowers flat',
          'Smooth enough not to damage delicate petals',
          'Thick enough to prevent flowers from showing through',
        ],
        difficulty: 'easy',
      },
      {
        word: 'intact',
        startIndex: 168,
        definition: 'Undamaged; still in its original condition',
        distractors: [
          'Slightly faded but still recognisable',
          'Completely changed by the pressing process',
          'Preserved in a liquid solution',
        ],
        difficulty: 'easy',
      },
    ],
    inferenceClues: [
      {
        question: 'Why does the author advise using tweezers to remove pressed flowers?',
        correctAnswer: 'Because the dried flowers become fragile and could easily be torn or damaged by fingers.',
        evidence: 'Remove them carefully using tweezers to avoid tearing the delicate petals',
        distractors: [
          'Because tweezers prevent the colours from transferring to your fingers.',
          'Because the paper will stick to the flowers if you touch them directly.',
          'Because tweezers allow you to apply the right amount of pressure to each petal.',
        ],
      },
    ],
    facts: [
      {
        question: 'How long does it take for flowers to be fully pressed?',
        correctAnswer: 'Two to four weeks',
        distractors: ['One week', 'One day', 'Six to eight weeks'],
      },
      {
        question: 'Why must flowers be completely dry before pressing?',
        correctAnswer: 'Any surface moisture will cause mould during pressing.',
        distractors: [
          'Wet flowers will stain the paper and damage the book.',
          'Moisture causes the petals to change colour during pressing.',
          'Wet flowers cannot be placed flat and will crease unevenly.',
        ],
      },
    ],
    structure: 'Purpose explained, then preparation steps, then the process itself, then what to do after',
    authorPurpose: 'To give clear, sequential instructions that enable the reader to press flowers successfully at home',
  },
];

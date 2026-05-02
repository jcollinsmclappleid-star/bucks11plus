export interface QuestionTypeGuide {
  slug: string;
  pathSegment: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  domain: "Verbal Reasoning" | "Non-Verbal Reasoning" | "Maths" | "English Comprehension";
  domainHref: string;
  intro: string;
  example: {
    prompt: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  whyHard: string;
  strategies: string[];
  practiceTip: string;
}

export const QUESTION_TYPES: QuestionTypeGuide[] = [
  {
    slug: "cloze-questions",
    pathSegment: "/11-plus-cloze-questions",
    title: "11+ Cloze Questions",
    metaTitle: "11+ Cloze Questions – Examples, Strategies & Practice",
    metaDescription: "How cloze questions work in the 11+, with worked examples, common traps and the fastest way to improve in the final weeks of preparation.",
    domain: "Verbal Reasoning",
    domainHref: "/11-plus-verbal-reasoning-practice",
    intro: "Cloze questions present a sentence with a missing word and ask the child to choose from four or five options the word that best completes the sentence. They appear in both Verbal Reasoning and English Comprehension papers and reward vocabulary depth, sensitivity to context, and a feel for grammatical fit.",
    example: {
      prompt: "The hikers were ______ by the unexpected storm and had to take shelter under a rocky overhang.",
      options: ["delighted", "amused", "startled", "encouraged", "warmed"],
      answer: "startled",
      explanation: "Only 'startled' fits the negative tone — the storm forced them to take shelter, so they were caught off guard. The other options either contradict the situation (delighted, amused, encouraged, warmed) or don't connect logically with 'unexpected storm'.",
    },
    whyHard: "Cloze questions test register and tone alongside meaning. Two answer options are often technically grammatical, but only one matches the emotional weight of the sentence. Children who skim risk picking the first plausible option.",
    strategies: [
      "Read the whole sentence first — don't try to fill the gap before you reach the end.",
      "Identify the tone (positive, negative, neutral) before scanning options.",
      "Eliminate any option that contradicts the surrounding context, then choose between the survivors.",
      "Re-read the sentence with your chosen word inserted — if it sounds awkward, revisit.",
    ],
    practiceTip: "Wide reading is by far the most effective long-term cloze training. In the final weeks, time-boxed daily drills (10 questions in 5 minutes) build the speed needed under exam conditions.",
  },
  {
    slug: "shuffled-sentences",
    pathSegment: "/11-plus-shuffled-sentences",
    title: "11+ Shuffled Sentences",
    metaTitle: "11+ Shuffled Sentences – How to Solve Them Fast",
    metaDescription: "A worked example of an 11+ shuffled sentence question, the common traps, and a four-step method that works under time pressure.",
    domain: "Verbal Reasoning",
    domainHref: "/11-plus-verbal-reasoning-practice",
    intro: "Shuffled sentence questions present the words of a sentence in the wrong order, with one extra word that does not belong. The child must mentally reorder the words and identify which option is the redundant one. This is one of the most challenging Verbal Reasoning question types because it combines syntactic reasoning with vocabulary judgement under tight time pressure.",
    example: {
      prompt: "Identify the word that does not belong in the sentence: [climbed] [the] [carefully] [tree] [she] [tall] [up]",
      options: ["climbed", "carefully", "tree", "tall", "up"],
      answer: "tall",
      explanation: "Reordered, the sentence reads 'She climbed carefully up the tree' — a complete, grammatical sentence. The word 'tall' is grammatically valid but cannot be placed without breaking the rest of the structure.",
    },
    whyHard: "Children often spot a possible sentence quickly and rush to identify the leftover word — but the leftover word is often plausible (an adjective or adverb that 'could' fit) and only careful reconstruction reveals it doesn't.",
    strategies: [
      "Find the verb first — it anchors the sentence structure.",
      "Identify the subject (noun + any article) and pair it with the verb.",
      "Place adverbs and prepositional phrases around the core sentence.",
      "Whatever word is left over — even if it looks reasonable — is your answer.",
    ],
    practiceTip: "Children who struggle here usually benefit from physical practice with cards: write each word on a separate card and physically arrange them. After 20–30 problems done this way, the mental version becomes much faster.",
  },
  {
    slug: "synonyms-antonyms",
    pathSegment: "/11-plus-synonyms-antonyms",
    title: "11+ Synonyms & Antonyms",
    metaTitle: "11+ Synonyms & Antonyms – Vocabulary Strategy & Worked Examples",
    metaDescription: "Worked examples of synonym and antonym questions in the 11+, plus the most effective ways to build the vocabulary needed by Year 6.",
    domain: "Verbal Reasoning",
    domainHref: "/11-plus-verbal-reasoning-practice",
    intro: "Synonyms ask the child to choose the option closest in meaning to a target word; antonyms ask for the opposite. These question types reward vocabulary breadth more than any other on the paper — there are no shortcuts beyond knowing the words.",
    example: {
      prompt: "Choose the SYNONYM of: RELUCTANT",
      options: ["eager", "hesitant", "tired", "honest", "curious"],
      answer: "hesitant",
      explanation: "'Reluctant' means unwilling or hesitant to do something. 'Hesitant' is the closest match. 'Eager' is the antonym — easy to pick by mistake if a child reads the question heading too quickly.",
    },
    whyHard: "Many wrong answers are 'distractor synonyms' — words related to the target's broader theme but not its precise meaning. And synonym/antonym questions appear back-to-back in the paper, so children must read the heading on every question.",
    strategies: [
      "Always re-read the heading (SYNONYM vs ANTONYM) on each new question — they alternate intentionally.",
      "Define the target word in your own words before scanning the options.",
      "If you don't know the target word, eliminate the options whose meanings you do know and guess between what's left.",
      "Don't change a confident answer when checking — your first instinct is usually right.",
    ],
    practiceTip: "A vocabulary list of 8,000–12,000 words by Year 6 makes synonym/antonym questions almost automatic. Daily reading of varied genres (fiction, news, history) is more effective than memorising word lists.",
  },
  {
    slug: "word-problems-maths",
    pathSegment: "/11-plus-word-problems-maths",
    title: "11+ Maths Word Problems",
    metaTitle: "11+ Maths Word Problems – Method, Examples & Common Traps",
    metaDescription: "How to break down 11+ maths word problems, with worked examples and a reliable four-step method that works under time pressure.",
    domain: "Maths",
    domainHref: "/11-plus-maths-practice",
    intro: "Word problems are short real-world scenarios that require children to extract numerical information from a sentence and apply the correct calculation. They make up roughly 60% of an 11+ Maths paper and are the section where children most often lose marks not because they can't do the maths, but because they misread the question.",
    example: {
      prompt: "A box contains 3 times as many red marbles as blue marbles. There are 24 red marbles. How many marbles are in the box altogether?",
      options: ["27", "32", "8", "72", "30"],
      answer: "32",
      explanation: "Red = 24 = 3 × blue, so blue = 8. Total = 24 + 8 = 32. The most common mistake is choosing 27 (24 + 3) by misreading the relationship, or 72 (24 × 3) by inverting it.",
    },
    whyHard: "Children rush to start calculating before they have understood the question. Time saved on reading is lost five times over on miscalculation.",
    strategies: [
      "Read the question twice before picking up the pencil.",
      "Underline the numbers and the question word ('How many', 'What fraction', 'How long').",
      "Write down the relationship in symbols (e.g. R = 3B) before substituting numbers.",
      "Sanity-check: does the answer make sense in the real-world scenario?",
    ],
    practiceTip: "Three to five word problems daily over 8–12 weeks builds the methodical habits that make a difference under exam pressure. Speed matters less than process.",
  },
  {
    slug: "cube-nets",
    pathSegment: "/11-plus-cube-nets",
    title: "11+ Cube Nets",
    metaTitle: "11+ Cube Nets – Spatial Reasoning Examples & Strategy",
    metaDescription: "How cube net questions work in the 11+ Non-Verbal Reasoning paper, with worked examples and the spatial-reasoning techniques that work fastest.",
    domain: "Non-Verbal Reasoning",
    domainHref: "/11-plus-non-verbal-reasoning-practice",
    intro: "Cube net questions show either a flat 'unfolded' shape and ask which 3D cube it produces, or vice versa. Children must mentally fold or unfold the shape and track the position of patterns or letters on each face. This is one of the most spatially demanding NVR question types.",
    example: {
      prompt: "Which of the cubes can be made by folding the net? (The net shows a cross-shaped arrangement of six squares with a star on the top square, a circle on the middle, and arrows pointing right on the right square.)",
      options: ["Cube A — star on top, circle facing forward, arrow on right face", "Cube B — star on top, circle facing forward, arrow on left face", "Cube C — star on top, arrow facing forward, circle on right face", "Cube D — circle on top, star facing forward, arrow on right face"],
      answer: "Cube A — star on top, circle facing forward, arrow on right face",
      explanation: "The middle square of the net becomes the front face when folded; the top square becomes the top; the right square becomes the right face. So star→top, circle→front, arrow→right. Other options swap adjacent faces, which is the most common error.",
    },
    whyHard: "Mental rotation is a developmental skill that varies widely between children of the same age. Some children find cube nets intuitive within a few sessions; others need months of physical practice with paper nets.",
    strategies: [
      "Fix the bottom face first — the largest central square in a cross-shaped net.",
      "Track adjacencies: faces that share an edge in the net share an edge in the cube.",
      "Opposite faces are never adjacent in the net — always separated by exactly one face.",
      "Eliminate options where opposite faces have been swapped (a frequent distractor).",
    ],
    practiceTip: "Print and fold paper nets for the first 20–30 problems. Physical practice builds spatial intuition far faster than on-screen drilling at this age.",
  },
  {
    slug: "rotation-reflection",
    pathSegment: "/11-plus-rotation-reflection",
    title: "11+ Rotation & Reflection",
    metaTitle: "11+ Rotation & Reflection – Technique, Examples & Practice",
    metaDescription: "How rotation and reflection questions work in the 11+ Non-Verbal Reasoning paper, with examples and the techniques that build reliable speed.",
    domain: "Non-Verbal Reasoning",
    domainHref: "/11-plus-non-verbal-reasoning-practice",
    intro: "Rotation and reflection questions present a starting shape and ask the child to choose the option that shows the shape after a specific transformation — a 90°, 180° or 270° rotation, or a mirror reflection across a stated axis. They reward methodical thinking and benefit hugely from a small set of memorised reference patterns.",
    example: {
      prompt: "Which option shows the shape on the left rotated 90° clockwise? (The shape is an arrow pointing up with a small dot on its right tail.)",
      options: ["Arrow pointing right, dot on top", "Arrow pointing left, dot on top", "Arrow pointing right, dot on bottom", "Arrow pointing down, dot on right"],
      answer: "Arrow pointing right, dot on bottom",
      explanation: "A 90° clockwise rotation takes 'up' to 'right'. The dot was on the right tail of the upward arrow, so it now sits on the bottom (formerly the back) of the rightward arrow.",
    },
    whyHard: "Children often confuse rotation direction (clockwise vs anti-clockwise) and the difference between a rotation and a reflection. Both produce 'flipped' shapes that look superficially similar.",
    strategies: [
      "Rotate by tracking one fixed reference point (e.g. the arrowhead) — the rest follows.",
      "For 180° rotations, every point ends up diagonally opposite — fastest to do mentally as a flip both horizontal and vertical.",
      "For reflections, the axis is the 'mirror' — distances from the axis stay the same on both sides.",
      "If unsure, lightly turn your test paper to physically check (you have time on most NVR papers).",
    ],
    practiceTip: "Practice with cut-out shapes for the first 10–20 problems. Move to mental rotation only once the child can confidently predict the answer before checking with the cut-out.",
  },
  {
    slug: "comprehension-inference",
    pathSegment: "/11-plus-comprehension-inference",
    title: "11+ Comprehension Inference",
    metaTitle: "11+ Comprehension Inference Questions – Worked Examples & Strategy",
    metaDescription: "How inference questions work in 11+ English Comprehension, with examples, common traps, and how to build the skill over Years 4 and 5.",
    domain: "English Comprehension",
    domainHref: "/11-plus-comprehension-practice",
    intro: "Inference questions ask the child to draw a conclusion that is implied but not explicitly stated in the text. They are the hardest type of comprehension question because the answer cannot be found by skimming for keywords — the child must combine information from across the passage and reason about it.",
    example: {
      prompt: "From the passage, what can you infer about the narrator's relationship with her brother?",
      options: ["They are very close and confide in each other", "They argue frequently but care for each other", "She resents him but hides it well", "They barely speak to each other"],
      answer: "They argue frequently but care for each other",
      explanation: "Inference questions reward careful reading of the whole passage. The narrator's tone (mock-irritation, fond memories of childhood, concern when he is unwell) points to affection beneath surface conflict — not the explicit closeness of option A nor the resentment of option C.",
    },
    whyHard: "Children who are used to literal recall ('Find the answer in the text') struggle with inference because the answer is not literally in the text — it has to be reasoned. Strong fiction readers tend to outperform here regardless of practice volume.",
    strategies: [
      "Read the whole passage before answering any question — inference depends on context.",
      "Eliminate options that are too extreme (the answer is rarely 'never' or 'always').",
      "Eliminate options that contradict any part of the text, even subtly.",
      "Choose the option that is consistent with everything in the passage, not just one section.",
    ],
    practiceTip: "Reading varied fiction — particularly mid-20th-century children's classics with rich character detail — builds inference skill more reliably than any drill. Discussion at home ('What do you think the character was really feeling?') multiplies the effect.",
  },
];

export function getQuestionType(slug: string): QuestionTypeGuide | undefined {
  return QUESTION_TYPES.find((q) => q.slug === slug);
}

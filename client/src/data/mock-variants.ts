export interface MockVariant {
  slug: string;
  pathSegment: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whatItIs: string;
  whoItSuits: string;
  howToRunIt: string[];
  whatGoodLooksLike: string;
  whatToDoAfter: string[];
  pitfalls: string[];
}

export const MOCK_VARIANTS: MockVariant[] = [
  {
    slug: "online-free",
    pathSegment: "/11-plus-mock-test-online-free",
    title: "Free Online 11+ Mock Test",
    metaTitle: "Free Online 11+ Mock Test — Bucks GL-Style Practice",
    metaDescription: "A free online 11+ mock test in the GL Assessment style used by Buckinghamshire. Sit it at home, get a readiness band, and see exactly which areas need work.",
    intro: "A free online mock test gives parents the fastest possible read on whether their child is on track for the Bucks 11+ — without the cost, travel and waiting time of a paid in-person mock. The trade-off is that an online mock can't fully reproduce the test-room atmosphere; what it can do is give a reliable, structured snapshot of accuracy and pacing.",
    whatItIs: "A timed, GL-style assessment that mirrors the format of the Bucks 11+: multiple-choice questions across Verbal Reasoning, Non-Verbal Reasoning, Maths and English Comprehension, with strict timings per section. Our free 8-minute diagnostic is a 12-question version designed to give a parent a directional readiness band in a single sitting; full-length papers are available inside the practice platform.",
    whoItSuits: "Parents who want a baseline before deciding how much time and money to invest in 11+ preparation. Also useful for parents who already have a tutor or a workbook routine and want an independent check on whether the preparation is closing the right gaps.",
    howToRunIt: [
      "Choose a quiet 30 minutes when the child is not tired and is unlikely to be interrupted.",
      "Sit the child at a desk with paper and pencil to one side. The mock is on screen but children should be able to scribble working out.",
      "Don't help, don't comment, don't lean over. Treat it as you would a real test.",
      "Start the timer with the child. Resist the urge to talk through the first question.",
      "When the time ends, end the test — even if questions are unfinished. Pacing data matters.",
    ],
    whatGoodLooksLike: "On a 12-question diagnostic, 9 or more correct (75%+) is consistent with a child currently on track for the 121 qualifying standard. 7–8 correct is 'within reach with consistent practice'. Below 7 indicates a clear improvement opportunity. Pacing matters too: a child who finishes well within time but scores low has a knowledge gap; a child who runs out of time has a fluency gap. The two are addressed differently.",
    whatToDoAfter: [
      "Look at the breakdown by section, not just the overall score. A child who is strong in three sections and weak in one needs targeted practice on the weak section, not more generic drilling.",
      "Note any question type the child consistently misses — that's the priority area for the next two weeks.",
      "Sit a fresh mock four to six weeks later to measure progress. One mock is a snapshot; two mocks are a trend.",
      "Don't rerun the same mock — the child has now seen the questions and the result will be inflated.",
    ],
    pitfalls: [
      "Sitting the mock when the child is tired or has just done other school work — the result is unreliable.",
      "Stopping the timer to 'help with the wording' — this invalidates the pacing data.",
      "Reading too much into a single result. Two mocks taken weeks apart give a far better signal.",
      "Comparing the score to other children rather than to the qualifying standard. The 11+ is benchmarked, not ranked.",
    ],
  },
  {
    slug: "40-questions",
    pathSegment: "/11-plus-mock-test-40-questions",
    title: "40-Question 11+ Mock Test",
    metaTitle: "40-Question 11+ Mock Test — Full-Length Bucks-Style Practice",
    metaDescription: "A 40-question full-length 11+ mock test in the GL style used by Buckinghamshire, with section timings, marking criteria and a readiness band.",
    intro: "A 40-question mock test is the closest at-home approximation of a real Bucks 11+ paper section. It's long enough to test stamina and pacing, short enough to fit into a single sitting, and structured enough to produce a meaningful score breakdown.",
    whatItIs: "A timed paper of 40 multiple-choice questions, weighted across the four GL Assessment domains (Verbal Reasoning, Non-Verbal Reasoning, Maths, Comprehension). Section timings reflect the real paper: roughly 50 minutes total, with the comprehension passage taking the largest single chunk. Each question has a worked solution after marking.",
    whoItSuits: "Year 5 children in the second half of the year, and Year 6 children at any point. Best used after at least four weeks of structured preparation — a 40-question mock taken cold can be discouraging and produces less actionable data than a shorter diagnostic.",
    howToRunIt: [
      "Schedule the mock for a weekend morning, not after school. Children's accuracy drops sharply in the late afternoon.",
      "Set up the workspace exactly as you would for the real test: paper, two pencils, no devices, no clutter.",
      "Use a timer the child can see. Pacing pressure is part of the test.",
      "Run all 40 questions in one sitting. Splitting across two days defeats the stamina purpose.",
      "Mark together afterwards. The marking conversation is where most of the learning happens.",
    ],
    whatGoodLooksLike: "On a 40-question mock, 30 or more (75%+) is consistent with current readiness for 121. 25–29 is 'within reach'. Below 25 indicates a clear gap. Look at section balance: a child scoring 8/10 in three sections and 2/10 in one is a different problem from a child scoring 6/10 across all four.",
    whatToDoAfter: [
      "List every question the child got wrong with the question type next to it.",
      "Cluster the wrong questions by type — usually two or three types account for most of the lost marks.",
      "Spend the next two weeks on the two or three weakest types specifically. Don't restart with general practice.",
      "Sit a fresh 40-question mock six weeks later. Year-on-year improvement of 5–10 marks is realistic with consistent weekly practice.",
    ],
    pitfalls: [
      "Sitting the same 40-question mock twice — the score will look better but won't reflect real progress.",
      "Allowing extra time 'just to finish'. The pacing data is one of the most important parts of the result.",
      "Marking as 'right' or 'wrong' without reviewing the worked solution together.",
      "Treating the mock as a competition or punishment. The mock is diagnostic, not judgmental.",
    ],
  },
  {
    slug: "50-questions",
    pathSegment: "/11-plus-mock-test-50-questions",
    title: "50-Question 11+ Mock Test",
    metaTitle: "50-Question 11+ Mock Test — Stamina & Full-Paper Practice",
    metaDescription: "A 50-question 11+ mock test designed to test stamina and full-paper pacing, with section breakdowns and a readiness band against the 121 standard.",
    intro: "A 50-question mock is longer than the typical practice paper and shorter than a full multi-paper sitting. It's the right length for testing real-world stamina without consuming a whole morning, and is particularly useful in the final 8–12 weeks before the test.",
    whatItIs: "A timed paper of 50 mixed-domain questions, with section breaks and a strict overall time limit. Designed to feel like a 'long Saturday' rather than a quick check — the pacing pressure builds toward the end, which is exactly the dynamic the real test produces.",
    whoItSuits: "Year 6 children in the run-up to September, and well-prepared Year 5 children in the summer holiday before Year 6. Not appropriate for first-time mock takers — the length will exhaust a child who hasn't built up to it.",
    howToRunIt: [
      "Build up to it. A child sitting a 50-question mock should already have completed at least two 30- or 40-question mocks in the previous month.",
      "Allow a five-minute mid-paper break. The real test has section transitions; an at-home mock should mirror that.",
      "Use a paper-and-pencil set-up where possible. Handwriting and on-screen reading have different cognitive loads.",
      "Set the workspace at least an hour in advance — the child should arrive at it ready, not still finishing breakfast.",
      "Don't answer questions during the test, even procedural ones. Note them down for the after-mock conversation.",
    ],
    whatGoodLooksLike: "37 or more correct out of 50 (74%+) is consistent with on-track readiness for 121. 30–36 is within reach. Below 30 with weeks to go indicates either a knowledge gap or a fluency gap — the question-type breakdown will show which. Pace matters more on a 50-question mock than on shorter ones: a child who runs out of time in the last 5 questions is showing a stamina issue, not a knowledge issue.",
    whatToDoAfter: [
      "Separate 'wrong because didn't know' from 'wrong because rushed' — they are different problems.",
      "If pacing is the issue, drill mental maths and reading speed for two weeks before retesting.",
      "If knowledge is the issue, go back to the question types and topics where marks were lost.",
      "Don't sit another 50-question mock for at least three weeks — recovery and learning take time.",
    ],
    pitfalls: [
      "Sitting a 50-question mock cold without building up to it.",
      "Sitting it on a school day evening — fatigue distorts the result.",
      "Treating one mock score as definitive. Two scores three weeks apart are the minimum for a real signal.",
      "Skipping the after-mock review because the score was disappointing.",
    ],
  },
  {
    slug: "with-timer",
    pathSegment: "/11-plus-mock-test-with-timer",
    title: "11+ Mock Test With Timer",
    metaTitle: "11+ Mock Test With Timer — Pacing-Focused Bucks-Style Practice",
    metaDescription: "A timed 11+ mock test designed to build the pacing children need under exam pressure, with per-question and per-section timing breakdowns.",
    intro: "Most 11+ marks are lost not to wrong answers but to unanswered questions. A child who can solve 35 out of 40 in 25 minutes scores higher than a child who can solve 38 out of 40 in 35 minutes — because the second child runs out of time on the real paper. A timed mock isolates and trains the pacing skill that matters.",
    whatItIs: "A standard mock test with a visible countdown timer and per-question and per-section pacing analytics. Children see the time tick down; parents see, after the test, exactly which questions slowed the child down.",
    whoItSuits: "Children who score well on untimed practice but lose marks under exam conditions. Also useful for children who finish the paper but get the last 10% of questions wrong because they were rushing.",
    howToRunIt: [
      "Use a clearly visible timer. The child should know how long they have left without having to ask.",
      "Don't pause the timer for any reason — even questions, even bathroom breaks. The pacing data is the point.",
      "Sit the child at a desk that lets them put down the question paper between questions — strict environment, not casual.",
      "After the test, look at per-question timing before looking at correctness. Pacing patterns reveal more than scores.",
      "Talk through the slowest two or three questions with the child, asking what they were thinking when they got stuck.",
    ],
    whatGoodLooksLike: "Strong pacing means averaging close to 90 seconds per question with no question taking more than 2 minutes. A child who spends 4 minutes on one question and 30 seconds on the next is pacing badly — even if both answers are right. The aim is consistent timing per question rather than fast-then-slow or slow-then-rushed.",
    whatToDoAfter: [
      "Identify the question types that consistently take the longest — those are the priority for technique drilling.",
      "Practise 'mark and move on' — the discipline of skipping a question that's taking too long and returning at the end.",
      "Add a stopwatch to homework practice for one week to build internal pacing awareness.",
      "Resit a timed mock two weeks later and compare per-question timing patterns.",
    ],
    pitfalls: [
      "Letting the child glance at the timer constantly during the test. Set it large but encourage focus on the question.",
      "Pausing for 'just a quick chat' — invalidates the pacing data.",
      "Treating slow correct answers the same as fast correct answers. They produce different real-test outcomes.",
      "Drilling speed without first ensuring the child knows the question type. Speed without accuracy is regression.",
    ],
  },
  {
    slug: "at-home",
    pathSegment: "/11-plus-mock-exam-at-home",
    title: "11+ Mock Exam at Home",
    metaTitle: "11+ Mock Exam at Home — How to Run a Reliable Home Mock",
    metaDescription: "How to run a reliable 11+ mock exam at home: setting up the room, managing timing, marking and using the result to plan the next four weeks.",
    intro: "A home mock won't perfectly replicate a test-centre environment — but it costs nothing, can be repeated regularly, and produces data a parent can act on the same day. The setup matters more than most parents realise: a poorly-run home mock generates a misleading result that takes weeks to correct for.",
    whatItIs: "A full or partial 11+ practice paper sat under controlled conditions in your own home. Differs from informal practice in three ways: strict timing, no help during the test, and a structured marking-and-review session afterwards.",
    whoItSuits: "Every Year 6 family preparing for the Bucks 11+, and Year 5 families in the second half of the year. Particularly valuable for families who can't easily access a paid in-person mock or who want to track progress between in-person mocks.",
    howToRunIt: [
      "Choose a desk in a quiet room. Clear it of toys, devices and other school work.",
      "Schedule for a weekend morning. Test fatigue is real and afternoon scores are typically 5–10% lower.",
      "Read the rubric aloud as a real invigilator would. The child should know exactly how long they have and what to do at the end.",
      "Stay in the room but don't engage. Reading a book at the other end of the table works well.",
      "End the test on time, even if questions are unfinished. The pacing is part of the result.",
      "Wait at least an hour before reviewing. Both you and the child need a reset before the marking conversation.",
    ],
    whatGoodLooksLike: "A reliable home mock produces a score within a few marks of an in-person mock if both are run properly. If your home mock score is wildly different, look first at the setup — distractions, time-keeping, prior fatigue. Single-mock readings have noise; two or three mocks at three-week intervals reveal the trend.",
    whatToDoAfter: [
      "Mark together. The conversation around 'why did you choose that answer' produces more learning than the mock itself.",
      "Build a 'wrong question' notebook organised by question type, not by date.",
      "Set the next mock for four to six weeks later. Mocks every week train the wrong skill (test technique) while neglecting underlying knowledge.",
      "Use the result to plan the next four weeks of practice — not as a verdict on whether the child will pass.",
    ],
    pitfalls: [
      "Running the mock in a busy household with siblings interrupting.",
      "Helping with 'just one question' during the test.",
      "Marking strictly without explaining wrong answers.",
      "Testing too often. Weekly mocks burn children out and don't produce learning.",
    ],
  },
];

export function getMockVariant(slug: string): MockVariant | undefined {
  return MOCK_VARIANTS.find((m) => m.slug === slug);
}

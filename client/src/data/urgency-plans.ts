export interface UrgencyPlan {
  slug: string;
  pathSegment: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  realityCheck: string;
  weeklyStructure: { week: string; focus: string; activities: string[] }[];
  dailyHabits: string[];
  whatToAvoid: string[];
  closingNote: string;
}

export const URGENCY_PLANS: UrgencyPlan[] = [
  {
    slug: "30-days-to-go",
    pathSegment: "/11-plus-30-days-to-go",
    title: "11+: 30 Days to Go",
    metaTitle: "11+ 30 Days To Go — Final-Month Revision Plan",
    metaDescription: "A realistic 30-day 11+ revision plan for the final month before the Bucks Secondary Transfer Test, with weekly focus and daily habits.",
    intro: "Thirty days is enough time to consolidate, build pacing and clear the most fixable weaknesses. It is not enough time to learn topics from scratch. The plan below is built for a child who has already done some preparation and needs a structured final month, not a crash course from zero.",
    realityCheck: "What can shift in 30 days: pacing, exam technique, vocabulary recall, mental-maths fluency, confidence under timing. What can't shift in 30 days: a fundamentally weak grasp of fractions or comprehension, or a child who has done no preparation. If your child is in the second category, focus on building familiarity and a calm test-day rather than chasing a score.",
    weeklyStructure: [
      {
        week: "Week 4 (Days 1–7): Diagnose and prioritise",
        focus: "Identify the two or three weakest areas using a full mock test. Don't try to fix everything.",
        activities: [
          "Day 1: Sit a full-length mock under timed conditions.",
          "Days 2–3: Mark and review. List wrong questions by type. Pick the two weakest.",
          "Days 4–7: Daily 30-minute targeted practice on the two weakest types.",
        ],
      },
      {
        week: "Week 3 (Days 8–14): Targeted improvement",
        focus: "Drill the weakest types until they reach the baseline of the rest.",
        activities: [
          "Days 8–11: 30 minutes daily on weakest type 1; 15 minutes on weakest type 2.",
          "Days 12–13: Switch — 30 minutes on type 2; 15 minutes on type 1.",
          "Day 14: Mini-mock (20 questions, mixed). Re-check progress.",
        ],
      },
      {
        week: "Week 2 (Days 15–21): Build pacing",
        focus: "Train the child to maintain accuracy under time pressure.",
        activities: [
          "Days 15–17: Timed drills (10 questions in 8 minutes) across all four sections.",
          "Days 18–19: Full timed mock paper. Mark together and review pacing per section.",
          "Days 20–21: Practice the 'mark and move on' rule. Drill what to do when stuck.",
        ],
      },
      {
        week: "Week 1 (Days 22–30): Taper and consolidate",
        focus: "Reduce volume, lock in confidence, prepare for test day.",
        activities: [
          "Days 22–25: Short daily practice (20 minutes max) on familiar question types.",
          "Day 26: Final full-length mock under realistic conditions.",
          "Days 27–28: Light review only. Walk through the test-day checklist.",
          "Day 29: Rest. No practice. Early bedtime.",
          "Day 30 (test day): Light breakfast, calm morning, confident arrival.",
        ],
      },
    ],
    dailyHabits: [
      "Read for 15 minutes a day in self-chosen fiction. Reading is the highest-leverage daily activity.",
      "Five mental-maths questions over breakfast (no pen, no paper).",
      "One unfamiliar word a day, used in a sentence at dinner.",
      "Bed by 9 pm — sleep is the single biggest controllable factor in test-day performance.",
    ],
    whatToAvoid: [
      "Adding new question types or topics in the final two weeks. New material in the final fortnight reduces confidence rather than building knowledge.",
      "Multiple mocks in the final week. One full mock in the final week is enough; more burns the child out.",
      "Late-night cramming the night before. The marginal practice gain is less than the sleep cost.",
      "Constant score discussion. Talk about the practice; don't talk about the result.",
    ],
    closingNote: "A child who arrives at test day calm, well-rested and confident in their familiar question types performs significantly above their score on a chaotic day with broken sleep. The final week is about preserving readiness, not pushing for a last-minute breakthrough.",
  },
  {
    slug: "4-weeks-to-go",
    pathSegment: "/11-plus-4-weeks-to-go",
    title: "11+: 4 Weeks to Go",
    metaTitle: "11+ Four Weeks To Go — Focused Revision Plan",
    metaDescription: "A focused four-week 11+ revision plan covering diagnostic, targeted improvement, pacing and confidence-building before the Bucks 11+.",
    intro: "Four weeks before the test is the right time for a structured final push. There is enough time to fix two or three identifiable weaknesses and lock in pacing, but not enough time to learn topics from scratch. The plan below uses one week per stage: diagnose, target, pace, taper.",
    realityCheck: "If your child has done six months or more of preparation, four weeks is enough to add 5–10 marks through pacing and weak-spot work. If your child has done little preparation, four weeks is enough to build familiarity and protect against test-day shock — but not enough to reach the qualifying standard from a low starting point.",
    weeklyStructure: [
      {
        week: "Week 1: Diagnose",
        focus: "Identify the two or three weakest question types using a full mock.",
        activities: [
          "Sit one full-length timed mock at the start of the week.",
          "Mark and review every wrong answer with the child.",
          "List wrong answers by question type. Pick the two with the highest count.",
          "Mid-week: targeted practice on the weakest type only. End of week: introduce type 2.",
        ],
      },
      {
        week: "Week 2: Target",
        focus: "Concentrated work on the two weakest question types.",
        activities: [
          "Daily 30-minute drills on weakest type, 15 minutes on second weakest.",
          "Mid-week mini-mock (15 questions of the targeted types only).",
          "End of week: 20-question mixed mock to confirm improvement.",
        ],
      },
      {
        week: "Week 3: Pace",
        focus: "Build the timing discipline that protects against running out of time.",
        activities: [
          "Daily timed drills (10 questions in 8 minutes).",
          "Practice 'mark and move on' explicitly. Drill the discipline of skipping.",
          "End of week: full timed mock. Compare per-question timing to week 1.",
        ],
      },
      {
        week: "Week 4: Taper",
        focus: "Reduce volume, build confidence, prepare for test day.",
        activities: [
          "Short daily practice on familiar question types only (20 minutes).",
          "Run through the test-day checklist mid-week.",
          "Two days before: rest. No practice.",
          "Day before: light review only. Early bedtime.",
        ],
      },
    ],
    dailyHabits: [
      "15 minutes of reading in self-chosen fiction.",
      "Five mental-maths questions at the breakfast table.",
      "One unfamiliar word a day, discussed at dinner.",
      "9 pm bedtime in the final two weeks.",
    ],
    whatToAvoid: [
      "Trying to fix everything. Two or three weak types is the maximum that can be improved meaningfully in four weeks.",
      "Daily mocks. They produce diminishing returns and exhaust the child.",
      "New material introduced in week 4. Stick to consolidation in the final week.",
      "Score-focused conversations. Talk about technique, not numbers.",
    ],
    closingNote: "Four weeks is a long enough runway to make a measurable difference if the work is targeted. The instinct to do more, faster, often produces less progress than a calm, structured plan with rest built in.",
  },
  {
    slug: "last-minute",
    pathSegment: "/last-minute-11-plus-revision",
    title: "Last-Minute 11+ Revision",
    metaTitle: "Last-Minute 11+ Revision — What to Do in the Final 7 Days",
    metaDescription: "A practical last-minute 11+ revision plan for the final week before the Bucks Secondary Transfer Test, focused on confidence and test-day readiness.",
    intro: "In the final week, less is more. The goal is not to learn anything new but to arrive at the test calm, rested and confident in familiar question types. The plan below focuses on what to do — and what not to do — in the seven days before the Bucks 11+.",
    realityCheck: "Practice in the final week has minimal impact on knowledge but significant impact on confidence and pacing. A child who is rested, has eaten well and feels confident performs well above their score on a fatigued, anxious morning — even with the same underlying knowledge.",
    weeklyStructure: [
      {
        week: "Days 7–6: One last consolidation",
        focus: "A short, calm practice session focused on familiar question types.",
        activities: [
          "Day 7: 30-minute mixed practice on the child's strongest section. Build confidence, not stress.",
          "Day 6: 30-minute review of the wrong-answer notebook. Talk through mistakes calmly.",
        ],
      },
      {
        week: "Days 5–4: Pace check, no more mocks",
        focus: "Short timed drills only. No full mocks.",
        activities: [
          "Day 5: 15 questions in 12 minutes (timed). Review pacing only, not score.",
          "Day 4: Walk through the test-day checklist together. Pack what's needed.",
        ],
      },
      {
        week: "Days 3–2: Wind down",
        focus: "Reduce practice. Build sleep and routine.",
        activities: [
          "Day 3: 15-minute light practice on a section the child enjoys.",
          "Day 2: No practice. Read together. Visit the test centre if possible.",
        ],
      },
      {
        week: "Day 1 (day before): Rest",
        focus: "No practice. Calm, normal routine. Early bedtime.",
        activities: [
          "Light meals at usual times.",
          "Lay out clothes and equipment the night before.",
          "Bed by 8.30 pm.",
        ],
      },
    ],
    dailyHabits: [
      "Sleep 9–10 hours every night this week. Sleep matters more than practice.",
      "Read for 15 minutes before bed (no screens). Calms the mind and reinforces vocabulary.",
      "Talk about anything other than the test for at least one meal a day.",
      "No discussion of 'what if' scenarios. The test is a snapshot, not a verdict.",
    ],
    whatToAvoid: [
      "Late-night cramming the night before. The marginal gain is much smaller than the sleep cost.",
      "New question types in the final week. Stick to what is familiar.",
      "Score discussions. Talk about effort and technique, not numbers.",
      "Comparing to other children. Every child takes a different journey to the test.",
    ],
    closingNote: "The most successful test-day mornings look ordinary: a normal breakfast, calm parents, no last-minute drilling. A child who feels their parents are confident in them walks into the test room confident in themselves.",
  },
  {
    slug: "summer-holiday-plan",
    pathSegment: "/11-plus-summer-holiday-plan",
    title: "11+ Summer Holiday Plan",
    metaTitle: "11+ Summer Holiday Plan — Six-Week Year 5 to Year 6 Practice Plan",
    metaDescription: "A balanced six-week 11+ summer holiday plan for families moving from Year 5 to Year 6, with structured practice and protected rest.",
    intro: "The summer between Year 5 and Year 6 is the highest-leverage block of preparation time available to families. There are no school commitments, the test is far enough away to allow steady progress, and most children come back to Year 6 in September with momentum if the summer was used well. This plan is structured to balance progress with rest — children need both.",
    realityCheck: "Six weeks of focused, balanced practice — roughly 45 minutes a day on weekdays — typically moves a child from a baseline 'within reach' band to a comfortable 'on track' band by the start of Year 6. Pushing more than this produces diminishing returns and risks burnout before the test arrives.",
    weeklyStructure: [
      {
        week: "Week 1: Baseline and balance",
        focus: "Establish a routine; identify weak areas without pressure.",
        activities: [
          "Sit a full mock in the first three days. Mark and review together.",
          "Use the result to plan the next four weeks of weak-spot work.",
          "Don't introduce new material — week 1 is for understanding the starting point.",
        ],
      },
      {
        week: "Week 2: Verbal Reasoning focus",
        focus: "30 minutes daily on VR question types, 15 minutes on Maths.",
        activities: [
          "Daily VR practice across cloze, synonyms, antonyms and shuffled sentences.",
          "Light maths practice to maintain fluency.",
          "Two reading sessions per week of 30+ minutes — vocabulary feeds VR.",
        ],
      },
      {
        week: "Week 3: Maths focus",
        focus: "30 minutes daily on Maths topics, 15 minutes on Comprehension.",
        activities: [
          "Daily targeted practice on the weakest maths topic from the week 1 mock.",
          "Mental maths drills three times this week.",
          "Two short comprehension passages with three questions each.",
        ],
      },
      {
        week: "Week 4: NVR and Comprehension focus",
        focus: "30 minutes on NVR, 15 minutes on Comprehension.",
        activities: [
          "Daily NVR practice across matrix, sequence, classification and rotation.",
          "One longer comprehension passage every other day.",
          "Mid-week mock (40 questions) to check progress.",
        ],
      },
      {
        week: "Week 5: Mixed practice and pacing",
        focus: "Build pacing across all four sections.",
        activities: [
          "Daily timed drills — 15 questions in 12 minutes.",
          "Two full-length mocks this week (Monday and Friday).",
          "Practice the 'mark and move on' rule.",
        ],
      },
      {
        week: "Week 6: Taper and confidence",
        focus: "Reduce volume; build confidence going into Year 6.",
        activities: [
          "Light daily practice — 20 minutes maximum.",
          "Final mock at the end of the week.",
          "Compare to week 1 mock — celebrate the progress.",
        ],
      },
    ],
    dailyHabits: [
      "30 minutes of self-chosen reading every day. Non-negotiable.",
      "5 mental-maths questions at breakfast.",
      "One new word a day discussed at dinner.",
      "At least one full day off practice each week. Rest is part of the plan, not the absence of one.",
    ],
    whatToAvoid: [
      "Practice every single day with no breaks. The child needs at least one practice-free day per week.",
      "Long sessions over 90 minutes. Concentration drops sharply after the first hour.",
      "Adding tutoring on top of a structured home plan unless there is a specific weak area. More isn't better.",
      "Cancelling holidays or family time for practice. Burnout in August costs more than missed practice in July.",
    ],
    closingNote: "A summer that combines steady practice with proper rest sets a child up to start Year 6 confidently. The families that get the most from the summer are the ones that protect their downtime as carefully as they protect their practice time.",
  },
];

export function getUrgencyPlan(slug: string): UrgencyPlan | undefined {
  return URGENCY_PLANS.find((p) => p.slug === slug);
}

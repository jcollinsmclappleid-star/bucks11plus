import { DashboardPreviewForecast, DashboardPreviewPace } from "../components/shared/DashboardPreview";

export default function GuidePrint() {
  return (
    <div className="guide-print bg-white text-slate-800 font-sans max-w-[210mm] mx-auto">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .guide-print { max-width: 100%; }
          .page-break { page-break-after: always; }
          nav, footer, .no-print { display: none !important; }
        }
        @media screen {
          .guide-print { padding: 2rem; }
          .page-break { border-bottom: 2px dashed #e2e8f0; margin: 2rem 0; padding-bottom: 2rem; }
        }
      `}</style>

      <div className="page-break">
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center">
          <div className="mb-8">
            <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#0d1f30" strokeWidth="2" />
              <circle cx="24" cy="24" r="18" fill="none" stroke="#0d1f30" strokeWidth="1" opacity="0.3" />
              <line x1="24" y1="6" x2="24" y2="10" stroke="#0d1f30" strokeWidth="1.5" opacity="0.4" />
              <line x1="24" y1="38" x2="24" y2="42" stroke="#0d1f30" strokeWidth="1.5" opacity="0.4" />
              <line x1="6" y1="24" x2="10" y2="24" stroke="#0d1f30" strokeWidth="1.5" opacity="0.4" />
              <line x1="38" y1="24" x2="42" y2="24" stroke="#0d1f30" strokeWidth="1.5" opacity="0.4" />
              <circle cx="24" cy="24" r="3" fill="#0d1f30" opacity="0.5" />
            </svg>
            <div className="mt-3">
              <span className="block text-3xl font-serif font-bold text-[#0d1f30]">11+ Standard</span>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0d1f30] mb-4">The Buckinghamshire 11+ Parent Guide</h1>
          <p className="text-xl text-slate-500 max-w-md">Understanding the grammar school test and how to assess readiness.</p>
          <p className="text-sm text-slate-400 mt-12">bucks11plustest.co.uk</p>
        </div>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-serif font-bold text-[#0d1f30] mb-6">How the Bucks Grammar School System Works</h2>
        <h3 className="text-lg font-serif font-bold text-[#0d1f30] mt-6 mb-3">The Secondary Transfer Test</h3>
        <p className="text-sm leading-relaxed mb-4">
          The Buckinghamshire Secondary Transfer Test (commonly known as the "Bucks 11+") is the selective assessment used to determine eligibility for grammar school places in the county. It is administered by The Buckinghamshire Grammar Schools (TBGS) on behalf of all 13 grammar schools.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Children sit the test in September of Year 6. The test is designed to assess reasoning ability across three domains: Verbal Reasoning, Non-Verbal Reasoning, and Mathematics. It is not a test of curriculum knowledge — it measures underlying cognitive and reasoning skills.
        </p>
        <h3 className="text-lg font-serif font-bold text-[#0d1f30] mt-6 mb-3">The 13 Grammar Schools</h3>
        <p className="text-sm leading-relaxed mb-4">
          Buckinghamshire has 13 state-funded grammar schools, making it one of the largest selective education systems in England. Schools are spread across the county in Aylesbury, High Wycombe, Amersham, Beaconsfield, Chesham, Marlow, Burnham, Buckingham, and Little Chalfont.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          All 13 schools use the same test result for qualification. However, each school has its own oversubscription criteria (typically distance-based) which determines who receives a place when more children qualify than there are places available.
        </p>
        <h3 className="text-lg font-serif font-bold text-[#0d1f30] mt-6 mb-3">The Year 6 Testing Process</h3>
        <p className="text-sm leading-relaxed mb-4">
          Parents register their child during the summer term of Year 5 (May–June). Children then sit the test in September of Year 6 at an allocated test centre. Results arrive in mid-October, and parents submit school preferences on the common application form by 31 October. National Offer Day is 1 March.
        </p>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-serif font-bold text-[#0d1f30] mb-6">Understanding the Score of 121</h2>
        <p className="text-sm leading-relaxed mb-4">
          The qualifying score for Buckinghamshire grammar schools is a standardised score of <strong>121</strong>. This score has been consistent for many years and represents performance significantly above the national average.
        </p>
        <h3 className="text-lg font-serif font-bold text-[#0d1f30] mt-6 mb-3">How Standardisation Works</h3>
        <p className="text-sm leading-relaxed mb-4">
          Raw test scores are converted to standardised scores using age adjustment. This means that a child who is younger within the cohort (e.g., born in August) receives a slightly higher standardised score than an older child (born in September) who achieved the same raw score. This ensures fair comparison across the year group.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 my-6">
          <h4 className="text-sm font-bold text-[#0d1f30] mb-3">Score Ranges</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Below 110</span><span className="text-red-600 font-medium">Below qualifying range</span></div>
            <div className="flex justify-between"><span>110 – 120</span><span className="text-amber-600 font-medium">Within reach of qualifying</span></div>
            <div className="flex justify-between"><span>121+</span><span className="text-green-600 font-medium">Qualifying standard</span></div>
            <div className="flex justify-between"><span>130+</span><span className="text-green-700 font-medium">Comfortably above qualifying</span></div>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-4">
          Achieving a score of 121 means the child qualifies for grammar school <em>consideration</em>. It does not guarantee a place — each school's oversubscription criteria then determine allocation when demand exceeds capacity.
        </p>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-serif font-bold text-[#0d1f30] mb-6">Admissions Timeline</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-slate-300 pl-5">
            <h3 className="text-lg font-serif font-bold text-[#0d1f30]">Year 4 — Awareness</h3>
            <p className="text-sm leading-relaxed mt-2">Begin researching the Buckinghamshire grammar school system. Understand what the test involves and which schools serve your area. No formal preparation is needed at this stage.</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-5">
            <h3 className="text-lg font-serif font-bold text-[#0d1f30]">Year 5 — Preparation Begins</h3>
            <p className="text-sm leading-relaxed mt-2">Start structured familiarisation with the three test domains: verbal reasoning, non-verbal reasoning, and mathematics. Focus on building foundational reasoning skills and understanding the question formats. Register for the test during the summer term (May–June).</p>
          </div>
          <div className="border-l-4 border-green-500 pl-5">
            <h3 className="text-lg font-serif font-bold text-[#0d1f30]">Year 6 — Test & Applications</h3>
            <p className="text-sm leading-relaxed mt-2">Sit the Secondary Transfer Test in September. Receive results in mid-October. Submit school preferences on the common application form by 31 October. National Offer Day is 1 March.</p>
          </div>
        </div>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-serif font-bold text-[#0d1f30] mb-6">The Biggest Preparation Challenge</h2>
        <p className="text-sm leading-relaxed mb-4">
          Many families complete large numbers of practice questions — often hundreds of papers — without knowing whether their child's performance is actually improving in the areas that matter most.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          The challenge is not a lack of practice material. It is a lack of <strong>measurement</strong>. Parents often cannot answer fundamental questions:
        </p>
        <ul className="space-y-2 text-sm mb-6">
          <li className="flex items-start gap-2"><span className="text-slate-400">•</span>Is my child's accuracy improving, staying flat, or declining?</li>
          <li className="flex items-start gap-2"><span className="text-slate-400">•</span>Which specific reasoning skills are weakest?</li>
          <li className="flex items-start gap-2"><span className="text-slate-400">•</span>Is pace a limiting factor, or is it accuracy?</li>
          <li className="flex items-start gap-2"><span className="text-slate-400">•</span>Would improving one domain have more impact than another?</li>
          <li className="flex items-start gap-2"><span className="text-slate-400">•</span>How far is my child from the 121 qualifying score?</li>
        </ul>
        <p className="text-sm leading-relaxed mb-4">
          A diagnostic approach — one that measures specific skills, identifies gaps, and tracks progress — provides the clarity that generic practice cannot. This is the principle behind structured readiness assessment.
        </p>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-serif font-bold text-[#0d1f30] mb-6">Example Platform Dashboard</h2>
        <p className="text-sm leading-relaxed mb-6">
          The 11+ Standard platform provides structured readiness analysis. Below is an example of what parents can see after their child completes a diagnostic assessment.
        </p>
        <div className="transform scale-90 origin-top-left">
          <DashboardPreviewForecast />
        </div>
        <p className="text-sm text-slate-500 mt-4 italic">
          Example data shown for illustration. Actual results reflect your child's individual performance.
        </p>
      </div>

      <div>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h2 className="text-3xl font-serif font-bold text-[#0d1f30] mb-4">Measure Your Child's Bucks 11+ Readiness</h2>
          <p className="text-lg text-slate-500 max-w-md mb-8">
            Take a free 12-minute diagnostic assessment to see where your child stands against the 121 qualifying score.
          </p>
          <div className="rounded-xl border-2 border-[#0d1f30] px-8 py-4">
            <p className="text-lg font-bold text-[#0d1f30]">Start Free Diagnostic</p>
            <p className="text-sm text-slate-500 mt-1">bucks11plustest.co.uk/free-diagnostic</p>
          </div>
          <p className="text-sm text-slate-400 mt-12">bucks11plustest.co.uk</p>
          <p className="text-xs text-slate-400 mt-2">
            This guide is an independent educational resource. Not affiliated with The Buckinghamshire Grammar Schools, GL Assessment, or any individual grammar school.
          </p>
        </div>
      </div>
    </div>
  );
}

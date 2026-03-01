import { Seo } from "../components/shared/Seo";

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg">
      <Seo 
        title="About Us | 11+ Standard" 
        description="Learn about our mission to replace parental anxiety with clear, actionable data for Buckinghamshire 11+ preparation." 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">About 11+ Standard</h1>
      <p className="text-xl text-muted-foreground lead">
        We built 11+ Standard to replace parental anxiety with clear, actionable data.
      </p>

      <hr className="my-8" />

      <h2 className="text-primary font-serif">The Problem</h2>
      <p>
        Preparing for the Buckinghamshire 11+ often feels like navigating in the dark. Parents spend hundreds of pounds on generic mock exams or private tutors, but rarely get a clear answer to the most important question: <strong>"Is my child actually on track to pass?"</strong>
      </p>

      <h2 className="text-primary font-serif">Our Approach</h2>
      <p>
        11+ Standard was designed as an assessment-first platform. We believe that practice without direction is wasted time. By starting with a highly accurate diagnostic that measures both <strong>accuracy</strong> and <strong>pacing</strong>, we can prescribe the exact micro-drills required to close the gap to the 121 benchmark.
      </p>

      <p>
        We do not use gimmicks, games, or bright celebratory animations. We provide a calm, institutional-grade environment that respects the seriousness of the assessment and treats parents as partners in the preparation process.
      </p>
    </div>
  );
}
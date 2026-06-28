import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Seo } from "../components/shared/Seo";
import { ArrowRight, BookOpen, Target, Info, CheckCircle2, AlertCircle, Clock, BarChart2 } from "lucide-react";
import { SeoConversionPanel } from "../components/shared/SeoConversionPanel";

export default function ScoringMethodology() {
  const bands = [
    {
      label: "On Track",
      range: "121 and above",
      color: "bg-green-100 border-green-200 text-green-800",
      barColor: "bg-green-500",
      barWidth: "100%",
      description: "Your child's performance puts them in a strong position to reach 121 in the real test.",
    },
    {
      label: "Within Reach",
      range: "110 – 120",
      color: "bg-amber-100 border-amber-200 text-amber-800",
      barColor: "bg-amber-400",
      barWidth: "78%",
      description: "Encouraging progress — consistent targeted practice across weaker sections should close the remaining gap.",
    },
    {
      label: "Clear Improvement Opportunity",
      range: "Below 110",
      color: "bg-red-100 border-red-200 text-red-800",
      barColor: "bg-red-400",
      barWidth: "52%",
      description: "Significant groundwork is needed. Structured preparation across all four sections will make the biggest difference.",
    },
  ];

  const sections = [
    { name: "English Comprehension", icon: BookOpen, weight: "Passage-based reading; questions test inference, vocabulary in context, and authorial intent." },
    { name: "Verbal Reasoning", icon: BarChart2, weight: "Codes, sequences, analogies, and word relationships — tests ability to reason with language logically." },
    { name: "Mathematics", icon: Target, weight: "Arithmetic, fractions, ratio, algebra, and problem-solving at Key Stage 2 level and above." },
    { name: "Non-Verbal Reasoning", icon: BarChart2, weight: "Pattern recognition, spatial reasoning, and matrix completion — no reading required." },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-10">
      <Seo
        title="Bucks 11 Plus Scoring Explained – What the 121 Standardised Score Means | Bucks 11 Plus Tests"
        description="How the Bucks 11 Plus 121 standardised score works and what our readiness forecast means for your child's grammar school application."
        canonicalPath="/scoring-methodology"
      />

      <div className="border-b border-border/60 pb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-3">How Forecast Scoring Works</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          An honest explanation of how we calculate your child's readiness forecast, what the 121 benchmark means, and the limitations you should be aware of.
        </p>
      </div>

      <SeoConversionPanel variant="score" />

      <Card className="border-blue-200/60 bg-blue-50/30">
        <CardContent className="p-6 flex gap-4">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Independent benchmark, not an official GL Assessment</p>
            <p className="text-sm text-blue-800 leading-relaxed">
              Our practice score on the 121 scale is designed to help parents understand how their child is performing within our practice tests relative to the 121 qualifying threshold.
            </p>
            <p className="text-sm text-blue-800 leading-relaxed mt-2">
              It is not an official Buckinghamshire Secondary Transfer Test 121 score, not a GL Assessment score, and not a prediction or guarantee of your child's final result. Official outcomes are calculated using GL Assessment's own age-standardised scoring process, which independent practice providers cannot replicate.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">The Scoring Scale</h2>
        <p className="text-muted-foreground leading-relaxed">
          GL Assessment standardised scores run from approximately <strong>69 to 141</strong>, with 100 representing the population average. We use this same scale for our indicative practice score so Bucks parents can compare against the familiar <strong>121</strong> qualifying threshold.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Your indicative score is calculated in two steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
          <li>
            <strong className="text-primary">Section accuracy</strong> — correct ÷ attempted in each of the four GL domains (Verbal Reasoning 35%, Mathematics 25%, Non-Verbal Reasoning 25%, English Comprehension 15%).
          </li>
          <li>
            <strong className="text-primary">Map to the 69–141 scale</strong> — weighted accuracy is converted with a floor of 69 (the GL minimum), not zero.
          </li>
        </ol>
        <div className="bg-slate-50 border border-border rounded-xl p-6 font-mono text-sm text-center space-y-2">
          <p className="text-primary font-bold text-lg">Indicative score = 69 + (weighted accuracy × 72)</p>
          <p className="text-muted-foreground text-xs font-sans">Rounded to the nearest whole number · 100% accuracy → 141 · 0% accuracy → 69</p>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Example: <strong>1 of 12 correct (8%)</strong> → indicative score <strong>75</strong> (not 8 or 12). The scale starts at 69, so a very low practice score still appears well below 121 — in this case <strong>46 points</strong> under the benchmark.
        </p>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Example: <strong>43 of 50 correct (86%)</strong> → weighted accuracy ≈ 86% → indicative score <strong>round(69 + 0.86 × 72) = 121</strong>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">The 121 Benchmark</h2>
        <p className="text-muted-foreground leading-relaxed">
          121 is the publicly stated qualifying threshold used by Buckinghamshire's grammar schools for the Secondary Transfer Test. Achieving a standardised score of 121 or above is required to be considered for a grammar school place — though individual schools may apply additional criteria based on oversubscription.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We use 121 as our benchmark because it is the most meaningful reference point for Buckinghamshire families. Every dial, gap calculation, and readiness band on the platform is anchored to this number.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-amber-900 font-medium">
            <strong>Important note on age standardisation:</strong> The official GL Assessment adjusts raw scores based on a child's exact date of birth. A September-born child needs fewer raw marks than an August-born child to reach the same standardised score of 121. Our model does not currently apply this adjustment. Summer-born children may wish to target a slightly higher raw score as a buffer.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-primary font-serif">Readiness Bands</h2>
        <div className="space-y-4">
          {bands.map((band) => (
            <Card key={band.label} className={`border ${band.color.split(" ")[1]}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${band.color}`}>{band.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{band.range}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${band.barColor}`} style={{ width: band.barWidth }} />
                </div>
                <p className="text-sm text-muted-foreground">{band.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">The Four Sections</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our readiness checks and mocks cover the same four areas as the Buckinghamshire Secondary Transfer Test. Each section score is shown separately on your results page so you can identify where to focus.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Card key={s.name} className="border-border/60">
              <CardContent className="p-5">
                <h3 className="font-semibold text-primary mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.weight}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">Pace Analysis</h2>
        <p className="text-muted-foreground leading-relaxed">
          Alongside accuracy, we track how long your child spends per question in each section. The GL Assessment is strictly timed, and many children who know the content still underperform because they run out of time.
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2.5 border border-border/60">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">English Comprehension: ~120 s/question (passage + question)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2.5 border border-border/60">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Maths: ~40 s/question</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2.5 border border-border/60">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">VR &amp; NVR: ~35–38 s/question</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">What the Forecast Cannot Tell You</h2>
        <div className="space-y-3">
          {[
            "Your child's official GL Assessment result — GL uses proprietary norm tables updated each cohort year.",
            "The exact pass mark for any individual school — grammar schools set their own admissions criteria beyond the 121 threshold.",
            "The effect of exam-day nerves, unfamiliar question wording, or timing pressure in a live test environment.",
            "Whether your child will secure a place — grammar schools in Buckinghamshire are heavily oversubscribed and distance/catchment areas also apply.",
          ].map((point, i) => (
            <div key={i} className="flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary font-serif">What the Forecast Can Tell You</h2>
        <div className="space-y-3">
          {[
            "Which of the four sections needs the most targeted practice right now.",
            "Whether your child's pace puts them at risk of timing out in any section.",
            "How their readiness is trending across multiple attempts over time.",
            "Where question-type weaknesses sit within each section (e.g. inference vs vocabulary in comprehension).",
          ].map((point, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/60">
        <Button asChild>
          <Link href="/free-diagnostic">
            Take a Readiness Check <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/bucks-gl-alignment">GL-Style Alignment</Link>
        </Button>
      </div>
    </div>
  );
}

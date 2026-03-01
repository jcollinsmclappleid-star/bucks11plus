import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";

export default function Practice() {
  const sections = [
    {
      name: "Verbal Reasoning",
      drills: [
        { name: "Verbal Logic", difficulty: "Hard", questions: 15, locked: false },
        { name: "Word Sequences", difficulty: "Medium", questions: 20, locked: true },
        { name: "Vocabulary Relationships", difficulty: "Medium", questions: 20, locked: true },
      ]
    },
    {
      name: "Non-Verbal Reasoning",
      drills: [
        { name: "Pattern Sequences", difficulty: "Medium", questions: 15, locked: false },
        { name: "Shape Transformation", difficulty: "Hard", questions: 15, locked: true },
      ]
    },
    {
      name: "Maths",
      drills: [
        { name: "Multi-step Word Problems", difficulty: "Hard", questions: 10, locked: false },
        { name: "Fractions & Decimals", difficulty: "Medium", questions: 20, locked: true },
        { name: "Data Interpretation", difficulty: "Easy", questions: 25, locked: true },
      ]
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo 
        title="Practice Bank | 11+ Standard" 
        description="Targeted 11+ practice drills tailored to close your child's specific gaps to the 121 benchmark." 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-serif">Practice Bank</h1>
          <p className="text-muted-foreground mt-2">Targeted drills to close your specific gaps to 121.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Lock className="h-4 w-4" /> Unlock All Drills
        </Button>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-primary" /> {section.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.drills.map((drill, i) => (
                <Card key={i} className={`relative overflow-hidden ${drill.locked ? 'bg-slate-50/50' : 'hover:border-primary/50 transition-colors'}`}>
                  {drill.locked && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={drill.difficulty === 'Hard' ? 'destructive' : drill.difficulty === 'Medium' ? 'default' : 'secondary'} className={drill.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : drill.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                        {drill.difficulty}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{drill.questions} Qs</span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{drill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant={drill.locked ? 'outline' : 'default'} className="w-full mt-4 bg-primary" disabled={drill.locked}>
                      {drill.locked ? 'Locked' : <><PlayCircle className="mr-2 h-4 w-4" /> Start Drill</>}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
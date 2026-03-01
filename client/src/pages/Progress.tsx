import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Seo } from "../components/shared/Seo";

const data = [
  { date: 'Week 1', score: 105, target: 121 },
  { date: 'Week 2', score: 108, target: 121 },
  { date: 'Week 3', score: 110, target: 121 },
  { date: 'Week 4', score: 114, target: 121 },
];

export default function Progress() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Seo title="Progress Trends | 11+ Standard" description="Track your child's 11+ readiness progress over time." />
      
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Progress Trends</h1>
        <p className="text-muted-foreground mt-2">Historical forecast tracking to monitor the closing gap.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Forecast Trajectory</CardTitle>
            <CardDescription>Estimated standardized score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis domain={[90, 130]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine y={121} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: '121 Standard', fill: '#d97706', fontSize: 12, fontWeight: 600 }} />
                  <Line type="monotone" dataKey="score" stroke="#1e293b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-primary mb-2">
                <TrendingUp className="h-5 w-5" />
                <h3 className="font-bold text-lg">Velocity</h3>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">+9 <span className="text-sm font-normal text-muted-foreground">points</span></p>
              <p className="text-sm text-muted-foreground">Improvement over last 4 weeks. Excellent trajectory.</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/60 bg-blue-50/50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-blue-800 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-bold text-lg">Insight</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                At the current rate of improvement (+2.25 pts/week), the 121 benchmark will be reached in approximately <strong>3.5 weeks</strong>. Maintain current practice volume.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
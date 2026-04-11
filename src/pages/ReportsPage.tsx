import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart3, Download, FileText, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", completed: 24, delayed: 3 }, { month: "Feb", completed: 28, delayed: 2 },
  { month: "Mar", completed: 32, delayed: 4 }, { month: "Apr", completed: 26, delayed: 1 },
  { month: "May", completed: 35, delayed: 3 }, { month: "Jun", completed: 38, delayed: 2 },
];

const performanceData = [
  { name: "Engineering", score: 92 }, { name: "Design", score: 88 },
  { name: "Marketing", score: 78 }, { name: "Sales", score: 85 },
  { name: "DevOps", score: 95 },
];

const COLORS = ["hsl(234,85%,60%)", "hsl(170,70%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,56%)", "hsl(280,65%,55%)"];

const ReportsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Reports & Analytics" description="Detailed performance and project analytics" actions={<Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Export</Button>} />

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "Total Projects", value: "142", icon: FileText },
        { label: "Completion Rate", value: "91%", icon: TrendingUp },
        { label: "Active Teams", value: "14", icon: Users },
        { label: "Avg Delivery Time", value: "18 days", icon: BarChart3 },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
          <p className="text-xl font-display font-bold">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Monthly Project Completion</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
            <Bar dataKey="completed" fill="hsl(234,85%,60%)" radius={[4,4,0,0]} />
            <Bar dataKey="delayed" fill="hsl(0,72%,56%)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Department Performance</h3>
        <div className="space-y-4 mt-4">
          {performanceData.map((d, i) => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-xs"><span>{d.name}</span><span className="font-medium">{d.score}%</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, backgroundColor: COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ReportsPage;

import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, FileText, TrendingUp, Users, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const productivityTrend = [
  { month: "Jan", score: 78 }, { month: "Feb", score: 82 }, { month: "Mar", score: 79 },
  { month: "Apr", score: 85 }, { month: "May", score: 88 }, { month: "Jun", score: 91 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--info))"];

const ReportsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Reporting Suite"
      description="Detailed performance analytics and exportable reports"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1"><Calendar className="h-3.5 w-3.5" /> Date Range</Button>
          <Button size="sm" className="text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export All</Button>
        </div>
      }
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Total Projects", value: "142", icon: FileText, color: "text-primary" },
        { label: "Completion Rate", value: "91%", icon: TrendingUp, color: "text-success" },
        { label: "Active Teams", value: "14", icon: Users, color: "text-accent" },
        { label: "Avg Delivery", value: "18 days", icon: BarChart3, color: "text-info" },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>

    <Tabs defaultValue="projects" className="space-y-4">
      <TabsList>
        <TabsTrigger value="projects" className="text-xs">Project Reports</TabsTrigger>
        <TabsTrigger value="performance" className="text-xs">Department Performance</TabsTrigger>
        <TabsTrigger value="productivity" className="text-xs">Productivity Trend</TabsTrigger>
      </TabsList>

      <TabsContent value="projects">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Monthly Project Completion</h3>
            <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1"><Download className="h-3 w-3" /> CSV</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
              <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[6,6,0,0]} name="Completed" />
              <Bar dataKey="delayed" fill="hsl(var(--destructive))" radius={[6,6,0,0]} name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="performance">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Department Performance Scores</h3>
          <div className="space-y-4">
            {performanceData.map((d, i) => (
              <div key={d.name} className="space-y-1.5">
                <div className="flex justify-between text-xs"><span className="font-medium">{d.name}</span><span className="font-bold">{d.score}%</span></div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.score}%`, backgroundColor: COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="productivity">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Organization Productivity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productivityTrend}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#prodGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default ReportsPage;

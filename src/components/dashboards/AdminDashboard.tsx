import { Users, FolderKanban, CheckSquare, AlertTriangle, TrendingUp, Building2, Activity, DollarSign, Target, Sparkles, Clock, Zap } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, RadialBarChart, RadialBar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectTrends = [
  { month: "Jan", completed: 12, active: 8, delayed: 2 },
  { month: "Feb", completed: 15, active: 10, delayed: 1 },
  { month: "Mar", completed: 18, active: 7, delayed: 3 },
  { month: "Apr", completed: 14, active: 12, delayed: 2 },
  { month: "May", completed: 20, active: 9, delayed: 1 },
  { month: "Jun", completed: 22, active: 11, delayed: 4 },
];

const deptData = [
  { name: "Engineering", value: 45 },
  { name: "Design", value: 20 },
  { name: "Marketing", value: 18 },
  { name: "Sales", value: 12 },
  { name: "HR", value: 5 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--info))"];

const revenueData = [
  { month: "Jan", revenue: 45000 }, { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 }, { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 }, { month: "Jun", revenue: 67000 },
];

const recentActivity = [
  { user: "Sarah Chen", action: "created project", target: "Q3 Marketing Campaign", time: "2m ago", type: "project" },
  { user: "James Wilson", action: "completed task", target: "API Integration", time: "15m ago", type: "task" },
  { user: "Emily Davis", action: "submitted timesheet", target: "Week 24", time: "1h ago", type: "time" },
  { user: "Mike Johnson", action: "approved task", target: "UI Redesign", time: "2h ago", type: "approval" },
  { user: "Lisa Wang", action: "joined team", target: "Product Team", time: "3h ago", type: "team" },
  { user: "David Kim", action: "flagged risk", target: "CRM Integration", time: "4h ago", type: "risk" },
];

const typeColors: Record<string, string> = {
  project: "bg-primary/10 text-primary", task: "bg-success/10 text-success",
  time: "bg-info/10 text-info", approval: "bg-warning/10 text-warning",
  team: "bg-accent/10 text-accent", risk: "bg-destructive/10 text-destructive",
};

const topPerformers = [
  { name: "Mike Chen", score: 98, tasks: 24, dept: "Engineering" },
  { name: "Emily Davis", score: 95, tasks: 21, dept: "Engineering" },
  { name: "Tom Harris", score: 93, tasks: 19, dept: "QA" },
  { name: "Lisa Wang", score: 91, tasks: 17, dept: "Data" },
];

const healthMetrics = [
  { name: "On Track", value: 68, fill: "hsl(var(--success))" },
  { name: "At Risk", value: 22, fill: "hsl(var(--warning))" },
  { name: "Delayed", value: 10, fill: "hsl(var(--destructive))" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Real-time organizational insights and system health"
        badge={<Badge className="bg-success/10 text-success border-success/20 text-[10px]">All Systems Operational</Badge>}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1"><Sparkles className="h-3.5 w-3.5" /> AI Summary</Button>
            <Button size="sm" className="text-xs gap-1"><TrendingUp className="h-3.5 w-3.5" /> Full Report</Button>
          </div>
        }
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total Workforce" value="248" change="+12 this month" changeType="positive" trend={[3,5,4,7,6,8,12]} />
        <StatCard icon={FolderKanban} title="Active Projects" value="34" change="+5 from last month" changeType="positive" trend={[8,12,10,15,14,18,22]} />
        <StatCard icon={CheckSquare} title="Task Completion" value="92%" change="+3% vs last quarter" changeType="positive" trend={[85,87,89,88,91,90,92]} />
        <StatCard icon={DollarSign} title="Budget Utilized" value="$328K" change="72% of total" changeType="neutral" iconColor="bg-warning/10" trend={[40,65,120,180,250,290,328]} />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Project Delivery Trends</h3>
            <Tabs defaultValue="6m" className="h-7">
              <TabsList className="h-7 text-xs">
                <TabsTrigger value="1m" className="h-6 text-[10px] px-2">1M</TabsTrigger>
                <TabsTrigger value="3m" className="h-6 text-[10px] px-2">3M</TabsTrigger>
                <TabsTrigger value="6m" className="h-6 text-[10px] px-2">6M</TabsTrigger>
                <TabsTrigger value="1y" className="h-6 text-[10px] px-2">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={projectTrends}>
              <defs>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--card))" }} />
              <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fill="url(#completedGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="active" stroke="hsl(var(--accent))" fill="url(#activeGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Project Health</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={healthMetrics} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                  {healthMetrics.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {healthMetrics.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.fill }} />
                  <span className="text-muted-foreground">{m.name}</span>
                </div>
                <span className="font-bold">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Live Activity Feed</h3>
            <Button variant="ghost" size="sm" className="text-xs h-7">View All</Button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${typeColors[a.type]}`}>
                  {a.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{a.user}</span>
                  <span className="text-muted-foreground"> {a.action} </span>
                  <span className="font-medium text-primary">{a.target}</span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Top Performers</h3>
            <Badge variant="outline" className="text-[10px]">This Month</Badge>
          </div>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-lg font-display font-bold text-muted-foreground w-6">#{i + 1}</span>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.dept} · {p.tasks} tasks</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{p.score}</p>
                  <p className="text-[10px] text-muted-foreground">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Department Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {deptData.map((d, i) => (
            <div key={d.name} className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="h-10 w-10 mx-auto rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110" style={{ backgroundColor: `${COLORS[i]}20` }}>
                <Building2 className="h-5 w-5" style={{ color: COLORS[i] }} />
              </div>
              <p className="text-sm font-semibold">{d.name}</p>
              <p className="text-xl font-display font-bold mt-1">{d.value}%</p>
              <p className="text-[10px] text-muted-foreground">utilization</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

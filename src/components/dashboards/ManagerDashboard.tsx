import { FolderKanban, CheckSquare, Users, Clock, AlertTriangle, TrendingUp, Zap, Target, Sparkles, Calendar } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teamVelocity = [
  { sprint: "S1", planned: 42, completed: 38 }, { sprint: "S2", planned: 45, completed: 44 },
  { sprint: "S3", planned: 40, completed: 35 }, { sprint: "S4", planned: 48, completed: 46 },
  { sprint: "S5", planned: 50, completed: 47 },
];

const teamSkills = [
  { skill: "Frontend", A: 90, max: 100 }, { skill: "Backend", A: 85, max: 100 },
  { skill: "DevOps", A: 70, max: 100 }, { skill: "Testing", A: 80, max: 100 },
  { skill: "Design", A: 75, max: 100 }, { skill: "Data", A: 65, max: 100 },
];

const projects = [
  { name: "E-Commerce Platform", progress: 78, status: "On Track", deadline: "Jul 15", priority: "High", risk: "Low", team: 5, budget: "$45K" },
  { name: "Mobile App v3.0", progress: 45, status: "At Risk", deadline: "Aug 01", priority: "Critical", risk: "High", team: 4, budget: "$62K" },
  { name: "Data Pipeline", progress: 92, status: "On Track", deadline: "Jun 30", priority: "Medium", risk: "Low", team: 3, budget: "$28K" },
  { name: "CRM Integration", progress: 30, status: "Delayed", deadline: "Jul 20", priority: "High", risk: "Critical", team: 4, budget: "$35K" },
];

const pendingApprovals = [
  { task: "Homepage Redesign", employee: "James Wilson", submitted: "2h ago", priority: "High" },
  { task: "API Documentation", employee: "Emily Davis", submitted: "4h ago", priority: "Medium" },
  { task: "Unit Tests - Auth", employee: "Mike Chen", submitted: "1d ago", priority: "Critical" },
  { task: "Mobile Onboarding", employee: "Lisa Wang", submitted: "1d ago", priority: "High" },
];

const upcomingDeadlines = [
  { project: "Data Pipeline", task: "Final deployment", date: "Jun 30", daysLeft: 3 },
  { project: "E-Commerce", task: "Payment testing", date: "Jul 05", daysLeft: 8 },
  { project: "Mobile App", task: "Beta release", date: "Jul 10", daysLeft: 13 },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-success/10 text-success", "At Risk": "bg-warning/10 text-warning", "Delayed": "bg-destructive/10 text-destructive",
};
const riskColors: Record<string, string> = {
  Low: "text-success", Medium: "text-warning", High: "text-destructive", Critical: "text-destructive",
};
const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Dashboard"
        description="Your team's delivery metrics and project health"
        badge={<Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">4 Pending Approvals</Badge>}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1"><Sparkles className="h-3.5 w-3.5" /> Weekly Summary</Button>
            <Button size="sm" className="text-xs gap-1"><Zap className="h-3.5 w-3.5" /> Sprint Planning</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} title="Active Projects" value={8} change="2 due this week" changeType="neutral" trend={[5,6,7,6,8,7,8]} />
        <StatCard icon={CheckSquare} title="Sprint Velocity" value="47 pts" change="+12% vs last sprint" changeType="positive" trend={[38,44,35,46,47]} />
        <StatCard icon={Users} title="Team Utilization" value="87%" change="2 at capacity" changeType="neutral" trend={[78,82,85,83,87]} />
        <StatCard icon={AlertTriangle} title="Risk Items" value={3} change="1 critical" changeType="negative" iconColor="bg-destructive/10" trend={[1,2,1,3,2,3]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Velocity Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Sprint Velocity</h3>
            <Badge variant="outline" className="text-[10px]">Last 5 Sprints</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={teamVelocity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--card))" }} />
              <Bar dataKey="planned" fill="hsl(var(--muted))" radius={[4,4,0,0]} name="Planned" />
              <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4,4,0,0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-display font-bold text-sm ${d.daysLeft <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  {d.daysLeft}d
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{d.task}</p>
                  <p className="text-[10px] text-muted-foreground">{d.project} · {d.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approvals + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Approval Workbench</h3>
            <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">{pendingApprovals.length} pending</Badge>
          </div>
          <div className="space-y-2">
            {pendingApprovals.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{a.task}</p>
                    <Badge variant="outline" className={`text-[9px] ${priorityColors[a.priority]}`}>{a.priority}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">by {a.employee} · {a.submitted}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="px-2.5 py-1 text-[10px] rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors font-semibold">✓</button>
                  <button className="px-2.5 py-1 text-[10px] rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-semibold">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Project Portfolio</h3>
            <Button variant="ghost" size="sm" className="text-xs h-7">View All</Button>
          </div>
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{p.name}</p>
                    <Badge variant="outline" className={`text-[9px] ${statusColors[p.status]}`}>{p.status}</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{p.budget}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1 h-1.5" />
                  <span className="text-xs font-semibold w-8">{p.progress}%</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>👥 {p.team}</span>
                  <span>📅 {p.deadline}</span>
                  <span className={riskColors[p.risk]}>⚠ {p.risk} risk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

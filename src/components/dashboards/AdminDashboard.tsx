import { Users, FolderKanban, CheckSquare, AlertTriangle, TrendingUp, Building2, ShieldCheck, Activity } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const projectData = [
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

const COLORS = ["hsl(234,85%,60%)", "hsl(170,70%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,56%)", "hsl(280,65%,55%)"];

const recentActivity = [
  { user: "Sarah Chen", action: "created project", target: "Q3 Marketing Campaign", time: "2m ago" },
  { user: "James Wilson", action: "completed task", target: "API Integration", time: "15m ago" },
  { user: "Emily Davis", action: "submitted timesheet", target: "Week 24", time: "1h ago" },
  { user: "Mike Johnson", action: "approved task", target: "UI Redesign", time: "2h ago" },
  { user: "Lisa Wang", action: "joined team", target: "Product Team", time: "3h ago" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Company-wide overview and system health" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total Users" value={248} change="+12 this month" changeType="positive" />
        <StatCard icon={FolderKanban} title="Active Projects" value={34} change="+5 from last month" changeType="positive" />
        <StatCard icon={CheckSquare} title="Tasks Completed" value="1,284" change="92% completion rate" changeType="positive" />
        <StatCard icon={AlertTriangle} title="Delayed Projects" value={3} change="-2 from last month" changeType="positive" iconColor="bg-destructive/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Project Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,14%,89%)", fontSize: 12 }} />
              <Bar dataKey="completed" fill="hsl(234,85%,60%)" radius={[4,4,0,0]} />
              <Bar dataKey="active" fill="hsl(170,70%,42%)" radius={[4,4,0,0]} />
              <Bar dataKey="delayed" fill="hsl(0,72%,56%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">By Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-border/50 last:border-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium shrink-0">
                {a.user.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium">{a.user}</span>
                <span className="text-muted-foreground"> {a.action} </span>
                <span className="font-medium">{a.target}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

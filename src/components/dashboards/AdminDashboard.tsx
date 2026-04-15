import { Users, FolderKanban, CheckSquare, AlertTriangle, TrendingUp, Building2, ShieldCheck, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const recentTasks = [
  { id: "T-1284", title: "API Authentication", member: "Sarah Chen", priority: "High", status: "In Progress", date: "Today" },
  { id: "T-1285", title: "UI Redesign", member: "James Wilson", priority: "Medium", status: "Pending", date: "Today" },
  { id: "T-1286", title: "DB Schema Update", member: "Emily Davis", priority: "Critical", status: "Review", date: "Yesterday" },
  { id: "T-1287", title: "Unit Testing", member: "Mike Johnson", priority: "Low", status: "Completed", date: "Yesterday" },
];

const getPriorityColor = (p: string) => {
  switch (p) {
    case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
    case "High": return "bg-warning/10 text-warning border-warning/20";
    case "Medium": return "bg-info/10 text-info border-info/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Admin Dashboard" description="Overview of your workspace performance and system health." />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium">Download Report</Button>
          <Button size="sm" className="h-9 px-4 font-medium shadow-lg shadow-primary/20">System Status</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-0.5 flex gap-1 items-center">
              <TrendingUp className="h-3 w-3" /> 12%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">2,482</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <FolderKanban className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-0.5 flex gap-1 items-center">
              <TrendingUp className="h-3 w-3" /> 5.2%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">34</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center text-info">
              <CheckSquare className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-0.5 flex gap-1 items-center">
              <TrendingUp className="h-3 w-3" /> 8%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tasks Completed</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">1,284</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 py-0.5 flex gap-1 items-center">
              <ArrowUpRight className="h-3 w-3" /> 2%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Delayed Tasks</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">17</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-base font-semibold">Workspace Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Showing task completion trends for the last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-[10px] text-muted-foreground">Active</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: 12 }} 
                />
                <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorComp)" strokeWidth={2} />
                <Area type="monotone" dataKey="active" stroke="hsl(var(--accent))" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Tasks</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Overview of the latest updates in your workspace</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs font-medium h-8">View All Tasks</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-muted/30 border-y border-border/50">
                  <th className="px-6 py-3 font-medium text-muted-foreground uppercase text-[10px]">Title</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground uppercase text-[10px]">Assignee</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground uppercase text-[10px]">Priority</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground uppercase text-[10px]">Status</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{t.title}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{t.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                            {t.member.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{t.member}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${t.status === 'Completed' ? 'bg-success' : 'bg-warning'}`} />
                        <span className="text-xs font-medium">{t.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

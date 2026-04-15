import { FolderKanban, CheckSquare, Users, Clock, AlertTriangle, TrendingUp, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teamPerformance = [
  { name: "Mon", tasks: 18 }, { name: "Tue", tasks: 24 }, { name: "Wed", tasks: 20 },
  { name: "Thu", tasks: 28 }, { name: "Fri", tasks: 22 },
];

const projects = [
  { name: "E-Commerce Platform", progress: 78, status: "On Track", deadline: "Jul 15", priority: "High" },
  { name: "Mobile App v3.0", progress: 45, status: "At Risk", deadline: "Aug 01", priority: "Critical" },
  { name: "Data Pipeline", progress: 92, status: "On Track", deadline: "Jun 30", priority: "Medium" },
  { name: "CRM Integration", progress: 30, status: "Delayed", deadline: "Jul 20", priority: "High" },
];

const pendingApprovals = [
  { id: 1, task: "Homepage Redesign", employee: "James Wilson", submitted: "2h ago", avatar: "JW" },
  { id: 2, task: "API Documentation", employee: "Emily Davis", submitted: "4h ago", avatar: "ED" },
  { id: 3, task: "Unit Tests - Auth", employee: "Mike Chen", submitted: "1d ago", avatar: "MC" },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-success/10 text-success border-success/20",
  "At Risk": "bg-warning/10 text-warning border-warning/20",
  "Delayed": "bg-destructive/10 text-destructive border-destructive/20",
};

const priorityColors: Record<string, string> = {
  "Low": "bg-muted text-muted-foreground",
  "Medium": "bg-info/10 text-info",
  "High": "bg-warning/10 text-warning",
  "Critical": "bg-destructive/10 text-destructive",
};

export function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Manager Dashboard" description="Track team productivity and project milestones." />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium">Weekly Summary</Button>
          <Button size="sm" className="h-9 px-4 font-medium shadow-lg shadow-primary/20">New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">8</p>
            <p className="text-[10px] text-muted-foreground mt-1">2 due this week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <CheckSquare className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-0.5">
              +12
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tasks This Week</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">47</p>
            <p className="text-[10px] text-muted-foreground mt-1">Completion up 12%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center text-info">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">14</p>
            <p className="text-[10px] text-muted-foreground mt-1">2 on vacation</p>
          </div>
        </div>

        <div className="stat-card border-warning/20">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
              <Clock className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 py-0.5">
              Urgent
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Approvals</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">3</p>
            <p className="text-[10px] text-muted-foreground mt-1">Needs attention</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-7">
            <div>
              <CardTitle className="text-base font-semibold">Team Productivity</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Tasks completed by the team per day</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: 12 }} 
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Review and approve tasks from your team</p>
          </CardHeader>
          <CardContent className="px-1">
            <div className="space-y-1">
              {pendingApprovals.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{a.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{a.task}</p>
                      <p className="text-xs text-muted-foreground">by {a.employee} • {a.submitted}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:bg-success/10">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs font-medium text-primary py-2 h-auto hover:bg-primary/5">
              View All Approvals
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Project Status</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Current progress and health of active projects</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">View Portfolios</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((p, i) => (
              <div key={i} className="group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{p.name}</h4>
                    <Badge variant="outline" className={`text-[10px] font-semibold ${priorityColors[p.priority]}`}>{p.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[p.status]}`}>{p.status}</Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {p.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${p.status === 'Delayed' ? 'bg-destructive' : p.status === 'At Risk' ? 'bg-warning' : 'bg-primary'}`} 
                      style={{ width: `${p.progress}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold w-10 text-right">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

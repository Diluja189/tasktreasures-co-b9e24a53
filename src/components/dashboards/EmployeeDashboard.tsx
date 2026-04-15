import { CheckSquare, Clock, FolderKanban, TrendingUp, AlertCircle, CalendarDays, MoreHorizontal, Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const weeklyProgress = [
  { day: "Mon", hours: 7.5 }, { day: "Tue", hours: 8.2 }, { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 8.5 }, { day: "Fri", hours: 7.0 },
];

const myTasks = [
  { title: "Implement auth module", project: "E-Commerce Platform", priority: "High", progress: 65, dueDate: "Jun 28", status: "In Progress" },
  { title: "Write API tests", project: "Data Pipeline", priority: "Medium", progress: 30, dueDate: "Jun 30", status: "In Progress" },
  { title: "Design review feedback", project: "Mobile App v3.0", priority: "Low", progress: 0, dueDate: "Jul 02", status: "Not Started" },
  { title: "DB migration script", project: "CRM Integration", priority: "Critical", progress: 90, dueDate: "Jun 26", status: "In Review" },
];

const notifications = [
  { id: 1, message: "Task 'DB migration script' approved by Sarah Chen", time: "10m ago", type: "success" },
  { id: 2, message: "New task assigned: Design review feedback", time: "1h ago", type: "info" },
  { id: 3, message: "Deadline approaching: Write API tests (Jun 30)", time: "2h ago", type: "warning" },
];

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};
const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground", "In Progress": "bg-primary/10 text-primary",
  "In Review": "bg-warning/10 text-warning", "Completed": "bg-success/10 text-success",
};

export function EmployeeDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="My Workspace" description="Manage your daily tasks and track your work progress." />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium">Log Hours</Button>
          <Button size="sm" className="h-9 px-4 font-medium shadow-lg shadow-primary/20">Mark Attendance</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CheckSquare className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 py-0.5">
              Current
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">My Tasks</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">12</p>
            <p className="text-[10px] text-muted-foreground mt-1">4 due this week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Hours Logged</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">38.5</p>
            <p className="text-[10px] text-muted-foreground mt-1">On track for target</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center text-info">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">3</p>
            <p className="text-[10px] text-muted-foreground mt-1">1 new assigned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <TrendingUp className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 py-0.5">
              +5%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
            <p className="text-2xl font-bold tracking-tight mt-1">94%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Excellent performance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-7">
            <div>
              <CardTitle className="text-base font-semibold">Activity Hours</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Your logged hours for the current week</p>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyProgress}>
                <defs>
                   <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: 12 }} 
                />
                <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Updates</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Bell className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-1">
            <div className="space-y-1">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-default">
                  <div className="flex gap-3">
                    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      n.type === 'success' ? 'bg-success' : n.type === 'warning' ? 'bg-warning' : 'bg-info'
                    }`} />
                    <div>
                      <p className="text-[13px] leading-snug group-hover:text-foreground transition-colors">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold tracking-wider font-mono">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs font-medium text-primary py-2 h-auto hover:bg-primary/5">
              See All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">My Active Tasks</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">A list of all your assigned and active tasks</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">Go to Tasks Page</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {myTasks.map((t, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/20 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{t.title}</h4>
                    <Badge variant="outline" className={`text-[10px] font-bold ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                    <FolderKanban className="h-3 w-3" /> {t.project}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={t.progress} className="flex-1 h-1.5" />
                    <span className="text-xs font-mono font-bold w-10 text-right">{t.progress}%</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 sm:min-w-[120px] shrink-0">
                  <Badge variant="outline" className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status}</Badge>
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {t.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

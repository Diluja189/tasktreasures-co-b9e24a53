import { CheckSquare, Clock, FolderKanban, TrendingUp, AlertCircle, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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
  { message: "Task 'DB migration script' approved by Sarah Chen", time: "10m ago", type: "success" },
  { message: "New task assigned: Design review feedback", time: "1h ago", type: "info" },
  { message: "Deadline approaching: Write API tests (Jun 30)", time: "2h ago", type: "warning" },
];

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};
const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground", "In Progress": "bg-primary/10 text-primary",
  "In Review": "bg-warning/10 text-warning", "Completed": "bg-success/10 text-success",
};
const notifColors: Record<string, string> = {
  success: "bg-success", info: "bg-info", warning: "bg-warning",
};

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Dashboard" description="Your work overview for this week" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} title="Tasks Assigned" value={12} change="4 due this week" changeType="neutral" />
        <StatCard icon={Clock} title="Hours Logged" value="38.0" change="On track" changeType="positive" />
        <StatCard icon={FolderKanban} title="Active Projects" value={3} change="1 new this week" changeType="neutral" />
        <StatCard icon={TrendingUp} title="Completion Rate" value="87%" change="+5% vs last week" changeType="positive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Hours This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(234,85%,60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(234,85%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="hsl(234,85%,60%)" fill="url(#hoursGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${notifColors[n.type]}`} />
                <div>
                  <p className="text-xs">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">My Tasks</h3>
        <div className="space-y-3">
          {myTasks.map((t, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <Badge variant="outline" className={`text-[10px] ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{t.project}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={t.progress} className="flex-1 h-1.5" />
                  <span className="text-xs font-medium w-8">{t.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-[10px] ${statusColors[t.status]}`}>{t.status}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />{t.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

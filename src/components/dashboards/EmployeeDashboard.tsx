import { CheckSquare, Clock, FolderKanban, TrendingUp, CalendarDays, Sparkles, Target, Award, Zap } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const weeklyProgress = [
  { day: "Mon", hours: 7.5, tasks: 5 }, { day: "Tue", hours: 8.2, tasks: 6 },
  { day: "Wed", hours: 6.8, tasks: 4 }, { day: "Thu", hours: 8.5, tasks: 7 },
  { day: "Fri", hours: 7.0, tasks: 5 },
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
  { message: "Sprint 14 review meeting tomorrow at 10 AM", time: "3h ago", type: "info" },
];

const goals = [
  { name: "Complete React certification", progress: 75 },
  { name: "Ship 3 features this sprint", progress: 67 },
  { name: "Maintain 90%+ quality score", progress: 95 },
];

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};
const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground", "In Progress": "bg-primary/10 text-primary",
  "In Review": "bg-warning/10 text-warning", "Completed": "bg-success/10 text-success",
};
const notifColors: Record<string, string> = { success: "bg-success", info: "bg-info", warning: "bg-warning" };

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Dashboard"
        description="Your productivity snapshot for this week"
        badge={<Badge className="bg-success/10 text-success border-success/20 text-[10px]">12-day streak 🔥</Badge>}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1"><Clock className="h-3.5 w-3.5" /> Log Hours</Button>
            <Button size="sm" className="text-xs gap-1"><Zap className="h-3.5 w-3.5" /> Quick Add Task</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} title="Tasks Assigned" value={12} change="4 due this week" changeType="neutral" trend={[8,10,9,11,12]} />
        <StatCard icon={Clock} title="Hours Logged" value="38.0" change="On track for 40h" changeType="positive" trend={[7.5,8.2,6.8,8.5,7.0]} />
        <StatCard icon={FolderKanban} title="Active Projects" value={3} change="1 new this week" changeType="neutral" />
        <StatCard icon={TrendingUp} title="Productivity" value="87%" change="+5% vs last week" changeType="positive" trend={[78,82,85,83,87]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hours Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">This Week's Activity</h3>
            <Badge variant="outline" className="text-[10px]">38.0 / 40.0 hours</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6,6,0,0]} name="Hours" />
              <Bar dataKey="tasks" fill="hsl(var(--accent))" radius={[6,6,0,0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Panels */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-display font-semibold text-xs mb-3">Recent Notifications</h3>
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="flex gap-2 text-xs py-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${notifColors[n.type]}`} />
                  <div className="min-w-0">
                    <p className="text-[11px] leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-display font-semibold text-xs mb-3 flex items-center gap-1.5"><Target className="h-3 w-3 text-primary" /> My Goals</h3>
            <div className="space-y-2">
              {goals.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]">{g.name}</span>
                    <span className="text-[10px] font-semibold">{g.progress}%</span>
                  </div>
                  <Progress value={g.progress} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm">My Tasks</h3>
          <div className="flex gap-2">
            {["All", "In Progress", "In Review"].map((f) => (
              <Badge key={f} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10 transition-colors">{f}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {myTasks.map((t, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{t.title}</p>
                  <Badge variant="outline" className={`text-[9px] ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{t.project}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={t.progress} className="flex-1 h-1.5" />
                  <span className="text-xs font-semibold w-8">{t.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-[9px] ${statusColors[t.status]}`}>{t.status}</Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
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

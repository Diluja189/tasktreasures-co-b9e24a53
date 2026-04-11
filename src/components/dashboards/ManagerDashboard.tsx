import { FolderKanban, CheckSquare, Users, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  { task: "Homepage Redesign", employee: "James Wilson", submitted: "2h ago" },
  { task: "API Documentation", employee: "Emily Davis", submitted: "4h ago" },
  { task: "Unit Tests - Auth", employee: "Mike Chen", submitted: "1d ago" },
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
    <div className="space-y-6">
      <PageHeader title="Manager Dashboard" description="Your team's project overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} title="Active Projects" value={8} change="2 due this week" changeType="neutral" />
        <StatCard icon={CheckSquare} title="Tasks This Week" value={47} change="+12 vs last week" changeType="positive" />
        <StatCard icon={Users} title="Team Members" value={14} change="2 on leave" changeType="neutral" />
        <StatCard icon={Clock} title="Pending Approvals" value={3} change="Needs attention" changeType="negative" iconColor="bg-warning/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Team Productivity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,14%,89%)", fontSize: 12 }} />
              <Bar dataKey="tasks" fill="hsl(234,85%,60%)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {pendingApprovals.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{a.task}</p>
                  <p className="text-xs text-muted-foreground">by {a.employee} · {a.submitted}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1 text-xs rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors">Approve</button>
                  <button className="px-3 py-1 text-xs rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Project Status</h3>
        <div className="space-y-4">
          {projects.map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <Badge variant="outline" className={`text-[10px] ${priorityColors[p.priority]}`}>{p.priority}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1 h-1.5" />
                  <span className="text-xs font-medium w-8">{p.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-[10px] ${statusColors[p.status]}`}>{p.status}</Badge>
                <span className="text-xs text-muted-foreground">{p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

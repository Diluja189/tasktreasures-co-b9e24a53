import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Gauge, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const teamCapacity = [
  { name: "James W.", allocated: 95, available: 5, projects: 4, status: "Over" },
  { name: "Emily D.", allocated: 72, available: 28, projects: 3, status: "Optimal" },
  { name: "Mike C.", allocated: 88, available: 12, projects: 5, status: "Near" },
  { name: "Lisa W.", allocated: 45, available: 55, projects: 2, status: "Under" },
  { name: "Tom H.", allocated: 80, available: 20, projects: 3, status: "Optimal" },
  { name: "Anna S.", allocated: 60, available: 40, projects: 2, status: "Under" },
];

const weeklyData = [
  { week: "W1", capacity: 85 }, { week: "W2", capacity: 78 },
  { week: "W3", capacity: 92 }, { week: "W4", capacity: 88 },
];

const statusColors: Record<string, string> = {
  Over: "bg-destructive/10 text-destructive", Optimal: "bg-success/10 text-success",
  Near: "bg-warning/10 text-warning", Under: "bg-info/10 text-info",
};

const CapacityPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Capacity Planning"
      description="Monitor team workload and resource allocation"
      actions={<Button size="sm" className="text-xs gap-1"><BarChart3 className="h-3.5 w-3.5" /> Generate Report</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} title="Total Resources" value={24} change="3 on leave" changeType="neutral" />
      <StatCard icon={Gauge} title="Avg Utilization" value="78%" change="+5% vs last week" changeType="positive" />
      <StatCard icon={AlertTriangle} title="Over-allocated" value={3} change="Needs rebalancing" changeType="negative" iconColor="bg-destructive/10" />
      <StatCard icon={TrendingUp} title="Optimal Range" value="70-85%" change="Target utilization" changeType="neutral" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Team Allocation</h3>
        <div className="space-y-3">
          {teamCapacity.map((member) => (
            <div key={member.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{member.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{member.projects} projects</span>
                    <Badge variant="outline" className={`text-[9px] ${statusColors[member.status]}`}>{member.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={member.allocated} className="flex-1 h-2" />
                  <span className="text-xs font-semibold w-10 text-right">{member.allocated}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
            <Bar dataKey="capacity" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <p className="text-[10px] font-semibold text-warning">⚠ Capacity Alert</p>
          <p className="text-[10px] text-muted-foreground mt-1">Week 3 exceeded optimal range. Consider redistributing workload.</p>
        </div>
      </div>
    </div>
  </div>
);

export default CapacityPage;

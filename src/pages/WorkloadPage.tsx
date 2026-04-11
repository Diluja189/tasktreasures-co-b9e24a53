import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Layers, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

const members = [
  { name: "James Wilson", role: "Frontend Dev", allocated: 95, projects: ["E-Commerce", "Mobile App"], status: "Overloaded" },
  { name: "Emily Davis", role: "Backend Dev", allocated: 72, projects: ["Data Pipeline", "E-Commerce"], status: "Balanced" },
  { name: "Mike Chen", role: "Full Stack", allocated: 88, projects: ["CRM", "Mobile App", "E-Commerce"], status: "High" },
  { name: "Lisa Wang", role: "Data Engineer", allocated: 45, projects: ["Data Pipeline"], status: "Available" },
  { name: "Tom Harris", role: "QA Engineer", allocated: 80, projects: ["E-Commerce", "CRM"], status: "Balanced" },
  { name: "Anna Schmidt", role: "Designer", allocated: 60, projects: ["Mobile App", "E-Commerce"], status: "Available" },
];

const barData = members.map(m => ({ name: m.name.split(" ")[0], workload: m.allocated }));

const statusColors: Record<string, string> = {
  Overloaded: "bg-destructive/10 text-destructive", High: "bg-warning/10 text-warning",
  Balanced: "bg-success/10 text-success", Available: "bg-info/10 text-info",
};

const getBarColor = (value: number) => {
  if (value > 90) return "hsl(var(--destructive))";
  if (value > 80) return "hsl(var(--warning))";
  if (value > 60) return "hsl(var(--primary))";
  return "hsl(var(--info))";
};

const WorkloadPage = () => (
  <div className="space-y-6">
    <PageHeader title="Workload Balance" description="Monitor and rebalance team workload distribution" />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} title="Team Size" value={6} change="1 on leave" changeType="neutral" />
      <StatCard icon={Layers} title="Avg Workload" value="73%" change="Balanced" changeType="positive" />
      <StatCard icon={AlertTriangle} title="Overloaded" value={1} change="Needs rebalancing" changeType="negative" iconColor="bg-destructive/10" />
      <StatCard icon={TrendingUp} title="Efficiency" value="91%" change="+3% this week" changeType="positive" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Workload Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={60} />
            <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
            <Bar dataKey="workload" radius={[0, 6, 6, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.workload)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Team Members</h3>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{m.name}</span>
                  <Badge variant="outline" className={`text-[8px] ${statusColors[m.status]}`}>{m.status}</Badge>
                </div>
                <Progress value={m.allocated} className="h-1.5" />
              </div>
              <span className="text-xs font-semibold">{m.allocated}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default WorkloadPage;

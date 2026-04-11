import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Target, Zap, CheckSquare } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const weeklyData = [
  { day: "Mon", tasks: 5, hours: 7.5, score: 88 }, { day: "Tue", tasks: 6, hours: 8.2, score: 92 },
  { day: "Wed", tasks: 4, hours: 6.8, score: 78 }, { day: "Thu", tasks: 7, hours: 8.5, score: 95 },
  { day: "Fri", tasks: 5, hours: 7.0, score: 85 },
];

const monthlyTrend = [
  { week: "W1", score: 82 }, { week: "W2", score: 85 },
  { week: "W3", score: 88 }, { week: "W4", score: 87 },
];

const metrics = [
  { label: "Focus Time", value: "6.2h", target: "7h", progress: 89, color: "text-primary" },
  { label: "Task Completion", value: "92%", target: "95%", progress: 97, color: "text-success" },
  { label: "On-Time Delivery", value: "88%", target: "90%", progress: 98, color: "text-accent" },
  { label: "Code Quality", value: "4.5/5", target: "4.0/5", progress: 100, color: "text-info" },
];

const ProductivityPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Productivity Insights"
      description="Your personal performance analytics"
      badge={<Badge className="bg-success/10 text-success border-success/20 text-[10px]">↑ 8% this week</Badge>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={TrendingUp} title="Productivity Score" value="87" change="+5 vs last week" changeType="positive" trend={[82,85,88,87,87]} />
      <StatCard icon={Clock} title="Focus Hours" value="31.2h" change="6.2h daily avg" changeType="positive" />
      <StatCard icon={Target} title="Goals Met" value="4/5" change="80% hit rate" changeType="positive" />
      <StatCard icon={Zap} title="Streak" value="12 days" change="Personal best!" changeType="positive" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Daily Performance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
            <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tasks" />
            <Bar dataKey="hours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
            <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
            <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#scoreGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" /> Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">{m.label}</span>
              <span className={`text-sm font-display font-bold ${m.color}`}>{m.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${m.progress}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">Target: {m.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductivityPage;

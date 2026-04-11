import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Brain, Zap, Target, Users, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const predictionData = [
  { week: "W1", actual: 82, predicted: 80 }, { week: "W2", actual: 78, predicted: 79 },
  { week: "W3", actual: 85, predicted: 83 }, { week: "W4", actual: null, predicted: 81 },
  { week: "W5", actual: null, predicted: 84 }, { week: "W6", actual: null, predicted: 87 },
];

const insights = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Delay Risk: Mobile App v3.0",
    description: "Based on current velocity (12 pts/sprint) and remaining work (38 pts), this project is at 73% risk of missing the Aug 01 deadline. Consider adding 1-2 resources.",
    confidence: 87,
    action: "View Details",
  },
  {
    type: "success",
    icon: TrendingUp,
    title: "Performance Spike: Engineering Team",
    description: "Engineering team velocity increased 23% over the last 3 sprints. Primary driver: improved CI/CD pipeline reducing deployment time by 40%.",
    confidence: 92,
    action: "See Analysis",
  },
  {
    type: "info",
    icon: Users,
    title: "Smart Assignment Suggestion",
    description: "Mike Chen has 28% available capacity and expertise in React Native. Recommend assigning to Mobile App v3.0 to reduce delay risk.",
    confidence: 78,
    action: "Apply Suggestion",
  },
  {
    type: "neutral",
    icon: Clock,
    title: "Timesheet Anomaly Detected",
    description: "3 team members logged significantly fewer hours than usual this week. This may indicate blockers or scope changes that need attention.",
    confidence: 65,
    action: "Investigate",
  },
];

const weeklyDigest = {
  completedTasks: 47,
  newTasks: 23,
  hoursLogged: 380,
  avgVelocity: 42,
  topContributor: "Mike Chen",
  riskFlags: 2,
};

const typeColors: Record<string, string> = {
  warning: "border-warning/30 bg-warning/5", success: "border-success/30 bg-success/5",
  info: "border-info/30 bg-info/5", neutral: "border-border bg-muted/30",
};

const typeIconColors: Record<string, string> = {
  warning: "bg-warning/10 text-warning", success: "bg-success/10 text-success",
  info: "bg-info/10 text-info", neutral: "bg-muted text-muted-foreground",
};

const AIInsightsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="AI Insights"
      description="Intelligent predictions and smart recommendations"
      badge={<Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Powered</Badge>}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1"><Brain className="h-3.5 w-3.5" /> Retrain Model</Button>
          <Button size="sm" className="text-xs gap-1"><Zap className="h-3.5 w-3.5" /> Generate Report</Button>
        </div>
      }
    />

    {/* Weekly Digest */}
    <div className="glass-card rounded-xl p-5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">AI Weekly Digest</h3>
        <Badge variant="outline" className="text-[9px]">Auto-generated</Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Tasks Completed", value: weeklyDigest.completedTasks, color: "text-success" },
          { label: "New Tasks", value: weeklyDigest.newTasks, color: "text-primary" },
          { label: "Hours Logged", value: weeklyDigest.hoursLogged, color: "text-info" },
          { label: "Avg Velocity", value: `${weeklyDigest.avgVelocity} pts`, color: "text-accent" },
          { label: "Top Contributor", value: weeklyDigest.topContributor, color: "text-primary" },
          { label: "Risk Flags", value: weeklyDigest.riskFlags, color: "text-warning" },
        ].map((item) => (
          <div key={item.label} className="text-center p-3 rounded-lg bg-muted/30">
            <p className={`text-lg font-display font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Prediction Chart */}
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm">Productivity Prediction</h3>
        <Badge variant="outline" className="text-[10px] gap-1"><Target className="h-2.5 w-2.5" /> 89% accuracy</Badge>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={predictionData}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12, background: "hsl(var(--card))" }} />
          <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="url(#actualGrad)" strokeWidth={2} name="Actual" />
          <Area type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" fill="url(#predictedGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Insight Cards */}
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-sm">Smart Insights</h3>
      {insights.map((insight, i) => (
        <div key={i} className={`rounded-xl p-4 border transition-all hover:shadow-md ${typeColors[insight.type]}`}>
          <div className="flex items-start gap-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeIconColors[insight.type]}`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <Badge variant="outline" className="text-[9px]">{insight.confidence}% confidence</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
            <Button variant="outline" size="sm" className="text-[10px] h-7 shrink-0">{insight.action}</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AIInsightsPage;

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, CheckCircle, AlertCircle, Plus } from "lucide-react";

const objectives = [
  {
    title: "Increase Platform Revenue",
    owner: "Alex Richardson",
    progress: 72,
    status: "On Track",
    keyResults: [
      { title: "Launch 3 new features", progress: 100, target: "3/3" },
      { title: "Increase user retention to 85%", progress: 60, target: "78/85%" },
      { title: "Reduce churn rate to < 5%", progress: 55, target: "6.2/5%" },
    ],
  },
  {
    title: "Improve Engineering Velocity",
    owner: "Sarah Chen",
    progress: 85,
    status: "On Track",
    keyResults: [
      { title: "Reduce deployment time by 50%", progress: 90, target: "45/50%" },
      { title: "Achieve 95% test coverage", progress: 80, target: "91/95%" },
      { title: "Zero critical bugs in production", progress: 85, target: "1 remaining" },
    ],
  },
  {
    title: "Scale Team to 50 Engineers",
    owner: "David Kim",
    progress: 40,
    status: "Behind",
    keyResults: [
      { title: "Hire 15 engineers by Q3", progress: 47, target: "7/15" },
      { title: "Complete onboarding program", progress: 30, target: "Draft phase" },
      { title: "Maintain eNPS > 70", progress: 45, target: "62/70" },
    ],
  },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-success/10 text-success", "Behind": "bg-warning/10 text-warning", "At Risk": "bg-destructive/10 text-destructive",
};

const OKRPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="OKR Tracking"
      description="Objectives and Key Results for Q3 2025"
      badge={<Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Q3 2025</Badge>}
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Objective</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Target} title="Active OKRs" value={3} change="Q3 2025" changeType="neutral" />
      <StatCard icon={TrendingUp} title="Avg Progress" value="66%" change="+8% this month" changeType="positive" />
      <StatCard icon={CheckCircle} title="Key Results Hit" value="4/9" change="44% completion" changeType="neutral" />
      <StatCard icon={AlertCircle} title="Behind Schedule" value={1} change="Needs attention" changeType="negative" iconColor="bg-warning/10" />
    </div>

    <div className="space-y-4">
      {objectives.map((obj, i) => (
        <div key={i} className="glass-card rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-display font-semibold text-sm">{obj.title}</h3>
                <Badge variant="outline" className={`text-[9px] ${statusColors[obj.status]}`}>{obj.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Owner: {obj.owner}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-primary">{obj.progress}%</p>
                <p className="text-[10px] text-muted-foreground">overall</p>
              </div>
            </div>
          </div>

          <Progress value={obj.progress} className="h-2 mb-4" />

          <div className="space-y-2">
            {obj.keyResults.map((kr, j) => (
              <div key={j} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${kr.progress >= 80 ? 'bg-success/10 text-success' : kr.progress >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                  {j + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{kr.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={kr.progress} className="flex-1 h-1" />
                    <span className="text-[10px] text-muted-foreground w-16 text-right">{kr.target}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold">{kr.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default OKRPage;

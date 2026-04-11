import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag, CheckCircle, Clock, Plus, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const milestones = [
  { name: "MVP Launch", project: "E-Commerce Platform", date: "Jun 30, 2025", status: "On Track", progress: 85, tasks: 12, completed: 10 },
  { name: "Beta Release", project: "Mobile App v3.0", date: "Jul 15, 2025", status: "At Risk", progress: 55, tasks: 18, completed: 10 },
  { name: "Data Migration Complete", project: "Data Pipeline", date: "Jul 01, 2025", status: "Completed", progress: 100, tasks: 8, completed: 8 },
  { name: "Security Audit Pass", project: "CRM Integration", date: "Jul 20, 2025", status: "Not Started", progress: 0, tasks: 6, completed: 0 },
  { name: "Performance Benchmark", project: "E-Commerce Platform", date: "Aug 01, 2025", status: "On Track", progress: 30, tasks: 10, completed: 3 },
];

const statusColors: Record<string, string> = {
  "On Track": "bg-success/10 text-success", "At Risk": "bg-warning/10 text-warning",
  "Completed": "bg-primary/10 text-primary", "Not Started": "bg-muted text-muted-foreground",
};

const statusIcons: Record<string, string> = {
  "On Track": "🟢", "At Risk": "🟡", "Completed": "✅", "Not Started": "⚪",
};

const MilestonesPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Milestone Planner"
      description="Track project milestones and deliverables"
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Milestone</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Milestones", value: milestones.length, color: "text-foreground" },
        { label: "Completed", value: milestones.filter(m => m.status === "Completed").length, color: "text-success" },
        { label: "On Track", value: milestones.filter(m => m.status === "On Track").length, color: "text-primary" },
        { label: "At Risk", value: milestones.filter(m => m.status === "At Risk").length, color: "text-warning" },
      ].map((stat) => (
        <div key={stat.label} className="stat-card text-center">
          <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Timeline View */}
    <div className="space-y-1">
      {milestones.map((milestone, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${milestone.status === "Completed" ? "bg-success/10" : "bg-muted"}`}>
              {statusIcons[milestone.status]}
            </div>
            {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
          </div>
          <div className="glass-card rounded-xl p-4 flex-1 mb-3 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-sm">{milestone.name}</h4>
                  <Badge variant="outline" className={`text-[9px] ${statusColors[milestone.status]}`}>{milestone.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{milestone.project}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {milestone.date}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={milestone.progress} className="flex-1 h-1.5" />
              <span className="text-xs font-semibold">{milestone.progress}%</span>
              <span className="text-[10px] text-muted-foreground">{milestone.completed}/{milestone.tasks} tasks</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MilestonesPage;

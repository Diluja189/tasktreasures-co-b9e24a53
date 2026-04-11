import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Zap, Flag, CheckCircle, Clock, Calendar, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const sprints = [
  {
    name: "Sprint 14",
    status: "Active",
    dateRange: "Jun 17 - Jun 30",
    totalPoints: 48,
    completedPoints: 32,
    tasks: { total: 18, done: 12, inProgress: 4, todo: 2 },
    team: ["JW", "ED", "MC"],
  },
  {
    name: "Sprint 13",
    status: "Completed",
    dateRange: "Jun 03 - Jun 16",
    totalPoints: 45,
    completedPoints: 44,
    tasks: { total: 16, done: 16, inProgress: 0, todo: 0 },
    team: ["JW", "ED", "MC", "LW"],
  },
  {
    name: "Sprint 12",
    status: "Completed",
    dateRange: "May 20 - Jun 02",
    totalPoints: 42,
    completedPoints: 38,
    tasks: { total: 15, done: 14, inProgress: 0, todo: 1 },
    team: ["JW", "ED", "TH"],
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary border-primary/20", Completed: "bg-success/10 text-success border-success/20",
  Planned: "bg-muted text-muted-foreground",
};

const SprintsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Sprint Tracker"
      description="Manage and monitor sprint progress"
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Sprint</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Zap} title="Current Sprint" value="Sprint 14" change="67% complete" changeType="positive" />
      <StatCard icon={Flag} title="Sprint Points" value="32/48" change="16 remaining" changeType="neutral" />
      <StatCard icon={CheckCircle} title="Velocity Avg" value="43 pts" change="Last 3 sprints" changeType="positive" />
      <StatCard icon={Clock} title="Days Left" value={5} change="Ends Jun 30" changeType="neutral" />
    </div>

    <div className="space-y-4">
      {sprints.map((sprint, i) => (
        <div key={i} className="glass-card rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{sprint.name}</h3>
                  <Badge variant="outline" className={`text-[9px] ${statusColors[sprint.status]}`}>{sprint.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{sprint.dateRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {sprint.team.map((member) => (
                  <div key={member} className="h-7 w-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[9px] font-semibold text-primary">
                    {member}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p className="text-lg font-display font-bold">{sprint.completedPoints}<span className="text-muted-foreground text-sm">/{sprint.totalPoints}</span></p>
                <p className="text-[10px] text-muted-foreground">story points</p>
              </div>
            </div>
          </div>

          <Progress value={(sprint.completedPoints / sprint.totalPoints) * 100} className="h-2 mb-3" />

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> {sprint.tasks.done} Done</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> {sprint.tasks.inProgress} In Progress</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> {sprint.tasks.todo} To Do</span>
            <span className="ml-auto text-muted-foreground">{sprint.tasks.total} total tasks</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SprintsPage;

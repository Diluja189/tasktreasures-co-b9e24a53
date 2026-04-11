import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckSquare, FolderKanban, MessageSquare, Upload, Clock, Users, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const feeds = [
  { icon: FolderKanban, user: "Sarah Chen", action: "created a new project", target: "Q3 Marketing Campaign", time: "2m ago", type: "project" },
  { icon: CheckSquare, user: "James Wilson", action: "completed", target: "API Integration - E-Commerce Platform", time: "15m ago", type: "task" },
  { icon: Star, user: "Sarah Chen", action: "approved task", target: "DB Migration Script by Mike Chen", time: "30m ago", type: "approval" },
  { icon: MessageSquare, user: "Emily Davis", action: "commented on", target: "Design Review - Mobile App v3.0", time: "45m ago", type: "comment" },
  { icon: Upload, user: "Tom Harris", action: "uploaded", target: "test-results-v2.pdf to E-Commerce Platform", time: "1h ago", type: "file" },
  { icon: Users, user: "Alex Richardson", action: "added to team", target: "Anna Schmidt → Product Team", time: "1.5h ago", type: "team" },
  { icon: AlertTriangle, user: "System", action: "flagged risk", target: "Mobile App v3.0 - Deadline at risk", time: "2h ago", type: "risk" },
  { icon: Clock, user: "Lisa Wang", action: "submitted timesheet", target: "Week 25 - 36.5 hours", time: "2.5h ago", type: "time" },
  { icon: FolderKanban, user: "David Kim", action: "updated deadline", target: "CRM Integration → Jul 30, 2025", time: "3h ago", type: "project" },
  { icon: CheckSquare, user: "Mike Chen", action: "started task", target: "Payment Gateway Integration", time: "3.5h ago", type: "task" },
];

const typeColors: Record<string, string> = {
  project: "bg-primary/10 text-primary", task: "bg-success/10 text-success",
  approval: "bg-warning/10 text-warning", comment: "bg-accent/10 text-accent",
  file: "bg-info/10 text-info", team: "bg-primary/10 text-primary",
  risk: "bg-destructive/10 text-destructive", time: "bg-muted text-muted-foreground",
};

const ActivityFeedPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Activity Feed"
      description="Real-time stream of all organizational activity"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">Filter</Button>
          <Button variant="outline" size="sm" className="text-xs">Mark All Read</Button>
        </div>
      }
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Today's Events", value: "48", color: "text-primary" },
        { label: "Tasks Completed", value: "12", color: "text-success" },
        { label: "Active Users", value: "18", color: "text-accent" },
        { label: "Alerts", value: "2", color: "text-warning" },
      ].map((s) => (
        <div key={s.label} className="stat-card text-center">
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Live Feed
        </h3>
        <Badge variant="outline" className="text-[10px] animate-pulse">Live</Badge>
      </div>

      <div className="space-y-0">
        {feeds.map((feed, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[feed.type]} group-hover:scale-110 transition-transform`}>
                <feed.icon className="h-4 w-4" />
              </div>
              {i < feeds.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <p className="text-sm">
                  <span className="font-semibold">{feed.user}</span>
                  <span className="text-muted-foreground"> {feed.action} </span>
                  <span className="font-medium text-primary">{feed.target}</span>
                </p>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{feed.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ActivityFeedPage;

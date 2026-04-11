import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckSquare, FileText, MessageSquare, Upload } from "lucide-react";

const activities = [
  { icon: CheckSquare, action: "Completed task", detail: "Implement auth module - E-Commerce Platform", time: "9:45 AM", duration: "2h 15m", type: "task" },
  { icon: MessageSquare, action: "Added comment", detail: "Discussion on API design patterns", time: "10:30 AM", duration: "15m", type: "collab" },
  { icon: Upload, action: "Uploaded file", detail: "design-specs-v3.pdf to Mobile App v3.0", time: "11:00 AM", duration: "5m", type: "file" },
  { icon: CheckSquare, action: "Started task", detail: "Write API tests - Data Pipeline", time: "11:30 AM", duration: "—", type: "task" },
  { icon: FileText, action: "Updated documentation", detail: "API endpoint documentation for CRM Integration", time: "1:15 PM", duration: "45m", type: "doc" },
  { icon: CheckSquare, action: "Submitted for review", detail: "DB migration script - CRM Integration", time: "2:30 PM", duration: "1h 30m", type: "task" },
  { icon: MessageSquare, action: "Received feedback", detail: "Sarah Chen approved your task", time: "3:00 PM", duration: "—", type: "collab" },
  { icon: Clock, action: "Logged hours", detail: "8h total for today", time: "5:00 PM", duration: "—", type: "time" },
];

const typeColors: Record<string, string> = {
  task: "bg-primary/10 text-primary", collab: "bg-accent/10 text-accent",
  file: "bg-info/10 text-info", doc: "bg-warning/10 text-warning", time: "bg-success/10 text-success",
};

const ActivityLogPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Daily Activity Log"
      description="Your detailed activity timeline for today"
      badge={<Badge variant="outline" className="text-[10px]">Today · Jun 25, 2025</Badge>}
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Tasks Worked", value: "4", color: "text-primary" },
        { label: "Hours Logged", value: "8.0h", color: "text-success" },
        { label: "Files Uploaded", value: "1", color: "text-info" },
        { label: "Comments", value: "2", color: "text-accent" },
      ].map((stat) => (
        <div key={stat.label} className="stat-card text-center">
          <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>

    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" /> Timeline
      </h3>
      <div className="space-y-0">
        {activities.map((a, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[a.type]}`}>
                <a.icon className="h-3.5 w-3.5" />
              </div>
              {i < activities.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{a.action}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  {a.duration !== "—" && <span className="bg-muted px-1.5 py-0.5 rounded">{a.duration}</span>}
                  <span>{a.time}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ActivityLogPage;

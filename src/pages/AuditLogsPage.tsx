import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";

const logs = [
  { id: 1, user: "Alex Richardson", action: "Updated user role", target: "Mike Chen → Manager", timestamp: "2025-06-25 14:32:10", type: "user" },
  { id: 2, user: "Sarah Chen", action: "Created project", target: "Analytics Dashboard", timestamp: "2025-06-25 13:15:45", type: "project" },
  { id: 3, user: "Sarah Chen", action: "Approved task", target: "DB migration script", timestamp: "2025-06-25 12:08:22", type: "task" },
  { id: 4, user: "James Wilson", action: "Submitted timesheet", target: "Week 25", timestamp: "2025-06-25 11:45:00", type: "timesheet" },
  { id: 5, user: "Alex Richardson", action: "Deactivated user", target: "Anna Schmidt", timestamp: "2025-06-24 16:20:33", type: "user" },
  { id: 6, user: "Emily Davis", action: "Uploaded file", target: "design-specs.pdf", timestamp: "2025-06-24 15:10:18", type: "file" },
  { id: 7, user: "David Kim", action: "Updated project deadline", target: "CRM Integration → Jul 30", timestamp: "2025-06-24 14:05:55", type: "project" },
  { id: 8, user: "Alex Richardson", action: "Changed system settings", target: "Notification rules updated", timestamp: "2025-06-24 10:30:00", type: "system" },
];

const typeColors: Record<string, string> = {
  user: "bg-primary/10 text-primary", project: "bg-accent/10 text-accent",
  task: "bg-warning/10 text-warning", timesheet: "bg-info/10 text-info",
  file: "bg-muted text-muted-foreground", system: "bg-destructive/10 text-destructive",
};

const AuditLogsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Audit Logs" description="Complete activity history across the system" />
    <div className="glass-card rounded-xl divide-y divide-border">
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-4 p-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium shrink-0 mt-0.5">
            {l.user.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm"><span className="font-medium">{l.user}</span> <span className="text-muted-foreground">{l.action}</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">{l.target}</p>
          </div>
          <div className="text-right shrink-0 space-y-1">
            <Badge variant="outline" className={`text-[10px] ${typeColors[l.type]}`}>{l.type}</Badge>
            <p className="text-[10px] text-muted-foreground">{l.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AuditLogsPage;

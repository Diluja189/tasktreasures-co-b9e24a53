import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";

const logs = [
  { id: 1, user: "Alex Richardson", action: "Updated user role", target: "Mike Chen → Manager", timestamp: "2025-06-25 14:32:10", type: "user", ip: "10.0.0.1" },
  { id: 2, user: "Sarah Chen", action: "Created project", target: "Analytics Dashboard", timestamp: "2025-06-25 13:15:45", type: "project", ip: "10.0.0.12" },
  { id: 3, user: "Sarah Chen", action: "Approved task", target: "DB migration script", timestamp: "2025-06-25 12:08:22", type: "task", ip: "10.0.0.12" },
  { id: 4, user: "James Wilson", action: "Submitted timesheet", target: "Week 25", timestamp: "2025-06-25 11:45:00", type: "timesheet", ip: "10.0.0.15" },
  { id: 5, user: "Alex Richardson", action: "Deactivated user", target: "Anna Schmidt", timestamp: "2025-06-24 16:20:33", type: "user", ip: "10.0.0.1" },
  { id: 6, user: "Emily Davis", action: "Uploaded file", target: "design-specs.pdf", timestamp: "2025-06-24 15:10:18", type: "file", ip: "10.0.0.18" },
  { id: 7, user: "David Kim", action: "Updated project deadline", target: "CRM Integration → Jul 30", timestamp: "2025-06-24 14:05:55", type: "project", ip: "10.0.0.20" },
  { id: 8, user: "Alex Richardson", action: "Changed system settings", target: "Notification rules updated", timestamp: "2025-06-24 10:30:00", type: "system", ip: "10.0.0.1" },
];

const typeColors: Record<string, string> = {
  user: "bg-primary/10 text-primary", project: "bg-accent/10 text-accent",
  task: "bg-warning/10 text-warning", timesheet: "bg-info/10 text-info",
  file: "bg-muted text-muted-foreground", system: "bg-destructive/10 text-destructive",
};

const columns = [
  { key: "timestamp", label: "Time", render: (l: any) => <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{l.timestamp}</span> },
  { key: "user", label: "User", render: (l: any) => (
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-[9px] font-semibold text-primary">
        {l.user.split(" ").map((n: string) => n[0]).join("")}
      </div>
      <span className="text-xs font-medium">{l.user}</span>
    </div>
  )},
  { key: "action", label: "Action", render: (l: any) => <span className="text-xs">{l.action}</span> },
  { key: "target", label: "Target", render: (l: any) => <span className="text-xs text-muted-foreground">{l.target}</span> },
  { key: "type", label: "Category", render: (l: any) => <Badge variant="outline" className={`text-[8px] capitalize ${typeColors[l.type]}`}>{l.type}</Badge> },
  { key: "ip", label: "IP", render: (l: any) => <span className="text-[10px] font-mono text-muted-foreground">{l.ip}</span> },
];

const AuditLogsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Audit Trail"
      description="Complete system activity log with full traceability"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1"><Filter className="h-3.5 w-3.5" /> Advanced Filter</Button>
          <Button variant="outline" size="sm" className="text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>
      }
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Total Events", value: "2,847", color: "text-primary" },
        { label: "Today", value: "48", color: "text-success" },
        { label: "User Actions", value: "1,204", color: "text-info" },
        { label: "System Events", value: "156", color: "text-warning" },
      ].map((s) => (
        <div key={s.label} className="stat-card text-center">
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <DataTable
      columns={columns}
      data={logs}
      searchKey="user"
      searchPlaceholder="Search by user..."
      filterOptions={[
        { key: "type", label: "Category", options: ["user", "project", "task", "timesheet", "file", "system"] },
      ]}
      exportable
    />
  </div>
);

export default AuditLogsPage;

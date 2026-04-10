import { PageHeader } from "@/components/shared/PageHeader";
import { Bell, CheckSquare, FolderKanban, MessageSquare, AlertTriangle } from "lucide-react";

const notifications = [
  { icon: CheckSquare, message: "Task 'DB migration script' was approved", time: "10m ago", read: false, type: "success" },
  { icon: FolderKanban, message: "New task assigned: Design review feedback", time: "1h ago", read: false, type: "info" },
  { icon: AlertTriangle, message: "Deadline approaching: Write API tests (Jun 30)", time: "2h ago", read: false, type: "warning" },
  { icon: MessageSquare, message: "Sarah Chen commented on 'Auth module'", time: "3h ago", read: true, type: "info" },
  { icon: CheckSquare, message: "Task 'Setup CI/CD' marked as completed", time: "5h ago", read: true, type: "success" },
  { icon: AlertTriangle, message: "Project 'CRM Integration' is delayed", time: "1d ago", read: true, type: "warning" },
];

const typeColors: Record<string, string> = {
  success: "bg-success/10 text-success", info: "bg-primary/10 text-primary", warning: "bg-warning/10 text-warning",
};

const NotificationsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Notifications" description="Stay up to date with your team" />
    <div className="glass-card rounded-xl divide-y divide-border">
      {notifications.map((n, i) => (
        <div key={i} className={`flex items-start gap-4 p-4 ${!n.read ? "bg-primary/[0.02]" : ""}`}>
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
            <n.icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className={`text-sm ${!n.read ? "font-medium" : "text-muted-foreground"}`}>{n.message}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
          </div>
          {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
        </div>
      ))}
    </div>
  </div>
);

export default NotificationsPage;

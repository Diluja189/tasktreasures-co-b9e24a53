import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const workLogs = [
  { date: "Jun 25, 2025", hours: 8.0, project: "E-Commerce Platform", tasks: "Auth module implementation", status: "Submitted" },
  { date: "Jun 24, 2025", hours: 7.5, project: "Data Pipeline", tasks: "API tests, code review", status: "Approved" },
  { date: "Jun 23, 2025", hours: 8.2, project: "E-Commerce Platform", tasks: "Payment integration", status: "Approved" },
  { date: "Jun 22, 2025", hours: 6.5, project: "Mobile App v3.0", tasks: "Design review, feedback", status: "Approved" },
  { date: "Jun 21, 2025", hours: 8.0, project: "CRM Integration", tasks: "DB migration scripts", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Submitted: "bg-info/10 text-info", Approved: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning",
};

const WorkLogPage = () => (
  <div className="space-y-6">
    <PageHeader title="Work Log" description="Track your daily hours and activities" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Log Hours</Button>} />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="stat-card"><p className="text-xs text-muted-foreground">This Week</p><p className="text-2xl font-display font-bold">38.2h</p></div>
      <div className="stat-card"><p className="text-xs text-muted-foreground">This Month</p><p className="text-2xl font-display font-bold">162.5h</p></div>
      <div className="stat-card"><p className="text-xs text-muted-foreground">Avg Daily</p><p className="text-2xl font-display font-bold">7.6h</p></div>
    </div>
    <div className="glass-card rounded-xl divide-y divide-border">
      {workLogs.map((l, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{l.date}</p>
              <Badge variant="outline" className={`text-[10px] ${statusColors[l.status]}`}>{l.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{l.project} · {l.tasks}</p>
          </div>
          <p className="text-lg font-display font-bold shrink-0">{l.hours}h</p>
        </div>
      ))}
    </div>
  </div>
);

export default WorkLogPage;

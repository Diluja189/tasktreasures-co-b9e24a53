import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, MessageSquare } from "lucide-react";

const approvals = [
  { task: "Homepage Redesign", employee: "James Wilson", project: "E-Commerce Platform", submitted: "2h ago", priority: "High" },
  { task: "API Documentation", employee: "Emily Davis", project: "Data Pipeline", submitted: "4h ago", priority: "Medium" },
  { task: "Unit Tests - Auth", employee: "Mike Chen", project: "E-Commerce Platform", submitted: "1d ago", priority: "High" },
  { task: "Mobile Onboarding Flow", employee: "Lisa Wang", project: "Mobile App v3.0", submitted: "1d ago", priority: "Critical" },
];

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};

const ApprovalsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Task Approvals" description="Review and approve completed tasks" />
    <div className="space-y-3">
      {approvals.map((a, i) => (
        <div key={i} className="glass-card rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <CheckSquare className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{a.task}</p>
                  <Badge variant="outline" className={`text-[10px] ${priorityColors[a.priority]}`}>{a.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{a.project} · by {a.employee} · {a.submitted}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs rounded-lg bg-success text-success-foreground hover:bg-success/90 transition-colors font-medium">Approve</button>
              <button className="px-4 py-2 text-xs rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium">Reject</button>
              <button className="px-4 py-2 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><MessageSquare className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ApprovalsPage;

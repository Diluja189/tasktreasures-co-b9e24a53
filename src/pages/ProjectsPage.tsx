import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/shared/StatCard";
import { FolderKanban, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "E-Commerce Platform", manager: "Sarah Chen", team: "Engineering", status: "Active", priority: "High", progress: 78, deadline: "2025-07-15", budget: "$45,000" },
  { id: "PRJ-002", name: "Mobile App v3.0", manager: "Sarah Chen", team: "Mobile", status: "At Risk", priority: "Critical", progress: 45, deadline: "2025-08-01", budget: "$62,000" },
  { id: "PRJ-003", name: "Data Pipeline Rebuild", manager: "David Kim", team: "Backend", status: "Active", priority: "Medium", progress: 92, deadline: "2025-06-30", budget: "$28,000" },
  { id: "PRJ-004", name: "CRM Integration", manager: "Sarah Chen", team: "Engineering", status: "Delayed", priority: "High", progress: 30, deadline: "2025-07-20", budget: "$35,000" },
  { id: "PRJ-005", name: "Analytics Dashboard", manager: "Lisa Wang", team: "Data", status: "Active", priority: "Medium", progress: 60, deadline: "2025-08-15", budget: "$22,000" },
  { id: "PRJ-006", name: "Security Audit", manager: "David Kim", team: "DevOps", status: "Completed", priority: "Critical", progress: 100, deadline: "2025-06-15", budget: "$18,000" },
];

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success", "At Risk": "bg-warning/10 text-warning",
  Delayed: "bg-destructive/10 text-destructive", Completed: "bg-muted text-muted-foreground",
};
const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};

const ProjectsPage = () => {
  const { currentUser } = useRole();

  const columns = [
    { key: "id", label: "ID", render: (p: any) => <span className="text-xs font-mono text-muted-foreground">{p.id}</span> },
    { key: "name", label: "Project", render: (p: any) => <span className="font-medium text-sm">{p.name}</span> },
    ...(currentUser.role !== "employee" ? [{ key: "manager", label: "Manager", render: (p: any) => <span className="text-xs">{p.manager}</span> }] : []),
    { key: "status", label: "Status", render: (p: any) => <Badge variant="outline" className={`text-[9px] ${statusColors[p.status]}`}>{p.status}</Badge> },
    { key: "priority", label: "Priority", render: (p: any) => <Badge variant="outline" className={`text-[9px] ${priorityColors[p.priority]}`}>{p.priority}</Badge> },
    { key: "progress", label: "Progress", render: (p: any) => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress value={p.progress} className="h-1.5 flex-1" />
        <span className="text-xs font-semibold w-8">{p.progress}%</span>
      </div>
    )},
    { key: "deadline", label: "Deadline", render: (p: any) => <span className="text-xs text-muted-foreground">{p.deadline}</span> },
    ...(currentUser.role === "admin" ? [{ key: "budget", label: "Budget", render: (p: any) => <span className="text-xs font-semibold">{p.budget}</span> }] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentUser.role === "employee" ? "My Projects" : "Project Portfolio"}
        description={currentUser.role === "employee" ? "Projects assigned to you" : "Manage and track all projects across the organization"}
        actions={
          <div className="flex gap-2">
            {currentUser.role !== "employee" && (
              <>
                <Button variant="outline" size="sm" className="text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export</Button>
                <Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Project</Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} title="Total Projects" value={projects.length} change="All time" changeType="neutral" />
        <StatCard icon={CheckCircle} title="Completed" value={projects.filter(p => p.status === "Completed").length} change="This quarter" changeType="positive" />
        <StatCard icon={AlertTriangle} title="At Risk" value={projects.filter(p => p.status === "At Risk" || p.status === "Delayed").length} change="Needs attention" changeType="negative" iconColor="bg-warning/10" />
        {currentUser.role === "admin" && <StatCard icon={DollarSign} title="Total Budget" value="$210K" change="72% utilized" changeType="neutral" />}
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="name"
        searchPlaceholder="Search projects..."
        filterOptions={[
          { key: "status", label: "Status", options: ["Active", "At Risk", "Delayed", "Completed"] },
          { key: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] },
        ]}
        exportable={currentUser.role !== "employee"}
        bulkActions={currentUser.role === "admin"}
      />
    </div>
  );
};

export default ProjectsPage;

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Download } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/shared/StatCard";
import { CheckSquare, Clock, AlertTriangle, TrendingUp } from "lucide-react";

const tasks = [
  { id: "TSK-101", title: "Implement auth module", project: "E-Commerce Platform", assignee: "James Wilson", status: "In Progress", priority: "High", progress: 65, dueDate: "Jun 28" },
  { id: "TSK-102", title: "Write API tests", project: "Data Pipeline", assignee: "Emily Davis", status: "In Progress", priority: "Medium", progress: 30, dueDate: "Jun 30" },
  { id: "TSK-103", title: "Design review feedback", project: "Mobile App v3.0", assignee: "James Wilson", status: "Not Started", priority: "Low", progress: 0, dueDate: "Jul 02" },
  { id: "TSK-104", title: "DB migration script", project: "CRM Integration", assignee: "Mike Chen", status: "In Review", priority: "Critical", progress: 90, dueDate: "Jun 26" },
  { id: "TSK-105", title: "Setup CI/CD pipeline", project: "E-Commerce Platform", assignee: "Lisa Wang", status: "Completed", priority: "High", progress: 100, dueDate: "Jun 20" },
  { id: "TSK-106", title: "User onboarding flow", project: "Mobile App v3.0", assignee: "Emily Davis", status: "In Progress", priority: "High", progress: 50, dueDate: "Jul 05" },
  { id: "TSK-107", title: "Payment gateway integration", project: "E-Commerce Platform", assignee: "Mike Chen", status: "In Progress", priority: "Critical", progress: 40, dueDate: "Jul 08" },
  { id: "TSK-108", title: "Dashboard analytics widgets", project: "Analytics Dashboard", assignee: "Anna Schmidt", status: "Not Started", priority: "Medium", progress: 0, dueDate: "Jul 10" },
];

const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground", "In Progress": "bg-primary/10 text-primary",
  "In Review": "bg-warning/10 text-warning", "Completed": "bg-success/10 text-success",
};
const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", Medium: "bg-info/10 text-info",
  High: "bg-warning/10 text-warning", Critical: "bg-destructive/10 text-destructive",
};

const TasksPage = () => {
  const { currentUser } = useRole();

  const columns = [
    { key: "id", label: "ID", render: (t: any) => <span className="text-xs font-mono text-muted-foreground">{t.id}</span> },
    { key: "title", label: "Task", render: (t: any) => (
      <div>
        <p className="font-medium text-sm">{t.title}</p>
        <p className="text-[10px] text-muted-foreground">{t.project}</p>
      </div>
    )},
    ...(currentUser.role !== "employee" ? [{ key: "assignee", label: "Assignee", render: (t: any) => <span className="text-xs">{t.assignee}</span> }] : []),
    { key: "status", label: "Status", render: (t: any) => <Badge variant="outline" className={`text-[9px] ${statusColors[t.status]}`}>{t.status}</Badge> },
    { key: "priority", label: "Priority", render: (t: any) => <Badge variant="outline" className={`text-[9px] ${priorityColors[t.priority]}`}>{t.priority}</Badge> },
    { key: "progress", label: "Progress", render: (t: any) => (
      <div className="flex items-center gap-2 min-w-[100px]">
        <Progress value={t.progress} className="h-1.5 flex-1" />
        <span className="text-xs font-semibold w-8">{t.progress}%</span>
      </div>
    )},
    { key: "dueDate", label: "Due", render: (t: any) => <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.dueDate}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentUser.role === "employee" ? "Task Workspace" : "Task Command Center"}
        description={currentUser.role === "employee" ? "Tasks assigned to you" : "Manage and track all tasks across projects"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export</Button>
            {currentUser.role !== "employee" && <Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Task</Button>}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} title="Total Tasks" value={tasks.length} change="This sprint" changeType="neutral" />
        <StatCard icon={TrendingUp} title="Completed" value={tasks.filter(t => t.status === "Completed").length} change="This week" changeType="positive" />
        <StatCard icon={Clock} title="In Progress" value={tasks.filter(t => t.status === "In Progress").length} change="Active now" changeType="neutral" />
        <StatCard icon={AlertTriangle} title="Overdue" value={1} change="Needs attention" changeType="negative" iconColor="bg-destructive/10" />
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchKey="title"
        searchPlaceholder="Search tasks..."
        filterOptions={[
          { key: "status", label: "Status", options: ["Not Started", "In Progress", "In Review", "Completed"] },
          { key: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] },
        ]}
        exportable
        bulkActions={currentUser.role !== "employee"}
      />
    </div>
  );
};

export default TasksPage;

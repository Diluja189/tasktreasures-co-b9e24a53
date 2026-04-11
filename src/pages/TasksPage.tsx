import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Progress } from "@/components/ui/progress";

const tasks = [
  { id: "TSK-101", title: "Implement auth module", project: "E-Commerce Platform", assignee: "James Wilson", status: "In Progress", priority: "High", progress: 65, dueDate: "Jun 28" },
  { id: "TSK-102", title: "Write API tests", project: "Data Pipeline", assignee: "Emily Davis", status: "In Progress", priority: "Medium", progress: 30, dueDate: "Jun 30" },
  { id: "TSK-103", title: "Design review feedback", project: "Mobile App v3.0", assignee: "James Wilson", status: "Not Started", priority: "Low", progress: 0, dueDate: "Jul 02" },
  { id: "TSK-104", title: "DB migration script", project: "CRM Integration", assignee: "Mike Chen", status: "In Review", priority: "Critical", progress: 90, dueDate: "Jun 26" },
  { id: "TSK-105", title: "Setup CI/CD pipeline", project: "E-Commerce Platform", assignee: "Lisa Wang", status: "Completed", priority: "High", progress: 100, dueDate: "Jun 20" },
  { id: "TSK-106", title: "User onboarding flow", project: "Mobile App v3.0", assignee: "Emily Davis", status: "In Progress", priority: "High", progress: 50, dueDate: "Jul 05" },
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
        <p className="text-xs text-muted-foreground">{t.project}</p>
      </div>
    )},
    ...(currentUser.role !== "employee" ? [{ key: "assignee", label: "Assignee" }] : []),
    { key: "status", label: "Status", render: (t: any) => <Badge variant="outline" className={`text-[10px] ${statusColors[t.status]}`}>{t.status}</Badge> },
    { key: "priority", label: "Priority", render: (t: any) => <Badge variant="outline" className={`text-[10px] ${priorityColors[t.priority]}`}>{t.priority}</Badge> },
    { key: "progress", label: "Progress", render: (t: any) => (
      <div className="flex items-center gap-2 min-w-[100px]">
        <Progress value={t.progress} className="h-1.5 flex-1" />
        <span className="text-xs w-8">{t.progress}%</span>
      </div>
    )},
    { key: "dueDate", label: "Due", render: (t: any) => <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.dueDate}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentUser.role === "employee" ? "My Tasks" : "Task Management"}
        description={currentUser.role === "employee" ? "Tasks assigned to you" : "Manage and track all tasks"}
        actions={currentUser.role !== "employee" && <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Task</Button>}
      />
      <DataTable columns={columns} data={tasks} searchKey="title" searchPlaceholder="Search tasks..." />
    </div>
  );
};

export default TasksPage;

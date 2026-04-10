import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, BarChart3, CheckSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRole } from "@/contexts/RoleContext";

const teamMembers = [
  { name: "James Wilson", role: "Frontend Dev", tasks: 5, completed: 3, hours: 38, status: "Active" },
  { name: "Emily Davis", role: "Backend Dev", tasks: 4, completed: 2, hours: 36, status: "Active" },
  { name: "Mike Chen", role: "Full Stack", tasks: 6, completed: 5, hours: 40, status: "Active" },
  { name: "Lisa Wang", role: "Data Engineer", tasks: 3, completed: 1, hours: 32, status: "On Leave" },
  { name: "Tom Harris", role: "QA Engineer", tasks: 4, completed: 4, hours: 39, status: "Active" },
];

const statusColors: Record<string, string> = { Active: "bg-success/10 text-success", "On Leave": "bg-warning/10 text-warning" };

const TeamPage = () => {
  const { currentUser } = useRole();
  return (
    <div className="space-y-6">
      <PageHeader title="My Team" description="Team members and workload overview" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-4 w-4" />Total Members</div><p className="text-2xl font-display font-bold">{teamMembers.length}</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><CheckSquare className="h-4 w-4" />Tasks Completed</div><p className="text-2xl font-display font-bold">{teamMembers.reduce((a, m) => a + m.completed, 0)}</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><BarChart3 className="h-4 w-4" />Avg Hours</div><p className="text-2xl font-display font-bold">{(teamMembers.reduce((a, m) => a + m.hours, 0) / teamMembers.length).toFixed(1)}</p></div>
      </div>
      <div className="glass-card rounded-xl divide-y divide-border">
        {teamMembers.map((m) => (
          <div key={m.name} className="flex items-center gap-4 p-4">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary text-xs">{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{m.name}</p>
                <Badge variant="outline" className={`text-[10px] ${statusColors[m.status]}`}>{m.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
            <div className="text-right text-xs space-y-1 hidden sm:block">
              <p><span className="text-muted-foreground">Tasks:</span> <span className="font-medium">{m.completed}/{m.tasks}</span></p>
              <p><span className="text-muted-foreground">Hours:</span> <span className="font-medium">{m.hours}h</span></p>
            </div>
            <div className="w-20">
              <Progress value={(m.completed / m.tasks) * 100} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{Math.round((m.completed / m.tasks) * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

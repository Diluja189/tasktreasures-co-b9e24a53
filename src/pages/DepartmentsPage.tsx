import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderKanban } from "lucide-react";

const departments = [];

const DepartmentsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Departments & Teams" description="Manage organizational structure" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Department</Button>} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((d) => (
        <div key={d.name} className="stat-card">
          <h3 className="font-display font-semibold">{d.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">Head: {d.head}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{d.members} members</span>
            <span className="flex items-center gap-1"><FolderKanban className="h-3.5 w-3.5" />{d.projects} projects</span>
          </div>
          <div className="flex gap-1 mt-3">
            {Array.from({ length: d.teams }).map((_, i) => (
              <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">Team {i + 1}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DepartmentsPage;

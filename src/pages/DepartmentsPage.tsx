import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderKanban, TrendingUp } from "lucide-react";

const departments = [
  { name: "Engineering", teams: 4, members: 45, projects: 12, head: "Sarah Chen", productivity: 92, budget: "$180K" },
  { name: "Design", teams: 2, members: 20, projects: 6, head: "Mark Taylor", productivity: 88, budget: "$75K" },
  { name: "Marketing", teams: 3, members: 18, projects: 8, head: "Jane Cooper", productivity: 78, budget: "$95K" },
  { name: "Sales", teams: 2, members: 12, projects: 4, head: "Tom Harris", productivity: 85, budget: "$60K" },
  { name: "HR", teams: 1, members: 5, projects: 2, head: "Amy Brooks", productivity: 90, budget: "$30K" },
  { name: "DevOps", teams: 2, members: 10, projects: 5, head: "David Kim", productivity: 95, budget: "$50K" },
];

const DepartmentsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Organization Structure"
      description="Manage departments, teams, and organizational hierarchy"
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Department</Button>}
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Departments", value: departments.length, color: "text-primary" },
        { label: "Total Teams", value: departments.reduce((a, d) => a + d.teams, 0), color: "text-accent" },
        { label: "Total Members", value: departments.reduce((a, d) => a + d.members, 0), color: "text-info" },
        { label: "Avg Productivity", value: `${Math.round(departments.reduce((a, d) => a + d.productivity, 0) / departments.length)}%`, color: "text-success" },
      ].map((s) => (
        <div key={s.label} className="stat-card text-center">
          <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((d) => (
        <div key={d.name} className="glass-card rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{d.name}</h3>
              <p className="text-xs text-muted-foreground">Head: {d.head}</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-display font-bold ${d.productivity >= 90 ? "text-success" : d.productivity >= 80 ? "text-primary" : "text-warning"}`}>{d.productivity}%</p>
              <p className="text-[10px] text-muted-foreground">productivity</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{d.members} members</span>
            <span className="flex items-center gap-1"><FolderKanban className="h-3.5 w-3.5" />{d.projects} projects</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: d.teams }).map((_, i) => (
                <span key={i} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Team {i + 1}</span>
              ))}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{d.budget}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DepartmentsPage;

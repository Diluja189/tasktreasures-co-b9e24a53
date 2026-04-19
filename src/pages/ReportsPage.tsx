import { useState, useEffect, useMemo } from "react";
import { 
  Users, ChevronRight, Briefcase, FileText, ArrowLeft, 
  Calendar, CheckCircle2, TrendingUp, Award, BarChart3,
  XCircle, Clock, Target, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ReportsPage() {
  const [managers, setManagers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      const m = localStorage.getItem("app_managers_persistence");
      const p = localStorage.getItem("app_projects_persistence");
      setManagers(m ? JSON.parse(m) : []);
      setProjects(p ? JSON.parse(p) : []);
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // ── Calculation Helpers ────────────────────────────────────────────────
  const getProjectDetails = (p: any) => {
    const total = p.totalTasks || 0;
    const comp = p.completedTasks || 0;
    const delayed = p.delayedTasks || 0;
    
    let hasStarted = total > 0;
    let actualProgress = hasStarted ? Math.round((comp / total) * 100) : 0;

    const start = new Date(p.startDate || new Date());
    const end = new Date(p.deadline || new Date());
    const today = new Date();

    let expectedProgress = 0;
    if (today >= end) expectedProgress = 100;
    else if (today <= start) expectedProgress = 0;
    else {
      const totalDays = end.getTime() - start.getTime();
      const elapsedDays = today.getTime() - start.getTime();
      expectedProgress = Math.round((elapsedDays / totalDays) * 100);
    }

    let status = "On Track";
    if (actualProgress > expectedProgress) status = "Ahead";
    else if (actualProgress < expectedProgress) status = "Behind";

    let managerPerf = null;
    let members = p.teamMembers || [];

    if (hasStarted) {
      const progressScore = expectedProgress === 0 ? 100 : Math.min(100, Math.round((actualProgress / expectedProgress) * 100));
      const completionRate = Math.round((comp / total) * 100);
      const onTimeDelivery = Math.max(0, Math.round(((total - delayed) / total) * 100));
      const delayControl = Math.max(0, 100 - Math.round((delayed / total) * 100));

      const managerScore = Math.round(
        (progressScore * 0.4) + (completionRate * 0.3) + (onTimeDelivery * 0.2) + (delayControl * 0.1)
      );

      managerPerf = { score: managerScore };

      if (members.length === 0) {
        // Fallback team member if none created
        const teamEfficiency = Math.round((completionRate * 0.6) + (onTimeDelivery * 0.4));
        members = [{ name: "Project Team", assignedCount: total, completedTasks: comp, delayedTasks: delayed, pendingTasks: total - comp, efficiency: teamEfficiency }];
      } else {
        members = members.map((m: any) => {
          const mTotal = m.assignedCount || 1;
          const mComp = m.completedTasks || 0;
          const mDel = m.delayedTasks || 0;
          const mOnTime = Math.max(0, 100 - Math.round((mDel / mTotal) * 100));
          const mCompRate = Math.round((mComp / mTotal) * 100);
          const mEff = Math.round((mCompRate * 0.6) + (mOnTime * 0.4));
          return {
            ...m,
            assignedCount: mTotal,
            completedTasks: mComp,
            delayedTasks: mDel,
            pendingTasks: mTotal - mComp,
            efficiency: mEff
          };
        });
      }
    }

    return { ...p, hasStarted, expectedProgress, actualProgress, status, managerPerf, members };
  };

  // ── Render Level 1: Managers List ──────────────────────────────────────
  if (!selectedManager && !selectedProject) {
    const managersWithCount = managers.map(m => {
      const pCount = projects.filter(p => p.manager === m.name).length;
      return { ...m, pCount };
    });

    return (
      <div className="space-y-6 pb-10 pt-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Management Reports</h1>
          <p className="text-xs text-muted-foreground">Select a manager to view their assigned projects and performance health.</p>
        </div>

        {managersWithCount.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-black text-lg text-foreground/50">No Managers Found</h3>
            <p className="text-xs text-muted-foreground">Please ensure managers are created in the system.</p>
          </div>
        ) : (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-secondary/30 border-b border-border/40">
                  <tr>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Manager Identity</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Designation</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Assigned Projects</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {managersWithCount.map((manager, idx) => (
                    <tr 
                      key={manager.id || idx} 
                      className="hover:bg-secondary/10 transition-colors cursor-pointer group" 
                      onClick={() => setSelectedManager(manager)}
                    >
                      <td className="py-4 px-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black uppercase ring-1 ring-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          {manager.avatar || manager.name.substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-foreground">{manager.name}</span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-none bg-secondary/40 text-muted-foreground">
                          {manager.designation || "Manager"}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="secondary" className="text-[11px] font-black pointer-events-none rounded-lg bg-indigo-500/10 text-indigo-700 border-none px-3 py-1">
                          <Briefcase className="h-3 w-3 mr-1.5" /> {manager.pCount}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="flex items-center justify-end text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-indigo-500 transition-colors">
                          View Projects <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Render Level 2: Manager's Projects ─────────────────────────────────
  if (selectedManager && !selectedProject) {
    const managerProjects = projects.filter(p => p.manager === selectedManager.name).map(getProjectDetails);

    return (
      <div className="space-y-6 pb-10 pt-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-none bg-secondary/50 hover:bg-secondary" onClick={() => setSelectedManager(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{selectedManager.name}'s Performance</h1>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">{selectedManager.designation || "Manager"}</p>
          </div>
        </div>

        {managerProjects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-secondary/10 rounded-3xl border border-dashed border-secondary/30">
            <Briefcase className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <h3 className="font-black text-sm text-foreground/60 uppercase tracking-widest">No Assigned Projects</h3>
            <p className="text-xs text-muted-foreground mt-1">This manager has no projects assigned to them.</p>
          </div>
        ) : (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-secondary/30 border-b border-border/40">
                  <tr>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Project Name</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Timeline</th>
                    <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {managerProjects.map((project, idx) => (
                    <tr 
                      key={project.id || idx} 
                      className="hover:bg-secondary/10 transition-colors cursor-pointer group" 
                      onClick={() => setSelectedProject(project)}
                    >
                      <td className="py-4 px-5">
                        <span className="text-sm font-bold text-foreground">{project.name}</span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest border-none px-2.5 py-1 ${
                          project.status === "Active" ? "bg-emerald-500/10 text-emerald-600" :
                          project.status === "Delayed" ? "bg-rose-500/10 text-rose-600" :
                          "bg-indigo-500/10 text-indigo-600"
                        }`}>
                          {project.status || "Pending"}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="secondary" className="text-[10px] font-black pointer-events-none rounded-lg bg-secondary/30 text-muted-foreground hover:bg-secondary/30 border-none px-3 py-1">
                          <Calendar className="h-3 w-3 mr-1.5 inline -mt-0.5" /> {project.startDate} — {project.deadline}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="flex items-center justify-end text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-indigo-500 transition-colors">
                          View Performance <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Render Level 3: Project Performance Details ───────────────────────
  if (selectedProject) {
    // Re-verify project calculations
    const p = getProjectDetails(selectedProject);

    return (
      <div className="space-y-6 pb-10 pt-5">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-none bg-secondary/50 hover:bg-secondary" onClick={() => setSelectedProject(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-indigo-900 dark:text-indigo-100">{p.name}</h1>
              <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest flex items-center gap-2">
                <Users className="h-3 w-3" /> Managed by {selectedManager?.name}
              </p>
            </div>
          </div>
          <Badge className={`text-[10px] font-black uppercase px-3 py-1 border-none rounded-lg ${
            p.status === "Ahead" ? "bg-emerald-500/10 text-emerald-600" :
            p.status === "Behind" ? "bg-rose-500/10 text-rose-600" :
            "bg-indigo-500/10 text-indigo-600"
          }`}>
            Status: {p.status}
          </Badge>
        </div>

        {!p.hasStarted ? (
          <div className="py-20 bg-secondary/5 rounded-3xl border border-dashed border-secondary/20 flex flex-col items-center justify-center text-center">
             <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
               <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
             </div>
             <h3 className="font-black text-lg text-foreground/50 uppercase tracking-widest">Performance Not Available</h3>
             <p className="text-xs text-muted-foreground mt-1">Metrics will generate automatically once tasks are created and begin processing.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Manager Performance Section */}
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600 bg-indigo-500/10 w-fit px-3 py-1.5 rounded-lg">
              <Award className="h-4 w-4" /> Manager Performance Breakdown
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Score & Status */}
              <Card className="border-none shadow-sm rounded-3xl bg-card/60">
                <CardContent className="p-6 flex items-center gap-6">
                   <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                      <svg className="h-20 w-20 transform -rotate-90">
                         <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-secondary/20" />
                         <circle
                           cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6"
                           strokeDasharray={226} 
                           strokeDashoffset={226 - (226 * p.managerPerf.score) / 100}
                           strokeLinecap="round" className="text-indigo-600"
                         />
                      </svg>
                      <span className="absolute text-lg font-black">{p.managerPerf.score}%</span>
                   </div>
                   <div className="space-y-1.5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Overall Efficiency</p>
                     <h3 className="text-xl font-black">{selectedManager?.name}</h3>
                     <Badge className="bg-indigo-600 text-white rounded-md text-[8px] font-black uppercase border-none tracking-widest">
                       {p.managerPerf.score >= 90 ? 'Excellent' : p.managerPerf.score >= 75 ? 'Good' : p.managerPerf.score >= 50 ? 'Average' : 'Needs Attention'}
                     </Badge>
                   </div>
                </CardContent>
              </Card>

              {/* Timeline Progress */}
              <Card className="border-none shadow-sm rounded-3xl bg-card/60 flex flex-col justify-center">
                <CardContent className="p-6 space-y-5">
                   <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                       <span>Expected Timeline Progress</span>
                       <span>{p.expectedProgress}%</span>
                     </div>
                     <Progress value={p.expectedProgress} className="h-2 bg-secondary/30 [&>div]:bg-slate-400" />
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                       <span>Actual Work Progress</span>
                       <span className={p.status === "Behind" ? "text-rose-600" : "text-emerald-600"}>{p.actualProgress}%</span>
                     </div>
                     <Progress value={p.actualProgress} className={`h-2 bg-secondary/30 [&>div]:${p.status === "Behind" ? "bg-rose-500" : (p.status === "Ahead" ? "bg-emerald-500" : "bg-indigo-600")}`} />
                   </div>
                </CardContent>
              </Card>

            </div>

            {/* Team Performance Table */}
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600 bg-indigo-500/10 w-fit px-3 py-1.5 rounded-lg mt-8">
              <Users className="h-4 w-4" /> Team Member Performance
            </h2>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-secondary/30 border-b border-border/40">
                    <tr>
                      <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Member Name</th>
                      <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Assigned</th>
                      <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Completed</th>
                      <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Pending</th>
                      <th className="py-4 px-5 text-[10px] font-black text-rose-500/70 uppercase tracking-widest text-center">Delayed</th>
                      <th className="py-4 px-5 text-[10px] font-black text-indigo-600 uppercase tracking-widest text-right">Efficiency %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {p.members.map((m: any, idx: number) => (
                      <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                        <td className="py-4 px-5">
                          <span className="text-sm font-bold text-foreground">{m.name}</span>
                        </td>
                        <td className="py-4 px-5 text-center font-black text-sm">{m.assignedCount}</td>
                        <td className="py-4 px-5 text-center font-black text-sm text-emerald-600">{m.completedTasks}</td>
                        <td className="py-4 px-5 text-center font-black text-sm text-amber-600">{m.pendingTasks}</td>
                        <td className="py-4 px-5 text-center font-black text-sm text-rose-600">{m.delayedTasks}</td>
                        <td className="py-4 px-5 text-right">
                          <Badge className={`text-xs font-black px-2.5 py-1 border-none ${m.efficiency >= 80 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                            {m.efficiency}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        )}
      </div>
    );
  }

  return null;
}

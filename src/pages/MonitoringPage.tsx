import { useState, useEffect, useMemo } from "react";
import { 
  Search, Filter, RefreshCw, BarChart3, Clock, 
  Calendar, Users, AlertTriangle, ChevronDown, CheckCircle2,
  TrendingUp, Award, ListChecks, Target, XCircle, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const loadData = () => {
    const p = localStorage.getItem("app_projects_persistence");
    setProjects(p ? JSON.parse(p) : []);
  };

  useEffect(() => {
    loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "app_projects_persistence") loadData();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ── Helper to calculate progress logic ────────────────────────────────
  // Returns: { hasStarted, expectedProgress, actualProgress, status }
  const getProjectProgress = (p: any) => {
    const total = p.totalTasks || 0;
    const comp = p.completedTasks || 0;
    
    if (total === 0) {
      return { hasStarted: false, expectedProgress: 0, actualProgress: 0, status: "Pending" };
    }

    const actualProgress = Math.round((comp / total) * 100);

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

    return { hasStarted: true, expectedProgress, actualProgress, status };
  };

  // ── Transform projects to include analytics ─────────────────────────────
  const enrichedProjects = useMemo(() => {
    return projects.map(p => {
      const prog = getProjectProgress(p);
      
      let managerPerf = null;
      let teamPerf = null;
      let members = p.teamMembers || [];

      if (prog.hasStarted) {
        const total = p.totalTasks || 1;
        const comp = p.completedTasks || 0;
        const delayed = p.delayedTasks || 0;

        // Formula 40% Progress Score, 30% Team Completion, 20% OnTime, 10% Delay Control
        const progressScore = prog.expectedProgress === 0 ? 100 : Math.min(100, Math.round((prog.actualProgress / prog.expectedProgress) * 100));
        const completionRate = Math.round((comp / total) * 100);
        // Synthesize on-time delivery from total vs delayed
        const onTimeDelivery = Math.max(0, Math.round(((total - delayed) / total) * 100));
        const delayControl = Math.max(0, 100 - Math.round((delayed / total) * 100));

        const managerScore = Math.round(
          (progressScore * 0.4) + 
          (completionRate * 0.3) + 
          (onTimeDelivery * 0.2) + 
          (delayControl * 0.1)
        );

        let managerStatus = "Average";
        if (managerScore >= 90) managerStatus = "Excellent";
        else if (managerScore >= 75) managerStatus = "Good";
        else if (managerScore < 50) managerStatus = "Needs Attention";

        managerPerf = {
          score: managerScore,
          status: managerStatus,
          progressScore,
          completionRate,
          onTimeDelivery,
          delayControl
        };

        const teamEfficiency = Math.round((completionRate * 0.6) + (onTimeDelivery * 0.4));
        teamPerf = { efficiency: teamEfficiency, comp, delayed, pending: total - comp };

        // Ensure fake team members if none exist but tasks do
        if (members.length === 0) {
          members = [
            { name: "Team Lead", assignedCount: total, comp, delayed, pending: total - comp, efficiency: teamEfficiency }
          ];
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
              onTimeRate: mOnTime,
              efficiency: mEff
            };
          });
        }
      }

      return { ...p, prog, managerPerf, teamPerf, members };
    });
  }, [projects]);

  // ── Summaries ──────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    let active = 0, onTrack = 0, behind = 0;
    enrichedProjects.forEach(p => {
      if (p.status === "Active" || p.status === "Pending") active++;
      if (p.prog.status === "On Track" || p.prog.status === "Ahead") onTrack++;
      if (p.prog.status === "Behind") behind++;
    });
    return {
      total: enrichedProjects.length,
      active,
      onTrack,
      behind
    };
  }, [enrichedProjects]);

  // ── Filtered List ──────────────────────────────────────────────────────
  const filtered = enrichedProjects.filter(p => {
    const matchSearch = 
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.manager || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchSearch;
    if (statusFilter === "Active") return matchSearch && (p.status === "Active" || p.status === "Pending");
    if (statusFilter === "Completed") return matchSearch && p.status === "Completed";
    if (statusFilter === "On Track") return matchSearch && p.prog.status === "On Track";
    if (statusFilter === "Ahead") return matchSearch && p.prog.status === "Ahead";
    if (statusFilter === "Behind") return matchSearch && p.prog.status === "Behind";
    return matchSearch;
  });

  const getStatusColor = (status: string) => {
    if (status === "Ahead") return "bg-emerald-500/10 text-emerald-600";
    if (status === "On Track") return "bg-indigo-500/10 text-indigo-600";
    if (status === "Behind") return "bg-rose-500/10 text-rose-600";
    return "bg-secondary/50 text-muted-foreground";
  };

  return (
    <div className="space-y-6 pb-10 pt-5">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Monitoring Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Live tracking for project, manager, and team performance metrics.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl h-8 text-xs font-bold" onClick={loadData}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* ── Top Summary Section ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-none shadow-sm bg-card/60 rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Projects</p>
              <p className="text-2xl font-black mt-1">{summary.total}</p>
            </div>
            <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600"><ListChecks className="h-5 w-5" /></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/60 rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active / Setup</p>
              <p className="text-2xl font-black mt-1">{summary.active}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600"><Target className="h-5 w-5" /></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/60 rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600/70 tracking-widest">On Track</p>
              <p className="text-2xl font-black mt-1 text-emerald-600">{summary.onTrack}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/60 rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-rose-600/70 tracking-widest">Behind Schedule</p>
              <p className="text-2xl font-black mt-1 text-rose-600">{summary.behind}</p>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-600"><AlertTriangle className="h-5 w-5" /></div>
          </CardContent>
        </Card>
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/40 p-2 rounded-2xl border shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by project or manager..." 
            className="pl-9 h-10 border-none bg-background rounded-xl text-sm font-semibold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl border-none bg-background font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl">
            <SelectItem value="All">All Projects</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Ahead">Ahead</SelectItem>
            <SelectItem value="On Track">On Track</SelectItem>
            <SelectItem value="Behind">Behind Schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Monitoring Cards ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="h-16 w-16 bg-secondary/30 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <h3 className="font-black text-xl text-foreground/40">No Projects Found</h3>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Try adjusting your filters or creating a new project.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            const prog = project.prog;
            const perfColor = prog.status === "Behind" ? "bg-rose-500" : (prog.status === "Ahead" ? "bg-emerald-500" : "bg-indigo-500");

            return (
              <Card key={project.id} className={`border-none shadow-sm rounded-3xl overflow-hidden transition-all relative ${isExpanded ? 'ring-2 ring-indigo-500/20' : 'hover:shadow-md'}`}>
                {/* ── Main Visible Card ── */}
                <div className="p-5 flex flex-col gap-5 bg-card">
                  
                  {/* Top Header: Identity & Actions */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight">{project.name}</h3>
                        <Badge className={`border-none text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest ${getStatusColor(prog.status)}`}>
                          {prog.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground bg-secondary/30 px-2 py-1 rounded-lg">
                          <Users className="h-3 w-3" /> {project.manager || "Unassigned"}
                        </div>
                        {project.priority && (
                          <div className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1 bg-secondary/30 rounded-lg">
                            Priority: {project.priority}
                          </div>
                        )}
                        <div className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1 bg-secondary/30 rounded-lg flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {project.startDate} — {project.deadline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="secondary" className="h-8 text-[10px] font-black gap-2 uppercase tracking-widest rounded-xl hover:bg-slate-200" onClick={() => navigate('/reports')}>
                        <FileText className="h-3.5 w-3.5" /> Report
                      </Button>
                      {prog.hasStarted && (
                        <Button className="h-8 text-[10px] font-black gap-2 uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-white" onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}>
                          <BarChart3 className="h-3.5 w-3.5" /> {isExpanded ? "Close" : "View Details"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Body: Analytics Modules */}
                  {prog.hasStarted && project.managerPerf && project.teamPerf ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* 1. Progress Tracking */}
                      <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Progress Tracking
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-muted-foreground">Expected Progress</span>
                              <span>{prog.expectedProgress}%</span>
                            </div>
                            <Progress value={prog.expectedProgress} className="h-1.5 bg-secondary/40 [&>div]:bg-slate-400" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black">
                              <span>Actual Progress</span>
                              <span className={prog.status === "Behind" ? "text-rose-600" : "text-emerald-600"}>{prog.actualProgress}%</span>
                            </div>
                            <Progress value={prog.actualProgress} className={`h-1.5 bg-secondary/40 [&>div]:${perfColor}`} />
                          </div>
                        </div>
                      </div>

                      {/* 2. Manager Performance */}
                      <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20 flex gap-4 items-center">
                        <div className="shrink-0 flex flex-col items-center justify-center">
                           <div className="relative h-14 w-14 flex items-center justify-center">
                              <svg className="h-14 w-14 transform -rotate-90">
                                 <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-secondary/20" />
                                 <circle
                                   cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5"
                                   strokeDasharray={151} 
                                   strokeDashoffset={151 - (151 * project.managerPerf.score) / 100}
                                   strokeLinecap="round" className="text-indigo-600"
                                 />
                              </svg>
                              <span className="absolute text-[11px] font-black">{project.managerPerf.score}%</span>
                           </div>
                           <Badge variant="outline" className={`mt-2 border-none text-[7px] font-black uppercase tracking-widest ${
                             project.managerPerf.status === "Excellent" ? "bg-emerald-500/10 text-emerald-600" :
                             project.managerPerf.status === "Needs Attention" ? "bg-rose-500/10 text-rose-600" :
                             "bg-amber-500/10 text-amber-600"
                           }`}>{project.managerPerf.status}</Badge>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-2">
                           <div>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase">Progress</p>
                             <p className="text-xs font-black">{project.managerPerf.progressScore}%</p>
                           </div>
                           <div>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase">Team Comp</p>
                             <p className="text-xs font-black">{project.managerPerf.completionRate}%</p>
                           </div>
                           <div>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase">On-Time</p>
                             <p className="text-xs font-black">{project.managerPerf.onTimeDelivery}%</p>
                           </div>
                           <div>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase">Delay Ctrl</p>
                             <p className="text-xs font-black">{project.managerPerf.delayControl}%</p>
                           </div>
                        </div>
                      </div>

                      {/* 3. Team Performance Overview */}
                      <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
                          <Users className="h-3 w-3" /> Team Performance
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-end border-b border-secondary/30 pb-1">
                             <p className="text-[9px] font-black uppercase text-muted-foreground">Members</p>
                             <p className="text-sm font-black text-slate-700 dark:text-slate-200">{project.members.length}</p>
                          </div>
                          <div className="flex justify-between items-end border-b border-emerald-500/20 pb-1">
                             <p className="text-[9px] font-black uppercase text-emerald-600/70">Efficiency</p>
                             <p className="text-sm font-black text-emerald-600">{project.teamPerf.efficiency}%</p>
                          </div>
                          <div className="flex justify-between items-end border-b border-secondary/30 pb-1">
                             <p className="text-[9px] font-black uppercase text-muted-foreground">Completed</p>
                             <p className="text-sm font-black text-indigo-600">{project.teamPerf.comp}</p>
                          </div>
                          <div className="flex justify-between items-end border-b border-rose-500/20 pb-1">
                             <p className="text-[9px] font-black uppercase text-rose-600/70">Delayed</p>
                             <p className="text-sm font-black text-rose-600">{project.teamPerf.delayed}</p>
                          </div>
                          <div className="flex justify-between items-end border-b border-secondary/30 pb-1 col-span-2">
                             <p className="text-[9px] font-black uppercase text-muted-foreground">Pending Tasks</p>
                             <p className="text-sm font-black text-amber-600">{project.teamPerf.pending}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : null}
                </div>

                {/* ── Expanded Team Details ── */}
                <AnimatePresence>
                  {isExpanded && prog.hasStarted && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/40 bg-secondary/5"
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <ListChecks className="h-4 w-4 text-indigo-500" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-300">Detailed Member Breakdown</h4>
                        </div>
                        <div className="rounded-2xl border border-border/50 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-secondary/30">
                                <tr>
                                  <th className="py-3 px-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Team Member Name</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Assigned Tasks</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Completed</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Pending</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-rose-600/70 uppercase tracking-widest text-center">Delayed</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">On-Time %</th>
                                  <th className="py-3 px-5 text-[9px] font-black text-indigo-600/70 uppercase tracking-widest text-right">Efficiency %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/30">
                                {project.members.map((m: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                                    <td className="py-3 px-5">
                                      <span className="text-xs font-bold text-foreground">{m.name}</span>
                                    </td>
                                    <td className="py-3 px-5 text-center font-bold text-xs">{m.assignedCount}</td>
                                    <td className="py-3 px-5 text-center font-bold text-xs text-emerald-600">{m.completedTasks}</td>
                                    <td className="py-3 px-5 text-center font-bold text-xs text-amber-600">{m.pendingTasks}</td>
                                    <td className="py-3 px-5 text-center font-bold text-xs text-rose-600">{m.delayedTasks}</td>
                                    <td className="py-3 px-5 text-center font-bold text-xs">{m.onTimeRate}%</td>
                                    <td className="py-3 px-5 text-right">
                                      <Badge className={`text-[10px] font-black px-2 py-0.5 border-none ${m.efficiency >= 80 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                        {m.efficiency}%
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

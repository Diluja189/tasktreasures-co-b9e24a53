import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, FolderKanban, CheckCircle2, AlertCircle, 
  BarChart3, Users, Filter, RefreshCw, Eye, 
  ArrowUpRight, TrendingUp, Clock, FileBarChart,
  UserPlus, AlertTriangle, Calendar, GanttChartSquare,
  History, UserCheck, ShieldAlert, TimerOff, PieChart, ChevronRight
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart as RechartsPieChart, Pie, Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Static data still used for charts/risk metrics
import { 
  statusDistribution, 
  performanceData, 
  inactiveProjects,
  riskMetrics
} from "@/data/mockDashboardData";

export function AdminDashboard() {
  const navigate = useNavigate();

  // ── Live data from localStorage ──────────────────────────────────────────
  const [liveProjects, setLiveProjects] = useState<any[]>([]);
  const [liveManagers, setLiveManagers] = useState<any[]>([]);

  const loadData = () => {
    const p = localStorage.getItem("app_projects_persistence");
    const m = localStorage.getItem("app_managers_persistence");
    setLiveProjects(p ? JSON.parse(p) : []);
    setLiveManagers(m ? JSON.parse(m) : []);
  };

  useEffect(() => {
    loadData();
    const handler = (e: StorageEvent) => {
      if (e.key === "app_projects_persistence" || e.key === "app_managers_persistence") {
        loadData();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // ── Computed stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalProjects   = liveProjects.length;
    const activeProjects  = liveProjects.filter(p => p.status === "Active").length;
    const completedTasks  = liveProjects.reduce((s, p) => s + (p.completedTasks || 0), 0);
    const delayedProjects = liveProjects.filter(p => p.status === "Delayed").length;
    const delayedTasks    = liveProjects.reduce((s, p) => s + (p.delayedTasks || 0), 0);
    return [
      { title: "Total Projects",   value: String(totalProjects),   Icon: FolderKanban,   color: "text-blue-500",    bg: "bg-blue-500/10",    subtitle: totalProjects   ? `${activeProjects} active`   : "No projects yet"   },
      { title: "Active Projects",  value: String(activeProjects),  Icon: Clock,          color: "text-indigo-500",  bg: "bg-indigo-500/10",  subtitle: activeProjects  ? "Currently running"         : "None active"        },
      { title: "Completed Tasks",  value: String(completedTasks),  Icon: CheckCircle2,   color: "text-emerald-500", bg: "bg-emerald-500/10", subtitle: completedTasks  ? "Tasks finished"            : "No completions yet" },
      { title: "Delayed Projects", value: String(delayedProjects), Icon: AlertTriangle,  color: "text-amber-500",   bg: "bg-amber-500/10",   subtitle: delayedProjects ? "Need attention"            : "All on track"       },
      { title: "Delayed Tasks",    value: String(delayedTasks),    Icon: AlertCircle,    color: "text-rose-500",    bg: "bg-rose-500/10",    subtitle: delayedTasks    ? "Overdue tasks"             : "No delays detected" },
    ];
  }, [liveProjects]);

  // ── For efficiency intelligence panel ────────────────────────────────────
  const managersWithProjects = useMemo(() =>
    liveManagers.map(m => ({
      ...m,
      assignedProjects: liveProjects.filter(p => p.manager === m.name),
    })),
  [liveManagers, liveProjects]);

  // ── Unassigned count for risk panel ──────────────────────────────────────
  const unassignedCount = liveProjects.filter(p => !p.manager).length;

  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <div className="space-y-8 pb-10 pt-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-xl border border-slate-200/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-[11px] font-black gap-2 hover:bg-white hover:shadow-sm transition-all" 
            onClick={() => navigate("/monitoring")}
          >
            <Filter className="h-3.5 w-3.5 text-indigo-600" /> Filter Projects
          </Button>
          <div className="w-[1px] h-4 bg-slate-300/50" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-[11px] font-black gap-2 hover:bg-white hover:shadow-sm transition-all"
            onClick={() => navigate("/assign-manager")}
          >
            <UserPlus className="h-3.5 w-3.5 text-indigo-600" /> Assign Manager
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-[11px] font-black gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all ml-1"
            onClick={() => navigate("/projects")}
          >
            <Plus className="h-3.5 w-3.5" /> Create Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-full cursor-pointer"
            onClick={() => navigate("/monitoring")}
          >
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:bg-white hover:shadow-md transition-all duration-300 h-full">
              <CardContent className="p-3.5 flex flex-col h-full justify-between">
                <div>
                  <div className={`p-2 rounded-lg w-fit ${stat.bg} ${stat.color} mb-2`}>
                    <stat.Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                  <div className="flex items-end justify-between mt-1">
                    <h3 className="text-xl font-bold tracking-tight">{stat.value}</h3>
                  </div>
                </div>
                <p className="text-[8px] font-medium text-muted-foreground pt-1.5 border-t border-border/10 italic leading-tight mt-2">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Manager & project Intelligence Drill-down */}
        <Card className="lg:col-span-12 border-none shadow-lg bg-slate-50/50 backdrop-blur-md rounded-[24px] overflow-hidden border border-white/50">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                <GanttChartSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight">Efficiency Intelligence</CardTitle>
                <CardDescription className="text-[10px] font-bold text-indigo-600/40 uppercase tracking-[0.2em]">Leadership Audit</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {managersWithProjects.length > 0 ? (
              <div className="space-y-1 max-h-[450px] overflow-y-auto pr-1">
                {managersWithProjects.map(manager => {
                  const isExpanded = selectedManager?.id === manager.id;
                  return (
                    <motion.div
                      key={manager.id}
                      initial={false}
                      animate={{ backgroundColor: isExpanded ? "rgba(243, 232, 255, 1)" : "rgba(255, 255, 255, 0.2)" }}
                      className={`rounded-[16px] border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'shadow-md border-purple-300 ring-1 ring-purple-500/10'
                          : 'border-transparent hover:bg-white/40 hover:border-indigo-100/30'
                      }`}
                    >
                      <button
                        onClick={() => { setSelectedManager(isExpanded ? null : manager); setSelectedProject(null); }}
                        className="w-full p-2 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border-none shadow-none ring-1 ring-indigo-500/10 shrink-0">
                            <AvatarFallback className={`text-[9px] font-black ${isExpanded ? 'bg-purple-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                              {manager.avatar || (manager.name || "").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0,2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <div className="flex items-center gap-1.5">
                              <h4 className={`text-[11px] font-black tracking-tight leading-none transition-colors ${isExpanded ? 'text-purple-700' : 'text-foreground/80'}`}>
                                {manager.name}
                              </h4>
                              {isExpanded && (
                                <Badge className="bg-purple-600 text-[7px] font-black uppercase px-1 h-3 border-none flex items-center text-white">ACTIVE</Badge>
                              )}
                            </div>
                            <p className="text-[8px] font-bold text-muted-foreground/50 uppercase mt-1">
                              {manager.assignedProjects.length} Projects Portfolio
                            </p>
                          </div>
                        </div>
                        <div className={`p-1 rounded-full transition-all duration-300 ${isExpanded ? 'bg-purple-600 text-white rotate-180' : 'bg-indigo-50 text-indigo-600 opacity-60'}`}>
                          <ChevronRight className="h-3 w-3 rotate-90" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-2 pb-2 space-y-1"
                          >
                            {manager.assignedProjects.length > 0 ? (
                              manager.assignedProjects.map((project: any) => {
                                const isProjectExpanded = selectedProject?.id === project.id;
                                return (
                                  <div key={project.id} className="rounded-xl border border-purple-200/50 bg-white shadow-sm overflow-hidden">
                                    <button
                                      onClick={() => setSelectedProject(isProjectExpanded ? null : project)}
                                      className={`w-full text-left p-3 flex flex-col gap-1 hover:bg-purple-50/50 transition-colors ${isProjectExpanded ? 'bg-purple-50/80 border-b border-purple-100' : ''}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-[12px] font-black tracking-tight text-purple-900">{project.name}</h5>
                                        <ChevronRight className={`h-3 w-3 transition-transform ${isProjectExpanded ? 'rotate-90 text-purple-600' : 'text-muted-foreground'}`} />
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-bold text-muted-foreground/60 flex items-center gap-1">
                                          <Calendar className="h-2.5 w-2.5" /> {project.deadline || "No deadline"}
                                        </span>
                                        <span className="text-[9px] font-bold text-muted-foreground/60 flex items-center gap-1">
                                          <BarChart3 className="h-2.5 w-2.5" /> {project.progress || 0}% Done
                                        </span>
                                        <Badge className={`text-[7px] font-black border-none px-1.5 h-3.5 ${
                                          project.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                        }`}>{project.status || "Pending"}</Badge>
                                      </div>
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase">No projects assigned</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center border border-dashed border-indigo-200/50 rounded-2xl bg-indigo-50/5">
                <Users className="h-8 w-8 text-indigo-200 mb-2 opacity-30" />
                <p className="text-[10px] font-black text-indigo-900/30 uppercase tracking-[0.2em]">No Managers Created Yet</p>
                <button
                  onClick={() => navigate("/managers")}
                  className="mt-4 text-[10px] font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200"
                >
                  Go to Manager Management
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manager Performance Chart (Old) */}
        <Card className="lg:col-span-7 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Manager Performance Index</CardTitle>
                <CardDescription className="text-[10px]">Efficiency scores across assigned teams</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => navigate("/performance")}>
                Analytical View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            {performanceData.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Awaiting performance data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card className="lg:col-span-5 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="p-4 pb-0">
             <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-500" /> Status Distribution
             </CardTitle>
             <CardDescription className="text-[10px]">Current project distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex flex-col items-center justify-center">
             {statusDistribution.length > 0 ? (
               <>
                 <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <RechartsPieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={5}
                            dataKey="value"
                          >
                             {statusDistribution.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                             ))}
                          </Pie>
                          <Tooltip />
                       </RechartsPieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-3 gap-4 mt-2 w-full">
                    {statusDistribution.map(item => (
                      <div key={item.name} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/monitoring")}>
                         <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.name}</span>
                         <span className="text-lg font-black" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                 </div>
               </>
             ) : (
               <div className="h-[180px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">No Active Distributions</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Inactive Projects */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Inactive Projects</CardTitle>
            <CardDescription className="text-[9px]">No activity detected in last 3+ days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-1">
             {inactiveProjects.length > 0 ? (
               inactiveProjects.map(p => (
                 <div key={p.name} className="p-2.5 rounded-xl bg-secondary/30 flex items-center justify-between group hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => navigate("/projects")}>
                    <div>
                      <p className="text-[11px] font-bold">{p.name}</p>
                      <p className="text-[9px] text-muted-foreground">Owner: {p.manager}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] opacity-70 italic font-medium p-0 border-none">{p.lastUpdated}</Badge>
                 </div>
               ))
             ) : (
               <div className="py-8 text-center bg-emerald-50/30 rounded-xl border border-dashed border-emerald-100 mb-2">
                  <p className="text-[10px] font-black text-emerald-700/40 uppercase tracking-widest">All systems active</p>
               </div>
             )}
             <Button variant="ghost" className="w-full h-8 text-[9px] font-bold text-primary group gap-2" onClick={() => navigate("/monitoring")}>
                View All Inactive <ArrowUpRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </Button>
          </CardContent>
        </Card>

        {/* Projects Without Manager */}
        <Card className="lg:col-span-3 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl flex flex-col">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Projects Without Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-2 flex-1 text-center justify-center flex flex-col">
             <div className="bg-amber-500/10 rounded-xl p-3 border border-dashed border-amber-500/20">
                <p className="text-3xl font-black text-amber-600 tracking-tighter">{riskMetrics.unassignedCount}</p>
                <p className="text-[9px] font-bold text-amber-700 mt-0.5 uppercase tracking-widest leading-loose">Pending Assignment</p>
             </div>
             <Button className="w-full h-8 text-[10px] font-bold gap-2 rounded-lg mt-1 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20 border-none transition-all active:scale-95" onClick={() => navigate("/assign-manager")}>
               Assign Now <UserPlus className="h-3.5 w-3.5" />
             </Button>
          </CardContent>
        </Card>

        {/* High Risk Actions Card */}
        <Card className="lg:col-span-5 border-none shadow-md bg-rose-600 text-white rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
             <AlertTriangle size={80} />
          </div>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-rose-100/70">Risk Mitigation</CardTitle>
            <CardDescription className="text-rose-100/80 text-[10px]">{riskMetrics.interventionRequirement}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-4">
               <ShieldAlert className="h-5 w-5 text-rose-100 shrink-0 mt-0.5" />
               <p className="text-[11px] leading-snug font-bold">{riskMetrics.riskDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/monitoring")}>
                  View Projects
               </Button>
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/assign-manager")}>
                  Reassign Manager
               </Button>
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/projects")}>
                  Extend Deadline
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

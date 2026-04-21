import { useState, useEffect, useMemo } from "react";
import { 
  FileText, Send, Download, RefreshCw, 
  CheckCircle2, Clock, AlertTriangle, MessageSquare,
  ShieldCheck, ArrowUpRight, FileBarChart, History,
  LayoutDashboard, PieChart, Target, Zap, TimerOff,
  ChevronRight, ListTodo, ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function StatusReportsPage() {
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [managerNote, setManagerNote] = useState("");
  const [risks, setRisks] = useState("");
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const loadAppData = () => {
      const persistedProjects = localStorage.getItem("app_projects_persistence");
      const persistedTasks = localStorage.getItem("app_tasks_persistence");
      const persistedReports = localStorage.getItem("app_status_reports_persistence");
      
      const allProjects = persistedProjects ? JSON.parse(persistedProjects) : [];
      const allTasks = persistedTasks ? JSON.parse(persistedTasks) : [];
      const allReports = persistedReports ? JSON.parse(persistedReports) : [];
      
      setProjectsData(allProjects.filter((p: any) => p.manager && p.manager !== "Unassigned"));
      setTasksData(allTasks);
      setRecentReports(allReports);
    };

    loadAppData();
    window.addEventListener("storage", loadAppData);
    return () => window.removeEventListener("storage", loadAppData);
  }, []);

  const reportableProjects = useMemo(() => {
    return projectsData.map(project => {
      const projectTasks = tasksData.filter(t => t.project === project.name);
      return {
        id: project.id,
        name: project.name,
        completed: projectTasks.filter(t => t.status === "Completed").length,
        inProgress: projectTasks.filter(t => t.status === "In Progress").length,
        delayed: projectTasks.filter(t => {
          const isOverdue = t.status !== "Completed" && t.deadline && new Date(t.deadline) < new Date();
          return t.status === "Delayed" || isOverdue;
        }).length
      };
    });
  }, [projectsData, tasksData]);

  const projectData = useMemo(() => 
    reportableProjects.find(p => p.id === selectedProject)
  , [reportableProjects, selectedProject]);

  const handleSubmitReport = () => {
    if (!selectedProject || !projectData) return toast.error("Please select a target project for the report.");
    
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      project: projectData.name,
      projectId: selectedProject,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      state: "Verified",
      risks,
      managerNote,
      stats: {
        completed: projectData.completed,
        inProgress: projectData.inProgress,
        delayed: projectData.delayed
      }
    };

    const updatedReports = [newReport, ...recentReports].slice(0, 5);
    setRecentReports(updatedReports);
    localStorage.setItem("app_status_reports_persistence", JSON.stringify(updatedReports));
    window.dispatchEvent(new Event("storage"));

    toast.success("Strategic Status Assessment submitted to Admin Layer.");
    setManagerNote("");
    setRisks("");
    setSelectedProject("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900">
             Strategic Status Assessment
           </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 border-border/60 font-bold text-xs text-slate-600" onClick={() => toast.info("Syncing latest lifecycle telemetry...")}>
           <RefreshCw className="h-4 w-4" /> Sync Telemetry
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Report Compilation Console */}
        <div className="xl:col-span-9 space-y-6">
           <Card className="border border-border/50 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-indigo-600 p-6 text-white shrink-0">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                          <ClipboardCheck className="h-5 w-5 text-white" />
                       </div>
                       <div>
                          <CardTitle className="text-xl font-bold tracking-tight">Assessment Composer</CardTitle>
                          <CardDescription className="text-indigo-100/70 text-xs font-medium">Compile high-precision status intelligence</CardDescription>
                       </div>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white bg-white/5 px-3 py-1 rounded-lg font-bold text-[10px] tracking-widest uppercase">Draft Mode</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Select Active Project</label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                       <SelectTrigger className="h-10 rounded-xl border border-border/50 bg-slate-50/50 px-4 font-bold text-sm text-slate-700">
                          <SelectValue placeholder="Target Project Stream" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-border/50 shadow-xl">
                          {reportableProjects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-lg py-2.5 cursor-pointer font-medium text-sm">
                               {p.name}
                            </SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>

                 <AnimatePresence mode="wait">
                    {projectData ? (
                       <motion.div
                         key={projectData.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.98 }}
                         className="space-y-5"
                       >
                          {/* Telemetry Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                             {[
                               { label: "Finalized", val: projectData.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                               { label: "Active", val: projectData.inProgress, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
                               { label: "Risk Delta", val: projectData.delayed, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
                             ].map((stat, i) => (
                               <div key={i} className={`p-4 rounded-2xl ${stat.bg} border border-border/10 flex flex-col items-center justify-center text-center transition-all hover:shadow-inner`}>
                                  <stat.icon className={`h-4 w-4 ${stat.color} mb-1.5`} />
                                  <p className="text-xl font-black text-slate-900 leading-none">{stat.val}</p>
                                  <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">{stat.label}</p>
                                </div>
                             ))}
                          </div>

                          <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                   <Zap className="h-3 w-3 text-rose-500" /> Risks, Blockers & Impediments
                                </label>
                                <Textarea 
                                  placeholder="Document any strategic or technical slippage risk..." 
                                  className="rounded-xl border border-border/50 bg-slate-50/30 min-h-[70px] p-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                                  value={risks}
                                  onChange={(e) => setRisks(e.target.value)}
                                />
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                   <MessageSquare className="h-3 w-3 text-indigo-500" /> Executive Summary & Managerial Notes
                                </label>
                                <Textarea 
                                  placeholder="Provide descriptive assessment of current implementation velocity..." 
                                  className="rounded-xl border border-border/50 bg-slate-50/30 min-h-[70px] p-3 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                  value={managerNote}
                                  onChange={(e) => setManagerNote(e.target.value)}
                                />
                             </div>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row gap-3">
                             <Button 
                               className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 font-bold text-xs uppercase tracking-widest gap-2"
                               onClick={handleSubmitReport}
                             >
                                <Send className="h-4 w-4" /> Submit to Admin
                             </Button>
                             <Button 
                               variant="outline" 
                               className="h-10 px-6 rounded-xl border-border/60 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest gap-2"
                               onClick={() => toast.info("Exporting Assessment Data...")}
                             >
                                <Download className="h-4 w-4" /> Export Summary
                             </Button>
                          </div>
                       </motion.div>
                    ) : (
                       <div className="py-24 text-center flex flex-col items-center justify-center space-y-6">
                          <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-border/50">
                             <FileBarChart className="h-8 w-8 text-slate-300" />
                          </div>
                          <div>
                             <p className="text-lg font-bold text-slate-900">Awaiting Project Selection</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Select a project stream above to begin compilation.</p>
                          </div>
                       </div>
                    )}
                 </AnimatePresence>
              </CardContent>
           </Card>
        </div>

        {/* Audit History & Guidelines Sidebar */}
        <div className="xl:col-span-3 space-y-6">
           <Card className="border border-border/50 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-6 border-b border-border/40 flex flex-row items-center justify-between">
                 <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 leading-none">
                    <History className="h-3.5 w-3.5 text-indigo-500" /> Recent Submissions
                 </CardTitle>
                 <ArrowUpRight className="h-4 w-4 text-slate-300" />
              </CardHeader>
              <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {recentReports.map((h, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                         <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{h.project}</p>
                            <Badge className={`${h.state === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} border text-[8px] font-bold uppercase h-5 px-1.5 leading-none shadow-none`}>
                               {h.state}
                            </Badge>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2"><Clock className="h-3 w-3" /> {h.date}</p>
                      </div>
                    ))}
                    {recentReports.length === 0 && (
                      <div className="p-10 text-center">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-relaxed">No reports submitted in the current cycle</p>
                      </div>
                    )}
                 </div>
                 <Button variant="ghost" className="w-full h-12 rounded-none text-[9px] font-bold uppercase tracking-widest bg-slate-50/50 hover:bg-slate-100 text-slate-500 gap-2 border-t border-border/40">
                    View Intelligence Vault <ChevronRight className="h-3 w-3" />
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-none shadow-md bg-indigo-600 text-white rounded-2xl overflow-hidden p-8 relative group">
              <div className="absolute -bottom-4 -left-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <ShieldCheck size={180} />
              </div>
              <div className="relative space-y-6">
                 <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold tracking-tight">Status Reporting</h4>
                    <p className="text-[10px] text-indigo-100/60 font-bold uppercase tracking-widest mt-1">Operational Guidelines</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xs leading-relaxed text-indigo-100/80 font-medium">
                       Professional status reports should quantify velocity deltas. Ensure "Risk Delta" is substantiated with clear technical blockers.
                    </p>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" /> <span className="text-[10px] font-bold tracking-wider">Quantify Throughput</span></div>
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" /> <span className="text-[10px] font-bold tracking-wider">Identify Clear Blockers</span></div>
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" /> <span className="text-[10px] font-bold tracking-wider">Predictive Timelines</span></div>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full h-10 border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[9px] tracking-widest rounded-xl transition-all">
                    Audit Handbook
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

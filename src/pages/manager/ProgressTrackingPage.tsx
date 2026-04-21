import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Filter, Search, RefreshCw, 
  AlertTriangle, CheckCircle2, 
  LayoutGrid, List, Activity, 
  GanttChart, Calendar, ArrowUpRight,
  ShieldAlert, Timer, ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";



const statusStyles = {
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Not Started": "bg-slate-500/10 text-slate-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none animate-pulse",
};

export default function ProgressTrackingPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [projectFilter, setProjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [trackingItems, setTrackingItems] = useState<any[]>([]);

  useEffect(() => {
    const loadTrackingTasks = () => {
      const persisted = localStorage.getItem("app_tasks_persistence");
      setTrackingItems(persisted ? JSON.parse(persisted) : []);
    };
    loadTrackingTasks();
    window.addEventListener("storage", loadTrackingTasks);
    return () => window.removeEventListener("storage", loadTrackingTasks);
  }, []);

  const kanbanColumns = ["Not Started", "In Progress", "Completed", "Delayed"];

  // Helper aggregate function just for UI layout
  const projectHighlights = Array.from(new Set(trackingItems.map(t => t.project))).map(projName => {
    const projTasks = trackingItems.filter(t => t.project === projName);
    const comps = projTasks.filter(t => t.status === "Completed").length;
    const dels = projTasks.filter(t => t.status === "Delayed" || t.status === "Overdue").length;
    return {
      name: projName,
      total: projTasks.length,
      completed: comps,
      delayed: dels,
      health: projTasks.length > 0 ? Math.round((comps / projTasks.length) * 100) : 0
    };
  });

  const filteredItems = trackingItems.filter(item => {
    const matchesProject = projectFilter === "All" || item.project === projectFilter;
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.assignee || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const totalProjects = new Set(trackingItems.map(i => i.project)).size;
  const activeTasks = trackingItems.length;
  const completedTasks = trackingItems.filter(i => i.status === "Completed").length;
  const delayedTasks = trackingItems.filter(i => i.status === "Delayed").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Operational Velocity Tracker
        </h1>
        
        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 px-4 border border-border bg-white shadow-sm font-bold text-xs" onClick={() => toast.info("Recalculating project health...")}>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" /> Refresh
           </Button>
           <div className="bg-secondary/40 p-1 rounded-xl flex items-center gap-1 h-10 border border-border/50 shadow-sm">
              <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" className={`h-8 rounded-lg font-bold text-xs px-3 ${viewMode === 'kanban' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`} onClick={() => setViewMode('kanban')}>
                 <LayoutGrid className="h-3.5 w-3.5 mr-2" /> Kanban
              </Button>
              <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className={`h-8 rounded-lg font-bold text-xs px-3 ${viewMode === 'table' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`} onClick={() => setViewMode('table')}>
                 <List className="h-3.5 w-3.5 mr-2" /> List
              </Button>
           </div>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><GanttChart className="w-4 h-4" /></div>
             <div>
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Projects</p>
               <p className="text-xl font-black text-foreground">{totalProjects}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-4 h-4" /></div>
             <div>
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Active Tasks</p>
               <p className="text-xl font-black text-foreground">{activeTasks}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-4 h-4" /></div>
             <div>
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Completed</p>
               <p className="text-xl font-black text-foreground">{completedTasks}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-4 h-4" /></div>
             <div>
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Delayed</p>
               <p className="text-xl font-black text-rose-600">{delayedTasks}</p>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Project Health Snapshots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
         {projectHighlights.map(p => (
           <Card key={p.name} className="border border-border/50 shadow-sm bg-white rounded-2xl overflow-hidden relative group">
              <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                 <Activity size={100} />
              </div>
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                          {p.name[0]}
                       </div>
                       <div>
                          <p className="font-bold text-base text-foreground tracking-tight leading-tight">{p.name}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1">{p.total} Total Units</p>
                       </div>
                    </div>
                    <Badge variant="outline" className={`${p.health > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'} text-[10px] font-black uppercase px-2 py-1`}>
                       {p.health}% Health
                    </Badge>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                          <span>Progress Overall</span>
                          <span className="font-bold text-foreground">{p.health}%</span>
                       </div>
                       <Progress value={p.health} className={`h-2 min-w-full bg-secondary ${p.health > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'}`} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                       <div className="bg-secondary/30 p-3 rounded-xl border border-border/40 text-center">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Done</p>
                          <p className="text-sm font-black text-emerald-600">{p.completed}</p>
                       </div>
                       <div className="bg-secondary/30 p-3 rounded-xl border border-border/40 text-center">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Active</p>
                          <p className="text-sm font-black text-indigo-600">{p.total - p.completed - p.delayed}</p>
                       </div>
                       <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-center">
                          <p className="text-[10px] font-bold uppercase text-rose-500 mb-1">Risk</p>
                          <p className="text-sm font-black text-rose-600">{p.delayed}</p>
                       </div>
                    </div>

                    <Button variant="outline" className="w-full text-xs font-bold h-10 rounded-xl relative z-10 hover:bg-slate-50 transition-colors" onClick={() => navigate("/manager/tasks")}>
                      View Project
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* Control Module */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-4 rounded-2xl border border-border/50 shadow-sm">
         <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search specific tasks or assignees..." 
              className="pl-11 h-11 border border-border/50 bg-secondary/10 rounded-xl text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-11 rounded-xl border border-border/50 bg-secondary/10 w-full lg:w-[200px] font-bold text-xs">
                  <SelectValue placeholder="All Projects" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="All">All Projects</SelectItem>
               </SelectContent>
            </Select>
            <Button className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 px-6 flex-1 lg:flex-none shadow-sm text-xs">
               <GanttChart className="h-4 w-4" /> Timeline
            </Button>
         </div>
      </div>

      {/* Dynamic Viewport */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-10">
           {[...filteredItems].sort((a, b) => {
              const priorityWeights: Record<string, number> = { "High": 3, "Medium": 2, "Low": 1 };
              return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
           }).map((item, i) => {
              const isDelayed = item.status === 'Delayed';
              const isCompleted = item.status === 'Completed';
              return (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="w-full h-full"
                 >
                    <Card className={`w-full h-[320px] shadow-sm bg-white rounded-xl transition-all flex flex-col ${isDelayed ? 'bg-rose-50/40 border-rose-200 border text-rose-900' : 'border border-border/40 hover:border-indigo-300/50 hover:shadow-md hover:shadow-indigo-100/30'}`}>
                       <CardContent className="p-6 flex flex-col items-start justify-start flex-1 h-full w-full">
                          {/* Project Section Heading (Metadata style) */}
                          <div className="mb-2 shrink-0">
                             <p className="text-[10px] font-bold text-indigo-600/80 uppercase tracking-widest leading-none">{item.project}</p>
                          </div>

                          {/* Task Title */}
                          <div className="mb-3 shrink-0 h-12">
                             <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2">{item.name}</h3>
                          </div>

                          {/* Horizontal Badge Row */}
                          <div className="flex items-center justify-start gap-2 mb-4 shrink-0">
                             <Badge className={`${item.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : item.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} text-[10px] px-2 py-0.5 font-bold border rounded shadow-none`}>{item.priority}</Badge>
                             <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border rounded shadow-none ${isDelayed ? 'bg-rose-50/50 text-rose-600 border-rose-200' : isCompleted ? 'bg-emerald-50/50 text-emerald-600 border-emerald-200' : 'bg-slate-50/50 text-slate-600 border-slate-200'}`}>{item.status}</Badge>
                          </div>

                          {/* Owner Selection Row */}
                          <div className="flex items-center justify-start gap-3 mb-5 p-2 bg-slate-50/60 rounded-xl h-10 border border-slate-100 w-full shrink-0">
                             <div className="h-6 w-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-slate-200 shrink-0">
                               {item.assignee.split(' ').map(n=>n[0]).join('')}
                             </div>
                             <div className="flex flex-1 items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">{item.assignee}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100 shrink-0 uppercase tracking-tighter">3 units</span>
                             </div>
                          </div>

                          {/* Dual Meta Statistics Row */}
                          <div className="grid grid-cols-2 gap-4 mb-4 w-full shrink-0">
                             <div className="flex flex-col items-start">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target</span>
                                <span className={`text-xs font-semibold ${isDelayed ? 'text-rose-600' : 'text-slate-700'}`}>{item.deadline}</span>
                             </div>
                             <div className="flex flex-col items-start border-l border-slate-100 pl-4">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</span>
                                <span className="text-xs font-semibold text-slate-700">{item.priority === 'High' ? '32' : '16'}h</span>
                             </div>
                          </div>

                          {/* Fixed Bottom Action */}
                          <div className="w-full mt-auto pt-4 border-t border-slate-100 shrink-0">
                             <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 justify-between px-1 h-8 group" onClick={() => toast.info("Opening audit log...")}>
                               <span>Unit Audit Log</span>
                               <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                 </motion.div>
              );
           })}
        </div>
      ) : (
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
           <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-secondary/20 border-b border-border/50">
                       <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Work Unit</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Stream</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Velocity</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audit State</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       {filteredItems.map(item => (
                         <tr key={item.id} className="hover:bg-secondary/10 transition-colors group">
                            <td className="px-6 py-5">
                               <p className="text-sm font-bold tracking-tight italic group-hover:text-primary transition-colors">{item.name}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 mt-0.5 leading-none">{item.assignee}</p>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-muted-foreground/80">{item.project}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                               <div className="flex items-center justify-center gap-3">
                                  <Progress value={item.progress} className="h-1 w-20" />
                                  <span className="text-[10px] font-black">{item.progress}%</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <Badge className={`${statusStyles[item.status as keyof typeof statusStyles]} text-[8px] font-bold uppercase`}>{item.status}</Badge>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col">
                                  <span className={`text-[11px] font-black flex items-center gap-1.5 ${item.status === 'Delayed' ? 'text-rose-500' : ''}`}><Calendar className="h-3 w-3" /> {item.deadline}</span>
                                  {item.status === 'Delayed' && <span className="text-[8px] text-rose-400 font-bold uppercase mt-0.5 italic flex items-center gap-1"><ShieldAlert className="h-2.5 w-2.5" /> Overdue</span>}
                               </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <Button variant="ghost" size="icon" className="h-9 w-9 p-0 rounded-xl" onClick={() => toast.info("Opening detail audit...")}>
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
           </CardContent>
        </Card>
      )}

      {/* Intervention Module */}
       <AnimatePresence>
          {filteredItems.some(t => t.status === 'Delayed') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 p-6 bg-rose-600 text-white rounded-[2.5rem] shadow-2xl shadow-rose-600/20 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Timer size={180} />
               </div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center shrink-0 border border-white/20 animate-pulse shadow-inner">
                        <AlertTriangle className="h-8 w-8 text-white" />
                     </div>
                     <div className="text-center md:text-left">
                        <h4 className="text-xl font-black italic tracking-tight">Critical Variance Detected</h4>
                        <p className="text-rose-100/80 text-sm font-medium leading-relaxed max-w-lg mt-1">
                          {filteredItems.filter(t => t.status === 'Delayed').length} Operational units are currently failing baseline timeline audits. Address blockers immediately to avoid lifecycle slippage.
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <Button className="flex-1 md:flex-none h-12 px-8 bg-white text-rose-600 hover:bg-rose-50 font-black uppercase text-[10px] tracking-widest rounded-2xl border-none transition-all active:scale-95 shadow-xl">
                        Address Blockers
                     </Button>
                     <Button variant="outline" className="flex-1 md:flex-none h-12 px-8 border-white/20 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl border-dashed transition-all active:scale-95">
                        Project Audit
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

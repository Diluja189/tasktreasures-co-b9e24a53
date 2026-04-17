import { useState } from "react";
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

const trackingItems = [
  { id: "T1", name: "OAuth Integration", project: "Security Infrastructure", status: "In Progress", progress: 65, deadline: "Apr 20", assignee: "Sarah Chen", priority: "High" },
  { id: "T2", name: "S3 Bucket Setup", project: "Cloud Migration", status: "Completed", progress: 100, deadline: "Apr 15", assignee: "David Kim", priority: "Medium" },
  { id: "T3", name: "UI Polish", project: "SaaS Dashboard", status: "Delayed", progress: 30, deadline: "Apr 12", assignee: "Mike Chen", priority: "High" },
  { id: "T4", name: "DB Indexing", project: "Cloud Migration", status: "In Progress", progress: 85, deadline: "Apr 22", assignee: "Sarah Chen", priority: "Medium" },
  { id: "T5", name: "Docs Audit", project: "Legacy Cleanup", status: "Not Started", progress: 0, deadline: "May 05", assignee: "Anna Bell", priority: "Low" },
];

const projectHighlights = [
  { name: "Cloud Migration", total: 12, completed: 8, delayed: 0, health: 92 },
  { name: "SaaS Dashboard", total: 8, completed: 3, delayed: 2, health: 68 },
];

const statusStyles = {
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Not Started": "bg-slate-500/10 text-slate-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none animate-pulse",
};

export default function ProgressTrackingPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [projectFilter, setProjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const kanbanColumns = ["Not Started", "In Progress", "Completed", "Delayed"];

  const filteredItems = trackingItems.filter(item => {
    const matchesProject = projectFilter === "All" || item.project === projectFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
             Operational Velocity Tracker
           </h1>
           <p className="text-muted-foreground mt-2">Monitor implementation depth and timeline adherence across your leadership scope.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => toast.info("Recalculating project health...")}>
              <RefreshCw className="h-4 w-4" /> Hard Refresh
           </Button>
           <div className="bg-secondary/30 p-1 rounded-xl flex gap-1 h-9">
              <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" className="h-7 rounded-lg" onClick={() => setViewMode('kanban')}>
                 <LayoutGrid className="h-3 w-3 mr-2" /> Kanban
              </Button>
              <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 rounded-lg" onClick={() => setViewMode('table')}>
                 <List className="h-3 w-3 mr-2" /> List View
              </Button>
           </div>
        </div>
      </div>

      {/* Project Health Snapshots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {projectHighlights.map(p => (
           <Card key={p.name} className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Activity size={100} />
              </div>
              <CardContent className="p-6">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
                          {p.name[0]}
                       </div>
                       <div>
                          <p className="font-bold text-sm tracking-tight">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">{p.total} Active Units</p>
                       </div>
                    </div>
                    <Badge variant="outline" className={`${p.health > 80 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'} text-[9px] font-black uppercase`}>
                       {p.health}% Health
                    </Badge>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Progress value={p.health} className={`h-2 flex-1 rounded-full ${p.health > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'}`} />
                       <span className="text-xs font-black min-w-[32px] text-right">{p.health}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-secondary/30 p-2 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-muted-foreground/60 mb-0.5">Done</p>
                          <p className="text-sm font-black text-emerald-600">{p.completed}</p>
                       </div>
                       <div className="bg-secondary/30 p-2 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-muted-foreground/60 mb-0.5">Ops</p>
                          <p className="text-sm font-black text-indigo-600">{p.total - p.completed - p.delayed}</p>
                       </div>
                       <div className="bg-secondary/30 p-2 rounded-xl text-center border border-dashed border-rose-500/20">
                          <p className="text-[9px] font-black uppercase text-rose-400 mb-0.5">Risk</p>
                          <p className="text-sm font-black text-rose-600">{p.delayed}</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* Control Module */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter roadmap tracking..." 
              className="pl-10 h-10 border-none bg-background rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full lg:w-56 font-bold text-[11px]">
                  <SelectValue placeholder="All Projects" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="All">All Projects</SelectItem>
                  <SelectItem value="Security Infrastructure">Security Infrastructure</SelectItem>
                  <SelectItem value="Cloud Migration">Cloud Migration</SelectItem>
                  <SelectItem value="SaaS Dashboard">SaaS Dashboard</SelectItem>
               </SelectContent>
            </Select>
            <Button variant="secondary" className="h-10 rounded-xl gap-2 px-6 flex-1 lg:flex-none">
               <GanttChart className="h-4 w-4" /> Timeline Audit
            </Button>
         </div>
      </div>

      {/* Dynamic Viewport */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
           {kanbanColumns.map(column => (
             <div key={column} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${column === 'Delayed' ? 'bg-rose-500 animate-pulse' : (column === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500')}`} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{column}</p>
                   </div>
                   <Badge variant="secondary" className="bg-secondary/40 text-[9px] font-bold h-5 px-1.5">{filteredItems.filter(t => t.status === column).length}</Badge>
                </div>
                
                <div className="space-y-4 min-h-[400px] bg-secondary/10 rounded-3xl p-3 border border-dashed border-border/40">
                   {filteredItems.filter(t => t.status === column).map((item, i) => (
                     <motion.div
                       key={item.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                     >
                        <Card className="border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all border border-indigo-500/0 hover:border-indigo-500/10">
                           <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start mb-1">
                                 <p className="text-[9px] font-black uppercase tracking-tight text-indigo-600/60 leading-none">{item.project}</p>
                                 <Badge className={`${item.priority === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-indigo-500/10 text-indigo-600'} border-none text-[7px] h-3.5 leading-none font-black`}>{item.priority}</Badge>
                              </div>
                              <CardTitle className="text-xs font-bold leading-tight italic group-hover:text-primary transition-colors">{item.name}</CardTitle>
                           </CardHeader>
                           <CardContent className="p-4 pt-2 space-y-4">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-[7px] font-black border border-indigo-500/10">
                                       {item.assignee.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <span className="text-[9px] font-bold">{item.assignee}</span>
                                 </div>
                                 <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${item.status === 'Delayed' ? 'text-rose-500' : 'text-muted-foreground'}`}>
                                    <Calendar className="h-2.5 w-2.5" /> {item.deadline}
                                 </span>
                              </div>
                              {column !== 'Not Started' && (
                                <div className="space-y-1.5">
                                   <div className="flex justify-between text-[8px] font-black tracking-widest text-muted-foreground/50">
                                      <span>EXECUTION</span>
                                      <span>{item.progress}%</span>
                                   </div>
                                   <Progress value={item.progress} className={`h-1 rounded-full ${item.status === 'Delayed' ? '[&>div]:bg-rose-500' : (item.progress > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-indigo-600')}`} />
                                </div>
                              )}
                              <Button variant="ghost" className="w-full h-7 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1 border-none hover:bg-secondary group" onClick={() => toast.info("Opening audit context...")}>
                                 Inspect <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </Button>
                           </CardContent>
                        </Card>
                     </motion.div>
                   ))}
                </div>
             </div>
           ))}
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

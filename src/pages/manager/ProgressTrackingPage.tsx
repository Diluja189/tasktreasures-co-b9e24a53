import { useState, useMemo } from "react";
import { 
  Filter, Search, RefreshCw, 
  AlertTriangle, CheckCircle2, 
  LayoutGrid, List, Activity, 
  GanttChart, Calendar, ArrowUpRight,
  ShieldAlert, Timer, ChevronRight,
  Clock, MoreVertical, Edit3, Lock, Trash2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_TRACKING_ITEMS = [
  { id: "T1", name: "OAuth Integration", project: "Security Infrastructure", status: "In Progress", progress: 65, deadline: "Apr 20", assignee: "Sarah Chen", priority: "High", description: "Implement OAuth2.0 authentication flow.", isFinal: false },
  { id: "T2", name: "S3 Bucket Setup", project: "Cloud Migration", status: "Completed", progress: 100, deadline: "Apr 15", assignee: "David Kim", priority: "Medium", description: "Configuring S3 buckets for storage.", isFinal: false },
  { id: "T3", name: "UI Polish", project: "SaaS Dashboard", status: "Delayed", progress: 30, deadline: "Apr 12", assignee: "Mike Chen", priority: "High", description: "Final UI refinements for the dashboard.", isFinal: false },
  { id: "T4", name: "DB Indexing", project: "Cloud Migration", status: "In Progress", progress: 85, deadline: "Apr 22", assignee: "Sarah Chen", priority: "Medium", description: "Optimizing database queries.", isFinal: false },
  { id: "T5", name: "Docs Audit", project: "Legacy Cleanup", status: "Not Started", progress: 0, deadline: "May 05", assignee: "Anna Bell", priority: "Low", description: "Auditing internal documentation.", isFinal: false },
];

const statusStyles = {
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Not Started": "bg-slate-500/10 text-slate-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none animate-pulse",
  "Final": "bg-slate-900 text-white border-none",
};

export default function ProgressTrackingPage() {
  const [items, setItems] = useState(INITIAL_TRACKING_ITEMS);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [projectFilter, setProjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Action States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);
  const [isPurgeConfirmOpen, setIsPurgeConfirmOpen] = useState(false);
  const [purgeInput, setPurgeInput] = useState("");
  const [targetItemId, setTargetItemId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredItems = useMemo(() => items.filter(item => {
    const matchesProject = projectFilter === "All" || item.project === projectFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  }), [items, projectFilter, searchQuery]);

  const projectHighlights = useMemo(() => {
    const projects = Array.from(new Set(items.map(i => i.project)));
    return projects.map(proj => {
      const projItems = items.filter(i => i.project === proj);
      const total = projItems.length;
      const completed = projItems.filter(i => i.status === "Completed" || i.status === "Final").length;
      const delayed = projItems.filter(i => i.status === "Delayed").length;
      const health = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { name: proj, total, completed, delayed, health };
    });
  }, [items]);

  const totalProjects = projectHighlights.length;
  const activeTasks = items.length;
  const completedTasks = items.filter(i => i.status === "Completed" || i.status === "Final").length;
  const delayedTasks = items.filter(i => i.status === "Delayed").length;

  // Handlers
  const handleEditClick = (item: any) => {
    if (item.isFinal) {
      toast.error("Fixed State Error", { description: "Finalized units cannot be modified." });
      return;
    }
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      setIsEditDialogOpen(false);
      setIsProcessing(false);
      toast.success("Unit Synchronized", { description: `${editingItem.name} has been successfully updated.` });
    }, 800);
  };

  const handleMarkFinalClick = (id: string) => {
    setTargetItemId(id);
    setIsFinalConfirmOpen(true);
  };

  const confirmMarkFinal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setItems(prev => prev.map(i => i.id === targetItemId ? { ...i, isFinal: true, status: "Final", progress: 100 } : i));
      setIsFinalConfirmOpen(false);
      setIsProcessing(false);
      toast.success("Unit Immutable", { 
        description: "The unit has been locked and marked as Final.",
        icon: <ShieldAlert className="h-4 w-4" />
      });
    }, 1000);
  };

  const handlePurgeClick = (id: string) => {
    setTargetItemId(id);
    setIsPurgeConfirmOpen(true);
    setPurgeInput("");
  };

  const confirmPurge = () => {
    if (purgeInput !== "DELETE") {
      toast.error("Confirmation Invalid", { description: "Please type DELETE to proceed." });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== targetItemId));
      setIsPurgeConfirmOpen(false);
      setIsProcessing(false);
      toast.error("Unit Purged", { description: "The work unit was permanently removed from the ledger." });
    }, 1200);
  };

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
               <div className="flex items-baseline gap-2">
                 <p className="text-xl font-black text-foreground">{completedTasks}</p>
                 <p className="text-[10px] font-black text-emerald-600 italic">
                   {activeTasks > 0 ? Math.round((completedTasks/activeTasks) * 100) : 0}% Eff.
                 </p>
               </div>
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

                    <Button variant="outline" className="w-full text-xs font-bold h-10 rounded-xl relative z-10 hover:bg-slate-50 transition-colors">
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
                  <SelectItem value="Security Infrastructure">Security Infrastructure</SelectItem>
                  <SelectItem value="Cloud Migration">Cloud Migration</SelectItem>
                  <SelectItem value="SaaS Dashboard">SaaS Dashboard</SelectItem>
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
                       <CardContent className="p-6 flex flex-col items-start justify-start flex-1 h-full w-full relative">
                          {/* Quick Action Dropdown */}
                          <div className="absolute top-4 right-4 z-20">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-slate-100">
                                      < MoreVertical className="h-4 w-4" />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-2xl p-2">
                                   <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 cursor-pointer" onClick={() => handleEditClick(item)} disabled={item.isFinal}>
                                      <Edit3 className="h-4 w-4 text-indigo-500" /> Edit Unit
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 cursor-pointer" onClick={() => handleMarkFinalClick(item.id)} disabled={item.isFinal}>
                                      <Lock className="h-4 w-4 text-emerald-500" /> Mark Final
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                   <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer" onClick={() => handlePurgeClick(item.id)}>
                                      <Trash2 className="h-4 w-4" /> Purge
                                   </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </div>

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
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-9 w-9 p-0 rounded-xl">
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-2xl p-2">
                                     <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 cursor-pointer" onClick={() => handleEditClick(item)} disabled={item.isFinal}>
                                        <Edit3 className="h-4 w-4 text-indigo-500" /> Edit Unit
                                     </DropdownMenuItem>
                                     <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 cursor-pointer" onClick={() => handleMarkFinalClick(item.id)} disabled={item.isFinal}>
                                        <Lock className="h-4 w-4 text-emerald-500" /> Mark Final
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                     <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs gap-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer" onClick={() => handlePurgeClick(item.id)}>
                                        <Trash2 className="h-4 w-4" /> Purge
                                     </DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
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

        {/* --- Modals (Manager Controls) --- */}

        {/* Edit Unit Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-[500px] p-0 overflow-hidden">
            <DialogHeader className="p-6 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-400" /> Synchronize Unit
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">
                Operational metadata adjustment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit Identifier</Label>
                <Input value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="rounded-xl h-11 border-slate-100 bg-slate-50/50 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Velocity (%)</Label>
                  <Input type="number" value={editingItem?.progress || 0} onChange={e => setEditingItem({...editingItem, progress: parseInt(e.target.value)})} className="rounded-xl h-11 border-slate-100 bg-slate-50/50 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lifecycle Status</Label>
                  <Select value={editingItem?.status || ''} onValueChange={val => setEditingItem({...editingItem, status: val})}>
                    <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50/50 font-bold">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                       <SelectItem value="Not Started">Not Started</SelectItem>
                       <SelectItem value="In Progress">In Progress</SelectItem>
                       <SelectItem value="Completed">Completed</SelectItem>
                       <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategic Intent</Label>
                <Textarea value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="rounded-xl min-h-[100px] border-slate-100 bg-slate-50/50 font-medium text-sm" />
              </div>
              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button type="submit" className="rounded-xl font-bold bg-slate-900 text-white px-8" disabled={isProcessing}>
                  {isProcessing ? "Syncing..." : "Apply Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Mark Final Confirmation */}
        <Dialog open={isFinalConfirmOpen} onOpenChange={setIsFinalConfirmOpen}>
          <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-[450px]">
             <DialogHeader>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                   <Lock className="h-8 w-8 text-emerald-600" />
                </div>
                <DialogTitle className="text-xl font-black italic">Finalize Unit State?</DialogTitle>
                <DialogDescription className="text-sm font-medium text-slate-500">
                  Marking this unit as final will lock its metadata and categorize it as immutable. This action cannot be undone.
                </DialogDescription>
             </DialogHeader>
             <DialogFooter className="mt-6 gap-2 sm:gap-0">
                <Button variant="ghost" onClick={() => setIsFinalConfirmOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={confirmMarkFinal} className="bg-slate-900 text-white rounded-xl font-bold px-8" disabled={isProcessing}>
                   {isProcessing ? "Locking..." : "Confirm Finalization"}
                </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Purge Confirmation */}
        <Dialog open={isPurgeConfirmOpen} onOpenChange={setIsPurgeConfirmOpen}>
           <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-[450px]">
              <DialogHeader>
                 <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-100">
                    <Trash2 className="h-8 w-8 text-rose-600" />
                 </div>
                 <DialogTitle className="text-xl font-black italic text-rose-600">Permanently Purge Unit?</DialogTitle>
                 <DialogDescription className="text-sm font-medium text-slate-500">
                   You are about to permanently erase this operational unit from the system records. This is a destructive action.
                 </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3">
                 <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type "DELETE" to confirm purge</Label>
                 <Input 
                   placeholder="Type DELETE" 
                   value={purgeInput} 
                   onChange={e => setPurgeInput(e.target.value)}
                   className="rounded-xl h-11 border-rose-100 bg-rose-50/50 font-black text-rose-600 text-center tracking-widest uppercase"
                 />
              </div>
              <DialogFooter className="mt-2 gap-2 sm:gap-0">
                 <Button variant="ghost" onClick={() => setIsPurgeConfirmOpen(false)} className="rounded-xl font-bold text-slate-400">Cancel</Button>
                 <Button 
                   onClick={confirmPurge} 
                   className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-rose-200" 
                   disabled={isProcessing || purgeInput !== "DELETE"}
                 >
                    {isProcessing ? "Purging..." : "Confirm Purge"}
                 </Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    </div>
  );
}

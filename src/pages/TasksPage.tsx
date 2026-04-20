import { useState, useEffect } from "react";
import { 
  Plus, Search, Filter, RefreshCw, 
  CheckCircle2, Clock, Calendar, User,
  MoreVertical, Edit2, Trash2, ListPlus,
  Target, BarChart3, ChevronRight, LayoutGrid,
  List, Timer, ArrowUpRight, ShieldCheck,
  UserCircle, Workflow, AlertCircle, AlertTriangle,
  CalendarDays, UserPlus, CheckCircle, Info, Hash,
  Briefcase, FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [managerFilter, setManagerFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    const loadTasks = () => {
      let persisted = localStorage.getItem("app_tasks_persistence");
      
      // Auto-inject dummy test data if empty to test the UI metrics!
      if (!persisted || JSON.parse(persisted).length === 0) {
         const dummyData = [
           { id: "TSK-001", name: "Build Authentication Logic", description: "Establish secure JWT backend structures", project: "Warehouse System", manager: "Diluja", assignee: "Designer Team", status: "In Progress", priority: "High", progress: 65, deadline: "2026-10-15", createdDate: "2026-04-10" },
           { id: "TSK-002", name: "Create Database Schema", description: "Audit data models", project: "Warehouse System", manager: "Diluja", assignee: "Backend Dev", status: "Completed", priority: "Medium", progress: 100, deadline: "2026-04-05", createdDate: "2026-03-22" },
           { id: "TSK-003", name: "Setup Server Infrastructure", description: "Connect cloud APIs", project: "Warehouse System", manager: "Diluja", assignee: "Designer Team", status: "Not Started", priority: "Low", progress: 0, deadline: "2026-02-12", createdDate: "2026-01-10" }, // Delayed
           { id: "TSK-004", name: "Critical System Patch", description: "Fix critical vulnerability", project: "Security Overhaul", manager: "Desingner", assignee: "Backend Dev", status: "In Progress", priority: "High", progress: 20, deadline: "2023-10-10", createdDate: "2023-10-01" }, // Overdue
           { id: "TSK-005", name: "UI Components Library", description: "Build out generic React blocks", project: "Warehouse System", manager: "Desingner", assignee: "Frontend Dev", status: "Not Started", priority: "Medium", progress: 0, deadline: "2026-12-05", createdDate: "2026-04-15" }
         ];
         localStorage.setItem("app_tasks_persistence", JSON.stringify(dummyData));
         persisted = JSON.stringify(dummyData);
      }
      setTasks(JSON.parse(persisted));
    };
    loadTasks();
    window.addEventListener("storage", loadTasks);
    return () => window.removeEventListener("storage", loadTasks);
  }, [forceRender]);

  // Derived Dynamic Status Logic
  const processedTasks = tasks.map(t => {
    let dynamicStatus = t.status;
    let isDelayOrOverdue = false;

    if (t.status !== 'Completed') {
      const deadlineDate = new Date(t.deadline);
      const today = new Date();
      deadlineDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);

      if (today > deadlineDate) {
        if (t.priority === 'High') {
          dynamicStatus = 'Overdue';
        } else {
          dynamicStatus = 'Delayed';
        }
        isDelayOrOverdue = true;
      }
    }

    // Dynamic Execution Progress constraint
    let dynamicProgress = Number(t.progress || 0);
    if (dynamicStatus === 'Completed') dynamicProgress = 100;
    else if (dynamicStatus === 'Not Started') dynamicProgress = 0;

    return {
      ...t,
      dynamicStatus,
      dynamicProgress,
      isDelayOrOverdue
    };
  });

  const managers = Array.from(new Set(processedTasks.map(t => t.manager)));

  const filtered = processedTasks.filter(t => {
    const rawSearch = searchQuery.toLowerCase();
    const matchesSearch = 
        (t.name || '').toLowerCase().includes(rawSearch) || 
        (t.assignee || '').toLowerCase().includes(rawSearch) ||
        (t.manager || '').toLowerCase().includes(rawSearch);
    
    const matchesStatus = statusFilter === "All" || t.dynamicStatus === statusFilter;
    const matchesManager = managerFilter === "All" || t.manager === managerFilter;

    return matchesSearch && matchesStatus && matchesManager;
  });

  const getManagerLoad = (manager: string) => {
    const count = processedTasks.filter(t => t.manager === manager && t.dynamicStatus !== "Completed").length;
    if (count > 3) return { label: "Overloaded", color: "text-rose-600 bg-rose-50" };
    if (count > 2) return { label: "High Load", color: "text-amber-600 bg-amber-50" };
    return { label: "Normal", color: "text-emerald-600 bg-emerald-50" };
  };

  const handleAction = (type: string, task: any) => {
    if (type === 'view') {
      setSelectedTask(task);
      setIsModalOpen(true);
    } else if (type === 'complete') {
      const updated = tasks.map(t => t.id === task.id ? { ...t, status: 'Completed', progress: 100 } : t);
      localStorage.setItem("app_tasks_persistence", JSON.stringify(updated));
      toast.success(`Task "${task.name}" marked as completed.`);
      setForceRender(prev => prev + 1);
    } else if (type === 'edit') {
      toast.info("Task Editor module initiating...");
    } else if (type === 'reassign') {
      toast.info("Reassignment workflow triggered...");
    }
  };

  const refreshRegistry = () => {
    setForceRender(prev => prev + 1);
    toast.success("Task registry re-synced from database.");
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-500 text-white';
    if (status === 'Overdue') return 'bg-red-600 text-white animate-pulse';
    if (status === 'Delayed') return 'bg-rose-500 text-white';
    if (status === 'In Progress') return 'bg-blue-500 text-white';
    return 'bg-slate-400 text-white'; // Not Started
  };

  const handleAdminCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTask = {
      id: `TSK-${Math.floor(100+Math.random()*900)}`,
      name: fd.get("title")?.toString() || "",
      project: fd.get("project")?.toString() || "General",
      manager: fd.get("manager")?.toString() || "System Admin",
      assignee: fd.get("assignee")?.toString() || "Unassigned",
      priority: fd.get("priority")?.toString() || "Medium",
      status: "Not Started",
      progress: 0,
      deadline: fd.get("deadline")?.toString() || "",
      createdDate: new Date().toISOString().split('T')[0],
      description: fd.get("desc")?.toString() || ""
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("app_tasks_persistence", JSON.stringify(updated));
    toast.success("Task dynamically registered and populated to all managerial queues!");
    setIsTaskCreateOpen(false);
  };

  return (
    <div className="space-y-8 pb-10 pt-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black tracking-tighter text-foreground italic flex items-center gap-2">
             <Workflow className="h-6 w-6 text-indigo-600" /> Task Overview
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/20 hover:bg-secondary/30 text-foreground" onClick={refreshRegistry}>
              <RefreshCw className="h-4 w-4" /> Refresh
           </Button>
           <Button size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20" onClick={() => setIsTaskCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New Task
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 overflow-hidden p-3 rounded-2xl border shadow-sm">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search by task name, assignee or manager..." 
            className="pl-9 h-9 border-none bg-secondary/10 rounded-xl text-xs font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 rounded-xl border-none bg-secondary/10 font-bold text-[10px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border shadow-2xl p-1 bg-white">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={managerFilter} onValueChange={setManagerFilter}>
          <SelectTrigger className="h-9 rounded-xl border-none bg-secondary/10 font-bold text-[10px]">
            <SelectValue placeholder="All Managers" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border shadow-2xl p-1 bg-white">
            <SelectItem value="All">All Managers</SelectItem>
            {managers.map((m:any) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {tasks.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border border-dashed border-secondary/30 text-center">
           <FolderKanban className="h-10 w-10 text-muted-foreground/30 mb-3" />
           <h3 className="font-black text-sm text-foreground/60 uppercase tracking-widest">No tasks available</h3>
           <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">Tasks will appear after managers assign work to team members across active projects.</p>
        </div>
      ) : (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-secondary/20 border-b border-border/40 sticky top-0 z-10">
                    <tr>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Task Details</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assignor (Manager)</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assignee</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Execution</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/20">
                    {filtered.map((task) => {
                      const mLoad = getManagerLoad(task.manager);
                      
                      return (
                       <motion.tr 
                         key={task.id} 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className={`transition-colors group hover:bg-secondary/10 ${task.dynamicStatus === 'Overdue' ? 'bg-rose-50/30' : ''}`}
                       >
                          <td className="p-4 max-w-[200px]">
                             <div className="flex flex-col">
                                <span className="font-black text-[11px] text-foreground truncate tracking-tight">{task.name}</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">{task.project}</span>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                   <Avatar className="h-5 w-5 ring-1 ring-indigo-100">
                                      <AvatarFallback className="text-[7px] font-black bg-indigo-50 text-indigo-600 uppercase">
                                         {task.manager?.split(' ').map((n:any)=>n[0]).join('')}
                                      </AvatarFallback>
                                   </Avatar>
                                   <span className="text-[10px] font-bold">{task.manager}</span>
                                </div>
                                <Badge className={`${mLoad.color} border-none text-[6px] font-black uppercase px-1.5 py-0 w-fit`}>
                                   {mLoad.label}
                                </Badge>
                             </div>
                          </td>
                          <td className="p-4">
                             <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic flex items-center gap-1">
                               <User className="h-3 w-3" /> @{task.assignee?.replace(' ', '').toLowerCase()}
                             </span>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col gap-1 w-fit">
                                <Badge className={`${getStatusBadge(task.dynamicStatus)} border-none text-[8px] font-black uppercase px-2 py-0.5 w-fit leading-none flex items-center gap-1`}>
                                   {task.dynamicStatus === 'Overdue' || task.dynamicStatus === 'Delayed' ? <AlertCircle size={8} /> : null}
                                   {task.dynamicStatus}
                                </Badge>
                                <Badge variant="outline" className={`text-[7px] p-0 font-black uppercase border-none ${
                                   task.priority === 'High' ? 'text-rose-600' : 
                                   task.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                }`}>
                                   {task.priority || "Medium"} Priority
                                </Badge>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col items-center gap-1 flex-1 min-w-[70px]">
                                <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${task.dynamicProgress}%` }}
                                     className={`h-full ${task.dynamicStatus === 'Completed' ? 'bg-emerald-500' : task.dynamicStatus === 'Overdue' ? 'bg-red-600' : 'bg-blue-500'}`}
                                   />
                                </div>
                                <span className="text-[8px] font-black text-muted-foreground">{task.dynamicProgress}%</span>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{task.deadline}</span>
                                <span className={`text-[8px] font-black uppercase ${task.isDelayOrOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                   Fixed
                                </span>
                             </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                               <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-secondary/30 hover:bg-secondary text-foreground" onClick={() => handleAction('view', task)}>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                               </Button>
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-secondary bg-transparent text-muted-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-36 rounded-xl border-none shadow-2xl p-1">
                                     <DropdownMenuItem className="text-[10px] font-bold gap-2 text-indigo-600" onClick={() => handleAction('edit', task)}>
                                        <Edit2 className="h-3 w-3" /> Edit Task
                                     </DropdownMenuItem>
                                     <DropdownMenuItem className="text-[10px] font-bold gap-2 text-amber-600" onClick={() => handleAction('reassign', task)}>
                                        <UserPlus className="h-3 w-3" /> Reassign
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator className="opacity-50" />
                                     <DropdownMenuItem 
                                        className="text-[10px] font-bold gap-2 text-emerald-600" 
                                        onClick={() => handleAction('complete', task)}
                                        disabled={task.dynamicStatus === 'Completed'}
                                     >
                                        <CheckCircle2 className="h-3 w-3" /> Mark Complete
                                     </DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </div>
                         </td>
                       </motion.tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {/* Detail Inspector Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
           {selectedTask && (
             <>
               <DialogHeader className="bg-indigo-600 p-6 text-left relative overflow-hidden">
                 <div className="absolute -right-4 -top-8 opacity-10">
                    <Workflow size={120} />
                 </div>
                 <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${selectedTask.dynamicStatus === 'Completed' ? 'bg-emerald-500 border-emerald-400' : selectedTask.isDelayOrOverdue ? 'bg-rose-500 border-rose-400' : 'bg-white/20 border-white/30 backdrop-blur-md'}`}>
                       {selectedTask.dynamicStatus === 'Completed' ? <CheckCircle className="h-6 w-6 text-white" /> : selectedTask.isDelayOrOverdue ? <AlertTriangle className="h-6 w-6 text-white" /> : <Workflow className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                       <DialogTitle className="text-xl font-black tracking-tight text-white uppercase italic leading-none">{selectedTask.name}</DialogTitle>
                       <DialogDescription className="text-indigo-100/60 text-[10px] mt-1 font-bold uppercase tracking-widest line-clamp-1">{selectedTask.description || "No core description provided."}</DialogDescription>
                    </div>
                 </div>
               </DialogHeader>
               
               <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-2 h-5"><Briefcase className="h-3 w-3 mr-1.5" /> Project: {selectedTask.project}</Badge>
                     <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/50 border-white/5 px-2 h-5 flex items-center gap-1"><Hash className="h-2 w-2" /> Task: {selectedTask.id}</Badge>
                     <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-none px-2 h-5 ml-auto ${selectedTask.priority === 'High' ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                        {selectedTask.priority || 'Medium'} Priority
                     </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                     <div className="bg-white/5 rounded-xl border border-white/5 p-3">
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5 mb-2"><UserCircle className="h-3 w-3" /> Assignor (Manager)</span>
                        <span className="text-[11px] font-bold text-white block truncate">{selectedTask.manager}</span>
                     </div>
                     <div className="bg-white/5 rounded-xl border border-white/5 p-3">
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5 mb-2"><User className="h-3 w-3" /> Team Assignee</span>
                        <span className="text-[11px] font-bold text-emerald-400 block truncate">@{selectedTask.assignee?.replace(' ','').toLowerCase()}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1.5">
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5 ml-1"><Timer className="h-3 w-3" /> Operational Status</span>
                        <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5 h-10 px-3">
                           <Badge className={`${getStatusBadge(selectedTask.dynamicStatus)} border-none text-[8px] font-black uppercase px-2 py-0.5 shadow-none`}>{selectedTask.dynamicStatus}</Badge>
                           <span className="text-[10px] font-black text-white/60">{selectedTask.dynamicProgress}%</span>
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5 ml-1"><Calendar className="h-3 w-3" /> Crucial Deadlines</span>
                        <div className="flex flex-col justify-center bg-white/5 px-3 rounded-xl border border-white/5 h-10">
                           <span className="text-[10px] font-bold text-white leading-tight">{selectedTask.deadline}</span>
                           <span className="text-[7px] font-black text-indigo-400/70 uppercase tracking-widest">{selectedTask.createdDate ? `Created: ${selectedTask.createdDate}` : 'Timeline Registered'}</span>
                        </div>
                     </div>
                  </div>

                  <Button className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-white/10 mt-4" onClick={() => setIsModalOpen(false)}>
                     Close Inspector
                  </Button>
               </div>
             </>
           )}
        </DialogContent>
      </Dialog>

      {/* Admin Task Creation Modal */}
      <Dialog open={isTaskCreateOpen} onOpenChange={setIsTaskCreateOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
           <DialogHeader className="bg-slate-900 p-6 text-white pb-6 text-left">
              <DialogTitle className="text-xl font-black tracking-tighter italic">Create Global Task</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleAdminCreateTask} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Title</label>
                 <Input name="title" required className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project</label>
                    <Input name="project" defaultValue="General" className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</label>
                    <Select name="priority" defaultValue="Medium">
                       <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold"><SelectValue /></SelectTrigger>
                       <SelectContent className="rounded-xl border-none shadow-2xl">
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assignor (Manager)</label>
                    <Input name="manager" defaultValue="System Admin" className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assignee</label>
                    <Input name="assignee" placeholder="e.g. Designer Team" required className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline</label>
                 <Input type="date" name="deadline" required className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold" />
              </div>
              <div className="pt-2">
                 <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest transition-all">Submit Task</Button>
              </div>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

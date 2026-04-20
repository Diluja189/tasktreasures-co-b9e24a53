import { useState, useMemo, useEffect } from "react";
import { 
  Plus, Search, Filter, RefreshCw, 
  CheckCircle2, Clock, Calendar, User,
  MoreVertical, Edit2, Trash2, ListPlus,
  Target, BarChart3, ChevronRight, LayoutGrid,
  List, Timer, ArrowUpRight, AlertCircle, AlertTriangle, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";



const priorityStyles = {
  "High": "bg-rose-500/10 text-rose-600 border-none",
  "Medium": "bg-amber-500/10 text-amber-600 border-none",
  "Low": "bg-indigo-500/10 text-indigo-600 border-none",
};

const statusStyles = {
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Not Started": "bg-slate-500/10 text-slate-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none",
};

const TODAY = new Date("2026-04-17");

export default function ManagerTasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [tasksData, setTasksData] = useState<any[]>([]);

  useEffect(() => {
    const loadManagerTasks = () => {
      const persisted = localStorage.getItem("app_tasks_persistence");
      setTasksData(persisted ? JSON.parse(persisted) : []);
    };
    loadManagerTasks();
    window.addEventListener("storage", loadManagerTasks);
    return () => window.removeEventListener("storage", loadManagerTasks);
  }, []);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskToAudit, setTaskToAudit] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const filteredTasks = useMemo(() => tasksData.filter(t => 
    (projectFilter === "All" || t.project === projectFilter) &&
    (statusFilter === "All" || t.status === statusFilter) &&
    (priorityFilter === "All" || (t.priority || 'Medium') === priorityFilter) &&
    (assigneeFilter === "All" || t.assignee === assigneeFilter) &&
    ((t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
     (t.assignee || '').toLowerCase().includes(searchQuery.toLowerCase()))
  ), [tasksData, searchQuery, projectFilter, statusFilter, priorityFilter, assigneeFilter]);

  const isOverdue = (deadline: string, status: string) => status !== "Completed" && new Date(deadline) < TODAY;

  const totalTasks = tasksData.length;
  const inProgress = tasksData.filter(t => t.status === "In Progress").length;
  const completed = tasksData.filter(t => t.status === "Completed").length;
  const overdueCount = tasksData.filter(t => isOverdue(t.deadline, t.status)).length;
  const unassignedCount = tasksData.filter(t => t.assignee === "Unassigned").length;

  const workload = useMemo(() => tasksData.reduce((acc, t) => {
    if (t.assignee && t.assignee !== "Unassigned" && t.status !== "Completed") {
      acc[t.assignee] = (acc[t.assignee] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>), [tasksData]);

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) setSelectedTasks([]);
    else setSelectedTasks(filteredTasks.map(t => t.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTask = {
      id: `TSK-${Math.floor(100+Math.random()*900)}`,
      name: fd.get("title")?.toString() || "",
      project: "General",
      manager: "Manager",
      assignee: fd.get("assignee")?.toString() || "Unassigned",
      priority: fd.get("priority")?.toString() || "Medium",
      status: "Not Started",
      progress: 0,
      deadline: fd.get("deadline")?.toString() || "",
    };
    const updated = [newTask, ...tasksData];
    setTasksData(updated);
    localStorage.setItem("app_tasks_persistence", JSON.stringify(updated));
    // Trigger storage event manually to sync other tabs instantly within the same window
    window.dispatchEvent(new Event("storage"));
    toast.success("Task globally synchronized to ledger.");
  };

  const handleMarkCompleted = (taskId: string) => {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;
    
    const update = {
      note: "Manager marked task as finally completed.",
      status: "Completed",
      progress: 100,
      updatedAt: new Date().toLocaleString(),
      updatedBy: "Manager"
    };

    const updatedTasks = tasksData.map(t => {
      if (t.id === taskId) {
        const history = t.history || [];
        return {
          ...t,
          status: "Completed",
          progress: 100,
          latestUpdate: update,
          history: [update, ...history]
        };
      }
      return t;
    });

    setTasksData(updatedTasks);
    localStorage.setItem("app_tasks_persistence", JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event("storage"));
    toast.success(`Task "${task.name}" verified and closed.`);
  };

  const handleDeleteTasks = () => {
    if (selectedTasks.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
      const updated = tasksData.filter(t => !selectedTasks.includes(t.id));
      setTasksData(updated);
      localStorage.setItem("app_tasks_persistence", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} units purged from ledger.`);
    }
  };

  const handlePurgeTask = (taskId: string) => {
    if (confirm("Purge this work unit from the global record?")) {
      const updated = tasksData.filter(t => t.id !== taskId);
      setTasksData(updated);
      localStorage.setItem("app_tasks_persistence", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      toast.success("Unit purged.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex flex-wrap items-center gap-3">
             <h1 className="text-2xl font-bold tracking-tight text-foreground">
               Task Intelligence Breakdown
             </h1>
             {(overdueCount > 0 || unassignedCount > 0) && (
               <div className="flex items-center gap-2">
                 {overdueCount > 0 && <Badge className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 shadow-sm font-bold text-xs"><AlertCircle className="w-3 h-3 mr-1" /> {overdueCount} Overdue</Badge>}
                 {unassignedCount > 0 && <Badge className="bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 shadow-sm font-bold text-xs"><User className="w-3 h-3 mr-1" /> {unassignedCount} Unassigned</Badge>}
               </div>
             )}
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border border-border bg-white shadow-sm" onClick={() => toast.info("Syncing task ledger...")}>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
           </Button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <Card className="border border-border/40 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><ListPlus className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Tasks</p>
               <p className="text-xl font-bold">{totalTasks}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/40 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Timer className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">In Progress</p>
               <p className="text-xl font-bold">{inProgress}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/40 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Completed</p>
               <p className="text-xl font-bold">{completed}</p>
             </div>
           </CardContent>
         </Card>
         <Card className="border border-border/40 shadow-sm bg-white rounded-2xl">
           <CardContent className="p-4 flex items-center gap-4">
             <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Overdue</p>
               <p className="text-xl font-bold text-rose-600">{overdueCount}</p>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Filter Stripe with Bulk Actions */}
      <div className="flex flex-col space-y-4">
        {selectedTasks.length > 0 && (
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-2xl">
             <span className="text-sm font-bold text-indigo-900 ml-2">{selectedTasks.length} Selected</span>
             <div className="h-6 w-px bg-indigo-200 mx-2" />
             <Button size="sm" variant="outline" className="h-8 rounded-xl text-[10px] uppercase font-bold border-indigo-200 bg-white text-indigo-700">Assign Selected</Button>
             <Button size="sm" variant="outline" className="h-8 rounded-xl text-[10px] uppercase font-bold border-indigo-200 bg-white text-indigo-700">Change Status</Button>
             <Button size="sm" variant="ghost" className="h-8 rounded-xl text-[10px] uppercase font-bold text-rose-600 hover:bg-rose-100" onClick={handleDeleteTasks}>Delete</Button>
          </motion.div>
        )}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm w-full">
           <div className="flex flex-wrap items-center gap-3 w-full">
              <div className="relative flex-1 min-w-[200px]">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search work units..." 
                   className="pl-10 h-10 border-none bg-background rounded-xl"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                 <SelectTrigger className="h-10 rounded-xl border-none bg-background w-[140px] text-xs font-bold">
                    <SelectValue placeholder="Project" />
                 </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                    <SelectItem value="All">All Projects</SelectItem>
                  </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                 <SelectTrigger className="h-10 rounded-xl border-none bg-background w-[130px] text-xs font-bold">
                    <SelectValue placeholder="Status" />
                 </SelectTrigger>
                 <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5"><SelectItem value="All">All Status</SelectItem><SelectItem value="Not Started">Not Started</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                 <SelectTrigger className="h-10 rounded-xl border-none bg-background w-[130px] text-xs font-bold">
                    <SelectValue placeholder="Priority" />
                 </SelectTrigger>
                 <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5"><SelectItem value="All">All Priority</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
              </Select>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                 <SelectTrigger className="h-10 rounded-xl border-none bg-background w-[130px] text-xs font-bold">
                    <SelectValue placeholder="Assignee" />
                 </SelectTrigger>
                 <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                    <SelectItem value="All">All Assignees</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
              </Select>
              <div className="h-8 w-px bg-border/50 hidden xl:block" />
              <div className="hidden xl:flex items-center gap-1 bg-secondary/30 p-1 rounded-xl">
                 <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-lg px-3" onClick={() => setViewMode('table')}>
                    <List className="h-4 w-4 mr-2" /> List
                 </Button>
                 <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-lg px-3" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-4 w-4 mr-2" /> Grid
                 </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Task View */}
      {viewMode === 'table' ? (
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-secondary/20 border-b border-border/50">
                       <tr>
                          <th className="px-5 py-4 w-12 text-center align-middle">
                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0} 
                                onChange={toggleSelectAll} 
                             />
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Task Unit & Project</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignor (Manager)</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Execution</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Update</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       {filteredTasks.length === 0 ? (
                         <tr><td colSpan={8} className="py-10 text-center font-bold text-muted-foreground">No tasks match criteria.</td></tr>
                       ) : filteredTasks.map(task => {
                         const overdue = isOverdue(task.deadline, task.status);
                         
                         return (
                           <tr key={task.id} className={`hover:bg-secondary/20 transition-colors group ${overdue ? 'bg-rose-50/30' : ''}`}>
                           <td className="px-5 py-5 text-center align-middle">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                                   checked={selectedTasks.includes(task.id)} onChange={() => toggleSelect(task.id)}
                                />
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : overdue ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-secondary/50 text-muted-foreground border-border/50'}`}>
                                      {task.status === 'Completed' ? <CheckCircle2 className="h-4 w-4" /> : overdue ? <AlertTriangle className="h-4 w-4 text-rose-600" /> : <Clock className="h-4 w-4" />}
                                   </div>
                                   <div className="truncate pr-4">
                                      <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors italic truncate">{task.name}</p>
                                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-1.5 mt-0.5 truncate"><Target className="h-2.5 w-2.5 shrink-0" /> {task.project}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center text-[9px] font-black border border-indigo-500/20 shadow-sm">
                                       D
                                    </div>
                                    <span className="text-xs font-bold">Dilani</span>
                                 </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="space-y-1.5 min-w-[80px]">
                                   <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                      <span className="text-indigo-400">Progress</span>
                                      <span className="text-indigo-600">{task.progress || 0}%</span>
                                   </div>
                                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${task.progress || 0}%` }} />
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                {task.latestUpdate ? (
                                   <div className="max-w-[180px]">
                                      <p className="text-[10px] font-bold text-slate-700 line-clamp-1">{task.latestUpdate.note}</p>
                                      <p className="text-[8px] font-black uppercase text-slate-400 mt-0.5 flex items-center gap-1">
                                         <Clock className="w-2.5 h-2.5" /> {task.latestUpdate.updatedAt}
                                      </p>
                                   </div>
                                ) : (
                                   <span className="text-[10px] italic text-slate-400">No updates reported</span>
                                )}
                             </td>
                             <td className="px-6 py-5">
                                <Badge className={`${statusStyles[task.status as keyof typeof statusStyles]} text-[9px] font-bold h-6 px-3 rounded-full`}>{task.status}</Badge>
                             </td>
                             <td className="px-6 py-5 text-right">
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                         <MoreVertical className="h-4 w-4" />
                                      </Button>
                                   </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 w-48">
                                       <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs" onClick={() => {
                                          toast.info("Edit module initiated.");
                                       }}>
                                          <Edit2 className="h-3.5 w-3.5" /> Edit
                                       </DropdownMenuItem>
                                       <DropdownMenuSeparator className="bg-slate-50" />
                                       <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs text-rose-600 focus:bg-rose-50" onClick={() => handlePurgeTask(task.id)}>
                                          <Trash2 className="h-3.5 w-3.5" /> Delete
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </td>
                           </tr>
                         )
                       })}
                    </tbody>
                 </table>
              </div>
           </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTasks.map((task, i) => {
              const overdue = isOverdue(task.deadline, task.status);
              const unassigned = task.assignee === "Unassigned";

              return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                 <Card className={`border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 ${overdue ? 'ring-1 ring-inset ring-rose-500/20 bg-rose-50/30' : ''}`}>
                    <CardHeader className="pb-4">
                       <div className="flex justify-between items-start mb-2">
                          <Badge className={`${priorityStyles[task.priority as keyof typeof priorityStyles]} text-[8px] font-black uppercase`}>{task.priority}</Badge>
                          <Badge className={`${statusStyles[task.status as keyof typeof statusStyles]} text-[8px] font-black uppercase`}>{task.status}</Badge>
                       </div>
                       <CardTitle className={`text-lg font-bold italic group-hover:text-primary transition-colors ${overdue ? 'text-rose-900' : ''}`}>{task.name}</CardTitle>
                       <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/60 mt-0.5">{task.project}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className={`flex items-center gap-3 p-3 rounded-2xl ${unassigned ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-secondary/30'}`}>
                          {unassigned ? (
                             <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[10px] border border-amber-200">
                                <User className="w-4 h-4 text-amber-500"/>
                             </div>
                          ) : (
                             <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm border border-secondary relative">
                                {task.assignee.split(' ').map(n=>n[0]).join('')}
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] font-black text-slate-700 border border-slate-200" title="Active Workload">
                                   {workload[task.assignee] || 0}
                                </div>
                             </div>
                          )}
                          <div>
                             <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Assigned Ownership</p>
                             <p className={`text-xs font-bold leading-none ${unassigned ? 'text-amber-600 italic' : ''}`}>{task.assignee}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${overdue ? 'bg-rose-50/50 border-rose-200' : 'bg-indigo-50/50 border-indigo-100/20'}`}>
                             <span className={`text-[9px] font-black uppercase ${overdue ? 'text-rose-500' : 'text-indigo-400'}`}>Target Date</span>
                             <span className={`text-[11px] font-bold flex items-center gap-1.5 ${overdue ? 'text-rose-600' : ''}`}><Calendar className="h-3 w-3" /> {task.deadline}</span>
                          </div>
                          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/20">
                             <span className="text-[9px] font-black uppercase text-indigo-400">Budget Hrs</span>
                             <span className="text-[11px] font-bold flex items-center gap-1.5"><Timer className="h-3 w-3" /> {task.hours}h</span>
                          </div>
                       </div>
                       <Button variant="ghost" className="w-full rounded-2xl h-10 group gap-2 text-primary font-bold text-xs" onClick={() => toast.info("Audit log opening...")}>
                          Unit Audit Log <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                       </Button>
                    </CardContent>
                 </Card>
              </motion.div>
           )})}
        </div>
      )}

      {/* Execution Audit Dialog */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
         <DialogContent className="sm:max-w-[550px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
            <DialogHeader className="bg-slate-900 p-8 text-white">
               <div className="flex justify-between items-start">
                  <div>
                     <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                        <History className="h-5 w-5 text-indigo-400" /> Execution Audit
                     </DialogTitle>
                     <DialogDescription className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest">
                        {taskToAudit?.name}
                     </DialogDescription>
                  </div>
                  {taskToAudit && (
                    <Badge className={`${statusStyles[taskToAudit.status as keyof typeof statusStyles]} text-[10px] font-black uppercase`}>
                       {taskToAudit.status}
                    </Badge>
                  )}
               </div>
            </DialogHeader>
            <div className="p-8 max-h-[400px] overflow-y-auto space-y-6">
               {!taskToAudit?.history || taskToAudit.history.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-sm font-bold text-slate-400">No execution logs found for this unit.</p>
                  </div>
               ) : (
                  <div className="relative border-l-2 border-slate-100 ml-3 pl-8 space-y-8">
                     {taskToAudit.history.map((log: any, idx: number) => (
                        <div key={idx} className="relative">
                           <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-indigo-500" />
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                 <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">{log.updatedAt}</p>
                                 <Badge variant="outline" className="text-[9px] font-bold border-slate-200">{log.progress}% Progress</Badge>
                              </div>
                              <p className="text-sm font-bold text-slate-900 leading-relaxed italic">"{log.note}"</p>
                              <div className="flex items-center gap-2">
                                 <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">{log.updatedBy?.substring(0,2).toUpperCase()}</div>
                                 <p className="text-[10px] font-bold text-slate-400">Updated by <span className="text-slate-600">{log.updatedBy}</span></p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
            <DialogFooter className="p-6 bg-slate-50 border-t items-center justify-between">
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">End of Audit Trace</p>
               <Button className="rounded-xl px-8 h-10 font-bold text-xs uppercase" onClick={() => setIsAuditModalOpen(false)}>Close Audit</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { 
  Plus, Search, Filter, RefreshCw, 
  CheckCircle2, Clock, Calendar, User,
  MoreVertical, Edit2, Trash2, ListPlus,
  Target, BarChart3, ChevronRight, LayoutGrid,
  List, Timer, ArrowUpRight, AlertCircle, AlertTriangle
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
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
    setIsTaskModalOpen(false);
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
           <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
              <DialogTrigger asChild>
                 <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10 rounded-xl font-bold text-xs px-5 h-10 border-none transition-all active:scale-95">
                    <Plus className="h-4 w-4" /> New Work Unit
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                 <DialogHeader className="bg-indigo-600 p-8 text-white">
                    <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-3"><ListPlus className="h-5 w-5" /> Task Creation</DialogTitle>
                    <DialogDescription className="text-indigo-100/70">Define a new atomic work unit for the organization.</DialogDescription>
                 </DialogHeader>
                 <form onSubmit={handleCreateTask} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2 col-span-2">
                          <Label htmlFor="title" className="text-[10px] font-black uppercase text-muted-foreground">Task Identifier</Label>
                          <Input id="title" placeholder="e.g. Database Partitioning" className="rounded-xl border border-border/50 bg-secondary/10 h-11 font-medium" required />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Target Project</Label>
                          <Select required>
                             <SelectTrigger className="rounded-xl border border-border/50 bg-secondary/10 h-11 font-medium">
                                <SelectValue placeholder="Select Project" />
                             </SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-xl">
                                 {/* Projects dynamic */}
                              </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Priority Tier</Label>
                          <Select required>
                             <SelectTrigger className="rounded-xl border border-border/50 bg-secondary/10 h-11 font-medium">
                                <SelectValue placeholder="Criticality" />
                             </SelectTrigger>
                             <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="high">High Velocity</SelectItem>
                                <SelectItem value="med">Standard</SelectItem>
                                <SelectItem value="low">Backlog</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Deadline Date</Label>
                          <Input type="date" className="rounded-xl border border-border/50 bg-secondary/10 h-11" required />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Estimated Work (Hrs)</Label>
                          <Input type="number" placeholder="0.0" className="rounded-xl border border-border/50 bg-secondary/10 h-11 font-medium" required />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Context & Requirements</Label>
                          <Textarea placeholder="Define technical scope..." className="rounded-xl border border-border/50 bg-secondary/10 min-h-[100px] font-medium" />
                       </div>
                    </div>
                    <DialogFooter className="pt-2">
                       <Button type="button" variant="ghost" className="rounded-xl h-11 font-bold text-xs uppercase" onClick={() => setIsTaskModalOpen(false)}>Abort</Button>
                       <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 shadow-md shadow-indigo-600/10 px-8 font-bold text-xs border-none transition-all active:scale-95">Verify & Create</Button>
                    </DialogFooter>
                 </form>
              </DialogContent>
           </Dialog>
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
             <Button size="sm" variant="ghost" className="h-8 rounded-xl text-[10px] uppercase font-bold text-rose-600 hover:bg-rose-100">Delete</Button>
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
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task Unit & Project</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assignee</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       {filteredTasks.length === 0 ? (
                         <tr><td colSpan={7} className="py-10 text-center font-bold text-muted-foreground">No tasks match criteria.</td></tr>
                       ) : filteredTasks.map(task => {
                         const overdue = isOverdue(task.deadline, task.status);
                         const unassigned = task.assignee === "Unassigned";
                         
                         return (
                           <tr key={task.id} className={`hover:bg-secondary/20 transition-colors group ${overdue ? 'bg-rose-50/30' : ''} ${unassigned && !overdue ? 'bg-amber-50/20' : ''}`}>
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
                                <Badge className={`${priorityStyles[task.priority as keyof typeof priorityStyles]} text-[8px] font-black uppercase px-2 py-0.5`}>{task.priority}</Badge>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                   {unassigned ? (
                                     <>
                                       <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center text-[10px] border border-amber-500/20"><User className="w-3 h-3"/></div>
                                       <span className="text-xs font-bold text-amber-600 italic">Unassigned</span>
                                     </>
                                   ) : (
                                     <>
                                       <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center text-[9px] font-black border border-indigo-500/20 shadow-sm relative">
                                          {task.assignee.split(' ').map(n=>n[0]).join('')}
                                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] font-black text-slate-700 border border-slate-200" title="Active Workload">
                                            {workload[task.assignee] || 0}
                                          </div>
                                       </div>
                                       <span className="text-xs font-bold">{task.assignee}</span>
                                     </>
                                   )}
                                </div>
                             </td>
                             <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex flex-col">
                                   <span className={`text-[11px] font-black flex items-center gap-1.5 ${overdue ? 'text-rose-600' : 'text-indigo-500'}`}><Calendar className="h-3 w-3" /> {task.deadline}</span>
                                   <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[9px] text-muted-foreground font-bold italic uppercase"><Timer className="h-2.5 w-2.5 inline" /> {task.hours}h budget</span>
                                      {overdue && <Badge variant="outline" className="text-[7px] px-1 py-0 h-4 border-rose-500/30 text-rose-600 font-bold uppercase bg-rose-50">Overdue</Badge>}
                                   </div>
                                </div>
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
                                   <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 w-40">
                                      <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs"><Edit2 className="h-3.5 w-3.5" /> Edit Unit</DropdownMenuItem>
                                      <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark Final</DropdownMenuItem>
                                      <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs text-rose-600 focus:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /> Purge</DropdownMenuItem>
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
    </div>
  );
}

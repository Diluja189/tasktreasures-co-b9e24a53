import { useState } from "react";
import { 
  Plus, Search, Filter, RefreshCw, 
  CheckCircle2, Clock, Calendar, User,
  MoreVertical, Edit2, Trash2, ListPlus,
  Target, BarChart3, ChevronRight, LayoutGrid,
  List, Timer, ArrowUpRight, ShieldCheck,
  UserCircle, Workflow, AlertCircle, MoreHorizontal,
  CalendarDays, UserPlus, CheckCircle, Info, Hash,
  Briefcase
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Mock Current Date: 2026-04-17
const CURRENT_DATE = new Date("2026-04-17");

const initialTasks = [
  { 
    id: "T1", 
    name: "AWS S3 Bucket Config", 
    project: "Cloud Migration", 
    priority: "High", 
    deadline: "2026-04-18", // Tomorrow
    managerId: "M1",
    manager: "Sarah Chen", 
    assignee: "James Wilson", 
    status: "In Progress",
    progress: 85
  },
  { 
    id: "T2", 
    name: "OAuth2 Provider Integration", 
    project: "Security Infrastructure", 
    priority: "High", 
    deadline: "2026-04-16", // Yesterday (Overdue)
    managerId: "M1",
    manager: "Sarah Chen", 
    assignee: "Mike Jones", 
    status: "In Progress",
    progress: 40
  },
  { 
    id: "T3", 
    name: "Chart.js Theme Registry", 
    project: "SaaS Dashboard Phase 2", 
    priority: "Medium", 
    deadline: "2026-04-25", 
    managerId: "M2",
    manager: "James Wilson", 
    assignee: "Emily Davis", 
    status: "In Progress",
    progress: 20
  },
  { 
    id: "T4", 
    name: "Legacy DB Indexing Audit", 
    project: "Cloud Migration", 
    priority: "Low", 
    deadline: "2026-04-15", // Past but completed
    managerId: "M1",
    manager: "Sarah Chen", 
    assignee: "James Wilson", 
    status: "Completed",
    progress: 100
  },
  { 
    id: "T5", 
    name: "Kubernetes Cluster Audit", 
    project: "Cloud Migration", 
    priority: "High", 
    deadline: "2026-04-10", // Way past, in progress
    managerId: "M1",
    manager: "Sarah Chen", 
    assignee: "Sarah Chen", 
    status: "In Progress",
    progress: 10
  },
];

const managers = Array.from(new Set(initialTasks.map(t => t.manager)));

const getDeadlineInfo = (deadlineStr: string, status: string) => {
  const deadline = new Date(deadlineStr);
  const diffTime = deadline.getTime() - CURRENT_DATE.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (status === "Completed") return { text: "Completed on time", isOverdue: false, subText: "" };
  
  if (diffDays < 0) {
    return { text: "Overdue", isOverdue: true, subText: `Overdue by ${Math.abs(diffDays)} days` };
  }
  
  return { 
    text: status, 
    isOverdue: false, 
    subText: diffDays === 0 ? "Due today" : `${diffDays} days left` 
  };
};

const getManagerLoad = (manager: string) => {
  const count = initialTasks.filter(t => t.manager === manager && t.status !== "Completed").length;
  if (count > 3) return { label: "Overloaded", color: "text-rose-600 bg-rose-50" };
  if (count > 2) return { label: "High Load", color: "text-amber-600 bg-amber-50" };
  return { label: "Normal", color: "text-emerald-600 bg-emerald-50" };
};

export default function TasksPage() {
  const [tasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [managerFilter, setManagerFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = tasks.filter(t => {
    const deadlineInfo = getDeadlineInfo(t.deadline, t.status);
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || 
                        (statusFilter === "Overdue" ? deadlineInfo.isOverdue : 
                         statusFilter === "In Progress" ? (t.status === "In Progress" && !deadlineInfo.isOverdue) :
                         t.status === statusFilter);
    
    const matchesManager = managerFilter === "All" || t.manager === managerFilter;

    return matchesSearch && matchesStatus && matchesManager;
  });

  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black tracking-tighter text-foreground italic flex items-center gap-2">
             <Workflow className="h-6 w-6 text-indigo-600" /> Task Overview
           </h1>
        </div>
        <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/20 hover:bg-secondary/30 text-foreground" onClick={() => toast.info("Syncing enterprise task registry...")}>
           <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border shadow-sm">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search by task or assignee..." 
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
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={managerFilter} onValueChange={setManagerFilter}>
          <SelectTrigger className="h-9 rounded-xl border-none bg-secondary/10 font-bold text-[10px]">
            <SelectValue placeholder="All Managers" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border shadow-2xl p-1 bg-white">
            <SelectItem value="All">All Managers</SelectItem>
            {managers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden border">
         <CardHeader className="p-5 border-b border-secondary/20 bg-white">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-lg font-black tracking-tight uppercase italic text-slate-900 leading-none">Task Monitoring</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-slate-400 uppercase mt-2">Enterprise execution monitoring terminal.</CardDescription>
               </div>
               <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] px-3 uppercase">
                  {filtered.length} Work Units Monitoring
               </Badge>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-secondary/10 sticky top-0 z-10">
                     <tr>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Task Details</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Assignor (Manager)</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Assignee</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Execution</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Deadline</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/5">
                     {filtered.map((task) => {
                       const dl = getDeadlineInfo(task.deadline, task.status);
                       const mLoad = getManagerLoad(task.manager);
                       
                       return (
                        <motion.tr 
                          key={task.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`transition-colors group ${dl.isOverdue ? 'bg-rose-50/30' : 'hover:bg-slate-50'}`}
                        >
                           <td className="p-4 max-w-[200px]">
                              <div className="flex flex-col">
                                 <span className="font-black text-[11px] text-slate-900 truncate tracking-tight">{task.name}</span>
                                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{task.project}</span>
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-1.5">
                                    <Avatar className="h-5 w-5 ring-1 ring-indigo-100">
                                       <AvatarFallback className="text-[7px] font-black bg-indigo-50 text-indigo-600 uppercase">
                                          {task.manager.split(' ').map(n=>n[0]).join('')}
                                       </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[10px] font-bold text-slate-700">{task.manager}</span>
                                 </div>
                                 <Badge className={`${mLoad.color} border-none text-[6px] font-black uppercase px-1.5 py-0 w-fit`}>
                                    {mLoad.label}
                                 </Badge>
                              </div>
                           </td>
                           <td className="p-4">
                              <span className="text-[10px] font-bold text-slate-600 italic">@{task.assignee.replace(' ', '').toLowerCase()}</span>
                           </td>
                           <td className="p-4">
                              <div className="flex flex-col gap-1">
                                 {dl.isOverdue ? (
                                    <Badge className="bg-rose-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 w-fit flex items-center gap-1">
                                       <AlertCircle size={8} /> Overdue
                                    </Badge>
                                 ) : (
                                    <Badge className={`${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'} text-white border-none text-[8px] font-black uppercase px-2 py-0.5 w-fit leading-none`}>
                                       {task.status}
                                    </Badge>
                                 )}
                                 <Badge variant="outline" className={`text-[7px] p-0 font-black uppercase border-none ${
                                    task.priority === 'High' ? 'text-rose-600' : 
                                    task.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                 }`}>
                                    {task.priority} Priority
                                 </Badge>
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="flex flex-col items-center gap-1">
                                 <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${task.progress}%` }}
                                      className={`h-full ${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                    />
                                 </div>
                                 <span className="text-[8px] font-black text-slate-400">{task.progress}%</span>
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-700">{task.deadline}</span>
                                 <span className={`text-[8px] font-black uppercase ${dl.isOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                    {dl.subText}
                                 </span>
                              </div>
                           </td>
                           <td className="p-4">
                             <div className="flex justify-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all active:scale-95"
                                  onClick={() => handleViewDetails(task)}
                                >
                                   <ArrowUpRight className="h-3.5 w-3.5" />
                                </Button>
                             </div>
                          </td>
                        </motion.tr>
                       );
                     })}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      {/* Task Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-indigo-600 p-6 text-left">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Workflow className="h-5 w-5 text-white" />
               </div>
               <div>
                  <DialogTitle className="text-lg font-black tracking-tight text-white uppercase italic">Task Details</DialogTitle>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
             <div className="space-y-4">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center gap-1.5"><Info className="h-3 w-3" /> Core Identification</span>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{selectedTask?.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border-none px-2 h-4">{selectedTask?.project}</Badge>
                      <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-100 text-slate-500 border-none px-2 h-4 flex items-center gap-1"><Hash className="h-2 w-2" /> {selectedTask?.id}</Badge>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Assignor</span>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                         <Avatar className="h-6 w-6 ring-1 ring-indigo-100">
                            <AvatarFallback className="text-[8px] font-black bg-indigo-50 text-indigo-600">{selectedTask?.manager?.split(' ').map((n:any)=>n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <span className="text-[10px] font-bold text-slate-700">{selectedTask?.manager}</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><UserCircle className="h-3 w-3" /> Assignee</span>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                         <Avatar className="h-6 w-6 ring-1 ring-emerald-100">
                            <AvatarFallback className="text-[8px] font-black bg-emerald-50 text-emerald-600">{selectedTask?.assignee?.split(' ').map((n:any)=>n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <span className="text-[10px] font-bold text-slate-700">{selectedTask?.assignee}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Timer className="h-3 w-3" /> Operational Status</span>
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100 h-10">
                         <Badge className={`${selectedTask?.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'} text-white border-none text-[8px] font-black uppercase px-2 py-0.5`}>{selectedTask?.status}</Badge>
                         <span className="text-[10px] font-black text-slate-500">{selectedTask?.progress}%</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Deadline</span>
                      <div className="flex flex-col justify-center bg-slate-50 px-3 rounded-xl border border-slate-100 h-10">
                         <span className="text-[10px] font-bold text-slate-900 leading-tight">{selectedTask?.deadline}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Fixed Timeline</span>
                      </div>
                   </div>
                </div>
             </div>

             <Button className="w-full h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 border-none" onClick={() => setIsModalOpen(false)}>
                Close
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

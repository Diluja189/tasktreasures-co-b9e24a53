import { useState } from "react";
import { 
  Plus, Search, Filter, RefreshCw, 
  CheckCircle2, Clock, Calendar, User,
  MoreVertical, Edit2, Trash2, ListPlus,
  Target, BarChart3, ChevronRight, LayoutGrid,
  List, Timer, ArrowUpRight
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

const tasksData = [
  { id: "T1", name: "AWS S3 Bucket Config", project: "Cloud Migration", priority: "High", deadline: "2026-04-18", assignee: "Sarah Chen", status: "In Progress", hours: 4 },
  { id: "T2", name: "OAuth2 Provider Integration", project: "Security Infrastructure", priority: "High", deadline: "2026-04-20", assignee: "David Kim", status: "Not Started", hours: 12 },
  { id: "T3", name: "Chart.js Theme Registry", project: "SaaS Dashboard Phase 2", priority: "Medium", deadline: "2026-04-25", assignee: "Unassigned", status: "Not Started", hours: 8 },
  { id: "T4", name: "Legacy DB Indexing Audit", project: "Cloud Migration", priority: "High", deadline: "2026-04-15", assignee: "Sarah Chen", status: "Completed", hours: 6 },
  { id: "T5", name: "UI Polish - Sidebar Motion", project: "SaaS Dashboard Phase 2", priority: "Low", deadline: "2026-05-01", assignee: "Mike Chen", status: "In Progress", hours: 16 },
];

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

export default function ManagerTasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredTasks = tasksData.filter(t => 
    (projectFilter === "All" || t.project === projectFilter) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Task created and synchronized with project roadmap.");
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
             Task Intelligence Breakdown
           </h1>
           <p className="text-muted-foreground mt-2">Translate strategic project goals into actionable execution units and subtasks.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
              <DialogTrigger asChild>
                 <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 h-11 border-none transition-all active:scale-95">
                    <Plus className="h-4 w-4" /> New Work Unit
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                 <DialogHeader className="bg-indigo-600 p-8 text-white">
                    <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3"><ListPlus className="h-6 w-6" /> Task Creation</DialogTitle>
                    <DialogDescription className="text-indigo-100/70">Define a new atomic work unit for the organization.</DialogDescription>
                 </DialogHeader>
                 <form onSubmit={handleCreateTask} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2 col-span-2">
                          <Label htmlFor="title" className="text-[10px] font-black uppercase text-muted-foreground">Task Identifier</Label>
                          <Input id="title" placeholder="e.g. Database Partitioning" className="rounded-xl border-none bg-secondary/30 h-11 font-medium" required />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Target Project</Label>
                          <Select required>
                             <SelectTrigger className="rounded-xl border-none bg-secondary/30 h-11 font-medium">
                                <SelectValue placeholder="Select Project" />
                             </SelectTrigger>
                             <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="cloud">Cloud Migration</SelectItem>
                                <SelectItem value="saas">SaaS Dashboard</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Priority Tier</Label>
                          <Select required>
                             <SelectTrigger className="rounded-xl border-none bg-secondary/30 h-11 font-medium">
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
                          <Input type="date" className="rounded-xl border-none bg-secondary/30 h-11" required />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Estimated Work (Hrs)</Label>
                          <Input type="number" placeholder="0.0" className="rounded-xl border-none bg-secondary/30 h-11 font-medium" required />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Context & Requirements</Label>
                          <Textarea placeholder="Define technical scope..." className="rounded-xl border-none bg-secondary/30 min-h-[100px] font-medium" />
                       </div>
                    </div>
                    <DialogFooter className="pt-4">
                       <Button type="button" variant="ghost" className="rounded-xl h-12 font-bold text-xs uppercase" onClick={() => setIsTaskModalOpen(false)}>Abort</Button>
                       <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12 shadow-lg shadow-indigo-600/20 px-8 font-black uppercase text-[10px] tracking-widest border-none transition-all active:scale-95">Verify & Create</Button>
                    </DialogFooter>
                 </form>
              </DialogContent>
           </Dialog>
           <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-none bg-card/50 shadow-sm" onClick={() => toast.info("Syncing task ledger...")}>
              <RefreshCw className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Filter Stripe */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1 lg:max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search work units..." 
                 className="pl-10 h-10 border-none bg-background rounded-xl"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full lg:w-56 text-[11px] font-bold">
                  <SelectValue placeholder="All Lifecycles" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                  <SelectItem value="All">All Projects</SelectItem>
                  <SelectItem value="Cloud Migration">Cloud Migration</SelectItem>
                  <SelectItem value="Security Infrastructure">Security Infrastructure</SelectItem>
                  <SelectItem value="SaaS Dashboard Phase 2">SaaS Dashboard</SelectItem>
               </SelectContent>
            </Select>
            <div className="h-8 w-px bg-border/50 hidden lg:block" />
            <div className="hidden lg:flex items-center gap-1 bg-secondary/30 p-1 rounded-xl">
               <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-lg px-3" onClick={() => setViewMode('table')}>
                  <List className="h-4 w-4 mr-2" /> List
               </Button>
               <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-8 rounded-lg px-3" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="h-4 w-4 mr-2" /> Grid
               </Button>
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
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task Unit & Project</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assignee</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       {filteredTasks.map(task => (
                         <tr key={task.id} className="hover:bg-secondary/10 transition-colors group">
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-secondary/50 text-muted-foreground border-border/50'}`}>
                                    {task.status === 'Completed' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors italic">{task.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-1.5 mt-0.5"><Target className="h-2.5 w-2.5" /> {task.project}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <Badge className={`${priorityStyles[task.priority as keyof typeof priorityStyles]} text-[8px] font-black uppercase px-2 py-0.5`}>{task.priority}</Badge>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                 <div className="h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center text-[8px] font-black">
                                    {task.assignee === 'Unassigned' ? '?' : task.assignee.split(' ').map(n=>n[0]).join('')}
                                 </div>
                                 <span className={`text-xs font-bold ${task.assignee === 'Unassigned' ? 'text-muted-foreground italic' : ''}`}>{task.assignee}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black flex items-center gap-1.5"><Calendar className="h-3 w-3 text-indigo-500" /> {task.deadline}</span>
                                 <span className="text-[9px] text-muted-foreground font-bold italic uppercase mt-0.5"><Timer className="h-2.5 w-2.5" /> {task.hours}h budget</span>
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
                       ))}
                    </tbody>
                 </table>
              </div>
           </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTasks.map((task, i) => (
             <motion.div
               key={task.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
             >
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                   <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                         <Badge className={`${priorityStyles[task.priority as keyof typeof priorityStyles]} text-[8px] font-black uppercase`}>{task.priority}</Badge>
                         <Badge className={`${statusStyles[task.status as keyof typeof statusStyles]} text-[8px] font-black uppercase`}>{task.status}</Badge>
                      </div>
                      <CardTitle className="text-lg font-bold italic group-hover:text-primary transition-colors">{task.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/60 mt-0.5">{task.project}</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30">
                         <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm border border-secondary">
                            {task.assignee === 'Unassigned' ? '?' : task.assignee.split(' ').map(n=>n[0]).join('')}
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Assigned Ownership</p>
                            <p className="text-xs font-bold leading-none">{task.assignee}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="flex flex-col gap-1 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/20">
                            <span className="text-[9px] font-black uppercase text-indigo-400">Target Date</span>
                            <span className="text-[11px] font-bold flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {task.deadline}</span>
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
           ))}
        </div>
      )}
    </div>
  );
}

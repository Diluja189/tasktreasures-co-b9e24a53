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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const tasksData = [
  { id: "T1", name: "AWS S3 Bucket Config", project: "Cloud Migration", priority: "High", deadline: "2026-04-18", assignee: "Sarah Chen", status: "In Progress" },
  { id: "T2", name: "OAuth2 Provider Integration", project: "Security Infrastructure", priority: "High", deadline: "2026-04-20", assignee: "David Kim", status: "Not Started" },
  { id: "T3", name: "Chart.js Theme Registry", project: "SaaS Dashboard Phase 2", priority: "Medium", deadline: "2026-04-25", assignee: "Unassigned", status: "Not Started" },
  { id: "T4", name: "Legacy DB Indexing Audit", project: "Cloud Migration", priority: "High", deadline: "2026-04-15", assignee: "Sarah Chen", status: "Completed" },
  { id: "T5", name: "UI Polish - Sidebar Motion", project: "SaaS Dashboard Phase 2", priority: "Low", deadline: "2026-05-01", assignee: "Mike Chen", status: "In Progress" },
];

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");

  const filtered = tasksData.filter(t => 
    (projectFilter === "All" || t.project === projectFilter) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
             Task Intelligence Audit
           </h1>
           <p className="text-muted-foreground mt-1">Global oversight of all operational tasks across the enterprise.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Syncing global task ledger...")}>
              <RefreshCw className="h-4 w-4" /> Refresh Global
           </Button>
           <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl font-bold border-none transition-all active:scale-95 px-6">
              <Plus className="h-4 w-4" /> Global Task
           </Button>
        </div>
      </div>

      {/* Filter Stripe */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1 lg:max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search all tasks..." 
                 className="pl-10 h-10 border-none bg-background rounded-xl"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full lg:w-56 font-bold text-[11px]">
                  <SelectValue placeholder="All Projects" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                  <SelectItem value="All">All Active Projects</SelectItem>
                  <SelectItem value="Cloud Migration">Cloud Migration</SelectItem>
                  <SelectItem value="Security Infrastructure">Security Infrastructure</SelectItem>
               </SelectContent>
            </Select>
            <div className="h-8 w-px bg-border/50 hidden lg:block" />
            <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 font-bold px-4 border-none bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20">
               <BarChart3 className="h-4 w-4" /> Task Statistics
            </Button>
         </div>
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
         <CardHeader className="p-6 border-b border-border/10 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-lg font-bold">Comprehensive Task Table</CardTitle>
               <CardDescription>Strategic visibility into every execution unit.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/50 border-none font-bold text-[10px] px-3">
               {filtered.length} Work Records Found
            </Badge>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-secondary/20 border-b border-border/50">
                     <tr>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Work Unit Identifier</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Strategic Scope</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Leadership</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Execution</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Status</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Timeline</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Audit</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {filtered.map((task, i) => (
                       <motion.tr 
                         key={task.id} 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.03 }}
                         className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                       >
                          <td className="p-5">
                             <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{task.name}</p>
                             <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-1.5 mt-0.5"><Target className="h-2.5 w-2.5" /> ID: {task.id}</p>
                          </td>
                          <td className="p-5">
                             <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                                   <Target className="h-3 w-3" />
                                </div>
                                <span className="text-xs font-bold">{task.project}</span>
                             </div>
                          </td>
                          <td className="p-5">
                             <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-secondary text-primary flex items-center justify-center text-[8px] font-black border border-border">
                                   {task.assignee === 'Unassigned' ? '?' : task.assignee.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <span className="text-xs font-medium">{task.assignee}</span>
                             </div>
                          </td>
                          <td className="p-5">
                             <Badge className={`${task.priority === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-indigo-500/10 text-indigo-600'} border-none text-[8px] font-bold uppercase px-2 py-0.5`}>
                                {task.priority}
                             </Badge>
                          </td>
                          <td className="p-5">
                             <Badge variant="outline" className={`text-[9px] font-bold px-3 py-1 rounded-full ${task.status === 'Completed' ? 'border-emerald-500 text-emerald-600' : 'border-indigo-200 text-indigo-600'}`}>
                                {task.status}
                             </Badge>
                          </td>
                          <td className="p-5">
                             <span className="text-xs font-bold flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {task.deadline}</span>
                          </td>
                          <td className="p-5 text-center">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <ChevronRight className="h-4 w-4" />
                             </Button>
                          </td>
                       </motion.tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

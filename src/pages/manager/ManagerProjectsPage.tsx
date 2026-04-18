import { useState } from "react";
import { 
  Search, Filter,
  ArrowUpRight, Clock, Users, Calendar, 
  ChevronRight, LayoutGrid, List, MoreVertical,
  ShieldCheck, AlertCircle, Target, UserPlus, UserCog,
  CheckCircle2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const assignedProjectsData = [
  { id: "P1", name: "Cloud Migration", description: "Migrating legacy infrastructure to AWS cloud architecture.", progress: 65, status: "On-Time", deadline: "Apr 20, 2026", priority: "High", teamCapacity: 8, assignedMembers: 8, assignedBy: "Admin", pendingTasks: 12, overdueTasks: 0 },
  { id: "P2", name: "SaaS Dashboard Phase 2", description: "Developing predictive analytics and real-time monitoring components.", progress: 42, status: "Delayed", deadline: "May 12, 2026", priority: "High", teamCapacity: 12, assignedMembers: 5, assignedBy: "Admin", pendingTasks: 24, overdueTasks: 3 },
  { id: "P3", name: "Security Infrastructure", description: "Implementing Zero-Trust network protocols and hardware keys.", progress: 88, status: "On-Time", deadline: "Apr 28, 2026", priority: "High", teamCapacity: 6, assignedMembers: 6, assignedBy: "Admin", pendingTasks: 4, overdueTasks: 0 },
  { id: "P4", name: "Customer Portal Redesign", description: "Refreshing the B2B customer self-service interface.", progress: 15, status: "At Risk", deadline: "Jun 15, 2026", priority: "Medium", teamCapacity: 5, assignedMembers: 2, assignedBy: "Admin", pendingTasks: 18, overdueTasks: 1 },
  { id: "P5", name: "API Documentation Audit", description: "Standardizing internal endpoints and OpenAPI documentation.", progress: 95, status: "On-Time", deadline: "Apr 22, 2026", priority: "Low", teamCapacity: 3, assignedMembers: 3, assignedBy: "Admin", pendingTasks: 2, overdueTasks: 0 },
];

const statusStyles = {
  "On-Time": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Delayed": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  "At Risk": "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const priorityStyles = {
  "High": "bg-purple-600 text-white border-transparent shadow-[0_0_10px_rgba(147,51,234,0.3)]",
  "Medium": "bg-purple-500/10 text-purple-600 border-transparent",
  "Low": "bg-slate-500/10 text-slate-600 border-transparent",
};

export default function ManagerProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filtered = assignedProjectsData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
           <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
             My Projects
           </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/60 dark:border-border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter assigned projects..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-background rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Grid View Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="h-full flex flex-col"
          >
            <Card className="border border-slate-200/60 dark:border-border shadow-sm bg-white dark:bg-card rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex gap-2 items-center">
                      <Badge variant="outline" className={`${statusStyles[project.status as keyof typeof statusStyles]} text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md`}>
                         {project.status === "On-Time" && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 inline" />}
                         {project.status === "Delayed" && <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline" />}
                         {project.status === "At Risk" && <AlertTriangle className="w-3.5 h-3.5 mr-1.5 inline" />}
                         {project.status}
                      </Badge>
                      <Badge className={`${priorityStyles[project.priority as keyof typeof priorityStyles]} text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md`}>
                         PRI: {project.priority}
                      </Badge>
                   </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-secondary">
                            <MoreVertical className="h-4 w-4" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48">
                         <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer" onClick={() => navigate("/manager/tasks")}>
                            <Target className="h-4 w-4" /> Breakdown Tasks
                         </DropdownMenuItem>
                         <DropdownMenuItem className="rounded-xl gap-2 py-2 cursor-pointer" onClick={() => navigate("/manager/assignments")}>
                            <Users className="h-4 w-4" /> Allocate Team
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-foreground group-hover:text-purple-600 transition-colors">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-1 flex-1">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 p-6 pt-0 flex flex-col">
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground">Progress</p>
                       <p className="text-sm font-black text-purple-600 dark:text-purple-400">{project.progress}%</p>
                    </div>
                    <Progress value={project.progress} className={`h-2.5 rounded-full overflow-hidden bg-slate-100 dark:bg-secondary ${project.status === 'Delayed' ? '[&>div]:bg-rose-500' : (project.progress > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-purple-600')}`} />
                 </div>

                 <div className="flex items-center gap-3">
                   <div className="flex-1 bg-slate-50 dark:bg-secondary/30 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-border/50">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-muted-foreground mb-0.5">Pending</p>
                         <p className="text-xs font-black text-slate-900 dark:text-foreground leading-none">{project.pendingTasks} Tasks</p>
                      </div>
                   </div>
                   {project.overdueTasks > 0 && (
                      <div className="flex-1 bg-rose-50 dark:bg-rose-500/10 rounded-xl p-3 flex items-center gap-3 border border-rose-100 dark:border-rose-500/20">
                         <AlertCircle className="w-4 h-4 text-rose-600" />
                         <div>
                            <p className="text-[10px] uppercase font-bold text-rose-600/70 mb-0.5">Overdue</p>
                            <p className="text-xs font-black text-rose-600 leading-none">{project.overdueTasks} Tasks!</p>
                         </div>
                      </div>
                   )}
                 </div>

                 <div className="space-y-1.5 bg-slate-50 dark:bg-secondary/20 p-3.5 rounded-xl border border-slate-100 dark:border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] uppercase font-black text-slate-500 dark:text-muted-foreground flex items-center gap-1.5">
                         <Users className="w-3.5 h-3.5 text-blue-500" /> Team Members
                      </p>
                      {project.assignedMembers < project.teamCapacity ? (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold bg-amber-50 rounded-md text-amber-700 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30">
                          Understaffed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold bg-emerald-50 rounded-md text-emerald-700 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30">
                          Fully Staffed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm font-black text-slate-900 dark:text-foreground">
                      <span>{project.assignedMembers} / {project.teamCapacity} Assigned</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none">Deadline</p>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"><Calendar className="h-3 w-3 text-purple-500/70" /> {project.deadline}</div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none">Assigned By</p>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"><UserCog className="h-3 w-3 text-purple-500/70" /> {project.assignedBy}</div>
                    </div>
                 </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                 {project.assignedMembers < project.teamCapacity ? (
                    <Button 
                      className="w-full h-12 rounded-xl gap-2 bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
                      onClick={() => navigate("/manager/assignments")}
                    >
                      <UserPlus className="h-4 w-4" /> Assign Team
                    </Button>
                 ) : (
                    <Button 
                      className="w-full h-12 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-md font-black uppercase text-xs tracking-widest transition-all active:scale-95 text-white"
                      onClick={() => navigate("/manager/tasks")}
                    >
                      Manage Project <ArrowUpRight className="h-4 w-4" />
                    </Button>
                 )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

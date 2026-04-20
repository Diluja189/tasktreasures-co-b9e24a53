import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, Filter,
  ArrowUpRight, Clock, Users, Calendar, 
  ChevronRight, LayoutGrid, List, MoreVertical,
  ShieldCheck, AlertCircle, Target, UserPlus, UserCog,
  CheckCircle2, AlertTriangle, FileText as FileIcon,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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

  const [assignedProjectsData, setAssignedProjectsData] = useState<any[]>([]);

  useEffect(() => {
    const loadManagerProjects = () => {
      const persisted = localStorage.getItem("app_projects_persistence");
      if (persisted) {
        // Only show projects that have an actually assigned manager to simulate "My Projects" scope
        const allProjects = JSON.parse(persisted);
        setAssignedProjectsData(allProjects.filter((p: any) => p.manager && p.manager.length > 0 && p.manager !== "Unassigned"));
      }
    };
    loadManagerProjects();
    window.addEventListener("storage", loadManagerProjects);
    return () => window.removeEventListener("storage", loadManagerProjects);
  }, []);

  const filtered = assignedProjectsData.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                  {/* Briefing Assets Section */}
                  {project.assignmentFiles && project.assignmentFiles.length > 0 && (
                    <div className="space-y-3 bg-indigo-50/30 dark:bg-indigo-500/5 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
                       <p className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 tracking-widest">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin Briefing Assets
                       </p>
                       <div className="flex flex-wrap gap-2">
                          {project.assignmentFiles.map((file: string, idx: number) => (
                             <div 
                               key={idx} 
                               onClick={() => {
                                 toast.info(`Extracting tactical asset: ${file}`, {
                                   description: "Preparing secure download link..."
                                 });
                                 setTimeout(() => toast.success(`${file} downloaded successfully to local storage.`), 1500);
                               }}
                               className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-secondary/40 rounded-xl border border-indigo-100/50 shadow-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-500/10 transition-all group group/file"
                             >
                                <FileIcon className="h-3 w-3 text-indigo-500 group-hover/file:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{file}</span>
                                <Download className="h-2.5 w-2.5 text-slate-400 group-hover/file:text-indigo-600 ml-1 transition-colors" />
                             </div>
                          ))}
                       </div>
                    </div>
                  )}

                 <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-border/40">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none">Timeline</p>
                       <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                             <Calendar className="h-3 w-3 text-purple-500/70" /> 
                             <span className="text-[9px] uppercase text-muted-foreground mr-1">Start:</span>
                             {project.startDate || '2026-01-12'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                             <Clock className="h-3 w-3 text-rose-500/70" />
                             <span className="text-[9px] uppercase text-muted-foreground mr-1">End:</span>
                             {project.deadline || '2026-07-23'}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[10px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none">Authority Info</p>
                       <div className="flex flex-col items-end gap-1 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                             <span className="text-[9px] uppercase text-muted-foreground">Assigned By:</span>
                             <Badge variant="outline" className="border-none bg-purple-50 text-purple-600 text-[10px] font-black h-5 px-2">
                               {project.assignedBy || 'Super Admin'}
                             </Badge>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                 {project.assignedMembers < (project.teamCapacity || 5) && (
                    <Button 
                      className="w-full h-12 rounded-xl gap-2 bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
                      onClick={() => navigate("/manager/assignments")}
                    >
                      <UserPlus className="h-4 w-4" /> Assign Team
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

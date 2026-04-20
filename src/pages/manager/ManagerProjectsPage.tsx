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

      {/* Grid View Optimized for Width & Low Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col"
          >
            <Card className="border border-slate-200/50 dark:border-border shadow-sm bg-white dark:bg-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 relative flex flex-col sm:flex-row h-full">
              {/* Left Side: Basic Info & Branding */}
              <div className="sm:w-2/5 p-5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-border/40 flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/10">
                <div className="flex flex-wrap gap-1.5 mb-3">
                   <Badge variant="outline" className={`${statusStyles[project.status as keyof typeof statusStyles]} text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md`}>
                      {project.status === "On-Time" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                      {project.status === "Delayed" && <AlertCircle className="w-3 h-3 mr-1 inline" />}
                      {project.status === "At Risk" && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                      {project.status}
                   </Badge>
                   <Badge className={`${priorityStyles[project.priority as keyof typeof priorityStyles]} text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md`}>
                      PRI: {project.priority}
                   </Badge>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 dark:text-foreground group-hover:text-purple-600 transition-colors leading-tight mb-2">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="mt-auto space-y-2">
                   <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="uppercase tracking-widest">Authority</span>
                      <span className="text-purple-600 dark:text-purple-400">{project.assignedBy || 'Super Admin'}</span>
                   </div>
                   {project.assignedMembers < (project.teamCapacity || 5) ? (
                      <Button 
                        size="sm"
                        className="w-full h-8 rounded-lg gap-1.5 bg-purple-600 hover:bg-purple-700 shadow-sm font-black uppercase text-[9px] tracking-widest transition-all active:scale-95"
                        onClick={() => navigate("/manager/assignments")}
                      >
                        <UserPlus className="h-3 w-3" /> Assign Team
                      </Button>
                   ) : (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full h-8 rounded-lg gap-1.5 border-emerald-100 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-black uppercase text-[9px] tracking-widest"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Team Full
                      </Button>
                   )}
                </div>
              </div>

              {/* Right Side: Operational Intelligence */}
              <CardContent className="flex-1 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Briefing Assets
                     </p>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-44">
                           <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2" onClick={() => navigate("/manager/tasks")}>
                              <Target className="h-3.5 w-3.5" /> Breakdown Tasks
                           </DropdownMenuItem>
                           <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2" onClick={() => navigate("/manager/assignments")}>
                              <Users className="h-3.5 w-3.5" /> Allocate Team
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  {project.assignmentFiles && project.assignmentFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                       {project.assignmentFiles.map((file: string, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => toast.success(`${file} extraction started...`)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-border shadow-xs cursor-pointer hover:bg-indigo-50 transition-all group/file max-w-full overflow-hidden"
                          >
                             <FileIcon className="h-2.5 w-2.5 text-indigo-500 shrink-0" />
                             <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 truncate">{file}</span>
                          </div>
                       ))}
                    </div>
                  ) : (
                    <div className="py-2 px-3 border border-dashed rounded-xl bg-slate-50/50 flex items-center justify-center">
                       <p className="text-[8px] font-black text-slate-300 tracking-widest uppercase italic">No managed assets</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-100 dark:border-border/40">
                     <div className="space-y-2">
                        <p className="text-[9px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none tracking-widest">Timeline</p>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Start:</span>
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{project.startDate || '2026-04-09'}</span>
                           </div>
                           <div className="flex flex-col text-right">
                              <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">End:</span>
                              <span className="text-[10px] font-black text-rose-500">{project.deadline || '2026-05-21'}</span>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-2 text-right">
                        <p className="text-[9px] uppercase font-black text-slate-400 dark:text-muted-foreground/60 leading-none tracking-widest">Authority Info</p>
                        <div className="flex flex-col items-end">
                           <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Assigned By:</span>
                           <span className="text-[10px] font-black text-purple-600">{project.assignedBy || 'Super Admin'}</span>
                        </div>
                     </div>
                  </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

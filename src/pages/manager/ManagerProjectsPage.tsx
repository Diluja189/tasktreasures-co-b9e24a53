import { useState } from "react";
import { 
  FolderKanban, Search, Filter, RefreshCw, 
  ArrowUpRight, Clock, Users, Calendar, 
  ChevronRight, LayoutGrid, List, MoreVertical,
  ShieldCheck, AlertTriangle, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const assignedProjectsData = [
  { id: "P1", name: "Cloud Migration", description: "Migrating legacy infrastructure to AWS cloud architecture.", progress: 65, status: "On-Time", deadline: "Apr 20, 2026", priority: "High", teamSize: 8 },
  { id: "P2", name: "SaaS Dashboard Phase 2", description: "Developing predictive analytics and real-time monitoring components.", progress: 42, status: "Delayed", deadline: "May 12, 2026", priority: "High", teamSize: 12 },
  { id: "P3", name: "Security Infrastructure", description: "Implementing Zero-Trust network protocols and hardware keys.", progress: 88, status: "On-Time", deadline: "Apr 28, 2026", priority: "High", teamSize: 6 },
  { id: "P4", name: "Customer Portal Redesign", description: "Refreshing the B2B customer self-service interface.", progress: 15, status: "In Progress", deadline: "Jun 15, 2026", priority: "Medium", teamSize: 5 },
  { id: "P5", name: "API Documentation Audit", description: "Standardizing internal endpoints and OpenAPI documentation.", progress: 95, status: "On-Time", deadline: "Apr 22, 2026", priority: "Low", teamSize: 3 },
];

const statusStyles = {
  "On-Time": "bg-emerald-500/10 text-emerald-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none animate-pulse",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
};

export default function ManagerProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const filtered = assignedProjectsData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
             My Primary Projects
           </h1>
           <p className="text-muted-foreground mt-2">Inventory of active projects assigned to your leadership tier.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl">
           <Button variant={viewMode === 'grid' ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => setViewMode('grid')}>
             <LayoutGrid className="h-4 w-4" />
           </Button>
           <Button variant={viewMode === 'list' ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => setViewMode('list')}>
             <List className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter assigned projects..." 
              className="pl-10 h-10 border-none bg-background rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button variant="outline" className="h-10 rounded-xl gap-2 flex-1 lg:flex-none border-none bg-background">
               <Filter className="h-4 w-4" /> Attributes
            </Button>
            <Button variant="secondary" className="h-10 rounded-xl gap-2 flex-1 lg:flex-none" onClick={() => navigate("/manager/reports")}>
               <ShieldCheck className="h-4 w-4" /> Status Assessment
            </Button>
         </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col h-full relative">
                {project.status === 'Delayed' && (
                   <div className="absolute right-0 top-0 h-24 w-24 bg-rose-500/5 rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                     <Badge className={`${statusStyles[project.status as keyof typeof statusStyles]} text-[8px] font-black uppercase tracking-tighter`}>
                        {project.status}
                     </Badge>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48">
                           <DropdownMenuItem className="rounded-xl gap-2 py-2" onClick={() => navigate("/manager/tasks")}>
                              <Target className="h-4 w-4" /> Breakdown Tasks
                           </DropdownMenuItem>
                           <DropdownMenuItem className="rounded-xl gap-2 py-2" onClick={() => navigate("/manager/assignments")}>
                              <Users className="h-4 w-4" /> Allocate Team
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl font-bold italic group-hover:text-primary transition-colors">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs leading-relaxed mt-1">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 pt-2">
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Execution Depth</p>
                         <p className="text-sm font-black text-indigo-600">{project.progress}%</p>
                      </div>
                      <Progress value={project.progress} className={`h-2 rounded-full overflow-hidden ${project.status === 'Delayed' ? '[&>div]:bg-rose-500' : (project.progress > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-indigo-600')}`} />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[9px] uppercase font-black text-muted-foreground/40 leading-none">Hard Deadline</p>
                         <div className="flex items-center gap-1.5 text-[11px] font-bold"><Calendar className="h-3 w-3 text-indigo-400" /> {project.deadline}</div>
                      </div>
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] uppercase font-black text-muted-foreground/40 leading-none">Leadership Scope</p>
                         <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold"><Users className="h-3 w-3 text-emerald-400" /> {project.teamSize} Member Tier</div>
                      </div>
                   </div>

                   <Button 
                     className="w-full h-11 rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black uppercase text-[10px] tracking-widest mt-4 transition-all active:scale-95"
                     onClick={() => navigate("/manager/tasks")}
                   >
                     Initiate Workflow <ArrowUpRight className="h-4 w-4" />
                   </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
           <CardContent className="p-0">
              <table className="w-full text-left">
                 <thead className="bg-secondary/20 border-b border-border/50">
                    <tr>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Stream</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Audit Status</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Performance Delta</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Intervention</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {filtered.map(project => (
                      <tr key={project.id} className="hover:bg-secondary/10 transition-colors group">
                        <td className="px-6 py-5">
                           <p className="font-bold italic text-sm group-hover:text-primary">{project.name}</p>
                           <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-bold tracking-tighter">Priority: {project.priority}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <Badge className={`${statusStyles[project.status as keyof typeof statusStyles]} text-[8px] font-black uppercase`}>{project.status}</Badge>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3 w-32">
                              <Progress value={project.progress} className="h-1 flex-1" />
                              <span className="text-[11px] font-bold text-indigo-600">{project.progress}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-medium flex items-center gap-2"><Clock className="h-3 w-3" /> {project.deadline}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl" onClick={() => navigate("/manager/tasks")}>
                              <ChevronRight className="h-4 w-4" />
                           </Button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </CardContent>
        </Card>
      )}
    </div>
  );
}

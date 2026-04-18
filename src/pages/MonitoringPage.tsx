import { useState } from "react";
import { 
  BarChart3, Calendar, Clock, Filter, Search, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  LayoutDashboard, MoreVertical, RefreshCw, Eye,
  LayoutGrid, List, Activity, GanttChart, Users,
  CalendarDays, UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const monitoredProjects = [
  { id: "M1", name: "Cloud Migration", manager: "Sarah Chen", progress: 65, status: "On-Time", priority: "High", timeline: "Jan - Apr", risk: "Low", deadline: "2024-05-15", teamSize: 8, load: "Medium" },
  { id: "M2", name: "SaaS Dashboard Redesign", manager: "David Kim", progress: 42, status: "Delayed", priority: "Medium", timeline: "Feb - Jun", risk: "High", deadline: "2024-04-12", teamSize: 5, load: "High" },
  { id: "M3", name: "Mobile App v2.0", manager: "Unassigned", progress: 0, status: "In Setup", priority: "High", timeline: "Mar - Sep", risk: "None", deadline: "2024-09-30", teamSize: 0, load: "None" },
  { id: "M4", name: "Security Infrastructure", manager: "Lisa Wang", progress: 88, status: "In Progress", priority: "High", timeline: "Jan - May", risk: "Low", deadline: "2024-06-10", teamSize: 12, load: "High" },
  { id: "M5", name: "Legacy System Audit", manager: "Sarah Chen", progress: 95, status: "On-Time", priority: "Low", timeline: "Jan - Mar", risk: "None", deadline: "2024-03-25", teamSize: 3, load: "Low" },
];

const statusStyles = {
  "On-Time": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "Delayed": "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse",
  "In Setup": "bg-secondary/50 text-muted-foreground border-border/50",
};

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newDeadline, setNewDeadline] = useState("");

  const getDeadlineStatus = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, color: "text-rose-600 font-black", icon: <AlertTriangle className="h-3 w-3" /> };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, color: "text-amber-600 font-black", icon: <Clock className="h-3 w-3" /> };
    }
    return { text: `${diffDays} days left`, color: "text-emerald-600 font-bold", icon: <CalendarDays className="h-3 w-3" /> };
  };

  const handleExtend = () => {
    if (!newDeadline) return toast.error("Please select a date");
    toast.success(`Deadline for "${selectedProject?.name}" extended to ${newDeadline}`);
    setIsExtendOpen(false);
  };

  const handleReview = () => {
    toast.success(`Audit log generated for "${selectedProject?.name}"`);
    setIsReviewOpen(false);
  };

  const filtered = monitoredProjects.filter(p => 
    (statusFilter === "All" || p.status === statusFilter) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black tracking-tight text-foreground">
             Project Monitoring
           </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2 h-8 rounded-xl font-bold text-xs" onClick={() => toast.info("Syncing monitor data...")}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
           </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-3 rounded-2xl border shadow-sm">
         <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search active monitor..." 
              className="pl-9 h-8 border-none bg-background rounded-xl text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 w-full lg:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="h-8 rounded-xl border-none bg-background w-full lg:w-40 text-xs font-bold">
                  <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl shadow-2xl border-none p-1.5">
                  <SelectItem value="All">All Projects</SelectItem>
                  <SelectItem value="On-Time">On-Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
               </SelectContent>
            </Select>
            <Button variant="secondary" className="h-8 rounded-xl px-3 gap-2 flex-1 lg:flex-none text-[10px] font-black uppercase tracking-widest">
               <Filter className="h-3 w-3" /> Filters
            </Button>
         </div>
      </div>

      {/* Risk Alert Header */}
      <AnimatePresence>
        {monitoredProjects.some(p => p.risk === 'High') && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl flex flex-col md:flex-row items-center gap-3 text-rose-600 mb-4 overflow-hidden relative"
           >
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                 <AlertTriangle size={60} />
              </div>
              <div className="h-9 w-9 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0 animate-pulse">
                 <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <p className="text-sm font-black uppercase tracking-tight">Strategic Alert: Operational Variance</p>
                 <p className="text-[10px] font-bold opacity-80">2 Active projects are currently 12%+ behind schedule completion.</p>
              </div>
              <Button 
                size="sm" 
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 h-8 font-black uppercase text-[8px] tracking-widest border-none transition-all active:scale-95 shadow-md shadow-rose-600/10"
                onClick={() => {
                  setStatusFilter("Delayed");
                  toast.success("Filtering high-risk projects");
                }}
              >
                 Analyze All
              </Button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {filtered.map((project, i) => {
           const dl = getDeadlineStatus(project.deadline);
           const isUnassigned = project.manager === "Unassigned";
           const isUrgent = project.risk === 'High' || project.status === 'Delayed';

           return (
             <motion.div 
               key={project.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
             >
                <Card className={`border-none shadow-sm bg-card/60 backdrop-blur-sm group hover:shadow-md transition-all rounded-2xl overflow-hidden relative ${isUnassigned ? 'bg-rose-500/[0.02] border-rose-500/10' : ''} ${isUrgent ? 'ring-1 ring-rose-500/10' : ''}`}>
                   {isUrgent && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-rose-500/50" />
                   )}
                   <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                         <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-black truncate text-foreground/90 leading-tight mb-0.5">{project.name}</CardTitle>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                               <Badge variant="outline" className={`text-[7px] rounded-sm uppercase px-1 h-3.5 border-none font-black ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                                  {project.status}
                               </Badge>
                               <span className={`text-[8px] font-bold truncate ${isUnassigned ? 'text-rose-600' : 'text-muted-foreground'}`}>
                                 {isUnassigned ? "NO MANAGER" : project.manager}
                               </span>
                            </div>
                         </div>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md hover:bg-secondary shrink-0">
                               <MoreVertical className="h-3 w-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1 min-w-[120px]">
                             <DropdownMenuItem className="rounded-lg gap-2 font-bold text-[9px]" onClick={() => navigate('/assign-manager')}>
                               Reassign
                             </DropdownMenuItem>
                             <DropdownMenuItem className="rounded-lg gap-2 font-bold text-[9px]" onClick={() => {
                               setSelectedProject(project);
                               setNewDeadline(project.deadline);
                               setIsExtendOpen(true);
                             }}>
                               Extend
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </div>

                      <div className="space-y-1.5">
                         <div className="flex items-center justify-between text-[8px] font-black uppercase text-muted-foreground/40">
                            <span className="flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" /> Progress</span>
                            <span>{project.progress}%</span>
                         </div>
                         <Progress value={project.progress} className={`h-1 rounded-full overflow-hidden bg-secondary/30 ${project.progress > 80 ? '[&>div]:bg-emerald-500' : (isUrgent ? '[&>div]:bg-rose-500' : '[&>div]:bg-indigo-600')}`} />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/5">
                         <div className="flex flex-col">
                            <p className="text-[7px] uppercase font-black text-muted-foreground/40">Deadline</p>
                            <span className={`text-[8px] font-black uppercase ${dl.color} flex items-center gap-1`}>
                               {dl.text.split(" left")[0]}
                            </span>
                         </div>
                         <div className="flex items-center gap-1">
                            {isUnassigned ? (
                              <Button 
                                onClick={() => navigate('/assign-manager')}
                                className="h-6 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 font-black uppercase text-[7px] tracking-widest border-none"
                              >
                                Assign
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                className="h-6 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-[7px] tracking-widest border-none"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsReviewOpen(true);
                                }}
                              >
                                Review
                              </Button>
                            )}
                         </div>
                      </div>
                   </div>
                </Card>
             </motion.div>
           );
         })}
      </div>

      {/* Extend Deadline Modal */}
      <Dialog open={isExtendOpen} onOpenChange={setIsExtendOpen}>
        <DialogContent className="sm:max-w-[320px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-indigo-600 p-4 text-white text-left">
            <DialogTitle className="text-base font-bold">Timeline Extension</DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-[10px] italic">Adjust project completion parameters.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Project Name</p>
                <p className="text-xs font-bold truncate bg-secondary/20 p-2 rounded-lg italic text-foreground">
                  {selectedProject?.name}
                </p>
             </div>
             <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">New Deadline</p>
                <Input 
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="h-8 rounded-xl border-secondary bg-secondary/10 text-xs font-bold"
                />
             </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end">
             <Button variant="ghost" className="h-8 px-4 rounded-xl text-[10px] font-bold" onClick={() => setIsExtendOpen(false)}>Cancel</Button>
             <Button className="h-8 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20" onClick={handleExtend}>
                Update
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Project Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[350px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-emerald-600 p-4 text-white text-left">
            <DialogTitle className="text-base font-bold">Deep Health Audit</DialogTitle>
            <DialogDescription className="text-emerald-100/70 text-[10px] italic">Strategic overview of project parameters.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                   <p className="text-[8px] font-black uppercase text-muted-foreground/60">Operational Risk</p>
                   <p className={`text-xs font-black mt-0.5 ${selectedProject?.risk === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                     {selectedProject?.risk}
                   </p>
                </div>
                <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                   <p className="text-[8px] font-black uppercase text-muted-foreground/60">Resource Load</p>
                   <p className="text-xs font-black mt-0.5 text-indigo-600">
                     {selectedProject?.load}
                   </p>
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Manager Commentary</p>
                <p className="text-[10px] font-medium leading-relaxed italic text-muted-foreground bg-secondary/5 p-3 rounded-xl">
                  Project is currently tracking according to adjusted bandwidth. No critical roadblocks detected in last 24h.
                </p>
             </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end">
             <Button variant="outline" className="h-8 px-6 rounded-xl text-[10px] font-bold border-none bg-emerald-500/10 text-emerald-600" onClick={handleReview}>
                Approve Audit
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

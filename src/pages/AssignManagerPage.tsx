import { useState } from "react";
import { 
  UserPlus, Search, Filter, RefreshCw, CheckCircle2, 
  AlertCircle, Users, LayoutDashboard, ArrowUpRight,
  Info, ChevronRight, UserCheck, ShieldAlert, TrendingUp, Target,
  Zap, Clock, ShieldCheck, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const projects = [
  { id: "P1", name: "Cloud Migration", status: "Unassigned", priority: "High", complexity: "Hard" },
  { id: "P2", name: "SaaS Dashboard", status: "Sarah Chen", priority: "Medium", complexity: "Medium" },
  { id: "P3", name: "Mobile App v2", status: "Unassigned", priority: "High", complexity: "Hard" },
  { id: "P4", name: "Security Audit", status: "David Kim", priority: "Low", complexity: "Easy" },
  { id: "P5", name: "E-Commerce Integration", status: "Unassigned", priority: "Medium", complexity: "Medium" },
];

const managers = [
  { id: "M1", name: "Sarah Chen", workload: 85, projects: 4, efficiency: 94, avatar: "SC", status: "High" },
  { id: "M2", name: "David Kim", workload: 40, projects: 2, efficiency: 88, avatar: "DK", status: "Balanced" },
  { id: "M3", name: "Lisa Wang", workload: 95, projects: 6, efficiency: 91, avatar: "LW", status: "Overloaded" },
  { id: "M4", name: "Mike Chen", workload: 20, projects: 1, efficiency: 82, avatar: "MC", status: "Balanced" },
];

const statusStyles = {
  "Balanced": "bg-emerald-500/10 text-emerald-600 border-none",
  "High": "bg-amber-500/10 text-amber-600 border-none",
  "Overloaded": "bg-rose-500/10 text-rose-600 border-none animate-pulse",
};

export default function AssignManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignClick = (project: any) => {
    setSelectedProject(project);
    setSelectedManager(project.status !== "Unassigned" ? project.status : "");
    setIsModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedManager) return toast.error("Please select a manager");
    const manager = managers.find(m => m.name === selectedManager);
    if (manager?.status === 'Overloaded') {
       toast.warning(`Resource Overload: ${selectedManager} is currently at peak capacity. Proceeding with caution.`);
    }
    toast.success(`Project "${selectedProject.name}" assigned to ${selectedManager}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
            Resource Allocation Console
          </h1>
          <p className="text-muted-foreground mt-2">Strategically assign leadership to projects based on real-time bandwidth.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Syncing manager workload...")}>
          <RefreshCw className="h-4 w-4" /> Refresh Bandwidth
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-secondary/20 pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search project inventory..." 
                    className="pl-10 h-10 border-none bg-background rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-indigo-500/5 text-indigo-600 border-none px-4 py-2 rounded-lg font-bold text-[10px]">
                    {projects.filter(p=>p.status==='Unassigned').length} Awaiting Manager
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/50">
                 {filteredProjects.map((project, i) => (
                   <motion.div 
                     key={project.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group flex flex-col sm:flex-row items-center justify-between p-6 hover:bg-sky-500/[0.02] transition-colors"
                   >
                     <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className={`p-4 rounded-2xl ${project.status === 'Unassigned' ? 'bg-amber-500/10 text-amber-600' : 'bg-indigo-500/10 text-indigo-600'} transition-transform group-hover:scale-110 shadow-sm border border-transparent group-hover:border-indigo-500/10`}>
                           {project.status === 'Unassigned' ? <ShieldAlert className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                        </div>
                        <div>
                           <p className="font-bold text-lg group-hover:text-primary transition-colors italic">{project.name}</p>
                           <div className="flex items-center gap-3 mt-1">
                              <Badge variant="secondary" className="text-[9px] uppercase font-bold bg-muted border-none p-0 px-2 h-4 shadow-none">
                                {project.complexity} complexity
                              </Badge>
                              <p className={`text-[11px] font-bold uppercase tracking-widest ${project.status === 'Unassigned' ? 'text-amber-600' : 'text-indigo-600'}`}>
                                {project.status === 'Unassigned' ? 'Awaiting Leadership' : `Managed by ${project.status}`}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                        <Button 
                          variant={project.status === 'Unassigned' ? 'default' : 'secondary'} 
                          className={`w-full sm:w-auto rounded-2xl gap-3 font-black uppercase text-[10px] tracking-widest h-11 px-8 ${project.status === 'Unassigned' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30' : 'hover:bg-indigo-500/10 hover:text-indigo-600 transition-all border-none bg-indigo-500/5'}`}
                          onClick={() => handleAssignClick(project)}
                        >
                          {project.status === 'Unassigned' ? 'Assign Leader' : 'Update Manager'} <ArrowUpRight className="h-4 w-4" />
                        </Button>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Manager Workload Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Users className="h-28 w-28" />
              </div>
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-bold">Manager Capacity Audit</CardTitle>
                 <CardDescription className="text-indigo-100/70 text-xs">Resource bandwidth & distribution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                 {managers.map(manager => (
                   <div key={manager.id} className={`space-y-3 p-3 rounded-2xl transition-all ${manager.status === 'Overloaded' ? 'bg-white/10' : ''}`}>
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <span className="opacity-90">{manager.name}</span>
                            <Badge className={`${statusStyles[manager.status as keyof typeof statusStyles]} text-[8px] h-4 px-1.5 font-black uppercase leading-none`}>
                               {manager.status}
                            </Badge>
                         </div>
                         <span className={manager.workload > 80 ? 'text-rose-200' : 'text-emerald-200'}>{manager.workload}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${manager.workload}%` }}
                           className={`h-full ${manager.workload > 85 ? 'bg-rose-400' : (manager.workload > 60 ? 'bg-amber-400' : 'bg-emerald-400')} rounded-full shadow-lg`}
                         />
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-70 italic font-bold">
                         <span>{manager.projects} Active Projects</span>
                         <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {manager.efficiency}% Performance</span>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-indigo-500/10">
              <CardHeader className="pb-4">
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4 text-indigo-500" /> Strategic Scaling</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button variant="secondary" className="w-full rounded-2xl h-14 gap-3 group border-none shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-500 bg-white">
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" /> Recruit Manager
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Assignment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-indigo-600 p-8 text-white relative">
             <div className="absolute top-4 right-4 opacity-5">
                <LayoutDashboard className="h-24 w-24" />
             </div>
             <DialogTitle className="text-2xl font-bold tracking-tight">Leadership Selection</DialogTitle>
             <DialogDescription className="text-indigo-100/80 text-sm">Designate a manager for <strong>{selectedProject?.name}</strong></DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
             <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Eligible Leadership Layer</p>
                <div className="grid grid-cols-1 gap-3">
                   {managers.map(manager => (
                     <div 
                        key={manager.id} 
                        onClick={() => setSelectedManager(manager.name)}
                        className={`group flex items-center justify-between p-4 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden ${selectedManager === manager.name ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-secondary bg-secondary/20 hover:bg-secondary/40'} ${manager.status === 'Overloaded' ? 'opacity-80' : ''}`}
                     >
                        <div className="flex items-center gap-4">
                           <Avatar className="h-11 w-11 border-2 border-white shadow-md">
                              <AvatarFallback className="bg-indigo-500/10 text-indigo-700 font-black text-xs uppercase">{manager.avatar}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="text-sm font-black tracking-tight">{manager.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <Badge className={`${statusStyles[manager.status as keyof typeof statusStyles]} text-[8px] font-black h-3.5 px-1.5 uppercase leading-none`}>{manager.status}</Badge>
                                 <span className="text-[10px] font-bold text-muted-foreground">{manager.projects} Active Proj.</span>
                              </div>
                           </div>
                        </div>
                        {selectedManager === manager.name && (
                           <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              className="bg-indigo-600 text-white rounded-full p-1 shadow-lg shadow-indigo-600/30"
                           >
                              <CheckCircle2 className="h-5 w-5" />
                           </motion.div>
                        )}
                        {manager.status === 'Overloaded' && (
                           <div className="absolute top-2 right-2">
                              <AlertTriangle className="h-3 w-3 text-rose-500 animate-pulse" />
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                   <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-[11px] text-indigo-700 leading-relaxed font-bold">
                   This action is logged in the immutable system audit records. The manager will be notified of the strategic assignment immediately.
                </p>
             </div>
          </div>

          <DialogFooter className="p-8 pt-4 grid grid-cols-2 gap-4">
             <Button variant="ghost" className="rounded-2xl h-12 font-bold text-xs uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 shadow-xl shadow-indigo-600/30 px-8 font-black uppercase text-[10px] tracking-widest tracking-widest border-none transition-all active:scale-95" onClick={handleConfirmAssignment}>
                Confirm Selection
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

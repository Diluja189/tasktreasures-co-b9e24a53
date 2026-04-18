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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

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
  
  const [isRecruitOpen, setIsRecruitOpen] = useState(false);
  const [recruitData, setRecruitData] = useState({ name: "", email: "", specialization: "General" });

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

  const handleRecruit = () => {
    if (!recruitData.name || !recruitData.email) return toast.error("Please fill all fields");
    toast.success(`Invitation sent to ${recruitData.name}`);
    setIsRecruitOpen(false);
    setRecruitData({ name: "", email: "", specialization: "General" });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Manager Assignment
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => toast.info("Syncing manager workload...")}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="space-y-8">
        {/* Projects List - Compacted focus */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-secondary/20 py-3 px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search project inventory..." 
                  className="pl-9 h-8 border-none bg-background rounded-lg text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-indigo-500/5 text-indigo-600 border-none px-3 py-1 rounded-lg font-bold text-[9px]">
                  {projects.filter(p=>p.status==='Unassigned').length} Pending
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/20">
               {filteredProjects.map((project, i) => (
                 <motion.div 
                   key={project.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="group flex flex-col sm:flex-row items-center justify-between py-3 px-5 hover:bg-sky-500/[0.01] transition-colors"
                 >
                   <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className={`p-2.5 rounded-xl ${project.status === 'Unassigned' ? 'bg-amber-500/10 text-amber-600' : 'bg-indigo-500/10 text-indigo-600'} transition-transform group-hover:scale-105 shadow-sm border border-transparent`}>
                         {project.status === 'Unassigned' ? <ShieldAlert className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                         <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors italic">{project.name}</p>
                         <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[8px] uppercase font-bold bg-muted border-none p-0 px-1.5 h-3 shadow-none">
                              {project.complexity}
                            </Badge>
                            <p className={`text-[9px] font-bold uppercase tracking-widest ${project.status === 'Unassigned' ? 'text-amber-600' : 'text-indigo-600'}`}>
                              {project.status === 'Unassigned' ? 'Awaiting' : `By ${project.status}`}
                            </p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
                      <Button 
                        variant={project.status === 'Unassigned' ? 'default' : 'secondary'} 
                        className={`w-full sm:w-auto rounded-lg gap-2 font-black uppercase text-[8px] tracking-widest h-8 px-4 ${project.status === 'Unassigned' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20' : 'hover:bg-indigo-500/10 hover:text-indigo-600 transition-all border-none bg-indigo-500/5'}`}
                        onClick={() => handleAssignClick(project)}
                      >
                        {project.status === 'Unassigned' ? 'Assign' : 'Update'} <ArrowUpRight className="h-3 w-3" />
                      </Button>
                   </div>
                 </motion.div>
               ))}
             </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Manager Capacity Audit - Compact */}
          <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
               <Users className="h-16 w-16" />
            </div>
            <CardHeader className="py-3 px-5">
               <CardTitle className="text-sm font-bold">Manager Capacity Audit</CardTitle>
               <CardDescription className="text-indigo-100/70 text-[10px]">Resource bandwidth audit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
               {managers.map(manager => (
                 <div key={manager.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                       <div className="flex items-center gap-2">
                          <span className="opacity-90">{manager.name}</span>
                          <Badge className={`${statusStyles[manager.status as keyof typeof statusStyles]} text-[7px] h-3 px-1 font-black uppercase leading-none`}>
                             {manager.status}
                          </Badge>
                       </div>
                       <span className="text-secondary-foreground/70">{manager.workload}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${manager.workload}%` }}
                         className={`h-full ${manager.workload > 85 ? 'bg-rose-400' : (manager.workload > 60 ? 'bg-amber-400' : 'bg-emerald-400')} rounded-full shadow-sm`}
                       />
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>

          {/* Strategic Scaling - Compact */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-indigo-500/10 flex flex-col justify-center h-full min-h-[160px]">
            <CardHeader className="py-3 px-5">
               <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Target className="h-3 w-3 text-indigo-500" /> Strategic Scaling</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex-1 flex items-center">
               <Button 
                variant="secondary" 
                className="w-full rounded-xl h-12 gap-3 group border-none shadow-sm hover:bg-indigo-600 hover:text-white transition-all duration-500 bg-white"
                onClick={() => setIsRecruitOpen(true)}
               >
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" /> 
                  <div className="text-left">
                     <p className="font-bold text-xs">Recruit Manager</p>
                     <p className="text-[8px] opacity-70 uppercase font-black tracking-widest">Scale Team</p>
                  </div>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recruit Manager Modal */}
      <Dialog open={isRecruitOpen} onOpenChange={setIsRecruitOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-indigo-600 p-6 text-white text-left">
            <DialogTitle className="text-lg font-bold">New Leader Onboarding</DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-xs italic">Send recruitment invitation to a new manager.</DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
             <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Full Name</Label>
                <Input 
                  placeholder="E.g. James Wilson" 
                  value={recruitData.name}
                  onChange={e => setRecruitData(p => ({ ...p, name: e.target.value }))}
                  className="h-9 rounded-xl border-secondary bg-secondary/10 text-xs"
                />
             </div>
             <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Official Email</Label>
                <Input 
                  type="email"
                  placeholder="james.w@company.com" 
                  value={recruitData.email}
                  onChange={e => setRecruitData(p => ({ ...p, email: e.target.value }))}
                  className="h-9 rounded-xl border-secondary bg-secondary/10 text-xs"
                />
             </div>
             <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Specialization</Label>
                <Select value={recruitData.specialization} onValueChange={v => setRecruitData(p => ({ ...p, specialization: v }))}>
                   <SelectTrigger className="h-9 rounded-xl border-secondary bg-secondary/10 text-xs">
                      <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="General">General Project Management</SelectItem>
                      <SelectItem value="Technical">Technical Operations</SelectItem>
                      <SelectItem value="Creative">Creative Lead</SelectItem>
                   </SelectContent>
                </Select>
             </div>
          </div>

          <DialogFooter className="p-6 pt-0 flex gap-2 justify-end">
             <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold" onClick={() => setIsRecruitOpen(false)}>Cancel</Button>
             <Button className="h-9 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20" onClick={handleRecruit}>
                Send Invitation
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[340px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="bg-indigo-600 p-4 text-white text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <LayoutDashboard className="h-16 w-16" />
             </div>
             <DialogTitle className="text-base font-black tracking-tight uppercase">Leader Selection</DialogTitle>
             <DialogDescription className="text-indigo-100/80 text-[10px] italic">Designate lead for <strong>{selectedProject?.name}</strong></DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto no-scrollbar">
             <div className="space-y-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Eligible Leadership Layer</p>
                <div className="grid grid-cols-1 gap-2">
                   {managers.map(manager => (
                     <div 
                        key={manager.id} 
                        onClick={() => setSelectedManager(manager.name)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${selectedManager === manager.name ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-secondary bg-secondary/10 hover:bg-secondary/20'} ${manager.status === 'Overloaded' ? 'opacity-70' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                           <Avatar className="h-8 w-8 border shadow-sm">
                              <AvatarFallback className="bg-indigo-500/10 text-indigo-700 font-black text-[9px] uppercase">{manager.avatar}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="text-[11px] font-black tracking-tight text-foreground">{manager.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <Badge className={`${statusStyles[manager.status as keyof typeof statusStyles]} text-[7px] font-black h-3 px-1 uppercase leading-none border-none`}>{manager.status}</Badge>
                                 <span className="text-[9px] font-bold text-muted-foreground/60">{manager.projects} Projects</span>
                              </div>
                           </div>
                        </div>
                        {selectedManager === manager.name && (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-600 text-white rounded-full p-0.5 shadow-lg shadow-indigo-600/30">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                           </motion.div>
                        )}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 flex items-start gap-3">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 mt-0.5" />
                <p className="text-[9px] text-indigo-700 leading-tight font-bold">
                   Assignment is logged in system audit. Manager will be notified immediately.
                </p>
             </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end">
             <Button variant="ghost" className="h-8 px-4 rounded-xl text-[10px] font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button className="h-8 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 shadow-none border-none active:scale-95 transition-all" onClick={handleConfirmAssignment}>
                Assign Lead
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

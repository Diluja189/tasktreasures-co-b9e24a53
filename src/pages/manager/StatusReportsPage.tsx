import { useState } from "react";
import { 
  FileText, Send, Download, RefreshCw, 
  CheckCircle2, Clock, AlertTriangle, MessageSquare,
  ShieldCheck, ArrowUpRight, FileBarChart, History,
  LayoutDashboard, PieChart, Target, Zap, TimerOff,
  ChevronRight, ListTodo, ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const reportableProjects = [
  { id: "P1", name: "Cloud Migration", completed: 8, inProgress: 4, delayed: 0, health: 92 },
  { id: "P2", name: "SaaS Dashboard Phase 2", completed: 3, inProgress: 3, delayed: 2, health: 68 },
  { id: "P3", name: "Security Infrastructure", completed: 5, inProgress: 1, delayed: 0, health: 95 },
];

export default function StatusReportsPage() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [managerNote, setManagerNote] = useState("");
  const [risks, setRisks] = useState("");

  const projectData = reportableProjects.find(p => p.id === selectedProject);

  const handleSubmitReport = () => {
    if (!selectedProject) return toast.error("Please select a target project for the report.");
    toast.success("Strategic Status Assessment submitted to Admin Layer.");
    setManagerNote("");
    setRisks("");
    setSelectedProject("");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
             Strategic Status Assessment
           </h1>
           <p className="text-muted-foreground mt-2">Finalize and submit operational throughput audits to the Administrative command layer.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => toast.info("Syncing latest lifecycle telemetry...")}>
           <RefreshCw className="h-4 w-4" /> Sync Telemetry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Report Compilation Console */}
        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-indigo-500/5">
              <CardHeader className="bg-indigo-600 p-8 text-white border-none">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                          <ClipboardCheck className="h-6 w-6" /> Assessment Composer
                       </CardTitle>
                       <CardDescription className="text-indigo-100/70">Compile high-precision status intelligence for review.</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white bg-white/10 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">Draft Mode</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em]">Select Active Project</label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                       <SelectTrigger className="h-14 rounded-2xl border-none bg-secondary/30 text-lg font-bold px-6 shadow-inner">
                          <SelectValue placeholder="Target Project Stream" />
                       </SelectTrigger>
                       <SelectContent className="rounded-[2rem] border-none shadow-2xl p-2">
                          {reportableProjects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-xl py-3 cursor-pointer">
                               {p.name}
                            </SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>

                 <AnimatePresence mode="wait">
                    {projectData ? (
                       <motion.div
                         key={projectData.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.98 }}
                         className="space-y-8"
                       >
                          {/* Telemetry Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             {[
                               { label: "Finalized", val: projectData.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                               { label: "Active", val: projectData.inProgress, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-500/10" },
                               { label: "Risk Delta", val: projectData.delayed, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-500/10" },
                             ].map((stat, i) => (
                               <div key={i} className={`p-5 rounded-3xl ${stat.bg} border-2 border-white/50 flex flex-col items-center justify-center text-center group transition-all hover:scale-[1.02]`}>
                                  <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
                                  <p className="text-2xl font-black tracking-tighter leading-none">{stat.val}</p>
                                  <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1.5 tracking-widest">{stat.label}</p>
                                </div>
                             ))}
                          </div>

                          <div className="space-y-6">
                             <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                   <Zap className="h-4 w-4 text-rose-500" /> Risks, Blockers & Impediments
                                </label>
                                <Textarea 
                                  placeholder="Document any strategic or technical slippage risk..." 
                                  className="rounded-[2rem] border-none bg-secondary/30 min-h-[120px] p-6 font-bold shadow-inner placeholder:italic"
                                  value={risks}
                                  onChange={(e) => setRisks(e.target.value)}
                                />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                   <MessageSquare className="h-4 w-4 text-indigo-500" /> Executive Summary & Managerial Notes
                                </label>
                                <Textarea 
                                  placeholder="Provide descriptive assessment of current implementation velocity..." 
                                  className="rounded-[2rem] border-none bg-secondary/30 min-h-[150px] p-6 font-medium shadow-inner"
                                  value={managerNote}
                                  onChange={(e) => setManagerNote(e.target.value)}
                                />
                             </div>
                          </div>

                          <div className="pt-4 flex flex-col sm:flex-row gap-4">
                             <Button 
                               className="flex-1 h-16 rounded-[1.2rem] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 font-black text-xs uppercase tracking-[0.2em] gap-3 border-none transition-all active:scale-95"
                               onClick={handleSubmitReport}
                             >
                                <Send className="h-5 w-5" /> Submit to Admin
                             </Button>
                             <Button 
                               variant="outline" 
                               className="h-16 px-8 rounded-[1.2rem] border-indigo-500/20 bg-white hover:bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] gap-3 transition-all active:scale-95 border-2 group"
                               onClick={() => toast.info("Exporting Assessment Data...")}
                             >
                                <Download className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" /> Export Summary
                             </Button>
                          </div>
                       </motion.div>
                    ) : (
                       <div className="py-20 text-center space-y-6 opacity-40">
                          <div className="h-24 w-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto border-4 border-dashed border-muted-foreground/20">
                             <FileBarChart className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div>
                             <p className="text-lg font-black italic">Awaiting Project Selection</p>
                             <p className="text-xs font-bold uppercase tracking-widest mt-1">Select a project stream above to begin compiling intelligence.</p>
                          </div>
                       </div>
                    )}
                 </AnimatePresence>
              </CardContent>
           </Card>
        </div>

        {/* Audit History & Guidelines Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
              <CardHeader className="p-6 border-b border-secondary/20 flex flex-row items-center justify-between">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4 text-indigo-500" /> Recent Submissions
                 </CardTitle>
                 <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-secondary/20">
                    {[
                      { project: "Infrastructure Prep", date: "Apr 12, 11:45 AM", state: "Verified" },
                      { project: "Beta Testing Stream", date: "Apr 08, 09:30 AM", state: "Awaiting Review" },
                      { project: "Cloud Migration", date: "Apr 04, 04:15 PM", state: "Verified" },
                    ].map((h, i) => (
                      <div key={i} className="p-5 hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                         <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-sm italic group-hover:text-indigo-600 transition-colors">{h.project}</p>
                            <Badge className={`${h.state === 'Verified' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} border-none text-[7px] font-black uppercase h-4 px-1 leading-none shadow-none`}>
                               {h.state}
                            </Badge>
                         </div>
                         <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-1.5"><TimerOff className="h-3 w-3" /> Submitted {h.date}</p>
                      </div>
                    ))}
                 </div>
                 <Button variant="ghost" className="w-full h-12 rounded-none text-[10px] font-black uppercase tracking-widest bg-secondary/10 group gap-2">
                    Open Intelligence Vault <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-none shadow-md bg-indigo-600 text-white rounded-[2rem] overflow-hidden p-8 relative group">
              <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                 <ShieldCheck size={180} />
              </div>
              <div className="relative space-y-6">
                 <div className="h-12 w-12 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                 </div>
                 <h4 className="text-xl font-bold tracking-tight italic">Effective Status Reporting</h4>
                 <div className="space-y-4">
                    <p className="text-xs leading-relaxed text-indigo-100/80 font-medium">
                       Professional status reports should quantify velocity deltas. Ensure "Risk Delta" is substantiated with clear technical blockers to facilitate Administrative intervention.
                    </p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> <span className="text-[10px] font-bold tracking-wider">Quantify Throughput</span></div>
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> <span className="text-[10px] font-bold tracking-wider">Identify Clear Blockers</span></div>
                       <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> <span className="text-[10px] font-bold tracking-wider">Predictive Timelines</span></div>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full h-11 border-white/20 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-xl border-dashed">
                    Audit Handbook
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

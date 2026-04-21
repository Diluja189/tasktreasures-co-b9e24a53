import { useState, useEffect, useMemo } from "react";
import { 
  ShieldAlert, Activity, ChevronRight, ListTodo, RefreshCw, 
  Rocket, CheckCircle2, TrendingUp, Layers, Target, 
  Briefcase, Layout, Clock, Zap, Search, PenLine, Timer,
  ArrowUpRight, Network, X, ArrowRightLeft, MessageSquare,
  AlertTriangle, ShieldCheck, Send, ClipboardCheck, Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

const STORAGE_KEYS = {
  TASKS: "app_member_tasks_store",
  UPDATES: "app_member_updates_store",
  CERTIFIED_ROLE: "app_certified_member_role"
};

type MemberRole = "Designer" | "Frontend Developer" | "Backend Developer" | "Tester" | "Bug Fixer";

export default function MemberTasksPage() {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [certifiedRole] = useState<MemberRole>(() => {
     return (localStorage.getItem(STORAGE_KEYS.CERTIFIED_ROLE) as MemberRole) || (currentUser.name.includes("Backend") ? "Backend Developer" : "Designer");
  });

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isHandoverMode, setIsHandoverMode] = useState(false);
  const [tacticalData, setTacticalData] = useState({
    completed: "",
    pending: "",
    nextStep: "",
    blockers: "",
    managerNotes: "",
    memberNotes: "",
    progress: 0
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    setTasks(saved);
  }, []);

  const myTasks = useMemo(() => tasks.filter(t => t.assignedRole === certifiedRole), [tasks, certifiedRole]);

  const efficiencyMetrics = useMemo(() => {
    const completed = myTasks.filter(t => t.progress === 100).length;
    const rate = myTasks.length ? Math.round((completed / myTasks.length) * 100) : 0;
    const onTimeRate = 94; // Simulation
    return { rate, onTimeRate, overall: 91 };
  }, [myTasks]);

  const getNextRole = (role: MemberRole): string => {
    const chain: MemberRole[] = ["Designer", "Frontend Developer", "Backend Developer", "Tester", "Bug Fixer"];
    const idx = chain.indexOf(role);
    return chain[(idx + 1) % chain.length];
  };

  const getPreviousRole = (role: MemberRole): string => {
    const chain: MemberRole[] = ["Designer", "Frontend Developer", "Backend Developer", "Tester", "Bug Fixer"];
    const idx = chain.indexOf(role);
    return idx === 0 ? "Project Start" : chain[idx - 1];
  };

  const nextRole = getNextRole(certifiedRole);
  const previousRole = getPreviousRole(certifiedRole);

  const handleOpenUpdate = (task: any, handover: boolean = false) => {
    setSelectedTask(task);
    setIsHandoverMode(handover);
    setTacticalData({
      completed: "", pending: "", nextStep: "", blockers: "",
      managerNotes: "", memberNotes: "", progress: task.progress
    });
    setIsUpdateModalOpen(true);
  };

  const handleBroadcastSync = () => {
    if (!selectedTask) return;
    const allUpdates = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPDATES) || "[]");
    const newUpdate = {
      ...tacticalData,
      id: Math.random().toString(36).substr(2, 9),
      taskId: selectedTask.id,
      taskName: selectedTask.name,
      timestamp: Date.now(),
      type: isHandoverMode ? "Handover" : "Technical Sync"
    };
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify([newUpdate, ...allUpdates]));
    
    const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, progress: tacticalData.progress } : t);
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    
    setIsUpdateModalOpen(false);
    toast.success(isHandoverMode ? "Phase Handover Synchronized" : "Technical Broadcast Dispatched");
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 pb-8 px-4 pt-4 md:px-6">
      {/* HUD: Operational Chain */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-950 p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-5 opacity-[0.03] pointer-events-none text-indigo-600"><Network size={120} /></div>
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
           <div className="h-9 w-9 bg-indigo-600 rounded-lg shadow-xl flex items-center justify-center text-white shrink-0"><Network size={18} /></div>
           <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Standard User</p>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                 <Badge className="bg-rose-500 text-white border-none font-black text-[9px] px-2 py-0.5 uppercase tracking-tight flex items-center gap-1 shrink-0"><Lock size={8} /> Certified</Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                 <h1 className="text-xl font-black tracking-tight text-foreground uppercase leading-none truncate">MY TASKS</h1>
                 <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase tracking-tight px-2.5 py-0.5 rounded-full whitespace-nowrap">{certifiedRole}</Badge>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-300 shrink-0" />
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">Session: <span className="text-primary font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
              </div>
           </div>
        </div>
        
        {/* Workflow Chain Visualizer */}
        <div className="flex items-center gap-0.5 p-0.5 bg-slate-950 dark:bg-slate-900 rounded-lg border border-slate-800 shadow-sm z-10 overflow-x-auto no-scrollbar max-w-full">
           <div className="px-2.5 py-0.5 border-r border-slate-800/50 text-center shrink-0"><p className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.15em] leading-none">Source</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none">{previousRole}</p></div>
           <div className="px-3.5 py-0.5 bg-indigo-600 text-white rounded-md flex items-center gap-2 shrink-0"><div className="space-y-0"><p className="text-[9px] font-bold uppercase text-indigo-200 tracking-[0.15em] leading-none">Active</p><p className="text-[9px] font-black uppercase tracking-tight leading-none">{certifiedRole}</p></div><Activity size={8} className="animate-pulse" /></div>
           <div className="px-2.5 py-0.5 text-center flex items-center gap-2 shrink-0"><ChevronRight size={10} className="text-slate-600" /><div className="space-y-0"><p className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.15em] leading-none">Next</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none">{nextRole}</p></div></div>
        </div>
      </div>

      {/* KPI HERO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
         <Card className="md:col-span-3 border-none shadow-sm bg-indigo-600 text-white rounded-xl overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-2xl leading-none">EFF</div>
            <CardContent className="p-5 space-y-1 relative z-10">
               <p className="text-indigo-200 text-[9px] font-bold uppercase tracking-[0.15em]">Score</p>
               <h3 className="text-3xl font-black tracking-tight leading-none">{efficiencyMetrics.overall}%</h3>
               <div className="pt-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-100"><TrendingUp size={10}/> Stabilized</div>
            </CardContent>
         </Card>
         <Card className="md:col-span-9 border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100">
            <CardHeader className="p-4 pb-2 border-b border-slate-50 dark:border-slate-800/50 flex flex-row items-center justify-between">
               <div className="space-y-0.5"><CardTitle className="text-base font-black uppercase tracking-tight leading-none">Yield Overview</CardTitle><CardDescription className="text-[9px] uppercase font-bold tracking-[0.15em] text-slate-400 leading-none">{certifiedRole}</CardDescription></div>
               <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-none font-black text-[9px] px-2.5 py-0.5 rounded-lg tracking-tight">{efficiencyMetrics.onTimeRate}%</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-3">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Assigned", val: myTasks.length, icon: ListTodo, color: "bg-indigo-600" },
                    { label: "Working", val: myTasks.filter(t => t.progress < 100).length, icon: RefreshCw, color: "bg-amber-500" },
                    { label: "Ready", val: myTasks.filter(t => t.progress === 100).length, icon: Rocket, color: "bg-emerald-600" },
                    { label: "Score", val: efficiencyMetrics.rate + "%", icon: CheckCircle2, color: "bg-rose-500" },
                  ].map((k, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5"><div className={`h-4 w-4 rounded-md ${k.color} flex items-center justify-center text-white shadow-sm`}><k.icon size={8} /></div><p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.15em] leading-none">{k.label}</p></div>
                       <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">{k.val}</h4>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Main Task List */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-indigo-600 border border-slate-100">
            <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                   <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm"><ListTodo size={14}/></div>
                      <div>
                         <CardTitle className="text-xs font-black uppercase tracking-tight leading-none">TASK EXECUTION QUEUE</CardTitle>
                         <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">{myTasks.length} allocated nodes</p>
                      </div>
                   </div>
                   <Badge className="bg-indigo-600 text-white border-none px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-tight">ACTIVE</Badge>
                </div>
            </CardHeader>
         <CardContent className="p-3 md:p-4 space-y-4">
            {myTasks.length > 0 ? myTasks.map(task => (
              <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-4 md:p-5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm group flex flex-col gap-4"
              >
                 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                       <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform"><Target size={18} className="text-slate-900 dark:text-white" /></div>
                       <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                             <h4 className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none italic truncate max-w-[240px] md:max-w-md">{task.name}</h4>
                             <Badge className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-indigo-600 font-black text-[6px] px-1.5 py-0.5 uppercase rounded-md tracking-wider shrink-0">
                                 Risk: {task.deadlineRisk}
                             </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                             <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full italic whitespace-nowrap"><Briefcase size={10} /> {task.workType}</span>
                             <span className="flex items-center gap-1 whitespace-nowrap"><Layout size={10} /> {task.project}</span>
                             <span className="flex items-center gap-1 whitespace-nowrap text-indigo-600"><Clock size={10} /> {task.deadline}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 p-2.5 md:p-3 rounded-lg shadow-sm text-center border-t-2 border-indigo-600 shrink-0 self-start lg:ml-auto">
                       <div className="px-3 border-r border-white/5"><p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mb-0.5 italic leading-none">Shift</p><p className="text-base font-black text-indigo-400 leading-none tracking-tighter">{(task.todayHours || 0).toFixed(1)}h</p></div>
                       <div className="px-3"><p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mb-0.5 italic leading-none">Total</p><p className="text-base font-black text-white leading-none tracking-tighter">{(task.totalWorked || 0).toFixed(1)}h</p></div>
                    </div>
                 </div>
                 
                 <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full" />
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1.5 w-full md:w-[220px]">
                       <div className="flex justify-between items-end">
                          <div className="space-y-0.5"><p className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic leading-none"><Zap size={8} className="text-amber-500" /> Status</p><p className={`font-black uppercase text-[9px] tracking-widest leading-none ${task.progress === 100 ? 'text-emerald-500' : 'text-indigo-400'}`}>{task.readiness}</p></div>
                          <p className="text-xl font-black text-indigo-600 italic tracking-tighter leading-none">{task.progress}%</p>
                       </div>
                       <Progress value={task.progress} className="h-1 w-full [&>div]:bg-indigo-600" />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-1.5 w-full md:w-auto">
                       <Button variant="outline" className="h-8 px-3 rounded-md font-black uppercase tracking-widest text-[8px] border-slate-100" onClick={() => navigate("/member/updates")}><PenLine size={12} /> Sync</Button>
                       <Button variant="outline" className="h-8 px-3 rounded-md font-black uppercase tracking-widest text-[8px] border-slate-100" onClick={() => navigate("/member/time")}><Timer size={12} /> Log</Button>
                       <Button onClick={() => handleOpenUpdate(task, true)} disabled={task.progress < 100} className="h-8 px-4 rounded-md bg-indigo-600 text-white font-black uppercase tracking-widest text-[8px] shadow-sm italic transition-all hover:bg-black">
                          Release
                       </Button>
                    </div>
                 </div>
              </motion.div>
            )) : <div className="py-20 flex flex-col items-center justify-center opacity-10 italic font-black uppercase tracking-[8px] text-slate-400"><Search size={40} className="mb-4"/><p>Queue records null</p></div>}
         </CardContent>
      </Card>

      {/* Advanced Sync Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-900 max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800">
               <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-6">
                     <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md"><Rocket size={20} /></div>
                     <div className="space-y-0.5">
                        <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">{isHandoverMode ? "Phase Handover" : "Tactical Broadcast"}</h2>
                        <p className="text-indigo-100/60 font-black text-[9px] uppercase tracking-[3px] italic">{selectedTask.name}</p>
                     </div>
                  </div>
                  <button onClick={() => setIsUpdateModalOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all border border-white/10 shrink-0"><X size={18} /></button>
               </div>
               
               <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
                  {isHandoverMode && (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 py-5 px-6 bg-emerald-50 dark:bg-emerald-950/20 border border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl group">
                       <div className="text-center space-y-1.5"><p className="text-[7px] font-black uppercase text-emerald-500 tracking-[3px] leading-none">Active Unit</p><Badge className="bg-white dark:bg-slate-900 text-emerald-600 border-none px-4 py-1.5 rounded-lg shadow-sm font-black uppercase text-[10px] italic tracking-widest">{certifiedRole}</Badge></div>
                       <div className="flex flex-col items-center gap-2"><ArrowRightLeft size={16} className="text-emerald-400 rotate-90 md:rotate-0" /></div>
                       <div className="text-center space-y-1.5"><p className="text-[7px] font-black uppercase text-emerald-500 tracking-[3px] leading-none">Transmission Node</p><Badge className="bg-emerald-600 text-white border-none px-4 py-1.5 rounded-lg shadow-sm font-black uppercase text-[10px] italic tracking-widest">{nextRole}</Badge></div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[
                        { id: "completed", val: tacticalData.completed, set: (v:string) => setTacticalData(p=>({...p,completed:v})), label: "Finalizations", icon: ClipboardCheck, color: "text-indigo-600", req: true },
                        { id: "pending", val: tacticalData.pending, set: (v:string) => setTacticalData(p=>({...p,pending:v})), label: "Residuals", icon: Clock, color: "text-amber-500", req: false },
                        { id: "next", val: tacticalData.nextStep, set: (v:string) => setTacticalData(p=>({...p,nextStep:v})), label: "Successor Objective", icon: Zap, color: "text-indigo-600", req: true },
                        { id: "blockers", val: tacticalData.blockers, set: (v:string) => setTacticalData(p=>({...p,blockers:v})), label: "Obstructions", icon: AlertTriangle, color: "text-rose-600", req: false },
                        { id: "mgr", val: tacticalData.managerNotes, set: (v:string) => setTacticalData(p=>({...p,managerNotes:v})), label: "HQ Notes", icon: ShieldCheck, color: "text-slate-400", req: false },
                        { id: "member", val: tacticalData.memberNotes, set: (v:string) => setTacticalData(p=>({...p,memberNotes:v})), label: "Unit Briefing", icon: MessageSquare, color: "text-slate-400", req: false },
                     ].map((f, i) => (
                        <div key={i} className="space-y-2">
                           <Label className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${f.color}`}><f.icon size={12} /> {f.label} {f.req && <span className="opacity-40 text-[6px] font-bold leading-none tracking-tighter">(REQD)</span>}</Label>
                           <Textarea value={f.val} onChange={e => f.set(e.target.value)} placeholder={`Log hub...`} className="border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl min-h-[100px] text-[10px] font-bold p-4 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner custom-scrollbar" />
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                     <div className="flex-1 space-y-4"><div className="flex justify-between items-end"><p className="text-[9px] font-black uppercase text-slate-400 tracking-[3px] italic leading-none">Sync Capacity</p><p className="text-2xl font-black text-indigo-600 italic tracking-tighter leading-none">{tacticalData.progress}%</p></div><Slider value={[tacticalData.progress]} onValueChange={([v]) => setTacticalData(p=>({...p,progress:v}))} max={100} step={5} className="[&>span]:bg-indigo-600" /></div>
                     <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto"><Button variant="outline" onClick={() => setIsUpdateModalOpen(false)} className="h-10 px-8 rounded-lg font-black uppercase tracking-widest border-slate-100 text-slate-400 hover:bg-slate-50 transition-all w-full md:w-auto text-[10px]">Abort Sync</Button><Button onClick={handleBroadcastSync} className="h-10 px-10 rounded-lg bg-indigo-600 hover:bg-black text-white font-black uppercase tracking-widest shadow-lg gap-4 transition-all active:scale-95 group w-full md:w-auto text-[10px]"><Send size={16} /> Confirm Release</Button></div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

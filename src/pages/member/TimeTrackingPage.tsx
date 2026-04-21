import { useState, useEffect, useMemo } from "react";
import { 
  Clock, Play, Square, Pause, Save, History, 
  ChevronRight, ArrowRight, CheckCircle2, 
  Activity, Timer, AlertCircle, ShieldCheck, 
  Briefcase, Target, ListTodo, RefreshCw, Rocket,
  Search, ListFilter, ClipboardList, Layers, Network,
  Clock3, Send, Filter, PenLine, X, ClipboardCheck, ArrowRightLeft,
  Pencil, Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";

// --- Types & Constants ---
type MemberRole = "Designer" | "Frontend Developer" | "Backend Developer" | "Tester" | "Bug Fixer";

const STORAGE_KEYS = {
  TASKS: "app_member_tasks_store",
  LOGS: "app_member_logs_store",
  CERTIFIED_ROLE: "app_certified_member_role"
};

export default function TimeTrackingPage() {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [certifiedRole] = useState<MemberRole>(() => {
     return (localStorage.getItem(STORAGE_KEYS.CERTIFIED_ROLE) as MemberRole) || (currentUser.name.includes("Backend") ? "Backend Developer" : "Designer");
  });

  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isManualLogOpen, setIsManualLogOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "today" | "week">("all");

  // Manual Log Fields
  const [manualTask, setManualTask] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState("09:00");
  const [manualEndTime, setManualEndTime] = useState("10:00");
  const [manualWorkType, setManualWorkType] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    setTasks(savedTasks);
    const savedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || "[]");
    setLogs(savedLogs);
    
    const running = localStorage.getItem("app_active_timer_state");
    if (running) {
      const state = JSON.parse(running);
      setActiveTask(state.task);
      setTimer(Math.floor((Date.now() - state.startTime) / 1000));
      setIsTimerRunning(true);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const myTasks = useMemo(() => tasks.filter(t => t.assignedRole === certifiedRole), [tasks, certifiedRole]);

  const efficiencyMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.date === todayStr);
    const todayHours = todayLogs.reduce((acc, l) => acc + (l.hours || 0), 0);
    const completed = myTasks.filter(t => t.progress === 100).length;
    const overall = myTasks.length ? Math.round((completed / myTasks.length) * 100) : 0;
    return { todayHours, overall };
  }, [logs, myTasks]);

  const filteredLogs = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (filterMode === "today") return logs.filter(l => l.date === todayStr);
    if (filterMode === "week") return logs.filter(l => l.date >= weekAgo);
    return logs;
  }, [logs, filterMode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = (task: any) => {
    const state = { task, startTime: Date.now() - (timer * 1000) };
    localStorage.setItem("app_active_timer_state", JSON.stringify(state));
    setActiveTask(task);
    setIsTimerRunning(true);
    toast.success(`Broadcasting session for: ${task.name}`);
  };

  const handleStopTimer = () => {
    if (!activeTask) return;
    const hours = parseFloat((timer / 3600).toFixed(2));
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: activeTask.id,
      taskName: activeTask.name,
      projectName: activeTask.project,
      workType: activeTask.workType || "Tactical Execution",
      date: new Date().toISOString().split('T')[0],
      startTime: new Date(Date.now() - (timer * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hours,
      notes: "Real-time session broadcast recorded.",
      timestamp: Date.now()
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
    localStorage.removeItem("app_active_timer_state");
    setActiveTask(null);
    setTimer(0);
    setIsTimerRunning(false);
    toast.success("Tactical yield committed to registry.");
  };

  const handleManualSubmit = () => {
    if (!manualTask || !manualWorkType) {
      toast.error("Constraint Violation: Allocated Node and Work Type are mandatory.");
      return;
    }
    const start = new Date(`2000-01-01T${manualStartTime}`);
    const end = new Date(`2000-01-01T${manualEndTime}`);
    const hours = Math.max(0.1, parseFloat(((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2)));

    const selected = myTasks.find(t => t.id === manualTask);
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: manualTask,
      taskName: selected.name,
      projectName: selected.project,
      workType: manualWorkType,
      date: manualDate,
      startTime: manualStartTime,
      endTime: manualEndTime,
      hours,
      notes: manualNotes,
      timestamp: Date.now()
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
    toast.success("Manual session profile transmitted.");
    handleManualReset();
  };

  const handleManualReset = () => {
    setManualTask(""); setManualWorkType(""); setManualNotes("");
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 pb-8 px-4 pt-4 md:px-6">
      {/* HUD HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-950 p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-5 opacity-[0.03] pointer-events-none text-amber-500"><Network size={120}/></div>
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
           <div className="h-9 w-9 bg-amber-500 rounded-lg shadow-xl flex items-center justify-center text-white shrink-0"><Clock size={20} /></div>
           <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Standard User</p>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                 <Badge className="bg-rose-500 text-white border-none font-black text-[9px] px-2 py-0.5 uppercase tracking-tight flex items-center gap-1 shrink-0"><Lock size={8} /> Certified</Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                 <h1 className="text-xl font-black tracking-tight text-foreground uppercase leading-none truncate">UTILIZATION HUB</h1>
                 <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase tracking-tight px-2.5 py-0.5 rounded-full whitespace-nowrap">{certifiedRole}</Badge>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-300 shrink-0" />
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">Session: <span className="text-primary font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-1 p-0.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 shrink-0 z-10">
           <div className="px-3 py-0.5 border-r border-slate-200 text-center"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none mb-0.5">Today</p><p className="text-base font-black text-foreground tracking-tight leading-none">{efficiencyMetrics.todayHours.toFixed(1)}h</p></div>
           <div className="px-2.5 text-center"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none mb-0.5">Yield</p><p className="text-base font-black text-primary tracking-tight leading-none">{efficiencyMetrics.overall}%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-12 space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* REAL-TIME ENGINE */}
            <Card className="border-none shadow-sm bg-slate-950 text-white rounded-xl overflow-hidden border-t-2 border-amber-500 flex flex-col border border-border/40">
               <CardHeader className="p-4 md:p-5 pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                     <CardTitle className="text-xs font-black uppercase tracking-tight leading-none">REAL-TIME ENGINE</CardTitle>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Session Broadcast</p>
                  </div>
                  <div className="h-7 w-7 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 shrink-0"><Activity size={14} className={activeTask ? "animate-pulse" : ""}/></div>
               </CardHeader>
               <CardContent className="p-5 md:p-6 flex-1 flex flex-col items-center justify-center space-y-6">
                   {!activeTask ? (
                    <div className="text-center space-y-4 w-full">
                       <div className="py-6 bg-white/5 rounded-xl border border-white/5 border-dashed flex flex-col items-center gap-3">
                          <AlertCircle size={24} className="text-slate-700" />
                          <p className="text-[8px] font-black uppercase tracking-[3px] text-slate-500 italic">No Active Signal</p>
                       </div>
                       <Button onClick={() => setIsManualLogOpen(!isManualLogOpen)} className="h-10 px-5 rounded-lg bg-amber-500 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[9px] shadow-lg transition-all gap-2 w-full italic">Open Registry Hub <ArrowRight size={14}/></Button>
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                       <div className="text-center space-y-2">
                          <Badge className="bg-amber-500 text-white border-none font-black text-[9px] px-3 py-0.5 uppercase tracking-tight rounded-full animate-pulse">BROADCASTING ACTIVE</Badge>
                          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">{activeTask.taskName}</h2>
                          <div className="flex justify-center items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">{activeTask.projectName} <span className="h-0.5 w-0.5 rounded-full bg-slate-700"/> {activeTask.workType}</div>
                       </div>
                       
                       <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-[4px] mb-3 italic relative z-10 leading-none">Elapsed Time</p>
                          <p className="text-5xl md:text-6xl font-black tracking-tighter tabular-nums leading-none relative z-10 italic">{formatTime(timer)}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={handleStopTimer} className="h-10 rounded-lg border-white/10 bg-white/5 hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[8px] gap-2 transition-all italic"><X size={14}/> Abort</Button>
                          <Button onClick={handleStopTimer} className="h-10 rounded-lg bg-emerald-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[8px] gap-2 shadow-xl transition-all italic"><ClipboardCheck size={14}/> Commit</Button>
                       </div>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* MANUAL SESSION LOG */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-indigo-600 border border-slate-100">
               <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-50 dark:border-slate-800/50 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                     <CardTitle className="text-xs font-black uppercase tracking-tight leading-none">SESSION LOG</CardTitle>
                     <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Matrix Entry</CardDescription>
                  </div>
                  <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 shrink-0"><PenLine size={14}/></div>
               </CardHeader>
               <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Node</Label>
                        <Select value={manualTask} onValueChange={setManualTask}>
                           <SelectTrigger className="h-9 rounded-md border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 font-bold text-[9px] uppercase">
                              <SelectValue placeholder="Select nodule..." />
                           </SelectTrigger>
                           <SelectContent className="rounded-lg border-slate-100"><div className="p-1.5 space-y-0.5">{myTasks.map(t => (<SelectItem key={t.id} value={t.id} className="rounded-md font-bold py-1.5 uppercase text-[9px] leading-tight">{t.name}</SelectItem>))}</div></SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Work Type</Label>
                        <Select value={manualWorkType} onValueChange={setManualWorkType}>
                           <SelectTrigger className="h-9 rounded-md border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 font-bold text-[9px] uppercase">
                              <SelectValue placeholder="Define load..." />
                           </SelectTrigger>
                           <SelectContent className="rounded-lg border-slate-100"><div className="p-1.5 space-y-0.5">{myTasks.find(t=>t.id===manualTask)?.workType ? [myTasks.find(t=>t.id===manualTask).workType].map(w => (<SelectItem key={w} value={w} className="rounded-md font-bold py-1.5 uppercase text-[9px]">{w}</SelectItem>)) : <SelectItem value="General" disabled className="rounded-md font-bold py-1.5 text-slate-300">AWAITING NODE</SelectItem>}</div></SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-1"><Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Date</Label><Input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="h-9 rounded-md border-slate-100 bg-slate-50/50 font-bold text-[9px] uppercase"/></div>
                     <div className="space-y-1"><Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Start</Label><Input type="time" value={manualStartTime} onChange={e => setManualStartTime(e.target.value)} className="h-9 rounded-md border-slate-100 bg-slate-50/50 font-bold text-[9px] uppercase"/></div>
                     <div className="space-y-1"><Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">End</Label><Input type="time" value={manualEndTime} onChange={e => setManualEndTime(e.target.value)} className="h-9 rounded-md border-slate-100 bg-slate-50/50 font-bold text-[9px] uppercase"/></div>
                  </div>

                  <div className="space-y-1">
                     <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Annotations</Label>
                     <Textarea value={manualNotes} onChange={e => setManualNotes(e.target.value)} placeholder="Technical metadata..." className="min-h-[60px] rounded-lg border-slate-100 bg-slate-50/50 p-3 font-bold text-[9px] transition-all focus:bg-white custom-scrollbar-thin" />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                     <Button variant="outline" onClick={handleManualReset} className="h-9 px-4 rounded-md border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[8px] hover:bg-slate-50 flex-1 italic">Reset</Button>
                     <Button onClick={handleManualSubmit} className="h-9 px-6 rounded-md bg-indigo-600 hover:bg-black text-white font-black uppercase tracking-widest text-[8px] shadow-lg flex-[2] gap-2 transition-all italic">Transmit Log <Send size={12}/></Button>
                  </div>
               </CardContent>
            </Card>
          </div>

           {/* HISTORICAL REGISTRY */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-slate-900 border border-slate-100">
             <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-0.5">
                   <CardTitle className="text-xs font-black uppercase tracking-tight leading-none">HISTORICAL REGISTRY</CardTitle>
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Unit Session Archives</CardDescription>
                </div>
                 <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-100 shrink-0">
                    {(["all", "today", "week"] as const).map(mode => (
                      <button key={mode} onClick={() => setFilterMode(mode)}
                        className={`h-7 px-2.5 rounded-md text-[9px] font-black uppercase tracking-tight transition-all ${
                          filterMode === mode
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}>
                        {mode === "all" ? "All" : mode === "today" ? "Today" : "Week"}
                      </button>
                    ))}
                    <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                    <div className="flex items-center gap-1.5 px-1.5"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Logs</p><p className="text-[11px] font-black text-foreground leading-none">{filteredLogs.length}</p></div>
                 </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-x-auto custom-scrollbar-thin">
                   {filteredLogs.length > 0 ? (
                      <table className="w-full text-left border-collapse min-w-[700px]">
                         <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                               <th className="px-5 py-3 text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em]">Node</th>
                               <th className="px-5 py-3 text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em]">Phase</th>
                               <th className="px-5 py-3 text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em]">Yield</th>
                               <th className="px-5 py-3 text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredLogs.map((log, i) => (
                               <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group">
                                  <td className="px-5 py-3">
                                     <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-white dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center text-foreground shadow-sm shrink-0 group-hover:scale-105 transition-transform"><Target size={14}/></div>
                                        <div className="min-w-0"><h6 className="font-black text-[10px] uppercase text-foreground leading-tight truncate">{log.taskName}</h6><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] truncate">{log.projectName}</p></div>
                                     </div>
                                  </td>
                                  <td className="px-5 py-3">
                                     <div className="space-y-0.5"><p className="text-[9px] font-black text-foreground uppercase leading-none">{log.date}</p><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">{log.startTime} — {log.endTime}</p></div>
                                  </td>
                                  <td className="px-5 py-3"><span className="text-base font-black text-primary tracking-tight leading-none">{(log.hours || 0).toFixed(1)}h</span></td>
                                  <td className="px-5 py-3 text-right"><Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-2 py-0.5 rounded-md tracking-tight uppercase">TRANSMITTED</Badge></td>
                               </tr>
                            ))}
                        </tbody>
                     </table>
                    ) : (
                      <div className="py-16 flex flex-col items-center justify-center opacity-20 font-bold uppercase tracking-[0.15em] text-muted-foreground"><Search size={36} className="mb-3"/><p className="text-[9px]">{filterMode === "all" ? "No logs yet" : `No ${filterMode} logs`}</p></div>
                    )}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

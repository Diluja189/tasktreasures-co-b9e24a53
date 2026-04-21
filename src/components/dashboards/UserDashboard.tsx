import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Clock, AlertTriangle, Play,
  ListTodo, Timer, RefreshCw, ChevronRight,
  Calendar, Target, ArrowUpRight, PenLine,
  Filter, MoreHorizontal, Layout,
  Activity, Hourglass, User, Gauge, ArrowRightLeft,
  Share2, Save, X, Info, ShieldCheck, ClipboardCheck,
  Zap, MessageSquare, Bell, Send,
  History, Eye, CheckCircle, BarChart3, TrendingUp,
  Cpu, Rocket, Milestone, Layers, Plus, Pencil,
  Lock, Unlock, Terminal, HardDrive, ShieldAlert,
  ArrowRight, GitCommit, Workflow, Network,
  UserCheck, ShieldQuestion, Radio, Trello,
  Crosshair, LineChart, PieChart as PieChartIcon,
  TimerReset, Briefcase, ListFilter, ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// --- Types & Constants ---
type MemberRole = "Designer" | "Frontend Developer" | "Backend Developer" | "Tester" | "Bug Fixer";

const ROLE_SEQUENCE: MemberRole[] = ["Designer", "Frontend Developer", "Backend Developer", "Tester", "Bug Fixer"];

const STORAGE_KEYS = {
  TASKS: "app_member_tasks_store",
  LOGS: "app_member_logs_store",
  CERTIFIED_ROLE: "app_certified_member_role"
};

const ROLE_COLORS: Record<MemberRole, string> = {
  "Designer": "bg-pink-500 text-white shadow-pink-200",
  "Frontend Developer": "bg-indigo-500 text-white shadow-indigo-200",
  "Backend Developer": "bg-violet-500 text-white shadow-violet-200",
  "Tester": "bg-emerald-500 text-white shadow-emerald-200",
  "Bug Fixer": "bg-rose-500 text-white shadow-rose-200"
};

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center p-14 text-center space-y-6">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100"><Layout className="w-10 h-10 text-slate-200" /></div>
    <div className="space-y-2"><h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">{title}</h3><p className="text-[11px] font-bold text-slate-400 uppercase tracking-[3px] max-w-xs">{description}</p></div>
  </div>
);

export function MemberDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useRole();
  const [certifiedRole] = useState<MemberRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTIFIED_ROLE) as MemberRole;
    if (saved) return saved;
    return currentUser.name.includes("Backend") ? "Backend Developer" : "Designer";
  });

  const [tasks, setTasks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("queue");
  
  const roleIndex = ROLE_SEQUENCE.indexOf(certifiedRole);
  const previousRole = roleIndex > 0 ? ROLE_SEQUENCE[roleIndex - 1] : "Project Start";
  const nextRole = roleIndex < ROLE_SEQUENCE.length - 1 ? ROLE_SEQUENCE[roleIndex + 1] : "Final Delivery";
  
  const [handoverTask, setHandoverTask] = useState<any | null>(null);
  const [handoverData, setHandoverData] = useState({ completed: "", pending: "", nextStep: "", managerNotes: "", memberNotes: "", blockers: "" });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    setTasks(savedTasks);
    const savedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || "[]");
    setLogs(savedLogs);
  }, []);

  const myTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.assignedRole === certifiedRole || (t.history?.some((h:any) => h.from === certifiedRole && t.status === "Handed Over"))).map(t => {
       const taskLogs = logs.filter(l => l.taskId === t.id);
       const todayLogs = taskLogs.filter(l => l.date === todayStr);
       const totalWorked = taskLogs.reduce((acc, l) => acc + (l.hours || 0), 0);
       const todayHours = todayLogs.reduce((acc, l) => acc + (l.hours || 0), 0);
       const taskEff = totalWorked > 0 ? Math.min(100, Math.round((t.progress / (totalWorked * 5)) * 100)) : 0;
       const readiness = t.progress === 100 ? "Ready for Release" : t.progress > 80 ? "Staging Protocol" : "In Execution";
       const lastHO = t.history?.filter((h:any) => h.from === certifiedRole).slice(-1)[0];
       return { ...t, totalWorked, todayHours, taskEfficiency: taskEff, lastHandover: lastHO, readiness, workType: t.workType || "Module Dev" };
    });
  }, [tasks, logs, certifiedRole]);

  // CALCULATION: TODAY WORK LOG (USER REQUEST 9)
  const todayWorkLog = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return logs
      .filter(l => l.date === todayStr)
      .sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [logs]);

  // CALCULATION: ACTIVITY TIMELINE (USER REQUEST 10)
  const activityTimeline = useMemo(() => {
    // Combine logs and history for a true chronological timeline
    const timelineEvents: any[] = [];
    
    // Add time logs
    logs.forEach(l => {
      if (l.date === new Date().toISOString().split('T')[0]) {
        timelineEvents.push({
          time: l.startTime || new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: `Logged ${(l.hours || 0).toFixed(1)}h on ${l.taskName}`,
          icon: Clock,
          color: "text-indigo-600",
          timestamp: l.timestamp
        });
      }
    });

    // Add task history events
    tasks.forEach(t => {
       t.history?.forEach((h:any) => {
          if (h.at.includes(new Date().toLocaleDateString())) {
            const isHandover = h.action === "System Handover";
            timelineEvents.push({
              time: h.at.split(',')[1]?.trim() || "Event",
              label: isHandover ? `Handover sent to ${h.to}` : h.action,
              icon: isHandover ? Rocket : ShieldCheck,
              color: isHandover ? "text-amber-600" : "text-emerald-600",
              timestamp: new Date(h.at).getTime()
            });
          }
       });
    });

    return timelineEvents.sort((a,b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [logs, tasks]);

  const executionQueue = useMemo(() => myTasks.filter(t => t.assignedRole === certifiedRole && t.progress < 100), [myTasks]);
  const pendingHandover = useMemo(() => myTasks.filter(t => t.assignedRole === certifiedRole && t.progress === 100 && t.status !== "Handed Over"), [myTasks]);
  const awaitingReview = useMemo(() => myTasks.filter(t => t.status === "Handed Over" && t.lastHandover?.from === certifiedRole), [myTasks]);

  const efficiencyEngine = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.date === todayStr && l.fromRole === certifiedRole);
    const todayHours = todayLogs.reduce((acc, l) => acc + (l.hours || 0), 0);
    const completedTasks = myTasks.filter(t => t.progress === 100).length;
    const completionRate = myTasks.length ? Math.round((completedTasks / myTasks.length) * 100) : 0;
    const onTimeTasks = myTasks.filter(t => t.progress === 100 && (t.completedAt || Date.now()) <= new Date(t.deadline || Date.now()).getTime()).length;
    const onTimeRate = completedTasks ? Math.round((onTimeTasks / completedTasks) * 100) : 100;
    const timeUtilization = Math.min(100, Math.round((todayHours / 8) * 100));
    const updateDiscipline = Math.min(100, (todayLogs.length / 3) * 100);
    const overallEfficiency = Math.round((completionRate * 0.3) + (onTimeRate * 0.3) + (timeUtilization * 0.2) + (updateDiscipline * 0.2));
    return { overallEfficiency, completionRate, onTimeRate, timeUtilization, updateDiscipline, todayHours };
  }, [myTasks, logs, certifiedRole]);

  const handleHandover = () => {
    const nextR = getNextRole(certifiedRole);
    if (!nextR) return;
    const timestamp = new Date().toLocaleString();
    const updatedTasks = tasks.map(t => {
      if (t.id === handoverTask.id) {
        return { ...t, assignedRole: nextR, status: "Handed Over", progress: 100, history: [...(t.history || []), { action: "System Handover", from: certifiedRole, to: nextR, context: handoverData, by: currentUser.name, at: timestamp, status: "Pending Acceptance", sharedWithManager: true }] };
      }
      return t;
    });
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    toast.success(`Protocol Released to ${nextR}`);
    setHandoverTask(null);
  };

  const getNextRole = (currentRole: MemberRole): MemberRole | null => {
    const index = ROLE_SEQUENCE.indexOf(currentRole);
    return index < ROLE_SEQUENCE.length - 1 ? ROLE_SEQUENCE[index + 1] : null;
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 pb-12 px-4 pt-6 md:px-6 relative">
      <AnimatePresence>
        {handoverTask && (
          <HandoverDialog task={handoverTask} data={handoverData} onChange={(f,v) => setHandoverData(p=>({...p,[f]:v}))}
            onClose={() => setHandoverTask(null)} onConfirm={handleHandover} currentRole={certifiedRole} nextRole={getNextRole(certifiedRole)!}
          />
        )}
      </AnimatePresence>

      {/* HEADER HUD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-4 md:gap-5 z-10">
           <div className="h-9 w-9 bg-indigo-600 rounded-lg shadow-xl flex items-center justify-center text-white shrink-0"><User size={18} /></div>
           <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Standard User</p>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                 <Badge className="bg-rose-500 text-white border-none font-black text-[9px] px-2 py-0.5 uppercase tracking-tight flex items-center gap-1 shrink-0"><Lock size={8} /> Certified</Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                 <h1 className="text-xl font-black tracking-tight text-foreground uppercase leading-none truncate">{currentUser.name}</h1>
                 <Badge className={`${ROLE_COLORS[certifiedRole]} border-none font-black text-[9px] uppercase tracking-tight px-2.5 py-0.5 rounded-full whitespace-nowrap`}>{certifiedRole}</Badge>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">Session: <span className="text-primary font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
              </div>
           </div>
        </div>
         <div className="z-10 flex items-center gap-0.5 p-0.5 bg-slate-950 dark:bg-slate-900 rounded-lg border border-slate-800 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-2 px-3 border-r border-slate-800/50 shrink-0 py-1"><div className="space-y-0.5"><p className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.15em] leading-none">Source</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none">{previousRole}</p></div><GitCommit size={10} className="text-slate-700" /></div>
            <div className="flex items-center gap-3 px-3 bg-indigo-600/10 rounded-md py-1 border border-indigo-500/20 shrink-0"><div className="space-y-0.5 text-center md:text-left"><p className="text-[9px] font-bold uppercase text-indigo-400 tracking-[0.15em] leading-none">Active</p><p className="text-[9px] font-black text-white uppercase tracking-tight leading-none">{certifiedRole}</p></div><Activity size={10} className="text-indigo-400 animate-pulse" /></div>
            <div className="flex items-center gap-2 px-3 shrink-0 py-1"><ChevronRight size={12} className="text-slate-700" /><div className="space-y-0.5"><p className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.15em] leading-none">Next</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none">{nextRole}</p></div></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
         <div className="lg:col-span-7 space-y-4">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-indigo-600 border border-slate-100">
               <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
                   <div className="space-y-0.5"><CardTitle className="text-xs font-black uppercase tracking-tight">EFFICIENCY ENGINE</CardTitle><CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Tactical Yield</CardDescription></div>
                  <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 shrink-0"><BarChart3 size={14}/></div>
               </CardHeader>
               <CardContent className="p-4">
                   <div className="flex flex-col md:flex-row gap-6 items-center">
                     <div className="flex flex-col items-center justify-center shrink-0">
                        <div className="relative h-28 w-28">
                           <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v: efficiencyEngine.overallEfficiency}, {v: 100 - efficiencyEngine.overallEfficiency}]} cx="50%" cy="50%" innerRadius={38} outerRadius={50} startAngle={90} endAngle={450} paddingAngle={0} dataKey="v" stroke="none"><Cell fill="#6366f1" /><Cell fill="#f1f5f9" /></Pie></PieChart></ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-black text-primary tracking-tight leading-none">{efficiencyEngine.overallEfficiency}%</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">Total</span></div>
                        </div>
                     </div>
                     <div className="flex-1 w-full space-y-3">
                        {[
                           { label: "Precision", val: efficiencyEngine.completionRate, color: "bg-indigo-600", icon: Crosshair },
                           { label: "Velocity", val: efficiencyEngine.onTimeRate, color: "bg-emerald-500", icon: CheckCircle2 },
                           { label: "Utilization", val: efficiencyEngine.timeUtilization, color: "bg-amber-500", icon: Clock },
                        ].map((m, i) => (
                           <div key={i} className="space-y-1.5">
                               <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><div className={`h-4 w-4 rounded-md ${m.color} bg-opacity-10 flex items-center justify-center`}><m.icon size={8} className={m.color.replace('bg-', 'text-')} /></div><span className="text-[9px] font-bold uppercase text-muted-foreground tracking-[0.15em]">{m.label}</span></div><span className="text-[11px] font-black text-foreground tracking-tight">{m.val}%</span></div>
                              <Progress value={m.val} className={`h-1 ${m.color.replace('bg-', '[&>div]:bg-')}`} />
                           </div>
                        ))}
                     </div>
                   </div>
               </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm h-9 flex overflow-x-auto no-scrollbar">
                   <TabsTrigger value="queue" className="rounded-md h-full px-4 font-black uppercase text-[9px] flex-1 whitespace-nowrap">Queue ({executionQueue.length})</TabsTrigger>
                   <TabsTrigger value="worklog" className="rounded-md h-full px-4 font-black uppercase text-[9px] flex-1 whitespace-nowrap">Work Log</TabsTrigger>
                   <TabsTrigger value="history" className="rounded-md h-full px-4 font-black uppercase text-[9px] flex-1 whitespace-nowrap">History</TabsTrigger>
               </TabsList>
               
               <TabsContent value="queue" className="space-y-4 mt-0">
                  {executionQueue.length > 0 ? executionQueue.map(task => (
                    <TaskCard key={task.id} task={task} onAction={() => navigate("/member/tasks")} onHandover={() => setHandoverTask(task)} color="indigo" />
                  )) : <EmptyState title="Queue Decompressed" description="All allocations finalized." />}
               </TabsContent>

               <TabsContent value="worklog" className="space-y-3 mt-0">
                  <Card className="border-none shadow-sm rounded-xl bg-white dark:bg-slate-900 overflow-hidden border border-border/40">
                     <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
                         <div className="flex items-center gap-2.5"><ClipboardList size={16} className="text-indigo-400"/><h3 className="font-black text-sm uppercase tracking-tight">Daily Converge</h3></div>
                         <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] px-2.5 py-0.5 rounded-lg tracking-tight">SUM: {efficiencyEngine.todayHours.toFixed(1)}h</Badge>
                     </div>
                     <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {todayWorkLog.length > 0 ? todayWorkLog.map((log, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                             <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 shrink-0"><Clock size={12}/></div>
                                <div className="min-w-0">
                                    <h5 className="font-black text-[10px] uppercase text-foreground leading-tight truncate">{log.taskName}</h5>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5 truncate">{log.projectName}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right"><p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">{log.startTime} — {log.endTime}</p></div>
                                <div className="text-right min-w-[30px]"><p className="text-base font-black text-indigo-600 tracking-tighter leading-none">{(log.hours || 0).toFixed(1)}h</p></div>
                             </div>
                          </div>
                        )) : <div className="py-8 text-center opacity-20 font-black text-[10px] uppercase tracking-widest italic flex flex-col items-center gap-2"><History size={24}/><p>No records.</p></div>}
                     </div>
                  </Card>
               </TabsContent>

               <TabsContent value="history" className="space-y-3 mt-0">
                  {todayWorkLog.slice(0, 5).map((log, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg"><Send size={14}/></div>
                           <div><h5 className="font-black text-[11px] uppercase tracking-tight text-foreground">{log.taskName}</h5><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">{log.date}</p></div>
                       </div>
                       <Button variant="outline" size="sm" className="h-8 rounded-lg px-4 text-[9px] font-black uppercase tracking-widest border-slate-200 gap-2 shrink-0"><Eye size={12} /> Audit</Button>
                    </Card>
                  ))}
               </TabsContent>
            </Tabs>
         </div>

         <div className="lg:col-span-5 space-y-4">
            <Card className="border-none shadow-sm bg-slate-950 text-white rounded-xl overflow-hidden border-t-2 border-indigo-600">
               <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                   <CardTitle className="text-xs font-black uppercase tracking-tight">UNIT ACTIVITY</CardTitle>
                  <Activity size={14} className="text-indigo-400" />
               </CardHeader>
               <CardContent className="p-4 pt-1">
                  <div className="relative space-y-3 before:absolute before:inset-y-0 before:left-[7px] before:w-[1px] before:bg-white/10">
                     {activityTimeline.length > 0 ? activityTimeline.map((ev, i) => (
                        <div key={i} className="relative pl-6 group/ev">
                           <div className={`absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 group-hover/ev:border-indigo-500 transition-colors`}>
                              <ev.icon size={6} className={ev.color} />
                           </div>
                           <div className="space-y-0 text-left">
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] leading-none mb-0.5">{ev.time}</p>
                               <p className="text-[9px] font-bold text-white/90 leading-tight uppercase">{ev.label}</p>
                           </div>
                        </div>
                      )) : <div className="py-8 text-center opacity-10 font-bold text-[9px] uppercase tracking-[0.15em]">Silent Pulse</div>}
                  </div>
               </CardContent>
            </Card>

             <Card className="border-none shadow-sm bg-amber-500 text-white rounded-xl">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between"><CardTitle className="text-xs font-black uppercase tracking-tight">PENDING RELEASE</CardTitle><Rocket size={14} /></CardHeader>
               <CardContent className="p-4 pt-1 space-y-2">
                  {pendingHandover.length > 0 ? pendingHandover.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-white/10 border border-white/10 space-y-3">
                        <h5 className="font-black text-[10px] uppercase truncate">{t.name}</h5>
                        <Button onClick={() => setHandoverTask(t)} className="w-full h-8 bg-white text-amber-600 hover:bg-black hover:text-white rounded-lg text-[9px] font-black uppercase tracking-tight gap-2 shadow-sm transition-all">Release <ArrowRight size={10}/></Button>
                     </div>
                   )) : <div className="py-6 text-center text-[9px] font-bold text-amber-100 uppercase tracking-[0.15em] opacity-60">Buffer empty</div>}
               </CardContent>
            </Card>

             <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-slate-900 dark:border-slate-800 border border-border/40">
                <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between"><CardTitle className="text-xs font-black uppercase tracking-tight text-foreground">SENT BROADCASTS</CardTitle><Trello size={14} className="text-slate-400" /></CardHeader>
               <CardContent className="p-1.5 space-y-0.5">
                  {todayWorkLog.slice(0, 3).map((u, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-pointer">
                       <div className="h-6 w-6 bg-slate-50 dark:bg-slate-800 rounded-md flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Send size={10}/></div>
                       <div className="min-w-0 pr-1">
                           <p className="text-[9px] font-black uppercase tracking-tight truncate text-foreground leading-none">{u.taskName}</p>
                           <p className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5 leading-none tracking-[0.15em]">Shared</p>
                       </div>
                       <ChevronRight size={8} className="ml-auto opacity-0 group-hover:opacity-40" />
                    </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function TaskCard({ task, onAction, onHandover, color, actionLabel = "Release Node" }: any) {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="p-4 md:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden space-y-4"
    >
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
         <div className="flex items-start gap-4 md:gap-5">
            <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner flex items-center justify-center shrink-0"><Target className="h-5 w-5 text-slate-900 dark:text-white" /></div>
            <div className="space-y-2 min-w-0">
               <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-black tracking-tight text-foreground uppercase leading-none truncate max-w-[240px] md:max-w-md">{task.name}</h4>
                  <Badge className="bg-primary text-white border-none text-[9px] font-black px-2 py-0.5 uppercase rounded-full shrink-0">EFF: {task.taskEfficiency}%</Badge>
               </div>
               <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-1.5 text-primary bg-primary/5 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full whitespace-nowrap leading-none"><Briefcase size={11} /> {task.workType}</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><Layout size={11} /> {task.project}</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><Clock size={11} /> {task.deadline}</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4 bg-slate-950 px-4 py-3 rounded-xl shadow-sm text-center border-t-2 border-indigo-600 shrink-0 self-start xl:ml-auto">
            <div className="px-3 border-r border-white/10"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 leading-none">Shift</p><p className="text-lg font-black text-indigo-400 leading-none tracking-tight">{task.todayHours.toFixed(1)}h</p></div>
            <div className="px-3"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 leading-none">Module</p><p className="text-lg font-black text-white leading-none tracking-tight">{task.totalWorked.toFixed(1)}h</p></div>
         </div>
      </div>
      
      <div className="h-[1px] bg-slate-50 dark:bg-slate-800 w-full" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
         <div className="flex flex-col gap-1.5 w-full md:w-[220px]">
            <div className="flex justify-between items-end">
               <div className="space-y-0.5"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Status</p><p className={`text-[9px] font-black uppercase tracking-tight leading-none ${task.progress === 100 ? 'text-emerald-500' : 'text-primary'}`}>{task.readiness}</p></div>
               <p className="text-lg font-black text-primary tracking-tight leading-none">{task.progress}%</p>
            </div>
            <Progress value={task.progress} className="h-1.5 w-full [&>div]:bg-indigo-600" />
         </div>
         <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            <Button variant="outline" className="h-9 px-3 rounded-lg gap-1.5 text-[9px] font-black uppercase tracking-tight border-slate-200" onClick={() => navigate("/member/updates")}><Pencil size={12}/> Update</Button>
            <Button variant="outline" className="h-9 px-3 rounded-lg gap-1.5 text-[9px] font-black uppercase tracking-tight border-slate-200" onClick={() => navigate("/member/time")}><Timer size={12}/> Track</Button>
            <Button className="h-9 px-4 rounded-lg gap-1.5 text-[9px] font-black uppercase tracking-tight text-white bg-indigo-600 hover:bg-black" onClick={onAction}>{actionLabel}</Button>
         </div>
      </div>
    </motion.div>
  );
}

function HandoverDialog({ task, data, onChange, onClose, onConfirm, currentRole, nextRole }: any) {
  const fields = [
    { id: "completed", label: "Finalizations", icon: ClipboardCheck, color: "text-indigo-600", req: true },
    { id: "pending", label: "Residuals", icon: Clock, color: "text-amber-500", req: false },
    { id: "next", label: "Successor Node", icon: Zap, color: "text-indigo-600", req: true },
    { id: "blockers", label: "Obstructions", icon: AlertTriangle, color: "text-rose-600", req: false },
    { id: "mgr", label: "HQ Directives", icon: ShieldCheck, color: "text-slate-400", req: false },
    { id: "member", label: "Unit Briefing", icon: MessageSquare, color: "text-slate-400", req: false },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-2xl">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-900 max-w-5xl max-h-[92vh] w-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-indigo-100/20 dark:border-slate-800">
        <div className="bg-indigo-600 p-10 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-8 relative z-10"><div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner"><Rocket size={32} /></div><div><h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Sync Protocol</h2><p className="text-[10px] font-black text-indigo-100/60 uppercase tracking-[5px] mt-2 italic underline underline-offset-4 decoration-indigo-300 decoration-2 truncate max-w-[260px] md:max-w-none">{task.name}</p></div></div>
          <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all border border-white/10 shrink-0"><X size={28} /></button>
        </div>
        <div className="p-10 md:p-12 space-y-12 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 py-10 border-b border-indigo-50 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-[2rem]">
            <div className="text-center space-y-3"><p className="text-[9px] font-black uppercase text-indigo-400 tracking-[5px]">Active Node</p><Badge className={`${ROLE_COLORS[currentRole]} border-none font-black px-8 py-3 rounded-2xl shadow-lg`}>{currentRole}</Badge></div>
            <ArrowRightLeft className="h-10 w-10 text-indigo-600/30 rotate-90 md:rotate-0" />
            <div className="text-center space-y-3"><p className="text-[9px] font-black uppercase text-indigo-400 tracking-[5px]">Transmission</p><Badge className={`${ROLE_COLORS[nextRole]} border-none font-black px-8 py-3 rounded-2xl shadow-lg`}>{nextRole}</Badge></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map(f => (
              <div key={f.id} className="space-y-3"><p className={`text-[10px] font-black uppercase tracking-[3px] flex items-center gap-3 ${f.color}`}><f.icon size={14} /> {f.label}</p><Textarea value={f.val} onChange={e => f.set(e.target.value)} placeholder={`Log technical ${f.label.toLowerCase()}...`} className="border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-[1.5rem] min-h-[130px] text-[11px] font-bold p-6 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner custom-scrollbar" /></div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
            <Button variant="outline" onClick={onClose} className="w-full md:w-1/3 h-16 rounded-2xl font-black uppercase tracking-[6px] text-[11px] border-slate-200 dark:border-slate-800 dark:text-slate-400">Abort Sync</Button>
            <Button onClick={onConfirm} className="w-full md:flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-black text-white font-black uppercase tracking-[6px] shadow-2xl gap-8 text-[11px]"><Send size={20} /> Transmit Profile (Next: {nextRole})</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


import { useState, useEffect, useMemo } from "react";
import { 
  PenLine, Send, Clock, BookOpen, 
  ChevronRight, ArrowRight, CheckCircle2, 
  Activity, Timer, AlertCircle, ShieldCheck, 
  Briefcase, Target, ListTodo, RefreshCw, Rocket,
  Search, ListFilter, ClipboardList, Layers, Network,
  Clock3, Lock, Radio, MessageSquare, AlertTriangle, X,
  ArrowUpRight, BadgeCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";

const STORAGE_KEYS = {
  TASKS: "app_member_tasks_store",
  UPDATES: "app_member_updates_store",
  CERTIFIED_ROLE: "app_certified_member_role"
};

type MemberRole = "Designer" | "Frontend Developer" | "Backend Developer" | "Tester" | "Bug Fixer";

export default function TaskUpdatesPage() {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [certifiedRole] = useState<MemberRole>(() => {
     return (localStorage.getItem(STORAGE_KEYS.CERTIFIED_ROLE) as MemberRole) || (currentUser.name.includes("Backend") ? "Backend Developer" : "Designer");
  });

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoursSpent, setHoursSpent] = useState("1.0");
  const [progress, setProgress] = useState(50);
  const [completedWork, setCompletedWork] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [notesToManager, setNotesToManager] = useState("");
  const [notesToNextMember, setNotesToNextMember] = useState("");
  const [blockers, setBlockers] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    setTasks(savedTasks);
    const savedUpdates = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPDATES) || "[]");
    setUpdates(savedUpdates);
  }, []);

  const myTasks = useMemo(() => tasks.filter(t => t.assignedRole === certifiedRole), [tasks, certifiedRole]);
  const activeTask = useMemo(() => myTasks.find(t => t.id === selectedTaskId), [myTasks, selectedTaskId]);

  const totalHours = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return updates.filter(u => u.date === today).reduce((acc, u) => acc + parseFloat(u.hours || 0), 0);
  }, [updates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      toast.error("Security Violation: Protocol ID must be authorized.");
      return;
    }
    const newUpdate = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: selectedTaskId,
      taskName: activeTask?.name,
      date,
      hours: hoursSpent,
      progress,
      completedWork,
      pendingWork,
      nextStep,
      notesToManager,
      notesToNextMember,
      blockers,
      timestamp: Date.now()
    };
    const updated = [newUpdate, ...updates];
    setUpdates(updated);
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(updated));
    toast.success(`Tactical Broadcast Synchronized for ${activeTask?.name}`);
    setCompletedWork(""); setPendingWork(""); setNextStep(""); setNotesToManager(""); setNotesToNextMember(""); setBlockers("");
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 pb-8 px-4 pt-4 md:px-6">
      {/* HEADER HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-950 p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-5 opacity-[0.03] pointer-events-none text-indigo-600"><Radio size={120} /></div>
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
           <div className="h-9 w-9 bg-indigo-600 rounded-lg shadow-xl flex items-center justify-center text-white shrink-0"><PenLine size={18} /></div>
           <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Standard User</p>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                 <Badge className="bg-rose-500 text-white border-none font-black text-[9px] px-2 py-0.5 uppercase tracking-tight flex items-center gap-1 shrink-0"><Lock size={8} /> Certified</Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                 <h1 className="text-xl font-black tracking-tight text-foreground uppercase leading-none">TACTICAL REPORTING</h1>
                 <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase tracking-tight px-2.5 py-0.5 rounded-full whitespace-nowrap">{certifiedRole}</Badge>
                 <div className="h-0.5 w-0.5 rounded-full bg-slate-200 shrink-0" />
                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">Session: <span className="text-primary font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-indigo-600 border border-slate-100 relative">
            <CardHeader className="p-4 md:p-5 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                   <div className="flex items-center gap-3">
                      <div className="h-7 w-7 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm"><ClipboardList size={14}/></div>
                      <CardTitle className="text-xs font-black tracking-tight uppercase leading-none">BROADCAST ENTRY</CardTitle>
                   </div>
                   <Badge className="bg-indigo-600 text-white border-none px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-tight shadow-sm">VALID</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-5 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="p-4 md:p-5 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 space-y-4">
                   <p className="text-[9px] font-bold uppercase text-indigo-500 tracking-[0.15em] leading-none">Metadata</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                         <Label className="text-[9px] font-bold uppercase text-indigo-600 tracking-[0.15em] ml-1">Date</Label>
                         <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 rounded-md border-slate-200 bg-white font-bold text-[9px] uppercase" />
                      </div>
                      <div className="space-y-1">
                         <Label className="text-[9px] font-bold uppercase text-indigo-600 tracking-[0.15em] ml-1">Node</Label>
                         <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                            <SelectTrigger className="h-9 rounded-md border-slate-200 bg-white font-black text-[9px] uppercase">
                               <SelectValue placeholder="Protocol..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-slate-200"><div className="p-1 space-y-0.5">{myTasks.map(t => (<SelectItem key={t.id} value={t.id} className="rounded-md font-bold py-1.5 uppercase text-[9px]">{t.name}</SelectItem>))}</div></SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-1">
                         <Label className="text-[9px] font-bold uppercase text-indigo-600 tracking-[0.15em] ml-1">Hours</Label>
                         <Input type="number" step="0.5" value={hoursSpent} onChange={e => setHoursSpent(e.target.value)} className="h-9 rounded-md border-slate-200 bg-white font-bold text-[9px] uppercase" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5"><BadgeCheck size={12} className="text-emerald-500"/> Finalizations</Label>
                      <Textarea value={completedWork} onChange={e => setCompletedWork(e.target.value)} placeholder="Accomplishments..." className="min-h-[80px] rounded-xl border-slate-100 bg-slate-50/50 p-3 text-[9px] font-bold focus:bg-white transition-all shadow-inner custom-scrollbar" />
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5"><Clock size={12} className="text-amber-500"/> Residuals</Label>
                      <Textarea value={pendingWork} onChange={e => setPendingWork(e.target.value)} placeholder="Remaining effort..." className="min-h-[80px] rounded-xl border-slate-100 bg-slate-50/50 p-3 text-[9px] font-bold focus:bg-white transition-all shadow-inner custom-scrollbar" />
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5"><ChevronRight size={12} className="text-indigo-600"/> Next Step</Label>
                      <Textarea value={nextStep} onChange={e => setNextStep(e.target.value)} placeholder="Upcoming milestone..." className="min-h-[80px] rounded-xl border-slate-100 bg-slate-50/50 p-3 text-[9px] font-bold focus:bg-white transition-all shadow-inner custom-scrollbar" />
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5"><AlertTriangle size={12} className="text-rose-500"/> Obstructions</Label>
                      <Textarea value={blockers} onChange={e => setBlockers(e.target.value)} placeholder="Bottlenecks..." className="min-h-[80px] rounded-xl border-slate-100 bg-slate-50/50 p-3 text-[9px] font-bold focus:bg-white transition-all shadow-inner custom-scrollbar" />
                   </div>
                </div>

                <div className="p-4 md:p-5 rounded-lg bg-slate-900 text-white space-y-4 border-t-2 border-indigo-600">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                      <div className="space-y-0.5 text-center md:text-left"><p className="text-[9px] font-bold uppercase text-indigo-400 tracking-[0.15em] leading-none">Broadcast Capacity</p><h5 className="text-xl font-black tracking-tight text-white">{progress}% Complete</h5></div>
                      <Slider value={[progress]} onValueChange={([v]) => setProgress(v)} max={100} step={5} className="w-full md:w-[220px] [&>span]:bg-indigo-500" />
                   </div>
                   <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 space-y-1.5"><Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">HQ Annotations</Label><Textarea value={notesToManager} onChange={e => setNotesToManager(e.target.value)} className="bg-white/5 border-white/10 rounded-lg min-h-[60px] text-[9px] font-bold p-3 focus:bg-white/10 text-white"/></div>
                      <div className="flex-1 space-y-1.5"><Label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">Relay Briefing</Label><Textarea value={notesToNextMember} onChange={e => setNotesToNextMember(e.target.value)} className="bg-white/5 border-white/10 rounded-lg min-h-[60px] text-[9px] font-bold p-3 focus:bg-white/10 text-white"/></div>
                   </div>
                </div>

                <Button type="submit" className="h-10 md:h-11 w-full rounded-xl bg-indigo-600 hover:bg-black text-white font-black uppercase tracking-tight text-[9px] shadow-lg transition-all group gap-3">Synchronize Protocol Signal <Send size={14} className="group-hover:translate-x-1 transition-transform"/></Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-t-2 border-amber-500 border border-slate-100">
            <CardHeader className="p-4 border-b border-slate-50 dark:border-slate-800/50"><div className="flex items-center gap-2.5"><div className="h-7 w-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 shadow-inner"><Activity size={14}/></div><CardTitle className="text-xs font-black uppercase tracking-tight">ACTIVE CONTEXT</CardTitle></div></CardHeader>
            <CardContent className="p-4 space-y-4">
               {!selectedTaskId ? (
                 <div className="py-8 text-center space-y-3 opacity-30 font-bold uppercase text-muted-foreground tracking-[0.15em]"><Search size={24} className="mx-auto"/><p className="text-[9px]">Select Node</p></div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                       <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-[0.15em] mb-1.5 leading-none">Stream</p>
                       <h6 className="font-black text-foreground uppercase text-xs leading-tight">{activeTask?.name}</h6>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 flex flex-col gap-1"><p className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.15em] leading-none">Base</p><p className="text-base font-black text-amber-700 tracking-tight leading-none">{activeTask?.progress}%</p></div>
                       <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 flex flex-col gap-1"><p className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.15em] leading-none">Node</p><p className="text-[9px] font-black text-indigo-800 uppercase tracking-tight leading-none truncate">{activeTask?.project}</p></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-[0.15em] ml-1">Metadata</p>
                       <div className="space-y-1">
                          <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/20 rounded-lg"><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Type</span><span className="text-[9px] font-black uppercase text-primary leading-none">{activeTask?.workType}</span></div>
                          <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/20 rounded-lg"><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none">Risk</span><Badge className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-none px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tight">{activeTask?.deadlineRisk}</Badge></div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-xl overflow-hidden group">
            <CardHeader className="p-4 border-b border-white/5"><div className="flex items-center gap-2.5"><div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><BookOpen size={14}/></div><CardTitle className="text-xs font-black uppercase tracking-tight">LATEST BRIEFINGS</CardTitle></div></CardHeader>
            <CardContent className="p-4">
               <div className="space-y-3">
                  {updates.slice(0, 3).map((u, i) => (
                    <motion.div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1.5 group-hover:bg-white/10 transition-all">
                       <div className="flex justify-between items-center gap-2">
                          <p className="text-[9px] font-black uppercase text-indigo-400 tracking-tight truncate leading-none">{u.taskName}</p>
                          <p className="text-[9px] font-bold text-slate-500 shrink-0 leading-none">{u.date}</p>
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 line-clamp-1 leading-relaxed">{u.completedWork || "Void..."}</p>
                       <div className="flex items-center justify-between pt-0.5">
                          <Badge className="bg-white/10 text-white/60 border-none px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight">{u.hours}h</Badge>
                          <ChevronRight size={8} className="text-slate-600" />
                       </div>
                    </motion.div>
                  ))}
                  {updates.length === 0 && <div className="py-6 text-center opacity-20 italic font-black uppercase tracking-[5px] text-slate-400"><p className="text-[7px]">Registry Void</p></div>}
               </div>
               <Button variant="outline" onClick={() => navigate("/member/time")} className="w-full mt-4 h-9 rounded-lg border-white/10 bg-transparent text-white font-black uppercase tracking-tight text-[9px] hover:bg-white hover:text-black transition-all gap-1.5">View Full Registry <ArrowUpRight size={10}/></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

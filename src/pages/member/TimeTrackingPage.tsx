import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, Square, Plus, Timer, Clock,
  CheckCircle2, Target, Calendar, Save, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

const assignedTasks = [
  { id: "T1", name: "AWS S3 Bucket Config", project: "Cloud Migration", estHours: 8 },
  { id: "T2", name: "OAuth2 Provider Integration", project: "Security Infrastructure", estHours: 12 },
  { id: "T3", name: "Chart.js Theme Registry", project: "SaaS Dashboard", estHours: 6 },
];

const timeLog = [
  { task: "DB Indexing Audit", project: "Cloud Migration", duration: "2h 30m", date: "Today", notes: "Completed index analysis" },
  { task: "AWS S3 Bucket Config", project: "Cloud Migration", duration: "3h 00m", date: "Today", notes: "Staging bucket configured" },
  { task: "OAuth2 Integration", project: "Security Infra", duration: "1h 45m", date: "Yesterday", notes: "OAuth2 flow tested" },
];

const weekSummary = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 5.0 },
  { day: "Thu", hours: 8.0 },
  { day: "Fri", hours: 3.3 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

const todayTotal = 5.5; // hours

export default function TimeTrackingPage() {
  const [activeTask, setActiveTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual entry state
  const [manualTask, setManualTask] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualStart, setManualStart] = useState("");
  const [manualEnd, setManualEnd] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleStart = () => {
    if (!activeTask) return toast.error("Please select a task before starting the timer.");
    setIsRunning(true);
    toast.success("Timer started.");
  };
  const handlePause = () => { setIsRunning(false); toast.info("Timer paused."); };
  const handleStop = () => {
    setIsRunning(false);
    const mins = Math.round(elapsed / 60);
    toast.success(`Time logged: ${Math.floor(mins / 60)}h ${mins % 60}m`);
    setElapsed(0);
    setActiveTask("");
  };
  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Manual time entry saved.");
    setManualTask(""); setManualDate(""); setManualStart(""); setManualEnd(""); setManualNotes("");
  };

  const maxDay = Math.max(...weekSummary.map(d => d.hours), 1);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Time Tracking
        </h1>
        <p className="text-muted-foreground mt-1">Track how long you spend on each task. Keep your estimates accurate.</p>
      </div>

      {/* Today Summary + Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Timer */}
        <Card className="lg:col-span-7 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Timer className="h-4 w-4 text-indigo-500" /> Active Timer
            </CardTitle>
            <CardDescription>Select a task and start tracking your time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <Select value={activeTask} onValueChange={setActiveTask} disabled={isRunning}>
              <SelectTrigger className="h-12 rounded-2xl border-none bg-secondary/30 font-bold">
                <SelectValue placeholder="Select the task you're working on..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl p-1.5">
                {assignedTasks.map(t => (
                  <SelectItem key={t.id} value={t.id} className="rounded-xl py-2.5 cursor-pointer">
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.project} · Est {t.estHours}h</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clock Display */}
            <div className={`bg-gradient-to-br rounded-3xl p-8 text-center transition-all duration-500 ${isRunning ? 'from-indigo-600 to-indigo-700 shadow-2xl shadow-indigo-600/30' : 'from-secondary/40 to-secondary/20'}`}>
              <p className={`font-mono text-5xl font-black tracking-tight transition-colors ${isRunning ? 'text-white' : 'text-foreground/50'}`}>
                {formatTime(elapsed)}
              </p>
              {isRunning && activeTask && (
                <p className="text-indigo-200 text-xs font-bold mt-3 uppercase tracking-widest">
                  {assignedTasks.find(t => t.id === activeTask)?.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isRunning ? (
                <Button className="flex-1 h-12 rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold border-none transition-all active:scale-95" onClick={handleStart}>
                  <Play className="h-4 w-4" /> Start Timer
                </Button>
              ) : (
                <Button className="flex-1 h-12 rounded-2xl gap-2 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 font-bold border-none transition-all active:scale-95" onClick={handlePause}>
                  <Pause className="h-4 w-4" /> Pause
                </Button>
              )}
              <Button variant="outline" className="h-12 px-6 rounded-2xl gap-2 font-bold border-none bg-secondary/50 hover:bg-secondary transition-all" disabled={elapsed === 0} onClick={handleStop}>
                <Square className="h-4 w-4" /> Stop & Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today + Weekly Summary */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Today's Total</p>
              <p className="text-4xl font-black tracking-tight">{todayTotal}h</p>
              <p className="text-indigo-200 text-xs font-medium mt-2">logged across 2 tasks today</p>
              <Progress value={(todayTotal / 8) * 100} className="mt-4 h-1.5 bg-white/20 [&>div]:bg-white rounded-full" />
              <p className="text-indigo-200/70 text-[10px] mt-1">{Math.round((todayTotal / 8) * 100)}% of 8h target</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" /> This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-end gap-2 h-24">
                {weekSummary.map(d => (
                  <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-secondary/30 rounded-lg overflow-hidden" style={{ height: "72px" }}>
                      <div
                        className={`w-full rounded-lg transition-all duration-700 ${d.day === "Fri" ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                        style={{ height: `${(d.hours / maxDay) * 72}px`, marginTop: `${72 - (d.hours / maxDay) * 72}px` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-3 text-center">
                Total this week: <span className="text-indigo-600 font-black">30h</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Entry */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-500" /> Add Manual Entry
            </CardTitle>
            <CardDescription>Forgot to start the timer? Log time manually here.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleManualSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Task</Label>
                <Select value={manualTask} onValueChange={setManualTask} required>
                  <SelectTrigger className="h-10 rounded-xl border-none bg-secondary/30 text-xs font-bold">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl p-1.5">
                    {assignedTasks.map(t => (
                      <SelectItem key={t.id} value={t.id} className="rounded-xl cursor-pointer text-xs">{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Date</Label>
                  <Input type="date" className="h-10 border-none bg-secondary/30 rounded-xl text-xs" value={manualDate} onChange={e => setManualDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Start</Label>
                  <Input type="time" className="h-10 border-none bg-secondary/30 rounded-xl text-xs" value={manualStart} onChange={e => setManualStart(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">End</Label>
                  <Input type="time" className="h-10 border-none bg-secondary/30 rounded-xl text-xs" value={manualEnd} onChange={e => setManualEnd(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Notes (optional)</Label>
                <Textarea placeholder="What did you work on?" className="border-none bg-secondary/30 rounded-xl min-h-[80px] text-xs" value={manualNotes} onChange={e => setManualNotes(e.target.value)} />
              </div>
              <Button type="submit" className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 font-bold border-none gap-2 transition-all active:scale-95">
                <Save className="h-4 w-4" /> Save Time Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" /> Recent Time Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {timeLog.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="p-4 rounded-2xl bg-secondary/20 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{log.task}</p>
                    <Badge className="bg-indigo-500/10 text-indigo-600 border-none text-[9px] font-black">
                      {log.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Target className="h-2.5 w-2.5" /> {log.project}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" /> {log.date}
                    </p>
                  </div>
                  {log.notes && <p className="text-[10px] text-muted-foreground/70 mt-1.5 italic">{log.notes}</p>}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

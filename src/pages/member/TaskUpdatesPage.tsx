import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2, Clock, AlertTriangle, PenLine,
  Save, ChevronRight, Target, Calendar, FileText,
  SlidersHorizontal, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useRole } from "@/contexts/RoleContext";

const statusOptions = [
  { value: "Not Started", label: "Not Started", color: "bg-slate-400/10 text-slate-500", icon: Clock },
  { value: "In Progress", label: "In Progress", color: "bg-indigo-500/10 text-indigo-600", icon: SlidersHorizontal },
  { value: "Completed", label: "Completed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  { value: "Delayed", label: "Delayed", color: "bg-rose-500/10 text-rose-600", icon: AlertTriangle },
];

type StatusKey = "Not Started" | "In Progress" | "Completed" | "Delayed";
const statusBadge: Record<StatusKey, string> = {
  "Not Started": "bg-slate-400/10 text-slate-500 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none",
};

export default function TaskUpdatesPage() {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState<any[]>([]);

  // Load Tasks from shared persistence
  useState(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("app_tasks_persistence");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    };
    loadTasks();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "app_tasks_persistence") loadTasks();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  });

  const assignedTasks = tasks;

  // Derive recent updates from our assigned tasks' histories
  const recentUpdates = assignedTasks
    .flatMap(t => (t.history || []).map((h: any) => ({ ...h, task: t.name })))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const [projects, setProjectsList] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [manualTaskName, setManualTaskName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [progress, setProgress] = useState(50);
  const [notes, setNotes] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [completionSummary, setCompletionSummary] = useState("");

  useEffect(() => {
    const loadProjects = () => {
      const persisted = localStorage.getItem("app_projects_persistence");
      setProjectsList(persisted ? JSON.parse(persisted) : []);
    };
    loadProjects();
    window.addEventListener("storage", loadProjects);
    return () => window.removeEventListener("storage", loadProjects);
  }, []);

  const filteredTasks = useMemo(() => {
    if (selectedProjectId === "All") return tasks;
    return tasks.filter(t => (t.project === selectedProjectId || t.projectId === selectedProjectId));
  }, [tasks, selectedProjectId]);

  const isDelayed = selectedStatus === "Delayed";
  const isCompleted = selectedStatus === "Completed";
  const canSubmit = manualTaskName.trim() !== "" && selectedStatus !== "";

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    
    if (!canSubmit) {
      toast.error("Please identify your work and status before updating.");
      return;
    }

    try {
      const finalProgress = selectedStatus === "Completed" ? 100 : progress;
      const finalNote = notes || "Standard operational update.";

      const timestamp = new Date().toLocaleString();
      const updateEntry = {
        status: selectedStatus || "In Progress",
        progress: finalProgress,
        note: finalNote,
        updatedAt: timestamp,
        updatedBy: currentUser.name,
        role: "Backend Developer",
        projectName: selectedProjectId === "All" ? "Uncategorized" : selectedProjectId
      };

      // Since it's manual, we'll create a standalone work unit record for the manager
      const manualTask = {
        id: `M-TSK-${Math.floor(1000+Math.random()*9000)}`,
        name: manualTaskName,
        project: updateEntry.projectName,
        assignee: currentUser.name,
        status: selectedStatus,
        progress: finalProgress,
        latestUpdate: updateEntry,
        history: [updateEntry]
      };

      const persisted = localStorage.getItem("app_tasks_persistence");
      const currentTasks = persisted ? JSON.parse(persisted) : [];
      const updatedTasks = [manualTask, ...currentTasks];

      localStorage.setItem("app_tasks_persistence", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      window.dispatchEvent(new Event("storage"));

      toast.success(`Record for "${manualTaskName}" successfully synchronized.`);

      // Cleanup
      setManualTaskName("");
      setSelectedStatus("");
      setProgress(50);
      setNotes("");
      setDelayReason("");
      setCompletionSummary("");
      
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to save update. Please try again.");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Task Updates
        </h1>
        <p className="text-muted-foreground mt-1">Report your progress, flag blockers, and mark tasks complete.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Update Form */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-indigo-600 p-6 text-white border-none">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <PenLine className="h-5 w-5" /> Submit Task Update
              </CardTitle>
              <CardDescription className="text-indigo-100/70">
                Select a task, set its current status, and add your progress notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-indigo-600">Step 1: Link to Project</Label>
                  <Select value={selectedProjectId} onValueChange={(val) => {
                    setSelectedProjectId(val);
                  }}>
                    <SelectTrigger className="h-12 rounded-2xl border-none bg-indigo-50/50 border border-indigo-100 font-bold text-sm">
                      <SelectValue placeholder="Choose a project..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                      <SelectItem value="All" className="rounded-xl py-3 cursor-pointer tracking-wider">Uncategorized / Independent Work</SelectItem>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.name} className="rounded-xl py-3 cursor-pointer font-bold">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Role & Task (Only visible after project selection) */}
                <AnimatePresence>
                  {selectedProjectId !== "All" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 pt-4 border-t border-indigo-100/50 overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Role Identification</p>
                          <Badge className="mt-1 bg-indigo-600 text-white border-none text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter">
                            Backend Developer
                          </Badge>
                        </div>
                        <div className="text-right">
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-indigo-600 font-bold tracking-tighter">Step 3: Manual Task Type</Label>
                        <Input 
                          placeholder="e.g. Optimized Auth Middleware" 
                          className="h-12 rounded-2xl border-none bg-secondary/30 font-bold text-sm"
                          value={manualTaskName}
                          onChange={(e) => setManualTaskName(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Selection */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">New Status</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(opt.value);
                            if (opt.value === "Completed") setProgress(100);
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer
                            ${selectedStatus === opt.value
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-transparent bg-secondary/20 hover:bg-secondary/40'}
                          `}
                        >
                          <div className={`p-1.5 rounded-lg ${opt.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold">{opt.label}</span>
                          {selectedStatus === opt.value && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Progress</Label>
                    <span className="text-sm font-black text-indigo-600">{progress}%</span>
                  </div>
                  <Slider
                    value={[progress]}
                    onValueChange={([v]) => setProgress(v)}
                    min={0} max={100} step={5}
                    className="[&>span]:bg-indigo-600"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Work Update / Notes</Label>
                  <Textarea
                    placeholder="What did you work on? Any issues or progress to share?"
                    className="border-none bg-secondary/30 rounded-2xl min-h-[100px] text-sm placeholder:text-muted-foreground/50"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* Delay Reason (conditional) */}
                <AnimatePresence>
                  {isDelayed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Delay Reason (required)
                      </Label>
                      <Textarea
                        placeholder="What caused the delay? Are you blocked on something?"
                        className="border-none bg-rose-50/50 border-rose-200 rounded-2xl min-h-[90px] text-sm"
                        value={delayReason}
                        onChange={e => setDelayReason(e.target.value)}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Completion Summary (conditional) */}
                <AnimatePresence>
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completion Summary
                      </Label>
                      <Textarea
                        placeholder="Brief summary of what was delivered. Any final notes for your manager?"
                        className="border-none bg-emerald-50/50 rounded-2xl min-h-[90px] text-sm"
                        value={completionSummary}
                        onChange={e => setCompletionSummary(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full h-12 rounded-2xl font-bold gap-2 border-none transition-all active:scale-95
                    ${canSubmit
                      ? isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                        : isDelayed
                          ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                      : 'opacity-40 cursor-not-allowed bg-secondary'}
                  `}
                >
                  <Save className="h-4 w-4" />
                  Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Updates History */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Updates</CardTitle>
              <CardDescription>Your last submitted task updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {recentUpdates.map((upd, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="p-4 rounded-2xl bg-secondary/20 hover:bg-white hover:shadow-md transition-all group space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm truncate group-hover:text-indigo-600 transition-colors">{upd.task}</p>
                      <Badge className={`${statusBadge[upd.status as StatusKey]} text-[8px] font-black uppercase shrink-0`}>{upd.status}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">{upd.note}</p>
                    <p className="text-[9px] font-bold text-muted-foreground/50 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {upd.updatedAt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Quick Guide</p>
            <div className="space-y-3 text-xs">
              {[
                { icon: SlidersHorizontal, text: "Update status whenever you make meaningful progress." },
                { icon: AlertTriangle, text: "Flag delays immediately so your manager can help unblock you." },
                { icon: CheckCircle2, text: "Add a completion summary when marking a task done." },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <tip.icon className="h-4 w-4 text-indigo-300 shrink-0 mt-0.5" />
                  <p className="text-indigo-100/80 leading-relaxed font-medium">{tip.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

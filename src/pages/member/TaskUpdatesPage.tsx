import { useState } from "react";
import {
  CheckCircle2, Clock, AlertTriangle, PenLine,
  Save, ChevronRight, Target, Calendar, FileText,
  SlidersHorizontal, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const assignedTasks = [
  { id: "T1", name: "AWS S3 Bucket Config", project: "Cloud Migration", priority: "High", currentStatus: "In Progress", deadline: "2026-04-18" },
  { id: "T2", name: "OAuth2 Provider Integration", project: "Security Infrastructure", priority: "High", currentStatus: "Not Started", deadline: "2026-04-20" },
  { id: "T3", name: "Chart.js Theme Registry", project: "SaaS Dashboard", priority: "Medium", currentStatus: "In Progress", deadline: "2026-04-25" },
  { id: "T4", name: "API Docs v3", project: "Cloud Migration", priority: "Low", currentStatus: "Delayed", deadline: "2026-04-12" },
];

const statusOptions = [
  { value: "Not Started", label: "Not Started", color: "bg-slate-400/10 text-slate-500", icon: Clock },
  { value: "In Progress", label: "In Progress", color: "bg-indigo-500/10 text-indigo-600", icon: SlidersHorizontal },
  { value: "Completed", label: "Completed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  { value: "Delayed", label: "Delayed", color: "bg-rose-500/10 text-rose-600", icon: AlertTriangle },
];

const recentUpdates = [
  { task: "DB Indexing Audit", status: "Completed", updatedAt: "Today, 11:30 AM", note: "All indexes reviewed and optimized successfully." },
  { task: "Chart.js Theme Registry", status: "In Progress", updatedAt: "Today, 09:15 AM", note: "Theme config module 60% done." },
  { task: "API Docs v3", status: "Delayed", updatedAt: "Yesterday", note: "Blocked on new endpoint specs from backend team." },
];

type StatusKey = "Not Started" | "In Progress" | "Completed" | "Delayed";
const statusBadge: Record<StatusKey, string> = {
  "Not Started": "bg-slate-400/10 text-slate-500 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none",
};

export default function TaskUpdatesPage() {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [progress, setProgress] = useState(50);
  const [notes, setNotes] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [completionSummary, setCompletionSummary] = useState("");

  const selectedTask = assignedTasks.find(t => t.id === selectedTaskId);
  const isDelayed = selectedStatus === "Delayed";
  const isCompleted = selectedStatus === "Completed";
  const canSubmit = selectedTaskId !== "" && selectedStatus !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (isCompleted) {
      toast.success(`"${selectedTask?.name}" marked as Completed. Great work!`, { duration: 4000 });
    } else if (isDelayed) {
      toast.warning(`"${selectedTask?.name}" flagged as Delayed. Your manager has been notified.`);
    } else {
      toast.success(`Status updated to "${selectedStatus}" for "${selectedTask?.name}".`);
    }

    setSelectedTaskId("");
    setSelectedStatus("");
    setProgress(50);
    setNotes("");
    setDelayReason("");
    setCompletionSummary("");
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
                {/* Task Selection */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Select Task to Update</Label>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger className="h-12 rounded-2xl border-none bg-secondary/30 font-bold text-sm">
                      <SelectValue placeholder="Choose a task..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-1.5">
                      {assignedTasks.map(t => (
                        <SelectItem key={t.id} value={t.id} className="rounded-xl py-3 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-bold text-sm">{t.name}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Target className="h-2.5 w-2.5" /> {t.project} · Current: {t.currentStatus}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Preview */}
                <AnimatePresence mode="wait">
                  {selectedTask && (
                    <motion.div
                      key={selectedTask.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-4"
                    >
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{selectedTask.name}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Target className="h-2.5 w-2.5" /> {selectedTask.project}
                          <span className="text-muted-foreground/50">·</span>
                          <Calendar className="h-2.5 w-2.5" /> Due {selectedTask.deadline}
                        </p>
                      </div>
                      <Badge className={`${statusBadge[selectedTask.currentStatus as StatusKey]} text-[8px] font-black uppercase shrink-0`}>
                        {selectedTask.currentStatus}
                      </Badge>
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
                          onClick={() => setSelectedStatus(opt.value)}
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
                  type="submit"
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
                  {isCompleted ? "Mark as Completed" : isDelayed ? "Submit Delay Report" : "Save Update"}
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

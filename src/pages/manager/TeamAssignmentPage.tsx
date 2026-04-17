import { useState } from "react";
import { 
  UserPlus, Search, RefreshCw, 
  CheckCircle2, Users, AlertTriangle, Target, 
  Clock, ShieldAlert, UserCheck,
  UserCog, ListTodo, Trophy, Calendar, Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const initialTasks = [
  { id: "UT1", name: "OAuth2 Provider Integration", project: "Security Infrastructure", priority: "High", estHours: 12, deadline: "Apr 20, 2026" },
  { id: "UT2", name: "Chart.js Theme Registry", project: "SaaS Dashboard Phase 2", priority: "Medium", estHours: 8, deadline: "Apr 25, 2026" },
  { id: "UT3", name: "Internal API Docs v3", project: "Cloud Migration", priority: "Low", estHours: 4, deadline: "May 05, 2026" },
];

const initialMembers = [
  { id: "TM1", name: "Sarah Chen", role: "Sr. Backend Engineer", activeTasks: 4, workload: 88, status: "High", avatar: "SC" },
  { id: "TM2", name: "David Kim", role: "UI/UX Designer", activeTasks: 2, workload: 45, status: "Balanced", avatar: "DK" },
  { id: "TM3", name: "Lisa Wang", role: "QA Lead", activeTasks: 6, workload: 96, status: "Overloaded", avatar: "LW" },
  { id: "TM4", name: "Mike Chen", role: "Frontend Dev", activeTasks: 1, workload: 15, status: "Balanced", avatar: "MC" },
  { id: "TM5", name: "Anna Bell", role: "DevOps Engineer", activeTasks: 3, workload: 72, status: "Busy", avatar: "AB" },
];

const workloadStyles = {
  "Balanced": "bg-emerald-500/10 text-emerald-600 border-none",
  "Busy": "bg-indigo-500/10 text-indigo-600 border-none",
  "High": "bg-amber-500/10 text-amber-600 border-none",
  "Overloaded": "bg-rose-500/10 text-rose-600 border-none",
};

const priorityStyles: Record<string, string> = {
  "High": "bg-rose-500/10 text-rose-600 border-none",
  "Medium": "bg-amber-500/10 text-amber-600 border-none",
  "Low": "bg-indigo-500/10 text-indigo-600 border-none",
};

export default function TeamAssignmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedTask = tasks.find(t => t.id === selectedTaskId) ?? null;
  const selectedMember = initialMembers.find(m => m.id === selectedMemberId) ?? null;

  const filteredMembers = initialMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canAssign = selectedTaskId !== null && selectedMemberId !== null;

  const handleAssign = () => {
    if (!canAssign || !selectedTask || !selectedMember) return;

    if (selectedMember.status === "Overloaded") {
      toast.warning(
        `${selectedMember.name} is currently overloaded. Assignment saved, but consider reassigning soon.`,
        { duration: 4000 }
      );
    } else {
      toast.success(`"${selectedTask.name}" assigned to ${selectedMember.name}.`);
    }

    // Remove task from the list
    setTasks(prev => prev.filter(t => t.id !== selectedTaskId));
    setSelectedTaskId(null);
    setSelectedMemberId(null);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-indigo-500/20 underline-offset-8">
            Team Assignment
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a task, choose a team member, then assign. Three steps to get work moving.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => toast.info("Workload data refreshed.")}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Workflow Steps Banner */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedTaskId ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-400 border border-indigo-200'}`}>
          <span className="h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black border-current">1</span>
          Select Task
        </div>
        <div className={`h-px flex-1 transition-all ${selectedTaskId ? 'bg-indigo-300' : 'bg-indigo-100'}`} />
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedMemberId ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-400 border border-indigo-200'}`}>
          <span className="h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black border-current">2</span>
          Select Member
        </div>
        <div className={`h-px flex-1 transition-all ${canAssign ? 'bg-indigo-300' : 'bg-indigo-100'}`} />
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${canAssign ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>
          <span className="h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black border-current">3</span>
          Assign Task
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Unassigned Tasks */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col border-2 border-dashed border-indigo-500/10">
            <CardHeader className="bg-indigo-600 p-6 text-white border-none">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ListTodo className="h-5 w-5" /> Tasks Waiting for Assignment
              </CardTitle>
              <CardDescription className="text-indigo-100/70">
                Click a task to select it, then pick a team member on the right.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <AnimatePresence>
                {tasks.length > 0 ? (
                  <div className="divide-y divide-border/40">
                    {tasks.map((task, i) => {
                      const isSelected = selectedTaskId === task.id;
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0, padding: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                          className={`p-5 cursor-pointer transition-all relative group
                            ${isSelected
                              ? 'bg-indigo-50 border-l-4 border-indigo-600'
                              : 'hover:bg-secondary/20 border-l-4 border-transparent'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`${priorityStyles[task.priority]} text-[8px] font-black uppercase`}>
                              {task.priority}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground">{task.estHours}h estimated</span>
                          </div>

                          <p className={`font-bold text-sm tracking-tight transition-colors ${isSelected ? 'text-indigo-700' : 'group-hover:text-primary'}`}>
                            {task.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter mt-1 flex items-center gap-1.5">
                            <Target className="h-2.5 w-2.5" /> {task.project}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
                            <Calendar className="h-2.5 w-2.5" /> Due {task.deadline}
                          </p>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-1 shadow-lg shadow-indigo-600/30"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center space-y-4"
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      All tasks have been assigned. Great work!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Selected Task Summary Panel */}
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div
                key="task-summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Selected Task</p>
                    <p className="text-lg font-bold leading-tight">{selectedTask.name}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/10 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-black uppercase text-indigo-200 mb-1">Project</p>
                        <p className="text-[10px] font-bold leading-tight">{selectedTask.project.split(' ').slice(0,2).join(' ')}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-black uppercase text-indigo-200 mb-1">Priority</p>
                        <p className="text-[10px] font-bold">{selectedTask.priority}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-black uppercase text-indigo-200 mb-1">Est. Hours</p>
                        <p className="text-[10px] font-bold">{selectedTask.estHours}h</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-indigo-200 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Due {selectedTask.deadline}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="task-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-none shadow-sm bg-secondary/20 rounded-3xl border-2 border-dashed border-border/40">
                  <CardContent className="p-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground/40 shrink-0">
                      <Flag className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium italic">
                      Select a task above to preview its details here before assigning.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Team Members */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" /> Team Members & Availability
              </CardTitle>
              <CardDescription>
                Select a team member to assign the selected task to them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-10 h-11 border-none bg-secondary/30 rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredMembers.map((member, i) => {
                  const isSelected = selectedMemberId === member.id;
                  const isOverloaded = member.status === "Overloaded";

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => !isOverloaded && setSelectedMemberId(isSelected ? null : member.id)}
                      className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden
                        ${isOverloaded
                          ? 'bg-secondary/20 border-dashed border-rose-200 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-50 border-2 border-indigo-400 shadow-lg shadow-indigo-100 cursor-pointer'
                            : 'bg-white/50 border-border/10 hover:bg-white hover:shadow-lg cursor-pointer'}
                      `}
                    >
                      {isOverloaded && (
                        <div className="absolute top-2 right-3 opacity-10 pointer-events-none">
                          <AlertTriangle size={60} />
                        </div>
                      )}

                      {/* Avatar + Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative">
                          <Avatar className={`h-11 w-11 border-2 shadow-sm transition-all ${isSelected ? 'border-indigo-500' : 'border-white'}`}>
                            <AvatarFallback className={`font-black text-xs uppercase ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/10 text-indigo-700'}`}>
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm tracking-tight">{member.name}</p>
                            <Badge className={`${workloadStyles[member.status as keyof typeof workloadStyles]} text-[8px] font-black h-4 px-2 uppercase leading-none`}>
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
                        </div>
                      </div>

                      {/* Workload */}
                      <div className="flex flex-col gap-2 flex-1 px-4 sm:px-0 w-full sm:max-w-[180px]">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                          <span>Workload</span>
                          <span className={member.workload > 85 ? 'text-rose-500' : 'text-indigo-600'}>{member.workload}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden border border-secondary/20">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${member.workload > 85 ? 'bg-rose-500' : member.workload > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${member.workload}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {member.activeTasks} active tasks
                        </p>
                      </div>

                      {/* Selection state indicator */}
                      <div className="w-full sm:w-auto flex justify-center sm:block">
                        {isOverloaded ? (
                          <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase">
                            <ShieldAlert className="h-4 w-4" /> At Capacity
                          </div>
                        ) : isSelected ? (
                          <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Selected
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5" /> Select
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Primary Assignment Action */}
          <Card className={`border-none rounded-3xl overflow-hidden transition-all duration-300 ${canAssign ? 'shadow-xl shadow-indigo-600/15 bg-indigo-600' : 'shadow-sm bg-secondary/20 border-2 border-dashed border-border/40'}`}>
            <CardContent className="p-6">
              {canAssign ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-5"
                >
                  <div className="flex-1 text-white text-center sm:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Ready to Assign</p>
                    <p className="text-sm font-bold leading-tight">
                      <span className="text-indigo-200">Task:</span> {selectedTask?.name}
                    </p>
                    <p className="text-sm font-bold mt-0.5">
                      <span className="text-indigo-200">To:</span> {selectedMember?.name}
                      {selectedMember?.status === "Overloaded" && (
                        <span className="ml-2 text-rose-300 text-[10px] font-black uppercase">⚠ Overloaded</span>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={handleAssign}
                    className="h-12 px-8 rounded-2xl gap-2 font-black uppercase text-[11px] tracking-widest bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg border-none transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                  >
                    <UserCheck className="h-4 w-4" />
                    Assign Task
                  </Button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground/30 shrink-0">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">
                      {!selectedTaskId && !selectedMemberId
                        ? "Select a task and a team member to enable assignment."
                        : !selectedTaskId
                        ? "Select a task from the left panel to continue."
                        : "Now select a team member to assign the task to."}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-medium italic">
                      The "Assign Task" button will appear once both are selected.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Governance Note */}
          <Card className="border-none shadow-sm bg-secondary/10 border border-dashed border-indigo-500/10 rounded-3xl p-5 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="h-9 w-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-secondary">
                <UserCog className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 mb-1">Assignment Note</p>
                <p className="text-xs leading-relaxed font-medium italic text-muted-foreground/80">
                  Assignments sync with the Admin overview automatically. Avoid assigning high-priority tasks to team members shown as "Overloaded" to keep the team healthy and on schedule.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Team Assignment
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 border border-border shadow-sm text-xs font-bold" onClick={() => toast.info("Workload data refreshed.")}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Workflow Steps Banner */}
      <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-border/50 rounded-2xl shadow-sm">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedTaskId ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-muted-foreground border border-border shadow-sm'}`}>
          <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black border-current">1</span>
          Select Task
        </div>
        <div className={`h-px flex-1 transition-all ${selectedTaskId ? 'bg-indigo-500' : 'bg-border'}`} />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedMemberId ? 'bg-indigo-600 text-white shadow-md' : selectedTaskId ? 'bg-white text-indigo-600 border border-indigo-200 shadow-sm' : 'bg-white/50 text-muted-foreground/50 border border-border/50'}`}>
          <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black border-current">2</span>
          Select Member
        </div>
        <div className={`h-px flex-1 transition-all ${canAssign ? 'bg-indigo-500' : 'bg-border'}`} />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${canAssign ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/50 text-muted-foreground/50 border border-border/50'}`}>
          <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black border-current">3</span>
          Assign Task
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Unassigned Tasks */}
        <div className="lg:col-span-5 flex flex-col gap-5 h-full">
          <Card className="border border-border/50 shadow-sm bg-white rounded-2xl flex flex-col flex-1">
            <CardHeader className="bg-secondary/20 p-5 border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <ListTodo className="h-5 w-5 text-indigo-600" /> Pending Tasks
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-1">
                Select a task to begin assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 flex-1 relative min-h-[300px]">
              <AnimatePresence>
                {tasks.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {tasks.map((task, i) => {
                      const isSelected = selectedTaskId === task.id;
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all relative group border text-left
                            ${isSelected
                              ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                              : 'bg-white border-border/60 hover:border-indigo-300 hover:shadow-sm'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`${priorityStyles[task.priority]} text-[10px] px-2 font-bold uppercase rounded-md shadow-sm`}>
                              {task.priority}
                            </Badge>
                            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {task.estHours}h</span>
                          </div>

                          <p className={`font-bold text-sm tracking-tight transition-colors ${isSelected ? 'text-indigo-800' : 'text-foreground'}`}>
                            {task.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium mt-2 flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-slate-400" /> {task.project}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium mt-1.5 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> Due {task.deadline}
                          </p>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -right-2 -top-2 bg-indigo-600 text-white rounded-full p-1"
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
                    className="flex flex-col items-center justify-center text-center space-y-4 py-8"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Inbox Zero</p>
                      <p className="text-sm font-medium text-muted-foreground mt-1">All tasks have been assigned successfully.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Team Members */}
        <div className="lg:col-span-7 flex flex-col gap-5 h-full">
          <Card className="border border-border/50 shadow-sm bg-white rounded-2xl flex flex-col flex-1">
            <CardHeader className="bg-secondary/20 p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <Users className="h-5 w-5 text-indigo-600" /> Team Availability
                  </CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">
                    Select a suitable team member for the task
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-9 h-11 border border-border/50 bg-secondary/10 rounded-xl text-sm"
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
                      className={`p-4 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden text-left
                        ${isOverloaded
                          ? 'bg-secondary/10 border-dashed border-rose-200 opacity-70 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-50 border-indigo-500 shadow-sm cursor-pointer'
                            : 'bg-white border-border/60 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer'}
                      `}
                    >
                      {/* Avatar + Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Avatar className={`h-11 w-11 shadow-sm transition-all border shrink-0 ${isSelected ? 'border-indigo-500' : 'border-border/50'}`}>
                          <AvatarFallback className={`font-bold text-sm ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-secondary/50 text-foreground'}`}>
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-bold text-sm tracking-tight text-foreground">{member.name}</p>
                            <Badge className={`${workloadStyles[member.status as keyof typeof workloadStyles]} text-[10px] font-bold px-2.5 rounded-md`}>
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{member.role}</p>
                        </div>
                      </div>

                      {/* Workload Indicator section */}
                      <div className="flex flex-col gap-2 flex-1 w-full sm:px-4 sm:max-w-[200px]">
                         <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-muted-foreground flex items-center gap-1">
                               <Clock className="w-3.5 h-3.5"/>
                               {member.activeTasks} tasks
                            </span>
                            <span className={`font-bold ${member.workload > 85 ? 'text-rose-600' : 'text-indigo-600'}`}>
                               {member.workload}%
                            </span>
                         </div>
                         <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                               className={`h-full transition-all duration-700 ease-in-out ${member.workload > 85 ? 'bg-rose-500' : member.workload > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                               style={{ width: `${member.workload}%` }}
                            />
                         </div>
                      </div>

                      {/* Selection Action Button */}
                      <div className="w-full sm:w-auto shrink-0 flex justify-end">
                        {isOverloaded ? (
                          <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 w-full justify-center sm:w-auto">
                            <ShieldAlert className="h-4 w-4" /> Overloaded
                          </div>
                        ) : isSelected ? (
                          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-lg w-full justify-center sm:w-auto">
                            <CheckCircle2 className="h-4 w-4" /> Selected
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 text-xs font-bold rounded-lg border border-border">
                            Select
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>

            {/* Bottom Assignment Action Banner fixed inside the Right Card or underneath it */}
            <div className="p-5 bg-secondary/10 border-t border-border/50 sticky bottom-0 z-10 rounded-b-2xl">
              {canAssign ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
                  <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-indigo-900 tracking-tight">Assignment Ready</p>
                    <p className="text-sm font-medium text-indigo-800">Assign <span className="font-bold underline underline-offset-2">{selectedTask?.name}</span> to <span className="font-bold">{selectedMember?.name}</span>.</p>
                  </div>
                  <Button
                    onClick={handleAssign}
                    className="h-10 px-8 rounded-lg gap-2 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-none transition-all w-full sm:w-auto shrink-0"
                  >
                    <UserCheck className="h-4 w-4" />
                    Assign Task
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white border border-border/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-secondary/80 flex items-center justify-center text-muted-foreground/50 shrink-0">
                        <UserCog className="h-4 w-4" />
                     </div>
                     <p className="text-sm font-medium text-muted-foreground">Select a task and a member to assign.</p>
                  </div>
                  <Button disabled variant="secondary" className="h-10 px-8 rounded-lg font-bold text-sm">Assign Task</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

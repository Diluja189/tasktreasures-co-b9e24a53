import { useState } from "react";
import {
  Search, Play, CheckCircle2, Clock,
  ChevronRight, Target, Calendar, Timer, Eye,
  AlertCircle, MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const myTasks = [];

const priorityStyles: Record<string, string> = {
  High: "bg-rose-500/10 text-rose-600 border-none",
  Medium: "bg-amber-500/10 text-amber-600 border-none",
  Low: "bg-indigo-500/10 text-indigo-600 border-none",
};

const statusStyles: Record<string, string> = {
  "Completed": "bg-emerald-500/10 text-emerald-600 border-none",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-none",
  "Not Started": "bg-slate-400/10 text-slate-500 border-none",
  "Delayed": "bg-rose-500/10 text-rose-600 border-none",
};

export default function MemberTasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = myTasks.filter(t =>
    (statusFilter === "All" || t.status === statusFilter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStatusUpdate = (taskName: string, newStatus: string) => {
    toast.success(`"${taskName}" marked as ${newStatus}.`);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-muted-foreground mt-1">All tasks assigned to you. Start, track progress, and mark them done.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: myTasks.length, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "In Progress", value: myTasks.filter(t => t.status === "In Progress").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completed", value: myTasks.filter(t => t.status === "Completed").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Delayed", value: myTasks.filter(t => t.status === "Delayed").length, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-none shadow-sm ${s.bg} rounded-2xl`}>
              <CardContent className="p-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-10 h-10 border-none bg-background rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full sm:w-44 text-xs font-bold">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-none shadow-xl p-1.5">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className={`border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:bg-card transition-all duration-300 ${task.status === 'Delayed' ? 'border-l-4 border-rose-400' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  {/* Task Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${priorityStyles[task.priority]} text-[8px] font-black uppercase`}>{task.priority}</Badge>
                      <Badge className={`${statusStyles[task.status]} text-[8px] font-black uppercase`}>{task.status}</Badge>
                      {task.status === "Delayed" && <AlertCircle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />}
                    </div>
                    <h3 className="font-bold text-base group-hover:text-indigo-600 transition-colors">{task.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {task.project}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due {task.deadline}</span>
                      <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {task.loggedHours}h / {task.estHours}h logged</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="lg:w-40 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Time Logged</span>
                      <span className="text-indigo-600">{Math.round((task.loggedHours / task.estHours) * 100)}%</span>
                    </div>
                    <Progress value={(task.loggedHours / task.estHours) * 100} className={`h-1.5 rounded-full ${task.status === 'Delayed' ? '[&>div]:bg-rose-500' : task.loggedHours >= task.estHours ? '[&>div]:bg-emerald-500' : '[&>div]:bg-indigo-600'}`} />
                    <p className="text-[9px] text-muted-foreground text-right">{task.loggedHours}h logged</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {task.status !== "Completed" && (
                      <Button size="sm" className="h-9 rounded-xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-[11px] font-bold border-none transition-all active:scale-95"
                        onClick={() => navigate("/member/time")}>
                        <Play className="h-3 w-3" /> Start
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 w-44">
                        <DropdownMenuItem className="rounded-xl gap-2 py-2 text-xs font-bold cursor-pointer" onClick={() => navigate("/member/updates")}>
                          <Eye className="h-3.5 w-3.5" /> Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-2 py-2 text-xs font-bold cursor-pointer" onClick={() => navigate("/member/time")}>
                          <Clock className="h-3.5 w-3.5" /> Log Time
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-2 py-2 text-xs font-bold cursor-pointer text-emerald-600" onClick={() => handleStatusUpdate(task.name, "Completed")}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No tasks match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

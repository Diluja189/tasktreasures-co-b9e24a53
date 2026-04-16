import { useState, useMemo, useEffect } from "react";
import { 
  Plus, Calendar, Search, Filter, MoreHorizontal, Edit2, Trash2, 
  CheckCircle, Clock, AlertCircle, LayoutGrid, List, ChevronDown, 
  User, CheckSquare, ListChecks, Timer, Info, RefreshCw, X, Eye, BarChart3
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";

const users = ["James Wilson", "Emily Davis", "Mike Chen", "Lisa Wang"];

const initialTasks = [
  { 
    id: "TSK-201", 
    title: "Implement auth module", 
    project: "E-Commerce Platform", 
    description: "Develop JWT authentication flow.", 
    status: "In Progress", 
    priority: "High", 
    progress: 45, 
    estHours: "12",
    assignee: "James Wilson" ,
    subtasks: [
      { id: "SUB-1", name: "Create login API", time: "4h", user: "James Wilson", completed: true },
      { id: "SUB-2", name: "Setup middleware", time: "8h", user: "James Wilson", completed: false },
    ]
  },
  { 
    id: "TSK-202", 
    title: "Project Discovery", 
    project: "Mobile App v3.0", 
    description: "Initial scoping and requirements gathering.", 
    status: "Completed", 
    priority: "Medium", 
    progress: 100, 
    estHours: "8",
    assignee: "Emily Davis",
    subtasks: []
  },
];

export default function TasksPage() {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState(initialTasks);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSubtaskDialogOpen, setIsSubtaskDialogOpen] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<string | null>(null);

  // Form States
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    estHours: "8",
    priority: "Medium",
    user: ""
  });

  const [subtaskForm, setSubtaskForm] = useState({
    name: "",
    time: "2h",
    user: ""
  });

  const handleSaveTask = () => {
    if (!taskForm.name) return toast.error("Task name is required");
    toast.success("Task saved successfully!");
    setIsTaskDialogOpen(false);
  };

  const handleAddSubtask = () => {
    if (!subtaskForm.name) return toast.error("Subtask name is required");
    toast.success("Subtask added!");
    setIsSubtaskDialogOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Engine</h1>
          <p className="text-muted-foreground mt-1">
            {currentUser.role === "manager" ? "Coordinate tasks and manage team assignments." : "Track and execute your assigned tasks."}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          
          {currentUser.role === "manager" && (
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                  <Plus className="h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-indigo-600 -mx-6 -mt-6 p-6 text-white text-left">
                  <DialogTitle className="text-2xl font-bold">Configure Task</DialogTitle>
                  <DialogDescription className="text-indigo-100/80">Break down project goals into actionable execution units.</DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-6 px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="font-bold">Project Assignment</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="p1">E-Commerce Platform</SelectItem>
                          <SelectItem value="p2">Mobile App v3.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold">Task Name</Label>
                      <Input placeholder="Enter task name..." className="rounded-xl border-muted-foreground/20" value={taskForm.name} onChange={e => setTaskForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Description</Label>
                    <Textarea placeholder="Details about this task..." className="rounded-xl min-h-[80px]" value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="font-bold">Start Date</Label>
                      <Input type="date" className="rounded-xl" value={taskForm.start} onChange={e => setTaskForm(f => ({ ...f, start: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold text-rose-500">End Date</Label>
                      <Input type="date" className="rounded-xl" value={taskForm.end} onChange={e => setTaskForm(f => ({ ...f, end: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label className="font-bold">Est. Hours</Label>
                      <Input type="number" placeholder="8h" className="rounded-xl" value={taskForm.estHours} onChange={e => setTaskForm(f => ({ ...f, estHours: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold">Priority</Label>
                      <Select value={taskForm.priority} onValueChange={v => setTaskForm(f => ({ ...f, priority: v }))}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold">Assign User</Label>
                      <Select value={taskForm.user} onValueChange={v => setTaskForm(f => ({ ...f, user: v }))}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
                  <Button variant="outline" onClick={() => setTaskForm({name:"", description:"", start:"", end:"", estHours:"8", priority:"Medium", user:""})}>Reset</Button>
                  <Button variant="outline" className="gap-2"><Eye className="h-4 w-4" /> Preview Task</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 font-bold" onClick={handleSaveTask}>Save Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List Section */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-none font-bold text-[10px]">{task.id}</Badge>
                          <Badge variant="outline" className="text-[10px] rounded-full">{task.priority} Priority</Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-none shadow-xl">
                            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-600 font-bold">
                              <CheckCircle className="h-4 w-4" /> Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                              <Edit2 className="h-4 w-4" /> Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                              <Info className="h-4 w-4" /> View Work Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-rose-500/10 focus:text-rose-600 text-rose-500">
                              <Trash2 className="h-4 w-4" /> Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      </div>

                      <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                            {task.assignee.split(" ").map(n=>n[0]).join("")}
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Assignee</p>
                            <p className="text-xs font-semibold">{task.assignee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Est. Effort</p>
                            <p className="text-xs font-semibold">{task.estHours} Hours</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1.5 px-0.5">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">Task Completion</span>
                            <span className="text-xs font-bold text-indigo-600">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>

                    {/* Subtasks Section */}
                    {task.subtasks.length > 0 && (
                      <div className="bg-muted/30 p-4 px-6 border-t font-medium">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Active Subtasks</span>
                          <span className="text-[10px] font-bold text-indigo-600">{task.subtasks.filter(s=>s.completed).length} / {task.subtasks.length} Done</span>
                        </div>
                        <div className="space-y-2">
                          {task.subtasks.map(s => (
                            <div key={s.id} className="flex items-center justify-between bg-white/50 p-2 rounded-xl text-xs border border-white">
                              <div className="flex items-center gap-2">
                                <CheckSquare className={`h-4 w-4 ${s.completed ? 'text-emerald-500' : 'text-muted-foreground opacity-30'}`} />
                                <span className={s.completed ? 'line-through text-muted-foreground' : ''}>{s.name}</span>
                              </div>
                              <Badge variant="ghost" className="text-[9px] h-5 bg-indigo-500/5 text-indigo-600">{s.time}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 border-t flex gap-2">
                      <Button variant="ghost" className="h-9 flex-1 text-xs gap-2 font-bold hover:bg-indigo-500/5 text-indigo-600" onClick={() => {
                        setSelectedTaskForSubtask(task.id);
                        setIsSubtaskDialogOpen(true);
                      }}>
                        <Plus className="h-3 w-3" /> Add Subtask
                      </Button>
                      <Button variant="ghost" className="h-9 flex-1 text-xs gap-2 font-bold hover:bg-emerald-500/5 text-emerald-600">
                        <BarChart3 className="h-3 w-3" /> View Efficiency Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <Card className="border-none shadow-md bg-indigo-600 text-indigo-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">User Performance</CardTitle>
              <CardDescription className="text-indigo-100/70">Top performing members this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map((u, i) => (
                <div key={u} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">{u.split(" ").map(n=>n[0]).join("")}</div>
                    <span className="text-sm font-medium">{u}</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-none font-bold">{(98 - i * 5)}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-600">
                   <CheckCircle className="h-4 w-4" />
                   <span className="text-xs font-bold font-display">65% On-Time</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-2 text-rose-600">
                   <AlertCircle className="h-4 w-4" />
                   <span className="text-xs font-bold font-display">12% Delayed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SUBTASK DIALOG */}
      <Dialog open={isSubtaskDialogOpen} onOpenChange={setIsSubtaskDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
          <DialogHeader className="bg-indigo-600 -mx-6 -mt-6 p-6 text-white text-left">
            <DialogTitle className="text-xl font-bold">New Subtask Breakdown</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label className="font-bold">Subtask Name</Label>
              <Input placeholder="What needs to be done?" className="rounded-xl" value={subtaskForm.name} onChange={e => setSubtaskForm(f=>({...f, name: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Est. Time</Label>
                <Input placeholder="e.g. 2h" className="rounded-xl" value={subtaskForm.time} onChange={e => setSubtaskForm(f=>({...f, time: e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Assign Member</Label>
                <Select value={subtaskForm.user} onValueChange={v => setSubtaskForm(f=>({...f, user: v}))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSubtaskDialogOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-6 font-bold" onClick={handleAddSubtask}>
              <Plus className="h-4 w-4 mr-2" /> Add Subtask
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, CalendarDays, Search, Filter, MoreHorizontal, Edit2, Trash2, 
  CheckCircle, Clock, AlertCircle, LayoutGrid, List, ChevronDown, Download, User
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const initialTasks = [
  { id: "TSK-101", title: "Implement auth module", project: "E-Commerce Platform", description: "Develop and integrate JWT authentication with refresh token logic.", assignee: "James Wilson", status: "In Progress", priority: "High", progress: 65, dueDate: "2024-06-28" },
  { id: "TSK-102", title: "Write API tests", project: "Data Pipeline", description: "Complete unit and integration tests for all core API endpoints.", assignee: "Emily Davis", status: "In Progress", priority: "Medium", progress: 30, dueDate: "2024-06-30" },
  { id: "TSK-103", title: "Design review feedback", project: "Mobile App v3.0", description: "Address the UI inconsistencies found during the internal design audit.", assignee: "James Wilson", status: "Not Started", priority: "Low", progress: 0, dueDate: "2024-07-02" },
  { id: "TSK-104", title: "DB migration script", project: "CRM Integration", description: "Prepare the PostgreSQL migration scripts for the customer table updates.", assignee: "Mike Chen", status: "In Review", priority: "Critical", progress: 90, dueDate: "2024-06-26" },
  { id: "TSK-105", title: "Setup CI/CD pipeline", project: "E-Commerce Platform", description: "Configure GitHub Actions for automated deployment to staging.", assignee: "Lisa Wang", status: "Completed", priority: "High", progress: 100, dueDate: "2024-06-20" },
  { id: "TSK-106", title: "User onboarding flow", project: "Mobile App v3.0", description: "Refactor the registration and initial tutorial sequence for better UX.", assignee: "Emily Davis", status: "In Progress", priority: "High", progress: 50, dueDate: "2024-07-05" },
];

const statusColors: Record<string, string> = {
  "Not Started": "bg-secondary text-secondary-foreground border-border", 
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  "In Review": "bg-warning/10 text-warning border-warning/20", 
  "Completed": "bg-success/10 text-success border-success/20",
};

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground", 
  Medium: "bg-info/10 text-info border-info/20",
  High: "bg-warning/10 text-warning border-warning/20", 
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const TasksPage = () => {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                            task.id.toLowerCase().includes(search.toLowerCase()) ||
                            task.project.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      
      const isMyTask = currentUser.role === "employee" ? task.assignee === currentUser.name : true;
      
      return matchesSearch && matchesStatus && matchesPriority && isMyTask;
    });
  }, [tasks, search, statusFilter, priorityFilter, currentUser]);

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("Task deleted complete", {
      description: `Task ${id} has been permanently removed.`,
    });
  };

  const handleMarkComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: "Completed", progress: 100 } : t));
    toast.success("Task completed!", {
      description: "Keep up the great work!",
    });
  };

  const handleSaveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
      toast.success("Task updated successfully");
      setEditingTask(null);
    } else {
      const newTask = {
        ...data,
        id: `TSK-${Math.floor(Math.random() * 900) + 200}`,
        assignee: currentUser.name,
        progress: 0,
        status: "Not Started",
      } as any;
      setTasks([newTask, ...tasks]);
      toast.success("Task created successfully");
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title={currentUser.role === "employee" ? "My Workspace" : "Task Engine"} 
          description={currentUser.role === "employee" ? "Track your progress and manage your daily assignments." : "Global task management and team coordination interface."} 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 hidden sm:flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 px-4 font-semibold shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-1.5" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSaveTask}>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to your workspace. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" name="title" placeholder="e.g. Design Landing Page" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Input id="project" name="project" placeholder="e.g. Project Apollo" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe the task details..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select name="priority" defaultValue="Medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" name="dueDate" type="date" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by task, ID or project..." 
              className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all w-full" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-36 bg-muted/30 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-10 w-full sm:w-36 bg-muted/30 border-none">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl w-full lg:w-auto overflow-hidden">
          <Button 
            variant={view === "table" ? "secondary" : "ghost"} 
            size="sm" 
            className={`h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all ${view === 'table' ? 'shadow-sm bg-background' : ''}`}
            onClick={() => setView("table")}
          >
            <List className="h-3.5 w-3.5" /> <span className="text-xs font-semibold">Table</span>
          </Button>
          <Button 
            variant={view === "grid" ? "secondary" : "ghost"} 
            size="sm" 
            className={`h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all ${view === 'grid' ? 'shadow-sm bg-background' : ''}`}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> <span className="text-xs font-semibold">Grid</span>
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-3xl"
          >
            <div className="h-16 w-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No tasks found</h3>
            <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
              We couldn't find any tasks matching your current filters or search terms.
            </p>
            <Button variant="outline" className="mt-6 h-9" onClick={() => { setSearch(""); setStatusFilter("All"); setPriorityFilter("All"); }}>
              Clear All Filters
            </Button>
          </motion.div>
        ) : view === "table" ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden border border-border/50 rounded-2xl shadow-sm bg-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/50">
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Task Info</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Priority</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Progress</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Due Date</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">{t.title}</span>
                          <span className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
                             {t.id} <span className="h-1 w-1 rounded-full bg-border" /> {t.project}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[t.priority]}`}>
                          {t.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${t.progress}%` }}
                              className="bg-primary h-full" 
                            />
                          </div>
                          <span className="text-[11px] font-bold w-6">{t.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-primary/60" /> {t.dueDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t.status !== 'Completed' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:bg-success/10" onClick={() => handleMarkComplete(t.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl">
                              <DropdownMenuItem className="gap-2 text-xs font-medium" onClick={() => setEditingTask(t)}>
                                <Edit2 className="h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="gap-2 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. Task <strong>{t.title}</strong> will be permanently deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl" onClick={() => handleDelete(t.id)}>
                                      Delete Task
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredTasks.map((t) => (
              <Card key={t.id} className="border-border/50 bg-card overflow-hidden group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 rounded-3xl">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>
                        {t.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="gap-2 text-xs font-medium" onClick={() => setEditingTask(t)}>
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          {t.status !== 'Completed' && (
                            <DropdownMenuItem className="gap-2 text-xs font-medium text-success" onClick={() => handleMarkComplete(t.id)}>
                              <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-xs font-medium text-destructive" onClick={() => handleDelete(t.id)}>
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{t.title}</h4>
                      <p className="text-xs text-muted-foreground font-mono mb-3">{t.id} • {t.project}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                        {t.description || "No description provided for this task."}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{t.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${t.progress}%` }}
                            className="bg-primary h-full" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {t.assignee.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[11px] font-bold">{t.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-lg">
                           <CalendarDays className="h-3 w-3 text-muted-foreground" />
                           <span className="text-[10px] font-bold text-muted-foreground">{t.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          {editingTask && (
            <form onSubmit={handleSaveTask}>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Update the details of task {editingTask.id}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Task Title</Label>
                  <Input id="edit-title" name="title" defaultValue={editingTask.title} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-project">Project</Label>
                  <Input id="edit-project" name="project" defaultValue={editingTask.project} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={editingTask.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select name="priority" defaultValue={editingTask.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-dueDate">Due Date</Label>
                    <Input id="edit-dueDate" name="dueDate" type="date" defaultValue={editingTask.dueDate} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={editingTask.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button type="submit">Update Task</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;

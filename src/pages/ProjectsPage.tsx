import { useState, useEffect } from "react";
import { 
  Plus, MoreVertical, Eye, Edit3, UserPlus, 
  BarChart2, Trash2, CheckCircle, Clock, AlertCircle,
  Filter, Search, RefreshCcw, X, Info, LayoutTemplate
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const initialProjects = [
  { id: "PRJ-001", name: "E-Commerce Platform", manager: "Sarah Chen", status: "Active", priority: "High", progress: 78, deadline: "2025-07-15", startDate: "2024-01-10", description: "Rebuilding the core e-commerce engine." },
  { id: "PRJ-002", name: "Mobile App v3.0", manager: "Sarah Chen", status: "Delayed", priority: "High", progress: 45, deadline: "2025-08-01", startDate: "2024-02-15", description: "Mobile application migration to React Native." },
  { id: "PRJ-003", name: "Analytics Dashboard", manager: "Lisa Wang", status: "Active", priority: "Medium", progress: 60, deadline: "2025-08-15", startDate: "2024-03-20", description: "Internal data visualization tool." },
  { id: "PRJ-004", name: "Security Audit", manager: "David Kim", status: "Completed", priority: "High", progress: 100, deadline: "2025-06-15", startDate: "2024-01-05", description: "Annual system-wide security assessment." },
];

const statusConfig = {
  Active: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: Clock },
  Completed: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle },
  Delayed: { color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: AlertCircle },
};

const priorityConfig = {
  High: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function ProjectsPage() {
  const { currentUser } = useRole();
  const [projects, setProjects] = useState(initialProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    manager: "",
    duration: "0 days"
  });

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, duration: diff > 0 ? `${diff} days` : "0 days" }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleSave = () => {
    if (!formData.name) return toast.error("Please enter a project name");
    toast.success("Project created successfully!");
    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", startDate: "", endDate: "", priority: "Medium", manager: "", duration: "0 days" });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Lifecycle</h1>
          <p className="text-muted-foreground mt-1">Strategic oversight and management of all active work streams.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Refreshing...")}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                <Plus className="h-4 w-4" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] overflow-hidden rounded-3xl border-none shadow-2xl">
              <DialogHeader className="bg-emerald-600 -mx-6 -mt-6 p-6 text-white text-left">
                <DialogTitle className="text-2xl font-bold">New Project Scope</DialogTitle>
                <DialogDescription className="text-emerald-100/80">Define the parameters of the new project lifecycle.</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-6 px-1">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="font-bold">Project Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter project name..." 
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="rounded-xl border-muted-foreground/20 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc" className="font-bold">Description</Label>
                  <Textarea 
                    id="desc" 
                    placeholder="Describe project objectives..." 
                    className="min-h-[100px] rounded-xl border-muted-foreground/20"
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start" className="font-bold">Start Date</Label>
                    <Input type="date" id="start" className="rounded-xl" value={formData.startDate} onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end" className="font-bold">End Date (Deadline)</Label>
                    <Input type="date" id="end" className="rounded-xl" value={formData.endDate} onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold text-muted-foreground flex justify-between">
                      Duration <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[9px] bg-emerald-500/10 text-emerald-600 border-none">Auto</Badge>
                    </Label>
                    <Input value={formData.duration} disabled className="bg-secondary/50 rounded-xl font-bold font-mono" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Priority</Label>
                    <Select value={formData.priority} onValueChange={v => setFormData(f => ({ ...f, priority: v }))}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Assign Manager</Label>
                  <Select value={formData.manager} onValueChange={v => setFormData(f => ({ ...f, manager: v }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="David Kim">David Kim</SelectItem>
                      <SelectItem value="Lisa Wang">Lisa Wang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="outline" className="rounded-xl gap-2" onClick={resetForm}>
                  <RefreshCcw className="h-4 w-4" /> Reset
                </Button>
                <Button variant="outline" className="rounded-xl gap-2 border-primary/20 hover:bg-primary/5">
                  <Eye className="h-4 w-4" /> Preview
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 shadow-lg shadow-emerald-600/20" onClick={handleSave}>
                  Save Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => {
            const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-[10px] rounded-full uppercase tracking-tighter ${statusConfig[project.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-2.5 w-2.5 mr-1" /> {project.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-xl border-none">
                          <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                            <Eye className="h-4 w-4 text-primary" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                            <Edit3 className="h-4 w-4 text-amber-500" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                            <UserPlus className="h-4 w-4 text-emerald-500" /> Change Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5">
                            <BarChart2 className="h-4 w-4 text-indigo-500" /> View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-rose-500/10 focus:text-rose-600 text-rose-500">
                            <Trash2 className="h-4 w-4" /> Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{project.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">SC</div>
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">DK</div>
                        <div className="h-8 w-8 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] font-bold">+4</div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${priorityConfig[project.priority as keyof typeof priorityConfig]}`}>
                        {project.priority} Priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                        <span>Overall Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 rounded-full overflow-hidden" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-2">
                      <div className="space-y-1 border-r">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Manager</p>
                        <p className="text-xs font-semibold">{project.manager}</p>
                      </div>
                      <div className="space-y-1 pl-2">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Deadline</p>
                        <p className="text-xs font-semibold">{project.deadline}</p>
                      </div>
                    </div>
                    
                    {/* Project Footer Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-muted/30">
                      <Button variant="ghost" className="flex-1 h-9 rounded-xl text-xs font-bold gap-2 text-primary hover:bg-primary/5">
                        <LayoutTemplate className="h-3.5 w-3.5" /> Details
                      </Button>
                      <div className="w-px h-6 bg-muted/30" />
                      <Button variant="ghost" className="flex-1 h-9 rounded-xl text-xs font-bold gap-2 text-indigo-500 hover:bg-indigo-500/5">
                        <BarChart2 className="h-3.5 w-3.5" /> Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

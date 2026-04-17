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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
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
    
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
      toast.success("Project updated successfully!");
    } else {
      const newProject = {
        ...formData,
        id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Active",
        progress: 0,
      } as any;
      setProjects(prev => [newProject, ...prev]);
      toast.success("Project created successfully!");
    }
    
    setIsCreateOpen(false);
    setEditingProject(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted successfully");
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate || "",
      endDate: project.deadline || "",
      priority: project.priority,
      manager: project.manager,
      duration: ""
    });
    setIsCreateOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", startDate: "", endDate: "", priority: "Medium", manager: "", duration: "0 days" });
    setEditingProject(null);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
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
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" onClick={() => { setEditingProject(null); resetForm(); }}>
                <Plus className="h-4 w-4" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px] overflow-hidden rounded-xl border border-border/50 shadow-2xl p-0 gap-0 bg-white dark:bg-slate-950">
              <DialogHeader className="bg-emerald-600 p-3 text-white text-left">
                <DialogTitle className="text-base font-black">{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
                <DialogDescription className="text-emerald-500/10 hidden">Hidden for accessibility but present</DialogDescription>
              </DialogHeader>
              
              <div className="p-4 space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Project Name</Label>
                  <Input 
                    id="name" 
                    placeholder="E.g. Cloud Migration" 
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="h-8 rounded-lg border-muted-foreground/20 focus-visible:ring-emerald-500/30 text-xs px-2.5 bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Objective</Label>
                  <Textarea 
                    id="desc" 
                    placeholder="Short duration objectives..." 
                    className="min-h-[60px] rounded-lg border-muted-foreground/20 focus-visible:ring-emerald-500/30 text-xs py-2 px-2.5 resize-none bg-background"
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Start Date</Label>
                      <Input type="date" className="h-8 rounded-lg text-[10px] px-2" value={formData.startDate} onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))} />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Deadline</Label>
                      <Input type="date" className="h-8 rounded-lg text-[10px] px-2" value={formData.endDate} onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex justify-between">
                      Duration <Badge className="px-1 py-0 h-3 text-[7px] bg-emerald-500/10 text-emerald-600 border-none shadow-none">Auto</Badge>
                    </Label>
                    <Input value={formData.duration} disabled className="h-8 bg-secondary/20 rounded-lg font-bold font-mono text-[10px] px-2.5 border-none" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Priority</Label>
                    <Select value={formData.priority} onValueChange={v => setFormData(f => ({ ...f, priority: v }))}>
                      <SelectTrigger className="h-8 rounded-lg text-[10px] px-2.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low" className="text-xs">Low</SelectItem>
                        <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                        <SelectItem value="High" className="text-xs">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Assign Manager</Label>
                  <Select value={formData.manager} onValueChange={v => setFormData(f => ({ ...f, manager: v }))}>
                    <SelectTrigger className="h-8 rounded-lg text-xs px-2.5">
                      <SelectValue placeholder="Choose leader" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Chen" className="text-xs">Sarah Chen</SelectItem>
                      <SelectItem value="David Kim" className="text-xs">David Kim</SelectItem>
                      <SelectItem value="Lisa Wang" className="text-xs">Lisa Wang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 pt-0 flex gap-2 justify-end">
                <Button variant="ghost" className="h-7 text-[10px] font-bold px-3" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button 
                  variant="outline" 
                  className="h-7 text-[10px] font-bold gap-1 px-3 border-emerald-500/20 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    if (!formData.name) return toast.error("Enter project name");
                    toast.info(`Preview: ${formData.name}`, {
                      description: `${formData.priority} Priority • Ends ${formData.endDate || 'N/A'}`
                    });
                  }}
                >
                  <Eye className="h-3 w-3" /> Preview
                </Button>
                <Button className="h-7 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 shadow-lg shadow-emerald-600/20" onClick={handleSave}>
                  {editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Card className="group border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 rounded-full uppercase tracking-tighter ${statusConfig[project.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-2 w-2 mr-1" /> {project.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-secondary">
                            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-lg border-none">
                          <DropdownMenuItem 
                            className="gap-2 rounded-lg py-1.5 text-xs cursor-pointer focus:bg-primary/5"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit3 className="h-3.5 w-3.5 text-amber-500" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 rounded-lg py-1.5 text-xs cursor-pointer focus:bg-rose-500/10 text-rose-600"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-0.5">
                      <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                      <CardDescription className="text-[11px] line-clamp-1">{project.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <div className="h-6 w-6 rounded-full bg-primary/20 border border-white flex items-center justify-center text-[8px] font-bold text-primary">SC</div>
                        <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">DK</div>
                        <div className="h-6 w-6 rounded-full bg-secondary border border-white flex items-center justify-center text-[8px] font-bold">+4</div>
                      </div>
                      <Badge variant="outline" className={`text-[8px] px-1.5 py-0 rounded-full ${priorityConfig[project.priority as keyof typeof priorityConfig]}`}>
                        {project.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1 rounded-full overflow-hidden" />
                    </div>
 
                    <div className="grid grid-cols-2 gap-2 pb-1">
                      <div className="space-y-0.5">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Manager</p>
                        <p className="text-[10px] font-semibold">{project.manager}</p>
                      </div>
                      <div className="space-y-0.5 pl-2 border-l">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Deadline</p>
                        <p className="text-[10px] font-semibold">{project.deadline}</p>
                      </div>
                    </div>
                    
                    {/* Project Footer Actions */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-muted/20">
                      <Button 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[10px] font-bold gap-1.5 text-primary hover:bg-primary/5"
                        onClick={() => toast.info(`Project Details: ${project.name}`, { description: project.description })}
                      >
                        <LayoutTemplate className="h-3 w-3" /> Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[10px] font-bold gap-1.5 text-indigo-500 hover:bg-indigo-500/5"
                        onClick={() => navigate(`/reports?projectId=${project.id}`)}
                      >
                        <BarChart2 className="h-3 w-3" /> Report
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

import { useState, useEffect } from "react";
import { 
  Plus, MoreVertical, Eye, Edit3, UserPlus, 
  BarChart2, Trash2, CheckCircle, Clock, AlertCircle,
  Filter, Search, RefreshCcw, X, Info, LayoutTemplate, Calendar
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

const initialProjects = [];

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
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("app_projects_persistence");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  useEffect(() => {
    localStorage.setItem("app_projects_persistence", JSON.stringify(projects));
  }, [projects]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    priority: "Medium",
    manager: "",
    duration: "0 days"
  });

  useEffect(() => {
    if (formData.startDate && formData.deadline) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.deadline);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, duration: diff > 0 ? `${diff} days` : "0 days" }));
    }
  }, [formData.startDate, formData.deadline]);

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
        totalTasks: 0,
        completedTasks: 0,
        delayedTasks: 0,
        teamMembersCount: Math.floor(Math.random() * 4) + 1,
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
      deadline: project.deadline || "",
      priority: project.priority,
      manager: project.manager,
      duration: ""
    });
    setIsCreateOpen(true);
  };

  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const resetForm = () => {
    setFormData({ name: "", description: "", startDate: "", deadline: "", priority: "Medium", manager: "", duration: "0 days" });
    setEditingProject(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = projects.filter(p => 
    (statusFilter === "All" || p.status === statusFilter) &&
    ((p.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
     (p.manager || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
     (p.id || "").toLowerCase().includes((searchQuery || "").toLowerCase()))
  );

  const handleViewDetails = (project: any) => {
    setViewingProject(project);
    setIsViewingOpen(true);
  };

  return (
    <div className="space-y-6 pb-10 pt-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Projects</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Find projects..." 
                className="h-8 w-40 pl-8 rounded-xl border-none bg-secondary/20 text-[10px] font-bold focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
           
           <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32 rounded-xl border-none bg-secondary/20 text-[10px] font-black uppercase tracking-widest">
                 <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                 <SelectItem value="All" className="text-[10px] font-bold">All Status</SelectItem>
                 <SelectItem value="Active" className="text-[10px] font-bold">Active</SelectItem>
                 <SelectItem value="Delayed" className="text-[10px] font-bold">Delayed</SelectItem>
                 <SelectItem value="Completed" className="text-[10px] font-bold">Completed</SelectItem>
              </SelectContent>
           </Select>

           <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/10" onClick={() => toast.info("Syncing inventory...")}>
              <RefreshCcw className="h-3.5 w-3.5" /> Refresh
           </Button>
           
           <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl h-8 text-[10px] font-black uppercase tracking-widest border-none" 
                  onClick={() => { 
                    setEditingProject(null); 
                    resetForm(); 
                  }}>
                  <Plus className="h-3.5 w-3.5" /> Create
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto rounded-xl border border-border/50 shadow-2xl p-0 gap-0 bg-white dark:bg-slate-950">
              <DialogHeader className="bg-emerald-600 p-3 text-white text-left">
                <DialogTitle className="text-base font-black">{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
                <DialogDescription className="text-emerald-500/10 hidden">Hidden for accessibility but present</DialogDescription>
              </DialogHeader>
              
              <div className="p-4 space-y-3">
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
                    className="min-h-[50px] rounded-lg border-muted-foreground/20 focus-visible:ring-emerald-500/30 text-xs py-2 px-2.5 resize-none bg-background"
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
                      <Input type="date" className="h-8 rounded-lg text-[10px] px-2" value={formData.deadline} onChange={e => setFormData(f => ({ ...f, deadline: e.target.value }))} />
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
              </div>
              
              <div className="p-4 pt-0 flex gap-2 justify-end">
                <Button variant="ghost" className="h-7 text-[10px] font-bold px-3" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button 
                  variant="outline" 
                  className="h-7 text-[10px] font-bold gap-1 px-3 border-emerald-500/20 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                  onClick={() => {
                    if (!formData.name) return toast.error("Enter project name");
                    toast.info(`Preview: ${formData.name}`, {
                      description: `${formData.priority} Priority • Ends ${formData.deadline || 'N/A'}`
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

          {/* Project Details Dialog (Kutty Form) */}
          <Dialog open={isViewingOpen} onOpenChange={setIsViewingOpen}>
            <DialogContent className="sm:max-w-[340px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-950">
               {viewingProject && (
                 <>
                    <DialogHeader className="p-4 bg-primary/5 text-left relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                          <LayoutTemplate size={60} />
                       </div>
                       <div className="flex items-center justify-between mb-1.5">
                          <Badge variant="outline" className={`text-[8px] px-1.5 py-0 h-3.5 rounded-sm uppercase tracking-widest border-none font-black ${statusConfig[viewingProject.status as keyof typeof statusConfig].color}`}>
                             {viewingProject.id}
                          </Badge>
                       </div>
                       <DialogTitle className="text-base font-black tracking-tight uppercase leading-tight">{viewingProject.name}</DialogTitle>
                       <DialogDescription className="text-[9px] font-bold text-muted-foreground/60 line-clamp-1 mt-0.5">
                          {viewingProject.description}
                       </DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-4 space-y-4">
                       {/* Core Stats Section */}
                       <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/5">
                             <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-0.5">Status</p>
                             <div className="flex items-center gap-1.5">
                                <div className={`h-1.5 w-1.5 rounded-full ${viewingProject.status === "Active" ? "bg-emerald-500" : viewingProject.status === "Delayed" ? "bg-rose-500" : "bg-blue-500"}`} />
                                <span className="text-[9px] font-black uppercase text-foreground/80">{viewingProject.status}</span>
                             </div>
                          </div>
                          <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/5">
                             <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-0.5">Priority</p>
                             <span className="text-[9px] font-black uppercase text-rose-600">{viewingProject.priority}</span>
                          </div>
                       </div>

                       {/* Manager & Timeline */}
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                             <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Manager</p>
                             <p className="text-[10px] font-black">{viewingProject.manager}</p>
                          </div>
                          <div className="text-right space-y-0.5">
                             <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Deadline</p>
                             <p className="text-[10px] font-black text-primary">{viewingProject.deadline}</p>
                          </div>
                       </div>

                       {/* Team Members Section */}
                       <div className="space-y-1.5 pt-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Active Team</p>
                          <div className="flex flex-wrap gap-1">
                             {["Alex J.", "Maria G.", "Steve S.", "James W.", "Emily B."].map((member, i) => (
                               <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-secondary/5 rounded-lg border border-border/5">
                                  <div className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[7px] font-black flex items-center justify-center shrink-0">
                                     {member.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <span className="text-[9px] font-bold text-foreground/70">{member}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Progress Footer */}
                       <div className="space-y-1.5 pt-3 border-t border-border/5">
                          <div className="flex justify-between items-end">
                             <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Overall Completion</p>
                             <span className="text-[10px] font-black text-foreground leading-none">{viewingProject.progress}%</span>
                          </div>
                          <Progress value={viewingProject.progress} className="h-1 rounded-full bg-secondary/20" />
                       </div>
                    </div>

                    <div className="p-3 bg-secondary/5 flex justify-end">
                       <Button variant="ghost" className="h-7 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all" onClick={() => setIsViewingOpen(false)}>
                          Close
                       </Button>
                    </div>
                 </>
               )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((project, index) => {
            const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon;
            
            const perf = (() => {
              const totalTasks = project.totalTasks || 0;
              if (!totalTasks || !project.startDate || !project.deadline) return null;

              const completedTasks = project.completedTasks || 0;
              const delayedTasks = project.delayedTasks || 0;
              
              const start = new Date(project.startDate);
              const end = new Date(project.deadline);
              const today = new Date();

              const totalDuration = end.getTime() - start.getTime();
              const elapsed = today.getTime() - start.getTime();
              let expectedProgress = totalDuration > 0 ? elapsed / totalDuration : 1;
              expectedProgress = Math.max(0, Math.min(1, expectedProgress));

              const actualProgress = totalTasks > 0 ? completedTasks / totalTasks : 0;
              
              let projectScore = 0;
              if (actualProgress >= expectedProgress) {
                 projectScore = 100;
              } else {
                 projectScore = expectedProgress > 0 ? (actualProgress / expectedProgress) * 100 : 100;
              }

              const teamCompletion = 90;
              const onTimeDelivery = 95;
              const delayControl = totalTasks > 0 ? Math.max(0, 100 - (delayedTasks / totalTasks) * 100) : 100;

              let managerPerformance = (projectScore * 0.4) + (teamCompletion * 0.3) + (onTimeDelivery * 0.2) + (delayControl * 0.1);
              managerPerformance = Math.min(100, Math.max(0, Math.round(managerPerformance)));

              const actualP = Math.round(actualProgress * 100);
              const expectedP = Math.round(expectedProgress * 100);

              let statusText = "Behind";
              let statusColorBg = "bg-rose-500";
              let statusColorText = "text-rose-500";
              let statusBadgeBg = "bg-rose-500/10";

              if (actualP > expectedP) {
                statusText = "Ahead";
                statusColorBg = "bg-emerald-500";
                statusColorText = "text-emerald-500";
                statusBadgeBg = "bg-emerald-500/10";
              } else if (actualP === expectedP) {
                statusText = "On Track";
                statusColorBg = "bg-amber-500";
                statusColorText = "text-amber-500";
                statusBadgeBg = "bg-amber-500/10";
              }

              return { managerPerformance, statusText, statusColorBg, statusColorText, statusBadgeBg };
            })();

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
                            className="gap-2 rounded-lg py-1.5 text-xs cursor-pointer focus:bg-primary/5 font-bold"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit3 className="h-3.5 w-3.5 text-amber-500" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 rounded-lg py-1.5 text-xs cursor-pointer focus:bg-rose-500/10 text-rose-600 font-bold"
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
                    <div className="flex items-center justify-end">
                      <Badge variant="outline" className={`text-[8px] px-1.5 py-0 rounded-full ${priorityConfig[project.priority as keyof typeof priorityConfig]}`}>
                        {project.priority}
                      </Badge>
                    </div>


                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 pb-2 border-b border-muted/20">
                      <div className="space-y-0.5">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Calendar className="h-2 w-2" /> Start Date</p>
                        <p className="text-[10px] font-semibold">{project.startDate || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5 pl-2 border-l border-muted/20">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Clock className="h-2 w-2" /> Deadline</p>
                        <p className="text-[10px] font-semibold">{project.deadline || "N/A"}</p>
                      </div>
                    </div>

                    
                    {/* Project Footer Actions */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-muted/20">
                      <Button 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[10px] font-bold gap-1.5 text-primary hover:bg-primary/5 transition-all"
                        onClick={() => handleViewDetails(project)}
                      >
                        <LayoutTemplate className="h-3 w-3" /> Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[10px] font-bold gap-1.5 text-indigo-500 hover:bg-indigo-500/5 transition-all"
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

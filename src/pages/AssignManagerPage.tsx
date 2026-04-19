import { useState, useEffect, useMemo } from "react";
import {
  Search, RefreshCw, CheckCircle2, AlertTriangle,
  Users, LayoutDashboard, ArrowUpRight, ShieldCheck,
  UserCheck, ShieldAlert, Calendar, Clock, Briefcase,
  XCircle, BarChart2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Workload classification (based on active project count) ──────────────────
function classifyWorkload(count: number) {
  if (count === 0) return { label: "No Active Load", color: "text-emerald-600", bg: "bg-emerald-500/10", bar: "bg-emerald-500" };
  if (count <= 3)  return { label: "Optimal Load",   color: "text-emerald-600", bg: "bg-emerald-500/10", bar: "bg-emerald-500" };
  if (count <= 5)  return { label: "Medium Load",    color: "text-amber-600",   bg: "bg-amber-500/10",   bar: "bg-amber-500"   };
  return                  { label: "Overloaded",      color: "text-rose-600",    bg: "bg-rose-500/10",    bar: "bg-rose-500"    };
}

// ─── Generate avatar initials from a name ────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Priority badge colours ───────────────────────────────────────────────────
const priorityColors: Record<string, string> = {
  High:   "bg-rose-500/10 text-rose-600 border-none",
  Medium: "bg-amber-500/10 text-amber-600 border-none",
  Low:    "bg-emerald-500/10 text-emerald-600 border-none",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AssignManagerPage() {
  const [projects, setProjects]                   = useState<any[]>([]);
  const [managers, setManagers]                   = useState<any[]>([]);
  const [searchQuery, setSearchQuery]             = useState("");
  const [statusFilter, setStatusFilter]           = useState<"All" | "Unassigned" | "Assigned">("All");
  const [selectedProject, setSelectedProject]     = useState<any>(null);
  const [selectedManagerName, setSelectedManagerName] = useState<string>("");
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [isConfirming, setIsConfirming]           = useState(false);
  const [lastAssignedId, setLastAssignedId]       = useState<string | null>(null);

  // ── Load projects & managers from shared localStorage ───────────────────
  const loadData = () => {
    const p = localStorage.getItem("app_projects_persistence");
    const m = localStorage.getItem("app_managers_persistence");
    setProjects(p ? JSON.parse(p) : []);
    setManagers(m ? JSON.parse(m) : []);
  };

  useEffect(() => {
    loadData();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "app_projects_persistence" || e.key === "app_managers_persistence") loadData();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Derive manager stats combining all generated managers + existing project managers
  const derivedManagers = useMemo(() => {
    const nameSet = new Set<string>();
    // First, add all created managers from localStorage
    managers.forEach(m => { if (m.name) nameSet.add(m.name); });
    // Also fallbacks for any existing assigned project managers (just in case they were deleted but still assigned)
    projects.forEach(p => { if (p.manager) nameSet.add(p.manager); });

    return Array.from(nameSet).map(name => {
      const managerProjects = projects.filter(p => p.manager === name);
      const projectCount    = managerProjects.length;
      const totalTasks      = managerProjects.reduce((s, p) => s + (p.totalTasks || 0), 0);
      const workload        = classifyWorkload(projectCount);
      return { name, initials: getInitials(name), projectCount, totalTasks, workload };
    });
  }, [projects, managers]);

  // ── Filtered projects ───────────────────────────────────────────────────
  const filtered = useMemo(() =>
    projects.filter(p => {
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (p.name    ?? "").toLowerCase().includes(q) ||
        (p.manager ?? "").toLowerCase().includes(q) ||
        (p.id      ?? "").toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All"        ? true :
        statusFilter === "Unassigned" ? !p.manager :
        !!p.manager;
      return matchSearch && matchStatus;
    }),
  [projects, searchQuery, statusFilter]);

  const unassignedCount = projects.filter(p => !p.manager).length;

  // ── Open modal ─────────────────────────────────────────────────────────
  const openModal = (project: any) => {
    setSelectedProject(project);
    setSelectedManagerName(project.manager ?? "");
    setLastAssignedId(null);
    setIsModalOpen(true);
  };

  // ── Confirm assignment ──────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!selectedManagerName) return toast.error("Please select a manager before confirming.");
    const mgr = derivedManagers.find(m => m.name === selectedManagerName);
    if (mgr?.workload.label === "Overloaded") {
      toast.warning(`⚠️ ${selectedManagerName} is overloaded. Proceeding with caution.`);
    }
    setIsConfirming(true);
    setTimeout(() => {
      const updated = projects.map(p =>
        p.id === selectedProject.id ? { ...p, manager: selectedManagerName } : p
      );
      localStorage.setItem("app_projects_persistence", JSON.stringify(updated));
      setProjects(updated);
      setLastAssignedId(selectedProject.id);
      setIsModalOpen(false);
      setIsConfirming(false);
      setSelectedManagerName("");
      toast.success(`Manager assigned successfully — "${selectedProject.name}" → ${selectedManagerName}`);
    }, 500);
  };

  const selectedMgrData = derivedManagers.find(m => m.name === selectedManagerName);

  // ── All unique manager names (for modal select list) ──────
  const assignableManagerNames = useMemo(() => {
    const names = new Set<string>();
    managers.forEach(m => { if (m.name) names.add(m.name); });
    projects.forEach(p => { if (p.manager) names.add(p.manager); });
    if (selectedProject?.manager) names.add(selectedProject.manager);
    return Array.from(names);
  }, [managers, projects, selectedProject]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-10">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Manager Assignment</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Assign or reassign managers to projects based on workload and overall efficiency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unassignedCount > 0 && (
            <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[10px] px-3 h-7 rounded-lg animate-pulse">
              {unassignedCount} Unassigned
            </Badge>
          )}
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-8 text-xs" onClick={loadData}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* ── Filter Chips ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", "Unassigned", "Assigned"] as const).map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              statusFilter === f
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                : "border-border/60 text-muted-foreground hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Project List ─────────────────────────────────────────────────── */}
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-secondary/20 py-3 px-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by project name or manager..."
              className="pl-9 h-8 border-none bg-background rounded-lg text-xs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="p-4 rounded-2xl bg-secondary/30">
                <Briefcase className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">
                No projects available for assignment
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                Create a project from the Projects page first.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <XCircle className="h-6 w-6 text-muted-foreground/20" />
              <p className="text-xs text-muted-foreground">No projects match your filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              <AnimatePresence>
                {filtered.map((project, i) => {
                  const isAssigned   = !!project.manager;
                  const mgr          = derivedManagers.find(m => m.name === project.manager);
                  const justAssigned = lastAssignedId === project.id;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 px-5 gap-3 transition-colors ${
                        justAssigned ? "bg-emerald-500/5" : "hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`shrink-0 p-2.5 rounded-xl mt-0.5 transition-transform group-hover:scale-105 shadow-sm ${
                          isAssigned ? "bg-indigo-500/10 text-indigo-600" : "bg-amber-500/10 text-amber-600"
                        }`}>
                          {isAssigned ? <UserCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
                              {project.name}
                            </p>
                            {project.priority && (
                              <Badge className={`text-[7px] font-black border-none px-1.5 h-3.5 uppercase ${priorityColors[project.priority] ?? ""}`}>
                                {project.priority}
                              </Badge>
                            )}
                            <Badge className={`text-[7px] font-black border-none px-1.5 h-3.5 uppercase ${
                              project.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            }`}>
                              {project.status ?? "Pending"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" /> Start: {project.startDate ?? "N/A"}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> Due: {project.deadline ?? "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isAssigned ? (
                              <>
                                <span className="text-[10px] font-bold text-foreground/80">{project.manager}</span>
                                {mgr && (
                                  <span className={`text-[8px] font-black uppercase ${mgr.workload.color}`}>
                                    · {mgr.workload.label}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-500">Unassigned</span>
                            )}
                          </div>

                          <AnimatePresence>
                            {justAssigned && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-[8px] font-bold text-emerald-600 flex items-center gap-1"
                              >
                                <Info className="h-2.5 w-2.5" />
                                Next step: Assign team members and tasks to begin project tracking.
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className={`shrink-0 rounded-xl gap-1.5 font-black uppercase text-[8px] tracking-widest h-8 px-4 transition-all ${
                          isAssigned
                            ? "bg-transparent hover:bg-indigo-500/10 text-indigo-600 border border-indigo-500/25 shadow-none"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 border-none"
                        }`}
                        onClick={() => openModal(project)}
                      >
                        {isAssigned ? "Reassign" : "Assign Manager"}
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Manager Capacity Audit ─────────────────────────────────────────── */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <Users className="absolute top-4 right-4 h-28 w-28" />
        </div>
        <CardHeader className="py-4 px-5 pb-2">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Manager Capacity Audit
          </CardTitle>
          <CardDescription className="text-indigo-100/60 text-[10px]">
            Live workload based on currently assigned projects.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-5 mt-1">
          {derivedManagers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <Users className="h-8 w-8 text-white/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                No manager data available
              </p>
              <p className="text-[9px] text-indigo-200/40">
                Assign managers to projects to see workload here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {derivedManagers.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/8 border border-white/10 rounded-2xl p-3.5 space-y-3 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border border-white/20 shadow">
                        <AvatarFallback className="bg-indigo-800 text-white font-black text-[9px]">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[11px] font-black leading-none">{m.name}</p>
                        <p className="text-[8px] text-indigo-200/60 mt-0.5">Assigned Manager</p>
                      </div>
                    </div>
                    <Badge className={`${m.workload.bg} ${m.workload.color} border-none text-[7px] font-black uppercase px-1.5 h-4 leading-none`}>
                      {m.workload.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white/5 rounded-xl py-2">
                      <p className="text-[7px] text-indigo-200/50 uppercase font-bold tracking-wider">Projects</p>
                      <p className="text-base font-black leading-tight mt-0.5">{m.projectCount}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-2">
                      <p className="text-[7px] text-indigo-200/50 uppercase font-bold tracking-wider">Tasks</p>
                      <p className="text-base font-black leading-tight mt-0.5">{m.totalTasks}</p>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, m.projectCount * 17)}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full rounded-full ${m.workload.bar}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Assign / Reassign Modal ───────────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={v => { setIsModalOpen(v); if (!v) setSelectedManagerName(""); }}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-slate-950">
          <DialogHeader className="bg-indigo-600 p-4 text-white text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <LayoutDashboard className="h-20 w-20" />
            </div>
            <DialogTitle className="text-sm font-black uppercase tracking-widest">
              {selectedProject?.manager ? "Reassign Manager" : "Assign Manager"}
            </DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-[10px] italic leading-relaxed mt-0.5">
              Project: <strong className="text-white">{selectedProject?.name}</strong>
              {selectedProject?.manager && (
                <span className="ml-2 text-indigo-200/60">· Currently: {selectedProject.manager}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3 max-h-[440px] overflow-y-auto">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
              Select a manager ({assignableManagerNames.length} available)
            </p>

            {assignableManagerNames.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Users className="h-8 w-8 mx-auto text-muted-foreground/20" />
                <p className="text-xs font-bold text-muted-foreground">
                  No managers available. Please create a manager first.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignableManagerNames.map(name => {
                  const mData      = derivedManagers.find(m => m.name === name);
                  const isSelected = selectedManagerName === name;
                  const isOverloaded = mData?.workload.label === "Overloaded";

                  return (
                    <motion.div
                      key={name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedManagerName(name)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-inner"
                          : `border-border bg-secondary/10 hover:bg-secondary/20 ${isOverloaded ? "opacity-70" : ""}`
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 border shadow-sm shrink-0">
                          <AvatarFallback className={`font-black text-[9px] uppercase ${
                            isSelected ? "bg-indigo-600 text-white" : "bg-indigo-500/10 text-indigo-700"
                          }`}>
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black truncate">{name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {mData && (
                              <>
                                <Badge className={`${mData.workload.bg} ${mData.workload.color} border-none text-[7px] font-black h-3.5 px-1.5 uppercase leading-none`}>
                                  {mData.workload.label}
                                </Badge>
                                <span className="text-[8px] text-muted-foreground font-semibold">
                                  {mData.projectCount} {mData.projectCount === 1 ? "Project" : "Projects"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isOverloaded && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                        {isSelected ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-600 text-white rounded-full p-0.5 shadow-lg shadow-indigo-600/30">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </motion.div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-border/60 hover:border-indigo-400 transition-colors" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <AnimatePresence>
              {selectedMgrData?.workload.label === "Overloaded" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2 bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-[9px] text-rose-600 font-bold leading-tight">
                    {selectedManagerName} is overloaded with {selectedMgrData.projectCount} active projects.
                    Assignment will proceed but may impact delivery timelines.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-start gap-2 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-[9px] text-indigo-700 dark:text-indigo-300 font-bold leading-tight">
                This assignment will be logged in the system audit trail. The manager will be notified upon confirmation.
              </p>
            </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end border-t border-border/20">
            <Button variant="ghost" className="h-8 px-4 rounded-xl text-[10px] font-bold" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedManagerName || isConfirming}
              className="h-8 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
              onClick={handleConfirm}
            >
              {isConfirming ? "Assigning…" : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

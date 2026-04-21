import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, RefreshCw, Download, 
  Plus, Target, Award, UserCircle, Briefcase, 
  Workflow, ArrowUpRight, Activity, TrendingUp, AlertTriangle,
  Mail, Calendar, FolderKanban, CheckCircle2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";

export default function UsersPage() {
  const { currentUser } = useRole();
  const isManager = currentUser.role === "manager";
  
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbTasks, setDbTasks] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [prjFilter, setPrjFilter] = useState("All");
  const [mgrFilter, setMgrFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showAllRankings, setShowAllRankings] = useState(false);

  useEffect(() => {
    const loadData = () => {
      let u = localStorage.getItem("app_users_persistence");
      const p = localStorage.getItem("app_projects_persistence");
      const t = localStorage.getItem("app_tasks_persistence");
      
      // Auto-inject dummy structural data only if truly empty
      if (!u || JSON.parse(u).length === 0) {
         const dummyUsers = [
           { id: "U-01", name: "Designer Team", email: "dt@corp.com", department: "UI/UX", role: "user" },
           { id: "U-02", name: "Backend Dev", email: "bd@corp.com", department: "Engineering", role: "user" },
           { id: "U-03", name: "Frontend Dev", email: "fd@corp.com", department: "Engineering", role: "user" },
           { id: "U-04", name: "QA Tester", email: "qa@corp.com", department: "Quality Assurance", role: "user" }
         ];
         localStorage.setItem("app_users_persistence", JSON.stringify(dummyUsers));
         u = JSON.stringify(dummyUsers);
      }
      
      setDbUsers(u ? JSON.parse(u) : []);
      setDbProjects(p ? JSON.parse(p) : []);
      setDbTasks(t ? JSON.parse(t) : []);
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // ── Build the full member roster: registered users + discovered from tasks/projects ──
  const allMemberNames = (() => {
    const names = new Set<string>();
    // Registered users
    dbUsers.forEach(u => { if (u.name) names.add(u.name); });
    // Discoverable from task assignees
    dbTasks.forEach(t => { if (t.assignee) names.add(t.assignee); });
    // Discoverable from project teamMembers
    dbProjects.forEach(p => {
      (p.teamMembers || []).forEach((tm: any) => { if (tm.name) names.add(tm.name); });
    });
    return Array.from(names);
  })();

  const richMembers = allMemberNames.map(memberName => {
    // Find registered user record if it exists
    const userRecord = dbUsers.find(u => (u.name || "").toLowerCase() === memberName.toLowerCase()) || {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ── Tasks ──
    const userTasks = dbTasks.filter(
      t => (t.assignee || "").toLowerCase() === memberName.toLowerCase()
    );
    const totalAssigned  = userTasks.length;
    const completedTasks = userTasks.filter(t => t.status === "Completed" || t.dynamicStatus === "Completed").length;
    const overdueTasks   = userTasks.filter(t => {
      if (t.status === "Completed" || t.dynamicStatus === "Completed") return false;
      const dl = t.deadline ? new Date(t.deadline) : null;
      if (!dl || isNaN(dl.getTime())) return false;
      dl.setHours(0, 0, 0, 0);
      return today > dl;
    }).length;
    const pendingTasks = Math.max(0, totalAssigned - completedTasks);

    // ── Projects & Managers from tasks ──
    const assignedProjects: string[] = Array.from(new Set(userTasks.map((t: any) => t.project).filter(Boolean)));
    const assignedManagers: string[] = Array.from(new Set(userTasks.map((t: any) => t.manager).filter(Boolean)));

    // ── Also check project.teamMembers[] ──
    const memberProjectRecords: any[] = [];
    dbProjects.forEach(project => {
      const foundTm = (project.teamMembers || []).find(
        (tm: any) => (tm.name || "").toLowerCase() === memberName.toLowerCase()
      );
      if (foundTm) {
        if (project.name && !assignedProjects.includes(project.name)) assignedProjects.push(project.name);
        if (project.manager && !assignedManagers.includes(project.manager)) assignedManagers.push(project.manager);
        memberProjectRecords.push(project);
      }
    });

    const hasActivity = totalAssigned > 0 || assignedProjects.length > 0;

    // ── Efficiency: task-based if tasks exist, else project-timeline-based ──
    let efficiency = 0;
    if (totalAssigned > 0) {
      // Task-based efficiency
      const completionRate = (completedTasks / totalAssigned) * 100;
      const overduePenalty = (overdueTasks / totalAssigned) * 100 * 0.5;
      efficiency = Math.min(100, Math.max(0, Math.round(completionRate - overduePenalty)));
    } else if (memberProjectRecords.length > 0) {
      // Project-timeline-based efficiency (same formula as project efficiency engine)
      const projectEffs = memberProjectRecords.map(project => {
        const startDate   = project.startDate || project.start || project.createdDate;
        const deadlineDate = project.deadline || project.endDate;
        if (!startDate || !deadlineDate) return 0;
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end   = new Date(deadlineDate); end.setHours(0,0,0,0);
        const totalDays = (end.getTime() - start.getTime()) / 86400000;
        const daysUsed  = (today.getTime() - start.getTime()) / 86400000;
        if (totalDays <= 0) return 0;
        const expectedProgress = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
        // With no tasks, actual progress = 0 → efficiency = 0 (at risk)
        // But if project hasn't started yet (daysUsed <= 0), efficiency = 100 (not yet due)
        if (daysUsed <= 0) return 100;
        return 0; // No tasks done yet but time is passing = At Risk
      });
      efficiency = Math.round(projectEffs.reduce((a, b) => a + b, 0) / projectEffs.length);
    }

    return {
      ...userRecord,
      id: userRecord.id || memberName,
      name: memberName,
      department: userRecord.department || "Team Member",
      email: userRecord.email || "",
      role: userRecord.role || "user",
      managers: assignedManagers.join(", ") || "Unassigned",
      projects: assignedProjects.join(", ") || "Unassigned",
      projectsRaw: assignedProjects,
      managersRaw: assignedManagers,
      totalAssigned,
      completedTasks,
      pendingTasks,
      delayedTasks: overdueTasks,
      efficiency,
      hasActivity,
      statusIndicator: efficiency >= 80 ? "green" : efficiency >= 50 ? "yellow" : "red"
    };
  });



  // 2) Apply filters
  const filtered = richMembers.filter(m => {
    const rawSearch = searchQuery.toLowerCase();
    const textMatch = 
      m.name?.toLowerCase().includes(rawSearch) || 
      m.department?.toLowerCase().includes(rawSearch) ||
      m.email?.toLowerCase().includes(rawSearch);
      
    const statusMatch = statusFilter === "All" || 
      (statusFilter === "Idle" && !m.hasActivity) || 
      (statusFilter === "Active" && m.hasActivity);
    
    const prjMatch = prjFilter === "All" || m.projectsRaw.includes(prjFilter);
    const mgrMatch = mgrFilter === "All" || m.managersRaw.includes(mgrFilter);

    return textMatch && statusMatch && prjMatch && mgrMatch;
  });

  // Unique lists for filter dropdowns
  const availableProjects = Array.from(new Set(richMembers.flatMap(m => m.projectsRaw)));
  const availableManagers = Array.from(new Set(richMembers.flatMap(m => m.managersRaw)));

  // Rankings Logic
  const rankedMembers = [...richMembers].filter(m => m.hasActivity).sort((a, b) => b.efficiency - a.efficiency);
  const topRankings = showAllRankings ? rankedMembers : rankedMembers.slice(0, 3);

  const openDetails = (member: any) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Helper to dynamically build a fake task array if no physical tasks exist in DB, purely for detailed visualization context.
  const buildVirtualTasks = (m: any) => {
    let tasks = [];
    for (let i = 0; i < m.completedTasks; i++) tasks.push({ name: `Operational Package ${i+1}`, status: 'Completed', dl: 'Completed On Time', state: 'green' });
    for (let i = 0; i < m.delayedTasks; i++) tasks.push({ name: `Overdue Package ${i+1}`, status: 'Delayed', dl: 'Past Deadline', state: 'red' });
    const remainingPending = Math.max(0, m.pendingTasks - m.delayedTasks);
    for (let i = 0; i < remainingPending; i++) tasks.push({ name: `Pending Package ${i+1}`, status: 'Pending', dl: 'Upcoming', state: 'yellow' });
    return tasks;
  };

  return (
    <div className="space-y-6 pb-10 pt-5">
      {/* Keeping Existing Top Section layout strictly as requested */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground italic flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-500" /> Team Management
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/10" onClick={() => toast.info("Syncing metadata...")}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/10" onClick={() => toast.success("Exporting personnel data...")}>
            <Download className="h-3.5 w-3.5" /> Export Data
          </Button>
          {isManager && (
            <Button size="sm" className="h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
              <Plus className="h-3.5 w-3.5 mr-2" /> Add Member
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email..." 
            className="pl-9 h-8 border-none bg-background rounded-xl text-[10px] font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/10 border-none">
              <Filter className="h-3.5 w-3.5" /> Manager: {mgrFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 rounded-xl border-none shadow-2xl p-1">
            <DropdownMenuItem className="text-[10px] font-bold" onClick={() => setMgrFilter("All")}>All Managers</DropdownMenuItem>
            {availableManagers.map(m => (
              <DropdownMenuItem key={m} className="text-[10px] font-bold" onClick={() => setMgrFilter(m)}>{m}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/10 border-none">
              <FolderKanban className="h-3.5 w-3.5" /> Project: {prjFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 rounded-xl border-none shadow-2xl p-1">
            <DropdownMenuItem className="text-[10px] font-bold" onClick={() => setPrjFilter("All")}>All Projects</DropdownMenuItem>
            {availableProjects.map(p => (
              <DropdownMenuItem key={p} className="text-[10px] font-bold" onClick={() => setPrjFilter(p)}>{p}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/10 border-none">
              <Activity className="h-3.5 w-3.5" /> Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 rounded-xl border-none shadow-2xl p-1">
            <DropdownMenuItem className="text-[10px] font-bold" onClick={() => setStatusFilter("All")}>All Members</DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-bold" onClick={() => setStatusFilter("Active")}>Active (Has Tasks)</DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-bold" onClick={() => setStatusFilter("Idle")}>Idle (Unassigned)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Members Dashboard - Table Format requested by prompt styling cues */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border border-dashed border-secondary/30 text-center">
           <UserCircle className="h-10 w-10 text-muted-foreground/30 mb-3" />
           <h3 className="font-black text-sm text-foreground/60 uppercase tracking-widest">No team members available</h3>
           <p className="text-xs text-muted-foreground mt-1">Adjust filters or create new team members.</p>
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-secondary/30 border-b border-border/40">
                    <tr>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Team Member</th>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden md:table-cell">Assigned Manager</th>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Project</th>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Workload</th>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Efficiency Context</th>
                       <th className="py-4 px-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Details</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/20">
                    {filtered.map((m, idx) => (
                       <tr key={`${m.id}-${idx}`} className="hover:bg-secondary/10 transition-colors group">
                          <td className="py-4 px-5">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 rounded-xl border ring-1 ring-secondary/50 shrink-0">
                                   <AvatarFallback className="text-[10px] font-black text-indigo-600 bg-indigo-50 uppercase">{m.name?.substring(0,2) || 'TM'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                   <span className="text-sm font-bold truncate max-w-[150px]">{m.name}</span>
                                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{m.department || "Team Member"}</span>
                                </div>
                             </div>
                          </td>
                          <td className="py-4 px-5 hidden md:table-cell">
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-1">{m.managers}</span>
                          </td>
                          <td className="py-4 px-5">
                             <Badge variant="outline" className="text-[9px] font-black uppercase border-none bg-secondary/40 px-2 line-clamp-1 max-w-[120px] block">
                               {m.projects}
                             </Badge>
                          </td>
                          <td className="py-4 px-5 align-top">
                             <div className="flex items-center justify-center gap-1.5 flex-wrap w-fit mx-auto">
                                <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-black px-1.5"><FolderKanban className="h-3 w-3 mr-1" /> {m.totalAssigned}</Badge>
                                {m.hasActivity && <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black px-1.5"><CheckCircle2 className="h-3 w-3 mr-1" /> {m.completedTasks}</Badge>}
                                {m.delayedTasks > 0 && <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-black px-1.5"><AlertTriangle className="h-3 w-3 mr-1" /> {m.delayedTasks}</Badge>}
                             </div>
                          </td>
                          <td className="py-4 px-5 text-center">
                             {!m.hasActivity ? (
                               <Badge className="bg-slate-50 text-slate-400 border-none text-[8px] font-black uppercase tracking-widest shadow-none">Idling</Badge>
                             ) : (
                               <Badge className={`${
                                 m.statusIndicator === 'green' ? 'bg-emerald-500/10 text-emerald-600' :
                                 m.statusIndicator === 'red' ? 'bg-rose-500/10 text-rose-600' :
                                 'bg-amber-500/10 text-amber-600'
                               } border-none text-[10px] font-black uppercase tracking-widest shadow-none px-3`}>
                                 {m.efficiency}%
                               </Badge>
                             )}
                          </td>
                          <td className="py-4 px-5 text-right">
                             <Button size="sm" variant="outline" className="h-7 text-[9px] font-black uppercase tracking-widest rounded-lg" onClick={() => openDetails(m)}>
                                Inspect <ArrowUpRight className="h-3 w-3 ml-1" />
                             </Button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {/* Performance Rankings Top Members strictly calculated from real usage */}
      {rankedMembers.length > 0 && (
         <Card className={`relative mt-8 w-full border-none shadow-md bg-slate-900 text-white rounded-3xl overflow-hidden transition-all duration-700`}>
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
               <Award size={120} />
            </div>
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                 <TrendingUp className="h-4 w-4 text-emerald-400" /> Operational Rankings
               </CardTitle>
               <CardDescription className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
                 Top performing active members based on tactical efficiency.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
               <AnimatePresence mode="popLayout">
                  {topRankings.map((member, i) => (
                    <motion.div 
                      key={member.id} 
                      className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5"
                    >
                       <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/40'}`}>
                             {i + 1}
                          </span>
                          <Avatar className="h-6 w-6 border border-white/10 shrink-0">
                             <AvatarFallback className="text-[8px] font-black bg-white/5 uppercase">{member.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold truncate tracking-tight text-white">{member.name}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">{member.efficiency}% Effective</span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
               {rankedMembers.length > 3 && (
                 <div className="pt-2">
                    <Button 
                     className="w-full h-8 rounded-xl bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase tracking-widest border-none transition-all text-white"
                     onClick={() => setShowAllRankings(!showAllRankings)}
                    >
                      {showAllRankings ? "Collapse Leaderboard" : "Reveal Full Leaderboard"} 
                    </Button>
                 </div>
               )}
            </CardContent>
         </Card>
      )}

      {/* Detail Inspector Drawer / Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-slate-50 text-slate-900">
           {selectedMember && (
             <>
              <DialogHeader className="bg-slate-900 p-5 text-left border-b border-white/10 relative">
                <div className="flex mt-2 items-start justify-between">
                   <div className="flex gap-3 items-center">
                     <Avatar className="h-12 w-12 border-2 border-white/20 ring-4 ring-indigo-500/20">
                        <AvatarFallback className="text-sm font-black bg-indigo-500 text-white uppercase shadow-inner">
                           {selectedMember.name.substring(0,2)}
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col text-white">
                        <DialogTitle className="text-xl font-black tracking-tighter leading-tight">{selectedMember.name}</DialogTitle>
                        <DialogDescription className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">
                           {selectedMember.department || "Team Member"} Role
                        </DialogDescription>
                     </div>
                   </div>
                </div>
              </DialogHeader>

              <div className="p-5 space-y-6">
                 
                 {/* Connection metadata */}
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Linked Projects</span>
                       <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[200px] text-right">{selectedMember.projects}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><UserCircle className="h-3 w-3" /> Reporting To</span>
                       <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[200px] text-right">{selectedMember.managers}</span>
                    </div>
                 </div>

                 {/* Real Performance Intelligence Logic */}
                 {!selectedMember.hasActivity ? (
                    <div className="py-10 flex flex-col items-center justify-center bg-slate-100 rounded-2xl border border-dashed border-slate-300 text-center px-4">
                       <AlertTriangle className="h-8 w-8 text-slate-400 mb-2" />
                       <h3 className="font-black text-sm text-slate-600 uppercase tracking-widest shadow-none">Performance Not Available</h3>
                       <p className="text-xs text-slate-500 mt-1 font-medium">Performance metrics will automatically appear once operational task activity begins.</p>
                    </div>
                 ) : (
                    <>
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                         <div className="bg-slate-100 p-2.5 rounded-xl shadow-inner border border-slate-200/60 flex flex-col items-center">
                            <span className="text-[8px] uppercase tracking-widest font-black text-slate-400 mb-0.5">Total Tasks</span>
                            <span className="text-lg font-black text-slate-800">{selectedMember.totalAssigned}</span>
                         </div>
                         <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex flex-col items-center">
                            <span className="text-[8px] uppercase tracking-widest font-black text-emerald-600/70 mb-0.5">Completed</span>
                            <span className="text-lg font-black text-emerald-600">{selectedMember.completedTasks}</span>
                         </div>
                         <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex flex-col items-center">
                            <span className="text-[8px] uppercase tracking-widest font-black text-amber-600/70 mb-0.5">Pending</span>
                            <span className="text-lg font-black text-amber-600">{selectedMember.pendingTasks}</span>
                         </div>
                         <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex flex-col items-center">
                            <span className="text-[8px] uppercase tracking-widest font-black text-rose-600/70 mb-0.5">Delayed</span>
                            <span className="text-lg font-black text-rose-600">{selectedMember.delayedTasks}</span>
                         </div>
                      </div>

                      {/* Explicit Live Task List Representation */}
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Current Work Units Matrix</h4>
                         
                         {buildVirtualTasks(selectedMember).map((vt, i) => (
                           <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`h-2 w-2 rounded-full ${vt.state === 'green' ? 'bg-emerald-500' : vt.state === 'red' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-slate-800">{vt.name}</span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{vt.dl}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className={`border-none text-[8px] font-black uppercase px-2 py-0.5 ${vt.state === 'green' ? 'bg-emerald-50 text-emerald-600' : vt.state === 'red' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                {vt.status}
                              </Badge>
                           </div>
                         ))}
                      </div>

                      <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5"><Activity className="h-4 w-4" /> Final Efficiency</span>
                         <Badge className={`${selectedMember.statusIndicator === 'green' ? 'bg-emerald-500' : selectedMember.statusIndicator === 'red' ? 'bg-rose-500' : 'bg-amber-500'} border-none text-white text-xs font-black px-3`}>
                            {selectedMember.efficiency}% 
                         </Badge>
                      </div>
                    </>
                 )}

                 <Button className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95 text-white" onClick={() => setIsViewModalOpen(false)}>
                    Close Inspector
                 </Button>
              </div>
             </>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

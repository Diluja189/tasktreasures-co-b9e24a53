import { useState, useEffect, useMemo } from "react";
import { 
  UserPlus, Mail, Shield, Plus, Search, Filter,
  MoreVertical, Trash2, FolderPlus, X, CheckCircle2,
  Clock, Briefcase, UserCheck, AlertCircle, RefreshCw,
  Fingerprint, BriefcaseIcon, AtSign, History, Eye, Upload, FileText, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  personalEmail: string;
  workEmail: string;
  role: string;
  status: "Invited" | "Active";
  managerId: string;
  assignedProjectId: string;
  projects: string[];
}

export default function TeamAssignmentPage() {
  const { currentUser } = useRole();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMemberForUpload, setSelectedMemberForUpload] = useState<TeamMember | null>(null);
  const [uploadData, setUploadData] = useState({ name: "", file: null as File | null });
  
  // New Member Form State
  const [formData, setFormData] = useState({
    memberId: `TM-${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    personalEmail: "",
    workEmail: "",
    projectId: "",
    role: ""
  });

  // Load Data
  useEffect(() => {
    const loadData = () => {
      const savedMembers = localStorage.getItem("app_users_persistence");
      setMembers(savedMembers ? JSON.parse(savedMembers) : []);
      
      const savedProjects = localStorage.getItem("app_projects_persistence");
      const parsedProjects = savedProjects ? JSON.parse(savedProjects) : [];
      setAllProjects(parsedProjects);
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [currentUser.id]);

  // Filter projects assigned to this manager by the Admin
  const managerProjects = useMemo(() => {
    return allProjects.filter(p => {
      if (!p.manager || !currentUser.name) return false;
      return p.manager.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
    });
  }, [allProjects, currentUser.name]);

  const saveMembers = (updated: TeamMember[]) => {
    setMembers(updated);
    localStorage.setItem("app_users_persistence", JSON.stringify(updated));
    // Trigger event for other components in same tab
    window.dispatchEvent(new Event("storage"));
  };

  const handleCreateAndAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.personalEmail || !formData.projectId || !formData.role) {
      return toast.error("Missing critical data. Project and Role selection required.");
    }

    const member: TeamMember = {
      id: formData.memberId,
      name: formData.name,
      personalEmail: formData.personalEmail,
      workEmail: formData.workEmail || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: formData.role,
      status: "Invited",
      managerId: currentUser.id,
      assignedProjectId: formData.projectId,
      projects: [formData.projectId]
    };

    const updated = [...members, member];
    saveMembers(updated);
    
    toast.success(`${member.name} registered and assigned.`, {
      description: `Status: Invited | Project: ${allProjects.find(p => p.id === formData.projectId)?.name}`
    });

    setIsAddModalOpen(false);
    setFormData({
      memberId: `TM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      personalEmail: "",
      workEmail: "",
      projectId: "",
      role: ""
    });
  };

  const handleRemoveMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    saveMembers(updated);
    toast.success("Assignment records purged.");
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !selectedMemberForUpload) return toast.error("Deployment block missing.");

    const newDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: selectedMemberForUpload.assignedProjectId,
      name: uploadData.name || uploadData.file.name,
      fileName: uploadData.file.name,
      uploadedBy: "Manager",
      uploaderName: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB`,
      linkedToMember: selectedMemberForUpload.name
    };

    const savedDocs = JSON.parse(localStorage.getItem("app_documents_persistence") || "[]");
    localStorage.setItem("app_documents_persistence", JSON.stringify([newDoc, ...savedDocs]));
    
    toast.success("Project workflow asset uploaded.", {
      description: `Asset linked to ${selectedMemberForUpload.name} in project repository.`
    });
    
    setIsUploadModalOpen(false);
    setSelectedMemberForUpload(null);
    setUploadData({ name: "", file: null });
  };

  const filteredMembers = members.filter(m => 
    m.managerId === currentUser.id &&
    (statusFilter === "All" || m.status === statusFilter) &&
    (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     m.personalEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-10 pt-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-600" /> Team Assignment
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Direct recruitment and project allocation terminal.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="h-9 w-[130px] rounded-xl border-border bg-white shadow-sm font-bold text-xs uppercase tracking-tight">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="All" className="text-xs font-bold">All Status</SelectItem>
              <SelectItem value="Active" className="text-xs font-bold text-emerald-600">Active</SelectItem>
              <SelectItem value="Invited" className="text-xs font-bold text-amber-600">Waiting</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 rounded-xl border-border bg-white shadow-sm font-bold text-xs gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black text-xs uppercase tracking-widest gap-2 border-none">
                <Plus className="h-4 w-4" /> Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <DialogHeader className="bg-indigo-600 p-5 text-white text-left">
                <DialogTitle className="text-lg font-black tracking-tight">Add Team Member</DialogTitle>
                <DialogDescription className="text-indigo-100/70 text-xs mt-0.5">Register and assign a new member.</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateAndAssign} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-0.5">Member ID</Label>
                    <Input 
                      disabled
                      value={formData.memberId}
                      className="rounded-lg border-none bg-secondary/15 h-8 font-mono font-bold pl-3 text-indigo-700/70 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Member Name <span className="text-rose-500">*</span></Label>
                    <Input 
                      placeholder="e.g. John Doe" 
                      className="rounded-xl border-border/40 bg-secondary/10 h-9 font-medium text-sm"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Personal Email <span className="text-rose-500">*</span></Label>
                    <Input 
                      type="email"
                      placeholder="john.d@email.com" 
                      className="rounded-xl border-border/40 bg-secondary/10 h-9 font-medium pl-3 text-sm"
                      value={formData.personalEmail}
                      onChange={e => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Work Email</Label>
                    <Input 
                      type="email"
                      placeholder="j.doe@company.com" 
                      className="rounded-xl border-border/40 bg-secondary/10 h-9 font-medium pl-3 text-sm"
                      value={formData.workEmail}
                      onChange={e => setFormData(prev => ({ ...prev, workEmail: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Project <span className="text-rose-500">*</span></Label>
                    <Select value={formData.projectId} onValueChange={v => setFormData(prev => ({ ...prev, projectId: v }))}>
                      <SelectTrigger className="rounded-xl border-border/40 bg-secondary/10 h-9 font-medium text-sm">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]">
                        {allProjects.length > 0 ? (
                          allProjects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-xl py-2 cursor-pointer font-bold text-xs">
                              <div className="flex flex-col">
                                <span>{p.name} <span className="opacity-40 text-[9px]">({p.id})</span></span>
                                <span className="text-[8px] font-medium text-muted-foreground">Deadline: {p.deadline || 'N/A'}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-[10px] font-bold text-muted-foreground italic">No projects exist in the global ledger</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-0.5">Role <span className="text-rose-500">*</span></Label>
                    <Select 
                      disabled={!formData.projectId} 
                      value={formData.role} 
                      onValueChange={v => setFormData(prev => ({ ...prev, role: v }))}
                    >
                      <SelectTrigger className="rounded-xl border-border/40 bg-secondary/10 h-9 font-medium text-sm disabled:opacity-50">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="Designer" className="rounded-xl py-2 font-bold text-xs">Designer</SelectItem>
                        <SelectItem value="Backend Developer" className="rounded-xl py-2 font-bold text-xs">Backend Developer</SelectItem>
                        <SelectItem value="Frontend Developer" className="rounded-xl py-2 font-bold text-xs">Frontend Developer</SelectItem>
                        <SelectItem value="QA Tester" className="rounded-xl py-2 font-bold text-xs">QA Tester</SelectItem>
                        <SelectItem value="Other" className="rounded-xl py-2 font-bold text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.projectId && (() => {
                    const project = allProjects.find(p => p.id === formData.projectId);
                    if (!project) return null;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-2 bg-slate-900 rounded-xl overflow-hidden shadow-lg"
                      >
                        <div className="bg-indigo-600 px-3 py-1.5 flex justify-between items-center">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-white tracking-widest">{project.name}</span>
                              <span className="text-[7.5px] font-bold text-white/40 uppercase">{project.id}</span>
                           </div>
                           <div className="flex gap-1">
                              <Badge className="bg-white/10 text-white border-none text-[7px] px-1 h-3 font-black uppercase tracking-tighter">Active</Badge>
                              <Badge className="bg-amber-400 text-slate-900 border-none text-[7px] px-1 h-3 font-black uppercase tracking-tighter">PRI: {project.priority || 'High'}</Badge>
                           </div>
                        </div>
                        <div className="px-3 py-1.5 space-y-2">
                           <div className="grid grid-cols-3 gap-2 py-1 border-y border-white/5">
                              <div className="flex flex-col">
                                 <span className="text-[5.5px] font-black uppercase text-indigo-300">Start</span>
                                 <p className="text-[8px] font-black text-white leading-none">{project.startDate || '2026-01-12'}</p>
                              </div>
                              <div className="flex flex-col px-1 border-x border-white/5 text-center">
                                 <span className="text-[5.5px] font-black uppercase text-indigo-300">Deadline</span>
                                 <p className="text-[8px] font-black text-rose-400 leading-none">{project.deadline || '2026-07-23'}</p>
                              </div>
                              <div className="flex flex-col pl-1 text-right">
                                 <span className="text-[5.5px] font-black uppercase text-indigo-300">Source</span>
                                 <p className="text-[8px] font-black text-white leading-none">Super Admin</p>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
                
                <div className="pt-3">
                  <Button type="submit" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 h-10 shadow-lg shadow-indigo-600/20 font-black text-[10px] uppercase tracking-[0.1em] border-none transition-all active:scale-95">
                    Create & Assign Member
                  </Button>
                  <Button type="button" variant="ghost" className="w-full mt-1.5 rounded-xl h-8 font-bold text-[9px] uppercase tracking-widest text-muted-foreground" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Line */}
      <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-2xl border border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10 h-10 border-none bg-transparent rounded-xl text-xs font-bold"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-border/40 mx-1" />
        <Badge variant="outline" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase border-none bg-white shadow-sm">
           Active Personnel: {filteredMembers.length}
        </Badge>
      </div>

      {/* Main List view */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed text-center shadow-sm">
            <UserPlus className="h-12 w-12 text-slate-200 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Personnel Log Empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-border/40 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-border/40">
                <tr>
                  <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">Project</th>
                  <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                  <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredMembers.map((member) => {
                  const pObj = allProjects.find(p => p.id === member.assignedProjectId) || { name: member.assignedProjectId, id: member.assignedProjectId };
                  return (
                    <motion.tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs uppercase italic">
                            {member.name.substring(0,2)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold tracking-tight text-slate-900">{member.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 mt-0.5">{member.personalEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                         <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none rounded-lg text-[9px] font-black uppercase tracking-widest shadow-none">
                            {member.role}
                         </Badge>
                      </td>
                      <td className="py-5 px-6">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-700">{pObj.name}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase font-mono">{pObj.id}</span>
                         </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                         <Badge className={`text-[8px] font-black uppercase px-2.5 h-5 rounded-full border-none shadow-none ${member.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {member.status}
                         </Badge>
                      </td>
                      <td className="py-5 px-6 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <MoreVertical className="h-4 w-4 text-slate-400" />
                               </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 w-48 bg-white">
                               {member.status.toLowerCase() === "invited" ? (
                                 <>
                                   <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                      <p className="text-[9px] font-black uppercase text-amber-600 tracking-[0.2em]">Pending Join</p>
                                   </div>
                                   <DropdownMenuItem className="rounded-xl gap-2 py-3 cursor-pointer font-black text-[10px] uppercase tracking-widest text-emerald-600 focus:bg-emerald-50" onClick={() => toast.success(`Deployment credentials resent to ${member.personalEmail}`)}>
                                      <RefreshCw className="h-4 w-4" /> Resend Invite
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator className="bg-border/30 my-1" />
                                   <DropdownMenuItem 
                                     className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs text-rose-600 focus:bg-rose-50"
                                     onClick={() => handleRemoveMember(member.id)}
                                   >
                                      <Trash2 className="h-3.5 w-3.5" /> Remove Member
                                   </DropdownMenuItem>
                                 </>
                               ) : (
                                 <>
                                   <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-[0.2em]">Tactical Actions</p>
                                   </div>
                                   <DropdownMenuItem className="rounded-xl gap-2 py-3 cursor-pointer font-black text-[10px] uppercase tracking-widest text-slate-700 focus:bg-slate-50" onClick={() => toast.info(`Accessing ${member.name}'s tactical profile...`)}>
                                      <Eye className="h-4 w-4" /> View Detail
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="rounded-xl gap-2 py-3 cursor-pointer font-black text-[10px] uppercase tracking-widest text-indigo-600 focus:bg-indigo-50" onClick={() => {
                                     setSelectedMemberForUpload(member);
                                     setIsUploadModalOpen(true);
                                   }}>
                                      <Upload className="h-4 w-4" /> Upload Document
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator className="bg-border/30 my-1" />
                                   <DropdownMenuItem 
                                     className="rounded-xl gap-2 py-2 cursor-pointer font-bold text-xs text-rose-600 focus:bg-rose-50"
                                     onClick={() => handleRemoveMember(member.id)}
                                   >
                                      <Trash2 className="h-3.5 w-3.5" /> Remove Member
                                   </DropdownMenuItem>
                                 </>
                               )}
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 bg-indigo-600 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Upload size={120} />
            </div>
            <DialogTitle className="text-xl font-bold flex items-center gap-3"><Upload className="h-5 w-5" /> Ingest Workflow Asset</DialogTitle>
            <DialogDescription className="text-indigo-100/70 font-medium mt-1">
              Upload project workflow or technical assets for {selectedMemberForUpload?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadDoc} className="p-8 space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="docNameAssignment" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Document Label</Label>
                  <Input 
                    id="docNameAssignment" 
                    placeholder="e.g. Project Workflow - Phase 1" 
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-sm focus-visible:ring-indigo-600/20"
                    value={uploadData.name}
                    onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Source File</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all hover:bg-slate-50 hover:border-indigo-300 group cursor-pointer relative overflow-hidden text-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={e => setUploadData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    />
                    <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors mx-auto mb-3">
                       <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">{uploadData.file ? uploadData.file.name : "Select workflow asset"}</p>
                  </div>
               </div>
            </div>
            <DialogFooter className="pt-2">
               <Button type="button" variant="ghost" className="h-12 font-bold text-xs uppercase rounded-xl" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
               <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 rounded-xl font-black text-xs uppercase border-none transition-all active:scale-95">Upload Asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

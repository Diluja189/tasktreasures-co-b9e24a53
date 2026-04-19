import { useState, useEffect } from "react";
import { 
  Plus, Search, Filter, RefreshCw, MoreVertical, 
  FolderKanban, Star, TrendingUp, 
  Mail, Shield, Edit2, Trash2, ArrowUpRight,
  Target, Award, FileText, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useRole } from "@/contexts/RoleContext";

const dummyManagers = [];

export default function ManagersPage() {
  const { currentUser } = useRole();
  const isAdmin = currentUser.role === "admin";
  const [managers, setManagers] = useState<any[]>(() => {
    const saved = localStorage.getItem("app_managers_persistence");
    return saved ? JSON.parse(saved) : dummyManagers;
  });

  useEffect(() => {
    localStorage.setItem("app_managers_persistence", JSON.stringify(managers));
  }, [managers]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showAllRankings, setShowAllRankings] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [newManager, setNewManager] = useState({ 
    id: "", 
    name: "", 
    workEmail: "",
    personalEmail: "",
    phone: "", 
    designation: "", 
    status: "Active" 
  });

  const filtered = managers.filter(m => 
    (m.name ?? "").toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );

  const leaderboardData = [...managers].sort((a, b) => b.score - a.score);
  const displayedRankings = showAllRankings ? leaderboardData : leaderboardData.slice(0, 2);

  const handleSaveManager = () => {
    if (!newManager.name || !newManager.workEmail || !newManager.id) return toast.error("Please fill required fields");
    
    if (isEditing) {
      setManagers(prev => prev.map(m => m.id === newManager.id ? { 
        ...m, 
        ...newManager, 
        name: newManager.name,
        email: newManager.workEmail,
        specialty: newManager.designation 
      } : m));
      toast.success("Manager details updated successfully");
    } else {
      const mgrToAdd = {
        ...newManager,
        avatar: newManager.name.split(" ").map(n => n[0]).join(""),
        projects: 0,
        score: 100, // New managers start with peak potential
        specialty: newManager.designation || "Department Head",
        email: newManager.workEmail
      };
      setManagers(prev => [mgrToAdd, ...prev]);
      toast.success(`Manager ${newManager.name} registered and invite sent!`);
    }

    setIsAddModalOpen(false);
    setIsEditing(false);
    setNewManager({ id: "", name: "", workEmail: "", personalEmail: "", phone: "", designation: "", status: "Active" });
  };

  const handleReview = (manager: any) => {
    setSelectedManager(manager);
    setIsReviewOpen(true);
  };

  const handleEditInitiate = () => {
    setNewManager({
      id: selectedManager.id,
      name: selectedManager.name,
      workEmail: selectedManager.email || selectedManager.workEmail || "",
      personalEmail: selectedManager.personalEmail || "",
      phone: selectedManager.phone || "",
      designation: selectedManager.specialty || selectedManager.designation || "",
      status: selectedManager.status || "Active"
    });
    setIsEditing(true);
    setIsReviewOpen(false);
    setIsAddModalOpen(true);
  };

  const handleStatusToggle = () => {
    const nextStatus = selectedManager.status === "Active" ? "Inactive" : "Active";
    setManagers(prev => prev.map(m => m.id === selectedManager.id ? { ...m, status: nextStatus } : m));
    toast.success(`Manager ${selectedManager.name} is now ${nextStatus}`);
    setIsReviewOpen(false);
  };

  return (
    <div className="space-y-6 pb-10 pt-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black tracking-tight text-foreground italic">
             Manager Management
           </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px] gap-2 border-none bg-secondary/10" onClick={() => toast.info("Syncing inventory...")}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
           </Button>
           {isAdmin && (
             <Button 
              size="sm" 
              className="h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              onClick={() => {
                  setIsEditing(false);
                  setNewManager({ id: `MGR-${Math.floor(1000 + Math.random() * 9000)}`, name: "", workEmail: "", personalEmail: "", phone: "", designation: "", status: "Active" });
                  setIsAddModalOpen(true);
               }}
             >
                <Plus className="h-3.5 w-3.5" /> Create Manager
             </Button>
           )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-2xl border shadow-sm">
         <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input 
              placeholder="Find leaders..." 
              className="pl-9 h-8 border-none bg-background rounded-xl text-[10px] font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button variant="secondary" className="h-8 rounded-xl px-4 gap-2 flex-1 lg:flex-none text-[10px] font-black uppercase tracking-widest">
               <Filter className="h-3 w-3" /> Filters
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         <AnimatePresence>
            {filtered.map((manager, i) => (
              <motion.div 
                key={manager.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                 <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm group hover:shadow-md hover:ring-1 ring-primary/10 transition-all rounded-2xl overflow-hidden relative">
                    <div className="p-3 pb-0 flex items-start justify-between">
                       <div className="flex items-center gap-2.5">
                          <div className="relative">
                             <Avatar className="h-10 w-10 border shadow-sm ring-1 ring-secondary">
                                <AvatarFallback className="bg-indigo-500/10 text-indigo-700 font-black text-[10px] uppercase truncate">{manager.avatar}</AvatarFallback>
                             </Avatar>
                             <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${manager.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          </div>
                          <div className="min-w-0">
                             <CardTitle className="text-xs font-black truncate text-foreground/90 leading-tight" title={manager.name}>{manager.name}</CardTitle>
                             <p className="text-[9px] font-bold text-muted-foreground/60 flex items-center gap-1 uppercase tracking-wider truncate">
                                <Target className="h-2 w-2" /> {manager.specialty}
                             </p>
                          </div>
                       </div>
                       
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-secondary shrink-0">
                                <MoreVertical className="h-3 w-3 text-muted-foreground" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl border-none shadow-2xl p-1">
                             {manager.status === "Invited" && (
                               <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold text-indigo-500" onClick={() => toast.success(`Invitation resent to ${manager.email}`)}>
                                 <RefreshCw className="h-3 w-3" /> Resend Invite
                               </DropdownMenuItem>
                             )}
                             <DropdownMenuSeparator className="opacity-50" />
                             <DropdownMenuItem
                                className="gap-2 rounded-lg py-1.5 text-[10px] font-bold text-rose-500 cursor-pointer focus:bg-rose-500/10"
                                onClick={() => {
                                  setManagers(prev => prev.filter(m => m.id !== manager.id));
                                  toast.success(`Manager "${manager.name}" removed.`);
                                }}
                              >
                                <Trash2 className="h-3 w-3" /> Remove
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>

                    <div className="p-3 space-y-3">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/50 truncate">
                             <Mail className="h-2.5 w-2.5 shrink-0" /> {manager.email}
                          </div>
                          <Badge className={`${manager.status === 'Delayed' ? 'bg-rose-500/10 text-rose-600' : (manager.status === 'Peak Load' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600')} text-[7px] h-3.5 px-1.5 font-black uppercase leading-none border-none py-0`}>
                             {manager.status}
                          </Badge>
                       </div>

                       <Button 
                        variant="secondary" 
                        className="w-full h-7 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 border-none transition-all active:scale-95"
                        onClick={() => handleReview(manager)}
                       >
                          Review <ArrowUpRight className="h-3 w-3" />
                       </Button>
                    </div>
                 </Card>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>


      {/* Add Manager Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <DialogHeader className="bg-indigo-600 p-5 text-left">
            <DialogTitle className="text-xl font-black tracking-tight">{isEditing ? "Edit Manager" : "Add Manager"}</DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-[11px] italic">
               {isEditing ? "Update account details for high-level management." : "Register and invite new management personnel to the platform."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Manager ID</Label>
                    <Input 
                      value={newManager.id}
                      disabled
                      className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold opacity-60 cursor-not-allowed"
                    />
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Designation</Label>
                   <Input 
                     placeholder="E.g. Senior Lead" 
                     value={newManager.designation}
                     onChange={e => setNewManager(p => ({ ...p, designation: e.target.value }))}
                     className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus-visible:ring-indigo-500/30"
                   />
                </div>
             </div>
             
             <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</Label>
                <Input 
                  placeholder="Enter manager name..." 
                  value={newManager.name}
                  onChange={e => setNewManager(p => ({ ...p, name: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus-visible:ring-indigo-500/30"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Work Email</Label>
                   <Input 
                     type="email"
                     placeholder="work@org.com" 
                     value={newManager.workEmail}
                     onChange={e => setNewManager(p => ({ ...p, workEmail: e.target.value }))}
                     className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus-visible:ring-indigo-500/30"
                   />
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Personal Email</Label>
                   <Input 
                     type="email"
                     placeholder="personal@mail.com" 
                     value={newManager.personalEmail}
                     onChange={e => setNewManager(p => ({ ...p, personalEmail: e.target.value }))}
                     className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus-visible:ring-indigo-500/30"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Phone Number</Label>
                   <Input 
                     placeholder="+1 234 567 890" 
                     value={newManager.phone}
                     onChange={e => setNewManager(p => ({ ...p, phone: e.target.value }))}
                     className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus-visible:ring-indigo-500/30"
                   />
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Account Status</Label>
                   <Select value={newManager.status} onValueChange={v => setNewManager(p => ({ ...p, status: v }))}>
                      <SelectTrigger className="h-8 rounded-xl border-white/10 bg-white/5 text-xs font-bold focus:ring-indigo-500/30">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10 text-white rounded-xl shadow-2xl">
                         <SelectItem value="Active" className="text-xs">Active</SelectItem>
                         <SelectItem value="Inactive" className="text-xs">Inactive</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>
          </div>

          <DialogFooter className="p-6 pt-0 flex gap-3 justify-end bg-slate-900/50">
             <Button variant="ghost" className="h-9 px-6 rounded-xl text-xs font-bold text-white/60 hover:text-white" onClick={() => { setIsAddModalOpen(false); setIsEditing(false); }}>Cancel</Button>
             <Button className="h-9 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 border-none transition-all active:scale-95" onClick={handleSaveManager}>
                {isEditing ? "Save Changes" : "Send Invite"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Review Manager Modal */}
      {/* View/Review Manager Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-3xl border-none shadow-2xl p-0 bg-slate-900 text-white">
          <DialogHeader className="bg-emerald-600 p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight uppercase">Manager Details</DialogTitle>
                <DialogDescription className="text-emerald-100/70 text-[10px] italic leading-none">Strategic profile for {selectedManager?.name}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-5 space-y-5">
             {/* Section 1: Core Identity (Wide Layout) */}
             <div className="grid grid-cols-3 gap-y-4 gap-x-6">
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Manager ID</p>
                   <p className="text-xs font-bold text-white/90">{selectedManager?.id || "N/A"}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Full Name</p>
                   <p className="text-xs font-bold text-white/90">{selectedManager?.name}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Account Status</p>
                   <Badge className={`${selectedManager?.status === 'Delayed' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} border-none text-[7px] h-3.5 px-1.5 uppercase font-black`}>
                      {selectedManager?.status || 'Active'}
                   </Badge>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Designation</p>
                   <p className="text-xs font-bold text-emerald-400">{selectedManager?.specialty || "Senior Lead"}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Work Email</p>
                   <p className="text-xs font-bold text-white/70 truncate">{selectedManager?.email || selectedManager?.workEmail || "N/A"}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Phone Number</p>
                   <p className="text-xs font-bold text-white/70">{selectedManager?.phone || "+1 234 567 890"}</p>
                </div>
             </div>

             {/* Section 2: Account Info (Horizontal Layout) */}
             <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-wider">Invite Status</p>
                      <p className="text-[10px] font-bold text-white/80">Activated</p>
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-wider">Created Date</p>
                      <p className="text-[10px] font-bold text-white/80">Jan 12, 2026</p>
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-wider">Created By</p>
                      <p className="text-[10px] font-bold text-indigo-400">Super Admin</p>
                   </div>
                </div>
             </div>


          </div>

          <DialogFooter className="p-4 bg-slate-900/50 flex">
             <Button className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95" onClick={() => setIsReviewOpen(false)}>
                Confirm
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

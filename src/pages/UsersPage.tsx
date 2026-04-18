import { useState } from "react";
import { 
  Users, Plus, Search, Filter, Mail, Calendar, Shield, UserCircle, RefreshCw, Download,
  Activity, Award, Star, TrendingUp, MoreVertical, Edit2, Trash2, ArrowUpRight,
  FolderKanban, Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
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

const initialMembers = [
  { id: "1", name: "Sarah Chen", role: "user", email: "sarah.c@tasktreasure.co", department: "UI/UX Design", status: "Active", efficiency: "94", tasks: 12, joined: "Jan 2023", avatar: "SC" },
  { id: "2", name: "Mike Jones", role: "user", email: "mike.j@tasktreasure.co", department: "Backend", status: "Active", efficiency: "91", tasks: 15, joined: "Feb 2023", avatar: "MJ" },
  { id: "3", name: "James Wilson", role: "user", email: "james.w@tasktreasure.co", department: "Engineering", status: "Invited", efficiency: "0", tasks: 0, joined: "Apr 2024", avatar: "JW" },
];

const roleLabels: Record<string, { label: string, color: string, bg: string }> = {
  admin: { label: "Administrator", color: "text-rose-600", bg: "bg-rose-500/10" },
  manager: { label: "Project Manager", color: "text-indigo-600", bg: "bg-indigo-500/10" },
  user: { label: "Team Member", color: "text-emerald-600", bg: "bg-emerald-500/10" },
};

export default function UsersPage() {
  const { currentUser } = useRole();
  const isManager = currentUser.role === "manager";
  const [members, setMembers] = useState(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showAllRankings, setShowAllRankings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", department: "" });

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || m.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const leaderboardData = [...members].sort((a, b) => Number(b.efficiency) - Number(a.efficiency));
  const displayedRankings = showAllRankings ? leaderboardData : leaderboardData.slice(0, 2);

  const handleAddMember = () => {
    if (!newUser.name || !newUser.email) return toast.error("Please fill required fields");
    const id = Date.now().toString();
    const joined = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const member = { 
      ...newUser, 
      id, 
      role: "user", 
      status: "Invited", 
      efficiency: "0", 
      tasks: 0, 
      joined, 
      avatar: newUser.name.split(" ").map(n => n[0]).join("").toUpperCase() 
    };
    setMembers([member, ...members]);
    toast.success(`Invitation sent to ${newUser.email}`);
    setIsAddModalOpen(false);
    setNewUser({ name: "", email: "", department: "" });
  };

  const handleUpdateMember = () => {
    setMembers(members.map(m => m.id === selectedUser.id ? selectedUser : m));
    toast.success("Profile updated successfully");
    setIsEditModalOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Member removed from workspace");
  };

  const handleAction = (type: string, member: any) => {
    setSelectedUser(member);
    if (type === 'view') setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
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
            <Button 
              size="sm" 
              className="h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Add Member
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-card/50 backdrop-blur-sm p-3 rounded-2xl border shadow-sm">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search name, dept or email..." 
            className="pl-9 h-8 border-none bg-background rounded-xl text-[10px] font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/10 border-none">
                <Filter className="h-3.5 w-3.5" /> Filter: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border-none shadow-2xl p-1">
              <DropdownMenuItem className="text-[10px] font-bold rounded-lg" onClick={() => setStatusFilter("All")}>All Members</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-bold rounded-lg" onClick={() => setStatusFilter("Active")}>Active Only</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-bold rounded-lg" onClick={() => setStatusFilter("Invited")}>Invited Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm group hover:shadow-md hover:ring-1 ring-primary/10 transition-all rounded-2xl overflow-hidden relative">
                <div className="p-3 pb-0 flex items-start justify-between">
                   <div className="flex items-center gap-2.5">
                      <div className="relative">
                         <Avatar className="h-10 w-10 border shadow-sm ring-1 ring-secondary">
                            <AvatarFallback className={`${roleLabels[member.role].bg} ${roleLabels[member.role].color} text-[10px] font-black uppercase truncate`}>
                               {member.avatar}
                            </AvatarFallback>
                         </Avatar>
                         <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${member.status === 'Invited' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                      </div>
                      <div className="min-w-0">
                         <CardTitle className="text-xs font-black truncate text-foreground/90 leading-tight" title={member.name}>{member.name}</CardTitle>
                         <p className="text-[9px] font-black text-muted-foreground flex items-center gap-1 uppercase tracking-wider truncate">
                            <UserCircle className="h-2 w-2 text-indigo-500" /> {member.department}
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
                         {member.status === "Invited" && (
                            <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold text-indigo-500" onClick={() => toast.success(`Invitation resent to ${member.email}`)}><RefreshCw className="h-3 w-3" /> Resend Invite</DropdownMenuItem>
                         )}
                         <DropdownMenuSeparator className="opacity-50" />
                         <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold text-rose-500" onClick={() => handleDeleteMember(member.id)}><Trash2 className="h-3 w-3" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>

                <div className="p-3 space-y-3">
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-secondary/20 p-2 rounded-xl border border-secondary/10 flex flex-col items-center">
                         <span className="text-[8px] uppercase font-black text-muted-foreground/40 mb-1">Efficiency</span>
                         <div className="flex items-center gap-1">
                            <Activity className="h-2.5 w-2.5 text-indigo-500" />
                            <span className="text-xs font-black">{member.efficiency}%</span>
                         </div>
                      </div>
                      <div className="bg-secondary/20 p-2 rounded-xl border border-secondary/10 flex flex-col items-center">
                         <span className="text-[8px] uppercase font-black text-muted-foreground/40 mb-1">Loads</span>
                         <div className="flex items-center gap-1">
                            <FolderKanban className="h-2.5 w-2.5 text-emerald-500" />
                            <span className="text-xs font-black">{member.tasks}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                         <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Profile Metadata</p>
                         <Badge className={`${member.status === 'Invited' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'} text-[7px] h-3.5 px-1.5 font-black uppercase leading-none border-none py-0`}>
                            {member.status}
                         </Badge>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/80 truncate">
                            <Mail className="h-2.5 w-2.5 shrink-0" /> {member.email}
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/80">
                            <Target className="h-2.5 w-2.5 shrink-0" /> {member.department}
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/80">
                            <Calendar className="h-2.5 w-2.5 shrink-0" /> Joined {member.joined}
                         </div>
                      </div>
                   </div>

                   <Button 
                    variant="secondary" 
                    className="w-full h-7 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 border-none transition-all active:scale-95"
                    onClick={() => handleAction('view', member)}
                   >
                      View <ArrowUpRight className="h-3 w-3" />
                   </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8">
         <Card className={`w-full max-w-[1000px] mx-auto border-none shadow-md bg-slate-900 text-white rounded-3xl overflow-hidden relative border border-white/5 transition-all duration-700 ${showAllRankings ? 'max-w-full' : ''}`}>
            <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
               <TrendingUp size={120} />
            </div>
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-tight">Performance Rankings</CardTitle>
               <CardDescription className="text-indigo-100/50 text-[9px] italic">Automated personnel ranking based on real-time efficiency metrics.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
               <AnimatePresence mode="popLayout">
                  {displayedRankings.map((member, i) => (
                    <motion.div 
                      key={member.id} 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-1.5 bg-white/5 rounded-xl border border-white/5"
                    >
                       <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ${i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : 'bg-white/10 text-white/40'}`}>
                             {i + 1}
                          </span>
                          <Avatar className="h-5 w-5 border border-white/10 shrink-0">
                             <AvatarFallback className="text-[7px] font-black bg-white/5">{member.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-[9px] font-bold truncate max-w-[200px]">{member.name}</span>
                          <Badge variant="outline" className="text-[7px] text-white/70 bg-white/10 h-3.5 px-1.5 uppercase font-black border border-white/5">{member.department}</Badge>
                       </div>
                       <Badge variant="outline" className="text-[8px] font-black border-none bg-emerald-500/20 text-emerald-100 uppercase tracking-widest px-1 h-3.5 leading-none">{member.efficiency}%</Badge>
                    </motion.div>
                  ))}
               </AnimatePresence>
               <div className="pt-2">
                  <Button 
                   className="w-full h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest gap-2 border-none shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-white"
                   onClick={() => setShowAllRankings(!showAllRankings)}
                  >
                    {showAllRankings ? "Collapse Leaderboard" : "View Full Leaderboard"} 
                    <TrendingUp className={`h-3 w-3 text-emerald-400 transition-transform ${showAllRankings ? 'rotate-180' : ''}`} />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[340px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <DialogHeader className="bg-indigo-600 p-4 text-left">
            <DialogTitle className="text-base font-bold tracking-tight">Onboard Member</DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-[10px] italic">Register new team capacity.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Full Name</Label>
                <Input 
                  placeholder="Enter name..." 
                  value={newUser.name}
                  onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Email Address</Label>
                <Input 
                  type="email"
                  placeholder="member@org.com" 
                  value={newUser.email}
                  onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Department</Label>
                <Input 
                  placeholder="E.g. Backend" 
                  value={newUser.department}
                  onChange={e => setNewUser(p => ({ ...p, department: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end">
             <Button variant="ghost" className="h-8 px-4 rounded-xl text-[10px] font-bold text-white/60 hover:text-white" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
             <Button className="h-8 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 border-none" onClick={handleAddMember}>
                Send Invitation
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[340px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <DialogHeader className="bg-emerald-600 p-4 text-left">
            <DialogTitle className="text-base font-black tracking-tight uppercase">Performance Report</DialogTitle>
            <DialogDescription className="text-emerald-100/70 text-[10px] italic">Tactical performance audit for {selectedUser?.name}.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                   <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-emerald-400" />
                   </div>
                   <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/40 leading-none mb-0.5">Efficiency</p>
                      <p className="text-xs font-black text-emerald-400">{selectedUser?.efficiency}%</p>
                   </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                   <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-indigo-400" />
                   </div>
                   <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/40 leading-none mb-0.5">Loads</p>
                      <p className="text-xs font-black text-indigo-400">{selectedUser?.tasks}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Profile Metadata</p>
                   <Badge className="text-[7px] h-3.5 bg-emerald-500/20 text-emerald-400 border-none px-1 uppercase font-black">{selectedUser?.status}</Badge>
                </div>
                <div className="space-y-2">
                   <div className="flex items-start gap-2">
                       <Mail className="h-3 w-3 text-white/40 mt-0.5 shrink-0" />
                       <span className="text-[10px] font-medium text-white/70">{selectedUser?.email}</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <UserCircle className="h-3 w-3 text-white/40 mt-0.5 shrink-0" />
                       <span className="text-[10px] font-medium text-white/70">{selectedUser?.department}</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <Calendar className="h-3 w-3 text-white/40 mt-0.5 shrink-0" />
                       <span className="text-[10px] font-medium text-white/70">Joined {selectedUser?.joined}</span>
                   </div>
                </div>
             </div>
          </div>

          <DialogFooter className="p-4 pt-0">
             <Button className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95" onClick={() => setIsViewModalOpen(false)}>
                Close
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { 
  Plus, Search, Filter, RefreshCw, MoreVertical, 
  FolderKanban, Star, TrendingUp, 
  Mail, Shield, Edit2, Trash2, ArrowUpRight,
  Target, Award
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const initialManagers = [
  { id: "M1", name: "Sarah Chen", email: "sarah@company.com", projects: 4, score: 94, status: "Active", specialty: "Agile / Scrum", avatar: "SC" },
  { id: "M2", name: "David Kim", email: "david@company.com", projects: 2, score: 88, status: "Peak Load", specialty: "Infrastructure", avatar: "DK" },
  { id: "M3", name: "Lisa Wang", email: "lisa@company.com", projects: 3, score: 91, status: "Active", specialty: "Product Design", avatar: "LW" },
  { id: "M4", name: "John Miller", email: "john@company.com", projects: 5, score: 82, status: "Delayed", specialty: "Frontend", avatar: "JM" },
];

export default function ManagersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showAllRankings, setShowAllRankings] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [newManager, setNewManager] = useState({ name: "", email: "", specialty: "" });

  const filtered = initialManagers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const leaderboardData = [...initialManagers].sort((a, b) => b.score - a.score);
  const displayedRankings = showAllRankings ? leaderboardData : leaderboardData.slice(0, 2);

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email) return toast.error("Please fill required fields");
    toast.success(`Manager "${newManager.name}" added to leadership pool`);
    setIsAddModalOpen(false);
    setNewManager({ name: "", email: "", specialty: "" });
  };

  const handleReview = (manager: any) => {
    setSelectedManager(manager);
    setIsReviewOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
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
           <Button 
            size="sm" 
            className="h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            onClick={() => setIsAddModalOpen(true)}
           >
              <Plus className="h-3.5 w-3.5" /> Add Leader
           </Button>
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
                             <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold"><Edit2 className="h-3 w-3" /> Edit Profile</DropdownMenuItem>
                             <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold"><Shield className="h-3 w-3" /> Access</DropdownMenuItem>
                             <DropdownMenuSeparator className="opacity-50" />
                             <DropdownMenuItem className="gap-2 rounded-lg py-1.5 text-[10px] font-bold text-rose-500"><Trash2 className="h-3 w-3" /> Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>

                    <div className="p-3 space-y-3">
                       <div className="grid grid-cols-2 gap-2">
                          <div className="bg-secondary/20 p-2 rounded-xl border border-secondary/10 flex flex-col items-center">
                             <span className="text-[8px] uppercase font-black text-muted-foreground/40 leading-none mb-1">Projects</span>
                             <div className="flex items-center gap-1">
                                <FolderKanban className="h-2.5 w-2.5 text-indigo-500" />
                                <span className="text-xs font-black">{manager.projects}</span>
                             </div>
                          </div>
                          <div className="bg-secondary/20 p-2 rounded-xl border border-secondary/10 flex flex-col items-center">
                             <span className="text-[8px] uppercase font-black text-muted-foreground/40 leading-none mb-1">Score</span>
                             <div className="flex items-center gap-1">
                                <Award className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-xs font-black">{manager.score}%</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-1 pt-1 border-t border-border/5">
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

      <div className="mt-8">
         <Card className={`w-full max-w-[1000px] mx-auto border-none shadow-md bg-slate-900 text-white rounded-3xl overflow-hidden relative border border-white/5 transition-all duration-700 ${showAllRankings ? 'max-w-full' : ''}`}>
            <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
               <TrendingUp size={120} />
            </div>
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-tight">Performance Rankings</CardTitle>
               <CardDescription className="text-indigo-100/50 text-[9px] italic">Strategic excellence leaderboard.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
               <AnimatePresence mode="popLayout">
                  {displayedRankings.map((manager, i) => (
                    <motion.div 
                      key={manager.id} 
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
                             <AvatarFallback className="text-[7px] font-black bg-white/5">{manager.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-[9px] font-bold truncate max-w-[120px]">{manager.name}</span>
                       </div>
                       <Badge variant="outline" className="text-[8px] font-black border-none bg-emerald-500/20 text-emerald-100 uppercase tracking-widest px-1 h-3.5 leading-none">{manager.score}%</Badge>
                    </motion.div>
                  ))}
               </AnimatePresence>
               <div className="pt-2">
                  <Button 
                   className="w-full h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest gap-2 border-none shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-white"
                   onClick={() => setShowAllRankings(!showAllRankings)}
                  >
                    {showAllRankings ? "Collapse Rankings" : "View Full Leaderboard"} 
                    <TrendingUp className={`h-3 w-3 text-emerald-400 transition-transform ${showAllRankings ? 'rotate-180' : ''}`} />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Add Manager Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[340px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <DialogHeader className="bg-indigo-600 p-4 text-left">
            <DialogTitle className="text-base font-bold tracking-tight">Leader Onboarding</DialogTitle>
            <DialogDescription className="text-indigo-100/70 text-[10px] italic">Register new leadership capacity.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Full Name</Label>
                <Input 
                  placeholder="Enter name..." 
                  value={newManager.name}
                  onChange={e => setNewManager(p => ({ ...p, name: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Email Address</Label>
                <Input 
                  type="email"
                  placeholder="manager@org.com" 
                  value={newManager.email}
                  onChange={e => setNewManager(p => ({ ...p, email: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
             <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/40">Specialty</Label>
                <Input 
                  placeholder="E.g. Product Design" 
                  value={newManager.specialty}
                  onChange={e => setNewManager(p => ({ ...p, specialty: e.target.value }))}
                  className="h-8 rounded-xl border-white/10 bg-white/5 text-[10px] font-bold focus-visible:ring-indigo-500/30"
                />
             </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2 justify-end">
             <Button variant="ghost" className="h-8 px-4 rounded-xl text-[10px] font-bold text-white/60 hover:text-white" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
             <Button className="h-8 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 border-none" onClick={handleAddManager}>
                Confirm addition
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Manager Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[340px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <DialogHeader className="bg-emerald-600 p-4 text-left">
            <DialogTitle className="text-base font-black tracking-tight uppercase">Leader Review</DialogTitle>
            <DialogDescription className="text-emerald-100/70 text-[10px] italic">Operational audit for {selectedManager?.name}.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                   <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Award className="h-4 w-4 text-emerald-400" />
                   </div>
                   <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/40 leading-none mb-0.5">Efficiency</p>
                      <p className="text-xs font-black text-emerald-400">{selectedManager?.score}%</p>
                   </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                   <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-indigo-400" />
                   </div>
                   <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/40 leading-none mb-0.5">Projects</p>
                      <p className="text-xs font-black text-indigo-400">{selectedManager?.projects}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Profile Metadata</p>
                   <Badge className="text-[7px] h-3.5 bg-emerald-500/20 text-emerald-400 border-none px-1 uppercase font-black">{selectedManager?.status}</Badge>
                </div>
                <div className="space-y-2">
                   <div className="flex items-start gap-2">
                       <Mail className="h-3 w-3 text-white/40 mt-0.5 shrink-0" />
                       <span className="text-[10px] font-medium text-white/70">{selectedManager?.email}</span>
                   </div>
                   <div className="flex items-start gap-2">
                       <Target className="h-3 w-3 text-white/40 mt-0.5 shrink-0" />
                       <span className="text-[10px] font-medium text-white/70">{selectedManager?.specialty}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-1.5 container-indicator">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Strategic Notes</p>
                <div className="text-[10px] leading-relaxed text-indigo-100/70 italic bg-indigo-500/5 p-2 rounded-lg border-l-2 border-emerald-500/30">
                   {selectedManager?.name} is maintaining peak velocity with zero critical blockers. Recommended for high-priority stream expansion.
                </div>
             </div>
          </div>

          <DialogFooter className="p-4 pt-0">
             <Button className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest border-none transition-all active:scale-95" onClick={() => { toast.success("Review finalized."); setIsReviewOpen(false); }}>
                Approve Audit
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

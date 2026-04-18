import { useState } from "react";
import { 
  Search, Calendar, User, 
  FolderKanban, CheckSquare, Users, 
  Clock, ArrowRight, Activity, Zap, ListFilter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const logs = [
  { id: 1, user: "Admin", action: "created", type: "Project", target: "Cloud Migration Phase 2", time: "2h ago", timestamp: "2024-04-18T08:00:00Z" },
  { id: 2, user: "Sarah Chen", action: "assigned", type: "Manager", target: "Mobile App v2", time: "4h ago", timestamp: "2024-04-18T06:00:00Z" },
  { id: 3, user: "Mike Jones", action: "completed", type: "Task", target: "DB schema audit", time: "6h ago", timestamp: "2024-04-18T04:00:00Z" },
  { id: 4, user: "System", action: "updated", type: "Status", target: "SaaS Redesign Deadline", time: "1d ago", timestamp: "2024-04-17T12:00:00Z" },
  { id: 5, user: "Admin", action: "revoked", type: "Access", target: "Contractor ID-442", time: "2d ago", timestamp: "2024-04-16T15:00:00Z" },
  { id: 6, user: "David Kim", action: "changed", type: "Role", target: "Project Lead → Engineering", time: "3d ago", timestamp: "2024-04-15T10:00:00Z" },
  { id: 7, user: "Sarah Chen", action: "updated", type: "Timeline", target: "Mobile App Q2 Launch", time: "3d ago", timestamp: "2024-04-15T09:00:00Z" },
  { id: 8, user: "Admin", action: "modified", type: "Permissions", target: "Analytics Module", time: "4d ago", timestamp: "2024-04-14T14:00:00Z" },
];

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'project': return FolderKanban;
    case 'task': return CheckSquare;
    case 'manager':
    case 'user':
    case 'role': return Users;
    case 'permissions':
    case 'access': return Zap;
    default: return Activity;
  }
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "All") return matchesSearch;
    return matchesSearch && log.type.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const filters = ["All", "Project", "Task", "User", "Access"];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Activity className="h-5 w-5 text-white" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">
                Activity Ledger
             </h1>
          </div>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-50">
            Immutable trace of system-wide operations
          </p>
        </div>

        <div className="flex items-center gap-2 bg-secondary/10 p-1 rounded-2xl border border-secondary/5 backdrop-blur-md">
           {filters.map(filter => (
             <Button
               key={filter}
               variant="ghost"
               onClick={() => setActiveFilter(filter)}
               className={`h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeFilter === filter 
                   ? "bg-foreground text-background shadow-md" 
                   : "text-muted-foreground hover:bg-secondary/20"
               }`}
             >
               {filter}
             </Button>
           ))}
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="relative max-w-md">
         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
         <Input 
            placeholder="Search by user, action, target..." 
            className="pl-10 h-10 border-none bg-secondary/10 rounded-2xl text-[11px] font-bold focus-visible:ring-indigo-500/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      {/* Timeline Section */}
      <div className="relative">
         {/* Background Decoration */}
         <div className="absolute -right-20 top-20 opacity-[0.03] pointer-events-none rotate-45 scale-150">
            <ListFilter size={400} />
         </div>

         <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <ScrollArea className="h-[600px]">
               <div className="p-5 space-y-3 relative">
                  {/* Timeline Vertical Line */}
                  <div className="absolute left-[45px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent" />

                  <AnimatePresence mode="popLayout">
                    {filteredLogs.map((log, i) => {
                      const Icon = getIcon(log.type);
                      return (
                        <motion.div 
                          key={log.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: i * 0.02 }}
                          className="relative flex items-center gap-6 group"
                        >
                           {/* Log Timestamp (Left Side) - Smaller Width */}
                           <div className="w-14 hidden md:block text-right">
                              <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                                 {log.time}
                              </p>
                           </div>

                           {/* Icon Node - Smaller */}
                           <div className="relative z-10 h-10 w-10 rounded-xl bg-background border-2 shadow-sm flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-6 group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10">
                              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                           </div>
                           
                           {/* Content Section - Smaller Padding/Rounding */}
                           <div className="flex-1 min-w-0 bg-white/[0.02] p-3 rounded-2xl border border-transparent transition-all group-hover:border-white/5 group-hover:bg-white/5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                 <div className="pt-0.5">
                                    <p className="text-[10px] leading-relaxed tracking-tight">
                                       <span className="font-black text-foreground uppercase tracking-[0.05em]">{log.user}</span>
                                       {" "}
                                       <span className="font-semibold text-muted-foreground/60">{log.action}</span>
                                       {" "}
                                       <span className="font-black text-indigo-500/70 lowercase tracking-widest">{log.type}</span>
                                    </p>
                                    <h3 className="text-sm font-black tracking-tighter mt-0.5 text-foreground/90 group-hover:text-indigo-500 transition-colors">
                                       {log.target}
                                    </h3>
                                 </div>
                                 
                                 <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                    <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                                       <ArrowRight className="h-4 w-4" />
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="mt-2 flex items-center gap-3 md:hidden">
                                 <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="h-2.5 w-2.5" /> {log.time}
                                 </span>
                              </div>
                           </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {filteredLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                       <div className="h-20 w-20 rounded-[2.5rem] bg-secondary/5 flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-[2.5rem] border-2 border-indigo-500/10 animate-ping opacity-10" />
                          <Activity className="h-8 w-8 text-muted-foreground/20" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="font-black text-lg uppercase tracking-widest text-foreground/80">No Records Found</h3>
                          <p className="text-xs text-muted-foreground font-semibold max-w-xs mx-auto">The audit trail is currently empty for the selected filters.</p>
                       </div>
                    </div>
                  )}
               </div>
            </ScrollArea>
         </div>
      </div>
    </div>
  );
}

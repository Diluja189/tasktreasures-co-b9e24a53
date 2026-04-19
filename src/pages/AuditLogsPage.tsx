import { useState, useMemo } from "react";
import { 
  Search, FolderKanban, CheckSquare, Users, 
  Activity, Zap, History, Filter, ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const logs = [];

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

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === "All") return matchesSearch;
      return matchesSearch && log.type.toLowerCase().includes(activeFilter.toLowerCase());
    });
  }, [searchQuery, activeFilter]);

  const filters = ["All", "Project", "Task", "User", "Access"];

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-10 px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
          <History className="h-8 w-8 text-indigo-500" />
          Activity History
        </h1>
        <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest pl-11">
          Detailed transparency of system operations
        </p>
      </div>

      {/* Utility Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search by user, action or target..." 
            className="pl-10 h-11 bg-white/[0.02] border-white/5 rounded-xl text-xs font-bold focus:bg-white/[0.04] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/5">
          {filters.map(filter => (
            <Button
              key={filter}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`h-9 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? "bg-white/[0.05] text-indigo-500" 
                  : "text-muted-foreground/50 hover:text-foreground"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Feed Container */}
      <div className="bg-white/[0.01] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <ScrollArea className="h-[600px]">
          <div className="p-6 relative">
            {/* Continuous Timeline Line */}
            <div className="absolute left-[47px] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, i) => {
                  const Icon = getIcon(log.type);
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="group relative flex items-start gap-6 p-4 rounded-2xl transition-all hover:bg-white/[0.02]"
                    >
                      {/* Icon Section */}
                      <div className="relative z-10 shrink-0 mt-1">
                        <div className="h-6 w-6 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-lg transition-all group-hover:border-indigo-500/50 group-hover:scale-110">
                          <Icon className="h-3 w-3 text-muted-foreground group-hover:text-indigo-500" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-foreground/90 uppercase tracking-tight">{log.user}</span>
                              <span className="text-[10px] font-bold text-muted-foreground/40">{log.action}</span>
                            </div>
                            <h3 className="text-sm font-black text-foreground/80 group-hover:text-indigo-400 transition-colors">
                              {log.target}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter h-5 border-white/5 bg-white/[0.02]">
                              {log.type}
                            </Badge>
                            <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                              <History className="h-3 w-3 text-muted-foreground/20" />
                              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{log.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Indicator (Subtle) */}
                      <div className="mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-3 w-3 text-indigo-500/50" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredLogs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40">
                  <div className="h-16 w-16 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center mb-6">
                    <History className="h-6 w-6 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">No History Found</h3>
                  <p className="text-[10px] font-bold text-muted-foreground/30 mt-2">Adjust your filters to see more results</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

import { useState } from "react";
import { 
  FileText, Search, Filter, Calendar, 
  User, RefreshCw, Download, ArrowUpRight,
  ShieldCheck, History, Activity, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const logs = [
  { id: 1, user: "Admin (Strategic)", action: "Created project", target: "Cloud Migration Phase 2", timestamp: "2025-07-01 14:32:10", type: "project", severity: "Low" },
  { id: 2, user: "Admin (Strategic)", action: "Assigned manager", target: "Sarah Chen → Mobile App v2", timestamp: "2025-07-01 13:15:45", type: "assignment", severity: "Medium" },
  { id: 3, user: "Sarah Chen", action: "Approved task", target: "DB schema audit", timestamp: "2025-07-01 12:08:22", type: "task", severity: "Low" },
  { id: 4, user: "System", action: "Deadline modification", target: "SaaS Redesign → Aug 15", timestamp: "2025-07-01 11:45:00", type: "system", severity: "High" },
  { id: 5, user: "Admin (Strategic)", action: "Revoked access", target: "Contractor ID-442", timestamp: "2025-06-30 16:20:33", type: "security", severity: "High" },
  { id: 6, user: "David Kim", action: "Resigned leadership", target: "Legacy Infrastructure", timestamp: "2025-06-30 15:10:18", type: "assignment", severity: "Medium" },
];

const typeStyles = {
  project: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  assignment: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  task: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  system: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  security: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
             Enterprise Audit Records
           </h1>
           <p className="text-muted-foreground mt-1">Immutable traceability of all strategic data modifications.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Audit trail synchronized.")}>
              <RefreshCw className="h-4 w-4" /> Refresh Trail
           </Button>
           <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold border-none px-6">
              Export Audit PDF <Download className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search historical records..." 
              className="pl-10 h-10 border-none bg-background rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select defaultValue="all">
               <SelectTrigger className="h-10 rounded-xl border-none bg-background min-w-[150px]">
                  <SelectValue placeholder="Action Type" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl shadow-xl p-1.5 border-none">
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="project">Project Changes</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="security">Security Events</SelectItem>
               </SelectContent>
            </Select>
            <Button variant="secondary" className="h-10 rounded-xl px-4 gap-2 flex-grow lg:flex-none">
               <Filter className="h-4 w-4" /> Advanced Filter
            </Button>
         </div>
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border/50 pb-6 flex flex-row items-center justify-between">
           <div>
              <CardTitle className="text-lg font-bold">Activity Chronology</CardTitle>
              <CardDescription>Comprehensive ledger of enterprise-wide state changes.</CardDescription>
           </div>
           <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px] px-3">PROTECTED LOGS</Badge>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-border/30">
              <AnimatePresence>
                 {logs.map((log, i) => (
                   <motion.div 
                     key={log.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="p-6 hover:bg-secondary/5 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                   >
                      <div className="flex items-start gap-4 flex-1">
                         <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${typeStyles[log.type as keyof typeof typeStyles]}`}>
                            {log.type === 'project' && <Database className="h-5 w-5" />}
                            {log.type === 'assignment' && <User className="h-5 w-5" />}
                            {log.type === 'security' && <ShieldCheck className="h-5 w-5" />}
                            {log.type === 'system' && <History className="h-5 w-5" />}
                            {log.type === 'task' && <Activity className="h-5 w-5" />}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 flex-wrap">
                               <p className="text-sm font-bold tracking-tight">{log.user}</p>
                               <p className="text-sm text-muted-foreground">{log.action}</p>
                               <Badge className={`${log.severity === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-secondary text-muted-foreground'} border-none text-[8px] font-black h-4 px-1 px-1.5`}>{log.severity} RISK</Badge>
                            </div>
                            <p className="text-xs font-bold text-indigo-600 mt-0.5">{log.target}</p>
                         </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2 text-right">
                         <Badge variant="outline" className={`text-[10px] font-bold uppercase ${typeStyles[log.type as keyof typeof typeStyles]}`}>
                            {log.type} Record
                         </Badge>
                         <p className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {log.timestamp}</p>
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <History size={60} />
            </div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Storage Policy</p>
            <p className="text-lg font-bold mt-2 italic">90-Day Retention</p>
         </Card>
         <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl p-6 border-dashed border-2 flex flex-col justify-center">
            <p className="text-xs font-bold text-muted-foreground uppercase">Compliance Grade</p>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-2xl font-bold">A+</span>
               <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[9px]">SECURE</Badge>
            </div>
         </Card>
      </div>
    </div>
  );
}

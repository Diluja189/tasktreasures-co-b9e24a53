import { useState } from "react";
import { 
  BarChart3, Calendar, Clock, Filter, Search, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  LayoutDashboard, MoreVertical, RefreshCw, Eye,
  LayoutGrid, List, Activity, GanttChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const monitoredProjects = [
  { id: "M1", name: "Cloud Migration", manager: "Sarah Chen", progress: 65, status: "On-Time", priority: "High", timeline: "Jan - Apr", risk: "Low" },
  { id: "M2", name: "SaaS Dashboard Redesign", manager: "David Kim", progress: 42, status: "Delayed", priority: "Medium", timeline: "Feb - Jun", risk: "High" },
  { id: "M3", name: "Mobile App v2.0", manager: "Unassigned", progress: 0, status: "In Setup", priority: "High", timeline: "Mar - Sep", risk: "None" },
  { id: "M4", name: "Security Infrastructure", manager: "Lisa Wang", progress: 88, status: "In Progress", priority: "High", timeline: "Jan - May", risk: "Low" },
  { id: "M5", name: "Legacy System Audit", manager: "Sarah Chen", progress: 95, status: "On-Time", priority: "Low", timeline: "Jan - Mar", risk: "None" },
];

const statusStyles = {
  "On-Time": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "In Progress": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "Delayed": "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse",
  "In Setup": "bg-secondary/50 text-muted-foreground border-border/50",
};

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"detail" | "timeline">("detail");

  const filtered = monitoredProjects.filter(p => 
    (statusFilter === "All" || p.status === statusFilter) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic">
             Operational Insights (Active Monitoring)
           </h1>
           <p className="text-muted-foreground mt-1">Real-time oversight of project health and timeline dependencies.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Syncing monitor data...")}>
              <RefreshCw className="h-4 w-4" /> Live Refresh
           </Button>
           <div className="flex bg-secondary/50 p-1 rounded-xl h-10">
              <Button variant={viewMode === 'detail' ? 'default' : 'ghost'} size="sm" className="h-8 rounded-lg" onClick={() => setViewMode('detail')}>
                 <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'timeline' ? 'default' : 'ghost'} size="sm" className="h-8 rounded-lg" onClick={() => setViewMode('timeline')}>
                 <GanttChart className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search active monitor..." 
              className="pl-10 h-10 border-none bg-background rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full lg:w-48">
                  <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl shadow-2xl border-none p-1.5">
                  <SelectItem value="All">All Projects</SelectItem>
                  <SelectItem value="On-Time">On-Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
               </SelectContent>
            </Select>
            <Button variant="secondary" className="h-10 rounded-xl px-4 gap-2 flex-1 lg:flex-none">
               <Filter className="h-4 w-4" /> Filters
            </Button>
         </div>
      </div>

      {/* Risk Alert Header */}
      <AnimatePresence>
        {monitoredProjects.some(p => p.risk === 'High') && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4 text-rose-600 mb-8 overflow-hidden relative"
           >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <AlertTriangle size={120} />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 animate-pulse">
                 <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <p className="text-lg font-bold">Strategic Alert: Operational Variance Detected</p>
                 <p className="text-sm font-medium opacity-80">2 Active projects are currently 12%+ behind scheduled completion parameters.</p>
              </div>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 shadow-lg shadow-rose-600/20 font-bold border-none transition-all active:scale-95">
                 Analyze All Risks
              </Button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {filtered.map((project, i) => (
           <motion.div 
             key={project.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
           >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden relative">
                 {project.risk === 'High' && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-rose-500" />
                 )}
                 <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                       <Badge variant="outline" className={`text-[10px] rounded-full uppercase tracking-tighter ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                          {project.status === 'Delayed' ? <AlertTriangle className="h-2.5 w-2.5 mr-1" /> : (project.status === 'On-Time' ? <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> : <Clock className="h-2.5 w-2.5 mr-1" />)}
                          {project.status}
                       </Badge>
                       <div className="flex items-center gap-2">
                          {project.risk === 'High' && <Badge className="bg-rose-600 text-white border-none font-bold text-[9px] px-2 py-0.5 animate-bounce">HIGH RISK</Badge>}
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                             <MoreVertical className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                       <LayoutDashboard className="h-3 w-3" /> Managed by <span className="text-foreground font-bold">{project.manager}</span>
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                       <span className="flex items-center gap-2"><TrendingUp className="h-3 w-3 text-emerald-500" /> Completion Score</span>
                       <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className={`h-2.5 rounded-full overflow-hidden ${project.progress > 80 ? '[&>div]:bg-emerald-500' : (project.status === 'Delayed' ? '[&>div]:bg-rose-500' : '[&>div]:bg-indigo-600')}`} />
                    
                    <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-2xl border border-secondary/20">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Timeline Scope</p>
                          <p className="text-xs font-bold italic flex items-center gap-2"><Calendar className="h-3 w-3" /> {project.timeline}</p>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Priority</p>
                          <Badge variant="outline" className={`bg-white border-none shadow-sm text-[9px] font-bold ${project.priority === 'High' ? 'text-rose-600' : 'text-indigo-600'}`}>{project.priority} Scope</Badge>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                       <Button size="sm" className="flex-1 h-10 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 font-bold transition-all border-none">
                          <Eye className="h-4 w-4" /> Deep Audit
                       </Button>
                       <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl gap-2 font-bold hover:bg-emerald-500/10 hover:text-emerald-600 border-none bg-emerald-500/5 transition-all">
                          <BarChart3 className="h-4 w-4" /> View Analytics
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
         ))}
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { 
  BarChart3, Download, FileText, TrendingUp, Users, Calendar, 
  UserCircle, RefreshCw, Activity, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Filter, Search, FileDown, LineChart as LineChartIcon,
  X, Briefcase, LayoutDashboard, Zap, Target, Clock, Star, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";

// Standard mock projects (matching ProjectsPage)
const projectsList = [
  { id: "PRJ-001", name: "E-Commerce Platform", manager: "Sarah Chen", deadline: "2025-07-15", status: "Active" },
  { id: "PRJ-002", name: "Mobile App v3.0", manager: "Sarah Chen", deadline: "2025-08-01", status: "Delayed" },
  { id: "PRJ-003", name: "Analytics Dashboard", manager: "Lisa Wang", deadline: "2025-08-15", status: "Active" },
  { id: "PRJ-004", name: "Security Audit", manager: "David Kim", deadline: "2025-06-15", status: "Completed" },
];

// DATA FROM PERFORMANCE PAGE (Global Mode)
const globalEfficiencyData = [
  { name: "Week 1", actual: 85, estimated: 90 },
  { name: "Week 2", actual: 92, estimated: 88 },
  { name: "Week 3", actual: 78, estimated: 82 },
  { name: "Week 4", actual: 94, estimated: 90 },
];

const globalTeamData = [
  { name: "Engineering", value: 94, color: "#6366f1" },
  { name: "Design", value: 88, color: "#10b981" },
  { name: "Marketing", value: 76, color: "#f59e0b" },
  { name: "Ops", value: 82, color: "#f43f5e" },
];

const globalStats = [
  { label: "Organization Efficiency", value: "88.4%", trend: "+2.4%", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Resource Utilization", value: "92.1%", trend: "+1.8%", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { label: "SLA Compliance", value: "96.8%", trend: "-0.5%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Idle Capacity", value: "11.6%", trend: "-1.2%", icon: Clock, color: "text-rose-500", bg: "bg-rose-500/10" },
];

// DATA FOR PROJECT MODE (Mocked)
const projectTimelineData = [
  { name: "Mon", efficiency: 82 },
  { name: "Tue", efficiency: 88 },
  { name: "Wed", efficiency: 85 },
  { name: "Thu", efficiency: 91 },
  { name: "Fri", efficiency: 94 },
];

const projectRiskData = [
  { name: "Resource Gap", value: 25, color: "#6366f1" },
  { name: "Tech Challenges", value: 75, color: "#f43f5e" },
];

const projectResourceData = [
  { name: "Developers", efficiency: 94, onTime: 92 },
  { name: "Designers", efficiency: 86, onTime: 80 },
  { name: "QA", efficiency: 98, onTime: 100 },
];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  
  const selectedProject = useMemo(() => {
    return projectsList.find(p => p.id === projectId);
  }, [projectId]);

  const isProjectMode = !!selectedProject;

  const handleClearFilter = () => {
    setSearchParams({});
  };

  const projectStats = [
    { label: "Completion Rate", value: "65.0%", trend: "+5.2%", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "On-Time Delivery", value: "82.4%", trend: "+2.1%", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Project Hours", value: "320h", trend: "+40h", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Team Efficiency", value: "91.2%", trend: "+3.4%", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const currentStats = isProjectMode ? projectStats : globalStats;

  return (
    <div className="space-y-8 pb-10 px-4 pt-4">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-bold tracking-tight text-foreground">
               {isProjectMode ? "Project Report" : "Performance Analytics"}
             </h1>
             {isProjectMode && (
               <Badge className="bg-indigo-600/10 text-indigo-600 border-none px-2.5 rounded-lg font-bold text-[10px]">
                 FILTERED VIEW
               </Badge>
             )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isProjectMode 
              ? `Operational metrics for project: ${selectedProject.name}`
              : "Organization-wide performance insights and throughput analysis."
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           {isProjectMode && (
             <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={handleClearFilter}>
                <X className="h-4 w-4" /> Clear Filter
             </Button>
           )}
           <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 transition-all hover:bg-secondary/50" onClick={() => toast.info("Data refreshed.")}>
              <RefreshCw className="h-4 w-4" /> Refresh
           </Button>
           <Button size="sm" className="h-9 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold active:scale-95 transition-all">
              <FileDown className="h-4 w-4" /> Export Report
           </Button>
        </div>
      </div>

      {/* Mode Switches & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-xl w-fit border border-secondary/50">
          <Button 
            variant={!isProjectMode ? "secondary" : "ghost"} 
            size="sm" 
            className={`h-8 text-[10px] uppercase font-black tracking-widest rounded-lg gap-1.5 px-4 ${!isProjectMode ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-muted-foreground'}`}
            onClick={() => navigate("/reports")}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Global View
          </Button>
          <Button 
            variant={isProjectMode ? "secondary" : "ghost"} 
            size="sm" 
            disabled={!isProjectMode}
            className={`h-8 text-[10px] uppercase font-black tracking-widest rounded-lg gap-1.5 px-4 ${isProjectMode ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-muted-foreground/40'}`}
          >
            <Briefcase className="h-3.5 w-3.5" /> Project View
          </Button>
        </div>

        <nav className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           <span>Projects</span>
           <span className="opacity-40">/</span>
           {isProjectMode ? (
             <>
               <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/reports")}>Reports</span>
               <span className="opacity-40">/</span>
               <span className="text-foreground">{selectedProject.name}</span>
             </>
           ) : (
             <span className="text-foreground">General Report</span>
           )}
        </nav>
      </div>

      {/* Project Details Section (Project Mode Only) */}
      {isProjectMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50/50 border border-indigo-100/50 p-6 rounded-3xl"
        >
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Project Manager</p>
             <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                   {selectedProject.manager.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="font-bold text-indigo-900">{selectedProject.manager}</p>
             </div>
          </div>
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Deadline</p>
             <p className="font-bold text-indigo-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-50" /> {selectedProject.deadline}
             </p>
          </div>
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Current Status</p>
             <Badge className={`border-none ${selectedProject.status === "Delayed" ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                {selectedProject.status}
             </Badge>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {currentStats.map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.05 }}
           >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 rounded-3xl">
                 <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                       <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                          <stat.icon className="h-5 w-5" />
                       </div>
                       <Badge variant="outline" className={`border-none font-bold text-[10px] uppercase ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                          {stat.trend}
                       </Badge>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">{stat.label}</p>
                       <h3 className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</h3>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={isProjectMode ? "project-view" : "global-view"}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
           className="space-y-8"
        >
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="p-8 pb-4">
                   <div className="flex items-center justify-between">
                      <div>
                         <CardTitle className="text-xl font-bold">
                            {isProjectMode ? "Efficiency Timeline" : "Throughput Analysis: Est vs Actual"}
                         </CardTitle>
                         <CardDescription>
                            {isProjectMode ? "Measured daily efficiency score." : "Operational work units over the trailing 30 days."}
                         </CardDescription>
                      </div>
                      {!isProjectMode && (
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-indigo-500" /> <span className="text-[10px] uppercase font-bold text-muted-foreground">Actual</span></div>
                           <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-gray-300" /> <span className="text-[10px] uppercase font-bold text-muted-foreground">Estimated</span></div>
                        </div>
                      )}
                   </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={isProjectMode ? projectTimelineData : globalEfficiencyData}>
                            <defs>
                               <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey={isProjectMode ? "efficiency" : "actual"} stroke="#6366f1" fillOpacity={1} fill="url(#colorMain)" strokeWidth={4} />
                            {!isProjectMode && <Area type="monotone" dataKey="estimated" stroke="#ccc" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />}
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>

             <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl">
                <CardHeader className="p-8 pb-2 text-center">
                   <CardTitle className="text-xl font-bold">
                      {isProjectMode ? "Risk & Delay Analysis" : "Department Efficiency"}
                   </CardTitle>
                   <CardDescription>
                      {isProjectMode ? "Primary blockage factors." : "Performance across active teams."}
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col justify-center">
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={isProjectMode ? projectRiskData : globalTeamData}
                               cx="50%"
                               cy="50%"
                               innerRadius={65}
                               outerRadius={85}
                               paddingAngle={8}
                               dataKey="value"
                            >
                               {(isProjectMode ? projectRiskData : globalTeamData).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                               ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-2 gap-3 mt-6">
                      {(isProjectMode ? projectRiskData : globalTeamData).map(item => (
                        <div key={item.name} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-xl border border-secondary/20">
                           <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                           <p className="text-[9px] font-black uppercase truncate">{item.name}</p>
                           <span className="text-[10px] font-bold bg-white/50 px-1 rounded ml-auto">{item.value}%</span>
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Row 2: Bottom Contextual Content */}
          {!isProjectMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden relative group">
                  <div className="absolute top-4 right-4 animate-bounce">
                    <Award className="h-10 w-10 text-amber-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold italic underline underline-offset-4 decoration-white/20">Organization Health Bonus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black mb-1">+$124.5k</p>
                    <p className="text-xs font-bold text-indigo-100/70 uppercase tracking-widest leading-loose">Projected efficiency-driven cost savings this fiscal quarter.</p>
                    <Button variant="outline" className="w-full mt-6 h-10 border-white/20 hover:bg-white/20 transition-all font-bold gap-2 text-xs border-dashed text-white rounded-xl">
                        Analyze Methodology <Activity className="h-4 w-4" />
                    </Button>
                  </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Key Performance Delta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {[
                        { label: "Design Consistency", val: 94, trend: 1.2 },
                        { label: "Dev Velocity", val: 82, trend: -0.4 },
                        { label: "QA Precision", val: 98, trend: 0.8 },
                    ].map(k => (
                        <div key={k.label} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                              <span>{k.label}</span>
                              <span className={k.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}>{k.trend > 0 ? '+' : ''}{k.trend}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                              <div className={`h-full ${k.val > 90 ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-full`} style={{ width: `${k.val}%` }} />
                          </div>
                        </div>
                    ))}
                  </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl">
                  <CardHeader className="pb-2 text-center flex flex-col items-center pt-8">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                        <Star className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">Strategic Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6">
                    <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">
                        "Backend resource utilization is at 98%. Increase engineering headcount or optimize 'SLA-Alpha' scope to avoid burnout risk."
                    </p>
                    <Button variant="secondary" className="mt-6 w-full h-10 rounded-xl font-bold bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border-none">
                        Open Capacity Planner
                    </Button>
                  </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
               <CardHeader className="p-8 pb-2">
                  <CardTitle className="text-xl font-bold">Resource Performance Matrix</CardTitle>
                  <CardDescription>Performance of individual resource categories within this project.</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-6">
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectResourceData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" fontSize={11} />
                           <YAxis axisLine={false} tickLine={false} stroke="#888" fontSize={11} />
                           <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                           <Bar dataKey="efficiency" name="Efficiency %" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                           <Bar dataKey="onTime" name="On-Time Delivery %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* Empty State Mock */}
          {isProjectMode && !selectedProject && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
               <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">No project data available</h3>
                  <p className="text-muted-foreground">We couldn't find any performance records for the selected project.</p>
               </div>
               <Button onClick={handleClearFilter}>Back to Global Analytics</Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

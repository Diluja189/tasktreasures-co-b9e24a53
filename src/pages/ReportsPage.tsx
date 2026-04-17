import { useState, useMemo } from "react";
import { 
  BarChart3, Download, FileText, TrendingUp, Users, Calendar, 
  UserCircle, RefreshCw, Activity, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Filter, Search, FileDown, LineChart as LineChartIcon,
  X, Briefcase, LayoutDashboard
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
  { id: "PRJ-001", name: "E-Commerce Platform", manager: "Sarah Chen" },
  { id: "PRJ-002", name: "Mobile App v3.0", manager: "Sarah Chen" },
  { id: "PRJ-003", name: "Analytics Dashboard", manager: "Lisa Wang" },
  { id: "PRJ-004", name: "Security Audit", manager: "David Kim" },
];

const globalStats = [
  { label: "Overall Efficiency", value: "88.4%", trend: "+2.4%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Completion Rate", value: "94.2%", trend: "+1.2%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "On-Time Delivery", value: "76.8%", trend: "-0.8%", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Active Project Hours", value: "2,480h", trend: "+124h", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const globalEfficiencyData = [
  { name: "Week 1", estimated: 400, actual: 450, efficiency: 88 },
  { name: "Week 2", estimated: 420, actual: 400, efficiency: 105 },
  { name: "Week 3", estimated: 450, actual: 480, efficiency: 94 },
  { name: "Week 4", estimated: 380, actual: 350, efficiency: 108 },
];

const globalTeamData = [
  { name: "Engineering", efficiency: 92, onTime: 85, delayed: 15 },
  { name: "UI/UX Design", efficiency: 88, onTime: 90, delayed: 10 },
  { name: "DevOps", efficiency: 96, onTime: 98, delayed: 2 },
  { name: "Marketing", efficiency: 75, onTime: 70, delayed: 30 },
];

const globalDelayAnalysis = [
  { name: "Resource Gap", value: 35, color: "#6366f1" },
  { name: "Scope Creep", value: 45, color: "#f43f5e" },
  { name: "Tech Debt", value: 20, color: "#fbbf24" },
];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  
  const selectedProject = useMemo(() => {
    return projectsList.find(p => p.id === projectId);
  }, [projectId]);

  const isProjectMode = !!selectedProject;

  // Derive filtered stats (Mocking project-specific data)
  const stats = useMemo(() => {
    if (!isProjectMode) return globalStats;
    // Mock variation for project mode
    return [
      { label: "Completion Rate", value: "65.0%", trend: "+5.2%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "On-Time Delivery", value: "82.4%", trend: "+2.1%", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Project Hours", value: "320h", trend: "+40h", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Team Efficiency", value: "91.2%", trend: "+3.4%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];
  }, [isProjectMode]);

  const chartData = useMemo(() => {
    if (!isProjectMode) return globalEfficiencyData;
    return globalEfficiencyData.map(d => ({ 
      ...d, 
      efficiency: d.efficiency + (Math.random() * 10 - 5) 
    }));
  }, [isProjectMode]);

  const teamPerformanceData = useMemo(() => {
    if (!isProjectMode) return globalTeamData;
    // Filter to only manager and a couple of relevant "departments" for project view
    return [
      { name: "Dev Team", efficiency: 94, onTime: 92, delayed: 8 },
      { name: "QA / Review", efficiency: 86, onTime: 80, delayed: 20 },
    ];
  }, [isProjectMode]);

  const delayData = useMemo(() => {
    if (!isProjectMode) return globalDelayAnalysis;
    return [
      { name: "Resource Gap", value: 20, color: "#6366f1" },
      { name: "Tech Challenges", value: 80, color: "#f43f5e" },
    ];
  }, [isProjectMode]);

  const handleClearFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-10 px-4 pt-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-bold tracking-tight text-foreground">
               {isProjectMode ? "Project Report" : "Performance Analytics"}
             </h1>
             {isProjectMode && (
               <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-2 rounded-lg font-bold text-[10px]">
                 FILTERED VIEW
               </Badge>
             )}
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            {isProjectMode ? (
              <>
                <Briefcase className="h-4 w-4 text-indigo-500" />
                Detailed insights for <span className="font-bold text-foreground">{selectedProject.name}</span>
              </>
            ) : (
              "Measuring task efficiency and organizational throughput."
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {isProjectMode && (
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-xl gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={handleClearFilter}>
              <X className="h-4 w-4" /> Clear Filter
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-xl gap-2 hover:bg-secondary/50" onClick={() => toast.info("Refreshing analytics...")}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="h-8 text-xs rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
            <FileDown className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Mode Toggle & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-xl w-fit border border-secondary">
          <Button 
            variant={!isProjectMode ? "secondary" : "ghost"} 
            size="sm" 
            className={`h-7 text-[10px] uppercase font-black tracking-widest rounded-lg gap-1.5 px-4 ${!isProjectMode ? 'bg-white shadow-sm' : ''}`}
            onClick={() => navigate("/reports")}
          >
            <LayoutDashboard className="h-3 w-3" /> Global View
          </Button>
          <Button 
            variant={isProjectMode ? "secondary" : "ghost"} 
            size="sm" 
            className={`h-7 text-[10px] uppercase font-black tracking-widest rounded-lg gap-1.5 px-4 ${isProjectMode ? 'bg-white shadow-sm' : ''}`}
            onClick={() => navigate(`/reports?projectId=${projectId || "PRJ-001"}`)}
          >
            <Briefcase className="h-3 w-3" /> Project View
          </Button>
        </div>

        <nav className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           <span>Home</span>
           <span className="opacity-40">/</span>
           <span className={isProjectMode ? "cursor-pointer hover:text-primary transition-colors" : "text-foreground"} onClick={() => navigate("/reports")}>Reports</span>
           {isProjectMode && (
             <>
               <span className="opacity-40">/</span>
               <span className="text-foreground">Project Detail</span>
             </>
           )}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={isProjectMode ? selectedProject?.id : "global"}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
           className="space-y-6"
        >
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={stat.label} className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden group hover:bg-card hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">{stat.label}</p>
                       <span className={`text-[10px] font-black leading-none ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {stat.trend}
                       </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Efficiency Chart */}
            <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/10">
              <CardHeader className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {isProjectMode ? "Efficiency Timeline" : "Efficiency Analysis"}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      {isProjectMode ? "Daily efficiency score vs project milestone targets" : "(Estimated Time / Actual Time) × 100"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 rounded-lg h-6 text-[10px] border-none font-bold">
                    STABLE PATH
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-6">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="efficiency" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEff)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Delay Analysis (Pie) */}
            <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/10">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg font-bold text-foreground">Risk & Delay Analysis</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Primary blockage factors</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="h-[200px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={delayData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {delayData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {delayData.map(d => (
                    <div key={d.name} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">{d.name}</span>
                      </div>
                      <span className="text-xs font-black text-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Graph */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/10">
            <CardHeader className="p-5 border-b border-border/10 bg-secondary/10">
              <CardTitle className="text-lg font-bold text-foreground">
                {isProjectMode ? "Resource Performance Matrix" : "Organization Performance Graph"}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">
                {isProjectMode ? "Assigned team performance within current scope" : "Multi-department efficiency vs on-time delivery metrics"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {teamPerformanceData.length > 0 ? (
                <>
                  <div className="h-[250px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                        <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                        <Bar dataKey="efficiency" name="Efficiency" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                        <Bar dataKey="onTime" name="On-Time %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-8 mt-6 border-t border-border/10 pt-5">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">METRIC: TEAM EFFICIENCY</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">METRIC: ON-TIME SUCCESS Rate</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <LayoutDashboard className="h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">No team assigned yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Assignments are required to generate performance metrics.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

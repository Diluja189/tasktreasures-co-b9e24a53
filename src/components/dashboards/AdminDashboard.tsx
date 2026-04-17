import { motion } from "framer-motion";
import { 
  Plus, FolderKanban, CheckCircle2, AlertCircle, 
  BarChart3, Users, Filter, RefreshCw, Eye, 
  ArrowUpRight, TrendingUp, Clock, FileBarChart,
  UserPlus, AlertTriangle, Calendar, GanttChartSquare,
  History, UserCheck, ShieldAlert, TimerOff, PieChart
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart as RechartsPieChart, Pie, Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { title: "Total Projects", value: "24", icon: FolderKanban, trend: "+2", color: "text-blue-500", bg: "bg-blue-500/10", subtitle: "Total parent lifecycle count" },
  { title: "Active Projects", value: "18", icon: Clock, trend: "+1", color: "text-indigo-500", bg: "bg-indigo-500/10", subtitle: "Projects currently in progress" },
  { title: "Completed Tasks", value: "142", icon: CheckCircle2, trend: "+12", color: "text-emerald-500", bg: "bg-emerald-500/10", subtitle: "Individual work units finalized" },
  { title: "Delayed Projects", value: "4", icon: AlertTriangle, trend: "+1", color: "text-amber-500", bg: "bg-amber-500/10", subtitle: "projects that missed planned deadline" },
  { title: "Delayed Tasks", value: "12", icon: AlertCircle, trend: "-2", color: "text-rose-500", bg: "bg-rose-500/10", subtitle: "tasks not completed on time" },
];

const statusDistribution = [
  { name: "On-Time", value: 12, color: "#10b981" },
  { name: "In Progress", value: 8, color: "#6366f1" },
  { name: "Delayed", value: 4, color: "#f43f5e" },
];

const performanceData = [
  { name: "John D.", score: 85 },
  { name: "Sarah S.", score: 92 },
  { name: "Mike J.", score: 78 },
  { name: "Anna B.", score: 88 },
  { name: "David R.", score: 95 },
];

const inactiveProjects = [
  { name: "Legacy System Audit", manager: "David Kim", lastUpdated: "4 days ago" },
  { name: "VPN Infrastructure", manager: "N/A", lastUpdated: "6 days ago" },
];

const recentActivity = [
  { type: "project", action: "Project Created", target: "Cloud Migration Phase 2", time: "2h ago", icon: Plus },
  { type: "manager", action: "Manager Assigned", target: "Sarah Chen → Mobile App", time: "5h ago", icon: UserCheck },
  { type: "deadline", action: "Deadline Updated", target: "API Discovery", time: "1d ago", icon: Calendar },
  { type: "status", action: "Project Delayed", target: "SaaS Redesign", time: "1d ago", icon: TimerOff },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/monitoring")}>
            <Filter className="h-4 w-4" /> Filter Projects
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => navigate("/assign-manager")}
          >
            <UserPlus className="h-4 w-4" /> Assign Manager
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            onClick={() => navigate("/projects")}
          >
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-full"
          >
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:bg-card transition-all duration-300 h-full">
              <CardContent className="p-3.5 flex flex-col h-full justify-between">
                <div>
                  <div className={`p-2 rounded-lg w-fit ${stat.bg} ${stat.color} mb-2`}>
                    <stat.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                  <div className="flex items-end justify-between mt-1">
                    <h3 className="text-xl font-bold tracking-tight">{stat.value}</h3>
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded-md ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <p className="text-[8px] font-medium text-muted-foreground pt-1.5 border-t border-border/10 italic leading-tight mt-2">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Manager Performance */}
        <Card className="lg:col-span-7 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Manager Performance Index</CardTitle>
                <CardDescription className="text-[10px]">Efficiency scores across assigned teams</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => navigate("/performance")}>
                Analytical View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'hsl(var(--primary)/0.05)'}} />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card className="lg:col-span-5 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="p-4 pb-0">
             <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-500" /> Status Distribution
             </CardTitle>
             <CardDescription className="text-[10px]">Current project distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex flex-col items-center justify-center">
             <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                         {statusDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                         ))}
                      </Pie>
                      <Tooltip />
                   </RechartsPieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-3 gap-4 mt-2 w-full">
                {statusDistribution.map(item => (
                  <div key={item.name} className="flex flex-col items-center">
                     <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.name}</span>
                     <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Inactive Projects */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Inactive Projects</CardTitle>
            <CardDescription className="text-[9px]">No activity detected in last 3+ days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-1">
             {inactiveProjects.map(p => (
               <div key={p.name} className="p-2.5 rounded-xl bg-secondary/30 flex items-center justify-between group hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="text-[11px] font-bold">{p.name}</p>
                    <p className="text-[9px] text-muted-foreground">Owner: {p.manager}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] opacity-70 italic font-medium p-0 border-none">{p.lastUpdated}</Badge>
               </div>
             ))}
             <Button variant="ghost" className="w-full h-7 text-[9px] font-bold text-primary group gap-2" onClick={() => navigate("/monitoring")}>
                View All Inactive <ArrowUpRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </Button>
          </CardContent>
        </Card>

        {/* Projects Without Manager */}
        <Card className="lg:col-span-3 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl flex flex-col">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Projects Without Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-2 flex-1 text-center justify-center flex flex-col">
             <div className="bg-amber-500/10 rounded-xl p-3 border border-dashed border-amber-500/20">
                <p className="text-3xl font-black text-amber-600 tracking-tighter">03</p>
                <p className="text-[9px] font-bold text-amber-700 mt-0.5 uppercase tracking-widest leading-loose">Pending Assignment</p>
             </div>
             <Button className="w-full h-8 text-[10px] font-bold gap-2 rounded-lg mt-1 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20 border-none transition-all active:scale-95" onClick={() => navigate("/assign-manager")}>
               Assign Now <UserPlus className="h-3.5 w-3.5" />
             </Button>
          </CardContent>
        </Card>

        {/* High Risk Actions Card */}
        <Card className="lg:col-span-5 border-none shadow-md bg-rose-600 text-white rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
             <AlertTriangle size={80} />
          </div>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-rose-100/70">Risk Mitigation</CardTitle>
            <CardDescription className="text-rose-100/80 text-[10px]">3 Highly-Critical Projects require intervention</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-4">
               <ShieldAlert className="h-5 w-5 text-rose-100 shrink-0 mt-0.5" />
               <p className="text-[11px] leading-snug font-bold">15% Baseline Deviation detected in core infrastructure streams.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/monitoring")}>
                  View Projects
               </Button>
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/assign-manager")}>
                  Reassign Manager
               </Button>
               <Button variant="outline" className="h-8 text-[9px] font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white border-dashed px-1" onClick={() => navigate("/projects")}>
                  Extend Deadline
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
         <CardHeader className="p-4 border-b border-border/10 bg-secondary/10 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
               <History className="h-4 w-4 text-indigo-600" /> Recent Organizational Activity
            </CardTitle>
            <Badge variant="outline" className="bg-white/50 border-none font-bold text-[9px] h-5">TRAIL MODE</Badge>
         </CardHeader>
         <CardContent className="p-0">
            <div className="max-h-[240px] overflow-y-auto no-scrollbar divide-y divide-border/10">
               {recentActivity.map((activity, i) => (
                 <div key={i} className="flex items-center justify-between p-3.5 hover:bg-secondary/20 transition-colors group">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-500/5 group-hover:scale-105 transition-transform">
                          <activity.icon className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{activity.action}</p>
                          <p className="text-[13px] font-bold text-foreground leading-tight">{activity.target}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-medium text-muted-foreground uppercase flex items-center justify-end gap-1.5"><TimerOff className="h-2.5 w-2.5" /> {activity.time}</p>
                       <p className="text-[8px] font-bold text-emerald-600 mt-0.5">Verified Audit</p>
                    </div>
                 </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

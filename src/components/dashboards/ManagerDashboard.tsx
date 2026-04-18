import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckCircle2, AlertCircle,
  Users, Clock, ArrowUpRight,
  TrendingUp, FileText, TimerOff, 
  PieChart, ListTodo, TrendingDown, 
  Search, ChevronRight, Download, Activity,
  AlertTriangle, ShieldAlert, 
  Calendar, Briefcase, Target, 
  ChevronDown, Filter, Zap, Lock
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/* ——— Mock Intelligence Data ——————————————————————————————————————————— */
const PROJECTS_DATA = [
  { id: "P1", name: "Cloud Migration Infrastructure", start: "Mar 01, 2024", deadline: "May 15, 2024", progress: 75, completed: 12, total: 16, overdue: 1, efficiency: 88, status: "Healthy", team: 4 },
  { id: "P2", name: "SaaS Dashboard Phase 2", start: "Apr 05, 2024", deadline: "Jun 20, 2024", progress: 42, completed: 5, total: 12, overdue: 2, efficiency: 64, status: "At Risk", team: 3 },
  { id: "P3", name: "Security Protocols Audit", start: "Feb 20, 2024", deadline: "Apr 30, 2024", progress: 92, completed: 18, total: 20, overdue: 0, efficiency: 96, status: "Healthy", team: 5 },
];

const TEAM_MEMBERS = [
  { id: "M1", name: "Alex Richardson", role: "Sr. Developer", assigned: 12, completed: 8, progress: 3, overdue: 1, efficiency: 67, status: "Average" },
  { id: "M2", name: "Priya Sharma", role: "UI/UX Lead", assigned: 15, completed: 15, progress: 0, overdue: 0, efficiency: 100, status: "Excellent" },
  { id: "M3", name: "James Wilson", role: "DevOps Engineer", assigned: 10, completed: 4, progress: 4, overdue: 2, efficiency: 40, status: "Critical" },
  { id: "M4", name: "Jessica Lane", role: "UI Designer", assigned: 8, completed: 8, progress: 0, overdue: 0, efficiency: 100, status: "Excellent" },
  { id: "M5", name: "Michael Kim", role: "Backend Dev", assigned: 9, completed: 5, progress: 3, overdue: 1, efficiency: 55, status: "Needs Attention" },
];

const TASKS_DATA = [
  { id: "T1", title: "OAuth 2.0 Integration", member: "Alex Richardson", project: "Cloud Migration Infrastructure", priority: "High", start: "Apr 10", due: "Apr 20", status: "In Progress" },
  { id: "T2", title: "S3 Bucket Optimization", member: "James Wilson", project: "Cloud Migration Infrastructure", priority: "Medium", start: "Apr 12", due: "Apr 18", status: "Overdue" },
  { id: "T3", title: "API Gateway Refactor", member: "Sarah Chen", project: "Security Protocols Audit", priority: "High", start: "Apr 05", due: "Apr 15", status: "Completed" },
  { id: "T4", title: "User Onboarding Flow", member: "Priya Sharma", project: "SaaS Dashboard Phase 2", priority: "High", start: "Apr 14", due: "Apr 25", status: "In Progress" },
  { id: "T5", title: "Legacy Database Purge", member: "James Wilson", project: "Cloud Migration Infrastructure", priority: "Low", start: "Apr 01", due: "Apr 10", status: "Overdue" },
];

/* ——— Helper Components ——————————————————————————————————————————— */
const EfficiencyBadge = ({ score }: { score: number }) => {
  const cfg = score >= 90 ? { label: "Excellent", color: "bg-emerald-50 text-emerald-700 border-emerald-200" } :
              score >= 75 ? { label: "Good", color: "bg-indigo-50 text-indigo-700 border-indigo-200" } :
              score >= 50 ? { label: "Needs Attention", color: "bg-amber-50 text-amber-700 border-amber-200" } :
                            { label: "Critical", color: "bg-rose-50 text-rose-700 border-rose-200" };
  return <Badge className={cn("text-[10px] uppercase font-black px-2 py-0.5", cfg.color)}>{cfg.label}</Badge>;
};

/* ——— MAIN DASHBOARD ——————————————————————————————————————————— */
export function ManagerDashboard() {
  const navigate = useNavigate();
  const [taskFilter, setTaskFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = useMemo(() => {
    return TASKS_DATA.filter(t => {
      const matchFilter = taskFilter === "All" || t.status === taskFilter || (taskFilter === "High Priority" && t.priority === "High");
      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.member.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [taskFilter, searchTerm]);

  // Derived Manager Metrics
  const managerEfficiency = 84;
  const teamEfficiency = 78;

  const stats = [
    { title: "Assigned Projects", value: PROJECTS_DATA.length.toString().padStart(2, '0'), icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Total Tasks Under Me", value: TASKS_DATA.length.toString().padStart(2, '0'), icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Tasks In Progress", value: TASKS_DATA.filter(t => t.status === "In Progress").length.toString().padStart(2, '0'), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Completed Tasks", value: TASKS_DATA.filter(t => t.status === "Completed").length.toString().padStart(2, '0'), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Overdue Tasks", value: PROJECTS_DATA.reduce((acc, p) => acc + p.overdue, 0).toString().padStart(2, '0'), icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Team Members Under Me", value: TEAM_MEMBERS.length.toString().padStart(2, '0'), icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
    { title: "My Overall Efficiency", value: `${managerEfficiency}%`, icon: Target, color: "text-primary", bg: "bg-primary/5" },
    { title: "Team Overall Efficiency", value: `${teamEfficiency}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-full px-4 md:px-8 py-8 space-y-10 max-w-[1600px] mx-auto pb-20">
      
      {/* 1. MANAGER COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">Strategic Management Layer</Badge>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Manager <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Monitoring operational deltas and team synchronization.</p>
        </motion.div>
        
        {/* Manager Personal Efficiency Section */}
        <Card className="border-none shadow-xl bg-slate-900 text-white p-6 rounded-[2rem] w-full md:w-[400px] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp size={120} />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Your Efficiency</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black leading-none">{managerEfficiency}%</span>
                  <EfficiencyBadge score={managerEfficiency} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-300 leading-relaxed max-w-[180px]">
                Your performance is <span className="text-emerald-400 font-bold italic">Excellent</span>. Project synchronization is currently above baseline targets.
              </p>
            </div>
            <div className="h-16 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center">
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-2 border border-white/10">
                  <Activity className="h-6 w-6 text-indigo-400" />
               </div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Operational Status</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. REFINED KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border/40 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all group h-full">
              <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full space-y-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none h-6">{stat.title}</p>
                   <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN INTERACTIVE MONITORING AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Projects & Tasks (The Core Work) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* A. PROJECT-WISE EFFICIENCY BREAKDOWN */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <Briefcase className="h-4 w-4 text-primary" /> Project-wise Efficiency Breakdown
               </h2>
               <Badge className="border-none bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">{PROJECTS_DATA.length} Active Streams</Badge>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              {PROJECTS_DATA.map((proj) => (
                <AccordionItem key={proj.id} value={proj.id} className="border border-border/40 bg-white rounded-2xl overflow-hidden shadow-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-6 group">
                    <div className="flex flex-1 items-center justify-between pr-4 gap-6">
                      <div className="flex items-center gap-4 text-left">
                         <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border", proj.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100')}>
                            {proj.status === 'Healthy' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base">{proj.name}</p>
                            <p className="text-xs text-slate-400 font-medium">Deadline: {proj.deadline}</p>
                         </div>
                      </div>
                      <div className="hidden md:flex items-center gap-10">
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                            <span className="text-sm font-black text-slate-900">{proj.progress}%</span>
                         </div>
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                            <span className={cn("text-sm font-black", proj.efficiency >= 80 ? "text-emerald-600" : "text-amber-600")}>{proj.efficiency}%</span>
                         </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 border-t border-slate-50 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lifecycle Progress</p>
                          <div className="space-y-2">
                             <div className="flex justify-between text-xs font-bold">
                                <span>Completion Velocity</span>
                                <span>{proj.progress}%</span>
                             </div>
                             <Progress value={proj.progress} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Start Date</p>
                                <p className="text-xs font-black text-slate-700">{proj.start}</p>
                             </div>
                             <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Deadline</p>
                                <p className="text-xs font-black text-rose-600">{proj.deadline}</p>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Throughput Audit</p>
                          <div className="grid grid-cols-3 gap-2">
                             <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <p className="text-[8px] font-bold text-emerald-600 uppercase">Done</p>
                                <p className="text-lg font-black text-emerald-700">{proj.completed}</p>
                             </div>
                             <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[8px] font-bold text-slate-400 uppercase">Total</p>
                                <p className="text-lg font-black text-slate-700">{proj.total}</p>
                             </div>
                             <div className="text-center p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                                <p className="text-[8px] font-bold text-rose-600 uppercase">Overdue</p>
                                <p className="text-lg font-black text-rose-700">{proj.overdue}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                             <Users className="h-4 w-4 text-indigo-600" />
                             <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">{proj.team} Specialists Assigned</span>
                          </div>
                       </div>
                       <div className="flex flex-col justify-between">
                          <div className="space-y-2 text-right">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Decision Support</p>
                             <div className="bg-slate-900 text-white p-4 rounded-2xl text-left space-y-2">
                                <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-2 italic">
                                   <Zap className="h-3 w-3" /> Predictive Insights
                                </p>
                                <p className="text-[11px] leading-relaxed font-medium">
                                   This stream is {proj.efficiency}% efficient. {proj.overdue > 0 ? "Address " + proj.overdue + " overdue blocker(s) to hit deadline targets." : "Continue current implementation velocity."}
                                </p>
                             </div>
                          </div>
                          <Button variant="outline" className="w-full h-10 rounded-xl mt-4 font-bold border-slate-200">Export Stream Audit</Button>
                       </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* B. TEAM EFFICIENCY SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <Users className="h-4 w-4 text-primary" /> Team Efficiency Analysis
               </h2>
               <div className="flex gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[9px] uppercase">Top: {TEAM_MEMBERS.filter(m => m.efficiency >= 90).length}</Badge>
                  <Badge className="bg-rose-50 text-rose-700 border-none font-bold text-[9px] uppercase">Review: {TEAM_MEMBERS.filter(m => m.efficiency < 50).length}</Badge>
               </div>
            </div>
            
            <Card className="border border-border/40 bg-white rounded-3xl overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-border/30">
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Member Name</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Completed Tasks</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Pending</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Overdue</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Efficiency %</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                       {TEAM_MEMBERS.map(member => (
                          <tr key={member.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                      <AvatarFallback className="bg-slate-50 text-slate-900 text-[10px] font-black">{member.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{member.name}</p>
                                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{member.role}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className="text-sm font-bold text-emerald-600">{member.completed}</span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className="text-sm font-bold text-amber-500">{member.progress}</span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className="text-sm font-bold text-rose-500">{member.overdue}</span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end gap-1">
                                   <div className="flex items-center gap-2">
                                      <span className={cn("text-sm font-black italic", member.efficiency >= 85 ? "text-emerald-600" : member.efficiency >= 60 ? "text-amber-600" : "text-rose-600")}>{member.efficiency}%</span>
                                      {member.efficiency >= 85 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />}
                                   </div>
                                   <EfficiencyBadge score={member.efficiency} />
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </Card>
          </section>

          {/* C. TASK MONITORING PANEL */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <ListTodo className="h-4 w-4 text-primary" /> Task Monitoring Panel
               </h2>
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <Input 
                       placeholder="Filter by title or member..." 
                       className="pl-9 h-10 w-64 rounded-xl border-border/40 bg-white" 
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <Select value={taskFilter} onValueChange={setTaskFilter}>
                     <SelectTrigger className="h-10 w-44 rounded-xl border-border/40 bg-white font-bold text-xs">
                        <Filter className="h-3 w-3 mr-2 text-primary" />
                        <SelectValue placeholder="All Tasks" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                        <SelectItem value="All">All Tasks</SelectItem>
                        <SelectItem value="In Progress">Active Lifecycle</SelectItem>
                        <SelectItem value="Completed">Completed Vault</SelectItem>
                        <SelectItem value="Overdue">Critical Risks</SelectItem>
                        <SelectItem value="High Priority">Priority Focus</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <Card className="border border-border/40 bg-white rounded-3xl overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-border/30">
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Task</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Stream Source</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Impact</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Audit Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                       <AnimatePresence mode="popLayout">
                       {filteredTasks.length > 0 ? filteredTasks.map((task, i) => (
                          <motion.tr 
                            key={task.id} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                             <td className="px-6 py-5">
                                <p className="text-sm font-bold text-slate-900 leading-tight">{task.title}</p>
                                <p className="text-[10px] font-black text-indigo-600/60 uppercase tracking-tighter mt-1">{task.member}</p>
                             </td>
                             <td className="px-6 py-5">
                                <Badge variant="outline" className="text-[9px] font-bold border-slate-100 text-slate-500 whitespace-nowrap bg-slate-50/50">{task.project}</Badge>
                             </td>
                             <td className="px-6 py-5">
                                <Badge className={cn("text-[9px] font-bold uppercase", task.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100")}>{task.priority}</Badge>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex flex-col gap-0.5">
                                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                      <Calendar className="h-3 w-3 text-slate-400" /> {task.due}
                                   </div>
                                   <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Started {task.start}</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-right">
                                <Badge className={cn("text-[9px] font-black uppercase tracking-tight", 
                                   task.status === 'Completed' ? "bg-emerald-500 text-white" : 
                                   task.status === 'Overdue' ? "bg-rose-600 text-white animate-pulse" : 
                                   "bg-indigo-50 text-indigo-600 border border-indigo-100")}>
                                   {task.status}
                                </Badge>
                             </td>
                          </motion.tr>
                       )) : (
                          <tr>
                             <td colSpan={5} className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                   <Search size={40} className="text-slate-300" />
                                   <p className="text-base font-bold">No tasks matched current search criteria.</p>
                                </div>
                             </td>
                          </tr>
                       )}
                       </AnimatePresence>
                    </tbody>
                 </table>
               </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Alerts & Intelligence (Contextual Insights) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A. ALERT & ATTENTION NEEDED */}
          <section className="space-y-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" /> Strategic Attention Needed
             </h2>
             <div className="space-y-3">
                {[
                   { title: "Critical Overdue Bloat", details: "Project SaaS Phase 2 has 2 overdue tasks blocking lifecycle.", impact: "High", type: "error" },
                   { title: "Performance Anomaly", details: "James Wilson (40% Eff.) requires reassignment or warning.", impact: "Med", type: "warning" },
                   { title: "Slippage Risk Detected", details: "Security Protocols Audit expires in 12 days. Progress lagging.", impact: "High", type: "error" },
                ].map((alert, i) => (
                   <div key={i} className={cn("p-5 rounded-[1.5rem] border-l-[6px] shadow-sm relative group cursor-pointer hover:scale-[1.02] transition-all", alert.type === 'error' ? "bg-rose-50 border-rose-500" : "bg-amber-50 border-amber-500")}>
                      <div className="flex justify-between items-start mb-2">
                         <h4 className={cn("font-black text-xs uppercase tracking-tight", alert.type === 'error' ? "text-rose-950" : "text-amber-950")}>{alert.title}</h4>
                         <Badge className={cn("text-[8px] font-black uppercase border-none", alert.type === 'error' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>{alert.impact} Impact</Badge>
                      </div>
                      <p className={cn("text-[11px] font-medium leading-relaxed", alert.type === 'error' ? "text-rose-700/80" : "text-amber-700/80")}>{alert.details}</p>
                      <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
                   </div>
                ))}
             </div>
          </section>

          {/* B. MANAGERIAL CHARTS area */}
          <section className="space-y-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
                <PieChart className="h-4 w-4 text-primary" /> Insight Engine
             </h2>
             
             {/* Task Status Distribution */}
             <Card className="border border-border/40 bg-white rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Task Status Lifecycle</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <RechartsPieChart>
                            <Pie 
                              data={[
                                 { name: 'Completed', value: 35, color: '#10b981' },
                                 { name: 'In Progress', value: 45, color: '#8b5cf6' },
                                 { name: 'Overdue', value: 20, color: '#f43f5e' }
                              ]} 
                              cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" cornerRadius={6}
                            >
                               <Cell fill="#10b981" />
                               <Cell fill="#8b5cf6" />
                               <Cell fill="#f43f5e" />
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: 10, fontWeight: 700 }} />
                         </RechartsPieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-1 gap-2 mt-4">
                      {[
                         { label: 'Baseline Target Achievement', pct: 85, color: 'bg-emerald-500' },
                         { label: 'Current Timeline Variance', pct: 15, color: 'bg-rose-500' },
                      ].map((bar, i) => (
                         <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                               <span>{bar.label}</span>
                               <span className="text-slate-900">{bar.pct}%</span>
                            </div>
                            <Progress value={bar.pct} className={cn("h-1", bar.color === 'bg-rose-500' ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500")} />
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>

             {/* Team Efficiency Benchmarking */}
             <Card className="border border-border/40 bg-white rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team Efficiency Benchmarking</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={TEAM_MEMBERS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" fontSize={8} fontWeight={700} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 9 }} />
                            <Bar dataKey="efficiency" radius={[4, 4, 0, 0]} barSize={16}>
                               {TEAM_MEMBERS.map((entry, index) => (
                                  <Cell key={index} fill={entry.efficiency > 80 ? '#10b981' : entry.efficiency > 50 ? '#8b5cf6' : '#f43f5e'} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium italic mt-4 text-center leading-relaxed">
                     Specialists with scores &lt; 50% are automatically flagged for manager intervention.
                   </p>
                </CardContent>
             </Card>
          </section>

          {/* C. SYSTEM ACTIONS */}
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
             <div className="absolute top-0 right-0 opacity-10 p-6 group-hover:scale-110 transition-transform">
                <Lock size={120} />
             </div>
             <div className="relative space-y-6">
                <h4 className="text-xl font-black italic">Strategic Audit Report</h4>
                <p className="text-xs text-indigo-100/80 font-medium mb-6 leading-relaxed">
                  Generate a comprehensive performance ledger including all operational deltas and specialist efficiency scores.
                </p>
                <div className="space-y-3">
                   <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl border-none shadow-xl" onClick={() => toast.success("Preparing executive briefing...")}>
                      Generate PDF Report
                   </Button>
                   <Button className="w-full bg-indigo-500/50 text-white hover:bg-indigo-500/70 border border-indigo-400 font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl" onClick={() => navigate("/manager/reports")}>
                      Internal Assessment
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

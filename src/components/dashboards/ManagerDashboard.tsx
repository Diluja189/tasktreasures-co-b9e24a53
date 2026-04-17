import { motion } from "framer-motion";
import { 
  Plus, LayoutDashboard, CheckCircle2, AlertCircle, 
  Users, BarChart3, Clock, ArrowUpRight, 
  TrendingUp, Calendar, FileText, UserPlus, 
  TimerOff, PieChart, CheckSquare, ListTodo
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell 
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stats = [
  { title: "Assigned Projects", value: "05", icon: LayoutDashboard, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Total Tasks", value: "48", icon: ListTodo, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "In Progress", value: "18", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Completed Tasks", value: "24", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Overdue Tasks", value: "06", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
];

const statusDistribution = [
  { name: "In Progress", value: 18, color: "#f59e0b" },
  { name: "Completed", value: 24, color: "#10b981" },
  { name: "Delayed", value: 6, color: "#f43f5e" },
];

const efficiencyData = [
  { name: "Week 1", actual: 85, estimated: 90 },
  { name: "Week 2", actual: 92, estimated: 88 },
  { name: "Week 3", actual: 78, estimated: 82 },
  { name: "Week 4", actual: 94, estimated: 90 },
];

const assignedProjects = [
  { name: "Cloud Migration", progress: 65, deadline: "Apr 20", status: "On-Time" },
  { name: "SaaS Dashboard Phase 2", progress: 40, deadline: "May 12", status: "Delayed" },
  { name: "Security Infrastructure", progress: 88, deadline: "Apr 28", status: "On-Time" },
];

const upcomingDeadlines = [
  { task: "Database Indexing", project: "Cloud Migration", due: "In 2 days", priority: "High" },
  { task: "UI Component Audit", project: "SaaS Dashboard", due: "In 4 days", priority: "Medium" },
];

export function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic underline decoration-primary/20 decoration-4 underline-offset-8">
            Manager Command Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Project execution tracking and team performance audit.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate("/manager/tasks")}>
             <Plus className="h-4 w-4" /> Add Task
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate("/manager/assignments")}>
             <UserPlus className="h-4 w-4" /> Assign Member
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl font-bold transition-all active:scale-95" onClick={() => navigate("/manager/reports")}>
             <FileText className="h-4 w-4" /> Submit Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:bg-card transition-all duration-300">
              <CardContent className="p-5">
                <div className={`p-2.5 rounded-xl w-fit ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Distribution */}
        <Card className="lg:col-span-5 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
             <CardTitle className="text-lg font-bold flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-500" /> Task Status Distribution
             </CardTitle>
             <CardDescription>Visual breakdown of current task progress</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
             <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
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
             <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                {statusDistribution.map(item => (
                  <div key={item.name} className="flex flex-col items-center p-2 rounded-2xl bg-secondary/20">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.name}</span>
                     <span className="text-lg font-black" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Team Efficiency */}
        <Card className="lg:col-span-7 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-emerald-500" /> Team Efficiency Audit
            </CardTitle>
            <CardDescription>Comparison of estimated vs actual performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={35} name="Actual" />
                  <Bar dataKey="estimated" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={35} name="Estimated" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Projects Snapshot */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assigned Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1">
            {assignedProjects.map(p => (
              <div key={p.name} className="p-4 rounded-2xl bg-secondary/30 border border-secondary/10 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-sm font-bold italic">{p.name}</p>
                   <Badge className={`${p.status === 'Delayed' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'} border-none text-[8px] font-black uppercase`}>{p.status}</Badge>
                </div>
                <div className="space-y-2 mt-3">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{p.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${p.progress}%` }} />
                   </div>
                   <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1 font-medium"><Clock className="h-3 w-3" /> Due {p.deadline}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold italic">{d.task}</p>
                   <p className="text-[10px] text-muted-foreground">{d.project}</p>
                   <Badge variant="outline" className="text-[9px] mt-1 text-amber-600 bg-white/50 border-amber-200">Priority: {d.priority}</Badge>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 border-dashed justify-center">
               <p className="text-[10px] font-bold text-emerald-600 italic uppercase">All other items verified</p>
            </div>
          </CardContent>
        </Card>

        {/* Delayed Tasks */}
        <Card className="border-none shadow-md bg-rose-600 text-white rounded-3xl h-full flex flex-col relative overflow-hidden">
           <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
              <TimerOff size={150} />
           </div>
           <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-rose-100/70">Delayed Tasks Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 flex-1">
             <div className="bg-white/10 p-4 rounded-2xl space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                     <div>
                        <p className="text-xs font-bold leading-tight">Backend API Sync v{i}</p>
                        <p className="text-[9px] text-rose-100 mt-0.5">Delayed by {i} days</p>
                     </div>
                     <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 rounded-full" onClick={() => navigate("/manager/tracking")}>
                        <ArrowUpRight className="h-4 w-4" />
                     </Button>
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-medium leading-relaxed italic text-rose-100/80 mt-2">
                Action required: Address these blockers or reassign ownership in the Tracking module.
             </p>
             <Button className="w-full mt-4 h-10 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-xl border-none transition-all" onClick={() => navigate("/manager/tracking")}>
                Review Blockers
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

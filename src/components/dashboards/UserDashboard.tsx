import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, AlertCircle, Play,
  ListTodo, Timer, RefreshCw, ChevronRight,
  Calendar, Target, ArrowUpRight, PenLine,
  Filter, MoreHorizontal, Layout,
  Activity, Hourglass
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Static Data for Visual Excellence
const statCards = [
  { 
    title: "Assigned Tasks", 
    value: "12", 
    icon: ListTodo, 
    bg: "bg-indigo-500/10", 
    color: "text-indigo-600",
    trend: "+2 this week",
    trendUp: true
  },
  { 
    title: "In Progress", 
    value: "4", 
    icon: RefreshCw, 
    bg: "bg-amber-500/10", 
    color: "text-amber-600",
    description: "Actively working"
  },
  { 
    title: "Completed", 
    value: "28", 
    icon: CheckCircle2, 
    bg: "bg-emerald-500/10", 
    color: "text-emerald-600",
    trend: "85% success rate"
  },
  { 
    title: "Hours Logged", 
    value: "164h", 
    icon: Timer, 
    bg: "bg-blue-500/10", 
    color: "text-blue-600",
    trend: "24h this week"
  },
  { 
    title: "Overdue", 
    value: "1", 
    icon: AlertCircle, 
    bg: "bg-rose-500/10", 
    color: "text-rose-600",
    urgent: true
  },
];

const donutData = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "In Progress", value: 30, color: "#f59e0b" },
  { name: "Pending", value: 25, color: "#6366f1" },
];

const todaysTasks = [
  { 
    id: 1, 
    name: "Implement Dashboard Resizing", 
    project: "Antigravity UI Kit", 
    priority: "High", 
    deadline: "2:00 PM", 
    progress: 75,
    status: "In Progress"
  },
  { 
    id: 2, 
    name: "API Integration for Reports", 
    project: "SaaS Platform", 
    priority: "Medium", 
    deadline: "5:30 PM", 
    progress: 30,
    status: "To Do"
  },
  { 
    id: 3, 
    name: "Unit Testing for Auth Module", 
    project: "Internal Tools", 
    priority: "Critical", 
    deadline: "ASAP", 
    progress: 90,
    status: "Review"
  }
];

const recentActivity = [
  { task: "Dashboard Resizing", action: "Logged 2.5 hours", time: "20m ago", icon: Clock },
  { task: "API Integration", action: "Changed status to In Progress", time: "1h ago", icon: RefreshCw },
  { task: "Auth UI", action: "Completed task", time: "4h ago", icon: CheckCircle2 },
  { task: "Bug Fix #412", action: "Started task", time: "Yesterday", icon: Play },
];

const upcomingDeadlines = [
  { task: "Client Presentation Deck", project: "Marketing Site", due: "Tomorrow", urgent: true },
  { task: "Final QA Review", project: "SaaS Platform", due: "21 Apr", urgent: false },
  { task: "Database Migration", project: "Core System", due: "23 Apr", urgent: false },
];

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
    <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center">
      <Layout className="w-10 h-10 text-muted-foreground/40" />
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  </div>
);

export function MemberDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10 p-2 md:p-0">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wide uppercase"
          >
            <Activity className="h-4 w-4" /> Personal Workspace
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
            Welcome back!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            You have <span className="font-bold text-indigo-600 underline">3 tasks</span> requiring immediate attention today.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="h-11 px-6 rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all font-semibold gap-2"
            onClick={() => navigate("/member/tasks")}
          >
            <Play className="h-4 w-4 text-indigo-600" /> Start Task
          </Button>
          <Button 
            variant="outline" 
            className="h-11 px-6 rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all font-semibold gap-2"
            onClick={() => navigate("/member/time")}
          >
            <Timer className="h-4 w-4 text-amber-600" /> Log Time
          </Button>
          <Button 
            className="h-11 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 border-none font-bold transition-all active:scale-95 text-white gap-2"
            onClick={() => navigate("/member/updates")}
          >
            <PenLine className="h-4 w-4" /> Update Status
          </Button>
        </div>
      </div>

      {/* Dynamic Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={s.title} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 pointer-events-none ${s.bg}`} />
                <CardContent className="p-6">
                  <div className={`p-3 rounded-2xl w-fit ${s.bg} ${s.color} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{s.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black tracking-tighter">{s.value}</h3>
                      {s.trend && (
                        <span className={`text-[10px] font-bold ${s.trendUp ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {s.trend}
                        </span>
                      )}
                    </div>
                    {s.urgent && <div className="h-1 w-8 bg-rose-500 rounded-full mt-2 animate-pulse" />}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Visualization */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-lg font-bold">Productivity Mix</CardTitle>
              <CardDescription>Task distribution by status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={donutData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={65} 
                      outerRadius={85} 
                      paddingAngle={8} 
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black">75%</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Rate</span>
                </div>
              </div>
              <div className="space-y-3 w-full mt-2">
                {donutData.map(d => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-bold text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="text-sm font-black">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Deadlines */}
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Upcoming</CardTitle>
                <Badge className="bg-rose-500/10 text-rose-600 border-none font-black text-[10px]">CRITICAL</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((d, i) => (
                <div key={i} className={`group flex items-center gap-4 p-4 rounded-2xl transition-all ${d.urgent ? 'bg-rose-50/50 dark:bg-rose-500/5 hover:bg-rose-100/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${d.urgent ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{d.task}</p>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{d.project}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black ${d.urgent ? 'text-rose-600' : 'text-slate-500'}`}>{d.due}</p>
                  </div>
                </div>
              )) : <EmptyState title="Clear Schedule" description="No major deadlines approaching. Keep it up!" />}
            </CardContent>
          </Card>
        </div>

        {/* Master Task List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-t-4 border-indigo-600">
            <CardHeader className="pb-4 pt-8 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  Today's Execution <Badge className="bg-indigo-600 text-white border-none rounded-lg px-2 h-5 text-[10px]">{todaysTasks.length} Active</Badge>
                </CardTitle>
                <CardDescription className="text-sm font-medium">Prioritized tasks for your current session</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="rounded-xl font-bold text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white transition-all gap-2 px-4" 
                  onClick={() => navigate("/member/tasks")}
                >
                  View Workspace <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-5">
              {todaysTasks.length > 0 ? todaysTasks.map(task => (
                <motion.div 
                  key={task.id} 
                  whileHover={{ x: 4 }}
                  className="p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                        task.priority === 'Critical' ? 'bg-rose-500 text-white shadow-rose-200' : 
                        task.priority === 'High' ? 'bg-amber-500 text-white shadow-amber-200' : 
                        'bg-blue-500 text-white shadow-blue-200'
                      }`}>
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{task.name}</h4>
                          <Badge className={`${
                            task.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                            task.priority === 'High' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          } border-none text-[9px] font-black uppercase px-2`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/60">
                          <span className="flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" /> {task.project}</span>
                          <span className="flex items-center gap-1.5"><Hourglass className="h-3.5 w-3.5" /> Due {task.deadline}</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {task.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Button size="sm" variant="outline" className="rounded-xl h-9 px-4 font-bold border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Action</Button>
                      <Button size="sm" className="rounded-xl h-9 w-9 p-0 bg-indigo-600 shadow-lg shadow-indigo-600/20"><MoreHorizontal className="h-4 w-4 text-white" /></Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">Completion Rate</p>
                      <p className="text-xl font-black text-indigo-600">{task.progress}%</p>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                      />
                    </div>
                  </div>
                </motion.div>
              )) : <EmptyState title="No Active Tasks" description="You've cleared your plate for today! Check back later or view all tasks." />}
              
              <Button 
                variant="ghost" 
                className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-500 hover:text-indigo-600 font-black transition-all group" 
                onClick={() => navigate("/member/tasks")}
              >
                <span className="flex items-center gap-2">Explore All Tasks <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
              </Button>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8">
              <CardTitle className="text-lg font-bold">Pulse Feed</CardTitle>
              <CardDescription>Your recent updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-default">
                  <div className="relative flex flex-col items-center">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-600/20">
                      <item.icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    {i !== recentActivity.length - 1 && <div className="w-0.5 h-8 bg-slate-100 dark:bg-slate-800" />}
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{item.task}</p>
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.action}</p>
                  </div>
                </div>
              )) : <EmptyState title="No Recent Activity" description="Your activity will appear here as you work on tasks." />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


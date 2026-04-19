import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, AlertCircle, Play,
  ListTodo, Timer, RefreshCw, ChevronRight,
  Calendar, Target, ArrowUpRight, PenLine
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const statCards = [];
const donutData = [];
const todaysTasks = [];
const recentActivity = [];
const upcomingDeadlines = [];

export function MemberDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            My Workspace
          </h1>
          <p className="text-muted-foreground mt-1">
            Your assigned tasks, tracked time, and daily execution summary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate("/member/tasks")}>
            <Play className="h-4 w-4" /> Start Task
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate("/member/time")}>
            <Timer className="h-4 w-4" /> Log Time
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl font-bold border-none transition-all active:scale-95" onClick={() => navigate("/member/updates")}>
            <PenLine className="h-4 w-4" /> Update Status
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:bg-card transition-all duration-300">
              <CardContent className="p-5">
                <div className={`p-2.5 rounded-xl w-fit ${s.bg} ${s.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.title}</p>
                <h3 className="text-2xl font-black tracking-tighter mt-1">{s.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Status Donut */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Task Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full mt-4">
              {donutData.map(d => (
                <div key={d.name} className="flex flex-col items-center p-2 rounded-2xl bg-secondary/20">
                  <span className="text-[9px] font-black text-muted-foreground uppercase">{d.name}</span>
                  <span className="text-lg font-black" style={{ color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Today's Active Tasks</CardTitle>
              <CardDescription className="text-xs mt-0.5">Tasks due or in progress today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary font-bold" onClick={() => navigate("/member/tasks")}>
              All Tasks <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {todaysTasks.map(task => (
              <div key={task.id} className="p-4 rounded-2xl bg-secondary/20 border border-secondary/30 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{task.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                      <Target className="h-2.5 w-2.5" /> {task.project}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-rose-500/10 text-rose-600 border-none text-[8px] font-black uppercase">{task.priority}</Badge>
                    <Badge className="bg-amber-500/10 text-amber-600 border-none text-[8px] font-black">Due {task.deadline}</Badge>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                    <span>Progress</span><span className="text-indigo-600">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1.5 rounded-full [&>div]:bg-indigo-600" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full h-10 rounded-2xl border-none bg-secondary/20 text-xs font-bold gap-2" onClick={() => navigate("/member/tasks")}>
              View All My Tasks <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-secondary/20 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <PenLine className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{item.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.action}</p>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground/60 whitespace-nowrap shrink-0">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border ${d.urgent ? 'bg-rose-500/5 border-rose-200/50' : 'bg-secondary/20 border-transparent'}`}>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${d.urgent ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{d.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{d.project}</p>
                </div>
                <Badge className={`shrink-0 border-none text-[8px] font-black ${d.urgent ? 'bg-rose-500/10 text-rose-600' : 'bg-secondary text-muted-foreground'}`}>
                  {d.due}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { 
  Plus, FolderKanban, CheckCircle2, AlertCircle, 
  BarChart3, Users, Filter, RefreshCw, Eye, 
  ArrowUpRight, TrendingUp, Clock, FileBarChart
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Projects", value: "24", icon: FolderKanban, trend: "+2", color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Projects", value: "18", icon: Clock, trend: "+1", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Completed Projects", value: "142", icon: CheckCircle2, trend: "+12", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Delayed Tasks", value: "7", icon: AlertCircle, trend: "-2", color: "text-rose-500", bg: "bg-rose-500/10" },
];

const performanceData = [
  { name: "John Doe", score: 85, projects: 12 },
  { name: "Sarah Smith", score: 92, projects: 15 },
  { name: "Mike Jones", score: 78, projects: 10 },
  { name: "Anna Bell", score: 88, projects: 14 },
  { name: "David Ray", score: 95, projects: 16 },
];

const statusOverview = [
  { month: "Jan", active: 12, completed: 10, delayed: 2 },
  { month: "Feb", active: 15, completed: 12, delayed: 1 },
  { month: "Mar", active: 18, completed: 14, delayed: 3 },
  { month: "Apr", active: 14, completed: 16, delayed: 2 },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Strategic Control Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of workspace performance and system health.
          </p>
        </div>
        
        {/* DASHBOARD BUTTONS (MANDATORY) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm">
            <RefreshCw className="h-4 w-4" /> Refresh Dashboard
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm">
            <Filter className="h-4 w-4" /> Filter Projects
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            onClick={() => navigate("/projects")}
          >
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.color.replace('text', 'bg')} opacity-20`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold">Manager Performance</CardTitle>
              <CardDescription>Average efficiency scores by project manager</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--primary)/0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Area Chart */}
        <Card className="lg:col-span-3 border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Project Trends</CardTitle>
            <CardDescription>Monthly status overview</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statusOverview} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ADMIN DASHBOARD BUTTONS (ADDITIONAL) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/50 transition-all border-dashed shadow-sm">
          <Eye className="h-6 w-6" /> View All Projects
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/50 transition-all border-dashed shadow-sm">
          <Users className="h-6 w-6" /> Assign Manager
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/50 transition-all border-dashed shadow-sm">
          <FileBarChart className="h-6 w-6" /> View Reports
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/50 transition-all border-dashed shadow-sm">
          <BarChart3 className="h-6 w-6" /> View Analytics
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/50 transition-all border-dashed shadow-sm md:col-span-2 lg:col-span-1">
          <TrendingUp className="h-6 w-6" /> Manager Performance
        </Button>
      </div>
    </div>
  );
}

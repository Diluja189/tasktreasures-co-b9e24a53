import { useState } from "react";
import { 
  BarChart3, Download, FileText, TrendingUp, Users, Calendar, 
  UserCircle, RefreshCw, Activity, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Filter, Search, FileDown, LineChart as LineChartIcon
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
import { motion } from "framer-motion";

const efficiencyStats = [
  { label: "Overall Efficiency", value: "88.4%", trend: "+2.4%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Completion Rate", value: "94.2%", trend: "+1.2%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "On-Time Delivery", value: "76.8%", trend: "-0.8%", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Active Project Hours", value: "2,480h", trend: "+124h", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const efficiencyData = [
  { name: "Week 1", estimated: 400, actual: 450, efficiency: 88 },
  { name: "Week 2", estimated: 420, actual: 400, efficiency: 105 },
  { name: "Week 3", estimated: 450, actual: 480, efficiency: 94 },
  { name: "Week 4", estimated: 380, actual: 350, efficiency: 108 },
];

const teamData = [
  { name: "Engineering", efficiency: 92, onTime: 85, delayed: 15 },
  { name: "UI/UX Design", efficiency: 88, onTime: 90, delayed: 10 },
  { name: "DevOps", efficiency: 96, onTime: 98, delayed: 2 },
  { name: "Marketing", efficiency: 75, onTime: 70, delayed: 30 },
];

const delayAnalysis = [
  { name: "Resource Gap", value: 35, color: "#6366f1" },
  { name: "Scope Creep", value: 45, color: "#f43f5e" },
  { name: "Tech Debt", value: 20, color: "#fbbf24" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("efficiency");

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Measuring task efficiency and organizational throughput.</p>
        </div>
        
        {/* REPORT ACTION BUTTONS (MANDATORY) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Refreshing analytics...")}>
            <RefreshCw className="h-4 w-4" /> Refresh Reports
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <LineChartIcon className="h-4 w-4" /> Graph Mode
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* FILTERS SECTION (MANDATORY) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-card/50 backdrop-blur-sm border p-4 rounded-3xl shadow-sm">
        <Select defaultValue="all">
          <SelectTrigger className="rounded-xl border-none bg-secondary/50">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Date Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="may">
          <SelectTrigger className="rounded-xl border-none bg-secondary/50">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Month Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="may">May 2024</SelectItem>
            <SelectItem value="apr">April 2024</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="2024">
          <SelectTrigger className="rounded-xl border-none bg-secondary/50">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Year Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">FY 2024</SelectItem>
            <SelectItem value="2023">FY 2023</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-users">
          <SelectTrigger className="rounded-xl border-none bg-secondary/50">
            <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="User Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-users">All Members</SelectItem>
            <SelectItem value="sarah">Sarah Chen</SelectItem>
            <SelectItem value="james">James Wilson</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="secondary" className="rounded-xl gap-2 md:col-span-4 lg:col-span-1 border border-primary/10">
          <Filter className="h-4 w-4" /> Apply All Filters
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {efficiencyStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className={`border-none font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Efficiency Chart */}
        <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Efficiency Analysis</CardTitle>
              <CardDescription>(Estimated Time / Actual Time) × 100</CardDescription>
            </div>
            <div className="h-2 w-24 bg-emerald-500 rounded-full animate-pulse" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={efficiencyData}>
                  <defs>
                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="efficiency" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorEff)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Delay Analysis (Pie) */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Delay Root Causes</CardTitle>
            <CardDescription>Primary reasons for project lag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayAnalysis}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {delayAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {delayAnalysis.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-bold text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Graph (MANDATORY) */}
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Organization Performance Graph</CardTitle>
          <CardDescription>Multi-department efficiency vs on-time delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                <Bar dataKey="efficiency" name="Efficiency" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="onTime" name="On-Time %" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-10 mt-6 border-t pt-6">
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase">Target: 90% Efficiency</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase">Target: 85% On-Time</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

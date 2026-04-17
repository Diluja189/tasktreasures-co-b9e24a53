import { useState } from "react";
import { 
  Users, Target, Clock, 
  RefreshCw, Star, Award, 
  Activity, Zap, Filter, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area, Cell, PieChart, Pie 
} from "recharts";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const efficiencyData = [
  { name: "Week 1", actual: 85, estimated: 90 },
  { name: "Week 2", actual: 92, estimated: 88 },
  { name: "Week 3", actual: 78, estimated: 82 },
  { name: "Week 4", actual: 94, estimated: 90 },
];

const teamData = [
  { name: "Engineering", value: 94, color: "#6366f1" },
  { name: "Design", value: 88, color: "#10b981" },
  { name: "Marketing", value: 76, color: "#f59e0b" },
  { name: "Ops", value: 82, color: "#f43f5e" },
];

const stats = [
  { label: "Organization Efficiency", value: "88.4%", trend: "+2.4%", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Resource Utilization", value: "92.1%", trend: "+1.8%", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { label: "SLA Compliance", value: "96.8%", trend: "-0.5%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Idle Capacity", value: "11.6%", trend: "-1.2%", icon: Clock, color: "text-rose-500", bg: "bg-rose-500/10" },
];

export default function PerformancePage() {
  const [filter, setFilter] = useState("Month");

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic">
             Analytical Performance Audit
           </h1>
           <p className="text-muted-foreground mt-1">Throughput optimization and organizational efficiency intelligence.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Audit complete. Data refreshed.")}>
              <RefreshCw className="h-4 w-4" /> Recalculate Audit
           </Button>
           <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold border-none transition-all active:scale-95">
              <Download className="h-4 w-4" /> Export Assessment
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="flex items-center gap-4 w-full">
            <Select value={filter} onValueChange={setFilter}>
               <SelectTrigger className="h-10 rounded-xl border-none bg-background w-full lg:w-48">
                  <SelectValue placeholder="Period" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl shadow-2xl border-none p-1.5">
                  <SelectItem value="Week">Trailing 7 Days</SelectItem>
                  <SelectItem value="Month">Trailing 30 Days</SelectItem>
                  <SelectItem value="Quarter">Quarterly Review</SelectItem>
               </SelectContent>
            </Select>
            <div className="h-10 w-px bg-border/50 hidden lg:block" />
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
               <Badge className="bg-indigo-500/10 text-indigo-600 border-none px-4 py-2 rounded-xl cursor-not-allowed">All Resources</Badge>
               <Badge variant="secondary" className="hover:bg-muted text-muted-foreground px-4 py-2 rounded-xl cursor-default">Internal Only</Badge>
               <Badge variant="secondary" className="hover:bg-muted text-muted-foreground px-4 py-2 rounded-xl cursor-default">Vendor Stream</Badge>
            </div>
         </div>
         <Button variant="secondary" className="h-10 rounded-xl px-6 gap-2 flex-1 lg:flex-none">
            <Filter className="h-4 w-4" /> Deep Filter
         </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {stats.map((stat, i) => (
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
                       <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3">{stat.label}</p>
                       <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
               <div>
                  <CardTitle className="text-xl font-bold">Throughput Analysis: Est vs Actual</CardTitle>
                  <CardDescription>Measured in operational work units over time.</CardDescription>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-indigo-500" /> <span className="text-[10px] uppercase font-bold text-muted-foreground">Actual</span></div>
                  <div className="flex items-center gap-1.5 ml-2"><div className="h-2 w-2 rounded-full bg-secondary" /> <span className="text-[10px] uppercase font-bold text-muted-foreground">Estimated</span></div>
               </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={efficiencyData}>
                        <defs>
                           <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="actual" stroke="#6366f1" fillOpacity={1} fill="url(#colorActual)" strokeWidth={4} />
                        <Area type="monotone" dataKey="estimated" stroke="#ccc" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl flex flex-col">
            <CardHeader className="p-8 pb-2 text-center">
               <CardTitle className="text-xl font-bold">Department Efficiency Distribution</CardTitle>
               <CardDescription>Relative performance across active teams.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col justify-center">
               <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={teamData}
                           cx="50%"
                           cy="50%"
                           innerRadius={65}
                           outerRadius={85}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {teamData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-3 mt-6">
                  {teamData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-xl border border-secondary/20">
                       <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <p className="text-[10px] font-bold truncate max-w-[60px]">{item.name}</p>
                       <span className="text-[10px] font-bold bg-white/50 px-1 rounded ml-auto text-primary">{item.value}%</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

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
    </div>
  );
}

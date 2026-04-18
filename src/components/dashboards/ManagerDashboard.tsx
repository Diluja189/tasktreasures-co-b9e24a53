import { motion } from "framer-motion";
import {
  Plus, LayoutDashboard, CheckCircle2, AlertCircle,
  Users, Clock, ArrowUpRight,
  TrendingUp, FileText, UserPlus,
  TimerOff, PieChart, ListTodo,
  TrendingDown, Star, Search,
  ChevronRight, ArrowRight, Share2, Download, Activity
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
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const stats = [
  { title: "Assigned Projects", value: "05", icon: LayoutDashboard, color: "text-violet-600",  bg: "bg-violet-50",  trend: "+2 this month",     alert: false },
  { title: "Total Tasks",       value: "48", icon: ListTodo,         color: "text-blue-600",    bg: "bg-blue-50",    trend: "12 pending",         alert: false },
  { title: "In Progress",       value: "18", icon: Clock,            color: "text-amber-600",   bg: "bg-amber-50",   trend: "8 on priority",      alert: false },
  { title: "Completed Tasks",   value: "24", icon: CheckCircle2,     color: "text-emerald-600", bg: "bg-emerald-50", trend: "92% success rate",   alert: false },
  { title: "Overdue Tasks",     value: "06", icon: AlertCircle,      color: "text-rose-600",    bg: "bg-rose-50",    trend: "Action needed",      alert: true  },
  { title: "Team Members",      value: "12", icon: Users,            color: "text-indigo-600",  bg: "bg-indigo-50",  trend: "All active",         alert: false },
];

const statusDistribution = [
  { name: "Completed",  value: 24, color: "#10b981" },
  { name: "In Progress",value: 18, color: "#8b5cf6" },
  { name: "Pending",    value: 4,  color: "#f59e0b" },
  { name: "Overdue",    value: 6,  color: "#f43f5e" },
];

const teamEfficiencyAuditData = [
  { name: "Alex R.",    actual: 95,  estimated: 90 },
  { name: "Jessica L.", actual: 100, estimated: 95 },
  { name: "James W.",   actual: 60,  estimated: 85 },
  { name: "Emily D.",   actual: 70,  estimated: 85 },
  { name: "Michael K.", actual: 40,  estimated: 80 },
  { name: "Sarah C.",   actual: 80,  estimated: 95 },
];

const performanceData = [
  { name: "Alex Richardson", role: "Developer", assigned: 12, completed: 11, pending: 1, status: "Good",    project: "Cloud Migration"        },
  { name: "Jessica Lane",    role: "Designer",  assigned: 8,  completed: 8,  pending: 0, status: "Good",    project: "SaaS Dashboard"         },
  { name: "Sarah Chen",      role: "Manager",   assigned: 5,  completed: 4,  pending: 1, status: "Good",    project: "Enterprise Suite"       },
  { name: "James Wilson",    role: "Tester",    assigned: 15, completed: 9,  pending: 6, status: "Average", project: "Cloud Migration"        },
  { name: "Michael Kim",     role: "Developer", assigned: 10, completed: 4,  pending: 6, status: "Poor",    project: "SaaS Dashboard"         },
  { name: "Emily Davis",     role: "Designer",  assigned: 10, completed: 7,  pending: 3, status: "Average", project: "Security Infrastructure"},
];

const statusBadge = (s: string) => ({
  Good:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Average: "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
  Poor:    "bg-rose-50    text-rose-700    ring-1 ring-rose-200",
}[s] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200");

/* â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function ManagerDashboard() {
  const navigate = useNavigate();
  const [searchTerm,   setSearchTerm]   = useState("");
  const [roleFilter,   setRoleFilter]   = useState("all");

  const filteredData = useMemo(() =>
    performanceData.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole   = roleFilter === "all" || p.role.toLowerCase() === roleFilter;
      return matchSearch && matchRole;
    }),
  [searchTerm, roleFilter]);

  return (
    /* â”€â”€ Outer shell: 32px padding, light-gray bg handled by index.css --background var */
    <div className="min-h-full px-8 py-8 space-y-6 max-w-[1440px] mx-auto">

      {/* â•â• HEADER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="flex items-center justify-between gap-6">
        {/* Left: title only */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x:  0  }}
          className="flex-1 min-w-0"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-snug">
            Manager&nbsp;<span className="text-primary">Command Center</span>
          </h1>
        </motion.div>

        {/* Right: action button group */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x:  0 }}
          className="flex items-center gap-2 shrink-0"
        >
          {[
            { label: "Add Task",      Icon: Plus,     path: "/manager/tasks",       variant: "outline" as const },
            { label: "Assign Member", Icon: UserPlus, path: "/manager/assignments", variant: "outline" as const },
          ].map(({ label, Icon, path, variant }) => (
            <Button
              key={label}
              variant={variant}
              onClick={() => navigate(path)}
              className="h-10 gap-1.5 px-4 text-sm font-semibold border-border/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary rounded-lg transition-all"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
          <Button
            onClick={() => navigate("/manager/reports")}
            className="h-10 gap-1.5 px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <FileText className="h-4 w-4" />
            Submit Report
          </Button>
        </motion.div>
      </div>

      {/* â•â• KPI CARDS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: i * 0.04 }}
            className="h-full"
          >
            <Card className="h-full border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl bg-white overflow-hidden group cursor-default">
              <CardContent className="flex flex-col p-5 h-full">
                {/* Icon chip */}
                <div className={`p-2.5 rounded-lg w-fit ${stat.bg} ${stat.color} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                </div>
                {/* Label */}
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70 leading-none mb-2">
                  {stat.title}
                </p>
                {/* Value */}
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground leading-none mb-3">
                  {stat.value}
                </h3>
                {/* Trend pill â€” sits at the same baseline in every card */}
                <div className="mt-auto flex items-center gap-1">
                  {stat.alert
                    ? <AlertCircle className="h-3 w-3 text-rose-500 shrink-0" />
                    : <TrendingUp  className="h-3 w-3 text-emerald-500 shrink-0" />
                  }
                  <span className="text-[10px] font-semibold text-muted-foreground/70 truncate">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* â•â• CHARTS ROW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* â”€â”€ Donut: Task Status Distribution â”€â”€ */}
        <Card className="flex flex-col border border-border/40 shadow-sm rounded-xl bg-white overflow-hidden" style={{ minHeight: 420 }}>
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <PieChart className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold leading-none">Task Status Distribution</CardTitle>
                <CardDescription className="text-[11px] mt-0.5">Visual compliance across task states</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col px-6 pb-6 pt-4">
            {/* Chart */}
            <div className="relative flex-1" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%" cy="50%"
                    innerRadius={62} outerRadius={88}
                    paddingAngle={6}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "8px 14px", fontSize: 11, fontWeight: 700 }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              {/* Centre label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold tracking-tight leading-none">48</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            {/* Legend grid â€” 2 Ã— 2, equal width */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              {statusDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50/60 hover:bg-gray-100/60 transition-colors">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-semibold text-muted-foreground flex-1 truncate">{item.name}</span>
                  <span className="text-[10px] font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ Bar: Team Efficiency Audit â”€â”€ */}
        <Card className="flex flex-col border border-border/40 shadow-sm rounded-xl bg-white overflow-hidden" style={{ minHeight: 420 }}>
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold leading-none">Team Efficiency Audit</CardTitle>
                <CardDescription className="text-[11px] mt-0.5">Expected vs. Actual performance comparison</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col px-6 pb-6 pt-4">
            <div className="flex-1" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamEfficiencyAuditData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    fontSize={10} fontWeight={600} tickLine={false} axisLine={false}
                    tick={{ fill: "#94a3b8" }} dy={8}
                  />
                  <YAxis
                    fontSize={10} fontWeight={600} tickLine={false} axisLine={false}
                    tick={{ fill: "#94a3b8" }} domain={[0, 110]} tickCount={6}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 11, fontWeight: 700 }}
                  />
                  <Bar dataKey="actual"    name="Actual"    fill="hsl(var(--primary))" radius={[4,4,0,0]} barSize={18} />
                  <Bar dataKey="estimated" name="Target"    fill="#e2e8f0"              radius={[4,4,0,0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-5">
              {[
                { color: "hsl(var(--primary))", label: "Actual Performance" },
                { color: "#e2e8f0",             label: "Target Benchmark"  },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* â•â• TEAM PERFORMANCE TABLE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <Card className="border border-border/40 shadow-sm rounded-xl bg-white overflow-hidden">
        {/* Table header with controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div>
            <h2 className="text-base font-bold text-foreground">Team Performance Audit</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Real-time individual accountability tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search member..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-52 text-sm rounded-lg bg-gray-50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/30 font-medium"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 w-28 text-[11px] rounded-lg bg-gray-50 border-border/40 font-semibold uppercase tracking-wide">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl text-sm">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="tester">Tester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 bg-gray-50/40">
                {["Member",  "Role",  "Load (A / C / P)",  "Efficiency",  "Health"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap ${
                      i === 2 || i === 3 ? "text-center" : i === 4 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredData.map(member => {
                const eff = Math.round((member.completed / member.assigned) * 100);
                const effColor = eff > 80 ? "text-emerald-600" : eff >= 50 ? "text-amber-600" : "text-rose-600";
                const barColor  = eff > 80 ? "bg-emerald-500"   : eff >= 50 ? "bg-amber-500"   : "bg-rose-500";
                const dotColor  = member.status === "Good" ? "bg-emerald-500" : member.status === "Average" ? "bg-amber-500" : "bg-rose-500";
                return (
                  <tr key={member.name} className="hover:bg-primary/[0.018] transition-colors group">
                    {/* Member */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${dotColor}`} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-sm font-semibold leading-tight group-hover:text-primary transition-colors truncate">
                            {member.name}
                          </span>
                          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-widest truncate">
                            {member.project}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 rounded-md border-border/50 text-muted-foreground">
                        {member.role}
                      </Badge>
                    </td>
                    {/* Load */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                        <span className="text-muted-foreground">{member.assigned}</span>
                        <ArrowRight className="h-3 w-3 text-border" />
                        <span className="text-primary">{member.completed}</span>
                        <ArrowRight className="h-3 w-3 text-border" />
                        <span className="text-amber-500">{member.pending}</span>
                      </span>
                    </td>
                    {/* Efficiency */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex flex-col items-center gap-1.5 w-20">
                        <span className={`text-sm font-extrabold ${effColor}`}>{eff}%</span>
                        <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${eff}%` }} />
                        </div>
                      </div>
                    </td>
                    {/* Health */}
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/30 bg-gray-50/30">
          <span className="text-[10px] font-medium text-muted-foreground">
            Showing {filteredData.length} of {performanceData.length} members
          </span>
          <Button variant="ghost" size="sm" className="text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg gap-1.5 h-8 uppercase tracking-wider group">
            Detailed Audit
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </Card>

      {/* â•â• STRATEGIC OVERLAYS â€” 4-card row â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* â”€â”€ 1. Prime Talent widget â”€â”€ */}
        <Card className="border-none shadow-md bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-700 text-white rounded-xl overflow-hidden relative group">
          <div className="absolute -top-4 -right-4 h-20 w-20 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <CardContent className="relative z-10 p-4 flex flex-col gap-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[0.14em] text-white/50 uppercase">Prime Talent</span>
              <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300 shrink-0" />
            </div>

            {/* Avatar + identity */}
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 border-2 border-white/25 shadow-md shrink-0">
                <AvatarFallback className="bg-white text-purple-700 text-[11px] font-black">JL</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-tight truncate">Jessica Lane</p>
                <p className="text-[10px] text-white/55 font-medium truncate">Design Specialist</p>
              </div>
            </div>

            {/* KPI chips */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Efficiency", value: "100%" },
                { label: "Tasks",      value: "8 / 8" },
              ].map(k => (
                <div key={k.label} className="bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/10">
                  <p className="text-[8px] font-bold tracking-widest text-white/45 uppercase">{k.label}</p>
                  <p className="text-[13px] font-extrabold leading-tight">{k.value}</p>
                </div>
              ))}
            </div>

            {/* Action row */}
            <div className="flex items-center gap-1.5">
              <Button size="sm" className="flex-1 h-7 text-[11px] bg-white text-purple-700 hover:bg-white/90 rounded-lg font-bold shadow-sm gap-1 active:scale-95">
                View <ChevronRight className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg border-white/20 bg-white/10 text-white hover:bg-white/20 shrink-0">
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ 2. System Vigilance â”€â”€ */}
        <Card className="border-none shadow-md bg-slate-900 text-white rounded-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none select-none">
            <Activity className="h-28 w-28" />
          </div>
          <CardContent className="relative z-10 p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <AlertCircle className="h-3 w-3 text-indigo-400" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-none">System Vigilance</p>
                <p className="text-[10px] text-indigo-300/60 mt-0.5">Performance triggers</p>
              </div>
            </div>

            {/* Alerts */}
            {[
              { title: "Critical Delays",  sub: "6 tasks overshot",         icon: TimerOff,    color: "text-rose-400",   bg: "bg-rose-400/10",   border: "border-rose-400/20"   },
              { title: "Anomaly Detected", sub: "Michael Kim âˆ’35%",         icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
            ].map((alert, i) => (
              <motion.div
                key={alert.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border ${alert.border} cursor-pointer hover:bg-white/10 transition-colors group/a`}
              >
                <div className={`h-7 w-7 rounded-lg ${alert.bg} flex items-center justify-center shrink-0`}>
                  <alert.icon className={`h-3 w-3 ${alert.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold leading-none truncate">{alert.title}</p>
                  <p className="text-[9px] text-white/40 mt-0.5 truncate">{alert.sub}</p>
                </div>
                <ArrowUpRight className="h-3 w-3 text-white/20 group-hover/a:text-white transition-colors shrink-0" />
              </motion.div>
            ))}

            <Button variant="ghost" className="w-full h-7 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 rounded-lg uppercase tracking-widest">
              View All Logs
            </Button>
          </CardContent>
        </Card>

        {/* â”€â”€ 3. Intervention Required â”€â”€ */}
        <Card className="border border-rose-100 shadow-sm bg-rose-50 rounded-xl overflow-hidden">
          <CardContent className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-widest text-rose-400 uppercase">Intervention</span>
              <span className="ml-auto inline-block h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-rose-200 text-rose-700 text-[11px] font-black">MK</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-rose-600 border-2 border-white rounded-md flex items-center justify-center">
                  <TrendingDown className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-rose-950 leading-tight truncate">Michael Kim</p>
                <p className="text-[10px] font-semibold text-rose-500 truncate">40% Efficiency â€” Poor</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold rounded-lg border-rose-200 text-rose-700 hover:bg-rose-100">
                Warn
              </Button>
              <Button size="sm" className="h-7 text-[10px] font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
                Reassign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* â”€â”€ 4. Export Report â”€â”€ */}
        <Card
          className="border border-dashed border-border/50 shadow-none bg-white rounded-xl hover:border-primary/30 hover:bg-primary/[0.015] transition-all cursor-pointer group/e"
          onClick={() => {}}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover/e:bg-primary/10 group-hover/e:scale-110 transition-all">
              <Download className="h-4.5 w-4.5 text-muted-foreground group-hover/e:text-primary" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-tight">Executive PDF</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Full audit report</p>
            </div>
            <Button size="sm" variant="outline" className="h-7 px-3 text-[10px] font-bold rounded-lg border-border/50 text-primary hover:bg-primary/5 gap-1 w-full">
              Generate <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

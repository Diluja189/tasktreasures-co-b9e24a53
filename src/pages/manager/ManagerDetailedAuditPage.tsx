import { useState, useMemo } from "react";
import { 
  ArrowLeft, Search, Filter, Download, 
  ArrowUpRight, Users, CheckCircle2, 
  AlertCircle, Clock, Trash2, 
  MoreVertical, ChevronRight,
  TrendingDown, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AuditMember {
  id: string;
  name: string;
  role: string;
  project: string;
  assigned: number;
  completed: number;
  delayed: number;
  status: 'Good' | 'Average' | 'Poor';
  lastActive: string;
}

const auditData: AuditMember[] = [
  { id: "M1", name: "Alex Richardson", role: "Developer", project: "Cloud Migration", assigned: 12, completed: 8, delayed: 4, status: "Poor", lastActive: "2m ago" },
  { id: "M9", name: "Priya Sharma", role: "Designer", project: "System Overhaul", assigned: 15, completed: 15, delayed: 0, status: "Good", lastActive: "Just now" },
  { id: "M2", name: "Jessica Lane", role: "Designer", project: "SaaS Dashboard", assigned: 8, completed: 8, delayed: 0, status: "Good", lastActive: "10m ago" },
  { id: "M3", name: "Sarah Chen", role: "Manager", project: "Enterprise Suite", assigned: 5, completed: 4, delayed: 0, status: "Good", lastActive: "1h ago" },
  { id: "M4", name: "James Wilson", role: "Tester", project: "Cloud Migration", assigned: 15, completed: 9, delayed: 6, status: "Average", lastActive: "4h ago" },
  { id: "M5", name: "Michael Kim", role: "Developer", project: "SaaS Dashboard", assigned: 10, completed: 4, delayed: 6, status: "Poor", lastActive: "1d ago" },
  { id: "M6", name: "Emily Davis", role: "Designer", project: "Security Infrastructure", assigned: 10, completed: 7, delayed: 3, status: "Average", lastActive: "2h ago" },
  { id: "M7", name: "David Kim", role: "Developer", project: "Cloud Migration", assigned: 9, completed: 9, delayed: 0, status: "Good", lastActive: "5m ago" },
  { id: "M8", name: "Sophia Lopez", role: "Designer", project: "Enterprise Suite", assigned: 12, completed: 10, delayed: 2, status: "Good", lastActive: "15m ago" },
];

export default function ManagerDetailedAuditPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = useMemo(() => {
    return auditData.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.project.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || m.role.toLowerCase() === roleFilter;
      const matchesStatus = statusFilter === "all" || m.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const statsSummary = useMemo(() => {
    const total = auditData.length;
    const totalAssigned = auditData.reduce((acc, m) => acc + m.assigned, 0);
    const totalCompleted = auditData.reduce((acc, m) => acc + m.completed, 0);
    const avgEfficiency = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;
    const criticalAnomalies = auditData.filter(m => (m.completed / m.assigned) * 100 < 50).length;

    return { total, avgEfficiency, criticalAnomalies };
  }, []);

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating detailed performance export...',
        success: 'Audit report exported successfully.',
        error: 'Export failed.',
      }
    );
  };

  const statusColors = {
    Good: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Average: "bg-amber-50 text-amber-700 border-amber-100",
    Poor: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 px-6 pt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5 px-2">
              Performance Systems
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Comprehensive Performance Audit</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold text-xs h-10 gap-2 border-border/60" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export Results
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Audited", value: statsSummary.total.toString().padStart(2, '0'), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg Efficiency", value: `${statsSummary.avgEfficiency}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Critical Anomalies", value: statsSummary.criticalAnomalies.toString().padStart(2, '0'), icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Audit Confidence", value: "High", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 flex items-center gap-4">
               <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                 <stat.icon className={cn("h-5 w-5", stat.color)} />
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Section */}
      <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-border/40 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or project..." 
              className="pl-10 h-11 rounded-xl border-border/50 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11 w-40 rounded-xl bg-white border-border/50 font-bold text-xs uppercase tracking-tight">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="tester">Tester</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-40 rounded-xl bg-white border-border/50 font-bold text-xs uppercase tracking-tight">
                <SelectValue placeholder="All Health" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-border/30">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Member Name</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Completed Tasks</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Pending</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Overdue</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Efficiency %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredData.length > 0 ? (
                filteredData.map((member) => (
                    <motion.tr 
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">{member.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-slate-200 text-slate-500 font-bold uppercase">{member.role}</Badge>
                               <span className="text-[9px] text-slate-400 font-medium truncate">{member.project}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-bold text-emerald-600">{member.completed}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-bold text-amber-500">{member.assigned - member.completed - member.delayed}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-bold text-rose-600">{member.delayed}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center gap-2">
                               <span className={cn(
                                 "text-xs font-black",
                                 (member.assigned > 0 ? Math.round((member.completed / member.assigned) * 100) : 0) >= 85 ? "text-emerald-600" : (member.assigned > 0 ? Math.round((member.completed / member.assigned) * 100) : 0) >= 60 ? "text-amber-600" : "text-rose-600"
                               )}>{(member.assigned > 0 ? Math.round((member.completed / member.assigned) * 100) : 0)}%</span>
                               {(member.assigned > 0 ? Math.round((member.completed / member.assigned) * 100) : 0) >= 85 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-rose-500" />}
                            </div>
                         </div>
                      </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                       <Search className="h-10 w-10 mb-4 text-slate-300" />
                       <p className="text-lg font-bold">No results matched your audit</p>
                       <p className="text-sm">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-border/30 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {filteredData.length} active nodes in current audit cycle</p>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest">Previous</Button>
               <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest">Next</Button>
            </div>
        </div>
      </Card>
    </div>
  );
}

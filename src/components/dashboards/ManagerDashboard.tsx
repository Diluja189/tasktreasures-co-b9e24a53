import { motion } from "framer-motion";
import { Plus, FolderKanban, CheckSquare, Users, 
  BarChart3, RefreshCw, Filter, ListChecks,
  Clock, ArrowUpRight, CheckCircle2, MoreHorizontal
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const taskProgress = [
  { name: "In Progress", value: 45, color: "#6366f1" },
  { name: "Completed", value: 35, color: "#10b981" },
  { name: "Delayed", value: 20, color: "#f43f5e" },
];

const efficiencyData = [
  { day: "Mon", efficiency: 82 },
  { day: "Tue", efficiency: 90 },
  { day: "Wed", efficiency: 85 },
  { day: "Thu", efficiency: 88 },
  { day: "Fri", efficiency: 92 },
];

const teams = [
  { name: "Design Team", score: 94, avatar: "DT" },
  { name: "Frontend", score: 88, avatar: "FE" },
  { name: "Backend", score: 91, avatar: "BE" },
];

export function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Execution Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assigned projects and team performance.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-sm">
            <RefreshCw className="h-4 w-4" /> Refresh Data
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            onClick={() => navigate("/tasks")}
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Overview */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Task Progress</CardTitle>
            <CardDescription>Real-time status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {taskProgress.map(p => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs text-muted-foreground">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Chart */}
        <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Team Efficiency</CardTitle>
              <CardDescription>Estimated vs Actual time performance (%)</CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">
              Avg 88%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'hsl(var(--primary)/0.05)'}} />
                  <Bar dataKey="efficiency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Projects */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assigned Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold group-hover:text-indigo-600 transition-colors">SaaS Platform v{i}.0</span>
                    <Badge variant="outline" className="text-[10px] uppercase">Active</Badge>
                  </div>
                  <Progress value={i === 1 ? 65 : 40} className="h-1.5" />
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-indigo-600 hover:bg-indigo-500/10 gap-2 mt-2">
                Open All Projects <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Team Performance</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {teams.map((team) => (
                <div key={team.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {team.avatar}
                    </div>
                    <span className="text-sm font-medium">{team.name}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{team.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-full flex-col gap-2 rounded-2xl hover:bg-indigo-500/10 hover:text-indigo-600 border-dashed transition-all">
            <Users className="h-5 w-5" /> Assign Team
          </Button>
          <Button variant="outline" className="h-full flex-col gap-2 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-600 border-dashed transition-all">
            <BarChart3 className="h-5 w-5" /> View Reports
          </Button>
          <Button variant="outline" className="h-full flex-col gap-2 rounded-2xl hover:bg-blue-500/10 hover:text-blue-600 border-dashed transition-all col-span-2">
            <Filter className="h-5 w-5" /> Filter Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}

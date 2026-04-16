import { motion } from "framer-motion";
import { 
  Play, Pause, CheckCircle2, AlertCircle, 
  Clock, Calendar, FileText, AlertTriangle,
  ArrowRight, Timer, PlayCircle, Info, FolderKanban
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const myTasks = [
  { 
    id: 1, 
    title: "Design System Implementation", 
    project: "Project Phoenix", 
    deadline: "2024-05-20", 
    status: "In Progress", 
    color: "yellow",
    progress: 65,
    estTime: "12h"
  },
  { 
    id: 2, 
    title: "API Integration - Checkout", 
    project: "E-Commerce App", 
    deadline: "2024-05-18", 
    status: "Delayed", 
    color: "red",
    progress: 40,
    estTime: "8h"
  },
  { 
    id: 3, 
    title: "User Acceptance Testing", 
    project: "SaaS Platform", 
    deadline: "2024-05-25", 
    status: "On-Time", 
    color: "green",
    progress: 10,
    estTime: "16h"
  },
];

const statusColors = {
  green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  yellow: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  red: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const dotColors = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

export function UserDashboard() {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Task Execution
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your tasks, time, and performance metrics.
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl px-6 py-3 flex items-center gap-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Timer className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Current Timer</p>
              <p className="text-lg font-mono font-bold font-display">02:45:12</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-all">
            <Pause className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Task Summary */}
        <Card className="lg:col-span-8 border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Assigned Tasks</CardTitle>
              <CardDescription>Tasks requiring your immediate attention</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="rounded-full">All Tasks</Badge>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none">3 Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-0 md:px-6">
            <div className="space-y-4 pt-2">
              {myTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${dotColors[task.color as keyof typeof dotColors]}`} />
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition-colors">{task.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <FolderKanban className="h-3 w-3" /> {task.project}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                          <Clock className="h-3 w-3" /> Est: {task.estTime}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3 w-3" /> Due: {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                    <Badge variant="outline" className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${statusColors[task.color as keyof typeof statusColors]}`}>
                      {task.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary">
                        <Info className="h-3 w-3" /> Details
                      </Button>
                      <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all">
                        <PlayCircle className="h-3 w-3" /> Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary to-indigo-700 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Timer className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white justify-between rounded-xl h-11 backdrop-blur-sm group">
                Report Issue <AlertTriangle className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white justify-between rounded-xl h-11 backdrop-blur-sm group">
                Request Feedback <MessageSquare className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="w-full bg-white text-primary hover:bg-primary-foreground/90 justify-between rounded-xl h-11 shadow-lg font-bold group">
                Complete Daily Log <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Your Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <p className="text-sm font-medium">Checkout Integration</p>
                </div>
                <span className="text-xs font-bold text-rose-600">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <p className="text-sm font-medium">Design Feedback</p>
                </div>
                <span className="text-xs font-bold text-amber-600">In 3 Days</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Support Icons
const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

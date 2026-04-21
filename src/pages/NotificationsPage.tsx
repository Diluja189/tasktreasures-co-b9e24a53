import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, CheckSquare, FolderKanban, MessageSquare, AlertTriangle, 
  UserPlus, UserMinus, ShieldAlert, Clock, Calendar, 
  AlertCircle, ShieldCheck, UserCog, Link as LinkIcon,
  CheckCheck, ListFilter, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type NotificationType = "tasks" | "managers" | "alerts" | "members";
type Priority = "high" | "medium" | "low";

interface Notification {
  id: string;
  type: NotificationType;
  priority: Priority;
  icon: any;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  link: string;
}

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    const generateNotifications = () => {
      const generated: Notification[] = [];
      const tasksStr = localStorage.getItem("app_tasks_persistence");
      const projectsStr = localStorage.getItem("app_projects_persistence");
      const reportsStr = localStorage.getItem("app_status_reports_persistence");
      
      const tasks = tasksStr ? JSON.parse(tasksStr) : [];
      const projects = projectsStr ? JSON.parse(projectsStr) : [];
      const reports = reportsStr ? JSON.parse(reportsStr) : [];

      // 1. Analyze Delayed Tasks
      const delayedTasks = tasks.filter((t: any) => {
        const isOverdue = t.status !== "Completed" && t.deadline && new Date(t.deadline) < new Date();
        return t.status === "Delayed" || isOverdue;
      });
      delayedTasks.forEach((t: any, idx: number) => {
        generated.push({
          id: `alert-${t.id}-${idx}`,
          type: "alerts",
          priority: "high",
          icon: AlertTriangle,
          message: `Task delayed: "${t.name}" in project ${t.project}. Immediate intervention required.`,
          time: "Just now",
          timestamp: new Date(),
          read: false,
          link: "/manager/tasks"
        });
      });

      // 2. Analyze Completed Tasks
      const completedTasks = tasks.filter((t: any) => t.status === "Completed").slice(0, 5);
      completedTasks.forEach((t: any, idx: number) => {
        generated.push({
          id: `task-comp-${t.id}-${idx}`,
          type: "tasks",
          priority: "low",
          icon: CheckCheck,
          message: `Task finalized: "${t.name}" resolved by ${t.assignee || 'team member'}.`,
          time: "Recent",
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          read: false,
          link: "/manager/tracking"
        });
      });

      // 3. Analyze Status Reports
      reports.slice(0, 5).forEach((r: any, idx: number) => {
        generated.push({
          id: `rep-${idx}`,
          type: "managers",
          priority: "medium",
          icon: ShieldCheck,
          message: `Strategic Assessment: Submissions received for project "${r.project}".`,
          time: r.date,
          timestamp: new Date(Date.now() - Math.random() * 10000000),
          read: false,
          link: "/reports"
        });
      });

      // 4. Analytics on Projects
      const newProjects = projects.slice(0, 3);
      newProjects.forEach((p: any, idx: number) => {
        generated.push({
          id: `proj-${p.id}-${idx}`,
          type: "managers",
          priority: "medium",
          icon: FolderKanban,
          message: `Operations starting: Project "${p.name}" initialized under ${p.manager}.`,
          time: p.startDate || "Recent",
          timestamp: new Date(Date.now() - Math.random() * 200000000),
          read: true,
          link: "/projects"
        });
      });

      // Provide system scan notification if no data
      if (generated.length === 0) {
        generated.push({
          id: "sys-1",
          type: "alerts",
          priority: "low",
          icon: ShieldAlert,
          message: "System scan complete. All modules are currently stable. No immediate alerts.",
          time: "Just now",
          timestamp: new Date(),
          read: false,
          link: "/"
        });
      }

      setNotifications(generated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    generateNotifications();
    window.addEventListener("storage", generateNotifications);
    return () => window.removeEventListener("storage", generateNotifications);
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const highPriorityCount = useMemo(() => notifications.filter(n => n.priority === 'high' && !n.read).length, [notifications]);

  const handleNotificationClick = (n: Notification) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    navigate(n.link);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    toast.success("All system alerts marked as read");
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    return n.type.toLowerCase() === activeFilter.toLowerCase();
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const filters = ["All", "Tasks", "Managers", "Alerts"];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-8 px-6">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Bell className="h-5 w-5 text-white animate-pulse" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">
                Notifications
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-secondary/10 rounded-2xl border border-secondary/5 backdrop-blur-md flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest leading-none mb-1">Unread Alerts</span>
              <span className="text-xl font-black text-indigo-500">{unreadCount}</span>
           </div>
           <div className="px-4 py-2 bg-rose-500/5 rounded-2xl border border-rose-500/10 backdrop-blur-md flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-rose-500/50 tracking-widest leading-none mb-1">High Priority</span>
              <span className="text-xl font-black text-rose-500">{highPriorityCount}</span>
           </div>
        </div>
      </div>

      {/* Compact Right-Aligned Toolbar */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3 bg-secondary/5 p-1.5 rounded-2xl border border-secondary/10 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            {filters.map(filter => (
              <Button
                key={filter}
                variant="ghost"
                onClick={() => setActiveFilter(filter)}
                className={`h-7 rounded-xl px-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === filter 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                    : "hover:bg-secondary/20 text-muted-foreground"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
          
          <div className="w-px h-4 bg-border/50 mx-1" />

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="h-3 w-3" /> Mark All Read
          </Button>
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="relative">
         <div className="absolute -left-20 top-20 opacity-10 pointer-events-none rotate-90">
            <Zap size={240} className="text-indigo-500" />
         </div>

         <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden min-h-[300px]">
            <ScrollArea className="h-[400px] w-full">
               <div className="p-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {sortedNotifications.length > 0 ? (
                      sortedNotifications.map((n, i) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          className={`group relative flex items-start gap-4 p-3.5 rounded-2xl border border-transparent transition-all cursor-pointer ${
                            !n.read 
                              ? "bg-indigo-500/[0.03] border-indigo-500/10 shadow-sm" 
                              : "hover:bg-slate-500/[0.02]"
                          }`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 group-hover:rotate-6 ${
                            n.priority === 'high' 
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-xl shadow-rose-500/5" 
                              : n.priority === 'medium'
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                              : "bg-slate-500/5 border-slate-500/10 text-slate-400"
                          }`}>
                            <n.icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-4 mb-1">
                               <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                     n.type === 'alerts' ? 'text-amber-500' : 
                                     'text-indigo-500/70'
                                  }`}>
                                     {n.type}
                                  </span>
                                  <span className="text-[10px] font-black text-muted-foreground/30">•</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/50 tracking-tight flex items-center gap-1.5">
                                     <Clock className="h-3 w-3" /> {n.time}
                                  </span>
                               </div>
                               {!n.read && (
                                  <div className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/10">
                                     <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                                     <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">New Update</span>
                                  </div>
                               )}
                            </div>
                            
                            <h3 className={`text-[13.5px] leading-[1.4] tracking-tight ${!n.read ? "font-black text-foreground/90" : "font-semibold text-muted-foreground/80"}`}>
                               {n.message}
                            </h3>
                          </div>

                          <div className="mt-2" />

                          {/* Invisible left-side emphasis bar for unread */}
                          {!n.read && (
                            <div className="absolute left-0 top-6 bottom-6 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="h-24 w-24 rounded-[2rem] bg-indigo-500/5 flex items-center justify-center mb-6 relative">
                           <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-500/10 animate-ping opacity-20" />
                           <ShieldCheck className="h-10 w-10 text-indigo-500/40" />
                        </div>
                        <h3 className="font-black text-lg uppercase tracking-widest text-foreground/80">System Optimized</h3>
                        <p className="text-xs text-muted-foreground font-semibold max-w-xs mx-auto mt-2 leading-relaxed">
                           No urgent notifications found for the current filter. Your workspace is currently stable.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </ScrollArea>
         </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

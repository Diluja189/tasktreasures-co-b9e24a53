import { useState, useMemo } from "react";
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

type NotificationType = "tasks" | "managers" | "alerts" | "security" | "members";
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

const initialNotifications: Notification[] = [
  { 
    id: "1", 
    type: "tasks", 
    priority: "high", 
    icon: AlertCircle, 
    message: "Critical: Task 'Payment Gateway Integration' is 2 days overdue", 
    time: "5m ago", 
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false, 
    link: "/tasks" 
  },
  { 
    id: "2", 
    type: "alerts", 
    priority: "high", 
    icon: AlertTriangle, 
    message: "Project 'HealthGuard v2' delay detected - critical milestone missed", 
    time: "15m ago", 
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false, 
    link: "/projects" 
  },
  { 
    id: "3", 
    type: "security", 
    priority: "high", 
    icon: ShieldAlert, 
    message: "Suspicious login attempt detected from unknown IP (192.168.1.105)", 
    time: "45m ago", 
    timestamp: new Date(Date.now() - 45 * 60000),
    read: false, 
    link: "/audit-logs" 
  },
  { 
    id: "4", 
    type: "tasks", 
    priority: "medium", 
    icon: Clock, 
    message: "Deadline approaching: 'UI/UX Final Audit' due in 4 hours", 
    time: "2h ago", 
    timestamp: new Date(Date.now() - 120 * 60000),
    read: false, 
    link: "/tasks" 
  },
  { 
    id: "5", 
    type: "alerts", 
    priority: "medium", 
    icon: UserCog, 
    message: "Manager Overload: Sarah Chen is currently managing 8 projects", 
    time: "3h ago", 
    timestamp: new Date(Date.now() - 180 * 60000),
    read: false, 
    link: "/managers" 
  },
  { 
    id: "6", 
    type: "managers", 
    priority: "low", 
    icon: UserPlus, 
    message: "New Manager 'Robert Fox' successfully onboarded to Engineering", 
    time: "5h ago", 
    timestamp: new Date(Date.now() - 300 * 60000),
    read: true, 
    link: "/managers" 
  },
  { 
    id: "7", 
    type: "tasks", 
    priority: "low", 
    icon: CheckSquare, 
    message: "Task 'Database Schema Update' completed by Mike Jones", 
    time: "8h ago", 
    timestamp: new Date(Date.now() - 480 * 60000),
    read: true, 
    link: "/tasks" 
  },
  { 
    id: "8", 
    type: "members", 
    priority: "low", 
    icon: ShieldCheck, 
    message: "Access level updated for Team Member 'Alex Rivera' to Senior Dev", 
    time: "1d ago", 
    timestamp: new Date(Date.now() - 1440 * 60000),
    read: true, 
    link: "/users" 
  },
  { 
    id: "9", 
    type: "alerts", 
    priority: "low", 
    icon: LinkIcon, 
    message: "Unassigned tasks found in 'Cloud Migration' project (3 tasks)", 
    time: "1d ago", 
    timestamp: new Date(Date.now() - 1500 * 60000),
    read: true, 
    link: "/tasks" 
  },
];

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<string>("All");

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

  const filters = ["All", "Tasks", "Managers", "Alerts", "Security"];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-10 px-6">
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

         <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden min-h-[500px]">
            <ScrollArea className="h-[650px] w-full">
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
                                     n.type === 'security' ? 'text-rose-500' : 
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

                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 mt-2">
                             <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40">
                                <LinkIcon className="h-4 w-4" />
                             </div>
                          </div>

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

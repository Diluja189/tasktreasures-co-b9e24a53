import { useState } from "react";
import { 
  Bell, ShieldCheck, MessageSquare, AlertTriangle, 
  Search, Filter, CheckCircle2, Trash2, ArrowUpRight,
  MoreVertical, Calendar, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AppNotification, NotificationType } from "@/components/layout/NotificationDropdown";

const initialNotifications: AppNotification[] = [
  { id: "1", type: "admin", title: "New Project Assigned", message: "Admin assigned you a new project: Cloud Migration.", project: "Cloud Migration", timestamp: "5 mins ago", read: false },
  { id: "2", type: "admin", title: "New Task Assigned", message: "Admin assigned a new task: OAuth Integration.", project: "Security Infrastructure", timestamp: "1 hour ago", read: false },
  { id: "3", type: "team", title: "Task Completed", message: "Sarah Chen completed the task: Legacy DB Indexing Audit.", project: "Cloud Migration", timestamp: "2 hours ago", read: true },
  { id: "4", type: "team", title: "Task Delayed", message: "Mike Chen marked the task UI Polish as delayed.", project: "SaaS Dashboard", timestamp: "3 hours ago", read: false },
  { id: "5", type: "alert", title: "Overdue Tasks", message: "2 tasks are overdue in SaaS Dashboard.", project: "SaaS Dashboard", timestamp: "Yesterday", read: false },
  { id: "6", type: "team", title: "New Comment", message: "David Kim commented on S3 Bucket Setup.", project: "Cloud Migration", timestamp: "Yesterday", read: true },
  { id: "7", type: "alert", title: "Deadline Approaching", message: "Target date for UI Polish is in 24 hours.", project: "SaaS Dashboard", timestamp: "2 days ago", read: true },
  { id: "8", type: "admin", title: "Priority Escalation", message: "Admin escalated Security Infrastructure to Critical.", project: "Security Infrastructure", timestamp: "2 days ago", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [search, setSearch] = useState("");

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || n.type === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.message.toLowerCase().includes(search.toLowerCase()) ||
                          n.project.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification removed.");
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'admin': return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
      case 'team': return <MessageSquare className="h-5 w-5 text-emerald-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 px-6 pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Intelligence Stream</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Real-time alerts and strategic updates for the manager dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-border/60" onClick={markAllRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/60 text-rose-500 hover:bg-rose-50" onClick={() => setNotifications([])}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters and Search */}
        <div className="w-full lg:w-64 space-y-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Filter alerts..." 
              className="pl-10 rounded-xl border-border/50 h-11 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-border/40 bg-slate-50/50">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stream Filter</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {(['all', 'admin', 'team', 'alert'] as const).map((f) => (
                  <Button
                    key={f}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 rounded-lg text-xs font-bold capitalize px-3",
                      filter === f ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => setFilter(f)}
                  >
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      f === 'all' ? "bg-slate-300" : 
                      f === 'admin' ? "bg-indigo-500" : 
                      f === 'team' ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    {f} Updates
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className={cn(
                    "rounded-[1.2rem] border-border/50 shadow-sm transition-all hover:shadow-md cursor-pointer group",
                    !n.read ? "bg-white ring-1 ring-indigo-100" : "bg-slate-50/50 border-dashed"
                  )} onClick={() => markAsRead(n.id)}>
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border",
                          n.type === 'admin' ? "bg-indigo-50 border-indigo-100" : 
                          n.type === 'team' ? "bg-emerald-50 border-emerald-100" : 
                          "bg-rose-50 border-rose-100"
                        )}>
                          {getTypeIcon(n.type)}
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={cn("text-base font-bold tracking-tight mb-0.5", !n.read ? "text-slate-900" : "text-slate-600")}>
                                {n.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Badge variant="outline" className="text-[8px] h-4 rounded-sm border-slate-200">
                                    {n.project}
                                  </Badge>
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                  <Clock className="h-3 w-3" /> {n.timestamp}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-border/50 p-1.5">
                                <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2 cursor-pointer" onClick={() => markAsRead(n.id)}>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-xs font-bold gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer" onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n.id);
                                }}>
                                  <Trash2 className="h-3.5 w-3.5" /> Delete alert
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="py-32 text-center flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-border/40">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <Bell className="h-8 w-8 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Clear Stream</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">No notifications match your current filter criteria.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

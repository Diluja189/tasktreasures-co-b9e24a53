import { useState } from "react";
import { Bell, CheckCircle2, Clock, AlertTriangle, MessageSquare, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export type NotificationType = 'admin' | 'team' | 'alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  project: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: AppNotification[] = [
  { id: "1", type: "admin", title: "New Project Assigned", message: "Admin assigned you a new project: Cloud Migration.", project: "Cloud Migration", timestamp: "5 mins ago", read: false },
  { id: "2", type: "admin", title: "New Task Assigned", message: "Admin assigned a new task: OAuth Integration.", project: "Security Infrastructure", timestamp: "1 hour ago", read: false },
  { id: "3", type: "team", title: "Task Completed", message: "Sarah Chen completed the task: Legacy DB Indexing Audit.", project: "Cloud Migration", timestamp: "2 hours ago", read: true },
  { id: "4", type: "team", title: "Task Delayed", message: "Mike Chen marked the task UI Polish as delayed.", project: "SaaS Dashboard", timestamp: "3 hours ago", read: false },
  { id: "5", type: "alert", title: "Overdue Tasks", message: "2 tasks are overdue in SaaS Dashboard.", project: "SaaS Dashboard", timestamp: "Yesterday", read: false },
  { id: "6", type: "team", title: "New Comment", message: "David Kim commented on S3 Bucket Setup.", project: "Cloud Migration", timestamp: "Yesterday", read: true },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.type === filter
  );

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'admin': return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
      case 'team': return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden z-50" align="end">
        <div className="p-4 bg-white border-b border-border/50 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Manager Intelligence Stream</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={markAllAsRead}>
            Mark all read
          </Button>
        </div>

        <div className="p-2 flex gap-1 bg-slate-50 border-b border-border/40">
          {(['all', 'admin', 'team', 'alert'] as const).map((f) => (
            <Button
              key={f}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                filter === f 
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:bg-white/50"
              )}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border/30">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 flex gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group relative",
                    !n.read && "bg-indigo-50/30"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                    n.type === 'admin' ? "bg-indigo-50 border-indigo-100" : 
                    n.type === 'team' ? "bg-emerald-50 border-emerald-100" : 
                    "bg-rose-50 border-rose-100"
                  )}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-xs font-bold truncate", !n.read ? "text-slate-900" : "text-slate-600")}>{n.title}</p>
                      <span className="text-[9px] text-muted-foreground font-medium shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="outline" className="text-[8px] h-4 px-1 rounded-sm border-slate-200 text-slate-500 font-bold uppercase tracking-tighter">
                        {n.project}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center flex flex-col items-center justify-center opacity-40">
                 <Bell className="h-8 w-8 mb-4 text-muted-foreground" />
                 <p className="text-sm font-bold italic">No notifications found</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Check back later for updates</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 bg-white border-t border-border/50">
          <Button 
            variant="outline" 
            className="w-full h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 border-border/60 hover:bg-slate-50"
            onClick={() => navigate('/manager/notifications')}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

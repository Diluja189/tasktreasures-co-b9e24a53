import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Building2, Shield,
  BarChart3, Clock, FileText, Bell, Settings, CalendarDays, MessageSquare,
  Upload, Star, Target, Sparkles, Gauge
} from "lucide-react";

const allPages = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, keywords: "home overview" },
  { title: "Projects", url: "/projects", icon: FolderKanban, keywords: "project portfolio" },
  { title: "Tasks", url: "/tasks", icon: CheckSquare, keywords: "task todo" },
  { title: "Users", url: "/users", icon: Users, keywords: "user people" },
  { title: "Departments", url: "/departments", icon: Building2, keywords: "org department team" },
  { title: "Roles", url: "/roles", icon: Shield, keywords: "permission role access" },
  { title: "Reports", url: "/reports", icon: BarChart3, keywords: "analytics report" },
  { title: "Audit Logs", url: "/audit-logs", icon: FileText, keywords: "audit log activity" },
  { title: "Settings", url: "/settings", icon: Settings, keywords: "config setting preference" },
  { title: "Team", url: "/team", icon: Users, keywords: "team roster member" },
  { title: "Timeline", url: "/timeline", icon: CalendarDays, keywords: "timeline gantt calendar" },
  { title: "Approvals", url: "/approvals", icon: Star, keywords: "approve reject review" },
  { title: "Notifications", url: "/notifications", icon: Bell, keywords: "notification alert" },
  { title: "Work Log", url: "/work-log", icon: Clock, keywords: "timesheet hours log" },
  { title: "Files", url: "/files", icon: Upload, keywords: "file upload document" },
  { title: "Feedback", url: "/feedback", icon: MessageSquare, keywords: "feedback review" },
  { title: "OKR Tracking", url: "/okr", icon: Target, keywords: "goal okr objective" },
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles, keywords: "ai prediction insight" },
  { title: "Capacity", url: "/capacity", icon: Gauge, keywords: "capacity workload" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  const handleSelect = (url: string) => {
    navigate(url);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions, or commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {allPages.map((page) => (
            <CommandItem key={page.url} onSelect={() => handleSelect(page.url)} className="gap-2">
              <page.icon className="h-4 w-4 text-muted-foreground" />
              <span>{page.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem className="gap-2">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
            <span>Create New Project</span>
          </CommandItem>
          <CommandItem className="gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <span>Create New Task</span>
          </CommandItem>
          <CommandItem className="gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Log Hours</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

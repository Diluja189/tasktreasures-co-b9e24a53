import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Building2, Shield,
  BarChart3, Clock, FileText, Bell, Settings, ChevronDown, LogOut,
  UserCircle, CalendarDays, MessageSquare, Upload, Star, Zap,
  Target, GitBranch, TrendingUp, Activity, Award, Briefcase,
  PieChart, Layers, Lock, Gauge, AlertTriangle, Cpu, BookOpen,
  Inbox, LayoutGrid, Compass, Package, Workflow, HeartPulse,
  Milestone, Flag, Timer, Sparkles, Globe, Server, DatabaseZap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRole, UserRole } from "@/contexts/RoleContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  icon: any;
  items: NavItem[];
  collapsible?: boolean;
}

const navByRole: Record<UserRole, NavGroup[]> = {
  admin: [
    { label: "Workspace", icon: Compass, items: [
      { title: "Executive Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Activity Feed", url: "/activity-feed", icon: Activity },
    ]},
    { label: "Workforce Management", icon: Users, collapsible: true, items: [
      { title: "User Directory", url: "/users", icon: Users },
      { title: "Organization Chart", url: "/departments", icon: Building2 },
      { title: "Role Governance", url: "/roles", icon: Shield },
      { title: "Capacity Overview", url: "/capacity", icon: Gauge },
    ]},
    { label: "Project Delivery", icon: Package, collapsible: true, items: [
      { title: "Project Portfolio", url: "/projects", icon: FolderKanban },
      { title: "Task Command", url: "/tasks", icon: CheckSquare },
      { title: "Delivery Timeline", url: "/timeline", icon: CalendarDays },
      { title: "OKR Tracking", url: "/okr", icon: Target },
    ]},
    { label: "Analytics Center", icon: PieChart, collapsible: true, items: [
      { title: "Reporting Suite", url: "/reports", icon: BarChart3 },
      { title: "Productivity Heatmap", url: "/heatmap", icon: HeartPulse },
      { title: "AI Insights", url: "/ai-insights", icon: Sparkles, badge: "AI", badgeColor: "bg-accent/20 text-accent" },
    ]},
    { label: "Governance & Security", icon: Lock, collapsible: true, items: [
      { title: "Audit Trail", url: "/audit-logs", icon: FileText },
      { title: "Compliance Center", url: "/compliance", icon: ShieldCheck },
      { title: "Security Policies", url: "/security", icon: Lock },
    ]},
    { label: "Platform Config", icon: Settings, collapsible: true, items: [
      { title: "System Settings", url: "/settings", icon: Settings },
      { title: "Integrations", url: "/integrations", icon: Globe },
      { title: "Notification Rules", url: "/notification-rules", icon: Bell },
    ]},
  ],
  manager: [
    { label: "Command Center", icon: Compass, items: [
      { title: "Performance Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Priority Inbox", url: "/notifications", icon: Inbox, badge: "3", badgeColor: "bg-destructive/20 text-destructive" },
    ]},
    { label: "Delivery Pipeline", icon: Workflow, collapsible: true, items: [
      { title: "Project Portfolio", url: "/projects", icon: FolderKanban },
      { title: "Task Board", url: "/tasks", icon: CheckSquare },
      { title: "Sprint Tracker", url: "/sprints", icon: Zap },
      { title: "Milestone Planner", url: "/milestones", icon: Flag },
      { title: "Delivery Timeline", url: "/timeline", icon: CalendarDays },
    ]},
    { label: "Team Operations", icon: Users, collapsible: true, items: [
      { title: "Team Roster", url: "/team", icon: Users },
      { title: "Capacity Planning", url: "/capacity", icon: Gauge },
      { title: "Workload Balance", url: "/workload", icon: Layers },
      { title: "Approval Workbench", url: "/approvals", icon: Star, badge: "4", badgeColor: "bg-warning/20 text-warning" },
    ]},
    { label: "Insights & Reports", icon: PieChart, collapsible: true, items: [
      { title: "Team Analytics", url: "/reports", icon: BarChart3 },
      { title: "Risk Monitor", url: "/risks", icon: AlertTriangle },
      { title: "AI Predictions", url: "/ai-insights", icon: Sparkles, badge: "AI", badgeColor: "bg-accent/20 text-accent" },
    ]},
  ],
  employee: [
    { label: "My Workspace", icon: Compass, items: [
      { title: "Personal Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Notifications", url: "/notifications", icon: Bell, badge: "5", badgeColor: "bg-destructive/20 text-destructive" },
    ]},
    { label: "My Deliverables", icon: Package, collapsible: true, items: [
      { title: "My Projects", url: "/projects", icon: FolderKanban },
      { title: "Task Workspace", url: "/tasks", icon: CheckSquare },
      { title: "Work Calendar", url: "/timeline", icon: CalendarDays },
    ]},
    { label: "Time & Activity", icon: Clock, collapsible: true, items: [
      { title: "Timesheet Center", url: "/work-log", icon: Timer },
      { title: "Daily Activity Log", url: "/activity-log", icon: Activity },
      { title: "Productivity Stats", url: "/productivity", icon: TrendingUp },
    ]},
    { label: "Growth & Collab", icon: Award, collapsible: true, items: [
      { title: "Files & Docs", url: "/files", icon: Upload },
      { title: "Feedback & Reviews", url: "/feedback", icon: MessageSquare },
      { title: "Learning Tracker", url: "/learning", icon: BookOpen },
      { title: "Goals & OKRs", url: "/okr", icon: Target },
    ]},
  ],
};

const roleLabels: Record<UserRole, string> = { admin: "Administrator", manager: "Team Lead", employee: "Team Member" };
const roleColors: Record<UserRole, string> = {
  admin: "bg-destructive/20 text-destructive",
  manager: "bg-primary/20 text-primary",
  employee: "bg-accent/20 text-accent",
};
const roleIcons: Record<UserRole, string> = { admin: "🔴", manager: "🔵", employee: "🟢" };

function ShieldCheck(props: any) {
  return <Shield {...props} />;
}

function CollapsibleNavGroup({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const location = useLocation();
  const isActiveGroup = group.items.some(item => location.pathname === item.url);
  const [open, setOpen] = useState(isActiveGroup);

  if (collapsed || !group.collapsible) {
    return (
      <SidebarGroup>
        {!collapsed && (
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-muted font-semibold px-3 flex items-center gap-1.5">
            <group.icon className="h-3 w-3" />
            {group.label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item) => (
              <NavMenuItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-muted font-semibold px-3 flex items-center gap-1.5 cursor-pointer hover:text-sidebar-foreground transition-colors">
            <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
            <group.icon className="h-3 w-3" />
            {group.label}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavMenuItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function NavMenuItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150 rounded-lg group"
          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <span className="text-[13px] flex-1">{item.title}</span>
          )}
          {!collapsed && item.badge && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-primary/20 text-primary'}`}>
              {item.badge}
            </span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { currentUser, setRole } = useRole();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const groups = navByRole[currentUser.role];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-sidebar-accent-foreground tracking-tight">ProjectHub</h1>
              <p className="text-[10px] text-sidebar-muted font-medium">Enterprise Platform</p>
            </div>
          </div>
        ) : (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {groups.map((group) => (
          <CollapsibleNavGroup key={group.label} group={group} collapsed={collapsed} />
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full p-2 rounded-xl hover:bg-sidebar-accent transition-all duration-150 group">
              <Avatar className="h-9 w-9 ring-2 ring-sidebar-border group-hover:ring-sidebar-primary/30 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-primary text-xs font-semibold">
                  {currentUser.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-sidebar-muted truncate">{currentUser.department}</p>
                </div>
              )}
              {!collapsed && <ChevronDown className="h-3 w-3 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-64 p-2">
            <div className="px-2 py-2 mb-1">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <Badge variant="outline" className={`text-[10px] mt-1.5 ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Switch Role (Demo)</div>
            {(["admin", "manager", "employee"] as UserRole[]).map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)} className="gap-2 rounded-lg">
                <span className="text-sm">{roleIcons[r]}</span>
                <span className="text-sm">{roleLabels[r]}</span>
                {r === currentUser.role && <span className="ml-auto text-xs text-primary font-bold">✓</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 rounded-lg">
              <UserCircle className="h-3.5 w-3.5" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive rounded-lg">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

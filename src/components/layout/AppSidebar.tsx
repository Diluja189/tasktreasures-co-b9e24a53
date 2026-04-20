import { useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Shield,
  BarChart3, Clock, FileText, Settings, ChevronDown, LogOut,
  UserCircle, Eye, UserPlus, Kanban, Bell, LineChart, History
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRole, UserRole } from "@/contexts/RoleContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navByRole: Record<UserRole, { label: string; items: { title: string; url: string; icon: any }[] }[]> = {
  admin: [
    {
      label: "Management & Personnel", items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Managers", url: "/managers", icon: UserCircle },
        { title: "Projects", url: "/projects", icon: FolderKanban },
        { title: "Assign Manager", url: "/assign-manager", icon: UserPlus },
        { title: "Project Monitoring", url: "/monitoring", icon: Eye },
        { title: "Team Members", url: "/users", icon: Users },
        { title: "Task Overview", url: "/tasks", icon: Kanban },
      ]
    },
    {
      label: "Intelligence & Compliance", items: [
        { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
        { title: "Notifications", url: "/notifications", icon: Bell },
        { title: "Settings", url: "/settings", icon: Settings },
      ]
    },
  ],
  manager: [
    {
      label: "Project Execution", items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "My Projects", url: "/manager/projects", icon: FolderKanban },
        { title: "Task Management", url: "/manager/tasks", icon: CheckSquare },
        { title: "Team Assignment", url: "/manager/assignments", icon: UserPlus },
        { title: "Progress Tracking", url: "/manager/tracking", icon: Kanban },
        { title: "Status Reports", url: "/manager/reports", icon: FileText },
      ]
    },
  ],
  user: [
    {
      label: "My Work", items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "My Tasks", url: "/member/tasks", icon: CheckSquare },
        { title: "Time Tracking", url: "/member/time", icon: Clock },
        { title: "Task Updates", url: "/member/updates", icon: FileText },
      ]
    },
  ],
};

const roleLabels: Record<UserRole, string> = { admin: "Administrator", manager: "Manager", user: "Team Member" };
const roleColors: Record<UserRole, string> = {
  admin: "bg-destructive/20 text-destructive",
  manager: "bg-primary/20 text-primary",
  user: "bg-accent/20 text-accent",
};

export function AppSidebar() {
  const { currentUser, setRole } = useRole();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  
  const displayRole = useMemo((): UserRole => {
    // Admin role is persistent; we only show other views if the user is NOT an admin
    // or if they've explicitly switched their current role via the setRole switcher.
    if (currentUser.role === 'admin') return 'admin';
    
    if (location.pathname.startsWith("/manager")) return "manager";
    if (location.pathname.startsWith("/member")) return "user";
    return currentUser.role;
  }, [location.pathname, currentUser.role]);

  const groups = navByRole[displayRole];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold text-sidebar-accent-foreground">IATS</h1>
              <p className="text-[10px] text-sidebar-muted">Production Tracker</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            {!collapsed && (
              <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/50 px-2 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className={[
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group w-full",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground font-medium",
                          ].join(" ")}
                          activeClassName=""
                        >
                          <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                          {!collapsed && (
                            <span className="text-[13px] leading-none truncate">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                  {currentUser.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium text-sidebar-accent-foreground">{currentUser.name}</p>
                  <p className="text-[10px] text-sidebar-muted">{roleLabels[currentUser.role]}</p>
                </div>
              )}
              {!collapsed && <ChevronDown className="h-3 w-3 text-sidebar-muted" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-64 p-2 shadow-2xl border-none rounded-2xl">
            <div className="px-2 py-1.5 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Switch View Mode</p>
            </div>
            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5" onClick={() => setRole("admin")}>
              <Shield className="h-4 w-4 text-rose-500" /> Admin Access
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5" onClick={() => setRole("manager")}>
              <UserCircle className="h-4 w-4 text-indigo-500" /> Manager Access
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer focus:bg-primary/5" onClick={() => setRole("user")}>
              <Users className="h-4 w-4 text-emerald-500" /> Team Member Access
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="gap-2 text-destructive font-bold focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

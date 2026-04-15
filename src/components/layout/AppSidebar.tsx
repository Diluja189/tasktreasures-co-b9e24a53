import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Building2, Shield,
  BarChart3, Clock, FileText, Bell, Settings, ChevronDown, LogOut,
  UserCircle, CalendarDays, MessageSquare, Upload, Star
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navByRole: Record<UserRole, { label: string; items: { title: string; url: string; icon: any }[] }[]> = {
  admin: [
    { label: "Overview", items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]},
    { label: "Management", items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Departments", url: "/departments", icon: Building2 },
      { title: "Roles & Permissions", url: "/roles", icon: Shield },
    ]},
    { label: "Projects", items: [
      { title: "All Projects", url: "/projects", icon: FolderKanban },
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Audit Logs", url: "/audit-logs", icon: FileText },
    ]},
    { label: "System", items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ]},
  ],
  manager: [
    { label: "Overview", items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]},
    { label: "Project Management", items: [
      { title: "Projects", url: "/projects", icon: FolderKanban },
      { title: "Tasks", url: "/tasks", icon: CheckSquare },
      { title: "Timeline", url: "/timeline", icon: CalendarDays },
    ]},
    { label: "Team", items: [
      { title: "My Team", url: "/team", icon: Users },
      { title: "Approvals", url: "/approvals", icon: Star },
    ]},
    { label: "Insights", items: [
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ]},
  ],
  employee: [
    { label: "Overview", items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]},
    { label: "Work", items: [
      { title: "My Projects", url: "/projects", icon: FolderKanban },
      { title: "My Tasks", url: "/tasks", icon: CheckSquare },
      { title: "Work Log", url: "/work-log", icon: Clock },
    ]},
    { label: "Other", items: [
      { title: "Files", url: "/files", icon: Upload },
      { title: "Feedback", url: "/feedback", icon: MessageSquare },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ]},
  ],
};

const roleLabels: Record<UserRole, string> = { admin: "Administrator", manager: "Manager", employee: "Employee" };
const roleColors: Record<UserRole, string> = {
  admin: "bg-destructive/20 text-destructive",
  manager: "bg-primary/20 text-primary",
  employee: "bg-accent/20 text-accent",
};

export function AppSidebar() {
  const { currentUser } = useRole();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const groups = navByRole[currentUser.role];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold text-sidebar-accent-foreground">ProjectHub</h1>
              <p className="text-[10px] text-sidebar-muted">Enterprise Suite</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-sidebar-muted font-medium">{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200 rounded-xl group relative overflow-hidden"
                        activeClassName="bg-primary/10 text-primary font-bold shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]"
                      >
                        <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        {!collapsed && <span className="text-[13px]">{item.title}</span>}
                        {!collapsed && item.url === location.pathname && (
                          <motion.div 
                            layoutId="active-nav"
                            className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                          />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
          <DropdownMenuContent side="top" align="start" className="w-56 p-1.5">
            <DropdownMenuItem 
              className="gap-2 text-destructive font-medium focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2"
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

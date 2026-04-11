import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Bell, Search, Moon, Sun, Command, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { Badge } from "@/components/ui/badge";

const roleLabels = { admin: "Administrator", manager: "Team Lead", employee: "Team Member" };
const roleColors = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  manager: "bg-primary/10 text-primary border-primary/20",
  employee: "bg-accent/10 text-accent border-accent/20",
};

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/users": "Users",
  "/departments": "Organization",
  "/roles": "Roles",
  "/reports": "Reports",
  "/audit-logs": "Audit Trail",
  "/settings": "Settings",
  "/team": "Team",
  "/timeline": "Timeline",
  "/approvals": "Approvals",
  "/notifications": "Notifications",
  "/work-log": "Timesheet",
  "/files": "Files",
  "/feedback": "Feedback",
  "/capacity": "Capacity",
  "/okr": "OKRs",
  "/heatmap": "Heatmap",
  "/ai-insights": "AI Insights",
  "/compliance": "Compliance",
  "/security": "Security",
  "/integrations": "Integrations",
  "/notification-rules": "Notification Rules",
  "/sprints": "Sprints",
  "/milestones": "Milestones",
  "/workload": "Workload",
  "/risks": "Risks",
  "/activity-log": "Activity Log",
  "/productivity": "Productivity",
  "/learning": "Learning",
  "/activity-feed": "Activity Feed",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useRole();
  const [dark, setDark] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const currentPage = breadcrumbMap[location.pathname] || "Page";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card/60 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                {location.pathname !== "/" && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground font-medium">{currentPage}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-3 py-1.5 transition-colors group"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Search...</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded border">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>

              <Badge variant="outline" className={`text-[10px] font-semibold ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </Badge>

              <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                {dark ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
              </button>

              <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full animate-pulse" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </SidebarProvider>
  );
}

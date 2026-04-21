import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";
import logo from "@/assets/iatt-logo.png";

const roleLabels: Record<string, string> = {
  admin:   "Administrator",
  manager: "Manager",
  user:    "Team Member",
};
const roleColors: Record<string, string> = {
  admin:   "bg-rose-50    text-rose-600   ring-1 ring-rose-200",
  manager: "bg-primary/8  text-primary    ring-1 ring-primary/20",
  user:    "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useRole();
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const toggleDark = () => {
    setDark(d => !d);
    document.documentElement.classList.toggle("dark");
  };

  if (isAuthPage) {
    return <div className="min-h-screen flex bg-white">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full font-body bg-white">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Top navbar ─────────────────────────────────── */}
          <header className="h-[60px] flex items-center justify-between border-b border-border/50 px-6 bg-white/80 backdrop-blur-md sticky top-0 z-30 gap-4">

            {/* Left: Search (Sidebar trigger and duplicate logo removed per request) */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Search bar */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-100/70 rounded-lg px-3 h-9 w-72 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  placeholder="Search project protocols..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/70 font-medium"
                />
              </div>
            </div>

            {/* Right: controls (Role badge removed per request) */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Dark mode */}
              <button
                onClick={toggleDark}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Divider */}
              <div className="h-5 w-px bg-border/60 mx-2" />
            </div>
          </header>

          {/* ── Page content ─────────────────────────────── */}
          <main className="flex-1 overflow-auto bg-[hsl(var(--background))]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

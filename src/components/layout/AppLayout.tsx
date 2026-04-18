import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

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
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Top navbar ─────────────────────────────────── */}
          <header className="h-[60px] flex items-center justify-between border-b border-border/50 px-6 bg-white/80 backdrop-blur-md sticky top-0 z-30 gap-4">

            {/* Left: sidebar trigger + search */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <SidebarTrigger className="shrink-0" />

              {/* Search bar */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-100/70 rounded-lg px-3 h-9 w-72 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/70 font-medium"
                />
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Dark mode */}
              <button
                onClick={toggleDark}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} /> : <Moon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
              </button>

              {/* Notifications */}
              <button
                className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-rose-500 rounded-full" />
              </button>

              {/* Divider */}
              <div className="h-5 w-px bg-border/60 mx-2" />

              {/* Role badge */}
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </span>
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

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const roleLabels = { admin: "Administrator", manager: "Manager", user: "Team Member" };
const roleColors = {
  admin: "bg-destructive/10 text-destructive",
  manager: "bg-primary/10 text-primary",
  user: "bg-accent/10 text-accent",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useRole();
  const [dark, setDark] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex bg-white">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 transition-all focus-within:ring-1 focus-within:ring-primary/30">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input placeholder="Search..." className="bg-transparent text-sm outline-none w-36 lg:w-48 placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </span>
              <button 
                onClick={toggleDark} 
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-destructive rounded-full" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 md:pt-6 overflow-auto animate-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

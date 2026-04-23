import { ReactNode } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "./RoleContext";
import { Link } from "react-router-dom";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { role, setRole } = useRole();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-16 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
            <SidebarTrigger className="text-foreground" />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search fields, crops, agents…" className="pl-9 bg-muted/40 border-transparent focus-visible:bg-background" />
              </div>
            </div>
            <div className="flex-1 md:hidden" />
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center rounded-full border border-border bg-muted/40 p-0.5 text-xs">
                <button
                  onClick={() => setRole("admin")}
                  className={`px-3 py-1 rounded-full transition-smooth ${role === "admin" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground"}`}
                >Admin</button>
                <button
                  onClick={() => setRole("agent")}
                  className={`px-3 py-1 rounded-full transition-smooth ${role === "agent" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground"}`}
                >Agent</button>
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-status-risk animate-pulse-soft" />
              </Button>
              {role === "admin" && (
                <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/fields/new"><Plus className="h-4 w-4 mr-1" />New field</Link>
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 animate-fade-up">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

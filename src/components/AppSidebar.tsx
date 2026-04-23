import { LayoutDashboard, Sprout, Map, Users, Bell, Settings, LogOut, Leaf } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useRole } from "./RoleContext";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, user } = useRole();
  const { pathname } = useLocation();

  const adminItems = [
    { title: "Overview", url: "/", icon: LayoutDashboard },
    { title: "Fields", url: "/fields", icon: Map },
    { title: "Agents", url: "/agents", icon: Users },
    { title: "Activity", url: "/activity", icon: Bell },
  ];
  const agentItems = [
    { title: "My Tasks", url: "/", icon: LayoutDashboard },
    { title: "My Fields", url: "/fields", icon: Sprout },
    { title: "Activity", url: "/activity", icon: Bell },
  ];
  const items = role === "admin" ? adminItems : agentItems;

  const linkCls = (url: string) => {
    const active = pathname === url;
    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-smooth",
      active
        ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-soft"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-glow">
            <Leaf className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-sidebar-foreground">SmartSeason</div>
              <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">Field monitoring</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">
            {role === "admin" ? "Coordinator" : "Field Agent"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={it.url} end className={linkCls(it.url)}>
                      <it.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{it.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={linkCls("/settings")}>
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/login" className={linkCls("/login")}>
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Sign out</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent/60 px-2.5 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-semibold">
              {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm text-sidebar-foreground">{user.name}</div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-semibold mx-auto">
            {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

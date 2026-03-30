import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { toolsList } from "@/lib/tools";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-14">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsList.map((tool) => (
                <SidebarMenuItem key={tool.href}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={tool.href}
                      end
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <tool.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{tool.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/blog"
                    end
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    activeClassName="bg-primary/10 text-primary"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Blog</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

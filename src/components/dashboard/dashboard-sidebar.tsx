"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  Building2,
  Bell,
  Settings,
} from "lucide-react";
import { UserRole } from "@/lib/auth/roles";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  // Visitor Navigation
  // Later this can be extended based on other roles
  const visitorNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Register Business", href: "/dashboard/onboarding", icon: Building2 },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const navigation = role === "visitor" ? visitorNavigation : visitorNavigation; // Fallback for now

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/" className="font-bold text-xl text-primary flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          <span>Business Portal</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* Footer info or extra links can go here */}
      </SidebarFooter>
    </Sidebar>
  );
}

import { redirect } from "next/navigation";
import { getSession, getRole } from "@/lib/auth/session";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UserRole } from "@/lib/auth/roles";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const role = (await getRole()) || "visitor";

  return (
    <SidebarProvider>
      <TooltipProvider>
      <DashboardSidebar role={role as UserRole} />
      <SidebarInset>
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-6 lg:p-8 bg-muted/20 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}

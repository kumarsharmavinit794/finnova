import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground w-64">
                <Search className="h-3.5 w-3.5" />
                <span>Search anything…</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                RS
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

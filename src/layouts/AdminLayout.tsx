import AppSidebar from "@/components/admin/AppSidebar";
import Navbar from "@/components/admin/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

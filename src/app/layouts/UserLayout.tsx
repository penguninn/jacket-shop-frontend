import { UserSidebar } from "./components/client/UserSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useAuthStore } from "@/app/store/auth";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { useState } from "react";

export default function UserLayout() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto min-h-[calc(100vh-140px)] px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <UserSidebarHeader user={user} />
          <UserSidebar />
        </aside>

        {/* MOBILE HEADER & DRAWER */}
        <div className="md:hidden flex items-center gap-4 mb-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <UserSidebarHeader user={user} />
              <UserSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-lg">My Account</span>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-lg h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function UserSidebarHeader({ user }: { user: any }) {
  return (
    <div className="bg-card mb-0">
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <div className="font-medium leading-none">{user?.fullName}</div>
          <span className="text-xs text-muted-foreground">Edit Profile</span>
        </div>
      </div>
    </div>
  )
}

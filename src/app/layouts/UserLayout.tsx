import { UserSidebar } from "./components/client/UserSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useAuthStore } from "@/app/store/auth";
import { Link } from "react-router-dom";

import { Outlet } from "react-router-dom";

export default function UserLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="container mx-auto min-h-[calc(100vh-140px)]">
      <div className="mx-auto grid w-full grid-cols-12 grid-rows-[auto_1fr] px-4 py-8">
        {/* SIDEBAR HEADER - Row 1, Col 1-2 */}
        <div className="col-span-12 md:col-span-2 md:row-start-1">
          <div className="h-ful border-b bg-card">
            <div className="flex items-center gap-3 p-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium leading-none">{user?.fullName}</div>
                <Link
                  to="/user/account/profile"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR NAV - Row 2, Col 1-2 */}
        <aside className="col-span-12 md:col-span-2 md:row-start-2">
          <UserSidebar />
        </aside>

        {/* MAIN CONTENT - Row 1-2 (span 2 rows), Col 3-12 */}
        <main className="col-span-12 md:col-span-10 md:col-start-3 md:row-span-2 md:row-start-1">
          <div className="h-full border-l bg-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

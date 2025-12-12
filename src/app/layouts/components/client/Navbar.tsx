import { Link } from "react-router-dom";
import { Bell, Home, ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { authStore, useAuthStore } from "@/app/store/auth";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/hooks";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: doLogout } = useLogoutMutation();

  const hasRole = (role: string) => {
    return user?.roles?.some((r) => r.name === role) ?? false;
  };

  return (
    <nav className="container mx-auto flex items-center justify-between border-b border-gray-200 px-2 py-4">
      {/* LEFT */}
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="Clothing" className="h-8 w-auto" />
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />

        <Button variant="ghost" size="icon" asChild>
          <Link to="/" aria-label="Home">
            <Home className="h-5 w-5 text-zinc-600" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-zinc-600" />
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link to="/cart" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 text-zinc-600" />
          </Link>
        </Button>

        {/* Auth area */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                <User className="h-5 w-5 text-zinc-600" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/user/account/profile">My account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders">My purchase</Link>
              </DropdownMenuItem>

              {hasRole("ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Management Dashboard</Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  doLogout({
                    token: authStore.getRefresh() || "",
                  })
                }
                className="text-red-600 focus:text-red-700"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="ghost" className="px-2 text-zinc-600">
            <Link to="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

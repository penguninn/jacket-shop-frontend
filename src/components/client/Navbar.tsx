import { Link } from "react-router-dom";
import { Bell, Home, ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { authStore, useAuthStore } from "@/store/auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/hooks/auth";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: doLogout } = useLogoutMutation();

  return (
    <nav className="container mx-auto py-4 flex items-center justify-between border-b border-gray-200 px-2">
      {/* LEFT */}
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="Clothing" className="h-8 w-auto" />
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />

        <Link to="/" aria-label="Home">
          <Home className="w-5 h-5 text-gray-600" />
        </Link>

        <button aria-label="Notifications">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <Link to="/cart" aria-label="Cart">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
        </Link>

        {/* Auth area */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <User className="w-5 h-5 text-gray-600 cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/user/account/profile">My account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders">My purchase</Link>
              </DropdownMenuItem>
              {user.role === "ADMIN" && (
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
          <Button asChild variant="ghost" className="px-2 text-gray-600">
            <Link to="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

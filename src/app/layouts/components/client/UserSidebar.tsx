import { NavLink } from "react-router-dom";
import {
  Bell,
  User,
  CreditCard,
  MapPin,
  Lock,
  ShoppingBag,
  Ticket,
} from "lucide-react";

export function UserSidebar() {
  return (
    <div className="h-full bg-card">
      <div className="space-y-1 p-4 text-sm">
        <Section title="Application" />
        <SidebarItem
          to="/user/account/notifications"
          label="Notifications"
          icon={<Bell className="h-4 w-4" />}
        />

        <Section title="My Account" />
        <SidebarItem
          to="/user/account/profile"
          label="Profile"
          icon={<User className="h-4 w-4" />}
        />
        <SidebarItem
          to="/user/account/payment"
          label="Banks & Cards"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <SidebarItem
          to="/user/account/address"
          label="Addresses"
          icon={<MapPin className="h-4 w-4" />}
        />
        <SidebarItem
          to="/user/account/change-password"
          label="Change Password"
          icon={<Lock className="h-4 w-4" />}
        />
        <Section title="Purchases" />
        <SidebarItem
          to="/user/purchase"
          label="My Purchase"
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <SidebarItem
          to="/user/coupons"
          label="My Vouchers"
          icon={<Ticket className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </div>
  );
}

function SidebarItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-md px-2 py-2",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        ].join(" ")
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

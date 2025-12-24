import {
  Award,
  BadgePercent,
  Home,
  Inbox,
  RotateCcw,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Sparkles,
  Star,
  Tag,
  User,
  Wallet,
  Warehouse,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

const sidebarGroups = [
  {
    label: "Application",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        badge: 24,
      },
    ],
  },
  {
    label: "Orders / Payments",
    items: [
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingBag,
      },
      {
        title: "Sell",
        url: "/dashboard/pos",
        icon: ShoppingCart,
      },
      {
        title: "Returns",
        url: "/dashboard/returns",
        icon: RotateCcw,
      },
      {
        title: "Payment Methods",
        url: "/dashboard/payment-methods",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Catalogs",
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Shirt,
      },
      {
        title: "Inventories",
        url: "/dashboard/inventories",
        icon: Warehouse,
      },
      {
        title: "Brands",
        url: "/dashboard/brands",
        icon: Award,
      },
      {
        title: "Styles",
        url: "/dashboard/styles",
        icon: Sparkles,
      },
      {
        title: "Attributes",
        url: "/dashboard/attributes",
        icon: Sliders,
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: User,
      },
    ],
  },
  {
    label: "Marketings",
    items: [
      {
        title: "Coupons",
        url: "/dashboard/coupons",
        icon: BadgePercent,
      },
      {
        title: "Sales",
        url: "/dashboard/sales",
        icon: Tag,
      },
    ],
  },
  {
    label: "Contents",
    items: [
      {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: Star,
      },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path) && path !== "#";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={false} className="w-full flex justify-center">
              <Link to="/">
                <img src="/logo.png" alt="Clothing" className="w-3/4" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

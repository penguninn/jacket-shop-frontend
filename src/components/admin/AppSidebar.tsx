import {
  Award,
  BadgePercent,
  Home,
  Inbox,
  ReceiptText,
  RotateCcw,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Sliders,
  Sparkles,
  Star,
  Tags,
  Truck,
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
} from "../ui/sidebar";

const sidebarGroups = [
  {
    label: "Application",
    items: [
      {
        title: "Home",
        url: "/admin",
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
    label: "Sales",
    items: [
      {
        title: "Sell",
        url: "/admin/pos/sell",
        icon: ShoppingCart,
      },
      {
        title: "Orders",
        url: "/admin/pos/orders",
        icon: ShoppingBag,
      },
      {
        title: "Returns",
        url: "/admin/pos/returns",
        icon: ReceiptText,
      },
    ],
  },
  {
    label: "Orders / Payments",
    items: [
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingBasket,
      },
      {
        title: "Returns",
        url: "/admin/returns",
        icon: RotateCcw,
      },
      {
        title: "Shipping Methods",
        url: "/admin/shipping-methods",
        icon: Truck,
      },
      {
        title: "Payment Methods",
        url: "/admin/payment-methods",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Catalogs",
    items: [
      {
        title: "Products",
        url: "/admin/products",
        icon: Shirt,
      },
      {
        title: "Inventories",
        url: "/admin/inventories",
        icon: Warehouse,
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: Tags,
      },
      {
        title: "Brands",
        url: "/admin/brands",
        icon: Award,
      },
      {
        title: "Styles",
        url: "/admin/styles",
        icon: Sparkles,
      },
      {
        title: "Attributes",
        url: "/admin/attributes",
        icon: Sliders,
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        icon: User,
      },
    ],
  },
  {
    label: "Marketings",
    items: [
      {
        title: "Coupons",
        url: "/admin/coupons",
        icon: BadgePercent,
      },
    ],
  },
  {
    label: "Contents",
    items: [
      {
        title: "Reviews",
        url: "/admin/reviews",
        icon: Star,
      },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path) && path !== "#";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={false}>
              <Link to="/admin">
                <img src="/logo.png" alt="Clothing" className="w-fit" />
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

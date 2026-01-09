import React, { useEffect } from "react";

import { NavItem } from "@/components/layouts/sidebar/nav-item";
import { Button } from "@/components/ui/button";
import { formatUserDisplayName, getUserInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import {
  FileText,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router";

interface SidebarProps {
  onClose?: () => void;
}

export type Role = "ADMIN" | "AUTHOR";

export interface NavItemConfig {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[]; // Optional: if not provided, defaults to ["ADMIN", "AUTHOR"]
  children?: {
    title: string;
    href: string;
    roles?: Role[]; // Optional: if not provided, inherits from parent or defaults to ["ADMIN", "AUTHOR"]
  }[];
}

const navItems: NavItemConfig[] = [
  {
    title: "Post Management",
    icon: FileText,
    roles: ["ADMIN", "AUTHOR"],
    children: [
      { title: "Posts", href: "/admin/posts" },
      { title: "Categories", href: "/admin/categories" },
    ],
  },
  {
    title: "Product Management",
    icon: Package,
    roles: ["ADMIN"],
    children: [
      { title: "Products", href: "/admin/products" },
      { title: "Materials", href: "/admin/materials" },
      { title: "Types", href: "/admin/types" },
    ],
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Order Management",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["ADMIN"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "AUTHOR"],
  },
];

// Helper function to check if user has access to a route
const hasAccess = (
  userRole: string | undefined,
  allowedRoles?: Role[],
): boolean => {
  if (!userRole) return false;

  // Normalize role to uppercase
  const normalizedRole = userRole.toUpperCase() as Role;

  // If no roles specified, default to ADMIN and AUTHOR (but not USER)
  const roles = allowedRoles || ["ADMIN", "AUTHOR"];

  return roles.includes(normalizedRole);
};

export function Sidebar({ onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const manuallyToggledRef = React.useRef<string | null>(null);
  const authUser = useAuthStore((state) => state.authUser);
  const userRole = authUser?.role as string | undefined;

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Check if user has access to the main item
    if (!hasAccess(userRole, item.roles)) {
      return false;
    }

    // If item has children, check if user has access to at least one child
    if (item.children && item.children.length > 0) {
      const hasAccessibleChild = item.children.some((child) => {
        const childRoles = child.roles || item.roles || ["ADMIN", "AUTHOR"];
        return hasAccess(userRole, childRoles);
      });
      return hasAccessibleChild;
    }

    return true;
  });

  // Auto-open dropdown if one of its children is active
  // Also open Post Management if on /admin/ (index route)
  // Only run when pathname changes, not on every render
  useEffect(() => {
    // Reset manual toggle tracking on pathname change
    manuallyToggledRef.current = null;

    // If on /admin/ index route, open Post Management
    if (pathname === "/admin" || pathname === "/admin/") {
      const postManagement = filteredNavItems.find(
        (item) => item.title === "Post Management",
      );
      if (postManagement) {
        setOpenItem("Post Management");
      }
      return;
    }

    const activeItem = filteredNavItems.find((item) => {
      if (!item.children) return false;
      return item.children.some((child) => pathname === child.href);
    });
    if (activeItem) {
      setOpenItem(activeItem.title);
    } else {
      // If no active item found, close all
      setOpenItem(null);
    }
  }, [pathname]); // Only depend on pathname, not filteredNavItems

  const handleToggle = (title: string) => {
    setOpenItem((prev) => {
      const newValue = prev === title ? null : title;
      // Track which item was manually toggled
      manuallyToggledRef.current = newValue === null ? null : title;
      return newValue;
    });
  };

  return (
    <div className="border-border bg-card fixed top-0 left-0 flex h-screen w-64 flex-col border-r">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">A</span>
          </div>
          <span className="text-lg font-semibold">Admin Panel</span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            pathname={pathname}
            isOpen={openItem === item.title}
            onToggle={() => handleToggle(item.title)}
            userRole={userRole}
          />
        ))}
      </nav>

      {/* Footer */}
      {authUser && (
        <div className="border-border border-t p-4">
          <div className="bg-muted flex items-center gap-3 rounded-lg px-3 py-2">
            {authUser.image ? (
              <img
                src={authUser.image as string}
                alt={formatUserDisplayName(authUser)}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                {getUserInitials(authUser)}
              </div>
            )}
            <div className="flex-1 text-sm">
              <div className="font-medium">
                {formatUserDisplayName(authUser)}
              </div>
              <div className="text-muted-foreground">{authUser.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

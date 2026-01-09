import type { NavItemConfig, Role } from "@/components/layouts/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

interface NavItemProps {
  item: NavItemConfig;
  pathname: string;
  isOpen?: boolean;
  onToggle?: () => void;
  userRole?: string;
}

// Helper function to check if user has access to a child route
const hasChildAccess = (
  userRole: string | undefined,
  childRoles?: Role[],
  parentRoles?: Role[],
): boolean => {
  if (!userRole) return false;

  const normalizedRole = userRole.toUpperCase() as Role;

  // If child has specific roles, use those; otherwise use parent roles; otherwise default to ADMIN and AUTHOR
  const roles = childRoles || parentRoles || ["ADMIN", "AUTHOR"];

  return roles.includes(normalizedRole);
};

export function NavItem({
  item,
  pathname,
  isOpen = false,
  onToggle,
  userRole,
}: NavItemProps) {
  const Icon = item.icon;

  // Filter children based on user role
  const accessibleChildren =
    item.children?.filter((child) =>
      hasChildAccess(userRole, child.roles, item.roles),
    ) || [];

  // Check if any accessible child is active
  // Also check if on /admin/ index route and this is Post Management with Posts child
  const hasActiveChild = accessibleChildren.some((child) => {
    if (pathname === child.href) return true;
    // If on /admin/ index route, highlight Posts
    if (
      (pathname === "/admin" || pathname === "/admin/") &&
      item.title === "Post Management" &&
      child.href === "/admin/posts"
    ) {
      return true;
    }
    return false;
  });
  const isActive = pathname === item.href || hasActiveChild;

  // If item has no children, render as a Link
  if (!item.children) {
    return (
      <Link
        to={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{item.title}</span>
      </Link>
    );
  }

  // If item has children, render as a dropdown
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">{item.title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Child items */}
      {isOpen && accessibleChildren.length > 0 && (
        <div className="mt-1 ml-8 space-y-1">
          {accessibleChildren.map((child) => {
            // Check if child is active, including /admin/ index route for Posts
            const isChildActive =
              pathname === child.href ||
              ((pathname === "/admin" || pathname === "/admin/") &&
                item.title === "Post Management" &&
                child.href === "/admin/posts");
            return (
              <Link
                key={child.href}
                to={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isChildActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

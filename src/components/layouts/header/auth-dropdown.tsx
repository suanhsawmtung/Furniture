import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUserDisplayName, getUserInitials } from "@/lib/utils";
import type { AuthUser } from "@/stores/auth.store";
import {
  ArrowLeftIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import { Form, Link, useLocation, useNavigation } from "react-router";

interface Props {
  user: AuthUser | null;
}

const AuthDropdown = ({ user }: Props) => {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoggingOut = navigation.state === "submitting";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdmin = user?.role === "ADMIN";

  if (!user) {
    return (
      <Link to="/sign-in">
        <Button variant="outline" size="icon" className="cursor-pointer">
          <LogInIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Sign In</span>
        </Button>
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          {user.image ? (
            <AvatarImage
              src={user.image as string}
              alt={formatUserDisplayName(user)}
            />
          ) : null}
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <h5 className="font-bold">{formatUserDisplayName(user)}</h5>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to={isAdminRoute ? "/" : "/admin"}>
              <div className="flex items-center gap-x-2">
                {isAdminRoute ? (
                  <>
                    <ArrowLeftIcon />
                    Back to Website
                  </>
                ) : (
                  <>
                    <LayoutDashboardIcon />
                    Dashboard
                  </>
                )}
              </div>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/admin/settings">
            <div className="flex items-center gap-x-2">
              <SettingsIcon />
              Setting
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Form method="post" action="/logout">
          <DropdownMenuItem asChild>
            <button
              type="submit"
              disabled={isLoggingOut}
              className="w-full cursor-pointer"
            >
              <div className="flex items-center gap-x-2">
                <LogOutIcon />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </div>
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropdown;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatName, getUserRoleVariant, getUserStatusVariant } from "@/lib/utils";
import type { UserType } from "@/types/user.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

// Actions cell component that can use hooks
const ActionsCell = ({ user }: { user: UserType }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <div
          // to={`/${user.username}`}
          className="flex items-center justify-center gap-1 bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
        >
          See Profile
          <ArrowRightIcon size={12} />
        </div>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-7 w-7 rounded-sm border-none bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
        asChild
      >
        <Link to={`/admin/users/${user.username}/edit`}>
          <PencilLineIcon size={16} />
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
        asChild
      >
        <Link to={`/admin/users/${user.username}/delete`}>
          <Trash2Icon size={16} />
        </Link>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<UserType>[] = [
  {
    id: "name",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-start text-sm font-semibold">
          Name
        </div>
      );
    },
    cell: ({ row }) => {
      const userName = formatName({
        firstName: row.original.firstName,
        lastName: row.original.lastName,
        username: row.original.username,
      });
      return (
        <div className="text-muted-foreground text-sm font-semibold">
          {userName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Email
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-center text-sm font-normal">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Phone
        </div>
      );
    },
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {phone || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Role
        </div>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as UserType["role"];
      const roleVariant = getUserRoleVariant(role);
      return (
        <div className="flex items-center justify-center">
          <Badge variant={roleVariant}>{role}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as UserType["status"];
      const statusVariant = getUserStatusVariant(status);
      return (
        <div className="flex items-center justify-center">
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell user={row.original} />;
    },
  },
];

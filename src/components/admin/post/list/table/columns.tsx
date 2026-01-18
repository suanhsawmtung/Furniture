import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatName, getPostStatusVariant } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import type { PostType } from "@/types/post.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { DeletePostDialog } from "../../actions/delete-post-dialog";

// Actions cell component that can use hooks
const ActionsCell = ({ post }: { post: PostType }) => {
  const authUser = useAuthStore((state) => state.authUser);
  const isAuthor = authUser?.id === post.authorId;
  const isAdmin = authUser?.role === "ADMIN";

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/posts/${post.slug}`}
          className="flex items-center justify-center gap-1 bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
        >
          Details
          <ArrowRightIcon size={12} />
        </Link>
      </Button>

      {(isAuthor || isAdmin) && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-sm border-none bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
            asChild
          >
            <Link to={`/admin/posts/${post.slug}/edit`}>
              <PencilLineIcon size={16} />
            </Link>
          </Button>

          <DeletePostDialog post={post}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
              asChild
            >
              <Trash2Icon size={16} />  
            </Button>        
          </DeletePostDialog>
        </>
      )}
    </div>
  );
};

export const columns: ColumnDef<PostType>[] = [
  {
    accessorKey: "title",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-start text-sm font-semibold">
          Title
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-semibold">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    id: "author",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Author
        </div>
      );
    },
    cell: ({ row }) => {
      const authorName = formatName({
        firstName: row.original.author.firstName,
        lastName: row.original.author.lastName,
        username: row.original.author.username,
      });
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {authorName}
        </div>
      );
    },
  },
  {
    id: "category",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Category
        </div>
      );
    },
    cell: ({ row }) => {
      const categoryName = row.original.category.name;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {categoryName}
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
      const status = row.getValue("status") as PostType["status"];
      const statusVariant = getPostStatusVariant(status);
      return (
        <div className="flex items-center justify-center">
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Published Date
        </div>
      );
    },
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as Date | string | null;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {publishedAt ? formatDate(publishedAt) : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell post={row.original} />;
    },
  },
];

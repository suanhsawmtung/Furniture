import { AdminPagination } from "@/components/admin/shared/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PostType } from "@/types/post.type";
import { FilterTags } from "../../shared/filter-tags";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export function PostList({
  posts,
  total,
  page,
}: {
  posts: PostType[];
  total?: number;
  page?: number;
  size?: number;
}) {
  const currentPage = page || 1;
  const totalPages = total || 1;

  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-start gap-2 px-4 md:flex-row md:justify-between md:px-6">
        <CardTitle className="w-full text-lg font-semibold md:w-1/4 md:text-2xl">
          All Posts
        </CardTitle>

        <div className="w-full md:w-3/4">
          <FilterTags allowedFilters={{ search: true, category: true }} />
        </div>
      </CardHeader>

      <CardContent className="min-h-[600px] px-4 md:px-6">
        <DataTable columns={columns} data={posts} />
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="px-4 md:px-6">
          <div className="w-full lg:w-1/2">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/admin/posts"
              className="flex justify-center lg:justify-start"
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

import { PostFilterDialog } from "@/components/admin/post/list/post-filter-dialog";
import { PostList } from "@/components/admin/post/list/posts-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { CreateButton } from "@/components/admin/shared/create-button";
import { FilterBar } from "@/components/admin/shared/filter-bar";
import { MoreFilterButton } from "@/components/admin/shared/more-filter-button";
import { isPostStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/post/api";
import { useListPosts } from "@/services/post/queries/useGetPosts";
import { useSearchParams } from "react-router";

const AdminPostsPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);
  const categoryParam = searchParams.get("category");
  const category =
    typeof categoryParam === "string" && categoryParam.trim().length > 0
      ? categoryParam.trim()
      : undefined;

  const statusParam = searchParams.get("status");
  const status = isPostStatus(statusParam) ? statusParam : undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListPosts({
    offset,
    search,
    limit: DEFAULT_LIMIT,
    category,
    status,
  });

  return (
    <section className="w-full">
      <AdminHeaderSection title="Posts" />

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-2">
            <CreateButton text="Create Post" to="/admin/posts/create" />

            <div className="block sm:hidden">
              <PostFilterDialog>
                <MoreFilterButton />
              </PostFilterDialog>
            </div>
          </div>

          <FilterBar>
            <PostFilterDialog>
              <MoreFilterButton />
            </PostFilterDialog>
          </FilterBar>
        </div>

        {data && (
          <PostList
            posts={data.posts}
            total={data.totalPages}
            page={data.currentPage}
            size={data.pageSize}
          />
        )}

      </div>
    </section>
  );
};

export default AdminPostsPage;

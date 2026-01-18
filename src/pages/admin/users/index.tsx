import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { CreateButton } from "@/components/admin/shared/create-button";
import { FilterBar } from "@/components/admin/shared/filter-bar";
import { MoreFilterButton } from "@/components/admin/shared/more-filter-button";
import { UserFilterDialog } from "@/components/admin/user/list/user-filter-dialog";
import { UsersList } from "@/components/admin/user/list/users-list";
import { isRole, isStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/user/api";
import { useListUsers } from "@/services/user/queries/useGetUsers";
import { Outlet, useSearchParams } from "react-router";

const AdminUsersPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);

  const statusParam = searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;

  const roleParam = searchParams.get("role");
  const role = isRole(roleParam) ? roleParam : undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListUsers({
    offset,
    search,
    limit: DEFAULT_LIMIT,
    status,
    role,
  });

  return (
    <section className="w-full">
      <AdminHeaderSection title="Users" />

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-2">
            <CreateButton
              text="Create User"
              to="/admin/users/create"
            />

            <div className="block sm:hidden">
              <UserFilterDialog>
                <MoreFilterButton />
              </UserFilterDialog>
            </div>
          </div>

          <FilterBar>
            <UserFilterDialog>
              <MoreFilterButton />
            </UserFilterDialog>
          </FilterBar>
        </div>


        {data && (
          <UsersList
            users={data.users}
            total={data.totalPages}
            page={data.currentPage}
            size={data.pageSize}
          />
        )}

        <Outlet />
      </div>
    </section>
  );
};

export default AdminUsersPage;

import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { CreateButton } from "@/components/admin/shared/create-button";
import { FilterBar } from "@/components/admin/shared/filter-bar";
import { MoreFilterButton } from "@/components/admin/shared/more-filter-button";
import { TypeList } from "@/components/admin/type/list/types-list";
import { DEFAULT_LIMIT } from "@/services/type/api";
import { useListTypes } from "@/services/type/queries/useGetListTypes";
import { Outlet, useSearchParams } from "react-router";

const AdminTypesPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListTypes({
    offset,
    search,
    limit: DEFAULT_LIMIT,
  });

  return (
    <section className="w-full">
      <AdminHeaderSection title="Product Types" />

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-2">
            <CreateButton text="Create Type" to="/admin/types/create" />

            <div className="block sm:hidden">
              <MoreFilterButton />
            </div>
          </div>

          <FilterBar>
            <MoreFilterButton />
          </FilterBar>
        </div>

        {data && (
          <TypeList
            types={data.types}
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

export default AdminTypesPage;

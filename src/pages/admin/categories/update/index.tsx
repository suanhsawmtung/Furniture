import { CategoryForm } from "@/components/admin/category/form/category-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useCategory } from "@/services/category/queries/useGetCategory";
import { useNavigate, useParams } from "react-router";

const AdminCategoryEditDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Category slug is required", { status: 400 });
  }

  const { data: category } = useCategory(slug);

  return (
    <DialogWrapper
      title={"Edit Category"}
      close={() => navigate("/admin/categories")}
      onOpenChange={() => navigate("/admin/categories")}
      open={true}
    >
      <CategoryForm category={category} cancelUrl="/admin/categories" />
    </DialogWrapper>
  );
};

export default AdminCategoryEditDialog;

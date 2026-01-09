import { DeleteCategoryDialog } from "@/components/admin/category/actions/delete-category-dialog";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useCategory } from "@/services/category/queries/useGetCategory";
import { useNavigate, useParams } from "react-router";

const AdminCategoryDeleteDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Category slug is required", { status: 400 });
  }

  const { data: category } = useCategory(slug);

  return (
    <DialogWrapper
      title="Delete Category"
      close={() => navigate("/admin/categories")}
      onOpenChange={() => navigate("/admin/categories")}
      open={true}
    >
      <DeleteCategoryDialog category={category} cancelUrl="/admin/categories" />
    </DialogWrapper>
  );
};

export default AdminCategoryDeleteDialog;

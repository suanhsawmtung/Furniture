import { CategoryForm } from "@/components/admin/category/form/category-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useNavigate } from "react-router";

const AdminCategoryCreateDialog = () => {
  const navigate = useNavigate();

  return (
    <DialogWrapper
      title="Create Category"
      close={() => navigate("/admin/categories")}
      onOpenChange={() => navigate("/admin/categories")}
      open={true}
    >
      <CategoryForm cancelUrl="/admin/categories" />
    </DialogWrapper>
  );
};

export default AdminCategoryCreateDialog;

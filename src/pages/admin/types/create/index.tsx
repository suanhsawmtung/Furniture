import { TypeForm } from "@/components/admin/type/form/type-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useNavigate } from "react-router";

const AdminTypeCreateDialog = () => {
  const navigate = useNavigate();

  return (
    <DialogWrapper
      title="Create Type"
      close={() => navigate("/admin/types")}
      onOpenChange={() => navigate("/admin/types")}
      open={true}
    >
      <TypeForm cancelUrl="/admin/types" />
    </DialogWrapper>
  );
};

export default AdminTypeCreateDialog;


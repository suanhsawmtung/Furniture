import { MaterialForm } from "@/components/admin/material/form/material-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useNavigate } from "react-router";

const AdminMaterialCreateDialog = () => {
  const navigate = useNavigate();

  return (
    <DialogWrapper
      title="Create Material"
      close={() => navigate("/admin/materials")}
      onOpenChange={() => navigate("/admin/materials")}
      open={true}
    >
      <MaterialForm cancelUrl="/admin/materials" />
    </DialogWrapper>
  );
};

export default AdminMaterialCreateDialog;


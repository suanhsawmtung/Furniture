import { UserForm } from "@/components/admin/user/form/user-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useNavigate } from "react-router";

const AdminUserCreateDialog = () => {
  const navigate = useNavigate();

  return (
    <DialogWrapper
      title="Create User"
      close={() => navigate("/admin/users")}
      onOpenChange={() => navigate("/admin/users")}
      open={true}
    >
      <UserForm cancelUrl="/admin/users" />
    </DialogWrapper>
  );
};

export default AdminUserCreateDialog;

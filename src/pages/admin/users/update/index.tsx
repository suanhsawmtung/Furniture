import { UserForm } from "@/components/admin/user/form/user-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useGetUser } from "@/services/user/queries/useGetUser";
import { useNavigate, useParams } from "react-router";

const AdminUserEditDialog = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  if (!username) {
    throw new Response("User username is required", { status: 400 });
  }

  const { data: user } = useGetUser(username);

  return (
    <DialogWrapper
      title="Edit User"
      close={() => navigate("/admin/users")}
      onOpenChange={() => navigate("/admin/users")}
      open={true}
    >
      <UserForm user={user} cancelUrl="/admin/users" />
    </DialogWrapper>
  );
};

export default AdminUserEditDialog;

import { DeleteUserDialog } from "@/components/admin/user/actions/delete-user-dialog";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useGetUser } from "@/services/user/queries/useGetUser";
import { useNavigate, useParams } from "react-router";

const AdminUserDeleteDialog = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  if (!username) {
    throw new Response("User username is required", { status: 400 });
  }

  const { data: user } = useGetUser(username);

  return (
    <DialogWrapper
      title="Delete User"
      close={() => navigate("/admin/users")}
      onOpenChange={() => navigate("/admin/users")}
      open={true}
    >
      <DeleteUserDialog user={user} cancelUrl="/admin/users" />
    </DialogWrapper>
  );
};

export default AdminUserDeleteDialog;

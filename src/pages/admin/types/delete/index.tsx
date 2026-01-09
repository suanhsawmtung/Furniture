import { DeleteTypeDialog } from "@/components/admin/type/actions/delete-type-dialog";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useType } from "@/services/type/queries/useGetType";
import { useNavigate, useParams } from "react-router";

const AdminTypeDeleteDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Type slug is required", { status: 400 });
  }

  const { data: type } = useType(slug);

  return (
    <DialogWrapper
      title="Delete Type"
      close={() => navigate("/admin/types")}
      onOpenChange={() => navigate("/admin/types")}
      open={true}
    >
      <DeleteTypeDialog type={type} cancelUrl="/admin/types" />
    </DialogWrapper>
  );
};

export default AdminTypeDeleteDialog;
